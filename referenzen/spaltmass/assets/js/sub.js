/* Unterseiten: Einblenden, Diagramme, Rechner, Checks, Tracker. Zurück-Link führt an dieselbe Stelle der Fahrt. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = window.SP_IMG || {};
  $$('img[data-src]').forEach(function (im) { var n = im.getAttribute('data-src'); if (!IMG[n]) { im.closest('figure,.s-hero,.two>div') ? (im.style.display = 'none') : 0; return; } im.src = 'assets/img/' + n + '.webp?v=' + (IMG._v || 1); });
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }); }, { threshold: .25 });
  $$('.rv,.bars,.cols').forEach(function (el) { io.observe(el); });
  // Zähler
  var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; co.unobserve(e.target); var el = e.target, to = +el.getAttribute('data-to'), d = +(el.getAttribute('data-dec') || 0), t0 = performance.now();
    (function f(n) { var t = Math.min(1, (n - t0) / 1400), v = to * (1 - Math.pow(1 - t, 3)); el.firstChild.nodeValue = v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }); if (t < 1) requestAnimationFrame(f); })(t0); }); }, { threshold: .5 });
  $$('[data-to]').forEach(function (el) { if (!el.firstChild) el.appendChild(document.createTextNode('0')); co.observe(el); });
  // Menü
  var bg = $('.burger'); if (bg) bg.addEventListener('click', function () { var o = document.documentElement.classList.toggle('menu-open'); bg.setAttribute('aria-expanded', o); });
  // Toast für Demo-Links
  var toastT; function toast(t) { var el = $('.toast'); if (!el) return; el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2800); }
  $$('[data-demo]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toast(a.getAttribute('data-demo')); }); });
  var eur = function (v) { return Math.round(v).toLocaleString('de-DE') + ' €'; };

  /* Bagatell-Check */
  var bc = $('#bagatell');
  if (bc) { var st = {}; var A = $('.answer', bc);
    $$('.chips', bc).forEach(function (g) { $$('button', g).forEach(function (b) { b.addEventListener('click', function () { $$('button', g).forEach(function (x) { x.classList.toggle('on', x === b); }); st[g.getAttribute('data-q')] = b.getAttribute('data-v'); ans(); }); }); });
    function ans() {
      if (st.schuld === 'ich') { A.textContent = 'Eigenverschulden: Für die Kasko beauftragt meist die Versicherung den Gutachter. Wir prüfen gern unabhängig mit, die Kosten klären wir vorher.'; return; }
      if (!st.schuld || !st.schaden) { A.textContent = 'Bitte beide Fragen beantworten.'; return; }
      if (st.schaden === 'klein') A.textContent = 'Wahrscheinlich ein Bagatellschaden (Faustregel: unter rund 750 €). Hier reicht oft ein Kostenvoranschlag. Unsicher? Schicken Sie Fotos, wir sagen es Ihnen kostenlos.';
      else A.textContent = 'Klarer Fall für ein Gutachten: Sie wählen den Sachverständigen, die gegnerische Haftpflicht zahlt ihn. Dazu Wertminderung und Nutzungsausfall, die ein Kostenvoranschlag nicht enthält.';
      if (st.schaden === 'unklar') A.textContent = 'Von außen oft nicht zu erkennen: Hinter dem Stoßfänger sitzen Träger und Sensoren. Schicken Sie 6 Fotos, wir schätzen kostenlos ein.';
    } }

  /* Rechner Wertminderung (Ruhkopf/Sahm) + Nutzungsausfall */
  var cr = $('#rechner');
  if (cr) {
    var NA = { A: 23, B: 29, C: 35, D: 38, E: 43, F: 50, G: 59, H: 65, J: 79, K: 119, L: 175 };
    var f = function (n) { return $('[name=' + n + ']', cr); };
    function calc() {
      var wbw = +f('wbw').value, rk = +f('rk').value, age = +f('age').value, grp = f('grp').value, days = +f('days').value;
      $('[data-o=wbw]', cr).textContent = eur(wbw); $('[data-o=rk]', cr).textContent = eur(rk); $('[data-o=age]', cr).textContent = age + (age === 1 ? ' Jahr' : ' Jahre'); $('[data-o=days]', cr).textContent = days + ' Tage';
      var ratio = rk / wbw, col = ratio < .1 || ratio > .9 ? -1 : ratio < .3 ? 0 : ratio < .6 ? 1 : 2;
      var T = [[5, 6, 7], [4, 5, 6], [3, 4, 5], [3, 4, 5]], fac = age <= 4 && col >= 0 ? T[age - 1][col] : 0;
      var mw = (wbw + rk) * fac / 100, nu = NA[grp] * days;
      $('[data-r=mw]', cr).textContent = eur(mw); $('[data-r=nu]', cr).textContent = eur(nu); $('[data-r=sum]', cr).textContent = eur(mw + nu);
      $('[data-r=info]', cr).textContent = ratio > .9 ? 'Reparatur über 90 % des Wiederbeschaffungswerts: wahrscheinlich wirtschaftlicher Totalschaden, dann rechnet der Gutachter anders.' : col < 0 ? 'Reparatur unter 10 % des Werts: nach Ruhkopf/Sahm keine Wertminderung.' : fac ? 'Faktor ' + fac + ' % nach Ruhkopf/Sahm (Reparatur ' + Math.round(ratio * 100) + ' % des Werts, ' + age + '. Zulassungsjahr).' : 'Ab dem 5. Jahr prüft der Gutachter die Wertminderung im Einzelfall.';
    }
    $$('input,select', cr).forEach(function (i) { i.addEventListener('input', calc); }); calc();
  }

  /* Tracker (Demo) */
  var tk = $('#tracker');
  if (tk) { var li = $$('li', tk), k = 0; var tt = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; tt.disconnect(); var iv = setInterval(function () { if (k >= li.length) { clearInterval(iv); return; } li[k++].classList.add('on'); }, 700); }, { threshold: .5 }); tt.observe(tk); }

  /* Lackschicht-Skala */
  var sc = $('#skala');
  if (sc) { var out = $('.answer', sc); $$('.scale button', sc).forEach(function (b) { b.addEventListener('click', function () { out.textContent = b.getAttribute('data-t'); }); }); }

  /* Musterbrief kopieren */
  var cp = $('#copy-mail');
  if (cp) cp.addEventListener('click', function () { var t = $('.mail').textContent; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast('Text kopiert. Name, Kennzeichen und Datum ergänzen.'); }, function () { toast('Bitte Text markieren und kopieren.'); }); });

  /* Unfallkarte drucken */
  var pr = $('#print-card'); if (pr) pr.addEventListener('click', function () { window.print(); });

  /* 60-Sekunden-Bewerbung (Karriere) */
  var db = $('#m-bewerben');
  if (db) { var qs = $$('.q', db), secs = 60, tmr = null;
    function go(i) { qs.forEach(function (q, k) { q.classList.toggle('on', k === i); }); if (i >= 3) { clearInterval(tmr); tmr = null; } }
    $$('[data-open="bewerben"]').forEach(function (b) { b.addEventListener('click', function () { secs = 60; $('[data-sec]', db).textContent = 60; go(0); db.showModal(); }); });
    qs.forEach(function (q, i) { $$('.opts button, .send', q).forEach(function (b) { b.addEventListener('click', function () { if (!tmr) tmr = setInterval(function () { secs = Math.max(0, secs - 1); $('[data-sec]', db).textContent = secs; }, 1000); go(i + 1); }); }); });
    db.addEventListener('close', function () { clearInterval(tmr); tmr = null; }); }
})();
