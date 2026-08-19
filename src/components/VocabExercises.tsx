import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Language } from '../types-view';
import type { Exercise } from '../types';
import { Button, Card } from '../ui';
import { loadExercises } from '../data/exercises';
import { buildRound, countStatus } from '../lib/exerciseQueue';
import { levelsCovered, levelsFromTo } from '../lib/phase';
import { ExerciseSession } from './ExerciseSession';

/**
 * Wortschatz-Übungen: Bedeutung, Lücke, Produktion, Kollokation.
 *
 * Sie hängen an einer Niveaustufe statt an einem Grammatikmuster und gehören
 * deshalb hierher und nicht in die Drills. Gezeigt wird nur, was zur Stufe des
 * laufenden Sprints passt – wie bei den Mustern auch.
 *
 * Karteikarten prüfen Wiedererkennen. Diese Übungen verlangen, das Wort im Satz
 * zu benutzen; das ist der Schritt, an dem passiver Wortschatz aktiv wird.
 */
export function VocabExercises({ lang }: { lang: Language }) {
  const { state, markExercise } = useStore();
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [open, setOpen] = useState(false);

  // Vom Einstiegsniveau bis zum Sprintziel: Wer auf B1 startet, hat die
  // B1-Wortschatzübungen nie gemacht – nur B2 zu zeigen wäre eine Lücke.
  const levels = useMemo(
    () => new Set(levelsFromTo(lang.startLevel, lang.targetLevel)),
    [lang.startLevel, lang.targetLevel],
  );
  // Geladen wird etwas großzügiger als gezeigt: `levelsCovered` nimmt beim
  // A2-Einstieg auch A1 dazu, sonst fehlte dem ersten Sprint sein Material.
  const stufen = useMemo(
    () => levelsCovered(lang.startLevel, lang.targetLevel),
    [lang.startLevel, lang.targetLevel],
  );

  useEffect(() => {
    let alive = true;
    loadExercises(lang.name, stufen).then((list) => {
      if (alive) setCatalog(list);
    });
    return () => {
      alive = false;
    };
  }, [lang.name, stufen]);

  const exercises = useMemo(
    () => catalog.filter((e) => e.kind === 'wortschatz' && e.level && levels.has(e.level)),
    [catalog, levels],
  );

  const solvedIds = useMemo(() => {
    const set = new Set<string>();
    for (const [id, p] of Object.entries(state.exerciseProgress)) if (p.solved) set.add(id);
    return set;
  }, [state.exerciseProgress]);

  // Ohne Material gar nichts zeigen: Eine leere Karte mit Erklärung wäre nur
  // ein Versprechen, das die Sprache noch nicht einlöst.
  if (exercises.length === 0) return null;

  if (open) {
    return (
      <ExerciseSession
        exercises={buildRound(exercises, state.exerciseProgress, { interleave: true })}
        lang={lang}
        title={`Wortschatz-Übungen · ${[...levels].join(' und ')}`}
        solvedIds={solvedIds}
        onSolved={(id, correct) => markExercise(id, lang.id, correct)}
        onClose={() => setOpen(false)}
      />
    );
  }

  const { due, fresh, solved, total } = countStatus(exercises, state.exerciseProgress);

  return (
    <Card>
      <div className="row">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600 }}>Wortschatz-Übungen</div>
          <div className="tiny muted">
            {total} Aufgaben · {solved} gelöst
            {due > 0 && ` · ${due} fällig`}
            {fresh > 0 && ` · ${fresh} neu`}
          </div>
        </div>
        <Button size="sm" variant={due > 0 ? 'primary' : undefined} onClick={() => setOpen(true)}>
          Runde starten
        </Button>
      </div>
    </Card>
  );
}
