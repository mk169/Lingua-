import Anthropic from '@anthropic-ai/sdk';
import type { Analysis, Card, GrammarPattern, Language, Settings } from '../types';

/**
 * Anbindung an die Claude Messages API.
 *
 * Hinweis zum Browser-Betrieb: Der Schlüssel liegt ausschließlich im
 * localStorage des Nutzers und wird direkt an api.anthropic.com geschickt.
 * `dangerouslyAllowBrowser` ist dafür erforderlich. Für einen Mehrbenutzer-
 * Betrieb gehört der Schlüssel hinter ein eigenes Backend.
 */
export const DEFAULT_MODEL = 'claude-opus-5';

export class MissingKeyError extends Error {
  constructor() {
    super('Kein API-Schlüssel hinterlegt. Bitte unter Einstellungen eintragen.');
    this.name = 'MissingKeyError';
  }
}

function client(settings: Settings): Anthropic {
  if (!settings.apiKey) throw new MissingKeyError();
  return new Anthropic({
    apiKey: settings.apiKey,
    dangerouslyAllowBrowser: true,
  });
}

function describeError(err: unknown): string {
  if (err instanceof MissingKeyError) return err.message;
  if (err instanceof Anthropic.AuthenticationError)
    return 'API-Schlüssel ungültig. Bitte in den Einstellungen prüfen.';
  if (err instanceof Anthropic.RateLimitError)
    return 'Rate-Limit erreicht. Bitte kurz warten und erneut versuchen.';
  if (err instanceof Anthropic.APIConnectionError)
    return 'Keine Verbindung zur API. Netzwerk prüfen.';
  if (err instanceof Anthropic.APIError) return `API-Fehler ${err.status}: ${err.message}`;
  return err instanceof Error ? err.message : 'Unbekannter Fehler.';
}

export function llmError(err: unknown): Error {
  return new Error(describeError(err));
}

type JsonSchema = Record<string, unknown>;

/** Ein Aufruf mit erzwungenem JSON-Schema. Liefert das geparste Objekt. */
async function callJSON<T>(
  settings: Settings,
  opts: {
    system: string;
    user: string;
    schema: JsonSchema;
    effort?: 'low' | 'medium' | 'high';
    maxTokens?: number;
  },
): Promise<T> {
  const anthropic = client(settings);
  try {
    const response = await anthropic.messages.create({
      model: settings.model || DEFAULT_MODEL,
      max_tokens: opts.maxTokens ?? 16000,
      system: opts.system,
      output_config: {
        effort: opts.effort ?? settings.effort ?? 'medium',
        format: { type: 'json_schema', schema: opts.schema },
      },
      messages: [{ role: 'user', content: opts.user }],
    });

    if (response.stop_reason === 'refusal') {
      throw new Error('Die Anfrage wurde abgelehnt. Bitte anders formulieren.');
    }
    const text = response.content.find((b) => b.type === 'text');
    if (!text || text.type !== 'text') throw new Error('Leere Antwort vom Modell.');
    return JSON.parse(text.text) as T;
  } catch (err) {
    throw llmError(err);
  }
}

const obj = (props: Record<string, unknown>, required: string[]): JsonSchema => ({
  type: 'object',
  properties: props,
  required,
  additionalProperties: false,
});

const str = (description: string) => ({ type: 'string', description });

// ── Prompts ────────────────────────────────────────────────────────────────

function langContext(lang: Language, native: string): string {
  return `Zielsprache: ${lang.name} (${lang.nativeName}, ${lang.code}). Muttersprache des Lernenden: ${native}.`;
}

const TUTOR_SYSTEM = `Du bist ein erfahrener Sprachlehrer und Lehrbuchautor. Du arbeitest nach dem Prinzip "Sprachskelett": zuerst das tragende Grammatikgerüst und Hochfrequenz-Funktionswörter, dann Fleisch aus Wortschatz und Idiomen.

Grundsätze:
- Alltagstauglichkeit vor Vollständigkeit. Beispiele stammen aus realen Situationen (Café, Bahnhof, Wohnung, Arbeit, Termine, Small Talk).
- Frequenz vor Exotik. Ein Wort ist nur dann relevant, wenn es in den ersten 1000 Wörtern der Sprache vorkommt.
- Beispielsätze sind kurz (5–12 Wörter), natürlich und sofort verwendbar.
- Keine Umschrift, keine Lautschrift, außer sie ist für die Sprache wirklich nötig.
- Antworte ausschließlich im geforderten JSON-Format.`;

