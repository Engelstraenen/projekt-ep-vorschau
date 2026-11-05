/* Referenz-Showcase: stummes Scroll-Video nur abspielen, wenn sichtbar; reduzierte Bewegung = kein Autoplay (Poster + Play-Knopf).
   Poster-<img> bleibt unsichtbar, sobald das Video spielt/pausiert (data-state), damit Handyrahmen nicht „stehen bleiben“. */
document.querySelectorAll('.sc-screen').forEach(screen => {
  const video = screen.querySelector('video');
  const btn = screen.querySelector('.sc-toggle');
  if (!video || !btn) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const phone = !!(screen.classList.contains('phone-screen') || screen.closest('.phone-frame'));
  let userPaused = false, visible = false;
  const set = state => {
    screen.dataset.state = state;
    const playing = state === 'playing';
    btn.setAttribute('aria-label', playing ? 'Vorschau-Video pausieren' : 'Vorschau-Video abspielen');
    btn.setAttribute('aria-pressed', playing ? 'false' : 'true');
  };
  const showBtn = need => { btn.hidden = !need; };
  const play = () => {
    video.preload = 'auto';
    const p = video.play();
    if (p && p.catch) p.catch(() => { set('idle'); showBtn(true); });
  };
  video.addEventListener('playing', () => { set('playing'); if (!reduce.matches && !saveData) showBtn(false); });
  video.addEventListener('pause', () => set(video.currentTime > 0 ? 'paused' : 'idle'));
  /* Play-Knopf nur wenn Autoplay ohnehin aus (Reduced Motion / Save-Data) — sonst unsichtbar, Video ersetzt das Poster von selbst. */
  showBtn(reduce.matches || saveData);
  set('idle');
  btn.addEventListener('click', () => {
    if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
  });
  const auto = () => !reduce.matches && !saveData && !userPaused;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        visible = e.isIntersecting;
        if (visible && auto()) play();
        else if (!visible && !video.paused) video.pause();
      });
    }, { threshold: phone ? 0.12 : 0.35 }).observe(screen);
  } else if (auto()) play();
  reduce.addEventListener && reduce.addEventListener('change', () => {
    showBtn(reduce.matches || saveData);
    if (reduce.matches && !video.paused) { userPaused = true; video.pause(); }
    else if (!reduce.matches && visible && auto()) play();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !video.paused) video.pause();
    else if (!document.hidden && visible && auto()) play();
  });
});
