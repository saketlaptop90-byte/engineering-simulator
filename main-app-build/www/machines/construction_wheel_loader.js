import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

// ── Custom hi-tech materials ──────────────────────────────────────────
function _glow(THREE, color, intensity = 2.0) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: intensity,
    transparent: true, opacity: 0.92, metalness: 0.3, roughness: 0.25
  });
}
function _catYellow(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xF2C31A, metalness: 0.25, roughness: 0.55
  });
}
function _catYellowDark(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xD4A810, metalness: 0.30, roughness: 0.50
  });
}
function _hydraulicCyl(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0x8899AA, metalness: 0.85, roughness: 0.15
  });
}
function _hydraulicRod(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xDDEEFF, metalness: 0.95, roughness: 0.05
  });
}
function _exhaustMat(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0x222222, metalness: 0.7, roughness: 0.3
  });
}
function _panelLine(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0x111111, metalness: 0.4, roughness: 0.8
  });
}
function _headlightMat(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xFFFFDD, emissive: 0xFFFFAA, emissiveIntensity: 3.0,
    transparent: true, opacity: 0.95
  });
}
function _taillightMat(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xFF2200, emissive: 0xFF1100, emissiveIntensity: 2.5,
    transparent: true, opacity: 0.9
  });
}
function _warningLight(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xFF8800, emissive: 0xFF6600, emissiveIntensity: 3.0,
    transparent: true, opacity: 0.9
  });
}
function _bucketTeethMat(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0x889999, metalness: 0.9, roughness: 0.2
  });
}
function _counterweightMat(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0x333333, metalness: 0.6, roughness: 0.5
  });
}
function _grilleMat(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0x1A1A1A, metalness: 0.5, roughness: 0.6
  });
}

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  const yellow = _catYellow(THREE);
  const yellowDark = _catYellowDark(THREE);
  const hCyl = _hydraulicCyl(THREE);
  const hRod = _hydraulicRod(THREE);
  const headlight = _headlightMat(THREE);
  const taillight = _taillightMat(THREE);
  const warning = _warningLight(THREE);
  const bucketTeeth = _bucketTeethMat(THREE);
  const cwMat = _counterweightMat(THREE);
  const grille = _grilleMat(THREE);
  const exhaust = _exhaustMat(THREE);
  const panelL = _panelLine(THREE);
  const glowGreen = _glow(THREE, 0x00FF88, 1.2);
  const glowBlue = _glow(THREE, 0x4488FF, 1.5);
  const glowOrange = _glow(THREE, 0xFF8800, 2.0);

  // ═══════════════════════════════════════════════════════════════════
  // 1. REAR FRAME (engine compartment, counterweight, cab mounting)
  // ═══════════════════════════════════════════════════════════════════
  const rearFrame = new THREE.Group();
  group.add(rearFrame);
  meshes.rearFrame = rearFrame;

  // Main rear body - tapered shape using LatheGeometry approximation
  const rearBodyShape = new THREE.Shape();
  rearBodyShape.moveTo(-2.4, 0);
  rearBodyShape.lineTo(2.4, 0);
  rearBodyShape.lineTo(2.2, 2.2);
  rearBodyShape.lineTo(1.8, 3.0);
  rearBodyShape.lineTo(-1.8, 3.0);
  rearBodyShape.lineTo(-2.2, 2.2);
  rearBodyShape.closePath();
  const rearBodyExtrudeSettings = { depth: 4.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelSegments: 3 };
  const rearBodyGeo = new THREE.ExtrudeGeometry(rearBodyShape, rearBodyExtrudeSettings);
  const rearBodyMesh = new THREE.Mesh(rearBodyGeo, yellow);
  rearBodyMesh.position.set(0, 1.8, -1.0);
  rearFrame.add(rearBodyMesh);

  // Engine hood top panel
  const hoodGeo = new THREE.BoxGeometry(3.8, 0.12, 3.8);
  const hoodMesh = new THREE.Mesh(hoodGeo, yellowDark);
  hoodMesh.position.set(0, 4.85, 1.0);
  rearFrame.add(hoodMesh);

  // Hood side vents (grille slats)
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 8; i++) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.12, 0.35),
        grille
      );
      slat.position.set(side * 2.35, 3.6 + i * 0.18, 0.8);
      rearFrame.add(slat);
    }
    // Vent mesh backing
    const ventBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 1.6, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x080808, metalness: 0.4, roughness: 0.7 })
    );
    ventBacking.position.set(side * 2.38, 3.7, 0.8);
    rearFrame.add(ventBacking);
  }

  // ── Counterweight ──
  const cwShape = new THREE.Shape();
  cwShape.moveTo(-2.3, 0);
  cwShape.lineTo(2.3, 0);
  cwShape.lineTo(2.5, 0.8);
  cwShape.lineTo(2.3, 2.4);
  cwShape.lineTo(-2.3, 2.4);
  cwShape.lineTo(-2.5, 0.8);
  cwShape.closePath();
  const cwGeo = new THREE.ExtrudeGeometry(cwShape, { depth: 1.0, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 4 });
  const cwMesh = new THREE.Mesh(cwGeo, cwMat);
  cwMesh.position.set(0, 1.8, -1.2);
  cwMesh.rotation.x = -0.05;
  rearFrame.add(cwMesh);
  meshes.counterweight = cwMesh;

  // Counterweight "CAT" badge
  const badgeGeo = new THREE.BoxGeometry(1.0, 0.4, 0.06);
  const badgeMat = new THREE.MeshStandardMaterial({ color: 0xF2C31A, metalness: 0.8, roughness: 0.2 });
  const badge = new THREE.Mesh(badgeGeo, badgeMat);
  badge.position.set(0, 3.2, -1.25);
  rearFrame.add(badge);

  // ── Exhaust stack ──
  const exhaustPipeGeo = new THREE.CylinderGeometry(0.15, 0.18, 1.8, 16);
  const exhaustPipe = new THREE.Mesh(exhaustPipeGeo, exhaust);
  exhaustPipe.position.set(1.2, 5.5, 0.5);
  rearFrame.add(exhaustPipe);
  meshes.exhaustPipe = exhaustPipe;

  // Exhaust cap
  const exhaustCapGeo = new THREE.CylinderGeometry(0.22, 0.15, 0.15, 16);
  const exhaustCap = new THREE.Mesh(exhaustCapGeo, darkSteel(THREE));
  exhaustCap.position.set(1.2, 6.45, 0.5);
  rearFrame.add(exhaustCap);

  // Exhaust rain cap
  const rainCapGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.03, 16);
  const rainCap = new THREE.Mesh(rainCapGeo, darkSteel(THREE));
  rainCap.position.set(1.2, 6.65, 0.5);
  rearFrame.add(rainCap);

  // ── Engine internals (visible through grille) ──
  // Radiator fan
  const fanGroup = new THREE.Group();
  fanGroup.position.set(0, 3.5, 3.3);
  rearFrame.add(fanGroup);
  meshes.radiatorFan = fanGroup;
  const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16), chrome(THREE));
  fanHub.rotation.x = Math.PI / 2;
  fanGroup.add(fanHub);
  for (let i = 0; i < 6; i++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.55, 0.02),
      aluminum(THREE)
    );
    blade.position.set(0, 0.3, 0);
    blade.rotation.z = (i * Math.PI * 2) / 6;
    blade.position.x = Math.sin(blade.rotation.z) * 0.3;
    blade.position.y = Math.cos(blade.rotation.z) * 0.3;
    fanGroup.add(blade);
  }

  // ── Rear taillights ──
  for (let side = -1; side <= 1; side += 2) {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.08), taillight);
    tl.position.set(side * 2.0, 3.8, -1.3);
    rearFrame.add(tl);
    // Taillight housing
    const tlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.05), darkSteel(THREE));
    tlHousing.position.set(side * 2.0, 3.8, -1.33);
    rearFrame.add(tlHousing);
  }

  // ── Warning/beacon light on cab roof ──
  const beaconGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const beacon = new THREE.Mesh(beaconGeo, warning);
  beacon.position.set(0, 7.1, 1.2);
  rearFrame.add(beacon);
  meshes.beacon = beacon;

  // Beacon base
  const beaconBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.1, 12), darkSteel(THREE));
  beaconBase.position.set(0, 6.9, 1.2);
  rearFrame.add(beaconBase);

  // ═══════════════════════════════════════════════════════════════════
  // 2. OPERATOR CAB
  // ═══════════════════════════════════════════════════════════════════
  const cab = new THREE.Group();
  cab.position.set(0, 4.8, 1.8);
  rearFrame.add(cab);
  meshes.cab = cab;

  // Cab frame (ROPS/FOPS structure)
  const cabPillarGeo = new THREE.BoxGeometry(0.12, 2.0, 0.12);
  const cabPillarMat = darkSteel(THREE);
  const pillarPositions = [
    [-1.3, 0, -0.8], [1.3, 0, -0.8], [-1.3, 0, 0.8], [1.3, 0, 0.8]
  ];
  pillarPositions.forEach(pos => {
    const pillar = new THREE.Mesh(cabPillarGeo, cabPillarMat);
    pillar.position.set(...pos);
    cab.add(pillar);
  });

  // Cab roof
  const roofGeo = new THREE.BoxGeometry(2.8, 0.1, 1.8);
  const roof = new THREE.Mesh(roofGeo, yellow);
  roof.position.set(0, 1.05, 0);
  cab.add(roof);

  // Cab floor
  const floorGeo = new THREE.BoxGeometry(2.7, 0.08, 1.7);
  const cabFloor = new THREE.Mesh(floorGeo, darkSteel(THREE));
  cabFloor.position.set(0, -1.05, 0);
  cab.add(cabFloor);

  // Windshield (front glass - curved look)
  const windshieldGeo = new THREE.BoxGeometry(2.5, 1.6, 0.06);
  const windshield = new THREE.Mesh(windshieldGeo, tinted(THREE));
  windshield.position.set(0, 0, 0.88);
  windshield.rotation.x = 0.08;
  cab.add(windshield);
  meshes.windshield = windshield;

  // Rear window
  const rearWindowGeo = new THREE.BoxGeometry(2.3, 1.3, 0.05);
  const rearWindow = new THREE.Mesh(rearWindowGeo, tinted(THREE));
  rearWindow.position.set(0, 0.1, -0.85);
  cab.add(rearWindow);

  // Side windows
  for (let side = -1; side <= 1; side += 2) {
    const sideWin = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.4, 1.5),
      tinted(THREE)
    );
    sideWin.position.set(side * 1.35, 0, 0);
    cab.add(sideWin);
  }

  // Door (right side)
  const doorGeo = new THREE.BoxGeometry(0.06, 1.7, 1.2);
  const door = new THREE.Mesh(doorGeo, yellow);
  door.position.set(1.38, -0.15, 0.1);
  cab.add(door);
  // Door handle
  const handleGeo = new THREE.BoxGeometry(0.08, 0.06, 0.2);
  const doorHandle = new THREE.Mesh(handleGeo, chrome(THREE));
  doorHandle.position.set(1.44, -0.1, 0.4);
  cab.add(doorHandle);

  // ── Interior ── seat, steering
  const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.6), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  seatBase.position.set(0, -0.7, -0.1);
  cab.add(seatBase);
  const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.7, 0.12), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  seatBack.position.set(0, -0.2, -0.42);
  seatBack.rotation.x = -0.15;
  cab.add(seatBack);

  // Steering wheel
  const steeringGroup = new THREE.Group();
  steeringGroup.position.set(0, -0.1, 0.35);
  steeringGroup.rotation.x = -0.7;
  cab.add(steeringGroup);
  const steeringRim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.02, 8, 24), darkSteel(THREE));
  steeringGroup.add(steeringRim);
  const steeringCol = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8), chrome(THREE));
  steeringCol.position.set(0, 0, -0.2);
  steeringCol.rotation.x = Math.PI / 2;
  steeringGroup.add(steeringCol);

  // ── Cab access ladder/steps ──
  for (let i = 0; i < 3; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.05, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.4 })
    );
    step.position.set(1.7, 2.6 + i * 0.6, 1.5);
    rearFrame.add(step);
    // Step anti-slip texture (small ridges)
    for (let r = 0; r < 4; r++) {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.015, 0.02), darkSteel(THREE));
      ridge.position.set(1.7, 2.63 + i * 0.6, 1.42 + r * 0.04);
      rearFrame.add(ridge);
    }
  }

  // Grab handle
  const grabHandleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8);
  const grabHandle = new THREE.Mesh(grabHandleGeo, yellow);
  grabHandle.position.set(1.85, 4.2, 1.5);
  rearFrame.add(grabHandle);

  // ── Side mirrors ──
  for (let side = -1; side <= 1; side += 2) {
    const mirrorArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6),
      darkSteel(THREE)
    );
    mirrorArm.position.set(side * 1.8, 5.4, 2.3);
    mirrorArm.rotation.z = side * 0.5;
    rearFrame.add(mirrorArm);

    const mirrorFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.22, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.95, roughness: 0.05 })
    );
    mirrorFace.position.set(side * 2.1, 5.35, 2.3);
    rearFrame.add(mirrorFace);

    const mirrorHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.26, 0.06),
      darkSteel(THREE)
    );
    mirrorHousing.position.set(side * 2.1, 5.35, 2.27);
    rearFrame.add(mirrorHousing);
  }

  // ═══════════════════════════════════════════════════════════════════
  // 3. FRONT FRAME (articulation area + front axle mounting)
  // ═══════════════════════════════════════════════════════════════════
  const frontFrame = new THREE.Group();
  frontFrame.position.set(0, 0, 3.5);
  group.add(frontFrame);
  meshes.frontFrame = frontFrame;

  // Articulation joint center
  const articulationJoint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 1.2, 24),
    steel(THREE)
  );
  articulationJoint.position.set(0, 2.5, -0.5);
  frontFrame.add(articulationJoint);
  meshes.articulationJoint = articulationJoint;

  // Articulation pins
  for (let dy = -1; dy <= 1; dy += 2) {
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12),
      chrome(THREE)
    );
    pin.position.set(0, 2.5 + dy * 0.7, -0.5);
    frontFrame.add(pin);
  }

  // Front frame body
  const frontBodyShape = new THREE.Shape();
  frontBodyShape.moveTo(-2.0, 0);
  frontBodyShape.lineTo(2.0, 0);
  frontBodyShape.lineTo(1.8, 2.0);
  frontBodyShape.lineTo(1.4, 2.8);
  frontBodyShape.lineTo(-1.4, 2.8);
  frontBodyShape.lineTo(-1.8, 2.0);
  frontBodyShape.closePath();
  const frontBodyGeo = new THREE.ExtrudeGeometry(frontBodyShape, { depth: 3.5, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 2 });
  const frontBodyMesh = new THREE.Mesh(frontBodyGeo, yellow);
  frontBodyMesh.position.set(0, 1.8, -0.2);
  frontFrame.add(frontBodyMesh);

  // ── Steering cylinders (articulation hydraulics) ──
  for (let side = -1; side <= 1; side += 2) {
    const steerCylGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 12);
    const steerCyl = new THREE.Mesh(steerCylGeo, hCyl);
    steerCyl.rotation.x = Math.PI / 2;
    steerCyl.position.set(side * 1.2, 2.5, -0.2);
    frontFrame.add(steerCyl);

    const steerRodGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12);
    const steerRod = new THREE.Mesh(steerRodGeo, hRod);
    steerRod.rotation.x = Math.PI / 2;
    steerRod.position.set(side * 1.2, 2.5, -1.2);
    frontFrame.add(steerRod);
  }

  // ── Headlights ──
  for (let side = -1; side <= 1; side += 2) {
    // Main headlight
    const hlHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.35, 0.15),
      darkSteel(THREE)
    );
    hlHousing.position.set(side * 1.5, 4.0, 3.2);
    frontFrame.add(hlHousing);

    const hlLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12, 0, Math.PI),
      headlight
    );
    hlLens.position.set(side * 1.5, 4.0, 3.3);
    hlLens.rotation.x = -Math.PI / 2;
    frontFrame.add(hlLens);

    // Lower work lights
    const wl = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.18, 0.1),
      headlight
    );
    wl.position.set(side * 1.3, 3.3, 3.25);
    frontFrame.add(wl);
  }
  // Roof-mounted work lights
  for (let side = -1; side <= 1; side += 2) {
    const roofLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.12, 0.15),
      headlight
    );
    roofLight.position.set(side * 0.8, 7.2, 1.6);
    rearFrame.add(roofLight);
    const roofLightHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.16, 0.1),
      darkSteel(THREE)
    );
    roofLightHousing.position.set(side * 0.8, 7.2, 1.52);
    rearFrame.add(roofLightHousing);
  }

  // ── Front fenders ──
  for (let side = -1; side <= 1; side += 2) {
    const fenderShape = new THREE.Shape();
    fenderShape.absarc(0, 0, 1.15, 0, Math.PI, false);
    const fenderGeo = new THREE.ExtrudeGeometry(fenderShape, { depth: 0.8, bevelEnabled: false });
    const fender = new THREE.Mesh(fenderGeo, yellow);
    fender.position.set(side * 2.0, 1.8, 2.5);
    fender.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    frontFrame.add(fender);
  }

  // ═══════════════════════════════════════════════════════════════════
  // 4. LIFT ARMS + BUCKET + HYDRAULIC CYLINDERS
  // ═══════════════════════════════════════════════════════════════════
  const liftArmAssembly = new THREE.Group();
  liftArmAssembly.position.set(0, 3.8, 0.5);
  frontFrame.add(liftArmAssembly);
  meshes.liftArmAssembly = liftArmAssembly;

  // Lift arms (Z-bar linkage)
  for (let side = -1; side <= 1; side += 2) {
    // Main boom arm
    const armGeo = new THREE.BoxGeometry(0.18, 0.35, 5.5);
    const arm = new THREE.Mesh(armGeo, yellow);
    arm.position.set(side * 1.5, 0.5, 2.5);
    liftArmAssembly.add(arm);

    // Arm reinforcement ribs
    for (let r = 0; r < 4; r++) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.06, 0.12),
        yellowDark
      );
      rib.position.set(side * 1.5, 0.5, 0.8 + r * 1.2);
      liftArmAssembly.add(rib);
    }

    // Arm pivot bush (rear)
    const pivotBush = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16),
      chrome(THREE)
    );
    pivotBush.position.set(side * 1.5, 0.5, -0.2);
    liftArmAssembly.add(pivotBush);

    // Bell crank (Z-bar link)
    const bellCrank = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.22, 1.2),
      steel(THREE)
    );
    bellCrank.position.set(side * 1.3, -0.3, 3.8);
    bellCrank.rotation.x = 0.35;
    liftArmAssembly.add(bellCrank);

    // ── LIFT HYDRAULIC CYLINDERS ──
    // Cylinder body
    const liftCylGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.8, 16);
    const liftCyl = new THREE.Mesh(liftCylGeo, hCyl);
    liftCyl.position.set(side * 1.2, -0.5, 1.5);
    liftCyl.rotation.x = -0.4;
    liftArmAssembly.add(liftCyl);

    // Cylinder rod
    const liftRodGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.6, 12);
    const liftRod = new THREE.Mesh(liftRodGeo, hRod);
    liftRod.position.set(side * 1.2, 0.8, 2.8);
    liftRod.rotation.x = -0.4;
    liftArmAssembly.add(liftRod);

    // Cylinder end cap
    const endCap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.08, 16), darkSteel(THREE));
    endCap.position.set(side * 1.2, -1.7, 0.5);
    endCap.rotation.x = -0.4;
    liftArmAssembly.add(endCap);

    // Hydraulic hose routing
    const hoseCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 1.0, -1.5, 0.2),
      new THREE.Vector3(side * 0.9, -0.5, 0.5),
      new THREE.Vector3(side * 0.8, 0.5, 1.5),
      new THREE.Vector3(side * 1.0, 0.2, 2.5)
    );
    const hoseGeo = new THREE.TubeGeometry(hoseCurve, 20, 0.03, 8, false);
    const hoseMesh = new THREE.Mesh(hoseGeo, rubber(THREE));
    liftArmAssembly.add(hoseMesh);

    // Second hose
    const hoseCurve2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 1.1, -1.4, 0.3),
      new THREE.Vector3(side * 1.05, -0.4, 0.6),
      new THREE.Vector3(side * 0.95, 0.6, 1.6),
      new THREE.Vector3(side * 1.1, 0.3, 2.6)
    );
    const hoseGeo2 = new THREE.TubeGeometry(hoseCurve2, 20, 0.025, 8, false);
    const hoseMesh2 = new THREE.Mesh(hoseGeo2, new THREE.MeshStandardMaterial({ color: 0x222244, roughness: 0.8 }));
    liftArmAssembly.add(hoseMesh2);
  }

  // ── Bucket tilt cylinder (center) ──
  const tiltCylGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 14);
  const tiltCyl = new THREE.Mesh(tiltCylGeo, hCyl);
  tiltCyl.position.set(0, -0.3, 3.5);
  tiltCyl.rotation.x = 0.3;
  liftArmAssembly.add(tiltCyl);
  meshes.tiltCylinder = tiltCyl;

  const tiltRodGeo = new THREE.CylinderGeometry(0.055, 0.055, 1.2, 12);
  const tiltRod = new THREE.Mesh(tiltRodGeo, hRod);
  tiltRod.position.set(0, 0.5, 4.3);
  tiltRod.rotation.x = 0.3;
  liftArmAssembly.add(tiltRod);

  // Cross tube connecting arms
  const crossTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 2.8, 12),
    steel(THREE)
  );
  crossTube.rotation.z = Math.PI / 2;
  crossTube.position.set(0, 0.5, 5.0);
  liftArmAssembly.add(crossTube);

  // ═══════════════════════════════════════════════════════════════════
  // 5. BUCKET WITH TEETH
  // ═══════════════════════════════════════════════════════════════════
  const bucketGroup = new THREE.Group();
  bucketGroup.position.set(0, -0.5, 5.4);
  liftArmAssembly.add(bucketGroup);
  meshes.bucket = bucketGroup;

  // Bucket back plate (curved)
  const bucketBackShape = new THREE.Shape();
  bucketBackShape.moveTo(-1.8, 0);
  bucketBackShape.lineTo(1.8, 0);
  bucketBackShape.lineTo(1.8, 1.4);
  bucketBackShape.lineTo(-1.8, 1.4);
  bucketBackShape.closePath();
  const bucketBackGeo = new THREE.ExtrudeGeometry(bucketBackShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
  const bucketBack = new THREE.Mesh(bucketBackGeo, steel(THREE));
  bucketBack.position.set(0, -0.2, -0.1);
  bucketBack.rotation.x = -0.3;
  bucketGroup.add(bucketBack);

  // Bucket floor
  const bucketFloorGeo = new THREE.BoxGeometry(3.6, 0.1, 1.6);
  const bucketFloor = new THREE.Mesh(bucketFloorGeo, steel(THREE));
  bucketFloor.position.set(0, -0.25, 0.7);
  bucketGroup.add(bucketFloor);

  // Bucket side plates
  for (let side = -1; side <= 1; side += 2) {
    const sidePlateShape = new THREE.Shape();
    sidePlateShape.moveTo(0, 0);
    sidePlateShape.lineTo(1.8, 0);
    sidePlateShape.lineTo(1.8, 0.15);
    sidePlateShape.lineTo(1.5, 0.15);
    sidePlateShape.lineTo(0, 1.5);
    sidePlateShape.closePath();
    const sidePlateGeo = new THREE.ExtrudeGeometry(sidePlateShape, { depth: 0.08, bevelEnabled: false });
    const sidePlate = new THREE.Mesh(sidePlateGeo, steel(THREE));
    sidePlate.position.set(side * 1.8, -0.3, -0.1);
    sidePlate.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    bucketGroup.add(sidePlate);
  }

  // Cutting edge
  const cuttingEdge = new THREE.Mesh(
    new THREE.BoxGeometry(3.7, 0.15, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x666677, metalness: 0.85, roughness: 0.2 })
  );
  cuttingEdge.position.set(0, -0.35, 1.55);
  bucketGroup.add(cuttingEdge);

  // ── Bucket teeth ──
  const toothCount = 7;
  for (let i = 0; i < toothCount; i++) {
    const tx = -1.5 + (3.0 / (toothCount - 1)) * i;
    const toothGroup = new THREE.Group();
    toothGroup.position.set(tx, -0.35, 1.6);
    bucketGroup.add(toothGroup);

    // Tooth adapter (welded to bucket)
    const adapterGeo = new THREE.BoxGeometry(0.18, 0.2, 0.15);
    const adapter = new THREE.Mesh(adapterGeo, steel(THREE));
    toothGroup.add(adapter);

    // Tooth tip (replaceable)
    const toothShape = new THREE.Shape();
    toothShape.moveTo(-0.08, 0);
    toothShape.lineTo(0.08, 0);
    toothShape.lineTo(0.03, 0.45);
    toothShape.lineTo(-0.03, 0.45);
    toothShape.closePath();
    const toothGeo = new THREE.ExtrudeGeometry(toothShape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 });
    const tooth = new THREE.Mesh(toothGeo, bucketTeeth);
    tooth.position.set(0, -0.1, 0.05);
    tooth.rotation.x = Math.PI / 2 + 0.2;
    toothGroup.add(tooth);

    // Tooth retaining pin
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8),
      chrome(THREE)
    );
    pin.rotation.z = Math.PI / 2;
    pin.position.set(0, 0.05, 0);
    toothGroup.add(pin);
  }

  // Bucket wear strips
  for (let i = 0; i < 3; i++) {
    const wearStrip = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.04, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x555566, metalness: 0.7, roughness: 0.3 })
    );
    wearStrip.position.set(0, -0.22 + i * 0.04, 0.5 + i * 0.35);
    bucketGroup.add(wearStrip);
  }

  // Bucket lip protectors
  for (let i = 0; i < 6; i++) {
    const tx = -1.35 + i * 0.54;
    const lip = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.12, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x777788, metalness: 0.8, roughness: 0.25 })
    );
    lip.position.set(tx, -0.3, 1.5);
    bucketGroup.add(lip);
  }

  // ═══════════════════════════════════════════════════════════════════
  // 6. MASSIVE TIRES WITH REALISTIC TREAD
  // ═══════════════════════════════════════════════════════════════════
  function createWheelAssembly(THREE, radius, width, isRear) {
    const wheelGroup = new THREE.Group();

    // ── TIRE (Torus base + tread lugs) ──
    const tireGeo = new THREE.TorusGeometry(radius, width * 0.48, 24, 48);
    const tireMat = rubber(THREE);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    wheelGroup.add(tire);

    // Sidewall bulge ring
    const bulgeGeo = new THREE.TorusGeometry(radius, width * 0.42, 16, 48);
    const bulgeMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.95, metalness: 0.05 });
    const bulge = new THREE.Mesh(bulgeGeo, bulgeMat);
    wheelGroup.add(bulge);

    // Sidewall text ridge (simulated)
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const dotGeo = new THREE.BoxGeometry(0.06, 0.03, 0.015);
        const dot = new THREE.Mesh(dotGeo, new THREE.MeshStandardMaterial({ color: 0x2A2A2A }));
        dot.position.set(
          Math.cos(angle) * (radius),
          Math.sin(angle) * (radius),
          side * width * 0.35
        );
        dot.lookAt(0, 0, side * width * 0.35);
        wheelGroup.add(dot);
      }
    }

    // ── TREAD LUGS (deeply carved pattern) ──
    const lugCount = isRear ? 32 : 28;
    const lugHeight = width * 0.08;
    const lugWidth = width * 0.6;
    for (let i = 0; i < lugCount; i++) {
      const angle = (i / lugCount) * Math.PI * 2;
      const lug = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, lugHeight, lugWidth),
        new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.92, metalness: 0.05 })
      );
      lug.position.set(
        Math.cos(angle) * (radius + width * 0.46),
        Math.sin(angle) * (radius + width * 0.46),
        0
      );
      lug.rotation.z = angle;
      wheelGroup.add(lug);

      // Chevron pattern - secondary lugs at angle
      if (i % 2 === 0) {
        for (let side = -1; side <= 1; side += 2) {
          const chevronLug = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, lugHeight * 0.8, lugWidth * 0.25),
            new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.95 })
          );
          chevronLug.position.set(
            Math.cos(angle + side * 0.04) * (radius + width * 0.44),
            Math.sin(angle + side * 0.04) * (radius + width * 0.44),
            side * lugWidth * 0.25
          );
          chevronLug.rotation.z = angle + side * 0.15;
          wheelGroup.add(chevronLug);
        }
      }
    }

    // ── RIM (multi-piece with spokes) ──
    const rimOuter = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.55, width * 0.12, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xDDDD88, metalness: 0.75, roughness: 0.2 })
    );
    wheelGroup.add(rimOuter);

    // Rim center disc
    const rimDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.45, radius * 0.45, width * 0.15, 32),
      new THREE.MeshStandardMaterial({ color: 0xCCCC77, metalness: 0.7, roughness: 0.25 })
    );
    rimDisc.rotation.x = Math.PI / 2;
    wheelGroup.add(rimDisc);

    // Rim spokes
    const spokeCount = 8;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, radius * 0.35, width * 0.1),
        new THREE.MeshStandardMaterial({ color: 0xBBBB66, metalness: 0.65, roughness: 0.3 })
      );
      spoke.position.set(
        Math.cos(angle) * radius * 0.32,
        Math.sin(angle) * radius * 0.32,
        0
      );
      spoke.rotation.z = angle;
      wheelGroup.add(spoke);
    }

    // Hub cap
    const hubCap = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.15, radius * 0.18, width * 0.2, 16),
      chrome(THREE)
    );
    hubCap.rotation.x = Math.PI / 2;
    wheelGroup.add(hubCap);

    // Lug nuts
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const nut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, width * 0.18, 6),
        chrome(THREE)
      );
      nut.position.set(
        Math.cos(angle) * radius * 0.35,
        Math.sin(angle) * radius * 0.35,
        width * 0.08
      );
      nut.rotation.x = Math.PI / 2;
      wheelGroup.add(nut);
    }

    // Valve stem
    const valve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6),
      chrome(THREE)
    );
    valve.position.set(radius * 0.6, 0, width * 0.35);
    valve.rotation.x = Math.PI / 2;
    wheelGroup.add(valve);

    return wheelGroup;
  }

  // Front tires (smaller)
  const frontTireRadius = 1.05;
  const frontTireWidth = 0.85;
  const frontWheelL = createWheelAssembly(THREE, frontTireRadius, frontTireWidth, false);
  frontWheelL.position.set(-2.3, 1.8, 2.5);
  frontWheelL.rotation.y = Math.PI / 2;
  frontFrame.add(frontWheelL);
  meshes.frontWheelL = frontWheelL;

  const frontWheelR = createWheelAssembly(THREE, frontTireRadius, frontTireWidth, false);
  frontWheelR.position.set(2.3, 1.8, 2.5);
  frontWheelR.rotation.y = -Math.PI / 2;
  frontFrame.add(frontWheelR);
  meshes.frontWheelR = frontWheelR;

  // Rear tires (larger)
  const rearTireRadius = 1.25;
  const rearTireWidth = 1.0;
  const rearWheelL = createWheelAssembly(THREE, rearTireRadius, rearTireWidth, true);
  rearWheelL.position.set(-2.5, 1.8, 1.0);
  rearWheelL.rotation.y = Math.PI / 2;
  rearFrame.add(rearWheelL);
  meshes.rearWheelL = rearWheelL;

  const rearWheelR = createWheelAssembly(THREE, rearTireRadius, rearTireWidth, true);
  rearWheelR.position.set(2.5, 1.8, 1.0);
  rearWheelR.rotation.y = -Math.PI / 2;
  rearFrame.add(rearWheelR);
  meshes.rearWheelR = rearWheelR;

  // ── Front axle ──
  const frontAxle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 4.8, 12),
    steel(THREE)
  );
  frontAxle.rotation.z = Math.PI / 2;
  frontAxle.position.set(0, 1.8, 2.5);
  frontFrame.add(frontAxle);

  // ── Rear axle ──
  const rearAxle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 5.2, 12),
    steel(THREE)
  );
  rearAxle.rotation.z = Math.PI / 2;
  rearAxle.position.set(0, 1.8, 1.0);
  rearFrame.add(rearAxle);

  // ═══════════════════════════════════════════════════════════════════
  // 7. ADDITIONAL DETAILS
  // ═══════════════════════════════════════════════════════════════════

  // ── Rear fenders ──
  for (let side = -1; side <= 1; side += 2) {
    const rFenderShape = new THREE.Shape();
    rFenderShape.absarc(0, 0, 1.4, 0, Math.PI, false);
    const rFenderGeo = new THREE.ExtrudeGeometry(rFenderShape, { depth: 1.0, bevelEnabled: false });
    const rFender = new THREE.Mesh(rFenderGeo, yellow);
    rFender.position.set(side * 2.3, 1.8, 1.5);
    rFender.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    rearFrame.add(rFender);
  }

  // ── Mudflaps ──
  for (let side = -1; side <= 1; side += 2) {
    const mudflap = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.8, 0.04),
      rubber(THREE)
    );
    mudflap.position.set(side * 2.3, 0.7, -0.2);
    rearFrame.add(mudflap);
  }

  // ── Fuel tank ──
  const fuelTank = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 })
  );
  fuelTank.position.set(-1.8, 2.4, 2.5);
  rearFrame.add(fuelTank);

  // Fuel cap
  const fuelCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12),
    chrome(THREE)
  );
  fuelCap.position.set(-1.8, 2.85, 2.5);
  rearFrame.add(fuelCap);

  // ── Hydraulic tank ──
  const hydroTank = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.6, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x2A2A3A, metalness: 0.5, roughness: 0.4 })
  );
  hydroTank.position.set(1.8, 2.4, 2.5);
  rearFrame.add(hydroTank);

  // ── Hydraulic hoses on rear frame ──
  const mainHoseCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(1.5, 2.8, 2.5),
    new THREE.Vector3(1.2, 3.5, 3.0),
    new THREE.Vector3(0.8, 4.0, 3.5),
    new THREE.Vector3(0.5, 3.8, 4.0)
  );
  const mainHoseGeo = new THREE.TubeGeometry(mainHoseCurve, 24, 0.04, 8, false);
  const mainHose = new THREE.Mesh(mainHoseGeo, rubber(THREE));
  rearFrame.add(mainHose);

  // ── Rear bumper / tow hitch ──
  const bumper = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.3, 0.25),
    darkSteel(THREE)
  );
  bumper.position.set(0, 1.5, -1.5);
  rearFrame.add(bumper);

  // Tow hitch pin
  const towPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.4, 12),
    chrome(THREE)
  );
  towPin.position.set(0, 1.3, -1.6);
  rearFrame.add(towPin);

  // ── Coolant lines ──
  for (let i = 0; i < 2; i++) {
    const coolantCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.5 + i * 0.3, 3.0, 0),
      new THREE.Vector3(-0.3 + i * 0.3, 3.5, 0.8),
      new THREE.Vector3(0.1 + i * 0.3, 3.8, 1.5),
      new THREE.Vector3(0.3 + i * 0.3, 3.5, 2.5)
    );
    const coolantGeo = new THREE.TubeGeometry(coolantCurve, 16, 0.025, 8, false);
    const coolantMesh = new THREE.Mesh(coolantGeo, copper(THREE));
    rearFrame.add(coolantMesh);
  }

  // ── Panel line details on body ──
  const panelLines = [
    { pos: [0, 4.4, 3.45], size: [3.6, 0.02, 0.02] },
    { pos: [0, 3.0, 3.45], size: [3.6, 0.02, 0.02] },
    { pos: [-2.35, 3.5, 1.5], size: [0.02, 2.0, 2.5] },
    { pos: [2.35, 3.5, 1.5], size: [0.02, 2.0, 2.5] },
  ];
  panelLines.forEach(pl => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(...pl.size), panelL);
    line.position.set(...pl.pos);
    rearFrame.add(line);
  });

  // ── Rivets along body panels ──
  const rivetPositions = [];
  for (let i = 0; i < 12; i++) {
    rivetPositions.push([-2.4, 3.0 + i * 0.15, 3.42]);
    rivetPositions.push([2.4, 3.0 + i * 0.15, 3.42]);
  }
  rivetPositions.forEach(rp => {
    const rivet = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 6, 6),
      chrome(THREE)
    );
    rivet.position.set(...rp);
    rearFrame.add(rivet);
  });

  // ── Air intake ──
  const airIntake = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.25, 0.6, 12),
    darkSteel(THREE)
  );
  airIntake.position.set(-1.2, 5.3, 0.5);
  rearFrame.add(airIntake);

  // Air intake snorkel
  const snorkelCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-1.2, 5.6, 0.5),
    new THREE.Vector3(-1.3, 6.0, 0.5),
    new THREE.Vector3(-1.1, 6.3, 0.8),
    new THREE.Vector3(-0.8, 6.5, 1.0)
  );
  const snorkelGeo = new THREE.TubeGeometry(snorkelCurve, 12, 0.08, 8, false);
  const snorkel = new THREE.Mesh(snorkelGeo, darkSteel(THREE));
  rearFrame.add(snorkel);

  // ── Hi-tech dashboard glow strips inside cab ──
  const dashGlow1 = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.03, 0.02),
    glowGreen
  );
  dashGlow1.position.set(0, -0.45, 0.65);
  cab.add(dashGlow1);

  const dashGlow2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.03, 0.02),
    glowBlue
  );
  dashGlow2.position.set(-0.4, -0.35, 0.65);
  cab.add(dashGlow2);

  // Indicator panel lights
  for (let i = 0; i < 5; i++) {
    const indicator = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      _glow(THREE, [0x00FF00, 0xFF8800, 0xFF0000, 0x0088FF, 0xFFFF00][i], 2.0)
    );
    indicator.position.set(-0.6 + i * 0.15, -0.28, 0.67);
    cab.add(indicator);
  }
  meshes.indicators = cab;

  // ── Neon accent strip under body (futuristic touch) ──
  const neonStrip = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 0.03, 0.06),
    glowOrange
  );
  neonStrip.position.set(0, 1.0, 3.5);
  rearFrame.add(neonStrip);
  meshes.neonStrip = neonStrip;

  // Second accent strip
  const neonStrip2 = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.03, 0.06),
    glowBlue
  );
  neonStrip2.position.set(0, 0.95, -0.5);
  rearFrame.add(neonStrip2);
  meshes.neonStrip2 = neonStrip2;

  // ═══════════════════════════════════════════════════════════════════
  // PARTS
  // ═══════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Front Bucket',
      description: 'High-capacity spade-nose bucket with 7 replaceable GET (Ground Engaging Tools) teeth, hardened cutting edge, bolt-on lip protectors, and internal wear strips for extended life in heavy loading applications.',
      material: 'Hardox 450 wear-resistant steel with manganese steel teeth',
      function: 'Primary earthmoving tool for loading, digging, carrying loose material, dozing, and grading operations',
      assemblyOrder: 7,
      connections: ['Lift Arms', 'Tilt Cylinder', 'Bell Crank Linkage'],
      failureEffect: 'Complete loss of loading capability; machine cannot perform primary function',
      cascadeFailures: ['Tilt Cylinder', 'Z-Bar Linkage'],
      originalPosition: { x: 0, y: 3.3, z: 9.4 },
      explodedPosition: { x: 0, y: 5, z: 14 }
    },
    {
      name: 'Lift Arms (Z-Bar Linkage)',
      description: 'Dual parallel boom arms with Z-bar (bell crank) linkage providing superior breakout force and load-handling stability through mechanical advantage.',
      material: 'High-strength low-alloy structural steel (T-1 / HY-80)',
      function: 'Raise, lower, and position the bucket through full working range with optimal force distribution at all heights',
      assemblyOrder: 6,
      connections: ['Bucket', 'Lift Cylinders', 'Front Frame Pivots'],
      failureEffect: 'Bucket stuck at current height; cannot load or dump material',
      cascadeFailures: ['Bucket', 'Lift Cylinders'],
      originalPosition: { x: 0, y: 3.8, z: 4 },
      explodedPosition: { x: 0, y: 7, z: 6 }
    },
    {
      name: 'Lift Hydraulic Cylinders',
      description: 'Twin double-acting hydraulic cylinders (200mm bore × 1400mm stroke) providing up to 22,000 kg of lift force with velocity-fused operation for smooth multi-function control.',
      material: 'Chrome-plated C1045 piston rod, honed steel cylinder tube, polyurethane seals',
      function: 'Convert hydraulic pressure to linear force for raising/lowering lift arms',
      assemblyOrder: 5,
      connections: ['Lift Arms', 'Hydraulic Pump', 'Control Valves'],
      failureEffect: 'Arms drift down under load; eventual complete loss of lift function',
      cascadeFailures: ['Lift Arms', 'Bucket'],
      originalPosition: { x: 1.2, y: 3.3, z: 5.5 },
      explodedPosition: { x: 4, y: 6, z: 5.5 }
    },
    {
      name: 'Articulation Joint',
      description: 'Center-pin articulated steering joint allowing ±40° frame oscillation. Features heavy-duty tapered roller bearings and hardened alloy pins for millions of steering cycles.',
      material: 'Case-hardened alloy steel pins, manganese bronze bushings',
      function: 'Enable articulated steering by allowing front and rear frames to pivot independently for tight turning radius',
      assemblyOrder: 2,
      connections: ['Front Frame', 'Rear Frame', 'Steering Cylinders'],
      failureEffect: 'Loss of steering control; machine cannot turn safely',
      cascadeFailures: ['Steering Cylinders', 'Front Frame', 'Rear Frame'],
      originalPosition: { x: 0, y: 2.5, z: 3 },
      explodedPosition: { x: 0, y: 5, z: 3 }
    },
    {
      name: 'Operator Cab (ROPS/FOPS)',
      description: 'Pressurized, sound-suppressed operator station with ROPS (Rollover Protective Structure) and FOPS (Falling Object Protective Structure) certification. Features 360° visibility, ergonomic joystick controls, and climate control.',
      material: 'Welded tubular steel frame, laminated safety glass, acoustic foam lining',
      function: 'Protect operator and provide ergonomic environment for safe machine operation',
      assemblyOrder: 8,
      connections: ['Rear Frame', 'Hydraulic Controls', 'Electrical System'],
      failureEffect: 'Operator safety compromised; machine should be immediately shut down',
      cascadeFailures: ['Electrical System', 'Display Systems'],
      originalPosition: { x: 0, y: 4.8, z: 1.8 },
      explodedPosition: { x: 0, y: 9, z: 1.8 }
    },
    {
      name: 'Counterweight',
      description: 'Cast iron counterweight assembly (approximately 4,500 kg) integrated into the rear frame to balance the load moment when the bucket is fully loaded and elevated.',
      material: 'Ductile cast iron with corrosion-resistant coating',
      function: 'Provide stability and prevent forward tipping when lifting heavy loads',
      assemblyOrder: 3,
      connections: ['Rear Frame'],
      failureEffect: 'Severe instability; high risk of forward tip-over when loading',
      cascadeFailures: ['Stability System'],
      originalPosition: { x: 0, y: 1.8, z: -1.2 },
      explodedPosition: { x: 0, y: 1.8, z: -5 }
    },
    {
      name: 'Rear Tires (29.5R25 L3)',
      description: 'Massive 29.5R25 radial off-highway tires with L3 traction tread pattern. Deep chevron lugs provide excellent grip in soft/muddy conditions while the radial construction gives superior ride quality and heat dissipation.',
      material: 'Steel-belted radial carcass, natural/synthetic rubber compound, bead wire',
      function: 'Transmit drivetrain torque to ground, support machine weight, absorb terrain shocks',
      assemblyOrder: 1,
      connections: ['Rear Axle', 'Rim Assembly', 'Differential'],
      failureEffect: 'Machine immobilized on affected side; uneven loading stresses drivetrain',
      cascadeFailures: ['Rear Axle', 'Differential'],
      originalPosition: { x: -2.5, y: 1.8, z: 1 },
      explodedPosition: { x: -5, y: 1.8, z: 1 }
    },
    {
      name: 'Front Tires (26.5R25 L3)',
      description: 'Large 26.5R25 radial tires with L3 tread pattern optimized for steering response and lateral stability on uneven terrain.',
      material: 'Steel-belted radial carcass, cut/chip resistant rubber compound',
      function: 'Provide steering traction and support front axle loads during bucket operations',
      assemblyOrder: 1,
      connections: ['Front Axle', 'Steering Knuckles'],
      failureEffect: 'Severe steering difficulty; reduced bucket payload capacity',
      cascadeFailures: ['Front Axle', 'Steering System'],
      originalPosition: { x: -2.3, y: 1.8, z: 6 },
      explodedPosition: { x: -5, y: 1.8, z: 8 }
    },
    {
      name: 'Exhaust System',
      description: 'Vertical exhaust stack with DOC (Diesel Oxidation Catalyst), DPF (Diesel Particulate Filter), and SCR (Selective Catalytic Reduction) for Tier 4 Final emissions compliance.',
      material: 'Stainless steel 409, ceramic catalyst substrates, Inconel heat shields',
      function: 'Route and treat engine exhaust gases to meet emissions regulations while reducing noise',
      assemblyOrder: 9,
      connections: ['Engine', 'Turbocharger', 'DEF Tank'],
      failureEffect: 'Engine derate or shutdown; non-compliance with emissions regulations',
      cascadeFailures: ['Engine Performance', 'DEF System'],
      originalPosition: { x: 1.2, y: 5.5, z: 0.5 },
      explodedPosition: { x: 4, y: 8, z: 0.5 }
    },
    {
      name: 'Radiator Fan Assembly',
      description: 'Variable-speed hydraulically driven cooling fan with temperature-demand control. Reduces parasitic power loss by running only at required speed for current cooling demand.',
      material: 'Injection-molded reinforced nylon blades, aluminum hub',
      function: 'Draw air through radiator, charge air cooler, and hydraulic oil cooler to maintain optimal operating temperatures',
      assemblyOrder: 4,
      connections: ['Engine Cooling System', 'Hydraulic Oil Cooler', 'Charge Air Cooler'],
      failureEffect: 'Rapid engine and hydraulic oil overheating; forced machine shutdown within minutes',
      cascadeFailures: ['Engine', 'Hydraulic System', 'Transmission'],
      originalPosition: { x: 0, y: 3.5, z: 3.3 },
      explodedPosition: { x: 0, y: 3.5, z: 6 }
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What type of steering system does a modern wheel loader use?',
      options: [
        'Rack and pinion steering on front wheels',
        'Articulated frame steering with hydraulic cylinders',
        'Rear-wheel Ackermann steering',
        'Skid steering like a skid-steer loader'
      ],
      correct: 1,
      explanation: 'Modern wheel loaders use articulated frame steering, where the entire front frame pivots relative to the rear frame using hydraulic steering cylinders. This provides a very tight turning radius despite the machine\'s large size and allows all four tires to follow the same path, reducing tire wear.',
      difficulty: 'medium'
    },
    {
      question: 'What is the primary purpose of the counterweight on a wheel loader?',
      options: [
        'To increase traction on the rear wheels for faster travel speed',
        'To protect the engine from impact during loading operations',
        'To balance the load moment and prevent forward tip-over when the bucket is loaded',
        'To provide additional down-force for better grading accuracy'
      ],
      correct: 2,
      explanation: 'The counterweight, typically 3,000–5,000 kg of cast iron, is positioned at the extreme rear of the machine to counterbalance the weight in the bucket at the front. Without it, a fully loaded and elevated bucket would cause the machine to tip forward over the front axle.',
      difficulty: 'easy'
    },
    {
      question: 'What advantage does the Z-bar linkage provide over a standard parallel-lift linkage?',
      options: [
        'Higher bucket breakout force at ground level due to mechanical advantage',
        'Better visibility to the bucket cutting edge from the cab',
        'Reduced number of hydraulic cylinders required',
        'Elimination of the need for a tilt cylinder'
      ],
      correct: 0,
      explanation: 'The Z-bar (bell crank) linkage uses a mechanical advantage arrangement where the bell crank multiplies the tilt cylinder force at ground level, providing significantly higher breakout force for digging into hard material. This makes it the preferred linkage for production loading, quarrying, and mining applications.',
      difficulty: 'hard'
    },
    {
      question: 'Why do large wheel loaders use radial (R) tires instead of bias-ply tires?',
      options: [
        'Radial tires are cheaper to manufacture in large sizes',
        'Radial tires generate less heat, last longer, and provide better ride quality',
        'Bias-ply tires cannot be made in sizes above 20 inches',
        'Radial tires have more aggressive tread patterns for mud'
      ],
      correct: 1,
      explanation: 'Radial tires have a flexible sidewall and stiff belt construction that results in a larger, flatter contact patch. This generates significantly less internal heat (extending tire life 2-3×), provides superior ride comfort, lower rolling resistance, and more even tread wear compared to bias-ply alternatives.',
      difficulty: 'medium'
    },
    {
      question: 'What does ROPS/FOPS certification mean for the operator cab?',
      options: [
        'Remote Operation Protection System / Fireproof Operation Protection System',
        'Rollover Protective Structure / Falling Object Protective Structure',
        'Reinforced Operator Positioning System / Forward Obstacle Prevention System',
        'Rapid Overload Protection System / Fluid Overpressure Prevention System'
      ],
      correct: 1,
      explanation: 'ROPS (Rollover Protective Structure) and FOPS (Falling Object Protective Structure) are ISO-standardized safety certifications. ROPS ensures the cab can withstand the machine\'s weight during a rollover, maintaining a survival space for the operator. FOPS protects against objects (rocks, debris) falling onto the cab from above.',
      difficulty: 'easy'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════════════════════
  const description = `Modern Wheel Loader (CAT 980-class)

A large articulated wheel loader designed for high-production loading in quarries, mines, and heavy construction. This ~30-tonne class machine features a CAT C13 ACERT diesel engine (275 kW / 370 hp), powershift transmission, and full hydraulic work tool system.

Key Systems:
• Articulated Frame Steering — Front and rear frames pivot at a center joint for tight turning radius (~7.5m) with dual steering cylinders
• Z-Bar Loader Linkage — Bell crank mechanism providing exceptional breakout force (~185 kN) and high dump reach
• Load-Sensing Hydraulics — Variable displacement piston pump delivering 300+ L/min at 250 bar for responsive implement control
• Tier 4 Final Emissions — DOC/DPF/SCR aftertreatment with DEF injection for ultra-low NOx and PM emissions
• Torque Converter with Lock-Up Clutch — Maximizes drivetrain efficiency at speed while maintaining low-speed torque multiplication
• ROPS/FOPS Cab — Pressurized and sound-suppressed (<72 dB interior) with ergonomic joystick controls and rearview camera

Typical Applications: Truck loading, stockpile management, material handling, snow removal, log handling (with forks), and general heavy construction earthmoving.`;

  // ═══════════════════════════════════════════════════════════════════
  // ANIMATE
  // ═══════════════════════════════════════════════════════════════════
  function animate(time, speed, refMeshes) {
    const t = time * speed;
    const m = refMeshes || meshes;

    // Wheel rotation (forward driving)
    const wheelSpeed = t * 1.2;
    if (m.frontWheelL) m.frontWheelL.rotation.x = wheelSpeed;
    if (m.frontWheelR) m.frontWheelR.rotation.x = -wheelSpeed;
    if (m.rearWheelL) m.rearWheelL.rotation.x = wheelSpeed;
    if (m.rearWheelR) m.rearWheelR.rotation.x = -wheelSpeed;

    // Lift arm raise/lower cycle
    if (m.liftArmAssembly) {
      const liftAngle = Math.sin(t * 0.3) * 0.2;
      m.liftArmAssembly.rotation.x = liftAngle;
    }

    // Bucket tilt cycle
    if (m.bucket) {
      const tiltAngle = Math.sin(t * 0.5 + 0.5) * 0.25;
      m.bucket.rotation.x = tiltAngle;
    }

    // Tilt cylinder piston motion
    if (m.tiltCylinder) {
      m.tiltCylinder.scale.y = 1.0 + Math.sin(t * 0.5 + 0.5) * 0.08;
    }

    // Articulation steering oscillation (subtle)
    if (m.frontFrame) {
      const steerAngle = Math.sin(t * 0.2) * 0.08;
      m.frontFrame.rotation.y = steerAngle;
    }

    // Radiator fan spin
    if (m.radiatorFan) {
      m.radiatorFan.rotation.z = t * 8;
    }

    // Exhaust heat shimmer (subtle scale pulse)
    if (m.exhaustPipe) {
      m.exhaustPipe.scale.x = 1.0 + Math.sin(t * 6) * 0.01;
      m.exhaustPipe.scale.z = 1.0 + Math.cos(t * 6) * 0.01;
    }

    // Warning beacon rotation/pulse
    if (m.beacon) {
      m.beacon.material.emissiveIntensity = 1.5 + Math.sin(t * 4) * 1.5;
      m.beacon.rotation.y = t * 3;
    }

    // Neon accent strips pulsing
    if (m.neonStrip) {
      m.neonStrip.material.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.8;
    }
    if (m.neonStrip2) {
      m.neonStrip2.material.emissiveIntensity = 1.0 + Math.cos(t * 2.5) * 0.8;
    }

    // Cab gentle sway (operator vibration)
    if (m.cab) {
      m.cab.rotation.z = Math.sin(t * 3) * 0.003;
      m.cab.position.y = 4.8 + Math.sin(t * 4) * 0.008;
    }

    // Windshield tint subtle shift
    if (m.windshield && m.windshield.material) {
      m.windshield.material.opacity = 0.32 + Math.sin(t * 1.5) * 0.03;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
