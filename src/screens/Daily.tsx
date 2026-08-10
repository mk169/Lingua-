import { useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { Cadence, ContentItem, ContentType } from '../types';
import { Bar, Button, Card, Empty, Field, Modal, SectionTitle } from '../ui';
import { todayISO } from '../lib/date';

const TYPE_LABEL: Record<ContentType, string> = {
  buch: '📕 Buch',
  hörbuch: '🎧 Hörbuch',
  artikel: '📄 Artikel',
  podcast: '🎙 Podcast',
  video: '▶ Video',
  serie: '📺 Serie',
};

const HABIT_TEMPLATES: { title: string; cadence: Cadence; minutes: number }[] = [
  { title: 'Morgens 10 Min SRS', cadence: 'täglich', minutes: 10 },
  { title: 'Mittags Podcast hören', cadence: 'täglich', minutes: 15 },
  { title: 'Abends Shadowing', cadence: 'täglich', minutes: 5 },
  { title: 'Voice-Note aufnehmen', cadence: '3x/Woche', minutes: 10 },
  { title: 'Tandem-Gespräch', cadence: 'wöchentlich', minutes: 30 },
  { title: 'Serie ohne Untertitel', cadence: 'wöchentlich', minutes: 40 },
];

/** Alltags-Modus (Phase 3): Habits, Inhalte-Bibliothek, Wochenrhythmus. */
export function Daily({ lang }: { lang: Language }) {
  const { state, addHabit, toggleHabit, deleteHabit, addContent, updateContent, deleteContent } =
    useStore();
  const today = todayISO();

  const [addingHabit, setAddingHabit] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCadence, setHabitCadence] = useState<Cadence>('täglich');
  const [habitMinutes, setHabitMinutes] = useState(10);

  const [addingContent, setAddingContent] = useState(false);
  const [cTitle, setCTitle] = useState('');
  const [cType, setCType] = useState<ContentType>('podcast');
  const [cUrl, setCUrl] = useState('');

  const habits = state.habits.filter((h) => h.languageId === lang.id);
  const content = state.content.filter((c) => c.languageId === lang.id);

  // Letzte 7 Tage Aktivität
  const week = useMemo(() => {
    const days: { date: string; minutes: number; reviews: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = todayISO(d);
      const log = state.logs.find((l) => l.date === date && l.languageId === lang.id);
      days.push({ date, minutes: log?.minutes ?? 0, reviews: log?.reviews ?? 0 });
    }
    return days;
  }, [state.logs, lang.id]);

  const doneToday = habits.filter((h) => h.done.includes(today)).length;

  function submitHabit(title = habitTitle, cadence = habitCadence, minutes = habitMinutes) {
    if (!title.trim()) return;
    addHabit({ languageId: lang.id, title: title.trim(), cadence, minutes });
    setHabitTitle('');
    setAddingHabit(false);
  }

  function submitContent() {
    if (!cTitle.trim()) return;
    addContent({
      languageId: lang.id,
      type: cType,
      title: cTitle.trim(),
      url: cUrl.trim() || undefined,
      status: 'geplant',
      progress: 0,
      notes: '',
    });
    setCTitle('');
    setCUrl('');
    setAddingContent(false);
  }

  return (
    <div className="stack">
      <SectionTitle
        title="Alltags-Modus"
        hint="Nach dem Sprint: Gewohnheiten halten, Inhalte konsumieren, dranbleiben"
      />

      {/* Wochenrhythmus */}
      <Card>
        <div className="row" style={{ marginBottom: 14 }}>
          <div>
            <div className="eyebrow">Diese Woche</div>
            <div className="mono" style={{ fontSize: 24 }}>
              {week.reduce((sum, d) => sum + d.reviews, 0)}
              <span className="small muted"> Wiederholungen</span>
            </div>
          </div>
          <span className="spacer" />
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 24 }}>
              {doneToday}/{habits.length || 0}
            </div>
            <div className="tiny muted">Habits heute</div>
          </div>
        </div>

        <div className="row" style={{ gap: 6, alignItems: 'flex-end', height: 60 }}>
          {week.map((d) => {
            const max = Math.max(...week.map((x) => x.reviews), 10);
            const h = Math.max(3, (d.reviews / max) * 56);
            return (
              <div key={d.date} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: h,
                    background: d.date === today ? 'var(--accent)' : 'var(--surface-2)',
                    borderRadius: 3,
                    border: '1px solid var(--line)',
                  }}
                  title={`${d.reviews} Wiederholungen`}
                />
                <div className="tiny muted" style={{ marginTop: 4 }}>
                  {new Date(d.date).toLocaleDateString('de-DE', { weekday: 'narrow' })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid-2">
        {/* Habits */}
        <Card>
          <SectionTitle
            title="Lern-Habits"
            action={
              <Button size="sm" onClick={() => setAddingHabit(true)}>
                + Habit
              </Button>
            }
          />
          {habits.length === 0 ? (
            <div className="stack">
              <p className="small muted">
                Nach dem 30-Tage-Sprint hält die Routine das Gelernte. Wähle einen Startpunkt:
              </p>
              <div className="row row-wrap">
                {HABIT_TEMPLATES.map((t) => (
                  <button
                    key={t.title}
                    className="pill"
                    style={{ cursor: 'pointer' }}
                    onClick={() => submitHabit(t.title, t.cadence, t.minutes)}
                  >
                    + {t.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="stack" style={{ gap: 8 }}>
              {habits.map((h) => {
                const done = h.done.includes(today);
                const last7 = h.done.filter((d) => {
                  const diff = (new Date(today).getTime() - new Date(d).getTime()) / 86_400_000;
                  return diff >= 0 && diff < 7;
                }).length;
                return (
                  <div key={h.id} className="row">
                    <button
                      className="check"
                      data-on={done}
                      onClick={() => toggleHabit(h.id)}
                      aria-label={done ? 'Rückgängig' : 'Erledigt'}
                    >
                      ✓
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="small" style={{ fontWeight: 550 }}>
                        {h.title}
                      </div>
                      <div className="tiny muted">
                        {h.cadence} · {h.minutes} Min · {last7}× in 7 Tagen
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => deleteHabit(h.id)}>
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Inhalte */}
        <Card>
          <SectionTitle
            title="Inhalte"
            action={
              <Button size="sm" onClick={() => setAddingContent(true)}>
                + Inhalt
              </Button>
            }
          />
          {content.length === 0 ? (
            <Empty
              icon="◫"
              title="Nichts organisiert"
              hint="Bücher, Hörbücher, Artikel, Podcasts – alles an einem Ort, mit Fortschritt."
            />
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              {content.map((item) => (
                <ContentRow
                  key={item.id}
                  item={item}
                  onUpdate={(patch) => updateContent(item.id, patch)}
                  onDelete={() => deleteContent(item.id)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card style={{ background: 'var(--surface-2)' }}>
        <div className="eyebrow">Sprach-Slots</div>
        <p className="small muted" style={{ marginTop: 6 }}>
          Eine Sprache im Fokus (30–45 Min täglich), bis zu drei in Wartung (15–30 Min, 3–5×
          pro Woche). Den Slot dieser Sprache stellst du in den Einstellungen um.
        </p>
        <div className="row row-wrap" style={{ marginTop: 10 }}>
          {state.languages.map((l) => (
            <span key={l.id} className={`pill ${l.slot === 'focus' ? 'pill-accent' : ''}`}>
              {l.emoji} {l.name} · {l.slot === 'focus' ? 'Fokus' : 'Wartung'}
            </span>
          ))}
        </div>
      </Card>

      <Modal
        open={addingHabit}
        onClose={() => setAddingHabit(false)}
        title="Habit anlegen"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddingHabit(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" onClick={() => submitHabit()}>
              Anlegen
            </Button>
          </>
        }
      >
        <Field label="Was?">
          <input
            className="input"
            value={habitTitle}
            onChange={(e) => setHabitTitle(e.target.value)}
            placeholder="z.B. Morgens 10 Min SRS"
            autoFocus
          />
        </Field>
        <div className="row">
          <Field label="Rhythmus">
            <select
              className="select"
              value={habitCadence}
              onChange={(e) => setHabitCadence(e.target.value as Cadence)}
            >
              <option>täglich</option>
              <option>3x/Woche</option>
              <option>wöchentlich</option>
            </select>
          </Field>
          <Field label="Minuten">
            <input
              className="input"
              type="number"
              min={5}
              max={120}
              value={habitMinutes}
              onChange={(e) => setHabitMinutes(Number(e.target.value))}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={addingContent}
        onClose={() => setAddingContent(false)}
        title="Inhalt hinzufügen"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddingContent(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" onClick={submitContent}>
              Hinzufügen
            </Button>
          </>
        }
      >
        <Field label="Titel">
          <input
            className="input"
            value={cTitle}
            onChange={(e) => setCTitle(e.target.value)}
            autoFocus
          />
        </Field>
        <div className="row">
          <Field label="Art">
            <select
              className="select"
              value={cType}
              onChange={(e) => setCType(e.target.value as ContentType)}
            >
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Link (optional)">
            <input className="input" value={cUrl} onChange={(e) => setCUrl(e.target.value)} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}

function ContentRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: ContentItem;
  onUpdate: (patch: Partial<ContentItem>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="stack" style={{ gap: 6 }}>
      <div className="row">
        <span className="tiny">{TYPE_LABEL[item.type]}</span>
        <span style={{ flex: 1, fontWeight: 550, fontSize: 14 }}>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </span>
        <select
          className="select"
          style={{ width: 'auto', padding: '3px 6px', fontSize: 12 }}
          value={item.status}
          onChange={(e) => onUpdate({ status: e.target.value as ContentItem['status'] })}
        >
          <option value="geplant">geplant</option>
          <option value="aktiv">aktiv</option>
          <option value="fertig">fertig</option>
        </select>
        <button className="btn btn-ghost btn-sm" onClick={onDelete}>
          ✕
        </button>
      </div>
      <div className="row">
        <input
          type="range"
          min={0}
          max={100}
          value={item.progress}
          onChange={(e) => onUpdate({ progress: Number(e.target.value) })}
          style={{ flex: 1 }}
        />
        <span className="tiny muted mono" style={{ width: 36, textAlign: 'right' }}>
          {item.progress}%
        </span>
      </div>
      <Bar value={item.progress} max={100} />
    </div>
  );
}
