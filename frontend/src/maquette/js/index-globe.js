/* ================================================================
   FICHIER — index-globe.js
   Globe 3D style wikiglobe (dat.globe) adapté pour marsAI.
   Basé sur https://github.com/vrandezo/wikiglobe
   Porté vers Three.js 0.160 (ES module).

   Rendu fidèle au wikiglobe :
   - Sphère texturée (world.jpg) + shader lueur blanche bord
   - Atmosphère glow bleue extérieure (backside, pow 12)
   - Données Wikipedia FR chargées depuis globe-data.json
   - Marqueur Marseille pulsant (dot coral + anneau)
   - Drag souris + auto-rotation
   - Throttle 20fps + IntersectionObserver
   ================================================================ */
import * as THREE from 'three';

/* ----------------------------------------------------------------
   Shaders — identiques au dat.globe original
   ---------------------------------------------------------------- */
const Shaders = {
  earth: {
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vec3 diffuse = texture2D(uTexture, vUv).xyz;
        float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(1.0, 1.0, 1.0) * pow(intensity, 3.0);
        gl_FragColor = vec4(diffuse + atmosphere, 1.0);
      }
    `
  },
  atmosphere: {
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 12.0);
        gl_FragColor = vec4(0.1, 0.2, 0.5, 0.7) * intensity;
      }
    `
  }
};

/* ----------------------------------------------------------------
   Configuration
   ---------------------------------------------------------------- */
const TARGET_FPS = 20;
const FRAME_TIME = 1000 / TARGET_FPS;
const GLOBE_RADIUS = 200;
const PI_HALF = Math.PI / 2;
const AUTO_ROTATE_SPEED = 0.003;
const AUTO_ROTATE_DELAY = 3000;

const MARSEILLE_LAT = 43.2964;
const MARSEILLE_LON = 5.3736;

/* ----------------------------------------------------------------
   Fonction couleur — identique au wikiglobe (HSV bleu→vert)
   ---------------------------------------------------------------- */
function dataColor(value) {
  const c = new THREE.Color();
  if (value === 0) {
    c.setHSL(0, 0, 0);
  } else {
    // HSV(hue, 1, 1) → hue de 0.6 (bleu) à 0.35 (vert) selon valeur
    const hue = 0.6 - value * 0.25;
    c.setHSL(hue, 1.0, 0.5);
  }
  return c;
}

/* ----------------------------------------------------------------
   Utilitaire lat/lon → 3D (convention wikiglobe : theta = 180-lon)
   ---------------------------------------------------------------- */
function latLonToVec3(lat, lon, radius) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (180 - lon) * Math.PI / 180;
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/* ----------------------------------------------------------------
   Canvas placeholder (1x1 sombre) pour le shader avant chargement
   ---------------------------------------------------------------- */
function createPlaceholderTexture() {
  const c = document.createElement('canvas');
  c.width = 1;
  c.height = 1;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#070b1a';
  ctx.fillRect(0, 0, 1, 1);
  return new THREE.CanvasTexture(c);
}

/* ----------------------------------------------------------------
   Init
   ---------------------------------------------------------------- */
const canvas = document.getElementById('globe-canvas');
if (!canvas) throw new Error('[Globe] Canvas introuvable');

let testGl = null;
try { testGl = canvas.getContext('webgl2') || canvas.getContext('webgl'); } catch (e) {}
if (!testGl) {
  canvas.style.display = 'none';
  throw new Error('[Globe] WebGL indisponible');
}

/* ----------------------------------------------------------------
   Scène + Caméra + Renderer
   ---------------------------------------------------------------- */
const scene = new THREE.Scene();
const sceneAtmosphere = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, 1, 1, 10000);
camera.position.z = 600;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'low-power'
});
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.autoClear = false;

function resize() {
  const parent = canvas.parentElement;
  if (!parent) return;
  const w = parent.clientWidth;
  const h = parent.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

/* ----------------------------------------------------------------
   Couche 1 — Sphère Terre texturée (shader identique wikiglobe)
   ---------------------------------------------------------------- */
const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 30);
const earthUniforms = { uTexture: { value: createPlaceholderTexture() } };
const earthMat = new THREE.ShaderMaterial({
  uniforms: earthUniforms,
  vertexShader: Shaders.earth.vertexShader,
  fragmentShader: Shaders.earth.fragmentShader
});
const earth = new THREE.Mesh(earthGeo, earthMat);
earth.matrixAutoUpdate = false;
earth.updateMatrix();
scene.add(earth);

// Charger world.jpg (pas de colorSpace pour rester fidèle au wikiglobe)
new THREE.TextureLoader().load(
  '../assets/world.jpg',
  (tex) => { earthUniforms.uTexture.value = tex; },
  undefined,
  (err) => console.warn('[Globe] Texture introuvable', err)
);

/* ----------------------------------------------------------------
   Couche 2 — Atmosphère bleue (identique wikiglobe)
   ---------------------------------------------------------------- */
const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 30);
const atmoMat = new THREE.ShaderMaterial({
  vertexShader: Shaders.atmosphere.vertexShader,
  fragmentShader: Shaders.atmosphere.fragmentShader,
  side: THREE.BackSide,
  transparent: true,
  depthWrite: false
});
const atmo = new THREE.Mesh(atmoGeo, atmoMat);
atmo.scale.set(1.1, 1.1, 1.1);
atmo.matrixAutoUpdate = false;
atmo.updateMatrix();
sceneAtmosphere.add(atmo);

