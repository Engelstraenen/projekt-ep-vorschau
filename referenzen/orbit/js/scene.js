import * as THREE from '../../../assets/vendor/three/build/three.module.min.js';

/**
 * Eigenes ORBIT-Feldgerät. Kein importiertes Modell, keine Textur aus der Referenz.
 * Die Kamerafahrt sitzt in den Keyframes: Ruhepose rechts, Orbit, Vorbeizug, Dolly ins Dunkel.
 */

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

function makeScreen() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const g = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  function draw(mode) {
    g.clearRect(0, 0, 512, 320);
    g.fillStyle = '#16130f';
    g.fillRect(0, 0, 512, 320);
    g.fillStyle = '#2a241c';
    roundRect(g, 28, 26, 456, 188, 18);
    g.fill();
    g.strokeStyle = mode > 1 ? '#ffb15a' : '#6d6458';
    g.lineWidth = 3;
    g.beginPath();
    const bars = mode === 0 ? 7 : 11;
    for (let i = 0; i < bars; i += 1) {
      const x = 70 + i * 36;
      const h = 28 + ((i * 47 + mode * 30) % 90);
      g.moveTo(x, 150);
      g.lineTo(x, 150 - h);
    }
    g.stroke();
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.arc(430, 250, 16, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = mode === 2 ? '#ffe08a' : '#8d8376';
    g.font = '600 28px sans-serif';
    g.fillText(mode === 2 ? 'ORBIT' : 'FELD', 48, 268);
    tex.needsUpdate = true;
  }

  draw(0);
  return { tex, draw };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 64, 8, 128, 64, 120);
  grd.addColorStop(0, 'rgba(0,0,0,0.38)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const REST = { t: 0, px: -0.15, py: 0.42, pz: 5.55, lx: -0.05, ly: 0.15, lz: 0, ry: -0.88, rx: 0.4, rz: 0.32, ox: 1.18, oy: -0.42, oz: 0, fov: 30 };
const KEYS_DESK = [
  REST,
  { t: 0.22, px: 0.85, py: 0.55, pz: 4.35, lx: 0.55, ly: 0.12, lz: 0, ry: -0.15, rx: 0.28, rz: 0.08, ox: 0.72, oy: 0.08, oz: 0, fov: 30 },
  { t: 0.42, px: -0.15, py: 0.62, pz: 3.55, lx: 0.05, ly: 0.1, lz: 0, ry: 0.55, rx: 0.16, rz: -0.04, ox: 0.12, oy: 0.06, oz: 0, fov: 28 },
  { t: 0.58, px: -1.15, py: 0.28, pz: 2.85, lx: -0.15, ly: 0.04, lz: 0, ry: 1.25, rx: 0.08, rz: 0.02, ox: -0.05, oy: 0.02, oz: 0, fov: 26 },
  { t: 0.74, px: 0.02, py: 0.12, pz: 1.85, lx: 0, ly: 0.02, lz: 0.05, ry: 0.18, rx: 0.04, rz: 0, ox: 0, oy: 0, oz: 0, fov: 22 },
  { t: 0.9, px: 0, py: 0.02, pz: 0.78, lx: 0, ly: 0, lz: 0.12, ry: 0.02, rx: 0, rz: 0, ox: 0, oy: 0, oz: 0.04, fov: 18 },
  { t: 1, px: 0, py: 0, pz: 0.42, lx: 0, ly: 0, lz: 0.2, ry: 0, rx: 0, rz: 0, ox: 0, oy: 0, oz: 0.08, fov: 16 },
];
const KEYS_MOBILE = [
  { t: 0, px: 0, py: 0.15, pz: 6.8, lx: 0, ly: 0.05, lz: 0, ry: -0.8, rx: 0.32, rz: 0.22, ox: 0.05, oy: -0.78, oz: 0, fov: 34 },
  { t: 0.34, px: 0.15, py: 0.05, pz: 5.6, lx: 0, ly: -0.7, lz: 0, ry: 0.15, rx: 0.22, rz: 0.08, ox: 0.05, oy: -0.65, oz: 0, fov: 28 },
  { t: 0.68, px: 0, py: 0.04, pz: 2.1, lx: 0, ly: 0, lz: 0.02, ry: 0.08, rx: 0.04, rz: 0, ox: 0, oy: 0, oz: 0, fov: 22 },
  { t: 1, px: 0, py: 0, pz: 0.48, lx: 0, ly: 0, lz: 0.14, ry: 0, rx: 0, rz: 0, ox: 0, oy: 0, oz: 0.05, fov: 16 },
];

function sample(keys, t, out) {
  let i = 0;
  const last = keys.length - 1;
  while (i < last - 1 && t >= keys[i + 1].t) i += 1;
  const a = keys[i];
  const b = keys[Math.min(i + 1, last)];
  const span = (b.t - a.t) || 1;
  let u = (t - a.t) / span;
  if (u < 0) u = 0;
  if (u > 1) u = 1;
  u = u * u * (3 - 2 * u);
  out.px = a.px + (b.px - a.px) * u;
  out.py = a.py + (b.py - a.py) * u;
  out.pz = a.pz + (b.pz - a.pz) * u;
  out.lx = a.lx + (b.lx - a.lx) * u;
  out.ly = a.ly + (b.ly - a.ly) * u;
  out.lz = a.lz + (b.lz - a.lz) * u;
  out.ry = a.ry + (b.ry - a.ry) * u;
  out.rx = a.rx + (b.rx - a.rx) * u;
  out.rz = a.rz + (b.rz - a.rz) * u;
  out.ox = a.ox + (b.ox - a.ox) * u;
  out.oy = a.oy + (b.oy - a.oy) * u;
  out.oz = a.oz + (b.oz - a.oz) * u;
  out.fov = a.fov + (b.fov - a.fov) * u;
  return out;
}

export function mountScene(canvas, { mobile = false, reduced = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !mobile,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    });
  } catch (err) {
    return null;
  }
  if (!renderer.getContext()) {
    renderer.dispose();
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.08, 40);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  const room = new THREE.Mesh(
    new THREE.SphereGeometry(8, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0x2a2a2a, side: THREE.BackSide }),
  );
  env.add(room);
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.2), new THREE.MeshBasicMaterial({ color: 0xfff6d0 }));
  panel.position.set(1.5, 2.2, 3);
  env.add(panel);
  const warm = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ color: 0xff7a18 }));
  warm.position.set(-2.4, -0.2, 2);
  env.add(warm);
  scene.environment = pmrem.fromScene(env, 0.04).texture;
  pmrem.dispose();

  scene.add(new THREE.AmbientLight(0xfff4cc, 0.45));
  const key = new THREE.DirectionalLight(0xfffaf0, 2.4);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe08a, 1.35);
  rim.position.set(-5, 2.5, -2);
  scene.add(rim);
  const kick = new THREE.PointLight(0xff6a00, 6, 8);
  kick.position.set(1.4, 0.2, 2.2);
  scene.add(kick);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x0c0c0c,
    metalness: 0.22,
    roughness: 0.34,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 0.32,
  });
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0xf4f4f6,
    metalness: 1,
    roughness: 0.12,
    clearcoat: 0.5,
    envMapIntensity: 1.45,
  });
  const orange = new THREE.MeshPhysicalMaterial({
    color: 0xff7a00,
    metalness: 0.12,
    roughness: 0.32,
    clearcoat: 0.85,
    emissive: 0xff5a00,
    emissiveIntensity: 0.18,
  });

  const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(1.28, 1.92, 0.46), {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: 10,
  });
  bodyGeo.translate(0, 0, -0.22);
  const rig = new THREE.Group();
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  rig.add(body);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.026, 10, 72), metal);
  ring.scale.set(0.74, 1.08, 0.7);
  ring.position.z = 0.16;
  rig.add(ring);

  const screen = makeScreen();
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.86, 0.52),
    new THREE.MeshPhysicalMaterial({
      map: screen.tex,
      color: 0xffffff,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
  );
  glass.position.set(0, 0.18, 0.2);
  rig.add(glass);

  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.02), metal);
  slot.position.set(0, -0.28, 0.2);
  rig.add(slot);

  [[0.34, -0.52], [-0.05, -0.62], [0.28, -0.78]].forEach(([x, y], index) => {
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(index === 1 ? 0.09 : 0.07, index === 1 ? 0.09 : 0.07, 0.05, 20), orange);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(x, y, 0.2);
    rig.add(btn);
  });

  const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.28, 4, 12), bodyMat);
  ear.position.set(0.42, 0.98, -0.02);
  ear.rotation.z = -0.5;
  rig.add(ear);
  const earRing = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.018, 8, 24), metal);
  earRing.position.copy(ear.position);
  earRing.rotation.z = ear.rotation.z;
  rig.add(earRing);

  rig.scale.setScalar(0.78);
  scene.add(rig);

  const blob = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 32, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x0c0c0c,
      metalness: 0.35,
      roughness: 0.42,
      clearcoat: 0.6,
    }),
  );
  blob.scale.set(1.35, 0.82, 0.7);
  scene.add(blob);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 1.6),
    new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.22;
  scene.add(shadow);

  const keys = mobile ? KEYS_MOBILE : KEYS_DESK;
  const pose = { ...REST };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let progress = 0;
  let screenMode = 0;
  let looping = false;
  let raf = 0;
  let alive = true;

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  function render(now) {
    if (!alive) return;
    const time = (now || performance.now()) * 0.001;
    sample(keys, progress, pose);
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    const idle = progress < 0.03 && !reduced ? Math.sin(time * 0.55) * 0.07 : 0;
    rig.position.set(pose.ox, pose.oy, pose.oz);
    rig.rotation.set(pose.rx, pose.ry + idle + pointer.x * 0.12, pose.rz + pointer.y * -0.05);
    camera.position.set(pose.px + pointer.x * 0.28, pose.py + pointer.y * -0.16, pose.pz);
    camera.lookAt(pose.lx, pose.ly, pose.lz);
    if (camera.fov !== pose.fov) {
      camera.fov = pose.fov;
      camera.updateProjectionMatrix();
    }
    const passU = progress < 0.08 ? 0 : progress > 0.62 ? 1 : (progress - 0.08) / 0.54;
    blob.position.set(5.2 - passU * 9.4, 0.05 + Math.sin(passU * Math.PI) * 0.2, 1.05);
    blob.scale.set(1.15, 0.68, 0.55);
    blob.visible = progress > 0.08 && progress < 0.64;
    shadow.position.x = pose.ox;
    shadow.position.z = 0.2;
    shadow.material.opacity = 1 - Math.min(1, progress * 1.15);
    const mode = progress > 0.62 ? 2 : progress > 0.28 ? 1 : 0;
    if (mode !== screenMode) {
      screenMode = mode;
      screen.draw(mode);
    }
    renderer.render(scene, camera);
  }

  function loop(now) {
    if (!looping || !alive) return;
    render(now);
    raf = requestAnimationFrame(loop);
  }

  function setLoop(on) {
    if (reduced) return;
    if (on && !looping) {
      looping = true;
      raf = requestAnimationFrame(loop);
    } else if (!on && looping) {
      looping = false;
      cancelAnimationFrame(raf);
    }
  }

  resize();
  render(0);
  if (!reduced) setLoop(true);

  return {
    setProgress(value) {
      progress = value < 0 ? 0 : value > 1 ? 1 : value;
      if (!looping) render();
    },
    setPointer(x, y) {
      if (reduced) return;
      pointer.tx = x;
      pointer.ty = y;
    },
    resize,
    render,
    setActive(on) {
      if (on) setLoop(true);
      else {
        setLoop(false);
        render();
      }
    },
    dispose() {
      alive = false;
      looping = false;
      cancelAnimationFrame(raf);
      screen.tex.dispose();
      shadow.material.map.dispose();
      scene.environment.dispose();
      renderer.dispose();
    },
  };
}
