import { useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { ReaderText } from '../types';
import { Button, Card, Empty, Field, Modal, SectionTitle, useAsyncAction, useToast } from '../ui';
import { generateReaderText, lookupWord, type GeneratedWord } from '../lib/llm';
import { speak } from '../lib/speech';

const TOPICS = [
  'Ein Tag in der Stadt',
  'Im Café bestellen',
  'Wohnung suchen',
  'Arbeit und Kollegen',
  'Reisepläne',
  'Einkaufen und Preise',
  'Beim Arzt',
  'Familie und Freunde',
];

/** Reader-Modus: verständlicher Input (i+1), Wörter per Klick ins Deck übernehmen. */
export function Reader({ lang }: { lang: Language }) {
  const { state, addText, deleteText, addCards } = useStore();
  const notify = useToast();
  const { busy, run } = useAsyncAction();

  const [openText, setOpenText] = useState<ReaderText | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [level, setLevel] = useState('A1');
  const [length, setLength] = useState<'kurz' | 'mittel' | 'lang'>('kurz');
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteBody, setPasteBody] = useState('');

  const texts = useMemo(
    () => state.texts.filter((t) => t.languageId === lang.id),
    [state.texts, lang.id],
  );
  const knownWords = useMemo(
    () =>
      state.cards
        .filter((c) => c.languageId === lang.id && c.unlockedAt !== null)
        .map((c) => c.term),
    [state.cards, lang.id],
  );

  async function create() {
    const result = await run(() =>
      generateReaderText(state.settings, lang, { knownWords, topic, level, length }),
    );
    if (!result) return;
    const text = addText({
      languageId: lang.id,
      title: result.title,
      body: result.body,
      translation: result.translation,
      glossary: result.glossary ?? [],
      questions: result.questions ?? [],
      level,
      source: 'llm',
    });
    setCreating(false);
    setOpenText(text);
  }

  function importText() {
    if (!pasteBody.trim()) return;
    const text = addText({
      languageId: lang.id,
      title: pasteTitle.trim() || 'Eigener Text',
      body: pasteBody.trim(),
      glossary: [],
      questions: [],
      level,
      source: 'user',
    });
    setImporting(false);
    setPasteTitle('');
    setPasteBody('');
    setOpenText(text);
    notify('Text hinzugefügt. Tippe auf ein Wort, um es nachzuschlagen.');
  }

  if (openText) {
    return (
      <ReaderView
        text={openText}
        lang={lang}
        knownWords={knownWords}
        onBack={() => setOpenText(null)}
        onSaveWord={(word) => {
          const created = addCards(lang.id, [word], 'reader', true);
          notify(
            created.length > 0
              ? `„${word.term}“ ins Deck übernommen.`
              : 'Das Wort ist schon im Deck.',
          );
        }}
      />
    );
  }

  return (
    <div className="stack">
      <SectionTitle
        title="Reader"
        hint="Verständlicher Input – der Text nutzt vor allem Wörter, die du schon kennst"
        action={
          <div className="row">
            <Button size="sm" onClick={() => setImporting(true)}>
              Text einfügen
            </Button>
            <Button size="sm" variant="primary" onClick={() => setCreating(true)}>
              + Text erzeugen
            </Button>
          </div>
        }
      />

      {texts.length === 0 ? (
        <Card>
          <Empty
            icon="❦"
            title="Noch keine Texte"
            hint={`Lass einen Text auf deinem Niveau erzeugen – er baut auf deinen ${knownWords.length} freigeschalteten Wörtern auf und führt nur wenige neue ein.`}
            action={
              <Button variant="primary" onClick={() => setCreating(true)}>
                Ersten Text erzeugen
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid">
          {texts.map((t) => (
            <Card key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="row">
                <span className="pill tiny">{t.level}</span>
                <span className="tiny muted">
                  {new Date(t.createdAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
                <span className="spacer" />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => deleteText(t.id)}
                  aria-label="Löschen"
                >
                  ✕
                </button>
              </div>
              <h3 className="target-text" style={{ fontSize: 17 }}>
                {t.title}
              </h3>
              <p className="small muted" style={{ flex: 1 }}>
                {t.body.slice(0, 120)}…
              </p>
              <Button size="sm" onClick={() => setOpenText(t)}>
                Lesen
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Text erzeugen"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" loading={busy} onClick={create}>
              Erzeugen
            </Button>
          </>
        }
      >
        <Field label="Thema">
          <input
            className="input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            list="topics"
          />
          <datalist id="topics">
            {TOPICS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </Field>
        <div className="row">
          <Field label="Niveau">
            <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
              {['A1', 'A2', 'B1', 'B2'].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Länge">
            <select
              className="select"
              value={length}
              onChange={(e) => setLength(e.target.value as typeof length)}
            >
              <option value="kurz">kurz (~100 Wörter)</option>
              <option value="mittel">mittel (~200)</option>
              <option value="lang">lang (~300)</option>
            </select>
          </Field>
        </div>
        <p className="tiny muted">
          Der Text berücksichtigt deine {knownWords.length} freigeschalteten Wörter und führt
          höchstens 8–12 neue ein.
        </p>
      </Modal>

      <Modal
        open={importing}
        onClose={() => setImporting(false)}
        title="Eigenen Text einfügen"
        footer={
          <>
            <Button variant="ghost" onClick={() => setImporting(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" onClick={importText}>
              Hinzufügen
            </Button>
          </>
        }
      >
        <Field label="Titel">
          <input
            className="input"
            value={pasteTitle}
            onChange={(e) => setPasteTitle(e.target.value)}
            placeholder="Optional"
          />
        </Field>
        <Field label="Text" hint="Artikel, Songtext, Untertitel – alles in der Zielsprache.">
          <textarea
            className="textarea"
            style={{ minHeight: 200 }}
            value={pasteBody}
            onChange={(e) => setPasteBody(e.target.value)}
          />
        </Field>
      </Modal>
    </div>
  );
}

/** Lesen mit Wort-Nachschlag: jedes Wort ist anklickbar. */
function ReaderView({
  text,
  lang,
  knownWords,
  onBack,
  onSaveWord,
}: {
  text: ReaderText;
  lang: Language;
  knownWords: string[];
  onBack: () => void;
  onSaveWord: (word: GeneratedWord) => void;
}) {
  const { state } = useStore();
  const { busy, run } = useAsyncAction();
  const [showTranslation, setShowTranslation] = useState(false);
  const [lookup, setLookup] = useState<GeneratedWord | null>(null);
  const [selected, setSelected] = useState('');

  const known = useMemo(
    () => new Set(knownWords.map((w) => w.toLowerCase().replace(/^(el|la|le|il|the)\s+/, ''))),
    [knownWords],
  );

  const tokens = useMemo(() => text.body.split(/(\s+)/), [text.body]);

  async function onWordClick(raw: string) {
    const word = raw.replace(/[^\p{L}\p{M}'’-]/gu, '');
    if (!word) return;
    setSelected(word);
    // Satz um das Wort herum als Kontext mitgeben.
    const idx = text.body.indexOf(raw);
    const start = Math.max(0, text.body.lastIndexOf('.', idx) + 1);
    const end = text.body.indexOf('.', idx);
    const sentence = text.body.slice(start, end === -1 ? undefined : end + 1).trim();

    const result = await run(() => lookupWord(state.settings, lang, word, sentence));
    if (result) setLookup(result);
  }

  return (
    <div className="stack">
      <div className="row">
        <Button size="sm" variant="ghost" onClick={onBack}>
          ← Zurück
        </Button>
        <span className="spacer" />
        <Button size="sm" variant="ghost" onClick={() => speak(text.body, lang.code)}>
          ♪ Vorlesen
        </Button>
        {text.translation && (
          <Button size="sm" onClick={() => setShowTranslation(!showTranslation)}>
            {showTranslation ? 'Übersetzung aus' : 'Übersetzung'}
          </Button>
        )}
      </div>

      <Card>
        <div className="row" style={{ marginBottom: 14 }}>
          <span className="pill tiny">{text.level}</span>
          <span className="tiny muted">Tippe ein Wort an, um es nachzuschlagen</span>
        </div>
        <h1 className="target-text" style={{ marginBottom: 16 }}>
          {text.title}
        </h1>
        <div className="reader-body">
          {tokens.map((tok, i) => {
            if (/^\s+$/.test(tok)) return tok;
            const clean = tok.replace(/[^\p{L}\p{M}'’-]/gu, '').toLowerCase();
            return (
              <span
                key={i}
                className="word"
                data-known={known.has(clean)}
                onClick={() => onWordClick(tok)}
              >
                {tok}
              </span>
            );
          })}
        </div>

        {showTranslation && text.translation && (
          <div className="fade-in" style={{ marginTop: 20 }}>
            <hr className="divider" />
            <p className="small muted" style={{ marginTop: 14, whiteSpace: 'pre-wrap' }}>
              {text.translation}
            </p>
          </div>
        )}
      </Card>

      {text.glossary.length > 0 && (
        <Card>
          <SectionTitle title="Neue Wörter" hint={`${text.glossary.length}`} />
          <div className="stack" style={{ gap: 6 }}>
            {text.glossary.map((g, i) => (
              <div key={i} className="row small">
                <span className="target-text" style={{ minWidth: 140 }}>
                  {g.term}
                </span>
                <span className="muted" style={{ flex: 1 }}>
                  {g.translation}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onSaveWord({
                      term: g.term,
                      translation: g.translation,
                      pos: '',
                      example: '',
                      exampleTranslation: '',
                      tags: ['Reader'],
                    })
                  }
                >
                  + Deck
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {text.questions.length > 0 && (
        <Card>
          <SectionTitle title="Verständnisfragen" />
          <ol className="target-text" style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
            {text.questions.map((q, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {q}
              </li>
            ))}
          </ol>
        </Card>
      )}

      <Modal
        open={Boolean(lookup) || busy}
        onClose={() => setLookup(null)}
        title={selected || 'Nachschlagen'}
        footer={
          lookup && (
            <>
              <Button variant="ghost" onClick={() => setLookup(null)}>
                Schließen
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onSaveWord(lookup);
                  setLookup(null);
                }}
              >
                Ins Deck
              </Button>
            </>
          )
        }
      >
        {busy && !lookup ? (
          <div className="row muted">
            <span className="spinner" /> Wird nachgeschlagen…
          </div>
        ) : lookup ? (
          <div className="stack">
            <div>
              <div className="flashcard-term" style={{ fontSize: 24, textAlign: 'left' }}>
                {lookup.term}
              </div>
              <div className="tiny muted">{lookup.pos}</div>
            </div>
            <div style={{ fontSize: 17 }}>{lookup.translation}</div>
            {lookup.example && (
              <div className="small">
                <span className="target-text">{lookup.example}</span>
                <div className="muted">{lookup.exampleTranslation}</div>
              </div>
            )}
            <Button size="sm" variant="ghost" onClick={() => speak(lookup.term, lang.code)}>
              ♪ Anhören
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
