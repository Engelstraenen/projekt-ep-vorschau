import { createHash } from 'node:crypto';
import { signBody, signMeta, verifySignature } from './security.js';
import {
  addEvent, addMessage, ensureConversation, providerReceipt, saveReceipt, txRun, upsertContact,
} from './repo.js';

const KEY_RE = /^[\w.:-]{1,200}$/;
const TOPIC_RE = /^[\p{L}\p{N} .,_-]{0,80}$/u;

export function httpError(status, message, code) {
  const error = new Error(message);
  error.status = status;
  error.code = code || 'error';
  return error;
}

function requireConfigured(secret, provider) {
  if (!secret) throw httpError(503, 'Anbieter ist nicht konfiguriert.', 'provider_not_configured');
}

function freshTimestamp(value) {
  const ts = Number(value);
  if (!Number.isFinite(ts)) throw httpError(401, 'Zeitstempel fehlt.', 'bad_signature');
  const skew = Math.abs(Date.now() - ts * 1000);
  if (skew > 5 * 60 * 1000) throw httpError(401, 'Zeitstempel liegt außerhalb des zulässigen Fensters.', 'bad_signature');
  return ts;
}

function assertSignature(expected, actual) {
  if (!verifySignature(expected, actual)) throw httpError(401, 'Signatur ist ungültig.', 'bad_signature');
}

function idempotency(header, fallback) {
  const key = (typeof header === 'string' && header.trim()) ? header.trim() : String(fallback || '');
  if (!KEY_RE.test(key)) throw httpError(400, 'Idempotenzschlüssel fehlt oder ist ungültig.', 'bad_idempotency');
  return key;
}

function recentIso(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw httpError(400, 'Zeitpunkt ist ungültig.', 'bad_payload');
  const skew = date.getTime() - Date.now();
  if (skew > 5 * 60 * 1000 || skew < -7 * 24 * 60 * 60 * 1000) {
    throw httpError(400, 'Ereignis liegt außerhalb von sieben Tagen.', 'bad_payload');
  }
  return date.toISOString();
}

function cleanTopic(value) {
  const topic = String(value || '').trim().slice(0, 80);
  if (!TOPIC_RE.test(topic)) throw httpError(400, 'Thema enthält ungültige Zeichen.', 'bad_payload');
  return topic;
}

function text(value, max = 4000) {
  return String(value || '').replace(/\0/g, '').slice(0, max);
}

function begin(db, provider, key, raw) {
  const existing = providerReceipt(db, provider, key);
  if (existing) return { duplicate: true, accepted: existing.accepted === 1 };
  return { duplicate: false, hash: createHash('sha256').update(raw).digest('hex') };
}

export function ingestSigned(db, { provider, secret, raw, timestamp, signature, headerKey, apply }) {
  requireConfigured(secret, provider);
  freshTimestamp(timestamp);
  assertSignature(signBody(secret, timestamp, raw), signature);
  const body = peek(raw);
  const key = idempotency(headerKey, body.id);
  const gate = begin(db, provider, key, raw);
  if (gate.duplicate) return { duplicate: true, accepted: gate.accepted };
  try {
    const result = txRun(db, () => {
      const applied = apply(body, key);
      saveReceipt(db, { provider, key, raw, accepted: true });
      return applied;
    });
    return { duplicate: false, accepted: true, ...result };
  } catch (error) {
    if (String(error.message || '').includes('UNIQUE')) return { duplicate: true, accepted: true };
    throw error;
  }
}

export function ingestTelephone(db, config, req, raw) {
  return ingestSigned(db, {
    provider: 'telephone',
    secret: config.secrets.telephone,
    raw,
    timestamp: req.headers['x-projekt-ex-timestamp'],
    signature: req.headers['x-projekt-ex-signature'],
    headerKey: req.headers['idempotency-key'],
    apply: (body, key) => {
      const contact = body.contact || {};
      const occurredAt = recentIso(body.occurred_at);
      const topic = cleanTopic(body.topic);
      const person = upsertContact(db, {
        dataset: 'real',
        displayName: text(contact.name, 120) || 'Anrufer ohne Namen',
        phone: contact.phone || '',
        email: contact.email || '',
        channel: 'phone',
        externalId: contact.external_id || contact.phone || key,
      });
      addEvent(db, {
        dataset: 'real', contactId: person.id, channel: 'phone', type: 'phone.call', topic,
        occurredAt, source: 'telephone', idempotencyKey: key, summary: text(body.text, 2000),
      });
      const conversation = ensureConversation(db, {
        dataset: 'real', contactId: person.id, channel: 'phone', topic,
        externalId: String(body.id || key), at: occurredAt,
      });
      if (body.text) {
        addMessage(db, {
          dataset: 'real', conversationId: conversation.id, direction: 'in',
          body: text(body.text), deliveryState: 'recorded', at: occurredAt,
        });
      }
      return { contactId: person.id };
    },
  });
}

