// HOLM & CO – Scroll-Regie: Lenis + GSAP ScrollTrigger. Ohne Skript bleibt die Seite vollständig lesbar.
(function () {
  // Mobiles Menü: nach Tipp auf einen Eintrag, mit Esc oder Tipp daneben schließen (sonst blieb es offen über der Seite)
  var menu = document.querySelector('details.menu');
  if (menu) {
    var shut = function () { menu.removeAttribute('open'); };
    menu.querySelectorAll('.menu__panel a').forEach(function (a) { a.addEventListener('click', shut); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { shut(); menu.querySelector('summary').focus(); } });
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) shut(); });
  }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  document.documentElement.classList.add('gs');
  gsap.registerPlugin(ScrollTrigger);
  // Touch/Tablet/Phone: Höhenänderungen durch die einblendende Adressleiste lösen kein Neu-Layout aus
  ScrollTrigger.config({ ignoreMobileResize: true });
  var touchUI = matchMedia('(max-width: 1060px), (pointer: coarse)').matches, coarse = matchMedia('(pointer: coarse)').matches;
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: .1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(function (a) {
      a.addEventListener('click', function (e) { var id = a.getAttribute('href').split('#')[1]; var el = id && document.getElementById(id); if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -70 }); } });
    });
  }
  var mm = gsap.matchMedia();

  // Hero: Zeichen einzeln, beim Scrollen fährt das Foto in einen Rahmen zurück
  var h1 = document.querySelector('.hero h1');
  if (h1) {
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    h1.querySelectorAll('.ln > span').forEach(function (s) {
      s.innerHTML = s.textContent.split(' ').map(function (w) { return '<span class="wd" aria-hidden="true">' + w.split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join('') + '</span>'; }).join(' ');
    });
    gsap.from('.hero h1 .ch', { yPercent: 110, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: .035, delay: .15 });
  }
  // Hero-Pin: Desktop mit Maus wie gehabt per GSAP-Pin. Touch/Tablet/Phone: derselbe gepinnte Effekt per CSS position:sticky
  // (läuft im Compositor, kein Umschalten auf position:fixed per Skript, das bei nativem Touch-Scroll springt).
  // Die Hülle .hero-pin samt 90svh Pin-Strecke (::after) steht in mobile-fix.css; die Hülle entsteht nur hier, also nur auf Touch/schmal.
  var hero = document.querySelector('.hero'), heroST;
  if (touchUI && hero) {
    var heroWrap = document.createElement('div'); heroWrap.className = 'hero-pin';
    hero.parentNode.insertBefore(heroWrap, hero); heroWrap.appendChild(hero);
    // Ist der Hero höher als der Bildschirm (Querformat), klebt er mit der Unterkante am Bildschirmrand statt oben
    var heroTop = function () { var t = Math.min(0, Math.round(window.innerHeight - hero.offsetHeight)); hero.style.setProperty('--hero-top', t + 'px'); return t; };
    heroTop();
    ScrollTrigger.addEventListener('refreshInit', heroTop);
    heroST = { trigger: heroWrap, start: function () { return 'top ' + heroTop() + 'px'; }, end: function () { return '+=' + (heroWrap.offsetHeight - hero.offsetHeight); }, scrub: true, invalidateOnRefresh: true };
  } else {
    heroST = { trigger: '.hero', start: 'top top', end: '+=90%', scrub: true, pin: true, pinSpacing: true };
  }
  gsap.timeline({ scrollTrigger: heroST })
    .to('.hero__media', { clipPath: 'inset(7% 7% 12% 7% round 6px)', ease: 'none' }, 0)
    .to('.hero__media img', { scale: 1.12, ease: 'none' }, 0)
    .to('.hero h1 .ln:first-child', { xPercent: -14, ease: 'none' }, 0)
    .to('.hero h1 .ln:last-child', { xPercent: 10, ease: 'none' }, 0)
    .to('.hero__side', { y: -60, autoAlpha: 0, ease: 'none' }, 0)
    .to('.dim', { autoAlpha: 0, ease: 'none' }, 0);

  // Kapitel-Farbwechsel
  document.querySelectorAll('[data-bg]').forEach(function (el) {
    ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%',
      onToggle: function (st) { if (st.isActive) document.body.style.setProperty('--chap', el.dataset.bg); } });
  });

  // Riesige Typo, die beim Scrollen läuft
  document.querySelectorAll('.kin').forEach(function (el) {
    gsap.fromTo(el, { xPercent: el.dataset.dir === 'r' ? -20 : 5 }, { xPercent: el.dataset.dir === 'r' ? 5 : -20, ease: 'none', scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Überschriften: Wort für Wort aus der Maske
  document.querySelectorAll('.sec__head h2, .werk h2, .kontakt h2').forEach(function (h) {
    gsap.from(h, { y: 48, clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });

  // Leistungen: gepinntes Bild links wechselt, Text rechts mit Fokus
  mm.add('(min-width: 1061px)', function () {
    var rows = gsap.utils.toArray('.svc__row');
    rows.forEach(function (r) {
      gsap.fromTo(r.querySelector('.svc__img'), { clipPath: 'inset(18% 14% 18% 14% round 4px)' }, { clipPath: 'inset(0% 0% 0% 0% round 4px)', ease: 'none', scrollTrigger: { trigger: r, start: 'top 90%', end: 'top 30%', scrub: true } });
      gsap.fromTo(r.querySelector('.svc__img img'), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: r, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(r.querySelector('.svc__txt'), { y: 60 }, { y: 0, ease: 'none', scrollTrigger: { trigger: r, start: 'top 75%', end: 'top 35%', scrub: true } });
    });
    // Projekte: vertikales Scrollen wird seitliche Fahrt
    var rail = document.querySelector('.rail');
    if (rail) {
      var dist = function () { return rail.scrollWidth - innerWidth; };
      var railTrig = '.projekte', railPin = true, railWrap = null, proj = document.querySelector('.projekte');
      if (coarse && proj) {
        // Touch-Tablet quer (≥ 1061px): gleiche Fahrt, aber per CSS sticky statt GSAP-Pin (position:fixed per Skript springt bei Touch-Scroll)
        railWrap = proj.parentNode.classList.contains('rail-pin') ? proj.parentNode : document.createElement('div');
        if (!railWrap.parentNode) { railWrap.className = 'rail-pin'; proj.parentNode.insertBefore(railWrap, proj); railWrap.appendChild(proj); }
        var setDist = function () { railWrap.style.setProperty('--rail-dist', Math.max(0, dist()) + 'px'); };
        setDist(); ScrollTrigger.addEventListener('refreshInit', setDist);
        railTrig = railWrap; railPin = false;
      }
      gsap.to(rail, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: railTrig, start: 'top top', end: function () { return '+=' + dist(); }, pin: railPin, scrub: true, invalidateOnRefresh: true } });
      gsap.utils.toArray('.rail__img img').forEach(function (im) { gsap.fromTo(im, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: railTrig, start: 'top top', end: function () { return '+=' + dist(); }, scrub: true } }); });
      if (railWrap) return function () { ScrollTrigger.removeEventListener('refreshInit', setDist); railWrap.style.setProperty('--rail-dist', '0px'); };
    }
  });

  // Werkstatt: Foto wächst aus einem Bogen zum Vollbild
  gsap.timeline({ scrollTrigger: { trigger: '.werk', start: 'top 85%', end: 'top 5%', scrub: true } })
    .fromTo('.werk__media', { clipPath: 'inset(8% 32% 0% 32% round 50vw 50vw 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'none' }, 0)
    .fromTo('.werk__media img', { scale: 1.3 }, { scale: 1, ease: 'none' }, 0);
  gsap.utils.toArray('.werk__nums dd').forEach(function (dd) {
    var m = dd.textContent.match(/^(\d+)(.*)$/); if (!m) return;
    var o = { v: 0 }, n = +m[1], rest = m[2];
    gsap.to(o, { v: n, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: dd, start: 'top 85%' }, onUpdate: function () { dd.textContent = Math.round(o.v) + rest; } });
  });

  // Ablauf: Maßlinie zeichnet sich, Schritte folgen
  var steps = document.querySelector('.steps');
  if (steps) {
    gsap.fromTo('.steps__line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 80%', end: 'bottom 50%', scrub: true } });
    gsap.from('.steps li', { y: 50, stagger: .12, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: steps, start: 'top 75%' } });
  }
  gsap.from('.quotes li', { y: 70, rotate: function (i) { return (i - 1) * 2; }, stagger: .12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.quotes', start: 'top 80%' } });

  // Fuß: riesiger Schriftzug wächst aus dem Boden
  gsap.fromTo('.foot__big', { yPercent: 60, scaleY: .6, transformOrigin: '50% 100%' }, { yPercent: 0, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'top 30%', scrub: true } });
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
