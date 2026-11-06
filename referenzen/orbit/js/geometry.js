import * as THREE from "../../../assets/vendor/three/build/three.module.js";

export function roundedBoxGeometry(w, h, d, r, bevel) {
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
    depth: d,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.65,
    bevelSegments: 3,
    curveSegments: 8,
    steps: 1,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

export function makeScreenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const g = canvas.getContext("2d");
  g.fillStyle = "#101218";
  g.fillRect(0, 0, 512, 320);
  g.fillStyle = "#242a34";
  for (let i = 0; i < 6; i++) g.fillRect(40, 36 + i * 40, 432, 8);
  g.fillStyle = "#3a4250";
  g.fillRect(40, 36, 120, 8);
  g.fillStyle = "#ff7a00";
  g.beginPath();
  g.arc(438, 268, 16, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#cfd5de";
  g.lineWidth = 6;
  g.strokeRect(22, 16, 468, 288);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function makeShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const g = canvas.getContext("2d");
  const grd = g.createRadialGradient(128, 128, 16, 128, 128, 122);
  grd.addColorStop(0, "rgba(0,0,0,0.38)");
  grd.addColorStop(0.55, "rgba(0,0,0,0.16)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function displaceBlob(radius = 0.72) {
  const geo = new THREE.SphereGeometry(radius, 64, 48);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const n =
      Math.sin(v.x * 3.2 + v.y * 1.7) * Math.cos(v.z * 2.6) * 0.16 +
      Math.sin(v.y * 5.1 + 1.2) * 0.07 +
      Math.cos(v.x * 6.4 + v.z * 3.3) * 0.05;
    v.multiplyScalar(radius * (1 + n));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function screenMesh(materials, w, h) {
  const group = new THREE.Group();
  const glass = new THREE.Mesh(roundedBoxGeometry(w, h, 0.025, 0.04, 0.008), materials.glass);
  const display = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, h * 0.86), materials.screen);
  display.position.z = 0.02;
  group.add(glass, display);
  return group;
}

export function makeDevice(materials) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(roundedBoxGeometry(1.22, 1.92, 0.42, 0.34, 0.045), materials.plastic);
  body.castShadow = true;
  const shell = new THREE.Mesh(roundedBoxGeometry(1.34, 2.04, 0.16, 0.38, 0.03), materials.chrome);
  shell.position.z = -0.16;
  const face = new THREE.Mesh(roundedBoxGeometry(1.02, 1.62, 0.06, 0.28, 0.016), materials.face);
  face.position.z = 0.2;
  const window = screenMesh(materials, 0.86, 0.5);
  window.position.set(0, 0.08, 0.24);
  const dial = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.028, 16, 40), materials.orange);
  dial.position.set(0.22, 0.48, 0.28);
  const dialCap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 24), materials.plastic);
  dialCap.rotation.x = Math.PI / 2;
  dialCap.position.set(0.22, 0.48, 0.3);
  const button = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 16), materials.orange);
  button.scale.z = 0.55;
  button.position.set(0.34, -0.62, 0.3);
  const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.28, 8, 16), materials.plastic);
  ear.position.set(0.18, 1.12, 0.02);
  ear.rotation.z = 0.55;
  const port = new THREE.Mesh(roundedBoxGeometry(0.08, 0.16, 0.05, 0.02, 0.006), materials.face);
  port.position.set(-0.64, -0.15, 0.02);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12), materials.chrome);
  pin.rotation.z = Math.PI / 2;
  pin.position.set(0.66, 0.35, 0);
  group.add(shell, body, face, window, dial, dialCap, button, ear, port, pin);
  return group;
}

export function makeDarkRig(materials) {
  const group = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.07, 24, 90), materials.chrome);
  ring.rotation.set(1.15, 0.4, 0.15);
  ring.castShadow = true;
  const points = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const radius = 0.06 + Math.sin(t * Math.PI) * 0.22 + t * 0.16;
    points.push(new THREE.Vector2(radius, (t - 0.5) * 1.35));
  }
  const horn = new THREE.Mesh(new THREE.LatheGeometry(points, 40), materials.metal);
  horn.rotation.set(0.4, 0.6, 0.2);
  horn.position.set(-0.85, 0.05, 0.15);
  horn.castShadow = true;
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.32, 40, 28), materials.glass);
  lens.scale.set(1, 1, 0.38);
  lens.position.set(0.95, 0.22, 0.55);
  const plate = new THREE.Mesh(roundedBoxGeometry(1.55, 0.12, 0.95, 0.05, 0.02), materials.metalDark);
  plate.position.set(0.05, -0.62, 0.05);
  plate.receiveShadow = true;
  const accent = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.46, 6, 12), materials.orange);
  accent.rotation.z = 0.7;
  accent.position.set(-0.85, 0.22, 0.28);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.55, 28), materials.chrome);
  barrel.rotation.z = Math.PI / 2.4;
  barrel.position.set(0.15, 0.35, -0.15);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(3.4, 64), materials.mirror);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.92;
  ground.receiveShadow = true;
  group.add(ground, plate, horn, ring, barrel, lens, accent);
  return group;
}

