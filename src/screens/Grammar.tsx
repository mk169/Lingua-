import { useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { CefrLevel, GrammarPattern } from '../types';
import { Button, Card, Empty, SectionTitle, useAsyncAction } from '../ui';
import { getPhase, levelsInSprint, LEVEL_LABEL, LEVEL_LADDER } from '../lib/phase';
import { generatePatterns } from '../lib/llm';
import { speak } from '../lib/speech';
import { useTimeOnTask } from '../lib/useTimeOnTask';

/**
 * Grammatik: Karteikarten und Übersicht – bewusst ohne Übungen.
 *
 * Hier wird das Skelett gelernt, nicht abgefragt. Die Aufgaben dazu stehen
 * unter Übungen; beides an einer Stelle würde die Seite zu einem zweiten
 * Übungsscreen machen und den Unterschied zwischen Nachschlagen und Üben
 * verwischen.
 *
 * Gegliedert wird nach Sprachniveau, nicht nach Sprint-Woche: Wer wissen will,
 * was auf A2 gilt, sucht nach A2 und nicht nach „Woche 3“.
 */
export function Grammar({ lang }: { lang: Language }) {
  const { state, addPatterns, updatePattern } = useStore();
  const { busy, run } = useAsyncAction();
  const phase = getPhase(lang);
  useTimeOnTask(lang.id);

  const [cards, setCards] = useState<CefrLevel | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const patterns = useMemo(
    () =>
      state.patterns
        .filter((p) => p.languageId === lang.id)
        .sort(
          (a, b) =>
            a.week - b.week || (a.order ?? 0) - (b.order ?? 0) || a.createdAt - b.createdAt,
        ),
    [state.patterns, lang.id],
  );

  const byLevel = useMemo(() => {
    const map = new Map<CefrLevel, GrammarPattern[]>();
    for (const p of patterns) {
      const level = p.level ?? 'A1';
      map.set(level, [...(map.get(level) ?? []), p]);
    }
    return map;
  }, [patterns]);

  // Stufen des laufenden Sprints – sie stehen oben und offen, der Rest ist
  // Ausblick beziehungsweise Nachschlagewerk.
  const current = useMemo(() => new Set(levelsInSprint(lang.targetLevel)), [lang.targetLevel]);

  async function makePatterns(week: 1 | 2 | 3 | 4) {
    const existing = patterns.map((p) => p.title);
    const generated = await run(() => generatePatterns(state.settings, lang, week, existing, 6), {
      success: 'Neue Muster ergänzt.',
    });
    if (generated) addPatterns(lang.id, generated, week);
  }

  if (cards) {
    const list = byLevel.get(cards) ?? [];
    return (
      <Flashcards
        level={cards}
        patterns={list}
        lang={lang}
        onMastered={(id, mastered) => updatePattern(id, { mastered })}
        onClose={() => setCards(null)}
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

  const mastered = patterns.filter((p) => p.mastered).length;

  return (
    <div className="stack">
      <SectionTitle
        title="Grammatik"
        hint={`${mastered}/${patterns.length} sitzen`}
        action={
          <Button size="sm" loading={busy} onClick={() => makePatterns(phase.week)}>
            + Woche {phase.week}
          </Button>
        }
      />

      {/* ── Karteikarten, nach Sprachniveau ── */}
      <div className="stack" style={{ gap: 10 }}>
        <div className="eyebrow">Karteikarten</div>
        {LEVEL_LADDER.map((level) => {
          const list = byLevel.get(level) ?? [];
          const done = list.filter((p) => p.mastered).length;
          const inSprint = current.has(level);
          return (
            <Card key={level} className={inSprint ? 'card-accent' : undefined}>
              <div className="row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>
                    {LEVEL_LABEL[level]}
                    {inSprint && <span className="pill pill-accent tiny" style={{ marginLeft: 8 }}>aktueller Sprint</span>}
                  </div>
                  <p className="tiny muted" style={{ margin: '2px 0 0' }}>
                    {list.length === 0
                      ? 'Noch keine Muster auf dieser Stufe.'
                      : `${list.length} Karten · ${done} sitzen`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={inSprint && list.length > 0 ? 'primary' : undefined}
                  disabled={list.length === 0}
                  onClick={() => setCards(level)}
                >
                  Karteikarten
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Übersicht ── */}
      <div className="stack" style={{ gap: 10 }}>
        <div className="eyebrow">Grammatik-Übersicht</div>
        <Card className="card-pad-0">
          <div className="list">
            {patterns.map((p) => (
              <div key={p.id} className="stack" style={{ gap: 0 }}>
                <button
                  className="list-item"
                  style={{ width: '100%', background: 'none', border: 0, cursor: 'pointer', textAlign: 'left' }}
                  onClick={() => setOpenId(openId === p.id ? null : p.id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 550 }}>
                      {p.mastered && <span style={{ color: 'var(--ok)' }}>✓ </span>}
                      {p.title}
                    </div>
                    <div className="tiny muted mono">{p.formula}</div>
                  </div>
                  <span className="pill tiny">{p.level ?? 'A1'}</span>
                  <span className="tiny muted mono">W{p.week}</span>
                  <span className="muted">{openId === p.id ? '−' : '+'}</span>
                </button>
                {openId === p.id && (
                  <div style={{ padding: '0 18px 16px' }} className="stack fade-in">
                    <p className="small muted" style={{ margin: 0 }}>
                      {p.explanation}
                    </p>
                    <div className="stack" style={{ gap: 8 }}>
                      {p.examples.map((ex, i) => (
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
                    <Button
                      size="sm"
                      variant={p.mastered ? 'ghost' : 'default'}
                      onClick={() => updatePattern(p.id, { mastered: !p.mastered })}
                    >
                      {p.mastered ? 'Als offen markieren' : 'Sitzt – als sicher markieren'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * Karteikarten-Ansicht eines Niveaus.
 *
 * Vorderseite ist der Name des Musters mit seiner Formel, Rückseite die
 * Erklärung mit Beispielen. Umgedreht wird bewusst per Klick und nicht
 * automatisch: Der Moment, in dem man versucht, sich die Regel selbst zu sagen,
 * ist der, an dem sie hängen bleibt.
 */
function Flashcards({
  level,
  patterns,
  lang,
  onMastered,
  onClose,
}: {
  level: CefrLevel;
  patterns: GrammarPattern[];
  lang: Language;
  onMastered: (id: string, mastered: boolean) => void;
  onClose: () => void;
}) {
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = patterns[pos];
  if (!card) {
    return (
      <Card>
        <Empty icon="◇" title="Keine Karten" hint="Auf dieser Stufe liegt noch nichts." />
        <Button onClick={onClose}>Zurück</Button>
      </Card>
    );
  }

  function go(delta: number) {
    setPos((p) => Math.min(patterns.length - 1, Math.max(0, p + delta)));
    setFlipped(false);
  }

  return (
    <div className="stack">
      <div className="row">
        <div>
          <div className="eyebrow">Karteikarten · {level}</div>
          <div className="tiny muted">
            Karte {pos + 1} von {patterns.length}
          </div>
        </div>
        <span className="spacer" />
        <Button size="sm" variant="ghost" onClick={onClose}>
          Schließen
        </Button>
      </div>

      <button className="flashcard flashcard-btn" onClick={() => setFlipped(!flipped)}>
        {flipped ? (
          <div className="stack fade-in flashcard-back">
            <p className="small" style={{ margin: 0 }}>
              {card.explanation}
            </p>
            <div className="stack" style={{ gap: 8 }}>
              {card.examples.map((ex, i) => (
                <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
                  <span
                    className="btn btn-ghost btn-sm"
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(ex.target, lang.code);
                    }}
                  >
                    ♪
                  </span>
                  <div>
                    <div className="target-text">{ex.target}</div>
                    <div className="tiny muted">{ex.native}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="stack" style={{ alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 600, textAlign: 'center' }}>{card.title}</div>
            <div className="mono muted" style={{ textAlign: 'center' }}>
              {card.formula}
            </div>
            <div className="tiny muted">Zum Umdrehen tippen</div>
          </div>
        )}
      </button>

      <div className="row">
        <Button size="sm" disabled={pos === 0} onClick={() => go(-1)}>
          ← Zurück
        </Button>
        <span className="spacer" />
        <Button
          size="sm"
          variant={card.mastered ? 'ghost' : 'default'}
          onClick={() => onMastered(card.id, !card.mastered)}
        >
          {card.mastered ? '✓ Sitzt' : 'Sitzt'}
        </Button>
        <span className="spacer" />
        <Button size="sm" disabled={pos >= patterns.length - 1} onClick={() => go(1)}>
          Weiter →
        </Button>
      </div>
    </div>
  );
}
