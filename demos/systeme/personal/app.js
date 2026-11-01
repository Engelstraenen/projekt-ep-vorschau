// Projekt EP · Personalmanagement · Shell + Router (BEISPIELDATEN)
import { ic, esc, av, get, login, isGF, connect, onLive, live, toast, LINKS, link3d } from './core.js';
import { uebersicht, stempel, plan } from './views1.js';
import { abwesenheiten, akte, freigaben, leistung, lohn, onoff, rollen, protokoll, bots, loginView } from './views2.js';

const NAV_GF = [['Heute', [['', 'home', 'Übersicht'], ['stempel', 'clock', 'Zeiterfassung'], ['plan', 'cal', 'Schichtplan'], ['abwesenheiten', 'heart', 'Abwesenheiten']]],
  ['Team', [['akte', 'users', 'Mitarbeitende'], ['freigaben', 'check', 'Freigaben'], ['leistung', 'scan', 'Leistung (Scanner)'], ['onoff', 'door', 'On-/Offboarding']]],
  ['Verwaltung', [['lohn', 'euro', 'Lohn & DATEV'], ['rollen', 'shield', 'Rollen & Datenschutz'], ['protokoll', 'list', 'Protokoll']]]];
const NAV_MA = [['Ich', [['stempel', 'clock', 'Stempeluhr'], ['plan', 'cal', 'Mein Plan'], ['abwesenheiten', 'heart', 'Abwesenheiten'], ['freigaben', 'file', 'Anträge'], ['akte', 'user', 'Meine Akte'], ['lohn', 'euro', 'Stundenzettel']]]];
const TAB_GF = [['', 'home', 'Heute'], ['plan', 'cal', 'Plan'], ['freigaben', 'check', 'Freigaben'], ['leistung', 'scan', 'Leistung'], ['akte', 'users', 'Team']];
const TAB_MA = [['stempel', 'clock', 'Stempeln'], ['plan', 'cal', 'Plan'], ['abwesenheiten', 'heart', 'Anträge'], ['akte', 'user', 'Profil']];
const VIEWS = { '': uebersicht, stempel, plan, abwesenheiten, akte, freigaben, leistung, lohn, onoff, rollen, protokoll, bots };
const GF_ONLY = ['', 'onoff', 'rollen', 'protokoll', 'leistung'];
const app = document.getElementById('app');
let S = null; let cleanups = []; let tick = null; let busy = false; let again = false;

