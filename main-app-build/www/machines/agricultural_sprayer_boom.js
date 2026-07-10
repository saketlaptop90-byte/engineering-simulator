import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ─── CUSTOM MATERIALS ────────────────────────────────────────────────
  const jdGreen = new THREE.MeshStandardMaterial({ color: 0x367c2b, metalness: 0.35, roughness: 0.45 });
  const jdYellow = new THREE.MeshStandardMaterial({ color: 0xffde00, metalness: 0.3, roughness: 0.4 });
  const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.9, transparent: true, opacity: 0.85 });
  const neonGreen = new THREE.MeshStandardMaterial({ color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 0.7, transparent: true, opacity: 0.8 });
  const neonAmber = new THREE.MeshStandardMaterial({ color: 0xffbf00, emissive: 0xffbf00, emissiveIntensity: 0.8, transparent: true, opacity: 0.75 });
  const solutionLiquid = new THREE.MeshStandardMaterial({ color: 0x44cc88, emissive: 0x22aa55, emissiveIntensity: 0.3, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  const sprayMist = new THREE.MeshStandardMaterial({ color: 0xaaffcc, emissive: 0x66ffaa, emissiveIntensity: 0.5, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  const headlightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeedd, emissiveIntensity: 1.2, transparent: true, opacity: 0.95 });
  const tailLightMat = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 0.9, transparent: true, opacity: 0.9 });
  const indicatorMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.7, transparent: true, opacity: 0.85 });
  const darkGray = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.6, roughness: 0.35 });
  const hydraulicRed = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.2, roughness: 0.6 });
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
  const gpsDomeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.4, roughness: 0.25, emissive: 0x334455, emissiveIntensity: 0.15 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.8 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.85, roughness: 0.15 });
  const hologramMat = new THREE.MeshStandardMaterial({ color: 0x00ccff, emissive: 0x0088ff, emissiveIntensity: 1.0, transparent: true, opacity: 0.15, wireframe: true });

  // ─── HELPER FUNCTIONS ────────────────────────────────────────────────
  function createTube(path, radius, segments, mat) {
    const curve = new THREE.CatmullRomCurve3(path.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.TubeGeometry(curve, segments || 20, radius || 0.03, 8, false);
    return new THREE.Mesh(geo, mat);
  }

  function createTallNarrowTire(x, y, z, scale = 1.0) {
    const tireGroup = new THREE.Group();
    // Tire body — tall, narrow
    const tireR = 1.1 * scale;
    const tubeR = 0.22 * scale;
    const tireGeo = new THREE.TorusGeometry(tireR, tubeR, 24, 48);
    const tireMesh = new THREE.Mesh(tireGeo, rubber);
    tireMesh.rotation.y = Math.PI / 2;
    tireGroup.add(tireMesh);

    // Deep tread lugs — V-pattern like real ag tires
    const lugCount = 28;
    for (let i = 0; i < lugCount; i++) {
      const angle = (i / lugCount) * Math.PI * 2;
      const lugGeo = new THREE.BoxGeometry(0.04 * scale, 0.09 * scale, 0.18 * scale);
      const lug = new THREE.Mesh(lugGeo, rubber);
      const px = Math.cos(angle) * tireR;
      const py = Math.sin(angle) * tireR;
      lug.position.set(0, py, px);
      lug.rotation.x = angle;
      lug.rotation.z = 0.35 * (i % 2 === 0 ? 1 : -1); // V-pattern
      tireGroup.add(lug);

      // secondary lug for depth
      const lug2 = lug.clone();
      lug2.position.set(0.06 * scale * (i % 2 === 0 ? 1 : -1), py, px);
      lug2.scale.set(0.8, 0.7, 0.6);
      tireGroup.add(lug2);
    }

    // Sidewall lettering ridges
    for (let s = 0; s < 12; s++) {
      const ang = (s / 12) * Math.PI * 2;
      const ridgeGeo = new THREE.BoxGeometry(0.02 * scale, 0.03 * scale, 0.06 * scale);
      const ridge = new THREE.Mesh(ridgeGeo, rubber);
      ridge.position.set(tubeR * 0.95, Math.sin(ang) * (tireR * 0.92), Math.cos(ang) * (tireR * 0.92));
      ridge.rotation.x = ang;
      tireGroup.add(ridge);
    }

    // Rim — multi-spoke
    const rimOuter = new THREE.TorusGeometry(tireR * 0.6, 0.04 * scale, 8, 36);
    const rimMesh = new THREE.Mesh(rimOuter, rimMat);
    rimMesh.rotation.y = Math.PI / 2;
    tireGroup.add(rimMesh);

    const rimHub = new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.12 * scale, 16);
    const hubMesh = new THREE.Mesh(rimHub, chrome);
    hubMesh.rotation.z = Math.PI / 2;
    tireGroup.add(hubMesh);

    // Spokes
    const spokeCount = 8;
    for (let i = 0; i < spokeCount; i++) {
      const ang = (i / spokeCount) * Math.PI * 2;
      const spokeGeo = new THREE.BoxGeometry(0.06 * scale, 0.03 * scale, tireR * 0.5);
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      spoke.position.set(0, Math.sin(ang) * tireR * 0.3, Math.cos(ang) * tireR * 0.3);
      spoke.rotation.x = ang;
      tireGroup.add(spoke);
    }

    // Hub bolts
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const boltGeo = new THREE.CylinderGeometry(0.025 * scale, 0.025 * scale, 0.14 * scale, 6);
      const bolt = new THREE.Mesh(boltGeo, chrome);
      bolt.rotation.z = Math.PI / 2;
      bolt.position.set(0, Math.sin(ang) * 0.09 * scale, Math.cos(ang) * 0.09 * scale);
      tireGroup.add(bolt);
    }

    tireGroup.position.set(x, y, z);
    return tireGroup;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  CHASSIS — Elevated frame for crop clearance
  // ═══════════════════════════════════════════════════════════════════════
  const chassisGroup = new THREE.Group();

  // Main frame rails — long and narrow
  const frameRailGeo = new THREE.BoxGeometry(0.15, 0.12, 5.5);
  const frameL = new THREE.Mesh(frameRailGeo, darkSteel);
  frameL.position.set(-0.65, 2.0, 0);
  chassisGroup.add(frameL);
  const frameR = new THREE.Mesh(frameRailGeo, darkSteel);
  frameR.position.set(0.65, 2.0, 0);
  chassisGroup.add(frameR);

  // Cross members
  for (let i = -2; i <= 2; i++) {
    const crossGeo = new THREE.BoxGeometry(1.45, 0.08, 0.1);
    const cross = new THREE.Mesh(crossGeo, darkSteel);
    cross.position.set(0, 1.96, i * 1.1);
    chassisGroup.add(cross);
  }

  // Under-frame protection plates
  const skidGeo = new THREE.BoxGeometry(1.5, 0.04, 4.8);
  const skid = new THREE.Mesh(skidGeo, darkGray);
  skid.position.set(0, 1.9, 0);
  chassisGroup.add(skid);

  group.add(chassisGroup);
  meshes.chassis = chassisGroup;

  // ═══════════════════════════════════════════════════════════════════════
  //  TALL NARROW TIRES (4) — Crop clearance wheels on stilts
  // ═══════════════════════════════════════════════════════════════════════
  const wheelGroup = new THREE.Group();

  // Wheel stalks/legs — tall uprights to elevate the chassis
  function createWheelLeg(x, z) {
    const legGroup = new THREE.Group();
    // Main upright
    const uprightGeo = new THREE.BoxGeometry(0.12, 2.2, 0.12);
    const upright = new THREE.Mesh(uprightGeo, darkSteel);
    upright.position.set(x, 1.0, z);
    legGroup.add(upright);

    // Diagonal brace
    const braceGeo = new THREE.BoxGeometry(0.06, 1.6, 0.06);
    const brace = new THREE.Mesh(braceGeo, steel);
    brace.position.set(x + (x > 0 ? -0.15 : 0.15), 1.2, z);
    brace.rotation.z = (x > 0 ? 0.2 : -0.2);
    legGroup.add(brace);

    // Axle housing
    const axleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 12);
    const axle = new THREE.Mesh(axleGeo, chrome);
    axle.rotation.z = Math.PI / 2;
    axle.position.set(x, 1.1, z);
    legGroup.add(axle);

    // Hydraulic steering cylinder
    const hydCylGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
    const hydCyl = new THREE.Mesh(hydCylGeo, hydraulicRed);
    hydCyl.rotation.x = 0.4;
    hydCyl.position.set(x + (x > 0 ? -0.1 : 0.1), 0.6, z + 0.15);
    legGroup.add(hydCyl);

    return legGroup;
  }

  // Front wheels
  const flLeg = createWheelLeg(-1.1, 1.8);
  wheelGroup.add(flLeg);
  const frLeg = createWheelLeg(1.1, 1.8);
  wheelGroup.add(frLeg);
  // Rear wheels
  const rlLeg = createWheelLeg(-1.1, -1.8);
  wheelGroup.add(rlLeg);
  const rrLeg = createWheelLeg(1.1, -1.8);
  wheelGroup.add(rrLeg);

  // Tires
  const fl = createTallNarrowTire(-1.3, 1.1, 1.8);
  wheelGroup.add(fl);
  meshes.wheelFL = fl;
  const fr = createTallNarrowTire(1.3, 1.1, 1.8);
  wheelGroup.add(fr);
  meshes.wheelFR = fr;
  const rl = createTallNarrowTire(-1.3, 1.1, -1.8);
  wheelGroup.add(rl);
  meshes.wheelRL = rl;
  const rr = createTallNarrowTire(1.3, 1.1, -1.8);
  wheelGroup.add(rr);
  meshes.wheelRR = rr;

  group.add(wheelGroup);

  // ═══════════════════════════════════════════════════════════════════════
  //  SOLUTION TANK — Large poly tank behind cab
  // ═══════════════════════════════════════════════════════════════════════
  const tankGroup = new THREE.Group();

  // Main tank body — rounded shape using LatheGeometry
  const tankProfile = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const y = t * 2.2;
    let r;
    if (t < 0.1) r = 0.3 + t * 7.0; // bottom taper
    else if (t < 0.85) r = 1.0; // main body
    else r = 1.0 - (t - 0.85) * 5.0; // top taper
    r = Math.max(r, 0.15);
    tankProfile.push(new THREE.Vector2(r, y));
  }
  const tankGeo = new THREE.LatheGeometry(tankProfile, 32);
  const tankBody = new THREE.Mesh(tankGeo, jdGreen);
  tankBody.position.set(0, 1.7, -0.8);
  tankGroup.add(tankBody);
  meshes.tank = tankBody;

  // Tank fill cap
  const capGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.1, 16);
  const cap = new THREE.Mesh(capGeo, darkGray);
  cap.position.set(0, 4.05, -0.8);
  tankGroup.add(cap);

  // Tank level indicator strip — glowing
  const indicatorGeo = new THREE.BoxGeometry(0.06, 1.8, 0.06);
  const indicator = new THREE.Mesh(indicatorGeo, neonCyan);
  indicator.position.set(1.02, 2.9, -0.8);
  tankGroup.add(indicator);
  meshes.tankLevel = indicator;

  // Tank bands/straps
  for (let i = 0; i < 3; i++) {
    const bandGeo = new THREE.TorusGeometry(1.02, 0.03, 6, 32);
    const band = new THREE.Mesh(bandGeo, jdYellow);
    band.position.set(0, 2.2 + i * 0.7, -0.8);
    tankGroup.add(band);
  }

  // Solution liquid inside (transparent)
  const liquidProfile = tankProfile.map(p => new THREE.Vector2(p.x * 0.92, p.y * 0.7));
  const liquidGeo = new THREE.LatheGeometry(liquidProfile, 24);
  const liquid = new THREE.Mesh(liquidGeo, solutionLiquid);
  liquid.position.set(0, 1.75, -0.8);
  tankGroup.add(liquid);
  meshes.liquid = liquid;

  // Drain valve at bottom
  const valveGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.15, 8);
  const valve = new THREE.Mesh(valveGeo, chrome);
  valve.position.set(0.3, 1.75, -0.8);
  valve.rotation.z = Math.PI / 2;
  tankGroup.add(valve);

  // Tank plumbing — outlet pipes
  const outPipe = createTube([[0, 1.8, -0.8], [0, 1.5, -0.8], [0, 1.5, 0.5]], 0.05, 16, pipeMat);
  tankGroup.add(outPipe);

  group.add(tankGroup);

  // ═══════════════════════════════════════════════════════════════════════
  //  PUMP SYSTEM — Between tank and boom
  // ═══════════════════════════════════════════════════════════════════════
  const pumpGroup = new THREE.Group();

  // Main centrifugal pump housing
  const pumpBodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.45, 16);
  const pumpBody = new THREE.Mesh(pumpBodyGeo, chrome);
  pumpBody.rotation.z = Math.PI / 2;
  pumpBody.position.set(0, 1.7, 0.6);
  pumpGroup.add(pumpBody);
  meshes.pump = pumpBody;

  // Pump motor
  const motorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 12);
  const motor = new THREE.Mesh(motorGeo, darkGray);
  motor.rotation.z = Math.PI / 2;
  motor.position.set(0.45, 1.7, 0.6);
  pumpGroup.add(motor);

  // Pump flanges
  for (let s = -1; s <= 1; s += 2) {
    const flangeGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.03, 16);
    const flange = new THREE.Mesh(flangeGeo, steel);
    flange.rotation.z = Math.PI / 2;
    flange.position.set(s * 0.24, 1.7, 0.6);
    pumpGroup.add(flange);
  }

  // Pressure gauge
  const gaugeGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const gauge = new THREE.Mesh(gaugeGeo, neonAmber);
  gauge.position.set(0, 1.95, 0.6);
  pumpGroup.add(gauge);
  meshes.gauge = gauge;

  // Filter housing
  const filterGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12);
  const filterH = new THREE.Mesh(filterGeo, aluminum);
  filterH.position.set(-0.3, 1.7, 0.4);
  pumpGroup.add(filterH);

  group.add(pumpGroup);

  // ═══════════════════════════════════════════════════════════════════════
  //  ELEVATED CAB — Forward-mounted with full visibility
  // ═══════════════════════════════════════════════════════════════════════
  const cabGroup = new THREE.Group();

  // Cab floor platform
  const cabFloorGeo = new THREE.BoxGeometry(1.6, 0.06, 1.6);
  const cabFloor = new THREE.Mesh(cabFloorGeo, darkGray);
  cabFloor.position.set(0, 2.75, 2.2);
  cabGroup.add(cabFloor);

  // Cab frame — rounded pillars
  const pillarPositions = [
    [-0.7, 2.75, 1.5], [0.7, 2.75, 1.5],
    [-0.7, 2.75, 2.9], [0.7, 2.75, 2.9]
  ];
  pillarPositions.forEach(([px, py, pz]) => {
    const pilGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8);
    const pil = new THREE.Mesh(pilGeo, darkGray);
    pil.position.set(px, py + 0.8, pz);
    cabGroup.add(pil);
  });

  // Cab roof
  const roofGeo = new THREE.BoxGeometry(1.7, 0.06, 1.7);
  const roof = new THREE.Mesh(roofGeo, jdGreen);
  roof.position.set(0, 3.6, 2.2);
  cabGroup.add(roof);

  // Roof overhang / sunvisor
  const visorGeo = new THREE.BoxGeometry(1.8, 0.04, 0.3);
  const visor = new THREE.Mesh(visorGeo, jdGreen);
  visor.position.set(0, 3.58, 3.15);
  cabGroup.add(visor);

  // Glass panels — front, sides, rear (tinted)
  // Front windshield — curved
  const windshieldGeo = new THREE.BoxGeometry(1.35, 1.2, 0.03);
  const windshield = new THREE.Mesh(windshieldGeo, tinted);
  windshield.position.set(0, 3.2, 2.95);
  cabGroup.add(windshield);

  // Side windows
  for (let s = -1; s <= 1; s += 2) {
    const sideGeo = new THREE.BoxGeometry(0.03, 1.0, 1.3);
    const sideWin = new THREE.Mesh(sideGeo, tinted);
    sideWin.position.set(s * 0.78, 3.2, 2.2);
    cabGroup.add(sideWin);
  }

  // Rear window
  const rearWinGeo = new THREE.BoxGeometry(1.35, 0.9, 0.03);
  const rearWin = new THREE.Mesh(rearWinGeo, tinted);
  rearWin.position.set(0, 3.15, 1.45);
  cabGroup.add(rearWin);

  // Cab interior — seat
  const seatBaseGeo = new THREE.BoxGeometry(0.45, 0.08, 0.45);
  const seatBase = new THREE.Mesh(seatBaseGeo, seatMat);
  seatBase.position.set(0, 2.85, 2.15);
  cabGroup.add(seatBase);
  const seatBackGeo = new THREE.BoxGeometry(0.45, 0.55, 0.08);
  const seatBack = new THREE.Mesh(seatBackGeo, seatMat);
  seatBack.position.set(0, 3.1, 1.92);
  cabGroup.add(seatBack);

  // Steering column & wheel
  const stColGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8);
  const stCol = new THREE.Mesh(stColGeo, darkGray);
  stCol.rotation.x = -0.6;
  stCol.position.set(0, 3.0, 2.55);
  cabGroup.add(stCol);
  const stWheelGeo = new THREE.TorusGeometry(0.14, 0.015, 8, 24);
  const stWheel = new THREE.Mesh(stWheelGeo, darkGray);
  stWheel.rotation.x = -0.6 + Math.PI / 2;
  stWheel.position.set(0, 3.15, 2.72);
  cabGroup.add(stWheel);

  // Dashboard with neon instruments
  const dashGeo = new THREE.BoxGeometry(1.2, 0.3, 0.08);
  const dash = new THREE.Mesh(dashGeo, darkGray);
  dash.position.set(0, 2.92, 2.85);
  cabGroup.add(dash);

  // Instrument screens
  for (let i = -1; i <= 1; i++) {
    const screenGeo = new THREE.PlaneGeometry(0.25, 0.18);
    const screen = new THREE.Mesh(screenGeo, neonCyan);
    screen.position.set(i * 0.3, 2.97, 2.86);
    cabGroup.add(screen);
  }
  meshes.cabScreens = cabGroup;

  // Access ladder/steps on left side
  for (let s = 0; s < 4; s++) {
    const stepGeo = new THREE.BoxGeometry(0.35, 0.04, 0.1);
    const step = new THREE.Mesh(stepGeo, steel);
    step.position.set(-0.85, 2.1 + s * 0.2, 2.5);
    cabGroup.add(step);
  }
  // Ladder rail
  const railGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.0, 6);
  const rail = new THREE.Mesh(railGeo, steel);
  rail.position.set(-0.95, 2.5, 2.5);
  cabGroup.add(rail);

  // Side mirrors
  for (let s = -1; s <= 1; s += 2) {
    const mirrorArmGeo = new THREE.BoxGeometry(0.4, 0.03, 0.03);
    const mirrorArm = new THREE.Mesh(mirrorArmGeo, darkGray);
    mirrorArm.position.set(s * 0.95, 3.3, 2.8);
    cabGroup.add(mirrorArm);
    const mirrorGeo = new THREE.BoxGeometry(0.12, 0.18, 0.02);
    const mirror = new THREE.Mesh(mirrorGeo, chrome);
    mirror.position.set(s * 1.15, 3.3, 2.8);
    cabGroup.add(mirror);
  }

  group.add(cabGroup);
  meshes.cab = cabGroup;

  // ═══════════════════════════════════════════════════════════════════════
  //  GPS GUIDANCE DOME — On cab roof
  // ═══════════════════════════════════════════════════════════════════════
  const gpsGroup = new THREE.Group();

  // Dome base
  const gpsBaseGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.08, 16);
  const gpsBase = new THREE.Mesh(gpsBaseGeo, darkGray);
  gpsBase.position.set(0, 3.68, 2.2);
  gpsGroup.add(gpsBase);

  // Dome sphere
  const gpsDomeGeo = new THREE.SphereGeometry(0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const gpsDome = new THREE.Mesh(gpsDomeGeo, gpsDomeMat);
  gpsDome.position.set(0, 3.72, 2.2);
  gpsGroup.add(gpsDome);
  meshes.gpsDome = gpsDome;

  // GPS antenna ring — glowing
  const gpsRingGeo = new THREE.TorusGeometry(0.16, 0.012, 8, 32);
  const gpsRing = new THREE.Mesh(gpsRingGeo, neonCyan);
  gpsRing.rotation.x = Math.PI / 2;
  gpsRing.position.set(0, 3.73, 2.2);
  gpsGroup.add(gpsRing);
  meshes.gpsRing = gpsRing;

  // GPS status LED
  const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const led = new THREE.Mesh(ledGeo, neonGreen);
  led.position.set(0.12, 3.7, 2.2);
  gpsGroup.add(led);
  meshes.gpsLed = led;

  // Holographic field scan visualization ring
  const holoRingGeo = new THREE.TorusGeometry(0.35, 0.005, 4, 64);
  const holoRing = new THREE.Mesh(holoRingGeo, hologramMat);
  holoRing.rotation.x = Math.PI / 2;
  holoRing.position.set(0, 3.85, 2.2);
  gpsGroup.add(holoRing);
  meshes.holoRing = holoRing;

  group.add(gpsGroup);

  // ═══════════════════════════════════════════════════════════════════════
  //  HEADLIGHTS & WORK LIGHTS
  // ═══════════════════════════════════════════════════════════════════════
  const lightsGroup = new THREE.Group();

  // Front headlights
  for (let s = -1; s <= 1; s += 2) {
    const hlGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const hl = new THREE.Mesh(hlGeo, headlightMat);
    hl.position.set(s * 0.6, 2.95, 3.0);
    lightsGroup.add(hl);

    // Light housing
    const housingGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.06, 12);
    const housing = new THREE.Mesh(housingGeo, darkGray);
    housing.rotation.x = Math.PI / 2;
    housing.position.set(s * 0.6, 2.95, 2.97);
    lightsGroup.add(housing);
  }
  meshes.headlights = lightsGroup;

  // Roof work lights (4 on top)
  for (let i = -1.5; i <= 1.5; i += 1) {
    const wlGeo = new THREE.BoxGeometry(0.12, 0.06, 0.05);
    const wl = new THREE.Mesh(wlGeo, headlightMat);
    wl.position.set(i * 0.35, 3.65, 3.0);
    lightsGroup.add(wl);
  }

  // Rear tail lights
  for (let s = -1; s <= 1; s += 2) {
    const tlGeo = new THREE.BoxGeometry(0.12, 0.08, 0.04);
    const tl = new THREE.Mesh(tlGeo, tailLightMat);
    tl.position.set(s * 0.65, 2.6, -2.7);
    lightsGroup.add(tl);

    // Turn indicators
    const indGeo = new THREE.BoxGeometry(0.08, 0.06, 0.04);
    const ind = new THREE.Mesh(indGeo, indicatorMat);
    ind.position.set(s * 0.65, 2.5, -2.7);
    lightsGroup.add(ind);
  }

  // Boom end lights — neon warning
  meshes.boomEndLights = [];

  group.add(lightsGroup);

  // ═══════════════════════════════════════════════════════════════════════
  //  ENGINE COMPARTMENT — Under the tank/chassis
  // ═══════════════════════════════════════════════════════════════════════
  const engineGroup = new THREE.Group();

  // Engine block
  const engBlockGeo = new THREE.BoxGeometry(0.8, 0.5, 1.2);
  const engBlock = new THREE.Mesh(engBlockGeo, darkGray);
  engBlock.position.set(0, 2.3, -2.0);
  engineGroup.add(engBlock);

  // Exhaust stack
  const exhaustGeo = new THREE.CylinderGeometry(0.05, 0.06, 1.5, 12);
  const exhaust = new THREE.Mesh(exhaustGeo, steel);
  exhaust.position.set(0.5, 3.2, -1.8);
  engineGroup.add(exhaust);
  meshes.exhaust = exhaust;

  // Exhaust cap
  const exCapGeo = new THREE.CylinderGeometry(0.07, 0.05, 0.08, 12);
  const exCap = new THREE.Mesh(exCapGeo, darkGray);
  exCap.position.set(0.5, 3.98, -1.8);
  engineGroup.add(exCap);

  // Radiator grille
  const grilleGeo = new THREE.BoxGeometry(0.7, 0.45, 0.04);
  const grille = new THREE.Mesh(grilleGeo, darkGray);
  grille.position.set(0, 2.35, -2.65);
  engineGroup.add(grille);

  // Grille slats
  for (let i = 0; i < 6; i++) {
    const slatGeo = new THREE.BoxGeometry(0.6, 0.02, 0.05);
    const slat = new THREE.Mesh(slatGeo, jdGreen);
    slat.position.set(0, 2.15 + i * 0.07, -2.64);
    engineGroup.add(slat);
  }

  // Cooling fan behind grille
  const fanHub = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8);
  const fanHubMesh = new THREE.Mesh(fanHub, chrome);
  fanHubMesh.rotation.x = Math.PI / 2;
  fanHubMesh.position.set(0, 2.35, -2.55);
  engineGroup.add(fanHubMesh);

  const fanGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const bladeGeo = new THREE.BoxGeometry(0.25, 0.06, 0.01);
    const blade = new THREE.Mesh(bladeGeo, aluminum);
    const ang = (i / 6) * Math.PI * 2;
    blade.position.set(Math.cos(ang) * 0.15, Math.sin(ang) * 0.15, 0);
    blade.rotation.z = ang + 0.3;
    fanGroup.add(blade);
  }
  fanGroup.position.set(0, 2.35, -2.5);
  fanGroup.rotation.x = Math.PI / 2;
  engineGroup.add(fanGroup);
  meshes.fan = fanGroup;

  // Engine hood panels
  const hoodGeo = new THREE.BoxGeometry(1.0, 0.04, 1.4);
  const hood = new THREE.Mesh(hoodGeo, jdGreen);
  hood.position.set(0, 2.58, -2.0);
  engineGroup.add(hood);

  // Side panels with vents
  for (let s = -1; s <= 1; s += 2) {
    const panelGeo = new THREE.BoxGeometry(0.04, 0.45, 1.3);
    const panel = new THREE.Mesh(panelGeo, jdGreen);
    panel.position.set(s * 0.52, 2.35, -2.0);
    engineGroup.add(panel);

    // Vent slashes
    for (let v = 0; v < 5; v++) {
      const ventGeo = new THREE.BoxGeometry(0.05, 0.04, 0.15);
      const vent = new THREE.Mesh(ventGeo, darkGray);
      vent.position.set(s * 0.535, 2.2 + v * 0.08, -1.8);
      engineGroup.add(vent);
    }
  }

  group.add(engineGroup);

  // ═══════════════════════════════════════════════════════════════════════
  //  SPRAY BOOM SYSTEM — Wide folding boom arms with nozzles
  // ═══════════════════════════════════════════════════════════════════════
  const boomGroup = new THREE.Group();

  // Center boom section (fixed to chassis)
  const centerBoomGeo = new THREE.BoxGeometry(2.0, 0.12, 0.1);
  const centerBoom = new THREE.Mesh(centerBoomGeo, jdYellow);
  centerBoom.position.set(0, 2.1, 0.3);
  boomGroup.add(centerBoom);

  // Center boom truss reinforcement
  const trussGeo = new THREE.BoxGeometry(1.8, 0.06, 0.06);
  const truss = new THREE.Mesh(trussGeo, steel);
  truss.position.set(0, 2.18, 0.3);
  boomGroup.add(truss);

  // Boom breakaway cradle
  const cradleGeo = new THREE.BoxGeometry(0.25, 0.2, 0.2);
  for (let s = -1; s <= 1; s += 2) {
    const cradle = new THREE.Mesh(cradleGeo, darkSteel);
    cradle.position.set(s * 0.95, 2.1, 0.3);
    boomGroup.add(cradle);
  }

  // ─── LEFT BOOM ARM (3 sections — inner, mid, outer) ────────────────
  function createBoomArm(side) {
    const armGroup = new THREE.Group();
    const sign = side === 'left' ? -1 : 1;

    // Inner section
    const innerGeo = new THREE.BoxGeometry(2.5, 0.1, 0.08);
    const inner = new THREE.Mesh(innerGeo, jdYellow);
    inner.position.set(sign * 2.3, 0, 0);
    armGroup.add(inner);

    // Inner truss
    for (let t = 0; t < 4; t++) {
      const tGeo = new THREE.BoxGeometry(0.03, 0.15, 0.03);
      const tMesh = new THREE.Mesh(tGeo, steel);
      tMesh.position.set(sign * (1.3 + t * 0.6), 0.06, 0);
      tMesh.rotation.z = sign * 0.3 * (t % 2 === 0 ? 1 : -1);
      armGroup.add(tMesh);
    }

    // Fold hinge joint
    const hingeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12);
    const hinge = new THREE.Mesh(hingeGeo, chrome);
    hinge.position.set(sign * 3.55, 0, 0);
    armGroup.add(hinge);

    // Hydraulic fold cylinder
    const foldCylGeo = new THREE.CylinderGeometry(0.035, 0.03, 0.8, 8);
    const foldCyl = new THREE.Mesh(foldCylGeo, hydraulicRed);
    foldCyl.rotation.z = sign * 0.4;
    foldCyl.position.set(sign * 2.8, 0.25, 0);
    armGroup.add(foldCyl);

    // Mid section
    const midGeo = new THREE.BoxGeometry(2.2, 0.09, 0.07);
    const mid = new THREE.Mesh(midGeo, jdYellow);
    mid.position.set(sign * 4.7, 0, 0);
    armGroup.add(mid);

    // Outer hinge
    const hinge2Geo = new THREE.CylinderGeometry(0.05, 0.05, 0.13, 10);
    const hinge2 = new THREE.Mesh(hinge2Geo, chrome);
    hinge2.position.set(sign * 5.85, 0, 0);
    armGroup.add(hinge2);

    // Outer section
    const outerGeo = new THREE.BoxGeometry(2.0, 0.08, 0.06);
    const outer = new THREE.Mesh(outerGeo, jdYellow);
    outer.position.set(sign * 6.9, 0, 0);
    armGroup.add(outer);

    // Boom support cables (TubeGeometry)
    const cable = createTube(
      [[sign * 1.0, 0.6, 0], [sign * 3.5, 0.15, 0], [sign * 5.5, 0.1, 0], [sign * 7.5, 0.05, 0]],
      0.012, 24, steel
    );
    armGroup.add(cable);

    // Supply plumbing along boom
    const supplyPipe = createTube(
      [[sign * 1.0, -0.08, 0.05], [sign * 3.5, -0.08, 0.05], [sign * 5.5, -0.08, 0.05], [sign * 7.8, -0.08, 0.05]],
      0.025, 32, pipeMat
    );
    armGroup.add(supplyPipe);

    // ─── SPRAY NOZZLES — every ~0.8m along boom ────────────────
    const nozzles = [];
    const nozzleSpacing = 0.8;
    const nozzleCount = 9;
    for (let n = 0; n < nozzleCount; n++) {
      const nx = sign * (1.2 + n * nozzleSpacing);
      const nozzGroup = new THREE.Group();

      // Nozzle body
      const nBodyGeo = new THREE.CylinderGeometry(0.02, 0.035, 0.12, 8);
      const nBody = new THREE.Mesh(nBodyGeo, plastic);
      nBody.position.set(0, -0.12, 0);
      nozzGroup.add(nBody);

      // Nozzle tip — color coded (flat fan pattern)
      const tipGeo = new THREE.CylinderGeometry(0.015, 0.025, 0.04, 8);
      const tipMat = n % 3 === 0 ? neonGreen : n % 3 === 1 ? neonCyan : neonAmber;
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(0, -0.2, 0);
      nozzGroup.add(tip);

      // Nozzle mount bracket
      const bracketGeo = new THREE.BoxGeometry(0.06, 0.04, 0.04);
      const bracket = new THREE.Mesh(bracketGeo, steel);
      bracket.position.set(0, -0.04, 0);
      nozzGroup.add(bracket);

      // Spray cone (visible spray pattern)
      const sprayGeo = new THREE.ConeGeometry(0.15, 0.5, 8, 1, true);
      const spray = new THREE.Mesh(sprayGeo, sprayMist);
      spray.position.set(0, -0.5, 0);
      nozzGroup.add(spray);

      nozzGroup.position.set(nx, 0, 0);
      armGroup.add(nozzGroup);
      nozzles.push(spray);
    }

    // End-of-boom warning light
    const endLightGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const endLight = new THREE.Mesh(endLightGeo, neonAmber);
    endLight.position.set(sign * 7.9, 0, 0);
    armGroup.add(endLight);
    meshes.boomEndLights.push(endLight);

    // Breakaway spring
    const springGeo = new THREE.TorusGeometry(0.04, 0.008, 8, 16, Math.PI);
    const spring = new THREE.Mesh(springGeo, chrome);
    spring.position.set(sign * 7.7, 0.08, 0);
    spring.rotation.y = Math.PI / 2;
    armGroup.add(spring);

    armGroup.position.set(0, 2.1, 0.3);
    return { armGroup, nozzles };
  }

  const leftBoom = createBoomArm('left');
  boomGroup.add(leftBoom.armGroup);
  meshes.leftBoom = leftBoom.armGroup;

  const rightBoom = createBoomArm('right');
  boomGroup.add(rightBoom.armGroup);
  meshes.rightBoom = rightBoom.armGroup;

  meshes.leftNozzles = leftBoom.nozzles;
  meshes.rightNozzles = rightBoom.nozzles;

  // Boom lift cylinders (from chassis to center boom)
  for (let s = -1; s <= 1; s += 2) {
    const liftCylBody = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
    const liftCyl = new THREE.Mesh(liftCylBody, hydraulicRed);
    liftCyl.position.set(s * 0.4, 2.3, 0.3);
    liftCyl.rotation.z = s * 0.3;
    boomGroup.add(liftCyl);

    // Piston rod
    const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6);
    const rod = new THREE.Mesh(rodGeo, chrome);
    rod.position.set(s * 0.55, 2.55, 0.3);
    rod.rotation.z = s * 0.3;
    boomGroup.add(rod);
  }

  group.add(boomGroup);
  meshes.boom = boomGroup;

  // ═══════════════════════════════════════════════════════════════════════
  //  HYDRAULIC LINES — Visible plumbing across machine
  // ═══════════════════════════════════════════════════════════════════════
  const hydGroup = new THREE.Group();

  // Tank to pump
  const tankToPump = createTube(
    [[0, 1.85, -0.3], [0, 1.75, 0.1], [0, 1.7, 0.5]],
    0.035, 16, pipeMat
  );
  hydGroup.add(tankToPump);

  // Pump to boom center
  const pumpToBoom = createTube(
    [[0, 1.7, 0.6], [0, 1.85, 0.5], [0, 2.0, 0.35], [0, 2.05, 0.3]],
    0.03, 16, pipeMat
  );
  hydGroup.add(pumpToBoom);

  // Return line
  const returnLine = createTube(
    [[0.2, 2.0, 0.3], [0.2, 1.85, 0.0], [0.2, 1.8, -0.5]],
    0.025, 12, copper
  );
  hydGroup.add(returnLine);

  // Hydraulic power lines — from engine to boom lift
  for (let s = -1; s <= 1; s += 2) {
    const hydLine = createTube(
      [[s * 0.3, 2.2, -1.5], [s * 0.3, 2.1, -0.5], [s * 0.35, 2.1, 0.2]],
      0.018, 12, hydraulicRed
    );
    hydGroup.add(hydLine);
  }

  group.add(hydGroup);

  // ═══════════════════════════════════════════════════════════════════════
  //  BODY PANELS & FENDERS
  // ═══════════════════════════════════════════════════════════════════════
  const panelGroup = new THREE.Group();

  // Front fenders over wheels
  for (let s = -1; s <= 1; s += 2) {
    // Fender — curved shape approximated
    const fenderGeo = new THREE.BoxGeometry(0.3, 0.08, 0.9);
    const fender = new THREE.Mesh(fenderGeo, jdGreen);
    fender.position.set(s * 1.15, 2.3, 1.8);
    panelGroup.add(fender);

    // Rear fender
    const rFenderGeo = new THREE.BoxGeometry(0.3, 0.08, 0.9);
    const rFender = new THREE.Mesh(rFenderGeo, jdGreen);
    rFender.position.set(s * 1.15, 2.3, -1.8);
    panelGroup.add(rFender);

    // Mud flap
    const flapGeo = new THREE.BoxGeometry(0.25, 0.35, 0.02);
    const flap = new THREE.Mesh(flapGeo, rubber);
    flap.position.set(s * 1.15, 2.0, -2.25);
    panelGroup.add(flap);
  }

  // JD-style side stripe decals (yellow)
  for (let s = -1; s <= 1; s += 2) {
    const stripeGeo = new THREE.BoxGeometry(0.02, 0.06, 2.5);
    const stripe = new THREE.Mesh(stripeGeo, jdYellow);
    stripe.position.set(s * 0.54, 2.5, -1.0);
    panelGroup.add(stripe);
  }

  group.add(panelGroup);

  // ═══════════════════════════════════════════════════════════════════════
  //  CLEAN WATER RINSE TANK — Small secondary tank
  // ═══════════════════════════════════════════════════════════════════════
  const rinseTankGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 12);
  const rinseTank = new THREE.Mesh(rinseTankGeo, aluminum);
  rinseTank.position.set(-0.7, 2.5, -1.0);
  group.add(rinseTank);

  // ═══════════════════════════════════════════════════════════════════════
  //  BOOM HEIGHT SENSOR — Ultrasonic
  // ═══════════════════════════════════════════════════════════════════════
  const sensorGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.06, 12);
    const sensor = new THREE.Mesh(sGeo, neonCyan);
    sensor.position.set(-3.0 + i * 3.0, 2.0, 0.3);
    sensorGroup.add(sensor);

    // Sensor bracket
    const sbGeo = new THREE.BoxGeometry(0.08, 0.04, 0.04);
    const sb = new THREE.Mesh(sbGeo, steel);
    sb.position.set(-3.0 + i * 3.0, 2.06, 0.3);
    sensorGroup.add(sb);
  }
  group.add(sensorGroup);
  meshes.sensors = sensorGroup;

  // ═══════════════════════════════════════════════════════════════════════
  //  FUTURISTIC HOLOGRAPHIC FIELD MAP — Floating above cab
  // ═══════════════════════════════════════════════════════════════════════
  const holoMapGeo = new THREE.PlaneGeometry(1.2, 0.8, 12, 8);
  const holoMap = new THREE.Mesh(holoMapGeo, hologramMat);
  holoMap.rotation.x = -Math.PI / 4;
  holoMap.position.set(0, 4.2, 2.5);
  group.add(holoMap);
  meshes.holoMap = holoMap;

  // ═══════════════════════════════════════════════════════════════════════
  //  RIVETS & PANEL DETAILS
  // ═══════════════════════════════════════════════════════════════════════
  const rivetGeo = new THREE.SphereGeometry(0.015, 6, 6);
  // Rivets along chassis
  for (let z = -2; z <= 2; z += 0.5) {
    for (let s = -1; s <= 1; s += 2) {
      const rivet = new THREE.Mesh(rivetGeo, chrome);
      rivet.position.set(s * 0.72, 2.08, z);
      group.add(rivet);
    }
  }
  // Rivets on tank bands
  for (let b = 0; b < 3; b++) {
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      const rv = new THREE.Mesh(rivetGeo, chrome);
      rv.position.set(
        Math.cos(ang) * 1.04,
        2.2 + b * 0.7,
        -0.8 + Math.sin(ang) * 1.04
      );
      group.add(rv);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  PARTS MANIFEST
  // ═══════════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Solution Tank',
      description: 'Large polyethylene tank (1000–1200 gal) holding herbicide/pesticide solution with agitation system.'
    }
  ];

  if (addSelectable) {
    addSelectable(group);
  }

  
  return group;
}