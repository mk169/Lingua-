/**
 * Startpakete. Sie decken die ersten Tage ab; darüber hinaus erweitert der
 * Wortschatz-Generator (LLM) das Deck Frequenzband für Frequenzband.
 *
 * Kompaktformat je Wort: [Wort, Übersetzung, Wortart, Beispielsatz, Übersetzung]
 */

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
    },
  ],
};

export const SEED_LANGUAGES: SeedLanguage[] = [spanish, italian, french, polish];

export function findSeed(name: string): SeedLanguage | undefined {
  return SEED_LANGUAGES.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
}

/** Vorschläge im "+ Sprache"-Dialog, für die es (noch) kein Startpaket gibt. */
export const SUGGESTIONS = [
  'Portugiesisch',
  'Niederländisch',
  'Schwedisch',
  'Türkisch',
  'Japanisch',
  'Koreanisch',
  'Arabisch',
  'Griechisch',
  'Tschechisch',
];
