import { useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { ContentType } from '../types';
import { Button } from '../ui';
import { CONTENT_TYPES, TYPE_LABEL } from '../lib/labels';

/**
 * Zusätzliche Inhalte: Podcasts, Serien, Bücher – was neben den Übungen läuft.
 *
 * Sie hängen an keiner Phase. Der Fokus-Modus begrenzt die *Lernmodule*; eine
 * Podcast-Liste konkurriert damit nicht, sie ist der Rahmen um die tägliche
 * halbe Stunde. Angelegt werden sie beim Einrichten einer Sprache, ergänzt
 * werden können sie jederzeit hier.
 */
export function ContentList({ lang }: { lang: Language }) {
  const { state, addContent, updateContent, deleteContent } = useStore();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentType>('podcast');

  const content = state.content.filter((c) => c.languageId === lang.id);

  function save() {
    if (!title.trim()) return;
    addContent({
      languageId: lang.id,
      type,
      title: title.trim(),
      status: 'geplant',
      progress: 0,
      notes: '',
    });
    setTitle('');
    setAdding(false);
  }

  return (
    <div className="stack" style={{ gap: 8 }}>
      {content.length === 0 && !adding && (
        <p className="tiny muted" style={{ margin: 0 }}>
          Bücher, Hörbücher, Podcasts, Serien – was du auf {lang.name} liest und hörst.
        </p>
      )}

      <div className="stack" style={{ gap: 4 }}>
        {content.map((c) => (
          <div key={c.id} className="row small">
            <span className="tiny">{TYPE_LABEL[c.type]}</span>
            <span style={{ flex: 1, minWidth: 0 }}>{c.title}</span>
            <select
              className="input tiny"
              style={{ maxWidth: 110, padding: '2px 6px' }}
              value={c.status}
              onChange={(e) => updateContent(c.id, { status: e.target.value as typeof c.status })}
            >
              <option value="geplant">geplant</option>
              <option value="aktiv">aktiv</option>
              <option value="fertig">fertig</option>
            </select>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => deleteContent(c.id)}
              aria-label="Löschen"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="row">
          <select
            className="input"
            style={{ maxWidth: 140 }}
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          <input
            className="input"
            value={title}
            autoFocus
            placeholder="Titel"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <Button size="sm" onClick={save} disabled={!title.trim()}>
            Anlegen
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => setAdding(true)}>
          + Inhalt
        </Button>
      )}
    </div>
  );
}
