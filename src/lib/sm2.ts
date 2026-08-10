import type { Card, Srs } from '../types';
import { addDays, todayISO } from './date';

/**
 * SM-2 mit fixer Anfangsleiter 1/3/7/14 Tagen (wie im Lernkonzept),
 * danach übernimmt der Easiness-Faktor die Intervallberechnung.
 */
export const INITIAL_LADDER = [1, 3, 7, 14];

/**
 * Ab so vielen Lapses gilt eine Karte als Leech und wird ausgesetzt.
 * Eine Karte, die man achtmal vergessen hat, ist nicht schwer – sie ist
 * schlecht formuliert. Jeden Tag erneut daran zu scheitern kostet nur Zeit.
 */
export const LEECH_LIMIT = 8;

/**
 * Ab wie vielen fälligen Karten keine neuen mehr freigeschaltet werden.
 *
 * Der häufigste Abbruchgrund bei SRS ist nicht fehlende Motivation, sondern
 * ein Berg, der unbezwingbar aussieht: Drei Tage ausgesetzt, und am vierten
 * warten Hunderte Karten – plus das volle Tageskontingent obendrauf.
 */
export function backlogLimit(dailyNewWords: number): number {
  return Math.max(60, dailyNewWords * 3);
}

/** Bewertungsstufen im Review – gemappt auf SM-2 Qualität 0–5. */
export const RATINGS = [
  { quality: 0, label: 'Nochmal', hint: 'nicht gewusst', key: '1' },
  { quality: 3, label: 'Schwer', hint: 'mit Mühe', key: '2' },
  { quality: 4, label: 'Gut', hint: 'gewusst', key: '3' },
  { quality: 5, label: 'Leicht', hint: 'sofort klar', key: '4' },
] as const;

export function freshSrs(due: string = todayISO()): Srs {
  return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due, state: 'new' };
}

/**
 * Berechnet den neuen SRS-Zustand aus einer Bewertung.
 * quality < 3 setzt die Karte zurück (lapse), sonst rückt sie auf der Leiter vor.
 */
export function schedule(srs: Srs, quality: number, today: string = todayISO()): Srs {
  const ease = Math.max(
    1.3,
    srs.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  if (quality < 3) {
    return {
      ease,
      interval: 0,
      reps: 0,
      lapses: srs.lapses + 1,
      due: today, // heute nochmal
      state: 'learning',
    };
  }

  const reps = srs.reps + 1;
  let interval: number;
  if (reps <= INITIAL_LADDER.length) {
    interval = INITIAL_LADDER[reps - 1];
  } else {
    interval = Math.round(srs.interval * ease);
  }
  // "Leicht" streckt zusätzlich, "Schwer" bremst.
  if (quality === 5) interval = Math.round(interval * 1.3);
  if (quality === 3) interval = Math.max(1, Math.round(interval * 0.7));

  return {
    ease,
    interval,
    reps,
    lapses: srs.lapses,
    due: addDays(today, interval),
    state: reps >= INITIAL_LADDER.length ? 'review' : 'learning',
  };
}

/** Vorschau der Intervalle für die Buttons im Review. */
export function previewIntervals(srs: Srs, today: string = todayISO()) {
  return RATINGS.map((r) => {
    const next = schedule(srs, r.quality, today);
    return {
      ...r,
      interval: next.interval,
      label2: next.interval === 0 ? 'heute' : `${next.interval} T`,
    };
  });
}

/** Alle heute fälligen, freigeschalteten und nicht ausgesetzten Karten. */
export function dueCards(cards: Card[], languageId: string, today = todayISO()): Card[] {
  return cards
    .filter(
      (c) =>
        c.languageId === languageId &&
        c.unlockedAt !== null &&
        !c.suspended &&
        c.srs.due <= today,
    )
    .sort((a, b) => {
      // Lapses und Lernkarten zuerst, dann nach Fälligkeit, dann nach Frequenz.
      if (a.srs.state !== b.srs.state) {
        const rank = { learning: 0, new: 1, review: 2 } as const;
        return rank[a.srs.state] - rank[b.srs.state];
      }
      if (a.srs.due !== b.srs.due) return a.srs.due < b.srs.due ? -1 : 1;
      return a.order - b.order;
    });
}

/** Karten, die noch im Pool liegen und freigeschaltet werden können. */
export function lockedCards(cards: Card[], languageId: string): Card[] {
  return cards
    .filter((c) => c.languageId === languageId && c.unlockedAt === null)
    .sort((a, b) => a.order - b.order);
}

/** Ausgesetzte Karten – im Vokabelmodul sichtbar und reaktivierbar. */
export function suspendedCards(cards: Card[], languageId: string): Card[] {
  return cards
    .filter((c) => c.languageId === languageId && c.suspended)
    .sort((a, b) => b.srs.lapses - a.srs.lapses);
}
