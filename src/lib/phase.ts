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
    focus: 'Die wichtigsten 600–1000 Wörter und das Grammatik-Skelett. Nur Review und Lesen.',
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

  const modules = ['review', 'drills'];
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
