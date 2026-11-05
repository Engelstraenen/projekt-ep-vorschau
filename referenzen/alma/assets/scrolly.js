import * as THREE from './vendor/three.module.min.js';
const gsap = window.gsap, ST = window.ScrollTrigger;
gsap.registerPlugin(ST);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = matchMedia('(max-width: 800px)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => 1 - Math.pow(1 - t, 3);             // ease-out (Emil: ease-out fuer Eintritte)
const io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- Kinetic-Typo vorbereiten ---------- */
$$('.kin__l').forEach(l => {
  const em = l.querySelector('em'); const tgt = em || l; const txt = tgt.textContent;
  tgt.textContent = ''; [...txt].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? '\u00a0' : c; tgt.appendChild(s); });
});
$$('[data-word]').forEach(s => { const w = document.createElement('p'); w.className = 'wordbg'; w.setAttribute('aria-hidden', 'true'); w.textContent = s.dataset.word; (s.querySelector('.pin') || s.querySelector('.split')).prepend(w); });
const fmt = (n, sep) => sep ? Math.round(n).toLocaleString('de-DE') : String(Math.round(n));
function counters(root, p) { $$('.count', root).forEach(c => { const f = +(c.dataset.from || 0), t = +c.dataset.to; c.textContent = fmt(lerp(f, t, ease(p)), c.dataset.sep); }); }

if (RM) { $$('.count').forEach(c => c.textContent = fmt(+c.dataset.to, c.dataset.sep)); $$('.phases li').forEach(l => l.classList.add('on')); }
else init();

