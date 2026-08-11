/**
 * Das voreingestellte Modell – bewusst in einer eigenen Datei.
 *
 * `storage.ts` braucht diese Konstante für `emptyState()` und wird beim Start
 * ausgewertet. Läge sie in `llm.ts`, zöge jeder Start das Anthropic-SDK mit in
 * die Auswertung: mehrere hundert Kilobyte Drittcode, ausgeführt bevor
 * irgendetwas auf dem Bildschirm steht. Genau dort darf am wenigsten
 * schiefgehen.
 */
export const DEFAULT_MODEL = 'claude-opus-5';
