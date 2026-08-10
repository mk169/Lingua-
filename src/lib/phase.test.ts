import { describe, expect, it } from 'vitest';
import { LEVEL_LADDER, levelsInSprint, nextLevel } from './phase';

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
