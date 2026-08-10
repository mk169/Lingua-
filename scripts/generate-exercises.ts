/**
 * Erzeugt Übungen per Claude und legt sie im Repo ab.
 *
 *   ANTHROPIC_API_KEY=sk-... npm run generate:exercises -- \
 *     --lang it --pattern it-domanda-intonazione --kind all --count 50
 *
 * Der Weg ist bewusst: Skript → Datei im Repo → Diff-Review → main → Pages.
 * Zur Laufzeit erzeugte Inhalte blieben im localStorage eines einzelnen
 * Browsers; was hier entsteht, wird mit der App ausgeliefert und erreicht jeden
 * Besucher – auch ohne Schlüssel.
 *
 * Geschrieben wird `src/data/exercises/<lang>.generated.ts`. Die handgepflegte
 * `<lang>.ts` bleibt unangetastet und hängt die generierten Übungen nur an;
 * so kann das Skript beliebig oft laufen, ohne handgeschriebenes Material zu
 * überschreiben. Vorhandene Aufgaben werden über den normalisierten Prompt
 * erkannt und nicht doppelt erzeugt.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { SEED_LANGUAGES } from '../src/data/seed';
import type { Exercise, ExerciseKind, ExerciseType } from '../src/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODEL = 'claude-opus-5';
const BATCH = 25;
const KINDS: ExerciseKind[] = ['satz', 'konstruktion', 'verstaendnis'];

// ── Argumente ──────────────────────────────────────────────────────────────

function arg(name: string, fallback?: string): string {
  const i = process.argv.indexOf(`--${name}`);
  const value = i >= 0 ? process.argv[i + 1] : undefined;
  if (value === undefined || value.startsWith('--')) {
    if (fallback !== undefined) return fallback;
    fail(`--${name} fehlt.`);
  }
  return value as string;
}

function fail(message: string): never {
  console.error(`✗ ${message}`);
  console.error(
    '\nAufruf: npm run generate:exercises -- --lang it --pattern <slug|all> --kind <satz|konstruktion|verstaendnis|all> --count 50',
  );
  process.exit(1);
}

const langArg = arg('lang', 'it');
const patternArg = arg('pattern', 'all');
const kindArg = arg('kind', 'all');
const count = Number(arg('count', '50'));
const effort = arg('effort', 'high') as 'low' | 'medium' | 'high';

if (!Number.isFinite(count) || count < 1) fail(`--count "${arg('count', '50')}" ist keine Zahl > 0.`);
if (kindArg !== 'all' && !KINDS.includes(kindArg as ExerciseKind)) fail(`--kind "${kindArg}" ist unbekannt.`);

if (!process.env.ANTHROPIC_API_KEY) {
  fail(
    'ANTHROPIC_API_KEY ist nicht gesetzt.\n  Schlüssel anlegen: https://console.anthropic.com/settings/keys\n  Dann: ANTHROPIC_API_KEY=sk-... npm run generate:exercises -- …',
  );
}

// ── Sprache und Muster aus dem Startpaket ──────────────────────────────────

const LANG_BY_CODE: Record<string, string> = {
  it: 'Italienisch',
  es: 'Spanisch',
  fr: 'Französisch',
  pl: 'Polnisch',
};
const langName = LANG_BY_CODE[langArg];
if (!langName) fail(`--lang "${langArg}" kennt das Skript nicht (it, es, fr, pl).`);

const seed = SEED_LANGUAGES.find((l) => l.name === langName);
if (!seed) fail(`Für ${langName} gibt es kein Startpaket in src/data/seed.ts.`);

const patterns = seed.patterns.filter((p) => p.slug && (patternArg === 'all' || p.slug === patternArg));
if (patterns.length === 0) {
  const available = seed.patterns.map((p) => p.slug).filter(Boolean).join(', ') || '(keine mit Slug)';
  fail(`Kein Muster "${patternArg}" in ${langName}. Verfügbar: ${available}`);
}

const kinds = kindArg === 'all' ? KINDS : [kindArg as ExerciseKind];

// ── Vorhandenen Katalog laden ──────────────────────────────────────────────

const catalogPath = resolve(HERE, `../src/data/exercises/${langArg}.ts`);
const generatedPath = resolve(HERE, `../src/data/exercises/${langArg}.generated.ts`);

let existing: Exercise[] = [];
try {
  const mod = (await import(catalogPath)) as { EXERCISES?: Exercise[] };
  existing = mod.EXERCISES ?? [];
} catch {
  console.log(`  Kein vorhandener Katalog für ${langArg}, es wird einer angelegt.`);
}

let generated: Exercise[] = [];
try {
  const mod = (await import(generatedPath)) as { GENERATED?: Exercise[] };
  generated = mod.GENERATED ?? [];
} catch {
  // Erster Lauf – die Datei entsteht gleich.
}

/** Dubletten über den normalisierten Prompt erkennen, nicht über die ID. */
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

const seenPrompts = new Set(existing.map((e) => `${e.patternSlug}|${e.kind}|${norm(e.prompt)}`));
const usedIds = new Set(existing.map((e) => e.id));

