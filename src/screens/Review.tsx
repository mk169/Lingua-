import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language, View } from '../types-view';
import type { Card as CardType, ReviewMode } from '../types';
import { Button, Card, Empty, useAsyncAction, useToast } from '../ui';
import { dueCards, previewIntervals } from '../lib/sm2';
import { todayISO } from '../lib/date';
import { generateSentences } from '../lib/llm';
import { getPhase } from '../lib/phase';
import { listen, similarity, speak, sttSupported } from '../lib/speech';
import { useTimeOnTask } from '../lib/useTimeOnTask';

type Mode = 'recognize' | 'recall';

/**
 * Welche Richtung diese Karte gerade abgefragt wird.
 *
 * Im Modus `adapt` starten neue Karten erkennend (Ziel → Deutsch) und kippen
 * ab der dritten Wiederholung auf Produktion (Deutsch → Ziel). Erkennen ist
 * die leichte Richtung mit dem schwächeren Lerneffekt; Produktion ist das,
 * was sich aufs Sprechen überträgt – aber am Anfang zu schwer.
 */
function directionFor(card: CardType, setting: ReviewMode): Mode {
  if (setting === 'recognize') return 'recognize';
  if (setting === 'produce') return 'recall';
  return card.srs.reps >= 2 ? 'recall' : 'recognize';
}

/**
 * Karteikarten-Review nach SM-2.
 * Ab Phase 3 kann das Wort zusätzlich eingesprochen statt nur gedacht werden.
 */
