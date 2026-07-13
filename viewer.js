import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MODEL_PATH_PROJECT_1 = '/public/LHRCustomScreen.glb';
const MODEL_PATH_PROJECT_3 = '/public/Cryostat_TLA.glb';

function createViewer(wrapId, emptyId, modelPath){
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    wrap.insertBefore(renderer.domElement, wrap.firstChild);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a2f36, 1.1));

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x88aaff, 0.6);
    fill.position.set(-4, -2, -3);
    scene.add(fill);

    const grid = new THREE.GridHelper(6, 24, 0x2c333c, 0x2c333c);
    grid.position.y = -0.001;
    scene.add(grid);

    renderer.setAnimationLoop(() => {
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

  function load(path){
    setupScene();
    new GLTFLoader().load(path, (gltf) => {
      model = gltf.scene;

      model.rotation.x = -Math.PI / 2;

      model.traverse(n => {
        if (n.isMesh){ n.castShadow = false; n.receiveShadow = false; }
      });
      scene.add(model);
      frame(model);
      emptyState.style.display = 'none';
    }, undefined, (err) => {
      console.error('failed to load glb:', err);
      emptyState.querySelector('b').textContent = 'Could not load model';
      emptyState.querySelector('span').textContent = 'Check the model path in viewer.js and try again.';
      emptyState.style.display = 'flex';
    });
  }

  if (modelPath){
    load(modelPath);
  } else {
    setupScene();
  }
}

createViewer('viewerWrap', 'viewerEmpty', MODEL_PATH_PROJECT_1);
createViewer('viewerWrap2', 'viewerEmpty2', MODEL_PATH_PROJECT_3);
