import { useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { Cadence, ContentType } from '../types';
import { Button, Card, SectionTitle } from '../ui';
import { todayISO } from '../lib/date';
import { HABIT_TEMPLATES } from '../lib/assessment';

const TYPE_LABEL: Record<ContentType, string> = {
  buch: '📕 Buch',
  hörbuch: '🎧 Hörbuch',
  artikel: '📄 Artikel',
  podcast: '🎙 Podcast',
  video: '▶ Video',
  serie: '📺 Serie',
};

/**
 * Gewohnheiten und Inhalte direkt im Dashboard – ohne Umweg über den
 * Alltags-Modus und ohne Phasensperre.
 *
 * Der Fokus-Modus in Phase 1 begrenzt bewusst die *Lernmodule*. Eine
 * Podcast-Gewohnheit oder eine Leseliste konkurriert damit nicht: Sie ist der
 * Rahmen um die tägliche halbe Stunde, nicht Teil davon. Wer am Tag 3 eine
 * Serie notieren will, soll das tun können, statt bis Tag 31 zu warten.
 *
 * Die vollständige Verwaltung mit Wochenbilanz und Fortschritt bleibt im
 * Alltags-Modus; hier stehen nur Anlegen und Abhaken.
 */
export function HabitsAndContent({ lang }: { lang: Language }) {
  const { state, addHabit, toggleHabit, addContent, updateContent } = useStore();
  const today = todayISO();

  const [habitTitle, setHabitTitle] = useState('');
  const [cadence, setCadence] = useState<Cadence>('täglich');
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState<ContentType>('podcast');
  const [open, setOpen] = useState<'habit' | 'content' | null>(null);

  const habits = state.habits.filter((h) => h.languageId === lang.id);
  const content = state.content.filter((c) => c.languageId === lang.id);
  const doneToday = habits.filter((h) => h.done.includes(today)).length;

  // Vorlagen, die noch nicht angelegt sind – Dubletten wären nur Rauschen.
  const have = new Set(habits.map((h) => h.title.trim().toLowerCase()));
  const templates = HABIT_TEMPLATES.filter((t) => !have.has(t.title.toLowerCase())).slice(0, 4);

  function saveHabit(title: string, c: Cadence, minutes: number) {
    if (!title.trim()) return;
    addHabit({ languageId: lang.id, title: title.trim(), cadence: c, minutes });
    setHabitTitle('');
    setOpen(null);
  }

  function saveContent() {
    if (!contentTitle.trim()) return;
    addContent({
      languageId: lang.id,
      type: contentType,
      title: contentTitle.trim(),
      status: 'geplant',
      progress: 0,
      notes: '',
    });
    setContentTitle('');
    setOpen(null);
  }

  return (
    <Card>
      <SectionTitle
        title="Gewohnheiten & Inhalte"
        hint={habits.length > 0 ? `${doneToday}/${habits.length} heute erledigt` : undefined}
      />

      {/* ── Gewohnheiten ── */}
      <div className="stack" style={{ gap: 6 }}>
        {habits.length === 0 && open !== 'habit' && (
          <p className="tiny muted" style={{ margin: 0 }}>
            Was neben den Übungen läuft: Podcast hören, Serie schauen, laut nachsprechen.
          </p>
        )}
        {habits.map((h) => {
          const done = h.done.includes(today);
          return (
            <label key={h.id} className="row small" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={done} onChange={() => toggleHabit(h.id)} />
              <span style={{ flex: 1, opacity: done ? 0.55 : 1 }}>{h.title}</span>
              <span className="tiny muted">
                {h.cadence} · {h.minutes}′
              </span>
            </label>
          );
        })}
      </div>

      {open === 'habit' ? (
        <div className="stack" style={{ gap: 8, marginTop: 10 }}>
          <div className="row row-wrap" style={{ gap: 6 }}>
            {templates.map((t) => (
              <button
                key={t.title}
                className="pill tiny"
                style={{ cursor: 'pointer', border: 0 }}
                onClick={() => saveHabit(t.title, t.cadence, t.minutes)}
              >
                + {t.title}
              </button>
            ))}
          </div>
          <div className="row">
            <input
              className="input"
              value={habitTitle}
              autoFocus
              placeholder="Eigene Gewohnheit"
              onChange={(e) => setHabitTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveHabit(habitTitle, cadence, 10)}
            />
            <select
              className="input"
              style={{ maxWidth: 130 }}
              value={cadence}
              onChange={(e) => setCadence(e.target.value as Cadence)}
            >
              <option value="täglich">täglich</option>
              <option value="3x/Woche">3x/Woche</option>
              <option value="wöchentlich">wöchentlich</option>
            </select>
            <Button size="sm" onClick={() => saveHabit(habitTitle, cadence, 10)} disabled={!habitTitle.trim()}>
              Anlegen
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="ghost" style={{ marginTop: 8 }} onClick={() => setOpen('habit')}>
          + Gewohnheit
        </Button>
      )}

      <hr className="divider" />

      {/* ── Inhalte ── */}
      <div className="stack" style={{ gap: 6 }}>
        {content.length === 0 && open !== 'content' && (
          <p className="tiny muted" style={{ margin: 0 }}>
            Bücher, Hörbücher, Podcasts, Serien – was du auf {lang.name} liest und hörst.
          </p>
        )}
        {content.map((c) => (
          <div key={c.id} className="row small">
            <span className="tiny">{TYPE_LABEL[c.type]}</span>
            <span style={{ flex: 1, minWidth: 0 }}>{c.title}</span>
            <select
              className="input tiny"
              style={{ maxWidth: 110, padding: '2px 6px' }}
              value={c.status}
              onChange={(e) => updateContent(c.id, { status: e.target.value as typeof c.status })}
            >
              <option value="geplant">geplant</option>
              <option value="aktiv">aktiv</option>
              <option value="fertig">fertig</option>
            </select>
          </div>
        ))}
      </div>

      {open === 'content' ? (
        <div className="row" style={{ marginTop: 10 }}>
          <select
            className="input"
            style={{ maxWidth: 140 }}
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
          >
            {(Object.keys(TYPE_LABEL) as ContentType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          <input
            className="input"
            value={contentTitle}
            autoFocus
            placeholder="Titel"
            onChange={(e) => setContentTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveContent()}
          />
          <Button size="sm" onClick={saveContent} disabled={!contentTitle.trim()}>
            Anlegen
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="ghost" style={{ marginTop: 8 }} onClick={() => setOpen('content')}>
          + Inhalt
        </Button>
      )}
    </Card>
  );
}
