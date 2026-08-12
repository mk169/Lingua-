/**
 * Brücke vom Sprint in den Übungskatalog der App.
 *
 * Der Sprint kennt feinere Aufgabentypen als der Katalog und stellt an manche
 * Aufgabe Anforderungen, die `scripts/validate-exercises.ts` nicht abbildet
 * (etwa freie Sätze ohne eindeutige Musterlösung). Deshalb wird hier nicht
 * alles übernommen, sondern nur, was im Drills-Screen sinnvoll abfragbar ist:
 * eine Aufgabe, eine Lösung, ein prüfbares Format.
 */

import type { Exercise, ExerciseKind } from '../../types';
import { SEED_LANGUAGES } from '../seed';
import type { Sprint, SprintExercise } from './types';

/** Typen ohne eindeutig prüfbare Lösung – die bleiben im Sprint. */
const NUR_IM_SPRINT = new Set(['eigener-satz', 'nachricht', 'situation', 'kontext', 'antworten']);

/**
 * Der Katalog ordnet jede Übung einem Grammatikmuster zu. Sprint-Übungen, die
 * reinen Wortschatz prüfen, tragen dort einen `wortschatz-…`-Bezug und gehören
 * deshalb nicht in den Katalog – im Sprint bleiben sie erhalten.
 */
const MUSTER_SLUGS = new Set(
  SEED_LANGUAGES.flatMap((l) => l.patterns.map((p) => p.slug).filter((s): s is string => !!s)),
);

function kindVon(u: SprintExercise): ExerciseKind {
  if (u.app_type === 'translate') return 'satz';
  if (u.app_type === 'choice' && u.aufgabe_zielsprache.includes('\n')) return 'verstaendnis';
  return 'konstruktion';
}

/**
 * Der Katalog-Validator verlangt für `cloze` eine sichtbare Lücke und für
 * `order` einen Trenner. Aufgaben, die das nicht erfüllen, wandern nicht in den
 * Katalog – sie sind im Sprint richtig, nur nicht maschinell prüfbar.
 */
function katalogtauglich(u: SprintExercise): boolean {
  if (NUR_IM_SPRINT.has(u.aufgabentyp)) return false;
  if (!MUSTER_SLUGS.has(u.getestete_grammatik)) return false;
  if (u.app_type === 'cloze' && !u.aufgabe_zielsprache.includes('___')) return false;
  if (u.app_type === 'order' && !u.aufgabe_zielsprache.includes(' / ')) return false;
  if (u.app_type === 'choice' && !u.optionen?.length) return false;
  return true;
}

/**
 * Wandelt die Übungen eines Sprints in Katalogeinträge um.
 *
 * Die Festigungstage greifen bewusst frühere Aufgaben wieder auf – im Sprint
 * ist das gewollte Wiederholung, im Katalog wäre es eine Dublette. Deshalb
 * gewinnt hier das erste Vorkommen.
 */
export function sprintToExercises(sprint: Sprint): Exercise[] {
  const alle = sprint.days.flatMap((d) => [...d.uebungen, ...d.wiederholung]);
  const gesehen = new Set<string>();
  const eindeutig = alle.filter(katalogtauglich).filter((u) => {
    const key = `${u.getestete_grammatik}|${kindVon(u)}|${u.aufgabe_zielsprache.toLowerCase().replace(/\s+/g, ' ').trim()}`;
    if (gesehen.has(key)) return false;
    gesehen.add(key);
    return true;
  });
  return eindeutig.map<Exercise>((u) => ({
    id: u.exercise_id,
    patternSlug: u.getestete_grammatik,
    kind: kindVon(u),
    type: u.app_type,
    prompt: u.aufgabe_zielsprache,
    answer: u.richtige_antwort,
    ...(u.optionen?.length ? { options: u.optionen } : {}),
    hint: u.kurze_loesungserklaerung,
  }));
}
