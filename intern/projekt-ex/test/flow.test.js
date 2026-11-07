import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { seedExample } from '../src/fixtures.js';
import { boot, csrfFrom, get, post, setupAdmin } from './helpers.js';

test('Freigabe versendet nicht', async (t) => {
  const source = readFileSync(fileURLToPath(new URL('../src/repo.js', import.meta.url)), 'utf8');
  const start = source.indexOf('export function decideApproval');
  const end = source.indexOf('export function providerReceipt');
  const fn = source.slice(start, end);
  assert.equal(fn.includes('fetch('), false);
  assert.equal(fn.includes('http.request'), false);

  const ctx = await boot(t);
  seedExample(ctx.db);
  await setupAdmin(ctx);
  const page = await get(ctx.base, '/freigaben', ctx.cookies);
  const html = await page.text();
  assert.match(html, /ENTWURF/);
  assert.match(html, /Freigeben, nicht senden/);
  const response = await post(ctx.base, '/freigaben/ex-approval-1', { csrf: csrfFrom(html), entscheidung: 'approve' }, ctx.cookies);
  assert.equal(response.status, 303);
  const row = ctx.db.prepare(`SELECT status FROM approvals WHERE id = 'ex-approval-1'`).get();
  const mail = ctx.db.prepare(`SELECT state, recorded_sent_at FROM email_messages WHERE id = 'ex-draft-mail-1'`).get();
  assert.equal(row.status, 'approved_not_dispatched');
  assert.equal(mail.state, 'approved_not_dispatched');
  assert.equal(mail.recorded_sent_at, null);
  const home = await get(ctx.base, '/', ctx.cookies);
  const dash = await home.text();
  assert.match(dash, /48\.600/);
  assert.match(dash, /41 %/);
  assert.match(dash, /6,2 %/);
  assert.match(dash, /WhatsApp/);
  assert.match(dash, /186/);
});

test('Inhalte bleiben Entwürfe und der Echtbetrieb mischt sich nicht in die Beispielzahlen', async (t) => {
  const ctx = await boot(t);
  seedExample(ctx.db);
  await setupAdmin(ctx);
  const editor = await get(ctx.base, '/inhalte/ex-cms-1', ctx.cookies);
  const html = await editor.text();
  assert.match(html, /Entwurf/);
  assert.doesNotMatch(html, /name="status"/);
  const saved = await post(ctx.base, '/inhalte/ex-cms-1', {
    csrf: csrfFrom(html),
    art: 'page',
    titel: 'Geänderter Entwurf',
    slug: 'start',
    kurz: 'Intern',
    text: 'Nur Vorschau.\n\nZweiter Absatz.',
    status: 'published',
  }, ctx.cookies);
  assert.equal(saved.status, 400);
  const doc = ctx.db.prepare(`SELECT status, title FROM cms_documents WHERE id = 'ex-cms-1'`).get();
  assert.equal(doc.status, 'draft');
  assert.notEqual(doc.title, 'Geänderter Entwurf');

  const preview = await get(ctx.base, '/vorschau/ex-cms-1', ctx.cookies);
  const previewHtml = await preview.text();
  assert.match(previewHtml, /nicht veröffentlicht/);

  const modePage = await get(ctx.base, '/', ctx.cookies);
  const switched = await post(ctx.base, '/modus', { csrf: csrfFrom(await modePage.text()), dataset: 'real' }, ctx.cookies);
  assert.equal(switched.status, 303);
  const real = await get(ctx.base, '/', ctx.cookies);
  const realHtml = await real.text();
  assert.match(realHtml, /ECHTBETRIEB/);
  assert.doesNotMatch(realHtml, /48\.600/);
  assert.match(realHtml, /0 €/);
});

test('öffentliche Auslieferung schließt das interne Verzeichnis aus', () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url));
  const config = readFileSync(new URL('../../../_config.yml', import.meta.url), 'utf8');
  const build = readFileSync(new URL('../../../tools/launch_build.py', import.meta.url), 'utf8');
  assert.match(config, /\n\s*- intern\b/);
  assert.match(build, /'intern\/'/);
  assert.equal(root.endsWith('/'), true);
});
