import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

// ── Custom Hi-Tech Materials ──────────────────────────────────────────────────
function _glow(THREE, color, intensity = 2.0) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: intensity,
    metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.92
  });
}

function _neon(THREE, color) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 3.5,
    metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.85
  });
}

function _paintBody(THREE, hex = 0xcc2222) {
  return new THREE.MeshStandardMaterial({
    color: hex, metalness: 0.35, roughness: 0.28,
    envMapIntensity: 1.2
  });
}

function _hydraulicFluid(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xddaa22, emissive: 0x886600, emissiveIntensity: 0.4,
    metalness: 0.6, roughness: 0.15
  });
}

function _concrete(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, metalness: 0.05, roughness: 0.85
  });
}

function _warningStripe(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xffcc00, emissive: 0xff9900, emissiveIntensity: 0.3,
    metalness: 0.2, roughness: 0.5
  });
}

// ── Geometry Helpers ──────────────────────────────────────────────────────────

function createRealisticTire(THREE, outerR, tubeR, rimDepth) {
  const tireGroup = new THREE.Group();

  // Main tire body (torus)
  const tireGeo = new THREE.TorusGeometry(outerR, tubeR, 20, 48);
  const tireMesh = new THREE.Mesh(tireGeo, rubber(THREE));
  tireGroup.add(tireMesh);

  // Tread pattern: extruded lugs around circumference
  const lugCount = 36;
  const lugW = tubeR * 0.28, lugH = tubeR * 0.18, lugD = tubeR * 0.6;
  const lugGeo = new THREE.BoxGeometry(lugW, lugH, lugD);
  for (let i = 0; i < lugCount; i++) {
    const angle = (i / lugCount) * Math.PI * 2;
    const lug = new THREE.Mesh(lugGeo, rubber(THREE));
    lug.position.set(
      Math.cos(angle) * (outerR + tubeR * 0.82),
      Math.sin(angle) * (outerR + tubeR * 0.82),
      0
    );
    lug.rotation.z = angle;
    tireGroup.add(lug);

    // Mirrored inner lug row
    const lug2 = lug.clone();
    lug2.position.z = tubeR * 0.35;
    tireGroup.add(lug2);
    const lug3 = lug.clone();
    lug3.position.z = -tubeR * 0.35;
    tireGroup.add(lug3);
  }

  // Sidewall groove rings
  for (let s = -1; s <= 1; s += 2) {
    const grooveGeo = new THREE.TorusGeometry(outerR, tubeR * 0.06, 8, 48);
    const groove = new THREE.Mesh(grooveGeo, darkSteel(THREE));
    groove.position.z = s * tubeR * 0.55;
    tireGroup.add(groove);
  }

  // Rim (cylinder with spokes)
  const rimGeo = new THREE.CylinderGeometry(outerR * 0.58, outerR * 0.58, rimDepth, 32);
  const rim = new THREE.Mesh(rimGeo, chrome(THREE));
  rim.rotation.x = Math.PI / 2;
  tireGroup.add(rim);

  // Rim hub
  const hubGeo = new THREE.CylinderGeometry(outerR * 0.18, outerR * 0.18, rimDepth * 1.15, 16);
  const hub = new THREE.Mesh(hubGeo, darkSteel(THREE));
  hub.rotation.x = Math.PI / 2;
  tireGroup.add(hub);

  // Hub cap
  const hubCapGeo = new THREE.CylinderGeometry(outerR * 0.12, outerR * 0.14, rimDepth * 0.15, 16);
  const hubCap = new THREE.Mesh(hubCapGeo, chrome(THREE));
  hubCap.rotation.x = Math.PI / 2;
  hubCap.position.z = rimDepth * 0.6;
  tireGroup.add(hubCap);

  // Spokes
  const spokeCount = 8;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const spokeGeo = new THREE.BoxGeometry(outerR * 0.38, rimDepth * 0.6, outerR * 0.065);
    const spoke = new THREE.Mesh(spokeGeo, aluminum(THREE));
    spoke.position.set(
      Math.cos(angle) * outerR * 0.38,
      Math.sin(angle) * outerR * 0.38,
      0
    );
    spoke.rotation.z = angle;
    tireGroup.add(spoke);
  }

  // Lug nuts on hub
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const nutGeo = new THREE.CylinderGeometry(outerR * 0.03, outerR * 0.03, rimDepth * 0.2, 6);
    const nut = new THREE.Mesh(nutGeo, chrome(THREE));
    nut.rotation.x = Math.PI / 2;
    nut.position.set(Math.cos(a) * outerR * 0.22, Math.sin(a) * outerR * 0.22, rimDepth * 0.55);
    tireGroup.add(nut);
  }

  tireGroup.rotation.x = Math.PI / 2; // Stand upright
  return tireGroup;
}

function createHydraulicCylinder(THREE, length, radius) {
  const grp = new THREE.Group();
  // Outer cylinder (barrel)
  const barrelGeo = new THREE.CylinderGeometry(radius, radius, length * 0.55, 16);
  const barrel = new THREE.Mesh(barrelGeo, steel(THREE));
  barrel.position.y = length * 0.225;
  grp.add(barrel);

  // Inner rod (piston)
  const rodGeo = new THREE.CylinderGeometry(radius * 0.5, radius * 0.5, length * 0.6, 12);
  const rod = new THREE.Mesh(rodGeo, chrome(THREE));
  rod.name = 'pistonRod';
  rod.position.y = -length * 0.15;
  grp.add(rod);

  // End caps
  for (let s = -1; s <= 1; s += 2) {
    const capGeo = new THREE.SphereGeometry(radius * 1.15, 10, 10);
    const cap = new THREE.Mesh(capGeo, darkSteel(THREE));
    cap.position.y = s * length * 0.5;
    grp.add(cap);
  }

  // Hydraulic line connection ports
  for (let s = -1; s <= 1; s += 2) {
    const portGeo = new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, radius * 0.8, 8);
    const port = new THREE.Mesh(portGeo, copper(THREE));
    port.rotation.z = Math.PI / 2;
    port.position.set(radius * 1.1, s * length * 0.3, 0);
    grp.add(port);
  }

  return grp;
}

function createHydraulicLine(THREE, points, radius = 0.02) {
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 24, radius, 8, false);
  return new THREE.Mesh(tubeGeo, copper(THREE));
}

function createPipeSection(THREE, points, radius, mat) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 32, radius, 12, false);
  return new THREE.Mesh(geo, mat);
}

