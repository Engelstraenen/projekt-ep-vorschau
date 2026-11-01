/* Stilauswahl (werbeclips.html#stile): Videos erst laden, wenn sie nahe am Bild sind; abspielen nur, solange sichtbar.
   Bei prefers-reduced-motion kein Autoplay, nur Poster + Abspielknopf. Manuell pausierte Clips starten nicht von selbst neu. */
(() => {
  const root = document.getElementById('stile');
  if (!root) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const medias = [...root.querySelectorAll('.stil-media')];
  const hasIO = 'IntersectionObserver' in window;

  const load = (v) => { if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.preload = reduce.matches ? 'metadata' : 'auto'; } };
  const setState = (m, s) => {
    m.dataset.state = s;
    m.querySelector('.stil-toggle').setAttribute('aria-label', s === 'playing' ? 'Clip pausieren' : 'Clip abspielen');
  };
  const play = (m) => { const v = m.querySelector('video'); load(v); const p = v.play(); if (p && p.catch) p.catch(() => setState(m, 'paused')); };

  medias.forEach((m) => {
    const v = m.querySelector('video');
    v.addEventListener('playing', () => setState(m, 'playing'));
    v.addEventListener('pause', () => setState(m, 'paused'));
    m.querySelector('.stil-toggle').addEventListener('click', () => {
      if (v.paused) { m.dataset.user = ''; play(m); } else { m.dataset.user = 'paused'; v.pause(); }
    });
  });

  if (!hasIO) return;
  root.classList.add('js');

  // Einblenden (gestaffelt über --i im CSS)
  const reveal = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); reveal.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  root.querySelectorAll('.stile-rail, .stile-weg').forEach((el) => reveal.observe(el));

  // Vorladen kurz bevor das Video ins Bild kommt
  const near = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { load(e.target.querySelector('video')); near.unobserve(e.target); }
  }), { rootMargin: '300px 300px' });
  // Autoplay nur sichtbar (auch waagerecht in der Handy-Schiene)
  const vis = new IntersectionObserver((es) => es.forEach((e) => {
    const m = e.target, v = m.querySelector('video');
    if (e.isIntersecting && e.intersectionRatio >= 0.55) {
      if (!reduce.matches && m.dataset.user !== 'paused' && v.paused) play(m);
    } else if (!v.paused) { v.pause(); }
  }), { threshold: [0, 0.55] });

  medias.forEach((m) => { near.observe(m); vis.observe(m); });
})();
