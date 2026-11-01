/* Projekt EP · Chat-Demo ohne Server.
   Regeln (Vorrang) → Suche in der Wissensbasis (BM25 + Stichworte + Tippfehler-Toleranz) → ehrlicher Fallback.
   Läuft komplett im Browser: keine Netzaufrufe, nichts wird gespeichert oder gesendet. */
(() => {
  'use strict';
  const KB = window.EP_KB; if (!KB) return;
  const FOLD = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss', 'é': 'e', 'è': 'e', 'à': 'a', '’': "'", '„': '"', '“': '"' };
  const STOP = new Set(`der die das den dem des ein eine einen einem einer eines und oder aber auch noch schon nur mal so wie was wer wo wann warum wieso
weshalb ich du er sie es wir ihr mich mir dich dir uns euch euer eure euren eurem ist sind bin bist war waren sein seid hat habe habt haben hast
kann koennt koennen kannst konnte muss muessen musst soll sollen will wollen wuerde wuerden gibt gibts gib es an auf aus bei bis fuer mit nach
von vor zu zum zur im in am um ueber unter durch ohne gegen nicht kein keine keinen bitte danke hallo hi denn dann doch ja nein mein meine meinen
unser unsere unseren dein deine ihre ihren man sich hier da dort mehr sehr viel viele etwas alles ganz gerne gern eigentlich genau also wenn ob
dass the a an is are do does you your we i me my of to for and or in on it this that what how can with`.split(/\s+/));
  const fold = (s) => String(s || '').toLowerCase().replace(/[äöüßéèà’„“]/g, (c) => FOLD[c]).normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const norm = (s) => fold(s).replace(/[^a-z0-9€@.+\- ]/g, ' ').replace(/\s+/g, ' ').trim();
  const SUF = ['ungen', 'ung', 'heiten', 'heit', 'keiten', 'keit', 'lich', 'isch', 'ern', 'en', 'er', 'es', 'em', 'e', 'n', 's'];
  const stem = (w) => { if (w.length <= 4 || /^\d+$/.test(w)) return w; for (const s of SUF) if (w.endsWith(s) && w.length - s.length >= 4) return w.slice(0, -s.length); return w; };
  const tokens = (s) => (norm(s).match(/[a-z0-9€]+/g) || []).filter((w) => !STOP.has(w)).map(stem);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rxCache = new Map();
  function hasAny(tn, phrases) {
    for (const p of phrases || []) {
      let rx = rxCache.get(p);
      if (!rx) { const pre = p.endsWith('*'); const pn = norm(p.replace(/\*+$/, '')); rx = pn ? new RegExp('(^|[^a-z0-9])' + esc(pn) + (pre ? '' : '(?![a-z0-9])')) : null; rxCache.set(p, rx); }
      if (rx && rx.test(tn)) return p;
    }
    return null;
  }
  // ---------- Index
  const E = KB.eintraege; const byId = Object.fromEntries(E.map((e) => [e.id, e]));
  const docs = E.map((e) => { const t = [...tokens(e.titel), ...tokens(e.titel), ...tokens(e.fragen.join(' ')), ...tokens(e.stichworte.join(' ')), ...tokens(e.stichworte.join(' ')), ...tokens(e.antwort).slice(0, 40)];
    const m = new Map(); for (const w of t) m.set(w, (m.get(w) || 0) + 1); return { m, L: t.length }; });
  const N = docs.length; const avg = docs.reduce((a, d) => a + d.L, 0) / N;
  const df = new Map(); for (const d of docs) for (const w of d.m.keys()) df.set(w, (df.get(w) || 0) + 1);
  const idf = new Map([...df].map(([w, n]) => [w, Math.log(1 + (N - n + 0.5) / (n + 0.5))]));
  const vocab = [...idf.keys()];
  function lcs(a, b) { const p = new Array(b.length + 1).fill(0); for (let i = 1; i <= a.length; i++) { let prev = 0; for (let j = 1; j <= b.length; j++) { const t = p[j]; p[j] = a[i - 1] === b[j - 1] ? prev + 1 : Math.max(p[j], p[j - 1]); prev = t; } } return p[b.length]; }
  function fix(w) { if (idf.has(w) || w.length < 5) return w; let best = null, bs = 0.84; for (const v of vocab) { if (Math.abs(v.length - w.length) > 3) continue; const r = (2 * lcs(w, v)) / (w.length + v.length); if (r >= bs) { bs = r; best = v; } } return best || w; }
  function search(q, k = 3) {
    const qn = norm(q); let qt = tokens(q).map(fix);
    qt = qt.concat(qt.filter((w) => w.endsWith('s') && w.length > 4 && !idf.has(w)).map((w) => fix(w.slice(0, -1))));
    const qs = new Set(qt); const res = [];
    E.forEach((e, i) => {
      const d = docs[i]; let s = 0;
      for (const w of qs) { const f = d.m.get(w) || 0; if (f) s += idf.get(w) * f * 2.2 / (f + 1.2 * (0.25 + 0.75 * d.L / avg)); }
      const hit = hasAny(qn, e.stichworte) || e.stichworte.find((k2) => !k2.includes(' ') && !k2.endsWith('*') && qs.has((tokens(k2)[0]) || ''));
      if (hit) s += 2.5 + 0.4 * hit.split(' ').length;
      for (const f of e.fragen) if (norm(f).replace(/\?+$/, '') === qn.replace(/\?+$/, '')) s += 6;
      res.push([s, e]);
    });
    res.sort((a, b) => b[0] - a[0]); return res.slice(0, k).map(([s, e]) => [Math.round(s * 100) / 100, e]);
  }
  // ---------- Sprache
  const ENW = new Set(KB.EN_WORDS), DEW = new Set(KB.DE_WORDS);
  function sprache(text, bisher) { const w = text.toLowerCase().match(/[a-zäöüß']+/g); if (!w) return bisher; const en = w.filter((x) => ENW.has(x)).length; const de = w.filter((x) => DEW.has(x)).length + 2 * (/[äöüß]/.test(text.toLowerCase()) ? 1 : 0);
    if (en >= 2 && en > de) return 'en'; if (de >= 1 && de >= en) return 'de'; return bisher; }
  function en2de(text) { let t = ' ' + text.toLowerCase() + ' '; for (const [k, v] of Object.entries(KB.EN2DE)) t = t.replace(new RegExp('(^|[^a-z])' + esc(k) + '(?![a-z])', 'g'), '$1 ' + v + ' '); return t; }
  // ---------- Antworten
  const R = KB.R, ANTW = KB.ANTW, SCHWELLE = KB.schwelle;
  const KOSTEN = /\bkost|\bpreis|\bteuer|\bbudget|\bgeld\b|was nehmt|\bcost|\bprice|\bpricing|expensive/;
  const PREIS_FAM = new Set(['preise', 'preise_klein', 'providerkosten', 'einwand_teuer', 'betreuung', 'wartungsvertrag', 'zahlungsart', 'anzahlung', 'mwst_privat']);
  function waehle(tn, q) {
    const hits = search(q, 12); const [s0, e0] = hits[0];
    if (KOSTEN.test(tn) && !/\bkostenlos/.test(tn) && !PREIS_FAM.has(e0.id) && !/preis|kost/.test(e0.id)) {
      const eid = /hosting|domain|server|laufende/.test(tn) && byId.providerkosten ? 'providerkosten' : /kleine aenderung|reparatur|wartung|aenderung/.test(tn) && byId.preise_klein ? 'preise_klein' : 'preise';
      if (byId[eid]) return [[Math.max(s0, SCHWELLE), byId[eid]], ...hits.slice(0, 2)];
    }
    return hits.slice(0, 3);
  }
  function antwort(sess, text) {
    text = String(text || '').trim().slice(0, 1000);
    const lang = sess.lang = sprache(text, sess.lang || 'de'); const tn = norm(text); const flags = sess.flags;
    const out = (key, kw = {}) => { const a = Object.assign({}, key ? ANTW[key] : {}, kw);
      const r = { text: lang === 'en' && a.text_en ? a.text_en : a.text, quelle: a.quelle || null, chips: a.chips || [], aktion: a.aktion || null, rueckruf: !!a.rueckruf, intent: kw.intent || key, lang };
      if (lang === 'en') r.chips = r.chips.map((c) => KB.EN_CHIPS[c] || c); sess.lastOffer = ['angebot_kontakt', 'angebot_rueckmeldung'].includes(r.aktion); return r; };
    if (!tn) return out('leer');
    if (hasAny(tn, R.injektion)) return out('injektion');
    if (hasAny(tn, R.beleidigung) && !hasAny(tn, ['nicht dumm', 'dumme frage'])) { flags.bel = (flags.bel || 0) + 1; return out(flags.bel >= 3 ? 'beleidigung2' : 'beleidigung'); }
    if (hasAny(tn, R.stopp)) return out('stopp');
    for (const k of ['stoerung', 'auftrag', 'beschwerde']) if (hasAny(tn, R[k])) return out(k, { quelle: null });
    const botFrage = hasAny(tn, R.bot) || (hasAny(tn, ['bist du', 'are you', 'is this', 'rede ich', 'schreibe ich', 'spreche ich', 'chatte ich', 'ist das ein', 'ist das eine', 'am i talking', 'seid ihr'])
      && hasAny(tn, ['mensch', 'human', 'person', 'bot', 'ki', 'ai', 'roboter', 'robot', 'maschine', 'automat*', 'echt', 'real']));
    if (botFrage) return out('bot', { quelle: { label: 'Hinweis nach EU-KI-Verordnung Art. 50', url: '' } });
    if (hasAny(tn, R.mensch)) return out('mensch');
    if (hasAny(tn, R.rueckruf)) return out('rueckruf');
    if (hasAny(tn, R.bewerbung)) return out('bewerbung');
    if (hasAny(tn, R.koop)) return out('koop');
    if (hasAny(tn, R.konkurrenz)) return out('konkurrenz', { quelle: byId.ablauf ? byId.ablauf.quelle : null });
    const kurz = tn.split(' ').length <= 4;
    if (kurz && sess.lastOffer && hasAny(tn, R.ja)) return out(null, { text: 'Prima! Dann brauche ich nur noch, wie wir dich erreichen.', text_en: 'Great! I just need to know how to reach you.', aktion: 'kontaktformular', intent: 'ja_kontakt' });
    if (kurz && hasAny(tn, R.nein) && !hasAny(tn, sess.lastOffer ? ['nein danke'] : [])) return out('nein');
    if (kurz && hasAny(tn, R.danke)) return out('danke');
    if (kurz && hasAny(tn, R.tschuess)) return out('tschuess');
    if (kurz && hasAny(tn, R.gruss) && !tokens(tn.replace(/\b(hallo|hi|hey|moin|servus|guten|tag|morgen|abend|hello)\b/g, '')).length) return out('gruss');
    if (hasAny(tn, R.smalltalk) && !(search(text, 1)[0][0] >= SCHWELLE * 2)) return out('smalltalk');
    const hits = waehle(tn, lang === 'en' ? en2de(text) : text); const [s0, e0] = hits[0];
    if (hasAny(tn, R.offtopic) && s0 < SCHWELLE * 2) return out('offtopic');
    if (s0 >= SCHWELLE) {
      const chips = [...(e0.chips || [])];
      for (const [s, e] of hits.slice(1)) if (s >= Math.max(SCHWELLE, s0 * 0.55) && chips.length < 3 && !chips.includes(e.titel) && e !== e0) chips.push(e.titel);
      if (['angebot_kontakt', 'angebot_rueckmeldung'].includes(e0.aktion) && !chips.includes('Projekt anfragen')) chips.push('Mit Mensch sprechen');
      return out(null, { text: e0.antwort, text_en: e0.antwort_en, quelle: e0.quelle, chips: chips.slice(0, 4), aktion: e0.aktion, intent: e0.luecke ? 'fallback' : 'wissen' });
    }
    return out(null, { text: KB.regeln.fallback, text_en: KB.regeln.fallback_en, aktion: 'angebot_rueckmeldung', chips: ['Ja, bitte weitergeben', 'Leistungen'], intent: 'fallback' });
  }
  function begruessung(lang) { return { text: lang === 'en' ? KB.regeln.begruessung_en : KB.regeln.begruessung, chips: ['Leistungen', 'Was kostet das?', 'Wie läuft ein Projekt ab?', 'Datenschutz', 'Mit Mensch sprechen'] }; }
  // ---------- lokale „API“ für das Widget (ersetzt den Chat-Server)
  const SESS = new Map(); let n = 0;
  function api(path, d) {
    if (path === '/api/session') { const sid = 'demo_' + Date.now().toString(36) + '_' + (++n); const lang = String(d.lang || '').startsWith('en') ? 'en' : 'de'; SESS.set(sid, { lang, flags: {} });
      return [200, Object.assign({ sid }, begruessung(lang), { datenschutz_url: lang === 'en' ? 'This demo runs entirely in your browser. Nothing is stored or sent.' : 'Diese Demo läuft komplett in deinem Browser. Es wird nichts gespeichert oder gesendet.', loeschfrist_tage: 0,
        einwilligung_text: lang === 'en' ? 'Demo: I understand that nothing is sent or stored here.' : 'Demo: Mir ist klar, dass hier nichts gesendet oder gespeichert wird.' })]; }
    const s = SESS.get(String(d.sid || '')); if (!s) return [404, { fehler: 'Sitzung abgelaufen – bitte neu starten.' }];
    if (path === '/api/message') { const r = antwort(s, d.text); return [200, r]; }
    if (path === '/api/contact') { const vn = String(d.name || '').trim().split(/\s+/)[0] || ''; if (!vn) return [400, { fehler: s.lang === 'en' ? 'Please enter your name.' : 'Bitte gib deinen Namen an.' }];
      return [200, { text: s.lang === 'en' ? `Thanks, ${vn}! This is a demo, so nothing was sent. On a live site your request would now go straight to the team.` : `Danke, ${vn}! Das ist eine Demo, darum wurde nichts gesendet. Auf einer echten Seite ginge dein Anliegen jetzt direkt ans Team.`, chips: ['Noch eine Frage'] }]; }
    if (path === '/api/delete') { SESS.delete(String(d.sid)); return [200, { geloescht: true }]; }
    return [200, { ok: true }];
  }
  const MARK = '/chatbot-lokal';
  const oFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    const href = typeof input === 'string' ? input : (input && input.url) || '';
    let u; try { u = new URL(href, location.href); } catch { return oFetch(input, init); }
    const i = u.pathname.indexOf(MARK + '/api/');
    if (u.origin !== location.origin || i < 0) return oFetch(input, init);
    let d = {}; try { d = JSON.parse((init && init.body) || '{}'); } catch { /* leer */ }
    const [st, body] = api(u.pathname.slice(i + MARK.length), d);
    return new Promise((ok) => setTimeout(() => ok(new Response(JSON.stringify(body), { status: st, headers: { 'Content-Type': 'application/json' } })), 180 + Math.random() * 220));
  };
  if (navigator.sendBeacon) { const oB = navigator.sendBeacon.bind(navigator); navigator.sendBeacon = (url, data) => (String(url).includes(MARK + '/api/') ? true : oB(url, data)); }
  window.EPChatLokal = { antwort: (t) => antwort({ lang: 'de', flags: {} }, t), search };
})();
