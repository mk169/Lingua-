/**
 * Baugerüst für Sprint-Tage.
 *
 * Die Tagesdateien notieren ihre Inhalte als knappe Tupel, nicht als
 * ausgeschriebene Objekte: 1350 Vokabelkarten mit je 16 Feldern wären als
 * Objektliteral weder lesbar noch im Diff prüfbar. IDs, Wochennummern und die
 * Verweise zwischen Übung und Vokabel entstehen hier – dadurch verschiebt sich
 * beim Nachtragen einer Zeile nicht der halbe Sprint.
 */

import type { CefrLevel } from '../../types';
import {
  APP_TYPE,
  type Aufgabentyp,
  type Schwierigkeit,
  type SprintComprehension,
  type SprintDay,
  type SprintExercise,
  type SprintGrammar,
  type SprintProduction,
  type SprintVocab,
} from './types';

const PREFIX = 'it.a2b1';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Tag 1–7 → Woche 1, … Tag 29–30 → Woche 5. */
export function wocheVon(tag: number): number {
  return Math.ceil(tag / 7);
}

export function vokabelId(tag: number, index: number): string {
  return `${PREFIX}.v.d${pad2(tag)}.${pad2(index)}`;
}

/**
 * Löst die Kurzschreibweise für Vokabelverweise auf.
 *
 * `"3,7"` meint die Vokabeln 3 und 7 desselben Tages, `"d05:12"` die zwölfte
 * Vokabel von Tag 5. Ohne die Kurzform stünde in jeder Übungszeile dreimal
 * `it.a2b1.v.d05.12` – der eigentliche Inhalt ginge darin unter.
 */
export function refsAufloesen(refs: string, tag: number): string[] {
  if (!refs.trim()) return [];
  return refs
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const fremd = /^d(\d{1,2}):(\d{1,2})$/.exec(raw);
      if (fremd) return vokabelId(Number(fremd[1]), Number(fremd[2]));
      return vokabelId(tag, Number(raw));
    });
}

