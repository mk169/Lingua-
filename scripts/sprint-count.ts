/**
 * Zwischenstand beim Bauen des Sprints: zählt je Tagesdatei die Datensätze.
 * Reines Werkzeug für die Entwicklung – das Qualitätstor ist
 * `npm run validate:sprint`.
 */

import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { SprintDay } from '../src/data/sprint/types';

const dir = join(import.meta.dirname, '../src/data/sprint/it-a2-b1');
const files = readdirSync(dir)
  .filter((f) => /^day\d\d\.ts$/.test(f))
  .sort();

let vokabeln = 0;
for (const file of files) {
  const day: SprintDay = (await import(join(dir, file))).default;
  vokabeln += day.vokabeln.length;
  const marker = day.vokabeln.length === 45 ? ' ' : '!';
  console.log(
    `${marker} Tag ${String(day.tag).padStart(2)} | W${day.woche} | Vok ${day.vokabeln.length} | Üb ${day.uebungen.length} | Wdh ${day.wiederholung.length} | Verst ${day.verstaendnis.length} | Prod ${day.produktion.length} | ${day.grammatik.map((g) => g.slug).join(', ')}`,
  );
}
console.log(`\n${files.length}/30 Tage, ${vokabeln}/1350 Vokabeln`);
