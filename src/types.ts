// Zentrale Datentypen der Lingua-App.

export type Phase = 1 | 2 | 3;
export type Slot = 'focus' | 'maintenance';

/** Eine Sprache = ein eigener Lernraum mit eigenem Sprint-Startdatum. */
export interface Language {
  id: string;
  name: string; // deutscher Name, z.B. "Spanisch"
  nativeName: string; // Eigenbezeichnung, z.B. "Español"
  code: string; // BCP-47 für TTS/STT, z.B. "es-ES"
  emoji: string;
  createdAt: number;
  startDate: string; // ISO-Datum, Tag 1 des 30-Tage-Sprints
  slot: Slot;
  dailyNewWords: number; // 40–50 in Phase 1
  dailyMinutes: number; // Zeitbudget
  phaseOverride: Phase | null; // manuelles Überschreiben der Phase
}

export type SrsState = 'new' | 'learning' | 'review';

/** SM-2 Zustand einer Karte. */
export interface Srs {
  ease: number; // Easiness-Faktor, Start 2.5, min 1.3
  interval: number; // Tage bis zur nächsten Wiederholung
  reps: number; // Anzahl erfolgreicher Wiederholungen in Folge
  lapses: number; // wie oft vergessen
  due: string; // ISO-Datum der nächsten Fälligkeit
  state: SrsState;
}

export type CardSource = 'seed' | 'user' | 'llm' | 'reader';

export interface Card {
  id: string;
  languageId: string;
  term: string; // Zielsprache
  translation: string; // Deutsch
  pos?: string; // Wortart
  example?: string; // Beispielsatz Zielsprache
  exampleTranslation?: string;
  /** Weitere, per LLM erzeugte Alltagssätze. */
  extraExamples: { target: string; native: string }[];
  tags: string[];
  patternId?: string; // verknüpftes Grammatikmuster
  source: CardSource;
  createdAt: number;
  /** null = noch im Pool, wartet auf Freischaltung. */
  unlockedAt: number | null;
  order: number; // Frequenzrang – bestimmt die Freischaltreihenfolge
  srs: Srs;
  history: { date: string; quality: number }[];
}

export interface GrammarPattern {
  id: string;
  languageId: string;
  /**
   * Stabiler Bezeichner aus dem Startpaket, z.B. "it-negazione-non".
   * Übungen im Repo referenzieren Muster darüber – die `id` entsteht erst zur
   * Laufzeit und ist bei jedem Nutzer eine andere. Per LLM erzeugte Muster
   * haben keinen Slug, weil es zu ihnen keinen Repo-Inhalt gibt.
   */
  slug?: string;
  title: string;
  formula: string; // z.B. "Subjekt + Verb + Objekt"
  explanation: string;
  examples: { target: string; native: string }[];
  week: 1 | 2 | 3 | 4;
  mastered: boolean;
  createdAt: number;
}

export type DrillType = 'cloze' | 'transform' | 'order' | 'build';

export interface Drill {
  id: string;
  languageId: string;
  patternId: string;
  type: DrillType;
  prompt: string;
  answer: string;
  hint?: string;
  solvedAt: number | null;
}

/** Kategorien, in die der Übungskatalog je Muster geteilt ist. */
export type ExerciseKind = 'satz' | 'konstruktion' | 'verstaendnis';

export type ExerciseType = DrillType | 'choice' | 'translate';

/**
 * Eine Übung aus dem Repo-Katalog (`src/data/exercises/*`).
 * Anders als `Drill` liegt sie nicht im localStorage, sondern wird mit der App
 * ausgeliefert und erreicht damit jeden Nutzer – auch ohne API-Schlüssel.
 */
export interface Exercise {
  /** Stabil und im Diff lesbar, z.B. "it.negazione-non.konstruktion.001". */
  id: string;
  patternSlug: string;
  kind: ExerciseKind;
  type: ExerciseType;
  prompt: string;
  answer: string;
  /** Nur bei `choice`: die Auswahlmöglichkeiten, inklusive der richtigen. */
  options?: string[];
  hint?: string;
  /** Deutsche Entsprechung, wird im Feedback gezeigt. */
  translation?: string;
}

/** Nur das Ergebnis wird gespeichert, nicht die Übung selbst. */
export interface ExerciseProgress {
  solved: boolean;
  attempts: number;
  lastAt: number;
}

export interface ReaderText {
  id: string;
  languageId: string;
  title: string;
  body: string;
  translation?: string;
  glossary: { term: string; translation: string }[];
  questions: string[];
  level: string; // A1, A2, B1 ...
  source: 'llm' | 'user';
  createdAt: number;
}

export interface ErrorNote {
  original: string;
  correction: string;
  type: string; // Grammatik | Wortschatz | Wortstellung | Register
  explanation: string;
}

/** Ergebnis der Sprachtrainer-Analyse (Chat & Schreib-Tagebuch). */
export interface Analysis {
  corrected: string;
  errors: ErrorNote[];
  score: number; // 0–100
  tip: string;
  newWords: { term: string; translation: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  analysis?: Analysis;
  pending?: boolean;
  ts: number;
}

export interface ChatSession {
  id: string;
  languageId: string;
  scenario: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  languageId: string;
  date: string;
  prompt: string;
  text: string;
  analysis?: Analysis;
}

export type ContentType = 'buch' | 'hörbuch' | 'artikel' | 'podcast' | 'video' | 'serie';
export type ContentStatus = 'geplant' | 'aktiv' | 'fertig';

export interface ContentItem {
  id: string;
  languageId: string;
  type: ContentType;
  title: string;
  url?: string;
  status: ContentStatus;
  progress: number; // 0–100
  notes: string;
  createdAt: number;
}

export type Cadence = 'täglich' | '3x/Woche' | 'wöchentlich';

export interface Habit {
  id: string;
  languageId: string;
  title: string;
  cadence: Cadence;
  minutes: number;
  done: string[]; // ISO-Daten, an denen erledigt
  createdAt: number;
}

/** Tagesprotokoll pro Sprache – Basis für Streak & Dashboard. */
export interface DayLog {
  date: string;
  languageId: string;
  reviews: number;
  newLearned: number;
  drills: number;
  minutes: number;
  outputs: number; // Chat-/Schreib-Beiträge
}

export interface Settings {
  apiKey: string;
  model: string;
  effort: 'low' | 'medium' | 'high';
  nativeLanguage: string;
  ttsEnabled: boolean;
}

export interface AppState {
  version: number;
  languages: Language[];
  cards: Card[];
  patterns: GrammarPattern[];
  drills: Drill[];
  /** Fortschritt am Repo-Übungskatalog, keyed by Exercise-ID. */
  exerciseProgress: Record<string, ExerciseProgress>;
  texts: ReaderText[];
  chats: ChatSession[];
  journal: JournalEntry[];
  content: ContentItem[];
  habits: Habit[];
  logs: DayLog[];
  settings: Settings;
  activeLanguageId: string | null;
}
