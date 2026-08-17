/**
 * Gewohnheiten und ihr Takt.
 *
 * Bis hierher war `cadence` reine Beschriftung: Eine Gewohnheit mit Takt
 * „wöchentlich" stand jeden Tag als offen in der Liste und zählte in „0/3 heute"
 * mit. Die Anzeige behauptete damit an sechs von sieben Tagen ein Versäumnis,
 * das keines war.
 *
 * Das Modell hier ist ein Wochensoll, kein Tagesplan: Der Takt sagt, wie oft
 * eine Gewohnheit pro Woche erfüllt sein will, nicht an welchen Tagen. Wer
 * seine drei Einheiten am Wochenende macht, hat sie gemacht.
 */

import type { Cadence, Habit } from '../types';
import { daysBetween, todayISO } from './date';

/** Wie oft pro Woche dieser Takt erfüllt sein will. */
export const WEEKLY_TARGET: Record<Cadence, number> = {
  täglich: 7,
  '3x/Woche': 3,
  wöchentlich: 1,
};

/** Tage der Woche, Montag = 0. */
const WEEK_LENGTH = 7;

/**
 * Montag der Woche, in der das Datum liegt.
 * Die Woche beginnt am Montag – alles andere wäre hier eine Überraschung.
 */
export function weekStart(date: string = todayISO()): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  // getDay(): 0 = Sonntag. Auf Montag = 0 umrechnen.
  const offset = (dt.getDay() + 6) % WEEK_LENGTH;
  dt.setDate(dt.getDate() - offset);
  return todayISO(dt);
}

/** Erledigungen seit Wochenbeginn. */
export function doneThisWeek(habit: Habit, today: string = todayISO()): number {
  const start = weekStart(today);
  return habit.done.filter((d) => d >= start && d <= today).length;
}

export interface HabitStatus {
  /**
   * `done` – heute schon abgehakt.
   * `open` – das Wochensoll ist noch nicht voll.
   * `fulfilled` – diese Woche erledigt, heute steht nichts mehr an.
   */
  status: 'done' | 'open' | 'fulfilled';
  /** Erledigungen in dieser Woche. */
  done: number;
  /** Wochensoll aus dem Takt. */
  target: number;
  /**
   * Ab heute geht es sich nur noch aus, wenn jeden verbleibenden Tag etwas
   * passiert. Vorher ist die Gewohnheit offen, aber nicht dringend – der
   * Unterschied zwischen „kann noch" und „muss jetzt".
   *
   * Bei täglichem Takt bleibt das Feld `false`: Dort ist jeder Tag nötig, und
   * ein Hinweis, der immer leuchtet, ist keiner mehr.
   */
  mustToday: boolean;
}

export function habitStatus(habit: Habit, today: string = todayISO()): HabitStatus {
  const target = WEEKLY_TARGET[habit.cadence] ?? 1;
  const done = doneThisWeek(habit, today);
  const doneToday = habit.done.includes(today);
  // Wie viele Tage die Woche noch hat, heute eingeschlossen.
  const daysLeft = WEEK_LENGTH - daysBetween(weekStart(today), today);
  const open = Math.max(0, target - done);

  return {
    status: doneToday ? 'done' : open === 0 ? 'fulfilled' : 'open',
    done,
    target,
    // Heute ist schon abgehakt – dann ist nichts mehr dringend.
    mustToday:
      habit.cadence !== 'täglich' && !doneToday && open > 0 && open >= daysLeft,
  };
}

/**
 * Steht diese Gewohnheit heute in der Liste?
 *
 * Heute Erledigtes bleibt bis Tagesende stehen – abgehakt und durchgestrichen.
 * Es verschwinden zu lassen, sobald man es anklickt, nimmt einem den einzigen
 * sichtbaren Beleg dafür, es getan zu haben.
 */
export function isOnToday(habit: Habit, today: string = todayISO()): boolean {
  return habitStatus(habit, today).status !== 'fulfilled';
}

/** Zähler für Dashboard und Übersicht: erledigt von dem, was heute ansteht. */
export function todayCount(
  habits: Habit[],
  today: string = todayISO(),
): { done: number; total: number } {
  const onToday = habits.filter((h) => isOnToday(h, today));
  return {
    done: onToday.filter((h) => h.done.includes(today)).length,
    total: onToday.length,
  };
}
