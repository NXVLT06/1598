/* =========================================================
   three-scene.js — Breathtaking WebGL Cosmic Universe
   ========================================================= */

(function () {
  let scene, camera, renderer;
  let stardust, bokehOrbs, cursorLight;
  let heroGem, gemRing1, gemRing2;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  function initThree() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene & Fog Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06030c, 0.0012);

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1200);
    camera.position.z = 450;

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Dynamic Cursor Following PointLight
    cursorLight = new THREE.PointLight(0xff7597, 2.5, 900);
    cursorLight.position.set(0, 0, 200);
    scene.add(cursorLight);

    const auroraLight = new THREE.PointLight(0xa855f7, 2, 800);
    auroraLight.position.set(-300, 200, 100);
    scene.add(auroraLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 1.8, 800);
    cyanLight.position.set(300, -200, 100);
    scene.add(cyanLight);

    // 5. Particle System 1: 3,500 Stardust Particles
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const starPalette = [
      new THREE.Color(0xff7597), // Rose Pink
      new THREE.Color(0xf43f5e), // Crimson
      new THREE.Color(0xff4081), // Magenta
      new THREE.Color(0xa855f7), // Violet
      new THREE.Color(0x00f2fe), // Cyan Blue
      new THREE.Color(0xffffff)  // Pure White
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3]     = (Math.random() - 0.5) * 1800;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1800;

      const col = starPalette[Math.floor(Math.random() * starPalette.length)];
      starColors[i * 3]     = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 3.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    stardust = new THREE.Points(starGeo, starMat);
    scene.add(stardust);

    // 6. Particle System 2: 120 Floating Soft Bokeh Spheres
    const bokehCount = 120;
    const bokehGroup = new THREE.Group();

    for (let i = 0; i < bokehCount; i++) {
      const radius = Math.random() * 8 + 4;
      const bGeo = new THREE.SphereGeometry(radius, 16, 16);
      const bCol = starPalette[Math.floor(Math.random() * starPalette.length)];
      const bMat = new THREE.MeshBasicMaterial({
        color: bCol,
        transparent: true,
        opacity: Math.random() * 0.35 + 0.15,
        blending: THREE.AdditiveBlending
      });

      const sphere = new THREE.Mesh(bGeo, bMat);
      sphere.position.set(
        (Math.random() - 0.5) * 1400,
        (Math.random() - 0.5) * 1400,
        (Math.random() - 0.5) * 800
      );
      bokehGroup.add(sphere);
    }
    bokehOrbs = bokehGroup;
    scene.add(bokehOrbs);

    // 7. Hero 3D Double-Ringed Rotating Crystal Gem
    const gemGroup = new THREE.Group();
    const gGeo = new THREE.OctahedronGeometry(42, 2);
    const gMat = new THREE.MeshPhongMaterial({
      color: 0xff7597,
      emissive: 0x9f1239,
      specular: 0xffffff,
      shininess: 100,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    heroGem = new THREE.Mesh(gGeo, gMat);
    gemGroup.add(heroGem);

    // Ring 1
    const r1Geo = new THREE.TorusGeometry(62, 1.2, 16, 100);
    const r1Mat = new THREE.MeshBasicMaterial({ color: 0xff4081, wireframe: true, transparent: true, opacity: 0.6 });
    gemRing1 = new THREE.Mesh(r1Geo, r1Mat);
    gemRing1.rotation.x = Math.PI / 3;
    gemGroup.add(gemRing1);

    // Ring 2
    const r2Geo = new THREE.TorusGeometry(78, 1.2, 16, 100);
    const r2Mat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.5 });
    gemRing2 = new THREE.Mesh(r2Geo, r2Mat);
    gemRing2.rotation.y = Math.PI / 4;
    gemGroup.add(gemRing2);

    gemGroup.position.set(0, 20, 0);
    scene.add(gemGroup);

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    animate();
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Smooth Camera Movement
    if (camera) {
      camera.position.x = targetX * 0.35;
      camera.position.y = -targetY * 0.35;
      camera.lookAt(scene.position);
    }

    // Dynamic Point Light Follows Cursor
    if (cursorLight) {
      cursorLight.position.x = targetX * 0.8;
      cursorLight.position.y = -targetY * 0.8;
    }

    // Stardust Rotation
    if (stardust) {
      stardust.rotation.y += 0.0009;
      stardust.rotation.x += 0.0004;
    }

    // Bokeh Orbs Pulse
    if (bokehOrbs) {
      bokehOrbs.rotation.y -= 0.0006;
      bokehOrbs.children.forEach((orb, i) => {
        orb.position.y += Math.sin(Date.now() * 0.001 + i) * 0.3;
      });
    }

    // Gem & Rings Rotation
    if (heroGem) heroGem.rotation.y += 0.012;
    if (gemRing1) gemRing1.rotation.z += 0.015;
    if (gemRing2) gemRing2.rotation.x += 0.018;

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  window.addEventListener('DOMContentLoaded', initThree);
})();
