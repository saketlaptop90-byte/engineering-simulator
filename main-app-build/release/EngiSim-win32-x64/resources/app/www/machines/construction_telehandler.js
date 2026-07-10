import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

// ──────────────────────────────────────────────────────────────
//  MODERN TELEHANDLER / TELESCOPIC HANDLER  (JCB 540-style)
//  Ultra-detailed THREE.js model with telescopic boom,
//  quick-attach fork carriage, 4 outrigger stabilizers,
//  4 large realistic-tread tires, operator cab, hydraulics.
// ──────────────────────────────────────────────────────────────

export function createMachine(THREE) {
  const group = new THREE.Group();

  /* ─── custom materials ─── */
  const jcbYellow = new THREE.MeshStandardMaterial({
    color: 0xf5c518, roughness: 0.35, metalness: 0.15
  });
  const jcbDarkYellow = new THREE.MeshStandardMaterial({
    color: 0xd4a800, roughness: 0.4, metalness: 0.2
  });
  const chassisGrey = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, roughness: 0.5, metalness: 0.6
  });
  const hydraulicChrome = new THREE.MeshStandardMaterial({
    color: 0xd0d8e0, roughness: 0.1, metalness: 0.95
  });
  const hydraulicCylinder = new THREE.MeshStandardMaterial({
    color: 0x404855, roughness: 0.25, metalness: 0.85
  });
  const warningOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, roughness: 0.45, metalness: 0.1
  });
  const glowGreen = new THREE.MeshPhysicalMaterial({
    color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.6,
    roughness: 0.2, metalness: 0.3, transparent: true, opacity: 0.85
  });
  const neonBlue = new THREE.MeshPhysicalMaterial({
    color: 0x00aaff, emissive: 0x0088ff, emissiveIntensity: 0.7,
    roughness: 0.15, metalness: 0.4, transparent: true, opacity: 0.9
  });
  const headlightMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, emissive: 0xffffcc, emissiveIntensity: 1.2,
    roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.95
  });
  const tailLightMat = new THREE.MeshPhysicalMaterial({
    color: 0xff2222, emissive: 0xff0000, emissiveIntensity: 0.8,
    roughness: 0.15, metalness: 0.1
  });
  const indicatorMat = new THREE.MeshPhysicalMaterial({
    color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 0.7,
    roughness: 0.2, metalness: 0.1
  });
  const tintedGlass = new THREE.MeshPhysicalMaterial({
    color: 0x334455, roughness: 0.05, metalness: 0.1,
    transparent: true, opacity: 0.35, transmission: 0.6
  });
  const gridFloor = new THREE.MeshStandardMaterial({
    color: 0x111111, roughness: 0.8, metalness: 0.2
  });
  const counterweightMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, roughness: 0.7, metalness: 0.5
  });

  const meshes = {};

  /* ═══════════════════════════════════════════════════════════
     1 ─ MAIN CHASSIS / FRAME
     ═══════════════════════════════════════════════════════════ */
  const chassisGroup = new THREE.Group();

  // Lower frame – wide slab
  const frameLower = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.35, 5.6),
    chassisGrey
  );
  frameLower.position.set(0, 0.6, 0);
  chassisGroup.add(frameLower);

  // Upper body – engine bay behind cab
  const bodyUpper = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 1.0, 2.8),
    jcbYellow
  );
  bodyUpper.position.set(0, 1.25, -1.2);
  chassisGroup.add(bodyUpper);

  // Engine compartment cover – rounded
  const engineCover = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.12, 2.4),
    jcbDarkYellow
  );
  engineCover.position.set(0, 1.82, -1.2);
  chassisGroup.add(engineCover);

  // Engine grille (rear)
  for (let i = 0; i < 8; i++) {
    const grilleSlat = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.04, 0.08),
      darkSteel
    );
    grilleSlat.position.set(0, 1.0 + i * 0.1, -2.58);
    chassisGroup.add(grilleSlat);
  }

  // Side panels with louvers
  [-1, 1].forEach(side => {
    for (let i = 0; i < 6; i++) {
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.06, 0.5),
        darkSteel
      );
      louver.position.set(side * 1.34, 1.0 + i * 0.12, -1.6);
      chassisGroup.add(louver);
    }
  });

  // Counterweight (rear)
  const counterweight = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.6, 0.5),
    counterweightMat
  );
  counterweight.position.set(0, 1.0, -2.7);
  chassisGroup.add(counterweight);

  // Exhaust stack
  const exhaustPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16),
    darkSteel
  );
  exhaustPipe.position.set(-0.8, 2.0, -1.8);
  chassisGroup.add(exhaustPipe);

  const exhaustCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.08, 0.1, 16),
    chrome
  );
  exhaustCap.position.set(-0.8, 2.65, -1.8);
  chassisGroup.add(exhaustCap);

  // Fuel tank (side)
  const fuelTank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 1.0, 16),
    chassisGrey
  );
  fuelTank.rotation.z = Math.PI / 2;
  fuelTank.position.set(1.3, 0.55, -0.3);
  chassisGroup.add(fuelTank);

  const fuelCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12),
    chrome
  );
  fuelCap.position.set(1.55, 0.55, -0.3);
  fuelCap.rotation.z = Math.PI / 2;
  chassisGroup.add(fuelCap);

  // Steps / ladder on left side
  for (let i = 0; i < 3; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.04, 0.25),
      darkSteel
    );
    step.position.set(-1.5, 0.35 + i * 0.35, 0.8 + i * 0.15);
    chassisGroup.add(step);

    const stepBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.35, 0.04),
      darkSteel
    );
    stepBracket.position.set(-1.42, 0.2 + i * 0.35, 0.8 + i * 0.15);
    chassisGroup.add(stepBracket);
  }

  // Handrail
  const railCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 1.0, 0.6),
    new THREE.Vector3(-1.5, 1.6, 0.9),
    new THREE.Vector3(-1.5, 2.1, 1.2),
    new THREE.Vector3(-1.4, 2.4, 1.4)
  ]);
  const railTube = new THREE.TubeGeometry(railCurve, 20, 0.025, 8, false);
  const handrail = new THREE.Mesh(railTube, chrome);
  chassisGroup.add(handrail);

  group.add(chassisGroup);
  meshes.chassis = chassisGroup;

  /* ═══════════════════════════════════════════════════════════
     2 ─ OPERATOR CAB
     ═══════════════════════════════════════════════════════════ */
  const cabGroup = new THREE.Group();

  // Cab main structure – slightly rounded using LatheGeometry concept
  const cabBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 1.6, 1.8),
    jcbYellow
  );
  cabBody.position.set(0, 2.1, 1.0);
  cabGroup.add(cabBody);

  // Cab roof
  const cabRoof = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 0.1, 2.0),
    jcbDarkYellow
  );
  cabRoof.position.set(0, 2.96, 1.0);
  cabGroup.add(cabRoof);

  // ROPS frame (Roll-Over Protection)
  const ropsPillarPositions = [
    [-0.95, 0, 0.15], [0.95, 0, 0.15],
    [-0.95, 0, 1.85], [0.95, 0, 1.85]
  ];
  ropsPillarPositions.forEach(([x, _, z]) => {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.7, 0.08),
      darkSteel
    );
    pillar.position.set(x, 2.15, z);
    cabGroup.add(pillar);
  });

  // Front windshield
  const windshield = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1.4),
    tintedGlass
  );
  windshield.position.set(0, 2.1, 1.91);
  cabGroup.add(windshield);

  // Side windows
  [-1, 1].forEach(side => {
    const sideWindow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.2),
      tintedGlass
    );
    sideWindow.rotation.y = Math.PI / 2;
    sideWindow.position.set(side * 1.01, 2.15, 1.0);
    cabGroup.add(sideWindow);
  });

  // Rear window
  const rearWindow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.8),
    tintedGlass
  );
  rearWindow.position.set(0, 2.3, 0.09);
  rearWindow.rotation.y = Math.PI;
  cabGroup.add(rearWindow);

  // Door outline (left)
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.5, 1.5),
    darkSteel
  );
  doorFrame.position.set(-1.04, 2.05, 1.0);
  cabGroup.add(doorFrame);

  // Door handle
  const doorHandle = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.06, 0.2),
    chrome
  );
  doorHandle.position.set(-1.08, 2.0, 1.3);
  cabGroup.add(doorHandle);

  // Interior – seat
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
  );
  seat.position.set(0, 1.7, 0.8);
  cabGroup.add(seat);

  const seatBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.7, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
  );
  seatBack.position.set(0, 2.05, 0.58);
  cabGroup.add(seatBack);

  // Steering wheel
  const steeringRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.02, 8, 24),
    darkSteel
  );
  steeringRing.position.set(0, 2.0, 1.3);
  steeringRing.rotation.x = -Math.PI / 6;
  cabGroup.add(steeringRing);

  const steeringColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
    darkSteel
  );
  steeringColumn.position.set(0, 1.8, 1.25);
  steeringColumn.rotation.x = -Math.PI / 6;
  cabGroup.add(steeringColumn);

  // Dashboard / control panel
  const dashboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.4, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })
  );
  dashboard.position.set(0, 1.8, 1.6);
  cabGroup.add(dashboard);

  // Dashboard display screen (neon glow)
  const displayScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.2),
    neonBlue
  );
  displayScreen.position.set(0.2, 1.88, 1.68);
  cabGroup.add(displayScreen);
  meshes.display = displayScreen;

  // Joystick controls
  [-0.3, -0.15].forEach((xOff, idx) => {
    const joystickBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.05, 0.06, 12),
      darkSteel
    );
    joystickBase.position.set(0.5, 1.65, 1.0 + idx * 0.15);
    cabGroup.add(joystickBase);

    const joystickStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8),
      chrome
    );
    joystickStick.position.set(0.5, 1.78, 1.0 + idx * 0.15);
    cabGroup.add(joystickStick);

    const joystickKnob = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      rubber
    );
    joystickKnob.position.set(0.5, 1.88, 1.0 + idx * 0.15);
    cabGroup.add(joystickKnob);
  });

  // Roof beacon (warning light)
  const beaconBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.08, 16),
    darkSteel
  );
  beaconBase.position.set(0, 3.06, 1.0);
  cabGroup.add(beaconBase);

  const beaconLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    indicatorMat
  );
  beaconLight.position.set(0, 3.16, 1.0);
  cabGroup.add(beaconLight);
  meshes.beacon = beaconLight;

  // Side mirrors
  [-1, 1].forEach(side => {
    const mirrorArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.04, 0.04),
      darkSteel
    );
    mirrorArm.position.set(side * 1.3, 2.5, 1.6);
    cabGroup.add(mirrorArm);

    const mirrorFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.15),
      chrome
    );
    mirrorFace.position.set(side * 1.52, 2.5, 1.6);
    mirrorFace.rotation.y = side * 0.3;
    cabGroup.add(mirrorFace);
  });

  // Work lights (front, on roof)
  [-0.6, 0.6].forEach(x => {
    const workLightHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.1, 0.08),
      darkSteel
    );
    workLightHousing.position.set(x, 3.02, 1.95);
    cabGroup.add(workLightHousing);

    const workLightLens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.07),
      headlightMat
    );
    workLightLens.position.set(x, 3.02, 1.99);
    cabGroup.add(workLightLens);
  });

  // Rear work lights
  [-0.6, 0.6].forEach(x => {
    const rWorkLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.08, 0.06),
      darkSteel
    );
    rWorkLight.position.set(x, 3.02, 0.05);
    cabGroup.add(rWorkLight);

    const rWorkLens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 0.06),
      tailLightMat
    );
    rWorkLens.position.set(x, 3.02, 0.02);
    rWorkLens.rotation.y = Math.PI;
    cabGroup.add(rWorkLens);
  });

  group.add(cabGroup);
  meshes.cab = cabGroup;

  /* ═══════════════════════════════════════════════════════════
     3 ─ HEADLIGHTS, TAIL LIGHTS, INDICATORS
     ═══════════════════════════════════════════════════════════ */
  const lightsGroup = new THREE.Group();

  // Front headlights
  [-0.9, 0.9].forEach(x => {
    const hlHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.1, 16),
      darkSteel
    );
    hlHousing.rotation.x = Math.PI / 2;
    hlHousing.position.set(x, 1.1, 2.82);
    lightsGroup.add(hlHousing);

    const hlLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.11, 16),
      headlightMat
    );
    hlLens.position.set(x, 1.1, 2.88);
    lightsGroup.add(hlLens);
    if (x < 0) meshes.headlightL = hlLens;
    else meshes.headlightR = hlLens;
  });

  // Front indicators
  [-0.55, 0.55].forEach(x => {
    const indic = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.06, 0.04),
      indicatorMat
    );
    indic.position.set(x, 1.35, 2.83);
    lightsGroup.add(indic);
  });

  // Tail lights
  [-0.9, 0.9].forEach(x => {
    const tlHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.15, 0.08),
      darkSteel
    );
    tlHousing.position.set(x, 1.2, -2.95);
    lightsGroup.add(tlHousing);

    const tlLens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.12),
      tailLightMat
    );
    tlLens.position.set(x, 1.2, -2.99);
    tlLens.rotation.y = Math.PI;
    lightsGroup.add(tlLens);
  });

  // Rear indicators
  [-0.55, 0.55].forEach(x => {
    const rInd = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.08, 0.04),
      indicatorMat
    );
    rInd.position.set(x, 1.0, -2.97);
    lightsGroup.add(rInd);
  });

  group.add(lightsGroup);

  /* ═══════════════════════════════════════════════════════════
     4 ─ TELESCOPIC BOOM (3 nested sections)
     ═══════════════════════════════════════════════════════════ */
  const boomGroup = new THREE.Group();
  boomGroup.position.set(0, 1.75, 0.2);

  // Boom pivot mount on chassis
  const boomPivot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16),
    darkSteel
  );
  boomPivot.rotation.x = Math.PI / 2;
  boomPivot.position.set(0, 0, 0);
  boomGroup.add(boomPivot);

  // Section 1 – outer boom (largest)
  const boomSection1 = new THREE.Group();
  const boom1Body = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.45, 3.8),
    jcbYellow
  );
  boom1Body.position.set(0, 0.15, 2.2);
  boomSection1.add(boom1Body);

  // Reinforcement ribs on boom section 1
  for (let i = 0; i < 5; i++) {
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.04, 0.06),
      jcbDarkYellow
    );
    rib.position.set(0, 0.39, 0.8 + i * 0.6);
    boomSection1.add(rib);
  }

  // Side plates
  [-1, 1].forEach(side => {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.5, 3.8),
      jcbDarkYellow
    );
    plate.position.set(side * 0.3, 0.15, 2.2);
    boomSection1.add(plate);
  });

  boomGroup.add(boomSection1);
  meshes.boomSection1 = boomSection1;

  // Section 2 – middle boom (telescopes inside section 1)
  const boomSection2 = new THREE.Group();
  const boom2Body = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.35, 3.2),
    jcbYellow
  );
  boom2Body.position.set(0, 0.15, 3.7);
  boomSection2.add(boom2Body);

  // Wear pads (slider guides)
  [-1, 1].forEach(side => {
    const wearPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.08, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x556677, roughness: 0.3, metalness: 0.7 })
    );
    wearPad.position.set(side * 0.2, 0.35, 2.2);
    boomSection2.add(wearPad);
  });

  boomSection1.add(boomSection2);
  meshes.boomSection2 = boomSection2;

  // Section 3 – inner boom (telescopes inside section 2)
  const boomSection3 = new THREE.Group();
  const boom3Body = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.28, 2.8),
    jcbYellow
  );
  boom3Body.position.set(0, 0.15, 5.0);
  boomSection3.add(boom3Body);

  // Wear pads on section 3
  [-1, 1].forEach(side => {
    const wearPad3 = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.06, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x556677, roughness: 0.3, metalness: 0.7 })
    );
    wearPad3.position.set(side * 0.15, 0.31, 3.7);
    boomSection3.add(wearPad3);
  });

  boomSection2.add(boomSection3);
  meshes.boomSection3 = boomSection3;

  group.add(boomGroup);
  meshes.boom = boomGroup;

  /* ─── Boom hydraulic lift cylinder ─── */
  const liftCylGroup = new THREE.Group();

  const liftCylBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16),
    hydraulicCylinder
  );
  liftCylBarrel.position.set(0, 0, 0.9);
  liftCylBarrel.rotation.x = Math.PI / 2;
  liftCylGroup.add(liftCylBarrel);

  const liftCylRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1.4, 12),
    hydraulicChrome
  );
  liftCylRod.position.set(0, 0, 1.9);
  liftCylRod.rotation.x = Math.PI / 2;
  liftCylGroup.add(liftCylRod);
  meshes.liftRod = liftCylRod;

  // Cylinder mounting eyes
  [0, 2.6].forEach(z => {
    const eye = new THREE.Mesh(
      new THREE.TorusGeometry(0.05, 0.02, 8, 12),
      darkSteel
    );
    eye.position.set(0, 0, z);
    liftCylGroup.add(eye);
  });

  liftCylGroup.position.set(0.35, 1.0, 0.2);
  liftCylGroup.rotation.x = -0.25;
  group.add(liftCylGroup);
  meshes.liftCylinder = liftCylGroup;

  /* ─── Internal telescope hydraulic cylinder ─── */
  const teleCylBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12),
    hydraulicCylinder
  );
  teleCylBarrel.position.set(0, 0.05, 2.8);
  teleCylBarrel.rotation.x = Math.PI / 2;
  boomSection1.add(teleCylBarrel);

  const teleCylRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.8, 10),
    hydraulicChrome
  );
  teleCylRod.position.set(0, 0.05, 4.0);
  teleCylRod.rotation.x = Math.PI / 2;
  boomSection1.add(teleCylRod);
  meshes.teleRod = teleCylRod;

  /* ─── Hydraulic hoses along boom ─── */
  const hosePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.25, 0.4, 0.3),
    new THREE.Vector3(0.26, 0.42, 1.5),
    new THREE.Vector3(0.25, 0.4, 3.0),
    new THREE.Vector3(0.24, 0.38, 4.5),
    new THREE.Vector3(0.23, 0.36, 5.8)
  ]);
  const hoseGeo = new THREE.TubeGeometry(hosePath, 40, 0.02, 8, false);
  const hose1 = new THREE.Mesh(hoseGeo, rubber);
  boomSection1.add(hose1);

  const hosePath2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.25, 0.4, 0.3),
    new THREE.Vector3(-0.26, 0.42, 1.5),
    new THREE.Vector3(-0.25, 0.4, 3.0),
    new THREE.Vector3(-0.24, 0.38, 4.5),
    new THREE.Vector3(-0.23, 0.36, 5.8)
  ]);
  const hoseGeo2 = new THREE.TubeGeometry(hosePath2, 40, 0.02, 8, false);
  const hose2 = new THREE.Mesh(hoseGeo2, rubber);
  boomSection1.add(hose2);

  // Hose clamps
  [1.5, 3.0, 4.5].forEach(z => {
    [-1, 1].forEach(side => {
      const clamp = new THREE.Mesh(
        new THREE.TorusGeometry(0.035, 0.008, 6, 12),
        chrome
      );
      clamp.position.set(side * 0.25, 0.4, z);
      clamp.rotation.y = Math.PI / 2;
      boomSection1.add(clamp);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     5 ─ QUICK-ATTACH FORK CARRIAGE
     ═══════════════════════════════════════════════════════════ */
  const carriageGroup = new THREE.Group();
  carriageGroup.position.set(0, 0.15, 6.5);

  // Carriage frame (vertical plate)
  const carrPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.2, 0.1),
    darkSteel
  );
  carrPlate.position.set(0, -0.2, 0);
  carriageGroup.add(carrPlate);

  // Quick-attach hooks (top)
  [-0.5, 0.5].forEach(x => {
    const hook = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.2, 0.15),
      steel
    );
    hook.position.set(x, 0.45, 0.05);
    carriageGroup.add(hook);

    const hookTip = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.06, 0.1),
      steel
    );
    hookTip.position.set(x, 0.35, 0.12);
    carriageGroup.add(hookTip);
  });

  // Quick-attach locking pins (bottom)
  [-0.5, 0.5].forEach(x => {
    const lockPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.2, 10),
      hydraulicChrome
    );
    lockPin.rotation.x = Math.PI / 2;
    lockPin.position.set(x, -0.65, 0.08);
    carriageGroup.add(lockPin);
  });

  // Fork tines
  [-0.45, 0.45].forEach(x => {
    // Vertical section
    const forkVert = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.9, 0.08),
      darkSteel
    );
    forkVert.position.set(x, -0.35, 0.08);
    carriageGroup.add(forkVert);

    // Horizontal section – the tine itself
    const forkTine = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.06, 1.6),
      darkSteel
    );
    forkTine.position.set(x, -0.82, 0.85);
    carriageGroup.add(forkTine);

    // Tine tip – tapered
    const tineTip = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.04, 0.15),
      steel
    );
    tineTip.position.set(x, -0.83, 1.72);
    carriageGroup.add(tineTip);

    // Heel reinforcement
    const heel = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.15, 0.15),
      darkSteel
    );
    heel.position.set(x, -0.73, 0.12);
    heel.rotation.x = 0;
    carriageGroup.add(heel);
  });

  // Load backrest
  const backrest = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.8, 0.05),
    new THREE.MeshStandardMaterial({
      color: 0x333333, roughness: 0.6, metalness: 0.4,
      wireframe: false
    })
  );
  backrest.position.set(0, 0.1, -0.03);
  carriageGroup.add(backrest);

  // Backrest grid
  for (let i = 0; i < 4; i++) {
    const gridVert = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.7, 0.02),
      darkSteel
    );
    gridVert.position.set(-0.5 + i * 0.33, 0.1, -0.06);
    carriageGroup.add(gridVert);
  }
  for (let i = 0; i < 3; i++) {
    const gridHoriz = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.02, 0.02),
      darkSteel
    );
    gridHoriz.position.set(0, -0.15 + i * 0.3, -0.06);
    carriageGroup.add(gridHoriz);
  }

  // Tilt cylinder at carriage
  const tiltCylBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.6, 10),
    hydraulicCylinder
  );
  tiltCylBarrel.position.set(0, 0.3, -0.3);
  tiltCylBarrel.rotation.x = Math.PI / 4;
  carriageGroup.add(tiltCylBarrel);

  const tiltCylRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.4, 8),
    hydraulicChrome
  );
  tiltCylRod.position.set(0, 0.0, -0.05);
  tiltCylRod.rotation.x = Math.PI / 4;
  carriageGroup.add(tiltCylRod);

  boomSection3.add(carriageGroup);
  meshes.carriage = carriageGroup;

  /* ═══════════════════════════════════════════════════════════
     6 ─ OUTRIGGER STABILIZERS (4 corners)
     ═══════════════════════════════════════════════════════════ */
  const outriggerPositions = [
    { x: -1.2, z: 2.3, label: 'FL' },
    { x:  1.2, z: 2.3, label: 'FR' },
    { x: -1.2, z: -2.3, label: 'RL' },
    { x:  1.2, z: -2.3, label: 'RR' }
  ];

  const outriggerMeshes = [];

  outriggerPositions.forEach(({ x, z, label }) => {
    const outriggerGroup = new THREE.Group();

    // Stabilizer beam (horizontal slide-out)
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.12, 0.12),
      darkSteel
    );
    beam.position.set(x > 0 ? 0.4 : -0.4, 0, 0);
    outriggerGroup.add(beam);

    // Hydraulic cylinder (vertical)
    const outCylBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.5, 10),
      hydraulicCylinder
    );
    outCylBarrel.position.set(x > 0 ? 0.78 : -0.78, -0.15, 0);
    outriggerGroup.add(outCylBarrel);

    const outCylRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8),
      hydraulicChrome
    );
    outCylRod.position.set(x > 0 ? 0.78 : -0.78, -0.5, 0);
    outriggerGroup.add(outCylRod);

    // Foot pad
    const footPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 0.06, 12),
      steel
    );
    footPad.position.set(x > 0 ? 0.78 : -0.78, -0.73, 0);
    outriggerGroup.add(footPad);

    // Pivot pin
    const pivot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8),
      chrome
    );
    pivot.rotation.x = Math.PI / 2;
    pivot.position.set(0, 0, 0);
    outriggerGroup.add(pivot);

    // Neon accent on outrigger
    const neonRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.01, 6, 16),
      glowGreen
    );
    neonRing.position.set(x > 0 ? 0.78 : -0.78, -0.4, 0);
    outriggerGroup.add(neonRing);

    outriggerGroup.position.set(x, 0.42, z);
    group.add(outriggerGroup);
    outriggerMeshes.push(outCylRod);
    meshes[`outrigger${label}`] = outriggerGroup;
  });
  meshes.outriggerRods = outriggerMeshes;

  /* ═══════════════════════════════════════════════════════════
     7 ─ WHEELS & TIRES  (4 large, with carved treads)
     ═══════════════════════════════════════════════════════════ */
  const wheelPositions = [
    { x: -1.35, z:  1.6, label: 'FL' },
    { x:  1.35, z:  1.6, label: 'FR' },
    { x: -1.35, z: -1.6, label: 'RL' },
    { x:  1.35, z: -1.6, label: 'RR' }
  ];

  const wheelMeshArray = [];

  function createRealisticTire(THREE) {
    const tireGroup = new THREE.Group();
    const tireRadius = 0.52;
    const tireThickness = 0.14;

    // Main tire body (torus)
    const tireBody = new THREE.Mesh(
      new THREE.TorusGeometry(tireRadius, tireThickness, 24, 48),
      rubber
    );
    tireGroup.add(tireBody);

    // Sidewall detail rings
    [1, -1].forEach(side => {
      const sidewall = new THREE.Mesh(
        new THREE.TorusGeometry(tireRadius, 0.005, 12, 48),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
      );
      sidewall.position.x = side * 0.12;
      sidewall.rotation.y = Math.PI / 2;
      tireGroup.add(sidewall);

      // Inner sidewall ring
      const innerRing = new THREE.Mesh(
        new THREE.TorusGeometry(tireRadius * 0.78, 0.004, 8, 48),
        new THREE.MeshStandardMaterial({ color: 0x252525, roughness: 0.85 })
      );
      innerRing.position.x = side * 0.1;
      innerRing.rotation.y = Math.PI / 2;
      tireGroup.add(innerRing);
    });

    // Tread lugs – deeply carved pattern
    const lugCount = 36;
    for (let i = 0; i < lugCount; i++) {
      const angle = (i / lugCount) * Math.PI * 2;
      const lug = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.035, 0.10),
        rubber
      );
      const lugR = tireRadius + tireThickness * 0.75;
      lug.position.set(
        0,
        Math.cos(angle) * lugR,
        Math.sin(angle) * lugR
      );
      lug.rotation.x = angle;

      // Alternate chevron pattern
      lug.rotation.y = (i % 2 === 0) ? 0.35 : -0.35;
      tireGroup.add(lug);
    }

    // Secondary smaller tread blocks (between main lugs)
    for (let i = 0; i < lugCount; i++) {
      const angle = ((i + 0.5) / lugCount) * Math.PI * 2;
      const smallLug = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.02, 0.06),
        rubber
      );
      const sR = tireRadius + tireThickness * 0.8;
      smallLug.position.set(
        (i % 2 === 0) ? 0.04 : -0.04,
        Math.cos(angle) * sR,
        Math.sin(angle) * sR
      );
      smallLug.rotation.x = angle;
      tireGroup.add(smallLug);
    }

    // Shoulder lugs on both sides
    [1, -1].forEach(side => {
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const shoulderLug = new THREE.Mesh(
          new THREE.BoxGeometry(0.025, 0.025, 0.04),
          rubber
        );
        const shR = tireRadius + tireThickness * 0.5;
        shoulderLug.position.set(
          side * 0.11,
          Math.cos(angle) * shR,
          Math.sin(angle) * shR
        );
        shoulderLug.rotation.x = angle;
        tireGroup.add(shoulderLug);
      }
    });

    // Rim – multi-spoke design
    const rimGroup = new THREE.Group();

    // Rim center hub
    const rimHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.18, 24),
      chrome
    );
    rimHub.rotation.z = Math.PI / 2;
    rimGroup.add(rimHub);

    // Hub cap
    const hubCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16),
      chrome
    );
    hubCap.rotation.z = Math.PI / 2;
    hubCap.position.x = 0.1;
    rimGroup.add(hubCap);

    // Lug nuts
    for (let i = 0; i < 6; i++) {
      const lugAngle = (i / 6) * Math.PI * 2;
      const lugNut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.06, 6),
        steel
      );
      lugNut.rotation.z = Math.PI / 2;
      lugNut.position.set(
        0.1,
        Math.cos(lugAngle) * 0.06,
        Math.sin(lugAngle) * 0.06
      );
      rimGroup.add(lugNut);
    }

    // Rim barrel (inner ring)
    const rimBarrel = new THREE.Mesh(
      new THREE.TorusGeometry(tireRadius * 0.58, 0.025, 12, 32),
      aluminum
    );
    rimGroup.add(rimBarrel);

    // Outer rim lip
    const rimLip = new THREE.Mesh(
      new THREE.TorusGeometry(tireRadius * 0.72, 0.015, 8, 32),
      chrome
    );
    rimGroup.add(rimLip);

    // Spokes (8 spokes)
    const spokeCount = 8;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.03, 0.22),
        aluminum
      );
      spoke.position.set(
        0,
        Math.cos(angle) * tireRadius * 0.35,
        Math.sin(angle) * tireRadius * 0.35
      );
      spoke.rotation.x = angle;
      rimGroup.add(spoke);
    }

    // Valve stem
    const valveStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.06, 6),
      rubber
    );
    valveStem.position.set(0, tireRadius * 0.62, 0);
    rimGroup.add(valveStem);

    tireGroup.add(rimGroup);
    tireGroup.rotation.z = Math.PI / 2;

    return tireGroup;
  }

  wheelPositions.forEach(({ x, z, label }) => {
    const wheel = createRealisticTire(THREE);
    wheel.position.set(x, 0.52, z);
    // Scale slightly for telehandler large tires
    wheel.scale.set(1.05, 1.05, 1.05);
    group.add(wheel);
    wheelMeshArray.push(wheel);
    meshes[`wheel${label}`] = wheel;
  });

  /* ─── Axle and suspension ─── */
  [1.6, -1.6].forEach(z => {
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 2.7, 12),
      darkSteel
    );
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, 0.52, z);
    group.add(axle);

    // Suspension springs
    [-1, 1].forEach(side => {
      const spring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8),
        steel
      );
      spring.position.set(side * 0.9, 0.55, z);
      group.add(spring);
    });
  });

  /* ─── Steering linkage ─── */
  const steerLink = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.6, 8),
    darkSteel
  );
  steerLink.rotation.z = Math.PI / 2;
  steerLink.position.set(0, 0.38, 1.6);
  group.add(steerLink);

  /* ═══════════════════════════════════════════════════════════
     8 ─ PANEL LINES, RIVETS, DETAILS
     ═══════════════════════════════════════════════════════════ */

  // Panel line seams on body
  const panelLineMat = new THREE.MeshStandardMaterial({
    color: 0x999900, roughness: 0.5, metalness: 0.1
  });
  [0.5, -0.5, -1.5].forEach(z => {
    const panelLine = new THREE.Mesh(
      new THREE.BoxGeometry(2.62, 0.01, 0.01),
      panelLineMat
    );
    panelLine.position.set(0, 1.76, z);
    group.add(panelLine);
  });

  // Rivets along chassis
  for (let i = 0; i < 12; i++) {
    [-1, 1].forEach(side => {
      const rivet = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 6, 6),
        chrome
      );
      rivet.position.set(side * 1.41, 0.7, -2.3 + i * 0.4);
      group.add(rivet);
    });
  }

  // JCB-style branding plate
  const brandPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.15, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xeecc00, roughness: 0.3, metalness: 0.6 })
  );
  brandPlate.position.set(0, 1.5, 2.82);
  group.add(brandPlate);

  // Boom neon accent strip
  const neonStripPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 0.4, 0.4),
    new THREE.Vector3(-0.28, 0.4, 2.0),
    new THREE.Vector3(-0.28, 0.4, 3.8)
  ]);
  const neonStripGeo = new THREE.TubeGeometry(neonStripPath, 20, 0.01, 6, false);
  const neonStrip = new THREE.Mesh(neonStripGeo, glowGreen);
  boomSection1.add(neonStrip);
  meshes.neonStrip = neonStrip;

  // Chassis underside neon line
  const underNeon = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.02, 4.5),
    neonBlue
  );
  underNeon.position.set(0, 0.42, 0);
  group.add(underNeon);
  meshes.underNeon = underNeon;

  // Tow hitch (rear)
  const towHitch = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12),
    darkSteel
  );
  towHitch.rotation.x = Math.PI / 2;
  towHitch.position.set(0, 0.5, -2.85);
  group.add(towHitch);

  const towPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8),
    chrome
  );
  towPin.position.set(0, 0.5, -2.92);
  group.add(towPin);

  /* ═══════════════════════════════════════════════════════════
     9 ─ HYDRAULIC ROUTING FROM CHASSIS TO BOOM
     ═══════════════════════════════════════════════════════════ */
  const hoseMainPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, 1.0, 0.5),
    new THREE.Vector3(0.45, 1.4, 0.4),
    new THREE.Vector3(0.4, 1.7, 0.3),
    new THREE.Vector3(0.35, 1.8, 0.25)
  ]);
  const hoseMainGeo = new THREE.TubeGeometry(hoseMainPath, 16, 0.018, 8, false);
  const hoseMain = new THREE.Mesh(hoseMainGeo, rubber);
  group.add(hoseMain);

  const hoseMain2Path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.42, 1.0, 0.55),
    new THREE.Vector3(0.38, 1.35, 0.45),
    new THREE.Vector3(0.36, 1.65, 0.35),
    new THREE.Vector3(0.33, 1.78, 0.28)
  ]);
  const hoseMain2Geo = new THREE.TubeGeometry(hoseMain2Path, 16, 0.015, 8, false);
  const hoseMain2 = new THREE.Mesh(hoseMain2Geo,
    new THREE.MeshStandardMaterial({ color: 0x882200, roughness: 0.6, metalness: 0.1 })
  );
  group.add(hoseMain2);

  /* ═══════════════════════════════════════════════════════════
     10 ─ FENDER / MUD GUARDS
     ═══════════════════════════════════════════════════════════ */
  wheelPositions.forEach(({ x, z }) => {
    const fenderShape = new THREE.Shape();
    fenderShape.absarc(0, 0, 0.65, 0, Math.PI, false);
    const fenderGeo = new THREE.ExtrudeGeometry(fenderShape, {
      depth: 0.08, bevelEnabled: false
    });
    const fender = new THREE.Mesh(fenderGeo, jcbYellow);
    fender.rotation.y = Math.PI / 2;
    fender.position.set(x > 0 ? x + 0.04 : x - 0.04, 0.52, z);
    group.add(fender);
  });

  /* ═══════════════════════════════════════════════════════════
     PARTS MANIFEST
     ═══════════════════════════════════════════════════════════ */
  const parts = [
    {
      name: 'Telescopic Boom Assembly',
      description: 'Three-section telescopic boom with wear pads and internal extension cylinder, providing up to 17m reach.',
      material: 'High-strength low-alloy steel (S690QL)',
      function: 'Extends and retracts to position the fork carriage at variable heights and reaches for material placement.',
      assemblyOrder: 1,
      connections: ['Boom pivot mount', 'Lift hydraulic cylinder', 'Fork carriage quick-attach'],
      failureEffect: 'Boom cannot extend or retract; load positioning becomes impossible.',
      cascadeFailures: ['Fork Carriage', 'Telescope Hydraulic Cylinder'],
      originalPosition: { x: 0, y: 1.75, z: 0.2 },
      explodedPosition: { x: 0, y: 4.5, z: 3.0 }
    },
    {
      name: 'Quick-Attach Fork Carriage',
      description: 'ISO standard quick-coupler carriage with load backrest grid, two heavy-duty fork tines, and tilt cylinder.',
      material: 'Forged structural steel, hardened fork tines',
      function: 'Lifts and transports palletized loads, with quick-change coupling for alternative attachments (bucket, winch, jib).',
      assemblyOrder: 2,
      connections: ['Boom section 3 end', 'Tilt hydraulic cylinder', 'Hydraulic hoses'],
      failureEffect: 'Inability to engage or release attachments; load handling ceases.',
      cascadeFailures: ['Hydraulic Hose System'],
      originalPosition: { x: 0, y: 1.9, z: 6.7 },
      explodedPosition: { x: 0, y: 3.0, z: 10.0 }
    },
    {
      name: 'Outrigger Stabilizer System',
      description: 'Four corner-mounted hydraulic outriggers with slide-out beams and ground contact pads for maximum stability.',
      material: 'Box-section structural steel beams, chrome hydraulic rods',
      function: 'Deploys to widen the machine footprint and prevent tipping when handling heavy loads at full reach.',
      assemblyOrder: 3,
      connections: ['Main chassis frame corners', 'Hydraulic control valve block'],
      failureEffect: 'Reduced stability envelope; machine may tip under rated loads at extended boom angles.',
      cascadeFailures: ['Load Moment Indicator safety system'],
      originalPosition: { x: 0, y: 0.42, z: 0 },
      explodedPosition: { x: 3.5, y: -1.0, z: 0 }
    },
    {
      name: 'Operator Cab (ROPS/FOPS)',
      description: 'Fully enclosed pressurized cab with ROPS/FOPS certified frame, tinted safety glass, climate control, and ergonomic joystick controls.',
      material: 'Welded steel ROPS frame, laminated safety glass, polyurethane seat foam',
      function: 'Provides safe, comfortable environment for the operator with full visibility and precision hydraulic controls.',
      assemblyOrder: 4,
      connections: ['Chassis top plate', 'Hydraulic control valve', 'Electrical harness'],
      failureEffect: 'Operator safety compromised; loss of environmental protection and control ergonomics.',
      cascadeFailures: ['Control joysticks', 'Display electronics'],
      originalPosition: { x: 0, y: 2.1, z: 1.0 },
      explodedPosition: { x: -3.0, y: 4.0, z: 1.0 }
    },
    {
      name: 'Drivetrain & Wheel Assembly',
      description: 'Four large industrial tires with deep chevron tread on 8-spoke alloy rims, connected through rigid axles with limited suspension.',
      material: 'Bias-ply rubber compound tires, forged aluminum rims, alloy steel axles',
      function: 'Provides traction and mobility on rough construction sites with all-wheel drive capability.',
      assemblyOrder: 5,
      connections: ['Front and rear axles', 'Steering linkage', 'Differential lock'],
      failureEffect: 'Loss of mobility or traction; machine becomes stationary.',
      cascadeFailures: ['Steering system', 'Axle bearings'],
      originalPosition: { x: 0, y: 0.52, z: 0 },
      explodedPosition: { x: 0, y: -2.0, z: 0 }
    },
    {
      name: 'Hydraulic Lift Cylinder',
      description: 'Double-acting hydraulic cylinder with chrome-plated piston rod that raises and lowers the boom.',
      material: 'Honed steel barrel, hard-chrome piston rod, polyurethane seals',
      function: 'Converts hydraulic pressure to linear force, providing precise boom angle control from -3° to +70°.',
      assemblyOrder: 6,
      connections: ['Chassis pivot bracket', 'Boom section 1 mounting lug', 'Hydraulic pump'],
      failureEffect: 'Boom cannot be raised or lowered; load held at last position (check valve prevents freefall).',
      cascadeFailures: ['Boom Assembly', 'Hydraulic pump load'],
      originalPosition: { x: 0.35, y: 1.0, z: 0.2 },
      explodedPosition: { x: 2.5, y: 2.5, z: 0.2 }
    },
    {
      name: 'Engine & Powertrain',
      description: 'Tier 4 Final turbocharged diesel engine (4.4L, 130hp) with hydrostatic transmission mounted in rear compartment.',
      material: 'Cast iron block, aluminum cylinder head, steel crankshaft',
      function: 'Provides mechanical power for hydraulic pumps, drivetrain, and electrical systems.',
      assemblyOrder: 7,
      connections: ['Engine mounts on chassis', 'Hydraulic pump drive', 'Radiator and cooling system'],
      failureEffect: 'Complete loss of all machine functions: hydraulics, drive, and electrical.',
      cascadeFailures: ['All hydraulic systems', 'Drivetrain', 'Electrical system'],
      originalPosition: { x: 0, y: 1.25, z: -1.2 },
      explodedPosition: { x: 0, y: 3.5, z: -4.0 }
    }
  ];

  /* ═══════════════════════════════════════════════════════════
     QUIZ QUESTIONS
     ═══════════════════════════════════════════════════════════ */
  const quizQuestions = [
    {
      question: 'What is the primary purpose of the outrigger stabilizers on a telehandler?',
      options: [
        'To increase ground clearance for rough terrain',
        'To widen the machine\'s footprint and prevent tipping during extended boom operations',
        'To provide additional hydraulic power for the boom',
        'To act as emergency brakes on slopes'
      ],
      correct: 1,
      explanation: 'Outrigger stabilizers extend outward and down to increase the machine\'s effective wheelbase, dramatically improving stability when the telescopic boom is extended with heavy loads, preventing the machine from tipping over.',
      difficulty: 'medium'
    },
    {
      question: 'How does the telescopic boom achieve its extended reach?',
      options: [
        'By rotating a series of articulated joints like a robot arm',
        'Through nested boom sections that slide within each other, driven by internal hydraulic cylinders',
        'By inflating pneumatic chambers within the boom structure',
        'Through a cable-and-pulley system that extends a single section'
      ],
      correct: 1,
      explanation: 'The telescopic boom uses nested rectangular steel sections that slide telescopically within each other. Wear pads ensure smooth, aligned travel while internal hydraulic cylinders (telescope cylinders) push the sections outward in sequence.',
      difficulty: 'easy'
    },
    {
      question: 'What does the "quick-attach" system on the fork carriage allow the operator to do?',
      options: [
        'Quickly adjust the fork spacing for different pallet sizes',
        'Rapidly swap between different attachments (forks, bucket, winch, jib) without leaving the cab',
        'Automatically level the forks when the boom angle changes',
        'Emergency-release the load in case of hydraulic failure'
      ],
      correct: 1,
      explanation: 'The quick-attach (quick-coupler) system uses standardized hooks and locking pins that allow the operator to hydraulically release one attachment and engage another in minutes, making the telehandler an extremely versatile tool on site.',
      difficulty: 'medium'
    },
    {
      question: 'What safety certification do the ROPS and FOPS on the operator cab represent?',
      options: [
        'Roll-Over Protective Structure and Falling Object Protective Structure',
        'Rotational Overload Protection System and Front Obstacle Prevention System',
        'Rear Operator Positioning Sensor and Forward Object Proximity Scanner',
        'Reinforced Overhead Panel Support and Fire-resistant Operator Panel System'
      ],
      correct: 0,
      explanation: 'ROPS (Roll-Over Protective Structure) protects the operator if the machine rolls over, while FOPS (Falling Object Protective Structure) shields against objects dropping from above. Both are critical safety standards (ISO 3471 and ISO 3449) for construction equipment.',
      difficulty: 'hard'
    },
    {
      question: 'Why are telehandler tires typically larger than standard vehicle tires with aggressive tread patterns?',
      options: [
        'Larger tires make the machine appear more impressive on job sites',
        'They provide lower ground pressure and better traction on uneven, soft, or muddy construction terrain',
        'They are required by law for all vehicles exceeding 5 tonnes',
        'Larger tires reduce the need for suspension components'
      ],
      correct: 1,
      explanation: 'Large tires with deep chevron or lug treads distribute the machine\'s heavy weight over a larger contact patch, reducing ground pressure to prevent sinking in soft soil, while aggressive tread patterns provide maximum traction on loose, muddy, or uneven construction site surfaces.',
      difficulty: 'easy'
    }
  ];

  /* ═══════════════════════════════════════════════════════════
     ANIMATION
     ═══════════════════════════════════════════════════════════ */
  function animate(time, speed, _meshes) {
    const t = time * speed;

    // ── Wheel rotation (forward drive)
    wheelMeshArray.forEach(wheel => {
      wheel.rotation.y += 0.008 * speed;
    });

    // ── Boom raise/lower oscillation
    if (meshes.boom) {
      meshes.boom.rotation.x = -0.15 + Math.sin(t * 0.3) * 0.2;
    }

    // ── Telescope extension/retraction
    if (meshes.boomSection2) {
      const teleExtend = (Math.sin(t * 0.25) + 1) * 0.4;
      meshes.boomSection2.position.z = 3.7 + teleExtend;
    }
    if (meshes.boomSection3) {
      const teleExtend3 = (Math.sin(t * 0.25 + 0.5) + 1) * 0.3;
      meshes.boomSection3.position.z = 5.0 + teleExtend3;
    }

    // ── Lift cylinder piston animation
    if (meshes.liftRod) {
      meshes.liftRod.position.z = 1.9 + Math.sin(t * 0.3) * 0.25;
    }

    // ── Telescope cylinder rod animation
    if (meshes.teleRod) {
      meshes.teleRod.position.z = 4.0 + (Math.sin(t * 0.25) + 1) * 0.3;
    }

    // ── Outrigger deploy oscillation
    if (meshes.outriggerRods) {
      meshes.outriggerRods.forEach(rod => {
        const deploy = (Math.sin(t * 0.2) + 1) * 0.15;
        rod.position.y = -0.5 - deploy;
      });
    }

    // ── Beacon light rotation (pulsing)
    if (meshes.beacon) {
      meshes.beacon.material.emissiveIntensity = 0.4 + Math.abs(Math.sin(t * 3.0)) * 0.8;
    }

    // ── Dashboard display pulse
    if (meshes.display) {
      meshes.display.material.emissiveIntensity = 0.5 + Math.sin(t * 2.0) * 0.3;
    }

    // ── Neon strip glow oscillation
    if (meshes.neonStrip) {
      meshes.neonStrip.material.emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.4;
    }

    // ── Under-chassis neon pulse
    if (meshes.underNeon) {
      meshes.underNeon.material.emissiveIntensity = 0.4 + Math.sin(t * 1.8 + 1.0) * 0.35;
    }

    // ── Headlight flicker effect (subtle)
    if (meshes.headlightL) {
      meshes.headlightL.material.emissiveIntensity = 1.0 + Math.sin(t * 8.0) * 0.1;
    }
    if (meshes.headlightR) {
      meshes.headlightR.material.emissiveIntensity = 1.0 + Math.sin(t * 8.0 + 0.5) * 0.1;
    }
  }

  const description = `Modern Telehandler (Telescopic Handler) — JCB 540-style

A versatile construction machine featuring a three-section telescopic boom capable of reaching heights over 17 meters. Equipped with a quick-attach fork carriage system that allows rapid interchange of attachments including forks, buckets, winches, and jibs. Four hydraulic outrigger stabilizers deploy at the corners to maximize stability during heavy lifting operations at extended boom positions.

The machine features a fully enclosed ROPS/FOPS certified operator cab with tinted safety glass, climate control, ergonomic joystick controls, and digital display. Powered by a Tier 4 Final turbocharged diesel engine driving a hydrostatic transmission for smooth, stepless speed control. Four large industrial tires with aggressive chevron tread provide excellent traction on rough construction terrain.

Key systems include the hydraulic lift cylinder for boom angle control, internal telescope cylinders for boom extension, tilt cylinder at the carriage for load leveling, and a comprehensive hydraulic hose routing system. Safety features include Load Moment Indicator (LMI), ROPS/FOPS cab certification, and stabilizer interlock systems.`;

  return { group, parts, description, quizQuestions, animate };
}
