

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* =========================================================
   Config
   ========================================================= */
// 3D clay tree generated with Higgsfield (image → 3D)
const TREE_URL = 'baum.glb';

const PLINTH = 7;          // world size of the tiled plinth
const TILE_H = 0.34;       // tile thickness
const QUIET = 2;           // quiet-zone tiles around the QR
const TREE_H = 7.2;        // target tree height
const ISO_POLAR = THREE.MathUtils.degToRad(57);
const ISO_YAW = Math.PI * 0.75; // missing finder pattern hides behind the tree
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const PALETTES = [
  { name:'Frühling', tint:'#f6b3c4', deep:'#b8506c', tile:'#dfe6cf', amt:0 },
  { name:'Sommer',   tint:'#86b25a', deep:'#2f5a22', tile:'#c9dbb0', amt:1 },
  { name:'Herbst',   tint:'#e39a45', deep:'#8a3a12', tile:'#e3d2b4', amt:1 },
  { name:'Winter',   tint:'#f4f3f0', deep:'#6b6560', tile:'#eef1f4', amt:1 },
];

const LIGHT_TILE = new THREE.Color('#e9e2df');
const LIGHT_TILE_QR = new THREE.Color('#f8f4f2');
const DARK_TILE = new THREE.Color('#bdb2ae');

/* =========================================================
   Renderer / scene
   ========================================================= */
const hero = document.getElementById('hero');
const canvas = document.getElementById('scene');
const uiEl = document.getElementById('ui');

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.35;

const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 200);
camera.up.set(0, 0, -1); // keeps the screen orientation stable all the way to the top view

const hemi = new THREE.HemisphereLight(0xfff6f2, 0xe8cdc7, 1.25);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff0e9, 2.3);
const SUN_ISO = new THREE.Vector3(5.5, 11, 6.5);
const SUN_TOP = new THREE.Vector3(0.4, 14, 0.6);
sun.position.copy(SUN_ISO);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left:-7.5, right:7.5, top:7.5, bottom:-7.5, near:1, far:40 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.025;
scene.add(sun);

const fill = new THREE.DirectionalLight(0xffe2e8, 0.55);
fill.position.set(-7, 4, -3);
scene.add(fill);

const world = new THREE.Group();
scene.add(world);

// soft contact shadow under the plinth
const groundBlob = (function addGroundShadow(){
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128,128,10,128,128,128);
  grd.addColorStop(0,'rgba(140,80,85,0.42)');
  grd.addColorStop(0.45,'rgba(140,80,85,0.16)');
  grd.addColorStop(1,'rgba(140,80,85,0)');
  g.fillStyle = grd; g.fillRect(0,0,256,256);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(PLINTH*1.9, PLINTH*1.9),
    new THREE.MeshBasicMaterial({ map:tex, transparent:true, depthWrite:false }));
  m.rotation.x = -Math.PI/2; m.position.y = -TILE_H - 0.02;
  world.add(m);

  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ color:0x8a4f55, opacity:0.12 }));
  catcher.rotation.x = -Math.PI/2; catcher.position.y = -TILE_H - 0.015;
  catcher.receiveShadow = true;
  world.add(catcher);
  return m;
})();

/* =========================================================
   Shared colour state
   ========================================================= */
const colorState = {
  index: 0,
  tint: new THREE.Color(PALETTES[0].tint),
  deep: new THREE.Color(PALETTES[0].deep),
  tintTarget: new THREE.Color(PALETTES[0].tint),
  deepTarget: new THREE.Color(PALETTES[0].deep),
  amt: 0, amtTarget: 0,   // 0 = original Higgsfield texture, 1 = recoloured
  dirty: true,
};

const treeUniforms = {
  uTint: { value: colorState.tint },
  uAmt:  { value: 0 },
  uTime: { value: 0 },
  uWind: { value: 0.35 },
  uH:    { value: TREE_H },
};

/* =========================================================
   Materials
   ========================================================= */
const clay = (opts) => new THREE.MeshPhysicalMaterial(Object.assign({
  roughness: 0.82, metalness: 0, sheen: 0.4, sheenRoughness: 0.8, sheenColor: new THREE.Color('#ffffff')
}, opts));

const tileMat  = clay({ color:0xffffff, roughness:0.9, sheen:0.2 });
const blockMat = clay({ color:0xffffff, roughness:0.85, sheen:0.15 });
const bladeMat = clay({ color:0xffffff, roughness:0.75 });
const flowerMat = clay({ color:0xffffff, roughness:0.7 });
const decalMat = new THREE.MeshStandardMaterial({ color:0xffffff, roughness:0.85, transparent:true, side:THREE.DoubleSide });
// seamless light surface that covers the tile grout in the top view, keeping the QR crisp
const qrBackingMat = new THREE.MeshStandardMaterial({ color:0xf7f2f0, roughness:0.95, transparent:true, opacity:0 });
const qrBacking = new THREE.Mesh(new THREE.PlaneGeometry(PLINTH, PLINTH), qrBackingMat);
qrBacking.rotation.x = -Math.PI/2; qrBacking.position.y = 0.004; qrBacking.receiveShadow = true;
const petalMat = clay({ color:0xffffff, roughness:0.7, side:THREE.DoubleSide, transparent:true, sheen:0.6 });

