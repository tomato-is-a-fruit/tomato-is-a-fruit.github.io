/* ============================================
   TAB SWITCHING (project rail <-> panels)
   ============================================ */
const railItems = document.querySelectorAll(".rail__item");
const panels = document.querySelectorAll(".panel");

railItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.tab;

    railItems.forEach((i) => {
      i.classList.remove("is-active");
      i.setAttribute("aria-selected", "false");
    });
    item.classList.add("is-active");
    item.setAttribute("aria-selected", "true");

    panels.forEach((p) => {
      const match = p.id === `panel-${target}`;
      p.classList.toggle("is-active", match);
      p.hidden = !match;
    });

    // lazily boot the 3D viewer only once its panel is actually shown
    if (target === "3" && !viewerBooted) initViewer();
  });
});

/* ============================================
   MOBILE NAV
   ============================================ */
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav__links");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navLinks.style.display = open ? "none" : "flex";
  });
}

/* ============================================
   SCROLL REVEAL (subtle, respects reduced motion)
   ============================================ */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".section-head, .about__body, .contact__inner");
  revealTargets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

/* ============================================
   3D VIEWER (three.js) — Project 03 tab
   ============================================
   This ships with a placeholder procedural shape so the site works
   out of the box with zero assets. To show your own work instead:

   1. Export your model as .glb (Blender: File > Export > glTF 2.0)
   2. Drop it in an /assets folder next to index.html
   3. Add the GLTFLoader script tag in index.html:
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
   4. Replace the "placeholder mesh" block below with:
        const loader = new THREE.GLTFLoader();
        loader.load('assets/your-model.glb', (gltf) => {
          scene.add(gltf.scene);
        });
*/
let viewerBooted = false;

function initViewer() {
  viewerBooted = true;

  const canvas = document.getElementById("viewerCanvas");
  const container = document.getElementById("viewer3d");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(3.4, 2, 4.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  // lighting — warm key light echoes the burnt-orange accent
  const keyLight = new THREE.PointLight(0xe8763f, 2.4, 20);
  keyLight.position.set(4, 4, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x4a5a7a, 1.2, 20);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  scene.add(new THREE.AmbientLight(0x1a1715, 1.6));

  // --- placeholder mesh: swap for a GLTFLoader call, see notes above ---
  const geometry = new THREE.TorusKnotGeometry(1, 0.32, 180, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2c2620,
    metalness: 0.65,
    roughness: 0.3,
    emissive: 0x3a1a0d,
    emissiveIntensity: 0.15,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const wire = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xe8763f, wireframe: true, transparent: true, opacity: 0.12 })
  );
  wire.scale.setScalar(1.02);
  scene.add(wire);
  // --- end placeholder mesh ---

  let controls;
  if (typeof THREE.OrbitControls !== "undefined") {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.5;
    controls.maxDistance = 8;
    controls.enablePan = false;
  }

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  let frame;
  function animate() {
    frame = requestAnimationFrame(animate);
    if (!prefersReducedMotion) {
      mesh.rotation.y += 0.0025;
      wire.rotation.y += 0.0025;
    }
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
