/* Projekt EP · Chat-Demo-Seite: Knöpfe verdrahten (kein Inline-Skript, passt zur CSP der Website) */
(() => {
  const go = (fn) => { if (window.EPChat) fn(); else setTimeout(() => go(fn), 60); };
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => go(() => window.EPChat.open())));
  document.querySelectorAll('[data-ask]').forEach((b) => b.addEventListener('click', () => go(() => window.EPChat.ask(b.dataset.ask))));
})();
