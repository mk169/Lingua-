import { describe, expect, it } from 'vitest';
import { loadExercises } from './index';
import { SEED_LANGUAGES } from '../seed';
import type { CefrLevel } from '../../types';

/**
 * Welche Stufe ein Muster hat, steht im Startpaket – nicht in der Datei, in
 * der die Übungen dazu liegen. Genau darum geht es hier: Ein Muster, das in
 * der falschen Stufendatei landet, fällt sonst niemandem auf. Der Nutzer merkt
 * es erst daran, dass sein Drills-Screen leer bleibt.
 */
const LEVEL_BY_SLUG = new Map<string, CefrLevel>(
  SEED_LANGUAGES.flatMap((l) =>
    l.patterns.flatMap((p) => (p.slug ? [[p.slug, p.level ?? 'A1'] as const] : [])),
  ),
);

function levelOf(slug: string): CefrLevel {
  const level = LEVEL_BY_SLUG.get(slug);
  if (!level) throw new Error(`Muster "${slug}" kommt im Startpaket nicht vor.`);
  return level;
}

describe('Übungskatalog nach Stufen', () => {
  it('liefert für eine Stufe nur Material dieser Stufe', async () => {
    for (const level of ['A2', 'B1', 'B2'] as CefrLevel[]) {
      const exercises = await loadExercises('Italienisch', [level]);
      expect(exercises.length).toBeGreaterThan(0);
      for (const ex of exercises) {
        expect(ex.patternSlug ? levelOf(ex.patternSlug) : ex.level).toBe(level);
      }
    }
  });

  it('legt A1 auf zwei Module, die zusammen die ganze Stufe ergeben', async () => {
    const a1 = await loadExercises('Italienisch', ['A1']);
    for (const ex of a1) {
      expect(ex.patternSlug ? levelOf(ex.patternSlug) : ex.level).toBe('A1');
    }
    // Beide Sprintwochen sind dabei: Woche 1 aus it.ts, Woche 2 aus it.a1.ts.
    expect(a1.some((e) => e.patternSlug === 'it-svo')).toBe(true);
    expect(a1.some((e) => e.patternSlug === 'it-piacere')).toBe(true);
  });

  it('lädt ohne Stufenangabe den ganzen Katalog', async () => {
    const alle = await loadExercises('Italienisch');
    const stufenweise = (
      await Promise.all(
        (['A1', 'A2', 'B1', 'B2'] as CefrLevel[]).map((l) => loadExercises('Italienisch', [l])),
      )
    ).flat();
    expect(alle.length).toBe(stufenweise.length);
    expect(new Set(alle.map((e) => e.id)).size).toBe(alle.length);
  });

  it('deckt jedes italienische Muster des Startpakets ab', async () => {
    const alle = await loadExercises('Italienisch');
    const mitUebungen = new Set(alle.map((e) => e.patternSlug).filter(Boolean));
    const imPaket = SEED_LANGUAGES.find((l) => l.name === 'Italienisch')!
      .patterns.map((p) => p.slug)
      .filter((s): s is string => !!s);
    expect(imPaket.filter((slug) => !mitUebungen.has(slug))).toEqual([]);
  });

  it('kennt Sprachen ohne Katalog und gibt dort nichts zurück', async () => {
    expect(await loadExercises('Portugiesisch')).toEqual([]);
    expect(await loadExercises('Klingonisch')).toEqual([]);
  });
});
