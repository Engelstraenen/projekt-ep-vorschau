import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import {
  clearCookie, cookieHeader, csrfToken, hmac, newToken, parseCookies, passwordOk,
  safeEqual, sha256, verifyPassword, isEmail, normalizeEmail,
} from './security.js';
import {
  clearAttempts, contactsForSelect, countUsers, createAppointment, createOrder, createOutboundDraft,
  createSession, createUser, dashboardMetrics, decideApproval, deleteSession, findSession, findUserByEmail,
  getCms, getContact, getConversation, getDataset, listApprovals, listCms, listContacts, listConversations,
  listEvents, listOrders, recentAudit, recentReceipts, saveCms, setDataset, tooManyAttempts, touchSession,
  upsertContact, recordLoginFailure, txRun,
} from './repo.js';
import { httpError, ingestEmail, ingestMeta, ingestTelephone, ingestWebchat, providerStatus, verifyMetaChallenge } from './ingest.js';
import {
  approvalsView, cmsFormView, cmsListView, connectionsView, conversationView, conversationsView,
  customerView, customersView, dashboardView, errorsView, esc, loginView, metricsView, ordersView,
  previewView, setupView,
} from './ui.js';

const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

export function createApp({ db, config }) {
  return createServer(async (req, res) => {
    try {
      await route(req, res, db, config);
    } catch (error) {
      const status = error.status || 500;
      if (!error.status || status === 500) console.error(error);
      const message = status >= 500 ? 'Interner Fehler' : error.message;
      if ((req.url || '').startsWith('/api/')) sendJson(res, status, { error: message, code: error.code || 'error' });
      else sendHtml(res, status, `<!DOCTYPE html><html lang="de"><meta charset="utf-8"><title>Fehler</title><link rel="stylesheet" href="/static/app.css"><body><main class="auth-shell"><article class="auth-card"><h1>${esc(message)}</h1><p><a href="/">Zur Übersicht</a></p></article></main></body></html>`);
    }
  });
}

