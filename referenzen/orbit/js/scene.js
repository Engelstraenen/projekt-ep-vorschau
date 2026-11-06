import * as THREE from "../../../assets/vendor/three/build/three.module.js";
import {
  displaceBlob,
  makeDarkRig,
  makeDevice,
  makeFragments,
  makeHand,
  makeScreenTexture,
  makeShadowTexture,
  makeWorkObjects,
} from "./geometry.js";

function studioTexture(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x07080c);
  const add = (color, x, y, z, w, h, rx = 0, ry = 0) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
    );
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, 0);
    room.add(mesh);
  };
  room.background = new THREE.Color(0x6a7078);
  add(0xffffff, 0, 4.2, 0, 10, 6, Math.PI / 2, 0);
  add(0xfffaf2, -2.6, 1.8, 3.2, 4.2, 3.6, 0, 0.45);
  add(0xd5e4ff, 3.4, 1.2, 2.4, 2.8, 3.2, 0, -0.55);
  add(0xffc48a, 0.4, 2.2, -3.4, 5.5, 2.2);
  add(0x8d93a0, 0, -2.5, 0, 12, 8, -Math.PI / 2, 0);
  const target = pmrem.fromScene(room, 0.03, 0.1, 24);
  pmrem.dispose();
  return target.texture;
}

function makeMaterials(screenTex) {
  const physical = (opts) => new THREE.MeshPhysicalMaterial({
    envMapIntensity: 1.15,
    ...opts,
  });
  return {
    hero: {
      plastic: physical({ color: 0x141414, roughness: 0.28, metalness: 0.04, clearcoat: 0.9, clearcoatRoughness: 0.16 }),
      chrome: physical({ color: 0xd5dae1, roughness: 0.12, metalness: 1, clearcoat: 0.35, clearcoatRoughness: 0.08, envMapIntensity: 1.45 }),
      orange: physical({ color: 0xff7a00, roughness: 0.26, metalness: 0.12, clearcoat: 0.85, clearcoatRoughness: 0.12 }),
      face: physical({ color: 0x0c0d10, roughness: 0.4, metalness: 0.2, clearcoat: 0.4 }),
      glass: physical({ color: 0x1a1e26, roughness: 0.06, metalness: 0.08, clearcoat: 1, clearcoatRoughness: 0.04, transparent: true, opacity: 0.55 }),
      screen: physical({ map: screenTex, roughness: 0.4, metalness: 0.05, emissive: 0x1a1e28, emissiveIntensity: 0.35 }),
      blob: physical({ color: 0x090909, roughness: 0.62, metalness: 0.02, clearcoat: 0.15 }),
    },
    world: {
      plastic: physical({ color: 0x161616, roughness: 0.3, metalness: 0.06, clearcoat: 0.75, clearcoatRoughness: 0.18 }),
      chrome: physical({ color: 0xd5dae1, roughness: 0.11, metalness: 1, envMapIntensity: 1.5 }),
      orange: physical({ color: 0xff7a00, roughness: 0.28, metalness: 0.14, clearcoat: 0.8 }),
      face: physical({ color: 0x101114, roughness: 0.42, metalness: 0.18 }),
      glass: physical({ color: 0x202632, roughness: 0.05, metalness: 0.05, clearcoat: 1, transparent: true, opacity: 0.5 }),
      screen: physical({ map: screenTex, roughness: 0.45, metalness: 0.04, emissive: 0x222838, emissiveIntensity: 0.4 }),
      metal: physical({ color: 0x8d939c, roughness: 0.22, metalness: 1, envMapIntensity: 1.3 }),
      metalDark: physical({ color: 0x2a2e34, roughness: 0.28, metalness: 0.9 }),
      brass: physical({ color: 0xb08d57, roughness: 0.24, metalness: 1, envMapIntensity: 1.25 }),
    },
    dark: {
      chrome: physical({ color: 0xf3f5f8, roughness: 0.06, metalness: 1, clearcoat: 0.55, clearcoatRoughness: 0.04, envMapIntensity: 1.8 }),
      metal: physical({ color: 0x9aa1ab, roughness: 0.18, metalness: 1, envMapIntensity: 1.4 }),
      metalDark: physical({ color: 0x23272d, roughness: 0.24, metalness: 0.92 }),
      glass: physical({ color: 0xc5d4e8, roughness: 0.04, metalness: 0.02, clearcoat: 1, clearcoatRoughness: 0.02, transparent: true, opacity: 0.45 }),
      orange: physical({ color: 0xff7a00, roughness: 0.24, metalness: 0.2, clearcoat: 0.9 }),
      mirror: physical({ color: 0x12141a, roughness: 0.14, metalness: 1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.65 }),
    },
  };
}