// ── Vokabel-Generierung ────────────────────────────────────────────────────

export interface GeneratedWord {
  term: string;
  translation: string;
  pos: string;
  example: string;
  exampleTranslation: string;
  tags: string[];
}

const wordSchema: JsonSchema = obj(
  {
    words: {
      type: 'array',
      description: 'Die generierten Vokabeln, nach Frequenz absteigend sortiert.',
      items: obj(
        {
          term: str('Das Wort in der Zielsprache, mit Artikel falls sinnvoll.'),
          translation: str('Deutsche Übersetzung, knapp.'),
          pos: str('Wortart: Nomen, Verb, Adjektiv, Adverb, Präposition, Konjunktion, Pronomen, Fragewort, Phrase.'),
          example: str('Kurzer Alltagssatz in der Zielsprache, der das Wort enthält.'),
          exampleTranslation: str('Deutsche Übersetzung des Beispielsatzes.'),
          tags: { type: 'array', items: { type: 'string' }, description: 'Themen-Tags, z.B. Alltag, Reise, Zeit.' },
        },
        ['term', 'translation', 'pos', 'example', 'exampleTranslation', 'tags'],
      ),
    },
  },
  ['words'],
);

/** Erzeugt die nächste Charge Vokabeln nach Frequenzband. */
export async function generateVocab(
  settings: Settings,
  lang: Language,
  count: number,
  existing: string[],
  band: number, // 0 = die allerhäufigsten, 1 = nächste Stufe, ...
): Promise<GeneratedWord[]> {
  const skip = existing.slice(-400).join(', ');
  const res = await callJSON<{ words: GeneratedWord[] }>(settings, {
    system: TUTOR_SYSTEM,
    user: `${langContext(lang, settings.nativeLanguage)}

Erzeuge die nächsten ${count} wichtigsten Wörter für einen Anfänger, Frequenzband ${band + 1} (Band 1 = Rang 1–100, Band 2 = Rang 101–200, usw.).

Priorisiere in dieser Reihenfolge: Funktionswörter (Pronomen, Präpositionen, Konjunktionen, Fragewörter, Negation), Hilfs- und Modalverben, hochfrequente Vollverben, Alltagsnomen, Basisadjektive, feste Satzbausteine.

Diese Wörter sind bereits im Deck und dürfen NICHT wiederholt werden:
${skip || '(noch keine)'}`,
    schema: wordSchema,
    effort: 'low',
    maxTokens: 16000,
  });
  return res.words ?? [];
}

/** Neue Alltagssätze zu einer bestehenden Karte – das LLM im Karteikarten-Modul. */
export async function generateSentences(
  settings: Settings,
  lang: Language,
  card: Card,
  count: number,
  context?: string,
): Promise<{ target: string; native: string }[]> {
  const res = await callJSON<{ sentences: { target: string; native: string }[] }>(settings, {
    system: TUTOR_SYSTEM,
    user: `${langContext(lang, settings.nativeLanguage)}

Erzeuge ${count} neue, unterschiedliche Beispielsätze mit dem Wort "${card.term}" (${card.translation}).
${context ? `Zielort / Kontext des Lernenden: ${context}. Beziehe die Sätze auf diesen Kontext.` : 'Kontext: Alltagssituationen.'}
Variiere Zeitform und Satzart (Aussage, Frage, Verneinung). Jeder Satz maximal 12 Wörter.
Bereits bekannte Sätze, nicht wiederholen: ${[card.example, ...card.extraExamples.map((e) => e.target)].filter(Boolean).join(' | ') || '(keine)'}`,
    schema: obj(
      {
        sentences: {
          type: 'array',
          items: obj(
            { target: str('Satz in der Zielsprache.'), native: str('Deutsche Übersetzung.') },
            ['target', 'native'],
          ),
        },
      },
      ['sentences'],
    ),
    effort: 'low',
    maxTokens: 4000,
  });
  return res.sentences ?? [];
}

