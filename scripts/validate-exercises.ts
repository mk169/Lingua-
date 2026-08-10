/**
 * Qualitätstor für den Übungskatalog.
 *
 * Läuft in der CI vor dem Build: Eine Übung mit fehlender Lösung oder falschem
 * Muster-Bezug würde sonst live gehen und von jedem Nutzer mitgelernt.
 *
 *   npm run validate:exercises
 */

import { EXERCISES as IT } from '../src/data/exercises/it';
import { SEED_LANGUAGES } from '../src/data/seed';
import type { Exercise } from '../src/types';

const CATALOGS: { file: string; exercises: Exercise[] }[] = [
  { file: 'src/data/exercises/it.ts', exercises: IT },
];

const KNOWN_SLUGS = new Set(
  SEED_LANGUAGES.flatMap((l) => l.patterns.map((p) => p.slug).filter((s): s is string => !!s)),
);

const KINDS = new Set(['satz', 'konstruktion', 'verstaendnis']);
const TYPES = new Set(['cloze', 'transform', 'order', 'build', 'choice', 'translate']);

/** Für den Dublettencheck: Groß-/Kleinschreibung und Whitespace ignorieren. */
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
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

    if (!KNOWN_SLUGS.has(ex.patternSlug)) {
      fail(ex, `patternSlug "${ex.patternSlug}" kommt in src/data/seed.ts nicht vor`);
    }
    if (!KINDS.has(ex.kind)) fail(ex, `unbekannte Kategorie "${ex.kind}"`);
    if (!TYPES.has(ex.type)) fail(ex, `unbekannter Typ "${ex.type}"`);

    // Prompts nur innerhalb desselben Musters vergleichen – "Non capisco."
    // darf in zwei Mustern vorkommen, aber nicht zweimal im selben.
    const key = `${ex.patternSlug}|${ex.kind}|${norm(ex.prompt ?? '')}`;
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
    if (ex.type === 'order' && !ex.prompt.includes(' / ')) fail(ex, 'order ohne " / " zwischen den Teilen');
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
    const byKind = perSlug.get(ex.patternSlug) ?? new Map<string, number>();
    byKind.set(ex.kind, (byKind.get(ex.kind) ?? 0) + 1);
    perSlug.set(ex.patternSlug, byKind);
  }
}
for (const [slug, byKind] of perSlug) {
  const parts = [...byKind].map(([k, n]) => `${k} ${n}`).join(' · ');
  console.log(`  ${slug.padEnd(24)} ${parts}`);
}
console.log(`✓ ${total} Übungen, keine Beanstandungen.`);
