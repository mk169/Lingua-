/**
 * Übungskatalog Portugiesisch (pt-PT).
 *
 * Noch ohne handgeschriebenes Material – die Datei existiert, damit der
 * Generator ein Ziel hat und `index.ts` etwas zu laden findet. Sobald
 * `npm run generate:exercises -- --lang pt …` gelaufen ist, hängen die
 * erzeugten Aufgaben über GENERATED hier mit drin.
 *
 * Handgeschriebenes kommt wie in it.ts über `buildFor('pt', slug, …)` dazu und
 * wird vor GENERATED eingereiht.
 */

import type { Exercise } from '../../types';
import { GENERATED } from './pt.generated';

export const EXERCISES: Exercise[] = [...GENERATED];
