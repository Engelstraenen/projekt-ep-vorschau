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
  new IntersectionObserver(([e]) => { fab.style.opacity = e.isIntersecting ? '0' : ''; fab.style.pointerEvents = e.isIntersecting ? 'none' : ''; }, { threshold: .15 }).observe(sec);
})();
