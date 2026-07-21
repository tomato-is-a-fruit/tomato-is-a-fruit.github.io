import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const MODEL_PATH_PROJECT_1 = 'public/LHRCustomScreen.glb';
const MODEL_PATH_PROJECT_3 = 'public/Cryostat_TLA.glb';
const MODEL_PATH_PROJECT_5 = 'public/cat_lying.glb';

function createViewer(wrapId, emptyId, modelPath, rotationX = -Math.PI / 2, turntableSpeed = 0, showRotationDebug = false){
  const wrap = document.getElementById(wrapId);
  const emptyState = document.getElementById(emptyId);
  if (!wrap) return;

  let renderer, scene, camera, controls, model;

  function setupScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14181d);

    camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight || 1, 0.01, 2000);
    camera.position.set(2.5, 1.8, 2.5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    wrap.insertBefore(renderer.domElement, wrap.firstChild);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a2f36, 1.1));

    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(4, 6, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x88aaff, 0.6);
    fill.position.set(-4, -2, -3);
    scene.add(fill);

    const grid = new THREE.GridHelper(6, 24, 0x2c333c, 0x2c333c);
    grid.position.y = -0.001;
    scene.add(grid);

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      if (model) model.rotation.y += turntableSpeed * dt;
      controls.update();
      renderer.render(scene, camera);
    });

    window.addEventListener('resize', handleResize);
    new ResizeObserver(handleResize).observe(wrap);
  }

  function handleResize(){
    if (!renderer) return;
    const w = wrap.clientWidth || 1, h = wrap.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function frame(object){
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    object.scale.setScalar(1.6 / maxDim);

    box.setFromObject(object);
    box.getCenter(center);
    object.position.sub(center);

    const dist = 3.2;
    camera.position.set(dist * 0.6, dist * 0.45, dist * 0.6);
    camera.near = 0.01;
    camera.far = dist * 50;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0.15, 0);
    controls.update();
  }

  function setupRotationDebugUI(){
    const panel = document.createElement('div');
    panel.style.cssText = 'position:absolute;bottom:44px;right:10px;background:rgba(0,0,0,.72);color:#fff;padding:10px;border-radius:8px;font:11px/1.4 monospace;z-index:20;display:flex;flex-direction:column;gap:6px;user-select:none;';
    panel.innerHTML = `
      <div id="rot-readout-${wrapId}" style="text-align:center;">x:0° y:0° z:0°</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">
        ${['x','y','z'].map(axis => `
          <div style="display:flex;flex-direction:column;gap:3px;align-items:center;">
            <button data-axis="${axis}" data-dir="1" style="width:100%;background:#2c333c;color:#fff;border:1px solid #444;border-radius:4px;padding:3px 0;cursor:pointer;">${axis.toUpperCase()}+</button>
            <button data-axis="${axis}" data-dir="-1" style="width:100%;background:#2c333c;color:#fff;border:1px solid #444;border-radius:4px;padding:3px 0;cursor:pointer;">${axis.toUpperCase()}-</button>
          </div>`).join('')}
      </div>`;
    wrap.appendChild(panel);

    const readout = panel.querySelector(`#rot-readout-${wrapId}`);
    const deg = r => Math.round(r * 180 / Math.PI);
    const updateReadout = () => {
      readout.textContent = `x:${deg(model.rotation.x)}° y:${deg(model.rotation.y)}° z:${deg(model.rotation.z)}°`;
    };
    updateReadout();

    panel.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const axis = btn.dataset.axis;
        const dir = Number(btn.dataset.dir);
        model.rotation[axis] += dir * (Math.PI / 12); // 15 degree steps
        updateReadout();
      });
    });
  }

  function load(path) {
  setupScene();

  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  dracoLoader.setDecoderConfig({ type: 'js' });

  loader.setDRACOLoader(dracoLoader);

  loader.load(
    path,
    (gltf) => {
      model = gltf.scene;

      model.rotation.x = rotationX;

      model.traverse((n) => {
        if (n.isMesh) {
          n.castShadow = false;
          n.receiveShadow = false;

          if (n.material) {
            n.material.metalness = 0.5;
            n.material.roughness = 0.25;
            n.material.envMapIntensity = 1.2;
            n.material.needsUpdate = true;
          }
        }
      });

      scene.add(model);
      frame(model);

      if (emptyState) emptyState.style.display = 'none';

      if (showRotationDebug) setupRotationDebugUI();
    },
    undefined,
    (err) => {
      console.error('failed to load glb:', err);

      if (emptyState) {
        emptyState.querySelector('b').textContent = 'Could not load model';
        emptyState.querySelector('span').textContent = 'Check the model path in viewer.js and try again.';
        emptyState.style.display = 'flex';
      }
    }
  );
}

  if (modelPath){
    load(modelPath);
  } else {
    setupScene();
  }
}

createViewer('viewerWrap', 'viewerEmpty', MODEL_PATH_PROJECT_1);
createViewer('viewerWrap2', 'viewerEmpty2', MODEL_PATH_PROJECT_3);
createViewer('viewerWrap3', 'viewerEmpty3', MODEL_PATH_PROJECT_5, -Math.PI / 12, 0, false);