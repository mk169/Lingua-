import { useEffect, useRef } from 'react';
import { useStore } from '../store';

/**
 * Misst die tatsächlich gelernte Zeit auf einem Modul.
 *
 * Bisher nahm `DayLog.minutes` nur Zahlen aus manuell abgehakten Habits
 * entgegen – das Zeitbudget im Dashboard war damit Deko. Gezählt wird nur,
 * solange der Tab sichtbar ist; ein offener Hintergrundtab ist keine Lernzeit.
 * Angebrochene Minuten werden beim Verlassen aufgerundet, wenn mindestens eine
 * halbe verstrichen ist.
 */
export function useTimeOnTask(languageId: string | null | undefined): void {
  const { logActivity } = useStore();
  // Über Renders hinweg zählen, ohne jedes Mal neu zu rendern.
  const seconds = useRef(0);

  useEffect(() => {
    if (!languageId) return;
    seconds.current = 0;

    const flush = (value: number) => {
      if (value <= 0) return;
      logActivity(languageId, { minutes: value });
    };

    const tick = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      seconds.current += 10;
      if (seconds.current >= 60) {
        seconds.current -= 60;
        flush(1);
      }
    }, 10_000);

    return () => {
      clearInterval(tick);
      flush(seconds.current >= 30 ? 1 : 0);
    };
  }, [languageId, logActivity]);
}
