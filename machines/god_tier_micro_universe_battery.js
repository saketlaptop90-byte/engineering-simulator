// ============================================================================
// GOD TIER — MICRO UNIVERSE BATTERY
// A containment device housing a baby universe whose inflationary expansion
// energy is siphoned through a stabilised wormhole throat as a power source.
// ============================================================================

import {
  plastic, aluminum, glass, copper, steel, darkSteel,
  rubber, chrome, tinted
} from '../utils/materials.js';

/* ── helper colour / material palette ───────────────────────────────────── */
function _emissive(hex, intensity = 1.6) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: intensity,
    metalness: 0.2, roughness: 0.35, transparent: true, opacity: 0.92
  });
}
function _glow(hex, intensity = 2.4) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: intensity,
    metalness: 0.05, roughness: 0.1, transparent: true, opacity: 0.7,
    side: THREE.DoubleSide
  });
}
function _holoLine(hex, op = 0.55) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: 3.0,
    transparent: true, opacity: op, side: THREE.DoubleSide
  });
}

/* ── main export ────────────────────────────────────────────────────────── */
export function createMachine(THREE) {

  const group = new THREE.Group();
  const meshes = {};

  // ========================================================================
  //  SECTION 1 — OUTER CONTAINMENT SHELL  (multi-layer toroidal fortress)
  // ========================================================================

  // Primary pressure hull — thick spherical shell with cut-away viewport
  const hullOuter = new THREE.SphereGeometry(3.6, 64, 64);
  const hullMesh = new THREE.Mesh(hullOuter, darkSteel.clone());
  hullMesh.name = 'containmentHull';
  group.add(hullMesh);
  meshes.hull = hullMesh;

  // Secondary inner shell — heat-resistant lining
  const innerShellGeo = new THREE.SphereGeometry(3.35, 64, 64);
  const innerShellMat = chrome.clone();
  innerShellMat.transparent = true; innerShellMat.opacity = 0.45;
  const innerShell = new THREE.Mesh(innerShellGeo, innerShellMat);
  innerShell.name = 'innerThermalShell';
  group.add(innerShell);
  meshes.innerShell = innerShell;

  // Reinforcement ribs — 16 longitudinal + 8 latitudinal titanium ribs
  const ribGroup = new THREE.Group();
  ribGroup.name = 'reinforcementRibs';
  for (let i = 0; i < 16; i++) {
    const ribCurve = new THREE.EllipseCurve(0, 0, 3.65, 3.65, 0, Math.PI * 2, false, 0);
    const ribPts = ribCurve.getPoints(120);
    const ribShape = new THREE.Shape();
    ribShape.moveTo(-0.03, -0.06);
    ribShape.lineTo(0.03, -0.06);
    ribShape.lineTo(0.03, 0.06);
    ribShape.lineTo(-0.03, 0.06);
    ribShape.closePath();
    const ribPath = new THREE.CatmullRomCurve3(
      ribPts.map(p => new THREE.Vector3(p.x, p.y, 0))
    );
    const ribGeo = new THREE.TubeGeometry(ribPath, 80, 0.04, 6, false);
    const rib = new THREE.Mesh(ribGeo, steel.clone());
    rib.rotation.y = (Math.PI / 16) * i;
    ribGroup.add(rib);
  }
  for (let j = 0; j < 8; j++) {
    const lat = (j - 3.5) * 0.28;
    const radius = Math.sqrt(3.65 * 3.65 - lat * lat);
    const latRibGeo = new THREE.TorusGeometry(radius, 0.035, 6, 96);
    const latRib = new THREE.Mesh(latRibGeo, steel.clone());
    latRib.position.y = lat;
    latRib.rotation.x = Math.PI / 2;
    ribGroup.add(latRib);
  }
  group.add(ribGroup);
  meshes.ribs = ribGroup;

  // Hexagonal armour tiles on hull surface (procedural placement)
  const tileGroup = new THREE.Group();
  tileGroup.name = 'armourTiles';
  const tileMat = aluminum.clone();
  for (let lat = -2.8; lat <= 2.8; lat += 0.55) {
    const r = Math.sqrt(3.62 * 3.62 - lat * lat);
    const count = Math.max(6, Math.floor(2 * Math.PI * r / 0.52));
    for (let k = 0; k < count; k++) {
      const theta = (2 * Math.PI / count) * k;
      const hexShape = new THREE.Shape();
      const hs = 0.18;
      for (let h = 0; h < 6; h++) {
        const a = (Math.PI / 3) * h;
        const hx = Math.cos(a) * hs, hy = Math.sin(a) * hs;
        h === 0 ? hexShape.moveTo(hx, hy) : hexShape.lineTo(hx, hy);
      }
      hexShape.closePath();
      const hexGeo = new THREE.ExtrudeGeometry(hexShape, { depth: 0.025, bevelEnabled: false });
      const tile = new THREE.Mesh(hexGeo, tileMat);
      tile.position.set(Math.cos(theta) * r, lat, Math.sin(theta) * r);
      tile.lookAt(0, lat, 0);
      tileGroup.add(tile);
    }
  }
  group.add(tileGroup);
  meshes.tiles = tileGroup;

  // ========================================================================
  //  SECTION 2 — VIEWPORT ASSEMBLY  (observation window into the baby universe)
  // ========================================================================

  // Cut-out ring around viewport
  const viewportRingGeo = new THREE.TorusGeometry(1.1, 0.12, 16, 64);
  const viewportRing = new THREE.Mesh(viewportRingGeo, chrome.clone());
  viewportRing.position.set(0, 0, 3.55);
  viewportRing.rotation.x = Math.PI / 2;
  group.add(viewportRing);
  meshes.viewportRing = viewportRing;

  // Tinted observation glass — thick convex lens
  const lensShape = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    const r = 1.0 * Math.sin(t * Math.PI);
    const z = 0.35 * Math.cos(t * Math.PI * 0.5);
    lensShape.push(new THREE.Vector2(r, z));
  }
  const lensGeo = new THREE.LatheGeometry(lensShape, 64);
  const lensMat = tinted.clone();
  lensMat.transparent = true; lensMat.opacity = 0.35;
  lensMat.emissive = new THREE.Color(0x1a0a3e);
  lensMat.emissiveIntensity = 0.6;
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.position.set(0, 0, 3.45);
  lens.rotation.x = -Math.PI / 2;
  group.add(lens);
  meshes.viewportLens = lens;

  // Viewport protective shutters (8 sliding plates)
  const shutterGroup = new THREE.Group();
  shutterGroup.name = 'viewportShutters';
  for (let s = 0; s < 8; s++) {
    const angle = (Math.PI * 2 / 8) * s;
    const shutterGeo = new THREE.BoxGeometry(0.45, 0.08, 0.95);
    const shutter = new THREE.Mesh(shutterGeo, darkSteel.clone());
    shutter.position.set(
      Math.cos(angle) * 0.75, Math.sin(angle) * 0.75, 3.6
    );
    shutter.rotation.z = angle;
    shutterGroup.add(shutter);
  }
  group.add(shutterGroup);
  meshes.shutters = shutterGroup;

  // ========================================================================
  //  SECTION 3 — BABY UNIVERSE CORE  (the pocket cosmos)
  // ========================================================================

  // Central inflating micro-universe sphere — multi-layered energy plasma
  const universeCore = new THREE.Group();
  universeCore.name = 'babyUniverseCore';

  // Layer 0 — hot dense plasma core
  const plasmaGeo = new THREE.IcosahedronGeometry(0.6, 5);
  const plasmaMat = _emissive(0xffeedd, 3.5);
  const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
  plasma.name = 'inflationPlasma';
  universeCore.add(plasma);
  meshes.plasma = plasma;

  // Layer 1 — inflationary field shell (translucent blue-violet)
  const inflationGeo = new THREE.IcosahedronGeometry(1.05, 4);
  const inflationMat = _glow(0x6633ff, 2.2);
  const inflationShell = new THREE.Mesh(inflationGeo, inflationMat);
  inflationShell.name = 'inflationFieldShell';
  universeCore.add(inflationShell);
  meshes.inflationShell = inflationShell;

  // Layer 2 — cosmic microwave background shell
  const cmbGeo = new THREE.SphereGeometry(1.45, 64, 64);
  const cmbMat = new THREE.MeshStandardMaterial({
    color: 0xff5500, emissive: 0xff3300, emissiveIntensity: 1.4,
    transparent: true, opacity: 0.25, wireframe: true
  });
  const cmb = new THREE.Mesh(cmbGeo, cmbMat);
  cmb.name = 'cmbShell';
  universeCore.add(cmb);
  meshes.cmb = cmb;

  // Layer 3 — dark energy boundary
  const deGeo = new THREE.SphereGeometry(1.85, 48, 48);
  const deMat = new THREE.MeshStandardMaterial({
    color: 0x110033, emissive: 0x220066, emissiveIntensity: 0.8,
    transparent: true, opacity: 0.18, side: THREE.BackSide
  });
  const darkEnvelope = new THREE.Mesh(deGeo, deMat);
  darkEnvelope.name = 'darkEnergyEnvelope';
  universeCore.add(darkEnvelope);
  meshes.darkEnvelope = darkEnvelope;

  // Quantum fluctuation particles — tiny icosahedrons scattered inside
  const fluctuationGroup = new THREE.Group();
  fluctuationGroup.name = 'quantumFluctuations';
  for (let f = 0; f < 180; f++) {
    const phi = Math.random() * Math.PI * 2;
    const cosTheta = Math.random() * 2 - 1;
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const rad = Math.random() * 1.3;
    const fGeo = new THREE.IcosahedronGeometry(0.015 + Math.random() * 0.03, 1);
    const fMat = _emissive(
      new THREE.Color().setHSL(0.55 + Math.random() * 0.35, 0.9, 0.6), 4.0
    );
    const fMesh = new THREE.Mesh(fGeo, fMat);
    fMesh.position.set(
      rad * sinTheta * Math.cos(phi),
      rad * sinTheta * Math.sin(phi),
      rad * cosTheta
    );
    fMesh.userData = { phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 2.0, baseRad: rad };
    fluctuationGroup.add(fMesh);
  }
  universeCore.add(fluctuationGroup);
  meshes.fluctuations = fluctuationGroup;

  group.add(universeCore);
  meshes.universeCore = universeCore;

  // ========================================================================
  //  SECTION 4 — WORMHOLE THROAT  (Einstein-Rosen bridge connecting to baby universe)
  // ========================================================================

  const throatGroup = new THREE.Group();
  throatGroup.name = 'wormholeThroat';

  // Throat funnel — LatheGeometry exponential profile
  const throatProfile = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const r = 0.25 + 0.55 * Math.pow(t, 0.4);
    const z = t * 3.0;
    throatProfile.push(new THREE.Vector2(r, z));
  }
  const throatGeo = new THREE.LatheGeometry(throatProfile, 64);
  const throatMat = new THREE.MeshStandardMaterial({
    color: 0x0a0020, emissive: 0x3311aa, emissiveIntensity: 1.8,
    transparent: true, opacity: 0.4, side: THREE.DoubleSide
  });
  const throatMesh = new THREE.Mesh(throatGeo, throatMat);
  throatMesh.position.y = -1.5;
  throatMesh.rotation.x = Math.PI;
  throatGroup.add(throatMesh);
  meshes.throatFunnel = throatMesh;

  // Throat inner lining — exotic matter stabiliser rings (12 nested tori)
  for (let r = 0; r < 12; r++) {
    const t = r / 11;
    const radius = 0.28 + 0.48 * Math.pow(t, 0.45);
    const yPos = -1.5 - t * 2.8;
    const ringGeo = new THREE.TorusGeometry(radius, 0.022, 8, 48);
    const ringMat = _emissive(
      new THREE.Color().setHSL(0.72 - t * 0.15, 0.95, 0.55), 2.0 + t
    );
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = yPos;
    ring.rotation.x = Math.PI / 2;
    ring.userData = { idx: r };
    throatGroup.add(ring);
  }

  // Throat event-horizon disc at the base
  const horizonGeo = new THREE.RingGeometry(0.02, 0.28, 48);
  const horizonMat = _emissive(0x000000, 0.1);
  horizonMat.color.set(0x000000);
  horizonMat.emissive.set(0x110033);
  const horizon = new THREE.Mesh(horizonGeo, horizonMat);
  horizon.position.y = -1.5;
  horizon.rotation.x = -Math.PI / 2;
  throatGroup.add(horizon);
  meshes.horizon = horizon;

  group.add(throatGroup);
  meshes.throat = throatGroup;

  // ========================================================================
  //  SECTION 5 — ENERGY EXTRACTION TETHERS  (6 primary + 12 secondary)
  // ========================================================================

  const tetherGroup = new THREE.Group();
  tetherGroup.name = 'energyTethers';

  // 6 primary extraction conduits — thick tubes from core to hull
  for (let t = 0; t < 6; t++) {
    const phi = (Math.PI * 2 / 6) * t;
    const dir = new THREE.Vector3(Math.cos(phi), 0.15 * Math.sin(t * 1.3), Math.sin(phi));
    const start = dir.clone().multiplyScalar(0.7);
    const end = dir.clone().multiplyScalar(3.2);
    const mid1 = start.clone().lerp(end, 0.33).add(new THREE.Vector3(0, 0.3 * Math.sin(t), 0));
    const mid2 = start.clone().lerp(end, 0.66).add(new THREE.Vector3(0, -0.2 * Math.cos(t), 0));
    const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end]);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.08, 12, false);
    const tubeMat = _emissive(0x00ccff, 1.8);
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.userData = { tetherIndex: t, phase: t * 1.047 };
    tetherGroup.add(tube);

    // Inner energy flow line
    const flowGeo = new THREE.TubeGeometry(curve, 48, 0.035, 8, false);
    const flowMat = _glow(0xffffff, 4.0);
    const flow = new THREE.Mesh(flowGeo, flowMat);
    flow.userData = { tetherIndex: t };
    tetherGroup.add(flow);
  }

  // 12 secondary stabiliser filaments — thinner, connecting at 30° offsets
  for (let s = 0; s < 12; s++) {
    const phi = (Math.PI * 2 / 12) * s + Math.PI / 12;
    const elev = 0.6 * Math.sin(s * 0.8);
    const dir = new THREE.Vector3(Math.cos(phi), elev * 0.3, Math.sin(phi));
    const start = dir.clone().multiplyScalar(1.1);
    const end = dir.clone().multiplyScalar(3.0);
    const curve = new THREE.CatmullRomCurve3([start, start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.15, 0)), end]);
    const filGeo = new THREE.TubeGeometry(curve, 32, 0.025, 6, false);
    const filMat = _holoLine(0x8855ff, 0.4);
    const fil = new THREE.Mesh(filGeo, filMat);
    tetherGroup.add(fil);
  }

  group.add(tetherGroup);
  meshes.tethers = tetherGroup;

  // ========================================================================
  //  SECTION 6 — INFLATION FIELD VISUALISER  (wireframe expanding surfaces)
  // ========================================================================

  const fieldVisGroup = new THREE.Group();
  fieldVisGroup.name = 'inflationFieldVisualiser';

  // Concentric expanding wavefronts (6 nested wireframe spheres)
  const wavefronts = [];
  for (let w = 0; w < 6; w++) {
    const wGeo = new THREE.IcosahedronGeometry(0.5 + w * 0.35, 2);
    const wMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.08 + w * 0.04, 0.9, 0.55),
      emissive: new THREE.Color().setHSL(0.08 + w * 0.04, 0.95, 0.45),
      emissiveIntensity: 1.5, wireframe: true,
      transparent: true, opacity: 0.35 - w * 0.04
    });
    const wMesh = new THREE.Mesh(wGeo, wMat);
    wMesh.userData = { baseScale: 0.5 + w * 0.35, idx: w };
    fieldVisGroup.add(wMesh);
    wavefronts.push(wMesh);
  }
  meshes.wavefronts = wavefronts;

  // Scalar field potential surface — a 3D parametric saddle displayed as mesh
  const potentialPts = [];
  const potRes = 40;
  for (let i = 0; i <= potRes; i++) {
    for (let j = 0; j <= potRes; j++) {
      const u = (i / potRes - 0.5) * 4;
      const v = (j / potRes - 0.5) * 4;
      const y = 0.4 * Math.exp(-(u * u + v * v) * 0.15) * Math.cos(u * 0.8);
      potentialPts.push(new THREE.Vector3(u * 0.4, y + 3.8, v * 0.4));
    }
  }
  // Build a plane geometry and displace vertices
  const potGeo = new THREE.PlaneGeometry(3.2, 3.2, potRes, potRes);
  const posArr = potGeo.attributes.position.array;
  let idx = 0;
  for (let i = 0; i <= potRes; i++) {
    for (let j = 0; j <= potRes; j++) {
      const u = (i / potRes - 0.5) * 4;
      const v = (j / potRes - 0.5) * 4;
      posArr[idx * 3 + 2] = 0.5 * Math.exp(-(u * u + v * v) * 0.12) *
        (1 + 0.3 * Math.cos(u * 1.2)) - 0.15 * (u * u) * 0.02;
      idx++;
    }
  }
  potGeo.computeVertexNormals();
  const potMat = new THREE.MeshStandardMaterial({
    color: 0x33ffaa, emissive: 0x11aa66, emissiveIntensity: 0.8,
    wireframe: true, transparent: true, opacity: 0.45, side: THREE.DoubleSide
  });
  const potentialSurface = new THREE.Mesh(potGeo, potMat);
  potentialSurface.position.y = 3.8;
  potentialSurface.rotation.x = -Math.PI / 2;
  fieldVisGroup.add(potentialSurface);
  meshes.potentialSurface = potentialSurface;

  group.add(fieldVisGroup);
  meshes.fieldVis = fieldVisGroup;

  // ========================================================================
  //  SECTION 7 — EXOTIC MATTER INJECTORS  (4 high-pressure nozzles)
  // ========================================================================

  const injectorGroup = new THREE.Group();
  injectorGroup.name = 'exoticMatterInjectors';

  for (let n = 0; n < 4; n++) {
    const angle = (Math.PI / 2) * n + Math.PI / 4;
    const nozzle = new THREE.Group();

    // Nozzle body — LatheGeometry bell shape
    const nozzleProfile = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const r = 0.12 + 0.18 * Math.pow(t, 2.5);
      nozzleProfile.push(new THREE.Vector2(r, t * 1.2));
    }
    const nozzleGeo = new THREE.LatheGeometry(nozzleProfile, 24);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, chrome.clone());
    nozzle.add(nozzleMesh);

    // Injection plasma glow
    const injGlowGeo = new THREE.CylinderGeometry(0.06, 0.14, 0.8, 16);
    const injGlow = new THREE.Mesh(injGlowGeo, _emissive(0xff00ff, 3.0));
    injGlow.position.y = -0.4;
    nozzle.add(injGlow);

    // Feed pipes — 2 per nozzle
    for (let p = 0; p < 2; p++) {
      const pipeAngle = (p === 0 ? 0.3 : -0.3);
      const pipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.2, 0),
        new THREE.Vector3(pipeAngle * 0.5, 1.6, pipeAngle * 0.3),
        new THREE.Vector3(pipeAngle * 1.0, 2.0, pipeAngle * 0.5)
      ]);
      const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.03, 8, false);
      const pipe = new THREE.Mesh(pipeGeo, copper.clone());
      nozzle.add(pipe);
    }

    nozzle.position.set(
      Math.cos(angle) * 2.8,
      -2.0,
      Math.sin(angle) * 2.8
    );
    nozzle.lookAt(0, 0, 0);
    injectorGroup.add(nozzle);
  }
  group.add(injectorGroup);
  meshes.injectors = injectorGroup;

  // ========================================================================
  //  SECTION 8 — POWER OUTPUT MANIFOLD & CONVERTER COILS
  // ========================================================================

  const manifoldGroup = new THREE.Group();
  manifoldGroup.name = 'powerManifold';

  // Main output bus — large toroidal coil at top
  const busGeo = new THREE.TorusGeometry(1.6, 0.18, 24, 64);
  const busMat = copper.clone();
  const bus = new THREE.Mesh(busGeo, busMat);
  bus.position.y = 3.0;
  bus.rotation.x = Math.PI / 2;
  manifoldGroup.add(bus);
  meshes.outputBus = bus;

  // Superconductor converter coils — 8 helical windings around the bus
  for (let c = 0; c < 8; c++) {
    const coilPts = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const mainAngle = (Math.PI * 2 / 8) * c + t * Math.PI * 4;
      const helixR = 1.6 + 0.3 * Math.sin(t * Math.PI * 16);
      coilPts.push(new THREE.Vector3(
        Math.cos(mainAngle) * helixR,
        3.0 + 0.22 * Math.cos(t * Math.PI * 16),
        Math.sin(mainAngle) * helixR
      ));
    }
    const coilCurve = new THREE.CatmullRomCurve3(coilPts);
    const coilGeo = new THREE.TubeGeometry(coilCurve, 100, 0.025, 6, false);
    const coilMat = _emissive(0x00ffcc, 1.5);
    const coil = new THREE.Mesh(coilGeo, coilMat);
    manifoldGroup.add(coil);
  }

  // 4 output terminals extending upward
  for (let ot = 0; ot < 4; ot++) {
    const otAngle = (Math.PI / 2) * ot;
    const termGeo = new THREE.CylinderGeometry(0.12, 0.08, 1.2, 12);
    const term = new THREE.Mesh(termGeo, aluminum.clone());
    term.position.set(Math.cos(otAngle) * 1.6, 3.8, Math.sin(otAngle) * 1.6);
    manifoldGroup.add(term);

    // Terminal cap — glowing
    const capGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const cap = new THREE.Mesh(capGeo, _emissive(0x00ff88, 2.5));
    cap.position.set(Math.cos(otAngle) * 1.6, 4.4, Math.sin(otAngle) * 1.6);
    manifoldGroup.add(cap);
  }

  group.add(manifoldGroup);
  meshes.manifold = manifoldGroup;

  // ========================================================================
  //  SECTION 9 — CONTAINMENT FIELD EMITTERS  (magnetic bottle coils)
  // ========================================================================

  const emitterGroup = new THREE.Group();
  emitterGroup.name = 'containmentEmitters';

  // 3 large toroidal field coils at 120° intervals
  for (let e = 0; e < 3; e++) {
    const eAngle = (Math.PI * 2 / 3) * e;
    const emitterGeo = new THREE.TorusGeometry(2.5, 0.1, 12, 64);
    const emitterMat = _emissive(0xff4400, 1.2);
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.rotation.y = eAngle;
    emitter.rotation.x = Math.PI / 2;
    emitterGroup.add(emitter);
  }

  // 6 poloidal coils stacked vertically
  for (let p = 0; p < 6; p++) {
    const py = (p - 2.5) * 1.0;
    const pRadius = 2.6 - Math.abs(py) * 0.15;
    const pGeo = new THREE.TorusGeometry(pRadius, 0.06, 8, 48);
    const pMat = _emissive(0xffaa00, 1.0);
    const pCoil = new THREE.Mesh(pGeo, pMat);
    pCoil.position.y = py;
    pCoil.rotation.x = Math.PI / 2;
    emitterGroup.add(pCoil);
  }

  group.add(emitterGroup);
  meshes.emitters = emitterGroup;

  // ========================================================================
  //  SECTION 10 — CONTROL SYSTEMS & OPERATOR INTERFACE
  // ========================================================================

  const controlGroup = new THREE.Group();
  controlGroup.name = 'controlSystems';

  // Control console pedestal
  const pedestalGeo = new THREE.CylinderGeometry(0.5, 0.65, 1.8, 16);
  const pedestal = new THREE.Mesh(pedestalGeo, darkSteel.clone());
  pedestal.position.set(5.5, -2.5, 0);
  controlGroup.add(pedestal);

  // Console top — angled panel
  const consoleShape = new THREE.Shape();
  consoleShape.moveTo(-0.6, -0.35);
  consoleShape.lineTo(0.6, -0.35);
  consoleShape.lineTo(0.55, 0.35);
  consoleShape.lineTo(-0.55, 0.35);
  consoleShape.closePath();
  const consoleGeo = new THREE.ExtrudeGeometry(consoleShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.01 });
  const consoleMesh = new THREE.Mesh(consoleGeo, plastic.clone());
  consoleMesh.position.set(5.5, -1.5, 0);
  consoleMesh.rotation.x = -0.4;
  controlGroup.add(consoleMesh);

  // Holographic display screens (3 floating panels)
  for (let d = 0; d < 3; d++) {
    const dAngle = (d - 1) * 0.6;
    const screenGeo = new THREE.PlaneGeometry(0.7, 0.5);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x001122, emissive: 0x00aaff, emissiveIntensity: 1.5,
      transparent: true, opacity: 0.6, side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(5.2 + d * 0.15, -0.7, dAngle * 1.2);
    screen.rotation.y = -0.3 + d * 0.15;
    controlGroup.add(screen);

    // Scan lines on screen
    for (let sl = 0; sl < 8; sl++) {
      const lineGeo = new THREE.PlaneGeometry(0.6, 0.008);
      const lineMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 3.0,
        transparent: true, opacity: 0.5
      });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(5.2 + d * 0.15, -0.9 + sl * 0.06, dAngle * 1.2 + 0.01);
      line.rotation.y = -0.3 + d * 0.15;
      controlGroup.add(line);
    }
  }

  // Warning indicator lights — 12 LEDs around console base
  for (let led = 0; led < 12; led++) {
    const ledAngle = (Math.PI * 2 / 12) * led;
    const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const ledColor = led % 3 === 0 ? 0xff0000 : (led % 3 === 1 ? 0xffff00 : 0x00ff00);
    const ledMat = _emissive(ledColor, 3.0);
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(
      5.5 + Math.cos(ledAngle) * 0.55,
      -2.5 + 0.92,
      Math.sin(ledAngle) * 0.55
    );
    ledMesh.userData = { ledIdx: led };
    controlGroup.add(ledMesh);
  }

  // Joystick
  const joyBaseGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.04, 12);
  const joyBase = new THREE.Mesh(joyBaseGeo, darkSteel.clone());
  joyBase.position.set(5.8, -1.42, 0.25);
  controlGroup.add(joyBase);
  const joyStickGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.2, 8);
  const joyStick = new THREE.Mesh(joyStickGeo, rubber.clone());
  joyStick.position.set(5.8, -1.32, 0.25);
  controlGroup.add(joyStick);
  const joyTopGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const joyTop = new THREE.Mesh(joyTopGeo, plastic.clone());
  joyTop.position.set(5.8, -1.22, 0.25);
  controlGroup.add(joyTop);

  group.add(controlGroup);
  meshes.controls = controlGroup;

  // ========================================================================
  //  SECTION 11 — BASE PLATFORM & SUPPORT STRUCTURE
  // ========================================================================

  const baseGroup = new THREE.Group();
  baseGroup.name = 'basePlatform';

  // Heavy hexagonal base plate
  const baseShape = new THREE.Shape();
  for (let h = 0; h < 6; h++) {
    const a = (Math.PI / 3) * h - Math.PI / 6;
    const bx = Math.cos(a) * 4.5, bz = Math.sin(a) * 4.5;
    h === 0 ? baseShape.moveTo(bx, bz) : baseShape.lineTo(bx, bz);
  }
  baseShape.closePath();
  const baseGeo = new THREE.ExtrudeGeometry(baseShape, { depth: 0.35, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.04 });
  const basePlate = new THREE.Mesh(baseGeo, darkSteel.clone());
  basePlate.position.y = -3.8;
  basePlate.rotation.x = -Math.PI / 2;
  baseGroup.add(basePlate);
  meshes.basePlate = basePlate;

  // 6 support pylons connecting base to hull
  for (let sp = 0; sp < 6; sp++) {
    const spAngle = (Math.PI / 3) * sp;
    const pylonGeo = new THREE.CylinderGeometry(0.15, 0.2, 3.5, 12);
    const pylon = new THREE.Mesh(pylonGeo, steel.clone());
    pylon.position.set(Math.cos(spAngle) * 2.8, -2.0, Math.sin(spAngle) * 2.8);
    baseGroup.add(pylon);

    // Shock absorber at each pylon base
    const shockGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.6, 12);
    const shock = new THREE.Mesh(shockGeo, rubber.clone());
    shock.position.set(Math.cos(spAngle) * 2.8, -3.5, Math.sin(spAngle) * 2.8);
    baseGroup.add(shock);

    // Pylon-to-hull bracket
    const bracketGeo = new THREE.BoxGeometry(0.35, 0.1, 0.35);
    const bracket = new THREE.Mesh(bracketGeo, aluminum.clone());
    bracket.position.set(Math.cos(spAngle) * 2.8, -0.2, Math.sin(spAngle) * 2.8);
    baseGroup.add(bracket);
  }

  // Cable runs along base — 8 cable bundles
  for (let cb = 0; cb < 8; cb++) {
    const cbAngle = (Math.PI * 2 / 8) * cb;
    const cableStart = new THREE.Vector3(Math.cos(cbAngle) * 1.0, -3.6, Math.sin(cbAngle) * 1.0);
    const cableEnd = new THREE.Vector3(Math.cos(cbAngle) * 4.0, -3.6, Math.sin(cbAngle) * 4.0);
    const cableMid = cableStart.clone().lerp(cableEnd, 0.5).add(new THREE.Vector3(0, -0.15, 0));
    const cableCurve = new THREE.CatmullRomCurve3([cableStart, cableMid, cableEnd]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.04, 6, false);
    const cable = new THREE.Mesh(cableGeo, rubber.clone());
    baseGroup.add(cable);
  }

  group.add(baseGroup);
  meshes.base = baseGroup;

  // ========================================================================
  //  SECTION 12 — SAFETY SYSTEMS  (radiation shields, emergency vents)
  // ========================================================================

  const safetyGroup = new THREE.Group();
  safetyGroup.name = 'safetySystems';

  // Radiation shield panels — 8 curved panels around equator
  for (let rp = 0; rp < 8; rp++) {
    const rpAngle = (Math.PI * 2 / 8) * rp;
    const panelGeo = new THREE.CylinderGeometry(3.85, 3.85, 1.8, 8, 1, true,
      rpAngle - 0.35, 0.6);
    const panelMat = aluminum.clone();
    panelMat.transparent = true; panelMat.opacity = 0.7;
    const panel = new THREE.Mesh(panelGeo, panelMat);
    safetyGroup.add(panel);
  }

  // Emergency pressure relief valves — 4 spring-loaded pop-offs
  for (let v = 0; v < 4; v++) {
    const vAngle = (Math.PI / 2) * v;
    const valveBody = new THREE.CylinderGeometry(0.1, 0.12, 0.4, 10);
    const valve = new THREE.Mesh(valveBody, chrome.clone());
    valve.position.set(Math.cos(vAngle) * 3.7, 1.5, Math.sin(vAngle) * 3.7);
    valve.lookAt(0, 1.5, 0);
    safetyGroup.add(valve);

    // Valve spring
    const springPts = [];
    for (let si = 0; si <= 40; si++) {
      const st = si / 40;
      springPts.push(new THREE.Vector3(
        Math.cos(st * Math.PI * 8) * 0.06,
        st * 0.3,
        Math.sin(st * Math.PI * 8) * 0.06
      ));
    }
    const springCurve = new THREE.CatmullRomCurve3(springPts);
    const springGeo = new THREE.TubeGeometry(springCurve, 40, 0.012, 6, false);
    const spring = new THREE.Mesh(springGeo, steel.clone());
    spring.position.set(Math.cos(vAngle) * 3.7, 1.7, Math.sin(vAngle) * 3.7);
    safetyGroup.add(spring);
  }

  // Caution stripe rings
  const cautionMat = new THREE.MeshStandardMaterial({
    color: 0xffcc00, emissive: 0xff8800, emissiveIntensity: 0.3
  });
  for (let cr = 0; cr < 2; cr++) {
    const crGeo = new THREE.TorusGeometry(3.7, 0.05, 6, 64);
    const cautionRing = new THREE.Mesh(crGeo, cautionMat);
    cautionRing.position.y = cr === 0 ? 2.5 : -2.5;
    cautionRing.rotation.x = Math.PI / 2;
    safetyGroup.add(cautionRing);
  }

  group.add(safetyGroup);
  meshes.safety = safetyGroup;

  // ========================================================================
  //  SECTION 13 — PARTICLE STREAM VISUALISATION (energy out-flow)
  // ========================================================================

  const particleGroup = new THREE.Group();
  particleGroup.name = 'particleStreams';

  // Create 200 tiny glowing spheres that will animate along tethers
  const particles = [];
  for (let p = 0; p < 200; p++) {
    const pGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.02, 6, 6);
    const pMat = _emissive(
      new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 1.0, 0.7), 5.0
    );
    const pMesh = new THREE.Mesh(pGeo, pMat);
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI;
    pMesh.userData = {
      phi, theta,
      speed: 0.3 + Math.random() * 1.5,
      radOffset: Math.random(),
      tether: Math.floor(Math.random() * 6)
    };
    particleGroup.add(pMesh);
    particles.push(pMesh);
  }
  meshes.particles = particles;
  group.add(particleGroup);

  // ========================================================================
  //  SECTION 14 — GRAVITY WAVE ANTENNAE  (4 long dipole arms)
  // ========================================================================

  const antennaGroup = new THREE.Group();
  antennaGroup.name = 'gravityWaveAntennae';
  for (let ant = 0; ant < 4; ant++) {
    const antAngle = (Math.PI / 2) * ant + Math.PI / 4;
    const armGeo = new THREE.CylinderGeometry(0.03, 0.02, 5.0, 8);
    const arm = new THREE.Mesh(armGeo, chrome.clone());
    arm.position.set(Math.cos(antAngle) * 3.9, 0, Math.sin(antAngle) * 3.9);
    arm.rotation.z = antAngle + Math.PI / 2;
    arm.rotation.x = Math.PI / 4;
    antennaGroup.add(arm);

    // Antenna tip sensor
    const tipGeo = new THREE.OctahedronGeometry(0.08, 0);
    const tip = new THREE.Mesh(tipGeo, _emissive(0x00ffff, 3.5));
    tip.position.set(
      Math.cos(antAngle) * 5.8, 2.0, Math.sin(antAngle) * 5.8
    );
    antennaGroup.add(tip);
  }
  group.add(antennaGroup);
  meshes.antennae = antennaGroup;

  // ========================================================================
  //  SECTION 15 — HOLOGRAPHIC STATUS RING
  // ========================================================================

  const holoRingGeo = new THREE.TorusGeometry(4.2, 0.015, 4, 128);
  const holoRingMat = _holoLine(0x00aaff, 0.5);
  const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
  holoRing.position.y = 0;
  holoRing.rotation.x = Math.PI / 2;
  group.add(holoRing);
  meshes.holoRing = holoRing;

  // Holographic data ticks around the ring — 60 marks
  const tickGroup = new THREE.Group();
  for (let tk = 0; tk < 60; tk++) {
    const tkAngle = (Math.PI * 2 / 60) * tk;
    const tkLen = tk % 5 === 0 ? 0.25 : 0.1;
    const tkGeo = new THREE.BoxGeometry(0.01, tkLen, 0.005);
    const tkMat = _holoLine(tk % 5 === 0 ? 0x00ffff : 0x0066aa, 0.6);
    const tick = new THREE.Mesh(tkGeo, tkMat);
    tick.position.set(Math.cos(tkAngle) * 4.2, tkLen / 2, Math.sin(tkAngle) * 4.2);
    tick.rotation.y = -tkAngle;
    tickGroup.add(tick);
  }
  group.add(tickGroup);
  meshes.ticks = tickGroup;

  // ========================================================================
  //  PARTS MANIFEST
  // ========================================================================

  const parts = [
    {
      name: 'Containment Hull',
      description: 'Multi-layer titanium-iridium pressure vessel rated for 10^24 Pa, withstanding the immense energy density of the baby universe\'s inflationary phase.',
      material: 'Titanium-Iridium Superalloy', function: 'Primary structural containment of the pocket universe',
      assemblyOrder: 1, connections: ['Inner Thermal Shell', 'Reinforcement Ribs', 'Support Pylons'],
      failureEffect: 'Catastrophic breach — uncontrolled inflationary expansion escapes containment, potentially spawning a new Big Bang event',
      cascadeFailures: ['Inner Thermal Shell', 'Radiation Shields', 'All internal systems'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'Baby Universe Core',
      description: 'The pocket cosmos itself — a causally disconnected spacetime region undergoing controlled inflationary expansion, maintained at Planck-scale energy densities.',
      material: 'Spacetime / Inflaton Field', function: 'Energy source — de Sitter expansion releases vacuum energy',
      assemblyOrder: 8, connections: ['Inflation Field Shell', 'Wormhole Throat', 'Energy Tethers'],
      failureEffect: 'Graceful exit to reheating — baby universe thermalises and loses energy output, or runaway inflation destroys containment',
      cascadeFailures: ['Wormhole Throat', 'Energy Extraction Tethers'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 6, z: 0 }
    },
    {
      name: 'Inflation Field Shell',
      description: 'Visualisation of the scalar inflaton field φ(x,t) driving exponential expansion. The slow-roll potential V(φ) must satisfy ε = (M_pl²/2)(V\'/V)² ≪ 1.',
      material: 'Inflaton Scalar Field', function: 'Maintains slow-roll conditions for sustained energy extraction',
      assemblyOrder: 9, connections: ['Baby Universe Core', 'Quantum Fluctuations'],
      failureEffect: 'Violation of slow-roll conditions triggers rapid phase transition and reheating',
      cascadeFailures: ['Baby Universe Core', 'CMB Shell'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 7.5, z: 0 }
    },
    {
      name: 'Wormhole Throat',
      description: 'An Einstein-Rosen bridge stabilised by exotic matter with negative energy density (violating the Null Energy Condition). Throat radius r₀ maintained above Planck length.',
      material: 'Exotic Matter / Negative Energy Density Field', function: 'Provides causal connection between our universe and the baby universe for energy extraction',
      assemblyOrder: 5, connections: ['Baby Universe Core', 'Exotic Matter Injectors', 'Energy Tethers'],
      failureEffect: 'Throat pinch-off — wormhole collapses to a singularity, severing energy supply permanently',
      cascadeFailures: ['Energy Extraction Tethers', 'Exotic Matter Injectors'],
      originalPosition: { x: 0, y: -1.5, z: 0 }, explodedPosition: { x: 0, y: -8, z: 0 }
    },
    {
      name: 'Energy Extraction Tethers',
      description: 'Six primary and twelve secondary quantum-entangled conduits that channel vacuum energy from the inflationary de Sitter space through the wormhole throat.',
      material: 'Quantum-Coherent Metamaterial', function: 'Transport extracted inflationary energy to the power manifold',
      assemblyOrder: 7, connections: ['Wormhole Throat', 'Power Output Manifold', 'Baby Universe Core'],
      failureEffect: 'Energy feedback loop — uncontrolled energy surge damages manifold and converter coils',
      cascadeFailures: ['Power Output Manifold', 'Superconductor Converter Coils'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 5, y: 0, z: 5 }
    },
    {
      name: 'Exotic Matter Injectors',
      description: 'Four high-pressure nozzles continuously injecting Casimir-effect-generated exotic matter (negative energy) to keep the wormhole throat open against gravitational collapse.',
      material: 'Casimir Cavity Arrays / Squeezed Vacuum States', function: 'Sustains traversability of the wormhole by violating the Average Null Energy Condition',
      assemblyOrder: 6, connections: ['Wormhole Throat', 'Base Power Supply'],
      failureEffect: 'Without exotic matter replenishment, the wormhole throat contracts and pinches off within ~10⁻⁴³ seconds',
      cascadeFailures: ['Wormhole Throat'],
      originalPosition: { x: 0, y: -2, z: 0 }, explodedPosition: { x: 4, y: -6, z: 4 }
    },
    {
      name: 'Power Output Manifold',
      description: 'Toroidal superconductor bus with 8 helical converter coils transforming raw vacuum energy into usable electrical output at ~10²⁶ watts.',
      material: 'Room-Temperature Superconductor (LK-99 derivative)', function: 'Converts inflationary vacuum energy to electromagnetic output',
      assemblyOrder: 10, connections: ['Energy Tethers', 'Output Terminals'],
      failureEffect: 'Superconductor quench — explosive energy release as stored magnetic field collapses',
      cascadeFailures: ['Output Terminals', 'Control Systems'],
      originalPosition: { x: 0, y: 3, z: 0 }, explodedPosition: { x: 0, y: 10, z: 0 }
    },
    {
      name: 'Containment Field Emitters',
      description: 'Three toroidal and six poloidal magnetic coils generating a 10¹⁵ Tesla containment field to prevent the baby universe from breaching the hull.',
      material: 'Neutronium-Core Electromagnets', function: 'Magnetic confinement of the baby universe\'s expanding boundary',
      assemblyOrder: 3, connections: ['Containment Hull', 'Inner Thermal Shell'],
      failureEffect: 'Containment field collapse — baby universe boundary expands freely, catastrophic hull rupture',
      cascadeFailures: ['Containment Hull', 'Reinforcement Ribs', 'All systems'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -5, y: 0, z: -5 }
    },
    {
      name: 'Observation Viewport',
      description: 'Gravitationally-lensed observation window with adaptive optics allowing direct visual inspection of the baby universe\'s CMB and large-scale structure formation.',
      material: 'Exotic-Matter-Stabilised Metamaterial Lens', function: 'Provides visual monitoring of the baby universe state',
      assemblyOrder: 4, connections: ['Containment Hull', 'Control Systems'],
      failureEffect: 'Viewport breach — localised hull failure at weakest point, radiation and energy leak',
      cascadeFailures: ['Containment Hull'],
      originalPosition: { x: 0, y: 0, z: 3.5 }, explodedPosition: { x: 0, y: 0, z: 9 }
    },
    {
      name: 'Quantum Fluctuation Field',
      description: 'The primordial quantum fluctuations δφ in the inflaton field that seed structure formation in the baby universe — density perturbations with near scale-invariant spectrum n_s ≈ 0.965.',
      material: 'Quantum Vacuum Fluctuations', function: 'Source of density perturbations; their statistics confirm slow-roll inflation is active',
      assemblyOrder: 11, connections: ['Inflation Field Shell', 'Baby Universe Core'],
      failureEffect: 'If fluctuations grow super-horizon, they can nucleate bubble universes within the baby universe — uncontrolled multiverse branching',
      cascadeFailures: ['Baby Universe Core'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 3, y: 8, z: 3 }
    },
    {
      name: 'Inner Thermal Shell',
      description: 'Secondary containment layer with active cooling channels rated for 10¹² K surface temperatures from proximity to the baby universe\'s inflationary boundary.',
      material: 'Hafnium-Carbide / Graphene Composite', function: 'Thermal management and secondary structural containment',
      assemblyOrder: 2, connections: ['Containment Hull', 'Containment Field Emitters'],
      failureEffect: 'Thermal runaway — outer hull weakens from heat transfer, structural integrity compromised',
      cascadeFailures: ['Containment Hull'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 1, z: 0 }
    },
    {
      name: 'Reinforcement Ribs',
      description: '16 longitudinal and 8 latitudinal high-tensile ribs distributing pressure loads from the contained inflationary expansion across the hull surface.',
      material: 'Carbon Nanotube Reinforced Titanium', function: 'Structural load distribution under extreme internal pressure',
      assemblyOrder: 2, connections: ['Containment Hull'],
      failureEffect: 'Localised hull bulging and eventual catastrophic rupture at weakest panel',
      cascadeFailures: ['Containment Hull', 'Armour Tiles'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 2, y: 2, z: 2 }
    },
    {
      name: 'Gravity Wave Antennae',
      description: 'Four dipole interferometric arms detecting gravitational wave signatures from the baby universe — primordial tensor perturbations with tensor-to-scalar ratio r < 0.06.',
      material: 'Laser Interferometer / Fused Silica', function: 'Monitors gravitational wave background from baby universe for diagnostic data',
      assemblyOrder: 12, connections: ['Control Systems', 'Containment Hull'],
      failureEffect: 'Loss of diagnostic capability — operators lose early warning of inflationary instabilities',
      cascadeFailures: ['Control Systems'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 8, y: 3, z: 8 }
    },
    {
      name: 'Control Systems',
      description: 'Operator console with holographic displays showing real-time inflation parameters (Hubble rate H, slow-roll parameters ε and η, e-folding count N).',
      material: 'Quantum Processor / Holographic Display', function: 'Real-time monitoring and control of all battery subsystems',
      assemblyOrder: 13, connections: ['All subsystems'],
      failureEffect: 'Loss of monitoring — system continues on autopilot but operators cannot intervene during anomalies',
      cascadeFailures: [],
      originalPosition: { x: 5.5, y: -2, z: 0 }, explodedPosition: { x: 12, y: -2, z: 0 }
    },
    {
      name: 'Base Platform & Support Pylons',
      description: 'Hexagonal base platform with 6 shock-absorbing pylons rated for 10⁸ N static load, isolating the containment vessel from seismic and operational vibrations.',
      material: 'Tungsten-Reinforced Ferrocrete', function: 'Structural support and vibration isolation',
      assemblyOrder: 0, connections: ['Containment Hull', 'Control Systems'],
      failureEffect: 'Structural collapse — entire device falls, potentially rupturing containment from mechanical shock',
      cascadeFailures: ['Containment Hull', 'Wormhole Throat'],
      originalPosition: { x: 0, y: -3.8, z: 0 }, explodedPosition: { x: 0, y: -12, z: 0 }
    },
    {
      name: 'Radiation Shields',
      description: 'Eight curved depleted-uranium/lead composite panels absorbing Hawking radiation and high-energy particles emitted from the wormhole throat event horizon.',
      material: 'Depleted Uranium / Lead Composite', function: 'Radiation protection for operators and external equipment',
      assemblyOrder: 4, connections: ['Containment Hull', 'Safety Systems'],
      failureEffect: 'Lethal radiation exposure to operators — immediate evacuation required',
      cascadeFailures: ['Control Systems'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -4, y: 0, z: -4 }
    }
  ];

  // ========================================================================
  //  QUIZ QUESTIONS — PhD-level Cosmology
  // ========================================================================

  const quizQuestions = [
    {
      question: 'In slow-roll inflation, the two slow-roll parameters are defined as ε = (M²_Pl / 2)(V\'/V)² and η = M²_Pl (V\'\'/V). For inflation to persist, which conditions must BOTH be satisfied, and what physical quantity do they constrain?',
      options: [
        'ε ≪ 1 and η ≪ 1 — they ensure the inflaton field rolls slowly compared to the Hubble friction, keeping the equation of state w ≈ −1 so spacetime undergoes quasi-de Sitter expansion',
        'ε > 1 and η > 1 — fast roll is needed for rapid expansion',
        'ε ≪ 1 and η > 1 — mixed regime drives reheating',
        'ε = 0 exactly and η = 0 exactly — perfect de Sitter space'
      ],
      correctAnswer: 0,
      explanation: 'Slow-roll inflation requires both ε ≪ 1 (flatness of potential relative to field displacement) and |η| ≪ 1 (small curvature of the potential). Together they guarantee that the inflaton\'s kinetic energy (½φ̇²) remains much smaller than its potential V(φ), giving an equation of state w ≈ −1 and exponential a(t) ∝ exp(Ht). Inflation ends when ε → 1.'
    },
    {
      question: 'A Micro Universe Battery extracts energy through a traversable wormhole. According to the Morris-Thorne metric, what fundamental physical requirement must be met to keep the wormhole throat open, and which energy condition does it violate?',
      options: [
        'The throat requires exotic matter with negative energy density (ρ < 0), which violates the Null Energy Condition (NEC): T_μν k^μ k^ν ≥ 0 for all null vectors k^μ',
        'It requires ordinary matter at very high density, violating the Strong Energy Condition',
        'It needs a cosmological constant Λ < 0 (anti-de Sitter space)',
        'Dark matter halos are sufficient to keep it open by gravitational lensing'
      ],
      correctAnswer: 0,
      explanation: 'Morris & Thorne (1988) showed that a static, spherically symmetric traversable wormhole requires matter threading the throat that violates the Null Energy Condition (NEC). Specifically, the radial tension τ must exceed the energy density ρc², meaning ρ + p_r/c² < 0 — "exotic matter." The Casimir effect between conducting plates is one known physical realisation of NEC-violating quantum fields, though the quantities produced are vanishingly small.'
    },
    {
      question: 'After slow-roll inflation ends in the baby universe, the inflaton field oscillates around the minimum of V(φ) and decays into Standard Model particles — a process called reheating. What determines the reheating temperature T_rh, and why is it cosmologically significant?',
      options: [
        'T_rh is set by the inflaton decay rate Γ_φ via T_rh ~ (Γ_φ M_Pl)^{1/2}; it must be high enough for baryogenesis (T_rh > 10⁹ GeV for thermal leptogenesis) but low enough to avoid overproduction of gravitinos in SUSY models (T_rh < 10⁹ GeV)',
        'T_rh is always exactly the Planck temperature regardless of the inflation model',
        'T_rh is irrelevant because the universe reaches thermal equilibrium instantly',
        'T_rh depends only on the number of e-foldings during inflation'
      ],
      correctAnswer: 0,
      explanation: 'Reheating occurs as the inflaton coherently oscillates and perturbatively (or via parametric resonance / preheating) decays. The reheating temperature T_rh ≈ 0.2 (Γ_φ M_Pl)^{1/2} depends on the inflaton\'s coupling to decay products. This temperature is critical: too low and you cannot generate the baryon asymmetry; too high and in supersymmetric models the gravitino problem arises from thermal overproduction of gravitinos whose late decays would spoil Big Bang Nucleosynthesis.'
    },
    {
      question: 'The baby universe\'s quantum fluctuations produce a nearly scale-invariant power spectrum P(k) ∝ k^{n_s - 1}. Planck 2018 measured n_s = 0.9649 ± 0.0042. What does the deviation from exact scale invariance (n_s = 1) physically encode?',
      options: [
        'The deviation n_s − 1 ≈ −2ε − η encodes the time-dependence of the Hubble parameter during inflation — modes that exit the horizon at different times experience slightly different expansion rates, breaking exact scale invariance',
        'It is caused by quantum gravity corrections at the Planck scale only',
        'It reflects the temperature of the CMB at recombination, not inflation',
        'Scale invariance is broken by the finite age of the universe, not by inflationary dynamics'
      ],
      correctAnswer: 0,
      explanation: 'In single-field slow-roll inflation, n_s − 1 = −2ε − η to first order. Because the inflaton rolls during inflation, both H(t) and V(φ) change slightly between the time large-scale and small-scale modes exit the Hubble horizon. This gives a "tilt" to the power spectrum. The observed red tilt (n_s < 1) rules out exact de Sitter inflation and constrains the shape of V(φ). For example, the simplest m²φ² model predicts n_s ≈ 1 − 2/N ≈ 0.967 for N = 60 e-folds, consistent with Planck.'
    },
    {
      question: 'Creating a baby universe in the laboratory (as proposed by Farhi, Guth, and Guven, 1990) faces a fundamental obstruction from classical general relativity. What is it, and how might quantum tunnelling circumvent it?',
      options: [
        'Classically, creating a closed inflating region requires an initial singularity (a theorem by Penrose) — the region must be behind a black hole horizon. However, quantum tunnelling (analogous to Coleman-De Luccia bubble nucleation) can allow a false-vacuum bubble to tunnel through the classically-forbidden regime and inflate on the other side of the horizon, creating a causally disconnected baby universe',
        'It is impossible because energy conservation forbids creating new spacetimes',
        'Classical GR allows easy baby universe creation if you supply enough mass',
        'The obstruction is the speed of light limit, which quantum mechanics removes entirely'
      ],
      correctAnswer: 0,
      explanation: 'Farhi & Guth (1987) showed that initiating inflation inside a bubble in an asymptotically flat spacetime classically requires starting from a singularity. Farhi, Guth, & Guven (1990) then proposed that quantum tunnelling could bypass this: a region of false vacuum, though classically collapsing to a singularity, has a non-zero amplitude to tunnel to an inflating de Sitter state on the "other side" of a black hole horizon. The baby universe then inflates in a causally disconnected spacetime. The tunnelling rate depends exponentially on the action of the instanton, S_E ≈ −24π² M⁴_Pl / V(φ_false), making it vastly suppressed for sub-Planckian energy densities.'
    }
  ];

  // ========================================================================
  //  DESCRIPTION
  // ========================================================================

  const description = `The Micro Universe Battery is a theoretical apex-tier energy device that contains a causally disconnected baby universe — a pocket cosmos undergoing controlled inflationary expansion. The vacuum energy released by the baby universe's de Sitter expansion (driven by a scalar inflaton field in slow-roll) is extracted through a stabilised Einstein-Rosen bridge (traversable wormhole) threaded with exotic matter violating the Null Energy Condition. The device includes a multi-layer titanium-iridium containment hull rated for Planck-scale energy densities, magnetic confinement emitters generating 10¹⁵ T fields, a toroidal superconductor power manifold converting vacuum energy to ~10²⁶ W electrical output, gravitational wave antennae monitoring primordial tensor perturbations, and a full operator control system displaying real-time inflation parameters (Hubble rate H, slow-roll parameters ε and η, e-folding count N, and reheating temperature T_rh). The baby universe's quantum fluctuations (with near scale-invariant spectrum n_s ≈ 0.965) are visible through a gravitationally-lensed observation viewport.`;

  // ========================================================================
  //  ANIMATE — extreme synchronised animation
  // ========================================================================

  function animate(time, speed, _meshes) {
    const t = time * speed;

    // ── Baby Universe Core Expansion Pulse ──
    if (meshes.plasma) {
      const breathe = 1.0 + 0.15 * Math.sin(t * 1.2) + 0.05 * Math.sin(t * 3.7);
      meshes.plasma.scale.setScalar(breathe);
      meshes.plasma.material.emissiveIntensity = 2.5 + 1.5 * Math.sin(t * 2.0);
      meshes.plasma.rotation.y = t * 0.3;
      meshes.plasma.rotation.x = t * 0.15;
    }

    // ── Inflation Field Shell — slow expansion with wobble ──
    if (meshes.inflationShell) {
      const infScale = 1.0 + 0.1 * Math.sin(t * 0.8) + 0.06 * Math.sin(t * 2.5);
      meshes.inflationShell.scale.setScalar(infScale);
      meshes.inflationShell.rotation.y = -t * 0.2;
      meshes.inflationShell.rotation.z = t * 0.12;
      meshes.inflationShell.material.emissiveIntensity = 1.5 + Math.sin(t * 1.5);
    }

    // ── CMB Shell — rotate and pulse opacity ──
    if (meshes.cmb) {
      meshes.cmb.rotation.y = t * 0.15;
      meshes.cmb.rotation.x = t * 0.08;
      const cmbScale = 1.0 + 0.08 * Math.sin(t * 0.6);
      meshes.cmb.scale.setScalar(cmbScale);
      meshes.cmb.material.opacity = 0.15 + 0.12 * Math.sin(t * 1.2);
    }

    // ── Dark Energy Envelope — slow breathing ──
    if (meshes.darkEnvelope) {
      meshes.darkEnvelope.scale.setScalar(1.0 + 0.05 * Math.sin(t * 0.4));
      meshes.darkEnvelope.rotation.y = -t * 0.1;
    }

    // ── Quantum Fluctuation Particles — shimmer and drift ──
    if (meshes.fluctuations) {
      meshes.fluctuations.children.forEach(f => {
        const ud = f.userData;
        const phase = ud.phase + t * ud.speed;
        const r = ud.baseRad * (1.0 + 0.3 * Math.sin(phase));
        const phi = ud.phase + t * 0.5;
        const cosT = Math.cos(phase * 0.3);
        const sinT = Math.sin(phase * 0.3 + ud.phase);
        f.position.set(
          r * sinT * Math.cos(phi),
          r * cosT,
          r * sinT * Math.sin(phi)
        );
        f.material.emissiveIntensity = 2.0 + 2.5 * Math.sin(phase * 2);
        f.scale.setScalar(0.8 + 0.5 * Math.sin(phase * 3));
      });
    }

    // ── Wormhole Throat — stabiliser rings pulse sequentially ──
    if (meshes.throat) {
      meshes.throat.children.forEach(child => {
        if (child.userData && child.userData.idx !== undefined) {
          const ri = child.userData.idx;
          child.rotation.z = t * (0.5 + ri * 0.15);
          if (child.material && child.material.emissiveIntensity !== undefined) {
            child.material.emissiveIntensity = 1.5 + 1.5 * Math.sin(t * 2.0 + ri * 0.5);
          }
        }
      });
    }

    // ── Energy Tethers — pulsing glow ──
    if (meshes.tethers) {
      meshes.tethers.children.forEach(child => {
        if (child.userData && child.userData.tetherIndex !== undefined) {
          const phase = child.userData.phase || 0;
          if (child.material) {
            child.material.emissiveIntensity = 1.5 + 2.0 * Math.sin(t * 3.0 + phase);
            child.material.opacity = 0.5 + 0.4 * Math.sin(t * 2.5 + phase);
          }
        }
      });
    }

    // ── Wavefront Expansion Animation ──
    if (meshes.wavefronts) {
      meshes.wavefronts.forEach(wf => {
        const wi = wf.userData.idx;
        const cycle = (t * 0.3 + wi * 0.4) % 3.0;
        const scale = wf.userData.baseScale * (0.6 + cycle * 0.5);
        wf.scale.setScalar(scale);
        wf.material.opacity = Math.max(0.02, 0.4 - cycle * 0.12);
        wf.rotation.y = t * 0.1 * (wi + 1);
        wf.rotation.x = t * 0.07 * (wi + 1);
      });
    }

    // ── Potential Surface — gentle undulation ──
    if (meshes.potentialSurface) {
      meshes.potentialSurface.rotation.z = t * 0.08;
      meshes.potentialSurface.position.y = 3.8 + 0.1 * Math.sin(t * 0.5);
    }

    // ── Particle Streams — flow outward along tether directions ──
    if (meshes.particles) {
      meshes.particles.forEach(p => {
        const ud = p.userData;
        const flowT = ((t * ud.speed + ud.radOffset * 6.28) % 6.28) / 6.28;
        const tetherAngle = (Math.PI * 2 / 6) * ud.tether;
        const r = 0.7 + flowT * 2.5;
        p.position.set(
          Math.cos(tetherAngle) * r + Math.sin(t * 2 + ud.phi) * 0.08,
          0.15 * Math.sin(ud.theta + t) + Math.sin(flowT * Math.PI) * 0.3,
          Math.sin(tetherAngle) * r + Math.cos(t * 2 + ud.theta) * 0.08
        );
        p.material.emissiveIntensity = 3.0 + 3.0 * Math.sin(t * 5 + ud.phi);
        p.scale.setScalar(0.6 + 0.5 * (1 - flowT));
      });
    }

    // ── Containment Hull — subtle strain vibration ──
    if (meshes.hull) {
      meshes.hull.scale.setScalar(1.0 + 0.003 * Math.sin(t * 8) + 0.002 * Math.sin(t * 13));
    }

    // ── Holographic Ring — rotation ──
    if (meshes.holoRing) {
      meshes.holoRing.rotation.z = t * 0.15;
      meshes.holoRing.material.opacity = 0.3 + 0.25 * Math.sin(t * 1.5);
    }

    // ── Antennae tips — oscillate ──
    if (meshes.antennae) {
      meshes.antennae.children.forEach((child, i) => {
        if (child.geometry && child.geometry.type === 'OctahedronGeometry') {
          child.rotation.y = t * 2;
          child.rotation.x = t * 1.5;
          if (child.material) {
            child.material.emissiveIntensity = 2.5 + 2.0 * Math.sin(t * 4 + i);
          }
        }
      });
    }

    // ── Output Bus — slow rotation ──
    if (meshes.outputBus) {
      meshes.outputBus.rotation.z = t * 0.2;
    }

    // ── Viewport Lens — glow with core brightness ──
    if (meshes.viewportLens) {
      meshes.viewportLens.material.emissiveIntensity = 0.4 + 0.5 * Math.sin(t * 1.2);
    }

    // ── Shutters — gentle open/close cycle ──
    if (meshes.shutters) {
      meshes.shutters.children.forEach((shutter, i) => {
        const openFactor = 0.5 + 0.5 * Math.sin(t * 0.3);
        const angle = (Math.PI * 2 / 8) * i;
        shutter.position.set(
          Math.cos(angle) * (0.75 + openFactor * 0.5),
          Math.sin(angle) * (0.75 + openFactor * 0.5),
          3.6
        );
      });
    }

    // ── Emitter coils — rotate slowly ──
    if (meshes.emitters) {
      meshes.emitters.rotation.y = t * 0.05;
    }

    // ── Injector nozzle glow pulse ──
    if (meshes.injectors) {
      meshes.injectors.children.forEach((nozzle, i) => {
        nozzle.children.forEach(child => {
          if (child.material && child.material.emissiveIntensity !== undefined) {
            child.material.emissiveIntensity = 2.0 + 2.0 * Math.sin(t * 3.5 + i * 1.57);
          }
        });
      });
    }

    // ── LED warning lights blink pattern ──
    if (meshes.controls) {
      meshes.controls.children.forEach(child => {
        if (child.userData && child.userData.ledIdx !== undefined) {
          const ledI = child.userData.ledIdx;
          const blinkRate = ledI % 3 === 0 ? 6 : (ledI % 3 === 1 ? 3 : 1.5);
          child.material.emissiveIntensity = 1.5 + 2.5 * Math.max(0, Math.sin(t * blinkRate + ledI * 0.5));
        }
      });
    }
  }

  // ========================================================================
  //  RETURN
  // ========================================================================

  return { group, parts, description, quizQuestions, animate };
}
