import { MACHINES } from './machines.js';
import { initChatbot, loadCustomModels } from './chatbot.js';
window.ENGISIM_MACHINES = MACHINES;
window.machineHistory = []; // Stack to keep track of parent machines
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { db, collection, addDoc, serverTimestamp, doc, setDoc, deleteDoc } from './firebase.js';

let currentSession = {
  modelId: null,
  startTime: null,
  featuresUsed: new Set()
};

let heartbeatInterval = null;
let currentHeartbeatDoc = null;

async function startHeartbeat(modelId) {
  let uid = 'anonymous';
  if (window.currentUser) {
    uid = window.currentUser.uid;
  } else {
    if (!localStorage.getItem('engisim_anon_id')) {
      localStorage.setItem('engisim_anon_id', 'anon_' + Math.random().toString(36).substring(2, 10));
    }
    uid = localStorage.getItem('engisim_anon_id');
  }
  const sessionId = uid + '_' + Math.random().toString(36).substring(2, 8);
  const sessionRef = doc(db, 'model_active_sessions', sessionId);
  currentHeartbeatDoc = sessionRef;
  
  const beat = async () => {
    try {
      await setDoc(sessionRef, {
        modelId: modelId,
        uid: uid,
        last_active: serverTimestamp()
      }, { merge: true });
    } catch(e) {}
  };
  
  await beat();
  heartbeatInterval = setInterval(beat, 30000);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  if (currentHeartbeatDoc) {
    deleteDoc(currentHeartbeatDoc).catch(() => {});
    currentHeartbeatDoc = null;
  }
}

function logAnalytics() {
  stopHeartbeat();
  if (currentSession.modelId && currentSession.startTime) {
    const duration = Math.floor((Date.now() - currentSession.startTime) / 1000);
    if (duration >= 1) {
       let uid = 'anonymous';
       if (window.currentUser) {
         uid = window.currentUser.uid;
       } else {
         if (!localStorage.getItem('engisim_anon_id')) {
           localStorage.setItem('engisim_anon_id', 'anon_' + Math.random().toString(36).substring(2, 10));
         }
         uid = localStorage.getItem('engisim_anon_id');
       }
       addDoc(collection(db, 'model_analytics'), {
         modelId: currentSession.modelId,
         userId: uid,
         durationSeconds: duration,
         featuresUsed: Array.from(currentSession.featuresUsed),
         timestamp: serverTimestamp()
       }).catch(e => console.error("Analytics error", e));
    }
  }
}
window.addEventListener('beforeunload', logAnalytics);
// ======================================================================
// EngiSim 3D - Core Application
// Three.js scene, controls, modes, and machine management
// ======================================================================









// Batch 12: Geology

// Batch 12: Robotics

// Batch 12: Thermodynamics

// Batch 12: Optics

// Batch 12: Acoustics

// Batch 13: Environmental

// Batch 13: Biotechnology

// Batch 13: Materials

// Batch 13: Quantum

// Batch 13: Civil

// Batch 14: Marine

// Batch 14: Aerospace

// Batch 14: Petrochemical

// Batch 14: Anatomy

// Batch 14: Botany

// --- Batch 26 ---





// --- Batch 27 ---





// --- Batch 28 ---





// --- Batch 29 ---





// --- Batch 30 ---





// --- Batch 31 ---





// --- Batch 32 ---





// --- Batch 33 ---





// --- Batch 34 ---





// --- Batch 35 ---





// --- Batch 36 ---





// --- Batch 37 ---





// --- Batch 38 ---





// --- Batch 39 ---






// --- Batch 59 ---

// --- Batch 58 ---





// --- Batch 57 ---





// --- Batch 56 ---





// --- Batch 55 ---





// --- Batch 54 ---





// --- Batch 53 ---





// --- Batch 52 ---





// --- Batch 51 ---





// --- Batch 50 ---





// --- Batch 49 ---





// --- Batch 48 ---





// --- Batch 47 ---





// --- Batch 46 ---





// --- Batch 45 ---





// --- Batch 44 ---





// --- Batch 43 ---





// --- Batch 42 ---





// --- Batch 41 ---





// --- Batch 40 ---





// --- Batch 24 ---





// --- Batch 25 ---







window.loadMachineById = function(id) { const m = window.ENGISIM_MACHINES.find(x => x.id === id); if (m) loadMachine(m); };

const CATEGORY_MAP = {
  aerodynamics: 'machine-list-aerodynamics',
  propulsion_systems: 'machine-list-propulsion_systems',
  orbital_mechanics: 'machine-list-orbital_mechanics',
  avionics: 'machine-list-avionics',
  spacecraft_engineering: 'machine-list-spacecraft_engineering',
  botany: 'machine-list-botany',
  zoology: 'machine-list-zoology',
  geology: 'machine-list-geology',
  oceanography: 'machine-list-oceanography',
  climatology: 'machine-list-climatology',
  seismology: 'machine-list-seismology',
  volcanology: 'machine-list-volcanology',
  computer_architecture: 'machine-list-computer_architecture',
  networking: 'machine-list-networking',
  cryptography: 'machine-list-cryptography',
  artificial_intelligence: 'machine-list-artificial_intelligence',
  operating_systems: 'machine-list-operating_systems',
  virology: 'machine-list-virology',
  epidemiology: 'machine-list-epidemiology',
  oncology: 'machine-list-oncology',
  cytology: 'machine-list-cytology',
  histology: 'machine-list-histology',
  molecular_biology: 'machine-list-molecular_biology',
  anatomy: 'machine-list-anatomy',
  quantum_physics: 'machine-list-quantum_physics',
  nanotechnology: 'machine-list-nanotechnology',
  astrophysics: 'machine-list-astrophysics',
  meteorology: 'machine-list-meteorology',
  pharmacology: 'machine-list-pharmacology',
  microbiology: 'machine-list-microbiology',
  mechanical: 'machine-list-mechanical',
  electrical: 'machine-list-electrical',
  thermal: 'machine-list-thermal',
  aerospace: 'machine-list-aerospace',
  engines: 'machine-list-engines',
  advanced: 'machine-list-advanced',
  robotics: 'machine-list-robotics',
  thermodynamics: 'machine-list-thermodynamics',
  optics: 'machine-list-optics',
  acoustics: 'machine-list-acoustics',
  environmental: 'machine-list-environmental',
  materials: 'machine-list-materials',
  quantum: 'machine-list-quantum',
  civil: 'machine-list-civil',
  marine: 'machine-list-marine',
  petrochemical: 'machine-list-petrochemical',
  biology: 'machine-list-biology',
  organic_chemistry: 'machine-list-organic_chemistry',
  synthetic_biology: 'machine-list-synthetic_biology',
  genetics: 'machine-list-genetics',
  immunology: 'machine-list-immunology',
  biochemistry: 'machine-list-biochemistry',
  chemistry: 'machine-list-chemistry',
  neuroscience: 'machine-list-neuroscience',
  biotechnology: 'machine-list-biotechnology',
  marine_biology: 'machine-list-marine_biology',
  ecology: 'machine-list-ecology',
  paleontology: 'machine-list-paleontology'
};

