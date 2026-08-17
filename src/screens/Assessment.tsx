import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language, View } from '../types-view';
import type { AssessmentArea } from '../types';
import { Bar, Button, Card, Empty, SectionTitle, useToast } from '../ui';
import { getPhase } from '../lib/phase';
import { todayISO } from '../lib/date';
import { similarity, speak } from '../lib/speech';
import { loadExercises } from '../data/exercises';
import { useTimeOnTask } from '../lib/useTimeOnTask';
import { assessSummary } from '../lib/llm';
import {
  AREA_LABEL,
  MIN_QUESTIONS,
  buildAssessment,
  emptyAreas,
  levelFor,
  pct,
  ruleVerdict,
  suggestHabits,
  totalPct,
  type Areas,
  type AssessmentQuestion,
  type HabitSuggestion,
} from '../lib/assessment';

type Stage = 'intro' | 'test' | 'result';

interface Answer {
  question: AssessmentQuestion;
  given: string;
  correct: boolean;
}

/**
 * Standortbestimmung – der Test, den `phase.ts` für Tag 30 verspricht.
 *
 * Wichtig: Dieser Screen ruft weder `markExercise` noch `reviewCard` auf. Der
 * Test misst den Stand; würde er dabei Fälligkeiten und Ease-Werte verstellen,
 * veränderte das Messinstrument die gemessene Größe. Bitte nicht "reparieren".
 */
