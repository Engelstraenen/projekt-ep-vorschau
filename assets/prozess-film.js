/* Prozess-Erklärvideo: erst laden, wenn es in der Nähe des Viewports ist. Kein Autoplay, Ton bleibt an (Klick-Play). */
(() => {
  const v = document.getElementById('ablauf-video-el');
  if (!v) return;
  const src = v.dataset.src;
  if (!src) return;
  const load = () => {
    if (v.getAttribute('src') === src) return;
    v.src = src;
    if (v.preload === 'none') v.preload = 'metadata';
  };
  v.addEventListener('pointerdown', load, { once: true });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { load(); io.disconnect(); }
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    io.observe(v);
  } else load();
})();
