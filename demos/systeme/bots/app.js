// Projekt EP · Shop-Raum · Raum „Bots“ (Entwurf A, freigegeben 01.11.2026) · BEISPIELDATEN, Du-Form, keine Preise
import { ic } from './icons.js';
import { LINKS, CAPTURE, TEMPO, login, now, nowMin, hm, TAG, loadBase, BASE, mitarbeiter, artikel, bestand, rueckrufer, ini, items, SCRIPTS, store, STATS0 } from './data.js';

const app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const TG = { auftrag: 'Lukrativer Auftrag', wichtig: 'Wichtig', relevant: 'Relevant', routine: 'Routine' };
const tg = (k, short) => `<span class="tg ${k}">${short && k === 'auftrag' ? 'Lukrativ' : TG[k]}</span>`;
const KAN = { tel: 'Telefon', chat: 'Chat', mail: 'E-Mail' };
const kan = (k) => `<span class="kanal ${k}" title="${KAN[k] || k}">${ic(k === 'wa' ? 'wa' : k)}</span>`;
const ADR = 'Chef';
const me = () => { const L = login.get(); return { name: L?.name || 'Eugen', ini: ini(L?.name || 'Eugen K'), rolle: L?.rolle === 'ma' ? 'Mitarbeitende' : 'Geschäftsführung', da: !!L }; };

// ---------------------------------------------------------------- Live-Ereignisse
const live = { evs: [], hero: null, heroUntil: 0, filter: 'alle', stufe: null, sel: null, chatDraft: '', simIdx: { tel: 0, chat: 0 } };
const byId = (id) => live.evs.find((e) => e.id === id) || items.find((i) => i.id === id);
let seq = 0;
function startEvent(key) {
  const sc = SCRIPTS[key]; if (!sc) return null;
  if (live.evs.some((e) => e.key === key && e.state === 'live')) return null;
  const ev = { id: 'live-' + key + '-' + (++seq), key, k: sc.k, wer: sc.wer, st: sc.st, sc: sc.sc, z: now(), sum: [], lines: [], pos: 0, state: 'live', mode: 'offen', live: true,
    status: sc.k === 'tel' ? 'Anruf läuft' : 'Chat läuft', meldung: sc.st === 'auftrag' || sc.st === 'wichtig' || sc.k === 'tel', wa: now(), script: sc, ctx: sc.ctx, kurz: sc.kurz, t0: Date.now() };
  live.evs.unshift(ev); items.unshift(ev);
  if (ev.k === 'tel') { live.hero = ev.id; }
  toast(`${sc.k === 'tel' ? 'Live-Anruf' : 'Neuer Chat'}: ${esc(sc.wer)}`, `Sofort-Meldung · per WhatsApp an dich gespiegelt · ${now()}`, `<a href="#" data-act="wa" data-id="${ev.id}">WhatsApp-Vorschau</a>`);
  later(ev, 700); render(); return ev;
}
function later(ev, ms) { clearTimeout(ev.timer); ev.timer = setTimeout(() => step(ev), ms * TEMPO); }
function step(ev) {
  if (ev.state !== 'live') return;
  const L = ev.script.lines; if (ev.pos >= L.length) return finish(ev);
  const [who, t0, sum, altT, altSum] = L[ev.pos++];
  if (who === 'lager') { const [name, size] = t0.split('|'); const b = bestand(name, size); ev.lager = b; ev.avail = !!(b && b.n > 0);
    ev.lines.push({ who: 'lager', t: b ? `Lager geprüft: ${b.name} · ${size}: ${b.n} Stück frei · Fach ${b.bin || '–'}` : 'Lager: Artikel nicht gefunden', z: now() }); render(); return later(ev, 900); }
  let t = ev.avail === false && altT ? altT : t0; const s = ev.avail === false && altSum ? altSum : sum;
  if (t === '__lager__') { const b = ev.lager; t = b && b.n > 0 ? `Ja, ${b.name} in ${b.size} ist da: ${b.n} Stück im Lager. ${ev.k === 'tel' ? 'Soll ich dir einen reservieren?' : 'Du kannst ihn direkt im Shop bestellen.'}` : `Gerade leider nicht – ${b?.name || 'der Artikel'} in ${b?.size || ''} ist ausverkauft. Ich kann dir Bescheid geben, sobald wieder Ware da ist.`; }
  const w = who === 'bot' && ev.mode === 'du' ? 'du' : who;
  ev.lines.push({ who: w, t, z: now() }); if (s) ev.sum.push(s);
  render(); later(ev, (who === 'bot' ? 2000 : 2600));
}
function finish(ev, why) {
  if (ev.state !== 'live') return; clearTimeout(ev.timer); ev.state = 'ende'; ev.live = false; ev.dauer = Math.max(1, Math.round((Date.now() - ev.t0) / 1000));
  ev.status = ev.mode === 'rueckruf' ? (ev.rueckruf ? 'Rückruf ' + ev.rueckruf : 'Rückruf geplant') : ev.mode === 'du' ? 'Von dir übernommen' : 'Bot hat Kontakt';
  ev.lines.push({ who: 'sys', t: why || (ev.k === 'tel' ? 'Anruf beendet' : 'Chat beendet') + ' · Transkript gespeichert', z: now() });
  const sc = ev.script; const lead = { id: 'l-' + ev.id, gid: ev.id, wer: ev.wer, k: ev.k, st: ev.st, sc: ev.sc, bedarf: sc.lead.bedarf + (ev.avail === false ? ' (gerade nicht vorrätig)' : ''), next: ev.rueckruf ? 'Rückruf ' + ev.rueckruf : sc.lead.next, quelle: sc.lead.quelle, z: ev.z, neu: true, um: now(), transkript: ev.lines.filter((l) => l.who !== 'sys').map((l) => ({ who: l.who, t: l.t })) };
  store.leads = store.leads.filter((l) => l.gid !== ev.id); store.leads.unshift(lead); store.saveLeads(); live.sel = lead.id;
  if (live.hero === ev.id) live.heroUntil = Date.now() + 9000;
  toast(`Lead angelegt: <b>${esc(ev.wer)}</b>`, `Lead-Liste · ${now()} · Quelle ${sc.lead.quelle}`, `<a href="#/leads/${lead.id}">In der Lead-Liste ansehen</a>`);
  render();
}
function decide(id, what, via) {
  const ev = live.evs.find((e) => e.id === id);
  if (what === 'cb') { location.hash = '#/rueckruf/' + id; return; }
  if (!ev || ev.state !== 'live') { location.hash = (byId(id)?.k === 'chat' ? '#/chat/' : '#/gespraech/') + id; return; }
  if (what === 'ran' || what === 'take') { ev.mode = 'du'; ev.lines.push({ who: 'sys', t: (ev.k === 'tel' ? (what === 'ran' ? 'Du bist rangegangen' : 'Du hast übernommen') + ' · der Bot schreibt weiter mit' : 'Du hast den Chat übernommen · der Bot ist still'), z: now() }); ev.status = ev.k === 'tel' ? 'Du sprichst' : 'Du schreibst'; if (ev.k === 'chat') clearTimeout(ev.timer); }
  if (what === 'bot') { ev.mode = 'bot'; ev.lines.push({ who: 'sys', t: 'Bot macht weiter · du hörst mit und kannst jederzeit übernehmen', z: now() }); }
  if (via) toast(`Antwort aus WhatsApp: <b>${{ ran: 'Rangehen', bot: 'Bot macht weiter', take: 'Übernehmen' }[what]}</b>`, 'Jeder Knopfdruck kommt ins Protokoll');
  location.hash = (ev.k === 'chat' ? '#/chat/' : '#/gespraech/') + id; render();
}
// Simulation: gelegentlich ein Anruf oder Chat (BEISPIELDATEN, alles lokal)
const POOL = { tel: ['brandt', 'parka', 'hartmann2'], chat: ['chat_chino', 'chat_film'] };
function simulate(kind) { const p = POOL[kind]; for (let i = 0; i < p.length; i++) { const key = p[(live.simIdx[kind] + i) % p.length]; if (!live.evs.some((e) => e.key === key && e.state === 'live')) { live.simIdx[kind] = (live.simIdx[kind] + i + 1) % p.length; return startEvent(key); } } return null; }
function autoSim() { if (CAPTURE) return; const busy = live.evs.some((e) => e.state === 'live' && e.k === 'tel'); const kind = busy || Math.random() < 0.45 ? 'chat' : 'tel'; if (!live.evs.some((e) => e.state === 'live' && e.k === kind)) simulate(kind); setTimeout(autoSim, 50000 + Math.random() * 40000); }

