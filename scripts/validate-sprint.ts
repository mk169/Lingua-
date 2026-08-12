/**
 * Qualitätstor für den 30-Tage-Sprint.
 *
 * Prüft genau die Zusagen, die der Sprint macht: exakte Vokabelzahl, keine
 * doppelten IDs, keine kaputten Verweise, jede Übung mit Lösung und Erklärung,
 * ausreichende Aufgabenvielfalt. Ein Sprint mit einem Verweis ins Leere würde
 * sonst live gehen und den Lernenden bei der Wiederholung ins Nichts schicken.
 *
 *   npm run validate:sprint
 */

import { SPRINT_IT_A2_B1 } from '../src/data/sprint/it-a2-b1';
import { ITALIAN_1000 } from '../src/data/italian1000';
import { SEED_LANGUAGES } from '../src/data/seed';
import type { SprintExercise } from '../src/data/sprint/types';

const sprint = SPRINT_IT_A2_B1;
const problems: string[] = [];
const warnings: string[] = [];

function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

// ── Struktur ───────────────────────────────────────────────────────────────

if (sprint.days.length !== sprint.tage) {
  problems.push(`Es sind ${sprint.days.length} Tage statt ${sprint.tage}.`);
}
sprint.days.forEach((d, i) => {
  if (d.tag !== i + 1) problems.push(`Tag an Position ${i + 1} trägt die Nummer ${d.tag}.`);
  if (!d.tagesziel.trim()) problems.push(`Tag ${d.tag}: kein Tagesziel.`);
  if (!d.zusammenfassung.trim()) problems.push(`Tag ${d.tag}: keine Zusammenfassung.`);
  if (!d.grammatik.length) problems.push(`Tag ${d.tag}: kein Grammatikmodul.`);
  if (!d.uebungen.length) problems.push(`Tag ${d.tag}: keine Übungen.`);
  if (!d.wiederholung.length) problems.push(`Tag ${d.tag}: keine Wiederholung.`);
  if (!d.verstaendnis.length) problems.push(`Tag ${d.tag}: keine Verständnisaufgabe.`);
  if (!d.produktion.length) problems.push(`Tag ${d.tag}: keine Produktionsaufgabe.`);
});

// ── Vokabeln ───────────────────────────────────────────────────────────────

const alleVokabeln = sprint.days.flatMap((d) => d.vokabeln);
if (alleVokabeln.length !== sprint.vokabelnGesamt) {
  problems.push(
    `Vokabelzahl: ${alleVokabeln.length} statt der zugesagten ${sprint.vokabelnGesamt}.`,
  );
}
for (const d of sprint.days) {
  const pro = sprint.vokabelnGesamt / sprint.tage;
  if (d.vokabeln.length !== pro) {
    problems.push(`Tag ${d.tag}: ${d.vokabeln.length} Vokabeln statt ${pro}.`);
  }
}

const vokabelIds = new Set<string>();
const gesehenesWort = new Map<string, number>();
for (const v of alleVokabeln) {
  if (vokabelIds.has(v.id)) problems.push(`Doppelte Vokabel-ID: ${v.id}`);
  vokabelIds.add(v.id);

  if (!v.beispielsatz_zielsprache.trim() || !v.beispielsatz_deutsch.trim()) {
    problems.push(`${v.id} (${v.wort_zielsprache}): Beispielsatz fehlt.`);
  }
  if (!v.kurzer_anwendungshinweis.trim()) {
    problems.push(`${v.id} (${v.wort_zielsprache}): kein Anwendungshinweis.`);
  }
  if (!v.tags.length) problems.push(`${v.id} (${v.wort_zielsprache}): keine Tags.`);
  if (v.wortart === 'Nomen' && !v.genus) {
    problems.push(`${v.id} (${v.wort_zielsprache}): Nomen ohne Genus.`);
  }
  const kern = norm(v.wort_zielsprache);
  const schon = gesehenesWort.get(kern);
  if (schon !== undefined) {
    problems.push(`Vokabel doppelt: "${v.wort_zielsprache}" an Tag ${schon} und Tag ${v.tag}.`);
  } else {
    gesehenesWort.set(kern, v.tag);
  }
}