/* ----------------------------------------------------------------
   Couche 3 — Données Wikipedia FR (chargées en async)
   Format : [lat, lon, val, lat, lon, val, ...]
   ---------------------------------------------------------------- */
fetch('../assets/globe-data.json')
  .then(r => r.json())
  .then(data => {
    const positions = [];
    const colors = [];

    for (let i = 0; i < data.length; i += 3) {
      const lat = data[i];
      const lon = data[i + 1];
      const val = data[i + 2];

      // Ignorer les points à valeur 0
      if (val === 0) continue;

      const pos = latLonToVec3(lat, lon, GLOBE_RADIUS * 1.001);
      positions.push(pos.x, pos.y, pos.z);

      const c = dataColor(val);
      colors.push(c.r, c.g, c.b);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    scene.add(new THREE.Points(geo, mat));
  })
  .catch(err => console.warn('[Globe] Données introuvables', err));

/* ----------------------------------------------------------------
   Couche 4 — Marqueur Marseille
   ---------------------------------------------------------------- */
const marseillePos = latLonToVec3(MARSEILLE_LAT, MARSEILLE_LON, GLOBE_RADIUS * 1.02);

const dotGeo = new THREE.SphereGeometry(4, 12, 12);
const dotMat = new THREE.MeshBasicMaterial({ color: 0xFF6B6B, transparent: true, opacity: 1.0 });
const dot = new THREE.Mesh(dotGeo, dotMat);
dot.position.copy(marseillePos);
scene.add(dot);

const ringGeo = new THREE.RingGeometry(6, 8, 24);
const ringMat = new THREE.MeshBasicMaterial({
  color: 0xFF6B6B, transparent: true, opacity: 0.7,
  side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.position.copy(marseillePos);
ring.lookAt(0, 0, 0);
scene.add(ring);

/* ----------------------------------------------------------------
   Interaction souris — drag rotation (style wikiglobe)
   ---------------------------------------------------------------- */
let mouseOnDown = { x: 0, y: 0 };
let targetOnDown = { x: 0, y: 0 };
let target = { x: Math.PI * 3 / 2, y: Math.PI / 6.0 };
let rotation = { x: target.x, y: target.y };
const distance = 850;
let isDragging = false;
let lastInteraction = 0;

canvas.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isDragging = true;
  lastInteraction = performance.now();
  mouseOnDown.x = -e.clientX;
  mouseOnDown.y = e.clientY;
  targetOnDown.x = target.x;
  targetOnDown.y = target.y;
  canvas.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  lastInteraction = performance.now();
  const zoomDamp = distance / 1000;
  target.x = targetOnDown.x + (-e.clientX - mouseOnDown.x) * 0.005 * zoomDamp;
  target.y = targetOnDown.y + (e.clientY - mouseOnDown.y) * 0.005 * zoomDamp;
  target.y = Math.max(-PI_HALF, Math.min(PI_HALF, target.y));
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = '';
});

// Touch (mobile)
canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  e.preventDefault();
  isDragging = true;
  lastInteraction = performance.now();
  mouseOnDown.x = -e.touches[0].clientX;
  mouseOnDown.y = e.touches[0].clientY;
  targetOnDown.x = target.x;
  targetOnDown.y = target.y;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  e.preventDefault();
  lastInteraction = performance.now();
  const zoomDamp = distance / 1000;
  target.x = targetOnDown.x + (-e.touches[0].clientX - mouseOnDown.x) * 0.005 * zoomDamp;
  target.y = targetOnDown.y + (e.touches[0].clientY - mouseOnDown.y) * 0.005 * zoomDamp;
  target.y = Math.max(-PI_HALF, Math.min(PI_HALF, target.y));
}, { passive: false });

canvas.addEventListener('touchend', () => { isDragging = false; });

/* ----------------------------------------------------------------
   Boucle de rendu — throttle 20fps
   ---------------------------------------------------------------- */
let lastFrame = 0;
let isVisible = false;
let animId = null;
let pulseTime = 0;

function animate(now) {
  animId = requestAnimationFrame(animate);
  if (!isVisible) return;
  if (now - lastFrame < FRAME_TIME) return;
  lastFrame = now;

  // Auto-rotation
  if (!isDragging && (now - lastInteraction > AUTO_ROTATE_DELAY)) {
    target.x += AUTO_ROTATE_SPEED;
  }

  // Easing rotation
  rotation.x += (target.x - rotation.x) * 0.1;
  rotation.y += (target.y - rotation.y) * 0.1;

  // Caméra orbite
  camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
  camera.position.y = distance * Math.sin(rotation.y);
  camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);
  camera.lookAt(scene.position);

  // Pulse Marseille
  pulseTime += 0.05;
  const s = 1 + 0.6 * Math.sin(pulseTime);
  ring.scale.set(s, s, s);
  ringMat.opacity = 0.7 * (1 - 0.5 * Math.sin(pulseTime));
  dotMat.opacity = 0.85 + 0.15 * Math.sin(pulseTime * 1.5);

  // Rendu double scène
  renderer.clear();
  renderer.render(scene, camera);
  renderer.render(sceneAtmosphere, camera);
}

/* ----------------------------------------------------------------
   IntersectionObserver
   ---------------------------------------------------------------- */
const observer = new IntersectionObserver(
  (entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animId) animId = requestAnimationFrame(animate);
  },
  { threshold: 0.1 }
);
observer.observe(canvas);
animId = requestAnimationFrame(animate);
