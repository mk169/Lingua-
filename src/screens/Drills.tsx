import { useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { GrammarPattern } from '../types';
import { Button, Card, Empty, SectionTitle, useAsyncAction } from '../ui';
import { getPhase } from '../lib/phase';
import { generateDrills, generatePatterns } from '../lib/llm';
import { speak } from '../lib/speech';
import { similarity } from '../lib/speech';

const TYPE_LABEL: Record<string, string> = {
  cloze: 'Lücke füllen',
  transform: 'Umformen',
  order: 'Satz ordnen',
  build: 'Satz bilden',
};

/** Skeleton-Drills: Kerngrammatik in Minimalmustern, interaktiv geübt. */
export function Drills({ lang }: { lang: Language }) {
  const { state, addPatterns, addDrills, updatePattern, solveDrill } = useStore();
  const { busy, run } = useAsyncAction();
  const phase = getPhase(lang);
  const [openId, setOpenId] = useState<string | null>(null);

  const patterns = useMemo(
    () =>
      state.patterns
        .filter((p) => p.languageId === lang.id)
        .sort((a, b) => a.week - b.week || a.createdAt - b.createdAt),
    [state.patterns, lang.id],
  );

  const byWeek = useMemo(() => {
    const map = new Map<number, GrammarPattern[]>();
    for (const p of patterns) {
      const list = map.get(p.week) ?? [];
      list.push(p);
      map.set(p.week, list);
    }
    return map;
  }, [patterns]);

  async function makePatterns(week: 1 | 2 | 3 | 4) {
    const existing = patterns.map((p) => p.title);
    const generated = await run(
      () => generatePatterns(state.settings, lang, week, existing, 6),
      { success: 'Neue Muster ergänzt.' },
    );
    if (generated) addPatterns(lang.id, generated, week);
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
                drills={state.drills.filter((d) => d.patternId === p.id)}
                onGenerateDrills={async () => {
                  const generated = await run(() => generateDrills(state.settings, lang, p, 6));
                  if (generated) addDrills(lang.id, p.id, generated);
                }}
                onSolve={solveDrill}
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
  drills,
  onGenerateDrills,
  onSolve,
  busy,
}: {
  pattern: GrammarPattern;
  lang: Language;
  open: boolean;
  onToggle: () => void;
  onMastered: () => void;
  drills: { id: string; type: string; prompt: string; answer: string; hint?: string; solvedAt: number | null }[];
  onGenerateDrills: () => Promise<void>;
  onSolve: (id: string) => void;
  busy: boolean;
}) {
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

          {drills.length === 0 ? (
            <Button size="sm" loading={busy} onClick={onGenerateDrills}>
              ✦ Übungen erzeugen
            </Button>
          ) : (
            <div className="stack">
              <div className="eyebrow">
                Übungen · {drills.filter((d) => d.solvedAt).length}/{drills.length} gelöst
              </div>
              {drills.map((d) => (
                <DrillItem key={d.id} drill={d} lang={lang} onSolve={() => onSolve(d.id)} />
              ))}
              <Button size="sm" variant="ghost" loading={busy} onClick={onGenerateDrills}>
                Mehr Übungen
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

function DrillItem({
  drill,
  lang,
  onSolve,
}: {
  drill: { id: string; type: string; prompt: string; answer: string; hint?: string; solvedAt: number | null };
  lang: Language;
  onSolve: () => void;
}) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<'correct' | 'close' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);

  function check() {
    const score = similarity(value, drill.answer);
    if (score > 0.95) {
      setResult('correct');
      if (!drill.solvedAt) onSolve();
      speak(drill.answer, lang.code);
    } else if (score > 0.75) {
      setResult('close');
    } else {
      setResult('wrong');
    }
  }

  return (
    <div
      style={{
        padding: 12,
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-2)',
      }}
      className="stack"
    >
      <div className="row">
        <span className="pill tiny">{TYPE_LABEL[drill.type] ?? drill.type}</span>
        {drill.solvedAt && <span className="tiny" style={{ color: 'var(--ok)' }}>✓ gelöst</span>}
      </div>
      <div className="target-text" style={{ fontSize: 15 }}>
        {drill.prompt}
      </div>
      <div className="row">
        <input
          className="input"
          value={value}
          placeholder="Deine Antwort"
          onChange={(e) => {
            setValue(e.target.value);
            setResult(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
        />
        <Button size="sm" onClick={check} disabled={!value.trim()}>
          Prüfen
        </Button>
      </div>

      {result && (
        <div className="small fade-in">
          {result === 'correct' && <span style={{ color: 'var(--ok)' }}>✓ Richtig.</span>}
          {result === 'close' && (
            <span style={{ color: 'var(--warn)' }}>
              Fast – achte auf Details: <span className="fix">{drill.answer}</span>
            </span>
          )}
          {result === 'wrong' && (
            <span>
              <span style={{ color: 'var(--danger)' }}>Noch nicht.</span> Lösung:{' '}
              <span className="fix target-text">{drill.answer}</span>
            </span>
          )}
        </div>
      )}

      {drill.hint && (
        <button
          className="tiny muted"
          style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer' }}
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? `Tipp: ${drill.hint}` : 'Tipp anzeigen'}
        </button>
      )}
    </div>
  );
}
