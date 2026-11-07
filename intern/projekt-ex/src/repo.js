import { randomUUID } from 'node:crypto';
import { clientKey, hashPassword, normalizeEmail, normalizePhone, sha256 } from './security.js';
import { tx } from './db.js';

const SENT_STATES = ['example_recorded', 'provider_recorded'];
const REVENUE_STATUSES = ['confirmed', 'in_progress', 'completed'];

export const ORDER_LABELS = {
  unconfirmed: 'Unbestätigt',
  confirmed: 'Bestätigt',
  in_progress: 'In Arbeit',
  completed: 'Abgeschlossen',
};

export const CHANNEL_LABELS = {
  email: 'E-Mail',
  phone: 'Telefon',
  whatsapp: 'WhatsApp',
  webchat: 'Website-Chat',
};

export function nowIso() {
  return new Date().toISOString();
}

export function countUsers(db) {
  return db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
}

export async function createUser(db, { email, password, displayName }) {
  const id = randomUUID();
  const passwordHash = await hashPassword(password);
  db.prepare(`INSERT INTO users (id, email, password_hash, display_name, created_at)
    VALUES (?, ?, ?, ?, ?)`).run(id, normalizeEmail(email), passwordHash, displayName.trim(), nowIso());
  return findUserByEmail(db, email);
}

export function findUserByEmail(db, email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(normalizeEmail(email));
}

