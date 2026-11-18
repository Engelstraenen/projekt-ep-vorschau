/* WARMHERZ · Scroll-Geschichten: Scroll steuert eine Szene Schritt für Schritt (GSAP ScrollTrigger, scrub).
   <section data-flow="ablauf|boden|bad|notdienst"> mit .fl-step je Schritt. Ohne Bewegung (prefers-reduced-motion,
   ?shot) stehen die Schritte untereinander im Endzustand. */
(() => {
  const flows = [...document.querySelectorAll('[data-flow]')];
  if (!flows.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('shot');
  const anim = !reduce && window.gsap && window.ScrollTrigger;
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* Zahl hochzählen (rückwärts beim Zurückscrollen) */
  const count = (tl, el, from, to, fmt, at, dur) => {
    if (!el) return;
    const o = { v: from };
    tl.to(o, { v: to, duration: dur, ease: 'none', onUpdate: () => (el.textContent = fmt(Math.round(o.v))) }, at);
  };
  const de = n => n.toLocaleString('de-DE');
  const pop = (tl, el, at, extra = {}) => el && tl.fromTo(el, { opacity: 0, scale: .4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .12, ease: 'back.out(2)', ...extra }, at);
  const show = (tl, el, at, dur = .1) => el && tl.to(el, { opacity: 1, duration: dur }, at);
  const draw = (tl, el, at, dur) => {
    if (!el) return;
    const L = el.getTotalLength();
    tl.fromTo(el, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur, ease: 'none' }, at);
  };

  const SCENES = {
    /* So läuft's ab: 5 eigene Bilder */
    ablauf(tl, q) {
      ['tile1', 'tile2', 'tile3'].forEach((t, i) => {
        pop(tl, q(t), .08 + i * .14);
        tl.fromTo(q('flash'), { opacity: .7 }, { opacity: 0, duration: .08, immediateRender: false }, .08 + i * .14);
      });
      count(tl, q('cnt'), 0, 3, v => `${v}/3`, .08, .4);
      tl.to(q('send'), { attr: { fill: '#FF5B1F' }, duration: .08 }, .55);
      pop(tl, q('bubble'), .66);

      tl.fromTo(q('scan'), { attr: { x: 110 } }, { attr: { x: 406 }, duration: .45, ease: 'none' }, 1.08);
      ['r1', 'r2', 'r3', 'r4'].forEach((r, i) => tl.to(q(r), { opacity: .24, duration: .08 }, 1.12 + (i % 2) * .2 + (i > 1 ? .04 : 0)));
      ['k1', 'k2', 'k3', 'k4'].forEach((k, i) => pop(tl, q(k), 1.16 + (i % 2) * .2 + (i > 1 ? .04 : 0)));
      tl.to(q('spot'), { opacity: 0, duration: .06 }, 1.58);
      show(tl, q('unit'), 1.58, .08);
      tl.fromTo(q('ring'), { opacity: .9, scale: .7, transformOrigin: '50% 50%' }, { opacity: 0, scale: 1.5, duration: .2 }, 1.6);
      show(tl, q('db'), 1.62);
      pop(tl, q('sum'), 1.72);

      ['l1', 'l2', 'l3'].forEach((l, i) => tl.fromTo(q(l), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .1 }, 2.06 + i * .05));
      show(tl, q('zl'), 2.3); show(tl, q('zn'), 2.3, .04);
      count(tl, q('zn'), 0, 22400, v => `−${de(v)} €`, 2.3, .28);
      show(tl, q('pl'), 2.6); pop(tl, q('pn'), 2.6);
      tl.fromTo(q('stamp'), { opacity: 0, scale: 2.2, rotation: -30, svgOrigin: '350 364' }, { opacity: 1, scale: 1, rotation: -12, svgOrigin: '350 364', duration: .1, ease: 'power3.in' }, 2.7);

      tl.fromTo(q('foil'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .15 }, 3.04);
      tl.to(q('tank'), { x: -320, opacity: 0, duration: .25, ease: 'power2.in' }, 3.14);
      tl.fromTo(q('hp'), { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: .25, ease: 'power2.out' }, 3.34);
      count(tl, q('day'), 1, 3, v => `Tag ${v}`, 3.1, .6);
      tl.to(q('d2'), { attr: { fill: '#FF5B1F' }, duration: .04 }, 3.4);
      tl.to(q('d3'), { attr: { fill: '#FF5B1F' }, duration: .04 }, 3.68);
      tl.to(q('fan'), { rotation: 900, svgOrigin: '370 303', duration: .45, ease: 'none' }, 3.45);
      show(tl, q('therm'), 3.48);
      tl.fromTo(q('merc'), { attr: { y: 330, height: 30 } }, { attr: { y: 200, height: 160 }, duration: .3, ease: 'none' }, 3.52);
      count(tl, q('temp'), 15, 21, v => `${v} °C`, 3.52, .3);

      tl.fromTo(q('arc'), { attr: { 'stroke-dashoffset': 754 } }, { attr: { 'stroke-dashoffset': 150 }, duration: .45, ease: 'power1.out' }, 4.08);
      count(tl, q('deg'), 15, 21, v => `${v} °C`, 4.08, .45);
      ['c1', 'c2', 'c3'].forEach((c, i) => tl.fromTo(q(c), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .1 }, 4.42 + i * .09));
      tl.fromTo(q('cal'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .12 }, 4.7);
    },

    /* Fußbodenheizung: ein Raum von oben, an einem Tag */
    boden(tl, q, flow) {
      const tiles = [...flow.querySelectorAll('[data-a="old"] rect')];
      tl.to(tiles, { opacity: 0, scale: .3, transformOrigin: '50% 50%', duration: .12, stagger: { each: .45 / tiles.length, from: 'start' } }, .1);
      pop(tl, q('ok'), .66);
      tl.to(q('ok'), { opacity: 0, duration: .06 }, .95);

      const ch = q('channel'), mill = q('mill'), L = ch.getTotalLength();
      draw(tl, ch, 1.05, .75);
      show(tl, mill, 1.0, .05);
      const o = { p: 0 };
      const place = () => { const pt = ch.getPointAtLength(o.p * L); mill.setAttribute('transform', `translate(${pt.x} ${pt.y})`); };
      place();
      tl.to(o, { p: 1, duration: .75, ease: 'none', onUpdate: place }, 1.05);
      show(tl, q('dust'), 1.05, .05);
      tl.to([mill, q('dust')], { opacity: 0, duration: .06 }, 1.84);

      draw(tl, q('pipe'), 2.05, .6);
      pop(tl, q('verteiler'), 2.02);
      count(tl, q('bar'), 0, 6, v => `${v} bar`, 2.66, .14);
      pop(tl, q('barok'), 2.8);

      tl.fromTo(q('fill'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .6, ease: 'none' }, 3.08);
      tl.fromTo(q('trowel'), { x: 0, opacity: 1 }, { x: 440, duration: .6, ease: 'none' }, 3.08);
      tl.to(q('trowel'), { opacity: 0, duration: .05 }, 3.7);

      tl.fromTo(q('floor'), { opacity: 0 }, { opacity: 1, duration: .15 }, 4.05);
      tl.fromTo(q('glow'), { opacity: 0 }, { opacity: .85, duration: .3 }, 4.18);
      const feet = [...flow.querySelectorAll('[data-a="feet"] g')];
      tl.fromTo(feet, { opacity: 0, scale: .6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .06, stagger: .06 }, 4.4);
      show(tl, q('rtg'), 4.15);
      count(tl, q('rt'), 17, 22, v => `${v} °C`, 4.2, .4);
      pop(tl, q('badge'), 4.62);
    },

    /* Bad: eine Wand von vorn, vom alten Bad zum neuen */
    bad(tl, q, flow) {
      flow.querySelectorAll('[data-a="plan"] [data-d]').forEach((el, i) => draw(tl, el, .1 + i * .08, .25));
      show(tl, q('planlbl'), .5);
      pop(tl, q('cal'), .55);
      const seg = [...flow.querySelectorAll('[data-a="segs"] rect')];
      const fillSeg = (n, at) => tl.to(seg.slice(0, n), { attr: { fill: '#FF5B1F' }, duration: .05, stagger: .02 }, at);

      const old = [...flow.querySelectorAll('[data-a="oldtiles"] rect')];
      tl.to(q('plan'), { opacity: .25, duration: .08 }, 1.0);
      tl.to(old, { y: 420, rotation: () => gsap.utils.random(-50, 50), opacity: 0, duration: .3, ease: 'power2.in', stagger: { each: .3 / old.length, from: 'random' } }, 1.08);
      tl.to(q('tub'), { x: -360, opacity: 0, duration: .25, ease: 'power2.in' }, 1.3);
      tl.to(q('oldwc'), { x: 200, opacity: 0, duration: .22, ease: 'power2.in' }, 1.4);
      fillSeg(2, 1.5);

      flow.querySelectorAll('[data-a="pipes"] path').forEach((p, i) => draw(tl, p, 2.06 + i * .07, .4));
      draw(tl, q('fbh'), 2.2, .45);
      fillSeg(5, 2.6);

      const nt = [...flow.querySelectorAll('[data-a="newtiles"] rect')];
      tl.fromTo(nt, { opacity: 0, scale: .2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .12, stagger: { each: .32 / nt.length, from: 'end' } }, 3.04);
      tl.to([q('plan'), q('planlbl')], { opacity: 0, duration: .06 }, 3.1);
      ['glass', 'head', 'basin', 'mirror', 'wc'].forEach((k, i) => tl.fromTo(q(k), { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: .1, ease: 'back.out(1.6)' }, 3.42 + i * .07));
      fillSeg(11, 3.6);

      fillSeg(12, 4.05);
      show(tl, q('water'), 4.1, .1);
      tl.to(q('mglow'), { opacity: 1, duration: .15 }, 4.15);
      pop(tl, q('done'), 4.4);
    },

    /* Notdienst: Sonntagabend, Heizung aus */
    notdienst(tl, q) {
      count(tl, q('rt'), 21, 17, v => `${v} °C`, .1, .7);
      count(tl, q('clock'), 0, 2, v => `22:${String(47 + v * 2).padStart(2, '0')}`, .1, .6);

      tl.fromTo(q('phone'), { x: 260, opacity: 0 }, { x: 0, opacity: 1, duration: .2, ease: 'power3.out' }, 1.04);
      tl.fromTo(q('flash'), { opacity: .9 }, { opacity: 0, duration: .08 }, 1.3);
      pop(tl, q('snap'), 1.3);
      tl.to(q('send'), { attr: { fill: '#FF5B1F' }, duration: .05 }, 1.48);
      pop(tl, q('bubble'), 1.6);
      count(tl, q('clock'), 51, 53, v => `22:${v}`, 1.1, .6);

      tl.to(q('phone'), { x: 260, opacity: 0, duration: .15, ease: 'power2.in' }, 2.02);
      show(tl, q('map'), 2.08, .08);
      draw(tl, q('route'), 2.1, .55);
      const van = q('van'), route = q('route'), L = route.getTotalLength();
      const o = { p: 0 };
      const place = () => { const pt = route.getPointAtLength(o.p * L); van.setAttribute('transform', `translate(${pt.x} ${pt.y})`); };
      place();
      tl.to(o, { p: 1, duration: .6, ease: 'power1.inOut', onUpdate: place }, 2.1);
      count(tl, q('eta'), 38, 0, v => v ? `noch ${v} Min.` : 'Murat ist da', 2.1, .6);
      count(tl, q('clock'), 53, 91, v => `${22 + Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`, 2.1, .6);

      tl.to(q('map'), { opacity: 0, duration: .08 }, 3.0);
      tl.to(q('err'), { opacity: 0, duration: .05 }, 3.1);
      show(tl, q('okd'), 3.12, .06);
      count(tl, q('rt'), 17, 21, v => `${v} °C`, 3.15, .55);
      tl.to(q('led'), { attr: { fill: '#FF5B1F' }, duration: .05 }, 3.12);
      ['c1', 'c2', 'c3'].forEach((c, i) => tl.fromTo(q(c), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .1 }, 3.3 + i * .1));
      count(tl, q('clock'), 91, 118, v => `${22 + Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`, 3.15, .55);
    }
  };

  flows.forEach(flow => {
    const steps = [...flow.querySelectorAll('.fl-step')], N = steps.length;
    const dots = [...flow.querySelectorAll('.fl-rail li')], fill = flow.querySelector('.fl-fill'), hint = flow.querySelector('.fl-hint');
    const q = a => flow.querySelector(`[data-a="${a}"]`);
    const scene = SCENES[flow.dataset.flow];
    if (!window.gsap) { flow.classList.add('static'); return; }

    if (!anim) {
      flow.classList.add('static');
      const tl = gsap.timeline({ paused: true });
      scene && scene(tl, q, flow);
      tl.progress(1);
      return;
    }

    const setAct = i => {
      dots.forEach((d, k) => { d.classList.toggle('act', k === i); d.classList.toggle('done', k < i); });
    };

    /* Motion-Loop: läuft von allein in Dauerschleife, sobald sichtbar (kein Scrollen, kein Klicken nötig) */
    if (flow.dataset.mode === 'loop') {
      flow.classList.add('loop');
      const body = flow.querySelector('.fl-steps');
      const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'power2.out' },
        onUpdate: () => setAct(Math.min(N - 1, Math.floor(tl.time()))) });
      if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: N, ease: 'none' }, 0);
      tl.fromTo(body, { opacity: 0 }, { opacity: 1, duration: .1 }, 0);
      steps.forEach((st, i) => {
        if (i > 0) tl.fromTo(st, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .12 }, i - .04);
        if (i < N - 1) tl.to(st, { autoAlpha: 0, y: -24, duration: .1, ease: 'power2.in' }, i + .86);
      });
      scene && scene(tl, q, flow);
      tl.to(body, { opacity: 0, duration: .12 }, N + .55);
      tl.set({}, {}, N + .7);                       // Endbild kurz stehen lassen, dann von vorn
      tl.timeScale(1 / (+flow.dataset.sec || 3.2)); // Sekunden pro Schritt
      dots.forEach((d, k) => d.addEventListener('click', () => tl.time(k + .02)));
      new IntersectionObserver(es => es[0].isIntersecting ? tl.play() : tl.pause(), { threshold: .35 }).observe(flow);
      setAct(0);
      return;
    }

    flow.classList.add('on');
    flow.style.setProperty('--n', N);
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: flow, start: 'top top', end: 'bottom bottom', scrub: .5,
        onUpdate: s => {
          setAct(Math.min(N - 1, Math.floor(s.progress * N)));
          if (hint) hint.style.opacity = s.progress > .02 ? 0 : 1;
        }
      }
    });
    if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: N, ease: 'none' }, 0);
    steps.forEach((st, i) => {
      if (i > 0) tl.fromTo(st, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .12 }, i - .04);
      if (i < N - 1) tl.to(st, { autoAlpha: 0, y: -40, duration: .1, ease: 'power2.in' }, i + .86);
    });
    scene && scene(tl, q, flow);
    tl.set({}, {}, N);
    setAct(0);
  });
})();