// ---------------------------------------------------------------- Kennzahlen
function stats() {
  const extra = live.evs; const s = { ...STATS0 };
  for (const e of extra) { s.ges++; s[e.k] = (s[e.k] || 0) + 1; s[e.st]++; }
  s.offen = items.filter((i) => i.meldung && (i.status === 'Meldung offen' || i.live)).length;
  return s;
}
const offeneMeldungen = () => items.filter((i) => i.meldung && (i.status === 'Meldung offen' || i.live));

// ---------------------------------------------------------------- Bausteine
function header() {
  const m = me(); const n = offeneMeldungen().length;
  const nav = [['stadt', 'city', 'Stadt'], ['lager', 'box', 'Lager'], ['dashboard', 'grid', 'Dashboard'], ['personal', 'users', 'Personal'], ['bots', 'bot', 'Bots']];
  return `<header class="top"><a class="brand" href="${LINKS.dashboard}" title="Zum Dashboard"><span class="brand-btn">${ic('bag')}</span><h1>Shop-Raum</h1></a>
  <nav class="seg mainnav" aria-label="Bereich wechseln">${nav.map(([k, i, t]) => k === 'bots' ? `<a href="#/" class="on" aria-current="page">${ic(i)}Bots &amp; Meldungen ${n ? `<span class="badge">${n}</span>` : ''}</a>` : `<a href="${LINKS[k]}">${t}</a>`).join('')}</nav>
  <div class="tr"><a class="pillb" href="#/rueckrufe" title="Rückrufe heute">${ic('clock')}<span class="num">${now()}</span></a>
  <span class="sample" role="note"><i></i><span>BEISPIELDATEN</span></span>
  <a class="av" href="${LINKS.login}" title="${m.da ? 'Angemeldet als ' + esc(m.name) + ' · ein Login für alle Bereiche' : 'Anmelden · ein Login für alle Bereiche'}">${esc(m.ini)}</a></div></header>`;
}
const SUB = [['', 'grid', 'Übersicht'], ['gespraeche', 'inbox', 'Gespräche'], ['leads', 'star', 'Leads'], ['verknuepfung', 'link', 'Verknüpfung'], ['rueckrufe', 'callback', 'Rückrufe']];
function subbar(cur) {
  return `<div class="subbar"><nav class="subnav" aria-label="Raum Bots">${SUB.map(([k, i, t]) => `<a href="#/${k}" class="${cur === k ? 'on' : ''}">${ic(i)}${t}</a>`).join('')}</nav>
  <div class="demo" role="group" aria-label="Simulation mit Beispieldaten"><span class="l">Simulation · BEISPIELDATEN</span><button type="button" data-act="sim-tel">${'Anruf auslösen'}</button><button type="button" data-act="sim-chat">Chat auslösen</button><button type="button" data-act="wa">WhatsApp-Vorschau</button></div></div>`;
}
function tabbar(cur) { const n = offeneMeldungen().length; return `<nav class="tabbar" aria-label="Raum Bots">${SUB.map(([k, i, t]) => `<a href="#/${k}" class="${cur === k ? 'on' : ''}">${ic(i)}${t}${k === '' && n ? `<span class="badge">${n}</span>` : ''}</a>`).join('')}</nav>`; }
const wave = (n = 46) => `<div class="wave" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i style="height:${8 + Math.round(Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 24)}px;animation-delay:${(i % 9) * 0.09}s"></i>`).join('')}</div>`;
function callCard(ev) {
  const sc = ev.script; const sec = Math.max(0, Math.round((Date.now() - ev.t0) / 1000) + 48); const dur = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const ended = ev.state !== 'live';
  const btns = ended ? `<a class="btn sec" href="#/gespraech/${ev.id}">${ic('note')}Transkript ansehen</a><a class="btn ghost" href="#/leads/l-${ev.id}">${ic('star')}Zum Lead</a>`
    : ev.mode === 'offen' ? `<button class="btn pri" data-act="ran" data-id="${ev.id}">${ic('take')}Rangehen</button><button class="btn sec" data-act="bot" data-id="${ev.id}">${ic('bot')}Bot macht weiter</button><button class="btn sec" data-act="cb" data-id="${ev.id}">${ic('callback')}Ich rufe zurück</button>`
    : ev.mode === 'bot' ? `<button class="btn pri" data-act="take" data-id="${ev.id}">${ic('take')}Jetzt übernehmen</button><a class="btn sec sel" href="#/gespraech/${ev.id}">${ic('bot')}Bot macht weiter · mithören</a><button class="btn sec" data-act="cb" data-id="${ev.id}">${ic('callback')}Ich rufe zurück</button>`
    : `<a class="btn pri" href="#/gespraech/${ev.id}">${ic('take')}Du sprichst · Gespräch öffnen</a><button class="btn sec" data-act="hang" data-id="${ev.id}">${ic('hang')}Auflegen</button>`;
  return `<section class="card call" aria-live="polite"><div class="ring">${ic('tel')}</div><div>
    <div class="row">${ended ? `<span class="live ok"><i></i>Anruf beendet · ${esc(ev.status)}</span>` : `<span class="live"><i></i>Live · Anruf seit ${dur}</span>`}<span class="eye hide-m">Sofort-Meldung · Telefon</span></div>
    <h2>${sc.titel(ADR)}</h2>
    <div class="row" style="flex-wrap:wrap;gap:8px">${tg(ev.st)}<span class="chip">Score <b>${ev.sc}/100</b></span>${sc.dringend ? '<span class="tg wichtig">Dringend</span>' : ''}<span class="chip">${ev.mode === 'offen' ? 'Bot spricht gerade' : ev.mode === 'bot' ? 'Bot macht weiter' : ev.mode === 'du' ? 'Du sprichst' : 'Rückruf geplant'}</span></div>
    <div class="acts">${btns}</div>
    <div class="foot"><span>${ic('wa')}WhatsApp an dich zugestellt · ${ev.wa}</span><span>${ic('mail')}E-Mail-Ersatz bereit</span><span>${ic('shield')}Jeder Knopfdruck kommt ins Protokoll</span><button class="chip wa-open" data-act="wa" data-id="${ev.id}">${ic('wa')}WhatsApp-Vorschau</button></div></div></section>`;
}
function idleCard() {
  return `<section class="card call idle"><div class="ring" style="background:radial-gradient(circle,rgba(162,173,151,.25),transparent 70%)">${ic('bot')}</div><div>
   <span class="live ok"><i></i>Telefonbot nimmt ab · Chatbot ist online</span><h2 style="font-size:22px">Gerade kein Live-Anruf. Sobald jemand anruft, erscheint hier die große Anrufkarte mit drei Knöpfen.</h2>
   <div class="acts"><button class="btn sec" data-act="sim-tel">${ic('tel')}Beispiel-Anruf auslösen</button><a class="btn ghost" href="#/gespraeche">${ic('inbox')}Alle Gespräche</a></div></div></section>`;
}
function botHeute(s) {
  const mx = Math.max(s.chat, s.mail, s.tel);
  return `<section class="card"><div class="ch">${ic('bot')}Bot heute<span class="meta">seit 00:00</span></div>
   <div class="row" style="gap:16px;margin:4px 0 6px"><div class="big num">${s.selbst} %</div><div class="meta">selbst gelöst<br>${s.ges} Gespräche</div></div>
   <div class="bars">${[['chat', 'Chat', 'var(--sage)'], ['mail', 'E-Mail', 'var(--amber)'], ['tel', 'Telefon', 'var(--coral)']].map(([k, t, c]) => `<div class="b"><span class="row" style="gap:6px">${ic(k)}${t}</span><div class="bar"><i style="width:${(s[k] / mx) * 100}%;background:${c}"></i></div><b class="num">${s[k]}</b></div>`).join('')}</div></section>`;
}
function botCard(kind) {
  const evs = live.evs.filter((e) => e.k === kind && e.state === 'live'); const recent = items.filter((i) => i.k === kind).slice(0, 3);
  const pct = kind === 'chat' ? 86 : 72; const name = kind === 'chat' ? 'Chatbot' : 'Telefonbot';
  return `<section class="card botcard"><div class="ch"><span class="kanal ${kind}">${ic(kind)}</span>${name}<span class="meta">${evs.length ? `<span class="live"><i></i>${evs.length} ${kind === 'chat' ? (evs.length > 1 ? 'Chats' : 'Chat') : (evs.length > 1 ? 'Anrufe' : 'Anruf')} live</span>` : '<span class="live ok"><i></i>bereit</span>'}</span></div>
   <div class="row" style="gap:12px;align-items:flex-end"><div class="big num" style="font-size:34px">${pct} %</div><div class="meta" style="padding-bottom:4px">selbst gelöst heute</div></div>
   <div class="bar" style="margin:8px 0 6px"><i style="width:${pct}%;background:var(--sage)"></i></div>
   <div class="rows">${recent.map((i) => `<a class="act" href="#/${kind === 'chat' ? 'chat' : 'gespraech'}/${i.id}">${kan(i.k)}<span class="w">${esc(i.wer)}</span><span class="r">${i.live ? `<span class="live" style="font-size:10.5px;letter-spacing:.06em"><i></i>${esc(i.status)}</span>` : esc(i.status) + ' · ' + i.z}</span></a>`).join('')}</div></section>`;
}
function kpis(s) {
  const K = [['auftrag', 'Lukrative Aufträge', 'star', 'var(--sage-bg)', '#4b5a43'], ['wichtig', 'Wichtig', 'alert', 'var(--coral-bg)', 'var(--coral-ink)'], ['relevant', 'Relevant', 'user', 'var(--amber-bg)', 'var(--amber-ink)'], ['routine', 'Routine', 'check', 'var(--sand-bg)', 'var(--ink-2)']];
  return `<div class="grid kpis">${K.map(([k, t, i, bg, c]) => `<button class="card kpi ${live.stufe === k ? 'sel' : ''}" data-act="stufe" data-k="${k}"><span class="ico" style="background:${bg};color:${c}">${ic(i)}</span><span><b class="num">${s[k]}</b><div class="meta">${t}</div></span></button>`).join('')}
   <button class="card kpi" data-act="wa" style="border:1.5px solid rgba(43,35,31,.7)"><span class="ico" style="background:var(--coral-bg);color:var(--coral-ink)">${ic('bell')}</span><span><b class="num">${s.offen}</b><div class="meta">Offene Sofort-Meldungen</div></span></button></div>`;
}
function liste(limit) {
  let L = items.filter((i) => live.filter === 'alle' || i.k === live.filter); if (live.stufe) L = L.filter((i) => i.st === live.stufe);
  const n = (k) => items.filter((i) => i.k === k).length;
  return `<section class="card"><div class="ch">${ic('inbox')}Alle Gespräche · heute${live.stufe ? ` <button class="chip" data-act="stufe" data-k="${live.stufe}">${TG[live.stufe]} ✕</button>` : ''}
   <div class="filters">${[['alle', 'Alle', items.length], ['tel', 'Telefon', n('tel')], ['chat', 'Chat', n('chat')], ['mail', 'E-Mail', n('mail')]].map(([k, t, c]) => `<button class="${live.filter === k ? 'on' : ''}" data-act="filter" data-k="${k}">${k !== 'alle' ? ic(k) : ''}${t} <span class="muted">${c}</span></button>`).join('')}</div></div>
   <div class="th"><span>Kanal</span><span>Zeit</span><span>Wer</span><span>Zusammenfassung</span><span>Stufe</span><span class="st">Status</span><span></span></div>
   <div class="rows">${(limit ? L.slice(0, limit) : L).map((i) => `<a class="li ${i.live ? 'neu' : ''}" href="#/${i.k === 'chat' ? 'chat' : 'gespraech'}/${i.id}">${kan(i.k)}<span class="z num">${i.z}</span><span class="w">${esc(i.wer)}</span><span class="s">${esc(i.kurz || i.sum)}</span><span class="tgc">${tg(i.st, true)}</span><span class="st ${i.live ? 'live' : ''}">${i.live ? '<i></i>' : ''}${esc(i.status)}</span><span class="chev muted">${ic('chev')}</span></a>`).join('') || '<p class="meta" style="padding:12px">Keine Gespräche in diesem Filter.</p>'}</div></section>`;
}
function meldungen() {
  const M = offeneMeldungen().filter((i) => i.id !== live.hero || live.evs.find((e) => e.id === i.id)?.state !== 'live');
  return `<section class="card"><div class="ch">${ic('bell')}Weitere Sofort-Meldungen<span class="meta">${M.length} offen</span></div>
   ${M.map((i) => `<div class="mini"><div class="row">${kan(i.k)}<b style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(i.wer)}</b><span style="margin-left:auto">${tg(i.st, true)}</span></div><p>${esc(i.kurz || i.sum)}</p>
     <div class="row" style="gap:8px"><button class="btn sec sm" style="flex:1" data-act="${i.live ? 'take' : 'open'}" data-id="${i.id}">Übernehmen</button><button class="btn sec sm" style="flex:1" data-act="cb" data-id="${i.id}">Zurückrufen</button></div>
     <div class="meta" style="margin-top:8px;display:flex;gap:6px;align-items:center">${ic('wa')}WhatsApp zugestellt ${i.wa || i.z}${i.mail ? ' · ' + esc(i.mail) : ''}</div></div>`).join('') || '<p class="meta">Alles erledigt. Neue Meldungen erscheinen hier und per WhatsApp.</p>'}</section>`;
}

// ---------------------------------------------------------------- Ansichten
function vUebersicht() {
  const s = stats(); const h = live.evs.find((e) => e.id === live.hero && (e.state === 'live' || Date.now() < live.heroUntil));
  return `<div class="grid hero">${h ? callCard(h) : idleCard()}${botHeute(s)}</div>
   <div class="grid two" style="margin-top:16px">${botCard('chat')}${botCard('tel')}</div>
   <div style="margin-top:16px">${kpis(s)}</div>
   <div class="grid main2" style="margin-top:16px">${liste(8)}${meldungen()}</div>`;
}
function vGespraeche() { return `<div class="grid main2">${liste()}${meldungen()}</div>`; }
const seen = {};
function lineHtml(l, chat, fr = '') {
  if (l.who === 'sys') return `<div class="sys ${fr}">${esc(l.t)} · ${l.z}</div>`;
  if (l.who === 'lager') return `<div class="lagerhint ${fr}">${ic('box')}<span>${esc(l.t)}</span><a class="meta" style="margin-left:auto" href="${LINKS.lager}">im Lager zeigen</a></div>`;
  const right = l.who === 'kunde' ? !chat : chat; // Telefon: Bot links, Anrufer rechts · Chat: Besucher links, Bot rechts
  const name = l.who === 'bot' ? (chat ? 'Chatbot' : 'Telefonbot') : l.who === 'du' ? 'Du' : (chat ? 'Besucher' : 'Anrufer');
  return `<div class="who ${right ? 'r' : ''} ${fr}">${name} · ${l.z}</div><div class="bub ${fr} ${right ? 'r' : 'l'} ${l.who === 'bot' ? 'bot' : ''} ${l.who === 'du' ? 'du r' : ''}">${esc(l.t)}</div>`;
}
function staticLines(i) { const z0 = i.z; return (i.lines || []).map(([who, t], n) => ({ who, t, z: hm(toMin(z0) + Math.floor(n / 2)) })); }
const toMin = (z) => { const [h, m] = z.split(':').map(Number); return h * 60 + m; };
function vGespraech(id, chat) {
  const i = byId(id); if (!i) return `<section class="card"><p>Dieses Gespräch gibt es nicht (mehr).</p><a class="btn sec" href="#/">Zur Übersicht</a></section>`;
  const ev = live.evs.find((e) => e.id === id); const lines = ev ? ev.lines : staticLines(i); const isLive = ev?.state === 'live';
  const sum = ev ? ev.sum : [i.sum]; const typing = isLive && !(ev.mode === 'du' && ev.k === 'chat');
  const chatMode = chat || i.k === 'chat'; const prev = seen[id] ?? lines.length; seen[id] = lines.length; const prevS = seen[id + ':s'] ?? sum.length; seen[id + ':s'] = sum.length;
  const deine = !ev ? `<div class="meta" style="margin-bottom:10px">${esc(i.status)} · ${i.z}</div><button class="btn sec wide" data-act="cb" data-id="${i.id}">${ic('callback')}Rückruf planen</button>`
    : isLive ? (ev.mode === 'du' ? (ev.k === 'tel' ? `<button class="btn sec wide sel">${ic('take')}Du sprichst</button><div class="meta" style="margin:8px 0">Der Bot schreibt mit und fasst zusammen.</div><button class="btn pri wide" data-act="hang" data-id="${id}">${ic('hang')}Auflegen</button>`
        : `<button class="btn sec wide sel">${ic('chat')}Du schreibst</button><div class="meta" style="margin:8px 0">Der Bot ist still, bis du den Chat beendest.</div><button class="btn pri wide" data-act="hang" data-id="${id}">${ic('check')}Chat beenden</button>`)
      : `${ev.mode === 'bot' ? `<button class="btn sec wide sel">${ic('bot')}Bot macht weiter</button>` : `<button class="btn sec wide" data-act="bot" data-id="${id}">${ic('bot')}Bot macht weiter</button>`}
        <div class="meta" style="margin:8px 0">Du kannst jederzeit übernehmen.</div><button class="btn pri wide" data-act="take" data-id="${id}">${ic('take')}Jetzt übernehmen</button>
        <button class="btn ghost wide" style="margin-top:8px" data-act="cb" data-id="${id}">${ic('callback')}Ich rufe zurück</button>`)
    : `<div class="meta" style="margin-bottom:10px">${esc(ev.status)} · Dauer ${Math.floor(ev.dauer / 60)}:${String(ev.dauer % 60).padStart(2, '0')}</div><a class="btn sec wide" href="#/leads/l-${ev.id}">${ic('star')}Zum Lead</a>`;
  return `<div class="grid main2"><section class="card"><div class="ch">${kan(i.k)}${esc(i.wer)}<span class="meta">${isLive ? `<span class="live"><i></i>${chatMode ? 'Chat live' : 'Transkript live'}</span>` : (i.k === 'mail' ? 'E-Mail' : 'Verlauf') + ' · ' + i.z}</span></div>
     ${i.k === 'tel' && isLive ? `<div class="row" style="margin-bottom:6px">${wave(60)}<span class="meta">${ev.mode === 'du' ? 'Du sprichst' : 'Bot spricht'}</span></div>` : ''}
     <div class="conv" id="conv">${lines.length ? lines.map((l, n) => lineHtml(l, chatMode, n >= prev ? 'fresh' : '')).join('') : `<p class="meta">${i.k === 'mail' ? 'E-Mail-Eingang. Der Bot hat sie gelesen, eingestuft und zusammengefasst:' : 'Kein Verlauf gespeichert.'}</p><div class="bub l" style="margin-top:8px">${esc(i.sum)}</div>`}
     ${typing ? `<div class="typing"><i></i><i></i><i></i> ${ev.mode === 'du' ? 'Bot schreibt mit …' : chatMode ? 'Chatbot tippt …' : 'Telefonbot hört zu …'}</div>` : ''}</div>
     ${chatMode ? `<form class="compose" data-form="chat" data-id="${i.id}"><input id="chatIn" name="t" autocomplete="off" placeholder="${ev?.mode === 'du' && isLive ? 'Schreib dem Besucher …' : 'Übernimm den Chat, um selbst zu schreiben'}" ${ev?.mode === 'du' && isLive ? '' : 'disabled'} value="${esc(live.chatDraft)}"><button class="btn pri" ${ev?.mode === 'du' && isLive ? '' : 'disabled'}>${ic('send')}Senden</button></form>` : ''}</section>
   <div class="grid" style="align-content:start"><section class="card"><div class="ch">${ic('note')}KI-Zusammenfassung</div><ul class="sumlist">${sum.length ? sum.map((s, n) => `<li class="${n >= prevS ? 'fresh' : ''}">${esc(s)}</li>`).join('') : '<li>Wird beim Zuhören erstellt …</li>'}</ul></section>
     <section class="card"><div class="ch">${ic('check')}Deine Wahl</div>${deine}</section>
     ${i.ctx || ev?.ctx ? `<section class="card"><div class="ch">${ic('user')}Kontext</div><ul class="checks">${(i.ctx || ev.ctx).map((c) => `<li>${ic('chev')}${esc(c)}</li>`).join('')}</ul></section>` : ''}
     ${ev?.lager ? `<section class="card"><div class="ch">${ic('box')}Aus dem Lager</div><div class="meta">${esc(ev.lager.name)} · ${esc(ev.lager.color || '')} · Größe ${esc(ev.lager.size)}</div><div class="row" style="margin-top:6px"><b class="big num" style="font-size:30px">${ev.lager.n}</b><span class="meta">Stück frei · Fach ${esc(ev.lager.bin || '–')}</span></div><a class="btn ghost sm" style="margin-top:10px" href="${LINKS.lager}">${ic('box')}Im Lager zeigen</a></section>` : ''}</div></div>`;
}
function vLeads(sel) {
  const L = store.leads; const cur = L.find((l) => l.id === (sel || live.sel)) || L[0];
  const tr = cur?.transkript || (cur?.gid ? (byId(cur.gid)?.lines ? (live.evs.find((e) => e.id === cur.gid)?.lines || staticLines(byId(cur.gid))) : []) : []);
  return `<div class="grid main2"><section class="card"><div class="ch">${ic('star')}Lead-Liste<span class="meta">aus Chat, Telefon und E-Mail · auch im Dashboard</span></div>
   <div class="rows">${L.map((l) => `<a class="lead ${l.neu ? 'neu' : ''} ${cur && l.id === cur.id ? 'on' : ''}" href="#/leads/${l.id}">${kan(l.k)}<span><b>${esc(l.wer)}</b>${l.neu ? '<span class="nb">NEU</span>' : ''}<div class="meta">${esc(l.quelle)} · ${l.um || l.z}</div></span><span>${tg(l.st, true)}</span><span class="meta s">${esc(l.next)}</span><span class="chev muted">${ic('chev')}</span></a>`).join('')}</div></section>
   ${cur ? `<section class="card" style="align-self:start"><div class="ch">${ic('note')}Lead-Karte<span class="meta">${cur.neu ? 'automatisch angelegt ' + cur.um : 'seit ' + cur.z}</span></div>
     <h2 style="font-size:20px;margin-bottom:10px">${esc(cur.wer)}</h2>
     <div class="kv"><span class="chip">Quelle: <b>${esc(cur.quelle)}</b></span><span class="chip">Score: <b>${cur.sc}</b></span>${tg(cur.st)}<span class="chip">Bedarf: <b>${esc(cur.bedarf)}</b></span><span class="chip">Nächster Schritt: <b>${esc(cur.next)}</b></span><span class="chip">Transkript: <b>${tr.length ? 'angehängt' : '–'}</b></span></div>
     ${tr.length ? `<div class="hair"></div><div class="eye" style="margin-bottom:6px">Transkript (Auszug)</div>${tr.filter((l) => l.who !== 'sys' && l.who !== 'lager').slice(0, 4).map((l) => `<div class="meta" style="margin:4px 0"><b style="color:var(--ink)">${l.who === 'bot' ? 'Bot' : l.who === 'du' ? 'Du' : 'Kunde'}:</b> ${esc(l.t)}</div>`).join('')}` : ''}
     <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap">${cur.gid ? `<a class="btn sec sm" href="#/${byId(cur.gid)?.k === 'chat' ? 'chat' : 'gespraech'}/${cur.gid}">${ic('note')}Verlauf öffnen</a>` : ''}<button class="btn pri sm" data-act="cb" data-id="${cur.gid || cur.id}">${ic('callback')}Rückruf planen</button><a class="btn ghost sm" href="${LINKS.dashboard}">${ic('grid')}Im Dashboard</a></div></section>` : ''}</div>`;
}
function vVerknuepfung() {
  const M = mitarbeiter(); const dienst = M.filter((m) => m.status === 'eingestempelt').length; const A = artikel(); const knapp = A.filter((a) => a.min && Object.values(a.stock || {}).reduce((s, v) => s + v, 0) < a.min).length;
  const lagerEv = live.evs.find((e) => e.lager); const b = lagerEv?.lager || bestand('Parka Nordwind', 'M'); const t = store.termine[0]; const rr = rueckrufer(); const m = me();
  return `<section class="card"><div class="ch">${ic('link')}Eine Datenbasis für Bots, Lager und Personal<span class="meta">Quelle: ${esc(BASE.quelle)}</span></div>
   <div class="net"><a class="card node" href="${LINKS.lager}"><div class="ic">${ic('box')}</div><b>Lager</b><div class="meta">${A.length} Artikel · ${knapp} knapp</div><div class="meta" style="margin-top:6px">Bots sehen den Bestand live</div></a>
    <div class="link"><span></span></div>
    <div class="card node c"><div class="ic">${ic('bot')}</div><b>Bots</b><div class="meta">Chat · Telefon · E-Mail · ${stats().ges} Gespräche heute</div><div class="meta" style="margin-top:6px">Leads landen im Dashboard</div></div>
    <div class="link"><span></span></div>
    <a class="card node" href="${LINKS.personal}"><div class="ic">${ic('users')}</div><b>Personal</b><div class="meta">${dienst} im Dienst · ${rr.length} können zurückrufen</div><div class="meta" style="margin-top:6px">Rückrufe landen im Schichtplan</div></a></div></section>
  <div class="grid two" style="margin-top:16px"><section class="card"><div class="ch">${ic('check')}So greift es ineinander</div><div class="rows">
    <div class="act">${kan('chat')}<span>Bot antwortet aus dem Lager: <b>${esc(b?.name || 'Parka Nordwind')} · ${esc(b?.size || 'M')}: ${b?.n ?? 0} Stück frei</b></span><span class="r">aus Lager</span></div>
    <div class="act">${kan('tel')}<span>${t ? `Rückruf <b>${esc(t.wer)}</b> → ${esc(t.ma_name)}, ${t.um}` : `Rückrufe gehen an Leute, die gerade im Dienst sind (${esc(rr.map((x) => x.anzeige).slice(0, 3).join(', '))})`}</span><span class="r">aus Personal</span></div>
    <div class="act">${kan('mail')}<span>Neue Leads sind in Bots und im Dashboard sichtbar: <b>${store.leads.filter((l) => l.neu).length} neu heute</b></span><span class="r">eine Liste</span></div></div></section>
   <section class="card"><div class="ch">${ic('shield')}Ein Login · ein Zugang für alles</div><div class="row"><span class="av" style="width:46px;height:46px">${esc(m.ini)}</span><div><b>${m.da ? 'Angemeldet als ' + esc(m.name) : 'Noch nicht angemeldet'}</b><div class="meta">${m.da ? esc(m.rolle) + ' · ' : ''}gilt für Stadt, Lager, Dashboard, Personal und Bots</div></div></div>
    <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap"><a class="btn sec sm" href="${LINKS.login}">${ic('user')}${m.da ? 'Rolle wechseln' : 'Anmelden'}</a><a class="btn ghost sm" href="${LINKS.plan}">${ic('cal')}Personal-Plan</a><a class="btn ghost sm" href="${LINKS.lager}">${ic('box')}Lager</a></div></section></div>`;
}
const pick = { slot: null, ma: null, gid: null };
function slots() { const n = nowMin(); const a = Math.ceil((n + 30) / 15) * 15; const S = [['+30', `In 30 Min. (${hm(a)})`, hm(a)]]; for (const z of ['14:30', '15:00', '16:00', '17:00']) if (toMin(z) > n + 30 && S.length < 4) S.push([z, z, z]); S.push(['morgen', 'Morgen 09:00', '09:00']); return S; }
function vRueckruf(id) {
  const i = byId(id) || store.leads.find((l) => l.id === id); if (!i) return vRueckrufe();
  const done = store.termine.find((t) => t.gid === id);
  if (pick.gid !== id) { pick.gid = id; const S = slots(); pick.slot = (S.find((s) => s[0] === '14:30') || S[0])[0]; const rr = rueckrufer(); pick.ma = (rr.find((m) => m.id === login.get()?.ma) || rr.find((m) => m.abteilung_id === 'gf') || rr[0])?.id; }
  const ev = live.evs.find((e) => e.id === id);
  if (done) return `<div class="grid main2"><section class="card done"><div class="ch">${ic('check')}Rückruf steht<span class="meta">${done.erstellt}</span></div><h2 style="font-size:22px;margin-bottom:8px">${esc(done.wer)} · ${done.tag === TAG() ? 'heute' : 'morgen'} ${done.um}</h2>
     <ul class="checks"><li>${ic('check')}${ev || i.k === 'tel' ? `Der Bot sagt Bescheid: „${esc(done.ma_name)} ruft dich um ${done.um} zurück.“` : 'Der Bot schickt die Bestätigung per Chat/E-Mail.'}</li><li>${ic('check')}Termin im Personal-Plan bei <b>${esc(done.ma_name)}</b> eingetragen</li><li>${ic('check')}Erinnerung 10 Min. vorher</li></ul>
     <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap"><a class="btn pri" href="${LINKS.plan}">${ic('cal')}Im Personal-Plan ansehen</a><a class="btn sec" href="#/rueckrufe">${ic('callback')}Alle Rückrufe</a><button class="btn ghost" data-act="cb-del" data-id="${done.id}">Rückruf löschen</button></div></section>${rrListe()}</div>`;
  const S = slots(); const rr = rueckrufer();
  return `<div class="grid main2"><section class="card"><div class="ch">${ic('callback')}Ich rufe zurück</div>
    <div class="mini"><div class="row">${kan(i.k || 'tel')}<b>${esc(i.wer)}</b><span style="margin-left:auto">${tg(i.st, true)}</span></div><p>${esc(i.kurz || i.sum || i.bedarf)}</p></div>
    <div class="eye" style="margin:16px 0 8px">Wann rufst du zurück?</div><div class="slots">${S.map(([k, t]) => `<button type="button" class="${pick.slot === k ? 'on' : ''}" data-act="slot" data-k="${k}">${t}</button>`).join('')}</div>
    <div class="eye" style="margin:16px 0 8px">Wer ruft an? <span style="text-transform:none;letter-spacing:0;font-weight:500">· aus Personal, gerade im Dienst</span></div>
    <div class="people">${rr.map((m) => `<button type="button" class="${pick.ma === m.id ? 'on' : ''}" data-act="ma" data-k="${m.id}"><span class="pav">${esc(ini(m.anzeige))}</span><span><b>${esc(m.anzeige)}${m.id === login.get()?.ma ? ' (du)' : ''}</b><div class="meta">${esc(m.rolle)}${m.status === 'pause' ? ' · Pause' : ''}</div></span></button>`).join('')}</div>
    <ul class="checks" style="margin-top:14px"><li>${ic('check')}Der Bot sagt dem Kunden die Uhrzeit</li><li>${ic('check')}Termin kommt in den Personal-Plan</li><li>${ic('check')}Erinnerung 10 Min. vorher</li></ul>
    <button class="btn pri" style="margin-top:12px" data-act="cb-save" data-id="${id}">${ic('cal')}Rückruf festlegen</button></section>${rrListe()}</div>`;
}
function rrListe() {
  const offen = items.filter((i) => /Rückruf offen|Bot hat Kontakt/.test(i.status) && !store.termine.some((t) => t.gid === i.id));
  return `<section class="card" style="align-self:start"><div class="ch">${ic('cal')}Rückrufe heute<span class="meta">${store.termine.length} geplant</span></div>
   <div class="rows">${store.termine.map((t) => `<div class="act"><span class="kanal tel">${ic('callback')}</span><span class="w">${esc(t.wer)}<div class="meta">${esc(t.ma_name)} · ${t.tag === TAG() ? 'heute' : 'morgen'}</div></span><span class="r"><b class="num" style="color:var(--ink)">${t.um}</b></span></div>`).join('') || '<p class="meta">Noch keine Rückrufe geplant.</p>'}</div>
   ${offen.length ? `<div class="hair"></div><div class="eye" style="margin-bottom:4px">Wünschen Rückruf</div>${offen.map((i) => `<div class="act">${kan(i.k)}<span class="w">${esc(i.wer)}</span><button class="btn sec sm" style="margin-left:auto" data-act="cb" data-id="${i.id}">Planen</button></div>`).join('')}` : ''}
   <a class="btn ghost sm" style="margin-top:12px" href="${LINKS.plan}">${ic('cal')}Personal-Plan öffnen</a></section>`;
}
function vRueckrufe() { return `<div class="grid two">${rrListe()}<section class="card"><div class="ch">${ic('callback')}So funktioniert „Ich rufe zurück“</div><ul class="checks"><li>${ic('check')}Bei einem Anruf oder einer Meldung tippst du „Ich rufe zurück“.</li><li>${ic('check')}Du wählst Uhrzeit und Person aus dem Personal, die gerade im Dienst ist.</li><li>${ic('check')}Der Bot sagt dem Kunden Bescheid, der Termin steht im Personal-Plan.</li></ul></section></div>`; }