export function ingestEmail(db, config, req, raw) {
  return ingestSigned(db, {
    provider: 'email',
    secret: config.secrets.email,
    raw,
    timestamp: req.headers['x-projekt-ex-timestamp'],
    signature: req.headers['x-projekt-ex-signature'],
    headerKey: req.headers['idempotency-key'],
    apply: (body, key) => applyEmail(db, body, key),
  });
}

function applyEmail(db, body, key) {
  const kind = body.kind;
  if (!['sent', 'open', 'click', 'inbound'].includes(kind)) throw httpError(400, 'Art des E-Mail-Ereignisses ist ungültig.', 'bad_payload');
  const occurredAt = recentIso(body.occurred_at);
  const contact = body.contact || {};
  const person = upsertContact(db, {
    dataset: 'real',
    displayName: text(contact.name, 120) || contact.email || 'E-Mail ohne Namen',
    email: contact.email || '',
    phone: contact.phone || '',
    channel: 'email',
    externalId: contact.email || contact.external_id || key,
  });
  const messageId = String(body.message_id || body.id || key).slice(0, 200);
  if (kind === 'sent' || kind === 'inbound') {
    const existing = dbMessage(db, messageId);
    if (!existing) {
      db.prepare(`INSERT INTO email_messages
        (id, dataset, contact_id, subject, body, state, origin, recorded_sent_at, created_at)
        VALUES (?, 'real', ?, ?, ?, ?, 'provider', ?, ?)`).run(
        messageId, person.id, text(body.subject, 200) || 'Ohne Betreff', text(body.text),
        kind === 'sent' ? 'provider_recorded' : 'provider_recorded',
        kind === 'sent' ? occurredAt : null,
        occurredAt,
      );
    }
    addEvent(db, {
      dataset: 'real', contactId: person.id, channel: 'email',
      type: kind === 'sent' ? 'email.sent' : 'email.inbound',
      topic: cleanTopic(body.topic), occurredAt, source: 'email', idempotencyKey: key, summary: text(body.subject, 200),
    });
    return { contactId: person.id, messageId };
  }
  let message = dbMessage(db, messageId);
  if (!message) {
    db.prepare(`INSERT INTO email_messages
      (id, dataset, contact_id, subject, body, state, origin, recorded_sent_at, created_at)
      VALUES (?, 'real', ?, ?, '', 'provider_recorded', 'provider', ?, ?)`).run(
      messageId, person.id, text(body.subject, 200) || 'Ohne Betreff', occurredAt, occurredAt,
    );
    message = dbMessage(db, messageId);
  }
  db.prepare(`INSERT INTO email_engagements
    (id, dataset, email_message_id, kind, occurred_at, url, source, idempotency_key)
    VALUES (lower(hex(randomblob(16))), 'real', ?, ?, ?, ?, 'email', ?)`).run(
    message.id, kind, occurredAt, text(body.url, 500), key,
  );
  addEvent(db, {
    dataset: 'real', contactId: person.id, channel: 'email',
    type: kind === 'open' ? 'email.opened' : 'email.clicked',
    topic: '', occurredAt, source: 'email', idempotencyKey: key, summary: text(body.url, 200),
  });
  return { contactId: person.id, messageId: message.id };
}

function dbMessage(db, id) {
  return db.prepare('SELECT * FROM email_messages WHERE id = ?').get(id);
}

