/* PROJEKT EP – Einwilligungs-Banner (TDDDG § 25 / DSGVO Art. 6 Abs. 1 lit. a)
 * Basis: orestbida/cookieconsent v3 (MIT), lokal unter assets/vendor/cookieconsent.
 * Regeln: Kein Tracking vor Opt-in. "Alle ablehnen" gleichwertig zu "Alle akzeptieren".
 * Tracking-IDs unten eintragen ERST nach Freigabe durch Eugen + Datenschutz-Abschnitt 5 anpassen
 * + CSP (Meta-Tag und .htaccess) um die Dienst-Domains erweitern (siehe docs/IONOS-UMZUG.md).
 */
(function () {
  'use strict';
  var TRACKING = {
    ga4: '',        // z. B. 'G-XXXXXXX'   -> Kategorie analytics
    googleAds: '',  // z. B. 'AW-XXXXXXX'  -> Kategorie marketing
    metaPixel: ''   // z. B. '123456789'   -> Kategorie marketing
  };

  function loadScript(src) {
    var s = document.createElement('script'); s.src = src; s.async = true; document.head.appendChild(s);
  }
  function startGoogle(id) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', id);
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id));
  }
  function startMeta(id) {
    if (window.fbq) return;
    var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', id); window.fbq('track', 'PageView');
  }
  function apply() {
    var CC = window.CookieConsent;
    if (CC.acceptedCategory('analytics') && TRACKING.ga4) startGoogle(TRACKING.ga4);
    if (CC.acceptedCategory('marketing')) {
      if (TRACKING.googleAds) startGoogle(TRACKING.googleAds);
      if (TRACKING.metaPixel) startMeta(TRACKING.metaPixel);
    }
  }
  function inactive(name) { return name + ' (vorbereitet, derzeit nicht aktiv)'; }
  var root = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/assets\/consent\.js.*$/, '') : '/';

  window.CookieConsent.run({
    revision: 1,
    cookie: { name: 'cc_cookie', expiresAfterDays: 182, sameSite: 'Lax' },
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: 'box', equalWeightButtons: true, flipButtons: false }
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: { autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }] } },
      marketing: { autoClear: { cookies: [{ name: '_fbp' }, { name: /^_gcl/ }] } }
    },
    onConsent: apply,
    onChange: function () { apply(); },
    language: {
      default: 'de',
      translations: {
        de: {
          consentModal: {
            title: 'Datenschutz-Einstellungen',
            description: 'Wir nutzen nur technisch notwendige Speicherung. Statistik- und Werbedienste laden wir erst, wenn du zustimmst. Du kannst deine Wahl jederzeit über „Cookie-Einstellungen“ im Footer ändern.',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Alle ablehnen',
            showPreferencesBtn: 'Einstellungen',
            footer: '<a href="' + root + 'impressum.html">Impressum</a><a href="' + root + 'datenschutz.html">Datenschutz</a>'
          },
          preferencesModal: {
            title: 'Cookie-Einstellungen',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Alle ablehnen',
            savePreferencesBtn: 'Auswahl speichern',
            closeIconLabel: 'Schließen',
            sections: [
              { title: 'Deine Wahl', description: 'Hier entscheidest du, welche Dienste wir nutzen dürfen. Ohne Zustimmung laden wir keine Dienste von Drittanbietern.' },
              { title: 'Notwendig', description: 'Speichert nur deine Auswahl in diesem Banner (Cookie „cc_cookie“, 6 Monate). Immer aktiv.', linkedCategory: 'necessary' },
              { title: 'Statistik', description: inactive('Google Analytics 4') + '. Hilft uns zu verstehen, wie die Seite genutzt wird.', linkedCategory: 'analytics' },
              { title: 'Marketing', description: inactive('Google Ads Conversion-Tracking, Meta-Pixel') + '. Misst die Wirkung unserer Anzeigen.', linkedCategory: 'marketing' },
              { title: 'Mehr Informationen', description: 'Details in der <a href="' + root + 'datenschutz.html#cookies">Datenschutzerklärung</a>.' }
            ]
          }
        }
      }
    }
  });
})();
