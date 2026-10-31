/* Referenz-Showcase: stummes Scroll-Video nur abspielen, wenn sichtbar; reduzierte Bewegung = kein Autoplay (Poster + Play-Knopf). */
(() => {
  const screen = document.querySelector('.sc-screen');
  const video = screen && screen.querySelector('video');
  const btn = screen && screen.querySelector('.sc-toggle');
  if (!video || !btn) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  let userPaused = false, visible = false;
  const set = state => {
    screen.dataset.state = state;
    const playing = state === 'playing';
    btn.setAttribute('aria-label', playing ? 'Vorschau-Video pausieren' : 'Vorschau-Video abspielen');
    btn.setAttribute('aria-pressed', playing ? 'false' : 'true');
  };
  const play = () => { video.preload = 'auto'; const p = video.play(); if (p && p.catch) p.catch(() => set('idle')); };
  video.addEventListener('playing', () => set('playing'));
  video.addEventListener('pause', () => set(video.currentTime > 0 ? 'paused' : 'idle'));
  btn.hidden = false;
  set('idle');
  btn.addEventListener('click', () => {
    if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
  });
  const auto = () => !reduce.matches && !saveData && !userPaused;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        visible = e.isIntersecting;
        if (visible && auto()) play(); else if (!visible && !video.paused) video.pause();
      });
    }, { threshold: 0.35 }).observe(screen);
  } else if (auto()) play();
  reduce.addEventListener && reduce.addEventListener('change', () => { if (reduce.matches && !video.paused) { userPaused = true; video.pause(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && !video.paused) video.pause(); else if (!document.hidden && visible && auto()) play(); });
})();
