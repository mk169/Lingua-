/**
 * Datentypen für einen 30-Tage-Sprint.
 *
 * Anders als die Startpakete in `src/data/seed.ts` beschreibt ein Sprint einen
 * kompletten Lernweg: pro Tag Vokabelkarten, Grammatikmodule, Übungen,
 * Verständnis- und Produktionsaufgaben sowie geplante Wiederholungen.
 * Die Startpakete bleiben davon unberührt – ein Sprint ist eine zusätzliche
 * Sicht auf denselben Wortschatz, keine Ablösung.
 */

import type { CefrLevel, ExerciseType } from '../../types';

export type Schwierigkeit = 1 | 2 | 3;

/**
 * Aufgabentypen des Sprints.
 *
 * Feiner geschnitten als die vier `ExerciseType`-Werte der App, weil die
 * Anweisung an den Lernenden davon abhängt: "Verneine den Satz" und "Bilde die
 * Frage" sind beides `transform`, verlangen aber Verschiedenes.
 */
export type Aufgabentyp =
  | 'de-it' // Deutsch → Italienisch übersetzen
  | 'it-de' // Italienisch → Deutsch übersetzen
  | 'lueckentext'
  | 'verbform'
  | 'artikel'
  | 'endung'
  | 'praeposition'
  | 'satzbau'
  | 'fehler'
  | 'auswahl'
  | 'frage-bilden'
  | 'antworten'
  | 'verneinen'
  | 'zu-frage'
  | 'plural'
  | 'dialog'
  | 'kontext'
  | 'eigener-satz'
  | 'nachricht'
  | 'situation';

/** Auf welchen App-Übungstyp ein Sprint-Aufgabentyp abgebildet wird. */
export const APP_TYPE: Record<Aufgabentyp, ExerciseType> = {
  'de-it': 'translate',
  'it-de': 'translate',
  lueckentext: 'cloze',
  verbform: 'cloze',
  artikel: 'cloze',
  endung: 'cloze',
  praeposition: 'cloze',
  satzbau: 'order',
  fehler: 'transform',
  auswahl: 'choice',
  'frage-bilden': 'transform',
  antworten: 'build',
  verneinen: 'transform',
  'zu-frage': 'transform',
  plural: 'transform',
  dialog: 'cloze',
  kontext: 'build',
  'eigener-satz': 'build',
  nachricht: 'build',
  situation: 'build',
};

export interface SprintVocab {
  id: string;
  tag: number;
  woche: number;
  thema: string;
  wort_zielsprache: string;
  bedeutung_deutsch: string;
  wortart: string;
  /** Nur bei Nomen: 'm' | 'f' | 'm/f' | 'pl'. */
  genus?: string;
  plural?: string;
  /** Bei gebeugten Formen und Verben der Infinitiv. */
  grundform?: string;
  /** Nur wo die Schrift täuscht: Betonung, gl/gn/sc, c/g vor Vokal. */
  aussprachehilfe?: string;
  beispielsatz_zielsprache: string;
  beispielsatz_deutsch: string;
  kurzer_anwendungshinweis: string;
  schwierigkeitsgrad: Schwierigkeit;
  tags: string[];
}

export interface SprintGrammar {
  module_id: string;
  /** Bezug zum Muster im Startpaket, z.B. "it-imperfetto". */
  slug: string;
  tag: number;
  woche: number;
  level: CefrLevel;
  titel: string;
  kurze_erklaerung: string;
  grammatisches_muster: string;
  beispiele: { target: string; native: string }[];
  typische_fehler: string[];
  /** Wird beim Bauen aus den Übungen des Tages gefüllt. */
  uebungs_ids: string[];
}

export interface SprintExercise {
  exercise_id: string;
  tag: number;
  woche: number;
  thema: string;
  aufgabentyp: Aufgabentyp;
  /** Abbildung auf den Übungstyp der App. */
  app_type: ExerciseType;
  schwierigkeitsgrad: Schwierigkeit;
  anweisung_deutsch: string;
  /**
   * Der Aufgabentext. Bei `de-it` steht hier bewusst Deutsch – der Lernende
   * produziert die Zielsprache erst in der Antwort.
   */
  aufgabe_zielsprache: string;
  optionen?: string[];
  richtige_antwort: string;
  moegliche_alternative_antworten?: string[];
  kurze_loesungserklaerung: string;
  verwendete_vokabel_ids: string[];
  getestete_grammatik: string;
  /** true = Wiederholungsaufgabe zu früherem Stoff. */
  wiederholung: boolean;
}

export interface SprintComprehension {
  comprehension_id: string;
  tag: number;
  woche: number;
  thema: string;
  text_zielsprache: string;
  uebersetzung_deutsch: string;
  fragen: { frage: string; loesung: string }[];
  verwendete_vokabel_ids: string[];
  getestete_grammatik: string[];
}

export interface SprintProduction {
  production_id: string;
  tag: number;
  woche: number;
  thema: string;
  anweisung_deutsch: string;
  mindestanforderung: string;
  zu_verwendende_grammatik: string[];
  zu_verwendende_vokabel_ids: string[];
  beispielantwort_zielsprache: string;
  beispielantwort_deutsch: string;
  bewertungskriterien: string[];
}

export interface SprintDay {
  tag: number;
  woche: number;
  thema: string;
  tagesziel: string;
  zusammenfassung: string;
  grammatik: SprintGrammar[];
  vokabeln: SprintVocab[];
  uebungen: SprintExercise[];
  wiederholung: SprintExercise[];
  verstaendnis: SprintComprehension[];
  produktion: SprintProduction[];
}

export interface Sprint {
  id: string;
  sprache: string;
  sprachcode: string;
  erklaerungssprache: string;
  ausgangsniveau: CefrLevel;
  zielniveau: CefrLevel;
  tage: number;
  vokabelnGesamt: number;
  lernzeitProTag: number;
  days: SprintDay[];
}