export function makeFragments(materials) {
  const specs = [
    { mesh: new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.07, 16, 40), materials.chrome), z: 0.4, y: 0.45, speed: 1.15, spin: 1.4 },
    { mesh: new THREE.Mesh(roundedBoxGeometry(0.7, 0.42, 0.08, 0.06, 0.02), materials.glass), z: 1.15, y: -0.15, speed: 1.55, spin: 0.6 },
    { mesh: new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), materials.orange), z: -0.35, y: 0.7, speed: 0.82, spin: 2.1 },
    { mesh: new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.55, 6, 12), materials.metal), z: 0.85, y: -0.55, speed: 1.35, spin: 1.1 },
    { mesh: new THREE.Mesh(roundedBoxGeometry(0.46, 0.62, 0.12, 0.08, 0.02), materials.metalDark), z: -0.9, y: 0.05, speed: 0.7, spin: 0.8 },
  ];
  specs.forEach((item, i) => {
    item.mesh.castShadow = false;
    item.phase = i / specs.length;
  });
  return specs;
}

export function makeWorkObjects(materials) {
  const device = makeDevice(materials);
  device.scale.setScalar(0.42);
  const clamshell = new THREE.Group();
  const lid = new THREE.Mesh(roundedBoxGeometry(0.9, 0.62, 0.08, 0.08, 0.02), materials.plastic);
  lid.position.y = 0.34;
  lid.rotation.x = -0.7;
  const base = new THREE.Mesh(roundedBoxGeometry(0.9, 0.62, 0.1, 0.08, 0.02), materials.metalDark);
  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.84, 12), materials.chrome);
  hinge.rotation.z = Math.PI / 2;
  clamshell.add(base, lid, hinge);

  const monolith = new THREE.Group();
  const slab = new THREE.Mesh(roundedBoxGeometry(0.62, 1.15, 0.12, 0.08, 0.025), materials.metal);
  const glow = screenMesh(materials, 0.4, 0.62);
  glow.position.z = 0.08;
  monolith.add(slab, glow);

  const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.16, 40), materials.orange);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 36, 24), materials.glass);
  const brass = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.7, 24), materials.brass);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.08, 18, 40), materials.chrome);
  const token = new THREE.Mesh(roundedBoxGeometry(0.7, 0.48, 0.1, 0.12, 0.02), materials.face);
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), materials.orange);
  bead.position.set(0.16, 0.08, 0.08);
  const tokenGroup = new THREE.Group();
  tokenGroup.add(token, bead);

  const objects = [
    { mesh: device, name: "funke", grid: [-1.35, 0.55, 0.2], rot: [0.2, -0.4, -0.3] },
    { mesh: clamshell, name: "nordlicht", grid: [0.05, 0.85, -0.45], rot: [0.1, 0.4, 0.15] },
    { mesh: monolith, name: "salon", grid: [1.4, 0.35, 0.35], rot: [0, 0.3, 0.08] },
    { mesh: puck, name: "", grid: [-1.15, -0.45, -0.2], rot: [0.4, 0.2, 0.5] },
    { mesh: orb, name: "", grid: [-0.15, -0.2, 0.7], rot: [0, 0.5, 0] },
    { mesh: brass, name: "", grid: [1.15, -0.55, -0.35], rot: [0.3, 0, 0.4] },
    { mesh: ring, name: "", grid: [0.55, -1.05, 0.15], rot: [1.1, 0.2, 0.4] },
    { mesh: tokenGroup, name: "", grid: [-0.7, -1.15, -0.55], rot: [0.2, -0.6, 0.2] },
  ];
  objects.forEach((item) => {
    item.mesh.traverse((child) => {
      if (child.isMesh) child.castShadow = false;
    });
  });
  return objects;
}

export function makeHand(materials) {
  const group = new THREE.Group();
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.28, 24), materials.metalDark);
  cuff.position.y = -0.28;
  const palm = new THREE.Mesh(roundedBoxGeometry(0.34, 0.28, 0.16, 0.08, 0.02), materials.chrome);
  const inlay = new THREE.Mesh(roundedBoxGeometry(0.1, 0.1, 0.02, 0.02, 0.004), materials.orange);
  inlay.position.set(0, 0.02, 0.09);
  const fingerGeo = new THREE.CapsuleGeometry(0.045, 0.34, 6, 12);
  const fingerA = new THREE.Mesh(fingerGeo, materials.chrome);
  fingerA.position.set(-0.08, 0.38, 0);
  fingerA.rotation.z = 0.18;
  const fingerB = new THREE.Mesh(fingerGeo, materials.chrome);
  fingerB.position.set(0.1, 0.36, 0);
  fingerB.rotation.z = -0.42;
  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.2, 4, 10), materials.metal);
  thumb.position.set(0.22, 0.05, 0.02);
  thumb.rotation.z = -1.15;
  group.add(cuff, palm, inlay, fingerA, fingerB, thumb);
  return group;
}
