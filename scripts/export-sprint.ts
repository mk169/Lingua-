/**
 * Schreibt den Sprint als Markdown-Dokument in der von der Kursvorgabe
 * verlangten Gliederung: Kursübersicht, dann Woche für Woche, Tag für Tag.
 *
 * Die Daten bleiben die Quelle; dieses Dokument ist die lesbare Ansicht davon
 * und wird nie von Hand bearbeitet.
 *
 *   npm run export:sprint
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { SPRINT_IT_A2_B1 } from '../src/data/sprint/it-a2-b1';
import type { Sprint, SprintDay, SprintExercise } from '../src/data/sprint/types';

const sprint: Sprint = SPRINT_IT_A2_B1;
const out: string[] = [];
const w = (line = '') => out.push(line);

function feld(name: string, wert: string | undefined): string | null {
  return wert && wert.trim() ? `**${name}:** ${wert}` : null;
}

function uebung(u: SprintExercise): void {
  w(`**${u.exercise_id}** · ${u.aufgabentyp} · Schwierigkeit ${u.schwierigkeitsgrad} · ${u.getestete_grammatik}`);
  w();
  w(`> ${u.anweisung_deutsch}`);
  w();
  w('```');
  w(u.aufgabe_zielsprache);
  w('```');
  if (u.optionen?.length) w(`Optionen: ${u.optionen.join(' · ')}`);
  w(`Lösung: **${u.richtige_antwort}**`);
  if (u.moegliche_alternative_antworten?.length) {
    w(`Auch richtig: ${u.moegliche_alternative_antworten.join(' · ')}`);
  }
  w(`Erklärung: ${u.kurze_loesungserklaerung}`);
  if (u.verwendete_vokabel_ids.length) {
    w(`Vokabeln: ${u.verwendete_vokabel_ids.join(', ')}`);
  }
  w();
}

// ── Kursübersicht ──────────────────────────────────────────────────────────

w(`# Kursübersicht`);
w();
w(`- **Zielsprache:** ${sprint.sprache} (${sprint.sprachcode})`);
w(`- **Erklärungssprache:** ${sprint.erklaerungssprache}`);
w(`- **Ausgangsniveau:** ${sprint.ausgangsniveau}`);
w(`- **Zielniveau:** ${sprint.zielniveau}`);
w(`- **Anzahl der Tage:** ${sprint.tage}`);
w(`- **Gesamtzahl der neuen Vokabeln:** ${sprint.vokabelnGesamt}`);
w(`- **Lernzeit pro Tag:** ${sprint.lernzeitProTag} Minuten`);
w();

const wochen = [...new Set(sprint.days.map((d) => d.woche))].sort((a, b) => a - b);

w(`## Themen pro Woche`);
w();
for (const woche of wochen) {
  const tage = sprint.days.filter((d) => d.woche === woche);
  w(`**Woche ${woche} (Tag ${tage[0].tag}–${tage[tage.length - 1].tag})**`);
  for (const d of tage) w(`- Tag ${d.tag}: ${d.thema}`);
  w();
}

w(`## Grammatik pro Woche`);
w();
for (const woche of wochen) {
  const tage = sprint.days.filter((d) => d.woche === woche);
  w(`**Woche ${woche}**`);
  for (const d of tage) {
    for (const g of d.grammatik) w(`- Tag ${d.tag}: ${g.titel} (\`${g.slug}\`, ${g.level})`);
  }
  w();
}

w(`## Verteilung der Vokabeln auf die Tage`);
w();
w(`| Tag | Woche | Thema | Neue Vokabeln | Übungen | Wiederholung |`);
w(`| --- | --- | --- | --- | --- | --- |`);
for (const d of sprint.days) {
  w(`| ${d.tag} | ${d.woche} | ${d.thema} | ${d.vokabeln.length} | ${d.uebungen.length} | ${d.wiederholung.length} |`);
}
const summe = sprint.days.reduce((n, d) => n + d.vokabeln.length, 0);
w(`| **Summe** | | | **${summe}** | | |`);
w();

// ── Tage ───────────────────────────────────────────────────────────────────

function tag(d: SprintDay): void {
  w(`## Tag ${d.tag} — ${d.thema}`);
  w();

  w(`### Tagesziel`);
  w();
  w(d.tagesziel);
  w();

  w(`### Grammatikmodule`);
  w();
  for (const g of d.grammatik) {
    w(`#### ${g.titel}`);
    w();
    w(`**module_id:** \`${g.module_id}\` · **Tag ${g.tag}** · **Woche ${g.woche}** · **Niveau ${g.level}**`);
    w();
    w(g.kurze_erklaerung);
    w();
    w(`**Muster:** ${g.grammatisches_muster}`);
    w();
    w(`| Italienisch | Deutsch |`);
    w(`| --- | --- |`);
    for (const b of g.beispiele) w(`| ${b.target} | ${b.native} |`);
    w();
    w(`**Typische Fehler**`);
    w();
    for (const f of g.typische_fehler) w(`- ${f}`);
    w();
    w(`**Übungen zu diesem Modul:** ${g.uebungs_ids.join(', ')}`);
    w();
  }

  w(`### Neue Vokabelkarten`);
  w();
  for (const v of d.vokabeln) {
    w(`**${v.id} — ${v.wort_zielsprache}** · ${v.bedeutung_deutsch}`);
    w();
    const kopf = [
      `Wortart: ${v.wortart}`,
      ...(v.genus ? [`Genus: ${v.genus}`] : []),
      ...(v.plural ? [`Plural: ${v.plural}`] : []),
      ...(v.grundform ? [`Grundform: ${v.grundform}`] : []),
      ...(v.aussprachehilfe ? [`Aussprache: ${v.aussprachehilfe}`] : []),
      `Schwierigkeit: ${v.schwierigkeitsgrad}`,
      `Thema: ${v.thema}`,
      `Tags: ${v.tags.join(', ')}`,
    ];
    w(kopf.join(' · '));
    w();
    w(`> ${v.beispielsatz_zielsprache}`);
    w(`> ${v.beispielsatz_deutsch}`);
    w();
    w(`Hinweis: ${v.kurzer_anwendungshinweis}`);
    w();
  }

  w(`### Übungen`);
  w();
  for (const u of d.uebungen) uebung(u);

  w(`### Verständnisaufgaben`);
  w();
  for (const c of d.verstaendnis) {
    w(`**${c.comprehension_id}** · ${c.thema} · Grammatik: ${c.getestete_grammatik.join(', ')}`);
    w();
    w(c.text_zielsprache.split('\n').map((l) => (l.trim() ? `> ${l}` : '>')).join('\n'));
    w();
    w(`<details><summary>Deutsche Übersetzung</summary>`);
    w();
    w(c.uebersetzung_deutsch.split('\n').map((l) => (l.trim() ? `> ${l}` : '>')).join('\n'));
    w();
    w(`</details>`);
    w();
    w(`**Fragen**`);
    w();
    c.fragen.forEach((f, i) => w(`${i + 1}. ${f.frage} — *${f.loesung}*`));
    w();
    if (c.verwendete_vokabel_ids.length) w(`Vokabeln: ${c.verwendete_vokabel_ids.join(', ')}`);
    w();
  }

  w(`### Freie Produktion`);
  w();
  for (const p of d.produktion) {
    w(`**${p.production_id}** · ${p.thema}`);
    w();
    w(`> ${p.anweisung_deutsch.split('\n').join('\n> ')}`);
    w();
    w(
      [
        feld('Mindestanforderung', p.mindestanforderung),
        feld('Zu verwendende Grammatik', p.zu_verwendende_grammatik.join(', ')),
        feld('Zu verwendende Vokabeln', p.zu_verwendende_vokabel_ids.join(', ')),
      ]
        .filter(Boolean)
        .join('  \n'),
    );
    w();
    w(`**Beispielantwort**`);
    w();
    w(p.beispielantwort_zielsprache.split('\n').map((l) => (l.trim() ? `> ${l}` : '>')).join('\n'));
    w();
    w(`<details><summary>Deutsche Übersetzung</summary>`);
    w();
    w(p.beispielantwort_deutsch.split('\n').map((l) => (l.trim() ? `> ${l}` : '>')).join('\n'));
    w();
    w(`</details>`);
    w();
    w(`**Bewertungskriterien**`);
    w();
    for (const k of p.bewertungskriterien) w(`- ${k}`);
    w();
  }

  w(`### Wiederholung`);
  w();
  for (const u of d.wiederholung) uebung(u);

  w(`### Tageszusammenfassung`);
  w();
  w(d.zusammenfassung);
  w();
}

for (const woche of wochen) {
  const tage = sprint.days.filter((d) => d.woche === woche);
  w(`# Woche ${woche}`);
  w();
  for (const d of tage) tag(d);
}

const ziel = join(import.meta.dirname, '../docs/sprint-it-a2-b1.md');
mkdirSync(dirname(ziel), { recursive: true });
writeFileSync(ziel, out.join('\n'), 'utf8');

const zeichen = out.join('\n').length;
console.log(`Geschrieben: docs/sprint-it-a2-b1.md (${out.length} Zeilen, ${Math.round(zeichen / 1024)} KB)`);
