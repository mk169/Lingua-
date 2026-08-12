/**
 * Erzeugt aus dem Sprint A2 → B1 – nicht von Hand bearbeiten.
 * Quelle: src/data/sprint/it-a2-b1/, Erzeuger: scripts/build-sprint-exercises.ts
 *
 *   npm run build:sprint-exercises
 */

import type { Exercise } from '../../types';

export const SPRINT_EXERCISES: Exercise[] = [
  {
    id: 'it.a2b1.e.d01.01',
    patternSlug: 'it-presente-irregolare',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich stelle mich vor: Ich heiße Chiara Rossi.',
    answer: 'Mi presento: mi chiamo Chiara Rossi.',
    hint: 'presentarsi ist reflexiv, das Pronomen "mi" steht vor dem Verb.'
  },
  {
    id: 'it.a2b1.e.d01.02',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'I miei nonni non ___ (capire) l’italiano standard.',
    answer: 'capiscono',
    hint: '3. Person Plural der -isc-Verben trägt den Einschub: cap-isc-ono.'
  },
  {
    id: 'it.a2b1.e.d01.03',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ci ___ (trasferirsi) a Milano in autunno.',
    answer: 'trasferiamo',
    hint: 'Genau in der 1. Person Plural fällt das -isc- weg: ci trasferiamo, nicht "ci trasferisciamo".'
  },
  {
    id: 'it.a2b1.e.d01.04',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Tra colleghi ci ___ del tu, con il capo no.',
    answer: 'diamo',
    hint: '"dare" ist unregelmäßig: do, dai, dà, diamo, date, danno.'
  },
  {
    id: 'it.a2b1.e.d01.05',
    patternSlug: 'it-presente-irregolare',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ci diamo del Lei o possiamo darci del tu?',
    answer: 'Siezen wir uns oder können wir uns duzen?',
    hint: 'Nach einem Modalverb steht der Infinitiv, das Reflexivpronomen hängt sich an: darci.'
  },
  {
    id: 'it.a2b1.e.d01.07',
    patternSlug: 'it-svo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'due / cena / chiacchiere / dopo / facciamo',
    answer: 'Dopo cena facciamo due chiacchiere.',
    hint: 'Die Zeitangabe steht vorn, danach folgt Verb + Objekt.'
  },
  {
    id: 'it.a2b1.e.d01.08',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Io capisciamo bene il tuo accento.',
    answer: 'Io capisco bene il tuo accento.',
    hint: '"io" verlangt capisco; "capisciamo" mischt Singularstamm und Pluralendung.'
  },
  {
    id: 'it.a2b1.e.d01.09',
    patternSlug: 'it-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Provengo ___ un paese vicino a Bari.',
    answer: 'da',
    hint: 'Herkunft steht immer mit "da": venire/provenire da.'
  },
  {
    id: 'it.a2b1.e.d01.10',
    patternSlug: 'it-interrogativi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Marco proviene da Napoli.',
    answer: 'Da dove proviene Marco?',
    hint: 'Die Präposition "da" wandert mit dem Fragewort an den Satzanfang.'
  },
  {
    id: 'it.a2b1.r.d01.01',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Loro ___ (uscire) sempre alle otto.',
    answer: 'escono',
    hint: 'uscire ist unregelmäßig: esco, esci, esce, usciamo, uscite, escono.'
  },
  {
    id: 'it.a2b1.r.d01.02',
    patternSlug: 'it-interrogativi',
    kind: 'satz',
    type: 'translate',
    prompt: 'Was machst du heute Abend?',
    answer: 'Cosa fai stasera?',
    hint: '"fare" in der 2. Person: fai. Das Subjektpronomen entfällt.'
  },
  {
    id: 'it.a2b1.r.d01.03',
    patternSlug: 'it-articoli',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mi piace ___ dialetto di questa zona.',
    answer: 'il',
    hint: '"dialetto" ist männlich und beginnt mit einem einfachen Konsonanten: il.'
  },
  {
    id: 'it.a2b1.r.d01.04',
    patternSlug: 'it-negazione-non',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Conosco il suo soprannome.',
    answer: 'Non conosco il suo soprannome.',
    hint: '"non" steht direkt vor dem konjugierten Verb.'
  },
  {
    id: 'it.a2b1.r.d01.05',
    patternSlug: 'it-pronomi-diretti',
    kind: 'satz',
    type: 'translate',
    prompt: 'Piacere di conoscerla, io sono la nuova coinquilina.',
    answer: 'Freut mich, Sie kennenzulernen, ich bin die neue Mitbewohnerin.',
    hint: '"conoscerla" enthält das höfliche Sie als angehängtes Pronomen -la.'
  },
  {
    id: 'it.a2b1.e.d02.01',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il regalo è ___ nonni. (di + i)',
    answer: 'dei',
    hint: 'di + i = dei. Vor "gli" hieße es "degli".'
  },
  {
    id: 'it.a2b1.e.d02.02',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Vado ___ zia ogni sabato. (da + la)',
    answer: 'dalla',
    hint: 'da + la = dalla. "da" bei Personen heißt "zu jemandem".'
  },
  {
    id: 'it.a2b1.e.d02.03',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'I dati ___ coniuge sono obbligatori. (di + il)',
    answer: 'del',
    hint: 'di + il = del, ein Wort und ohne Apostroph.'
  },
  {
    id: 'it.a2b1.e.d02.04',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'choice',
    prompt: '___ nostra famiglia siamo in sei.',
    answer: 'Nella',
    options: [
      'Nella',
      'In la',
      'Nel'
    ],
    hint: 'in + la = nella. "In la" gibt es nicht.'
  },
  {
    id: 'it.a2b1.e.d02.05',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho comprato un regalo perl matrimonio di mia cugina.',
    answer: 'Ho comprato un regalo per il matrimonio di mia cugina.',
    hint: '"per" verschmilzt nie mit dem Artikel – anders als di, a, da, in, su.'
  },
  {
    id: 'it.a2b1.e.d02.06',
    patternSlug: 'it-svo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Die Großeltern verwöhnen die Enkel immer.',
    answer: 'I nonni viziano sempre i nipoti.',
    hint: '"sempre" steht üblicherweise direkt nach dem konjugierten Verb.'
  },
  {
    id: 'it.a2b1.e.d02.08',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'pace / hanno / stamattina / la / fatto / già',
    answer: 'Stamattina hanno già fatto la pace.',
    hint: '"già" steht zwischen Hilfsverb und Partizip.'
  },
  {
    id: 'it.a2b1.e.d02.10',
    patternSlug: 'it-verbi-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Somigli molto ___ tua madre.',
    answer: 'a',
    hint: '"somigliare" verlangt "a", nicht "di" wie im Deutschen der Dativ ohne Präposition.'
  },
  {
    id: 'it.a2b1.e.d02.11',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ___ (litigare) spesso, ma facciamo subito la pace.',
    answer: 'litighiamo',
    hint: 'Bei -gare wird vor -i ein h eingeschoben, damit das g hart bleibt.'
  },
  {
    id: 'it.a2b1.r.d02.01',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mio cugino non ___ (capire) il dialetto dei nonni.',
    answer: 'capisce',
    hint: '3. Person Singular der -isc-Verben: capisce.'
  },
  {
    id: 'it.a2b1.r.d02.02',
    patternSlug: 'it-interrogativi',
    kind: 'satz',
    type: 'translate',
    prompt: 'Seit wann seid ihr ein Paar?',
    answer: 'Da quanto tempo siete una coppia?',
    hint: '"Da quanto tempo" fragt nach einer bis heute andauernden Dauer, deshalb Präsens.'
  },
  {
    id: 'it.a2b1.r.d02.03',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mi presento: io sono il coinquilino nuovo e vado da Berlino.',
    answer: 'Mi presento: io sono il coinquilino nuovo e vengo da Berlino.',
    hint: 'Herkunft mit "venire da", nicht "andare da" – das hieße "ich gehe zu Berlin".'
  },
  {
    id: 'it.a2b1.r.d02.05',
    patternSlug: 'it-negazione-non',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'I miei suoceri vanno d’accordo con mia madre.',
    answer: 'I miei suoceri non vanno d’accordo con mia madre.',
    hint: '"non" steht vor dem konjugierten Verb, die feste Wendung bleibt unangetastet.'
  },
  {
    id: 'it.a2b1.e.d03.01',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'la città → …',
    answer: 'le città',
    hint: 'Betontes -à bleibt unverändert, nur der Artikel zeigt den Plural.'
  },
  {
    id: 'it.a2b1.e.d03.02',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'l’albergo → …',
    answer: 'gli alberghi',
    hint: 'Vor -i wird ein h eingeschoben, damit das g hart bleibt.'
  },
  {
    id: 'it.a2b1.e.d03.03',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'l’amico → …',
    answer: 'gli amici',
    hint: 'Ausnahme: Betonung auf der drittletzten Silbe, deshalb ohne h – amìco → amici.'
  },
  {
    id: 'it.a2b1.e.d03.04',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'l’orologio → …',
    answer: 'gli orologi',
    hint: 'Das i von -io ist unbetont und verschwindet: nur ein i im Plural.'
  },
  {
    id: 'it.a2b1.e.d03.05',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho comprato una dozzina di uovi.',
    answer: 'Ho comprato una dozzina di uova.',
    hint: '"uovo" wechselt im Plural das Geschlecht: le uova, weiblich auf -a.'
  },
  {
    id: 'it.a2b1.e.d03.06',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'In centro ci sono quattro ___ .',
    answer: 'bar',
    options: [
      'bar',
      'bars',
      'bari'
    ],
    hint: 'Fremd- und Kurzwörter bleiben unverändert.'
  },
  {
    id: 'it.a2b1.e.d03.07',
    patternSlug: 'it-vorrei-potrebbe',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich möchte den Termin auf Donnerstag verschieben.',
    answer: 'Vorrei spostare l’appuntamento a giovedì.',
    hint: 'Nach "vorrei" steht der Infinitiv; der Wochentag folgt mit "a".'
  },
  {
    id: 'it.a2b1.e.d03.08',
    patternSlug: 'it-preposizioni',
    kind: 'satz',
    type: 'translate',
    prompt: 'Mandami la risposta entro venerdì, non fino a venerdì.',
    answer: 'Schick mir die Antwort bis spätestens Freitag, nicht bis Freitag durchgehend.',
    hint: '"entro" nennt eine Frist, "fino a" eine Dauer bis zu einem Zeitpunkt.'
  },
  {
    id: 'it.a2b1.e.d03.10',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Non posso venire, ___ (disdire, io) l’appuntamento.',
    answer: 'disdico',
    hint: '"disdire" folgt "dire": disdico, disdici, disdice, disdiciamo, disdite, disdicono.'
  },
  {
    id: 'it.a2b1.e.d03.11',
    patternSlug: 'it-svo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'in / vediamo / punto / alle / ci / otto',
    answer: 'Ci vediamo alle otto in punto.',
    hint: '"in punto" steht immer hinter der Uhrzeit.'
  },
  {
    id: 'it.a2b1.r.d03.01',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La riunione ___ trimestre è già in agenda. (di + il)',
    answer: 'del',
    hint: 'di + il = del. Ein Wort, kein Apostroph.'
  },
  {
    id: 'it.a2b1.r.d03.02',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Nei giorni festivi vado ___ nonni. (da + i)',
    answer: 'dai',
    hint: 'da + i = dai; bei Personen heißt "da" zu jemandem hin.'
  },
  {
    id: 'it.a2b1.r.d03.03',
    patternSlug: 'it-possessivi',
    kind: 'satz',
    type: 'translate',
    prompt: 'Meine Zwillinge streiten jeden Tag.',
    answer: 'I miei gemelli litigano ogni giorno.',
    hint: 'Vor "gemelli" im Plural steht der Artikel: "i miei gemelli".'
  },
  {
    id: 'it.a2b1.r.d03.04',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Voi ___ (preferire) il turno di mattina o quello di notte?',
    answer: 'preferite',
    hint: '2. Person Plural der -isc-Verben ohne Einschub: preferite.'
  },
  {
    id: 'it.a2b1.r.d03.05',
    patternSlug: 'it-interrogativi',
    kind: 'satz',
    type: 'translate',
    prompt: 'A proposito, da quanto tempo aspetti? L’attesa è stata lunga?',
    answer: 'Übrigens, seit wann wartest du? War das Warten lang?',
    hint: '"da quanto tempo" mit Präsens, weil das Warten noch andauert.'
  },
  {
    id: 'it.a2b1.e.d04.01',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Faccio molto stasera.',
    answer: 'Non faccio niente stasera.',
    hint: 'Steht "niente" hinter dem Verb, braucht es zusätzlich "non" davor.'
  },
  {
    id: 'it.a2b1.e.d04.02',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ ho ancora stirato le camicie.',
    answer: 'Non',
    hint: '"non … ancora" heißt noch nicht – "non" ist Pflicht.'
  },
  {
    id: 'it.a2b1.e.d04.03',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Niemand hat den Tisch abgeräumt.',
    answer: 'Nessuno ha sparecchiato.',
    options: [
      'Nessuno ha sparecchiato.',
      'Nessuno non ha sparecchiato.',
      'Non nessuno ha sparecchiato.'
    ],
    hint: 'Vorangestelltes "nessuno" ersetzt das "non" – zwei Negationen davor wären falsch.'
  },
  {
    id: 'it.a2b1.e.d04.04',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Nel frigorifero c’è più niente.',
    answer: 'Nel frigorifero non c’è più niente.',
    hint: 'Zwei nachgestellte Negationswörter (più, niente) verlangen trotzdem ein "non" vor dem Verb.'
  },
  {
    id: 'it.a2b1.e.d04.05',
    patternSlug: 'it-doppia-negazione',
    kind: 'satz',
    type: 'translate',
    prompt: 'Er saugt nie Staub.',
    answer: 'Non passa mai l’aspirapolvere.',
    hint: '"mai" steht nach dem Verb, "non" davor.'
  },
  {
    id: 'it.a2b1.e.d04.06',
    patternSlug: 'it-doppia-negazione',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich kaufe weder Waschmittel noch Seife.',
    answer: 'Non compro né detersivo né sapone.',
    hint: 'Bei "né … né" bleibt das "non" vor dem Verb stehen.'
  },
  {
    id: 'it.a2b1.e.d04.07',
    patternSlug: 'it-doppia-negazione',
    kind: 'satz',
    type: 'translate',
    prompt: 'Non ho ancora messo a posto, scusa il disordine.',
    answer: 'Ich habe noch nicht aufgeräumt, entschuldige die Unordnung.',
    hint: '"non … ancora" = noch nicht; nicht mit "non … più" (nicht mehr) verwechseln.'
  },
  {
    id: 'it.a2b1.e.d04.08',
    patternSlug: 'it-svo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'lavastoviglie / cena / carico / dopo / la',
    answer: 'Dopo cena carico la lavastoviglie.',
    hint: 'Zeitangabe voran, dann Verb und Objekt.'
  },
  {
    id: 'it.a2b1.e.d04.09',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Io ___ (rifare) il letto appena mi alzo.',
    answer: 'rifaccio',
    hint: '"rifare" folgt "fare": rifaccio, rifai, rifà, rifacciamo, rifate, rifanno.'
  },
  {
    id: 'it.a2b1.e.d04.10',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Chi porta giù la spazzatura oggi?\n— Oggi tocca a te, io ___ (fare) le pulizie ieri.',
    answer: 'ho fatto',
    hint: 'Der Rückbezug auf gestern verlangt das passato prossimo mit avere.'
  },
  {
    id: 'it.a2b1.e.d04.11',
    patternSlug: 'it-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Metto la pizza ___ forno per dieci minuti.',
    answer: 'in',
    hint: 'Bei Geräten und Räumen steht "in" ohne Artikel, wenn die Funktion gemeint ist.'
  },
  {
    id: 'it.a2b1.r.d04.01',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'lo strofinaccio → …',
    answer: 'gli strofinacci',
    hint: 'Unbetontes -io: im Plural nur ein i, Artikel "gli" wegen str-.'
  },
  {
    id: 'it.a2b1.r.d04.02',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'l’aspirapolvere → …',
    answer: 'gli aspirapolvere',
    hint: 'Zusammensetzungen aus Verb + Nomen bleiben unverändert.'
  },
  {
    id: 'it.a2b1.r.d04.03',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il detersivo è ___ lavandino. (su + il)',
    answer: 'sul',
    hint: 'su + il = sul.'
  },
  {
    id: 'it.a2b1.r.d04.05',
    patternSlug: 'it-doppia-negazione',
    kind: 'satz',
    type: 'translate',
    prompt: 'Il mio coinquilino non fa mai le pulizie: ne parliamo stasera.',
    answer: 'Mein Mitbewohner putzt nie: Wir reden heute Abend darüber.',
    hint: '"non … mai" ist die doppelte Verneinung, "ne" ersetzt "di questo".'
  },
  {
    id: 'it.a2b1.e.d05.01',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ uova servono per l’impasto?',
    answer: 'Quante',
    hint: '"uova" ist weiblicher Plural, deshalb "quante".'
  },
  {
    id: 'it.a2b1.e.d05.02',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ farina metto nella pentola?',
    answer: 'Quanta',
    hint: '"farina" ist weiblich Singular: quanta.'
  },
  {
    id: 'it.a2b1.e.d05.03',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Mit wem kochst du heute Abend?',
    answer: 'Con chi cucini stasera?',
    options: [
      'Con chi cucini stasera?',
      'Chi cucini con stasera?',
      'Chi con cucini stasera?'
    ],
    hint: 'Die Präposition steht im Italienischen immer vor dem Fragewort.'
  },
  {
    id: 'it.a2b1.e.d05.04',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Quale è il tuo ingrediente preferito?',
    answer: 'Qual è il tuo ingrediente preferito?',
    hint: 'Vor "è" wird "quale" zu "qual" – ohne Apostroph, es ist keine Elision.'
  },
  {
    id: 'it.a2b1.e.d05.05',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Questa ricetta è di mia nonna.',
    answer: 'Di chi è questa ricetta?',
    hint: 'Besitz erfragt "di chi", nicht "chi di".'
  },
  {
    id: 'it.a2b1.e.d05.06',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'satz',
    type: 'translate',
    prompt: 'Was für eine Art Käse ist das?',
    answer: 'Che tipo di formaggio è?',
    hint: '"che" fragt nach der Art, "quale" nach der Auswahl aus Bekanntem.'
  },
  {
    id: 'it.a2b1.e.d05.07',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'l’arancia → …',
    answer: 'le arance',
    hint: 'Vor -cia steht ein Konsonant, deshalb fällt das i im Plural weg.'
  },
  {
    id: 'it.a2b1.e.d05.08',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'il fungo → …',
    answer: 'i funghi',
    hint: 'h hält das g hart: funghi.'
  },
  {
    id: 'it.a2b1.e.d05.09',
    patternSlug: 'it-imperativo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Fai bollire l’acqua e poi mescola bene.',
    answer: 'Lass das Wasser kochen und rühr dann gut um.',
    hint: '"fare + Infinitiv" heißt veranlassen: "fai bollire" = lass kochen.'
  },
  {
    id: 'it.a2b1.e.d05.10',
    patternSlug: 'it-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Per il ragù uso carne ___ manzo.',
    answer: 'di',
    hint: 'Sorte und Material stehen mit "di": carne di manzo, succo di mela.'
  },
  {
    id: 'it.a2b1.e.d05.11',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'fine / il / aggiungi / alla / prezzemolo',
    answer: 'Aggiungi il prezzemolo alla fine.',
    hint: 'Imperativ vorn, Zeitangabe hinten.'
  },
  {
    id: 'it.a2b1.r.d05.01',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Nel frigorifero c’è ancora molto.',
    answer: 'Nel frigorifero non c’è più niente.',
    hint: '"non … più niente" verneint doppelt und bleibt trotzdem eine einzige Verneinung.'
  },
  {
    id: 'it.a2b1.r.d05.02',
    patternSlug: 'it-doppia-negazione',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich brate nie mit Butter.',
    answer: 'Non friggo mai con il burro.',
    hint: '"non" vor dem Verb, "mai" dahinter.'
  },
  {
    id: 'it.a2b1.r.d05.03',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Metti un po’ di aceto ___ insalata. (in + l’)',
    answer: 'nell’',
    hint: 'in + l’ = nell’, mit Apostroph vor dem Vokal.'
  },
  {
    id: 'it.a2b1.r.d05.04',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Loro ___ (preferire) il pesce alla carne.',
    answer: 'preferiscono',
    hint: '-isc-Verb in der 3. Person Plural: preferiscono.'
  },
  {
    id: 'it.a2b1.e.d06.01',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il conto? ___ pago io.',
    answer: 'Lo',
    hint: '"il conto" ist männlich Singular: lo, vor dem konjugierten Verb.'
  },
  {
    id: 'it.a2b1.e.d06.02',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La carta dei vini? ___ vediamo dopo.',
    answer: 'La',
    hint: '"la carta" ist weiblich Singular: la.'
  },
  {
    id: 'it.a2b1.e.d06.03',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Questi stuzzichini sono buoni: ___ prendiamo tutti.',
    answer: 'li',
    hint: 'Männlicher Plural: li. Nicht "gli", das ist das indirekte Pronomen.'
  },
  {
    id: 'it.a2b1.e.d06.04',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Prendo lo, il piatto del giorno.',
    answer: 'Lo prendo, il piatto del giorno.',
    hint: 'Das direkte Pronomen steht vor dem konjugierten Verb, nie dahinter.'
  },
  {
    id: 'it.a2b1.e.d06.05',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho ordinato la pizza mezz’ora fa, ma non l’ho ancora visto.',
    answer: 'Ho ordinato la pizza mezz’ora fa, ma non l’ho ancora vista.',
    hint: 'Nach "l’" für ein weibliches Objekt endet das Partizip auf -a: vista.'
  },
  {
    id: 'it.a2b1.e.d06.06',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Voglio vedere la carta dei vini. → Voglio ___',
    answer: 'vederla',
    hint: 'Am Infinitiv fällt das End-e weg und das Pronomen hängt sich an: vedere + la = vederla.'
  },
  {
    id: 'it.a2b1.e.d06.07',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'satz',
    type: 'translate',
    prompt: 'Haben Sie einen Tisch draußen?',
    answer: 'Avete un tavolo all’aperto?',
    hint: '"all’aperto" ist eine feste Wendung mit verschmolzenem Artikel.'
  },
  {
    id: 'it.a2b1.e.d06.09',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Possiamo dividere il conto?\n— Certo, ___ divido subito.',
    answer: 'lo',
    hint: '"il conto" wird durch "lo" ersetzt, das vor dem Verb steht.'
  },
  {
    id: 'it.a2b1.e.d06.11',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'porta / caraffa / ci / una / d’acqua',
    answer: 'Ci porta una caraffa d’acqua?',
    hint: '"ci" ist hier das indirekte Pronomen "uns" und steht vor dem Verb.'
  },
  {
    id: 'it.a2b1.r.d06.01',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ portate ha il menù di degustazione?',
    answer: 'Quante',
    hint: '"portate" ist weiblicher Plural: quante.'
  },
  {
    id: 'it.a2b1.r.d06.02',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'La specialità della casa è il coniglio.',
    answer: 'Qual è la specialità della casa?',
    hint: 'Vor "è" heißt es "qual", ohne Apostroph.'
  },
  {
    id: 'it.a2b1.r.d06.03',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'il cuoco → …',
    answer: 'i cuochi',
    hint: 'h hält das c hart: cuochi.'
  },
  {
    id: 'it.a2b1.r.d06.04',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ci sono ancora posti a sedere.',
    answer: 'Non ci sono più posti a sedere.',
    hint: '"non … più" ist das Gegenstück zu "ancora".'
  },
  {
    id: 'it.a2b1.r.d06.05',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'satz',
    type: 'translate',
    prompt: 'Der Wirt hat uns den Kaffee ausgegeben.',
    answer: 'Il gestore ci ha offerto il caffè.',
    hint: '"ci" steht vor dem Hilfsverb; das Partizip von offrire ist offerto.'
  },
  {
    id: 'it.a2b1.e.d07.01',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Alla commessa ___ ho chiesto la taglia.',
    answer: 'le',
    hint: 'Eine Frau als indirektes Objekt: "le", nicht "gli" und nicht "la".'
  },
  {
    id: 'it.a2b1.e.d07.02',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il cassiere non ___ ha dato il resto (a Marco).',
    answer: 'gli',
    hint: 'Ein Mann als indirektes Objekt: gli.'
  },
  {
    id: 'it.a2b1.e.d07.03',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Domani lo telefono per il reso.',
    answer: 'Domani gli telefono per il reso.',
    hint: '"telefonare" konstruiert im Italienischen mit "a" – also indirektes Pronomen gli.'
  },
  {
    id: 'it.a2b1.e.d07.04',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Le ho data la ricevuta.',
    answer: 'Le ho dato la ricevuta.',
    hint: 'Nur direkte Pronomen (lo, la, li, le) verlangen die Angleichung des Partizips, indirekte nicht.'
  },
  {
    id: 'it.a2b1.e.d07.05',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Devo telefonare al negozio per il reso. → Devo ___ per il reso.',
    answer: 'telefonargli',
    hint: 'Am Infinitiv fällt das -e weg, das Pronomen hängt sich an: telefonare + gli.'
  },
  {
    id: 'it.a2b1.e.d07.06',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'satz',
    type: 'translate',
    prompt: 'Diese Aktion interessiert mich nicht.',
    answer: 'Questa promozione non mi interessa.',
    hint: '"interessare" konstruiert indirekt: etwas interessiert mir.'
  },
  {
    id: 'it.a2b1.e.d07.07',
    patternSlug: 'it-doppia-negazione',
    kind: 'satz',
    type: 'translate',
    prompt: 'Senza ricevuta non posso cambiare niente, mi dispiace.',
    answer: 'Ohne Quittung kann ich nichts umtauschen, tut mir leid.',
    hint: '"non … niente" ist die doppelte Verneinung; "mi dispiace" ist ebenfalls indirekt gebaut.'
  },
  {
    id: 'it.a2b1.e.d07.09',
    patternSlug: 'it-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Due etti ___ prosciutto crudo, grazie.',
    answer: 'di',
    hint: 'Mengenangaben schließen mit "di" an: due etti di prosciutto.'
  },
  {
    id: 'it.a2b1.e.d07.10',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'fila / venti / ho / per / la / minuti / fatto',
    answer: 'Ho fatto la fila per venti minuti.',
    hint: 'Die Zeitdauer mit "per" steht am Ende.'
  },
  {
    id: 'it.a2b1.e.d07.11',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Questo maglione è difettoso, posso cambiarlo?\n— Certo, se ha lo scontrino ___ rimborsiamo subito.',
    answer: 'le',
    hint: 'Der Kundin gegenüber (Höflichkeitsform Lei) steht das indirekte Pronomen "le".'
  },
  {
    id: 'it.a2b1.r.d07.01',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Loro non ___ (capire) il cassiere, parla in dialetto.',
    answer: 'capiscono',
    hint: '-isc-Verb in der 3. Person Plural: capiscono.'
  },
  {
    id: 'it.a2b1.r.d07.02',
    patternSlug: 'it-presente-irregolare',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich stelle mich vor: Ich bin der neue Verkäufer.',
    answer: 'Mi presento: sono il nuovo commesso.',
    hint: 'presentarsi ist reflexiv, das Pronomen steht vor dem Verb.'
  },
  {
    id: 'it.a2b1.r.d07.03',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il riso è ___ scaffale in alto. (su + lo)',
    answer: 'sullo',
    hint: 'su + lo = sullo, weil "scaffale" mit s + Konsonant beginnt.'
  },
  {
    id: 'it.a2b1.r.d07.05',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'il banco → …',
    answer: 'i banchi',
    hint: 'h hält das c hart: banchi.'
  },
  {
    id: 'it.a2b1.r.d07.06',
    patternSlug: 'it-imperativo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Schick mir die Antwort bis spätestens Freitag.',
    answer: 'Mandami la risposta entro venerdì.',
    hint: '"entro" nennt die Frist; am Imperativ hängt "mi" an: manda + mi.'
  },
  {
    id: 'it.a2b1.r.d07.07',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho ancora qualcosa da comprare.',
    answer: 'Non ho più niente da comprare.',
    hint: '"non … più niente" – beide Negationswörter stehen hinter dem Verb, "non" davor.'
  },
  {
    id: 'it.a2b1.r.d07.08',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ etti di formaggio le do?',
    answer: 'Quanti',
    hint: '"etti" ist männlicher Plural: quanti.'
  },
  {
    id: 'it.a2b1.r.d07.09',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le scarpe in vetrina? ___ provo subito.',
    answer: 'Le',
    hint: '"le scarpe" ist weiblicher Plural: das direkte Pronomen lautet ebenfalls "le".'
  },
  {
    id: 'it.a2b1.r.d07.10',
    patternSlug: 'it-pronomi-diretti',
    kind: 'satz',
    type: 'translate',
    prompt: 'Il conto lo dividiamo, ma il coperto lo paga chi ha prenotato.',
    answer: 'Die Rechnung teilen wir, aber das Gedeck zahlt derjenige, der reserviert hat.',
    hint: 'Beide "lo" greifen ein vorangestelltes Objekt wieder auf – im Italienischen üblich, im Deutschen unnötig.'
  },
  {
    id: 'it.a2b1.e.d08.01',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Ieri io ___ (firmare) il contratto d’affitto.',
    answer: 'ho firmato',
    hint: 'Regelmäßiges -are-Verb: Stamm + -ato, Hilfsverb avere.'
  },
  {
    id: 'it.a2b1.e.d08.02',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ___ (vedere) tre appartamenti in un giorno.',
    answer: 'abbiamo visto',
    hint: 'Unregelmäßiges Partizip: vedere → visto, nicht "veduto" im Alltag.'
  },
  {
    id: 'it.a2b1.e.d08.03',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Che cosa ___ (dire) il padrone di casa?',
    answer: 'ha detto',
    hint: 'dire → detto. Das Hilfsverb steht vor dem Partizip.'
  },
  {
    id: 'it.a2b1.e.d08.04',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Loro ___ (mettere) i mobili in cantina.',
    answer: 'hanno messo',
    hint: 'mettere → messo.'
  },
  {
    id: 'it.a2b1.e.d08.05',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Sono comprato un bilocale in centro.',
    answer: 'Ho comprato un bilocale in centro.',
    hint: '"comprare" hat ein direktes Objekt und nimmt deshalb "avere".'
  },
  {
    id: 'it.a2b1.e.d08.06',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Abbiamo prendeuto le chiavi dall’amministratore.',
    answer: 'Abbiamo preso le chiavi dall’amministratore.',
    hint: 'prendere hat das unregelmäßige Partizip "preso".'
  },
  {
    id: 'it.a2b1.e.d08.07',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Il condominio decide di rifare il tetto.',
    answer: 'Il condominio ha deciso di rifare il tetto.',
    hint: 'decidere → deciso; der Infinitiv nach "di" bleibt unverändert.'
  },
  {
    id: 'it.a2b1.e.d08.08',
    patternSlug: 'it-passato-avere',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich habe eine Kaution von zwei Monatsmieten hinterlegt.',
    answer: 'Ho versato una caparra di due mensilità.',
    hint: '"versare" ist der übliche Ausdruck für das Hinterlegen einer Summe.'
  },
  {
    id: 'it.a2b1.e.d08.11',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'scrivania / davanti / ho / la / alla / messo / finestra',
    answer: 'Ho messo la scrivania davanti alla finestra.',
    hint: 'Hilfsverb + Partizip stehen zusammen, danach Objekt und Ortsangabe.'
  },
  {
    id: 'it.a2b1.r.d08.01',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Ho scritto all’amministratore e ___ ho spiegato il problema.',
    answer: 'gli',
    hint: 'Ein Mann als indirektes Objekt: gli.'
  },
  {
    id: 'it.a2b1.r.d08.02',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La caparra? ___ ho già pagat___ .',
    answer: 'L’ho già pagata',
    hint: 'Vorangestelltes "la" verlangt die Angleichung: pagata.'
  },
  {
    id: 'it.a2b1.r.d08.03',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ metri quadrati ha l’appartamento?',
    answer: 'Quanti',
    hint: '"metri quadrati" ist männlicher Plural: quanti.'
  },
  {
    id: 'it.a2b1.r.d08.04',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ___ (trasferirsi) in un bilocale più luminoso.',
    answer: 'ci trasferiamo',
    hint: 'In der 1. Person Plural fällt das -isc- weg.'
  },
  {
    id: 'it.a2b1.r.d08.05',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Nel ripostiglio c’è ancora qualcosa.',
    answer: 'Nel ripostiglio non c’è più niente.',
    hint: '"non … più niente" bleibt eine einzige Verneinung.'
  },
  {
    id: 'it.a2b1.e.d09.01',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ___ (arrivare) in piazza alle otto.',
    answer: 'siamo arrivati',
    hint: 'Bewegungsverb: Hilfsverb essere, Partizip auf -i für "noi".'
  },
  {
    id: 'it.a2b1.e.d09.02',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Maria ___ (salire) sul campanile.',
    answer: 'è salita',
    hint: 'salire ohne Objekt nimmt essere; das Partizip richtet sich nach Maria: salita.'
  },
  {
    id: 'it.a2b1.e.d09.03',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le mie amiche ___ (uscire) dal museo alle sei.',
    answer: 'sono uscite',
    hint: 'Weiblicher Plural: Partizip auf -e.'
  },
  {
    id: 'it.a2b1.e.d09.04',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Io ___ (perdersi) nei vicoli del centro.',
    answer: 'mi sono persa',
    hint: 'Reflexive Verben nehmen immer essere; das Partizip von perdere ist "perso".'
  },
  {
    id: 'it.a2b1.e.d09.05',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ieri ho andato in centro storico a piedi.',
    answer: 'Ieri sono andato in centro storico a piedi.',
    hint: '"andare" ist ein Bewegungsverb und nimmt essere.'
  },
  {
    id: 'it.a2b1.e.d09.06',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Le ragazze sono tornato dal castello tardi.',
    answer: 'Le ragazze sono tornate dal castello tardi.',
    hint: 'Bei "essere" gleicht sich das Partizip an das Subjekt an: weiblicher Plural = -e.'
  },
  {
    id: 'it.a2b1.e.d09.07',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Wir (zwei Frauen) sind am Kreisverkehr abgebogen.',
    answer: 'Siamo svoltate alla rotonda.',
    options: [
      'Siamo svoltate alla rotonda.',
      'Abbiamo svoltato alla rotonda.',
      'Siamo svoltati alla rotonda.'
    ],
    hint: 'svoltare ist hier ein Bewegungsverb ohne Objekt: essere plus weibliche Pluralendung.'
  },
  {
    id: 'it.a2b1.e.d09.08',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'satz',
    type: 'translate',
    prompt: 'Die Bank ist gegenüber vom Bahnhof.',
    answer: 'La banca è di fronte alla stazione.',
    hint: '"di fronte a" verschmilzt mit dem Artikel: a + la = alla.'
  },
  {
    id: 'it.a2b1.e.d09.09',
    patternSlug: 'it-imperativo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Prosegua dritto, superi il ponte e svolti al secondo incrocio.',
    answer: 'Gehen Sie geradeaus weiter, überqueren Sie die Brücke und biegen Sie an der zweiten Kreuzung ab.',
    hint: 'Drei Höflichkeitsimperative in Folge – typisch für eine Wegauskunft.'
  },
  {
    id: 'it.a2b1.e.d09.10',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'corridoio / bagno / in / al / il / è / fondo',
    answer: 'Il bagno è in fondo al corridoio.',
    hint: '"in fondo a" verlangt den verschmolzenen Artikel: al corridoio.'
  },
  {
    id: 'it.a2b1.e.d09.11',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Scusi, come arrivo al municipio?\n— ___ (proseguire, Lei) dritto fino alla fontana, poi giri a destra.',
    answer: 'Prosegua',
    hint: 'Höflichkeitsimperativ der -ire-Verben auf -a: prosegua.'
  },
  {
    id: 'it.a2b1.r.d09.01',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il proprietario ___ (rifare) l’impianto elettrico.',
    answer: 'ha rifatto',
    hint: 'rifare folgt fare: Partizip "rifatto", Hilfsverb avere.'
  },
  {
    id: 'it.a2b1.r.d09.02',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Noi ___ visto tre appartamenti.',
    answer: 'abbiamo',
    options: [
      'abbiamo',
      'siamo',
      'avete'
    ],
    hint: '"vedere" hat ein direktes Objekt und nimmt deshalb avere.'
  },
  {
    id: 'it.a2b1.r.d09.03',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La cartina della città? ___ ho lasciata in albergo.',
    answer: 'L’',
    hint: 'Vor Vokal wird "la" zu "l’"; das Partizip bleibt angeglichen: lasciata.'
  },
  {
    id: 'it.a2b1.r.d09.04',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il museo è accanto ___ municipio. (a + il)',
    answer: 'al',
    hint: 'a + il = al.'
  },
  {
    id: 'it.a2b1.r.d09.05',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'il sobborgo → …',
    answer: 'i sobborghi',
    hint: 'h hält das g hart: sobborghi.'
  },
  {
    id: 'it.a2b1.e.d10.01',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Io ___ (fermarsi) al distributore.',
    answer: 'mi sono fermato',
    hint: 'Reflexive Verben nehmen essere; das Partizip endet auf -o für einen männlichen Sprecher.'
  },
  {
    id: 'it.a2b1.e.d10.02',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le ragazze ___ (alzarsi) alle cinque per il treno.',
    answer: 'si sono alzate',
    hint: 'Weiblicher Plural: Partizip auf -e.'
  },
  {
    id: 'it.a2b1.e.d10.03',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ___ (mettersi) la cintura di sicurezza.',
    answer: 'ci siamo messi',
    hint: 'mettersi → messo, mit essere und Angleichung an "noi".'
  },
  {
    id: 'it.a2b1.e.d10.04',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mi ho dimenticato di timbrare il biglietto.',
    answer: 'Mi sono dimenticato di timbrare il biglietto.',
    hint: 'Reflexive Verben bilden das passato prossimo ausnahmslos mit essere.'
  },
  {
    id: 'it.a2b1.e.d10.05',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Maria si è fermato al casello per pagare il pedaggio.',
    answer: 'Maria si è fermata al casello per pagare il pedaggio.',
    hint: 'Bei essere gleicht sich das Partizip an das Subjekt an: fermata.'
  },
  {
    id: 'it.a2b1.e.d10.06',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Non voglio che mi sveglio presto. → Non voglio ___ presto.',
    answer: 'svegliarmi',
    hint: 'Am Infinitiv fällt das -e weg und das Pronomen hängt sich an: svegliare + mi.'
  },
  {
    id: 'it.a2b1.e.d10.07',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Ieri sera ___ fermato la macchina davanti al portone.',
    answer: 'ho',
    options: [
      'ho',
      'sono',
      'mi sono'
    ],
    hint: 'Hier steht ein Objekt ("la macchina"), also nicht reflexiv: fermare mit avere.'
  },
  {
    id: 'it.a2b1.e.d10.08',
    patternSlug: 'it-preposizioni',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich muss vor der Abfahrt tanken.',
    answer: 'Devo fare benzina prima di partire.',
    hint: '"fare benzina" ohne Artikel; nach "prima di" steht der Infinitiv.'
  },
  {
    id: 'it.a2b1.e.d10.09',
    patternSlug: 'it-passato-essere',
    kind: 'satz',
    type: 'translate',
    prompt: 'Siamo rimasti in un ingorgo per un’ora e abbiamo perso la coincidenza.',
    answer: 'Wir haben eine Stunde im Stau gestanden und den Anschluss verpasst.',
    hint: '"rimanere" nimmt essere mit Angleichung, "perdere" nimmt avere.'
  },
  {
    id: 'it.a2b1.e.d10.10',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'biglietto / di / il / ricordati / timbrare',
    answer: 'Ricordati di timbrare il biglietto.',
    hint: 'Am Imperativ hängt das Reflexivpronomen an: ricorda + ti.'
  },
  {
    id: 'it.a2b1.e.d10.11',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Perché siete arrivati così tardi?\n— ___ (fermarsi, noi) in officina: c’era un guasto al motore.',
    answer: 'Ci siamo fermati',
    hint: 'Reflexiv mit essere, Partizip im männlichen Plural für "noi".'
  },
  {
    id: 'it.a2b1.r.d10.01',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'I pendolari ___ (scendere) alla fermata sbagliata.',
    answer: 'sono scesi',
    hint: 'scendere ohne Objekt nimmt essere; Partizip "sceso", männlicher Plural "scesi".'
  },
  {
    id: 'it.a2b1.r.d10.02',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il meccanico ___ (dire) che è il cambio.',
    answer: 'ha detto',
    hint: 'dire → detto, mit avere.'
  },
  {
    id: 'it.a2b1.r.d10.03',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'A Marco ___ hanno fatto una multa per eccesso di velocità.',
    answer: 'gli',
    hint: 'Ein Mann als indirektes Objekt: gli.'
  },
  {
    id: 'it.a2b1.r.d10.04',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'il casco → …',
    answer: 'i caschi',
    hint: 'h hält das c hart: caschi.'
  },
  {
    id: 'it.a2b1.r.d10.05',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho ancora la patente con me.',
    answer: 'Non ho più la patente con me.',
    hint: '"non … più" ersetzt "ancora" in der Verneinung.'
  },
  {
    id: 'it.a2b1.e.d11.01',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La camera ___ (essere) piccola e rumorosa.',
    answer: 'era',
    hint: 'essere ist unregelmäßig: ero, eri, era, eravamo, eravate, erano.'
  },
  {
    id: 'it.a2b1.e.d11.02',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Da bambini ___ (andare, noi) sempre in campeggio.',
    answer: 'andavamo',
    hint: 'Gewohnheit in der Vergangenheit: imperfetto, regelmäßig auf -avamo.'
  },
  {
    id: 'it.a2b1.e.d11.03',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre io ___ (fare) il check-in, mia moglie parcheggiava.',
    answer: 'facevo',
    hint: 'fare ist eine der vier Ausnahmen: facevo, nicht "favo".'
  },
  {
    id: 'it.a2b1.e.d11.04',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'In camera non ___ (esserci) l’asciugacapelli.',
    answer: 'c’era',
    hint: 'Beschreibung eines Zustands: c’era, nicht "c’è stato".'
  },
  {
    id: 'it.a2b1.e.d11.05',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Il materasso è stato troppo morbido e ho dormito male.',
    answer: 'Il materasso era troppo morbido e ho dormito male.',
    hint: 'Die Eigenschaft der Matratze ist eine Beschreibung: imperfetto. Das Schlafen ist die Handlung: passato prossimo.'
  },
  {
    id: 'it.a2b1.e.d11.06',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Ieri ___ la camera per tre notti.',
    answer: 'ho prenotato',
    options: [
      'ho prenotato',
      'prenotavo',
      'prenotato'
    ],
    hint: 'Einmalige abgeschlossene Handlung mit Zeitpunkt: passato prossimo, nicht imperfetto.'
  },
  {
    id: 'it.a2b1.e.d11.07',
    patternSlug: 'it-imperfetto',
    kind: 'satz',
    type: 'translate',
    prompt: 'Es gab einen Pool, aber keinen Parkplatz.',
    answer: 'C’era la piscina, ma non c’era il parcheggio.',
    hint: 'Zwei beschreibende Zustände: beide im imperfetto.'
  },
  {
    id: 'it.a2b1.e.d11.08',
    patternSlug: 'it-imperfetto',
    kind: 'satz',
    type: 'translate',
    prompt: 'Le recensioni erano ottime, ma la sistemazione era molto rumorosa.',
    answer: 'Die Bewertungen waren hervorragend, aber die Unterkunft war sehr laut.',
    hint: 'Beides Beschreibungen: durchgehend imperfetto.'
  },
  {
    id: 'it.a2b1.e.d11.10',
    patternSlug: 'it-preposizioni',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'gratuita / prima / cancellazione / tre / fino / giorni / la / a / è',
    answer: 'La cancellazione è gratuita fino a tre giorni prima.',
    hint: '"fino a" leitet die Frist ein, "prima" schließt sie ab.'
  },
  {
    id: 'it.a2b1.e.d11.11',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Com’era l’agriturismo?\n— Bellissimo. ___ (esserci) la piscina e la colazione ___ (essere) abbondante.',
    answer: 'C’era / era',
    hint: 'Zwei Beschreibungen hintereinander: beide im imperfetto.'
  },
  {
    id: 'it.a2b1.r.d11.01',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ___ (fermarsi) in un agriturismo lungo la strada.',
    answer: 'ci siamo fermati',
    hint: 'Reflexiv mit essere, Partizip im männlichen Plural.'
  },
  {
    id: 'it.a2b1.r.d11.02',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le mie amiche ___ (arrivare) all’ostello dopo mezzanotte.',
    answer: 'sono arrivate',
    hint: 'Bewegungsverb mit essere, weiblicher Plural: arrivate.'
  },
  {
    id: 'it.a2b1.r.d11.03',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Io ___ (chiedere) una coperta in più.',
    answer: 'ho chiesto',
    hint: 'chiedere → chiesto, mit avere.'
  },
  {
    id: 'it.a2b1.r.d11.04',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Nel frigobar c’è ancora qualcosa.',
    answer: 'Nel frigobar non c’è più niente.',
    hint: '"non … più niente" bleibt eine einzige Verneinung.'
  },
  {
    id: 'it.a2b1.r.d11.05',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La chiave magnetica? ___ ho lasciata in camera.',
    answer: 'L’',
    hint: 'Vor Vokal wird "la" zu "l’", das Partizip bleibt angeglichen.'
  },
  {
    id: 'it.a2b1.e.d12.01',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre ___ (fare, io) il check-in, ho perso la carta d’imbarco.',
    answer: 'facevo',
    hint: 'Nach "mentre" steht die laufende Handlung im imperfetto.'
  },
  {
    id: 'it.a2b1.e.d12.02',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il treno ___ (essere) in ritardo, così ___ (perdere, noi) la coincidenza.',
    answer: 'era / abbiamo perso',
    hint: 'Die Verspätung ist der Umstand (imperfetto), das Verpassen das Ereignis (passato prossimo).'
  },
  {
    id: 'it.a2b1.e.d12.03',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Da studente ___ (prendere, io) sempre il treno regionale.',
    answer: 'prendevo',
    hint: 'Gewohnheit in der Vergangenheit: imperfetto.'
  },
  {
    id: 'it.a2b1.e.d12.04',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Non ___ che c’era uno scalo a Monaco.',
    answer: 'sapevo',
    options: [
      'sapevo',
      'ho saputo',
      'saprei'
    ],
    hint: '"sapevo" = ich wusste (Zustand). "Ho saputo" hieße: ich habe es erfahren.'
  },
  {
    id: 'it.a2b1.e.d12.05',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'choice',
    prompt: '___ del ritardo solo quando sono arrivato al gate.',
    answer: 'Ho saputo',
    options: [
      'Ho saputo',
      'Sapevo',
      'Sapo'
    ],
    hint: 'Hier ist der Moment des Erfahrens gemeint: passato prossimo.'
  },
  {
    id: 'it.a2b1.e.d12.06',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mentre ho aspettato al nastro bagagli, ho letto il giornale.',
    answer: 'Mentre aspettavo al nastro bagagli, ho letto il giornale.',
    hint: 'Nach "mentre" steht der Hintergrund im imperfetto.'
  },
  {
    id: 'it.a2b1.e.d12.07',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Da bambino ho preso sempre l’aereo con mia madre.',
    answer: 'Da bambino prendevo sempre l’aereo con mia madre.',
    hint: '"sempre" plus Kindheit signalisiert Gewohnheit: imperfetto.'
  },
  {
    id: 'it.a2b1.e.d12.08',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Aspettavo in sala d’attesa. + Hanno annunciato il cambio di binario.',
    answer: 'Mentre aspettavo in sala d’attesa, hanno annunciato il cambio di binario.',
    hint: 'Hintergrund im imperfetto, Ereignis im passato prossimo.'
  },
  {
    id: 'it.a2b1.e.d12.09',
    patternSlug: 'it-passato-avere',
    kind: 'satz',
    type: 'translate',
    prompt: 'Die Fluggesellschaft hat mein Gepäck verloren.',
    answer: 'La compagnia aerea ha smarrito il mio bagaglio.',
    hint: '"smarrire" ist der Fachbegriff auf Formularen, "perdere" die Alltagsvariante.'
  },
  {
    id: 'it.a2b1.r.d12.01',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Lo scompartimento ___ (essere) pieno e ___ (fare) molto caldo.',
    answer: 'era / faceva',
    hint: 'Zwei Beschreibungen: beide im imperfetto, fare ist unregelmäßig.'
  },
  {
    id: 'it.a2b1.r.d12.02',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Loro ___ (svegliarsi) tardi e hanno perso il volo.',
    answer: 'si sono svegliati',
    hint: 'Reflexiv mit essere, Partizip im männlichen Plural.'
  },
  {
    id: 'it.a2b1.r.d12.03',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'L’aereo ___ (atterrare) con un’ora di ritardo.',
    answer: 'è atterrato',
    hint: 'Bewegungsverb: essere, Partizip auf -o für "l’aereo".'
  },
  {
    id: 'it.a2b1.r.d12.04',
    patternSlug: 'it-interrogativi-avanzati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ bagagli a mano posso portare?',
    answer: 'Quanti',
    hint: '"bagagli" ist männlicher Plural: quanti.'
  },
  {
    id: 'it.a2b1.r.d12.05',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'L’assistente di volo ___ ha portato una coperta (a me).',
    answer: 'mi',
    hint: '1. Person Singular: mi, für direkt und indirekt gleich.'
  },
  {
    id: 'it.a2b1.e.d13.01',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Quanti gradi ci sono? — Ce ___ sono tre sotto zero.',
    answer: 'ne',
    hint: 'Bei Mengenangaben ist "ne" Pflicht; vor "ne" wird "ci" zu "ce".'
  },
  {
    id: 'it.a2b1.e.d13.02',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Del temporale ___ parlano tutti i telegiornali.',
    answer: 'ne',
    hint: '"parlare di" wird durch "ne" ersetzt.'
  },
  {
    id: 'it.a2b1.e.d13.03',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'In montagna d’inverno? ___ vado ogni anno.',
    answer: 'Ci',
    hint: 'Ein Ort mit "in" wird durch "ci" ersetzt.'
  },
  {
    id: 'it.a2b1.e.d13.04',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Con quest’afa non ___ riesco a dormire.',
    answer: 'ci',
    options: [
      'ci',
      'ne',
      'lo'
    ],
    hint: '"riuscire a" verlangt "ci", nicht "ne".'
  },
  {
    id: 'it.a2b1.e.d13.05',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ombrelli? Prendo due, uno per te.',
    answer: 'Ombrelli? Ne prendo due, uno per te.',
    hint: 'Bei einer Menge aus einem Ganzen steht "ne" – im Deutschen bleibt es unübersetzt.'
  },
  {
    id: 'it.a2b1.e.d13.06',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ci ne sono tre gradi sotto zero.',
    answer: 'Ce ne sono tre gradi sotto zero.',
    hint: 'Vor "ne" wird "ci" zu "ce": ce ne sono.'
  },
  {
    id: 'it.a2b1.e.d13.07',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Non credo alle previsioni del tempo. → Non ___ credo.',
    answer: 'ci',
    hint: '"credere a" verlangt "ci".'
  },
  {
    id: 'it.a2b1.e.d13.08',
    patternSlug: 'it-si-impersonale',
    kind: 'satz',
    type: 'translate',
    prompt: 'Zuerst sieht man den Blitz, dann hört man den Donner.',
    answer: 'Prima si vede il lampo, poi si sente il tuono.',
    hint: '"lampo" ist der Lichtschein, "fulmine" die Entladung.'
  },
  {
    id: 'it.a2b1.e.d13.10',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'sciolta / neve / due / si / la / giorni / è / in',
    answer: 'La neve si è sciolta in due giorni.',
    hint: 'Reflexives Verb im passato prossimo: essere plus angeglichenes Partizip.'
  },
  {
    id: 'it.a2b1.e.d13.11',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Hai controllato il meteo per domenica?\n— Sì, ___ ho guardato stamattina: danno sereno.',
    answer: 'l’',
    hint: '"il meteo" ist ein direktes Objekt: Pronomen "lo", vor Vokal "l’".'
  },
  {
    id: 'it.a2b1.r.d13.01',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre ___ (piovere), siamo rimasti in sala d’attesa.',
    answer: 'pioveva',
    hint: 'Nach "mentre" steht der Hintergrund im imperfetto.'
  },
  {
    id: 'it.a2b1.r.d13.02',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Da bambini ___ (esserci) sempre la neve a Natale.',
    answer: 'c’era',
    hint: 'Beschreibung eines wiederkehrenden Zustands: c’era.'
  },
  {
    id: 'it.a2b1.r.d13.03',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Io ___ (mettersi) il piumino e i guanti.',
    answer: 'mi sono messo',
    hint: 'Reflexiv mit essere; Partizip von mettere ist "messo".'
  },
  {
    id: 'it.a2b1.r.d13.04',
    patternSlug: 'it-pronomi-diretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La crema solare? ___ ho dimenticata in albergo.',
    answer: 'L’',
    hint: 'Vor Vokal wird "la" zu "l’"; das Partizip bleibt angeglichen: dimenticata.'
  },
  {
    id: 'it.a2b1.r.d13.05',
    patternSlug: 'it-passato-avere',
    kind: 'satz',
    type: 'translate',
    prompt: 'Der Hagel hat das Dach beschädigt.',
    answer: 'La grandine ha danneggiato il tetto.',
    hint: 'Transitives Verb: passato prossimo mit avere, Partizip unverändert.'
  },
  {
    id: 'it.a2b1.e.d14.01',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il biglietto? ___ mando adesso. (a te + il biglietto)',
    answer: 'Te lo',
    hint: 'ti + lo wird zu "te lo": das indirekte Pronomen steht vorn und ändert das i zu e.'
  },
  {
    id: 'it.a2b1.e.d14.02',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La chiave? ___ ho già data. (a lui + la chiave)',
    answer: 'Gliel’',
    hint: 'gli + la = gliela, vor Vokal "gliel’". Das Partizip bleibt angeglichen: data.'
  },
  {
    id: 'it.a2b1.e.d14.03',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Di tempo ___ vuole ancora molto. (ci + ne)',
    answer: 'ce ne',
    hint: 'Vor "ne" wird "ci" zu "ce": ce ne vuole.'
  },
  {
    id: 'it.a2b1.e.d14.04',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mi lo hanno detto solo ieri.',
    answer: 'Me lo hanno detto solo ieri.',
    hint: 'Vor einem direkten Pronomen wird "mi" zu "me".'
  },
  {
    id: 'it.a2b1.e.d14.05',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Non voglio dire glielo per telefono.',
    answer: 'Non voglio dirglielo per telefono.',
    hint: 'Am Infinitiv fällt das -e weg und beide Pronomen hängen sich als ein Wort an.'
  },
  {
    id: 'it.a2b1.e.d14.06',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mando le previsioni a Marco. → ___ mando subito.',
    answer: 'Gliele',
    hint: 'gli + le = gliele, ein Wort.'
  },
  {
    id: 'it.a2b1.e.d14.08',
    patternSlug: 'it-preposizioni',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich fahre zweimal im Jahr nach Italien.',
    answer: 'Vado in Italia due volte all’anno.',
    hint: '"all’anno" statt "per anno"; Länder mit "in" ohne Artikel.'
  },
  {
    id: 'it.a2b1.e.d14.09',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'satz',
    type: 'translate',
    prompt: 'Una volta qui c’era un cinema; da allora è diventato tutto più caro.',
    answer: 'Früher war hier ein Kino; seitdem ist alles teurer geworden.',
    hint: '"una volta" mit imperfetto, "da allora" mit passato prossimo.'
  },
  {
    id: 'it.a2b1.e.d14.10',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'due / lavori / giro / hanno / nel / settimane / finito / di / i',
    answer: 'Nel giro di due settimane hanno finito i lavori.',
    hint: 'Die Zeitangabe mit "nel giro di" steht vorn, dann Hilfsverb, Partizip und Objekt.'
  },
  {
    id: 'it.a2b1.e.d14.11',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Hai dato il documento all’amministratore?\n— Sì, ___ ho dato ieri.',
    answer: 'gliel’',
    hint: 'gli + lo = glielo; vor "ho" wird es apostrophiert.'
  },
  {
    id: 'it.a2b1.r.d14.01',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il proprietario ___ (mettere) i mobili in cantina.',
    answer: 'ha messo',
    hint: 'mettere → messo, Hilfsverb avere.'
  },
  {
    id: 'it.a2b1.r.d14.02',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le turiste ___ (salire) sul campanile.',
    answer: 'sono salite',
    hint: 'salire ohne Objekt: essere, weiblicher Plural "salite".'
  },
  {
    id: 'it.a2b1.r.d14.03',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ___ (dimenticarsi) di timbrare il biglietto.',
    answer: 'ci siamo dimenticati',
    hint: 'Reflexiv: immer essere, Partizip an "noi" angeglichen.'
  },
  {
    id: 'it.a2b1.r.d14.04',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La camera ___ (essere) rumorosa e non ___ (esserci) l’ascensore.',
    answer: 'era / c’era',
    hint: 'Zwei Beschreibungen: beide im imperfetto.'
  },
  {
    id: 'it.a2b1.r.d14.05',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre ___ (aspettare, io) al gate, ___ (annunciare, loro) il ritardo.',
    answer: 'aspettavo / hanno annunciato',
    hint: 'Hintergrund im imperfetto, Ereignis im passato prossimo.'
  },
  {
    id: 'it.a2b1.r.d14.06',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Di gradi ___ mancano ancora due per arrivare a zero.',
    answer: 'ne',
    hint: 'Bei Mengen aus einem Ganzen steht "ne".'
  },
  {
    id: 'it.a2b1.r.d14.07',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Al mare in inverno? Non ___ vado mai.',
    answer: 'ci',
    hint: 'Ein Ort mit "a" wird durch "ci" ersetzt.'
  },
  {
    id: 'it.a2b1.r.d14.08',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich wusste nicht, dass es einen Zwischenstopp gibt.',
    answer: 'Non sapevo che c’era uno scalo.',
    hint: '"sapevo" beschreibt einen Zustand; "ho saputo" hieße "ich habe erfahren".'
  },
  {
    id: 'it.a2b1.r.d14.10',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Nel deposito bagagli c’è ancora qualcosa di mio.',
    answer: 'Nel deposito bagagli non c’è più niente di mio.',
    hint: '"non … più niente" bleibt eine einzige Verneinung.'
  },
  {
    id: 'it.a2b1.e.d15.01',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il contratto ___ (scadere) a dicembre.',
    answer: 'scadrà',
    hint: 'scadere hat einen verkürzten Stamm: scadr-.'
  },
  {
    id: 'it.a2b1.e.d15.02',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'L’anno prossimo l’azienda ___ (aprire) una filiale a Bari.',
    answer: 'aprirà',
    hint: 'Regelmäßiges -ire-Verb: aprir- plus Endung -à.'
  },
  {
    id: 'it.a2b1.e.d15.03',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (avere, io) tempo, ti ___ (mandare) il preventivo.',
    answer: 'avrò / manderò',
    hint: 'Nach "se" steht im Italienischen das Futur; avere hat den Stamm avr-, mandare wird zu mander-.'
  },
  {
    id: 'it.a2b1.e.d15.04',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Quando ___ (finire) il periodo di prova, parleremo dell’aumento.',
    answer: 'finirà',
    hint: 'Auch nach "quando" steht das Futur, wenn die Handlung in der Zukunft liegt.'
  },
  {
    id: 'it.a2b1.e.d15.05',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Domani parlarò con il datore di lavoro.',
    answer: 'Domani parlerò con il datore di lavoro.',
    hint: 'Bei -are-Verben wird das a im Futur zu e: parlerò.'
  },
  {
    id: 'it.a2b1.e.d15.06',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Se ho tempo, venirò alla riunione.',
    answer: 'Se avrò tempo, verrò alla riunione.',
    hint: 'Zweimal falsch: nach "se" steht das Futur, und venire hat den Stamm verr-.'
  },
  {
    id: 'it.a2b1.e.d15.07',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Non risponde: sarà in riunione.',
    answer: 'Er wird wohl in einer Besprechung sein.',
    options: [
      'Er wird wohl in einer Besprechung sein.',
      'Er wird in einer Besprechung sein (Termin).',
      'Er war in einer Besprechung.'
    ],
    hint: 'Das Futur drückt hier eine Vermutung über die Gegenwart aus, keine Zukunft.'
  },
  {
    id: 'it.a2b1.e.d15.08',
    patternSlug: 'it-futuro',
    kind: 'satz',
    type: 'translate',
    prompt: 'Nach zwei Jahren werden sie mir den unbefristeten Vertrag geben.',
    answer: 'Dopo due anni mi daranno il contratto a tempo indeterminato.',
    hint: 'dare hat im Futur den Stamm dar-: darò, darai, darà, daranno.'
  },
  {
    id: 'it.a2b1.e.d15.09',
    patternSlug: 'it-si-impersonale',
    kind: 'satz',
    type: 'translate',
    prompt: 'Sulla busta paga si vede la differenza tra lordo e netto.',
    answer: 'Auf der Gehaltsabrechnung sieht man den Unterschied zwischen brutto und netto.',
    hint: '"si vede" ist die unpersönliche Form: man sieht.'
  },
  {
    id: 'it.a2b1.e.d15.10',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'dimissioni / il / dopo / ha / con / dato / litigio / capo / le / il',
    answer: 'Dopo il litigio con il capo ha dato le dimissioni.',
    hint: '"dare le dimissioni" ist die feste Wendung fürs Selbstkündigen.'
  },
  {
    id: 'it.a2b1.e.d15.11',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Quando ___ (sapere, noi) qualcosa sul rinnovo?\n— Ve lo diremo entro la fine del mese.',
    answer: 'sapremo',
    hint: 'sapere hat im Futur den verkürzten Stamm sapr-.'
  },
  {
    id: 'it.a2b1.r.d15.01',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La fattura? ___ mando subito per email. (a Lei + la fattura)',
    answer: 'Gliela',
    hint: 'le + la = gliela, ein Wort.'
  },
  {
    id: 'it.a2b1.r.d15.02',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il preventivo? ___ hanno mandato ieri. (a me + il preventivo)',
    answer: 'Me l’',
    hint: 'mi + lo = me lo; vor "hanno" wird es apostrophiert.'
  },
  {
    id: 'it.a2b1.r.d15.03',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre ___ (fare, io) il tirocinio, mi ___ (offrire, loro) un contratto.',
    answer: 'facevo / hanno offerto',
    hint: 'Nach "mentre" der Hintergrund im imperfetto, das Ereignis im passato prossimo.'
  },
  {
    id: 'it.a2b1.r.d15.04',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Lei ___ (dimettersi) a fine mese.',
    answer: 'si è dimessa',
    hint: 'Reflexiv mit essere; Partizip "dimesso", weiblich "dimessa".'
  },
  {
    id: 'it.a2b1.r.d15.05',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Di straordinari questo mese ___ ho fatti venti.',
    answer: 'ne',
    hint: 'Bei Mengen steht "ne"; das Partizip gleicht sich an: fatti.'
  },
  {
    id: 'it.a2b1.e.d16.01',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (mandare) l’allegato entro le cinque.',
    answer: 'Manda',
    hint: 'Bei -are-Verben endet die Du-Form auf -a: manda.'
  },
  {
    id: 'it.a2b1.e.d16.02',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (passare) la chiamata all’interno 214, per favore.',
    answer: 'Passi',
    hint: 'Bei -are-Verben endet die Sie-Form auf -i – genau umgekehrt zur Du-Form.'
  },
  {
    id: 'it.a2b1.e.d16.03',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (prendere) appunti, poi scriviamo il verbale.',
    answer: 'Prenda',
    hint: 'Bei -ere-Verben endet die Sie-Form auf -a: prenda.'
  },
  {
    id: 'it.a2b1.e.d16.04',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (non inoltrare) questa mail a nessuno.',
    answer: 'Non inoltrare',
    hint: 'Der verneinte Imperativ der Du-Form ist "non" plus Infinitiv.'
  },
  {
    id: 'it.a2b1.e.d16.05',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Parli con il centralino e chiedi l’interno!',
    answer: 'Parla con il centralino e chiedi l’interno!',
    hint: '"parli" ist die Sie-Form; zum Duzen heißt es bei -are-Verben "parla".'
  },
  {
    id: 'it.a2b1.e.d16.06',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Dicami il numero e la richiamo subito.',
    answer: 'Mi dica il numero e la richiamo subito.',
    hint: 'Bei der Sie-Form steht das Pronomen vor dem Verb, es hängt sich nicht an.'
  },
  {
    id: 'it.a2b1.e.d16.07',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mi mandi la scansione. → ___ la scansione.',
    answer: 'Mandami',
    hint: 'In der Du-Form hängt das Pronomen an: manda + mi = mandami.'
  },
  {
    id: 'it.a2b1.e.d16.08',
    patternSlug: 'it-imperativo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Warten Sie einen Moment, ich stelle Sie in die Warteschleife.',
    answer: 'Aspetti un attimo, la metto in attesa.',
    hint: 'Sie-Form von aspettare: aspetti. Das Pronomen "la" steht vor dem Verb.'
  },
  {
    id: 'it.a2b1.e.d16.09',
    patternSlug: 'it-pronomi-combinati',
    kind: 'satz',
    type: 'translate',
    prompt: 'La tua mail era finita nella posta indesiderata: te la inoltro adesso.',
    answer: 'Deine Mail war im Spam gelandet: Ich leite sie dir jetzt weiter.',
    hint: '"te la" ist ein kombiniertes Pronomen aus ti + la.'
  },
  {
    id: 'it.a2b1.e.d16.10',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'copia / metti / il / conoscenza / capo / in',
    answer: 'Metti il capo in copia conoscenza.',
    hint: 'Imperativ vorn, dann Objekt, dann die feste Wendung.'
  },
  {
    id: 'it.a2b1.e.d16.11',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Buongiorno, vorrei parlare con la dottoressa Neri.\n— ___ (attendere, Lei) in linea, gliela passo.',
    answer: 'Attenda',
    hint: 'Sie-Form von attendere (-ere): attenda.'
  },
  {
    id: 'it.a2b1.r.d16.01',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (esserci) tempo, faremo la videochiamata domani.',
    answer: 'ci sarà',
    hint: 'Nach "se" steht das Futur; essere hat den Stamm sar-.'
  },
  {
    id: 'it.a2b1.r.d16.02',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La ___ (richiamare, io) fra mezz’ora.',
    answer: 'richiamerò',
    hint: '-are-Verb: das a wird im Futur zu e.'
  },
  {
    id: 'it.a2b1.r.d16.03',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La scansione? ___ mando subito. (a te + la scansione)',
    answer: 'Te la',
    hint: 'ti + la = te la.'
  },
  {
    id: 'it.a2b1.r.d16.04',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Di appunti ___ ho presi tre pagine.',
    answer: 'ne',
    hint: 'Bei Mengen steht "ne"; das Partizip gleicht sich an: presi.'
  },
  {
    id: 'it.a2b1.r.d16.05',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La linea ___ (cadere) tre volte durante la conferenza.',
    answer: 'è caduta',
    hint: 'cadere nimmt essere; das Partizip gleicht sich an "la linea" an.'
  },
  {
    id: 'it.a2b1.e.d17.01',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (volere, io) iscrivermi al corso di laurea in economia.',
    answer: 'Vorrei',
    hint: 'volere hat den Stamm vorr-: vorrei, vorresti, vorrebbe.'
  },
  {
    id: 'it.a2b1.e.d17.02',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (potere, Lei) darmi il certificato di iscrizione?',
    answer: 'Potrebbe',
    hint: 'potere hat den Stamm potr-; die Sie-Form entspricht der 3. Person.'
  },
  {
    id: 'it.a2b1.e.d17.03',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (dovere, tu) ripassare prima dell’orale.',
    answer: 'Dovresti',
    hint: 'Das condizionale von dovere gibt einen Rat: du solltest.'
  },
  {
    id: 'it.a2b1.e.d17.04',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mi ___ (piacere) fare la tesi con quel relatore.',
    answer: 'piacerebbe',
    hint: '"piacere" konstruiert indirekt: mi piacerebbe = mir würde gefallen.'
  },
  {
    id: 'it.a2b1.e.d17.05',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Wir würden gern das Thema vertiefen.',
    answer: 'Approfondiremmo volentieri l’argomento.',
    options: [
      'Approfondiremmo volentieri l’argomento.',
      'Approfondiremo volentieri l’argomento.',
      'Approfondivamo volentieri l’argomento.'
    ],
    hint: 'Doppel-m kennzeichnet das condizionale; ein m wäre Futur.'
  },
  {
    id: 'it.a2b1.e.d17.06',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Voglio un’informazione sulle tasse universitarie.',
    answer: 'Vorrei un’informazione sulle tasse universitarie.',
    hint: 'Am Schalter ist "voglio" schroff; das condizionale "vorrei" ist der Normalfall.'
  },
  {
    id: 'it.a2b1.e.d17.07',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mi piacerebbe, ma non poterei venire all’appello di gennaio.',
    answer: 'Mi piacerebbe, ma non potrei venire all’appello di gennaio.',
    hint: 'potere hat den verkürzten Stamm potr-, nicht "poter-".'
  },
  {
    id: 'it.a2b1.e.d17.08',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'satz',
    type: 'translate',
    prompt: 'Mir fehlen zwölf Punkte bis zum Abschluss.',
    answer: 'Mi mancano dodici crediti per laurearmi.',
    hint: '"mancare" konstruiert indirekt und richtet sich nach dem Fehlenden: mancano.'
  },
  {
    id: 'it.a2b1.e.d17.09',
    patternSlug: 'it-condizionale',
    kind: 'satz',
    type: 'translate',
    prompt: 'Secondo la segreteria, le iscrizioni chiuderebbero il 30 settembre.',
    answer: 'Laut Sekretariat sollen die Anmeldungen am 30. September schließen.',
    hint: 'Das condizionale markiert hier eine ungesicherte Information.'
  },
  {
    id: 'it.a2b1.e.d17.10',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'esame / prima / veloce / un / dell’ / aiuta / ripasso',
    answer: 'Un ripasso veloce prima dell’esame aiuta.',
    hint: 'Subjekt mit Adjektiv, dann die Zeitangabe, dann das Verb.'
  },
  {
    id: 'it.a2b1.e.d17.11',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Non so se dare l’esame a gennaio o a febbraio.\n— Al posto tuo ___ (aspettare) febbraio: avresti più tempo per ripassare.',
    answer: 'aspetterei',
    hint: 'Ein Rat in der Ich-Form: "al posto tuo aspetterei" = an deiner Stelle würde ich warten.'
  },
  {
    id: 'it.a2b1.r.d17.01',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (riassumere) il capitolo in dieci righe.',
    answer: 'Riassumi',
    hint: 'Bei -ere-Verben endet die Du-Form auf -i: riassumi.'
  },
  {
    id: 'it.a2b1.r.d17.02',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (non memorizzare) tutto, cerca di capire.',
    answer: 'Non memorizzare',
    hint: 'Verneinter Du-Imperativ: "non" plus Infinitiv.'
  },
  {
    id: 'it.a2b1.r.d17.03',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le dispense? ___ ha date il professore. (a noi + le dispense)',
    answer: 'Ce le',
    hint: 'ci + le = ce le; das Partizip gleicht sich an: date.'
  },
  {
    id: 'it.a2b1.r.d17.04',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Lei ___ (iscriversi) al corso a settembre.',
    answer: 'si è iscritta',
    hint: 'Reflexiv mit essere; Partizip "iscritto", weiblich "iscritta".'
  },
  {
    id: 'it.a2b1.r.d17.05',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre ___ (studiare, io) per l’orale, mi ___ (chiamare, loro) dalla segreteria.',
    answer: 'studiavo / hanno chiamato',
    hint: 'Hintergrund im imperfetto, Ereignis im passato prossimo.'
  },
  {
    id: 'it.a2b1.e.d18.01',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il giardinaggio è più rilassante ___ fai da te.',
    answer: 'del',
    hint: 'Vor einem Nomen steht "di", hier verschmolzen zu "del".'
  },
  {
    id: 'it.a2b1.e.d18.02',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Questo hobby è più impegnativo ___ divertente.',
    answer: 'che',
    hint: 'Zwei Eigenschaften werden verglichen: "che".'
  },
  {
    id: 'it.a2b1.e.d18.03',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Passa più tempo sui videogiochi ___ sui libri.',
    answer: 'che',
    hint: 'Zwei präpositionale Ausdrücke werden verglichen: "che".'
  },
  {
    id: 'it.a2b1.e.d18.04',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Questo romanzo è ___ di quello.',
    answer: 'migliore',
    options: [
      'migliore',
      'più buono',
      'meglio'
    ],
    hint: 'buono hat den unregelmäßigen Komparativ "migliore"; "meglio" ist das Adverb.'
  },
  {
    id: 'it.a2b1.e.d18.05',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mio fratello canta più bene di me.',
    answer: 'Mio fratello canta meglio di me.',
    hint: 'Nach einem Verb steht das Adverb "meglio", nicht "più bene".'
  },
  {
    id: 'it.a2b1.e.d18.06',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Il circolo del paese è più grande che quello di città.',
    answer: 'Il circolo del paese è più grande di quello di città.',
    hint: 'Vor einem Pronomen steht "di", nicht "che".'
  },
  {
    id: 'it.a2b1.e.d18.07',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Questo sentiero è lungo. (in der Gegend) → …',
    answer: 'Questo è il sentiero più lungo della zona.',
    hint: 'Superlativ: Artikel + Nomen + più + Adjektiv + di für die Gruppe.'
  },
  {
    id: 'it.a2b1.e.d18.08',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'L’escursione è stata molto faticosa. → L’escursione è stata ___ .',
    answer: 'faticosissima',
    hint: 'Der absolute Superlativ hängt -issimo an und richtet sich nach dem Bezugswort.'
  },
  {
    id: 'it.a2b1.e.d18.09',
    patternSlug: 'it-comparativo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Dieser Kurs ist genauso anspruchsvoll wie der vorherige.',
    answer: 'Questo corso è impegnativo come il precedente.',
    hint: 'Gleichheit mit "come" oder "tanto … quanto".'
  },
  {
    id: 'it.a2b1.e.d18.10',
    patternSlug: 'it-comparativo',
    kind: 'satz',
    type: 'translate',
    prompt: 'I fumetti sono più utili dei manuali per imparare la lingua parlata.',
    answer: 'Comics sind nützlicher als Lehrbücher, um die gesprochene Sprache zu lernen.',
    hint: 'Zwei Nomen im selben Merkmal: "di", verschmolzen zu "dei".'
  },
  {
    id: 'it.a2b1.e.d18.11',
    patternSlug: 'it-svo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'quota / soci / gennaio / la / i / pagano / a',
    answer: 'I soci pagano la quota a gennaio.',
    hint: 'Subjekt, Verb, Objekt, Zeitangabe.'
  },
  {
    id: 'it.a2b1.r.d18.01',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mi ___ (piacere) iscrivermi a un corso di ceramica.',
    answer: 'piacerebbe',
    hint: '"piacere" konstruiert indirekt: mi piacerebbe.'
  },
  {
    id: 'it.a2b1.r.d18.02',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Domenica ___ (fare, noi) una gita al lago.',
    answer: 'faremo',
    hint: 'fare hat im Futur den Stamm far-.'
  },
  {
    id: 'it.a2b1.r.d18.03',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (portare + mi) il binocolo, per favore.',
    answer: 'Portami',
    hint: 'Bei -are-Verben endet die Du-Form auf -a, das Pronomen hängt an.'
  },
  {
    id: 'it.a2b1.r.d18.04',
    patternSlug: 'it-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mia nonna ___ (lavorare) a maglia davanti alla tv.',
    answer: 'lavorava',
    hint: 'Gewohnheit in der Vergangenheit: imperfetto.'
  },
  {
    id: 'it.a2b1.r.d18.05',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Di francobolli ___ ho più di mille.',
    answer: 'ne',
    hint: 'Bei Mengen aus einem Ganzen steht "ne".'
  },
  {
    id: 'it.a2b1.e.d19.01',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'L’allenatore ___ ci segue è molto giovane.',
    answer: 'che',
    hint: '"che" vertritt hier das Subjekt des Relativsatzes und bleibt unverändert.'
  },
  {
    id: 'it.a2b1.e.d19.02',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Questa è la squadra con ___ gioco da tre anni.',
    answer: 'cui',
    hint: 'Nach einer Präposition ist "che" ausgeschlossen: es heißt "con cui".'
  },
  {
    id: 'it.a2b1.e.d19.03',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il 2019 è l’anno in ___ ho vinto la prima medaglia.',
    answer: 'cui',
    hint: 'Zeitangaben mit Präposition: "in cui", nicht "quando".'
  },
  {
    id: 'it.a2b1.e.d19.04',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Non capisco il motivo per che l’arbitro ha fermato la partita.',
    answer: 'Non capisco il motivo per cui l’arbitro ha fermato la partita.',
    hint: 'Nach "per" steht "cui", nie "che".'
  },
  {
    id: 'it.a2b1.e.d19.05',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'La partita abbiamo visto è finita in pareggio.',
    answer: 'La partita che abbiamo visto è finita in pareggio.',
    hint: 'Anders als im Englischen darf das Relativpronomen nie fehlen.'
  },
  {
    id: 'it.a2b1.e.d19.06',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Questo è lo spogliatoio. + Nello spogliatoio ci cambiamo.',
    answer: 'Questo è lo spogliatoio in cui ci cambiamo.',
    hint: 'Die Präposition "in" bleibt erhalten und verlangt "cui"; bei Orten ist auch "dove" möglich.'
  },
  {
    id: 'it.a2b1.e.d19.07',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho comprato una racchetta. + La racchetta costa novanta euro.',
    answer: 'La racchetta che ho comprato costa novanta euro.',
    hint: '"che" vertritt hier das direkte Objekt und bleibt unverändert.'
  },
  {
    id: 'it.a2b1.e.d19.08',
    patternSlug: 'it-riflessivi',
    kind: 'satz',
    type: 'translate',
    prompt: 'Er hat sich beim Training verletzt.',
    answer: 'Si è infortunato durante l’allenamento.',
    hint: 'Reflexives Verb: passato prossimo mit essere und angeglichenem Partizip.'
  },
  {
    id: 'it.a2b1.e.d19.09',
    patternSlug: 'it-comparativo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Il recupero è importante quanto l’allenamento.',
    answer: 'Die Erholung ist genauso wichtig wie das Training.',
    hint: '"quanto" drückt hier Gleichheit aus, wie "come".'
  },
  {
    id: 'it.a2b1.e.d19.10',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'gol / primo / due / ha / nel / tempo / fatto',
    answer: 'Ha fatto due gol nel primo tempo.',
    hint: 'Hilfsverb und Partizip zusammen, dann Objekt und Zeitangabe.'
  },
  {
    id: 'it.a2b1.e.d19.11',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Per chi tifi?\n— Per la squadra ___ gioca in casa: sono nato qui.',
    answer: 'che',
    hint: '"che" als Subjekt des Relativsatzes.'
  },
  {
    id: 'it.a2b1.r.d19.01',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il nuoto è più completo ___ tennis.',
    answer: 'del',
    hint: 'Vor einem Nomen steht "di", verschmolzen zu "del".'
  },
  {
    id: 'it.a2b1.r.d19.02',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Dopo l’infortunio corre ___ di prima.',
    answer: 'peggio',
    options: [
      'peggio',
      'più male',
      'peggiore'
    ],
    hint: 'Nach einem Verb steht das Adverb "peggio"; "peggiore" wäre das Adjektiv.'
  },
  {
    id: 'it.a2b1.r.d19.03',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (prendere) fiato prima della prossima serie.',
    answer: 'Prendi',
    hint: 'Bei -ere-Verben endet die Du-Form auf -i.'
  },
  {
    id: 'it.a2b1.r.d19.04',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Al posto tuo ___ (riposare, io) una settimana.',
    answer: 'riposerei',
    hint: 'Rat in der Ich-Form: condizionale von riposare.'
  },
  {
    id: 'it.a2b1.r.d19.05',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre ___ (correre, io), mi ___ (fare) male alla caviglia.',
    answer: 'correvo / sono fatto',
    hint: 'Hintergrund im imperfetto, das Ereignis reflexiv mit essere.'
  },
  {
    id: 'it.a2b1.e.d20.01',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Io ___ (scaricare) l’aggiornamento, ci vuole ancora un minuto.',
    answer: 'sto scaricando',
    hint: 'stare + gerundio: -are-Verben bilden -ando.'
  },
  {
    id: 'it.a2b1.e.d20.02',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Loro ___ (fare) un’intervista in diretta.',
    answer: 'stanno facendo',
    hint: 'fare hat den unregelmäßigen gerundio "facendo".'
  },
  {
    id: 'it.a2b1.e.d20.03',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Che cosa ___ (dire, tu)? Non ti sento, non c’è segnale.',
    answer: 'stai dicendo',
    hint: 'dire → dicendo, ebenfalls unregelmäßig.'
  },
  {
    id: 'it.a2b1.e.d20.04',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il telegiornale ___ (cominciare).',
    answer: 'sta per cominciare',
    hint: '"stare per" plus Infinitiv heißt: kurz davor sein.'
  },
  {
    id: 'it.a2b1.e.d20.05',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Sto andando a Roma la settimana prossima.',
    answer: 'Vado a Roma la settimana prossima.',
    hint: 'Die Verlaufsform beschreibt nur den laufenden Moment, nie die Zukunft.'
  },
  {
    id: 'it.a2b1.e.d20.06',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Sto lavorando in questa azienda da dieci anni.',
    answer: 'Lavoro in questa azienda da dieci anni.',
    hint: 'Ein Zustand über zehn Jahre ist keine laufende Handlung: einfaches Präsens.'
  },
  {
    id: 'it.a2b1.e.d20.07',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Sto commentando il post. + La connessione salta. → …',
    answer: 'Stavo commentando il post quando è saltata la connessione.',
    hint: '"stare" steht im imperfetto, das Ereignis im passato prossimo.'
  },
  {
    id: 'it.a2b1.e.d20.08',
    patternSlug: 'it-imperativo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Prüf immer die Quelle, bevor du teilst.',
    answer: 'Controlla sempre la fonte prima di condividere.',
    hint: 'Nach "prima di" steht der Infinitiv, nicht der Konjunktiv.'
  },
  {
    id: 'it.a2b1.e.d20.09',
    patternSlug: 'it-imperfetto',
    kind: 'satz',
    type: 'translate',
    prompt: 'Quella notizia era una bufala: il titolo diceva una cosa, l’articolo un’altra.',
    answer: 'Diese Nachricht war eine Falschmeldung: Die Schlagzeile sagte das eine, der Artikel etwas anderes.',
    hint: '"bufala" ist das italienische Wort für eine erfundene Meldung.'
  },
  {
    id: 'it.a2b1.e.d20.11',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'sicurezza / settimana / copia / fai / di / ogni / una',
    answer: 'Fai una copia di sicurezza ogni settimana.',
    hint: 'Imperativ, Objekt, Häufigkeitsangabe.'
  },
  {
    id: 'it.a2b1.r.d20.01',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La serie ___ sto guardando ha sei puntate.',
    answer: 'che',
    hint: '"che" als direktes Objekt des Relativsatzes.'
  },
  {
    id: 'it.a2b1.r.d20.02',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Questo è il sito da ___ ho scaricato l’applicazione.',
    answer: 'cui',
    hint: 'Nach einer Präposition steht "cui", nie "che".'
  },
  {
    id: 'it.a2b1.r.d20.03',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (potere, tu) mandarmi il file via chiavetta?',
    answer: 'Potresti',
    hint: 'Höfliche Bitte: condizionale von potere, Stamm potr-.'
  },
  {
    id: 'it.a2b1.r.d20.04',
    patternSlug: 'it-ne-ci',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Delle notifiche non ___ voglio più sapere niente.',
    answer: 'ne',
    hint: '"sapere di qualcosa" wird durch "ne" ersetzt.'
  },
  {
    id: 'it.a2b1.r.d20.05',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il documentario è più interessante ___ film.',
    answer: 'del',
    hint: 'Vor einem Nomen steht "di", verschmolzen zu "del".'
  },
  {
    id: 'it.a2b1.e.d21.01',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ lo spettacolo era sold out, abbiamo preso i biglietti per giovedì.',
    answer: 'Siccome',
    hint: 'Am Satzanfang steht "siccome" oder "poiché", nie "perché" im Sinn von weil.'
  },
  {
    id: 'it.a2b1.e.d21.02',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La mostra chiude alle sette, ___ dobbiamo sbrigarci.',
    answer: 'quindi',
    hint: '"quindi" und "perciò" leiten die Folge ein.'
  },
  {
    id: 'it.a2b1.e.d21.03',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ la trama è prevedibile, il film è commovente.',
    answer: 'Anche se',
    hint: '"anche se" leitet den Einwand ein – "anche" allein hieße "auch".'
  },
  {
    id: 'it.a2b1.e.d21.04',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Il romanzo è lungo, ___ si legge in due giorni.',
    answer: 'però',
    options: [
      'però',
      'quindi',
      'inoltre'
    ],
    hint: 'Zwischen Länge und schneller Lesbarkeit steht ein Gegensatz.'
  },
  {
    id: 'it.a2b1.e.d21.05',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Perché pioveva, siamo rimasti a casa invece di andare a teatro.',
    answer: 'Siccome pioveva, siamo rimasti a casa invece di andare a teatro.',
    hint: '"perché" kann keinen Grundsatz eröffnen; dafür stehen siccome, poiché, dato che.'
  },
  {
    id: 'it.a2b1.e.d21.06',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Il testo è bello, ma però la musica è banale.',
    answer: 'Il testo è bello, però la musica è banale.',
    hint: '"ma però" häuft zwei Gegensatzwörter – eines reicht.'
  },
  {
    id: 'it.a2b1.e.d21.07',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Recita bene. + Canta.',
    answer: 'Non solo recita bene, ma canta anche.',
    hint: '"non solo" eröffnet, "ma anche" steigert – "anche" steht nach dem Verb.'
  },
  {
    id: 'it.a2b1.e.d21.08',
    patternSlug: 'it-connettivi',
    kind: 'satz',
    type: 'translate',
    prompt: 'Da der Verlag das Manuskript abgelehnt hat, hat sie es selbst veröffentlicht.',
    answer: 'Siccome la casa editrice ha rifiutato il manoscritto, l’ha pubblicato da sola.',
    hint: 'Grundsatz am Anfang: siccome. Das direkte Pronomen "l’" verlangt das angeglichene Partizip.'
  },
  {
    id: 'it.a2b1.e.d21.09',
    patternSlug: 'it-connettivi',
    kind: 'satz',
    type: 'translate',
    prompt: 'L’ambientazione è avvincente, tuttavia i personaggi restano piatti.',
    answer: 'Der Schauplatz ist fesselnd, dennoch bleiben die Figuren flach.',
    hint: '"tuttavia" ist die schriftsprachliche Variante von "però".'
  },
  {
    id: 'it.a2b1.e.d21.10',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'applaudito / pubblico / cinque / il / minuti / per / ha',
    answer: 'Il pubblico ha applaudito per cinque minuti.',
    hint: 'Subjekt, Hilfsverb, Partizip, Zeitdauer mit "per".'
  },
  {
    id: 'it.a2b1.e.d21.11',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '— Com’era il concerto?\n— Bellissimo. ___ (non solo) hanno suonato tre bis, ma anche il direttore ha parlato al pubblico.',
    answer: 'Non solo',
    hint: '"non solo … ma anche" verbindet zwei gesteigerte Aussagen.'
  },
  {
    id: 'it.a2b1.r.d21.01',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (avere, noi) i biglietti, andremo alla prima.',
    answer: 'avremo',
    hint: 'Nach "se" steht das Futur; avere hat den Stamm avr-.'
  },
  {
    id: 'it.a2b1.r.d21.02',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (spegnere) il telefono prima dello spettacolo.',
    answer: 'Spenga',
    hint: 'Bei -ere-Verben endet die Sie-Form auf -a: spenga.'
  },
  {
    id: 'it.a2b1.r.d21.03',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mi ___ (piacere) vedere quella mostra prima che chiuda.',
    answer: 'piacerebbe',
    hint: '"piacere" konstruiert indirekt: mi piacerebbe.'
  },
  {
    id: 'it.a2b1.r.d21.04',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il testo è più bello ___ musica.',
    answer: 'della',
    hint: 'Vor einem Nomen steht "di", verschmolzen zu "della".'
  },
  {
    id: 'it.a2b1.r.d21.05',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Questo capolavoro è ___ del precedente.',
    answer: 'migliore',
    options: [
      'migliore',
      'più buono',
      'meglio'
    ],
    hint: 'buono hat den unregelmäßigen Komparativ "migliore".'
  },
  {
    id: 'it.a2b1.r.d21.06',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il teatro in ___ recita è del Settecento.',
    answer: 'cui',
    hint: 'Nach einer Präposition steht "cui", nie "che".'
  },
  {
    id: 'it.a2b1.r.d21.07',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La scrittrice ___ ha vinto il premio è siciliana.',
    answer: 'che',
    hint: '"che" als Subjekt des Relativsatzes, unveränderlich.'
  },
  {
    id: 'it.a2b1.r.d21.08',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Zitto, ___ (parlare) il regista.',
    answer: 'sta parlando',
    hint: 'stare + gerundio für das, was gerade läuft.'
  },
  {
    id: 'it.a2b1.r.d21.09',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il sipario ___ (alzarsi).',
    answer: 'sta per alzarsi',
    hint: '"stare per" plus Infinitiv: kurz davor sein.'
  },
  {
    id: 'it.a2b1.r.d21.10',
    patternSlug: 'it-pronomi-combinati',
    kind: 'satz',
    type: 'translate',
    prompt: 'Das Buch? Das habe ich ihr schon gegeben.',
    answer: 'Il libro? Gliel’ho già dato.',
    hint: 'le + lo = glielo; vor "ho" apostrophiert.'
  },
  {
    id: 'it.a2b1.e.d22.01',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Penso che tu ___ (avere) l’influenza, non un raffreddore.',
    answer: 'abbia',
    hint: 'avere hat den unregelmäßigen congiuntivo "abbia".'
  },
  {
    id: 'it.a2b1.e.d22.02',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Spero che la febbre ___ (scendere) entro stasera.',
    answer: 'scenda',
    hint: '-ere-Verben bilden den congiuntivo auf -a: scenda.'
  },
  {
    id: 'it.a2b1.e.d22.03',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Bisogna che tu ___ (prendere) l’antibiotico per sei giorni.',
    answer: 'prenda',
    hint: '"bisogna che" verlangt immer den congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d22.04',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mi sembra che il dolore alla schiena ___ (essere) peggiorato.',
    answer: 'sia',
    hint: 'essere hat den unregelmäßigen congiuntivo "sia".'
  },
  {
    id: 'it.a2b1.e.d22.05',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Credo che il medico ___ (fare) le analisi del sangue domani.',
    answer: 'faccia',
    hint: 'fare hat den congiuntivo "faccia".'
  },
  {
    id: 'it.a2b1.e.d22.06',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Penso che è solo un capogiro, niente di grave.',
    answer: 'Penso che sia solo un capogiro, niente di grave.',
    hint: 'Nach "penso che" steht der congiuntivo, nicht der Indikativ.'
  },
  {
    id: 'it.a2b1.e.d22.07',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Spero che io guarisca presto.',
    answer: 'Spero di guarire presto.',
    hint: 'Bei gleichem Subjekt steht "di" plus Infinitiv, nicht "che" plus congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d22.08',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'È possibile che ___ un’allergia al polline.',
    answer: 'sia',
    options: [
      'sia',
      'è',
      'era'
    ],
    hint: '"è possibile che" drückt Unsicherheit aus und verlangt den congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d22.09',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ich glaube, du bist die ersten drei Tage ansteckend.',
    answer: 'Penso che tu sia contagioso i primi tre giorni.',
    hint: 'Zwei verschiedene Subjekte (ich – du): "che" plus congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d22.10',
    patternSlug: 'it-connettivi',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ho la pressione bassa, quindi la mattina mi vengono i capogiri.',
    answer: 'Ich habe niedrigen Blutdruck, deshalb wird mir morgens schwindelig.',
    hint: '"venire" für Beschwerden: "mi viene il capogiro" = mir wird schwindelig.'
  },
  {
    id: 'it.a2b1.r.d22.01',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ avevo la febbre, non sono andato al lavoro.',
    answer: 'Siccome',
    hint: 'Der Grundsatz am Satzanfang verlangt "siccome", nicht "perché".'
  },
  {
    id: 'it.a2b1.r.d22.02',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il medico da ___ vado è in centro.',
    answer: 'cui',
    hint: 'Nach einer Präposition steht "cui".'
  },
  {
    id: 'it.a2b1.r.d22.03',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Non posso parlare, ___ (fare, io) le analisi.',
    answer: 'sto facendo',
    hint: 'stare + gerundio; fare hat den unregelmäßigen gerundio "facendo".'
  },
  {
    id: 'it.a2b1.r.d22.04',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se la febbre non ___ (scendere), chiamerò il medico.',
    answer: 'scenderà',
    hint: 'Nach "se" steht im Italienischen das Futur.'
  },
  {
    id: 'it.a2b1.r.d22.05',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il mal di schiena è più fastidioso ___ mal di testa.',
    answer: 'del',
    hint: 'Vor einem Nomen steht "di", verschmolzen zu "del".'
  },
  {
    id: 'it.a2b1.e.d23.01',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'È necessario che tu ___ (portare) l’impegnativa del medico.',
    answer: 'porti',
    hint: 'Nach "è necessario che" steht der congiuntivo; -are-Verben enden auf -i.'
  },
  {
    id: 'it.a2b1.e.d23.02',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Benché il dolore ___ (essere) forte, non vuole andare al pronto soccorso.',
    answer: 'sia',
    hint: '"benché" erzwingt den congiuntivo; essere → sia.'
  },
  {
    id: 'it.a2b1.e.d23.03',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Ti do il numero affinché tu ___ (potere) chiamare la farmacia di turno.',
    answer: 'possa',
    hint: '"affinché" (damit) verlangt den congiuntivo; potere → possa.'
  },
  {
    id: 'it.a2b1.e.d23.04',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Prima che ___ (arrivare) l’ambulanza, mettilo su un fianco.',
    answer: 'arrivi',
    hint: '"prima che" bei verschiedenen Subjekten plus congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d23.05',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Può darsi che ___ (essere) solo un calo di pressione.',
    answer: 'sia',
    hint: '"può darsi che" drückt Möglichkeit aus und verlangt den congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d23.06',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Nonostante ha il gesso, va al lavoro.',
    answer: 'Nonostante abbia il gesso, va al lavoro.',
    hint: '"nonostante" gehört zu den Konjunktionen, die den congiuntivo erzwingen.'
  },
  {
    id: 'it.a2b1.e.d23.07',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Prima che io esca, controllo la posologia.',
    answer: 'Prima di uscire, controllo la posologia.',
    hint: 'Bei gleichem Subjekt steht "prima di" plus Infinitiv.'
  },
  {
    id: 'it.a2b1.e.d23.08',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Ti accompagno io, a meno che tu non ___ prendere l’auto.',
    answer: 'voglia',
    options: [
      'voglia',
      'vuoi',
      'vorrai'
    ],
    hint: '"a meno che non" verlangt den congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d23.09',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'satz',
    type: 'translate',
    prompt: 'Es ist wichtig, dass du den Beipackzettel liest.',
    answer: 'È importante che tu legga il foglietto illustrativo.',
    hint: '"è importante che" plus congiuntivo; leggere → legga.'
  },
  {
    id: 'it.a2b1.r.d23.01',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Penso che il farmacista ___ (avere) ragione.',
    answer: 'abbia',
    hint: 'Nach "penso che" steht der congiuntivo; avere → abbia.'
  },
  {
    id: 'it.a2b1.r.d23.02',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Spero che io non abbia effetti collaterali.',
    answer: 'Spero di non avere effetti collaterali.',
    hint: 'Bei gleichem Subjekt steht "di" plus Infinitiv statt "che" plus congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d23.03',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Non risponde, ___ (fare, lui) un’ecografia.',
    answer: 'sta facendo',
    hint: 'stare + gerundio; fare → facendo.'
  },
  {
    id: 'it.a2b1.r.d23.04',
    patternSlug: 'it-imperativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (chiamare) il 112 in caso di emergenza.',
    answer: 'Chiami',
    hint: 'Bei -are-Verben endet die Sie-Form auf -i.'
  },
  {
    id: 'it.a2b1.r.d23.05',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La farmacia in ___ vado di solito è chiusa il lunedì.',
    answer: 'cui',
    hint: 'Nach einer Präposition steht "cui", nie "che".'
  },
  {
    id: 'it.a2b1.e.d24.01',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (essere, io) stressato, non ___ (riuscire) a dormire.',
    answer: 'sono / riesco',
    hint: 'Reale Bedingung: beide Satzteile im Präsens.'
  },
  {
    id: 'it.a2b1.e.d24.02',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (avere, io) tempo, ti ___ (chiamare) stasera.',
    answer: 'avrò / chiamerò',
    hint: 'Bei Zukunftsbezug steht in beiden Teilen das Futur.'
  },
  {
    id: 'it.a2b1.e.d24.03',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ti ___ (sentire) in colpa, ___ (parlare) con lui.',
    answer: 'senti / parla',
    hint: 'Präsens im se-Satz, Imperativ im Hauptsatz.'
  },
  {
    id: 'it.a2b1.e.d24.04',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Se avrei più serenità, non mi arrabbierei così.',
    answer: 'Se avessi più serenità, non mi arrabbierei così.',
    hint: 'Nach "se" steht nie das condizionale: entweder Indikativ (real) oder congiuntivo imperfetto (irreal).'
  },
  {
    id: 'it.a2b1.e.d24.05',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Se sia di cattivo umore, lascialo stare.',
    answer: 'Se è di cattivo umore, lascialo stare.',
    hint: 'Im realen Bedingungssatz steht der Indikativ, nicht der congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d24.06',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'choice',
    prompt: 'Se ___ così, ti arrabbi per niente.',
    answer: 'continui',
    options: [
      'continui',
      'continuerai',
      'continueresti'
    ],
    hint: 'Präsens im se-Satz passt zum Präsens im Hauptsatz.'
  },
  {
    id: 'it.a2b1.e.d24.07',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Non ho tempo, quindi non vengo. → Se …',
    answer: 'Se non avrò tempo, non verrò.',
    hint: 'Beide Teile in derselben Zeit – Futur oder Präsens.'
  },
  {
    id: 'it.a2b1.e.d24.08',
    patternSlug: 'it-ipotetico-reale',
    kind: 'satz',
    type: 'translate',
    prompt: 'Wenn du dich schämst, sag es mir.',
    answer: 'Se ti vergogni, dimmelo.',
    hint: 'Präsens plus Imperativ; "dimmelo" verbindet zwei Pronomen am Imperativ.'
  },
  {
    id: 'it.a2b1.e.d24.09',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'satz',
    type: 'translate',
    prompt: 'Non è invidia: ti invidio la calma, ma sono contento per te.',
    answer: 'Das ist kein Neid: Ich beneide dich um deine Ruhe, aber ich freue mich für dich.',
    hint: '"invidiare qualcosa a qualcuno" – die Person steht im Dativ.'
  },
  {
    id: 'it.a2b1.e.d24.11',
    patternSlug: 'it-svo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'ottimo / umorismo / dell’ / senso / un / ha',
    answer: 'Ha un ottimo senso dell’umorismo.',
    hint: 'Verb, unbestimmter Artikel mit Adjektiv, dann die feste Wendung.'
  },
  {
    id: 'it.a2b1.r.d24.01',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Benché ___ (essere) di cattivo umore, viene lo stesso.',
    answer: 'sia',
    hint: '"benché" erzwingt den congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d24.02',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mi sembra che tu ___ (avere) troppa ansia per questo esame.',
    answer: 'abbia',
    hint: 'Nach "mi sembra che" steht der congiuntivo; avere → abbia.'
  },
  {
    id: 'it.a2b1.r.d24.03',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ sia testardo, alla fine ascolta.',
    answer: 'Benché',
    hint: '"benché" und "sebbene" leiten den Einwand ein und verlangen den congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d24.04',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Al posto tuo ___ (parlare, io) con lui prima di arrabbiarmi.',
    answer: 'parlerei',
    hint: 'Rat in der Ich-Form: condizionale.'
  },
  {
    id: 'it.a2b1.r.d24.05',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Non disturbarlo, ___ (scrivere, lui) una lettera difficile.',
    answer: 'sta scrivendo',
    hint: 'stare + gerundio für den laufenden Moment.'
  },
  {
    id: 'it.a2b1.e.d25.01',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'In una discussione ___ (ascoltare) anche chi non è d’accordo.',
    answer: 'si ascolta',
    hint: 'si impersonale: 3. Person Singular.'
  },
  {
    id: 'it.a2b1.e.d25.02',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'In quel quartiere ___ (vendere) molte case.',
    answer: 'si vendono',
    hint: 'Das Objekt steht im Plural, also auch das Verb: si passivante.'
  },
  {
    id: 'it.a2b1.e.d25.03',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Prima di un dibattito ___ (prepararsi).',
    answer: 'ci si prepara',
    hint: 'Bei reflexiven Verben wird das erste si zu "ci": ci si prepara.'
  },
  {
    id: 'it.a2b1.e.d25.04',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Ieri sera ___ (discutere) a lungo.',
    answer: 'si è discusso',
    hint: 'Im si-Satz steht immer essere; ohne Objekt bleibt das Partizip auf -o.'
  },
  {
    id: 'it.a2b1.e.d25.05',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Con questi dati si dimostra molte cose.',
    answer: 'Con questi dati si dimostrano molte cose.',
    hint: 'Das Objekt "molte cose" steht im Plural, also auch das Verb.'
  },
  {
    id: 'it.a2b1.e.d25.06',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'In quel paese si si alza molto presto.',
    answer: 'In quel paese ci si alza molto presto.',
    hint: 'Doppeltes si ist unmöglich: das erste wird zu "ci".'
  },
  {
    id: 'it.a2b1.e.d25.07',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'La gente parla troppo e ascolta poco. → …',
    answer: 'Si parla troppo e si ascolta poco.',
    hint: 'si impersonale ersetzt das unbestimmte Subjekt "la gente".'
  },
  {
    id: 'it.a2b1.e.d25.08',
    patternSlug: 'it-si-impersonale',
    kind: 'satz',
    type: 'translate',
    prompt: 'Ohne Beweise beweist man gar nichts.',
    answer: 'Senza prove non si dimostra niente.',
    hint: '"non" vor dem si-Ausdruck, "niente" dahinter – die doppelte Verneinung bleibt.'
  },
  {
    id: 'it.a2b1.e.d25.09',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ è più veloce, dall’altro costa il doppio.',
    answer: 'Da un lato',
    hint: '"da un lato … dall’altro" bildet ein festes Paar.'
  },
  {
    id: 'it.a2b1.e.d25.10',
    patternSlug: 'it-condizionale',
    kind: 'satz',
    type: 'translate',
    prompt: 'Non voglio fare polemica: vorrei solo un chiarimento.',
    answer: 'Ich will keinen Streit: Ich hätte nur gern eine Klarstellung.',
    hint: '"fare polemica" heißt stänkern, nicht sachlich diskutieren.'
  },
  {
    id: 'it.a2b1.e.d25.11',
    patternSlug: 'it-svo',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'obiezione / sollevato / un’ / ragionevole / ha',
    answer: 'Ha sollevato un’obiezione ragionevole.',
    hint: '"sollevare un’obiezione" ist die feste Wendung, das Adjektiv steht hinten.'
  },
  {
    id: 'it.a2b1.r.d25.01',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (esserci) le prove, cambio idea.',
    answer: 'ci sono',
    hint: 'Reale Bedingung: Präsens plus Präsens, nie condizionale nach "se".'
  },
  {
    id: 'it.a2b1.r.d25.02',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Nessuno nega che il problema ___ (esistere).',
    answer: 'esista',
    hint: '"negare che" verlangt den congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d25.03',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Sostiene che i dati ___ (essere) sbagliati.',
    answer: 'siano',
    hint: 'Nach "sostenere che" steht der congiuntivo, wenn es eine Behauptung ist.'
  },
  {
    id: 'it.a2b1.r.d25.04',
    patternSlug: 'it-connettivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ i dati siano vecchi, la tendenza è chiara.',
    answer: 'Benché',
    hint: '"benché" leitet den Einwand ein und verlangt den congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d25.05',
    patternSlug: 'it-comparativo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Questo argomento è più convincente ___ precedente.',
    answer: 'del',
    hint: 'Vor einem Nomen steht "di", verschmolzen zu "del".'
  },
  {
    id: 'it.a2b1.e.d26.01',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Quando sono arrivato in banca, ___ (chiudere, loro) già.',
    answer: 'avevano chiuso',
    hint: 'Das frühere Ereignis steht im trapassato: imperfetto von avere plus Partizip.'
  },
  {
    id: 'it.a2b1.e.d26.02',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Non ho firmato, perché non ___ (leggere, io) tutte le clausole.',
    answer: 'avevo letto',
    hint: 'Das Nicht-Gelesen-Haben liegt vor dem Nicht-Unterschreiben.'
  },
  {
    id: 'it.a2b1.e.d26.03',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mi hanno rimborsato la rata che ___ (pagare, io) due volte.',
    answer: 'avevo pagato',
    hint: 'Die Doppelzahlung liegt vor der Erstattung.'
  },
  {
    id: 'it.a2b1.e.d26.04',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Lei ___ (andare) già dal notaio quando l’ho chiamata.',
    answer: 'era già andata',
    hint: 'andare nimmt essere: Partizip an das weibliche Subjekt angeglichen.'
  },
  {
    id: 'it.a2b1.e.d26.05',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Noi ___ (indebitarsi) troppo, così abbiamo venduto la macchina.',
    answer: 'ci eravamo indebitati',
    hint: 'Reflexiv: essere im imperfetto plus angeglichenes Partizip.'
  },
  {
    id: 'it.a2b1.e.d26.06',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Quando sono arrivato allo sportello, hanno già staccato il numero.',
    answer: 'Quando sono arrivato allo sportello, avevano già staccato il numero.',
    hint: 'Das frühere Ereignis braucht das trapassato, sonst geht die Reihenfolge verloren.'
  },
  {
    id: 'it.a2b1.e.d26.07',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mia sorella era già uscito dalla banca quando sono arrivato.',
    answer: 'Mia sorella era già uscita dalla banca quando sono arrivato.',
    hint: 'Bei "essere" gleicht sich das Partizip an das Subjekt an: uscita.'
  },
  {
    id: 'it.a2b1.e.d26.08',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho perso il lavoro. + Poi ho chiesto un prestito.',
    answer: 'Ho chiesto un prestito perché avevo perso il lavoro.',
    hint: 'Der Jobverlust liegt vor dem Kreditantrag: trapassato.'
  },
  {
    id: 'it.a2b1.e.d26.09',
    patternSlug: 'it-si-impersonale',
    kind: 'satz',
    type: 'translate',
    prompt: 'Man kann innerhalb von vierzehn Tagen zurücktreten.',
    answer: 'Si può recedere entro quattordici giorni.',
    hint: 'si impersonale plus Modalverb; "recedere" steht mit "da", hier ohne Objekt.'
  },
  {
    id: 'it.a2b1.e.d26.10',
    patternSlug: 'it-relative-che',
    kind: 'satz',
    type: 'translate',
    prompt: 'Sull’estratto conto c’è un addebito che non riconosco.',
    answer: 'Auf dem Kontoauszug ist eine Belastung, die ich nicht kenne.',
    hint: '"addebito" ist die Abbuchung, "accredito" die Gutschrift.'
  },
  {
    id: 'it.a2b1.r.d26.01',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'In quella banca ___ (pagare) troppe commissioni.',
    answer: 'si pagano',
    hint: 'Das Objekt steht im Plural, also auch das Verb.'
  },
  {
    id: 'it.a2b1.r.d26.02',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (firmare, tu) oggi, il tasso resta questo.',
    answer: 'firmi',
    hint: 'Reale Bedingung: Präsens plus Präsens.'
  },
  {
    id: 'it.a2b1.r.d26.03',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'È necessario che tu ___ (portare) il codice fiscale.',
    answer: 'porti',
    hint: 'Nach "è necessario che" steht der congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d26.04',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Penso che il tasso fisso ___ (essere) più sicuro.',
    answer: 'sia',
    hint: 'Nach "penso che" steht der congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d26.05',
    patternSlug: 'it-relative-che',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La banca con ___ lavoriamo è a due passi.',
    answer: 'cui',
    hint: 'Nach einer Präposition steht "cui".'
  },
  {
    id: 'it.a2b1.e.d27.01',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'L’ufficio ha respinto la domanda. → La domanda ___ dall’ufficio.',
    answer: 'è stata respinta',
    hint: 'Das Partizip richtet sich nach "la domanda": respinta.'
  },
  {
    id: 'it.a2b1.e.d27.02',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il certificato ___ (rilasciare) in tre giorni.',
    answer: 'viene rilasciato',
    hint: '"venire" plus Partizip betont den Vorgang; nur in einfachen Zeiten möglich.'
  },
  {
    id: 'it.a2b1.e.d27.03',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le pratiche ___ (protocollare) lo stesso giorno.',
    answer: 'vengono protocollate',
    hint: 'Plural: vengono, Partizip weiblich Plural: protocollate.'
  },
  {
    id: 'it.a2b1.e.d27.04',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il modulo ___ (firmare) in originale.',
    answer: 'va firmato',
    hint: '"andare" plus Partizip heißt "muss … werden".'
  },
  {
    id: 'it.a2b1.e.d27.05',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La marca da bollo ___ (applicare) sulla prima pagina.',
    answer: 'va applicata',
    hint: 'Das Partizip gleicht sich an "la marca da bollo" an: applicata.'
  },
  {
    id: 'it.a2b1.e.d27.06',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'La domanda è venuta respinta la settimana scorsa.',
    answer: 'La domanda è stata respinta la settimana scorsa.',
    hint: '"venire" bildet kein Passiv in zusammengesetzten Zeiten – dort nur "essere".'
  },
  {
    id: 'it.a2b1.e.d27.07',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Le credenziali sono state inviato di un funzionario.',
    answer: 'Le credenziali sono state inviate da un funzionario.',
    hint: 'Zwei Fehler: Angleichung "inviate" und Urheber mit "da", nicht "di".'
  },
  {
    id: 'it.a2b1.e.d27.08',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Il comune rilascia il certificato di residenza. → …',
    answer: 'Il certificato di residenza viene rilasciato dal comune.',
    hint: 'Vorgangspassiv mit "venire"; der Urheber steht mit "da".'
  },
  {
    id: 'it.a2b1.e.d27.09',
    patternSlug: 'it-passivo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Die Kündigung muss per zertifizierter E-Mail geschickt werden.',
    answer: 'La disdetta va mandata via PEC.',
    hint: '"andare" plus Partizip ist die kürzere Standardform der Verwaltung.'
  },
  {
    id: 'it.a2b1.e.d27.10',
    patternSlug: 'it-passivo',
    kind: 'satz',
    type: 'translate',
    prompt: 'Senza denuncia non viene rilasciato nessun duplicato.',
    answer: 'Ohne Anzeige wird keine Zweitschrift ausgestellt.',
    hint: 'Vorgangspassiv mit "venire" plus doppelte Verneinung.'
  },
  {
    id: 'it.a2b1.r.d27.01',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Quando sono arrivato all’anagrafe, ___ (chiudere, loro) già lo sportello.',
    answer: 'avevano già chiuso',
    hint: 'Das frühere Ereignis steht im trapassato.'
  },
  {
    id: 'it.a2b1.r.d27.02',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'In quel comune ___ (rilasciare) i certificati in giornata.',
    answer: 'si rilasciano',
    hint: 'Pluralobjekt: das Verb steht im Plural.'
  },
  {
    id: 'it.a2b1.r.d27.03',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (avere, tu) lo SPID, puoi fare tutto online.',
    answer: 'hai',
    hint: 'Reale Bedingung: Präsens plus Präsens.'
  },
  {
    id: 'it.a2b1.r.d27.04',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'È obbligatorio che la domanda ___ (essere) firmata in originale.',
    answer: 'sia',
    hint: 'Nach "è obbligatorio che" steht der congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d27.05',
    patternSlug: 'it-stare-gerundio',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Aspetta un attimo, ___ (compilare, io) il modulo.',
    answer: 'sto compilando',
    hint: 'stare + gerundio für den laufenden Moment.'
  },
  {
    id: 'it.a2b1.e.d28.01',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: '“Voto domani.” → Ha detto che ___ .',
    answer: 'avrebbe votato il giorno dopo',
    hint: 'Futur wird nach Vergangenheit zum condizionale composto; "domani" wird "il giorno dopo".'
  },
  {
    id: 'it.a2b1.e.d28.02',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: '“Il provvedimento è già in vigore.” → Ha dichiarato che ___ .',
    answer: 'il provvedimento era già in vigore',
    hint: 'Präsens wird zum imperfetto.'
  },
  {
    id: 'it.a2b1.e.d28.03',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: '“Abbiamo smentito la notizia.” → Hanno detto che ___ .',
    answer: 'avevano smentito la notizia',
    hint: 'Passato prossimo wird zum trapassato prossimo.'
  },
  {
    id: 'it.a2b1.e.d28.04',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: '“Riciclate di più!” → Ci ha chiesto ___ .',
    answer: 'di riciclare di più',
    hint: 'Ein Imperativ wird zu "di" plus Infinitiv.'
  },
  {
    id: 'it.a2b1.e.d28.05',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: '“Vieni alla manifestazione?” → Mi ha chiesto ___ .',
    answer: 'se andavo alla manifestazione',
    hint: 'Entscheidungsfragen werden mit "se" angeschlossen, das Präsens wird imperfetto.'
  },
  {
    id: 'it.a2b1.e.d28.06',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Il sindaco ha detto che verrà alla riunione.',
    answer: 'Il sindaco ha detto che sarebbe venuto alla riunione.',
    hint: 'Nach einem Einleitungsverb in der Vergangenheit steht das condizionale composto, nicht das Futur.'
  },
  {
    id: 'it.a2b1.e.d28.07',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mi ha chiesto che votavo per quel partito.',
    answer: 'Mi ha chiesto se votavo per quel partito.',
    hint: 'Ja-Nein-Fragen werden mit "se" angeschlossen, nicht mit "che".'
  },
  {
    id: 'it.a2b1.e.d28.08',
    patternSlug: 'it-discorso-indiretto',
    kind: 'satz',
    type: 'translate',
    prompt: 'Der Sprecher hat erklärt, dass die Maßnahme am Vortag unterzeichnet worden war.',
    answer: 'Il portavoce ha dichiarato che il provvedimento era stato firmato il giorno prima.',
    hint: 'Passiv im trapassato: "era stato firmato"; "ieri" wird zu "il giorno prima".'
  },
  {
    id: 'it.a2b1.e.d28.11',
    patternSlug: 'it-passato-avere',
    kind: 'konstruktion',
    type: 'order',
    prompt: 'firme / cittadini / ventimila / i / raccolto / hanno',
    answer: 'I cittadini hanno raccolto ventimila firme.',
    hint: 'Subjekt, Hilfsverb, Partizip, Objekt mit Zahl.'
  },
  {
    id: 'it.a2b1.r.d28.01',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Penso che la riforma ___ (essere) necessaria.',
    answer: 'sia',
    hint: 'Nach "penso che" steht der congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d28.02',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Benché il decreto ___ (essere) in vigore, nessuno lo applica.',
    answer: 'sia',
    hint: '"benché" erzwingt den congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d28.03',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Prima che io esca, controllo le notizie.',
    answer: 'Prima di uscire, controllo le notizie.',
    hint: 'Bei gleichem Subjekt steht "prima di" plus Infinitiv.'
  },
  {
    id: 'it.a2b1.r.d28.04',
    patternSlug: 'it-ipotetico-reale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (esserci) più rinnovabili, l’energia costerà meno.',
    answer: 'ci saranno',
    hint: 'Bei Zukunftsbezug steht auch nach "se" das Futur.'
  },
  {
    id: 'it.a2b1.r.d28.05',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'In quel comune ___ (riciclare) tutti i rifiuti organici.',
    answer: 'si riciclano',
    hint: 'Pluralobjekt: das Verb steht im Plural.'
  },
  {
    id: 'it.a2b1.r.d28.06',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'In quella città si si muove solo in bici.',
    answer: 'In quella città ci si muove solo in bici.',
    hint: 'Bei reflexiven Verben wird das erste si zu "ci".'
  },
  {
    id: 'it.a2b1.r.d28.07',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La smentita è arrivata dopo che il giornale ___ (pubblicare) l’inchiesta.',
    answer: 'aveva pubblicato',
    hint: 'Das frühere Ereignis steht im trapassato.'
  },
  {
    id: 'it.a2b1.r.d28.08',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il comunicato ___ (diffondere) alle sette.',
    answer: 'viene diffuso',
    hint: '"venire" plus Partizip in einer einfachen Zeit; Partizip von diffondere ist "diffuso".'
  },
  {
    id: 'it.a2b1.r.d28.09',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'La domanda ___ (presentare) entro giugno.',
    answer: 'va presentata',
    hint: '"andare" plus Partizip heißt "muss … werden"; Angleichung an "la domanda".'
  },
  {
    id: 'it.a2b1.r.d28.10',
    patternSlug: 'it-trapassato',
    kind: 'satz',
    type: 'translate',
    prompt: 'Als ich angekommen bin, hatten sie die Versammlung schon beendet.',
    answer: 'Quando sono arrivato, avevano già finito la riunione.',
    hint: 'Das frühere Ereignis im trapassato, das spätere im passato prossimo.'
  },
  {
    id: 'it.a2b1.e.d29.01',
    patternSlug: 'it-verbi-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Ho cominciato ___ studiare italiano due anni fa.',
    answer: 'a',
    hint: '"cominciare" verlangt vor dem Infinitiv immer "a".'
  },
  {
    id: 'it.a2b1.e.d29.02',
    patternSlug: 'it-verbi-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Non riesco ___ capire questa clausola.',
    answer: 'a',
    hint: '"riuscire a" gehört zur a-Gruppe.'
  },
  {
    id: 'it.a2b1.e.d29.03',
    patternSlug: 'it-verbi-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Ha smesso ___ fumare a gennaio.',
    answer: 'di',
    hint: '"smettere di" gehört zur di-Gruppe – Verben des Aufhörens.'
  },
  {
    id: 'it.a2b1.e.d29.04',
    patternSlug: 'it-verbi-preposizioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Preferisco ___ tornare a piedi.',
    answer: '—',
    hint: 'Nach preferire, potere, volere, dovere und sapere steht der Infinitiv ohne Präposition.'
  },
  {
    id: 'it.a2b1.e.d29.05',
    patternSlug: 'it-verbi-preposizioni',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Cerco a capire il foglietto illustrativo.',
    answer: 'Cerco di capire il foglietto illustrativo.',
    hint: '"cercare" verlangt "di", nicht "a".'
  },
  {
    id: 'it.a2b1.e.d29.06',
    patternSlug: 'it-verbi-preposizioni',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Devo di firmare il contratto entro venerdì.',
    answer: 'Devo firmare il contratto entro venerdì.',
    hint: 'Modalverben stehen ohne Präposition vor dem Infinitiv.'
  },
  {
    id: 'it.a2b1.e.d29.07',
    patternSlug: 'it-avverbi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'lento → …',
    answer: 'lentamente',
    hint: 'Weibliche Form plus -mente: lenta + mente.'
  },
  {
    id: 'it.a2b1.e.d29.08',
    patternSlug: 'it-avverbi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'facile → …',
    answer: 'facilmente',
    hint: 'Bei -le fällt das e weg: facile → facil + mente.'
  },
  {
    id: 'it.a2b1.e.d29.09',
    patternSlug: 'it-avverbi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Mio fratello cucina buono ma canta male.',
    answer: 'Mio fratello cucina bene ma canta male.',
    hint: 'Nach einem Verb steht das Adverb "bene", nicht das Adjektiv "buono".'
  },
  {
    id: 'it.a2b1.e.d29.10',
    patternSlug: 'it-avverbi',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Da quando fa sport dorme più bene.',
    answer: 'Da quando fa sport dorme meglio.',
    hint: '"più bene" gibt es nicht: der Komparativ von bene ist "meglio".'
  },
  {
    id: 'it.a2b1.r.d29.01',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Loro non ___ (capire) il dialetto dei nonni.',
    answer: 'capiscono',
    hint: '-isc-Verb in der 3. Person Plural.'
  },
  {
    id: 'it.a2b1.r.d29.04',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho ancora qualcosa da dire.',
    answer: 'Non ho più niente da dire.',
    hint: '"non … più niente" bleibt eine einzige Verneinung.'
  },
  {
    id: 'it.a2b1.r.d29.05',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'A Sara ___ ho spiegato tutto ieri.',
    answer: 'le',
    hint: 'Eine Frau als indirektes Objekt: le, nicht gli.'
  },
  {
    id: 'it.a2b1.r.d29.06',
    patternSlug: 'it-passato-essere',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le ragazze ___ (uscire) presto.',
    answer: 'sono uscite',
    hint: 'Bewegungsverb mit essere, weiblicher Plural: uscite.'
  },
  {
    id: 'it.a2b1.r.d29.07',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre ___ (leggere, io), è saltata la luce.',
    answer: 'leggevo',
    hint: 'Nach "mentre" der Hintergrund im imperfetto.'
  },
  {
    id: 'it.a2b1.r.d29.08',
    patternSlug: 'it-pronomi-combinati',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il documento? ___ ho mandato ieri. (a lui + il documento)',
    answer: 'Gliel’',
    hint: 'gli + lo = glielo, vor "ho" apostrophiert.'
  },
  {
    id: 'it.a2b1.r.d29.09',
    patternSlug: 'it-futuro',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Se ___ (potere, noi), verremo anche noi.',
    answer: 'potremo',
    hint: 'Nach "se" das Futur; potere hat den Stamm potr-.'
  },
  {
    id: 'it.a2b1.r.d29.10',
    patternSlug: 'it-congiuntivo-presente',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Credo che ___ (essere) la soluzione più adeguata.',
    answer: 'sia',
    hint: 'Nach "credo che" steht der congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d29.11',
    patternSlug: 'it-trapassato',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Quando ho chiamato, ___ (uscire, lei) già.',
    answer: 'era già uscita',
    hint: 'Das frühere Ereignis im trapassato, Partizip an das weibliche Subjekt angeglichen.'
  },
  {
    id: 'it.a2b1.r.d29.12',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: '“Arrivo domani.” → Ha detto che ___ .',
    answer: 'sarebbe arrivato il giorno dopo',
    hint: 'Futur wird zum condizionale composto, "domani" zu "il giorno dopo".'
  },
  {
    id: 'it.a2b1.e.d30.01',
    patternSlug: 'it-connettivi-b1',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Ti presto la macchina a patto che tu ___ (fare) benzina.',
    answer: 'faccia',
    hint: '"a patto che" verlangt den congiuntivo; fare → faccia.'
  },
  {
    id: 'it.a2b1.e.d30.02',
    patternSlug: 'it-connettivi-b1',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Nel caso in cui ___ (piovere), ci vediamo al bar.',
    answer: 'piova',
    hint: '"nel caso in cui" verlangt ebenfalls den congiuntivo.'
  },
  {
    id: 'it.a2b1.e.d30.03',
    patternSlug: 'it-connettivi-b1',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Non è caro, ___ è il più economico dei tre.',
    answer: 'anzi',
    hint: '"anzi" korrigiert und steigert; "infatti" würde nur bestätigen.'
  },
  {
    id: 'it.a2b1.e.d30.04',
    patternSlug: 'it-connettivi-b1',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il termine è scaduto, ___ la domanda è stata respinta.',
    answer: 'pertanto',
    hint: '"pertanto" leitet die Folge auf gehobenem Register ein.'
  },
  {
    id: 'it.a2b1.e.d30.05',
    patternSlug: 'it-connettivi-b1',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ti aiuto a patto che mi dici la verità.',
    answer: 'Ti aiuto a patto che tu mi dica la verità.',
    hint: '"a patto che" verlangt den congiuntivo: dica.'
  },
  {
    id: 'it.a2b1.e.d30.06',
    patternSlug: 'it-aspetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Il corso ___ (finire) fra due minuti: preparate le cose.',
    answer: 'sta per finire',
    hint: '"stare per" plus Infinitiv für das unmittelbar Bevorstehende.'
  },
  {
    id: 'it.a2b1.e.d30.07',
    patternSlug: 'it-aspetto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho studiato italiano da due anni.',
    answer: 'Studio italiano da due anni.',
    hint: 'Eine noch andauernde Handlung steht mit "da" im Präsens, nicht in der Vergangenheit.'
  },
  {
    id: 'it.a2b1.e.d30.08',
    patternSlug: 'it-aspetto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Sto lavorando in questa ditta da dieci anni.',
    answer: 'Lavoro in questa ditta da dieci anni.',
    hint: 'Die Verlaufsform beschreibt nur den Moment, nicht eine zehnjährige Dauer.'
  },
  {
    id: 'it.a2b1.e.d30.09',
    patternSlug: 'it-aspetto',
    kind: 'satz',
    type: 'translate',
    prompt: 'Es lohnt sich, den ganzen Vertrag zu lesen.',
    answer: 'Vale la pena leggere tutto il contratto.',
    hint: '"valere la pena" ist unpersönlich und steht mit dem Infinitiv.'
  },
  {
    id: 'it.a2b1.r.d30.01',
    patternSlug: 'it-presente-irregolare',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Voi ___ (preferire) il primo o il secondo appello?',
    answer: 'preferite',
    hint: '2. Person Plural der -isc-Verben ohne Einschub.'
  },
  {
    id: 'it.a2b1.r.d30.02',
    patternSlug: 'it-preposizioni-articolate',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Le chiavi sono ___ borsa. (in + la)',
    answer: 'nella',
    hint: 'in + la = nella.'
  },
  {
    id: 'it.a2b1.r.d30.03',
    patternSlug: 'it-plurale-irregolare',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'l’uovo → …',
    answer: 'le uova',
    hint: 'Unregelmäßig: im Plural weiblich auf -a.'
  },
  {
    id: 'it.a2b1.r.d30.04',
    patternSlug: 'it-doppia-negazione',
    kind: 'konstruktion',
    type: 'transform',
    prompt: 'Ho visto qualcuno in ufficio.',
    answer: 'Non ho visto nessuno in ufficio.',
    hint: '"non" vor dem Verb, "nessuno" dahinter – zusammen eine Verneinung.'
  },
  {
    id: 'it.a2b1.r.d30.05',
    patternSlug: 'it-pronomi-indiretti',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Alla dottoressa ___ ho già mandato la mail.',
    answer: 'le',
    hint: 'Indirektes Objekt, weiblich: le.'
  },
  {
    id: 'it.a2b1.r.d30.06',
    patternSlug: 'it-riflessivi',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Loro ___ (fermarsi) al casello.',
    answer: 'si sono fermati',
    hint: 'Reflexiv mit essere und angeglichenem Partizip.'
  },
  {
    id: 'it.a2b1.r.d30.07',
    patternSlug: 'it-passato-vs-imperfetto',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Mentre ___ (aspettare, noi), ___ (arrivare) la notizia.',
    answer: 'aspettavamo / è arrivata',
    hint: 'Hintergrund im imperfetto, Ereignis im passato prossimo mit essere.'
  },
  {
    id: 'it.a2b1.r.d30.08',
    patternSlug: 'it-condizionale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: '___ (potere, Lei) ripetere più lentamente?',
    answer: 'Potrebbe',
    hint: 'Höfliche Bitte: condizionale von potere.'
  },
  {
    id: 'it.a2b1.r.d30.09',
    patternSlug: 'it-congiuntivo-espressioni',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'Benché ___ (essere) tardi, provo a chiamare.',
    answer: 'sia',
    hint: '"benché" erzwingt den congiuntivo.'
  },
  {
    id: 'it.a2b1.r.d30.10',
    patternSlug: 'it-si-impersonale',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'In quel paese ___ (produrre) ottimi formaggi.',
    answer: 'si producono',
    hint: 'Pluralobjekt: das Verb steht im Plural.'
  },
  {
    id: 'it.a2b1.r.d30.11',
    patternSlug: 'it-passivo',
    kind: 'konstruktion',
    type: 'cloze',
    prompt: 'I moduli ___ (consegnare) entro venerdì.',
    answer: 'vanno consegnati',
    hint: '"andare" plus Partizip, angeglichen an "i moduli".'
  },
  {
    id: 'it.a2b1.r.d30.12',
    patternSlug: 'it-discorso-indiretto',
    kind: 'konstruktion',
    type: 'transform',
    prompt: '“Ho già firmato.” → Ha detto che ___ .',
    answer: 'aveva già firmato',
    hint: 'Passato prossimo wird nach Vergangenheit zum trapassato.'
  }
];