// STATE
const state = {
  currentMode: 'explore',
  currentMachine: null,
  currentMachineData: null,
  selectedPartIndex: -1,
  damagedParts: new Set(),
  assemblyStep: 0,
  quizState: { score: 0, streak: 0, current: 0, total: 0, difficulty: 'basic', questions: [], answered: false },
  explodeFactor: 0,
  animSpeed: 1,
  wireframe: false,
  showLabels: false,
  animating: true,
};

// THREE.JS SETUP
let scene, camera, renderer, controls, raycaster, mouse;
let machineGroup = null;
let partMeshes = [];      // Array of { mesh, originalMat, partData }
let clock = new THREE.Clock();
let currentMixer = null;

function initThree() {
  const canvas = document.getElementById('three-canvas');
  const viewport = document.getElementById('viewport');

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0e1a, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(50, viewport.clientWidth / viewport.clientHeight, 0.1, 10000);
  camera.position.set(6, 4, 8);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Ultra High Quality Environment Map
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1;
  controls.maxDistance = 30;
  controls.target.set(0, 0, 0);

  // Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Lighting
  setupLighting();

  // Grid + Ground
  setupEnvironment();

  // Events
  window.addEventListener('resize', onResize);
  canvas.addEventListener('click', onCanvasClick);
  canvas.addEventListener('mousemove', onCanvasMouseMove);

  updateLoader(70, 'Setting up scene...');
}

function setupLighting() {
  // Ambient
  const ambient = new THREE.AmbientLight(0x334466, 0.6);
  scene.add(ambient);

  // Hemisphere
  const hemi = new THREE.HemisphereLight(0x88aacc, 0x333355, 0.5);
  scene.add(hemi);

  // Main directional
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(8, 12, 6);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  dir.shadow.camera.near = 0.5;
  dir.shadow.camera.far = 50;
  dir.shadow.camera.left = -15;
  dir.shadow.camera.right = 15;
  dir.shadow.camera.top = 15;
  dir.shadow.camera.bottom = -15;
  scene.add(dir);

  // Fill light
  const fill = new THREE.DirectionalLight(0x6688cc, 0.4);
  fill.position.set(-5, 3, -5);
  scene.add(fill);

  // Rim light
  const rim = new THREE.DirectionalLight(0x88aaff, 0.3);
  rim.position.set(-3, 8, -8);
  scene.add(rim);
}

function setupEnvironment() {
  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(60, 60);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0d1117, metalness: 0.3, roughness: 0.8
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  ground.userData.isGround = true;
  scene.add(ground);

  // Grid
  const grid = new THREE.GridHelper(40, 80, 0x1a2744, 0x111827);
  grid.material.opacity = 0.3;
  grid.material.transparent = true;
  scene.add(grid);
}

// LOADING
function updateLoader(percent, status) {
  const fill = document.getElementById('loader-fill');
  const statusEl = document.getElementById('loader-status');
  if (fill) fill.style.width = percent + '%';
  if (statusEl) statusEl.textContent = status;
}

function hideLoader() {
  const ls = document.getElementById('loading-screen');
  if (ls) {
      ls.classList.add('fade-out');
      document.getElementById('app').classList.remove('hidden');
      onResize();
      setTimeout(() => ls.style.display = 'none', 800);
  }
}

// MACHINE LOADING
// Garbage collection helper
function disposeNode(node) {
  if (node.geometry) {
    node.geometry.dispose();
  }
  if (node.material) {
    if (Array.isArray(node.material)) {
      node.material.forEach(m => m.dispose());
    } else {
      node.material.dispose();
    }
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      disposeNode(node.children[i]);
    }
  }
}