function smoothstep(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function span(p, a, b) {
  return smoothstep((p - a) / (b - a));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function makeRenderer(canvas, shadows) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = shadows;
  if (shadows) renderer.shadowMap.type = THREE.PCFShadowMap;
  return renderer;
}

export function createScene(heroCanvas, worldCanvas, piecesCanvas) {
  const heroRenderer = makeRenderer(heroCanvas, false);
  const worldRenderer = makeRenderer(worldCanvas, true);
  const piecesRenderer = makeRenderer(piecesCanvas, false);

  const env = studioTexture(heroRenderer);
  const screenTex = makeScreenTexture();
  const mats = makeMaterials(screenTex);

  const heroScene = new THREE.Scene();
  const worldScene = new THREE.Scene();
  const piecesScene = new THREE.Scene();
  for (const target of [heroScene, worldScene, piecesScene]) {
    target.environment = env;
    target.environmentIntensity = 1.12;
  }

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  const worldCamera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  const piecesCamera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);

  const key = new THREE.DirectionalLight(0xfff6ea, 3.4);
  key.position.set(4.2, 6.4, 5.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 18;
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.bias = -0.0004;
  const fill = new THREE.DirectionalLight(0xd5e2ff, 1.15);
  fill.position.set(-5.2, 2.2, 3.4);
  const rim = new THREE.DirectionalLight(0xffc27a, 2.2);
  rim.position.set(-1.5, 3.2, -4.5);
  const hemi = new THREE.HemisphereLight(0xfff4d4, 0x1a1c22, 0.38);
  const face = new THREE.DirectionalLight(0xffffff, 1.6);
  face.position.set(0.2, 0.6, 7);
  const lights = () => [key.clone(), fill.clone(), rim.clone(), hemi.clone(), face.clone()];
  heroScene.add(...lights());
  worldScene.add(key, fill, rim, hemi, face);
  piecesScene.add(...lights());

  const hero = new THREE.Group();
  const device = makeDevice(mats.hero);
  const blob = new THREE.Mesh(displaceBlob(0.78), mats.hero.blob);
  blob.position.set(2.8, 0.05, -0.6);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.15),
    new THREE.MeshBasicMaterial({ map: makeShadowTexture(), transparent: true, depthWrite: false })
  );
  hero.add(blob, shadow, device);
  heroScene.add(hero);

  const dark = makeDarkRig(mats.dark);
  dark.scale.setScalar(0.62);
  dark.visible = false;
  worldScene.add(dark);

  const fragments = makeFragments(mats.world);
  fragments.forEach((item) => {
    item.mesh.visible = false;
    piecesScene.add(item.mesh);
  });

  const works = makeWorkObjects(mats.world);
  works.forEach((item) => {
    item.mesh.visible = false;
    piecesScene.add(item.mesh);
  });

  const hand = makeHand(mats.world);
  hand.visible = false;
  hand.scale.setScalar(0.92);
  piecesScene.add(hand);
  const shard = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.075, 16, 48), mats.world.chrome);
  shard.visible = false;
  piecesScene.add(shard);

  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  const started = performance.now();
  let narrow = false;
  let progress = 0;
  let velocity = 0;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    narrow = w < 860;
    const dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5);
    for (const renderer of [heroRenderer, worldRenderer, piecesRenderer]) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
    }
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  function frameCamera(heroMix, darkMix, worksMix) {
    const heroPos = narrow ? new THREE.Vector3(0, 0.35, 7.5) : new THREE.Vector3(0, 0.08, 6.55);
    const darkPos = new THREE.Vector3(0.1, 0.42, narrow ? 5.8 : 5.05);
    const workPos = new THREE.Vector3(0, 0.05, narrow ? 7.8 : 7.15);
    const pos = heroPos.clone().lerp(darkPos, darkMix).lerp(workPos, worksMix);
    if (heroMix > 0.2 && darkMix < 0.5) pos.copy(heroPos).lerp(darkPos, darkMix);
    camera.position.copy(pos);
    const look = new THREE.Vector3(narrow ? 0 : 0.15, narrow ? -0.15 : 0, 0);
    if (darkMix > 0.35 && worksMix < 0.5) look.set(0, 0, 0);
    camera.lookAt(look);
    camera.fov = lerp(narrow ? 34 : 30, 33, worksMix);
    camera.updateProjectionMatrix();
    for (const extra of [worldCamera, piecesCamera]) {
      extra.position.copy(camera.position);
      extra.quaternion.copy(camera.quaternion);
      extra.fov = camera.fov;
      extra.aspect = camera.aspect;
      extra.updateProjectionMatrix();
    }
  }

  function update(p, v) {
    progress = p;
    velocity = v;
    const time = (performance.now() - started) / 1000;
    const heroMix = 1 - span(p, 0.16, 0.3);
    const wipe = span(p, 0.17, 0.31);
    const darkIn = span(p, 0.24, 0.34);
    const darkOut = span(p, 0.4, 0.5);
    const darkMix = darkIn * (1 - darkOut);
    const reveal = span(p, 0.42, 0.54);
    const fly = span(p, 0.5, 0.68);
    const grid = span(p, 0.64, 0.86);
    const contact = span(p, 0.82, 0.96);

    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (narrow ? 7.4 : 6.55) * camera.aspect;

    pointer.lerp(pointerTarget, 0.08);
    const orbit = span(p, 0.0, 0.16);
    device.rotation.set(
      0.42 + Math.sin(orbit * Math.PI) * 0.08 + pointer.y * -0.1 + Math.sin(time * 0.7) * 0.02,
      -0.48 + orbit * 0.62 + pointer.x * 0.16,
      -0.62
    );
    const restX = narrow ? 0.05 : Math.min(1.72, halfW * 0.48);
    const restY = narrow ? -1.05 : -0.02;
    device.position.set(
      restX + pointer.x * 0.1,
      restY + Math.sin(time * 0.9) * 0.04 + orbit * 0.08,
      0
    );
    device.scale.setScalar(narrow ? 0.78 : 1);
    device.visible = wipe < 0.98;
    shadow.position.set(device.position.x, narrow ? -1.72 : -1.28, -0.05);
    shadow.scale.set(narrow ? 0.8 : 1, 1, 1);
    shadow.visible = device.visible;
    const blobIn = span(p, 0.06, 0.17);
    blob.position.set(
      lerp(restX + 1.8, restX - 0.15, blobIn) + Math.sin(time * 0.45) * 0.05,
      restY + 0.15 - blobIn * 0.05,
      -0.85
    );
    blob.rotation.y = time * 0.15;
    blob.scale.setScalar(lerp(0.3, narrow ? 0.7 : 0.95, blobIn));
    blob.visible = blobIn > 0.02 && wipe < 0.98;

    dark.visible = darkMix > 0.04;
    dark.rotation.y = time * 0.08 + span(p, 0.26, 0.44) * 0.45;
    dark.position.y = Math.sin(time * 0.6) * 0.03;

    const showFly = fly > 0.02 && fly < 0.98 && grid < 0.35;
    fragments.forEach((item, i) => {
      const local = span(p, 0.5 + i * 0.012, 0.66 + i * 0.01);
      item.mesh.visible = showFly && local > 0 && local < 1;
      const dir = i % 2 === 0 ? 1 : -1;
      const travel = lerp(-dir * (halfW + 1.4), dir * (halfW + 1.4), local);
      item.mesh.position.set(travel * item.speed, item.y + Math.sin(local * Math.PI + i) * 0.25, item.z);
      item.mesh.rotation.set(local * item.spin, time * 0.4 + i, local * 0.6);
      const chroma = Math.min(0.22, velocity * 0.18);
      item.mesh.scale.setScalar(1 + chroma * 0.04);
    });

    const showGrid = grid > 0.02 && reveal > 0.65;
    works.forEach((item, i) => {
      item.mesh.visible = showGrid;
      const delay = span(p, 0.64 + i * 0.012, 0.84);
      const gx = item.grid[0] * (narrow ? 0.48 : 1);
      const gy = item.grid[1] * (narrow ? 0.72 : 1);
      const gz = item.grid[2];
      const stripX = lerp(-halfW * 0.72, halfW * 0.72, i / (works.length - 1));
      const stripY = narrow ? 1.25 : 1.15;
      item.mesh.position.set(
        lerp(gx, stripX, delay),
        lerp(gy, stripY, delay) + Math.sin(time * 0.8 + i) * 0.03 * (1 - delay),
        lerp(gz, 0.05 + (i % 3) * 0.08, delay)
      );
      item.mesh.rotation.set(
        lerp(item.rot[0], 0.18, delay) + Math.sin(time * 0.5 + i) * 0.05 * (1 - delay),
        lerp(item.rot[1], -0.25, delay) + time * 0.05,
        lerp(item.rot[2], 0.04, delay)
      );
      const s = narrow ? 0.62 : 0.78;
      if (item.baseScale === undefined) item.baseScale = item.mesh.scale.x;
      item.mesh.scale.setScalar(item.baseScale * s);
    });

    const showHand = contact > 0.62;
    hand.visible = showHand;
    hand.position.set(narrow ? 1.15 : 0.55, narrow ? 0.15 : -0.15, 1.45);
    hand.rotation.set(0.15, -0.4 + Math.sin(time * 0.7) * 0.08, 0.15 + contact * 0.2);
    hand.position.y += Math.sin(time * 1.1) * 0.04;

    const showShard = fly > 0.15 && fly < 0.92 && contact < 0.2;
    shard.visible = showShard;
    const shardT = span(p, 0.52, 0.7);
    shard.position.set(lerp(halfW + 0.4, -halfW - 0.4, shardT), 0.15, 1.6);
    shard.rotation.set(0.4, shardT * 2.2, 0.6);

    const worksMix = Math.max(reveal * 0.85, grid);
    frameCamera(heroMix, darkMix, Math.min(1, worksMix));
  }

  function project(mesh) {
    const vector = new THREE.Vector3();
    mesh.getWorldPosition(vector);
    vector.project(camera);
    return {
      x: (vector.x * 0.5 + 0.5) * window.innerWidth,
      y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
      z: vector.z,
    };
  }

  function render() {
    worldRenderer.render(worldScene, worldCamera);
    heroRenderer.render(heroScene, camera);
    piecesRenderer.render(piecesScene, piecesCamera);
  }

  function setPointer(x, y) {
    pointerTarget.set(x, y);
  }

  resize();
  update(0, 0);
  render();

  return {
    update,
    render,
    resize,
    setPointer,
    project,
    works,
    get progress() {
      return progress;
    },
    get velocity() {
      return velocity;
    },
  };
}
