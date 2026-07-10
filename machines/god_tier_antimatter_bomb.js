// ============================================================================
// GOD TIER ANTIMATTER BOMB — Ultra-Realistic THREE.js Engineering Model
// Magnetically confined antihydrogen annihilation weapon system
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ── Custom High-Tech Materials ──────────────────────────────────────────
  const antiMatterGlow = new THREE.MeshStandardMaterial({
    color: 0x7700ff, emissive: 0x9900ff, emissiveIntensity: 2.2,
    transparent: true, opacity: 0.85, metalness: 0.3, roughness: 0.2
  });
  const annihilationFlash = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffaa, emissiveIntensity: 4.0,
    transparent: true, opacity: 0.0, metalness: 0.0, roughness: 0.1
  });
  const gammaRayGlow = new THREE.MeshStandardMaterial({
    color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 2.8,
    transparent: true, opacity: 0.6, metalness: 0.1, roughness: 0.1
  });
  const magneticFieldBlue = new THREE.MeshStandardMaterial({
    color: 0x0055ff, emissive: 0x0033cc, emissiveIntensity: 1.8,
    transparent: true, opacity: 0.35, metalness: 0.2, roughness: 0.3
  });
  const penningElectrode = new THREE.MeshStandardMaterial({
    color: 0xccccdd, emissive: 0x4444ff, emissiveIntensity: 0.6,
    metalness: 0.95, roughness: 0.08
  });
  const warningRed = new THREE.MeshStandardMaterial({
    color: 0xff0000, emissive: 0xff2200, emissiveIntensity: 1.5,
    metalness: 0.4, roughness: 0.3
  });
  const cryogenicBlue = new THREE.MeshStandardMaterial({
    color: 0x88ccff, emissive: 0x3388ff, emissiveIntensity: 0.9,
    metalness: 0.7, roughness: 0.15
  });
  const plasmaPurple = new THREE.MeshStandardMaterial({
    color: 0xcc00ff, emissive: 0xaa00ff, emissiveIntensity: 3.0,
    transparent: true, opacity: 0.55, metalness: 0.1, roughness: 0.1
  });
  const shieldComposite = new THREE.MeshStandardMaterial({
    color: 0x334455, emissive: 0x111122, emissiveIntensity: 0.15,
    metalness: 0.85, roughness: 0.25
  });
  const goldContact = new THREE.MeshStandardMaterial({
    color: 0xffcc00, emissive: 0xaa8800, emissiveIntensity: 0.3,
    metalness: 0.95, roughness: 0.05
  });
  const vacuumChamber = new THREE.MeshStandardMaterial({
    color: 0x99aabb, metalness: 0.92, roughness: 0.06,
    transparent: true, opacity: 0.25
  });
  const ceramicInsulator = new THREE.MeshStandardMaterial({
    color: 0xeeddcc, metalness: 0.05, roughness: 0.7
  });

  // Meshes tracking for animation
  const meshes = {
    antiAtoms: [], penningTraps: [], magneticCoils: [],
    gammaRays: [], annihilationSphere: null, outerShell: null,
    fieldLines: [], cryoPipes: [], failsafeIndicators: [],
    controlPanelScreens: [], plasmaRings: [], confinementRings: [],
    innerVessel: null, detonatorAssembly: null, warheadCore: null,
    electrodeStacks: [], superconductorCoils: [], vacuumPumps: [],
    sensorArrays: [], dataLinks: []
  };

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 1: OUTER BLAST SHIELDING — Multi-Layer Containment Vessel
  // ══════════════════════════════════════════════════════════════════════
  const outerShellGroup = new THREE.Group();

  // Primary blast shell — oblate spheroid using LatheGeometry
  const shellProfile = new THREE.Path();
  shellProfile.moveTo(0, -3.5);
  shellProfile.quadraticCurveTo(3.8, -3.5, 4.2, -1.0);
  shellProfile.quadraticCurveTo(4.5, 0, 4.2, 1.0);
  shellProfile.quadraticCurveTo(3.8, 3.5, 0, 3.5);
  const shellPts = shellProfile.getPoints(48);
  const shellGeo = new THREE.LatheGeometry(shellPts, 64);
  const outerShell = new THREE.Mesh(shellGeo, shieldComposite);
  outerShellGroup.add(outerShell);
  meshes.outerShell = outerShell;

  // Reinforcement ribs — 16 longitudinal ribs around the shell
  for (let i = 0; i < 16; i++) {
    const ribShape = new THREE.Shape();
    ribShape.moveTo(0, -3.4);
    ribShape.lineTo(0.06, -3.4);
    ribShape.lineTo(0.06, 3.4);
    ribShape.lineTo(0, 3.4);
    ribShape.lineTo(0, -3.4);
    const ribExtrudeSettings = { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };
    const ribGeo = new THREE.ExtrudeGeometry(ribShape, ribExtrudeSettings);
    const rib = new THREE.Mesh(ribGeo, darkSteel);
    const angle = (i / 16) * Math.PI * 2;
    rib.position.set(Math.cos(angle) * 4.15, 0, Math.sin(angle) * 4.15);
    rib.rotation.y = -angle;
    outerShellGroup.add(rib);
  }

  // Blast shield ring reinforcements — 8 latitudinal bands
  for (let j = 0; j < 8; j++) {
    const bandY = -3.0 + j * 0.85;
    const bandRadius = 3.2 + Math.sin((j / 7) * Math.PI) * 1.1;
    const bandGeo = new THREE.TorusGeometry(bandRadius, 0.07, 8, 48);
    const band = new THREE.Mesh(bandGeo, steel);
    band.position.y = bandY;
    band.rotation.x = Math.PI / 2;
    outerShellGroup.add(band);
  }

  // Warning stripes — chevron hazard markings
  for (let s = 0; s < 6; s++) {
    const stripeGeo = new THREE.BoxGeometry(0.6, 0.05, 0.12);
    const stripe = new THREE.Mesh(stripeGeo, warningRed);
    const sa = (s / 6) * Math.PI * 2;
    stripe.position.set(Math.cos(sa) * 4.25, 0, Math.sin(sa) * 4.25);
    stripe.rotation.y = -sa;
    outerShellGroup.add(stripe);
  }

  // Access hatches — 4 armored inspection panels
  for (let h = 0; h < 4; h++) {
    const hatchGroup = new THREE.Group();
    const hatchPlate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.15), darkSteel);
    hatchGroup.add(hatchPlate);
    // Hatch bolts — 8 per panel
    for (let b = 0; b < 8; b++) {
      const bx = -0.3 + (b % 4) * 0.2;
      const by = -0.2 + Math.floor(b / 4) * 0.4;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8), chrome);
      bolt.position.set(bx, by, 0.1);
      bolt.rotation.x = Math.PI / 2;
      hatchGroup.add(bolt);
    }
    const ha = (h / 4) * Math.PI * 2 + Math.PI / 4;
    hatchGroup.position.set(Math.cos(ha) * 4.2, 1.5, Math.sin(ha) * 4.2);
    hatchGroup.lookAt(0, 1.5, 0);
    outerShellGroup.add(hatchGroup);
  }

  group.add(outerShellGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 2: INNER VACUUM CONTAINMENT VESSEL
  // ══════════════════════════════════════════════════════════════════════
  const innerVesselGroup = new THREE.Group();

  // Ultra-high vacuum vessel — spherical with viewing ports
  const ivProfile = new THREE.Path();
  ivProfile.moveTo(0, -2.8);
  ivProfile.quadraticCurveTo(3.0, -2.8, 3.2, 0);
  ivProfile.quadraticCurveTo(3.0, 2.8, 0, 2.8);
  const ivPts = ivProfile.getPoints(40);
  const ivGeo = new THREE.LatheGeometry(ivPts, 48);
  const innerVessel = new THREE.Mesh(ivGeo, vacuumChamber);
  innerVesselGroup.add(innerVessel);
  meshes.innerVessel = innerVessel;

  // Vacuum ports — 6 ConFlat flanges
  for (let vp = 0; vp < 6; vp++) {
    const portGroup = new THREE.Group();
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 24), steel);
    flange.rotation.x = Math.PI / 2;
    portGroup.add(flange);
    const gasket = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 8, 24), copper);
    gasket.rotation.x = Math.PI / 2;
    gasket.position.z = 0.07;
    portGroup.add(gasket);
    // Knife-edge seal detail
    const knifeSeal = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.008, 6, 24), chrome);
    knifeSeal.rotation.x = Math.PI / 2;
    knifeSeal.position.z = 0.065;
    portGroup.add(knifeSeal);

    const phi = Math.acos(1 - 2 * (vp + 0.5) / 6);
    const theta = (vp * 2.399) % (Math.PI * 2);
    portGroup.position.set(
      Math.sin(phi) * Math.cos(theta) * 3.2,
      Math.cos(phi) * 3.0 - 0.2,
      Math.sin(phi) * Math.sin(theta) * 3.2
    );
    portGroup.lookAt(0, portGroup.position.y, 0);
    innerVesselGroup.add(portGroup);
  }

  group.add(innerVesselGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 3: PENNING TRAP ARRAY — Antihydrogen Confinement
  // ══════════════════════════════════════════════════════════════════════
  const penningGroup = new THREE.Group();
  const trapPositions = [
    { x: 0, y: 0, z: 0 },       // Central trap
    { x: 1.5, y: 0, z: 0 },     // Array elements
    { x: -1.5, y: 0, z: 0 },
    { x: 0, y: 0, z: 1.5 },
    { x: 0, y: 0, z: -1.5 },
    { x: 0, y: 1.5, z: 0 },
    { x: 0, y: -1.5, z: 0 },
  ];

  trapPositions.forEach((pos, idx) => {
    const trapUnit = new THREE.Group();

    // Endcap electrodes — hyperbolic shape via LatheGeometry
    for (let ec = 0; ec < 2; ec++) {
      const capProfile = new THREE.Path();
      capProfile.moveTo(0, 0);
      capProfile.quadraticCurveTo(0.35, 0.05, 0.38, 0.18);
      capProfile.lineTo(0.4, 0.2);
      capProfile.lineTo(0.4, 0.25);
      capProfile.lineTo(0, 0.25);
      const capPts = capProfile.getPoints(16);
      const capGeo = new THREE.LatheGeometry(capPts, 24);
      const cap = new THREE.Mesh(capGeo, penningElectrode);
      cap.position.y = ec === 0 ? 0.45 : -0.45;
      cap.rotation.x = ec === 0 ? 0 : Math.PI;
      trapUnit.add(cap);
    }

    // Ring electrode — the central hyperboloidal electrode
    const ringGeo = new THREE.TorusGeometry(0.35, 0.06, 12, 32);
    const ringElectrode = new THREE.Mesh(ringGeo, goldContact);
    ringElectrode.rotation.x = Math.PI / 2;
    trapUnit.add(ringElectrode);

    // Guard electrodes — thin correction rings
    for (let ge = 0; ge < 2; ge++) {
      const guardGeo = new THREE.TorusGeometry(0.32, 0.02, 8, 24);
      const guard = new THREE.Mesh(guardGeo, copper);
      guard.position.y = ge === 0 ? 0.22 : -0.22;
      guard.rotation.x = Math.PI / 2;
      trapUnit.add(guard);
    }

    // Electrode support rods — 4 ceramic insulators per trap
    for (let sr = 0; sr < 4; sr++) {
      const rodAngle = (sr / 4) * Math.PI * 2;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), ceramicInsulator);
      rod.position.set(Math.cos(rodAngle) * 0.42, 0, Math.sin(rodAngle) * 0.42);
      trapUnit.add(rod);
    }

    // Anti-atom cloud — glowing plasma sphere inside trap
    const plasmaGeo = new THREE.SphereGeometry(0.15, 24, 24);
    const plasmaCloud = new THREE.Mesh(plasmaGeo, antiMatterGlow.clone());
    trapUnit.add(plasmaCloud);

    // Orbiting anti-atoms — 12 tiny spheres per trap
    const atomGroup = new THREE.Group();
    for (let a = 0; a < 12; a++) {
      const atomGeo = new THREE.SphereGeometry(0.018, 8, 8);
      const atom = new THREE.Mesh(atomGeo, antiMatterGlow.clone());
      const orbitR = 0.22 + Math.random() * 0.1;
      const orbitAngle = (a / 12) * Math.PI * 2;
      const orbitY = (Math.random() - 0.5) * 0.3;
      atom.position.set(Math.cos(orbitAngle) * orbitR, orbitY, Math.sin(orbitAngle) * orbitR);
      atom.userData = { orbitRadius: orbitR, orbitSpeed: 1.5 + Math.random() * 2.0, orbitOffset: orbitAngle, yBase: orbitY };
      atomGroup.add(atom);
      meshes.antiAtoms.push(atom);
    }
    trapUnit.add(atomGroup);

    trapUnit.position.set(pos.x, pos.y, pos.z);
    penningGroup.add(trapUnit);
    meshes.penningTraps.push(trapUnit);
    meshes.electrodeStacks.push(ringElectrode);
  });

  group.add(penningGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 4: SUPERCONDUCTING MAGNETIC CONFINEMENT COILS
  // ══════════════════════════════════════════════════════════════════════
  const coilGroup = new THREE.Group();

  // Primary solenoid coils — 10 stacked rings
  for (let sc = 0; sc < 10; sc++) {
    const coilY = -2.2 + sc * 0.48;
    const coilRadius = 2.4 + Math.sin((sc / 9) * Math.PI) * 0.3;
    const coilGeo = new THREE.TorusGeometry(coilRadius, 0.1, 12, 48);
    const coil = new THREE.Mesh(coilGeo, cryogenicBlue.clone());
    coil.position.y = coilY;
    coil.rotation.x = Math.PI / 2;
    coilGroup.add(coil);
    meshes.magneticCoils.push(coil);
    meshes.superconductorCoils.push(coil);
  }

  // Quadrupole coils — 4 saddle-shaped windings (approximated with torus arcs)
  for (let qc = 0; qc < 4; qc++) {
    const qAngle = (qc / 4) * Math.PI * 2;
    const quadCoil = new THREE.Group();
    // Two arcs per saddle coil
    for (let arc = 0; arc < 2; arc++) {
      const arcGeo = new THREE.TorusGeometry(1.8, 0.06, 8, 16, Math.PI);
      const arcMesh = new THREE.Mesh(arcGeo, copper);
      arcMesh.position.y = arc === 0 ? 1.0 : -1.0;
      arcMesh.rotation.x = Math.PI / 2;
      arcMesh.rotation.z = arc === 0 ? 0 : Math.PI;
      quadCoil.add(arcMesh);
    }
    // Connecting bars
    for (let cb = 0; cb < 2; cb++) {
      const barGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 8);
      const bar = new THREE.Mesh(barGeo, copper);
      bar.position.set(cb === 0 ? 1.8 : -1.8, 0, 0);
      quadCoil.add(bar);
    }
    quadCoil.rotation.y = qAngle;
    coilGroup.add(quadCoil);
  }

  // Mirror coils — high-field pinch coils at top and bottom
  for (let mc = 0; mc < 2; mc++) {
    const mirrorY = mc === 0 ? 2.6 : -2.6;
    for (let ml = 0; ml < 3; ml++) {
      const mRadius = 1.6 - ml * 0.2;
      const mGeo = new THREE.TorusGeometry(mRadius, 0.08, 10, 36);
      const mCoil = new THREE.Mesh(mGeo, cryogenicBlue.clone());
      mCoil.position.y = mirrorY + ml * 0.12 * (mc === 0 ? 1 : -1);
      mCoil.rotation.x = Math.PI / 2;
      coilGroup.add(mCoil);
      meshes.confinementRings.push(mCoil);
    }
  }

  group.add(coilGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 5: MAGNETIC FIELD LINE VISUALIZATION
  // ══════════════════════════════════════════════════════════════════════
  const fieldGroup = new THREE.Group();

  for (let fl = 0; fl < 24; fl++) {
    const curve = new THREE.CatmullRomCurve3([]);
    const baseAngle = (fl / 24) * Math.PI * 2;
    const fieldR = 0.8 + (fl % 3) * 0.4;
    const points = [];
    for (let fp = 0; fp <= 40; fp++) {
      const t = fp / 40;
      const y = -2.5 + t * 5.0;
      const spiralAngle = baseAngle + t * Math.PI * 4;
      const r = fieldR * Math.sin(t * Math.PI);
      points.push(new THREE.Vector3(Math.cos(spiralAngle) * r, y, Math.sin(spiralAngle) * r));
    }
    const fieldCurve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(fieldCurve, 40, 0.012, 6, false);
    const fieldLine = new THREE.Mesh(tubeGeo, magneticFieldBlue.clone());
    fieldGroup.add(fieldLine);
    meshes.fieldLines.push(fieldLine);
  }

  group.add(fieldGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 6: ANNIHILATION ZONE — Matter/Antimatter Reaction Chamber
  // ══════════════════════════════════════════════════════════════════════
  const annihilationGroup = new THREE.Group();

  // Central annihilation sphere — the point of matter-antimatter contact
  const annSphereGeo = new THREE.SphereGeometry(0.5, 48, 48);
  const annSphere = new THREE.Mesh(annSphereGeo, annihilationFlash.clone());
  annihilationGroup.add(annSphere);
  meshes.annihilationSphere = annSphere;

  // Gamma ray burst jets — 24 conical jets emanating from center
  for (let gr = 0; gr < 24; gr++) {
    const jetPhi = Math.acos(1 - 2 * (gr + 0.5) / 24);
    const jetTheta = gr * 2.399;
    const jetLength = 1.5 + Math.random() * 1.0;
    const jetGeo = new THREE.ConeGeometry(0.04, jetLength, 6);
    const jet = new THREE.Mesh(jetGeo, gammaRayGlow.clone());
    jet.position.set(
      Math.sin(jetPhi) * Math.cos(jetTheta) * 0.3,
      Math.cos(jetPhi) * 0.3,
      Math.sin(jetPhi) * Math.sin(jetTheta) * 0.3
    );
    jet.lookAt(
      Math.sin(jetPhi) * Math.cos(jetTheta) * 5,
      Math.cos(jetPhi) * 5,
      Math.sin(jetPhi) * Math.sin(jetTheta) * 5
    );
    jet.rotateX(Math.PI / 2);
    annihilationGroup.add(jet);
    meshes.gammaRays.push(jet);
  }

  // Pair production rings — electron-positron pair visualization
  for (let pr = 0; pr < 6; pr++) {
    const pairRingGeo = new THREE.TorusGeometry(0.6 + pr * 0.15, 0.015, 8, 32);
    const pairRing = new THREE.Mesh(pairRingGeo, plasmaPurple.clone());
    pairRing.rotation.x = Math.random() * Math.PI;
    pairRing.rotation.y = Math.random() * Math.PI;
    annihilationGroup.add(pairRing);
    meshes.plasmaRings.push(pairRing);
  }

  group.add(annihilationGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 7: CRYOGENIC COOLING SYSTEMS
  // ══════════════════════════════════════════════════════════════════════
  const cryoGroup = new THREE.Group();

  // Helium-3 dilution refrigerator lines — spiraling around the coils
  for (let cl = 0; cl < 8; cl++) {
    const cryoPoints = [];
    const cBaseAngle = (cl / 8) * Math.PI * 2;
    for (let cp = 0; cp <= 30; cp++) {
      const t = cp / 30;
      const cy = -2.5 + t * 5.0;
      const cr = 2.7 + Math.sin(t * Math.PI * 6) * 0.15;
      const ca = cBaseAngle + t * Math.PI * 3;
      cryoPoints.push(new THREE.Vector3(Math.cos(ca) * cr, cy, Math.sin(ca) * cr));
    }
    const cryoCurve = new THREE.CatmullRomCurve3(cryoPoints);
    const cryoTubeGeo = new THREE.TubeGeometry(cryoCurve, 50, 0.04, 8, false);
    const cryoPipe = new THREE.Mesh(cryoTubeGeo, cryogenicBlue);
    cryoGroup.add(cryoPipe);
    meshes.cryoPipes.push(cryoPipe);
  }

  // Cryostat vacuum jacket
  const cryoJacketProfile = new THREE.Path();
  cryoJacketProfile.moveTo(0, -2.9);
  cryoJacketProfile.quadraticCurveTo(3.4, -2.9, 3.6, 0);
  cryoJacketProfile.quadraticCurveTo(3.4, 2.9, 0, 2.9);
  const cjPts = cryoJacketProfile.getPoints(32);
  const cjGeo = new THREE.LatheGeometry(cjPts, 40);
  const cryoJacket = new THREE.Mesh(cjGeo, new THREE.MeshStandardMaterial({
    color: 0x556677, metalness: 0.8, roughness: 0.12, transparent: true, opacity: 0.15
  }));
  cryoGroup.add(cryoJacket);

  // Multi-layer insulation (MLI) — shimmering gold foil layers
  for (let mli = 0; mli < 3; mli++) {
    const mliRadius = 3.1 + mli * 0.12;
    const mliGeo = new THREE.SphereGeometry(mliRadius, 32, 32);
    const mliLayer = new THREE.Mesh(mliGeo, new THREE.MeshStandardMaterial({
      color: 0xddaa44, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.08
    }));
    cryoGroup.add(mliLayer);
  }

  group.add(cryoGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 8: FAILSAFE SYSTEMS & EMERGENCY QUENCH
  // ══════════════════════════════════════════════════════════════════════
  const failsafeGroup = new THREE.Group();

  // Quench protection dump resistors — 8 units around the equator
  for (let qr = 0; qr < 8; qr++) {
    const resistorGroup = new THREE.Group();
    const resistorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 12), ceramicInsulator);
    resistorGroup.add(resistorBody);
    // Wire windings on resistor
    for (let rw = 0; rw < 10; rw++) {
      const windGeo = new THREE.TorusGeometry(0.13, 0.01, 6, 16);
      const wind = new THREE.Mesh(windGeo, copper);
      wind.position.y = -0.2 + rw * 0.04;
      wind.rotation.x = Math.PI / 2;
      resistorGroup.add(wind);
    }
    // Status indicator LED
    const ledGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const led = new THREE.Mesh(ledGeo, warningRed.clone());
    led.position.y = 0.3;
    resistorGroup.add(led);
    meshes.failsafeIndicators.push(led);

    const qrAngle = (qr / 8) * Math.PI * 2;
    resistorGroup.position.set(Math.cos(qrAngle) * 3.8, -2.0, Math.sin(qrAngle) * 3.8);
    resistorGroup.lookAt(0, -2.0, 0);
    failsafeGroup.add(resistorGroup);
  }

  // Emergency matter injection ports — for controlled annihilation abort
  for (let ei = 0; ei < 4; ei++) {
    const injectorGroup = new THREE.Group();
    const injectorBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.8, 12), darkSteel);
    injectorBarrel.rotation.x = Math.PI / 2;
    injectorGroup.add(injectorBarrel);
    const injectorNozzle = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 12), chrome);
    injectorNozzle.rotation.x = -Math.PI / 2;
    injectorNozzle.position.z = 0.5;
    injectorGroup.add(injectorNozzle);
    // Solenoid valve
    const valveBody = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 8), steel);
    valveBody.position.set(0, 0.1, 0.1);
    injectorGroup.add(valveBody);

    const eiAngle = (ei / 4) * Math.PI * 2 + Math.PI / 8;
    injectorGroup.position.set(Math.cos(eiAngle) * 2.8, 0, Math.sin(eiAngle) * 2.8);
    injectorGroup.lookAt(0, 0, 0);
    failsafeGroup.add(injectorGroup);
  }

  group.add(failsafeGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 9: VACUUM PUMP SYSTEM
  // ══════════════════════════════════════════════════════════════════════
  const pumpGroup = new THREE.Group();

  // Ion pumps — 4 units maintaining 10^-12 torr vacuum
  for (let ip = 0; ip < 4; ip++) {
    const ionPump = new THREE.Group();
    // Pump body — cylindrical
    const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16), aluminum);
    ionPump.add(pumpBody);
    // Magnet assembly — permanent magnets around pump
    for (let pm = 0; pm < 2; pm++) {
      const magnetBlock = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.1), darkSteel);
      magnetBlock.position.set(pm === 0 ? 0.22 : -0.22, 0, 0);
      ionPump.add(magnetBlock);
    }
    // High-voltage feedthrough
    const hvFeed = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), ceramicInsulator);
    hvFeed.position.y = 0.45;
    ionPump.add(hvFeed);
    const hvCap = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), goldContact);
    hvCap.position.y = 0.6;
    ionPump.add(hvCap);

    // Connecting bellows to vessel
    const bellowsPoints = [];
    for (let bp = 0; bp <= 8; bp++) {
      const bpR = 0.08 + (bp % 2) * 0.02;
      bellowsPoints.push(new THREE.Vector2(bpR, bp * 0.04));
    }
    const bellowsGeo = new THREE.LatheGeometry(bellowsPoints, 16);
    const bellows = new THREE.Mesh(bellowsGeo, steel);
    bellows.position.y = -0.35;
    ionPump.add(bellows);

    const ipAngle = (ip / 4) * Math.PI * 2;
    ionPump.position.set(Math.cos(ipAngle) * 3.5, -1.8, Math.sin(ipAngle) * 3.5);
    ionPump.lookAt(0, -1.8, 0);
    ionPump.rotateX(Math.PI / 2);
    pumpGroup.add(ionPump);
    meshes.vacuumPumps.push(ionPump);
  }

  group.add(pumpGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 10: DETONATOR & TRIGGER ASSEMBLY
  // ══════════════════════════════════════════════════════════════════════
  const detonatorGroup = new THREE.Group();

  // Magnetic field collapse sequencer — the trigger mechanism
  const sequencerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.4, 1.2, 24), darkSteel
  );
  sequencerBody.position.y = -3.8;
  detonatorGroup.add(sequencerBody);

  // Capacitor bank — energy storage for rapid field collapse
  for (let cap = 0; cap < 12; cap++) {
    const capUnit = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12), aluminum);
    const capAngle = (cap / 12) * Math.PI * 2;
    capUnit.position.set(Math.cos(capAngle) * 0.32, -3.8, Math.sin(capAngle) * 0.32);
    detonatorGroup.add(capUnit);
    // Capacitor terminals
    const terminal = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), goldContact);
    terminal.position.set(Math.cos(capAngle) * 0.32, -3.48, Math.sin(capAngle) * 0.32);
    detonatorGroup.add(terminal);
  }

  // Arming mechanism — dual-key safety system
  const armingPanel = new THREE.Group();
  const panelBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.08), darkSteel);
  armingPanel.add(panelBase);
  // Key slots
  for (let ks = 0; ks < 2; ks++) {
    const keySlot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.1), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    keySlot.position.set(-0.15 + ks * 0.3, 0.05, 0.04);
    armingPanel.add(keySlot);
  }
  // Arm/disarm indicator
  const armLED = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), warningRed.clone());
  armLED.position.set(0, -0.1, 0.05);
  armingPanel.add(armLED);
  meshes.failsafeIndicators.push(armLED);

  armingPanel.position.set(0.55, -3.8, 0);
  armingPanel.rotation.y = -Math.PI / 2;
  detonatorGroup.add(armingPanel);

  meshes.detonatorAssembly = detonatorGroup;
  group.add(detonatorGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 11: CONTROL ELECTRONICS & SENSOR ARRAYS
  // ══════════════════════════════════════════════════════════════════════
  const electronicsGroup = new THREE.Group();

  // Control computer modules — 6 units around the upper ring
  for (let cm = 0; cm < 6; cm++) {
    const moduleGroup = new THREE.Group();
    const moduleCase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.2), darkSteel);
    moduleGroup.add(moduleCase);
    // Screen
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25), new THREE.MeshStandardMaterial({
      color: 0x003311, emissive: 0x00ff44, emissiveIntensity: 0.8
    }));
    screen.position.z = 0.11;
    moduleGroup.add(screen);
    meshes.controlPanelScreens.push(screen);

    // Diagnostic readout bars
    for (let dr = 0; dr < 5; dr++) {
      const readoutBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.02 + Math.random() * 0.15, 0.01),
        new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 1.2 })
      );
      readoutBar.position.set(-0.15 + dr * 0.075, -0.06, 0.115);
      moduleGroup.add(readoutBar);
    }

    // Data connectors
    for (let dc = 0; dc < 3; dc++) {
      const connector = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6), goldContact);
      connector.position.set(-0.1 + dc * 0.1, -0.18, 0.05);
      connector.rotation.x = Math.PI / 2;
      moduleGroup.add(connector);
    }

    const cmAngle = (cm / 6) * Math.PI * 2;
    moduleGroup.position.set(Math.cos(cmAngle) * 3.6, 2.2, Math.sin(cmAngle) * 3.6);
    moduleGroup.lookAt(0, 2.2, 0);
    electronicsGroup.add(moduleGroup);
  }

  // Gamma-ray spectrometer sensors — 12 sensors monitoring annihilation
  for (let gs = 0; gs < 12; gs++) {
    const sensorGroup = new THREE.Group();
    const sensorCrystal = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 8), new THREE.MeshStandardMaterial({
      color: 0x88aaff, transparent: true, opacity: 0.6, metalness: 0.3, roughness: 0.2
    }));
    sensorGroup.add(sensorCrystal);
    const sensorHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 8), aluminum);
    sensorHousing.position.y = -0.01;
    sensorGroup.add(sensorHousing);
    // PMT (photomultiplier tube)
    const pmt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.15, 8), darkSteel);
    pmt.position.y = -0.17;
    sensorGroup.add(pmt);

    const gsTheta = (gs / 12) * Math.PI * 2;
    const gsPhi = Math.PI * 0.3 + (gs % 3) * Math.PI * 0.2;
    sensorGroup.position.set(
      Math.sin(gsPhi) * Math.cos(gsTheta) * 2.6,
      Math.cos(gsPhi) * 2.2,
      Math.sin(gsPhi) * Math.sin(gsTheta) * 2.6
    );
    sensorGroup.lookAt(0, 0, 0);
    electronicsGroup.add(sensorGroup);
    meshes.sensorArrays.push(sensorGroup);
  }

  // Data bus cable harnesses — fiber optic links
  for (let fb = 0; fb < 6; fb++) {
    const fiberPoints = [];
    const fbAngle = (fb / 6) * Math.PI * 2;
    fiberPoints.push(new THREE.Vector3(Math.cos(fbAngle) * 3.6, 2.2, Math.sin(fbAngle) * 3.6));
    fiberPoints.push(new THREE.Vector3(Math.cos(fbAngle) * 3.2, 0.5, Math.sin(fbAngle) * 3.2));
    fiberPoints.push(new THREE.Vector3(Math.cos(fbAngle + 0.2) * 2.8, -1.5, Math.sin(fbAngle + 0.2) * 2.8));
    fiberPoints.push(new THREE.Vector3(Math.cos(fbAngle + 0.1) * 3.0, -3.5, Math.sin(fbAngle + 0.1) * 3.0));
    const fiberCurve = new THREE.CatmullRomCurve3(fiberPoints);
    const fiberGeo = new THREE.TubeGeometry(fiberCurve, 20, 0.02, 6, false);
    const fiber = new THREE.Mesh(fiberGeo, new THREE.MeshStandardMaterial({
      color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 0.3, metalness: 0.2, roughness: 0.4
    }));
    electronicsGroup.add(fiber);
    meshes.dataLinks.push(fiber);
  }

  group.add(electronicsGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 12: WARHEAD CORE — Dense Uranium/Lead Tamper
  // ══════════════════════════════════════════════════════════════════════
  const warheadGroup = new THREE.Group();

  // Gamma-ray tamper — dense material to absorb and redirect annihilation energy
  const tamperProfile = new THREE.Path();
  tamperProfile.moveTo(0, -1.8);
  tamperProfile.quadraticCurveTo(2.0, -1.8, 2.1, -0.8);
  tamperProfile.lineTo(2.2, -0.5);
  tamperProfile.quadraticCurveTo(2.3, 0, 2.2, 0.5);
  tamperProfile.lineTo(2.1, 0.8);
  tamperProfile.quadraticCurveTo(2.0, 1.8, 0, 1.8);
  const tamperPts = tamperProfile.getPoints(32);
  const tamperGeo = new THREE.LatheGeometry(tamperPts, 36);
  const tamper = new THREE.Mesh(tamperGeo, new THREE.MeshStandardMaterial({
    color: 0x445566, metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.5
  }));
  warheadGroup.add(tamper);
  meshes.warheadCore = tamper;

  // Fission sparkplug — secondary nuclear stage (if hybrid design)
  const sparkplugGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
  const sparkplug = new THREE.Mesh(sparkplugGeo, new THREE.MeshStandardMaterial({
    color: 0x667744, metalness: 0.85, roughness: 0.3, emissive: 0x223311, emissiveIntensity: 0.2
  }));
  sparkplug.position.y = 0;
  warheadGroup.add(sparkplug);

  // Implosion lens array — precisely shaped explosive charges
  for (let il = 0; il < 8; il++) {
    const lensAngle = (il / 8) * Math.PI * 2;
    const lensShape = new THREE.Shape();
    lensShape.moveTo(-0.15, -0.3);
    lensShape.quadraticCurveTo(0, -0.35, 0.15, -0.3);
    lensShape.lineTo(0.12, 0.3);
    lensShape.quadraticCurveTo(0, 0.35, -0.12, 0.3);
    lensShape.lineTo(-0.15, -0.3);
    const lensGeo = new THREE.ExtrudeGeometry(lensShape, { depth: 0.1, bevelEnabled: false });
    const lens = new THREE.Mesh(lensGeo, new THREE.MeshStandardMaterial({
      color: 0xcc8844, metalness: 0.3, roughness: 0.6
    }));
    lens.position.set(Math.cos(lensAngle) * 2.05, 0, Math.sin(lensAngle) * 2.05);
    lens.lookAt(0, 0, 0);
    warheadGroup.add(lens);
  }

  group.add(warheadGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 13: EXTERNAL HARDWARE — MOUNTING, FINS, AEROSHELL
  // ══════════════════════════════════════════════════════════════════════
  const externalGroup = new THREE.Group();

  // Nose cone — ablative aeroshell for re-entry
  const noseProfile = new THREE.Path();
  noseProfile.moveTo(0, 4.5);
  noseProfile.quadraticCurveTo(0.2, 4.3, 0.8, 3.8);
  noseProfile.quadraticCurveTo(1.5, 3.2, 2.0, 2.5);
  noseProfile.lineTo(0, 2.5);
  const nosePts = noseProfile.getPoints(24);
  const noseGeo = new THREE.LatheGeometry(nosePts, 32);
  const noseCone = new THREE.Mesh(noseGeo, shieldComposite);
  externalGroup.add(noseCone);

  // Stabilization fins — 4 swept-back fins
  for (let fin = 0; fin < 4; fin++) {
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(1.2, -0.8);
    finShape.lineTo(1.0, -2.0);
    finShape.lineTo(0.3, -2.2);
    finShape.lineTo(0, -1.5);
    finShape.lineTo(0, 0);
    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
    const finMesh = new THREE.Mesh(finGeo, darkSteel);
    const finAngle = (fin / 4) * Math.PI * 2;
    finMesh.position.set(Math.cos(finAngle) * 3.5, -2.8, Math.sin(finAngle) * 3.5);
    finMesh.rotation.y = -finAngle + Math.PI / 2;
    externalGroup.add(finMesh);
  }

  // Tail skirt — rear fairing
  const skirtProfile = new THREE.Path();
  skirtProfile.moveTo(2.0, -3.5);
  skirtProfile.lineTo(2.5, -4.0);
  skirtProfile.lineTo(2.6, -4.5);
  skirtProfile.lineTo(2.4, -5.0);
  skirtProfile.lineTo(0, -5.0);
  const skirtPts = skirtProfile.getPoints(16);
  const skirtGeo = new THREE.LatheGeometry(skirtPts, 32);
  const tailSkirt = new THREE.Mesh(skirtGeo, shieldComposite);
  externalGroup.add(tailSkirt);

  // Retro-rockets — for terminal guidance
  for (let rr = 0; rr < 6; rr++) {
    const rocketGroup = new THREE.Group();
    const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 12), chrome);
    nozzle.rotation.x = Math.PI;
    rocketGroup.add(nozzle);
    const thrustChamber = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.2, 12), darkSteel);
    thrustChamber.position.y = 0.25;
    rocketGroup.add(thrustChamber);

    const rrAngle = (rr / 6) * Math.PI * 2;
    rocketGroup.position.set(Math.cos(rrAngle) * 2.3, -5.0, Math.sin(rrAngle) * 2.3);
    externalGroup.add(rocketGroup);
  }

  group.add(externalGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 14: ANTIHYDROGEN PRODUCTION SUBSYSTEM DETAIL
  // ══════════════════════════════════════════════════════════════════════
  const productionGroup = new THREE.Group();

  // Positron accumulator — nested Penning-Malmberg trap
  const accumProfile = new THREE.Path();
  accumProfile.moveTo(0, -0.6);
  accumProfile.lineTo(0.25, -0.6);
  accumProfile.lineTo(0.25, 0.6);
  accumProfile.lineTo(0, 0.6);
  const accumPts = accumProfile.getPoints(8);
  const accumGeo = new THREE.LatheGeometry(accumPts, 24);
  const accumulator = new THREE.Mesh(accumGeo, penningElectrode);
  accumulator.position.set(2.5, 1.5, 0);
  productionGroup.add(accumulator);

  // Antiproton decelerator ring — miniature storage ring
  const deceleratorGeo = new THREE.TorusGeometry(1.0, 0.06, 12, 48);
  const decelerator = new THREE.Mesh(deceleratorGeo, cryogenicBlue);
  decelerator.position.y = 1.5;
  decelerator.rotation.x = Math.PI / 2;
  productionGroup.add(decelerator);

  // Bending magnets — 4 dipoles on the ring
  for (let bm = 0; bm < 4; bm++) {
    const bmAngle = (bm / 4) * Math.PI * 2;
    const dipoleGroup = new THREE.Group();
    const yokeTop = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.15), darkSteel);
    yokeTop.position.y = 0.08;
    dipoleGroup.add(yokeTop);
    const yokeBot = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.15), darkSteel);
    yokeBot.position.y = -0.08;
    dipoleGroup.add(yokeBot);
    // Coils
    for (let bc = 0; bc < 2; bc++) {
      const bendCoil = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 6, 12), copper);
      bendCoil.position.set(bc === 0 ? 0.08 : -0.08, 0, 0);
      bendCoil.rotation.y = Math.PI / 2;
      dipoleGroup.add(bendCoil);
    }
    dipoleGroup.position.set(Math.cos(bmAngle) * 1.0, 1.5, Math.sin(bmAngle) * 1.0);
    dipoleGroup.lookAt(0, 1.5, 0);
    productionGroup.add(dipoleGroup);
  }

  // Mixing chamber — where positrons meet antiprotons to form antihydrogen
  const mixChamber = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), new THREE.MeshStandardMaterial({
    color: 0xaa55ff, emissive: 0x7700cc, emissiveIntensity: 1.5, transparent: true, opacity: 0.7
  }));
  mixChamber.position.set(0, 1.5, 1.0);
  productionGroup.add(mixChamber);

  group.add(productionGroup);

  // ══════════════════════════════════════════════════════════════════════
  // SECTION 15: RADIATION SHIELDING LAYERS
  // ══════════════════════════════════════════════════════════════════════
  const shieldingGroup = new THREE.Group();

  // Borated polyethylene neutron shield
  const neutronShieldGeo = new THREE.SphereGeometry(3.8, 24, 24);
  const neutronShield = new THREE.Mesh(neutronShieldGeo, new THREE.MeshStandardMaterial({
    color: 0x556644, metalness: 0.1, roughness: 0.8, transparent: true, opacity: 0.1
  }));
  shieldingGroup.add(neutronShield);

  // Lead gamma shield segments — 12 interlocking plates
  for (let ls = 0; ls < 12; ls++) {
    const plateAngle = (ls / 12) * Math.PI * 2;
    const plateWidth = (Math.PI * 2 * 3.6) / 12;
    const plateGeo = new THREE.BoxGeometry(plateWidth * 0.9, 5.5, 0.15);
    const plate = new THREE.Mesh(plateGeo, new THREE.MeshStandardMaterial({
      color: 0x556677, metalness: 0.7, roughness: 0.4, transparent: true, opacity: 0.2
    }));
    plate.position.set(Math.cos(plateAngle) * 3.65, 0, Math.sin(plateAngle) * 3.65);
    plate.rotation.y = -plateAngle;
    shieldingGroup.add(plate);
  }

  group.add(shieldingGroup);

  // ══════════════════════════════════════════════════════════════════════
  // PARTS DEFINITIONS — 20 Highly Detailed Components
  // ══════════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Penning Trap Array',
      description: 'Seven nested Penning traps using hyperbolic endcap electrodes and ring electrodes with DC quadrupole electric fields to confine antihydrogen atoms. Guard electrodes provide harmonic correction. Each trap stores ~10^6 antihydrogen atoms at 0.5 K.',
      material: 'OFHC Copper electrodes, gold-plated contacts, alumina ceramic insulators',
      function: 'Electrostatic confinement of antihydrogen in combined electric quadrupole and magnetic solenoidal field (Penning-Malmberg configuration)',
      assemblyOrder: 5,
      connections: ['Superconducting Coils', 'Vacuum System', 'Cryogenic System'],
      failureEffect: 'Loss of electrostatic confinement causes antihydrogen to contact vessel walls — immediate localized annihilation releasing 511 keV gamma pairs',
      cascadeFailures: ['Vacuum System', 'Cryogenic System', 'Control Electronics'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'Superconducting Magnetic Confinement Coils',
      description: 'Ten NbTi/Cu solenoid coils producing 5.4 T axial field, four Ioffe-type quadrupole saddle coils for radial confinement, and six mirror coils for axial pinch. Operates at 4.2 K in persistent mode.',
      material: 'Niobium-titanium (NbTi) superconductor in copper matrix, epoxy-impregnated',
      function: 'Generate magnetic minimum trap (Ioffe-Pritchard geometry) for neutral antihydrogen magnetic confinement via anti-atom magnetic moment interaction',
      assemblyOrder: 3,
      connections: ['Cryogenic System', 'Quench Protection', 'Power Supply'],
      failureEffect: 'Superconductor quench → rapid field collapse → all confined antihydrogen released simultaneously → catastrophic annihilation event',
      cascadeFailures: ['Penning Trap Array', 'Cryogenic System', 'Blast Shielding'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 6, z: 0 }
    },
    {
      name: 'Annihilation Zone Chamber',
      description: 'Central reaction volume where matter and antimatter make contact. Designed to maximize gamma-ray production efficiency. Beryllium window ports allow gamma-ray spectrometry diagnostics.',
      material: 'Beryllium windows, tungsten-carbide liner, boron-carbide moderator',
      function: 'Controlled matter-antimatter annihilation producing 1.88 GeV per proton-antiproton pair, predominantly as pions decaying to muons and gamma rays',
      assemblyOrder: 6,
      connections: ['Penning Trap Array', 'Gamma-Ray Sensors', 'Warhead Core'],
      failureEffect: 'Premature or asymmetric annihilation causes uneven energy deposition and potential structural failure of containment',
      cascadeFailures: ['Warhead Core', 'Blast Shielding'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 0, z: 0 }
    },
    {
      name: 'Blast Shielding Vessel',
      description: 'Multi-layer containment structure: outer maraging steel shell with longitudinal and latitudinal reinforcement ribs, ablative thermal protection, and shock-absorbing honeycomb interlayer.',
      material: 'Maraging steel 350 (outer), carbon-carbon composite (thermal), aluminum honeycomb (shock)',
      function: 'Structural containment during transport, environmental protection, and shaped energy release channeling during detonation',
      assemblyOrder: 1,
      connections: ['All internal systems'],
      failureEffect: 'Loss of structural integrity exposes internal systems to environment — potential uncontrolled annihilation',
      cascadeFailures: ['Vacuum System', 'Cryogenic System'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 8 }
    },
    {
      name: 'Vacuum System (Ion Pumps)',
      description: 'Four sputter-ion pumps maintaining 10^-12 Torr extreme high vacuum. Titanium sublimation pumps provide initial gettering. Metal-sealed ConFlat flanges ensure leak-tight connections.',
      material: 'Titanium cathodes, stainless steel bodies, SmCo permanent magnets, copper gaskets',
      function: 'Maintain ultra-high vacuum to prevent antihydrogen annihilation with residual gas molecules — mean free path must exceed vessel dimensions',
      assemblyOrder: 2,
      connections: ['Inner Vacuum Vessel', 'Penning Trap Array', 'Control Electronics'],
      failureEffect: 'Vacuum degradation causes antihydrogen-gas collisions → gradual annihilation → radiation release and trap heating',
      cascadeFailures: ['Penning Trap Array', 'Cryogenic System'],
      originalPosition: { x: 0, y: -1.8, z: 0 },
      explodedPosition: { x: -6, y: -4, z: 0 }
    },
    {
      name: 'Cryogenic Cooling System',
      description: 'Helium-3/Helium-4 dilution refrigerator achieving 10 mK base temperature. Eight spiral cooling channels distribute cryogen around superconducting coils. Multi-layer insulation (30 layers of aluminized Mylar) minimizes radiative heat load.',
      material: 'Stainless steel cryolines, aluminized Mylar MLI, copper heat exchangers',
      function: 'Maintain superconducting coils below critical temperature (9.8 K for NbTi) and cool antihydrogen to sub-Kelvin temperatures for magnetic trapping',
      assemblyOrder: 4,
      connections: ['Superconducting Coils', 'Vacuum System', 'Control Electronics'],
      failureEffect: 'Thermal runaway causes superconductor quench, boiling cryogen creates pressure surge, potential vessel rupture',
      cascadeFailures: ['Superconducting Coils', 'Penning Trap Array'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: -7 }
    },
    {
      name: 'Quench Protection System',
      description: 'Eight ceramic-wound dump resistors (0.5 Ω each) with semiconductor quench detection circuits. Response time < 10 ms. Energy extraction system safely dissipates 15 MJ stored magnetic energy.',
      material: 'Stainless steel sheathed resistance wire, ceramic formers, silicon diode quench detectors',
      function: 'Detect superconductor quench onset and rapidly extract stored magnetic energy to prevent coil damage and uncontrolled field collapse',
      assemblyOrder: 7,
      connections: ['Superconducting Coils', 'Control Electronics', 'Capacitor Bank'],
      failureEffect: 'Unprotected quench causes localized coil melting, helium flash boiling, and abrupt loss of magnetic confinement',
      cascadeFailures: ['Superconducting Coils', 'Penning Trap Array', 'Cryogenic System'],
      originalPosition: { x: 0, y: -2.0, z: 0 },
      explodedPosition: { x: 6, y: -3, z: 3 }
    },
    {
      name: 'Detonator & Field Collapse Sequencer',
      description: 'Precision timing system that collapses magnetic confinement in a controlled microsecond sequence, releasing antihydrogen into the annihilation zone. Dual-key arming with biometric authentication.',
      material: 'Radiation-hardened ASIC controllers, ceramic capacitor bank, gold-plated contacts',
      function: 'Initiate weapon by precisely sequenced collapse of magnetic confinement fields, directing antihydrogen toward matter target for maximum annihilation yield',
      assemblyOrder: 9,
      connections: ['Superconducting Coils', 'Capacitor Bank', 'Arming System'],
      failureEffect: 'Detonation failure results in incomplete field collapse — partial annihilation with reduced yield (fizzle)',
      cascadeFailures: ['Annihilation Zone'],
      originalPosition: { x: 0, y: -3.8, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 0 }
    },
    {
      name: 'Warhead Core (Gamma Tamper)',
      description: 'Dense uranium-238 tamper surrounding the annihilation zone. Reflects and absorbs gamma radiation, converting it to thermal X-rays for energy coupling. Fission sparkplug option for hybrid yield enhancement.',
      material: 'Depleted uranium-238 tamper, plutonium-239 sparkplug (optional), high-explosive lens array',
      function: 'Maximize energy coupling from annihilation gamma rays to create hydrodynamic blast wave. Tamper inertially confines the reaction.',
      assemblyOrder: 8,
      connections: ['Annihilation Zone', 'Blast Shielding', 'Detonator'],
      failureEffect: 'Tamper breach causes asymmetric energy deposition — reduced yield and potential dirty dispersal of fissile material',
      cascadeFailures: ['Blast Shielding'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -5, y: 3, z: 0 }
    },
    {
      name: 'Control Electronics & Diagnostics',
      description: 'Six radiation-hardened computer modules monitoring all subsystems. Real-time gamma-ray spectrometry, magnetic field mapping, vacuum pressure, and cryogenic temperature telemetry. Triple-modular redundancy.',
      material: 'Radiation-hardened silicon-on-insulator (SOI) ASICs, fiber-optic data links, EMI-shielded enclosures',
      function: 'Monitor and control all weapon subsystems, provide go/no-go assessment, log diagnostic data, and execute autonomous failsafe protocols',
      assemblyOrder: 10,
      connections: ['All subsystems'],
      failureEffect: 'Loss of telemetry and control — weapon enters safe mode, autonomous quench initiated',
      cascadeFailures: ['Detonator'],
      originalPosition: { x: 0, y: 2.2, z: 0 },
      explodedPosition: { x: 0, y: 7, z: 5 }
    },
    {
      name: 'Gamma-Ray Spectrometer Array',
      description: 'Twelve high-purity germanium (HPGe) detectors with photomultiplier tubes monitoring annihilation products. Energy resolution < 2 keV at 1332 keV. Provides real-time verification of antihydrogen inventory.',
      material: 'High-purity germanium crystals, borosilicate glass PMTs, mu-metal shielding',
      function: 'Detect and characterize 511 keV annihilation photons and pion decay products to verify antihydrogen confinement integrity',
      assemblyOrder: 11,
      connections: ['Control Electronics', 'Annihilation Zone'],
      failureEffect: 'Loss of annihilation monitoring — cannot verify antihydrogen inventory or detect confinement degradation',
      cascadeFailures: ['Control Electronics'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 4, y: 4, z: 4 }
    },
    {
      name: 'Magnetic Field Lines (Visualization)',
      description: 'Twenty-four computed magnetic field lines showing the Ioffe-Pritchard minimum-B trap geometry. Helical trajectories show the combined solenoid + quadrupole field topology that creates a 3D magnetic bottle.',
      material: 'Visualization construct (computed field topology)',
      function: 'Illustrate the minimum-B magnetic trap geometry that confines neutral antihydrogen via its magnetic dipole moment interaction with the inhomogeneous field',
      assemblyOrder: 12,
      connections: ['Superconducting Coils'],
      failureEffect: 'N/A (visualization only)',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 7, y: 0, z: 0 }
    },
    {
      name: 'Antiproton Decelerator Ring',
      description: 'Miniature storage ring with four dipole bending magnets for decelerating and accumulating antiprotons from production target. Stochastic cooling reduces phase space for efficient trapping.',
      material: 'Iron-dominated electromagnets, stainless steel vacuum chamber, RF cavity copper',
      function: 'Decelerate antiprotons from GeV to keV energies and accumulate sufficient quantities (~10^12) for antihydrogen synthesis',
      assemblyOrder: 13,
      connections: ['Positron Accumulator', 'Mixing Chamber', 'Cryogenic System'],
      failureEffect: 'Loss of antiproton beam — cannot replenish antihydrogen supply',
      cascadeFailures: ['Penning Trap Array'],
      originalPosition: { x: 0, y: 1.5, z: 0 },
      explodedPosition: { x: -4, y: 5, z: -4 }
    },
    {
      name: 'Aerodynamic Shell & Fins',
      description: 'Ablative carbon-carbon nose cone rated for Mach 20+ re-entry. Four swept-back stabilization fins with actuated trim tabs. Tail skirt with six terminal guidance retro-rockets.',
      material: 'Carbon-carbon composite (nose), titanium alloy (fins), ceramic ablative coating',
      function: 'Aerodynamic stability during ballistic trajectory, thermal protection during atmospheric re-entry, terminal guidance corrections',
      assemblyOrder: 14,
      connections: ['Blast Shielding', 'Control Electronics'],
      failureEffect: 'Loss of aerodynamic stability or thermal protection — weapon tumbles or burns up during re-entry',
      cascadeFailures: ['All internal systems'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -6, z: -6 }
    },
    {
      name: 'Radiation Shielding (Neutron + Gamma)',
      description: 'Borated polyethylene sphere for neutron moderation and capture, plus twelve interlocking lead plates for gamma-ray attenuation. Combined shielding reduces external dose rate to < 2.5 mrem/hr during transport.',
      material: 'Borated polyethylene (5% B-10), lead alloy plates, stainless steel structural frame',
      function: 'Attenuate radiation from residual annihilation events and activated materials to safe levels for personnel handling',
      assemblyOrder: 15,
      connections: ['Blast Shielding', 'Vacuum System'],
      failureEffect: 'Personnel radiation exposure exceeds safe limits during transport and handling operations',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 9 }
    },
    {
      name: 'Inner Vacuum Vessel',
      description: 'Spherical ultra-high vacuum vessel with six ConFlat ports. Electropolished interior surface with residual gas analyzer port. Bakeout capability to 250°C for outgassing reduction.',
      material: '316LN stainless steel, OFHC copper gaskets, sapphire viewport windows',
      function: 'Provide hermetically sealed ultra-high vacuum environment (< 10^-12 Torr) for antihydrogen storage, preventing matter-antimatter contact',
      assemblyOrder: 2,
      connections: ['Vacuum System', 'Penning Trap Array', 'Cryogenic System'],
      failureEffect: 'Vacuum breach causes immediate antihydrogen annihilation with infiltrating gas — loss of stored antimatter inventory',
      cascadeFailures: ['Penning Trap Array', 'Cryogenic System', 'Blast Shielding'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -3, y: 0, z: -5 }
    },
    {
      name: 'Capacitor Bank',
      description: 'Twelve high-energy ceramic capacitors storing 2 MJ total for rapid magnetic field collapse. Ignitron switching provides sub-microsecond discharge. Marx generator topology for voltage multiplication.',
      material: 'Barium titanate ceramic dielectric, silver-palladium electrodes, SF6 gas insulation',
      function: 'Store and rapidly discharge electrical energy to reverse superconducting coil current, collapsing the magnetic confinement field in < 50 μs',
      assemblyOrder: 8,
      connections: ['Detonator', 'Superconducting Coils', 'Control Electronics'],
      failureEffect: 'Insufficient discharge energy causes partial field collapse — incomplete antimatter release and reduced yield',
      cascadeFailures: ['Detonator'],
      originalPosition: { x: 0, y: -3.8, z: 0 },
      explodedPosition: { x: 5, y: -7, z: 2 }
    },
    {
      name: 'Positron Accumulator',
      description: 'Penning-Malmberg trap accumulating positrons from Na-22 radioactive source. Buffer gas cooling (N2/CF4) thermalizes positrons for efficient antihydrogen synthesis via three-body recombination.',
      material: 'OFHC copper electrodes, sodium-22 source capsule, buffer gas manifold',
      function: 'Accumulate and cool positrons to millielectronvolt temperatures for merging with antiprotons to synthesize antihydrogen atoms',
      assemblyOrder: 13,
      connections: ['Antiproton Decelerator', 'Mixing Chamber', 'Vacuum System'],
      failureEffect: 'Positron supply failure halts antihydrogen production — existing inventory slowly depleted by residual annihilation',
      cascadeFailures: ['Penning Trap Array'],
      originalPosition: { x: 2.5, y: 1.5, z: 0 },
      explodedPosition: { x: 7, y: 4, z: 0 }
    },
    {
      name: 'Emergency Matter Injection Ports',
      description: 'Four pneumatic fast-valve injectors capable of flooding the trap volume with nitrogen gas in < 1 ms. Provides controlled annihilation abort by intentionally destroying stored antihydrogen safely.',
      material: 'Inconel 718 nozzles, piezoelectric fast valves, nitrogen gas reservoir',
      function: 'Emergency weapon safe — intentionally annihilate stored antihydrogen in a controlled manner to prevent uncontrolled release',
      assemblyOrder: 16,
      connections: ['Penning Trap Array', 'Control Electronics', 'Vacuum System'],
      failureEffect: 'Cannot perform controlled emergency annihilation — only option is uncontrolled magnetic quench',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -6, y: 0, z: 4 }
    },
    {
      name: 'Fiber-Optic Data Bus',
      description: 'Six radiation-hardened multimode fiber-optic cables connecting all control modules in a triple-redundant ring topology. Immune to electromagnetic pulse (EMP) interference. 10 Gbps data rate.',
      material: 'Radiation-hardened silica fiber, polyimide coating, ceramic ferrule connectors',
      function: 'Provide EMP-immune high-bandwidth communication between all weapon subsystems for telemetry, diagnostics, and detonation sequencing',
      assemblyOrder: 17,
      connections: ['Control Electronics', 'Detonator', 'All sensors'],
      failureEffect: 'Communication loss between subsystems — weapon defaults to autonomous safe mode',
      cascadeFailures: ['Control Electronics', 'Detonator'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 3, y: -5, z: -3 }
    }
  ];

  // ══════════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ══════════════════════════════════════════════════════════════════════
  const description = `Ultra God Tier Antimatter Bomb — A thermonuclear-class weapon utilizing magnetically confined antihydrogen annihilation. 
The device stores approximately 10^12 antihydrogen atoms in a seven-element Penning-Malmberg trap array immersed in a 5.4 T Ioffe-Pritchard minimum-B magnetic field generated by NbTi superconducting coils cooled to 4.2 K by a helium-3 dilution refrigerator. 
Upon detonation, the magnetic confinement field is collapsed in < 50 μs by a Marx-generator capacitor bank, releasing antihydrogen into a dense uranium-238 tamper where proton-antiproton annihilation produces approximately 1.88 GeV per pair, predominantly as charged and neutral pions. 
The pion shower deposits energy in the tamper, generating a hydrodynamic blast wave. An optional Pu-239 fission sparkplug can amplify yield via gamma-ray driven fission. 
The weapon includes quadruple-redundant failsafe systems: quench protection dump resistors, emergency matter injection ports, dual-key arming, and autonomous safe-mode protocols. 
Twelve HPGe gamma-ray spectrometers continuously monitor the 511 keV annihilation line to verify antihydrogen inventory integrity.`;

  // ══════════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS — PhD-Level Antimatter Physics
  // ══════════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'In a Penning trap, what combination of fields provides three-dimensional confinement of charged particles, and why is this configuration insufficient for confining neutral antihydrogen atoms directly?',
      options: [
        'A static uniform magnetic field and a rotating electric field; neutral atoms lack charge so neither field interacts',
        'A static homogeneous magnetic field for radial confinement and a DC electric quadrupole for axial confinement; neutral antihydrogen has zero net charge so electrostatic forces vanish, requiring instead an Ioffe-Pritchard magnetic minimum trap exploiting the atomic magnetic dipole moment',
        'Crossed electric and magnetic fields creating an E×B drift; neutral atoms are confined by radiation pressure from laser cooling',
        'An RF Paul trap oscillating field with a superimposed magnetic field; neutral atoms are confined by the ponderomotive force'
      ],
      correctAnswer: 1,
      explanation: 'A Penning trap uses a uniform axial magnetic field (B) for radial confinement via cyclotron motion and a DC electric quadrupole (created by hyperbolic endcap and ring electrodes) for axial confinement. Charged particles (e.g., antiprotons, positrons) are well-confined, but neutral antihydrogen has no net charge. Confinement of neutral antihydrogen requires a magnetic minimum (Ioffe-Pritchard) trap that exploits the interaction between the atom\'s magnetic dipole moment (μ) and an inhomogeneous magnetic field gradient: F = ∇(μ·B). Low-field-seeking states are trapped in the field minimum.'
    },
    {
      question: 'The CPT theorem guarantees that the combined operation of Charge conjugation (C), Parity inversion (P), and Time reversal (T) is an exact symmetry of any Lorentz-invariant local quantum field theory. What specific experimental consequence does this have for the antihydrogen atom compared to hydrogen?',
      options: [
        'Antihydrogen must have exactly the same mass but opposite charge, with no constraint on its spectrum',
        'CPT symmetry requires antihydrogen to have identical mass, identical magnitude of charge, identical spectral frequencies (particularly the 1S-2S transition at 2466 THz), and identical hyperfine splitting — any measured deviation would require abandoning Lorentz-invariant local QFT',
        'CPT only constrains the total cross-sections for annihilation, not the bound-state properties',
        'Antihydrogen must have the same spectrum as deuterium due to CPT-related mass corrections'
      ],
      correctAnswer: 1,
      explanation: 'The CPT theorem (Lüders-Pauli theorem) proves that any quantum field theory built on Lorentz invariance, locality, and unitarity must be invariant under the combined CPT operation. This requires that a particle and its antiparticle have exactly equal masses, equal lifetimes, equal magnitudes of charge and magnetic moment (with appropriate sign changes). For antihydrogen, this means its bound-state spectrum must be identical to hydrogen: the 1S-2S two-photon transition at 2,466,061,413,187,035 ± 10 Hz and the ground-state hyperfine splitting at 1,420,405,751.768 ± 0.001 Hz must be exactly reproduced. The ALPHA experiment at CERN has verified this to 2 parts in 10^12.'
    },
    {
      question: 'When a proton and antiproton annihilate at rest, approximately 1876 MeV of energy is released. What is the dominant initial annihilation product channel, and what is the typical pion multiplicity?',
      options: [
        'Direct conversion to two back-to-back 938 MeV gamma rays, analogous to electron-positron annihilation',
        'Production of a Higgs boson that subsequently decays to b-quark pairs',
        'Predominantly 4-5 pions (mixture of π⁺, π⁻, and π⁰) with an average multiplicity of ~5, since the annihilation occurs through strong interaction quark-antiquark rearrangement, not electromagnetic direct photon production',
        'A single neutral kaon and a photon to conserve strangeness'
      ],
      correctAnswer: 2,
      explanation: 'Unlike electron-positron annihilation (which produces photons via QED), proton-antiproton annihilation is dominated by the strong interaction (QCD). The three quarks (uud) and three antiquarks (ūūd̄) rearrange and hadronize, predominantly producing pions. The average pion multiplicity for p-p̄ annihilation at rest is approximately 5 (typically 3-7 pions). About 50% of the energy initially goes into neutral pions (π⁰), which decay to gamma-ray pairs (π⁰ → 2γ) with a lifetime of 8.4 × 10⁻¹⁷ s. Charged pions (π±) decay to muons and neutrinos. Direct two-photon annihilation (p + p̄ → 2γ) is suppressed by a factor of ~10⁻⁷ relative to pionic channels.'
    },
    {
      question: 'In the Schwinger mechanism, what is the critical electric field strength required for spontaneous electron-positron pair production from the QED vacuum, and why is this relevant to antimatter weapon design?',
      options: [
        'About 10⁶ V/m, easily achievable with standard capacitors, making pair production a primary antimatter source',
        'The Schwinger critical field is E_cr = m²c³/(eℏ) ≈ 1.32 × 10¹⁸ V/m; this is far beyond any practical field strength, confirming that antimatter production requires particle accelerators (target spallation), not electromagnetic fields. It sets a fundamental limit on electromagnetic energy density relevant to annihilation plasma dynamics.',
        'About 10¹² V/m, achievable in lightning bolts, which is why antimatter is produced in thunderstorms',
        'There is no critical field — pair production requires colliding gamma rays above 1.022 MeV regardless of field strength'
      ],
      correctAnswer: 1,
      explanation: 'The Schwinger critical field E_cr = m_e²c³/(eℏ) ≈ 1.32 × 10¹⁸ V/m (or equivalently B_cr ≈ 4.4 × 10⁹ T) is the electric field at which the QED vacuum becomes unstable to spontaneous e⁺e⁻ pair creation. This is derived from the exponential suppression factor exp(-πm²c³/eEℏ) in the pair production rate per unit volume. This enormous field strength confirms that practical antimatter production requires accelerator-based methods (proton-target spallation producing antiproton-proton pairs above the threshold of ~6 GeV proton kinetic energy on fixed target), not electromagnetic field methods.'
    },
    {
      question: 'The ALPHA experiment at CERN achieved antihydrogen trapping by synthesizing antihydrogen from separately confined antiprotons and positrons. What is the key physics challenge in this three-body recombination process, and why must the resulting antihydrogen be extremely cold to be magnetically trapped?',
      options: [
        'The recombination is exothermic by 13.6 eV, which is trivially managed by laser cooling the products',
        'Three-body recombination (p̄ + e⁺ + e⁺ → H̄ + e⁺) produces antihydrogen in high-n Rydberg states with binding energies of order kT. These weakly-bound atoms have large magnetic moments (∝ n²) but most are in un-trappable high-field-seeking states. Only atoms in low-field-seeking states with translational kinetic energy below the trap depth (~0.5 K × k_B ≈ 43 μeV) can be confined — requiring sub-Kelvin antihydrogen, which demands mixing antiprotons and positrons at millikelvin temperatures.',
        'The recombination is forbidden by conservation laws unless a photon is emitted',
        'Three-body recombination is not used — antihydrogen is produced by charge exchange with cesium Rydberg atoms'
      ],
      correctAnswer: 1,
      explanation: 'Three-body recombination p̄ + e⁺ + e⁺ → H̄ + e⁺ (where the second positron carries away excess energy/momentum) is the dominant formation channel. It produces antihydrogen in highly excited Rydberg states (n ~ 30-50) with the rate scaling as T^(-4.5). The trap depth of the ALPHA Ioffe-Pritchard magnet is only ~0.5 K (54 μeV), determined by the maximum achievable field gradient and the antihydrogen ground-state magnetic moment (μ_B ≈ 9.27 × 10⁻²⁴ J/T). Only antihydrogen atoms with translational kinetic energy below this depth, AND in low-field-seeking magnetic substates (m_F > 0), can be trapped. This requires the initial particle temperatures to be extremely low (the ALPHA experiment uses ~40 K positrons and ~100 mK antiprotons from evaporative cooling).'
    },
    {
      question: 'What is the fundamental thermodynamic cost of antimatter production, and how does this constrain the energy yield of an antimatter weapon relative to the energy invested in its manufacture?',
      options: [
        'Antimatter production is 100% efficient via E=mc², so the weapon yields exactly the energy invested',
        'The overall efficiency of antiproton production at facilities like CERN is approximately 10⁻⁹ (one antiproton produced per ~10⁹ protons accelerated to sufficient energy), making the energy invested in producing 1 gram of antihydrogen approximately 25 × 10¹⁵ joules — about 25,000 times the 90 TJ annihilation energy content of that gram. An antimatter weapon is therefore not an energy source but an energy storage and delivery mechanism of extraordinary energy density (90 MJ/μg).',
        'Antimatter is harvested from cosmic rays, so no energy investment is needed',
        'Laser-driven pair production makes antimatter at 10% efficiency, making it economically viable'
      ],
      correctAnswer: 1,
      explanation: 'Current antiproton production at CERN\'s Antiproton Decelerator achieves roughly 10⁷ antiprotons per cycle from 10¹³ protons at 26 GeV — an efficiency of ~10⁻⁶ in antiproton number and ~10⁻⁹ in energy terms. Producing 1 gram of antihydrogen (containing ~6 × 10²³ atoms) would require approximately 25 petajoules of input energy, while the annihilation energy released by 1 gram is E = 2mc² ≈ 1.8 × 10¹⁴ J (90 TJ). The energy return on investment is thus ~0.004%. However, the energy DENSITY of antimatter (90 MJ/μg) is roughly 1000× greater than fission and 100× greater than fusion per unit mass. An antimatter weapon is therefore an energy DELIVERY system, not an energy SOURCE — analogous to how a battery stores but does not create energy.'
    }
  ];

  // ══════════════════════════════════════════════════════════════════════
  // ANIMATION — Hyper-Detailed Synchronized Motion
  // ══════════════════════════════════════════════════════════════════════
  function animate(time, speed) {
    const t = time * speed;

    // 1. Anti-atoms orbiting in Penning traps — individual Larmor precession
    meshes.antiAtoms.forEach((atom) => {
      const ud = atom.userData;
      const angle = ud.orbitOffset + t * ud.orbitSpeed;
      atom.position.x = Math.cos(angle) * ud.orbitRadius;
      atom.position.z = Math.sin(angle) * ud.orbitRadius;
      atom.position.y = ud.yBase + Math.sin(t * ud.orbitSpeed * 1.5) * 0.06;
      // Pulse the anti-atom glow
      if (atom.material && atom.material.emissiveIntensity !== undefined) {
        atom.material.emissiveIntensity = 1.5 + Math.sin(t * 4 + ud.orbitOffset) * 0.8;
      }
    });

    // 2. Penning trap electrode oscillation — simulated RF drive
    meshes.electrodeStacks.forEach((electrode, i) => {
      if (electrode.material && electrode.material.emissiveIntensity !== undefined) {
        electrode.material.emissiveIntensity = 0.4 + Math.sin(t * 8 + i * 0.9) * 0.3;
      }
    });

    // 3. Magnetic coil pulsing — superconductor persistent current visualization
    meshes.magneticCoils.forEach((coil, i) => {
      if (coil.material && coil.material.emissiveIntensity !== undefined) {
        coil.material.emissiveIntensity = 0.6 + Math.sin(t * 2 + i * 0.6) * 0.4;
      }
      const pulseScale = 1.0 + Math.sin(t * 1.5 + i * 0.4) * 0.015;
      coil.scale.set(pulseScale, 1, pulseScale);
    });

    // 4. Magnetic field line rotation — slow helical precession
    meshes.fieldLines.forEach((line, i) => {
      line.rotation.y = t * 0.3 + (i / meshes.fieldLines.length) * Math.PI * 2;
      if (line.material && line.material.opacity !== undefined) {
        line.material.opacity = 0.2 + Math.sin(t * 1.5 + i * 0.5) * 0.15;
      }
    });

    // 5. Annihilation sphere — pulsing flash effect (dormant state)
    if (meshes.annihilationSphere) {
      const flashIntensity = Math.max(0, Math.sin(t * 0.5)) * 0.3;
      meshes.annihilationSphere.material.opacity = flashIntensity;
      meshes.annihilationSphere.material.emissiveIntensity = flashIntensity * 8;
      const flashScale = 1.0 + flashIntensity * 0.5;
      meshes.annihilationSphere.scale.set(flashScale, flashScale, flashScale);
    }

    // 6. Gamma ray jets — pulsing and stretching
    meshes.gammaRays.forEach((jet, i) => {
      const jetPulse = Math.max(0, Math.sin(t * 0.5)) * 0.6;
      jet.material.opacity = jetPulse;
      jet.material.emissiveIntensity = jetPulse * 4;
      const jetScale = 1.0 + jetPulse * 0.3;
      jet.scale.set(1, jetScale, 1);
    });

    // 7. Plasma rings — spinning pair production visualization
    meshes.plasmaRings.forEach((ring, i) => {
      ring.rotation.x += 0.008 * speed * (1 + i * 0.3);
      ring.rotation.z += 0.006 * speed * (1 + i * 0.2);
      if (ring.material) {
        ring.material.opacity = 0.3 + Math.sin(t * 2 + i) * 0.25;
      }
    });

    // 8. Confinement rings — mirror coil breathing effect
    meshes.confinementRings.forEach((ring, i) => {
      const breathe = 1.0 + Math.sin(t * 1.2 + i * 0.8) * 0.03;
      ring.scale.set(breathe, 1, breathe);
    });

    // 9. Failsafe indicators — blinking warning LEDs
    meshes.failsafeIndicators.forEach((led, i) => {
      if (led.material) {
        const blink = Math.sin(t * 3 + i * 1.2) > 0.3 ? 2.5 : 0.3;
        led.material.emissiveIntensity = blink;
      }
    });

    // 10. Control panel screens — data scrolling simulation
    meshes.controlPanelScreens.forEach((screen, i) => {
      if (screen.material) {
        screen.material.emissiveIntensity = 0.5 + Math.sin(t * 5 + i * 2.1) * 0.3;
      }
    });

    // 11. Outer shell — very slow rotation to showcase detail
    if (meshes.outerShell) {
      meshes.outerShell.rotation.y = t * 0.05;
    }

    // 12. Inner vessel — counter-rotation
    if (meshes.innerVessel) {
      meshes.innerVessel.rotation.y = -t * 0.03;
    }

    // 13. Data link fibers — pulsing light transmission
    meshes.dataLinks.forEach((fiber, i) => {
      if (fiber.material) {
        fiber.material.emissiveIntensity = 0.2 + Math.abs(Math.sin(t * 6 + i * 1.5)) * 0.5;
      }
    });

    // 14. Vacuum pumps — subtle vibration
    meshes.vacuumPumps.forEach((pump, i) => {
      pump.position.y += Math.sin(t * 20 + i * 3) * 0.001;
    });

    // 15. Sensor arrays — scanning rotation
    meshes.sensorArrays.forEach((sensor, i) => {
      sensor.rotation.z = Math.sin(t * 0.8 + i * 0.5) * 0.05;
    });
  }

  return { group, parts, description, quizQuestions, animate };
}