function nextIndex(slug: string, kind: ExerciseKind): number {
  const prefix = `${langArg}.${slug.replace(new RegExp(`^${langArg}-`), '')}.${kind}.`;
  let max = 0;
  for (const id of usedIds) {
    if (!id.startsWith(prefix)) continue;
    const n = Number(id.slice(prefix.length));
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}

// ── Claude ─────────────────────────────────────────────────────────────────

// Node-Client: der Schlüssel bleibt auf dieser Maschine. Kein
// `dangerouslyAllowBrowser` – das ist nur für die Browser-Nutzung in der App.
const client = new Anthropic();

const KON_TYPES: ExerciseType[] = ['cloze', 'transform', 'order', 'build'];

const SCHEMAS: Record<ExerciseKind, object> = {
  satz: {
    type: 'object',
    additionalProperties: false,
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['german', 'target'],
          properties: {
            german: { type: 'string', description: 'Der deutsche Satz, den der Lernende übersetzen soll.' },
            target: { type: 'string', description: 'Die korrekte Lösung in der Zielsprache.' },
          },
        },
      },
    },
  },
  konstruktion: {
    type: 'object',
    additionalProperties: false,
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['type', 'prompt', 'answer', 'hint'],
          properties: {
            type: { type: 'string', enum: KON_TYPES },
            prompt: {
              type: 'string',
              description:
                'Die Aufgabe. Bei cloze mit ___ als Lücke. Bei order die Satzteile mit " / " getrennt. Bei transform die Anweisung plus Ausgangssatz. Bei build der deutsche Satz.',
            },
            answer: { type: 'string', description: 'Bei cloze nur das fehlende Wort, sonst der vollständige Satz.' },
            hint: { type: 'string', description: 'Kurzer grammatischer Tipp auf Deutsch, ein Satz.' },
          },
        },
      },
    },
  },
  verstaendnis: {
    type: 'object',
    additionalProperties: false,
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['text', 'question', 'correct', 'wrong1', 'wrong2'],
          properties: {
            text: { type: 'string', description: 'Ein bis zwei Sätze in der Zielsprache.' },
            question: { type: 'string', description: 'Verständnisfrage auf Deutsch.' },
            correct: { type: 'string', description: 'Die richtige Antwort auf Deutsch.' },
            wrong1: { type: 'string', description: 'Plausible, aber falsche Antwort auf Deutsch.' },
            wrong2: { type: 'string', description: 'Zweite plausible, aber falsche Antwort auf Deutsch.' },
          },
        },
      },
    },
  },
};

const TASK: Record<ExerciseKind, string> = {
  satz: 'Schreibe deutsche Sätze, die der Lernende in die Zielsprache übersetzt. Jeder Satz muss das Muster benutzen.',
  konstruktion:
    'Schreibe Konstruktionsübungen zum Muster. Mische die vier Typen ungefähr gleichmäßig: cloze (Lücke ___), order (Satzteile mit " / " getrennt, unsortiert), transform (Umformungsanweisung mit Ausgangssatz), build (deutscher Satz, der gebildet werden soll).',
  verstaendnis:
    'Schreibe Verständnisübungen: ein bis zwei Sätze in der Zielsprache, dazu eine deutsche Frage und drei deutsche Antwortmöglichkeiten. Die falschen Antworten müssen plausibel sein und sich nur durch das Verständnis des Satzes ausschließen lassen.',
};

interface SatzItem { german: string; target: string }
interface KonItem { type: ExerciseType; prompt: string; answer: string; hint: string }
interface VerItem { text: string; question: string; correct: string; wrong1: string; wrong2: string }

async function ask(
  pattern: { slug?: string; title: string; formula: string; explanation: string; examples: [string, string][] },
  kind: ExerciseKind,
  n: number,
  avoid: string[],
): Promise<unknown[]> {
  const system = [
    `Du schreibst Übungsmaterial für eine ${langName}-Lern-App. Muttersprache der Lernenden ist Deutsch, Niveau A1–A2.`,
    'Die Übungen sollen praktisch und alltagstauglich sein: Café, Bahnhof, Hotel, Einkauf, Arbeit, Small Talk.',
    'Verwende nur Wortschatz, den ein Anfänger in den ersten Wochen braucht, und bleibe grammatisch im Präsens, sofern das Muster nichts anderes verlangt.',
    'Jede Lösung muss zweifelsfrei korrekt sein – falsche Lösungen werden von allen Nutzern mitgelernt.',
  ].join(' ');

  const prompt = [
    `Muster: ${pattern.title}`,
    `Formel: ${pattern.formula}`,
    `Erklärung: ${pattern.explanation}`,
    `Beispiele: ${pattern.examples.map(([t, d]) => `${t} (${d})`).join(' · ')}`,
    '',
    `Aufgabe: ${TASK[kind]}`,
    `Erzeuge genau ${n} Einheiten.`,
    avoid.length > 0
      ? `\nDiese Aufgaben gibt es schon, erzeuge etwas anderes:\n${avoid.map((a) => `- ${a}`).join('\n')}`
      : '',
  ].join('\n');

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system,
    messages: [{ role: 'user', content: prompt }],
    output_config: { effort, format: { type: 'json_schema', schema: SCHEMAS[kind] } },
  });

  if (res.stop_reason === 'refusal') throw new Error('Die Anfrage wurde abgelehnt.');
  const text = res.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
  const parsed = JSON.parse(text) as { items?: unknown[] };
  return parsed.items ?? [];
}

