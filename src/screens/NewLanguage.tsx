import { useState } from 'react';
import { useStore } from '../store';
import type { Cadence, CefrLevel, ContentType } from '../types';
import { Button, Card, Field, SectionTitle, useAsyncAction, useToast } from '../ui';
import { SEED_LANGUAGES, SUGGESTIONS, findSeed, type SeedLanguage } from '../data/seed';
import { describeLanguage } from '../lib/llm';
import { LEVEL_HINT, LEVEL_LABEL, LEVEL_LADDER, targetForStart } from '../lib/phase';
import { HABIT_TEMPLATES } from '../lib/assessment';
import { CADENCES, CONTENT_TYPES, TYPE_LABEL } from '../lib/labels';

interface Meta {
  name: string;
  nativeName: string;
  code: string;
  emoji: string;
  seed?: SeedLanguage;
}

interface HabitDraft {
  title: string;
  cadence: Cadence;
  minutes: number;
  /** Vorgeschlagene Gewohnheiten sind angehakt, aber abwählbar. */
  on: boolean;
}

interface ContentDraft {
  type: ContentType;
  title: string;
}

const STEPS = ['Sprache', 'Niveau', 'Inhalte', 'Gewohnheiten'] as const;

/**
 * Einrichtung einer neuen Sprache in vier Schritten.
 *
 * Die drei Angaben nach der Sprache sind der Rahmen, in dem das Lernen
 * stattfindet: Wo stehe ich, womit umgebe ich mich, was mache ich täglich.
 * Sie alle sind übersprungbar – wer nur schnell anfangen will, klickt durch.
 */