async function loadMachine(machineEntry) {
  // Log previous machine session if switching
  logAnalytics();
  currentSession = {
    modelId: machineEntry.id,
    startTime: Date.now(),
    featuresUsed: new Set()
  };
  startHeartbeat(machineEntry.id);

  if (machineEntry.isPremium && !window.currentUserIsPremium) {
    alert('This is a Premium model. Please sign in and upgrade to Premium to view it.');
    if (document.getElementById('grid-view')) {
      document.getElementById('grid-view').style.display = 'grid';
      document.getElementById('simulation-view').style.display = 'none';
      if (document.getElementById('machine-title')) {
         document.getElementById('machine-title').innerText = 'Select a Machine';
      }
    }
    return;
  }
  // Clear previous and aggressively GC
  if (machineGroup) {
    disposeNode(machineGroup);
    scene.remove(machineGroup);
    machineGroup = null;
  }
  partMeshes = [];
  state.selectedPartIndex = -1;

    const learningTab = document.querySelector('[data-tab="learning"]');
    const isLearningMode = learningTab ? learningTab.classList.contains('active') : false;
    
    // Inject mock learning data (Sub-Phase 6A)
    const difficulties = ['🟢 Beginner', '🟡 Intermediate', '🔴 Advanced'];
    const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    const elTitle = document.getElementById('learn-title');
    const elDiff = document.getElementById('learn-difficulty');
    const elWhat = document.getElementById('learn-what');
    const elHow = document.getElementById('learn-how');
    const elApps = document.getElementById('learn-apps');
    const elAdv = document.getElementById('learn-adv');
    const elDisadv = document.getElementById('learn-disadv');
    const elHistory = document.getElementById('learn-history');
    const elFuture = document.getElementById('learn-future');
    
    if (elTitle) elTitle.innerText = machineEntry.name;
    if (elDiff) elDiff.innerText = diff;
    if (elWhat) elWhat.innerText = "This is a detailed 3D simulation of " + machineEntry.name + ".";
    if (elHow) elHow.innerText = "It operates using principles of " + machineEntry.category.replace(/_/g, ' ') + ". Components interact dynamically to transfer energy or process inputs.";
    if (elApps) elApps.innerText = "Used heavily in modern industry, research, and educational simulations.";
    if (elAdv) elAdv.innerText = "Highly efficient, reliable design, widely used in industry and research.";
    if (elDisadv) elDisadv.innerText = "Complex to manufacture, requires regular maintenance and calibration.";
    if (elHistory) elHistory.innerText = "Developed over decades of engineering innovation, evolving from early prototypes to modern high-precision systems.";
    if (elFuture) elFuture.innerText = "Next-generation designs incorporating AI optimization, advanced materials, and improved energy efficiency.";

    // Clear clipping planes / explosions
    resetExplosion();
    resetCrossSection();

    const btnQuiz = document.getElementById('btn-take-quiz');
    if (btnQuiz) {
        btnQuiz.onclick = () => {
            window.location.href = 'quiz.html?model=' + machineEntry.id;
        };
    }

  state.damagedParts.clear();
  state.assemblyStep = 0;
  state.explodeFactor = 0;

  // Create machine
  let createFn = machineEntry.create;
  if (machineEntry.importPath) {
    try {
      const mod = await import(machineEntry.importPath);
      createFn = mod.createMachine || mod[machineEntry.importName] || mod.default;
    } catch (importErr) {
      console.error('Failed to import module:', machineEntry.importPath, importErr);
    }
  }
  if (typeof createFn !== 'function') {
    console.error('No create function for:', machineEntry.id, machineEntry.importName);
    const learnDesc = document.getElementById('learn-description');
    if (learnDesc) learnDesc.textContent = 'Error: Could not load model "' + machineEntry.name + '". The model file may be corrupted.';
    return;
  }
  const data = createFn(THREE, machineEntry.id);
  // Auto-generate parts array if missing (for batch-created machines)
  let actualGroup = data.group || data.model || data;
  if (data && !data.parts && actualGroup && actualGroup.children) {
    data.parts = [];
    actualGroup.children.forEach((child, i) => {
      data.parts.push({ name: child.name || ('Part ' + (i+1)), material: 'Composite', function: 'Component' });
    });
  }
  if (!data.description) data.description = machineEntry.name + ' - Interactive 3D Model';
  state.currentMachine = machineEntry;
  state.currentMachineData = data;

  machineGroup = actualGroup;
  machineGroup.position.set(0, 0, 0);
  scene.add(machineGroup);

  // Gather all part meshes
  data.parts.forEach((partData, idx) => {
    const mesh = machineGroup.children[idx];
    if (mesh) {
      mesh.userData.partIndex = idx;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // Store original materials recursively
      const origMats = [];
      mesh.traverse(child => {
        if (child.isMesh) {
          const clonedMat = Array.isArray(child.material)
            ? child.material.map(m => m.clone())
            : child.material.clone();
          origMats.push({ mesh: child, mat: clonedMat });
        }
      });
      partMeshes.push({ group: mesh, originalMats: origMats, partData, idx });
    }
  });

  // Center camera on machine
  const box = new THREE.Box3().setFromObject(machineGroup);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const dist = maxDim > 0 && maxDim < 10000 ? maxDim * 2.5 : 10;
  
  if (scene.fog) {
      scene.fog.density = 0.015 * (10 / Math.max(dist, 10));
  }

  if (isFinite(center.x)) controls.target.copy(center);
  if (isFinite(dist)) camera.position.set(center.x + dist * 0.6, center.y + dist * 0.4, center.z + dist * 0.7);
  controls.update();

  // Update UI
  updateMachineUI(machineEntry, data);
  updatePartsList(data);

  // Set up AnimationMixer for batch machines with animationClips
  if (currentMixer) { currentMixer.stopAllAction(); currentMixer = null; }
  if (data.animationClips && data.animationClips.length > 0) {
    currentMixer = new THREE.AnimationMixer(machineGroup);
    data.animationClips.forEach(clip => {
      const action = currentMixer.clipAction(clip);
      action.play();
    });
  }

  // Show hint
  const hint = document.getElementById('viewport-hint');
  if (hint) {
    hint.classList.remove('hidden');
    setTimeout(() => hint.classList.add('hidden'), 4000);
  }

  // Update stat counter
  const statMachines = document.getElementById('stat-machines'); if (statMachines) statMachines.textContent = MACHINES.length;
  const statParts = document.getElementById('stat-parts');
  if (statParts) statParts.textContent = data.parts.length;
}

// UI UPDATES
function updateMachineUI(entry, data) {
  document.getElementById('machine-title').textContent = entry.name;
  document.getElementById('machine-description').textContent = data.description;
  const badge = document.getElementById('machine-category-badge');
  if (badge) {
      badge.textContent = entry.category.toUpperCase();
      badge.classList.remove('hidden');
  }

  // Handle Back Button for Sub-Machine Navigation
  const backBtn = document.getElementById('btn-back-history');
  if (backBtn) {
      if (window.machineHistory.length > 0) {
          backBtn.classList.remove('hidden');
          // Avoid multiple listeners
          backBtn.onclick = () => {
              const parentId = window.machineHistory.pop();
              window.loadMachineById(parentId);
          };
      } else {
          backBtn.classList.add('hidden');
      }
  }
}

