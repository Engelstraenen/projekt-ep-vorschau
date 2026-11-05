/* PROJEKT EX – Einwilligungs-Banner (TDDDG § 25 / DSGVO Art. 6 Abs. 1 lit. a)
 * Basis: orestbida/cookieconsent v3 (MIT), lokal unter assets/vendor/cookieconsent.
 * Regeln: Kein Tracking vor Opt-in. "Alle ablehnen" gleichwertig zu "Alle akzeptieren", keine Vorauswahl.
 * Tracking einschalten: siehe docs/tracking-einschalten.md (IDs hier eintragen + Paket mit --tracking bauen,
 * das schaltet CSP-Domains und Datenschutz-Abschnitte frei). IDs leer = es wird NICHTS geladen.
 */
(function () {
  'use strict';
  var TRACKING = {
    ga4: '',        // z. B. 'G-XXXXXXXXXX'   -> Kategorie "analytics" (Statistik)
    googleAds: '',  // z. B. 'AW-XXXXXXXXX'   -> Kategorie "marketing"
    metaPixel: '',  // z. B. '123456789012345' -> Kategorie "marketing"
    tiktokPixel: '' // z. B. 'CXXXXXXXXXXXXXXXXXXX' -> Kategorie "marketing"
  };

  function loadScript(src) {
    var s = document.createElement('script'); s.src = src; s.async = true; document.head.appendChild(s);
  }

  // Google (GA4 + Ads) mit Consent Mode v2: Standard "denied", Freigabe nur je erteilter Kategorie.
  // gtag.js wird erst geladen, wenn mindestens eine passende Einwilligung UND eine ID vorliegt (Basic Consent Mode).
  var gStarted = false, gConfigured = {};
  function gtagInit() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (!gStarted) {
      window.gtag('consent', 'default', {
        ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
        analytics_storage: 'denied', functionality_storage: 'denied', personalization_storage: 'denied',
        security_storage: 'granted', wait_for_update: 500
      });
      window.gtag('set', 'ads_data_redaction', true);
      window.gtag('set', 'url_passthrough', false);
    }
  }
  function startGoogle(analytics, marketing) {
    var ids = [];
    if (analytics && TRACKING.ga4) ids.push(TRACKING.ga4);
    if (marketing && TRACKING.googleAds) ids.push(TRACKING.googleAds);
    if (!ids.length) return;
    gtagInit();
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    });
    if (!gStarted) { window.gtag('js', new Date()); loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ids[0])); gStarted = true; }
    ids.forEach(function (id) { if (!gConfigured[id]) { window.gtag('config', id); gConfigured[id] = true; } });
  }
  function startMeta(id) {
    if (window.fbq) return;
    var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('consent', 'grant'); window.fbq('init', id); window.fbq('track', 'PageView');
  }
  function startTikTok(id) {
    if (window.ttq) return;
    var q = []; var t = window.ttq = { _q: q };
    ['page', 'track', 'identify', 'grantConsent', 'revokeConsent', 'holdConsent'].forEach(function (m) { t[m] = function () { q.push([m].concat([].slice.call(arguments))); }; });
    loadScript('https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + encodeURIComponent(id) + '&lib=ttq');
    t.grantConsent(); t.page();
  }
  function apply() {
    var CC = window.CookieConsent;
    var a = CC.acceptedCategory('analytics'), m = CC.acceptedCategory('marketing');
    startGoogle(a, m);
    if (m && TRACKING.metaPixel) startMeta(TRACKING.metaPixel);
    if (m && TRACKING.tiktokPixel) startTikTok(TRACKING.tiktokPixel);
  }
  // Text im Banner: Dienst nur als aktiv nennen, wenn eine ID eingetragen ist
  function list(pairs) {
    var on = pairs.filter(function (p) { return p[1]; }).map(function (p) { return p[0]; });
    var off = pairs.filter(function (p) { return !p[1]; }).map(function (p) { return p[0]; });
    var out = [];
    if (on.length) out.push(on.join(', '));
    if (off.length) out.push(off.join(', ') + ' (vorbereitet, derzeit nicht aktiv)');
    return out.join('; ');
  }
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
      analytics: { enabled: false, autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }], reloadPage: true } },
      marketing: { enabled: false, autoClear: { cookies: [{ name: '_fbp' }, { name: /^_gcl/ }, { name: '_ttp' }, { name: /^_tt_/ }], reloadPage: true } }
    },
    onConsent: apply,
    onChange: function () { apply(); },
    language: {
      default: 'de',
      translations: {
        de: {
          consentModal: {
            title: 'Datenschutz-Einstellungen',
            description: 'Ohne deine Zustimmung nutzen wir nur technisch notwendige Speicherung. Statistik- und Werbedienste laden wir erst, wenn du zustimmst. Du kannst deine Wahl jederzeit über „Cookie-Einstellungen“ im Footer ändern.',
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
              { title: 'Statistik', description: list([['Google Analytics 4', TRACKING.ga4]]) + '. Hilft uns zu verstehen, wie die Seite genutzt wird.', linkedCategory: 'analytics' },
              { title: 'Marketing', description: list([['Google Ads Conversion-Tracking', TRACKING.googleAds], ['Meta-Pixel', TRACKING.metaPixel], ['TikTok-Pixel', TRACKING.tiktokPixel]]) + '. Misst die Wirkung unserer Anzeigen.', linkedCategory: 'marketing' },
              { title: 'Mehr Informationen', description: 'Details in der <a href="' + root + 'datenschutz.html#cookies">Datenschutzerklärung</a>.' }
            ]
          }
        }
      }
    }
  });
})();
