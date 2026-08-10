# Lingua

Eine App zum Sprachenlernen nach dem Prinzip **Sprachskelett**: erst das tragende
Grammatikgerüst und die Hochfrequenzwörter, dann Fleisch aus Wortschatz, Input und
eigener Produktion. 30 Tage striktes Programm, danach offen und alltagstauglich.

Alles läuft im Browser, alle Daten bleiben lokal (localStorage). Die KI-Funktionen
sprechen direkt mit der Claude Messages API.

---

## Der Lernablauf

Beim Start wählt man eine Sprache – oder legt über **+** eine neue an. Jede Sprache hat
ihren eigenen 30-Tage-Sprint mit eigenem Startdatum, eigenem Deck und eigenem Fortschritt.
Das Dashboard verändert sich mit der Phase:

| Phase | Zeitraum | Fokus | Freigeschaltete Module |
| --- | --- | --- | --- |
| **1 – Fundament** | Tag 1–14 | Die 600–1000 wichtigsten Wörter und die Kerngrammatik. Bewusst reduziert: nur Review und Lesen. | Dashboard, Review, Drills, Vokabeln |
| **2 – Input** | Tag 15–30 | Verständlicher Input (i+1). Wortschatz vertiefen, neue Sätze mit Zielort-Bezug. | zusätzlich: Reader |
| **3 – Produktion & Alltag** | ab Tag 31 | Selbst produzieren: sprechen, schreiben, Gewohnheiten aufbauen. | zusätzlich: Konversation, Schreiben, Alltag |

Gesperrte Module sind in der Navigation sichtbar, aber mit Schloss markiert – der
Fokus-Modus ist Teil der Methode. Wer schneller sein will, überschreibt die Phase in den
Einstellungen.

**Tagesrhythmus** (30–45 Min, wie im Konzept): 10–15 Min Skeleton-Drills · 10–15 Min SRS ·
10–15 Min Input · 5–10 Min Output.

---

## Module

**Review (SRS)** – Karteikarten nach SM-2 mit der Intervallleiter 1/3/7/14 Tage, danach
Easiness-gesteuert. Vier Bewertungsstufen mit Intervallvorschau, Tastatursteuerung
(Leertaste, 1–4), Abfragerichtung umschaltbar, Sprachausgabe pro Karte. Pro Tag werden
automatisch 40–50 neue Wörter aus dem Pool freigeschaltet.

**Karteikarten + LLM** – Auf jeder Karte erzeugt „Neue Sätze“ frische Alltagsbeispiele mit
genau diesem Wort, mit wechselnder Zeitform und Satzart, optional auf einen Zielort bezogen.

**Skeleton-Drills** – Kerngrammatik als Minimalmuster (Satzstellung, Fragewörter,
Verneinung, Tempora, Relativsätze), nach Wochen 1–4 gegliedert, mit Formel, Erklärung und
Beispielen. Dazu interaktive Übungen in vier Typen: Lücke füllen, Umformen, Satz ordnen,
Satz bilden – mit toleranter Antwortprüfung.

**Vokabeln** – Deckverwaltung mit Filtern (aktiv, Pool, schwierige Karten). Zwei Wege für
Nachschub:
- *Generieren*: Der Wortschatz-Generator liefert die nächste Charge nach Frequenzband und
  überspringt alles, was schon im Deck ist.
- *Hochladen*: Ein Eingabefeld für eigenes Material – Vokabellisten in beliebigem Format,
  Notizen, kopierte Übungen oder ganzer Fließtext. Fehlende Übersetzungen und
  Beispielsätze werden ergänzt, Dubletten herausgefiltert. Auch als Datei-Upload.

**Reader** (Phase 2) – Erzeugt Lesetexte, die auf den bereits freigeschalteten Wörtern
aufbauen und nur 8–12 neue einführen. Jedes Wort ist antippbar und wird im Satzkontext
erklärt; bekannte Wörter sind unterstrichen. Glossar und Verständnisfragen inklusive.
Eigene Texte lassen sich einfügen.

**Konversation** (Phase 3) – Chat-Interface mit zwei parallelen Spuren pro Nachricht:
1. eine **natürliche Antwort** des Gesprächspartners, gestreamt, ausschließlich in der
   Zielsprache, auf das Niveau kalibriert;
2. eine **Analyse der eigenen Nachricht** – korrigierte Fassung, Fehler nach Art
   (Grammatik, Wortschatz, Wortstellung, Register), Erklärung, Score und Vorschläge für
   nützliche Wörter, die sich direkt ins Deck übernehmen lassen.

Beide laufen gleichzeitig, damit die Antwort nicht auf die Korrektur wartet. Situationen
sind vorgegeben (Café, Wegbeschreibung, Vorstellungsgespräch …) oder frei beschreibbar.
Eingabe per Tastatur oder Mikrofon.

**Schreiben** (Phase 3) – Tägliches Mini-Tagebuch mit wechselnden Impulsen. Die Korrektur
zeigt wiederkehrende Fehlermuster statt nur Einzelfehler.

**Alltag** (Phase 3) – Lern-Habits mit Rhythmus und Wochenbilanz, Inhalte-Bibliothek für
Bücher, Hörbücher, Artikel, Podcasts, Videos und Serien mit Fortschritt, plus die
Slot-Übersicht über alle Sprachen (eine im Fokus, weitere in Wartung).