/* =========================================================
   QR garden (tiles + blossom blocks + tufts + ground petals)
   ========================================================= */
function gardenPlan(){
  const N = 21, c = (N - 1) / 2;
  return { getModuleCount: () => N, isDark: (r, k) => {
    const d = Math.hypot(r - c, k - c);
    const path = Math.abs(k - c) <= 1 && r > c + 2;          // Weg nach vorn
    if (path) return false;
    if (d > 6.2 && d < 7.6) return true;                       // runder Beet-/Heckenring
    if (r < 4 && k > 13 && (r + k) % 2 === 0) return true;     // Hochbeet hinten rechts
    if (r > 15 && k < 5 && (r * k) % 3 === 0) return true;      // Staudengruppe vorn links
    return false; } };
}

const garden = { group:null, tiles:null, tileInfo:[], blocks:null, blockInfo:[], decals:null, tufts:null, tuftInfo:[], flowers:null, flowerInfo:[], G:0, tile:0, builtAt:0, intro:true };
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(),
      tmpP = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpC = new THREE.Color(), tmpC2 = new THREE.Color();

function rand(a=0,b=1){ return a + Math.random()*(b-a); }
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => { x = clamp01(x); return x*x*(3-2*x); };
const easeInOut = (x) => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x+2, 3)/2;
const easeOutBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3*Math.pow(x-1,3) + c1*Math.pow(x-1,2); };

function buildGarden(text, intro=false){
  const q = gardenPlan();
  const N = q.getModuleCount();
  const G = N + QUIET*2;
  const tile = PLINTH / G;

  if (garden.group){
    world.remove(garden.group);
    garden.group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.isInstancedMesh) o.dispose(); });
  }
  const grp = new THREE.Group();
  world.add(grp);
  const pos = (r, c) => [(c - G/2 + 0.5) * tile, (r - G/2 + 0.5) * tile];
  const half = PLINTH / 2;

  /* tiles */
  const tileGeo = new RoundedBoxGeometry(tile*0.93, TILE_H, tile*0.93, 2, Math.min(tile*0.16, 0.045));
  const tiles = new THREE.InstancedMesh(tileGeo, tileMat, G*G);
  tiles.castShadow = true; tiles.receiveShadow = true;
  const tileInfo = [];
  let i = 0;
  for (let r = 0; r < G; r++) for (let c = 0; c < G; c++){
    const qr = r - QUIET, qc = c - QUIET;
    const dark = qr >= 0 && qr < N && qc >= 0 && qc < N && q.isDark(qr, qc);
    const [x, z] = pos(r, c);
    const d = Math.hypot(x, z) / (half * 1.42);
    const y = -TILE_H/2 + rand(-0.006, 0.006) - (dark ? 0.008 : 0);
    const shade = rand(-0.025, 0.025);
    tileInfo.push({ x, y, z, dark, d, shade, delay: d*0.75 + rand(0, 0.12) });
    tiles.setColorAt(i++, (dark ? DARK_TILE : LIGHT_TILE));
  }

  /* blossom blocks on dark modules: from the top they read as the QR code */
  const blockGeo = new RoundedBoxGeometry(tile*0.97, tile, tile*0.97, 2, tile*0.15);
  const blockInfo = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
    if (!q.isDark(r, c)) continue;
    const [x, z] = pos(r + QUIET, c + QUIET);
    const d = Math.hypot(x, z) / (half * 1.1);
    const h = tile * (0.55 + 1.6*Math.pow(clamp01(1 - d), 1.5) + rand(0, 0.45));
    blockInfo.push({ x, z, h, d, delay: clamp01(d) * 0.75 + rand(0, 0.2), shade: rand(-0.06, 0.05) });
  }
  const blocks = new THREE.InstancedMesh(blockGeo, blockMat, blockInfo.length);
  blocks.castShadow = true; blocks.receiveShadow = true;

  /* pink grass tufts on the three finder patterns (like the corners in the reference) */
  const finders = [[3,3],[3,N-4],[N-4,3]];
  const bladeGeo = new THREE.ConeGeometry(0.042, 1, 5, 1, false); bladeGeo.translate(0, 0.5, 0);
  const flowerGeo = new THREE.IcosahedronGeometry(0.045, 1);
  const BLADES = 120, FLOWERS = 18;
  const tufts = new THREE.InstancedMesh(bladeGeo, bladeMat, finders.length * BLADES);
  const flowers = new THREE.InstancedMesh(flowerGeo, flowerMat, finders.length * FLOWERS);
  tufts.castShadow = true; flowers.castShadow = true;
  const tuftInfo = [], flowerInfo = [];
  const tuftR = tile * 3.1;
  finders.forEach(([fr, fc]) => {
    const [cx, cz] = pos(fr + QUIET, fc + QUIET);
    for (let b = 0; b < BLADES; b++){
      const a = rand(0, Math.PI*2), rr = Math.sqrt(Math.random()) * tuftR;
      const x = cx + Math.cos(a)*rr, z = cz + Math.sin(a)*rr;
      const lean = 0.15 + (rr/tuftR) * 0.55;
      const h = rand(0.18, 0.4) * (1 - (rr/tuftR)*0.4);
      tuftInfo.push({ x, z, h, a, lean, mix: Math.random(), phase: rand(0, 6.28), cx, cz });
    }
    for (let f = 0; f < FLOWERS; f++){
      const a = rand(0, Math.PI*2), rr = Math.sqrt(Math.random()) * tuftR * 0.8;
      flowerInfo.push({ x: cx + Math.cos(a)*rr, z: cz + Math.sin(a)*rr, y: rand(0.18, 0.34), s: rand(0.7, 1.25), mix: rand(0.55, 1), cx, cz, phase: rand(0, 6.28) });
    }
  });

  /* fallen petals on the ground */
  const decalGeo = new THREE.CircleGeometry(1, 9); decalGeo.rotateX(-Math.PI/2);
  const DECALS = Math.min(320, Math.round(G*G*0.26));
  const decals = new THREE.InstancedMesh(decalGeo, decalMat, DECALS);
  decals.receiveShadow = true;
  for (let k = 0; k < DECALS; k++){
    let x, z;
    do { x = rand(-half*0.96, half*0.96); z = rand(-half*0.96, half*0.96); } while (Math.hypot(x, z) < 0.55);
    tmpQ.setFromEuler(tmpE.set(rand(-0.15,0.15), rand(0, Math.PI*2), rand(-0.15,0.15)));
    const s = rand(0.035, 0.065);
    tmpM.compose(tmpP.set(x, 0.006, z), tmpQ, tmpS.set(s, 1, s*0.62));
    decals.setMatrixAt(k, tmpM);
    decals.setColorAt(k, tmpC.setHSL(0, 0, rand(0.86, 1)));
  }
  decals.instanceMatrix.needsUpdate = true;

  grp.add(tiles, blocks, tufts, flowers, decals, qrBacking);
  Object.assign(garden, { group:grp, tiles, tileInfo, blocks, blockInfo, tufts, tuftInfo, flowers, flowerInfo, decals, G, tile, builtAt: performance.now()/1000, intro, settled: false });
  colorState.dirty = true;
  updateGarden(true);
}

