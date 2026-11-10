/* Kontaktformular: Prüfung im Browser (die echte Prüfung macht kontakt.php auf dem Server) */
(function () {
  'use strict';
  var f = document.getElementById('contact-form'); if (!f) return;
  var ts = document.getElementById('f-ts'); if (ts) ts.value = String(Math.floor(Date.now() / 1000));
  var status = document.getElementById('form-status');
  var MAILTO = !/(^|\.)projektex\.de$/i.test(location.hostname);
  function val(id) { var el = document.getElementById(id); return el ? String(el.value || '').trim() : ''; }
  if (MAILTO) { var btn = f.querySelector('button[type=submit]'); if (btn) btn.textContent = 'Anfrage per E-Mail senden'; }
  var q = new URLSearchParams(location.search);
  var pre = q.get('leistung');
  if (pre) {
    document.querySelectorAll('[data-chips="leistungen"] button').forEach(function (b) {
      if (b.textContent.trim() === pre) { b.setAttribute('aria-pressed', 'true'); b.click(); b.setAttribute('aria-pressed', 'true'); }
    });
    var hiddenLeist = document.getElementById('f-leistungen');
    if (hiddenLeist && !hiddenLeist.value) {
      document.querySelectorAll('[data-chips="leistungen"] button').forEach(function (b) {
        if (b.textContent.trim() === pre) b.setAttribute('aria-pressed', 'true');
      });
      hiddenLeist.value = pre;
    }
  }
  var prof = q.get('profil'), ta = document.getElementById('f-nachricht');
  if (prof && ta && !ta.value) ta.value = 'Google-Profil: ' + prof.slice(0, 300) + '\n\nDiese Bewertungen möchten wir prüfen lassen (mit Grund):\n';
  if (q.get('ok') === '1') status.textContent = 'Danke! Deine Anfrage ist angekommen. Wir melden uns in der Regel innerhalb von zwei Werktagen.';
  if (q.get('err')) status.textContent = 'Das hat leider nicht geklappt. Bitte prüfe die Angaben oder schreib direkt an kontakt@projektex.de.';
  var msgs = {
    name: 'Bitte gib deinen Namen an.',
    email: 'Bitte gib eine gültige E-Mail-Adresse an.',
    nachricht: 'Bitte schreib uns mindestens ein paar Worte (10 Zeichen).',
    branche: 'Bitte nennen Sie die Branche.',
    satz: 'Bitte beschreiben Sie in einem Satz, was das Unternehmen macht.'
  };
  var CHIP = {
    gebiet: ['lokal', 'regional', 'deutschlandweit', 'international'],
    kunden: ['B2B', 'B2C'],
    ziel: ['mehr Anfragen', 'mehr Reichweite', 'Bekanntheit', 'Mitarbeiter finden', 'Online-Verkauf'],
    'stand-web': ['keine Website', 'veraltete Website', 'Website vorhanden'],
    'stand-social': ['ja', 'nein'],
    'stand-werbung': ['ja', 'nein'],
    leistungen: ['Websites', 'SEO & Sichtbarkeit', 'Systeme & Dashboards', 'Automatisierung & Chatbots', 'App Design', 'Werbeclips', 'Ads-Management', 'Newsletter-Marketing'],
    material: ['Logo', 'Fotos', 'Videos', 'Texte'],
    budget: ['unter 500 €', '500–2.000 €', 'über 2.000 €', 'noch offen'],
    zeitpunkt: ['sofort', 'in 1–3 Monaten', 'später'],
    entscheidet: ['ich selbst', 'mit Partner/Team']
  };
  document.querySelectorAll('[data-chips]').forEach(function (group) {
    var key = group.getAttribute('data-chips');
    var hidden = document.getElementById('f-' + key);
    var single = group.getAttribute('data-mode') === 'single';
    function sync() {
      var picked = [];
      group.querySelectorAll('button[aria-pressed="true"]').forEach(function (b) { picked.push(b.textContent.trim()); });
      if (hidden) hidden.value = picked.join(', ');
    }
    group.querySelectorAll('button').forEach(function (btn) {
      if ((CHIP[key] || []).indexOf(btn.textContent.trim()) < 0) return;
      btn.addEventListener('click', function () {
        var on = btn.getAttribute('aria-pressed') !== 'true';
        if (single && on) group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        sync();
      });
    });
  });
  function check(el) {
    var e = document.getElementById('e-' + el.name); if (!e) return true;
    var ok = el.checkValidity();
    e.textContent = ok ? '' : msgs[el.name];
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }
  ['f-branche', 'f-satz', 'f-name', 'f-email', 'f-nachricht'].forEach(function (id) {
    var el = document.getElementById(id); if (el) el.addEventListener('blur', function () { check(el); });
  });
  f.addEventListener('submit', function (ev) {
    var first = null;
    ['f-branche', 'f-satz', 'f-name', 'f-email', 'f-nachricht'].forEach(function (id) { var el = document.getElementById(id); if (el && !check(el) && !first) first = el; });
    if (first) { ev.preventDefault(); first.focus(); status.textContent = 'Bitte prüfe die markierten Felder.'; return; }
    if (MAILTO) { ev.preventDefault(); sendMail(); }
  });

  /* ÜBERGANG bis zum IONOS-Umzug: Auf GitHub Pages läuft kein PHP. Außerhalb von projektex.de
     öffnet das Formular deshalb das E-Mail-Programm (mailto:) statt kontakt.php aufzurufen.
     Auf projektex.de (IONOS) greift automatisch wieder kontakt.php. Zurücknehmen: siehe docs/IONOS-UMZUG.md */
  function sendMail() {
    if (val('f-website')) return; // Honeypot
    var leistung = val('f-leistungen');
    var subject = 'Anfrage über projektex.de: ' + (leistung || 'Allgemein');
    var body = 'Name: ' + val('f-name') + '\nE-Mail: ' + val('f-email') + '\nTelefon: ' + val('f-telefon') +
      '\nAnfrage als: ' + val('f-kundentyp') + '\nUnternehmen/Verein: ' + val('f-firma') +
      '\nBranche: ' + val('f-branche') + '\nIn einem Satz: ' + val('f-satz') +
      '\nWebsite: ' + val('f-web') + '\nSocial Media: ' + val('f-social') +
      '\nGebiet: ' + val('f-gebiet') + '\nKunden: ' + val('f-kunden') +
      '\nWichtigstes Ziel: ' + val('f-ziel') +
      '\nWebsite heute: ' + val('f-stand-web') + '\nSocial Media aktiv: ' + val('f-stand-social') + '\nBisher Werbung: ' + val('f-stand-werbung') +
      '\nLeistungen: ' + leistung + '\nVorhandenes Material: ' + val('f-material') +
      '\nMonatliches Marketingbudget: ' + val('f-budget') + '\nWann soll es losgehen?: ' + val('f-zeitpunkt') +
      '\nWer entscheidet?: ' + val('f-entscheidet') +
      '\n\nNachricht:\n' + val('f-nachricht') + '\n';
    status.textContent = 'Dein E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage. Bitte dort noch auf Senden tippen. Falls nichts passiert, schreib direkt an kontakt@projektex.de.';
    location.href = 'mailto:kontakt@projektex.de?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
})();
