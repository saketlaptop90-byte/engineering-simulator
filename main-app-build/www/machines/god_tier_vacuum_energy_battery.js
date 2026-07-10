// ============================================================================
// GOD TIER VACUUM ENERGY BATTERY — Ultra-Realistic THREE.js Model
// A device storing extracted zero-point vacuum energy in a usable form.
// Features: Casimir cavity arrays, metamaterial capacitors, virtual particle
// pair visualization, power output terminals, extreme animation.
// ============================================================================

import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ── Shared custom materials ──────────────────────────────────────────────
  const vacuumGlow = new THREE.MeshStandardMaterial({
    color: 0x4400ff, emissive: 0x6600ff, emissiveIntensity: 1.8,
    transparent: true, opacity: 0.55, metalness: 0.3, roughness: 0.2, side: THREE.DoubleSide
  });
  const casimirPlate = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e, metalness: 0.97, roughness: 0.05, emissive: 0x110022, emissiveIntensity: 0.3
  });
  const metamaterialGold = new THREE.MeshStandardMaterial({
    color: 0xffd700, metalness: 0.95, roughness: 0.1, emissive: 0x553300, emissiveIntensity: 0.4
  });
  const energyPlasma = new THREE.MeshStandardMaterial({
    color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 2.5,
    transparent: true, opacity: 0.7, metalness: 0.1, roughness: 0.0
  });
  const antiMatterGlow = new THREE.MeshStandardMaterial({
    color: 0xff0066, emissive: 0xff0044, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.6, metalness: 0.1, roughness: 0.0
  });
  const quantumField = new THREE.MeshStandardMaterial({
    color: 0x220044, emissive: 0x330066, emissiveIntensity: 0.8,
    transparent: true, opacity: 0.25, side: THREE.DoubleSide
  });
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x00eeff, emissive: 0x00ccff, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.85
  });
  const neonMagenta = new THREE.MeshStandardMaterial({
    color: 0xff00ff, emissive: 0xcc00cc, emissiveIntensity: 1.6,
    transparent: true, opacity: 0.8
  });
  const terminalRed = new THREE.MeshStandardMaterial({
    color: 0xff2200, emissive: 0xcc1100, emissiveIntensity: 1.2, metalness: 0.8, roughness: 0.15
  });
  const terminalBlue = new THREE.MeshStandardMaterial({
    color: 0x0044ff, emissive: 0x0033cc, emissiveIntensity: 1.2, metalness: 0.8, roughness: 0.15
  });
  const darkHousing = new THREE.MeshStandardMaterial({
    color: 0x0a0a12, metalness: 0.92, roughness: 0.08, emissive: 0x050510, emissiveIntensity: 0.15
  });
  const warningOrange = new THREE.MeshStandardMaterial({
    color: 0xff8800, emissive: 0xcc6600, emissiveIntensity: 1.0
  });
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x88aaff, transparent: true, opacity: 0.35, metalness: 0.2, roughness: 0.05,
    emissive: 0x4466cc, emissiveIntensity: 0.6, side: THREE.DoubleSide
  });
  const insulatorWhite = new THREE.MeshStandardMaterial({
    color: 0xe0e0e8, metalness: 0.05, roughness: 0.7
  });

  // ── Mesh tracking ────────────────────────────────────────────────────────
  const meshes = {
    casimirPlates: [], casimirGaps: [], energyCells: [], cellCores: [],
    virtualParticles: [], antiParticles: [], particlePairs: [],
    terminalPos: null, terminalNeg: null, terminalArcs: [],
    outerShell: null, innerChamber: null, coolantRings: [],
    conduits: [], controlPanel: null, screenGlow: null,
    warningLights: [], quantumFieldSphere: null,
    extractorCoils: [], resonatorRods: [], crystalLattice: [],
    powerBusBars: [], insulatorStacks: [], ventGrilles: [],
    dataLines: [], statusLEDs: [], hexPlates: []
  };

  // ========================================================================
  //  1. OUTER CONTAINMENT SHELL — Toroidal + cylindrical composite housing
  // ========================================================================
  const outerShellGroup = new THREE.Group();

  // Main cylindrical housing body (LatheGeometry for realism)
  const shellProfile = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const y = t * 6 - 3;
    let r;
    if (t < 0.05) r = 0.3 + t * 20 * 1.5;
    else if (t < 0.15) r = 1.8 + Math.sin((t - 0.05) * Math.PI / 0.1) * 0.15;
    else if (t < 0.85) r = 1.95 + Math.sin(t * Math.PI * 8) * 0.03;
    else if (t < 0.95) r = 1.8 + Math.sin((0.95 - t) * Math.PI / 0.1) * 0.15;
    else r = 0.3 + (1 - t) * 20 * 1.5;
    shellProfile.push(new THREE.Vector2(r, y));
  }
  const shellGeo = new THREE.LatheGeometry(shellProfile, 64);
  const outerShell = new THREE.Mesh(shellGeo, darkHousing);
  outerShellGroup.add(outerShell);
  meshes.outerShell = outerShell;

  // Reinforcement ribs around circumference
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const ribGeo = new THREE.BoxGeometry(0.08, 5.6, 0.15);
    const rib = new THREE.Mesh(ribGeo, steel);
    rib.position.set(Math.cos(angle) * 2.0, 0, Math.sin(angle) * 2.0);
    rib.rotation.y = -angle;
    outerShellGroup.add(rib);
  }

  // Circumferential bands
  for (let y = -2.5; y <= 2.5; y += 1.0) {
    const bandGeo = new THREE.TorusGeometry(2.02, 0.04, 8, 64);
    const band = new THREE.Mesh(bandGeo, chrome);
    band.position.y = y;
    band.rotation.x = Math.PI / 2;
    outerShellGroup.add(band);
  }

  // Hexagonal armour plates on surface
  for (let ring = 0; ring < 6; ring++) {
    const y = -2.0 + ring * 0.8;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + ring * 0.2;
      const hexShape = new THREE.Shape();
      const hexR = 0.18;
      for (let h = 0; h < 6; h++) {
        const ha = (h / 6) * Math.PI * 2;
        const hx = Math.cos(ha) * hexR;
        const hy = Math.sin(ha) * hexR;
        h === 0 ? hexShape.moveTo(hx, hy) : hexShape.lineTo(hx, hy);
      }
      hexShape.closePath();
      const hexGeo = new THREE.ExtrudeGeometry(hexShape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.01 });
      const hexMesh = new THREE.Mesh(hexGeo, aluminum);
      hexMesh.position.set(Math.cos(angle) * 2.05, y, Math.sin(angle) * 2.05);
      hexMesh.lookAt(0, y, 0);
      outerShellGroup.add(hexMesh);
      meshes.hexPlates.push(hexMesh);
    }
  }
  group.add(outerShellGroup);

  // ========================================================================
  //  2. INNER VACUUM CHAMBER — Transparent crystalline containment
  // ========================================================================
  const chamberProfile = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const y = t * 5 - 2.5;
    let r = 1.4 + Math.sin(t * Math.PI) * 0.15;
    if (t < 0.08 || t > 0.92) r *= (t < 0.08 ? t / 0.08 : (1 - t) / 0.08);
    chamberProfile.push(new THREE.Vector2(Math.max(r, 0.1), y));
  }
  const chamberGeo = new THREE.LatheGeometry(chamberProfile, 48);
  const innerChamber = new THREE.Mesh(chamberGeo, crystalMat);
  group.add(innerChamber);
  meshes.innerChamber = innerChamber;

  // Quantum field containment sphere (inner glow)
  const qfGeo = new THREE.IcosahedronGeometry(1.15, 3);
  const qfSphere = new THREE.Mesh(qfGeo, quantumField);
  group.add(qfSphere);
  meshes.quantumFieldSphere = qfSphere;

  // ========================================================================
  //  3. CASIMIR CAVITY ARRAYS — Parallel nano-plate assemblies
  // ========================================================================
  const casimirArrayGroup = new THREE.Group();
  const numCavities = 8;
  const cavityRadius = 0.85;

  for (let c = 0; c < numCavities; c++) {
    const angle = (c / numCavities) * Math.PI * 2;
    const cx = Math.cos(angle) * cavityRadius;
    const cz = Math.sin(angle) * cavityRadius;
    const cavityGroup = new THREE.Group();
    cavityGroup.position.set(cx, 0, cz);
    cavityGroup.rotation.y = -angle;

    // Each cavity has 12 parallel nano-plates
    const numPlates = 12;
    for (let p = 0; p < numPlates; p++) {
      const plateGeo = new THREE.BoxGeometry(0.25, 1.8, 0.008);
      const plate = new THREE.Mesh(plateGeo, casimirPlate);
      plate.position.z = (p - numPlates / 2) * 0.022;
      cavityGroup.add(plate);
      meshes.casimirPlates.push(plate);

      // Vacuum glow between plates
      if (p < numPlates - 1) {
        const gapGeo = new THREE.BoxGeometry(0.22, 1.7, 0.015);
        const gapGlow = new THREE.Mesh(gapGeo, vacuumGlow);
        gapGlow.position.z = (p - numPlates / 2) * 0.022 + 0.011;
        cavityGroup.add(gapGlow);
        meshes.casimirGaps.push(gapGlow);
      }
    }

    // Cavity frame
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.04, 0.35), darkSteel);
    frameTop.position.y = 0.95;
    cavityGroup.add(frameTop);
    const frameBot = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.04, 0.35), darkSteel);
    frameBot.position.y = -0.95;
    cavityGroup.add(frameBot);

    // Side clamps
    for (let s = -1; s <= 1; s += 2) {
      const clamp = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.9, 8), chrome);
      clamp.position.set(s * 0.14, 0, 0);
      cavityGroup.add(clamp);
    }

    casimirArrayGroup.add(cavityGroup);
  }
  group.add(casimirArrayGroup);

  // ========================================================================
  //  4. ENERGY STORAGE CELLS — Metamaterial capacitor banks
  // ========================================================================
  const storageCellGroup = new THREE.Group();
  const numCells = 6;

  for (let i = 0; i < numCells; i++) {
    const angle = (i / numCells) * Math.PI * 2 + Math.PI / numCells;
    const cellGroup = new THREE.Group();
    const cellX = Math.cos(angle) * 1.35;
    const cellZ = Math.sin(angle) * 1.35;
    cellGroup.position.set(cellX, 0, cellZ);

    // Cylindrical metamaterial capacitor housing
    const cellHousingGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 24);
    const cellHousing = new THREE.Mesh(cellHousingGeo, darkHousing);
    cellGroup.add(cellHousing);
    meshes.energyCells.push(cellHousing);

    // Inner glowing core
    const coreGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.0, 16);
    const coreMesh = new THREE.Mesh(coreGeo, energyPlasma);
    cellGroup.add(coreMesh);
    meshes.cellCores.push(coreMesh);

    // Winding coils around cell
    for (let w = 0; w < 18; w++) {
      const wy = -0.9 + w * 0.1;
      const coilGeo = new THREE.TorusGeometry(0.21, 0.012, 6, 24);
      const coil = new THREE.Mesh(coilGeo, metamaterialGold);
      coil.position.y = wy;
      coil.rotation.x = Math.PI / 2;
      cellGroup.add(coil);
    }

    // Top and bottom electrode caps
    for (let end = -1; end <= 1; end += 2) {
      const capGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.1, 16);
      const cap = new THREE.Mesh(capGeo, copper);
      cap.position.y = end * 1.15;
      cellGroup.add(cap);
      // Terminal post on cap
      const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8);
      const post = new THREE.Mesh(postGeo, chrome);
      post.position.y = end * 1.25;
      cellGroup.add(post);
    }

    // Metamaterial lattice rings (visible through transparent sections)
    for (let lr = 0; lr < 8; lr++) {
      const ly = -0.8 + lr * 0.23;
      const latticeGeo = new THREE.TorusGeometry(0.14, 0.005, 4, 32);
      const lattice = new THREE.Mesh(latticeGeo, neonCyan);
      lattice.position.y = ly;
      lattice.rotation.x = Math.PI / 2;
      cellGroup.add(lattice);
      meshes.crystalLattice.push(lattice);
    }

    storageCellGroup.add(cellGroup);
  }
  group.add(storageCellGroup);

  // ========================================================================
  //  5. VIRTUAL PARTICLE PAIR VISUALIZATION
  // ========================================================================
  const particleGroup = new THREE.Group();
  const numPairs = 60;

  for (let i = 0; i < numPairs; i++) {
    const pairGroup = new THREE.Group();
    // Random spawn within chamber volume
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = Math.random() * 0.9;
    const px = radius * Math.sin(phi) * Math.cos(theta);
    const py = (Math.random() - 0.5) * 3.5;
    const pz = radius * Math.sin(phi) * Math.sin(theta);
    pairGroup.position.set(px, py, pz);

    // Particle (matter)
    const particleGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.015, 8, 8);
    const particle = new THREE.Mesh(particleGeo, energyPlasma.clone());
    particle.position.x = -0.04;
    pairGroup.add(particle);
    meshes.virtualParticles.push(particle);

    // Antiparticle
    const antiGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.015, 8, 8);
    const antiParticle = new THREE.Mesh(antiGeo, antiMatterGlow.clone());
    antiParticle.position.x = 0.04;
    pairGroup.add(antiParticle);
    meshes.antiParticles.push(antiParticle);

    // Connection line between pair
    const lineGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.08, 4);
    const line = new THREE.Mesh(lineGeo, neonMagenta);
    line.rotation.z = Math.PI / 2;
    pairGroup.add(line);

    particleGroup.add(pairGroup);
    meshes.particlePairs.push({
      group: pairGroup, particle, antiParticle,
      basePos: { x: px, y: py, z: pz },
      phase: Math.random() * Math.PI * 2,
      lifetime: 0.5 + Math.random() * 2.0,
      speed: 0.5 + Math.random() * 1.5
    });
  }
  group.add(particleGroup);

  // ========================================================================
  //  6. EXTRACTOR COILS — Superconducting extraction solenoids
  // ========================================================================
  const extractorGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 8;
    const coilGroup = new THREE.Group();
    coilGroup.position.set(Math.cos(angle) * 0.55, 0, Math.sin(angle) * 0.55);
    coilGroup.rotation.y = -angle;

    // Solenoid body
    const solGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.0, 16);
    const sol = new THREE.Mesh(solGeo, darkSteel);
    coilGroup.add(sol);

    // Helical winding (approximated with torus segments)
    for (let w = 0; w < 28; w++) {
      const wy = -1.35 + w * 0.1;
      const wGeo = new THREE.TorusGeometry(0.11, 0.008, 6, 20);
      const wMesh = new THREE.Mesh(wGeo, copper);
      wMesh.position.y = wy;
      wMesh.rotation.x = Math.PI / 2;
      wMesh.rotation.z = w * 0.15;
      coilGroup.add(wMesh);
    }

    // End caps with ceramic insulators
    for (let e = -1; e <= 1; e += 2) {
      const capGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.08, 12);
      const cap = new THREE.Mesh(capGeo, insulatorWhite);
      cap.position.y = e * 1.55;
      coilGroup.add(cap);
    }

    extractorGroup.add(coilGroup);
    meshes.extractorCoils.push(coilGroup);
  }
  group.add(extractorGroup);

  // ========================================================================
  //  7. RESONATOR RODS — Tunable cavity resonance frequency control
  // ========================================================================
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const rodGroup = new THREE.Group();
    const rx = Math.cos(angle) * 0.35;
    const rz = Math.sin(angle) * 0.35;

    const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, 4.5, 8);
    const rod = new THREE.Mesh(rodGeo, chrome);
    rod.position.set(rx, 0, rz);
    rodGroup.add(rod);

    // Tuning nodes
    for (let n = 0; n < 6; n++) {
      const ny = -2.0 + n * 0.8;
      const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const node = new THREE.Mesh(nodeGeo, neonCyan);
      node.position.set(rx, ny, rz);
      rodGroup.add(node);
    }

    group.add(rodGroup);
    meshes.resonatorRods.push(rodGroup);
  }

  // ========================================================================
  //  8. POWER OUTPUT TERMINALS — High-voltage positive and negative
  // ========================================================================
  const terminalGroup = new THREE.Group();

  // Positive terminal assembly (top)
  const posTermGroup = new THREE.Group();
  posTermGroup.position.y = 3.3;

  const posPillarGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16);
  posTermGroup.add(new THREE.Mesh(posPillarGeo, terminalRed));
  const posBulbGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const posBulb = new THREE.Mesh(posBulbGeo, terminalRed);
  posBulb.position.y = 0.5;
  posTermGroup.add(posBulb);
  meshes.terminalPos = posBulb;

  // Insulator stack under positive terminal
  for (let ins = 0; ins < 5; ins++) {
    const insGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 16);
    const insMesh = new THREE.Mesh(insGeo, ins % 2 === 0 ? insulatorWhite : rubber);
    insMesh.position.y = -0.45 + ins * 0.07;
    posTermGroup.add(insMesh);
    meshes.insulatorStacks.push(insMesh);
  }

  // Arc contact ring
  const arcRingGeo = new THREE.TorusGeometry(0.18, 0.02, 8, 24);
  const arcRing = new THREE.Mesh(arcRingGeo, neonCyan);
  arcRing.position.y = 0.35;
  arcRing.rotation.x = Math.PI / 2;
  posTermGroup.add(arcRing);
  meshes.terminalArcs.push(arcRing);

  terminalGroup.add(posTermGroup);

  // Negative terminal assembly (bottom)
  const negTermGroup = new THREE.Group();
  negTermGroup.position.y = -3.3;

  const negPillarGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.8, 16);
  negTermGroup.add(new THREE.Mesh(negPillarGeo, terminalBlue));
  const negBulbGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const negBulb = new THREE.Mesh(negBulbGeo, terminalBlue);
  negBulb.position.y = -0.5;
  negTermGroup.add(negBulb);
  meshes.terminalNeg = negBulb;

  for (let ins = 0; ins < 5; ins++) {
    const insGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 16);
    const insMesh = new THREE.Mesh(insGeo, ins % 2 === 0 ? insulatorWhite : rubber);
    insMesh.position.y = 0.45 - ins * 0.07;
    negTermGroup.add(insMesh);
    meshes.insulatorStacks.push(insMesh);
  }

  const arcRingNeg = new THREE.Mesh(arcRingGeo.clone(), neonMagenta);
  arcRingNeg.position.y = -0.35;
  arcRingNeg.rotation.x = Math.PI / 2;
  negTermGroup.add(arcRingNeg);
  meshes.terminalArcs.push(arcRingNeg);

  terminalGroup.add(negTermGroup);
  group.add(terminalGroup);

  // ========================================================================
  //  9. POWER BUS BARS — Heavy copper distribution rails
  // ========================================================================
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const barGeo = new THREE.BoxGeometry(0.06, 5.8, 0.03);
    const bar = new THREE.Mesh(barGeo, copper);
    bar.position.set(Math.cos(angle) * 1.7, 0, Math.sin(angle) * 1.7);
    bar.rotation.y = -angle;
    group.add(bar);
    meshes.powerBusBars.push(bar);

    // Connection lugs at top and bottom
    for (let e = -1; e <= 1; e += 2) {
      const lugGeo = new THREE.BoxGeometry(0.10, 0.04, 0.06);
      const lug = new THREE.Mesh(lugGeo, copper);
      lug.position.set(Math.cos(angle) * 1.7, e * 2.85, Math.sin(angle) * 1.7);
      group.add(lug);
    }
  }

  // ========================================================================
  //  10. COOLANT RINGS — Cryogenic coolant circulation toroids
  // ========================================================================
  for (let i = 0; i < 5; i++) {
    const y = -2.0 + i * 1.0;
    const coolGeo = new THREE.TorusGeometry(1.6, 0.06, 12, 48);
    const coolRing = new THREE.Mesh(coolGeo, neonCyan);
    coolRing.position.y = y;
    coolRing.rotation.x = Math.PI / 2;
    group.add(coolRing);
    meshes.coolantRings.push(coolRing);
  }

  // ========================================================================
  //  11. ENERGY CONDUITS — TubeGeometry transfer lines
  // ========================================================================
  for (let i = 0; i < numCells; i++) {
    const angle = (i / numCells) * Math.PI * 2 + Math.PI / numCells;
    const startX = Math.cos(angle) * 0.9;
    const startZ = Math.sin(angle) * 0.9;
    const endX = Math.cos(angle) * 1.35;
    const endZ = Math.sin(angle) * 1.35;

    const points = [
      new THREE.Vector3(startX, 0.3, startZ),
      new THREE.Vector3((startX + endX) / 2, 0.6, (startZ + endZ) / 2),
      new THREE.Vector3(endX, 0.3, endZ)
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.025, 8, false);
    const tube = new THREE.Mesh(tubeGeo, energyPlasma);
    group.add(tube);
    meshes.conduits.push(tube);

    // Lower conduit
    const pointsLow = [
      new THREE.Vector3(startX, -0.3, startZ),
      new THREE.Vector3((startX + endX) / 2, -0.6, (startZ + endZ) / 2),
      new THREE.Vector3(endX, -0.3, endZ)
    ];
    const curveLow = new THREE.CatmullRomCurve3(pointsLow);
    const tubeLowGeo = new THREE.TubeGeometry(curveLow, 20, 0.025, 8, false);
    const tubeLow = new THREE.Mesh(tubeLowGeo, energyPlasma);
    group.add(tubeLow);
    meshes.conduits.push(tubeLow);
  }

  // ========================================================================
  //  12. CONTROL PANEL — Operator interface with glowing screens
  // ========================================================================
  const panelGroup = new THREE.Group();
  panelGroup.position.set(2.15, 0.5, 0);

  // Panel body
  const panelGeo = new THREE.BoxGeometry(0.08, 1.2, 0.8);
  const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
  panelGroup.add(panelMesh);
  meshes.controlPanel = panelMesh;

  // Main display screen
  const screenGeo = new THREE.PlaneGeometry(0.7, 0.5);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x002244, emissive: 0x004488, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.9
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0.045, 0.2, 0);
  screen.rotation.y = Math.PI / 2;
  panelGroup.add(screen);
  meshes.screenGlow = screen;

  // Screen bezel
  const bezelShape = new THREE.Shape();
  bezelShape.moveTo(-0.38, -0.28);
  bezelShape.lineTo(0.38, -0.28);
  bezelShape.lineTo(0.38, 0.28);
  bezelShape.lineTo(-0.38, 0.28);
  bezelShape.closePath();
  const innerHole = new THREE.Shape();
  innerHole.moveTo(-0.35, -0.25);
  innerHole.lineTo(0.35, -0.25);
  innerHole.lineTo(0.35, 0.25);
  innerHole.lineTo(-0.35, 0.25);
  innerHole.closePath();
  bezelShape.holes.push(innerHole);
  const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, { depth: 0.02, bevelEnabled: false });
  const bezel = new THREE.Mesh(bezelGeo, plastic);
  bezel.position.set(0.05, 0.2, 0);
  bezel.rotation.y = Math.PI / 2;
  panelGroup.add(bezel);

  // Buttons row
  for (let b = 0; b < 6; b++) {
    const btnGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12);
    const btnMat = b < 3 ? neonCyan : (b < 5 ? warningOrange : terminalRed);
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(0.05, -0.2, -0.3 + b * 0.12);
    btn.rotation.z = Math.PI / 2;
    panelGroup.add(btn);
    meshes.statusLEDs.push(btn);
  }

  // Rotary dial
  const dialGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 24);
  const dial = new THREE.Mesh(dialGeo, chrome);
  dial.position.set(0.05, -0.35, 0.2);
  dial.rotation.z = Math.PI / 2;
  panelGroup.add(dial);
  const dialMarkGeo = new THREE.BoxGeometry(0.005, 0.035, 0.05);
  const dialMark = new THREE.Mesh(dialMarkGeo, terminalRed);
  dialMark.position.set(0.05, -0.35, 0.2);
  panelGroup.add(dialMark);

  // Joystick
  const joyBaseGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.03, 12);
  const joyBase = new THREE.Mesh(joyBaseGeo, darkSteel);
  joyBase.position.set(0.05, -0.35, -0.2);
  joyBase.rotation.z = Math.PI / 2;
  panelGroup.add(joyBase);
  const joyStickGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8);
  const joyStick = new THREE.Mesh(joyStickGeo, rubber);
  joyStick.position.set(0.05, -0.30, -0.2);
  panelGroup.add(joyStick);
  const joyBallGeo = new THREE.SphereGeometry(0.02, 8, 8);
  const joyBall = new THREE.Mesh(joyBallGeo, terminalRed);
  joyBall.position.set(0.05, -0.24, -0.2);
  panelGroup.add(joyBall);

  group.add(panelGroup);

  // ========================================================================
  //  13. VENT GRILLES — Thermal exhaust ports
  // ========================================================================
  for (let v = 0; v < 4; v++) {
    const vAngle = (v / 4) * Math.PI * 2 + Math.PI / 4;
    const ventGroup = new THREE.Group();
    ventGroup.position.set(Math.cos(vAngle) * 2.05, 1.8, Math.sin(vAngle) * 2.05);
    ventGroup.rotation.y = -vAngle;

    // Grille frame
    const frameGeo = new THREE.BoxGeometry(0.04, 0.5, 0.35);
    ventGroup.add(new THREE.Mesh(frameGeo, darkSteel));

    // Slats
    for (let s = 0; s < 8; s++) {
      const slatGeo = new THREE.BoxGeometry(0.02, 0.015, 0.3);
      const slat = new THREE.Mesh(slatGeo, aluminum);
      slat.position.y = -0.2 + s * 0.055;
      slat.rotation.x = 0.3;
      ventGroup.add(slat);
    }

    // Glow behind grille
    const backGlowGeo = new THREE.PlaneGeometry(0.3, 0.4);
    const backGlow = new THREE.Mesh(backGlowGeo, vacuumGlow);
    backGlow.position.x = -0.03;
    backGlow.rotation.y = Math.PI / 2;
    ventGroup.add(backGlow);

    group.add(ventGroup);
    meshes.ventGrilles.push(ventGroup);
  }

  // ========================================================================
  //  14. WARNING LIGHTS — Rotating hazard beacons
  // ========================================================================
  for (let wl = 0; wl < 4; wl++) {
    const wAngle = (wl / 4) * Math.PI * 2;
    const lightGroup = new THREE.Group();
    lightGroup.position.set(Math.cos(wAngle) * 2.08, -1.5, Math.sin(wAngle) * 2.08);

    const lightBaseGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.06, 12);
    lightGroup.add(new THREE.Mesh(lightBaseGeo, darkSteel));

    const lightDomeGeo = new THREE.SphereGeometry(0.06, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const lightDome = new THREE.Mesh(lightDomeGeo, warningOrange);
    lightDome.position.y = 0.03;
    lightGroup.add(lightDome);

    group.add(lightGroup);
    meshes.warningLights.push(lightDome);
  }

  // ========================================================================
  //  15. DATA LINES — Fiber optic diagnostic conduits
  // ========================================================================
  for (let d = 0; d < 8; d++) {
    const dAngle = (d / 8) * Math.PI * 2;
    const dPoints = [
      new THREE.Vector3(Math.cos(dAngle) * 1.7, -2.5, Math.sin(dAngle) * 1.7),
      new THREE.Vector3(Math.cos(dAngle) * 1.9, -1.0, Math.sin(dAngle) * 1.9),
      new THREE.Vector3(Math.cos(dAngle) * 2.0, 0.5, Math.sin(dAngle) * 2.0),
      new THREE.Vector3(Math.cos(dAngle) * 1.85, 2.0, Math.sin(dAngle) * 1.85)
    ];
    const dCurve = new THREE.CatmullRomCurve3(dPoints);
    const dTubeGeo = new THREE.TubeGeometry(dCurve, 32, 0.012, 6, false);
    const dTube = new THREE.Mesh(dTubeGeo, neonCyan);
    group.add(dTube);
    meshes.dataLines.push(dTube);
  }

  // ========================================================================
  //  16. BASE MOUNTING PLATFORM — Heavy industrial foundation
  // ========================================================================
  const baseGroup = new THREE.Group();
  baseGroup.position.y = -3.6;

  // Main plate
  const basePlateGeo = new THREE.CylinderGeometry(2.5, 2.7, 0.25, 32);
  baseGroup.add(new THREE.Mesh(basePlateGeo, steel));

  // Mounting bolts
  for (let mb = 0; mb < 12; mb++) {
    const mbAngle = (mb / 12) * Math.PI * 2;
    const boltGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const bolt = new THREE.Mesh(boltGeo, chrome);
    bolt.position.set(Math.cos(mbAngle) * 2.3, 0.15, Math.sin(mbAngle) * 2.3);
    baseGroup.add(bolt);
    const headGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 6);
    const head = new THREE.Mesh(headGeo, chrome);
    head.position.set(Math.cos(mbAngle) * 2.3, 0.32, Math.sin(mbAngle) * 2.3);
    baseGroup.add(head);
  }

  // Vibration isolator pads
  for (let vi = 0; vi < 6; vi++) {
    const viAngle = (vi / 6) * Math.PI * 2;
    const padGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.15, 12);
    const pad = new THREE.Mesh(padGeo, rubber);
    pad.position.set(Math.cos(viAngle) * 1.8, -0.2, Math.sin(viAngle) * 1.8);
    baseGroup.add(pad);
  }

  group.add(baseGroup);

  // ========================================================================
  //  17. TOP CAP — Radiation shielding dome
  // ========================================================================
  const topCapGroup = new THREE.Group();
  topCapGroup.position.y = 3.6;

  const domeProfile = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const r = 2.0 * Math.cos(t * Math.PI / 2);
    const y = 0.8 * Math.sin(t * Math.PI / 2);
    domeProfile.push(new THREE.Vector2(Math.max(r, 0.05), y));
  }
  const domeGeo = new THREE.LatheGeometry(domeProfile, 48);
  const domeMesh = new THREE.Mesh(domeGeo, darkHousing);
  topCapGroup.add(domeMesh);

  // Apex sensor array
  const apexGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const apex = new THREE.Mesh(apexGeo, neonCyan);
  apex.position.y = 0.85;
  topCapGroup.add(apex);

  // Apex antenna
  const antennaGeo = new THREE.CylinderGeometry(0.015, 0.008, 0.6, 6);
  const antenna = new THREE.Mesh(antennaGeo, chrome);
  antenna.position.y = 1.2;
  topCapGroup.add(antenna);

  group.add(topCapGroup);

  // ========================================================================
  //  18. INTERNAL SUPPORT LATTICE — Structural cross-bracing
  // ========================================================================
  for (let lat = 0; lat < 6; lat++) {
    const lAngle = (lat / 6) * Math.PI * 2;
    const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 3.8, 6);
    const strut = new THREE.Mesh(strutGeo, aluminum);
    strut.position.set(Math.cos(lAngle) * 1.1, 0, Math.sin(lAngle) * 1.1);
    strut.rotation.x = 0.15 * (lat % 2 === 0 ? 1 : -1);
    strut.rotation.z = 0.1 * (lat % 3 === 0 ? 1 : -1);
    group.add(strut);
  }

  // Cross rings
  for (let cr = -2; cr <= 2; cr++) {
    const crGeo = new THREE.TorusGeometry(1.1, 0.015, 6, 36);
    const crMesh = new THREE.Mesh(crGeo, aluminum);
    crMesh.position.y = cr;
    crMesh.rotation.x = Math.PI / 2;
    group.add(crMesh);
  }

  // ========================================================================
  //  PARTS MANIFEST (18 detailed parts)
  // ========================================================================
  const parts = [
    {
      name: 'Outer Containment Shell',
      description: 'Multi-layer radiation-hardened toroidal housing providing electromagnetic shielding and structural containment for internal vacuum chamber at 10⁻¹² Torr.',
      material: 'Tungsten-carbide composite with boron-carbide neutron absorber lining',
      function: 'Provides mechanical containment, EM shielding, and radiological protection for the zero-point energy extraction process',
      assemblyOrder: 1,
      connections: ['Inner Vacuum Chamber', 'Coolant Rings', 'Base Mounting Platform'],
      failureEffect: 'Catastrophic vacuum breach; uncontrolled vacuum fluctuation release',
      cascadeFailures: ['Inner Vacuum Chamber', 'Casimir Cavity Arrays', 'Virtual Particle Containment'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 0, z: 4 }
    },
    {
      name: 'Casimir Cavity Arrays',
      description: 'Eight radially-arranged nano-gap parallel plate assemblies with 12 plates each at sub-micron separations for extracting measurable Casimir force from quantum vacuum fluctuations.',
      material: 'Single-crystal silicon plates with gold-coated surfaces, 10nm precision gap spacers',
      function: 'Extract energy from quantum vacuum fluctuations via the Casimir effect; plates experience attractive force from excluded vacuum modes',
      assemblyOrder: 3,
      connections: ['Inner Vacuum Chamber', 'Extractor Coils', 'Energy Conduits'],
      failureEffect: 'Plate collapse destroys nano-gaps; extraction efficiency drops to zero',
      cascadeFailures: ['Energy Storage Cells', 'Power Output Terminals'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 3, y: 0, z: 0 }
    },
    {
      name: 'Energy Storage Cells',
      description: 'Six metamaterial dielectric capacitor banks using engineered left-handed metamaterial layers for ultra-high energy density storage exceeding conventional capacitors by 10⁴×.',
      material: 'Split-ring resonator metamaterial dielectric with barium titanate nanocomposite',
      function: 'Store extracted zero-point energy in electromagnetic field configurations within metamaterial cavities',
      assemblyOrder: 5,
      connections: ['Energy Conduits', 'Power Bus Bars', 'Power Output Terminals'],
      failureEffect: 'Uncontrolled energy discharge; potential runaway dielectric breakdown',
      cascadeFailures: ['Power Output Terminals', 'Power Bus Bars'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 3, z: 3 }
    },
    {
      name: 'Virtual Particle Pair Visualization Chamber',
      description: 'Central quantum observation volume where virtual particle-antiparticle pairs spontaneously form and annihilate according to the Heisenberg energy-time uncertainty principle ΔEΔt ≥ ℏ/2.',
      material: 'Ultra-high vacuum with residual gas pressure < 10⁻¹⁴ Torr',
      function: 'Provides observable volume for vacuum fluctuation dynamics; virtual pairs serve as the energy source harvested by Casimir cavities',
      assemblyOrder: 2,
      connections: ['Casimir Cavity Arrays', 'Quantum Field Containment Sphere', 'Resonator Rods'],
      failureEffect: 'Loss of vacuum integrity; thermal noise overwhelms quantum signal',
      cascadeFailures: ['Casimir Cavity Arrays', 'Resonator Rods'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 5, z: 0 }
    },
    {
      name: 'Extractor Coils',
      description: 'Four high-temperature superconducting solenoids (YBCO) generating precision magnetic fields to channel Casimir-extracted energy into storage conduits.',
      material: 'Yttrium barium copper oxide (YBCO) on nickel-tungsten substrate, cooled to 77K',
      function: 'Generate oscillating magnetic fields synchronized with Casimir plate resonance to efficiently transfer extracted vacuum energy',
      assemblyOrder: 4,
      connections: ['Casimir Cavity Arrays', 'Energy Conduits', 'Coolant Rings'],
      failureEffect: 'Quench event; superconductor goes normal, massive Joule heating',
      cascadeFailures: ['Coolant Rings', 'Casimir Cavity Arrays'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -3, y: 2, z: 0 }
    },
    {
      name: 'Resonator Rods',
      description: 'Eight precision-tuned piezoelectric rods providing frequency control for Casimir cavity resonance, tunable from 1 GHz to 100 THz.',
      material: 'Lead zirconate titanate (PZT) with platinum electrodes',
      function: 'Fine-tune the resonant frequency of Casimir cavities to maximize energy extraction from specific vacuum mode frequencies',
      assemblyOrder: 6,
      connections: ['Casimir Cavity Arrays', 'Control Panel', 'Inner Vacuum Chamber'],
      failureEffect: 'Loss of frequency lock; extraction efficiency drops by 99.7%',
      cascadeFailures: ['Casimir Cavity Arrays'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 2, y: 0, z: 2 }
    },
    {
      name: 'Inner Vacuum Chamber',
      description: 'Crystalline sapphire containment vessel maintaining ultra-high vacuum for zero-point field observation and Casimir effect operation.',
      material: 'Synthetic sapphire (Al₂O₃) with anti-reflective coating, 99.999% optical transparency',
      function: 'Maintains the ultra-high vacuum environment essential for isolating quantum vacuum fluctuations from thermal noise',
      assemblyOrder: 2,
      connections: ['Outer Containment Shell', 'Casimir Cavity Arrays', 'Quantum Field Sphere'],
      failureEffect: 'Vacuum breach; atmospheric molecules destroy Casimir effect measurement',
      cascadeFailures: ['Casimir Cavity Arrays', 'Virtual Particle Chamber'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 0, z: -3 }
    },
    {
      name: 'Quantum Field Containment Sphere',
      description: 'Icosahedral geodesic containment field generator constraining vacuum fluctuations to the observation volume using Dirichlet boundary conditions.',
      material: 'Metamaterial electromagnetic boundary layer with negative refractive index',
      function: 'Enforces electromagnetic boundary conditions that concentrate vacuum energy density within the extraction volume',
      assemblyOrder: 3,
      connections: ['Inner Vacuum Chamber', 'Resonator Rods', 'Extractor Coils'],
      failureEffect: 'Boundary condition collapse; vacuum energy density returns to ambient cosmic level',
      cascadeFailures: ['Casimir Cavity Arrays', 'Energy Storage Cells'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -2, y: 3, z: -2 }
    },
    {
      name: 'Power Output Terminal (Positive)',
      description: 'High-voltage positive power output terminal rated for 10 MW continuous output with tungsten-copper alloy contacts and ceramic insulator stack.',
      material: 'Tungsten-copper alloy (80W/20Cu) contacts, alumina ceramic insulators',
      function: 'Provides regulated positive terminal for external power delivery from stored vacuum energy',
      assemblyOrder: 8,
      connections: ['Power Bus Bars', 'Energy Storage Cells', 'Control Panel'],
      failureEffect: 'Arc flash; uncontrolled discharge through ionized atmospheric path',
      cascadeFailures: ['Control Panel', 'Power Bus Bars'],
      originalPosition: { x: 0, y: 3.3, z: 0 }, explodedPosition: { x: 0, y: 7, z: 0 }
    },
    {
      name: 'Power Output Terminal (Negative)',
      description: 'High-voltage negative return terminal with identical construction to positive terminal, forming complete circuit for power delivery.',
      material: 'Tungsten-copper alloy contacts, alumina ceramic insulators',
      function: 'Provides regulated negative terminal completing the power circuit',
      assemblyOrder: 8,
      connections: ['Power Bus Bars', 'Energy Storage Cells'],
      failureEffect: 'Ground fault; energy discharge through containment structure',
      cascadeFailures: ['Base Mounting Platform', 'Outer Containment Shell'],
      originalPosition: { x: 0, y: -3.3, z: 0 }, explodedPosition: { x: 0, y: -7, z: 0 }
    },
    {
      name: 'Coolant Rings',
      description: 'Five cryogenic liquid helium circulation toroids maintaining superconducting coil temperature at 4.2K and Casimir plate thermal stability.',
      material: 'Stainless steel 316L cryostat with multi-layer insulation (MLI)',
      function: 'Remove heat from superconducting components and maintain cryogenic temperatures essential for low-noise quantum measurements',
      assemblyOrder: 7,
      connections: ['Extractor Coils', 'Outer Containment Shell', 'Control Panel'],
      failureEffect: 'Cryogenic system failure; superconductor quench cascade',
      cascadeFailures: ['Extractor Coils', 'Casimir Cavity Arrays'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 4, y: 0, z: 0 }
    },
    {
      name: 'Energy Conduits',
      description: 'Twelve superconducting waveguide transfer lines carrying extracted vacuum energy from Casimir arrays to storage cells with zero resistive loss.',
      material: 'Niobium-tin (Nb₃Sn) superconducting waveguide, vacuum-jacketed',
      function: 'Lossless energy transfer from extraction points to storage cells',
      assemblyOrder: 6,
      connections: ['Casimir Cavity Arrays', 'Energy Storage Cells', 'Extractor Coils'],
      failureEffect: 'Waveguide quench; energy reflected back to Casimir arrays causing plate damage',
      cascadeFailures: ['Casimir Cavity Arrays', 'Energy Storage Cells'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: 2, z: 4 }
    },
    {
      name: 'Control Panel',
      description: 'Integrated SCADA interface with real-time vacuum energy density monitoring, Casimir force measurement display, storage cell charge levels, and emergency shutdown controls.',
      material: 'Hardened LCD display, mil-spec tactile controls, fiber optic data bus',
      function: 'Provides operator interface for monitoring and controlling all battery subsystems',
      assemblyOrder: 9,
      connections: ['All subsystems via fiber optic data bus'],
      failureEffect: 'Loss of monitoring; battery continues operating without feedback — risk of undetected failure',
      cascadeFailures: ['All subsystems (indirect)'],
      originalPosition: { x: 2.15, y: 0.5, z: 0 }, explodedPosition: { x: 5, y: 0.5, z: 0 }
    },
    {
      name: 'Power Bus Bars',
      description: 'Six heavy-gauge oxygen-free copper distribution rails rated at 50 kA continuous current, connecting storage cells to output terminals.',
      material: 'Oxygen-free high-conductivity copper (OFHC Cu, 99.99%)',
      function: 'Distribute stored energy from capacitor banks to output terminals with minimal resistance',
      assemblyOrder: 7,
      connections: ['Energy Storage Cells', 'Power Output Terminals'],
      failureEffect: 'Ohmic heating; potential copper melting and circuit interruption',
      cascadeFailures: ['Power Output Terminals'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -4, y: 0, z: 0 }
    },
    {
      name: 'Data Lines',
      description: 'Eight single-mode fiber optic diagnostic conduits carrying real-time sensor data from embedded strain gauges, thermocouples, and vacuum pressure transducers.',
      material: 'Single-mode silica fiber with polyimide jacket, radiation-hardened',
      function: 'Transmit diagnostic telemetry from all subsystems to control panel at 100 Gbps',
      assemblyOrder: 9,
      connections: ['Control Panel', 'All sensor nodes'],
      failureEffect: 'Loss of diagnostic data; blind operation increases failure risk',
      cascadeFailures: ['Control Panel'],
      originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 3, y: -2, z: 3 }
    },
    {
      name: 'Base Mounting Platform',
      description: 'Vibration-isolated heavy steel foundation with active damping pads reducing seismic noise below 10⁻¹² g for precision quantum measurements.',
      material: 'Structural steel A36 with elastomeric vibration isolators',
      function: 'Provides stable, vibration-free mounting surface critical for nanometer-scale Casimir plate alignment',
      assemblyOrder: 1,
      connections: ['Outer Containment Shell', 'Power Output Terminal (Negative)'],
      failureEffect: 'Mechanical vibration transmits to Casimir plates; gap instability destroys extraction efficiency',
      cascadeFailures: ['Casimir Cavity Arrays', 'Resonator Rods'],
      originalPosition: { x: 0, y: -3.6, z: 0 }, explodedPosition: { x: 0, y: -8, z: 0 }
    },
    {
      name: 'Radiation Shielding Dome',
      description: 'Top hemispherical cap with graded-Z shielding (lead-tin-copper layers) protecting personnel and electronics from any Bremsstrahlung radiation produced during high-energy vacuum fluctuation events.',
      material: 'Graded-Z composite: Pb/Sn/Cu layered shielding',
      function: 'Attenuate any ionizing radiation produced during anomalous vacuum energy extraction events',
      assemblyOrder: 10,
      connections: ['Outer Containment Shell', 'Apex Sensor Array'],
      failureEffect: 'Personnel radiation exposure; regulatory shutdown required',
      cascadeFailures: ['Control Panel (alarm state)'],
      originalPosition: { x: 0, y: 3.6, z: 0 }, explodedPosition: { x: 0, y: 8, z: 0 }
    },
    {
      name: 'Vent Grilles (Thermal Exhaust)',
      description: 'Four radially-placed louvered exhaust ports for removing waste heat from non-superconducting subsystems while maintaining containment integrity.',
      material: 'Inconel 718 high-temperature alloy louvers with HEPA filtration',
      function: 'Exhaust waste heat while preventing contamination ingress to vacuum system',
      assemblyOrder: 10,
      connections: ['Outer Containment Shell', 'Coolant Rings'],
      failureEffect: 'Thermal buildup; electronics overheat; automatic power derating',
      cascadeFailures: ['Control Panel', 'Energy Storage Cells (thermal runaway)'],
      originalPosition: { x: 0, y: 1.8, z: 0 }, explodedPosition: { x: 5, y: 1.8, z: 0 }
    }
  ];

  // ========================================================================
  //  QUIZ QUESTIONS — PhD-level Quantum Field Theory
  // ========================================================================
  const quizQuestions = [
    {
      question: 'The Casimir effect arises because conducting plates impose boundary conditions that exclude certain electromagnetic vacuum modes between them. If the plate separation is reduced by half, by what factor does the Casimir pressure (force per unit area) increase?',
      options: [
        'It doubles (factor of 2)',
        'It increases by a factor of 4',
        'It increases by a factor of 8',
        'It increases by a factor of 16'
      ],
      correct: 3,
      explanation: 'The Casimir pressure between parallel conducting plates is given by P = −π²ℏc / (240a⁴), where a is the plate separation. Since the pressure scales as a⁻⁴, halving the separation increases the pressure by 2⁴ = 16. This extremely steep dependence on gap width is why nano-scale fabrication precision is critical for Casimir-based energy extraction.'
    },
    {
      question: 'The naive calculation of vacuum energy density by summing zero-point energies (½ℏω) of all quantum field modes up to the Planck scale gives a value approximately how many orders of magnitude larger than the observed cosmological constant (dark energy density)?',
      options: [
        'About 10 orders of magnitude larger',
        'About 60 orders of magnitude larger',
        'About 120 orders of magnitude larger',
        'About 200 orders of magnitude larger'
      ],
      correct: 2,
      explanation: 'This is the infamous cosmological constant problem — the worst prediction in physics. The quantum field theory estimate of vacuum energy density is ρ_QFT ≈ 10¹¹³ J/m³ (using Planck cutoff), while the observed dark energy density is ρ_Λ ≈ 10⁻⁹ J/m³. The discrepancy is approximately 10¹²⁰, representing 120 orders of magnitude. No satisfactory resolution exists; it remains one of the deepest unsolved problems in theoretical physics.'
    },
    {
      question: 'In quantum electrodynamics, the Casimir effect can be interpreted as arising from which of the following physical mechanisms?',
      options: [
        'Radiation pressure from virtual photon exchange between the plates',
        'Van der Waals forces between surface atoms amplified by quantum coherence',
        'Difference in vacuum radiation pressure between the exterior (all modes) and interior (restricted modes) of the cavity',
        'All of the above are valid, equivalent interpretations within QED'
      ],
      correct: 3,
      explanation: 'All three descriptions are mathematically equivalent formulations within QED. The zero-point energy approach calculates the mode-sum difference; the radiation pressure approach considers the imbalance of virtual photon momenta; and the van der Waals approach treats it as a retarded dispersion force (Lifshitz theory). Jaffe (2005) showed the Casimir effect can be derived without reference to zero-point energy at all, using source theory. This interpretational flexibility is a deep feature of quantum field theory.'
    },
    {
      question: 'A proposed "vacuum energy battery" faces a fundamental thermodynamic constraint. Which statement best captures why extracting usable net energy from the quantum vacuum is problematic?',
      options: [
        'The vacuum is the lowest energy state of the quantum field; you cannot extract energy from a system already in its ground state without doing work to change the boundary conditions',
        'Virtual particles exist for too short a time (Δt ~ ℏ/ΔE) to be captured',
        'The Casimir force is too weak to generate macroscopic power',
        'Quantum decoherence destroys the vacuum fluctuations before energy can be extracted'
      ],
      correct: 0,
      explanation: 'The quantum vacuum is, by definition, the ground state — the state of minimum energy. The second law of thermodynamics prohibits extracting net work from a system in thermal equilibrium at its lowest energy state. While the Casimir effect is real and measurable, the energy released when plates come together was originally invested in assembling the plate configuration. This is analogous to releasing gravitational potential energy — real energy transfer occurs, but it is not "free energy." Any cyclic extraction scheme must invest at least as much energy in resetting the plates as was extracted.'
    },
    {
      question: 'The dynamical Casimir effect (DCE) predicts real photon production from the quantum vacuum when a mirror boundary condition changes sufficiently rapidly. What is the minimum mirror velocity (as a fraction of c) required for observable DCE photon production, and has this been experimentally confirmed?',
      options: [
        'The mirror must physically move at ~0.1c; this has never been achieved or confirmed',
        'The mirror must move at ~c; this is physically impossible and DCE remains purely theoretical',
        'No minimum velocity exists; any acceleration produces photons. Confirmed using a SQUID-terminated transmission line simulating a moving mirror at ~0.05c (Wilson et al., 2011)',
        'The mirror must oscillate at optical frequencies (~10¹⁵ Hz); confirmed in 2020 using piezoelectric actuators'
      ],
      correct: 2,
      explanation: 'The dynamical Casimir effect was experimentally confirmed by Wilson et al. (Nature, 2011) using a superconducting quantum interference device (SQUID) at the end of a coplanar waveguide. By modulating the SQUID\'s inductance at ~10 GHz, they effectively created a "mirror" whose boundary condition moved at ~5% of the speed of light. This produced measurable microwave photon pairs from the vacuum, confirming the DCE prediction. No physical mirror needs to move — only the electromagnetic boundary condition must change rapidly enough.'
    },
    {
      question: 'In the Lifshitz theory generalization of the Casimir effect to real (non-ideal) materials, the force between two dielectric half-spaces depends on their frequency-dependent dielectric functions ε(ω). For two plates made of a material with ε(ω) → 1 (approaching vacuum), what happens to the Casimir force?',
      options: [
        'The force reaches its maximum (perfect reflection)',
        'The force vanishes because there is no contrast in electromagnetic boundary conditions',
        'The force reverses sign and becomes repulsive',
        'The force remains unchanged because it depends only on geometry, not material properties'
      ],
      correct: 1,
      explanation: 'In Lifshitz theory, the Casimir force arises from the contrast between the dielectric properties of the plates and the intervening medium. When ε(ω) → 1 for both plates, they become electromagnetically indistinguishable from vacuum — no boundary conditions are imposed, no modes are excluded, and the force vanishes. This demonstrates that the Casimir effect is fundamentally about boundary conditions modifying the vacuum mode structure, not an intrinsic property of empty space itself. Conversely, perfect conductors (ε → ∞) give the maximum Casimir force, recovering the original Casimir result.'
    }
  ];

  // ========================================================================
  //  DESCRIPTION
  // ========================================================================
  const description = `The Vacuum Energy Battery is a theoretical ultra-advanced energy storage device 
that harvests zero-point quantum vacuum fluctuations via the Casimir effect. Eight radially-arranged 
Casimir cavity arrays, each containing twelve parallel nano-gap plates at sub-micron separations, 
extract energy from excluded electromagnetic vacuum modes. Four superconducting YBCO extractor coils 
channel the harvested energy through lossless Nb₃Sn waveguide conduits into six metamaterial 
dielectric capacitor storage cells capable of ultra-high energy density storage. The central chamber 
visualizes virtual particle-antiparticle pairs spontaneously forming and annihilating according to 
ΔEΔt ≥ ℏ/2. Eight piezoelectric resonator rods provide precision frequency tuning of the Casimir 
cavities. Power is delivered through twin high-voltage terminals (positive/negative) via heavy copper 
bus bars. The entire assembly is housed in a radiation-hardened tungsten-carbide containment shell 
with cryogenic cooling rings maintaining superconductor operation at 4.2K. A comprehensive SCADA 
control panel provides real-time monitoring of all subsystems via fiber optic data lines.`;

  // ========================================================================
  //  ANIMATE — Extreme, highly synchronized animation
  // ========================================================================
  function animate(time, speed, _meshes) {
    const t = time * speed;

    // ── 1. Casimir Plate Compression/Expansion ───────────────────────────
    meshes.casimirPlates.forEach((plate, idx) => {
      const cavityIdx = Math.floor(idx / 12);
      const plateIdx = idx % 12;
      const compression = Math.sin(t * 1.5 + cavityIdx * 0.8) * 0.004;
      plate.position.z = (plateIdx - 6) * 0.022 + compression * (plateIdx - 6);
    });

    // ── 2. Casimir Gap Glow Pulsation ────────────────────────────────────
    meshes.casimirGaps.forEach((gap, idx) => {
      const pulse = 0.3 + 0.5 * Math.abs(Math.sin(t * 2.5 + idx * 0.3));
      gap.material.opacity = pulse;
      gap.material.emissiveIntensity = 1.0 + pulse * 2.0;
    });

    // ── 3. Virtual Particle Pairs — Popping in/out of existence ──────────
    meshes.particlePairs.forEach((pair) => {
      const cycleTime = pair.lifetime;
      const phase = ((t * pair.speed + pair.phase) % cycleTime) / cycleTime;

      // Particles appear, separate, then annihilate
      if (phase < 0.1) {
        // Spawning — growing from nothing
        const scale = phase / 0.1;
        pair.particle.scale.setScalar(scale);
        pair.antiParticle.scale.setScalar(scale);
        pair.particle.material.opacity = scale * 0.8;
        pair.antiParticle.material.opacity = scale * 0.7;
        pair.particle.position.x = -0.01 * scale;
        pair.antiParticle.position.x = 0.01 * scale;
      } else if (phase < 0.7) {
        // Separating — moving apart
        const sep = (phase - 0.1) / 0.6;
        const dist = 0.01 + sep * 0.08;
        pair.particle.scale.setScalar(1);
        pair.antiParticle.scale.setScalar(1);
        pair.particle.material.opacity = 0.8;
        pair.antiParticle.material.opacity = 0.7;
        pair.particle.position.x = -dist;
        pair.antiParticle.position.x = dist;
        // Slight vertical oscillation
        pair.particle.position.y = Math.sin(sep * Math.PI * 3) * 0.01;
        pair.antiParticle.position.y = -Math.sin(sep * Math.PI * 3) * 0.01;
      } else {
        // Annihilating — rushing back together and vanishing
        const annPhase = (phase - 0.7) / 0.3;
        const dist = 0.09 * (1 - annPhase);
        const scale = 1 - annPhase * 0.8;
        pair.particle.scale.setScalar(scale);
        pair.antiParticle.scale.setScalar(scale);
        pair.particle.material.opacity = (1 - annPhase) * 0.8;
        pair.antiParticle.material.opacity = (1 - annPhase) * 0.7;
        pair.particle.position.x = -dist;
        pair.antiParticle.position.x = dist;
        // Flash bright at annihilation
        if (annPhase > 0.8) {
          const flash = (annPhase - 0.8) / 0.2;
          pair.particle.material.emissiveIntensity = 2.0 + flash * 8.0;
          pair.antiParticle.material.emissiveIntensity = 2.0 + flash * 8.0;
        }
      }

      // Drift the whole pair slowly
      pair.group.position.y = pair.basePos.y + Math.sin(t * 0.3 + pair.phase) * 0.15;
      pair.group.rotation.y = t * 0.2 + pair.phase;
    });

    // ── 4. Energy Cell Core Pulsation ────────────────────────────────────
    meshes.cellCores.forEach((core, idx) => {
      const charge = 0.5 + 0.5 * Math.sin(t * 0.8 + idx * Math.PI / 3);
      core.material.emissiveIntensity = 1.0 + charge * 3.0;
      core.material.opacity = 0.4 + charge * 0.5;
      core.scale.set(1, 1, 0.8 + charge * 0.4);
    });

    // ── 5. Crystal Lattice Ring Shimmer ───────────────────────────────────
    meshes.crystalLattice.forEach((ring, idx) => {
      ring.material.emissiveIntensity = 1.0 + Math.sin(t * 4 + idx * 0.5) * 1.5;
    });

    // ── 6. Quantum Field Sphere Rotation & Pulsation ─────────────────────
    if (meshes.quantumFieldSphere) {
      meshes.quantumFieldSphere.rotation.x = t * 0.15;
      meshes.quantumFieldSphere.rotation.y = t * 0.23;
      meshes.quantumFieldSphere.rotation.z = t * 0.11;
      const qfPulse = 0.2 + 0.1 * Math.sin(t * 1.2);
      meshes.quantumFieldSphere.material.opacity = qfPulse;
      const qfScale = 1.0 + Math.sin(t * 0.7) * 0.05;
      meshes.quantumFieldSphere.scale.setScalar(qfScale);
    }

    // ── 7. Coolant Ring Rotation ─────────────────────────────────────────
    meshes.coolantRings.forEach((ring, idx) => {
      ring.rotation.z = t * 0.5 * (idx % 2 === 0 ? 1 : -1);
      ring.material.emissiveIntensity = 1.2 + Math.sin(t * 3 + idx) * 0.8;
    });

    // ── 8. Terminal Arc Pulse ────────────────────────────────────────────
    meshes.terminalArcs.forEach((arc, idx) => {
      const arcPulse = 1.0 + Math.sin(t * 6 + idx * Math.PI) * 0.5;
      arc.scale.setScalar(arcPulse);
      arc.material.emissiveIntensity = 1.5 + Math.sin(t * 8 + idx) * 1.5;
    });

    // ── 9. Terminal Glow ─────────────────────────────────────────────────
    if (meshes.terminalPos) {
      meshes.terminalPos.material.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.6;
    }
    if (meshes.terminalNeg) {
      meshes.terminalNeg.material.emissiveIntensity = 0.8 + Math.cos(t * 2) * 0.6;
    }

    // ── 10. Warning Light Flashing ───────────────────────────────────────
    meshes.warningLights.forEach((light, idx) => {
      const flashPhase = (t * 2 + idx * Math.PI / 2) % (Math.PI * 2);
      light.material.emissiveIntensity = flashPhase < Math.PI ? 2.0 : 0.2;
      light.parent.rotation.y = t * 3;
    });

    // ── 11. Status LED Blink Sequence ────────────────────────────────────
    meshes.statusLEDs.forEach((led, idx) => {
      const blinkRate = 1.5 + idx * 0.7;
      led.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(t * blinkRate + idx)) * 2.0;
    });

    // ── 12. Screen Glow Animation ────────────────────────────────────────
    if (meshes.screenGlow) {
      const screenFlicker = 1.2 + Math.sin(t * 15) * 0.1 + Math.sin(t * 0.5) * 0.3;
      meshes.screenGlow.material.emissiveIntensity = screenFlicker;
    }

    // ── 13. Energy Conduit Flow ──────────────────────────────────────────
    meshes.conduits.forEach((conduit, idx) => {
      conduit.material.emissiveIntensity = 1.5 + Math.sin(t * 3 + idx * 0.5) * 1.5;
      conduit.material.opacity = 0.4 + Math.abs(Math.sin(t * 2 + idx * 0.3)) * 0.5;
    });

    // ── 14. Extractor Coil Glow ──────────────────────────────────────────
    meshes.extractorCoils.forEach((coil, idx) => {
      coil.rotation.y += 0.002 * speed * (idx % 2 === 0 ? 1 : -1);
    });

    // ── 15. Data Line Pulse ──────────────────────────────────────────────
    meshes.dataLines.forEach((line, idx) => {
      line.material.emissiveIntensity = 1.0 + Math.sin(t * 5 + idx * 0.8) * 1.0;
    });

    // ── 16. Hex Plate Shimmer ────────────────────────────────────────────
    meshes.hexPlates.forEach((hex, idx) => {
      if (hex.material && hex.material.emissive) {
        hex.material.emissiveIntensity = 0.05 + Math.abs(Math.sin(t * 0.5 + idx * 0.1)) * 0.1;
      }
    });

    // ── 17. Outer Shell Slow Rotation ────────────────────────────────────
    if (meshes.outerShell) {
      meshes.outerShell.parent.rotation.y = Math.sin(t * 0.05) * 0.02;
    }

    // ── 18. Inner Chamber Breathing ──────────────────────────────────────
    if (meshes.innerChamber) {
      const breathe = 1.0 + Math.sin(t * 0.4) * 0.015;
      meshes.innerChamber.scale.set(breathe, 1, breathe);
    }
  }

  // ========================================================================
  //  RETURN
  // ========================================================================
  return { group, parts, description, quizQuestions, animate };
}
