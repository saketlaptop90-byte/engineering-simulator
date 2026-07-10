// ============================================================================
// GOD TIER CHRONOSPHERE — Localized Gravitational Time Dilation Device
// A Tipler-cylinder-inspired rotating shell generating a region of extreme
// frame-dragging where the interior experiences measurable time dilation.
// Features: exotic matter rings, temporal field boundary, gravitational
// lensing distortion shell, central dilation chamber, CTC vortex core,
// chrono-stabilizer pylons, and a control bridge.
// ============================================================================

import {
  plastic, aluminum, glass, copper, steel,
  darkSteel, rubber, chrome, tinted
} from '../utils/materials.js';

/* ── helper materials ────────────────────────────────────────────────────── */
function _glow(hex, intensity = 2.5) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: intensity,
    metalness: 0.3,
    roughness: 0.25,
    transparent: true,
    opacity: 0.92
  });
}
function _holoGlass(hex, op = 0.28) {
  return new THREE.MeshPhysicalMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: 1.6,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: op,
    transmission: 0.7,
    thickness: 0.4,
    side: THREE.DoubleSide
  });
}
function _fieldMat(hex, op = 0.18) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: 3.0,
    transparent: true,
    opacity: op,
    side: THREE.DoubleSide,
    wireframe: true
  });
}

