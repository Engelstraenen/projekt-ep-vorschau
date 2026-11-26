(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mobile = matchMedia('(max-width:900px)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // Personal link ?firma=Name
  const firma = new URLSearchParams(location.search).get('firma');
  if (firma) $('#demo .for').textContent = ' für ' + firma.slice(0, 40);

  // Color world test ?farbe=#rrggbb
  const farbe = new URLSearchParams(location.search).get('farbe');
  if (farbe && /^#?[0-9a-f]{6}$/i.test(farbe)) {
    const h = farbe.replace('#', '');
    const rgb = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
    document.documentElement.style.setProperty('--or', '#' + h);
    document.documentElement.style.setProperty('--or-rgb', rgb.join(','));
  }

  // Nav
  const nav = $('#nav'), burger = $('#burger');
  const onNav = () => nav.classList.toggle('solid', scrollY > 40);
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  $$('#links a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = '';
  }));

  // Film scrub (hero)
  const films = $$('[data-film]').map(sec => {
    const v = $('video', sec);
    v.src = (mobile && v.dataset.srcM) || v.dataset.src;
    v.load();
    const f = { sec, v, dur: 0, target: 0, cur: 0, intro: true };
    v.addEventListener('loadedmetadata', () => {
      f.dur = v.duration || 5;
      // short auto-start so the first second already moves
      v.play().then(() => setTimeout(() => { v.pause(); f.cur = v.currentTime; f.intro = false; }, 1200))
        .catch(() => { f.intro = false; });
    });
    // iPhone (Stromsparmodus) blockt Autoplay: beim ersten Tippen/Scrollen freischalten
    const unlock = () => {
      if (f.unlocked) return; f.unlocked = true;
      v.play().then(() => { v.pause(); f.intro = false; if (!f.dur) f.dur = v.duration || 5; }).catch(() => {});
    };
    ['touchstart', 'pointerdown', 'scroll', 'keydown'].forEach(e => addEventListener(e, unlock, { once: true, passive: true }));
    return f;
  });
  const prog = $('[data-prog]'), pct = $('[data-pct]');

  // Steps
  const steps = $('#ablauf'), frames = $$('.sframe'), items = $$('.steplist li');
  const prog2 = $('[data-prog2]'), pct2 = $('[data-pct2]');
  let stepIdx = 0;

  const secP = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };

  function frame() {
    onNav();
    films.forEach(f => {
      const p = secP(f.sec);
      if (f.dur && !f.intro) {
        f.target = Math.max(1.2 / f.dur, p) * (f.dur - 0.05);
        f.cur += (f.target - f.cur) * 0.18;
        if (Math.abs(f.v.currentTime - f.cur) > 0.02) f.v.currentTime = f.cur;
      }
      if (f.sec.id === 'hero') { const q = Math.round(p * 30); prog.style.width = `calc(${p * 30}% )`; pct.textContent = q + '%'; }
    });
    const sp = secP(steps);
    const i = Math.min(2, Math.floor(sp * 3));
    if (i !== stepIdx) {
      stepIdx = i;
      frames.forEach((fr, k) => fr.classList.toggle('on', k === i));
      items.forEach((li, k) => li.classList.toggle('on', k === i));
    }
    const p2 = 30 + sp * 60;
    prog2.style.width = p2 + '%'; pct2.textContent = Math.round(p2) + '%';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Reveal + counters
  const count = el => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), t0 = performance.now(), d = 1400;
    const step = t => { const k = clamp((t - t0) / d); const e = 1 - Math.pow(1 - k, 3); el.textContent = (end * e).toFixed(dec).replace('.', ','); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(count);
    if (e.target.id === 'status') runTrack();
    io.unobserve(e.target);
  }), { threshold: .3 });
  $$('.reveal, .pic, .career, .rate, #status').forEach(el => io.observe(el));

  // Live status track
  function runTrack() { $$('#track li').forEach((li, k) => setTimeout(() => li.classList.add('on'), 400 + k * 700)); }

  // Configurator
  const img = $('#confImg'), name = $('#confName');
  $$('.sw').forEach(b => b.addEventListener('click', () => {
    $$('.sw').forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
    b.classList.add('on'); b.setAttribute('aria-checked', 'true');
    const f = b.dataset.f;
    img.classList.toggle('shift', f === 'shift');
    img.style.filter = (f === 'none' || f === 'shift') ? '' : f;
    name.textContent = b.dataset.n;
  }));

  // Quotes rotate (one at a time)
  const qs = $$('#quotes blockquote'); let qi = 0;
  setInterval(() => { qs[qi].classList.remove('on'); qi = (qi + 1) % qs.length; setTimeout(() => qs[qi].classList.add('on'), 700); }, 5200);

  // Demo forms
  $$('form[data-demo]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); $('.ok', f).hidden = false; }));

  // Apply modal
  const m = $('#apply');
  $('#applyBtn').addEventListener('click', () => { m.hidden = false; $('select', m).focus(); });
  const close = () => { m.hidden = true; };
  $('#applyX').addEventListener('click', close);
  m.addEventListener('click', e => { if (e.target === m) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
