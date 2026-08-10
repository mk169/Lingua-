import type { Exercise } from '../../types';

/**
 * Lädt den Übungskatalog einer Sprache nachträglich.
 *
 * Bewusst dynamisch: 600 Übungen gehören nicht ins Hauptbundle, das schon die
 * 1000er-Wortliste trägt. Vite erkennt die statischen `import()`-Pfade und legt
 * pro Sprache einen eigenen Chunk an, der erst auf dem Drills-Screen lädt.
 */
export async function loadExercises(languageName: string): Promise<Exercise[]> {
  switch (languageName) {
    case 'Italienisch':
      return (await import('./it')).EXERCISES;
    case 'Spanisch':
      return (await import('./es')).EXERCISES;
    case 'Französisch':
      return (await import('./fr')).EXERCISES;
    case 'Polnisch':
      return (await import('./pl')).EXERCISES;
    default:
      return [];
  }
}
