import * as THREE from '../../../assets/vendor/three/build/three.module.min.js';
import {
  cassetteTexture,
  makeBeacon,
  makeCrt,
  makeFieldDevice,
  makeGesture,
  makeHandset,
  makePointer,
  makeMaterials,
  makePlate,
  makeRadio,
  makeRoller,
  makeScanner,
  makeShard,
  makeSpeaker,
  makeSpool,
  phosphorTexture,
  roundedBox,
  shadowMesh,
  shadowTexture,
} from './geometry.js';

function studioEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new THREE.Scene();
  room.add(new THREE.Mesh(
    new THREE.SphereGeometry(14, 32, 16),
    new THREE.MeshBasicMaterial({ color: 0x050608, side: THREE.BackSide }),
  ));
  const panel = (w, h, color, x, y, z) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color }));
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    room.add(mesh);
  };
  panel(7, 2.4, 0xffffff, 0.4, 2.2, 5.2);
  panel(2.2, 6, 0xdbe7ff, -4.2, 0.2, 4.4);
  panel(2.4, 2.4, 0xffd7a1, 3.6, -0.4, 4.8);
  panel(5, 1.4, 0xffffff, 0, -3.2, 4);
  const target = pmrem.fromScene(room, 0.04);
  pmrem.dispose();
  room.traverse((obj) => {
    if (obj.isMesh) {
      obj.geometry.dispose();
      obj.material.dispose();
    }
  });
  return target.texture;
}

function makeRenderer(canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    });
    if (!renderer.getContext()) {
      renderer.dispose();
      return null;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x000000, 0);
    return renderer;
  } catch (err) {
    return null;
  }
}

function addLights(scene, dark) {
  scene.add(new THREE.AmbientLight(0xfff6ea, dark ? 0.16 : 0.45));
  scene.add(new THREE.HemisphereLight(0xfff4e5, 0x10141c, dark ? 0.28 : 0.4));
  const key = new THREE.DirectionalLight(0xfffaf2, dark ? 4.4 : 2.6);
  key.position.set(3.4, 4.6, 5.5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd5e4ff, dark ? 2.2 : 1.1);
  rim.position.set(-4.5, 2.2, -3);
  scene.add(rim);
  return { key, rim };
}

function holder(mesh, shadowMap, shadowW, shadowH, drop) {
  const group = new THREE.Group();
  group.add(mesh);
  if (shadowMap) {
    const shadow = shadowMesh(shadowMap, shadowW, shadowH);
    shadow.position.set(0, drop, -0.05);
    group.add(shadow);
  }
  group.userData.mesh = mesh;
  return group;
}

