import type { CefrLevel, Language, Phase } from '../types';
import { daysBetween, todayISO } from './date';

/** Aufstiegskette der Sprints. B2 ist vorerst das Ende der Leiter. */
export const LEVEL_LADDER: CefrLevel[] = ['A1', 'A2', 'B1', 'B2'];

/** Die Stufe, auf die der nächste Sprint zielt. */
export function nextLevel(current: CefrLevel): CefrLevel | null {
  const i = LEVEL_LADDER.indexOf(current);
  return i >= 0 && i < LEVEL_LADDER.length - 1 ? LEVEL_LADDER[i + 1] : null;
}

/**
 * Welche Muster-Stufen ein Sprint abdeckt.
 *
 * Der erste Sprint holt A1 und A2 zusammen ab – das Skelett von null auf
 * Alltagstauglichkeit. Jeder weitere nimmt sich genau eine Stufe vor.
 */
export function levelsInSprint(targetLevel: CefrLevel): CefrLevel[] {
  return targetLevel === 'A2' ? ['A1', 'A2'] : [targetLevel];
}

/**
 * Zielstufe des ersten Sprints, ausgehend vom selbst gewählten Startniveau.
 *
 * Wer bei null anfängt, läuft auf A2 zu – der erste Sprint holt A1 und A2
 * zusammen ab. Alle anderen nehmen sich genau die nächste Stufe vor. Auf B2
 * gibt es nichts Höheres mehr, dort bleibt das Ziel stehen.
 */
export function targetForStart(startLevel: CefrLevel): CefrLevel {
  if (startLevel === 'A1') return 'A2';
  return nextLevel(startLevel) ?? startLevel;
}

/**
 * Ab welchem Frequenzrang ein Deck bei diesem Startniveau einsteigt.
 *
 * Startpakete sind nach Frequenz sortiert (`Card.order`), und Frequenz ist der
 * beste verfügbare Anhaltspunkt für Niveau – gemessen ist hier nichts. Die
 * Grenzen sind Schätzungen am 1000-Wörter-Startpaket: Wer auf B1 einsteigt,
 * kann die 700 häufigsten Wörter mit einiger Wahrscheinlichkeit schon.
 *
 * Sie entscheiden nur über die *Reihenfolge* im Pool. Keine Karte verschwindet,
 * und keine gilt deshalb als gelernt – das wäre eine Behauptung über den
 * Nutzer, für die es keine Grundlage gibt.
 */
export const LEVEL_START_RANK: Record<CefrLevel, number> = {
  A1: 0,
  A2: 300,
  B1: 700,
  B2: 1200,
};

/**
 * Alle Stufen von `start` bis `target`, beide einschließlich.
 *
 * Für Wortschatzübungen: Wer auf B1 einsteigt und auf B2 zuläuft, hat die
 * B1-Übungen nie gemacht – `levelsInSprint` allein ließe nur B2 übrig.
 */
export function levelsFromTo(start: CefrLevel, target: CefrLevel): CefrLevel[] {
  const from = LEVEL_LADDER.indexOf(start);
  const to = LEVEL_LADDER.indexOf(target);
  if (from < 0 || to < 0 || to < from) return levelsInSprint(target);
  return LEVEL_LADDER.slice(from, to + 1);
}

/**
 * Alle Stufen, für die eine Sprache Material braucht.
 *
 * Vereinigung aus `levelsFromTo` und `levelsInSprint`, und beides ist nötig:
 * Wer auf A2 einsteigt, sieht im ersten Sprint auch die A1-Muster – die
 * Spanne allein ließe A1 weg. Wer auf B1 einsteigt und auf B2 zuläuft, hat die
 * B1-Übungen nie gemacht – der Sprint allein ließe B1 weg.
 *
 * Der Übungskatalog lädt danach seine Module: Was hier nicht steht, wird gar
 * nicht erst heruntergeladen.
 */
export function levelsCovered(start: CefrLevel, target: CefrLevel): CefrLevel[] {
  const gebraucht = new Set([...levelsFromTo(start, target), ...levelsInSprint(target)]);
  return LEVEL_LADDER.filter((level) => gebraucht.has(level));
}

export const LEVEL_LABEL: Record<CefrLevel, string> = {
  A1: 'A1 · Anfänger',
  A2: 'A2 · Grundlagen',
  B1: 'B1 · Fortgeschritten',
  B2: 'B2 · Selbstständig',
};

export const LEVEL_HINT: Record<CefrLevel, string> = {
  A1: 'Ich fange bei null an.',
  A2: 'Einzelne Wörter und einfache Sätze sitzen.',
  B1: 'Alltagsgespräche gehen, mit Lücken.',
  B2: 'Ich komme zurecht, will aber sicherer werden.',
};

/** Woher die aktuelle Phase kommt – bestimmt, was in der Anzeige daneben steht. */
export type PhaseSource = 'tag' | 'niveau' | 'manuell';

