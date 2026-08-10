# Lingua

Eine App zum Sprachenlernen nach dem Prinzip **Sprachskelett**: erst das tragende
Grammatikgerüst und die Hochfrequenzwörter, dann Fleisch aus Wortschatz, Input und
eigener Produktion. 30 Tage striktes Programm, danach offen und alltagstauglich.

Alles läuft im Browser, alle Daten bleiben lokal (localStorage). Die KI-Funktionen
sprechen direkt mit der Claude Messages API.

---

## Der Lernablauf

Beim Start wählt man eine Sprache – oder legt über **+** eine neue an. Jede Sprache läuft in
**30-Tage-Sprints von einer Stufe zur nächsten**: Sprint 1 holt A1 und A2 zusammen ab, danach
geht es A2 → B1 → B2, jeder Sprint wieder 30 Tage mit denselben drei Phasen. Am Ende eines
Sprints bietet das Dashboard den nächsten an; Deck und Fortschritt bleiben, nur das Skelett
wechselt auf die nächste Stufe. Abgeschlossene Sprints stehen in der Historie.

Sprachen laufen dabei **unabhängig parallel** – jede mit eigenem Startdatum, eigener Stufe,
eigenem Deck und eigenem Slot (eine im Fokus, bis zu drei in Wartung). Italienisch kann im
B1-Sprint stehen, während Polnisch bei Tag 3 von A1 anfängt.

Innerhalb eines Sprints verändert sich das Dashboard mit der Phase:

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
(Leertaste, 1–4), Sprachausgabe pro Karte. Pro Tag werden automatisch 40–50 neue Wörter
aus dem Pool freigeschaltet.

Drei Mechanismen halten das effizient:
- **Mitwachsende Abfragerichtung.** Neue Karten werden erkennend abgefragt
  (Zielsprache → Deutsch), ab der dritten Wiederholung produzierend. Erkennen ist die
  leichte Richtung, Produzieren überträgt sich aufs Sprechen – am Anfang aber zu schwer.
  In den Einstellungen auf eine feste Richtung umstellbar.
- **Rückstandsbremse.** Übersteigt der Stapel fälliger Karten das Dreifache des
  Tagespensums, kommen keine neuen Wörter dazu, bis aufgeholt ist. Ein unbezwingbar
  wirkender Berg ist der häufigste Grund, SRS hinzuwerfen.
- **Leech-Erkennung.** Eine achtmal vergessene Karte wird ausgesetzt statt täglich
  wiederholt – sie ist nicht schwer, sondern schlecht formuliert. Unter Vokabeln lässt
  sie sich überarbeiten und wieder aufnehmen.

**Karteikarten + LLM** – Auf jeder Karte erzeugt „Neue Sätze“ frische Alltagsbeispiele mit
genau diesem Wort, mit wechselnder Zeitform und Satzart, optional auf einen Zielort bezogen.

**Skeleton-Drills** – Kerngrammatik als Minimalmuster, nach Wochen 1–4 und Niveaustufe
gegliedert, mit Formel, Erklärung und Beispielen. Ein Sprint zeigt nur die Muster seiner
Stufe, nicht das ganze Skelett bis B2.

**Italienisch ist bis A2 vollständig**: 28 Muster vom Aussagesatz über Artikel, Plural,
Modalverben und Präposition+Artikel bis zu passato prossimo (mit avere und essere),
imperfetto, Objektpronomen, ne/ci, Imperativ, Komparativ und Relativsatz. Woche 1–2 deckt A1
ab, Woche 3–4 A2. Spanisch, Französisch und Polnisch haben bisher die vier Woche-1/2-Muster. Dazu Übungen in drei Kategorien pro Muster: Beispielsätze, Konstruktion
(Lücke füllen, Umformen, Satz ordnen, Satz bilden) und Verständnis – eine Aufgabe pro
Bildschirm, mit toleranter Antwortprüfung.

