import * as THREE from '../../../assets/vendor/three/build/three.module.min.js';

export function makeMaterials(tone = 'studio') {
  const dark = tone === 'dark';
  const fast = tone === 'fast' || tone === 'fast-dark';
  const env = dark ? 1.7 : 1;
  const chromeRough = dark ? 0.12 : 0.22;
  if (fast) {
    const P = THREE.MeshPhongMaterial;
    const dim = tone === 'fast-dark';
    return {
      plastic: new P({ color: 0x161616, shininess: 28, specular: 0x444444 }),
      face: new P({ color: 0x0c0c0c, shininess: 12, specular: 0x222222 }),
      chrome: new P({ color: dim ? 0xb7c0cc : 0x9aa3b0, shininess: 100, specular: 0xffffff }),
      steel: new P({ color: 0x9aa3ae, shininess: 60, specular: 0xcccccc }),
      orange: new P({ color: 0xff7a00, shininess: 24, specular: 0xffc48a, emissive: 0x5a2200 }),
      lime: new P({ color: 0xd6ef3a, shininess: 18, specular: 0xffffff }),
      magenta: new P({ color: 0xff3aa0, shininess: 18, specular: 0xffd0ea }),
      cone: new P({ color: 0x5c656f, shininess: 50, specular: 0xdde3ea }),
      glass: new P({ color: 0xd5deea, shininess: 70, specular: 0xffffff, transparent: true, opacity: 0.85 }),
      well: new P({ color: 0x16130f, shininess: 8 }),
      bulb: new THREE.MeshStandardMaterial({ color: 0xffb15a, emissive: 0xff6a00, emissiveIntensity: 1.6 }),
    };
  }
  const M = THREE.MeshStandardMaterial;
  return {
    plastic: new M({
      color: 0x141414,
      metalness: 0.22,
      roughness: 0.38,
      envMapIntensity: env * 0.8,
    }),
    face: new M({
      color: 0x0a0a0a,
      metalness: 0.16,
      roughness: 0.46,
      envMapIntensity: env * 0.45,
    }),
    chrome: new M({
      color: dark ? 0xf4f6fa : 0xdfe4ee,
      metalness: 1,
      roughness: chromeRough,
      envMapIntensity: env,
    }),
    steel: new M({
      color: 0x8d949e,
      metalness: 1,
      roughness: dark ? 0.22 : 0.32,
      envMapIntensity: env * 0.8,
    }),
    orange: new M({
      color: 0xff7a00,
      metalness: 0.25,
      roughness: 0.34,
      emissive: 0xff4d00,
      emissiveIntensity: 0.12,
      envMapIntensity: env * 0.45,
    }),
    lime: new M({
      color: 0xd6ef3a,
      metalness: 0.1,
      roughness: 0.36,
      envMapIntensity: 0.55,
    }),
    magenta: new M({
      color: 0xff3aa0,
      metalness: 0.14,
      roughness: 0.32,
      envMapIntensity: 0.6,
    }),
    cone: new M({
      color: 0x4a515b,
      metalness: 0.62,
      roughness: 0.3,
      envMapIntensity: env,
    }),
    glass: new M({
      color: 0xd5deea,
      metalness: 0.12,
      roughness: 0.12,
      transparent: true,
      opacity: 0.82,
      envMapIntensity: 1.1,
    }),
    well: new THREE.MeshStandardMaterial({
      color: 0x16130f,
      roughness: 0.55,
      metalness: 0.15,
    }),
    bulb: new THREE.MeshStandardMaterial({
      color: 0xffb15a,
      emissive: 0xff6a00,
      emissiveIntensity: 2.4,
      roughness: 0.4,
    }),
  };
}

