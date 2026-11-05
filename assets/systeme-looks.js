/* PROJEKT EX · Unsere Systeme mit Look-Umschalter (leistungen/systeme.html, #live-demos)
   NEUEN LOOK ERGÄNZEN: einen Eintrag in LOOKS anhängen. Pro System optional { href, img, alt } angeben;
   fehlt ein System, zeigt die Karte die klassische Demo im Rahmen des Looks (Hinweis "Look folgt").
   Bilder: lab/systeme/<name>-320/640/1024.webp. Demo-Pfade unter demos/systeme/ werden nur verlinkt. */
(function () {
  'use strict';
  var D = '../demos/systeme/';
  var LOOKS = [
    { id: 'klassisch', name: 'Klassisch', desc: 'Warmes Licht, ruhige Flächen. Der Standard für jeden Tag.', sys: {} },
    { id: 'holo', name: 'Holo', desc: 'Dunkles Glas, Neonlicht, die Paketstadt als Insel bei Nacht.', sys: {
      paketstadt: { href: D + 'holo-3d/', img: 'paketstadt3d-b', alt: 'Paketstadt im Holo-Look: Neon-Insel bei Nacht' },
      lager: { href: D + 'holo-3d/?geb=lager', img: 'lager3d-b', alt: 'Lager in 3D im Holo-Look' },
      shopraum: { href: D + 'holo-3d/?geb=shop', img: 'holo', alt: 'Shopraum im Holo-Look mit Globus voller Bestellungen' },
      problemcenter: { href: D + 'holo-3d/?geb=support', img: 'paketstadt3d-b', alt: 'Problemcenter im Holo-Look' },
      team: { href: D + 'holo-3d/?geb=personal', img: 'paketstadt3d-b', alt: 'Personal im Holo-Look' },
      bots: { href: D + 'holo-3d/?geb=bots', img: 'paketstadt3d-b', alt: 'Bots im Holo-Look' } } },
    { id: 'liquid', name: 'Liquid', desc: 'Weiche Formen, viel Licht, Produkte im Mittelpunkt.', sys: {
      paketstadt: { href: D + 'liquid-3d/', img: 'paketstadt3d-c', alt: 'Paketstadt im Liquid-Look: Spielzeugstadt im Tageslicht' },
      lager: { href: D + 'liquid-3d/?geb=lager', img: 'lager3d-c', alt: 'Lager in 3D im Liquid-Look' },
      shopraum: { href: D + 'liquid-3d/?geb=shop', img: 'liquid', alt: 'Shopraum im Liquid-Look' },
      problemcenter: { href: D + 'liquid-3d/?geb=support', img: 'paketstadt3d-c', alt: 'Problemcenter im Liquid-Look' },
      team: { href: D + 'liquid-3d/?geb=personal', img: 'paketstadt3d-c', alt: 'Personal im Liquid-Look' },
      bots: { href: D + 'liquid-3d/?geb=bots', img: 'paketstadt3d-c', alt: 'Bots im Liquid-Look' } } },
    { id: 'shopcontrol', name: 'ShopControl', desc: 'Kompakt und sachlich wie ein Leitstand.', sys: {
      paketstadt: { href: D + 'shop-control-3d/', img: 'shop-control', alt: 'Paketstadt im ShopControl-Look' },
      lager: { href: D + 'shop-control-3d/?geb=lager', img: 'shop-control', alt: 'Lager im ShopControl-Look' },
      shopraum: { href: D + 'shop-control-3d/?geb=shop', img: 'shop-control', alt: 'Shopraum im ShopControl-Look' },
      problemcenter: { href: D + 'shop-control-3d/?geb=support', img: 'shop-control', alt: 'Problemcenter im ShopControl-Look' },
      team: { href: D + 'shop-control-3d/?geb=personal', img: 'shop-control', alt: 'Personal im ShopControl-Look' },
      bots: { href: D + 'shop-control-3d/?geb=bots', img: 'shop-control', alt: 'Bots im ShopControl-Look' } } }
  ];
  var root = document.querySelector('[data-looks]');
  if (!root) return;
  var bar = root.querySelector('.lk-bar'), info = root.querySelector('.lk-desc');
  var cards = [].slice.call(root.querySelectorAll('[data-sys]'));
  cards.forEach(function (c) { // klassische Werte aus dem HTML merken
    var a = c.querySelector('.sd-open'), i = c.querySelector('img');
    c._base = { href: a.getAttribute('href'), src: i.getAttribute('src'), srcset: i.getAttribute('srcset'), alt: i.getAttribute('alt') };
  });
  LOOKS.forEach(function (l, n) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'lk-btn'; b.dataset.look = l.id; b.setAttribute('aria-pressed', n ? 'false' : 'true');
    b.innerHTML = '<span class="lk-dot" aria-hidden="true"></span>' + l.name;
    b.addEventListener('click', function () { apply(l, true); });
    bar.appendChild(b);
  });
  var soon = document.createElement('span'); soon.className = 'lk-soon'; soon.textContent = 'Weitere Looks in Arbeit'; bar.appendChild(soon);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  function set(l) {
    root.dataset.look = l.id; info.textContent = l.desc;
    [].forEach.call(bar.querySelectorAll('.lk-btn'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.look === l.id)); });
    cards.forEach(function (c) {
      var s = l.sys[c.dataset.sys], a = c.querySelector('.sd-open'), sh = c.querySelector('.sd-shot'), i = c.querySelector('img');
      var href = s ? s.href : c._base.href;
      a.setAttribute('href', href); sh.setAttribute('href', href);
      if (s && s.img) { var p = '../lab/systeme/' + s.img; i.src = p + '-640.webp'; i.srcset = p + '-320.webp 320w, ' + p + '-640.webp 640w, ' + p + '-1024.webp 1024w'; i.alt = s.alt; }
      else { i.src = c._base.src; i.srcset = c._base.srcset; i.alt = c._base.alt; }
      c.classList.toggle('lk-own', !!s || l.id === 'klassisch');
    });
  }
  function apply(l, anim) {
    if (root.dataset.look === l.id) return;
    try { history.replaceState(null, '', '#look-' + l.id); } catch (e) {}
    var g = window.gsap, shots = cards.map(function (c) { return c.querySelector('.sd-shot'); });
    if (!anim || !g || reduce.matches) return set(l);
    g.to(shots, { opacity: 0, scale: .97, duration: .16, ease: 'power2.in', stagger: .02, onComplete: function () {
      set(l);
      g.fromTo(shots, { opacity: 0, scale: .97 }, { opacity: 1, scale: 1, duration: .32, ease: 'power3.out', stagger: .035, clearProps: 'transform,opacity' });
    } });
  }
  var start = (location.hash.match(/^#look-([a-z]+)/) || [])[1];
  var first = LOOKS.filter(function (l) { return l.id === start; })[0] || LOOKS[0];
  set(first);
})();