function updatePartsList(data) {
  const ul = document.getElementById('parts-list-ul');
  if (!ul) return;
  ul.innerHTML = '';
  data.parts.forEach((p, i) => {
    const li = document.createElement('li');
    const color = partMeshes[i] ? getPartColor(i) : '#888';
    li.innerHTML = `<span class="part-dot" style="background:${color}"></span>${p.name}`;
    li.addEventListener('click', () => selectPart(i));
    ul.appendChild(li);
  });
}

function getPartColor(idx) {
  if (!partMeshes[idx]) return '#888';
  const mats = partMeshes[idx].originalMats;
  if (mats.length > 0 && mats[0].mat.color) {
    return '#' + mats[0].mat.color.getHexString();
  }
  return '#888';
}

function selectPart(idx) {
  state.selectedPartIndex = idx;
  const data = state.currentMachineData;
  if (!data) return;

  const part = data.parts[idx];

  // Update info panel
  const info = document.getElementById('part-info');
  if (info) {
      info.classList.remove('hidden');
      document.getElementById('part-name').textContent = part.name;
      document.getElementById('part-material').textContent = part.material || 'N/A';
      document.getElementById('part-function').textContent = part.function || 'N/A';
      document.getElementById('part-connections').textContent = (part.connections || []).join(', ') || 'None';
      document.getElementById('part-failure').textContent = part.failureEffect || 'N/A';
      document.getElementById('part-description').textContent = part.description || '';

      // Sub-Machine linking logic
      let subMachineBtn = document.getElementById('btn-explore-submachine');
      if (subMachineBtn) subMachineBtn.remove();
      
      const normalizedPartName = part.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchedMachine = window.ENGISIM_MACHINES.find(m => m.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedPartName || m.id.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedPartName);
      
      if (matchedMachine && matchedMachine.id !== state.currentMachineData.id) {
          subMachineBtn = document.createElement('button');
          subMachineBtn.id = 'btn-explore-submachine';
          subMachineBtn.className = 'btn btn-primary';
          subMachineBtn.style.marginTop = '10px';
          subMachineBtn.style.width = '100%';
          subMachineBtn.textContent = `Explore ${matchedMachine.name} ➡️`;
          subMachineBtn.onclick = () => {
              window.machineHistory.push(state.currentMachineData.id);
              window.loadMachineById(matchedMachine.id);
          };
          info.appendChild(subMachineBtn);
      }
  }

  // Highlight in list
  const items = document.querySelectorAll('#parts-list-ul li');
  items.forEach((li, i) => li.classList.toggle('active', i === idx));

  // Apply transparency to other parts
  applyPartHighlight(idx);

  // Handle mode-specific clicks
  if (state.currentMode === 'damage') {
    toggleDamage(idx);
  } else if (state.currentMode === 'assemble') {
    handleAssemblyClick(idx);
  }
}

function applyPartHighlight(activeIdx) {
  partMeshes.forEach(({ group, originalMats, idx }) => {
    group.traverse(child => {
      if (child.isMesh) {
        if (idx === activeIdx) {
          // Restore original material
          const orig = originalMats.find(o => o.mesh === child);
          if (orig) child.material = orig.mat.clone();
          // Add emissive glow
          if (child.material.emissive) {
            child.material.emissive.set(0x38bdf8);
            child.material.emissiveIntensity = 0.15;
          }
        } else {
          // Make transparent
          child.material = ghostMaterial.clone();
        }
      }
    });
  });
}

function clearHighlight() {
  state.selectedPartIndex = -1;
  const info = document.getElementById('part-info');
  if (info) info.classList.add('hidden');
  const items = document.querySelectorAll('#parts-list-ul li');
  items.forEach(li => li.classList.remove('active'));

  // Restore all materials
  partMeshes.forEach(({ group, originalMats }) => {
    group.traverse(child => {
      if (child.isMesh) {
        const orig = originalMats.find(o => o.mesh === child);
        if (orig) child.material = orig.mat.clone();
      }
    });
  });

  // Re-apply damage visuals if in damage mode
  if (state.currentMode === 'damage') {
    applyDamageVisuals();
  }
}

// RAYCASTING / INTERACTION
function onCanvasClick(e) {
  if (!machineGroup) return;

  const viewport = document.getElementById('viewport');
  const rect = viewport.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const allMeshes = [];
  machineGroup.traverse(c => { if (c.isMesh && !c.userData.isGround) allMeshes.push(c); });

  const intersects = raycaster.intersectObjects(allMeshes, false);
  if (intersects.length > 0) {
    // Find which part group this mesh belongs to
    let obj = intersects[0].object;
    while (obj.parent && obj.parent !== machineGroup) obj = obj.parent;
    const idx = machineGroup.children.indexOf(obj);
    if (idx >= 0) {
      selectPart(idx);
    }
  } else {
    clearHighlight();
  }
}

function onCanvasMouseMove(e) {
  if (!machineGroup) return;

  const viewport = document.getElementById('viewport');
  const rect = viewport.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const allMeshes = [];
  machineGroup.traverse(c => { if (c.isMesh) allMeshes.push(c); });

  const intersects = raycaster.intersectObjects(allMeshes, false);
  const tooltip = document.getElementById('part-tooltip');

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj.parent && obj.parent !== machineGroup) obj = obj.parent;
    const idx = machineGroup.children.indexOf(obj);
    if (idx >= 0 && state.currentMachineData) {
      const part = state.currentMachineData.parts[idx];
      tooltip.textContent = part.name;
      tooltip.style.left = e.clientX + 'px';
      tooltip.style.top = (e.clientY - rect.top) + 'px';
      tooltip.classList.remove('hidden');
      document.getElementById('three-canvas').style.cursor = 'pointer';
      return;
    }
  }
  tooltip.classList.add('hidden');
  document.getElementById('three-canvas').style.cursor = 'grab';
}

