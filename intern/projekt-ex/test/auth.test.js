import assert from 'node:assert/strict';
import test from 'node:test';
import { loadConfig } from '../src/config.js';
import { boot, csrfFrom, get, post, setupAdmin } from './helpers.js';

test('schwaches Sitzungsgeheimnis wird abgelehnt', () => {
  assert.throws(() => loadConfig({ SESSION_SECRET: 'change-me-change-me-change-me-change-me' }));
  assert.throws(() => loadConfig({ SESSION_SECRET: 'kurz' }));
  assert.throws(() => loadConfig({ NODE_ENV: 'production', SESSION_SECRET: 'a'.repeat(40) }));
});

test('Einrichtung, Anmeldung und geschützte Seiten', async (t) => {
  const ctx = await boot(t);
  const open = await get(ctx.base, '/', ctx.cookies);
  assert.equal(open.status, 303);
  assert.equal(open.headers.get('location'), '/anmelden?next=%2F');

  const created = await setupAdmin(ctx);
  assert.equal(created.status, 303);
  assert.equal(created.headers.get('location'), '/');

  const again = await get(ctx.base, '/setup', ctx.cookies);
  assert.equal(again.status, 303);

  const home = await get(ctx.base, '/', ctx.cookies);
  const html = await home.text();
  assert.equal(home.status, 200);
  assert.match(html, /ECHTBETRIEB/);
  assert.match(html, /Engelstränen UG/);
  assert.doesNotMatch(html, /48\.600/);

  const logoutPage = html;
  const bye = await post(ctx.base, '/abmelden', { csrf: csrfFrom(logoutPage) }, ctx.cookies);
  assert.equal(bye.status, 303);

  const loginPage = await get(ctx.base, '/anmelden', ctx.cookies);
  const loginHtml = await loginPage.text();
  const bad = await post(ctx.base, '/anmelden', {
    csrf: csrfFrom(loginHtml), email: 'verwaltung@example.invalid', password: 'falsches-passwort-123', next: '/',
  }, ctx.cookies);
  assert.equal(bad.status, 401);

  const loginAgain = await get(ctx.base, '/anmelden', ctx.cookies);
  const good = await post(ctx.base, '/anmelden', {
    csrf: csrfFrom(await loginAgain.text()), email: 'verwaltung@example.invalid', password: 'ein-langes-passwort', next: '/kunden',
  }, ctx.cookies);
  assert.equal(good.status, 303);
  assert.equal(good.headers.get('location'), '/kunden');

  const forged = await post(ctx.base, '/modus', { csrf: 'nein', dataset: 'example' }, ctx.cookies);
  assert.equal(forged.status, 403);
});

test('fremde Herkunft wird abgelehnt', async (t) => {
  const ctx = await boot(t);
  const page = await get(ctx.base, '/setup', ctx.cookies);
  const response = await fetch(`${ctx.base}/setup`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie: ctx.cookies.header(),
      origin: 'https://example.com',
      'sec-fetch-site': 'cross-site',
    },
    body: new URLSearchParams({
      csrf: csrfFrom(await page.text()),
      name: 'Verwaltung',
      email: 'verwaltung@example.invalid',
      password: 'ein-langes-passwort',
      password2: 'ein-langes-passwort',
    }),
  });
  assert.equal(response.status, 403);
});

test('zu kurzes Passwort richtet niemanden ein', async (t) => {
  const ctx = await boot(t);
  const page = await get(ctx.base, '/setup', ctx.cookies);
  const response = await post(ctx.base, '/setup', {
    csrf: csrfFrom(await page.text()),
    name: 'Verwaltung',
    email: 'verwaltung@example.invalid',
    password: 'kurz',
    password2: 'kurz',
  }, ctx.cookies);
  assert.equal(response.status, 400);
  const later = await get(ctx.base, '/setup', ctx.cookies);
  assert.equal(later.status, 200);
});
