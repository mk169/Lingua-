import { useEffect, useMemo } from 'react';
import { useStore } from '../store';
import type { Language, View } from '../types-view';
import { Bar, Button, Card, SectionTitle, Stat } from '../ui';
import { getPhase, levelsInSprint, nextLevel, PHASE_META, WEEK_PLAN } from '../lib/phase';
import { backlogLimit, dueCards, lockedCards, suspendedCards } from '../lib/sm2';
import { todayISO } from '../lib/date';

/**
 * Das Dashboard passt sich der Phase an:
 * Phase 1 = Fokus-Modus (nur Review + Lesen), Phase 2 ergänzt den Reader,
 * Phase 3 schaltet Konversation, Schreiben und den Alltags-Modus frei.
 */
export function Dashboard({ lang, go }: { lang: Language; go: (view: View) => void }) {
  const { state, unlockDaily, startNextSprint } = useStore();
  const today = todayISO();
  const phase = getPhase(lang, today);

  // Tageskontingent an neuen Wörtern automatisch freischalten.
  useEffect(() => {
    unlockDaily(lang.id);
    // Nur einmal pro Sprache und Tag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang.id, today]);

  const cards = useMemo(
    () => state.cards.filter((c) => c.languageId === lang.id),
    [state.cards, lang.id],
  );
  const due = useMemo(() => dueCards(state.cards, lang.id, today), [state.cards, lang.id, today]);
  const pool = useMemo(() => lockedCards(state.cards, lang.id), [state.cards, lang.id]);
  const active = cards.filter((c) => c.unlockedAt !== null);
  const learned = cards.filter((c) => c.srs.reps >= 2);
  const log = state.logs.find((l) => l.date === today && l.languageId === lang.id);
  const patterns = state.patterns.filter((p) => p.languageId === lang.id);
  const weekPatterns = patterns.filter(
    (p) => p.week === phase.week && levelsInSprint(lang.targetLevel).includes(p.level ?? 'A1'),
  );
  const habits = state.habits.filter((h) => h.languageId === lang.id);

  const streak = useMemo(() => {
    const dates = new Set(
      state.logs.filter((l) => l.languageId === lang.id && l.reviews > 0).map((l) => l.date),
    );
    let count = 0;
    // Heute zählt nur, wenn schon gelernt wurde – sonst zählen wir ab gestern.
    let cursor = today;
    if (!dates.has(cursor)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      cursor = todayISO(yesterday);
    }
    while (dates.has(cursor)) {
      count++;
      const [y, m, d] = cursor.split('-').map(Number);
      const prev = new Date(y, m - 1, d - 1);
      cursor = todayISO(prev);
    }
    return count;
  }, [state.logs, lang.id, today]);

  const dailyTarget = lang.dailyNewWords;
  const newToday = cards.filter(
    (c) => c.unlockedAt !== null && todayISO(new Date(c.unlockedAt)) === today,
  ).length;

  // Rückstandsbremse: Solange zu viel offen ist, kommen keine neuen Wörter
  // dazu. Das wird hier erklärt, damit es nicht wie ein Fehler wirkt.
  const backlogged = due.length > backlogLimit(dailyTarget);
  const suspended = suspendedCards(state.cards, lang.id);
  const lastAssessment = state.assessments.find((a) => a.languageId === lang.id);
  // Nach Tag 30 ist der Sprint durch. Dann geht es entweder eine Stufe höher
  // oder in den Alltags-Modus – beides ist eine bewusste Entscheidung.
  const sprintDone = phase.day > 30;
  const upcoming = nextLevel(lang.targetLevel);
  const minutes = log?.minutes ?? 0;

  return (
    <div className="stack">
      {backlogged && (
        <Card className="card-warn">
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>⏸</span>
            <div>
              <div style={{ fontWeight: 600 }}>Keine neuen Wörter heute</div>
              <p className="small muted" style={{ margin: '4px 0 0' }}>
                {due.length} Karten sind fällig – das ist mehr, als an einem Tag sinnvoll
                geht. Neue Wörter kommen erst wieder dazu, wenn der Stapel unter{' '}
                {backlogLimit(dailyTarget)} liegt. Aufholen schlägt Anhäufen.
              </p>
            </div>
          </div>
        </Card>
      )}

      {sprintDone && (
        <Card className="card-accent">
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>▲</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>
                Sprint {lang.sprint} auf {lang.targetLevel} ist durch
              </div>
              <p className="small muted" style={{ margin: '4px 0 0' }}>
                {upcoming
                  ? `Tag ${phase.day} – du kannst den nächsten 30-Tage-Sprint auf ${upcoming} starten. Dein Deck und aller Fortschritt bleiben, nur das Skelett wechselt auf die nächste Stufe.`
                  : `${lang.targetLevel} ist die letzte Stufe der Leiter. Ab hier trägt der Alltags-Modus.`}
              </p>
            </div>
            {upcoming && (
              <Button variant="primary" size="sm" onClick={() => startNextSprint(lang.id)}>
                Sprint auf {upcoming}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Standortbestimmung: ab Tag 28 der Sprint-Abschluss, davor ein
          unaufdringliches Angebot. Kein Nav-Tab – die Leiste soll schmal bleiben. */}
      {phase.day >= 28 && lastAssessment?.day !== phase.day && (
        <Card className="card-accent">
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>◎</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>Tag 30 — Standortbestimmung</div>
              <p className="small muted" style={{ margin: '4px 0 0' }}>
                Zwanzig Fragen aus deinem Deck und den Übungen, rund zehn Minuten. Danach
                weißt du, wo du stehst – und welche Gewohnheiten als Nächstes tragen.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => go('assessment')}>
              Starten
            </Button>
          </div>
        </Card>
      )}

      {suspended.length > 0 && (
        <Card>
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>🐛</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>
                {suspended.length} {suspended.length === 1 ? 'Karte' : 'Karten'} ausgesetzt
              </div>
              <p className="small muted" style={{ margin: '4px 0 0' }}>
                Zu oft vergessen. Solche Karten brauchen eine neue Formulierung, keine
                weitere Wiederholung – unter Vokabeln kannst du sie überarbeiten.
              </p>
            </div>
            <Button size="sm" onClick={() => go('vocab')}>
              Ansehen
            </Button>
          </div>
        </Card>
      )}

      {/* Kopf: Phase & Sprint-Fortschritt */}
      <Card>
        <div className="row row-wrap" style={{ marginBottom: 14 }}>
          <div>
            <div className="eyebrow">
              Phase {phase.phase} · {PHASE_META[phase.phase].range}
            </div>
            <h1 style={{ marginTop: 4 }}>{phase.title}</h1>
          </div>
          <span className="spacer" />
          <div className="row">
            <span className="pill">{lang.slot === 'focus' ? 'Fokus-Slot' : 'Wartung'}</span>
            <span className="pill pill-accent">Sprint {lang.sprint} → {lang.targetLevel}</span>
            <span className="pill mono">Tag {phase.day}</span>
          </div>
        </div>

        <p className="muted small" style={{ maxWidth: 620 }}>
          {phase.focus}
        </p>

        <div style={{ marginTop: 18 }}>
          <div className="row tiny muted" style={{ marginBottom: 6 }}>
            <span>Tag 1</span>
            <span className="spacer" />
            <span>Tag 14 · Input</span>
            <span className="spacer" />
            <span>Tag 30 · Produktion</span>
          </div>
          <div className="timeline">
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const state_ =
                day < phase.day ? 'done' : day === phase.day ? 'today' : 'future';
              return (
                <div
                  key={day}
                  className="timeline-day"
                  data-state={state_}
                  data-phase={day <= 14 ? '1' : '2'}
                  title={`Tag ${day}`}
                />
              );
            })}
          </div>
        </div>
      </Card>

      {/* Kennzahlen */}
      <div className="stats">
        <Stat value={due.length} label="heute fällig" />
        <Stat value={`${minutes}/${lang.dailyMinutes}`} label="Minuten heute" />
        <Stat value={`${newToday}/${dailyTarget}`} label="neue Wörter heute" />
        <Stat value={active.length} label="aktive Karten" />
        <Stat value={learned.length} label="gefestigt" />
        <Stat value={streak} label="Tage Streak" />
      </div>

      {/* Dauerhafter, unaufdringlicher Einstieg – der Test ist jederzeit möglich. */}
      <Card>
        <div className="row">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>Standortbestimmung</div>
            <p className="tiny muted" style={{ margin: 0 }}>
              {lastAssessment
                ? `Zuletzt an Tag ${lastAssessment.day}: ${lastAssessment.level} · ${lastAssessment.totalPct} % richtig`
                : 'Jederzeit möglich – zwanzig Fragen aus deinem eigenen Material.'}
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => go('assessment')}>
            {lastAssessment ? 'Erneut testen' : 'Testen'}
          </Button>
        </div>
      </Card>

      <div className="grid-2">
        <div className="stack">
          {/* Heutige Session */}
          <Card>
            <SectionTitle
              title="Heutige Session"
              hint={`${lang.dailyMinutes} Min geplant`}
            />
            <div className="stack">
              <Task
                label="SRS-Review"
                detail={
                  due.length > 0
                    ? `${due.length} Karten fällig`
                    : 'Alles wiederholt – gut gemacht.'
                }
                minutes={due.length > 30 ? 15 : 10}
                done={due.length === 0 && (log?.reviews ?? 0) > 0}
                action={
                  <Button
                    variant={due.length > 0 ? 'primary' : 'default'}
                    size="sm"
                    onClick={() => go('review')}
                    disabled={due.length === 0}
                  >
                    {due.length > 0 ? 'Starten' : 'Fertig'}
                  </Button>
                }
              />
              <Task
                label="Skeleton-Drills"
                detail={
                  weekPatterns.length > 0
                    ? `${weekPatterns.length} Muster in Woche ${phase.week}`
                    : 'Noch keine Muster für diese Woche'
                }
                minutes={12}
                done={(log?.drills ?? 0) >= 5}
                action={
                  <Button size="sm" onClick={() => go('drills')}>
                    Üben
                  </Button>
                }
              />
              {phase.phase >= 2 && (
                <Task
                  label="Input-Immersion"
                  detail={`${state.texts.filter((t) => t.languageId === lang.id).length} Texte im Reader`}
                  minutes={15}
                  done={false}
                  action={
                    <Button size="sm" onClick={() => go('reader')}>
                      Lesen
                    </Button>
                  }
                />
              )}
              {phase.phase >= 3 && (
                <>
                  <Task
                    label="Output-Lab: Konversation"
                    detail="Chat mit dem Sprachtrainer"
                    minutes={10}
                    done={(log?.outputs ?? 0) > 0}
                    action={
                      <Button size="sm" onClick={() => go('chat')}>
                        Sprechen
                      </Button>
                    }
                  />
                  <Task
                    label="Schreib-Tagebuch"
                    detail="3–5 Sätze über deinen Tag"
                    minutes={8}
                    done={state.journal.some(
                      (j) => j.languageId === lang.id && j.date === today,
                    )}
                    action={
                      <Button size="sm" onClick={() => go('writing')}>
                        Schreiben
                      </Button>
                    }
                  />
                </>
              )}
            </div>
          </Card>

          {/* Wochenplan */}
          <Card>
            {/* Der Wochenplan ist auf den ersten Sprint (A1→A2) geschrieben –
                seine Ziele wären auf B1 schlicht falsch. Ab Sprint 2 zeigen
                wir stattdessen die Muster, die diese Woche tatsächlich anstehen. */}
            {lang.targetLevel === 'A2' ? (
              <>
                <SectionTitle title={WEEK_PLAN[phase.week].title} />
                <ul className="small muted" style={{ margin: 0, paddingLeft: 18 }}>
                  {WEEK_PLAN[phase.week].goals.map((g) => (
                    <li key={g} style={{ marginBottom: 4 }}>
                      {g}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <SectionTitle
                  title={`Woche ${phase.week} · ${lang.targetLevel}`}
                  hint={`Sprint ${lang.sprint}`}
                />
                {weekPatterns.length > 0 ? (
                  <ul className="small muted" style={{ margin: 0, paddingLeft: 18 }}>
                    {weekPatterns.map((p) => (
                      <li key={p.id} style={{ marginBottom: 4 }}>
                        {p.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="small muted" style={{ margin: 0 }}>
                    Für {lang.targetLevel} gibt es in dieser Woche noch keine Muster im
                    Startpaket. Unter Drills lassen sie sich erzeugen.
                  </p>
                )}
              </>
            )}
          </Card>
        </div>

        <div className="stack">
          {/* Wortschatz-Fortschritt */}
          <Card>
            <SectionTitle title="Wortschatz" />
            <div className="row" style={{ marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 22 }}>
                {active.length}
              </span>
              <span className="small muted">/ 1000 Ziel</span>
              <span className="spacer" />
              <span className="tiny muted">{pool.length} im Pool</span>
            </div>
            <Bar value={active.length} max={1000} />
            <p className="tiny muted" style={{ marginTop: 10 }}>
              Ziel Phase 1: die 600–1000 wichtigsten Wörter in 14 Tagen, {dailyTarget} neue pro
              Tag.
            </p>
            {pool.length < dailyTarget * 2 && (
              <Button
                size="sm"
                block
                style={{ marginTop: 12 }}
                onClick={() => go('vocab')}
              >
                Nachschub generieren
              </Button>
            )}
          </Card>

          {/* Grammatik-Skelett */}
          <Card>
            <SectionTitle
              title="Sprachskelett"
              action={
                <Button variant="ghost" size="sm" onClick={() => go('drills')}>
                  Alle
                </Button>
              }
            />
            {patterns.length === 0 ? (
              <p className="small muted">Noch keine Muster angelegt.</p>
            ) : (
              <div className="stack" style={{ gap: 8 }}>
                {patterns.slice(0, 4).map((p) => (
                  <div key={p.id} className="row">
                    <span className={p.mastered ? 'small' : 'small'} style={{ flex: 1 }}>
                      {p.mastered && <span style={{ color: 'var(--ok)' }}>✓ </span>}
                      {p.title}
                    </span>
                    <span className="tiny muted mono">W{p.week}</span>
                  </div>
                ))}
                <div className="tiny muted">
                  {patterns.filter((p) => p.mastered).length} von {patterns.length} sicher
                </div>
              </div>
            )}
          </Card>

          {phase.phase >= 3 && habits.length > 0 && (
            <Card>
              <SectionTitle
                title="Lern-Habits"
                action={
                  <Button variant="ghost" size="sm" onClick={() => go('daily')}>
                    Alltag
                  </Button>
                }
              />
              <div className="stack" style={{ gap: 6 }}>
                {habits.slice(0, 4).map((h) => (
                  <div key={h.id} className="row small">
                    <span style={{ flex: 1 }}>{h.title}</span>
                    <span className="tiny muted">
                      {h.done.includes(today) ? '✓ heute' : h.cadence}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {phase.phase === 1 && (
            <Card style={{ background: 'var(--accent-soft)', borderColor: 'transparent' }}>
              <div className="eyebrow" style={{ color: 'var(--accent-ink)' }}>
                Fokus-Modus
              </div>
              <p className="small" style={{ marginTop: 6, color: 'var(--accent-ink)' }}>
                In den ersten 14 Tagen bleiben Reader, Konversation und Alltags-Modus bewusst
                zu. Nur Review und Drills – das Skelett zuerst.
              </p>
              <p className="tiny" style={{ color: 'var(--accent-ink)', opacity: 0.8 }}>
                Noch {Math.max(0, 15 - phase.day)} Tage bis der Reader aufgeht.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Task({
  label,
  detail,
  minutes,
  done,
  action,
}: {
  label: string;
  detail: string;
  minutes: number;
  done: boolean;
  action: React.ReactNode;
}) {
  return (
    <div className="row" style={{ gap: 12 }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: done ? 'var(--ok)' : 'var(--line-strong)',
          flex: '0 0 auto',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 550, fontSize: 14 }}>{label}</div>
        <div className="tiny muted">{detail}</div>
      </div>
      <span className="tiny muted mono">{minutes}′</span>
      {action}
    </div>
  );
}