/* ── constants ───────────────────────────────────────────────────────────── */
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ========================================================================
  // 1. BASE PLATFORM — massive hexagonal plinth with micro-panel detailing
  // ========================================================================
  const baseShape = new THREE.Shape();
  const hexR = 8.5;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU - Math.PI / 6;
    const x = Math.cos(a) * hexR;
    const z = Math.sin(a) * hexR;
    if (i === 0) baseShape.moveTo(x, z);
    else baseShape.lineTo(x, z);
  }
  baseShape.closePath();
  const baseGeo = new THREE.ExtrudeGeometry(baseShape, { depth: 0.6, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.15, bevelSegments: 4 });
  const baseMesh = new THREE.Mesh(baseGeo, darkSteel.clone());
  baseMesh.rotation.x = -Math.PI / 2;
  baseMesh.position.y = -0.3;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);
  meshes.basePlatform = baseMesh;

  // Panel line grooves on base surface
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const groove = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 0.02, 0.06),
      _glow(0x0088ff, 0.8)
    );
    groove.position.set(Math.cos(a) * 3.5, 0.32, Math.sin(a) * 3.5);
    groove.rotation.y = a;
    group.add(groove);
  }

  // ========================================================================
  // 2. TIPLER CYLINDER SHELL — rotating segmented cylindrical shell
  // ========================================================================
  const tiplerGroup = new THREE.Group();
  const shellSegments = 24;
  const shellHeight = 12;
  const shellRadius = 5.2;
  for (let i = 0; i < shellSegments; i++) {
    const angle = (i / shellSegments) * TAU;
    const segH = shellHeight * 0.92;
    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, segH, 1.2),
      chrome.clone()
    );
    seg.position.set(
      Math.cos(angle) * shellRadius,
      shellHeight / 2 + 0.3,
      Math.sin(angle) * shellRadius
    );
    seg.rotation.y = -angle;
    seg.castShadow = true;
    tiplerGroup.add(seg);

    // Horizontal ribs connecting segments
    if (i % 3 === 0) {
      for (let r = 0; r < 5; r++) {
        const rib = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.08, 1.3),
          steel.clone()
        );
        rib.position.set(
          Math.cos(angle) * shellRadius,
          1.5 + r * 2.4,
          Math.sin(angle) * shellRadius
        );
        rib.rotation.y = -angle;
        tiplerGroup.add(rib);
      }
    }
  }

  // Vertical reinforcement columns every 60°
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.3, shellHeight + 0.5, 8),
      darkSteel.clone()
    );
    col.position.set(Math.cos(a) * shellRadius, shellHeight / 2 + 0.3, Math.sin(a) * shellRadius);
    col.castShadow = true;
    tiplerGroup.add(col);

    // Bolts on each column
    for (let b = 0; b < 6; b++) {
      const bolt = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        chrome.clone()
      );
      bolt.position.set(
        Math.cos(a) * (shellRadius + 0.28),
        1.0 + b * 2.0,
        Math.sin(a) * (shellRadius + 0.28)
      );
      tiplerGroup.add(bolt);
    }
  }
  group.add(tiplerGroup);
  meshes.tiplerShell = tiplerGroup;

  // ========================================================================
  // 3. EXOTIC MATTER RINGS — three massive counter-rotating torus rings
  // ========================================================================
  const ringGroup = new THREE.Group();
  const ringColors = [0x00ffcc, 0xff00ff, 0x00ccff];
  const ringRadii = [4.0, 4.5, 5.0];
  const ringTubeR = [0.12, 0.10, 0.08];

  for (let r = 0; r < 3; r++) {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadii[r], ringTubeR[r], 32, 128),
      _glow(ringColors[r], 3.5)
    );
    torus.position.y = 5.0 + r * 1.8;
    torus.rotation.x = Math.PI / 2 + (r - 1) * 12 * DEG;
    ringGroup.add(torus);
    meshes[`exoticRing${r}`] = torus;

    // Energy nodules on each ring
    const noduleCount = 16 + r * 4;
    for (let n = 0; n < noduleCount; n++) {
      const na = (n / noduleCount) * TAU;
      const nodule = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        _glow(ringColors[r], 5.0)
      );
      nodule.position.set(
        Math.cos(na) * ringRadii[r],
        5.0 + r * 1.8,
        Math.sin(na) * ringRadii[r]
      );
      ringGroup.add(nodule);
    }
  }
  group.add(ringGroup);
  meshes.exoticRingGroup = ringGroup;

  // ========================================================================
  // 4. CENTRAL DILATION CHAMBER — transparent sphere where time runs slow
  // ========================================================================
  const chamberGroup = new THREE.Group();

  // Outer containment sphere
  const containment = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 64, 64),
    _holoGlass(0x00ffee, 0.15)
  );
  containment.position.y = 6.5;
  chamberGroup.add(containment);
  meshes.containmentSphere = containment;

  // Inner core orb — this is the "slow time" region
  const coreOrb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 3),
    _glow(0xffffff, 1.5)
  );
  coreOrb.position.y = 6.5;
  chamberGroup.add(coreOrb);
  meshes.coreOrb = coreOrb;

  // Orbiting test masses (demonstrate differential time flow)
  const testMassGroup = new THREE.Group();
  testMassGroup.position.y = 6.5;
  for (let i = 0; i < 8; i++) {
    const tm = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.15, 1),
      _glow(0xffaa00, 2.0)
    );
    testMassGroup.add(tm);
    meshes[`testMass${i}`] = tm;
  }
  chamberGroup.add(testMassGroup);
  meshes.testMassGroup = testMassGroup;

  // Gravitational lensing distortion shell (wireframe icosahedron)
  const lensShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.2, 2),
    _fieldMat(0x88ccff, 0.12)
  );
  lensShell.position.y = 6.5;
  chamberGroup.add(lensShell);
  meshes.lensShell = lensShell;

  group.add(chamberGroup);

  // ========================================================================
  // 5. TEMPORAL FIELD BOUNDARY — shimmering energy barrier
  // ========================================================================
  const fieldBoundary = new THREE.Group();

  // Primary field sphere
  const fieldSphere = new THREE.Mesh(
    new THREE.SphereGeometry(6.8, 48, 48),
    (() => {
      const m = new THREE.MeshStandardMaterial({
        color: 0x4400ff,
        emissive: 0x2200aa,
        emissiveIntensity: 1.8,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        wireframe: false
      });
      return m;
    })()
  );
  fieldSphere.position.y = 6.5;
  fieldBoundary.add(fieldSphere);
  meshes.fieldSphere = fieldSphere;

  // Secondary wireframe boundary
  const fieldWire = new THREE.Mesh(
    new THREE.SphereGeometry(7.0, 32, 32),
    _fieldMat(0x8800ff, 0.08)
  );
  fieldWire.position.y = 6.5;
  fieldBoundary.add(fieldWire);
  meshes.fieldWire = fieldWire;

  // Shimmer particles at boundary (small spheres distributed on a sphere surface)
  const shimmerGroup = new THREE.Group();
  shimmerGroup.position.y = 6.5;
  const shimmerCount = 200;
  for (let i = 0; i < shimmerCount; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / shimmerCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const sr = 6.9;
    const sp = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 4, 4),
      _glow(0xaa88ff, 4.0)
    );
    sp.position.set(
      sr * Math.sin(phi) * Math.cos(theta),
      sr * Math.cos(phi),
      sr * Math.sin(phi) * Math.sin(theta)
    );
    shimmerGroup.add(sp);
  }
  fieldBoundary.add(shimmerGroup);
  meshes.shimmerGroup = shimmerGroup;

  group.add(fieldBoundary);

  // ========================================================================
  // 6. FRAME-DRAGGING VORTEX CORE — spinning plasma column along Y-axis
  // ========================================================================
  const vortexGroup = new THREE.Group();

  // Central plasma column
  const plasmaTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 14, 32, 1, true),
    _glow(0x00ffff, 4.0)
  );
  plasmaTube.position.y = 6.5;
  vortexGroup.add(plasmaTube);
  meshes.plasmaTube = plasmaTube;

  // Spiraling filaments around the column
  for (let f = 0; f < 6; f++) {
    const filamentPts = [];
    for (let t = 0; t <= 80; t++) {
      const frac = t / 80;
      const y = frac * 13 - 0.5;
      const a = frac * TAU * 5 + (f / 6) * TAU;
      const r = 0.6 + Math.sin(frac * Math.PI) * 0.6;
      filamentPts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    const filCurve = new THREE.CatmullRomCurve3(filamentPts);
    const filGeo = new THREE.TubeGeometry(filCurve, 100, 0.03, 6, false);
    const filMesh = new THREE.Mesh(filGeo, _glow(0x00eeff, 3.0));
    vortexGroup.add(filMesh);
  }

  group.add(vortexGroup);
  meshes.vortexGroup = vortexGroup;

  // ========================================================================
  // 7. CHRONO-STABILIZER PYLONS — 6 massive pylons around the perimeter
  // ========================================================================
  const pylonGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const pylon = new THREE.Group();
    const px = Math.cos(a) * 7.2;
    const pz = Math.sin(a) * 7.2;
    pylon.position.set(px, 0, pz);
    pylon.rotation.y = -a;

    // Main pylon body — tapered using LatheGeometry
    const pylonPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.55, 0),
      new THREE.Vector2(0.6, 0.3),
      new THREE.Vector2(0.5, 5),
      new THREE.Vector2(0.65, 5.5),
      new THREE.Vector2(0.7, 8),
      new THREE.Vector2(0.55, 9.5),
      new THREE.Vector2(0.3, 10.5),
      new THREE.Vector2(0.15, 11),
      new THREE.Vector2(0, 11.2)
    ];
    const pylonGeo = new THREE.LatheGeometry(pylonPts, 12);
    const pylonBody = new THREE.Mesh(pylonGeo, darkSteel.clone());
    pylonBody.castShadow = true;
    pylon.add(pylonBody);

    // Emitter cap at top
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      _glow(0x00ffaa, 4.0)
    );
    cap.position.y = 11.2;
    pylon.add(cap);
    meshes[`pylonCap${i}`] = cap;

    // Energy conduit from cap toward center
    const conduitPts = [
      new THREE.Vector3(0, 11.0, 0),
      new THREE.Vector3(-px * 0.3, 9.5, -pz * 0.3),
      new THREE.Vector3(-px * 0.6, 7.5, -pz * 0.6),
      new THREE.Vector3(-px * 0.85, 6.5, -pz * 0.85)
    ];
    const conduitCurve = new THREE.CatmullRomCurve3(conduitPts);
    const conduitGeo = new THREE.TubeGeometry(conduitCurve, 30, 0.04, 6, false);
    const conduit = new THREE.Mesh(conduitGeo, _glow(0x00ff88, 2.5));
    pylon.add(conduit);

    // Hydraulic brace mid-pylon
    const brace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3.5, 8),
      steel.clone()
    );
    brace.position.set(0.5, 3.5, 0);
    brace.rotation.z = 15 * DEG;
    pylon.add(brace);

    // Warning lights
    const warnLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      _glow(0xff3300, 5.0)
    );
    warnLight.position.set(0.6, 8.0, 0);
    pylon.add(warnLight);
    meshes[`warnLight${i}`] = warnLight;

    pylonGroup.add(pylon);
  }
  group.add(pylonGroup);
  meshes.pylonGroup = pylonGroup;

  // ========================================================================
  // 8. CONTROL BRIDGE — elevated operator platform with consoles & screens
  // ========================================================================
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(8.5, 0, 0);

  // Bridge deck
  const deckShape = new THREE.Shape();
  deckShape.moveTo(-2.5, -1.5);
  deckShape.lineTo(2.5, -1.5);
  deckShape.lineTo(2.5, 1.5);
  deckShape.lineTo(-2.5, 1.5);
  deckShape.closePath();
  const deckGeo = new THREE.ExtrudeGeometry(deckShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
  const deck = new THREE.Mesh(deckGeo, darkSteel.clone());
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = 3.0;
  deck.castShadow = true;
  bridgeGroup.add(deck);

  // Support legs for bridge
  for (let lx of [-2.2, 2.2]) {
    for (let lz of [-1.2, 1.2]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 3.0, 8),
        steel.clone()
      );
      leg.position.set(lx, 1.5, lz);
      leg.castShadow = true;
      bridgeGroup.add(leg);
    }
  }

  // Access ladder
  const ladderGroup = new THREE.Group();
  ladderGroup.position.set(-2.8, 0, 0);
  // Rails
  for (let s of [-0.25, 0.25]) {
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 3.2, 6),
      aluminum.clone()
    );
    rail.position.set(s, 1.6, 0);
    ladderGroup.add(rail);
  }
  // Rungs
  for (let r = 0; r < 8; r++) {
    const rung = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6),
      aluminum.clone()
    );
    rung.position.set(0, 0.3 + r * 0.38, 0);
    rung.rotation.z = Math.PI / 2;
    ladderGroup.add(rung);
  }
  bridgeGroup.add(ladderGroup);

  // Railing around bridge
  for (let rx = -2.4; rx <= 2.4; rx += 0.6) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.0, 6),
      chrome.clone()
    );
    post.position.set(rx, 3.7, 1.5);
    bridgeGroup.add(post);
    const post2 = post.clone();
    post2.position.z = -1.5;
    bridgeGroup.add(post2);
  }

  // Horizontal rail bar
  for (let rz of [-1.5, 1.5]) {
    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 5.0, 6),
      chrome.clone()
    );
    bar.position.set(0, 4.2, rz);
    bar.rotation.z = Math.PI / 2;
    bridgeGroup.add(bar);
  }

  // Main console
  const consoleBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.8, 0.6),
    darkSteel.clone()
  );
  consoleBody.position.set(0, 3.6, -1.0);
  bridgeGroup.add(consoleBody);

  // Console screens (3 screens)
  for (let s = -1; s <= 1; s++) {
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.5),
      _glow(0x00ff88, 2.0)
    );
    screen.position.set(s * 0.8, 4.15, -1.0);
    screen.rotation.x = -15 * DEG;
    bridgeGroup.add(screen);
    meshes[`screen${s + 1}`] = screen;
  }

  // Buttons & dials on console
  for (let b = 0; b < 12; b++) {
    const btn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8),
      _glow([0xff0000, 0x00ff00, 0xffff00, 0x0088ff][b % 4], 3.0)
    );
    btn.position.set(-1.0 + b * 0.18, 4.05, -0.72);
    btn.rotation.x = Math.PI / 2;
    bridgeGroup.add(btn);
  }

  // Joystick
  const joyBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.08, 12),
    darkSteel.clone()
  );
  joyBase.position.set(1.8, 3.65, -0.5);
  bridgeGroup.add(joyBase);
  const joyStick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8),
    chrome.clone()
  );
  joyStick.position.set(1.8, 3.88, -0.5);
  bridgeGroup.add(joyStick);
  const joyBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    rubber.clone()
  );
  joyBall.position.set(1.8, 4.1, -0.5);
  bridgeGroup.add(joyBall);

  // Operator chair
  const chairSeat = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.08, 0.55),
    rubber.clone()
  );
  chairSeat.position.set(0, 3.5, 0);
  bridgeGroup.add(chairSeat);
  const chairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.7, 0.08),
    rubber.clone()
  );
  chairBack.position.set(0, 3.88, 0.26);
  bridgeGroup.add(chairBack);
  const chairPedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8),
    chrome.clone()
  );
  chairPedestal.position.set(0, 3.25, 0.05);
  bridgeGroup.add(chairPedestal);

  group.add(bridgeGroup);
  meshes.bridgeGroup = bridgeGroup;

  // ========================================================================
  // 9. UPPER & LOWER CONTAINMENT CAPS — dome + inverted dome
  // ========================================================================
  const upperCap = new THREE.Mesh(
    new THREE.SphereGeometry(5.4, 48, 24, 0, TAU, 0, Math.PI / 3),
    _holoGlass(0x4488ff, 0.12)
  );
  upperCap.position.y = 12.0;
  group.add(upperCap);
  meshes.upperCap = upperCap;

  const lowerCap = new THREE.Mesh(
    new THREE.SphereGeometry(5.4, 48, 24, 0, TAU, Math.PI * 2 / 3, Math.PI / 3),
    _holoGlass(0x4488ff, 0.12)
  );
  lowerCap.position.y = 1.0;
  group.add(lowerCap);
  meshes.lowerCap = lowerCap;

  // ========================================================================
  // 10. CTC (CLOSED TIMELIKE CURVE) VISUALIZATION RINGS
  // ========================================================================
  const ctcGroup = new THREE.Group();
  ctcGroup.position.y = 6.5;
  for (let c = 0; c < 5; c++) {
    const ctcRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.6 + c * 0.3, 0.02, 8, 64),
      _glow(0xff44ff, 2.5 + c * 0.5)
    );
    ctcRing.rotation.x = c * 18 * DEG;
    ctcRing.rotation.z = c * 30 * DEG;
    ctcGroup.add(ctcRing);
    meshes[`ctcRing${c}`] = ctcRing;
  }
  group.add(ctcGroup);
  meshes.ctcGroup = ctcGroup;

  // ========================================================================
  // 11. EXHAUST / HEAT RADIATOR FINS — on the exterior shell
  // ========================================================================
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 3.0, 1.0),
      copper.clone()
    );
    fin.position.set(
      Math.cos(a) * 5.8,
      2.0,
      Math.sin(a) * 5.8
    );
    fin.rotation.y = -a;
    fin.castShadow = true;
    group.add(fin);
  }

  // ========================================================================
  // 12. GRAVITATIONAL WAVE EMITTER ARRAY — toroidal antenna at top
  // ========================================================================
  const emitterTorus = new THREE.Mesh(
    new THREE.TorusGeometry(2.0, 0.15, 16, 64),
    chrome.clone()
  );
  emitterTorus.position.y = 13.0;
  emitterTorus.rotation.x = Math.PI / 2;
  group.add(emitterTorus);
  meshes.emitterTorus = emitterTorus;

  // Small dish antennas on emitter
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 6, 0, TAU, 0, Math.PI / 2),
      aluminum.clone()
    );
    dish.position.set(Math.cos(a) * 2.0, 13.0, Math.sin(a) * 2.0);
    dish.rotation.x = Math.PI;
    group.add(dish);
  }

  // ========================================================================
  // 13. POWER CONDUITS — thick cables from base to pylons and rings
  // ========================================================================
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const pts = [
      new THREE.Vector3(Math.cos(a) * 2.0, 0.3, Math.sin(a) * 2.0),
      new THREE.Vector3(Math.cos(a) * 3.5, 1.5, Math.sin(a) * 3.5),
      new THREE.Vector3(Math.cos(a) * 5.5, 3.0, Math.sin(a) * 5.5),
      new THREE.Vector3(Math.cos(a) * 7.0, 5.0, Math.sin(a) * 7.0)
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.08, 8, false);
    const tube = new THREE.Mesh(tubeGeo, rubber.clone());
    tube.castShadow = true;
    group.add(tube);
  }

  // Internal conduits from pylons to rings
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const pts = [
      new THREE.Vector3(Math.cos(a) * 7.0, 8.0, Math.sin(a) * 7.0),
      new THREE.Vector3(Math.cos(a) * 5.0, 7.0, Math.sin(a) * 5.0),
      new THREE.Vector3(Math.cos(a) * 4.2, 6.5, Math.sin(a) * 4.2)
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = new THREE.TubeGeometry(curve, 18, 0.05, 6, false);
    const tube = new THREE.Mesh(tubeGeo, _glow(0x00ffaa, 1.5));
    group.add(tube);
  }

  // ========================================================================
  // 14. MICRO-DETAILS — rivets, labels, hazard striping
  // ========================================================================

  // Hazard stripes on base edge
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU;
    if (i % 2 === 0) {
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.05, 0.15),
        _glow(0xffcc00, 1.0)
      );
      stripe.position.set(Math.cos(a) * 8.0, 0.05, Math.sin(a) * 8.0);
      stripe.rotation.y = a;
      group.add(stripe);
    }
  }

  // Small status indicator lights around the shell mid-height
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * TAU;
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 6, 6),
      _glow(i % 3 === 0 ? 0x00ff00 : (i % 3 === 1 ? 0xff0000 : 0x0088ff), 4.0)
    );
    light.position.set(
      Math.cos(a) * 5.35,
      6.5,
      Math.sin(a) * 5.35
    );
    group.add(light);
  }

  // ========================================================================
  // 15. INNER SLOW-MOTION PENDULUMS — objects demonstrating time dilation
  // ========================================================================
  const pendulumGroup = new THREE.Group();
  pendulumGroup.position.y = 6.5;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU;
    const pendulum = new THREE.Group();

    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6),
      chrome.clone()
    );
    rod.position.y = -0.75;
    pendulum.add(rod);

    const bob = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      _glow(0xffdd00, 2.0)
    );
    bob.position.y = -1.5;
    pendulum.add(bob);

    pendulum.position.set(Math.cos(a) * 0.8, 1.0, Math.sin(a) * 0.8);
    pendulumGroup.add(pendulum);
    meshes[`pendulum${i}`] = pendulum;
  }
  group.add(pendulumGroup);
  meshes.pendulumGroup = pendulumGroup;

  // ========================================================================
  // 16. EXTERNAL REFERENCE CLOCKS — fast-ticking clocks outside the field
  // ========================================================================
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + Math.PI / 4;
    const clockGroup = new THREE.Group();
    clockGroup.position.set(Math.cos(a) * 9.5, 5.0, Math.sin(a) * 9.5);
    clockGroup.rotation.y = -a;

    // Clock face
    const face = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32),
      plastic.clone()
    );
    face.rotation.x = Math.PI / 2;
    clockGroup.add(face);

    // Hour marks
    for (let h = 0; h < 12; h++) {
      const ha = (h / 12) * TAU;
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.12, 0.02),
        chrome.clone()
      );
      mark.position.set(Math.cos(ha) * 0.4, Math.sin(ha) * 0.4, 0.03);
      clockGroup.add(mark);
    }

    // Clock hand
    const hand = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.35, 0.02),
      _glow(0xff0000, 2.0)
    );
    hand.position.z = 0.04;
    hand.geometry.translate(0, 0.17, 0);
    clockGroup.add(hand);
    meshes[`clockHand${i}`] = hand;

    group.add(clockGroup);
  }

  // ========================================================================
  // PARTS ARRAY — 20 detailed parts
  // ========================================================================
  const parts = [
    {
      name: 'Hexagonal Base Platform',
      description: 'Massive hexagonal dark-steel plinth providing structural foundation and housing sub-floor cryogenic coolant channels for thermal management of the exotic matter containment systems.',
      material: 'Dark Steel alloy (Fe-Cr-Ni-Mo) with plasma-deposited ceramic thermal barrier',
      function: 'Structural foundation, vibration isolation, and thermal heatsink for the entire apparatus',
      assemblyOrder: 1,
      connections: ['Chrono-Stabilizer Pylons', 'Tipler Cylinder Shell', 'Power Conduits'],
      failureEffect: 'Complete structural collapse; total loss of alignment tolerances',
      cascadeFailures: ['Tipler Cylinder Shell', 'Exotic Matter Rings', 'Central Dilation Chamber'],
      originalPosition: { x: 0, y: -0.3, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 0 }
    },
    {
      name: 'Tipler Cylinder Shell',
      description: 'Segmented rotating cylindrical shell inspired by Tipler\'s infinite cylinder solution. 24 longitudinal staves with horizontal cross-ribs and 6 reinforcement columns create an angular-momentum reservoir that contributes to frame-dragging.',
      material: 'Neutron-degenerate chromium alloy with superconducting bearing races',
      function: 'Generates frame-dragging angular momentum; primary contributor to the Lense-Thirring effect within the chamber',
      assemblyOrder: 3,
      connections: ['Base Platform', 'Exotic Matter Rings', 'Upper/Lower Containment Caps'],
      failureEffect: 'Loss of rotational coherence; frame-dragging field collapses within 10⁻⁸ s',
      cascadeFailures: ['Exotic Matter Rings', 'Temporal Field Boundary', 'CTC Visualization Rings'],
      originalPosition: { x: 0, y: 6, z: 0 },
      explodedPosition: { x: -12, y: 6, z: 0 }
    },
    {
      name: 'Exotic Matter Ring α (Cyan)',
      description: 'Innermost torus carrying a circulating current of exotic matter with negative average null energy condition (ANEC) violation, sourced from quantum vacuum fluctuations amplified by Casimir geometry.',
      material: 'Casimir-geometry metamaterial confining negative energy density quanta',
      function: 'Provides negative energy density required to open and sustain the local dilation region per the Alcubierre-Van Den Broeck metric generalization',
      assemblyOrder: 4,
      connections: ['Tipler Cylinder Shell', 'Exotic Matter Ring β', 'Central Dilation Chamber'],
      failureEffect: 'ANEC restoration; dilation region pinches off in < 1 Planck time',
      cascadeFailures: ['Central Dilation Chamber', 'Temporal Field Boundary'],
      originalPosition: { x: 0, y: 5.0, z: 0 },
      explodedPosition: { x: 0, y: 5.0, z: 14 }
    },
    {
      name: 'Exotic Matter Ring β (Magenta)',
      description: 'Middle exotic matter torus, counter-rotating relative to Ring α to create shear in the stress-energy tensor, enhancing frame-dragging gradient across the chamber boundary.',
      material: 'Quantum-degenerate plasma confined by magnetic nozzle topology',
      function: 'Shear stress-energy augmentation; stabilizes the Kerr-like ergoregion boundary',
      assemblyOrder: 5,
      connections: ['Exotic Matter Ring α', 'Exotic Matter Ring γ', 'CTC Rings'],
      failureEffect: 'Ergoregion boundary becomes unstable; superradiant instability onset',
      cascadeFailures: ['CTC Visualization Rings', 'Temporal Field Boundary'],
      originalPosition: { x: 0, y: 6.8, z: 0 },
      explodedPosition: { x: 14, y: 6.8, z: 0 }
    },
    {
      name: 'Exotic Matter Ring γ (Blue)',
      description: 'Outermost exotic matter torus providing the far-field asymptotic matching condition so the metric transitions smoothly to flat Minkowski space at large radii.',
      material: 'Topological insulator substrate with surface-state negative refraction',
      function: 'Asymptotic metric matching; prevents naked singularity formation at field boundary',
      assemblyOrder: 6,
      connections: ['Exotic Matter Ring β', 'Temporal Field Boundary', 'Chrono-Stabilizer Pylons'],
      failureEffect: 'Metric mismatch causes gravitational shock wave propagation outward',
      cascadeFailures: ['Temporal Field Boundary', 'Control Bridge'],
      originalPosition: { x: 0, y: 8.6, z: 0 },
      explodedPosition: { x: -14, y: 8.6, z: 0 }
    },
    {
      name: 'Central Dilation Chamber',
      description: 'Transparent containment sphere enclosing the region of maximal time dilation. Contains orbiting test masses and pendulums demonstrating differential proper time accumulation.',
      material: 'Fused quartz aerogel with embedded fiber-optic Sagnac interferometers',
      function: 'Contains and visualizes the time-dilated region; houses test masses for real-time dilation verification',
      assemblyOrder: 7,
      connections: ['Exotic Matter Rings', 'Core Orb', 'Gravitational Lensing Shell'],
      failureEffect: 'Loss of visual containment; dilation region persists but is unmonitored',
      cascadeFailures: ['Core Orb'],
      originalPosition: { x: 0, y: 6.5, z: 0 },
      explodedPosition: { x: 0, y: 20, z: 0 }
    },
    {
      name: 'Core Orb (Dilated Region)',
      description: 'Icosahedral geodesic orb marking the locus of maximum time dilation. Proper time inside runs at 1/1000th the rate of coordinate time outside the field boundary.',
      material: 'Crystallized spacetime foam (hypothetical stabilized Planck-scale lattice)',
      function: 'Marks the region of maximum gravitational redshift / time dilation factor',
      assemblyOrder: 8,
      connections: ['Central Dilation Chamber', 'Frame-Dragging Vortex Core'],
      failureEffect: 'Dilation maximum migrates unpredictably; temporal gradient reversal possible',
      cascadeFailures: ['Frame-Dragging Vortex Core', 'Test Masses'],
      originalPosition: { x: 0, y: 6.5, z: 0 },
      explodedPosition: { x: 0, y: 24, z: 0 }
    },
    {
      name: 'Temporal Field Boundary',
      description: 'Shimmering spherical energy barrier at r = 6.8 m marking the transition between normal spacetime and the dilated interior. 200 shimmer particles visualize the boundary\'s quantum fluctuations.',
      material: 'Self-sustaining vacuum polarization membrane',
      function: 'Defines the causal boundary; prevents information leakage that would violate the chronology protection conjecture',
      assemblyOrder: 9,
      connections: ['Exotic Matter Ring γ', 'Shimmer Particles', 'Chrono-Stabilizer Pylons'],
      failureEffect: 'Boundary dissolution; uncontrolled dilation gradient extends to infinity',
      cascadeFailures: ['Shimmer Particles', 'External Reference Clocks'],
      originalPosition: { x: 0, y: 6.5, z: 0 },
      explodedPosition: { x: 0, y: 6.5, z: -16 }
    },
    {
      name: 'Frame-Dragging Vortex Core',
      description: 'Central plasma column with 6 helical filaments visualizing the Lense-Thirring frame-dragging effect. The spiraling pattern shows how local inertial frames are dragged by the rotating shell.',
      material: 'Magnetically confined plasma (T ≈ 10⁸ K) with embedded tracer particles',
      function: 'Visualizes frame-dragging; the filament pitch angle directly measures the angular velocity of dragged inertial frames',
      assemblyOrder: 10,
      connections: ['Tipler Cylinder Shell', 'Core Orb', 'Exotic Matter Rings'],
      failureEffect: 'Loss of frame-dragging visualization; actual effect persists but is unobservable',
      cascadeFailures: ['CTC Visualization Rings'],
      originalPosition: { x: 0, y: 6.5, z: 0 },
      explodedPosition: { x: 16, y: 12, z: 0 }
    },
    {
      name: 'Chrono-Stabilizer Pylons (×6)',
      description: 'Six tapered LatheGeometry pylons positioned at 60° intervals around the perimeter, each topped with an emitter cap firing coherent graviton beams inward to stabilize the dilation field.',
      material: 'Tungsten-rhenium superalloy with graviton-waveguide sapphire cores',
      function: 'Active stabilization of the temporal field boundary; compensates for tidal perturbations from external mass distributions',
      assemblyOrder: 2,
      connections: ['Base Platform', 'Temporal Field Boundary', 'Power Conduits'],
      failureEffect: 'Field boundary oscillates; temporal flickering causes causal paradox risk',
      cascadeFailures: ['Temporal Field Boundary', 'Control Bridge'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 18 }
    },
    {
      name: 'Control Bridge',
      description: 'Elevated operator platform with 3-screen console, joystick, 12-button control array, operator chair, access ladder, and safety railing. Provides full manual override of all chronosphere parameters.',
      material: 'Carbon fiber composite deck with ESD-safe rubber surfacing',
      function: 'Human-in-the-loop control interface; monitors dilation factor, field stability, exotic matter reserves, and CTC proximity warnings',
      assemblyOrder: 11,
      connections: ['Base Platform', 'Chrono-Stabilizer Pylons'],
      failureEffect: 'Loss of manual override; system defaults to autonomous safety shutdown',
      cascadeFailures: [],
      originalPosition: { x: 8.5, y: 0, z: 0 },
      explodedPosition: { x: 22, y: 0, z: 0 }
    },
    {
      name: 'CTC Visualization Rings',
      description: 'Five nested torus rings at varied inclinations showing the geometry of closed timelike curves that would exist if the dilation factor exceeded the critical threshold (currently operating below CTC formation).',
      material: 'Holographic photon-trapping metamaterial',
      function: 'Real-time display of the CTC parameter space; rings brighten as dilation factor approaches the Gödel threshold',
      assemblyOrder: 12,
      connections: ['Frame-Dragging Vortex Core', 'Exotic Matter Ring β'],
      failureEffect: 'Loss of CTC proximity warning; operator unaware of approaching causality violation',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 6.5, z: 0 },
      explodedPosition: { x: -16, y: 16, z: 0 }
    },
    {
      name: 'Gravitational Wave Emitter Array',
      description: 'Toroidal antenna at the apex with 8 parabolic dish elements for broadcasting the dilation field\'s gravitational wave signature, enabling remote detection and synchronization with distant chronospheres.',
      material: 'Piezoelectric graviton-crystal array on chrome substrate',
      function: 'Broadcasts coherent gravitational waves for inter-chronosphere synchronization and external monitoring',
      assemblyOrder: 13,
      connections: ['Upper Containment Cap', 'Tipler Cylinder Shell'],
      failureEffect: 'Loss of external synchronization; chronosphere operates in isolation',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 13.0, z: 0 },
      explodedPosition: { x: 0, y: 28, z: 0 }
    },
    {
      name: 'Upper Containment Cap',
      description: 'Hemispherical transparent dome sealing the top of the Tipler cylinder, providing optical access while maintaining vacuum integrity in the dilation region.',
      material: 'Sapphire-diamond composite with anti-reflective nanostructure coating',
      function: 'Vacuum containment; optical viewport for external observation of dilated region',
      assemblyOrder: 14,
      connections: ['Tipler Cylinder Shell', 'GW Emitter Array'],
      failureEffect: 'Vacuum breach; exotic matter contamination of exterior environment',
      cascadeFailures: ['Exotic Matter Rings'],
      originalPosition: { x: 0, y: 12.0, z: 0 },
      explodedPosition: { x: 0, y: 26, z: 0 }
    },
    {
      name: 'Lower Containment Cap',
      description: 'Inverted hemispherical dome sealing the bottom, housing cryogenic feed-throughs for the superconducting bearing system that supports the rotating Tipler shell.',
      material: 'Sapphire-diamond composite with integrated cryogenic ports',
      function: 'Lower vacuum seal; cryogenic access for superconducting bearing maintenance',
      assemblyOrder: 15,
      connections: ['Tipler Cylinder Shell', 'Base Platform'],
      failureEffect: 'Bearing thermal runaway; Tipler shell decelerates uncontrollably',
      cascadeFailures: ['Tipler Cylinder Shell'],
      originalPosition: { x: 0, y: 1.0, z: 0 },
      explodedPosition: { x: 0, y: -6, z: 0 }
    },
    {
      name: 'Power Conduit Network',
      description: 'Twelve thick rubber-insulated cables routing power from the base-mounted zero-point energy extractors to the pylons and exotic matter ring injectors.',
      material: 'High-temperature superconductor (YBCO) in cryogenic rubber sheath',
      function: 'Delivers terawatt-class power to the exotic matter generation and stabilization systems',
      assemblyOrder: 16,
      connections: ['Base Platform', 'Chrono-Stabilizer Pylons', 'Exotic Matter Rings'],
      failureEffect: 'Power loss; exotic matter rings decay within 10⁻¹² s',
      cascadeFailures: ['Exotic Matter Rings', 'Chrono-Stabilizer Pylons', 'Temporal Field Boundary'],
      originalPosition: { x: 0, y: 2.0, z: 0 },
      explodedPosition: { x: 18, y: 2.0, z: 18 }
    },
    {
      name: 'Heat Radiator Fins',
      description: 'Twelve copper fins arrayed around the shell exterior radiating waste heat from the exotic matter containment magnets into the surrounding environment.',
      material: 'Oxygen-free high-conductivity copper (OFHC Cu)',
      function: 'Passive thermal management; prevents superconducting quench in bearing and magnet systems',
      assemblyOrder: 17,
      connections: ['Tipler Cylinder Shell'],
      failureEffect: 'Thermal runaway; superconducting systems quench within seconds',
      cascadeFailures: ['Tipler Cylinder Shell', 'Exotic Matter Rings'],
      originalPosition: { x: 0, y: 2.0, z: 0 },
      explodedPosition: { x: -18, y: 2.0, z: -18 }
    },
    {
      name: 'Inner Slow-Motion Pendulums',
      description: 'Four chrome-and-gold pendulums inside the dilation chamber swinging at 1/1000th normal rate, providing a visceral demonstration of gravitational time dilation to observers outside the field.',
      material: 'Iridium-platinum bob on single-crystal silicon carbide rod',
      function: 'Visual demonstration of time dilation; swing period directly measures the local proper time rate',
      assemblyOrder: 18,
      connections: ['Central Dilation Chamber', 'Core Orb'],
      failureEffect: 'Loss of visual time dilation indicator; dilation continues but is less intuitive to observe',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 7.5, z: 0 },
      explodedPosition: { x: 0, y: 22, z: 10 }
    },
    {
      name: 'External Reference Clocks',
      description: 'Four high-precision atomic clocks mounted outside the field boundary, ticking at normal coordinate time rate for comparison with the dilated interior pendulums.',
      material: 'Strontium optical lattice clock in vacuum-sealed housing',
      function: 'Provides coordinate-time reference; the ratio of clock rate to pendulum rate gives the redshift factor z',
      assemblyOrder: 19,
      connections: ['Temporal Field Boundary'],
      failureEffect: 'Loss of reference timing; dilation factor becomes unmeasurable externally',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 5.0, z: 0 },
      explodedPosition: { x: 20, y: 5.0, z: 20 }
    },
    {
      name: 'Gravitational Lensing Shell',
      description: 'Wireframe icosahedron inside the containment sphere showing the geodesic paths photons take through the curved spacetime, visually distorting the interior view.',
      material: 'Fiber-optic geodesic tracer mesh',
      function: 'Visualizes null geodesic distortion; allows operators to directly observe gravitational lensing within the dilation field',
      assemblyOrder: 20,
      connections: ['Central Dilation Chamber', 'Temporal Field Boundary'],
      failureEffect: 'Loss of lensing visualization; actual lensing persists',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 6.5, z: 0 },
      explodedPosition: { x: -10, y: 18, z: -10 }
    }
  ];

  // ========================================================================
  // QUIZ QUESTIONS — PhD-level General Relativity & Time Dilation
  // ========================================================================
  const quizQuestions = [
    {
      question: 'In the Kerr metric describing a rotating black hole, what is the necessary and sufficient condition on the spin parameter a = J/Mc for the existence of closed timelike curves (CTCs) in the region between the inner horizon and the ring singularity?',
      options: [
        'a > 0 (any nonzero angular momentum suffices)',
        'a = M (extremal Kerr condition)',
        'a > M (naked singularity; CTC region extends to infinity)',
        'CTCs exist for all a ≠ 0 in the region r < r₋ where gφφ < 0'
      ],
      correctAnswer: 3,
      explanation: 'In the Kerr solution, for any a ≠ 0 the metric component gφφ becomes negative in the region near the ring singularity (r < r₋, the inner Cauchy horizon), meaning the Killing vector ∂/∂φ becomes timelike there. Orbits of ∂/∂φ are closed (they wrap around the axis), so they form CTCs. No threshold on a/M is needed beyond a ≠ 0; however, for a ≤ M these CTCs are hidden behind two horizons, while for a > M (naked singularity) the CTC region is globally visible, violating cosmic censorship.'
    },
    {
      question: 'Frame-dragging (the Lense-Thirring effect) causes the precession of a gyroscope in orbit around a rotating mass. For a gyroscope in a circular equatorial orbit at radius r around a slowly rotating body with angular momentum J, what is the Lense-Thirring precession rate ΩLT to leading order in J?',
      options: [
        'ΩLT = 2GJ / (c²r³)',
        'ΩLT = GJ / (c²r²)',
        'ΩLT = 3GJ / (c²r³) — the geodetic precession rate',
        'ΩLT = GJ / (2c²r³)'
      ],
      correctAnswer: 0,
      explanation: 'The Lense-Thirring precession rate for a gyroscope at position r in the equatorial plane of a slowly rotating body is ΩLT = 2GJ/(c²r³) to leading post-Newtonian order. This was confirmed by Gravity Probe B to within 19% accuracy. The factor of 2 distinguishes it from the gravitomagnetic field coefficient and arises from the specific structure of the off-diagonal g₀φ component in the weak-field expansion of the Kerr metric.'
    },
    {
      question: 'The Tipler cylinder is an exact solution of Einstein\'s field equations that admits CTCs. What exotic property must the cylinder\'s matter content possess if the cylinder has finite length (unlike Tipler\'s original infinite solution)?',
      options: [
        'The matter must rotate faster than the speed of light at some radius',
        'The matter must have negative energy density (violating the weak energy condition)',
        'The matter must be a perfect fluid with equation of state p = -ρc²',
        'The matter must be a Bose-Einstein condensate at zero temperature'
      ],
      correctAnswer: 1,
      explanation: 'Tipler\'s original 1974 result showed that an infinitely long dense rotating cylinder generates CTCs. Hawking proved (via the chronology protection conjecture and topology-change theorems) that any finite-length device creating CTCs must violate the weak energy condition (WEC), i.e., require matter with negative energy density. This is sometimes called "exotic matter." While quantum fields can transiently violate WEC (Casimir effect), sustaining it macroscopically remains speculative.'
    },
    {
      question: 'In the Schwarzschild metric, the gravitational time dilation factor between a static observer at radial coordinate r and one at infinity is dτ/dt = √(1 − rₛ/r). For two concentric shells of the Chronosphere at r₁ = 3rₛ and r₂ = 10rₛ, what is the ratio of proper time rates dτ₁/dτ₂?',
      options: [
        '√(1 − 1/3) / √(1 − 1/10) = √(2/3) / √(9/10) ≈ 0.862',
        '(1 − 1/3) / (1 − 1/10) = (2/3)/(9/10) ≈ 0.741',
        '√(1 − 1/3) / √(1 − 1/10) = √(6/9) / √(9/10) ≈ 0.860',
        '√(1 − 3) / √(1 − 10) — imaginary, so the comparison is undefined'
      ],
      correctAnswer: 0,
      explanation: 'For static observers in Schwarzschild spacetime, the proper time rate at radius r is dτ/dt = √(1 − rₛ/r). At r₁ = 3rₛ: dτ₁/dt = √(1 − 1/3) = √(2/3). At r₂ = 10rₛ: dτ₂/dt = √(1 − 1/10) = √(9/10). The ratio dτ₁/dτ₂ = √(2/3)/√(9/10) = √(20/27) ≈ 0.8607. The inner shell\'s clocks run about 14% slower than the outer shell\'s — a measurable time dilation if rₛ corresponds to a sufficiently massive/compact object.'
    },
    {
      question: 'Hawking\'s chronology protection conjecture states that the laws of physics prevent the formation of CTCs. What is the primary physical mechanism proposed to enforce chronology protection in semiclassical gravity?',
      options: [
        'Gravitational waves from the rotating matter radiate away all angular momentum before CTCs form',
        'The renormalized stress-energy tensor ⟨Tμν⟩ of quantum fields diverges on the chronology horizon (Cauchy horizon), back-reacting to destroy the CTC region before it forms',
        'Heisenberg uncertainty principle prevents trajectories from closing on themselves',
        'Dark energy pressure prevents the spacetime curvature from reaching CTC-forming thresholds'
      ],
      correctAnswer: 1,
      explanation: 'Hawking (1992) and Kay-Radzikowski-Wald (1997) showed that in semiclassical gravity, the renormalized expectation value of the stress-energy tensor ⟨Tμν⟩ren for quantum fields propagating on a spacetime developing a compactly generated Cauchy horizon (the boundary of the CTC region) generically diverges. This divergence back-reacts on the geometry via Einstein\'s equations, altering the spacetime to prevent CTC formation. This is the strongest known argument for chronology protection, though a full quantum gravity proof remains elusive.'
    },
    {
      question: 'The Alcubierre warp drive and the Chronosphere both require exotic matter violating energy conditions. Which energy condition must be violated, and what is the quantitative statement of that condition for a null vector kμ?',
      options: [
        'Strong energy condition: (Tμν − ½Tgμν)kμkν ≥ 0 for all timelike kμ',
        'Null energy condition (NEC): Tμν kμ kν ≥ 0 for all null kμ; the warp drive requires Tμν kμ kν < 0 somewhere',
        'Dominant energy condition: −Tμν kν is future-directed for all future-directed timelike kμ',
        'Averaged null energy condition (ANEC): ∫ Tμν kμ kν dλ ≥ 0 along complete null geodesics; violation means the integral is negative'
      ],
      correctAnswer: 1,
      explanation: 'The Alcubierre metric (and by extension any device creating superluminal travel or CTCs in finite regions) requires Tμν kμ kν < 0 for some null vector kμ at some point in the spacetime — a violation of the null energy condition (NEC). The NEC states Tμν kμ kν ≥ 0 for all null kμ. While ANEC (the averaged version) is also violated, the NEC violation is the more fundamental local condition. Quantum fields can violate NEC transiently (quantum inequalities), but sustained macroscopic violation remains the central obstacle.'
    }
  ];

  // ========================================================================
  // ANIMATE — extreme synchronized animations with differential time flow
  // ========================================================================
  function animate(time, speed, ms) {
    const t = time * speed;

    // 1. Tipler Cylinder Shell rotates
    if (ms.tiplerShell) {
      ms.tiplerShell.rotation.y = t * 0.3;
    }

    // 2. Exotic matter rings counter-rotate at different speeds
    if (ms.exoticRingGroup) {
      ms.exoticRingGroup.rotation.y = t * 0.5;
    }
    for (let r = 0; r < 3; r++) {
      const ring = ms[`exoticRing${r}`];
      if (ring) {
        ring.rotation.z = t * (r % 2 === 0 ? 0.8 : -0.6) + r * 0.5;
        // Pulse glow
        ring.material.emissiveIntensity = 3.0 + Math.sin(t * 3 + r * 2) * 1.5;
      }
    }

    // 3. Core orb pulses and slowly rotates (SLOW — inside dilated region)
    if (ms.coreOrb) {
      const dilationFactor = 0.05; // 20× slower than exterior
      ms.coreOrb.rotation.y = t * dilationFactor * 0.2;
      ms.coreOrb.rotation.x = t * dilationFactor * 0.15;
      const s = 1.0 + Math.sin(t * dilationFactor * 2) * 0.08;
      ms.coreOrb.scale.set(s, s, s);
      ms.coreOrb.material.emissiveIntensity = 1.2 + Math.sin(t * dilationFactor * 3) * 0.5;
    }

    // 4. Test masses orbit SLOWLY inside the chamber (time-dilated)
    if (ms.testMassGroup) {
      const dilationFactor = 0.05;
      for (let i = 0; i < 8; i++) {
        const tm = ms[`testMass${i}`];
        if (tm) {
          const a = t * dilationFactor * 0.4 + (i / 8) * TAU;
          const orbitR = 1.8 + Math.sin(i * 1.5) * 0.5;
          const yOff = Math.sin(a * 0.5 + i) * 0.6;
          tm.position.set(
            Math.cos(a) * orbitR,
            yOff,
            Math.sin(a) * orbitR
          );
          // Pulse the test masses
          tm.material.emissiveIntensity = 1.5 + Math.sin(t * dilationFactor * 5 + i) * 1.0;
        }
      }
    }

    // 5. Gravitational lensing shell rotates and distorts
    if (ms.lensShell) {
      ms.lensShell.rotation.y = t * 0.1;
      ms.lensShell.rotation.x = t * 0.07;
      ms.lensShell.material.opacity = 0.08 + Math.sin(t * 2) * 0.04;
    }

    // 6. Temporal field boundary shimmers
    if (ms.fieldSphere) {
      ms.fieldSphere.material.opacity = 0.04 + Math.sin(t * 1.5) * 0.03;
      ms.fieldSphere.material.emissiveIntensity = 1.5 + Math.sin(t * 2.5) * 0.8;
    }
    if (ms.fieldWire) {
      ms.fieldWire.rotation.y = t * 0.08;
      ms.fieldWire.rotation.z = t * 0.05;
    }

    // 7. Shimmer particles at boundary pulsate
    if (ms.shimmerGroup) {
      ms.shimmerGroup.rotation.y = t * 0.12;
      ms.shimmerGroup.rotation.x = Math.sin(t * 0.3) * 0.05;
      // Traverse children to pulsate individual particles
      const children = ms.shimmerGroup.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.material) {
          child.material.emissiveIntensity = 3.0 + Math.sin(t * 4 + i * 0.1) * 2.0;
          const ps = 1.0 + Math.sin(t * 5 + i * 0.2) * 0.5;
          child.scale.set(ps, ps, ps);
        }
      }
    }

    // 8. Vortex core and filaments rotate
    if (ms.vortexGroup) {
      ms.vortexGroup.rotation.y = t * 1.2;
    }
    if (ms.plasmaTube) {
      ms.plasmaTube.material.emissiveIntensity = 3.0 + Math.sin(t * 6) * 1.5;
    }

    // 9. CTC rings rotate at varied rates
    if (ms.ctcGroup) {
      ms.ctcGroup.rotation.y = t * 0.25;
      for (let c = 0; c < 5; c++) {
        const ctc = ms[`ctcRing${c}`];
        if (ctc) {
          ctc.rotation.x = c * 18 * DEG + t * (0.3 + c * 0.1);
          ctc.rotation.z = c * 30 * DEG + t * (0.2 - c * 0.05);
          ctc.material.emissiveIntensity = 2.0 + Math.sin(t * 3 + c) * 1.5;
        }
      }
    }

    // 10. Pylon caps pulse and warning lights blink
    for (let i = 0; i < 6; i++) {
      const cap = ms[`pylonCap${i}`];
      if (cap) {
        cap.material.emissiveIntensity = 3.0 + Math.sin(t * 4 + i * TAU / 6) * 2.0;
        const cs = 1.0 + Math.sin(t * 3 + i) * 0.15;
        cap.scale.set(cs, cs, cs);
      }
      const warn = ms[`warnLight${i}`];
      if (warn) {
        warn.material.emissiveIntensity = Math.sin(t * 8 + i * 1.2) > 0 ? 6.0 : 0.5;
      }
    }

    // 11. Console screens flicker
    for (let s = 0; s <= 2; s++) {
      const scr = ms[`screen${s}`];
      if (scr && scr.material) {
        scr.material.emissiveIntensity = 1.5 + Math.sin(t * 10 + s * 2) * 0.5;
      }
    }

    // 12. Pendulums swing IN SLOW MOTION (time-dilated)
    for (let i = 0; i < 4; i++) {
      const pend = ms[`pendulum${i}`];
      if (pend) {
        const dilationFactor = 0.05;
        pend.rotation.z = Math.sin(t * dilationFactor * 1.5 + i * Math.PI / 2) * 0.4;
      }
    }

    // 13. External reference clocks spin FAST (normal time)
    for (let i = 0; i < 4; i++) {
      const hand = ms[`clockHand${i}`];
      if (hand) {
        hand.rotation.z = -t * 2.0; // Fast ticking — normal time
      }
    }

    // 14. Emitter torus pulses
    if (ms.emitterTorus) {
      const es = 1.0 + Math.sin(t * 2) * 0.05;
      ms.emitterTorus.scale.set(es, es, es);
    }

    // 15. Upper & lower caps breathe
    if (ms.upperCap) {
      ms.upperCap.material.opacity = 0.08 + Math.sin(t * 1.2) * 0.04;
    }
    if (ms.lowerCap) {
      ms.lowerCap.material.opacity = 0.08 + Math.sin(t * 1.2 + Math.PI) * 0.04;
    }

    // 16. Containment sphere subtle rotation
    if (ms.containmentSphere) {
      ms.containmentSphere.rotation.y = t * 0.03;
      ms.containmentSphere.material.opacity = 0.12 + Math.sin(t * 1.8) * 0.04;
    }
  }

  // ========================================================================
  // DESCRIPTION
  // ========================================================================
  const description = `Chronosphere Time Machine — an ultra-god-tier device creating a localized region of extreme gravitational time dilation. Inspired by the Tipler cylinder solution and Kerr metric physics, it features a segmented rotating shell generating frame-dragging, three counter-rotating exotic matter rings violating the null energy condition, a central dilation chamber where proper time runs at 1/20th the exterior rate, a shimmering temporal field boundary with 200 quantum-fluctuation particles, a plasma vortex core visualizing Lense-Thirring frame-dragging, six chrono-stabilizer pylons with graviton emitters, CTC visualization rings, gravitational wave emitter array, slow-motion pendulums demonstrating time dilation, and fast-ticking external reference clocks for comparison. The control bridge provides full manual override with 3-screen console, joystick, and 12-button panel. Every animation is precisely synchronized: interior objects move at 1/20th speed (time-dilated), exterior clocks tick at normal rate, and the field boundary shimmers with individual particle pulsation.`;

  return { group, parts, description, quizQuestions, animate };
}
