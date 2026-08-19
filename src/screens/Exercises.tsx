import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language, View } from '../types-view';
import type { Drill, Exercise, ExerciseKind, GrammarPattern } from '../types';
import { Button, Card, Empty, SectionTitle, useAsyncAction } from '../ui';
import { getPhase, levelsCovered, levelsInSprint } from '../lib/phase';
import { generateDrills } from '../lib/llm';
import { loadExercises } from '../data/exercises';
import { ExerciseSession } from '../components/ExerciseSession';
import { buildRound, countStatus } from '../lib/exerciseQueue';
import { useTimeOnTask } from '../lib/useTimeOnTask';

const KINDS: { kind: ExerciseKind; label: string; hint: string }[] = [
  { kind: 'satz', label: 'Beispielsätze', hint: 'Deutscher Satz → Zielsprache' },
  { kind: 'konstruktion', label: 'Konstruktion', hint: 'Lücken, Umformen, Ordnen' },
  { kind: 'verstaendnis', label: 'Verständnis', hint: 'Lesen und erkennen' },
];

/** Persönlich erzeugte Drills laufen in derselben Session mit. */
const DRILL_PREFIX = 'drill:';

function drillToExercise(d: Drill, slug: string): Exercise {
  return {
    id: `${DRILL_PREFIX}${d.id}`,
    patternSlug: slug,
    kind: 'konstruktion',
    type: d.type,
    prompt: d.prompt,
    answer: d.answer,
    hint: d.hint,
  };
}

/**
 * Übungen – alles, was in einer Session abgefragt wird.
 *
 * Die Muster selbst stehen unter Grammatik: dort werden sie gelernt, hier
 * angewendet. Diese Seite zeigt deshalb keine Erklärungen und keine
 * Beispielsätze, nur Aufgabenstapel und ihren Stand.
 */
