import { describe, expect, it } from 'vitest';
import { ITALIAN_CORE } from './italianCore';
import { SEED_LANGUAGES, findSeed } from './seed';
import { LEVEL_START_RANK } from '../lib/phase';
import type { CefrLevel } from '../types';

describe('Italienisches Startpaket', () => {
  it('hat für jedes Startband Wörter', () => {
    // Wer auf B2 einsteigt, beginnt bei Rang 1200. Ist die Liste kürzer,
    // liegt sein ganzes Deck unter dem Startband und er bekommt nichts
    // Frisches zu sehen – genau der Zustand, den die 2200 Wörter beheben.
    for (const [level, rank] of Object.entries(LEVEL_START_RANK) as [CefrLevel, number][]) {
      expect(ITALIAN_CORE.length, `Startband ${level} beginnt bei Rang ${rank}`).toBeGreaterThan(
        rank,
      );
    }
  });

  it('führt kein Stichwort doppelt', () => {
    // Dubletten wären im Deck zwei Karten für dasselbe Wort: doppelte
    // Wiederholungen, doppelter SRS-Stand, kein Gewinn.
    const terms = ITALIAN_CORE.map((w) => w[0].toLowerCase().trim());
    const doppelt = terms.filter((t, i) => terms.indexOf(t) !== i);
    expect([...new Set(doppelt)]).toEqual([]);
  });

  it('gibt zu jedem Wort Übersetzung, Wortart und Beispielsatz an', () => {
    const unvollstaendig = ITALIAN_CORE.filter((w) => w.length !== 5 || w.some((f) => !f?.trim()));
    expect(unvollstaendig.map((w) => w[0])).toEqual([]);
  });

  it('behält die Frequenzreihenfolge beim Nachliefern bei', () => {
    // `order` im Deck ist der Index in dieser Liste. Neue Wörter gehören ans
    // Ende, sonst verschieben sie die Freischaltreihenfolge aller anderen.
    const pack = findSeed('Italienisch');
    expect(pack?.words[0][0]).toBe('essere');
    expect(pack?.words.length).toBe(ITALIAN_CORE.length);
  });

  it('hält für jede Sprache Wörter und Muster bereit', () => {
    for (const lang of SEED_LANGUAGES) {
      expect(lang.words.length, `${lang.name} ohne Wörter`).toBeGreaterThan(0);
      expect(lang.patterns.length, `${lang.name} ohne Muster`).toBeGreaterThan(0);
    }
  });
});
