import { describe, expect, it } from 'vitest';
import { buildVocab, type VokRow } from './build';

const ROWS: VokRow[] = [
  ['bedeutung', 'la chiave', 'der Schlüssel', 'die Küche', 'der Kuchen'],
  ['luecke', 'chiave', 'Ho perso la ___ di casa.', 'Ich habe den Haustürschlüssel verloren.'],
  ['produktion', 'chiave', 'Ich habe den Schlüssel verloren.', 'Ho perso la chiave.'],
  ['kollokation', 'caffè', 'Was passt: un ___ caffè?', 'forte', 'grande', 'alto'],
];

describe('buildVocab', () => {
  const built = buildVocab('it', 'A1', ROWS);

  it('nummeriert stabil und stellenweise lesbar durch', () => {
    expect(built.map((e) => e.id)).toEqual([
      'it.wortschatz-a1.001',
      'it.wortschatz-a1.002',
      'it.wortschatz-a1.003',
      'it.wortschatz-a1.004',
    ]);
  });

  it('setzt Stufe statt Muster – sonst landen sie in den Drills', () => {
    expect(built.every((e) => e.level === 'A1')).toBe(true);
    expect(built.every((e) => e.patternSlug === undefined)).toBe(true);
    expect(built.every((e) => e.kind === 'wortschatz')).toBe(true);
  });

  it('verknüpft jede Übung mit ihrem Wort', () => {
    expect(built.map((e) => e.term)).toEqual(['la chiave', 'chiave', 'chiave', 'caffè']);
  });

  it('bildet die vier Formate auf die richtigen Typen ab', () => {
    expect(built.map((e) => e.type)).toEqual(['choice', 'cloze', 'translate', 'choice']);
  });

  it('nimmt die Lücke wörtlich – cloze ohne ___ wäre unlösbar', () => {
    expect(built[1].prompt).toContain('___');
    expect(built[1].answer).toBe('chiave');
  });

  it('legt bei choice die Lösung in die Optionen, ohne Dubletten', () => {
    for (const c of built.filter((e) => e.type === 'choice')) {
      expect(c.options).toHaveLength(3);
      expect(c.options).toContain(c.answer);
      expect(new Set(c.options).size).toBe(3);
    }
  });

  it('streut die Lösung über die Positionen statt sie vorn zu lassen', () => {
    // Bei drei Optionen wiederholt sich die Rotation alle drei Aufgaben – die
    // Zusicherung ist deshalb "nicht immer dieselbe Stelle", nicht "jedes Mal
    // eine andere". Ohne das stünde die richtige Antwort durchgehend oben und
    // wäre ohne Nachdenken zu treffen.
    const viele = buildVocab(
      'it',
      'A1',
      Array.from({ length: 6 }, (_, i): VokRow => [
        'bedeutung',
        `wort${i}`,
        `richtig${i}`,
        `falsch${i}a`,
        `falsch${i}b`,
      ]),
    );
    const stellen = new Set(viele.map((e) => e.options?.indexOf(e.answer)));
    expect(stellen.size).toBe(3);
  });

  it('trennt die Stufen im ID-Raum', () => {
    const a2 = buildVocab('it', 'A2', ROWS);
    const ids = new Set([...built, ...a2].map((e) => e.id));
    expect(ids.size).toBe(8);
  });
});