export function NewLanguage({ onCancel }: { onCancel: () => void }) {
  const { state, addLanguage } = useStore();
  const notify = useToast();
  const { busy, run } = useAsyncAction();

  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [name, setName] = useState('');
  const [startLevel, setStartLevel] = useState<CefrLevel>('A1');
  const [content, setContent] = useState<ContentDraft[]>([]);
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState<ContentType>('podcast');
  const [habits, setHabits] = useState<HabitDraft[]>(
    HABIT_TEMPLATES.slice(0, 4).map((t, i) => ({ ...t, on: i < 3 })),
  );
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCadence, setHabitCadence] = useState<Cadence>('täglich');

  const hasKey = Boolean(state.settings.apiKey);
  const existingNames = new Set(state.languages.map((l) => l.name.toLowerCase()));
  const available = SEED_LANGUAGES.filter((s) => !existingNames.has(s.name.toLowerCase()));

  /** Schritt 1: Sprache auflösen – Startpaket, KI oder leer. */
  async function pickLanguage(rawName: string) {
    const trimmed = rawName.trim();
    if (!trimmed) return;
    if (existingNames.has(trimmed.toLowerCase())) {
      notify('Diese Sprache gibt es schon.', 'error');
      return;
    }

    const seed = findSeed(trimmed);
    if (seed) {
      setMeta({
        name: seed.name,
        nativeName: seed.nativeName,
        code: seed.code,
        emoji: seed.emoji,
        seed,
      });
      setStep(1);
      return;
    }

    if (!hasKey) {
      setMeta({ name: trimmed, nativeName: trimmed, code: 'en-US', emoji: '🌍' });
      setStep(1);
      return;
    }

    const info = await run(() => describeLanguage(state.settings, trimmed));
    if (!info) return;
    setMeta({
      name: trimmed,
      nativeName: info.nativeName,
      code: info.code,
      emoji: info.emoji,
    });
    setStep(1);
  }

  function finish() {
    if (!meta) return;
    addLanguage({
      ...meta,
      startLevel,
      habits: habits
        .filter((h) => h.on && h.title.trim())
        .map((h) => ({ title: h.title.trim(), cadence: h.cadence, minutes: h.minutes })),
      content: content.map((c) => ({ type: c.type, title: c.title })),
    });
    notify(
      meta.seed
        ? `${meta.name} angelegt – Startpaket mit ${meta.seed.words.length} Wörtern geladen.`
        : `${meta.name} angelegt.`,
    );
  }

  return (
    <div className="picker">
      <div className="row">
        <div>
          <div className="eyebrow">Neue Sprache</div>
          <h1 style={{ marginTop: 6 }}>
            {step === 0 ? 'Welche Sprache?' : `${meta?.emoji} ${meta?.name} einrichten`}
          </h1>
        </div>
        <span className="spacer" />
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Abbrechen
        </Button>
      </div>

      <div className="steps">
        {STEPS.map((label, i) => (
          <button
            key={label}
            className="step"
            data-state={i === step ? 'current' : i < step ? 'done' : 'future'}
            disabled={i > step || (i > 0 && !meta)}
            onClick={() => setStep(i)}
          >
            <span className="step-num">{i + 1}</span>
            {label}
          </button>
        ))}
      </div>

      {/* ── 1 · Sprache ── */}
      {step === 0 && (
        <Card className="stack">
          {available.length > 0 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Mit Startpaket
              </div>
              <div className="row row-wrap">
                {available.map((s) => (
                  <Button key={s.name} size="sm" disabled={busy} onClick={() => pickLanguage(s.name)}>
                    {s.emoji} {s.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Field
            label="Andere Sprache"
            hint={
              hasKey
                ? 'Wird per KI eingerichtet: Eigenbezeichnung, Sprachausgabe und Anfängerhinweis.'
                : 'Ohne API-Schlüssel wird die Sprache leer angelegt – Vokabeln kannst du danach hochladen.'
            }
          >
            <div className="row">
              <input
                className="input"
                placeholder="z.B. Schwedisch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && pickLanguage(name)}
              />
              <Button variant="primary" loading={busy} disabled={!name.trim()} onClick={() => pickLanguage(name)}>
                Weiter
              </Button>
            </div>
          </Field>

          <div className="row row-wrap">
            {SUGGESTIONS.filter((s) => !existingNames.has(s.toLowerCase())).map((s) => (
              <button key={s} className="pill" onClick={() => setName(s)} disabled={busy}>
                {s}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* ── 2 · Niveau ── */}
      {step === 1 && (
        <Card className="stack">
          <SectionTitle
            title="Wo stehst du gerade?"
            hint="Bestimmt, welches Skelett der erste Sprint abdeckt"
          />
          <div className="stack" style={{ gap: 8 }}>
            {LEVEL_LADDER.map((level) => (
              <button
                key={level}
                className="choice"
                data-active={startLevel === level}
                onClick={() => setStartLevel(level)}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, display: 'block' }}>{LEVEL_LABEL[level]}</span>
                  <span className="tiny muted">{LEVEL_HINT[level]}</span>
                </span>
                {startLevel === level && <span style={{ color: 'var(--accent)' }}>✓</span>}
              </button>
            ))}
          </div>

          <p className="tiny muted" style={{ margin: 0 }}>
            Der erste Sprint zielt damit auf <strong>{targetForStart(startLevel)}</strong>. Ein
            Einstufungstest, der das misst statt schätzt, kommt später – bis dahin ist die eigene
            Einschätzung genauer als nichts, und ändern lässt sie sich in den Einstellungen.
          </p>

          <div className="row">
            <Button variant="ghost" onClick={() => setStep(0)}>
              Zurück
            </Button>
            <span className="spacer" />
            <Button variant="primary" onClick={() => setStep(2)}>
              Weiter
            </Button>
          </div>
        </Card>
      )}

      {/* ── 3 · Inhalte ── */}
      {step === 2 && (
        <Card className="stack">
          <SectionTitle
            title="Womit umgibst du dich?"
            hint="Optional – jederzeit ergänzbar"
          />
          <p className="small muted" style={{ margin: 0 }}>
            Podcasts, Serien, Bücher, Kanäle: alles, was neben den Übungen auf {meta?.name} läuft.
            Trag ein, was du schon kennst – der Rest kommt später dazu.
          </p>

          {content.length > 0 && (
            <div className="stack" style={{ gap: 4 }}>
              {content.map((c, i) => (
                <div key={i} className="row small">
                  <span className="tiny">{TYPE_LABEL[c.type]}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>{c.title}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setContent(content.filter((_, j) => j !== i))}
                    aria-label="Entfernen"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="row">
            <select
              className="input"
              style={{ maxWidth: 140 }}
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABEL[t]}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Titel, z.B. „Coffee Break“"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' || !contentTitle.trim()) return;
                setContent([...content, { type: contentType, title: contentTitle.trim() }]);
                setContentTitle('');
              }}
            />
            <Button
              size="sm"
              disabled={!contentTitle.trim()}
              onClick={() => {
                setContent([...content, { type: contentType, title: contentTitle.trim() }]);
                setContentTitle('');
              }}
            >
              + Inhalt
            </Button>
          </div>

          <div className="row">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Zurück
            </Button>
            <span className="spacer" />
            <Button variant="primary" onClick={() => setStep(3)}>
              Weiter
            </Button>
          </div>
        </Card>
      )}

      {/* ── 4 · Gewohnheiten ── */}
      {step === 3 && (
        <Card className="stack">
          <SectionTitle
            title="Tägliche Gewohnheiten"
            hint={`${habits.filter((h) => h.on).length} ausgewählt`}
          />
          <p className="small muted" style={{ margin: 0 }}>
            Vorschläge zum Anfangen. Abwählen, umbenennen, Takt und Minuten ändern – oder eigene
            ergänzen. Sie stehen danach im Dashboard dieser Sprache und in der Gesamtübersicht.
          </p>

          <div className="stack" style={{ gap: 6 }}>
            {habits.map((h, i) => (
              <div key={i} className="row row-wrap" style={{ gap: 6 }}>
                <input
                  type="checkbox"
                  checked={h.on}
                  onChange={() =>
                    setHabits(habits.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))
                  }
                  aria-label="Übernehmen"
                />
                <input
                  className="input"
                  style={{ flex: 1, minWidth: 140, opacity: h.on ? 1 : 0.5 }}
                  value={h.title}
                  onChange={(e) =>
                    setHabits(habits.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                  }
                />
                <select
                  className="input"
                  style={{ maxWidth: 120, opacity: h.on ? 1 : 0.5 }}
                  value={h.cadence}
                  onChange={(e) =>
                    setHabits(
                      habits.map((x, j) =>
                        j === i ? { ...x, cadence: e.target.value as Cadence } : x,
                      ),
                    )
                  }
                >
                  {CADENCES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  style={{ maxWidth: 70, opacity: h.on ? 1 : 0.5 }}
                  type="number"
                  min={1}
                  value={h.minutes}
                  aria-label="Minuten"
                  onChange={(e) =>
                    setHabits(
                      habits.map((x, j) =>
                        j === i ? { ...x, minutes: Number(e.target.value) || 1 } : x,
                      ),
                    )
                  }
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setHabits(habits.filter((_, j) => j !== i))}
                  aria-label="Entfernen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="row">
            <input
              className="input"
              placeholder="Eigene Gewohnheit"
              value={habitTitle}
              onChange={(e) => setHabitTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' || !habitTitle.trim()) return;
                setHabits([
                  ...habits,
                  { title: habitTitle.trim(), cadence: habitCadence, minutes: 10, on: true },
                ]);
                setHabitTitle('');
              }}
            />
            <select
              className="input"
              style={{ maxWidth: 130 }}
              value={habitCadence}
              onChange={(e) => setHabitCadence(e.target.value as Cadence)}
            >
              {CADENCES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              disabled={!habitTitle.trim()}
              onClick={() => {
                setHabits([
                  ...habits,
                  { title: habitTitle.trim(), cadence: habitCadence, minutes: 10, on: true },
                ]);
                setHabitTitle('');
              }}
            >
              + Gewohnheit
            </Button>
          </div>

          <div className="row">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Zurück
            </Button>
            <span className="spacer" />
            <Button variant="primary" onClick={finish}>
              {meta?.name} anlegen
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