function init() {
  const P = { hero: 0, plantage: 0, ernte: 0, reise: 0, roesten: 0, mahlen: 0, bruehen: 0, tasse: 0 };
  const pinLen = { hero: 1.2, plantage: 1.4, reise: 3, roesten: 2.2, mahlen: 1.8, bruehen: 2, tasse: 1.6 };
  const scrub = MOB ? .6 : 1;
  for (const [id, len] of Object.entries(pinLen)) {
    const sec = document.getElementById(id === 'hero' ? 'start' : id);
    ST.create({ trigger: sec, start: 'top top', end: () => '+=' + innerHeight * len, pin: sec.querySelector('.pin'), scrub, anticipatePin: 1,
      onUpdate: s => { P[id] = s.progress; } });
  }
  ST.create({ trigger: '#ernte', start: 'top 60%', end: 'bottom bottom', onUpdate: s => P.ernte = s.progress });

  /* Hero: Buchstaben fliegen auseinander, Hintergrund zoomt */
  const hero = gsap.timeline({ scrollTrigger: { trigger: '#start', start: 'top top', end: () => '+=' + innerHeight * 1.2, scrub } });
  $$('.hero .ch').forEach((c, i) => hero.to(c, { yPercent: gsap.utils.random(-260, -80), xPercent: gsap.utils.random(-120, 120), rotate: gsap.utils.random(-50, 50), opacity: 0, ease: 'power2.in', duration: 1 }, i * .02));
  hero.to('.hero__bg', { scale: 1.35, opacity: 0, duration: 1.2 }, 0).to('.kicker,.hero__lead,.cue', { opacity: 0, y: -30, duration: .5 }, 0);

  /* Plantage: Parallax-Huegel + Text-Reveal */
  const pl = gsap.timeline({ scrollTrigger: { trigger: '#plantage', start: 'top top', end: () => '+=' + innerHeight * 1.4, scrub } });
  pl.fromTo('.h1', { y: 160 }, { y: -40 }, 0).fromTo('.h2', { y: 260 }, { y: -20 }, 0).fromTo('.h3', { y: 380 }, { y: 0 }, 0)
    .from('.plantage .txt > *', { y: 60, opacity: 0, stagger: .08, duration: .4 }, 0);

  /* Ernte: Fokus-Fade der Schritte + Bild-Parallax */
  $$('.step').forEach(s => ST.create({ trigger: s, start: 'top 60%', end: 'bottom 40%', toggleClass: 'on' }));
  gsap.fromTo('.split__media img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '#ernte', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* Reise: horizontale Fahrt */
  const track = $('.track');
  gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: '#reise', start: 'top top', end: () => '+=' + innerHeight * 3, scrub, invalidateOnRefresh: true } });
  const route = $('.route path'), rl = 1400; route.style.strokeDasharray = rl; route.style.strokeDashoffset = rl;

  /* Tasse: Vollbild faehrt aus Kreis-Maske auf, Typo kinetisch */
  const ta = gsap.timeline({ scrollTrigger: { trigger: '#tasse', start: 'top top', end: () => '+=' + innerHeight * 1.6, scrub } });
  ta.fromTo('.frame', { clipPath: 'circle(8% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', ease: 'power2.inOut', duration: 1 }, 0)
    .fromTo('.frame img', { scale: 1.6 }, { scale: 1, duration: 1 }, 0)
    .from('.mega span', { yPercent: 120, opacity: 0, stagger: .15, duration: .5 }, .35);
  gsap.fromTo('.drip', { scaleY: .2 }, { scaleY: 1.6, ease: 'none', scrollTrigger: { trigger: '.drip', start: 'top bottom', end: 'bottom 40%', scrub: true } });
  gsap.from('.card', { y: 80, opacity: 0, stagger: .1, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '.cards', start: 'top 80%' } });
  gsap.from('.foot__big', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* Kapitel-Hintergrundfarben */
  const bgs = [['#plantage', '#16241a'], ['#ernte', '#1a120d'], ['#reise', '#0e1820'], ['#roesten', '#1b0c06'], ['#mahlen', '#22150d'], ['#bruehen', '#120c09']];
  bgs.forEach(([s, c]) => gsap.to(document.body, { backgroundColor: c, ease: 'none', immediateRender: false, scrollTrigger: { trigger: s, start: 'top 80%', end: 'top top', scrub: true } }));

  /* Fortschritt + aktives Kapitel */
  gsap.to('.prog i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .3 } });
  $$('.chap a').forEach(a => { const s = $(a.getAttribute('href')); ST.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: e => a.classList.toggle('on', e.isActive) }); });

  /* DOM pro Frame aus P ableiten */
  const phases = $$('.phases li'), grindLis = $$('.grind li'), steam = $('.steam'), fill = $('.cup__fill');
  function dom() {
    counters($('#plantage'), seg(P.plantage, .05, .6));
    counters($('#reise'), P.reise); route.style.strokeDashoffset = rl * (1 - P.reise);
    counters($('#roesten'), seg(P.roesten, .05, .95));
    phases.forEach((l, i) => l.classList.toggle('on', P.roesten > .08 + i * .22));
    grindLis.forEach((l, i) => { const t = ease(seg(P.mahlen, .45 + i * .1, .7 + i * .1)); l.style.opacity = t; l.style.transform = `translateY(${(1 - t) * 40}px)`; });
    fill.setAttribute('y', 250 - 185 * io(seg(P.bruehen, .35, .9)));
    steam.style.opacity = seg(P.bruehen, .8, 1);
  }

  /* ---------- Three.js Buehne ---------- */
  const canvas = $('.stage');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOB, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, MOB ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(35, 1, .1, 100);
  scene.add(new THREE.HemisphereLight(0xffe6c8, 0x1a0e08, 1.1));
  const key = new THREE.DirectionalLight(0xffd2a0, 3); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xe8622c, 2.4); rim.position.set(-4, 1, -3); scene.add(rim);
  const fire = new THREE.PointLight(0xff5a1f, 0, 8); fire.position.set(0, -1.6, 1); scene.add(fire);

  // Bohnen-Geometrie: Kugel (Kirsche) mit Morph-Ziel Bohne inkl. Kerbe
  function beanGeo(seg = 64) {
    const g = new THREE.SphereGeometry(1, seg, seg / 2 * 1.5 | 0);
    const pos = g.attributes.position, tgt = new Float32Array(pos.array.length), v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      let x = v.x * .72, y = v.y * 1.0, z = v.z * .58;
      if (v.z > 0) { const g2 = Math.exp(-Math.pow(v.x / .11 - Math.sin(v.y * 2.2) * .9, 2)); z -= .32 * g2 * v.z; z += .06 * v.z; }
      tgt[i * 3] = x; tgt[i * 3 + 1] = y; tgt[i * 3 + 2] = z;
    }
    g.morphAttributes.position = [new THREE.Float32BufferAttribute(tgt, 3)];
    g.morphTargetsRelative = false; g.computeVertexNormals();
    // Morph-Normalen
    const tg = new THREE.BufferGeometry(); tg.setAttribute('position', g.morphAttributes.position[0]); tg.setIndex(g.index); tg.computeVertexNormals();
    g.morphAttributes.normal = [tg.attributes.normal];
    return g;
  }
  const C = { cherry: new THREE.Color('#b3201b'), green: new THREE.Color('#93a86a'), yellow: new THREE.Color('#c8a24c'), brown: new THREE.Color('#7a4526'), dark: new THREE.Color('#3a1f12') };
  const beanMat = new THREE.MeshPhysicalMaterial({ color: C.cherry, roughness: .35, clearcoat: .8, clearcoatRoughness: .25, sheen: .3 });
  const bean = new THREE.Mesh(beanGeo(MOB ? 48 : 96), beanMat); scene.add(bean);
  const stem = new THREE.Mesh(new THREE.TorusGeometry(.5, .05, 8, 24, 1.3), new THREE.MeshStandardMaterial({ color: '#4d6b34', roughness: .7 }));
  stem.position.set(-.48, .95, 0); stem.rotation.z = -.2; bean.add(stem);
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(.5, 24, 12), new THREE.MeshStandardMaterial({ color: '#3f6a2e', roughness: .6, side: THREE.DoubleSide }));
  leaf.scale.set(.9, .08, .38); leaf.position.set(.45, 1.15, 0); leaf.rotation.z = .5; bean.add(leaf);

  // Schwarm (Hero, Reise): instanzierte Bohnen
  const N = MOB ? 70 : 160;
  const swarmGeo = beanGeo(24); swarmGeo.setAttribute('position', swarmGeo.morphAttributes.position[0]); swarmGeo.morphAttributes = {}; swarmGeo.computeVertexNormals();
  const swarmMat = new THREE.MeshPhysicalMaterial({ color: C.cherry, roughness: .4, clearcoat: .6 });
  const swarm = new THREE.InstancedMesh(swarmGeo, swarmMat, N); scene.add(swarm);
  const sd = Array.from({ length: N }, (_, i) => ({ x: (Math.random() - .5) * 14, y: (Math.random() - .5) * 9, z: -Math.random() * 10 - 1, r: Math.random() * 6, s: .12 + Math.random() * .18, sp: .3 + Math.random(), lane: (Math.random() - .5) * 2.2 }));

  // Mahlgut: Partikel, die aus der Bohne brechen
  const G = MOB ? 400 : 1100;
  const grind = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.035, 0), new THREE.MeshStandardMaterial({ color: '#4a2a17', roughness: .9 }), G); scene.add(grind);
  const gd = Array.from({ length: G }, () => { const v = new THREE.Vector3().randomDirection(); return { d: v, m: .6 + Math.random() * 2.6, s: .5 + Math.random() * 1.4, k: Math.random(), r: new THREE.Euler(Math.random() * 6, Math.random() * 6, 0) }; });

  // Rauch: Punkte mit weicher Textur
  const sc = document.createElement('canvas'); sc.width = sc.height = 64; const sx = sc.getContext('2d');
  const gr = sx.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,240,220,.9)'); gr.addColorStop(1, 'rgba(255,240,220,0)'); sx.fillStyle = gr; sx.fillRect(0, 0, 64, 64);
  const S = MOB ? 120 : 260, sp = new Float32Array(S * 3), sseed = Array.from({ length: S }, () => [Math.random(), (Math.random() - .5) * 1.6, (Math.random() - .5) * 1.2]);
  const smokeGeo = new THREE.BufferGeometry(); smokeGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const smokeMat = new THREE.PointsMaterial({ size: 1.1, map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0, color: '#d8c4ad' });
  const smoke = new THREE.Points(smokeGeo, smokeMat); scene.add(smoke);
  // Glut-Funken
  const E = MOB ? 60 : 140, ep = new Float32Array(E * 3), eseed = Array.from({ length: E }, () => [Math.random(), (Math.random() - .5) * 3, (Math.random() - .5) * 2]);
  const embGeo = new THREE.BufferGeometry(); embGeo.setAttribute('position', new THREE.BufferAttribute(ep, 3));
  const emb = new THREE.Points(embGeo, new THREE.PointsMaterial({ size: .06, color: '#ff7a2a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(emb);

  // Tasse (Lathe), Fluessigkeit, Strahl
  const cupG = new THREE.Group(); scene.add(cupG);
  const prof = [[0, -1], [.62, -1], [.7, -.95], [.86, -.2], [.95, .55], [.99, .62], [.94, .62], [.85, .55], [.76, -.2], [.6, -.88], [0, -.88]].map(([x, y]) => new THREE.Vector2(x, y));
  const ceramic = new THREE.MeshPhysicalMaterial({ color: '#efe4d2', roughness: .3, clearcoat: 1, side: THREE.DoubleSide });
  cupG.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 72), ceramic));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(.34, .08, 16, 40, Math.PI * 1.25), ceramic); handle.position.set(1.0, .05, 0); handle.rotation.z = -Math.PI * .62; cupG.add(handle);
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.2, .08, 72), ceramic); saucer.position.y = -1.04; cupG.add(saucer);
  const liqMat = new THREE.MeshPhysicalMaterial({ color: '#2b160b', roughness: .15, clearcoat: 1 });
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(.9, .62, 1, 64), liqMat); cupG.add(liquid);
  const crema = new THREE.Mesh(new THREE.CircleGeometry(.9, 64), new THREE.MeshPhysicalMaterial({ color: '#8a5a33', roughness: .4, clearcoat: .6 })); crema.rotation.x = -Math.PI / 2; cupG.add(crema);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(.05, .07, 1, 16, 1, true), liqMat); scene.add(stream);
  const drops = Array.from({ length: 6 }, () => { const d = new THREE.Mesh(new THREE.SphereGeometry(.06, 12, 8), liqMat); scene.add(d); return d; });

  function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v3 = new THREE.Vector3(), sc3 = new THREE.Vector3(), tmpC = new THREE.Color();
  const side = MOB ? 0 : 1; // auf Mobil bleibt die Bohne mittig unter dem Text
  let t0 = performance.now();
  function frame(now) {
    const t = (now - t0) / 1000;
    dom();
    const { hero, plantage, ernte, reise, roesten, mahlen, bruehen, tasse } = P;
    // --- Bohne: Position je Kapitel (Kamerafahrt-Gefuehl durch x/y/z + Kamera) ---
    let x = 0, y = MOB ? -.2 : 0, z = 0, s = 1;
    x = lerp(0, 1.7 * side, io(seg(hero, .3, 1)));          // Hero -> rechts
    y += MOB ? lerp(0, -1.9, io(seg(hero, .3, 1))) : 0;
    x = lerp(x, -1.9 * side, io(seg(ernte, 0, .5)));          // Ernte -> ueber das Bild
    s = lerp(1, .85, seg(ernte, 0, .5));
    x = lerp(x, lerp(-2.4, 2.4, reise) * (MOB ? .5 : 1), seg(reise, 0, .05) * (reise > 0 ? 1 : 0)); // Reise: faehrt mit
    y = lerp(y, -.3 + Math.sin(reise * Math.PI * 6) * .25, seg(reise, 0, .05) * (reise > 0 && reise < 1 ? 1 : 0));
    const inRoast = seg(roesten, 0, .15);
    x = lerp(x, 0, inRoast); y = lerp(y, MOB ? .2 : -.15, inRoast); s = lerp(s, 1.25, inRoast);
    const inGrind = seg(mahlen, 0, .2);
    x = lerp(x, MOB ? 0 : 1.6, inGrind); y = lerp(y, MOB ? -1.2 : 0, inGrind); s = lerp(s, 1, inGrind);
    const burst = io(seg(mahlen, .25, .55));                    // Bohne zerspringt
    bean.position.set(x, y + Math.sin(t * 1.2) * .04, z);
    bean.scale.setScalar(s * (1 - burst) * (MOB ? .62 : 1));
    bean.visible = burst < .999 && bruehen < .01;
    bean.rotation.set(Math.sin(t * .5) * .15 + .2, t * .35 + hero * 3 + ernte * 2 + reise * 8 + roesten * 14, Math.sin(t * .4) * .1 + reise * .6);
    // Morph Kirsche -> Bohne, Fruchtfleisch faellt
    const morph = io(seg(ernte, .45, .95));
    bean.morphTargetInfluences[0] = morph;
    stem.visible = leaf.visible = morph < .5; stem.scale.setScalar(1 - morph * 2); leaf.scale.set(.9 * (1 - morph * 2), .08, .38 * (1 - morph * 2));
    // Farbe: rot -> gruen (Ernte) -> gelb -> braun -> dunkel (Roesten)
    const rp = roesten;
    tmpC.copy(C.cherry).lerp(C.green, seg(ernte, .55, 1));
    if (rp > 0) { if (rp < .35) tmpC.lerp(C.yellow, seg(rp, .1, .35)); else if (rp < .7) tmpC.copy(C.yellow).lerp(C.brown, seg(rp, .35, .7)); else tmpC.copy(C.brown).lerp(C.dark, seg(rp, .7, 1)); }
    beanMat.color.copy(tmpC); beanMat.roughness = lerp(.35, .22, seg(rp, .7, 1)); beanMat.clearcoat = lerp(.8, 1, rp);
    // Roesttrommel-Stimmung: Feuerlicht, Rauch, Funken
    const roastOn = rp > 0 && rp < 1 ? 1 : (rp >= 1 ? Math.max(0, 1 - mahlen * 8) : 0);
    fire.intensity = 14 * seg(rp, .05, .5) * roastOn; rim.color.set(rp > .3 ? '#ff6a2a' : '#e8622c');
    smokeMat.opacity = .38 * seg(rp, .4, .75) * roastOn;
    for (let i = 0; i < S; i++) { const [k, ox, oz] = sseed[i]; const life = (k + t * .18) % 1; sp[i * 3] = bean.position.x + ox * (.4 + life) + Math.sin(t + k * 9) * .2; sp[i * 3 + 1] = bean.position.y + .6 + life * 3.2; sp[i * 3 + 2] = oz; }
    smokeGeo.attributes.position.needsUpdate = true; smokeMat.size = MOB ? .9 : 1.3;
    emb.material.opacity = seg(rp, .2, .5) * roastOn;
    for (let i = 0; i < E; i++) { const [k, ox, oz] = eseed[i]; const life = (k + t * .45) % 1; ep[i * 3] = ox * (1 - life * .5); ep[i * 3 + 1] = -1.8 + life * 3.6; ep[i * 3 + 2] = oz; }
    embGeo.attributes.position.needsUpdate = true;
    // Schwarm: Hero = Bohnen-Regen, fliegt beim Scrollen an der Kamera vorbei; Reise = Strom im Hintergrund
    const showSwarm = hero < 1 || (reise > 0 && reise < 1);
    swarm.visible = showSwarm;
    if (showSwarm) {
      const inR = reise > 0 && hero >= 1;
      swarmMat.color.copy(inR ? C.green : C.cherry);
      for (let i = 0; i < N; i++) {
        const d = sd[i]; let px, py, pz;
        if (!inR) { px = d.x; py = ((d.y + t * d.sp * .25 + 4.5) % 9) - 4.5; pz = d.z + hero * 12; }
        else { px = ((d.x + reise * 26 * d.sp + 7) % 14 + 14) % 14 - 7; py = d.lane - 1.4; pz = d.z * .5 - 1.5; }
        e.set(d.r + t * d.sp, d.r * 2 + t * .4, 0); q.setFromEuler(e); v3.set(px, py, pz); sc3.setScalar(d.s * (inR ? .8 : 1));
        m4.compose(v3, q, sc3); swarm.setMatrixAt(i, m4);
      }
      swarm.instanceMatrix.needsUpdate = true;
    }
    // Mahlgut: explodiert aus der Bohne, sammelt sich und rieselt in die Tasse
    const gOn = mahlen > .2 && bruehen < .45;
    grind.visible = gOn;
    if (gOn) {
      const fall = io(seg(bruehen, 0, .4));
      const cx = MOB ? 0 : 1.6, cy = MOB ? -1.2 : 0;
      for (let i = 0; i < G; i++) {
        const d = gd[i]; const r = burst * d.m * (1 - seg(mahlen, .6, 1) * .55);
        let px = cx + d.d.x * r, py = cy + d.d.y * r - seg(mahlen, .6, 1) * d.k * .8, pz = d.d.z * r * .6;
        // Trichter Richtung Tasse
        const tx = (MOB ? 0 : 1.6) + d.d.x * .25, ty = (MOB ? 1.6 : 2.2) - d.k * .5;
        px = lerp(px, tx, fall); py = lerp(py, ty - fall * d.k * 1.2, fall); pz = lerp(pz, d.d.z * .2, fall);
        e.set(d.r.x + t, d.r.y, 0); q.setFromEuler(e); v3.set(px, py, pz); sc3.setScalar(d.s * (1 - seg(bruehen, .3, .45)));
        m4.compose(v3, q, sc3); grind.setMatrixAt(i, m4);
      }
      grind.instanceMatrix.needsUpdate = true;
    }
    // Bruehen: Tasse faehrt ein, Strahl giesst, Pegel steigt; Tasse: Kamera taucht in die Oberflaeche
    const cupIn = io(seg(bruehen, 0, .35));
    cupG.visible = bruehen > 0;
    const cupX = MOB ? 0 : 1.6, cupY = MOB ? -1.9 : -.55;
    cupG.scale.setScalar(MOB ? .7 : 1); cupG.position.set(cupX, lerp(-4.5, cupY, cupIn), 0); cupG.rotation.set(lerp(.6, .28, cupIn), lerp(-1.2, -.4, cupIn) + tasse * .6, 0);
    const lvl = io(seg(bruehen, .3, .92));
    liquid.scale.set(lerp(.7, 1, lvl), Math.max(.001, lvl * 1.35), lerp(.7, 1, lvl)); liquid.position.y = -.88 + lvl * 1.35 / 2;
    crema.position.y = -.88 + lvl * 1.35 + .002; crema.scale.setScalar(lerp(.7, .98, lvl)); crema.visible = lvl > .02;
    const pour = seg(bruehen, .3, .45) * (1 - seg(bruehen, .85, .95));
    stream.visible = pour > 0.01 && tasse < .05;
    const topY = 3.2, botY = cupG.position.y - .88 + lvl * 1.35;
    stream.scale.set(pour, topY - botY, pour); stream.position.set(cupX, (topY + botY) / 2, 0);
    drops.forEach((d, i) => { const ph = (t * 1.4 + i / drops.length) % 1; d.visible = stream.visible; d.position.set(cupX + Math.sin(i * 3) * .05, lerp(topY, botY, ph), .02); });
    // Kamera: leichte Fahrt pro Kapitel, im Finale Sturzflug in die Tasse
    const dive = io(seg(tasse, 0, .55));
    cam.position.set(lerp(Math.sin(t * .2) * .15, cupX, dive), lerp(.2 + roesten * .1 - mahlen * .2, cupG.position.y + 4.2, dive), lerp(MOB ? 9.5 : 7.5, .4, dive) - Math.sin(Math.PI * (P.plantage)) * .8);
    cam.lookAt(lerp(0, cupX, dive), lerp(0, cupG.position.y, dive), 0);
    canvas.style.opacity = 1 - seg(tasse, .45, .7);
    renderer.render(scene, cam);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  addEventListener('load', () => ST.refresh());
}