function updateGarden(force=false){
  const now = performance.now()/1000;
  const since = now - garden.builtAt;
  // keep animating until one pass has run past the end (rAF may pause while the tab is hidden)
  const rippling = since < 2.2 || !garden.settled;
  garden.settled = since >= 2.2;

  const e = qrEase;
  const { tiles, tileInfo, blocks, blockInfo, tufts, tuftInfo, flowers, flowerInfo } = garden;

  /* tiles: intro rise, or a gentle wave on rebuild, and lighten in QR mode for contrast */
  if (force || rippling || qrChanged){
    for (let i = 0; i < tileInfo.length; i++){
      const t = tileInfo[i];
      const k = clamp01((since - t.delay*0.9) / 0.6);
      let y = t.y, s = 1;
      if (garden.intro){ y -= (1 - easeOutBack(k)) * 0.9; s = Math.max(0.001, Math.min(1, k*1.6)); }
      else { y += Math.sin(k * Math.PI) * 0.12; }
      s *= 1 + 0.075 * e; // close the grout lines in QR mode so scanners see clean modules
      tmpM.compose(tmpP.set(t.x, y, t.z), tmpQ.identity(), tmpS.set(s, 1, s));
      tiles.setMatrixAt(i, tmpM);
      tmpC.copy(t.dark ? DARK_TILE : LIGHT_TILE).lerp(t.dark ? DARK_TILE : LIGHT_TILE_QR, e);
      tmpC.offsetHSL(0, 0, t.shade * (1 - e));
      tiles.setColorAt(i, tmpC);
    }
    tiles.instanceMatrix.needsUpdate = true;
    tiles.instanceColor.needsUpdate = true;
  }

  /* blossom blocks grow out of the ground as the tree folds away */
  if (force || rippling || qrChanged || colorState.dirty){
    for (let i = 0; i < blockInfo.length; i++){
      const b = blockInfo[i];
      const local = clamp01((qrP - 0.28 - b.delay*0.32) / 0.34);
      let s = local > 0 ? easeOutBack(local) : 0;
      if (!garden.intro && rippling && qrP > 0.99){
        const k = clamp01((since - b.delay*0.6) / 0.45);
        s *= 1 + Math.sin(k*Math.PI) * 0.35;
      }
      const hy = Math.max(0.0001, b.h * s);
      const xz = Math.max(0.0001, Math.min(1, 0.35 + 0.65*s)) * (1 + 0.07 * qrEase); // blocks merge into solid modules from above
      tmpM.compose(tmpP.set(b.x, hy/2 - 0.01, b.z), tmpQ.identity(), tmpS.set(xz, hy/garden.tile, xz));
      blocks.setMatrixAt(i, tmpM);
      if (colorState.dirty || force){ tmpC.copy(colorState.deep).offsetHSL(0, 0, b.shade*0.6); blocks.setColorAt(i, tmpC); }
    }
    blocks.instanceMatrix.needsUpdate = true;
    if (blocks.instanceColor) blocks.instanceColor.needsUpdate = true;
    blocks.visible = qrP > 0.2;
  }

  /* grass tufts + flowers shrink away in QR mode, sway with the breeze */
  const tuftScale = 1 - smooth(qrP / 0.35);
  const introK = garden.intro ? easeOutBack(clamp01((since - 0.7) / 0.8)) : 1;
  const ts = Math.max(0.0001, tuftScale * introK);
  tufts.visible = flowers.visible = ts > 0.002;
  if (tufts.visible){
    const t = clock.elapsedTime, w = treeUniforms.uWind.value;
    for (let i = 0; i < tuftInfo.length; i++){
      const b = tuftInfo[i];
      const sway = Math.sin(t*2.2 + b.phase) * 0.1 * w;
      tmpE.set(Math.sin(b.a)*b.lean + sway, 0, -Math.cos(b.a)*b.lean + sway*0.6, 'XYZ');
      tmpQ.setFromEuler(tmpE);
      tmpM.compose(tmpP.set(b.cx + (b.x-b.cx)*ts, 0, b.cz + (b.z-b.cz)*ts), tmpQ, tmpS.set(ts, b.h*ts, ts));
      tufts.setMatrixAt(i, tmpM);
      if (colorState.dirty || force){ tmpC.copy(colorState.deep).lerp(tmpC2.copy(colorState.tint), 0.25 + b.mix*0.75); tufts.setColorAt(i, tmpC); }
    }
    for (let i = 0; i < flowerInfo.length; i++){
      const f = flowerInfo[i];
      const bob = Math.sin(t*2 + f.phase) * 0.012 * (0.5 + w);
      tmpM.compose(tmpP.set(f.cx + (f.x-f.cx)*ts, (f.y + bob)*ts, f.cz + (f.z-f.cz)*ts), tmpQ.identity(), tmpS.setScalar(f.s*ts));
      flowers.setMatrixAt(i, tmpM);
      if (colorState.dirty || force){ tmpC.copy(colorState.tint).lerp(tmpC2.set('#ffffff'), 1 - f.mix*0.6); flowers.setColorAt(i, tmpC); }
    }
    tufts.instanceMatrix.needsUpdate = true; flowers.instanceMatrix.needsUpdate = true;
    if (tufts.instanceColor) tufts.instanceColor.needsUpdate = true;
    if (flowers.instanceColor) flowers.instanceColor.needsUpdate = true;
  }

  /* ground petals fade out so the QR stays crisp */
  qrBackingMat.opacity = smooth((qrP - 0.25) / 0.4);
  qrBacking.visible = qrBackingMat.opacity > 0.01;
  decalMat.opacity = (1 - smooth(qrP / 0.35)) * (garden.intro ? clamp01((since - 0.9)/0.8) : 1);
  garden.decals.visible = decalMat.opacity > 0.01;
}

