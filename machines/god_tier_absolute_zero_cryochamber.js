// ============================================================================
// ABSOLUTE ZERO CRYOCHAMBER — ULTRA GOD TIER
// Laser cooling, adiabatic demagnetization, nuclear spin refrigeration
// Cools matter to within picokelvins of absolute zero
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ──────────────────────────────────────────────────────────────────────
  // CUSTOM MATERIALS — Cryogenic & Quantum Aesthetics
  // ──────────────────────────────────────────────────────────────────────
  const goldShield = new THREE.MeshStandardMaterial({
    color: 0xffd700, metalness: 0.95, roughness: 0.08,
    emissive: 0x332200, emissiveIntensity: 0.12
  });
  const silverShield = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, metalness: 0.97, roughness: 0.05,
    emissive: 0x111111, emissiveIntensity: 0.08
  });
  const copperShield = new THREE.MeshStandardMaterial({
    color: 0xb87333, metalness: 0.92, roughness: 0.12,
    emissive: 0x331100, emissiveIntensity: 0.1
  });
  const cryoBlue = new THREE.MeshStandardMaterial({
    color: 0x00ccff, metalness: 0.3, roughness: 0.2,
    emissive: 0x0088ff, emissiveIntensity: 0.6, transparent: true, opacity: 0.7
  });
  const laserRed = new THREE.MeshStandardMaterial({
    color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.8,
    transparent: true, opacity: 0.85
  });
  const laserBlue = new THREE.MeshStandardMaterial({
    color: 0x0044ff, emissive: 0x0066ff, emissiveIntensity: 1.8,
    transparent: true, opacity: 0.85
  });
  const laserGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.8
  });
  const becGlow = new THREE.MeshStandardMaterial({
    color: 0x99eeff, emissive: 0x66ddff, emissiveIntensity: 2.5,
    transparent: true, opacity: 0.55
  });
  const becCore = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xaaeeff, emissiveIntensity: 3.0,
    transparent: true, opacity: 0.7
  });
  const vacuumGlass = new THREE.MeshPhysicalMaterial({
    color: 0xddeeff, metalness: 0.0, roughness: 0.05,
    transmission: 0.92, thickness: 0.3, transparent: true, opacity: 0.18,
    ior: 1.5, envMapIntensity: 1.0
  });
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.6
  });
  const neonPurple = new THREE.MeshStandardMaterial({
    color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.55
  });
  const screenGlow = new THREE.MeshStandardMaterial({
    color: 0x001a00, emissive: 0x00ff66, emissiveIntensity: 1.2
  });
  const coilMat = new THREE.MeshStandardMaterial({
    color: 0x992222, metalness: 0.85, roughness: 0.2,
    emissive: 0x220000, emissiveIntensity: 0.15
  });
  const heliumLine = new THREE.MeshStandardMaterial({
    color: 0x888899, metalness: 0.7, roughness: 0.25
  });
  const insulationMat = new THREE.MeshStandardMaterial({
    color: 0x444455, metalness: 0.1, roughness: 0.9
  });
  const warmPlate = new THREE.MeshStandardMaterial({
    color: 0x995533, metalness: 0.6, roughness: 0.35,
    emissive: 0x331100, emissiveIntensity: 0.2
  });

  // ──────────────────────────────────────────────────────────────────────
  // OUTER DEWAR / VACUUM VESSEL
  // ──────────────────────────────────────────────────────────────────────
  const outerDewarGroup = new THREE.Group();

  // Main outer cylindrical shell (tall cryostat body)
  const outerShellGeo = new THREE.CylinderGeometry(3.8, 3.8, 12, 64, 1, true);
  const outerShell = new THREE.Mesh(outerShellGeo, steel.clone());
  outerShell.position.y = 0;
  outerDewarGroup.add(outerShell);

  // Top flange — thick disc with bolt holes
  const topFlangeGeo = new THREE.CylinderGeometry(4.3, 4.3, 0.4, 64);
  const topFlange = new THREE.Mesh(topFlangeGeo, darkSteel);
  topFlange.position.y = 6.2;
  outerDewarGroup.add(topFlange);

  // Bolt ring on top flange — instanced bolts
  const boltGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8);
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const bolt = new THREE.Mesh(boltGeo, chrome);
    bolt.position.set(Math.cos(angle) * 4.0, 6.45, Math.sin(angle) * 4.0);
    outerDewarGroup.add(bolt);
  }

  // Bottom flange
  const bottomFlangeGeo = new THREE.CylinderGeometry(4.3, 4.3, 0.4, 64);
  const bottomFlange = new THREE.Mesh(bottomFlangeGeo, darkSteel);
  bottomFlange.position.y = -6.2;
  outerDewarGroup.add(bottomFlange);

  // Bottom bolt ring
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const bolt = new THREE.Mesh(boltGeo, chrome);
    bolt.position.set(Math.cos(angle) * 4.0, -6.45, Math.sin(angle) * 4.0);
    outerDewarGroup.add(bolt);
  }

  // Viewport windows around outer shell (6 quartz observation ports)
  const viewportGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 32);
  const viewportRimGeo = new THREE.TorusGeometry(0.38, 0.06, 12, 32);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const viewport = new THREE.Mesh(viewportGeo, vacuumGlass);
    viewport.rotation.z = Math.PI / 2;
    viewport.position.set(Math.cos(angle) * 3.82, 1.5 + (i % 3) * 2.0 - 2.0, Math.sin(angle) * 3.82);
    viewport.lookAt(0, viewport.position.y, 0);
    outerDewarGroup.add(viewport);

    const rim = new THREE.Mesh(viewportRimGeo, chrome);
    rim.position.copy(viewport.position);
    rim.lookAt(0, rim.position.y, 0);
    outerDewarGroup.add(rim);
  }

  // Outer shell reinforcement ribs (circumferential stiffeners)
  const ribGeo = new THREE.TorusGeometry(3.85, 0.08, 8, 64);
  for (let i = 0; i < 8; i++) {
    const rib = new THREE.Mesh(ribGeo, darkSteel);
    rib.rotation.x = Math.PI / 2;
    rib.position.y = -5.0 + i * 1.5;
    outerDewarGroup.add(rib);
  }

  // Vacuum pump port (KF flange + bellows)
  const pumpPortGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 24);
  const pumpPort = new THREE.Mesh(pumpPortGeo, aluminum);
  pumpPort.rotation.z = Math.PI / 2;
  pumpPort.position.set(4.4, 4.0, 0);
  outerDewarGroup.add(pumpPort);

  const pumpFlangeGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.15, 24);
  const pumpFlange = new THREE.Mesh(pumpFlangeGeo, chrome);
  pumpFlange.rotation.z = Math.PI / 2;
  pumpFlange.position.set(5.1, 4.0, 0);
  outerDewarGroup.add(pumpFlange);

  // Bellows section
  for (let b = 0; b < 5; b++) {
    const bellowGeo = new THREE.TorusGeometry(0.32, 0.04, 8, 24);
    const bellow = new THREE.Mesh(bellowGeo, aluminum);
    bellow.rotation.y = Math.PI / 2;
    bellow.position.set(5.4 + b * 0.2, 4.0, 0);
    outerDewarGroup.add(bellow);
  }

  group.add(outerDewarGroup);

  // ──────────────────────────────────────────────────────────────────────
  // NESTED RADIATION SHIELDS — Gold / Silver / Copper stages
  // ──────────────────────────────────────────────────────────────────────
  const shieldsGroup = new THREE.Group();

  // 77K Copper stage (outermost radiation shield)
  const copperShellGeo = new THREE.CylinderGeometry(3.2, 3.2, 10.5, 48, 1, true);
  const copperStage = new THREE.Mesh(copperShellGeo, copperShield);
  shieldsGroup.add(copperStage);

  // Copper stage top cap
  const copperCapGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.15, 48);
  const copperCapTop = new THREE.Mesh(copperCapGeo, copperShield);
  copperCapTop.position.y = 5.3;
  shieldsGroup.add(copperCapTop);

  // Copper stage bottom cap
  const copperCapBot = new THREE.Mesh(copperCapGeo, copperShield);
  copperCapBot.position.y = -5.3;
  shieldsGroup.add(copperCapBot);

  // 4K Silver stage (middle radiation shield)
  const silverShellGeo = new THREE.CylinderGeometry(2.5, 2.5, 8.5, 48, 1, true);
  const silverStage = new THREE.Mesh(silverShellGeo, silverShield);
  shieldsGroup.add(silverStage);

  const silverCapGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.12, 48);
  const silverCapTop = new THREE.Mesh(silverCapGeo, silverShield);
  silverCapTop.position.y = 4.3;
  shieldsGroup.add(silverCapTop);
  const silverCapBot = new THREE.Mesh(silverCapGeo, silverShield);
  silverCapBot.position.y = -4.3;
  shieldsGroup.add(silverCapBot);

  // mK Gold stage (innermost radiation shield)
  const goldShellGeo = new THREE.CylinderGeometry(1.8, 1.8, 6.5, 48, 1, true);
  const goldStage = new THREE.Mesh(goldShellGeo, goldShield);
  shieldsGroup.add(goldStage);

  const goldCapGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 48);
  const goldCapTop = new THREE.Mesh(goldCapGeo, goldShield);
  goldCapTop.position.y = 3.3;
  shieldsGroup.add(goldCapTop);
  const goldCapBot = new THREE.Mesh(goldCapGeo, goldShield);
  goldCapBot.position.y = -3.3;
  shieldsGroup.add(goldCapBot);

  // Multi-layer insulation (MLI) wrap visualization — shiny foil strips
  const mliMat = new THREE.MeshStandardMaterial({
    color: 0xeeeecc, metalness: 0.9, roughness: 0.15, side: THREE.DoubleSide,
    transparent: true, opacity: 0.3
  });
  for (let layer = 0; layer < 12; layer++) {
    const r = 3.25 + layer * 0.035;
    const mliGeo = new THREE.CylinderGeometry(r, r, 10.2, 48, 1, true);
    const mli = new THREE.Mesh(mliGeo, mliMat);
    mli.rotation.y = layer * 0.15;
    shieldsGroup.add(mli);
  }

  group.add(shieldsGroup);

  // ──────────────────────────────────────────────────────────────────────
  // SUPPORT RODS — Low thermal conductivity G10 rods
  // ──────────────────────────────────────────────────────────────────────
  const supportGroup = new THREE.Group();
  const g10Mat = new THREE.MeshStandardMaterial({ color: 0x556633, roughness: 0.7 });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 11.5, 8);
    const rod = new THREE.Mesh(rodGeo, g10Mat);
    rod.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
    supportGroup.add(rod);

    // Thermal intercept clamps at each shield stage
    const clampGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 12);
    for (let c = 0; c < 3; c++) {
      const clamp = new THREE.Mesh(clampGeo, copper);
      clamp.position.set(Math.cos(angle) * 3.5, -3.0 + c * 3.0, Math.sin(angle) * 3.5);
      supportGroup.add(clamp);
    }
  }
  group.add(supportGroup);

  // ──────────────────────────────────────────────────────────────────────
  // ADIABATIC DEMAGNETIZATION REFRIGERATOR (ADR) ASSEMBLY
  // ──────────────────────────────────────────────────────────────────────
  const adrGroup = new THREE.Group();

  // Superconducting solenoid magnet coil (large toroidal winding)
  const solenoidGeo = new THREE.TorusGeometry(1.4, 0.35, 24, 64);
  const solenoid = new THREE.Mesh(solenoidGeo, coilMat);
  solenoid.rotation.x = Math.PI / 2;
  solenoid.position.y = -1.0;
  adrGroup.add(solenoid);

  // Inner winding layers of the solenoid
  for (let w = 0; w < 80; w++) {
    const wAngle = (w / 80) * Math.PI * 2;
    const windGeo = new THREE.TorusGeometry(0.02, 0.008, 4, 8);
    const wind = new THREE.Mesh(windGeo, copper);
    wind.position.set(
      Math.cos(wAngle) * 1.4,
      -1.0,
      Math.sin(wAngle) * 1.4
    );
    wind.rotation.x = Math.PI / 2;
    wind.rotation.z = wAngle;
    adrGroup.add(wind);
  }

  // Paramagnetic salt pill (Gadolinium Gallium Garnet - GGG)
  const saltPillGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.8, 32);
  const saltPillMat = new THREE.MeshStandardMaterial({
    color: 0x88aacc, metalness: 0.15, roughness: 0.6,
    emissive: 0x2244aa, emissiveIntensity: 0.15
  });
  const saltPill = new THREE.Mesh(saltPillGeo, saltPillMat);
  saltPill.position.y = -1.0;
  adrGroup.add(saltPill);

  // Heat switch — mechanical thermal link
  const heatSwitchGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 12);
  const heatSwitch = new THREE.Mesh(heatSwitchGeo, chrome);
  heatSwitch.position.set(0, 0.5, 0);
  adrGroup.add(heatSwitch);

  // Heat switch actuator
  const actuatorGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const actuator = new THREE.Mesh(actuatorGeo, darkSteel);
  actuator.position.set(0, 1.3, 0);
  adrGroup.add(actuator);

  // Thermal bus bars connecting salt pill to cold plate
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const busGeo = new THREE.BoxGeometry(0.06, 2.0, 0.15);
    const bus = new THREE.Mesh(busGeo, copper);
    bus.position.set(Math.cos(angle) * 0.7, -1.0, Math.sin(angle) * 0.7);
    adrGroup.add(bus);
  }

  adrGroup.position.y = 1.5;
  group.add(adrGroup);

  // ──────────────────────────────────────────────────────────────────────
  // NUCLEAR DEMAGNETIZATION STAGE — Sub-millikelvin cooling
  // ──────────────────────────────────────────────────────────────────────
  const nuclearGroup = new THREE.Group();

  // Nuclear stage copper bundle (fine wire bundle)
  const bundleGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 24);
  const nuclearBundle = new THREE.Mesh(bundleGeo, copper);
  nuclearBundle.position.y = -3.5;
  nuclearGroup.add(nuclearBundle);

  // Individual copper wires in bundle (instanced)
  for (let w = 0; w < 36; w++) {
    const wa = (w / 36) * Math.PI * 2;
    const wr = 0.08 + (w % 3) * 0.06;
    const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.25, 6);
    const wire = new THREE.Mesh(wireGeo, copper);
    wire.position.set(Math.cos(wa) * wr, -3.5, Math.sin(wa) * wr);
    nuclearGroup.add(wire);
  }

  // Nuclear stage superconducting magnet
  const nucMagGeo = new THREE.TorusGeometry(0.5, 0.15, 16, 48);
  const nucMag = new THREE.Mesh(nucMagGeo, coilMat);
  nucMag.rotation.x = Math.PI / 2;
  nucMag.position.y = -3.5;
  nuclearGroup.add(nucMag);

  // Cold plate (mixing chamber equivalent)
  const coldPlateGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 48);
  const coldPlate = new THREE.Mesh(coldPlateGeo, goldShield);
  coldPlate.position.y = -4.3;
  nuclearGroup.add(coldPlate);

  group.add(nuclearGroup);

  // ──────────────────────────────────────────────────────────────────────
  // LASER COOLING / MAGNETO-OPTICAL TRAP (MOT) ASSEMBLY
  // ──────────────────────────────────────────────────────────────────────
  const motGroup = new THREE.Group();

  // Six counter-propagating laser beams (3 axis pairs)
  const beamLength = 5.0;
  const beamRadius = 0.06;
  const beamGeo = new THREE.CylinderGeometry(beamRadius, beamRadius, beamLength, 16);
  const beamMaterials = [laserRed, laserRed, laserBlue, laserBlue, laserGreen, laserGreen];
  const beamRotations = [
    [0, 0, 0],                    // +Y
    [0, 0, Math.PI],              // -Y
    [0, 0, Math.PI / 2],          // +X
    [0, 0, -Math.PI / 2],         // -X
    [Math.PI / 2, 0, 0],          // +Z
    [-Math.PI / 2, 0, 0]          // -Z
  ];
  const beamMeshes = [];
  for (let i = 0; i < 6; i++) {
    const beam = new THREE.Mesh(beamGeo, beamMaterials[i].clone());
    beam.rotation.set(...beamRotations[i]);
    beamMeshes.push(beam);
    motGroup.add(beam);
  }

  // Laser beam collimator housings at each axis
  const collimatorGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.6, 16);
  const collPositions = [
    [0, 2.8, 0, 0, 0, 0],
    [0, -2.8, 0, 0, 0, Math.PI],
    [2.8, 0, 0, 0, 0, Math.PI / 2],
    [-2.8, 0, 0, 0, 0, -Math.PI / 2],
    [0, 0, 2.8, Math.PI / 2, 0, 0],
    [0, 0, -2.8, -Math.PI / 2, 0, 0]
  ];
  for (const [x, y, z, rx, ry, rz] of collPositions) {
    const coll = new THREE.Mesh(collimatorGeo, darkSteel);
    coll.position.set(x, y, z);
    coll.rotation.set(rx, ry, rz);
    motGroup.add(coll);

    // Lens element inside each collimator
    const lensGeo = new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const lens = new THREE.Mesh(lensGeo, vacuumGlass);
    lens.position.set(x * 0.9, y * 0.9, z * 0.9);
    motGroup.add(lens);
  }

  // Anti-Helmholtz coils (quadrupole magnetic field for MOT)
  const ahCoilGeo = new THREE.TorusGeometry(1.0, 0.08, 12, 48);
  const ahCoilTop = new THREE.Mesh(ahCoilGeo, coilMat);
  ahCoilTop.rotation.x = Math.PI / 2;
  ahCoilTop.position.y = 0.8;
  motGroup.add(ahCoilTop);

  const ahCoilBot = new THREE.Mesh(ahCoilGeo, coilMat);
  ahCoilBot.rotation.x = Math.PI / 2;
  ahCoilBot.position.y = -0.8;
  motGroup.add(ahCoilBot);

  // Coil winding detail
  for (let coilSet = 0; coilSet < 2; coilSet++) {
    const yPos = coilSet === 0 ? 0.8 : -0.8;
    for (let w = 0; w < 48; w++) {
      const wa = (w / 48) * Math.PI * 2;
      const dotGeo = new THREE.SphereGeometry(0.02, 4, 4);
      const dot = new THREE.Mesh(dotGeo, copper);
      dot.position.set(Math.cos(wa) * 1.0, yPos, Math.sin(wa) * 1.0);
      motGroup.add(dot);
    }
  }

  motGroup.position.y = -1.5;
  group.add(motGroup);

  // ──────────────────────────────────────────────────────────────────────
  // BOSE-EINSTEIN CONDENSATE (BEC) CORE — Quantum Degenerate Gas
  // ──────────────────────────────────────────────────────────────────────
  const becGroup = new THREE.Group();

  // The BEC cloud — main condensate sphere (anisotropic ellipsoid)
  const becCloudGeo = new THREE.SphereGeometry(0.25, 32, 32);
  const becCloud = new THREE.Mesh(becCloudGeo, becCore);
  becCloud.scale.set(1.0, 0.6, 1.0); // oblate due to trap geometry
  becGroup.add(becCloud);

  // Thermal fraction halo around BEC
  const thermalHaloGeo = new THREE.SphereGeometry(0.5, 24, 24);
  const thermalHaloMat = new THREE.MeshStandardMaterial({
    color: 0x6699ff, emissive: 0x3355aa, emissiveIntensity: 0.8,
    transparent: true, opacity: 0.15
  });
  const thermalHalo = new THREE.Mesh(thermalHaloGeo, thermalHaloMat);
  becGroup.add(thermalHalo);

  // Interference fringe rings (matter wave signature)
  for (let ring = 0; ring < 5; ring++) {
    const fringeGeo = new THREE.TorusGeometry(0.1 + ring * 0.08, 0.008, 8, 32);
    const fringeMat = new THREE.MeshStandardMaterial({
      color: 0xaaddff, emissive: 0x88ccff, emissiveIntensity: 1.5,
      transparent: true, opacity: 0.4 - ring * 0.06
    });
    const fringe = new THREE.Mesh(fringeGeo, fringeMat);
    fringe.rotation.x = Math.PI / 2;
    becGroup.add(fringe);
  }

  becGroup.position.y = -1.5;
  group.add(becGroup);

  // ──────────────────────────────────────────────────────────────────────
  // INSTANCED COLD ATOMS — Thousands of trapped atoms
  // ──────────────────────────────────────────────────────────────────────
  const atomCount = 1500;
  const atomGeo = new THREE.SphereGeometry(0.015, 4, 4);
  const atomMat = new THREE.MeshStandardMaterial({
    color: 0x88ddff, emissive: 0x44aaff, emissiveIntensity: 1.0,
    transparent: true, opacity: 0.7
  });
  const atomInstanced = new THREE.InstancedMesh(atomGeo, atomMat, atomCount);
  const atomDummy = new THREE.Object3D();
  const atomData = []; // store initial positions for animation

  for (let i = 0; i < atomCount; i++) {
    // Gaussian distribution — atoms cluster toward center
    const r = Math.abs(gaussRandom()) * 1.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    const z = r * Math.cos(phi);
    atomData.push({ x, y, z, vx: (Math.random() - 0.5) * 0.02, vy: (Math.random() - 0.5) * 0.02, vz: (Math.random() - 0.5) * 0.02 });
    atomDummy.position.set(x, y - 1.5, z);
    atomDummy.updateMatrix();
    atomInstanced.setMatrixAt(i, atomDummy.matrix);
  }
  atomInstanced.instanceMatrix.needsUpdate = true;
  group.add(atomInstanced);

  function gaussRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  // ──────────────────────────────────────────────────────────────────────
  // HELIUM-3/4 DILUTION LINES — Cryogenic plumbing
  // ──────────────────────────────────────────────────────────────────────
  const plumbingGroup = new THREE.Group();

  // Main helium supply line
  const heliumCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 7.0, 0),
    new THREE.Vector3(0.5, 5.5, 0.3),
    new THREE.Vector3(0.3, 3.0, -0.2),
    new THREE.Vector3(0, 1.0, 0),
    new THREE.Vector3(-0.2, -1.0, 0.1),
    new THREE.Vector3(0, -3.5, 0)
  ]);
  const heliumTubeGeo = new THREE.TubeGeometry(heliumCurve, 64, 0.08, 12, false);
  const heliumTube = new THREE.Mesh(heliumTubeGeo, heliumLine);
  plumbingGroup.add(heliumTube);

  // Return line
  const returnCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.6, 7.0, 0.6),
    new THREE.Vector3(0.8, 5.0, 0.5),
    new THREE.Vector3(0.6, 2.5, 0.3),
    new THREE.Vector3(0.4, 0, 0.2),
    new THREE.Vector3(0.2, -2.0, 0.1),
    new THREE.Vector3(0.1, -3.5, 0)
  ]);
  const returnTubeGeo = new THREE.TubeGeometry(returnCurve, 64, 0.06, 12, false);
  const returnTube = new THREE.Mesh(returnTubeGeo, heliumLine);
  plumbingGroup.add(returnTube);

  // Still line
  const stillCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.6, 7.0, -0.6),
    new THREE.Vector3(-0.7, 4.0, -0.4),
    new THREE.Vector3(-0.5, 1.0, -0.2),
    new THREE.Vector3(-0.3, -1.5, -0.1)
  ]);
  const stillTubeGeo = new THREE.TubeGeometry(stillCurve, 48, 0.07, 12, false);
  const stillTube = new THREE.Mesh(stillTubeGeo, heliumLine);
  plumbingGroup.add(stillTube);

  // Capillary impedance tubes
  for (let c = 0; c < 4; c++) {
    const capCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3 + c * 0.2, 2.0, 0.8),
      new THREE.Vector3(-0.2 + c * 0.15, 0.5, 0.6),
      new THREE.Vector3(-0.1 + c * 0.1, -1.0, 0.3)
    ]);
    const capGeo = new THREE.TubeGeometry(capCurve, 32, 0.025, 8, false);
    const cap = new THREE.Mesh(capGeo, copper);
    plumbingGroup.add(cap);
  }

  // Sintered heat exchangers along lines (small discs)
  for (let h = 0; h < 6; h++) {
    const hexGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16);
    const hex = new THREE.Mesh(hexGeo, silverShield);
    hex.position.set(0, 5.0 - h * 1.5, 0);
    plumbingGroup.add(hex);
  }

  group.add(plumbingGroup);

  // ──────────────────────────────────────────────────────────────────────
  // CONTROL / ELECTRONICS RACK
  // ──────────────────────────────────────────────────────────────────────
  const controlGroup = new THREE.Group();

  // Main rack enclosure
  const rackGeo = new THREE.BoxGeometry(2.0, 4.0, 1.0);
  const rack = new THREE.Mesh(rackGeo, darkSteel);
  rack.position.set(6.0, -2.0, 0);
  controlGroup.add(rack);

  // Temperature display screen (nanokelvin readout)
  const screenGeo = new THREE.PlaneGeometry(1.4, 0.6);
  const tempScreen = new THREE.Mesh(screenGeo, screenGlow);
  tempScreen.position.set(5.0, -0.8, 0.51);
  controlGroup.add(tempScreen);

  // Screen bezel
  const bezelShape = new THREE.Shape();
  bezelShape.moveTo(-0.75, -0.35);
  bezelShape.lineTo(0.75, -0.35);
  bezelShape.lineTo(0.75, 0.35);
  bezelShape.lineTo(-0.75, 0.35);
  bezelShape.lineTo(-0.75, -0.35);
  const bezelHole = new THREE.Path();
  bezelHole.moveTo(-0.7, -0.3);
  bezelHole.lineTo(0.7, -0.3);
  bezelHole.lineTo(0.7, 0.3);
  bezelHole.lineTo(-0.7, 0.3);
  bezelHole.lineTo(-0.7, -0.3);
  bezelShape.holes.push(bezelHole);
  const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, { depth: 0.05, bevelEnabled: false });
  const bezel = new THREE.Mesh(bezelGeo, plastic);
  bezel.position.set(5.0, -0.8, 0.52);
  controlGroup.add(bezel);

  // Secondary pressure gauge screens
  for (let s = 0; s < 3; s++) {
    const miniScreenGeo = new THREE.PlaneGeometry(0.5, 0.3);
    const miniScreenMat = new THREE.MeshStandardMaterial({
      color: 0x001100, emissive: 0x00cc44, emissiveIntensity: 0.9
    });
    const miniScreen = new THREE.Mesh(miniScreenGeo, miniScreenMat);
    miniScreen.position.set(5.0, -1.8 - s * 0.5, 0.51);
    controlGroup.add(miniScreen);
  }

  // Knobs and dials
  for (let k = 0; k < 6; k++) {
    const knobGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
    const knob = new THREE.Mesh(knobGeo, chrome);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(5.5 + (k % 3) * 0.3, -2.8 - Math.floor(k / 3) * 0.4, 0.55);
    controlGroup.add(knob);
  }

  // LED status indicators
  const ledColors = [0x00ff00, 0x00ff00, 0xffaa00, 0xff0000, 0x00ff00, 0x00aaff, 0x00ff00, 0xffaa00];
  for (let l = 0; l < ledColors.length; l++) {
    const ledGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const ledMat = new THREE.MeshStandardMaterial({
      color: ledColors[l], emissive: ledColors[l], emissiveIntensity: 2.0
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(5.15 + (l % 4) * 0.2, -0.3, 0.52);
    controlGroup.add(led);
  }

  // Cable bundles from rack to cryostat
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(5.0, 0, 0),
    new THREE.Vector3(4.0, 1.0, 0.5),
    new THREE.Vector3(3.0, 2.0, 0.3),
    new THREE.Vector3(2.0, 3.0, 0)
  ]);
  for (let cb = 0; cb < 8; cb++) {
    const offset = (cb - 4) * 0.04;
    const cablePoints = cableCurve.getPoints(32).map(p =>
      new THREE.Vector3(p.x + offset, p.y, p.z + offset * 0.5)
    );
    const cableCurveMod = new THREE.CatmullRomCurve3(cablePoints);
    const cableGeo = new THREE.TubeGeometry(cableCurveMod, 32, 0.015, 6, false);
    const cableColors = [0x0000ff, 0xff0000, 0x00ff00, 0xffff00, 0xff8800, 0x8800ff, 0x00ffff, 0xffffff];
    const cableMat = new THREE.MeshStandardMaterial({ color: cableColors[cb], roughness: 0.6 });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    controlGroup.add(cable);
  }

  group.add(controlGroup);

  // ──────────────────────────────────────────────────────────────────────
  // OPTICAL TABLE PLATFORM
  // ──────────────────────────────────────────────────────────────────────
  const tableGroup = new THREE.Group();

  // Optical breadboard (honeycomb-core platform)
  const tableGeo = new THREE.BoxGeometry(12, 0.4, 8);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.3 });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.y = -6.8;
  tableGroup.add(table);

  // Tapped hole grid pattern
  for (let hx = -22; hx <= 22; hx++) {
    for (let hz = -15; hz <= 15; hz++) {
      const holeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 6);
      const hole = new THREE.Mesh(holeGeo, chrome);
      hole.position.set(hx * 0.25, -6.58, hz * 0.25);
      tableGroup.add(hole);
    }
  }

  // Table legs with pneumatic vibration isolators
  for (let leg = 0; leg < 4; leg++) {
    const lx = (leg < 2 ? -5 : 5);
    const lz = (leg % 2 === 0 ? -3.5 : 3.5);
    const legGeo = new THREE.CylinderGeometry(0.15, 0.2, 2.5, 12);
    const legMesh = new THREE.Mesh(legGeo, darkSteel);
    legMesh.position.set(lx, -8.25, lz);
    tableGroup.add(legMesh);

    // Pneumatic isolator bellows
    for (let b = 0; b < 4; b++) {
      const isoGeo = new THREE.TorusGeometry(0.22, 0.03, 8, 16);
      const iso = new THREE.Mesh(isoGeo, rubber);
      iso.rotation.x = Math.PI / 2;
      iso.position.set(lx, -9.3 - b * 0.12, lz);
      tableGroup.add(iso);
    }
  }

  group.add(tableGroup);

  // ──────────────────────────────────────────────────────────────────────
  // LASER SOURCES ON OPTICAL TABLE
  // ──────────────────────────────────────────────────────────────────────
  const laserSourceGroup = new THREE.Group();

  // Three laser source units
  const laserBodyGeo = new THREE.BoxGeometry(0.8, 0.4, 0.4);
  const laserNames = ['780nm Rb', '767nm K', '1064nm Dipole'];
  const laserMatList = [laserRed, laserBlue, laserGreen];
  for (let ls = 0; ls < 3; ls++) {
    const laserBody = new THREE.Mesh(laserBodyGeo, darkSteel);
    laserBody.position.set(-4 + ls * 3, -6.4, -3);
    laserSourceGroup.add(laserBody);

    // Emission aperture
    const apertGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 12);
    const apert = new THREE.Mesh(apertGeo, laserMatList[ls]);
    apert.rotation.x = Math.PI / 2;
    apert.position.set(-4 + ls * 3, -6.3, -2.78);
    laserSourceGroup.add(apert);

    // Power indicator LED
    const pLedGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const pLed = new THREE.Mesh(pLedGeo, new THREE.MeshStandardMaterial({
      color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0
    }));
    pLed.position.set(-3.7 + ls * 3, -6.2, -2.8);
    laserSourceGroup.add(pLed);
  }

  // Mirrors and beam-steering optics on table
  for (let m = 0; m < 8; m++) {
    const mirrorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeff, metalness: 1.0, roughness: 0.0
    });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    const mx = -4 + (m % 4) * 2.5;
    const mz = -2 + Math.floor(m / 4) * 4;
    mirror.position.set(mx, -6.45, mz);
    mirror.rotation.x = Math.PI / 4;
    mirror.rotation.y = m * 0.3;
    laserSourceGroup.add(mirror);

    // Mirror mount post
    const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
    const post = new THREE.Mesh(postGeo, chrome);
    post.position.set(mx, -6.65, mz);
    laserSourceGroup.add(post);
  }

  group.add(laserSourceGroup);

  // ──────────────────────────────────────────────────────────────────────
  // NEON ACCENT RINGS & CRYO STATUS GLOW
  // ──────────────────────────────────────────────────────────────────────
  const neonGroup = new THREE.Group();
  const neonRingSizes = [3.9, 3.25, 2.55, 1.85];
  const neonMats = [neonCyan, neonPurple, neonCyan, neonPurple];
  const neonYPositions = [5.8, 5.0, 4.0, 3.0];
  const neonMeshes = [];

  for (let n = 0; n < neonRingSizes.length; n++) {
    const neonGeo = new THREE.TorusGeometry(neonRingSizes[n], 0.025, 8, 64);
    const neonRing = new THREE.Mesh(neonGeo, neonMats[n].clone());
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = neonYPositions[n];
    neonMeshes.push(neonRing);
    neonGroup.add(neonRing);
  }
  group.add(neonGroup);

  // ──────────────────────────────────────────────────────────────────────
  // EXHAUST / VENT SYSTEM — Helium recovery vent
  // ──────────────────────────────────────────────────────────────────────
  const ventGroup = new THREE.Group();
  const ventPipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.8, 5.0, 0),
    new THREE.Vector3(-5.0, 6.0, 0),
    new THREE.Vector3(-5.5, 8.0, 0),
    new THREE.Vector3(-5.0, 10.0, 0)
  ]);
  const ventPipeGeo = new THREE.TubeGeometry(ventPipeCurve, 32, 0.15, 12, false);
  const ventPipe = new THREE.Mesh(ventPipeGeo, aluminum);
  ventGroup.add(ventPipe);

  // Safety relief valve
  const reliefGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.4, 12);
  const relief = new THREE.Mesh(reliefGeo, chrome);
  relief.position.set(-5.3, 9.0, 0);
  ventGroup.add(relief);

  // Pressure gauge
  const gaugeGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const gauge = new THREE.Mesh(gaugeGeo, new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffeedd, emissiveIntensity: 0.3
  }));
  gauge.position.set(-5.0, 7.5, 0.2);
  ventGroup.add(gauge);

  group.add(ventGroup);

  // ──────────────────────────────────────────────────────────────────────
  // CRYOCOOLER HEAD (Pulse Tube) — mounted on top
  // ──────────────────────────────────────────────────────────────────────
  const cryocoolerGroup = new THREE.Group();

  // Compressor head housing
  const compressorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 24);
  const compressor = new THREE.Mesh(compressorGeo, darkSteel);
  compressor.position.y = 7.5;
  cryocoolerGroup.add(compressor);

  // Pulse tube cold finger
  const coldFingerGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.0, 16);
  const coldFinger = new THREE.Mesh(coldFingerGeo, copper);
  coldFinger.position.y = 5.2;
  cryocoolerGroup.add(coldFinger);

  // Regenerator housing
  const regenGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.0, 16);
  const regen = new THREE.Mesh(regenGeo, aluminum);
  regen.position.set(0.5, 6.5, 0);
  cryocoolerGroup.add(regen);

  // Flex lines from compressor
  const flexCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.6, 8.0, 0),
    new THREE.Vector3(2.0, 9.0, 0.5),
    new THREE.Vector3(4.0, 9.5, 0)
  ]);
  const flexGeo = new THREE.TubeGeometry(flexCurve, 24, 0.1, 8, false);
  const flex = new THREE.Mesh(flexGeo, rubber);
  cryocoolerGroup.add(flex);

  // Cooling fins on compressor
  for (let fin = 0; fin < 12; fin++) {
    const finGeo = new THREE.BoxGeometry(1.4, 0.03, 0.6);
    const finMesh = new THREE.Mesh(finGeo, aluminum);
    finMesh.position.set(0, 7.0 + fin * 0.08, 0);
    cryocoolerGroup.add(finMesh);
  }

  group.add(cryocoolerGroup);

  // ──────────────────────────────────────────────────────────────────────
  // THERMOMETRY WIRING — Ruthenium Oxide sensor leads
  // ──────────────────────────────────────────────────────────────────────
  const thermometryGroup = new THREE.Group();
  const sensorPositions = [
    { y: 5.0, label: '77K Stage' },
    { y: 3.5, label: '4K Stage' },
    { y: 1.0, label: '1K Pot' },
    { y: -1.5, label: 'MOT Center' },
    { y: -3.5, label: 'Nuclear Stage' },
    { y: -4.3, label: 'Cold Plate' }
  ];

  for (const sensor of sensorPositions) {
    // Sensor chip
    const chipGeo = new THREE.BoxGeometry(0.08, 0.08, 0.04);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x333333, emissive: 0x004400, emissiveIntensity: 0.3
    });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(1.5, sensor.y, 0);
    thermometryGroup.add(chip);

    // Fine wiring from sensor to feedthrough
    const wireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.5, sensor.y, 0),
      new THREE.Vector3(2.0, sensor.y + 0.5, 0.2),
      new THREE.Vector3(3.5, 6.0, 0.1),
      new THREE.Vector3(3.8, 6.5, 0)
    ]);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 24, 0.008, 4, false);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xddaa00 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    thermometryGroup.add(wire);
  }

  group.add(thermometryGroup);

  // ──────────────────────────────────────────────────────────────────────
  // SMOKE / EVAPORATED HELIUM PARTICLES (Instanced for performance)
  // ──────────────────────────────────────────────────────────────────────
  const smokeCount = 200;
  const smokeGeo = new THREE.SphereGeometry(0.04, 4, 4);
  const smokeMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc, transparent: true, opacity: 0.3
  });
  const smokeInstanced = new THREE.InstancedMesh(smokeGeo, smokeMat, smokeCount);
  const smokeDummy = new THREE.Object3D();
  const smokeData = [];

  for (let s = 0; s < smokeCount; s++) {
    const sx = -5.0 + (Math.random() - 0.5) * 0.6;
    const sy = 10.0 + Math.random() * 3.0;
    const sz = (Math.random() - 0.5) * 0.6;
    smokeData.push({ x: sx, y: sy, z: sz, speed: 0.005 + Math.random() * 0.02, phase: Math.random() * Math.PI * 2 });
    smokeDummy.position.set(sx, sy, sz);
    smokeDummy.scale.setScalar(0.5 + Math.random() * 1.5);
    smokeDummy.updateMatrix();
    smokeInstanced.setMatrixAt(s, smokeDummy.matrix);
  }
  smokeInstanced.instanceMatrix.needsUpdate = true;
  group.add(smokeInstanced);

  // ──────────────────────────────────────────────────────────────────────
  // MESH REFERENCES for animation
  // ──────────────────────────────────────────────────────────────────────
  const meshes = {
    beamMeshes,
    becCloud,
    thermalHalo,
    solenoid,
    nucMag,
    atomInstanced,
    atomData,
    atomDummy,
    neonMeshes,
    smokeInstanced,
    smokeData,
    smokeDummy,
    saltPill,
    heatSwitch,
    ahCoilTop,
    ahCoilBot,
    coldFinger,
    tempScreen
  };

  // ──────────────────────────────────────────────────────────────────────
  // PARTS DATABASE
  // ──────────────────────────────────────────────────────────────────────
  const parts = [
    {
      name: 'Outer Vacuum Vessel',
      description: 'Double-walled stainless steel dewar providing ultra-high vacuum (<1e-9 mbar) thermal isolation. Features CF flanges with copper gasket seals and optical viewport ports for laser beam access.',
      material: '316L Stainless Steel',
      function: 'Provides primary vacuum insulation to eliminate convective and conductive heat transfer from room temperature (300K) to the cryogenic stages.',
      assemblyOrder: 1,
      connections: ['Top Flange', 'Bottom Flange', 'Viewport Ports', 'Vacuum Pump Port'],
      failureEffect: 'Vacuum breach causes immediate cryogen boil-off and thermal runaway; temperature rises from millikelvin to 300K within minutes.',
      cascadeFailures: ['77K Copper Shield', 'All Inner Stages', 'BEC Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -8, y: 0, z: 0 }
    },
    {
      name: '77K Copper Radiation Shield',
      description: 'Oxygen-free high-conductivity copper (OFHC) thermal radiation shield thermally anchored to liquid nitrogen temperature. Gold-plated interior minimizes emissivity to <0.02.',
      material: 'OFHC Copper with Gold Plating',
      function: 'Intercepts 300K thermal radiation from the outer vessel, reducing radiative heat load on the 4K stage by >99%.',
      assemblyOrder: 2,
      connections: ['Outer Vessel', '4K Silver Shield', 'LN2 Supply'],
      failureEffect: 'Massive radiative heat load on 4K stage; helium boil-off rate increases 100x, making sub-kelvin operation impossible.',
      cascadeFailures: ['4K Silver Shield', 'Salt Pill', 'Nuclear Stage'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -5, y: 1, z: 0 }
    },
    {
      name: '4K Silver Radiation Shield',
      description: 'Silver-plated copper shield thermally anchored to the 4K pulse tube cooler second stage. Multi-layer superinsulation (MLI) wraps between this and the 77K stage.',
      material: 'Silver-plated OFHC Copper',
      function: 'Provides secondary radiation interception at liquid helium temperature, shielding the millikelvin stages from residual 77K radiation.',
      assemblyOrder: 3,
      connections: ['77K Shield', 'Gold Shield', 'Pulse Tube 2nd Stage'],
      failureEffect: 'Heat leak to ADR salt pill exceeds cooling power; base temperature rises from mK to >1K.',
      cascadeFailures: ['Gold Shield', 'ADR Assembly', 'BEC Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -3, y: 2, z: 0 }
    },
    {
      name: 'mK Gold Radiation Shield',
      description: 'Innermost gold-plated radiation shield at millikelvin temperatures. Provides the final radiation barrier protecting the nuclear demagnetization stage and experimental volume.',
      material: 'Gold-plated Silver',
      function: 'Eliminates residual photon heat load on the sub-millikelvin experimental space; total heat leak <1 nanowatt.',
      assemblyOrder: 4,
      connections: ['Silver Shield', 'Nuclear Stage', 'Cold Plate'],
      failureEffect: 'Stray radiation heats nuclear stage above demagnetization cooling limit; picokelvin regime unachievable.',
      cascadeFailures: ['Nuclear Stage', 'BEC Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -1, y: 3, z: 0 }
    },
    {
      name: 'Magneto-Optical Trap (MOT)',
      description: 'Six counter-propagating laser beams (780nm for Rb-87) with anti-Helmholtz coil pair creating a 3D quadrupole magnetic field. Traps and cools ~10^9 atoms to ~100 µK.',
      material: 'Fused Silica Optics, Copper Coils',
      function: 'First-stage laser cooling: photon momentum transfer decelerates atoms via radiation pressure. Doppler cooling limit ~140 µK for Rb-87.',
      assemblyOrder: 7,
      connections: ['Laser Sources', 'Anti-Helmholtz Coils', 'Vacuum Chamber'],
      failureEffect: 'No initial atom trapping; entire cooling chain fails. Cannot proceed to evaporative cooling or BEC formation.',
      cascadeFailures: ['Evaporative Cooling', 'BEC Core', 'All Downstream Experiments'],
      originalPosition: { x: 0, y: -1.5, z: 0 },
      explodedPosition: { x: 3, y: -1.5, z: 4 }
    },
    {
      name: 'Anti-Helmholtz Coil Pair',
      description: 'Matched pair of current-carrying coils in anti-Helmholtz configuration producing a linear magnetic field gradient (∂B/∂z ~ 15 G/cm) at the trap center.',
      material: 'Kapton-insulated Copper Wire',
      function: 'Creates the position-dependent Zeeman shift necessary for spatially-dependent radiation pressure, confining atoms to the trap center.',
      assemblyOrder: 6,
      connections: ['MOT Assembly', 'Current Supply', 'Water Cooling'],
      failureEffect: 'Loss of magnetic confinement; atoms escape trap volume. MOT cloud disperses.',
      cascadeFailures: ['MOT', 'BEC Core'],
      originalPosition: { x: 0, y: -1.5, z: 0 },
      explodedPosition: { x: 5, y: -0.5, z: 3 }
    },
    {
      name: 'ADR Superconducting Solenoid',
      description: 'NbTi superconducting magnet generating up to 6 Tesla field for adiabatic demagnetization of the paramagnetic salt pill. Persistent-mode switch enables field decay over hours.',
      material: 'NbTi in Cu-Ni Matrix',
      function: 'Magnetizes the paramagnetic salt (GGG) at constant temperature, then field ramp-down performs adiabatic demagnetization cooling from 4K to ~50 mK.',
      assemblyOrder: 5,
      connections: ['Salt Pill', 'Heat Switch', 'Magnet Power Supply'],
      failureEffect: 'Quench event: sudden transition to normal state releases stored magnetic energy as heat, potentially damaging thermal stages.',
      cascadeFailures: ['Salt Pill', 'Heat Switch', 'Nuclear Stage'],
      originalPosition: { x: 0, y: 0.5, z: 0 },
      explodedPosition: { x: 2, y: 3, z: -3 }
    },
    {
      name: 'Paramagnetic Salt Pill (GGG)',
      description: 'Gadolinium Gallium Garnet (Gd₃Ga₅O₁₂) single crystal with embedded gold wire thermal links. Entropy reservoir for adiabatic demagnetization cooling.',
      material: 'Gd₃Ga₅O₁₂ Crystal with Au Wires',
      function: 'Stores magnetic entropy at high field; isentropic demagnetization converts magnetic entropy reduction to thermal cooling, reaching T_base ~ 50 mK.',
      assemblyOrder: 8,
      connections: ['ADR Solenoid', 'Heat Switch', 'Thermal Bus Bars'],
      failureEffect: 'Crystal fracture from thermal cycling destroys thermal contact; ADR stage cannot cool below 4K.',
      cascadeFailures: ['Nuclear Stage', 'Cold Plate'],
      originalPosition: { x: 0, y: 0.5, z: 0 },
      explodedPosition: { x: 0, y: 5, z: -4 }
    },
    {
      name: 'Mechanical Heat Switch',
      description: 'Superconducting tin heat switch with beryllium copper spring mechanism. Toggles thermal link between salt pill and 4K bath for the ADR cycle.',
      material: 'BeCu Spring, Sn Contact Pads',
      function: 'CLOSED: thermally links salt pill to 4K bath for isothermal magnetization. OPEN: isolates salt pill for adiabatic demagnetization cooling.',
      assemblyOrder: 9,
      connections: ['Salt Pill', '4K Bath', 'Actuator Motor'],
      failureEffect: 'Stuck closed: salt pill cannot cool below 4K. Stuck open: salt pill cannot reject heat, limiting duty cycle.',
      cascadeFailures: ['ADR Cooling Cycle'],
      originalPosition: { x: 0, y: 2.0, z: 0 },
      explodedPosition: { x: -2, y: 5, z: 2 }
    },
    {
      name: 'Nuclear Demagnetization Stage',
      description: 'Bundle of 10,000 annealed OFHC copper wires (25µm diameter each) in a 9T superconducting solenoid. Nuclear spin entropy of Cu-63/65 provides cooling to <100 µK.',
      material: 'Annealed OFHC Copper (RRR>1000)',
      function: 'Nuclear adiabatic demagnetization: aligns nuclear magnetic moments at high field/low T, then demagnetization cools the nuclear spin system to picokelvin temperatures.',
      assemblyOrder: 10,
      connections: ['ADR Cold Plate', 'Nuclear Solenoid', 'Experimental Cell'],
      failureEffect: 'Eddy current heating from vibrations overwhelms nuclear cooling power (~nanowatts); cannot reach sub-microkelvin regime.',
      cascadeFailures: ['Cold Plate', 'BEC Core'],
      originalPosition: { x: 0, y: -3.5, z: 0 },
      explodedPosition: { x: 0, y: -8, z: -3 }
    },
    {
      name: 'Pulse Tube Cryocooler',
      description: 'Two-stage Gifford-McMahon / pulse tube hybrid cooler providing 1.5W at 4.2K and 40W at 77K. No cold moving parts eliminates vibration coupling to experiment.',
      material: 'Stainless Steel, Rare Earth Regenerator',
      function: 'Provides continuous cryogenic cooling to thermally anchor the 77K and 4K radiation shields without requiring liquid cryogen transfers.',
      assemblyOrder: 11,
      connections: ['He Compressor', '77K Shield', '4K Shield'],
      failureEffect: 'Loss of base cooling; all shields warm to room temperature within 6-12 hours. System must be thermally recycled (3-day cooldown).',
      cascadeFailures: ['All Radiation Shields', 'ADR', 'Nuclear Stage'],
      originalPosition: { x: 0, y: 7.5, z: 0 },
      explodedPosition: { x: 0, y: 12, z: 0 }
    },
    {
      name: 'Bose-Einstein Condensate Core',
      description: 'The quantum degenerate gas formed when ~10^6 Rb-87 atoms are cooled below the critical temperature T_c ≈ 170 nK. Exhibits macroscopic quantum coherence and superfluidity.',
      material: 'Rb-87 Atomic Gas',
      function: 'Demonstrates macroscopic occupation of the ground state; used for precision measurements, quantum simulation, and tests of fundamental physics.',
      assemblyOrder: 12,
      connections: ['MOT', 'Magnetic Trap', 'RF Evaporation'],
      failureEffect: 'Condensate lost due to heating, three-body recombination, or trap instability; must reload atoms from MOT (5-minute cycle).',
      cascadeFailures: ['All Quantum Experiments'],
      originalPosition: { x: 0, y: -1.5, z: 0 },
      explodedPosition: { x: 0, y: -1.5, z: 6 }
    },
    {
      name: 'Helium-3/4 Plumbing System',
      description: 'Network of sintered silver heat exchangers, capillary impedance tubes, and continuous/single-shot dilution unit connecting the still, mixing chamber, and cold plate.',
      material: 'CuNi Capillaries, Sintered Ag HEX',
      function: 'Circulates He-3/He-4 mixture through the dilution unit, extracting heat via the enthalpy of mixing at the phase boundary.',
      assemblyOrder: 13,
      connections: ['Still', 'Mixing Chamber', 'Cold Plate', 'Gas Handling System'],
      failureEffect: 'Blocked impedance line stops circulation; mixing chamber warms above 100 mK. Leak introduces He-4 film creep.',
      cascadeFailures: ['Cold Plate', 'Nuclear Stage'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 4, y: 2, z: -2 }
    },
    {
      name: 'Temperature Readout & Control System',
      description: 'Multi-channel AC resistance bridge (AVS-48 equivalent) reading RuO₂, Cernox, and LCMN thermometers from 300K to sub-millikelvin. PID feedback controls heaters and magnet ramp.',
      material: 'Electronics, RuO₂ Chip Sensors',
      function: 'Provides precision thermometry across 9 decades of temperature (300K to 100µK) and closed-loop feedback for automated ADR cycling.',
      assemblyOrder: 14,
      connections: ['All Thermometers', 'Heater Lines', 'Magnet PSU', 'Computer'],
      failureEffect: 'Loss of temperature monitoring makes cooling cycle blind; risk of quench from uncontrolled magnet ramp or thermal runaway.',
      cascadeFailures: ['ADR Cycle Control', 'Safety Interlocks'],
      originalPosition: { x: 6, y: -2, z: 0 },
      explodedPosition: { x: 10, y: -2, z: 0 }
    },
    {
      name: 'Laser Source Array (780/767/1064 nm)',
      description: 'External cavity diode lasers (ECDL) frequency-locked to Rb-87 D2 line (780.241 nm) via saturated absorption spectroscopy. Includes AOMs for frequency shifting and intensity control.',
      material: 'GaAlAs Laser Diode, Invar Cavity',
      function: 'Provides narrow-linewidth (<1 MHz) laser light for MOT cooling, repumping, imaging, and optical dipole trapping of ultracold atoms.',
      assemblyOrder: 15,
      connections: ['Optical Fibers', 'AOM Drivers', 'MOT Beams', 'Lock Electronics'],
      failureEffect: 'Mode-hop or unlock causes immediate atom loss from MOT; frequency drift >10 MHz makes cooling ineffective.',
      cascadeFailures: ['MOT', 'BEC Formation'],
      originalPosition: { x: -4, y: -6.4, z: -3 },
      explodedPosition: { x: -8, y: -10, z: -6 }
    },
    {
      name: 'Vibration Isolation Table',
      description: 'Pneumatically-floated honeycomb-core optical breadboard (Newport RS-4000 equivalent) with 1-3 Hz resonant frequency. Provides >20 dB isolation above 10 Hz.',
      material: 'Stainless Steel Honeycomb, Pneumatic Legs',
      function: 'Isolates the entire cryostat and optics from building vibrations that would cause eddy current heating in the nuclear stage and destroy BEC coherence.',
      assemblyOrder: 16,
      connections: ['Building Floor', 'Cryostat Base', 'All Optics'],
      failureEffect: 'Vibrational heating exceeds nuclear stage cooling power; base temperature rises from µK to mK range.',
      cascadeFailures: ['Nuclear Stage', 'BEC Lifetime'],
      originalPosition: { x: 0, y: -6.8, z: 0 },
      explodedPosition: { x: 0, y: -12, z: 0 }
    }
  ];

  // ──────────────────────────────────────────────────────────────────────
  // QUIZ QUESTIONS — PhD-level Thermodynamics & Quantum Gas Physics
  // ──────────────────────────────────────────────────────────────────────
  const quizQuestions = [
    {
      question: 'The critical temperature for Bose-Einstein condensation of a non-interacting gas of N bosons in a 3D harmonic trap is given by T_c = (ℏω̄/k_B)(N/ζ(3))^(1/3). For Rb-87 with ω̄/2π = 100 Hz and N = 10^6 atoms, T_c is approximately:',
      options: [
        '170 nanokelvin',
        '2.17 kelvin (the lambda point of He-4)',
        '14 microkelvin (the Doppler cooling limit)',
        '1 millikelvin (typical ADR base temperature)'
      ],
      correct: 0,
      explanation: 'For a harmonically trapped ideal Bose gas, T_c = (ℏω̄/k_B)(N/ζ(3))^(1/3) where ζ(3) ≈ 1.202. With ω̄/2π = 100 Hz and N = 10^6, this yields T_c ≈ 170 nK. This is vastly lower than the lambda point of bulk He-4 (2.17K) because the atomic density in a dilute gas trap is ~10^14 cm⁻³ vs ~10^22 cm⁻³ in liquid helium. The de Broglie wavelength must become comparable to the interparticle spacing for quantum degeneracy.'
    },
    {
      question: 'In adiabatic demagnetization refrigeration (ADR), cooling occurs because the entropy of the paramagnetic salt at zero field satisfies S(B=0, T_f) = S(B_max, T_i). Which thermodynamic relation correctly describes the minimum achievable temperature T_f?',
      options: [
        'T_f = T_i × (B_final / B_initial) — direct proportionality via the Curie law regime',
        'T_f = T_i × exp(-B_initial / B_final) — exponential cooling from Boltzmann factor',
        'T_f = T_i / ln(B_initial / B_final) — logarithmic dependence from partition function',
        'T_f = T_i × (B_initial / B_final)² — quadratic scaling from magnetization energy'
      ],
      correct: 0,
      explanation: 'In the Curie law regime where the paramagnetic susceptibility χ ∝ 1/T, the entropy S(B,T) depends only on B/T. Therefore, isentropic (adiabatic) demagnetization from (B_i, T_i) to (B_f, T_f) requires B_i/T_i = B_f/T_f, giving T_f = T_i × (B_f/B_i). With B_i = 6T, B_f ~ Earth\'s field (~50 µT), and T_i = 4K, we get T_f ≈ 33 µK. In practice, the Schottky anomaly and residual heat loads limit T_f to ~50 mK for electronic paramagnets like GGG.'
    },
    {
      question: 'The Debye model predicts that the specific heat of a crystalline solid at temperatures T << Θ_D (Debye temperature) follows C_V = (12π⁴/5)Nk_B(T/Θ_D)³. This "T³ law" arises from:',
      options: [
        'The density of states of acoustic phonons scaling as ω² combined with the Planck distribution in the low-temperature limit',
        'Three-body phonon-phonon scattering processes that dominate at low temperature',
        'Quantum tunneling of atoms between lattice sites creating a T³ correction to the classical Dulong-Petit value',
        'Anharmonic corrections to the harmonic lattice potential becoming dominant below Θ_D'
      ],
      correct: 0,
      explanation: 'The Debye T³ law emerges from two factors: (1) the acoustic phonon density of states g(ω) ∝ ω² (from the 3D density of states with linear dispersion ω = v|k|), and (2) the Bose-Einstein occupation factor n(ω) ≈ exp(-ℏω/k_BT) which at low T exponentially suppresses all modes with ℏω >> k_BT. The integral over the product g(ω)×E(ω)×n(ω) then scales as T³ when the upper limit can be extended to infinity (valid for T << Θ_D). This is a purely harmonic, quantum statistical result — not related to anharmonicity or tunneling.'
    },
    {
      question: 'Nuclear adiabatic demagnetization of copper can reach temperatures below 1 microkelvin. The nuclear spin entropy of Cu-63 (I = 3/2) in a magnetic field B at temperature T is S = Nk_B[ln(2I+1) - (I(I+1)μ_N²g_N²B²)/(6k_B²T²)]. What limits the minimum achievable nuclear spin temperature?',
      options: [
        'The residual internal field from RKKY interactions between nuclear moments (~0.3 mT for Cu), which prevents complete demagnetization to zero effective field',
        'The Heisenberg uncertainty principle limiting the precision of the external field measurement',
        'Superconducting screening currents in the copper that prevent field penetration',
        'Nuclear spin-lattice relaxation time τ₁ becoming shorter than the demagnetization ramp time'
      ],
      correct: 0,
      explanation: 'Even at zero external field, the nuclear spins in metallic copper experience an effective internal field B_int ≈ 0.36 mT due to RKKY (Ruderman-Kittel-Kasuya-Yosida) indirect exchange interactions mediated by conduction electrons. This sets a fundamental minimum temperature T_min ≈ T_i × (B_int/B_external). With B_ext = 8T and T_i = 10 mK, T_min ≈ 0.45 µK. The spin-lattice relaxation time τ₁ ∝ 1/T actually becomes extremely long (hours to days) at these temperatures due to the Korringa relation τ₁T = κ, which is an advantage, not a limitation.'
    },
    {
      question: 'In a magneto-optical trap (MOT), the Doppler cooling limit T_D = ℏΓ/(2k_B) for Rb-87 (Γ/2π = 6.07 MHz) is ~146 µK. Sub-Doppler temperatures (~10 µK) observed in optical molasses are explained by:',
      options: [
        'Sisyphus cooling in the polarization gradient of counter-propagating beams with orthogonal linear polarizations (lin⊥lin configuration)',
        'Stimulated Raman transitions between ground-state hyperfine levels driven by the trapping beams',
        'Evaporative cooling occurring naturally as the hottest atoms escape the finite-depth optical potential',
        'Recoil heating being suppressed by destructive quantum interference of scattered photon momenta'
      ],
      correct: 0,
      explanation: 'Sub-Doppler cooling in optical molasses is explained by the Sisyphus mechanism (Dalibard & Cohen-Tannoudji, 1989). In a lin⊥lin standing wave, the polarization alternates between σ⁺ and σ⁻ with period λ/2. Atoms in motion experience optical pumping between ground-state Zeeman sublevels with different AC Stark shifts. An atom moving from a potential minimum to maximum is optically pumped to the lower-energy sublevel at the top, losing kinetic energy — like Sisyphus repeatedly climbing the hill. The new limit is the recoil temperature T_r = ℏ²k²/(mk_B) ≈ 360 nK for Rb-87. This mechanism requires J_g > 0 ground states with multiple Zeeman sublevels.'
    }
  ];

  // ──────────────────────────────────────────────────────────────────────
  // DESCRIPTION
  // ──────────────────────────────────────────────────────────────────────
  const description = `Absolute Zero Cryochamber — a multi-stage ultra-low temperature apparatus combining laser cooling, adiabatic demagnetization refrigeration (ADR), and nuclear spin demagnetization to approach absolute zero within picokelvins.

The system features nested vacuum chambers with gold, silver, and copper radiation shields providing staged thermal isolation from 300K to sub-millikelvin temperatures. A magneto-optical trap (MOT) with six counter-propagating laser beams and anti-Helmholtz coils captures and cools ~10⁹ rubidium-87 atoms to ~100 µK via radiation pressure.

Evaporative cooling in a magnetic trap further reduces temperature to ~170 nK, crossing the BEC phase transition where atoms condense into a single macroscopic quantum state — a Bose-Einstein condensate exhibiting superfluidity and matter-wave coherence.

The ADR stage uses a 6T superconducting solenoid and gadolinium gallium garnet (GGG) paramagnetic salt pill to reach ~50 mK via isentropic demagnetization. The nuclear demagnetization stage, comprising 10,000 annealed copper wires in a 9T field, extends cooling to sub-microkelvin temperatures where nuclear spin ordering phenomena emerge.

Operating temperature: 100 pK to 300 K across stages. Cooling power: ~1 nW at 100 µK. Vibration isolation: pneumatic table with <1 nm displacement above 10 Hz.`;

  // ──────────────────────────────────────────────────────────────────────
  // ANIMATE — Hyper-synchronized cryogenic animations
  // ──────────────────────────────────────────────────────────────────────
  function animate(time, speed, refMeshes) {
    const m = refMeshes || meshes;
    const t = time * speed;

    // 1. LASER BEAMS — pulsating intensity and slight oscillation
    if (m.beamMeshes) {
      for (let i = 0; i < m.beamMeshes.length; i++) {
        const beam = m.beamMeshes[i];
        if (beam.material && beam.material.opacity !== undefined) {
          beam.material.opacity = 0.4 + 0.4 * Math.sin(t * 3.0 + i * 1.05);
          beam.material.emissiveIntensity = 1.0 + 0.8 * Math.sin(t * 4.0 + i * 0.8);
        }
        // Slight vibration simulating frequency modulation
        const vibAmp = 0.005;
        beam.position.x += Math.sin(t * 20 + i) * vibAmp * 0.1;
        beam.position.z += Math.cos(t * 20 + i) * vibAmp * 0.1;
      }
    }

    // 2. BEC CLOUD — breathing mode oscillation (quadrupole collective excitation)
    if (m.becCloud) {
      const breathe = 1.0 + 0.15 * Math.sin(t * 2.5);
      const quadrupole = 1.0 + 0.1 * Math.sin(t * 2.5 + Math.PI); // out of phase
      m.becCloud.scale.set(breathe, quadrupole * 0.6, breathe);
      m.becCloud.material.emissiveIntensity = 2.0 + 1.5 * Math.sin(t * 1.5);
      m.becCloud.material.opacity = 0.5 + 0.25 * Math.sin(t * 2.0);
    }

    // 3. THERMAL HALO — shrinks as atoms condense, pulses
    if (m.thermalHalo) {
      const condFraction = 0.5 + 0.3 * Math.sin(t * 0.5);
      m.thermalHalo.scale.setScalar(1.2 - condFraction * 0.4);
      m.thermalHalo.material.opacity = 0.08 + 0.07 * Math.sin(t * 1.2);
    }

    // 4. ADR SOLENOID — gentle pulsing glow simulating field ramp
    if (m.solenoid) {
      const fieldCycle = Math.sin(t * 0.3); // slow ADR cycle
      m.solenoid.material.emissiveIntensity = 0.1 + 0.3 * Math.abs(fieldCycle);
      m.solenoid.rotation.z = t * 0.02; // very slow rotation suggesting current flow
    }

    // 5. NUCLEAR MAGNET — counter-rotating glow
    if (m.nucMag) {
      m.nucMag.material.emissiveIntensity = 0.1 + 0.2 * Math.abs(Math.cos(t * 0.2));
      m.nucMag.rotation.z = -t * 0.015;
    }

    // 6. TRAPPED ATOMS — Brownian motion converging toward center (cooling)
    if (m.atomInstanced && m.atomData && m.atomDummy) {
      const cooling = 0.997; // damping factor simulating laser cooling
      for (let i = 0; i < m.atomData.length; i++) {
        const a = m.atomData[i];
        // Random kicks (photon recoil)
        a.vx += (Math.random() - 0.5) * 0.003;
        a.vy += (Math.random() - 0.5) * 0.003;
        a.vz += (Math.random() - 0.5) * 0.003;
        // Restoring force toward trap center
        a.vx -= a.x * 0.001;
        a.vy -= a.y * 0.001;
        a.vz -= a.z * 0.001;
        // Damping (cooling)
        a.vx *= cooling;
        a.vy *= cooling;
        a.vz *= cooling;
        // Update position
        a.x += a.vx;
        a.y += a.vy;
        a.z += a.vz;

        m.atomDummy.position.set(a.x, a.y - 1.5, a.z);
        m.atomDummy.updateMatrix();
        m.atomInstanced.setMatrixAt(i, m.atomDummy.matrix);
      }
      m.atomInstanced.instanceMatrix.needsUpdate = true;
    }

    // 7. NEON RINGS — cycling brightness and color shift
    if (m.neonMeshes) {
      for (let n = 0; n < m.neonMeshes.length; n++) {
        const ring = m.neonMeshes[n];
        ring.material.emissiveIntensity = 1.0 + 1.2 * Math.sin(t * 2.0 + n * Math.PI / 2);
        ring.material.opacity = 0.3 + 0.35 * Math.sin(t * 1.5 + n * 0.7);
        // Slight rotation
        ring.rotation.z = Math.sin(t * 0.5 + n) * 0.05;
      }
    }

    // 8. HELIUM EXHAUST SMOKE — rising and dispersing
    if (m.smokeInstanced && m.smokeData && m.smokeDummy) {
      for (let s = 0; s < m.smokeData.length; s++) {
        const sd = m.smokeData[s];
        sd.y += sd.speed;
        sd.x += Math.sin(t + sd.phase) * 0.005;
        sd.z += Math.cos(t * 0.7 + sd.phase) * 0.005;
        // Reset smoke particles that rise too high
        if (sd.y > 15) {
          sd.y = 10.0;
          sd.x = -5.0 + (Math.random() - 0.5) * 0.6;
          sd.z = (Math.random() - 0.5) * 0.6;
        }
        m.smokeDummy.position.set(sd.x, sd.y, sd.z);
        const scl = 0.5 + (sd.y - 10) * 0.15;
        m.smokeDummy.scale.setScalar(scl);
        m.smokeDummy.updateMatrix();
        m.smokeInstanced.setMatrixAt(s, m.smokeDummy.matrix);
      }
      m.smokeInstanced.instanceMatrix.needsUpdate = true;
    }

    // 9. SALT PILL — color shift indicating magnetocaloric cycle
    if (m.saltPill) {
      const mcCycle = Math.sin(t * 0.3);
      const r = 0.53 + 0.2 * mcCycle;
      const g = 0.67 - 0.15 * mcCycle;
      const b = 0.8 + 0.1 * mcCycle;
      m.saltPill.material.color.setRGB(r, g, b);
      m.saltPill.material.emissiveIntensity = 0.1 + 0.2 * Math.abs(mcCycle);
    }

    // 10. HEAT SWITCH — oscillating open/close
    if (m.heatSwitch) {
      const switchPos = Math.sin(t * 0.3);
      m.heatSwitch.scale.y = 0.8 + 0.4 * Math.abs(switchPos);
      m.heatSwitch.position.y = 0.5 + 0.2 * switchPos;
    }

    // 11. ANTI-HELMHOLTZ COILS — subtle pulsing showing current
    if (m.ahCoilTop && m.ahCoilBot) {
      m.ahCoilTop.material.emissiveIntensity = 0.1 + 0.15 * Math.sin(t * 5.0);
      m.ahCoilBot.material.emissiveIntensity = 0.1 + 0.15 * Math.sin(t * 5.0 + Math.PI);
    }

    // 12. COLD FINGER — slight vibration from pulse tube
    if (m.coldFinger) {
      m.coldFinger.position.x = Math.sin(t * 15) * 0.003;
      m.coldFinger.position.z = Math.cos(t * 15) * 0.003;
    }

    // 13. TEMPERATURE SCREEN — flickering readout
    if (m.tempScreen) {
      m.tempScreen.material.emissiveIntensity = 0.8 + 0.4 * Math.sin(t * 8.0);
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
