/**
 * Schreibt die katalogtauglichen Sprint-Übungen als eigene Datei.
 *
 * Würde `it.ts` den Sprint direkt importieren, zöge der Drills-Chunk alle 1350
 * Vokabelkarten und sämtliche Texte mit – rund 650 kB, die dort niemand
 * braucht. Deshalb bleibt der Sprint die Quelle und diese Datei das Ergebnis;
 * sie wird nie von Hand bearbeitet, sondern neu erzeugt und im Diff geprüft.
 *
 *   npm run build:sprint-exercises
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SPRINT_IT_A2_B1 } from '../src/data/sprint/it-a2-b1';
import { sprintToExercises } from '../src/data/sprint/toExercises';

const exercises = sprintToExercises(SPRINT_IT_A2_B1);

const head = `/**
 * Erzeugt aus dem Sprint A2 → B1 – nicht von Hand bearbeiten.
 * Quelle: src/data/sprint/it-a2-b1/, Erzeuger: scripts/build-sprint-exercises.ts
 *
 *   npm run build:sprint-exercises
 */

import type { Exercise } from '../../types';

export const SPRINT_EXERCISES: Exercise[] = `;

const body = JSON.stringify(exercises, null, 2)
  // Einfache Anführungszeichen wie im übrigen Katalog, Schlüssel ohne Quotes.
  .replace(/^(\s*)"([a-zA-Z_$][\w$]*)":/gm, '$1$2:')
  .replace(/"((?:[^"\\]|\\.)*)"/g, (_m, s: string) => `'${s.replace(/\\"/g, '"').replace(/'/g, "\\'")}'`);

const ziel = join(import.meta.dirname, '../src/data/exercises/it.sprint.ts');
writeFileSync(ziel, `${head}${body};\n`, 'utf8');

console.log(`Geschrieben: src/data/exercises/it.sprint.ts (${exercises.length} Übungen)`);
