/* Kontaktformular: Prüfung im Browser (die echte Prüfung macht kontakt.php auf dem Server) */
(function () {
  'use strict';
  var f = document.getElementById('contact-form'); if (!f) return;
  var ts = document.getElementById('f-ts'); if (ts) ts.value = String(Math.floor(Date.now() / 1000));
  var status = document.getElementById('form-status');
  var MAILTO = !/(^|\.)projekt-ep\.de$/i.test(location.hostname);
  function val(id) { var el = document.getElementById(id); return el ? String(el.value || '').trim() : ''; }
  if (MAILTO) { var btn = f.querySelector('button[type=submit]'); if (btn) btn.textContent = 'Anfrage per E-Mail senden'; }
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
    if (first) { ev.preventDefault(); first.focus(); status.textContent = 'Bitte prüfe die markierten Felder.'; return; }
    if (MAILTO) { ev.preventDefault(); sendMail(); }
  });

  /* ÜBERGANG bis zum IONOS-Umzug: Auf GitHub Pages läuft kein PHP. Außerhalb von projekt-ep.de
     öffnet das Formular deshalb das E-Mail-Programm (mailto:) statt kontakt.php aufzurufen.
     Auf projekt-ep.de (IONOS) greift automatisch wieder kontakt.php. Zurücknehmen: siehe docs/IONOS-UMZUG.md */
  function sendMail() {
    if (val('f-website')) return; // Honeypot
    var leistung = val('f-leistung');
    var subject = 'Anfrage über projekt-ep.de: ' + (leistung || 'Allgemein');
    var body = 'Name: ' + val('f-name') + '\nE-Mail: ' + val('f-email') + '\nAnfrage als: ' + val('f-kundentyp') + '\nUnternehmen/Verein: ' + val('f-firma') +
      '\nLeistung: ' + leistung + '\n\nNachricht:\n' + val('f-nachricht') + '\n';
    status.textContent = 'Dein E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage. Bitte dort noch auf Senden tippen. Falls nichts passiert, schreib direkt an kontakt@projekt-ep.de.';
    location.href = 'mailto:kontakt@projekt-ep.de?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
})();