// ---------------------------------------------------------------- WhatsApp-Vorschau
const ov = document.createElement('div'); ov.className = 'ov'; ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'WhatsApp-Vorschau'); document.body.appendChild(ov);
function openWA(id) {
  const ev = (id && byId(id)) || live.evs.find((e) => e.state === 'live') || offeneMeldungen()[0] || items[0];
  const tel = ev.k === 'tel' && ev.live; const txt = ev.script ? ev.script.titel(ADR).replace(/<\/?b>/g, '*') : `${ADR}, neue Meldung von *${ev.wer}*: ${ev.sum}`;
  const Qr = tel ? [['ran', 'Rangehen'], ['bot', 'Bot macht weiter'], ['cb', 'Ich rufe zurück']] : ev.live ? [['take', 'Übernehmen'], ['bot', 'Bot macht weiter'], ['cb', 'Zurückrufen']] : [['open', 'Übernehmen'], ['cb', 'Zurückrufen']];
  ov.innerHTML = `<div class="wa-phone"><div class="wa-in"><div class="wa-head"><span class="kanal wa">${ic('wa')}</span><div><b>Shop-Raum · Sofort-Meldung</b><div class="meta">WhatsApp · Vorschau</div></div><button class="wa-x btn ghost sm" style="margin-left:auto;height:32px;width:32px;padding:0" data-act="wa-close" aria-label="Schließen">${ic('x')}</button></div>
   <div class="wa-body"><span class="sample" style="height:26px;font-size:10px;margin-bottom:10px"><i></i>BEISPIELDATEN</span>
   <div class="wa-msg">${ev.live ? '🔴 <b>Live-' + (ev.k === 'tel' ? 'Anruf' : 'Chat') + '</b><br>' : '🔔 <b>Sofort-Meldung</b><br>'}${esc(txt).replace(/\*(.+?)\*/g, '<b>$1</b>')}<br><span class="meta">${TG[ev.st]} · Score ${ev.sc}</span><div class="t">${ev.wa || ev.z} ✓✓</div></div>
   ${Qr.map(([a, t]) => `<button class="wa-q" data-act="${a}" data-id="${ev.id}" data-via="wa">${t}</button>`).join('')}
   <p class="meta" style="text-align:center;margin-top:12px">Gleiche Knöpfe wie im Dashboard. Kein WhatsApp? Die Meldung kommt per E-Mail.</p></div></div></div>`;
  ov.hidden = false; ov.querySelector('.wa-q')?.focus();
}

