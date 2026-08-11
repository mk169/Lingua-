import { describe, expect, it } from 'vitest';
import { syncSeedContent } from './seedSync';
import { emptyState } from './storage';
import { findSeed } from '../data/seed';
import type { AppState, Language } from '../types';
import { freshSrs, schedule } from './sm2';

function language(name: string): Language {
  return {
    id: 'lang_1',
    name,
    nativeName: name,
    code: 'it-IT',
    emoji: '🇮🇹',
    createdAt: 0,
    startDate: '2026-08-01',
    targetLevel: 'A2',
    sprint: 1,
    sprintHistory: [],
    slot: 'focus',
    dailyNewWords: 45,
    dailyMinutes: 40,
    phaseOverride: null,
  };
}

/** Zustand wie nach einem `addLanguage` von damals: nur die ersten n Einträge. */
function stateWith(name: string, words: number, patterns: number): AppState {
  const pack = findSeed(name)!;
  const s = emptyState();
  s.languages = [language(name)];
  s.cards = pack.words.slice(0, words).map((w, i) => ({
    id: `card_${i}`,
    languageId: 'lang_1',
    term: w[0],
    translation: w[1],
    pos: w[2],
    example: w[3],
    exampleTranslation: w[4],
    extraExamples: [],
    tags: ['Startpaket'],
    source: 'seed',
    createdAt: 0,
    unlockedAt: 1,
    order: i,
    srs: freshSrs('2026-08-01'),
    history: [],
  }));
  s.patterns = pack.patterns.slice(0, patterns).map((p, i) => ({
    id: `pat_${i}`,
    languageId: 'lang_1',
    slug: p.slug,
    title: p.title,
    formula: p.formula,
    explanation: p.explanation,
    examples: p.examples.map(([target, native]) => ({ target, native })),
    week: p.week,
    level: p.level ?? 'A1',
    order: i,
    mastered: false,
    createdAt: 0,
  }));
  return s;
}

describe('syncSeedContent', () => {
  it('liefert nachgewachsene Muster und Wörter nach', () => {
    const pack = findSeed('Französisch')!;
    const before = stateWith('Französisch', 4, 4);
    const after = syncSeedContent(before);

    expect(after.patterns).toHaveLength(pack.patterns.length);
    expect(after.cards).toHaveLength(pack.words.length);
  });

  it('lässt bestehende Karten samt SRS-Stand unangetastet', () => {
    const before = stateWith('Französisch', 4, 4);
    before.cards[0].srs = schedule(before.cards[0].srs, 5, '2026-08-05');
    before.cards[0].history = [{ date: '2026-08-05', quality: 5 }];
    const gelernt = { ...before.cards[0] };

    const after = syncSeedContent(before);
    const danach = after.cards.find((c) => c.id === gelernt.id)!;
    expect(danach).toEqual(gelernt);
  });

  it('lässt "gemeistert" auf bestehenden Mustern stehen', () => {
    const before = stateWith('Französisch', 4, 4);
    before.patterns[0].mastered = true;

    const after = syncSeedContent(before);
    expect(after.patterns.find((p) => p.id === 'pat_0')!.mastered).toBe(true);
  });

  it('schaltet nachgelieferte Wörter nicht sofort frei', () => {
    const before = stateWith('Französisch', 4, 4);
    const alt = new Set(before.cards.map((c) => c.id));
    const after = syncSeedContent(before);
    const neu = after.cards.filter((c) => !alt.has(c.id));
    expect(neu.length).toBeGreaterThan(0);
    expect(neu.every((c) => c.unlockedAt === null)).toBe(true);
  });

  it('ist idempotent – ein zweiter Lauf ändert nichts', () => {
    const einmal = syncSeedContent(stateWith('Französisch', 4, 4));
    const zweimal = syncSeedContent(einmal);
    expect(zweimal).toBe(einmal);
  });

  it('rührt Sprachen ohne Startpaket nicht an', () => {
    const s = emptyState();
    s.languages = [{ ...language('Klingonisch'), code: 'en-US', emoji: '🌍' }];
    expect(syncSeedContent(s)).toBe(s);
  });

  it('ordnet neue Inhalte der richtigen Sprache zu', () => {
    const s = stateWith('Französisch', 4, 4);
    s.languages.push({ ...language('Polnisch'), id: 'lang_2', code: 'pl-PL', emoji: '🇵🇱' });

    const after = syncSeedContent(s);
    const fr = findSeed('Französisch')!;
    const pl = findSeed('Polnisch')!;
    expect(after.patterns.filter((p) => p.languageId === 'lang_1')).toHaveLength(fr.patterns.length);
    expect(after.patterns.filter((p) => p.languageId === 'lang_2')).toHaveLength(pl.patterns.length);
    expect(after.cards.filter((c) => c.languageId === 'lang_2')).toHaveLength(pl.words.length);
  });
});