// MODE MANAGEMENT
function setMode(mode) {
    state.currentMode = mode;
    
    // Track feature usage for analytics
    if (['quiz', 'animate', 'explode', 'cross_section'].includes(mode)) {
        currentSession.featuresUsed.add(mode);
    }
  
    // Update toolbar buttons
  document.querySelectorAll('.mode-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.mode === mode));

  // Show/hide panels
  document.querySelectorAll('.panel-section').forEach(p => p.classList.add('hidden'));
  const panelMap = {
    explore: 'panel-explore',
    explode: 'panel-explore',
    animate: 'panel-explore',
    damage: 'panel-damage',
    assemble: 'panel-assemble',
    quiz: 'panel-quiz',
  };
  const target = document.getElementById(panelMap[mode]);
  if (target) target.classList.remove('hidden');

  // Show/hide controls
  const speedControl = document.getElementById('speed-control');
  if (speedControl) speedControl.classList.toggle('hidden', mode !== 'animate');
  const explodeControl = document.getElementById('explode-control');
  if (explodeControl) explodeControl.classList.toggle('hidden', mode !== 'explode');

  // Reset visuals
  clearHighlight();

  // Mode-specific init
  if (mode === 'explode') {
    const slider = document.getElementById('explode-slider');
    if (slider) slider.value = state.explodeFactor;
  }
  if (mode === 'damage') {
    state.damagedParts.clear();
    updateDamageUI();
    generatePermutations();
  }
  if (mode === 'assemble') {
    initAssemblyMode();
  }
  if (mode === 'quiz') {
    initQuizPanel();
  }
  if (mode !== 'explode') {
    state.explodeFactor = 0;
    applyExplode(0);
  }
}

// EXPLODE MODE
function applyExplode(factor) {
  if (!state.currentMachineData || !state.currentMachineData.parts) return;
  const data = state.currentMachineData;

  partMeshes.forEach(({ group, idx }) => {
    if (!data.parts[idx]) return;
    const ep = data.parts[idx].explodedPosition;
    const op = data.parts[idx].originalPosition || new THREE.Vector3();
    if (ep) {
      group.position.lerpVectors(
        new THREE.Vector3(op.x || 0, op.y || 0, op.z || 0),
        new THREE.Vector3(ep.x, ep.y, ep.z),
        factor
      );
    }
  });
}

// DAMAGE SIMULATION
function toggleDamage(idx) {
  if (state.damagedParts.has(idx)) {
    state.damagedParts.delete(idx);
  } else if (state.damagedParts.size < 2) {
    state.damagedParts.add(idx);
  }
  updateDamageUI();
  applyDamageVisuals();
}

function applyDamageVisuals() {
  partMeshes.forEach(({ group, originalMats, idx }) => {
    group.traverse(child => {
      if (child.isMesh) {
        if (state.damagedParts.has(idx)) {
          child.material = damagedOverlay.clone();
        } else {
          const orig = originalMats.find(o => o.mesh === child);
          if (orig) child.material = orig.mat.clone();
        }
      }
    });
  });

  // Also highlight cascade-affected parts
  if (state.currentMachineData) {
    const cascadeAffected = getCascadeAffected();
    partMeshes.forEach(({ group, idx }) => {
      if (cascadeAffected.has(idx) && !state.damagedParts.has(idx)) {
        group.traverse(child => {
          if (child.isMesh) {
            child.material = child.material.clone();
            if (child.material.emissive) {
              child.material.emissive.set(0xffa500);
              child.material.emissiveIntensity = 0.4;
            }
            child.material.transparent = true;
            child.material.opacity = 0.7;
          }
        });
      }
    });
  }
}

function getCascadeAffected() {
  const affected = new Set();
  if (!state.currentMachineData) return affected;
  const parts = state.currentMachineData.parts;

  state.damagedParts.forEach(dmgIdx => {
    const dmgPart = parts[dmgIdx];
    if (dmgPart.cascadeFailures) {
      dmgPart.cascadeFailures.forEach(name => {
        const idx = parts.findIndex(p => p.name === name);
        if (idx >= 0) affected.add(idx);
      });
    }
  });
  return affected;
}

function updateDamageUI() {
  const container = document.getElementById('damaged-parts-list');
  const analysisDiv = document.getElementById('damage-analysis');
  const cascadeDiv = document.getElementById('cascade-result');

  if (!container || !state.currentMachineData) return;
  const parts = state.currentMachineData.parts;

  // Show damaged tags
  container.innerHTML = '';
  state.damagedParts.forEach(idx => {
    const tag = document.createElement('span');
    tag.className = 'damaged-tag';
    tag.textContent = ' ' + parts[idx].name;
    container.appendChild(tag);
  });

  // Show cascade analysis
  if (state.damagedParts.size > 0 && analysisDiv) {
    analysisDiv.classList.remove('hidden');
    cascadeDiv.innerHTML = '';

    state.damagedParts.forEach(idx => {
      const part = parts[idx];
      const item = document.createElement('div');
      item.className = 'cascade-item';
      item.innerHTML = `<span class="cascade-arrow"></span>
        <span class="cascade-text"><strong>${part.name}</strong> failure: ${part.failureEffect || 'System degradation'}</span>`;
      cascadeDiv.appendChild(item);

      if (part.cascadeFailures) {
        part.cascadeFailures.forEach(name => {
          const cascadePart = parts.find(p => p.name === name);
          const sub = document.createElement('div');
          sub.className = 'cascade-item';
          sub.innerHTML = `<span class="cascade-arrow"></span>
            <span class="cascade-text">Cascades to <strong>${name}</strong>: ${cascadePart?.failureEffect || 'Performance degraded'}</span>`;
          cascadeDiv.appendChild(sub);
        });
      }
    });
  } else if (analysisDiv) {
    analysisDiv.classList.add('hidden');
  }
}

function generatePermutations() {
  const permDiv = document.getElementById('permutation-list');
  if (!permDiv) return;
  if (!state.currentMachineData) { permDiv.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">Load a machine first</p>'; return; }
  const parts = state.currentMachineData.parts;
  const activePerm = document.querySelector('.perm-controls .active');
  const permType = activePerm ? activePerm.dataset.perm : 'single';

  permDiv.innerHTML = '';

  if (permType === 'single') {
    parts.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'perm-item';
      div.innerHTML = `<div class="perm-parts"> ${p.name}</div><div class="perm-effect">${p.failureEffect || 'System affected'}</div>`;
      div.addEventListener('click', () => {
        state.damagedParts.clear();
        state.damagedParts.add(i);
        updateDamageUI();
        applyDamageVisuals();
      });
      permDiv.appendChild(div);
    });
  } else {
    // Double combinations
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const div = document.createElement('div');
        div.className = 'perm-item';
        const combinedEffect = `${parts[i].failureEffect || 'Degraded'} + ${parts[j].failureEffect || 'Degraded'}`;
        div.innerHTML = `<div class="perm-parts"> ${parts[j].name}</div><div class="perm-effect">${combinedEffect}</div>`;
        div.addEventListener('click', () => {
          state.damagedParts.clear();
          state.damagedParts.add(i);
          state.damagedParts.add(j);
          updateDamageUI();
          applyDamageVisuals();
        });
        permDiv.appendChild(div);
      }
    }
  }
}