export function Review({ lang, go }: { lang: Language; go: (view: View) => void }) {
  const { state, reviewCard, updateCard, updateSettings } = useStore();
  useTimeOnTask(lang.id);
  const notify = useToast();
  const { busy, run } = useAsyncAction();
  const today = todayISO();
  const phase = getPhase(lang, today);

  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [spoken, setSpoken] = useState('');
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState<{ stop(): void } | null>(null);

  const queue = useMemo(
    () => dueCards(state.cards, lang.id, today),
    [state.cards, lang.id, today],
  );
  const card = queue[0] ?? null;
  const total = done + queue.length;

  const autoSpeak = state.settings.ttsEnabled;

  useEffect(() => {
    setRevealed(false);
    setSpoken('');
  }, [card?.id]);

  // Beim Aufdecken das Wort vorlesen (Klangbild mitlernen).
  useEffect(() => {
    if (revealed && autoSpeak && card) speak(card.term, lang.code);
  }, [revealed, card, autoSpeak, lang.code]);

  const rate = useCallback(
    (quality: number) => {
      if (!card) return;
      reviewCard(card.id, quality);
      setDone((d) => d + 1);
      setRevealed(false);
    },
    [card, reviewCard],
  );

  // Tastatursteuerung: Leertaste deckt auf, 1–4 bewerten.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName))
        return;
      if (e.code === 'Space') {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (!revealed) return;
      const map: Record<string, number> = { '1': 0, '2': 3, '3': 4, '4': 5 };
      if (e.key in map) {
        e.preventDefault();
        rate(map[e.key]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, rate]);

  async function moreSentences(target: CardType) {
    const sentences = await run(
      () => generateSentences(state.settings, lang, target, 3),
      { success: 'Neue Beispielsätze ergänzt.' },
    );
    if (!sentences) return;
    updateCard(target.id, {
      extraExamples: [...target.extraExamples, ...sentences].slice(-9),
    });
  }

  function toggleRecording() {
    if (recording) {
      recorder?.stop();
      setRecording(false);
      return;
    }
    if (!card) return;
    setSpoken('');
    const rec = listen(lang.code, {
      onResult: (text) => setSpoken(text),
      onError: (msg) => {
        notify(msg, 'error');
        setRecording(false);
      },
      onEnd: () => setRecording(false),
    });
    if (rec) {
      setRecorder(rec);
      setRecording(true);
    }
  }

  if (!card) {
    return (
      <Card>
        <Empty
          icon="✓"
          title={done > 0 ? `${done} Karten wiederholt` : 'Nichts fällig'}
          hint={
            done > 0
              ? 'Der Stapel für heute ist leer. Morgen wartet die nächste Runde.'
              : 'Heute sind keine Karten fällig. Neue Wörter werden automatisch freigeschaltet.'
          }
          action={
            <div className="row" style={{ justifyContent: 'center' }}>
              <Button onClick={() => go('dashboard')}>Zum Dashboard</Button>
              <Button variant="primary" onClick={() => go('exercises')}>
                Übungen
              </Button>
            </div>
          }
        />
      </Card>
    );
  }

  const previews = previewIntervals(card.srs, today);
  const mode = directionFor(card, state.settings.reviewMode);
  const front = mode === 'recognize' ? card.term : card.translation;
  const back = mode === 'recognize' ? card.translation : card.term;
  const score = spoken ? similarity(spoken, card.term) : 0;

  return (
    <div className="review-wrap stack">
      {/* Kopfzeile mit Fortschritt */}
      <div className="row">
        <span className="small muted mono">
          {done + 1} / {total}
        </span>
        <div className="bar" style={{ flex: 1, maxWidth: 200 }}>
          <div
            className="bar-fill"
            style={{ width: `${total ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <span className="spacer" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            updateSettings({
              reviewMode:
                state.settings.reviewMode === 'adapt'
                  ? 'recognize'
                  : state.settings.reviewMode === 'recognize'
                    ? 'produce'
                    : 'adapt',
            })
          }
          title="Abfragerichtung: mitwachsend, nur erkennen oder nur produzieren"
        >
          {state.settings.reviewMode === 'adapt'
            ? `↕ ${mode === 'recognize' ? `${lang.name} → DE` : `DE → ${lang.name}`}`
            : state.settings.reviewMode === 'recognize'
              ? `${lang.name} → DE`
              : `DE → ${lang.name}`}
        </Button>
      </div>

      {/* Die Karte */}
      <div className="flashcard">
        <div>
          <div className="flashcard-term">{front}</div>
          {mode === 'recognize' && card.pos && (
            <div className="tiny muted" style={{ marginTop: 6 }}>
              {card.pos}
            </div>
          )}
        </div>

        {revealed ? (
          <div className="stack fade-in" style={{ gap: 12 }}>
            <hr className="divider" />
            <div className="flashcard-translation">{back}</div>
            {card.example && (
              <div className="flashcard-example">
                „{card.example}“
                {card.exampleTranslation && (
                  <div className="small muted" style={{ fontStyle: 'normal', marginTop: 4 }}>
                    {card.exampleTranslation}
                  </div>
                )}
              </div>
            )}
            {card.extraExamples.length > 0 && (
              <div className="stack" style={{ gap: 6, textAlign: 'left' }}>
                {card.extraExamples.slice(-3).map((ex, i) => (
                  <div key={i} className="small">
                    <span className="target-text">{ex.target}</span>
                    <span className="muted"> — {ex.native}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="muted small">Leertaste zum Aufdecken</div>
        )}
      </div>

      {/* Aktionen an der Karte */}
      <div className="row row-wrap" style={{ justifyContent: 'center' }}>
        <Button size="sm" variant="ghost" onClick={() => speak(card.term, lang.code)}>
          ♪ Anhören
        </Button>
        <Button
          size="sm"
          variant="ghost"
          loading={busy}
          onClick={() => moreSentences(card)}
          title="Neue Alltagssätze mit diesem Wort erzeugen"
        >
          ✦ Neue Sätze
        </Button>
        {phase.phase >= 3 && sttSupported() && (
          <Button size="sm" variant="ghost" onClick={toggleRecording}>
            {recording ? (
              <>
                <span className="rec-dot" /> Stopp
              </>
            ) : (
              '● Einsprechen'
            )}
          </Button>
        )}
      </div>

      {spoken && (
        <Card className="fade-in">
          <div className="row">
            <div style={{ flex: 1 }}>
              <div className="tiny muted">Erkannt</div>
              <div className="target-text">{spoken}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                className="mono"
                style={{
                  fontSize: 20,
                  color: score > 0.8 ? 'var(--ok)' : score > 0.5 ? 'var(--warn)' : 'var(--danger)',
                }}
              >
                {Math.round(score * 100)}%
              </div>
              <div className="tiny muted">Übereinstimmung</div>
            </div>
          </div>
        </Card>
      )}

      {/* Bewertung */}
      {revealed ? (
        <div className="rating-row fade-in">
          {previews.map((p) => (
            <button key={p.quality} className="rating" onClick={() => rate(p.quality)}>
              <span className="rating-label">{p.label}</span>
              <span className="rating-interval">
                {p.key} · {p.label2}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <Button variant="primary" block onClick={() => setRevealed(true)}>
          Aufdecken
        </Button>
      )}

      <div className="tiny muted" style={{ textAlign: 'center' }}>
        SM-2 · Intervalle 1 / 3 / 7 / 14 Tage, danach nach Easiness-Faktor{' '}
        <span className="mono">{card.srs.ease.toFixed(2)}</span>
        {card.srs.lapses > 0 && ` · ${card.srs.lapses}× vergessen`}
      </div>
    </div>
  );
}
