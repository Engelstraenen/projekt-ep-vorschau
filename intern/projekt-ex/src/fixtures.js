import { tx } from './db.js';
import { addEvent, addMessage, ensureConversation, setDataset } from './repo.js';

/** Zielwerte der freigegebenen Dashboard-Ansicht. Tests prüfen diese Konstanten gegen die Datenbank. */
export const EXAMPLE_TARGETS = {
  emailsSent: 420,
  emailsOpened: 172,
  emailsClicked: 26,
  whatsappContacts: 186,
  phoneContacts: 92,
  phoneSharedWithWhatsapp: 40,
  webchatConversations: 134,
  webchatLeads: 27,
  orders: { unconfirmed: 5, confirmed: 8, in_progress: 6, completed: 14 },
  revenueCents: 4_860_000,
  topics: {
    whatsapp: { Terminwunsch: 64, Rückruf: 41 },
    phone: { Angebot: 28, Projektstatus: 19 },
  },
};

const MONTHS = [
  { month: '2026-05', cents: [135000, 135000, 135000, 135000] },
  { month: '2026-06', cents: [172500, 172500, 172500, 172500] },
  { month: '2026-07', cents: [145000, 145000, 145000, 145000] },
  { month: '2026-08', cents: [210000, 210000, 210000, 210000] },
  { month: '2026-09', cents: [182500, 182500, 182500, 182500] },
  { month: '2026-10', cents: [232500, 232500, 232500, 232500] },
  { month: '2026-11', cents: [137500, 137500, 137500, 137500] },
];

function contactId(n) {
  return `ex-c-${String(n).padStart(4, '0')}`;
}

function clearExample(db) {
  const tables = [
    'email_engagements', 'email_messages', 'messages', 'conversations', 'appointments',
    'orders', 'events', 'approvals', 'cms_documents', 'contact_identities', 'contacts',
  ];
  for (const table of tables) db.exec(`DELETE FROM ${table} WHERE dataset = 'example'`);
}

function insertContact(db, n, { email = false, phone = false } = {}) {
  const id = contactId(n);
  const emailValue = email ? `beispiel.${String(n).padStart(4, '0')}@example.invalid` : '';
  const phoneValue = phone ? `+490000${String(n).padStart(7, '0')}` : '';
  db.prepare(`INSERT INTO contacts
    (id, dataset, display_name, organization, email, phone_e164, created_at, updated_at)
    VALUES (?, 'example', ?, ?, ?, ?, '2026-04-01T08:00:00.000Z', '2026-04-01T08:00:00.000Z')`).run(
    id,
    `Beispielkontakt ${String(n).padStart(3, '0')}`,
    n % 2 === 0 ? 'Musterauftrag Nord' : 'Musterauftrag Süd',
    emailValue,
    phoneValue,
  );
  if (emailValue) {
    db.prepare(`INSERT INTO contact_identities (id, dataset, contact_id, channel, external_id)
      VALUES (?, 'example', ?, 'email', ?)`).run(`ex-id-mail-${n}`, id, emailValue);
  }
  if (phoneValue) {
    db.prepare(`INSERT INTO contact_identities (id, dataset, contact_id, channel, external_id)
      VALUES (?, 'example', ?, 'phone', ?)`).run(`ex-id-phone-${n}`, id, phoneValue);
  }
  return id;
}