**Sprechen** – Sprachausgabe überall über die Web Speech API. Ab Phase 3 lässt sich ein
Wort einsprechen; die Erkennung wird mit dem Zielwort verglichen und als
Übereinstimmung in Prozent zurückgemeldet.

---

## Live

**https://mk169.github.io/Lingua-/**

Jeder Besucher trägt seinen eigenen API-Schlüssel ein; es wird keiner mitgeliefert und
keiner übertragen (siehe Sicherheitshinweis unten).

---

## Setup

```bash
npm install
npm run dev
```

Öffne die App, lege eine Sprache an und trage unter **⚙ Einstellungen** einen Anthropic
API-Schlüssel ein.

Für **Spanisch, Italienisch und Französisch** ist ein Startpaket hinterlegt (Grundwortschatz
plus Kerngrammatik) – Review und Drills funktionieren damit sofort **ohne** Schlüssel.
Ebenso eigene Karten, manueller Import und der Alltags-Modus. Der Schlüssel wird gebraucht
für: Wortschatz-Generierung, Satzgenerierung, Grammatikmuster und Übungen, Reader-Texte,
Wort-Nachschlag, Konversation und Korrektur.

### Sicherheitshinweis zum API-Schlüssel

Diese App ruft die Claude API **direkt aus dem Browser** auf
(`dangerouslyAllowBrowser: true`). Der Schlüssel liegt im localStorage und ist damit für
jedes Skript auf dieser Origin lesbar. Das ist für eine lokale Ein-Personen-App vertretbar,
**nicht** für einen öffentlichen Deployment mit mehreren Nutzern. Für den Produktivbetrieb
gehört der Schlüssel hinter ein eigenes Backend, das die Aufrufe proxyt – dann entfällt
`dangerouslyAllowBrowser` und `src/lib/llm.ts` zeigt stattdessen auf den eigenen Endpunkt.

---

## Technik

React 19 · TypeScript · Vite · `@anthropic-ai/sdk` · Web Speech API. Keine weiteren
Laufzeitabhängigkeiten, kein Backend, kein Build-Schritt für CSS.

```
src/
  types.ts            Datenmodell
  store.tsx           Zustand, Persistenz und alle Domänen-Aktionen
  ui.tsx              Buttons, Karten, Modal, Toasts, Async-Wrapper
  index.css           Design-Tokens und Komponenten-Styles (Light/Dark)
  lib/
    sm2.ts            SM-2 Algorithmus, Fälligkeiten, Intervallvorschau
    phase.ts          Phasenlogik, Wochenplan, Modulfreigabe
    llm.ts            Alle Claude-Aufrufe (Prompts + JSON-Schemata)
    speech.ts         Sprachausgabe, Spracherkennung, Ähnlichkeitsmaß
    storage.ts        localStorage, Export/Import
    date.ts           Datums-Helfer
  data/seed.ts        Startpakete für Spanisch, Italienisch, Französisch
  screens/            Ein Modul pro Datei
```

Alle KI-Aufrufe nutzen **Structured Outputs** (`output_config.format` mit JSON-Schema), so
dass die Antworten ohne Nachparsen typsicher ankommen. Die Konversation nutzt zusätzlich
Streaming für die Gesprächsantwort. Denktiefe (`effort`) ist pro Aufgabe gewählt: niedrig
für Generierung, mittel für Analyse und Korrektur.

### Daten

Alles liegt in `localStorage` unter `lingua.state.v1`. Unter Einstellungen → Daten gibt es
Export und Import als JSON – empfehlenswert, weil ein geleerter Browser-Speicher den
Fortschritt mitnimmt.

---

## Skripte

```bash
npm run dev       # Entwicklungsserver (Basis /)
npm run build     # Typecheck + Produktionsbuild nach dist/ (Basis /Lingua-/)
npm run preview   # dist/ lokal ausliefern, wie GitHub Pages unter /Lingua-/
npm run lint      # oxlint
```

---

## Deployment

`.github/workflows/deploy.yml` baut bei jedem Push auf den Standard-Branch und
veröffentlicht auf GitHub Pages. Lint und Typecheck laufen vorher — ein Typfehler bricht
das Deployment ab, statt eine kaputte Seite auszuliefern.

**Einmalige Einrichtung:** Repo → *Settings* → *Pages* → *Build and deployment* →
*Source* auf **GitHub Actions** stellen. Ohne das schlägt der `deploy`-Job fehl, weil
Pages für das Repo noch nicht aktiviert ist. Danach genügt ein erneuter Lauf über
*Actions* → *Deploy to GitHub Pages* → *Run workflow*.

**Anderes Hosting:** Die Basis-URL steckt in `vite.config.ts` und lässt sich per
Umgebungsvariable überschreiben — für Vercel, Netlify oder eine eigene Domain, wo die App
im Wurzelverzeichnis liegt:

```bash
BASE_PATH=/ npm run build
```

Es gibt kein clientseitiges Routing, deshalb ist keine SPA-Fallback-Regel nötig: Die App
läuft vollständig unter einer einzigen URL.
