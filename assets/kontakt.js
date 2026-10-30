/* Kontaktformular: Prüfung im Browser (die echte Prüfung macht kontakt.php auf dem Server) */
(function () {
  'use strict';
  var f = document.getElementById('contact-form'); if (!f) return;
  var ts = document.getElementById('f-ts'); if (ts) ts.value = String(Math.floor(Date.now() / 1000));
  var status = document.getElementById('form-status');
  var q = new URLSearchParams(location.search);
  if (q.get('ok') === '1') status.textContent = 'Danke! Deine Anfrage ist angekommen. Wir melden uns in der Regel innerhalb von zwei Werktagen.';
  if (q.get('err')) status.textContent = 'Das hat leider nicht geklappt. Bitte prüfe die Angaben oder schreib direkt an kontakt@projekt-ep.de.';
  var msgs = {
    name: 'Bitte gib deinen Namen an.',
    email: 'Bitte gib eine gültige E-Mail-Adresse an.',
    nachricht: 'Bitte schreib uns mindestens ein paar Worte (10 Zeichen).'
  };
  function check(el) {
    var e = document.getElementById('e-' + el.name); if (!e) return true;
    var ok = el.checkValidity();
    e.textContent = ok ? '' : msgs[el.name];
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }
  ['f-name', 'f-email', 'f-nachricht'].forEach(function (id) {
    var el = document.getElementById(id); el.addEventListener('blur', function () { check(el); });
  });
  f.addEventListener('submit', function (ev) {
    var first = null;
    ['f-name', 'f-email', 'f-nachricht'].forEach(function (id) { var el = document.getElementById(id); if (!check(el) && !first) first = el; });
    if (first) { ev.preventDefault(); first.focus(); status.textContent = 'Bitte prüfe die markierten Felder.'; }
  });
})();