// ── Grammatik & Drills ─────────────────────────────────────────────────────

export interface GeneratedPattern {
  title: string;
  formula: string;
  explanation: string;
  examples: { target: string; native: string }[];
}

export async function generatePatterns(
  settings: Settings,
  lang: Language,
  week: 1 | 2 | 3 | 4,
  existing: string[],
  count = 6,
): Promise<GeneratedPattern[]> {
  const weekFocus: Record<number, string> = {
    1: 'Subjekt-Verb-Objekt, Fragewörter, Verneinung, Artikel, Präsens, "es gibt", "ich möchte", "kann ich…?"',
    2: '3–4 Tempora (Präsens, Perfekt/Vergangenheit, Futur), Modalverben, Relativsätze, Pronomen',
    3: 'Nebensätze, Wortstellung, Konditional, Höflichkeitsformen, Alltagsszenen (bestellen, Termin, Weg)',
    4: 'Fehlermuster, komplexe Satzverbindungen, Register, idiomatische Wendungen',
  };
  const res = await callJSON<{ patterns: GeneratedPattern[] }>(settings, {
    system: TUTOR_SYSTEM,
    user: `${langContext(lang, settings.nativeLanguage)}

Erzeuge ${count} Kern-Grammatikmuster ("Skeleton-Drills") für Woche ${week} des 30-Tage-Sprints.
Fokus dieser Woche: ${weekFocus[week]}

Jedes Muster ist ein Minimalmuster mit klarer Formel, kurzer Erklärung auf Deutsch (max. 2 Sätze) und 3 Beispielsätzen.
Bereits vorhandene Muster, nicht wiederholen: ${existing.join(', ') || '(keine)'}`,
    schema: obj(
      {
        patterns: {
          type: 'array',
          items: obj(
            {
              title: str('Kurzer Name des Musters, z.B. "Verneinung mit no".'),
              formula: str('Strukturformel, z.B. "Subjekt + no + Verb".'),
              explanation: str('Erklärung auf Deutsch, maximal 2 Sätze.'),
              examples: {
                type: 'array',
                items: obj(
                  { target: str('Beispielsatz in der Zielsprache.'), native: str('Deutsche Übersetzung.') },
                  ['target', 'native'],
                ),
              },
            },
            ['title', 'formula', 'explanation', 'examples'],
          ),
        },
      },
      ['patterns'],
    ),
    effort: 'medium',
  });
  return res.patterns ?? [];
}

export interface GeneratedDrill {
  type: 'cloze' | 'transform' | 'order' | 'build';
  prompt: string;
  answer: string;
  hint: string;
}

export async function generateDrills(
  settings: Settings,
  lang: Language,
  pattern: GrammarPattern,
  count = 6,
): Promise<GeneratedDrill[]> {
  const res = await callJSON<{ drills: GeneratedDrill[] }>(settings, {
    system: TUTOR_SYSTEM,
    user: `${langContext(lang, settings.nativeLanguage)}

Erzeuge ${count} interaktive Übungen zum Grammatikmuster "${pattern.title}" (${pattern.formula}).
${pattern.explanation}

Übungstypen mischen:
- cloze: Lückensatz, die Lücke wird mit ___ markiert. Antwort = nur das fehlende Element.
- transform: Ein Satz soll umgeformt werden (z.B. in die Verneinung, in die Frage, in eine andere Zeit). Prompt nennt den Ausgangssatz und die Aufgabe auf Deutsch.
- order: Wörter in Zufallsreihenfolge mit " / " getrennt, Antwort = korrekt geordneter Satz.
- build: Deutsche Vorgabe, Antwort = korrekter Satz in der Zielsprache.

Der Hinweis (hint) ist ein kurzer Tipp auf Deutsch, der die Lösung nicht verrät.`,
    schema: obj(
      {
        drills: {
          type: 'array',
          items: obj(
            {
              type: { type: 'string', enum: ['cloze', 'transform', 'order', 'build'] },
              prompt: str('Die Aufgabenstellung.'),
              answer: str('Die erwartete Lösung.'),
              hint: str('Kurzer Tipp auf Deutsch.'),
            },
            ['type', 'prompt', 'answer', 'hint'],
          ),
        },
      },
      ['drills'],
    ),
    effort: 'low',
  });
  return res.drills ?? [];
}

