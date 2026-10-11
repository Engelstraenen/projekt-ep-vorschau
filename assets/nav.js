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
