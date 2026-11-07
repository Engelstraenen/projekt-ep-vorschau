import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { openDatabase } from '../src/db.js';
import { EXAMPLE_TARGETS, seedExample } from '../src/fixtures.js';
import { formatClickRate, formatEuro, formatOpenRate } from '../src/format.js';
import { dashboardMetrics, getDataset, setDataset } from '../src/repo.js';

function database() {
  const dir = mkdtempSync(path.join(tmpdir(), 'px-metrics-'));
  return openDatabase(path.join(dir, 't.sqlite'));
}

test('Beispieldatensatz trifft die freigegebene Dashboard-Rechnung', () => {
  const db = database();
  seedExample(db);
  assert.equal(getDataset(db), 'example');
  const metrics = dashboardMetrics(db, 'example');
  assert.equal(metrics.email.sent, EXAMPLE_TARGETS.emailsSent);
  assert.equal(metrics.email.opened, EXAMPLE_TARGETS.emailsOpened);
  assert.equal(metrics.email.clicked, EXAMPLE_TARGETS.emailsClicked);
  assert.equal(formatOpenRate(metrics.email.openRate), '41 %');
  assert.equal(formatClickRate(metrics.email.clickRate), '6,2 %');
  assert.equal(metrics.whatsapp.contacts, 186);
  assert.equal(metrics.phone.contacts, 92);
  assert.deepEqual(Object.fromEntries(metrics.whatsapp.topics.map((topic) => [topic.topic, topic.contacts])), EXAMPLE_TARGETS.topics.whatsapp);
  assert.deepEqual(Object.fromEntries(metrics.phone.topics.map((topic) => [topic.topic, topic.contacts])), EXAMPLE_TARGETS.topics.phone);
  assert.equal(metrics.webchat.conversations, 134);
  assert.equal(metrics.webchat.leads, 27);
  assert.deepEqual(metrics.orders, EXAMPLE_TARGETS.orders);
  assert.equal(metrics.revenueCents, 4_860_000);
  assert.equal(formatEuro(metrics.revenueCents), '48.600 €');
  assert.equal(metrics.months.length, 7);
  const sentEvents = db.prepare(`SELECT COUNT(*) AS n FROM events WHERE dataset = 'example' AND type = 'email.sent'`).get().n;
  assert.equal(sentEvents, metrics.email.sent);
  const topicEvents = db.prepare(`SELECT COUNT(*) AS n FROM events WHERE dataset = 'example' AND channel = 'whatsapp' AND topic = 'Terminwunsch'`).get().n;
  assert.equal(topicEvents, 64);
  db.close();
});

test('Echtbetrieb bleibt leer, während der Beispieldatensatz existiert', () => {
  const db = database();
  seedExample(db);
  setDataset(db, 'real', null);
  const real = dashboardMetrics(db, 'real');
  assert.equal(real.email.sent, 0);
  assert.equal(real.revenueCents, 0);
  assert.equal(real.whatsapp.contacts, 0);
  assert.equal(real.webchat.leads, 0);
  assert.equal(dashboardMetrics(db, 'example').email.sent, 420);
  db.close();
});

test('Umsatz lässt unbestätigte Aufträge weg', () => {
  const db = database();
  seedExample(db);
  const included = db.prepare(`SELECT COALESCE(SUM(amount_cents), 0) AS cents FROM orders
    WHERE dataset = 'example' AND status = 'unconfirmed'`).get().cents;
  assert.equal(included, 5 * 15000);
  assert.equal(dashboardMetrics(db, 'example').revenueCents, 4_860_000);
  db.close();
});
