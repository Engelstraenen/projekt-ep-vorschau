import { DEFINITIONS, formatClickRate, formatCount, formatEuro, formatMonth, formatOpenRate, formatWhen } from './format.js';
import { CHANNEL_LABELS, ORDER_LABELS } from './repo.js';

const NAV = [
  ['/', 'Dashboard', 'home', (path) => path === '/'],
  ['/bots', 'Bots', 'bots', (path) => path.startsWith('/bots')],
  ['/kunden', 'Kunden', 'person', (path) => path.startsWith('/kunden')],
  ['/inhalte', 'Seiten & Shop', 'pages', (path) => path.startsWith('/inhalte') || path.startsWith('/vorschau')],
  ['/freigaben', 'Freigaben', 'check', (path) => path.startsWith('/freigaben')],
];

const ICONS = {
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M7 10.5V20h10v-9.5"/>',
  bots: '<circle cx="9" cy="9" r="2.2"/><circle cx="16" cy="9.5" r="1.8"/><path d="M4.8 18.5c.6-2.4 2.3-3.6 4.2-3.6s3.6 1.2 4.2 3.6"/><path d="M13.2 15.2c1.3-.3 2.6.1 3.4 1.3.6.9 1 2 1.2 3"/>',
  person: '<circle cx="12" cy="8" r="3"/><path d="M5.5 19.5c.8-3.2 3-4.8 6.5-4.8s5.7 1.6 6.5 4.8"/>',
  pages: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m8 14 2.2-2.2a1 1 0 0 1 1.4 0L14 14l1.2-1.2a1 1 0 0 1 1.4 0L18 14"/><circle cx="9" cy="9.5" r="1"/>',
  check: '<circle cx="12" cy="12" r="8"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/>',
};

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function raw(html) { return { __html: html }; }
function h(strings, ...vals) {
  let out = '';
  strings.forEach((part, index) => {
    out += part;
    if (index >= vals.length) return;
    const value = vals[index];
    if (Array.isArray(value)) out += value.map(renderValue).join('');
    else out += renderValue(value);
  });
  return raw(out);
}
function renderValue(value) {
  if (value && typeof value === 'object' && '__html' in value) return value.__html;
  if (value == null) return '';
  return esc(value);
}