const route = () => { const h = location.hash.replace(/^#\/?/, ''); const [v, p] = h.split('/'); return { v: v || '', p: p || null }; };
async function load() { const L = login.get(); S = await get('/state' + (L?.rolle === 'ma' ? `?rolle=ma&ma=${L.ma}` : '?rolle=gf')); return S; }
function topbar(cur) {
  const L = login.get(); const me = S?.mitarbeiter?.find((m) => m.id === L?.ma) || S?.ich || { anzeige: L?.name, abteilung_id: L?.rolle === 'gf' ? 'gf' : '' };
  const sw = [['stadt', 'building', 'Stadt'], ['lager', 'box', 'Lager'], ['dashboard', 'grid', 'Dashboard'], ['personal', 'users', 'Personal'], ['bots', 'bot', 'Bots']];
  return `<header class="top"><a class="brand" href="#/${isGF() ? '' : 'stempel'}"><span class="lg">EP</span><span><b>Personal</b><small>Projekt EP · Personalmanagement</small></span></a>
    <nav class="sw" aria-label="Bereiche">${sw.map(([k, i, n]) => `<a href="${k === 'personal' ? '#/' + (isGF() ? '' : 'stempel') : LINKS[k]}" class="${(k === 'personal' && cur !== 'bots') || (k === 'bots' && cur === 'bots') ? 'on' : ''}">${ic(i)}<span>${n}</span></a>`).join('')}</nav>
    <div class="tr"><span class="clock ${live.on ? '' : 'off'}" title="${live.on ? 'Live verbunden' : 'nicht live'}"><i></i>${S?.jetzt || '–'} <span class="hide-m">Demo-Uhr</span></span><span class="bd">BEISPIELDATEN</span>
    ${L ? `<button class="me" id="me" title="Rolle wechseln / abmelden">${av(me)}<span><b>${esc(me.anzeige)}</b><small>${L.rolle === 'gf' ? 'Geschäftsführung' : 'Mitarbeitende'}</small></span></button>` : ''}</div></header>`;
}
function shell(cur, v) {
  const nav = isGF() ? NAV_GF : NAV_MA; const tabs = isGF() ? TAB_GF : TAB_MA; const nF = (S.freigaben || []).filter((f) => f.status === 'offen').length;
  const badge = (k) => (k === 'freigaben' && nF && isGF() ? `<span class="n">${nF}</span>` : '');
  const sw = [['stadt', 'building', 'Stadt'], ['lager', 'box', 'Lager'], ['dashboard', 'grid', 'Dashboard'], ['bots', 'bot', 'Bots']];
  return topbar(cur) + `<nav class="mtop" aria-label="Bereiche"><a class="on" href="#/${isGF() ? '' : 'stempel'}">${ic('users')}Personal</a>${sw.map(([k, i, n]) => `<a href="${LINKS[k]}">${ic(i)}${n}</a>`).join('')}</nav>
    <div class="shell"><aside class="side">${nav.map(([g, items]) => `<div class="grp">${g}</div>` + items.map(([k, i, n]) => `<a href="#/${k}" class="${cur === k ? 'on' : ''}">${ic(i)}${n}${badge(k)}</a>`).join('')).join('')}
      <div class="foot"><b>Kopplung live</b><br>Stempeln, Umplanen und Krankmeldungen bewegen die Figuren in der <a href="${LINKS.lager}">Paketstadt</a>.<br><br>BEISPIELDATEN · erfundene Personen</div></aside>
    <main class="main" id="main"><div class="ph"><div><h1>${v.title}</h1>${v.sub ? `<div class="sub">${v.sub}</div>` : ''}</div>${v.act ? `<div class="act">${v.act}</div>` : ''}</div><div id="view">${v.html}</div></main></div>
    <nav class="tabbar" aria-label="Navigation">${tabs.map(([k, i, n]) => `<a href="#/${k}" class="${cur === k ? 'on' : ''}">${ic(i)}${n}${badge(k)}</a>`).join('')}</nav>`;
}
const ctxBase = { keep: (fn) => cleanups.push(fn) };
async function render(full = true) {
  if (busy) { again = true; return; } busy = true;
  try {
    cleanups.forEach((f) => f()); cleanups = [];
    const { v, p } = route(); const L = login.get();
    if (v === 'login' || !L) { const lv = await loginView({ refresh: () => render() }); app.innerHTML = topbar('login') + lv.html; lv.bind(app); bindTop(); return; }
    if (full || !S) await load();
    let key = v in VIEWS ? v : ''; if (!isGF() && GF_ONLY.includes(key) && key !== 'bots') key = 'stempel';
    const ctx = { ...ctxBase, param: p, refresh: () => render(true) };
    const out = await VIEWS[key](S, ctx);
    const y = scrollY; app.innerHTML = shell(key, out); out.bind?.(app.querySelector('#main'), ctx);
    bindTop(); if (!full) scrollTo(0, y); document.title = (out.title?.replace(/<[^>]+>/g, '') || 'Personal') + ' · Personal · Projekt EP';
  } catch (e) { console.error(e); app.innerHTML = `<div class="empty" style="padding:80px">Personal-Daten nicht erreichbar (${esc(e.message)}). Bitte die Seite neu laden.<br><br><button class="btn" type="button" data-reload>Neu laden</button></div>`; app.querySelector('[data-reload]')?.addEventListener('click', () => location.reload()); }
  finally { busy = false; if (again) { again = false; render(true); } }
}
function bindTop() {
  app.querySelector('#me')?.addEventListener('click', () => { location.hash = '#/login'; });
}
// Live: Ereignisse vom Bus → Ansicht neu laden (gedrosselt), Scans nur in der Leistungs-Ansicht
let tR = null; onLive((ev) => { if (ev.type === 'scan') return; if (ev.text && login.get()) { const mine = !isGF() && ev.ma && ev.ma !== login.get().ma; if (!mine) toast(ev.text, '', `Live · ${ev.uhr}${ev.ma ? ' · <a href="' + link3d('ma:' + ev.ma) + '">in 3D</a>' : ''}`); } clearTimeout(tR); tR = setTimeout(() => { if (!document.querySelector('.scrim') && !document.querySelector('.sh.drag')) render(true); }, 500); });
document.addEventListener('ep-live', () => { const c = app.querySelector('.clock'); if (c) c.classList.toggle('off', !live.on); });
addEventListener('hashchange', () => render(true));
// Bindung: views binden ihre Aktionsleiste selbst über data-Attribute in #view und .ph .act – deshalb beide Container
render(true); connect();
tick = setInterval(() => { if (!document.hidden && !document.querySelector('.scrim') && !document.querySelector('.sh.drag')) render(true); }, 30000);
