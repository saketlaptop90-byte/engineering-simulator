// ============================================================================
// GOD TIER HYPERSPACE CATAPULT — Ultra-Realistic Megastructure
// A ship-scale particle accelerator ring that tears open a hyperspace window
// and launches vessels through dimensional portals at superluminal velocities.
// ============================================================================

import {
  plastic, aluminum, glass, copper, steel, darkSteel,
  rubber, chrome, tinted
} from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ==================== CUSTOM MATERIALS ====================
  const hyperGlow = new THREE.MeshStandardMaterial({
    color: 0x00ccff, emissive: 0x00aaff, emissiveIntensity: 2.8,
    metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.85
  });
  const portalCore = new THREE.MeshStandardMaterial({
    color: 0x8800ff, emissive: 0x6600dd, emissiveIntensity: 3.5,
    metalness: 0.0, roughness: 0.1, transparent: true, opacity: 0.6,
    side: THREE.DoubleSide
  });
  const dimensionalTear = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xeeddff, emissiveIntensity: 5.0,
    metalness: 0.0, roughness: 0.0, transparent: true, opacity: 0.4,
    side: THREE.DoubleSide
  });
  const plasmaBlue = new THREE.MeshStandardMaterial({
    color: 0x0066ff, emissive: 0x0044cc, emissiveIntensity: 2.0,
    metalness: 0.3, roughness: 0.15, transparent: true, opacity: 0.7
  });
  const warningOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 1.5,
    metalness: 0.2, roughness: 0.3
  });
  const energyGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff66, emissive: 0x00cc44, emissiveIntensity: 2.2,
    metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.8
  });
  const deepVoid = new THREE.MeshStandardMaterial({
    color: 0x050510, emissive: 0x0a0a20, emissiveIntensity: 0.3,
    metalness: 0.95, roughness: 0.05
  });
  const redAlert = new THREE.MeshStandardMaterial({
    color: 0xff0033, emissive: 0xcc0022, emissiveIntensity: 2.0,
    metalness: 0.2, roughness: 0.3
  });
  const titaniumHull = new THREE.MeshStandardMaterial({
    color: 0x889099, metalness: 0.85, roughness: 0.18
  });
  const goldAccent = new THREE.MeshStandardMaterial({
    color: 0xffd700, emissive: 0xaa8800, emissiveIntensity: 0.6,
    metalness: 0.9, roughness: 0.1
  });

  // ==================== MESHES COLLECTION ====================
  const meshes = {
    outerRing: null, innerRing: null, magnetSegments: [],
    portalDisc: null, tearEffects: [], energyArrays: [],
    ships: [], launchTrails: [], controlTower: null,
    pylons: [], capacitorBanks: [], coolingPipes: [],
    acceleratorCoils: [], chargeIndicators: [], dockingArms: [],
    gravityLens: null, beaconLights: [], conduitRings: [],
    supportStruts: [], particleEmitters: [], shieldGenerators: []
  };

  // ==================== 1. MAIN TOROIDAL ACCELERATOR RING ====================
  // Outer structural torus — the massive main ring
  const outerTorusGeo = new THREE.TorusGeometry(12, 1.8, 32, 128);
  meshes.outerRing = new THREE.Mesh(outerTorusGeo, darkSteel);
  meshes.outerRing.rotation.x = Math.PI / 2;
  group.add(meshes.outerRing);

  // Inner superconducting torus — the acceleration channel
  const innerTorusGeo = new THREE.TorusGeometry(12, 0.9, 24, 128);
  meshes.innerRing = new THREE.Mesh(innerTorusGeo, chrome);
  meshes.innerRing.rotation.x = Math.PI / 2;
  group.add(meshes.innerRing);

  // Accelerator conduit rings — segmented electromagnetic guides
  for (let i = 0; i < 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    const conduitGeo = new THREE.TorusGeometry(0.95, 0.12, 8, 16);
    const conduit = new THREE.Mesh(conduitGeo, copper);
    conduit.position.set(Math.cos(angle) * 12, 0, Math.sin(angle) * 12);
    conduit.rotation.y = angle + Math.PI / 2;
    conduit.rotation.x = Math.PI / 2;
    group.add(conduit);
    meshes.conduitRings.push(conduit);
  }

  // ==================== 2. SUPERCONDUCTING MAGNET SEGMENTS ====================
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const segGroup = new THREE.Group();

    // Main magnet housing
    const magnetBody = new THREE.CylinderGeometry(0.7, 0.7, 2.2, 12);
    const magnetMesh = new THREE.Mesh(magnetBody, steel);
    segGroup.add(magnetMesh);

    // Coil windings — copper electromagnetic coils
    for (let c = 0; c < 5; c++) {
      const coilGeo = new THREE.TorusGeometry(0.75, 0.06, 8, 24);
      const coil = new THREE.Mesh(coilGeo, copper);
      coil.position.y = -0.8 + c * 0.4;
      coil.rotation.x = Math.PI / 2;
      segGroup.add(coil);
    }

    // Cooling jacket
    const jacketGeo = new THREE.CylinderGeometry(0.82, 0.82, 2.4, 12, 1, true);
    const jacket = new THREE.Mesh(jacketGeo, aluminum.clone());
    jacket.material.transparent = true;
    jacket.material.opacity = 0.35;
    segGroup.add(jacket);

    // Status LED
    const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const led = new THREE.Mesh(ledGeo, energyGreen);
    led.position.set(0.6, 1.0, 0);
    segGroup.add(led);

    segGroup.position.set(
      Math.cos(angle) * 12, 0, Math.sin(angle) * 12
    );
    segGroup.rotation.y = angle;
    segGroup.lookAt(0, 0, 0);

    group.add(segGroup);
    meshes.magnetSegments.push(segGroup);
  }

  // ==================== 3. ACCELERATOR COILS (LARGE QUADRUPOLES) ====================
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const coilGroup = new THREE.Group();

    // Four quadrupole magnets arranged around the beam pipe
    for (let q = 0; q < 4; q++) {
      const qAngle = (q / 4) * Math.PI * 2;
      const qGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.6, 8);
      const qMesh = new THREE.Mesh(qGeo, chrome);
      qMesh.position.set(Math.cos(qAngle) * 0.55, 0, Math.sin(qAngle) * 0.55);
      coilGroup.add(qMesh);

      // Energised glow band
      const bandGeo = new THREE.TorusGeometry(0.28, 0.04, 6, 12);
      const band = new THREE.Mesh(bandGeo, hyperGlow);
      band.position.copy(qMesh.position);
      band.rotation.x = Math.PI / 2;
      coilGroup.add(band);
    }

    // Central beam channel
    const channelGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.8, 12, 1, true);
    const channel = new THREE.Mesh(channelGeo, plasmaBlue);
    coilGroup.add(channel);

    coilGroup.position.set(Math.cos(angle) * 12, 0, Math.sin(angle) * 12);
    coilGroup.lookAt(0, 0, 0);
    group.add(coilGroup);
    meshes.acceleratorCoils.push(coilGroup);
  }

  // ==================== 4. HYPERSPACE PORTAL DISC ====================
  // The dimensional window that forms inside the ring
  const portalShape = new THREE.Shape();
  portalShape.absarc(0, 0, 10.5, 0, Math.PI * 2, false);
  const portalHole = new THREE.Path();
  portalHole.absarc(0, 0, 0.5, 0, Math.PI * 2, true);
  portalShape.holes.push(portalHole);
  const portalGeo = new THREE.ShapeGeometry(portalShape, 64);
  meshes.portalDisc = new THREE.Mesh(portalGeo, portalCore);
  meshes.portalDisc.rotation.x = Math.PI / 2;
  meshes.portalDisc.position.y = 0;
  meshes.portalDisc.scale.set(0, 0, 0);
  group.add(meshes.portalDisc);

  // Dimensional tear concentric rings — visual distortion layers
  for (let r = 0; r < 8; r++) {
    const tearRadius = 2 + r * 1.2;
    const tearGeo = new THREE.TorusGeometry(tearRadius, 0.04, 6, 64);
    const tear = new THREE.Mesh(tearGeo, dimensionalTear.clone());
    tear.rotation.x = Math.PI / 2;
    tear.scale.set(0, 0, 0);
    group.add(tear);
    meshes.tearEffects.push(tear);
  }

  // Central gravity lens — distortion sphere
  const lensGeo = new THREE.SphereGeometry(1.5, 32, 32);
  meshes.gravityLens = new THREE.Mesh(lensGeo, deepVoid);
  meshes.gravityLens.scale.set(0, 0, 0);
  group.add(meshes.gravityLens);

  // ==================== 5. ENERGY COLLECTION ARRAYS ====================
  for (let a = 0; a < 8; a++) {
    const angle = (a / 8) * Math.PI * 2;
    const arrayGroup = new THREE.Group();

    // Main solar/zero-point energy collector arm
    const armGeo = new THREE.BoxGeometry(0.4, 0.3, 7);
    const arm = new THREE.Mesh(armGeo, darkSteel);
    arm.position.z = 3.5;
    arrayGroup.add(arm);

    // Collector panel — large flat surface with detail
    const panelGeo = new THREE.BoxGeometry(4, 0.08, 5);
    const panel = new THREE.Mesh(panelGeo, aluminum);
    panel.position.z = 6;
    arrayGroup.add(panel);

    // Panel cell grid — photovoltaic/energy cells
    for (let gx = 0; gx < 6; gx++) {
      for (let gz = 0; gz < 8; gz++) {
        const cellGeo = new THREE.BoxGeometry(0.55, 0.12, 0.5);
        const cell = new THREE.Mesh(cellGeo, plasmaBlue);
        cell.position.set(-1.5 + gx * 0.6, 0.06, 4 + gz * 0.55);
        arrayGroup.add(cell);
      }
    }

    // Energy conduit running along arm to the ring
    const conduitPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(0, 0.3, 2),
      new THREE.Vector3(0, 0.25, 5),
      new THREE.Vector3(0, 0.2, 7)
    ]);
    const conduitTubeGeo = new THREE.TubeGeometry(conduitPath, 20, 0.08, 8, false);
    const conduitTube = new THREE.Mesh(conduitTubeGeo, energyGreen);
    arrayGroup.add(conduitTube);

    // Articulation joint
    const jointGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const joint = new THREE.Mesh(jointGeo, chrome);
    arrayGroup.add(joint);

    // Mounting bracket to ring
    const bracketGeo = new THREE.BoxGeometry(0.6, 0.6, 0.8);
    const bracket = new THREE.Mesh(bracketGeo, steel);
    bracket.position.z = -0.4;
    arrayGroup.add(bracket);

    arrayGroup.position.set(
      Math.cos(angle) * 14.5, 0, Math.sin(angle) * 14.5
    );
    arrayGroup.rotation.y = angle + Math.PI;
    group.add(arrayGroup);
    meshes.energyArrays.push(arrayGroup);
  }

  // ==================== 6. CAPACITOR BANKS ====================
  for (let cb = 0; cb < 12; cb++) {
    const angle = (cb / 12) * Math.PI * 2;
    const capGroup = new THREE.Group();

    // Main capacitor cylinder
    const capGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16);
    const cap = new THREE.Mesh(capGeo, steel);
    capGroup.add(cap);

    // Top insulator
    const insGeo = new THREE.CylinderGeometry(0.55, 0.45, 0.3, 16);
    const ins = new THREE.Mesh(insGeo, rubber);
    ins.position.y = 1.4;
    capGroup.add(ins);

    // Bottom insulator
    const ins2 = ins.clone();
    ins2.position.y = -1.4;
    capGroup.add(ins2);

    // Charge indicator bar
    const barGeo = new THREE.BoxGeometry(0.08, 2.0, 0.08);
    const bar = new THREE.Mesh(barGeo, energyGreen);
    bar.position.set(0.45, 0, 0);
    capGroup.add(bar);
    meshes.chargeIndicators.push(bar);

    // Connection terminals
    for (let t = 0; t < 2; t++) {
      const termGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
      const term = new THREE.Mesh(termGeo, copper);
      term.position.set(t === 0 ? 0.3 : -0.3, 1.55, 0);
      capGroup.add(term);
    }

    capGroup.position.set(
      Math.cos(angle) * 13.5, -2.5, Math.sin(angle) * 13.5
    );
    group.add(capGroup);
    meshes.capacitorBanks.push(capGroup);
  }

  // ==================== 7. SUPPORT PYLONS ====================
  for (let p = 0; p < 6; p++) {
    const angle = (p / 6) * Math.PI * 2;
    const pylonGroup = new THREE.Group();

    // Main vertical pylon — lattice truss structure
    const pylonGeo = new THREE.BoxGeometry(0.6, 10, 0.6);
    const pylon = new THREE.Mesh(pylonGeo, darkSteel);
    pylon.position.y = -5;
    pylonGroup.add(pylon);

    // Cross braces
    for (let b = 0; b < 4; b++) {
      const braceGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.5, 6);
      const brace = new THREE.Mesh(braceGeo, steel);
      brace.position.y = -2 - b * 2;
      brace.rotation.z = (b % 2 === 0) ? 0.5 : -0.5;
      pylonGroup.add(brace);
    }

    // Base pad
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.4, 8);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = -10;
    pylonGroup.add(base);

    // Pylon-to-ring connector arm
    const connGeo = new THREE.BoxGeometry(0.4, 0.4, 2);
    const conn = new THREE.Mesh(connGeo, steel);
    conn.position.set(0, 0, -1);
    pylonGroup.add(conn);

    // Warning stripes
    const stripeGeo = new THREE.BoxGeometry(0.62, 0.15, 0.62);
    for (let s = 0; s < 8; s++) {
      const stripe = new THREE.Mesh(stripeGeo, s % 2 === 0 ? warningOrange : darkSteel);
      stripe.position.y = -1.5 - s * 1.1;
      pylonGroup.add(stripe);
    }

    pylonGroup.position.set(
      Math.cos(angle) * 12, 0, Math.sin(angle) * 12
    );
    pylonGroup.rotation.y = angle;
    group.add(pylonGroup);
    meshes.pylons.push(pylonGroup);
  }

  // ==================== 8. SUPPORT STRUTS (INTERIOR SPOKES) ====================
  for (let s = 0; s < 12; s++) {
    const angle = (s / 12) * Math.PI * 2;
    const strutGeo = new THREE.CylinderGeometry(0.12, 0.12, 10, 8);
    const strut = new THREE.Mesh(strutGeo, steel);
    strut.rotation.z = Math.PI / 2;
    strut.position.set(
      Math.cos(angle) * 6, 0, Math.sin(angle) * 6
    );
    strut.rotation.y = -angle;
    group.add(strut);
    meshes.supportStruts.push(strut);
  }

  // ==================== 9. COOLING SYSTEM — CRYOGENIC PIPES ====================
  for (let cp = 0; cp < 8; cp++) {
    const startAngle = (cp / 8) * Math.PI * 2;
    const endAngle = ((cp + 1) / 8) * Math.PI * 2;
    const pts = [];
    for (let t = 0; t <= 12; t++) {
      const a = startAngle + (t / 12) * (endAngle - startAngle);
      const r = 12 + Math.sin(t * 1.5) * 0.5;
      pts.push(new THREE.Vector3(
        Math.cos(a) * r, -1.5 + Math.sin(t * 0.8) * 0.3, Math.sin(a) * r
      ));
    }
    const pipeCurve = new THREE.CatmullRomCurve3(pts);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 24, 0.1, 8, false);
    const pipe = new THREE.Mesh(pipeGeo, plasmaBlue);
    group.add(pipe);
    meshes.coolingPipes.push(pipe);
  }

  // Coolant manifold nodes
  for (let m = 0; m < 8; m++) {
    const angle = (m / 8) * Math.PI * 2;
    const manifGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const manif = new THREE.Mesh(manifGeo, chrome);
    manif.position.set(Math.cos(angle) * 12, -1.5, Math.sin(angle) * 12);
    group.add(manif);
  }

  // ==================== 10. CONTROL TOWER ====================
  const towerGroup = new THREE.Group();

  // Tower body — multi-section profile using LatheGeometry
  const towerProfile = [
    new THREE.Vector2(1.5, 0),
    new THREE.Vector2(1.5, 1),
    new THREE.Vector2(1.2, 1.5),
    new THREE.Vector2(1.0, 3),
    new THREE.Vector2(0.8, 5),
    new THREE.Vector2(0.9, 5.5),
    new THREE.Vector2(1.8, 6),
    new THREE.Vector2(2.0, 6.5),
    new THREE.Vector2(2.0, 7.5),
    new THREE.Vector2(1.6, 8),
    new THREE.Vector2(0.5, 8.5),
    new THREE.Vector2(0.3, 9),
    new THREE.Vector2(0.1, 9.5)
  ];
  const towerGeo = new THREE.LatheGeometry(towerProfile, 16);
  const tower = new THREE.Mesh(towerGeo, titaniumHull);
  towerGroup.add(tower);

  // Observation windows — tinted glass panels
  for (let w = 0; w < 8; w++) {
    const wAngle = (w / 8) * Math.PI * 2;
    const winGeo = new THREE.BoxGeometry(0.8, 1.0, 0.05);
    const win = new THREE.Mesh(winGeo, tinted);
    win.position.set(
      Math.cos(wAngle) * 1.85, 7, Math.sin(wAngle) * 1.85
    );
    win.rotation.y = wAngle;
    towerGroup.add(win);
  }

  // Antenna array
  const antennaGeo = new THREE.CylinderGeometry(0.03, 0.03, 3, 6);
  const antenna = new THREE.Mesh(antennaGeo, steel);
  antenna.position.y = 11;
  towerGroup.add(antenna);

  // Antenna dish
  const dishGeo = new THREE.SphereGeometry(0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const dish = new THREE.Mesh(dishGeo, aluminum);
  dish.position.y = 9.5;
  dish.rotation.x = Math.PI;
  towerGroup.add(dish);

  // Beacon light atop tower
  const beaconGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const beacon = new THREE.Mesh(beaconGeo, redAlert);
  beacon.position.y = 12.5;
  towerGroup.add(beacon);
  meshes.beaconLights.push(beacon);

  // Control room interior glow
  const glowRingGeo = new THREE.TorusGeometry(1.9, 0.08, 6, 24);
  const glowRing = new THREE.Mesh(glowRingGeo, hyperGlow);
  glowRing.position.y = 6.8;
  glowRing.rotation.x = Math.PI / 2;
  towerGroup.add(glowRing);

  towerGroup.position.set(18, -10, 0);
  meshes.controlTower = towerGroup;
  group.add(towerGroup);

  // ==================== 11. SHIPS (QUEUE & LAUNCH) ====================
  for (let s = 0; s < 5; s++) {
    const shipGroup = new THREE.Group();

    // Fuselage — sleek elongated shape via LatheGeometry
    const fuselageProfile = [
      new THREE.Vector2(0, -2.0),
      new THREE.Vector2(0.15, -1.8),
      new THREE.Vector2(0.35, -1.2),
      new THREE.Vector2(0.45, -0.4),
      new THREE.Vector2(0.5, 0),
      new THREE.Vector2(0.48, 0.4),
      new THREE.Vector2(0.4, 0.8),
      new THREE.Vector2(0.3, 1.2),
      new THREE.Vector2(0.15, 1.6),
      new THREE.Vector2(0.05, 1.9),
      new THREE.Vector2(0, 2.0)
    ];
    const fuselageGeo = new THREE.LatheGeometry(fuselageProfile, 12);
    const fuselage = new THREE.Mesh(fuselageGeo, titaniumHull);
    fuselage.rotation.z = Math.PI / 2;
    shipGroup.add(fuselage);

    // Cockpit canopy
    const canopyGeo = new THREE.SphereGeometry(0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    const canopy = new THREE.Mesh(canopyGeo, tinted);
    canopy.position.set(1.5, 0.2, 0);
    canopy.rotation.z = Math.PI / 2;
    shipGroup.add(canopy);

    // Wings
    for (let side = -1; side <= 1; side += 2) {
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.lineTo(0.8, side * 1.5);
      wingShape.lineTo(-0.3, side * 1.2);
      wingShape.lineTo(-0.2, 0);
      const wingExtrudeSettings = { depth: 0.04, bevelEnabled: false };
      const wingGeo = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);
      const wing = new THREE.Mesh(wingGeo, darkSteel);
      wing.rotation.x = Math.PI / 2;
      wing.position.set(0, side * 0.01, 0);
      shipGroup.add(wing);
    }

    // Engine nacelles
    for (let side = -1; side <= 1; side += 2) {
      const nacGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.6, 8);
      const nac = new THREE.Mesh(nacGeo, darkSteel);
      nac.rotation.z = Math.PI / 2;
      nac.position.set(-1.0, 0, side * 0.5);
      shipGroup.add(nac);

      // Engine glow
      const thrustGeo = new THREE.CylinderGeometry(0.1, 0.02, 0.4, 8);
      const thrust = new THREE.Mesh(thrustGeo, hyperGlow);
      thrust.rotation.z = Math.PI / 2;
      thrust.position.set(-1.3, 0, side * 0.5);
      shipGroup.add(thrust);
    }

    // Queue position (approach line)
    const queueX = -20 + s * 4;
    shipGroup.position.set(queueX, 0, 0);
    shipGroup.scale.set(0.6, 0.6, 0.6);
    group.add(shipGroup);
    meshes.ships.push(shipGroup);
  }

  // ==================== 12. LAUNCH TRAIL EFFECTS ====================
  for (let lt = 0; lt < 6; lt++) {
    const trailGeo = new THREE.CylinderGeometry(0.03, 0.15, 3 + lt * 0.5, 8);
    const trail = new THREE.Mesh(trailGeo, hyperGlow.clone());
    trail.material.transparent = true;
    trail.material.opacity = 0;
    trail.rotation.z = Math.PI / 2;
    trail.position.set(12 + lt * 2, 0, 0);
    group.add(trail);
    meshes.launchTrails.push(trail);
  }

  // ==================== 13. DOCKING/GUIDE ARMS ====================
  for (let d = 0; d < 4; d++) {
    const armGroup = new THREE.Group();
    const angle = (d / 4) * Math.PI * 2;

    // Arm body — telescoping segments
    for (let seg = 0; seg < 3; seg++) {
      const segW = 0.25 - seg * 0.05;
      const segGeo = new THREE.BoxGeometry(segW, segW, 3 - seg * 0.5);
      const segMesh = new THREE.Mesh(segGeo, steel);
      segMesh.position.z = -2 + seg * 2.5;
      armGroup.add(segMesh);
    }

    // Magnetic grapple at tip
    const grapGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const grap = new THREE.Mesh(grapGeo, hyperGlow);
    grap.position.z = 3.5;
    armGroup.add(grap);

    // Hydraulic actuator
    const hydPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.15, 0.15, -2),
      new THREE.Vector3(0.2, 0.2, 0),
      new THREE.Vector3(0.15, 0.15, 2)
    ]);
    const hydGeo = new THREE.TubeGeometry(hydPath, 12, 0.04, 6, false);
    const hyd = new THREE.Mesh(hydGeo, chrome);
    armGroup.add(hyd);

    armGroup.position.set(
      Math.cos(angle) * 9, 0, Math.sin(angle) * 9
    );
    armGroup.lookAt(0, 0, 0);
    group.add(armGroup);
    meshes.dockingArms.push(armGroup);
  }

  // ==================== 14. SHIELD GENERATORS ====================
  for (let sg = 0; sg < 6; sg++) {
    const angle = (sg / 6) * Math.PI * 2 + Math.PI / 6;
    const sgGroup = new THREE.Group();

    // Generator body — octagonal prism via CylinderGeometry
    const genGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 8);
    const gen = new THREE.Mesh(genGeo, darkSteel);
    sgGroup.add(gen);

    // Shield emitter dome
    const domeGeo = new THREE.SphereGeometry(0.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, plasmaBlue);
    dome.position.y = 0.75;
    sgGroup.add(dome);

    // Base mount
    const baseGeo2 = new THREE.CylinderGeometry(0.7, 0.8, 0.3, 8);
    const base2 = new THREE.Mesh(baseGeo2, steel);
    base2.position.y = -0.9;
    sgGroup.add(base2);

    sgGroup.position.set(
      Math.cos(angle) * 14, 1.5, Math.sin(angle) * 14
    );
    group.add(sgGroup);
    meshes.shieldGenerators.push(sgGroup);
  }

  // ==================== 15. PARTICLE EMITTERS (BEAM INJECTORS) ====================
  for (let pe = 0; pe < 4; pe++) {
    const angle = (pe / 4) * Math.PI * 2 + Math.PI / 8;
    const peGroup = new THREE.Group();

    // Injector barrel
    const barrelGeo = new THREE.CylinderGeometry(0.15, 0.25, 3, 12);
    const barrel = new THREE.Mesh(barrelGeo, chrome);
    barrel.rotation.z = Math.PI / 2;
    peGroup.add(barrel);

    // Focusing magnets
    for (let fm = 0; fm < 4; fm++) {
      const fmGeo = new THREE.TorusGeometry(0.28, 0.04, 6, 12);
      const fmMesh = new THREE.Mesh(fmGeo, copper);
      fmMesh.position.x = -1 + fm * 0.7;
      fmMesh.rotation.y = Math.PI / 2;
      peGroup.add(fmMesh);
    }

    // Particle glow at muzzle
    const muzzleGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const muzzle = new THREE.Mesh(muzzleGeo, energyGreen);
    muzzle.position.x = 1.5;
    peGroup.add(muzzle);
    meshes.beaconLights.push(muzzle);

    peGroup.position.set(
      Math.cos(angle) * 12, 1.8, Math.sin(angle) * 12
    );
    peGroup.rotation.y = angle + Math.PI;
    group.add(peGroup);
    meshes.particleEmitters.push(peGroup);
  }

  // ==================== 16. EXTERIOR BEACON LIGHTS ====================
  for (let bl = 0; bl < 16; bl++) {
    const angle = (bl / 16) * Math.PI * 2;
    const blGeo = new THREE.SphereGeometry(0.1, 6, 6);
    const blMat = bl % 2 === 0 ? redAlert.clone() : warningOrange.clone();
    const blMesh = new THREE.Mesh(blGeo, blMat);
    blMesh.position.set(
      Math.cos(angle) * 13.8, 1.8, Math.sin(angle) * 13.8
    );
    group.add(blMesh);
    meshes.beaconLights.push(blMesh);
  }

  // ==================== 17. DECORATIVE HULL PANEL LINES ====================
  for (let pl = 0; pl < 24; pl++) {
    const angle = (pl / 24) * Math.PI * 2;
    const lineGeo = new THREE.BoxGeometry(0.02, 0.02, 3.5);
    const line = new THREE.Mesh(lineGeo, goldAccent);
    line.position.set(
      Math.cos(angle) * 12, 1.82, Math.sin(angle) * 12
    );
    line.rotation.y = angle;
    group.add(line);
  }

  // ==================== 18. INTERIOR ACCELERATION GUIDE RAILS ====================
  for (let rail = 0; rail < 4; rail++) {
    const yOff = (rail < 2) ? 0.8 : -0.8;
    const zOff = (rail % 2 === 0) ? 0.8 : -0.8;
    const railPts = [];
    for (let t = 0; t <= 40; t++) {
      railPts.push(new THREE.Vector3(-18 + t * 0.9, yOff, zOff));
    }
    const railCurve = new THREE.CatmullRomCurve3(railPts);
    const railGeo = new THREE.TubeGeometry(railCurve, 40, 0.05, 6, false);
    const railMesh = new THREE.Mesh(railGeo, chrome);
    group.add(railMesh);
  }

  // ==================== 19. APPROACH LANE LIGHTING ====================
  for (let ll = 0; ll < 20; ll++) {
    const lightGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const lightL = new THREE.Mesh(lightGeo, energyGreen.clone());
    lightL.position.set(-20 + ll * 1.6, -0.5, 1.2);
    group.add(lightL);
    const lightR = new THREE.Mesh(lightGeo.clone(), energyGreen.clone());
    lightR.position.set(-20 + ll * 1.6, -0.5, -1.2);
    group.add(lightR);
    meshes.beaconLights.push(lightL, lightR);
  }

  // ==================== PARTS ARRAY ====================
  const parts = [
    {
      name: 'Toroidal Accelerator Ring',
      description: 'Ship-scale superconducting particle accelerator ring (12m radius torus) that generates the transluminal field gradient required to puncture the bulk membrane.',
      material: 'Superconducting niobium-titanium alloy with carbon-nanotube structural reinforcement',
      function: 'Accelerates exotic matter to 99.97% c to create a Casimir-effect vacuum cavity, inducing a localised warping of the bulk brane sufficient for hyperspace window formation.',
      assemblyOrder: 1,
      connections: ['Superconducting Magnet Array', 'Capacitor Banks', 'Cryogenic Cooling System'],
      failureEffect: 'Loss of containment field causes asymmetric brane deformation — potential uncontrolled dimensional rift',
      cascadeFailures: ['Superconducting Magnet Array', 'Shield Generators'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 5, z: 0 }
    },
    {
      name: 'Superconducting Magnet Array',
      description: '32 dipole and 16 quadrupole superconducting magnets distributed around the ring circumference for beam steering and focusing.',
      material: 'Nb₃Sn (niobium-tin) windings in cryostable copper matrix at 1.9K',
      function: 'Maintains beam orbit and provides final focusing squeeze at interaction points where the exotic matter achieves critical density.',
      assemblyOrder: 2,
      connections: ['Toroidal Accelerator Ring', 'Cryogenic Cooling System', 'Quadrupole Focusing Array'],
      failureEffect: 'Magnet quench releases stored energy (~10 GJ) as heat, vaporising coolant and potentially breaching containment vessel',
      cascadeFailures: ['Cryogenic Cooling System', 'Capacitor Banks'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 3, y: 7, z: 3 }
    },
    {
      name: 'Hyperspace Portal Disc',
      description: 'The visible manifestation of the dimensional window — a stabilised Calabi-Yau fold projected into 3+1 spacetime as a disc within the ring aperture.',
      material: 'Metastable vacuum state boundary (not conventional matter)',
      function: 'Provides the traversable passage from Minkowski spacetime through the bulk to the target coordinate in compactified extra dimensions.',
      assemblyOrder: 8,
      connections: ['Toroidal Accelerator Ring', 'Gravity Lens Stabiliser', 'Shield Generators'],
      failureEffect: 'Portal collapse while a ship is in transit results in Alcubierre-horizon fragmentation — vessel sheared across dimensional boundary',
      cascadeFailures: ['Gravity Lens Stabiliser', 'Docking Guide Arms'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 10, z: 0 }
    },
    {
      name: 'Energy Collection Arrays',
      description: 'Eight articulated solar/zero-point energy collector panels providing the ~50 TW required per launch cycle.',
      material: 'Multi-junction perovskite-silicon tandem cells on carbon-fibre substrate with zero-point quantum antenna underlayer',
      function: 'Harvests stellar radiation and quantum vacuum fluctuations, converting to stored electrical energy in the capacitor banks for each launch cycle.',
      assemblyOrder: 3,
      connections: ['Capacitor Banks', 'Control Tower'],
      failureEffect: 'Power deficit reduces portal stability margin; launches become probabilistic with increasing dimensional scatter',
      cascadeFailures: ['Capacitor Banks'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 3, z: 8 }
    },
    {
      name: 'Capacitor Banks',
      description: '12 high-energy-density supercapacitor modules storing the charge for rapid-discharge ring energisation.',
      material: 'Graphene-boron-nitride heterostructure dielectric with room-temperature superconductor leads',
      function: 'Stores 500 GJ per bank and discharges in 0.2 seconds to ramp the ring to full field during the portal-formation sequence.',
      assemblyOrder: 4,
      connections: ['Energy Collection Arrays', 'Toroidal Accelerator Ring', 'Superconducting Magnet Array'],
      failureEffect: 'Capacitor rupture releases stored energy as an electromagnetic pulse, disabling all electronics in a 5 km radius',
      cascadeFailures: ['Energy Collection Arrays', 'Superconducting Magnet Array'],
      originalPosition: { x: 0, y: -2.5, z: 0 },
      explodedPosition: { x: 5, y: -8, z: 5 }
    },
    {
      name: 'Cryogenic Cooling System',
      description: 'Closed-cycle helium-3/helium-4 dilution refrigeration network maintaining magnets at 1.9 Kelvin.',
      material: 'Invar 36 alloy piping with aerogel-insulated multi-layer superinsulation',
      function: 'Removes ~200 kW of heat from the magnet string and beam screen, preventing quench during sustained operation.',
      assemblyOrder: 5,
      connections: ['Superconducting Magnet Array', 'Support Pylons'],
      failureEffect: 'Magnet temperature exceeds critical temperature (Tc); immediate quench cascade propagates around ring in ~0.3 seconds',
      cascadeFailures: ['Superconducting Magnet Array', 'Toroidal Accelerator Ring'],
      originalPosition: { x: 0, y: -1.5, z: 0 },
      explodedPosition: { x: -4, y: -6, z: -4 }
    },
    {
      name: 'Control Tower',
      description: 'Multi-deck command facility housing launch sequencing AI, dimensional navigation, and safety interlock systems.',
      material: 'Titanium-ceramic composite hull with borosilicate observation windows',
      function: 'Coordinates the 847-step launch sequence, monitors portal topology in real-time, and houses manual override controls.',
      assemblyOrder: 6,
      connections: ['Energy Collection Arrays', 'Shield Generators', 'Docking Guide Arms'],
      failureEffect: 'Loss of sequencing control; automated safety interlocks engage, preventing launches until manual restart',
      cascadeFailures: ['Docking Guide Arms'],
      originalPosition: { x: 18, y: -10, z: 0 },
      explodedPosition: { x: 28, y: -5, z: 0 }
    },
    {
      name: 'Gravity Lens Stabiliser',
      description: 'Central exotic-matter sphere that pins the portal topology and prevents Cauchy horizon formation.',
      material: 'Negative-energy-density Casimir vacuum confined in electromagnetic bottle',
      function: 'Generates a controlled gravitational lens effect that stabilises the portal throat, maintaining a minimum traversable diameter of 50 metres.',
      assemblyOrder: 9,
      connections: ['Hyperspace Portal Disc', 'Toroidal Accelerator Ring'],
      failureEffect: 'Portal throat collapses to Planck scale; transition from traversable wormhole to singularity',
      cascadeFailures: ['Hyperspace Portal Disc'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 12, z: 0 }
    },
    {
      name: 'Support Pylons',
      description: 'Six structural pylons anchoring the ring assembly to the station superstructure.',
      material: 'Carbon-nanotube reinforced titanium truss with vibration-damping elastomer joints',
      function: 'Transfers the enormous mechanical loads from ring operations (including asymmetric thrust during portal formation) to the station frame.',
      assemblyOrder: 7,
      connections: ['Toroidal Accelerator Ring', 'Cryogenic Cooling System'],
      failureEffect: 'Ring misalignment exceeds 0.01°; portal vector error causes exit-point deviation of thousands of parsecs',
      cascadeFailures: ['Toroidal Accelerator Ring'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -12, z: 0 }
    },
    {
      name: 'Docking Guide Arms',
      description: 'Four telescoping magnetic grapple arms that align vessels with the launch corridor.',
      material: 'Hardened steel telescoping segments with electromagnetic tip assemblies',
      function: 'Captures approaching vessels via magnetic lock, precisely aligns them to ±0.5 mm of the launch axis, and releases at T-0.',
      assemblyOrder: 10,
      connections: ['Control Tower', 'Approach Lane Lighting'],
      failureEffect: 'Ship enters portal off-axis; tidal forces across dimensional boundary exceed hull structural limits',
      cascadeFailures: ['Control Tower'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 4, z: 10 }
    },
    {
      name: 'Shield Generators',
      description: 'Six electromagnetic/gravitic shield emitters protecting the ring and nearby vessels from radiation and debris.',
      material: 'High-permeability mu-metal cores with plasma window emitters',
      function: 'Projects overlapping shield bubbles to deflect radiation burst during portal formation (peak flux ~10²⁰ W/m²) and prevent debris ingestion.',
      assemblyOrder: 11,
      connections: ['Energy Collection Arrays', 'Control Tower'],
      failureEffect: 'Unshielded radiation exposure during launch; lethal dose to all personnel within 200m in 0.1 seconds',
      cascadeFailures: ['Control Tower', 'Energy Collection Arrays'],
      originalPosition: { x: 0, y: 1.5, z: 0 },
      explodedPosition: { x: 6, y: 9, z: 6 }
    },
    {
      name: 'Particle Beam Injectors',
      description: 'Four high-energy exotic particle injectors feeding the accelerator ring with negative-energy-density matter.',
      material: 'Tungsten-rhenium alloy barrels with samarium-cobalt focusing magnets',
      function: 'Injects pre-accelerated exotic particles into the ring at 10 GeV, which are then ramped to the ~10 PeV needed for brane puncture.',
      assemblyOrder: 12,
      connections: ['Toroidal Accelerator Ring', 'Superconducting Magnet Array'],
      failureEffect: 'Injection failure results in ring filling with conventional matter; beam dump required to prevent magnet damage',
      cascadeFailures: ['Superconducting Magnet Array'],
      originalPosition: { x: 0, y: 1.8, z: 0 },
      explodedPosition: { x: -5, y: 8, z: -5 }
    },
    {
      name: 'Approach Lane Lighting',
      description: 'Precision guidance lighting array marking the vessel approach corridor.',
      material: 'Quantum-dot LED arrays in radiation-hardened housings',
      function: 'Provides visual and automated guidance for approaching vessels, syncing with docking arm telemetry for final approach.',
      assemblyOrder: 13,
      connections: ['Docking Guide Arms', 'Control Tower'],
      failureEffect: 'Pilot spatial disorientation on approach; collision risk with ring structure',
      cascadeFailures: ['Docking Guide Arms'],
      originalPosition: { x: -10, y: -0.5, z: 0 },
      explodedPosition: { x: -18, y: -3, z: 0 }
    },
    {
      name: 'Quadrupole Focusing Array',
      description: '16 precision quadrupole magnet assemblies providing transverse beam squeeze at critical focusing points.',
      material: 'Nb₃Sn superconductor in copper-nickel alloy former',
      function: 'Squeezes the beam cross-section from 2 cm to 50 μm at interaction points, achieving the energy density required for vacuum breakdown.',
      assemblyOrder: 14,
      connections: ['Superconducting Magnet Array', 'Toroidal Accelerator Ring'],
      failureEffect: 'Beam defocusing reduces energy density below threshold; portal fails to form',
      cascadeFailures: ['Superconducting Magnet Array'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -3, y: 6, z: -3 }
    },
    {
      name: 'Dimensional Tear Stabilisers',
      description: 'Concentric ring projectors that shape the raw dimensional puncture into a stable, navigable portal.',
      material: 'Phase-conjugate metamaterial rings with embedded exotic matter traces',
      function: 'Projects counter-rotating electromagnetic vortices that smooth the brane tear topology into a Krasnikov-tube geometry.',
      assemblyOrder: 15,
      connections: ['Hyperspace Portal Disc', 'Gravity Lens Stabiliser', 'Toroidal Accelerator Ring'],
      failureEffect: 'Unstabilised portal exhibits chaotic topology fluctuations; transit survival probability drops below 12%',
      cascadeFailures: ['Hyperspace Portal Disc', 'Gravity Lens Stabiliser'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 14, z: 0 }
    },
    {
      name: 'Interior Acceleration Guide Rails',
      description: 'Four precision electromagnetic guide rails running through the launch corridor to impart final velocity boost.',
      material: 'Maglev rail superconductor in vacuum-rated carbon-fibre housing',
      function: 'Provides supplementary 50G electromagnetic acceleration during the final 36m of approach, ensuring vessels reach minimum transit velocity.',
      assemblyOrder: 16,
      connections: ['Docking Guide Arms', 'Capacitor Banks'],
      failureEffect: 'Ship enters portal below minimum velocity; insufficient momentum to traverse full portal depth, ship trapped in inter-dimensional space',
      cascadeFailures: ['Capacitor Banks', 'Docking Guide Arms'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -4, z: 6 }
    }
  ];

  // ==================== QUIZ QUESTIONS ====================
  const quizQuestions = [
    {
      question: 'In Kaluza-Klein theory, what is the physical interpretation of the fifth dimension\'s compactification radius, and how does it relate to the observed fine-structure constant α ≈ 1/137?',
      options: [
        'The compactification radius R₅ is arbitrary and has no physical observable',
        'R₅ is related to α by R₅ = ℓ_P √(2α), where ℓ_P is the Planck length, linking the geometry of the compact dimension directly to electromagnetic coupling strength',
        'R₅ determines only the gravitational constant G, not electromagnetic coupling',
        'The fifth dimension must be infinite for electromagnetism to emerge'
      ],
      correct: 1,
      explanation: 'In the original Kaluza-Klein unification, the metric component g₅₅ = φ (the scalar dilaton) and the off-diagonal g_{μ5} components yield the electromagnetic potential A_μ upon dimensional reduction. The compactification radius R₅ is fixed by requiring that the effective 4D gauge coupling equals the observed value of e² = 4πα, giving R₅ = ℓ_P √(2α) ≈ 10⁻³³ cm — far below experimental detectability. This elegant geometric origin of α was the great promise (and ultimate limitation) of the original 5D theory.'
    },
    {
      question: 'The Randall-Sundrum (RS) model proposes a warped extra dimension with metric ds² = e^{-2k|y|} η_{μν}dx^μ dx^ν + dy². What physical problem does the exponential warp factor e^{-2k|y|} solve that flat extra dimensions cannot?',
      options: [
        'It explains dark energy as curvature of the extra dimension',
        'It solves the gauge hierarchy problem by exponentially suppressing the effective mass scale on the TeV brane relative to the Planck brane, naturally generating the 16 orders of magnitude ratio M_EW/M_Pl without fine-tuning',
        'It predicts the exact number of quark generations',
        'It eliminates the need for the Higgs mechanism entirely'
      ],
      correct: 1,
      explanation: 'The RS1 model places the Standard Model on a "TeV brane" at y = πR and gravity on a "Planck brane" at y = 0. The exponential warp factor e^{-kπR} with kR ≈ 12 naturally generates the ratio M_EW/M_Pl ≈ e^{-kπR} ≈ 10⁻¹⁶ without any extreme fine-tuning of parameters. This is the warped resolution of the hierarchy problem — mass scales that appear on the Planck brane as O(M_Pl) are exponentially redshifted to O(TeV) on the visible brane. The hyperspace catapult exploits precisely this brane-localised warp to create a traversable corridor through the bulk.'
    },
    {
      question: 'In string theory, compactification of 10D spacetime on a Calabi-Yau threefold CY₃ yields N=1 supersymmetry in 4D. How does the Hodge number h^{1,1} of the Calabi-Yau manifold determine the low-energy particle spectrum?',
      options: [
        'h^{1,1} counts the number of quark flavours',
        'h^{1,1} gives the number of massless U(1) gauge bosons (graviphotons) in the 4D effective theory, corresponding to harmonic (1,1)-forms on the Calabi-Yau that yield vector multiplets upon dimensional reduction',
        'h^{1,1} is irrelevant; only h^{2,1} matters for the particle spectrum',
        'h^{1,1} determines the cosmological constant'
      ],
      correct: 1,
      explanation: 'Upon Type IIB compactification on CY₃, the Kähler moduli sector has h^{1,1} complex scalar fields (Kähler moduli) in vector multiplets, each associated with a massless U(1) gauge field from the dimensional reduction of the RR 4-form C₄ on the (1,1)-cycles. Meanwhile, h^{2,1} counts the complex structure moduli in hypermultiplets. Together, (h^{1,1}, h^{2,1}) define the full massless spectrum. The portal\'s stability depends on fixing all these moduli via flux compactification (the KKLT or Large Volume Scenario).'
    },
    {
      question: 'A traversable wormhole requires violation of the averaged null energy condition (ANEC): ∫ T_{μν} k^μ k^ν dλ < 0 along a complete null geodesic. The Casimir effect between parallel plates produces negative energy density. Why is the Casimir effect alone insufficient to stabilise a macroscopic traversable wormhole?',
      options: [
        'The Casimir effect only works in curved spacetime',
        'Quantum interest conjecture and Ford-Roman quantum inequalities constrain the magnitude and duration of negative energy: the total negative energy scales as ~-ℏc/L⁴ (for plate separation L) and any negative energy pulse must be "repaid" by a subsequent larger positive energy pulse, making the required macroscopic throat radius energetically impossible without exotic physics beyond standard QFT',
        'The Casimir effect produces positive energy, not negative',
        'Traversable wormholes do not actually require ANEC violation'
      ],
      correct: 1,
      explanation: 'The Ford-Roman quantum inequalities place strict bounds on the magnitude × duration product of negative energy densities in flat spacetime QFT. For the Casimir effect with plate separation L, |ρ_neg| ~ ℏc/L⁴, and the quantum interest conjecture requires any negative energy loan to be repaid with interest by subsequent positive energy. To hold open a wormhole throat of radius r₀, one needs E_neg ~ -r₀c⁴/G ≈ -10⁴⁴ J for r₀ ~ 1m. The Casimir energy between plates separated by 1m is only ~10⁻²⁴ J — a shortfall of ~68 orders of magnitude. The catapult\'s exotic matter generator must therefore exploit physics beyond standard QFT, possibly involving large extra dimensions that amplify Casimir-like effects.'
    },
    {
      question: 'In M-theory, the strong coupling limit of Type IIA string theory reveals an eleventh dimension. The Kaluza-Klein tower of states arising from compactification of this 11th dimension on S¹ of radius R₁₁ has masses m_n = n/R₁₁. How does R₁₁ relate to the Type IIA string coupling g_s?',
      options: [
        'R₁₁ = g_s^{1/3} ℓ_s — weakly coupled strings correspond to small extra dimension',
        'R₁₁ = g_s^{2/3} ℓ_s, so the 11th dimension decompactifies as g_s → ∞, revealing the full 11D M-theory; the Type IIA D0-brane mass m_{D0} = 1/(g_s ℓ_s) = 1/R₁₁ is identified with the first KK mode',
        'R₁₁ is independent of g_s and fixed by supersymmetry',
        'R₁₁ = 1/g_s — the dimension shrinks at strong coupling'
      ],
      correct: 1,
      explanation: 'The fundamental relation R₁₁ = g_s^{2/3} ℓ_s (equivalently R₁₁ = g_s ℓ_s in conventions where M₁₁ = ℓ_s⁻¹ g_s⁻¹/³) shows that as the Type IIA string coupling g_s → ∞, the radius R₁₁ → ∞ and an eleventh flat dimension opens up, revealing 11-dimensional supergravity (M-theory). The D0-branes of Type IIA, with mass 1/(g_s ℓ_s), are identified as the Kaluza-Klein modes of the graviton on S¹. This was Witten\'s key insight (1995) connecting all five string theories as limits of a single 11D framework. The catapult\'s hyperdrive exploits controlled decompactification of such hidden dimensions.'
    },
    {
      question: 'The ADD (Arkani-Hamed, Dimopoulos, Dvali) model postulates n large extra dimensions of radius R to explain the hierarchy problem. If the fundamental gravity scale is M_* ~ 1 TeV, the relation M_Pl² = M_*^{n+2} R^n gives R ≈ 10^{32/n - 19} m. For n = 2, this predicts R ≈ 0.1 mm. What is the primary experimental signature that would confirm or exclude n = 2 large extra dimensions at sub-millimetre scales?',
      options: [
        'Proton decay rate enhancement at LHC energies',
        'Deviation from the Newtonian inverse-square law of gravity below ~0.1 mm, transitioning to a 1/r⁴ force law, testable by precision torsion-balance (Eöt-Wash type) experiments measuring gravitational attraction at sub-millimetre separations',
        'Production of magnetic monopoles in cosmic rays',
        'Modification of the electromagnetic Coulomb force at atomic scales'
      ],
      correct: 1,
      explanation: 'In the ADD scenario with n = 2, gravity propagates in 4 + 2 = 6 dimensions below the compactification scale, so the gravitational potential transitions from V(r) ∝ 1/r (r >> R) to V(r) ∝ 1/r³ (r << R), giving a force law F ∝ 1/r⁴. The predicted R ≈ 100 μm is accessible to tabletop experiments. The University of Washington Eöt-Wash group has tested gravity down to ~50 μm, finding no deviation and pushing the exclusion limit on M_* above ~3.6 TeV for n = 2. This is complemented by LHC searches for virtual graviton exchange and missing-energy signatures from graviton emission into the bulk. The catapult must operate at energy densities where these extra dimensions become dynamically accessible.'
    }
  ];

  // ==================== DESCRIPTION ====================
  const description = `Hyperspace Catapult — Ultra God Tier Megastructure

A ship-scale toroidal particle accelerator (24m diameter) that generates sufficient exotic-matter energy density to puncture the spacetime brane and open a stabilised traversable hyperspace window. The system consists of a superconducting accelerator ring housing 32 dipole and 16 quadrupole magnets cooled to 1.9K, fed by four particle beam injectors and powered by eight articulated energy collection arrays. A central gravity lens stabiliser pins the portal topology while concentric dimensional tear stabilisers shape the raw puncture into a navigable Krasnikov-tube geometry. Ships approach via a guided corridor, are captured by four magnetic docking arms, electromagnetically boosted by guide rails, and launched through the portal at superluminal transit velocity. Six shield generators protect the vicinity from the enormous radiation flux during portal formation. The entire operation is coordinated by the Control Tower's 847-step automated launch sequence.

Engineering Specifications:
• Ring circumference: 75.4 m (12m radius)
• Beam energy: 10 PeV exotic matter
• Portal diameter: 50m minimum traversable
• Energy per launch: 6 TJ (12 × 500 GJ capacitor banks)
• Coolant: ³He/⁴He dilution refrigerant at 1.9K
• Launch cycle: 180 seconds (charge) + 0.2s (discharge/formation) + 2s (transit window)
• Maximum vessel mass: 50,000 tonnes`;

  // ==================== ANIMATION ====================
  function animate(time, speed, ms) {
    const t = time * speed;

    // --- 1. Ring rotation (slow majestic spin) ---
    if (ms.outerRing) {
      ms.outerRing.rotation.z = t * 0.05;
    }
    if (ms.innerRing) {
      ms.innerRing.rotation.z = -t * 0.08;
    }

    // --- 2. Magnet segments — pulsing scale ---
    if (ms.magnetSegments) {
      ms.magnetSegments.forEach((seg, i) => {
        const phase = t * 2 + i * 0.2;
        const pulse = 1 + Math.sin(phase) * 0.03;
        seg.scale.set(pulse, pulse, pulse);
      });
    }

    // --- 3. Portal formation cycle (periodic open/close) ---
    const cyclePeriod = 12;
    const cyclePhase = (t % cyclePeriod) / cyclePeriod;
    let portalScale = 0;
    if (cyclePhase < 0.3) {
      // Charging phase — portal growing
      portalScale = cyclePhase / 0.3;
    } else if (cyclePhase < 0.7) {
      // Active phase — portal fully open
      portalScale = 1;
    } else if (cyclePhase < 0.85) {
      // Closing phase
      portalScale = 1 - (cyclePhase - 0.7) / 0.15;
    } else {
      // Cooldown
      portalScale = 0;
    }

    if (ms.portalDisc) {
      ms.portalDisc.scale.set(portalScale, portalScale, portalScale);
      ms.portalDisc.rotation.y = t * 0.3;
      if (ms.portalDisc.material) {
        ms.portalDisc.material.emissiveIntensity = 2 + Math.sin(t * 5) * 1.5 * portalScale;
        ms.portalDisc.material.opacity = 0.3 + portalScale * 0.5;
      }
    }

    // --- 4. Dimensional tear effects — concentric rings expand ---
    if (ms.tearEffects) {
      ms.tearEffects.forEach((tear, i) => {
        const tearScale = portalScale * (0.5 + i * 0.08);
        tear.scale.set(tearScale, tearScale, tearScale);
        tear.rotation.z = t * (0.2 + i * 0.05) * (i % 2 === 0 ? 1 : -1);
        if (tear.material) {
          tear.material.opacity = 0.15 + Math.sin(t * 3 + i) * 0.1 * portalScale;
        }
      });
    }

    // --- 5. Gravity lens pulsation ---
    if (ms.gravityLens) {
      const lensScale = portalScale * (1 + Math.sin(t * 4) * 0.15);
      ms.gravityLens.scale.set(lensScale, lensScale, lensScale);
    }

    // --- 6. Energy array panel articulation ---
    if (ms.energyArrays) {
      ms.energyArrays.forEach((arr, i) => {
        arr.rotation.x = Math.sin(t * 0.3 + i * 0.5) * 0.15;
        arr.rotation.z = Math.sin(t * 0.2 + i * 0.3) * 0.08;
      });
    }

    // --- 7. Ship queue advancement and launch ---
    if (ms.ships) {
      ms.ships.forEach((ship, i) => {
        const shipCycleOffset = i * 0.15;
        const shipPhase = ((t + shipCycleOffset) % cyclePeriod) / cyclePeriod;

        if (shipPhase < 0.25) {
          // Approaching
          const approach = shipPhase / 0.25;
          ship.position.x = -20 + approach * 20;
          ship.position.y = Math.sin(approach * Math.PI) * 0.3;
          ship.visible = true;
        } else if (shipPhase < 0.5 && portalScale > 0.8) {
          // Launching through portal
          const launch = (shipPhase - 0.25) / 0.25;
          ship.position.x = launch * 30;
          ship.position.y = 0;
          ship.scale.set(0.6 - launch * 0.4, 0.6 - launch * 0.4, 0.6 - launch * 0.4);
        } else if (shipPhase >= 0.5 && shipPhase < 0.55) {
          // Disappear
          ship.visible = false;
        } else {
          // Reset for next cycle
          ship.position.x = -20 + i * 4;
          ship.position.y = 0;
          ship.scale.set(0.6, 0.6, 0.6);
          ship.visible = true;
        }

        // Gentle hover bob
        ship.position.y += Math.sin(t * 2 + i) * 0.05;
        ship.rotation.z = Math.sin(t * 1.5 + i * 0.7) * 0.02;
      });
    }

    // --- 8. Launch trails ---
    if (ms.launchTrails) {
      ms.launchTrails.forEach((trail, i) => {
        if (portalScale > 0.8 && cyclePhase > 0.3 && cyclePhase < 0.6) {
          const trailPhase = (cyclePhase - 0.3) / 0.3;
          trail.material.opacity = (1 - i * 0.15) * trailPhase;
          trail.scale.y = 1 + Math.sin(t * 10 + i * 2) * 0.5;
          trail.position.x = 12 + i * 2 + trailPhase * 5;
        } else {
          trail.material.opacity = 0;
        }
      });
    }

    // --- 9. Capacitor charge indicators ---
    if (ms.chargeIndicators) {
      ms.chargeIndicators.forEach((bar, i) => {
        const chargeLevel = Math.min(1, cyclePhase / 0.25);
        bar.scale.y = chargeLevel;
        if (bar.material && bar.material.emissive) {
          bar.material.emissiveIntensity = 1 + chargeLevel * 2;
        }
      });
    }

    // --- 10. Beacon lights blinking ---
    if (ms.beaconLights) {
      ms.beaconLights.forEach((bl, i) => {
        if (bl.material) {
          const blink = Math.sin(t * 4 + i * 1.3) > 0 ? 1 : 0;
          bl.material.emissiveIntensity = blink * 2.5;
        }
      });
    }

    // --- 11. Conduit rings energy pulse ---
    if (ms.conduitRings) {
      ms.conduitRings.forEach((ring, i) => {
        const pulseWave = Math.sin(t * 6 - i * 0.3);
        ring.scale.set(1 + pulseWave * 0.08, 1 + pulseWave * 0.08, 1);
      });
    }

    // --- 12. Docking arms telescoping ---
    if (ms.dockingArms) {
      ms.dockingArms.forEach((arm, i) => {
        const extend = portalScale > 0.5 ? 0.8 : 1.0;
        arm.scale.z = extend + Math.sin(t + i) * 0.05;
      });
    }

    // --- 13. Shield generator dome pulse ---
    if (ms.shieldGenerators) {
      ms.shieldGenerators.forEach((sg, i) => {
        const shieldPulse = 1 + Math.sin(t * 3 + i * 1.1) * 0.06;
        sg.scale.set(shieldPulse, shieldPulse, shieldPulse);
      });
    }

    // --- 14. Cooling pipes shimmer ---
    if (ms.coolingPipes) {
      ms.coolingPipes.forEach((pipe, i) => {
        if (pipe.material) {
          pipe.material.emissiveIntensity = 1.2 + Math.sin(t * 2 + i * 0.9) * 0.8;
        }
      });
    }

    // --- 15. Accelerator coils rotation ---
    if (ms.acceleratorCoils) {
      ms.acceleratorCoils.forEach((coil, i) => {
        coil.rotation.z = t * 0.5 + i * 0.3;
      });
    }

    // --- 16. Support struts vibration during launch ---
    if (ms.supportStruts) {
      ms.supportStruts.forEach((strut, i) => {
        const vib = portalScale > 0.5 ? Math.sin(t * 30 + i * 5) * 0.01 : 0;
        strut.position.y = vib;
      });
    }

    // --- 17. Particle emitters glow sync ---
    if (ms.particleEmitters) {
      ms.particleEmitters.forEach((pe, i) => {
        const firingIntensity = cyclePhase < 0.3 ? cyclePhase / 0.3 : (cyclePhase < 0.7 ? 1 : 0);
        pe.scale.set(1 + firingIntensity * 0.1, 1, 1);
      });
    }

    // --- 18. Control tower beacon ---
    if (ms.controlTower) {
      ms.controlTower.rotation.y = Math.sin(t * 0.1) * 0.02;
    }
  }

  // Return complete machine definition
  return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}