export function seedExample(db, userId = null) {
  const revenue = MONTHS.reduce((sum, month) => sum + month.cents.reduce((a, b) => a + b, 0), 0);
  if (revenue !== EXAMPLE_TARGETS.revenueCents) {
    throw new Error(`Beispielumsatz ergibt ${revenue}, erwartet ${EXAMPLE_TARGETS.revenueCents}`);
  }
  tx(db, () => {
    clearExample(db);
    const maxContact = 433;
    for (let n = 1; n <= maxContact; n += 1) {
      const phone = (n >= 147 && n <= 238);
      const email = n <= 420;
      insertContact(db, n, { email, phone });
    }

    for (let n = 1; n <= EXAMPLE_TARGETS.emailsSent; n += 1) {
      const id = `ex-mail-${n}`;
      const when = `2026-10-${String((n % 27) + 1).padStart(2, '0')}T09:00:00.000Z`;
      db.prepare(`INSERT INTO email_messages
        (id, dataset, contact_id, subject, body, state, origin, recorded_sent_at, created_at)
        VALUES (?, 'example', ?, ?, ?, 'example_recorded', 'fixture', ?, ?)`).run(
        id, contactId(n), 'Beispiel: kurze Projektnachricht',
        'Dieser Text gehört zum Beispieldatensatz und wurde nicht versendet.',
        when, when,
      );
      addEvent(db, {
        id: `ex-ev-sent-${n}`, dataset: 'example', contactId: contactId(n), channel: 'email',
        type: 'email.sent', topic: '', occurredAt: when, source: 'fixture',
        idempotencyKey: `email-sent-${n}`, summary: 'Beispielversand, nur Datensatz',
      });
      if (n <= EXAMPLE_TARGETS.emailsOpened) {
        db.prepare(`INSERT INTO email_engagements
          (id, dataset, email_message_id, kind, occurred_at, url, source, idempotency_key)
          VALUES (?, 'example', ?, 'open', ?, '', 'fixture', ?)`).run(
          `ex-open-${n}`, id, when, `email-open-${n}`,
        );
        addEvent(db, {
          id: `ex-ev-open-${n}`, dataset: 'example', contactId: contactId(n), channel: 'email',
          type: 'email.opened', topic: '', occurredAt: when, source: 'fixture',
          idempotencyKey: `email-open-${n}`, summary: 'Beispielöffnung, technisch eingeschränkt',
        });
      }
      if (n <= EXAMPLE_TARGETS.emailsClicked) {
        db.prepare(`INSERT INTO email_engagements
          (id, dataset, email_message_id, kind, occurred_at, url, source, idempotency_key)
          VALUES (?, 'example', ?, 'click', ?, ?, 'fixture', ?)`).run(
          `ex-click-${n}`, id, when, 'https://example.invalid/angebot', `email-click-${n}`,
        );
        addEvent(db, {
          id: `ex-ev-click-${n}`, dataset: 'example', contactId: contactId(n), channel: 'email',
          type: 'email.clicked', topic: '', occurredAt: when, source: 'fixture',
          idempotencyKey: `email-click-${n}`, summary: 'Beispielklick auf example.invalid',
        });
      }
    }

    for (let n = 1; n <= EXAMPLE_TARGETS.whatsappContacts; n += 1) {
      const topic = n <= 64 ? 'Terminwunsch' : (n <= 105 ? 'Rückruf' : '');
      const when = '2026-10-12T11:00:00.000Z';
      db.prepare(`INSERT INTO contact_identities (id, dataset, contact_id, channel, external_id)
        VALUES (?, 'example', ?, 'whatsapp', ?)`).run(`ex-wa-${n}`, contactId(n), `wa-example-${n}`);
      const conversation = ensureConversation(db, {
        dataset: 'example', contactId: contactId(n), channel: 'whatsapp', topic,
        externalId: `wa-conv-${n}`, at: when,
      });
      addMessage(db, {
        dataset: 'example', conversationId: conversation.id, direction: 'in',
        body: 'Beispielnachricht aus dem Beispieldatensatz.', deliveryState: 'recorded', at: when,
      });
      addEvent(db, {
        id: `ex-ev-wa-${n}`, dataset: 'example', contactId: contactId(n), channel: 'whatsapp',
        type: 'whatsapp.message', topic, occurredAt: when, source: 'fixture',
        idempotencyKey: `wa-${n}`, summary: topic || 'Ohne Thema',
      });
    }

    for (let i = 0; i < EXAMPLE_TARGETS.phoneContacts; i += 1) {
      const n = 147 + i;
      const topic = i < 28 ? 'Angebot' : (i < 47 ? 'Projektstatus' : '');
      const when = '2026-10-14T15:30:00.000Z';
      const conversation = ensureConversation(db, {
        dataset: 'example', contactId: contactId(n), channel: 'phone', topic,
        externalId: `phone-conv-${n}`, at: when,
      });
      addMessage(db, {
        dataset: 'example', conversationId: conversation.id, direction: 'in',
        body: 'Beispielnotiz eines Anrufs. Kein echtes Gespräch.', deliveryState: 'recorded', at: when,
      });
      addEvent(db, {
        id: `ex-ev-phone-${n}`, dataset: 'example', contactId: contactId(n), channel: 'phone',
        type: 'phone.call', topic, occurredAt: when, source: 'fixture',
        idempotencyKey: `phone-${n}`, summary: topic || 'Ohne Thema',
      });
    }

    for (let i = 0; i < EXAMPLE_TARGETS.webchatConversations; i += 1) {
      const n = 300 + i;
      const when = '2026-10-20T16:00:00.000Z';
      const lead = i < EXAMPLE_TARGETS.webchatLeads;
      db.prepare(`INSERT INTO contact_identities (id, dataset, contact_id, channel, external_id)
        VALUES (?, 'example', ?, 'webchat', ?)`).run(`ex-chat-${n}`, contactId(n), `chat-example-${n}`);
      const conversation = ensureConversation(db, {
        dataset: 'example', contactId: contactId(n), channel: 'webchat', topic: lead ? 'Angebot' : '',
        externalId: `chat-conv-${n}`, at: when,
      });
      addMessage(db, {
        dataset: 'example', conversationId: conversation.id, direction: 'in',
        body: 'Beispielfrage aus dem Website-Chat. Der öffentliche Chat ist nicht angebunden.',
        deliveryState: 'recorded', at: when,
      });
      addEvent(db, {
        id: `ex-ev-chat-${n}`, dataset: 'example', contactId: contactId(n), channel: 'webchat',
        type: 'webchat.message', topic: '', occurredAt: when, source: 'fixture',
        idempotencyKey: `chat-${n}`, summary: 'Beispielgespräch',
      });
      if (lead) {
        addEvent(db, {
          id: `ex-ev-lead-${n}`, dataset: 'example', contactId: contactId(n), channel: 'webchat',
          type: 'lead', topic: 'Angebot', occurredAt: when, source: 'fixture',
          idempotencyKey: `lead-${n}`, summary: 'Beispiel-Lead',
        });
      }
    }

    const statuses = [
      ...Array(14).fill('completed'),
      ...Array(8).fill('confirmed'),
      ...Array(6).fill('in_progress'),
    ];
    let orderIndex = 0;
    for (const month of MONTHS) {
      month.cents.forEach((cents, dayIndex) => {
        const status = statuses[orderIndex];
        const day = String(4 + dayIndex * 7).padStart(2, '0');
        db.prepare(`INSERT INTO orders
          (id, dataset, contact_id, title, status, amount_cents, currency, ordered_at, created_at)
          VALUES (?, 'example', ?, ?, ?, ?, 'EUR', ?, ?)`).run(
          `ex-order-${orderIndex + 1}`, contactId(orderIndex + 1),
          `Beispielauftrag ${orderIndex + 1}`, status, cents,
          `${month.month}-${day}T10:00:00.000Z`, `${month.month}-${day}T10:00:00.000Z`,
        );
        orderIndex += 1;
      });
    }
    for (let i = 0; i < 5; i += 1) {
      db.prepare(`INSERT INTO orders
        (id, dataset, contact_id, title, status, amount_cents, currency, ordered_at, created_at)
        VALUES (?, 'example', ?, ?, 'unconfirmed', 15000, 'EUR', '2026-11-06T10:00:00.000Z', '2026-11-06T10:00:00.000Z')`).run(
        `ex-order-open-${i + 1}`, contactId(30 + i), `Unbestätigter Beispielauftrag ${i + 1}`,
      );
    }

    for (let n = 1; n <= 6; n += 1) {
      db.prepare(`INSERT INTO appointments
        (id, dataset, contact_id, title, starts_at, ends_at, status, channel, notes, created_at)
        VALUES (?, 'example', ?, 'Terminwunsch', ?, ?, 'requested', 'whatsapp', 'Beispieltermin, nicht bestätigt.', ?)`).run(
        `ex-appt-${n}`, contactId(n),
        `2026-11-${String(10 + n).padStart(2, '0')}T09:00:00.000Z`,
        `2026-11-${String(10 + n).padStart(2, '0')}T09:30:00.000Z`,
        '2026-10-12T11:05:00.000Z',
      );
    }

    const docs = [
      ['page', 'start', 'Startseite (Entwurf)', 'Interner Entwurf, nicht die öffentliche Website.', 'Kurzer Beispieltext für die Startseite. Veröffentlichung ist in dieser Fassung nicht möglich.'],
      ['page', 'leistungen', 'Leistungen (Entwurf)', 'Nur zur internen Durchsicht.', 'Beispielabsatz über ein Angebot der Engelstränen UG. Wird nicht auf projektex.de geschrieben.'],
      ['offer', 'erstgespraech', 'Erstgespräch', 'Beispielangebot ohne Preisbindung.', 'Gespräch zur Einordnung eines Vorhabens. Dieser Entwurf ist nicht veröffentlicht.'],
      ['offer', 'wartungsvereinbarung', 'Wartung', 'Beispiel für ein wiederkehrendes Angebot.', 'Monatliche Durchsicht. Nur Beispieldatensatz.'],
      ['shop', 'druckmappe', 'Druckmappe', 'Beispielartikel.', 'Eine Mappe als Platzhalter im Shop-Entwurf.'],
      ['shop', 'beratungsstunde', 'Beratungsstunde', 'Beispielartikel mit Preis.', 'Eine Stunde zur Vorbereitung. Nicht bestellbar.'],
    ];
    docs.forEach((doc, index) => {
      const price = doc[0] === 'shop' ? (index === 5 ? 12000 : 4500) : null;
      db.prepare(`INSERT INTO cms_documents
        (id, dataset, kind, slug, title, summary, body, price_cents, status, updated_at)
        VALUES (?, 'example', ?, ?, ?, ?, ?, ?, 'draft', '2026-10-02T12:00:00.000Z')`).run(
        `ex-cms-${index + 1}`, ...doc, price,
      );
    });

    const draftId = 'ex-draft-mail-1';
    db.prepare(`INSERT INTO email_messages
      (id, dataset, contact_id, subject, body, state, origin, recorded_sent_at, created_at)
      VALUES (?, 'example', ?, 'Beispielentwurf', ?, 'pending_approval', 'draft', NULL, '2026-11-01T09:00:00.000Z')`).run(
      draftId, contactId(1), 'Dieser Entwurf wartet auf Freigabe und wird auch danach nicht versendet.',
    );
    db.prepare(`INSERT INTO approvals
      (id, dataset, channel, contact_id, subject_type, subject_id, status, body, note, created_at)
      VALUES ('ex-approval-1', 'example', 'email', ?, 'email_message', ?, 'pending', ?, '', '2026-11-01T09:00:00.000Z')`).run(
      contactId(1), draftId, 'Dieser Entwurf wartet auf Freigabe und wird auch danach nicht versendet.',
    );

    setDataset(db, 'example', userId);
  });
}
