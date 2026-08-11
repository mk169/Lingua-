import { useEffect, useState } from 'react';
import type { Exercise } from '../types';
import type { Language } from '../types-view';
import { Button, Card, Bar } from '../ui';
import { similarity, speak } from '../lib/speech';
import { useStore } from '../store';

const TYPE_LABEL: Record<string, string> = {
  cloze: 'Lücke füllen',
  transform: 'Umformen',
  order: 'Satz ordnen',
  build: 'Satz bilden',
  translate: 'Übersetzen',
  choice: 'Verstehen',
};

const ROUND_SIZE = 10;

type Result = 'correct' | 'close' | 'wrong';

/**
 * Eine Aufgabe pro Bildschirm. Ungelöste zuerst, falsch beantwortete kommen am
 * Rundenende erneut – wiederholen ist der Punkt der Übung.
 */
export function ExerciseSession({
  exercises,
  lang,
  title,
  solvedIds,
  onSolved,
  onClose,
}: {
  exercises: Exercise[];
  lang: Language;
  title: string;
  solvedIds: Set<string>;
  onSolved: (exerciseId: string, solved: boolean) => void;
  onClose: () => void;
}) {
  // Die Runde ist beim Öffnen fertig sortiert (fällig → neu → Rest) und wird
  // hier eingefroren, damit sie sich beim Beantworten nicht unter der Hand
  // umsortiert.
  const [queue, setQueue] = useState<Exercise[]>(() => exercises.slice(0, ROUND_SIZE));
  const [pos, setPos] = useState(0);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [stats, setStats] = useState({ right: 0, wrong: 0 });
  const [repeated, setRepeated] = useState(false);
  const [reported, setReported] = useState(false);

  const { state, updateSettings, reportExercise } = useStore();
  const listenMode = state.settings.listenMode;
  const current = queue[pos];
  const total = queue.length;
  // Im Hörmodus bleibt der Satz verdeckt, bis geantwortet wurde.
  const hidden = listenMode && current?.type === 'choice' && !result;

  // Hörverstehen ist der Engpass im echten Gespräch, Lesen geht immer besser.
  // Deshalb wird im Hörmodus automatisch abgespielt statt auf einen Klick zu warten.
  useEffect(() => {
    if (!hidden || !current) return;
    speak(current.prompt.split('\n\n')[0], lang.code);
  }, [hidden, current, lang.code]);

  function check(answer: string) {
    if (!current || result) return;
    const hit =
      current.type === 'choice'
        ? answer === current.answer
        : similarity(answer, current.answer) > 0.95;
    const close = !hit && current.type !== 'choice' && similarity(answer, current.answer) > 0.75;

    setResult(hit ? 'correct' : close ? 'close' : 'wrong');
    setStats((s) => (hit ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 }));
    onSolved(current.id, hit);

    if (hit) speak(spoken(current), lang.code);
    else if (!repeated) {
      // Nur einmal nachlegen, sonst wächst die Runde endlos.
      setQueue((q) => [...q, current]);
    }
  }

  function next() {
    setValue('');
    setResult(null);
    setShowHint(false);
    setReported(false);
    if (pos + 1 >= queue.length) setRepeated(true);
    setPos((p) => p + 1);
  }

  if (!current) {
    return (
      <Card>
        <div className="stack" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>{stats.wrong === 0 ? '✓' : '·'}</div>
          <div style={{ fontWeight: 600 }}>Runde fertig</div>
          <p className="small muted">
            {stats.right} richtig, {stats.wrong} daneben.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Button variant="primary" onClick={onClose}>
              Zurück zur Übersicht
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const [text, question] = current.prompt.split('\n\n');

  return (
    <Card>
      <div className="stack">
        <div className="row">
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Schließen">
            ←
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tiny muted">{title}</div>
            <Bar value={pos} max={total} />
          </div>
          <span className="tiny muted mono">
            {Math.min(pos + 1, total)}/{total}
          </span>
        </div>

        <div className="row">
          <span className="pill tiny">{TYPE_LABEL[current.type] ?? current.type}</span>
          {solvedIds.has(current.id) && (
            <span className="tiny" style={{ color: 'var(--ok)' }}>
              ✓ schon gelöst
            </span>
          )}
          <span className="spacer" />
          {current.type === 'choice' && (
            <button
              className={`pill tiny ${listenMode ? 'pill-accent' : ''}`}
              style={{ cursor: 'pointer', border: 0 }}
              onClick={() => updateSettings({ listenMode: !listenMode })}
              title="Satz zuerst nur hören, Text erst nach der Antwort"
            >
              {listenMode ? '🎧 Hören' : '👁 Lesen'}
            </button>
          )}
        </div>

        {current.type === 'choice' ? (
          <div className="stack">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => speak(text, lang.code)}
                aria-label={hidden ? 'Nochmal abspielen' : 'Vorlesen'}
              >
                ♪
              </button>
              {hidden ? (
                <div className="small muted" style={{ fontSize: 15 }}>
                  Hör zu und beantworte die Frage. Nochmal abspielen mit ♪ – den Text gibt es
                  nach der Antwort.
                </div>
              ) : (
                <div className="target-text" style={{ fontSize: 17 }}>
                  {text}
                </div>
              )}
            </div>
            <div style={{ fontWeight: 600 }}>{question}</div>
            <div className="stack" style={{ gap: 8 }}>
              {current.options?.map((opt) => {
                const picked = value === opt;
                const isAnswer = opt === current.answer;
                const tone = !result
                  ? undefined
                  : isAnswer
                    ? 'var(--ok)'
                    : picked
                      ? 'var(--danger)'
                      : undefined;
                return (
                  <button
                    key={opt}
                    className="btn"
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderColor: tone ?? (picked ? 'var(--accent)' : undefined),
                      color: tone,
                    }}
                    disabled={!!result}
                    onClick={() => {
                      setValue(opt);
                      check(opt);
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="stack">
            <div className="target-text" style={{ fontSize: 17 }}>
              {current.prompt}
            </div>
            <div className="row">
              <input
                className="input"
                value={value}
                autoFocus
                placeholder={current.type === 'cloze' ? 'Fehlendes Wort' : 'Deine Antwort'}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  if (result) next();
                  else if (value.trim()) check(value);
                }}
              />
              {result ? (
                <Button variant="primary" onClick={next}>
                  Weiter
                </Button>
              ) : (
                <Button onClick={() => check(value)} disabled={!value.trim()}>
                  Prüfen
                </Button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="stack fade-in" style={{ gap: 8 }}>
            <div className="small">
              {result === 'correct' && <span style={{ color: 'var(--ok)' }}>✓ Richtig.</span>}
              {result === 'close' && (
                <span style={{ color: 'var(--warn)' }}>
                  Fast – achte auf die Details: <span className="fix">{current.answer}</span>
                </span>
              )}
              {result === 'wrong' && (
                <span>
                  <span style={{ color: 'var(--danger)' }}>Noch nicht.</span> Lösung:{' '}
                  <span className="fix target-text">{current.answer}</span>
                </span>
              )}
            </div>
            {result !== 'correct' && current.hint && <p className="tiny muted">{current.hint}</p>}
            {current.type === 'choice' && (
              <Button variant="primary" onClick={next}>
                Weiter
              </Button>
            )}
            {/*
              Erst nach der Auflösung, sonst wäre der Knopf ein Weg, sich die
              Lösung anzusehen. Der Katalog ist von Hand geschrieben und nicht
              muttersprachlich geprüft – ohne Meldeweg bliebe ein falscher Satz
              stehen und würde von allen mitgelernt.
            */}
            <button
              className="tiny muted"
              style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer' }}
              onClick={() => {
                if (reported) return;
                reportExercise({
                  exerciseId: current.id,
                  languageId: lang.id,
                  prompt: current.prompt,
                  answer: current.answer,
                });
                setReported(true);
              }}
            >
              {reported ? '✓ Gemeldet – danke.' : 'Lösung stimmt nicht?'}
            </button>
          </div>
        )}

        {!result && current.hint && (
          <button
            className="tiny muted"
            style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer' }}
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? `Tipp: ${current.hint}` : 'Tipp anzeigen'}
          </button>
        )}
      </div>
    </Card>
  );
}

/** Vorgelesen wird immer der zielsprachliche Teil, nie die deutsche Aufgabe. */
function spoken(ex: Exercise): string {
  if (ex.type === 'choice') return ex.prompt.split('\n\n')[0];
  if (ex.type === 'cloze') return ex.prompt.replace('___', ex.answer);
  return ex.answer;
}
