// PROJEKT EP – kleine Interaktionen der High-End-Schicht. Alles optional: ohne JS bleibt die Seite vollständig nutzbar.
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Rail "Weitere Leistungen": Pfeile, Status, Ziehen mit der Maus
  document.querySelectorAll('.ep-rail').forEach((sec) => {
    const rail = sec.querySelector('.rail');
    const btns = sec.querySelectorAll('.rail-btn');
    if (!rail) return;
    const step = () => (rail.querySelector('li')?.getBoundingClientRect().width || 300) + 20;
    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth - 2;
      btns.forEach((b) => { b.disabled = b.dataset.dir === '-1' ? rail.scrollLeft <= 2 : rail.scrollLeft >= max; });
    };
    btns.forEach((b) => b.addEventListener('click', () => rail.scrollBy({ left: step() * 2 * Number(b.dataset.dir), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })));
    rail.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    addEventListener('resize', sync); sync();
    if (!fine) return;
    let x0 = 0, s0 = 0, moved = false, down = false;
    rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; x0 = e.clientX; s0 = rail.scrollLeft; });
    addEventListener('pointermove', (e) => {
      if (!down) return; const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) { moved = true; rail.classList.add('drag'); }
      if (moved) rail.scrollLeft = s0 - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      if (moved) { const left = Math.round(rail.scrollLeft / step()) * step(); rail.classList.remove('drag'); rail.scrollTo({ left, behavior: 'smooth' }); }
    });
    rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    rail.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // Lichtkegel im CTA-Band
  if (fine) document.querySelectorAll('main .cta-band').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`); });
  });
})();
