/**
 * Startet die gebaute App und klickt sie einmal durch – in jeder verfügbaren
 * Browser-Engine.
 *
 * Anlass: Die App war auf iOS Safari eine weiße Seite, während alle Prüfungen
 * in Chromium grün waren. „Im Browser getestet" hieß hier immer „in Chromium
 * getestet". Ein Startfehler darf nicht mehr an der Prüfung vorbei live gehen.
 *
 *   npm run smoke
 *   SMOKE_SKIP_MISSING=1 npm run smoke   # fehlende Engines überspringen
 *
 * Exit 1 bei jedem `pageerror`, jedem Konsolenfehler und jeder Antwort >= 400.
 */

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium, webkit, firefox } from 'playwright';

const PORT = Number(process.env.SMOKE_PORT ?? 4179);
const URL = `http://localhost:${PORT}/Lingua-/`;
const SKIP_MISSING = process.env.SMOKE_SKIP_MISSING === '1';
const ENGINES = [
  ['Chromium', chromium],
  ['WebKit (Safari)', webkit],
  ['Firefox', firefox],
];

// Lokal liegen die Browser woanders als in CI; Playwright findet sie über
// PLAYWRIGHT_BROWSERS_PATH selbst, deshalb kein fester executablePath.
async function launch(engine) {
  try {
    return await engine.launch();
  } catch (err) {
    const missing = /Executable doesn't exist|browserType.launch/.test(String(err));
    if (missing) return null;
    throw err;
  }
}

async function serve() {
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(URL);
      if (res.ok) return proc;
    } catch {
      /* noch nicht oben */
    }
    await sleep(500);
  }
  proc.kill();
  throw new Error(`vite preview kam auf Port ${PORT} nicht hoch.`);
}

/** Ein Durchlauf: Sprache anlegen, jeden freigeschalteten Tab öffnen. */
async function run(name, engine) {
  const browser = await launch(engine);
  if (!browser) {
    if (SKIP_MISSING) {
      console.log(`—  ${name}: nicht installiert, übersprungen`);
      return { name, skipped: true, problems: [] };
    }
    return {
      name,
      problems: [`${name} ist nicht installiert. npx playwright install ${name.toLowerCase()}`],
    };
  }

  const problems = [];
  const page = await browser.newPage();
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`));

  try {
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1200);

    // Der Startzustand aus index.html muss verschwunden sein – steht er noch da,
    // hat React nicht gemountet.
    if (await page.locator('#boot').count()) {
      problems.push('React hat nicht gemountet – #boot steht noch im DOM.');
      const text = await page.locator('#boot').innerText();
      problems.push(`#boot zeigt: ${text.replace(/\s+/g, ' ').slice(0, 400)}`);
    }
    if (await page.locator('.crash').count()) {
      problems.push(`ErrorBoundary hat gegriffen: ${await page.locator('.crash pre').innerText()}`);
    }

    // Einrichtungsassistent: Sprache → Niveau → Inhalte → Gewohnheiten.
    await page.getByRole('button', { name: /\+/ }).first().click();
    await page.waitForTimeout(300);
    await page.getByText('🇮🇹 Italienisch').first().click();
    await page.waitForTimeout(600);
    await page.getByRole('button', { name: 'Weiter' }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Weiter' }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /anlegen$/ }).first().click();
    await page.waitForTimeout(1500);

    for (const tab of ['Dashboard', 'Vokabeln', 'Übungen', 'Grammatik']) {
      await page.getByRole('button', { name: new RegExp(`^${tab}`) }).first().click();
      await page.waitForTimeout(700);
      if (await page.locator('.crash').count()) {
        problems.push(`Absturz auf ${tab}: ${await page.locator('.crash pre').innerText()}`);
        break;
      }
    }
  } catch (err) {
    problems.push(`Ablauf abgebrochen: ${err.message}`);
  }

  await browser.close();
  console.log(problems.length ? `✗  ${name}` : `✓  ${name}`);
  for (const p of problems) console.log(`     ${p}`);
  return { name, problems };
}

const server = await serve();
try {
  const results = [];
  for (const [name, engine] of ENGINES) results.push(await run(name, engine));

  const failed = results.filter((r) => r.problems.length);
  const ran = results.filter((r) => !r.skipped && !r.problems.length).length;
  if (failed.length) {
    console.error(`\n✗ Smoke-Test fehlgeschlagen in: ${failed.map((r) => r.name).join(', ')}`);
    process.exitCode = 1;
  } else {
    console.log(`\n✓ Smoke-Test grün in ${ran} Engine(s).`);
  }
} finally {
  server.kill();
}