/* =========================================================
   Tree (Higgsfield GLB)
   ========================================================= */
const treeGroup = new THREE.Group();
world.add(treeGroup);
const treeProxy = new THREE.Group();
treeGroup.add(treeProxy);
const canopy = { y: TREE_H*0.66, rx: 3, ry: 1.3, rz: 3 };

function patchTreeMaterial(mat){
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, treeUniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime; uniform float uWind; uniform float uH;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float hN = clamp(transformed.y / uH, 0.0, 1.0);
        float bend = hN * hN;
        float sw = sin(uTime*1.25 + transformed.x*0.3) * 0.6 + sin(uTime*2.05 + transformed.z*0.45) * 0.4;
        transformed.x += sw * bend * uWind * 0.13;
        transformed.z += cos(uTime*1.05 + transformed.x*0.35) * bend * uWind * 0.08;
        float flutter = smoothstep(0.42, 0.8, hN);
        transformed += normal * sin(uTime*4.2 + position.x*7.0 + position.z*6.0) * 0.018 * flutter * uWind;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uTint; uniform float uAmt;
        vec3 sakuraHSV(vec3 c){
          vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
          float d = q.x - min(q.w, q.y);
          return vec3(abs(q.z + (q.w - q.y) / (6.0*d + 1e-10)), d / (q.x + 1e-10), q.x);
        }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
        {
          vec3 lin = diffuseColor.rgb;
          vec3 s = pow(max(lin, vec3(0.0)), vec3(1.0/2.2));
          vec3 hsv = sakuraHSV(s);
          float pinkHue = clamp(smoothstep(0.80, 0.90, hsv.x) + (1.0 - smoothstep(0.0, 0.03, hsv.x)), 0.0, 1.0);
          float pinkM  = pinkHue * smoothstep(0.42, 0.6, hsv.z);
          float whiteM = (1.0 - smoothstep(0.10, 0.22, hsv.y)) * smoothstep(0.55, 0.75, hsv.z);
          float m = max(pinkM, whiteM);
          float lum = dot(s, vec3(0.299, 0.587, 0.114));
          float whiteness = 1.0 - smoothstep(0.06, 0.32, hsv.y);
          vec3 tintS = pow(uTint, vec3(1.0/2.2));
          vec3 rec = mix(tintS, vec3(1.0), whiteness * 0.7) * (lum / 0.8);
          rec = pow(clamp(rec, 0.0, 1.0), vec3(2.2));
          diffuseColor.rgb = mix(lin, rec, m * uAmt);
        }`);
  };
  mat.customProgramCacheKey = () => 'sakura-tree';
}

function addTreeProxy(w, d){
  const inv = new THREE.MeshBasicMaterial({ visible:false });
  const crown = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), inv);
  crown.scale.set(w*0.47, TREE_H*0.3, d*0.47);
  crown.position.y = canopy.y;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.8, TREE_H*0.6, 10), inv);
  trunk.position.y = TREE_H*0.3;
  treeProxy.add(crown, trunk);
}

function onTreeLoaded(gltf){
  const root = gltf.scene;
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const s = TREE_H / size.y;

  root.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    g.translate(-center.x, -box.min.y, -center.z);
    g.scale(s, s, s);
    if (!g.attributes.normal) g.computeVertexNormals();
    const src = o.material;
    const mat = clay({
      map: src.map || null,
      normalMap: src.normalMap || null,
      color: src.color ? src.color.clone() : new THREE.Color(0xffffff),
      roughness: 0.8, sheen: 0.45, side: THREE.FrontSide,
    });
    if (mat.map){ mat.map.colorSpace = THREE.SRGBColorSpace; mat.map.anisotropy = 4; }
    patchTreeMaterial(mat);
    const mesh = new THREE.Mesh(g, mat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    treeGroup.add(mesh);
  });

  const w = size.x * s, d = size.z * s;
  canopy.y = TREE_H * 0.68; canopy.rx = w * 0.4; canopy.rz = d * 0.4; canopy.ry = TREE_H * 0.22;
  addTreeProxy(w, d);
  treeReady();
}

// Procedural clay tree, only used if the GLB cannot be fetched
function buildFallbackTree(){
  const bark = clay({ color:'#7a5248' });
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,0,0), new THREE.Vector3(0.25,1.2,0.1), new THREE.Vector3(-0.15,2.4,0), new THREE.Vector3(0.1,3.4,-0.1)
  ]);
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.42, 14), bark);
  trunk.castShadow = true; treeGroup.add(trunk);
  const blossom = clay({ color:'#ffffff' });
  patchTreeMaterial(blossom);
  const geo = new THREE.IcosahedronGeometry(1, 3);
  for (let i = 0; i < 70; i++){
    const a = rand(0, Math.PI*2), r = Math.sqrt(Math.random())*2.8;
    const m = new THREE.Mesh(geo, blossom);
    const s = rand(0.45, 0.85);
    m.scale.setScalar(s);
    m.position.set(Math.cos(a)*r, rand(3.3, 5.4) - r*0.25, Math.sin(a)*r);
    m.castShadow = true; treeGroup.add(m);
  }
  colorState.amtTarget = 1;
  addTreeProxy(6, 6);
  treeReady();
}

const loaderEl = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
let treeShownAt = -1;

function treeReady(){
  loaderBar.style.width = '100%';
  setTimeout(() => loaderEl.classList.add('is-done'), 200);
  treeShownAt = clock.elapsedTime;
  buildGarden('', true);
}

const loader = new GLTFLoader();
loader.load(TREE_URL, onTreeLoaded,
  (ev) => { if (ev.total) loaderBar.style.width = Math.round(ev.loaded / ev.total * 92) + '%'; },
  (err) => { console.warn('Tree GLB failed, using fallback', err); buildFallbackTree(); });

/* =========================================================
   Falling petals
   ========================================================= */
function makePetalGeometry(){
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.05, 0.02, 0.06, 0.07, 0.025, 0.1);
  s.lineTo(0, 0.088);
  s.lineTo(-0.025, 0.1);
  s.bezierCurveTo(-0.06, 0.07, -0.05, 0.02, 0, 0);
  const g = new THREE.ShapeGeometry(s, 6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++){ const x = p.getX(i), y = p.getY(i); p.setZ(i, x*x*9 + (y-0.05)*(y-0.05)*3); }
  g.translate(0, -0.05, 0);
  g.scale(1.25, 1.25, 1.25);
  g.computeVertexNormals();
  return g;
}
const PETALS = REDUCED ? 60 : 180;
const petals = new THREE.InstancedMesh(makePetalGeometry(), petalMat, PETALS);
petals.castShadow = true;
petals.frustumCulled = false;
world.add(petals);
const P = Array.from({ length: PETALS }, () => ({
  state: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), spin: new THREE.Vector3(), t: 0, s: 1, phase: 0
}));
for (let i = 0; i < PETALS; i++){
  petals.setMatrixAt(i, tmpM.makeScale(0, 0, 0));
  petals.setColorAt(i, tmpC.setHSL(0, 0, rand(0.82, 1)));
}
let petalCursor = 0;

function spawnPetal(burst=false){
  for (let n = 0; n < PETALS; n++){
    const i = (petalCursor + n) % PETALS;
    if (P[i].state !== 0) continue;
    petalCursor = i + 1;
    const pt = P[i];
    const a = rand(0, Math.PI*2), r = Math.sqrt(Math.random());
    pt.p.set(Math.cos(a)*r*canopy.rx, canopy.y + rand(-1, 0.6)*canopy.ry, Math.sin(a)*r*canopy.rz);
    if (burst){
      const dir = new THREE.Vector3(pt.p.x, rand(0.2, 1.2), pt.p.z).normalize();
      pt.v.copy(dir).multiplyScalar(rand(1.2, 2.8));
    } else pt.v.set(rand(-0.1, 0.1), rand(-0.2, 0), rand(-0.1, 0.1));
    pt.r.set(rand(0, 6.28), rand(0, 6.28), rand(0, 6.28));
    pt.spin.set(rand(-3, 3), rand(-2, 2), rand(-3, 3));
    pt.s = rand(0.75, 1.25);
    pt.phase = rand(0, 6.28);
    pt.state = 1; pt.t = 0;
    return;
  }
}

let spawnAcc = 0;
function updatePetals(dt, t){
  const wind = treeUniforms.uWind.value;
  const treeVisible = treeGroup.scale.y > 0.5 && treeShownAt >= 0;
  if (treeVisible && qrTarget === 0){
    spawnAcc += dt * (REDUCED ? 1 : (2.5 + wind * 11));
    while (spawnAcc > 1){ spawnAcc -= 1; spawnPetal(false); }
  }
  const half = PLINTH/2;
  for (let i = 0; i < PETALS; i++){
    const pt = P[i];
    if (pt.state === 0) continue;
    let scale = pt.s;
    if (pt.state === 1){
      pt.v.y += (-0.5 - pt.v.y) * dt * 1.6;
      pt.v.x += ((wind*1.1 - 0.15) - pt.v.x) * dt * 0.9;
      pt.v.z += (wind*0.35 - pt.v.z) * dt * 0.9;
      pt.p.addScaledVector(pt.v, dt);
      pt.p.x += Math.sin(t*2.3 + pt.phase) * dt * 0.35;
      pt.p.z += Math.cos(t*1.9 + pt.phase) * dt * 0.25;
      pt.r.x += pt.spin.x*dt; pt.r.y += pt.spin.y*dt; pt.r.z += pt.spin.z*dt;
      if (pt.p.y <= 0.012 && Math.abs(pt.p.x) < half && Math.abs(pt.p.z) < half){
        pt.p.y = 0.012; pt.state = 2; pt.t = rand(3, 7);
        pt.r.set(-Math.PI/2 + rand(-0.2,0.2), 0, rand(0, 6.28));
      } else if (pt.p.y < -4){ pt.state = 0; }
    } else if (pt.state === 2){
      pt.t -= dt;
      if (qrTarget === 1) pt.t -= dt*6;
      scale *= clamp01(pt.t);
      if (pt.t <= 0) pt.state = 0;
    }
    tmpQ.setFromEuler(pt.r);
    tmpM.compose(pt.p, tmpQ, tmpS.setScalar(pt.state ? Math.max(scale, 0.0001) : 0));
    petals.setMatrixAt(i, tmpM);
    if (pt.state === 0) petals.setMatrixAt(i, tmpM.makeScale(0,0,0));
  }
  petals.instanceMatrix.needsUpdate = true;
  petalMat.opacity = 1 - smooth((qrP - 0.4) / 0.4);
  petals.visible = petalMat.opacity > 0.01; // also stops petal shadows speckling the QR
}

/* =========================================================
   Sound (synthesised: soft wind + wind chimes)
   ========================================================= */
const Sound = (() => {
  let ctx, master, windGain, windFilter, delay, on = false, timer;
  const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];
  function init(){
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    delay = ctx.createDelay(1.5); delay.delayTime.value = 0.34;
    const fb = ctx.createGain(); fb.gain.value = 0.38;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
    delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(master);
    const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++){ last = (last + 0.02 * (Math.random()*2 - 1)) / 1.02; d[i] = last * 3.2; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    windFilter = ctx.createBiquadFilter(); windFilter.type = 'lowpass'; windFilter.frequency.value = 520;
    windGain = ctx.createGain(); windGain.gain.value = 0.3;
    src.connect(windFilter).connect(windGain).connect(master); src.start();
  }
  function chime(freq, when = 0, vol = 0.08){
    const t = ctx.currentTime + when;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    [[1, 1], [2.76, 0.22], [5.4, 0.06]].forEach(([mult, amp]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq * mult;
      const og = ctx.createGain(); og.gain.value = amp;
      o.connect(og).connect(g); o.start(t); o.stop(t + 3.3);
    });
    g.connect(master); g.connect(delay);
  }
  function loop(){
    if (!on) return;
    chime(notes[Math.floor(Math.random()*notes.length)], 0, rand(0.03, 0.07));
    if (Math.random() < 0.35) chime(notes[Math.floor(Math.random()*notes.length)], rand(0.15, 0.4), rand(0.02, 0.05));
    timer = setTimeout(loop, rand(1600, 4200));
  }
  return {
    toggle(){
      if (!ctx) init();
      on = !on;
      if (on){ ctx.resume(); master.gain.setTargetAtTime(0.85, ctx.currentTime, 0.5); loop(); }
      else { master.gain.setTargetAtTime(0, ctx.currentTime, 0.25); clearTimeout(timer); }
      return on;
    },
    arp(up = true){
      if (!on) return;
      const seq = up ? [0, 2, 4, 5, 7] : [7, 5, 4, 2, 0];
      seq.forEach((k, i) => chime(notes[k], i * 0.085, 0.06));
    },
    wind(level){
      if (!ctx) return;
      windGain.gain.setTargetAtTime(0.22 + level * 0.55, ctx.currentTime, 0.8);
      windFilter.frequency.setTargetAtTime(420 + level * 900, ctx.currentTime, 0.8);
    },
  };
})();

/* =========================================================
   Camera framing
   ========================================================= */
const frame = { isoR: 30, topR: 30, isoTargetY: 2.75 };
function layout(){
  const w = hero.clientWidth, h = hero.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const uiTop = uiEl.getBoundingClientRect().top - hero.getBoundingClientRect().top;
  const uiH = h - uiTop + 10;
  const topPad = Math.min(40, h * 0.04);
  const avail = Math.max(200, h - uiH - topPad);
  const wide = w > 900 || w / h > 1.3; camera.setViewOffset(w, h, wide ? w * 0.2 : 0, (uiH - topPad) / 2 + (!wide ? h * 0.14 : 0), w, h);
  camera.updateProjectionMatrix();

  const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const k = h / avail;
  const aspect = w / h;
  frame.isoR = Math.max(4.6 * k / t, 4.7 / (t * aspect)) * (aspect < .8 ? 1.05 : 1);
  frame.topR = Math.max(PLINTH * 0.55 * k / t, PLINTH * 0.58 / (t * aspect));
}
window.addEventListener('resize', layout);
new ResizeObserver(layout).observe(uiEl);

/* =========================================================
   Interaction state
   ========================================================= */
let qrP = 0, qrTarget = 0, qrEase = 0, qrChanged = true;
let yaw = 0, yawVel = 0, yawFrom = 0, yawTo = 0, scrollEase = 0;
let hover = 0, hoverTarget = 0, pulse = 0;
let autoBloom = false, autoBloomTimer = 0;
const hintText = document.getElementById('hintText');

function setQR(on){
  if ((qrTarget === 1) === on) return;
  qrTarget = on ? 1 : 0;
  if (on){
    yawFrom = yaw;
    yawTo = Math.round(yaw / (Math.PI*2)) * Math.PI*2;
    yawVel = 0;
    for (let i = 0; i < 70; i++) spawnPetal(true);
  }
  Sound.arp(on);
  swapHint(on ? 'Tap to see the tree' : 'Tap the tree to see QR code');
}
function swapHint(text){
  hintText.classList.add('is-swap');
  setTimeout(() => { hintText.textContent = text; hintText.classList.remove('is-swap'); }, 220);
}

/* pointer: drag to turn the tree, tap the tree to see the QR */
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const plinthProxy = new THREE.Mesh(new THREE.BoxGeometry(PLINTH, 1.4, PLINTH), new THREE.MeshBasicMaterial({ visible:false }));
plinthProxy.position.y = 0.2;
world.add(plinthProxy);

function hitTest(clientX, clientY){
  const r = canvas.getBoundingClientRect();
  ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  if (qrTarget === 1) return raycaster.intersectObject(plinthProxy, false).length > 0 ? 'plinth' : null;
  return raycaster.intersectObject(treeProxy, true).length > 0 ? 'tree' : null;
}

let down = null;
canvas.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY, t: performance.now(), lastX: e.clientX, drag: false };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (down){
    const dx = e.clientX - down.lastX;
    down.lastX = e.clientX;
    if (!down.drag && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 7) down.drag = true;
    if (down.drag && qrTarget === 0 && qrP < 0.01){
      yaw += dx * 0.0075;
      yawVel = dx * 0.0075 / 0.016;
      canvas.classList.add('is-grabbing');
    }
    return;
  }
  if (e.pointerType === 'mouse'){
    const hit = hitTest(e.clientX, e.clientY);
    hoverTarget = hit === 'tree' ? 1 : 0;
    canvas.classList.toggle('is-pointer', !!hit);
  }
});
function endPointer(e){
  if (!down) return;
  const wasTap = !down.drag && performance.now() - down.t < 550;
  canvas.classList.remove('is-grabbing');
  if (wasTap){
    const hit = hitTest(e.clientX, e.clientY);
    if (hit === 'tree'){ pulse = 1; for (let n = 0; n < 30; n++) spawnPetal(true); }
  }
  down = null;
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', () => { down = null; canvas.classList.remove('is-grabbing'); });
canvas.addEventListener('pointerleave', () => { hoverTarget = 0; });


/* Jahreszeiten: färben Baum, Boden und Partikel */
let season = 0;
function setSeason(i, burst){
  if (i === season && !burst) return;
  season = i;
  const p = PALETTES[i];
  colorState.index = i;
  colorState.tintTarget.set(p.tint);
  colorState.deepTarget.set(p.deep);
  colorState.amtTarget = (p.amt === 0 && treeGroup.children.some(c => c.isMesh && c.material.map)) ? 0 : 1;
  tileTarget.set(p.tile);
  if (burst){ pulse = 1; for (let n = 0; n < 40; n++) spawnPetal(true); }
}
const tileTarget = new THREE.Color(PALETTES[0].tile);
tileMat.color.set(PALETTES[0].tile);
/* Scrollen: Kamera kreist einmal um den Baum (0–360°) */
let scrollP = 0;
function readScroll(){
  const st = document.getElementById('story');
  const h = st.offsetHeight - innerHeight;
  scrollP = h > 0 ? Math.min(1, Math.max(0, -st.getBoundingClientRect().top / h)) : 0;
}
addEventListener('scroll', readScroll, { passive: true });
window.WW3D = { setSeason: (i) => setSeason(i, true), get p(){ return scrollP; }, dbg: () => ({ season, scrollP, amt: colorState.amt, amtT: colorState.amtTarget, tint: colorState.tint.getHexString(), u: treeUniforms.uAmt.value }) };
const breeze = false;
/* =========================================================
   Loop
   ========================================================= */
const clock = new THREE.Clock();
const camTarget = new THREE.Vector3();

function tick(){
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  treeUniforms.uTime.value = t;

  /* QR transition */
  const prevP = qrP;
  const speed = 1 / 1.7;
  qrP = qrTarget > qrP ? Math.min(qrTarget, qrP + dt*speed) : Math.max(qrTarget, qrP - dt*speed);
  qrChanged = qrP !== prevP;
  qrEase = easeInOut(qrP);

  /* yaw: free drag with inertia in tree mode, eased to upright for the QR */
  if (!down){
    yaw += yawVel * dt;
    yawVel *= Math.pow(0.04, dt);
    yaw *= Math.pow(0.35, dt);            // gezogener Versatz federt sanft zurück
  }
  readScroll();
  scrollEase += (scrollP - scrollEase) * (1 - Math.exp(-dt * 5));
  world.rotation.y = ISO_YAW + scrollEase * Math.PI * 2 + yaw + t * 0.02;
  const si = window.WW_SEASON == null ? 0 : window.WW_SEASON;   // Jahreszeit der sichtbaren Station
  if (si !== season) setSeason(si, true);
  tileMat.color.lerp(tileTarget, 1 - Math.exp(-dt * 2.5));

  /* camera: isometric hero ↔ straight top view */
  const polar = THREE.MathUtils.lerp(ISO_POLAR, 0.0001, qrEase);
  const radius = THREE.MathUtils.lerp(frame.isoR, frame.topR, qrEase);
  camTarget.set(0, THREE.MathUtils.lerp(frame.isoTargetY, 0, qrEase), 0);
  camera.position.set(0, camTarget.y + Math.cos(polar)*radius, Math.sin(polar)*radius);
  camera.lookAt(camTarget);
  sun.position.lerpVectors(SUN_ISO, SUN_TOP, qrEase);
  groundBlob.material.opacity = (treeShownAt >= 0 ? smooth((t - treeShownAt) / 1.2) : 0) * (1 - qrEase * 0.85);

  /* wind */
  const windTarget = breeze ? 1 : 0.32;
  treeUniforms.uWind.value += (windTarget - treeUniforms.uWind.value) * (1 - Math.exp(-dt*1.5));

  /* colours */
  const ck = 1 - Math.exp(-dt*3.5);
  const before = colorState.tint.r + colorState.tint.g + colorState.tint.b + colorState.deep.r + colorState.amt;
  colorState.tint.lerp(colorState.tintTarget, ck);
  colorState.deep.lerp(colorState.deepTarget, ck);
  colorState.amt += (colorState.amtTarget - colorState.amt) * ck;
  const after = colorState.tint.r + colorState.tint.g + colorState.tint.b + colorState.deep.r + colorState.amt;
  if (Math.abs(after - before) > 1e-4) colorState.dirty = true;
  treeUniforms.uAmt.value = colorState.amt;
  petalMat.color.copy(colorState.tint).lerp(tmpC2.set('#ffffff'), 0.12);
  decalMat.color.copy(colorState.tint);



  /* tree: grow-in, hover, bloom pulse, fold away for the QR */
  hover += (hoverTarget - hover) * (1 - Math.exp(-dt*8));
  pulse *= Math.pow(0.02, dt);
  if (treeShownAt >= 0){
    const grow = easeOutBack(clamp01((t - treeShownAt - 0.35) / 1.1));
    const fold = 1 - smooth(qrP / 0.5);
    const s = Math.max(0.0001, grow * fold * (1 + hover*0.015 + Math.sin(pulse*Math.PI)*0.035*pulse));
    treeGroup.scale.set(s, s, s);
    treeGroup.rotation.y = (1 - fold) * 1.4;
    treeGroup.visible = s > 0.001;
  } else {
    treeGroup.scale.setScalar(0.0001);
  }

  if (garden.group) updateGarden(false);
  colorState.dirty = false;
  updatePetals(dt, t);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

layout();
tick();

