-- PROJEKT EX intern. Eine Datenbank für Beispiel- und Echtbetrieb.
-- dataset trennt die Sichten. Webhooks schreiben ausschließlich dataset='real'.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token_hash TEXT NOT NULL UNIQUE,
  csrf_secret TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  absolute_until TEXT NOT NULL
);

CREATE TABLE login_attempts (
  bucket TEXT NOT NULL,
  attempted_at TEXT NOT NULL
);
CREATE INDEX login_attempts_bucket ON login_attempts(bucket, attempted_at);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  display_name TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone_e164 TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX contacts_email ON contacts(dataset, email) WHERE email <> '';
CREATE UNIQUE INDEX contacts_phone ON contacts(dataset, phone_e164) WHERE phone_e164 <> '';

CREATE TABLE contact_identities (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'phone', 'whatsapp', 'webchat')),
  external_id TEXT NOT NULL,
  UNIQUE (dataset, channel, external_id)
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  contact_id TEXT REFERENCES contacts(id),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'phone', 'whatsapp', 'webchat', 'system')),
  type TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT '',
  occurred_at TEXT NOT NULL,
  source TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  UNIQUE (dataset, source, idempotency_key)
);
CREATE INDEX events_lookup ON events(dataset, channel, topic, contact_id);
CREATE INDEX events_contact ON events(dataset, contact_id, occurred_at);

CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  contact_id TEXT REFERENCES contacts(id),
  channel TEXT NOT NULL CHECK (channel IN ('phone', 'whatsapp', 'webchat', 'email')),
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  topic TEXT NOT NULL DEFAULT '',
  external_id TEXT NOT NULL DEFAULT '',
  started_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX conversations_list ON conversations(dataset, channel, updated_at);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  conversation_id TEXT NOT NULL REFERENCES conversations(id),
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  body TEXT NOT NULL,
  delivery_state TEXT NOT NULL CHECK (delivery_state IN (
    'recorded', 'draft', 'pending_approval', 'approved_not_dispatched', 'rejected'
  )),
  created_at TEXT NOT NULL
);

CREATE TABLE email_messages (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  contact_id TEXT REFERENCES contacts(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN (
    'example_recorded', 'provider_recorded', 'draft', 'pending_approval',
    'approved_not_dispatched', 'rejected'
  )),
  origin TEXT NOT NULL CHECK (origin IN ('fixture', 'provider', 'draft')),
  recorded_sent_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE email_engagements (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  email_message_id TEXT NOT NULL REFERENCES email_messages(id),
  kind TEXT NOT NULL CHECK (kind IN ('open', 'click')),
  occurred_at TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  UNIQUE (dataset, source, idempotency_key)
);
CREATE INDEX email_engagements_msg ON email_engagements(dataset, email_message_id, kind);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('unconfirmed', 'confirmed', 'in_progress', 'completed')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  ordered_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX orders_dataset ON orders(dataset, status, ordered_at);

CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  title TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('requested', 'confirmed', 'cancelled')),
  channel TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE cms_documents (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  kind TEXT NOT NULL CHECK (kind IN ('page', 'offer', 'shop')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  price_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status = 'draft'),
  updated_at TEXT NOT NULL,
  updated_by TEXT REFERENCES users(id),
  UNIQUE (dataset, kind, slug)
);

CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  dataset TEXT NOT NULL CHECK (dataset IN ('example', 'real')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'phone', 'webchat')),
  contact_id TEXT REFERENCES contacts(id),
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved_not_dispatched', 'rejected')),
  body TEXT NOT NULL,
  requested_by TEXT REFERENCES users(id),
  decided_by TEXT REFERENCES users(id),
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  decided_at TEXT
);

CREATE TABLE webhook_receipts (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  payload_sha256 TEXT NOT NULL,
  accepted INTEGER NOT NULL CHECK (accepted IN (0, 1)),
  reason TEXT NOT NULL DEFAULT '',
  received_at TEXT NOT NULL,
  UNIQUE (provider, idempotency_key)
);

CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

INSERT INTO settings (key, value) VALUES ('active_dataset', 'real');
