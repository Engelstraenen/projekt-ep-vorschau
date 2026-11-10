/* Kontaktformular: Prüfung im Browser (die echte Prüfung macht kontakt.php auf dem Server) */
(function () {
  'use strict';
  var f = document.getElementById('contact-form'); if (!f) return;
  var ts = document.getElementById('f-ts'); if (ts) ts.value = String(Math.floor(Date.now() / 1000));
  var status = document.getElementById('form-status');
  var MAILTO = !/(^|\.)projektex\.de$/i.test(location.hostname);
  function val(id) { var el = document.getElementById(id); return el ? String(el.value || '').trim() : ''; }
  if (MAILTO) { var btn = f.querySelector('button[type=submit]'); if (btn) btn.textContent = 'Anfrage per E-Mail senden'; }
  var CHIP = {
    haken: ['zu wenige Anfragen', 'kaum Reichweite', 'Website veraltet oder fehlt', 'keine Zeit für Social Media', 'Werbung bringt nichts'],
    material: ['Logo', 'eigene Fotos', 'eigene Videos', 'Texte für die Website', 'nichts davon']
  };
  document.querySelectorAll('[data-chips]').forEach(function (group) {
    var key = group.getAttribute('data-chips');
    var hidden = document.getElementById('f-' + key);
    var exclusive = group.getAttribute('data-exclusive');
    function sync() {
      var picked = [];
      group.querySelectorAll('button[aria-pressed="true"]').forEach(function (b) { picked.push(b.textContent.trim()); });
      if (hidden) hidden.value = picked.join(', ');
    }
    group.querySelectorAll('button').forEach(function (btn) {
      if (CHIP[key].indexOf(btn.textContent.trim()) < 0) return;
      btn.addEventListener('click', function () {
        var on = btn.getAttribute('aria-pressed') !== 'true';
        var label = btn.textContent.trim();
        if (exclusive && on && label === exclusive) {
          group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        } else if (exclusive && on) {
          group.querySelectorAll('button').forEach(function (b) { if (b.textContent.trim() === exclusive) b.setAttribute('aria-pressed', 'false'); });
        }
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        sync();
      });
    });
  });
  var q = new URLSearchParams(location.search);
  var pre = q.get('leistung'), sel = document.getElementById('f-leistung');
  if (pre && sel) { for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].text === pre) { sel.selectedIndex = i; break; } } }
  var prof = q.get('profil'), ta = document.getElementById('f-nachricht');
  if (prof && ta && !ta.value) ta.value = 'Google-Profil: ' + prof.slice(0, 300) + '\n\nDiese Bewertungen möchten wir prüfen lassen (mit Grund):\n';
  if (q.get('ok') === '1') status.textContent = 'Danke! Deine Anfrage ist angekommen. Wir melden uns in der Regel innerhalb von zwei Werktagen.';
  if (q.get('err')) status.textContent = 'Das hat leider nicht geklappt. Bitte prüfe die Angaben oder schreib direkt an kontakt@projektex.de.';
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

  /* ÜBERGANG bis zum IONOS-Umzug: Auf GitHub Pages läuft kein PHP. Außerhalb von projektex.de
     öffnet das Formular deshalb das E-Mail-Programm (mailto:) statt kontakt.php aufzurufen.
     Auf projektex.de (IONOS) greift automatisch wieder kontakt.php. Zurücknehmen: siehe docs/IONOS-UMZUG.md */
  function sendMail() {
    if (val('f-website')) return; // Honeypot
    var leistung = val('f-leistung');
    var subject = 'Anfrage über projektex.de: ' + (leistung || 'Allgemein');
    var body = 'Name: ' + val('f-name') + '\nE-Mail: ' + val('f-email') + '\nAnfrage als: ' + val('f-kundentyp') + '\nUnternehmen/Verein: ' + val('f-firma') +
      '\nTätigkeit: ' + val('f-taetigkeit') + '\nBranche bzw. Bereich: ' + val('f-branche') +
      '\nWebsite: ' + val('f-web') + '\nSocial Media: ' + val('f-social') +
      '\nZielgruppe und Region: ' + val('f-zielgruppe') + '\nWichtigstes Ziel: ' + val('f-ziel') +
      '\nWo hakt es gerade?: ' + val('f-haken') + '\nIn eigenen Worten: ' + val('f-haken-text') +
      '\nLeistung: ' + leistung + '\nWas haben Sie schon?: ' + val('f-material') +
      '\nZeitpunkt: ' + val('f-zeitpunkt') + '\nWer entscheidet?: ' + val('f-entscheidet') +
      '\n\nNachricht:\n' + val('f-nachricht') + '\n';
    status.textContent = 'Dein E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage. Bitte dort noch auf Senden tippen. Falls nichts passiert, schreib direkt an kontakt@projektex.de.';
    location.href = 'mailto:kontakt@projektex.de?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
})();
