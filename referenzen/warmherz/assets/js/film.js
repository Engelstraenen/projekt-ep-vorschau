/* Notdienst-Film im Kopfbereich (Wartung).
   Läuft immer stumm in Schleife. Ton NUR per Knopf: ein Durchlauf von vorne mit Sprecher, danach wieder stumm
   (Eugen 18.11.2026: kein Dauerton). */
(() => {
  const film = document.querySelector('[data-film]');
  if (!film) return;
  const v = film.querySelector('video');
  const items = [...film.querySelectorAll('[data-at]')];
  const bar = film.querySelector('[data-film-bar]');
  const clock = film.querySelector('[data-clock]');
  const btn = film.querySelector('[data-sound]');
  const btnT = film.querySelector('[data-sound-t]');
  v.src = (innerWidth < 800 ? v.dataset.srcM : v.dataset.src) || v.dataset.src;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]shot=/.test(location.search);

  const render = () => {
    const t = v.currentTime || 0, d = v.duration || 10;
    items.forEach(el => {
      const a = +el.dataset.at, o = el.dataset.out ? +el.dataset.out : d + 1;
      el.classList.toggle('on', t >= a && t < o);
    });
    if (bar) bar.style.transform = `scaleX(${Math.min(1, t / d)})`;
    if (clock) { const m = 14 + Math.floor(t / 10 * 3); clock.textContent = '02:' + String(m).padStart(2, '0'); }
  };

  if (still) { items.forEach(el => el.classList.add('on')); film.classList.add('still'); return; }

  let raf;
  const loop = () => { render(); raf = requestAnimationFrame(loop); };
  v.addEventListener('play', () => { cancelAnimationFrame(raf); loop(); });
  v.addEventListener('pause', () => cancelAnimationFrame(raf));
  v.addEventListener('seeked', render);

  const showState = () => {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(!v.muted));
    btnT.textContent = v.muted ? 'Film mit Ton ansehen' : 'Ton aus';
  };
  // Ton nur auf Knopfdruck, genau EIN Durchlauf mit Sprecher, danach automatisch wieder stumm.
  let soundRun = false, lastT = 0;
  const mute = () => { v.muted = true; soundRun = false; showState(); };
  v.addEventListener('timeupdate', () => {
    if (soundRun && v.currentTime < lastT - 1) mute();   // Schleife springt auf 0 -> Durchlauf fertig
    lastT = v.currentTime;
  });

  new IntersectionObserver(es => {
    if (es[0].isIntersecting) v.play().catch(() => {});
    else { v.pause(); if (soundRun) mute(); }
  }, { threshold: .4 }).observe(film);

  btn && btn.addEventListener('click', () => {
    if (!v.muted) return mute();
    v.muted = false; soundRun = true; lastT = 0; v.currentTime = 0;
    v.play().catch(() => mute());
    showState();
  });
})();