// ASSEMBLY MODE
function initAssemblyMode() {
  if (!state.currentMachineData) return;
  state.assemblyStep = 0;
  const parts = state.currentMachineData.parts;
  const sorted = [...parts].sort((a, b) => (a.assemblyOrder || 0) - (b.assemblyOrder || 0));

  // Hide all parts initially
  partMeshes.forEach(({ group }) => group.visible = false);

  updateAssemblyUI(sorted);
}

function handleAssemblyClick(clickedIdx) {
  if (!state.currentMachineData) return;
  const parts = state.currentMachineData.parts;
  const sorted = [...parts].sort((a, b) => (a.assemblyOrder || 0) - (b.assemblyOrder || 0));

  if (state.assemblyStep >= sorted.length) return;

  const expected = sorted[state.assemblyStep];
  const expectedIdx = parts.indexOf(expected);

  if (clickedIdx === expectedIdx) {
    // Correct!
    partMeshes[clickedIdx].group.visible = true;
    // Restore materials for this part
    partMeshes[clickedIdx].group.traverse(child => {
      if (child.isMesh) {
        const orig = partMeshes[clickedIdx].originalMats.find(o => o.mesh === child);
        if (orig) child.material = orig.mat.clone();
      }
    });
    state.assemblyStep++;
    updateAssemblyUI(sorted);
  }

  // Show all parts as ghosted so user can click correct one
  partMeshes.forEach(({ group, idx }) => {
    if (!group.visible) {
      group.visible = true;
      group.traverse(child => {
        if (child.isMesh) child.material = ghostMaterial.clone();
      });
    }
  });
}

function updateAssemblyUI(sorted) {
  const total = sorted.length;
  const step = state.assemblyStep;

  const fill = document.getElementById('assembly-fill');
  if (fill) fill.style.width = `${(step / total) * 100}%`;
  const counter = document.getElementById('assembly-step-counter');
  if (counter) counter.textContent = `Step ${step} / ${total}`;

  const instruction = document.getElementById('assembly-instruction');
  if (instruction) {
    if (step < total) {
      instruction.innerHTML = `<p>Click on: <strong style="color:var(--accent)">${sorted[step].name}</strong></p>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">${sorted[step].description || ''}</p>`;
    } else {
      instruction.innerHTML = `<p style="color:var(--success)"> Assembly Complete! All ${total} parts assembled correctly.</p>`;
    }
  }

  // Update step list
  const list = document.getElementById('assembly-order-list');
  if (list) {
      list.innerHTML = '';
      sorted.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = `assembly-step ${i < step ? 'completed' : ''} ${i === step ? 'current' : ''}`;
        div.innerHTML = `<span class="step-num">${i < step ? '' : i + 1}</span><span class="step-name">${p.name}</span>`;
        list.appendChild(div);
      });
  }
}

// QUIZ MODE
function initQuizPanel() {
  state.quizState.score = 0;
  state.quizState.streak = 0;
  state.quizState.current = 0;
  updateQuizScoreUI();
  const body = document.getElementById('quiz-body');
  if (body) body.classList.add('hidden');
  const startBtn = document.getElementById('btn-start-quiz');
  if (startBtn) startBtn.classList.remove('hidden');
}

function startQuiz() {
  if (!state.currentMachineData || !state.currentMachineData.quizQuestions) return;

  const diff = state.quizState.difficulty;
  let questions = state.currentMachineData.quizQuestions.filter(q => q.difficulty === diff);
  if (questions.length === 0) questions = state.currentMachineData.quizQuestions;

  // Shuffle
  questions = questions.sort(() => Math.random() - 0.5);
  state.quizState.questions = questions;
  state.quizState.total = questions.length;
  state.quizState.current = 0;
  state.quizState.score = 0;
  state.quizState.streak = 0;

  document.getElementById('btn-start-quiz').classList.add('hidden');
  document.getElementById('quiz-body').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const q = state.quizState.questions[state.quizState.current];
  if (!q) return;

  state.quizState.answered = false;
  document.getElementById('quiz-question-text').textContent = q.question;
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('btn-next-question').classList.add('hidden');

  const optList = document.getElementById('quiz-options-list');
  optList.innerHTML = '';
  const letters = 'ABCDEFGH';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'quiz-option';
    div.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
    div.addEventListener('click', () => answerQuiz(i));
    optList.appendChild(div);
  });

  updateQuizScoreUI();
}

