import { useState } from 'react';
import { useStore } from '../store';
import { Button, Field, Modal, useAsyncAction, useToast } from '../ui';
import { SEED_LANGUAGES, SUGGESTIONS, findSeed } from '../data/seed';
import { describeLanguage } from '../lib/llm';
import { getPhase } from '../lib/phase';
import { dueCards } from '../lib/sm2';

/** Startbildschirm: bestehende Sprachen wählen oder mit "+" eine neue anlegen. */
export function LanguagePicker() {
  const { state, addLanguage, setActive } = useStore();
  const notify = useToast();
  const { busy, run } = useAsyncAction();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const hasKey = Boolean(state.settings.apiKey);
  const existingNames = new Set(state.languages.map((l) => l.name.toLowerCase()));

  async function create(rawName: string) {
    const trimmed = rawName.trim();
    if (!trimmed) return;
    if (existingNames.has(trimmed.toLowerCase())) {
      notify('Diese Sprache gibt es schon.', 'error');
      return;
    }

    const seed = findSeed(trimmed);
    if (seed) {
      addLanguage({
        name: seed.name,
        nativeName: seed.nativeName,
        code: seed.code,
        emoji: seed.emoji,
        seed,
      });
      setAdding(false);
      setName('');
      notify(`${seed.name} angelegt – Startpaket mit ${seed.words.length} Wörtern geladen.`);
      return;
    }

    if (!hasKey) {
      // Ohne Schlüssel trotzdem anlegen – Wortschatz kommt dann per Upload.
      addLanguage({ name: trimmed, nativeName: trimmed, code: 'en-US', emoji: '🌍' });
      setAdding(false);
      setName('');
      notify('Angelegt. Ohne API-Schlüssel kannst du Vokabeln unter "Vokabeln" hochladen.');
      return;
    }

    const info = await run(() => describeLanguage(state.settings, trimmed));
    if (!info) return;
    addLanguage({
      name: trimmed,
      nativeName: info.nativeName,
      code: info.code,
      emoji: info.emoji,
    });
    setAdding(false);
    setName('');
    notify(info.note);
  }

  const available = SEED_LANGUAGES.filter((s) => !existingNames.has(s.name.toLowerCase()));

  return (
    <div className="picker">
      <div className="eyebrow">Lingua</div>
      <h1 style={{ marginTop: 6 }}>Welche Sprache heute?</h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: 520 }}>
        30 Tage striktes Programm: erst das Sprachskelett, dann verständlicher Input, dann
        eigene Produktion. Danach offen und alltagstauglich.
      </p>

      <div className="lang-list">
        {state.languages.map((lang) => {
          const phase = getPhase(lang);
          const due = dueCards(state.cards, lang.id).length;
          return (
            <button key={lang.id} className="lang-item" onClick={() => setActive(lang.id)}>
              <span className="lang-emoji">{lang.emoji}</span>
              <span style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, display: 'block' }}>{lang.name}</span>
                <span className="small muted">
                  Sprint {lang.sprint} → {lang.targetLevel} · Tag {phase.day} · {phase.title}
                  {lang.slot === 'focus' ? ' · Fokus' : ' · Wartung'}
                </span>
              </span>
              {due > 0 && <span className="pill pill-accent mono">{due} fällig</span>}
              <span className="muted">→</span>
            </button>
          );
        })}

        <button className="lang-item lang-add" onClick={() => setAdding(true)}>
          <span style={{ fontSize: 20 }}>+</span> Sprache hinzufügen
        </button>
      </div>

      {state.languages.length === 0 && (
        <p className="small muted" style={{ marginTop: 18 }}>
          Für Spanisch, Italienisch, Französisch, Polnisch und Portugiesisch ist ein Startpaket hinterlegt – du kannst
          sofort loslegen. Jede andere Sprache wird beim Anlegen per KI eingerichtet.
        </p>
      )}

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Neue Sprache"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" loading={busy} onClick={() => create(name)}>
              Anlegen
            </Button>
          </>
        }
      >
        {available.length > 0 && (
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Mit Startpaket
            </div>
            <div className="row row-wrap">
              {available.map((s) => (
                <Button key={s.name} size="sm" onClick={() => create(s.name)} disabled={busy}>
                  {s.emoji} {s.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Field
          label="Andere Sprache"
          hint={
            hasKey
              ? 'Wird per KI eingerichtet: Eigenbezeichnung, Sprachausgabe und Anfängerhinweis.'
              : 'Ohne API-Schlüssel wird die Sprache leer angelegt – Vokabeln kannst du danach hochladen.'
          }
        >
          <input
            className="input"
            placeholder="z.B. Portugiesisch"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create(name)}
            autoFocus
          />
        </Field>

        <div className="row row-wrap">
          {SUGGESTIONS.filter((s) => !existingNames.has(s.toLowerCase())).map((s) => (
            <button key={s} className="pill" onClick={() => setName(s)} disabled={busy}>
              {s}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