async function route(req, res, db, config) {
  const url = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);
  const method = req.method || 'GET';
  if (method === 'GET' && url.pathname.startsWith('/static/')) return serveStatic(res, config.root, url.pathname);
  if (method === 'GET' && url.pathname === '/gesundheit') return sendJson(res, 200, { ok: true, service: 'projekt-ex-intern' });

  if (url.pathname.startsWith('/api/hooks/')) return hooks(req, res, db, config, method, url);

  const cookies = parseCookies(req.headers.cookie || '');
  const session = loadSession(db, cookies);
  const dataset = getDataset(db);
  const users = countUsers(db);

  if (method === 'GET' && url.pathname === '/setup') {
    if (users) return redirect(res, '/anmelden');
    const token = issueLogin(res, config, req);
    return sendHtml(res, 200, setupView({ error: '', csrf: token, dataset }));
  }
  if (method === 'POST' && url.pathname === '/setup') {
    if (users) throw httpError(409, 'Die Einrichtung ist bereits abgeschlossen.');
    assertOrigin(req);
    const body = await readForm(req);
    if (!loginTokenOk(cookies, body.csrf, config.sessionSecret)) throw httpError(403, 'Das Formular ist abgelaufen. Bitte neu laden.');
    if (!isEmail(normalizeEmail(body.email))) throw httpError(400, 'E-Mail-Adresse ist ungültig.');
    if (!passwordOk(body.password, body.email) || body.password !== body.password2) throw httpError(400, 'Passwort muss mindestens 12 Zeichen haben und darf nicht der E-Mail entsprechen.');
    if (!String(body.name || '').trim()) throw httpError(400, 'Name fehlt.');
    const user = await createUser(db, { email: body.email, password: body.password, displayName: body.name });
    return startSession(res, db, config, user, '/');
  }
  if (method === 'GET' && url.pathname === '/anmelden') {
    if (!users) return redirect(res, '/setup');
    if (session) return redirect(res, safeNext(url.searchParams.get('next')));
    const token = issueLogin(res, config, req);
    return sendHtml(res, 200, loginView({ error: '', csrf: token, dataset, next: safeNext(url.searchParams.get('next')) }));
  }
  if (method === 'POST' && url.pathname === '/anmelden') {
    assertOrigin(req);
    const body = await readForm(req);
    if (!loginTokenOk(cookies, body.csrf, config.sessionSecret)) throw httpError(403, 'Das Formular ist abgelaufen. Bitte neu laden.');
    const email = normalizeEmail(body.email);
    const ip = req.socket.remoteAddress || '';
    if (tooManyAttempts(db, config.sessionSecret, email, ip)) throw httpError(429, 'Zu viele Versuche. Bitte später erneut versuchen.');
    const user = findUserByEmail(db, email);
    const ok = user ? await verifyPassword(body.password || '', user.password_hash) : false;
    if (!user) await verifyPassword(body.password || 'placeholder-password', 'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    if (!user || !ok) {
      recordLoginFailure(db, config.sessionSecret, email, ip);
      const token = issueLogin(res, config, req);
      return sendHtml(res, 401, loginView({ error: 'E-Mail oder Passwort ist nicht richtig.', csrf: token, dataset, next: safeNext(body.next) }));
    }
    clearAttempts(db, config.sessionSecret, email, ip);
    return startSession(res, db, config, user, safeNext(body.next));
  }
  if (method === 'POST' && url.pathname === '/abmelden') {
    assertOrigin(req);
    if (session) {
      assertCsrf(session, await readForm(req), config);
      deleteSession(db, session.id);
    }
    res.setHeader('Set-Cookie', clearCookie('px_session', config.secureCookies));
    return redirect(res, '/anmelden');
  }

  if (!session) {
    if (url.pathname.startsWith('/api/')) throw httpError(401, 'Anmeldung erforderlich.');
    return redirect(res, `/anmelden?next=${encodeURIComponent(safeNext(url.pathname + url.search))}`);
  }
  const ctx = {
    session, dataset, hint: url.searchParams.get('hinweis') || '',
    csrf: csrfToken(session.csrf_secret, config.sessionSecret),
  };

  if (method === 'GET' && url.pathname === '/') return sendHtml(res, 200, dashboardView(ctx, dashboardMetrics(db, dataset)));
  if (method === 'GET' && (url.pathname === '/bots' || url.pathname === '/bots/')) return redirect(res, '/bots/gespraeche');
  if (method === 'GET' && url.pathname === '/bots/gespraeche') {
    const channel = enumParam(url.searchParams.get('kanal'), ['', 'whatsapp', 'phone', 'webchat', 'email']);
    const topic = String(url.searchParams.get('thema') || '').slice(0, 80);
    const page = pageNo(url.searchParams.get('seite'));
    const limit = 40;
    const data = listConversations(db, dataset, { channel, topic, limit, offset: (page - 1) * limit });
    const pages = Math.max(1, Math.ceil(data.total / limit));
    return sendHtml(res, 200, conversationsView(ctx, { ...data, channel, topic, page, pages }));
  }
  const conversationMatch = url.pathname.match(/^\/bots\/gespraeche\/([0-9a-f-]{36}|ex-[a-z0-9-]+)$/i);
  if (method === 'GET' && conversationMatch) {
    const detail = getConversation(db, dataset, conversationMatch[1]);
    if (!detail) throw httpError(404, 'Gespräch nicht gefunden.');
    return sendHtml(res, 200, conversationView(ctx, detail));
  }
  if (method === 'GET' && url.pathname === '/bots/kennzahlen') {
    ctx.eventRows = listEvents(db, dataset, { limit: 40 });
    return sendHtml(res, 200, metricsView(ctx, dashboardMetrics(db, dataset)));
  }
  if (method === 'GET' && url.pathname === '/bots/fehler') return sendHtml(res, 200, errorsView(ctx, recentReceipts(db)));
  if (method === 'GET' && url.pathname === '/bots/verbindungen') return sendHtml(res, 200, connectionsView(ctx, providerStatus(config)));

  if (method === 'GET' && url.pathname === '/kunden') {
    const q = String(url.searchParams.get('q') || '').slice(0, 120);
    const page = pageNo(url.searchParams.get('seite'));
    const limit = 50;
    const data = listContacts(db, dataset, { q, limit, offset: (page - 1) * limit });
    return sendHtml(res, 200, customersView(ctx, { ...data, q, page, pages: Math.max(1, Math.ceil(data.total / limit)) }));
  }
  if (method === 'POST' && url.pathname === '/kunden') {
    const body = await readForm(req);
    assertOrigin(req);
    assertCsrf(session, body, config);
    const name = String(body.name || '').trim();
    if (!name) return back(res, '/kunden?hinweis=ungueltig');
    try {
      txRun(db, () => upsertContact(db, {
        dataset, displayName: name, organization: body.organisation || '', email: body.email || '', phone: body.telefon || '',
      }));
    } catch (error) {
      if (error.status) return back(res, '/kunden?hinweis=ungueltig');
      throw error;
    }
    return back(res, '/kunden?hinweis=kontakt');
  }
  const customerMatch = url.pathname.match(/^\/kunden\/([0-9a-f-]{36}|ex-c-\d+)$/i);
  if (method === 'GET' && customerMatch) {
    const detail = getContact(db, dataset, customerMatch[1]);
    if (!detail) throw httpError(404, 'Kontakt nicht gefunden.');
    return sendHtml(res, 200, customerView(ctx, detail));
  }
  const appointmentMatch = url.pathname.match(/^\/kunden\/([0-9a-f-]{36}|ex-c-\d+)\/termine$/i);
  if (method === 'POST' && appointmentMatch) {
    const body = await readForm(req);
    assertOrigin(req);
    assertCsrf(session, body, config);
    const detail = getContact(db, dataset, appointmentMatch[1]);
    if (!detail) throw httpError(404, 'Kontakt nicht gefunden.');
    try {
      txRun(db, () => createAppointment(db, {
        dataset, contactId: detail.contact.id, title: String(body.titel || '').trim(),
        startsAt: parseLocal(body.beginn), endsAt: parseLocal(body.ende),
        channel: enumParam(body.kanal, ['whatsapp', 'phone', 'webchat', 'email']), notes: body.notiz || '',
      }));
    } catch (error) {
      if (error.status) return back(res, `/kunden/${detail.contact.id}?hinweis=ungueltig`);
      throw error;
    }
    return back(res, `/kunden/${detail.contact.id}?hinweis=termin`);
  }

  if (method === 'GET' && url.pathname === '/auftraege') {
    return sendHtml(res, 200, ordersView(ctx, listOrders(db, dataset), contactsForSelect(db, dataset)));
  }
  if (method === 'POST' && url.pathname === '/auftraege') {
    const body = await readForm(req);
    assertOrigin(req);
    assertCsrf(session, body, config);
    const contact = getContact(db, dataset, body.kontakt);
    if (!contact) return back(res, '/auftraege?hinweis=ungueltig');
    try {
      createOrder(db, {
        dataset, contactId: contact.contact.id, title: String(body.titel || '').trim(),
        status: enumParam(body.status, ['unconfirmed', 'confirmed', 'in_progress', 'completed']),
        amountCents: parseEuro(body.betrag), orderedAt: parseDate(body.datum),
      });
    } catch (error) {
      if (error.status) return back(res, '/auftraege?hinweis=ungueltig');
      throw error;
    }
    return back(res, '/auftraege?hinweis=auftrag');
  }

  if (method === 'GET' && url.pathname === '/inhalte') {
    const kind = enumParam(url.searchParams.get('art'), ['', 'page', 'offer', 'shop']);
    return sendHtml(res, 200, cmsListView(ctx, listCms(db, dataset, kind), kind));
  }
  if (method === 'GET' && url.pathname === '/inhalte/neu') return sendHtml(res, 200, cmsFormView(ctx, null));
  if (method === 'POST' && url.pathname === '/inhalte') {
    const body = await readForm(req);
    assertOrigin(req);
    assertCsrf(session, body, config);
    if (body.status) throw httpError(400, 'Veröffentlichung ist nicht möglich.');
    try {
      const id = saveCms(db, cmsInput(body, { dataset, userId: session.user_id }));
      return back(res, `/inhalte/${id}?hinweis=gespeichert`);
    } catch (error) {
      const normalized = normalizeWriteError(error);
      if (normalized.status) return sendHtml(res, normalized.status, cmsFormView(ctx, bodyToDoc(body), normalized.message));
      throw error;
    }
  }
  const cmsMatch = url.pathname.match(/^\/inhalte\/([0-9a-f-]{36}|ex-cms-\d+)$/i);
  if (method === 'GET' && cmsMatch) {
    const doc = getCms(db, dataset, cmsMatch[1]);
    if (!doc) throw httpError(404, 'Entwurf nicht gefunden.');
    return sendHtml(res, 200, cmsFormView({ ...ctx, hint: ctx.hint }, doc));
  }
  if (method === 'POST' && cmsMatch) {
    const body = await readForm(req);
    assertOrigin(req);
    assertCsrf(session, body, config);
    if (body.status || body.veroeffentlichen) throw httpError(400, 'Veröffentlichung ist nicht möglich.');
    const doc = getCms(db, dataset, cmsMatch[1]);
    if (!doc) throw httpError(404, 'Entwurf nicht gefunden.');
    try {
      saveCms(db, cmsInput(body, { id: doc.id, dataset, userId: session.user_id }));
    } catch (error) {
      const normalized = normalizeWriteError(error);
      if (normalized.status) return sendHtml(res, normalized.status, cmsFormView(ctx, { ...doc, ...bodyToDoc(body) }, normalized.message));
      throw error;
    }
    return back(res, `/inhalte/${doc.id}?hinweis=gespeichert`);
  }
  const previewMatch = url.pathname.match(/^\/vorschau\/([0-9a-f-]{36}|ex-cms-\d+)$/i);
  if (method === 'GET' && previewMatch) {
    const doc = getCms(db, dataset, previewMatch[1]);
    if (!doc) throw httpError(404, 'Entwurf nicht gefunden.');
    return sendHtml(res, 200, previewView(ctx, doc));
  }

  if (method === 'GET' && url.pathname === '/freigaben') {
    ctx.audit = recentAudit(db);
    return sendHtml(res, 200, approvalsView(ctx, listApprovals(db, dataset), contactsForSelect(db, dataset)));
  }
  if (method === 'POST' && url.pathname === '/freigaben') {
    const body = await readForm(req);
    assertOrigin(req);
    assertCsrf(session, body, config);
    const contact = getContact(db, dataset, body.kontakt);
    if (!contact || !String(body.text || '').trim()) return back(res, '/freigaben?hinweis=ungueltig');
    try {
      txRun(db, () => createOutboundDraft(db, {
        dataset, channel: enumParam(body.kanal, ['email', 'whatsapp', 'phone', 'webchat']),
        contactId: contact.contact.id, body: String(body.text), userId: session.user_id, subject: body.betreff || '',
      }));
    } catch (error) {
      if (error.status) return back(res, '/freigaben?hinweis=ungueltig');
      throw error;
    }
    return back(res, '/freigaben?hinweis=entwurf');
  }
  const approvalMatch = url.pathname.match(/^\/freigaben\/([0-9a-f-]{36}|ex-approval-\d+)$/);
  if (method === 'POST' && approvalMatch) {
    const body = await readForm(req);
    assertOrigin(req);
    assertCsrf(session, body, config);
    try {
      decideApproval(db, { dataset, id: approvalMatch[1], userId: session.user_id, decision: body.entscheidung });
    } catch (error) {
      if (error.status === 409) return back(res, '/freigaben?hinweis=schon');
      if (error.status) return back(res, '/freigaben?hinweis=ungueltig');
      throw error;
    }
    return back(res, '/freigaben?hinweis=entschieden');
  }

  if (method === 'POST' && url.pathname === '/modus') {
    const body = await readForm(req);
    assertOrigin(req);
    assertCsrf(session, body, config);
    setDataset(db, body.dataset, session.user_id);
    return back(res, '/?hinweis=modus');
  }

  if (method === 'GET' && url.pathname === '/api/metriken') return sendJson(res, 200, dashboardMetrics(db, dataset));
  if (method === 'GET' && url.pathname === '/api/verbindungen') {
    return sendJson(res, 200, { providers: providerStatus(config).map(({ id, label, configured, state, badge }) => ({ id, label, configured, state, badge })) });
  }

  throw httpError(404, 'Seite nicht gefunden.');
}

