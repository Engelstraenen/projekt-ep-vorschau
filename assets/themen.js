// Themen-Unterseiten: Beschreibung je Sparte direkt unter ihre Clip-Reihe setzen (Werbeclips). Fasst Videos und Ton nicht an.
(() => {
  const src = document.querySelector('.pf-desc-src');
  if (!src) return;
  const place = () => src.querySelectorAll('[data-for]').forEach((c) => {
    const g = document.querySelector(`.pf-group[data-sparte="${c.dataset.for}"]`);
    if (g) g.append(c);
  });
  const box = document.querySelector('.pf-groups');
  if (!box || box.querySelector('.pf-group')) { place(); return; }
  new MutationObserver((_, o) => { if (box.querySelector('.pf-group')) { o.disconnect(); place(); } }).observe(box, { childList: true });
})();