// ── Reader (Phase 2) ───────────────────────────────────────────────────────

export interface GeneratedText {
  title: string;
  body: string;
  translation: string;
  glossary: { term: string; translation: string }[];
  questions: string[];
}

export async function generateReaderText(
  settings: Settings,
  lang: Language,
  opts: { knownWords: string[]; topic: string; level: string; length: 'kurz' | 'mittel' | 'lang' },
): Promise<GeneratedText> {
  const words = { kurz: '80–120', mittel: '150–220', lang: '250–350' }[opts.length];
  return callJSON<GeneratedText>(settings, {
    system: TUTOR_SYSTEM,
    user: `${langContext(lang, settings.nativeLanguage)}

Schreibe einen Lesetext auf Niveau ${opts.level} zum Thema "${opts.topic}", ${words} Wörter.

Wichtig: Der Text muss weitgehend verständlich sein (Prinzip "comprehensible input", i+1). Verwende überwiegend Wörter, die der Lernende schon kennt, und führe höchstens 8–12 neue Wörter ein.

Diese Wörter kennt der Lernende bereits:
${opts.knownWords.slice(0, 300).join(', ') || '(noch wenige – halte den Text sehr einfach)'}

Liefere zusätzlich:
- translation: vollständige deutsche Übersetzung
- glossary: die neuen Wörter mit Übersetzung
- questions: 3 Verständnisfragen in der Zielsprache`,
    schema: obj(
      {
        title: str('Titel in der Zielsprache.'),
        body: str('Der Lesetext in der Zielsprache, Absätze mit \\n\\n getrennt.'),
        translation: str('Vollständige deutsche Übersetzung.'),
        glossary: {
          type: 'array',
          items: obj({ term: str('Neues Wort.'), translation: str('Deutsche Übersetzung.') }, [
            'term',
            'translation',
          ]),
        },
        questions: { type: 'array', items: { type: 'string' } },
      },
      ['title', 'body', 'translation', 'glossary', 'questions'],
    ),
    effort: 'medium',
  });
}

/** Ein einzelnes Wort aus dem Reader nachschlagen. */
export async function lookupWord(
  settings: Settings,
  lang: Language,
  word: string,
  sentence: string,
): Promise<GeneratedWord> {
  return callJSON<GeneratedWord>(settings, {
    system: TUTOR_SYSTEM,
    user: `${langContext(lang, settings.nativeLanguage)}

Erkläre das Wort "${word}" so, wie es in diesem Satz verwendet wird:
"${sentence}"

Gib die Grundform als term an (bei Verben den Infinitiv, bei Nomen den Singular mit Artikel).`,
    schema: obj(
      {
        term: str('Grundform des Wortes.'),
        translation: str('Deutsche Übersetzung im gegebenen Kontext.'),
        pos: str('Wortart.'),
        example: str('Ein weiterer kurzer Beispielsatz.'),
        exampleTranslation: str('Deutsche Übersetzung des Beispielsatzes.'),
        tags: { type: 'array', items: { type: 'string' } },
      },
      ['term', 'translation', 'pos', 'example', 'exampleTranslation', 'tags'],
    ),
    effort: 'low',
    maxTokens: 2000,
  });
}

// ── Konversation (Phase 3) ─────────────────────────────────────────────────