export function findUserById(db, id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function createSession(db, userId, tokenHash) {
  const created = new Date();
  const expires = new Date(created.getTime() + 12 * 60 * 60 * 1000);
  const absolute = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
  const row = {
    id: randomUUID(),
    user_id: userId,
    token_hash: tokenHash,
    csrf_secret: randomUUID() + randomUUID(),
    created_at: created.toISOString(),
    expires_at: expires.toISOString(),
    absolute_until: absolute.toISOString(),
  };
  db.prepare(`INSERT INTO sessions
    (id, user_id, token_hash, csrf_secret, created_at, expires_at, absolute_until)
    VALUES (@id, @user_id, @token_hash, @csrf_secret, @created_at, @expires_at, @absolute_until)`).run(row);
  return row;
}

export function findSession(db, tokenHash) {
  return db.prepare(`SELECT s.*, u.email, u.display_name
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ?`).get(tokenHash);
}

export function deleteSession(db, id) {
  db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
}

export function touchSession(db, session) {
  const now = Date.now();
  const absolute = Date.parse(session.absolute_until);
  if (now > absolute || now > Date.parse(session.expires_at)) {
    deleteSession(db, session.id);
    return null;
  }
  const next = Math.min(absolute, now + 12 * 60 * 60 * 1000);
  const expiresAt = new Date(next).toISOString();
  db.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?').run(expiresAt, session.id);
  return { ...session, expires_at: expiresAt };
}

export function recordLoginFailure(db, secret, email, ip) {
  const bucket = clientKey(secret, normalizeEmail(email), ip);
  db.prepare('INSERT INTO login_attempts (bucket, attempted_at) VALUES (?, ?)').run(bucket, nowIso());
  db.prepare("DELETE FROM login_attempts WHERE attempted_at < ?").run(new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());
  return bucket;
}

export function tooManyAttempts(db, secret, email, ip) {
  const bucket = clientKey(secret, normalizeEmail(email), ip);
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const row = db.prepare('SELECT COUNT(*) AS n FROM login_attempts WHERE bucket = ? AND attempted_at >= ?').get(bucket, since);
  return row.n >= 8;
}

export function clearAttempts(db, secret, email, ip) {
  const bucket = clientKey(secret, normalizeEmail(email), ip);
  db.prepare('DELETE FROM login_attempts WHERE bucket = ?').run(bucket);
}

export function getDataset(db) {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'active_dataset'").get();
  return row?.value === 'example' ? 'example' : 'real';
}

export function setDataset(db, dataset, userId) {
  if (dataset !== 'example' && dataset !== 'real') throw Object.assign(new Error('Ungültiger Datensatz'), { status: 400 });
  db.prepare(`INSERT INTO settings (key, value) VALUES ('active_dataset', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run(dataset);
  audit(db, userId, 'dataset.switch', dataset);
  return dataset;
}

export function audit(db, userId, action, detail = '') {
  db.prepare('INSERT INTO audit_log (id, user_id, action, detail, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(randomUUID(), userId || null, action, String(detail).slice(0, 500), nowIso());
}

export function recentAudit(db, limit = 20) {
  return db.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?').all(limit);
}

function channelContacts(db, dataset, channel) {
  const row = db.prepare(`SELECT COUNT(*) AS n FROM (
      SELECT contact_id FROM events WHERE dataset = ? AND channel = ? AND contact_id IS NOT NULL
      UNION
      SELECT contact_id FROM contact_identities WHERE dataset = ? AND channel = ?
    )`).get(dataset, channel, dataset, channel);
  return row.n;
}

function topics(db, dataset, channel) {
  return db.prepare(`SELECT topic, COUNT(DISTINCT contact_id) AS contacts
    FROM events
    WHERE dataset = ? AND channel = ? AND topic <> '' AND contact_id IS NOT NULL
    GROUP BY topic
    ORDER BY contacts DESC, topic`).all(dataset, channel);
}

export function dashboardMetrics(db, dataset) {
  const sentRow = db.prepare(`SELECT COUNT(*) AS n FROM email_messages
    WHERE dataset = ? AND recorded_sent_at IS NOT NULL AND state IN (${SENT_STATES.map(() => '?').join(',')})`)
    .get(dataset, ...SENT_STATES);
  const sent = sentRow.n;
  const distinct = (kind) => db.prepare(`SELECT COUNT(DISTINCT e.email_message_id) AS n
    FROM email_engagements e
    JOIN email_messages m ON m.id = e.email_message_id
    WHERE e.dataset = ? AND e.kind = ?
      AND m.recorded_sent_at IS NOT NULL
      AND m.state IN (${SENT_STATES.map(() => '?').join(',')})`)
    .get(dataset, kind, ...SENT_STATES).n;
  const opened = distinct('open');
  const clicked = distinct('click');
  const orderRows = db.prepare(`SELECT status, COUNT(*) AS n, COALESCE(SUM(amount_cents), 0) AS cents
    FROM orders WHERE dataset = ? GROUP BY status`).all(dataset);
  const orders = { unconfirmed: 0, confirmed: 0, in_progress: 0, completed: 0 };
  for (const row of orderRows) orders[row.status] = row.n;
  const revenueCents = db.prepare(`SELECT COALESCE(SUM(amount_cents), 0) AS cents FROM orders
    WHERE dataset = ? AND status IN ('confirmed', 'in_progress', 'completed')`).get(dataset).cents;
  const months = db.prepare(`SELECT substr(ordered_at, 1, 7) AS month, COALESCE(SUM(amount_cents), 0) AS cents
    FROM orders
    WHERE dataset = ? AND status IN ('confirmed', 'in_progress', 'completed')
    GROUP BY month ORDER BY month`).all(dataset).slice(-12);
  return {
    dataset,
    email: {
      sent,
      opened,
      clicked,
      openRate: sent ? opened / sent : 0,
      clickRate: sent ? clicked / sent : 0,
    },
    whatsapp: { contacts: channelContacts(db, dataset, 'whatsapp'), topics: topics(db, dataset, 'whatsapp') },
    phone: { contacts: channelContacts(db, dataset, 'phone'), topics: topics(db, dataset, 'phone') },
    webchat: {
      conversations: db.prepare(`SELECT COUNT(*) AS n FROM conversations WHERE dataset = ? AND channel = 'webchat'`).get(dataset).n,
      leads: db.prepare(`SELECT COUNT(DISTINCT contact_id) AS n FROM events
        WHERE dataset = ? AND channel = 'webchat' AND type = 'lead' AND contact_id IS NOT NULL`).get(dataset).n,
    },
    orders,
    revenueCents,
    months,
  };
}

export function listContacts(db, dataset, { q = '', channel = '', limit = 50, offset = 0 } = {}) {
  const query = `%${q.replace(/[\\%_]/g, '')}%`;
  const rows = db.prepare(`SELECT c.* FROM contacts c
    WHERE c.dataset = ?
      AND (? = '' OR c.display_name LIKE ? OR c.organization LIKE ? OR c.email LIKE ? OR c.phone_e164 LIKE ?)
      AND (? = '' OR EXISTS (
        SELECT 1 FROM contact_identities i WHERE i.contact_id = c.id AND i.channel = ?
      ) OR EXISTS (
        SELECT 1 FROM events e WHERE e.contact_id = c.id AND e.channel = ?
      ))
    ORDER BY c.display_name
    LIMIT ? OFFSET ?`).all(dataset, q, query, query, query, query, channel, channel, channel, limit, offset);
  const total = db.prepare(`SELECT COUNT(*) AS n FROM contacts c
    WHERE c.dataset = ?
      AND (? = '' OR c.display_name LIKE ? OR c.organization LIKE ? OR c.email LIKE ? OR c.phone_e164 LIKE ?)
      AND (? = '' OR EXISTS (
        SELECT 1 FROM contact_identities i WHERE i.contact_id = c.id AND i.channel = ?
      ) OR EXISTS (
        SELECT 1 FROM events e WHERE e.contact_id = c.id AND e.channel = ?
      ))`).get(dataset, q, query, query, query, query, channel, channel, channel).n;
  return { rows, total };
}

export function getContact(db, dataset, id) {
  const contact = db.prepare('SELECT * FROM contacts WHERE dataset = ? AND id = ?').get(dataset, id);
  if (!contact) return null;
  const identities = db.prepare('SELECT * FROM contact_identities WHERE contact_id = ? ORDER BY channel').all(id);
  const events = db.prepare(`SELECT * FROM events WHERE dataset = ? AND contact_id = ?
    ORDER BY occurred_at DESC, id DESC LIMIT 200`).all(dataset, id);
  const appointments = db.prepare(`SELECT * FROM appointments WHERE dataset = ? AND contact_id = ?
    ORDER BY starts_at`).all(dataset, id);
  const orders = db.prepare(`SELECT * FROM orders WHERE dataset = ? AND contact_id = ?
    ORDER BY ordered_at DESC`).all(dataset, id);
  return { contact, identities, events, appointments, orders };
}

export function upsertContact(db, { dataset, displayName, organization = '', email = '', phone = '', channel, externalId }) {
  const emailNorm = normalizeEmail(email);
  const phoneNorm = phone ? normalizePhone(phone) : '';
  if (phone && phoneNorm == null) throw Object.assign(new Error('Telefonnummer muss im internationalen Format mit + beginnen.'), { status: 400 });
  if (emailNorm && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    throw Object.assign(new Error('E-Mail-Adresse ist ungültig.'), { status: 400 });
  }
  let contact = null;
  if (emailNorm) contact = db.prepare('SELECT * FROM contacts WHERE dataset = ? AND email = ?').get(dataset, emailNorm);
  if (!contact && phoneNorm) contact = db.prepare('SELECT * FROM contacts WHERE dataset = ? AND phone_e164 = ?').get(dataset, phoneNorm);
  if (!contact && channel && externalId) {
    const ident = db.prepare('SELECT contact_id FROM contact_identities WHERE dataset = ? AND channel = ? AND external_id = ?')
      .get(dataset, channel, externalId);
    if (ident) contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(ident.contact_id);
  }
  const stamp = nowIso();
  if (!contact) {
    const id = randomUUID();
    db.prepare(`INSERT INTO contacts (id, dataset, display_name, organization, email, phone_e164, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, dataset, displayName.trim().slice(0, 120) || 'Ohne Namen', organization.slice(0, 160),
      emailNorm, phoneNorm || '', stamp, stamp,
    );
    contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
  } else {
    db.prepare(`UPDATE contacts SET
      display_name = CASE WHEN display_name = '' THEN ? ELSE display_name END,
      organization = CASE WHEN organization = '' THEN ? ELSE organization END,
      email = CASE WHEN email = '' THEN ? ELSE email END,
      phone_e164 = CASE WHEN phone_e164 = '' THEN ? ELSE phone_e164 END,
      updated_at = ?
      WHERE id = ?`).run(displayName.trim().slice(0, 120), organization.slice(0, 160), emailNorm, phoneNorm || '', stamp, contact.id);
    contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(contact.id);
  }
  if (channel && externalId) {
    db.prepare(`INSERT OR IGNORE INTO contact_identities (id, dataset, contact_id, channel, external_id)
      VALUES (?, ?, ?, ?, ?)`).run(randomUUID(), dataset, contact.id, channel, String(externalId).slice(0, 200));
  }
  if (emailNorm) {
    db.prepare(`INSERT OR IGNORE INTO contact_identities (id, dataset, contact_id, channel, external_id)
      VALUES (?, ?, ?, 'email', ?)`).run(randomUUID(), dataset, contact.id, emailNorm);
  }
  if (phoneNorm) {
    db.prepare(`INSERT OR IGNORE INTO contact_identities (id, dataset, contact_id, channel, external_id)
      VALUES (?, ?, ?, 'phone', ?)`).run(randomUUID(), dataset, contact.id, phoneNorm);
  }
  return contact;
}

export function addEvent(db, event) {
  const id = event.id || randomUUID();
  db.prepare(`INSERT INTO events
    (id, dataset, contact_id, channel, type, topic, occurred_at, source, idempotency_key, summary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, event.dataset, event.contactId || null, event.channel, event.type, event.topic || '',
    event.occurredAt, event.source, event.idempotencyKey, (event.summary || '').slice(0, 2000), nowIso(),
  );
  return id;
}

export function listEvents(db, dataset, { channel = '', topic = '', limit = 100, offset = 0 } = {}) {
  return db.prepare(`SELECT e.*, c.display_name FROM events e
    LEFT JOIN contacts c ON c.id = e.contact_id
    WHERE e.dataset = ? AND (? = '' OR e.channel = ?) AND (? = '' OR e.topic = ?)
    ORDER BY e.occurred_at DESC LIMIT ? OFFSET ?`).all(dataset, channel, channel, topic, topic, limit, offset);
}

export function listConversations(db, dataset, { channel = '', topic = '', limit = 40, offset = 0 } = {}) {
  const rows = db.prepare(`SELECT v.*, c.display_name FROM conversations v
    LEFT JOIN contacts c ON c.id = v.contact_id
    WHERE v.dataset = ? AND (? = '' OR v.channel = ?) AND (? = '' OR v.topic = ?)
    ORDER BY v.updated_at DESC LIMIT ? OFFSET ?`).all(dataset, channel, channel, topic, topic, limit, offset);
  const total = db.prepare(`SELECT COUNT(*) AS n FROM conversations
    WHERE dataset = ? AND (? = '' OR channel = ?) AND (? = '' OR topic = ?)`).get(dataset, channel, channel, topic, topic).n;
  return { rows, total };
}

export function getConversation(db, dataset, id) {
  const conversation = db.prepare(`SELECT v.*, c.display_name FROM conversations v
    LEFT JOIN contacts c ON c.id = v.contact_id
    WHERE v.dataset = ? AND v.id = ?`).get(dataset, id);
  if (!conversation) return null;
  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at').all(id);
  return { conversation, messages };
}

export function ensureConversation(db, { dataset, contactId, channel, topic, externalId, at }) {
  if (externalId) {
    const existing = db.prepare(`SELECT * FROM conversations WHERE dataset = ? AND channel = ? AND external_id = ?`)
      .get(dataset, channel, externalId);
    if (existing) return existing;
  }
  const id = randomUUID();
  const stamp = at || nowIso();
  db.prepare(`INSERT INTO conversations
    (id, dataset, contact_id, channel, status, topic, external_id, started_at, updated_at)
    VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?)`).run(id, dataset, contactId, channel, topic || '', externalId || '', stamp, stamp);
  return db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
}

export function addMessage(db, { dataset, conversationId, direction, body, deliveryState, at }) {
  const id = randomUUID();
  db.prepare(`INSERT INTO messages (id, dataset, conversation_id, direction, body, delivery_state, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, dataset, conversationId, direction, body.slice(0, 4000), deliveryState, at || nowIso());
  db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').run(at || nowIso(), conversationId);
  return id;
}

export function listOrders(db, dataset) {
  return db.prepare(`SELECT o.*, c.display_name FROM orders o
    JOIN contacts c ON c.id = o.contact_id
    WHERE o.dataset = ? ORDER BY o.ordered_at DESC`).all(dataset);
}

export function createOrder(db, { dataset, contactId, title, status, amountCents, orderedAt }) {
  const id = randomUUID();
  db.prepare(`INSERT INTO orders (id, dataset, contact_id, title, status, amount_cents, currency, ordered_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'EUR', ?, ?)`).run(id, dataset, contactId, title.slice(0, 160), status, amountCents, orderedAt, nowIso());
  return id;
}

export function createAppointment(db, { dataset, contactId, title, startsAt, endsAt, channel, notes }) {
  const id = randomUUID();
  db.prepare(`INSERT INTO appointments
    (id, dataset, contact_id, title, starts_at, ends_at, status, channel, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'requested', ?, ?, ?)`).run(
    id, dataset, contactId, title.slice(0, 160), startsAt, endsAt, channel, (notes || '').slice(0, 1000), nowIso(),
  );
  addEvent(db, {
    dataset, contactId, channel, type: 'appointment.requested', topic: title.slice(0, 80),
    occurredAt: startsAt, source: 'manual', idempotencyKey: `appt-${id}`, summary: notes || title,
  });
  return id;
}

export function listCms(db, dataset, kind = '') {
  return db.prepare(`SELECT * FROM cms_documents WHERE dataset = ? AND (? = '' OR kind = ?)
    ORDER BY kind, title`).all(dataset, kind, kind);
}

export function getCms(db, dataset, id) {
  return db.prepare('SELECT * FROM cms_documents WHERE dataset = ? AND id = ?').get(dataset, id);
}

export function saveCms(db, { id, dataset, kind, slug, title, summary, body, priceCents, userId }) {
  if (kind !== 'page' && kind !== 'offer' && kind !== 'shop') {
    throw Object.assign(new Error('Art ist ungültig.'), { status: 400 });
  }
  const stamp = nowIso();
  if (!id) {
    const newId = randomUUID();
    db.prepare(`INSERT INTO cms_documents
      (id, dataset, kind, slug, title, summary, body, price_cents, status, updated_at, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`).run(
      newId, dataset, kind, slug, title, summary, body, priceCents, stamp, userId,
    );
    audit(db, userId, 'cms.create', `${kind}:${slug}`);
    return newId;
  }
  const current = getCms(db, dataset, id);
  if (!current) throw Object.assign(new Error('Entwurf nicht gefunden.'), { status: 404 });
  db.prepare(`UPDATE cms_documents SET kind = ?, slug = ?, title = ?, summary = ?, body = ?, price_cents = ?,
    status = 'draft', updated_at = ?, updated_by = ? WHERE id = ? AND dataset = ?`).run(
    kind, slug, title, summary, body, priceCents, stamp, userId, id, dataset,
  );
  audit(db, userId, 'cms.save', id);
  return id;
}

export function listApprovals(db, dataset) {
  return db.prepare(`SELECT a.*, c.display_name FROM approvals a
    LEFT JOIN contacts c ON c.id = a.contact_id
    WHERE a.dataset = ? ORDER BY a.created_at DESC`).all(dataset);
}

export function createOutboundDraft(db, { dataset, channel, contactId, body, userId, subject = '' }) {
  const stamp = nowIso();
  let subjectType;
  let subjectId;
  if (channel === 'email') {
    subjectId = randomUUID();
    db.prepare(`INSERT INTO email_messages
      (id, dataset, contact_id, subject, body, state, origin, recorded_sent_at, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending_approval', 'draft', NULL, ?)`).run(
      subjectId, dataset, contactId, subject.slice(0, 200) || 'Entwurf', body.slice(0, 8000), stamp,
    );
    subjectType = 'email_message';
  } else {
    const conversation = ensureConversation(db, {
      dataset, contactId, channel, topic: '', externalId: '', at: stamp,
    });
    subjectId = addMessage(db, {
      dataset, conversationId: conversation.id, direction: 'out', body, deliveryState: 'pending_approval', at: stamp,
    });
    subjectType = 'message';
  }
  const approvalId = randomUUID();
  db.prepare(`INSERT INTO approvals
    (id, dataset, channel, contact_id, subject_type, subject_id, status, body, requested_by, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, '', ?)`).run(
    approvalId, dataset, channel, contactId, subjectType, subjectId, body.slice(0, 8000), userId, stamp,
  );
  audit(db, userId, 'approval.request', approvalId);
  return approvalId;
}

/**
 * Freigabe speichert nur eine Entscheidung. Es gibt absichtlich keinen Versandweg.
 */
export function decideApproval(db, { dataset, id, userId, decision, note = '' }) {
  const approval = db.prepare('SELECT * FROM approvals WHERE dataset = ? AND id = ?').get(dataset, id);
  if (!approval) throw Object.assign(new Error('Freigabe nicht gefunden.'), { status: 404 });
  if (approval.status !== 'pending') throw Object.assign(new Error('Diese Freigabe ist bereits entschieden.'), { status: 409 });
  if (decision !== 'approve' && decision !== 'reject') throw Object.assign(new Error('Entscheidung ist ungültig.'), { status: 400 });
  const status = decision === 'approve' ? 'approved_not_dispatched' : 'rejected';
  const stamp = nowIso();
  db.prepare(`UPDATE approvals SET status = ?, decided_by = ?, decided_at = ?, note = ? WHERE id = ?`)
    .run(status, userId, stamp, note.slice(0, 500), id);
  if (approval.subject_type === 'email_message') {
    db.prepare(`UPDATE email_messages SET state = ?, recorded_sent_at = NULL WHERE id = ?`).run(status, approval.subject_id);
  } else if (approval.subject_type === 'message') {
    db.prepare(`UPDATE messages SET delivery_state = ? WHERE id = ?`).run(status, approval.subject_id);
  }
  audit(db, userId, decision === 'approve' ? 'approval.approved_not_dispatched' : 'approval.rejected', id);
  return db.prepare('SELECT * FROM approvals WHERE id = ?').get(id);
}

export function providerReceipt(db, provider, key) {
  return db.prepare('SELECT * FROM webhook_receipts WHERE provider = ? AND idempotency_key = ?').get(provider, key);
}

export function saveReceipt(db, { provider, key, raw, accepted, reason = '' }) {
  db.prepare(`INSERT INTO webhook_receipts
    (id, provider, idempotency_key, payload_sha256, accepted, reason, received_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    randomUUID(), provider, key, sha256(raw), accepted ? 1 : 0, reason.slice(0, 300), nowIso(),
  );
}

export function recentReceipts(db, limit = 30) {
  return db.prepare(`SELECT provider, idempotency_key, accepted, reason, received_at
    FROM webhook_receipts ORDER BY received_at DESC LIMIT ?`).all(limit);
}

export function contactsForSelect(db, dataset) {
  return db.prepare('SELECT id, display_name, email FROM contacts WHERE dataset = ? ORDER BY display_name LIMIT 500').all(dataset);
}

export function txRun(db, fn) {
  return tx(db, fn);
}

export { REVENUE_STATUSES };
