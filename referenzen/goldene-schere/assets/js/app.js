(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var band = function (p, a, b, f) { f = f || .05; return Math.min(seg(p, a, a + f), 1 - seg(p, b - f, b)); };
  var root = document.documentElement;
  var M = window.GS || { img: {}, vid: {}, v: '0' };
  var mobile = function () { return innerWidth <= 900; };
  var portrait = function () { return innerWidth / innerHeight <= .8; };

  /* ---------- Bilder: nur vorhandene zeigen, nie Platzhalter ---------- */
  $$('img[data-img]').forEach(function (im) {
    var k = im.getAttribute('data-img'), wrap = im.closest('[data-img-wrap]') || im.closest('.ph');
    if (!M.img[k]) { if (wrap) wrap.hidden = true; else im.hidden = true; if (k === 'hero') root.classList.add('no-hero'); return; }
    var full = /^(hero|heroA|heroB|heroL2|heroL3|karriere|fadeStart)$/.test(k);
    im.src = 'assets/img/' + k + (mobile() && M.img[k] === 2 && (!full || portrait()) ? '-m' : '') + '.jpg?v=' + M.v;
    im.addEventListener('error', function () { if (wrap) wrap.hidden = true; else im.hidden = true; });
  });
  if (!$$('#laden figure').some(function (f) { return !f.hidden; })) $('#laden').hidden = true;

  /* ---------- Kopf, Menü ---------- */
  var burger = $('.burger');
  burger.addEventListener('click', function () {
    var o = root.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o); $('.menu').setAttribute('aria-hidden', !o);
  });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); burger.setAttribute('aria-expanded', false); }); });
  var toastT;
  function toast(t) { var el = $('.toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2800); }

  /* ---------- Geöffnet? (Europe/Berlin) ---------- */
  function berlin() {
    var f = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var o = {}; f.forEach(function (x) { o[x.type] = x.value; });
    var d = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].indexOf(o.weekday.replace('.', ''));
    return { d: d, m: (+o.hour % 24) * 60 + (+o.minute) };
  }
  function openInfo() {
    var b = berlin(), close = b.d >= 1 && b.d <= 5 ? 18 * 60 : (b.d === 6 ? 15 * 60 : 0), open = 9 * 60;
    var isOpen = close && b.m >= open && b.m < close;
    var nextTxt;
    if (isOpen) nextTxt = 'Jetzt geöffnet · bis ' + (close / 60) + ':00 Uhr';
    else if (close && b.m < open) nextTxt = 'Geschlossen · heute ab 9:00 Uhr';
    else nextTxt = 'Geschlossen · ' + (b.d === 6 || b.d === 0 ? 'Montag' : 'morgen') + ' ab 9:00 Uhr';
    if (b.d === 5 && !isOpen && b.m >= close) nextTxt = 'Geschlossen · Samstag ab 9:00 Uhr';
    root.classList.toggle('closed', !isOpen);
    $$('.open-long').forEach(function (e) { e.textContent = nextTxt; });
    $$('.open-short').forEach(function (e) { e.textContent = isOpen ? 'Jetzt offen' : 'Öffnungszeiten'; });
    $$('.hours tr').forEach(function (tr) {
      var r = tr.getAttribute('data-d').split('-').map(Number);
      tr.classList.toggle('today', r.length > 1 ? (b.d >= r[0] && b.d <= r[1]) : b.d === r[0]);
    });
  }
  openInfo(); setInterval(openInfo, 60000);

  /* ---------- Videos (scrubben) ---------- */
  function Film(sec) {
    var key = sec.getAttribute('data-vid'), v = $('.vid', sec), ok = false;
    if (key && M.vid[key]) {
      var s = document.createElement('source');
      s.src = 'assets/vid/' + key + (mobile() ? (portrait() ? '-p' : '-m') : '') + '.mp4?v=' + M.v; s.type = 'video/mp4'; v.appendChild(s);
      v.addEventListener('loadeddata', function () { ok = true; sec.classList.add('has-vid'); });
      v.load(); var pr = v.play && v.play(); if (pr && pr.then) pr.then(function () { v.pause(); }).catch(function () {});
    }
    var cur = 0;
    return function (p) {
      if (!ok || !v.duration) return;
      var want = (v.duration - .05) * p; cur += (want - cur) * .35;
      if (Math.abs(v.currentTime - cur) > .02) v.currentTime = cur;
    };
  }
  function prog(sec) {
    var r = sec.getBoundingClientRect(), h = sec.offsetHeight - innerHeight;
    return h > 0 ? clamp(-r.top / h, 0, 1) : 0;
  }
  function show(el, o, dy) { el.style.opacity = o.toFixed(3); el.style.transform = 'translateY(' + ((1 - o) * (dy == null ? 30 : dy)).toFixed(1) + 'px)'; }
  function near(sec) { var r = sec.getBoundingClientRect(); return r.bottom > -200 && r.top < innerHeight + 200; }

  /* 1 Hero: Clipper fährt durch, dahinter entsteht der Fade */
  var H = $('#hero'), hc = $('.hero-copy', H), hc2 = $('.hero-copy2', H), fw = $('.fadewall', H), cl = $('.clipper', H), hint = $('.scrollhint', H);
  function hero(p) {
    H.style.setProperty('--p', p.toFixed(3));
    var s = ease(seg(p, .05, .6));             // Fahrt des Clippers
    var x = -25 + 160 * s;                       // Vorderkante in % der Breite
    cl.style.setProperty('--cx', 'calc(' + (x - 75).toFixed(2) + 'vw)');
    fw.style.setProperty('--x', clamp(x, 0, 100).toFixed(2) + '%');
    show(hc, 1 - seg(p, .03, .16), -40);
    hint.style.opacity = (1 - seg(p, 0, .06)).toFixed(2);
    show(hc2, band(p, .42, 1.2, .1));
  }

  /* 2 Film Fade */
  var F = $('#fade'), ff = Film(F), fb = $$('.beat', F), fs = $$('.steps li', F);
  function fade(p) {
    ff(seg(p, 0, .94));
    $('.media', F).style.setProperty('--z', (1 + .08 * seg(p, 0, 1)).toFixed(3));
    F.style.setProperty('--p', seg(p, 0, .94).toFixed(3));
    var R = [[0, .2], [.22, .48], [.5, .74], [.78, 1.1]];
    fb.forEach(function (b, i) { show(b, band(p, R[i][0], R[i][1])); });
    var step = p < .22 ? 0 : p < .5 ? 1 : p < .78 ? 2 : 3;
    fs.forEach(function (li, i) { li.classList.toggle('on', i === step); });
  }

  /* 5 Kinetik */
  var K = $('#warum'), kl = $$('.kin li', K);
  function kin(p) {
    kl.forEach(function (li, i) {
      var o = ease(seg(p, .08 + i * .18, .26 + i * .18));
      li.style.setProperty('--o', o.toFixed(3)); li.style.opacity = (.08 + .92 * o).toFixed(3);
    });
  }

  /* 6 Fotofahrt */
  var R = $('#laden'), tr = $('.track', R);
  function sizeRide() {
    var extra = Math.max(0, tr.scrollWidth - innerWidth);
    R.style.height = (innerHeight + extra * 1.1) + 'px';
    R._extra = extra;
  }
  function ride(p) { tr.style.setProperty('--tx', (-(R._extra || 0) * ease(p)).toFixed(1) + 'px'); }

  /* 8 Karriere */
  var C = $('#karriere'), cf = Film(C), perks = $$('.perks li', C);
  function karriere(p) {
    cf(seg(p, 0, .9));
    $('.media', C).style.setProperty('--z', (1.04 - .04 * seg(p, 0, 1)).toFixed(3));
    perks.forEach(function (li, i) { var o = ease(seg(p, .15 + i * .14, .3 + i * .14)); li.style.opacity = o.toFixed(3); li.style.transform = 'translateX(' + ((1 - o) * 60).toFixed(1) + 'px)'; });
  }

  var raf = 0;
  function tick() {
    raf = 0;
    root.classList.toggle('scrolled', scrollY > 30);
    if (near(H)) hero(prog(H));
    if (near(F)) fade(prog(F));
    if (near(K)) kin(prog(K));
    if (!R.hidden && near(R)) ride(prog(R));
    if (near(C)) karriere(prog(C));
  }
  function req() { if (!raf) raf = requestAnimationFrame(tick); }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', function () { if (!R.hidden) sizeRide(); req(); });
  if (!R.hidden) sizeRide(); tick();
  $$('.track img').forEach(function (im) { im.addEventListener('load', function () { sizeRide(); req(); }); });
  setInterval(function () { if (F.classList.contains('has-vid')) req(); }, 120);

  /* ---------- Einblenden + Hochzählen ---------- */
  function count(el) {
    var to = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0), t0 = performance.now();
    (function step(t) {
      var k = ease(clamp((t - t0) / 1600, 0, 1)), v = to * k;
      el.textContent = dec ? v.toFixed(dec).replace('.', ',') : Math.round(v);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); $$('[data-count]', e.target).forEach(count); io.unobserve(e.target);
    });
  }, { threshold: .25 });
  $$('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* Kundenstimmen nacheinander */
  var qs = $$('.quotes blockquote'), qi = 0;
  setInterval(function () { qs[qi].classList.remove('on'); qi = (qi + 1) % qs.length; qs[qi].classList.add('on'); }, 6500);

  /* Wartezeit-Beispiel bewegt sich leicht */
  var wEl = $('[data-wait]'), wv = 15;
  setInterval(function () { wv = clamp(wv + (Math.random() < .5 ? -5 : 5), 5, 25); wEl.textContent = wv; }, 9000);

  /* ---------- Modals ---------- */
  function openM(id) { var m = $(id); if (m && m.showModal) m.showModal(); }
  $$('[data-open="queue"]').forEach(function (b) { b.addEventListener('click', function () { openM('#m-queue'); }); });
  $('.q-form').addEventListener('submit', function (e) {
    var sub = e.submitter && e.submitter.value;
    if (sub === 'close') return;
    var bad = $$('input', this).filter(function (i) { return !i.value.trim(); });
    if (bad.length) { e.preventDefault(); bad.forEach(function (i) { i.classList.remove('bad'); void i.offsetWidth; i.classList.add('bad'); }); return; }
    toast('Demo: Platz wäre jetzt gesichert.'); this.reset();
  });

  var ap = $('#m-apply'), cards = $$('.ap-card', ap), stepEl = $('.ap-step b', ap), barEl = $('.ap-bar i', ap);
  function goStep(i) {
    cards.forEach(function (c, k) { c.hidden = k !== i; });
    stepEl.textContent = Math.min(i + 1, 5); barEl.style.width = (Math.min(i + 1, 5) * 20) + '%';
  }
  $$('[data-open="apply"]').forEach(function (b) { b.addEventListener('click', function () { goStep(0); openM('#m-apply'); }); });
  $$('.opts button', ap).forEach(function (b) { b.addEventListener('click', function () { goStep(cards.indexOf(b.closest('.ap-card')) + 1); }); });
  $('.ap-contact', ap).addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = $$('input', this).filter(function (i) { return !i.value.trim(); });
    if (bad.length) { bad.forEach(function (i) { i.classList.remove('bad'); void i.offsetWidth; i.classList.add('bad'); }); return; }
    $('.ap-name', ap).textContent = this.vn.value.trim(); this.reset(); goStep(cards.length - 1);
  });
  $$('[data-close]', ap).forEach(function (b) { b.addEventListener('click', function () { ap.close(); }); });
})();
