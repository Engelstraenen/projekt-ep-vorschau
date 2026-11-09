import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { devSecret } from '../src/config.js';
import { openDatabase } from '../src/db.js';
import { createApp } from '../src/server.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function boot(t, secrets = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'px-'));
  const config = {
    root,
    nodeEnv: 'test',
    host: '127.0.0.1',
    port: 0,
    databasePath: path.join(dir, 't.sqlite'),
    sessionSecret: devSecret(),
    secureCookies: false,
    secrets: {
      telephone: secrets.telephone || '',
      meta: secrets.meta || '',
      metaVerify: secrets.metaVerify || '',
      email: secrets.email || '',
      webchat: secrets.webchat || '',
    },
  };
  const db = openDatabase(config.databasePath);
  const app = createApp({ db, config });
  await new Promise((resolve) => app.listen(0, '127.0.0.1', resolve));
  const { port } = app.address();
  t.after(() => new Promise((resolve) => app.close(() => { db.close(); resolve(); })));
  return { base: `http://127.0.0.1:${port}`, db, config, cookies: jar() };
}

export function jar() {
  const cookies = new Map();
  return {
    store(response) {
      const list = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
      for (const line of list) {
        const [pair] = line.split(';');
        const eq = pair.indexOf('=');
        const name = pair.slice(0, eq).trim();
        if (line.includes('Max-Age=0')) cookies.delete(name);
        else cookies.set(name, decodeURIComponent(pair.slice(eq + 1)));
      }
    },
    header() {
      return [...cookies].map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('; ');
    },
  };
}

export async function get(base, pathname, cookies) {
  const response = await fetch(base + pathname, { headers: { cookie: cookies?.header() || '' }, redirect: 'manual' });
  cookies?.store(response);
  return response;
}

export async function post(base, pathname, fields, cookies) {
  const response = await fetch(base + pathname, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie: cookies?.header() || '',
    },
    body: new URLSearchParams(fields),
    redirect: 'manual',
  });
  cookies?.store(response);
  return response;
}

export function csrfFrom(html) {
  const match = /name="csrf" value="([^"]+)"/.exec(html);
  if (!match) throw new Error('CSRF-Feld fehlt');
  return match[1];
}

export async function setupAdmin(ctx, password = 'ein-langes-passwort') {
  const page = await get(ctx.base, '/setup', ctx.cookies);
  const html = await page.text();
  const response = await post(ctx.base, '/setup', {
    csrf: csrfFrom(html),
    name: 'Verwaltung',
    email: 'verwaltung@example.invalid',
    password,
    password2: password,
  }, ctx.cookies);
  return response;
}