export interface PhaseInfo {
  phase: Phase;
  /** Tag im Sprint, 1-basiert. Kann > 30 sein. */
  day: number;
  week: 1 | 2 | 3 | 4;
  title: string;
  focus: string;
  /** Freigeschaltete Module in dieser Phase. */
  modules: string[];
  source: PhaseSource;
  /**
   * Begründung für die Anzeige, z.B. "Tag 1–14" oder "Einstieg B1".
   * Gehört hierher und nicht in die Screens: Sonst stünde bei einem
   * B1-Einstieg am ersten Tag "ab Tag 31" – richtig für die Phase, falsch
   * für die Person.
   */
  range: string;
}

export const PHASE_META: Record<Phase, { title: string; focus: string; range: string }> = {
  1: {
    title: 'Fundament',
    focus:
      'Die wichtigsten 600–1000 Wörter und das Grammatik-Skelett. Nur Vokabeln, Übungen und Grammatik.',
    range: 'Tag 1–14',
  },
  2: {
    title: 'Input',
    focus: 'Verständlicher Input im Reader. Wortschatz vertiefen, neue Sätze mit Zielort.',
    range: 'Tag 15–30',
  },
  3: {
    title: 'Produktion & Alltag',
    focus: 'Selbst produzieren: Konversation, Schreiben, Sprechen. Offen und personalisiert.',
    range: 'ab Tag 31',
  },
};

export const WEEK_PLAN: Record<1 | 2 | 3 | 4, { title: string; goals: string[] }> = {
  1: {
    title: 'Woche 1 – Fundament & Klang',
    goals: [
      '20–30 Kernmuster ("Ich möchte…", "Kann ich…?", "Es gibt…")',
      '60–80 Funktionswörter: Präpositionen, Konjunktionen, Fragewörter',
      'Routine: 10 Min Drills · 10 Min SRS · 10 Min Hören · 5 Min Shadowing',
    ],
  },
  2: {
    title: 'Woche 2 – Sätze & Zeitformen',
    goals: [
      '3–4 Tempora sicher bilden, Relativsätze, Modalverben',
      '120–150 Funktionswörter aktiv',
      'Routine: 10 Min Drills · 10 Min SRS · 15 Min Lesen/Hören · 10 Min Mini-Tagebuch',
    ],
  },
  3: {
    title: 'Woche 3 – Alltag & Anwendung',
    goals: [
      'Alltagsszenen strukturieren: Bestellen, Termin, Wegbeschreibung',
      '200+ Funktionswörter, 40+ Satzbausteine',
      'Routine: 10 Min Drills · 10 Min SRS · 15 Min Content · 10 Min Output',
    ],
  },
  4: {
    title: 'Woche 4 – Festigung & Test',
    goals: [
      '300+ Funktionswörter, 60+ Satzbausteine',
      '10-Minuten-Gespräch mit korrektem Grundgerüst',
      'Tag 30: Mini-Assessment A1/A2',
    ],
  },
};

/**
 * Phase, in der eine Sprache mit diesem Vorwissen frühestens einsteigt.
 *
 * Die Reduktion in Phase 1 – nur Wortschatz und Grammatik, kein Lesen, kein
 * Sprechen – ist für echte Anfänger gedacht: Sie schützt vor Überforderung und
 * hält die ersten zwei Wochen frei fürs Fundament. Wer mit A2 einsteigt, liest
 * schon einfache Texte; wer mit B1 einsteigt, führt schon Gespräche. Für die
 * ist dieselbe Sperre keine Hilfe, sondern eine Wand vor Material, das sie
 * benutzen könnten.
 */
const PHASE_FLOOR: Record<CefrLevel, Phase> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 3,
};

export function getPhase(lang: Language, today: string = todayISO()): PhaseInfo {
  const day = Math.max(1, daysBetween(lang.startDate, today) + 1);
  const natural: Phase = day <= 14 ? 1 : day <= 30 ? 2 : 3;
  const startLevel = lang.startLevel ?? 'A1';
  const floor = PHASE_FLOOR[startLevel];
  // Die Tage laufen weiter: Wer bei A2 einsteigt, erreicht Phase 3 trotzdem an
  // Tag 31 – das Startniveau hebt nur den Boden an, es überspringt nichts.
  const earned = Math.max(natural, floor) as Phase;
  const phase = lang.phaseOverride ?? earned;
  const week = (Math.min(4, Math.ceil(Math.min(day, 28) / 7)) || 1) as 1 | 2 | 3 | 4;

  const source: PhaseSource = lang.phaseOverride
    ? 'manuell'
    : floor > natural
      ? 'niveau'
      : 'tag';

  const modules = ['review', 'vocab', 'exercises', 'grammar'];
  if (phase >= 2) modules.push('reader');
  if (phase >= 3) modules.push('chat', 'writing', 'daily');

  return {
    phase,
    day,
    week,
    title: PHASE_META[phase].title,
    focus: PHASE_META[phase].focus,
    modules,
    source,
    range:
      source === 'niveau'
        ? `Einstieg ${startLevel}`
        : source === 'manuell'
          ? 'manuell gesetzt'
          : PHASE_META[phase].range,
  };
}

export function hasModule(lang: Language, module: string, today?: string): boolean {
  return getPhase(lang, today).modules.includes(module);
}
