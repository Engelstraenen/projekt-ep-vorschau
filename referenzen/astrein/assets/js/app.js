(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var IMG = window.IMG || {}, VID = window.VID || {};
  var root = document.documentElement;
  var mobile = function () { return innerWidth < 700 && innerHeight > innerWidth; };
  var pick = function (o) { return o ? (mobile() && o.m ? o.m : o.d) : null; };

  /* ---------- Bilder: fehlende werden ausgeblendet (nie Platzhalter) ---------- */
  $$('[data-need]').forEach(function (el) {
    var k = el.getAttribute('data-need');
    if (!IMG[k]) { el.hidden = true; el.setAttribute('data-missing', ''); return; }
    if (el.tagName === 'IMG') { el.src = pick(IMG[k]); el.decoding = 'async'; }
  });
  $$('img[data-src]').forEach(function (el) { var o = IMG[el.getAttribute('data-src')]; if (o) el.src = pick(o); });

  /* ---------- Persönlicher Link: ?firma=Tischlerei+Müller ---------- */
  (function () {
    var f = null;
    try { f = new URLSearchParams(location.search).get('firma'); if (f) sessionStorage.setItem('as-firma', f); else f = sessionStorage.getItem('as-firma'); } catch (e) {}
    if (!f) return;
    $$('[data-firma]').forEach(function (el) { el.textContent = f; });
    root.classList.add('has-firma');
  })();

  /* ---------- Kopfzeile + Menü ---------- */
  var top = $('#top'), burger = $('#burger');
  burger.addEventListener('click', function () {
    var o = root.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Menü schließen' : 'Menü öffnen');
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- Film-Kapitel ---------- */
  var films = $$('.film').map(function (sec) {
    var key = sec.getAttribute('data-film'), v = $('video', sec), poster = $('.poster', sec);
    var src = pick(VID[key]);
    if (src) {
      v.src = src;
      v.addEventListener('loadeddata', function () { v.classList.add('ready'); }, { once: true });
    } else { v.remove(); v = null; }
    if (!v && (!poster || poster.hidden)) sec.classList.add('empty');
    return { sec: sec, v: v, steps: $$('.steps li', sec), says: $$('[data-at]:not(li)', sec), laser: $('.laser', sec), frames: $$('.frame:not([data-missing])', sec) };
  });

  function progress(sec) {
    var r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
    if (span <= 0) return r.top <= 0 ? 1 : 0;
    return Math.min(1, Math.max(0, -r.top / span));
  }

  var ticking = false;
  function frame() {
    ticking = false;
    top.classList.toggle('solid', scrollY > 40);
    films.forEach(function (f) {
      if (f.sec.classList.contains('empty')) { f.steps.concat(f.says).forEach(function (e) { e.classList.add('on'); }); return; }
      var r = f.sec.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      var p = progress(f.sec);
      if (f.v && f.v.duration) { var t = p * (f.v.duration - .05); if (Math.abs(f.v.currentTime - t) > .03) f.v.currentTime = t; }
      var cur = -1;
      f.steps.forEach(function (li, i) { if (p >= +li.getAttribute('data-at')) cur = i; });
      f.steps.forEach(function (li, i) { li.classList.toggle('on', i <= cur); });
      // Ohne Film: Stationsbilder überblenden (Bild des aktuellen Schritts, sonst das letzte vorhandene davor)
      if (!f.v && f.frames.length) {
        var show = null;
        f.frames.forEach(function (im) { if (+im.getAttribute('data-step') <= Math.max(cur, 0)) show = im; });
        f.frames.forEach(function (im) { im.classList.toggle('on', im === (show || f.frames[0])); });
      }
      f.says.forEach(function (e) { e.classList.toggle('on', p >= +e.getAttribute('data-at')); });
      var copy = $('.hero-copy,.chap-copy', f.sec);
      if (copy) { var fade = Math.max(0, 1 - Math.max(0, p - .08) * 6); copy.style.opacity = fade; copy.style.transform = 'translateY(' + (1 - fade) * -40 + 'px)'; }
      if (f.laser) $$('.l', f.laser).forEach(function (g, i) {
        var a = .04 + i * .05, q = Math.min(1, Math.max(0, (p - a) / .08));
        if (p > .32) q = Math.max(0, 1 - (p - .32) / .06);
        g.style.setProperty('--p', q);
      });
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  /* ---------- Holzlabor ---------- */
  var FILTER = { eiche: 'none', nussbaum: 'sepia(.35) saturate(1.1) brightness(.55) contrast(1.1)', esche: 'brightness(1.15) saturate(.7)', kirsche: 'sepia(.3) saturate(1.5) hue-rotate(-12deg) brightness(.82)', ulme: 'sepia(.25) brightness(.85) contrast(1.1)' };
  var base = $('.table-view .base'), over = $('.table-view .over');
  $$('.woods button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.woods button').forEach(function (x) { x.setAttribute('aria-checked', x === b); });
      var w = b.getAttribute('data-wood'), o = IMG['m1-tisch-' + w];
      if (o && w !== 'eiche') { over.src = pick(o); over.classList.add('on'); base.style.filter = 'none'; }
      else { over.classList.remove('on'); if (base) base.style.filter = FILTER[w]; }
    });
  });

  /* ---------- Anfrage (Demo, sendet nichts) ---------- */
  var fotos = $('#fotos');
  fotos.addEventListener('change', function () { var n = fotos.files.length; $('#fotos-n').textContent = n ? n + (n === 1 ? ' Foto' : ' Fotos') + ' ausgewählt' : 'noch keine Fotos'; });
  $('#req').addEventListener('submit', function (e) { e.preventDefault(); $('#req-ok').hidden = false; });

  /* ---------- Bewerbung in 60 Sekunden ---------- */
  var Q = [
    ['Was reizt dich?', ['Möbel bauen', 'Einbau beim Kunden']],
    ['Lieber Werkstatt oder Montage?', ['Werkstatt', 'Montage', 'Beides']],
    ['Wo stehst du?', ['Schule', 'Ausbildung', 'Geselle/Gesellin', 'Quereinstieg']],
    ['Führerschein?', ['Ja', 'Mache ich gerade', 'Noch nicht']],
    ['Ab wann?', ['Sofort', 'Nächster Sommer', 'Später']]
  ];
  var cards = $('#cards'), prog = $('#prog'), qn = $('#qn'), idx = 0, started = false, secs = 60, timer;
  function card(i) {
    var c = document.createElement('div'); c.className = 'card';
    if (i < Q.length) {
      c.innerHTML = '<span class="stamp">OK</span><p class="fine">Frage ' + (i + 1) + '</p><h3>' + Q[i][0] + '</h3><div class="opts">' + Q[i][1].map(function (o) { return '<button type="button">' + o + '</button>'; }).join('') + '</div>';
    } else {
      c.innerHTML = '<h3>Fast fertig.</h3><input placeholder="Vorname" autocomplete="given-name"><input placeholder="Nachname" autocomplete="family-name"><input placeholder="Wohnort" autocomplete="address-level2"><input placeholder="E-Mail" type="email" autocomplete="email"><input placeholder="Handynummer" type="tel" autocomplete="tel"><button class="btn" type="button">Abschicken</button><p class="fine">Demo: Es wird nichts gesendet.</p>';
    }
    return c;
  }
  function show() {
    cards.innerHTML = '';
    var c = card(idx); cards.appendChild(c);
    if (idx + 1 <= Q.length) { var n = card(idx + 1); n.classList.add('next'); n.setAttribute('aria-hidden', 'true'); cards.insertBefore(n, c); }
    prog.style.width = (idx / (Q.length + 1) * 100) + '%';
    qn.textContent = idx < Q.length ? 'Frage ' + (idx + 1) + ' von ' + Q.length : 'Kontakt';
    $$('.opts button', c).forEach(function (b, k) { b.addEventListener('click', function () { go(c, k % 2 ? 'l' : ''); }); });
    var send = $('.btn', c);
    if (send) send.addEventListener('click', function () { prog.style.width = '100%'; clearInterval(timer); c.innerHTML = '<h3>Danke!</h3><p>Im Echtbetrieb meldet sich der Meister innerhalb von 24 Stunden. Demo: Es wurde nichts gesendet.</p>'; });
    swipe(c);
  }
  function go(c, dir) { if (!started) start(); c.classList.add('gone'); if (dir) c.classList.add(dir); idx++; setTimeout(show, 380); }
  function swipe(c) {
    if (idx >= Q.length) return;
    var x0 = null;
    c.addEventListener('pointerdown', function (e) { if (e.target.tagName !== 'BUTTON') x0 = e.clientX; });
    c.addEventListener('pointerup', function (e) { if (x0 !== null && Math.abs(e.clientX - x0) > 60) go(c, e.clientX < x0 ? 'l' : ''); x0 = null; });
  }
  function start() {
    started = true;
    timer = setInterval(function () { secs = Math.max(0, secs - 1); $('#sec').textContent = secs; $('.clock .ring').style.setProperty('--o', (119.4 * (60 - secs) / 60).toFixed(1)); if (!secs) clearInterval(timer); }, 1000);
  }
  show();

  /* ---------- Bewertungen: zählen, Sterne, ruhige Karten ---------- */
  var counted = false;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting || counted) return; counted = true;
      $$('[data-count]').forEach(function (b) {
        var to = +b.getAttribute('data-count'), dec = +(b.getAttribute('data-dec') || 0), t0 = performance.now();
        (function step(t) { var k = Math.min(1, (t - t0) / 1600), v = to * (1 - Math.pow(1 - k, 3)); b.textContent = v.toFixed(dec).replace('.', ','); if (k < 1) requestAnimationFrame(step); })(t0);
      });
      $$('.portal').forEach(function (p) { var s = +$('[data-dec]', p).getAttribute('data-count'); $('.stars', p).style.setProperty('--f', s / 5); });
    });
  }, { threshold: .35 });
  io.observe($('#bewertungen'));
  var qs = $$('#quotes figure'), qi = 0;
  if (qs.length) { qs[0].classList.add('on'); setInterval(function () { qs[qi].classList.remove('on'); qi = (qi + 1) % qs.length; setTimeout(function () { qs[qi].classList.add('on'); }, 700); }, 6000); }

  /* ---------- Impressum ---------- */
  $$('[data-modal]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var d = document.getElementById(a.getAttribute('data-modal')); if (d && d.showModal) d.showModal(); }); });
})();
