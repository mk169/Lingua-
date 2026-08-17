import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Card, Empty, SectionTitle, Stat } from '../ui';
import { getPhase } from '../lib/phase';
import { dueCards } from '../lib/sm2';
import { todayISO } from '../lib/date';
import { HabitList } from '../components/HabitList';
import { NewLanguage } from './NewLanguage';

/**
 * Gesamtübersicht – der Einstieg in die App.
 *
 * Sie beantwortet drei Fragen auf einen Blick: Welche Sprachen laufen gerade,
 * was ist heute in jeder davon fällig, und welche Gewohnheiten stehen an. Die
 * Gewohnheiten sind dieselben wie im Dashboard der jeweiligen Sprache – hier
 * quer über alle Sprachen, damit der Tag an einer Stelle abhakbar ist.
 */
export function Overview() {
  const { state, setActive } = useStore();
  const [adding, setAdding] = useState(false);
  const today = todayISO();

  const languages = state.languages;

  const dueTotal = useMemo(
    () => languages.reduce((n, l) => n + dueCards(state.cards, l.id, today).length, 0),
    [languages, state.cards, today],
  );

  const habitsToday = state.habits.filter((h) => h.done.includes(today)).length;

  // Streak über alle Sprachen: Ein Tag zählt, sobald irgendwo gelernt wurde.
  const streak = useMemo(() => {
    const dates = new Set(state.logs.filter((l) => l.reviews > 0).map((l) => l.date));
    let cursor = today;
    if (!dates.has(cursor)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      cursor = todayISO(yesterday);
    }
    let count = 0;
    while (dates.has(cursor)) {
      count++;
      const [y, m, d] = cursor.split('-').map(Number);
      cursor = todayISO(new Date(y, m - 1, d - 1));
    }
    return count;
  }, [state.logs, today]);

  if (adding) return <NewLanguage onCancel={() => setAdding(false)} />;

  return (
    <div className="picker">
      <div className="eyebrow">Lingua</div>
      <h1 style={{ marginTop: 6 }}>
        {languages.length === 0 ? 'Welche Sprache heute?' : 'Übersicht'}
      </h1>

      {languages.length === 0 ? (
        <p className="muted" style={{ marginTop: 10, maxWidth: 520 }}>
          30 Tage striktes Programm: erst das Sprachskelett, dann verständlicher Input, dann
          eigene Produktion. Danach offen und alltagstauglich.
        </p>
      ) : (
        <div className="stats" style={{ marginTop: 18 }}>
          <Stat value={languages.length} label="aktive Sprachen" />
          <Stat value={dueTotal} label="heute fällig" />
          <Stat value={`${habitsToday}/${state.habits.length}`} label="Gewohnheiten heute" />
          <Stat value={streak} label="Tage Streak" />
        </div>
      )}

      {/* ── Aktive Sprachen ── */}
      <div className="lang-list">
        {languages.map((lang) => {
          const phase = getPhase(lang, today);
          const due = dueCards(state.cards, lang.id, today).length;
          return (
            <button key={lang.id} className="lang-item" onClick={() => setActive(lang.id)}>
              <span className="lang-emoji">{lang.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, display: 'block' }}>{lang.name}</span>
                <span className="small muted">
                  Sprint {lang.sprint} → {lang.targetLevel} · Tag {phase.day} · {phase.title}
                  {lang.slot === 'focus' ? ' · Fokus' : ' · Wartung'}
                </span>
              </span>
              {due > 0 && <span className="pill pill-accent mono">{due} fällig</span>}
              <span className="muted">→</span>
            </button>
          );
        })}

        <button className="lang-item lang-add" onClick={() => setAdding(true)}>
          <span style={{ fontSize: 20 }}>+</span> Sprache hinzufügen
        </button>
      </div>

      {/* ── Tägliche Gewohnheiten über alle Sprachen ── */}
      {languages.length > 0 && (
        <Card style={{ marginTop: 20 }}>
          <SectionTitle
            title="Heute abhaken"
            hint={
              state.habits.length > 0
                ? `${habitsToday}/${state.habits.length} erledigt`
                : undefined
            }
          />
          {state.habits.length === 0 ? (
            <Empty
              icon="◇"
              title="Noch keine Gewohnheiten"
              hint="Gewohnheiten legst du beim Einrichten einer Sprache an – oder jederzeit im Dashboard der Sprache."
            />
          ) : (
            // Bearbeitet wird im Dashboard der Sprache: Hier hängen die
            // Gewohnheiten mehrerer Sprachen nebeneinander, da wäre ein
            // "+ Gewohnheit" ohne Sprachbezug nicht eindeutig.
            <HabitList showLanguage editable={false} compact />
          )}
        </Card>
      )}

      {languages.length === 0 && (
        <p className="small muted" style={{ marginTop: 18 }}>
          Für Spanisch, Italienisch, Französisch, Polnisch und Portugiesisch ist ein Startpaket
          hinterlegt – du kannst sofort loslegen. Jede andere Sprache wird beim Anlegen per KI
          eingerichtet.
        </p>
      )}
    </div>
  );
}