// ── Main Model ────────────────────────────────────────────────────────────────

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  const bodyPaint = _paintBody(THREE, 0xcc2222); // Putzmeister Red
  const accentPaint = _paintBody(THREE, 0x333333);
  const glowGreen = _glow(THREE, 0x00ff88, 1.8);
  const glowOrange = _glow(THREE, 0xff6600, 1.5);
  const neonBlue = _neon(THREE, 0x00aaff);
  const warningMat = _warningStripe(THREE);
  const concreteMat = _concrete(THREE);
  const hydraulicMat = _hydraulicFluid(THREE);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. TRUCK CHASSIS & FRAME
  // ═══════════════════════════════════════════════════════════════════════════
  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'chassis';

  // Main frame rails (dual I-beam)
  for (let s = -1; s <= 1; s += 2) {
    const railGeo = new THREE.BoxGeometry(0.15, 0.25, 7.5);
    const rail = new THREE.Mesh(railGeo, darkSteel(THREE));
    rail.position.set(s * 0.45, 0.6, 0);
    chassisGroup.add(rail);

    // Cross members
    for (let i = -3; i <= 3; i++) {
      const crossGeo = new THREE.BoxGeometry(1.1, 0.08, 0.12);
      const cross = new THREE.Mesh(crossGeo, darkSteel(THREE));
      cross.position.set(0, 0.55, i * 0.9);
      chassisGroup.add(cross);
    }
  }

  // Chassis undercarriage armor plate
  const armorGeo = new THREE.BoxGeometry(1.0, 0.06, 6.8);
  const armor = new THREE.Mesh(armorGeo, darkSteel(THREE));
  armor.position.set(0, 0.45, 0);
  chassisGroup.add(armor);

  group.add(chassisGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. OPERATOR CABIN
  // ═══════════════════════════════════════════════════════════════════════════
  const cabinGroup = new THREE.Group();
  cabinGroup.name = 'cabin';

  // Cabin body – using LatheGeometry for smoother modern shape
  const cabinProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.9, 0),
    new THREE.Vector2(0.95, 0.1),
    new THREE.Vector2(0.95, 1.0),
    new THREE.Vector2(0.85, 1.35),
    new THREE.Vector2(0.6, 1.5),
    new THREE.Vector2(0, 1.5),
  ];
  const cabinLath = new THREE.LatheGeometry(cabinProfile, 4, 0, Math.PI);
  const cabinMesh = new THREE.Mesh(cabinLath, bodyPaint);
  cabinMesh.position.set(0, 0.75, 3.0);
  cabinMesh.rotation.y = Math.PI / 2;
  cabinGroup.add(cabinMesh);

  // Windshield
  const windshieldGeo = new THREE.PlaneGeometry(1.6, 1.0);
  const windshield = new THREE.Mesh(windshieldGeo, tinted(THREE));
  windshield.position.set(0, 1.65, 3.7);
  windshield.rotation.x = -0.15;
  cabinGroup.add(windshield);

  // Side windows
  for (let s = -1; s <= 1; s += 2) {
    const sideWinGeo = new THREE.PlaneGeometry(0.9, 0.7);
    const sideWin = new THREE.Mesh(sideWinGeo, tinted(THREE));
    sideWin.position.set(s * 0.88, 1.6, 3.2);
    sideWin.rotation.y = s * Math.PI / 2;
    cabinGroup.add(sideWin);
  }

  // Mirrors
  for (let s = -1; s <= 1; s += 2) {
    const mirrorArmGeo = new THREE.BoxGeometry(0.5, 0.04, 0.04);
    const mirrorArm = new THREE.Mesh(mirrorArmGeo, darkSteel(THREE));
    mirrorArm.position.set(s * 1.15, 1.7, 3.5);
    cabinGroup.add(mirrorArm);

    const mirrorGeo = new THREE.BoxGeometry(0.04, 0.2, 0.3);
    const mirror = new THREE.Mesh(mirrorGeo, glass(THREE));
    mirror.position.set(s * 1.4, 1.65, 3.5);
    cabinGroup.add(mirror);
  }

  // Headlights
  for (let s = -1; s <= 1; s += 2) {
    const hlGeo = new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI);
    const hl = new THREE.Mesh(hlGeo, glowOrange);
    hl.position.set(s * 0.65, 1.1, 3.85);
    hl.rotation.y = Math.PI;
    cabinGroup.add(hl);

    // Light housing
    const hlHousingGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16);
    const hlHousing = new THREE.Mesh(hlHousingGeo, chrome(THREE));
    hlHousing.rotation.x = Math.PI / 2;
    hlHousing.position.set(s * 0.65, 1.1, 3.82);
    cabinGroup.add(hlHousing);
  }

  // Steps/ladder to cabin
  for (let i = 0; i < 3; i++) {
    const stepGeo = new THREE.BoxGeometry(0.35, 0.03, 0.12);
    const step = new THREE.Mesh(stepGeo, aluminum(THREE));
    step.position.set(-0.85, 0.55 + i * 0.3, 3.2 + i * 0.1);
    cabinGroup.add(step);
  }

  // Cabin roof beacon light
  const beaconGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.1, 12);
  const beacon = new THREE.Mesh(beaconGeo, glowOrange);
  beacon.position.set(0, 2.35, 3.0);
  meshes.beacon = beacon;
  cabinGroup.add(beacon);

  // Roof rack / sunvisor
  const visorGeo = new THREE.BoxGeometry(1.5, 0.04, 0.4);
  const visor = new THREE.Mesh(visorGeo, accentPaint);
  visor.position.set(0, 2.28, 3.6);
  cabinGroup.add(visor);

  group.add(cabinGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. TRUCK BODY / ENGINE AREA
  // ═══════════════════════════════════════════════════════════════════════════
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'truckBody';

  // Engine hood
  const hoodGeo = new THREE.BoxGeometry(1.6, 0.5, 1.2);
  const hood = new THREE.Mesh(hoodGeo, bodyPaint);
  hood.position.set(0, 1.15, 2.2);
  bodyGroup.add(hood);

  // Engine grille
  const grilleGeo = new THREE.BoxGeometry(1.4, 0.35, 0.05);
  const grille = new THREE.Mesh(grilleGeo, darkSteel(THREE));
  grille.position.set(0, 1.05, 2.83);
  bodyGroup.add(grille);

  // Grille slats
  for (let i = 0; i < 6; i++) {
    const slatGeo = new THREE.BoxGeometry(1.3, 0.015, 0.04);
    const slat = new THREE.Mesh(slatGeo, chrome(THREE));
    slat.position.set(0, 0.92 + i * 0.055, 2.85);
    bodyGroup.add(slat);
  }

  // Rear truck body platform (where pump and boom mount)
  const platformGeo = new THREE.BoxGeometry(2.2, 0.2, 5.0);
  const platform = new THREE.Mesh(platformGeo, darkSteel(THREE));
  platform.position.set(0, 0.85, -0.8);
  bodyGroup.add(platform);

  // Side panels with diamond plate texture
  for (let s = -1; s <= 1; s += 2) {
    const panelGeo = new THREE.BoxGeometry(0.06, 0.7, 4.8);
    const panel = new THREE.Mesh(panelGeo, aluminum(THREE));
    panel.position.set(s * 1.1, 1.3, -0.8);
    bodyGroup.add(panel);

    // Rivets along panels
    for (let r = 0; r < 20; r++) {
      const rivetGeo = new THREE.SphereGeometry(0.015, 6, 6);
      const rivet = new THREE.Mesh(rivetGeo, chrome(THREE));
      rivet.position.set(s * 1.14, 1.1, -2.8 + r * 0.25);
      bodyGroup.add(rivet);
      const rivet2 = rivet.clone();
      rivet2.position.y = 1.5;
      bodyGroup.add(rivet2);
    }
  }

  // Fenders
  for (let s = -1; s <= 1; s += 2) {
    const fenderGeo = new THREE.BoxGeometry(0.1, 0.35, 1.0);
    const fender = new THREE.Mesh(fenderGeo, bodyPaint);
    fender.position.set(s * 1.05, 0.9, 2.2);
    bodyGroup.add(fender);
  }

  // Exhaust stacks
  for (let s = -1; s <= 1; s += 2) {
    const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.07, 1.8, 12);
    const exhaust = new THREE.Mesh(exhaustGeo, chrome(THREE));
    exhaust.position.set(s * 0.95, 1.9, 1.8);
    bodyGroup.add(exhaust);

    // Exhaust cap
    const capGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.08, 12);
    const cap = new THREE.Mesh(capGeo, darkSteel(THREE));
    cap.position.set(s * 0.95, 2.82, 1.8);
    bodyGroup.add(cap);
  }

  // Fuel tank
  const fuelGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16);
  const fuel = new THREE.Mesh(fuelGeo, aluminum(THREE));
  fuel.rotation.z = Math.PI / 2;
  fuel.position.set(-0.85, 0.55, 1.5);
  bodyGroup.add(fuel);

  // Rear lights
  for (let s = -1; s <= 1; s += 2) {
    const tailGeo = new THREE.BoxGeometry(0.15, 0.15, 0.04);
    const tail = new THREE.Mesh(tailGeo, _glow(THREE, 0xff0000, 2.0));
    tail.position.set(s * 0.95, 1.15, -3.32);
    bodyGroup.add(tail);
  }

  // Mud flaps
  for (let s = -1; s <= 1; s += 2) {
    const flapGeo = new THREE.BoxGeometry(0.5, 0.3, 0.02);
    const flap = new THREE.Mesh(flapGeo, rubber(THREE));
    flap.position.set(s * 0.7, 0.3, -3.1);
    bodyGroup.add(flap);
  }

  group.add(bodyGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. TIRES & AXLES
  // ═══════════════════════════════════════════════════════════════════════════
  const tiresGroup = new THREE.Group();
  tiresGroup.name = 'tires';

  const tirePositions = [
    // Front axle (single tires)
    { x: -1.0, y: 0.35, z: 2.5, dual: false },
    { x: 1.0, y: 0.35, z: 2.5, dual: false },
    // Rear axle 1 (dual tires)
    { x: -1.0, y: 0.35, z: -1.5, dual: true },
    { x: 1.0, y: 0.35, z: -1.5, dual: true },
    // Rear axle 2 (dual tires)
    { x: -1.0, y: 0.35, z: -2.5, dual: true },
    { x: 1.0, y: 0.35, z: -2.5, dual: true },
  ];

  tirePositions.forEach((tp, idx) => {
    const tire1 = createRealisticTire(THREE, 0.3, 0.12, 0.22);
    tire1.position.set(tp.x, tp.y, tp.z);
    tiresGroup.add(tire1);
    meshes['tire_' + idx] = tire1;

    if (tp.dual) {
      const tire2 = createRealisticTire(THREE, 0.3, 0.12, 0.22);
      const offset = tp.x > 0 ? 0.28 : -0.28;
      tire2.position.set(tp.x + offset, tp.y, tp.z);
      tiresGroup.add(tire2);
    }
  });

  // Axle shafts
  [2.5, -1.5, -2.5].forEach(z => {
    const axleGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 12);
    const axle = new THREE.Mesh(axleGeo, darkSteel(THREE));
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, 0.35, z);
    tiresGroup.add(axle);
  });

  // Leaf springs
  [-1.5, -2.5].forEach(z => {
    for (let s = -1; s <= 1; s += 2) {
      const springGeo = new THREE.BoxGeometry(0.08, 0.04, 0.9);
      const spring = new THREE.Mesh(springGeo, darkSteel(THREE));
      spring.position.set(s * 0.5, 0.48, z);
      tiresGroup.add(spring);
    }
  });

  group.add(tiresGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. OUTRIGGER STABILIZERS
  // ═══════════════════════════════════════════════════════════════════════════
  const outriggerGroup = new THREE.Group();
  outriggerGroup.name = 'outriggers';

  const outriggerPositions = [
    { x: -1.3, z: 0.8 },
    { x: 1.3, z: 0.8 },
    { x: -1.3, z: -2.0 },
    { x: 1.3, z: -2.0 },
  ];

  outriggerPositions.forEach((op, idx) => {
    const legGroup = new THREE.Group();

    // Horizontal extension arm
    const armDir = op.x > 0 ? 1 : -1;
    const armGeo = new THREE.BoxGeometry(1.2, 0.1, 0.12);
    const arm = new THREE.Mesh(armGeo, steel(THREE));
    arm.position.set(armDir * 0.6, 0.75, 0);
    legGroup.add(arm);

    // Vertical hydraulic leg
    const legCyl = createHydraulicCylinder(THREE, 0.8, 0.06);
    legCyl.position.set(armDir * 1.15, 0.35, 0);
    legCyl.name = 'outriggerLeg_' + idx;
    meshes['outriggerLeg_' + idx] = legCyl;
    legGroup.add(legCyl);

    // Ground pad (foot)
    const padGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.05, 12);
    const pad = new THREE.Mesh(padGeo, darkSteel(THREE));
    pad.position.set(armDir * 1.15, -0.08, 0);
    legGroup.add(pad);

    // Warning stripes on outrigger
    const stripeGeo = new THREE.BoxGeometry(0.3, 0.04, 0.13);
    const stripe = new THREE.Mesh(stripeGeo, warningMat);
    stripe.position.set(armDir * 0.9, 0.82, 0);
    legGroup.add(stripe);

    legGroup.position.set(op.x, 0, op.z);
    outriggerGroup.add(legGroup);
  });

  group.add(outriggerGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CONCRETE HOPPER
  // ═══════════════════════════════════════════════════════════════════════════
  const hopperGroup = new THREE.Group();
  hopperGroup.name = 'hopper';

  // Hopper shell (trapezoidal funnel using LatheGeometry)
  const hopperProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.2, 0),
    new THREE.Vector2(0.22, 0.05),
    new THREE.Vector2(0.55, 0.7),
    new THREE.Vector2(0.6, 0.75),
    new THREE.Vector2(0.6, 0.85),
    new THREE.Vector2(0.55, 0.85),
    new THREE.Vector2(0.5, 0.75),
    new THREE.Vector2(0.18, 0.08),
    new THREE.Vector2(0.16, 0.03),
    new THREE.Vector2(0, 0.03),
  ];
  const hopperGeo = new THREE.LatheGeometry(hopperProfile, 8);
  const hopperMesh = new THREE.Mesh(hopperGeo, steel(THREE));
  hopperMesh.position.set(0, 0.95, -2.8);
  hopperGroup.add(hopperMesh);

  // Hopper grate (safety grill on top)
  for (let i = -3; i <= 3; i++) {
    const grateBarGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.1, 6);
    const grateBar = new THREE.Mesh(grateBarGeo, darkSteel(THREE));
    grateBar.rotation.z = Math.PI / 2;
    grateBar.position.set(0, 1.82, -2.8 + i * 0.08);
    hopperGroup.add(grateBar);
  }
  for (let i = -3; i <= 3; i++) {
    const grateBarGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6);
    const grateBar = new THREE.Mesh(grateBarGeo, darkSteel(THREE));
    grateBar.rotation.x = Math.PI / 2;
    grateBar.position.set(i * 0.08, 1.82, -2.8);
    hopperGroup.add(grateBar);
  }

  // Concrete in hopper (simulated)
  const concreteGeo = new THREE.CylinderGeometry(0.45, 0.15, 0.5, 8);
  const concreteFill = new THREE.Mesh(concreteGeo, concreteMat);
  concreteFill.position.set(0, 1.45, -2.8);
  meshes.concreteFill = concreteFill;
  hopperGroup.add(concreteFill);

  group.add(hopperGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. PUMP UNIT / S-VALVE / HYDRAULIC POWER PACK
  // ═══════════════════════════════════════════════════════════════════════════
  const pumpGroup = new THREE.Group();
  pumpGroup.name = 'pumpUnit';

  // Pump housing
  const pumpHousingGeo = new THREE.BoxGeometry(1.0, 0.7, 1.2);
  const pumpHousing = new THREE.Mesh(pumpHousingGeo, bodyPaint);
  pumpHousing.position.set(0, 1.3, -1.8);
  pumpGroup.add(pumpHousing);

  // S-Valve (the concrete switching valve)
  const sValveGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16);
  const sValve = new THREE.Mesh(sValveGeo, chrome(THREE));
  sValve.rotation.x = Math.PI / 2;
  sValve.position.set(0, 1.0, -2.1);
  meshes.sValve = sValve;
  pumpGroup.add(sValve);

  // Pump cylinders (twin)
  for (let s = -1; s <= 1; s += 2) {
    const pumpCylGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.9, 16);
    const pumpCyl = new THREE.Mesh(pumpCylGeo, steel(THREE));
    pumpCyl.rotation.x = Math.PI / 2;
    pumpCyl.position.set(s * 0.3, 1.3, -2.2);
    pumpGroup.add(pumpCyl);

    // Piston inside
    const pistonGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 12);
    const piston = new THREE.Mesh(pistonGeo, chrome(THREE));
    piston.rotation.x = Math.PI / 2;
    piston.position.set(s * 0.3, 1.3, -1.95);
    piston.name = 'pumpPiston_' + (s > 0 ? 'R' : 'L');
    meshes['pumpPiston_' + (s > 0 ? 'R' : 'L')] = piston;
    pumpGroup.add(piston);
  }

  // Hydraulic power pack
  const hppGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
  const hpp = new THREE.Mesh(hppGeo, accentPaint);
  hpp.position.set(0, 1.25, -1.1);
  pumpGroup.add(hpp);

  // Oil cooler / radiator
  const coolerGeo = new THREE.BoxGeometry(0.6, 0.4, 0.08);
  const cooler = new THREE.Mesh(coolerGeo, aluminum(THREE));
  cooler.position.set(0, 1.75, -1.1);
  pumpGroup.add(cooler);

  // Cooler fan
  const fanGeo = new THREE.CircleGeometry(0.15, 6);
  const fan = new THREE.Mesh(fanGeo, darkSteel(THREE));
  fan.position.set(0, 1.75, -1.05);
  meshes.coolerFan = fan;
  pumpGroup.add(fan);

  // Hydraulic hoses to pump
  const hose1 = createHydraulicLine(THREE, [
    new THREE.Vector3(-0.4, 1.6, -1.1),
    new THREE.Vector3(-0.5, 1.8, -1.5),
    new THREE.Vector3(-0.35, 1.5, -1.8),
  ], 0.025);
  pumpGroup.add(hose1);

  const hose2 = createHydraulicLine(THREE, [
    new THREE.Vector3(0.4, 1.6, -1.1),
    new THREE.Vector3(0.5, 1.8, -1.5),
    new THREE.Vector3(0.35, 1.5, -1.8),
  ], 0.025);
  pumpGroup.add(hose2);

  // Water tank (for pipe cleaning)
  const waterTankGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.7, 12);
  const waterTank = new THREE.Mesh(waterTankGeo, plastic(THREE));
  waterTank.position.set(0.85, 1.35, -1.5);
  pumpGroup.add(waterTank);

  group.add(pumpGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. TURNTABLE / SLEWING RING (boom base)
  // ═══════════════════════════════════════════════════════════════════════════
  const turntableGroup = new THREE.Group();
  turntableGroup.name = 'turntable';

  const turntableBaseGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.2, 32);
  const turntableBase = new THREE.Mesh(turntableBaseGeo, darkSteel(THREE));
  turntableBase.position.set(0, 1.05, -0.2);
  turntableGroup.add(turntableBase);

  // Slewing ring teeth
  const teethCount = 48;
  for (let i = 0; i < teethCount; i++) {
    const a = (i / teethCount) * Math.PI * 2;
    const toothGeo = new THREE.BoxGeometry(0.04, 0.06, 0.04);
    const tooth = new THREE.Mesh(toothGeo, darkSteel(THREE));
    tooth.position.set(
      Math.cos(a) * 0.58, 1.05, Math.sin(a) * 0.58 - 0.2
    );
    tooth.rotation.y = a;
    turntableGroup.add(tooth);
  }

  // Upper turntable plate
  const upperPlateGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32);
  const upperPlate = new THREE.Mesh(upperPlateGeo, bodyPaint);
  upperPlate.position.set(0, 1.2, -0.2);
  meshes.turntablePlate = upperPlate;
  turntableGroup.add(upperPlate);

  // Slewing motor housing
  const slewMotorGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 12);
  const slewMotor = new THREE.Mesh(slewMotorGeo, accentPaint);
  slewMotor.position.set(0.45, 1.2, -0.2);
  turntableGroup.add(slewMotor);

  group.add(turntableGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. ARTICULATED PLACING BOOM (4-Section Z-Fold)
  // ═══════════════════════════════════════════════════════════════════════════
  const boomGroup = new THREE.Group();
  boomGroup.name = 'boom';
  boomGroup.position.set(0, 1.3, -0.2);

  // Boom section specs [length, width, height, color offset]
  const boomSpecs = [
    { len: 3.2, w: 0.22, h: 0.3 },  // Section 1 (closest to base)
    { len: 2.8, w: 0.18, h: 0.25 },  // Section 2
    { len: 2.4, w: 0.15, h: 0.2 },   // Section 3
    { len: 2.0, w: 0.12, h: 0.16 },  // Section 4 (tip)
  ];

  // Store boom section groups for animation
  const boomSections = [];
  let parentGroup = boomGroup;
  let currentAngle = -0.3; // Initial fold angles
  const foldAngles = [-0.3, 0.6, -0.5, 0.3];

  boomSpecs.forEach((spec, idx) => {
    const sectionGroup = new THREE.Group();
    sectionGroup.name = 'boomSection_' + idx;

    // Main boom arm
    const armGeo = new THREE.BoxGeometry(spec.w, spec.h, spec.len);
    const arm = new THREE.Mesh(armGeo, bodyPaint);
    arm.position.set(0, 0, -spec.len / 2);
    sectionGroup.add(arm);

    // Concrete pipe running along the boom
    const pipePoints = [
      new THREE.Vector3(0, spec.h * 0.65, 0.1),
      new THREE.Vector3(0, spec.h * 0.65, -spec.len + 0.1),
    ];
    const pipe = createPipeSection(THREE, pipePoints, 0.05, steel(THREE));
    sectionGroup.add(pipe);

    // Pipe clamps
    for (let c = 0; c < 3; c++) {
      const clampGeo = new THREE.TorusGeometry(0.06, 0.012, 8, 12, Math.PI);
      const clamp = new THREE.Mesh(clampGeo, darkSteel(THREE));
      clamp.position.set(0, spec.h * 0.65, -0.5 - c * (spec.len / 3.5));
      clamp.rotation.y = Math.PI / 2;
      sectionGroup.add(clamp);
    }

    // Side reinforcement plates (truss-like)
    for (let s = -1; s <= 1; s += 2) {
      for (let t = 0; t < 4; t++) {
        const trussGeo = new THREE.BoxGeometry(0.015, spec.h * 0.8, 0.06);
        const truss = new THREE.Mesh(trussGeo, darkSteel(THREE));
        const zPos = -0.3 - t * (spec.len / 5);
        truss.position.set(s * spec.w * 0.5, 0, zPos);
        truss.rotation.z = (t % 2 === 0 ? 1 : -1) * 0.3;
        sectionGroup.add(truss);
      }
    }

    // Joint pivot (hinge pin)
    const pivotGeo = new THREE.CylinderGeometry(0.04, 0.04, spec.w + 0.1, 12);
    const pivot = new THREE.Mesh(pivotGeo, chrome(THREE));
    pivot.rotation.z = Math.PI / 2;
    pivot.position.set(0, 0, 0);
    sectionGroup.add(pivot);

    // Hydraulic cylinder at joint
    const hcLen = spec.len * 0.45;
    const hc = createHydraulicCylinder(THREE, hcLen, 0.04);
    hc.position.set(spec.w * 0.7, 0, -hcLen * 0.4);
    hc.rotation.z = -0.1;
    hc.name = 'boomHydraulic_' + idx;
    meshes['boomHydraulic_' + idx] = hc;
    sectionGroup.add(hc);

    // Hydraulic feed lines to cylinder
    const feedLine = createHydraulicLine(THREE, [
      new THREE.Vector3(spec.w * 0.7, hcLen * 0.3, -hcLen * 0.4),
      new THREE.Vector3(spec.w * 0.9, hcLen * 0.1, -hcLen * 0.2),
      new THREE.Vector3(spec.w * 0.4, -0.05, 0),
    ], 0.015);
    sectionGroup.add(feedLine);

    // Joint lubrication fitting
    const lubGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const lub = new THREE.Mesh(lubGeo, _glow(THREE, 0xffdd00, 0.8));
    lub.position.set(0, 0.06, 0);
    sectionGroup.add(lub);

    // Position this section at end of parent
    if (idx > 0) {
      sectionGroup.position.set(0, 0, -boomSpecs[idx - 1].len);
    }
    sectionGroup.rotation.x = foldAngles[idx];

    parentGroup.add(sectionGroup);
    parentGroup = sectionGroup;
    boomSections.push(sectionGroup);
    meshes['boomSection_' + idx] = sectionGroup;
  });

  // End hose (flexible rubber hose at boom tip)
  const endHosePoints = [
    new THREE.Vector3(0, 0, -boomSpecs[3].len),
    new THREE.Vector3(0, -0.3, -boomSpecs[3].len - 0.3),
    new THREE.Vector3(0, -0.8, -boomSpecs[3].len - 0.2),
    new THREE.Vector3(0, -1.4, -boomSpecs[3].len - 0.4),
  ];
  const endHose = createPipeSection(THREE, endHosePoints, 0.045, rubber(THREE));
  endHose.name = 'endHose';
  meshes.endHose = endHose;
  boomSections[3].add(endHose);

  // End hose nozzle
  const nozzleGeo = new THREE.CylinderGeometry(0.04, 0.055, 0.12, 10);
  const nozzle = new THREE.Mesh(nozzleGeo, chrome(THREE));
  nozzle.position.set(0, -1.45, -boomSpecs[3].len - 0.4);
  boomSections[3].add(nozzle);

  group.add(boomGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. CONTROL PANEL / REMOTE CONTROL STATION
  // ═══════════════════════════════════════════════════════════════════════════
  const controlGroup = new THREE.Group();
  controlGroup.name = 'controlPanel';

  // Control box on truck body
  const controlBoxGeo = new THREE.BoxGeometry(0.4, 0.5, 0.15);
  const controlBox = new THREE.Mesh(controlBoxGeo, accentPaint);
  controlBox.position.set(-1.15, 1.55, -0.5);
  controlGroup.add(controlBox);

  // Buttons/indicators
  const buttonColors = [0x00ff00, 0xff0000, 0xffaa00, 0x0088ff];
  buttonColors.forEach((col, i) => {
    const btnGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8);
    const btn = new THREE.Mesh(btnGeo, _glow(THREE, col, 2.5));
    btn.rotation.z = Math.PI / 2;
    btn.position.set(-1.22, 1.45 + i * 0.1, -0.5);
    controlGroup.add(btn);
  });

  // Display screen
  const screenGeo = new THREE.PlaneGeometry(0.2, 0.12);
  const screen = new THREE.Mesh(screenGeo, neonBlue);
  screen.position.set(-1.22, 1.7, -0.5);
  screen.rotation.y = Math.PI / 2;
  meshes.screen = screen;
  controlGroup.add(screen);

  // Remote control antenna
  const antennaGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.3, 6);
  const antenna = new THREE.Mesh(antennaGeo, darkSteel(THREE));
  antenna.position.set(-1.15, 2.0, -0.5);
  controlGroup.add(antenna);

  group.add(controlGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. NEON / SAFETY MARKERS & DETAIL ELEMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  // Safety stripes on boom base
  const warningBarGeo = new THREE.BoxGeometry(0.6, 0.06, 0.06);
  for (let i = 0; i < 3; i++) {
    const bar = new THREE.Mesh(warningBarGeo, warningMat);
    bar.position.set(0, 1.0, -0.2 + i * 0.15);
    group.add(bar);
  }

  // Neon status lights along chassis
  for (let i = 0; i < 8; i++) {
    const nLightGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const nLight = new THREE.Mesh(nLightGeo, glowGreen);
    nLight.position.set(-1.12, 0.9, -2.5 + i * 0.5);
    nLight.name = 'statusLight_' + i;
    meshes['statusLight_' + i] = nLight;
    group.add(nLight);

    const nLight2 = nLight.clone();
    nLight2.position.x = 1.12;
    group.add(nLight2);
  }

  // Lifting hooks / tie-down rings
  for (let s = -1; s <= 1; s += 2) {
    const ringGeo = new THREE.TorusGeometry(0.04, 0.008, 8, 12);
    const ring = new THREE.Mesh(ringGeo, chrome(THREE));
    ring.position.set(s * 1.0, 1.0, 1.0);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  // Company branding plate on boom base
  const brandGeo = new THREE.BoxGeometry(0.5, 0.15, 0.01);
  const brand = new THREE.Mesh(brandGeo, chrome(THREE));
  brand.position.set(0, 1.45, 0.05);
  group.add(brand);

  // ═══════════════════════════════════════════════════════════════════════════
  // PARTS DEFINITION
  // ═══════════════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Operator Cabin',
      description: 'Modern enclosed cabin with tinted glass, HVAC, and ergonomic controls for safe truck operation during road travel.',
      material: 'Steel body with tinted safety glass, rubber seals',
      function: 'Houses the driver during road transport. Contains steering, braking, and engine controls. NOT used for boom operation.',
      assemblyOrder: 1,
      connections: ['Truck Chassis', 'Engine'],
      failureEffect: 'Driver cannot safely operate the truck on public roads.',
      cascadeFailures: ['Engine', 'Truck Chassis'],
      originalPosition: { x: 0, y: 0.75, z: 3.0 },
      explodedPosition: { x: 0, y: 3.5, z: 5.5 }
    },
    {
      name: 'Truck Chassis & Frame',
      description: 'Heavy-duty I-beam steel chassis rated for 40+ tons GVW with reinforced cross members and armor plating.',
      material: 'High-strength low-alloy steel (HSLA), hot-rolled I-beams',
      function: 'Provides the structural backbone carrying the cabin, pump unit, boom assembly, and concrete hopper. Distributes load to axles.',
      assemblyOrder: 0,
      connections: ['Operator Cabin', 'Axles & Tires', 'Outrigger Stabilizers', 'Turntable', 'Pump Unit'],
      failureEffect: 'Catastrophic structural failure; entire machine inoperable.',
      cascadeFailures: ['All subsystems'],
      originalPosition: { x: 0, y: 0.6, z: 0 },
      explodedPosition: { x: 0, y: -1.5, z: 0 }
    },
    {
      name: 'Axles & Tires',
      description: 'Three-axle configuration with front steer axle and tandem rear drive axles. Dual rear tires with aggressive tread pattern for heavy load distribution.',
      material: 'Forged steel axles, rubber tires with steel belts, aluminum rims',
      function: 'Supports entire vehicle weight (up to 50 tons loaded) and enables road travel. Tandem rear axles share load. Tread pattern provides grip on construction sites.',
      assemblyOrder: 2,
      connections: ['Truck Chassis'],
      failureEffect: 'Vehicle immobilized; tire blowout can cause instability when loaded.',
      cascadeFailures: ['Truck Chassis'],
      originalPosition: { x: 0, y: 0.35, z: 0 },
      explodedPosition: { x: 0, y: -3.0, z: 0 }
    },
    {
      name: 'Outrigger Stabilizers',
      description: 'Four hydraulically-deployed stabilizer legs with ground pads that extend outward and downward to prevent tipping during boom operation.',
      material: 'High-strength steel arms, chrome hydraulic cylinders, cast iron ground pads',
      function: 'Provides a stable support base wider than the truck wheelbase. Must be deployed before boom operation. Prevents tipping under asymmetric boom loads.',
      assemblyOrder: 3,
      connections: ['Truck Chassis', 'Hydraulic Power Pack'],
      failureEffect: 'Boom operation prohibited; risk of truck tipping over during concrete placement.',
      cascadeFailures: ['Articulated Placing Boom'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 4.0, y: -1.0, z: 0 }
    },
    {
      name: 'Concrete Hopper',
      description: 'Funnel-shaped steel receiving hopper with safety grate. Receives concrete from mixer trucks and feeds it into the pump cylinders.',
      material: 'Hardened wear-resistant steel (AR400), safety grate with rebar mesh',
      function: 'Collects fresh concrete from transit mixers. The funnel shape directs concrete into the S-valve and pump cylinders. Safety grate prevents debris and accidental falls.',
      assemblyOrder: 5,
      connections: ['Pump Unit', 'S-Valve'],
      failureEffect: 'Cannot receive concrete; pump starves and runs dry causing premature wear.',
      cascadeFailures: ['Pump Unit', 'S-Valve'],
      originalPosition: { x: 0, y: 0.95, z: -2.8 },
      explodedPosition: { x: 0, y: 0.95, z: -6.0 }
    },
    {
      name: 'Pump Unit & S-Valve',
      description: 'Twin hydraulic pump cylinders with an S-tube switching valve (rock valve) that alternately draws and pushes concrete in a continuous flow.',
      material: 'Hardened chrome-lined cylinders, chrome-plated pistons, manganese steel S-valve',
      function: 'The twin-cylinder design ensures near-continuous concrete flow. While one cylinder pushes, the other draws. The S-valve swings between cylinders to maintain flow direction.',
      assemblyOrder: 6,
      connections: ['Concrete Hopper', 'Hydraulic Power Pack', 'Turntable'],
      failureEffect: 'No concrete pumping capability. Concrete in pipeline may harden and block the system.',
      cascadeFailures: ['Concrete Hopper', 'Articulated Placing Boom'],
      originalPosition: { x: 0, y: 1.3, z: -1.8 },
      explodedPosition: { x: -3.5, y: 1.3, z: -1.8 }
    },
    {
      name: 'Turntable & Slewing Ring',
      description: '360° slewing ring with gear-driven rotation allowing the boom to swing in any direction from a fixed truck position.',
      material: 'Ball-bearing slewing ring with hardened gear teeth, hydraulic slew motor',
      function: 'Enables full 360° rotation of the entire boom assembly relative to the truck chassis, maximizing placement reach without repositioning the truck.',
      assemblyOrder: 4,
      connections: ['Truck Chassis', 'Articulated Placing Boom', 'Hydraulic Power Pack'],
      failureEffect: 'Boom locked in one direction; severely limited placement area.',
      cascadeFailures: ['Articulated Placing Boom'],
      originalPosition: { x: 0, y: 1.05, z: -0.2 },
      explodedPosition: { x: 0, y: 4.0, z: -0.2 }
    },
    {
      name: 'Articulated Placing Boom',
      description: 'Four-section Z-fold articulated boom with hydraulic cylinders at each joint, concrete delivery pipe along entire length, and flexible end hose.',
      material: 'High-tensile steel box sections, chrome hydraulic cylinders, hardened steel delivery pipe, rubber end hose',
      function: 'Extends and articulates to deliver concrete precisely to the pour location. The Z-fold design allows reach of 30+ meters vertically and horizontally. Each joint is independently controlled for precise 3D positioning.',
      assemblyOrder: 7,
      connections: ['Turntable', 'Pump Unit', 'Hydraulic Power Pack'],
      failureEffect: 'Cannot place concrete at height or distance. Must resort to manual placement with ground lines.',
      cascadeFailures: ['Turntable'],
      originalPosition: { x: 0, y: 1.3, z: -0.2 },
      explodedPosition: { x: 0, y: 6.0, z: -0.2 }
    },
    {
      name: 'Hydraulic Power Pack',
      description: 'Engine-driven hydraulic system with variable displacement pumps, oil reservoir, cooler, and filtration providing up to 350 bar pressure.',
      material: 'Cast iron pump housings, steel reservoir, aluminum oil cooler, copper hydraulic lines',
      function: 'Generates hydraulic power for ALL machine functions: boom articulation, turntable rotation, outrigger deployment, pump cylinder actuation, and S-valve switching.',
      assemblyOrder: 8,
      connections: ['Engine', 'Outrigger Stabilizers', 'Pump Unit', 'Turntable', 'Articulated Placing Boom'],
      failureEffect: 'Total loss of hydraulic function; all operations cease. Boom cannot fold and becomes a tipping hazard.',
      cascadeFailures: ['Outrigger Stabilizers', 'Pump Unit', 'Turntable', 'Articulated Placing Boom'],
      originalPosition: { x: 0, y: 1.25, z: -1.1 },
      explodedPosition: { x: 3.5, y: 2.5, z: -1.1 }
    },
    {
      name: 'Control Panel & Remote',
      description: 'Dual control stations: truck-mounted panel and wireless radio remote control with proportional joysticks and safety interlocks.',
      material: 'IP65-rated enclosure, LCD display, proportional hydraulic joysticks',
      function: 'Enables the operator to control all boom movements, pump speed, and emergency stop from a safe distance at the pour location via wireless remote.',
      assemblyOrder: 9,
      connections: ['Hydraulic Power Pack', 'Articulated Placing Boom', 'Pump Unit'],
      failureEffect: 'Loss of remote control; must operate from less safe truck-mounted panel only.',
      cascadeFailures: ['Articulated Placing Boom', 'Pump Unit'],
      originalPosition: { x: -1.15, y: 1.55, z: -0.5 },
      explodedPosition: { x: -4.5, y: 3.0, z: -0.5 }
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'Why must the outrigger stabilizers be fully deployed BEFORE operating the placing boom?',
      options: [
        'To level the truck on sloped terrain',
        'To widen the support base and prevent the truck from tipping under boom loads',
        'To reduce tire wear during stationary pumping',
        'To connect the hydraulic system to the boom'
      ],
      correct: 1,
      explanation: 'The placing boom can exert enormous overturning moments on the truck, especially when extended horizontally with concrete flowing. The outriggers widen the support polygon far beyond the wheelbase, distributing the forces and preventing catastrophic tipping.',
      difficulty: 'easy'
    },
    {
      question: 'How does the S-valve (rock valve) enable near-continuous concrete flow using only two pump cylinders?',
      options: [
        'It mixes concrete from both cylinders together before sending it to the boom',
        'It spins rapidly to accelerate the concrete',
        'It alternately connects each cylinder to the delivery pipe — one pushes while the other draws, then switches',
        'It uses compressed air to boost concrete pressure between strokes'
      ],
      correct: 2,
      explanation: 'The S-valve swings back and forth between the two cylinders. When Cylinder A pushes concrete into the delivery pipe, Cylinder B simultaneously draws fresh concrete from the hopper. At the end of the stroke, the S-valve switches direction. This alternating action creates a near-continuous flow with only brief interruptions during the valve changeover.',
      difficulty: 'medium'
    },
    {
      question: 'What is the primary purpose of the flexible rubber end hose at the tip of the placing boom?',
      options: [
        'It reduces the cost of the boom by replacing a steel pipe section',
        'It acts as a pressure relief valve for excessive concrete pressure',
        'It allows fine-positioning of the concrete pour point and absorbs boom vibrations',
        'It filters debris from the concrete before pouring'
      ],
      correct: 2,
      explanation: 'The rigid steel delivery pipe cannot be positioned with centimeter precision. The flexible end hose (typically 3-4 meters) allows workers on the deck to manually guide the pour point exactly where needed. It also absorbs pulsations and vibrations from the pump and boom movements, preventing pipe fatigue.',
      difficulty: 'medium'
    },
    {
      question: 'What catastrophic failure mode occurs if the hydraulic power pack loses pressure while the boom is fully extended?',
      options: [
        'The boom retracts automatically to its transport position',
        'The concrete in the pipe solidifies instantly',
        'The boom sections can drop uncontrollably under gravity since hydraulic cylinders lose holding force',
        'The truck engine automatically shuts down for safety'
      ],
      correct: 2,
      explanation: 'Hydraulic cylinders rely on trapped oil pressure to hold the boom in position against gravity. If the power pack fails and pressure is lost, the check valves and counterbalance valves are the last line of defense. If those also fail, the heavy boom sections can drop suddenly and catastrophically. This is why redundant safety valves and overload warnings are critical in the hydraulic circuit.',
      difficulty: 'hard'
    },
    {
      question: 'In a 4-section Z-fold boom, why are sections folded in alternating directions rather than all folding the same way?',
      options: [
        'Alternating folds keep the boom center of gravity closer to the truck, improving stability during transport and deployment',
        'It is purely aesthetic — all sections could fold the same way',
        'Alternating folds reduce the hydraulic pressure needed',
        'It prevents the concrete pipe from kinking'
      ],
      correct: 0,
      explanation: 'The Z-fold (zigzag) pattern folds the boom into a compact bundle that keeps its center of gravity low and close to the turntable. If all sections folded the same way (like an accordion), the folded boom would be very tall or extend far forward, creating a tipping hazard during transport. The Z-fold also allows longer reach within the folding envelope.',
      difficulty: 'hard'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION
  // ═══════════════════════════════════════════════════════════════════════════
  function animate(time, speed, _meshes) {
    const t = time * speed;
    const m = _meshes || meshes;

    // 1. Boom sections gentle sway (wind/load simulation)
    for (let i = 0; i < 4; i++) {
      const section = m['boomSection_' + i];
      if (section) {
        const baseAngle = foldAngles[i];
        section.rotation.x = baseAngle + Math.sin(t * 0.3 + i * 1.2) * 0.02;
      }
    }

    // 2. Turntable slow rotation
    if (m.turntablePlate) {
      m.turntablePlate.rotation.y = Math.sin(t * 0.1) * 0.3;
    }

    // 3. Pump pistons alternating (reciprocating motion)
    if (m.pumpPiston_L) {
      m.pumpPiston_L.position.z = -1.95 + Math.sin(t * 2.5) * 0.15;
    }
    if (m.pumpPiston_R) {
      m.pumpPiston_R.position.z = -1.95 + Math.sin(t * 2.5 + Math.PI) * 0.15;
    }

    // 4. S-Valve rocking motion
    if (m.sValve) {
      m.sValve.rotation.y = Math.sin(t * 2.5) * 0.25;
    }

    // 5. Cooler fan spinning
    if (m.coolerFan) {
      m.coolerFan.rotation.z = t * 8;
    }

    // 6. Beacon light pulsing
    if (m.beacon && m.beacon.material) {
      m.beacon.material.emissiveIntensity = 1.0 + Math.sin(t * 6) * 1.5;
    }

    // 7. Status lights chasing pattern
    for (let i = 0; i < 8; i++) {
      const light = m['statusLight_' + i];
      if (light && light.material) {
        const phase = (t * 2 + i * 0.4) % (Math.PI * 2);
        light.material.emissiveIntensity = 1.0 + Math.sin(phase) * 1.8;
        light.scale.setScalar(0.8 + Math.sin(phase) * 0.3);
      }
    }

    // 8. Screen flicker
    if (m.screen && m.screen.material) {
      m.screen.material.emissiveIntensity = 2.5 + Math.sin(t * 12) * 0.5;
    }

    // 9. Outrigger legs subtle hydraulic pulse
    for (let i = 0; i < 4; i++) {
      const leg = m['outriggerLeg_' + i];
      if (leg) {
        leg.position.y = 0.35 + Math.sin(t * 0.5 + i) * 0.005;
      }
    }

    // 10. Concrete fill level pulsing (simulating fresh concrete being received)
    if (m.concreteFill) {
      m.concreteFill.scale.y = 0.85 + Math.sin(t * 1.5) * 0.15;
    }

    // 11. Hydraulic cylinders on boom: piston rod extension synced with boom angles
    for (let i = 0; i < 4; i++) {
      const hc = m['boomHydraulic_' + i];
      if (hc) {
        const rod = hc.getObjectByName('pistonRod');
        if (rod) {
          rod.position.y = -0.15 + Math.sin(t * 0.3 + i * 1.2) * 0.03;
        }
      }
    }

    // 12. Tire rotation (as if truck just arrived)
    for (let i = 0; i < 6; i++) {
      const tire = m['tire_' + i];
      if (tire) {
        // Gentle spinning of the tire group around Z axis
        tire.children.forEach(child => {
          if (child.geometry && child.geometry.type === 'TorusGeometry') {
            child.rotation.z = t * 0.1;
          }
        });
      }
    }
  }

  const description = `A modern Putzmeister-style Concrete Pump Truck featuring a multi-axle heavy-duty chassis, four hydraulically-deployed outrigger stabilizers, a twin-cylinder concrete pump with S-valve switching, and a 4-section Z-fold articulated placing boom capable of reaching 30+ meters. The boom carries a steel concrete delivery pipe with flexible end hose for precision placement. All functions are powered by an engine-driven hydraulic power pack and controlled via a wireless radio remote control. The machine integrates hundreds of safety interlocks to prevent tipping, over-pressure, and uncontrolled boom movement.`;

  return { group, parts, description, quizQuestions, animate };
}