function answerQuiz(chosenIdx) {
  if (state.quizState.answered) return;
  state.quizState.answered = true;

  const q = state.quizState.questions[state.quizState.current];
  const options = document.querySelectorAll('.quiz-option');
  const feedback = document.getElementById('quiz-feedback');

  options.forEach((opt, i) => {
    if (i === q.correct) opt.classList.add('correct');
    if (i === chosenIdx && i !== q.correct) opt.classList.add('wrong');
  });

  if (chosenIdx === q.correct) {
    state.quizState.score++;
    state.quizState.streak++;
    feedback.textContent = ' Correct! ' + (q.explanation || '');
    feedback.className = 'correct-fb';
  } else {
    state.quizState.streak = 0;
    feedback.textContent = ' Incorrect. ' + (q.explanation || '');
    feedback.className = 'wrong-fb';
  }
  feedback.classList.remove('hidden');
  document.getElementById('btn-next-question').classList.remove('hidden');
  updateQuizScoreUI();
}

function nextQuestion() {
  state.quizState.current++;
  if (state.quizState.current < state.quizState.total) {
    showQuestion();
  } else {
    document.getElementById('quiz-question-text').textContent = `Quiz Complete! Score: ${state.quizState.score}/${state.quizState.total}`;
    document.getElementById('quiz-options-list').innerHTML = '';
    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('btn-next-question').classList.add('hidden');
    document.getElementById('btn-start-quiz').classList.remove('hidden');
    document.getElementById('btn-start-quiz').textContent = 'Retry Quiz';
    if (window.logActivity && window.currentUser) {
      window.logActivity(window.currentUser, 'quiz_complete', { score: state.quizState.score, total: state.quizState.total, difficulty: state.quizState.difficulty, machine: state.currentMachineData.name });
    }
  }
}

function updateQuizScoreUI() {
  document.getElementById('score-value').textContent = state.quizState.score;
  document.getElementById('streak-value').textContent = state.quizState.streak;
  document.getElementById('quiz-progress').textContent = `${state.quizState.current + (state.quizState.answered ? 1 : 0)}/${state.quizState.total}`;
}

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  controls.update();

  // Tick AnimationMixer for batch machines
  if (currentMixer) currentMixer.update(dt * state.animSpeed);

  // Animate machine parts (legacy callback)
  if (state.currentMode === 'animate' && state.currentMachineData && state.currentMachineData.animate) {
    state.currentMachineData.animate(elapsed, state.animSpeed, partMeshes);
  }
  
  // Modern update loop (always runs if present, used by Chemistry and Physics models)
  if (state.currentMachineData && state.currentMachineData.update) {
    state.currentMachineData.update();
  }

  renderer.render(scene, camera);
}

// EVENT HANDLERS
function onResize() {
  const viewport = document.getElementById('viewport');
  if(!viewport) return;
  camera.aspect = viewport.clientWidth / viewport.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
}

