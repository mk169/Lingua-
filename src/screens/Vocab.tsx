import { useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { Card as CardType } from '../types';
import { Bar, Button, Card, Empty, Field, Modal, SectionTitle, useAsyncAction, useToast } from '../ui';
import { generateVocab, parseUpload, type GeneratedWord } from '../lib/llm';
import { speak } from '../lib/speech';
import { todayISO } from '../lib/date';
import { useTimeOnTask } from '../lib/useTimeOnTask';

type Filter = 'aktiv' | 'pool' | 'schwer' | 'ausgesetzt' | 'alle';

/** Vokabelverwaltung: Deck ansehen, eigenes Material hochladen, Nachschub erzeugen. */
export function Vocab({ lang }: { lang: Language }) {
  const { state, addCards, deleteCard, updateCard, unlockNow, restoreCard } = useStore();
  useTimeOnTask(lang.id);
  const notify = useToast();
  const { busy, run } = useAsyncAction();

  const [filter, setFilter] = useState<Filter>('aktiv');
  const [query, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [raw, setRaw] = useState('');
  const [preview, setPreview] = useState<GeneratedWord[] | null>(null);
  const [manual, setManual] = useState(false);
  const [manualTerm, setManualTerm] = useState('');
  const [manualTrans, setManualTrans] = useState('');

  const cards = useMemo(
    () => state.cards.filter((c) => c.languageId === lang.id),
    [state.cards, lang.id],
  );
  const active = cards.filter((c) => c.unlockedAt !== null);
  const pool = cards.filter((c) => c.unlockedAt === null);
  const leeches = cards.filter((c) => c.suspended);

  const searching = query.trim().length > 0;

  const visible = useMemo(() => {
    // Bei aktiver Suche das gesamte Deck durchsuchen: Wörter im Pool wären
    // sonst unauffindbar, obwohl sie längst im Deck liegen.
    let list = searching
      ? cards
      : filter === 'aktiv'
        ? active
        : filter === 'pool'
          ? pool
          : filter === 'schwer'
            ? active.filter((c) => !c.suspended && (c.srs.lapses >= 2 || c.srs.ease < 2.1))
            : filter === 'ausgesetzt'
              ? leeches
              : cards;
    if (searching) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) => c.term.toLowerCase().includes(q) || c.translation.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => a.order - b.order).slice(0, 300);
  }, [filter, active, pool, leeches, cards, query, searching]);

  async function generateMore(count: number) {
    const existing = cards.map((c) => c.term);
    const band = Math.floor(cards.length / 100);
    const words = await run(() =>
      generateVocab(state.settings, lang, count, existing, band),
    );
    if (!words) return;
    const created = addCards(lang.id, words, 'llm', false);
    notify(
      created.length > 0
        ? `${created.length} neue Wörter im Pool. Sie werden täglich portionsweise freigeschaltet.`
        : 'Keine neuen Wörter – alle waren schon im Deck.',
    );
  }

  async function analyzeUpload() {
    if (!raw.trim()) return;
    const words = await run(() => parseUpload(state.settings, lang, raw));
    if (words) setPreview(words);
  }

  function confirmUpload(unlocked: boolean) {
    if (!preview) return;
    const created = addCards(lang.id, preview, 'user', unlocked);
    const skipped = preview.length - created.length;
    notify(
      created.length === 0
        ? 'Nichts hinzugefügt – alle Wörter waren schon im Deck.'
        : `${created.length} Karten hinzugefügt${skipped > 0 ? `, ${skipped} Dubletten übersprungen` : ''}.`,
    );
    setPreview(null);
    setRaw('');
    setUploading(false);
  }

  function addManual() {
    if (!manualTerm.trim() || !manualTrans.trim()) return;
    addCards(
      lang.id,
      [
        {
          term: manualTerm.trim(),
          translation: manualTrans.trim(),
          pos: '',
          example: '',
          exampleTranslation: '',
          tags: ['eigen'],
        },
      ],
      'user',
      true,
    );
    setManualTerm('');
    setManualTrans('');
    notify('Karte hinzugefügt.');
  }

  const newToday = cards.filter(
    (c) => c.unlockedAt !== null && todayISO(new Date(c.unlockedAt)) === todayISO(),
  ).length;

  return (
    <div className="stack">
      <SectionTitle
        title="Vokabeln"
        hint={`${active.length} aktiv · ${pool.length} im Pool`}
        action={
          <div className="row">
            <Button size="sm" onClick={() => setManual(true)}>
              + Karte
            </Button>
            <Button size="sm" onClick={() => setUploading(true)}>
              ↑ Hochladen
            </Button>
            <Button size="sm" variant="primary" loading={busy} onClick={() => generateMore(50)}>
              ✦ 50 erzeugen
            </Button>
          </div>
        }
      />

      {/* Fortschritt zum Phase-1-Ziel */}
      <Card>
        <div className="row" style={{ marginBottom: 8 }}>
          <div>
            <span className="mono" style={{ fontSize: 26 }}>
              {active.length}
            </span>
            <span className="muted small"> / 1000 Wörter aktiv</span>
          </div>
          <span className="spacer" />
          <span className="pill mono">
            {newToday}/{lang.dailyNewWords} heute freigeschaltet
          </span>
        </div>
        <Bar value={active.length} max={1000} />
        <div className="row" style={{ marginTop: 12 }}>
          <p className="tiny muted" style={{ flex: 1, margin: 0 }}>
            Neue Wörter werden jeden Tag automatisch aus dem Pool freigeschaltet. Läuft der Pool
            leer, erzeuge Nachschub oder lade eigenes Material hoch.
          </p>
          {pool.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const n = unlockNow(lang.id, 10);
                notify(`${n} weitere Wörter freigeschaltet.`);
              }}
            >
              +10 sofort
            </Button>
          )}
        </div>
      </Card>

      {/* Filter */}
      <div className="row row-wrap">
        {(['aktiv', 'pool', 'schwer', 'ausgesetzt', 'alle'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`pill ${!searching && filter === f ? 'pill-accent' : ''}`}
            onClick={() => {
              setFilter(f);
              setQuery('');
            }}
            style={{ cursor: 'pointer', opacity: searching ? 0.5 : 1 }}
            title={searching ? 'Die Suche durchsucht das gesamte Deck' : undefined}
          >
            {f === 'aktiv' && `Aktiv ${active.length}`}
            {f === 'pool' && `Pool ${pool.length}`}
            {f === 'schwer' && 'Schwierige'}
            {f === 'ausgesetzt' && `Ausgesetzt ${leeches.length}`}
            {f === 'alle' && `Alle ${cards.length}`}
          </button>
        ))}
        <span className="spacer" />
        <input
          className="input"
          style={{ maxWidth: 220 }}
          placeholder="Suchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {searching && (
        <div className="tiny muted">
          {visible.length} Treffer im gesamten Deck ({cards.length} Karten)
        </div>
      )}

      {visible.length === 0 ? (
        <Card>
          <Empty
            icon="◇"
            title="Keine Karten in dieser Ansicht"
            hint="Erzeuge Nachschub oder lade eigene Vokabeln hoch."
          />
        </Card>
      ) : (
        <Card className="card-pad-0">
          <div className="list">
            {visible.map((c) => (
              <VocabRow
                key={c.id}
                card={c}
                lang={lang}
                onDelete={() => deleteCard(c.id)}
                onUnlock={() => updateCard(c.id, { unlockedAt: Date.now() })}
                onRestore={() => restoreCard(c.id)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Upload eigener Vokabeln und Übungen */}
      <Modal
        open={uploading}
        onClose={() => {
          setUploading(false);
          setPreview(null);
        }}
        title="Eigenes Material hochladen"
        wide
        footer={
          preview ? (
            <>
              <Button variant="ghost" onClick={() => setPreview(null)}>
                Zurück
              </Button>
              <Button onClick={() => confirmUpload(false)}>In den Pool</Button>
              <Button variant="primary" onClick={() => confirmUpload(true)}>
                Sofort freischalten
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setUploading(false)}>
                Abbrechen
              </Button>
              <Button variant="primary" loading={busy} onClick={analyzeUpload} disabled={!raw.trim()}>
                Auswerten
              </Button>
            </>
          )
        }
      >
        {preview ? (
          <div className="stack">
            <p className="small muted">
              {preview.length} Karten erkannt. Prüfe kurz und übernimm sie.
            </p>
            <div style={{ maxHeight: 340, overflowY: 'auto' }} className="list">
              {preview.map((w, i) => (
                <div key={i} className="list-item">
                  <div style={{ flex: 1 }}>
                    <div className="target-text">{w.term}</div>
                    <div className="tiny muted">{w.translation}</div>
                    {w.example && (
                      <div className="tiny muted" style={{ fontStyle: 'italic' }}>
                        {w.example}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPreview(preview.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <Field
              label="Vokabeln, Notizen oder Übungen"
              hint="Beliebiges Format: „wort - übersetzung“, Tabelle, Liste oder Fließtext. Fehlende Übersetzungen und Beispielsätze werden ergänzt."
            >
              <textarea
                className="textarea"
                style={{ minHeight: 220, fontFamily: 'var(--mono)', fontSize: 13 }}
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder={'la mesa - der Tisch\nla silla - der Stuhl\n\noder ein ganzer Text …'}
              />
            </Field>
            <div className="row">
              <label className="btn btn-sm" style={{ cursor: 'pointer' }}>
                Datei wählen (.txt, .csv)
                <input
                  type="file"
                  accept=".txt,.csv,.md,.tsv"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) setRaw(await file.text());
                  }}
                />
              </label>
              <span className="tiny muted">{raw.length} Zeichen</span>
            </div>
          </>
        )}
      </Modal>

      {/* Einzelne Karte manuell */}
      <Modal
        open={manual}
        onClose={() => setManual(false)}
        title="Karte anlegen"
        footer={
          <>
            <Button variant="ghost" onClick={() => setManual(false)}>
              Schließen
            </Button>
            <Button variant="primary" onClick={addManual}>
              Hinzufügen
            </Button>
          </>
        }
      >
        <Field label={lang.name}>
          <input
            className="input"
            value={manualTerm}
            onChange={(e) => setManualTerm(e.target.value)}
            autoFocus
          />
        </Field>
        <Field label="Deutsch">
          <input
            className="input"
            value={manualTrans}
            onChange={(e) => setManualTrans(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addManual()}
          />
        </Field>
      </Modal>
    </div>
  );
}

function VocabRow({
  card,
  lang,
  onDelete,
  onUnlock,
  onRestore,
}: {
  card: CardType;
  lang: Language;
  onDelete: () => void;
  onUnlock: () => void;
  onRestore: () => void;
}) {
  const locked = card.unlockedAt === null;
  return (
    <div className="list-item">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="target-text" style={{ fontWeight: 550 }}>
            {card.term}
          </span>
          {card.pos && <span className="tiny muted">{card.pos}</span>}
          {locked && <span className="pill tiny">Pool</span>}
          {card.srs.lapses >= 2 && <span className="pill pill-warn tiny">{card.srs.lapses}× vergessen</span>}
          {card.suspended && <span className="pill pill-warn tiny">ausgesetzt</span>}
        </div>
        <div className="small muted">{card.translation}</div>
        {card.example && (
          <div className="tiny muted" style={{ fontStyle: 'italic' }}>
            {card.example}
          </div>
        )}
      </div>

      {!locked && (
        <div style={{ textAlign: 'right' }} className="tiny muted mono">
          <div>{card.srs.interval > 0 ? `${card.srs.interval} T` : 'neu'}</div>
          <div>EF {card.srs.ease.toFixed(1)}</div>
        </div>
      )}

      <button className="btn btn-ghost btn-sm" onClick={() => speak(card.term, lang.code)}>
        ♪
      </button>
      {locked && (
        <button className="btn btn-ghost btn-sm" onClick={onUnlock} title="Jetzt freischalten">
          ↑
        </button>
      )}
      {card.suspended && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={onRestore}
          title="Wieder in die Wiederholung nehmen – am besten erst den Beispielsatz ändern"
        >
          ↺
        </button>
      )}
      <button className="btn btn-ghost btn-sm" onClick={onDelete} aria-label="Löschen">
        ✕
      </button>
    </div>
  );
}
