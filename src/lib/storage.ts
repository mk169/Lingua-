import type { AppState, Language } from '../types';
import { DEFAULT_MODEL } from './model';
import { syncSeedContent } from './seedSync';

const KEY = 'lingua.state.v1';
export const STATE_VERSION = 1;

export function emptyState(): AppState {
  return {
    version: STATE_VERSION,
    languages: [],
    cards: [],
    patterns: [],
    drills: [],
    exerciseProgress: {},
    assessments: [],
    texts: [],
    chats: [],
    journal: [],
    content: [],
    habits: [],
    logs: [],
    settings: {
      apiKey: '',
      model: DEFAULT_MODEL,
      effort: 'medium',
      nativeLanguage: 'Deutsch',
      ttsEnabled: true,
      reviewMode: 'adapt',
      listenMode: false,
    },
    activeLanguageId: null,
  };
}

/**
 * Sprachen aus der Zeit vor den mehrstufigen Sprints kennen weder Zielstufe
 * noch Sprint-Nummer. Sie laufen weiter als erster Sprint auf A2 – ihr
 * Startdatum und aller Fortschritt bleiben unangetastet.
 */
function withSprintDefaults(lang: Language): Language {
  return {
    ...lang,
    targetLevel: lang.targetLevel ?? 'A2',
    sprint: lang.sprint ?? 1,
    sprintHistory: lang.sprintHistory ?? [],
  };
}

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return emptyState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    // Defensiv mergen, damit neue Felder alte Stände nicht brechen.
    const base = emptyState();
    const merged: AppState = {
      ...base,
      ...parsed,
      languages: (parsed.languages ?? []).map(withSprintDefaults),
      settings: { ...base.settings, ...(parsed.settings ?? {}) },
      version: STATE_VERSION,
    };
    // Startpakete wachsen im Repo nach. Ohne diesen Abgleich sähe nur jemand
    // die neuen Muster und Wörter, der die Sprache neu anlegt.
    return syncSeedContent(merged);
  } catch {
    return emptyState();
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function saveState(state: AppState): void {
  if (typeof localStorage === 'undefined') return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Speichern fehlgeschlagen', err);
    }
  }, 250);
}

export function exportState(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function importState(json: string): AppState {
  const parsed = JSON.parse(json) as Partial<AppState>;
  const base = emptyState();
  return syncSeedContent({
    ...base,
    ...parsed,
    languages: (parsed.languages ?? []).map(withSprintDefaults),
    settings: { ...base.settings, ...(parsed.settings ?? {}) },
    version: STATE_VERSION,
  });
}
