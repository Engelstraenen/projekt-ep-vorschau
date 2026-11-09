import assert from 'node:assert/strict';
import test from 'node:test';
import { signBody, signMeta } from '../src/security.js';
import { dashboardMetrics } from '../src/repo.js';
import { boot, setupAdmin } from './helpers.js';

const SECRET = 'telephone-test-secret-value-32b';

function stamp() {
  return String(Math.floor(Date.now() / 1000));
}

async function postHook(base, pathname, { secret, body, key, signature, timestamp, header = 'x-projekt-ex-signature' }) {
  const raw = Buffer.from(JSON.stringify(body));
  const ts = timestamp ?? stamp();
  const sig = signature ?? (header === 'x-hub-signature-256' ? signMeta(secret, raw) : signBody(secret, ts, raw));
  const headers = {
    'content-type': 'application/json',
    'idempotency-key': key,
    [header]: sig,
  };
  if (header !== 'x-hub-signature-256') headers['x-projekt-ex-timestamp'] = ts;
  const response = await fetch(base + pathname, { method: 'POST', headers, body: raw });
  return { response, json: await response.json() };
}

test('Telefon-Webhook prüft Signatur, Idempotenz und schreibt nur in den Echtbetrieb', async (t) => {
  const ctx = await boot(t, { telephone: SECRET });
  const body = {
    id: 'call-1',
    occurred_at: new Date().toISOString(),
    contact: { name: 'Beispielanruf', phone: '+490000009999' },
    topic: 'Angebot',
    text: 'Testnotiz ohne echte Person',
  };
  const missing = await fetch(ctx.base + '/api/hooks/telephone', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  assert.equal(missing.status, 401);

  const first = await postHook(ctx.base, '/api/hooks/telephone', { secret: SECRET, body, key: 'call-1' });
  assert.equal(first.response.status, 202);
  assert.equal(first.json.duplicate, false);

  const second = await postHook(ctx.base, '/api/hooks/telephone', { secret: SECRET, body, key: 'call-1' });
  assert.equal(second.response.status, 200);
  assert.equal(second.json.duplicate, true);

  const calls = ctx.db.prepare(`SELECT COUNT(*) AS n FROM events WHERE dataset = 'real' AND source = 'telephone'`).get().n;
  assert.equal(calls, 1);
  assert.equal(dashboardMetrics(ctx.db, 'example').phone.contacts, 0);
  assert.equal(dashboardMetrics(ctx.db, 'real').phone.contacts, 1);
});

test('ohne Geheimnis bleibt der Webhook abgelehnt', async (t) => {
  const ctx = await boot(t);
  const body = { id: 'x', occurred_at: new Date().toISOString(), contact: { phone: '+490000009998' }, text: 'x' };
  const raw = Buffer.from(JSON.stringify(body));
  const response = await fetch(ctx.base + '/api/hooks/email', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'idempotency-key': 'mail-1',
      'x-projekt-ex-timestamp': stamp(),
      'x-projekt-ex-signature': signBody('irgendwas-aber-nicht-gesetzt-32', stamp(), raw),
    },
    body: raw,
  });
  const json = await response.json();
  assert.equal(response.status, 503);
  assert.equal(json.code, 'provider_not_configured');
});

test('Meta-Signatur und Verify-Token verbinden den Kanal nicht', async (t) => {
  const ctx = await boot(t, { meta: 'meta-app-secret-for-tests-32xx', metaVerify: 'verify-token-test' });
  const challenge = await fetch(`${ctx.base}/api/hooks/meta/whatsapp?hub.mode=subscribe&hub.verify_token=verify-token-test&hub.challenge=challenge123`);
  assert.equal(challenge.status, 200);
  assert.equal(await challenge.text(), 'challenge123');
  const wrong = await fetch(`${ctx.base}/api/hooks/meta/whatsapp?hub.mode=subscribe&hub.verify_token=falsch&hub.challenge=challenge123`);
  assert.equal(wrong.status, 403);

  const payload = {
    entry: [{ changes: [{ value: { messages: [{
      id: 'wamid.TEST',
      from: '490000001111',
      timestamp: String(Math.floor(Date.now() / 1000)),
      type: 'text',
      text: { body: 'Testnachricht' },
    }] } }] }],
  };
  const accepted = await postHook(ctx.base, '/api/hooks/meta/whatsapp', {
    secret: 'meta-app-secret-for-tests-32xx',
    body: payload,
    key: 'wamid.TEST',
    header: 'x-hub-signature-256',
  });
  assert.equal(accepted.response.status, 202);
  await setupAdmin(ctx);
  const status = await fetch(ctx.base + '/api/verbindungen', { headers: { cookie: ctx.cookies.header() } });
  const json = await status.json();
  assert.equal(json.providers.every((provider) => provider.state === 'disconnected'), true);
  assert.equal(json.providers.find((provider) => provider.id === 'meta_whatsapp').badge, 'Konfiguriert, nicht verbunden');
});