async function hooks(req, res, db, config, method, url) {
  if (method === 'GET' && url.pathname === '/api/hooks/meta/whatsapp') {
    const challenge = verifyMetaChallenge(config, url.searchParams);
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
    res.end(challenge);
    return;
  }
  if (method !== 'POST') throw httpError(405, 'Methode nicht erlaubt.');
  const raw = await readRaw(req, 256 * 1024);
  const type = req.headers['content-type'] || '';
  if (!type.includes('application/json')) throw httpError(415, 'JSON wird erwartet.');
  let result;
  if (url.pathname === '/api/hooks/telephone') result = ingestTelephone(db, config, req, raw);
  else if (url.pathname === '/api/hooks/email') result = ingestEmail(db, config, req, raw);
  else if (url.pathname === '/api/hooks/webchat') result = ingestWebchat(db, config, req, raw);
  else if (url.pathname === '/api/hooks/meta/whatsapp') result = ingestMeta(db, config, req, raw);
  else throw httpError(404, 'Webhook nicht gefunden.');
  sendJson(res, result.duplicate ? 200 : 202, { ok: true, duplicate: Boolean(result.duplicate), accepted: Boolean(result.accepted) });
}

function loadSession(db, cookies) {
  if (!cookies.px_session) return null;
  const session = findSession(db, sha256(cookies.px_session));
  if (!session) return null;
  return touchSession(db, session);
}

