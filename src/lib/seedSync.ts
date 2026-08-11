import type { AppState, Card, GrammarPattern } from '../types';
import { findSeed } from '../data/seed';
import { freshSrs } from './sm2';
import { uid } from './id';

/**
 * Gleicht bestehende Sprachen mit dem aktuellen Startpaket ab.
 *
 * `addLanguage` kopiert Wörter und Muster einmalig beim Anlegen in den
 * Browser-Zustand. Wächst das Startpaket im Repo nach – neue Grammatikmuster,
 * neue Vokabeln –, sieht davon niemand etwas, der die Sprache vorher angelegt
 * hat. Diese Funktion schließt die Lücke bei jedem Laden.
 *
 * Zwei Regeln halten das ungefährlich:
 * - **Nur ergänzen, nie überschreiben.** Vorhandene Karten und Muster bleiben
 *   unangetastet, samt SRS-Stand, Notizen und "gemeistert"-Haken.
 * - **Abgleich über stabile Schlüssel.** Muster über `slug`, Karten über den
 *   Begriff. Beides ist im Repo stabil; die Laufzeit-`id` ist es nicht.
 *
 * Damit ist der Aufruf idempotent: Ein zweiter Lauf ohne neues Repo-Material
 * gibt denselben Zustand unverändert zurück.
 */
export function syncSeedContent(state: AppState): AppState {
  const cards: Card[] = [];
  const patterns: GrammarPattern[] = [];
  const now = Date.now();

  for (const lang of state.languages) {
    const pack = findSeed(lang.name);
    if (!pack) continue;

    const knownSlugs = new Set(
      state.patterns.filter((p) => p.languageId === lang.id).map((p) => p.slug).filter(Boolean),
    );
    pack.patterns.forEach((p, i) => {
      if (!p.slug || knownSlugs.has(p.slug)) return;
      patterns.push({
        id: uid('pat'),
        languageId: lang.id,
        slug: p.slug,
        title: p.title,
        formula: p.formula,
        explanation: p.explanation,
        examples: p.examples.map(([target, native]) => ({ target, native })),
        week: p.week,
        level: p.level ?? 'A1',
        order: i,
        mastered: false,
        createdAt: now,
      });
    });

    const knownTerms = new Set(
      state.cards.filter((c) => c.languageId === lang.id).map((c) => c.term),
    );
    pack.words.forEach((w, i) => {
      if (knownTerms.has(w[0])) return;
      cards.push({
        id: uid('card'),
        languageId: lang.id,
        term: w[0],
        translation: w[1],
        pos: w[2],
        example: w[3],
        exampleTranslation: w[4],
        extraExamples: [],
        tags: ['Startpaket'],
        source: 'seed',
        createdAt: now,
        // Nachgelieferte Wörter landen im Pool, nicht sofort im Deck – sonst
        // stünden auf einen Schlag hunderte Karten zur Wiederholung an.
        unlockedAt: null,
        order: i,
        srs: freshSrs(),
        history: [],
      });
    });
  }

  if (cards.length === 0 && patterns.length === 0) return state;
  return {
    ...state,
    cards: [...state.cards, ...cards],
    patterns: [...state.patterns, ...patterns],
  };
}
