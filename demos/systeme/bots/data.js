// Projekt EP · Raum „Bots“ · Daten, gemeinsame Datenbasis, Simulation (BEISPIELDATEN – alles erfunden, keine Preise)
export const ROOT = new URL('../', location.href).href.replace(/\/$/, '');
export const LINKS = { stadt: ROOT + '/paketstadt3d/?style=A', lager: ROOT + '/paketstadt3d/?style=A&view=lager', dashboard: ROOT + '/shop-raum/', personal: ROOT + '/personal/', plan: ROOT + '/personal/#/plan', login: ROOT + '/personal/#/login', bots: ROOT + '/bots/' };
const Q = new URLSearchParams(location.search);
export const CAPTURE = Q.has('capture');                 // Tests/Screenshots: keine Zufallsereignisse
export const TEMPO = Q.get('tempo') === 'schnell' ? 0.25 : 1;

// ---------- gemeinsamer Login (gleiche Herkunft wie Stadt, Lager, Dashboard, Personal) ----------
export const login = { get() { try { return JSON.parse(localStorage.getItem('ep-login') || 'null'); } catch { return null; } } };
const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };

// ---------- Demo-Uhr (wie Personal: Do 29.10.2026) ----------
const clock = { base: 13 * 60 + 42, t0: Date.now(), tag: '2026-10-29' };
export const now = () => { const m = clock.base + Math.floor((Date.now() - clock.t0) / 60000); return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
export const nowMin = () => clock.base + Math.floor((Date.now() - clock.t0) / 60000);
export const hm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
export const TAG = () => clock.tag;

// ---------- gemeinsame Datenbasis: Personal + Lager (dieselben Quellen wie die anderen Bereiche) ----------
export const BASE = { personal: null, lager: null, quelle: 'eingebaut' };
const FALLBACK_MA = [
  { id: 'ma17', anzeige: 'Markus B.', rolle: 'Geschäftsführung', abteilung_id: 'gf', status: 'eingestempelt' },
  { id: 'ma10', anzeige: 'Sophie W.', rolle: 'Kundenservice', abteilung_id: 'kundenservice', status: 'eingestempelt' },
  { id: 'ma11', anzeige: 'Laura Z.', rolle: 'Kundenservice', abteilung_id: 'kundenservice', status: 'pause' },
  { id: 'ma12', anzeige: 'Elias B.', rolle: 'Shop & Produkt', abteilung_id: 'shop', status: 'eingestempelt' },
];
const FALLBACK_ART = [
  { sku: 'JK-001', name: 'Parka Nordwind', color: 'Oliv', stock: { S: 4, M: 3, L: 7, XL: 6 }, bin: 'J-01-1' },
  { sku: 'HS-003', name: 'Chino Sand', color: 'Sand', stock: { 30: 5, 32: 0, 34: 8, 36: 2 }, bin: 'H-02-3' },
];
export async function loadBase() {
  const j = async (p) => { const r = await fetch(ROOT + p, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); return r.json(); };
  try { const p = await j('/wws/personal/state?rolle=gf'); BASE.personal = p; if (p.jetzt) { const [h, m] = p.jetzt.split(':').map(Number); clock.base = h * 60 + m; clock.t0 = Date.now(); } if (p.heute) clock.tag = p.heute; BASE.quelle = 'Personal + Lager (gemeinsame Datenbasis)'; } catch { BASE.personal = null; }
  try { const w = await j('/wws/state'); BASE.lager = (w.state || w).articles || null; } catch { BASE.lager = null; }
}
export const mitarbeiter = () => BASE.personal?.mitarbeiter || FALLBACK_MA;
export const artikel = () => BASE.lager || FALLBACK_ART;
export function bestand(name, size) {
  const a = artikel().find((x) => x.name === name) || FALLBACK_ART.find((x) => x.name === name);
  if (!a) return null; const n = size ? (a.stock?.[size] ?? 0) - (a.reserved?.[size] ?? 0) : Object.values(a.stock || {}).reduce((s, v) => s + v, 0);
  return { name: a.name, size, n: Math.max(0, n), bin: a.bin, sku: a.sku, color: a.color };
}
// Wer kann zurückrufen? Eingestempelt (oder Pause) in GF, Kundenservice, Shop/Marketing – aus Personal
export function rueckrufer() {
  const ok = ['gf', 'kundenservice', 'shop', 'marketing', 'einkauf'];
  const list = mitarbeiter().filter((m) => ok.includes(m.abteilung_id) && ['eingestempelt', 'pause'].includes(m.status));
  const ich = mitarbeiter().find((m) => m.id === login.get()?.ma);   // wer angemeldet ist, kann immer selbst zurückrufen
  const all = (list.length ? list : FALLBACK_MA).filter((m) => m.id !== ich?.id);
  return (ich ? [ich, ...all] : all).slice(0, 6);
}
export const ini = (n) => String(n || '?').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

// ---------- Gespräche (Ausgangslage heute) ----------
const T = (z) => z;
export const items = [
  { id: 'g-nordlicht', k: 'mail', z: T('10:41'), wer: 'Studio Nordlicht', sum: 'Relaunch Website und Shop, Zusage nach Erstgespräch', st: 'auftrag', sc: 72, status: 'Meldung offen', meldung: true, wa: '10:41', mail: 'E-Mail an Vertrieb' },
  { id: 'g-lumi', k: 'chat', z: T('10:17'), wer: 'Lumi Design · Bestandskunde', sum: 'Kontaktformular sendet seit heute früh nicht', st: 'wichtig', sc: 58, status: 'Meldung offen', meldung: true, wa: '10:17',
    lines: [['kunde', 'Hi, bei uns sendet das Kontaktformular seit heute früh nicht mehr.'], ['bot', 'Danke für den Hinweis! Kommt eine Fehlermeldung oder passiert einfach nichts?'], ['kunde', 'Es lädt kurz und dann passiert nichts.'], ['bot', 'Verstanden. Ich gebe das sofort an das Team weiter, du bekommst heute noch eine Rückmeldung.']] },
  { id: 'g-hartmann', k: 'tel', z: T('09:52'), wer: 'Kanzlei Hartmann', sum: 'Frage zum Vertrag, möchte den Chef persönlich sprechen', st: 'wichtig', sc: 50, status: 'Rückruf offen',
    lines: [['bot', 'Hi, hier ist der Assistent vom Shop-Team. Worum geht\u2019s?'], ['kunde', 'Ich habe eine Frage zum Vertrag und möchte das gern persönlich mit dem Chef klären.'], ['bot', 'Klar. Ich sorge dafür, dass er dich heute noch zurückruft.']] },
  { id: 'g-imagefilm', k: 'chat', z: T('09:30'), wer: 'Besucher · Website', sum: 'Interesse an einem Imagefilm, bittet um Rückruf', st: 'relevant', sc: 34, status: 'Bot hat Kontakt',
    lines: [['kunde', 'Macht ihr auch Imagefilme?'], ['bot', 'Ja! Magst du mir kurz sagen, wofür der Film sein soll?'], ['kunde', 'Für unsere Website, ca. 60 Sekunden.'], ['bot', 'Danke! Ich lege dich für einen Rückruf an.']] },
  { id: 'g-becker', k: 'mail', z: T('09:05'), wer: 'J. Becker', sum: 'Bewerbung als Werkstudent Mediengestaltung', st: 'relevant', sc: 22, status: 'An Team' },
  { id: 'g-erreichbar', k: 'chat', z: T('08:48'), wer: 'Besucher · Website', sum: 'Frage nach Erreichbarkeit, vom Bot beantwortet', st: 'routine', sc: 6, status: 'Bot gelöst',
    lines: [['kunde', 'Wann seid ihr erreichbar?'], ['bot', 'Unser Team ist Mo–Fr von 9 bis 18 Uhr da. Ich bin rund um die Uhr für dich da.']] },
  { id: 'g-newsletter', k: 'mail', z: T('08:20'), wer: 'Newsletter-Versand', sum: 'Werbung an uns, automatisch abgelegt', st: 'routine', sc: 0, status: 'Abgelegt' },
];

// ---------- Skripte für Live-Ereignisse ----------
// who: bot | kunde ; sum = Stichpunkt für die KI-Zusammenfassung ; lager = Lager-Abfrage
export const SCRIPTS = {
  brandt: { k: 'tel', wer: 'Möbelhaus Brandt GmbH', st: 'auftrag', sc: 85, dringend: true,
    titel: (n) => `${n}, <b>Möbelhaus Brandt GmbH</b> ruft gerade an und möchte einen neuen Online-Shop für 12 Filialen beauftragen.`,
    kurz: 'Neuer Online-Shop für 12 Filialen, Start im Dezember',
    ctx: ['Erster Kontakt: E-Mail 28.10.', 'Ansprechpartnerin: Frau Brandt', '12 Filialen · Start Dezember', 'Bisher kein Kunde'],
    lead: { bedarf: 'Online-Shop, 12 Filialen', next: 'Erstgespräch Fr 10:00', quelle: 'Telefonbot' },
    lines: [['bot', 'Hi, hier ist der Assistent vom Shop-Team. Worum geht\u2019s?'], ['kunde', 'Hallo, Brandt vom Möbelhaus Brandt. Wir brauchen einen neuen Online-Shop für unsere 12 Filialen.', 'Online-Shop für 12 Filialen'],
      ['bot', 'Klingt spannend! Bis wann soll der Shop live sein?'], ['kunde', 'Am liebsten Start im Dezember.', 'Start im Dezember'],
      ['bot', 'Alles klar. Wann passt dir ein Erstgespräch?'], ['kunde', 'Diese Woche, am liebsten vormittags.', 'Erstgespräch diese Woche, vormittags'],
      ['bot', 'Super, ich schlage Freitag 10 Uhr vor und schicke dir die Bestätigung per E-Mail.', 'Termin Fr 10:00 vorgeschlagen, Bestätigung per E-Mail']] },
  parka: { k: 'tel', wer: 'Kundin · Bestellung', st: 'relevant', sc: 41,
    titel: (n) => `${n}, eine <b>Kundin</b> ruft an und fragt, ob der <b>Parka Nordwind in M</b> noch da ist.`,
    kurz: 'Fragt nach Parka Nordwind in M, Bot prüft das Lager',
    ctx: ['Bestandskundin seit 2025', '3 Bestellungen bisher', 'Letzte Bestellung: Chino Sand'],
    lead: { bedarf: 'Parka Nordwind, Größe M', next: 'Reservierung bestätigen', quelle: 'Telefonbot' },
    lines: [['bot', 'Hi, hier ist der Assistent vom Shop-Team. Wie kann ich dir helfen?'], ['kunde', 'Ist der Parka Nordwind in M noch da?', 'Fragt nach Parka Nordwind, Größe M'],
      ['lager', 'Parka Nordwind|M'], ['bot', '__lager__'], ['kunde', 'Ja, bitte reservier mir einen.', 'Möchte reservieren', 'Schade. Sag mir bitte Bescheid, wenn er wieder da ist.', 'Möchte Bescheid bekommen'], ['bot', 'Erledigt, ich reserviere ihn bis morgen für dich.', 'Reserviert bis morgen', 'Mach ich! Du bekommst eine Nachricht, sobald er wieder da ist.', 'Benachrichtigung bei Wareneingang']] },
  hartmann2: { k: 'tel', wer: 'Kanzlei Hartmann', st: 'wichtig', sc: 52,
    titel: (n) => `${n}, die <b>Kanzlei Hartmann</b> ruft noch mal an und möchte dich persönlich sprechen.`,
    kurz: 'Zweiter Anruf: Frage zum Vertrag, möchte dich persönlich',
    ctx: ['Heute schon angerufen (09:52)', 'Rückruf noch offen', 'Thema: Vertrag'],
    lead: { bedarf: 'Klärung Vertrag', next: 'Rückruf heute', quelle: 'Telefonbot' },
    lines: [['bot', 'Hi, hier ist der Assistent vom Shop-Team. Worum geht\u2019s?'], ['kunde', 'Hartmann hier, ich hatte heute Morgen schon angerufen, wegen des Vertrags.', 'Ruft zum zweiten Mal an'], ['bot', 'Ich sehe es. Ich frage, ob der Chef gerade kann – einen Moment.'], ['kunde', 'Gern, sonst bitte ein Rückruf heute.', 'Wünscht Rückruf heute']] },
  chat_chino: { k: 'chat', wer: 'Besucher · Website', st: 'relevant', sc: 30,
    titel: (n) => `${n}, im <b>Website-Chat</b> fragt jemand nach der <b>Chino Sand in 32</b>.`,
    kurz: 'Fragt nach Chino Sand in 32, Bot prüft das Lager',
    lead: { bedarf: 'Chino Sand, Größe 32', next: 'Benachrichtigen, wenn wieder da', quelle: 'Chatbot' },
    lines: [['kunde', 'Hi! Habt ihr die Chino Sand in 32?', 'Fragt nach Chino Sand, Größe 32'], ['lager', 'Chino Sand|32'], ['bot', '__lager__'], ['kunde', 'Super, dann bestelle ich sie gleich online.', 'Will direkt online bestellen', 'Okay, sag mir bitte Bescheid, wenn sie wieder da ist.', 'Möchte Bescheid bekommen'], ['bot', 'Viel Spaß damit! Wenn du noch Fragen hast, schreib einfach.', '', 'Mach ich! Ich brauche dafür nur deine E-Mail-Adresse.'], ['kunde', 'Danke dir!', '', 'kunde@beispiel.de', 'Kontakt erfasst (Beispiel-Adresse)']] },
  chat_film: { k: 'chat', wer: 'Besucher · Website', st: 'relevant', sc: 34,
    titel: (n) => `${n}, im <b>Website-Chat</b> fragt jemand nach einem <b>Imagefilm</b>.`,
    kurz: 'Interesse an einem Imagefilm, möchte Rückruf',
    lead: { bedarf: 'Imagefilm, ca. 60 Sekunden', next: 'Rückruf', quelle: 'Chatbot' },
    lines: [['kunde', 'Macht ihr auch Imagefilme?', 'Interesse an Imagefilm'], ['bot', 'Ja! Magst du mir kurz sagen, wofür der Film sein soll?'], ['kunde', 'Für unsere Website, ca. 60 Sekunden.', 'Für die Website, ca. 60 Sekunden'], ['bot', 'Danke! Soll dich jemand aus dem Team zurückrufen?'], ['kunde', 'Ja, gern heute Nachmittag.', 'Rückruf heute Nachmittag gewünscht'], ['bot', 'Ist notiert. Bis später!']] },
};
export const LEADS0 = [
  { id: 'l-nordlicht', wer: 'Studio Nordlicht', k: 'mail', st: 'auftrag', sc: 72, bedarf: 'Relaunch Website und Shop', next: 'Zusage nach Erstgespräch', quelle: 'E-Mail', z: '10:41' },
  { id: 'l-imagefilm', wer: 'Besucher · Imagefilm', k: 'chat', st: 'relevant', sc: 34, bedarf: 'Imagefilm, ca. 60 Sekunden', next: 'Rückruf gewünscht', quelle: 'Chatbot', z: '09:30', gid: 'g-imagefilm' },
  { id: 'l-hartmann', wer: 'Kanzlei Hartmann', k: 'tel', st: 'wichtig', sc: 50, bedarf: 'Klärung Vertrag', next: 'Rückruf offen', quelle: 'Telefonbot', z: '09:52', gid: 'g-hartmann' },
  { id: 'l-lumi', wer: 'Lumi Design', k: 'chat', st: 'wichtig', sc: 58, bedarf: 'Kontaktformular reparieren', next: 'Bestandskunde · heute melden', quelle: 'Chatbot', z: '10:17', gid: 'g-lumi' },
];

// ---------- Speicher (geteilt mit Personal über localStorage, gleiche Herkunft) ----------
export const store = {
  leads: [...ls.get('ep-bots-leads', []), ...LEADS0],
  termine: ls.get('ep-bots-termine', []),
  saveLeads() { ls.set('ep-bots-leads', this.leads.filter((l) => l.neu)); },
  saveTermine() { ls.set('ep-bots-termine', this.termine); },
};
export const STATS0 = { ges: 38, selbst: 81, chat: 21, mail: 12, tel: 5, auftrag: 2, wichtig: 2, relevant: 9, routine: 25 };