function startSession(res, db, config, user, next) {
  const token = newToken();
  createSession(db, user.id, sha256(token));
  res.setHeader('Set-Cookie', [
    cookieHeader('px_session', token, { maxAge: 60 * 60 * 12, secure: config.secureCookies }),
    clearCookie('px_login', config.secureCookies),
  ]);
  return redirect(res, next || '/');
}

function issueLogin(res, config, req) {
  // Ein zweites Laden derselben Seite darf das Formular nicht entwerten.
  const existing = parseCookies(req.headers.cookie || '').px_login;
  const reusable = typeof existing === 'string' && /^[\w-]{20,200}$/.test(existing);
  const nonce = reusable ? existing : newToken();
  const token = hmac(config.sessionSecret, nonce);
  if (!reusable) {
    const cookie = cookieHeader('px_login', nonce, { maxAge: 600, secure: config.secureCookies });
    res.appendHeader?.('Set-Cookie', cookie);
    if (!res.appendHeader) res.setHeader('Set-Cookie', cookie);
  }
  return token;
}

function loginTokenOk(cookies, token, secret) {
  if (!cookies.px_login || !token) return false;
  return safeEqual(hmac(secret, cookies.px_login), token);
}

function assertCsrf(session, body, config) {
  const expected = csrfToken(session.csrf_secret, config.sessionSecret);
  if (!safeEqual(expected, body.csrf || '')) throw httpError(403, 'Das Formular ist abgelaufen. Bitte neu laden.');
}