const analysisSchema: JsonSchema = obj(
  {
    corrected: str('Die korrigierte Fassung der Nachricht. Wenn alles korrekt war, die Originalnachricht.'),
    errors: {
      type: 'array',
      description: 'Gefundene Fehler. Leeres Array, wenn alles korrekt war.',
      items: obj(
        {
          original: str('Die fehlerhafte Stelle im Original.'),
          correction: str('Die korrigierte Stelle.'),
          type: str('Fehlerart: Grammatik, Wortschatz, Wortstellung, Register oder Rechtschreibung.'),
          explanation: str('Kurze Erklärung auf Deutsch, maximal 2 Sätze.'),
        },
        ['original', 'correction', 'type', 'explanation'],
      ),
    },
    score: { type: 'integer', description: 'Gesamtqualität 0–100.' },
    tip: str('Ein konkreter Verbesserungstipp auf Deutsch.'),
    newWords: {
      type: 'array',
      description: 'Bis zu 3 nützliche Wörter oder Wendungen, die der Lernende hier hätte nutzen können.',
      items: obj({ term: str('Wort in der Zielsprache.'), translation: str('Deutsche Übersetzung.') }, [
        'term',
        'translation',
      ]),
    },
  },
  ['corrected', 'errors', 'score', 'tip', 'newWords'],
);

/** Schritt 2 des Konversationsmoduls: die Nachricht des Nutzers prüfen. */
export async function analyzeMessage(
  settings: Settings,
  lang: Language,
  message: string,
  level: string,
): Promise<Analysis> {
  return callJSON<Analysis>(settings, {
    system: `Du bist ein präziser, wohlwollender Sprachtrainer. Du korrigierst Lernertexte auf Niveau ${level} und erklärst knapp auf Deutsch. Du erfindest keine Fehler: Wenn ein Satz korrekt ist, gibst du ein leeres Fehler-Array zurück. Stilistische Vorschläge markierst du als Typ "Register".`,
    user: `${langContext(lang, settings.nativeLanguage)}

Analysiere diese Nachricht des Lernenden:
"""
${message}
"""`,
    schema: analysisSchema,
    effort: 'medium',
    maxTokens: 4000,
  });
}

/**
 * Schritt 1 des Konversationsmoduls: natürliche Antwort, gestreamt.
 * Läuft parallel zur Analyse, damit der Chat nicht auf die Korrektur wartet.
 */
export async function streamReply(
  settings: Settings,
  lang: Language,
  opts: {
    scenario: string;
    level: string;
    history: { role: 'user' | 'assistant'; content: string }[];
    onDelta: (text: string) => void;
    signal?: AbortSignal;
  },
): Promise<string> {
  const anthropic = client(settings);
  try {
    const stream = anthropic.messages.stream(
      {
        model: settings.model || DEFAULT_MODEL,
        max_tokens: 2000,
        output_config: { effort: 'low' },
        system: `Du bist ein Gesprächspartner und Sprachtrainer für ${lang.name} (${lang.nativeName}).

Situation: ${opts.scenario}
Niveau des Lernenden: ${opts.level}

Regeln:
- Antworte ausschließlich auf ${lang.name}. Keine deutschen Übersetzungen, keine Korrekturen im Gesprächstext – die Korrektur läuft separat.
- Sprich natürlich, so wie ein Muttersprachler in dieser Situation sprechen würde.
- Passe Tempo und Wortschatz an Niveau ${opts.level} an: kurze Sätze, hochfrequente Wörter, aber keine Kindersprache.
- Halte das Gespräch am Laufen: Antworte auf das Gesagte und stelle genau eine Rückfrage.
- Maximal 3 Sätze pro Antwort.`,
        messages: opts.history.map((m) => ({ role: m.role, content: m.content })),
      },
      { signal: opts.signal },
    );

    stream.on('text', (delta) => opts.onDelta(delta));
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') {
      throw new Error('Die Antwort wurde abgelehnt. Bitte anders formulieren.');
    }
    return final.content
      .filter((b) => b.type === 'text')
      .map((b) => (b.type === 'text' ? b.text : ''))
      .join('');
  } catch (err) {
    throw llmError(err);
  }
}

// ── Schreiben (Phase 3) ────────────────────────────────────────────────────

