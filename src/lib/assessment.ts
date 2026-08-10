/**
 * Standortbestimmung: 20 Fragen aus vorhandenem Material.
 *
 * `phase.ts` nennt als Ziel für Woche 4 „Tag 30: Mini-Assessment A1/A2“ – das
 * ist der Test dazu. Er baut sich ausschließlich aus dem eigenen Deck und dem
 * Repo-Übungskatalog, läuft also ohne API-Schlüssel und erreicht damit jeden
 * Besucher.
 *
 * Was er nicht ist: eine GER-Einstufung. 20 Fragen aus dem eigenen Material
 * schätzen, sie prüfen nicht – das sagt auch das Ergebnis-UI.
 */

import type { AssessmentArea, Card, Cadence, Exercise, Habit } from '../types';
import { seededOrder } from './exerciseQueue';

export interface AssessmentQuestion {
  id: string;
  area: AssessmentArea;
  /** `choice` = Auswahl, `type` = tippen, `listen` = hören und auswählen. */
  format: 'choice' | 'type' | 'listen';
  /** Bei `listen` der vorzulesende Satz, sonst leer. */
  audio?: string;
  prompt: string;
  answer: string;
  options?: string[];
}

/** Verteilung der 20 Fragen auf die vier Bereiche. */
export const BLUEPRINT: { area: AssessmentArea; count: number }[] = [
  { area: 'wortschatz', count: 6 },
  { area: 'grammatik', count: 6 },
  { area: 'hoerverstehen', count: 4 },
  { area: 'produktion', count: 4 },
];

export const AREA_LABEL: Record<AssessmentArea, string> = {
  wortschatz: 'Wortschatz',
  grammatik: 'Grammatik',
  hoerverstehen: 'Hörverstehen',
  produktion: 'Produktion',
};

/** Unter so vielen Fragen lohnt der Test nicht – dann fehlt schlicht Material. */
export const MIN_QUESTIONS = 10;

/** Tagesstabiler Seed: Abbruch und Neustart am selben Tag ergeben denselben Test. */
function seedFor(date: string): number {
  return Number(date.replaceAll('-', '')) || 1;
}

function pick<T>(items: T[], count: number, seed: number, key: (item: T) => string): T[] {
  return [...items].sort((a, b) => seededOrder(key(a), seed) - seededOrder(key(b), seed)).slice(0, count);
}

/**
 * Baut den Test.
 *
 * `cards` sollten die freigeschalteten Karten der Sprache sein, `catalog` der
 * geladene Übungskatalog. Fehlt der Katalog (Sprachen ohne Repo-Inhalt), bleiben
 * Grammatik und Hörverstehen leer und der Test wird entsprechend kürzer.
 */
export function buildAssessment(
  cards: Card[],
  catalog: Exercise[],
  date: string,
): AssessmentQuestion[] {
  const seed = seedFor(date);
  const out: AssessmentQuestion[] = [];

  // ── Wortschatz: Karten, die schon mindestens einmal abgefragt wurden.
  // Nagelneue Karten zu prüfen misst nichts über den Lernstand.
  const known = cards.filter((c) => c.unlockedAt !== null && c.srs.reps >= 1);
  const vocabPool = known.length >= 4 ? known : cards.filter((c) => c.unlockedAt !== null);
  const vocab = pick(vocabPool, BLUEPRINT[0].count, seed, (c) => c.id);
  for (const card of vocab) {
    // Distraktoren aus dem eigenen Deck – gleiche Wortart bevorzugt, damit die
    // richtige Antwort sich nicht schon grammatisch verrät.
    const others = cards.filter(
      (c) => c.id !== card.id && c.translation && c.translation !== card.translation,
    );
    const sameKind = others.filter((c) => c.pos && c.pos === card.pos);
    const distractors = pick(sameKind.length >= 2 ? sameKind : others, 2, seed + 1, (c) => c.id);
    if (distractors.length < 2) continue;
    const options = [card.translation, ...distractors.map((d) => d.translation)];
    out.push({
      id: `v.${card.id}`,
      area: 'wortschatz',
      format: 'choice',
      prompt: card.term,
      answer: card.translation,
      options: rotate(options, seededOrder(card.id, seed) % 3),
    });
  }

  // ── Grammatik, Hörverstehen, Produktion aus dem Repo-Katalog.
  const byKind = (kind: Exercise['kind']) => catalog.filter((e) => e.kind === kind);

  for (const ex of pick(byKind('konstruktion'), BLUEPRINT[1].count, seed, (e) => e.id)) {
    out.push({
      id: ex.id,
      area: 'grammatik',
      format: 'type',
      prompt: ex.prompt,
      answer: ex.answer,
    });
  }

  for (const ex of pick(byKind('verstaendnis'), BLUEPRINT[2].count, seed, (e) => e.id)) {
    const [text, question] = ex.prompt.split('\n\n');
    out.push({
      id: ex.id,
      area: 'hoerverstehen',
      format: 'listen',
      audio: text,
      prompt: question ?? text,
      answer: ex.answer,
      options: ex.options,
    });
  }

  for (const ex of pick(byKind('satz'), BLUEPRINT[3].count, seed, (e) => e.id)) {
    out.push({
      id: ex.id,
      area: 'produktion',
      format: 'type',
      prompt: ex.prompt,
      answer: ex.answer,
    });
  }

  // Ohne Katalog: Produktion aus den Beispielsätzen der Karten nachziehen,
  // damit wenigstens zwei Bereiche gemessen werden.
  if (byKind('satz').length === 0) {
    const withExample = cards.filter((c) => c.example && c.exampleTranslation);
    for (const card of pick(withExample, BLUEPRINT[3].count, seed, (c) => c.id)) {
      out.push({
        id: `p.${card.id}`,
        area: 'produktion',
        format: 'type',
        prompt: card.exampleTranslation as string,
        answer: card.example as string,
      });
    }
  }

  return out;
}