function assertOrigin(req) {
  const site = req.headers['sec-fetch-site'];
  if (site && !['same-origin', 'same-site', 'none'].includes(site)) throw httpError(403, 'Herkunft abgelehnt.');
  const origin = req.headers.origin;
  if (!origin || origin === 'null') return;
  let host = '';
  try { host = new URL(origin).host; } catch { throw httpError(403, 'Herkunft abgelehnt.'); }
  if (host !== req.headers.host) throw httpError(403, 'Herkunft abgelehnt.');
}

function safeNext(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || value.includes('://')) return '/';
  return value;
}

function enumParam(value, allowed) {
  const text = String(value || '');
  if (!allowed.includes(text)) throw httpError(400, 'Wert ist ungültig.');
  return text;
}

function pageNo(value) {
  const number = Number(value || 1);
  if (!Number.isInteger(number) || number < 1 || number > 10000) return 1;
  return number;
}

function parseEuro(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) throw httpError(400, 'Betrag fehlt.');
  const normalized = trimmed.replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw httpError(400, 'Betrag ist ungültig.');
  return Math.round(Number(normalized) * 100);
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) throw httpError(400, 'Datum ist ungültig.');
  return `${value}T10:00:00.000Z`;
}

function parseLocal(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(value || ''))) throw httpError(400, 'Zeit ist ungültig.');
  return `${value}:00`;
}

