(() => {
  const C = window.OO_CONFIG, base = '../ofen-olive/';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const eur = n => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  const pad = n => String(n).padStart(2, '0');
  const S = { mode: 'abholung', cart: [], cur: null, size: 0, qty: 1, extras: new Set(), slot: 0, area: C.liefergebiet[0] };
  const BIG = 3;

  // Branding aus config
  $$('[data-logo]').forEach(i => { i.src = base + C.logoHell; i.alt = C.name; });
  $$('[data-logo-dark]').forEach(i => { i.src = base + C.logo; i.alt = C.name; });
  $$('[data-icon]').forEach(i => { i.src = base + (C.icon || C.logo); });
  $$('[data-name]').forEach(e => e.textContent = C.name);
  $$('[data-status]').forEach(e => e.textContent = C.status);
  document.title = `${C.name} · Bestell-App · Demo PROJEKT EX`;
  $('#area').innerHTML = C.liefergebiet.map(a => `<option>${a}</option>`).join('');

  // Views
  const views = Object.fromEntries($$('.view').map(v => [v.dataset.view, v]));
  const order = ['list', 'cart', 'done'];
  Object.values(views).forEach(v => { v.hidden = false; if (!v.classList.contains('is-on')) { v.classList.add('is-next'); v.inert = true; } });
  let now = 'list';
  function go(to) {
    if (to === now) return;
    const fwd = order.indexOf(to) > order.indexOf(now), a = views[now], b = views[to];
    b.classList.toggle('is-next', fwd); b.classList.toggle('is-back', !fwd);
    b.offsetWidth; // Startzustand festschreiben
    b.classList.remove('is-next', 'is-back'); b.classList.add('is-on'); b.inert = false; b.scrollTop = 0;
    a.classList.remove('is-on'); a.classList.add(fwd ? 'is-back' : 'is-next'); a.inert = true;
    now = to; syncBar();
    b.querySelectorAll('video').forEach(v => v.play().catch(() => {}));
  }
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

  // Segmente
  function seg(el, i) { el.dataset.i = i; [...el.querySelectorAll('button')].forEach((b, k) => b.setAttribute('aria-checked', k === i)); }
  function setMode(m) { S.mode = m; $$('[data-mode]').forEach(b => { if (b.dataset.mode === m) seg(b.parentElement, [...b.parentElement.querySelectorAll('button')].indexOf(b)); }); $('#deliv').hidden = m !== 'lieferung'; renderSlots(); renderSum(); }
  $$('[data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

  // Liste
  $('#list').innerHTML = C.pizzen.map(p => `<li><button type="button" class="card" data-id="${p.id}"><img src="${base + p.bild}" width="96" height="96" alt="" loading="lazy"><div><h4>${p.name}</h4><p>${p.text}</p><div class="card__row"><span class="card__p">${eur(p.preis)}</span><span class="card__in" data-in="${p.id}"></span><span class="card__plus" aria-hidden="true">+</span></div></div></button></li>`).join('');
  $$('.card').forEach(c => c.addEventListener('click', () => openSheet(c.dataset.id)));

  // Detail-Sheet
  const sheet = $('#sheet'), scrim = $('#scrim');
  const extraHTML = C.extras.map(x => `<li><button type="button" class="xt" aria-pressed="false" data-x="${x.id}"><span class="xt__box"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg></span>${x.name}<span class="xt__p">+${eur(x.preis)}</span></button></li>`).join('');
  $('#extras').innerHTML = extraHTML;
  $$('.xt').forEach(b => b.addEventListener('click', () => { const id = b.dataset.x; S.extras.has(id) ? S.extras.delete(id) : S.extras.add(id); b.setAttribute('aria-pressed', S.extras.has(id)); price(); }));
  $$('#size button').forEach((b, i) => b.addEventListener('click', () => { S.size = i; seg($('#size'), i); price(); }));
  $('#qMinus').addEventListener('click', () => { S.qty = Math.max(1, S.qty - 1); price(); });
  $('#qPlus').addEventListener('click', () => { S.qty = Math.min(9, S.qty + 1); price(); });
  const unit = () => S.cur.preis + (S.size ? BIG : 0) + [...S.extras].reduce((s, id) => s + C.extras.find(x => x.id === id).preis, 0);
  function price() { $('#qN').textContent = S.qty; $('#addP').textContent = eur(unit() * S.qty); }
  let lastFocus = null;
  function openSheet(id) {
    S.cur = C.pizzen.find(p => p.id === id); if (!S.cur) return;
    S.size = 0; S.qty = 1; S.extras.clear(); seg($('#size'), 0);
    $$('.xt').forEach(b => b.setAttribute('aria-pressed', 'false'));
    $('#dImg').src = base + S.cur.bild; $('#dImg').alt = S.cur.name; $('#dName').textContent = S.cur.name; $('#dText').textContent = S.cur.text;
    sheet.querySelector('.sheet__scroll').scrollTop = 0; price();
    lastFocus = document.activeElement; scrim.hidden = false; sheet.hidden = false; sheet.inert = false;
    setTimeout(() => $('#sheetX').focus({ preventScroll: true }), 50);
  }
  function closeSheet() { scrim.hidden = true; sheet.hidden = true; sheet.inert = true; lastFocus && lastFocus.focus({ preventScroll: true }); }
  sheet.inert = true;
  $('#sheetX').addEventListener('click', closeSheet); scrim.addEventListener('click', closeSheet);
  addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#lock').hidden) closeLock(); else if (!sheet.hidden) closeSheet(); } });
  // Wischen zum Schliessen
  let y0 = null, t0 = 0;
  sheet.addEventListener('pointerdown', e => { if (sheet.querySelector('.sheet__scroll').scrollTop > 0 || e.target.closest('button')) return; y0 = e.clientY; t0 = performance.now(); sheet.style.transition = 'none'; });
  addEventListener('pointermove', e => { if (y0 === null) return; const d = Math.max(0, e.clientY - y0); sheet.style.transform = `translateY(${d}px)`; });
  addEventListener('pointerup', e => { if (y0 === null) return; const d = e.clientY - y0, v = d / (performance.now() - t0); sheet.style.transition = ''; sheet.style.transform = ''; y0 = null; if (d > 140 || v > .5) closeSheet(); });

  $('#addBtn').addEventListener('click', () => {
    const ex = [...S.extras].map(id => C.extras.find(x => x.id === id));
    S.cart.push({ p: S.cur, size: S.size, ex, qty: S.qty, unit: unit() });
    closeSheet(); syncBar(true); toast(`${S.qty > 1 ? S.qty + '× ' : ''}${S.cur.name} im Warenkorb`);
  });

  // Warenkorb
  const sub = () => S.cart.reduce((s, i) => s + i.unit * i.qty, 0);
  const count = () => S.cart.reduce((s, i) => s + i.qty, 0);
  function syncBar(bump) {
    const bar = $('#cartbar'); bar.hidden = !(count() && now === 'list');
    $('#cartN').textContent = count(); $('#cartS').textContent = eur(sub());
    if (bump) { bar.classList.remove('bump'); bar.offsetWidth; bar.classList.add('bump'); }
    C.pizzen.forEach(p => { const n = S.cart.filter(i => i.p.id === p.id).reduce((s, i) => s + i.qty, 0); const el = document.querySelector(`[data-in="${p.id}"]`); if (el) el.textContent = n ? `${n} im Korb` : ''; });
  }
  $('#cartbar').addEventListener('click', () => { renderCart(); go('cart'); });
  function renderCart() {
    $('#cart').innerHTML = S.cart.map((i, k) => `<li class="ci"><img src="${base + i.p.bild}" width="56" height="56" alt=""><div><h4>${i.qty > 1 ? i.qty + '× ' : ''}${i.p.name}</h4><p>${i.size ? 'Groß 36 cm' : 'Klassisch 30 cm'}${i.ex.length ? ' · ' + i.ex.map(x => x.name).join(', ') : ''}</p></div><div class="ci__r">${eur(i.unit * i.qty)}<button type="button" class="ci__del" data-del="${k}">Entfernen</button></div></li>`).join('');
    $$('[data-del]').forEach(b => b.addEventListener('click', () => { S.cart.splice(+b.dataset.del, 1); if (!S.cart.length) { go('list'); return; } renderCart(); }));
    renderSlots(); renderSum(); syncBar();
  }
  function slotTimes() {
    const lead = S.mode === 'lieferung' ? C.lieferMin : C.abholMin, d = new Date(Date.now() + lead * 6e4);
    d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
    return [0, 15, 30, 45].map(m => new Date(d.getTime() + m * 6e4));
  }
  const hm = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  function renderSlots() {
    const t = slotTimes();
    $('#slots').innerHTML = t.map((d, i) => `<button type="button" class="slot" role="radio" aria-checked="${i === S.slot}" data-s="${i}">${i === 0 ? 'Schnellstmöglich · ' : ''}${hm(d)}</button>`).join('');
    $$('.slot').forEach(b => b.addEventListener('click', () => { S.slot = +b.dataset.s; renderSlots(); }));
  }
  function renderSum() {
    const fee = S.mode === 'lieferung' ? C.liefergebuehr : 0, s = sub(), short = S.mode === 'lieferung' && s < C.mindestwert;
    $('#sum').innerHTML = `<div><dt>Zwischensumme</dt><dd>${eur(s)}</dd></div>${fee ? `<div><dt>Liefergebühr</dt><dd>${eur(fee)}</dd></div>` : ''}${short ? `<div class="sum__hint"><dt>Mindestbestellwert ${eur(C.mindestwert)}</dt><dd>noch ${eur(C.mindestwert - s)}</dd></div>` : ''}<div class="sum__t"><dt>Gesamt</dt><dd>${eur(s + fee)}</dd></div>`;
    validate();
  }
  function validate() {
    const ok = S.cart.length && $('#name').value.trim().length > 1 && (S.mode === 'abholung' || ($('#street').value.trim().length > 3 && sub() >= C.mindestwert));
    const b = $('#confirm'); b.disabled = !ok;
    b.textContent = ok ? `Bestellung bestätigen · ${eur(sub() + (S.mode === 'lieferung' ? C.liefergebuehr : 0))}` : ($('#name').value.trim().length < 2 ? 'Bitte Namen eintragen' : S.mode === 'lieferung' && sub() < C.mindestwert ? 'Mindestbestellwert nicht erreicht' : 'Bitte Adresse eintragen');
  }
  ['#name', '#street'].forEach(s => $(s).addEventListener('input', validate));
  $('#area').addEventListener('change', e => S.area = e.target.value);

  // Bestaetigung + Push
  let timers = [];
  $('#confirm').addEventListener('click', () => {
    const t = slotTimes()[S.slot], nr = 'OO-' + Math.floor(1000 + Math.random() * 9000), first = S.cart[0].p.name;
    const label = S.mode === 'lieferung' ? `Lieferung gegen ${hm(t)}` : `Abholung ${hm(t)}`;
    $('#doneNr').textContent = `Bestellung #${nr}`; $('#doneWhen').textContent = label;
    $('#doneLast').textContent = S.mode === 'lieferung' ? 'Ist unterwegs nach ' + $('#area').value + '.' : 'Liegt an der Theke bereit.';
    const title = S.mode === 'lieferung' ? `Ihre ${first} ist unterwegs` : `Ihre ${first} ist fertig`;
    const sub2 = S.mode === 'lieferung' ? `Fahrer ist auf dem Weg · #${nr}` : `Abholbereit an der Theke · #${nr}`;
    ['#pushT', '#lockT'].forEach(s => $(s).textContent = title); ['#pushS', '#lockS'].forEach(s => $(s).textContent = sub2);
    $('#lockTime').textContent = hm(t);
    $('#lockDate').textContent = t.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    const steps = $$('#track li'); steps.forEach((l, i) => l.classList.toggle('is-on', i === 0));
    timers.forEach(clearTimeout);
    timers = [setTimeout(() => steps[1].classList.add('is-on'), 2600), setTimeout(() => steps[2].classList.add('is-on'), 5200), setTimeout(showPush, 5600)];
    go('done');
  });
  function showPush() { const p = $('#push'); p.hidden = false; timers.push(setTimeout(() => p.hidden = true, 5200)); }
  $('#push').addEventListener('click', () => { $('#push').hidden = true; openLock(); });
  function openLock() { $('#lock').hidden = false; $('#lock').inert = false; $('#lockX').focus({ preventScroll: true }); }
  function closeLock() { $('#lock').hidden = true; $('#lock').inert = true; }
  $('#lock').inert = true;
  $('#lockBtn').addEventListener('click', openLock); $('#lockX').addEventListener('click', closeLock);
  $('#again').addEventListener('click', () => { timers.forEach(clearTimeout); $('#push').hidden = true; S.cart = []; S.slot = 0; $('#name').value = ''; $('#street').value = ''; go('list'); });

  let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('is-on'), 1800); }

  setMode('abholung');
  const q = new URLSearchParams(location.search).get('pizza'); if (q) setTimeout(() => openSheet(q), 350);
})();