/** Verteilt die richtige Antwort deterministisch über die Positionen. */
function rotate<T>(items: T[], by: number): T[] {
  const n = items.length;
  const offset = ((by % n) + n) % n;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

// ── Auswertung ─────────────────────────────────────────────────────────────

export type Areas = Record<AssessmentArea, { correct: number; total: number }>;

export function emptyAreas(): Areas {
  return {
    wortschatz: { correct: 0, total: 0 },
    grammatik: { correct: 0, total: 0 },
    hoerverstehen: { correct: 0, total: 0 },
    produktion: { correct: 0, total: 0 },
  };
}

/** Anteil richtiger Antworten in Prozent; ohne Fragen 0. */
export function pct(a: { correct: number; total: number }): number {
  return a.total === 0 ? 0 : Math.round((a.correct / a.total) * 100);
}

export function totalPct(areas: Areas): number {
  const correct = Object.values(areas).reduce((n, a) => n + a.correct, 0);
  const total = Object.values(areas).reduce((n, a) => n + a.total, 0);
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

/**
 * Einordnung, kein Zertifikat.
 *
 * Die Produktion zählt doppelt: Wer Sätze selbst bilden kann, ist weiter als
 * jemand, der nur wiedererkennt – auch bei gleicher Gesamtquote.
 */
export function levelFor(areas: Areas): string {
  const total = totalPct(areas);
  const production = pct(areas.produktion);
  if (total >= 85 && production >= 75) return 'A2+';
  if (total >= 70 && production >= 55) return 'A2';
  if (total >= 50) return 'A1+';
  return 'A1';
}

/** Bereiche unter dieser Quote gelten als Baustelle. */
export const WEAK_THRESHOLD = 70;

export function weakAreas(areas: Areas): AssessmentArea[] {
  return (Object.keys(areas) as AssessmentArea[]).filter(
    (a) => areas[a].total > 0 && pct(areas[a]) < WEAK_THRESHOLD,
  );
}

/** Deutsche Aufzählung: „A“, „A und B“, „A, B und C“. */
export function joinDe(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}`;
}

/** Regelbasierter Text, falls kein API-Schlüssel hinterlegt ist. */
export function ruleVerdict(areas: Areas, level: string): string {
  const weak = weakAreas(areas);
  const strong = (Object.keys(areas) as AssessmentArea[]).filter(
    (a) => areas[a].total > 0 && pct(areas[a]) >= 85,
  );
  const parts = [`Einordnung: ${level} bei ${totalPct(areas)} % richtigen Antworten.`];
  if (strong.length > 0) {
    parts.push(`Sicher sitzt ${joinDe(strong.map((a) => AREA_LABEL[a]))}.`);
  }
  if (weak.length === 0) {
    parts.push('Kein Bereich fällt ab – jetzt geht es um Umfang, nicht um Lücken.');
  } else if (weak.length === Object.keys(areas).length) {
    parts.push('Alle Bereiche liegen unter 70 % – das ist noch früh im Sprint völlig normal. Die Vorschläge unten decken alle vier ab.');
  } else {
    parts.push(
      `Nachholbedarf bei ${joinDe(weak.map((a) => AREA_LABEL[a]))}. Die Vorschläge unten setzen genau dort an.`,
    );
  }
  return parts.join(' ');
}

// ── Habits ─────────────────────────────────────────────────────────────────

export interface HabitSuggestion {
  title: string;
  cadence: Cadence;
  minutes: number;
  /** Warum gerade dieser Habit – wird unter dem Vorschlag angezeigt. */
  reason: string;
}

/** Vorlagen für den manuellen Weg im Alltags-Modus. */
export const HABIT_TEMPLATES: { title: string; cadence: Cadence; minutes: number }[] = [
  { title: 'Morgens 10 Min SRS', cadence: 'täglich', minutes: 10 },
  { title: 'Mittags Podcast hören', cadence: 'täglich', minutes: 15 },
  { title: 'Abends Shadowing', cadence: 'täglich', minutes: 5 },
  { title: 'Voice-Note aufnehmen', cadence: '3x/Woche', minutes: 10 },
  { title: 'Tandem-Gespräch', cadence: 'wöchentlich', minutes: 30 },
  { title: 'Serie ohne Untertitel', cadence: 'wöchentlich', minutes: 40 },
];

const BY_AREA: Record<AssessmentArea, HabitSuggestion[]> = {
  wortschatz: [
    {
      title: 'Morgens 10 Min SRS',
      cadence: 'täglich',
      minutes: 10,
      reason: 'Wortschatz wächst nur über tägliche Wiederholung, nicht über lange Sitzungen.',
    },
  ],
  grammatik: [
    {
      title: 'Gemischte Drill-Runde',
      cadence: 'täglich',
      minutes: 10,
      reason: 'Die gemischte Runde in den Drills zieht quer über alle Muster – genau das fehlt noch.',
    },
  ],
  hoerverstehen: [
    {
      title: 'Mittags Podcast hören',
      cadence: 'täglich',
      minutes: 15,
      reason: 'Hörverstehen kommt nur vom Hören, und zwar von mehr, als man versteht.',
    },
    {
      title: 'Serie ohne Untertitel',
      cadence: 'wöchentlich',
      minutes: 40,
      reason: 'Längeres Zuhören am Stück trainiert etwas anderes als einzelne Sätze.',
    },
  ],
  produktion: [
    {
      title: 'Voice-Note aufnehmen',
      cadence: '3x/Woche',
      minutes: 10,
      reason: 'Selbst sprechen ist die Lücke – laut, ohne Netz, ohne Zuhörer.',
    },
    {
      title: 'Tandem-Gespräch',
      cadence: 'wöchentlich',
      minutes: 30,
      reason: 'Ein echtes Gespräch zwingt zu Tempo, das keine Übung erzeugt.',
    },
  ],
};

const MAINTENANCE: HabitSuggestion[] = [
  {
    title: 'Morgens 10 Min SRS',
    cadence: 'täglich',
    minutes: 10,
    reason: 'Kein Bereich fällt ab – halten reicht, täglich kurz statt selten lang.',
  },
  {
    title: 'Serie ohne Untertitel',
    cadence: 'wöchentlich',
    minutes: 40,
    reason: 'Umfang statt Lücken: längerer Input hält das Niveau und erweitert es nebenbei.',
  },
];

/**
 * Leitet Gewohnheiten aus dem Ergebnis ab.
 * Schon vorhandene Habits werden übersprungen, damit die Liste nichts doppelt.
 */
export function suggestHabits(areas: Areas, existing: Habit[] = []): HabitSuggestion[] {
  const weak = weakAreas(areas);
  const base = weak.length === 0 ? MAINTENANCE : weak.flatMap((a) => BY_AREA[a]);

  const have = new Set(existing.map((h) => h.title.trim().toLowerCase()));
  const seen = new Set<string>();
  return base.filter((s) => {
    const key = s.title.trim().toLowerCase();
    if (have.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