export function ingestWebchat(db, config, req, raw) {
  return ingestSigned(db, {
    provider: 'webchat',
    secret: config.secrets.webchat,
    raw,
    timestamp: req.headers['x-projekt-ex-timestamp'],
    signature: req.headers['x-projekt-ex-signature'],
    headerKey: req.headers['idempotency-key'],
    apply: (body, key) => {
      const contact = body.contact || {};
      const occurredAt = recentIso(body.occurred_at);
      const topic = cleanTopic(body.topic);
      const externalId = String(contact.external_id || key);
      const person = upsertContact(db, {
        dataset: 'real',
        displayName: text(contact.name, 120) || 'Website-Besuch',
        email: contact.email || '',
        phone: contact.phone || '',
        channel: 'webchat',
        externalId,
      });
      const conversation = ensureConversation(db, {
        dataset: 'real', contactId: person.id, channel: 'webchat', topic,
        externalId: String(body.conversation_id || externalId), at: occurredAt,
      });
      addMessage(db, {
        dataset: 'real', conversationId: conversation.id, direction: 'in',
        body: text(body.text) || 'Leere Nachricht', deliveryState: 'recorded', at: occurredAt,
      });
      addEvent(db, {
        dataset: 'real', contactId: person.id, channel: 'webchat', type: 'webchat.message', topic,
        occurredAt, source: 'webchat', idempotencyKey: key, summary: text(body.text, 300),
      });
      if (body.lead === true) {
        addEvent(db, {
          dataset: 'real', contactId: person.id, channel: 'webchat', type: 'lead', topic: topic || 'Lead',
          occurredAt, source: 'webchat', idempotencyKey: `${key}:lead`, summary: 'Lead aus Website-Chat',
        });
      }
      return { contactId: person.id };
    },
  });
}

export function verifyMetaChallenge(config, query) {
  requireConfigured(config.secrets.metaVerify, 'meta_whatsapp');
  if (query.get('hub.mode') !== 'subscribe' || query.get('hub.verify_token') !== config.secrets.metaVerify) {
    throw httpError(403, 'Verify-Token stimmt nicht.', 'bad_signature');
  }
  const challenge = query.get('hub.challenge') || '';
  if (!/^[\w.-]{1,200}$/.test(challenge)) throw httpError(400, 'Challenge ist ungültig.', 'bad_payload');
  return challenge;
}

export function ingestMeta(db, config, req, raw) {
  requireConfigured(config.secrets.meta, 'meta_whatsapp');
  assertSignature(signMeta(config.secrets.meta, raw), req.headers['x-hub-signature-256']);
  const body = peek(raw);
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message?.id) throw httpError(400, 'WhatsApp-Nachricht ohne id.', 'bad_payload');
  const key = idempotency(req.headers['idempotency-key'], message.id);
  const gate = begin(db, 'meta_whatsapp', key, raw);
  if (gate.duplicate) return { duplicate: true, accepted: gate.accepted };
  const occurredAt = recentIso(new Date(Number(message.timestamp) * 1000 || Date.now()).toISOString());
  const phone = message.from ? `+${String(message.from).replace(/^\+/, '')}` : '';
  const result = txRun(db, () => {
    const person = upsertContact(db, {
      dataset: 'real',
      displayName: text(message.profile?.name, 120) || 'WhatsApp-Kontakt',
      phone,
      channel: 'whatsapp',
      externalId: message.from || message.id,
    });
    const topic = cleanTopic(message.topic || '');
    const conversation = ensureConversation(db, {
      dataset: 'real', contactId: person.id, channel: 'whatsapp', topic,
      externalId: message.id, at: occurredAt,
    });
    const content = text(message.text?.body || message.type || '');
    addMessage(db, {
      dataset: 'real', conversationId: conversation.id, direction: 'in',
      body: content || 'Nachricht ohne Text', deliveryState: 'recorded', at: occurredAt,
    });
    addEvent(db, {
      dataset: 'real', contactId: person.id, channel: 'whatsapp', type: 'whatsapp.message', topic,
      occurredAt, source: 'meta_whatsapp', idempotencyKey: key, summary: content.slice(0, 300),
    });
    saveReceipt(db, { provider: 'meta_whatsapp', key, raw, accepted: true });
    return { contactId: person.id };
  });
  return { duplicate: false, accepted: true, ...result };
}

function peek(raw) {
  try {
    const parsed = JSON.parse(raw.toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape');
    return parsed;
  } catch {
    throw httpError(400, 'JSON ist ungültig.', 'bad_payload');
  }
}

export function providerStatus(config) {
  const rows = [
    ['telephone', 'Telefon', 'TELEPHONE_WEBHOOK_SECRET', Boolean(config.secrets.telephone)],
    ['meta_whatsapp', 'WhatsApp (Meta)', 'META_APP_SECRET und META_VERIFY_TOKEN', Boolean(config.secrets.meta && config.secrets.metaVerify)],
    ['email', 'E-Mail-Anbieter', 'EMAIL_WEBHOOK_SECRET', Boolean(config.secrets.email)],
    ['webchat', 'Website-Chat', 'WEBCHAT_INGEST_SECRET', Boolean(config.secrets.webchat)],
  ];
  return rows.map(([id, label, env, configured]) => ({
    id,
    label,
    env,
    configured,
    state: 'disconnected',
    badge: configured ? 'Konfiguriert, nicht verbunden' : 'Nicht konfiguriert',
  }));
}
