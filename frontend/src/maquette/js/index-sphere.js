/* ================================================================
   FICHIER — index-sphere.js
   Sphère 3D Three.js avec particules et explosion au clic.
   ES module — communique via window._restartSphereAnim.
   Dépendances : Three.js (importmap), GSAP (global).

   OPTIMISÉ v3 (GPU Intel UHD 620) :
   - Bloom SUPPRIMÉ (5-8 passes GPU en moins)
   - Rendu direct renderer.render() (1 seule passe)
   - pixelRatio plafonné à 1
   - Throttle 30fps
   - Géométrie allégée (detail 6)
   - Lumière violette → verte (uniforme)
   - Émissivité renforcée pour compenser l'absence de bloom
   ================================================================ */
  import * as THREE from 'three';

  const config = {
    colors: {
      bg: 0x0A0F2E,       // deep-sky to match marsAI theme
      primary: 0x4EFFCE,   // aurora
      secondary: 0x4EFFCE, // même couleur que primary (violet supprimé)
      wireframe: 0x1A1F4E  // horizon
    }
  };

  const TARGET_FPS = 30;
  const FRAME_TIME = 1000 / TARGET_FPS;

  const canvas = document.querySelector('#webgl-canvas');
  if (!canvas) throw new Error('Canvas not found');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(config.colors.bg);
  scene.fog = new THREE.FogExp2(config.colors.bg, 0.035);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-1.2, 0, 6);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: false,
    powerPreference: "low-power",  // préférer économie d'énergie
    alpha: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1);  // plafonné à 1 (pas de hi-DPI — gros gain GPU)
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Core sphere — detail 6 au lieu de 10 (~2.5K vertices au lieu de ~10K)
  const geometryCore = new THREE.IcosahedronGeometry(2, 6);
  // MeshStandardMaterial — émissivité renforcée (compense l'absence de bloom)
  const materialCore = new THREE.MeshStandardMaterial({
    color: 0x050510,
    metalness: 0.85,
    roughness: 0.15,
    emissive: config.colors.primary,
    emissiveIntensity: 0.15
  });
  const sphereCore = new THREE.Mesh(geometryCore, materialCore);
  mainGroup.add(sphereCore);

  // Wireframe
  const geometryWire = new THREE.IcosahedronGeometry(2.2, 2);
  const materialWire = new THREE.MeshBasicMaterial({
    color: config.colors.primary,
    wireframe: true,
    transparent: true,
    opacity: 0.25,   // plus visible sans bloom
    side: THREE.DoubleSide
  });
  const sphereWire = new THREE.Mesh(geometryWire, materialWire);
  mainGroup.add(sphereWire);

  // Ambient particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 200;
  const posArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: config.colors.primary,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Explosion system — 2000 au lieu de 5000
  const explosionCount = 2000;
  const explosionGeo = new THREE.BufferGeometry();
  const initialPos = new Float32Array(explosionCount * 3);
  const targetPos = new Float32Array(explosionCount * 3);
  const currentPos = new Float32Array(explosionCount * 3);

  for (let i = 0; i < explosionCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / explosionCount);
    const theta = Math.sqrt(explosionCount * Math.PI) * phi;
    const r = 2.0;
    const x = r * Math.cos(theta) * Math.sin(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(phi);

    initialPos[i * 3] = x;
    initialPos[i * 3 + 1] = y;
    initialPos[i * 3 + 2] = z;
    currentPos[i * 3] = x;
    currentPos[i * 3 + 1] = y;
    currentPos[i * 3 + 2] = z;

    const dir = new THREE.Vector3(x, y, z).normalize();
    const dist = 2.0 + Math.random() * 6.0;
    targetPos[i * 3] = dir.x * dist;
    targetPos[i * 3 + 1] = dir.y * dist;
    targetPos[i * 3 + 2] = dir.z * dist;
  }

  explosionGeo.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));
  const explosionMaterial = new THREE.PointsMaterial({
    size: 0.05,  // légèrement plus gros pour compenser la réduction de quantité
    color: config.colors.primary,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const explosionSystem = new THREE.Points(explosionGeo, explosionMaterial);
  explosionSystem.visible = false;
  mainGroup.add(explosionSystem);

  // Lighting — 2 lumières vertes identiques (violet supprimé)
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const light1 = new THREE.PointLight(config.colors.primary, 150);
  light1.position.set(4, 2, 4);
  scene.add(light1);
  const light2 = new THREE.PointLight(config.colors.secondary, 150);
  light2.position.set(-4, -2, 2);
  scene.add(light2);

  // PAS de post-processing — rendu direct (1 passe au lieu de 6-8)

  // Interaction state
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let isHovered = false;
  let isAnimating = false;
  const animState = { progress: 0 };

  function updateExplosion() {
    const positions = explosionGeo.attributes.position.array;
    for (let i = 0; i < explosionCount; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      positions[ix] = initialPos[ix] + (targetPos[ix] - initialPos[ix]) * animState.progress;
      positions[iy] = initialPos[iy] + (targetPos[iy] - initialPos[iy]) * animState.progress;
      positions[iz] = initialPos[iz] + (targetPos[iz] - initialPos[iz]) * animState.progress;
      if (animState.progress > 0.01) {
        const angle = animState.progress * 0.5;
        const x = positions[ix], z = positions[iz];
        positions[ix] = x * Math.cos(angle) - z * Math.sin(angle);
        positions[iz] = x * Math.sin(angle) + z * Math.cos(angle);
      }
    }
    explosionGeo.attributes.position.needsUpdate = true;
  }

  // Mouse tracking + raycaster hover detection
  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;

    // Disable raycaster when sphere is invisible
    const op = parseFloat(canvas.style.opacity);
    if (op < 0.1) {
      if (isHovered) {
        document.body.style.cursor = 'default';
        isHovered = false;
      }
      return;
    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(sphereCore);

    if (intersects.length > 0) {
      if (!isHovered) {
        document.body.style.cursor = 'pointer';
        gsap.to(sphereWire.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.5 });
        gsap.to(sphereCore.material, { emissiveIntensity: 0.2, duration: 0.3 });
        isHovered = true;
      }
    } else {
      if (isHovered) {
        document.body.style.cursor = 'default';
        gsap.to(sphereWire.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(sphereCore.material, { emissiveIntensity: 0.05, duration: 0.3 });
        isHovered = false;
      }
    }
  });

  // Fonction d'explosion réutilisable (clic + scroll)
  function triggerExplosion() {
    if (isAnimating) return;
    const op = parseFloat(canvas.style.opacity);
    if (op < 0.1) return;

    isAnimating = true;

    // Masquer la sphère solide
    gsap.to([sphereCore.material, sphereWire.material], {
      opacity: 0, duration: 0.2,
      onComplete: () => { sphereCore.visible = false; sphereWire.visible = false; }
    });

    // Afficher les particules et exploser
    explosionSystem.visible = true;
    gsap.to(explosionMaterial, { opacity: 1, duration: 0.1 });

    gsap.to(animState, {
      progress: 1, duration: 1.5, ease: "power4.out",
      onUpdate: updateExplosion,
      onComplete: () => {
        // Reformation
        gsap.to(animState, {
          progress: 0, duration: 2, delay: 0.2, ease: "elastic.out(1, 0.5)",
          onUpdate: updateExplosion,
          onComplete: () => {
            sphereCore.visible = true;
            sphereWire.visible = true;
            gsap.to(explosionMaterial, { opacity: 0, duration: 0.3 });
            gsap.to([sphereCore.material, sphereWire.material], { opacity: 1, duration: 0.5 });
            sphereWire.material.opacity = 0.25;
            explosionSystem.visible = false;
            isAnimating = false;
          }
        });
      }
    });
  }

  // Clic sur la sphère — explosion
  window.addEventListener('click', () => {
    if (isHovered) triggerExplosion();
  });

  // Scroll — explosion chaque fois qu'on quitte le haut de page
  let scrollExploded = false;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // Quand on revient tout en haut, on réarme le déclencheur
    if (y <= 5) {
      scrollExploded = false;
      return;
    }
    // Dès qu'on commence à scroller vers le bas, on explose
    if (!scrollExploded && y > 30) {
      scrollExploded = true;
      triggerExplosion();
    }
  }, { passive: true });

  // Animation loop — throttle à 30fps
  const clock = new THREE.Clock();
  let sphereVisible = true;
  let animFrameId = null;
  let lastFrameTime = 0;

  function animate() {
    // Skip render when sphere is invisible (GPU perf)
    const canvasOpacity = parseFloat(canvas.style.opacity);
    if (canvasOpacity <= 0 && !isAnimating) {
      if (sphereVisible) { clock.stop(); sphereVisible = false; }
      animFrameId = null; // Stop the loop entirely
      return;
    }
    animFrameId = requestAnimationFrame(animate);
    if (!sphereVisible) { clock.start(); sphereVisible = true; }

    // Throttle à 30fps — skip les frames intermédiaires
    const now = performance.now();
    if (now - lastFrameTime < FRAME_TIME) return;
    lastFrameTime = now - ((now - lastFrameTime) % FRAME_TIME);

    const elapsedTime = clock.getElapsedTime();
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    mainGroup.rotation.y += 0.002;
    mainGroup.rotation.x += 0.001;
    mainGroup.rotation.y += 0.05 * (targetX - mainGroup.rotation.y);
    mainGroup.rotation.x += 0.05 * (targetY - mainGroup.rotation.x);

    if (!isAnimating) {
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.02;
      sphereWire.scale.set(scale, scale, scale);
    }

    light1.position.x = Math.sin(elapsedTime * 0.7) * 4;
    light1.position.y = Math.cos(elapsedTime * 0.5) * 4;
    light2.position.x = Math.cos(elapsedTime * 0.3) * 5;
    light2.position.z = Math.sin(elapsedTime * 0.5) * 5;

    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = -mouseY * 0.0002;

    renderer.render(scene, camera);
  }

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Expose a restart function so the scroll handler can resume the loop
  window._restartSphereAnim = function() {
    if (!animFrameId) animate();
  };

  // Init with entrance animation
  window.addEventListener('load', () => {
    lastFrameTime = performance.now();
    animate();
    gsap.from(sphereCore.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "elastic.out(1, 0.7)" });
    gsap.from(sphereWire.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "elastic.out(1, 0.7)", delay: 0.1 });
  });
