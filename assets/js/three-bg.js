/* ═══════════════════════════════════════════════════════════
   YAHYA.DEV — THREE.JS BACKGROUND
   Deep space particle field + floating geometry
═══════════════════════════════════════════════════════════ */

'use strict';

window.addEventListener('load', () => {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  /* ── Mobile optimization — reduce particles & complexity ── */
  const isMobile  = window.innerWidth < 768;
  const isTablet  = window.innerWidth < 1100;
  const PARTICLE_COUNT = isMobile ? 600 : isTablet ? 1400 : 2800;
  const PIXEL_RATIO    = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
  const FLOATER_COUNT  = isMobile ? 0 : 4;

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(PIXEL_RATIO);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  /* ── Scene & Camera ── */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  /* ── Particle Field ── */
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(PARTICLE_COUNT * 3);
  const col   = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    pos[i3]   = (Math.random() - 0.5) * 90;
    pos[i3+1] = (Math.random() - 0.5) * 90;
    pos[i3+2] = (Math.random() - 0.5) * 90;

    sizes[i] = Math.random() * 0.04 + 0.02;

    const t = Math.random();
    if (t < 0.45) {
      // Indigo
      col[i3]=0.39; col[i3+1]=0.40; col[i3+2]=0.95;
    } else if (t < 0.7) {
      // Cyan
      col[i3]=0.024; col[i3+1]=0.714; col[i3+2]=0.831;
    } else if (t < 0.85) {
      // Purple
      col[i3]=0.659; col[i3+1]=0.333; col[i3+2]=0.969;
    } else {
      // White/near-white
      col[i3]=0.9; col[i3+1]=0.94; col[i3+2]=0.97;
    }
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* ── Floating Wireframe Geometries ── */
  const floaters = [];

  const geoShapes = FLOATER_COUNT > 0 ? [
    new THREE.IcosahedronGeometry(0.9, 1),
    new THREE.OctahedronGeometry(0.75, 0),
    new THREE.TetrahedronGeometry(0.65, 0),
    new THREE.TorusGeometry(0.6, 0.15, 8, 16),
  ] : [];

  const colors = [0x6366f1, 0x06b6d4, 0xa855f7, 0x818cf8];

  geoShapes.forEach((g, i) => {
    const m = new THREE.MeshBasicMaterial({
      color: colors[i],
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(
      (i % 2 === 0 ? -1 : 1) * (3 + i * 1.2),
      (Math.random() - 0.5) * 2,
      -3 - i * 0.5
    );
    scene.add(mesh);
    floaters.push(mesh);
  });

  /* ── Mouse Parallax ── */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ── Scroll Y ── */
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  /* ── Animation Loop ── */
  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += isMobile ? 0.001 : 0.002;

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Particles
    particles.rotation.y = targetX * 0.04 + t * 0.03 + scrollY * 0.00015;
    particles.rotation.x = targetY * 0.025;

    // Floaters
    floaters.forEach((mesh, i) => {
      mesh.rotation.x += 0.003 + i * 0.001;
      mesh.rotation.y += 0.005 + i * 0.0008;
      mesh.rotation.z += 0.001 + i * 0.0005;
      mesh.position.y  = Math.sin(t * 0.8 + i * 1.5) * 0.7;
      mesh.material.opacity = 0.035 + Math.sin(t + i) * 0.025;
    });

    renderer.render(scene, camera);
  })();
});