export function Exercises({ lang, go }: { lang: Language; go: (view: View) => void }) {
  const { state, addDrills, solveDrill, markExercise } = useStore();
  const { busy, run } = useAsyncAction();
  const phase = getPhase(lang);
  const [openId, setOpenId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [session, setSession] = useState<{ patternId: string; kind: ExerciseKind } | 'mixed' | null>(
    null,
  );
  useTimeOnTask(lang.id);

  // Der Katalog kommt erst hier dazu, nicht im Hauptbundle – und nur die
  // Stufen, für die dieser Sprint überhaupt Muster zeigt.
  const stufen = useMemo(
    () => levelsCovered(lang.startLevel, lang.targetLevel),
    [lang.startLevel, lang.targetLevel],
  );
  useEffect(() => {
    let alive = true;
    loadExercises(lang.name, stufen).then((list) => {
      if (alive) setCatalog(list);
    });
    return () => {
      alive = false;
    };
  }, [lang.name, stufen]);

  // Ein Sprint übt nur die Muster seiner Stufe. Der erste holt A1 und A2
  // zusammen ab, jeder weitere genau die nächste Stufe.
  const sprintLevels = useMemo(() => new Set(levelsInSprint(lang.targetLevel)), [lang.targetLevel]);

  const patterns = useMemo(
    () =>
      state.patterns
        .filter((p) => p.languageId === lang.id && sprintLevels.has(p.level ?? 'A1'))
        // Reihenfolge aus dem Startpaket: Verneinung erst nach dem Aussagesatz.
        .sort(
          (a, b) =>
            a.week - b.week || (a.order ?? 0) - (b.order ?? 0) || a.createdAt - b.createdAt,
        ),
    [state.patterns, lang.id, sprintLevels],
  );

  const solvedIds = useMemo(() => {
    const set = new Set<string>();
    for (const [id, p] of Object.entries(state.exerciseProgress)) if (p.solved) set.add(id);
    for (const d of state.drills) if (d.solvedAt) set.add(`${DRILL_PREFIX}${d.id}`);
    return set;
  }, [state.exerciseProgress, state.drills]);

  /** Alle Übungen eines Musters, Repo-Katalog plus eigene Drills. */
  function exercisesFor(pattern: GrammarPattern, kind: ExerciseKind): Exercise[] {
    const fromRepo = pattern.slug
      ? catalog.filter((e) => e.patternSlug === pattern.slug && e.kind === kind)
      : [];
    if (kind !== 'konstruktion') return fromRepo;
    const own = state.drills
      .filter((d) => d.patternId === pattern.id)
      .map((d) => drillToExercise(d, pattern.slug ?? pattern.id));
    return [...fromRepo, ...own];
  }

  const onSolved = (id: string, correct: boolean) => {
    if (id.startsWith(DRILL_PREFIX)) {
      if (correct) solveDrill(id.slice(DRILL_PREFIX.length));
    } else {
      markExercise(id, lang.id, correct);
    }
  };

  if (session === 'mixed') {
    // Interleaving: Blockweises Üben fühlt sich besser an und überträgt sich
    // schlechter. Die gemischte Runde zieht quer über alle Muster.
    const all = patterns.flatMap((p) => KINDS.flatMap(({ kind }) => exercisesFor(p, kind)));
    return (
      <ExerciseSession
        key="mixed"
        exercises={buildRound(all, state.exerciseProgress, { interleave: true })}
        lang={lang}
        title="Gemischte Runde · alle Muster"
        solvedIds={solvedIds}
        onSolved={onSolved}
        onClose={() => setSession(null)}
      />
    );
  }

  const active = session ? patterns.find((p) => p.id === session.patternId) : undefined;

  if (active && session) {
    const list = exercisesFor(active, session.kind);
    const label = KINDS.find((k) => k.kind === session.kind)?.label ?? session.kind;
    return (
      <ExerciseSession
        key={`${active.id}-${session.kind}`}
        exercises={buildRound(list, state.exerciseProgress)}
        lang={lang}
        title={`${active.title} · ${label}`}
        solvedIds={solvedIds}
        onSolved={onSolved}
        onClose={() => setSession(null)}
      />
    );
  }

  if (patterns.length === 0) {
    return (
      <Card>
        <Empty
          icon="⌗"
          title="Noch keine Übungen"
          hint="Übungen hängen an den Grammatikmustern deines Sprachskeletts. Lege sie zuerst unter Grammatik an."
          action={
            <Button variant="primary" onClick={() => go('grammar')}>
              Zur Grammatik
            </Button>
          }
        />
      </Card>
    );
  }

  const allExercises = patterns.flatMap((p) => KINDS.flatMap(({ kind }) => exercisesFor(p, kind)));
  const overall = countStatus(allExercises, state.exerciseProgress);

  const byWeek = new Map<number, GrammarPattern[]>();
  for (const p of patterns) {
    const list = byWeek.get(p.week) ?? [];
    list.push(p);
    byWeek.set(p.week, list);
  }

  return (
    <div className="stack">
      <SectionTitle
        title="Übungen"
        hint={
          overall.due > 0
            ? `${overall.due} Übungen fällig · ${overall.solved}/${overall.total} gelöst`
            : `${overall.solved}/${overall.total} gelöst · nichts fällig`
        }
      />

      {allExercises.length > 0 && (
        <Card>
          <div className="row">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>Gemischte Runde</div>
              <p className="tiny muted" style={{ margin: 0 }}>
                Quer durch alle Muster – fällige zuerst, dann was noch wackelt. Durcheinander
                zu üben fühlt sich schwerer an und sitzt danach besser.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setSession('mixed')}>
              {overall.due > 0 ? `${overall.due} fällig` : 'Starten'}
            </Button>
          </div>
        </Card>
      )}

      {[1, 2, 3, 4].map((week) => {
        const list = byWeek.get(week);
        if (!list?.length) return null;
        return (
          <div key={week} className="stack" style={{ gap: 10 }}>
            <div className="eyebrow">
              Woche {week} · {list[0]?.level ?? 'A1'}
              {week === phase.week && ' · aktuell'}
            </div>
            {list.map((p) => (
              <PatternExercises
                key={p.id}
                pattern={p}
                open={openId === p.id}
                onToggle={() => setOpenId(openId === p.id ? null : p.id)}
                counts={KINDS.map(({ kind }) => ({
                  kind,
                  ...countStatus(exercisesFor(p, kind), state.exerciseProgress),
                }))}
                onStart={(kind) => setSession({ patternId: p.id, kind })}
                onGenerateDrills={async () => {
                  const generated = await run(() => generateDrills(state.settings, lang, p, 6), {
                    success: 'Eigene Übungen ergänzt.',
                  });
                  if (generated) addDrills(lang.id, p.id, generated);
                }}
                busy={busy}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function PatternExercises({
  pattern,
  open,
  onToggle,
  counts,
  onStart,
  onGenerateDrills,
  busy,
}: {
  pattern: GrammarPattern;
  open: boolean;
  onToggle: () => void;
  counts: { kind: ExerciseKind; total: number; solved: number; due: number; fresh: number }[];
  onStart: (kind: ExerciseKind) => void;
  onGenerateDrills: () => Promise<void>;
  busy: boolean;
}) {
  const total = counts.reduce((n, c) => n + c.total, 0);
  const solved = counts.reduce((n, c) => n + c.solved, 0);
  const due = counts.reduce((n, c) => n + c.due, 0);

  return (
    <Card className="card-pad-0">
      <button
        onClick={onToggle}
        style={{
          all: 'unset',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          width: '100%',
          padding: '14px 18px',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600 }}>{pattern.title}</div>
          <div className="tiny muted mono">{pattern.formula}</div>
        </div>
        {pattern.level && pattern.level !== 'A1' && (
          <span className="pill tiny">{pattern.level}</span>
        )}
        {due > 0 && <span className="pill pill-accent tiny">{due} fällig</span>}
        {total > 0 && (
          <span className="tiny muted mono">
            {solved}/{total}
          </span>
        )}
        <span className="muted">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div style={{ padding: '0 18px 18px' }} className="stack fade-in">
          <hr className="divider" />
          {total === 0 ? (
            <div className="stack">
              <p className="tiny muted">
                Für dieses Muster gibt es noch keine fertigen Übungen. Lass dir eigene erzeugen –
                die bleiben in diesem Browser.
              </p>
              <Button size="sm" loading={busy} onClick={onGenerateDrills}>
                ✦ Eigene Übungen erzeugen
              </Button>
            </div>
          ) : (
            <div className="stack" style={{ gap: 8 }}>
              {KINDS.map(({ kind, label, hint }) => {
                const c = counts.find((x) => x.kind === kind);
                if (!c || c.total === 0) return null;
                const done = c.solved >= c.total;
                return (
                  <button
                    key={kind}
                    className="btn"
                    style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
                    onClick={() => onStart(kind)}
                  >
                    <span>
                      <span style={{ fontWeight: 600 }}>
                        {done && <span style={{ color: 'var(--ok)' }}>✓ </span>}
                        {label}
                      </span>
                      <span className="tiny muted"> · {hint}</span>
                    </span>
                    <span className="tiny muted mono">
                      {c.due > 0 && <span style={{ color: 'var(--accent)' }}>{c.due} fällig · </span>}
                      {c.solved}/{c.total}
                    </span>
                  </button>
                );
              })}
              <Button size="sm" variant="ghost" loading={busy} onClick={onGenerateDrills}>
                ✦ Eigene Übungen ergänzen
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
