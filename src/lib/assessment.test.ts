import { describe, expect, it } from 'vitest';
import {
  BLUEPRINT,
  joinDe,
  ruleVerdict,
  buildAssessment,
  emptyAreas,
  levelFor,
  suggestHabits,
  totalPct,
  weakAreas,
  type Areas,
} from './assessment';
import type { Card, Exercise, Habit } from '../types';
import { freshSrs } from './sm2';

const DATE = '2026-08-10';

function card(i: number, reps = 2): Card {
  return {
    id: `card_${i}`,
    languageId: 'lang',
    term: `termine${i}`,
    translation: `Übersetzung ${i}`,
    pos: 'Nomen',
    example: `Frase numero ${i}.`,
    exampleTranslation: `Satz Nummer ${i}.`,
    extraExamples: [],
    tags: [],
    source: 'seed',
    createdAt: 0,
    unlockedAt: 1,
    order: i,
    srs: { ...freshSrs(DATE), reps },
    history: [],
  };
}

function exercise(kind: Exercise['kind'], i: number): Exercise {
  return {
    id: `it.svo.${kind}.${String(i).padStart(3, '0')}`,
    patternSlug: 'it-svo',
    kind,
    type: kind === 'verstaendnis' ? 'choice' : kind === 'satz' ? 'translate' : 'cloze',
    prompt: kind === 'verstaendnis' ? `Testo ${i}.\n\nFrage ${i}?` : `Aufgabe ${i}`,
    answer: `Lösung ${i}`,
    options: kind === 'verstaendnis' ? [`Lösung ${i}`, 'falsch a', 'falsch b'] : undefined,
  };
}

const CARDS = Array.from({ length: 20 }, (_, i) => card(i));
const CATALOG = [
  ...Array.from({ length: 30 }, (_, i) => exercise('konstruktion', i)),
  ...Array.from({ length: 30 }, (_, i) => exercise('verstaendnis', i)),
  ...Array.from({ length: 30 }, (_, i) => exercise('satz', i)),
];

