/* WÄRMEWERK Demo (Projekt EP): Wärmebild-Regler, Einblenden, Zähler, Kopfzeile. Vanilla JS, keine Bibliotheken. */
(() => {
  const d = document, root = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  // Wärmebild-Regler im Hero (Tastatur: Pfeiltasten, Maus/Touch: ziehen)
  const hero = d.querySelector('[data-thermo]'), ir = d.querySelector('[data-ir]');
  if (hero && ir) {
    ir.hidden = false;
    const set = () => { hero.style.setProperty('--x', ir.value + '%'); ir.setAttribute('aria-valuetext', `Wärmebild ab ${ir.value} Prozent der Breite`); };
    ir.addEventListener('input', set); set();
    ir.addEventListener('pointerdown', () => hero.classList.add('is-drag'));
    addEventListener('pointerup', () => hero.classList.remove('is-drag'));
  }

  // Einblenden beim Scrollen
  const els = d.querySelectorAll('[data-rv], [data-flow] li');
  if (reduce || !('IntersectionObserver' in window)) els.forEach(e => e.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e, i) => { e.style.transitionDelay = (e.matches('[data-rv]') ? (i % 3) * 70 : 0) + 'ms'; io.observe(e); });
  }

  // Zähler
  const fmt = n => (n < 0 ? '−' : '') + Math.abs(Math.round(n));
  d.querySelectorAll('[data-count-to]').forEach(el => {
    const to = +el.dataset.countTo, from = +(el.dataset.from || 0);
    if (reduce) return;
    el.textContent = fmt(from);
    const run = () => {
      const t0 = performance.now(), dur = 1600;
      const tick = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(from + (to - from) * e); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    };
    setTimeout(run, 700);
  });

  // Kopfzeile beim Runterscrollen ausblenden
  const head = d.querySelector('[data-head]');
  if (head && !reduce) {
    let last = scrollY;
    addEventListener('scroll', () => {
      const y = scrollY;
      if (y > 700 && y > last + 4 && !d.querySelector('.menu[open]')) head.classList.add('is-hidden');
      else if (y < last - 4 || y < 700) head.classList.remove('is-hidden');
      last = y;
    }, { passive: true });
  }
  d.querySelectorAll('.menu__panel a').forEach(a => a.addEventListener('click', () => d.querySelector('.menu')?.removeAttribute('open')));
})();
