// ============================================================================
// GOD TIER — FTL SUBSPACE CATAPULT
// An enormous orbital linear-accelerator that rips open a subspace corridor
// and launches starships at faster-than-light velocities.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/* ---------- custom hi-tech materials ------------------------------------ */
function _glow(hex, intensity = 2.5) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: intensity,
    metalness: 0.3, roughness: 0.25, transparent: true, opacity: 0.92
  });
}
function _hologram(hex) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: 3.8,
    metalness: 0.0, roughness: 0.1, transparent: true, opacity: 0.35,
    side: THREE.DoubleSide, wireframe: true
  });
}
function _panel(hex) {
  return new THREE.MeshStandardMaterial({
    color: hex, metalness: 0.85, roughness: 0.12
  });
}

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ---- colour palette ----
  const matCyan       = _glow(0x00ffff, 3.0);
  const matMagenta    = _glow(0xff00ff, 2.8);
  const matPlasmaBlue = _glow(0x3388ff, 4.0);
  const matViolet     = _glow(0x9944ff, 3.5);
  const matOrange     = _glow(0xff6600, 2.2);
  const matGreenGlow  = _glow(0x00ff88, 2.0);
  const matRedWarn    = _glow(0xff2200, 3.0);
  const matHoloCyan   = _hologram(0x00ffff);
  const matHoloViolet = _hologram(0xaa44ff);
  const matHullDark   = _panel(0x1a1a2e);
  const matHullMid    = _panel(0x2a2a44);
  const matHullLight  = _panel(0x44446a);
  const matCopper     = _panel(0xcc7744);
  const matGold       = _panel(0xddaa33);

  // ======================================================================
  //  1.  MAIN BARREL — LINEAR ACCELERATOR (LatheGeometry spine)
  // ======================================================================
  const barrelLen = 28;
  const barrelPts = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const x = t * barrelLen - barrelLen / 2;
    // profile tapers from breach (wide) to muzzle (narrow then flared)
    let r = 1.6 - 0.5 * t + 0.35 * Math.sin(t * Math.PI * 6) * (1 - t);
    if (t > 0.92) r += (t - 0.92) * 12;          // muzzle flare
    barrelPts.push(new THREE.Vector2(r, x));
  }
  const barrelGeo = new THREE.LatheGeometry(barrelPts, 48);
  const barrelMesh = new THREE.Mesh(barrelGeo, matHullDark);
  barrelMesh.rotation.z = Math.PI / 2;
  group.add(barrelMesh);
  meshes.barrel = barrelMesh;

  // inner bore glow cylinder
  const boreGeo = new THREE.CylinderGeometry(0.72, 0.72, barrelLen, 48, 1, true);
  const boreMesh = new THREE.Mesh(boreGeo, matCyan.clone());
  boreMesh.material.transparent = true; boreMesh.material.opacity = 0.18;
  boreMesh.rotation.z = Math.PI / 2;
  group.add(boreMesh);
  meshes.bore = boreMesh;

  // ---- electromagnetic coil rings along the barrel ----
  const coilGroup = new THREE.Group();
  const coilCount = 56;
  for (let i = 0; i < coilCount; i++) {
    const t = i / (coilCount - 1);
    const xPos = t * barrelLen - barrelLen / 2;
    const outerR = 1.85 - 0.4 * t + 0.3 * Math.sin(t * Math.PI * 6) * (1 - t);
    const torusGeo = new THREE.TorusGeometry(outerR + 0.15, 0.07, 8, 32);
    const mat = (i % 4 === 0) ? matCyan.clone() : matCopper.clone();
    const ring = new THREE.Mesh(torusGeo, mat);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = xPos;
    coilGroup.add(ring);
  }
  group.add(coilGroup);
  meshes.coils = coilGroup;

  // ---- superconducting rails (4 pairs) running along the barrel ----
  const railGroup = new THREE.Group();
  for (let r = 0; r < 8; r++) {
    const angle = (r / 8) * Math.PI * 2;
    const railPath = new THREE.CatmullRomCurve3(
      Array.from({ length: 50 }, (_, i) => {
        const t = i / 49;
        const x = t * barrelLen - barrelLen / 2;
        const baseR = 1.05 - 0.25 * t;
        return new THREE.Vector3(x, Math.cos(angle) * baseR, Math.sin(angle) * baseR);
      })
    );
    const railGeo = new THREE.TubeGeometry(railPath, 100, 0.04, 6, false);
    const railMesh = new THREE.Mesh(railGeo, r % 2 === 0 ? matGold : matCopper);
    railGroup.add(railMesh);
  }
  group.add(railGroup);
  meshes.rails = railGroup;

  // ======================================================================
  //  2.  MUZZLE APERTURE — SUBSPACE TEAR GENERATOR
  // ======================================================================
  const muzzleGroup = new THREE.Group();
  muzzleGroup.position.x = barrelLen / 2 + 1.0;

  // outer aperture ring — thick torus
  const apertureGeo = new THREE.TorusGeometry(3.0, 0.35, 24, 64);
  const apertureMesh = new THREE.Mesh(apertureGeo, darkSteel);
  apertureMesh.rotation.y = Math.PI / 2;
  muzzleGroup.add(apertureMesh);

  // concentric stabiliser rings
  for (let i = 0; i < 5; i++) {
    const sr = 3.0 - i * 0.45;
    const stGeo = new THREE.TorusGeometry(sr, 0.06, 12, 64);
    const stMesh = new THREE.Mesh(stGeo, i % 2 === 0 ? matViolet : matMagenta);
    stMesh.rotation.y = Math.PI / 2;
    stMesh.position.x = i * 0.35;
    muzzleGroup.add(stMesh);
  }

  // subspace tear — animated disc (IcosahedronGeometry for distortion)
  const tearGeo = new THREE.IcosahedronGeometry(2.2, 5);
  const tearMat = new THREE.MeshStandardMaterial({
    color: 0x6600ff, emissive: 0x6600ff, emissiveIntensity: 5,
    metalness: 0.0, roughness: 0.0, transparent: true, opacity: 0.0,
    wireframe: true, side: THREE.DoubleSide
  });
  const tearMesh = new THREE.Mesh(tearGeo, tearMat);
  tearMesh.rotation.y = Math.PI / 2;
  tearMesh.position.x = 1.5;
  muzzleGroup.add(tearMesh);
  meshes.tear = tearMesh;

  // secondary tear glow sphere
  const tearGlowGeo = new THREE.SphereGeometry(1.8, 32, 32);
  const tearGlowMat = new THREE.MeshStandardMaterial({
    color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 4,
    transparent: true, opacity: 0.0
  });
  const tearGlow = new THREE.Mesh(tearGlowGeo, tearGlowMat);
  tearGlow.position.x = 1.5;
  muzzleGroup.add(tearGlow);
  meshes.tearGlow = tearGlow;

  // field emitter prongs (12 around the aperture)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const prongShape = new THREE.Shape();
    prongShape.moveTo(0, 0);
    prongShape.lineTo(0.08, 0);
    prongShape.lineTo(0.04, 1.8);
    prongShape.lineTo(-0.04, 1.8);
    prongShape.lineTo(-0.08, 0);
    const extSettings = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 3 };
    const prongGeo = new THREE.ExtrudeGeometry(prongShape, extSettings);
    const prong = new THREE.Mesh(prongGeo, chrome);
    prong.position.set(0, Math.cos(a) * 3.2, Math.sin(a) * 3.2);
    prong.lookAt(new THREE.Vector3(0, 0, 0));
    prong.rotateX(Math.PI / 2);
    muzzleGroup.add(prong);
  }

  group.add(muzzleGroup);
  meshes.muzzle = muzzleGroup;

  // ======================================================================
  //  3.  BREACH / LOADING DOCK (rear of barrel)
  // ======================================================================
  const breachGroup = new THREE.Group();
  breachGroup.position.x = -barrelLen / 2 - 2.5;

  // large breach housing — octagonal extrusion
  const bShape = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const px = Math.cos(a) * 3.0, py = Math.sin(a) * 3.0;
    i === 0 ? bShape.moveTo(px, py) : bShape.lineTo(px, py);
  }
  bShape.closePath();
  const breachHousing = new THREE.Mesh(
    new THREE.ExtrudeGeometry(bShape, { depth: 5, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.1, bevelSegments: 4 }),
    matHullMid
  );
  breachHousing.rotation.y = Math.PI / 2;
  breachHousing.position.x = -2.5;
  breachGroup.add(breachHousing);

  // loading bay doors (2 halves)
  for (let side = -1; side <= 1; side += 2) {
    const doorGeo = new THREE.BoxGeometry(0.12, 2.5, 4.5);
    const door = new THREE.Mesh(doorGeo, matHullLight);
    door.position.set(-0.5, side * 1.35, 0);
    breachGroup.add(door);
  }

  // guide rails inside breach
  for (let gr = 0; gr < 4; gr++) {
    const ga = (gr / 4) * Math.PI * 2 + Math.PI / 8;
    const grGeo = new THREE.CylinderGeometry(0.06, 0.06, 5, 8);
    const grMesh = new THREE.Mesh(grGeo, matGold);
    grMesh.rotation.z = Math.PI / 2;
    grMesh.position.set(-2.5, Math.cos(ga) * 1.2, Math.sin(ga) * 1.2);
    breachGroup.add(grMesh);
  }

  group.add(breachGroup);
  meshes.breach = breachGroup;

  // ======================================================================
  //  4.  SHIP / PROJECTILE (accelerated along the barrel)
  // ======================================================================
  const shipGroup = new THREE.Group();

  // fuselage — LatheGeometry teardrop
  const shipPts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const r = 0.45 * Math.sin(t * Math.PI) * (1 - 0.3 * t);
    shipPts.push(new THREE.Vector2(r, t * 3.2 - 1.6));
  }
  const shipBodyGeo = new THREE.LatheGeometry(shipPts, 24);
  const shipBody = new THREE.Mesh(shipBodyGeo, aluminum);
  shipBody.rotation.z = Math.PI / 2;
  shipGroup.add(shipBody);

  // cockpit canopy
  const canopyGeo = new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const canopy = new THREE.Mesh(canopyGeo, tinted);
  canopy.position.set(-0.8, 0.28, 0);
  canopy.rotation.z = -Math.PI / 4;
  shipGroup.add(canopy);

  // engine nacelles
  for (let s = -1; s <= 1; s += 2) {
    const nacGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.2, 12);
    const nac = new THREE.Mesh(nacGeo, darkSteel);
    nac.rotation.z = Math.PI / 2;
    nac.position.set(0.8, s * 0.35, s * 0.15);
    shipGroup.add(nac);
    // engine glow
    const engGeo = new THREE.CircleGeometry(0.17, 16);
    const eng = new THREE.Mesh(engGeo, matCyan.clone());
    eng.position.set(1.42, s * 0.35, s * 0.15);
    eng.rotation.y = Math.PI / 2;
    shipGroup.add(eng);
  }

  // delta wings
  for (let s = -1; s <= 1; s += 2) {
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(1.2, s * 1.1);
    wingShape.lineTo(0.6, s * 1.15);
    wingShape.lineTo(-0.3, s * 0.2);
    wingShape.closePath();
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.03, bevelEnabled: false });
    const wing = new THREE.Mesh(wingGeo, matHullMid);
    wing.rotation.y = Math.PI / 2;
    wing.position.set(0, 0, 0);
    shipGroup.add(wing);
  }

  shipGroup.position.x = -barrelLen / 2 - 1;   // starts at breach
  group.add(shipGroup);
  meshes.ship = shipGroup;

  // ======================================================================
  //  5.  CAPACITOR BANKS (4 massive arrays flanking the barrel)
  // ======================================================================
  const capBankGroup = new THREE.Group();
  const capPositions = [
    { y: 3.2, z: 0 }, { y: -3.2, z: 0 },
    { y: 0, z: 3.2 }, { y: 0, z: -3.2 }
  ];
  capPositions.forEach((pos, bi) => {
    const bankG = new THREE.Group();
    // main housing
    const housingGeo = new THREE.BoxGeometry(12, 1.8, 1.8);
    const housing = new THREE.Mesh(housingGeo, matHullDark);
    bankG.add(housing);

    // individual capacitor cylinders (24 per bank)
    for (let c = 0; c < 24; c++) {
      const cx = (c / 23) * 10 - 5;
      const capGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.5, 12);
      const capMesh = new THREE.Mesh(capGeo, matCopper);
      capMesh.position.set(cx, 0, 0);
      bankG.add(capMesh);
      // top electrode
      const elGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const el = new THREE.Mesh(elGeo, matGreenGlow.clone());
      el.position.set(cx, 0.8, 0);
      bankG.add(el);
    }

    // power bus bars
    for (let pb = -1; pb <= 1; pb += 2) {
      const busGeo = new THREE.BoxGeometry(11, 0.08, 0.3);
      const bus = new THREE.Mesh(busGeo, matGold);
      bus.position.y = pb * 0.9;
      bankG.add(bus);
    }

    bankG.position.set(0, pos.y, pos.z);
    if (pos.z !== 0) bankG.rotation.x = Math.PI / 2;
    capBankGroup.add(bankG);
  });
  group.add(capBankGroup);
  meshes.capacitors = capBankGroup;

  // ======================================================================
  //  6.  HIGH-VOLTAGE FEED LINES — Capacitors to Coils
  // ======================================================================
  const feedGroup = new THREE.Group();
  capPositions.forEach((pos, fi) => {
    const startY = pos.y * 0.7, startZ = pos.z * 0.7;
    for (let seg = 0; seg < 6; seg++) {
      const sx = seg * 4 - 10;
      const feedPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sx, startY, startZ),
        new THREE.Vector3(sx, startY * 0.5, startZ * 0.5),
        new THREE.Vector3(sx, 0, 0)
      ]);
      const tubeGeo = new THREE.TubeGeometry(feedPath, 16, 0.04, 6, false);
      const tube = new THREE.Mesh(tubeGeo, fi % 2 === 0 ? matOrange : matCyan);
      feedGroup.add(tube);
    }
  });
  group.add(feedGroup);
  meshes.feedLines = feedGroup;

  // ======================================================================
  //  7.  STRUCTURAL TRUSSES & GANTRY
  // ======================================================================
  const trussGroup = new THREE.Group();
  const trussSpan = 34;
  // longitudinal beams
  for (let tb = 0; tb < 8; tb++) {
    const ta = (tb / 8) * Math.PI * 2;
    const tr = 4.2;
    const tGeo = new THREE.CylinderGeometry(0.06, 0.06, trussSpan, 6);
    const tMesh = new THREE.Mesh(tGeo, steel);
    tMesh.rotation.z = Math.PI / 2;
    tMesh.position.set(0, Math.cos(ta) * tr, Math.sin(ta) * tr);
    trussGroup.add(tMesh);
  }
  // cross braces every 2 units
  for (let xb = -16; xb <= 16; xb += 2) {
    for (let tb = 0; tb < 8; tb++) {
      const a1 = (tb / 8) * Math.PI * 2;
      const a2 = ((tb + 1) / 8) * Math.PI * 2;
      const tr = 4.2;
      const p1 = new THREE.Vector3(xb, Math.cos(a1) * tr, Math.sin(a1) * tr);
      const p2 = new THREE.Vector3(xb, Math.cos(a2) * tr, Math.sin(a2) * tr);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const len = p1.distanceTo(p2);
      const braceGeo = new THREE.CylinderGeometry(0.03, 0.03, len, 4);
      const brace = new THREE.Mesh(braceGeo, darkSteel);
      brace.position.copy(mid);
      brace.lookAt(p2);
      brace.rotateX(Math.PI / 2);
      trussGroup.add(brace);
    }
  }
  group.add(trussGroup);
  meshes.truss = trussGroup;

  // ======================================================================
  //  8.  CONTROL TOWER / BRIDGE
  // ======================================================================
  const towerGroup = new THREE.Group();
  towerGroup.position.set(-4, 5.5, 0);

  // tower body
  const towerBodyGeo = new THREE.CylinderGeometry(1.0, 1.3, 3.5, 12);
  const towerBody = new THREE.Mesh(towerBodyGeo, matHullMid);
  towerGroup.add(towerBody);

  // observation deck (tinted dome)
  const domeGeo = new THREE.SphereGeometry(1.05, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, tinted);
  dome.position.y = 1.75;
  towerGroup.add(dome);

  // antenna array
  for (let ant = 0; ant < 6; ant++) {
    const aGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.5 + ant * 0.2, 4);
    const aMesh = new THREE.Mesh(aGeo, chrome);
    aMesh.position.set(Math.cos(ant) * 0.5, 2.5 + ant * 0.15, Math.sin(ant) * 0.5);
    towerGroup.add(aMesh);
    // tip blinker
    const blinker = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), matRedWarn.clone());
    blinker.position.set(aMesh.position.x, aMesh.position.y + 0.75 + ant * 0.1, aMesh.position.z);
    towerGroup.add(blinker);
  }

  // control panel screens inside dome (simplified)
  for (let sp = 0; sp < 5; sp++) {
    const sAngle = (sp / 5) * Math.PI * 2;
    const screenGeo = new THREE.PlaneGeometry(0.35, 0.2);
    const screen = new THREE.Mesh(screenGeo, matGreenGlow.clone());
    screen.position.set(Math.cos(sAngle) * 0.6, 1.9, Math.sin(sAngle) * 0.6);
    screen.lookAt(towerGroup.position.clone().add(new THREE.Vector3(0, 1.9, 0)));
    towerGroup.add(screen);
  }

  // connecting strut to main barrel
  const strutPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.75, 0),
    new THREE.Vector3(0, -3.0, 0),
    new THREE.Vector3(0, -4.5, 0)
  ]);
  const strutGeo = new THREE.TubeGeometry(strutPath, 12, 0.12, 8, false);
  const strut = new THREE.Mesh(strutGeo, steel);
  towerGroup.add(strut);

  group.add(towerGroup);
  meshes.tower = towerGroup;

  // ======================================================================
  //  9.  REACTOR CORE (beneath barrel, massive sphere)
  // ======================================================================
  const reactorGroup = new THREE.Group();
  reactorGroup.position.set(0, -5.0, 0);

  const coreGeo = new THREE.IcosahedronGeometry(2.0, 3);
  const coreMesh = new THREE.Mesh(coreGeo, matPlasmaBlue);
  reactorGroup.add(coreMesh);
  meshes.reactorCore = coreMesh;

  // containment shell
  const containGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const containMesh = new THREE.Mesh(containGeo, matHoloCyan);
  reactorGroup.add(containMesh);
  meshes.containment = containMesh;

  // magnetic confinement rings
  for (let mr = 0; mr < 3; mr++) {
    const mGeo = new THREE.TorusGeometry(2.6, 0.08, 8, 48);
    const mMesh = new THREE.Mesh(mGeo, matMagenta);
    mMesh.rotation.set(mr * Math.PI / 3, mr * 0.5, 0);
    reactorGroup.add(mMesh);
  }

  // cooling radiator fins (8 fins)
  for (let rf = 0; rf < 8; rf++) {
    const rAngle = (rf / 8) * Math.PI * 2;
    const finGeo = new THREE.BoxGeometry(0.05, 3.5, 1.2);
    const fin = new THREE.Mesh(finGeo, matHullLight);
    fin.position.set(Math.cos(rAngle) * 3.0, 0, Math.sin(rAngle) * 3.0);
    fin.rotation.y = -rAngle;
    reactorGroup.add(fin);
  }

  // power conduit up to barrel
  const conduitPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.5, 0),
    new THREE.Vector3(0, 3.5, 0),
    new THREE.Vector3(0, 5.0, 0)
  ]);
  const conduitGeo = new THREE.TubeGeometry(conduitPath, 12, 0.15, 8, false);
  const conduit = new THREE.Mesh(conduitGeo, matOrange);
  reactorGroup.add(conduit);

  group.add(reactorGroup);
  meshes.reactor = reactorGroup;

  // ======================================================================
  // 10.  SUBSPACE FIELD STABILISER PYLONS (6 around the muzzle)
  // ======================================================================
  const pylonGroup = new THREE.Group();
  pylonGroup.position.x = barrelLen / 2 + 1.0;
  for (let p = 0; p < 6; p++) {
    const pa = (p / 6) * Math.PI * 2;
    const pylonG = new THREE.Group();

    // main pylon arm
    const armGeo = new THREE.CylinderGeometry(0.12, 0.08, 5.5, 8);
    const arm = new THREE.Mesh(armGeo, darkSteel);
    arm.position.set(0, 2.75, 0);
    pylonG.add(arm);

    // field emitter tip
    const tipGeo = new THREE.OctahedronGeometry(0.3, 1);
    const tip = new THREE.Mesh(tipGeo, matViolet);
    tip.position.y = 5.6;
    pylonG.add(tip);

    // energy conduit glow line
    const condGeo = new THREE.CylinderGeometry(0.03, 0.03, 5.5, 6);
    const condMesh = new THREE.Mesh(condGeo, matMagenta.clone());
    condMesh.position.y = 2.75;
    pylonG.add(condMesh);

    pylonG.position.set(0, Math.cos(pa) * 3.8, Math.sin(pa) * 3.8);
    pylonG.lookAt(new THREE.Vector3(pylonGroup.position.x, 0, 0));
    pylonG.rotateX(Math.PI / 2);
    pylonGroup.add(pylonG);
  }
  group.add(pylonGroup);
  meshes.pylons = pylonGroup;

  // ======================================================================
  // 11.  PARTICLE ACCELERATOR RING (Toroidal storage ring at mid-barrel)
  // ======================================================================
  const ringGroup = new THREE.Group();
  const mainRingGeo = new THREE.TorusGeometry(5.5, 0.2, 16, 96);
  const mainRing = new THREE.Mesh(mainRingGeo, darkSteel);
  mainRing.rotation.y = Math.PI / 2;
  ringGroup.add(mainRing);

  // beam pipe
  const beamPipeGeo = new THREE.TorusGeometry(5.5, 0.08, 8, 96);
  const beamPipe = new THREE.Mesh(beamPipeGeo, matCyan);
  beamPipe.rotation.y = Math.PI / 2;
  ringGroup.add(beamPipe);

  // dipole magnets (24 around ring)
  for (let dm = 0; dm < 24; dm++) {
    const da = (dm / 24) * Math.PI * 2;
    const dGeo = new THREE.BoxGeometry(0.6, 0.5, 0.35);
    const dMesh = new THREE.Mesh(dGeo, matCopper);
    dMesh.position.set(0, Math.cos(da) * 5.5, Math.sin(da) * 5.5);
    dMesh.lookAt(new THREE.Vector3(0, 0, 0));
    ringGroup.add(dMesh);
  }

  ringGroup.position.x = -2;
  group.add(ringGroup);
  meshes.acceleratorRing = ringGroup;

  // ======================================================================
  // 12.  EXOTIC MATTER CONTAINMENT PODS (pair, flanking breach)
  // ======================================================================
  const podGroup = new THREE.Group();
  for (let side = -1; side <= 1; side += 2) {
    const podG = new THREE.Group();
    // containment vessel
    const vesselGeo = new THREE.CapsuleGeometry(0.7, 2.5, 16, 24);
    const vessel = new THREE.Mesh(vesselGeo, glass);
    podG.add(vessel);
    // exotic matter glow core
    const exGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const exMesh = new THREE.Mesh(exGeo, matMagenta.clone());
    podG.add(exMesh);
    // magnetic clamps
    for (let mc = 0; mc < 4; mc++) {
      const clampGeo = new THREE.TorusGeometry(0.75, 0.06, 8, 24);
      const clamp = new THREE.Mesh(clampGeo, chrome);
      clamp.position.y = mc * 0.7 - 1.05;
      podG.add(clamp);
    }
    podG.position.set(-barrelLen / 2 - 4, side * 3.5, 0);
    podGroup.add(podG);
  }
  group.add(podGroup);
  meshes.exoticPods = podGroup;

  // ======================================================================
  // 13.  DOCKING CLAMPS & GUIDE ARMS (at breach)
  // ======================================================================
  const clampGroup = new THREE.Group();
  for (let cl = 0; cl < 4; cl++) {
    const ca = (cl / 4) * Math.PI * 2 + Math.PI / 4;
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-barrelLen / 2 - 1, Math.cos(ca) * 2.5, Math.sin(ca) * 2.5),
      new THREE.Vector3(-barrelLen / 2 - 0.3, Math.cos(ca) * 1.5, Math.sin(ca) * 1.5),
      new THREE.Vector3(-barrelLen / 2, Math.cos(ca) * 0.9, Math.sin(ca) * 0.9)
    ]);
    const armGeo = new THREE.TubeGeometry(armCurve, 16, 0.08, 8, false);
    const armMesh = new THREE.Mesh(armGeo, chrome);
    clampGroup.add(armMesh);
    // hydraulic piston
    const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.0, 8), steel);
    const pistonInner = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8), chrome);
    pistonOuter.position.set(-barrelLen / 2 - 1.5, Math.cos(ca) * 2.2, Math.sin(ca) * 2.2);
    pistonInner.position.set(-barrelLen / 2 - 1.5, Math.cos(ca) * 2.2, Math.sin(ca) * 2.2);
    pistonOuter.lookAt(new THREE.Vector3(-barrelLen / 2, 0, 0));
    pistonInner.lookAt(new THREE.Vector3(-barrelLen / 2, 0, 0));
    clampGroup.add(pistonOuter, pistonInner);
  }
  group.add(clampGroup);
  meshes.clamps = clampGroup;

  // ======================================================================
  // 14.  HOLOGRAPHIC TARGETING ARRAY (around muzzle)
  // ======================================================================
  const holoGroup = new THREE.Group();
  holoGroup.position.x = barrelLen / 2 + 3;

  // targeting reticle — concentric rings
  for (let hr = 0; hr < 4; hr++) {
    const hGeo = new THREE.RingGeometry(1.0 + hr * 0.6, 1.08 + hr * 0.6, 48);
    const hMesh = new THREE.Mesh(hGeo, matHoloViolet);
    hMesh.rotation.y = Math.PI / 2;
    holoGroup.add(hMesh);
  }

  // crosshair lines
  for (let ch = 0; ch < 4; ch++) {
    const chAngle = (ch / 4) * Math.PI * 2;
    const chGeo = new THREE.PlaneGeometry(0.04, 3.5);
    const chMesh = new THREE.Mesh(chGeo, matHoloCyan);
    chMesh.rotation.set(0, Math.PI / 2, chAngle);
    holoGroup.add(chMesh);
  }

  group.add(holoGroup);
  meshes.holo = holoGroup;

  // ======================================================================
  // 15.  NAVIGATION LIGHTS & HAZARD BEACONS
  // ======================================================================
  const lightGroup = new THREE.Group();
  // running lights along barrel
  for (let nl = 0; nl < 30; nl++) {
    const lx = (nl / 29) * barrelLen - barrelLen / 2;
    for (let ls = 0; ls < 2; ls++) {
      const la = ls * Math.PI;
      const lGeo = new THREE.SphereGeometry(0.05, 6, 6);
      const lMat = nl % 3 === 0 ? matRedWarn.clone() : matGreenGlow.clone();
      const light = new THREE.Mesh(lGeo, lMat);
      light.position.set(lx, Math.cos(la) * 1.95, Math.sin(la) * 1.95);
      lightGroup.add(light);
    }
  }
  group.add(lightGroup);
  meshes.lights = lightGroup;

  // ======================================================================
  // 16.  PLASMA EXHAUST VENTS (breach end)
  // ======================================================================
  const ventGroup = new THREE.Group();
  for (let v = 0; v < 6; v++) {
    const va = (v / 6) * Math.PI * 2;
    const ventGeo = new THREE.ConeGeometry(0.25, 0.8, 8, 1, true);
    const vent = new THREE.Mesh(ventGeo, matOrange.clone());
    vent.position.set(-barrelLen / 2 - 5, Math.cos(va) * 2.0, Math.sin(va) * 2.0);
    vent.rotation.z = -Math.PI / 2;
    ventGroup.add(vent);
  }
  group.add(ventGroup);
  meshes.vents = ventGroup;

  // ======================================================================
  // 17.  WARP FIELD GEOMETRY (animated wireframe sphere at muzzle)
  // ======================================================================
  const warpGeo = new THREE.SphereGeometry(4.5, 48, 48);
  const warpMat = new THREE.MeshStandardMaterial({
    color: 0x4400cc, emissive: 0x4400cc, emissiveIntensity: 2.5,
    wireframe: true, transparent: true, opacity: 0.0
  });
  const warpField = new THREE.Mesh(warpGeo, warpMat);
  warpField.position.x = barrelLen / 2 + 2;
  group.add(warpField);
  meshes.warpField = warpField;

  // ======================================================================
  //  PARTS MANIFEST
  // ======================================================================
  const parts = [
    { name: 'Linear Accelerator Barrel', description: 'A 28-unit-long superconducting rail-gun barrel with 56 electromagnetic coils that sequentially energise to accelerate a ship to 0.999c before subspace transition.',
      material: 'Niobium-Titanium superconductor', function: 'Accelerates payload ship via sequential electromagnetic pulses along the bore axis.',
      assemblyOrder: 1, connections: ['Electromagnetic Coil Array', 'Capacitor Banks', 'Superconducting Rails'],
      failureEffect: 'Total launch failure — ship cannot reach transition velocity.', cascadeFailures: ['Capacitor Banks', 'Electromagnetic Coil Array'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 0, z: 0 } },
    { name: 'Electromagnetic Coil Array', description: '56 sequentially-fired toroidal coils lining the barrel bore, each carrying 4.2 MA of current to produce 12 T magnetic pulses.',
      material: 'YBCO high-temperature superconductor', function: 'Generate travelling magnetic wave that couples to the ship\'s armature and provides Lorentz-force acceleration.',
      assemblyOrder: 2, connections: ['Linear Accelerator Barrel', 'Feed Lines'],
      failureEffect: 'Uneven acceleration — structural failure of payload.', cascadeFailures: ['Linear Accelerator Barrel'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 6, z: 0 } },
    { name: 'Subspace Tear Generator', description: 'Muzzle-mounted aperture array that focuses exotic-matter-lensed graviton beams to puncture the barrier between normal space and subspace.',
      material: 'Exotic matter / negative-energy-density Casimir plates', function: 'Opens a traversable subspace corridor at the exit point of the barrel.',
      assemblyOrder: 5, connections: ['Exotic Matter Pods', 'Stabiliser Pylons', 'Warp Field Generator'],
      failureEffect: 'No subspace corridor — ship exits at relativistic speed into normal space.', cascadeFailures: ['Stabiliser Pylons', 'Warp Field Generator'],
      originalPosition: { x: 15, y: 0, z: 0 }, explodedPosition: { x: 22, y: 0, z: 0 } },
    { name: 'Capacitor Banks', description: 'Four arrays of 24 high-energy-density supercapacitors storing 4.8 × 10¹⁵ J each, totalling 1.92 × 10¹⁶ J per launch cycle.',
      material: 'Graphene-aerogel dielectric', function: 'Provide instantaneous discharge current to coil array in sub-millisecond pulses.',
      assemblyOrder: 3, connections: ['Feed Lines', 'Reactor Core', 'Electromagnetic Coil Array'],
      failureEffect: 'Insufficient energy — ship falls short of transition velocity.', cascadeFailures: ['Electromagnetic Coil Array'],
      originalPosition: { x: 0, y: 3.2, z: 0 }, explodedPosition: { x: 0, y: 8, z: 0 } },
    { name: 'Reactor Core', description: 'Deuterium-Helium-3 inertial-confinement fusion reactor producing 2.4 TW continuous power to charge capacitor banks between launches.',
      material: 'First-wall beryllium / tungsten divertor', function: 'Provides primary power generation for all catapult systems.',
      assemblyOrder: 4, connections: ['Capacitor Banks', 'Containment Shell', 'Cooling Radiators'],
      failureEffect: 'Total power loss — all systems offline.', cascadeFailures: ['Capacitor Banks', 'Control Tower', 'Subspace Tear Generator'],
      originalPosition: { x: 0, y: -5, z: 0 }, explodedPosition: { x: 0, y: -12, z: 0 } },
    { name: 'Exotic Matter Containment Pods', description: 'Twin magnetically-suspended vacuum pods containing Casimir-generated negative-energy-density matter at 10⁻⁸ K.',
      material: 'Magneto-optical trap / Penning-trap electrodes', function: 'Store and feed exotic matter to the subspace tear generator.',
      assemblyOrder: 6, connections: ['Subspace Tear Generator'],
      failureEffect: 'Exotic matter annihilation — loss of subspace capability.', cascadeFailures: ['Subspace Tear Generator'],
      originalPosition: { x: -18, y: 3.5, z: 0 }, explodedPosition: { x: -25, y: 7, z: 0 } },
    { name: 'Superconducting Rails', description: 'Eight niobium-titanium rail pairs running the full 28-unit length of the barrel, cooled to 4.2 K by helium-II superfluids.',
      material: 'NbTi filament in copper matrix', function: 'Carry pulsed current from capacitors to each coil in sequence.',
      assemblyOrder: 2, connections: ['Linear Accelerator Barrel', 'Feed Lines'],
      failureEffect: 'Quench event — loss of superconductivity, rapid heating.', cascadeFailures: ['Electromagnetic Coil Array'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 3, z: 3 } },
    { name: 'Stabiliser Pylons', description: 'Six articulated pylons housing graviton-beam emitters that shape and stabilise the subspace corridor geometry.',
      material: 'Titanium-aluminide / piezoelectric actuators', function: 'Maintain corridor throat radius above Planck-scale collapse threshold.',
      assemblyOrder: 7, connections: ['Subspace Tear Generator', 'Warp Field Generator'],
      failureEffect: 'Corridor collapse — loss of ship in transit.', cascadeFailures: ['Subspace Tear Generator'],
      originalPosition: { x: 15, y: 3.8, z: 0 }, explodedPosition: { x: 20, y: 8, z: 0 } },
    { name: 'Particle Accelerator Ring', description: 'Toroidal storage ring (5.5-unit radius) that pre-accelerates exotic-matter particles before injection into the subspace generator.',
      material: 'Superconducting RF cavities', function: 'Boost exotic particles to required Lorentz factor γ ≈ 10⁴.',
      assemblyOrder: 8, connections: ['Exotic Matter Pods', 'Subspace Tear Generator'],
      failureEffect: 'Insufficient exotic-matter flux — weak or unstable corridor.', cascadeFailures: ['Subspace Tear Generator'],
      originalPosition: { x: -2, y: 0, z: 0 }, explodedPosition: { x: -2, y: -8, z: 0 } },
    { name: 'Control Tower', description: 'Armoured command module with 360° observation dome, holographic tactical displays, and AI-assisted launch sequencer.',
      material: 'Radiation-hardened composites / borosilicate glass', function: 'Houses launch crew and coordinates all subsystem timing.',
      assemblyOrder: 9, connections: ['All subsystems'],
      failureEffect: 'Manual launch only — increased risk of timing errors.', cascadeFailures: [],
      originalPosition: { x: -4, y: 5.5, z: 0 }, explodedPosition: { x: -4, y: 12, z: 0 } },
    { name: 'Warp Field Generator', description: 'Creates an Alcubierre-type metric distortion bubble around the corridor exit to reduce the energy requirements of the transition.',
      material: 'Exotic-matter waveguide array', function: 'Generates localised spacetime curvature — contracting space ahead, expanding behind.',
      assemblyOrder: 10, connections: ['Subspace Tear Generator', 'Exotic Matter Pods'],
      failureEffect: 'Energy requirement jumps to unphysical levels.', cascadeFailures: ['Subspace Tear Generator'],
      originalPosition: { x: 16, y: 0, z: 0 }, explodedPosition: { x: 24, y: 0, z: 0 } },
    { name: 'Breach Loading Dock', description: 'Rear docking and loading facility with guide rails, bay doors, and alignment mechanisms for pre-launch ship positioning.',
      material: 'Reinforced steel / hydraulic actuators', function: 'Positions ship precisely on the accelerator axis for launch.',
      assemblyOrder: 11, connections: ['Docking Clamps', 'Linear Accelerator Barrel'],
      failureEffect: 'Ship misalignment — catastrophic barrel strike.', cascadeFailures: ['Linear Accelerator Barrel', 'Payload Ship'],
      originalPosition: { x: -16.5, y: 0, z: 0 }, explodedPosition: { x: -24, y: 0, z: 0 } },
    { name: 'Docking Clamps', description: 'Four hydraulic guide arms with magnetic end-effectors that centre and hold the ship during loading.',
      material: 'Martensitic steel / neodymium magnets', function: 'Precise ship centering and hold-down during charging phase.',
      assemblyOrder: 12, connections: ['Breach Loading Dock'],
      failureEffect: 'Ship drift — lateral acceleration and barrel contact.', cascadeFailures: ['Breach Loading Dock'],
      originalPosition: { x: -15, y: 2.5, z: 0 }, explodedPosition: { x: -20, y: 5, z: 0 } },
    { name: 'Holographic Targeting Array', description: 'Projects real-time subspace corridor exit-point telemetry in a 3D holographic display for launch crew.',
      material: 'Photonic crystal / metamaterial lens', function: 'Provides targeting data — corridor bearing, stability index, exit coordinates.',
      assemblyOrder: 13, connections: ['Control Tower', 'Subspace Tear Generator'],
      failureEffect: 'Blind launch — unknown exit point.', cascadeFailures: [],
      originalPosition: { x: 17, y: 0, z: 0 }, explodedPosition: { x: 25, y: 4, z: 0 } },
    { name: 'Payload Ship', description: 'Armature-equipped starship rated for 15,000 g axial acceleration and subspace transition stress.',
      material: 'Ablative heat shield / inertial dampeners', function: 'Carries crew and cargo through the subspace corridor.',
      assemblyOrder: 14, connections: ['Breach Loading Dock', 'Docking Clamps'],
      failureEffect: 'Mission loss — crew and cargo destroyed.', cascadeFailures: [],
      originalPosition: { x: -15, y: 0, z: 0 }, explodedPosition: { x: -15, y: 6, z: 6 } },
    { name: 'Plasma Exhaust Vents', description: 'Six directional vents that bleed excess plasma pressure from the breach during high-energy discharges.',
      material: 'Tungsten-rhenium alloy nozzles', function: 'Prevent catastrophic over-pressure in the breach housing.',
      assemblyOrder: 15, connections: ['Breach Loading Dock', 'Reactor Core'],
      failureEffect: 'Breach over-pressure — structural failure.', cascadeFailures: ['Breach Loading Dock'],
      originalPosition: { x: -19, y: 2, z: 0 }, explodedPosition: { x: -26, y: 4, z: 0 } }
  ];

  // ======================================================================
  //  QUIZ QUESTIONS — PhD-level exotic physics
  // ======================================================================
  const quizQuestions = [
    {
      question: 'In the Alcubierre warp metric ds² = −dt² + (dx − vₛ(t)f(rₛ)dt)² + dy² + dz², the "top-hat" shaping function f(rₛ) determines the warp-bubble wall profile. What physical quantity does the derivative df/drₛ directly control at the bubble boundary, and why does a steeper gradient require exponentially more exotic matter?',
      options: [
        'The tidal-force tensor — steeper walls produce larger Riemann-tensor components, requiring more negative energy density to satisfy the Einstein field equations on the wall.',
        'The Doppler shift of incoming photons — steeper walls blue-shift light beyond the Planck frequency.',
        'The Hawking temperature of the bubble horizon — steeper walls radiate more intensely.',
        'The frame-dragging angular velocity — steeper walls spin internal space faster.'
      ],
      correct: 0,
      explanation: 'The Alcubierre metric\'s energy density is proportional to (df/drₛ)² via the Einstein tensor component G⁰⁰. A steeper shaping function increases the extrinsic curvature of the bubble wall, demanding a correspondingly larger magnitude of negative energy density (violating the Weak Energy Condition). Pfenning & Ford (1997) showed that the total exotic-matter requirement scales as the bubble velocity times the wall thickness inversely — thinner (steeper) walls push energy requirements toward infinity.'
    },
    {
      question: 'The Weak Energy Condition (WEC) states that for any timelike vector uᵃ, Tₐᵦuᵃuᵇ ≥ 0. Every known traversable wormhole and warp drive solution violates this condition. Which quantum phenomenon provides the only experimentally verified source of WEC-violating (negative) energy density, and what is its magnitude between parallel conducting plates separated by distance d?',
      options: [
        'The Casimir effect — energy density ρ = −π²ℏc / (720 d⁴), experimentally confirmed by Lamoreaux (1997).',
        'Hawking radiation — energy density ρ = −ℏc / (480π² rₛ²) at the Schwarzschild radius.',
        'The Schwinger effect — energy density ρ = −E²/(8π) for electric fields above the pair-production threshold.',
        'Squeezed vacuum states — energy density ρ = −ℏω³/(2π²c³) for photons squeezed below vacuum fluctuation level.'
      ],
      correct: 0,
      explanation: 'The Casimir effect between two parallel uncharged conducting plates produces a negative vacuum energy density ρ = −π²ℏc/(720 d⁴). This is the only experimentally measured phenomenon that violates the WEC. While squeezed vacuum states also produce transient negative energies, they are constrained by quantum interest conjectures and have not been directly measured as a static negative energy density. Lamoreaux\'s 1997 experiment confirmed the Casimir force to ~5% accuracy.'
    },
    {
      question: 'Ford and Roman\'s Quantum Interest Conjecture (QIC) places fundamental limits on exotic matter. In (1+1)-dimensional flat spacetime, if a negative energy pulse of magnitude |E₋| and duration τ₋ is followed by a compensating positive pulse, the QIC requires ΔE₊ · Δt_separation ≥ C · ℏ, where C is order unity. How does this constrain the viability of an Alcubierre drive at macroscopic scales?',
      options: [
        'It forces the exotic-matter region to be Planck-thickness or thinner, requiring a total negative energy exceeding the mass-energy of the observable universe for a 100-metre bubble at v > c.',
        'It limits the bubble velocity to exactly c, rendering the drive no faster than light.',
        'It prevents the bubble from forming in curved spacetime, restricting it to flat Minkowski backgrounds.',
        'It constrains only the temporal duration, allowing arbitrarily large spatial exotic-matter distributions.'
      ],
      correct: 0,
      explanation: 'The QIC forces any negative-energy concentration to be compensated by a larger positive-energy pulse within a time inversely proportional to the negative energy\'s magnitude. For macroscopic warp bubbles, Pfenning and Ford showed this constrains the bubble-wall thickness to sub-Planckian scales, pushing the total exotic-matter requirement to absurd values (≈10⁶² kg for a 100 m bubble). This is the most serious theoretical objection to Alcubierre-class drives.'
    },
    {
      question: 'A linear electromagnetic catapult designed to accelerate a 10⁴ kg ship to 0.99c over a 28 km barrel must impart a final Lorentz factor γ ≈ 7.09. Using relativistic kinematics with constant proper acceleration a₀, the coordinate-time to traverse length L satisfies L = (c²/a₀)(√(1+(a₀T/c)²) − 1). What is the approximate proper acceleration a₀, and what engineering challenge does it present?',
      options: [
        'a₀ ≈ 3.4 × 10¹² m/s² (≈3.5 × 10¹¹ g). The challenge is that no known material can withstand the structural stresses, and the electromagnetic coil energies exceed what can be stored in any capacitor technology by ~20 orders of magnitude.',
        'a₀ ≈ 9.8 m/s² (1 g). The challenge is the barrel length must be several light-years, not 28 km.',
        'a₀ ≈ 10⁶ m/s² (≈10⁵ g). The challenge is cooling the superconducting coils fast enough.',
        'a₀ ≈ 10⁹ m/s² (≈10⁸ g). The challenge is only in radiation shielding for the crew.'
      ],
      correct: 0,
      explanation: 'Solving the relativistic constant-acceleration equation for L = 28 km and γ_final = 7.09 gives a₀ ≈ (γ−1)c²/L ≈ 6.09 × (9×10¹⁶) / (2.8×10⁴) ≈ 1.96 × 10¹² m/s². The kinetic energy (γ−1)mc² ≈ 5.5 × 10²¹ J exceeds global annual energy consumption. No known capacitor, inductor, or energy-storage technology can deliver this in the sub-millisecond timescale required, and no structural material can survive 10¹¹ g of sustained loading.'
    },
    {
      question: 'In Morris-Thorne wormhole physics, the "flare-out condition" at the throat requires d²r/dz² > 0 in the embedding diagram, which via the Einstein equations implies ρ + p_r < 0 at the throat (violating the Null Energy Condition). If an FTL catapult creates a "subspace corridor" modelled as a Morris-Thorne wormhole with throat radius r₀, what is the minimum exotic-matter requirement in terms of r₀ and how does it compare to the Alcubierre drive?',
      options: [
        'M_exotic ≈ −r₀c²/G ≈ −r₀ × 1.35 × 10²⁷ kg/m. For a 10 m throat, this is ~10²⁸ kg of negative mass — comparable to Jupiter — but still orders of magnitude less than a macroscopic Alcubierre bubble of equivalent utility.',
        'M_exotic ≈ −r₀²c⁴/G² — quadratic in r₀ and always exceeds the Alcubierre requirement.',
        'M_exotic ≈ −ℏ/(r₀c) — inversely proportional to r₀ and negligible for macroscopic throats.',
        'M_exotic = 0 — Visser thin-shell wormholes avoid the exotic-matter requirement entirely.'
      ],
      correct: 0,
      explanation: 'Visser showed that the exotic-matter quantity threading a Morris-Thorne wormhole throat scales linearly as M_exotic ~ −r₀c²/G. For r₀ = 10 m, this yields ~1.35 × 10²⁸ kg of negative mass-energy — roughly Jupiter\'s mass with a negative sign. While enormous, this is actually less than the Pfenning-Ford estimate for a macroscopic Alcubierre bubble (~10⁶² kg), because the wormhole concentrates exotic matter at a 2D throat surface rather than requiring it over a 3D bubble wall. Visser thin-shell wormholes still require exotic matter; they merely localise it on a δ-function shell.'
    }
  ];

  // ======================================================================
  //  ANIMATION ENGINE
  // ======================================================================
  function animate(time, speed, ref) {
    const t = time * speed;
    const cycle = (t * 0.08) % 1.0;  // 0→1 repeating launch cycle

    // --- Phase 0–0.3: CHARGING (capacitors glow brighter, reactor pulses) ---
    const chargeFrac = Math.min(cycle / 0.3, 1.0);

    // capacitor electrode glow
    if (meshes.capacitors) {
      meshes.capacitors.children.forEach((bank) => {
        bank.children.forEach((child) => {
          if (child.material && child.material.emissive) {
            child.material.emissiveIntensity = 1.0 + chargeFrac * 4.0;
          }
        });
      });
    }

    // reactor core pulse
    if (meshes.reactorCore) {
      meshes.reactorCore.material.emissiveIntensity = 2.0 + Math.sin(t * 12) * 1.5 * chargeFrac;
      meshes.reactorCore.rotation.x = t * 0.5;
      meshes.reactorCore.rotation.z = t * 0.3;
    }
    if (meshes.containment) {
      meshes.containment.rotation.y = t * 0.4;
      meshes.containment.rotation.z = -t * 0.25;
    }

    // --- Phase 0.3–0.5: SHIP LOADING (ship moves to barrel start) ---
    const loadFrac = Math.max(0, Math.min((cycle - 0.3) / 0.2, 1.0));
    const barrelStart = -barrelLen / 2 - 1;
    const barrelEnd = barrelLen / 2 + 5;

    if (meshes.ship) {
      if (cycle < 0.5) {
        // ship is at breach, loading
        meshes.ship.position.x = barrelStart + loadFrac * 2;
        meshes.ship.visible = true;
      }
    }

    // --- Phase 0.5–0.75: ACCELERATION (ship races down barrel) ---
    const accelFrac = Math.max(0, Math.min((cycle - 0.5) / 0.25, 1.0));
    if (meshes.ship) {
      if (cycle >= 0.5 && cycle < 0.75) {
        // exponential acceleration along barrel
        const progress = accelFrac * accelFrac * accelFrac; // cubic ease-in
        meshes.ship.position.x = barrelStart + 2 + progress * (barrelEnd - barrelStart - 2);
      }
    }

    // coil sequential firing during acceleration
    if (meshes.coils) {
      meshes.coils.children.forEach((coil, idx) => {
        const coilT = idx / (coilCount - 1);
        if (cycle >= 0.5 && cycle < 0.75) {
          const firing = Math.abs(accelFrac - coilT) < 0.05;
          if (coil.material && coil.material.emissive) {
            coil.material.emissiveIntensity = firing ? 8.0 : 0.5;
          }
        } else {
          if (coil.material && coil.material.emissive) {
            coil.material.emissiveIntensity = 0.5 + chargeFrac * 0.5;
          }
        }
      });
    }

    // bore glow intensifies during acceleration
    if (meshes.bore) {
      meshes.bore.material.opacity = cycle >= 0.5 && cycle < 0.75 ? 0.15 + accelFrac * 0.5 : 0.08;
      meshes.bore.material.emissiveIntensity = cycle >= 0.5 && cycle < 0.75 ? 1.0 + accelFrac * 5.0 : 0.5;
    }

    // --- Phase 0.6–0.85: SUBSPACE TEAR OPENS ---
    const tearFrac = Math.max(0, Math.min((cycle - 0.6) / 0.25, 1.0));
    if (meshes.tear) {
      meshes.tear.material.opacity = tearFrac * 0.7;
      meshes.tear.rotation.x = t * 2.0;
      meshes.tear.rotation.z = t * 1.5;
      meshes.tear.scale.setScalar(0.3 + tearFrac * 1.0);
    }
    if (meshes.tearGlow) {
      meshes.tearGlow.material.opacity = tearFrac * 0.5;
      meshes.tearGlow.scale.setScalar(0.5 + tearFrac * 0.8 + Math.sin(t * 8) * 0.1);
    }
    if (meshes.warpField) {
      meshes.warpField.material.opacity = tearFrac * 0.25;
      meshes.warpField.rotation.x = t * 0.3;
      meshes.warpField.rotation.y = t * 0.5;
      meshes.warpField.scale.setScalar(0.5 + tearFrac * 1.2);
    }

    // --- Phase 0.75–0.85: SHIP VANISHES into subspace ---
    if (meshes.ship) {
      if (cycle >= 0.75 && cycle < 0.85) {
        const vanishFrac = (cycle - 0.75) / 0.1;
        meshes.ship.position.x = barrelEnd + vanishFrac * 4;
        meshes.ship.scale.setScalar(1.0 - vanishFrac);
        meshes.ship.material && (meshes.ship.material.opacity = 1.0 - vanishFrac);
      }
    }

    // --- Phase 0.85–1.0: COOLDOWN & RESET ---
    if (meshes.ship) {
      if (cycle >= 0.85) {
        meshes.ship.visible = false;
        meshes.ship.scale.setScalar(1.0);
        meshes.ship.position.x = barrelStart;
      }
      if (cycle < 0.3) {
        meshes.ship.visible = true;
        meshes.ship.position.x = barrelStart;
        meshes.ship.scale.setScalar(1.0);
      }
    }

    // --- CONTINUOUS ANIMATIONS ---

    // stabiliser pylons slow rotation
    if (meshes.pylons) {
      meshes.pylons.rotation.x = t * 0.15;
    }

    // holographic targeting reticle rotation
    if (meshes.holo) {
      meshes.holo.rotation.x = t * 0.6;
      meshes.holo.children.forEach((child, i) => {
        child.rotation.z = t * (0.2 + i * 0.05) * (i % 2 === 0 ? 1 : -1);
      });
    }

    // accelerator ring beam glow pulse
    if (meshes.acceleratorRing) {
      meshes.acceleratorRing.rotation.x = t * 0.1;
    }

    // navigation lights blink
    if (meshes.lights) {
      meshes.lights.children.forEach((light, i) => {
        if (light.material && light.material.emissive) {
          const blink = Math.sin(t * 4 + i * 0.7) > 0.3 ? 3.0 : 0.2;
          light.material.emissiveIntensity = blink;
        }
      });
    }

    // exhaust vent flicker
    if (meshes.vents) {
      meshes.vents.children.forEach((vent, i) => {
        if (vent.material) {
          vent.material.emissiveIntensity = 1.5 + Math.sin(t * 10 + i * 2) * 1.0;
        }
        vent.scale.y = 0.8 + Math.sin(t * 8 + i) * 0.3;
      });
    }

    // tower antenna blinkers
    if (meshes.tower) {
      meshes.tower.children.forEach((child) => {
        if (child.geometry && child.geometry.type === 'SphereGeometry' &&
            child.material && child.material.emissive) {
          const b = Math.sin(t * 3 + child.position.y * 2) > 0 ? 4.0 : 0.1;
          child.material.emissiveIntensity = b;
        }
      });
    }

    // feed lines energy pulse
    if (meshes.feedLines) {
      meshes.feedLines.children.forEach((tube, i) => {
        if (tube.material && tube.material.emissive) {
          tube.material.emissiveIntensity = 1.0 + chargeFrac * 3.0 * Math.abs(Math.sin(t * 6 + i));
        }
      });
    }

    // exotic pods glow cycle
    if (meshes.exoticPods) {
      meshes.exoticPods.children.forEach((pod) => {
        pod.children.forEach((child) => {
          if (child.material && child.material.emissive) {
            child.material.emissiveIntensity = 2.0 + Math.sin(t * 5) * 1.5;
          }
        });
      });
    }
  }

  // ======================================================================
  //  EXPORT
  // ======================================================================
  const description = `FTL Subspace Catapult — An enormous orbital linear accelerator spanning 28 units, ` +
    `designed to launch armature-equipped starships into faster-than-light subspace corridors. ` +
    `The system operates in a four-phase launch cycle: (1) Capacitor Charging — four banks of 24 ` +
    `graphene-aerogel supercapacitors draw 2.4 TW from a D-³He fusion reactor; (2) Ship Loading — ` +
    `hydraulic docking clamps centre the payload on the bore axis; (3) Electromagnetic Acceleration — ` +
    `56 superconducting toroidal coils fire in rapid sequence, driving the ship to 0.99c over 28 km; ` +
    `(4) Subspace Transition — exotic-matter-lensed graviton beams puncture a traversable corridor ` +
    `at the muzzle aperture while six stabiliser pylons maintain throat geometry. The ship enters ` +
    `an Alcubierre-class warp bubble and transitions to FTL velocity inside the corridor, emerging ` +
    `at a pre-computed exit point light-years away. Key engineering challenges include the quantum ` +
    `interest conjecture limiting exotic-matter concentration, Planck-scale wall-thickness requirements ` +
    `for warp bubbles, and the staggering 10²¹ J energy budget per launch.`;

  return { group, parts, description, quizQuestions, animate };
}
