# Sprint Italienisch A2 → B1 — Bauplan

Verbindliche Zuordnung für die 30 Tagesdateien. Wer eine Datei nachträgt oder
korrigiert, hält sich an diese Tabelle: Thema und Grammatikmuster eines Tages
sind Bezugspunkt für die Wiederholungen der Folgetage.

## Parameter

| Wert | |
| --- | --- |
| Zielsprache | Italienisch (it-IT) |
| Erklärungssprache | Deutsch |
| Ausgangsniveau | A2 |
| Zielniveau | B1 |
| Tage | 30 |
| Neue Vokabeln gesamt | 1350 (45 pro Tag, ohne Rest) |
| Lernzeit pro Tag | 40 Minuten |
| Übungen pro Tag | 12 neue + 5 Wiederholung + 1 Verständnis (3 Fragen) + 1 Produktion |

## Anpassung der Wochenvorgabe an A2 → B1

Die Vorlage beschreibt Woche 1 als Anfängerstoff (Begrüßung, Personalpronomen,
Artikel). Auf A2 ist das bekannt. Die Themenreihenfolge bleibt, das Niveau
steigt: aus „Artikel" wird `preposizioni articolate`, aus „Personalpronomen"
werden Objektpronomen, aus „Verneinung" die doppelte Verneinung.

## Tagesraster

| Tag | Woche | Vokabelthema | Grammatikmuster (slug) | Niveau |
| --- | --- | --- | --- | --- |
| 1 | 1 | Begrüßung, Vorstellung, Small Talk | it-presente-irregolare | A2 |
| 2 | 1 | Familie, Personen, Beziehungen | it-preposizioni-articolate | A2 |
| 3 | 1 | Zahlen, Uhrzeit, Datum, Termine | it-plurale-irregolare | A2 |
| 4 | 1 | Alltag, Tagesablauf, Haushalt | it-doppia-negazione | A2 |
| 5 | 1 | Essen und Trinken | it-interrogativi-avanzati | A2 |
| 6 | 1 | Restaurant und Bar | it-pronomi-diretti | A2 |
| 7 | 1 | Einkaufen, Preise, Geschäfte | it-pronomi-indiretti (+ Wochenwiederholung) | A2 |
| 8 | 2 | Wohnen: Wohnung und Möbel | it-passato-avere | A2 |
| 9 | 2 | Stadt und Orientierung | it-passato-essere | A2 |
| 10 | 2 | Verkehr und Wege | it-riflessivi | A2 |
| 11 | 2 | Reisen: Hotel und Unterkunft | it-imperfetto | A2 |
| 12 | 2 | Reisen: Bahn, Flug, Gepäck | it-passato-vs-imperfetto | A2 |
| 13 | 2 | Wetter und Jahreszeiten | it-ne-ci | A2 |
| 14 | 2 | Zeitangaben und Häufigkeit | it-pronomi-combinati (+ Wochenwiederholung) | B1 |
| 15 | 3 | Arbeit und Beruf | it-futuro | A2 |
| 16 | 3 | Büro, Telefon, E-Mail | it-imperativo | A2 |
| 17 | 3 | Studium und Ausbildung | it-condizionale | A2 |
| 18 | 3 | Freizeit und Hobbys | it-comparativo | A2 |
| 19 | 3 | Sport und Bewegung | it-relative-che | A2 |
| 20 | 3 | Medien, Internet, Technik | it-stare-gerundio | A2 |
| 21 | 3 | Kultur: Musik, Film, Bücher | it-connettivi (+ Wochenwiederholung) | A2 |
| 22 | 4 | Körper und Gesundheit | it-congiuntivo-presente | B1 |
| 23 | 4 | Arzt, Apotheke, Notfall | it-congiuntivo-espressioni | B1 |
| 24 | 4 | Gefühle und Charakter | it-ipotetico-reale | B1 |
| 25 | 4 | Meinung, Diskussion, Argumentation | it-si-impersonale | B1 |
| 26 | 4 | Geld, Bank, Verträge | it-trapassato | B1 |
| 27 | 4 | Behörden, Dokumente, Dienstleistungen | it-passivo | B1 |
| 28 | 4 | Nachrichten, Gesellschaft, Umwelt | it-discorso-indiretto (+ Wochenwiederholung) | B1 |
| 29 | 5 | Häufige Adjektive und Adverbien | it-verbi-preposizioni, it-avverbi (gemischt) | B1 |
| 30 | 5 | Redewendungen und Konnektoren | it-connettivi-b1, it-aspetto (+ Abschlussprüfung) | B1 |

## Wiederholungsrhythmus

Jeder Tag `n` wiederholt in seinen fünf Wiederholungsaufgaben:

- Tag `n-1` (frisch, meist Vokabeln in neuem Aufgabentyp)
- Tag `n-3` (Grammatik des Tages in anderer Aufgabenform)
- Tag `n-7` (Wochenabstand)
- zwei frei gewählte frühere Tage, mit wachsendem Abstand

Tage 7, 14, 21, 28 verdichten die jeweilige Woche; Tage 29 und 30 mischen den
gesamten Sprint, Tag 30 enthält die Abschlussprüfung.

## Neue Muster gegenüber `src/data/seed.ts`

Fünf Muster gab es dort noch nicht und sind nachgetragen:
`it-presente-irregolare`, `it-preposizioni-articolate`, `it-plurale-irregolare`,
`it-doppia-negazione`, `it-interrogativi-avanzati`. Alle übrigen 27 Module
verweisen auf bereits vorhandene Slugs. `npm run validate:sprint` bricht ab,
sobald ein Modul auf ein Muster zeigt, das im Startpaket fehlt.

## Vokabelauswahl

Der Sprint führt Wortschatz **oberhalb** der 1000er-Kernliste
(`src/data/italian1000.ts`) ein: Der Validator meldet aktuell null
Überschneidungen. Wo ein Wort dieselbe Form wie ein Kernwort hat, aber eine
andere Bedeutung trägt (`la pesca` = Pfirsich statt Fischerei, `il portiere` =
Portier statt Torwart), steht der Unterschied im Anwendungshinweis.

## Werkzeuge

| Befehl | Wirkung |
| --- | --- |
| `npm run validate:sprint` | Qualitätstor: Vokabelzahl, IDs, Verweise, Aufgabenvielfalt, Schwierigkeitsanstieg |
| `npm run export:sprint` | schreibt `docs/sprint-it-a2-b1.md` in der Gliederung der Kursvorgabe |
| `npm run build:sprint-exercises` | erzeugt `src/data/exercises/it.sprint.ts` für den Drills-Screen |

Nach jeder Änderung an einer Tagesdatei laufen alle drei; die erzeugten Dateien
gehören mit in den Commit.

## Was in der App ankommt

Die 480 maschinell prüfbaren Übungen liegen über `it.sprint.ts` im
Übungskatalog und erscheinen im Drills-Screen. Nicht angebunden sind die 1350
Vokabelkarten, die 31 Verständnistexte und die 32 Produktionsaufgaben: Sie
brauchen eine eigene Sprint-Ansicht, die es in der App noch nicht gibt. Bis
dahin sind sie über `SPRINT_IT_A2_B1` importierbar und vollständig in
`docs/sprint-it-a2-b1.md` dokumentiert.
