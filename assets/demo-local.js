/* Demo controls deliberately use divs, not forms: safe even without JavaScript. */
(function () {
  'use strict';
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-local-confirm]');
    if (!button) return;
    var demo = button.closest('[data-local-demo]');
    if (!demo) return;
    event.preventDefault();
    var status = demo.querySelector('.demo-local-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'demo-local-status';
      status.setAttribute('role', 'status');
      demo.appendChild(status);
    }
    status.textContent = 'Lokal bestätigt – reine Demo. Nichts versendet, keine Anfrage, Buchung oder Anmeldung ausgelöst. Eingaben werden nicht in die URL übernommen oder durch diese Seite gespeichert.';
  });
})();
