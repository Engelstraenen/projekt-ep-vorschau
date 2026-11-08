(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.add('gs');

  /* Lenis */
  var lenis;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    }
  }

  /* Kopf */
  var head = $('[data-head]'), last = 0;
  if (head) {
    addEventListener('scroll', function () {
      var y = scrollY;
      var open = $('.nav.is-open');
      head.classList.toggle('is-up', !reduce && !open && y > 240 && y > last + 4);
      if (y < last - 4 || y < 240) head.classList.remove('is-up');
      last = y;
    }, { passive: true });
  }

  /* Menü */
  var btn = $('[data-menu]'), nav = $('#nav');
  function setMenu(o) {
    if (!btn) return;
    btn.setAttribute('aria-expanded', String(o));
    nav.classList.toggle('is-open', o);
    var t = $('.menu-btn__t', btn); if (t) t.textContent = o ? 'Schließen' : 'Menü';
  }
  if (btn) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
    });
  }

  /* Nav current */
  if ('IntersectionObserver' in window) {
    var links = $$('.nav a[href^="#"]');
    var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) {
            a.toggleAttribute('aria-current', false);
            if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    secs.forEach(function (s) { io.observe(s); });

    var dock = $('[data-dock]'), erst = $('#erstgespraech'), film = $('[data-film]');
    if (dock && erst) {
      var st = { h: true, e: false, f: false };
      var upd = function () { dock.classList.toggle('is-on', !st.h && !st.e && !st.f); };
      var heroRow = $('.hero__cta') || $('.hero');
      if (heroRow) new IntersectionObserver(function (es) { st.h = es[0].isIntersecting; upd(); }).observe(heroRow);
      new IntersectionObserver(function (es) { st.e = es[0].isIntersecting; upd(); }).observe(erst);
      if (film) new IntersectionObserver(function (es) { st.f = es[0].isIntersecting; upd(); }, { rootMargin: '-10% 0px -10% 0px' }).observe(film);
    }
  }

  /* Split-Leistungen */
  var split = $('[data-split]');
  if (split) {
    var panels = $$('[data-svc]', split);
    var pics = $$('[data-spic]', split);
    function activate(id) {
      panels.forEach(function (p) { p.classList.toggle('is-on', p.dataset.svc === id); });
      pics.forEach(function (p) { p.classList.toggle('is-on', p.dataset.spic === id); });
      var idx = $$('[data-idx]');
      idx.forEach(function (a) { a.classList.toggle('is-on', a.dataset.idx === id); });
    }
    $$('[data-idx]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        activate(a.dataset.idx);
        var t = document.getElementById('l-' + a.dataset.idx);
        if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
      });
      a.addEventListener('mouseenter', function () { if (matchMedia('(hover:hover)').matches) activate(a.dataset.idx); });
    });
    if ('IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) activate(e.target.dataset.svc); });
      }, { rootMargin: '-40% 0px -45% 0px' });
      panels.forEach(function (p) { io2.observe(p); });
    }
    if (panels[0]) activate(panels[0].dataset.svc);
  }

  /* Thema vorwählen */
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = $('input[name="thema"][value="' + a.dataset.topic + '"]');
      if (r) r.checked = true;
    });
  });

  /* Termine */
  var dl = $('[data-dates]');
  if (dl) {
    var WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    var shift = function (d) { while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1); return d; };
    var today = new Date(); today.setHours(0, 0, 0, 0); var out = [];
    for (var i = 0; i < 14 && out.length < 4; i++) {
      var base = new Date(today.getFullYear(), today.getMonth() + i, 1);
      var d10 = shift(new Date(base.getFullYear(), base.getMonth(), 10));
      var mo = base.getMonth() + 1;
      var t = 'Umsatzsteuer-Voranmeldung, Lohnsteuer-Anmeldung';
      if (mo % 3 === 0) t = 'Umsatzsteuer, Lohnsteuer, Einkommen- und Körperschaftsteuer, Vorauszahlung';
      out.push([d10, t]);
      if (mo % 3 === 2) out.push([shift(new Date(base.getFullYear(), base.getMonth(), 15)), 'Gewerbesteuer und Grundsteuer, Vorauszahlung']);
    }
    out = out.filter(function (x) { return x[0] >= today; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, 3);
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    dl.textContent = '';
    out.forEach(function (x) {
      var d = x[0], li = document.createElement('li'), tm = document.createElement('time'), sp = document.createElement('span');
      tm.dateTime = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
      tm.textContent = WD[d.getDay()] + ', ' + p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear();
      sp.textContent = x[1]; li.appendChild(tm); li.appendChild(sp); dl.appendChild(li);
    });
  }

  /* Demo confirmation: shared local handler, no HTML form submission. */

  /* Danke */
  var sum = $('[data-sum]');
  if (sum) {
    var q = new URLSearchParams(location.search);
    var L = { laufend: 'Laufende Steuerberatung', nachfolge: 'Unternehmensnachfolge', erbschaft: 'Erbschaft und Schenkung', gruendung: 'Gründung und Rechtsform', pruefung: 'Betriebsprüfung', frage: 'Eine konkrete Frage', kanzlei: 'In der Kanzlei', video: 'Per Video', telefon: 'Am Telefon' };
    var any = false;
    $$('[data-k]', sum).forEach(function (dd) {
      var v = q.get(dd.dataset.k);
      if (v) { any = true; dd.textContent = L[v] || v.slice(0, 80); } else dd.parentNode.hidden = true;
    });
    sum.hidden = !any;
  }

  /* Video loops play when visible */
  $$('.bgv').forEach(function (v) {
    v.muted = true;
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; }
    if (!window.ScrollTrigger) { v.play().catch(function () {}); return; }
    v.pause();
    window.ScrollTrigger.create({
      trigger: v.closest('section') || v.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: function (e) { if (e.isActive) { v.play().catch(function () {}); } else v.pause(); }
    });
  });

  /* GSAP motion layers */
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  var lines = $$('.hero__h .ln > span');
  if (lines.length) gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.1, delay: 0.08 });

  $$('.mg').forEach(function (el, i) {
    gsap.fromTo(el, { opacity: 0, y: 40, filter: 'blur(8px)' }, {
      opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }, delay: (i % 4) * 0.04
    });
  });

  /* Arch mask grow */
  var arch = $('[data-arch]');
  if (arch) {
    gsap.fromTo(arch, { clipPath: 'inset(18% 22% 18% 22% round 48% 48% 0 0)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 0)',
      ease: 'none',
      scrollTrigger: { trigger: arch.closest('section') || arch, start: 'top 70%', end: 'top 10%', scrub: 0.6 }
    });
  }

  /* Horizontal ratgeber */
  var rail = $('[data-rail]');
  if (rail && innerWidth > 900) {
    var track = $('.rail__track', rail);
    if (track) {
      gsap.to(track, {
        x: function () { return Math.min(0, rail.clientWidth - track.scrollWidth - 40); },
        ease: 'none',
        scrollTrigger: { trigger: rail, start: 'top top', end: function () { return '+=' + Math.max(600, track.scrollWidth); }, scrub: 0.5, pin: true, anticipatePin: 1 }
      });
    }
  }

  /* Quote words */
  var qt = $('[data-quote]');
  if (qt) {
    var words = qt.textContent.trim().split(/\s+/);
    qt.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span'); s.className = 'w'; s.textContent = w; qt.appendChild(s);
      if (i < words.length - 1) qt.appendChild(document.createTextNode(' '));
    });
    gsap.fromTo($$('.w', qt), { opacity: 0.14 }, {
      opacity: 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: qt, start: 'top 80%', end: 'bottom 40%', scrub: 0.5 }
    });
  }

  $$('[data-count]').forEach(function (el) {
    var n = +el.dataset.count, o = { v: 0 };
    gsap.to(o, {
      v: n, duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = Math.round(o.v); }
    });
  });

  var fw = $('[data-foot] .foot__big');
  if (fw) gsap.from(fw, { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '[data-foot]', start: 'top 90%', end: 'bottom bottom', scrub: true } });

  addEventListener('load', function () {
    window.ScrollTrigger.refresh();
    if (location.hash) {
      var t = document.getElementById(location.hash.slice(1));
      if (t) t.scrollIntoView();
    }
  });
})();
