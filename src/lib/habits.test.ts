import { describe, expect, it } from 'vitest';
import { doneThisWeek, habitStatus, isOnToday, todayCount, weekStart } from './habits';
import type { Cadence, Habit } from '../types';

// 2026-08-17 ist ein Montag, 2026-08-23 der zugehörige Sonntag.
const MONDAY = '2026-08-17';
const WEDNESDAY = '2026-08-19';
const FRIDAY = '2026-08-21';
const SUNDAY = '2026-08-23';

function habit(cadence: Cadence, done: string[] = []): Habit {
  return {
    id: 'h1',
    languageId: 'lang_1',
    title: 'Podcast hören',
    cadence,
    minutes: 15,
    done,
    createdAt: 0,
  };
}

describe('Wochengrenze', () => {
  it('beginnt die Woche am Montag', () => {
    expect(weekStart(MONDAY)).toBe(MONDAY);
    expect(weekStart(WEDNESDAY)).toBe(MONDAY);
    expect(weekStart(SUNDAY)).toBe(MONDAY);
  });

  it('schlägt am Montag auf die neue Woche um', () => {
    expect(weekStart('2026-08-24')).toBe('2026-08-24');
  });

  it('zählt nur Erledigungen der laufenden Woche', () => {
    // Der Freitag davor gehört zur Vorwoche und darf nicht mitzählen.
    const h = habit('3x/Woche', ['2026-08-14', MONDAY, WEDNESDAY]);
    expect(doneThisWeek(h, WEDNESDAY)).toBe(2);
  });

  it('zählt nichts, was in der Zukunft liegt', () => {
    const h = habit('täglich', [MONDAY, FRIDAY]);
    expect(doneThisWeek(h, WEDNESDAY)).toBe(1);
  });
});

describe('Wochensoll pro Takt', () => {
  it('verlangt täglich sieben, 3x/Woche drei, wöchentlich eine Einheit', () => {
    expect(habitStatus(habit('täglich'), MONDAY).target).toBe(7);
    expect(habitStatus(habit('3x/Woche'), MONDAY).target).toBe(3);
    expect(habitStatus(habit('wöchentlich'), MONDAY).target).toBe(1);
  });

  it('erklärt eine Wochengewohnheit nach einer Einheit für erledigt', () => {
    const h = habit('wöchentlich', [MONDAY]);
    expect(habitStatus(h, MONDAY).status).toBe('done');
    // Am Folgetag steht sie nicht wieder offen da – das war der ganze Punkt.
    expect(habitStatus(h, WEDNESDAY).status).toBe('fulfilled');
    expect(isOnToday(h, WEDNESDAY)).toBe(false);
  });

  it('nimmt eine erfüllte Gewohnheit in der neuen Woche wieder auf', () => {
    const h = habit('wöchentlich', [MONDAY]);
    expect(habitStatus(h, '2026-08-24').status).toBe('open');
  });

  it('lässt heute Erledigtes bis Tagesende stehen', () => {
    const h = habit('täglich', [WEDNESDAY]);
    expect(habitStatus(h, WEDNESDAY).status).toBe('done');
    expect(isOnToday(h, WEDNESDAY)).toBe(true);
  });
});

describe('Dringlichkeit', () => {
  it('ist am Mittwoch bei drei offenen Einheiten noch nicht dringend', () => {
    // Mittwoch: noch fünf Tage, drei Einheiten offen – das geht sich aus.
    expect(habitStatus(habit('3x/Woche'), WEDNESDAY).mustToday).toBe(false);
  });

  it('wird dringend, sobald jeder Resttag gebraucht wird', () => {
    // Freitag: noch drei Tage, drei Einheiten offen.
    expect(habitStatus(habit('3x/Woche'), FRIDAY).mustToday).toBe(true);
  });

  it('ist nicht dringend, wenn heute schon abgehakt wurde', () => {
    const h = habit('3x/Woche', [FRIDAY]);
    expect(habitStatus(h, FRIDAY).mustToday).toBe(false);
  });

  it('meldet sich bei täglichem Takt nie – dort ist jeder Tag nötig', () => {
    // Ein Hinweis, der an jedem Tag an jeder täglichen Gewohnheit klebt,
    // unterscheidet nichts mehr.
    expect(habitStatus(habit('täglich'), FRIDAY).mustToday).toBe(false);
    expect(habitStatus(habit('täglich'), SUNDAY).mustToday).toBe(false);
  });

  it('bleibt bei erfülltem Soll ruhig', () => {
    const h = habit('3x/Woche', [MONDAY, WEDNESDAY, '2026-08-20']);
    expect(habitStatus(h, SUNDAY).mustToday).toBe(false);
    expect(habitStatus(h, SUNDAY).status).toBe('fulfilled');
  });
});

describe('Tageszähler', () => {
  it('zählt nur, was heute ansteht', () => {
    const list: Habit[] = [
      { ...habit('täglich', [WEDNESDAY]), id: 'a' },
      { ...habit('täglich'), id: 'b' },
      // Soll erfüllt – taucht heute nicht mehr auf, weder im Zähler noch als offen.
      { ...habit('wöchentlich', [MONDAY]), id: 'c' },
    ];
    expect(todayCount(list, WEDNESDAY)).toEqual({ done: 1, total: 2 });
  });
});
