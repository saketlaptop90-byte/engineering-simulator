import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ─── CUSTOM MATERIALS ────────────────────────────────────────────
  const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.7,
    metalness: 0.3, roughness: 0.4
  });
  const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff44, emissiveIntensity: 0.9,
    metalness: 0.2, roughness: 0.3
  });
  const neonBlue = new THREE.MeshStandardMaterial({
    color: 0x00aaff, emissive: 0x0066ff, emissiveIntensity: 0.8,
    metalness: 0.2, roughness: 0.3
  });
  const warningYellow = new THREE.MeshStandardMaterial({
    color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 0.5,
    metalness: 0.2, roughness: 0.5
  });
  const batteryGlow = new THREE.MeshStandardMaterial({
    color: 0x00ff66, emissive: 0x00ff44, emissiveIntensity: 1.2,
    metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.85
  });
  const hydraulicFluid = new THREE.MeshStandardMaterial({
    color: 0xcc3300, emissive: 0x881100, emissiveIntensity: 0.3,
    metalness: 0.6, roughness: 0.3
  });
  const panelDark = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e, emissive: 0x0a0a1e, emissiveIntensity: 0.2,
    metalness: 0.7, roughness: 0.3
  });
  const ledRed = new THREE.MeshStandardMaterial({
    color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.5,
    metalness: 0.1, roughness: 0.2
  });
  const ledGreenBright = new THREE.MeshStandardMaterial({
    color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5,
    metalness: 0.1, roughness: 0.2
  });
  const treadRubber = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, roughness: 0.95, metalness: 0.0
  });
  const rimMetal = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, metalness: 0.9, roughness: 0.15
  });
  const platformFloor = new THREE.MeshStandardMaterial({
    color: 0x555555, metalness: 0.6, roughness: 0.7
  });
  const safetyDecal = new THREE.MeshStandardMaterial({
    color: 0xff2200, emissive: 0xff1100, emissiveIntensity: 0.3,
    metalness: 0.2, roughness: 0.5
  });

  const meshes = {};

  // ─── BASE CHASSIS ────────────────────────────────────────────────
  // Main base body - slightly rounded with chamfered appearance
  const baseGroup = new THREE.Group();

  // Lower chassis frame
  const chassisGeo = new THREE.BoxGeometry(3.2, 0.35, 1.6);
  const chassis = new THREE.Mesh(chassisGeo, neonOrange);
  chassis.position.set(0, 0.175, 0);
  chassis.castShadow = true;
  baseGroup.add(chassis);
  meshes.chassis = chassis;

  // Chassis top plate (diamond-plate texture simulation via slightly raised panels)
  const topPlateGeo = new THREE.BoxGeometry(3.0, 0.04, 1.4);
  const topPlate = new THREE.Mesh(topPlateGeo, darkSteel);
  topPlate.position.set(0, 0.37, 0);
  baseGroup.add(topPlate);

  // Chassis side skirts (left and right)
  for (let side = -1; side <= 1; side += 2) {
    const skirtGeo = new THREE.BoxGeometry(3.1, 0.25, 0.06);
    const skirt = new THREE.Mesh(skirtGeo, darkSteel);
    skirt.position.set(0, 0.22, side * 0.83);
    baseGroup.add(skirt);

    // Side panel lines (decorative grooves)
    for (let i = -1.2; i <= 1.2; i += 0.4) {
      const grooveGeo = new THREE.BoxGeometry(0.02, 0.18, 0.07);
      const groove = new THREE.Mesh(grooveGeo, steel);
      groove.position.set(i, 0.22, side * 0.835);
      baseGroup.add(groove);
    }
  }

  // Front and rear bumpers
  for (let end = -1; end <= 1; end += 2) {
    const bumperGeo = new THREE.BoxGeometry(0.08, 0.20, 1.5);
    const bumper = new THREE.Mesh(bumperGeo, rubber);
    bumper.position.set(end * 1.64, 0.20, 0);
    baseGroup.add(bumper);

    // Bumper corner guards
    for (let cz = -1; cz <= 1; cz += 2) {
      const guardGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.22, 8);
      const guard = new THREE.Mesh(guardGeo, rubber);
      guard.position.set(end * 1.64, 0.20, cz * 0.7);
      baseGroup.add(guard);
    }
  }

  // Undercarriage structural crossmembers
  for (let i = -1; i <= 1; i += 0.5) {
    const crossGeo = new THREE.BoxGeometry(0.08, 0.06, 1.3);
    const cross = new THREE.Mesh(crossGeo, darkSteel);
    cross.position.set(i, 0.03, 0);
    baseGroup.add(cross);
  }

  group.add(baseGroup);

  // ─── REALISTIC TIRES WITH TREAD PATTERNS ─────────────────────────
  const wheelPositions = [
    { x: -1.1, z: -0.85 }, { x: -1.1, z: 0.85 },
    { x: 1.1, z: -0.85 }, { x: 1.1, z: 0.85 }
  ];

  const tiresGroup = new THREE.Group();
  const tireRadius = 0.22;
  const tireWidth = 0.18;

  wheelPositions.forEach((pos, idx) => {
    const wheelAssembly = new THREE.Group();

    // Main tire body - torus for realistic round cross-section
    const tireGeo = new THREE.TorusGeometry(tireRadius, tireWidth * 0.5, 16, 32);
    const tire = new THREE.Mesh(tireGeo, treadRubber);
    tire.rotation.y = Math.PI / 2;
    tire.castShadow = true;
    wheelAssembly.add(tire);

    // Tread pattern - small extruded lugs around circumference
    const lugCount = 28;
    for (let i = 0; i < lugCount; i++) {
      const angle = (i / lugCount) * Math.PI * 2;

      // Outer tread lugs (chunky blocks)
      const lugGeo = new THREE.BoxGeometry(0.035, 0.025, tireWidth * 0.65);
      const lug = new THREE.Mesh(lugGeo, treadRubber);
      lug.position.set(
        Math.cos(angle) * (tireRadius + tireWidth * 0.42),
        Math.sin(angle) * (tireRadius + tireWidth * 0.42),
        0
      );
      lug.rotation.z = angle;
      wheelAssembly.add(lug);

      // Secondary diagonal tread lugs
      if (i % 2 === 0) {
        const lug2Geo = new THREE.BoxGeometry(0.02, 0.018, tireWidth * 0.35);
        const lug2 = new THREE.Mesh(lug2Geo, treadRubber);
        lug2.position.set(
          Math.cos(angle + 0.05) * (tireRadius + tireWidth * 0.35),
          Math.sin(angle + 0.05) * (tireRadius + tireWidth * 0.35),
          tireWidth * 0.12
        );
        lug2.rotation.z = angle + 0.05;
        wheelAssembly.add(lug2);
      }
    }

    // Sidewall text ridges (simulation)
    const sidewallCount = 12;
    for (let s = 0; s < sidewallCount; s++) {
      const sAngle = (s / sidewallCount) * Math.PI * 2;
      for (let side = -1; side <= 1; side += 2) {
        const ridgeGeo = new THREE.BoxGeometry(0.025, 0.008, 0.012);
        const ridge = new THREE.Mesh(ridgeGeo, rubber);
        ridge.position.set(
          Math.cos(sAngle) * (tireRadius),
          Math.sin(sAngle) * (tireRadius),
          side * tireWidth * 0.48
        );
        ridge.rotation.z = sAngle;
        wheelAssembly.add(ridge);
      }
    }

    // Rim - multi-spoke design using cylinders
    const rimGeo = new THREE.CylinderGeometry(tireRadius * 0.65, tireRadius * 0.65, tireWidth * 0.6, 24);
    const rim = new THREE.Mesh(rimGeo, rimMetal);
    rim.rotation.x = Math.PI / 2;
    wheelAssembly.add(rim);

    // Rim center hub
    const hubGeo = new THREE.CylinderGeometry(0.04, 0.04, tireWidth * 0.65, 12);
    const hub = new THREE.Mesh(hubGeo, chrome);
    hub.rotation.x = Math.PI / 2;
    wheelAssembly.add(hub);

    // Rim spokes - 6 spokes
    for (let s = 0; s < 6; s++) {
      const spokeAngle = (s / 6) * Math.PI * 2;
      const spokeGeo = new THREE.BoxGeometry(tireRadius * 0.55, 0.025, tireWidth * 0.3);
      const spoke = new THREE.Mesh(spokeGeo, chrome);
      spoke.position.set(
        Math.cos(spokeAngle) * tireRadius * 0.3,
        Math.sin(spokeAngle) * tireRadius * 0.3,
        0
      );
      spoke.rotation.z = spokeAngle;
      wheelAssembly.add(spoke);
    }

    // Hub cap bolt pattern
    for (let b = 0; b < 5; b++) {
      const bAngle = (b / 5) * Math.PI * 2;
      const boltGeo = new THREE.CylinderGeometry(0.008, 0.008, tireWidth * 0.7, 6);
      const bolt = new THREE.Mesh(boltGeo, steel);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(
        Math.cos(bAngle) * 0.03,
        Math.sin(bAngle) * 0.03,
        0
      );
      wheelAssembly.add(bolt);
    }

    wheelAssembly.position.set(pos.x, tireRadius + 0.02, pos.z);
    tiresGroup.add(wheelAssembly);
    meshes[`tire_${idx}`] = wheelAssembly;
  });

  group.add(tiresGroup);

  // ─── WHEEL AXLES AND SUSPENSION ──────────────────────────────────
  for (let end = -1; end <= 1; end += 2) {
    const axleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.9, 8);
    const axle = new THREE.Mesh(axleGeo, steel);
    axle.rotation.x = Math.PI / 2;
    axle.position.set(end * 1.1, tireRadius + 0.02, 0);
    group.add(axle);

    // Leaf spring suspension mounts
    for (let side = -1; side <= 1; side += 2) {
      const springGeo = new THREE.BoxGeometry(0.3, 0.03, 0.06);
      const spring = new THREE.Mesh(springGeo, darkSteel);
      spring.position.set(end * 1.1, 0.32, side * 0.5);
      group.add(spring);
    }
  }

  // ─── BATTERY COMPARTMENT ─────────────────────────────────────────
  const batteryGroup = new THREE.Group();

  // Battery box housing
  const battBoxGeo = new THREE.BoxGeometry(1.0, 0.28, 1.1);
  const battBox = new THREE.Mesh(battBoxGeo, darkSteel);
  battBox.position.set(-0.8, 0.53, 0);
  battBox.castShadow = true;
  batteryGroup.add(battBox);
  meshes.batteryBox = battBox;

  // Battery access panel (hinged lid)
  const battLidGeo = new THREE.BoxGeometry(0.95, 0.02, 1.05);
  const battLid = new THREE.Mesh(battLidGeo, steel);
  battLid.position.set(-0.8, 0.68, 0);
  batteryGroup.add(battLid);

  // Battery lid handle
  const handleGeo = new THREE.BoxGeometry(0.2, 0.04, 0.04);
  const handle = new THREE.Mesh(handleGeo, chrome);
  handle.position.set(-0.8, 0.70, 0);
  batteryGroup.add(handle);

  // Individual battery cells inside (visible through vents)
  for (let bx = -0.3; bx <= 0.3; bx += 0.2) {
    for (let bz = -0.35; bz <= 0.35; bz += 0.23) {
      const cellGeo = new THREE.BoxGeometry(0.14, 0.2, 0.18);
      const cell = new THREE.Mesh(cellGeo, panelDark);
      cell.position.set(-0.8 + bx, 0.50, bz);
      batteryGroup.add(cell);

      // Battery terminal posts
      const termGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.04, 6);
      const termPos = new THREE.Mesh(termGeo, copper);
      termPos.position.set(-0.8 + bx - 0.04, 0.62, bz);
      batteryGroup.add(termPos);
      const termNeg = new THREE.Mesh(termGeo, steel);
      termNeg.position.set(-0.8 + bx + 0.04, 0.62, bz);
      batteryGroup.add(termNeg);
    }
  }

  // Battery status indicator strip (neon)
  const battIndicatorGeo = new THREE.BoxGeometry(0.6, 0.025, 0.03);
  const battIndicator = new THREE.Mesh(battIndicatorGeo, batteryGlow);
  battIndicator.position.set(-0.8, 0.40, 0.56);
  batteryGroup.add(battIndicator);
  meshes.batteryIndicator = battIndicator;

  // Charging port
  const chargePortGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12);
  const chargePort = new THREE.Mesh(chargePortGeo, copper);
  chargePort.rotation.z = Math.PI / 2;
  chargePort.position.set(-1.32, 0.50, 0.3);
  batteryGroup.add(chargePort);

  // Charging port cover
  const coverGeo = new THREE.BoxGeometry(0.02, 0.12, 0.12);
  const cover = new THREE.Mesh(coverGeo, neonOrange);
  cover.position.set(-1.34, 0.50, 0.3);
  batteryGroup.add(cover);

  // Battery cable runs
  const cablePath1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.55, 0.5),
    new THREE.Vector3(-0.2, 0.58, 0.55),
    new THREE.Vector3(0.0, 0.55, 0.5),
    new THREE.Vector3(0.2, 0.50, 0.45)
  ]);
  const cableGeo1 = new THREE.TubeGeometry(cablePath1, 16, 0.015, 8, false);
  const cable1 = new THREE.Mesh(cableGeo1, rubber);
  batteryGroup.add(cable1);

  const cablePath2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.55, -0.5),
    new THREE.Vector3(-0.2, 0.58, -0.55),
    new THREE.Vector3(0.0, 0.55, -0.5),
    new THREE.Vector3(0.2, 0.50, -0.45)
  ]);
  const cableGeo2 = new THREE.TubeGeometry(cablePath2, 16, 0.015, 8, false);
  const cable2 = new THREE.Mesh(cableGeo2, copper);
  batteryGroup.add(cable2);

  // Ventilation grille on battery box side
  for (let v = 0; v < 8; v++) {
    const ventGeo = new THREE.BoxGeometry(0.02, 0.015, 0.8);
    const vent = new THREE.Mesh(ventGeo, steel);
    vent.position.set(-1.28, 0.44 + v * 0.03, 0);
    batteryGroup.add(vent);
  }

  group.add(batteryGroup);

  // ─── ELECTRIC DRIVE MOTOR ────────────────────────────────────────
  const motorGroup = new THREE.Group();

  // Motor housing (cylindrical)
  const motorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 16);
  const motor = new THREE.Mesh(motorGeo, darkSteel);
  motor.rotation.x = Math.PI / 2;
  motor.position.set(0.8, 0.48, 0);
  motorGroup.add(motor);
  meshes.motor = motor;

  // Motor cooling fins
  for (let f = 0; f < 12; f++) {
    const finAngle = (f / 12) * Math.PI * 2;
    const finGeo = new THREE.BoxGeometry(0.005, 0.28, 0.35);
    const fin = new THREE.Mesh(finGeo, steel);
    fin.position.set(
      0.8 + Math.cos(finAngle) * 0.13,
      0.48 + Math.sin(finAngle) * 0.13,
      0
    );
    fin.rotation.z = finAngle;
    motorGroup.add(fin);
  }

  // Motor drive shaft
  const shaftGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
  const shaft = new THREE.Mesh(shaftGeo, chrome);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.set(0.8, 0.48, 0);
  motorGroup.add(shaft);

  group.add(motorGroup);

  // ─── BASE CONTROL PANEL (Ground-Level Controls) ──────────────────
  const baseControlGroup = new THREE.Group();

  // Control box housing
  const bctrlBoxGeo = new THREE.BoxGeometry(0.35, 0.25, 0.08);
  const bctrlBox = new THREE.Mesh(bctrlBoxGeo, panelDark);
  bctrlBox.position.set(1.3, 0.55, -0.84);
  baseControlGroup.add(bctrlBox);
  meshes.baseControlPanel = bctrlBox;

  // Control panel face plate
  const bctrlFaceGeo = new THREE.BoxGeometry(0.30, 0.20, 0.01);
  const bctrlFace = new THREE.Mesh(bctrlFaceGeo, steel);
  bctrlFace.position.set(1.3, 0.55, -0.89);
  baseControlGroup.add(bctrlFace);

  // E-stop button (big red mushroom button)
  const estopGeo = new THREE.SphereGeometry(0.025, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const estop = new THREE.Mesh(estopGeo, ledRed);
  estop.position.set(1.3, 0.62, -0.90);
  estop.rotation.x = -Math.PI / 2;
  baseControlGroup.add(estop);
  meshes.estopBase = estop;

  // Up/Down toggle switch
  const toggleBaseGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.012, 8);
  const toggleBase = new THREE.Mesh(toggleBaseGeo, darkSteel);
  toggleBase.rotation.x = Math.PI / 2;
  toggleBase.position.set(1.25, 0.55, -0.895);
  baseControlGroup.add(toggleBase);

  const toggleGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.03, 6);
  const toggle = new THREE.Mesh(toggleGeo, chrome);
  toggle.position.set(1.25, 0.56, -0.90);
  toggle.rotation.x = -0.3;
  baseControlGroup.add(toggle);

  // Key switch
  const keySwitchGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.015, 8);
  const keySwitch = new THREE.Mesh(keySwitchGeo, chrome);
  keySwitch.rotation.x = Math.PI / 2;
  keySwitch.position.set(1.35, 0.55, -0.895);
  baseControlGroup.add(keySwitch);

  // Status LEDs on base panel
  const ledPositions = [1.22, 1.27, 1.32, 1.37];
  const ledMats = [ledGreenBright, ledGreenBright, warningYellow, ledRed];
  ledPositions.forEach((lx, li) => {
    const ledGeo = new THREE.SphereGeometry(0.008, 8, 8);
    const led = new THREE.Mesh(ledGeo, ledMats[li]);
    led.position.set(lx, 0.48, -0.90);
    baseControlGroup.add(led);
    meshes[`baseLed_${li}`] = led;
  });

  group.add(baseControlGroup);

  // ─── HYDRAULIC PUMP AND RESERVOIR ────────────────────────────────
  const hydraulicGroup = new THREE.Group();

  // Hydraulic pump body
  const pumpGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12);
  const pump = new THREE.Mesh(pumpGeo, darkSteel);
  pump.position.set(0.3, 0.50, -0.35);
  hydraulicGroup.add(pump);
  meshes.hydraulicPump = pump;

  // Pump mounting flange
  const flangeGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.02, 12);
  const flange = new THREE.Mesh(flangeGeo, steel);
  flange.position.set(0.3, 0.63, -0.35);
  hydraulicGroup.add(flange);

  // Hydraulic fluid reservoir
  const resGeo = new THREE.BoxGeometry(0.25, 0.18, 0.2);
  const reservoir = new THREE.Mesh(resGeo, hydraulicFluid);
  reservoir.position.set(0.3, 0.50, 0.35);
  hydraulicGroup.add(reservoir);

  // Reservoir sight glass
  const sightGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8);
  const sight = new THREE.Mesh(sightGeo, glass);
  sight.position.set(0.43, 0.50, 0.35);
  sight.rotation.z = Math.PI / 2;
  hydraulicGroup.add(sight);

  // Hydraulic lines from pump to cylinder
  const hydLine1Path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.3, 0.65, -0.35),
    new THREE.Vector3(0.3, 0.75, -0.2),
    new THREE.Vector3(0.15, 0.80, 0),
    new THREE.Vector3(0, 0.78, 0)
  ]);
  const hydLine1Geo = new THREE.TubeGeometry(hydLine1Path, 20, 0.012, 8, false);
  const hydLine1 = new THREE.Mesh(hydLine1Geo, darkSteel);
  hydraulicGroup.add(hydLine1);

  const hydLine2Path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.3, 0.50, 0.25),
    new THREE.Vector3(0.3, 0.60, 0.1),
    new THREE.Vector3(0.3, 0.65, -0.15),
    new THREE.Vector3(0.3, 0.63, -0.35)
  ]);
  const hydLine2Geo = new THREE.TubeGeometry(hydLine2Path, 16, 0.010, 8, false);
  const hydLine2 = new THREE.Mesh(hydLine2Geo, copper);
  hydraulicGroup.add(hydLine2);

  // Pressure gauge
  const gaugeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.015, 16);
  const gauge = new THREE.Mesh(gaugeGeo, chrome);
  gauge.rotation.x = Math.PI / 2;
  gauge.position.set(0.3, 0.65, -0.48);
  hydraulicGroup.add(gauge);

  const gaugeFaceGeo = new THREE.CircleGeometry(0.025, 16);
  const gaugeFace = new THREE.Mesh(gaugeFaceGeo, glass);
  gaugeFace.position.set(0.3, 0.65, -0.49);
  hydraulicGroup.add(gaugeFace);

  group.add(hydraulicGroup);

  // ─── SCISSOR MECHANISM (X-Pattern Arms) ──────────────────────────
  const scissorGroup = new THREE.Group();
  const numScissorLevels = 4;
  const armLength = 2.0;
  const armWidth = 0.06;
  const armDepth = 0.04;
  const levelSpacing = 0.40;

  // Hydraulic cylinder for scissor lift
  // Outer cylinder
  const cylOuterGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.2, 12);
  const cylOuter = new THREE.Mesh(cylOuterGeo, chrome);
  cylOuter.position.set(0, 1.2, 0);
  scissorGroup.add(cylOuter);
  meshes.hydraulicCylinder = cylOuter;

  // Inner piston rod
  const cylInnerGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.8, 10);
  const cylInner = new THREE.Mesh(cylInnerGeo, chrome);
  cylInner.position.set(0, 1.95, 0);
  scissorGroup.add(cylInner);
  meshes.pistonRod = cylInner;

  // Cylinder mounting brackets
  const bracketTopGeo = new THREE.BoxGeometry(0.12, 0.04, 0.12);
  const bracketTop = new THREE.Mesh(bracketTopGeo, steel);
  bracketTop.position.set(0, 2.35, 0);
  scissorGroup.add(bracketTop);

  const bracketBotGeo = new THREE.BoxGeometry(0.12, 0.04, 0.12);
  const bracketBot = new THREE.Mesh(bracketBotGeo, steel);
  bracketBot.position.set(0, 0.60, 0);
  scissorGroup.add(bracketBot);

  // Create X-pattern scissor arms at each level
  for (let level = 0; level < numScissorLevels; level++) {
    const yBase = 0.70 + level * levelSpacing;

    for (let side = -1; side <= 1; side += 2) {
      const zOffset = side * 0.55;

      // Left arm of X
      const armLeftGeo = new THREE.BoxGeometry(armLength, armWidth, armDepth);
      const armLeft = new THREE.Mesh(armLeftGeo, warningYellow);
      armLeft.position.set(0, yBase + levelSpacing * 0.25, zOffset);
      armLeft.rotation.z = 0.35;
      armLeft.castShadow = true;
      scissorGroup.add(armLeft);

      // Right arm of X (crossing)
      const armRightGeo = new THREE.BoxGeometry(armLength, armWidth, armDepth);
      const armRight = new THREE.Mesh(armRightGeo, warningYellow);
      armRight.position.set(0, yBase + levelSpacing * 0.25, zOffset);
      armRight.rotation.z = -0.35;
      armRight.castShadow = true;
      scissorGroup.add(armRight);

      // Center pivot pin
      const pivotGeo = new THREE.CylinderGeometry(0.025, 0.025, armDepth + 0.04, 8);
      const pivot = new THREE.Mesh(pivotGeo, chrome);
      pivot.rotation.x = Math.PI / 2;
      pivot.position.set(0, yBase + levelSpacing * 0.25, zOffset);
      scissorGroup.add(pivot);

      // End pins (roller bearings simulation)
      for (let endSide = -1; endSide <= 1; endSide += 2) {
        const pinGeo = new THREE.CylinderGeometry(0.018, 0.018, armDepth + 0.02, 8);
        const pin = new THREE.Mesh(pinGeo, steel);
        pin.rotation.x = Math.PI / 2;
        pin.position.set(
          endSide * (armLength * 0.45) * Math.cos(0.35),
          yBase + levelSpacing * 0.25 + endSide * (armLength * 0.45) * Math.sin(0.35),
          zOffset
        );
        scissorGroup.add(pin);
      }

      // Reinforcement gussets at center of each arm
      const gussetGeo = new THREE.BoxGeometry(0.15, armWidth + 0.02, armDepth + 0.015);
      const gusset = new THREE.Mesh(gussetGeo, steel);
      gusset.position.set(0, yBase + levelSpacing * 0.25, zOffset);
      scissorGroup.add(gusset);
    }

    // Cross bracing between left and right scissor pairs
    const braceGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.0, 6);
    const brace = new THREE.Mesh(braceGeo, steel);
    brace.rotation.x = Math.PI / 2;
    brace.position.set(0, yBase + levelSpacing * 0.25, 0);
    scissorGroup.add(brace);
  }

  // Scissor rail guides (side channels)
  for (let side = -1; side <= 1; side += 2) {
    // Lower guide channel
    const lowerGuideGeo = new THREE.BoxGeometry(2.6, 0.05, 0.06);
    const lowerGuide = new THREE.Mesh(lowerGuideGeo, darkSteel);
    lowerGuide.position.set(0, 0.55, side * 0.62);
    scissorGroup.add(lowerGuide);

    // Upper guide channel
    const upperGuideGeo = new THREE.BoxGeometry(2.6, 0.05, 0.06);
    const upperGuide = new THREE.Mesh(upperGuideGeo, darkSteel);
    upperGuide.position.set(0, 2.55, side * 0.62);
    scissorGroup.add(upperGuide);
  }

  group.add(scissorGroup);
  meshes.scissorGroup = scissorGroup;

  // ─── WORK PLATFORM ───────────────────────────────────────────────
  const platformGroup = new THREE.Group();
  platformGroup.position.set(0, 2.6, 0);

  // Platform base (diamond plate floor)
  const platBaseGeo = new THREE.BoxGeometry(3.0, 0.06, 1.5);
  const platBase = new THREE.Mesh(platBaseGeo, platformFloor);
  platBase.castShadow = true;
  platformGroup.add(platBase);
  meshes.platformBase = platBase;

  // Diamond plate texture pattern (raised dots)
  for (let dx = -1.3; dx <= 1.3; dx += 0.15) {
    for (let dz = -0.6; dz <= 0.6; dz += 0.15) {
      const dotGeo = new THREE.CylinderGeometry(0.012, 0.018, 0.008, 4);
      const dot = new THREE.Mesh(dotGeo, steel);
      dot.position.set(dx, 0.035, dz);
      dot.rotation.y = Math.PI / 4;
      platformGroup.add(dot);
    }
  }

  // Platform extension deck (telescoping)
  const extDeckGeo = new THREE.BoxGeometry(0.8, 0.05, 1.4);
  const extDeck = new THREE.Mesh(extDeckGeo, platformFloor);
  extDeck.position.set(1.85, -0.005, 0);
  platformGroup.add(extDeck);
  meshes.extensionDeck = extDeck;

  // Extension deck rollers
  for (let r = -0.5; r <= 0.5; r += 0.5) {
    const rollerGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.06, 8);
    const roller = new THREE.Mesh(rollerGeo, chrome);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(1.45, -0.03, r);
    platformGroup.add(roller);
  }

  // ─── GUARDRAILS ──────────────────────────────────────────────────
  const railHeight = 1.1;
  const midRailHeight = 0.55;
  const railRadius = 0.018;

  // Create guardrails around platform
  const railPositions = [
    // Back rail
    { start: [-1.5, 0, -0.75], end: [1.5, 0, -0.75] },
    // Front rail
    { start: [-1.5, 0, 0.75], end: [1.5, 0, 0.75] },
    // Left side rail
    { start: [-1.5, 0, -0.75], end: [-1.5, 0, 0.75] },
    // Right side rail (with gate gap handled separately)
    { start: [1.5, 0, -0.75], end: [1.5, 0, 0.3] },
    { start: [1.5, 0, 0.55], end: [1.5, 0, 0.75] }
  ];

  // Corner posts
  const postPositions = [
    [-1.5, -0.75], [-1.5, 0.75], [1.5, -0.75], [1.5, 0.75]
  ];

  postPositions.forEach((pp) => {
    // Main post
    const postGeo = new THREE.CylinderGeometry(0.022, 0.022, railHeight, 8);
    const post = new THREE.Mesh(postGeo, warningYellow);
    post.position.set(pp[0], railHeight / 2 + 0.03, pp[1]);
    platformGroup.add(post);

    // Post cap
    const capGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const cap = new THREE.Mesh(capGeo, warningYellow);
    cap.position.set(pp[0], railHeight + 0.03, pp[1]);
    platformGroup.add(cap);

    // Post base plate
    const basePlateGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.015, 8);
    const basePlate = new THREE.Mesh(basePlateGeo, steel);
    basePlate.position.set(pp[0], 0.04, pp[1]);
    platformGroup.add(basePlate);
  });

  // Intermediate posts
  const intPostPositions = [
    [0, -0.75], [0, 0.75], [-1.5, 0], [1.5, 0]
  ];
  intPostPositions.forEach((pp) => {
    const postGeo = new THREE.CylinderGeometry(0.018, 0.018, railHeight, 8);
    const post = new THREE.Mesh(postGeo, warningYellow);
    post.position.set(pp[0], railHeight / 2 + 0.03, pp[1]);
    platformGroup.add(post);
  });

  // Top and mid horizontal rails
  railPositions.forEach((rp) => {
    const start = new THREE.Vector3(...rp.start);
    const end = new THREE.Vector3(...rp.end);
    const length = start.distanceTo(end);
    const mid = start.clone().add(end).multiplyScalar(0.5);

    for (const h of [railHeight, midRailHeight]) {
      const railGeo = new THREE.CylinderGeometry(railRadius, railRadius, length, 8);
      const rail = new THREE.Mesh(railGeo, warningYellow);

      // Orient the rail
      if (Math.abs(start.x - end.x) > 0.01) {
        rail.rotation.z = Math.PI / 2;
      } else {
        rail.rotation.x = Math.PI / 2;
      }
      rail.position.set(mid.x, h + 0.03, mid.z);
      platformGroup.add(rail);
    }
  });

  // Toe board (kick plate) around platform bottom
  const toePositions = [
    { pos: [0, 0.06, -0.75], size: [3.0, 0.12, 0.02] },
    { pos: [0, 0.06, 0.75], size: [3.0, 0.12, 0.02] },
    { pos: [-1.5, 0.06, 0], size: [0.02, 0.12, 1.5] },
    { pos: [1.5, 0.06, 0], size: [0.02, 0.12, 1.5] }
  ];
  toePositions.forEach((tp) => {
    const toeGeo = new THREE.BoxGeometry(...tp.size);
    const toe = new THREE.Mesh(toeGeo, warningYellow);
    toe.position.set(...tp.pos);
    platformGroup.add(toe);
  });

  // Safety gate (swing type)
  const gateGroup = new THREE.Group();
  const gatePostGeo = new THREE.CylinderGeometry(0.015, 0.015, railHeight, 8);
  const gatePost = new THREE.Mesh(gatePostGeo, safetyDecal);
  gatePost.position.set(1.5, railHeight / 2 + 0.03, 0.3);
  gateGroup.add(gatePost);

  // Gate bars
  for (const h of [railHeight, midRailHeight]) {
    const gateBarGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.25, 6);
    const gateBar = new THREE.Mesh(gateBarGeo, safetyDecal);
    gateBar.rotation.x = Math.PI / 2;
    gateBar.position.set(1.5, h + 0.03, 0.42);
    gateGroup.add(gateBar);
  }

  // Gate latch
  const latchGeo = new THREE.BoxGeometry(0.03, 0.04, 0.03);
  const latch = new THREE.Mesh(latchGeo, chrome);
  latch.position.set(1.5, midRailHeight + 0.03, 0.54);
  gateGroup.add(latch);

  platformGroup.add(gateGroup);
  meshes.safetyGate = gateGroup;

  // ─── PLATFORM CONTROL PANEL ──────────────────────────────────────
  const platControlGroup = new THREE.Group();

  // Control panel pedestal
  const pedestalGeo = new THREE.BoxGeometry(0.08, 0.65, 0.08);
  const pedestal = new THREE.Mesh(pedestalGeo, darkSteel);
  pedestal.position.set(1.35, 0.35, -0.6);
  platControlGroup.add(pedestal);

  // Control panel housing (angled top)
  const panelGeo = new THREE.BoxGeometry(0.4, 0.06, 0.35);
  const panel = new THREE.Mesh(panelGeo, panelDark);
  panel.position.set(1.35, 0.70, -0.6);
  panel.rotation.x = -0.3;
  platControlGroup.add(panel);
  meshes.platformControlPanel = panel;

  // Joystick
  const joyBaseGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.02, 12);
  const joyBase = new THREE.Mesh(joyBaseGeo, rubber);
  joyBase.position.set(1.35, 0.74, -0.55);
  platControlGroup.add(joyBase);

  const joyStickGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8);
  const joyStick = new THREE.Mesh(joyStickGeo, chrome);
  joyStick.position.set(1.35, 0.78, -0.55);
  platControlGroup.add(joyStick);
  meshes.joystick = joyStick;

  const joyKnobGeo = new THREE.SphereGeometry(0.015, 8, 8);
  const joyKnob = new THREE.Mesh(joyKnobGeo, rubber);
  joyKnob.position.set(1.35, 0.81, -0.55);
  platControlGroup.add(joyKnob);

  // Drive speed control dial
  const dialGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.015, 12);
  const dial = new THREE.Mesh(dialGeo, chrome);
  dial.position.set(1.25, 0.73, -0.65);
  platControlGroup.add(dial);

  // Platform E-stop button
  const pEstopGeo = new THREE.SphereGeometry(0.03, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const pEstop = new THREE.Mesh(pEstopGeo, ledRed);
  pEstop.position.set(1.45, 0.74, -0.65);
  pEstop.rotation.x = -Math.PI / 2 - 0.3;
  platControlGroup.add(pEstop);
  meshes.estopPlatform = pEstop;

  // LCD Display screen
  const lcdGeo = new THREE.BoxGeometry(0.12, 0.005, 0.06);
  const lcdMat = new THREE.MeshStandardMaterial({
    color: 0x002244, emissive: 0x003366, emissiveIntensity: 1.0,
    metalness: 0.1, roughness: 0.2
  });
  const lcd = new THREE.Mesh(lcdGeo, lcdMat);
  lcd.position.set(1.35, 0.74, -0.72);
  lcd.rotation.x = -0.3;
  platControlGroup.add(lcd);
  meshes.lcdDisplay = lcd;

  // Control function buttons (small colored buttons)
  const btnColors = [neonGreen, neonBlue, warningYellow, ledRed];
  const btnLabels = ['UP', 'DOWN', 'DRIVE', 'HORN'];
  for (let bi = 0; bi < 4; bi++) {
    const btnGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 8);
    const btn = new THREE.Mesh(btnGeo, btnColors[bi]);
    btn.position.set(1.22 + bi * 0.045, 0.73, -0.50);
    platControlGroup.add(btn);
    meshes[`platBtn_${bi}`] = btn;
  }

  platformGroup.add(platControlGroup);

  // ─── PLATFORM ACCESSORIES ────────────────────────────────────────
  // Tool tray
  const trayGeo = new THREE.BoxGeometry(0.5, 0.04, 0.15);
  const tray = new THREE.Mesh(trayGeo, steel);
  tray.position.set(-1.0, 0.05, 0.68);
  platformGroup.add(tray);

  // Tray side walls
  for (let ts = -1; ts <= 1; ts += 2) {
    const tsGeo = new THREE.BoxGeometry(0.5, 0.06, 0.01);
    const tsWall = new THREE.Mesh(tsGeo, steel);
    tsWall.position.set(-1.0, 0.07, 0.68 + ts * 0.075);
    platformGroup.add(tsWall);
  }

  // Lanyard anchor points
  for (let la = -0.5; la <= 0.5; la += 1) {
    const anchorGeo = new THREE.TorusGeometry(0.025, 0.006, 8, 12);
    const anchor = new THREE.Mesh(anchorGeo, chrome);
    anchor.position.set(la, railHeight + 0.05, -0.75);
    anchor.rotation.x = Math.PI / 2;
    platformGroup.add(anchor);
  }

  group.add(platformGroup);
  meshes.platformGroup = platformGroup;

  // ─── WARNING LIGHTS AND BEACONS ──────────────────────────────────
  // Rotating beacon on platform corner
  const beaconGroup = new THREE.Group();
  const beaconBaseGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.04, 12);
  const beaconBase = new THREE.Mesh(beaconBaseGeo, darkSteel);
  beaconBase.position.set(-1.5, railHeight + 2.65, -0.75);
  beaconGroup.add(beaconBase);

  const beaconLensGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.06, 12);
  const beaconLensMat = new THREE.MeshStandardMaterial({
    color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.8, metalness: 0.1, roughness: 0.2
  });
  const beaconLens = new THREE.Mesh(beaconLensGeo, beaconLensMat);
  beaconLens.position.set(-1.5, railHeight + 2.70, -0.75);
  beaconGroup.add(beaconLens);
  meshes.beaconLens = beaconLens;

  const beaconTopGeo = new THREE.ConeGeometry(0.03, 0.03, 12);
  const beaconTop = new THREE.Mesh(beaconTopGeo, darkSteel);
  beaconTop.position.set(-1.5, railHeight + 2.76, -0.75);
  beaconGroup.add(beaconTop);

  group.add(beaconGroup);

  // Front and rear work lights on platform
  for (let lx = -1; lx <= 1; lx += 2) {
    const lightHouseGeo = new THREE.BoxGeometry(0.08, 0.06, 0.04);
    const lightHouse = new THREE.Mesh(lightHouseGeo, darkSteel);
    lightHouse.position.set(lx * 1.3, railHeight + 2.63, 0.76);
    group.add(lightHouse);

    const lightLensGeo = new THREE.CircleGeometry(0.025, 12);
    const lightLensMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffffcc, emissiveIntensity: 1.0,
      metalness: 0.1, roughness: 0.2
    });
    const lightLens = new THREE.Mesh(lightLensGeo, lightLensMat);
    lightLens.position.set(lx * 1.3, railHeight + 2.63, 0.77);
    group.add(lightLens);
    meshes[`workLight_${lx}`] = lightLens;
  }

  // ─── SAFETY DECALS AND MARKINGS ──────────────────────────────────
  // Warning stripes on chassis edges (alternating yellow-black)
  for (let i = 0; i < 16; i++) {
    const stripeGeo = new THREE.BoxGeometry(0.18, 0.06, 0.01);
    const stripeMat = i % 2 === 0 ? warningYellow : panelDark;
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(-1.4 + i * 0.18, 0.08, 0.81);
    group.add(stripe);

    const stripeBack = new THREE.Mesh(stripeGeo.clone(), stripeMat);
    stripeBack.position.set(-1.4 + i * 0.18, 0.08, -0.81);
    group.add(stripeBack);
  }

  // ─── POTHOLE PROTECTION / TILT SENSOR ────────────────────────────
  const tiltSensorGeo = new THREE.BoxGeometry(0.06, 0.04, 0.06);
  const tiltSensor = new THREE.Mesh(tiltSensorGeo, neonBlue);
  tiltSensor.position.set(0.5, 0.40, 0);
  group.add(tiltSensor);
  meshes.tiltSensor = tiltSensor;

  // Pothole protection bars (front and rear)
  for (let end = -1; end <= 1; end += 2) {
    const protBarGeo = new THREE.BoxGeometry(0.04, 0.04, 1.3);
    const protBar = new THREE.Mesh(protBarGeo, rubber);
    protBar.position.set(end * 1.55, 0.06, 0);
    group.add(protBar);

    // Bar pivot brackets
    for (let side = -1; side <= 1; side += 2) {
      const bracketGeo2 = new THREE.BoxGeometry(0.06, 0.06, 0.04);
      const bracket2 = new THREE.Mesh(bracketGeo2, darkSteel);
      bracket2.position.set(end * 1.55, 0.10, side * 0.55);
      group.add(bracket2);
    }
  }

  // ─── NEON ACCENT LIGHTING (Futuristic touches) ───────────────────
  // Underglow neon strips
  for (let side = -1; side <= 1; side += 2) {
    const neonStripGeo = new THREE.BoxGeometry(2.8, 0.01, 0.02);
    const neonStrip = new THREE.Mesh(neonStripGeo, neonBlue);
    neonStrip.position.set(0, 0.02, side * 0.78);
    group.add(neonStrip);
    meshes[`underglow_${side}`] = neonStrip;
  }

  // Scissor arm accent lighting
  for (let level = 0; level < numScissorLevels; level++) {
    const accentGeo = new THREE.BoxGeometry(0.02, 0.02, 1.2);
    const accent = new THREE.Mesh(accentGeo, neonGreen);
    accent.position.set(0, 0.80 + level * levelSpacing, 0);
    group.add(accent);
    meshes[`scissorAccent_${level}`] = accent;
  }

  // Platform edge neon strip
  const edgeNeonGeo = new THREE.BoxGeometry(3.0, 0.01, 0.015);
  const edgeNeon = new THREE.Mesh(edgeNeonGeo, neonOrange);
  edgeNeon.position.set(0, 2.56, 0.76);
  group.add(edgeNeon);
  meshes.edgeNeon = edgeNeon;

  // ─── RIVETS AND FASTENERS ────────────────────────────────────────
  // Chassis rivets
  for (let rx = -1.3; rx <= 1.3; rx += 0.3) {
    for (let side = -1; side <= 1; side += 2) {
      const rivetGeo = new THREE.SphereGeometry(0.008, 6, 6);
      const rivet = new THREE.Mesh(rivetGeo, chrome);
      rivet.position.set(rx, 0.30, side * 0.83);
      group.add(rivet);
    }
  }

  // ─── PARTS DEFINITION ───────────────────────────────────────────
  const parts = [
    {
      name: 'Base Chassis',
      description: 'Heavy-duty steel chassis frame that supports all components and provides the machine\'s structural foundation. Features integrated counterweight pockets and mounting points.',
      material: 'Structural steel with powder-coated orange finish',
      function: 'Primary structural support, weight distribution, and component mounting platform',
      assemblyOrder: 1,
      connections: ['Wheel Assemblies', 'Scissor Mechanism', 'Battery Compartment', 'Electric Drive Motor'],
      failureEffect: 'Complete structural failure; machine cannot be used',
      cascadeFailures: ['All systems dependent on chassis integrity'],
      originalPosition: { x: 0, y: 0.175, z: 0 },
      explodedPosition: { x: 0, y: -0.5, z: 0 }
    },
    {
      name: 'Wheel Assemblies',
      description: 'Four non-marking rubber tires with multi-spoke aluminum rims, integrated hub-mounted electric drive motors on front axle, and independent suspension.',
      material: 'Solid non-marking rubber tires on forged aluminum rims',
      function: 'Mobility, traction, and vibration absorption. Front wheels provide steering and drive.',
      assemblyOrder: 2,
      connections: ['Base Chassis', 'Electric Drive Motor'],
      failureEffect: 'Loss of mobility; flat tires can cause platform instability',
      cascadeFailures: ['Tilt Sensor activation', 'Emergency lowering triggered'],
      originalPosition: { x: 0, y: 0.24, z: 0 },
      explodedPosition: { x: 0, y: -1.0, z: 2.0 }
    },
    {
      name: 'Battery Compartment',
      description: 'Sealed battery bay housing 48V deep-cycle AGM batteries with integrated BMS (Battery Management System), temperature monitoring, and automatic charging interface.',
      material: 'Steel housing with sealed lead-acid/lithium-ion cells',
      function: 'Energy storage providing power for lifting, driving, and all electrical systems',
      assemblyOrder: 3,
      connections: ['Base Chassis', 'Electric Drive Motor', 'Hydraulic Pump', 'Control Systems'],
      failureEffect: 'Total power loss; platform may descend to lowest position via gravity lowering',
      cascadeFailures: ['Electric Drive Motor shutdown', 'Hydraulic Pump shutdown', 'Control Panel blackout'],
      originalPosition: { x: -0.8, y: 0.53, z: 0 },
      explodedPosition: { x: -2.5, y: 0.53, z: 0 }
    },
    {
      name: 'Electric Drive Motor',
      description: 'Brushless DC motor with integrated gearbox providing variable-speed drive to the front wheels. Features regenerative braking capability.',
      material: 'Cast iron housing with copper windings and rare-earth magnets',
      function: 'Converts electrical energy to mechanical drive force for machine travel',
      assemblyOrder: 4,
      connections: ['Battery Compartment', 'Wheel Assemblies', 'Platform Control Panel'],
      failureEffect: 'Loss of drive capability; lifting function remains operational',
      cascadeFailures: ['Wheel Assemblies become unpowered'],
      originalPosition: { x: 0.8, y: 0.48, z: 0 },
      explodedPosition: { x: 2.5, y: 0.48, z: 0 }
    },
    {
      name: 'Hydraulic System',
      description: 'Gear-type hydraulic pump driven by electric motor, fluid reservoir with filter, pressure relief valve, and flow control valves. Operates at 3000 PSI.',
      material: 'Hardened steel pump gears, cast iron housing, hydraulic fluid',
      function: 'Generates hydraulic pressure to extend/retract the scissor mechanism via hydraulic cylinder',
      assemblyOrder: 5,
      connections: ['Electric Drive Motor', 'Battery Compartment', 'Scissor Mechanism'],
      failureEffect: 'Cannot raise platform; gravity lowering still possible via manual valve',
      cascadeFailures: ['Scissor Mechanism cannot extend', 'Work Platform stuck at current height'],
      originalPosition: { x: 0.3, y: 0.50, z: 0 },
      explodedPosition: { x: 0.3, y: 0.50, z: -2.0 }
    },
    {
      name: 'Scissor Mechanism',
      description: 'Four-level X-pattern scissor linkage with hardened pivot pins, grease-fitted bearings, and reinforced gusset plates. Extends platform to full height of 32 feet.',
      material: 'High-strength structural steel arms with chrome-plated pivot pins',
      function: 'Converts hydraulic linear motion into vertical platform elevation through mechanical advantage',
      assemblyOrder: 6,
      connections: ['Hydraulic System', 'Base Chassis', 'Work Platform'],
      failureEffect: 'Platform cannot be raised or lowered; potential for catastrophic collapse if pins fail',
      cascadeFailures: ['Work Platform stability compromised', 'Guardrails may deform'],
      originalPosition: { x: 0, y: 1.5, z: 0 },
      explodedPosition: { x: 0, y: 3.0, z: 0 }
    },
    {
      name: 'Work Platform',
      description: 'Full-width diamond-plate steel platform with telescoping extension deck, integrated tool tray, lanyard anchor points, and non-slip surface.',
      material: 'Checker-plate steel with anti-slip coating',
      function: 'Provides the elevated work surface for operators and tools. Extension deck increases lateral reach.',
      assemblyOrder: 7,
      connections: ['Scissor Mechanism', 'Guardrails', 'Platform Control Panel'],
      failureEffect: 'Compromised operator safety; work surface integrity lost',
      cascadeFailures: ['Guardrails destabilized', 'Control Panel inoperable from platform'],
      originalPosition: { x: 0, y: 2.6, z: 0 },
      explodedPosition: { x: 0, y: 5.0, z: 0 }
    },
    {
      name: 'Guardrails & Safety Gate',
      description: 'ANSI/CSA compliant guardrail system with top rail, mid rail, toe boards, and self-closing swing gate with positive latch. 42-inch height.',
      material: 'Powder-coated structural steel tubing',
      function: 'Fall protection for operators on elevated platform, prevents tools from falling',
      assemblyOrder: 8,
      connections: ['Work Platform'],
      failureEffect: 'OSHA violation; severe fall risk for operators',
      cascadeFailures: ['Tool tray may become unsecured'],
      originalPosition: { x: 0, y: 3.15, z: 0 },
      explodedPosition: { x: 0, y: 6.0, z: 1.5 }
    },
    {
      name: 'Platform Control Panel',
      description: 'Proportional joystick control with LCD status display, drive/lift toggles, horn, E-stop mushroom button, and battery charge indicator. Weather-sealed IP65.',
      material: 'ABS plastic housing with silicone-sealed membrane switches',
      function: 'Operator interface for controlling platform elevation, machine travel, steering, and monitoring system status',
      assemblyOrder: 9,
      connections: ['Work Platform', 'Battery Compartment', 'Hydraulic System', 'Electric Drive Motor'],
      failureEffect: 'Cannot control machine from platform; must use ground controls',
      cascadeFailures: ['Operator must descend to use base controls'],
      originalPosition: { x: 1.35, y: 3.3, z: -0.6 },
      explodedPosition: { x: 3.0, y: 4.0, z: -2.0 }
    },
    {
      name: 'Base Control Panel',
      description: 'Ground-level control station with key switch, up/down toggle, E-stop, and status LEDs. Used for lowering platform in emergency or servicing.',
      material: 'Cast aluminum housing with weather-sealed controls',
      function: 'Emergency and maintenance control of platform from ground level; overrides platform controls',
      assemblyOrder: 10,
      connections: ['Base Chassis', 'Hydraulic System', 'Battery Compartment'],
      failureEffect: 'No ground-level override capability; maintenance procedures complicated',
      cascadeFailures: ['Emergency lowering must be done manually'],
      originalPosition: { x: 1.3, y: 0.55, z: -0.84 },
      explodedPosition: { x: 3.0, y: 0.55, z: -2.5 }
    },
    {
      name: 'Warning Beacon & Lights',
      description: 'Amber rotating beacon light with LED work lights. Beacon activates during travel and lifting. Lights illuminate work area.',
      material: 'Polycarbonate lens, LED arrays, steel brackets',
      function: 'Visual safety warning to surrounding personnel; work area illumination',
      assemblyOrder: 11,
      connections: ['Battery Compartment', 'Platform Control Panel'],
      failureEffect: 'Reduced visibility of machine operation to nearby workers',
      cascadeFailures: ['Increased risk of collision incidents'],
      originalPosition: { x: -1.5, y: 3.7, z: -0.75 },
      explodedPosition: { x: -3.0, y: 5.0, z: -2.0 }
    },
    {
      name: 'Tilt Sensor & Pothole Protection',
      description: 'Electronic inclinometer with fold-down pothole protection bars on front and rear. Automatically stops drive when surface is uneven or hole detected.',
      material: 'MEMS accelerometer sensor, steel protection bars with rubber bumpers',
      function: 'Prevents machine from driving into holes or operating on slopes exceeding safe limits',
      assemblyOrder: 12,
      connections: ['Base Chassis', 'Electric Drive Motor', 'Platform Control Panel'],
      failureEffect: 'Machine may operate on unsafe slopes or drive into potholes',
      cascadeFailures: ['Potential tip-over risk', 'Scissor mechanism lateral stress'],
      originalPosition: { x: 0.5, y: 0.40, z: 0 },
      explodedPosition: { x: 0.5, y: -0.5, z: 2.5 }
    }
  ];

  // ─── QUIZ QUESTIONS ──────────────────────────────────────────────
  const quizQuestions = [
    {
      question: 'What type of mechanism does a scissor lift use to raise its work platform?',
      options: [
        'Telescoping boom with cable winch',
        'Linked folding X-pattern supports (pantograph mechanism)',
        'Rack and pinion gear drive',
        'Pneumatic air cushion system'
      ],
      correct: 1,
      explanation: 'Scissor lifts use a pantograph (X-pattern) mechanism where linked, folding supports extend and compress. A hydraulic cylinder pushes the base of the scissor arms apart, causing the X-pattern to elongate vertically and raise the platform.',
      difficulty: 'easy'
    },
    {
      question: 'Why do electric scissor lifts use non-marking rubber tires?',
      options: [
        'To reduce manufacturing costs',
        'To prevent leaving marks on finished indoor floors and surfaces',
        'To increase top speed on highways',
        'To comply with tire recycling regulations'
      ],
      correct: 1,
      explanation: 'Electric scissor lifts are predominantly used indoors on finished surfaces like polished concrete, tile, and epoxy floors. Non-marking (typically gray or white) rubber tires prevent black scuff marks that standard tires would leave, protecting these expensive floor finishes.',
      difficulty: 'medium'
    },
    {
      question: 'What is the purpose of the pothole protection system on a scissor lift?',
      options: [
        'To improve ride comfort over rough terrain',
        'To detect surface depressions and automatically stop the machine before a wheel drops in',
        'To measure the depth of potholes for road repair crews',
        'To deploy outriggers for extra stability'
      ],
      correct: 1,
      explanation: 'Pothole protection bars hang below the chassis at the front and rear. When a bar contacts a depression or drop-off (pothole), it triggers a switch that immediately stops the drive motors, preventing a wheel from dropping into the hole which could destabilize or tip the elevated platform.',
      difficulty: 'medium'
    },
    {
      question: 'What happens if the battery dies while the platform is fully elevated?',
      options: [
        'The platform immediately drops to the ground',
        'The operator must jump down',
        'A manual lowering valve allows controlled gravity descent using hydraulic flow restriction',
        'An emergency parachute deploys'
      ],
      correct: 2,
      explanation: 'All scissor lifts are equipped with an emergency manual lowering valve (usually at ground level). This valve allows hydraulic fluid to flow from the cylinder back to the reservoir under controlled restriction, using gravity and the platform\'s weight to slowly lower the platform without any electrical power.',
      difficulty: 'hard'
    },
    {
      question: 'What is the maximum allowable slope for operating a scissor lift according to ANSI standards?',
      options: [
        '15 degrees in any direction',
        '5 degrees for driving, 3 degrees when elevated',
        '0 degrees - must always be perfectly level',
        '10 degrees for indoor use only'
      ],
      correct: 1,
      explanation: 'ANSI A92.6 standards specify that scissor lifts should not be driven on slopes exceeding 5 degrees, and when the platform is elevated for work, the machine should be on a surface with no more than 3 degrees of tilt. The tilt sensor continuously monitors this and will lock out functions if limits are exceeded.',
      difficulty: 'hard'
    }
  ];

  // ─── DESCRIPTION ─────────────────────────────────────────────────
  const description = `A Modern Electric Scissor Lift (also called a Mobile Elevating Work Platform - MEWP) designed for indoor and outdoor aerial work. This model features a four-level X-pattern scissor mechanism powered by a hydraulic cylinder and electric pump, drawing energy from a 48V battery bank. The machine rides on four non-marking solid rubber tires with independent front-wheel drive and rear-wheel steering.

Key features include:
• Pantograph (X-pattern) scissor mechanism with 4 levels for maximum elevation
• Dual control stations: platform-mounted joystick controls and ground-level emergency panel
• Sealed battery compartment with integrated BMS and charging port
• ANSI-compliant guardrails with mid-rails, toe boards, and self-closing safety gate
• Telescoping platform extension deck for increased lateral reach
• Pothole protection bars with automatic drive cutoff
• Electronic tilt sensor preventing operation on excessive slopes
• Amber rotating beacon and LED work lights
• Non-marking solid rubber tires suitable for finished floor surfaces

Operating capacity is typically 500-1000 lbs with platform heights up to 32 feet. The proportional joystick provides smooth, precise control of drive speed and platform elevation simultaneously.`;

  // ─── ANIMATE ─────────────────────────────────────────────────────
  function animate(time, speed, meshes) {
    const t = time * speed;

    // Scissor group gentle lift/lower oscillation
    if (meshes.scissorGroup) {
      const liftCycle = Math.sin(t * 0.3) * 0.08;
      meshes.scissorGroup.position.y = liftCycle;
    }

    // Platform follows scissor motion
    if (meshes.platformGroup) {
      const platLift = Math.sin(t * 0.3) * 0.08;
      meshes.platformGroup.position.y = 2.6 + platLift;
    }

    // Hydraulic piston extension animation
    if (meshes.pistonRod) {
      meshes.pistonRod.position.y = 1.95 + Math.sin(t * 0.3) * 0.06;
    }

    // Battery indicator pulsing
    if (meshes.batteryIndicator) {
      meshes.batteryIndicator.material.emissiveIntensity = 0.8 + Math.sin(t * 2.0) * 0.4;
      meshes.batteryIndicator.material.opacity = 0.7 + Math.sin(t * 2.0) * 0.3;
    }

    // Beacon light rotation
    if (meshes.beaconLens) {
      meshes.beaconLens.material.emissiveIntensity = 1.0 + Math.sin(t * 6.0) * 1.0;
      const beaconFlash = Math.sin(t * 4.0) > 0.3 ? 1.5 : 0.3;
      meshes.beaconLens.material.opacity = 0.5 + beaconFlash * 0.3;
    }

    // Work lights subtle flicker
    ['workLight_-1', 'workLight_1'].forEach(key => {
      if (meshes[key]) {
        meshes[key].material.emissiveIntensity = 0.9 + Math.sin(t * 8.0 + (key === 'workLight_-1' ? 0 : 1.5)) * 0.1;
      }
    });

    // E-stop buttons subtle glow pulse
    if (meshes.estopBase) {
      meshes.estopBase.material.emissiveIntensity = 1.2 + Math.sin(t * 1.5) * 0.3;
    }
    if (meshes.estopPlatform) {
      meshes.estopPlatform.material.emissiveIntensity = 1.2 + Math.sin(t * 1.5 + 0.5) * 0.3;
    }

    // LCD display content simulation (color shift)
    if (meshes.lcdDisplay) {
      const lcdHue = Math.sin(t * 0.5) * 0.15;
      meshes.lcdDisplay.material.emissiveIntensity = 0.8 + Math.sin(t * 3.0) * 0.2;
    }

    // Joystick micro-movement (operator input simulation)
    if (meshes.joystick) {
      meshes.joystick.rotation.x = Math.sin(t * 1.2) * 0.08;
      meshes.joystick.rotation.z = Math.cos(t * 0.9) * 0.05;
    }

    // Base panel LEDs sequential blinking
    for (let li = 0; li < 4; li++) {
      if (meshes[`baseLed_${li}`]) {
        const phase = t * 2.0 + li * 0.8;
        meshes[`baseLed_${li}`].material.emissiveIntensity = 1.0 + Math.sin(phase) * 0.8;
      }
    }

    // Platform control buttons subtle pulse
    for (let bi = 0; bi < 4; bi++) {
      if (meshes[`platBtn_${bi}`]) {
        const btnPhase = t * 1.5 + bi * 0.6;
        meshes[`platBtn_${bi}`].material.emissiveIntensity = 0.6 + Math.sin(btnPhase) * 0.4;
      }
    }

    // Underglow neon strip pulsing
    ['underglow_-1', 'underglow_1'].forEach((key, idx) => {
      if (meshes[key]) {
        meshes[key].material.emissiveIntensity = 0.6 + Math.sin(t * 1.8 + idx * Math.PI) * 0.4;
      }
    });

    // Scissor accent lighting cascade
    for (let sa = 0; sa < 4; sa++) {
      if (meshes[`scissorAccent_${sa}`]) {
        const cascadePhase = t * 2.5 - sa * 0.4;
        meshes[`scissorAccent_${sa}`].material.emissiveIntensity = 0.5 + Math.sin(cascadePhase) * 0.5;
      }
    }

    // Platform edge neon glow
    if (meshes.edgeNeon) {
      meshes.edgeNeon.material.emissiveIntensity = 0.5 + Math.sin(t * 2.2) * 0.3;
    }

    // Tilt sensor blink
    if (meshes.tiltSensor) {
      meshes.tiltSensor.material.emissiveIntensity = 0.4 + (Math.sin(t * 5.0) > 0.8 ? 1.0 : 0.0);
    }

    // Gentle tire rotation (simulating slow travel)
    for (let ti = 0; ti < 4; ti++) {
      if (meshes[`tire_${ti}`]) {
        meshes[`tire_${ti}`].rotation.z = t * 0.15;
      }
    }

    // Hydraulic pump vibration simulation
    if (meshes.hydraulicPump) {
      meshes.hydraulicPump.position.x = 0.3 + Math.sin(t * 15.0) * 0.002;
      meshes.hydraulicPump.position.y = 0.50 + Math.cos(t * 18.0) * 0.001;
    }

    // Motor rotation
    if (meshes.motor) {
      meshes.motor.rotation.z += 0.02 * speed;
    }

    // Extension deck micro-movement (telescoping simulation)
    if (meshes.extensionDeck) {
      meshes.extensionDeck.position.x = 1.85 + Math.sin(t * 0.4) * 0.1;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
