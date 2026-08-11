/**
 * Gemeinsames Gerüst der handgeschriebenen Übungskataloge.
 *
 * Die Kataloge sind als knappe Tupel notiert statt als Objekte: 600 Übungen
 * als vollständige `Exercise`-Literale wären kaum noch lesbar und im Diff
 * unbrauchbar. IDs und Optionsreihenfolge entstehen hier deterministisch,
 * damit sich beim Nachtragen einer Übung nicht der halbe Katalog verschiebt.
 */

import type { CefrLevel, Exercise, ExerciseType } from '../../types';

/** [Satz in der Muttersprache, Lösung in der Zielsprache] */
export type SatzRow = [string, string];
/** [Typ, Aufgabe, Lösung, Tipp] */
export type KonRow = [
  Extract<ExerciseType, 'cloze' | 'transform' | 'order' | 'build'>,
  string,
  string,
  string,
];
/** [Text in der Zielsprache, Frage, richtige Antwort, falsch, falsch] */
export type VerRow = [string, string, string, string, string];

function pad(n: number): string {
  return String(n).padStart(3, '0');
}

/**
 * Verteilt die richtige Antwort deterministisch über die Positionen, damit sie
 * nicht immer an erster Stelle steht – gleicher Index ergibt immer dieselbe
 * Reihenfolge, der Katalog bleibt also stabil.
 */
function rotate<T>(items: T[], by: number): T[] {
  const n = items.length;
  const offset = ((by % n) + n) % n;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

/**
 * Baut die drei Kategorien eines Musters zu Übungen zusammen.
 * `lang` ist das Sprachkürzel im ID-Präfix, z.B. `it.svo.satz.001`.
 */
export function buildFor(
  lang: string,
  slug: string,
  satz: SatzRow[],
  kon: KonRow[],
  ver: VerRow[],
): Exercise[] {
  const short = slug.startsWith(`${lang}-`) ? slug.slice(lang.length + 1) : slug;
  return [
    ...satz.map<Exercise>(([native, target], i) => ({
      id: `${lang}.${short}.satz.${pad(i + 1)}`,
      patternSlug: slug,
      kind: 'satz',
      type: 'translate',
      prompt: native,
      answer: target,
    })),
    ...kon.map<Exercise>(([type, prompt, answer, hint], i) => ({
      id: `${lang}.${short}.konstruktion.${pad(i + 1)}`,
      patternSlug: slug,
      kind: 'konstruktion',
      type,
      prompt,
      answer,
      hint,
    })),
    ...ver.map<Exercise>(([text, question, correct, w1, w2], i) => ({
      id: `${lang}.${short}.verstaendnis.${pad(i + 1)}`,
      patternSlug: slug,
      kind: 'verstaendnis',
      type: 'choice',
      prompt: `${text}\n\n${question}`,
      answer: correct,
      options: rotate([correct, w1, w2], i),
    })),
  ];
}

/**
 * Vokabelübung: an eine Stufe gebunden, nicht an ein Grammatikmuster.
 *
 * Vier Formate, unterschieden über den Typ:
 *   ['bedeutung',  'la chiave', 'der Schlüssel', 'die Küche', 'der Kuchen']
 *   ['luecke',     'chiave', 'Ho perso la ___ di casa.', 'Ich habe den Haustürschlüssel verloren.']
 *   ['produktion', 'chiave', 'Ich habe den Schlüssel verloren.', 'Ho perso la chiave.']
 *   ['kollokation','caffè', 'Was passt: un ___ caffè?', 'forte', 'grande', 'alto']
 *
 * `term` bleibt in jeder Zeile an derselben Stelle: Er verbindet die Übung mit
 * der Karte im Deck, damit sich später „Übung zu diesem Wort" anbieten lässt.
 */
export type VokRow =
  | ['bedeutung', string, string, string, string]
  | ['luecke', string, string, string]
  | ['produktion', string, string, string]
  | ['kollokation', string, string, string, string, string];

export function buildVocab(lang: string, level: CefrLevel, rows: VokRow[]): Exercise[] {
  const stufe = level.toLowerCase();
  return rows.map<Exercise>((row, i) => {
    const base = {
      id: `${lang}.wortschatz-${stufe}.${pad(i + 1)}`,
      level,
      kind: 'wortschatz' as const,
      term: row[1],
    };
    switch (row[0]) {
      case 'bedeutung': {
        const [, term, correct, w1, w2] = row;
        return {
          ...base,
          type: 'choice',
          prompt: `Was bedeutet „${term}"?`,
          answer: correct,
          options: rotate([correct, w1, w2], i),
        };
      }
      case 'luecke': {
        const [, term, prompt, translation] = row;
        return { ...base, type: 'cloze', prompt, answer: term, translation };
      }
      case 'produktion': {
        const [, term, prompt, answer] = row;
        return { ...base, term, type: 'translate', prompt, answer };
      }
      case 'kollokation': {
        const [, term, prompt, correct, w1, w2] = row;
        return {
          ...base,
          type: 'choice',
          prompt,
          answer: correct,
          options: rotate([correct, w1, w2], i),
          hint: `Es geht um „${term}".`,
        };
      }
    }
  });
}
