/**
 * Startpakete. Sie decken die ersten Tage ab; darüber hinaus erweitert der
 * Wortschatz-Generator (LLM) das Deck Frequenzband für Frequenzband.
 *
 * Kompaktformat je Wort: [Wort, Übersetzung, Wortart, Beispielsatz, Übersetzung]
 */

import type { CefrLevel } from '../types';
import { ITALIAN_1000, expandPos } from './italian1000';

export type SeedWord = [string, string, string, string, string];

/** Die 1000 Kernvokabeln mit ausgeschriebenen Wortarten. */
const ITALIAN_WORDS: SeedWord[] = ITALIAN_1000.map(
  ([term, translation, pos, example, exampleTranslation]) =>
    [term, translation, expandPos(pos), example, exampleTranslation] as SeedWord,
);

export interface SeedPattern {
  /** Stabiler Bezeichner, auf den der Übungskatalog im Repo verweist. */
  slug?: string;
  title: string;
  formula: string;
  explanation: string;
  examples: [string, string][];
  week: 1 | 2 | 3 | 4;
  /** Referenzniveau. Fehlt es, gilt A1. */
  level?: CefrLevel;
}

export interface SeedLanguage {
  name: string;
  nativeName: string;
  code: string;
  emoji: string;
  words: SeedWord[];
  patterns: SeedPattern[];
}