Übungen laufen durch **dasselbe SM-2 wie Vokabeln**: Grammatik verblasst schneller als
Wortschatz, weil sie an keinem einzelnen Wort hängt. Gespeichert wird auch, welche
Aufgaben danebengingen – Wackelkandidaten kommen zuerst wieder. Die **gemischte Runde**
zieht quer über alle Muster statt blockweise; das fühlt sich schwerer an und sitzt danach
besser. Verständnisübungen lassen sich auf **Hörmodus** stellen: Der Satz wird vorgelesen,
den Text gibt es erst nach der Antwort.

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

**Standortbestimmung** – Der Test, den der Wochenplan für Tag 30 vorsieht: 20 Fragen, rund
zehn Minuten, aus dem eigenen Deck und dem Übungskatalog zusammengestellt. Vier Bereiche –
Wortschatz (Auswahl), Grammatik (getippt), Hörverstehen (nur gehört, Text verdeckt) und
Produktion (Satz selbst bilden). Läuft **ohne API-Schlüssel**; mit Schlüssel wird die
Auswertung zusätzlich ausformuliert.

Das Ergebnis ist eine Einordnung (A1 bis A2+), **kein Sprachzertifikat** – 20 Fragen aus dem
eigenen Material schätzen den Stand, sie prüfen ihn nicht. Die Produktion zählt dabei doppelt:
Wer Sätze selbst bilden kann, ist weiter als jemand, der nur wiedererkennt.

Der Test **verändert die Wiederholungen nicht**. Er misst, und ein Messinstrument, das die
gemessene Größe verstellt, taugt nichts. Aufrufbar ist er jederzeit und beliebig oft; ab Tag 28
rückt er als Sprint-Abschluss ins Dashboard. Jeder Durchlauf wird gespeichert, der Verlauf ist
sichtbar.

**Alltag** (Phase 3) – Lern-Habits mit Rhythmus und Wochenbilanz, Inhalte-Bibliothek für
Bücher, Hörbücher, Artikel, Podcasts, Videos und Serien mit Fortschritt, plus die
Slot-Übersicht über alle Sprachen (eine im Fokus, weitere in Wartung).

Die Habits müssen nicht erraten werden: Aus dem Assessment-Ergebnis leitet die App vor, was
als Nächstes trägt – schwaches Hörverstehen schlägt täglich Podcast und wöchentlich Serie ohne
Untertitel vor, schwache Produktion Voice-Notes und Tandem. Per Klick landen sie im
Alltags-Modus. Sitzt alles über 70 %, kommt eine Erhaltungsroutine statt einer Baustellenliste.

**Zeitbudget** – Die tatsächlich gelernte Zeit wird pro Modul gemessen (nur bei sichtbarem
Tab) und im Dashboard gegen das Tagesziel gestellt.

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

Für **Spanisch, Italienisch, Französisch und Polnisch** ist ein Startpaket hinterlegt – Review und
Drills funktionieren damit sofort **ohne** Schlüssel. **Italienisch** enthält den
vollständigen Kernwortschatz: **1000 Vokabeln nach Frequenz sortiert**
(`src/data/italian1000.ts`), jede mit Übersetzung, Wortart und Alltagsbeispiel. Das deckt
das Phase-1-Ziel von 600–1000 Wörtern komplett ab, ohne dass etwas generiert werden muss.
Spanisch, Französisch und Polnisch starten mit einem kleineren Paket (rund 50 Wörter) und
werden über den Wortschatz-Generator aufgefüllt.
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
    assessment.ts     Standortbestimmung: Fragenbau, Auswertung, Habit-Ableitung
    exerciseQueue.ts  Rundenauswahl für Übungen (fällig, wackelig, gemischt)
    storage.ts        localStorage, Export/Import
    date.ts           Datums-Helfer
  data/seed.ts        Startpakete für Spanisch, Italienisch, Französisch, Polnisch
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

npm test          # Unit-Tests der Lernlogik (vitest)

