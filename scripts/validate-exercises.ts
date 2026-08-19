/**
 * Qualitätstor für den Übungskatalog.
 *
 * Läuft in der CI vor dem Build: Eine Übung mit fehlender Lösung oder falschem
 * Muster-Bezug würde sonst live gehen und von jedem Nutzer mitgelernt.
 *
 *   npm run validate:exercises
 */

import { EXERCISES as IT_A1_SETTIMANA1 } from '../src/data/exercises/it';
import { EXERCISES_A1 as IT_A1 } from '../src/data/exercises/it.a1';
import { EXERCISES_A2 as IT_A2 } from '../src/data/exercises/it.a2';
import { EXERCISES_B1 as IT_B1 } from '../src/data/exercises/it.b1';
import { EXERCISES_B2 as IT_B2 } from '../src/data/exercises/it.b2';
import { EXERCISES as ES } from '../src/data/exercises/es';
import { EXERCISES as FR } from '../src/data/exercises/fr';
import { EXERCISES as PL } from '../src/data/exercises/pl';
import { EXERCISES as PT } from '../src/data/exercises/pt';
import { SEED_LANGUAGES } from '../src/data/seed';
import type { Exercise } from '../src/types';

// Vollständig halten: Ein hier fehlender Katalog geht ungeprüft live.
// Italienisch liegt in einem Modul pro Stufe, wird hier aber als ein Katalog
// geprüft: Doppelte IDs und doppelte Aufgaben sollen auch dann auffallen,
// wenn sie über zwei Dateien verteilt sind.
const IT: Exercise[] = [...IT_A1_SETTIMANA1, ...IT_A1, ...IT_A2, ...IT_B1, ...IT_B2];

const CATALOGS: { file: string; exercises: Exercise[] }[] = [
  { file: 'src/data/exercises/it*.ts', exercises: IT },
  { file: 'src/data/exercises/es.ts', exercises: ES },
  { file: 'src/data/exercises/fr.ts', exercises: FR },
  { file: 'src/data/exercises/pl.ts', exercises: PL },
  { file: 'src/data/exercises/pt.ts', exercises: PT },
];

const KNOWN_SLUGS = new Set(
  SEED_LANGUAGES.flatMap((l) => l.patterns.map((p) => p.slug).filter((s): s is string => !!s)),
);

const KINDS = new Set(['satz', 'konstruktion', 'verstaendnis', 'wortschatz']);
const LEVELS = new Set(['A1', 'A2', 'B1', 'B2']);
const TYPES = new Set(['cloze', 'transform', 'order', 'build', 'choice', 'translate']);

/** Für den Dublettencheck: Groß-/Kleinschreibung und Whitespace ignorieren. */
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Wörter einer Order-Aufgabe, vergleichbar sortiert. Satzzeichen fallen weg,
 * das Apostroph bleibt als eigenes Zeichen stehen: "l’autobus" wird sonst je
 * nach Zeile mal als ein, mal als zwei Teile gezählt.
 */
function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[.,!?;:«»"]/g, ' ')
    .replace(/’/g, '’ ')
    .split(/\s+/)
    .filter(Boolean)
    .sort();
}

const problems: string[] = [];