function icon(name) {
  return raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`);
}

function pill(dataset) {
  if (dataset === 'example') return 'ENTWURF · BEISPIELDATEN';
  return 'ECHTBETRIEB · KEINE BEISPIELDATEN';
}

function modeSentence(dataset) {
  if (dataset === 'example') {
    return 'Ansicht des Beispieldatensatzes. Die Zahlen stammen aus lokalen Beispieldaten, nicht aus verbundenen Anbietern. Es sind keine echten Personen.';
  }
  return 'Ansicht des Echtbetriebs. Beispieldaten sind ausgeblendet. Ohne konfigurierte Anbieter bleibt diese Sicht leer, bis Ereignisse eintreffen oder jemand sie hier erfasst.';
}

const HINTS = {
  gespeichert: 'Gespeichert. Der Inhalt bleibt ein Entwurf und wird nicht veröffentlicht.',
  entschieden: 'Entscheidung gespeichert. Es wurde nichts versendet.',
  modus: 'Die Ansicht zeigt jetzt den anderen Datensatz. Die Daten des anderen Satzes bleiben erhalten.',
  kontakt: 'Kontakt gespeichert. Gleiche E-Mail oder gleiche Telefonnummer wurde mit einem bestehenden Kontakt zusammengeführt.',
  entwurf: 'Entwurf liegt zur Freigabe bereit und wird nicht versendet.',
  termin: 'Termin gespeichert.',
  auftrag: 'Auftrag gespeichert.',
  ungueltig: 'Die Eingabe ist ungültig und wurde nicht gespeichert.',
  schon: 'Diese Freigabe ist bereits entschieden. Es wurde nichts versendet.',
};

function layout({ title, path, session, dataset, csrf, main, wide = false }) {
  const nav = NAV.map(([href, label, glyph, current]) => h`<li><a href="${href}" ${current(path) ? raw('aria-current="page"') : ''}>${icon(glyph)}${label}</a></li>`);
  const other = dataset === 'example' ? 'real' : 'example';
  const otherLabel = other === 'real' ? 'Echtbetrieb anzeigen' : 'Beispieldaten anzeigen';
  return h`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <meta name="robots" content="noindex, nofollow">
  <title>${title} · PROJEKT EX</title>
  <link rel="stylesheet" href="/static/app.css">
</head>
<body>
  <a class="skip" href="#inhalt">Zum Inhalt</a>
  <div class="scene" aria-hidden="true"></div>
  <div class="app">
    <aside class="sidebar">
      <a class="brand" href="/">PROJEKT EX</a>
      <nav aria-label="Hauptnavigation"><ul class="nav-list">${nav}</ul></nav>
      <div class="sidebar-foot">
        <p class="who">${session.display_name}</p>
        <p class="org">Engelstränen UG (haftungsbeschränkt)</p>
        <button type="button" class="ghost" command="show-modal" commandfor="definitionen">Definitionen</button>
        <button type="button" class="ghost" command="show-modal" commandfor="modus">Datensatz wechseln</button>
        <form method="post" action="/abmelden">${csrfField(csrf)}<button class="secondary" type="submit">Abmelden</button></form>
      </div>
    </aside>
    <div class="workspace">
      <div class="mode-row">
        <button type="button" class="menu-button secondary" command="show-modal" commandfor="navigation">Menü</button>
        <p class="${dataset === 'real' ? 'pill mode-live' : 'pill'}">${pill(dataset)}</p>
      </div>
      <main id="inhalt">
        <p class="${dataset === 'example' ? 'visually-hidden' : 'notice'}">${modeSentence(dataset)}</p>
        ${main}
      </main>
    </div>
  </div>
  <dialog id="navigation" aria-labelledby="nav-title" closedby="any">
    <div class="dialog-panel">
      <h2 id="nav-title">Navigation</h2>
      <nav aria-label="Mobil"><ul class="nav-list">${nav}</ul></nav>
      <button type="button" class="secondary" command="close">Schließen</button>
    </div>
  </dialog>
  <dialog id="definitionen" aria-labelledby="def-title" closedby="any">
    <div class="dialog-panel">
      <h2 id="def-title">So entstehen die Zahlen</h2>
      <dl class="def-list">${DEFINITIONS.map(([term, text]) => h`<div><dt>${term}</dt><dd>${text}</dd></div>`)}</dl>
      <button type="button" class="secondary" command="close" autofocus>Schließen</button>
    </div>
  </dialog>
  <dialog id="modus" aria-labelledby="modus-title">
    <div class="dialog-panel">
      <h2 id="modus-title">Datensatz wechseln</h2>
      <p>Beispiel und Echtbetrieb liegen in derselben Datenbank und werden in den Kennzahlen nicht vermischt. Der Wechsel ändert nur diese Ansicht.</p>
      <form method="post" action="/modus">
        ${csrfField(csrf)}
        <input type="hidden" name="dataset" value="${other}">
        <div class="actions">
          <button type="submit">${otherLabel}</button>
          <button type="button" class="secondary" command="close" autofocus>Abbrechen</button>
        </div>
      </form>
    </div>
  </dialog>
  <script type="module" src="/static/app.js"></script>
</body>
</html>`.__html;
}

function csrfField(csrf) {
  return h`<input type="hidden" name="csrf" value="${csrf}">`;
}

function hint(code) {
  if (!code || !HINTS[code]) return '';
  return h`<p class="notice" role="status">${HINTS[code]}</p>`;
}

export function dashboardView(ctx, metrics) {
  const email = metrics.email;
  const orders = ['unconfirmed', 'confirmed', 'in_progress', 'completed'].map((status) => h`<div><dt>${ORDER_LABELS[status]}</dt><dd>${formatCount(metrics.orders[status] || 0)}</dd></div>`);
  const chart = chartSvg(metrics.months);
  const topics = (group, channel) => {
    if (!group.topics.length) return h`<p class="hint">Keine Themen in den gespeicherten Ereignissen.</p>`;
    return h`<ul class="topic-list">${group.topics.map((topic) => h`<li><a href="/bots/gespraeche?kanal=${channel}&thema=${topic.topic}">${topic.topic}<strong>${formatCount(topic.contacts)}</strong></a></li>`)}</ul>`;
  };
  const revenueLabel = metrics.dataset === 'example' ? 'Umsatz (Beispiel)' : 'Umsatz';
  const main = h`${hint(ctx.hint)}
    <h1 class="visually-hidden">Dashboard</h1>
    <div class="board">
      <article class="panel">
        <h2>E-Mail-Akquise</h2>
        <dl class="metrics">
          <div><dt>Versendet</dt><dd>${formatCount(email.sent)}</dd></div>
          <div><dt>Öffnungsquote</dt><dd>${formatOpenRate(email.openRate)} <small>(eingeschränkt messbar)</small></dd></div>
          <div><dt>Klickquote</dt><dd>${formatClickRate(email.clickRate)}</dd></div>
        </dl>
      </article>
      <article class="panel">
        <h2><a href="/auftraege">Aufträge</a></h2>
        <dl class="quad">${orders}</dl>
      </article>
      <article class="panel">
        <h2>${revenueLabel}</h2>
        <p class="figure">${formatEuro(metrics.revenueCents)}</p>
        ${chart}
      </article>
      <article class="panel">
        <h2>WhatsApp <span class="count-inline">${formatCount(metrics.whatsapp.contacts)} Kontakte</span></h2>
        ${topics(metrics.whatsapp, 'whatsapp')}
      </article>
      <article class="panel">
        <h2>Telefon <span class="count-inline">${formatCount(metrics.phone.contacts)} Kontakte</span></h2>
        ${topics(metrics.phone, 'phone')}
      </article>
      <article class="panel">
        <h2>Website-Chat</h2>
        <dl class="metrics">
          <div><dt>Gespräche</dt><dd>${formatCount(metrics.webchat.conversations)}</dd></div>
          <div><dt>Leads</dt><dd>${formatCount(metrics.webchat.leads)}</dd></div>
        </dl>
      </article>
    </div>`;
  return layout({ ...ctx, title: 'Dashboard', path: '/', main });
}

function chartSvg(months) {
  if (!months.length) return h`<p class="hint">Noch kein Umsatz aus bestätigten, laufenden oder abgeschlossenen Aufträgen.</p>`;
  const max = Math.max(...months.map((month) => month.cents), 1);
  const width = 28;
  const gap = 14;
  const base = 112;
  const heightMax = 92;
  const total = months.length * (width + gap) - gap;
  const rects = months.map((month, index) => {
    const bar = Math.max(8, Math.round((month.cents / max) * heightMax));
    const x = index * (width + gap);
    const y = base - bar;
    const label = `${formatMonth(month.month)}: ${formatEuro(month.cents)}`;
    return raw(`<rect x="${x}" y="${y}" width="${width}" height="${bar}" rx="8" fill="#3d9dff"><title>${esc(label)}</title></rect>`);
  });
  const table = h`<table class="visually-hidden"><caption>Umsatz je Monat</caption><tbody>
    ${months.map((month) => h`<tr><th scope="row">${formatMonth(month.month)}</th><td>${formatEuro(month.cents)}</td></tr>`)}
  </tbody></table>`;
  return h`<div class="chart-wrap">
    <svg class="chart" viewBox="0 0 ${String(total)} ${String(base)}" role="img" aria-labelledby="umsatz-titel">
      <title id="umsatz-titel">Umsatz je Monat aus bestätigten, laufenden und abgeschlossenen Aufträgen</title>
      ${rects}
    </svg>
    ${table}
  </div>`;
}

const BOT_LINKS = [
  ['/bots/gespraeche', 'Gespräche'],
  ['/bots/kennzahlen', 'Kennzahlen'],
  ['/bots/fehler', 'Fehler und Einstellungen'],
  ['/bots/verbindungen', 'Verbindungen'],
];

function botNav(current) {
  return h`<ul class="subnav">${BOT_LINKS.map(([href, label]) => h`<li><a href="${href}" ${href === current ? raw('aria-current="page"') : ''}>${label}</a></li>`)}</ul>`;
}

export function conversationsView(ctx, { rows, total, channel, topic, page, pages }) {
  const main = h`${hint(ctx.hint)}
    <header class="page-head"><h1>Bots</h1></header>
    ${botNav('/bots/gespraeche')}
    <article class="panel">
      <form class="search" method="get" action="/bots/gespraeche">
        <label>Kanal
          <select name="kanal">
            <option value="">Alle</option>
            ${['whatsapp', 'phone', 'webchat', 'email'].map((item) => h`<option value="${item}" ${item === channel ? raw('selected') : ''}>${CHANNEL_LABELS[item]}</option>`)}
          </select>
        </label>
        <label>Thema <input name="thema" value="${topic}" maxlength="80"></label>
        <button type="submit">Filtern</button>
      </form>
      <div class="table-wrap">
        <table>
          <caption class="visually-hidden">Gespräche, ${total} Einträge</caption>
          <thead><tr><th>Kontakt</th><th>Kanal</th><th>Thema</th><th>Stand</th></tr></thead>
          <tbody>
            ${rows.length ? rows.map((row) => h`<tr>
              <td><a href="/bots/gespraeche/${row.id}">${row.display_name || 'Ohne Kontakt'}</a></td>
              <td>${CHANNEL_LABELS[row.channel] || row.channel}</td>
              <td>${row.topic || '—'}</td>
              <td>${formatWhen(row.updated_at)}</td>
            </tr>`) : h`<tr><td colspan="4">Keine Gespräche in dieser Ansicht.</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="pager">
        ${page > 1 ? h`<a class="button secondary" href="/bots/gespraeche?kanal=${channel}&thema=${topic}&seite=${page - 1}">Zurück</a>` : ''}
        <span>Seite ${page} von ${pages}</span>
        ${page < pages ? h`<a class="button secondary" href="/bots/gespraeche?kanal=${channel}&thema=${topic}&seite=${page + 1}">Weiter</a>` : ''}
      </div>
    </article>`;
  return layout({ ...ctx, title: 'Gespräche', path: '/bots/gespraeche', main });
}

export function conversationView(ctx, { conversation, messages }) {
  const main = h`
    <header class="page-head"><h1>${conversation.display_name || 'Gespräch'}</h1><a class="button secondary" href="/bots/gespraeche">Zur Liste</a></header>
    ${botNav('/bots/gespraeche')}
    <article class="panel">
      <p class="kicker">${CHANNEL_LABELS[conversation.channel] || conversation.channel} · ${conversation.topic || 'ohne Thema'} · ${conversation.status === 'open' ? 'offen' : 'geschlossen'}</p>
      <ol class="timeline">
        ${messages.map((message) => h`<li>
          <p class="kicker">${message.direction === 'in' ? 'Eingegangen' : 'Ausgang'} · ${deliveryLabel(message.delivery_state)} · ${formatWhen(message.created_at)}</p>
          <p>${message.body}</p>
        </li>`)}
      </ol>
      ${conversation.contact_id ? h`<p><a href="/kunden/${conversation.contact_id}">Zum Kontakt</a></p>` : ''}
    </article>`;
  return layout({ ...ctx, title: 'Gespräch', path: '/bots/gespraeche', main });
}

function deliveryLabel(state) {
  return {
    recorded: 'Aufgezeichnet',
    draft: 'Entwurf',
    pending_approval: 'Wartet auf Freigabe',
    approved_not_dispatched: 'Freigegeben, nicht versendet',
    rejected: 'Abgelehnt',
  }[state] || state;
}

export function metricsView(ctx, metrics) {
  const rows = ctx.eventRows || [];
  const main = h`
    <header class="page-head"><h1>Bots</h1></header>
    ${botNav('/bots/kennzahlen')}
    <article class="panel">
      <h2>Kennzahlen aus gespeicherten Ereignissen</h2>
      <dl class="metrics">
        <div><dt>E-Mail versendet</dt><dd>${formatCount(metrics.email.sent)}</dd></div>
        <div><dt>Öffnungen, je Nachricht einmal</dt><dd>${formatCount(metrics.email.opened)}</dd></div>
        <div><dt>Klicks, je Nachricht einmal</dt><dd>${formatCount(metrics.email.clicked)}</dd></div>
      </dl>
      <div class="table-wrap">
        <table>
          <caption>Jüngste Ereignisse</caption>
          <thead><tr><th>Zeit</th><th>Kanal</th><th>Typ</th><th>Thema</th><th>Kontakt</th></tr></thead>
          <tbody>
            ${rows.length ? rows.map((row) => h`<tr>
              <td>${formatWhen(row.occurred_at)}</td>
              <td>${CHANNEL_LABELS[row.channel] || row.channel}</td>
              <td><code>${row.type}</code></td>
              <td>${row.topic || '—'}</td>
              <td>${row.display_name || '—'}</td>
            </tr>`) : h`<tr><td colspan="5">Keine Ereignisse in dieser Ansicht.</td></tr>`}
          </tbody>
        </table>
      </div>
    </article>`;
  return layout({ ...ctx, title: 'Kennzahlen', path: '/bots/kennzahlen', main });
}

export function errorsView(ctx, receipts) {
  const main = h`
    <header class="page-head"><h1>Bots</h1></header>
    ${botNav('/bots/fehler')}
    <article class="panel">
      <h2>Fehler und Einstellungen</h2>
      <p>Geheimnisse werden weder in der Datenbank noch in diesem Formular gespeichert. Sie stehen nur in der Umgebung des Serverprozesses. Bestehende Telefon-, WhatsApp- und E-Mail-Bots liegen außerhalb dieses Repositories und gelten erst als angebunden, wenn die genannten Variablen gesetzt sind und signierte Ereignisse ankommen.</p>
      <ul>
        <li><code>TELEPHONE_WEBHOOK_SECRET</code></li>
        <li><code>META_APP_SECRET</code> und <code>META_VERIFY_TOKEN</code></li>
        <li><code>EMAIL_WEBHOOK_SECRET</code></li>
        <li><code>WEBCHAT_INGEST_SECRET</code></li>
      </ul>
      <div class="table-wrap">
        <table>
          <caption>Zuletzt abgewiesene oder angenommene Webhooks, ohne Nutzlast</caption>
          <thead><tr><th>Zeit</th><th>Anbieter</th><th>Ergebnis</th><th>Grund</th></tr></thead>
          <tbody>
            ${receipts.length ? receipts.map((row) => h`<tr>
              <td>${formatWhen(row.received_at)}</td>
              <td>${row.provider}</td>
              <td>${row.accepted ? 'angenommen' : 'abgewiesen'}</td>
              <td>${row.reason || '—'}</td>
            </tr>`) : h`<tr><td colspan="4">Keine Webhook-Eingänge. Es wird keine erfundene Fehlerquote angezeigt.</td></tr>`}
          </tbody>
        </table>
      </div>
    </article>`;
  return layout({ ...ctx, title: 'Fehler und Einstellungen', path: '/bots/fehler', main });
}

export function connectionsView(ctx, providers) {
  const main = h`
    <header class="page-head"><h1>Bots</h1></header>
    ${botNav('/bots/verbindungen')}
    <article class="panel">
      <h2>Kanalverbindungen</h2>
      <p>Kein Kanal wird als verbunden markiert. Ein gesetztes Geheimnis bedeutet nur, dass der Webhook technisch geprüft werden kann.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Kanal</th><th>Status</th><th>Umgebung</th></tr></thead>
          <tbody>
            ${providers.map((provider) => h`<tr>
              <td>${provider.label}</td>
              <td><span class="badge ${provider.configured ? 'warn' : 'muted'}">${provider.badge}</span></td>
              <td><code>${provider.env}</code></td>
            </tr>`)}
          </tbody>
        </table>
      </div>
    </article>`;
  return layout({ ...ctx, title: 'Verbindungen', path: '/bots/verbindungen', main });
}

export function customersView(ctx, { rows, total, q, page, pages }) {
  const main = h`${hint(ctx.hint)}
    <header class="page-head"><h1>Kunden</h1></header>
    <div class="split">
      <article class="panel">
        <search>
          <form class="search" method="get" action="/kunden">
            <label>Suche <input type="search" name="q" value="${q}" maxlength="120"></label>
            <button type="submit">Suchen</button>
          </form>
        </search>
        <div class="table-wrap">
          <table>
            <caption>${total} Kontakte in dieser Ansicht</caption>
            <thead><tr><th>Name</th><th>Organisation</th><th>E-Mail</th><th>Telefon</th></tr></thead>
            <tbody>
              ${rows.length ? rows.map((row) => h`<tr>
                <td><a href="/kunden/${row.id}">${row.display_name}</a></td>
                <td>${row.organization || '—'}</td>
                <td>${row.email || '—'}</td>
                <td>${row.phone_e164 || '—'}</td>
              </tr>`) : h`<tr><td colspan="4">Keine Kontakte in dieser Ansicht.</td></tr>`}
            </tbody>
          </table>
        </div>
        <div class="pager">
          ${page > 1 ? h`<a class="button secondary" href="/kunden?q=${q}&seite=${page - 1}">Zurück</a>` : ''}
          <span>Seite ${page} von ${pages}</span>
          ${page < pages ? h`<a class="button secondary" href="/kunden?q=${q}&seite=${page + 1}">Weiter</a>` : ''}
        </div>
      </article>
      <article class="panel">
        <h2>Kontakt anlegen</h2>
        <form method="post" action="/kunden" class="form-grid">
          ${csrfField(ctx.csrf)}
          <label>Name <input name="name" required maxlength="120" autocomplete="name"></label>
          <label>Organisation <input name="organisation" maxlength="160" autocomplete="organization"></label>
          <label>E-Mail <input name="email" type="email" maxlength="200" autocomplete="email" inputmode="email"></label>
          <label>Telefon <input name="telefon" type="tel" maxlength="20" autocomplete="tel" placeholder="+490000000000"></label>
          <button type="submit">Kontakt speichern</button>
        </form>
      </article>
    </div>`;
  return layout({ ...ctx, title: 'Kunden', path: '/kunden', main });
}

export function customerView(ctx, detail) {
  const { contact, identities, events, appointments, orders } = detail;
  const main = h`${hint(ctx.hint)}
    <header class="page-head"><h1>${contact.display_name}</h1><a class="button secondary" href="/kunden">Zur Liste</a></header>
    <div class="split">
      <article class="panel">
        <h2>Verlauf</h2>
        <p class="kicker">${contact.organization || 'Ohne Organisation'} · ${contact.email || 'ohne E-Mail'} · ${contact.phone_e164 || 'ohne Telefon'}</p>
        <p>Kanäle: ${identities.length ? identities.map((item) => CHANNEL_LABELS[item.channel] || item.channel).join(', ') : 'noch keine'}</p>
        <ol class="timeline">
          ${events.length ? events.map((event) => h`<li>
            <p class="kicker">${formatWhen(event.occurred_at)} · ${CHANNEL_LABELS[event.channel] || event.channel} · <code>${event.type}</code>${event.topic ? ` · ${event.topic}` : ''}</p>
            <p>${event.summary || 'Ohne Notiz'}</p>
          </li>`) : h`<li>Noch keine Ereignisse.</li>`}
        </ol>
      </article>
      <div class="stack">
        <article class="panel">
          <h2>Termine</h2>
          <ul class="timeline">
            ${appointments.length ? appointments.map((item) => h`<li><strong>${item.title}</strong><br>${formatWhen(item.starts_at)} · ${item.status}</li>`) : h`<li>Keine Termine.</li>`}
          </ul>
          <form method="post" action="/kunden/${contact.id}/termine" class="form-grid">
            ${csrfField(ctx.csrf)}
            <label>Titel <input name="titel" required maxlength="160" value="Terminwunsch"></label>
            <label>Beginn <input name="beginn" type="datetime-local" required></label>
            <label>Ende <input name="ende" type="datetime-local" required></label>
            <label>Kanal
              <select name="kanal">${['whatsapp', 'phone', 'webchat', 'email'].map((item) => h`<option value="${item}">${CHANNEL_LABELS[item]}</option>`)}</select>
            </label>
            <label>Notiz <textarea name="notiz" maxlength="1000"></textarea></label>
            <button type="submit">Termin speichern</button>
          </form>
        </article>
        <article class="panel">
          <h2>Aufträge</h2>
          <ul class="timeline">
            ${orders.length ? orders.map((order) => h`<li>${order.title} · ${ORDER_LABELS[order.status]} · ${formatEuro(order.amount_cents)}</li>`) : h`<li>Keine Aufträge.</li>`}
          </ul>
        </article>
      </div>
    </div>`;
  return layout({ ...ctx, title: contact.display_name, path: '/kunden', main });
}

export function ordersView(ctx, orders, contacts) {
  const main = h`${hint(ctx.hint)}
    <header class="page-head"><h1>Aufträge</h1><a class="button secondary" href="/">Zum Dashboard</a></header>
    <div class="split">
      <article class="panel">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Datum</th><th>Titel</th><th>Kontakt</th><th>Status</th><th>Betrag</th></tr></thead>
            <tbody>
              ${orders.length ? orders.map((order) => h`<tr>
                <td>${formatWhen(order.ordered_at)}</td>
                <td>${order.title}</td>
                <td><a href="/kunden/${order.contact_id}">${order.display_name}</a></td>
                <td>${ORDER_LABELS[order.status]}</td>
                <td>${formatEuro(order.amount_cents)}</td>
              </tr>`) : h`<tr><td colspan="5">Keine Aufträge in dieser Ansicht.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
      <article class="panel">
        <h2>Auftrag erfassen</h2>
        ${contacts.length ? h`<form method="post" action="/auftraege" class="form-grid">
          ${csrfField(ctx.csrf)}
          <label>Kontakt <select name="kontakt" required>${contacts.map((contact) => h`<option value="${contact.id}">${contact.display_name}</option>`)}</select></label>
          <label>Titel <input name="titel" required maxlength="160"></label>
          <label>Status <select name="status">${Object.entries(ORDER_LABELS).map(([value, label]) => h`<option value="${value}">${label}</option>`)}</select></label>
          <label>Betrag in Euro <input name="betrag" inputmode="decimal" required placeholder="0,00"></label>
          <label>Datum <input name="datum" type="date" required></label>
          <button type="submit">Auftrag speichern</button>
        </form>` : h`<p>Zuerst braucht es einen Kontakt.</p>`}
      </article>
    </div>`;
  return layout({ ...ctx, title: 'Aufträge', path: '/', main });
}

const KINDS = { page: 'Seite', offer: 'Angebot', shop: 'Shop' };

export function cmsListView(ctx, docs, kind) {
  const main = h`${hint(ctx.hint)}
    <header class="page-head"><h1>Seiten und Shop</h1><a class="button" href="/inhalte/neu">Neuer Entwurf</a></header>
    <ul class="subnav">
      ${[['', 'Alle'], ['page', 'Seiten'], ['offer', 'Angebote'], ['shop', 'Shop']].map(([value, label]) => h`<li><a href="/inhalte?art=${value}" ${value === kind ? raw('aria-current="page"') : ''}>${label}</a></li>`)}
    </ul>
    <article class="panel">
      <p>Änderungen bleiben Entwürfe. Es gibt keine Veröffentlichung auf die Website.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Art</th><th>Titel</th><th>Stand</th><th></th></tr></thead>
          <tbody>
            ${docs.length ? docs.map((doc) => h`<tr>
              <td>${KINDS[doc.kind]}</td>
              <td><a href="/inhalte/${doc.id}">${doc.title}</a></td>
              <td><span class="badge">Entwurf</span></td>
              <td><a href="/vorschau/${doc.id}">Vorschau</a></td>
            </tr>`) : h`<tr><td colspan="4">Keine Entwürfe in dieser Ansicht.</td></tr>`}
          </tbody>
        </table>
      </div>
    </article>`;
  return layout({ ...ctx, title: 'Seiten und Shop', path: '/inhalte', main });
}

export function cmsFormView(ctx, doc, error = '') {
  const value = doc || { kind: 'page', slug: '', title: '', summary: '', body: '', price_cents: null };
  const action = doc?.id ? `/inhalte/${doc.id}` : '/inhalte';
  const main = h`${error ? h`<p class="error" role="alert">${error}</p>` : ''}
    <header class="page-head"><h1>${doc?.id ? 'Entwurf bearbeiten' : 'Neuer Entwurf'}</h1></header>
    <article class="panel">
      <form method="post" action="${action}" class="form-grid">
        ${csrfField(ctx.csrf)}
        <label>Art
          <select name="art">
            ${Object.entries(KINDS).map(([key, label]) => h`<option value="${key}" ${value.kind === key ? raw('selected') : ''}>${label}</option>`)}
          </select>
        </label>
        <label>Titel <input name="titel" required maxlength="160" value="${value.title}"></label>
        <label>Kurzadresse <input name="slug" maxlength="80" value="${value.slug}" placeholder="wird aus dem Titel"></label>
        <label>Kurztext <input name="kurz" maxlength="400" value="${value.summary}"></label>
        <label>Text <textarea name="text" maxlength="20000">${value.body}</textarea></label>
        <label>Preis in Euro, nur Shop <input name="preis" inputmode="decimal" value="${value.price_cents == null ? '' : (value.price_cents / 100).toFixed(2).replace('.', ',')}"></label>
        <div class="actions">
          <button type="submit">Entwurf speichern</button>
          ${doc?.id ? h`<a class="button secondary" href="/vorschau/${doc.id}">Vorschau</a>` : ''}
        </div>
      </form>
      <p class="hint">Der Status bleibt Entwurf. Ein Feld für Veröffentlichung wird nicht angeboten.</p>
    </article>`;
  return layout({ ...ctx, title: 'Entwurf', path: '/inhalte', main });
}

export function previewView(ctx, doc) {
  const paragraphs = String(doc.body || '').split(/\n{2,}/).filter(Boolean);
  const main = h`
    <p class="preview-banner">Interne Vorschau · nicht veröffentlicht · nicht die öffentliche Website</p>
    <article class="panel prose">
      <p class="kicker">${KINDS[doc.kind]} · Entwurf · ${doc.slug}</p>
      <h1>${doc.title}</h1>
      ${doc.summary ? h`<p>${doc.summary}</p>` : ''}
      ${doc.price_cents != null ? h`<p><strong>${formatEuro(doc.price_cents)}</strong></p>` : ''}
      ${paragraphs.length ? paragraphs.map((paragraph) => h`<p>${paragraph}</p>`) : h`<p>Kein Text.</p>`}
      <p><a href="/inhalte/${doc.id}">Zurück zum Entwurf</a></p>
    </article>`;
  return layout({ ...ctx, title: `Vorschau ${doc.title}`, path: '/vorschau', main });
}

export function approvalsView(ctx, approvals, contacts) {
  const main = h`${hint(ctx.hint)}
    <header class="page-head"><h1>Freigaben</h1></header>
    <div class="split">
      <article class="panel">
        <h2>Entscheidungen</h2>
        <p>Eine Freigabe versendet nichts. Sie markiert den Entwurf als freigegeben und nicht abgesendet.</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Kanal</th><th>Kontakt</th><th>Status</th><th>Text</th><th></th></tr></thead>
            <tbody>
              ${approvals.length ? approvals.map((item) => h`<tr>
                <td>${CHANNEL_LABELS[item.channel] || item.channel}</td>
                <td>${item.display_name || '—'}</td>
                <td>${deliveryLabel(item.status === 'pending' ? 'pending_approval' : item.status)}</td>
                <td>${item.body}</td>
                <td>${item.status === 'pending' ? h`<form method="post" action="/freigaben/${item.id}" class="actions">
                  ${csrfField(ctx.csrf)}
                  <button name="entscheidung" value="approve" type="submit">Freigeben, nicht senden</button>
                  <button class="secondary" name="entscheidung" value="reject" type="submit">Ablehnen</button>
                </form>` : ''}</td>
              </tr>`) : h`<tr><td colspan="5">Keine Freigaben in dieser Ansicht.</td></tr>`}
            </tbody>
          </table>
        </div>
        <h2>Letzte Aktionen</h2>
        <ul class="timeline">
          ${(ctx.audit || []).map((item) => h`<li><span class="kicker">${formatWhen(item.created_at)}</span> · <code>${item.action}</code> ${item.detail || ''}</li>`)}
        </ul>
      </article>
      <article class="panel">
        <h2>Ausgang als Entwurf</h2>
        ${contacts.length ? h`<form method="post" action="/freigaben" class="form-grid">
          ${csrfField(ctx.csrf)}
          <label>Kontakt <select name="kontakt" required>${contacts.map((contact) => h`<option value="${contact.id}">${contact.display_name}</option>`)}</select></label>
          <label>Kanal
            <select name="kanal">${['email', 'whatsapp', 'phone', 'webchat'].map((item) => h`<option value="${item}">${CHANNEL_LABELS[item]}</option>`)}</select>
          </label>
          <label>Betreff, nur E-Mail <input name="betreff" maxlength="200"></label>
          <label>Text <textarea name="text" required maxlength="8000"></textarea></label>
          <button type="submit">Zur Freigabe legen</button>
        </form>` : h`<p>Zuerst braucht es einen Kontakt.</p>`}
      </article>
    </div>`;
  return layout({ ...ctx, title: 'Freigaben', path: '/freigaben', main });
}

export function authView({ title, action, modeLabel, error, fields, submit, extra }) {
  return h`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${title} · PROJEKT EX</title>
  <link rel="stylesheet" href="/static/app.css">
</head>
<body>
  <div class="scene" aria-hidden="true"></div>
  <div class="auth-shell">
    <article class="auth-card">
      <p class="pill">${modeLabel}</p>
      <h1>${title}</h1>
      <p class="lede">Internes System der Engelstränen UG (haftungsbeschränkt). Kein Zugang zur öffentlichen Website.</p>
      ${error ? h`<p class="error" role="alert">${error}</p>` : ''}
      <form method="post" action="${action}" class="form-grid">
        ${fields}
        <button type="submit">${submit}</button>
      </form>
      ${extra || ''}
    </article>
  </div>
</body>
</html>`.__html;
}

export function setupView({ error, csrf, dataset }) {
  return authView({
    title: 'Ersteinrichtung',
    action: '/setup',
    modeLabel: pill(dataset),
    error,
    submit: 'Verwaltung anlegen',
    fields: h`${csrfField(csrf)}
      <label>Name <input id="name" name="name" required maxlength="80" autocomplete="name" autofocus></label>
      <label>E-Mail <input id="email" name="email" type="email" required maxlength="200" autocomplete="username" inputmode="email"></label>
      <label>Passwort <input id="password" name="password" type="password" required minlength="12" maxlength="200" autocomplete="new-password"></label>
      <label>Passwort wiederholen <input id="password2" name="password2" type="password" required minlength="12" maxlength="200" autocomplete="new-password"></label>`,
  });
}

export function loginView({ error, csrf, dataset, next }) {
  return authView({
    title: 'Anmelden',
    action: '/anmelden',
    modeLabel: pill(dataset),
    error,
    submit: 'Anmelden',
    fields: h`${csrfField(csrf)}
      <input type="hidden" name="next" value="${next || '/'}">
      <label>E-Mail <input id="email" name="email" type="email" required maxlength="200" autocomplete="username" inputmode="email" autofocus></label>
      <label>Passwort <input id="password" name="password" type="password" required maxlength="200" autocomplete="current-password"></label>`,
  });
}
