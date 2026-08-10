import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { Drill, Exercise, ExerciseKind, GrammarPattern } from '../types';
import { Button, Card, Empty, SectionTitle, useAsyncAction } from '../ui';
import { getPhase } from '../lib/phase';
import { generateDrills, generatePatterns } from '../lib/llm';
import { speak } from '../lib/speech';
import { loadExercises } from '../data/exercises';
import { ExerciseSession } from '../components/ExerciseSession';

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

/** Skeleton-Drills: Kerngrammatik in Minimalmustern, interaktiv geübt. */
export function Drills({ lang }: { lang: Language }) {
  const { state, addPatterns, addDrills, updatePattern, solveDrill, markExercise } = useStore();
  const { busy, run } = useAsyncAction();
  const phase = getPhase(lang);
  const [openId, setOpenId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [session, setSession] = useState<{ patternId: string; kind: ExerciseKind } | null>(null);

  // Der Katalog kommt erst hier dazu, nicht im Hauptbundle.
  useEffect(() => {
    let alive = true;
    loadExercises(lang.name).then((list) => {
      if (alive) setCatalog(list);
    });
    return () => {
      alive = false;
    };
  }, [lang.name]);

  const patterns = useMemo(
    () =>
      state.patterns
        .filter((p) => p.languageId === lang.id)
        .sort((a, b) => a.week - b.week || a.createdAt - b.createdAt),
    [state.patterns, lang.id],
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

  async function makePatterns(week: 1 | 2 | 3 | 4) {
    const existing = patterns.map((p) => p.title);
    const generated = await run(
      () => generatePatterns(state.settings, lang, week, existing, 6),
      { success: 'Neue Muster ergänzt.' },
    );
    if (generated) addPatterns(lang.id, generated, week);
  }

  const active = session ? patterns.find((p) => p.id === session.patternId) : undefined;

  if (active && session) {
    const list = exercisesFor(active, session.kind);
    const label = KINDS.find((k) => k.kind === session.kind)?.label ?? session.kind;
    return (
      <ExerciseSession
        key={`${active.id}-${session.kind}`}
        exercises={list}
        lang={lang}
        title={`${active.title} · ${label}`}
        solvedIds={solvedIds}
        onSolved={(id, solved) => {
          if (id.startsWith(DRILL_PREFIX)) {
            if (solved) solveDrill(id.slice(DRILL_PREFIX.length));
          } else {
            markExercise(id, lang.id, solved);
          }
        }}
        onClose={() => setSession(null)}
      />
    );
  }

  if (patterns.length === 0) {
    return (
      <Card>
        <Empty
          icon="⌗"
          title="Noch kein Sprachskelett"
          hint="Die Kerngrammatik als Minimalmuster: Satzstellung, Fragewörter, Verneinung, Zeitformen. Lass die passenden Muster für diese Woche erzeugen."
          action={
            <Button variant="primary" loading={busy} onClick={() => makePatterns(phase.week)}>
              Muster für Woche {phase.week} erzeugen
            </Button>
          }
        />
      </Card>
    );
  }

  const byWeek = new Map<number, GrammarPattern[]>();
  for (const p of patterns) {
    const list = byWeek.get(p.week) ?? [];
    list.push(p);
    byWeek.set(p.week, list);
  }

  return (
    <div className="stack">
      <SectionTitle
        title="Skeleton-Drills"
        hint={`${patterns.filter((p) => p.mastered).length} von ${patterns.length} sicher`}
        action={
          <Button size="sm" loading={busy} onClick={() => makePatterns(phase.week)}>
            + Woche {phase.week}
          </Button>
        }
      />

      {[1, 2, 3, 4].map((week) => {
        const list = byWeek.get(week);
        if (!list?.length) return null;
        return (
          <div key={week} className="stack" style={{ gap: 10 }}>
            <div className="eyebrow">
              Woche {week}
              {week === phase.week && ' · aktuell'}
            </div>
            {list.map((p) => (
              <PatternCard
                key={p.id}
                pattern={p}
                lang={lang}
                open={openId === p.id}
                onToggle={() => setOpenId(openId === p.id ? null : p.id)}
                onMastered={() => updatePattern(p.id, { mastered: !p.mastered })}
                counts={KINDS.map(({ kind }) => {
                  const all = exercisesFor(p, kind);
                  return { kind, total: all.length, solved: all.filter((e) => solvedIds.has(e.id)).length };
                })}
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

function PatternCard({
  pattern,
  lang,
  open,
  onToggle,
  onMastered,
  counts,
  onStart,
  onGenerateDrills,
  busy,
}: {
  pattern: GrammarPattern;
  lang: Language;
  open: boolean;
  onToggle: () => void;
  onMastered: () => void;
  counts: { kind: ExerciseKind; total: number; solved: number }[];
  onStart: (kind: ExerciseKind) => void;
  onGenerateDrills: () => Promise<void>;
  busy: boolean;
}) {
  const total = counts.reduce((n, c) => n + c.total, 0);
  const solved = counts.reduce((n, c) => n + c.solved, 0);

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
          <div style={{ fontWeight: 600 }}>
            {pattern.mastered && <span style={{ color: 'var(--ok)' }}>✓ </span>}
            {pattern.title}
          </div>
          <div className="tiny muted mono">{pattern.formula}</div>
        </div>
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
          <p className="small muted">{pattern.explanation}</p>

          <div className="stack" style={{ gap: 8 }}>
            {pattern.examples.map((ex, i) => (
              <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => speak(ex.target, lang.code)}
                  aria-label="Vorlesen"
                >
                  ♪
                </button>
                <div>
                  <div className="target-text">{ex.target}</div>
                  <div className="tiny muted">{ex.native}</div>
                </div>
              </div>
            ))}
          </div>

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

          <Button size="sm" variant={pattern.mastered ? 'ghost' : 'default'} onClick={onMastered}>
            {pattern.mastered ? 'Als offen markieren' : 'Sitzt – als sicher markieren'}
          </Button>
        </div>
      )}
    </Card>
  );
}