describe('buildAssessment', () => {
  it('liefert 20 Fragen in der geplanten Verteilung', () => {
    const qs = buildAssessment(CARDS, CATALOG, DATE);
    expect(qs).toHaveLength(20);
    for (const { area, count } of BLUEPRINT) {
      expect(qs.filter((q) => q.area === area)).toHaveLength(count);
    }
  });

  it('ist am selben Tag stabil und am nächsten Tag anders', () => {
    const a = buildAssessment(CARDS, CATALOG, DATE).map((q) => q.id);
    const b = buildAssessment(CARDS, CATALOG, DATE).map((q) => q.id);
    const c = buildAssessment(CARDS, CATALOG, '2026-08-11').map((q) => q.id);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it('gibt jeder Auswahlfrage die richtige Antwort unter den Optionen', () => {
    for (const q of buildAssessment(CARDS, CATALOG, DATE)) {
      if (q.format === 'type') continue;
      expect(q.options).toBeDefined();
      expect(q.options).toContain(q.answer);
      expect(new Set(q.options).size).toBe(q.options?.length);
    }
  });

  it('liest bei Hörfragen den Zielsatz vor, nicht die deutsche Frage', () => {
    const listen = buildAssessment(CARDS, CATALOG, DATE).filter((q) => q.format === 'listen');
    expect(listen.length).toBeGreaterThan(0);
    for (const q of listen) {
      expect(q.audio).toMatch(/^Testo /);
      expect(q.prompt).toMatch(/^Frage /);
    }
  });

  it('fällt ohne Katalog auf Wortschatz und Produktion zurück', () => {
    const qs = buildAssessment(CARDS, [], DATE);
    expect(qs.filter((q) => q.area === 'grammatik')).toHaveLength(0);
    expect(qs.filter((q) => q.area === 'hoerverstehen')).toHaveLength(0);
    expect(qs.filter((q) => q.area === 'produktion').length).toBeGreaterThan(0);
    // Produktion kommt dann aus den Beispielsätzen der Karten.
    expect(qs.find((q) => q.area === 'produktion')?.answer).toMatch(/^Frase numero /);
  });

  it('kommt mit einem fast leeren Deck klar, statt zu werfen', () => {
    expect(() => buildAssessment([card(0)], [], DATE)).not.toThrow();
    expect(buildAssessment([], [], DATE)).toHaveLength(0);
  });
});

describe('levelFor', () => {
  const areas = (total: number, production: number): Areas => ({
    wortschatz: { correct: total, total: 100 },
    grammatik: { correct: total, total: 100 },
    hoerverstehen: { correct: total, total: 100 },
    produktion: { correct: production, total: 100 },
  });

  it('ordnet über die Schwellen ein', () => {
    expect(levelFor(areas(20, 20))).toBe('A1');
    expect(levelFor(areas(55, 55))).toBe('A1+');
    expect(levelFor(areas(75, 60))).toBe('A2');
    expect(levelFor(areas(90, 80))).toBe('A2+');
  });

  it('gewichtet Produktion: gleiche Gesamtquote, schwächere Produktion, niedrigere Stufe', () => {
    // Beide knapp über 85 % gesamt, nur die Produktion unterscheidet sich.
    expect(levelFor(areas(90, 80))).toBe('A2+');
    expect(levelFor(areas(95, 60))).toBe('A2');
  });

  it('behandelt einen leeren Test nicht als Erfolg', () => {
    expect(levelFor(emptyAreas())).toBe('A1');
    expect(totalPct(emptyAreas())).toBe(0);
  });
});

describe('suggestHabits', () => {
  const strong: Areas = {
    wortschatz: { correct: 6, total: 6 },
    grammatik: { correct: 6, total: 6 },
    hoerverstehen: { correct: 4, total: 4 },
    produktion: { correct: 4, total: 4 },
  };

  it('schlägt bei durchweg guten Werten eine Erhaltungsroutine vor', () => {
    expect(weakAreas(strong)).toEqual([]);
    const s = suggestHabits(strong);
    expect(s.length).toBeGreaterThan(0);
    expect(s.map((h) => h.title)).toContain('Morgens 10 Min SRS');
  });

  it('setzt bei schwachem Hörverstehen genau dort an', () => {
    const areas: Areas = { ...strong, hoerverstehen: { correct: 1, total: 4 } };
    expect(weakAreas(areas)).toEqual(['hoerverstehen']);
    const titles = suggestHabits(areas).map((h) => h.title);
    expect(titles).toContain('Mittags Podcast hören');
    expect(titles).not.toContain('Voice-Note aufnehmen');
  });

  it('zählt einen Bereich ohne Fragen nicht als Schwäche', () => {
    const areas: Areas = { ...strong, grammatik: { correct: 0, total: 0 } };
    expect(weakAreas(areas)).toEqual([]);
  });

  it('überspringt Habits, die es schon gibt', () => {
    const areas: Areas = { ...strong, produktion: { correct: 0, total: 4 } };
    const existing = [{ title: '  voice-note aufnehmen ' } as Habit];
    const titles = suggestHabits(areas, existing).map((h) => h.title);
    expect(titles).not.toContain('Voice-Note aufnehmen');
    expect(titles).toContain('Tandem-Gespräch');
  });

  it('liefert jeden Vorschlag nur einmal', () => {
    const areas: Areas = {
      wortschatz: { correct: 0, total: 6 },
      grammatik: { correct: 0, total: 6 },
      hoerverstehen: { correct: 0, total: 4 },
      produktion: { correct: 0, total: 4 },
    };
    const titles = suggestHabits(areas).map((h) => h.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('ruleVerdict', () => {
  it('zählt auf Deutsch auf, statt "und" zu ketten', () => {
    expect(joinDe([])).toBe('');
    expect(joinDe(['A'])).toBe('A');
    expect(joinDe(['A', 'B'])).toBe('A und B');
    expect(joinDe(['A', 'B', 'C'])).toBe('A, B und C');
  });

  it('nennt schwache Bereiche in einer lesbaren Aufzählung', () => {
    const areas: Areas = {
      wortschatz: { correct: 1, total: 6 },
      grammatik: { correct: 1, total: 6 },
      hoerverstehen: { correct: 4, total: 4 },
      produktion: { correct: 4, total: 4 },
    };
    const text = ruleVerdict(areas, 'A1');
    expect(text).toContain('Wortschatz und Grammatik');
    expect(text).not.toMatch(/und .* und .* und/);
  });

  it('formuliert es anders, wenn alle Bereiche schwach sind', () => {
    const areas: Areas = {
      wortschatz: { correct: 0, total: 6 },
      grammatik: { correct: 0, total: 6 },
      hoerverstehen: { correct: 0, total: 4 },
      produktion: { correct: 0, total: 4 },
    };
    const text = ruleVerdict(areas, 'A1');
    expect(text).toContain('Alle Bereiche');
    expect(text).not.toMatch(/und .* und .* und/);
  });
});