/** Überschneidung mit dem A1/A2-Kerndeck – erlaubt, aber sichtbar. */
const kern1000 = new Set(ITALIAN_1000.map((w) => norm(w[0])));
const ueberschneidung = alleVokabeln.filter((v) => kern1000.has(norm(v.wort_zielsprache)));
if (ueberschneidung.length) {
  warnings.push(
    `${ueberschneidung.length} Vokabeln stehen auch in italian1000.ts: ` +
      ueberschneidung.map((v) => v.wort_zielsprache).join(', '),
  );
}

// ── Übungen ────────────────────────────────────────────────────────────────

const alleUebungen: SprintExercise[] = sprint.days.flatMap((d) => [...d.uebungen, ...d.wiederholung]);
const uebungIds = new Set<string>();
const typZaehler = new Map<string, number>();

for (const u of alleUebungen) {
  if (uebungIds.has(u.exercise_id)) problems.push(`Doppelte Übungs-ID: ${u.exercise_id}`);
  uebungIds.add(u.exercise_id);

  if (!u.anweisung_deutsch.trim()) problems.push(`${u.exercise_id}: keine Anweisung.`);
  if (!u.aufgabe_zielsprache.trim()) problems.push(`${u.exercise_id}: keine Aufgabe.`);
  if (!u.richtige_antwort.trim()) problems.push(`${u.exercise_id}: keine Lösung.`);
  if (!u.kurze_loesungserklaerung.trim()) problems.push(`${u.exercise_id}: keine Lösungserklärung.`);
  if (!u.getestete_grammatik.trim()) problems.push(`${u.exercise_id}: kein Grammatikbezug.`);

  if (u.app_type === 'choice') {
    if (!u.optionen || u.optionen.length < 2) {
      problems.push(`${u.exercise_id}: Auswahlaufgabe ohne Optionen.`);
    } else if (!u.optionen.some((o) => norm(o) === norm(u.richtige_antwort))) {
      problems.push(`${u.exercise_id}: die Lösung steht nicht unter den Optionen.`);
    }
  }
  for (const id of u.verwendete_vokabel_ids) {
    if (!vokabelIds.has(id)) problems.push(`${u.exercise_id}: Verweis auf unbekannte Vokabel ${id}.`);
  }

  typZaehler.set(u.aufgabentyp, (typZaehler.get(u.aufgabentyp) ?? 0) + 1);
}

/** Die Vorgabe verlangt ausdrücklich, dass nicht überwiegend angekreuzt wird. */
const auswahlAnteil = (typZaehler.get('auswahl') ?? 0) / alleUebungen.length;
if (auswahlAnteil > 0.2) {
  problems.push(`Zu viele Auswahlaufgaben: ${Math.round(auswahlAnteil * 100)} % (erlaubt: 20 %).`);
}
if (typZaehler.size < 12) {
  problems.push(`Nur ${typZaehler.size} verschiedene Aufgabentypen, erwartet mindestens 12.`);
}

/**
 * Frei produzierende Typen: der Lernende formuliert einen ganzen Satz selbst,
 * statt eine Form einzusetzen. Entscheidend ist nicht der Gesamtanteil, sondern
 * dass kein einziger Tag ohne freie Produktion bleibt – ein Sprint mit einer
 * produktionsfreien Woche wäre auch bei gutem Durchschnitt ein schlechter Plan.
 */
const produktiv = new Set(['de-it', 'eigener-satz', 'nachricht', 'situation', 'kontext', 'antworten']);
const produktivAnteil =
  [...produktiv].reduce((n, t) => n + (typZaehler.get(t) ?? 0), 0) / alleUebungen.length;