function setupUI() {
  const sidebarEl = document.getElementById("sidebar");
  const createdSections = {};

  function getOrCreateContainer(cat) {
    const mapId = CATEGORY_MAP[cat] || ("machine-list-" + cat);
    const existing = document.getElementById(mapId);
    if (existing) return existing;
    if (createdSections[cat]) return createdSections[cat];
    if (!sidebarEl) return null;
    const label = document.createElement("div");
    label.className = "category-label";
    label.textContent = cat.replace(/_/g, " ").toUpperCase();
    const div = document.createElement("div");
    div.id = mapId;
    div.className = "machine-list";
    const footer = sidebarEl.querySelector(".sidebar-footer");
    if (footer) { sidebarEl.insertBefore(label, footer); sidebarEl.insertBefore(div, footer); }
    else { sidebarEl.appendChild(label); sidebarEl.appendChild(div); }
    createdSections[cat] = div;
    return div;
  }

  const params = new URLSearchParams(window.location.search);
  let filterCat = params.get('category');
  if (!filterCat) {
      const path = window.location.pathname.split('/').pop().replace('.html', '');
      if (path && path !== 'index' && path !== 'simulator') {
          filterCat = path;
      }
  }

  MACHINES.forEach(m => {
    if (filterCat && m.category !== filterCat) return;
    const container = getOrCreateContainer(m.category);
    if (!container) return;
    const btn = document.createElement("button");
    btn.className = "machine-btn";
    btn.dataset.id = m.id;
    let premiumBadge = m.isPremium ? '<span style="color:#fbbf24; margin-left:5px; font-size:0.8em;" title="Premium Model">⭐</span>' : '';
    btn.innerHTML = `<span class="m-icon">${m.icon}</span><span class="m-name">${m.name}${premiumBadge}</span>`;
    
    // Hover Prefetching: instantly load the module when hovered
    btn.addEventListener("mouseenter", () => {
      if (m.importPath && !m._prefetched) {
        m._prefetched = true;
        import(m.importPath).catch(err => console.warn("Prefetch failed:", err));
      }
    });

    btn.addEventListener("click", () => {
      document.querySelectorAll(".machine-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadMachine(m);
      if (window.innerWidth <= 900) {
          document.getElementById("sidebar").classList.remove("mobile-open");
      }
    });
    container.appendChild(btn);
  });

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => {
      setMode(b.dataset.mode);
      // On mobile, opening a mode like 'explore' or 'damage' might want to show info panel
      if (window.innerWidth <= 900) {
          document.getElementById('info-panel').classList.add('mobile-open');
          document.getElementById('sidebar').classList.remove('mobile-open');
      }
    });
  });

  // Mobile Toggles
  const toggleSidebar = document.getElementById('btn-toggle-sidebar');
  const toggleInfo = document.getElementById('btn-toggle-info');
  const sidebar = document.getElementById('sidebar');
  const infoPanel = document.getElementById('info-panel');

  if (toggleSidebar && sidebar) {
    toggleSidebar.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      infoPanel.classList.remove('mobile-open');
    });
  }

  if (toggleInfo && infoPanel) {
    toggleInfo.addEventListener('click', () => {
      infoPanel.classList.toggle('mobile-open');
      sidebar.classList.remove('mobile-open');
    });
  }

  // Toolbar buttons
  document.getElementById('btn-reset-camera').addEventListener('click', () => {
    if (machineGroup) {
      const box = new THREE.Box3().setFromObject(machineGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      controls.target.copy(center);
      camera.position.set(center.x + maxDim * 1.5, center.y + maxDim, center.z + maxDim * 1.5);
    }
  });

  document.getElementById('btn-wireframe').addEventListener('click', () => {
    state.wireframe = !state.wireframe;
    document.getElementById('btn-wireframe').classList.toggle('active', state.wireframe);
    if (machineGroup) {
      machineGroup.traverse(child => {
        if (child.isMesh) child.material.wireframe = state.wireframe;
      });
    }
  });

  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  document.getElementById('btn-labels').addEventListener('click', () => {
    state.showLabels = !state.showLabels;
    document.getElementById('btn-labels').classList.toggle('active', state.showLabels);
  });

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    if (controls && typeof THREE !== 'undefined') {
      const zoomVec = new THREE.Vector3().subVectors(camera.position, controls.target);
      zoomVec.multiplyScalar(0.8);
      camera.position.copy(controls.target).add(zoomVec);
      controls.update();
    }
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    if (controls && typeof THREE !== 'undefined') {
      const zoomVec = new THREE.Vector3().subVectors(camera.position, controls.target);
      zoomVec.multiplyScalar(1.2);
      camera.position.copy(controls.target).add(zoomVec);
      controls.update();
    }
  });

  // Explode slider
  document.getElementById('explode-slider').addEventListener('input', (e) => {
    state.explodeFactor = parseFloat(e.target.value);
    document.getElementById('explode-value').textContent = Math.round(state.explodeFactor * 100) + '%';
    applyExplode(state.explodeFactor);
  });

  // Speed slider
  document.getElementById('speed-slider').addEventListener('input', (e) => {
    state.animSpeed = parseFloat(e.target.value);
    document.getElementById('speed-value').textContent = state.animSpeed.toFixed(1) + 'x';
  });

  // Search
  document.getElementById('machine-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.machine-btn').forEach(btn => {
      const name = btn.querySelector('.m-name').textContent.toLowerCase();
      const mId = btn.dataset.id;
      const model = window.ENGISIM_MACHINES.find(m => m.id === mId);
      const category = model?.category?.toLowerCase() || '';
      btn.style.display = (name.includes(q) || category.includes(q) || (model && model.id.toLowerCase().includes(q))) ? '' : 'none';
    });
  });

  // Damage permutation buttons
  document.querySelectorAll('.perm-controls .btn-sm').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.perm-controls .btn-sm').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      generatePermutations();
    });
  });

  // Damage clear
  document.getElementById('btn-clear-damage').addEventListener('click', () => {
    state.damagedParts.clear();
    updateDamageUI();
    clearHighlight();
  });

  // Assembly reset
  document.getElementById('btn-reset-assembly').addEventListener('click', () => {
    initAssemblyMode();
  });

  // Quiz buttons
  document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
  document.getElementById('btn-next-question').addEventListener('click', nextQuestion);

  document.querySelectorAll('.diff-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.quizState.difficulty = b.dataset.diff;
    });
  });
}

// INIT
async function init() {
  updateLoader(20, 'Loading Three.js...');
  await new Promise(r => setTimeout(r, 200));

  if(document.getElementById('portal-grid')) { hideLoader(); return; }
  updateLoader(40, 'Initializing 3D engine...');
  initThree();

    updateLoader(80, 'Setting up interface...');
  try { await loadCustomModels(MACHINES); } catch(e) { console.warn('Chatbot error:', e); }
  try { initChatbot(); } catch(e) { console.warn('Chatbot UI error:', e); }
  setupUI();

  updateLoader(90, 'Loading machines...');
  await new Promise(r => setTimeout(r, 300));

  updateLoader(100, 'Ready!');
  await new Promise(r => setTimeout(r, 500));

  hideLoader();
  animate();

  // Auto-load requested machine or first machine
  const paramsURL = new URLSearchParams(window.location.search);
  const reqModel = paramsURL.get('model');
  if (reqModel) {
      const btn = document.querySelector(`.machine-btn[data-id="${reqModel}"]`);
      if (btn) { btn.click(); return; }
  }
  const firstBtn = document.querySelector('.machine-btn');
  if (firstBtn) firstBtn.click();
}

init().catch(err => { console.error('EngiSim init failed:', err); const s = document.getElementById('loader-status'); if (s) s.textContent = 'Error: ' + err.message; });


























































































function resetExplosion() {
    if (!machineGroup) return;
    machineGroup.traverse(child => {
        if (child.isMesh && child.userData.origPos) {
            child.position.copy(child.userData.origPos);
        }
    });
    if(document.getElementById('explode-slider')) document.getElementById('explode-slider').value = 0;
    if(document.getElementById('explode-val')) document.getElementById('explode-val').innerText = '0%';
}

function resetCrossSection() {
    if (!machineGroup) return;
    machineGroup.traverse(child => {
        if (child.isMesh && child.material) {
            child.material.clippingPlanes = null;
        }
    });
    if(document.getElementById('xsection-slider')) document.getElementById('xsection-slider').value = 0;
    if(document.getElementById('xsection-val')) document.getElementById('xsection-val').innerText = '0%';
}

const localPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 10);

// Run after DOM load
setTimeout(() => {
    // Tab switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const target = e.target.getAttribute('data-tab');
            document.getElementById('tab-catalog').style.display = target === 'catalog' ? 'block' : 'none';
            document.getElementById('tab-learning').style.display = target === 'learning' ? 'block' : 'none';
        });
    });


}, 1000); // Give UI time to construct