for (const { file, exercises } of CATALOGS) {
  const seenIds = new Set<string>();
  const seenPrompts = new Map<string, string>();

  const fail = (ex: Exercise, msg: string) => problems.push(`${file} · ${ex.id}: ${msg}`);

  for (const ex of exercises) {
    if (!ex.id) {
      problems.push(`${file}: Übung ohne ID (prompt: ${ex.prompt?.slice(0, 40) ?? '—'})`);
      continue;
    }
    if (seenIds.has(ex.id)) fail(ex, 'doppelte ID');
    seenIds.add(ex.id);

    if (!ex.prompt?.trim()) fail(ex, 'prompt fehlt');
    if (!ex.answer?.trim()) fail(ex, 'answer fehlt');

    // Grammatik hängt am Muster, Wortschatz an der Stufe – nie an beidem und
    // nie an keinem, sonst weiß die App nicht, wo die Übung hingehört.
    if (ex.patternSlug && ex.level) fail(ex, 'patternSlug und level gleichzeitig gesetzt');
    if (!ex.patternSlug && !ex.level) fail(ex, 'weder patternSlug noch level gesetzt');
    if (ex.patternSlug && !KNOWN_SLUGS.has(ex.patternSlug)) {
      fail(ex, `patternSlug "${ex.patternSlug}" kommt in src/data/seed.ts nicht vor`);
    }
    if (ex.level && !LEVELS.has(ex.level)) fail(ex, `unbekannte Stufe "${ex.level}"`);
    if (ex.kind === 'wortschatz' && !ex.level) fail(ex, 'wortschatz braucht level');
    if (ex.kind !== 'wortschatz' && !ex.patternSlug) fail(ex, `${ex.kind} braucht patternSlug`);
    if (!KINDS.has(ex.kind)) fail(ex, `unbekannte Kategorie "${ex.kind}"`);
    if (!TYPES.has(ex.type)) fail(ex, `unbekannter Typ "${ex.type}"`);

    // Prompts nur innerhalb desselben Musters vergleichen – "Non capisco."
    // darf in zwei Mustern vorkommen, aber nicht zweimal im selben.
    const key = `${ex.patternSlug ?? ex.level}|${ex.kind}|${norm(ex.prompt ?? '')}`;
    const twin = seenPrompts.get(key);
    if (twin) fail(ex, `gleiche Aufgabe wie ${twin}`);
    else seenPrompts.set(key, ex.id);

    if (ex.type === 'choice') {
      if (!ex.options || ex.options.length < 2) fail(ex, 'choice braucht mindestens 2 Optionen');
      else {
        if (!ex.options.includes(ex.answer)) fail(ex, 'answer ist keine der options');
        if (new Set(ex.options).size !== ex.options.length) fail(ex, 'doppelte Optionen');
      }
    } else if (ex.options) {
      fail(ex, `options nur bei choice erlaubt (type: ${ex.type})`);
    }

    if (ex.type === 'cloze' && !ex.prompt.includes('___')) fail(ex, 'cloze ohne Lücke (___)');
    if (ex.type === 'order') {
      if (!ex.prompt.includes(' / ')) fail(ex, 'order ohne " / " zwischen den Teilen');
      // Aus den vorgegebenen Teilen muss sich genau die Lösung legen lassen.
      // Ein überzähliges oder fehlendes Wort macht die Aufgabe unlösbar, fällt
      // aber beim Lesen kaum auf – im Diff sieht man nur zwei ähnliche Zeilen.
      else {
        const teile = tokens(ex.prompt.split(' / ').join(' '));
        const loesung = tokens(ex.answer);
        if (teile.join('|') !== loesung.join('|')) {
          fail(ex, `Teile ergeben nicht die Lösung (${teile.join(' ')} ≠ ${loesung.join(' ')})`);
        }
      }
    }
  }
}

const total = CATALOGS.reduce((n, c) => n + c.exercises.length, 0);

if (problems.length > 0) {
  console.error(`✗ ${problems.length} Problem(e) im Übungskatalog:\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

// Übersicht, damit im CI-Log sichtbar ist, was ausgeliefert wird.
const perSlug = new Map<string, Map<string, number>>();
for (const { exercises } of CATALOGS) {
  for (const ex of exercises) {
    const gruppe = ex.patternSlug ?? `wortschatz ${ex.level}`;
    const byKind = perSlug.get(gruppe) ?? new Map<string, number>();
    byKind.set(ex.kind, (byKind.get(ex.kind) ?? 0) + 1);
    perSlug.set(gruppe, byKind);
  }
}
for (const [slug, byKind] of perSlug) {
  const parts = [...byKind].map(([k, n]) => `${k} ${n}`).join(' · ');
  console.log(`  ${slug.padEnd(24)} ${parts}`);
}
console.log(`✓ ${total} Übungen, keine Beanstandungen.`);
