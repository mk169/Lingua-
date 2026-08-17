import { useState } from 'react';
import { useStore } from '../store';
import type { Cadence, Habit } from '../types';
import { Button } from '../ui';
import { todayISO } from '../lib/date';
import { HABIT_TEMPLATES } from '../lib/assessment';
import { CADENCES } from '../lib/labels';
import { habitStatus, isOnToday } from '../lib/habits';

/**
 * Die Gewohnheiten-Checkliste – eine Komponente für beide Orte.
 *
 * Auf dem Dashboard einer Sprache zeigt sie deren eigene Gewohnheiten, in der
 * Gesamtübersicht die aller Sprachen. Beide hängen am selben Store: Was hier
 * abgehakt wird, ist auch dort abgehakt. Zwei getrennte Listen, die dasselbe
 * meinen, wären die sichere Variante, dass eine von beiden nicht stimmt.
 */
export function HabitList({
  languageId,
  showLanguage = false,
  editable = true,
  compact = false,
}: {
  /** Ohne Angabe: die Gewohnheiten aller Sprachen. */
  languageId?: string;
  showLanguage?: boolean;
  editable?: boolean;
  compact?: boolean;
}) {
  const { state, addHabit, updateHabit, toggleHabit, deleteHabit } = useStore();
  const today = todayISO();

  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [cadence, setCadence] = useState<Cadence>('täglich');
  const [editId, setEditId] = useState<string | null>(null);

  const habits = state.habits.filter((h) => !languageId || h.languageId === languageId);
  // Was heute ansteht, steht oben; was sein Wochensoll hat, wandert nach unten.
  const onToday = habits.filter((h) => isOnToday(h, today));
  const fulfilled = habits.filter((h) => !isOnToday(h, today));
  const langName = (id: string) => state.languages.find((l) => l.id === id)?.name ?? '';
  const langEmoji = (id: string) => state.languages.find((l) => l.id === id)?.emoji ?? '';

  // Vorlagen, die es hier noch nicht gibt – Dubletten wären nur Rauschen.
  const have = new Set(habits.map((h) => h.title.trim().toLowerCase()));
  const templates = HABIT_TEMPLATES.filter((t) => !have.has(t.title.toLowerCase())).slice(0, 4);

  function save(t: string, c: Cadence, minutes: number) {
    if (!t.trim() || !languageId) return;
    addHabit({ languageId, title: t.trim(), cadence: c, minutes });
    setTitle('');
    setAdding(false);
  }

  if (habits.length === 0 && !editable) {
    return (
      <p className="tiny muted" style={{ margin: 0 }}>
        Noch keine Gewohnheiten angelegt.
      </p>
    );
  }

  return (
    <div className="stack" style={{ gap: 8 }}>
      {habits.length === 0 && !adding && (
        <p className="tiny muted" style={{ margin: 0 }}>
          Was neben den Übungen läuft: Podcast hören, Serie schauen, laut nachsprechen.
        </p>
      )}

      <div className="stack" style={{ gap: 4 }}>
        {onToday.map((h) =>
          editId === h.id ? (
            <HabitEditor
              key={h.id}
              habit={h}
              onSave={(patch) => {
                updateHabit(h.id, patch);
                setEditId(null);
              }}
              onDelete={() => {
                deleteHabit(h.id);
                setEditId(null);
              }}
              onCancel={() => setEditId(null)}
            />
          ) : (
            <HabitRow
              key={h.id}
              habit={h}
              today={today}
              compact={compact}
              label={showLanguage ? `${langEmoji(h.languageId)} ${langName(h.languageId)}` : null}
              onToggle={() => toggleHabit(h.id)}
              onEdit={editable ? () => setEditId(h.id) : null}
            />
          ),
        )}
      </div>

      {/* Wochensoll erfüllt: sichtbar, aber ruhig – und nicht als offen gezählt. */}
      {fulfilled.length > 0 && (
        <div className="stack" style={{ gap: 4 }}>
          <div className="tiny muted">Diese Woche erledigt</div>
          {fulfilled.map((h) => {
            const s = habitStatus(h, today);
            return (
              <div key={h.id} className="habit-row" style={{ opacity: 0.6 }}>
                <span className="small" style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: 'var(--ok)' }}>✓ </span>
                  {showLanguage && (
                    <span className="tiny muted" style={{ marginRight: 6 }}>
                      {langEmoji(h.languageId)} {langName(h.languageId)}
                    </span>
                  )}
                  {h.title}
                </span>
                <span className="tiny muted mono">
                  {s.done}/{s.target}
                </span>
                {editable && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditId(h.id)}
                    title="Bearbeiten"
                    aria-label="Gewohnheit bearbeiten"
                  >
                    ✎
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editable && languageId && (
        <>
          {adding ? (
            <div className="stack" style={{ gap: 8 }}>
              {templates.length > 0 && (
                <div className="row row-wrap" style={{ gap: 6 }}>
                  {templates.map((t) => (
                    <button
                      key={t.title}
                      className="pill tiny"
                      style={{ cursor: 'pointer', border: 0 }}
                      onClick={() => save(t.title, t.cadence, t.minutes)}
                    >
                      + {t.title}
                    </button>
                  ))}
                </div>
              )}
              <div className="row">
                <input
                  className="input"
                  value={title}
                  autoFocus
                  placeholder="Eigene Gewohnheit"
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && save(title, cadence, 10)}
                />
                <select
                  className="input"
                  style={{ maxWidth: 130 }}
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value as Cadence)}
                >
                  {CADENCES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Button size="sm" onClick={() => save(title, cadence, 10)} disabled={!title.trim()}>
                  Anlegen
                </Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setAdding(true)}>
              + Gewohnheit
            </Button>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Eine Zeile in der Heute-Liste.
 *
 * Rechts steht der Wochenstand statt des Takts: „2/3 diese Woche" sagt, wo man
 * ist – „3x/Woche" sagte nur, was man sich vorgenommen hatte.
 */
function HabitRow({
  habit,
  today,
  compact,
  label,
  onToggle,
  onEdit,
}: {
  habit: Habit;
  today: string;
  compact: boolean;
  label: string | null;
  onToggle: () => void;
  onEdit: (() => void) | null;
}) {
  const s = habitStatus(habit, today);
  const done = s.status === 'done';

  return (
    <div className="habit-row">
      <label className="row small" style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}>
        <input type="checkbox" checked={done} onChange={onToggle} />
        <span
          style={{
            flex: 1,
            minWidth: 0,
            opacity: done ? 0.55 : 1,
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {label && (
            <span className="tiny muted" style={{ marginRight: 6 }}>
              {label}
            </span>
          )}
          {habit.title}
        </span>
      </label>
      {s.mustToday && <span className="pill pill-accent tiny">heute nötig</span>}
      {!compact && (
        <span className="tiny muted mono" title={`${habit.cadence} · ${habit.minutes} Min`}>
          {s.done}/{s.target}
        </span>
      )}
      {onEdit && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={onEdit}
          title="Bearbeiten"
          aria-label="Gewohnheit bearbeiten"
        >
          ✎
        </button>
      )}
    </div>
  );
}

function HabitEditor({
  habit,
  onSave,
  onDelete,
  onCancel,
}: {
  habit: Habit;
  onSave: (patch: { title: string; cadence: Cadence; minutes: number }) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(habit.title);
  const [cadence, setCadence] = useState<Cadence>(habit.cadence);
  const [minutes, setMinutes] = useState(String(habit.minutes));

  return (
    <div className="row row-wrap" style={{ gap: 6 }}>
      <input
        className="input"
        style={{ flex: 1, minWidth: 140 }}
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' &&
          title.trim() &&
          onSave({ title: title.trim(), cadence, minutes: Number(minutes) || 10 })
        }
      />
      <select
        className="input"
        style={{ maxWidth: 120 }}
        value={cadence}
        onChange={(e) => setCadence(e.target.value as Cadence)}
      >
        {CADENCES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        className="input"
        style={{ maxWidth: 70 }}
        type="number"
        min={1}
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        aria-label="Minuten"
      />
      <Button
        size="sm"
        variant="primary"
        disabled={!title.trim()}
        onClick={() => onSave({ title: title.trim(), cadence, minutes: Number(minutes) || 10 })}
      >
        Sichern
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Abbrechen
      </Button>
      <button className="btn btn-ghost btn-sm" onClick={onDelete} aria-label="Löschen">
        ✕
      </button>
    </div>
  );
}
