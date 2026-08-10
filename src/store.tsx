import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AppState,
  Analysis,
  Card,
  ChatMessage,
  ChatSession,
  ContentItem,
  DayLog,
  Drill,
  GrammarPattern,
  Habit,
  JournalEntry,
  Language,
  ReaderText,
  Settings,
} from './types';
import { loadState, saveState } from './lib/storage';
import { freshSrs, schedule } from './lib/sm2';
import { todayISO } from './lib/date';
import { uid } from './lib/id';
import type { GeneratedWord, GeneratedPattern, GeneratedDrill } from './lib/llm';
import { findSeed, type SeedLanguage } from './data/seed';

interface Store {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;

  // Sprachen
  addLanguage: (input: {
    name: string;
    nativeName: string;
    code: string;
    emoji: string;
    seed?: SeedLanguage;
  }) => Language;
  updateLanguage: (id: string, patch: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;
  setActive: (id: string | null) => void;

  // Karten
  addCards: (languageId: string, words: GeneratedWord[], source: Card['source'], unlocked?: boolean) => Card[];
  updateCard: (id: string, patch: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  reviewCard: (id: string, quality: number) => void;
  unlockDaily: (languageId: string) => number;
  unlockNow: (languageId: string, count: number) => number;

  // Grammatik
  addPatterns: (languageId: string, patterns: GeneratedPattern[], week: 1 | 2 | 3 | 4) => GrammarPattern[];
  updatePattern: (id: string, patch: Partial<GrammarPattern>) => void;
  addDrills: (languageId: string, patternId: string, drills: GeneratedDrill[]) => Drill[];
  solveDrill: (id: string) => void;

  // Reader
  addText: (text: Omit<ReaderText, 'id' | 'createdAt'>) => ReaderText;
  deleteText: (id: string) => void;

  // Konversation
  newChat: (languageId: string, scenario: string) => ChatSession;
  addMessage: (chatId: string, message: ChatMessage) => void;
  patchMessage: (chatId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  deleteChat: (id: string) => void;

  // Schreiben
  addJournal: (entry: Omit<JournalEntry, 'id'>) => JournalEntry;
  patchJournal: (id: string, patch: Partial<JournalEntry>) => void;

  // Alltag
  addContent: (item: Omit<ContentItem, 'id' | 'createdAt'>) => void;
  updateContent: (id: string, patch: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'done'>) => void;
  toggleHabit: (id: string, date?: string) => void;
  deleteHabit: (id: string) => void;

  // Protokoll & Einstellungen
  logActivity: (languageId: string, patch: Partial<Omit<DayLog, 'date' | 'languageId'>>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => fn(prev));
  }, []);

  const api = useMemo<Store>(() => {
    const patchCard = (id: string, patch: Partial<Card>) =>
      update((s) => ({
        ...s,
        cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));

    const bumpLog = (
      s: AppState,
      languageId: string,
      patch: Partial<Omit<DayLog, 'date' | 'languageId'>>,
    ): AppState => {
      const date = todayISO();
      const existing = s.logs.find((l) => l.date === date && l.languageId === languageId);
      const base: DayLog = existing ?? {
        date,
        languageId,
        reviews: 0,
        newLearned: 0,
        drills: 0,
        minutes: 0,
        outputs: 0,
      };
      const merged: DayLog = {
        ...base,
        reviews: base.reviews + (patch.reviews ?? 0),
        newLearned: base.newLearned + (patch.newLearned ?? 0),
        drills: base.drills + (patch.drills ?? 0),
        minutes: base.minutes + (patch.minutes ?? 0),
        outputs: base.outputs + (patch.outputs ?? 0),
      };
      return {
        ...s,
        logs: existing
          ? s.logs.map((l) => (l === existing ? merged : l))
          : [...s.logs, merged],
      };
    };

    /**
     * Schaltet Karten aus dem Pool frei.
     * Die Auswahl passiert innerhalb des State-Updaters, damit zwei Aufrufe im
     * selben Tick (z.B. React StrictMode) nicht doppelt freischalten.
     */
    const unlockCards = (
      languageId: string,
      pick: (state: AppState, languageId: string) => number,
    ): number => {
      let unlocked = 0;
      update((s) => {
        const count = pick(s, languageId);
        if (count <= 0) return s;
        const pool = s.cards
          .filter((c) => c.languageId === languageId && c.unlockedAt === null)
          .sort((a, b) => a.order - b.order)
          .slice(0, count);
        unlocked = pool.length;
        if (pool.length === 0) return s;
        const ids = new Set(pool.map((c) => c.id));
        const now = Date.now();
        return {
          ...s,
          cards: s.cards.map((c) =>
            ids.has(c.id) ? { ...c, unlockedAt: now, srs: { ...c.srs, due: todayISO() } } : c,
          ),
        };
      });
      return unlocked;
    };

    const unlockNow = (languageId: string, count: number): number =>
      unlockCards(languageId, () => count);

    const buildCards = (
      languageId: string,
      words: GeneratedWord[],
      source: Card['source'],
      startOrder: number,
      unlocked: boolean,
    ): Card[] =>
      words.map((w, i) => ({
        id: uid('card'),
        languageId,
        term: w.term.trim(),
        translation: w.translation.trim(),
        pos: w.pos,
        example: w.example,
        exampleTranslation: w.exampleTranslation,
        extraExamples: [],
        tags: w.tags ?? [],
        source,
        createdAt: Date.now(),
        unlockedAt: unlocked ? Date.now() : null,
        order: startOrder + i,
        srs: freshSrs(),
        history: [],
      }));

    return {
      state,
      update,

      addLanguage({ name, nativeName, code, emoji, seed }) {
        const lang: Language = {
          id: uid('lang'),
          name,
          nativeName,
          code,
          emoji,
          createdAt: Date.now(),
          startDate: todayISO(),
          slot: 'focus',
          dailyNewWords: 45,
          dailyMinutes: 40,
          phaseOverride: null,
        };
        const pack = seed ?? findSeed(name);
        update((s) => {
          const cards: Card[] = pack
            ? pack.words.map((w, i) => ({
                id: uid('card'),
                languageId: lang.id,
                term: w[0],
                translation: w[1],
                pos: w[2],
                example: w[3],
                exampleTranslation: w[4],
                extraExamples: [],
                tags: ['Startpaket'],
                source: 'seed' as const,
                createdAt: Date.now(),
                unlockedAt: null,
                order: i,
                srs: freshSrs(),
                history: [],
              }))
            : [];
          const patterns: GrammarPattern[] = pack
            ? pack.patterns.map((p) => ({
                id: uid('pat'),
                languageId: lang.id,
                title: p.title,
                formula: p.formula,
                explanation: p.explanation,
                examples: p.examples.map(([target, native]) => ({ target, native })),
                week: p.week,
                mastered: false,
                createdAt: Date.now(),
              }))
            : [];
          // Nur eine Fokus-Sprache gleichzeitig.
          const languages = s.languages.map((l) => ({ ...l, slot: 'maintenance' as const }));
          return {
            ...s,
            languages: [...languages, lang],
            cards: [...s.cards, ...cards],
            patterns: [...s.patterns, ...patterns],
            activeLanguageId: lang.id,
          };
        });
        return lang;
      },

      updateLanguage(id, patch) {
        update((s) => ({
          ...s,
          languages: s.languages.map((l) => {
            if (l.id === id) return { ...l, ...patch };
            // Fokus-Slot ist exklusiv.
            if (patch.slot === 'focus' && l.slot === 'focus') return { ...l, slot: 'maintenance' };
            return l;
          }),
        }));
      },

      deleteLanguage(id) {
        update((s) => ({
          ...s,
          languages: s.languages.filter((l) => l.id !== id),
          cards: s.cards.filter((c) => c.languageId !== id),
          patterns: s.patterns.filter((p) => p.languageId !== id),
          drills: s.drills.filter((d) => d.languageId !== id),
          texts: s.texts.filter((t) => t.languageId !== id),
          chats: s.chats.filter((c) => c.languageId !== id),
          journal: s.journal.filter((j) => j.languageId !== id),
          content: s.content.filter((c) => c.languageId !== id),
          habits: s.habits.filter((h) => h.languageId !== id),
          logs: s.logs.filter((l) => l.languageId !== id),
          activeLanguageId: s.activeLanguageId === id ? null : s.activeLanguageId,
        }));
      },

      setActive(id) {
        update((s) => ({ ...s, activeLanguageId: id }));
      },

      /** Fügt Karten hinzu und filtert dabei Dubletten heraus. */
      addCards(languageId, words, source, unlocked = false) {
        let created: Card[] = [];
        update((s) => {
          const own = s.cards.filter((c) => c.languageId === languageId);
          const existingTerms = new Set(own.map((c) => c.term.toLowerCase()));
          const fresh = words.filter((w) => {
            const key = w.term?.trim().toLowerCase();
            if (!key || existingTerms.has(key)) return false;
            existingTerms.add(key);
            return true;
          });
          if (fresh.length === 0) {
            created = [];
            return s;
          }
          const maxOrder = own.reduce((max, c) => Math.max(max, c.order), -1);
          created = buildCards(languageId, fresh, source, maxOrder + 1, unlocked);
          return { ...s, cards: [...s.cards, ...created] };
        });
        return created;
      },

      updateCard: patchCard,

      deleteCard(id) {
        update((s) => ({ ...s, cards: s.cards.filter((c) => c.id !== id) }));
      },

      reviewCard(id, quality) {
        const today = todayISO();
        update((s) => {
          const card = s.cards.find((c) => c.id === id);
          if (!card) return s;
          const next: Card = {
            ...card,
            srs: schedule(card.srs, quality, today),
            history: [...card.history, { date: today, quality }].slice(-60),
          };
          const withCard = {
            ...s,
            cards: s.cards.map((c) => (c.id === id ? next : c)),
          };
          const isFirstReview = card.history.length === 0;
          return bumpLog(withCard, card.languageId, {
            reviews: 1,
            newLearned: isFirstReview ? 1 : 0,
          });
        });
      },

      /** Schaltet das heutige Tageskontingent frei. Liefert die Anzahl. */
      unlockDaily(languageId) {
        return unlockCards(languageId, (s, id) => {
          const lang = s.languages.find((l) => l.id === id);
          if (!lang) return 0;
          const today = todayISO();
          const unlockedToday = s.cards.filter(
            (c) =>
              c.languageId === id &&
              c.unlockedAt !== null &&
              todayISO(new Date(c.unlockedAt)) === today,
          ).length;
          return lang.dailyNewWords - unlockedToday;
        });
      },

      unlockNow,

      addPatterns(languageId, patterns, week) {
        const created: GrammarPattern[] = patterns.map((p) => ({
          id: uid('pat'),
          languageId,
          title: p.title,
          formula: p.formula,
          explanation: p.explanation,
          examples: p.examples ?? [],
          week,
          mastered: false,
          createdAt: Date.now(),
        }));
        update((s) => ({ ...s, patterns: [...s.patterns, ...created] }));
        return created;
      },

      updatePattern(id, patch) {
        update((s) => ({
          ...s,
          patterns: s.patterns.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      addDrills(languageId, patternId, drills) {
        const created: Drill[] = drills.map((d) => ({
          id: uid('drill'),
          languageId,
          patternId,
          type: d.type,
          prompt: d.prompt,
          answer: d.answer,
          hint: d.hint,
          solvedAt: null,
        }));
        update((s) => ({ ...s, drills: [...s.drills, ...created] }));
        return created;
      },

      solveDrill(id) {
        update((s) => {
          const drill = s.drills.find((d) => d.id === id);
          if (!drill) return s;
          const next = {
            ...s,
            drills: s.drills.map((d) => (d.id === id ? { ...d, solvedAt: Date.now() } : d)),
          };
          return bumpLog(next, drill.languageId, { drills: 1 });
        });
      },

      addText(text) {
        const created: ReaderText = { ...text, id: uid('text'), createdAt: Date.now() };
        update((s) => ({ ...s, texts: [created, ...s.texts] }));
        return created;
      },

      deleteText(id) {
        update((s) => ({ ...s, texts: s.texts.filter((t) => t.id !== id) }));
      },

      newChat(languageId, scenario) {
        const chat: ChatSession = {
          id: uid('chat'),
          languageId,
          scenario,
          messages: [],
          createdAt: Date.now(),
        };
        update((s) => ({ ...s, chats: [chat, ...s.chats] }));
        return chat;
      },

      addMessage(chatId, message) {
        update((s) => {
          const chat = s.chats.find((c) => c.id === chatId);
          const next = {
            ...s,
            chats: s.chats.map((c) =>
              c.id === chatId ? { ...c, messages: [...c.messages, message] } : c,
            ),
          };
          if (message.role === 'user' && chat) {
            return bumpLog(next, chat.languageId, { outputs: 1 });
          }
          return next;
        });
      },

      patchMessage(chatId, messageId, patch) {
        update((s) => ({
          ...s,
          chats: s.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
                }
              : c,
          ),
        }));
      },

      deleteChat(id) {
        update((s) => ({ ...s, chats: s.chats.filter((c) => c.id !== id) }));
      },

      addJournal(entry) {
        const created: JournalEntry = { ...entry, id: uid('j') };
        update((s) => bumpLog({ ...s, journal: [created, ...s.journal] }, entry.languageId, {
          outputs: 1,
        }));
        return created;
      },

      patchJournal(id, patch) {
        update((s) => ({
          ...s,
          journal: s.journal.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        }));
      },

      addContent(item) {
        update((s) => ({
          ...s,
          content: [{ ...item, id: uid('c'), createdAt: Date.now() }, ...s.content],
        }));
      },

      updateContent(id, patch) {
        update((s) => ({
          ...s,
          content: s.content.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },

      deleteContent(id) {
        update((s) => ({ ...s, content: s.content.filter((c) => c.id !== id) }));
      },

      addHabit(habit) {
        update((s) => ({
          ...s,
          habits: [...s.habits, { ...habit, id: uid('h'), createdAt: Date.now(), done: [] }],
        }));
      },

      toggleHabit(id, date = todayISO()) {
        update((s) => ({
          ...s,
          habits: s.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  done: h.done.includes(date)
                    ? h.done.filter((d) => d !== date)
                    : [...h.done, date],
                }
              : h,
          ),
        }));
      },

      deleteHabit(id) {
        update((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }));
      },

      logActivity(languageId, patch) {
        update((s) => bumpLog(s, languageId, patch));
      },

      updateSettings(patch) {
        update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
      },
    };
  }, [state, update]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore muss innerhalb von StoreProvider verwendet werden.');
  return ctx;
}

/** Die aktuell gewählte Sprache. */
export function useLanguage(): Language | null {
  const { state } = useStore();
  return state.languages.find((l) => l.id === state.activeLanguageId) ?? null;
}

/** Hilfsfunktion: Analyse in Karten überführen (aus Chat/Schreiben). */
export function analysisToWords(analysis: Analysis): GeneratedWord[] {
  return analysis.newWords.map((w) => ({
    term: w.term,
    translation: w.translation,
    pos: '',
    example: '',
    exampleTranslation: '',
    tags: ['aus Konversation'],
  }));
}