function liste(csv: string): string[] {
  return csv
    .split(/\s*\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** [Wort, Bedeutung, Wortart, Genus, Plural, Grundform, Aussprache, Beispiel IT, Beispiel DE, Hinweis, Grad, Tags] */
export type VokabelRow = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  Schwierigkeit,
  string,
];

/** [Typ, Grad, Anweisung, Aufgabe, Optionen, Antwort, Alternativen, Erklärung, Vokabelverweise, Grammatik] */
export type UebungRow = [
  Aufgabentyp,
  Schwierigkeit,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export interface GrammarInput {
  slug: string;
  level: CefrLevel;
  titel: string;
  erklaerung: string;
  muster: string;
  beispiele: [string, string][];
  fehler: string[];
}

export interface ComprehensionInput {
  thema?: string;
  text: string;
  uebersetzung: string;
  fragen: [string, string][];
  vokabeln: string;
  grammatik: string[];
}

export interface ProductionInput {
  thema?: string;
  anweisung: string;
  mindestanforderung: string;
  grammatik: string[];
  vokabeln: string;
  beispiel: string;
  beispielDeutsch: string;
  kriterien: string[];
}

export interface DayInput {
  tag: number;
  thema: string;
  ziel: string;
  zusammenfassung: string;
  grammatik: GrammarInput[];
  vokabeln: VokabelRow[];
  uebungen: UebungRow[];
  wiederholung: UebungRow[];
  verstaendnis: ComprehensionInput[];
  produktion: ProductionInput[];
}

function baueUebungen(
  rows: UebungRow[],
  tag: number,
  woche: number,
  thema: string,
  kind: 'e' | 'r',
): SprintExercise[] {
  return rows.map(
    ([typ, grad, anweisung, aufgabe, optionen, antwort, alternativen, erklaerung, refs, grammatik], i) => {
      const opts = liste(optionen);
      const alts = liste(alternativen);
      return {
        exercise_id: `${PREFIX}.${kind}.d${pad2(tag)}.${pad2(i + 1)}`,
        tag,
        woche,
        thema,
        aufgabentyp: typ,
        app_type: APP_TYPE[typ],
        schwierigkeitsgrad: grad,
        anweisung_deutsch: anweisung,
        aufgabe_zielsprache: aufgabe,
        ...(opts.length ? { optionen: opts } : {}),
        richtige_antwort: antwort,
        ...(alts.length ? { moegliche_alternative_antworten: alts } : {}),
        kurze_loesungserklaerung: erklaerung,
        verwendete_vokabel_ids: refsAufloesen(refs, tag),
        getestete_grammatik: grammatik,
        wiederholung: kind === 'r',
      };
    },
  );
}

/** Baut einen Tag aus seiner Kurznotation zu vollständigen Datensätzen aus. */
export function day(input: DayInput): SprintDay {
  const { tag, thema } = input;
  const woche = wocheVon(tag);

  const vokabeln: SprintVocab[] = input.vokabeln.map(
    (
      [wort, bedeutung, wortart, genus, plural, grundform, aussprache, bIt, bDe, hinweis, grad, tags],
      i,
    ) => ({
      id: vokabelId(tag, i + 1),
      tag,
      woche,
      thema,
      wort_zielsprache: wort,
      bedeutung_deutsch: bedeutung,
      wortart,
      ...(genus ? { genus } : {}),
      ...(plural ? { plural } : {}),
      ...(grundform ? { grundform } : {}),
      ...(aussprache ? { aussprachehilfe: aussprache } : {}),
      beispielsatz_zielsprache: bIt,
      beispielsatz_deutsch: bDe,
      kurzer_anwendungshinweis: hinweis,
      schwierigkeitsgrad: grad,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    }),
  );

  const uebungen = baueUebungen(input.uebungen, tag, woche, thema, 'e');
  const wiederholung = baueUebungen(input.wiederholung, tag, woche, thema, 'r');
  const alleUebungen = [...uebungen, ...wiederholung];

  const grammatik: SprintGrammar[] = input.grammatik.map((g) => ({
    module_id: `${PREFIX}.g.${g.slug}`,
    slug: g.slug,
    tag,
    woche,
    level: g.level,
    titel: g.titel,
    kurze_erklaerung: g.erklaerung,
    grammatisches_muster: g.muster,
    beispiele: g.beispiele.map(([target, native]) => ({ target, native })),
    typische_fehler: g.fehler,
    uebungs_ids: alleUebungen
      .filter((u) => u.getestete_grammatik === g.slug)
      .map((u) => u.exercise_id),
  }));

  const verstaendnis: SprintComprehension[] = input.verstaendnis.map((c, i) => ({
    comprehension_id: `${PREFIX}.c.d${pad2(tag)}.${pad2(i + 1)}`,
    tag,
    woche,
    thema: c.thema ?? thema,
    text_zielsprache: c.text,
    uebersetzung_deutsch: c.uebersetzung,
    fragen: c.fragen.map(([frage, loesung]) => ({ frage, loesung })),
    verwendete_vokabel_ids: refsAufloesen(c.vokabeln, tag),
    getestete_grammatik: c.grammatik,
  }));

  const produktion: SprintProduction[] = input.produktion.map((p, i) => ({
    production_id: `${PREFIX}.p.d${pad2(tag)}.${pad2(i + 1)}`,
    tag,
    woche,
    thema: p.thema ?? thema,
    anweisung_deutsch: p.anweisung,
    mindestanforderung: p.mindestanforderung,
    zu_verwendende_grammatik: p.grammatik,
    zu_verwendende_vokabel_ids: refsAufloesen(p.vokabeln, tag),
    beispielantwort_zielsprache: p.beispiel,
    beispielantwort_deutsch: p.beispielDeutsch,
    bewertungskriterien: p.kriterien,
  }));

  return {
    tag,
    woche,
    thema,
    tagesziel: input.ziel,
    zusammenfassung: input.zusammenfassung,
    grammatik,
    vokabeln,
    uebungen,
    wiederholung,
    verstaendnis,
    produktion,
  };
}