for (const d of sprint.days) {
  const frei = [...d.uebungen, ...d.wiederholung].filter((u) => produktiv.has(u.aufgabentyp));
  if (!frei.length) problems.push(`Tag ${d.tag}: keine frei produzierende Übung.`);
}

/** Anteil der Aufgaben, bei denen überhaupt etwas geschrieben wird. */
const schreibAnteil = 1 - auswahlAnteil;
if (schreibAnteil < 0.7) {
  problems.push(`Zu wenig selbst zu schreibende Aufgaben: ${Math.round(schreibAnteil * 100)} %.`);
}

// ── Grammatikmodule ────────────────────────────────────────────────────────

const moduleIds = new Set<string>();
const slugs = new Set<string>();
for (const d of sprint.days) {
  for (const g of d.grammatik) {
    if (moduleIds.has(g.module_id)) problems.push(`Doppelte Modul-ID: ${g.module_id}`);
    moduleIds.add(g.module_id);
    slugs.add(g.slug);
    if (g.beispiele.length < 3) problems.push(`${g.module_id}: weniger als drei Beispiele.`);
    if (g.typische_fehler.length < 3) problems.push(`${g.module_id}: weniger als drei typische Fehler.`);
    if (!g.grammatisches_muster.trim()) problems.push(`${g.module_id}: kein Muster.`);
    if (g.uebungs_ids.length < 3) {
      problems.push(`${g.module_id}: nur ${g.uebungs_ids.length} zugeordnete Übungen.`);
    }
  }
}

/** Muster, die es im Startpaket noch nicht gibt, müssen dort nachgetragen werden. */
const seedSlugs = new Set(
  SEED_LANGUAGES.flatMap((l) => l.patterns.map((p) => p.slug).filter((s): s is string => !!s)),
);
const fehlendeSlugs = [...slugs].filter((s) => !seedSlugs.has(s));
if (fehlendeSlugs.length) {
  problems.push(`Muster ohne Eintrag in seed.ts: ${fehlendeSlugs.join(', ')}`);
}

// ── Verständnis und Produktion ─────────────────────────────────────────────

const textIds = new Set<string>();
for (const d of sprint.days) {
  for (const c of d.verstaendnis) {
    if (textIds.has(c.comprehension_id)) problems.push(`Doppelte ID: ${c.comprehension_id}`);
    textIds.add(c.comprehension_id);
    if (c.fragen.length < 3) problems.push(`${c.comprehension_id}: weniger als drei Fragen.`);
    if (!c.uebersetzung_deutsch.trim()) problems.push(`${c.comprehension_id}: keine Übersetzung.`);
    for (const f of c.fragen) {
      if (!f.loesung.trim()) problems.push(`${c.comprehension_id}: Frage ohne Lösung.`);
    }
    for (const id of c.verwendete_vokabel_ids) {
      if (!vokabelIds.has(id)) problems.push(`${c.comprehension_id}: unbekannte Vokabel ${id}.`);
    }
  }
  for (const p of d.produktion) {
    if (textIds.has(p.production_id)) problems.push(`Doppelte ID: ${p.production_id}`);
    textIds.add(p.production_id);
    if (!p.beispielantwort_zielsprache.trim()) problems.push(`${p.production_id}: keine Beispielantwort.`);
    if (!p.beispielantwort_deutsch.trim()) problems.push(`${p.production_id}: keine Übersetzung.`);
    if (p.bewertungskriterien.length < 3) problems.push(`${p.production_id}: zu wenige Kriterien.`);
    if (!p.mindestanforderung.trim()) problems.push(`${p.production_id}: keine Mindestanforderung.`);
    for (const id of p.zu_verwendende_vokabel_ids) {
      if (!vokabelIds.has(id)) problems.push(`${p.production_id}: unbekannte Vokabel ${id}.`);
    }
  }
}