// ---------------------------------------------------------------- Toasts
const toasts = document.createElement('div'); toasts.className = 'toasts'; toasts.setAttribute('aria-live', 'polite'); document.body.appendChild(toasts);
function toast(html, small = '', extra = '') { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `${small ? `<small>${small}</small>` : ''}${html}${extra ? '<br>' + extra : ''}`; toasts.appendChild(t); while (toasts.children.length > 3) toasts.firstChild.remove(); setTimeout(() => t.remove(), CAPTURE ? 4000 : 7000); }

// ---------------------------------------------------------------- Routing + Rendern
const route = () => { const [v, p] = location.hash.replace(/^#\/?/, '').split('/'); return { v: v || '', p: p || null }; };
let rq = 0;
function render() { if (rq) return; rq = requestAnimationFrame(() => { rq = 0; draw(); }); }
function draw() {
  const { v, p } = route(); const inp = document.getElementById('chatIn'); const hadFocus = inp && document.activeElement === inp; if (inp) live.chatDraft = inp.value;
  const conv = document.getElementById('conv'); const atBottom = !conv || conv.scrollHeight - conv.scrollTop - conv.clientHeight < 40;
  const V = { '': vUebersicht, gespraeche: vGespraeche, gespraech: () => vGespraech(p), chat: () => vGespraech(p, true), leads: () => vLeads(p), verknuepfung: vVerknuepfung, rueckruf: () => vRueckruf(p), rueckrufe: vRueckrufe };
  const cur = v === 'gespraech' || v === 'chat' ? 'gespraeche' : v === 'rueckruf' ? 'rueckrufe' : v in V ? v : '';
  app.innerHTML = header() + subbar(cur) + `<main id="main">${(V[v] || vUebersicht)()}</main><p class="foot-note">BEISPIELDATEN · alle Namen, Firmen und Gespräche sind erfunden · Demo-Uhr ${now()} · ${esc(BASE.quelle)}</p>` + tabbar(cur);
  const c2 = document.getElementById('conv'); if (c2 && atBottom) c2.scrollTop = c2.scrollHeight;
  const i2 = document.getElementById('chatIn'); if (i2 && hadFocus && !i2.disabled) { i2.focus(); i2.setSelectionRange(i2.value.length, i2.value.length); }
  const nv = app.querySelector('.mainnav'); if (nv && nv.scrollWidth > nv.clientWidth) nv.scrollLeft = nv.scrollWidth;
  document.title = 'Bots & Meldungen · Shop-Raum · Projekt EP (Beispieldaten)';
}
addEventListener('hashchange', () => { scrollTo(0, 0); live.chatDraft = ''; render(); });
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act, id = b.dataset.id, k = b.dataset.k; const via = b.dataset.via === 'wa';
  if (b.tagName === 'A') e.preventDefault();
  if (via || a === 'wa-close') ov.hidden = true;
  if (a === 'sim-tel') { const ev = simulate('tel'); if (ev && route().v !== '') location.hash = '#/'; if (!ev) toast('Gerade läuft schon ein Anruf.'); }
  else if (a === 'sim-chat') { const ev = simulate('chat'); if (ev) location.hash = '#/chat/' + ev.id; else toast('Gerade läuft schon ein Chat.'); }
  else if (a === 'wa') openWA(id);
  else if (a === 'ran' || a === 'bot' || a === 'take' || a === 'cb') decide(id, a, via);
  else if (a === 'open') { const i = byId(id); location.hash = (i?.k === 'chat' ? '#/chat/' : '#/gespraech/') + id; if (via) toast('Antwort aus WhatsApp: <b>Übernehmen</b>'); }
  else if (a === 'hang') { const ev = live.evs.find((x) => x.id === id); if (ev) finish(ev, ev.k === 'tel' ? 'Du hast aufgelegt · Transkript gespeichert' : 'Du hast den Chat beendet · Verlauf gespeichert'); }
  else if (a === 'filter') { live.filter = k; render(); }
  else if (a === 'stufe') { live.stufe = live.stufe === k ? null : k; render(); }
  else if (a === 'slot') { pick.slot = k; render(); }
  else if (a === 'ma') { pick.ma = k; render(); }
  else if (a === 'cb-save') saveRueckruf(id);
  else if (a === 'cb-del') { store.termine = store.termine.filter((t) => t.id !== id); store.saveTermine(); toast('Rückruf gelöscht'); render(); }
});
ov.addEventListener('click', (e) => { if (e.target === ov) ov.hidden = true; });
addEventListener('keydown', (e) => { if (e.key === 'Escape') ov.hidden = true; });
document.addEventListener('submit', (e) => {
  const f = e.target.closest('[data-form="chat"]'); if (!f) return; e.preventDefault(); const ev = live.evs.find((x) => x.id === f.dataset.id); const t = f.t.value.trim(); if (!ev || !t) return;
  ev.lines.push({ who: 'du', t, z: now() }); live.chatDraft = ''; f.t.value = ''; render();
  setTimeout(() => { if (ev.state === 'live') { ev.lines.push({ who: 'kunde', t: 'Super, danke dir!', z: now() }); render(); } }, 1800 * TEMPO);
});
function saveRueckruf(id) {
  const i = byId(id) || store.leads.find((l) => l.id === id); if (!i) return; const S = slots(); const s = S.find((x) => x[0] === pick.slot) || S[0]; const m = rueckrufer().find((x) => x.id === pick.ma) || rueckrufer()[0];
  const morgen = s[0] === 'morgen'; const t = { id: 'rr-' + Date.now().toString(36), gid: id, wer: i.wer, anliegen: i.kurz || i.sum || i.bedarf || '', um: s[2], tag: morgen ? nextDay(TAG()) : TAG(), ma: m.id, ma_name: m.anzeige, quelle: 'Bots', erstellt: now() };
  store.termine = store.termine.filter((x) => x.gid !== id); store.termine.push(t); store.termine.sort((a, b) => (a.tag + a.um).localeCompare(b.tag + b.um)); store.saveTermine();
  const ev = live.evs.find((e) => e.id === id);
  if (ev && ev.state === 'live') { ev.mode = 'rueckruf'; ev.rueckruf = (morgen ? 'morgen ' : '') + t.um; ev.lines.push({ who: 'bot', t: `${m.anzeige.split(' ')[0]} ruft dich ${morgen ? 'morgen' : 'heute'} um ${t.um} zurück. Bis dann!`, z: now() }); finish(ev, `Rückruf geplant: ${t.um} · ${m.anzeige}`); }
  else { const it = items.find((x) => x.id === id); if (it) { it.status = 'Rückruf ' + t.um; if (it.meldung) it.status = 'Rückruf ' + t.um; } const l = store.leads.find((x) => x.gid === id || x.id === id); if (l) { l.next = 'Rückruf ' + t.um; store.saveLeads(); } }
  toast(`Rückruf festgelegt: <b>${esc(i.wer)}</b> · ${morgen ? 'morgen' : 'heute'} ${t.um}`, `Im Personal-Plan bei ${esc(m.anzeige)} eingetragen · Erinnerung 10 Min. vorher`, `<a href="${LINKS.plan}">Personal-Plan öffnen</a>`);
  render();
}
const nextDay = (d) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + 1); return x.toISOString().slice(0, 10); };

// ---------------------------------------------------------------- Start
(async () => {
  render(); await loadBase(); render();
  setInterval(render, 15000);
  setInterval(() => { if (live.evs.some((e) => e.state === 'live' && e.k === 'tel') && route().v === '') render(); }, 1000);
  if (!CAPTURE) { setTimeout(() => simulate('tel'), 2500); setTimeout(autoSim, 45000); }
  window.__bots = { simulate, live, store, items };
})();