export async function analyzeWriting(
  settings: Settings,
  lang: Language,
  text: string,
  prompt: string,
  level: string,
): Promise<Analysis> {
  return callJSON<Analysis>(settings, {
    system: `Du bist ein präziser, wohlwollender Sprachtrainer. Du korrigierst Lernertexte auf Niveau ${level} und erklärst knapp auf Deutsch. Du erfindest keine Fehler.`,
    user: `${langContext(lang, settings.nativeLanguage)}

Schreibaufgabe war: "${prompt}"

Text des Lernenden:
"""
${text}
"""

Korrigiere den Text und erkläre die wichtigsten Fehlermuster.`,
    schema: analysisSchema,
    effort: 'medium',
  });
}

export async function generateWritingPrompts(
  settings: Settings,
  lang: Language,
  level: string,
  count = 5,
): Promise<string[]> {
  const res = await callJSON<{ prompts: string[] }>(settings, {
    system: TUTOR_SYSTEM,
    user: `${langContext(lang, settings.nativeLanguage)}

Erzeuge ${count} kurze Schreibimpulse für ein tägliches Mini-Tagebuch auf Niveau ${level}.
Jeder Impuls ist eine Aufgabe auf Deutsch, in 3–5 Sätzen beantwortbar, aus dem Alltag gegriffen.`,
    schema: obj({ prompts: { type: 'array', items: { type: 'string' } } }, ['prompts']),
    effort: 'low',
    maxTokens: 2000,
  });
  return res.prompts ?? [];
}

// ── Eigene Inhalte hochladen ───────────────────────────────────────────────

/**
 * Parst freien Text (Vokabelliste, Notizen, kopierte Übung) in Karteikarten.
 * Erkennt Trennzeichen selbstständig und ergänzt fehlende Beispielsätze.
 */
export async function parseUpload(
  settings: Settings,
  lang: Language,
  raw: string,
): Promise<GeneratedWord[]> {
  const res = await callJSON<{ words: GeneratedWord[] }>(settings, {
    system: TUTOR_SYSTEM,
    user: `${langContext(lang, settings.nativeLanguage)}

Der Lernende hat eigenes Material hochgeladen. Wandle es in Karteikarten um.

Regeln:
- Erkenne das Format selbstständig (Tabelle, "wort - übersetzung", Liste, Fließtext, Übungssätze).
- Fehlt die Übersetzung, ergänze sie. Fehlt ein Beispielsatz, erfinde einen kurzen Alltagssatz.
- Ist der Text ein Fließtext ohne Vokabelstruktur, extrahiere die lernenswerten Wörter und Wendungen daraus.
- Übernimm die Reihenfolge des Originals.
- Ignoriere Kopfzeilen, Seitenzahlen und Formatierungsreste.

Material:
"""
${raw.slice(0, 12000)}
"""`,
    schema: wordSchema,
    effort: 'low',
  });
  return res.words ?? [];
}

// ── Startpaket für eine neue Sprache ───────────────────────────────────────

export interface StarterPack {
  nativeName: string;
  code: string;
  emoji: string;
  note: string;
}

export async function describeLanguage(
  settings: Settings,
  name: string,
): Promise<StarterPack> {
  return callJSON<StarterPack>(settings, {
    system: TUTOR_SYSTEM,
    user: `Der Lernende möchte "${name}" lernen.

Gib die Eigenbezeichnung der Sprache, einen passenden BCP-47-Code für Sprachausgabe (z.B. "pt-BR"), ein passendes Emoji (Flagge oder Symbol) und eine kurze Notiz auf Deutsch (1–2 Sätze) zu der Besonderheit, auf die Anfänger dieser Sprache zuerst achten sollten.`,
    schema: obj(
      {
        nativeName: str('Eigenbezeichnung der Sprache.'),
        code: str('BCP-47-Sprachcode.'),
        emoji: str('Ein einzelnes Emoji.'),
        note: str('Kurzer Hinweis für Anfänger auf Deutsch.'),
      },
      ['nativeName', 'code', 'emoji', 'note'],
    ),
    effort: 'low',
    maxTokens: 1500,
  });
}
