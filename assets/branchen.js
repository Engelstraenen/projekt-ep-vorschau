// Kompakte Referenzkarten: Klick oeffnet die grosse Ansicht (<dialog>). Ohne JavaScript fuehrt die Karte direkt zur Website.
// Strg/Cmd/Mittelklick oeffnen weiter direkt im neuen Tab. Daten stehen an der Karte (data-bx-*), erzeugt von tools/branchen/bauen.py.
(() => {
  const dlg = document.getElementById('bx-dlg');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const q = (s) => dlg.querySelector(s);
  const img = q('.bx-dlg-img img'), box = q('.bx-dlg-img'), h = q('h2'), p = q('.bx-dlg-p'), badge = q('.bx-badge'), lab = q('.bx-dlg-l');
  const go = q('.bx-acts .btn'), br = q('.bx-sec');
  let last = null;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-bx-name]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); last = a;
    const d = a.dataset;
    img.src = d.bxBild; img.alt = 'Startseite von ' + d.bxName;
    box.classList.toggle('is-phone', /-480\./.test(d.bxBild));
    h.textContent = d.bxName; p.textContent = d.bxKurz; lab.textContent = d.bxLabel;
    badge.textContent = d.bxBadge; badge.classList.toggle('bx-kunde', d.bxBadge === 'Kundenprojekt');
    go.href = a.href;
    if (d.bxBranche) { br.href = d.bxBranche; br.hidden = false; } else { br.removeAttribute('href'); br.hidden = true; }
    dlg.showModal(); go.focus({ preventScroll: true });
  });
  q('.bx-x').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { if (last) last.focus({ preventScroll: true }); });
})();
