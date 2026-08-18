import { useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { CefrLevel, Phase, ReviewMode } from '../types';
import { Button, Card, Field, SectionTitle, useToast } from '../ui';
import { exportState, importState } from '../lib/storage';
import { DEFAULT_MODEL } from '../lib/llm';
import { getPhase, LEVEL_LABEL, LEVEL_LADDER } from '../lib/phase';
import { ttsSupported, sttSupported, speak } from '../lib/speech';
import { todayISO } from '../lib/date';

export function Settings({ lang }: { lang: Language | null }) {
  const { state, updateSettings, updateLanguage, deleteLanguage, update, clearReports } =
    useStore();
  const notify = useToast();
  const [showKey, setShowKey] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const phase = lang ? getPhase(lang) : null;

  function download() {
    const blob = new Blob([exportState(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lingua-backup-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function upload(file: File) {
    try {
      const next = importState(await file.text());
      update(() => next);
      notify('Daten importiert.');
    } catch {
      notify('Datei konnte nicht gelesen werden.', 'error');
    }
  }

  return (
    <div className="stack">
      <SectionTitle title="Einstellungen" />

      {/* API */}
      <Card>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          KI-Anbindung
        </div>
        <div className="stack">
          <Field
            label="Anthropic API-Schlüssel"
            hint="Wird nur in deinem Browser gespeichert (localStorage) und direkt an api.anthropic.com gesendet. Für den Mehrbenutzerbetrieb gehört der Schlüssel hinter ein eigenes Backend."
          >
            <div className="row">
              <input
                className="input"
                type={showKey ? 'text' : 'password'}
                value={state.settings.apiKey}
                onChange={(e) => updateSettings({ apiKey: e.target.value.trim() })}
                placeholder="sk-ant-…"
                autoComplete="off"
                spellCheck={false}
              />
              <Button size="sm" variant="ghost" onClick={() => setShowKey(!showKey)}>
                {showKey ? 'verbergen' : 'zeigen'}
              </Button>
            </div>
          </Field>

          <div className="row">
            <Field label="Modell">
              <input
                className="input"
                value={state.settings.model}
                onChange={(e) => updateSettings({ model: e.target.value.trim() })}
                placeholder={DEFAULT_MODEL}
              />
            </Field>
            <Field label="Denktiefe" >
              <select
                className="select"
                value={state.settings.effort}
                onChange={(e) =>
                  updateSettings({ effort: e.target.value as 'low' | 'medium' | 'high' })
                }
              >
                <option value="low">niedrig – schnell, günstig</option>
                <option value="medium">mittel – ausgewogen</option>
                <option value="high">hoch – gründlich</option>
              </select>
            </Field>
          </div>

          <p className="tiny muted">
            Ohne Schlüssel funktionieren Review, Drills mit Startpaket, eigene Karten und der
            Alltags-Modus. Generierung, Reader-Texte, Konversation und Korrektur brauchen ihn.
          </p>
        </div>
      </Card>

      {/* Lernverhalten */}
      <Card>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Lernverhalten
        </div>
        <Field label="Abfragerichtung im Review">
          <select
            className="input"
            value={state.settings.reviewMode}
            onChange={(e) => updateSettings({ reviewMode: e.target.value as ReviewMode })}
          >
            <option value="adapt">Mitwachsend – erst erkennen, ab der 3. Wiederholung produzieren</option>
            <option value="recognize">Nur erkennen – Zielsprache → Deutsch</option>
            <option value="produce">Nur produzieren – Deutsch → Zielsprache</option>
          </select>
        </Field>
        <p className="tiny muted" style={{ marginTop: 6 }}>
          Erkennen ist die leichte Richtung. Produzieren ist das, was sich aufs Sprechen
          überträgt – am Anfang aber zu schwer, deshalb der Wechsel unterwegs.
        </p>
        <label className="row" style={{ cursor: 'pointer', marginTop: 14 }}>
          <input
            type="checkbox"
            checked={state.settings.listenMode}
            onChange={(e) => updateSettings({ listenMode: e.target.checked })}
          />
          <span style={{ flex: 1 }}>
            Verständnisübungen zuerst nur hören
            <span className="tiny muted" style={{ display: 'block' }}>
              Der Satz wird vorgelesen, den Text gibt es erst nach der Antwort.
            </span>
          </span>
        </label>
      </Card>

      {/* Sprachausgabe */}
      <Card>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Sprache & Ton
        </div>
        <div className="stack">
          <label className="row" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={state.settings.ttsEnabled}
              onChange={(e) => updateSettings({ ttsEnabled: e.target.checked })}
            />
            <span style={{ flex: 1 }}>Wörter und Antworten automatisch vorlesen</span>
            {lang && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => speak(lang.nativeName, lang.code)}
                disabled={!ttsSupported()}
              >
                Test
              </Button>
            )}
          </label>
          <div className="row row-wrap tiny muted">
            <span className="pill tiny">
              Sprachausgabe {ttsSupported() ? 'verfügbar' : 'nicht verfügbar'}
            </span>
            <span className="pill tiny">
              Spracherkennung {sttSupported() ? 'verfügbar' : 'nicht verfügbar'}
            </span>
          </div>
        </div>
      </Card>

      {/* Aktuelle Sprache */}
      {lang && phase && (
        <Card>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {lang.emoji} {lang.name}
          </div>
          <div className="stack">
            <div className="row">
              <Field label="Neue Wörter pro Tag" >
                <input
                  className="input"
                  type="number"
                  min={5}
                  max={100}
                  value={lang.dailyNewWords}
                  onChange={(e) =>
                    updateLanguage(lang.id, { dailyNewWords: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Zeitbudget (Min/Tag)">
                <input
                  className="input"
                  type="number"
                  min={10}
                  max={180}
                  value={lang.dailyMinutes}
                  onChange={(e) =>
                    updateLanguage(lang.id, { dailyMinutes: Number(e.target.value) })
                  }
                />
              </Field>
            </div>

            <div className="row">
              <Field label="Slot" >
                <select
                  className="select"
                  value={lang.slot}
                  onChange={(e) =>
                    updateLanguage(lang.id, { slot: e.target.value as 'focus' | 'maintenance' })
                  }
                >
                  <option value="focus">Fokus – 30–45 Min täglich</option>
                  <option value="maintenance">Wartung – 15–30 Min, 3–5×/Woche</option>
                </select>
              </Field>
              <Field label="Sprint-Start">
                <input
                  className="input"
                  type="date"
                  value={lang.startDate}
                  onChange={(e) => updateLanguage(lang.id, { startDate: e.target.value })}
                />
              </Field>
            </div>

            <Field
              label="Startniveau"
              hint="Bestimmt, wo das Vokabeldeck im Frequenzband einsteigt und welche Stufe der erste Sprint anpeilt. Es verschiebt nur die Reihenfolge im Pool – gelöscht wird nichts, zurückgestellte Wörter stehen unter Vokabeln."
            >
              <select
                className="select"
                value={lang.startLevel}
                onChange={(e) =>
                  updateLanguage(lang.id, { startLevel: e.target.value as CefrLevel })
                }
              >
                {LEVEL_LADDER.map((level) => (
                  <option key={level} value={level}>
                    {LEVEL_LABEL[level]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Phase"
              hint={`Aktuell Tag ${phase.day} → Phase ${phase.phase} (${phase.range}). Überschreiben schaltet Module vorzeitig frei.`}
            >
              <select
                className="select"
                value={lang.phaseOverride ?? ''}
                onChange={(e) =>
                  updateLanguage(lang.id, {
                    phaseOverride: e.target.value ? (Number(e.target.value) as Phase) : null,
                  })
                }
              >
                <option value="">Automatisch nach Sprint-Tag</option>
                <option value="1">Phase 1 – Fundament</option>
                <option value="2">Phase 2 – Input</option>
                <option value="3">Phase 3 – Produktion & Alltag</option>
              </select>
            </Field>

            <Field label="Sprachcode für Aussprache" hint="BCP-47, z.B. es-MX statt es-ES.">
              <input
                className="input"
                value={lang.code}
                onChange={(e) => updateLanguage(lang.id, { code: e.target.value.trim() })}
              />
            </Field>

            <hr className="divider" />
            {confirmDelete ? (
              <div className="row">
                <span className="small">
                  Wirklich alles zu {lang.name} löschen? Karten, Texte, Chats – unwiderruflich.
                </span>
                <span className="spacer" />
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Abbrechen
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    deleteLanguage(lang.id);
                    notify(`${lang.name} gelöscht.`);
                  }}
                >
                  Löschen
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>
                Sprache löschen
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Gemeldete Übungen */}
      {state.reports.length > 0 && (
        <Card>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Gemeldete Übungen
          </div>
          <p className="small muted">
            Der Übungskatalog ist von Hand geschrieben und nicht muttersprachlich geprüft. Was du
            hier gemeldet hast, steht noch im Repo – schick die Liste weiter, dann wird sie
            korrigiert.
          </p>
          <div className="stack" style={{ gap: 8, marginTop: 12 }}>
            {state.reports.slice(0, 20).map((r) => (
              <div key={r.exerciseId} className="tiny">
                <span className="mono muted">{r.exerciseId}</span>
                <div>
                  {r.prompt.replace(/\n+/g, ' · ')} → <span className="fix">{r.answer}</span>
                </div>
              </div>
            ))}
            {state.reports.length > 20 && (
              <span className="tiny muted">… und {state.reports.length - 20} weitere.</span>
            )}
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <Button
              size="sm"
              onClick={() => {
                const text = state.reports
                  .map((r) => `${r.exerciseId}\t${r.prompt.replace(/\n+/g, ' ')}\t${r.answer}`)
                  .join('\n');
                navigator.clipboard
                  .writeText(text)
                  .then(() => notify(`${state.reports.length} Meldungen kopiert.`))
                  .catch(() => notify('Kopieren hat nicht geklappt.'));
              }}
            >
              Liste kopieren
            </Button>
            <Button size="sm" variant="ghost" onClick={clearReports}>
              Liste leeren
            </Button>
          </div>
        </Card>
      )}

      {/* Daten */}
      <Card>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Daten
        </div>
        <p className="small muted">
          Alles liegt lokal in diesem Browser. Exportiere regelmäßig, wenn dir dein Fortschritt
          wichtig ist.
        </p>
        <div className="row" style={{ marginTop: 12 }}>
          <Button size="sm" onClick={download}>
            ↓ Export
          </Button>
          <label className="btn btn-sm" style={{ cursor: 'pointer' }}>
            ↑ Import
            <input
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
            />
          </label>
          <span className="spacer" />
          <span className="tiny muted mono">
            {state.cards.length} Karten · {state.texts.length} Texte · {state.chats.length} Chats
          </span>
        </div>
      </Card>
    </div>
  );
}
