import { describe, expect, it } from 'vitest';
import { getPhase, LEVEL_LADDER, levelsCovered, levelsInSprint, nextLevel } from './phase';
import type { CefrLevel, Language } from '../types';

describe('Sprint-Leiter', () => {
  it('steigt Stufe für Stufe bis B2', () => {
    expect(nextLevel('A1')).toBe('A2');
    expect(nextLevel('A2')).toBe('B1');
    expect(nextLevel('B1')).toBe('B2');
  });

  it('endet bei B2, statt im Kreis zu laufen', () => {
    expect(nextLevel('B2')).toBeNull();
  });

  it('holt im ersten Sprint A1 und A2 zusammen ab', () => {
    expect(levelsInSprint('A2')).toEqual(['A1', 'A2']);
  });

  it('nimmt sich danach genau eine Stufe vor', () => {
    expect(levelsInSprint('B1')).toEqual(['B1']);
    expect(levelsInSprint('B2')).toEqual(['B2']);
  });

  it('deckt mit den Sprints jede Stufe der Leiter genau einmal ab', () => {
    const covered = ['A2', 'B1', 'B2'].flatMap((l) => levelsInSprint(l as never));
    expect([...covered].sort()).toEqual([...LEVEL_LADDER].sort());
  });
});

describe('Stufen mit Material', () => {
  it('nimmt beim A2-Einstieg auch A1 dazu, weil der erste Sprint es abdeckt', () => {
    expect(levelsCovered('A2', 'A2')).toEqual(['A1', 'A2']);
  });

  it('behält beim Einstieg mitten in der Leiter die übersprungene Stufe nicht', () => {
    expect(levelsCovered('B1', 'B2')).toEqual(['B1', 'B2']);
  });

  it('deckt vom Nullpunkt aus die ganze Spanne ab', () => {
    expect(levelsCovered('A1', 'B2')).toEqual(['A1', 'A2', 'B1', 'B2']);
  });

  it('bleibt in der Reihenfolge der Leiter, egal wie die Quellen sortiert sind', () => {
    expect(levelsCovered('A1', 'A2')).toEqual(['A1', 'A2']);
    expect(levelsCovered('B2', 'B2')).toEqual(['B2']);
  });
});

/** Sprache mit Startdatum und Einstiegsniveau, sonst neutral. */
function lang(startLevel: CefrLevel, startDate = '2026-08-01'): Language {
  return {
    id: 'l',
    name: 'Italienisch',
    nativeName: 'Italiano',
    code: 'it-IT',
    emoji: '🇮🇹',
    createdAt: 0,
    startDate,
    startLevel,
    targetLevel: 'A2',
    sprint: 1,
    sprintHistory: [],
    slot: 'focus',
    dailyNewWords: 45,
    dailyMinutes: 40,
    phaseOverride: null,
  };
}

describe('Phasensperre und Startniveau', () => {
  const TAG_1 = '2026-08-01';
  const TAG_20 = '2026-08-20';
  const TAG_40 = '2026-09-09';

  it('hält Anfänger am ersten Tag im Fundament', () => {
    const p = getPhase(lang('A1'), TAG_1);
    expect(p.phase).toBe(1);
    expect(p.modules).not.toContain('reader');
    expect(p.modules).not.toContain('chat');
  });

  it('öffnet den Reader für Einsteiger ab A2 sofort', () => {
    const p = getPhase(lang('A2'), TAG_1);
    expect(p.phase).toBe(2);
    expect(p.modules).toContain('reader');
    expect(p.modules).not.toContain('chat');
  });

  it('gibt ab B1 alles frei – wer spricht, braucht keine Sperre davor', () => {
    for (const level of ['B1', 'B2'] as CefrLevel[]) {
      const p = getPhase(lang(level), TAG_1);
      expect(p.phase).toBe(3);
      expect(p.modules).toEqual(
        expect.arrayContaining(['review', 'vocab', 'exercises', 'grammar', 'reader', 'chat', 'writing', 'daily']),
      );
    }
  });

  it('hebt nur den Boden an – die Tage laufen für alle gleich weiter', () => {
    expect(getPhase(lang('A1'), TAG_20).phase).toBe(2);
    expect(getPhase(lang('A2'), TAG_20).phase).toBe(2);
    expect(getPhase(lang('A1'), TAG_40).phase).toBe(3);
    expect(getPhase(lang('A2'), TAG_40).phase).toBe(3);
  });

  it('nennt die Begründung, statt an Tag 1 "ab Tag 31" zu behaupten', () => {
    expect(getPhase(lang('B1'), TAG_1).range).toBe('Einstieg B1');
    expect(getPhase(lang('B1'), TAG_1).source).toBe('niveau');
    expect(getPhase(lang('A1'), TAG_1).range).toBe('Tag 1–14');
    expect(getPhase(lang('A1'), TAG_1).source).toBe('tag');
  });

  it('lässt das manuelle Überschreiben gewinnen', () => {
    const p = getPhase({ ...lang('A1'), phaseOverride: 3 }, TAG_1);
    expect(p.phase).toBe(3);
    expect(p.source).toBe('manuell');
    expect(p.range).toBe('manuell gesetzt');
  });

  it('behandelt alte Stände ohne Startniveau als Anfänger', () => {
    // Stände von vor dem Einrichtungsassistenten haben das Feld nicht.
    const alt = { ...lang('A1'), startLevel: undefined } as unknown as Language;
    expect(getPhase(alt, TAG_1).phase).toBe(1);
    expect(getPhase(alt, TAG_1).range).toBe('Tag 1–14');
  });
});