// ── Wiederholung: greift jeder Tag wirklich zurück? ────────────────────────

/** Wann ein Grammatikmuster zum ersten Mal dran war. */
const slugEingefuehrt = new Map<string, number>();
for (const d of sprint.days) {
  for (const g of d.grammatik) {
    if (!slugEingefuehrt.has(g.slug)) slugEingefuehrt.set(g.slug, d.tag);
  }
}

for (const d of sprint.days.slice(1)) {
  const zurueck = d.wiederholung.some((u) => {
    const alteVokabel = u.verwendete_vokabel_ids.some((id) => {
      const m = /\.v\.d(\d\d)\./.exec(id);
      return m ? Number(m[1]) < d.tag : false;
    });
    const altesMuster = (slugEingefuehrt.get(u.getestete_grammatik) ?? d.tag) < d.tag;
    return alteVokabel || altesMuster;
  });
  if (!zurueck) {
    problems.push(`Tag ${d.tag}: keine Wiederholungsaufgabe greift auf einen früheren Tag zurück.`);
  }
}

// ── Schwierigkeit steigt ───────────────────────────────────────────────────

const schnitt = (n: number[]) => n.reduce((a, b) => a + b, 0) / n.length;
const ersteWoche = schnitt(sprint.days.slice(0, 7).flatMap((d) => d.vokabeln.map((v) => v.schwierigkeitsgrad)));
const letzteWoche = schnitt(sprint.days.slice(21, 28).flatMap((d) => d.vokabeln.map((v) => v.schwierigkeitsgrad)));
if (letzteWoche <= ersteWoche) {
  problems.push(
    `Der Schwierigkeitsgrad steigt nicht: Woche 1 = ${ersteWoche.toFixed(2)}, Woche 4 = ${letzteWoche.toFixed(2)}.`,
  );
}

// ── Ausgabe ────────────────────────────────────────────────────────────────

const inUebungen = new Set(alleUebungen.flatMap((u) => u.verwendete_vokabel_ids));
const inTexten = new Set(
  sprint.days.flatMap((d) => [
    ...d.verstaendnis.flatMap((c) => c.verwendete_vokabel_ids),
    ...d.produktion.flatMap((p) => p.zu_verwendende_vokabel_ids),
  ]),
);
const abgedeckt = new Set([...inUebungen, ...inTexten]);

console.log('Sprint', sprint.id, `(${sprint.ausgangsniveau} → ${sprint.zielniveau})`);
console.log(`  Tage:              ${sprint.days.length}`);
console.log(`  Vokabeln:          ${alleVokabeln.length}`);
console.log(`  Grammatikmodule:   ${moduleIds.size}`);
console.log(`  Übungen:           ${alleUebungen.length} (davon ${sprint.days.flatMap((d) => d.wiederholung).length} Wiederholung)`);
console.log(`  Verständnistexte:  ${sprint.days.flatMap((d) => d.verstaendnis).length}`);
console.log(`  Produktionsaufg.:  ${sprint.days.flatMap((d) => d.produktion).length}`);
console.log(`  Aufgabentypen:     ${typZaehler.size}`);
console.log(`  Auswahlanteil:     ${Math.round(auswahlAnteil * 100)} %`);
console.log(`  frei produzierend:  ${Math.round(produktivAnteil * 100)} %`);
console.log(`  selbst geschrieben: ${Math.round(schreibAnteil * 100)} %`);
console.log(`  Vokabeln in Aufgaben referenziert: ${abgedeckt.size}`);
console.log(
  `  Schwierigkeit W1 → W4: ${ersteWoche.toFixed(2)} → ${letzteWoche.toFixed(2)}`,
);

if (warnings.length) {
  console.log(`\nHinweise (${warnings.length}):`);
  for (const w of warnings) console.log(`  · ${w}`);
}

if (problems.length) {
  console.error(`\n${problems.length} Problem(e):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log('\nSprint in Ordnung.');
