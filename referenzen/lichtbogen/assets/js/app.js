/* LICHTBOGEN · Lampe, Lichtwechsel, Stromleitung */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Hinweis-Blase ---------- */
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }
  window.LB = { toast: toast };

  /* ---------- Klick-Geräusch (standardmäßig stumm) ---------- */
  var soundOn = store.get('lb-sound') === '1';
  var actx;
  function click() {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var t = actx.currentTime;
      [[1800, 0, 0.018], [320, 0.012, 0.05]].forEach(function (p) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'square'; o.frequency.value = p[0];
        g.gain.setValueAtTime(0.12, t + p[1]);
        g.gain.exponentialRampToValueAtTime(0.0001, t + p[1] + p[2]);
        o.connect(g); g.connect(actx.destination);
        o.start(t + p[1]); o.stop(t + p[1] + p[2] + 0.01);
      });
    } catch (e) {}
  }
  $$('[data-sound]').forEach(function (b) {
    b.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    b.addEventListener('click', function () {
      soundOn = !soundOn;
      store.set('lb-sound', soundOn ? '1' : '0');
      b.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      click();
      toast(soundOn ? 'Schalter-Klick ist an.' : 'Schalter-Klick ist aus.');
    });
  });

  /* ---------- Licht ---------- */
  var lamps = $$('.lamp');
  var meta = $('meta[name="theme-color"]');
  var busy = false;
  function isLight() { return root.getAttribute('data-theme') !== 'dark'; }
  function apply(light) {
    root.setAttribute('data-theme', light ? 'light' : 'dark');
    if (meta) meta.setAttribute('content', light ? '#f4efe6' : '#080a0f');
    $$('[data-light]').forEach(function (b) {
      b.setAttribute('aria-pressed', light ? 'true' : 'false');
      b.setAttribute('aria-label', light ? 'Licht ausschalten' : 'Licht einschalten');
    });
  }
  function lampState(on, cls) {
    lamps.forEach(function (l) {
      l.classList.remove('flick', 'fade');
      l.classList.toggle('is-on', on);
      if (cls) {
        void l.offsetWidth;
        l.classList.add(cls);
        setTimeout(function () { l.classList.remove(cls); }, 700);
      }
    });
  }
  function setLight(light) {
    if (busy || light === isLight()) return;
    store.set('lb-theme', light ? 'light' : 'dark');
    root.classList.add('pulled');
    click();
    kick(light ? 5 : -5);
    if (reduce || !document.body.animate) { apply(light); lampState(light); return; }
    busy = true;
    lampState(light, light ? 'flick' : 'fade');
    var sw = document.createElement('div');
    sw.className = 'sweep ' + (light ? 'to-light' : 'to-dark');
    document.body.appendChild(sw);
    var from = light ? 'translateY(-140vh)' : 'translateY(140vh)';
    var a = sw.animate([{ transform: from }, { transform: 'translateY(0)' }],
      { duration: light ? 720 : 620, delay: light ? 260 : 120, easing: 'cubic-bezier(.55,0,.3,1)', fill: 'both' });
    a.onfinish = function () {
      apply(light);
      if (!light) {
        root.classList.add('surge');
        setTimeout(function () { root.classList.remove('surge'); }, 950);
      }
      var f = sw.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'ease-out', fill: 'forwards' });
      f.onfinish = function () { sw.remove(); busy = false; };
    };
  }
  if (store.get('lb-theme')) root.classList.add('pulled');
  apply(isLight());
  lampState(isLight());
  $$('[data-light]').forEach(function (b) {
    b.addEventListener('click', function () { setLight(!isLight()); });
  });

  /* Pendeln: gedämpfte Feder, nur transform */
  var ang = 0, vel = 0, raf = 0;
  var swings = $$('.lamp-swing');
  function kick(v) {
    if (reduce) return;
    vel += v;
    if (!raf) raf = requestAnimationFrame(swingStep);
  }
  function swingStep() {
    vel += -ang * 0.035;
    vel *= 0.965;
    ang += vel * 0.16;
    swings.forEach(function (s) { s.style.transform = 'rotate(' + ang.toFixed(3) + 'deg)'; });
    if (Math.abs(ang) < 0.02 && Math.abs(vel) < 0.02) {
      ang = 0; vel = 0; raf = 0;
      swings.forEach(function (s) { s.style.transform = ''; });
      return;
    }
    raf = requestAnimationFrame(swingStep);
  }

  /* Zugschnur: ziehen oder tippen */
  $$('.cord').forEach(function (cord) {
    var startY = 0, pull = 0, down = false, moved = false;
    function setPull(p) { pull = p; cord.style.setProperty('--pull', p.toFixed(1)); }
    function release() {
      var p = pull, v = 0;
      (function back() {
        v += -p * 0.22; v *= 0.72; p += v;
        if (Math.abs(p) < 0.3 && Math.abs(v) < 0.3) { setPull(0); return; }
        setPull(p); requestAnimationFrame(back);
      })();
    }
    cord.addEventListener('pointerdown', function (e) {
      down = true; moved = false; startY = e.clientY;
      try { cord.setPointerCapture(e.pointerId); } catch (x) {}
    });
    cord.addEventListener('pointermove', function (e) {
      if (!down) return;
      var d = Math.max(0, Math.min(46, (e.clientY - startY) * 0.8));
      if (d > 3) moved = true;
      setPull(d);
    });
    function up() {
      if (!down) return;
      down = false;
      if (moved && pull > 18) { cord._skip = true; setLight(!isLight()); }
      else if (moved) { cord._skip = true; }
      release();
      setTimeout(function () { cord._skip = false; }, 60);
    }
    cord.addEventListener('pointerup', up);
    cord.addEventListener('pointercancel', up);
    cord.addEventListener('click', function () {
      if (cord._skip) return;
      setPull(26); setTimeout(release, 90);
      setLight(!isLight());
    });
  });

  /* ---------- Persönlicher Link: ?firma=Elektro+Müller ---------- */
  (function () {
    var f = null;
    try {
      f = new URLSearchParams(location.search).get('firma');
      if (f) sessionStorage.setItem('lb-firma', f); else f = sessionStorage.getItem('lb-firma');
    } catch (e) {}
    if (!f) return;
    f = f.replace(/[<>]/g, '').trim().slice(0, 60);
    if (!f) return;
    $$('[data-firma]').forEach(function (el) { el.textContent = f; });
    root.classList.add('has-firma');
  })();

  /* ---------- Demo-Aktionen (nichts wird gesendet) ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-demo]');
    if (!el) return;
    e.preventDefault();
    toast(el.getAttribute('data-demo'));
  });

  /* ---------- Einblenden beim Scrollen ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Stromleitung + Sicherungen ---------- */
  var circuit = $('.circuit');
  if (circuit) {
    var live = $('.wire-live', circuit), spark = $('.spark', circuit);
    var kreise = $$('.kreis', circuit), box = $('.panelbox'), boxLinks = box ? $$('a', box) : [];
    var ticking = false, H = 0, top0 = 0, tops = [];
    function measure() {
      var r = circuit.getBoundingClientRect();
      H = r.height; top0 = r.top + scrollY;
      tops = kreise.map(function (k) { return k.offsetTop + 60; });
    }
    function update() {
      ticking = false;
      var tip = scrollY + innerHeight * 0.62 - top0;
      var p = Math.max(0, Math.min(1, tip / H));
      live.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      spark.style.transform = 'translateY(' + (p * H).toFixed(1) + 'px)';
      circuit.classList.toggle('live', p > 0.002 && p < 0.998);
      kreise.forEach(function (k, i) {
        var on = reduce || p * H >= tops[i];
        if (on !== k.classList.contains('on')) {
          k.classList.toggle('on', on);
          if (boxLinks[i]) boxLinks[i].classList.toggle('on', on);
        }
      });
      if (box) box.classList.toggle('show', p > 0.02 && p < 0.995);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    measure(); update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { measure(); onScroll(); });
    addEventListener('load', function () { measure(); onScroll(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); onScroll(); });
  }
})();
