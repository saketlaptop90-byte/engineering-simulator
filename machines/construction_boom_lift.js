import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ─── Custom Materials ──────────────────────────────────────────
  const orangeBody = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.35, metalness: 0.3 });
  const darkOrange = new THREE.MeshStandardMaterial({ color: 0xcc5500, roughness: 0.4, metalness: 0.25 });
  const blackMetal = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.7 });
  const yellowAccent = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.3, metalness: 0.4 });
  const warningYellow = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.25, metalness: 0.2 });
  const hydraulicSilver = new THREE.MeshStandardMaterial({ color: 0xaabbcc, roughness: 0.15, metalness: 0.9 });
  const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.6, roughness: 0.2, metalness: 0.5 });
  const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff4400, emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.3 });
  const statusBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 0.7, roughness: 0.2, metalness: 0.5 });
  const redLight = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.9, roughness: 0.1, metalness: 0.3 });
  const whiteLens = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.2 });
  const exhaustMetal = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.6, metalness: 0.8 });
  const counterweightGrey = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.6 });
  const rubberGrip = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95, metalness: 0.05 });
  const decalWhite = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4, metalness: 0.1 });
  const hoseBlack = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.85, metalness: 0.1 });
  const gridMetal = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.6, wireframe: true });

  const meshes = {};

  // ─── HELPER: Create realistic tire ─────────────────────────────
  function createRealisticTire(radius, tubeRadius, x, y, z) {
    const tireGroup = new THREE.Group();
    // Main tire body
    const tireGeo = new THREE.TorusGeometry(radius, tubeRadius, 20, 48);
    const tireMesh = new THREE.Mesh(tireGeo, rubber);
    tireMesh.rotation.y = Math.PI / 2;
    tireGroup.add(tireMesh);

    // Tread pattern - circumferential lugs
    const lugCount = 36;
    for (let i = 0; i < lugCount; i++) {
      const angle = (i / lugCount) * Math.PI * 2;
      const lugGeo = new THREE.BoxGeometry(tubeRadius * 0.35, tubeRadius * 0.18, tubeRadius * 1.6);
      const lug = new THREE.Mesh(lugGeo, rubberGrip);
      lug.position.set(
        Math.cos(angle) * radius * 0.02,
        Math.sin(angle) * (radius + tubeRadius * 0.78),
        Math.cos(angle) * (radius + tubeRadius * 0.78)
      );
      // Place lugs on the outer surface of torus
      const px = 0;
      const py = Math.sin(angle) * (radius + tubeRadius * 0.85);
      const pz = Math.cos(angle) * (radius + tubeRadius * 0.85);
      lug.position.set(px, py, pz);
      lug.rotation.x = -angle;
      tireGroup.add(lug);
    }

    // Sidewall grooves
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const grooveGeo = new THREE.BoxGeometry(tubeRadius * 0.08, tubeRadius * 0.6, tubeRadius * 0.08);
      const groove = new THREE.Mesh(grooveGeo, blackMetal);
      groove.position.set(
        tubeRadius * 0.95,
        Math.sin(angle) * radius,
        Math.cos(angle) * radius
      );
      groove.rotation.x = -angle;
      tireGroup.add(groove);
    }

    // Rim - outer ring
    const rimGeo = new THREE.TorusGeometry(radius * 0.65, tubeRadius * 0.22, 12, 32);
    const rim = new THREE.Mesh(rimGeo, chrome);
    rim.rotation.y = Math.PI / 2;
    tireGroup.add(rim);

    // Rim hub
    const hubGeo = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, tubeRadius * 0.6, 24);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    hub.rotation.z = Math.PI / 2;
    tireGroup.add(hub);

    // Rim spokes
    const spokeCount = 8;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const spokeGeo = new THREE.BoxGeometry(tubeRadius * 0.35, radius * 0.35, tubeRadius * 0.12);
      const spoke = new THREE.Mesh(spokeGeo, aluminum);
      spoke.position.set(
        0,
        Math.sin(angle) * radius * 0.47,
        Math.cos(angle) * radius * 0.47
      );
      spoke.rotation.x = -angle;
      tireGroup.add(spoke);
    }

    // Lug nuts on hub
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const nutGeo = new THREE.CylinderGeometry(0.03, 0.03, tubeRadius * 0.65, 6);
      const nut = new THREE.Mesh(nutGeo, chrome);
      nut.rotation.z = Math.PI / 2;
      nut.position.set(0, Math.sin(angle) * radius * 0.2, Math.cos(angle) * radius * 0.2);
      tireGroup.add(nut);
    }

    tireGroup.position.set(x, y, z);
    return tireGroup;
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. CHASSIS / MAIN FRAME
  // ═══════════════════════════════════════════════════════════════
  const chassisGroup = new THREE.Group();

  // Main frame body - rounded shape using lathe
  const frameShape = new THREE.Shape();
  frameShape.moveTo(-2.2, -0.15);
  frameShape.lineTo(2.2, -0.15);
  frameShape.quadraticCurveTo(2.5, -0.15, 2.5, 0.1);
  frameShape.lineTo(2.5, 0.45);
  frameShape.quadraticCurveTo(2.5, 0.55, 2.2, 0.55);
  frameShape.lineTo(-2.2, 0.55);
  frameShape.quadraticCurveTo(-2.5, 0.55, -2.5, 0.45);
  frameShape.lineTo(-2.5, 0.1);
  frameShape.quadraticCurveTo(-2.5, -0.15, -2.2, -0.15);
  const extrudeSettings = { depth: 2.0, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 };
  const frameGeo = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
  const frameMesh = new THREE.Mesh(frameGeo, orangeBody);
  frameMesh.position.set(0, 0.65, -1.0);
  chassisGroup.add(frameMesh);
  meshes.chassis = frameMesh;

  // Lower frame structural beams
  for (let i = -1; i <= 1; i++) {
    const beamGeo = new THREE.BoxGeometry(0.15, 0.12, 4.2);
    const beam = new THREE.Mesh(beamGeo, darkSteel);
    beam.position.set(i * 1.0, 0.5, 0);
    chassisGroup.add(beam);
  }

  // Cross members
  for (let i = -1; i <= 1; i += 0.5) {
    const crossGeo = new THREE.BoxGeometry(2.2, 0.08, 0.12);
    const cross = new THREE.Mesh(crossGeo, darkSteel);
    cross.position.set(0, 0.48, i * 1.5);
    chassisGroup.add(cross);
  }

  // Fender flares over wheels
  const fenderGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.45, 24, 1, false, 0, Math.PI);
  [-1.35, 1.35].forEach((zz, idx) => {
    [-1.3, 1.3].forEach((xx) => {
      const fender = new THREE.Mesh(fenderGeo, orangeBody);
      fender.rotation.x = Math.PI / 2;
      fender.rotation.z = xx > 0 ? 0 : Math.PI;
      fender.position.set(xx > 0 ? 1.35 : -1.35, 0.85, zz);
      chassisGroup.add(fender);
    });
  });

  // Skid plates
  const skidGeo = new THREE.BoxGeometry(2.0, 0.04, 0.8);
  const skidFront = new THREE.Mesh(skidGeo, darkSteel);
  skidFront.position.set(0, 0.38, 1.5);
  chassisGroup.add(skidFront);
  const skidRear = new THREE.Mesh(skidGeo, darkSteel);
  skidRear.position.set(0, 0.38, -1.5);
  chassisGroup.add(skidRear);

  group.add(chassisGroup);

  // ═══════════════════════════════════════════════════════════════
  // 2. FOUR WHEELS (4WD) WITH REALISTIC TIRES
  // ═══════════════════════════════════════════════════════════════
  const wheelPositions = [
    { x: -1.5, y: 0.55, z: 1.35, name: 'wheelFL' },
    { x: 1.5, y: 0.55, z: 1.35, name: 'wheelFR' },
    { x: -1.5, y: 0.55, z: -1.35, name: 'wheelRL' },
    { x: 1.5, y: 0.55, z: -1.35, name: 'wheelRR' },
  ];
  wheelPositions.forEach(wp => {
    const tire = createRealisticTire(0.45, 0.2, wp.x, wp.y, wp.z);
    group.add(tire);
    meshes[wp.name] = tire;
  });

  // Axles
  const axleGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 12);
  const axleFront = new THREE.Mesh(axleGeo, darkSteel);
  axleFront.rotation.z = Math.PI / 2;
  axleFront.position.set(0, 0.55, 1.35);
  group.add(axleFront);
  const axleRear = new THREE.Mesh(axleGeo, darkSteel);
  axleRear.rotation.z = Math.PI / 2;
  axleRear.position.set(0, 0.55, -1.35);
  group.add(axleRear);

  // Drive shafts
  const driveShaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8);
  const driveShaft = new THREE.Mesh(driveShaftGeo, steel);
  driveShaft.position.set(0, 0.5, 0);
  group.add(driveShaft);

  // ═══════════════════════════════════════════════════════════════
  // 3. TURNTABLE / SLEW RING
  // ═══════════════════════════════════════════════════════════════
  const turntableGroup = new THREE.Group();

  // Slew ring base
  const slewRingGeo = new THREE.TorusGeometry(0.8, 0.08, 12, 48);
  const slewRing = new THREE.Mesh(slewRingGeo, chrome);
  slewRing.rotation.x = Math.PI / 2;
  slewRing.position.set(0, 1.25, -0.2);
  turntableGroup.add(slewRing);

  // Slew ring teeth
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const toothGeo = new THREE.BoxGeometry(0.02, 0.04, 0.06);
    const tooth = new THREE.Mesh(toothGeo, steel);
    tooth.position.set(
      Math.cos(angle) * 0.88, 1.25, -0.2 + Math.sin(angle) * 0.88
    );
    tooth.rotation.y = angle;
    turntableGroup.add(tooth);
  }

  // Turntable platform
  const turntablePlatGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.12, 32);
  const turntablePlat = new THREE.Mesh(turntablePlatGeo, orangeBody);
  turntablePlat.position.set(0, 1.35, -0.2);
  turntableGroup.add(turntablePlat);
  meshes.turntable = turntablePlat;

  group.add(turntableGroup);

  // ═══════════════════════════════════════════════════════════════
  // 4. ENGINE COMPARTMENT (Rear)
  // ═══════════════════════════════════════════════════════════════
  const engineGroup = new THREE.Group();

  // Engine hood
  const hoodShape = new THREE.Shape();
  hoodShape.moveTo(-0.9, 0);
  hoodShape.lineTo(0.9, 0);
  hoodShape.quadraticCurveTo(1.0, 0, 1.0, 0.15);
  hoodShape.lineTo(1.0, 0.65);
  hoodShape.quadraticCurveTo(1.0, 0.75, 0.85, 0.75);
  hoodShape.lineTo(-0.85, 0.75);
  hoodShape.quadraticCurveTo(-1.0, 0.75, -1.0, 0.65);
  hoodShape.lineTo(-1.0, 0.15);
  hoodShape.quadraticCurveTo(-1.0, 0, -0.9, 0);
  const hoodExtSettings = { depth: 1.6, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 };
  const hoodGeo = new THREE.ExtrudeGeometry(hoodShape, hoodExtSettings);
  const hoodMesh = new THREE.Mesh(hoodGeo, orangeBody);
  hoodMesh.position.set(0, 1.2, -1.8);
  engineGroup.add(hoodMesh);
  meshes.engineHood = hoodMesh;

  // Engine block
  const engineBlockGeo = new THREE.BoxGeometry(1.2, 0.5, 0.9);
  const engineBlock = new THREE.Mesh(engineBlockGeo, darkSteel);
  engineBlock.position.set(0, 1.55, -1.3);
  engineGroup.add(engineBlock);
  meshes.engineBlock = engineBlock;

  // Cylinder head
  const cylHeadGeo = new THREE.BoxGeometry(1.0, 0.15, 0.7);
  const cylHead = new THREE.Mesh(cylHeadGeo, aluminum);
  cylHead.position.set(0, 1.83, -1.3);
  engineGroup.add(cylHead);

  // Intake manifold
  for (let i = 0; i < 4; i++) {
    const pipePoints = [
      new THREE.Vector3(-0.3 + i * 0.2, 1.95, -1.3),
      new THREE.Vector3(-0.3 + i * 0.2, 2.1, -1.15),
      new THREE.Vector3(-0.3 + i * 0.2, 2.05, -0.95),
    ];
    const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 12, 0.03, 8, false);
    const pipe = new THREE.Mesh(pipeGeo, aluminum);
    engineGroup.add(pipe);
  }

  // Turbocharger
  const turboBodyGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16);
  const turbo = new THREE.Mesh(turboBodyGeo, chrome);
  turbo.rotation.z = Math.PI / 2;
  turbo.position.set(0.55, 1.75, -1.2);
  engineGroup.add(turbo);
  meshes.turbo = turbo;

  const turboInletGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 12);
  const turboInlet = new THREE.Mesh(turboInletGeo, aluminum);
  turboInlet.position.set(0.55, 1.75, -1.05);
  turboInlet.rotation.x = Math.PI / 2;
  engineGroup.add(turboInlet);

  // Radiator
  const radiatorGeo = new THREE.BoxGeometry(1.4, 0.6, 0.08);
  const radiator = new THREE.Mesh(radiatorGeo, copper);
  radiator.position.set(0, 1.6, -2.15);
  engineGroup.add(radiator);

  // Radiator fins
  for (let i = 0; i < 20; i++) {
    const finGeo = new THREE.BoxGeometry(1.35, 0.02, 0.06);
    const fin = new THREE.Mesh(finGeo, copper);
    fin.position.set(0, 1.32 + i * 0.028, -2.15);
    engineGroup.add(fin);
  }

  // Cooling fan behind radiator
  const fanGroup = new THREE.Group();
  const fanHubGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
  const fanHub = new THREE.Mesh(fanHubGeo, darkSteel);
  fanHub.rotation.x = Math.PI / 2;
  fanGroup.add(fanHub);

  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const bladeGeo = new THREE.BoxGeometry(0.25, 0.04, 0.015);
    const blade = new THREE.Mesh(bladeGeo, plastic);
    blade.position.set(Math.cos(angle) * 0.15, Math.sin(angle) * 0.15, 0);
    blade.rotation.z = angle + 0.3;
    fanGroup.add(blade);
  }
  fanGroup.position.set(0, 1.6, -2.08);
  engineGroup.add(fanGroup);
  meshes.coolingFan = fanGroup;

  // Exhaust system
  const exhaustPoints = [
    new THREE.Vector3(0.6, 1.5, -1.6),
    new THREE.Vector3(0.7, 1.4, -2.0),
    new THREE.Vector3(0.7, 1.8, -2.3),
    new THREE.Vector3(0.65, 2.5, -2.2),
    new THREE.Vector3(0.6, 3.0, -2.1),
  ];
  const exhaustCurve = new THREE.CatmullRomCurve3(exhaustPoints);
  const exhaustGeo = new THREE.TubeGeometry(exhaustCurve, 20, 0.05, 12, false);
  const exhaust = new THREE.Mesh(exhaustGeo, exhaustMetal);
  engineGroup.add(exhaust);
  meshes.exhaust = exhaust;

  // Exhaust cap
  const exCapGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.15, 12, 1, true);
  const exCap = new THREE.Mesh(exCapGeo, exhaustMetal);
  exCap.position.set(0.6, 3.08, -2.1);
  engineGroup.add(exCap);

  // Exhaust heat glow
  const exGlowGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const exGlow = new THREE.Mesh(exGlowGeo, neonOrange);
  exGlow.position.set(0.6, 3.12, -2.1);
  engineGroup.add(exGlow);
  meshes.exhaustGlow = exGlow;

  // Engine ventilation grills
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 8; i++) {
      const grillGeo = new THREE.BoxGeometry(0.02, 0.04, 0.6);
      const grill = new THREE.Mesh(grillGeo, blackMetal);
      grill.position.set(side * 1.02, 1.55 + i * 0.07, -1.4);
      engineGroup.add(grill);
    }
  }

  group.add(engineGroup);

  // ═══════════════════════════════════════════════════════════════
  // 5. COUNTERWEIGHT
  // ═══════════════════════════════════════════════════════════════
  const cwShape = new THREE.Shape();
  cwShape.moveTo(-1.1, 0);
  cwShape.lineTo(1.1, 0);
  cwShape.quadraticCurveTo(1.2, 0, 1.2, 0.15);
  cwShape.lineTo(1.2, 0.5);
  cwShape.quadraticCurveTo(1.2, 0.6, 1.0, 0.6);
  cwShape.lineTo(-1.0, 0.6);
  cwShape.quadraticCurveTo(-1.2, 0.6, -1.2, 0.5);
  cwShape.lineTo(-1.2, 0.15);
  cwShape.quadraticCurveTo(-1.2, 0, -1.1, 0);
  const cwExtSettings = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 };
  const cwGeo = new THREE.ExtrudeGeometry(cwShape, cwExtSettings);
  const counterweight = new THREE.Mesh(cwGeo, counterweightGrey);
  counterweight.position.set(0, 1.2, -2.55);
  group.add(counterweight);
  meshes.counterweight = counterweight;

  // CW ribs
  for (let i = 0; i < 3; i++) {
    const ribGeo = new THREE.BoxGeometry(2.2, 0.06, 0.04);
    const rib = new THREE.Mesh(ribGeo, darkSteel);
    rib.position.set(0, 1.35 + i * 0.18, -2.52);
    group.add(rib);
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. OUTRIGGERS (4 units)
  // ═══════════════════════════════════════════════════════════════
  const outriggerPositions = [
    { x: -1.6, z: 1.6, name: 'outriggerFL' },
    { x: 1.6, z: 1.6, name: 'outriggerFR' },
    { x: -1.6, z: -1.6, name: 'outriggerRL' },
    { x: 1.6, z: -1.6, name: 'outriggerRR' },
  ];

  outriggerPositions.forEach(op => {
    const outriggerGroup = new THREE.Group();

    // Main outrigger beam
    const beamGeo = new THREE.BoxGeometry(0.12, 0.1, 0.6);
    const beam = new THREE.Mesh(beamGeo, yellowAccent);
    beam.position.set(0, 0, 0);
    outriggerGroup.add(beam);

    // Extension beam (telescopic)
    const extBeamGeo = new THREE.BoxGeometry(0.08, 0.07, 0.5);
    const extBeam = new THREE.Mesh(extBeamGeo, steel);
    extBeam.position.set(0, 0, op.x > 0 ? 0.45 : -0.45);
    outriggerGroup.add(extBeam);

    // Hydraulic cylinder
    const cylGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8);
    const cyl = new THREE.Mesh(cylGeo, hydraulicSilver);
    cyl.position.set(0, -0.25, 0);
    outriggerGroup.add(cyl);

    // Piston rod
    const rodGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8);
    const rod = new THREE.Mesh(rodGeo, chrome);
    rod.position.set(0, -0.55, 0);
    outriggerGroup.add(rod);

    // Foot pad
    const padGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.04, 16);
    const pad = new THREE.Mesh(padGeo, darkSteel);
    pad.position.set(0, -0.75, 0);
    outriggerGroup.add(pad);

    // Foot pad grip pattern
    for (let i = 0; i < 8; i++) {
      const gripGeo = new THREE.BoxGeometry(0.3, 0.01, 0.02);
      const grip = new THREE.Mesh(gripGeo, rubber);
      grip.position.set(0, -0.77, -0.1 + i * 0.025);
      grip.rotation.y = Math.PI / 4;
      outriggerGroup.add(grip);
    }

    outriggerGroup.position.set(op.x, 0.7, op.z);
    outriggerGroup.rotation.y = op.x > 0 ? -Math.PI / 4 : Math.PI / 4;
    group.add(outriggerGroup);
    meshes[op.name] = outriggerGroup;
  });

  // ═══════════════════════════════════════════════════════════════
  // 7. MULTI-SECTION ARTICULATING BOOM
  // ═══════════════════════════════════════════════════════════════
  const boomGroup = new THREE.Group();
  boomGroup.position.set(0, 1.45, -0.2);

  // --- Section 1: Lower boom (main boom) ---
  const boom1Group = new THREE.Group();
  const boom1Geo = new THREE.BoxGeometry(0.4, 0.35, 2.8);
  const boom1 = new THREE.Mesh(boom1Geo, orangeBody);
  boom1.position.set(0, 0.3, 1.4);
  boom1Group.add(boom1);

  // Boom 1 reinforcement plates
  for (let side = -1; side <= 1; side += 2) {
    const plateGeo = new THREE.BoxGeometry(0.02, 0.32, 2.7);
    const plate = new THREE.Mesh(plateGeo, darkOrange);
    plate.position.set(side * 0.21, 0.3, 1.4);
    boom1Group.add(plate);
  }

  // Boom 1 pivot at base
  const pivot1Geo = new THREE.CylinderGeometry(0.1, 0.1, 0.55, 16);
  const pivot1 = new THREE.Mesh(pivot1Geo, chrome);
  pivot1.rotation.z = Math.PI / 2;
  pivot1.position.set(0, 0.15, 0);
  boom1Group.add(pivot1);

  // Hydraulic cylinder for boom1 lift
  const liftCylGroup = new THREE.Group();
  const liftCylGeo = new THREE.CylinderGeometry(0.05, 0.06, 1.4, 12);
  const liftCyl = new THREE.Mesh(liftCylGeo, hydraulicSilver);
  liftCyl.position.set(0.22, 0.5, 0.5);
  liftCyl.rotation.x = 0.25;
  liftCylGroup.add(liftCyl);

  const liftRodGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
  const liftRod = new THREE.Mesh(liftRodGeo, chrome);
  liftRod.position.set(0.22, 1.1, 0.75);
  liftRod.rotation.x = 0.25;
  liftCylGroup.add(liftRod);
  boom1Group.add(liftCylGroup);
  meshes.boomLiftCylinder = liftCylGroup;

  boomGroup.add(boom1Group);
  meshes.boom1 = boom1Group;

  // --- Section 2: Mid boom (articulating knuckle section) ---
  const boom2Group = new THREE.Group();
  boom2Group.position.set(0, 0.3, 2.8);

  // Knuckle joint
  const knuckleGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16);
  const knuckle = new THREE.Mesh(knuckleGeo, chrome);
  knuckle.rotation.z = Math.PI / 2;
  boom2Group.add(knuckle);
  meshes.knuckle = knuckle;

  // Mid boom beam
  const boom2Geo = new THREE.BoxGeometry(0.35, 0.3, 2.2);
  const boom2Mesh = new THREE.Mesh(boom2Geo, orangeBody);
  boom2Mesh.position.set(0, 0, 1.1);
  boom2Group.add(boom2Mesh);

  // Reinforcement
  for (let side = -1; side <= 1; side += 2) {
    const plateGeo = new THREE.BoxGeometry(0.02, 0.28, 2.1);
    const plate = new THREE.Mesh(plateGeo, darkOrange);
    plate.position.set(side * 0.185, 0, 1.1);
    boom2Group.add(plate);
  }

  // Knuckle hydraulic cylinder
  const knuckleCylGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.2, 10);
  const knuckleCyl = new THREE.Mesh(knuckleCylGeo, hydraulicSilver);
  knuckleCyl.rotation.x = -0.3;
  knuckleCyl.position.set(-0.2, 0.25, 0.5);
  boom2Group.add(knuckleCyl);
  meshes.knuckleCylinder = knuckleCyl;

  const knuckleRodGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8);
  const knuckleRod = new THREE.Mesh(knuckleRodGeo, chrome);
  knuckleRod.rotation.x = -0.3;
  knuckleRod.position.set(-0.2, 0.6, 0.75);
  boom2Group.add(knuckleRod);

  boom1Group.add(boom2Group);
  meshes.boom2 = boom2Group;

  // --- Section 3: Upper boom (telescoping section) ---
  const boom3Group = new THREE.Group();
  boom3Group.position.set(0, 0, 2.2);

  // Pivot joint
  const pivot3Geo = new THREE.CylinderGeometry(0.1, 0.1, 0.42, 16);
  const pivot3 = new THREE.Mesh(pivot3Geo, chrome);
  pivot3.rotation.z = Math.PI / 2;
  boom3Group.add(pivot3);

  // Outer telescoping section
  const boom3OuterGeo = new THREE.BoxGeometry(0.32, 0.28, 2.5);
  const boom3Outer = new THREE.Mesh(boom3OuterGeo, orangeBody);
  boom3Outer.position.set(0, 0, 1.25);
  boom3Group.add(boom3Outer);

  // Inner telescoping section (slides out)
  const boom3InnerGeo = new THREE.BoxGeometry(0.24, 0.2, 2.0);
  const boom3Inner = new THREE.Mesh(boom3InnerGeo, darkOrange);
  boom3Inner.position.set(0, 0, 2.4);
  boom3Group.add(boom3Inner);
  meshes.telescopingSection = boom3Inner;

  // Telescoping hydraulic
  const teleCylGeo = new THREE.CylinderGeometry(0.035, 0.04, 1.8, 10);
  const teleCyl = new THREE.Mesh(teleCylGeo, hydraulicSilver);
  teleCyl.rotation.x = Math.PI / 2;
  teleCyl.position.set(0, -0.05, 1.5);
  boom3Group.add(teleCyl);

  const teleRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
  const teleRod = new THREE.Mesh(teleRodGeo, chrome);
  teleRod.rotation.x = Math.PI / 2;
  teleRod.position.set(0, -0.05, 2.8);
  boom3Group.add(teleRod);

  // Hydraulic hose routing along boom
  const hosePathBoom = [
    new THREE.Vector3(0.15, 0.16, 0),
    new THREE.Vector3(0.15, 0.16, 0.8),
    new THREE.Vector3(0.14, 0.15, 1.6),
    new THREE.Vector3(0.14, 0.15, 2.4),
    new THREE.Vector3(0.13, 0.14, 3.2),
  ];
  const hoseCurveBoom = new THREE.CatmullRomCurve3(hosePathBoom);
  for (let h = 0; h < 2; h++) {
    const hGeo = new THREE.TubeGeometry(hoseCurveBoom, 20, 0.015, 6, false);
    const hMesh = new THREE.Mesh(hGeo, hoseBlack);
    hMesh.position.x = h * 0.04;
    boom3Group.add(hMesh);
  }

  boom2Group.add(boom3Group);
  meshes.boom3 = boom3Group;

  // --- Section 4: Jib (fly boom) ---
  const jibGroup = new THREE.Group();
  jibGroup.position.set(0, 0, 3.5);

  // Jib pivot
  const jibPivotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.38, 12);
  const jibPivot = new THREE.Mesh(jibPivotGeo, chrome);
  jibPivot.rotation.z = Math.PI / 2;
  jibGroup.add(jibPivot);

  // Jib beam
  const jibGeo = new THREE.BoxGeometry(0.2, 0.18, 1.6);
  const jibMesh = new THREE.Mesh(jibGeo, orangeBody);
  jibMesh.position.set(0, 0, 0.8);
  jibGroup.add(jibMesh);

  // Jib reinforcement webs
  for (let i = 0; i < 5; i++) {
    const webGeo = new THREE.BoxGeometry(0.18, 0.01, 0.08);
    const web = new THREE.Mesh(webGeo, darkOrange);
    web.position.set(0, 0.095, 0.15 + i * 0.3);
    jibGroup.add(web);
  }

  // Jib hydraulic
  const jibCylGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.8, 8);
  const jibCyl = new THREE.Mesh(jibCylGeo, hydraulicSilver);
  jibCyl.rotation.x = 0.4;
  jibCyl.position.set(0.1, 0.15, 0.3);
  jibGroup.add(jibCyl);

  boom3Group.add(jibGroup);
  meshes.jib = jibGroup;

  group.add(boomGroup);
  meshes.boomAssembly = boomGroup;

  // ═══════════════════════════════════════════════════════════════
  // 8. WORK PLATFORM / BASKET
  // ═══════════════════════════════════════════════════════════════
  const basketGroup = new THREE.Group();

  // Platform rotator
  const rotatorGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16);
  const rotator = new THREE.Mesh(rotatorGeo, chrome);
  basketGroup.add(rotator);
  meshes.platformRotator = rotator;

  // Platform base (floor)
  const floorGeo = new THREE.BoxGeometry(0.9, 0.04, 0.55);
  const floorMesh = new THREE.Mesh(floorGeo, darkSteel);
  floorMesh.position.set(0, -0.08, 0);
  basketGroup.add(floorMesh);

  // Anti-slip floor pattern
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 5; j++) {
      const dotGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.005, 6);
      const dot = new THREE.Mesh(dotGeo, rubberGrip);
      dot.position.set(-0.35 + i * 0.1, -0.055, -0.2 + j * 0.1);
      basketGroup.add(dot);
    }
  }

  // Basket railing posts
  const railPostPositions = [
    [-0.45, 0, 0.275], [0.45, 0, 0.275],
    [-0.45, 0, -0.275], [0.45, 0, -0.275],
    [-0.45, 0, 0], [0.45, 0, 0],
  ];
  railPostPositions.forEach(pos => {
    const postGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.55, 8);
    const post = new THREE.Mesh(postGeo, yellowAccent);
    post.position.set(pos[0], 0.2, pos[2]);
    basketGroup.add(post);
  });

  // Basket railing horizontal bars (top, mid, toe)
  const railConfigs = [
    { y: 0.45, thickness: 0.018 },
    { y: 0.25, thickness: 0.014 },
    { y: 0.05, thickness: 0.012 },
  ];

  railConfigs.forEach(rc => {
    // Front and back rails
    [-0.275, 0.275].forEach(zz => {
      const barGeo = new THREE.CylinderGeometry(rc.thickness, rc.thickness, 0.9, 8);
      const bar = new THREE.Mesh(barGeo, yellowAccent);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, rc.y, zz);
      basketGroup.add(bar);
    });
    // Side rails
    [-0.45, 0.45].forEach(xx => {
      const barGeo = new THREE.CylinderGeometry(rc.thickness, rc.thickness, 0.55, 8);
      const bar = new THREE.Mesh(barGeo, yellowAccent);
      bar.position.set(xx, rc.y, 0);
      basketGroup.add(bar);
    });
  });

  // Basket mesh infill (wire mesh panels)
  const meshPanelGeo = new THREE.PlaneGeometry(0.88, 0.38, 6, 4);
  const meshPanelMat = new THREE.MeshStandardMaterial({
    color: 0x888888, roughness: 0.5, metalness: 0.6, wireframe: true, transparent: true, opacity: 0.5
  });
  [-0.275, 0.275].forEach(zz => {
    const panel = new THREE.Mesh(meshPanelGeo, meshPanelMat);
    panel.position.set(0, 0.25, zz);
    panel.rotation.y = zz > 0 ? 0 : Math.PI;
    basketGroup.add(panel);
  });

  // Control console in basket
  const consoleGroup = new THREE.Group();
  const consolePillarGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8);
  const consolePillar = new THREE.Mesh(consolePillarGeo, blackMetal);
  consolePillar.position.set(0.35, 0.1, 0);
  consoleGroup.add(consolePillar);

  // Console box
  const consBoxGeo = new THREE.BoxGeometry(0.15, 0.12, 0.18);
  const consBox = new THREE.Mesh(consBoxGeo, blackMetal);
  consBox.position.set(0.35, 0.32, 0);
  consoleGroup.add(consBox);

  // Joystick
  const joyBaseGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.04, 8);
  const joyBase = new THREE.Mesh(joyBaseGeo, rubber);
  joyBase.position.set(0.35, 0.4, 0);
  consoleGroup.add(joyBase);

  const joyStickGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 6);
  const joyStick = new THREE.Mesh(joyStickGeo, blackMetal);
  joyStick.position.set(0.35, 0.45, 0);
  consoleGroup.add(joyStick);

  const joyKnobGeo = new THREE.SphereGeometry(0.015, 8, 8);
  const joyKnob = new THREE.Mesh(joyKnobGeo, rubberGrip);
  joyKnob.position.set(0.35, 0.5, 0);
  consoleGroup.add(joyKnob);

  // Status LEDs on console
  const ledColors = [neonGreen, statusBlue, redLight];
  ledColors.forEach((col, i) => {
    const ledGeo = new THREE.SphereGeometry(0.008, 6, 6);
    const led = new THREE.Mesh(ledGeo, col);
    led.position.set(0.35, 0.36, -0.05 + i * 0.05);
    consoleGroup.add(led);
  });

  basketGroup.add(consoleGroup);

  // E-Stop button on basket
  const eStopGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.015, 12);
  const eStop = new THREE.Mesh(eStopGeo, redLight);
  eStop.position.set(0.35, 0.39, 0.06);
  basketGroup.add(eStop);
  meshes.eStop = eStop;

  // Position basket at end of jib
  basketGroup.position.set(0, 0, 1.7);
  jibGroup.add(basketGroup);
  meshes.basket = basketGroup;

  // ═══════════════════════════════════════════════════════════════
  // 9. GROUND CONTROL STATION
  // ═══════════════════════════════════════════════════════════════
  const groundControlGroup = new THREE.Group();

  // Control panel box
  const gcBoxGeo = new THREE.BoxGeometry(0.35, 0.45, 0.12);
  const gcBox = new THREE.Mesh(gcBoxGeo, yellowAccent);
  gcBox.position.set(-1.25, 1.35, 0.5);
  groundControlGroup.add(gcBox);

  // Panel screen
  const screenGeo = new THREE.PlaneGeometry(0.2, 0.15);
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x002244, emissive: 0x003366, emissiveIntensity: 0.6 });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(-1.25, 1.42, 0.565);
  groundControlGroup.add(screen);
  meshes.groundScreen = screen;

  // Ground control joysticks
  for (let j = 0; j < 2; j++) {
    const gjGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.06, 6);
    const gj = new THREE.Mesh(gjGeo, blackMetal);
    gj.position.set(-1.25 + (j - 0.5) * 0.1, 1.6, 0.55);
    groundControlGroup.add(gj);
  }

  // Ground control status lights
  for (let i = 0; i < 3; i++) {
    const lightGeo = new THREE.SphereGeometry(0.012, 6, 6);
    const lMat = i === 0 ? neonGreen : i === 1 ? statusBlue : redLight;
    const light = new THREE.Mesh(lightGeo, lMat);
    light.position.set(-1.25 - 0.08 + i * 0.08, 1.55, 0.565);
    groundControlGroup.add(light);
  }

  group.add(groundControlGroup);

  // ═══════════════════════════════════════════════════════════════
  // 10. HYDRAULIC SYSTEM ROUTING
  // ═══════════════════════════════════════════════════════════════
  // Main hydraulic lines from engine to turntable
  const mainHosePoints = [
    new THREE.Vector3(0.3, 1.5, -1.0),
    new THREE.Vector3(0.3, 1.5, -0.5),
    new THREE.Vector3(0.25, 1.4, -0.2),
    new THREE.Vector3(0.2, 1.5, 0.1),
  ];
  const mainHoseCurve = new THREE.CatmullRomCurve3(mainHosePoints);
  for (let h = 0; h < 3; h++) {
    const hGeo = new THREE.TubeGeometry(mainHoseCurve, 16, 0.018, 6, false);
    const hMesh = new THREE.Mesh(hGeo, hoseBlack);
    hMesh.position.z = h * 0.04;
    group.add(hMesh);
  }

  // Hydraulic reservoir tank
  const tankGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
  const tank = new THREE.Mesh(tankGeo, steel);
  tank.position.set(-0.5, 1.5, -1.0);
  group.add(tank);

  // Hydraulic pump
  const pumpGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.25, 12);
  const pump = new THREE.Mesh(pumpGeo, aluminum);
  pump.rotation.z = Math.PI / 2;
  pump.position.set(-0.5, 1.5, -0.7);
  group.add(pump);
  meshes.hydraulicPump = pump;

  // ═══════════════════════════════════════════════════════════════
  // 11. SAFETY FEATURES & LIGHTS
  // ═══════════════════════════════════════════════════════════════
  // Rotating beacon on engine hood
  const beaconBaseGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.04, 12);
  const beaconBase = new THREE.Mesh(beaconBaseGeo, blackMetal);
  beaconBase.position.set(0, 2.0, -1.8);
  group.add(beaconBase);

  const beaconLensGeo = new THREE.SphereGeometry(0.05, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const beaconLens = new THREE.Mesh(beaconLensGeo, neonOrange);
  beaconLens.position.set(0, 2.02, -1.8);
  group.add(beaconLens);
  meshes.beacon = beaconLens;

  // Head lights (front)
  for (let side = -1; side <= 1; side += 2) {
    const lightHouseGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.05, 12);
    const lightHouse = new THREE.Mesh(lightHouseGeo, blackMetal);
    lightHouse.rotation.x = Math.PI / 2;
    lightHouse.position.set(side * 0.8, 1.0, 2.05);
    group.add(lightHouse);

    const lensGeo = new THREE.SphereGeometry(0.055, 8, 8, 0, Math.PI);
    const lens = new THREE.Mesh(lensGeo, whiteLens);
    lens.rotation.x = -Math.PI / 2;
    lens.position.set(side * 0.8, 1.0, 2.08);
    group.add(lens);
  }

  // Tail lights
  for (let side = -1; side <= 1; side += 2) {
    const tailGeo = new THREE.BoxGeometry(0.1, 0.06, 0.03);
    const tail = new THREE.Mesh(tailGeo, redLight);
    tail.position.set(side * 0.9, 1.0, -2.6);
    group.add(tail);
  }

  // Platform work lights
  const workLightGeo = new THREE.BoxGeometry(0.06, 0.04, 0.04);
  const workLight = new THREE.Mesh(workLightGeo, whiteLens);
  workLight.position.set(0, 0.48, 0.28);
  basketGroup.add(workLight);
  meshes.workLight = workLight;

  // ═══════════════════════════════════════════════════════════════
  // 12. STEPS / ACCESS LADDER
  // ═══════════════════════════════════════════════════════════════
  const ladderGroup = new THREE.Group();
  // Ladder rails
  for (let side = -1; side <= 1; side += 2) {
    const railGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6);
    const rail = new THREE.Mesh(railGeo, yellowAccent);
    rail.position.set(-1.25 + side * 0.15, 0.9, 1.5);
    ladderGroup.add(rail);
  }
  // Steps
  for (let i = 0; i < 4; i++) {
    const stepGeo = new THREE.BoxGeometry(0.28, 0.02, 0.08);
    const step = new THREE.Mesh(stepGeo, darkSteel);
    step.position.set(-1.25, 0.55 + i * 0.18, 1.5);
    ladderGroup.add(step);

    // Step grip
    const gripGeo = new THREE.BoxGeometry(0.26, 0.005, 0.07);
    const grip = new THREE.Mesh(gripGeo, rubberGrip);
    grip.position.set(-1.25, 0.565 + i * 0.18, 1.5);
    ladderGroup.add(grip);
  }
  group.add(ladderGroup);

  // ═══════════════════════════════════════════════════════════════
  // 13. FUEL TANK & BATTERY
  // ═══════════════════════════════════════════════════════════════
  const fuelTankGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 16);
  const fuelTank = new THREE.Mesh(fuelTankGeo, darkSteel);
  fuelTank.rotation.z = Math.PI / 2;
  fuelTank.position.set(0.8, 1.15, -0.8);
  group.add(fuelTank);

  // Fuel cap
  const fuelCapGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 8);
  const fuelCap = new THREE.Mesh(fuelCapGeo, chrome);
  fuelCap.position.set(0.8, 1.34, -0.8);
  group.add(fuelCap);

  // Battery box
  const batteryGeo = new THREE.BoxGeometry(0.3, 0.2, 0.25);
  const battery = new THREE.Mesh(batteryGeo, blackMetal);
  battery.position.set(-0.8, 1.2, -0.8);
  group.add(battery);

  // Battery terminals
  for (let i = 0; i < 2; i++) {
    const termGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 6);
    const termMat = i === 0 ? new THREE.MeshStandardMaterial({ color: 0xff0000 }) : new THREE.MeshStandardMaterial({ color: 0x000000 });
    const term = new THREE.Mesh(termGeo, termMat);
    term.position.set(-0.8 + (i - 0.5) * 0.1, 1.32, -0.8);
    group.add(term);
  }

  // ═══════════════════════════════════════════════════════════════
  // 14. DECALS & LABELING
  // ═══════════════════════════════════════════════════════════════
  // Warning stripes (chevron-like)
  for (let i = 0; i < 6; i++) {
    const stripeGeo = new THREE.BoxGeometry(0.04, 0.25, 0.005);
    const stripeMat = i % 2 === 0 ? yellowAccent : blackMetal;
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(-1.01, 1.5 + i * 0.001, -2.3 + i * 0.06);
    stripe.rotation.z = 0.4;
    group.add(stripe);
  }

  // Model plate
  const modelPlateGeo = new THREE.BoxGeometry(0.3, 0.08, 0.005);
  const modelPlate = new THREE.Mesh(modelPlateGeo, decalWhite);
  modelPlate.position.set(0, 1.7, -2.56);
  group.add(modelPlate);

  // ═══════════════════════════════════════════════════════════════
  // 15. PANEL LINES & RIVETS
  // ═══════════════════════════════════════════════════════════════
  // Rivets along chassis
  for (let i = 0; i < 20; i++) {
    const rivetGeo = new THREE.SphereGeometry(0.012, 4, 4);
    const rivet = new THREE.Mesh(rivetGeo, chrome);
    rivet.position.set(-1.22, 1.0, -1.8 + i * 0.2);
    group.add(rivet);
    const rivet2 = new THREE.Mesh(rivetGeo.clone(), chrome);
    rivet2.position.set(1.22, 1.0, -1.8 + i * 0.2);
    group.add(rivet2);
  }

  // Panel lines
  for (let i = 0; i < 5; i++) {
    const lineGeo = new THREE.BoxGeometry(0.005, 0.005, 1.5);
    const line = new THREE.Mesh(lineGeo, blackMetal);
    line.position.set(1.02, 1.2 + i * 0.15, -1.2);
    group.add(line);
  }

  // ═══════════════════════════════════════════════════════════════
  // 16. MIRRORS
  // ═══════════════════════════════════════════════════════════════
  for (let side = -1; side <= 1; side += 2) {
    const mirrorArmGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.25, 6);
    const arm = new THREE.Mesh(mirrorArmGeo, blackMetal);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(side * 1.35, 1.35, 1.0);
    group.add(arm);

    const mirrorGeo = new THREE.BoxGeometry(0.02, 0.1, 0.07);
    const mirror = new THREE.Mesh(mirrorGeo, tinted);
    mirror.position.set(side * 1.48, 1.35, 1.0);
    group.add(mirror);
  }

  // ═══════════════════════════════════════════════════════════════
  // 17. HYDRAULIC HOSE BUNDLE ALONG BOOM
  // ═══════════════════════════════════════════════════════════════
  const hoseBundlePath = [
    new THREE.Vector3(0.18, 1.55, 0),
    new THREE.Vector3(0.18, 1.75, 0.5),
    new THREE.Vector3(0.18, 1.8, 1.0),
    new THREE.Vector3(0.18, 1.85, 1.8),
  ];
  const bundleCurve = new THREE.CatmullRomCurve3(hoseBundlePath);
  for (let h = 0; h < 4; h++) {
    const hGeo = new THREE.TubeGeometry(bundleCurve, 16, 0.012, 5, false);
    const colors = [hoseBlack, hoseBlack, new THREE.MeshStandardMaterial({ color: 0x0000aa, roughness: 0.8 }), new THREE.MeshStandardMaterial({ color: 0xaa0000, roughness: 0.8 })];
    const hMesh = new THREE.Mesh(hGeo, colors[h]);
    hMesh.position.z = h * 0.03;
    group.add(hMesh);
  }

  // ═══════════════════════════════════════════════════════════════
  // 18. NEON / FUTURISTIC ACCENT ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  // Neon ring around turntable
  const neonRingGeo = new THREE.TorusGeometry(0.9, 0.015, 8, 48);
  const neonRing = new THREE.Mesh(neonRingGeo, neonGreen);
  neonRing.rotation.x = Math.PI / 2;
  neonRing.position.set(0, 1.26, -0.2);
  group.add(neonRing);
  meshes.neonRing = neonRing;

  // Neon strips along boom sections
  const neonStripGeo = new THREE.BoxGeometry(0.01, 0.01, 2.7);
  const neonStrip1 = new THREE.Mesh(neonStripGeo, neonOrange);
  neonStrip1.position.set(0.21, 1.82, 1.55);
  group.add(neonStrip1);
  meshes.neonStrip1 = neonStrip1;

  // Plasma core indicator on engine
  const plasmaGeo = new THREE.IcosahedronGeometry(0.08, 2);
  const plasmaMat = new THREE.MeshStandardMaterial({
    color: 0x00ccff, emissive: 0x00aaff, emissiveIntensity: 1.0,
    roughness: 0.0, metalness: 0.8, transparent: true, opacity: 0.7,
  });
  const plasmaCore = new THREE.Mesh(plasmaGeo, plasmaMat);
  plasmaCore.position.set(0, 1.95, -1.3);
  group.add(plasmaCore);
  meshes.plasmaCore = plasmaCore;

  // Energy rings around plasma core
  for (let i = 0; i < 3; i++) {
    const eRingGeo = new THREE.TorusGeometry(0.12 + i * 0.04, 0.005, 8, 32);
    const eRing = new THREE.Mesh(eRingGeo, statusBlue);
    eRing.position.set(0, 1.95, -1.3);
    eRing.rotation.x = Math.PI / 2 + i * 0.5;
    eRing.rotation.y = i * 0.8;
    group.add(eRing);
    meshes['energyRing' + i] = eRing;
  }

  // ═══════════════════════════════════════════════════════════════
  // PARTS DEFINITION
  // ═══════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Chassis Frame',
      description: 'Heavy-duty welded steel frame providing structural foundation with integrated cross-members and mounting points for all major systems.',
      material: 'High-strength structural steel (Grade 50)',
      function: 'Supports entire machine weight, distributes dynamic loads from boom operations, houses drivetrain and engine mounting.',
      assemblyOrder: 1,
      connections: ['Axles', 'Turntable Slew Ring', 'Engine Mounts', 'Outriggers'],
      failureEffect: 'Total structural collapse, machine becomes inoperable and dangerous.',
      cascadeFailures: ['Turntable Slew Ring', 'Boom Assembly', 'Work Platform'],
      originalPosition: { x: 0, y: 0.65, z: 0 },
      explodedPosition: { x: 0, y: -1.5, z: 0 },
    },
    {
      name: '4WD Tire & Wheel Assembly',
      description: 'Four heavy-duty pneumatic tires on aluminum alloy rims with 8-spoke pattern, deep-tread all-terrain pattern, and lug-nut secured hub assemblies.',
      material: 'Vulcanized rubber tires, forged aluminum rims, grade 8 steel lug nuts',
      function: 'Provides traction, mobility on rough terrain, load distribution, and shock absorption for transport mode.',
      assemblyOrder: 2,
      connections: ['Chassis Frame', 'Steering System', 'Axles', 'Drive Shaft'],
      failureEffect: 'Loss of mobility, potential machine tipping during transport if blowout occurs.',
      cascadeFailures: ['Steering System'],
      originalPosition: { x: -1.5, y: 0.55, z: 1.35 },
      explodedPosition: { x: -3.5, y: 0.55, z: 3.0 },
    },
    {
      name: 'Turntable Slew Ring',
      description: 'Precision-machined rotating bearing assembly with internal gear teeth enabling 360° continuous rotation of upper structure.',
      material: 'Case-hardened alloy steel, precision-ground roller bearing races',
      function: 'Enables continuous 360° rotation of the boom assembly relative to the chassis, transfers vertical loads to frame.',
      assemblyOrder: 3,
      connections: ['Chassis Frame', 'Boom Assembly', 'Hydraulic Rotary Joint'],
      failureEffect: 'Loss of rotation capability, boom locked in fixed position.',
      cascadeFailures: ['Boom Assembly', 'Work Platform'],
      originalPosition: { x: 0, y: 1.25, z: -0.2 },
      explodedPosition: { x: 0, y: 3.5, z: -0.2 },
    },
    {
      name: 'Diesel Engine Assembly',
      description: 'Turbocharged 4-cylinder diesel engine with intercooler, producing ~74hp for hydraulic pump drive and propulsion.',
      material: 'Cast iron block, aluminum cylinder head, steel crankshaft, turbocharger alloy housing',
      function: 'Provides primary motive power for hydraulic system, propulsion drive, and electrical generation.',
      assemblyOrder: 4,
      connections: ['Chassis Frame', 'Hydraulic Pump', 'Exhaust System', 'Radiator', 'Fuel Tank'],
      failureEffect: 'Complete loss of hydraulic and drive power. Machine becomes immobile with boom potentially stranded at height.',
      cascadeFailures: ['Hydraulic System', 'Boom Assembly', 'Propulsion', 'Work Platform Controls'],
      originalPosition: { x: 0, y: 1.55, z: -1.3 },
      explodedPosition: { x: 2.5, y: 3.0, z: -3.0 },
    },
    {
      name: 'Articulating Boom Assembly',
      description: 'Multi-section articulating boom with lower boom, knuckle joint, telescoping upper boom, and fly jib providing up to 86ft working height.',
      material: 'High-tensile T1 steel tube sections, chrome-plated pivot pins, hardened bushings',
      function: 'Provides precise vertical and horizontal positioning of work platform through articulated and telescoping sections.',
      assemblyOrder: 5,
      connections: ['Turntable Slew Ring', 'Hydraulic Cylinders', 'Work Platform', 'Hydraulic Hose Bundle'],
      failureEffect: 'Platform positioning compromised, potential uncontrolled descent if hydraulic lock fails.',
      cascadeFailures: ['Work Platform', 'Hydraulic System'],
      originalPosition: { x: 0, y: 1.45, z: -0.2 },
      explodedPosition: { x: 0, y: 5.0, z: 2.0 },
    },
    {
      name: 'Work Platform / Basket',
      description: 'Steel mesh-enclosed work platform with anti-slip flooring, triple-rail safety system, dual joystick controls, and E-stop functionality.',
      material: 'Welded steel tube frame, expanded metal mesh panels, rubber anti-slip matting',
      function: 'Provides safe elevated work position for up to 2 operators (500 lb capacity) with integrated proportional controls.',
      assemblyOrder: 6,
      connections: ['Jib Section', 'Platform Rotator', 'Control Console', 'Safety Interlocks'],
      failureEffect: 'Worker safety compromised, potential fall hazard if guardrails fail.',
      cascadeFailures: ['Operator Safety'],
      originalPosition: { x: 0, y: 0, z: 1.7 },
      explodedPosition: { x: 3.0, y: 6.0, z: 5.0 },
    },
    {
      name: 'Outrigger Stabilizer System',
      description: 'Four hydraulically-deployed outrigger legs with telescoping beams and large-area ground pads for machine stabilization.',
      material: 'Box-section steel beams, hydraulic cylinders, cast steel ground pads with rubber grips',
      function: 'Provides additional stability footprint during elevated boom operations, prevents tipping on uneven terrain.',
      assemblyOrder: 7,
      connections: ['Chassis Frame', 'Hydraulic System', 'Level Sensors'],
      failureEffect: 'Reduced stability envelope, increased tipping risk especially at maximum reach.',
      cascadeFailures: ['Machine Stability', 'Boom Operation Limits'],
      originalPosition: { x: -1.6, y: 0.7, z: 1.6 },
      explodedPosition: { x: -4.0, y: 0.7, z: 4.0 },
    },
    {
      name: 'Counterweight',
      description: 'Cast iron counterweight block with precision mounting providing rear balance against boom and platform loads at full extension.',
      material: 'High-density cast iron, steel mounting hardware',
      function: 'Offsets moment forces from extended boom and payload to maintain machine stability within rated capacity.',
      assemblyOrder: 8,
      connections: ['Chassis Frame'],
      failureEffect: 'Machine becomes unstable at lower boom extensions, reduced rated capacity.',
      cascadeFailures: ['Machine Stability', 'Maximum Reach Capacity'],
      originalPosition: { x: 0, y: 1.2, z: -2.55 },
      explodedPosition: { x: 0, y: -1.0, z: -5.0 },
    },
    {
      name: 'Hydraulic System',
      description: 'Complete hydraulic circuit including variable-displacement axial piston pump, reservoir, control valves, cylinders, and high-pressure hose network.',
      material: 'Steel pump housing, seamless steel tubing, braided steel reinforced hoses, chrome-plated cylinder rods',
      function: 'Converts engine mechanical power to hydraulic pressure for all boom, steering, drive, and outrigger functions.',
      assemblyOrder: 9,
      connections: ['Engine', 'All Cylinders', 'Control Valves', 'Reservoir Tank'],
      failureEffect: 'Loss of all powered functions. Machine relies on manual lowering valves for emergency descent.',
      cascadeFailures: ['All boom functions', 'Steering', 'Drive', 'Outriggers'],
      originalPosition: { x: -0.5, y: 1.5, z: -0.85 },
      explodedPosition: { x: -3.5, y: 2.5, z: -2.0 },
    },
    {
      name: 'Ground Control Station',
      description: 'Secondary operator control panel with LCD display, dual joysticks, and emergency override allowing full machine control from ground level.',
      material: 'Powder-coated steel enclosure, sealed membrane switches, weatherproof LCD',
      function: 'Provides redundant ground-level control for boom positioning, drive, and emergency recovery operations.',
      assemblyOrder: 10,
      connections: ['Electrical System', 'Hydraulic Valves', 'Safety Interlocks'],
      failureEffect: 'Loss of ground-level override capability. Platform controls remain functional.',
      cascadeFailures: ['Emergency Recovery'],
      originalPosition: { x: -1.25, y: 1.35, z: 0.5 },
      explodedPosition: { x: -4.0, y: 1.35, z: 2.0 },
    },
  ];

  // ═══════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ═══════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'What is the primary function of the articulating knuckle joint on a boom lift?',
      options: [
        'To increase the maximum load capacity',
        'To allow the boom to reach up and over obstacles',
        'To rotate the entire machine 360 degrees',
        'To stabilize the machine during transport',
      ],
      correct: 1,
      explanation: 'The articulating knuckle joint allows the boom to bend mid-span, enabling the platform to reach up and over obstacles like parapets, equipment, or building edges — a key advantage over telescopic boom lifts.',
      difficulty: 'medium',
    },
    {
      question: 'Why must outriggers be fully deployed before operating a boom lift at height?',
      options: [
        'To level the machine and increase the stability footprint against tipping',
        'To lift the tires off the ground for better rotation',
        'To reduce engine fuel consumption during operation',
        'To lock the steering system for safety',
      ],
      correct: 0,
      explanation: 'Outriggers widen the machine\'s support polygon and can level it on uneven terrain. This significantly increases the moment of resistance against tipping, which is critical when the boom extends laterally and creates large overturning moments.',
      difficulty: 'easy',
    },
    {
      question: 'What happens if the hydraulic pump fails while the boom is fully extended with workers in the basket?',
      options: [
        'The boom immediately falls to the ground',
        'The engine automatically restarts the pump',
        'Hydraulic check valves lock the cylinders in place and manual lowering valves allow controlled descent',
        'The outriggers automatically retract',
      ],
      correct: 2,
      explanation: 'Hydraulic boom lifts are equipped with pilot-operated check valves (holding valves) on all lift and telescope cylinders that lock the boom in position if pump pressure is lost. Manual lowering valves at ground level allow controlled descent for rescue.',
      difficulty: 'hard',
    },
    {
      question: 'What is the purpose of the counterweight mounted at the rear of the boom lift chassis?',
      options: [
        'To improve fuel efficiency',
        'To offset the tipping moment created by the boom and payload at full extension',
        'To provide additional storage space for tools',
        'To absorb engine vibrations',
      ],
      correct: 1,
      explanation: 'The counterweight provides a stabilizing moment that opposes the overturning moment created by the boom, platform, and payload weight at maximum reach. Its mass and position are carefully calculated to maintain stability at rated capacity.',
      difficulty: 'medium',
    },
    {
      question: 'Why does a boom lift require a slew ring bearing rather than a simple pivot pin for turntable rotation?',
      options: [
        'A slew ring is cheaper to manufacture',
        'A slew ring supports combined axial, radial, and moment loads while enabling continuous rotation',
        'A pivot pin cannot rotate more than 180 degrees',
        'A slew ring produces less noise during rotation',
      ],
      correct: 1,
      explanation: 'The turntable must support the full weight of the boom (axial), resist side forces from wind and motion (radial), and handle the massive overturning moment from the extended boom — all simultaneously during continuous 360° rotation. Only a large-diameter slew ring bearing can handle this complex load combination.',
      difficulty: 'hard',
    },
  ];

  // ═══════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════════════════
  const description = `Modern Articulating Boom Lift (JLG 860SJ Style)

A self-propelled articulating boom lift capable of reaching 86 feet (26m) working height with up-and-over capability. Features a turbocharged diesel engine driving a high-pressure hydraulic system that powers multi-section articulating boom with telescoping fly jib. The 4WD chassis provides rough-terrain mobility while four hydraulic outriggers ensure stable elevated operations. The work platform accommodates two operators with proportional dual-joystick controls and full safety interlocks. Ground-level controls provide emergency override and recovery capability.

Key Specifications:
• Working Height: 86 ft (26.2 m)
• Horizontal Reach: 56 ft (17.1 m)
• Platform Capacity: 500 lbs (227 kg)
• Boom Articulation: Up-and-over with knuckle joint
• Drive: 4WD with oscillating axle
• Power: Turbocharged diesel, ~74 hp
• Rotation: 360° continuous slew
• Weight: ~30,000 lbs (13,600 kg)`;

  // ═══════════════════════════════════════════════════════════════
  // ANIMATE
  // ═══════════════════════════════════════════════════════════════
  function animate(time, speed, refMeshes) {
    const t = time * speed;

    // Wheel rotation (simulating idle/slow crawl)
    ['wheelFL', 'wheelFR', 'wheelRL', 'wheelRR'].forEach(wn => {
      if (refMeshes[wn]) {
        refMeshes[wn].rotation.x = t * 0.3;
      }
    });

    // Cooling fan rotation
    if (refMeshes.coolingFan) {
      refMeshes.coolingFan.rotation.z = t * 8.0;
    }

    // Turntable slow rotation
    if (refMeshes.turntable) {
      refMeshes.turntable.rotation.y = Math.sin(t * 0.15) * 0.3;
    }

    // Boom gentle sway (breathing movement simulating hydraulic pressure oscillation)
    if (refMeshes.boomAssembly) {
      refMeshes.boomAssembly.rotation.x = Math.sin(t * 0.2) * 0.02;
    }

    // Boom section 2 articulation
    if (refMeshes.boom2) {
      refMeshes.boom2.rotation.x = Math.sin(t * 0.12) * 0.05 + 0.1;
    }

    // Jib subtle movement
    if (refMeshes.jib) {
      refMeshes.jib.rotation.x = Math.sin(t * 0.18 + 1.0) * 0.03;
    }

    // Telescoping section extension/retraction
    if (refMeshes.telescopingSection) {
      refMeshes.telescopingSection.position.z = 2.4 + Math.sin(t * 0.1) * 0.3;
    }

    // Basket platform rotator
    if (refMeshes.platformRotator) {
      refMeshes.platformRotator.rotation.y = Math.sin(t * 0.25) * 0.15;
    }

    // Beacon rotation
    if (refMeshes.beacon) {
      refMeshes.beacon.rotation.y = t * 3.0;
      refMeshes.beacon.material.emissiveIntensity = 0.5 + Math.sin(t * 6.0) * 0.5;
    }

    // Exhaust glow pulse
    if (refMeshes.exhaustGlow) {
      refMeshes.exhaustGlow.material.emissiveIntensity = 0.3 + Math.sin(t * 4.0) * 0.3;
      refMeshes.exhaustGlow.scale.setScalar(0.8 + Math.sin(t * 5.0) * 0.3);
    }

    // Plasma core rotation and pulse
    if (refMeshes.plasmaCore) {
      refMeshes.plasmaCore.rotation.x = t * 1.5;
      refMeshes.plasmaCore.rotation.y = t * 2.0;
      refMeshes.plasmaCore.material.emissiveIntensity = 0.6 + Math.sin(t * 3.0) * 0.4;
      refMeshes.plasmaCore.scale.setScalar(0.9 + Math.sin(t * 2.5) * 0.15);
    }

    // Energy rings orbit
    for (let i = 0; i < 3; i++) {
      const ring = refMeshes['energyRing' + i];
      if (ring) {
        ring.rotation.x = t * (0.8 + i * 0.4);
        ring.rotation.z = t * (0.5 + i * 0.3);
        ring.material.emissiveIntensity = 0.4 + Math.sin(t * 2.0 + i * 2.0) * 0.4;
      }
    }

    // Neon ring pulse
    if (refMeshes.neonRing) {
      refMeshes.neonRing.material.emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.3;
    }

    // Neon strip along boom shimmer
    if (refMeshes.neonStrip1) {
      refMeshes.neonStrip1.material.emissiveIntensity = 0.2 + Math.sin(t * 2.0 + 0.5) * 0.4;
    }

    // Work light flicker
    if (refMeshes.workLight) {
      refMeshes.workLight.material.emissiveIntensity = 0.6 + Math.sin(t * 8.0) * 0.2;
    }

    // E-Stop light pulsing
    if (refMeshes.eStop) {
      refMeshes.eStop.material.emissiveIntensity = 0.5 + Math.sin(t * 4.0) * 0.5;
    }

    // Ground control screen glow
    if (refMeshes.groundScreen) {
      refMeshes.groundScreen.material.emissiveIntensity = 0.4 + Math.sin(t * 1.0) * 0.2;
    }

    // Turbo spin
    if (refMeshes.turbo) {
      refMeshes.turbo.rotation.x = t * 12.0;
    }

    // Hydraulic pump vibration
    if (refMeshes.hydraulicPump) {
      refMeshes.hydraulicPump.position.y = 1.5 + Math.sin(t * 15.0) * 0.003;
    }

    // Engine block subtle vibration
    if (refMeshes.engineBlock) {
      refMeshes.engineBlock.position.y = 1.55 + Math.sin(t * 20.0) * 0.002;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
