import type { CefrLevel, Exercise } from '../../types';

/**
 * Lädt den Übungskatalog einer Sprache nachträglich.
 *
 * Bewusst dynamisch: Der italienische Katalog trägt inzwischen 8640 Übungen
 * und gehört nicht ins Hauptbundle, das schon die 1000er-Wortliste hat. Vite
 * erkennt die statischen `import()`-Pfade und legt pro Modul einen eigenen
 * Chunk an, der erst auf dem Drills-Screen lädt.
 *
 * `levels` schneidet zusätzlich zu: Wer auf A1 anfängt, lädt A1 und A2 statt
 * des ganzen Katalogs bis B2. Ohne Angabe kommt alles – das brauchen Sprachen
 * ohne Stufenaufteilung und Aufrufer, die den gesamten Bestand sehen wollen.
 */
export async function loadExercises(
  languageName: string,
  levels?: CefrLevel[],
): Promise<Exercise[]> {
  switch (languageName) {
    case 'Italienisch':
      return loadItalian(levels);
    case 'Spanisch':
      return (await import('./es')).EXERCISES;
    case 'Französisch':
      return (await import('./fr')).EXERCISES;
    case 'Polnisch':
      return (await import('./pl')).EXERCISES;
    case 'Portugiesisch':
      return (await import('./pt')).EXERCISES;
    default:
      return [];
  }
}

/**
 * Italienisch liegt als ein Modul pro Stufe im Repo.
 *
 * A1 zieht zwei Module: `it.ts` mit der ersten Sprintwoche und dem Wortschatz,
 * `it.a1.ts` mit der zweiten. Das ist historisch gewachsen und bleibt so –
 * `it.ts` ist der Einstieg, den der Generator und die Doku kennen.
 */
const ITALIAN_LEVELS: Record<CefrLevel, () => Promise<Exercise[]>> = {
  A1: async () => {
    const [woche1, woche2] = await Promise.all([import('./it'), import('./it.a1')]);
    return [...woche1.EXERCISES, ...woche2.EXERCISES_A1];
  },
  A2: async () => (await import('./it.a2')).EXERCISES_A2,
  B1: async () => (await import('./it.b1')).EXERCISES_B1,
  B2: async () => (await import('./it.b2')).EXERCISES_B2,
};

async function loadItalian(levels?: CefrLevel[]): Promise<Exercise[]> {
  const wanted = levels?.length ? levels : (Object.keys(ITALIAN_LEVELS) as CefrLevel[]);
  const geladen = await Promise.all(wanted.map((level) => ITALIAN_LEVELS[level]()));
  return geladen.flat();
}