export function Assessment({ lang, go }: { lang: Language; go: (view: View) => void }) {
  const { state, addAssessment, addHabit } = useStore();
  const notify = useToast();
  const today = todayISO();
  const phase = getPhase(lang, today);
  useTimeOnTask(lang.id);

  const [stage, setStage] = useState<Stage>('intro');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [pos, setPos] = useState(0);
  const [value, setValue] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [catalog, setCatalog] = useState<Parameters<typeof buildAssessment>[1]>([]);
  const [verdict, setVerdict] = useState('');
  const [thinking, setThinking] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    loadExercises(lang.name).then((list) => alive && setCatalog(list));
    return () => {
      alive = false;
    };
  }, [lang.name]);

  const cards = useMemo(
    () => state.cards.filter((c) => c.languageId === lang.id),
    [state.cards, lang.id],
  );

  const preview = useMemo(
    () => buildAssessment(cards, catalog, today),
    [cards, catalog, today],
  );

  const history = state.assessments.filter((a) => a.languageId === lang.id);
  const current = questions[pos];

  // Hörfragen spielen automatisch ab – sonst müsste man erst suchen, wo man klickt.
  useEffect(() => {
    if (stage === 'test' && current?.format === 'listen' && current.audio) {
      speak(current.audio, lang.code);
    }
  }, [stage, current, lang.code]);

  function start() {
    setQuestions(preview);
    setAnswers([]);
    setPos(0);
    setValue('');
    setVerdict('');
    setAdded(new Set());
    setStage('test');
  }

  function answer(given: string) {
    if (!current) return;
    const correct =
      current.format === 'type'
        ? similarity(given, current.answer) > 0.9
        : given === current.answer;
    const next = [...answers, { question: current, given, correct }];
    setAnswers(next);
    setValue('');
    if (pos + 1 >= questions.length) finish(next);
    else setPos(pos + 1);
  }

  async function finish(all: Answer[]) {
    const areas: Areas = emptyAreas();
    for (const a of all) {
      areas[a.question.area].total += 1;
      if (a.correct) areas[a.question.area].correct += 1;
    }
    const level = levelFor(areas);
    const total = totalPct(areas);
    const fallback = ruleVerdict(areas, level);

    setStage('result');
    setVerdict(fallback);

    // Ausformulierte Auswertung ist Kür – ohne Schlüssel bleibt der Regeltext.
    let text = fallback;
    if (state.settings.apiKey) {
      setThinking(true);
      try {
        const res = await assessSummary(state.settings, lang, {
          day: phase.day,
          level,
          totalPct: total,
          areas: (Object.keys(areas) as AssessmentArea[]).map((a) => ({
            area: AREA_LABEL[a],
            pct: pct(areas[a]),
            correct: areas[a].correct,
            total: areas[a].total,
          })),
          mistakes: all
            .filter((a) => !a.correct)
            .map((a) => ({ prompt: a.question.prompt, answer: a.question.answer, given: a.given })),
        });
        if (res.verdict.trim()) {
          text = res.verdict.trim();
          setVerdict(text);
        }
      } catch {
        // Der Regeltext steht schon – ein fehlgeschlagener Aufruf darf das
        // Ergebnis nicht entwerten.
      } finally {
        setThinking(false);
      }
    }

    addAssessment({
      languageId: lang.id,
      date: today,
      day: phase.day,
      areas,
      totalPct: total,
      level,
      verdict: text,
    });
  }

  // ── Intro ────────────────────────────────────────────────────────────────

  if (stage === 'intro') {
    if (preview.length < MIN_QUESTIONS) {
      return (
        <div className="stack">
          <SectionTitle title="Test" />
          <Card>
            <Empty
              icon="◔"
              title="Noch zu wenig Material"
              hint={`Für einen aussagekräftigen Test braucht es mindestens ${MIN_QUESTIONS} Fragen; aus deinem Deck und dem Übungskatalog kommen aktuell ${preview.length} zusammen. Lerne ein paar Tage weiter oder ergänze Vokabeln – dann lohnt sich der Test.`}
              action={
                <Button variant="primary" onClick={() => go('vocab')}>
                  Zu den Vokabeln
                </Button>
              }
            />
          </Card>
        </div>
      );
    }

    const counts = (['wortschatz', 'grammatik', 'hoerverstehen', 'produktion'] as AssessmentArea[])
      .map((a) => ({ area: a, n: preview.filter((q) => q.area === a).length }))
      .filter((x) => x.n > 0);

    return (
      <div className="stack">
        <SectionTitle title="Test" hint={`Tag ${phase.day}`} />
        <Card>
          <div className="stack">
            <p className="small muted" style={{ margin: 0 }}>
              {preview.length} Fragen, rund zehn Minuten. Alles stammt aus deinem eigenen Deck
              und dem Übungskatalog – kein Nachschlagen, keine Auflösung zwischendurch.
            </p>

            <div className="row row-wrap">
              {counts.map(({ area, n }) => (
                <span key={area} className="pill tiny">
                  {AREA_LABEL[area]} · {n}
                </span>
              ))}
            </div>

            <hr className="divider" />
            <p className="tiny muted" style={{ margin: 0 }}>
              Das Ergebnis ist eine Einordnung, kein Sprachzertifikat: Zwanzig Fragen aus dem
              eigenen Material schätzen den Stand, sie prüfen ihn nicht. Der Test verändert
              deine Wiederholungen nicht – er zählt nur mit.
            </p>

            <Button variant="primary" onClick={start}>
              Test starten
            </Button>
          </div>
        </Card>

        {history.length > 0 && <HistoryCard history={history} />}
      </div>
    );
  }

  // ── Test ─────────────────────────────────────────────────────────────────

  if (stage === 'test' && current) {
    return (
      <Card>
        <div className="stack">
          <div className="row">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tiny muted">{AREA_LABEL[current.area]}</div>
              <Bar value={pos} max={questions.length} />
            </div>
            <span className="tiny muted mono">
              {pos + 1}/{questions.length}
            </span>
          </div>

          {current.format === 'listen' ? (
            <div className="stack">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => current.audio && speak(current.audio, lang.code)}
                  aria-label="Nochmal abspielen"
                >
                  ♪
                </button>
                <div className="small muted">
                  Hör zu und beantworte die Frage. Nochmal abspielen mit ♪.
                </div>
              </div>
              <div style={{ fontWeight: 600 }}>{current.prompt}</div>
            </div>
          ) : (
            <div className="target-text" style={{ fontSize: 18 }}>
              {current.prompt}
            </div>
          )}

          {current.format === 'type' ? (
            <div className="row">
              <input
                className="input"
                value={value}
                autoFocus
                placeholder="Deine Antwort"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && value.trim() && answer(value)}
              />
              <Button variant="primary" onClick={() => answer(value)} disabled={!value.trim()}>
                Weiter
              </Button>
            </div>
          ) : (
            <div className="stack" style={{ gap: 8 }}>
              {current.options?.map((opt) => (
                <button
                  key={opt}
                  className="btn"
                  style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={() => answer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          <button
            className="tiny muted"
            style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer' }}
            onClick={() => answer('')}
          >
            Weiß ich nicht – überspringen
          </button>
        </div>
      </Card>
    );
  }

  // ── Ergebnis ─────────────────────────────────────────────────────────────

  const areas: Areas = emptyAreas();
  for (const a of answers) {
    areas[a.question.area].total += 1;
    if (a.correct) areas[a.question.area].correct += 1;
  }
  const level = levelFor(areas);
  const suggestions = suggestHabits(
    areas,
    state.habits.filter((h) => h.languageId === lang.id),
  );
  const mistakes = answers.filter((a) => !a.correct);

  function take(s: HabitSuggestion) {
    addHabit({ languageId: lang.id, title: s.title, cadence: s.cadence, minutes: s.minutes });
    setAdded(new Set(added).add(s.title));
    notify(`„${s.title}“ steht jetzt im Alltags-Modus.`);
  }

  return (
    <div className="stack">
      <SectionTitle title="Ergebnis" hint={`Tag ${phase.day}`} />

      <Card>
        <div className="row row-wrap" style={{ alignItems: 'flex-end', marginBottom: 16 }}>
          <div>
            <div className="eyebrow">Einordnung</div>
            <div style={{ fontSize: 40, fontWeight: 650, lineHeight: 1.1 }}>{level}</div>
          </div>
          <span className="spacer" />
          <div className="mono muted">{totalPct(areas)} % richtig</div>
        </div>

        <div className="stack" style={{ gap: 10 }}>
          {(Object.keys(areas) as AssessmentArea[])
            .filter((a) => areas[a].total > 0)
            .map((a) => (
              <div key={a}>
                <div className="row tiny" style={{ marginBottom: 4 }}>
                  <span>{AREA_LABEL[a]}</span>
                  <span className="spacer" />
                  <span className="muted mono">
                    {areas[a].correct}/{areas[a].total}
                  </span>
                </div>
                <Bar value={areas[a].correct} max={areas[a].total} />
              </div>
            ))}
        </div>

        <hr className="divider" />
        <p className="small" style={{ margin: 0 }}>
          {thinking ? 'Auswertung wird formuliert …' : verdict}
        </p>
        <p className="tiny muted" style={{ marginTop: 10 }}>
          Einordnung aus {answers.length} Fragen – eine Schätzung, kein Sprachzertifikat.
        </p>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Daraus folgt
          </div>
          <div className="stack" style={{ gap: 10 }}>
            {suggestions.map((s) => (
              <div key={s.title} className="row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{s.title}</div>
                  <div className="tiny muted">
                    {s.cadence} · {s.minutes} Min — {s.reason}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={added.has(s.title) ? 'ghost' : 'default'}
                  disabled={added.has(s.title)}
                  onClick={() => take(s)}
                >
                  {added.has(s.title) ? '✓ übernommen' : 'Übernehmen'}
                </Button>
              </div>
            ))}
          </div>
          {added.size > 0 && (
            <Button size="sm" variant="ghost" style={{ marginTop: 14 }} onClick={() => go('daily')}>
              Im Alltags-Modus ansehen
            </Button>
          )}
        </Card>
      )}

      {mistakes.length > 0 && (
        <Card>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Was danebenging
          </div>
          <div className="stack" style={{ gap: 10 }}>
            {mistakes.map((m, i) => (
              <div key={i} className="small">
                <div className="muted">{m.question.prompt.replace(/\n\n/g, ' — ')}</div>
                <div>
                  <span className="fix target-text">{m.question.answer}</span>
                  {m.given && <span className="tiny muted"> · deine Antwort: {m.given}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="row">
        <Button onClick={() => setStage('intro')}>Zurück</Button>
        <Button variant="ghost" onClick={start}>
          Nochmal
        </Button>
      </div>
    </div>
  );
}

function HistoryCard({ history }: { history: { id: string; date: string; day: number; level: string; totalPct: number }[] }) {
  return (
    <Card>
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Frühere Durchläufe
      </div>
      <div className="stack" style={{ gap: 8 }}>
        {history.slice(0, 8).map((a) => (
          <div key={a.id} className="row small">
            <span className="mono muted">{a.date}</span>
            <span className="tiny muted">Tag {a.day}</span>
            <span className="spacer" />
            <span className="pill tiny">{a.level}</span>
            <span className="mono muted">{a.totalPct} %</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
