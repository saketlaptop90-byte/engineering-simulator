// ============================================================================
// FALSE VACUUM DECAY BOMB — ULTRA GOD TIER
// A weapon that nucleates a true vacuum bubble, unraveling spacetime itself.
// Coleman-De Luccia instanton mediated catastrophic phase transition device.
// ============================================================================

import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ========================================================================
  // CUSTOM MATERIALS — exotic, emissive, high-tech
  // ========================================================================
  const voidBlack = new THREE.MeshStandardMaterial({
    color: 0x020008, roughness: 0.05, metalness: 1.0,
    emissive: 0x0a0020, emissiveIntensity: 0.15
  });
  const quantumGlow = new THREE.MeshStandardMaterial({
    color: 0x4400ff, roughness: 0.1, metalness: 0.3,
    emissive: 0x6600ff, emissiveIntensity: 1.8, transparent: true, opacity: 0.7
  });
  const trueVacuumMat = new THREE.MeshStandardMaterial({
    color: 0x000000, roughness: 0.0, metalness: 1.0,
    emissive: 0x110033, emissiveIntensity: 0.6, transparent: true, opacity: 0.45
  });
  const falseVacuumMat = new THREE.MeshStandardMaterial({
    color: 0x220055, roughness: 0.15, metalness: 0.4,
    emissive: 0x8800ff, emissiveIntensity: 1.2, transparent: true, opacity: 0.35
  });
  const bubbleWallMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff, roughness: 0.0, metalness: 0.0,
    emissive: 0xff44ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.55,
    side: THREE.DoubleSide
  });
  const decayEnergyMat = new THREE.MeshStandardMaterial({
    color: 0xff2200, roughness: 0.0, metalness: 0.0,
    emissive: 0xff4400, emissiveIntensity: 3.0, transparent: true, opacity: 0.6
  });
  const containmentFieldMat = new THREE.MeshStandardMaterial({
    color: 0x00aaff, roughness: 0.05, metalness: 0.2,
    emissive: 0x0088ff, emissiveIntensity: 1.5, transparent: true, opacity: 0.2,
    side: THREE.DoubleSide, wireframe: true
  });
  const containmentFieldSolid = new THREE.MeshStandardMaterial({
    color: 0x0066cc, roughness: 0.1, metalness: 0.8,
    emissive: 0x0044aa, emissiveIntensity: 0.8, transparent: true, opacity: 0.12,
    side: THREE.DoubleSide
  });
  const exoticMatterMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88, roughness: 0.0, metalness: 0.6,
    emissive: 0x00ff66, emissiveIntensity: 2.0, transparent: true, opacity: 0.5
  });
  const warningNeon = new THREE.MeshStandardMaterial({
    color: 0xff0000, roughness: 0.0, metalness: 0.0,
    emissive: 0xff0000, emissiveIntensity: 3.5, transparent: true, opacity: 0.9
  });
  const plasmaCoreMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.0, metalness: 0.0,
    emissive: 0xeeddff, emissiveIntensity: 4.0, transparent: true, opacity: 0.8
  });
  const darkEnergyMat = new THREE.MeshStandardMaterial({
    color: 0x1a0033, roughness: 0.02, metalness: 1.0,
    emissive: 0x330066, emissiveIntensity: 0.9
  });
  const higgsCouplingMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00, roughness: 0.1, metalness: 0.5,
    emissive: 0xffcc00, emissiveIntensity: 2.2, transparent: true, opacity: 0.65
  });
  const spacetimeFabricMat = new THREE.MeshStandardMaterial({
    color: 0x110022, roughness: 0.3, metalness: 0.1,
    emissive: 0x220044, emissiveIntensity: 0.4, transparent: true, opacity: 0.3,
    side: THREE.DoubleSide, wireframe: true
  });

  // ========================================================================
  // MESHES COLLECTION — for animation references
  // ========================================================================
  const meshes = {};

  // ========================================================================
  // 1. OUTER ARMORED SHELL — Lathe-profiled weapon casing
  // ========================================================================
  const outerShellGroup = new THREE.Group();
  const shellProfile = new THREE.Shape();
  // Complex weapon body profile — elongated ovoid with flanges
  const shellPts = [
    new THREE.Vector2(0, -6.0),
    new THREE.Vector2(1.8, -5.8),
    new THREE.Vector2(3.2, -5.0),
    new THREE.Vector2(4.0, -4.0),
    new THREE.Vector2(4.5, -2.5),
    new THREE.Vector2(4.8, -1.0),
    new THREE.Vector2(5.0, 0.0),
    new THREE.Vector2(4.8, 1.0),
    new THREE.Vector2(4.5, 2.5),
    new THREE.Vector2(4.0, 4.0),
    new THREE.Vector2(3.2, 5.0),
    new THREE.Vector2(1.8, 5.8),
    new THREE.Vector2(0, 6.0),
  ];
  const shellLathe = new THREE.LatheGeometry(shellPts, 64);
  const outerShellMesh = new THREE.Mesh(shellLathe, darkSteel.clone());
  outerShellMesh.material.transparent = true;
  outerShellMesh.material.opacity = 0.25;
  outerShellMesh.material.side = THREE.DoubleSide;
  outerShellGroup.add(outerShellMesh);
  meshes.outerShell = outerShellMesh;

  // Armored panel ridges — circumferential reinforcement bands
  for (let i = 0; i < 12; i++) {
    const bandY = -5.5 + i * 1.0;
    const bandRadius = 4.2 + 0.6 * Math.sin((i / 11) * Math.PI);
    const bandGeo = new THREE.TorusGeometry(bandRadius, 0.08, 8, 64);
    const band = new THREE.Mesh(bandGeo, chrome);
    band.rotation.x = Math.PI / 2;
    band.position.y = bandY;
    outerShellGroup.add(band);
  }

  // Longitudinal seam lines — 8 equally spaced vertical ribs
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const ribCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * 4.85, -5.5, Math.sin(angle) * 4.85),
      new THREE.Vector3(Math.cos(angle) * 5.05, -2.0, Math.sin(angle) * 5.05),
      new THREE.Vector3(Math.cos(angle) * 5.05, 2.0, Math.sin(angle) * 5.05),
      new THREE.Vector3(Math.cos(angle) * 4.85, 5.5, Math.sin(angle) * 4.85),
    ]);
    const ribGeo = new THREE.TubeGeometry(ribCurve, 32, 0.06, 6, false);
    const rib = new THREE.Mesh(ribGeo, steel);
    outerShellGroup.add(rib);
  }

  // Rivets along each rib at intervals
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    for (let j = 0; j < 10; j++) {
      const y = -5.0 + j * 1.1;
      const r = 4.6 + 0.5 * Math.sin(((j + 0.5) / 10) * Math.PI);
      const rivetGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const rivet = new THREE.Mesh(rivetGeo, chrome);
      rivet.position.set(Math.cos(angle) * (r + 0.15), y, Math.sin(angle) * (r + 0.15));
      outerShellGroup.add(rivet);
    }
  }
  group.add(outerShellGroup);

  // ========================================================================
  // 2. NUCLEATION CHAMBER — central spherical chamber
  // ========================================================================
  const nucleationGroup = new THREE.Group();

  // Inner vacuum chamber sphere
  const chamberGeo = new THREE.SphereGeometry(2.8, 64, 64);
  const chamberMesh = new THREE.Mesh(chamberGeo, voidBlack);
  nucleationGroup.add(chamberMesh);
  meshes.nucleationChamber = chamberMesh;

  // Chamber inner lining — slightly smaller glowing sphere
  const liningGeo = new THREE.SphereGeometry(2.75, 64, 64);
  const liningMesh = new THREE.Mesh(liningGeo, quantumGlow);
  nucleationGroup.add(liningMesh);
  meshes.chamberLining = liningMesh;

  // Nucleation seed crystal at the absolute center
  const seedGeo = new THREE.IcosahedronGeometry(0.2, 3);
  const seedMesh = new THREE.Mesh(seedGeo, plasmaCoreMat);
  nucleationGroup.add(seedMesh);
  meshes.nucleationSeed = seedMesh;

  // Seed crystal cage — wireframe dodecahedron surrounding the seed
  const cageGeo = new THREE.DodecahedronGeometry(0.45, 0);
  const cageMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xaaaaff, emissiveIntensity: 1.0,
    wireframe: true
  });
  const cageMesh = new THREE.Mesh(cageGeo, cageMat);
  nucleationGroup.add(cageMesh);
  meshes.seedCage = cageMesh;

  group.add(nucleationGroup);

  // ========================================================================
  // 3. EXOTIC ENERGY CONCENTRATORS — 6 massive beam emitters on axes
  // ========================================================================
  const concentratorGroup = new THREE.Group();
  const concentratorDirs = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
  ];
  const concentratorMeshes = [];

  concentratorDirs.forEach((dir, idx) => {
    const cGroup = new THREE.Group();

    // Emitter housing — truncated cone
    const emitterPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.6, 0),
      new THREE.Vector2(0.7, 0.1),
      new THREE.Vector2(0.7, 1.5),
      new THREE.Vector2(0.5, 1.8),
      new THREE.Vector2(0.3, 2.0),
      new THREE.Vector2(0, 2.0),
    ];
    const emitterGeo = new THREE.LatheGeometry(emitterPts, 32);
    const emitterMesh = new THREE.Mesh(emitterGeo, darkSteel);
    cGroup.add(emitterMesh);

    // Focusing lens at the tip
    const lensGeo = new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const lensMesh = new THREE.Mesh(lensGeo, exoticMatterMat);
    lensMesh.position.y = 0.02;
    lensMesh.rotation.x = Math.PI;
    cGroup.add(lensMesh);

    // Energy beam from emitter to chamber center
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.15, 2.5, 16);
    const beamMesh = new THREE.Mesh(beamGeo, higgsCouplingMat);
    beamMesh.position.y = -1.25;
    cGroup.add(beamMesh);
    concentratorMeshes.push(beamMesh);

    // Cooling fins around emitter
    for (let f = 0; f < 8; f++) {
      const finAngle = (f / 8) * Math.PI * 2;
      const finGeo = new THREE.BoxGeometry(0.02, 1.2, 0.3);
      const fin = new THREE.Mesh(finGeo, aluminum);
      fin.position.set(Math.cos(finAngle) * 0.75, 1.0, Math.sin(finAngle) * 0.75);
      fin.rotation.y = -finAngle;
      cGroup.add(fin);
    }

    // Position and orient toward center
    const dist = 3.2;
    cGroup.position.set(dir[0] * dist, dir[1] * dist, dir[2] * dist);
    // Point the emitter toward the origin
    cGroup.lookAt(0, 0, 0);
    cGroup.rotateX(Math.PI / 2);

    concentratorGroup.add(cGroup);
  });
  meshes.energyBeams = concentratorMeshes;
  group.add(concentratorGroup);

  // ========================================================================
  // 4. TRUE VACUUM BUBBLE — the expanding doom sphere
  // ========================================================================
  const bubbleGroup = new THREE.Group();

  // True vacuum interior — pure nothingness
  const trueVacGeo = new THREE.SphereGeometry(0.5, 64, 64);
  const trueVacMesh = new THREE.Mesh(trueVacGeo, trueVacuumMat);
  bubbleGroup.add(trueVacMesh);
  meshes.trueVacuumBubble = trueVacMesh;

  // Phase boundary wall — the Coleman-De Luccia domain wall
  const wallGeo = new THREE.SphereGeometry(0.55, 64, 64);
  const wallMesh = new THREE.Mesh(wallGeo, bubbleWallMat);
  bubbleGroup.add(wallMesh);
  meshes.bubbleWall = wallMesh;

  // Secondary shimmering boundary layer
  const shimmerGeo = new THREE.SphereGeometry(0.6, 48, 48);
  const shimmerMat = new THREE.MeshStandardMaterial({
    color: 0xcc00ff, emissive: 0xaa00cc, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.15, side: THREE.DoubleSide, wireframe: true
  });
  const shimmerMesh = new THREE.Mesh(shimmerGeo, shimmerMat);
  bubbleGroup.add(shimmerMesh);
  meshes.shimmerLayer = shimmerMesh;

  group.add(bubbleGroup);

  // ========================================================================
  // 5. MATTER DISINTEGRATION DEBRIS — particles at bubble wall
  // ========================================================================
  const debrisGroup = new THREE.Group();
  const debrisParticles = [];

  for (let i = 0; i < 200; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.55 + Math.random() * 0.4;
    const size = 0.01 + Math.random() * 0.04;

    const pGeo = new THREE.TetrahedronGeometry(size, 0);
    const pMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.0, 1, 0.5 + Math.random() * 0.5),
      emissive: new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.4),
      emissiveIntensity: 2.0 + Math.random() * 2.0,
      transparent: true,
      opacity: 0.4 + Math.random() * 0.6
    });
    const p = new THREE.Mesh(pGeo, pMat);
    p.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    p.userData = { theta, phi, baseR: r, speed: 0.5 + Math.random() * 2.0, phase: Math.random() * Math.PI * 2 };
    debrisGroup.add(p);
    debrisParticles.push(p);
  }
  meshes.debrisParticles = debrisParticles;
  group.add(debrisGroup);

  // ========================================================================
  // 6. CONTAINMENT FIELD GENERATORS — desperate attempts to hold the bubble
  // ========================================================================
  const containmentGroup = new THREE.Group();

  // Primary containment sphere — wireframe
  const cont1Geo = new THREE.IcosahedronGeometry(3.5, 2);
  const cont1Mesh = new THREE.Mesh(cont1Geo, containmentFieldMat);
  containmentGroup.add(cont1Mesh);
  meshes.containmentPrimary = cont1Mesh;

  // Secondary containment sphere
  const cont2Geo = new THREE.IcosahedronGeometry(3.8, 1);
  const cont2Mesh = new THREE.Mesh(cont2Geo, containmentFieldSolid);
  containmentGroup.add(cont2Mesh);
  meshes.containmentSecondary = cont2Mesh;

  // Containment field generator pylons — 12 vertices of icosahedron
  const pylonPositions = [];
  for (let i = 0; i < 12; i++) {
    const golden = (1 + Math.sqrt(5)) / 2;
    const coords = [
      [0, 1, golden], [0, -1, golden], [0, 1, -golden], [0, -1, -golden],
      [1, golden, 0], [-1, golden, 0], [1, -golden, 0], [-1, -golden, 0],
      [golden, 0, 1], [-golden, 0, 1], [golden, 0, -1], [-golden, 0, -1]
    ];
    const c = coords[i];
    const len = Math.sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2]);
    const norm = [c[0] / len * 4.0, c[1] / len * 4.0, c[2] / len * 4.0];
    pylonPositions.push(norm);

    const pylonGroup = new THREE.Group();

    // Pylon body — hexagonal prism
    const pylonGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 6);
    const pylonMesh = new THREE.Mesh(pylonGeo, darkSteel);
    pylonGroup.add(pylonMesh);

    // Pylon emitter tip — glowing sphere
    const tipGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, new THREE.MeshStandardMaterial({
      color: 0x00ccff, emissive: 0x00aaff, emissiveIntensity: 2.5
    }));
    tipMesh.position.y = -0.45;
    pylonGroup.add(tipMesh);

    // Pylon base ring
    const baseRingGeo = new THREE.TorusGeometry(0.25, 0.04, 8, 16);
    const baseRing = new THREE.Mesh(baseRingGeo, chrome);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.4;
    pylonGroup.add(baseRing);

    pylonGroup.position.set(norm[0], norm[1], norm[2]);
    pylonGroup.lookAt(0, 0, 0);
    containmentGroup.add(pylonGroup);
  }

  // Containment field lines between adjacent pylons
  for (let i = 0; i < pylonPositions.length; i++) {
    for (let j = i + 1; j < pylonPositions.length; j++) {
      const a = pylonPositions[i];
      const b = pylonPositions[j];
      const dist = Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
      if (dist < 5.0) {
        const mid = [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2];
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(a[0], a[1], a[2]),
          new THREE.Vector3(mid[0] * 0.85, mid[1] * 0.85, mid[2] * 0.85),
          new THREE.Vector3(b[0], b[1], b[2])
        );
        const lineGeo = new THREE.TubeGeometry(curve, 16, 0.015, 4, false);
        const lineMat = new THREE.MeshStandardMaterial({
          color: 0x00aaff, emissive: 0x0066ff, emissiveIntensity: 1.0,
          transparent: true, opacity: 0.3
        });
        const lineMesh = new THREE.Mesh(lineGeo, lineMat);
        containmentGroup.add(lineMesh);
      }
    }
  }

  meshes.containmentGroup = containmentGroup;
  group.add(containmentGroup);

  // ========================================================================
  // 7. FALSE VACUUM ENERGY POTENTIAL LANDSCAPE — visible energy surface
  // ========================================================================
  const landscapeGroup = new THREE.Group();

  // Spacetime fabric mesh — grid that warps near the bubble
  const fabricGeo = new THREE.PlaneGeometry(14, 14, 60, 60);
  const fabricMesh = new THREE.Mesh(fabricGeo, spacetimeFabricMat);
  fabricMesh.rotation.x = -Math.PI / 2;
  fabricMesh.position.y = -5.5;
  landscapeGroup.add(fabricMesh);
  meshes.spacetimeFabric = fabricMesh;

  // Second fabric layer above
  const fabricGeo2 = new THREE.PlaneGeometry(14, 14, 60, 60);
  const fabricMesh2 = new THREE.Mesh(fabricGeo2, spacetimeFabricMat.clone());
  fabricMesh2.rotation.x = -Math.PI / 2;
  fabricMesh2.position.y = 5.5;
  landscapeGroup.add(fabricMesh2);
  meshes.spacetimeFabricTop = fabricMesh2;

  group.add(landscapeGroup);

  // ========================================================================
  // 8. HIGGS FIELD DESTABILIZER COILS — wound around nucleation chamber
  // ========================================================================
  const coilGroup = new THREE.Group();
  const coilMeshes = [];

  for (let c = 0; c < 3; c++) {
    const coilPts = [];
    const coilR = 3.0 + c * 0.15;
    const coilTurns = 12;
    for (let i = 0; i <= coilTurns * 32; i++) {
      const t = i / (coilTurns * 32);
      const angle = t * coilTurns * Math.PI * 2;
      const y = -4.0 + t * 8.0;
      coilPts.push(new THREE.Vector3(
        Math.cos(angle) * coilR,
        y,
        Math.sin(angle) * coilR
      ));
    }
    const coilCurve = new THREE.CatmullRomCurve3(coilPts);
    const coilGeo = new THREE.TubeGeometry(coilCurve, 256, 0.04, 8, false);
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xff6600 + c * 0x002200,
      emissive: 0xff4400 + c * 0x001100,
      emissiveIntensity: 1.0 + c * 0.3,
      metalness: 0.9, roughness: 0.1
    });
    const coilMesh = new THREE.Mesh(coilGeo, coilMat);
    coilGroup.add(coilMesh);
    coilMeshes.push(coilMesh);
  }
  meshes.destabilizerCoils = coilMeshes;
  group.add(coilGroup);

  // ========================================================================
  // 9. DARK ENERGY INJECTORS — 4 massive syringes feeding the chamber
  // ========================================================================
  const injectorGroup = new THREE.Group();
  const injectorMeshes = [];

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const iGroup = new THREE.Group();

    // Syringe barrel
    const barrelGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.5, 16);
    const barrelMesh = new THREE.Mesh(barrelGeo, glass);
    iGroup.add(barrelMesh);

    // Dark energy fluid inside
    const fluidGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 16);
    const fluidMesh = new THREE.Mesh(fluidGeo, darkEnergyMat);
    fluidMesh.position.y = 0.5;
    iGroup.add(fluidMesh);
    injectorMeshes.push(fluidMesh);

    // Piston
    const pistonGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.3, 16);
    const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
    pistonMesh.position.y = 1.8;
    iGroup.add(pistonMesh);
    injectorMeshes.push(pistonMesh);

    // Piston rod
    const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const rodMesh = new THREE.Mesh(rodGeo, steel);
    rodMesh.position.y = 2.6;
    iGroup.add(rodMesh);

    // Needle tip
    const needleGeo = new THREE.ConeGeometry(0.08, 0.6, 12);
    const needleMesh = new THREE.Mesh(needleGeo, chrome);
    needleMesh.position.y = -2.05;
    needleMesh.rotation.x = Math.PI;
    iGroup.add(needleMesh);

    // Mounting bracket
    const bracketGeo = new THREE.BoxGeometry(0.5, 0.15, 0.15);
    const bracket = new THREE.Mesh(bracketGeo, steel);
    bracket.position.y = 0;
    bracket.position.x = 0.3;
    iGroup.add(bracket);

    iGroup.position.set(Math.cos(angle) * 3.8, 0, Math.sin(angle) * 3.8);
    iGroup.lookAt(0, 0, 0);
    iGroup.rotateX(Math.PI / 2);
    injectorGroup.add(iGroup);
  }
  meshes.injectors = injectorMeshes;
  group.add(injectorGroup);

  // ========================================================================
  // 10. QUANTUM TUNNELING CATALYSTS — rotating orbital rings
  // ========================================================================
  const catalystGroup = new THREE.Group();
  const catalystRings = [];

  for (let i = 0; i < 5; i++) {
    const ringR = 1.5 + i * 0.4;
    const ringGeo = new THREE.TorusGeometry(ringR, 0.03, 8, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xaa00ff, emissive: 0x8800dd, emissiveIntensity: 1.5 + i * 0.3,
      transparent: true, opacity: 0.5 + i * 0.1
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.random() * Math.PI;
    ringMesh.rotation.y = Math.random() * Math.PI;
    catalystGroup.add(ringMesh);
    catalystRings.push(ringMesh);

    // Orbiting catalyst nodes on each ring
    for (let j = 0; j < 6; j++) {
      const nodeAngle = (j / 6) * Math.PI * 2;
      const nodeGeo = new THREE.OctahedronGeometry(0.06, 1);
      const nodeMesh = new THREE.Mesh(nodeGeo, exoticMatterMat);
      nodeMesh.position.set(
        Math.cos(nodeAngle) * ringR,
        0,
        Math.sin(nodeAngle) * ringR
      );
      ringMesh.add(nodeMesh);
    }
  }
  meshes.catalystRings = catalystRings;
  group.add(catalystGroup);

  // ========================================================================
  // 11. COLEMAN BOUNCE TRAJECTORY VISUALIZER — instanton path
  // ========================================================================
  const bounceGroup = new THREE.Group();

  // The bounce solution path — a curve in field space
  const bouncePts = [];
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const r = t * 2.5;
    // Coleman bounce profile: tanh-like transition
    const fieldVal = 2.0 * (1.0 / (1.0 + Math.exp(-8 * (t - 0.5))));
    const x = r * Math.cos(t * 6 * Math.PI);
    const z = r * Math.sin(t * 6 * Math.PI);
    bouncePts.push(new THREE.Vector3(x, fieldVal - 1.0, z));
  }
  const bounceCurve = new THREE.CatmullRomCurve3(bouncePts);
  const bounceGeo = new THREE.TubeGeometry(bounceCurve, 200, 0.025, 6, false);
  const bounceMat = new THREE.MeshStandardMaterial({
    color: 0xff00aa, emissive: 0xff0088, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.6
  });
  const bounceMesh = new THREE.Mesh(bounceGeo, bounceMat);
  bounceGroup.add(bounceMesh);
  meshes.bounceTrajectory = bounceMesh;

  group.add(bounceGroup);

  // ========================================================================
  // 12. WARNING SYSTEMS — flashing danger indicators
  // ========================================================================
  const warningGroup = new THREE.Group();
  const warningLights = [];

  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const lightGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const lightMesh = new THREE.Mesh(lightGeo, warningNeon.clone());
    lightMesh.position.set(
      Math.cos(angle) * 4.6,
      -4.5 + (i % 4) * 3.0,
      Math.sin(angle) * 4.6
    );
    warningGroup.add(lightMesh);
    warningLights.push(lightMesh);
  }
  meshes.warningLights = warningLights;
  group.add(warningGroup);

  // ========================================================================
  // 13. CONTROL INTERFACE — operator console (you'd have to be insane)
  // ========================================================================
  const consoleGroup = new THREE.Group();
  consoleGroup.position.set(6.5, -2.0, 0);

  // Console body
  const consolePts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1.2, 0),
    new THREE.Vector2(1.3, 0.1),
    new THREE.Vector2(1.3, 0.8),
    new THREE.Vector2(1.0, 1.2),
    new THREE.Vector2(0.8, 1.8),
    new THREE.Vector2(0, 1.8),
  ];
  const consoleGeo = new THREE.LatheGeometry(consolePts, 4);
  const consoleMesh = new THREE.Mesh(consoleGeo, darkSteel);
  consoleGroup.add(consoleMesh);

  // Screen — tinted glass with glow
  const screenGeo = new THREE.PlaneGeometry(1.4, 0.8);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x001122, emissive: 0x003366, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.9
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 1.4, 0.9);
  screenMesh.rotation.x = -0.3;
  consoleGroup.add(screenMesh);
  meshes.controlScreen = screenMesh;

  // Buttons — array of small cylinders
  for (let bx = 0; bx < 5; bx++) {
    for (let bz = 0; bz < 3; bz++) {
      const btnGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 8);
      const btnMat = new THREE.MeshStandardMaterial({
        color: bx === 2 && bz === 1 ? 0xff0000 : 0x444444,
        emissive: bx === 2 && bz === 1 ? 0xff0000 : 0x222222,
        emissiveIntensity: bx === 2 && bz === 1 ? 3.0 : 0.2
      });
      const btn = new THREE.Mesh(btnGeo, btnMat);
      btn.position.set(-0.4 + bx * 0.2, 1.0, 0.5 + bz * 0.15);
      consoleGroup.add(btn);
    }
  }

  // Arming key slot
  const keySlotGeo = new THREE.BoxGeometry(0.15, 0.05, 0.08);
  const keySlot = new THREE.Mesh(keySlotGeo, chrome);
  keySlot.position.set(0.5, 1.0, 0.3);
  consoleGroup.add(keySlot);

  group.add(consoleGroup);

  // ========================================================================
  // 14. GRAVITATIONAL LENS EFFECT RINGS — spacetime distortion indicators
  // ========================================================================
  const lensGroup = new THREE.Group();
  const lensRings = [];

  for (let i = 0; i < 8; i++) {
    const lr = 1.0 + i * 0.5;
    const lGeo = new THREE.TorusGeometry(lr, 0.01 + i * 0.003, 6, 128);
    const lMat = new THREE.MeshStandardMaterial({
      color: 0x4400aa, emissive: 0x3300aa, emissiveIntensity: 0.5 + i * 0.15,
      transparent: true, opacity: 0.2 + i * 0.03, wireframe: false
    });
    const lMesh = new THREE.Mesh(lGeo, lMat);
    lMesh.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    lMesh.rotation.z = (Math.random() - 0.5) * 0.3;
    lensGroup.add(lMesh);
    lensRings.push(lMesh);
  }
  meshes.lensRings = lensRings;
  group.add(lensGroup);

  // ========================================================================
  // 15. EXOTIC MATTER CONDUIT NETWORK — pipes connecting everything
  // ========================================================================
  const conduitGroup = new THREE.Group();

  // Create conduits from injectors to nucleation chamber
  const conduitPaths = [
    [new THREE.Vector3(5.0, 2.0, 0), new THREE.Vector3(3.5, 1.5, 0), new THREE.Vector3(2.8, 0.5, 0)],
    [new THREE.Vector3(-5.0, 2.0, 0), new THREE.Vector3(-3.5, 1.5, 0), new THREE.Vector3(-2.8, 0.5, 0)],
    [new THREE.Vector3(0, 2.0, 5.0), new THREE.Vector3(0, 1.5, 3.5), new THREE.Vector3(0, 0.5, 2.8)],
    [new THREE.Vector3(0, 2.0, -5.0), new THREE.Vector3(0, 1.5, -3.5), new THREE.Vector3(0, 0.5, -2.8)],
    [new THREE.Vector3(4.0, -3.0, 3.0), new THREE.Vector3(2.5, -1.5, 1.8), new THREE.Vector3(1.5, -0.5, 1.0)],
    [new THREE.Vector3(-4.0, -3.0, -3.0), new THREE.Vector3(-2.5, -1.5, -1.8), new THREE.Vector3(-1.5, -0.5, -1.0)],
    [new THREE.Vector3(3.5, 3.5, 3.5), new THREE.Vector3(2.0, 2.0, 2.0), new THREE.Vector3(1.2, 1.2, 1.2)],
    [new THREE.Vector3(-3.5, -3.5, 3.5), new THREE.Vector3(-2.0, -2.0, 2.0), new THREE.Vector3(-1.2, -1.2, 1.2)],
  ];

  const conduitMeshArr = [];
  conduitPaths.forEach(path => {
    const curve = new THREE.CatmullRomCurve3(path);
    const cGeo = new THREE.TubeGeometry(curve, 24, 0.06, 8, false);
    const cMesh = new THREE.Mesh(cGeo, copper);
    conduitGroup.add(cMesh);
    conduitMeshArr.push(cMesh);

    // Junction nodes at endpoints
    path.forEach(pt => {
      const jGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const jMesh = new THREE.Mesh(jGeo, chrome);
      jMesh.position.copy(pt);
      conduitGroup.add(jMesh);
    });
  });

  // Flowing energy particles inside conduits (represented as small spheres)
  const flowParticles = [];
  for (let i = 0; i < 40; i++) {
    const pGeo = new THREE.SphereGeometry(0.035, 6, 6);
    const pMat = new THREE.MeshStandardMaterial({
      color: 0x00ffaa, emissive: 0x00ff88, emissiveIntensity: 3.0
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.userData = {
      conduitIdx: i % conduitPaths.length,
      t: Math.random(),
      speed: 0.2 + Math.random() * 0.5
    };
    conduitGroup.add(pMesh);
    flowParticles.push(pMesh);
  }
  meshes.flowParticles = flowParticles;
  meshes.conduitPaths = conduitPaths;
  group.add(conduitGroup);

  // ========================================================================
  // 16. HAWKING RADIATION DETECTOR ARRAY
  // ========================================================================
  const detectorGroup = new THREE.Group();

  for (let i = 0; i < 6; i++) {
    const phi = (i / 6) * Math.PI * 2;
    const dGroup = new THREE.Group();

    // Detector dish — paraboloid
    const dishPts = [];
    for (let j = 0; j <= 16; j++) {
      const t = j / 16;
      dishPts.push(new THREE.Vector2(t * 0.5, t * t * 0.3));
    }
    const dishGeo = new THREE.LatheGeometry(dishPts, 24);
    const dishMesh = new THREE.Mesh(dishGeo, aluminum);
    dGroup.add(dishMesh);

    // Feed horn
    const hornGeo = new THREE.ConeGeometry(0.05, 0.3, 8);
    const horn = new THREE.Mesh(hornGeo, copper);
    horn.position.y = 0.15;
    dGroup.add(horn);

    // Support arm
    const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 6);
    const arm = new THREE.Mesh(armGeo, steel);
    arm.position.y = -0.5;
    dGroup.add(arm);

    dGroup.position.set(Math.cos(phi) * 5.5, 3.0 + Math.sin(i * 1.1) * 1.5, Math.sin(phi) * 5.5);
    dGroup.lookAt(0, 0, 0);
    detectorGroup.add(dGroup);
  }
  group.add(detectorGroup);

  // ========================================================================
  // 17. VACUUM ENERGY GAUGE — holographic energy level indicator
  // ========================================================================
  const gaugeGroup = new THREE.Group();
  gaugeGroup.position.set(-6.5, 0, 0);

  // Gauge column
  const gaugeColGeo = new THREE.CylinderGeometry(0.15, 0.15, 4.0, 12);
  const gaugeCol = new THREE.Mesh(gaugeColGeo, glass);
  gaugeGroup.add(gaugeCol);

  // Energy level (animated)
  const levelGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.0, 12);
  const levelMesh = new THREE.Mesh(levelGeo, new THREE.MeshStandardMaterial({
    color: 0xff00ff, emissive: 0xcc00cc, emissiveIntensity: 2.5,
    transparent: true, opacity: 0.7
  }));
  levelMesh.position.y = -1.0;
  gaugeGroup.add(levelMesh);
  meshes.energyLevel = levelMesh;

  // Gauge markings
  for (let i = 0; i < 10; i++) {
    const mGeo = new THREE.BoxGeometry(0.3, 0.01, 0.01);
    const mark = new THREE.Mesh(mGeo, chrome);
    mark.position.set(0.2, -2.0 + i * 0.44, 0);
    gaugeGroup.add(mark);
  }

  group.add(gaugeGroup);

  // ========================================================================
  // 18. TOPOLOGICAL DEFECT INDICATORS — cosmic string remnants
  // ========================================================================
  const defectGroup = new THREE.Group();
  const stringMeshes = [];

  for (let i = 0; i < 4; i++) {
    const sPts = [];
    for (let j = 0; j <= 50; j++) {
      const t = j / 50;
      sPts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.3 + Math.sin(t * 4 + i) * 2,
        -5 + t * 10,
        (Math.random() - 0.5) * 0.3 + Math.cos(t * 4 + i * 1.5) * 2
      ));
    }
    const sCurve = new THREE.CatmullRomCurve3(sPts);
    const sGeo = new THREE.TubeGeometry(sCurve, 64, 0.015, 4, false);
    const sMat = new THREE.MeshStandardMaterial({
      color: 0xffff00, emissive: 0xffaa00, emissiveIntensity: 1.5,
      transparent: true, opacity: 0.3
    });
    const sMesh = new THREE.Mesh(sGeo, sMat);
    defectGroup.add(sMesh);
    stringMeshes.push(sMesh);
  }
  meshes.cosmicStrings = stringMeshes;
  group.add(defectGroup);

  // ========================================================================
  // PARTS MANIFEST
  // ========================================================================
  const parts = [
    {
      name: 'Outer Armored Shell',
      description: 'Multi-layered dark-steel casing with longitudinal ribs and circumferential reinforcement bands. Designed to contain gravitational shear forces during pre-nucleation phase.',
      material: 'Dark chromium-tungsten carbide alloy',
      function: 'Structural containment of pre-nucleation energies and radiation shielding for operators',
      assemblyOrder: 1,
      connections: ['Containment Field Generators', 'Higgs Destabilizer Coils'],
      failureEffect: 'Immediate lethal radiation exposure; loss of structural integrity allows premature energy release',
      cascadeFailures: ['Containment Field Generators', 'Warning Systems'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'Nucleation Chamber',
      description: 'Ultra-high vacuum spherical chamber where false vacuum decay is initiated. Interior is coated with exotic negative-energy-density material to lower the tunneling barrier.',
      material: 'Planck-scale engineered metamaterial with negative energy density lining',
      function: 'Houses the critical nucleation seed and provides the environment for quantum tunneling to the true vacuum state',
      assemblyOrder: 2,
      connections: ['Nucleation Seed Crystal', 'Exotic Energy Concentrators', 'Dark Energy Injectors'],
      failureEffect: 'Tunneling probability drops to zero; device becomes inert',
      cascadeFailures: ['Nucleation Seed Crystal', 'Exotic Energy Concentrators'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 8, z: 0 }
    },
    {
      name: 'Nucleation Seed Crystal',
      description: 'Icosahedral crystal of topologically non-trivial vacuum condensate. Serves as the initial perturbation that catalyzes the Coleman-De Luccia instanton bounce.',
      material: 'Stabilized topological defect matter (magnetic monopole lattice)',
      function: 'Provides the initial field configuration that lowers the bounce action below the critical threshold for spontaneous nucleation',
      assemblyOrder: 3,
      connections: ['Nucleation Chamber', 'Quantum Tunneling Catalysts'],
      failureEffect: 'No phase transition occurs; the metastable false vacuum persists indefinitely',
      cascadeFailures: ['True Vacuum Bubble'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 12, z: 0 }
    },
    {
      name: 'Exotic Energy Concentrators',
      description: 'Six axis-aligned beam emitters that focus negative energy density beams onto the nucleation seed, amplifying the tunneling probability by 10^40.',
      material: 'Casimir-effect metamaterial focusing arrays with exotic matter lenses',
      function: 'Concentrate exotic energy to catastrophically lower the potential barrier between false and true vacuum states',
      assemblyOrder: 4,
      connections: ['Nucleation Chamber', 'Dark Energy Injectors', 'Exotic Matter Conduits'],
      failureEffect: 'Insufficient energy concentration; bounce action remains above critical value',
      cascadeFailures: ['Nucleation Seed Crystal', 'True Vacuum Bubble'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 4, z: 8 }
    },
    {
      name: 'True Vacuum Bubble',
      description: 'The expanding sphere of true vacuum — a region where the Higgs field has settled to its absolute minimum. Everything inside ceases to exist as known physics breaks down.',
      material: 'True vacuum state (no material — lower energy density than empty space)',
      function: 'The weapon payload itself — an expanding domain wall that converts all matter and energy to the true vacuum ground state at light speed',
      assemblyOrder: 10,
      connections: ['Nucleation Seed Crystal', 'Phase Boundary Wall'],
      failureEffect: 'Bubble collapses back to false vacuum (sub-critical radius); energy released as gamma burst',
      cascadeFailures: ['Phase Boundary Wall', 'Matter Disintegration Zone'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'Phase Boundary Wall (Domain Wall)',
      description: 'The Coleman-De Luccia domain wall — an infinitesimally thin surface where the scalar field interpolates between false and true vacuum values. Carries enormous surface energy density.',
      material: 'Scalar field gradient energy (σ ≈ Λ⁴/μ surface tension)',
      function: 'Mediates the phase transition; all matter encountering this wall is instantly converted as fundamental particle masses change',
      assemblyOrder: 11,
      connections: ['True Vacuum Bubble', 'Matter Disintegration Zone'],
      failureEffect: 'Wall tension exceeds energy budget — bubble shrinks and annihilates',
      cascadeFailures: ['True Vacuum Bubble'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -4, z: 0 }
    },
    {
      name: 'Containment Field Generators',
      description: 'Twelve icosahedral-vertex-mounted field emitters projecting a topological containment field. Desperately attempts to prevent premature bubble expansion during arming sequence.',
      material: 'Superconducting niobium-titanium coils with exotic matter core',
      function: 'Generates a metastable potential barrier around the nucleation zone, keeping the bubble sub-critical until intentional release',
      assemblyOrder: 5,
      connections: ['Outer Armored Shell', 'Quantum Tunneling Catalysts', 'Warning Systems'],
      failureEffect: 'Uncontrolled bubble nucleation — device detonates prematurely, destroying everything',
      cascadeFailures: ['True Vacuum Bubble', 'Phase Boundary Wall', 'Warning Systems'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 6, z: 10 }
    },
    {
      name: 'Higgs Field Destabilizer Coils',
      description: 'Triple-wound helical coils generating oscillating fields tuned to the Higgs boson resonance frequency, destabilizing the electroweak vacuum.',
      material: 'Higgs-coupled metamaterial conductor',
      function: 'Resonantly excite the Higgs field to push it toward the instability ridge of its potential, dramatically increasing tunneling rates',
      assemblyOrder: 6,
      connections: ['Nucleation Chamber', 'Outer Armored Shell', 'Exotic Energy Concentrators'],
      failureEffect: 'Higgs field remains in stable configuration; nucleation probability becomes negligible',
      cascadeFailures: ['Nucleation Seed Crystal', 'Exotic Energy Concentrators'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -8, y: 0, z: 0 }
    },
    {
      name: 'Dark Energy Injectors',
      description: 'Four high-pressure injector assemblies delivering concentrated dark energy (negative pressure exotic matter) directly into the nucleation chamber.',
      material: 'Reinforced glass barrel with chromium plunger, exotic matter payload',
      function: 'Supply the negative energy density required to thin the potential barrier via the thin-wall approximation regime',
      assemblyOrder: 7,
      connections: ['Nucleation Chamber', 'Exotic Matter Conduits'],
      failureEffect: 'Insufficient barrier thinning; tunneling action S_bounce >> 1, probability ≈ 0',
      cascadeFailures: ['Exotic Energy Concentrators', 'Nucleation Seed Crystal'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 10, y: -3, z: 10 }
    },
    {
      name: 'Quantum Tunneling Catalysts',
      description: 'Five concentric orbital rings carrying octahedral catalyst nodes that maintain quantum coherence across the nucleation volume.',
      material: 'Bose-Einstein condensate nodes in topological insulator rings',
      function: 'Maintain macroscopic quantum coherence necessary for the entire nucleation volume to tunnel simultaneously through the barrier',
      assemblyOrder: 8,
      connections: ['Nucleation Seed Crystal', 'Containment Field Generators'],
      failureEffect: 'Decoherence destroys tunneling amplitude; only thermal fluctuations remain (insufficient at any temperature)',
      cascadeFailures: ['Nucleation Seed Crystal'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -6, y: 6, z: -6 }
    },
    {
      name: 'Coleman Bounce Trajectory Visualizer',
      description: 'Holographic display showing the real-time computed Coleman bounce solution — the O(4)-symmetric instanton path in field-space that mediates the tunneling event.',
      material: 'Photonic crystal holographic projector',
      function: 'Monitors the instanton trajectory; if the bounce action B deviates from computed value, triggers containment reinforcement',
      assemblyOrder: 9,
      connections: ['Nucleation Chamber', 'Control Interface'],
      failureEffect: 'Loss of bounce monitoring; operators blind to nucleation status',
      cascadeFailures: ['Control Interface', 'Warning Systems'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 6, y: -8, z: 0 }
    },
    {
      name: 'Exotic Matter Conduit Network',
      description: 'Eight copper-exotic-matter hybrid conduits connecting injectors, concentrators, and the nucleation chamber. Flowing particles of exotic matter visible inside.',
      material: 'Copper-clad negative-energy waveguide',
      function: 'Transport exotic matter between subsystems while maintaining negative energy density coherence',
      assemblyOrder: 5,
      connections: ['Dark Energy Injectors', 'Exotic Energy Concentrators', 'Nucleation Chamber'],
      failureEffect: 'Exotic matter dissipates in transit; no negative energy reaches the chamber',
      cascadeFailures: ['Dark Energy Injectors', 'Exotic Energy Concentrators'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -10, y: -5, z: 6 }
    },
    {
      name: 'Warning Systems',
      description: 'Sixteen emergency warning lights distributed around the shell. Flash in escalating patterns as nucleation probability approaches unity.',
      material: 'High-intensity LED arrays with radiation-hardened housings',
      function: 'Alert operators to imminent vacuum decay event; final 3-second warning before point of no return',
      assemblyOrder: 12,
      connections: ['Containment Field Generators', 'Control Interface'],
      failureEffect: 'No warning of imminent detonation; operators cannot abort',
      cascadeFailures: ['Control Interface'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 12, y: 0, z: 0 }
    },
    {
      name: 'Control Interface',
      description: 'Operator console with arming key, holographic display, and the Big Red Button. Features a two-person authentication requirement and 10-second abort countdown.',
      material: 'Hardened dark steel console with photonic crystal display',
      function: 'Human interface for arming, monitoring, and deploying the false vacuum decay weapon',
      assemblyOrder: 13,
      connections: ['Warning Systems', 'Coleman Bounce Trajectory Visualizer', 'Containment Field Generators'],
      failureEffect: 'Cannot arm or deploy weapon; device remains in safe mode',
      cascadeFailures: [],
      originalPosition: { x: 6.5, y: -2.0, z: 0 },
      explodedPosition: { x: 14, y: -2, z: 0 }
    },
    {
      name: 'Hawking Radiation Detector Array',
      description: 'Six parabolic detector dishes monitoring for Hawking-like radiation from the bubble wall, confirming successful nucleation and measuring bubble expansion rate.',
      material: 'Aluminum parabolic reflectors with copper feed horns',
      function: 'Detects the characteristic thermal spectrum emitted by the accelerating domain wall, confirming the Unruh effect at the phase boundary',
      assemblyOrder: 14,
      connections: ['Control Interface', 'Coleman Bounce Trajectory Visualizer'],
      failureEffect: 'Cannot confirm successful nucleation; no expansion rate telemetry',
      cascadeFailures: ['Control Interface'],
      originalPosition: { x: 0, y: 3, z: 0 },
      explodedPosition: { x: 0, y: 14, z: 8 }
    },
    {
      name: 'Gravitational Lensing Rings',
      description: 'Eight concentric rings that visualize the spacetime distortion caused by the enormous energy density at the bubble wall. Rings warp as the bubble expands.',
      material: 'Photonic metamaterial stress indicators',
      function: 'Provide visual confirmation of spacetime curvature near the domain wall; serve as a gravitational wave antenna',
      assemblyOrder: 15,
      connections: ['True Vacuum Bubble', 'Phase Boundary Wall'],
      failureEffect: 'Loss of gravitational diagnostic data; cannot measure spacetime curvature',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -5, y: -10, z: 0 }
    },
    {
      name: 'Vacuum Energy Gauge',
      description: 'Holographic column displaying the local vacuum energy density in real-time. Shows the transition from false vacuum (high) to true vacuum (low/negative).',
      material: 'Borosilicate glass column with plasma energy indicator',
      function: 'Quantitative readout of local vacuum energy density; confirms phase transition completion',
      assemblyOrder: 16,
      connections: ['Control Interface', 'Nucleation Chamber'],
      failureEffect: 'No quantitative vacuum state information; cannot confirm detonation',
      cascadeFailures: [],
      originalPosition: { x: -6.5, y: 0, z: 0 },
      explodedPosition: { x: -14, y: 0, z: 0 }
    },
    {
      name: 'Topological Defect Indicators (Cosmic Strings)',
      description: 'Four simulated cosmic string remnants showing the topological defects that form during the symmetry-breaking phase transition as the bubble wall passes.',
      material: 'Visualized GUT-scale energy density filaments',
      function: 'Indicate the formation of topological defects (cosmic strings, domain walls, monopoles) during the phase transition, confirming correct symmetry breaking pattern',
      assemblyOrder: 17,
      connections: ['True Vacuum Bubble', 'Phase Boundary Wall'],
      failureEffect: 'Incorrect symmetry breaking pattern may lead to unexpected low-energy physics inside the bubble',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 8, z: 8 }
    }
  ];

  // ========================================================================
  // QUIZ QUESTIONS — PhD-level quantum field theory
  // ========================================================================
  const quizQuestions = [
    {
      question: 'In the Coleman-De Luccia formalism, the decay rate per unit volume of a metastable false vacuum is given by Γ/V ≈ A·e^(−B/ℏ), where B is the bounce action. What is the O(4)-symmetric bounce solution, and why must it satisfy the Euclidean equations of motion with specific boundary conditions (φ → φ_false as ρ → ∞)?',
      answer: 'The Coleman bounce is the O(4)-symmetric solution φ(ρ) to the Euclidean field equations d²φ/dρ² + (3/ρ)dφ/dρ = dV/dφ, where ρ = √(τ² + |x|²) is the four-dimensional Euclidean radius. The boundary conditions require φ → φ_false vacuum as ρ → ∞ (the field returns to the metastable minimum far from the nucleation center) and dφ/dρ = 0 at ρ = 0 (regularity at the origin). This solution represents the most probable escape path through the potential barrier via quantum tunneling, and its Euclidean action B = S_E[bounce] − S_E[false vacuum] determines the tunneling rate. The O(4) symmetry is proven to minimize the action among all possible bounce configurations (Coleman, Glaser, Martin theorem).',
      difficulty: 'PhD — Quantum Field Theory'
    },
    {
      question: 'Explain the thin-wall approximation for vacuum decay. Under what conditions is it valid, and how does the bounce action B simplify in this limit? Express B in terms of the surface tension σ, the energy density difference ε between the two vacua, and the bubble radius.',
      answer: 'The thin-wall approximation is valid when the energy density difference ε = V(φ_false) − V(φ_true) between the false and true vacua is much smaller than the height of the potential barrier separating them: ε << V_barrier. In this limit, the domain wall thickness is much smaller than the bubble radius R, and the bounce solution resembles a sharp step function. The bounce action becomes B = −(π²/2)εR⁴ + 2π²σR³, where σ = ∫dφ √(2V(φ)) is the surface tension (integrated across the wall). Extremizing gives R = 3σ/ε and B = 27π²σ⁴/(2ε³). When gravity is included (Coleman-De Luccia), the action is modified to B_CDL = B_flat / [1 − (R/2Λ)²]², where Λ is related to the cosmological horizon, and gravitational effects can either enhance or suppress tunneling.',
      difficulty: 'PhD — Quantum Field Theory / Cosmology'
    },
    {
      question: 'After nucleation, the true vacuum bubble wall accelerates outward. Show that in flat spacetime, the wall asymptotically approaches the speed of light, and explain why this makes false vacuum decay an irreversible, universe-destroying event. What determines the wall\'s equation of motion?',
      answer: 'After nucleation at the critical radius R_c = 3σ/ε, the bubble wall\'s equation of motion in flat spacetime follows from energy conservation: the volume energy gained (∝ R³ε) minus the surface energy cost (∝ R²σ) drives expansion. The wall\'s Lorentz factor γ grows as γ ≈ R/R_c for R >> R_c, so the wall velocity v = √(1 − 1/γ²) → c asymptotically. In the frame of an observer outside the bubble, the wall approaches at nearly the speed of light, meaning they receive essentially zero warning — they are destroyed before light from the bubble wall reaches them. The wall carries the full energy difference ε per unit volume as kinetic energy and surface energy, releasing it upon collision with matter. Inside the bubble, the fundamental constants of nature (particle masses, coupling constants) take their true vacuum values, which are incompatible with atoms, chemistry, or any known structure. This makes the event irreversible and total — no causal signal can outrun the wall to warn or prepare.',
      difficulty: 'PhD — General Relativity / Quantum Field Theory'
    },
    {
      question: 'The Higgs field potential in the Standard Model has been computed to high loop order and shows potential metastability. Explain the role of the top quark Yukawa coupling and the Higgs quartic coupling λ(μ) in determining whether our vacuum is truly stable, metastable, or unstable. What do current measurements suggest?',
      answer: 'The stability of the electroweak vacuum depends on the running of the Higgs quartic coupling λ(μ) with energy scale μ. At tree level, V(h) = λh⁴/4, but radiative corrections (primarily from the top quark loop, which enters with a negative sign proportional to −y_t⁴) cause λ(μ) to decrease at high energies. If λ(μ) crosses zero at some scale Λ_instability, the potential develops a deeper minimum at large field values, making our vacuum metastable. Current measurements (m_H ≈ 125.1 GeV, m_t ≈ 172.7 GeV) place us in the metastable region: λ(μ) crosses zero around μ ≈ 10^(10−12) GeV. However, the tunneling lifetime of our vacuum (≈ 10^(600) years) vastly exceeds the age of the universe (≈ 10^(10) years), so we are safe — unless something (like this weapon) artificially catalyzes the transition by providing the initial field configuration near the instability scale, effectively reducing the bounce action from ~10^(600) to ~O(1).',
      difficulty: 'PhD — Particle Physics / Cosmology'
    },
    {
      question: 'In the Coleman-De Luccia instanton including gravitational effects, the nucleation rate can be dramatically altered. Explain the "Great Divide" — the condition under which gravity completely suppresses vacuum decay — and derive the critical condition on the vacuum energy densities that determines whether gravity helps or hinders tunneling.',
      answer: 'When gravity is included, the Coleman-De Luccia bounce action becomes B_CDL = B_flat × [1/(1 − (R_0/2l_f)²)]² in the thin-wall limit, where R_0 = 3σ/ε is the flat-space critical radius and l_f = √(3/(8πGρ_f)) is the de Sitter horizon radius of the false vacuum. The "Great Divide" occurs at R_0 = 2l_f, i.e., when 3σ/ε = 2√(3/(8πGρ_f)). For R_0 < 2l_f, B_CDL > B_flat, meaning gravity suppresses tunneling (the gravitational self-energy of the bubble wall fights expansion). For R_0 > 2l_f, the formula breaks down and a different branch of solutions appears. Crucially, when the false vacuum has very high energy density (small l_f) and the true vacuum has negative cosmological constant, the CDL instanton may not exist at all — gravity creates an infinite barrier. This is the complete gravitational suppression regime. Conversely, when the true vacuum has zero or positive cosmological constant and ε is small, gravity typically enhances decay. The critical condition can be expressed as: σ² < (4/3)(ε/8πG)(3/8πGρ_f), relating the wall tension, energy split, and false vacuum energy density.',
      difficulty: 'PhD — Semiclassical Gravity / Quantum Cosmology'
    }
  ];

  // ========================================================================
  // DESCRIPTION
  // ========================================================================
  const description = `False Vacuum Decay Bomb (Ultra God Tier) — The most catastrophic weapon theoretically conceivable. This device exploits the metastability of the electroweak vacuum by artificially catalyzing a Coleman-De Luccia instanton: a quantum tunneling event that nucleates a bubble of true vacuum within our metastable false vacuum. Once nucleated above the critical radius, the bubble wall accelerates to nearly the speed of light, converting all matter and energy it encounters into the true vacuum ground state — where the laws of physics are fundamentally different. Atoms cannot exist, chemistry is impossible, and spacetime itself may be restructured. The device features a central nucleation chamber housing a topological defect seed crystal, six exotic energy concentrators that focus negative-energy-density beams to lower the tunneling barrier, Higgs field destabilizer coils tuned to the electroweak instability scale (~10^10 GeV), dark energy injectors, quantum tunneling catalyst rings maintaining macroscopic coherence, and a desperately-engineered containment field that holds the sub-critical bubble until intentional release. There is no defense against this weapon — the bubble wall travels at lightspeed, carrying the phase transition boundary. Once triggered, the destruction is total and irreversible, propagating outward at c until the entire future light cone of the detonation point has been converted to true vacuum.`;

  // ========================================================================
  // ANIMATE — extreme, highly synchronized animation
  // ========================================================================
  function animate(time, speed, refMeshes) {
    const t = time * speed;

    // 1. Nucleation seed crystal — rapid pulsing rotation
    if (meshes.nucleationSeed) {
      meshes.nucleationSeed.rotation.x = t * 3.0;
      meshes.nucleationSeed.rotation.y = t * 4.5;
      meshes.nucleationSeed.rotation.z = t * 2.7;
      const seedPulse = 0.8 + 0.4 * Math.sin(t * 8.0);
      meshes.nucleationSeed.scale.setScalar(seedPulse);
      meshes.nucleationSeed.material.emissiveIntensity = 3.0 + 2.0 * Math.sin(t * 12.0);
    }

    // 2. Seed cage rotation
    if (meshes.seedCage) {
      meshes.seedCage.rotation.x = -t * 1.5;
      meshes.seedCage.rotation.y = t * 2.0;
    }

    // 3. True vacuum bubble — breathing expansion
    if (meshes.trueVacuumBubble) {
      const bubbleScale = 0.5 + 0.3 * Math.sin(t * 0.8) + 0.15 * Math.sin(t * 2.3);
      meshes.trueVacuumBubble.scale.setScalar(bubbleScale);
      meshes.trueVacuumBubble.material.emissiveIntensity = 0.4 + 0.3 * Math.sin(t * 1.5);
    }

    // 4. Bubble wall — slightly larger, pulsing opacity
    if (meshes.bubbleWall) {
      const wallScale = 0.55 + 0.35 * Math.sin(t * 0.8) + 0.18 * Math.sin(t * 2.3);
      meshes.bubbleWall.scale.setScalar(wallScale);
      meshes.bubbleWall.material.opacity = 0.3 + 0.3 * Math.abs(Math.sin(t * 3.0));
      meshes.bubbleWall.material.emissiveIntensity = 2.0 + 1.5 * Math.sin(t * 4.0);
      meshes.bubbleWall.rotation.y = t * 0.5;
    }

    // 5. Shimmer layer
    if (meshes.shimmerLayer) {
      const shimScale = 0.6 + 0.4 * Math.sin(t * 0.8) + 0.2 * Math.sin(t * 2.3);
      meshes.shimmerLayer.scale.setScalar(shimScale);
      meshes.shimmerLayer.rotation.x = t * 0.3;
      meshes.shimmerLayer.rotation.z = -t * 0.2;
    }

    // 6. Debris particles — orbit and flicker at bubble wall
    if (meshes.debrisParticles) {
      const currentBubbleR = 0.55 + 0.35 * Math.sin(t * 0.8) + 0.18 * Math.sin(t * 2.3);
      meshes.debrisParticles.forEach(p => {
        const d = p.userData;
        const orbitAngle = d.theta + t * d.speed;
        const r = currentBubbleR + 0.05 + Math.abs(Math.sin(t * d.speed + d.phase)) * 0.3;
        p.position.set(
          r * Math.sin(d.phi) * Math.cos(orbitAngle),
          r * Math.sin(d.phi) * Math.sin(orbitAngle),
          r * Math.cos(d.phi)
        );
        p.rotation.x = t * d.speed * 2;
        p.rotation.y = t * d.speed * 3;
        // Flicker intensity
        p.material.opacity = 0.2 + 0.6 * Math.abs(Math.sin(t * d.speed * 5 + d.phase));
        p.material.emissiveIntensity = 1.0 + 3.0 * Math.abs(Math.sin(t * d.speed * 8 + d.phase));
      });
    }

    // 7. Energy beams — pulsing intensity
    if (meshes.energyBeams) {
      meshes.energyBeams.forEach((beam, i) => {
        beam.material.opacity = 0.3 + 0.5 * Math.abs(Math.sin(t * 3.0 + i * 1.0));
        beam.material.emissiveIntensity = 1.5 + 1.5 * Math.sin(t * 4.0 + i * 0.8);
      });
    }

    // 8. Containment fields — straining oscillation
    if (meshes.containmentPrimary) {
      const strain = 1.0 + 0.08 * Math.sin(t * 2.0) + 0.03 * Math.sin(t * 7.0);
      meshes.containmentPrimary.scale.setScalar(strain);
      meshes.containmentPrimary.rotation.y = t * 0.15;
      meshes.containmentPrimary.rotation.x = t * 0.08;
      meshes.containmentPrimary.material.opacity = 0.15 + 0.1 * Math.sin(t * 5.0);
    }
    if (meshes.containmentSecondary) {
      const strain2 = 1.0 + 0.05 * Math.sin(t * 2.5 + 0.5);
      meshes.containmentSecondary.scale.setScalar(strain2);
      meshes.containmentSecondary.rotation.y = -t * 0.12;
      meshes.containmentSecondary.rotation.z = t * 0.06;
    }

    // 9. Catalyst rings — orbital rotation at different rates
    if (meshes.catalystRings) {
      meshes.catalystRings.forEach((ring, i) => {
        ring.rotation.x += 0.005 * (i + 1) * speed;
        ring.rotation.y += 0.008 * (i + 1) * speed;
        ring.rotation.z += 0.003 * (5 - i) * speed;
      });
    }

    // 10. Warning lights — alternating flash pattern
    if (meshes.warningLights) {
      meshes.warningLights.forEach((light, i) => {
        const flash = Math.sin(t * 6.0 + i * (Math.PI / 4));
        light.material.emissiveIntensity = flash > 0 ? 4.0 : 0.2;
        light.material.opacity = flash > 0 ? 1.0 : 0.3;
      });
    }

    // 11. Coleman bounce trajectory — gentle rotation
    if (meshes.bounceTrajectory) {
      meshes.bounceTrajectory.rotation.y = t * 0.3;
      meshes.bounceTrajectory.material.opacity = 0.3 + 0.3 * Math.sin(t * 1.0);
    }

    // 12. Gravitational lensing rings — warping
    if (meshes.lensRings) {
      meshes.lensRings.forEach((ring, i) => {
        ring.rotation.z = Math.sin(t * 0.5 + i * 0.3) * 0.2;
        ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.3 + i * 0.5) * 0.15;
        const warp = 1.0 + 0.1 * Math.sin(t * 1.5 + i);
        ring.scale.set(warp, warp, 1.0);
      });
    }

    // 13. Control screen — flickering
    if (meshes.controlScreen) {
      meshes.controlScreen.material.emissiveIntensity = 1.5 + 1.0 * Math.sin(t * 10.0) + 0.5 * Math.sin(t * 23.0);
    }

    // 14. Energy level gauge — oscillating
    if (meshes.energyLevel) {
      const level = 1.0 + 0.8 * Math.sin(t * 0.5);
      meshes.energyLevel.scale.y = level;
      meshes.energyLevel.position.y = -1.0 + (level - 1.0) * 1.0;
      meshes.energyLevel.material.emissiveIntensity = 1.5 + 1.5 * Math.sin(t * 2.0);
    }

    // 15. Flow particles along conduits
    if (meshes.flowParticles && meshes.conduitPaths) {
      meshes.flowParticles.forEach(p => {
        const d = p.userData;
        d.t += d.speed * speed * 0.005;
        if (d.t > 1) d.t -= 1;
        const path = meshes.conduitPaths[d.conduitIdx];
        if (path) {
          const curve = new THREE.CatmullRomCurve3(path.map(v => v instanceof THREE.Vector3 ? v : new THREE.Vector3(v.x, v.y, v.z)));
          const pt = curve.getPoint(d.t);
          p.position.copy(pt);
          p.material.emissiveIntensity = 2.0 + 2.0 * Math.sin(t * 8.0 + d.t * 10.0);
        }
      });
    }

    // 16. Chamber lining pulse
    if (meshes.chamberLining) {
      meshes.chamberLining.material.emissiveIntensity = 1.0 + 1.2 * Math.sin(t * 3.0);
      meshes.chamberLining.material.opacity = 0.4 + 0.3 * Math.sin(t * 2.0);
    }

    // 17. Outer shell subtle breathing
    if (meshes.outerShell) {
      const breath = 1.0 + 0.01 * Math.sin(t * 1.0);
      meshes.outerShell.scale.setScalar(breath);
    }

    // 18. Cosmic strings — shimmering
    if (meshes.cosmicStrings) {
      meshes.cosmicStrings.forEach((s, i) => {
        s.material.opacity = 0.15 + 0.2 * Math.abs(Math.sin(t * 2.0 + i * 1.5));
        s.material.emissiveIntensity = 1.0 + 1.0 * Math.sin(t * 3.0 + i);
      });
    }

    // 19. Destabilizer coils — color cycling
    if (meshes.destabilizerCoils) {
      meshes.destabilizerCoils.forEach((coil, i) => {
        coil.material.emissiveIntensity = 0.8 + 1.0 * Math.sin(t * 4.0 + i * 2.0);
      });
    }

    // 20. Spacetime fabric deformation
    if (meshes.spacetimeFabric) {
      const posAttr = meshes.spacetimeFabric.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const dist = Math.sqrt(x * x + y * y);
        const waveZ = Math.sin(dist * 1.5 - t * 2.0) * 0.3 * Math.exp(-dist * 0.15);
        posAttr.setZ(i, waveZ);
      }
      posAttr.needsUpdate = true;
      meshes.spacetimeFabric.geometry.computeVertexNormals();
    }
  }

  // ========================================================================
  // RETURN
  // ========================================================================
  return { group, parts, description, quizQuestions, animate };
}
