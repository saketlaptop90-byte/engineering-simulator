import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ── Custom Materials ──────────────────────────────────────────
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.2,
    transparent: true, opacity: 0.85, metalness: 0.3, roughness: 0.2
  });
  const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 1.0,
    transparent: true, opacity: 0.8, metalness: 0.2, roughness: 0.3
  });
  const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff6600, emissiveIntensity: 0.9,
    transparent: true, opacity: 0.75, metalness: 0.3, roughness: 0.25
  });
  const waterBlue = new THREE.MeshStandardMaterial({
    color: 0x2288ff, emissive: 0x1166cc, emissiveIntensity: 0.5,
    transparent: true, opacity: 0.55, metalness: 0.1, roughness: 0.1
  });
  const galvanizedSteel = new THREE.MeshStandardMaterial({
    color: 0xaab0b5, metalness: 0.85, roughness: 0.25
  });
  const paintedRed = new THREE.MeshStandardMaterial({
    color: 0xcc2222, metalness: 0.4, roughness: 0.5
  });
  const yellowPaint = new THREE.MeshStandardMaterial({
    color: 0xf0c020, metalness: 0.3, roughness: 0.5
  });
  const motorGrey = new THREE.MeshStandardMaterial({
    color: 0x555555, metalness: 0.7, roughness: 0.35
  });
  const hoseBlack = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, metalness: 0.1, roughness: 0.85
  });

  const meshes = {};

  // ════════════════════════════════════════════════════════════════
  // 1. MAIN PIPELINE SPAN (galvanized steel pipe)
  // ════════════════════════════════════════════════════════════════
  const pipeLength = 14;
  const pipeGeo = new THREE.CylinderGeometry(0.16, 0.16, pipeLength, 24);
  const pipe = new THREE.Mesh(pipeGeo, galvanizedSteel);
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(0, 3.6, 0);
  group.add(pipe);
  meshes.pipeline = pipe;

  // Pipe coupling flanges
  for (let i = -3; i <= 3; i++) {
    const flangeGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16);
    const flange = new THREE.Mesh(flangeGeo, darkSteel);
    flange.rotation.z = Math.PI / 2;
    flange.position.set(i * 2, 3.6, 0);
    group.add(flange);
    // Flange bolts
    for (let b = 0; b < 6; b++) {
      const boltGeo = new THREE.SphereGeometry(0.02, 6, 6);
      const bolt = new THREE.Mesh(boltGeo, chrome);
      const angle = (b / 6) * Math.PI * 2;
      bolt.position.set(
        i * 2 + 0.04,
        3.6 + Math.cos(angle) * 0.19,
        Math.sin(angle) * 0.19
      );
      group.add(bolt);
    }
  }

  // ════════════════════════════════════════════════════════════════
  // 2. A-FRAME STEEL TOWER (main structural tower)
  // ════════════════════════════════════════════════════════════════
  const aFrameGroup = new THREE.Group();

  // Left leg
  const legGeo = new THREE.CylinderGeometry(0.06, 0.08, 3.8, 12);
  const leftLeg = new THREE.Mesh(legGeo, galvanizedSteel);
  leftLeg.position.set(0, 1.8, -0.8);
  leftLeg.rotation.x = 0.21;
  aFrameGroup.add(leftLeg);

  // Right leg
  const rightLeg = new THREE.Mesh(legGeo, galvanizedSteel);
  rightLeg.position.set(0, 1.8, 0.8);
  rightLeg.rotation.x = -0.21;
  aFrameGroup.add(rightLeg);

  // Cross brace (horizontal)
  const crossGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 10);
  const crossBrace = new THREE.Mesh(crossGeo, galvanizedSteel);
  crossBrace.rotation.x = Math.PI / 2;
  crossBrace.position.set(0, 1.6, 0);
  aFrameGroup.add(crossBrace);

  // Diagonal cross braces
  const diagGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.4, 8);
  const diag1 = new THREE.Mesh(diagGeo, darkSteel);
  diag1.rotation.set(0.45, 0, 0.3);
  diag1.position.set(0, 2.0, -0.3);
  aFrameGroup.add(diag1);

  const diag2 = new THREE.Mesh(diagGeo, darkSteel);
  diag2.rotation.set(-0.45, 0, 0.3);
  diag2.position.set(0, 2.0, 0.3);
  aFrameGroup.add(diag2);

  // Apex plate (connects legs to pipe)
  const apexGeo = new THREE.BoxGeometry(0.25, 0.15, 0.35);
  const apex = new THREE.Mesh(apexGeo, darkSteel);
  apex.position.set(0, 3.55, 0);
  aFrameGroup.add(apex);

  // Gusset plates at apex
  for (let side = -1; side <= 1; side += 2) {
    const gussetGeo = new THREE.BufferGeometry();
    const gVerts = new Float32Array([
      0, 3.45, side * 0.18,
      -0.12, 3.55, side * 0.18,
      0.12, 3.55, side * 0.18
    ]);
    gussetGeo.setAttribute('position', new THREE.BufferAttribute(gVerts, 3));
    gussetGeo.computeVertexNormals();
    const gusset = new THREE.Mesh(gussetGeo, darkSteel);
    aFrameGroup.add(gusset);
  }

  // Base plates (foot pads)
  for (let side = -1; side <= 1; side += 2) {
    const basePlateGeo = new THREE.BoxGeometry(0.3, 0.04, 0.3);
    const basePlate = new THREE.Mesh(basePlateGeo, darkSteel);
    basePlate.position.set(0, 0.02, side * 1.2);
    aFrameGroup.add(basePlate);
    // Anchor bolts
    for (let ab = -1; ab <= 1; ab += 2) {
      for (let ac = -1; ac <= 1; ac += 2) {
        const abGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6);
        const anchor = new THREE.Mesh(abGeo, chrome);
        anchor.position.set(ab * 0.1, 0.06, side * 1.2 + ac * 0.1);
        aFrameGroup.add(anchor);
      }
    }
  }

  group.add(aFrameGroup);
  meshes.aFrame = aFrameGroup;

  // ════════════════════════════════════════════════════════════════
  // 3. TRUSS ROD SUPPORTS (diagonal rods supporting the pipe)
  // ════════════════════════════════════════════════════════════════
  const trussGroup = new THREE.Group();

  for (let i = -6; i <= 6; i++) {
    if (i === 0) continue; // skip tower position
    const xPos = i * 1.0;

    // Upper truss rod (pipe to upper node)
    const upperRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6);
    const upperRod = new THREE.Mesh(upperRodGeo, galvanizedSteel);
    upperRod.position.set(xPos + 0.3, 3.0, 0);
    upperRod.rotation.z = 0.7 * Math.sign(i);
    trussGroup.add(upperRod);

    // Lower truss rod
    const lowerRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6);
    const lowerRod = new THREE.Mesh(lowerRodGeo, galvanizedSteel);
    lowerRod.position.set(xPos - 0.3, 3.0, 0);
    lowerRod.rotation.z = -0.7 * Math.sign(i);
    trussGroup.add(lowerRod);

    // Vertical hanger
    const hangerGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6);
    const hanger = new THREE.Mesh(hangerGeo, darkSteel);
    hanger.position.set(xPos, 3.15, 0);
    trussGroup.add(hanger);

    // Turnbuckle tensioners (small detail)
    const tbGeo = new THREE.CylinderGeometry(0.025, 0.018, 0.08, 8);
    const tb = new THREE.Mesh(tbGeo, chrome);
    tb.position.set(xPos + 0.15, 2.85, 0);
    tb.rotation.z = 0.7 * Math.sign(i);
    trussGroup.add(tb);

    // Neon status indicator on every other truss
    if (i % 2 === 0) {
      const indicatorGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const indicator = new THREE.Mesh(indicatorGeo, neonGreen);
      indicator.position.set(xPos, 3.8, 0.18);
      trussGroup.add(indicator);
    }
  }

  // Lower support truss rod - catenary style cable below pipe
  const cablePoints = [];
  for (let t = 0; t <= 20; t++) {
    const frac = t / 20;
    const x = -7 + frac * 14;
    const sag = -0.6 * Math.sin(frac * Math.PI);
    cablePoints.push(new THREE.Vector3(x, 2.8 + sag, 0));
  }
  const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
  const cableTubeGeo = new THREE.TubeGeometry(cableCurve, 40, 0.018, 8, false);
  const cable = new THREE.Mesh(cableTubeGeo, darkSteel);
  trussGroup.add(cable);

  // Second cable on opposite side
  const cablePoints2 = cablePoints.map(p => new THREE.Vector3(p.x, p.y, -p.z));
  // Actually offset on Z
  const cablePoints2b = [];
  for (let t = 0; t <= 20; t++) {
    const frac = t / 20;
    const x = -7 + frac * 14;
    const sag = -0.5 * Math.sin(frac * Math.PI);
    cablePoints2b.push(new THREE.Vector3(x, 2.85 + sag, 0.15));
  }
  const cableCurve2 = new THREE.CatmullRomCurve3(cablePoints2b);
  const cable2Geo = new THREE.TubeGeometry(cableCurve2, 40, 0.015, 8, false);
  const cable2 = new THREE.Mesh(cable2Geo, galvanizedSteel);
  trussGroup.add(cable2);

  group.add(trussGroup);
  meshes.trussRods = trussGroup;

  // ════════════════════════════════════════════════════════════════
  // 4. KNOBBY TIRE WITH DEEP TREAD LUGS (realistic)
  // ════════════════════════════════════════════════════════════════
  const tireGroup = new THREE.Group();

  // Main tire body (torus)
  const tireRadius = 0.55;
  const tireTube = 0.2;
  const tireGeo = new THREE.TorusGeometry(tireRadius, tireTube, 20, 48);
  const tire = new THREE.Mesh(tireGeo, rubber);
  tire.rotation.y = Math.PI / 2;
  tireGroup.add(tire);

  // Deep-carved tread lugs around circumference
  const lugCount = 36;
  for (let i = 0; i < lugCount; i++) {
    const angle = (i / lugCount) * Math.PI * 2;

    // Main tread lug
    const lugGeo = new THREE.BoxGeometry(0.06, 0.035, 0.12);
    const lug = new THREE.Mesh(lugGeo, rubber);
    const lx = Math.cos(angle) * (tireRadius + tireTube * 0.85);
    const ly = Math.sin(angle) * (tireRadius + tireTube * 0.85);
    lug.position.set(0, ly, lx);
    lug.rotation.x = angle;
    tireGroup.add(lug);

    // Side lugs (chevron pattern)
    if (i % 2 === 0) {
      for (let side = -1; side <= 1; side += 2) {
        const sideLugGeo = new THREE.BoxGeometry(0.08, 0.025, 0.05);
        const sideLug = new THREE.Mesh(sideLugGeo, rubber);
        const slx = Math.cos(angle) * (tireRadius + tireTube * 0.6);
        const sly = Math.sin(angle) * (tireRadius + tireTube * 0.6);
        sideLug.position.set(side * 0.08, sly, slx);
        sideLug.rotation.x = angle;
        sideLug.rotation.y = side * 0.3;
        tireGroup.add(sideLug);
      }
    }

    // Shoulder lugs
    if (i % 3 === 0) {
      for (let side = -1; side <= 1; side += 2) {
        const shoulderGeo = new THREE.BoxGeometry(0.03, 0.03, 0.06);
        const shoulderLug = new THREE.Mesh(shoulderGeo, rubber);
        const shx = Math.cos(angle) * (tireRadius + tireTube * 0.45);
        const shy = Math.sin(angle) * (tireRadius + tireTube * 0.45);
        shoulderLug.position.set(side * 0.15, shy, shx);
        shoulderLug.rotation.x = angle;
        tireGroup.add(shoulderLug);
      }
    }
  }

  // Sidewall lettering bumps (simulated raised text)
  for (let i = 0; i < 12; i++) {
    const textAngle = (i / 12) * Math.PI * 2;
    const textGeo = new THREE.BoxGeometry(0.04, 0.01, 0.02);
    const textBump = new THREE.Mesh(textGeo, rubber);
    const tx = Math.cos(textAngle) * (tireRadius);
    const ty = Math.sin(textAngle) * (tireRadius);
    textBump.position.set(0.18, ty, tx);
    textBump.rotation.x = textAngle;
    tireGroup.add(textBump);
  }

  // RIM (steel wheel with spokes)
  const rimGroup = new THREE.Group();

  // Outer rim barrel
  const rimBarrelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.18, 24, 1, true);
  const rimBarrel = new THREE.Mesh(rimBarrelGeo, yellowPaint);
  rimBarrel.rotation.z = Math.PI / 2;
  rimGroup.add(rimBarrel);

  // Rim flanges
  for (let side = -1; side <= 1; side += 2) {
    const rimFlangeGeo = new THREE.TorusGeometry(0.4, 0.015, 8, 24);
    const rimFlange = new THREE.Mesh(rimFlangeGeo, yellowPaint);
    rimFlange.rotation.y = Math.PI / 2;
    rimFlange.position.set(side * 0.09, 0, 0);
    rimGroup.add(rimFlange);
  }

  // Hub
  const hubGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
  const hub = new THREE.Mesh(hubGeo, darkSteel);
  hub.rotation.z = Math.PI / 2;
  rimGroup.add(hub);

  // Hub cap
  const hubCapGeo = new THREE.SphereGeometry(0.08, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const hubCap = new THREE.Mesh(hubCapGeo, chrome);
  hubCap.rotation.z = -Math.PI / 2;
  hubCap.position.set(0.1, 0, 0);
  rimGroup.add(hubCap);

  // Spokes (8 spokes)
  const spokeCount = 8;
  for (let s = 0; s < spokeCount; s++) {
    const spokeAngle = (s / spokeCount) * Math.PI * 2;
    const spokeGeo = new THREE.BoxGeometry(0.015, 0.3, 0.04);
    const spoke = new THREE.Mesh(spokeGeo, yellowPaint);
    spoke.position.set(0, Math.cos(spokeAngle) * 0.22, Math.sin(spokeAngle) * 0.22);
    spoke.rotation.x = spokeAngle;
    rimGroup.add(spoke);

    // Lug nuts at rim edge
    const lugNutGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.025, 6);
    const lugNut = new THREE.Mesh(lugNutGeo, chrome);
    lugNut.rotation.z = Math.PI / 2;
    lugNut.position.set(0.1, Math.cos(spokeAngle) * 0.12, Math.sin(spokeAngle) * 0.12);
    rimGroup.add(lugNut);
  }

  rimGroup.rotation.y = Math.PI / 2;
  tireGroup.add(rimGroup);

  // Position tire assembly under tower
  tireGroup.position.set(0, 0.55, 0);
  group.add(tireGroup);
  meshes.tire = tireGroup;

  // ════════════════════════════════════════════════════════════════
  // 5. GEARBOX WITH DRIVE MOTOR
  // ════════════════════════════════════════════════════════════════
  const gearboxGroup = new THREE.Group();

  // Gearbox housing
  const gbHousingGeo = new THREE.BoxGeometry(0.45, 0.35, 0.4);
  const gbHousing = new THREE.Mesh(gbHousingGeo, motorGrey);
  gbHousing.position.set(0, 0.55, -0.65);
  gearboxGroup.add(gbHousing);

  // Gearbox cover plate
  const gbCoverGeo = new THREE.BoxGeometry(0.48, 0.38, 0.02);
  const gbCover = new THREE.Mesh(gbCoverGeo, darkSteel);
  gbCover.position.set(0, 0.55, -0.44);
  gearboxGroup.add(gbCover);

  // Cover bolts
  for (let bx = -1; bx <= 1; bx++) {
    for (let by = -1; by <= 1; by++) {
      const boltGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.03, 6);
      const bolt = new THREE.Mesh(boltGeo, chrome);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(bx * 0.18, 0.55 + by * 0.14, -0.42);
      gearboxGroup.add(bolt);
    }
  }

  // Output shaft (to wheel)
  const outputShaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12);
  const outputShaft = new THREE.Mesh(outputShaftGeo, chrome);
  outputShaft.rotation.x = Math.PI / 2;
  outputShaft.position.set(0, 0.55, -0.3);
  gearboxGroup.add(outputShaft);

  // Internal gear (visible through translucent casing idea - decorative)
  const gearGeo = new THREE.TorusGeometry(0.1, 0.02, 8, 24);
  const gear = new THREE.Mesh(gearGeo, neonCyan);
  gear.position.set(0, 0.55, -0.65);
  gear.rotation.y = Math.PI / 2;
  gearboxGroup.add(gear);
  meshes.gear = gear;

  // Pinion gear
  const pinionGeo = new THREE.TorusGeometry(0.05, 0.015, 8, 16);
  const pinion = new THREE.Mesh(pinionGeo, neonOrange);
  pinion.position.set(0.08, 0.55, -0.65);
  pinion.rotation.y = Math.PI / 2;
  gearboxGroup.add(pinion);
  meshes.pinion = pinion;

  // Gear teeth (main gear)
  for (let t = 0; t < 18; t++) {
    const toothAngle = (t / 18) * Math.PI * 2;
    const toothGeo = new THREE.BoxGeometry(0.02, 0.015, 0.04);
    const tooth = new THREE.Mesh(toothGeo, chrome);
    tooth.position.set(
      Math.cos(toothAngle) * 0.12,
      0.55 + Math.sin(toothAngle) * 0.12,
      -0.65
    );
    tooth.rotation.z = toothAngle;
    gearboxGroup.add(tooth);
  }

  // DRIVE MOTOR
  const motorBodyGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
  const motorBody = new THREE.Mesh(motorBodyGeo, motorGrey);
  motorBody.rotation.x = Math.PI / 2;
  motorBody.position.set(0, 0.55, -1.1);
  gearboxGroup.add(motorBody);

  // Motor cooling fins
  for (let f = 0; f < 12; f++) {
    const finAngle = (f / 12) * Math.PI * 2;
    const finGeo = new THREE.BoxGeometry(0.005, 0.04, 0.38);
    const fin = new THREE.Mesh(finGeo, darkSteel);
    fin.position.set(
      Math.cos(finAngle) * 0.155,
      0.55 + Math.sin(finAngle) * 0.155,
      -1.1
    );
    fin.rotation.z = finAngle;
    gearboxGroup.add(fin);
  }

  // Motor end cap
  const motorCapGeo = new THREE.CylinderGeometry(0.16, 0.13, 0.06, 16);
  const motorCap = new THREE.Mesh(motorCapGeo, darkSteel);
  motorCap.rotation.x = Math.PI / 2;
  motorCap.position.set(0, 0.55, -1.33);
  gearboxGroup.add(motorCap);

  // Motor shaft
  const motorShaftGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8);
  const motorShaft = new THREE.Mesh(motorShaftGeo, chrome);
  motorShaft.rotation.x = Math.PI / 2;
  motorShaft.position.set(0, 0.55, -0.8);
  gearboxGroup.add(motorShaft);
  meshes.motorShaft = motorShaft;

  // Junction box on motor
  const jBoxGeo = new THREE.BoxGeometry(0.12, 0.08, 0.1);
  const jBox = new THREE.Mesh(jBoxGeo, motorGrey);
  jBox.position.set(0.15, 0.72, -1.05);
  gearboxGroup.add(jBox);

  // Conduit from junction box
  const conduitPts = [
    new THREE.Vector3(0.15, 0.76, -1.05),
    new THREE.Vector3(0.15, 0.95, -1.05),
    new THREE.Vector3(0.1, 1.2, -0.6),
    new THREE.Vector3(0.05, 1.5, 0)
  ];
  const conduitCurve = new THREE.CatmullRomCurve3(conduitPts);
  const conduitGeo = new THREE.TubeGeometry(conduitCurve, 20, 0.015, 8, false);
  const conduit = new THREE.Mesh(conduitGeo, darkSteel);
  gearboxGroup.add(conduit);

  // Motor nameplate (neon indicator)
  const nameplateGeo = new THREE.PlaneGeometry(0.1, 0.05);
  const nameplate = new THREE.Mesh(nameplateGeo, neonCyan);
  nameplate.position.set(0, 0.72, -1.1);
  nameplate.rotation.x = -0.1;
  gearboxGroup.add(nameplate);

  // Motor mounting bracket
  const bracketGeo = new THREE.BoxGeometry(0.35, 0.04, 0.45);
  const bracket = new THREE.Mesh(bracketGeo, darkSteel);
  bracket.position.set(0, 0.36, -1.1);
  gearboxGroup.add(bracket);

  // Mounting bolts
  for (let mbx = -1; mbx <= 1; mbx += 2) {
    for (let mbz = -1; mbz <= 1; mbz += 2) {
      const mbGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.06, 6);
      const mb = new THREE.Mesh(mbGeo, chrome);
      mb.position.set(mbx * 0.13, 0.39, -1.1 + mbz * 0.18);
      gearboxGroup.add(mb);
    }
  }

  group.add(gearboxGroup);
  meshes.gearbox = gearboxGroup;

  // ════════════════════════════════════════════════════════════════
  // 6. SPRINKLER DROPS WITH EMITTERS
  // ════════════════════════════════════════════════════════════════
  const sprinklerGroup = new THREE.Group();
  const dropPositions = [-6, -4.5, -3, -1.5, 1.5, 3, 4.5, 6];

  dropPositions.forEach((xPos, idx) => {
    // Drop tube (flexible hose)
    const dropPts = [
      new THREE.Vector3(xPos, 3.44, 0),
      new THREE.Vector3(xPos + 0.05, 3.0, 0.02),
      new THREE.Vector3(xPos - 0.03, 2.5, -0.01),
      new THREE.Vector3(xPos, 2.0, 0)
    ];
    const dropCurve = new THREE.CatmullRomCurve3(dropPts);
    const dropTubeGeo = new THREE.TubeGeometry(dropCurve, 16, 0.02, 8, false);
    const dropTube = new THREE.Mesh(dropTubeGeo, hoseBlack);
    sprinklerGroup.add(dropTube);

    // Pipe clamp at top
    const clampGeo = new THREE.TorusGeometry(0.18, 0.015, 8, 12);
    const clamp = new THREE.Mesh(clampGeo, galvanizedSteel);
    clamp.position.set(xPos, 3.6, 0);
    clamp.rotation.y = Math.PI / 2;
    sprinklerGroup.add(clamp);

    // Pressure regulator
    const regGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.1, 10);
    const regulator = new THREE.Mesh(regGeo, plastic);
    regulator.position.set(xPos, 2.7, 0);
    sprinklerGroup.add(regulator);

    // Weight (keeps drop vertical in wind)
    const weightGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.06, 8);
    const weight = new THREE.Mesh(weightGeo, darkSteel);
    weight.position.set(xPos, 2.3, 0);
    sprinklerGroup.add(weight);

    // Spray emitter head
    const emitterBodyGeo = new THREE.CylinderGeometry(0.05, 0.035, 0.08, 12);
    const emitterBody = new THREE.Mesh(emitterBodyGeo, plastic);
    emitterBody.position.set(xPos, 1.96, 0);
    sprinklerGroup.add(emitterBody);

    // Splash plate (deflector pad)
    const splashGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.01, 16);
    const splash = new THREE.Mesh(splashGeo, plastic);
    splash.position.set(xPos, 1.9, 0);
    sprinklerGroup.add(splash);

    // Grooves in splash plate
    for (let g = 0; g < 8; g++) {
      const grooveAngle = (g / 8) * Math.PI * 2;
      const grooveGeo = new THREE.BoxGeometry(0.065, 0.012, 0.005);
      const groove = new THREE.Mesh(grooveGeo, darkSteel);
      groove.position.set(xPos, 1.9, 0);
      groove.rotation.y = grooveAngle;
      sprinklerGroup.add(groove);
    }

    // Water spray cone (animated later)
    const sprayGeo = new THREE.ConeGeometry(0.3, 0.8, 16, 1, true);
    const spray = new THREE.Mesh(sprayGeo, waterBlue);
    spray.position.set(xPos, 1.45, 0);
    sprinklerGroup.add(spray);

    // Neon drip indicator
    const dripGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const drip = new THREE.Mesh(dripGeo, neonCyan);
    drip.position.set(xPos, 1.88, 0);
    sprinklerGroup.add(drip);
  });

  group.add(sprinklerGroup);
  meshes.sprinklers = sprinklerGroup;

  // ════════════════════════════════════════════════════════════════
  // 7. END GUN (big sprinkler at span end)
  // ════════════════════════════════════════════════════════════════
  const endGunGroup = new THREE.Group();

  // End gun pipe extension
  const egPipeGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12);
  const egPipe = new THREE.Mesh(egPipeGeo, galvanizedSteel);
  egPipe.rotation.z = Math.PI / 2;
  egPipe.position.set(7.6, 3.6, 0);
  endGunGroup.add(egPipe);

  // Elbow fitting
  const elbowPts = [
    new THREE.Vector3(8.2, 3.6, 0),
    new THREE.Vector3(8.35, 3.55, 0),
    new THREE.Vector3(8.4, 3.4, 0)
  ];
  const elbowCurve = new THREE.CatmullRomCurve3(elbowPts);
  const elbowGeo = new THREE.TubeGeometry(elbowCurve, 12, 0.055, 12, false);
  const elbow = new THREE.Mesh(elbowGeo, galvanizedSteel);
  endGunGroup.add(elbow);

  // End gun nozzle body
  const nozzleGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.3, 12);
  const nozzle = new THREE.Mesh(nozzleGeo, chrome);
  nozzle.position.set(8.4, 3.15, 0);
  endGunGroup.add(nozzle);

  // Nozzle tip
  const nozzleTipGeo = new THREE.CylinderGeometry(0.03, 0.06, 0.08, 12);
  const nozzleTip = new THREE.Mesh(nozzleTipGeo, chrome);
  nozzleTip.position.set(8.4, 2.98, 0);
  endGunGroup.add(nozzleTip);

  // Booster body
  const boosterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 14);
  const booster = new THREE.Mesh(boosterGeo, paintedRed);
  booster.position.set(8.4, 3.5, 0);
  endGunGroup.add(booster);

  // Impact arm
  const impactArmGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.25, 6);
  const impactArm = new THREE.Mesh(impactArmGeo, chrome);
  impactArm.rotation.z = 0.6;
  impactArm.position.set(8.55, 3.2, 0.06);
  endGunGroup.add(impactArm);
  meshes.impactArm = impactArm;

  // Impact arm weight
  const impactWeightGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const impactWeight = new THREE.Mesh(impactWeightGeo, chrome);
  impactWeight.position.set(8.65, 3.35, 0.06);
  endGunGroup.add(impactWeight);

  // Valve actuator
  const valveGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 10);
  const valve = new THREE.Mesh(valveGeo, motorGrey);
  valve.rotation.x = Math.PI / 2;
  valve.position.set(8.0, 3.6, 0.12);
  endGunGroup.add(valve);

  // Solenoid
  const solenoidGeo = new THREE.BoxGeometry(0.06, 0.06, 0.08);
  const solenoid = new THREE.Mesh(solenoidGeo, darkSteel);
  solenoid.position.set(8.0, 3.68, 0.12);
  endGunGroup.add(solenoid);

  // End gun spray (large)
  const egSprayGeo = new THREE.ConeGeometry(0.6, 1.8, 16, 1, true);
  const egSpray = new THREE.Mesh(egSprayGeo, waterBlue);
  egSpray.position.set(8.4, 2.0, 0);
  endGunGroup.add(egSpray);
  meshes.endGunSpray = egSpray;

  // Neon ring on end gun
  const neonRingGeo = new THREE.TorusGeometry(0.14, 0.01, 8, 24);
  const neonRing = new THREE.Mesh(neonRingGeo, neonOrange);
  neonRing.position.set(8.4, 3.5, 0);
  endGunGroup.add(neonRing);
  meshes.endGunNeon = neonRing;

  group.add(endGunGroup);
  meshes.endGun = endGunGroup;

  // ════════════════════════════════════════════════════════════════
  // 8. HYDRAULIC LINES & UTILITY DETAILS
  // ════════════════════════════════════════════════════════════════
  // Power cable along pipeline
  const powerCablePts = [];
  for (let t = 0; t <= 30; t++) {
    const frac = t / 30;
    const x = -7 + frac * 14;
    const sag = 0.06 * Math.sin(frac * Math.PI * 6);
    powerCablePts.push(new THREE.Vector3(x, 3.82 + sag, 0.18));
  }
  const powerCableCurve = new THREE.CatmullRomCurve3(powerCablePts);
  const powerCableGeo = new THREE.TubeGeometry(powerCableCurve, 60, 0.012, 6, false);
  const powerCable = new THREE.Mesh(powerCableGeo, hoseBlack);
  group.add(powerCable);

  // Cable clips
  for (let i = -6; i <= 6; i += 2) {
    const clipGeo = new THREE.TorusGeometry(0.02, 0.005, 6, 8, Math.PI);
    const clip = new THREE.Mesh(clipGeo, galvanizedSteel);
    clip.position.set(i, 3.82, 0.18);
    clip.rotation.y = Math.PI / 2;
    group.add(clip);
  }

  // Alignment guide mechanism near tower
  const guideGeo = new THREE.BoxGeometry(0.08, 0.5, 0.08);
  const guide = new THREE.Mesh(guideGeo, paintedRed);
  guide.position.set(0.3, 0.5, 1.3);
  group.add(guide);

  const guideFlagGeo = new THREE.PlaneGeometry(0.15, 0.1);
  const guideFlag = new THREE.Mesh(guideFlagGeo, yellowPaint);
  guideFlag.position.set(0.3, 0.78, 1.35);
  group.add(guideFlag);

  // Resolver sensor (alignment sensor)
  const resolverGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.04, 10);
  const resolver = new THREE.Mesh(resolverGeo, motorGrey);
  resolver.position.set(-0.3, 0.4, 1.3);
  group.add(resolver);

  const resolverLED = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 6, 6), neonGreen
  );
  resolverLED.position.set(-0.3, 0.44, 1.3);
  group.add(resolverLED);
  meshes.resolverLED = resolverLED;

  // ════════════════════════════════════════════════════════════════
  // 9. CONTROL / SAFETY FEATURES
  // ════════════════════════════════════════════════════════════════
  // Safety shut-off lever at tower base
  const leverBaseGeo = new THREE.BoxGeometry(0.08, 0.06, 0.08);
  const leverBase = new THREE.Mesh(leverBaseGeo, paintedRed);
  leverBase.position.set(-0.3, 0.6, -1.3);
  group.add(leverBase);

  const leverArmGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.2, 6);
  const leverArm = new THREE.Mesh(leverArmGeo, chrome);
  leverArm.rotation.z = 0.5;
  leverArm.position.set(-0.3, 0.73, -1.3);
  group.add(leverArm);

  // Drain valve at bottom of pipe
  const drainGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.08, 8);
  const drain = new THREE.Mesh(drainGeo, galvanizedSteel);
  drain.position.set(-2, 3.38, 0);
  group.add(drain);

  // ════════════════════════════════════════════════════════════════
  // 10. GROUND TRACKS (tire rut pattern)
  // ════════════════════════════════════════════════════════════════
  const trackPts = [];
  for (let t = 0; t <= 30; t++) {
    const frac = t / 30;
    const angle = frac * Math.PI * 0.5;
    trackPts.push(new THREE.Vector3(
      Math.cos(angle) * 12 - 12,
      -0.02,
      Math.sin(angle) * 12
    ));
  }
  const trackCurve = new THREE.CatmullRomCurve3(trackPts);
  const trackGeo = new THREE.TubeGeometry(trackCurve, 40, 0.15, 4, false);
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x664422, metalness: 0.0, roughness: 1.0, transparent: true, opacity: 0.4
  });
  const track = new THREE.Mesh(trackGeo, trackMat);
  group.add(track);

  // ════════════════════════════════════════════════════════════════
  // PARTS MANIFEST
  // ════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Pipeline Span',
      description: 'Galvanized steel pipe carrying pressurized irrigation water across the field. Typically 6-5/8" OD with flanged couplings.',
      material: 'Galvanized Steel',
      function: 'Transports water from the pivot point to sprinkler drops and end gun along the entire span length.',
      assemblyOrder: 1,
      connections: ['A-Frame Tower', 'Sprinkler Drops', 'End Gun', 'Truss Rod Supports'],
      failureEffect: 'Water delivery stops; field section goes unirrigated, potential crop loss.',
      cascadeFailures: ['Sprinkler Drops', 'End Gun'],
      originalPosition: { x: 0, y: 3.6, z: 0 },
      explodedPosition: { x: 0, y: 7.5, z: 0 }
    },
    {
      name: 'A-Frame Steel Tower',
      description: 'Welded A-shaped structural tower supporting the pipeline span above the ground. Includes cross bracing, gusset plates, and base pads.',
      material: 'Galvanized Structural Steel',
      function: 'Provides vertical support to hold the pipeline at the correct height above the crop canopy.',
      assemblyOrder: 2,
      connections: ['Pipeline Span', 'Gearbox Assembly', 'Knobby Tire', 'Truss Rod Supports'],
      failureEffect: 'Pipeline span collapses; entire tower section fails, potential domino effect on adjacent spans.',
      cascadeFailures: ['Pipeline Span', 'Truss Rod Supports', 'Sprinkler Drops'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 4 }
    },
    {
      name: 'Truss Rod Supports',
      description: 'Diagonal and vertical steel rods with turnbuckle tensioners providing triangulated structural support to prevent pipeline sag.',
      material: 'Galvanized Steel Rod with Chrome Turnbuckles',
      function: 'Distributes pipeline weight and wind loads to the tower, preventing excessive deflection and span collapse.',
      assemblyOrder: 3,
      connections: ['Pipeline Span', 'A-Frame Tower'],
      failureEffect: 'Pipeline sags between towers; uneven water distribution; increased stress on adjacent towers.',
      cascadeFailures: ['Pipeline Span'],
      originalPosition: { x: 0, y: 3.0, z: 0 },
      explodedPosition: { x: 0, y: 5.5, z: -3 }
    },
    {
      name: 'Knobby Tire',
      description: 'Large agricultural flotation tire (typically 11.2-38) with deep chevron tread lugs mounted on a steel rim with 8 spokes.',
      material: 'Rubber (tire), Painted Steel (rim), Chrome (hub)',
      function: 'Provides traction and flotation as the tower drives through muddy or irrigated fields. Minimizes soil compaction.',
      assemblyOrder: 4,
      connections: ['Gearbox Assembly', 'A-Frame Tower'],
      failureEffect: 'Tower becomes immobile; pivot stops rotating; uneven irrigation. Flat tire can cause span misalignment.',
      cascadeFailures: ['Gearbox Assembly'],
      originalPosition: { x: 0, y: 0.55, z: 0 },
      explodedPosition: { x: 0, y: 0.55, z: 5 }
    },
    {
      name: 'Gearbox Assembly',
      description: 'Worm-gear reduction gearbox with sealed electric drive motor (typically 1.5 HP), junction box, and mounting bracket.',
      material: 'Cast Iron Housing, Steel Gears, Copper Windings',
      function: 'Converts high-speed motor rotation to low-speed, high-torque output to drive the tower wheel at approximately 1 RPM.',
      assemblyOrder: 5,
      connections: ['Drive Motor', 'Knobby Tire', 'A-Frame Tower'],
      failureEffect: 'Tower stops moving; pivot alignment lost. Seized gearbox can damage motor and overheat.',
      cascadeFailures: ['Knobby Tire', 'Drive Motor'],
      originalPosition: { x: 0, y: 0.55, z: -0.65 },
      explodedPosition: { x: -3, y: 0.55, z: -3 }
    },
    {
      name: 'Drive Motor',
      description: '1.5 HP totally enclosed fan-cooled (TEFC) electric motor with cooling fins, conduit connection, and nameplate.',
      material: 'Steel Housing, Copper Windings, Chrome Shaft',
      function: 'Provides rotational power to the gearbox. Receives intermittent power signals from the pivot control panel for alignment.',
      assemblyOrder: 6,
      connections: ['Gearbox Assembly', 'Control Panel (remote)'],
      failureEffect: 'Tower ceases forward motion. Control system triggers alarm; adjacent towers stop to maintain alignment.',
      cascadeFailures: ['Gearbox Assembly', 'Knobby Tire'],
      originalPosition: { x: 0, y: 0.55, z: -1.1 },
      explodedPosition: { x: -4, y: 0.55, z: -4 }
    },
    {
      name: 'Sprinkler Drops with Emitters',
      description: 'Flexible polyethylene drop tubes with pressure regulators, weighted stabilizers, and rotary splash-plate emitters.',
      material: 'Polyethylene Hose, Plastic Emitter, Steel Weight',
      function: 'Delivers water close to the crop canopy in a controlled spray pattern, minimizing wind drift and evaporation loss.',
      assemblyOrder: 7,
      connections: ['Pipeline Span'],
      failureEffect: 'Individual drop failure causes dry spot; clogged emitter creates uneven irrigation pattern.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 2.0, z: 0 },
      explodedPosition: { x: 0, y: -2, z: 3 }
    },
    {
      name: 'End Gun',
      description: 'High-pressure impact sprinkler mounted at span end with solenoid valve, booster pump, and long-range nozzle. Irrigates corners.',
      material: 'Chrome Nozzle, Steel Body, Brass Valve',
      function: 'Extends irrigation coverage beyond the span radius to irrigate corner areas of the field, activated by GPS or angle signal.',
      assemblyOrder: 8,
      connections: ['Pipeline Span', 'Control Panel (remote)'],
      failureEffect: 'Corner areas go unirrigated; reduced field coverage from ~80% circle to ~75%. Stuck-on wastes water.',
      cascadeFailures: [],
      originalPosition: { x: 8.4, y: 3.4, z: 0 },
      explodedPosition: { x: 12, y: 3.4, z: 0 }
    }
  ];

  // ════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What is the primary purpose of the truss rods on a center pivot irrigation tower?',
      options: [
        'To carry electrical wiring along the span',
        'To prevent the pipeline from sagging between towers under its own weight and water load',
        'To anchor the tower to the ground during high winds',
        'To regulate water pressure inside the pipeline'
      ],
      correct: 1,
      explanation: 'Truss rods form a triangulated support structure beneath the pipeline span. By transferring the weight of the water-filled pipe to the tower apex, they prevent excessive deflection (sag) that could cause structural failure or uneven sprinkler performance.',
      difficulty: 'medium'
    },
    {
      question: 'Why do center pivot tower tires use deep chevron (knobby) tread patterns rather than smooth agricultural tires?',
      options: [
        'Chevron treads are cheaper to manufacture at large diameters',
        'Smooth tires would spin the pipeline too fast',
        'Deep lugs provide traction in muddy, recently irrigated soil while the open pattern self-cleans to prevent mud buildup',
        'Knobby tires protect the crop roots from being cut'
      ],
      correct: 2,
      explanation: 'Center pivot towers must drive through soil that has just been irrigated. Deep chevron lugs dig into wet soil for traction, and their open V-pattern allows mud to be flung free rather than packing the tread, maintaining grip continuously.',
      difficulty: 'medium'
    },
    {
      question: 'What happens if the gearbox on one tower of a multi-tower center pivot system fails?',
      options: [
        'Only that tower stops; the rest of the pivot continues normally',
        'The entire pivot system stops because the alignment control system detects the failed tower falling out of position',
        'The adjacent towers speed up to compensate automatically',
        'Water pressure increases to push the failed tower forward'
      ],
      correct: 1,
      explanation: 'Center pivots use an alignment control system where each tower must maintain angular alignment with adjacent towers. If one tower\'s gearbox fails and it stops moving, resolver sensors detect misalignment, triggering a system-wide shutdown to prevent structural damage from spans bending beyond safe limits.',
      difficulty: 'hard'
    },
    {
      question: 'What is the function of the end gun on a center pivot irrigation system?',
      options: [
        'It provides extra pressure to the entire pipeline system',
        'It drains excess water at the end of the span',
        'It extends irrigation coverage beyond the pivot radius to irrigate corner areas of the field',
        'It acts as a counterweight to balance the pipeline'
      ],
      correct: 2,
      explanation: 'The end gun is a high-pressure impact sprinkler at the outermost span end. It can be activated by GPS or angle-based triggers to spray water beyond the normal circular path, converting unirrigated square-field corners into productive acreage.',
      difficulty: 'easy'
    }
  ];

  // ════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ════════════════════════════════════════════════════════════════
  const description = `Center Pivot Irrigation Tower Unit — a single drive tower section of a center pivot irrigation system. This is the most widely used method of crop irrigation in the world, capable of covering circular fields up to 500+ acres from a single pivot point.

Each tower unit consists of a galvanized steel A-frame supporting the pipeline span at approximately 3.5 meters above ground level. The pipeline carries pressurized water from the central pivot and feeds multiple sprinkler drop tubes equipped with pressure regulators and rotary splash-plate emitters that deliver water close to the crop canopy.

The tower is propelled by an electric drive motor coupled through a worm-gear reduction gearbox to a large knobby flotation tire. The outermost tower moves continuously while inner towers move intermittently to maintain alignment, monitored by resolver sensors. An end gun extends coverage into field corners.

Key engineering features: triangulated truss rod support preventing span sag, TEFC motors rated for outdoor/wet environments, sealed gearboxes with synthetic lubricant, and GPS-controlled end gun activation for precision corner irrigation.`;

  // ════════════════════════════════════════════════════════════════
  // ANIMATE
  // ════════════════════════════════════════════════════════════════
  function animate(time, speed, _meshes) {
    const t = time * speed;

    // Tire rotation (slow forward roll)
    if (meshes.tire) {
      meshes.tire.rotation.x = t * 0.15;
    }

    // Gear rotation inside gearbox
    if (meshes.gear) {
      meshes.gear.rotation.x = t * 0.8;
    }
    if (meshes.pinion) {
      meshes.pinion.rotation.x = -t * 2.0;
    }

    // Motor shaft spinning
    if (meshes.motorShaft) {
      meshes.motorShaft.rotation.y = t * 4.0;
    }

    // Sprinkler spray pulsing (water cone opacity)
    if (meshes.sprinklers) {
      meshes.sprinklers.children.forEach((child, idx) => {
        if (child.material && child.material === waterBlue) {
          child.material.opacity = 0.3 + 0.25 * Math.sin(t * 2.5 + idx * 0.7);
        }
      });
    }

    // End gun spray pulsing
    if (meshes.endGunSpray) {
      meshes.endGunSpray.material.opacity = 0.35 + 0.2 * Math.sin(t * 3.0);
      meshes.endGunSpray.rotation.y = t * 0.5;
    }

    // End gun impact arm oscillation
    if (meshes.impactArm) {
      meshes.impactArm.rotation.y = Math.sin(t * 8.0) * 0.4;
    }

    // End gun neon ring pulse
    if (meshes.endGunNeon) {
      meshes.endGunNeon.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 3.5);
    }

    // Resolver LED blinking
    if (meshes.resolverLED) {
      meshes.resolverLED.material.emissiveIntensity = Math.sin(t * 5.0) > 0 ? 1.5 : 0.2;
    }

    // Truss rod status indicators gentle pulse
    if (meshes.trussRods) {
      meshes.trussRods.children.forEach((child) => {
        if (child.material && child.material === neonGreen) {
          child.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 1.5 + child.position.x * 0.5);
        }
      });
    }

    // Subtle pipeline vibration (water flow simulation)
    if (meshes.pipeline) {
      meshes.pipeline.position.y = 3.6 + Math.sin(t * 6.0) * 0.003;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