const spanish: SeedLanguage = {
  name: 'Spanisch',
  nativeName: 'Español',
  code: 'es-ES',
  emoji: '🇪🇸',
  words: [
    ['ser', 'sein (dauerhaft)', 'Verb', 'Soy de Alemania.', 'Ich bin aus Deutschland.'],
    ['estar', 'sein (Zustand/Ort)', 'Verb', '¿Dónde estás ahora?', 'Wo bist du gerade?'],
    ['tener', 'haben', 'Verb', 'Tengo una pregunta.', 'Ich habe eine Frage.'],
    ['hacer', 'machen, tun', 'Verb', '¿Qué haces hoy?', 'Was machst du heute?'],
    ['ir', 'gehen, fahren', 'Verb', 'Voy al trabajo.', 'Ich gehe zur Arbeit.'],
    ['poder', 'können', 'Verb', '¿Puedo pagar con tarjeta?', 'Kann ich mit Karte zahlen?'],
    ['querer', 'wollen, mögen', 'Verb', 'Quiero un café, por favor.', 'Ich möchte einen Kaffee, bitte.'],
    ['saber', 'wissen, können', 'Verb', 'No sé dónde está.', 'Ich weiß nicht, wo es ist.'],
    ['decir', 'sagen', 'Verb', '¿Cómo se dice esto?', 'Wie sagt man das?'],
    ['necesitar', 'brauchen', 'Verb', 'Necesito ayuda.', 'Ich brauche Hilfe.'],
    ['hay', 'es gibt', 'Phrase', '¿Hay un baño aquí?', 'Gibt es hier eine Toilette?'],
    ['yo', 'ich', 'Pronomen', 'Yo trabajo aquí.', 'Ich arbeite hier.'],
    ['tú', 'du', 'Pronomen', '¿Tú hablas alemán?', 'Sprichst du Deutsch?'],
    ['nosotros', 'wir', 'Pronomen', 'Nosotros vamos juntos.', 'Wir gehen zusammen.'],
    ['qué', 'was', 'Fragewort', '¿Qué es esto?', 'Was ist das?'],
    ['quién', 'wer', 'Fragewort', '¿Quién es él?', 'Wer ist er?'],
    ['dónde', 'wo', 'Fragewort', '¿Dónde está la estación?', 'Wo ist der Bahnhof?'],
    ['cuándo', 'wann', 'Fragewort', '¿Cuándo empieza?', 'Wann fängt es an?'],
    ['cómo', 'wie', 'Fragewort', '¿Cómo estás?', 'Wie geht es dir?'],
    ['por qué', 'warum', 'Fragewort', '¿Por qué no vienes?', 'Warum kommst du nicht?'],
    ['cuánto', 'wie viel', 'Fragewort', '¿Cuánto cuesta?', 'Wie viel kostet das?'],
    ['no', 'nicht, nein', 'Negation', 'No entiendo.', 'Ich verstehe nicht.'],
    ['nunca', 'nie', 'Adverb', 'Nunca he estado allí.', 'Ich war noch nie dort.'],
    ['nada', 'nichts', 'Pronomen', 'No quiero nada más.', 'Ich möchte nichts mehr.'],
    ['y', 'und', 'Konjunktion', 'Pan y agua.', 'Brot und Wasser.'],
    ['pero', 'aber', 'Konjunktion', 'Quiero ir, pero no puedo.', 'Ich will gehen, aber ich kann nicht.'],
    ['porque', 'weil', 'Konjunktion', 'No voy porque estoy cansado.', 'Ich gehe nicht, weil ich müde bin.'],
    ['también', 'auch', 'Adverb', 'Yo también quiero.', 'Ich möchte auch.'],
    ['en', 'in, auf', 'Präposition', 'Estoy en casa.', 'Ich bin zu Hause.'],
    ['de', 'von, aus', 'Präposition', 'Soy de Berlín.', 'Ich bin aus Berlin.'],
    ['con', 'mit', 'Präposition', 'Voy con un amigo.', 'Ich gehe mit einem Freund.'],
    ['para', 'für, um zu', 'Präposition', 'Es para mí.', 'Das ist für mich.'],
    ['hasta', 'bis', 'Präposition', 'Hasta mañana.', 'Bis morgen.'],
    ['ahora', 'jetzt', 'Adverb', 'Ahora no puedo.', 'Jetzt kann ich nicht.'],
    ['hoy', 'heute', 'Adverb', 'Hoy trabajo mucho.', 'Heute arbeite ich viel.'],
    ['mañana', 'morgen', 'Adverb', 'Mañana tengo tiempo.', 'Morgen habe ich Zeit.'],
    ['siempre', 'immer', 'Adverb', 'Siempre llego tarde.', 'Ich komme immer zu spät.'],
    ['muy', 'sehr', 'Adverb', 'Está muy bien.', 'Das ist sehr gut.'],
    ['mucho', 'viel', 'Adverb', 'Gracias, muchas gracias.', 'Danke, vielen Dank.'],
    ['bien', 'gut', 'Adverb', 'Todo está bien.', 'Alles ist gut.'],
    ['el tiempo', 'die Zeit, das Wetter', 'Nomen', 'No tengo tiempo.', 'Ich habe keine Zeit.'],
    ['la casa', 'das Haus', 'Nomen', 'La casa es grande.', 'Das Haus ist groß.'],
    ['el agua', 'das Wasser', 'Nomen', 'Un vaso de agua, por favor.', 'Ein Glas Wasser, bitte.'],
    ['la gente', 'die Leute', 'Nomen', 'Hay mucha gente aquí.', 'Hier sind viele Leute.'],
    ['por favor', 'bitte', 'Phrase', 'La cuenta, por favor.', 'Die Rechnung, bitte.'],
    ['gracias', 'danke', 'Phrase', 'Muchas gracias por todo.', 'Vielen Dank für alles.'],
    ['perdón', 'Entschuldigung', 'Phrase', 'Perdón, ¿puede repetir?', 'Entschuldigung, können Sie wiederholen?'],
    ['me gustaría', 'ich hätte gern', 'Phrase', 'Me gustaría reservar una mesa.', 'Ich hätte gern einen Tisch reserviert.'],
  ],
  patterns: [
    {
      slug: 'es-svo',
      title: 'Aussagesatz: Subjekt + Verb + Objekt',
      formula: '(Subjekt) + Verb + Objekt',
      explanation:
        'Das Subjektpronomen wird meist weggelassen, weil die Verbendung es schon zeigt. Es steht nur zur Betonung.',
      examples: [
        ['Tengo una pregunta.', 'Ich habe eine Frage.'],
        ['Ana come pan.', 'Ana isst Brot.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'es-negacion-no',
      title: 'Verneinung mit "no"',
      formula: '(Subjekt) + no + Verb',
      explanation: '"no" steht direkt vor dem konjugierten Verb. Eine doppelte Verneinung ist korrekt: "No tengo nada."',
      examples: [
        ['No entiendo.', 'Ich verstehe nicht.'],
        ['No tengo nada.', 'Ich habe nichts.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'es-pregunta',
      title: 'Entscheidungsfrage',
      formula: '¿ + Verb + Subjekt + ... ?',
      explanation:
        'Ohne Fragewort reicht die Intonation; die Wortstellung kann gleich bleiben. Das umgedrehte ¿ steht immer am Anfang.',
      examples: [
        ['¿Hablas alemán?', 'Sprichst du Deutsch?'],
        ['¿Tienes tiempo?', 'Hast du Zeit?'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'es-ser-estar',
      title: 'ser vs. estar',
      formula: 'ser = Identität/Eigenschaft · estar = Zustand/Ort',
      explanation:
        '"ser" für das, was dauerhaft ist (Herkunft, Beruf, Charakter). "estar" für Ort und momentane Zustände.',
      examples: [
        ['Soy médico.', 'Ich bin Arzt.'],
        ['Estoy cansado.', 'Ich bin müde.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'es-podria',
      title: 'Höfliche Bitte: "me gustaría" / "¿podría…?"',
      formula: 'me gustaría + Infinitiv · ¿podría + Infinitiv?',
      explanation: 'Der Standardbaustein für höfliche Wünsche im Alltag – Restaurant, Hotel, Behörde.',
      examples: [
        ['Me gustaría pagar.', 'Ich würde gern zahlen.'],
        ['¿Podría ayudarme?', 'Könnten Sie mir helfen?'],
      ],
      week: 2,
      level: 'A1',
    },
  ],
};

const italian: SeedLanguage = {
  name: 'Italienisch',
  nativeName: 'Italiano',
  code: 'it-IT',
  emoji: '🇮🇹',
  words: ITALIAN_WORDS,
  patterns: [
    {
      slug: 'it-svo',
      title: 'Aussagesatz: Subjekt + Verb + Objekt',
      formula: '(Subjekt) + Verb + Objekt',
      explanation: 'Das Subjektpronomen entfällt meist, die Verbendung trägt die Information.',
      examples: [
        ['Ho una domanda.', 'Ich habe eine Frage.'],
        ['Anna mangia il pane.', 'Anna isst das Brot.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'it-articoli',
      title: 'Bestimmter und unbestimmter Artikel',
      formula: 'il · lo · la — un · uno · una',
      explanation:
        'Der Artikel richtet sich nach Geschlecht und Anlaut: "il" vor Konsonant, "lo" vor s+Konsonant, z, gn, ps, "l’" vor Vokal. Weiblich immer "la", vor Vokal "l’".',
      examples: [
        ['il treno, lo studente, l’amico', 'der Zug, der Student, der Freund'],
        ['un caffè, uno sbaglio, una domanda', 'ein Kaffee, ein Fehler, eine Frage'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'it-plurale',
      title: 'Plural der Nomen',
      formula: '-o → -i · -a → -e · -e → -i',
      explanation:
        'Männliche Nomen auf -o enden im Plural auf -i, weibliche auf -a auf -e. Nomen auf -e bilden beide Geschlechter den Plural auf -i. Der Artikel wandert mit: il → i, lo → gli, la → le.',
      examples: [
        ['il treno → i treni', 'der Zug → die Züge'],
        ['la casa → le case', 'das Haus → die Häuser'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'it-essere-avere',
      title: 'essere und avere',
      formula: 'sono, sei, è, siamo, siete, sono · ho, hai, ha, abbiamo, avete, hanno',
      explanation:
        'Die zwei wichtigsten Verben. "essere" für Identität, Herkunft und Zustand, "avere" für Besitz — und für Alter, Hunger und Durst: "Ho fame", nicht "Sono fame".',
      examples: [
        ['Sono di Berlino e sono in vacanza.', 'Ich bin aus Berlin und im Urlaub.'],
        ['Ho venticinque anni e ho fame.', 'Ich bin fünfundzwanzig und habe Hunger.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'it-negazione-non',
      title: 'Verneinung mit "non"',
      formula: '(Subjekt) + non + Verb',
      explanation: '"non" steht direkt vor dem Verb. Doppelte Verneinung ist korrekt: "Non ho niente."',
      examples: [
        ['Non capisco.', 'Ich verstehe nicht.'],
        ['Non ho niente.', 'Ich habe nichts.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'it-domanda-intonazione',
      title: 'Frage durch Intonation',
      formula: 'Verb + ... ?',
      explanation: 'Die Wortstellung bleibt gleich, nur die Stimme geht am Satzende nach oben.',
      examples: [
        ['Parli tedesco?', 'Sprichst du Deutsch?'],
        ['Hai tempo?', 'Hast du Zeit?'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'it-interrogativi',
      title: 'Fragewörter',
      formula: 'Fragewort + Verb + ... ?',
      explanation:
        'dove (wo), quando (wann), come (wie), quanto (wie viel), perché (warum), chi (wer), che cosa (was). Das Fragewort steht vorn, der Rest bleibt wie im Aussagesatz.',
      examples: [
        ['Dov’è la stazione?', 'Wo ist der Bahnhof?'],
        ['Quanto costa il biglietto?', 'Was kostet die Fahrkarte?'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'it-presente-regolare',
      title: 'Präsens der drei Konjugationen',
      formula: '-are: -o -i -a -iamo -ate -ano · -ere: -o -i -e -iamo -ete -ono · -ire: -o -i -e -iamo -ite -ono',
      explanation:
        'Drei Muster decken fast alle Verben ab. Eine Gruppe der -ire-Verben schiebt -isc- ein: capisco, capisci, capisce, capiamo, capite, capiscono.',
      examples: [
        ['Parlo italiano, prendo il treno, dormo poco.', 'Ich spreche Italienisch, nehme den Zug, schlafe wenig.'],
        ['Non capisco, può ripetere?', 'Ich verstehe nicht, können Sie wiederholen?'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'it-modali',
      title: 'Modalverben: potere, dovere, volere',
      formula: 'posso / devo / voglio + Infinitiv',
      explanation:
        'Nach dem Modalverb steht immer der Infinitiv, ohne Präposition. "potere" können und dürfen, "dovere" müssen, "volere" wollen.',
      examples: [
        ['Posso pagare con la carta?', 'Kann ich mit Karte zahlen?'],
        ['Devo andare adesso, scusa.', 'Ich muss jetzt gehen, tut mir leid.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'it-vorrei-potrebbe',
      title: 'Höfliche Bitte: "vorrei" / "potrebbe…?"',
      formula: 'vorrei + Infinitiv · potrebbe + Infinitiv?',
      explanation: 'Der Standardbaustein für höfliche Wünsche – Restaurant, Hotel, Geschäft.',
      examples: [
        ['Vorrei pagare.', 'Ich würde gern zahlen.'],
        ['Potrebbe aiutarmi?', 'Könnten Sie mir helfen?'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'it-ci-sono',
      title: 'c’è und ci sono',
      formula: 'c’è + Singular · ci sono + Plural',
      explanation:
        'Beides heißt "es gibt". Die Form richtet sich nach dem, was folgt: "C’è un problema", aber "Ci sono due problemi".',
      examples: [
        ['C’è un bancomat qui vicino?', 'Gibt es hier in der Nähe einen Geldautomaten?'],
        ['Ci sono molte persone in fila.', 'Es stehen viele Leute in der Schlange.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'it-preposizioni',
      title: 'Präposition mit Artikel',
      formula: 'a+il=al · di+il=del · in+il=nel · su+il=sul · da+il=dal',
      explanation:
        'Präposition und bestimmter Artikel verschmelzen zu einem Wort: "Vado al bar", nicht "a il bar". Vor lo, la und l’ entsprechend allo, alla, all’.',
      examples: [
        ['Vado al lavoro in macchina.', 'Ich fahre mit dem Auto zur Arbeit.'],
        ['La chiave è nella borsa.', 'Der Schlüssel ist in der Tasche.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'it-possessivi',
      title: 'Possessivpronomen mit Artikel',
      formula: 'il mio · la mia · i miei · le mie',
      explanation:
        'Anders als im Deutschen steht der Artikel mit dabei: "il mio libro". Ausnahme sind einzelne Familienmitglieder im Singular: "mia madre", ohne Artikel.',
      examples: [
        ['Questa è la mia valigia.', 'Das ist mein Koffer.'],
        ['Mio fratello abita a Roma.', 'Mein Bruder wohnt in Rom.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'it-piacere',
      title: 'mi piace / mi piacciono',
      formula: 'mi piace + Singular · mi piacciono + Plural',
      explanation:
        'Wörtlich "es gefällt mir". Das Verb richtet sich nach dem, was gefällt, nicht nach der Person: "Mi piacciono i film italiani".',
      examples: [
        ['Mi piace il caffè senza zucchero.', 'Ich mag Kaffee ohne Zucker.'],
        ['Non mi piacciono le olive.', 'Ich mag keine Oliven.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'it-passato-avere',
      title: 'Perfekt mit avere',
      formula: 'ho / hai / ha / abbiamo / avete / hanno + Partizip',
      explanation:
        'Die Vergangenheit des Alltags. Partizip: -are → -ato, -ere → -uto, -ire → -ito. Mit "avere" bleibt das Partizip unverändert.',
      examples: [
        ['Ho mangiato una pizza.', 'Ich habe eine Pizza gegessen.'],
        ['Hai visto il film ieri sera?', 'Hast du gestern Abend den Film gesehen?'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'it-passato-essere',
      title: 'Perfekt mit essere',
      formula: 'sono / sei / è / siamo / siete / sono + Partizip (angeglichen)',
      explanation:
        'Verben der Bewegung und Veränderung nehmen "essere": andare, venire, uscire, restare, nascere. Dann richtet sich das Partizip nach dem Subjekt – "sono andato", "sono andata".',
      examples: [
        ['Sono andato al mercato stamattina.', 'Ich bin heute Morgen zum Markt gegangen.'],
        ['Anna è arrivata tardi.', 'Anna ist spät angekommen.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'it-imperfetto',
      title: 'Imperfetto',
      formula: '-avo / -evo / -ivo · ero, avevo, facevo',
      explanation:
        'Für Zustände, Gewohnheiten und Beschreibungen in der Vergangenheit: wie es war, was man immer tat. Unregelmäßig vor allem "essere" (ero) und "fare" (facevo).',
      examples: [
        ['Da bambino abitavo in campagna.', 'Als Kind wohnte ich auf dem Land.'],
        ['Faceva freddo e non c’era nessuno.', 'Es war kalt und niemand war da.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'it-passato-vs-imperfetto',
      title: 'Perfekt oder Imperfetto?',
      formula: 'passato prossimo = was geschah · imperfetto = wie es war',
      explanation:
        'Das Perfekt erzählt abgeschlossene Ereignisse, das Imperfetto den Rahmen drumherum. Oft stehen beide im selben Satz.',
      examples: [
        ['Mentre dormivo, è suonato il telefono.', 'Während ich schlief, hat das Telefon geklingelt.'],
        ['Ieri ho visto un film che era bellissimo.', 'Gestern habe ich einen Film gesehen, der wunderschön war.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'it-riflessivi',
      title: 'Reflexive Verben',
      formula: 'mi / ti / si / ci / vi / si + Verb — Perfekt immer mit essere',
      explanation:
        'alzarsi, svegliarsi, chiamarsi, lavarsi. Das Pronomen steht vor dem Verb. Im Perfekt nehmen sie immer "essere", das Partizip gleicht sich an: "mi sono alzata".',
      examples: [
        ['Mi chiamo Marco e mi alzo alle sette.', 'Ich heiße Marco und stehe um sieben auf.'],
        ['Ci siamo visti ieri.', 'Wir haben uns gestern gesehen.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'it-pronomi-diretti',
      title: 'Direkte Objektpronomen',
      formula: 'lo · la · li · le — vor dem Verb',
      explanation:
        'Sie ersetzen das direkte Objekt: "Compro il pane" wird zu "Lo compro". Im Perfekt gleicht sich das Partizip an: "L’ho comprata".',
      examples: [
        ['Conosci Anna? Sì, la conosco.', 'Kennst du Anna? Ja, ich kenne sie.'],
        ['I biglietti? Li ho già presi.', 'Die Tickets? Die habe ich schon gekauft.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'it-pronomi-indiretti',
      title: 'Indirekte Objektpronomen',
      formula: 'mi · ti · gli · le · ci · vi · gli',
      explanation:
        'Sie antworten auf "wem": "Scrivo a Marco" wird zu "Gli scrivo". "gli" für ihn, "le" für sie – im Plural für beide "gli".',
      examples: [
        ['Le ho telefonato stamattina.', 'Ich habe sie heute Morgen angerufen.'],
        ['Ci puoi dare una mano?', 'Kannst du uns helfen?'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'it-ne-ci',
      title: 'ne und ci',
      formula: 'ne = davon · ci = dorthin, dabei',
      explanation:
        '"ne" ersetzt eine Menge oder ein "von etwas": "Quante ne vuoi?" – "Ne prendo due." "ci" steht für einen Ort: "Vai a Roma? Sì, ci vado domani."',
      examples: [
        ['Vuoi del vino? Sì, ne prendo un bicchiere.', 'Möchtest du Wein? Ja, ich nehme ein Glas davon.'],
        ['Al mare? Ci andiamo ogni estate.', 'Ans Meer? Da fahren wir jeden Sommer hin.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'it-futuro',
      title: 'Über Zukünftiges sprechen',
      formula: 'Präsens + Zeitangabe · Futur: -erò, -irò',
      explanation:
        'Für Geplantes reicht meist das Präsens mit Zeitangabe: "Domani parto". Das echte Futur benutzt man für Vorhersagen und Vermutungen.',
      examples: [
        ['Domani vado a Milano.', 'Morgen fahre ich nach Mailand.'],
        ['Sarà difficile, ma ci proverò.', 'Es wird schwierig, aber ich werde es versuchen.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'it-imperativo',
      title: 'Imperativ',
      formula: 'tu: parla! · Lei: parli! — verneint: non + Infinitiv',
      explanation:
        'Für Bitten und Wegbeschreibungen. Bei -are-Verben endet die Du-Form auf -a, die Sie-Form auf -i; bei -ere und -ire umgekehrt. Verneint immer "non" plus Infinitiv.',
      examples: [
        ['Scusi, mi dica!', 'Entschuldigung, sagen Sie!'],
        ['Gira a destra e poi vai dritto.', 'Bieg rechts ab und geh dann geradeaus.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'it-comparativo',
      title: 'Vergleichen',
      formula: 'più / meno … di · così … come · il più …',
      explanation:
        '"più caro di" teurer als, "meno caro di" weniger teuer als, "come" bei Gleichheit. Unregelmäßig: buono → migliore, cattivo → peggiore.',
      examples: [
        ['Il treno è più veloce della macchina.', 'Der Zug ist schneller als das Auto.'],
        ['Questo è il ristorante migliore della città.', 'Das ist das beste Restaurant der Stadt.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'it-relative-che',
      title: 'Relativsatz mit che und cui',
      formula: 'che = der/die/das · Präposition + cui',
      explanation:
        '"che" gilt für Subjekt und direktes Objekt, unabhängig von Geschlecht und Zahl. Nach einer Präposition steht "cui": "la città in cui abito".',
      examples: [
        ['Il libro che leggo è italiano.', 'Das Buch, das ich lese, ist italienisch.'],
        ['La ragione per cui non vengo è semplice.', 'Der Grund, warum ich nicht komme, ist einfach.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'it-stare-gerundio',
      title: 'stare + gerundio',
      formula: 'sto / stai / sta + -ando, -endo',
      explanation:
        'Was gerade in diesem Moment passiert: "Sto mangiando". Anders als im Englischen nur für den Augenblick, nie für die nahe Zukunft.',
      examples: [
        ['Che cosa stai facendo?', 'Was machst du gerade?'],
        ['Sto cercando la stazione.', 'Ich suche gerade den Bahnhof.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'it-connettivi',
      title: 'Sätze verbinden',
      formula: 'perché · quindi · però · anche se · mentre',
      explanation:
        'Aus zwei Sätzen einen machen: perché (weil), quindi (also), però (aber), anche se (obwohl), mentre (während). Sie stehen zwischen den Teilen, das Verb bleibt an seinem Platz.',
      examples: [
        ['Non esco perché piove.', 'Ich gehe nicht raus, weil es regnet.'],
        ['È tardi, quindi prendo un taxi.', 'Es ist spät, also nehme ich ein Taxi.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'it-condizionale',
      title: 'Condizionale: höflich und hypothetisch',
      formula: '-erei, -eresti, -erebbe · sarei, avrei, farei',
      explanation:
        'Aus "vorrei" wird ein ganzes Tempus. Es dient für höfliche Aussagen, unsichere Behauptungen und Wünsche: "Dovresti riposare", "Sarebbe meglio così".',
      examples: [
        ['Dovresti riposare un po’.', 'Du solltest dich etwas ausruhen.'],
        ['Sarebbe meglio partire presto.', 'Es wäre besser, früh loszufahren.'],
      ],
      week: 1,
      level: 'B1',
    },
    {
      slug: 'it-congiuntivo-presente',
      title: 'Congiuntivo Presente',
      formula: 'penso che / credo che / è meglio che + sia, abbia, faccia',
      explanation:
        'Nach Meinung, Zweifel, Gefühl und Notwendigkeit steht der Congiuntivo. Die drei Personen im Singular sind gleich – deshalb setzt man das Pronomen oft dazu.',
      examples: [
        ['Penso che sia una buona idea.', 'Ich glaube, das ist eine gute Idee.'],
        ['È meglio che tu vada adesso.', 'Es ist besser, wenn du jetzt gehst.'],
      ],
      week: 1,
      level: 'B1',
    },
    {
      slug: 'it-congiuntivo-espressioni',
      title: 'Auslöser des Congiuntivo',
      formula: 'benché · affinché · prima che · sebbene · a meno che',
      explanation:
        'Nicht nur Verben lösen den Congiuntivo aus, sondern auch bestimmte Konjunktionen. Merken lohnt sich als Liste, nicht als Regel.',
      examples: [
        ['Benché sia tardi, esco.', 'Obwohl es spät ist, gehe ich raus.'],
        ['Ti chiamo prima che tu parta.', 'Ich rufe dich an, bevor du losfährst.'],
      ],
      week: 1,
      level: 'B1',
    },
    {
      slug: 'it-ipotetico-reale',
      title: 'Bedingungssatz: der reale Fall',
      formula: 'Se + Präsens, Präsens/Futur/Imperativ',
      explanation:
        'Was wahrscheinlich eintritt: "Se piove, resto a casa." Beide Teile stehen im Indikativ – der Congiuntivo kommt erst beim irrealen Fall.',
      examples: [
        ['Se piove, resto a casa.', 'Wenn es regnet, bleibe ich zu Hause.'],
        ['Se hai tempo, chiamami.', 'Wenn du Zeit hast, ruf mich an.'],
      ],
      week: 2,
      level: 'B1',
    },
    {
      slug: 'it-trapassato',
      title: 'Trapassato prossimo',
      formula: 'avevo / ero + Partizip',
      explanation:
        'Das Davor in der Vergangenheit: "Quando sono arrivato, era già partito." Hilfsverb im Imperfetto, sonst wie das Perfekt.',
      examples: [
        ['Quando sono arrivato, era già partito.', 'Als ich ankam, war er schon weg.'],
        ['Non sapevo che avevi chiamato.', 'Ich wusste nicht, dass du angerufen hattest.'],
      ],
      week: 2,
      level: 'B1',
    },
    {
      slug: 'it-pronomi-combinati',
      title: 'Kombinierte Pronomen',
      formula: 'me lo · te la · glielo · ce ne',
      explanation:
        'Treffen indirektes und direktes Pronomen aufeinander, wird "mi" zu "me", "ti" zu "te", und "gli/le" verschmilzt zu "glie-": "Glielo dico domani".',
      examples: [
        ['Me lo puoi spiegare?', 'Kannst du es mir erklären?'],
        ['Glielo dico domani.', 'Ich sage es ihm morgen.'],
      ],
      week: 2,
      level: 'B1',
    },
    {
      slug: 'it-si-impersonale',
      title: 'si impersonale und si passivante',
      formula: 'si + 3. Person',
      explanation:
        'Das deutsche "man": "In Italia si cena tardi." Steht ein Objekt dahinter, richtet sich das Verb danach: "Qui si parlano tre lingue."',
      examples: [
        ['In Italia si cena tardi.', 'In Italien isst man spät zu Abend.'],
        ['Qui si parlano tre lingue.', 'Hier werden drei Sprachen gesprochen.'],
      ],
      week: 2,
      level: 'B1',
    },
    {
      slug: 'it-passivo',
      title: 'Passiv mit essere und venire',
      formula: 'essere/venire + Partizip (+ da …)',
      explanation:
        '"La lettera è stata scritta da Marco." Mit "venire" klingt es aktiver und geht nur in einfachen Zeiten: "La porta viene chiusa alle otto."',
      examples: [
        ['La lettera è stata scritta da Marco.', 'Der Brief wurde von Marco geschrieben.'],
        ['Il museo viene chiuso alle sei.', 'Das Museum wird um sechs geschlossen.'],
      ],
      week: 3,
      level: 'B1',
    },
    {
      slug: 'it-discorso-indiretto',
      title: 'Indirekte Rede',
      formula: 'ha detto che + Zeitverschiebung',
      explanation:
        'Beim Berichten rutschen die Zeiten zurück: Präsens wird Imperfetto, Perfekt wird Trapassato, Futur wird Condizionale composto.',
      examples: [
        ['Ha detto che era stanco.', 'Er sagte, er sei müde.'],
        ['Mi ha chiesto se avevo tempo.', 'Sie hat mich gefragt, ob ich Zeit hätte.'],
      ],
      week: 3,
      level: 'B1',
    },
    {
      slug: 'it-gerundio-subordinate',
      title: 'Gerundio als Nebensatz',
      formula: 'Uscendo di casa, … · Essendo tardi, …',
      explanation:
        'Ein Gerundio ersetzt einen ganzen Nebensatz und drückt Zeit, Grund oder Art aus: "Uscendo di casa, ho incontrato Anna."',
      examples: [
        ['Uscendo di casa, ho incontrato Anna.', 'Als ich das Haus verließ, traf ich Anna.'],
        ['Essendo tardi, siamo tornati.', 'Da es spät war, sind wir zurückgegangen.'],
      ],
      week: 3,
      level: 'B1',
    },
    {
      slug: 'it-verbi-preposizioni',
      title: 'Verb plus Präposition und Infinitiv',
      formula: 'cercare di · riuscire a · finire di · cominciare a',
      explanation:
        'Welche Präposition ein Verb verlangt, muss man mitlernen – eine Regel gibt es nicht. Die häufigsten: "di" bei cercare, finire, smettere; "a" bei cominciare, riuscire, imparare.',
      examples: [
        ['Cerco di arrivare in orario.', 'Ich versuche pünktlich zu sein.'],
        ['Non riesco a capire.', 'Ich schaffe es nicht zu verstehen.'],
      ],
      week: 3,
      level: 'B1',
    },
    {
      slug: 'it-avverbi',
      title: 'Adverbien auf -mente und ihre Stellung',
      formula: 'Adjektiv (weiblich) + -mente',
      explanation:
        'lenta → lentamente, facile → facilmente. Im Perfekt stehen kurze Adverbien wie già, ancora, sempre und mai zwischen Hilfsverb und Partizip.',
      examples: [
        ['Parla molto lentamente.', 'Er spricht sehr langsam.'],
        ['Non ci sono mai stato.', 'Ich war noch nie dort.'],
      ],
      week: 4,
      level: 'B1',
    },
    {
      slug: 'it-relative-cui',
      title: 'Relativsätze mit cui und il quale',
      formula: 'Präposition + cui · il/la quale',
      explanation:
        '"La città in cui vivo." Mit Artikel steht "cui" für den Besitz: "il ragazzo la cui sorella…". "il quale" ist die formellere Variante von "che".',
      examples: [
        ['La città in cui vivo è piccola.', 'Die Stadt, in der ich lebe, ist klein.'],
        ['Il collega con cui lavoro è tedesco.', 'Der Kollege, mit dem ich arbeite, ist Deutscher.'],
      ],
      week: 4,
      level: 'B1',
    },
    {
      slug: 'it-connettivi-b1',
      title: 'Argumentieren: inoltre, tuttavia, siccome',
      formula: 'inoltre · tuttavia · perciò · siccome · nonostante',
      explanation:
        'Über "e", "ma" und "perché" hinaus: "siccome" leitet den Grund ein und steht vorn, "perciò" die Folge, "tuttavia" den Einwand.',
      examples: [
        ['Siccome pioveva, siamo rimasti a casa.', 'Da es regnete, sind wir zu Hause geblieben.'],
        ['È caro; tuttavia ne vale la pena.', 'Es ist teuer; trotzdem lohnt es sich.'],
      ],
      week: 4,
      level: 'B1',
    },
    {
      slug: 'it-aspetto',
      title: 'stare per, continuare a, smettere di',
      formula: 'stare per + Inf. · continuare a + Inf. · smettere di + Inf.',
      explanation:
        'Feinheiten des Ablaufs: "sto per uscire" – ich gehe gleich; "continuo a lavorare" – ich mache weiter; "ho smesso di fumare" – ich habe aufgehört.',
      examples: [
        ['Sto per uscire, ti richiamo.', 'Ich gehe gleich, ich rufe zurück.'],
        ['Ho smesso di fumare l’anno scorso.', 'Ich habe letztes Jahr aufgehört zu rauchen.'],
      ],
      week: 4,
      level: 'B1',
    },
    {
      slug: 'it-congiuntivo-imperfetto',
      title: 'Congiuntivo Imperfetto',
      formula: 'fossi, avessi, facessi · pensavo che …',
      explanation:
        'Steht der Hauptsatz in der Vergangenheit oder im Condizionale, folgt der Congiuntivo Imperfetto: "Pensavo che fosse più facile."',
      examples: [
        ['Pensavo che fosse più facile.', 'Ich dachte, es wäre leichter.'],
        ['Vorrei che tu venissi con me.', 'Ich möchte, dass du mitkommst.'],
      ],
      week: 1,
      level: 'B2',
    },
    {
      slug: 'it-ipotetico-irreale',
      title: 'Bedingungssatz: der irreale Fall',
      formula: 'Se + Congiuntivo Imperfetto, Condizionale',
      explanation:
        'Was möglich, aber unwahrscheinlich ist: "Se avessi tempo, verrei." Nie "se avrei" – im se-Teil steht nie das Condizionale.',
      examples: [
        ['Se avessi tempo, verrei volentieri.', 'Wenn ich Zeit hätte, käme ich gern.'],
        ['Se fossi in te, non lo farei.', 'An deiner Stelle würde ich das nicht tun.'],
      ],
      week: 1,
      level: 'B2',
    },
    {
      slug: 'it-ipotetico-impossibile',
      title: 'Bedingungssatz: die verpasste Möglichkeit',
      formula: 'Se + Congiuntivo Trapassato, Condizionale Passato',
      explanation:
        'Was nicht mehr zu ändern ist: "Se avessi saputo, sarei venuto." Der häufigste Satz beim Bedauern und beim Vorwurf.',
      examples: [
        ['Se avessi saputo, sarei venuto.', 'Hätte ich es gewusst, wäre ich gekommen.'],
        ['Se fossimo partiti prima, non avremmo perso il treno.', 'Wären wir früher losgefahren, hätten wir den Zug nicht verpasst.'],
      ],
      week: 1,
      level: 'B2',
    },
    {
      slug: 'it-concordanza-tempi',
      title: 'Zeitenfolge im Congiuntivo',
      formula: 'Hauptsatz Gegenwart → Congiuntivo Presente · Vergangenheit → Imperfetto',
      explanation:
        'Die Zeit im Nebensatz richtet sich nach dem Hauptsatz: "Penso che sia" gegenüber "Pensavo che fosse". Für Vorzeitigkeit: "Penso che sia stato".',
      examples: [
        ['Credo che abbia ragione.', 'Ich glaube, er hat recht.'],
        ['Credevo che avesse ragione.', 'Ich glaubte, er hätte recht.'],
      ],
      week: 2,
      level: 'B2',
    },
    {
      slug: 'it-passato-remoto',
      title: 'Passato remoto',
      formula: 'parlai, parlò, parlarono · fui, ebbi, fece',
      explanation:
        'In Erzählungen, Geschichtsbüchern und im Süden gesprochen. Man muss es vor allem erkennen können; aktiv braucht man es im Norden selten.',
      examples: [
        ['Dante nacque a Firenze nel 1265.', 'Dante wurde 1265 in Florenz geboren.'],
        ['Andarono via senza dire niente.', 'Sie gingen weg, ohne etwas zu sagen.'],
      ],
      week: 2,
      level: 'B2',
    },
    {
      slug: 'it-subordinate-implicite',
      title: 'Verkürzte Nebensätze',
      formula: 'prima di + Inf. · dopo aver + Partizip · pur essendo',
      explanation:
        'Bei gleichem Subjekt wird der Nebensatz verkürzt: "Dopo aver mangiato, siamo usciti" statt eines vollen Nebensatzes.',
      examples: [
        ['Dopo aver mangiato, siamo usciti.', 'Nach dem Essen sind wir rausgegangen.'],
        ['Prima di partire, chiudi le finestre.', 'Bevor du losfährst, schließ die Fenster.'],
      ],
      week: 2,
      level: 'B2',
    },
    {
      slug: 'it-verbi-pronominali',
      title: 'Pronominale Verben: farcela, andarsene, cavarsela',
      formula: 'farcela · andarsene · cavarsela · smetterla',
      explanation:
        'Verben, die mit angehängten Pronomen eine eigene Bedeutung bekommen. "Ce la faccio" – ich schaffe es. "Me ne vado" – ich haue ab.',
      examples: [
        ['Non ce la faccio più.', 'Ich kann nicht mehr.'],
        ['Me ne vado, è tardi.', 'Ich gehe, es ist spät.'],
      ],
      week: 3,
      level: 'B2',
    },
    {
      slug: 'it-passivo-avanzato',
      title: 'Passiv mit andare und dovere',
      formula: 'andare + Partizip = muss getan werden',
      explanation:
        '"Il modulo va compilato" heißt: Es muss ausgefüllt werden. In Vorschriften und Anleitungen häufiger als das Passiv mit "essere".',
      examples: [
        ['Il modulo va compilato in stampatello.', 'Das Formular ist in Druckbuchstaben auszufüllen.'],
        ['Queste cose vanno dette subito.', 'Solche Dinge muss man sofort sagen.'],
      ],
      week: 3,
      level: 'B2',
    },
    {
      slug: 'it-connettivi-b2',
      title: 'Formelle Konnektoren',
      formula: 'affinché · purché · qualora · nonostante · a patto che',
      explanation:
        'Für Schriftliches und formelle Gespräche. Fast alle verlangen den Congiuntivo: "purché tu sia d’accordo", "qualora fosse necessario".',
      examples: [
        ['Vengo, purché tu sia d’accordo.', 'Ich komme, sofern du einverstanden bist.'],
        ['Nonostante fosse tardi, hanno continuato.', 'Obwohl es spät war, haben sie weitergemacht.'],
      ],
      week: 3,
      level: 'B2',
    },
    {
      slug: 'it-sfumature-modali',
      title: 'Modalverben mit Nuance',
      formula: 'dovrebbe · potrebbe essere · avrebbe dovuto',
      explanation:
        'Im Condizionale drücken Modalverben Vermutung und Vorwurf aus: "Dovrebbe arrivare alle otto" – er müsste ankommen. "Avresti dovuto dirmelo" – du hättest es mir sagen müssen.',
      examples: [
        ['Il treno dovrebbe arrivare alle otto.', 'Der Zug müsste um acht ankommen.'],
        ['Avresti dovuto dirmelo prima.', 'Du hättest es mir früher sagen müssen.'],
      ],
      week: 4,
      level: 'B2',
    },
    {
      slug: 'it-marcatori-discorso',
      title: 'Diskursmarker: insomma, cioè, magari, mica',
      formula: 'insomma · cioè · magari · mica · anzi',
      explanation:
        'Die kleinen Wörter, an denen man Muttersprachler erkennt. "magari" heißt je nach Ton "vielleicht" oder "und ob!", "mica" verstärkt die Verneinung.',
      examples: [
        ['Non è mica facile.', 'Das ist gar nicht so einfach.'],
        ['Magari fosse vero!', 'Wenn das nur wahr wäre!'],
      ],
      week: 4,
      level: 'B2',
    },
    {
      slug: 'it-registro',
      title: 'Register: gesprochen und geschrieben',
      formula: 'Lei-Form · Konjunktiv im Schriftlichen · Ellipsen im Gespräch',
      explanation:
        'Dieselbe Aussage klingt je nach Situation anders: "Le dispiacerebbe…?" im Amt, "Ti va di…?" unter Freunden. Der Unterschied liegt in Anrede, Modus und Länge.',
      examples: [
        ['Le dispiacerebbe aspettare un attimo?', 'Würde es Ihnen etwas ausmachen, kurz zu warten?'],
        ['Ti va di prendere un caffè?', 'Hast du Lust auf einen Kaffee?'],
      ],
      week: 4,
      level: 'B2',
    },
    {
      slug: 'it-nominalizzazione',
      title: 'Nominalstil der Zeitungssprache',
      formula: 'l’aumento dei prezzi · a seguito di · in merito a',
      explanation:
        'Zeitungen und Behörden verwandeln Verben in Nomen: nicht "i prezzi sono aumentati", sondern "l’aumento dei prezzi". Wer das erkennt, liest deutlich schneller.',
      examples: [
        ['L’aumento dei prezzi preoccupa le famiglie.', 'Der Preisanstieg beunruhigt die Familien.'],
        ['A seguito dello sciopero, i treni sono cancellati.', 'Infolge des Streiks fallen die Züge aus.'],
      ],
      week: 4,
      level: 'B2',
    },
  ],
};

const french: SeedLanguage = {
  name: 'Französisch',
  nativeName: 'Français',
  code: 'fr-FR',
  emoji: '🇫🇷',
  words: [
    ['être', 'sein', 'Verb', 'Je suis de Berlin.', 'Ich bin aus Berlin.'],
    ['avoir', 'haben', 'Verb', "J'ai une question.", 'Ich habe eine Frage.'],
    ['faire', 'machen, tun', 'Verb', 'Qu’est-ce que tu fais ?', 'Was machst du?'],
    ['aller', 'gehen, fahren', 'Verb', 'Je vais au travail.', 'Ich gehe zur Arbeit.'],
    ['pouvoir', 'können', 'Verb', 'Je peux payer par carte ?', 'Kann ich mit Karte zahlen?'],
    ['vouloir', 'wollen', 'Verb', 'Je voudrais un café.', 'Ich hätte gern einen Kaffee.'],
    ['savoir', 'wissen', 'Verb', 'Je ne sais pas où c’est.', 'Ich weiß nicht, wo das ist.'],
    ['dire', 'sagen', 'Verb', 'Comment dit-on ça ?', 'Wie sagt man das?'],
    ['venir', 'kommen', 'Verb', 'Tu viens avec moi ?', 'Kommst du mit mir?'],
    ['il y a', 'es gibt', 'Phrase', 'Il y a des toilettes ici ?', 'Gibt es hier eine Toilette?'],
    ['je', 'ich', 'Pronomen', 'Je travaille ici.', 'Ich arbeite hier.'],
    ['tu', 'du', 'Pronomen', 'Tu parles allemand ?', 'Sprichst du Deutsch?'],
    ['nous', 'wir', 'Pronomen', 'Nous y allons ensemble.', 'Wir gehen zusammen hin.'],
    ['quoi / que', 'was', 'Fragewort', 'Qu’est-ce que c’est ?', 'Was ist das?'],
    ['qui', 'wer', 'Fragewort', 'Qui est-ce ?', 'Wer ist das?'],
    ['où', 'wo', 'Fragewort', 'Où est la gare ?', 'Wo ist der Bahnhof?'],
    ['quand', 'wann', 'Fragewort', 'Quand est-ce que ça commence ?', 'Wann fängt es an?'],
    ['comment', 'wie', 'Fragewort', 'Comment ça va ?', 'Wie geht es dir?'],
    ['pourquoi', 'warum', 'Fragewort', 'Pourquoi tu ne viens pas ?', 'Warum kommst du nicht?'],
    ['combien', 'wie viel', 'Fragewort', 'Ça coûte combien ?', 'Wie viel kostet das?'],
    ['ne … pas', 'nicht', 'Negation', 'Je ne comprends pas.', 'Ich verstehe nicht.'],
    ['jamais', 'nie', 'Adverb', 'Je n’y suis jamais allé.', 'Ich war noch nie dort.'],
    ['rien', 'nichts', 'Pronomen', 'Je ne veux rien.', 'Ich möchte nichts.'],
    ['et', 'und', 'Konjunktion', 'Du pain et de l’eau.', 'Brot und Wasser.'],
    ['mais', 'aber', 'Konjunktion', 'Je veux, mais je ne peux pas.', 'Ich will, aber ich kann nicht.'],
    ['parce que', 'weil', 'Konjunktion', 'Je reste parce que je suis fatigué.', 'Ich bleibe, weil ich müde bin.'],
    ['aussi', 'auch', 'Adverb', 'Moi aussi.', 'Ich auch.'],
    ['dans', 'in', 'Präposition', 'Je suis dans le train.', 'Ich bin im Zug.'],
    ['de', 'von, aus', 'Präposition', 'Je viens de Munich.', 'Ich komme aus München.'],
    ['avec', 'mit', 'Präposition', 'Je viens avec un ami.', 'Ich komme mit einem Freund.'],
    ['pour', 'für', 'Präposition', 'C’est pour moi.', 'Das ist für mich.'],
    ['maintenant', 'jetzt', 'Adverb', 'Maintenant je ne peux pas.', 'Jetzt kann ich nicht.'],
    ["aujourd'hui", 'heute', 'Adverb', "Aujourd'hui je travaille beaucoup.", 'Heute arbeite ich viel.'],
    ['demain', 'morgen', 'Adverb', 'Demain j’ai le temps.', 'Morgen habe ich Zeit.'],
    ['toujours', 'immer', 'Adverb', 'J’arrive toujours en retard.', 'Ich komme immer zu spät.'],
    ['très', 'sehr', 'Adverb', 'C’est très bien.', 'Das ist sehr gut.'],
    ['beaucoup', 'viel', 'Adverb', 'Merci beaucoup.', 'Vielen Dank.'],
    ['bien', 'gut', 'Adverb', 'Tout va bien.', 'Alles ist gut.'],
    ['le temps', 'die Zeit, das Wetter', 'Nomen', 'Je n’ai pas le temps.', 'Ich habe keine Zeit.'],
    ['la maison', 'das Haus', 'Nomen', 'La maison est grande.', 'Das Haus ist groß.'],
    ["l'eau", 'das Wasser', 'Nomen', 'Un verre d’eau, s’il vous plaît.', 'Ein Glas Wasser, bitte.'],
    ['les gens', 'die Leute', 'Nomen', 'Il y a beaucoup de gens ici.', 'Hier sind viele Leute.'],
    ["s'il vous plaît", 'bitte (förmlich)', 'Phrase', "L'addition, s'il vous plaît.", 'Die Rechnung, bitte.'],
    ['merci', 'danke', 'Phrase', 'Merci beaucoup pour tout.', 'Vielen Dank für alles.'],
    ['excusez-moi', 'Entschuldigung', 'Phrase', 'Excusez-moi, vous pouvez répéter ?', 'Entschuldigung, können Sie wiederholen?'],
    ['je voudrais', 'ich hätte gern', 'Phrase', 'Je voudrais réserver une table.', 'Ich hätte gern einen Tisch reserviert.'],
  ],
  patterns: [
    {
      slug: 'fr-svo',
      title: 'Aussagesatz: Subjekt + Verb + Objekt',
      formula: 'Subjekt + Verb + Objekt',
      explanation: 'Anders als im Spanischen oder Italienischen steht das Subjektpronomen im Französischen fast immer.',
      examples: [
        ["J'ai une question.", 'Ich habe eine Frage.'],
        ['Anne mange du pain.', 'Anne isst Brot.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'fr-negation-ne-pas',
      title: 'Verneinung mit "ne … pas"',
      formula: 'Subjekt + ne + Verb + pas',
      explanation: 'Die Verneinung klammert das konjugierte Verb ein. Gesprochen fällt "ne" oft weg: "Je comprends pas."',
      examples: [
        ['Je ne comprends pas.', 'Ich verstehe nicht.'],
        ['Il n’est pas là.', 'Er ist nicht da.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'fr-est-ce-que',
      title: 'Frage mit "est-ce que"',
      formula: 'Est-ce que + Subjekt + Verb ?',
      explanation: 'Der sicherste Weg, eine Frage zu bilden: "est-ce que" davor, Satzbau bleibt unverändert.',
      examples: [
        ['Est-ce que tu parles allemand ?', 'Sprichst du Deutsch?'],
        ['Est-ce qu’il y a un bus ?', 'Gibt es einen Bus?'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'fr-je-voudrais',
      title: 'Höfliche Bitte: "je voudrais" / "pourriez-vous…?"',
      formula: 'je voudrais + Infinitiv · pourriez-vous + Infinitiv ?',
      explanation: 'Der Conditionnel macht die Bitte höflich. Im Alltag der wichtigste Baustein überhaupt.',
      examples: [
        ['Je voudrais payer.', 'Ich würde gern zahlen.'],
        ['Pourriez-vous m’aider ?', 'Könnten Sie mir helfen?'],
      ],
      week: 2,
      level: 'A1',
    },
  ],
};

const polish: SeedLanguage = {
  name: 'Polnisch',
  nativeName: 'Polski',
  code: 'pl-PL',
  emoji: '🇵🇱',
  words: [
    ['być', 'sein', 'Verb', 'Jestem z Niemiec.', 'Ich bin aus Deutschland.'],
    ['mieć', 'haben', 'Verb', 'Mam pytanie.', 'Ich habe eine Frage.'],
    ['robić', 'machen, tun', 'Verb', 'Co robisz dzisiaj?', 'Was machst du heute?'],
    ['iść', 'gehen', 'Verb', 'Idę do pracy.', 'Ich gehe zur Arbeit.'],
    ['móc', 'können', 'Verb', 'Czy mogę zapłacić kartą?', 'Kann ich mit Karte zahlen?'],
    ['chcieć', 'wollen, möchten', 'Verb', 'Chcę kawę.', 'Ich möchte einen Kaffee.'],
    ['wiedzieć', 'wissen', 'Verb', 'Nie wiem, gdzie to jest.', 'Ich weiß nicht, wo das ist.'],
    ['mówić', 'sprechen, sagen', 'Verb', 'Mówisz po niemiecku?', 'Sprichst du Deutsch?'],
    ['rozumieć', 'verstehen', 'Verb', 'Nie rozumiem.', 'Ich verstehe nicht.'],
    ['jeść', 'essen', 'Verb', 'Jem śniadanie.', 'Ich esse Frühstück.'],
    ['pić', 'trinken', 'Verb', 'Piję kawę.', 'Ich trinke Kaffee.'],
    ['mieszkać', 'wohnen', 'Verb', 'Mieszkam w Warszawie.', 'Ich wohne in Warschau.'],
    ['pracować', 'arbeiten', 'Verb', 'Pracuję w biurze.', 'Ich arbeite im Büro.'],
    ['kupować', 'kaufen', 'Verb', 'Kupuję chleb.', 'Ich kaufe Brot.'],
    ['płacić', 'zahlen', 'Verb', 'Chcę zapłacić.', 'Ich möchte zahlen.'],
    ['czekać', 'warten', 'Verb', 'Czekam na autobus.', 'Ich warte auf den Bus.'],
    ['szukać', 'suchen', 'Verb', 'Szukam dworca.', 'Ich suche den Bahnhof.'],
    ['potrzebować', 'brauchen', 'Verb', 'Potrzebuję pomocy.', 'Ich brauche Hilfe.'],
    ['widzieć', 'sehen', 'Verb', 'Nie widzę nic.', 'Ich sehe nichts.'],
    ['znać', 'kennen', 'Verb', 'Znam to miejsce.', 'Ich kenne diesen Ort.'],
    ['tak', 'ja', 'Partikel', 'Tak, oczywiście.', 'Ja, natürlich.'],
    ['nie', 'nein, nicht', 'Partikel', 'Nie, dziękuję.', 'Nein, danke.'],
    ['proszę', 'bitte', 'Höflichkeit', 'Poproszę kawę.', 'Einen Kaffee, bitte.'],
    ['dziękuję', 'danke', 'Höflichkeit', 'Dziękuję bardzo.', 'Vielen Dank.'],
    ['przepraszam', 'Entschuldigung', 'Höflichkeit', 'Przepraszam, gdzie jest apteka?', 'Entschuldigung, wo ist die Apotheke?'],
    ['dzień dobry', 'guten Tag', 'Höflichkeit', 'Dzień dobry, jak się masz?', 'Guten Tag, wie geht es dir?'],
    ['do widzenia', 'auf Wiedersehen', 'Höflichkeit', 'Do widzenia i miłego dnia.', 'Auf Wiedersehen und einen schönen Tag.'],
    ['gdzie', 'wo', 'Fragewort', 'Gdzie jest dworzec?', 'Wo ist der Bahnhof?'],
    ['kiedy', 'wann', 'Fragewort', 'Kiedy odjeżdża pociąg?', 'Wann fährt der Zug ab?'],
    ['ile', 'wie viel', 'Fragewort', 'Ile to kosztuje?', 'Was kostet das?'],
    ['jak', 'wie', 'Fragewort', 'Jak się masz?', 'Wie geht es dir?'],
    ['co', 'was', 'Fragewort', 'Co to jest?', 'Was ist das?'],
    ['kto', 'wer', 'Fragewort', 'Kto to jest?', 'Wer ist das?'],
    ['dlaczego', 'warum', 'Fragewort', 'Dlaczego nie?', 'Warum nicht?'],
    ['czy', 'ob (Fragepartikel)', 'Partikel', 'Czy masz czas?', 'Hast du Zeit?'],
    ['woda', 'Wasser', 'Nomen', 'Poproszę wodę.', 'Wasser, bitte.'],
    ['kawa', 'Kaffee', 'Nomen', 'Piję kawę bez cukru.', 'Ich trinke Kaffee ohne Zucker.'],
    ['chleb', 'Brot', 'Nomen', 'Kupuję chleb w sklepie.', 'Ich kaufe Brot im Laden.'],
    ['dom', 'Haus', 'Nomen', 'Jestem w domu.', 'Ich bin zu Hause.'],
    ['praca', 'Arbeit', 'Nomen', 'Idę do pracy.', 'Ich gehe zur Arbeit.'],
    ['czas', 'Zeit', 'Nomen', 'Nie mam czasu.', 'Ich habe keine Zeit.'],
    ['dzień', 'Tag', 'Nomen', 'Miłego dnia!', 'Schönen Tag!'],
    ['pociąg', 'Zug', 'Nomen', 'Pociąg odjeżdża o ósmej.', 'Der Zug fährt um acht.'],
    ['sklep', 'Laden, Geschäft', 'Nomen', 'Sklep jest zamknięty.', 'Der Laden ist geschlossen.'],
    ['dworzec', 'Bahnhof', 'Nomen', 'Gdzie jest dworzec?', 'Wo ist der Bahnhof?'],
    ['hotel', 'Hotel', 'Nomen', 'Szukam hotelu.', 'Ich suche ein Hotel.'],
    ['bilet', 'Fahrkarte', 'Nomen', 'Poproszę bilet do Krakowa.', 'Eine Fahrkarte nach Krakau, bitte.'],
    ['rachunek', 'Rechnung', 'Nomen', 'Poproszę rachunek.', 'Die Rechnung, bitte.'],
    ['pokój', 'Zimmer', 'Nomen', 'Szukam pokoju na dwie noce.', 'Ich suche ein Zimmer für zwei Nächte.'],
    ['jedzenie', 'Essen', 'Nomen', 'Jedzenie jest bardzo dobre.', 'Das Essen ist sehr gut.'],
    ['dobry', 'gut', 'Adjektiv', 'To jest bardzo dobre.', 'Das ist sehr gut.'],
    ['duży', 'groß', 'Adjektiv', 'To jest za duże.', 'Das ist zu groß.'],
    ['mały', 'klein', 'Adjektiv', 'Mam małe pytanie.', 'Ich habe eine kleine Frage.'],
    ['drogi', 'teuer', 'Adjektiv', 'To jest za drogie.', 'Das ist zu teuer.'],
    ['teraz', 'jetzt', 'Adverb', 'Nie mogę teraz.', 'Ich kann jetzt nicht.'],
    ['dzisiaj', 'heute', 'Adverb', 'Dzisiaj pracuję.', 'Heute arbeite ich.'],
    ['jutro', 'morgen', 'Adverb', 'Do jutra!', 'Bis morgen!'],
    ['bardzo', 'sehr', 'Adverb', 'Bardzo dziękuję.', 'Vielen Dank.'],
    ['trochę', 'ein bisschen', 'Adverb', 'Mówię trochę po polsku.', 'Ich spreche ein bisschen Polnisch.'],
    ['też', 'auch', 'Adverb', 'Ja też.', 'Ich auch.'],
  ],
  patterns: [
    {
      slug: 'pl-svo',
      title: 'Aussagesatz: Subjekt + Verb + Objekt',
      formula: '(Subjekt) + Verb + Objekt im Akkusativ',
      explanation:
        'Das Subjektpronomen entfällt meist, die Verbendung zeigt die Person. Das Objekt steht im Akkusativ: "kawa" wird zu "kawę", "woda" zu "wodę".',
      examples: [
        ['Mam pytanie.', 'Ich habe eine Frage.'],
        ['Anna je chleb.', 'Anna isst Brot.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pl-negacja-nie',
      title: 'Verneinung mit "nie"',
      formula: '(Subjekt) + nie + Verb + Objekt im Genitiv',
      explanation:
        '"nie" steht direkt vor dem Verb. Wichtig: Nach der Verneinung wechselt das Objekt vom Akkusativ in den Genitiv – "Mam czas" wird zu "Nie mam czasu".',
      examples: [
        ['Nie rozumiem.', 'Ich verstehe nicht.'],
        ['Nie mam czasu.', 'Ich habe keine Zeit.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pl-pytanie-czy',
      title: 'Entscheidungsfrage mit "czy"',
      formula: 'Czy + Subjekt + Verb ?',
      explanation:
        '"czy" vor den Satz stellen, der Rest bleibt unverändert. Umgangssprachlich reicht auch die Intonation allein.',
      examples: [
        ['Czy mówisz po niemiecku?', 'Sprichst du Deutsch?'],
        ['Czy jest wolny stolik?', 'Ist ein Tisch frei?'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pl-poprosze',
      title: 'Höfliche Bitte: "poproszę" / "czy mógłby Pan…?"',
      formula: 'poproszę + Akkusativ · czy mógłby Pan + Infinitiv?',
      explanation:
        '"poproszę" für Bestellungen im Lokal und Laden, "czy mógłby Pan / mogłaby Pani" für Bitten an andere. Die Form richtet sich nach dem Geschlecht des Gegenübers.',
      examples: [
        ['Poproszę kawę.', 'Einen Kaffee, bitte.'],
        ['Czy mógłby Pan mi pomóc?', 'Könnten Sie mir helfen?'],
      ],
      week: 2,
      level: 'A1',
    },
  ],
};

const portuguese: SeedLanguage = {
  name: 'Portugiesisch',
  nativeName: 'Português',
  code: 'pt-PT',
  emoji: '🇵🇹',
  words: [
    ['ser', 'sein (dauerhaft)', 'Verb', 'Sou da Alemanha.', 'Ich bin aus Deutschland.'],
    ['estar', 'sein (Zustand/Ort)', 'Verb', 'Estou em casa.', 'Ich bin zu Hause.'],
    ['ter', 'haben', 'Verb', 'Tenho uma pergunta.', 'Ich habe eine Frage.'],
    ['fazer', 'machen, tun', 'Verb', 'O que fazes hoje?', 'Was machst du heute?'],
    ['ir', 'gehen, fahren', 'Verb', 'Vou para o trabalho.', 'Ich fahre zur Arbeit.'],
    ['poder', 'können, dürfen', 'Verb', 'Posso pagar com cartão?', 'Kann ich mit Karte zahlen?'],
    ['querer', 'wollen', 'Verb', 'Quero um café.', 'Ich möchte einen Kaffee.'],
    ['saber', 'wissen, können', 'Verb', 'Não sei onde fica.', 'Ich weiß nicht, wo das ist.'],
    ['dizer', 'sagen', 'Verb', 'Como se diz isto?', 'Wie sagt man das?'],
    ['ver', 'sehen', 'Verb', 'Não vejo nada.', 'Ich sehe nichts.'],
    ['dar', 'geben', 'Verb', 'Pode dar-me a conta?', 'Können Sie mir die Rechnung geben?'],
    ['vir', 'kommen', 'Verb', 'Venho de comboio.', 'Ich komme mit dem Zug.'],
    ['ficar', 'bleiben, liegen', 'Verb', 'Onde fica a estação?', 'Wo liegt der Bahnhof?'],
    ['precisar', 'brauchen', 'Verb', 'Preciso de ajuda.', 'Ich brauche Hilfe.'],
    ['gostar', 'mögen', 'Verb', 'Gosto de café.', 'Ich mag Kaffee.'],
    ['falar', 'sprechen', 'Verb', 'Falas alemão?', 'Sprichst du Deutsch?'],
    ['comer', 'essen', 'Verb', 'Como pão ao pequeno-almoço.', 'Ich esse Brot zum Frühstück.'],
    ['beber', 'trinken', 'Verb', 'Bebo água.', 'Ich trinke Wasser.'],
    ['morar', 'wohnen', 'Verb', 'Moro em Lisboa.', 'Ich wohne in Lissabon.'],
    ['trabalhar', 'arbeiten', 'Verb', 'Trabalho num escritório.', 'Ich arbeite in einem Büro.'],
    ['comprar', 'kaufen', 'Verb', 'Compro pão na padaria.', 'Ich kaufe Brot in der Bäckerei.'],
    ['pagar', 'zahlen', 'Verb', 'Quero pagar, por favor.', 'Ich möchte zahlen, bitte.'],
    ['esperar', 'warten', 'Verb', 'Espero pelo autocarro.', 'Ich warte auf den Bus.'],
    ['procurar', 'suchen', 'Verb', 'Procuro um hotel.', 'Ich suche ein Hotel.'],
    ['entender', 'verstehen', 'Verb', 'Não entendo.', 'Ich verstehe nicht.'],
    ['achar', 'meinen, finden', 'Verb', 'Acho que sim.', 'Ich glaube schon.'],
    ['sim', 'ja', 'Partikel', 'Sim, claro.', 'Ja, klar.'],
    ['não', 'nein, nicht', 'Partikel', 'Não, obrigado.', 'Nein, danke.'],
    ['por favor', 'bitte', 'Höflichkeit', 'A conta, por favor.', 'Die Rechnung, bitte.'],
    ['obrigado', 'danke', 'Höflichkeit', 'Muito obrigado!', 'Vielen Dank!'],
    ['desculpe', 'Entschuldigung', 'Höflichkeit', 'Desculpe, onde é a casa de banho?', 'Entschuldigung, wo ist die Toilette?'],
    ['bom dia', 'guten Morgen', 'Höflichkeit', 'Bom dia, como está?', 'Guten Morgen, wie geht es Ihnen?'],
    ['boa noite', 'gute Nacht', 'Höflichkeit', 'Boa noite e até amanhã.', 'Gute Nacht und bis morgen.'],
    ['adeus', 'auf Wiedersehen', 'Höflichkeit', 'Adeus, foi um prazer.', 'Auf Wiedersehen, es war mir eine Freude.'],
    ['onde', 'wo', 'Fragewort', 'Onde fica o hotel?', 'Wo ist das Hotel?'],
    ['quando', 'wann', 'Fragewort', 'Quando parte o comboio?', 'Wann fährt der Zug?'],
    ['quanto', 'wie viel', 'Fragewort', 'Quanto custa?', 'Was kostet das?'],
    ['porquê', 'warum', 'Fragewort', 'Porquê? Não percebo.', 'Warum? Ich verstehe nicht.'],
    ['como', 'wie', 'Fragewort', 'Como está?', 'Wie geht es Ihnen?'],
    ['quem', 'wer', 'Fragewort', 'Quem é aquele senhor?', 'Wer ist der Herr dort?'],
    ['o que', 'was', 'Fragewort', 'O que é isto?', 'Was ist das?'],
    ['qual', 'welcher', 'Fragewort', 'Qual comboio apanhamos?', 'Welchen Zug nehmen wir?'],
    ['água', 'Wasser', 'Nomen', 'Uma água, se faz favor.', 'Ein Wasser, bitte.'],
    ['café', 'Kaffee', 'Nomen', 'Um café sem açúcar.', 'Einen Kaffee ohne Zucker.'],
    ['pão', 'Brot', 'Nomen', 'O pão é fresco.', 'Das Brot ist frisch.'],
    ['casa', 'Haus', 'Nomen', 'Estou em casa.', 'Ich bin zu Hause.'],
    ['trabalho', 'Arbeit', 'Nomen', 'O trabalho é difícil.', 'Die Arbeit ist schwer.'],
    ['tempo', 'Zeit, Wetter', 'Nomen', 'Não tenho tempo.', 'Ich habe keine Zeit.'],
    ['dia', 'Tag', 'Nomen', 'Bom dia!', 'Guten Tag!'],
    ['comboio', 'Zug (in Portugal)', 'Nomen', 'O comboio parte às oito.', 'Der Zug fährt um acht.'],
    ['loja', 'Laden', 'Nomen', 'A loja está fechada.', 'Der Laden ist geschlossen.'],
    ['estação', 'Bahnhof', 'Nomen', 'A estação fica perto.', 'Der Bahnhof ist in der Nähe.'],
    ['hotel', 'Hotel', 'Nomen', 'Procuro um hotel barato.', 'Ich suche ein günstiges Hotel.'],
    ['bilhete', 'Fahrkarte', 'Nomen', 'Um bilhete para o Porto.', 'Eine Fahrkarte nach Porto.'],
    ['conta', 'Rechnung', 'Nomen', 'A conta, por favor.', 'Die Rechnung, bitte.'],
    ['quarto', 'Zimmer', 'Nomen', 'O quarto tem vista para o mar.', 'Das Zimmer hat Meerblick.'],
    ['comida', 'Essen', 'Nomen', 'A comida é muito boa.', 'Das Essen ist sehr gut.'],
    ['bom', 'gut', 'Adjektiv', 'Está muito bom.', 'Das ist sehr gut.'],
    ['grande', 'groß', 'Adjektiv', 'A casa é grande.', 'Das Haus ist groß.'],
    ['pequeno', 'klein', 'Adjektiv', 'É demasiado pequeno.', 'Das ist zu klein.'],
    ['caro', 'teuer', 'Adjektiv', 'É muito caro.', 'Das ist sehr teuer.'],
    ['agora', 'jetzt', 'Adverb', 'Agora não posso.', 'Jetzt kann ich nicht.'],
    ['hoje', 'heute', 'Adverb', 'Hoje trabalho até tarde.', 'Heute arbeite ich bis spät.'],
    ['amanhã', 'morgen', 'Adverb', 'Até amanhã!', 'Bis morgen!'],
    ['muito', 'sehr, viel', 'Adverb', 'Muito obrigado.', 'Vielen Dank.'],
    ['um pouco', 'ein bisschen', 'Adverb', 'Falo um pouco de português.', 'Ich spreche ein bisschen Portugiesisch.'],
    ['também', 'auch', 'Adverb', 'Eu também.', 'Ich auch.'],
  ],
  patterns: [
    {
      slug: 'pt-svo',
      title: 'Aussagesatz: Subjekt + Verb + Objekt',
      formula: '(Subjekt) + Verb + Objekt',
      explanation:
        'Das Subjektpronomen entfällt meist, die Verbendung trägt die Information. In Brasilien steht es häufiger als in Portugal.',
      examples: [
        ['Tenho uma pergunta.', 'Ich habe eine Frage.'],
        ['A Ana come pão.', 'Ana isst Brot.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pt-artigos',
      title: 'Artikel – auch vor Namen',
      formula: 'o · a · os · as — um · uma · uns · umas',
      explanation:
        'Nur zwei Geschlechter, dafür steht der Artikel auch vor Vornamen: "a Ana", "o Pedro". Das klingt für Deutsche zunächst falsch, ist aber die Norm.',
      examples: [
        ['O comboio está atrasado.', 'Der Zug hat Verspätung.'],
        ['A Ana mora no Porto.', 'Ana wohnt in Porto.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pt-plural',
      title: 'Plural der Nomen',
      formula: '-o → -os · -ão → -ões · -l → -is · -m → -ns',
      explanation:
        'Meist reicht ein -s. Besonders sind die Endungen: pão → pães, hotel → hotéis, homem → homens, lição → lições.',
      examples: [
        ['o hotel → os hotéis', 'das Hotel → die Hotels'],
        ['o pão → os pães', 'das Brot → die Brote'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pt-ser-estar',
      title: 'ser und estar',
      formula: 'ser = dauerhaft · estar = Zustand und Ort',
      explanation:
        '"Sou alemão" für das, was bleibt; "estou cansado" für den Moment. Bei Orten: Gebäude stehen mit "ficar" oder "ser", Personen mit "estar".',
      examples: [
        ['Sou alemão, mas estou em Lisboa.', 'Ich bin Deutscher, aber ich bin in Lissabon.'],
        ['A comida está fria.', 'Das Essen ist kalt.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pt-negacao',
      title: 'Verneinung mit "não"',
      formula: '(Subjekt) + não + Verb',
      explanation:
        '"não" steht direkt vor dem Verb – und dient zugleich als "nein". Die doppelte Verneinung ist korrekt: "Não tenho nada."',
      examples: [
        ['Não entendo.', 'Ich verstehe nicht.'],
        ['Não tenho nada.', 'Ich habe nichts.'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pt-pergunta',
      title: 'Frage durch Intonation',
      formula: 'Verb + ... ?',
      explanation:
        'Die Wortstellung bleibt gleich, nur die Stimme geht hoch. Ein Fragezeichen am Anfang wie im Spanischen gibt es nicht.',
      examples: [
        ['Falas alemão?', 'Sprichst du Deutsch?'],
        ['Tens tempo?', 'Hast du Zeit?'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pt-interrogativos',
      title: 'Fragewörter',
      formula: 'onde · quando · como · quanto · porquê · quem · o que',
      explanation:
        'Häufig mit "é que" dazwischen, das nichts bedeutet, aber die Wortstellung rettet: "Onde é que fica a estação?"',
      examples: [
        ['Onde é que fica a estação?', 'Wo ist der Bahnhof?'],
        ['Quanto custa o bilhete?', 'Was kostet die Fahrkarte?'],
      ],
      week: 1,
      level: 'A1',
    },
    {
      slug: 'pt-presente',
      title: 'Präsens der drei Konjugationen',
      formula: '-ar: -o -as -a -amos -am · -er: -o -es -e -emos -em · -ir: -o -es -e -imos -em',
      explanation:
        'Drei Muster decken fast alles ab. Die Form für "vós" ist ausgestorben; im Alltag braucht man fünf Formen, in Brasilien sogar nur vier.',
      examples: [
        ['Falo português, como pão, parto amanhã.', 'Ich spreche Portugiesisch, esse Brot, fahre morgen ab.'],
        ['Trabalhamos até às seis.', 'Wir arbeiten bis sechs.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'pt-modais',
      title: 'poder, dever, querer',
      formula: 'posso / devo / quero + Infinitiv',
      explanation:
        'Nach dem Modalverb folgt der Infinitiv ohne Präposition. "ter de" heißt müssen im Sinne von Zwang: "Tenho de ir."',
      examples: [
        ['Posso pagar com cartão?', 'Kann ich mit Karte zahlen?'],
        ['Tenho de ir agora.', 'Ich muss jetzt gehen.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'pt-gostar-de',
      title: 'gostar de',
      formula: 'gostar + de + Nomen/Infinitiv',
      explanation:
        'Anders als im Italienischen oder Spanischen bleibt das Subjekt bei der Person – aber das "de" ist Pflicht: "Gosto de café", nie "gosto café".',
      examples: [
        ['Gosto de café sem açúcar.', 'Ich mag Kaffee ohne Zucker.'],
        ['Gostas de viajar?', 'Reist du gern?'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'pt-ha',
      title: 'há – es gibt',
      formula: 'há + Singular oder Plural',
      explanation:
        'Eine Form für beides, anders als im Italienischen. "há" heißt außerdem "vor" bei Zeitangaben: "há dois dias".',
      examples: [
        ['Há um multibanco aqui perto?', 'Gibt es hier in der Nähe einen Geldautomaten?'],
        ['Cheguei há dois dias.', 'Ich bin vor zwei Tagen angekommen.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'pt-contracoes',
      title: 'Präposition und Artikel verschmelzen',
      formula: 'de+o=do · em+o=no · a+o=ao · por+o=pelo',
      explanation:
        'Fast jede Präposition zieht den Artikel an sich: "no hotel", "do Porto", "ao trabalho". Auch mit "um": em+um=num.',
      examples: [
        ['Vou ao trabalho de comboio.', 'Ich fahre mit dem Zug zur Arbeit.'],
        ['A chave está na mala.', 'Der Schlüssel ist in der Tasche.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'pt-possessivos',
      title: 'Possessivpronomen mit Artikel',
      formula: 'o meu · a minha · os meus · as minhas',
      explanation:
        'In Portugal steht der Artikel dabei: "o meu carro". In Brasilien fällt er meist weg. Beides ist richtig, nur nicht gemischt.',
      examples: [
        ['Esta é a minha mala.', 'Das ist mein Koffer.'],
        ['O meu irmão mora em Faro.', 'Mein Bruder wohnt in Faro.'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'pt-queria',
      title: 'Höfliche Bitte: "queria" / "podia…?"',
      formula: 'queria + Nomen/Infinitiv · podia + Infinitiv?',
      explanation:
        'Statt "quero" nimmt man im Laden und Lokal "queria" – wörtlich "ich wollte". "Se faz favor" ist die portugiesische Form von "por favor".',
      examples: [
        ['Queria um café, se faz favor.', 'Ich hätte gern einen Kaffee, bitte.'],
        ['Podia ajudar-me?', 'Könnten Sie mir helfen?'],
      ],
      week: 2,
      level: 'A1',
    },
    {
      slug: 'pt-preterito-perfeito',
      title: 'Pretérito perfeito simples',
      formula: '-ei -aste -ou -ámos -aram · fui, tive, fiz',
      explanation:
        'Die normale Vergangenheit – anders als im Italienischen oder Französischen eine einfache Form, kein Hilfsverb. "Ontem comi peixe."',
      examples: [
        ['Ontem comi peixe.', 'Gestern habe ich Fisch gegessen.'],
        ['Fui ao mercado de manhã.', 'Ich bin morgens zum Markt gegangen.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'pt-imperfeito',
      title: 'Pretérito imperfeito',
      formula: '-ava, -ia · era, tinha, fazia',
      explanation:
        'Für Zustände, Gewohnheiten und Beschreibungen: wie es war, was man immer tat. "Quando era pequeno, morava no campo."',
      examples: [
        ['Quando era pequeno, morava no campo.', 'Als ich klein war, wohnte ich auf dem Land.'],
        ['Estava frio e não havia ninguém.', 'Es war kalt und niemand war da.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'pt-perfeito-vs-imperfeito',
      title: 'Perfeito oder Imperfeito?',
      formula: 'perfeito = was geschah · imperfeito = wie es war',
      explanation:
        'Das Perfeito erzählt abgeschlossene Ereignisse, das Imperfeito den Rahmen. Oft im selben Satz: "Enquanto dormia, o telefone tocou."',
      examples: [
        ['Enquanto dormia, o telefone tocou.', 'Während ich schlief, klingelte das Telefon.'],
        ['Ontem vi um filme que era muito bom.', 'Gestern sah ich einen Film, der sehr gut war.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'pt-reflexivos',
      title: 'Reflexive Verben',
      formula: 'levantar-se · chamar-se · lembrar-se de',
      explanation:
        'Im Aussagesatz hängt das Pronomen hinten an: "Chamo-me Ana." Nach Verneinung oder Fragewort rutscht es nach vorn: "Não me chamo Ana."',
      examples: [
        ['Chamo-me Pedro e levanto-me às sete.', 'Ich heiße Pedro und stehe um sieben auf.'],
        ['Não me lembro do nome.', 'Ich erinnere mich nicht an den Namen.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'pt-pronomes-objeto',
      title: 'Objektpronomen und ihre Stellung',
      formula: 'Aussage: Verb-o · nach não/Fragewort: o + Verb',
      explanation:
        'Die portugiesische Eigenheit: Normalerweise hängt das Pronomen mit Bindestrich hinten an ("Vejo-o"), aber Verneinung, Fragewörter und bestimmte Wörter ziehen es nach vorn ("Não o vejo").',
      examples: [
        ['Vejo-a todos os dias.', 'Ich sehe sie jeden Tag.'],
        ['Não o conheço.', 'Ich kenne ihn nicht.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'pt-ir-infinitivo',
      title: 'Zukunft mit "ir" + Infinitiv',
      formula: 'vou / vais / vai + Infinitiv',
      explanation:
        'Der Alltagsweg in die Zukunft: "Vou partir amanhã." Das echte Futur (partirei) klingt schriftlich und wird selten gesprochen.',
      examples: [
        ['Vou partir amanhã de manhã.', 'Ich fahre morgen früh ab.'],
        ['Vai chover esta tarde.', 'Heute Nachmittag wird es regnen.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'pt-imperativo',
      title: 'Imperativ und höfliche Aufforderung',
      formula: 'tu: fala! · você/o senhor: fale!',
      explanation:
        'Für Wegbeschreibungen und Bitten. Die höfliche Form ist die Konjunktivform: "Siga em frente", "Desculpe".',
      examples: [
        ['Siga em frente e vire à direita.', 'Gehen Sie geradeaus und biegen Sie rechts ab.'],
        ['Não te preocupes.', 'Mach dir keine Sorgen.'],
      ],
      week: 3,
      level: 'A2',
    },
    {
      slug: 'pt-estar-a-infinitivo',
      title: 'estar a + Infinitiv',
      formula: 'estou a fazer (PT) · estou fazendo (BR)',
      explanation:
        'Was gerade passiert. In Portugal mit "a" plus Infinitiv, in Brasilien mit dem Gerúndio – der auffälligste Unterschied zwischen beiden Varianten.',
      examples: [
        ['Estou a procurar a estação.', 'Ich suche gerade den Bahnhof.'],
        ['O que estás a fazer?', 'Was machst du gerade?'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'pt-comparativo',
      title: 'Vergleichen',
      formula: 'mais/menos … do que · tão … como · o mais …',
      explanation:
        '"mais caro do que" – das "do" gehört dazu. Unregelmäßig: bom → melhor, mau → pior, grande → maior.',
      examples: [
        ['O comboio é mais rápido do que o carro.', 'Der Zug ist schneller als das Auto.'],
        ['Este é o melhor restaurante da cidade.', 'Das ist das beste Restaurant der Stadt.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'pt-relativas-que',
      title: 'Relativsatz mit que und onde',
      formula: 'que = der/die/das · onde = wo',
      explanation:
        '"que" gilt für Personen und Sachen. Nach Präposition steht "quem" bei Personen: "a pessoa com quem falei".',
      examples: [
        ['O livro que estou a ler é português.', 'Das Buch, das ich lese, ist portugiesisch.'],
        ['A cidade onde moro é pequena.', 'Die Stadt, in der ich wohne, ist klein.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'pt-demonstrativos',
      title: 'este, esse, aquele',
      formula: 'este = bei mir · esse = bei dir · aquele = weit weg',
      explanation:
        'Drei Stufen statt zwei wie im Deutschen. Dazu die verschmolzenen Formen: neste, nesse, naquele.',
      examples: [
        ['Este bilhete é meu, esse é teu.', 'Diese Fahrkarte ist meine, die da ist deine.'],
        ['Naquele tempo não havia comboios.', 'Damals gab es keine Züge.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'pt-adverbios',
      title: 'Adverbien und Zeitangaben',
      formula: 'Adjektiv (weiblich) + -mente · já, ainda, sempre, nunca',
      explanation:
        'lenta → lentamente. Bei zwei Adverbien bekommt nur das letzte die Endung: "falou clara e lentamente".',
      examples: [
        ['Fala muito depressa.', 'Er spricht sehr schnell.'],
        ['Ainda não recebi a resposta.', 'Ich habe die Antwort noch nicht bekommen.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'pt-conectores',
      title: 'Sätze verbinden',
      formula: 'porque · portanto · mas · embora · enquanto',
      explanation:
        'porque (weil), portanto (also), mas (aber), enquanto (während). "embora" verlangt den Konjunktiv und kommt erst auf B1.',
      examples: [
        ['Não saio porque está a chover.', 'Ich gehe nicht raus, weil es regnet.'],
        ['É tarde, portanto vou apanhar um táxi.', 'Es ist spät, also nehme ich ein Taxi.'],
      ],
      week: 4,
      level: 'A2',
    },
    {
      slug: 'pt-condicional',
      title: 'Condicional',
      formula: '-ia, -ias, -ia · seria, teria, faria',
      explanation:
        'Für Höflichkeit, Vermutung und Hypothesen: "Gostaria de reservar", "Seria melhor assim". Umgangssprachlich ersetzt oft das Imperfeito.',
      examples: [
        ['Gostaria de reservar uma mesa.', 'Ich würde gern einen Tisch reservieren.'],
        ['Seria melhor partir cedo.', 'Es wäre besser, früh loszufahren.'],
      ],
      week: 1,
      level: 'B1',
    },
    {
      slug: 'pt-conjuntivo-presente',
      title: 'Conjuntivo presente',
      formula: 'espero que · é melhor que · talvez + seja, tenha, faça',
      explanation:
        'Nach Wunsch, Zweifel und Notwendigkeit. Die Endungen tauschen: -ar-Verben bekommen -e, -er/-ir-Verben bekommen -a.',
      examples: [
        ['Espero que esteja tudo bem.', 'Ich hoffe, es ist alles in Ordnung.'],
        ['É melhor que vás agora.', 'Es ist besser, wenn du jetzt gehst.'],
      ],
      week: 1,
      level: 'B1',
    },
    {
      slug: 'pt-futuro-conjuntivo',
      title: 'Futuro do conjuntivo',
      formula: 'quando / se / assim que + for, tiver, fizer',
      explanation:
        'Eine portugiesische Besonderheit, die es im Spanischen und Italienischen so nicht gibt: Nach "quando", "se" und "assim que" steht für Zukünftiges dieser eigene Modus – "Quando chegares, liga-me."',
      examples: [
        ['Quando chegares, liga-me.', 'Wenn du ankommst, ruf mich an.'],
        ['Se tiveres tempo, passa por cá.', 'Wenn du Zeit hast, komm vorbei.'],
      ],
      week: 1,
      level: 'B1',
    },
    {
      slug: 'pt-infinitivo-pessoal',
      title: 'Persönlicher Infinitiv',
      formula: 'para eu fazer · antes de partirmos',
      explanation:
        'Die zweite portugiesische Eigenheit: Der Infinitiv wird konjugiert, wenn er ein eigenes Subjekt hat. "É melhor saíres" statt eines Nebensatzes.',
      examples: [
        ['É melhor saíres agora.', 'Es ist besser, wenn du jetzt gehst.'],
        ['Antes de partirmos, fecha as janelas.', 'Bevor wir losfahren, schließ die Fenster.'],
      ],
      week: 2,
      level: 'B1',
    },
    {
      slug: 'pt-se-real',
      title: 'Bedingungssatz: der reale Fall',
      formula: 'Se + Futuro do conjuntivo, Präsens/Futur',
      explanation:
        'Anders als in den Nachbarsprachen: "Se puderes, vem." Im se-Teil steht der Futuro do conjuntivo, nicht das Präsens.',
      examples: [
        ['Se puderes, vem ter comigo.', 'Wenn du kannst, komm zu mir.'],
        ['Se chover, ficamos em casa.', 'Wenn es regnet, bleiben wir zu Hause.'],
      ],
      week: 2,
      level: 'B1',
    },
    {
      slug: 'pt-mais-que-perfeito',
      title: 'Mais-que-perfeito composto',
      formula: 'tinha + Partizip',
      explanation:
        'Das Davor in der Vergangenheit: "Quando cheguei, ele já tinha saído." Die einfache Form (saíra) ist rein literarisch.',
      examples: [
        ['Quando cheguei, ele já tinha saído.', 'Als ich ankam, war er schon weg.'],
        ['Não sabia que tinhas ligado.', 'Ich wusste nicht, dass du angerufen hattest.'],
      ],
      week: 2,
      level: 'B1',
    },
    {
      slug: 'pt-pronomes-combinados',
      title: 'Kombinierte Pronomen',
      formula: 'mo · to · lho · no-lo',
      explanation:
        'Treffen zwei Pronomen zusammen, verschmelzen sie: me+o wird "mo", lhe+o wird "lho". Im gesprochenen Alltag weicht man oft auf "a ele" aus.',
      examples: [
        ['Ele deu-mo ontem.', 'Er hat es mir gestern gegeben.'],
        ['Digo-lho amanhã.', 'Ich sage es ihm morgen.'],
      ],
      week: 2,
      level: 'B1',
    },
    {
      slug: 'pt-se-impessoal',
      title: 'se impessoal und Passiv',
      formula: 'vende-se · ser + Partizip',
      explanation:
        'Das deutsche "man": "Aqui fala-se inglês." Steht ein Plural dahinter, geht das Verb mit: "Vendem-se casas."',
      examples: [
        ['Aqui fala-se inglês.', 'Hier wird Englisch gesprochen.'],
        ['A carta foi escrita pelo Pedro.', 'Der Brief wurde von Pedro geschrieben.'],
      ],
      week: 3,
      level: 'B1',
    },
    {
      slug: 'pt-discurso-indireto',
      title: 'Indirekte Rede',
      formula: 'disse que + Zeitverschiebung',
      explanation:
        'Beim Berichten rutschen die Zeiten zurück: Präsens wird Imperfeito, Perfeito wird Mais-que-perfeito, Futur wird Condicional.',
      examples: [
        ['Disse que estava cansado.', 'Er sagte, er sei müde.'],
        ['Perguntou se eu tinha tempo.', 'Sie fragte, ob ich Zeit hätte.'],
      ],
      week: 3,
      level: 'B1',
    },
    {
      slug: 'pt-verbos-preposicoes',
      title: 'Verb plus Präposition',
      formula: 'precisar de · gostar de · começar a · pensar em',
      explanation:
        'Welche Präposition ein Verb verlangt, muss man mitlernen. Besonders tückisch: "precisar de" und "gostar de" – ohne "de" ist es falsch.',
      examples: [
        ['Preciso de falar contigo.', 'Ich muss mit dir sprechen.'],
        ['Começou a chover de repente.', 'Es fing plötzlich an zu regnen.'],
      ],
      week: 3,
      level: 'B1',
    },
    {
      slug: 'pt-relativas-cujo',
      title: 'Relativsätze mit cujo und o qual',
      formula: 'cujo/cuja + Nomen · o qual',
      explanation:
        '"cujo" richtet sich nach dem Besitz, nicht nach dem Besitzer: "o homem cuja filha…". "o qual" ist die formellere Variante von "que".',
      examples: [
        ['O colega com quem trabalho é alemão.', 'Der Kollege, mit dem ich arbeite, ist Deutscher.'],
        ['A empresa cujos empregados fizeram greve.', 'Die Firma, deren Angestellte gestreikt haben.'],
      ],
      week: 4,
      level: 'B1',
    },
    {
      slug: 'pt-conectores-b1',
      title: 'Argumentieren: além disso, no entanto, uma vez que',
      formula: 'além disso · no entanto · uma vez que · por isso',
      explanation:
        'Über "mas" und "porque" hinaus: "uma vez que" leitet den Grund ein, "por isso" die Folge, "no entanto" den Einwand.',
      examples: [
        ['Uma vez que estava a chover, ficámos em casa.', 'Da es regnete, blieben wir zu Hause.'],
        ['É caro; no entanto, vale a pena.', 'Es ist teuer; dennoch lohnt es sich.'],
      ],
      week: 4,
      level: 'B1',
    },
    {
      slug: 'pt-aspeto',
      title: 'estar prestes a, continuar a, deixar de',
      formula: 'estar prestes a · continuar a · deixar de + Infinitiv',
      explanation:
        'Feinheiten des Ablaufs: "estou prestes a sair" – ich gehe gleich; "deixei de fumar" – ich habe aufgehört zu rauchen.',
      examples: [
        ['Estou prestes a sair.', 'Ich gehe gleich los.'],
        ['Deixei de fumar no ano passado.', 'Ich habe letztes Jahr aufgehört zu rauchen.'],
      ],
      week: 4,
      level: 'B1',
    },
    {
      slug: 'pt-conjuntivo-imperfeito',
      title: 'Conjuntivo imperfeito',
      formula: 'fosse, tivesse, fizesse · pensava que …',
      explanation:
        'Steht der Hauptsatz in der Vergangenheit oder im Condicional, folgt der Conjuntivo imperfeito: "Pensava que fosse mais fácil."',
      examples: [
        ['Pensava que fosse mais fácil.', 'Ich dachte, es wäre leichter.'],
        ['Queria que viesses comigo.', 'Ich wollte, dass du mitkommst.'],
      ],
      week: 1,
      level: 'B2',
    },
    {
      slug: 'pt-se-irreal',
      title: 'Bedingungssatz: der irreale Fall',
      formula: 'Se + Conjuntivo imperfeito, Condicional',
      explanation:
        'Was möglich, aber unwahrscheinlich ist: "Se tivesse tempo, ia contigo." Umgangssprachlich steht im Hauptsatz oft das Imperfeito statt des Condicional.',
      examples: [
        ['Se tivesse tempo, ia contigo.', 'Wenn ich Zeit hätte, käme ich mit.'],
        ['Se eu fosse a ti, não fazia isso.', 'An deiner Stelle würde ich das nicht tun.'],
      ],
      week: 1,
      level: 'B2',
    },
    {
      slug: 'pt-se-impossivel',
      title: 'Bedingungssatz: die verpasste Möglichkeit',
      formula: 'Se + tivesse + Partizip, teria + Partizip',
      explanation:
        'Was nicht mehr zu ändern ist: "Se tivesse sabido, teria vindo." Der Satz des Bedauerns.',
      examples: [
        ['Se tivesse sabido, teria vindo.', 'Hätte ich es gewusst, wäre ich gekommen.'],
        ['Se tivéssemos partido antes, não teríamos perdido o comboio.', 'Wären wir früher losgefahren, hätten wir den Zug nicht verpasst.'],
      ],
      week: 1,
      level: 'B2',
    },
    {
      slug: 'pt-concordancia-tempos',
      title: 'Zeitenfolge im Conjuntivo',
      formula: 'Gegenwart → presente · Vergangenheit → imperfeito',
      explanation:
        'Die Zeit im Nebensatz richtet sich nach dem Hauptsatz: "Espero que venha" gegenüber "Esperava que viesse".',
      examples: [
        ['Espero que ele tenha razão.', 'Ich hoffe, er hat recht.'],
        ['Esperava que ele tivesse razão.', 'Ich hoffte, er hätte recht.'],
      ],
      week: 2,
      level: 'B2',
    },
    {
      slug: 'pt-colocacao-pronomes',
      title: 'Pronomenstellung im Detail',
      formula: 'ênclise · próclise · mesóclise',
      explanation:
        'Portugal hängt an ("dei-lhe"), zieht aber nach Verneinung, Fragewörtern, Adverbien wie "já" und "só" sowie in Nebensätzen vor ("já lhe dei"). Im Futur schiebt sich das Pronomen sogar hinein: "dar-lhe-ei".',
      examples: [
        ['Já lhe dei o livro.', 'Ich habe ihm das Buch schon gegeben.'],
        ['Dir-te-ei a verdade.', 'Ich werde dir die Wahrheit sagen.'],
      ],
      week: 2,
      level: 'B2',
    },
    {
      slug: 'pt-subordinadas-reduzidas',
      title: 'Verkürzte Nebensätze',
      formula: 'antes de + Inf. · depois de ter + Partizip · ao chegar',
      explanation:
        'Der persönliche Infinitiv macht Verkürzungen besonders elegant: "Depois de termos comido, saímos."',
      examples: [
        ['Depois de termos comido, saímos.', 'Nachdem wir gegessen hatten, gingen wir raus.'],
        ['Ao chegar a casa, liguei-te.', 'Als ich nach Hause kam, habe ich dich angerufen.'],
      ],
      week: 2,
      level: 'B2',
    },
    {
      slug: 'pt-voz-passiva-avancada',
      title: 'Passiv und seine Alternativen',
      formula: 'ser + Partizip · estar + Partizip · se passivante',
      explanation:
        '"foi fechado" beschreibt die Handlung, "está fechado" das Ergebnis. In Vorschriften steht oft das se-Passiv: "Não se admitem devoluções."',
      examples: [
        ['A loja foi fechada às oito.', 'Der Laden wurde um acht geschlossen.'],
        ['A loja está fechada.', 'Der Laden ist geschlossen.'],
      ],
      week: 3,
      level: 'B2',
    },
    {
      slug: 'pt-conectores-b2',
      title: 'Formelle Konnektoren',
      formula: 'embora · a fim de que · desde que · caso · ainda que',
      explanation:
        'Für Schriftliches und formelle Gespräche. Fast alle verlangen den Conjuntivo: "desde que estejas de acordo", "caso seja necessário".',
      examples: [
        ['Vou, desde que estejas de acordo.', 'Ich gehe, sofern du einverstanden bist.'],
        ['Embora fosse tarde, continuaram.', 'Obwohl es spät war, machten sie weiter.'],
      ],
      week: 3,
      level: 'B2',
    },
    {
      slug: 'pt-nuances-modais',
      title: 'Modalverben mit Nuance',
      formula: 'deveria · poderia ser · devia ter feito',
      explanation:
        'Im Condicional drücken Modalverben Vermutung und Vorwurf aus: "Devia ter-me dito" – du hättest es mir sagen sollen.',
      examples: [
        ['O comboio deve chegar às oito.', 'Der Zug müsste um acht ankommen.'],
        ['Devias ter-me dito antes.', 'Du hättest es mir früher sagen sollen.'],
      ],
      week: 3,
      level: 'B2',
    },
    {
      slug: 'pt-marcadores',
      title: 'Diskursmarker: pois, então, se calhar, lá',
      formula: 'pois · então · se calhar · pronto · lá',
      explanation:
        'Die kleinen Wörter des Alltags. "pois" bestätigt, "se calhar" heißt vielleicht, "pronto" schließt einen Gedanken ab. Brasilien nimmt stattdessen "né", "tipo", "talvez".',
      examples: [
        ['Se calhar não vem.', 'Vielleicht kommt er nicht.'],
        ['Pronto, está resolvido.', 'Gut, das wäre geklärt.'],
      ],
      week: 4,
      level: 'B2',
    },
    {
      slug: 'pt-registo',
      title: 'Register und Anrede',
      formula: 'tu · você · o senhor / a senhora',
      explanation:
        'Portugal duzt mit "tu" und siezt mit "o senhor"; "você" liegt dazwischen und kann unhöflich wirken. In Brasilien ist "você" die Normalform.',
      examples: [
        ['O senhor importa-se de esperar?', 'Würde es Ihnen etwas ausmachen zu warten?'],
        ['Apetece-te um café?', 'Hast du Lust auf einen Kaffee?'],
      ],
      week: 4,
      level: 'B2',
    },
    {
      slug: 'pt-nominalizacao',
      title: 'Nominalstil der Zeitungssprache',
      formula: 'o aumento dos preços · na sequência de · relativamente a',
      explanation:
        'Zeitungen und Behörden verwandeln Verben in Nomen: nicht "os preços aumentaram", sondern "o aumento dos preços".',
      examples: [
        ['O aumento dos preços preocupa as famílias.', 'Der Preisanstieg beunruhigt die Familien.'],
        ['Na sequência da greve, os comboios foram cancelados.', 'Infolge des Streiks wurden die Züge gestrichen.'],
      ],
      week: 4,
      level: 'B2',
    },
    {
      slug: 'pt-pt-vs-br',
      title: 'Portugal und Brasilien unterscheiden',
      formula: 'estar a fazer / estar fazendo · comboio / trem · tu / você',
      explanation:
        'Beide Varianten sind richtig, nur nicht gemischt. Die vier auffälligsten Unterschiede: Verlaufsform, Anrede, Pronomenstellung und ein paar Alltagswörter.',
      examples: [
        ['Estou a comer. / Estou comendo.', 'Ich esse gerade. (PT / BR)'],
        ['Apanhar o comboio. / Pegar o trem.', 'Den Zug nehmen. (PT / BR)'],
      ],
      week: 4,
      level: 'B2',
    },
  ],
};

export const SEED_LANGUAGES: SeedLanguage[] = [spanish, italian, french, polish, portuguese];

export function findSeed(name: string): SeedLanguage | undefined {
  return SEED_LANGUAGES.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
}

/** Vorschläge im "+ Sprache"-Dialog, für die es (noch) kein Startpaket gibt. */
export const SUGGESTIONS = [
  'Niederländisch',
  'Schwedisch',
  'Türkisch',
  'Japanisch',
  'Koreanisch',
  'Arabisch',
  'Griechisch',
  'Tschechisch',
];