export function mountScene(backCanvas, frontCanvas, { mobile = false } = {}) {
  const frontRenderer = makeRenderer(frontCanvas);
  const backRenderer = makeRenderer(backCanvas);
  if (!frontRenderer || !backRenderer) {
    frontRenderer?.dispose();
    backRenderer?.dispose();
    return null;
  }

  const frontScene = new THREE.Scene();
  const backScene = new THREE.Scene();
  frontScene.environment = studioEnvironment(frontRenderer);
  backScene.environment = studioEnvironment(backRenderer);
  frontScene.environmentIntensity = 1.15;
  backScene.environmentIntensity = 2.1;

  const frontCam = new THREE.PerspectiveCamera(26, 1, 0.08, 40);
  const backCam = new THREE.PerspectiveCamera(32, 1, 0.08, 50);
  const frontLights = addLights(frontScene, false);
  const backLights = addLights(backScene, true);

  const glInfo = frontRenderer.getContext();
  const gpuInfo = glInfo.getExtension('WEBGL_debug_renderer_info');
  const gpuName = gpuInfo ? String(glInfo.getParameter(gpuInfo.UNMASKED_RENDERER_WEBGL)) : '';
  const software = /swiftshader|llvmpipe|softpipe|software/i.test(gpuName);
  const frontMats = makeMaterials('studio');
  const darkMats = makeMaterials('dark');
  const cassette = cassetteTexture();
  const warmScreen = phosphorTexture('#ffb15a');
  const coolScreen = phosphorTexture('#9fd6ff');
  const greenScreen = phosphorTexture('#d6ef3a');
  const shade = shadowTexture();

  const hero = makeFieldDevice(frontMats, cassette);
  hero.scale.setScalar(mobile ? 0.7 : 0.78);
  const heroShadow = shadowMesh(shade, 2.6, 1.25);
  frontScene.add(hero, heroShadow);

  const fragMats = makeMaterials('studio');
  const backFrags = [
    makeShard(fragMats, 'chrome', 1.15, 0.72),
    makeBeacon(fragMats),
  ];
  backFrags[1].scale.setScalar(0.55);
  const backFragGroup = new THREE.Group();
  backFrags.forEach((mesh) => backFragGroup.add(mesh));
  backScene.add(backFragGroup);

  const frontFragMats = makeMaterials('studio');
  const frontFrags = [
    makeShard(frontFragMats, 'magenta', 0.9, 0.55),
    (() => {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 28), frontFragMats.lime);
      disc.rotation.x = Math.PI / 2;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 24), frontFragMats.chrome);
      const g = new THREE.Group();
      g.add(disc, ring);
      return g;
    })(),
  ];
  const frontFragGroup = new THREE.Group();
  frontFrags.forEach((mesh) => frontFragGroup.add(mesh));
  frontScene.add(frontFragGroup);

  const workDefs = [
    { build: () => makeFieldDevice(frontMats, cassette), scale: 0.42, shadow: [0.9, 0.42, -0.55] },
    { build: () => makeRadio(frontMats, warmScreen), scale: 0.7, shadow: [1, 0.46, -0.5] },
    { build: () => makeCrt(frontMats, coolScreen), scale: 0.58, shadow: [1.15, 0.42, -0.48] },
    { build: () => makeScanner(frontMats, greenScreen), scale: 0.58, shadow: [0.7, 0.4, -0.7] },
    { build: () => makeBeacon(frontMats), scale: 0.62, shadow: [0.7, 0.36, -0.7] },
    { build: () => makeSpool(frontMats), scale: 0.72, shadow: [0.9, 0.36, -0.45] },
    { build: () => makeHandset(frontMats), scale: 0.7, shadow: [1, 0.36, -0.4] },
    { build: () => makePointer(frontMats), scale: 0.62, shadow: [0.4, 0.7, -0.9] },
  ];
  const works = workDefs.map((def) => {
    const mesh = def.build();
    mesh.scale.setScalar(def.scale);
    return holder(mesh, shade, def.shadow[0], def.shadow[1], def.shadow[2]);
  });
  const worksGroup = new THREE.Group();
  works.forEach((item) => worksGroup.add(item));
  frontScene.add(worksGroup);

  const gesture = makeGesture(frontMats);
  gesture.scale.setScalar(mobile ? 0.92 : 1.02);
  const gestureShadow = shadowMesh(shade, 1.4, 0.6);
  frontScene.add(gesture, gestureShadow);

  const darkGroup = new THREE.Group();
  const speakerA = makeSpeaker(darkMats, 2.15);
  speakerA.position.set(-1.15, 0.05, 0.35);
  const speakerB = makeSpeaker(darkMats, 1.85);
  speakerB.position.set(1.25, 0.12, 0.15);
  speakerB.rotation.y = -0.35;
  const ochre = new THREE.Mesh(
    roundedBox(1.4, 0.9, 0.7, 0.08, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x8a5a32, metalness: 0.82, roughness: 0.28, envMapIntensity: 1.4 }),
  );
  ochre.position.set(0.15, -0.35, -0.8);
  ochre.rotation.set(0.4, 0.5, 0.1);
  const roller = makeRoller(darkMats);
  roller.position.set(-1.35, -0.15, -0.35);
  roller.rotation.z = 0.35;
  roller.rotation.y = 0.4;
  const plate = makePlate(darkMats);
  plate.position.set(-1.25, 0.85, -0.9);
  plate.rotation.set(0.4, 0.5, 0.2);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.07, 16, 48), darkMats.chrome);
  ring.position.set(0.85, 0.7, -0.45);
  ring.rotation.x = 0.8;
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 12, 32), darkMats.chrome);
  ringB.position.set(1.15, -0.15, 0.85);
  ringB.rotation.y = 0.6;
  const bulbs = [[-0.9, 0.35, 0.4], [1.4, 0.55, -0.2], [0.2, -0.55, 0.55]].map(([x, y, z]) => {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), darkMats.bulb);
    bulb.position.set(x, y, z);
    return bulb;
  });
  darkGroup.add(speakerA, speakerB, ochre, roller, plate, ring, ringB, ...bulbs);
  backScene.add(darkGroup);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let beat = 'hero';
  let progress = 0;
  let intro = 1;
  let width = 1;
  let height = 1;
  let looping = false;
  let raf = 0;
  let alive = true;

  function resize() {
    width = backCanvas.clientWidth || window.innerWidth;
    height = backCanvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, software ? 1 : (width < 900 ? 1.15 : 1.35));
    [frontRenderer, backRenderer].forEach((renderer) => {
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
    });
    [frontCam, backCam].forEach((camera) => {
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    });
  }

  function placeWorks(t, narrow) {
      const span = narrow ? 0.42 : 0.72;
    const grid = [
      [-1.7, 0.9, 1.1], [-0.4, 1.15, -1.2], [1.1, 0.8, 0.4], [2.0, 0.35, -0.6],
      [-1.5, -0.7, -0.9], [-0.2, -0.95, 0.9], [1.2, -0.45, -0.3], [2.1, -0.15, 0.7],
    ];
    works.forEach((item, index) => {
      const home = grid[index];
      const stripX = (index - 3.5) * span;
      const u = t < 0.62 ? t / 0.62 : 1;
      const settle = t < 0.62 ? 0 : (t - 0.62) / 0.38;
      const ease = settle * settle * (3 - 2 * settle);
      const drift = Math.sin(t * Math.PI) * (index - 2.5) * 0.22;
      item.position.set(
        home[0] + (stripX - home[0]) * ease + drift,
        home[1] + ((narrow ? 0.05 : 0.72) - home[1]) * ease,
        home[2] * (1 - ease),
      );
      const mesh = item.userData.mesh;
      mesh.rotation.y = home[2] + t * (0.7 + index * 0.08);
      mesh.rotation.x = (1 - ease) * (index % 2 === 0 ? 0.35 : -0.25);
      mesh.rotation.z = (1 - ease) * (index - 2.5) * 0.08;
      const s = (1 - ease * 0.28) * (narrow ? 0.62 : 1);
      mesh.scale.setScalar(workDefs[index].scale * s);
    });
  }

  function frame(now) {
    if (!alive) return;
    const time = (now || performance.now()) * 0.001;
    const narrow = width < 900;
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
      const showHero = beat === 'hero' || (beat === 'wipe' && progress < 0.45);
    const showDark = beat === 'wipe' || beat === 'dark';
    const showManifest = beat === 'manifest';
    const showWorks = beat === 'works' || beat === 'contact';
    const showGesture = beat === 'contact';

    hero.visible = showHero;
    heroShadow.visible = showHero;
    frontFragGroup.visible = showManifest;
    worksGroup.visible = showWorks;
    gesture.visible = showGesture && progress > 0.28;
    gestureShadow.visible = gesture.visible;
    darkGroup.visible = showDark;
    backFragGroup.visible = showManifest;

    document.body.classList.toggle('is-studio', showManifest);
    frontRenderer.toneMappingExposure = 1.08;
    backRenderer.toneMappingExposure = showDark ? 1.5 : 1.08;
    if (showDark) backRenderer.setClearColor(0x30363f, 1);
    else if (showManifest) backRenderer.setClearColor(0xffd000, 1);
    else backRenderer.setClearColor(0x000000, 0);

    if (showHero) {
      const orbit = beat === 'hero' ? progress : 1;
      const wipe = beat === 'wipe' ? progress : 0;
      hero.position.set(
        (narrow ? 0 : 1.22) + (1 - intro) * 2.4 + pointer.x * 0.18,
        (narrow ? -1.15 : 0.08) + Math.sin(time * 1.15) * 0.055 + pointer.y * -0.08,
        0,
      );
      hero.rotation.set(
        0.28 + orbit * 0.16 + pointer.y * -0.14,
        -0.72 + orbit * 0.85 + Math.sin(time * 0.8) * 0.05 + pointer.x * 0.32,
        (narrow ? -0.18 : -0.38) + orbit * 0.12,
      );
      hero.position.z = -wipe * 0.4;
      heroShadow.position.set(hero.position.x, hero.position.y - 1.25, -0.4);
      heroShadow.material.opacity = 0.95 - wipe * 0.8;
      frontCam.position.set(pointer.x * 0.18, narrow ? 0.2 : 0.12, narrow ? 8.1 : 7.35);
      frontCam.lookAt(narrow ? 0 : 0.25, narrow ? -0.95 : 0, 0);
      frontCam.fov = narrow ? 32 : 26;
      frontCam.updateProjectionMatrix();
    }

    if (showDark) {
      const dive = beat === 'dark' ? progress : beat === 'wipe' ? progress * 0.35 : 0;
      backCam.fov = 33;
      backCam.position.set(0.05 + dive * 0.25 + pointer.x * 0.1, 0.02, 4.35 - dive * 0.7);
      backCam.lookAt(0.05, 0, -0.4);
      backCam.updateProjectionMatrix();
      darkGroup.rotation.y = dive * 0.45 + time * 0.05;
      speakerA.rotation.z = Math.sin(time * 0.6) * 0.04;
      ring.rotation.z = time * 0.25 + dive;
      roller.rotation.x = dive * 1.4;
      backLights.key.position.set(3.2 + dive * 2.4, 4.2, 5 - dive * 2);
    }

    if (showManifest) {
      frontCam.position.set(0, 0, 6.4);
      frontCam.fov = 30;
      frontCam.lookAt(0, 0, 0);
      frontCam.updateProjectionMatrix();
      backCam.position.set(0, 0, 7.2);
      backCam.fov = 30;
      backCam.lookAt(0, 0, 0);
      backCam.updateProjectionMatrix();
      backFrags.forEach((mesh, index) => {
        const dir = index === 0 ? -1 : 1;
        const speed = 0.72 + index * 0.08;
        mesh.position.set(dir * (2.15 - progress * 4.3 * speed), index === 0 ? 0.35 : -0.55, -0.6 - index * 0.45);
        mesh.rotation.set(progress * 1.4, progress * 2.1 + index, 0.2);
      });
      frontFrags[0].scale.setScalar(0.62);
      frontFrags[0].position.set(2.5 - progress * 5.2, 0.95, 0.45);
      frontFrags[0].rotation.set(0.4, progress * 2.4, 0.3);
      frontFrags[1].position.set(-2.3 + progress * 4.8, -1.05, 0.55);
      frontFrags[1].rotation.set(0.2, progress * -2.2, progress);
    }

    if (showWorks) {
      const lift = beat === 'contact' ? progress : 0;
      const local = beat === 'works' ? progress : 1;
      placeWorks(local, narrow);
      worksGroup.position.set(0, (narrow ? 0.25 : 0.05) + lift * 5.2, 0);
      frontCam.position.set(0, narrow ? 0.05 : 0.2, narrow ? 8.4 : 7.1);
      frontCam.fov = narrow ? 34 : 30;
      frontCam.lookAt(0, 0.05, 0);
      frontCam.updateProjectionMatrix();
      if (lift > 0.34 || (narrow && lift > 0.02)) worksGroup.visible = false;
    }

    if (showGesture) {
      const rise = Math.min(1, progress / 0.45);
      gesture.position.set(narrow ? 0.05 : 0.85, -0.15 + rise * 0.15 + Math.sin(time * 0.9) * 0.03, 0.35);
      gesture.rotation.set(0.15 + Math.sin(time * 0.7) * 0.03, 0.02 + pointer.x * 0.1, 0);
      frontCam.position.set(0, 0.05, narrow ? 7.4 : 6.5);
      frontCam.fov = narrow ? 34 : 28;
      frontCam.lookAt(0.15, -0.05, 0);
      frontCam.updateProjectionMatrix();
      gestureShadow.position.set(gesture.position.x, gesture.position.y - 0.85, 0);
      gestureShadow.material.opacity = 0.35;
    }

    const needFront = showHero || showManifest || showWorks || showGesture;
    const needBack = showDark || showManifest;
    frontCanvas.style.visibility = needFront ? 'visible' : 'hidden';
    backCanvas.style.visibility = needBack ? 'visible' : 'hidden';
    if (needFront) frontRenderer.render(frontScene, frontCam);
    if (needBack) backRenderer.render(backScene, backCam);
  }

  function loop(now) {
    if (!looping || !alive) return;
    frame(now);
    raf = requestAnimationFrame(loop);
  }

  resize();
  frame(0);
  looping = true;
  raf = requestAnimationFrame(loop);

  return {
    setIntro(value) {
      intro = value < 0 ? 0 : value > 1 ? 1 : value;
    },
    setBeat(name, value) {
      beat = name || 'hero';
      progress = value < 0 ? 0 : value > 1 ? 1 : value;
      if (!looping) frame();
    },
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
    },
    resize,
    render: frame,
    setActive(on) {
      if (on && !looping) {
        looping = true;
        raf = requestAnimationFrame(loop);
      } else if (!on && looping) {
        looping = false;
        cancelAnimationFrame(raf);
      }
    },
    dispose() {
      alive = false;
      looping = false;
      cancelAnimationFrame(raf);
      [frontScene, backScene].forEach((scene) => {
        scene.environment?.dispose();
        scene.traverse((obj) => {
          if (!obj.isMesh) return;
          obj.geometry?.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((mat) => {
            mat.map?.dispose();
            mat.dispose();
          });
        });
      });
      frontRenderer.dispose();
      backRenderer.dispose();
    },
  };
}
