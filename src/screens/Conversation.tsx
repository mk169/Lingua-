import { useEffect, useRef, useState } from 'react';
import { analysisToWords, useStore } from '../store';
import type { Language } from '../types-view';
import type { Analysis, ChatMessage } from '../types';
import { Button, Card, Empty, Field, Modal, SectionTitle, useToast } from '../ui';
import { analyzeMessage, streamReply } from '../lib/llm';
import { listen, speak, sttSupported } from '../lib/speech';
import { uid } from '../lib/id';
import { useTimeOnTask } from '../lib/useTimeOnTask';

const SCENARIOS = [
  { title: 'Small Talk', prompt: 'Ein lockeres Gespräch über den Alltag, Hobbys und Pläne.' },
  { title: 'Im Café', prompt: 'Du bist Kellner:in in einem Café. Der Lernende bestellt.' },
  { title: 'Wegbeschreibung', prompt: 'Der Lernende hat sich verlaufen und fragt dich nach dem Weg.' },
  { title: 'Wohnungssuche', prompt: 'Du vermietest eine Wohnung, der Lernende erkundigt sich.' },
  { title: 'Vorstellungsgespräch', prompt: 'Du führst ein lockeres Vorstellungsgespräch.' },
  { title: 'Beim Arzt', prompt: 'Du bist Ärzt:in, der Lernende beschreibt Beschwerden.' },
  { title: 'Einkaufen', prompt: 'Du arbeitest in einem Geschäft, der Lernende sucht etwas.' },
];

/**
 * Konversationsmodul (Phase 3).
 * Zwei parallele Aufrufe pro Nachricht:
 *   1. natürliche Antwort des Gesprächspartners (gestreamt)
 *   2. Analyse und Korrektur der Nutzernachricht
 */