npm run validate:exercises   # Qualitätstor für den Übungskatalog
npm run generate:exercises   # neue Übungen per Claude erzeugen (braucht Schlüssel)
```

---

## Inhalte erzeugen und veröffentlichen

Es gibt zwei Sorten Inhalt, und der Unterschied entscheidet, wer sie je zu sehen bekommt:

| | erzeugt in | liegt in | erreicht |
| --- | --- | --- | --- |
| **Persönliche Inhalte** | der App (Vokabelgenerator, „Eigene Übungen", Reader, Chat) | `localStorage` | nur diesen einen Browser |
| **Katalog-Inhalte** | dem Generator-Skript | `src/data/exercises/*.ts` | jeden Besucher, auch ohne API-Schlüssel |

Was langfristig zur App gehören soll, muss deshalb den zweiten Weg gehen:

```
scripts/generate-exercises.ts  →  src/data/exercises/it.generated.ts  →  git diff  →  main  →  Pages
      (einmalig, mit Schlüssel)           (im Repo, dauerhaft)          (Review)          (alle)
```

```bash
ANTHROPIC_API_KEY=sk-... npm run generate:exercises -- \
  --lang it --pattern it-domanda-intonazione --kind all --count 50
npm run validate:exercises
git diff        # jede Lösung lesen, bevor sie live geht
```

Der Schlüssel bleibt dabei auf der eigenen Maschine — das Skript benutzt den normalen
Node-Client, nicht den Browser-Client der App.

**Der Diff-Review ist Teil des Verfahrens, keine Formalität.** Eine generierte Übung mit
falscher Lösung würde jeder Nutzer mitlernen. Deshalb läuft `validate:exercises` auch in
der CI vor dem Build: fehlende Lösungen, doppelte Aufgaben, Multiple-Choice ohne richtige
Antwort oder ein Muster-Slug, den es im Startpaket gar nicht gibt, brechen das Deployment ab.

Handgeschriebenes Material gehört in `src/data/exercises/<lang>.ts`, generiertes in die
danebenliegende `<lang>.generated.ts`, die das Skript überschreibt. Beide werden
zusammengeführt und über einen dynamischen `import()` erst auf dem Drills-Screen geladen —
der Katalog landet so in einem eigenen Chunk und nicht im Hauptbundle.

Aktuell im Repo: **1800 Übungen**, jeweils 50 Beispielsätze, 50 Konstruktions- und
50 Verständnisübungen pro Muster.

| Sprache | Muster mit Übungen | Übungen | offen |
| --- | --- | --- | --- |
| Italienisch | 6 von 28 | 900 | 22 Muster, darunter imperfetto und die Pronomen |
| Spanisch | Aussagesatz, Verneinung | 300 | Entscheidungsfrage, ser/estar, höfliche Bitte |
| Französisch | Aussagesatz, Verneinung | 300 | est-ce que, höfliche Bitte |
| Polnisch | Aussagesatz, Verneinung | 300 | czy-Frage, höfliche Bitte |

Die offenen Muster haben bereits Slugs — sie brauchen nur noch Inhalt, entweder von Hand
oder mit einem Lauf des Generators. Das **Skelett** ist für Italienisch vollständig bis A2;
die Übungen dazu wachsen nach.

---

## Deployment

`.github/workflows/deploy.yml` baut bei jedem Push auf `main` und veröffentlicht auf
GitHub Pages. Lint, Typecheck, Unit-Tests und der Übungsvalidator laufen vorher — ein Typfehler bricht das Deployment ab,
statt eine kaputte Seite auszuliefern. Nur `main` deployt; Feature-Branches lösen
bewusst kein Deployment aus.

Pages ist im Repo bereits auf *Source: GitHub Actions* gestellt. Für ein neues Repo ist
das der einzige manuelle Schritt (*Settings* → *Pages*) — er lässt sich nicht
automatisieren, weil der Workflow-Token die Pages-Site nicht selbst anlegen darf
(`Resource not accessible by integration`).

**Anderes Hosting:** Die Basis-URL steckt in `vite.config.ts` und lässt sich per
Umgebungsvariable überschreiben — für Vercel, Netlify oder eine eigene Domain, wo die App
im Wurzelverzeichnis liegt:

```bash
BASE_PATH=/ npm run build
```

Es gibt kein clientseitiges Routing, deshalb ist keine SPA-Fallback-Regel nötig: Die App
läuft vollständig unter einer einzigen URL.
