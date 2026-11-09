import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { devSecret } from '../src/config.js';
import { openDatabase } from '../src/db.js';
import { seedExample } from '../src/fixtures.js';
import { createApp } from '../src/server.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = '/opt/cursor/artifacts/projekt-ex';
const password = 'ein-langes-passwort';

const dir = mkdtempSync(path.join(tmpdir(), 'px-shot-'));
const config = {
  root,
  nodeEnv: 'test',
  host: '127.0.0.1',
  port: 0,
  databasePath: path.join(dir, 't.sqlite'),
  sessionSecret: devSecret(),
  secureCookies: false,
  secrets: { telephone: '', meta: '', metaVerify: '', email: '', webchat: '' },
};
const db = openDatabase(config.databasePath);
seedExample(db);
const app = createApp({ db, config });
await new Promise((resolve) => app.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${app.address().port}`;

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });

async function shot(name) {
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, `${name}.png`) });
  console.log(name);
}

await page.goto(`${base}/setup`, { waitUntil: 'networkidle' });
await shot('01-einrichtung');
await page.fill('#name', 'Verwaltung');
await page.fill('#email', 'verwaltung@example.invalid');
await page.fill('#password', password);
await page.fill('#password2', password);
await Promise.all([
  page.waitForURL((url) => url.pathname === '/'),
  page.click('button[type=submit]'),
]);
await shot('02-dashboard-beispiel');

await page.setViewportSize({ width: 390, height: 844 });
await shot('03-dashboard-mobil');
await page.setViewportSize({ width: 1440, height: 960 });

await page.goto(`${base}/bots/verbindungen`, { waitUntil: 'networkidle' });
await shot('04-verbindungen');
await page.goto(`${base}/kunden/ex-c-0001`, { waitUntil: 'networkidle' });
await shot('05-kunde');
await page.goto(`${base}/inhalte/ex-cms-1`, { waitUntil: 'networkidle' });
await shot('06-entwurf');
await page.goto(`${base}/vorschau/ex-cms-1`, { waitUntil: 'networkidle' });
await shot('07-vorschau');
await page.goto(`${base}/freigaben`, { waitUntil: 'networkidle' });
await shot('08-freigaben');

await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.click('button[commandfor="modus"]');
await page.locator('#modus button[type=submit]').click();
await page.waitForURL(/hinweis=modus/);
await shot('09-dashboard-echtbetrieb');

await page.context().clearCookies();
await page.goto(`${base}/anmelden`, { waitUntil: 'networkidle' });
await shot('10-anmelden');

await browser.close();
await new Promise((resolve) => app.close(resolve));
db.close();
