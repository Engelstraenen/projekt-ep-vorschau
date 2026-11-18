/* Ofen & Olive · Tischreservierung (Demo, PROJEKT EX)
   Gemeinsame Komponente fuer Website und App. Keine Netzwerkanfragen, nichts wird versendet oder gespeichert. */
(() => {
  const ALLERGENE = ['Gluten', 'Krebstiere', 'Ei', 'Fisch', 'Erdnuss', 'Soja', 'Milch/Laktose', 'Schalenfrüchte', 'Sellerie', 'Senf', 'Sesam', 'Sulfite', 'Lupinen', 'Weichtiere'];
  const DIAET = ['vegetarisch', 'vegan', 'glutenfrei'];
  const ANLASS = ['Geburtstag', 'Jubiläum', 'Geschäftsessen', 'Date', 'Familienfeier', 'Sonstiges'];
  const SITZ = [['egal', 'Egal, Hauptsache gut'], ['fenster', 'Fenster'], ['terrasse', 'Terrasse'], ['ecke', 'Ruhige Ecke']];
  const STEPS = ['Termin', 'Gäste', 'Wünsche', 'Kontakt'];
  const MAXP = 10;
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ico = {
    check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    minus: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8 3.5v9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tick: '<svg class="rz-tick" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none"/><path d="M15 27l7 7 15-16" fill="none"/></svg>'
  };

  // Oeffnungszeiten: Mo–Do 11:30–22, Fr–Sa bis 23, So 12–21:30; letzte Reservierung 60 Min. vor Kuechenschluss
  function slotsFor(d) {
    const wd = d.getDay(), last = wd === 0 ? 20 * 60 + 30 : (wd === 5 || wd === 6) ? 22 * 60 : 21 * 60;
    const mk = (a, b) => { const o = []; for (let m = a; m <= b; m += 30) o.push(m); return o; };
    return { Mittag: mk(12 * 60, 14 * 60), Abend: mk(17 * 60 + 30, last) };
  }
  const full = (d, m) => ((d.getDate() * 31 + d.getMonth() * 7 + m / 30) * 2654435761 % 97) % 9 === 0; // Demo: einzelne Zeiten ausgebucht
  const hm = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

  function days() {
    const out = [], t = new Date(); t.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) { const d = new Date(t); d.setDate(t.getDate() + i); out.push(d); }
    return out;
  }
  function freeTimes(d, i) {
    const now = new Date(), s = slotsFor(d), cut = now.getHours() * 60 + now.getMinutes() + 60;
    const f = m => !(i === 0 && m < cut);
    return { Mittag: s.Mittag.filter(f), Abend: s.Abend.filter(f) };
  }
  const longDate = d => d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  function mount(root) {
    const theme = root.dataset.rz || 'site';
    const D = days();
    const firstDay = D.findIndex((d, i) => { const t = freeTimes(d, i); return t.Mittag.length + t.Abend.length; });
    const guest = () => ({ name: '', al: new Set(), di: new Set(), txt: '' });
    const fresh = () => ({ step: 1, done: false, day: firstDay, time: null, n: 2, guests: [guest(), guest()], tab: 0, kids: false, kidsN: 1, access: false, occ: null, seat: 'egal', wish: '', note: '', name: '', phone: '', err: {}, nr: '' });
    let R = fresh();
    const uid = 'rz' + Math.random().toString(36).slice(2, 7);

    root.classList.add('rz', 'rz--' + theme);
    root.innerHTML = `<div class="rz__live rz-vh" aria-live="polite"></div><div class="rz__body"></div>`;
    const body = root.querySelector('.rz__body'), live = root.querySelector('.rz__live');
    const say = m => { live.textContent = ''; setTimeout(() => live.textContent = m, 30); };

    const chip = (act, val, on, label, extra = '') => `<button type="button" class="rz-chip${on ? ' is-on' : ''}" data-act="${act}" data-v="${esc(val)}" data-k="${act}-${esc(val)}" aria-pressed="${on}"${extra}><span class="rz-chip__c">${ico.check}</span><span>${esc(label)}</span></button>`;
    const stepper = (act, n, min, max, label, unit) => `<div class="rz-step" role="group" aria-label="${label}"><button type="button" data-act="${act}" data-v="-1" data-k="${act}-m" aria-label="${label}: weniger"${n <= min ? ' disabled' : ''}>${ico.minus}</button><output aria-live="polite"><b>${n}</b> ${unit(n)}</output><button type="button" data-act="${act}" data-v="1" data-k="${act}-p" aria-label="${label}: mehr"${n >= max ? ' disabled' : ''}>${ico.plus}</button></div>`;
    const sw = (act, on, title, sub) => `<button type="button" class="rz-sw" role="switch" aria-checked="${on}" data-act="${act}" data-k="${act}"><span class="rz-sw__t"><b>${title}</b><small>${sub}</small></span><span class="rz-sw__k" aria-hidden="true"></span></button>`;
    const err = k => R.err[k] ? `<p class="rz-err" id="${uid}-e-${k}">${R.err[k]}</p>` : '';
    const inv = k => R.err[k] ? ` aria-invalid="true" aria-describedby="${uid}-e-${k}"` : '';
    const pers = n => n === 1 ? 'Person' : 'Personen';

    function head() {
      return `<ol class="rz-prog" aria-label="Fortschritt">${STEPS.map((s, i) => {
        const n = i + 1, cur = n === R.step, past = n < R.step;
        return `<li class="${cur ? 'is-cur' : past ? 'is-past' : ''}">${past ? `<button type="button" data-act="goto" data-v="${n}" data-k="goto-${n}" aria-label="Zurück zu Schritt ${n}: ${s}">` : `<span${cur ? ' aria-current="step"' : ''}>`}<i>${past ? ico.check : n}</i><em>${s}</em>${past ? '</button>' : '</span>'}</li>`;
      }).join('')}</ol>`;
    }

    function step1() {
      const d = D[R.day], t = freeTimes(d, R.day);
      const dayBtn = (x, i) => { const tt = freeTimes(x, i), none = !(tt.Mittag.length + tt.Abend.length);
        return `<button type="button" class="rz-day${i === R.day ? ' is-on' : ''}" data-act="day" data-v="${i}" data-k="day-${i}" aria-pressed="${i === R.day}"${none ? ' disabled' : ''} aria-label="${longDate(x)}${none ? ', keine Zeiten mehr frei' : ''}"><small>${i === 0 ? 'Heute' : i === 1 ? 'Morgen' : x.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')}</small><b>${x.getDate()}</b><small>${x.toLocaleDateString('de-DE', { month: 'short' })}</small></button>`; };
      const group = (lbl, arr) => arr.length ? `<div class="rz-tg"><p class="rz-tg__h">${lbl}</p><div class="rz-times">${arr.map(m => { const f = full(d, m); return `<button type="button" class="rz-time${R.time === m ? ' is-on' : ''}" data-act="time" data-v="${m}" data-k="time-${m}" aria-pressed="${R.time === m}"${f ? ' disabled aria-label="' + hm(m) + ' Uhr, ausgebucht"' : ` aria-label="${hm(m)} Uhr"`}>${hm(m)}${f ? '<small>ausgebucht</small>' : ''}</button>`; }).join('')}</div></div>` : '';
      return `<h3 class="rz-h" tabindex="-1">Wann dürfen wir <em>dich erwarten?</em></h3>
        <fieldset class="rz-f"><legend class="rz-l">Datum</legend><div class="rz-days" data-k="days">${D.map(dayBtn).join('')}</div></fieldset>
        <fieldset class="rz-f"><legend class="rz-l">Uhrzeit <span class="rz-l__s">${longDate(d)}</span></legend>${group('Mittag', t.Mittag)}${group('Abend', t.Abend)}${err('time')}</fieldset>
        <div class="rz-f rz-row"><div><p class="rz-l" id="${uid}-pl">Personen</p><p class="rz-hint">Ab ${MAXP + 1} Gästen planen wir gern persönlich mit dir.</p></div>${stepper('n', R.n, 1, MAXP, 'Personen', pers)}</div>`;
    }

    function guestPanel() {
      const g = R.guests[R.tab], i = R.tab;
      return `<div class="rz-gp" role="tabpanel" id="${uid}-gp" aria-labelledby="${uid}-t${i}">
        <label class="rz-in"><span>Name von Person ${i + 1} <i>optional</i></span><input data-in="gname" data-k="gname" value="${esc(g.name)}" autocomplete="off" placeholder="z. B. Giulia"></label>
        <p class="rz-l rz-l--s">Allergene</p><div class="rz-chips" role="group" aria-label="Allergene für Person ${i + 1}">${ALLERGENE.map(a => chip('al', a, g.al.has(a), a)).join('')}</div>
        <p class="rz-l rz-l--s">Ernährung</p><div class="rz-chips" role="group" aria-label="Ernährung für Person ${i + 1}">${DIAET.map(a => chip('di', a, g.di.has(a), a[0].toUpperCase() + a.slice(1))).join('')}</div>
        <label class="rz-in"><span>Weitere Unverträglichkeiten <i>optional</i></span><input data-in="gtxt" data-k="gtxt" value="${esc(g.txt)}" autocomplete="off" placeholder="z. B. kein Koriander, Histamin"></label>
        ${i < R.n - 1 ? `<button type="button" class="rz-link" data-act="tab" data-v="${i + 1}" data-k="nextp">Weiter zu Person ${i + 2} ${ico.next}</button>` : ''}
      </div>`;
    }
    function step2() {
      const tabs = R.guests.slice(0, R.n).map((g, i) => { const c = g.al.size + g.di.size + (g.txt.trim() ? 1 : 0);
        return `<button type="button" role="tab" id="${uid}-t${i}" class="rz-tab${i === R.tab ? ' is-on' : ''}" aria-selected="${i === R.tab}" aria-controls="${uid}-gp" tabindex="${i === R.tab ? 0 : -1}" data-act="tab" data-v="${i}" data-k="tab-${i}">${g.name.trim() ? esc(g.name.trim()) : 'Person ' + (i + 1)}${c ? `<i aria-label="${c} Angaben">${c}</i>` : ''}</button>`; }).join('');
      return `<h3 class="rz-h" tabindex="-1">Wer kommt <em>mit an den Tisch?</em></h3>
        <p class="rz-p">Sag uns pro Gast, worauf die Küche achten soll. Alle Angaben sind freiwillig.</p>
        <div class="rz-tabs" role="tablist" aria-label="Gäste">${tabs}</div>
        <div data-k="gp-wrap">${guestPanel()}</div>
        <div class="rz-f rz-sws">
          ${sw('kids', R.kids, 'Kinderstuhl', 'Wir stellen ihn vorab an den Tisch.')}
          ${R.kids ? `<div class="rz-row rz-row--sub"><p class="rz-l">Anzahl Kinderstühle</p>${stepper('kidsN', R.kidsN, 1, Math.max(1, Math.min(4, R.n - 1)), 'Kinderstühle', n => n === 1 ? 'Stuhl' : 'Stühle')}</div>` : ''}
          ${sw('access', R.access, 'Barrierefreier Platz', 'Rollstuhlgerecht, stufenloser Zugang zum Tisch.')}
        </div>`;
    }

    function step3() {
      return `<h3 class="rz-h" tabindex="-1">Was dürfen wir <em>vorbereiten?</em></h3>
        <fieldset class="rz-f"><legend class="rz-l">Anlass <i>optional</i></legend><div class="rz-chips">${ANLASS.map(a => chip('occ', a, R.occ === a, a)).join('')}</div></fieldset>
        <fieldset class="rz-f"><legend class="rz-l">Sitzwunsch</legend><div class="rz-chips">${SITZ.map(([v, l]) => chip('seat', v, R.seat === v, l)).join('')}</div><p class="rz-hint">Wir berücksichtigen Wünsche, so gut es der Abend erlaubt.</p></fieldset>
        <label class="rz-in rz-f"><span>Besondere Wünsche <i>optional</i></span><textarea data-in="wish" data-k="wish" rows="3" maxlength="400" placeholder="z. B. Torte zum Dessert, Blumen auf dem Tisch, eine kleine Überraschung">${esc(R.wish)}</textarea></label>
        <label class="rz-in"><span>Anmerkung <i>optional</i></span><input data-in="note" data-k="note" maxlength="160" value="${esc(R.note)}" autocomplete="off" placeholder="z. B. Wir kommen eventuell 15 Minuten später"></label>`;
    }

    function step4() {
      const d = D[R.day];
      return `<h3 class="rz-h" tabindex="-1">Auf welchen Namen <em>dürfen wir reservieren?</em></h3>
        <div class="rz-mini"><b>${longDate(d)}</b><span>${hm(R.time)} Uhr · ${R.n} ${pers(R.n)}${R.occ ? ' · ' + esc(R.occ) : ''}</span><button type="button" class="rz-link" data-act="goto" data-v="1" data-k="mini-edit">Ändern</button></div>
        <label class="rz-in rz-f"><span>Name</span><input data-in="name" data-k="name" value="${esc(R.name)}" autocomplete="name" placeholder="Vor- und Nachname"${inv('name')}></label>${err('name')}
        <label class="rz-in"><span>Telefon für Rückfragen</span><input data-in="phone" data-k="phone" type="tel" inputmode="tel" value="${esc(R.phone)}" autocomplete="tel" placeholder="z. B. 0171 2345678"${inv('phone')}></label>${err('phone')}
        <p class="rz-demo">Demo – es wird nichts versendet. Deine Angaben bleiben nur auf dieser Seite.</p>`;
    }

    function guestLine(g, i) {
      const bits = [...g.al].concat([...g.di].map(x => x[0].toUpperCase() + x.slice(1)));
      return `<li><b>${g.name.trim() ? esc(g.name.trim()) : 'Person ' + (i + 1)}</b>${bits.length || g.txt.trim() ? `<span class="rz-tags">${bits.map(b => `<i>${esc(b)}</i>`).join('')}</span>${g.txt.trim() ? `<span class="rz-q">„${esc(g.txt.trim())}“</span>` : ''}` : '<span class="rz-none">Keine Angaben</span>'}</li>`;
    }
    function doneView() {
      const d = D[R.day], seat = SITZ.find(s => s[0] === R.seat)[1];
      const row = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
      return `<div class="rz-done">
        <div class="rz-done__top">${ico.tick}<p class="rz-badge">Demo – es wird nichts versendet</p></div>
        <p class="rz-done__k">Reservierung ${R.nr}</p>
        <h3 class="rz-done__h" tabindex="-1">Dein Tisch <em>ist vorgemerkt.</em></h3>
        <p class="rz-done__when">${longDate(d)} · ${hm(R.time)} Uhr</p>
        <p class="rz-done__sub">${R.n} ${pers(R.n)}${R.occ ? ' · ' + esc(R.occ) : ''} · ${R.seat === 'egal' ? 'Platz nach Verfügbarkeit' : esc(seat)}</p>
        <dl class="rz-sum">
          ${row('Auf den Namen', esc(R.name.trim()))}${row('Telefon', esc(R.phone.trim()))}
          ${row('Anlass', R.occ ? esc(R.occ) : '—')}${row('Sitzwunsch', esc(seat))}
          ${row('Kinderstuhl', R.kids ? R.kidsN + (R.kidsN === 1 ? ' Kinderstuhl' : ' Kinderstühle') : 'Nein')}
          ${row('Barrierefreiheit', R.access ? 'Rollstuhlgerechter Platz' : 'Nicht nötig')}
          ${R.wish.trim() ? row('Besondere Wünsche', esc(R.wish.trim())) : ''}${R.note.trim() ? row('Anmerkung', esc(R.note.trim())) : ''}
        </dl>
        <p class="rz-l rz-l--s">Allergien &amp; Ernährung</p>
        <ul class="rz-guests" role="list">${R.guests.slice(0, R.n).map(guestLine).join('')}</ul>
        <p class="rz-fine">In echt käme jetzt eine Bestätigung per SMS. In dieser Demo wird nichts gesendet und nichts gespeichert.</p>
        <div class="rz-act"><button type="button" class="rz-btn rz-btn--ghost" data-act="edit" data-k="edit">Angaben ändern</button><button type="button" class="rz-btn" data-act="reset" data-k="reset">Neue Reservierung</button></div>
      </div>`;
    }

    function nav() {
      return `<div class="rz-nav">${R.step > 1 ? `<button type="button" class="rz-btn rz-btn--ghost rz-btn--icon" data-act="prev" data-k="prev" aria-label="Zurück">${ico.back}<span>Zurück</span></button>` : ''}<button type="button" class="rz-btn rz-btn--main" data-act="next" data-k="next">${R.step < 4 ? `Weiter <span class="rz-btn__s">· ${STEPS[R.step]}</span>${ico.next}` : 'Tisch reservieren'}</button></div>`;
    }

    function render(anim, focusHead) {
      const ae = document.activeElement, k = root.contains(ae) && ae.dataset ? ae.dataset.k : null;
      const daysEl = body.querySelector('.rz-days'), sx = daysEl ? daysEl.scrollLeft : 0;
      const tabsEl = body.querySelector('.rz-tabs'), tx = tabsEl ? tabsEl.scrollLeft : 0;
      body.innerHTML = R.done ? doneView() : `${head()}<div class="rz-pane">${[step1, step2, step3, step4][R.step - 1]()}</div>${nav()}`;
      const nd = body.querySelector('.rz-days'); if (nd) nd.scrollLeft = anim ? 0 : sx;
      const nt = body.querySelector('.rz-tabs'); if (nt) nt.scrollLeft = tx;
      if (anim && !reduced()) { const p = body.querySelector('.rz-pane, .rz-done'); p.classList.add('is-enter'); requestAnimationFrame(() => requestAnimationFrame(() => p.classList.remove('is-enter'))); }
      if (focusHead) { const h = body.querySelector('.rz-h, .rz-done__h'); h && h.focus({ preventScroll: true }); intoView(); }
      else if (k) { const el = body.querySelector(`[data-k="${CSS.escape(k)}"]`); if (el && !el.disabled) el.focus({ preventScroll: true }); }
      if (nd && anim) { const on = nd.querySelector('.is-on'); if (on && on.offsetLeft > nd.clientWidth - 60) nd.scrollLeft = on.offsetLeft - 16; }
    }
    function intoView() {
      const sc = root.closest('.view');
      if (sc) { sc.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); return; }
      const r = root.getBoundingClientRect(); if (r.top < 60 || r.top > innerHeight * .6) root.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    }

    function validate(step) {
      const e = {};
      if (step === 1 && R.time == null) e.time = 'Bitte wähle noch eine Uhrzeit.';
      if (step === 4) {
        if (R.name.trim().length < 2) e.name = 'Bitte gib deinen Namen an, damit wir den Tisch zuordnen können.';
        const p = R.phone.trim(), digits = p.replace(/\D/g, '').length;
        if (!p) e.phone = 'Bitte gib eine Telefonnummer für Rückfragen an.';
        else if (!/^\+?[\d\s/()-]+$/.test(p) || digits < 6 || digits > 16) e.phone = 'Diese Nummer sieht unvollständig aus. Bitte mit Vorwahl, z. B. 0171 2345678.';
      }
      R.err = e; return !Object.keys(e).length;
    }
    function fail() {
      render(false);
      const first = body.querySelector('[aria-invalid="true"]') || body.querySelector('.rz-err');
      const msgs = Object.values(R.err); say(msgs.join(' '));
      if (first && first.matches('input')) first.focus(); else if (first) { const t = body.querySelector('.rz-time:not(:disabled)'); t && t.focus(); first.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); }
    }
    function goStep(n) { R.step = n; R.err = {}; render(true, true); say(`Schritt ${n} von 4: ${STEPS[n - 1]}`); }

    root.addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b || !root.contains(b) || b.disabled) return;
      const a = b.dataset.act, v = b.dataset.v, g = R.guests[R.tab];
      switch (a) {
        case 'day': R.day = +v; { const t = freeTimes(D[R.day], R.day); if (R.time != null && (![...t.Mittag, ...t.Abend].includes(R.time) || full(D[R.day], R.time))) R.time = null; } break;
        case 'time': R.time = +v; delete R.err.time; break;
        case 'n': R.n = Math.min(MAXP, Math.max(1, R.n + +v)); while (R.guests.length < R.n) R.guests.push(guest()); if (R.tab >= R.n) R.tab = R.n - 1; R.kidsN = Math.max(1, Math.min(R.kidsN, R.n - 1)); break;
        case 'kidsN': R.kidsN = Math.max(1, Math.min(4, R.n - 1, R.kidsN + +v)); break;
        case 'kids': R.kids = !R.kids; if (R.n < 2) { R.kids = false; say('Ein Kinderstuhl ist ab zwei Personen möglich.'); } break;
        case 'access': R.access = !R.access; break;
        case 'al': g.al.has(v) ? g.al.delete(v) : g.al.add(v); break;
        case 'di': g.di.has(v) ? g.di.delete(v) : g.di.add(v); if (v === 'vegan' && g.di.has('vegan')) g.di.delete('vegetarisch'); if (v === 'vegetarisch' && g.di.has('vegetarisch')) g.di.delete('vegan'); break;
        case 'tab': R.tab = +v; render(false); { const t = body.querySelector(`#${uid}-t${R.tab}`); t.focus({ preventScroll: true }); t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } return;
        case 'occ': R.occ = R.occ === v ? null : v; break;
        case 'seat': R.seat = v; break;
        case 'goto': goStep(+v); return;
        case 'prev': goStep(R.step - 1); return;
        case 'next':
          if (!validate(R.step)) return fail();
          if (R.step < 4) return goStep(R.step + 1);
          R.nr = 'OO-' + D[R.day].toISOString().slice(5, 10).replace('-', '') + '-' + Math.floor(100 + Math.random() * 900);
          R.done = true; render(true, true); say('Reservierung vorgemerkt. Demo, es wird nichts versendet.');
          try { sessionStorage.setItem('oo-reservierung-demo', JSON.stringify({ nr: R.nr })); } catch (_) {}
          return;
        case 'edit': R.done = false; goStep(4); return;
        case 'reset': R = fresh(); render(true, true); return;
      }
      render(false);
    });
    root.addEventListener('input', e => {
      const f = e.target.dataset && e.target.dataset.in; if (!f) return;
      const v = e.target.value, g = R.guests[R.tab];
      if (f === 'gname') { g.name = v; const t = body.querySelector(`#${uid}-t${R.tab}`); if (t) { const c = t.querySelector('i'); t.textContent = v.trim() || 'Person ' + (R.tab + 1); if (c) t.appendChild(c); } }
      else if (f === 'gtxt') g.txt = v;
      else R[f] = v;
      if (R.err[f]) { delete R.err[f]; e.target.removeAttribute('aria-invalid'); const m = body.querySelector(`#${uid}-e-${f}`); if (m) m.remove(); }
    });
    root.addEventListener('keydown', e => {
      const t = e.target;
      if (t.getAttribute && t.getAttribute('role') === 'tab' && /^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) {
        e.preventDefault(); const n = R.n; R.tab = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (R.tab + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
        render(false); body.querySelector(`#${uid}-t${R.tab}`).focus();
      }
      if (e.key === 'Enter' && t.matches && t.matches('input')) { e.preventDefault(); const nx = body.querySelector('[data-act="next"]'); nx && nx.click(); }
    });
    render(false);
    return { open() { intoView(); } };
  }

  window.OOReserve = { mount };
  document.querySelectorAll('[data-rz]').forEach(el => el.__rz = mount(el));
})();
// Website: schwebenden Bestell-Button ausblenden, solange das Formular im Blick ist
(() => {
  const sec = document.querySelector('.res'); if (!sec || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => document.body.classList.toggle('rz-near', e.isIntersecting), { rootMargin: '-10% 0px -10% 0px' }).observe(sec);
})();
// Direktlink …/#reservierung auf der Website: nach dem Nachladen von Karte und Bildern sauber ankommen
addEventListener('load', () => {
  const t = location.hash === '#reservierung' && document.getElementById('reservierung');
  if (!t || t.closest('.view')) return;
  let moved = false; const stop = () => moved = true;
  ['wheel', 'touchstart', 'keydown'].forEach(e => addEventListener(e, stop, { once: true, passive: true }));
  const snap = () => { if (moved) return; const r = t.getBoundingClientRect().top; if (Math.abs(r) > 2) scrollTo({ top: scrollY + r, behavior: 'instant' }); };
  [0, 120, 400, 900, 1600].forEach(ms => setTimeout(snap, ms));
});
