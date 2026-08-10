/**
 * Auswahl der Übungen für eine Runde.
 *
 * Übungen laufen durch dasselbe SM-2 wie Vokabeln (`ExerciseProgress.srs`).
 * Hier entsteht daraus die Reihenfolge: fällig vor neu vor schon sitzend,
 * und innerhalb davon die Wackelkandidaten zuerst.
 */

import type { Exercise, ExerciseProgress } from '../types';
import { todayISO } from './date';

export type Progress = Record<string, ExerciseProgress>;

/** Fällig heißt: schon mal geübt und das Intervall ist abgelaufen. */
export function isDue(p: ExerciseProgress | undefined, today = todayISO()): boolean {
  return !!p?.srs && p.srs.due <= today;
}

/** Noch nie beantwortet. */
export function isNew(p: ExerciseProgress | undefined): boolean {
  return !p || p.attempts === 0;
}

/**
 * Fehlerquote als Sortierkriterium. Eine Aufgabe, die dreimal danebenging und
 * einmal saß, gehört vor eine, die beim ersten Versuch stimmte.
 */
function shakiness(p: ExerciseProgress | undefined): number {
  if (!p || p.attempts === 0) return 0;
  return p.wrong / p.attempts;
}

/** Streut die Reihenfolge deterministisch – gleicher Tag, gleiche Runde. */
function seededOrder(id: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export interface RoundOptions {
  size?: number;
  today?: string;
  /** Mischt Muster durcheinander, statt sie blockweise abzuarbeiten. */
  interleave?: boolean;
}

/**
 * Baut eine Runde.
 *
 * Reihenfolge der Ränge: fällige zuerst (die hat das SRS angefordert), dann
 * neue, dann alles Übrige als Auffüllung. Innerhalb eines Rangs entscheidet
 * die Fehlerquote, danach – bei `interleave` – eine stabile Streuung, damit
 * nicht 10 Aufgaben desselben Musters hintereinander kommen.
 */
export function buildRound(
  exercises: Exercise[],
  progress: Progress,
  { size = 10, today = todayISO(), interleave = false }: RoundOptions = {},
): Exercise[] {
  const seed = Number(today.replaceAll('-', '')) || 1;

  const rank = (e: Exercise): number => {
    const p = progress[e.id];
    if (isDue(p, today)) return 0;
    if (isNew(p)) return 1;
    return 2;
  };

  return [...exercises]
    .sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      const sa = shakiness(progress[a.id]);
      const sb = shakiness(progress[b.id]);
      if (sa !== sb) return sb - sa;
      if (interleave) return seededOrder(a.id, seed) - seededOrder(b.id, seed);
      return a.id.localeCompare(b.id);
    })
    .slice(0, size);
}

/** Zählt für die Übersicht: wie viele fällig, wie viele noch nie geübt. */
export function countStatus(
  exercises: Exercise[],
  progress: Progress,
  today = todayISO(),
): { due: number; fresh: number; solved: number; total: number } {
  let due = 0;
  let fresh = 0;
  let solved = 0;
  for (const e of exercises) {
    const p = progress[e.id];
    if (p?.solved) solved += 1;
    if (isDue(p, today)) due += 1;
    else if (isNew(p)) fresh += 1;
  }
  return { due, fresh, solved, total: exercises.length };
}