/** Verteilt die richtige Antwort deterministisch über die Positionen. */
function rotate<T>(items: T[], by: number): T[] {
  const n = items.length;
  const offset = ((by % n) + n) % n;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

// ── Lauf ───────────────────────────────────────────────────────────────────

let added = 0;

for (const pattern of patterns) {
  const slug = pattern.slug as string;
  for (const kind of kinds) {
    const have = existing.filter((e) => e.patternSlug === slug && e.kind === kind).length;
    const missing = count - have;
    if (missing <= 0) {
      console.log(`  ${slug} · ${kind}: schon ${have}, nichts zu tun.`);
      continue;
    }

    let index = nextIndex(slug, kind);
    let remaining = missing;
    let attempts = 0;

    while (remaining > 0 && attempts < 4) {
      attempts += 1;
      const want = Math.min(remaining, BATCH);
      process.stdout.write(`  ${slug} · ${kind}: frage ${want} an … `);

      const recent = existing
        .filter((e) => e.patternSlug === slug && e.kind === kind)
        .slice(-40)
        .map((e) => e.prompt.replace(/\n/g, ' '));

      let items: unknown[];
      try {
        items = await ask(pattern as never, kind, want, recent);
      } catch (err) {
        console.log('Fehler.');
        console.error(`    ${err instanceof Error ? err.message : String(err)}`);
        break;
      }

      let fresh = 0;
      for (const raw of items) {
        const ex = toExercise(slug, kind, raw, index);
        if (!ex) continue;
        const key = `${slug}|${kind}|${norm(ex.prompt)}`;
        if (seenPrompts.has(key)) continue;
        seenPrompts.add(key);
        usedIds.add(ex.id);
        existing.push(ex);
        generated.push(ex);
        index += 1;
        fresh += 1;
        remaining -= 1;
        added += 1;
        if (remaining === 0) break;
      }
      console.log(`${fresh} neu, ${remaining} offen.`);
      if (fresh === 0) break; // Das Modell wiederholt sich – abbrechen statt endlos fragen.
    }
  }
}

function toExercise(slug: string, kind: ExerciseKind, raw: unknown, index: number): Exercise | null {
  const short = slug.replace(new RegExp(`^${langArg}-`), '');
  const id = `${langArg}.${short}.${kind}.${String(index).padStart(3, '0')}`;
  const base = { id, patternSlug: slug, kind } as const;

  if (kind === 'satz') {
    const it = raw as SatzItem;
    if (!it?.german?.trim() || !it?.target?.trim()) return null;
    return { ...base, type: 'translate', prompt: it.german.trim(), answer: it.target.trim() };
  }
  if (kind === 'konstruktion') {
    const it = raw as KonItem;
    if (!it?.prompt?.trim() || !it?.answer?.trim() || !KON_TYPES.includes(it.type)) return null;
    if (it.type === 'cloze' && !it.prompt.includes('___')) return null;
    if (it.type === 'order' && !it.prompt.includes(' / ')) return null;
    return { ...base, type: it.type, prompt: it.prompt.trim(), answer: it.answer.trim(), hint: it.hint?.trim() };
  }
  const it = raw as VerItem;
  if (!it?.text?.trim() || !it?.question?.trim() || !it?.correct?.trim()) return null;
  const options = [it.correct.trim(), it.wrong1?.trim(), it.wrong2?.trim()].filter(
    (o): o is string => !!o,
  );
  if (new Set(options).size !== options.length || options.length < 2) return null;
  return {
    ...base,
    type: 'choice',
    prompt: `${it.text.trim()}\n\n${it.question.trim()}`,
    answer: it.correct.trim(),
    options: rotate(options, index),
  };
}

// ── Schreiben ──────────────────────────────────────────────────────────────

if (added === 0) {
  console.log('\nNichts hinzugefügt.');
  process.exit(0);
}

generated.sort((a, b) => a.id.localeCompare(b.id));

const body = generated
  .map((e) => `  ${JSON.stringify(e, ['id', 'patternSlug', 'kind', 'type', 'prompt', 'answer', 'options', 'hint'])},`)
  .join('\n');

const file = `/**
 * Von \`npm run generate:exercises\` erzeugt – nicht von Hand bearbeiten.
 * Handgeschriebenes Material gehört in ${langArg}.ts.
 *
 * Vor dem Deploy: Diff lesen. Jede Lösung hier wird von allen Nutzern gelernt.
 */

import type { Exercise } from '../../types';

export const GENERATED: Exercise[] = [
${body}
];
`;

mkdirSync(dirname(generatedPath), { recursive: true });
writeFileSync(generatedPath, file, 'utf8');

console.log(`\n✓ ${added} neue Übungen in src/data/exercises/${langArg}.generated.ts.`);
console.log('  Jetzt: npm run validate:exercises, dann den Diff durchsehen.');
