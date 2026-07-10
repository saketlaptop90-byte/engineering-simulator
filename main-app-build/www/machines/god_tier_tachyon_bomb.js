// ============================================================================
// GOD TIER TACHYON BOMB — Ultra Hyper-Realistic Engineering Simulator Model
// A weapon that detonates a tachyonic field condensate, releasing superluminal
// shockwaves that violate causality behind the wavefront.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  group.name = 'TachyonBomb_GodTier';

  // ===== CUSTOM MATERIALS =====
  const tachyonicCoreMat = new THREE.MeshStandardMaterial({
    color: 0x7700ff,
    emissive: 0x5500cc,
    emissiveIntensity: 2.8,
    metalness: 0.1,
    roughness: 0.15,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
  });

  const containmentVesselMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    emissive: 0x0d0d1a,
    emissiveIntensity: 0.3,
    metalness: 0.95,
    roughness: 0.12,
  });

  const chronoShieldMat = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    emissive: 0x00cc99,
    emissiveIntensity: 1.6,
    metalness: 0.0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
  });

  const causalityViolationMat = new THREE.MeshStandardMaterial({
    color: 0xff0044,
    emissive: 0xcc0033,
    emissiveIntensity: 2.2,
    metalness: 0.0,
    roughness: 0.0,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });

  const superluminalWaveMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xeeddff,
    emissiveIntensity: 3.5,
    metalness: 0.0,
    roughness: 0.0,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
  });

  const tachyonConduitMat = new THREE.MeshStandardMaterial({
    color: 0x9933ff,
    emissive: 0x6600cc,
    emissiveIntensity: 1.8,
    metalness: 0.7,
    roughness: 0.2,
  });

  const darkArmorMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a14,
    emissive: 0x050510,
    emissiveIntensity: 0.1,
    metalness: 0.98,
    roughness: 0.08,
  });

  const warningGlowMat = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xff4400,
    emissiveIntensity: 2.0,
    metalness: 0.0,
    roughness: 0.3,
  });

  const fieldLinesMat = new THREE.MeshStandardMaterial({
    color: 0xbb66ff,
    emissive: 0x9944dd,
    emissiveIntensity: 1.4,
    transparent: true,
    opacity: 0.5,
  });

  const innerPlasmaMat = new THREE.MeshStandardMaterial({
    color: 0xcc00ff,
    emissive: 0xaa00ee,
    emissiveIntensity: 4.0,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });

  const holographicMat = new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    emissive: 0x0088cc,
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.25,
    wireframe: true,
  });

  const detonatorMat = new THREE.MeshStandardMaterial({
    color: 0xcc0000,
    emissive: 0xaa0000,
    emissiveIntensity: 1.5,
    metalness: 0.9,
    roughness: 0.15,
  });

  // ===== MESH REFERENCES =====
  const meshes = {};

  // ===== 1. PRIMARY CONTAINMENT VESSEL (Lathe profile — NOT a cube) =====
  const vesselProfile = new THREE.Shape();
  vesselProfile.moveTo(0, -3.2);
  vesselProfile.quadraticCurveTo(1.8, -3.0, 2.2, -2.4);
  vesselProfile.quadraticCurveTo(2.8, -1.6, 3.0, -0.8);
  vesselProfile.quadraticCurveTo(3.15, 0.0, 3.0, 0.8);
  vesselProfile.quadraticCurveTo(2.8, 1.6, 2.2, 2.4);
  vesselProfile.quadraticCurveTo(1.8, 3.0, 0, 3.2);

  const vesselGeo = new THREE.LatheGeometry(
    vesselProfile.getPoints(64), 128
  );
  const vesselMesh = new THREE.Mesh(vesselGeo, containmentVesselMat);
  vesselMesh.name = 'ContainmentVessel';
  meshes.containmentVessel = vesselMesh;
  group.add(vesselMesh);

  // === Vessel reinforcement rings ===
  const reinforcementGroup = new THREE.Group();
  reinforcementGroup.name = 'ReinforcementRings';
  for (let i = 0; i < 12; i++) {
    const ringGeo = new THREE.TorusGeometry(3.05 + Math.sin(i * 0.5) * 0.1, 0.06, 16, 128);
    const ring = new THREE.Mesh(ringGeo, chrome);
    ring.position.y = -2.8 + (i * 0.51);
    ring.rotation.x = Math.PI / 2;
    reinforcementGroup.add(ring);
  }
  meshes.reinforcementRings = reinforcementGroup;
  group.add(reinforcementGroup);

  // === Hex-paneled outer armor (extruded hexagons over the vessel) ===
  const armorPanelGroup = new THREE.Group();
  armorPanelGroup.name = 'ArmorPanels';
  for (let row = 0; row < 8; row++) {
    const rowAngleOffset = (row % 2) * (Math.PI / 12);
    const y = -2.5 + row * 0.7;
    const radius = 3.1 + Math.sin((row / 8) * Math.PI) * 0.15;
    const panelCount = 24;
    for (let p = 0; p < panelCount; p++) {
      const angle = (p / panelCount) * Math.PI * 2 + rowAngleOffset;
      const hexShape = new THREE.Shape();
      const hexSize = 0.22;
      for (let h = 0; h < 6; h++) {
        const ha = (h / 6) * Math.PI * 2;
        const hx = Math.cos(ha) * hexSize;
        const hy = Math.sin(ha) * hexSize;
        if (h === 0) hexShape.moveTo(hx, hy);
        else hexShape.lineTo(hx, hy);
      }
      hexShape.closePath();
      const hexGeo = new THREE.ExtrudeGeometry(hexShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 });
      const panel = new THREE.Mesh(hexGeo, darkArmorMat);
      panel.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      panel.lookAt(0, y, 0);
      armorPanelGroup.add(panel);
    }
  }
  meshes.armorPanels = armorPanelGroup;
  group.add(armorPanelGroup);

  // ===== 2. TACHYONIC FIELD CORE (Nested icosahedrons) =====
  const coreGroup = new THREE.Group();
  coreGroup.name = 'TachyonicCore';

  const innerCoreGeo = new THREE.IcosahedronGeometry(0.8, 4);
  const innerCore = new THREE.Mesh(innerCoreGeo, innerPlasmaMat);
  innerCore.name = 'InnerPlasmaCore';
  meshes.innerCore = innerCore;
  coreGroup.add(innerCore);

  const midCoreGeo = new THREE.IcosahedronGeometry(1.15, 2);
  const midCore = new THREE.Mesh(midCoreGeo, tachyonicCoreMat);
  midCore.name = 'MidFieldShell';
  meshes.midCore = midCore;
  coreGroup.add(midCore);

  const outerCoreGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const outerCoreWire = new THREE.Mesh(outerCoreGeo, holographicMat);
  outerCoreWire.name = 'OuterHolographicCage';
  meshes.outerCoreWire = outerCoreWire;
  coreGroup.add(outerCoreWire);

  // Tachyonic singularity point
  const singularityGeo = new THREE.SphereGeometry(0.12, 64, 64);
  const singularity = new THREE.Mesh(singularityGeo, new THREE.MeshStandardMaterial({
    color: 0x000000, emissive: 0xffffff, emissiveIntensity: 5.0, metalness: 0, roughness: 0,
  }));
  singularity.name = 'TachyonSingularity';
  meshes.singularity = singularity;
  coreGroup.add(singularity);

  meshes.coreGroup = coreGroup;
  group.add(coreGroup);

  // ===== 3. TACHYON CONDUIT NETWORK (TubeGeometry spirals feeding the core) =====
  const conduitGroup = new THREE.Group();
  conduitGroup.name = 'TachyonConduits';

  for (let c = 0; c < 8; c++) {
    const conduitPoints = [];
    const baseAngle = (c / 8) * Math.PI * 2;
    for (let t = 0; t <= 60; t++) {
      const frac = t / 60;
      const spiralAngle = baseAngle + frac * Math.PI * 3;
      const r = 2.8 * (1 - frac) + 0.3 * frac;
      const x = Math.cos(spiralAngle) * r;
      const z = Math.sin(spiralAngle) * r;
      const y = -2.5 + frac * 5.0;
      conduitPoints.push(new THREE.Vector3(x, y, z));
    }
    const conduitCurve = new THREE.CatmullRomCurve3(conduitPoints);
    const conduitGeo = new THREE.TubeGeometry(conduitCurve, 80, 0.04, 12, false);
    const conduit = new THREE.Mesh(conduitGeo, tachyonConduitMat);
    conduitGroup.add(conduit);
  }

  // Secondary conduits — lateral feeds
  for (let c = 0; c < 6; c++) {
    const pts = [];
    const ang = (c / 6) * Math.PI * 2;
    for (let s = 0; s <= 30; s++) {
      const f = s / 30;
      pts.push(new THREE.Vector3(
        Math.cos(ang) * (3.0 - f * 2.6),
        Math.sin(f * Math.PI) * 0.5,
        Math.sin(ang) * (3.0 - f * 2.6)
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 40, 0.025, 8, false);
    const mesh = new THREE.Mesh(geo, fieldLinesMat);
    conduitGroup.add(mesh);
  }

  meshes.conduits = conduitGroup;
  group.add(conduitGroup);

  // ===== 4. CHRONOLOGICAL SHIELDING LAYERS =====
  const chronoGroup = new THREE.Group();
  chronoGroup.name = 'ChronologicalShielding';

  for (let layer = 0; layer < 5; layer++) {
    const shieldRadius = 4.0 + layer * 0.35;
    const shieldGeo = new THREE.SphereGeometry(shieldRadius, 64, 64);
    const shieldMat = chronoShieldMat.clone();
    shieldMat.opacity = 0.08 + layer * 0.025;
    shieldMat.emissiveIntensity = 1.2 + layer * 0.3;
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.name = `ChronoShieldLayer_${layer}`;
    chronoGroup.add(shield);
  }

  // Chrono-shield lattice grid (wireframe dodecahedron layers)
  for (let d = 0; d < 3; d++) {
    const dodGeo = new THREE.DodecahedronGeometry(4.2 + d * 0.5, 0);
    const dodWire = new THREE.Mesh(dodGeo, new THREE.MeshStandardMaterial({
      color: 0x00ffcc, emissive: 0x00ddaa, emissiveIntensity: 0.8 + d * 0.4,
      wireframe: true, transparent: true, opacity: 0.3,
    }));
    dodWire.rotation.set(d * 0.4, d * 0.6, d * 0.2);
    chronoGroup.add(dodWire);
  }

  meshes.chronoShield = chronoGroup;
  group.add(chronoGroup);

  // ===== 5. SUPERLUMINAL DETONATION WAVEFRONT =====
  const wavefrontGroup = new THREE.Group();
  wavefrontGroup.name = 'SuperluminalWavefront';

  // Primary expanding wave shell
  const waveGeo = new THREE.SphereGeometry(0.5, 128, 128);
  const waveMesh = new THREE.Mesh(waveGeo, superluminalWaveMat);
  waveMesh.name = 'PrimaryWavefront';
  waveMesh.scale.set(0.01, 0.01, 0.01);
  meshes.wavefront = waveMesh;
  wavefrontGroup.add(waveMesh);

  // Secondary shock rings
  for (let r = 0; r < 6; r++) {
    const shockGeo = new THREE.TorusGeometry(0.3 + r * 0.15, 0.015, 16, 128);
    const shockMat = superluminalWaveMat.clone();
    shockMat.opacity = 0.08;
    const shock = new THREE.Mesh(shockGeo, shockMat);
    shock.rotation.x = Math.PI / 2;
    shock.scale.set(0.01, 0.01, 0.01);
    shock.name = `ShockRing_${r}`;
    wavefrontGroup.add(shock);
  }

  meshes.wavefrontGroup = wavefrontGroup;
  group.add(wavefrontGroup);

  // ===== 6. CAUSALITY VIOLATION ZONE =====
  const causalityGroup = new THREE.Group();
  causalityGroup.name = 'CausalityViolationZone';

  const causalityGeo = new THREE.SphereGeometry(0.3, 64, 64);
  const causalityMesh = new THREE.Mesh(causalityGeo, causalityViolationMat);
  causalityMesh.name = 'ViolationBubble';
  causalityMesh.scale.set(0.01, 0.01, 0.01);
  meshes.causalityBubble = causalityMesh;
  causalityGroup.add(causalityMesh);

  // Temporal fracture lines (random jagged tubes)
  for (let f = 0; f < 16; f++) {
    const fracPts = [];
    const startDir = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ).normalize();
    for (let seg = 0; seg <= 12; seg++) {
      const frac = seg / 12;
      const jitter = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      );
      fracPts.push(startDir.clone().multiplyScalar(frac * 2.5).add(jitter));
    }
    const fracCurve = new THREE.CatmullRomCurve3(fracPts);
    const fracGeo = new THREE.TubeGeometry(fracCurve, 20, 0.012, 6, false);
    const fracMesh = new THREE.Mesh(fracGeo, causalityViolationMat);
    fracMesh.visible = false;
    causalityGroup.add(fracMesh);
  }

  meshes.causalityZone = causalityGroup;
  group.add(causalityGroup);

  // ===== 7. DETONATION MECHANISM (Complex piston array around equator) =====
  const detonatorGroup = new THREE.Group();
  detonatorGroup.name = 'DetonationMechanism';

  for (let d = 0; d < 16; d++) {
    const angle = (d / 16) * Math.PI * 2;
    const pistonOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16),
      darkSteel
    );
    pistonOuter.position.set(Math.cos(angle) * 2.6, 0, Math.sin(angle) * 2.6);
    pistonOuter.lookAt(0, 0, 0);
    pistonOuter.rotateX(Math.PI / 2);

    const pistonInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 1.4, 12),
      chrome
    );
    pistonInner.position.set(Math.cos(angle) * 2.2, 0, Math.sin(angle) * 2.2);
    pistonInner.lookAt(0, 0, 0);
    pistonInner.rotateX(Math.PI / 2);

    // Piston head — the shaped charge
    const chargeGeo = new THREE.ConeGeometry(0.15, 0.3, 16);
    const charge = new THREE.Mesh(chargeGeo, detonatorMat);
    charge.position.set(Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8);
    charge.lookAt(0, 0, 0);
    charge.rotateX(-Math.PI / 2);

    detonatorGroup.add(pistonOuter, pistonInner, charge);
  }

  // Polar detonators (top and bottom)
  for (let pole = -1; pole <= 1; pole += 2) {
    for (let pd = 0; pd < 6; pd++) {
      const pAngle = (pd / 6) * Math.PI * 2;
      const pRadius = 1.2;
      const piston = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12),
        steel
      );
      piston.position.set(
        Math.cos(pAngle) * pRadius,
        pole * 2.8,
        Math.sin(pAngle) * pRadius
      );
      detonatorGroup.add(piston);
    }
  }

  meshes.detonators = detonatorGroup;
  group.add(detonatorGroup);

  // ===== 8. FIELD CONTAINMENT COILS (Toroidal electromagnets) =====
  const coilGroup = new THREE.Group();
  coilGroup.name = 'FieldContainmentCoils';

  for (let coil = 0; coil < 6; coil++) {
    const coilAngle = (coil / 6) * Math.PI;
    const torusGeo = new THREE.TorusGeometry(2.0, 0.15, 24, 96);
    const torusMesh = new THREE.Mesh(torusGeo, copper);
    torusMesh.rotation.set(coilAngle, coilAngle * 0.5, 0);
    coilGroup.add(torusMesh);

    // Winding detail — fine wire wraps
    for (let w = 0; w < 48; w++) {
      const windAngle = (w / 48) * Math.PI * 2;
      const windGeo = new THREE.TorusGeometry(0.16, 0.008, 6, 32);
      const wind = new THREE.Mesh(windGeo, copper);
      wind.position.set(
        Math.cos(windAngle) * 2.0,
        Math.sin(windAngle) * 2.0,
        0
      );
      wind.rotation.set(0, 0, windAngle);
      // Inherit parent rotation
      const windGroup = new THREE.Group();
      windGroup.rotation.set(coilAngle, coilAngle * 0.5, 0);
      windGroup.add(wind);
      coilGroup.add(windGroup);
    }
  }

  meshes.coils = coilGroup;
  group.add(coilGroup);

  // ===== 9. TACHYON INJECTOR PORTS =====
  const injectorGroup = new THREE.Group();
  injectorGroup.name = 'TachyonInjectors';

  for (let i = 0; i < 12; i++) {
    const theta = Math.acos(1 - 2 * (i + 0.5) / 12);
    const phi = Math.PI * (1 + Math.sqrt(5)) * i;
    const ix = Math.sin(theta) * Math.cos(phi) * 3.15;
    const iy = Math.cos(theta) * 3.15;
    const iz = Math.sin(theta) * Math.sin(phi) * 3.15;

    // Injector nozzle body
    const nozzleGeo = new THREE.CylinderGeometry(0.06, 0.12, 0.5, 16);
    const nozzle = new THREE.Mesh(nozzleGeo, aluminum);
    nozzle.position.set(ix, iy, iz);
    nozzle.lookAt(0, 0, 0);
    nozzle.rotateX(Math.PI / 2);

    // Injector glow ring
    const glowRingGeo = new THREE.TorusGeometry(0.13, 0.02, 8, 32);
    const glowRing = new THREE.Mesh(glowRingGeo, tachyonConduitMat);
    glowRing.position.set(ix, iy, iz);
    glowRing.lookAt(0, 0, 0);

    injectorGroup.add(nozzle, glowRing);
  }

  meshes.injectors = injectorGroup;
  group.add(injectorGroup);

  // ===== 10. ARMING CONTROL MODULE (Detailed panel) =====
  const controlGroup = new THREE.Group();
  controlGroup.name = 'ArmingControlModule';

  // Panel chassis
  const panelShape = new THREE.Shape();
  panelShape.moveTo(-0.6, -0.4);
  panelShape.lineTo(0.6, -0.4);
  panelShape.quadraticCurveTo(0.7, -0.4, 0.7, -0.3);
  panelShape.lineTo(0.7, 0.3);
  panelShape.quadraticCurveTo(0.7, 0.4, 0.6, 0.4);
  panelShape.lineTo(-0.6, 0.4);
  panelShape.quadraticCurveTo(-0.7, 0.4, -0.7, 0.3);
  panelShape.lineTo(-0.7, -0.3);
  panelShape.quadraticCurveTo(-0.7, -0.4, -0.6, -0.4);

  const panelGeo = new THREE.ExtrudeGeometry(panelShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 3 });
  const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
  panelMesh.position.set(0, 0, 3.35);
  controlGroup.add(panelMesh);

  // Screen (tinted glass)
  const screenGeo = new THREE.PlaneGeometry(0.9, 0.45);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x001122,
    emissive: 0x003366,
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.9,
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 0.1, 3.4);
  meshes.controlScreen = screen;
  controlGroup.add(screen);

  // Arming key slot
  const keySlotGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 12);
  const keySlot = new THREE.Mesh(keySlotGeo, chrome);
  keySlot.position.set(-0.3, -0.2, 3.4);
  keySlot.rotation.x = Math.PI / 2;
  controlGroup.add(keySlot);

  // Red arming button
  const buttonGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 24);
  const button = new THREE.Mesh(buttonGeo, detonatorMat);
  button.position.set(0.3, -0.2, 3.42);
  button.rotation.x = Math.PI / 2;
  meshes.armButton = button;
  controlGroup.add(button);

  // Toggle switches
  for (let sw = 0; sw < 5; sw++) {
    const switchBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.06, 0.02),
      darkSteel
    );
    switchBase.position.set(-0.15 + sw * 0.08, -0.2, 3.4);
    const switchHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.05, 8),
      chrome
    );
    switchHandle.position.set(-0.15 + sw * 0.08, -0.18, 3.42);
    controlGroup.add(switchBase, switchHandle);
  }

  // Warning indicator LEDs
  for (let led = 0; led < 8; led++) {
    const ledGeo = new THREE.SphereGeometry(0.015, 12, 12);
    const ledMat = new THREE.MeshStandardMaterial({
      color: led < 4 ? 0x00ff00 : 0xff0000,
      emissive: led < 4 ? 0x00cc00 : 0xcc0000,
      emissiveIntensity: 2.0,
    });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(-0.28 + led * 0.08, 0.3, 3.41);
    controlGroup.add(ledMesh);
  }

  meshes.controlModule = controlGroup;
  group.add(controlGroup);

  // ===== 11. TEMPORAL STABILIZER FINS =====
  const finGroup = new THREE.Group();
  finGroup.name = 'TemporalStabilizerFins';

  for (let fin = 0; fin < 8; fin++) {
    const finAngle = (fin / 8) * Math.PI * 2;
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(1.5, 0.3);
    finShape.quadraticCurveTo(2.0, 0.2, 2.2, 0);
    finShape.quadraticCurveTo(2.0, -0.2, 1.5, -0.3);
    finShape.lineTo(0, 0);

    const finGeo = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.04, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2,
    });
    const finMesh = new THREE.Mesh(finGeo, darkArmorMat);
    finMesh.position.set(0, -2.8, 0);
    finMesh.rotation.set(0, finAngle, Math.PI / 6);

    // Fin edge glow strip
    const edgePts = [];
    for (let e = 0; e <= 20; e++) {
      const ef = e / 20;
      edgePts.push(new THREE.Vector3(ef * 2.2, Math.sin(ef * Math.PI) * 0.3, 0.02));
    }
    const edgeCurve = new THREE.CatmullRomCurve3(edgePts);
    const edgeGeo = new THREE.TubeGeometry(edgeCurve, 20, 0.008, 6, false);
    const edgeMesh = new THREE.Mesh(edgeGeo, chronoShieldMat.clone());
    edgeMesh.material.opacity = 0.7;
    finMesh.add(edgeMesh);

    finGroup.add(finMesh);
  }

  meshes.stabilizerFins = finGroup;
  group.add(finGroup);

  // ===== 12. GRAVITY LENS ARRAY (Fresnel-like concentric rings at poles) =====
  const lensGroup = new THREE.Group();
  lensGroup.name = 'GravityLensArray';

  for (let pole = -1; pole <= 1; pole += 2) {
    for (let ring = 0; ring < 8; ring++) {
      const lensRingGeo = new THREE.TorusGeometry(0.15 + ring * 0.18, 0.02, 8, 64);
      const lensMat = glass.clone ? glass.clone() : new THREE.MeshStandardMaterial({
        color: 0x88ccff, transparent: true, opacity: 0.3, metalness: 0.1, roughness: 0.05,
      });
      const lensRing = new THREE.Mesh(lensRingGeo, lensMat);
      lensRing.position.y = pole * 3.4;
      lensRing.rotation.x = Math.PI / 2;
      lensGroup.add(lensRing);
    }
    // Central focusing element
    const focusGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const focusMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xaaccff, emissiveIntensity: 2.0,
      transparent: true, opacity: 0.5,
    });
    const focus = new THREE.Mesh(focusGeo, focusMat);
    focus.position.y = pole * 3.4;
    lensGroup.add(focus);
  }

  meshes.gravityLens = lensGroup;
  group.add(lensGroup);

  // ===== 13. SPACETIME DISTORTION FIELD VISUALIZATION =====
  const distortionGroup = new THREE.Group();
  distortionGroup.name = 'SpacetimeDistortion';

  // Warped grid planes
  for (let axis = 0; axis < 3; axis++) {
    const gridGeo = new THREE.PlaneGeometry(12, 12, 48, 48);
    const gridMat = new THREE.MeshStandardMaterial({
      color: 0x4400aa,
      emissive: 0x220055,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    if (axis === 0) grid.rotation.x = Math.PI / 2;
    if (axis === 1) grid.rotation.y = Math.PI / 2;
    // axis 2 stays default
    distortionGroup.add(grid);
  }

  meshes.distortion = distortionGroup;
  group.add(distortionGroup);

  // ===== 14. TACHYON PARTICLE EMITTERS (Visual sparks) =====
  const emitterGroup = new THREE.Group();
  emitterGroup.name = 'TachyonParticleEmitters';

  const particlePositions = [];
  for (let p = 0; p < 200; p++) {
    const particleGeo = new THREE.SphereGeometry(0.015 + Math.random() * 0.02, 6, 6);
    const pMat = new THREE.MeshStandardMaterial({
      color: 0xbb77ff,
      emissive: 0x9955dd,
      emissiveIntensity: 3.0 + Math.random() * 2.0,
      transparent: true,
      opacity: 0.6 + Math.random() * 0.4,
    });
    const particle = new THREE.Mesh(particleGeo, pMat);
    const theta2 = Math.random() * Math.PI * 2;
    const phi2 = Math.acos(2 * Math.random() - 1);
    const pr = 1.0 + Math.random() * 2.5;
    particle.position.set(
      pr * Math.sin(phi2) * Math.cos(theta2),
      pr * Math.cos(phi2),
      pr * Math.sin(phi2) * Math.sin(theta2)
    );
    particlePositions.push({
      mesh: particle,
      baseR: pr,
      theta: theta2,
      phi: phi2,
      speed: 0.5 + Math.random() * 2.0,
      phaseOffset: Math.random() * Math.PI * 2,
    });
    emitterGroup.add(particle);
  }

  meshes.particles = particlePositions;
  meshes.emitterGroup = emitterGroup;
  group.add(emitterGroup);

  // ===== 15. WARNING MARKINGS & HAZARD INDICATORS =====
  const hazardGroup = new THREE.Group();
  hazardGroup.name = 'HazardIndicators';

  // Radiation trefoil approximation using spheres and cylinders
  for (let t = 0; t < 3; t++) {
    const tAngle = (t / 3) * Math.PI * 2;
    const hazSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      warningGlowMat
    );
    hazSphere.position.set(
      Math.cos(tAngle) * 0.2 + 3.35 * 0,
      2.5,
      Math.sin(tAngle) * 0.2 + 3.35
    );
    hazardGroup.add(hazSphere);
  }
  // Center dot
  const hazCenter = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    warningGlowMat
  );
  hazCenter.position.set(0, 2.5, 3.35);
  hazardGroup.add(hazCenter);

  // Hazard stripes around equator
  for (let hs = 0; hs < 24; hs++) {
    if (hs % 2 === 0) continue;
    const hsAngle = (hs / 24) * Math.PI * 2;
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.08, 0.02),
      warningGlowMat
    );
    stripe.position.set(
      Math.cos(hsAngle) * 3.2,
      0,
      Math.sin(hsAngle) * 3.2
    );
    stripe.lookAt(0, 0, 0);
    hazardGroup.add(stripe);
  }

  meshes.hazardIndicators = hazardGroup;
  group.add(hazardGroup);

  // ===== 16. INTERNAL TACHYON FLUX CAPACITOR RINGS =====
  const fluxGroup = new THREE.Group();
  fluxGroup.name = 'TachyonFluxCapacitors';

  for (let fr = 0; fr < 4; fr++) {
    const fluxTorusGeo = new THREE.TorusGeometry(1.0 + fr * 0.35, 0.06, 16, 96);
    const fluxMat = tachyonConduitMat.clone();
    fluxMat.emissiveIntensity = 1.0 + fr * 0.5;
    const fluxTorus = new THREE.Mesh(fluxTorusGeo, fluxMat);
    fluxTorus.rotation.x = Math.PI / 2 + fr * 0.15;
    fluxTorus.rotation.z = fr * 0.3;
    fluxGroup.add(fluxTorus);
  }

  meshes.fluxCapacitors = fluxGroup;
  group.add(fluxGroup);

  // ===== 17. ANTI-MATTER PRIMER CHARGES (Extruded star shapes) =====
  const primerGroup = new THREE.Group();
  primerGroup.name = 'AntiMatterPrimers';

  for (let pr = 0; pr < 6; pr++) {
    const prTheta = Math.acos(1 - 2 * (pr + 0.5) / 6);
    const prPhi = Math.PI * (1 + Math.sqrt(5)) * pr;
    const px = Math.sin(prTheta) * Math.cos(prPhi) * 2.5;
    const py = Math.cos(prTheta) * 2.5;
    const pz = Math.sin(prTheta) * Math.sin(prPhi) * 2.5;

    // Star shape
    const starShape = new THREE.Shape();
    for (let sp = 0; sp < 10; sp++) {
      const sa = (sp / 10) * Math.PI * 2 - Math.PI / 2;
      const sr = sp % 2 === 0 ? 0.15 : 0.07;
      const sx = Math.cos(sa) * sr;
      const sy = Math.sin(sa) * sr;
      if (sp === 0) starShape.moveTo(sx, sy);
      else starShape.lineTo(sx, sy);
    }
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
    const star = new THREE.Mesh(starGeo, detonatorMat);
    star.position.set(px, py, pz);
    star.lookAt(0, 0, 0);
    primerGroup.add(star);
  }

  meshes.primers = primerGroup;
  group.add(primerGroup);

  // ===== 18. MOUNTING CRADLE / DEPLOYMENT RAIL =====
  const cradleGroup = new THREE.Group();
  cradleGroup.name = 'DeploymentCradle';

  // Main rail beams
  for (let rail = -1; rail <= 1; rail += 2) {
    const railGeo = new THREE.BoxGeometry(0.15, 0.15, 10);
    const railMesh = new THREE.Mesh(railGeo, steel);
    railMesh.position.set(rail * 1.8, -4.0, 0);
    cradleGroup.add(railMesh);

    // Cross struts
    for (let strut = 0; strut < 8; strut++) {
      const strutGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.6, 8);
      const strutMesh = new THREE.Mesh(strutGeo, darkSteel);
      strutMesh.position.set(0, -4.0, -4.0 + strut * 1.15);
      strutMesh.rotation.z = Math.PI / 2;
      if (strut % 2 === 0) cradleGroup.add(strutMesh);
    }
  }

  // Support saddles
  for (let saddle = 0; saddle < 4; saddle++) {
    const saddleShape = new THREE.Shape();
    saddleShape.moveTo(-0.5, 0);
    saddleShape.quadraticCurveTo(-0.3, 0.8, 0, 1.0);
    saddleShape.quadraticCurveTo(0.3, 0.8, 0.5, 0);
    saddleShape.lineTo(-0.5, 0);

    const saddleGeo = new THREE.ExtrudeGeometry(saddleShape, { depth: 0.1, bevelEnabled: false });
    const saddleMesh = new THREE.Mesh(saddleGeo, aluminum);
    saddleMesh.position.set(0, -4.0, -3.0 + saddle * 2.0);
    saddleMesh.rotation.y = Math.PI / 2;
    cradleGroup.add(saddleMesh);
  }

  meshes.cradle = cradleGroup;
  group.add(cradleGroup);

  // ========================
  // PARTS MANIFEST
  // ========================
  const parts = [
    {
      name: 'Tachyonic Field Containment Vessel',
      description: 'Lathe-profiled vessel constructed from exotic meta-alloys capable of confining imaginary-mass tachyonic condensates. Multi-layered hull resists superluminal pressure differentials exceeding 10^44 Pa.',
      material: 'Exotic meta-alloy (negative-index metamaterial composite)',
      function: 'Contains the tachyonic field condensate in a metastable vacuum state, preventing premature detonation and tachyonic radiation leakage into surrounding spacetime.',
      assemblyOrder: 1,
      connections: ['Field Containment Coils', 'Tachyon Conduit Network', 'Armor Panel Array'],
      failureEffect: 'Instantaneous tachyonic field release; uncontrolled superluminal expansion creates an expanding causality violation bubble at faster-than-light speeds.',
      cascadeFailures: ['Chronological Shielding', 'Detonation Mechanism', 'All subsystems'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'Tachyonic Plasma Core',
      description: 'Triple-nested icosahedral assembly housing the tachyonic field condensate. Inner plasma core maintains tachyon density at 10^28 particles/cm³ via rotating magnetic confinement.',
      material: 'Plasma-suspended tachyonic condensate within holographic lattice',
      function: 'Stores the tachyonic condensate at imaginary-mass ground state. The nested shells provide graduated containment from raw plasma to stabilized field state.',
      assemblyOrder: 2,
      connections: ['Containment Vessel', 'Tachyon Conduit Network', 'Flux Capacitor Rings'],
      failureEffect: 'Core collapse triggers spontaneous symmetry breaking in the tachyonic field, initiating an uncontrolled detonation sequence.',
      cascadeFailures: ['Containment Vessel', 'Causality Violation Zone', 'Chronological Shielding'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 6, z: 0 },
    },
    {
      name: 'Tachyon Conduit Network',
      description: 'Eight primary spiral conduits and six lateral feed lines constructed from superluminal-rated waveguide material. Routes tachyonic flux from injectors to core.',
      material: 'Casimir-effect waveguide composite',
      function: 'Channels tachyonic particles from peripheral injectors to the central core, maintaining phase coherence across all feed lines for symmetric implosion.',
      assemblyOrder: 3,
      connections: ['Tachyonic Plasma Core', 'Tachyon Injector Ports', 'Flux Capacitor Rings'],
      failureEffect: 'Asymmetric tachyon delivery causes partial detonation; directed superluminal jet rather than spherical wavefront.',
      cascadeFailures: ['Tachyonic Plasma Core', 'Detonation Mechanism'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 3, z: 0 },
    },
    {
      name: 'Chronological Shielding Array',
      description: 'Five concentric temporal shielding spheres interlaced with three dodecahedral lattice frames. Creates a localized closed timelike curve barrier preventing causality violations from reaching the operator.',
      material: 'Chrono-crystalline metamaterial (CTC-stabilized lattice)',
      function: 'Generates a temporal firewall isolating the weapons platform from the causality violation zone created by the superluminal detonation wavefront.',
      assemblyOrder: 4,
      connections: ['Containment Vessel', 'Temporal Stabilizer Fins', 'Gravity Lens Array'],
      failureEffect: 'Operator exposed to retrocausal effects; information from the future leaks backward, creating paradoxes and potentially erasing the launch event from the timeline.',
      cascadeFailures: ['Temporal Stabilizer Fins', 'Deployment Cradle'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -5, y: 4, z: -5 },
    },
    {
      name: 'Superluminal Detonation Wavefront Projector',
      description: 'Spherical wavefront generator capable of producing an expanding shell of tachyonic energy moving at superluminal velocities (estimated 10^6 c at full yield).',
      material: 'Projected tachyonic energy (massless real component of imaginary-mass field)',
      function: 'Upon detonation, projects the destructive wavefront outward at faster-than-light speed, ensuring targets cannot receive warning or take evasive action since the wavefront arrives before the light from the detonation.',
      assemblyOrder: 5,
      connections: ['Tachyonic Plasma Core', 'Detonation Mechanism', 'Causality Violation Zone'],
      failureEffect: 'Wavefront fails to achieve superluminal velocity; degrades to subluminal detonation with drastically reduced strategic value.',
      cascadeFailures: ['Causality Violation Zone'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -6, z: 5 },
    },
    {
      name: 'Causality Violation Zone Generator',
      description: 'Produces the expanding region behind the superluminal wavefront where cause and effect are reversed. Temporal fracture lines visualize timeline disruptions.',
      material: 'Spacetime substrate (disrupted Minkowski metric)',
      function: 'The zone behind a superluminal wavefront necessarily violates causality per special relativity. This component shapes and directs that violation for maximum strategic effect.',
      assemblyOrder: 6,
      connections: ['Superluminal Wavefront', 'Chronological Shielding'],
      failureEffect: 'Uncontrolled causality violation creates temporal paradoxes that may retroactively prevent the bombs own construction.',
      cascadeFailures: ['Chronological Shielding', 'Arming Control Module'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 6, y: -3, z: -4 },
    },
    {
      name: 'Detonation Mechanism Array',
      description: '16 equatorial and 12 polar shaped-charge pistons arranged for perfectly symmetric implosion of the tachyonic condensate to achieve critical field density.',
      material: 'Hardened chromium-vanadium steel with shaped antimatter charge tips',
      function: 'Simultaneously fires all 28 charges inward to compress the tachyonic condensate past its critical instability threshold, triggering spontaneous symmetry breaking and detonation.',
      assemblyOrder: 7,
      connections: ['Containment Vessel', 'Tachyonic Plasma Core', 'Arming Control Module'],
      failureEffect: 'Asymmetric implosion produces a fizzle yield; tachyonic field partially collapses without achieving full superluminal expansion.',
      cascadeFailures: ['Superluminal Wavefront', 'Containment Vessel'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -4, y: 0, z: 6 },
    },
    {
      name: 'Field Containment Coils',
      description: 'Six toroidal electromagnetic coils with fine copper windings generating the magnetic bottle for tachyonic condensate confinement.',
      material: 'Superconducting copper-niobium alloy (Tc = 290K)',
      function: 'Creates a six-axis magnetic confinement field preventing the tachyonic condensate from tunneling through the vessel walls via quantum mechanical processes.',
      assemblyOrder: 8,
      connections: ['Containment Vessel', 'Tachyonic Plasma Core', 'Tachyon Flux Capacitors'],
      failureEffect: 'Magnetic bottle collapses; tachyonic condensate contacts vessel wall causing localized breach and partial field release.',
      cascadeFailures: ['Containment Vessel', 'Tachyonic Plasma Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 4, y: 5, z: 4 },
    },
    {
      name: 'Tachyon Injector Ports',
      description: '12 Fibonacci-distributed injection nozzles for introducing fresh tachyonic flux into the core during the arming sequence.',
      material: 'Platinum-iridium alloy with Casimir-cavity nozzle tips',
      function: 'Injects pre-accelerated tachyons into the core to increase condensate density from storage level to detonation-ready critical density.',
      assemblyOrder: 9,
      connections: ['Tachyon Conduit Network', 'Containment Vessel', 'Arming Control Module'],
      failureEffect: 'Insufficient tachyon injection results in sub-critical condensate density; weapon cannot achieve detonation threshold.',
      cascadeFailures: ['Tachyonic Plasma Core', 'Detonation Mechanism'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -6, y: -2, z: 3 },
    },
    {
      name: 'Arming Control Module',
      description: 'Hardened control panel with dual-key authentication, safety interlocks, status display, and 8-LED diagnostic array. Governs the entire arming and detonation sequence.',
      material: 'Hardened electronics in Faraday-shielded enclosure',
      function: 'Provides human-in-the-loop control over the arming sequence. Requires simultaneous dual-key activation plus authenticated launch code to enable detonation.',
      assemblyOrder: 10,
      connections: ['Detonation Mechanism', 'Tachyon Injectors', 'Chronological Shielding'],
      failureEffect: 'Loss of arming control renders weapon inert. Alternatively, control failure during armed state may trigger unintended detonation.',
      cascadeFailures: ['Detonation Mechanism'],
      originalPosition: { x: 0, y: 0, z: 3.35 },
      explodedPosition: { x: 0, y: 0, z: 9 },
    },
    {
      name: 'Temporal Stabilizer Fins',
      description: 'Eight extruded delta fins with chrono-luminescent edge strips. Stabilize the weapons temporal reference frame during transit through tachyonic-distorted spacetime.',
      material: 'Temporal-grade carbon-carbon composite with embedded chronoton emitters',
      function: 'Prevents the weapon itself from experiencing time dilation or retrocausal contamination during the arming phase when the internal tachyonic field is at high intensity.',
      assemblyOrder: 11,
      connections: ['Chronological Shielding', 'Containment Vessel', 'Deployment Cradle'],
      failureEffect: 'Weapon experiences temporal drift; internal clocks desynchronize causing detonation timing failure.',
      cascadeFailures: ['Arming Control Module', 'Detonation Mechanism'],
      originalPosition: { x: 0, y: -2.8, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 0 },
    },
    {
      name: 'Gravity Lens Array',
      description: 'Dual-pole Fresnel-style concentric ring arrays that focus gravitational lensing effects to shape the detonation wavefront geometry.',
      material: 'Gravitationally-active metamaterial (negative energy density rings)',
      function: 'Shapes the expanding superluminal wavefront into the desired geometry (spherical, conical, or planar) by gravitationally bending the tachyonic energy paths.',
      assemblyOrder: 12,
      connections: ['Superluminal Wavefront', 'Chronological Shielding'],
      failureEffect: 'Unfocused wavefront dissipates energy over larger volume; reduced destructive effect per unit area.',
      cascadeFailures: ['Superluminal Wavefront'],
      originalPosition: { x: 0, y: 3.4, z: 0 },
      explodedPosition: { x: 0, y: 10, z: 0 },
    },
    {
      name: 'Spacetime Distortion Field Visualizer',
      description: 'Three-axis wireframe grid displaying real-time metric tensor distortion around the weapon. Monitors for dangerous spacetime curvature anomalies.',
      material: 'Holographic projection (non-material diagnostic display)',
      function: 'Provides visual feedback on the degree of spacetime distortion caused by the tachyonic field, alerting operators to dangerous curvature thresholds.',
      assemblyOrder: 13,
      connections: ['Tachyonic Plasma Core', 'Arming Control Module'],
      failureEffect: 'Loss of spacetime monitoring; operators unaware of approaching Schwarzschild-radius density thresholds in the condensate.',
      cascadeFailures: ['Arming Control Module'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 0, z: 0 },
    },
    {
      name: 'Tachyon Flux Capacitor Rings',
      description: 'Four nested toroidal capacitors storing tachyonic flux at superluminal charge rates. Provide the surge current for detonation ignition.',
      material: 'Superluminal-rated dielectric composite',
      function: 'Stores accumulated tachyonic energy during the arming phase and delivers the massive instantaneous flux pulse required to push the condensate past critical instability.',
      assemblyOrder: 14,
      connections: ['Field Containment Coils', 'Tachyon Conduit Network', 'Detonation Mechanism'],
      failureEffect: 'Insufficient stored flux results in incomplete condensate compression; sub-critical detonation.',
      cascadeFailures: ['Detonation Mechanism', 'Tachyonic Plasma Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -7, y: 2, z: -3 },
    },
    {
      name: 'Anti-Matter Primer Charges',
      description: 'Six star-shaped antimatter charges distributed over the vessel surface in Fibonacci pattern. Provide the initial energy to begin tachyonic field compression.',
      material: 'Magnetically-confined antihydrogen in shaped charge geometry',
      function: 'Fires milliseconds before the main detonation pistons to pre-compress the tachyonic condensate, reducing the energy threshold required for superluminal expansion.',
      assemblyOrder: 15,
      connections: ['Detonation Mechanism', 'Containment Vessel'],
      failureEffect: 'Without primer compression, main detonation charges cannot achieve critical density. Weapon produces fizzle yield.',
      cascadeFailures: ['Detonation Mechanism', 'Superluminal Wavefront'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: -5, z: 5 },
    },
    {
      name: 'Hex-Panel Armor Array',
      description: '192 individually extruded hexagonal armor plates providing ablative protection against pre-detonation damage and electromagnetic interference.',
      material: 'Boron-carbide/tungsten cermet composite',
      function: 'Protects internal components from kinetic and electromagnetic threats during transit and deployment. Ablative design sacrifices outer layers to preserve containment integrity.',
      assemblyOrder: 16,
      connections: ['Containment Vessel', 'Reinforcement Rings'],
      failureEffect: 'Reduced protection exposes containment vessel to damage; risk of field breach from external threats.',
      cascadeFailures: ['Containment Vessel'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -3, y: 7, z: -6 },
    },
    {
      name: 'Deployment Cradle & Rail System',
      description: 'Dual-rail mounting system with saddle supports for weapon transport and launch. Provides mechanical interface to delivery platform.',
      material: 'High-strength structural steel with vibration-dampening saddle inserts',
      function: 'Secures the weapon during transport and provides the physical interface for deployment from the launch platform. Saddles distribute weight to prevent stress on containment vessel.',
      assemblyOrder: 17,
      connections: ['Containment Vessel', 'Temporal Stabilizer Fins'],
      failureEffect: 'Weapon separation failure during deployment; remains attached to launch platform within detonation radius.',
      cascadeFailures: ['Operator safety systems'],
      originalPosition: { x: 0, y: -4, z: 0 },
      explodedPosition: { x: 0, y: -12, z: 0 },
    },
  ];

  // ========================
  // QUIZ QUESTIONS (PhD-level tachyonic field theory)
  // ========================
  const quizQuestions = [
    {
      question: 'In the framework of relativistic quantum field theory, tachyonic fields are characterized by an imaginary mass parameter (m² < 0). What physical phenomenon does this imaginary mass actually signify in the context of spontaneous symmetry breaking, and why does it NOT imply faster-than-light signal propagation?',
      options: [
        'The imaginary mass indicates the field is sitting at an unstable maximum of its potential; the system rolls to the true vacuum via tachyonic condensation (spontaneous symmetry breaking). Group velocity remains subluminal.',
        'The imaginary mass allows particles to exceed the speed of light, directly enabling superluminal communication.',
        'The imaginary mass means the particles have negative energy and travel backward in time.',
        'The imaginary mass is a mathematical artifact with no physical significance.',
      ],
      correctAnswer: 0,
      explanation: 'In QFT, m² < 0 signals tachyonic instability: the field occupies an unstable local maximum (e.g., the "Mexican hat" potential at φ=0). The field condenses to the true vacuum (φ = v ≠ 0), a process known as tachyonic condensation or spontaneous symmetry breaking. As Feinberg (1967) and subsequent reinterpretations showed, tachyonic fields do not permit superluminal information transfer because the group velocity of wave packets remains subluminal, and the "tachyonic particles" are reinterpreted as quanta of the unstable field mode, not as real superluminal projectiles.',
    },
    {
      question: 'Gerald Feinberg\'s 1967 reinterpretation principle for tachyons addresses a critical paradox. If tachyons travel faster than light, an observer in a different Lorentz frame would see the tachyon traveling backward in time. How does the Feinberg reinterpretation resolve this apparent violation of causality?',
      options: [
        'Feinberg showed tachyons cannot interact with normal matter, making the paradox unobservable.',
        'The reinterpretation principle states that a tachyon traveling backward in time in one frame is physically equivalent to an anti-tachyon traveling forward in time in that frame, via the Stückelberg-Feynman switching principle. No observer detects an actual causality violation.',
        'Feinberg proved tachyons do not exist and are mathematically inconsistent.',
        'The reinterpretation restricts tachyons to travel only along the light cone, never exceeding c.',
      ],
      correctAnswer: 1,
      explanation: 'Feinberg applied the Stückelberg-Feynman switching principle: when a Lorentz transformation causes a tachyon\'s time-ordering to reverse, the process is reinterpreted as the emission (rather than absorption) of an anti-tachyon traveling forward in time. This "reinterpretation principle" ensures that every observer sees a consistent causal ordering of events. The mathematical framework preserves Lorentz invariance while avoiding closed causal loops, though it requires that tachyons carry no conserved quantum numbers that would distinguish absorption from emission.',
    },
    {
      question: 'The tachyonic instability in string theory arises from a specific mode of the bosonic string. Which string mode produces the tachyon, what does its presence indicate about the bosonic string vacuum, and how is it resolved in superstring theory?',
      options: [
        'The tachyon comes from the first excited string mode; it indicates extra dimensions. Superstring theory adds more dimensions.',
        'The ground state (lowest mass mode) of the open bosonic string has m² < 0, indicating the perturbative vacuum around which the theory is expanded is unstable. In superstring theory, the GSO (Gliozzi-Scherk-Olive) projection removes the tachyonic ground state from the physical spectrum, yielding a stable vacuum.',
        'The tachyon arises from closed string winding modes and indicates a topology change. It is resolved by compactification.',
        'The tachyon comes from string interactions at high energy. It is resolved by making the coupling constant small.',
      ],
      correctAnswer: 1,
      explanation: 'In the 26-dimensional bosonic string, the ground state has m² = -1/α\', which is tachyonic. This signals that the perturbative vacuum of the bosonic string is unstable — analogous to the unstable maximum in a scalar field potential. The physical process is "tachyon condensation," where the string field rolls to a true (possibly non-perturbative) vacuum. In the 10-dimensional superstring theories (Type I, IIA, IIB, Heterotic), the GSO projection — a consistency requirement from worldsheet supersymmetry — truncates the tachyonic ground state from the physical Hilbert space, leaving a stable, tachyon-free spectrum.',
    },
    {
      question: 'Consider a hypothetical tachyonic detonation weapon. If the destructive wavefront genuinely propagates at superluminal velocity v > c, analyze the causal structure of the affected spacetime using the framework of special relativity. Specifically, what is the relationship between the wavefront and the light cone of the detonation event?',
      options: [
        'The wavefront travels along the light cone, arriving simultaneously with the light flash.',
        'The wavefront is entirely within the future light cone, arriving after the light signal in every frame.',
        'The wavefront lies outside the future light cone of the detonation event (spacelike separated). For observers in certain frames, the wavefront arrives BEFORE the detonation event occurs — or equivalently, affects regions that are spacelike-separated from the detonation, violating the causal structure of Minkowski spacetime.',
        'The wavefront creates its own light cone which is larger than the normal one.',
      ],
      correctAnswer: 2,
      explanation: 'A superluminal wavefront, by definition, connects the detonation event to spacetime points that are spacelike-separated from it — points outside the future light cone. In special relativity, spacelike-separated events have frame-dependent temporal ordering: there exist valid Lorentz frames in which the effect (destruction by wavefront) precedes the cause (detonation). This is the fundamental reason superluminal signaling violates causality in SR. The region behind the wavefront constitutes a "causality violation zone" where retrocausal effects become possible, as effects arrive before any light-speed signal could warn of the detonation.',
    },
    {
      question: 'In condensed matter physics, "tachyonic instabilities" appear in real physical systems. Describe the physical mechanism of tachyonic instability in the context of the Higgs mechanism in the Standard Model, and explain how the Brout-Englert-Higgs (BEH) field\'s tachyonic mass parameter leads to electroweak symmetry breaking and mass generation for W and Z bosons.',
      options: [
        'The Higgs boson is a tachyon that travels faster than light, giving mass to W and Z bosons by collision.',
        'The BEH field has a potential V(φ) = -μ²|φ|² + λ|φ|⁴ where μ² > 0, meaning the origin φ=0 is an unstable maximum (tachyonic point). The field spontaneously condenses to the vacuum expectation value v = μ/√λ. Fluctuations around this true vacuum have positive m² (the 125 GeV Higgs boson). The W and Z bosons acquire mass through their gauge coupling to the non-zero vacuum expectation value via the covariant derivative terms.',
        'The tachyonic mass is cancelled by supersymmetric partners, and the Higgs mass comes from radiative corrections.',
        'The Higgs field has no tachyonic mass; its mass is generated by confinement analogous to QCD.',
      ],
      correctAnswer: 1,
      explanation: 'The BEH mechanism is the paradigmatic example of tachyonic condensation in fundamental physics. The Higgs potential V(φ) = μ²|φ|² + λ|φ|⁴ with μ² < 0 (equivalently written as -μ²|φ|² + λ|φ|⁴ with μ² > 0) has a "Mexican hat" shape where φ=0 is a local maximum — the tachyonic instability point. The field rolls to the minimum at |φ| = v = μ/√(2λ) ≈ 246 GeV. The gauge bosons W± and Z⁰ acquire masses proportional to gv (gauge coupling times VEV) through the |Dμφ|² kinetic term, which generates mass terms when φ is expanded around v. The physical Higgs boson at 125 GeV is the quantum of radial oscillations around this true vacuum. The original "tachyonic" mode (m² < 0 at φ=0) is thus not a real particle but a signal of vacuum instability that resolves itself through condensation.',
    },
  ];

  // ========================
  // DESCRIPTION
  // ========================
  const description = `The Tachyon Bomb is a theoretical weapon of ultimate strategic devastation that exploits tachyonic field theory to produce a destructive wavefront propagating at superluminal velocities. The weapon contains a metastable tachyonic field condensate — a state of matter characterized by imaginary mass (m² < 0) — within a multi-layered containment vessel reinforced by six-axis toroidal magnetic confinement coils.

Upon detonation, 28 precisely synchronized shaped charges (16 equatorial, 12 polar) compress the tachyonic condensate past its critical instability threshold, triggering spontaneous symmetry breaking analogous to the Brout-Englert-Higgs mechanism. The condensate transitions from the metastable false vacuum to the true vacuum, releasing the stored energy as an expanding superluminal shockwave.

The wavefront propagates at approximately 10⁶c, meaning it arrives at targets before any light-speed warning signal. Behind the wavefront lies a causality violation zone where the normal causal structure of spacetime is disrupted — effects precede causes, and retrocausal phenomena become possible. Five layers of chronological shielding protect the launch platform from these retrocausal effects using closed timelike curve barriers.

This weapon represents the ultimate expression of tachyonic field theory applied to strategic warfare, drawing on principles from quantum field theory, string theory (tachyonic ground state instabilities), and the Feinberg reinterpretation principle.`;

  // ========================
  // ANIMATE FUNCTION
  // ========================
  function animate(time, speed, refMeshes) {
    const t = time * speed;

    // 1. Core rotation — nested shells counter-rotate
    if (meshes.innerCore) {
      meshes.innerCore.rotation.x = t * 3.2;
      meshes.innerCore.rotation.y = t * 2.7;
      meshes.innerCore.rotation.z = t * 1.8;
    }
    if (meshes.midCore) {
      meshes.midCore.rotation.x = -t * 1.5;
      meshes.midCore.rotation.y = t * 2.0;
      meshes.midCore.rotation.z = -t * 1.2;
    }
    if (meshes.outerCoreWire) {
      meshes.outerCoreWire.rotation.x = t * 0.8;
      meshes.outerCoreWire.rotation.y = -t * 0.6;
      meshes.outerCoreWire.rotation.z = t * 0.4;
    }

    // 2. Singularity pulse
    if (meshes.singularity) {
      const singPulse = 0.08 + Math.sin(t * 8.0) * 0.04;
      meshes.singularity.scale.set(singPulse * 10, singPulse * 10, singPulse * 10);
      meshes.singularity.material.emissiveIntensity = 3.0 + Math.sin(t * 12.0) * 2.0;
    }

    // 3. Core plasma pulsation
    if (meshes.innerCore) {
      const plasmaScale = 1.0 + Math.sin(t * 5.0) * 0.08;
      meshes.innerCore.scale.set(plasmaScale, plasmaScale, plasmaScale);
      meshes.innerCore.material.emissiveIntensity = 3.0 + Math.sin(t * 6.0) * 1.5;
      meshes.innerCore.material.opacity = 0.5 + Math.sin(t * 4.0) * 0.15;
    }

    // 4. Chronological shield rotation and pulsation
    if (meshes.chronoShield) {
      meshes.chronoShield.children.forEach((child, idx) => {
        if (idx < 5) {
          // Sphere layers
          const shieldPulse = 1.0 + Math.sin(t * 2.0 + idx * 0.8) * 0.03;
          child.scale.set(shieldPulse, shieldPulse, shieldPulse);
          if (child.material) {
            child.material.opacity = 0.06 + Math.sin(t * 3.0 + idx) * 0.04;
          }
        } else {
          // Dodecahedral frames — slow rotation
          child.rotation.x += 0.002 * (idx - 4);
          child.rotation.y += 0.003 * (idx - 4);
          child.rotation.z += 0.001 * (idx - 4);
        }
      });
    }

    // 5. Superluminal wavefront — periodic detonation cycle
    const detonationCycle = 12.0; // seconds per cycle
    const cyclePhase = (t % detonationCycle) / detonationCycle;

    if (meshes.wavefront) {
      if (cyclePhase < 0.1) {
        // Pre-detonation: wavefront at zero
        const preScale = 0.01;
        meshes.wavefront.scale.set(preScale, preScale, preScale);
        meshes.wavefront.material.opacity = 0.0;
      } else if (cyclePhase < 0.7) {
        // Detonation: wavefront expands superluminally
        const expandPhase = (cyclePhase - 0.1) / 0.6;
        const expandScale = expandPhase * expandPhase * 15.0; // Accelerating expansion
        meshes.wavefront.scale.set(expandScale, expandScale, expandScale);
        meshes.wavefront.material.opacity = 0.15 * (1.0 - expandPhase);
        meshes.wavefront.material.emissiveIntensity = 5.0 * (1.0 - expandPhase * 0.7);
      } else {
        // Post-detonation: reset
        const fadePhase = (cyclePhase - 0.7) / 0.3;
        const fadeScale = 15.0 * (1.0 - fadePhase);
        meshes.wavefront.scale.set(fadeScale, fadeScale, fadeScale);
        meshes.wavefront.material.opacity = 0.02 * (1.0 - fadePhase);
      }
    }

    // 6. Shock rings expand with wavefront
    if (meshes.wavefrontGroup) {
      meshes.wavefrontGroup.children.forEach((child, idx) => {
        if (idx === 0) return; // Skip primary wavefront
        if (cyclePhase > 0.1 && cyclePhase < 0.7) {
          const ringPhase = Math.max(0, (cyclePhase - 0.1 - idx * 0.03) / 0.6);
          const ringScale = ringPhase * ringPhase * 12.0;
          child.scale.set(ringScale, ringScale, ringScale);
          child.material.opacity = 0.1 * (1.0 - ringPhase);
          child.rotation.z = t * 0.5 * (idx + 1);
        } else {
          child.scale.set(0.01, 0.01, 0.01);
        }
      });
    }

    // 7. Causality violation zone — appears behind wavefront
    if (meshes.causalityBubble) {
      if (cyclePhase > 0.15 && cyclePhase < 0.75) {
        const cvPhase = (cyclePhase - 0.15) / 0.6;
        const cvScale = cvPhase * 10.0;
        meshes.causalityBubble.scale.set(cvScale, cvScale, cvScale);
        meshes.causalityBubble.material.opacity = 0.25 * (1.0 - cvPhase * 0.5);
        // Flash temporal fracture lines
        meshes.causalityZone.children.forEach((child, idx) => {
          if (idx > 0) {
            child.visible = (cyclePhase > 0.2 && Math.sin(t * 20.0 + idx * 2.0) > 0.3);
            if (child.visible) {
              child.scale.set(cvScale * 0.4, cvScale * 0.4, cvScale * 0.4);
            }
          }
        });
      } else {
        meshes.causalityBubble.scale.set(0.01, 0.01, 0.01);
        meshes.causalityZone.children.forEach((child, idx) => {
          if (idx > 0) child.visible = false;
        });
      }
    }

    // 8. Containment coil slow rotation
    if (meshes.coils) {
      meshes.coils.rotation.y = t * 0.15;
      meshes.coils.rotation.x = Math.sin(t * 0.3) * 0.05;
    }

    // 9. Conduit glow pulsation
    if (meshes.conduits) {
      meshes.conduits.children.forEach((conduit, idx) => {
        if (conduit.material) {
          conduit.material.emissiveIntensity = 1.2 + Math.sin(t * 4.0 + idx * 0.5) * 0.8;
        }
      });
    }

    // 10. Tachyon particle animation — orbit and shimmer
    if (meshes.particles) {
      meshes.particles.forEach((p) => {
        const orbitalT = t * p.speed + p.phaseOffset;
        const r = p.baseR + Math.sin(orbitalT * 2.0) * 0.3;
        const theta = p.theta + orbitalT * 0.5;
        const phi = p.phi + Math.sin(orbitalT * 0.3) * 0.2;
        p.mesh.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
        p.mesh.material.emissiveIntensity = 2.0 + Math.sin(orbitalT * 8.0) * 2.0;
        p.mesh.material.opacity = 0.4 + Math.sin(orbitalT * 5.0) * 0.3;

        // During detonation, particles scatter outward
        if (cyclePhase > 0.1 && cyclePhase < 0.7) {
          const scatterPhase = (cyclePhase - 0.1) / 0.6;
          const scatterR = r + scatterPhase * 8.0;
          p.mesh.position.set(
            scatterR * Math.sin(phi) * Math.cos(theta),
            scatterR * Math.cos(phi),
            scatterR * Math.sin(phi) * Math.sin(theta)
          );
          p.mesh.material.emissiveIntensity = 5.0 * (1.0 - scatterPhase);
        }
      });
    }

    // 11. Flux capacitor ring rotation
    if (meshes.fluxCapacitors) {
      meshes.fluxCapacitors.children.forEach((ring, idx) => {
        ring.rotation.x = Math.PI / 2 + idx * 0.15 + t * (0.5 + idx * 0.3);
        ring.rotation.z = idx * 0.3 + t * 0.2;
        if (ring.material) {
          ring.material.emissiveIntensity = 1.0 + Math.sin(t * 3.0 + idx * 1.5) * 0.8;
        }
      });
    }

    // 12. Stabilizer fin subtle oscillation
    if (meshes.stabilizerFins) {
      meshes.stabilizerFins.children.forEach((fin, idx) => {
        const finOsc = Math.sin(t * 1.5 + idx * 0.8) * 0.03;
        fin.rotation.z = Math.PI / 6 + finOsc;
      });
    }

    // 13. Control screen flicker
    if (meshes.controlScreen) {
      meshes.controlScreen.material.emissiveIntensity = 1.2 + Math.sin(t * 15.0) * 0.3 + Math.sin(t * 7.3) * 0.2;
      // During arming phase, screen goes red
      if (cyclePhase > 0.05 && cyclePhase < 0.1) {
        meshes.controlScreen.material.emissive.setHex(0x880000);
      } else {
        meshes.controlScreen.material.emissive.setHex(0x003366);
      }
    }

    // 14. Arming button pulse
    if (meshes.armButton) {
      meshes.armButton.material.emissiveIntensity = 1.0 + Math.sin(t * 4.0) * 0.5;
    }

    // 15. Hazard indicator blink
    if (meshes.hazardIndicators) {
      meshes.hazardIndicators.children.forEach((haz) => {
        if (haz.material && haz.material.emissive) {
          haz.material.emissiveIntensity = 1.5 + Math.sin(t * 6.0) * 1.0;
        }
      });
    }

    // 16. Gravity lens rotation
    if (meshes.gravityLens) {
      meshes.gravityLens.rotation.y = t * 0.1;
    }

    // 17. Spacetime distortion grid warping
    if (meshes.distortion) {
      meshes.distortion.children.forEach((grid) => {
        if (grid.geometry && grid.geometry.attributes && grid.geometry.attributes.position) {
          const positions = grid.geometry.attributes.position;
          for (let v = 0; v < positions.count; v++) {
            const ox = positions.getX(v);
            const oy = positions.getY(v);
            const dist = Math.sqrt(ox * ox + oy * oy);
            const warp = Math.sin(dist * 0.8 - t * 2.0) * 0.15 / (1.0 + dist * 0.3);
            positions.setZ(v, warp);
          }
          positions.needsUpdate = true;
        }
        grid.material.opacity = 0.05 + Math.sin(t * 1.5) * 0.03;
      });
    }

    // 18. Reinforcement rings subtle shimmer
    if (meshes.reinforcementRings) {
      meshes.reinforcementRings.children.forEach((ring, idx) => {
        if (ring.material && ring.material.emissive) {
          ring.material.emissiveIntensity = 0.3 + Math.sin(t * 2.0 + idx * 0.5) * 0.2;
        }
      });
    }

    // 19. Injector port glow cycling
    if (meshes.injectors) {
      meshes.injectors.children.forEach((child, idx) => {
        if (child.material && child.material.emissiveIntensity !== undefined) {
          child.material.emissiveIntensity = 1.5 + Math.sin(t * 5.0 + idx * 0.7) * 1.0;
        }
      });
    }

    // 20. During detonation cycle: containment vessel cracks open
    if (meshes.containmentVessel) {
      if (cyclePhase > 0.08 && cyclePhase < 0.15) {
        const crackPhase = (cyclePhase - 0.08) / 0.07;
        meshes.containmentVessel.material.opacity = 1.0 - crackPhase * 0.6;
        meshes.containmentVessel.material.transparent = true;
        meshes.containmentVessel.material.emissiveIntensity = crackPhase * 3.0;
        meshes.containmentVessel.material.emissive = new THREE.Color(0x7700ff);
      } else if (cyclePhase > 0.15 && cyclePhase < 0.7) {
        meshes.containmentVessel.material.opacity = 0.3;
        meshes.containmentVessel.material.emissiveIntensity = 1.5 + Math.sin(t * 10.0) * 0.5;
      } else if (cyclePhase > 0.7) {
        // Rebuild containment
        const rebuildPhase = (cyclePhase - 0.7) / 0.3;
        meshes.containmentVessel.material.opacity = 0.3 + rebuildPhase * 0.7;
        meshes.containmentVessel.material.emissiveIntensity = 1.5 * (1.0 - rebuildPhase);
      } else {
        meshes.containmentVessel.material.opacity = 1.0;
        meshes.containmentVessel.material.transparent = false;
        meshes.containmentVessel.material.emissiveIntensity = 0.3;
      }
    }

    // 21. Whole assembly slow rotation for presentation
    group.rotation.y = t * 0.05;
  }

  return { group, parts, description, quizQuestions, animate };
}