export function Conversation({ lang }: { lang: Language }) {
  useTimeOnTask(lang.id);
  const { state, newChat, addMessage, patchMessage, deleteChat, addCards } = useStore();
  const notify = useToast();

  const chats = state.chats.filter((c) => c.languageId === lang.id);
  const [activeId, setActiveId] = useState<string | null>(chats[0]?.id ?? null);
  const [picking, setPicking] = useState(chats.length === 0);
  const [customScenario, setCustomScenario] = useState('');
  const [level, setLevel] = useState('A2');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<{ stop(): void } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const chat = chats.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat?.messages.length, sending]);

  function start(scenario: string) {
    const created = newChat(lang.id, scenario);
    setActiveId(created.id);
    setPicking(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || !chat || sending) return;

    const userMsg: ChatMessage = {
      id: uid('m'),
      role: 'user',
      content: text,
      ts: Date.now(),
      pending: true,
    };
    addMessage(chat.id, userMsg);
    setInput('');
    setSending(true);

    const assistantId = uid('m');
    addMessage(chat.id, {
      id: assistantId,
      role: 'assistant',
      content: '',
      ts: Date.now(),
      pending: true,
    });

    const history = [
      ...chat.messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ];

    // Beide Spuren laufen parallel: die Antwort soll nicht auf die Korrektur warten.
    const replyTask = (async () => {
      let acc = '';
      await streamReply(state.settings, lang, {
        scenario: chat.scenario,
        level,
        history,
        onDelta: (delta) => {
          acc += delta;
          patchMessage(chat.id, assistantId, { content: acc });
        },
      });
      patchMessage(chat.id, assistantId, { pending: false });
      if (state.settings.ttsEnabled && acc) speak(acc, lang.code);
      return acc;
    })();

    const analysisTask = analyzeMessage(state.settings, lang, text, level);

    const [reply, analysis] = await Promise.allSettled([replyTask, analysisTask]);

    if (reply.status === 'rejected') {
      patchMessage(chat.id, assistantId, {
        content: '⚠️ ' + (reply.reason?.message ?? 'Antwort fehlgeschlagen.'),
        pending: false,
      });
      notify(reply.reason?.message ?? 'Antwort fehlgeschlagen.', 'error');
    }
    if (analysis.status === 'fulfilled') {
      patchMessage(chat.id, userMsg.id, { analysis: analysis.value, pending: false });
    } else {
      patchMessage(chat.id, userMsg.id, { pending: false });
    }

    setSending(false);
  }

  function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    const rec = listen(lang.code, {
      onResult: (text) => setInput(text),
      onError: (msg) => {
        notify(msg, 'error');
        setRecording(false);
      },
      onEnd: () => setRecording(false),
    });
    if (rec) {
      recorderRef.current = rec;
      setRecording(true);
    }
  }

  function saveWords(analysis: Analysis) {
    const words = analysisToWords(analysis);
    if (words.length === 0) return;
    const created = addCards(lang.id, words, 'llm', true);
    notify(
      created.length > 0
        ? `${created.length} Wörter ins Deck übernommen.`
        : 'Die Wörter sind schon im Deck.',
    );
  }

  if (!chat) {
    return (
      <>
        <Card>
          <Empty
            icon="❝"
            title="Konversation starten"
            hint="Die KI antwortet wie ein echter Gesprächspartner – und prüft parallel jede deiner Nachrichten auf Grammatik, Wortwahl und Wortstellung."
            action={<Button variant="primary" onClick={() => setPicking(true)}>Situation wählen</Button>}
          />
        </Card>
        <ScenarioModal
          open={picking}
          onClose={() => setPicking(false)}
          custom={customScenario}
          setCustom={setCustomScenario}
          level={level}
          setLevel={setLevel}
          onStart={start}
        />
      </>
    );
  }

  return (
    <div className="stack">
      <SectionTitle
        title="Konversation"
        hint={chat.scenario.slice(0, 60)}
        action={
          <div className="row">
            <select
              className="select"
              style={{ width: 'auto' }}
              value={activeId ?? ''}
              onChange={(e) => setActiveId(e.target.value)}
            >
              {chats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.scenario.slice(0, 34)}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={() => setPicking(true)}>
              + Neu
            </Button>
          </div>
        }
      />

      <div className="chat">
        <div className="chat-log" ref={logRef}>
          {chat.messages.length === 0 && (
            <p className="small muted" style={{ textAlign: 'center', margin: 'auto' }}>
              Schreib die erste Nachricht auf {lang.name}. Fehler sind erwünscht – sie werden
              korrigiert.
            </p>
          )}

          {chat.messages.map((m) =>
            m.role === 'assistant' ? (
              <div key={m.id} className="bubble bubble-ai">
                {m.content || <span className="spinner" />}
                {m.content && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginLeft: 6, padding: '0 4px' }}
                    onClick={() => speak(m.content, lang.code)}
                    aria-label="Vorlesen"
                  >
                    ♪
                  </button>
                )}
              </div>
            ) : (
              <div key={m.id} className="msg-group">
                <div className="bubble bubble-user">{m.content}</div>
                {m.pending && (
                  <span className="tiny muted">
                    <span className="spinner" /> wird geprüft…
                  </span>
                )}
                {m.analysis && (
                  <AnalysisPanel analysis={m.analysis} onSaveWords={() => saveWords(m.analysis!)} />
                )}
              </div>
            ),
          )}
        </div>

        <div className="chat-input">
          <textarea
            className="textarea"
            placeholder={`Auf ${lang.name} schreiben…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          {sttSupported() && (
            <Button variant={recording ? 'danger' : 'default'} onClick={toggleRecording}>
              {recording ? <span className="rec-dot" /> : '●'}
            </Button>
          )}
          <Button variant="primary" onClick={send} loading={sending} disabled={!input.trim()}>
            Senden
          </Button>
        </div>
      </div>

      <div className="row">
        <span className="tiny muted">
          Enter sendet · Shift+Enter für eine neue Zeile · Niveau {level}
        </span>
        <span className="spacer" />
        <Button
          size="sm"
          variant="danger"
          onClick={() => {
            deleteChat(chat.id);
            setActiveId(chats.find((c) => c.id !== chat.id)?.id ?? null);
          }}
        >
          Gespräch löschen
        </Button>
      </div>

      <ScenarioModal
        open={picking}
        onClose={() => setPicking(false)}
        custom={customScenario}
        setCustom={setCustomScenario}
        level={level}
        setLevel={setLevel}
        onStart={start}
      />
    </div>
  );
}

function AnalysisPanel({
  analysis,
  onSaveWords,
}: {
  analysis: Analysis;
  onSaveWords: () => void;
}) {
  const [open, setOpen] = useState(false);
  const clean = analysis.errors.length === 0;

  return (
    <div className={`analysis fade-in ${clean ? 'analysis-ok' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <span style={{ color: clean ? 'var(--ok)' : 'var(--warn)' }}>
          {clean ? '✓ Korrekt' : `${analysis.errors.length} Korrektur${analysis.errors.length > 1 ? 'en' : ''}`}
        </span>
        <span className="spacer" />
        <span className="mono tiny muted">{analysis.score}/100</span>
        <span className="muted">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="stack fade-in" style={{ gap: 8, marginTop: 8 }}>
          {!clean && (
            <div>
              <div className="tiny muted">Korrigiert</div>
              <div className="target-text">{analysis.corrected}</div>
            </div>
          )}

          {analysis.errors.map((e, i) => (
            <div key={i} className="error-item">
              <div>
                <span className="strike">{e.original}</span> → <span className="fix">{e.correction}</span>
                <span className="pill tiny" style={{ marginLeft: 6 }}>
                  {e.type}
                </span>
              </div>
              <div className="tiny muted">{e.explanation}</div>
            </div>
          ))}

          {analysis.tip && (
            <div className="tiny" style={{ color: 'var(--ink-2)' }}>
              💡 {analysis.tip}
            </div>
          )}

          {analysis.newWords.length > 0 && (
            <div>
              <div className="tiny muted" style={{ marginBottom: 4 }}>
                Nützliche Wörter dafür
              </div>
              <div className="row row-wrap" style={{ gap: 6 }}>
                {analysis.newWords.map((w, i) => (
                  <span key={i} className="pill tiny">
                    <span className="target-text">{w.term}</span> · {w.translation}
                  </span>
                ))}
              </div>
              <Button size="sm" variant="ghost" style={{ marginTop: 6 }} onClick={onSaveWords}>
                + Ins Deck
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScenarioModal({
  open,
  onClose,
  custom,
  setCustom,
  level,
  setLevel,
  onStart,
}: {
  open: boolean;
  onClose: () => void;
  custom: string;
  setCustom: (v: string) => void;
  level: string;
  setLevel: (v: string) => void;
  onStart: (scenario: string) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Situation wählen">
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        {SCENARIOS.map((s) => (
          <button
            key={s.title}
            className="lang-item"
            style={{ padding: 12, display: 'block' }}
            onClick={() => onStart(s.prompt)}
          >
            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
            <div className="tiny muted">{s.prompt.slice(0, 50)}…</div>
          </button>
        ))}
      </div>

      <hr className="divider" />

      <Field label="Eigene Situation" hint="Beschreibe, wer dein Gegenüber ist und worum es geht.">
        <input
          className="input"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="z.B. Du bist mein neuer Nachbar und wir treffen uns im Hausflur."
          onKeyDown={(e) => e.key === 'Enter' && custom.trim() && onStart(custom.trim())}
        />
      </Field>

      <Field label="Dein Niveau">
        <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
          {['A1', 'A2', 'B1', 'B2'].map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </Field>

      <Button variant="primary" disabled={!custom.trim()} onClick={() => onStart(custom.trim())}>
        Eigene Situation starten
      </Button>
    </Modal>
  );
}
