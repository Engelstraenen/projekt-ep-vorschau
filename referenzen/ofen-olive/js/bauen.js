(() => {
  const el = document.getElementById('builder'); if (!el || !window.OOBuilder) return;
  window.OOBuilder.mount(el, {
    title: 'Deine <em>Pizza</em>',
    doneLabel: 'Fertig · Weiter in der App',
    onDone: o => { location.href = '../ofen-olive-app/'; }
  });
})();
(() => {
  const fab = document.querySelector('.fab'), sec = document.getElementById('bauen'); if (!fab || !sec) return;
  // Knopf ausblenden, solange der Builder die Bildschirmmitte bedeckt (der frühere Schwellwert von 15 % der Sektion
  // wurde bei wenig Höhe, etwa am Handy quer, nie erreicht, dann lag der Knopf über den Belag-Feldern)
  new IntersectionObserver(([e]) => { fab.style.opacity = e.isIntersecting ? '0' : ''; fab.style.pointerEvents = e.isIntersecting ? 'none' : ''; }, { rootMargin: '-40% 0px -40% 0px' }).observe(sec);
})();
