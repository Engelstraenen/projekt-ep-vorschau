/* Compatibility guard for older cached markup. Profile forwarding is retired. */
(function () {
  'use strict';
  var demo = document.getElementById('ls-search');
  if (!demo) return;
  demo.addEventListener('submit', function (event) {
    event.preventDefault();
    var status = demo.querySelector('[role="status"]');
    if (!status) {
      status = document.createElement('p');
      status.setAttribute('role', 'status');
      demo.appendChild(status);
    }
    status.textContent = 'Reine Demo: nichts versendet. Profilangaben werden nicht in die URL übernommen.';
  });
})();
