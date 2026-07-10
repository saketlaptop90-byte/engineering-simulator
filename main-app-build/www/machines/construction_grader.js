import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ── Custom Materials ──────────────────────────────────────────────
  const catYellow = new THREE.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.35, metalness: 0.15 });
  const catYellowDark = new THREE.MeshStandardMaterial({ color: 0xc9a10a, roughness: 0.4, metalness: 0.2 });
  const frameMetal = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.3, metalness: 0.85 });
  const hydraulicRed = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.5, metalness: 0.6 });
  const bladeSteel = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.25, metalness: 0.9 });
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.7 });
  const glowOrange = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.8, roughness: 0.3 });
  const glowRed = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 0.9, roughness: 0.3 });
  const glowWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeedd, emissiveIntensity: 1.0, roughness: 0.2 });
  const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 0.6, transparent: true, opacity: 0.85 });
  const indicatorMat = new THREE.MeshStandardMaterial({ color: 0x00ccff, emissive: 0x00aaff, emissiveIntensity: 0.5, roughness: 0.2 });
  const decalBlack = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.3 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.05 });
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xccddee, roughness: 0.05, metalness: 1.0 });
  const rivetMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.4, metalness: 0.8 });

  // ── Helper Functions ──────────────────────────────────────────────
  function createRivet(x, y, z, parent) {
    const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), rivetMat);
    rivet.position.set(x, y, z);
    parent.add(rivet);
    return rivet;
  }

  function createHydraulicLine(points, radius, mat) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const tubeGeo = new THREE.TubeGeometry(curve, 20, radius || 0.035, 8, false);
    const tube = new THREE.Mesh(tubeGeo, mat || hydraulicRed);
    return tube;
  }

  function createTireWithTread(radius, tubeRadius, parent, x, y, z) {
    const tireGroup = new THREE.Group();

    // Main tire body
    const tireGeo = new THREE.TorusGeometry(radius, tubeRadius, 24, 48);
    const tireMesh = new THREE.Mesh(tireGeo, rubber);
    tireMesh.rotation.y = Math.PI / 2;
    tireGroup.add(tireMesh);

    // Tread lugs - deeply carved pattern around circumference
    const lugCount = 36;
    for (let i = 0; i < lugCount; i++) {
      const angle = (i / lugCount) * Math.PI * 2;
      const lugW = 0.04, lugH = 0.06, lugD = tubeRadius * 2.1;

      // Center lug
      const lug = new THREE.Mesh(new THREE.BoxGeometry(lugW, lugH, lugD), rubber);
      lug.position.set(
        0,
        Math.sin(angle) * (radius + tubeRadius * 0.85),
        Math.cos(angle) * (radius + tubeRadius * 0.85)
      );
      lug.rotation.x = angle;
      tireGroup.add(lug);

      // Chevron side lugs for realistic V-tread
      if (i % 2 === 0) {
        for (let side = -1; side <= 1; side += 2) {
          const sideLug = new THREE.Mesh(new THREE.BoxGeometry(lugD * 0.55, lugH * 0.8, lugW), rubber);
          sideLug.position.set(
            side * tubeRadius * 0.6,
            Math.sin(angle) * (radius + tubeRadius * 0.7),
            Math.cos(angle) * (radius + tubeRadius * 0.7)
          );
          sideLug.rotation.x = angle;
          sideLug.rotation.z = side * 0.25;
          tireGroup.add(sideLug);
        }
      }
    }

    // Sidewall lettering ridges
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.015, tubeRadius * 0.5), rubber);
      for (let side = -1; side <= 1; side += 2) {
        const r2 = ridge.clone();
        r2.position.set(
          side * (tubeRadius * 0.75),
          Math.sin(angle) * radius,
          Math.cos(angle) * radius
        );
        r2.rotation.x = angle;
        tireGroup.add(r2);
      }
    }

    // Rim - multi-spoke design
    const rimGroup = new THREE.Group();

    // Rim disc
    const rimDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, 0.08, 32),
      chrome
    );
    rimDisc.rotation.z = Math.PI / 2;
    rimGroup.add(rimDisc);

    // Rim outer ring
    const rimRing = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.7, 0.04, 12, 32),
      aluminum
    );
    rimRing.rotation.y = Math.PI / 2;
    rimGroup.add(rimRing);

    // Spokes
    const spokeCount = 8;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, radius * 0.55, 0.06),
        chrome
      );
      spoke.position.set(0, Math.sin(angle) * radius * 0.33, Math.cos(angle) * radius * 0.33);
      spoke.rotation.x = angle;
      rimGroup.add(spoke);
    }

    // Hub cap
    const hubCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.1, 16),
      catYellow
    );
    hubCap.rotation.z = Math.PI / 2;
    hubCap.position.x = 0.06;
    rimGroup.add(hubCap);

    // Lug nuts
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 6), chrome);
      nut.rotation.z = Math.PI / 2;
      nut.position.set(0.07, Math.sin(angle) * 0.08, Math.cos(angle) * 0.08);
      rimGroup.add(nut);
    }

    tireGroup.add(rimGroup);
    tireGroup.position.set(x, y, z);
    parent.add(tireGroup);
    return tireGroup;
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 1: REAR ENGINE/FRAME MODULE
  // ═══════════════════════════════════════════════════════════════════
  const rearModule = new THREE.Group();

  // Engine hood - shaped body with rounded top
  const hoodShape = new THREE.Shape();
  hoodShape.moveTo(-0.7, 0);
  hoodShape.lineTo(0.7, 0);
  hoodShape.lineTo(0.65, 0.6);
  hoodShape.quadraticCurveTo(0, 0.85, -0.65, 0.6);
  hoodShape.lineTo(-0.7, 0);
  const hoodExtrudeSettings = { depth: 2.8, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 };
  const hoodGeo = new THREE.ExtrudeGeometry(hoodShape, hoodExtrudeSettings);
  const hood = new THREE.Mesh(hoodGeo, catYellow);
  hood.position.set(0, 1.8, 0.2);
  rearModule.add(hood);
  meshes.hood = hood;

  // Engine side panels with vents
  for (let side = -1; side <= 1; side += 2) {
    const sidePanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.5, 2.2),
      catYellowDark
    );
    sidePanel.position.set(side * 0.72, 2.05, 1.3);
    rearModule.add(sidePanel);

    // Vent grilles
    for (let v = 0; v < 8; v++) {
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.03, 0.22),
        decalBlack
      );
      vent.position.set(side * 0.74, 2.05 + (v - 3.5) * 0.06, 1.3);
      rearModule.add(vent);
    }

    // Rivets along panels
    for (let r = 0; r < 6; r++) {
      createRivet(side * 0.74, 1.85, 0.4 + r * 0.35, rearModule);
      createRivet(side * 0.74, 2.25, 0.4 + r * 0.35, rearModule);
    }
  }

  // Exhaust stack
  const exhaustPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 1.2, 16),
    exhaustMat
  );
  exhaustPipe.position.set(0.5, 3.0, 0.8);
  rearModule.add(exhaustPipe);
  meshes.exhaust = exhaustPipe;

  // Exhaust cap
  const exhaustCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.06, 0.08, 16),
    exhaustMat
  );
  exhaustCap.position.set(0.5, 3.62, 0.8);
  rearModule.add(exhaustCap);

  // Muffler body
  const muffler = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16),
    exhaustMat
  );
  muffler.position.set(0.5, 2.35, 0.8);
  rearModule.add(muffler);

  // Air intake
  const airIntake = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 0.4, 16),
    catYellow
  );
  airIntake.position.set(-0.45, 2.85, 0.6);
  rearModule.add(airIntake);

  const airFilter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.25, 16),
    decalBlack
  );
  airFilter.position.set(-0.45, 3.1, 0.6);
  rearModule.add(airFilter);

  // Engine block (visible detail underneath)
  const engineBlock = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.6, 1.8),
    darkSteel
  );
  engineBlock.position.set(0, 1.5, 1.2);
  rearModule.add(engineBlock);

  // Radiator at rear
  const radiator = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.1),
    aluminum
  );
  radiator.position.set(0, 2.0, 2.95);
  rearModule.add(radiator);

  // Radiator grille
  for (let g = 0; g < 10; g++) {
    const grillBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.02, 0.02),
      decalBlack
    );
    grillBar.position.set(0, 1.65 + g * 0.07, 3.0);
    rearModule.add(grillBar);
  }

  // Counterweight at very rear
  const counterweight = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.5, 0.3),
    frameMetal
  );
  counterweight.position.set(0, 1.6, 3.15);
  rearModule.add(counterweight);
  meshes.counterweight = counterweight;

  // Counterweight ribs
  for (let i = 0; i < 5; i++) {
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.4, 0.35),
      frameMetal
    );
    rib.position.set(-0.5 + i * 0.25, 1.6, 3.2);
    rearModule.add(rib);
  }

  // ── Rear Frame Rails ──
  for (let side = -1; side <= 1; side += 2) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.2, 3.2),
      frameMetal
    );
    rail.position.set(side * 0.55, 1.15, 1.4);
    rearModule.add(rail);
  }

  // Cross members
  for (let c = 0; c < 4; c++) {
    const cross = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.1, 0.1),
      frameMetal
    );
    cross.position.set(0, 1.1, 0.3 + c * 0.8);
    rearModule.add(cross);
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 2: TANDEM REAR AXLE ASSEMBLY (4 tires, 2 axles)
  // ═══════════════════════════════════════════════════════════════════
  const tandemGroup = new THREE.Group();
  const tireRadius = 0.55;
  const tireTube = 0.22;
  const axleSpacing = 1.1;

  for (let axle = 0; axle < 2; axle++) {
    const zPos = 1.2 + axle * axleSpacing;

    // Axle housing
    const axleHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12),
      darkSteel
    );
    axleHousing.rotation.z = Math.PI / 2;
    axleHousing.position.set(0, 0.85, zPos);
    tandemGroup.add(axleHousing);

    // Differential housing
    const diffHousing = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 12),
      darkSteel
    );
    diffHousing.position.set(0, 0.85, zPos);
    tandemGroup.add(diffHousing);

    // Tires - left and right
    for (let side = -1; side <= 1; side += 2) {
      const tire = createTireWithTread(tireRadius, tireTube, tandemGroup, side * 1.0, 0.85, zPos);
      meshes[`rearTire_${axle}_${side > 0 ? 'R' : 'L'}`] = tire;
    }
  }

  // Tandem case / walking beam
  for (let side = -1; side <= 1; side += 2) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.25, axleSpacing + 0.3),
      frameMetal
    );
    beam.position.set(side * 0.7, 0.85, 1.75);
    tandemGroup.add(beam);

    // Walking beam pivot
    const pivot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12),
      chrome
    );
    pivot.rotation.z = Math.PI / 2;
    pivot.position.set(side * 0.7, 0.9, 1.75);
    tandemGroup.add(pivot);

    // Tandem chain cover
    const chainCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.35, 0.9),
      catYellowDark
    );
    chainCover.position.set(side * 0.78, 0.95, 1.75);
    tandemGroup.add(chainCover);
  }

  // Fenders over rear tires
  for (let side = -1; side <= 1; side += 2) {
    const fender = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.15, axleSpacing + 1.0),
      catYellow
    );
    fender.position.set(side * 1.15, 1.6, 1.75);
    tandemGroup.add(fender);

    const fenderTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.04, axleSpacing + 1.0),
      catYellow
    );
    fenderTop.position.set(side * 1.0, 1.66, 1.75);
    tandemGroup.add(fenderTop);
  }

  rearModule.add(tandemGroup);
  meshes.tandemGroup = tandemGroup;

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 3: ROPS ENCLOSED CAB
  // ═══════════════════════════════════════════════════════════════════
  const cabGroup = new THREE.Group();

  // Cab floor
  const cabFloor = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.08, 1.3),
    frameMetal
  );
  cabFloor.position.set(0, 2.45, -0.1);
  cabGroup.add(cabFloor);

  // Cab main body - tapered shape
  const cabShape = new THREE.Shape();
  cabShape.moveTo(-0.6, 0);
  cabShape.lineTo(0.6, 0);
  cabShape.lineTo(0.55, 1.2);
  cabShape.lineTo(-0.55, 1.2);
  cabShape.lineTo(-0.6, 0);
  const cabExtrudeSettings = { depth: 1.2, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 };
  const cabBody = new THREE.Mesh(
    new THREE.ExtrudeGeometry(cabShape, cabExtrudeSettings),
    catYellow
  );
  cabBody.position.set(0, 2.5, -0.7);
  cabGroup.add(cabBody);
  meshes.cab = cabBody;

  // ROPS pillars (4 corners)
  const pillarPositions = [
    [-0.58, -0.65], [0.58, -0.65], [-0.53, 0.48], [0.53, 0.48]
  ];
  pillarPositions.forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.25, 0.06),
      frameMetal
    );
    pillar.position.set(px, 3.1, pz);
    cabGroup.add(pillar);
  });

  // ROPS top frame
  const roofFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.06, 1.2),
    frameMetal
  );
  roofFrame.position.set(0, 3.75, -0.1);
  cabGroup.add(roofFrame);

  // Roof panel
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.04, 1.25),
    catYellow
  );
  roof.position.set(0, 3.8, -0.1);
  cabGroup.add(roof);

  // Tinted glass windows
  // Front windshield
  const windshield = new THREE.Mesh(
    new THREE.PlaneGeometry(1.05, 1.1),
    tinted
  );
  windshield.position.set(0, 3.1, -0.72);
  cabGroup.add(windshield);

  // Side windows
  for (let side = -1; side <= 1; side += 2) {
    const sideWin = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 1.0),
      tinted
    );
    sideWin.rotation.y = Math.PI / 2;
    sideWin.position.set(side * 0.6, 3.1, -0.1);
    cabGroup.add(sideWin);
  }

  // Rear window
  const rearWindow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 0.9),
    tinted
  );
  rearWindow.position.set(0, 3.1, 0.5);
  rearWindow.rotation.y = Math.PI;
  cabGroup.add(rearWindow);

  // Door (right side)
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.0, 0.7),
    catYellowDark
  );
  door.position.set(0.62, 3.0, 0.0);
  cabGroup.add(door);

  // Door handle
  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.04, 0.12),
    chrome
  );
  handle.position.set(0.65, 2.95, 0.0);
  cabGroup.add(handle);

  // Steps / ladder on right side
  for (let s = 0; s < 3; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.03, 0.15),
      aluminum
    );
    step.position.set(0.75, 2.0 + s * 0.22, 0.0);
    cabGroup.add(step);

    // Step bracket
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.22, 0.04),
      frameMetal
    );
    bracket.position.set(0.75, 1.9 + s * 0.22, 0.07);
    cabGroup.add(bracket);
  }

  // Mirrors
  for (let side = -1; side <= 1; side += 2) {
    const mirrorArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.03, 0.03),
      frameMetal
    );
    mirrorArm.position.set(side * 0.8, 3.5, -0.5);
    cabGroup.add(mirrorArm);

    const mirrorFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.15, 0.12),
      mirrorMat
    );
    mirrorFace.position.set(side * 0.98, 3.48, -0.5);
    cabGroup.add(mirrorFace);
  }

  // Interior - seat
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.1, 0.45),
    seatMat
  );
  seat.position.set(0, 2.65, 0.05);
  cabGroup.add(seat);

  const seatBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.5, 0.08),
    seatMat
  );
  seatBack.position.set(0, 2.9, 0.28);
  cabGroup.add(seatBack);

  // Steering wheel
  const steeringWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.015, 8, 24),
    decalBlack
  );
  steeringWheel.position.set(0, 3.0, -0.35);
  steeringWheel.rotation.x = -0.4;
  cabGroup.add(steeringWheel);
  meshes.steeringWheel = steeringWheel;

  // Steering column
  const steeringCol = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
    frameMetal
  );
  steeringCol.position.set(0, 2.85, -0.3);
  steeringCol.rotation.x = -0.4;
  cabGroup.add(steeringCol);

  // Control levers
  for (let i = 0; i < 4; i++) {
    const lever = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.25, 8),
      frameMetal
    );
    lever.position.set(-0.25 + i * 0.1, 2.85, -0.15);
    lever.rotation.x = -0.3;
    cabGroup.add(lever);

    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      i % 2 === 0 ? catYellow : decalBlack
    );
    knob.position.set(-0.25 + i * 0.1, 2.97, -0.2);
    cabGroup.add(knob);
  }

  // Dashboard indicator lights
  for (let i = 0; i < 6; i++) {
    const indicator = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 8, 8),
      i < 2 ? neonGreen : i < 4 ? indicatorMat : glowOrange
    );
    indicator.position.set(-0.15 + i * 0.06, 3.1, -0.55);
    cabGroup.add(indicator);
    meshes[`indicator_${i}`] = indicator;
  }

  // Roof lights (4 across)
  for (let i = 0; i < 4; i++) {
    const roofLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.06, 0.06),
      glowWhite
    );
    roofLight.position.set(-0.25 + i * 0.17, 3.85, -0.6);
    cabGroup.add(roofLight);
    meshes[`roofLight_${i}`] = roofLight;
  }

  // Warning beacon on roof
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 0.1, 16),
    glowOrange
  );
  beacon.position.set(0, 3.88, 0.1);
  cabGroup.add(beacon);
  meshes.beacon = beacon;

  // Front headlights
  for (let side = -1; side <= 1; side += 2) {
    const headlightHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 0.08, 16),
      decalBlack
    );
    headlightHousing.rotation.x = Math.PI / 2;
    headlightHousing.position.set(side * 0.5, 2.7, -0.75);
    cabGroup.add(headlightHousing);

    const headlightLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.075, 16),
      glowWhite
    );
    headlightLens.position.set(side * 0.5, 2.7, -0.79);
    cabGroup.add(headlightLens);
    meshes[`headlight_${side > 0 ? 'R' : 'L'}`] = headlightLens;
  }

  // Tail lights
  for (let side = -1; side <= 1; side += 2) {
    const tailLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.06, 0.03),
      glowRed
    );
    tailLight.position.set(side * 0.6, 2.6, 0.52);
    cabGroup.add(tailLight);
    meshes[`tailLight_${side > 0 ? 'R' : 'L'}`] = tailLight;
  }

  rearModule.add(cabGroup);
  meshes.cabGroup = cabGroup;

  group.add(rearModule);
  meshes.rearModule = rearModule;

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 4: ARTICULATION JOINT
  // ═══════════════════════════════════════════════════════════════════
  const articulationGroup = new THREE.Group();

  // Main articulation pivot
  const artPivot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.5, 24),
    chrome
  );
  artPivot.position.set(0, 1.6, -0.2);
  articulationGroup.add(artPivot);
  meshes.articulationPivot = artPivot;

  // Articulation bearing plates
  for (let dy = -1; dy <= 1; dy += 2) {
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24),
      frameMetal
    );
    plate.position.set(0, 1.6 + dy * 0.25, -0.2);
    articulationGroup.add(plate);
  }

  // Steering cylinders for articulation
  for (let side = -1; side <= 1; side += 2) {
    const cylBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12),
      chrome
    );
    cylBody.rotation.z = Math.PI / 2;
    cylBody.position.set(side * 0.35, 1.7, -0.1);
    articulationGroup.add(cylBody);

    const cylRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8),
      steel
    );
    cylRod.rotation.z = Math.PI / 2;
    cylRod.position.set(side * 0.7, 1.7, -0.1);
    articulationGroup.add(cylRod);
    meshes[`artCylinder_${side > 0 ? 'R' : 'L'}`] = cylRod;
  }

  group.add(articulationGroup);

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 5: FRONT FRAME & DRAWBAR + CIRCLE + MOLDBOARD
  // ═══════════════════════════════════════════════════════════════════
  const frontModule = new THREE.Group();

  // Front frame - long neck
  const frontFrameMain = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.25, 4.0),
    frameMetal
  );
  frontFrameMain.position.set(0, 1.35, -2.5);
  frontModule.add(frontFrameMain);

  // Front frame side rails
  for (let side = -1; side <= 1; side += 2) {
    const sideRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.35, 4.0),
      frameMetal
    );
    sideRail.position.set(side * 0.34, 1.35, -2.5);
    frontModule.add(sideRail);
  }

  // Drawbar - A-frame connecting front axle to circle
  const drawbarGroup = new THREE.Group();

  for (let side = -1; side <= 1; side += 2) {
    const drawbarArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 2.5),
      frameMetal
    );
    drawbarArm.position.set(side * 0.35, 1.1, -2.0);
    drawbarArm.rotation.y = side * 0.06;
    drawbarGroup.add(drawbarArm);
  }

  // Drawbar cross member
  const drawbarCross = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.1, 0.1),
    frameMetal
  );
  drawbarCross.position.set(0, 1.1, -1.5);
  drawbarGroup.add(drawbarCross);

  frontModule.add(drawbarGroup);

  // ── CIRCLE (Turntable) ──
  const circleGroup = new THREE.Group();

  // Circle ring - large rotating gear ring
  const circleRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.04, 12, 48),
    steel
  );
  circleRing.rotation.x = Math.PI / 2;
  circleRing.position.set(0, 1.0, -2.5);
  circleGroup.add(circleRing);
  meshes.circleRing = circleRing;

  // Circle disc
  const circleDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 0.06, 48),
    darkSteel
  );
  circleDisc.position.set(0, 1.0, -2.5);
  circleGroup.add(circleDisc);

  // Gear teeth around circle
  const gearTeethCount = 60;
  for (let i = 0; i < gearTeethCount; i++) {
    const angle = (i / gearTeethCount) * Math.PI * 2;
    const tooth = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.04, 0.04),
      steel
    );
    tooth.position.set(
      Math.cos(angle) * 0.58,
      1.0,
      -2.5 + Math.sin(angle) * 0.58
    );
    tooth.rotation.y = angle;
    circleGroup.add(tooth);
  }

  // Circle drive motor
  const circleMotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12),
    darkSteel
  );
  circleMotor.position.set(0.55, 1.1, -2.5);
  circleGroup.add(circleMotor);
  meshes.circleMotor = circleMotor;

  // Circle drive pinion gear
  const pinion = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.07, 12),
    chrome
  );
  pinion.position.set(0.55, 1.0, -2.5);
  circleGroup.add(pinion);

  frontModule.add(circleGroup);
  meshes.circleGroup = circleGroup;

  // ── MOLDBOARD BLADE ──
  const bladeGroup = new THREE.Group();

  // Main blade - curved moldboard
  const bladeCurve = new THREE.Shape();
  bladeCurve.moveTo(-1.8, 0);
  bladeCurve.lineTo(1.8, 0);
  bladeCurve.lineTo(1.8, 0.55);
  bladeCurve.quadraticCurveTo(0, 0.7, -1.8, 0.55);
  bladeCurve.lineTo(-1.8, 0);
  const bladeExtrudeSettings = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 };
  const bladeGeo = new THREE.ExtrudeGeometry(bladeCurve, bladeExtrudeSettings);
  const blade = new THREE.Mesh(bladeGeo, bladeSteel);
  blade.position.set(0, 0.35, -2.55);
  blade.rotation.y = 0.15; // Default angled position
  bladeGroup.add(blade);
  meshes.blade = blade;

  // Cutting edge
  const cuttingEdge = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.08, 0.1),
    steel
  );
  cuttingEdge.position.set(0, 0.31, -2.52);
  cuttingEdge.rotation.y = 0.15;
  bladeGroup.add(cuttingEdge);

  // Cutting edge bolts
  for (let i = 0; i < 12; i++) {
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6),
      chrome
    );
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(-1.6 + i * 0.29, 0.35, -2.48);
    bladeGroup.add(bolt);
  }

  // End bits (blade tips)
  for (let side = -1; side <= 1; side += 2) {
    const endBit = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.6, 0.08),
      steel
    );
    endBit.position.set(side * 1.85, 0.55, -2.52);
    endBit.rotation.y = 0.15;
    bladeGroup.add(endBit);
  }

  // Blade support brackets
  for (let i = -1; i <= 1; i++) {
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.4, 0.15),
      frameMetal
    );
    bracket.position.set(i * 0.8, 0.7, -2.42);
    bladeGroup.add(bracket);
  }

  // Blade tilt cylinder
  const tiltCylBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12),
    chrome
  );
  tiltCylBody.rotation.z = 0.5;
  tiltCylBody.position.set(0.6, 0.85, -2.5);
  bladeGroup.add(tiltCylBody);

  const tiltCylRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8),
    steel
  );
  tiltCylRod.rotation.z = 0.5;
  tiltCylRod.position.set(0.85, 1.0, -2.5);
  bladeGroup.add(tiltCylRod);
  meshes.tiltCylRod = tiltCylRod;

  // Blade shift (side-shift cylinder)
  const shiftCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.6, 12),
    chrome
  );
  shiftCyl.rotation.z = Math.PI / 2;
  shiftCyl.position.set(0, 0.95, -2.5);
  bladeGroup.add(shiftCyl);
  meshes.shiftCyl = shiftCyl;

  // Blade lift cylinders (2, one each side)
  for (let side = -1; side <= 1; side += 2) {
    const liftCylBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.8, 12),
      chrome
    );
    liftCylBody.position.set(side * 0.4, 1.5, -2.0);
    liftCylBody.rotation.x = 0.3;
    bladeGroup.add(liftCylBody);

    const liftCylRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.5, 8),
      steel
    );
    liftCylRod.position.set(side * 0.4, 1.05, -2.2);
    liftCylRod.rotation.x = 0.3;
    bladeGroup.add(liftCylRod);
    meshes[`bladeLiftRod_${side > 0 ? 'R' : 'L'}`] = liftCylRod;
  }

  frontModule.add(bladeGroup);
  meshes.bladeGroup = bladeGroup;

  // ── SCARIFIER TEETH ──
  const scarifierGroup = new THREE.Group();

  // Scarifier frame
  const scarFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.1, 0.15),
    frameMetal
  );
  scarFrame.position.set(0, 0.7, -1.6);
  scarifierGroup.add(scarFrame);

  // Scarifier shanks and teeth
  const toothCount = 7;
  for (let i = 0; i < toothCount; i++) {
    const xPos = -0.6 + i * 0.2;

    // Shank
    const shank = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.5, 0.06),
      steel
    );
    shank.position.set(xPos, 0.45, -1.6);
    scarifierGroup.add(shank);

    // Tooth tip - pointed
    const toothTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.025, 0.15, 8),
      steel
    );
    toothTip.position.set(xPos, 0.13, -1.6);
    toothTip.rotation.z = Math.PI;
    scarifierGroup.add(toothTip);
    meshes[`scarTooth_${i}`] = toothTip;
  }

  // Scarifier lift cylinder
  const scarLiftCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12),
    chrome
  );
  scarLiftCyl.position.set(0, 0.95, -1.6);
  scarifierGroup.add(scarLiftCyl);
  meshes.scarLiftCyl = scarLiftCyl;

  const scarLiftRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8),
    steel
  );
  scarLiftRod.position.set(0, 0.65, -1.6);
  scarifierGroup.add(scarLiftRod);
  meshes.scarLiftRod = scarLiftRod;

  frontModule.add(scarifierGroup);
  meshes.scarifierGroup = scarifierGroup;

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 6: FRONT AXLE WITH LEAN/STEER AND TIRES
  // ═══════════════════════════════════════════════════════════════════
  const frontAxleGroup = new THREE.Group();

  // Front axle beam
  const frontAxleBeam = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.15, 0.15),
    frameMetal
  );
  frontAxleBeam.position.set(0, 0.85, -4.2);
  frontAxleGroup.add(frontAxleBeam);

  // Front axle lean mechanism
  const leanPivot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.25, 12),
    chrome
  );
  leanPivot.rotation.z = Math.PI / 2;
  leanPivot.position.set(0, 0.85, -4.2);
  frontAxleGroup.add(leanPivot);

  // Lean cylinder
  const leanCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12),
    chrome
  );
  leanCyl.position.set(0.3, 1.2, -4.2);
  leanCyl.rotation.z = 0.3;
  frontAxleGroup.add(leanCyl);

  // King pins and steering knuckles
  for (let side = -1; side <= 1; side += 2) {
    const kingpin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12),
      chrome
    );
    kingpin.position.set(side * 0.75, 0.85, -4.2);
    frontAxleGroup.add(kingpin);

    // Steering arm
    const steerArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.04, 0.06),
      frameMetal
    );
    steerArm.position.set(side * 0.65, 0.72, -4.15);
    frontAxleGroup.add(steerArm);
  }

  // Front tires (2)
  for (let side = -1; side <= 1; side += 2) {
    const frontTire = createTireWithTread(tireRadius, tireTube, frontAxleGroup, side * 1.0, 0.85, -4.2);
    meshes[`frontTire_${side > 0 ? 'R' : 'L'}`] = frontTire;
  }

  // Front fenders
  for (let side = -1; side <= 1; side += 2) {
    const fFender = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.12, 0.8),
      catYellow
    );
    fFender.position.set(side * 1.15, 1.5, -4.2);
    frontAxleGroup.add(fFender);
  }

  frontModule.add(frontAxleGroup);
  meshes.frontAxleGroup = frontAxleGroup;

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 7: FRONT-MOUNTED RIPPER
  // ═══════════════════════════════════════════════════════════════════
  const ripperGroup = new THREE.Group();

  // Ripper mounting frame
  const ripperMount = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.15, 0.15),
    frameMetal
  );
  ripperMount.position.set(0, 1.2, -4.8);
  ripperGroup.add(ripperMount);

  // Ripper arms
  for (let side = -1; side <= 1; side += 2) {
    const ripperArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.8),
      frameMetal
    );
    ripperArm.position.set(side * 0.4, 0.9, -4.9);
    ripperArm.rotation.x = 0.3;
    ripperGroup.add(ripperArm);
  }

  // Ripper beam
  const ripperBeam = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.12, 0.12),
    frameMetal
  );
  ripperBeam.position.set(0, 0.55, -5.2);
  ripperGroup.add(ripperBeam);

  // Ripper shanks and tips
  const ripperTeethCount = 3;
  for (let i = 0; i < ripperTeethCount; i++) {
    const xPos = -0.35 + i * 0.35;

    // Shank
    const ripShank = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.6, 0.08),
      steel
    );
    ripShank.position.set(xPos, 0.25, -5.2);
    ripperGroup.add(ripShank);

    // Ripper tooth point
    const ripTooth = new THREE.Mesh(
      new THREE.ConeGeometry(0.035, 0.2, 8),
      steel
    );
    ripTooth.position.set(xPos, -0.12, -5.2);
    ripTooth.rotation.z = Math.PI;
    ripperGroup.add(ripTooth);
    meshes[`ripperTooth_${i}`] = ripTooth;

    // Shank pin
    const shankPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8),
      chrome
    );
    shankPin.rotation.z = Math.PI / 2;
    shankPin.position.set(xPos, 0.5, -5.2);
    ripperGroup.add(shankPin);
  }

  // Ripper lift cylinder
  const ripLiftCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.7, 12),
    chrome
  );
  ripLiftCyl.position.set(0, 1.0, -4.95);
  ripLiftCyl.rotation.x = 0.3;
  ripperGroup.add(ripLiftCyl);

  const ripLiftRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
    steel
  );
  ripLiftRod.position.set(0, 0.6, -5.1);
  ripLiftRod.rotation.x = 0.3;
  ripperGroup.add(ripLiftRod);
  meshes.ripLiftRod = ripLiftRod;

  frontModule.add(ripperGroup);
  meshes.ripperGroup = ripperGroup;

  group.add(frontModule);
  meshes.frontModule = frontModule;

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 8: HYDRAULIC LINES NETWORK
  // ═══════════════════════════════════════════════════════════════════

  // Blade lift hydraulic lines
  const bladeLiftLineL = createHydraulicLine([
    [0.35, 2.3, 0.0], [0.35, 2.0, -0.5], [0.35, 1.6, -1.5], [-0.4, 1.5, -2.0]
  ], 0.025);
  group.add(bladeLiftLineL);

  const bladeLiftLineR = createHydraulicLine([
    [-0.35, 2.3, 0.0], [-0.35, 2.0, -0.5], [-0.35, 1.6, -1.5], [0.4, 1.5, -2.0]
  ], 0.025);
  group.add(bladeLiftLineR);

  // Circle drive line
  const circleHydLine = createHydraulicLine([
    [0.5, 2.2, -0.2], [0.6, 1.8, -1.0], [0.55, 1.3, -2.0], [0.55, 1.1, -2.5]
  ], 0.02);
  group.add(circleHydLine);

  // Ripper hydraulic line
  const ripperHydLine = createHydraulicLine([
    [-0.3, 2.3, -0.3], [-0.3, 1.8, -2.0], [-0.2, 1.5, -3.5], [0, 1.2, -4.8]
  ], 0.02);
  group.add(ripperHydLine);

  // Scarifier hydraulic line
  const scarHydLine = createHydraulicLine([
    [0.3, 2.2, -0.1], [0.3, 1.5, -0.8], [0.15, 1.1, -1.4], [0, 0.95, -1.6]
  ], 0.02);
  group.add(scarHydLine);

  // Steering hydraulic lines
  for (let side = -1; side <= 1; side += 2) {
    const steerLine = createHydraulicLine([
      [side * 0.4, 2.0, 0.0], [side * 0.5, 1.8, -0.1], [side * 0.35, 1.7, -0.1]
    ], 0.018, copper);
    group.add(steerLine);
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 9: ADDITIONAL DETAILS
  // ═══════════════════════════════════════════════════════════════════

  // Fuel tank (under cab, right side)
  const fuelTank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.7, 16),
    catYellowDark
  );
  fuelTank.rotation.z = Math.PI / 2;
  fuelTank.position.set(0.75, 1.6, 0.3);
  group.add(fuelTank);

  // Fuel cap
  const fuelCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12),
    chrome
  );
  fuelCap.position.set(0.95, 1.65, 0.3);
  fuelCap.rotation.z = Math.PI / 2;
  group.add(fuelCap);

  // Hydraulic tank (under cab, left side)
  const hydTank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16),
    decalBlack
  );
  hydTank.rotation.z = Math.PI / 2;
  hydTank.position.set(-0.75, 1.5, 0.3);
  group.add(hydTank);

  // Front push block / bumper
  const pushBlock = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.3, 0.1),
    catYellow
  );
  pushBlock.position.set(0, 1.3, -4.55);
  group.add(pushBlock);

  // CATERPILLAR-style decal strip on hood
  const decalStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.04, 0.02),
    decalBlack
  );
  decalStrip.position.set(0, 2.55, 0.15);
  group.add(decalStrip);

  // Neon accent strips (futuristic detail)
  const neonStripL = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.02, 2.5),
    neonGreen
  );
  neonStripL.position.set(-0.73, 2.4, 1.3);
  group.add(neonStripL);
  meshes.neonStripL = neonStripL;

  const neonStripR = neonStripL.clone();
  neonStripR.position.set(0.73, 2.4, 1.3);
  group.add(neonStripR);
  meshes.neonStripR = neonStripR;

  // Underframe neon glow strips
  const underGlowL = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.01, 5.0),
    indicatorMat
  );
  underGlowL.position.set(-0.55, 1.0, -1.0);
  group.add(underGlowL);
  meshes.underGlowL = underGlowL;

  const underGlowR = underGlowL.clone();
  underGlowR.position.set(0.55, 1.0, -1.0);
  group.add(underGlowR);
  meshes.underGlowR = underGlowR;

  // GPS antenna on cab roof
  const gpsAntenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.4, 8),
    frameMetal
  );
  gpsAntenna.position.set(-0.3, 4.0, -0.1);
  group.add(gpsAntenna);

  const gpsDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    plastic
  );
  gpsDome.position.set(-0.3, 4.22, -0.1);
  group.add(gpsDome);

  // Second GPS for dual GPS control
  const gpsAntenna2 = gpsAntenna.clone();
  gpsAntenna2.position.set(0.3, 4.0, -0.1);
  group.add(gpsAntenna2);

  const gpsDome2 = gpsDome.clone();
  gpsDome2.position.set(0.3, 4.22, -0.1);
  group.add(gpsDome2);

  // ═══════════════════════════════════════════════════════════════════
  // PARTS CATALOG
  // ═══════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Moldboard Blade',
      description: 'Primary 14-foot curved moldboard blade for precision grading, capable of angling up to 90° and tilting for ditch-cutting and bank-sloping operations.',
      material: 'High-carbon hardened steel with replaceable cutting edge',
      function: 'Grades, shapes, and finishes earth surfaces to precise grade tolerances as fine as ±6mm using GPS-guided automatic controls.',
      assemblyOrder: 1,
      connections: ['Circle Assembly', 'Drawbar', 'Blade Tilt Cylinder', 'Blade Shift Cylinder'],
      failureEffect: 'Complete loss of grading capability; machine cannot perform primary function.',
      cascadeFailures: ['Circle Assembly wear', 'Drawbar stress fracture', 'Hydraulic overload'],
      originalPosition: { x: 0, y: 0.5, z: -2.5 },
      explodedPosition: { x: 0, y: -1.5, z: -4.5 }
    },
    {
      name: 'Circle Assembly (Turntable)',
      description: 'Large precision-machined gear ring with 360° rotation capability, housing the moldboard mounting and drive mechanism.',
      material: 'Case-hardened alloy steel gear ring with bronze bushings',
      function: 'Rotates the moldboard through 360° allowing blade angle adjustment for side-casting material, ditch cutting, and bank sloping.',
      assemblyOrder: 2,
      connections: ['Moldboard Blade', 'Drawbar', 'Circle Drive Motor', 'Front Frame'],
      failureEffect: 'Blade cannot rotate; limited to fixed-angle grading only.',
      cascadeFailures: ['Circle drive motor burnout', 'Gear tooth stripping', 'Blade misalignment'],
      originalPosition: { x: 0, y: 1.0, z: -2.5 },
      explodedPosition: { x: 2.5, y: 1.0, z: -2.5 }
    },
    {
      name: 'Articulated Frame Joint',
      description: 'Center-pin articulation allowing the front frame to pivot ±20° relative to the rear frame for precise alignment and crab-steering maneuvers.',
      material: 'Forged alloy steel pivot with hardened bearing races',
      function: 'Enables the machine to offset front and rear frames for precise blade positioning, tight turning, and working around obstacles.',
      assemblyOrder: 3,
      connections: ['Front Frame', 'Rear Frame', 'Articulation Steering Cylinders'],
      failureEffect: 'Machine limited to straight-line operation; severe reduction in maneuverability and grading precision.',
      cascadeFailures: ['Steering cylinder rod seal failure', 'Frame cracking', 'Tire scrubbing wear'],
      originalPosition: { x: 0, y: 1.6, z: -0.2 },
      explodedPosition: { x: 0, y: 3.5, z: -0.2 }
    },
    {
      name: 'Tandem Rear Drive Assembly',
      description: 'Dual-axle tandem drive with walking-beam suspension, chain-driven from powertrain, carrying all four rear tires.',
      material: 'Ductile iron housings with hardened gear sets and roller chain',
      function: 'Provides traction and flotation while maintaining rear stability across uneven terrain through the walking-beam equalization.',
      assemblyOrder: 4,
      connections: ['Engine/Transmission', 'Rear Frame', 'Walking Beam Pivots', 'Rear Tires (4)'],
      failureEffect: 'Complete loss of drive power or traction; machine immobilized.',
      cascadeFailures: ['Chain stretch/break', 'Final drive gear failure', 'Tire blowout from overload'],
      originalPosition: { x: 0, y: 0.85, z: 1.75 },
      explodedPosition: { x: 0, y: -1.5, z: 4.0 }
    },
    {
      name: 'ROPS Enclosed Cab',
      description: 'Pressurized, sound-attenuated ROPS/FOPS cab with tinted safety glass, climate control, and ergonomic controls including joystick steering.',
      material: 'Welded steel ROPS frame with laminated safety glass and acoustic insulation',
      function: 'Protects operator from rollover, falling objects, noise, and elements while providing visibility to blade and surrounding terrain.',
      assemblyOrder: 5,
      connections: ['Rear Frame', 'Controls/Hydraulics', 'Electrical System', 'HVAC System'],
      failureEffect: 'Operator exposure to hazards; regulatory non-compliance; reduced productivity from operator fatigue.',
      cascadeFailures: ['Window seal failure (pressurization loss)', 'HVAC compressor failure', 'Control joystick malfunction'],
      originalPosition: { x: 0, y: 3.0, z: -0.1 },
      explodedPosition: { x: 0, y: 6.0, z: -0.1 }
    },
    {
      name: 'Scarifier Assembly',
      description: 'Mid-mounted 7-tooth scarifier assembly for breaking up compacted materials, asphalt, and hard surfaces ahead of the blade.',
      material: 'Heat-treated alloy steel shanks with replaceable carbide-tipped teeth',
      function: 'Rips and loosens compacted soil, frozen ground, or deteriorated pavement so the blade can grade the material effectively.',
      assemblyOrder: 6,
      connections: ['Front Frame', 'Scarifier Lift Cylinder', 'Hydraulic System'],
      failureEffect: 'Cannot pre-rip hard materials; blade wears prematurely on compacted surfaces.',
      cascadeFailures: ['Shank bending', 'Tooth breakage', 'Lift cylinder seal leak'],
      originalPosition: { x: 0, y: 0.5, z: -1.6 },
      explodedPosition: { x: -2.5, y: -1.0, z: -1.6 }
    },
    {
      name: 'Front Ripper Assembly',
      description: 'Front-mounted 3-shank ripper for heavy ripping of rock, frozen ground, and compacted fill before grading passes.',
      material: 'High-strength steel frame with replaceable forged ripper points',
      function: 'Penetrates and fractures hard materials that the scarifier cannot handle, enabling the grader to process heavily compacted zones.',
      assemblyOrder: 7,
      connections: ['Front Axle Frame', 'Ripper Lift Cylinders', 'Hydraulic System'],
      failureEffect: 'Unable to rip hard materials; requires separate equipment (dozer/excavator) for pre-ripping.',
      cascadeFailures: ['Ripper point wear/breakage', 'Shank cracking', 'Front axle overloading'],
      originalPosition: { x: 0, y: 0.5, z: -5.0 },
      explodedPosition: { x: 0, y: -1.5, z: -7.5 }
    },
    {
      name: 'Engine & Powertrain',
      description: 'Cat C13 ACERT diesel engine producing ~250 HP coupled to planetary powershift transmission with 8F/6R speeds.',
      material: 'Cast iron block with aluminum heads, steel gears, and alloy shafts',
      function: 'Provides motive power for travel and hydraulic pump drive for all blade, ripper, and steering functions.',
      assemblyOrder: 8,
      connections: ['Rear Frame', 'Transmission', 'Hydraulic Pumps', 'Tandem Drive', 'Cooling System'],
      failureEffect: 'Total machine shutdown; no travel or hydraulic function available.',
      cascadeFailures: ['Turbocharger failure', 'Coolant loss/overheat', 'Transmission clutch burn'],
      originalPosition: { x: 0, y: 1.8, z: 1.2 },
      explodedPosition: { x: 3.0, y: 3.0, z: 3.0 }
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What is the primary function of the circle assembly on a motor grader?',
      options: [
        'To rotate the front wheels for steering',
        'To rotate the moldboard blade through 360° for angle adjustment',
        'To drive the tandem rear axles',
        'To operate the scarifier teeth'
      ],
      correct: 1,
      explanation: 'The circle assembly is a large gear ring (turntable) that allows the moldboard to rotate through a full 360°, enabling the operator to set the blade at any angle for various grading operations including side-casting, ditch-cutting, and bank-sloping.',
      difficulty: 'medium'
    },
    {
      question: 'Why does a motor grader have an articulated frame joint?',
      options: [
        'To reduce manufacturing costs',
        'To allow crab-steering and precise blade offset positioning',
        'To increase engine cooling efficiency',
        'To enable the machine to float over water'
      ],
      correct: 1,
      explanation: 'The articulation joint allows the front and rear frames to pivot independently. This enables crab-steering (offsetting the machine track) for precise blade placement, tight turning in confined spaces, and positioning the blade directly under the machine\'s centerline for maximum grading accuracy.',
      difficulty: 'medium'
    },
    {
      question: 'What advantage does the tandem rear drive (walking beam) suspension provide over a single-axle design?',
      options: [
        'It allows the grader to carry heavier payloads',
        'It distributes ground pressure evenly and maintains traction on uneven terrain',
        'It makes the machine travel faster on highways',
        'It reduces fuel consumption by 50%'
      ],
      correct: 1,
      explanation: 'The tandem walking-beam suspension equalizes the load across four rear tires, maintaining consistent ground contact and traction even when traversing uneven terrain. The walking beam pivots to allow one axle to rise while the other drops, keeping all tires firmly on the ground.',
      difficulty: 'easy'
    },
    {
      question: 'What is the difference between a scarifier and a ripper on a motor grader?',
      options: [
        'There is no difference; they are the same attachment',
        'The scarifier is lighter-duty with more teeth for surface scarifying, while the ripper has fewer, heavier shanks for deep penetration',
        'The ripper is always rear-mounted and the scarifier is always front-mounted',
        'The scarifier uses rotating blades while the ripper uses fixed teeth'
      ],
      correct: 1,
      explanation: 'A scarifier typically has 5-11 smaller teeth designed to scratch and loosen the top few inches of compacted surface, while a ripper has 1-3 heavy shanks designed to penetrate deeply into rock, frozen ground, or heavily compacted material. They serve complementary roles in material preparation.',
      difficulty: 'hard'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // ANIMATION
  // ═══════════════════════════════════════════════════════════════════
  function animate(time, speed, refMeshes) {
    const t = time * speed;
    const m = refMeshes || meshes;

    // Rear tire rotation (driving)
    for (let axle = 0; axle < 2; axle++) {
      for (const side of ['L', 'R']) {
        const tire = m[`rearTire_${axle}_${side}`];
        if (tire) {
          tire.rotation.x = t * 2.0;
        }
      }
    }

    // Front tire rotation + slight steering oscillation
    for (const side of ['L', 'R']) {
      const tire = m[`frontTire_${side}`];
      if (tire) {
        tire.rotation.x = t * 2.0;
        tire.rotation.y = Math.sin(t * 0.3) * 0.08;
      }
    }

    // Circle rotation - slow continuous
    if (m.circleRing) {
      m.circleRing.rotation.z = Math.sin(t * 0.15) * 0.4;
    }
    if (m.circleGroup) {
      m.circleGroup.rotation.y = Math.sin(t * 0.15) * 0.1;
    }

    // Blade tilt oscillation
    if (m.blade) {
      m.blade.rotation.z = Math.sin(t * 0.4) * 0.05;
    }

    // Blade lift rod piston action
    for (const side of ['L', 'R']) {
      const rod = m[`bladeLiftRod_${side}`];
      if (rod) {
        rod.position.y = 1.05 + Math.sin(t * 0.5) * 0.08;
      }
    }

    // Tilt cylinder rod movement
    if (m.tiltCylRod) {
      m.tiltCylRod.position.x = 0.85 + Math.sin(t * 0.4) * 0.05;
    }

    // Scarifier teeth subtle vibration when "engaged"
    for (let i = 0; i < 7; i++) {
      const tooth = m[`scarTooth_${i}`];
      if (tooth) {
        tooth.position.y = 0.13 + Math.sin(t * 8 + i * 0.5) * 0.008;
      }
    }

    // Scarifier lift rod
    if (m.scarLiftRod) {
      m.scarLiftRod.position.y = 0.65 + Math.sin(t * 0.5) * 0.05;
    }

    // Ripper piston action
    if (m.ripLiftRod) {
      m.ripLiftRod.position.y = 0.6 + Math.sin(t * 0.4 + 1.0) * 0.06;
    }

    // Ripper tooth vibration
    for (let i = 0; i < 3; i++) {
      const rTooth = m[`ripperTooth_${i}`];
      if (rTooth) {
        rTooth.position.y = -0.12 + Math.sin(t * 10 + i * 0.8) * 0.006;
      }
    }

    // Articulation steering cylinders
    for (const side of ['L', 'R']) {
      const cyl = m[`artCylinder_${side}`];
      if (cyl) {
        cyl.position.x = (side === 'R' ? 0.7 : -0.7) + Math.sin(t * 0.3) * 0.04 * (side === 'R' ? 1 : -1);
      }
    }

    // Steering wheel rotation
    if (m.steeringWheel) {
      m.steeringWheel.rotation.z = Math.sin(t * 0.3) * 0.25;
    }

    // Beacon flash
    if (m.beacon) {
      m.beacon.material = m.beacon.material.clone();
      m.beacon.material.emissiveIntensity = 0.3 + Math.abs(Math.sin(t * 3.0)) * 0.8;
    }

    // Roof lights subtle pulse
    for (let i = 0; i < 4; i++) {
      const rl = m[`roofLight_${i}`];
      if (rl) {
        rl.material = rl.material.clone();
        rl.material.emissiveIntensity = 0.7 + Math.sin(t * 2.0 + i * 0.4) * 0.3;
      }
    }

    // Dashboard indicator blink pattern
    for (let i = 0; i < 6; i++) {
      const ind = m[`indicator_${i}`];
      if (ind) {
        ind.material = ind.material.clone();
        ind.material.emissiveIntensity = 0.3 + Math.abs(Math.sin(t * 1.5 + i * 1.0)) * 0.7;
      }
    }

    // Neon strip pulse
    if (m.neonStripL && m.neonStripL.material) {
      m.neonStripL.material = m.neonStripL.material.clone();
      m.neonStripL.material.emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.3;
    }
    if (m.neonStripR && m.neonStripR.material) {
      m.neonStripR.material = m.neonStripR.material.clone();
      m.neonStripR.material.emissiveIntensity = 0.3 + Math.sin(t * 1.5 + Math.PI) * 0.3;
    }

    // Underglow pulse
    if (m.underGlowL && m.underGlowL.material) {
      m.underGlowL.material = m.underGlowL.material.clone();
      m.underGlowL.material.emissiveIntensity = 0.2 + Math.sin(t * 2.0) * 0.3;
    }
    if (m.underGlowR && m.underGlowR.material) {
      m.underGlowR.material = m.underGlowR.material.clone();
      m.underGlowR.material.emissiveIntensity = 0.2 + Math.sin(t * 2.0 + Math.PI) * 0.3;
    }

    // Exhaust shimmer
    if (m.exhaust) {
      m.exhaust.position.y = 3.0 + Math.sin(t * 6.0) * 0.003;
    }

    // Engine block vibration
    if (m.hood) {
      m.hood.position.y = 1.8 + Math.sin(t * 12.0) * 0.002;
    }

    // Circle motor rotation
    if (m.circleMotor) {
      m.circleMotor.rotation.y = t * 2.0;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════════════════════
  const description = `
    <h2>CAT 14M Motor Grader</h2>
    <p>The Caterpillar 14M is a large, articulated-frame motor grader designed for heavy-duty road construction, 
    maintenance grading, and precision finishing work. Powered by a Cat C13 ACERT turbocharged diesel engine 
    producing approximately 250 horsepower, it combines raw power with GPS-guided blade control precision 
    capable of holding grade tolerances within ±6mm.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li><strong>Articulated Frame:</strong> Center-pivot articulation enables ±20° frame offset for crab-steering, 
      allowing the blade to reach positions impossible with rigid-frame designs.</li>
      <li><strong>14-ft Moldboard:</strong> Full 360° circle rotation with hydraulic side-shift and tilt, providing 
      infinite blade positioning for ditching, bank-sloping, and finish grading.</li>
      <li><strong>Tandem Drive:</strong> Walking-beam rear suspension with 4 driven tires distributes ground pressure 
      and maintains traction on uneven terrain.</li>
      <li><strong>Scarifier:</strong> Mid-mounted 7-tooth scarifier for breaking compacted surfaces ahead of the blade.</li>
      <li><strong>Front Ripper:</strong> 3-shank ripper for penetrating rock and frozen ground.</li>
      <li><strong>ROPS/FOPS Cab:</strong> Pressurized, climate-controlled cab with joystick controls and 
      dual-GPS automatic blade control system.</li>
    </ul>

    <h3>Specifications</h3>
    <table>
      <tr><td>Engine</td><td>Cat C13 ACERT, ~250 HP</td></tr>
      <tr><td>Operating Weight</td><td>~24,000 kg (52,900 lb)</td></tr>
      <tr><td>Blade Width</td><td>4.27 m (14 ft)</td></tr>
      <tr><td>Circle Rotation</td><td>360° continuous</td></tr>
      <tr><td>Articulation Angle</td><td>±20°</td></tr>
      <tr><td>Wheel Lean</td><td>±18°</td></tr>
      <tr><td>Top Speed</td><td>45 km/h (28 mph)</td></tr>
    </table>
  `;

  return { group, parts, description, quizQuestions, animate };
}
