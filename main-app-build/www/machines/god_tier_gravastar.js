// ============================================================================
// GOD TIER GRAVASTAR — Gravitational Vacuum Star
// Mazur-Mottola Compact Object: No Singularity, No Event Horizon
// Ultra-realistic THREE.js model with extreme animation & detail
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  group.name = 'GodTierGravastar';

  // ==========================================================================
  // CUSTOM MATERIALS — Exotic Physics Materials
  // ==========================================================================

  // Bose-Einstein Condensate Shell — ultra-stiff quantum matter
  const becShellMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a3e,
    metalness: 0.95,
    roughness: 0.08,
    emissive: 0x0a0a2f,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
  });

  // Inner BEC lattice glow — quantum coherence visualization
  const becLatticeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4444cc,
    metalness: 0.7,
    roughness: 0.15,
    emissive: 0x2222aa,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.6,
    wireframe: true,
  });

  // Phase Boundary Layer — thin shell of exotic matter (p = -ρ transition)
  const phaseBoundaryMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    metalness: 0.3,
    roughness: 0.1,
    emissive: 0x00ffaa,
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });

  // De Sitter Vacuum Core — dark energy interior (Λ > 0)
  const deSitterCoreMaterial = new THREE.MeshStandardMaterial({
    color: 0x000022,
    metalness: 0.1,
    roughness: 0.05,
    emissive: 0x110044,
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.5,
  });

  // Dark Energy Plasma — repulsive gravity visualization
  const darkEnergyPlasmaMaterial = new THREE.MeshStandardMaterial({
    color: 0x6600ff,
    metalness: 0.0,
    roughness: 0.0,
    emissive: 0x8800ff,
    emissiveIntensity: 2.0,
    transparent: true,
    opacity: 0.35,
  });

  // Gravitational Lensing Ring — photon sphere analog
  const lensingRingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    metalness: 0.6,
    roughness: 0.05,
    emissive: 0xff8800,
    emissiveIntensity: 1.8,
    transparent: true,
    opacity: 0.55,
  });

  // Accretion Disk material — superheated infalling matter
  const accretionDiskMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4400,
    metalness: 0.4,
    roughness: 0.1,
    emissive: 0xff2200,
    emissiveIntensity: 1.4,
    transparent: true,
    opacity: 0.65,
  });

  // Accretion inner ring — hotter, bluer emission near ISCO
  const accretionInnerMaterial = new THREE.MeshStandardMaterial({
    color: 0x4488ff,
    metalness: 0.5,
    roughness: 0.05,
    emissive: 0x2266ff,
    emissiveIntensity: 2.2,
    transparent: true,
    opacity: 0.5,
  });

  // Hawking-like radiation wisps (near-horizon quantum effects)
  const hawkingWispMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaddff,
    metalness: 0.0,
    roughness: 0.0,
    emissive: 0x88ccff,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.25,
  });

  // Ergosphere analog — frame-dragging visualization
  const ergosphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x003366,
    metalness: 0.2,
    roughness: 0.05,
    emissive: 0x004488,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  });

  // Quantum Fluctuation particle material
  const quantumParticleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.0,
    emissive: 0xffffff,
    emissiveIntensity: 3.0,
    transparent: true,
    opacity: 0.8,
  });

  // Stress-energy tensor field lines
  const stressEnergyMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    metalness: 0.1,
    roughness: 0.2,
    emissive: 0xcc00cc,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.4,
  });

  // Surface redshift glow — z → ∞ analog
  const redshiftGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.0,
    roughness: 0.0,
    emissive: 0xff0000,
    emissiveIntensity: 2.5,
    transparent: true,
    opacity: 0.3,
  });

  // Crust fracture/fissure glow
  const crustFissureMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    metalness: 0.8,
    roughness: 0.0,
    emissive: 0x00ddff,
    emissiveIntensity: 2.0,
    transparent: true,
    opacity: 0.7,
  });

  // Jet material — relativistic polar outflows
  const jetMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ccff,
    metalness: 0.0,
    roughness: 0.0,
    emissive: 0x00aaff,
    emissiveIntensity: 2.5,
    transparent: true,
    opacity: 0.35,
  });

  // ==========================================================================
  // MESHES STORAGE
  // ==========================================================================
  const meshes = {};

  // ==========================================================================
  // 1. DE SITTER VACUUM CORE — Dark Energy Interior
  // The heart of the gravastar: a region of de Sitter space with equation
  // of state p = -ρ (cosmological constant / dark energy).
  // ==========================================================================
  const coreGroup = new THREE.Group();
  coreGroup.name = 'DeSitterVacuumCore';

  // Main dark energy sphere
  const coreGeo = new THREE.SphereGeometry(2.8, 128, 128);
  const coreMesh = new THREE.Mesh(coreGeo, deSitterCoreMaterial);
  coreMesh.name = 'DarkEnergyCore';
  coreGroup.add(coreMesh);
  meshes.darkEnergyCore = coreMesh;

  // Dark energy plasma tendrils — swirling repulsive gravity visualization
  const plasmaTendrils = [];
  for (let i = 0; i < 12; i++) {
    const tendrilCurvePoints = [];
    const baseAngle = (i / 12) * Math.PI * 2;
    const segments = 40;
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const r = 0.3 + t * 2.2;
      const theta = baseAngle + t * Math.PI * 1.5 + Math.sin(t * 4) * 0.3;
      const phi = Math.PI * 0.3 + t * Math.PI * 0.4 + Math.cos(t * 3) * 0.2;
      tendrilCurvePoints.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      ));
    }
    const tendrilCurve = new THREE.CatmullRomCurve3(tendrilCurvePoints);
    const tendrilGeo = new THREE.TubeGeometry(tendrilCurve, 60, 0.04 + Math.random() * 0.06, 8, false);
    const tendrilMesh = new THREE.Mesh(tendrilGeo, darkEnergyPlasmaMaterial);
    tendrilMesh.name = `DarkEnergyTendril_${i}`;
    coreGroup.add(tendrilMesh);
    plasmaTendrils.push(tendrilMesh);
  }
  meshes.plasmaTendrils = plasmaTendrils;

  // Inner vacuum pulsation shells — concentric layers showing expansion
  const pulsationShells = [];
  for (let i = 0; i < 5; i++) {
    const shellRadius = 0.6 + i * 0.45;
    const shellGeo = new THREE.SphereGeometry(shellRadius, 48, 48);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x220066,
      metalness: 0.0,
      roughness: 0.0,
      emissive: 0x330088,
      emissiveIntensity: 0.5 + i * 0.2,
      transparent: true,
      opacity: 0.12 - i * 0.015,
      wireframe: true,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.name = `VacuumPulsationShell_${i}`;
    coreGroup.add(shellMesh);
    pulsationShells.push(shellMesh);
  }
  meshes.pulsationShells = pulsationShells;

  // Quantum fluctuation sparks inside the core
  const quantumSparks = [];
  for (let i = 0; i < 60; i++) {
    const sparkGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 8, 8);
    const sparkMesh = new THREE.Mesh(sparkGeo, quantumParticleMaterial);
    const r = Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    sparkMesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    sparkMesh.userData = {
      baseR: r, baseTheta: theta, basePhi: phi,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    };
    sparkMesh.name = `QuantumSpark_${i}`;
    coreGroup.add(sparkMesh);
    quantumSparks.push(sparkMesh);
  }
  meshes.quantumSparks = quantumSparks;

  group.add(coreGroup);
  meshes.coreGroup = coreGroup;

  // ==========================================================================
  // 2. PHASE BOUNDARY LAYER — The Exotic Matter Thin Shell
  // Transition layer where equation of state changes from p = -ρ (interior)
  // to p = +ρ (ultra-stiff BEC crust). This is the δ-function shell.
  // ==========================================================================
  const phaseBoundaryGroup = new THREE.Group();
  phaseBoundaryGroup.name = 'PhaseBoundaryLayer';

  // Primary phase boundary sphere
  const pbGeo = new THREE.SphereGeometry(3.05, 128, 128);
  const pbMesh = new THREE.Mesh(pbGeo, phaseBoundaryMaterial);
  pbMesh.name = 'PhaseBoundarySphere';
  phaseBoundaryGroup.add(pbMesh);
  meshes.phaseBoundary = pbMesh;

  // Phase transition ripple rings — surface oscillation modes
  const phaseRipples = [];
  for (let i = 0; i < 8; i++) {
    const rippleGeo = new THREE.TorusGeometry(3.08, 0.015, 8, 128);
    const rippleMat = new THREE.MeshStandardMaterial({
      color: 0x00ffdd,
      emissive: 0x00ffbb,
      emissiveIntensity: 1.2 + i * 0.1,
      transparent: true,
      opacity: 0.5,
      metalness: 0.0,
      roughness: 0.0,
    });
    const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
    const lat = -Math.PI / 2 + ((i + 1) / 9) * Math.PI;
    rippleMesh.position.y = 3.08 * Math.sin(lat);
    const ringRadius = 3.08 * Math.cos(lat);
    rippleMesh.scale.set(ringRadius / 3.08, ringRadius / 3.08, 1);
    rippleMesh.rotation.x = Math.PI / 2;
    rippleMesh.name = `PhaseRipple_${i}`;
    phaseBoundaryGroup.add(rippleMesh);
    phaseRipples.push(rippleMesh);
  }
  meshes.phaseRipples = phaseRipples;

  // Junction condition visualization — Israel junction lines
  const junctionLines = [];
  for (let i = 0; i < 20; i++) {
    const juncPoints = [];
    const startTheta = Math.random() * Math.PI * 2;
    const startPhi = Math.random() * Math.PI;
    for (let s = 0; s <= 30; s++) {
      const t = s / 30;
      const theta = startTheta + t * Math.PI * 0.5;
      const phi = startPhi + Math.sin(t * Math.PI * 2) * 0.3;
      const r = 3.04 + Math.sin(t * Math.PI * 6) * 0.02;
      juncPoints.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      ));
    }
    const juncCurve = new THREE.CatmullRomCurve3(juncPoints);
    const juncGeo = new THREE.TubeGeometry(juncCurve, 30, 0.008, 6, false);
    const juncMat = new THREE.MeshStandardMaterial({
      color: 0x88ffee,
      emissive: 0x44ffcc,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.6,
      metalness: 0.0,
      roughness: 0.0,
    });
    const juncMesh = new THREE.Mesh(juncGeo, juncMat);
    juncMesh.name = `JunctionLine_${i}`;
    phaseBoundaryGroup.add(juncMesh);
    junctionLines.push(juncMesh);
  }
  meshes.junctionLines = junctionLines;

  group.add(phaseBoundaryGroup);
  meshes.phaseBoundaryGroup = phaseBoundaryGroup;

  // ==========================================================================
  // 3. BOSE-EINSTEIN CONDENSATE OUTER CRUST
  // Ultra-stiff matter shell with equation of state p = +ρ
  // Supports itself against gravitational collapse via quantum degeneracy pressure
  // ==========================================================================
  const crustGroup = new THREE.Group();
  crustGroup.name = 'BECOuterCrust';

  // Main crust shell — icosahedron-based for faceted quantum crystal appearance
  const crustGeo = new THREE.IcosahedronGeometry(3.5, 5);
  const crustMesh = new THREE.Mesh(crustGeo, becShellMaterial);
  crustMesh.name = 'BECCrustShell';
  crustGroup.add(crustMesh);
  meshes.crustShell = crustMesh;

  // BEC lattice wireframe overlay — quantum coherence grid
  const latticeGeo = new THREE.IcosahedronGeometry(3.52, 3);
  const latticeMesh = new THREE.Mesh(latticeGeo, becLatticeMaterial);
  latticeMesh.name = 'BECLatticeOverlay';
  crustGroup.add(latticeMesh);
  meshes.becLattice = latticeMesh;

  // Crust fissures — glowing cracks showing internal energy
  const crustFissures = [];
  for (let i = 0; i < 16; i++) {
    const fissurePoints = [];
    const fStartTheta = Math.random() * Math.PI * 2;
    const fStartPhi = 0.3 + Math.random() * 2.4;
    for (let s = 0; s <= 25; s++) {
      const t = s / 25;
      const theta = fStartTheta + t * (0.5 + Math.random() * 0.5);
      const phi = fStartPhi + Math.sin(t * Math.PI * 3) * 0.15;
      const r = 3.49 + Math.sin(t * Math.PI * 8) * 0.015;
      fissurePoints.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      ));
    }
    const fCurve = new THREE.CatmullRomCurve3(fissurePoints);
    const fGeo = new THREE.TubeGeometry(fCurve, 25, 0.012, 6, false);
    const fMesh = new THREE.Mesh(fGeo, crustFissureMaterial);
    fMesh.name = `CrustFissure_${i}`;
    crustGroup.add(fMesh);
    crustFissures.push(fMesh);
  }
  meshes.crustFissures = crustFissures;

  // Crust hexagonal plates — tiled surface detail
  const hexPlates = [];
  for (let i = 0; i < 40; i++) {
    const hexShape = new THREE.Shape();
    const hexR = 0.15 + Math.random() * 0.12;
    for (let h = 0; h < 6; h++) {
      const angle = (h / 6) * Math.PI * 2;
      const hx = hexR * Math.cos(angle);
      const hy = hexR * Math.sin(angle);
      if (h === 0) hexShape.moveTo(hx, hy);
      else hexShape.lineTo(hx, hy);
    }
    hexShape.closePath();
    const hexExtrudeSettings = { depth: 0.02, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2 };
    const hexGeo = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);
    const hexMat = new THREE.MeshStandardMaterial({
      color: 0x222255,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x111144,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const hexMesh = new THREE.Mesh(hexGeo, hexMat);
    // Position on sphere surface
    const hTheta = Math.random() * Math.PI * 2;
    const hPhi = 0.2 + Math.random() * 2.6;
    const hR = 3.51;
    hexMesh.position.set(
      hR * Math.sin(hPhi) * Math.cos(hTheta),
      hR * Math.cos(hPhi),
      hR * Math.sin(hPhi) * Math.sin(hTheta)
    );
    hexMesh.lookAt(0, 0, 0);
    hexMesh.name = `HexPlate_${i}`;
    crustGroup.add(hexMesh);
    hexPlates.push(hexMesh);
  }
  meshes.hexPlates = hexPlates;

  // Crust nodules — quantum vortex pinning sites
  const crustNodules = [];
  for (let i = 0; i < 30; i++) {
    const nodGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 12, 12);
    const nodMat = new THREE.MeshStandardMaterial({
      color: 0x5555ff,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x3333cc,
      emissiveIntensity: 0.6,
    });
    const nodMesh = new THREE.Mesh(nodGeo, nodMat);
    const nTheta = Math.random() * Math.PI * 2;
    const nPhi = Math.random() * Math.PI;
    const nR = 3.52;
    nodMesh.position.set(
      nR * Math.sin(nPhi) * Math.cos(nTheta),
      nR * Math.cos(nPhi),
      nR * Math.sin(nPhi) * Math.sin(nTheta)
    );
    nodMesh.name = `VortexPinningSite_${i}`;
    crustGroup.add(nodMesh);
    crustNodules.push(nodMesh);
  }
  meshes.crustNodules = crustNodules;

  group.add(crustGroup);
  meshes.crustGroup = crustGroup;

  // ==========================================================================
  // 4. SURFACE REDSHIFT GLOW — Near-Horizon Behavior
  // The gravastar surface has extreme gravitational redshift (z → ∞ as
  // compactness → 2M/R = 1), mimicking a black hole to distant observers.
  // ==========================================================================
  const redshiftGroup = new THREE.Group();
  redshiftGroup.name = 'SurfaceRedshiftGlow';

  // Inner redshift glow shell
  const rsGlowGeo = new THREE.SphereGeometry(3.58, 96, 96);
  const rsGlowMesh = new THREE.Mesh(rsGlowGeo, redshiftGlowMaterial);
  rsGlowMesh.name = 'RedshiftGlowSphere';
  redshiftGroup.add(rsGlowMesh);
  meshes.redshiftGlow = rsGlowMesh;

  // Redshift gradient rings — showing z increasing toward surface
  const redshiftRings = [];
  for (let i = 0; i < 12; i++) {
    const rrRadius = 3.6 + i * 0.08;
    const rrGeo = new THREE.TorusGeometry(rrRadius, 0.01, 6, 128);
    const intensity = 1.0 - i * 0.07;
    const rrMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.0 + i * 0.01, 1.0, 0.4),
      emissive: new THREE.Color().setHSL(0.0 + i * 0.015, 1.0, 0.3),
      emissiveIntensity: intensity * 2,
      transparent: true,
      opacity: intensity * 0.4,
      metalness: 0.0,
      roughness: 0.0,
    });
    const rrMesh = new THREE.Mesh(rrGeo, rrMat);
    rrMesh.rotation.x = Math.PI / 2;
    rrMesh.name = `RedshiftRing_${i}`;
    redshiftGroup.add(rrMesh);
    redshiftRings.push(rrMesh);
  }
  meshes.redshiftRings = redshiftRings;

  group.add(redshiftGroup);
  meshes.redshiftGroup = redshiftGroup;

  // ==========================================================================
  // 5. ERGOSPHERE ANALOG — Frame-Dragging Region
  // If the gravastar is rotating, there's an ergosphere analog where
  // spacetime is dragged along with the rotation (Lense-Thirring effect).
  // ==========================================================================
  const ergoGroup = new THREE.Group();
  ergoGroup.name = 'ErgosphereAnalog';

  // Oblate ergosphere shell
  const ergoGeo = new THREE.SphereGeometry(4.2, 64, 64);
  const ergoMesh = new THREE.Mesh(ergoGeo, ergosphereMaterial);
  ergoMesh.scale.set(1.0, 0.75, 1.0); // Oblate due to rotation
  ergoMesh.name = 'ErgosphereSurface';
  ergoGroup.add(ergoMesh);
  meshes.ergosphere = ergoMesh;

  // Frame-dragging flow lines — spiraling around the object
  const frameDragLines = [];
  for (let i = 0; i < 8; i++) {
    const fdPoints = [];
    const fdBaseAngle = (i / 8) * Math.PI * 2;
    for (let s = 0; s <= 80; s++) {
      const t = s / 80;
      const theta = fdBaseAngle + t * Math.PI * 4;
      const phi = Math.PI * 0.3 + t * Math.PI * 0.4;
      const r = 3.7 + Math.sin(t * Math.PI * 2) * 0.3;
      fdPoints.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.75,
        r * Math.sin(phi) * Math.sin(theta)
      ));
    }
    const fdCurve = new THREE.CatmullRomCurve3(fdPoints);
    const fdGeo = new THREE.TubeGeometry(fdCurve, 80, 0.015, 6, false);
    const fdMat = new THREE.MeshStandardMaterial({
      color: 0x0066cc,
      emissive: 0x0044aa,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.35,
      metalness: 0.0,
      roughness: 0.0,
    });
    const fdMesh = new THREE.Mesh(fdGeo, fdMat);
    fdMesh.name = `FrameDragLine_${i}`;
    ergoGroup.add(fdMesh);
    frameDragLines.push(fdMesh);
  }
  meshes.frameDragLines = frameDragLines;

  group.add(ergoGroup);
  meshes.ergoGroup = ergoGroup;

  // ==========================================================================
  // 6. GRAVITATIONAL LENSING — Photon Sphere Analog
  // Light rays passing close to the gravastar are severely bent,
  // creating Einstein rings and multiple images.
  // ==========================================================================
  const lensingGroup = new THREE.Group();
  lensingGroup.name = 'GravitationalLensing';

  // Photon sphere — unstable circular orbits for light at r = 3M
  const photonSphereGeo = new THREE.SphereGeometry(4.6, 64, 64);
  const photonSphereMat = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    metalness: 0.0,
    roughness: 0.0,
    emissive: 0xffaa00,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.08,
    wireframe: true,
  });
  const photonSphereMesh = new THREE.Mesh(photonSphereGeo, photonSphereMat);
  photonSphereMesh.name = 'PhotonSphere';
  lensingGroup.add(photonSphereMesh);
  meshes.photonSphere = photonSphereMesh;

  // Einstein ring — primary lensing ring
  const einsteinRingGeo = new THREE.TorusGeometry(5.0, 0.06, 16, 128);
  const einsteinRingMesh = new THREE.Mesh(einsteinRingGeo, lensingRingMaterial);
  einsteinRingMesh.rotation.x = Math.PI / 2;
  einsteinRingMesh.name = 'EinsteinRing';
  lensingGroup.add(einsteinRingMesh);
  meshes.einsteinRing = einsteinRingMesh;

  // Secondary and tertiary lensing rings
  const lensingSubRings = [];
  for (let i = 0; i < 4; i++) {
    const lsrGeo = new THREE.TorusGeometry(4.7 + i * 0.12, 0.02, 8, 128);
    const lsrMat = new THREE.MeshStandardMaterial({
      color: 0xffdd44,
      emissive: 0xffcc22,
      emissiveIntensity: 1.0 - i * 0.2,
      transparent: true,
      opacity: 0.4 - i * 0.08,
      metalness: 0.0,
      roughness: 0.0,
    });
    const lsrMesh = new THREE.Mesh(lsrGeo, lsrMat);
    lsrMesh.rotation.x = Math.PI / 2 + (i - 1.5) * 0.05;
    lsrMesh.rotation.z = i * 0.08;
    lsrMesh.name = `LensingSubRing_${i}`;
    lensingGroup.add(lsrMesh);
    lensingSubRings.push(lsrMesh);
  }
  meshes.lensingSubRings = lensingSubRings;

  // Bent light ray paths — showing geodesic deflection
  const bentRays = [];
  for (let i = 0; i < 10; i++) {
    const rayPoints = [];
    const impactParam = 4.5 + i * 0.15;
    const rayAngle = (i / 10) * Math.PI * 2;
    for (let s = 0; s <= 50; s++) {
      const t = (s / 50) * Math.PI;
      const deflection = 2.0 / impactParam;
      const x = impactParam * Math.cos(t + deflection * Math.sin(t));
      const z = impactParam * Math.sin(t + deflection * Math.sin(t));
      const y = Math.sin(rayAngle) * 0.5 * Math.sin(t);
      rayPoints.push(new THREE.Vector3(x, y, z));
    }
    const rayCurve = new THREE.CatmullRomCurve3(rayPoints);
    const rayGeo = new THREE.TubeGeometry(rayCurve, 50, 0.008, 4, false);
    const rayMat = new THREE.MeshStandardMaterial({
      color: 0xffff88,
      emissive: 0xffff44,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.3,
      metalness: 0.0,
      roughness: 0.0,
    });
    const rayMesh = new THREE.Mesh(rayGeo, rayMat);
    rayMesh.rotation.y = rayAngle;
    rayMesh.name = `BentLightRay_${i}`;
    lensingGroup.add(rayMesh);
    bentRays.push(rayMesh);
  }
  meshes.bentRays = bentRays;

  group.add(lensingGroup);
  meshes.lensingGroup = lensingGroup;

  // ==========================================================================
  // 7. ACCRETION DISK — Infalling Matter
  // Superheated plasma spiraling inward, creating thermal emission
  // ==========================================================================
  const accretionGroup = new THREE.Group();
  accretionGroup.name = 'AccretionDisk';

  // Main accretion disk — multi-layered torus structure
  for (let layer = 0; layer < 5; layer++) {
    const diskInner = 5.5 + layer * 0.6;
    const diskOuter = 6.0 + layer * 0.8;
    const diskGeo = new THREE.RingGeometry(diskInner, diskOuter, 128, 4);
    const hue = 0.08 - layer * 0.015;
    const diskMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(hue, 1.0, 0.4),
      emissive: new THREE.Color().setHSL(hue, 1.0, 0.3),
      emissiveIntensity: 1.5 - layer * 0.2,
      transparent: true,
      opacity: 0.6 - layer * 0.08,
      metalness: 0.3,
      roughness: 0.1,
      side: THREE.DoubleSide,
    });
    const diskMesh = new THREE.Mesh(diskGeo, diskMat);
    diskMesh.rotation.x = -Math.PI / 2 + layer * 0.02;
    diskMesh.position.y = (layer - 2) * 0.05;
    diskMesh.name = `AccretionLayer_${layer}`;
    accretionGroup.add(diskMesh);
  }

  // Inner hot ring — ISCO (Innermost Stable Circular Orbit)
  const iscoGeo = new THREE.TorusGeometry(4.8, 0.12, 16, 128);
  const iscoMesh = new THREE.Mesh(iscoGeo, accretionInnerMaterial);
  iscoMesh.rotation.x = Math.PI / 2;
  iscoMesh.name = 'ISCORing';
  accretionGroup.add(iscoMesh);
  meshes.iscoRing = iscoMesh;

  // Accretion spiral arms — matter infall streams
  const spiralArms = [];
  for (let arm = 0; arm < 3; arm++) {
    const spiralPoints = [];
    const armOffset = (arm / 3) * Math.PI * 2;
    for (let s = 0; s <= 100; s++) {
      const t = s / 100;
      const r = 5.0 + t * 5.0;
      const theta = armOffset + t * Math.PI * 3;
      spiralPoints.push(new THREE.Vector3(
        r * Math.cos(theta),
        Math.sin(t * Math.PI * 4) * 0.15,
        r * Math.sin(theta)
      ));
    }
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
    const spiralGeo = new THREE.TubeGeometry(spiralCurve, 100, 0.06 + arm * 0.02, 8, false);
    const spiralMesh = new THREE.Mesh(spiralGeo, accretionDiskMaterial);
    spiralMesh.name = `SpiralArm_${arm}`;
    accretionGroup.add(spiralMesh);
    spiralArms.push(spiralMesh);
  }
  meshes.spiralArms = spiralArms;

  // Hot accretion clumps — density inhomogeneities
  const accretionClumps = [];
  for (let i = 0; i < 25; i++) {
    const clumpGeo = new THREE.SphereGeometry(0.06 + Math.random() * 0.08, 8, 8);
    const clumpMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff4400,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 0.7,
      metalness: 0.0,
      roughness: 0.0,
    });
    const clumpMesh = new THREE.Mesh(clumpGeo, clumpMat);
    const clumpAngle = Math.random() * Math.PI * 2;
    const clumpR = 5.5 + Math.random() * 4;
    clumpMesh.position.set(
      clumpR * Math.cos(clumpAngle),
      (Math.random() - 0.5) * 0.3,
      clumpR * Math.sin(clumpAngle)
    );
    clumpMesh.userData = { angle: clumpAngle, radius: clumpR, speed: 0.2 + Math.random() * 0.5 };
    clumpMesh.name = `AccretionClump_${i}`;
    accretionGroup.add(clumpMesh);
    accretionClumps.push(clumpMesh);
  }
  meshes.accretionClumps = accretionClumps;

  group.add(accretionGroup);
  meshes.accretionGroup = accretionGroup;

  // ==========================================================================
  // 8. RELATIVISTIC JETS — Polar Outflows
  // Collimated beams of plasma launched along the rotation axis
  // ==========================================================================
  const jetsGroup = new THREE.Group();
  jetsGroup.name = 'RelativisticJets';

  for (let sign = -1; sign <= 1; sign += 2) {
    const jetSubGroup = new THREE.Group();
    jetSubGroup.name = sign > 0 ? 'NorthJet' : 'SouthJet';

    // Jet cone — main body
    const jetConeGeo = new THREE.ConeGeometry(0.8, 8, 32, 16, true);
    const jetConeMesh = new THREE.Mesh(jetConeGeo, jetMaterial);
    jetConeMesh.position.y = sign * 7;
    jetConeMesh.rotation.z = sign > 0 ? 0 : Math.PI;
    jetConeMesh.name = `JetCone_${sign > 0 ? 'N' : 'S'}`;
    jetSubGroup.add(jetConeMesh);

    // Jet internal helix — magnetic field structure
    const helixPoints = [];
    for (let s = 0; s <= 120; s++) {
      const t = s / 120;
      const y = sign * (3.5 + t * 8);
      const r = 0.2 + t * 0.6;
      const theta = t * Math.PI * 8;
      helixPoints.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
    }
    const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
    const helixGeo = new THREE.TubeGeometry(helixCurve, 120, 0.025, 6, false);
    const helixMat = new THREE.MeshStandardMaterial({
      color: 0x44ddff,
      emissive: 0x22bbff,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.5,
      metalness: 0.0,
      roughness: 0.0,
    });
    const helixMesh = new THREE.Mesh(helixGeo, helixMat);
    helixMesh.name = `JetHelix_${sign > 0 ? 'N' : 'S'}`;
    jetSubGroup.add(helixMesh);

    // Jet knots — shock regions in the outflow
    for (let k = 0; k < 5; k++) {
      const knotGeo = new THREE.SphereGeometry(0.12 + k * 0.04, 12, 12);
      const knotMat = new THREE.MeshStandardMaterial({
        color: 0x88eeff,
        emissive: 0x66ccff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6,
        metalness: 0.0,
        roughness: 0.0,
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      knotMesh.position.y = sign * (4 + k * 1.8);
      knotMesh.name = `JetKnot_${sign > 0 ? 'N' : 'S'}_${k}`;
      jetSubGroup.add(knotMesh);
    }

    jetsGroup.add(jetSubGroup);
  }

  group.add(jetsGroup);
  meshes.jetsGroup = jetsGroup;

  // ==========================================================================
  // 9. STRESS-ENERGY TENSOR FIELD VISUALIZATION
  // Shows the Tμν distribution around the gravastar
  // ==========================================================================
  const stressEnergyGroup = new THREE.Group();
  stressEnergyGroup.name = 'StressEnergyField';

  const fieldLines = [];
  for (let i = 0; i < 12; i++) {
    const flPoints = [];
    const flTheta = (i / 12) * Math.PI * 2;
    for (let s = 0; s <= 60; s++) {
      const t = s / 60;
      const r = 3.6 + t * 4;
      const deflection = 0.5 * Math.exp(-t * 2);
      flPoints.push(new THREE.Vector3(
        r * Math.cos(flTheta + deflection),
        Math.sin(t * Math.PI) * deflection * 2,
        r * Math.sin(flTheta + deflection)
      ));
    }
    const flCurve = new THREE.CatmullRomCurve3(flPoints);
    const flGeo = new THREE.TubeGeometry(flCurve, 60, 0.01, 4, false);
    const flMesh = new THREE.Mesh(flGeo, stressEnergyMaterial);
    flMesh.name = `StressEnergyLine_${i}`;
    stressEnergyGroup.add(flMesh);
    fieldLines.push(flMesh);
  }
  meshes.fieldLines = fieldLines;

  group.add(stressEnergyGroup);
  meshes.stressEnergyGroup = stressEnergyGroup;

  // ==========================================================================
  // 10. HAWKING-LIKE RADIATION WISPS
  // Quantum vacuum fluctuations near the surface
  // ==========================================================================
  const hawkingGroup = new THREE.Group();
  hawkingGroup.name = 'HawkingRadiationWisps';

  const hawkingWisps = [];
  for (let i = 0; i < 20; i++) {
    const wispPoints = [];
    const wTheta = Math.random() * Math.PI * 2;
    const wPhi = Math.random() * Math.PI;
    const startR = 3.55;
    for (let s = 0; s <= 20; s++) {
      const t = s / 20;
      const r = startR + t * 2;
      const dTheta = wTheta + t * 0.3 * (Math.random() - 0.5);
      const dPhi = wPhi + t * 0.2 * (Math.random() - 0.5);
      wispPoints.push(new THREE.Vector3(
        r * Math.sin(dPhi) * Math.cos(dTheta),
        r * Math.cos(dPhi),
        r * Math.sin(dPhi) * Math.sin(dTheta)
      ));
    }
    const wispCurve = new THREE.CatmullRomCurve3(wispPoints);
    const wispGeo = new THREE.TubeGeometry(wispCurve, 20, 0.008, 4, false);
    const wispMesh = new THREE.Mesh(wispGeo, hawkingWispMaterial);
    wispMesh.name = `HawkingWisp_${i}`;
    hawkingGroup.add(wispMesh);
    hawkingWisps.push(wispMesh);
  }
  meshes.hawkingWisps = hawkingWisps;

  group.add(hawkingGroup);
  meshes.hawkingGroup = hawkingGroup;

  // ==========================================================================
  // 11. GRAVITATIONAL WAVE RIPPLES — Spacetime Distortion Visualization
  // ==========================================================================
  const gwGroup = new THREE.Group();
  gwGroup.name = 'GravitationalWaveRipples';

  const gwRipples = [];
  for (let i = 0; i < 6; i++) {
    const gwGeo = new THREE.TorusGeometry(5 + i * 1.5, 0.02, 6, 128);
    const gwMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      emissive: 0x666666,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.15 - i * 0.02,
      metalness: 0.0,
      roughness: 0.0,
      side: THREE.DoubleSide,
    });
    const gwMesh = new THREE.Mesh(gwGeo, gwMat);
    gwMesh.rotation.x = Math.PI / 2;
    gwMesh.name = `GWRipple_${i}`;
    gwGroup.add(gwMesh);
    gwRipples.push(gwMesh);
  }
  meshes.gwRipples = gwRipples;

  group.add(gwGroup);
  meshes.gwGroup = gwGroup;

  // ==========================================================================
  // 12. INTERIOR CAUCHY HORIZON MARKER & PENROSE DIAGRAM ELEMENTS
  // ==========================================================================
  const cauchyGroup = new THREE.Group();
  cauchyGroup.name = 'CauchyHorizonAnalog';

  // Cauchy surface — a sphere just inside the BEC crust
  const cauchyGeo = new THREE.SphereGeometry(3.2, 48, 48);
  const cauchyMat = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xaaaa00,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.1,
    wireframe: true,
    metalness: 0.0,
    roughness: 0.0,
  });
  const cauchyMesh = new THREE.Mesh(cauchyGeo, cauchyMat);
  cauchyMesh.name = 'CauchySurface';
  cauchyGroup.add(cauchyMesh);
  meshes.cauchySurface = cauchyMesh;

  group.add(cauchyGroup);
  meshes.cauchyGroup = cauchyGroup;

  // ==========================================================================
  // PARTS ARRAY — Detailed engineering/physics breakdown
  // ==========================================================================
  const parts = [
    {
      name: 'De Sitter Vacuum Core',
      description: 'The interior region filled with dark energy (cosmological constant Λ > 0), described by de Sitter spacetime with equation of state p = -ρ. This repulsive gravitational interior prevents singularity formation.',
      material: 'Dark Energy Vacuum (Λ-CDM cosmological constant)',
      function: 'Provides the repulsive (anti-gravitational) pressure that supports the gravastar from the inside, replacing the classical singularity with a smooth de Sitter manifold.',
      assemblyOrder: 1,
      connections: ['Phase Boundary Layer'],
      failureEffect: 'If Λ decreases below critical value, interior cannot sustain pressure against the crust, leading to gravitational collapse toward a classical black hole singularity.',
      cascadeFailures: ['Phase Boundary Layer', 'BEC Outer Crust'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'Dark Energy Plasma Tendrils',
      description: 'Visualization of the vacuum energy density fluctuations within the de Sitter core. These represent quantum field excitations of the cosmological constant at Planck-scale densities.',
      material: 'Quantum vacuum fluctuations (ρ_Λ ≈ 10⁹³ g/cm³)',
      function: 'Transport vacuum energy throughout the interior, maintaining isotropic and homogeneous dark energy distribution consistent with de Sitter symmetry (SO(4,1) invariance).',
      assemblyOrder: 2,
      connections: ['De Sitter Vacuum Core', 'Phase Boundary Layer'],
      failureEffect: 'Anisotropic vacuum energy distribution would break de Sitter symmetry, potentially creating interior shear stresses and dynamic instability.',
      cascadeFailures: ['De Sitter Vacuum Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -4, z: 0 },
    },
    {
      name: 'Phase Boundary Layer',
      description: 'An infinitesimally thin shell of exotic matter at radius r₀ where the equation of state transitions from p = -ρ (interior) to p = +ρ (crust). Described by Israel junction conditions on the spacetime metric.',
      material: 'Exotic matter with negative surface energy density (violates Weak Energy Condition locally)',
      function: 'Mediates the discontinuous phase transition between de Sitter interior and Schwarzschild-like exterior. The Israel-Darmois junction conditions determine its surface stress-energy tensor S_ab.',
      assemblyOrder: 3,
      connections: ['De Sitter Vacuum Core', 'BEC Outer Crust'],
      failureEffect: 'Junction condition violation leads to metric discontinuity — spacetime itself becomes ill-defined at the boundary, causing catastrophic structural failure.',
      cascadeFailures: ['De Sitter Vacuum Core', 'BEC Outer Crust', 'Surface Redshift Layer'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -2, z: 0 },
    },
    {
      name: 'Phase Transition Ripples',
      description: 'Oscillation modes of the phase boundary representing quasi-normal mode (QNM) ringing of the gravastar. These are the gravitational wave signatures that distinguish gravastars from black holes.',
      material: 'Spacetime curvature oscillations (metric perturbations h_μν)',
      function: 'Encode the quasi-normal mode spectrum: ω = ω_R + iω_I. The real part gives oscillation frequency, imaginary part gives damping. Different QNM spectrum than Kerr black holes.',
      assemblyOrder: 4,
      connections: ['Phase Boundary Layer'],
      failureEffect: 'Unstable QNMs (ω_I > 0) would cause exponential growth of perturbations, destroying the phase boundary through a runaway instability.',
      cascadeFailures: ['Phase Boundary Layer', 'BEC Outer Crust'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 3, y: -2, z: 0 },
    },
    {
      name: 'BEC Outer Crust',
      description: 'Ultra-stiff matter shell composed of a Bose-Einstein condensate with equation of state p = +ρ (maximally stiff, causal limit). Occupies the thin region between phase boundary and surface.',
      material: 'Bose-Einstein Condensate (macroscopic quantum state, T ~ 0 K, p = +ρc²)',
      function: 'Provides the gravitational mass and surface for the compact object. The ultra-stiff EoS (sound speed = c) supports maximum compactness 2M/R → 1 without horizon formation.',
      assemblyOrder: 5,
      connections: ['Phase Boundary Layer', 'Surface Redshift Layer', 'Ergosphere Analog'],
      failureEffect: 'BEC decoherence from thermal perturbation would soften the EoS, reducing maximum sustainable compactness and potentially triggering horizon formation.',
      cascadeFailures: ['Phase Boundary Layer', 'Surface Redshift Layer'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 3, z: 0 },
    },
    {
      name: 'BEC Quantum Lattice',
      description: 'Wireframe visualization of the long-range quantum coherence in the condensate. All bosonic constituents occupy the same quantum ground state, creating macroscopic quantum behavior.',
      material: 'Cooper-pair condensate / scalar field φ with U(1) symmetry',
      function: 'Maintains quantum phase coherence across the entire shell, enabling superfluidity and quantized vortex lines that pin to the crust lattice sites.',
      assemblyOrder: 6,
      connections: ['BEC Outer Crust', 'Vortex Pinning Sites'],
      failureEffect: 'Loss of phase coherence destroys superfluidity, allowing viscous dissipation that heats the crust and disrupts the condensate state.',
      cascadeFailures: ['BEC Outer Crust'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 4, z: 0 },
    },
    {
      name: 'Crust Fissures',
      description: 'Glowing fractures in the BEC crust revealing the underlying phase boundary energy. Analogous to starquakes on neutron stars but occurring in a quantum condensate medium.',
      material: 'Exposed phase transition radiation (kT ~ GeV)',
      function: 'Release accumulated stress-energy from differential rotation and tidal forces. Each fissure event produces a burst of gravitational waves with characteristic gravastar QNM spectrum.',
      assemblyOrder: 7,
      connections: ['BEC Outer Crust', 'Phase Boundary Layer'],
      failureEffect: 'Runaway fissuring could compromise crust structural integrity, potentially exposing the phase boundary to external accretion and disrupting the three-layer structure.',
      cascadeFailures: ['BEC Outer Crust'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -3, y: 3, z: 0 },
    },
    {
      name: 'Surface Redshift Layer',
      description: 'Region of extreme gravitational redshift near the gravastar surface. For compactness 2M/R → 1, the surface redshift z_s → ∞, making the object indistinguishable from a black hole observationally.',
      material: 'Gravitationally redshifted photon field',
      function: 'Creates the observational mimicry of a black hole event horizon. Photons emitted from the surface are infinitely redshifted, making the surface effectively dark to distant observers.',
      assemblyOrder: 8,
      connections: ['BEC Outer Crust', 'Photon Sphere'],
      failureEffect: 'Reduced compactness would lower surface redshift, potentially making the surface visible and distinguishable from a black hole — an observational signature.',
      cascadeFailures: ['Photon Sphere', 'Gravitational Lensing Rings'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 5, z: 0 },
    },
    {
      name: 'Ergosphere Analog',
      description: 'For a rotating gravastar (Kerr-like metric), the region outside the surface where frame-dragging forces all observers to co-rotate. The Lense-Thirring effect creates an oblate dragging region.',
      material: 'Dragged spacetime (g_tφ ≠ 0 metric component)',
      function: 'Enables Penrose process energy extraction: particles entering the ergosphere can split, with one fragment carrying negative energy into the object and the other escaping with energy > m₀c².',
      assemblyOrder: 9,
      connections: ['BEC Outer Crust', 'Accretion Disk'],
      failureEffect: 'Spin-down from Penrose process or superradiant scattering would shrink the ergosphere, reducing energy extraction efficiency.',
      cascadeFailures: ['Accretion Disk'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 4, y: 0, z: 0 },
    },
    {
      name: 'Photon Sphere',
      description: 'Unstable circular photon orbit at r = 3M (for Schwarzschild-like exterior). Light can orbit the gravastar multiple times before escaping or being captured.',
      material: 'Null geodesic congruence (ds² = 0 surface)',
      function: 'Creates the shadow boundary in Event Horizon Telescope-type observations. The photon sphere radius determines the apparent angular size of the gravastar shadow.',
      assemblyOrder: 10,
      connections: ['Surface Redshift Layer', 'Einstein Ring', 'Accretion Disk'],
      failureEffect: 'Perturbation of the photon sphere would alter the shadow morphology — potentially distinguishable from Kerr black hole shadow via precision interferometry.',
      cascadeFailures: ['Einstein Ring', 'Gravitational Lensing Rings'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -4, y: 0, z: 0 },
    },
    {
      name: 'Einstein Ring & Lensing System',
      description: 'Primary and secondary gravitational lensing rings formed by photons from background sources being bent around the gravastar. Includes higher-order relativistic images.',
      material: 'Gravitationally deflected photons (Δφ = 4GM/bc² + higher order)',
      function: 'Produces the characteristic strong-lensing signature. The number and separation of relativistic images encodes the gravastar compactness and can distinguish it from a Kerr BH.',
      assemblyOrder: 11,
      connections: ['Photon Sphere'],
      failureEffect: 'Modified lensing pattern from interior structure echoes could produce anomalous flux ratios in lensed images — a smoking-gun gravastar signature.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -5, y: -2, z: 0 },
    },
    {
      name: 'Accretion Disk & ISCO',
      description: 'Multi-layered accretion disk extending from the ISCO (Innermost Stable Circular Orbit) at r = 6M outward. Inner regions emit X-rays (kT ~ keV), outer regions emit infrared.',
      material: 'Ionized hydrogen-helium plasma (T ~ 10⁶-10⁸ K)',
      function: 'Provides the primary electromagnetic luminosity of the system. The thermal spectrum and QPO (Quasi-Periodic Oscillation) frequencies encode the spacetime geometry.',
      assemblyOrder: 12,
      connections: ['Ergosphere Analog', 'Photon Sphere', 'Relativistic Jets'],
      failureEffect: 'Accretion rate changes alter luminosity state (quiescent ↔ active). Echoes from the gravastar surface (unlike a horizon) produce delayed electromagnetic signals.',
      cascadeFailures: ['Relativistic Jets'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -6, z: 0 },
    },
    {
      name: 'Relativistic Jets',
      description: 'Bipolar collimated plasma outflows launched along the rotation axis by the Blandford-Znajek mechanism. Internal helical magnetic fields collimate the flow to Lorentz factors Γ ~ 10-100.',
      material: 'Magnetically dominated plasma (σ >> 1, e⁺e⁻ pair plasma)',
      function: 'Transport angular momentum and energy away from the system. The jet power P_jet ~ B²r²c encodes the magnetic flux threading the gravastar surface.',
      assemblyOrder: 13,
      connections: ['Accretion Disk & ISCO', 'Ergosphere Analog'],
      failureEffect: 'Jet disruption from magnetic field reconnection causes episodic ejection events observable as radio flares and superluminal knot motion.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 8, z: 0 },
    },
    {
      name: 'Hawking-like Radiation Wisps',
      description: 'Near-surface quantum vacuum fluctuations analogous to Hawking radiation. Unlike black holes, gravastars have no true horizon, so the emission mechanism differs (surface thermal emission vs. horizon radiation).',
      material: 'Virtual particle pairs (ℏω ~ kT_surface)',
      function: 'Produce faint thermal emission from the ultra-redshifted surface. The spectrum may deviate from perfect Planckian, providing a potential observational distinction from black holes.',
      assemblyOrder: 14,
      connections: ['Surface Redshift Layer', 'BEC Outer Crust'],
      failureEffect: 'Enhanced quantum emission during gravastar oscillation modes could produce detectable bursts, unlike the steady Hawking emission from a classical black hole.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 3, z: 0 },
    },
    {
      name: 'Gravitational Wave Ripple Field',
      description: 'Spacetime curvature perturbations (h_+ and h_× polarizations) propagating outward from the gravastar. The ringdown spectrum after merger differs from Kerr black holes.',
      material: 'Metric perturbations (h_μν, |h| ~ 10⁻²¹ at Earth)',
      function: 'Carry information about the gravastar interior structure. Unlike black hole ringdown (governed solely by mass and spin), gravastar QNMs depend on interior composition, potentially detectable by LIGO/LISA.',
      assemblyOrder: 15,
      connections: ['Phase Transition Ripples', 'BEC Outer Crust'],
      failureEffect: 'Gravitational wave echoes — delayed repetitions of the initial ringdown signal — are a predicted smoking-gun signature of a gravastar (or any horizonless compact object).',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -5, y: 5, z: 0 },
    },
    {
      name: 'Stress-Energy Tensor Field',
      description: 'Visualization of T_μν distribution: the source term in Einstein\'s field equations G_μν = 8πG T_μν. Shows how matter-energy curves spacetime around the gravastar.',
      material: 'Curvature of spacetime (Riemann tensor R^α_βγδ)',
      function: 'Encodes the complete gravitational field structure. The three distinct regions (de Sitter interior, thin shell, Schwarzschild exterior) each have characteristic T_μν profiles.',
      assemblyOrder: 16,
      connections: ['De Sitter Vacuum Core', 'Phase Boundary Layer', 'BEC Outer Crust'],
      failureEffect: 'Violation of energy conditions in unexpected regions would destabilize the gravastar solution, requiring quantum gravity corrections to maintain self-consistency.',
      cascadeFailures: ['De Sitter Vacuum Core', 'Phase Boundary Layer', 'BEC Outer Crust'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 6, y: -4, z: 0 },
    },
  ];

  // ==========================================================================
  // QUIZ QUESTIONS — PhD-level GR / Compact Object Physics
  // ==========================================================================
  const quizQuestions = [
    {
      question: 'In the Mazur-Mottola gravastar model, what equation of state characterizes the de Sitter vacuum interior, and how does this relate to the cosmological constant Λ?',
      options: [
        'p = +ρ, corresponding to ultra-stiff matter with sound speed equal to the speed of light',
        'p = -ρ, equivalent to a positive cosmological constant Λ > 0 producing repulsive gravitational pressure',
        'p = ρ/3, corresponding to a radiation-dominated equation of state with conformal symmetry',
        'p = 0, representing pressureless dust (CDM) in a Friedmann-Robertson-Walker interior'
      ],
      correctAnswer: 1,
      explanation: 'The de Sitter interior has equation of state p = -ρ, which is identical to a positive cosmological constant Λ = 8πGρ_Λ. This produces a repulsive gravitational effect (anti-gravity) that prevents singularity formation. The stress-energy tensor takes the form T_μν = -ρ_Λ g_μν, where ρ_Λ is the vacuum energy density. This is the key insight of Mazur and Mottola (2001, 2004): during gravitational collapse, a quantum phase transition near the would-be horizon converts matter into a de Sitter condensate.'
    },
    {
      question: 'The phase boundary layer of a gravastar is governed by Israel-Darmois junction conditions. What quantity must be continuous across this boundary for a valid thin-shell solution?',
      options: [
        'The extrinsic curvature tensor K_ab, which encodes how the boundary is embedded in the 4D spacetime',
        'The induced metric h_ab on the junction surface, while the discontinuity in extrinsic curvature K_ab determines the surface stress-energy tensor S_ab',
        'The Riemann curvature tensor R^α_βγδ, ensuring smooth curvature across the boundary',
        'The Christoffel symbols Γ^μ_νρ, which must be continuous for well-defined geodesic motion across the shell'
      ],
      correctAnswer: 1,
      explanation: 'The Israel-Darmois junction conditions require that the induced 3-metric h_ab be continuous across the thin shell (first junction condition), while the discontinuity in extrinsic curvature [K_ab] = K⁺_ab - K⁻_ab determines the surface stress-energy tensor via S_ab = -(1/8πG)([K_ab] - h_ab[K]). For the gravastar, the interior de Sitter and exterior Schwarzschild metrics are joined at r = r₀, and the surface energy density and pressure of the thin shell are determined entirely by the metric discontinuity.'
    },
    {
      question: 'How does the quasi-normal mode (QNM) spectrum of a gravastar fundamentally differ from that of a Kerr black hole, and what observational consequence does this produce?',
      options: [
        'Gravastars have identical QNM frequencies but different damping times due to their different interior structures',
        'Gravastars produce gravitational wave echoes — delayed repetitions of the ringdown signal at time intervals Δt ~ 2r₀ ln(r₀/2M - 1)/c — because the surface is partially reflective unlike a black hole horizon',
        'Gravastars have no QNM spectrum because they lack an event horizon, making them gravitationally silent',
        'Gravastars produce higher-frequency QNMs due to their stiffer equation of state, but the damping behavior is identical to Kerr'
      ],
      correctAnswer: 1,
      explanation: 'The defining observational signature of a gravastar (and any horizonless compact object) is gravitational wave echoes. When a gravitational wave pulse strikes the gravastar surface, it is partially reflected (unlike a black hole horizon, which is a perfect absorber). The reflected pulse bounces between the angular momentum barrier (at r ~ 3M) and the surface, producing a series of delayed echo pulses with decreasing amplitude. The echo delay time Δt ≈ -2M ln(1 - 2M/r₀) depends logarithmically on the surface compactness. Tentative evidence for such echoes has been searched for in LIGO data from binary merger events (Abedi et al. 2017).'
    },
    {
      question: 'What is the surface gravitational redshift z_s of a gravastar with compactness parameter C = 2GM/Rc² = 0.999, and why does this make the object observationally indistinguishable from a black hole?',
      options: [
        'z_s = 1/(1-C) - 1 ≈ 999, meaning photons from the surface lose 99.9% of their energy, but the surface remains visible in X-rays',
        'z_s = (1-C)^(-1/2) - 1 ≈ 30.6, meaning photons are redshifted by a factor of ~31.6 — extreme but potentially detectable with next-generation telescopes',
        'z_s = C/(1-C) ≈ 999, meaning the surface is effectively invisible but gravitational lensing reveals the interior structure',
        'z_s = ln(1/(1-C)) ≈ 6.9, a moderate redshift that allows direct surface observation in the infrared'
      ],
      correctAnswer: 1,
      explanation: 'For a static, spherically symmetric gravastar with Schwarzschild exterior, the surface redshift is z_s = (1 - 2GM/Rc²)^(-1/2) - 1 = (1 - C)^(-1/2) - 1. For C = 0.999: z_s = (0.001)^(-1/2) - 1 = 31.6 - 1 ≈ 30.6. A photon emitted from the surface with wavelength λ_em arrives at infinity with λ_obs = λ_em(1 + z_s) ≈ 31.6 λ_em. For C → 1 (Buchdahl limit), z_s → ∞ and the surface becomes completely dark — indistinguishable from a black hole horizon. This is the fundamental challenge of gravastar observational tests: the closer the compactness is to 1, the better the black hole mimicry, but also the harder the distinction.'
    },
    {
      question: 'In the context of the gravastar model, why does the Bose-Einstein condensate (BEC) crust require the ultra-stiff equation of state p = +ρc² (the causal limit), and what physical constraint does this satisfy?',
      options: [
        'The ultra-stiff EoS maximizes the speed of sound to v_s = c, saturating the causality bound, which allows the maximum possible compactness (Buchdahl limit 2M/R < 8/9) to be exceeded while maintaining causal signal propagation throughout the matter',
        'The ultra-stiff EoS is required by thermodynamic stability (∂p/∂ρ > 0), and any softer equation of state would produce a thermodynamically unstable configuration',
        'The ultra-stiff EoS is needed to match the interior de Sitter pressure at the junction, and any other EoS would violate the Israel junction conditions',
        'The BEC must have p = +ρ because this is the only EoS consistent with zero temperature matter, as required by the third law of thermodynamics'
      ],
      correctAnswer: 0,
      explanation: 'The Buchdahl theorem (1959) states that for any perfect fluid sphere with ρ(r) non-increasing outward, the compactness cannot exceed 2M/R < 8/9 ≈ 0.889. However, the gravastar requires compactness 2M/R → 1 to mimic a black hole. The ultra-stiff EoS p = +ρc² has sound speed v_s = (dp/dρ)^(1/2) = c, saturating the causal limit (no signal can travel faster than light). This allows the matter to support itself at compactnesses exceeding the Buchdahl bound — up to 2M/R → 1 — because the Buchdahl theorem assumes specific conditions on the density profile that can be violated by the three-layer gravastar structure. The stiff EoS also provides maximum resistance to gravitational compression per unit energy density.'
    },
    {
      question: 'If LIGO detects a binary merger remnant consistent with a gravastar rather than a black hole, what specific post-merger gravitational wave signature would confirm the presence of a reflective surface rather than an absorbing horizon?',
      options: [
        'A continuous monochromatic gravitational wave signal at the fundamental mode frequency, lasting indefinitely',
        'A series of quasi-periodic echo pulses in the post-merger ringdown, with echo spacing Δt_echo ≈ 2M|ln ε| / c (where ε = 1 - 2M/R << 1 is the surface proximity parameter), and each echo carrying a fraction of the original ringdown energy',
        'Complete absence of any ringdown signal, since gravastars cannot produce quasi-normal mode radiation',
        'A ringdown signal identical to Kerr black hole QNMs but with exactly twice the amplitude due to constructive interference from surface reflection'
      ],
      correctAnswer: 1,
      explanation: 'The post-merger echo signature is the primary smoking gun for horizonless compact objects including gravastars. After the initial ringdown (which closely mimics the Kerr QNM spectrum), gravitational wave energy trapped between the photon sphere potential barrier (at r ~ 3M) and the reflective gravastar surface bounces back and forth, producing a train of echo pulses. The echo time delay is Δt_echo ≈ -4M ln(1 - 2M/R) ≈ 4M|ln ε| for near-horizon surfaces (where ε = 1 - 2M/R << 1). For a 30 M_☉ remnant with ε ~ 10⁻⁴⁰ (Planck-scale displacement), Δt_echo ~ 0.1 seconds — well within LIGO sensitivity. Each echo is attenuated by the reflectivity coefficient R of the surface and the transmission coefficient of the potential barrier. The LIGO/Virgo collaboration and independent groups have searched for these echoes in events like GW150914, with results remaining inconclusive but placing constraints on the surface reflectivity.'
    },
  ];

  // ==========================================================================
  // DESCRIPTION
  // ==========================================================================
  const description = `**Gravastar (Gravitational Vacuum Star) — Mazur-Mottola Compact Object**

A gravastar is a theoretical alternative to black holes proposed by Pawel Mazur and Emil Mottola (2001, 2004). It is a compact object with three distinct layers:

**1. De Sitter Vacuum Interior:** The core is filled with dark energy (equation of state p = -ρ, equivalent to a positive cosmological constant Λ). This repulsive gravitational interior replaces the classical black hole singularity with smooth, regular de Sitter spacetime.

**2. Phase Boundary (Thin Shell):** An infinitesimally thin layer of exotic matter where the equation of state undergoes a quantum phase transition from p = -ρ to p = +ρ. Governed by Israel-Darmois junction conditions.

**3. Bose-Einstein Condensate Crust:** An ultra-stiff matter shell (p = +ρ, causal limit) composed of a macroscopic quantum condensate. This shell supports compactness 2M/R → 1 without forming an event horizon.

**Key Properties:**
• No singularity (regular interior)
• No event horizon (but extreme surface redshift z_s → ∞ mimics one)
• Thermodynamically stable with positive specific heat
• Potentially distinguishable from black holes via gravitational wave echoes and modified quasi-normal mode spectrum
• Compatible with all current observations (EHT shadow, LIGO ringdown)`;

  // ==========================================================================
  // ANIMATE — Extreme synchronized animation
  // ==========================================================================
  function animate(time, speed, ms) {
    const t = time * speed;

    // --- Dark Energy Core: slow pulsation (de Sitter expansion) ---
    if (ms.darkEnergyCore) {
      const corePulse = 1.0 + 0.08 * Math.sin(t * 0.5);
      ms.darkEnergyCore.scale.set(corePulse, corePulse, corePulse);
      ms.darkEnergyCore.material.emissiveIntensity = 1.2 + 0.6 * Math.sin(t * 0.3);
      ms.darkEnergyCore.rotation.y = t * 0.05;
      ms.darkEnergyCore.rotation.x = Math.sin(t * 0.1) * 0.05;
    }

    // --- Plasma Tendrils: swirling rotation ---
    if (ms.plasmaTendrils) {
      ms.plasmaTendrils.forEach((tendril, i) => {
        tendril.rotation.y = t * 0.15 + i * 0.5;
        tendril.rotation.x = Math.sin(t * 0.2 + i) * 0.1;
        tendril.material.emissiveIntensity = 2.0 + Math.sin(t * 0.8 + i * 0.7) * 1.0;
        tendril.material.opacity = 0.25 + 0.15 * Math.sin(t * 0.6 + i * 0.5);
      });
    }

    // --- Vacuum Pulsation Shells: concentric breathing ---
    if (ms.pulsationShells) {
      ms.pulsationShells.forEach((shell, i) => {
        const shellPulse = 1.0 + 0.15 * Math.sin(t * 0.4 + i * 0.8);
        shell.scale.set(shellPulse, shellPulse, shellPulse);
        shell.rotation.y = t * 0.08 * (i % 2 === 0 ? 1 : -1);
        shell.rotation.x = t * 0.04 * (i % 2 === 0 ? -1 : 1);
        shell.material.opacity = 0.08 + 0.06 * Math.sin(t * 0.6 + i * 1.2);
      });
    }

    // --- Quantum Sparks: random quantum tunneling motion ---
    if (ms.quantumSparks) {
      ms.quantumSparks.forEach((spark) => {
        const ud = spark.userData;
        const newR = ud.baseR + Math.sin(t * ud.speed + ud.phase) * 0.5;
        const newTheta = ud.baseTheta + t * ud.speed * 0.3;
        const newPhi = ud.basePhi + Math.sin(t * ud.speed * 0.5) * 0.2;
        spark.position.set(
          newR * Math.sin(newPhi) * Math.cos(newTheta),
          newR * Math.cos(newPhi),
          newR * Math.sin(newPhi) * Math.sin(newTheta)
        );
        spark.material.emissiveIntensity = 2.0 + Math.sin(t * 3 + ud.phase) * 2.0;
        spark.material.opacity = 0.4 + 0.5 * Math.abs(Math.sin(t * 2 + ud.phase));
      });
    }

    // --- Phase Boundary: gentle oscillation ---
    if (ms.phaseBoundary) {
      const pbPulse = 1.0 + 0.02 * Math.sin(t * 1.5);
      ms.phaseBoundary.scale.set(pbPulse, pbPulse, pbPulse);
      ms.phaseBoundary.material.emissiveIntensity = 1.5 + 0.8 * Math.sin(t * 0.7);
      ms.phaseBoundary.material.opacity = 0.5 + 0.25 * Math.sin(t * 0.9);
    }

    // --- Phase Ripples: traveling waves ---
    if (ms.phaseRipples) {
      ms.phaseRipples.forEach((ripple, i) => {
        const rippleScale = 1.0 + 0.05 * Math.sin(t * 2.0 + i * 0.8);
        ripple.scale.set(ripple.scale.x, ripple.scale.y, rippleScale);
        ripple.material.emissiveIntensity = 1.2 + Math.sin(t * 1.5 + i * 0.6) * 0.8;
      });
    }

    // --- Junction Lines: flickering ---
    if (ms.junctionLines) {
      ms.junctionLines.forEach((junc, i) => {
        junc.material.opacity = 0.3 + 0.4 * Math.abs(Math.sin(t * 1.2 + i * 0.5));
        junc.material.emissiveIntensity = 1.0 + Math.sin(t * 1.8 + i * 0.7) * 0.8;
      });
    }

    // --- BEC Crust: subtle vibration (shell oscillation modes) ---
    if (ms.crustShell) {
      const crustVib = 1.0 + 0.005 * Math.sin(t * 3.0) + 0.003 * Math.sin(t * 5.0);
      ms.crustShell.scale.set(crustVib, crustVib, crustVib);
      ms.crustShell.material.emissiveIntensity = 0.3 + 0.15 * Math.sin(t * 0.8);
    }

    // --- BEC Lattice: counter-rotation ---
    if (ms.becLattice) {
      ms.becLattice.rotation.y = -t * 0.03;
      ms.becLattice.rotation.x = Math.sin(t * 0.15) * 0.02;
      ms.becLattice.material.emissiveIntensity = 0.8 + 0.4 * Math.sin(t * 0.5);
    }

    // --- Crust Fissures: pulsing glow ---
    if (ms.crustFissures) {
      ms.crustFissures.forEach((fissure, i) => {
        fissure.material.emissiveIntensity = 1.5 + 1.5 * Math.sin(t * 1.5 + i * 0.4);
        fissure.material.opacity = 0.4 + 0.4 * Math.abs(Math.sin(t * 1.0 + i * 0.6));
      });
    }

    // --- Hex Plates: subtle shimmer ---
    if (ms.hexPlates) {
      ms.hexPlates.forEach((hex, i) => {
        hex.material.emissiveIntensity = 0.3 + 0.2 * Math.sin(t * 0.5 + i * 0.3);
      });
    }

    // --- Crust Nodules: gentle pulse ---
    if (ms.crustNodules) {
      ms.crustNodules.forEach((nod, i) => {
        const nodScale = 1.0 + 0.3 * Math.sin(t * 2.0 + i * 0.5);
        nod.scale.set(nodScale, nodScale, nodScale);
        nod.material.emissiveIntensity = 0.6 + 0.5 * Math.sin(t * 1.5 + i * 0.4);
      });
    }

    // --- Surface Redshift Glow: breathing effect ---
    if (ms.redshiftGlow) {
      const rsPulse = 1.0 + 0.03 * Math.sin(t * 0.6);
      ms.redshiftGlow.scale.set(rsPulse, rsPulse, rsPulse);
      ms.redshiftGlow.material.emissiveIntensity = 2.5 + 1.0 * Math.sin(t * 0.4);
      ms.redshiftGlow.material.opacity = 0.2 + 0.15 * Math.sin(t * 0.5);
    }

    // --- Redshift Rings: cascading wave animation ---
    if (ms.redshiftRings) {
      ms.redshiftRings.forEach((ring, i) => {
        ring.material.emissiveIntensity = 1.5 + Math.sin(t * 0.8 - i * 0.4) * 1.0;
        ring.material.opacity = 0.3 + 0.2 * Math.sin(t * 0.6 - i * 0.3);
        const ringPulse = 1.0 + 0.02 * Math.sin(t * 1.0 - i * 0.5);
        ring.scale.set(ringPulse, ringPulse, 1);
      });
    }

    // --- Ergosphere: slow frame-dragging rotation ---
    if (ms.ergosphere) {
      ms.ergosphere.rotation.y = t * 0.1;
      ms.ergosphere.material.opacity = 0.15 + 0.08 * Math.sin(t * 0.3);
    }

    // --- Frame-Drag Lines: co-rotating with ergosphere ---
    if (ms.frameDragLines) {
      ms.frameDragLines.forEach((line, i) => {
        line.rotation.y = t * 0.12 + i * 0.1;
        line.material.opacity = 0.25 + 0.15 * Math.sin(t * 0.5 + i * 0.4);
      });
    }

    // --- Photon Sphere: gentle wireframe rotation ---
    if (ms.photonSphere) {
      ms.photonSphere.rotation.y = t * 0.02;
      ms.photonSphere.rotation.x = Math.sin(t * 0.1) * 0.03;
    }

    // --- Einstein Ring: oscillating brightness ---
    if (ms.einsteinRing) {
      ms.einsteinRing.material.emissiveIntensity = 1.8 + 0.8 * Math.sin(t * 0.6);
      const erScale = 1.0 + 0.01 * Math.sin(t * 1.2);
      ms.einsteinRing.scale.set(erScale, erScale, 1);
    }

    // --- Lensing Sub-Rings: counter-oscillation ---
    if (ms.lensingSubRings) {
      ms.lensingSubRings.forEach((ring, i) => {
        ring.material.emissiveIntensity = 0.8 + Math.sin(t * 0.7 + i * 0.5) * 0.5;
        ring.rotation.z = i * 0.08 + Math.sin(t * 0.3) * 0.02;
      });
    }

    // --- Bent Light Rays: pulsing opacity ---
    if (ms.bentRays) {
      ms.bentRays.forEach((ray, i) => {
        ray.material.opacity = 0.15 + 0.2 * Math.abs(Math.sin(t * 0.5 + i * 0.6));
        ray.material.emissiveIntensity = 0.5 + Math.sin(t * 0.8 + i * 0.4) * 0.4;
      });
    }

    // --- Accretion Disk: differential rotation (Keplerian) ---
    if (ms.accretionGroup) {
      ms.accretionGroup.rotation.y = t * 0.2;
    }

    // --- ISCO Ring: fast inner orbit ---
    if (ms.iscoRing) {
      ms.iscoRing.material.emissiveIntensity = 2.2 + Math.sin(t * 2.0) * 1.0;
      const iscoScale = 1.0 + 0.02 * Math.sin(t * 1.5);
      ms.iscoRing.scale.set(iscoScale, iscoScale, 1);
    }

    // --- Spiral Arms: rotating with disk ---
    if (ms.spiralArms) {
      ms.spiralArms.forEach((arm, i) => {
        arm.material.emissiveIntensity = 1.4 + Math.sin(t * 0.8 + i * 2) * 0.6;
      });
    }

    // --- Accretion Clumps: orbital motion ---
    if (ms.accretionClumps) {
      ms.accretionClumps.forEach((clump) => {
        const ud = clump.userData;
        const newAngle = ud.angle + t * ud.speed * 0.15 / Math.sqrt(ud.radius);
        clump.position.x = ud.radius * Math.cos(newAngle);
        clump.position.z = ud.radius * Math.sin(newAngle);
        clump.position.y = Math.sin(t * 2 + ud.angle) * 0.1;
        clump.material.emissiveIntensity = 2.0 + Math.sin(t * 3 + ud.angle) * 1.0;
      });
    }

    // --- Jets: pulsating and rotating internal helix ---
    if (ms.jetsGroup) {
      ms.jetsGroup.rotation.y = t * 0.08;
      ms.jetsGroup.children.forEach((jetSub) => {
        jetSub.children.forEach((child) => {
          if (child.material) {
            child.material.emissiveIntensity = 1.5 + Math.sin(t * 1.5) * 1.0;
            child.material.opacity = 0.3 + 0.2 * Math.sin(t * 0.8);
          }
        });
      });
    }

    // --- Stress-Energy Field Lines: rippling ---
    if (ms.fieldLines) {
      ms.fieldLines.forEach((line, i) => {
        line.material.opacity = 0.2 + 0.3 * Math.abs(Math.sin(t * 0.6 + i * 0.5));
        line.material.emissiveIntensity = 0.8 + Math.sin(t * 1.0 + i * 0.4) * 0.5;
        line.rotation.y = t * 0.02;
      });
    }

    // --- Hawking Wisps: flickering and fading ---
    if (ms.hawkingWisps) {
      ms.hawkingWisps.forEach((wisp, i) => {
        wisp.material.opacity = 0.1 + 0.2 * Math.abs(Math.sin(t * 1.5 + i * 0.7));
        wisp.material.emissiveIntensity = 0.5 + Math.sin(t * 2.0 + i * 0.5) * 0.8;
      });
    }

    // --- Gravitational Wave Ripples: expanding outward ---
    if (ms.gwRipples) {
      ms.gwRipples.forEach((ripple, i) => {
        const gwScale = 1.0 + 0.1 * Math.sin(t * 0.5 - i * 0.8);
        ripple.scale.set(gwScale, gwScale, 1);
        ripple.material.opacity = 0.12 + 0.08 * Math.sin(t * 0.4 - i * 0.6);
        ripple.rotation.z = Math.sin(t * 0.2 + i * 0.3) * 0.05;
      });
    }

    // --- Cauchy Surface: slow breathing ---
    if (ms.cauchySurface) {
      const cauchyPulse = 1.0 + 0.04 * Math.sin(t * 0.8);
      ms.cauchySurface.scale.set(cauchyPulse, cauchyPulse, cauchyPulse);
      ms.cauchySurface.rotation.y = -t * 0.03;
      ms.cauchySurface.material.opacity = 0.08 + 0.05 * Math.sin(t * 0.5);
    }

    // --- Entire group: very slow majestic rotation ---
    group.rotation.y = t * 0.01;
  }

  // ==========================================================================
  // RETURN
  // ==========================================================================
  return {
    group,
    parts,
    description,
    quizQuestions,
    animate: (time, speed) => animate(time, speed, meshes),
  };
}
