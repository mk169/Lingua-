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

export interface PhaseInfo {
  phase: Phase;
  /** Tag im Sprint, 1-basiert. Kann > 30 sein. */
  day: number;
  week: 1 | 2 | 3 | 4;
  title: string;
  focus: string;
  /** Freigeschaltete Module in dieser Phase. */
  modules: string[];
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

export function getPhase(lang: Language, today: string = todayISO()): PhaseInfo {
  const day = Math.max(1, daysBetween(lang.startDate, today) + 1);
  const natural: Phase = day <= 14 ? 1 : day <= 30 ? 2 : 3;
  const phase = lang.phaseOverride ?? natural;
  const week = (Math.min(4, Math.ceil(Math.min(day, 28) / 7)) || 1) as 1 | 2 | 3 | 4;

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
  };
}

export function hasModule(lang: Language, module: string, today?: string): boolean {
  return getPhase(lang, today).modules.includes(module);
}