export function roundedBox(w, h, d, r, bevel = 0.04, dense = false) {
  const radius = Math.min(r, w / 2 - 0.001, h / 2 - 0.001);
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + w - radius, y);
  shape.absarc(x + w - radius, y + radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(x + w, y + h - radius);
  shape.absarc(x + w - radius, y + h - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(x + radius, y + h);
  shape.absarc(x + radius, y + h - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + radius);
  shape.absarc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.02, d - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.72,
    bevelSegments: dense ? 4 : 2,
    curveSegments: dense ? 18 : 10,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function paint(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function cassetteTexture() {
  return paint(512, 320, (g, w, h) => {
    g.fillStyle = '#1a140e';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#3a2c1c';
    g.fillRect(36, 28, w - 72, h - 56);
    g.strokeStyle = '#c8bba8';
    g.lineWidth = 8;
    g.strokeRect(48, 40, w - 96, h - 80);
    g.fillStyle = '#0e0c0a';
    g.beginPath();
    g.arc(175, 160, 48, 0, Math.PI * 2);
    g.arc(337, 160, 48, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#ffb15a';
    g.lineWidth = 6;
    g.beginPath();
    g.arc(175, 160, 28, 0, Math.PI * 2);
    g.arc(337, 160, 28, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = '#d7c4a4';
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(175, 112);
    g.quadraticCurveTo(256, 78, 337, 112);
    g.moveTo(175, 208);
    g.quadraticCurveTo(256, 236, 337, 208);
    g.stroke();
  });
}

export function phosphorTexture(tint) {
  return paint(256, 256, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.55);
    grd.addColorStop(0, tint);
    grd.addColorStop(1, '#07080c');
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    g.globalAlpha = 0.28;
    g.fillStyle = '#000';
    for (let y = 12; y < h; y += 8) g.fillRect(0, y, w, 3);
  });
}

export function shadowTexture() {
  return paint(256, 256, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, 8, w / 2, h / 2, w * 0.48);
    grd.addColorStop(0, 'rgba(0,0,0,0.42)');
    grd.addColorStop(0.45, 'rgba(0,0,0,0.16)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
  });
}

function screenPlane(texture, w, h) {
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.28,
    metalness: 0.06,
    envMapIntensity: 0.35,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
}

function knob(mats, radius, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 14), mats.orange);
  mesh.scale.z = 0.55;
  mesh.position.set(x, y, z);
  return mesh;
}

export function makeFieldDevice(mats, texture) {
  const group = new THREE.Group();
  const lip = new THREE.Mesh(roundedBox(1.72, 2.22, 0.22, 0.62, 0.035), mats.chrome);
  lip.position.z = -0.12;
  const body = new THREE.Mesh(roundedBox(1.56, 2.04, 0.5, 0.56, 0.055), mats.plastic);
  const inset = new THREE.Mesh(roundedBox(1.28, 1.7, 0.08, 0.42, 0.02), mats.face);
  inset.position.z = 0.22;
  const well = new THREE.Mesh(roundedBox(0.98, 0.66, 0.08, 0.08, 0.012), mats.well);
  well.position.set(0, 0.22, 0.27);
  const display = screenPlane(texture, 0.86, 0.54);
  display.position.set(0, 0.22, 0.32);
  const slot = new THREE.Mesh(roundedBox(0.62, 0.07, 0.04, 0.02, 0.008), mats.steel);
  slot.position.set(0, -0.22, 0.3);
  const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.28, 6, 12), mats.plastic);
  ear.position.set(0.46, 1.16, 0.02);
  ear.rotation.z = -0.62;
  const earRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.022, 10, 28), mats.chrome);
  earRing.position.copy(ear.position);
  earRing.rotation.z = ear.rotation.z;
  const side = knob(mats, 0.09, 0.78, 0.15, 0.08);
  group.add(
    lip, body, inset, well, display, slot, ear, earRing, side,
    knob(mats, 0.11, 0.28, -0.62, 0.32),
    knob(mats, 0.07, -0.22, -0.58, 0.32),
    knob(mats, 0.055, 0.08, -0.78, 0.3),
  );
  const port = new THREE.Mesh(roundedBox(0.06, 0.16, 0.05, 0.02, 0.008), mats.steel);
  port.position.set(-0.8, -0.2, 0);
  group.add(port);
  group.traverse((child) => {
    if (child.isMesh) child.castShadow = false;
  });
  return group;
}

export function makeRadio(mats, texture) {
  const group = new THREE.Group();
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.42, 40), mats.plastic);
  drum.rotation.x = Math.PI / 2;
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.045, 12, 40), mats.chrome);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2), mats.glass);
  dome.position.z = 0.08;
  const dial = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 10, 24), mats.orange);
  dial.position.set(0.28, -0.18, 0.24);
  const lens = screenPlane(texture, 0.46, 0.46);
  lens.position.set(-0.08, 0.08, 0.23);
  group.add(drum, band, dome, dial, lens);
  return group;
}

export function makeCrt(mats, texture) {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(roundedBox(1.7, 1.15, 0.7, 0.18, 0.04), mats.plastic);
  const bezel = new THREE.Mesh(roundedBox(1.35, 0.92, 0.08, 0.08, 0.015), mats.chrome);
  bezel.position.z = 0.36;
  const display = screenPlane(texture, 1.12, 0.72);
  display.position.z = 0.42;
  const footL = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.2, 4, 8), mats.orange);
  footL.rotation.z = Math.PI / 2;
  footL.position.set(-0.48, -0.62, 0);
  const footR = footL.clone();
  footR.position.x = 0.48;
  group.add(shell, bezel, display, footL, footR);
  return group;
}

