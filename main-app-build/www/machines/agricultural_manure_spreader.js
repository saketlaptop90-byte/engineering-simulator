import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ── Custom Materials ──────────────────────────────────────────────
  const hopperRed = new THREE.MeshStandardMaterial({
    color: 0xcc2222, roughness: 0.45, metalness: 0.55
  });
  const hopperRedDark = new THREE.MeshStandardMaterial({
    color: 0x991818, roughness: 0.5, metalness: 0.5
  });
  const chainMetal = new THREE.MeshStandardMaterial({
    color: 0x555555, roughness: 0.35, metalness: 0.85
  });
  const beaterGlow = new THREE.MeshStandardMaterial({
    color: 0xff5500, emissive: 0xff3300, emissiveIntensity: 0.35,
    roughness: 0.3, metalness: 0.9
  });
  const hydraulicOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, roughness: 0.3, metalness: 0.7
  });
  const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff44, emissiveIntensity: 0.6,
    roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85
  });
  const neonBlue = new THREE.MeshStandardMaterial({
    color: 0x2288ff, emissive: 0x1166ff, emissiveIntensity: 0.5,
    roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.8
  });
  const ptoCover = new THREE.MeshStandardMaterial({
    color: 0x333333, roughness: 0.4, metalness: 0.75
  });
  const weldSeam = new THREE.MeshStandardMaterial({
    color: 0x888888, roughness: 0.6, metalness: 0.7
  });
  const greaseMat = new THREE.MeshStandardMaterial({
    color: 0x222200, roughness: 0.9, metalness: 0.05
  });
  const reflectorRed = new THREE.MeshStandardMaterial({
    color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8,
    roughness: 0.15, metalness: 0.3
  });
  const reflectorAmber = new THREE.MeshStandardMaterial({
    color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 0.7,
    roughness: 0.15, metalness: 0.3
  });
  const decalWhite = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.6, metalness: 0.1
  });

  const meshes = {};

  // ════════════════════════════════════════════════════════════════════
  //  1. MAIN FRAME / CHASSIS
  // ════════════════════════════════════════════════════════════════════
  const frameGroup = new THREE.Group();

  // Main longitudinal frame rails (I-beam style)
  for (let side = -1; side <= 1; side += 2) {
    const railWeb = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.25, 0.08),
      darkSteel
    );
    railWeb.position.set(0, -0.6, side * 0.55);
    frameGroup.add(railWeb);

    const railTopFlange = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.04, 0.18),
      darkSteel
    );
    railTopFlange.position.set(0, -0.475, side * 0.55);
    frameGroup.add(railTopFlange);

    const railBotFlange = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.04, 0.18),
      darkSteel
    );
    railBotFlange.position.set(0, -0.725, side * 0.55);
    frameGroup.add(railBotFlange);
  }

  // Cross members
  for (let i = 0; i < 8; i++) {
    const xPos = -2.8 + i * 0.85;
    const crossMember = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.18, 1.18),
      darkSteel
    );
    crossMember.position.set(xPos, -0.6, 0);
    frameGroup.add(crossMember);
  }

  // Gusset plates at critical joints
  for (let i = 0; i < 4; i++) {
    for (let side = -1; side <= 1; side += 2) {
      const gusset = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.12, 0.06),
        steel
      );
      gusset.position.set(-2.0 + i * 1.5, -0.52, side * 0.5);
      frameGroup.add(gusset);
    }
  }

  group.add(frameGroup);

  // ════════════════════════════════════════════════════════════════════
  //  2. V-SHAPED HOPPER BODY
  // ════════════════════════════════════════════════════════════════════
  const hopperGroup = new THREE.Group();

  // V-shaped hopper using custom geometry (trapezoidal cross-section)
  const hopperLength = 5.0;
  const hopperTopWidth = 2.0;
  const hopperBottomWidth = 0.7;
  const hopperHeight = 1.4;

  // Hopper side panels (angled for V-shape)
  for (let side = -1; side <= 1; side += 2) {
    const sideShape = new THREE.Shape();
    sideShape.moveTo(-hopperLength / 2, 0);
    sideShape.lineTo(hopperLength / 2, 0);
    sideShape.lineTo(hopperLength / 2, hopperHeight);
    sideShape.lineTo(-hopperLength / 2, hopperHeight);
    sideShape.lineTo(-hopperLength / 2, 0);

    const sideGeo = new THREE.ShapeGeometry(sideShape);
    const sidePanel = new THREE.Mesh(sideGeo, hopperRed);
    sidePanel.position.set(0, 0, side * hopperTopWidth / 2);
    sidePanel.rotation.y = side > 0 ? 0 : Math.PI;
    hopperGroup.add(sidePanel);

    // V-angled bottom panels
    const vPanelGeo = new THREE.PlaneGeometry(hopperLength, 0.85);
    const vPanel = new THREE.Mesh(vPanelGeo, hopperRed);
    vPanel.position.set(0, -0.15, side * (hopperBottomWidth / 2 + 0.22));
    vPanel.rotation.x = side * 0.55;
    hopperGroup.add(vPanel);

    // Reinforcement ribs on sides
    for (let r = 0; r < 6; r++) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, hopperHeight * 0.85, 0.03),
        hopperRedDark
      );
      rib.position.set(-2.0 + r * 0.85, hopperHeight * 0.45, side * (hopperTopWidth / 2 + 0.015));
      hopperGroup.add(rib);
    }

    // Top rail / lip
    const topRail = new THREE.Mesh(
      new THREE.BoxGeometry(hopperLength + 0.1, 0.06, 0.08),
      steel
    );
    topRail.position.set(0, hopperHeight, side * (hopperTopWidth / 2));
    hopperGroup.add(topRail);

    // Weld seams along bottom
    const weldLine = new THREE.Mesh(
      new THREE.BoxGeometry(hopperLength, 0.015, 0.025),
      weldSeam
    );
    weldLine.position.set(0, 0.02, side * hopperBottomWidth / 2);
    hopperGroup.add(weldLine);
  }

  // Hopper floor (narrow V-bottom)
  const floorGeo = new THREE.BoxGeometry(hopperLength, 0.04, hopperBottomWidth);
  const hopperFloor = new THREE.Mesh(floorGeo, darkSteel);
  hopperFloor.position.set(0, -0.02, 0);
  hopperGroup.add(hopperFloor);

  // Front wall
  const frontWallShape = new THREE.Shape();
  frontWallShape.moveTo(-hopperTopWidth / 2, 0);
  frontWallShape.lineTo(hopperTopWidth / 2, 0);
  frontWallShape.lineTo(hopperTopWidth / 2, hopperHeight);
  frontWallShape.lineTo(-hopperTopWidth / 2, hopperHeight);
  frontWallShape.lineTo(-hopperTopWidth / 2, 0);

  const frontWall = new THREE.Mesh(
    new THREE.ShapeGeometry(frontWallShape),
    hopperRed
  );
  frontWall.position.set(-hopperLength / 2, 0, 0);
  frontWall.rotation.y = Math.PI / 2;
  hopperGroup.add(frontWall);

  // Front wall bracing
  for (let b = 0; b < 3; b++) {
    const brace = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, hopperHeight * 0.7, 0.04),
      steel
    );
    brace.position.set(-hopperLength / 2 + 0.03, hopperHeight * 0.4, -0.6 + b * 0.6);
    hopperGroup.add(brace);
  }

  // Company logo plate on front wall
  const logoPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.25, 0.5),
    decalWhite
  );
  logoPlate.position.set(-hopperLength / 2 + 0.04, hopperHeight * 0.75, 0);
  hopperGroup.add(logoPlate);

  hopperGroup.position.set(0.2, 0.05, 0);
  group.add(hopperGroup);
  meshes.hopper = hopperGroup;

  // ════════════════════════════════════════════════════════════════════
  //  3. APRON CHAIN CONVEYOR FLOOR
  // ════════════════════════════════════════════════════════════════════
  const apronGroup = new THREE.Group();

  // Chain slats running along the floor
  const numSlats = 30;
  const slatSpacing = hopperLength / numSlats;
  for (let i = 0; i < numSlats; i++) {
    const slat = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.025, hopperBottomWidth - 0.05),
      chainMetal
    );
    slat.position.set(-hopperLength / 2 + 0.1 + i * slatSpacing, 0.015, 0);
    apronGroup.add(slat);
  }

  // Drive chains on each side
  for (let side = -1; side <= 1; side += 2) {
    // Chain links
    for (let i = 0; i < numSlats; i++) {
      const link = new THREE.Mesh(
        new THREE.TorusGeometry(0.015, 0.004, 6, 8),
        chainMetal
      );
      link.position.set(
        -hopperLength / 2 + 0.1 + i * slatSpacing,
        0.015,
        side * (hopperBottomWidth / 2 - 0.02)
      );
      link.rotation.y = Math.PI / 2;
      link.rotation.x = i % 2 === 0 ? 0 : Math.PI / 2;
      apronGroup.add(link);
    }

    // Sprocket at rear
    const rearSprocket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12),
      darkSteel
    );
    rearSprocket.position.set(hopperLength / 2 - 0.05, 0.015, side * (hopperBottomWidth / 2 - 0.02));
    rearSprocket.rotation.x = Math.PI / 2;
    apronGroup.add(rearSprocket);

    // Sprocket teeth
    for (let t = 0; t < 12; t++) {
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, 0.025, 0.04),
        darkSteel
      );
      const ang = (t / 12) * Math.PI * 2;
      tooth.position.set(
        hopperLength / 2 - 0.05 + Math.cos(ang) * 0.08,
        0.015 + Math.sin(ang) * 0.08,
        side * (hopperBottomWidth / 2 - 0.02)
      );
      tooth.rotation.z = ang;
      apronGroup.add(tooth);
    }

    // Front idler sprocket
    const frontIdler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.04, 10),
      steel
    );
    frontIdler.position.set(-hopperLength / 2 + 0.08, 0.015, side * (hopperBottomWidth / 2 - 0.02));
    frontIdler.rotation.x = Math.PI / 2;
    apronGroup.add(frontIdler);
  }

  // Conveyor guide rails
  for (let side = -1; side <= 1; side += 2) {
    const guideRail = new THREE.Mesh(
      new THREE.BoxGeometry(hopperLength - 0.1, 0.03, 0.02),
      steel
    );
    guideRail.position.set(0, 0.0, side * (hopperBottomWidth / 2 + 0.01));
    apronGroup.add(guideRail);
  }

  apronGroup.position.set(0.2, -0.01, 0);
  group.add(apronGroup);
  meshes.apronChain = apronGroup;

  // ════════════════════════════════════════════════════════════════════
  //  4. REAR BEATER / SPINNER MECHANISM
  // ════════════════════════════════════════════════════════════════════
  const beaterGroup = new THREE.Group();

  // Beater housing / shroud
  const shroudGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.6, 24, 1, true, 0, Math.PI);
  const shroud = new THREE.Mesh(shroudGeo, hopperRedDark);
  shroud.rotation.x = Math.PI / 2;
  shroud.rotation.z = Math.PI;
  shroud.position.set(0, 0.5, 0);
  beaterGroup.add(shroud);

  // Upper beater drum
  const upperBeaterShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.5, 16),
    chrome
  );
  upperBeaterShaft.rotation.x = Math.PI / 2;
  upperBeaterShaft.position.set(0, 0.85, 0);
  beaterGroup.add(upperBeaterShaft);
  meshes.upperBeater = upperBeaterShaft;

  // Upper beater paddles/fins
  const numUpperPaddles = 8;
  for (let i = 0; i < numUpperPaddles; i++) {
    const ang = (i / numUpperPaddles) * Math.PI * 2;
    const paddle = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.04, 1.35),
      beaterGlow
    );
    paddle.position.set(
      Math.cos(ang) * 0.18,
      0.85 + Math.sin(ang) * 0.18,
      0
    );
    paddle.rotation.z = ang;
    beaterGroup.add(paddle);

    // Serrated edges on paddles
    for (let s = 0; s < 10; s++) {
      const serration = new THREE.Mesh(
        new THREE.ConeGeometry(0.012, 0.03, 4),
        darkSteel
      );
      serration.position.set(
        Math.cos(ang) * 0.33 + Math.cos(ang + Math.PI / 2) * 0.002,
        0.85 + Math.sin(ang) * 0.33,
        -0.6 + s * 0.135
      );
      serration.rotation.z = ang + Math.PI / 2;
      beaterGroup.add(serration);
    }
  }

  // Lower beater drum
  const lowerBeaterShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.5, 16),
    chrome
  );
  lowerBeaterShaft.rotation.x = Math.PI / 2;
  lowerBeaterShaft.position.set(0, 0.35, 0);
  beaterGroup.add(lowerBeaterShaft);
  meshes.lowerBeater = lowerBeaterShaft;

  // Lower beater paddles
  const numLowerPaddles = 6;
  for (let i = 0; i < numLowerPaddles; i++) {
    const ang = (i / numLowerPaddles) * Math.PI * 2 + Math.PI / 6;
    const paddle = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.05, 1.35),
      beaterGlow
    );
    paddle.position.set(
      Math.cos(ang) * 0.16,
      0.35 + Math.sin(ang) * 0.16,
      0
    );
    paddle.rotation.z = ang;
    beaterGroup.add(paddle);
  }

  // Spinner discs (vertical spinners for wide spread pattern)
  for (let side = -1; side <= 1; side += 2) {
    const spinnerDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.03, 20),
      chrome
    );
    spinnerDisc.rotation.x = Math.PI / 2;
    spinnerDisc.position.set(0, 0.35, side * 0.9);
    beaterGroup.add(spinnerDisc);

    // Spinner vanes
    for (let v = 0; v < 4; v++) {
      const vang = (v / 4) * Math.PI * 2;
      const vane = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.06, 0.03),
        beaterGlow
      );
      vane.position.set(
        Math.cos(vang) * 0.12,
        0.35 + Math.sin(vang) * 0.12,
        side * 0.9
      );
      vane.rotation.z = vang;
      beaterGroup.add(vane);
    }
  }

  // Beater bearing housings
  for (let side = -1; side <= 1; side += 2) {
    for (let level = 0; level < 2; level++) {
      const bearing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12),
        darkSteel
      );
      bearing.rotation.x = Math.PI / 2;
      bearing.position.set(0, level === 0 ? 0.35 : 0.85, side * 0.8);
      beaterGroup.add(bearing);

      // Grease zerk fitting
      const zerk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.02, 6),
        chrome
      );
      zerk.rotation.x = Math.PI / 2;
      zerk.position.set(0, (level === 0 ? 0.35 : 0.85) + 0.07, side * 0.82);
      beaterGroup.add(zerk);
    }
  }

  // Neon status ring around upper beater
  const neonRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.008, 8, 32),
    neonGreen
  );
  neonRing.position.set(0, 0.85, 0.78);
  beaterGroup.add(neonRing);
  meshes.neonRing = neonRing;

  const neonRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.008, 8, 32),
    neonBlue
  );
  neonRing2.position.set(0, 0.85, -0.78);
  beaterGroup.add(neonRing2);
  meshes.neonRing2 = neonRing2;

  beaterGroup.position.set(2.95, -0.15, 0);
  group.add(beaterGroup);
  meshes.beaterGroup = beaterGroup;

  // ════════════════════════════════════════════════════════════════════
  //  5. HYDRAULIC GATE (REAR END-GATE)
  // ════════════════════════════════════════════════════════════════════
  const gateGroup = new THREE.Group();

  // Gate panel
  const gatePanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.2, 1.8),
    hopperRed
  );
  gatePanel.position.set(0, 0.6, 0);
  gateGroup.add(gatePanel);

  // Gate reinforcement bars
  for (let r = 0; r < 3; r++) {
    const reinf = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.08, 1.7),
      steel
    );
    reinf.position.set(0.04, 0.2 + r * 0.4, 0);
    gateGroup.add(reinf);
  }

  // Hydraulic cylinders for gate (one on each side)
  for (let side = -1; side <= 1; side += 2) {
    // Cylinder barrel
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.6, 12),
      hydraulicOrange
    );
    barrel.position.set(-0.25, 0.9, side * 0.7);
    barrel.rotation.z = 0.3;
    gateGroup.add(barrel);

    // Cylinder rod (chrome)
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.35, 8),
      chrome
    );
    rod.position.set(-0.1, 0.6, side * 0.7);
    rod.rotation.z = 0.3;
    gateGroup.add(rod);

    // Pivot pins
    const topPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8),
      chrome
    );
    topPin.rotation.x = Math.PI / 2;
    topPin.position.set(-0.35, 1.1, side * 0.7);
    gateGroup.add(topPin);

    const botPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8),
      chrome
    );
    botPin.rotation.x = Math.PI / 2;
    botPin.position.set(-0.02, 0.45, side * 0.7);
    gateGroup.add(botPin);
  }

  // Gate hinge hardware
  for (let side = -1; side <= 1; side += 2) {
    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8),
      darkSteel
    );
    hinge.position.set(-0.03, 0.05, side * 0.75);
    hinge.rotation.x = Math.PI / 2;
    gateGroup.add(hinge);
  }

  gateGroup.position.set(2.75, -0.05, 0);
  group.add(gateGroup);
  meshes.gate = gateGroup;

  // ════════════════════════════════════════════════════════════════════
  //  6. TANDEM AXLE WITH REALISTIC TIRES
  // ════════════════════════════════════════════════════════════════════
  const axleGroup = new THREE.Group();

  function createRealisticTire(radius, tubeRadius, rimRadius) {
    const tireGroup = new THREE.Group();

    // Main tire body
    const tireBody = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tubeRadius, 16, 32),
      rubber
    );
    tireGroup.add(tireBody);

    // Tread lugs - deeply carved pattern around circumference
    const numTreadRows = 5;
    const numLugsAround = 28;
    for (let row = 0; row < numTreadRows; row++) {
      const rowOffset = (row - 2) * tubeRadius * 0.35;
      for (let i = 0; i < numLugsAround; i++) {
        const theta = (i / numLugsAround) * Math.PI * 2;
        // Chevron pattern: offset alternating rows
        const thetaAdj = theta + (row % 2 === 0 ? 0 : Math.PI / numLugsAround);

        const lugWidth = tubeRadius * 0.18;
        const lugHeight = tubeRadius * 0.12;
        const lugDepth = tubeRadius * 0.35;

        const lug = new THREE.Mesh(
          new THREE.BoxGeometry(lugDepth, lugHeight, lugWidth),
          rubber
        );

        const distFromCenter = radius + tubeRadius * 0.88;
        lug.position.set(
          Math.cos(thetaAdj) * distFromCenter,
          Math.sin(thetaAdj) * distFromCenter,
          rowOffset
        );
        lug.rotation.z = thetaAdj;
        // Slight angle for chevron tread
        lug.rotation.y = row % 2 === 0 ? 0.15 : -0.15;
        tireGroup.add(lug);
      }
    }

    // Sidewall lettering bumps
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const bump = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.008, 0.008),
          rubber
        );
        bump.position.set(
          Math.cos(ang) * (radius + tubeRadius * 0.3),
          Math.sin(ang) * (radius + tubeRadius * 0.3),
          side * tubeRadius * 0.85
        );
        bump.rotation.z = ang;
        tireGroup.add(bump);
      }

      // Sidewall rim protector ridge
      const rimProtector = new THREE.Mesh(
        new THREE.TorusGeometry(radius - tubeRadius * 0.15, 0.008, 8, 32),
        rubber
      );
      rimProtector.position.set(0, 0, side * tubeRadius * 0.7);
      tireGroup.add(rimProtector);
    }

    // Rim (multi-piece agricultural rim)
    const rimOuter = new THREE.Mesh(
      new THREE.TorusGeometry(rimRadius, 0.025, 8, 24),
      aluminum
    );
    tireGroup.add(rimOuter);

    // Rim disc
    const rimDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(rimRadius - 0.02, rimRadius - 0.02, 0.04, 20),
      aluminum
    );
    rimDisc.rotation.x = Math.PI / 2;
    tireGroup.add(rimDisc);

    // Rim spokes (6-spoke agricultural pattern)
    const numSpokes = 6;
    for (let i = 0; i < numSpokes; i++) {
      const ang = (i / numSpokes) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(rimRadius * 0.85, 0.035, 0.035),
        aluminum
      );
      spoke.position.set(
        Math.cos(ang) * rimRadius * 0.42,
        Math.sin(ang) * rimRadius * 0.42,
        0
      );
      spoke.rotation.z = ang;
      tireGroup.add(spoke);
    }

    // Hub cap / center
    const hubCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.06, 12),
      chrome
    );
    hubCap.rotation.x = Math.PI / 2;
    hubCap.position.set(0, 0, 0.03);
    tireGroup.add(hubCap);

    // Lug nuts
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const lugNut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.03, 6),
        chrome
      );
      lugNut.rotation.x = Math.PI / 2;
      lugNut.position.set(
        Math.cos(ang) * 0.06,
        Math.sin(ang) * 0.06,
        0.035
      );
      tireGroup.add(lugNut);
    }

    // Valve stem
    const valveStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.04, 6),
      rubber
    );
    valveStem.position.set(rimRadius * 0.75, 0, 0);
    tireGroup.add(valveStem);

    return tireGroup;
  }

  // Create tandem axle (two axles close together)
  const tireRadius = 0.32;
  const tireTube = 0.12;
  const rimRadius = 0.16;

  for (let axleIdx = 0; axleIdx < 2; axleIdx++) {
    const axleX = 0.6 + axleIdx * 0.85;

    // Axle tube
    const axleTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12),
      darkSteel
    );
    axleTube.rotation.x = Math.PI / 2;
    axleTube.position.set(axleX, -0.55, 0);
    axleGroup.add(axleTube);

    // Tires
    for (let side = -1; side <= 1; side += 2) {
      const tire = createRealisticTire(tireRadius, tireTube, rimRadius);
      tire.rotation.y = Math.PI / 2;
      tire.position.set(axleX, -0.55, side * 1.2);
      if (side < 0) tire.rotation.y = -Math.PI / 2;
      axleGroup.add(tire);
    }

    // Leaf spring suspension
    for (let side = -1; side <= 1; side += 2) {
      // Main leaf
      const mainLeaf = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.015, 0.08),
        darkSteel
      );
      mainLeaf.position.set(axleX, -0.48, side * 0.5);
      axleGroup.add(mainLeaf);

      // Helper leaf
      const helperLeaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.012, 0.08),
        darkSteel
      );
      helperLeaf.position.set(axleX, -0.465, side * 0.5);
      axleGroup.add(helperLeaf);

      // U-bolt clamps
      for (let u = -1; u <= 1; u += 2) {
        const uBolt = new THREE.Mesh(
          new THREE.TorusGeometry(0.035, 0.006, 6, 8, Math.PI),
          steel
        );
        uBolt.position.set(axleX + u * 0.08, -0.52, side * 0.5);
        axleGroup.add(uBolt);
      }
    }

    // Spring hangers
    for (let end = -1; end <= 1; end += 2) {
      for (let side = -1; side <= 1; side += 2) {
        const hanger = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.12, 0.06),
          steel
        );
        hanger.position.set(axleX + end * 0.5, -0.42, side * 0.5);
        axleGroup.add(hanger);
      }
    }
  }

  // Tandem axle equalizer (rocker arm between axles)
  for (let side = -1; side <= 1; side += 2) {
    const equalizer = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.04, 0.06),
      darkSteel
    );
    equalizer.position.set(1.025, -0.42, side * 0.5);
    axleGroup.add(equalizer);

    // Equalizer pivot
    const pivot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8),
      chrome
    );
    pivot.rotation.x = Math.PI / 2;
    pivot.position.set(1.025, -0.42, side * 0.5);
    axleGroup.add(pivot);
  }

  // Fenders / mudguards over tires
  for (let axleIdx = 0; axleIdx < 2; axleIdx++) {
    for (let side = -1; side <= 1; side += 2) {
      const fender = new THREE.Mesh(
        new THREE.CylinderGeometry(tireRadius + tireTube + 0.06, tireRadius + tireTube + 0.06, 0.28, 16, 1, true, Math.PI * 0.15, Math.PI * 0.7),
        hopperRed
      );
      fender.rotation.x = Math.PI / 2;
      fender.position.set(0.6 + axleIdx * 0.85, -0.55, side * 1.2);
      axleGroup.add(fender);
    }
  }

  axleGroup.position.set(-0.3, -0.2, 0);
  group.add(axleGroup);
  meshes.axleGroup = axleGroup;

  // ════════════════════════════════════════════════════════════════════
  //  7. PTO DRIVELINE
  // ════════════════════════════════════════════════════════════════════
  const ptoGroup = new THREE.Group();

  // Main PTO shaft
  const ptoShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 2.2, 12),
    chrome
  );
  ptoShaft.rotation.z = Math.PI / 2;
  ptoShaft.position.set(-1.5, -0.3, 0);
  ptoGroup.add(ptoShaft);
  meshes.ptoShaft = ptoShaft;

  // PTO shield / guard (yellow safety shield)
  const ptoShield = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.8, 12, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.7 })
  );
  ptoShield.rotation.z = Math.PI / 2;
  ptoShield.position.set(-1.5, -0.3, 0);
  ptoGroup.add(ptoShield);
  meshes.ptoShield = ptoShield;

  // Universal joints (CV joints)
  for (let j = 0; j < 2; j++) {
    const ujoint = new THREE.Group();
    const cross = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.08),
      chrome
    );
    ujoint.add(cross);

    // Cross arms
    for (let axis = 0; axis < 3; axis++) {
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.1, 8),
        chrome
      );
      if (axis === 0) arm.rotation.z = Math.PI / 2;
      if (axis === 2) arm.rotation.x = Math.PI / 2;
      ujoint.add(arm);
    }

    ujoint.position.set(-2.4 + j * 1.8, -0.3, 0);
    ptoGroup.add(ujoint);
  }

  // PTO input yoke (connects to tractor)
  const inputYoke = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.03, 0.15, 8),
    darkSteel
  );
  inputYoke.rotation.z = Math.PI / 2;
  inputYoke.position.set(-2.7, -0.3, 0);
  ptoGroup.add(inputYoke);

  // PTO output to gearbox
  const gearbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.18, 0.15),
    darkSteel
  );
  gearbox.position.set(-0.35, -0.3, 0);
  ptoGroup.add(gearbox);

  // Gearbox ventilation fins
  for (let f = 0; f < 5; f++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.005, 0.16, 0.13),
      steel
    );
    fin.position.set(-0.4 + f * 0.025, -0.3, 0);
    ptoGroup.add(fin);
  }

  // Output sprocket from gearbox
  const outputSprocket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12),
    chrome
  );
  outputSprocket.rotation.x = Math.PI / 2;
  outputSprocket.position.set(-0.25, -0.3, 0.1);
  ptoGroup.add(outputSprocket);

  // Chain from gearbox to apron
  const driveChainPath = new THREE.CurvePath();
  const chainCurve = new THREE.LineCurve3(
    new THREE.Vector3(-0.25, -0.3, 0.12),
    new THREE.Vector3(0.8, -0.3, 0.12)
  );
  driveChainPath.add(chainCurve);

  const driveChainGeo = new THREE.TubeGeometry(chainCurve, 20, 0.012, 8, false);
  const driveChain = new THREE.Mesh(driveChainGeo, chainMetal);
  ptoGroup.add(driveChain);

  // Neon indicator on gearbox
  const gearboxIndicator = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 8, 8),
    neonGreen
  );
  gearboxIndicator.position.set(-0.35, -0.2, 0.08);
  ptoGroup.add(gearboxIndicator);
  meshes.gearboxIndicator = gearboxIndicator;

  group.add(ptoGroup);
  meshes.ptoGroup = ptoGroup;

  // ════════════════════════════════════════════════════════════════════
  //  8. HYDRAULIC SYSTEM
  // ════════════════════════════════════════════════════════════════════
  const hydGroup = new THREE.Group();

  // Main hydraulic cylinder for gate
  for (let side = -1; side <= 1; side += 2) {
    const mainCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.8, 10),
      hydraulicOrange
    );
    mainCyl.rotation.z = -0.2;
    mainCyl.position.set(2.2, 0.5, side * 0.85);
    hydGroup.add(mainCyl);

    const mainRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8),
      chrome
    );
    mainRod.rotation.z = -0.2;
    mainRod.position.set(2.55, 0.38, side * 0.85);
    hydGroup.add(mainRod);
  }

  // Hydraulic hoses (flexible lines)
  const hosePaths = [
    { start: new THREE.Vector3(-2.0, -0.15, 0.6), mid: new THREE.Vector3(-0.5, 0.3, 0.8), end: new THREE.Vector3(2.2, 0.9, 0.85) },
    { start: new THREE.Vector3(-2.0, -0.15, -0.6), mid: new THREE.Vector3(-0.5, 0.3, -0.8), end: new THREE.Vector3(2.2, 0.9, -0.85) },
    { start: new THREE.Vector3(-2.0, -0.2, 0.3), mid: new THREE.Vector3(0, -0.1, 0.4), end: new THREE.Vector3(2.0, 0.2, 0.3) },
  ];

  hosePaths.forEach((p) => {
    const curve = new THREE.QuadraticBezierCurve3(p.start, p.mid, p.end);
    const hoseGeo = new THREE.TubeGeometry(curve, 24, 0.012, 8, false);
    const hose = new THREE.Mesh(hoseGeo, rubber);
    hydGroup.add(hose);

    // Hose fittings at each end
    [p.start, p.end].forEach(pt => {
      const fitting = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.014, 0.04, 8),
        chrome
      );
      fitting.position.copy(pt);
      hydGroup.add(fitting);
    });
  });

  // Hydraulic control valve block
  const valveBlock = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.12, 0.15),
    darkSteel
  );
  valveBlock.position.set(-2.0, -0.1, 0.0);
  hydGroup.add(valveBlock);

  // Valve spools
  for (let v = 0; v < 3; v++) {
    const spool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8),
      chrome
    );
    spool.rotation.x = Math.PI / 2;
    spool.position.set(-2.0, -0.06, -0.05 + v * 0.05);
    hydGroup.add(spool);

    // Spool handle
    const handle = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 6, 6),
      plastic
    );
    handle.position.set(-2.0, -0.06, -0.05 + v * 0.05 + 0.08);
    hydGroup.add(handle);
  }

  // Hydraulic reservoir / tank
  const reservoir = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12),
    darkSteel
  );
  reservoir.rotation.z = Math.PI / 2;
  reservoir.position.set(-2.3, 0.05, 0.3);
  hydGroup.add(reservoir);

  // Reservoir sight glass
  const sightGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.03, 8),
    glass
  );
  sightGlass.rotation.x = Math.PI / 2;
  sightGlass.position.set(-2.3, 0.05, 0.385);
  hydGroup.add(sightGlass);

  // Filler cap
  const fillerCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.03, 8),
    plastic
  );
  fillerCap.position.set(-2.3, 0.19, 0.3);
  hydGroup.add(fillerCap);

  group.add(hydGroup);
  meshes.hydGroup = hydGroup;

  // ════════════════════════════════════════════════════════════════════
  //  9. TONGUE / HITCH
  // ════════════════════════════════════════════════════════════════════
  const hitchGroup = new THREE.Group();

  // Main tongue beam (V-shaped tongue)
  for (let side = -1; side <= 1; side += 2) {
    const tongueBeam = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.1, 0.08),
      darkSteel
    );
    tongueBeam.position.set(-3.8, -0.55, side * 0.2);
    tongueBeam.rotation.y = side * 0.08;
    hitchGroup.add(tongueBeam);
  }

  // Tongue cross-brace
  const tongueBrace = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.08, 0.48),
    darkSteel
  );
  tongueBrace.position.set(-3.5, -0.55, 0);
  hitchGroup.add(tongueBrace);

  // Clevis hitch point
  const clevisPlate1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.02),
    steel
  );
  clevisPlate1.position.set(-4.8, -0.55, 0.04);
  hitchGroup.add(clevisPlate1);

  const clevisPlate2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.02),
    steel
  );
  clevisPlate2.position.set(-4.8, -0.55, -0.04);
  hitchGroup.add(clevisPlate2);

  // Hitch pin hole
  const hitchPin = new THREE.Mesh(
    new THREE.TorusGeometry(0.025, 0.008, 8, 16),
    chrome
  );
  hitchPin.position.set(-4.8, -0.55, 0);
  hitchGroup.add(hitchPin);

  // Safety chains
  for (let side = -1; side <= 1; side += 2) {
    const chainLinks = 12;
    for (let c = 0; c < chainLinks; c++) {
      const chainLink = new THREE.Mesh(
        new THREE.TorusGeometry(0.015, 0.004, 6, 8),
        chainMetal
      );
      chainLink.position.set(
        -4.6 + c * 0.04,
        -0.65 + Math.sin(c * 0.5) * 0.03,
        side * 0.15
      );
      chainLink.rotation.y = c % 2 === 0 ? 0 : Math.PI / 2;
      hitchGroup.add(chainLink);
    }
  }

  // Jack stand
  const jackPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8),
    darkSteel
  );
  jackPost.position.set(-4.2, -0.8, 0.3);
  hitchGroup.add(jackPost);

  const jackFoot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 0.02, 8),
    steel
  );
  jackFoot.position.set(-4.2, -1.05, 0.3);
  hitchGroup.add(jackFoot);

  const jackCrank = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.015, 0.015),
    darkSteel
  );
  jackCrank.position.set(-4.2, -0.55, 0.3);
  hitchGroup.add(jackCrank);

  group.add(hitchGroup);

  // ════════════════════════════════════════════════════════════════════
  //  10. LIGHTS, REFLECTORS, & DETAILS
  // ════════════════════════════════════════════════════════════════════
  const detailGroup = new THREE.Group();

  // Rear tail lights
  for (let side = -1; side <= 1; side += 2) {
    // Housing
    const lightHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.1, 0.08),
      darkSteel
    );
    lightHousing.position.set(3.15, 0.5, side * 0.95);
    detailGroup.add(lightHousing);

    // Red tail light
    const tailLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.06, 0.06),
      reflectorRed
    );
    tailLight.position.set(3.18, 0.52, side * 0.95);
    detailGroup.add(tailLight);

    // Amber turn signal
    const turnSignal = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.03, 0.06),
      reflectorAmber
    );
    turnSignal.position.set(3.18, 0.46, side * 0.95);
    detailGroup.add(turnSignal);
  }

  // SMV (Slow Moving Vehicle) triangle
  const smvTriangle = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.2, 3),
    reflectorAmber
  );
  smvTriangle.position.set(3.15, 1.2, 0);
  smvTriangle.rotation.z = Math.PI;
  detailGroup.add(smvTriangle);

  // Side reflectors
  for (let i = 0; i < 3; i++) {
    for (let side = -1; side <= 1; side += 2) {
      const refl = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.03, 0.01),
        reflectorAmber
      );
      refl.position.set(-1.5 + i * 1.5, 0.5, side * 1.01);
      detailGroup.add(refl);
    }
  }

  // Splash guards behind tires
  for (let axleIdx = 0; axleIdx < 2; axleIdx++) {
    for (let side = -1; side <= 1; side += 2) {
      const splash = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.35, 0.28),
        rubber
      );
      splash.position.set(0.3 + axleIdx * 0.85 + 0.4, -0.65, side * 1.2);
      detailGroup.add(splash);
    }
  }

  // Neon accent strips along hopper sides
  for (let side = -1; side <= 1; side += 2) {
    const neonStrip = new THREE.Mesh(
      new THREE.BoxGeometry(hopperLength - 0.3, 0.015, 0.01),
      neonBlue
    );
    neonStrip.position.set(0.2, 0.08, side * (hopperTopWidth / 2 + 0.02));
    detailGroup.add(neonStrip);
  }
  meshes.neonStrips = detailGroup;

  // Diagnostic sensor pods
  for (let i = 0; i < 3; i++) {
    const sensorPod = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      neonGreen
    );
    sensorPod.position.set(-1.5 + i * 1.8, hopperHeight + 0.1, 0.95);
    detailGroup.add(sensorPod);
    if (i === 0) meshes.sensor1 = sensorPod;
    if (i === 1) meshes.sensor2 = sensorPod;
    if (i === 2) meshes.sensor3 = sensorPod;
  }

  // Hydraulic line clips along frame
  for (let i = 0; i < 6; i++) {
    const clip = new THREE.Mesh(
      new THREE.TorusGeometry(0.015, 0.004, 6, 8, Math.PI),
      steel
    );
    clip.position.set(-2.5 + i * 0.8, -0.45, 0.6);
    clip.rotation.y = Math.PI / 2;
    detailGroup.add(clip);
  }

  // Rivets along hopper top rail
  for (let side = -1; side <= 1; side += 2) {
    for (let r = 0; r < 18; r++) {
      const rivet = new THREE.Mesh(
        new THREE.SphereGeometry(0.008, 6, 6),
        steel
      );
      rivet.position.set(-2.2 + r * 0.28, hopperHeight + 0.03, side * (hopperTopWidth / 2));
      detailGroup.add(rivet);
    }
  }

  group.add(detailGroup);

  // ════════════════════════════════════════════════════════════════════
  //  11. CAPACITY MARKERS & LABELS
  // ════════════════════════════════════════════════════════════════════
  // Graduated capacity lines inside hopper (visible when empty)
  for (let level = 0; level < 4; level++) {
    for (let side = -1; side <= 1; side += 2) {
      const capLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.005, 0.002),
        decalWhite
      );
      capLine.position.set(0.2, 0.15 + level * 0.3, side * (hopperTopWidth / 2 - 0.01));
      detailGroup.add(capLine);
    }
  }

  // ════════════════════════════════════════════════════════════════════
  //  PARTS MANIFEST
  // ════════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'V-Shaped Hopper Body',
      description: 'Heavy-gauge steel V-shaped hopper with reinforced ribs and welded seams, designed for maximum payload discharge efficiency.',
      material: 'High-strength structural steel with polyurethane paint',
      function: 'Contains and channels material rearward toward the beater mechanism via gravity and the V-profile.',
      assemblyOrder: 1,
      connections: ['Main Frame', 'Apron Chain Conveyor', 'Hydraulic Gate'],
      failureEffect: 'Structural cracking causes material leakage and uneven spreading.',
      cascadeFailures: ['Apron Chain Conveyor', 'Hydraulic Gate'],
      originalPosition: { x: 0.2, y: 0.05, z: 0 },
      explodedPosition: { x: 0.2, y: 2.5, z: 0 }
    },
    {
      name: 'Apron Chain Conveyor',
      description: 'Dual-strand roller chain with hardened steel cross-slats that form a moving floor within the hopper.',
      material: 'Case-hardened alloy steel chains, AR400 wear-resistant slats',
      function: 'Continuously conveys hopper contents rearward to the beater mechanism at adjustable speed.',
      assemblyOrder: 2,
      connections: ['V-Shaped Hopper Body', 'PTO Driveline', 'Gearbox'],
      failureEffect: 'Material stops feeding to beaters; uneven or no spreading occurs.',
      cascadeFailures: ['Rear Beater Assembly'],
      originalPosition: { x: 0.2, y: -0.01, z: 0 },
      explodedPosition: { x: 0.2, y: -2.0, z: 0 }
    },
    {
      name: 'Rear Beater / Spinner Assembly',
      description: 'Dual horizontal beater drums with serrated paddles and vertical spinner discs for wide-throw distribution.',
      material: 'Hardened steel shafts, AR450 paddle faces, chrome bearings',
      function: 'Shreds and propels material outward in a uniform spread pattern across the field.',
      assemblyOrder: 3,
      connections: ['Apron Chain Conveyor', 'Hydraulic Gate', 'PTO Driveline'],
      failureEffect: 'Material clumps instead of spreading evenly; crop burning from over-concentration.',
      cascadeFailures: ['V-Shaped Hopper Body'],
      originalPosition: { x: 2.95, y: -0.15, z: 0 },
      explodedPosition: { x: 5.5, y: 0.5, z: 0 }
    },
    {
      name: 'Hydraulic Gate',
      description: 'Rear end-gate controlled by dual hydraulic cylinders, regulating material flow rate to the beaters.',
      material: 'Reinforced steel plate, hydraulic rams with chrome-plated rods',
      function: 'Controls discharge rate by adjusting the opening between the hopper and the beater housing.',
      assemblyOrder: 4,
      connections: ['V-Shaped Hopper Body', 'Rear Beater Assembly', 'Hydraulic System'],
      failureEffect: 'Loss of flow control leads to over-application or blockage.',
      cascadeFailures: ['Rear Beater / Spinner Assembly', 'Hydraulic System'],
      originalPosition: { x: 2.75, y: -0.05, z: 0 },
      explodedPosition: { x: 5.0, y: 2.0, z: 0 }
    },
    {
      name: 'Tandem Axle & Tire Assembly',
      description: 'Heavy-duty tandem walking-beam suspension with equalizer, leaf springs, and flotation tires with aggressive tread.',
      material: 'Forged steel axles, rubber tires with nylon plies, aluminum rims',
      function: 'Supports and distributes the loaded weight across the field while minimizing soil compaction.',
      assemblyOrder: 5,
      connections: ['Main Frame', 'Fenders'],
      failureEffect: 'Bearing failure causes wheel lockup; spring breakage leads to uneven load distribution.',
      cascadeFailures: ['Main Frame'],
      originalPosition: { x: -0.3, y: -0.2, z: 0 },
      explodedPosition: { x: -0.3, y: -3.0, z: 0 }
    },
    {
      name: 'PTO Driveline',
      description: 'Shielded telescoping driveline with universal joints, connecting tractor PTO to spreader gearbox.',
      material: 'Alloy steel shaft, Cardan universal joints, plastic safety shield',
      function: 'Transfers rotational power from the tractor PTO to the gearbox driving the apron chain and beaters.',
      assemblyOrder: 6,
      connections: ['Gearbox', 'Apron Chain Conveyor', 'Rear Beater Assembly'],
      failureEffect: 'Complete loss of power to spreading mechanism; PTO shield failure creates safety hazard.',
      cascadeFailures: ['Apron Chain Conveyor', 'Rear Beater / Spinner Assembly'],
      originalPosition: { x: -1.5, y: -0.3, z: 0 },
      explodedPosition: { x: -4.0, y: -0.3, z: 1.5 }
    },
    {
      name: 'Hydraulic System',
      description: 'Complete hydraulic circuit with valve block, reservoir, flexible hoses, and cylinders for gate and conveyor speed control.',
      material: 'High-pressure steel fittings, synthetic rubber hoses, hydraulic fluid',
      function: 'Provides proportional control of gate position and can regulate apron chain speed for variable application rates.',
      assemblyOrder: 7,
      connections: ['Hydraulic Gate', 'Apron Chain Conveyor', 'Tractor Hydraulic Supply'],
      failureEffect: 'Hose burst causes loss of gate control and hydraulic fluid contamination.',
      cascadeFailures: ['Hydraulic Gate', 'Apron Chain Conveyor'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 3.0, z: 2.0 }
    },
    {
      name: 'Tongue & Hitch Assembly',
      description: 'V-tongue with clevis hitch, safety chains, and telescoping jack stand for tractor connection.',
      material: 'Structural steel tube, forged clevis, grade 70 safety chain',
      function: 'Provides the tow connection between tractor and spreader, transferring drawbar load.',
      assemblyOrder: 8,
      connections: ['Main Frame', 'PTO Driveline', 'Hydraulic System'],
      failureEffect: 'Hitch failure causes complete disconnection from tractor; catastrophic runaway.',
      cascadeFailures: ['Main Frame', 'PTO Driveline'],
      originalPosition: { x: -4.0, y: -0.55, z: 0 },
      explodedPosition: { x: -7.0, y: -0.55, z: 0 }
    }
  ];

  // ════════════════════════════════════════════════════════════════════
  //  QUIZ QUESTIONS
  // ════════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What is the primary function of the V-shaped hopper design on a manure spreader?',
      options: [
        'To reduce wind resistance during transport',
        'To channel material toward the center and ensure consistent feeding to the rear beaters',
        'To increase the overall hopper capacity beyond a rectangular design',
        'To allow easier cleaning by drainage to the sides'
      ],
      correct: 1,
      explanation: 'The V-shape acts as a natural funnel, channeling material toward the narrow floor where the apron chain conveyor can uniformly feed it rearward to the beater mechanism, preventing bridging and ensuring consistent discharge.',
      difficulty: 'medium'
    },
    {
      question: 'Why does this spreader use a tandem (walking beam) axle instead of a single axle?',
      options: [
        'Tandem axles allow higher road speeds',
        'They distribute weight over a wider footprint and reduce soil compaction in the field',
        'Single axles cannot support any load over 2 tons',
        'Tandem axles eliminate the need for suspension springs'
      ],
      correct: 1,
      explanation: 'Tandem walking-beam axles distribute the heavy loaded weight across four tires instead of two, significantly reducing ground pressure and soil compaction—critical in agricultural field operations where preserving soil structure is important.',
      difficulty: 'medium'
    },
    {
      question: 'What safety feature protects the operator from the rotating PTO driveline?',
      options: [
        'The gearbox ventilation fins',
        'The chrome universal joints',
        'The yellow plastic safety shield surrounding the shaft',
        'The hydraulic reservoir pressure relief valve'
      ],
      correct: 2,
      explanation: 'The yellow plastic PTO shield is a critical safety guard that completely encloses the spinning driveshaft. PTO entanglement is one of the most dangerous farm hazards, and the shield prevents clothing or limbs from contacting the rotating shaft.',
      difficulty: 'easy'
    },
    {
      question: 'If the apron chain conveyor fails while the beaters are still spinning, what is the most likely immediate effect?',
      options: [
        'The tractor PTO will automatically disengage',
        'The beaters will stop because they are directly chain-driven from the conveyor',
        'Material will stop feeding to the beaters, resulting in an empty spread pattern while the beaters spin freely',
        'The hydraulic gate will close automatically'
      ],
      correct: 2,
      explanation: 'The apron chain conveyor and beaters are typically driven by separate outputs from the gearbox, so if the conveyor chain breaks, the beaters continue to spin but receive no new material, creating a gap in the spread pattern.',
      difficulty: 'hard'
    }
  ];

  // ════════════════════════════════════════════════════════════════════
  //  DESCRIPTION
  // ════════════════════════════════════════════════════════════════════
  const description = `Modern V-shaped manure spreader with dual horizontal beaters and vertical spinner discs for wide-throw distribution. Features a heavy-gauge welded steel V-hopper with reinforcing ribs, a dual-strand apron chain conveyor floor with hardened cross-slats, a hydraulically controlled rear end-gate, tandem walking-beam axle suspension with flotation tires, a shielded PTO driveline with universal joints, and a complete hydraulic control system. Designed for uniform field application of solid and semi-solid organic matter with adjustable spread patterns and application rates.`;

  // ════════════════════════════════════════════════════════════════════
  //  ANIMATION
  // ════════════════════════════════════════════════════════════════════
  function animate(time, speed, refMeshes) {
    const t = time * speed;
    const m = refMeshes || meshes;

    // Rotate upper beater
    if (m.upperBeater) {
      m.upperBeater.rotation.y = t * 4.0;
    }

    // Rotate lower beater (counter-rotate)
    if (m.lowerBeater) {
      m.lowerBeater.rotation.y = -t * 3.2;
    }

    // Rotate entire beater group paddles slightly (visual pulsing)
    if (m.beaterGroup) {
      // Subtle vibration to simulate high-speed rotation
      m.beaterGroup.position.y = -0.15 + Math.sin(t * 12) * 0.003;
    }

    // PTO shaft rotation
    if (m.ptoShaft) {
      m.ptoShaft.rotation.x = t * 6.0;
    }

    // PTO shield slight wobble
    if (m.ptoShield) {
      m.ptoShield.rotation.x = t * 0.5;
    }

    // Apron chain conveyor - subtle translation to simulate movement
    if (m.apronChain) {
      m.apronChain.position.x = 0.2 + (Math.sin(t * 2) * 0.02);
    }

    // Neon ring pulsing
    if (m.neonRing && m.neonRing.material) {
      m.neonRing.material.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.3;
      m.neonRing.scale.setScalar(1.0 + Math.sin(t * 4) * 0.05);
    }
    if (m.neonRing2 && m.neonRing2.material) {
      m.neonRing2.material.emissiveIntensity = 0.4 + Math.cos(t * 3) * 0.3;
      m.neonRing2.scale.setScalar(1.0 + Math.cos(t * 4) * 0.05);
    }

    // Gearbox indicator blinking
    if (m.gearboxIndicator && m.gearboxIndicator.material) {
      m.gearboxIndicator.material.emissiveIntensity = Math.sin(t * 5) > 0 ? 0.8 : 0.1;
    }

    // Sensor pods pulsing in sequence
    if (m.sensor1 && m.sensor1.material) {
      m.sensor1.material.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.5;
    }
    if (m.sensor2 && m.sensor2.material) {
      m.sensor2.material.emissiveIntensity = 0.3 + Math.sin(t * 2 + 2.1) * 0.5;
    }
    if (m.sensor3 && m.sensor3.material) {
      m.sensor3.material.emissiveIntensity = 0.3 + Math.sin(t * 2 + 4.2) * 0.5;
    }

    // Hydraulic gate slight pulsing (simulating pressure fluctuations)
    if (m.gate) {
      m.gate.rotation.x = Math.sin(t * 0.8) * 0.02;
    }

    // Hopper subtle vibration (simulating material movement)
    if (m.hopper) {
      m.hopper.position.y = 0.05 + Math.sin(t * 8) * 0.002;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
