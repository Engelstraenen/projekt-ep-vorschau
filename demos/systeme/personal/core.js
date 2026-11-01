// Projekt EP · Personal · Kern: API, Login/Rolle, Live-Bus, UI-Helfer (BEISPIELDATEN)
import { ic } from './icons.js';
export { ic };
export const ROOT = new URL('../', location.href).href.replace(/\/$/, '');
export const API = ROOT + '/wws/personal';
export const LINKS = { stadt: ROOT + '/paketstadt3d/?style=A', lager: ROOT + '/paketstadt3d/?style=A&view=lager', dashboard: ROOT + '/shop-raum/', personal: ROOT + '/personal/', bots: ROOT + '/bots/' };
export const link3d = (ref, view) => `${ROOT}/paketstadt3d/?style=A&view=${view || (ref.startsWith('office') ? 'office' : 'lager')}&focus=${encodeURIComponent(ref)}`;
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const de = (n, d = 0) => (n == null ? '–' : Number(n).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }));
export const deDate = (iso) => { if (!iso) return '–'; const [y, m, d] = iso.split('-'); return `${d}.${m}.${y}`; };
export const deKurz = (iso) => { if (!iso) return '–'; const [, m, d] = iso.split('-'); return `${d}.${m}.`; };
export const ini = (n) => String(n || '?').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const AVC = { lager: '', wareneingang: '', versand: 'k', retouren: 'a', kundenservice: 'l', shop: 'l', marketing: 'l', einkauf: 'l', gf: 'c' };
export const av = (m, cls = '') => `<span class="av ${AVC[m?.abteilung_id] ?? ''} ${cls}" aria-hidden="true">${esc(ini(m?.anzeige))}</span>`;
export const STATUS = { eingestempelt: 'eingestempelt', pause: 'Pause', krank: 'krank', urlaub: 'Urlaub', spaetschicht: 'Spätschicht (noch nicht da)', ausgestempelt: 'ausgestempelt' };
export const ORT = (o) => { if (!o) return ''; if (o === 'nicht_sichtbar') return 'nicht im Betrieb'; if (o === 'mobil') return 'mobil (Homeoffice)'; const m = { 'lager:wareneingang': 'Lager · Wareneingang', 'lager:kommissionierung': 'Lager · Kommissionierung', 'lager:packen': 'Lager · Packen', 'lager:versand': 'Lager · Versand/Rampe', 'lager:retouren': 'Lager · Retouren', 'lager:pausenraum': 'Pausenraum Lager', 'office:teekueche': 'Office · Teeküche', 'office:gf-buero': 'Office · GF-Büro', 'office:grossraum:kundenservice': 'Office · Kundenservice', 'office:grossraum:shop': 'Office · Shop/Produkt', 'office:grossraum:marketing': 'Office · Marketing', 'office:grossraum:einkauf': 'Office · Einkauf' }; return m[o] || o; };

// ---------- Login (gemeinsam für Stadt, Lager, Dashboard, Personal – gleiche Herkunft, localStorage) ----------
export const login = {
  get() { try { return JSON.parse(localStorage.getItem('ep-login') || 'null'); } catch { return null; } },
  set(v) { localStorage.setItem('ep-login', JSON.stringify(v)); },
  clear() { localStorage.removeItem('ep-login'); },
};
export const role = () => login.get()?.rolle || null;
export const isGF = () => role() === 'gf';

// ---------- API ----------
export async function get(path) { const r = await fetch(API + path, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status + ''); return r.json(); }
export async function act(body) {
  const L = login.get() || {}; const r = await fetch(API + '/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, rolle: L.rolle, als: L.ma }) });
  let j = {}; try { j = await r.json(); } catch {}
  if (!r.ok || !j.ok) { toast(j.error || 'Aktion fehlgeschlagen (' + r.status + ')', 'err'); return null; }
  return j;
}

// ---------- Live-Bus (SSE /wws/events → event: personal) ----------
const subs = new Set(); let es = null; export const live = { on: false, last: null };
export function onLive(fn) { subs.add(fn); return () => subs.delete(fn); }
export function connect() {
  if (es || !('EventSource' in window) || new URLSearchParams(location.search).has('capture')) return;
  try { es = new EventSource(ROOT + '/wws/events');
    es.addEventListener('open', () => { live.on = true; document.dispatchEvent(new Event('ep-live')); });
    es.addEventListener('error', () => { live.on = false; document.dispatchEvent(new Event('ep-live')); });
    es.addEventListener('personal', (m) => { try { const ev = JSON.parse(m.data); live.last = ev; subs.forEach((f) => f(ev)); } catch {} });
  } catch {}
}

// ---------- UI ----------
let tw = null;
export function toast(text, kind = '', sub = '') {
  if (!tw) { tw = document.createElement('div'); tw.className = 'toasts'; tw.setAttribute('role', 'status'); tw.setAttribute('aria-live', 'polite'); document.body.appendChild(tw); }
  const t = document.createElement('div'); t.className = 'toast ' + kind; t.innerHTML = `${ic(kind === 'err' ? 'alert' : 'check')}<div>${esc(text)}${sub ? `<small>${sub}</small>` : ''}</div>`;
  tw.prepend(t); while (tw.children.length > 3) tw.lastChild.remove(); setTimeout(() => t.remove(), kind === 'err' ? 7000 : 4800);
}
export function dialog(html, bind) {
  const s = document.createElement('div'); s.className = 'scrim'; s.innerHTML = `<div class="dlg" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(s);
  const close = () => s.remove(); s.addEventListener('click', (e) => { if (e.target === s || e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); removeEventListener('keydown', k); } });
  bind?.(s.querySelector('.dlg'), close); s.querySelector('button, input, select')?.focus(); return close;
}
export const chipSt = (st) => ({ eingestempelt: 'g', pause: 'a', krank: 'c', urlaub: 's', spaetschicht: 'l' }[st] || '');
export const qChip = (q) => q.status === 'gueltig' ? `<span class="chip g">gültig</span>` : q.status === 'laeuft_ab' ? `<span class="chip a">läuft ab ${deKurz(q.gueltig_bis)}</span>` : q.status === 'fehlt' ? `<span class="chip c">fehlt</span>` : `<span class="chip c">abgelaufen</span>`;
export const sevIc = { besetzung: 'users', unterbesetzung: 'users', quali: 'lock', arbzg: 'clock', korrektur: 'file', urlaubskonflikt: 'cal' };
