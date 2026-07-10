import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ─── Custom Materials ─────────────────────────────────────────────
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.8,
    metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.9
  });
  const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.7,
    metalness: 0.2, roughness: 0.3, transparent: true, opacity: 0.85
  });
  const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 0.6,
    metalness: 0.2, roughness: 0.3, transparent: true, opacity: 0.85
  });
  const plasmaCoreGlow = new THREE.MeshStandardMaterial({
    color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 1.2,
    metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.7
  });
  const hydraulicRed = new THREE.MeshStandardMaterial({
    color: 0xcc2200, emissive: 0x440000, emissiveIntensity: 0.15,
    metalness: 0.6, roughness: 0.35
  });
  const warningYellow = new THREE.MeshStandardMaterial({
    color: 0xffcc00, emissive: 0x553300, emissiveIntensity: 0.2,
    metalness: 0.4, roughness: 0.3
  });
  const grimeSteel = new THREE.MeshStandardMaterial({
    color: 0x555560, metalness: 0.85, roughness: 0.45
  });
  const dirtyMetal = new THREE.MeshStandardMaterial({
    color: 0x3a3a42, metalness: 0.9, roughness: 0.5
  });
  const cableBlack = new THREE.MeshStandardMaterial({
    color: 0x111111, metalness: 0.2, roughness: 0.8
  });
  const conveyorBelt = new THREE.MeshStandardMaterial({
    color: 0x222222, metalness: 0.15, roughness: 0.9
  });
  const sealingRubber = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, metalness: 0.05, roughness: 0.95
  });
  const concreteGrey = new THREE.MeshStandardMaterial({
    color: 0x999999, metalness: 0.1, roughness: 0.85
  });

  const meshes = {};

  // ═══════════════════════════════════════════════════════════════════
  // 1. SHIELD BODY — Main cylindrical hull
  // ═══════════════════════════════════════════════════════════════════
  const shieldGroup = new THREE.Group();

  // Outer shield cylinder
  const shieldGeo = new THREE.CylinderGeometry(3.2, 3.2, 14, 64, 1, true);
  const shieldMesh = new THREE.Mesh(shieldGeo, darkSteel);
  shieldMesh.rotation.z = Math.PI / 2;
  shieldGroup.add(shieldMesh);

  // Inner shield lining
  const innerShieldGeo = new THREE.CylinderGeometry(3.0, 3.0, 14.1, 64, 1, true);
  const innerShieldMesh = new THREE.Mesh(innerShieldGeo, grimeSteel);
  innerShieldMesh.rotation.z = Math.PI / 2;
  shieldGroup.add(innerShieldMesh);

  // Panel lines (circumferential seams)
  for (let i = -6; i <= 6; i += 2) {
    const seamGeo = new THREE.TorusGeometry(3.22, 0.03, 8, 64);
    const seam = new THREE.Mesh(seamGeo, dirtyMetal);
    seam.rotation.y = Math.PI / 2;
    seam.position.x = i;
    shieldGroup.add(seam);
  }

  // Longitudinal weld lines
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
    const weldGeo = new THREE.BoxGeometry(14, 0.04, 0.04);
    const weld = new THREE.Mesh(weldGeo, dirtyMetal);
    weld.position.y = Math.sin(a) * 3.21;
    weld.position.z = Math.cos(a) * 3.21;
    shieldGroup.add(weld);
  }

  // Rivets along seams
  for (let i = -6; i <= 6; i += 2) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const rivetGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const rivet = new THREE.Mesh(rivetGeo, chrome);
      rivet.position.x = i;
      rivet.position.y = Math.sin(a) * 3.24;
      rivet.position.z = Math.cos(a) * 3.24;
      shieldGroup.add(rivet);
    }
  }

  // Tail shield seal (rubber rings at rear)
  for (let r = 0; r < 3; r++) {
    const sealGeo = new THREE.TorusGeometry(3.15, 0.08, 12, 64);
    const seal = new THREE.Mesh(sealGeo, sealingRubber);
    seal.rotation.y = Math.PI / 2;
    seal.position.x = -6.5 - r * 0.25;
    shieldGroup.add(seal);
  }

  group.add(shieldGroup);
  meshes.shield = shieldGroup;

  // ═══════════════════════════════════════════════════════════════════
  // 2. CUTTER HEAD — Rotating face with disc cutters
  // ═══════════════════════════════════════════════════════════════════
  const cutterHeadGroup = new THREE.Group();
  cutterHeadGroup.position.x = 7.5;

  // Main face plate (slightly domed)
  const facePlateGeo = new THREE.SphereGeometry(3.2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 6);
  const facePlateMesh = new THREE.Mesh(facePlateGeo, steel);
  facePlateMesh.rotation.z = -Math.PI / 2;
  cutterHeadGroup.add(facePlateMesh);

  // Back plate
  const backPlateGeo = new THREE.CircleGeometry(3.18, 64);
  const backPlateMesh = new THREE.Mesh(backPlateGeo, darkSteel);
  backPlateMesh.rotation.y = Math.PI;
  backPlateMesh.position.x = -0.1;
  cutterHeadGroup.add(backPlateMesh);

  // Spoke arms (structural ribs)
  const spokeCount = 6;
  for (let s = 0; s < spokeCount; s++) {
    const angle = (s / spokeCount) * Math.PI * 2;
    const spokeGeo = new THREE.BoxGeometry(0.15, 0.35, 3.0);
    const spoke = new THREE.Mesh(spokeGeo, steel);
    spoke.position.x = 0.25;
    spoke.position.y = Math.sin(angle) * 1.5;
    spoke.position.z = Math.cos(angle) * 1.5;
    spoke.rotation.x = angle;
    cutterHeadGroup.add(spoke);

    // Secondary spokes (outer reach)
    const spoke2Geo = new THREE.BoxGeometry(0.12, 0.25, 1.2);
    const spoke2 = new THREE.Mesh(spoke2Geo, grimeSteel);
    spoke2.position.x = 0.3;
    spoke2.position.y = Math.sin(angle) * 2.6;
    spoke2.position.z = Math.cos(angle) * 2.6;
    spoke2.rotation.x = angle;
    cutterHeadGroup.add(spoke2);
  }

  // Disc cutters — 17-inch style roller cutters on the face
  const discCutterGroup = new THREE.Group();
  const cutterPositions = [];

  // Center cutter
  cutterPositions.push({ r: 0, a: 0 });
  // Ring 1
  for (let i = 0; i < 4; i++) cutterPositions.push({ r: 0.9, a: (i / 4) * Math.PI * 2 });
  // Ring 2
  for (let i = 0; i < 8; i++) cutterPositions.push({ r: 1.7, a: (i / 8) * Math.PI * 2 });
  // Ring 3
  for (let i = 0; i < 12; i++) cutterPositions.push({ r: 2.5, a: (i / 12) * Math.PI * 2 });
  // Gauge cutters (outermost)
  for (let i = 0; i < 16; i++) cutterPositions.push({ r: 3.0, a: (i / 16) * Math.PI * 2 });

  cutterPositions.forEach((pos) => {
    const cutterAssembly = new THREE.Group();

    // Disc cutter ring
    const discGeo = new THREE.TorusGeometry(0.12, 0.035, 12, 24);
    const disc = new THREE.Mesh(discGeo, chrome);
    cutterAssembly.add(disc);

    // Cutter hub
    const hubGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
    const hub = new THREE.Mesh(hubGeo, steel);
    hub.rotation.x = Math.PI / 2;
    cutterAssembly.add(hub);

    // Saddle mount
    const saddleGeo = new THREE.BoxGeometry(0.18, 0.08, 0.15);
    const saddle = new THREE.Mesh(saddleGeo, darkSteel);
    saddle.position.z = -0.1;
    cutterAssembly.add(saddle);

    cutterAssembly.position.x = 0.45;
    cutterAssembly.position.y = Math.sin(pos.a) * pos.r;
    cutterAssembly.position.z = Math.cos(pos.a) * pos.r;
    cutterAssembly.rotation.x = pos.a + Math.PI / 2;
    discCutterGroup.add(cutterAssembly);
  });
  cutterHeadGroup.add(discCutterGroup);

  // Muck buckets (openings between spokes)
  for (let b = 0; b < spokeCount; b++) {
    const angle = ((b + 0.5) / spokeCount) * Math.PI * 2;
    const bucketGeo = new THREE.BoxGeometry(0.3, 0.6, 1.0);
    const bucket = new THREE.Mesh(bucketGeo, dirtyMetal);
    bucket.position.x = 0.05;
    bucket.position.y = Math.sin(angle) * 2.0;
    bucket.position.z = Math.cos(angle) * 2.0;
    bucket.rotation.x = angle;
    cutterHeadGroup.add(bucket);
  }

  // Center cone (pilot hub)
  const coneGeo = new THREE.ConeGeometry(0.4, 0.8, 24);
  const cone = new THREE.Mesh(coneGeo, chrome);
  cone.rotation.z = -Math.PI / 2;
  cone.position.x = 0.7;
  cutterHeadGroup.add(cone);

  // Neon ring (scanning/monitoring ring)
  const neonRingGeo = new THREE.TorusGeometry(3.15, 0.04, 16, 128);
  const neonRing = new THREE.Mesh(neonRingGeo, neonCyan);
  neonRing.rotation.y = Math.PI / 2;
  neonRing.position.x = 0.1;
  cutterHeadGroup.add(neonRing);
  meshes.neonRing = neonRing;

  // Secondary neon ring
  const neonRing2Geo = new THREE.TorusGeometry(2.0, 0.03, 16, 96);
  const neonRing2 = new THREE.Mesh(neonRing2Geo, neonGreen);
  neonRing2.rotation.y = Math.PI / 2;
  neonRing2.position.x = 0.15;
  cutterHeadGroup.add(neonRing2);
  meshes.neonRing2 = neonRing2;

  group.add(cutterHeadGroup);
  meshes.cutterHead = cutterHeadGroup;

  // ═══════════════════════════════════════════════════════════════════
  // 3. THRUST CYLINDERS — Hydraulic rams pushing cutter head forward
  // ═══════════════════════════════════════════════════════════════════
  const thrustGroup = new THREE.Group();
  const thrustCount = 16;
  const thrustCylinders = [];

  for (let t = 0; t < thrustCount; t++) {
    const angle = (t / thrustCount) * Math.PI * 2;
    const cylGroup = new THREE.Group();

    // Outer cylinder (barrel)
    const barrelGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.0, 16);
    const barrel = new THREE.Mesh(barrelGeo, hydraulicRed);
    barrel.rotation.z = Math.PI / 2;
    cylGroup.add(barrel);

    // Inner piston rod (chrome)
    const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 16);
    const rod = new THREE.Mesh(rodGeo, chrome);
    rod.rotation.z = Math.PI / 2;
    rod.position.x = 1.5;
    cylGroup.add(rod);
    thrustCylinders.push(rod);

    // Piston head cap
    const capGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.1, 16);
    const cap = new THREE.Mesh(capGeo, darkSteel);
    cap.rotation.z = Math.PI / 2;
    cap.position.x = 2.5;
    cylGroup.add(cap);

    // Mounting bracket (rear)
    const bracketGeo = new THREE.BoxGeometry(0.2, 0.3, 0.3);
    const bracket = new THREE.Mesh(bracketGeo, darkSteel);
    bracket.position.x = -1.5;
    cylGroup.add(bracket);

    // Hydraulic line connectors
    const connGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
    const conn1 = new THREE.Mesh(connGeo, copper);
    conn1.position.set(-0.5, 0.15, 0);
    cylGroup.add(conn1);
    const conn2 = new THREE.Mesh(connGeo.clone(), copper);
    conn2.position.set(0.5, 0.15, 0);
    cylGroup.add(conn2);

    const radius = 2.7;
    cylGroup.position.set(3.5, Math.sin(angle) * radius, Math.cos(angle) * radius);
    cylGroup.rotation.x = 0;
    // orient radially — keep axial alignment
    thrustGroup.add(cylGroup);
  }

  group.add(thrustGroup);
  meshes.thrustCylinders = thrustCylinders;

  // ═══════════════════════════════════════════════════════════════════
  // 4. SCREW CONVEYOR — Muck removal auger inside shield
  // ═══════════════════════════════════════════════════════════════════
  const screwConveyorGroup = new THREE.Group();

  // Screw conveyor casing (tube)
  const screwCasingGeo = new THREE.CylinderGeometry(0.45, 0.45, 8.0, 32, 1, true);
  const screwCasing = new THREE.Mesh(screwCasingGeo, grimeSteel);
  screwCasing.rotation.z = Math.PI / 2;
  screwCasing.position.set(1.0, -1.8, 0);
  screwConveyorGroup.add(screwCasing);

  // Helical screw (auger flights) — built from multiple tilted rings
  const screwFlightGroup = new THREE.Group();
  const flightSegments = 40;
  for (let f = 0; f < flightSegments; f++) {
    const flightGeo = new THREE.TorusGeometry(0.38, 0.04, 6, 16, Math.PI * 0.6);
    const flight = new THREE.Mesh(flightGeo, steel);
    flight.position.x = -3.5 + (f / flightSegments) * 7.5;
    flight.position.y = -1.8;
    flight.rotation.y = Math.PI / 2;
    flight.rotation.z = (f / flightSegments) * Math.PI * 12;
    screwFlightGroup.add(flight);
  }
  screwConveyorGroup.add(screwFlightGroup);
  meshes.screwFlight = screwFlightGroup;

  // Central shaft
  const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 8.2, 16);
  const shaft = new THREE.Mesh(shaftGeo, chrome);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.set(1.0, -1.8, 0);
  screwConveyorGroup.add(shaft);

  // Drive motor at rear
  const motorGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24);
  const motor = new THREE.Mesh(motorGeo, darkSteel);
  motor.rotation.z = Math.PI / 2;
  motor.position.set(-3.2, -1.8, 0);
  screwConveyorGroup.add(motor);

  // Motor neon indicator
  const motorGlowGeo = new THREE.TorusGeometry(0.36, 0.02, 8, 32);
  const motorGlow = new THREE.Mesh(motorGlowGeo, neonOrange);
  motorGlow.rotation.y = Math.PI / 2;
  motorGlow.position.set(-3.5, -1.8, 0);
  screwConveyorGroup.add(motorGlow);
  meshes.motorGlow = motorGlow;

  group.add(screwConveyorGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 5. CONVEYOR BELT — Running along bottom of TBM for muck transport
  // ═══════════════════════════════════════════════════════════════════
  const conveyorGroup = new THREE.Group();

  // Belt surface
  const beltGeo = new THREE.BoxGeometry(18, 0.06, 1.2);
  const belt = new THREE.Mesh(beltGeo, conveyorBelt);
  belt.position.set(-5, -2.8, 0);
  conveyorGroup.add(belt);
  meshes.conveyorBelt = belt;

  // Belt side guards
  for (let side = -1; side <= 1; side += 2) {
    const guardGeo = new THREE.BoxGeometry(18, 0.25, 0.04);
    const guard = new THREE.Mesh(guardGeo, darkSteel);
    guard.position.set(-5, -2.7, side * 0.62);
    conveyorGroup.add(guard);
  }

  // Rollers under belt
  for (let r = -13; r <= 3; r += 1.2) {
    const rollerGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.3, 12);
    const roller = new THREE.Mesh(rollerGeo, aluminum);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(r, -2.9, 0);
    conveyorGroup.add(roller);
  }

  // Drive drum (front)
  const drumFGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.3, 16);
  const drumF = new THREE.Mesh(drumFGeo, steel);
  drumF.rotation.x = Math.PI / 2;
  drumF.position.set(4.0, -2.8, 0);
  conveyorGroup.add(drumF);

  // Tail drum (rear)
  const drumRGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.3, 16);
  const drumR = new THREE.Mesh(drumRGeo, steel);
  drumR.rotation.x = Math.PI / 2;
  drumR.position.set(-14, -2.8, 0);
  conveyorGroup.add(drumR);

  // Belt tread cleats
  for (let c = -13; c <= 3; c += 0.5) {
    const cleatGeo = new THREE.BoxGeometry(0.04, 0.03, 1.15);
    const cleat = new THREE.Mesh(cleatGeo, rubber);
    cleat.position.set(c, -2.76, 0);
    conveyorGroup.add(cleat);
  }

  // Support frame
  const framePts = [
    [-14, -3.1], [-14, -2.5], [4, -2.5], [4, -3.1]
  ];
  framePts.forEach((p, i) => {
    const next = framePts[(i + 1) % framePts.length];
    const len = Math.sqrt((next[0] - p[0]) ** 2 + (next[1] - p[1]) ** 2);
    const frameGeo = new THREE.BoxGeometry(len, 0.05, 0.05);
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    frame.position.set((p[0] + next[0]) / 2, (p[1] + next[1]) / 2, 0.65);
    conveyorGroup.add(frame);
    const frame2 = frame.clone();
    frame2.position.z = -0.65;
    conveyorGroup.add(frame2);
  });

  group.add(conveyorGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 6. SEGMENT ERECTOR ARM — Picks up & places tunnel lining segments
  // ═══════════════════════════════════════════════════════════════════
  const erectorGroup = new THREE.Group();
  erectorGroup.position.set(-4.0, 0, 0);

  // Erector ring (rotates full 360°)
  const erectorRingGeo = new THREE.TorusGeometry(2.8, 0.15, 12, 64);
  const erectorRing = new THREE.Mesh(erectorRingGeo, steel);
  erectorRing.rotation.y = Math.PI / 2;
  erectorGroup.add(erectorRing);
  meshes.erectorRing = erectorRing;

  // Erector guide rails (two arcs)
  for (let side = -0.3; side <= 0.3; side += 0.6) {
    const railGeo = new THREE.TorusGeometry(2.65, 0.04, 8, 64);
    const rail = new THREE.Mesh(railGeo, chrome);
    rail.rotation.y = Math.PI / 2;
    rail.position.x = side;
    erectorGroup.add(rail);
  }

  // Erector arm (radial beam)
  const armGroup = new THREE.Group();

  const armBeamGeo = new THREE.BoxGeometry(0.2, 0.3, 2.4);
  const armBeam = new THREE.Mesh(armBeamGeo, warningYellow);
  armBeam.position.y = 1.4;
  armGroup.add(armBeam);

  // Vacuum pad / gripper head
  const gripperGeo = new THREE.BoxGeometry(0.8, 0.15, 1.2);
  const gripper = new THREE.Mesh(gripperGeo, darkSteel);
  gripper.position.y = 2.65;
  armGroup.add(gripper);

  // Suction cups
  for (let sc = -0.3; sc <= 0.3; sc += 0.3) {
    const cupGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.05, 16);
    const cup = new THREE.Mesh(cupGeo, rubber);
    cup.position.set(sc, 2.73, 0);
    armGroup.add(cup);
  }

  // Hydraulic cylinder on arm
  const armCylGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 12);
  const armCyl = new THREE.Mesh(armCylGeo, hydraulicRed);
  armCyl.position.set(0.2, 1.2, 0);
  armGroup.add(armCyl);

  const armRodGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
  const armRod = new THREE.Mesh(armRodGeo, chrome);
  armRod.position.set(0.2, 2.2, 0);
  armGroup.add(armRod);

  // Neon status strip on arm
  const armNeonGeo = new THREE.BoxGeometry(0.04, 2.0, 0.04);
  const armNeon = new THREE.Mesh(armNeonGeo, neonCyan);
  armNeon.position.set(-0.12, 1.4, 0.16);
  armGroup.add(armNeon);
  meshes.armNeon = armNeon;

  erectorGroup.add(armGroup);
  meshes.erectorArm = armGroup;

  // Placed tunnel segments (concrete ring visible behind)
  for (let seg = 0; seg < 6; seg++) {
    const segAngle = (seg / 6) * Math.PI * 2;
    const segGeo = new THREE.BoxGeometry(1.4, 0.25, 1.6);
    // Curved segment approximation
    const segMesh = new THREE.Mesh(segGeo, concreteGrey);
    segMesh.position.x = -2.5;
    segMesh.position.y = Math.sin(segAngle) * 2.95;
    segMesh.position.z = Math.cos(segAngle) * 2.95;
    segMesh.rotation.x = segAngle;
    erectorGroup.add(segMesh);
  }

  group.add(erectorGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 7. MAIN DRIVE — Electric motors + gearbox behind cutter head
  // ═══════════════════════════════════════════════════════════════════
  const driveGroup = new THREE.Group();
  driveGroup.position.set(4.5, 0, 0);

  // Main bearing housing
  const bearingGeo = new THREE.TorusGeometry(2.2, 0.35, 16, 48);
  const bearing = new THREE.Mesh(bearingGeo, darkSteel);
  bearing.rotation.y = Math.PI / 2;
  driveGroup.add(bearing);

  // Electric drive motors (8 around circumference)
  for (let m = 0; m < 8; m++) {
    const mAngle = (m / 8) * Math.PI * 2;
    const motorBodyGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.0, 16);
    const motorBody = new THREE.Mesh(motorBodyGeo, copper);
    motorBody.rotation.z = Math.PI / 2;
    motorBody.position.set(0.3, Math.sin(mAngle) * 1.6, Math.cos(mAngle) * 1.6);
    driveGroup.add(motorBody);

    // Motor end cap
    const endCapGeo = new THREE.CylinderGeometry(0.26, 0.22, 0.1, 16);
    const endCap = new THREE.Mesh(endCapGeo, aluminum);
    endCap.rotation.z = Math.PI / 2;
    endCap.position.set(-0.25, Math.sin(mAngle) * 1.6, Math.cos(mAngle) * 1.6);
    driveGroup.add(endCap);

    // Cooling fins
    for (let fin = 0; fin < 6; fin++) {
      const finGeo = new THREE.BoxGeometry(0.8, 0.02, 0.02);
      const finMesh = new THREE.Mesh(finGeo, aluminum);
      const finAngle = mAngle + (fin - 2.5) * 0.08;
      finMesh.position.set(0.3, Math.sin(finAngle) * 1.85, Math.cos(finAngle) * 1.85);
      driveGroup.add(finMesh);
    }
  }

  // Planetary gearbox visual
  const gearRingGeo = new THREE.TorusGeometry(1.0, 0.08, 8, 48);
  const gearRing = new THREE.Mesh(gearRingGeo, chrome);
  gearRing.rotation.y = Math.PI / 2;
  gearRing.position.x = -0.6;
  driveGroup.add(gearRing);

  // Sun gear indicator glow
  const sunGeo = new THREE.SphereGeometry(0.25, 24, 24);
  const sunGlow = new THREE.Mesh(sunGeo, plasmaCoreGlow);
  sunGlow.position.x = -0.6;
  driveGroup.add(sunGlow);
  meshes.sunGlow = sunGlow;

  group.add(driveGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 8. OPERATOR CABIN / CONTROL ROOM
  // ═══════════════════════════════════════════════════════════════════
  const cabinGroup = new THREE.Group();
  cabinGroup.position.set(-2.0, 1.5, 0);

  // Cabin body (smoothed box)
  const cabinGeo = new THREE.BoxGeometry(2.0, 1.4, 1.6);
  const cabin = new THREE.Mesh(cabinGeo, aluminum);
  cabinGroup.add(cabin);

  // Tinted windshield (front)
  const windshieldGeo = new THREE.BoxGeometry(0.05, 0.9, 1.3);
  const windshield = new THREE.Mesh(windshieldGeo, tinted);
  windshield.position.set(1.03, 0.15, 0);
  cabinGroup.add(windshield);

  // Side windows
  for (let ws = -1; ws <= 1; ws += 2) {
    const sideWinGeo = new THREE.BoxGeometry(1.2, 0.6, 0.05);
    const sideWin = new THREE.Mesh(sideWinGeo, tinted);
    sideWin.position.set(0.2, 0.2, ws * 0.83);
    cabinGroup.add(sideWin);
  }

  // Control console
  const consoleGeo = new THREE.BoxGeometry(0.6, 0.5, 1.0);
  const consoleMesh = new THREE.Mesh(consoleGeo, plastic);
  consoleMesh.position.set(0.5, -0.3, 0);
  cabinGroup.add(consoleMesh);

  // Monitor screens (3)
  for (let mon = -1; mon <= 1; mon++) {
    const monGeo = new THREE.BoxGeometry(0.03, 0.25, 0.35);
    const monitor = new THREE.Mesh(monGeo, new THREE.MeshStandardMaterial({
      color: 0x0044ff, emissive: 0x0022aa, emissiveIntensity: 0.8
    }));
    monitor.position.set(0.82, 0.1, mon * 0.38);
    cabinGroup.add(monitor);
  }

  // Cabin LED strip
  const ledStripGeo = new THREE.BoxGeometry(2.02, 0.03, 0.03);
  const ledStrip = new THREE.Mesh(ledStripGeo, neonCyan);
  ledStrip.position.y = 0.72;
  ledStrip.position.z = 0.8;
  cabinGroup.add(ledStrip);
  const ledStrip2 = ledStrip.clone();
  ledStrip2.position.z = -0.8;
  cabinGroup.add(ledStrip2);
  meshes.cabinLED = ledStrip;

  // Operator chair
  const chairGeo = new THREE.BoxGeometry(0.35, 0.5, 0.35);
  const chair = new THREE.Mesh(chairGeo, plastic);
  chair.position.set(-0.1, -0.35, 0);
  cabinGroup.add(chair);

  group.add(cabinGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 9. HYDRAULIC POWER PACK + CABLE BUNDLES
  // ═══════════════════════════════════════════════════════════════════
  const hppGroup = new THREE.Group();
  hppGroup.position.set(-8.0, 0.5, 1.5);

  // HPP tank
  const tankGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.0, 24);
  const tank = new THREE.Mesh(tankGeo, hydraulicRed);
  tank.rotation.z = Math.PI / 2;
  hppGroup.add(tank);

  // Pump motors
  for (let pm = -0.6; pm <= 0.6; pm += 0.6) {
    const pumpGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const pump = new THREE.Mesh(pumpGeo, darkSteel);
    pump.position.set(pm, 0.55, 0);
    hppGroup.add(pump);
  }

  // Hydraulic lines running along shield
  const lineCount = 6;
  for (let l = 0; l < lineCount; l++) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.0, 0, l * 0.12),
      new THREE.Vector3(4.0, -0.2, l * 0.1),
      new THREE.Vector3(8.0, -0.5, l * 0.08),
      new THREE.Vector3(11.5, -0.5 + l * 0.15, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.025, 8, false);
    const tube = new THREE.Mesh(tubeGeo, l % 2 === 0 ? hydraulicRed : cableBlack);
    hppGroup.add(tube);
  }

  group.add(hppGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 10. TAIL SKIN + GROUTING SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  const tailGroup = new THREE.Group();
  tailGroup.position.set(-7.5, 0, 0);

  // Grout injection pipes (around circumference)
  for (let g = 0; g < 12; g++) {
    const gAngle = (g / 12) * Math.PI * 2;
    const groutPipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
    const groutPipe = new THREE.Mesh(groutPipeGeo, copper);
    groutPipe.position.y = Math.sin(gAngle) * 3.0;
    groutPipe.position.z = Math.cos(gAngle) * 3.0;
    groutPipe.rotation.z = Math.PI / 2;
    tailGroup.add(groutPipe);

    // Nozzle
    const nozzleGeo = new THREE.ConeGeometry(0.06, 0.1, 8);
    const nozzle = new THREE.Mesh(nozzleGeo, chrome);
    nozzle.rotation.z = -Math.PI / 2;
    nozzle.position.set(0.8, Math.sin(gAngle) * 3.0, Math.cos(gAngle) * 3.0);
    tailGroup.add(nozzle);
  }

  group.add(tailGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 11. BACK-UP SYSTEM GANTRIES (trailing structure)
  // ═══════════════════════════════════════════════════════════════════
  const gantryGroup = new THREE.Group();

  // Gantry frames (3 trailing sections)
  for (let g = 0; g < 3; g++) {
    const gx = -10 - g * 5;

    // Vertical posts (4 corners)
    for (let px = -1; px <= 1; px += 2) {
      for (let pz = -1; pz <= 1; pz += 2) {
        const postGeo = new THREE.BoxGeometry(0.15, 4.5, 0.15);
        const post = new THREE.Mesh(postGeo, warningYellow);
        post.position.set(gx + px * 1.5, 0, pz * 1.5);
        gantryGroup.add(post);
      }
    }

    // Cross beams (top)
    const topBeamGeo = new THREE.BoxGeometry(3.0, 0.12, 0.12);
    const topBeam = new THREE.Mesh(topBeamGeo, warningYellow);
    topBeam.position.set(gx, 2.25, 1.5);
    gantryGroup.add(topBeam);
    const topBeam2 = topBeam.clone();
    topBeam2.position.z = -1.5;
    gantryGroup.add(topBeam2);

    // Cross beams (lateral)
    const latBeamGeo = new THREE.BoxGeometry(0.12, 0.12, 3.0);
    const latBeam = new THREE.Mesh(latBeamGeo, warningYellow);
    latBeam.position.set(gx + 1.5, 2.25, 0);
    gantryGroup.add(latBeam);
    const latBeam2 = latBeam.clone();
    latBeam2.position.x = gx - 1.5;
    gantryGroup.add(latBeam2);

    // Walkway platforms
    const walkGeo = new THREE.BoxGeometry(4.5, 0.06, 3.0);
    const walkway = new THREE.Mesh(walkGeo, grimeSteel);
    walkway.position.set(gx, -1.8, 0);
    gantryGroup.add(walkway);

    // Safety railings
    for (let side = -1; side <= 1; side += 2) {
      const railGeo = new THREE.BoxGeometry(4.5, 0.04, 0.04);
      const railing = new THREE.Mesh(railGeo, warningYellow);
      railing.position.set(gx, -1.0, side * 1.5);
      gantryGroup.add(railing);
    }

    // Equipment boxes on gantry
    if (g === 0) {
      // Electrical cabinet
      const cabinetGeo = new THREE.BoxGeometry(1.0, 1.5, 0.8);
      const cabinet = new THREE.Mesh(cabinetGeo, darkSteel);
      cabinet.position.set(gx, 0.5, 1.0);
      gantryGroup.add(cabinet);

      // Status light
      const statusGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const statusLight = new THREE.Mesh(statusGeo, neonGreen);
      statusLight.position.set(gx + 0.5, 1.3, 1.0);
      gantryGroup.add(statusLight);
      meshes.statusLight = statusLight;
    }

    if (g === 1) {
      // Transformer
      const trafoGeo = new THREE.BoxGeometry(1.2, 1.0, 1.0);
      const trafo = new THREE.Mesh(trafoGeo, copper);
      trafo.position.set(gx, 0.3, -0.8);
      gantryGroup.add(trafo);
    }

    if (g === 2) {
      // Ventilation fan unit
      const ventHousingGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 24);
      const ventHousing = new THREE.Mesh(ventHousingGeo, aluminum);
      ventHousing.position.set(gx, 1.5, 0);
      gantryGroup.add(ventHousing);

      // Fan blades
      const fanGroup = new THREE.Group();
      for (let fb = 0; fb < 5; fb++) {
        const bladeAngle = (fb / 5) * Math.PI * 2;
        const bladeGeo = new THREE.BoxGeometry(0.08, 0.5, 0.02);
        const blade = new THREE.Mesh(bladeGeo, aluminum);
        blade.position.y = 0.25;
        blade.rotation.z = bladeAngle;
        blade.position.x = Math.sin(bladeAngle) * 0.25;
        blade.position.y = Math.cos(bladeAngle) * 0.25;
        fanGroup.add(blade);
      }
      fanGroup.position.set(gx, 1.5, 0);
      gantryGroup.add(fanGroup);
      meshes.fanBlades = fanGroup;
    }
  }

  group.add(gantryGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 12. LIGHTING SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  // Work lights on shield
  const lightPositions = [
    { x: 5, y: 2.5, z: 2.0 }, { x: 5, y: 2.5, z: -2.0 },
    { x: 2, y: 2.8, z: 1.5 }, { x: 2, y: 2.8, z: -1.5 },
    { x: -2, y: 3.0, z: 0 }
  ];
  const lightBulbs = [];
  lightPositions.forEach(lp => {
    const housingGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.2, 12);
    const housing = new THREE.Mesh(housingGeo, darkSteel);
    housing.position.set(lp.x, lp.y, lp.z);
    group.add(housing);

    const bulbGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const bulb = new THREE.Mesh(bulbGeo, new THREE.MeshStandardMaterial({
      color: 0xffffcc, emissive: 0xffff88, emissiveIntensity: 1.0
    }));
    bulb.position.set(lp.x, lp.y - 0.15, lp.z);
    group.add(bulb);
    lightBulbs.push(bulb);
  });
  meshes.lightBulbs = lightBulbs;

  // ═══════════════════════════════════════════════════════════════════
  // 13. LASER GUIDANCE SYSTEM (survey target & laser)
  // ═══════════════════════════════════════════════════════════════════
  const laserGroup = new THREE.Group();

  // Laser emitter housing
  const laserHousingGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16);
  const laserHousing = new THREE.Mesh(laserHousingGeo, darkSteel);
  laserHousing.rotation.z = Math.PI / 2;
  laserHousing.position.set(-6, 2.0, 0);
  laserGroup.add(laserHousing);

  // Laser beam (thin glowing line)
  const laserBeamGeo = new THREE.CylinderGeometry(0.008, 0.008, 20, 8);
  const laserBeam = new THREE.Mesh(laserBeamGeo, new THREE.MeshStandardMaterial({
    color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.6
  }));
  laserBeam.rotation.z = Math.PI / 2;
  laserBeam.position.set(4, 2.0, 0);
  laserGroup.add(laserBeam);
  meshes.laserBeam = laserBeam;

  // Target board
  const targetGeo = new THREE.CircleGeometry(0.15, 24);
  const target = new THREE.Mesh(targetGeo, new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xff4444, emissiveIntensity: 0.3
  }));
  target.rotation.y = Math.PI;
  target.position.set(-20, 2.0, 0);
  laserGroup.add(target);

  group.add(laserGroup);

  // ═══════════════════════════════════════════════════════════════════
  // 14. WIRE MESH PROTECTION & DETAILS
  // ═══════════════════════════════════════════════════════════════════
  // Access ladder
  const ladderGroup = new THREE.Group();
  for (let rung = 0; rung < 8; rung++) {
    const rungGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
    const rungMesh = new THREE.Mesh(rungGeo, warningYellow);
    rungMesh.rotation.x = Math.PI / 2;
    rungMesh.position.set(-1.0, -2.3 + rung * 0.55, 3.2);
    ladderGroup.add(rungMesh);
  }
  // Ladder rails
  for (let lr = -0.3; lr <= 0.3; lr += 0.6) {
    const railGeo = new THREE.BoxGeometry(0.03, 4.4, 0.03);
    const rail = new THREE.Mesh(railGeo, warningYellow);
    rail.position.set(-1.0, 0, 3.2 + lr * 0.15);
    ladderGroup.add(rail);
  }
  group.add(ladderGroup);

  // Emergency stop button
  const eStopGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16);
  const eStop = new THREE.Mesh(eStopGeo, new THREE.MeshStandardMaterial({
    color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5
  }));
  eStop.position.set(-1.5, 1.5, 0.83);
  group.add(eStop);

  // ═══════════════════════════════════════════════════════════════════
  // PARTS DEFINITION
  // ═══════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Cutter Head',
      description: 'Massive rotating disc face equipped with 40+ disc cutters that excavate rock and soil. The face is slightly domed for stability and features muck buckets to scoop excavated material.',
      material: 'Hardened tool steel with tungsten carbide inserts on disc cutters',
      function: 'Excavates the tunnel face by rotating against rock/soil under high thrust force, fragmenting material into manageable pieces',
      assemblyOrder: 1,
      connections: ['Main Drive', 'Thrust Cylinders', 'Shield Body'],
      failureEffect: 'Total excavation stoppage; disc cutters may need individual replacement via hyperbaric intervention',
      cascadeFailures: ['Screw Conveyor', 'Conveyor Belt'],
      originalPosition: { x: 7.5, y: 0, z: 0 },
      explodedPosition: { x: 14, y: 0, z: 0 }
    },
    {
      name: 'Shield Body',
      description: 'Cylindrical steel shell protecting the machine internals and workers from ground pressure. Features circumferential seams, longitudinal welds, and multiple sealing rings at the tail.',
      material: 'High-strength structural steel (S355J2) with welded plate construction',
      function: 'Provides structural support and ground pressure resistance; maintains tunnel profile during excavation',
      assemblyOrder: 2,
      connections: ['Cutter Head', 'Thrust Cylinders', 'Segment Erector', 'Tail Seals'],
      failureEffect: 'Ground collapse risk; water ingress; loss of face pressure control',
      cascadeFailures: ['All internal systems'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 5, z: 0 }
    },
    {
      name: 'Thrust Cylinders',
      description: '16 hydraulic rams arranged circumferentially that push against installed tunnel segments to advance the TBM forward. Each cylinder can be independently controlled for steering.',
      material: 'Chrome-plated high-pressure hydraulic cylinder with hardened steel barrel',
      function: 'Generates forward thrust (up to 80,000 kN total) to push cutter head into the ground; differential thrust enables steering',
      assemblyOrder: 3,
      connections: ['Shield Body', 'Hydraulic Power Pack', 'Tunnel Segments'],
      failureEffect: 'Loss of forward propulsion; inability to steer; potential shield jamming',
      cascadeFailures: ['Cutter Head (no advance)', 'Segment Erector (misalignment)'],
      originalPosition: { x: 3.5, y: 0, z: 0 },
      explodedPosition: { x: 3.5, y: -5, z: 4 }
    },
    {
      name: 'Screw Conveyor',
      description: 'Enclosed auger system that transports excavated muck from the pressurized cutter head chamber to the unpressurized rear. Features variable-speed helical flights and pressure-regulating gate.',
      material: 'Wear-resistant Hardox steel flights on alloy steel shaft',
      function: 'Removes excavated material while maintaining face pressure balance; regulates earth/slurry pressure at the tunnel face',
      assemblyOrder: 4,
      connections: ['Cutter Head Chamber', 'Conveyor Belt', 'Hydraulic Power Pack'],
      failureEffect: 'Muck buildup causes face pressure loss; potential blowout or settlement',
      cascadeFailures: ['Conveyor Belt', 'Face pressure system'],
      originalPosition: { x: 1.0, y: -1.8, z: 0 },
      explodedPosition: { x: 1.0, y: -6, z: -3 }
    },
    {
      name: 'Conveyor Belt',
      description: 'Continuous belt running the full length of the TBM and trailing gantries, transporting muck from the screw conveyor discharge to muck cars at the rear. Features cleated surface for incline operation.',
      material: 'Multi-ply reinforced rubber belt with steel cord, chrome steel rollers',
      function: 'Continuous horizontal transport of excavated muck rearward for removal from the tunnel',
      assemblyOrder: 5,
      connections: ['Screw Conveyor', 'Muck Cars', 'Back-up Gantries'],
      failureEffect: 'Muck accumulation; excavation must halt until belt is repaired',
      cascadeFailures: ['Screw Conveyor (backlog)'],
      originalPosition: { x: -5, y: -2.8, z: 0 },
      explodedPosition: { x: -5, y: -7, z: 0 }
    },
    {
      name: 'Segment Erector',
      description: 'Robotic arm system mounted on a rotating ring that picks up precast concrete segments and positions them precisely to form the tunnel lining ring. Uses vacuum grippers for secure handling.',
      material: 'High-strength steel arm with precision hydraulic actuators and rubber vacuum cups',
      function: 'Assembles precast concrete tunnel lining segments into complete rings behind the advancing shield',
      assemblyOrder: 6,
      connections: ['Shield Body', 'Thrust Cylinders', 'Hydraulic Power Pack', 'Grouting System'],
      failureEffect: 'Cannot install tunnel lining; excavation must stop; unsupported ground behind shield',
      cascadeFailures: ['Grouting System', 'Thrust Cylinders (no reaction surface)'],
      originalPosition: { x: -4, y: 0, z: 0 },
      explodedPosition: { x: -4, y: 6, z: 3 }
    },
    {
      name: 'Main Drive',
      description: '8 high-torque electric motors arranged around a planetary gearbox, driving the cutter head through a massive main bearing. Total power output exceeds 5,000 kW.',
      material: 'Copper windings, neodymium magnets, forged steel gears, precision roller bearing',
      function: 'Provides rotational power to the cutter head at controlled speed (1-5 RPM) and torque',
      assemblyOrder: 7,
      connections: ['Cutter Head', 'Electrical Cabinet', 'Cooling System'],
      failureEffect: 'Cutter head stops rotating; no excavation possible',
      cascadeFailures: ['Cutter Head', 'Screw Conveyor'],
      originalPosition: { x: 4.5, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 4, z: 0 }
    },
    {
      name: 'Hydraulic Power Pack',
      description: 'Central hydraulic power unit with high-pressure pumps, reservoir tank, filters, and control valves supplying all hydraulic actuators on the TBM.',
      material: 'Steel reservoir, variable-displacement axial piston pumps, high-pressure hoses',
      function: 'Generates and distributes hydraulic power (350+ bar) to thrust cylinders, erector, screw conveyor, and auxiliary systems',
      assemblyOrder: 8,
      connections: ['Thrust Cylinders', 'Segment Erector', 'Screw Conveyor'],
      failureEffect: 'Loss of all hydraulic functions; complete TBM shutdown',
      cascadeFailures: ['Thrust Cylinders', 'Segment Erector', 'Screw Conveyor'],
      originalPosition: { x: -8, y: 0.5, z: 1.5 },
      explodedPosition: { x: -8, y: 5, z: 5 }
    },
    {
      name: 'Laser Guidance System',
      description: 'Precision survey system using a rear-mounted laser projecting onto a target board, combined with automated total stations for real-time alignment monitoring.',
      material: 'Precision optical laser, photosensitive target, ruggedized electronics',
      function: 'Continuously monitors TBM position, attitude (pitch/yaw/roll) and guides steering corrections to maintain designed tunnel alignment',
      assemblyOrder: 9,
      connections: ['Control Cabin', 'Thrust Cylinders (steering feedback)'],
      failureEffect: 'Blind boring; risk of deviation from designed alignment; potential survey shutdown',
      cascadeFailures: ['Navigation accuracy'],
      originalPosition: { x: -6, y: 2.0, z: 0 },
      explodedPosition: { x: -6, y: 6, z: -3 }
    },
    {
      name: 'Operator Control Cabin',
      description: 'Pressurized, climate-controlled cabin with multi-screen monitoring consoles showing real-time data: face pressure, thrust, torque, alignment, ground conditions, and muck analysis.',
      material: 'Aluminum frame with tinted safety glass, ergonomic controls, LED displays',
      function: 'Central command center for TBM operation; operator monitors and controls all machine functions',
      assemblyOrder: 10,
      connections: ['All TBM systems via PLC network'],
      failureEffect: 'Loss of operator oversight; potential switch to emergency manual controls',
      cascadeFailures: ['Machine control (degraded mode)'],
      originalPosition: { x: -2, y: 1.5, z: 0 },
      explodedPosition: { x: -2, y: 7, z: 0 }
    },
    {
      name: 'Back-up Gantries',
      description: 'Trailing steel framework sections housing electrical transformers, ventilation fans, hydraulic units, segment storage, and worker amenities. Connected by rail to follow the TBM.',
      material: 'Structural steel frames with walkway grating, safety railings',
      function: 'Provides housing and support for all ancillary equipment; supplies power, ventilation, and materials to the TBM',
      assemblyOrder: 11,
      connections: ['All support systems', 'Rail system', 'Ventilation duct'],
      failureEffect: 'Loss of specific trailing support function; may require excavation pause',
      cascadeFailures: ['Ventilation', 'Power Supply'],
      originalPosition: { x: -15, y: 0, z: 0 },
      explodedPosition: { x: -22, y: 0, z: 0 }
    },
    {
      name: 'Grouting System',
      description: '12 grout injection pipes arranged around the tail shield, pumping cementitious grout into the annular gap between excavated ground and installed segments.',
      material: 'Copper injection pipes, stainless steel nozzles, high-pressure grout pumps',
      function: 'Fills the void between tunnel segments and surrounding ground to prevent settlement and provide structural support',
      assemblyOrder: 12,
      connections: ['Tail Shield', 'Segment Erector', 'Grout Mixing Plant'],
      failureEffect: 'Ground settlement above tunnel; water ingress through unfilled annulus',
      cascadeFailures: ['Tunnel lining stability'],
      originalPosition: { x: -7.5, y: 0, z: 0 },
      explodedPosition: { x: -7.5, y: -5, z: 5 }
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What is the primary function of the screw conveyor in an Earth Pressure Balance (EPB) TBM?',
      options: [
        'To cool the cutter head during operation',
        'To transport excavated muck while maintaining face pressure balance',
        'To inject grout behind tunnel segments',
        'To rotate the cutter head'
      ],
      correct: 1,
      explanation: 'The screw conveyor is critical to EPB operation — it removes excavated material from the pressurized cutting chamber while regulating the earth pressure at the tunnel face. The variable-speed auger acts as a pressure-controlling valve, preventing blowouts or settlement.',
      difficulty: 'medium'
    },
    {
      question: 'Why are the 16 thrust cylinders individually controllable rather than operated as a single unit?',
      options: [
        'To reduce energy consumption during boring',
        'To enable steering by applying differential thrust',
        'To allow partial operation during maintenance',
        'To distribute load evenly across the tunnel segments'
      ],
      correct: 1,
      explanation: 'Individual control of thrust cylinders enables the TBM to steer by applying more force on one side than the other. This differential thrust, guided by the laser guidance system, allows the operator to correct alignment and navigate curves along the designed tunnel path.',
      difficulty: 'medium'
    },
    {
      question: 'What would happen if the grouting system fails immediately after segment installation?',
      options: [
        'The cutter head would overheat',
        'The conveyor belt would jam',
        'Ground settlement could occur above the tunnel and water ingress through the annular gap',
        'The segment erector would malfunction'
      ],
      correct: 2,
      explanation: 'When the TBM shield advances past newly installed segments, an annular gap exists between the outer surface of the segments and the excavated ground. Without grout filling this void, the ground above can settle (causing surface damage), and groundwater can infiltrate the tunnel.',
      difficulty: 'hard'
    },
    {
      question: 'What is the purpose of the tail seals at the rear of the TBM shield?',
      options: [
        'To lubricate the cutter head bearings',
        'To prevent groundwater and grout from entering the shield interior',
        'To regulate air pressure inside the cabin',
        'To support the conveyor belt alignment'
      ],
      correct: 1,
      explanation: 'Multiple rows of wire-brush tail seals filled with grease create a water-tight barrier between the outside ground/grout and the pressurized interior of the TBM shield. Without these seals, water and grout would flood the machine interior.',
      difficulty: 'hard'
    },
    {
      question: 'How does the segment erector know the exact position and orientation for each concrete segment?',
      options: [
        'The operator manually guides each segment by visual inspection',
        'Pre-programmed coordinates from the laser guidance and survey system direct the erector',
        'Magnets in the segments attract them to the correct position',
        'The segments are identical and interchangeable regardless of position'
      ],
      correct: 1,
      explanation: 'The laser guidance system continuously tracks the TBM position and orientation. Combined with the design ring geometry, the control system calculates the exact placement coordinates for each segment (key, adjacent, and counter-key positions) and directs the erector hydraulics accordingly.',
      difficulty: 'hard'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════════════════════
  const description = `A modern Earth Pressure Balance (EPB) Tunnel Boring Machine (TBM) — one of the largest and most complex machines ever built. This full-face circular excavator bores tunnels from 3m to 19m diameter through virtually any ground condition. The rotating cutter head, studded with dozens of disc cutters, grinds through rock and soil while the screw conveyor maintains precise face pressure. Behind the shield, a robotic segment erector assembles precast concrete rings to form the permanent tunnel lining, while 16 individually controlled thrust cylinders push the entire machine forward. Trailing back-up gantries carry transformers, ventilation, hydraulic power packs, and segment supply systems — forming a mobile underground factory stretching over 100 meters. This model represents a ~6.5m diameter EPB TBM typical for metro railway construction.`;

  // ═══════════════════════════════════════════════════════════════════
  // ANIMATION
  // ═══════════════════════════════════════════════════════════════════
  function animate(time, speed, _meshes) {
    const t = time * speed;

    // 1. Cutter head rotation (slow, powerful — ~2 RPM)
    if (meshes.cutterHead) {
      meshes.cutterHead.rotation.x = t * 0.3;
    }

    // 2. Screw conveyor auger rotation
    if (meshes.screwFlight) {
      meshes.screwFlight.rotation.x = t * 1.5;
    }

    // 3. Segment erector arm oscillation (sweeping arc)
    if (meshes.erectorArm) {
      meshes.erectorArm.rotation.x = Math.sin(t * 0.2) * Math.PI * 0.3;
    }

    // 4. Erector ring slow rotation
    if (meshes.erectorRing) {
      meshes.erectorRing.rotation.x = t * 0.05;
    }

    // 5. Thrust cylinder piston pulsing (simulating advance stroke)
    if (meshes.thrustCylinders) {
      meshes.thrustCylinders.forEach((rod, i) => {
        const phase = (i / meshes.thrustCylinders.length) * Math.PI * 2;
        rod.position.x = 1.5 + Math.sin(t * 0.5 + phase) * 0.3;
      });
    }

    // 6. Neon ring pulsing (monitoring scanner effect)
    if (meshes.neonRing) {
      neonCyan.emissiveIntensity = 0.5 + Math.sin(t * 2.0) * 0.4;
      neonCyan.opacity = 0.7 + Math.sin(t * 2.0) * 0.25;
    }

    // 7. Secondary neon ring counter-pulse
    if (meshes.neonRing2) {
      neonGreen.emissiveIntensity = 0.4 + Math.cos(t * 2.5) * 0.3;
    }

    // 8. Motor glow pulsing
    if (meshes.motorGlow) {
      neonOrange.emissiveIntensity = 0.5 + Math.sin(t * 3.0) * 0.3;
    }

    // 9. Sun gear plasma core pulsing
    if (meshes.sunGlow) {
      plasmaCoreGlow.emissiveIntensity = 0.8 + Math.sin(t * 4.0) * 0.5;
      meshes.sunGlow.scale.setScalar(1.0 + Math.sin(t * 4.0) * 0.15);
    }

    // 10. Fan blade rotation
    if (meshes.fanBlades) {
      meshes.fanBlades.rotation.y = t * 8.0;
    }

    // 11. Laser beam flicker
    if (meshes.laserBeam) {
      meshes.laserBeam.material.opacity = 0.4 + Math.random() * 0.3;
    }

    // 12. Status light blink
    if (meshes.statusLight) {
      const blink = Math.sin(t * 3.0) > 0;
      meshes.statusLight.material.emissiveIntensity = blink ? 1.0 : 0.1;
    }

    // 13. Cabin LED strip flicker
    if (meshes.cabinLED) {
      meshes.cabinLED.material.emissiveIntensity = 0.6 + Math.sin(t * 5.0) * 0.3;
    }

    // 14. Work light slight intensity variation (simulating generator hum)
    if (meshes.lightBulbs) {
      meshes.lightBulbs.forEach((bulb, i) => {
        bulb.material.emissiveIntensity = 0.85 + Math.sin(t * 6.0 + i) * 0.15;
      });
    }

    // 15. Arm neon breathing
    if (meshes.armNeon) {
      meshes.armNeon.material.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.4;
    }

    // 16. Conveyor belt subtle vibration (simulating muck transport)
    if (meshes.conveyorBelt) {
      meshes.conveyorBelt.position.y = -2.8 + Math.sin(t * 12.0) * 0.005;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
