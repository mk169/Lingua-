import { useEffect, useState } from 'react';
import { analysisToWords, useStore } from '../store';
import type { Language } from '../types-view';
import type { Analysis } from '../types';
import { Button, Card, Empty, SectionTitle, useAsyncAction, useToast } from '../ui';
import { analyzeWriting, generateWritingPrompts } from '../lib/llm';
import { todayISO, formatDate } from '../lib/date';

const FALLBACK_PROMPTS = [
  'Beschreibe deinen heutigen Tag in 3–5 Sätzen.',
  'Was hast du am Wochenende vor?',
  'Beschreibe dein Lieblingsessen und warum du es magst.',
  'Erzähle von einem Menschen, der dir wichtig ist.',
  'Was würdest du ändern, wenn du mehr Zeit hättest?',
];

/** Schreib-Tagebuch: 3–5 Sätze täglich, die KI korrigiert knapp und erklärt Muster. */
export function Writing({ lang }: { lang: Language }) {
  const { state, addJournal, patchJournal, addCards } = useStore();
  const notify = useToast();
  const { busy, run } = useAsyncAction();

  const [prompts, setPrompts] = useState<string[]>(FALLBACK_PROMPTS);
  const [prompt, setPrompt] = useState(FALLBACK_PROMPTS[0]);
  const [text, setText] = useState('');
  const [level] = useState('A2');

  const entries = state.journal.filter((j) => j.languageId === lang.id);
  const todaysEntry = entries.find((j) => j.date === todayISO());

  useEffect(() => {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [prompts]);

  async function refreshPrompts() {
    const result = await run(() => generateWritingPrompts(state.settings, lang, level, 5));
    if (result?.length) setPrompts(result);
  }

  async function submit() {
    if (!text.trim()) return;
    const entry = addJournal({
      languageId: lang.id,
      date: todayISO(),
      prompt,
      text: text.trim(),
    });
    const analysis = await run(() =>
      analyzeWriting(state.settings, lang, text.trim(), prompt, level),
    );
    if (analysis) {
      patchJournal(entry.id, { analysis });
      notify(`Korrigiert – ${analysis.score}/100.`);
    }
    setText('');
  }

  function saveWords(analysis: Analysis) {
    const created = addCards(lang.id, analysisToWords(analysis), 'llm', true);
    notify(created.length > 0 ? `${created.length} Wörter ins Deck.` : 'Schon im Deck.');
  }

  return (
    <div className="stack">
      <SectionTitle
        title="Schreib-Tagebuch"
        hint={`${entries.length} Einträge`}
        action={
          <Button size="sm" variant="ghost" loading={busy} onClick={refreshPrompts}>
            ✦ Neue Impulse
          </Button>
        }
      />

      <Card>
        <div className="row" style={{ marginBottom: 10 }}>
          <span className="eyebrow">Heutiger Impuls</span>
          <span className="spacer" />
          <button
            className="tiny muted"
            style={{ background: 'none', border: 0, cursor: 'pointer' }}
            onClick={() => setPrompt(prompts[Math.floor(Math.random() * prompts.length)])}
          >
            anderer Impuls
          </button>
        </div>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{prompt}</p>

        <textarea
          className="textarea"
          style={{ minHeight: 130, marginTop: 12, fontFamily: 'var(--serif)', fontSize: 16 }}
          placeholder={`Schreibe 3–5 Sätze auf ${lang.name}…`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="row" style={{ marginTop: 10 }}>
          <span className="tiny muted">
            {text.trim() ? text.trim().split(/\s+/).length : 0} Wörter
          </span>
          <span className="spacer" />
          <Button variant="primary" loading={busy} onClick={submit} disabled={!text.trim()}>
            Korrigieren lassen
          </Button>
        </div>

        {todaysEntry && (
          <p className="tiny" style={{ marginTop: 10, color: 'var(--ok)' }}>
            ✓ Heute schon geschrieben – ein zweiter Eintrag ist trotzdem erlaubt.
          </p>
        )}
      </Card>

      {entries.length === 0 ? (
        <Card>
          <Empty
            icon="✎"
            title="Noch nichts geschrieben"
            hint="Täglich 3–5 Sätze reichen. Die Korrektur zeigt dir deine wiederkehrenden Fehlermuster."
          />
        </Card>
      ) : (
        <div className="stack">
          {entries.map((e) => (
            <Card key={e.id}>
              <div className="row" style={{ marginBottom: 8 }}>
                <span className="tiny muted">{formatDate(e.date)}</span>
                <span className="spacer" />
                {e.analysis && (
                  <span
                    className="pill mono tiny"
                    style={{
                      color:
                        e.analysis.score >= 85
                          ? 'var(--ok)'
                          : e.analysis.score >= 65
                            ? 'var(--warn)'
                            : 'var(--danger)',
                    }}
                  >
                    {e.analysis.score}/100
                  </span>
                )}
              </div>
              <div className="tiny muted" style={{ marginBottom: 6 }}>
                {e.prompt}
              </div>
              <p className="target-text" style={{ fontSize: 16 }}>
                {e.text}
              </p>

              {e.analysis && (
                <div style={{ marginTop: 12 }} className="stack">
                  <hr className="divider" />
                  {e.analysis.errors.length === 0 ? (
                    <div className="small" style={{ color: 'var(--ok)' }}>
                      ✓ Keine Fehler gefunden.
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="tiny muted">Korrigierte Fassung</div>
                        <p className="target-text small">{e.analysis.corrected}</p>
                      </div>
                      {e.analysis.errors.map((err, i) => (
                        <div key={i} className="error-item small">
                          <div>
                            <span className="strike">{err.original}</span> →{' '}
                            <span className="fix">{err.correction}</span>
                            <span className="pill tiny" style={{ marginLeft: 6 }}>
                              {err.type}
                            </span>
                          </div>
                          <div className="tiny muted">{err.explanation}</div>
                        </div>
                      ))}
                    </>
                  )}
                  {e.analysis.tip && (
                    <div className="small" style={{ color: 'var(--ink-2)' }}>
                      💡 {e.analysis.tip}
                    </div>
                  )}
                  {e.analysis.newWords.length > 0 && (
                    <div className="row row-wrap">
                      {e.analysis.newWords.map((w, i) => (
                        <span key={i} className="pill tiny">
                          <span className="target-text">{w.term}</span> · {w.translation}
                        </span>
                      ))}
                      <Button size="sm" variant="ghost" onClick={() => saveWords(e.analysis!)}>
                        + Ins Deck
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