function slugify(value) {
  const mapped = String(value || '').toLowerCase().replaceAll('ä', 'ae').replaceAll('ö', 'oe').replaceAll('ü', 'ue').replaceAll('ß', 'ss');
  const slug = mapped.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw httpError(400, 'Kurzadresse ist ungültig.');
  return slug;
}

function cmsInput(body, { id, dataset, userId }) {
  const title = String(body.titel || '').trim().slice(0, 160);
  if (!title) throw httpError(400, 'Titel fehlt.');
  const kind = enumParam(body.art, ['page', 'offer', 'shop']);
  return {
    id, dataset, userId, kind, title,
    slug: slugify(body.slug || title),
    summary: String(body.kurz || '').slice(0, 400),
    body: String(body.text || '').slice(0, 20000),
    priceCents: kind === 'shop' && String(body.preis || '').trim() ? parseEuro(body.preis) : null,
  };
}

function bodyToDoc(body) {
  return { kind: body.art, slug: body.slug, title: body.titel, summary: body.kurz, body: body.text, price_cents: null };
}

async function readRaw(req, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw httpError(413, 'Anfrage ist zu groß.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readForm(req) {
  const raw = await readRaw(req, 200 * 1024);
  const type = req.headers['content-type'] || '';
  if (type.includes('application/json')) {
    try { return JSON.parse(raw.toString('utf8')); } catch { throw httpError(400, 'JSON ist ungültig.'); }
  }
  return Object.fromEntries(new URLSearchParams(raw.toString('utf8')));
}

function serveStatic(res, root, pathname) {
  let rel = pathname.slice('/static/'.length);
  try { rel = decodeURIComponent(rel); } catch { throw httpError(400, 'Pfad ist ungültig.'); }
  if (rel.includes('\0') || rel.includes('..')) throw httpError(400, 'Pfad ist ungültig.');
  const pub = path.resolve(root, 'public');
  const full = path.resolve(pub, rel);
  if (!full.startsWith(pub + path.sep)) throw httpError(400, 'Pfad ist ungültig.');
  if (!existsSync(full) || !statSync(full).isFile()) throw httpError(404, 'Datei nicht gefunden.');
  const type = TYPES[path.extname(full)] || 'application/octet-stream';
  res.writeHead(200, securityHeaders({ 'content-type': type, 'cache-control': 'public, max-age=3600' }));
  return pipeline(createReadStream(full), res);
}

function securityHeaders(extra = {}) {
  return {
    'content-security-policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
    'x-frame-options': 'DENY',
    'x-robots-tag': 'noindex, nofollow',
    'cache-control': 'no-store',
    ...extra,
  };
}

function sendHtml(res, status, html) {
  res.writeHead(status, securityHeaders({ 'content-type': 'text/html; charset=utf-8' }));
  res.end(html);
}

function sendJson(res, status, payload) {
  res.writeHead(status, securityHeaders({ 'content-type': 'application/json; charset=utf-8' }));
  res.end(JSON.stringify(payload));
}

function redirect(res, location) {
  res.writeHead(303, securityHeaders({ location }));
  res.end();
}

function back(res, location) {
  return redirect(res, location);
}

function normalizeWriteError(error) {
  if (error.status) return error;
  if (String(error.message || '').includes('UNIQUE')) {
    return httpError(400, 'Diese Kurzadresse ist in dieser Ansicht schon vergeben.');
  }
  return error;
}