export function makeBeacon(mats) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 1.35, 28), mats.plastic);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.16, 28), mats.orange);
  band.position.y = 0.15;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mats.chrome);
  dome.position.y = 0.68;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.03, 8, 24), mats.chrome);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.62;
  group.add(body, band, dome, ring);
  return group;
}

export function makeScanner(mats, texture) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(roundedBox(0.78, 1.7, 0.28, 0.22, 0.03), mats.plastic);
  const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 10, 28), mats.chrome);
  lensRing.position.set(0, 0.28, 0.16);
  const lens = screenPlane(texture, 0.32, 0.32);
  lens.position.set(0, 0.28, 0.18);
  const antenna = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.42, 4, 8), mats.steel);
  antenna.position.set(0.22, 0.95, 0);
  antenna.rotation.z = -0.3;
  group.add(body, lensRing, lens, antenna, knob(mats, 0.07, 0, -0.48, 0.16));
  return group;
}

export function makeSpool(mats) {
  const group = new THREE.Group();
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.55, 16), mats.chrome);
  axle.rotation.x = Math.PI / 2;
  const discA = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.06, 32), mats.plastic);
  discA.rotation.x = Math.PI / 2;
  discA.position.z = 0.2;
  const discB = discA.clone();
  discB.position.z = -0.2;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.025, 8, 32), mats.orange);
  rim.position.z = 0.24;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 16), mats.orange);
  hub.rotation.x = Math.PI / 2;
  hub.position.z = 0.26;
  group.add(axle, discA, discB, rim, hub);
  return group;
}

export function makeSpeaker(mats, scale = 1) {
  const group = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0.05, 0.05),
    new THREE.Vector2(0.18, 0.0),
    new THREE.Vector2(0.42, -0.12),
    new THREE.Vector2(0.7, -0.26),
    new THREE.Vector2(0.82, -0.32),
    new THREE.Vector2(0.22, -0.36),
  ], 40), mats.cone);
  cone.rotation.x = -Math.PI / 2;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), mats.chrome);
  cap.scale.z = 0.45;
  cap.position.z = 0.22;
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.11, 16, 48), mats.chrome);
  for (let i = 0; i < 3; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28 + i * 0.18, 0.012, 8, 40), mats.steel);
    ring.position.z = 0.02;
    group.add(ring);
  }
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.42, 28), mats.steel);
  can.rotation.x = Math.PI / 2;
  can.position.z = -0.34;
  group.add(cone, cap, lip, can);
  group.scale.setScalar(scale);
  return group;
}

export function makeRoller(mats) {
  const group = new THREE.Group();
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.8, 28), mats.chrome);
  drum.rotation.z = Math.PI / 2;
  const flangeA = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 24), mats.steel);
  flangeA.rotation.z = Math.PI / 2;
  flangeA.position.x = 0.86;
  const flangeB = flangeA.clone();
  flangeB.position.x = -0.86;
  group.add(drum, flangeA, flangeB);
  return group;
}

export function makePlate(mats) {
  const mesh = new THREE.Mesh(roundedBox(1.1, 0.7, 0.16, 0.08, 0.03), mats.chrome);
  return mesh;
}

export function makeShard(mats, materialKey, w, h) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2);
  shape.lineTo(w / 2, -h * 0.2);
  shape.lineTo(w * 0.25, h / 2);
  shape.lineTo(-w * 0.35, h * 0.25);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 2,
    curveSegments: 6,
  });
  geo.center();
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, mats[materialKey]);
}

export function makeGesture(mats) {
  const hand = new THREE.Group();
  const palm = new THREE.Mesh(roundedBox(0.86, 0.92, 0.16, 0.24, 0.03), mats.plastic);
  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.16, 16), mats.steel);
  wrist.position.y = -0.52;
  hand.add(palm, wrist);

  function digit(len, x, y, spread, curl) {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0.1);
    pivot.rotation.z = spread;
    pivot.rotation.x = curl;
    const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.078, 16, 12), mats.orange);
    const bone = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, Math.max(0.05, len), 5, 10), mats.plastic);
    bone.position.y = len * 0.55 + 0.04;
    const nail = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 10), mats.chrome);
    nail.position.set(0, len + 0.1, 0.02);
    pivot.add(knuckle, bone, nail);
    return pivot;
  }

  hand.add(
    digit(0.38, -0.08, 0.28, 0.48, 0),
    digit(0.42, 0.18, 0.28, -0.4, 0),
    digit(0.16, 0.32, 0.16, -0.05, 1.2),
    digit(0.12, 0.4, 0.04, -0.08, 1.35),
    digit(0.26, -0.42, -0.04, 1.05, 0.35),
  );
  hand.rotation.set(0.15, 0.02, 0);
  return hand;
}

export function shadowMesh(texture, w, h) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  mesh.renderOrder = 1;
  return mesh;
}
