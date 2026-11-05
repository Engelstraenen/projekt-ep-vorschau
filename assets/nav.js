// Leistungsmenü: öffnen/schließen per Klick, Escape und Klick außerhalb. Funktioniert auf allen Seiten.
(() => {
  const panel = document.getElementById('mega');
  if (!panel) return;
  const triggers = [...document.querySelectorAll('[aria-controls="mega"]')];
  let lastTrigger = null;
  const setOpen = (open, trigger) => {
    panel.classList.toggle('open', open);
    panel.toggleAttribute('inert', !open);
    triggers.forEach((t) => t.setAttribute('aria-expanded', String(open)));
    if (open) { lastTrigger = trigger; panel.querySelector('a')?.focus({ preventScroll: true }); }
    else if (lastTrigger && panel.contains(document.activeElement)) lastTrigger.focus({ preventScroll: true });
  };
  setOpen(false);
  triggers.forEach((t) => t.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!panel.classList.contains('open'), t); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false); });
  document.addEventListener('click', (e) => { if (panel.classList.contains('open') && !panel.contains(e.target)) setOpen(false); });
  // Klick auf einen Anker innerhalb der Seite schließt das Menü
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
})();

// Lesefortschritt oben: Breite = gescrollter Anteil der Seite (funktioniert auch mit Lenis, da es nativ scrollt)
(() => {
  const bar = document.getElementById('scrollbar');
  if (!bar) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
})();


// Liquid Glass: SVG-Brechungsfilter (#lg-refract) — idempotent, Chromium only
(() => {
  if (document.getElementById('lg-refract')) return;
  const chromium = !!(navigator.userAgentData && navigator.userAgentData.brands.some((b) => /Chrom/.test(b.brand)));
  if (!chromium || matchMedia('(prefers-reduced-transparency: reduce)').matches) return;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">'
    + '<filter id="lg-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">'
    + '<feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="7" result="n"/>'
    + '<feGaussianBlur in="n" stdDeviation="2" result="nb"/>'
    + '<feDisplacementMap in="SourceGraphic" in2="nb" scale="14" xChannelSelector="R" yChannelSelector="G"/>'
    + '</filter></svg>';
  const mount = () => {
    document.body.insertAdjacentHTML('beforeend', svg);
    document.documentElement.classList.add('lg-svg');
  };
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
