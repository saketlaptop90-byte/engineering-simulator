// ============================================================================
// GOD TIER ZERO POINT ENERGY REACTOR
// Extracts usable energy from the quantum vacuum ground state via
// dynamic Casimir effect, Lamb shift amplification, and Schwinger pair
// production at extreme field strengths.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ── Custom High-Tech Materials ──────────────────────────────────────────
  const vacuumGlow = new THREE.MeshStandardMaterial({
    color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 1.8,
    transparent: true, opacity: 0.35, side: THREE.DoubleSide
  });
  const casimirPlateGold = new THREE.MeshStandardMaterial({
    color: 0xffd700, metalness: 1.0, roughness: 0.08, emissive: 0xffd700, emissiveIntensity: 0.15
  });
  const schwingerFieldRed = new THREE.MeshStandardMaterial({
    color: 0xff1744, emissive: 0xff1744, emissiveIntensity: 2.5,
    transparent: true, opacity: 0.5
  });
  const lambShiftViolet = new THREE.MeshStandardMaterial({
    color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.45
  });
  const plasmaCyan = new THREE.MeshStandardMaterial({
    color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 2.2,
    transparent: true, opacity: 0.55
  });
  const neonBlue = new THREE.MeshStandardMaterial({
    color: 0x2979ff, emissive: 0x2979ff, emissiveIntensity: 1.6,
    transparent: true, opacity: 0.6
  });
  const warningOrange = new THREE.MeshStandardMaterial({
    color: 0xff6d00, emissive: 0xff6d00, emissiveIntensity: 1.4,
    transparent: true, opacity: 0.7
  });
  const hologramGreen = new THREE.MeshStandardMaterial({
    color: 0x76ff03, emissive: 0x76ff03, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.3
  });
  const neutrinoWhite = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0,
    transparent: true, opacity: 0.2
  });
  const darkMatter = new THREE.MeshStandardMaterial({
    color: 0x0a0a1e, metalness: 0.95, roughness: 0.15, emissive: 0x0a0a2e, emissiveIntensity: 0.1
  });
  const energyConduit = new THREE.MeshStandardMaterial({
    color: 0x00bcd4, metalness: 0.7, roughness: 0.2, emissive: 0x00bcd4, emissiveIntensity: 0.6
  });
  const quantumCrystal = new THREE.MeshStandardMaterial({
    color: 0xe040fb, emissive: 0xe040fb, emissiveIntensity: 1.2,
    transparent: true, opacity: 0.6, metalness: 0.5, roughness: 0.1
  });

  // ── Helper: Create rivets ring ──────────────────────────────────────────
  function addRivetsRing(parent, radius, y, count, rivetR) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const rivet = new THREE.Mesh(
        new THREE.SphereGeometry(rivetR || 0.03, 8, 8),
        chrome
      );
      rivet.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
      parent.add(rivet);
    }
  }

  // ── Helper: Hydraulic line (TubeGeometry) ───────────────────────────────
  function createHydraulicLine(points, radius, material) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.TubeGeometry(curve, 64, radius || 0.04, 12, false);
    return new THREE.Mesh(geo, material || copper);
  }

  // ── Helper: Panel line groove ───────────────────────────────────────────
  function addPanelLine(parent, r, y, segments) {
    const geo = new THREE.TorusGeometry(r, 0.008, 4, segments || 128);
    const line = new THREE.Mesh(geo, darkSteel);
    line.rotation.x = Math.PI / 2;
    line.position.y = y;
    parent.add(line);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 1: PRIMARY CONTAINMENT VESSEL (outer shell)
  // ══════════════════════════════════════════════════════════════════════════
  const containmentGroup = new THREE.Group();

  // Main outer shell – lathe profile for realistic curved reactor body
  const shellProfile = [
    new THREE.Vector2(0, -4.0),
    new THREE.Vector2(1.8, -3.8),
    new THREE.Vector2(2.6, -3.2),
    new THREE.Vector2(3.0, -2.4),
    new THREE.Vector2(3.2, -1.4),
    new THREE.Vector2(3.3, -0.5),
    new THREE.Vector2(3.35, 0),
    new THREE.Vector2(3.3, 0.5),
    new THREE.Vector2(3.2, 1.4),
    new THREE.Vector2(3.0, 2.4),
    new THREE.Vector2(2.6, 3.2),
    new THREE.Vector2(1.8, 3.8),
    new THREE.Vector2(0, 4.0)
  ];
  const shellGeo = new THREE.LatheGeometry(shellProfile, 128);
  const outerShell = new THREE.Mesh(shellGeo, darkSteel);
  outerShell.name = 'outerContainmentShell';
  containmentGroup.add(outerShell);

  // Panel lines on the shell
  for (let y = -3.5; y <= 3.5; y += 0.7) {
    const rAtY = 2.6 + 0.5 * Math.cos((y / 4) * Math.PI);
    addPanelLine(containmentGroup, rAtY, y, 160);
  }

  // Rivet rows
  for (let y = -3.2; y <= 3.2; y += 1.4) {
    const rAtY = 2.7 + 0.4 * Math.cos((y / 4) * Math.PI);
    addRivetsRing(containmentGroup, rAtY, y, 32, 0.04);
  }

  // Viewport windows (tinted glass observation ports)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const viewportFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.04, 12, 32),
      chrome
    );
    viewportFrame.position.set(Math.cos(angle) * 3.3, 0, Math.sin(angle) * 3.3);
    viewportFrame.lookAt(0, 0, 0);
    containmentGroup.add(viewportFrame);

    const viewportGlass = new THREE.Mesh(
      new THREE.CircleGeometry(0.2, 32),
      tinted
    );
    viewportGlass.position.copy(viewportFrame.position);
    viewportGlass.lookAt(0, 0, 0);
    containmentGroup.add(viewportGlass);
  }

  // Inner radiation shielding layer
  const innerShieldProfile = shellProfile.map(v => new THREE.Vector2(v.x * 0.88, v.y));
  const innerShieldGeo = new THREE.LatheGeometry(innerShieldProfile, 96);
  const innerShield = new THREE.Mesh(innerShieldGeo, aluminum);
  innerShield.name = 'innerRadiationShield';
  containmentGroup.add(innerShield);

  group.add(containmentGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 2: DYNAMIC CASIMIR EFFECT CHAMBER
  // Central chamber with oscillating mirror pairs
  // ══════════════════════════════════════════════════════════════════════════
  const casimirGroup = new THREE.Group();

  // Central vacuum chamber cylinder
  const chamberGeo = new THREE.CylinderGeometry(1.8, 1.8, 3.0, 64, 1, true);
  const chamber = new THREE.Mesh(chamberGeo, new THREE.MeshStandardMaterial({
    color: 0x1a1a2e, metalness: 0.9, roughness: 0.12, transparent: true, opacity: 0.4,
    side: THREE.DoubleSide
  }));
  chamber.name = 'casimirVacuumChamber';
  casimirGroup.add(chamber);

  // Flanges top and bottom
  for (const yy of [-1.55, 1.55]) {
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 2.1, 0.12, 64),
      steel
    );
    flange.position.y = yy;
    casimirGroup.add(flange);
    addRivetsRing(casimirGroup, 1.95, yy + 0.07, 24, 0.03);
  }

  // Mirror pair A (left/right oscillating Casimir plates)
  const mirrorMeshes = [];
  const mirrorPairPositions = [
    { base: -0.6, axis: 'x' },
    { base: 0.6, axis: 'x' },
    { base: -0.6, axis: 'z' },
    { base: 0.6, axis: 'z' }
  ];

  mirrorPairPositions.forEach((mp, idx) => {
    // Each mirror: a thin disc with gold coating
    const mirrorShape = new THREE.Shape();
    mirrorShape.moveTo(-0.5, -1.2);
    mirrorShape.lineTo(0.5, -1.2);
    mirrorShape.quadraticCurveTo(0.55, 0, 0.5, 1.2);
    mirrorShape.lineTo(-0.5, 1.2);
    mirrorShape.quadraticCurveTo(-0.55, 0, -0.5, -1.2);

    const mirrorGeo = new THREE.ExtrudeGeometry(mirrorShape, {
      depth: 0.03, bevelEnabled: true, bevelThickness: 0.005,
      bevelSize: 0.01, bevelSegments: 4
    });
    const mirror = new THREE.Mesh(mirrorGeo, casimirPlateGold);
    mirror.name = `casimirMirror_${idx}`;

    if (mp.axis === 'x') {
      mirror.position.set(mp.base, 0, 0);
      mirror.rotation.y = Math.PI / 2;
    } else {
      mirror.position.set(0, 0, mp.base);
    }
    mirrorMeshes.push(mirror);
    casimirGroup.add(mirror);

    // Mirror actuator rail
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.06, 1.6),
      chrome
    );
    if (mp.axis === 'x') {
      rail.position.set(0, -1.0, 0);
      rail.rotation.y = 0;
    } else {
      rail.position.set(0, -1.0, 0);
      rail.rotation.y = Math.PI / 2;
    }
    casimirGroup.add(rail);

    // Piezo actuator on each mirror
    const actuator = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.06, 0.3, 16),
      darkSteel
    );
    actuator.position.copy(mirror.position);
    actuator.position.y = -1.25;
    casimirGroup.add(actuator);
  });

  // Virtual photon visualization spheres (will glow and pulse)
  const virtualPhotons = [];
  for (let i = 0; i < 60; i++) {
    const photon = new THREE.Mesh(
      new THREE.SphereGeometry(0.025 + Math.random() * 0.03, 12, 12),
      vacuumGlow.clone()
    );
    photon.position.set(
      (Math.random() - 0.5) * 1.0,
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 1.0
    );
    photon.userData = {
      basePos: photon.position.clone(),
      speed: 0.5 + Math.random() * 2.0,
      phase: Math.random() * Math.PI * 2,
      amplitude: 0.1 + Math.random() * 0.3
    };
    virtualPhotons.push(photon);
    casimirGroup.add(photon);
  }

  group.add(casimirGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 3: LAMB SHIFT AMPLIFIER RING
  // Extracts vacuum polarization energy via resonant amplification
  // ══════════════════════════════════════════════════════════════════════════
  const lambGroup = new THREE.Group();

  // Main amplifier toroid
  const toroidGeo = new THREE.TorusGeometry(2.2, 0.35, 32, 128);
  const toroid = new THREE.Mesh(toroidGeo, aluminum);
  toroid.rotation.x = Math.PI / 2;
  toroid.name = 'lambShiftToroid';
  lambGroup.add(toroid);

  // Superconducting coil windings around the toroid
  const coilMeshes = [];
  for (let i = 0; i < 96; i++) {
    const angle = (i / 96) * Math.PI * 2;
    const coilR = 2.2;
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.02, 8, 16),
      copper
    );
    coil.position.set(Math.cos(angle) * coilR, 0, Math.sin(angle) * coilR);
    coil.rotation.y = angle + Math.PI / 2;
    coil.rotation.x = Math.PI / 2;
    coilMeshes.push(coil);
    lambGroup.add(coil);
  }

  // Vacuum polarization glow ring
  const vpGlowGeo = new THREE.TorusGeometry(2.2, 0.12, 16, 128);
  const vpGlow = new THREE.Mesh(vpGlowGeo, lambShiftViolet);
  vpGlow.rotation.x = Math.PI / 2;
  vpGlow.name = 'vacuumPolarizationGlow';
  lambGroup.add(vpGlow);

  // Resonance tuning capacitor banks (8 around the ring)
  const capacitorMeshes = [];
  for (let i = 0; i < 8; i++) {
    const capAngle = (i / 8) * Math.PI * 2;
    const capGroup = new THREE.Group();

    // Capacitor body
    const capBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.4, 16),
      darkSteel
    );
    capGroup.add(capBody);

    // Capacitor plates
    for (let p = -2; p <= 2; p++) {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.01, 16),
        casimirPlateGold
      );
      plate.position.y = p * 0.08;
      capGroup.add(plate);
    }

    // Status LED
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      hologramGreen
    );
    led.position.y = 0.22;
    capGroup.add(led);
    capacitorMeshes.push(led);

    capGroup.position.set(Math.cos(capAngle) * 2.2, 0, Math.sin(capAngle) * 2.2);
    capGroup.lookAt(0, 0, 0);
    lambGroup.add(capGroup);
  }

  // Energy siphon tubes from toroid to central chamber
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 8;
    const tube = createHydraulicLine([
      [Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2],
      [Math.cos(a) * 1.6, 0.4, Math.sin(a) * 1.6],
      [Math.cos(a) * 0.9, 0.6, Math.sin(a) * 0.9]
    ], 0.035, energyConduit);
    lambGroup.add(tube);
  }

  group.add(lambGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 4: SCHWINGER PAIR PRODUCTION ZONE
  // Extreme EM field region where virtual pairs become real
  // ══════════════════════════════════════════════════════════════════════════
  const schwingerGroup = new THREE.Group();
  schwingerGroup.position.y = 2.0;

  // High-field solenoid coils (stacked)
  for (let y = -0.8; y <= 0.8; y += 0.15) {
    const solenoid = new THREE.Mesh(
      new THREE.TorusGeometry(1.0, 0.06, 12, 64),
      copper
    );
    solenoid.rotation.x = Math.PI / 2;
    solenoid.position.y = y;
    schwingerGroup.add(solenoid);
  }

  // Field concentration poles (north/south electromagnet tips)
  for (const sign of [-1, 1]) {
    const poleShape = new THREE.Shape();
    poleShape.moveTo(0, 0);
    poleShape.lineTo(0.4, 0);
    poleShape.quadraticCurveTo(0.45, 0.3, 0.15, 0.7);
    poleShape.lineTo(0, 0.7);
    const poleGeo = new THREE.LatheGeometry(
      poleShape.getPoints(32).map(p => new THREE.Vector2(p.x, p.y * sign)),
      48
    );
    const pole = new THREE.Mesh(poleGeo, darkSteel);
    pole.position.set(sign * 0.5, 0, 0);
    pole.name = `schwingerPole_${sign > 0 ? 'north' : 'south'}`;
    schwingerGroup.add(pole);
  }

  // Schwinger critical field plasma glow
  const schwingerPlasma = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    schwingerFieldRed
  );
  schwingerPlasma.name = 'schwingerPlasma';
  schwingerGroup.add(schwingerPlasma);

  // Pair production particle trails (thin torus arcs)
  const pairTrails = [];
  for (let i = 0; i < 12; i++) {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.3 + Math.random() * 0.2, 0.008, 6, 32, Math.PI * (0.3 + Math.random() * 0.7)),
      i % 2 === 0 ? schwingerFieldRed : plasmaCyan
    );
    arc.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    arc.userData = { rotSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2
    )};
    pairTrails.push(arc);
    schwingerGroup.add(arc);
  }

  // Confinement ring magnets
  for (let i = 0; i < 6; i++) {
    const cAngle = (i / 6) * Math.PI * 2;
    const confMagnet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12),
      chrome
    );
    confMagnet.position.set(Math.cos(cAngle) * 1.1, 0, Math.sin(cAngle) * 1.1);
    confMagnet.lookAt(0, 2.0, 0);
    schwingerGroup.add(confMagnet);

    // Magnet housing
    const housing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.22, 12),
      darkSteel
    );
    housing.position.copy(confMagnet.position);
    housing.lookAt(0, 2.0, 0);
    schwingerGroup.add(housing);
  }

  group.add(schwingerGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 5: POWER CONDITIONING & OUTPUT SYSTEMS
  // ══════════════════════════════════════════════════════════════════════════
  const powerGroup = new THREE.Group();
  powerGroup.position.y = -2.5;

  // Main transformer/converter housing
  const converterShape = new THREE.Shape();
  converterShape.moveTo(-1.2, -0.6);
  converterShape.lineTo(1.2, -0.6);
  converterShape.quadraticCurveTo(1.4, -0.6, 1.4, -0.4);
  converterShape.lineTo(1.4, 0.4);
  converterShape.quadraticCurveTo(1.4, 0.6, 1.2, 0.6);
  converterShape.lineTo(-1.2, 0.6);
  converterShape.quadraticCurveTo(-1.4, 0.6, -1.4, 0.4);
  converterShape.lineTo(-1.4, -0.4);
  converterShape.quadraticCurveTo(-1.4, -0.6, -1.2, -0.6);

  const converterGeo = new THREE.ExtrudeGeometry(converterShape, {
    depth: 1.0, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3
  });
  const converter = new THREE.Mesh(converterGeo, darkSteel);
  converter.rotation.x = Math.PI / 2;
  converter.position.y = 0;
  converter.name = 'powerConverter';
  powerGroup.add(converter);

  // Heat sinks / cooling fins
  for (let i = 0; i < 24; i++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.8, 0.6),
      aluminum
    );
    fin.position.set(-1.3 + i * 0.11, 0, 0.6);
    powerGroup.add(fin);
  }

  // Power output busbars
  const busbarColors = [schwingerFieldRed, neonBlue, hologramGreen];
  for (let i = 0; i < 3; i++) {
    const busbar = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.06, 0.08),
      busbarColors[i]
    );
    busbar.position.set(0, -0.4 - i * 0.12, 0);
    powerGroup.add(busbar);
  }

  // Output terminals (heavy copper lugs)
  for (let side = -1; side <= 1; side += 2) {
    const terminal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 0.2, 16),
      copper
    );
    terminal.position.set(side * 1.6, -0.5, 0);
    powerGroup.add(terminal);

    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.1, 8),
      chrome
    );
    bolt.position.set(side * 1.6, -0.35, 0);
    powerGroup.add(bolt);
  }

  // Capacitor bank array
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.35, 12),
        darkSteel
      );
      cap.position.set(-0.6 + col * 0.24, -0.9, -0.3 + row * 0.25);
      powerGroup.add(cap);

      // Cap top disc
      const capTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.02, 12),
        aluminum
      );
      capTop.position.set(cap.position.x, -0.72, cap.position.z);
      powerGroup.add(capTop);
    }
  }

  group.add(powerGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 6: OPERATOR CONTROL CABIN & INSTRUMENTS
  // ══════════════════════════════════════════════════════════════════════════
  const cabinGroup = new THREE.Group();
  cabinGroup.position.set(4.5, 0, 0);

  // Cabin frame
  const cabinBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2.2, 1.4),
    darkSteel
  );
  cabinGroup.add(cabinBody);

  // Tinted observation window
  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.0),
    tinted
  );
  windowGlass.position.set(-0.81, 0.3, 0);
  windowGlass.rotation.y = Math.PI / 2;
  cabinGroup.add(windowGlass);

  // Window frame
  const windowFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 1.1, 1.5),
    chrome
  );
  windowFrame.position.set(-0.81, 0.3, 0);
  cabinGroup.add(windowFrame);

  // Control console
  const console_ = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.08, 0.7),
    darkSteel
  );
  console_.position.set(0, -0.4, -0.3);
  console_.rotation.x = -0.3;
  cabinGroup.add(console_);

  // Monitor screens (3 across)
  const screenMeshes = [];
  for (let s = -1; s <= 1; s++) {
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.2),
      new THREE.MeshStandardMaterial({
        color: 0x001100, emissive: 0x00ff41, emissiveIntensity: 0.8
      })
    );
    screen.position.set(s * 0.32, -0.32, -0.55);
    screen.rotation.x = -0.3;
    screenMeshes.push(screen);
    cabinGroup.add(screen);
  }

  // Joystick
  const joystickBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 0.05, 12),
    darkSteel
  );
  joystickBase.position.set(0.3, -0.35, -0.1);
  cabinGroup.add(joystickBase);

  const joystickStick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.02, 0.15, 8),
    rubber
  );
  joystickStick.position.set(0.3, -0.26, -0.1);
  cabinGroup.add(joystickStick);

  const joystickKnob = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    rubber
  );
  joystickKnob.position.set(0.3, -0.18, -0.1);
  cabinGroup.add(joystickKnob);

  // Toggle switches row
  for (let i = 0; i < 8; i++) {
    const switchBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.02, 0.03),
      darkSteel
    );
    switchBase.position.set(-0.3 + i * 0.08, -0.35, 0);
    cabinGroup.add(switchBase);

    const toggle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.04, 6),
      chrome
    );
    toggle.position.set(-0.3 + i * 0.08, -0.32, 0);
    toggle.rotation.z = (i % 2 === 0) ? 0.4 : -0.4;
    cabinGroup.add(toggle);
  }

  // Indicator LEDs cluster
  const ledMeshes = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const ledMat = [hologramGreen, warningOrange, schwingerFieldRed, neonBlue][c % 4];
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 8, 8),
        ledMat.clone()
      );
      led.position.set(-0.15 + c * 0.06, -0.28 + r * 0.06, -0.6);
      ledMeshes.push(led);
      cabinGroup.add(led);
    }
  }

  // Operator chair
  const seatBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.05, 0.5, 8),
    chrome
  );
  seatBase.position.set(0, -0.85, 0.1);
  cabinGroup.add(seatBase);

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.06, 0.35),
    rubber
  );
  seat.position.set(0, -0.6, 0.1);
  cabinGroup.add(seat);

  const seatBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.4, 0.05),
    rubber
  );
  seatBack.position.set(0, -0.38, 0.27);
  cabinGroup.add(seatBack);

  // Ladder to cabin
  for (let rung = 0; rung < 6; rung++) {
    const rungMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8),
      chrome
    );
    rungMesh.rotation.z = Math.PI / 2;
    rungMesh.position.set(0.8, -1.1 + rung * 0.35, 0.7);
    cabinGroup.add(rungMesh);
  }
  // Ladder rails
  for (const side of [-0.25, 0.25]) {
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8),
      chrome
    );
    rail.position.set(0.8 + side, -0.2, 0.7);
    cabinGroup.add(rail);
  }

  group.add(cabinGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 7: QUANTUM VACUUM WAVEGUIDES & ENERGY DISTRIBUTION
  // ══════════════════════════════════════════════════════════════════════════
  const waveguideGroup = new THREE.Group();

  // Main vertical energy column
  const energyColumnGeo = new THREE.CylinderGeometry(0.25, 0.25, 8.0, 32, 1, true);
  const energyColumn = new THREE.Mesh(energyColumnGeo, plasmaCyan);
  energyColumn.name = 'mainEnergyColumn';
  waveguideGroup.add(energyColumn);

  // Helical energy vortex wrapping the column
  const helixPoints = [];
  for (let t = 0; t < 200; t++) {
    const tt = (t / 200) * Math.PI * 12;
    helixPoints.push(new THREE.Vector3(
      Math.cos(tt) * 0.45,
      -4.0 + (t / 200) * 8.0,
      Math.sin(tt) * 0.45
    ));
  }
  const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
  const helixGeo = new THREE.TubeGeometry(helixCurve, 256, 0.025, 8, false);
  const helix = new THREE.Mesh(helixGeo, neonBlue);
  helix.name = 'energyVortexHelix';
  waveguideGroup.add(helix);

  // Secondary helix (counter-rotating visualization)
  const helix2Points = [];
  for (let t = 0; t < 200; t++) {
    const tt = (t / 200) * Math.PI * 12;
    helix2Points.push(new THREE.Vector3(
      Math.cos(-tt + Math.PI) * 0.45,
      -4.0 + (t / 200) * 8.0,
      Math.sin(-tt + Math.PI) * 0.45
    ));
  }
  const helix2Curve = new THREE.CatmullRomCurve3(helix2Points);
  const helix2Geo = new THREE.TubeGeometry(helix2Curve, 256, 0.025, 8, false);
  const helix2 = new THREE.Mesh(helix2Geo, lambShiftViolet);
  waveguideGroup.add(helix2);

  // Waveguide output ports (6 radial)
  for (let i = 0; i < 6; i++) {
    const wAngle = (i / 6) * Math.PI * 2;
    const wgTube = createHydraulicLine([
      [0, -3.0, 0],
      [Math.cos(wAngle) * 1.5, -3.2, Math.sin(wAngle) * 1.5],
      [Math.cos(wAngle) * 3.0, -3.5, Math.sin(wAngle) * 3.0]
    ], 0.06, energyConduit);
    waveguideGroup.add(wgTube);

    // Output port flange
    const outFlange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.06, 16),
      steel
    );
    outFlange.position.set(Math.cos(wAngle) * 3.0, -3.5, Math.sin(wAngle) * 3.0);
    waveguideGroup.add(outFlange);
  }

  group.add(waveguideGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 8: CRYOGENIC COOLING SUBSYSTEM
  // ══════════════════════════════════════════════════════════════════════════
  const cryoGroup = new THREE.Group();

  // Cryostat vessel (double-walled dewar)
  const cryoOuterGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 32);
  const cryoOuter = new THREE.Mesh(cryoOuterGeo, aluminum);
  cryoOuter.position.set(-4.0, 0, 2.0);
  cryoGroup.add(cryoOuter);

  const cryoInnerGeo = new THREE.CylinderGeometry(0.45, 0.45, 2.3, 32);
  const cryoInner = new THREE.Mesh(cryoInnerGeo, chrome);
  cryoInner.position.set(-4.0, 0, 2.0);
  cryoGroup.add(cryoInner);

  // Cryo transfer lines to reactor
  const cryoLine1 = createHydraulicLine([
    [-4.0, 0.8, 2.0], [-3.0, 1.0, 1.5], [-2.0, 0.8, 0.8], [-1.0, 0.5, 0.3]
  ], 0.05, new THREE.MeshStandardMaterial({
    color: 0x81d4fa, metalness: 0.6, roughness: 0.2
  }));
  cryoGroup.add(cryoLine1);

  const cryoLine2 = createHydraulicLine([
    [-4.0, -0.8, 2.0], [-3.0, -1.0, 1.5], [-2.0, -0.8, 0.8], [-1.0, -0.5, 0.3]
  ], 0.05, new THREE.MeshStandardMaterial({
    color: 0x81d4fa, metalness: 0.6, roughness: 0.2
  }));
  cryoGroup.add(cryoLine2);

  // Pressure gauges on cryostat
  for (let g = 0; g < 3; g++) {
    const gaugeBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.03, 24),
      darkSteel
    );
    gaugeBack.rotation.z = Math.PI / 2;
    gaugeBack.position.set(-3.38, 0.6 - g * 0.5, 2.0);
    cryoGroup.add(gaugeBack);

    const gaugeFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.09, 24),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    gaugeFace.rotation.y = -Math.PI / 2;
    gaugeFace.position.set(-3.37, 0.6 - g * 0.5, 2.0);
    cryoGroup.add(gaugeFace);

    // Needle
    const needle = new THREE.Mesh(
      new THREE.BoxGeometry(0.005, 0.07, 0.001),
      schwingerFieldRed
    );
    needle.rotation.y = -Math.PI / 2;
    needle.position.set(-3.365, 0.6 - g * 0.5, 2.0);
    needle.rotation.z = -0.3 + g * 0.5;
    cryoGroup.add(needle);
  }

  // Safety relief valve
  const valve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12),
    steel
  );
  valve.position.set(-4.0, 1.35, 2.0);
  cryoGroup.add(valve);

  const valveHandle = new THREE.Mesh(
    new THREE.TorusGeometry(0.07, 0.012, 8, 16),
    chrome
  );
  valveHandle.position.set(-4.0, 1.45, 2.0);
  cryoGroup.add(valveHandle);

  group.add(cryoGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 9: VACUUM BIREFRINGENCE DETECTOR ARRAY
  // ══════════════════════════════════════════════════════════════════════════
  const birefGroup = new THREE.Group();
  birefGroup.position.y = -1.0;

  // Laser source housing
  const laserHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.12, 0.8, 16),
    darkSteel
  );
  laserHousing.rotation.z = Math.PI / 2;
  laserHousing.position.set(-2.5, 0, -2.5);
  birefGroup.add(laserHousing);

  // Laser beam (thin neon line)
  const laserBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 5.0, 8),
    new THREE.MeshStandardMaterial({
      color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 5.0,
      transparent: true, opacity: 0.7
    })
  );
  laserBeam.rotation.z = Math.PI / 2;
  laserBeam.position.set(0, 0, -2.5);
  laserBeam.name = 'birefringenceLaser';
  birefGroup.add(laserBeam);

  // Detector on the other end
  const detector = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.3, 16),
    darkSteel
  );
  detector.rotation.z = Math.PI / 2;
  detector.position.set(2.5, 0, -2.5);
  birefGroup.add(detector);

  // Detector sensor face
  const sensorFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.15, 24),
    quantumCrystal
  );
  sensorFace.rotation.y = Math.PI / 2;
  sensorFace.position.set(2.35, 0, -2.5);
  birefGroup.add(sensorFace);

  // Polarizer crystals
  for (let i = 0; i < 3; i++) {
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.1, 0),
      quantumCrystal
    );
    crystal.position.set(-1.5 + i * 1.5, 0, -2.5);
    crystal.rotation.y = Math.PI / 4;
    birefGroup.add(crystal);
  }

  group.add(birefGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 10: EXHAUST & SAFETY SYSTEMS
  // ══════════════════════════════════════════════════════════════════════════
  const exhaustGroup = new THREE.Group();

  // Exhaust stacks (thermal venting)
  for (let i = 0; i < 4; i++) {
    const eAngle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const stackProfile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.15, 0),
      new THREE.Vector2(0.14, 0.8),
      new THREE.Vector2(0.12, 1.6),
      new THREE.Vector2(0.16, 2.0),
      new THREE.Vector2(0.18, 2.2),
      new THREE.Vector2(0, 2.2)
    ];
    const stackGeo = new THREE.LatheGeometry(stackProfile, 24);
    const stack = new THREE.Mesh(stackGeo, darkSteel);
    stack.position.set(Math.cos(eAngle) * 2.8, 3.2, Math.sin(eAngle) * 2.8);
    exhaustGroup.add(stack);

    // Exhaust glow at top
    const exhaustGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      warningOrange
    );
    exhaustGlow.position.set(Math.cos(eAngle) * 2.8, 5.4, Math.sin(eAngle) * 2.8);
    exhaustGroup.add(exhaustGlow);

    // Heat shield band
    const heatBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.02, 8, 24),
      chrome
    );
    heatBand.rotation.x = Math.PI / 2;
    heatBand.position.set(Math.cos(eAngle) * 2.8, 4.0, Math.sin(eAngle) * 2.8);
    exhaustGroup.add(heatBand);
  }

  // Emergency shutdown rod mechanisms
  for (let i = 0; i < 3; i++) {
    const rodAngle = (i / 3) * Math.PI * 2;
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 4.0, 8),
      chrome
    );
    rod.position.set(Math.cos(rodAngle) * 0.8, 0, Math.sin(rodAngle) * 0.8);
    rod.name = `emergencyRod_${i}`;
    exhaustGroup.add(rod);

    // Rod actuator housing
    const rodHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.4, 12),
      steel
    );
    rodHousing.position.set(Math.cos(rodAngle) * 0.8, 2.2, Math.sin(rodAngle) * 0.8);
    exhaustGroup.add(rodHousing);
  }

  group.add(exhaustGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 11: BASE PLATFORM & STRUCTURAL SUPPORTS
  // ══════════════════════════════════════════════════════════════════════════
  const baseGroup = new THREE.Group();

  // Heavy base platform
  const basePlatform = new THREE.Mesh(
    new THREE.CylinderGeometry(4.5, 4.8, 0.3, 64),
    steel
  );
  basePlatform.position.y = -4.5;
  baseGroup.add(basePlatform);
  addRivetsRing(baseGroup, 4.4, -4.35, 48, 0.04);

  // Gusset supports
  for (let i = 0; i < 8; i++) {
    const gAngle = (i / 8) * Math.PI * 2;
    const gusset = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.5, 0.4),
      steel
    );
    gusset.position.set(Math.cos(gAngle) * 3.5, -3.2, Math.sin(gAngle) * 3.5);
    gusset.rotation.y = gAngle;
    baseGroup.add(gusset);
  }

  // Anti-vibration mounts
  for (let i = 0; i < 12; i++) {
    const mAngle = (i / 12) * Math.PI * 2;
    const mount = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 0.2, 12),
      rubber
    );
    mount.position.set(Math.cos(mAngle) * 4.2, -4.7, Math.sin(mAngle) * 4.2);
    baseGroup.add(mount);
  }

  // Cable trays
  for (let i = 0; i < 4; i++) {
    const ctAngle = (i / 4) * Math.PI * 2;
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.05, 3.0),
      aluminum
    );
    tray.position.set(Math.cos(ctAngle) * 3.8, -4.3, Math.sin(ctAngle) * 3.8);
    tray.rotation.y = ctAngle;
    baseGroup.add(tray);

    // Cables in tray
    for (let c = 0; c < 5; c++) {
      const cable = createHydraulicLine([
        [Math.cos(ctAngle) * 2.5, -4.25, Math.sin(ctAngle) * 2.5],
        [Math.cos(ctAngle) * 3.2, -4.2, Math.sin(ctAngle) * 3.2],
        [Math.cos(ctAngle) * 4.0, -4.25, Math.sin(ctAngle) * 4.0]
      ], 0.015, [copper, rubber, energyConduit, neonBlue, plastic][c]);
      baseGroup.add(cable);
    }
  }

  group.add(baseGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 12: QUANTUM FIELD STATUS HOLOGRAM PROJECTOR
  // ══════════════════════════════════════════════════════════════════════════
  const holoGroup = new THREE.Group();
  holoGroup.position.set(0, 5.5, 0);

  // Projector base ring
  const projRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.05, 12, 48),
    chrome
  );
  projRing.rotation.x = Math.PI / 2;
  holoGroup.add(projRing);

  // Holographic sphere projection
  const holoSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 2),
    hologramGreen
  );
  holoSphere.name = 'hologramProjection';
  holoGroup.add(holoSphere);

  // Hologram wireframe overlay
  const holoWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.42, 1),
    new THREE.MeshStandardMaterial({
      color: 0x76ff03, emissive: 0x76ff03, emissiveIntensity: 1.0,
      wireframe: true, transparent: true, opacity: 0.5
    })
  );
  holoGroup.add(holoWire);

  // Data stream particles rising into hologram
  const dataParticles = [];
  for (let i = 0; i < 30; i++) {
    const dp = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.015, 0.015),
      hologramGreen
    );
    dp.position.set(
      (Math.random() - 0.5) * 0.8,
      -1.0 + Math.random() * 1.5,
      (Math.random() - 0.5) * 0.8
    );
    dp.userData = { speed: 0.3 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2 };
    dataParticles.push(dp);
    holoGroup.add(dp);
  }

  group.add(holoGroup);

  // ══════════════════════════════════════════════════════════════════════════
  // COLLECT ALL ANIMATED MESHES
  // ══════════════════════════════════════════════════════════════════════════
  const meshes = {
    mirrorMeshes,
    virtualPhotons,
    vpGlow,
    schwingerPlasma,
    pairTrails,
    capacitorMeshes,
    coilMeshes,
    screenMeshes,
    ledMeshes,
    energyColumn,
    helix,
    helix2,
    holoSphere,
    holoWire,
    dataParticles,
    laserBeam
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PARTS MANIFEST (15+ detailed entries)
  // ══════════════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Outer Containment Shell',
      description: 'Multi-layered LatheGeometry reactor vessel rated for extreme vacuum and EM field containment. Composed of borated steel with titanium carbide inner lining.',
      material: 'Borated Steel / TiC Lining',
      function: 'Provides primary structural integrity, radiation shielding, and vacuum boundary for the quantum field extraction chambers.',
      assemblyOrder: 1,
      connections: ['Inner Radiation Shield', 'Base Platform', 'Exhaust Stacks'],
      failureEffect: 'Catastrophic vacuum breach; uncontrolled virtual particle materialization and radiation release.',
      cascadeFailures: ['Inner Radiation Shield', 'Casimir Vacuum Chamber'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'Inner Radiation Shield',
      description: 'Secondary aluminum-gadolinium alloy shield absorbing stray gammas from Schwinger pair annihilation events.',
      material: 'Al-Gd Alloy',
      function: 'Attenuates secondary gamma radiation from electron-positron pair annihilation in the Schwinger zone.',
      assemblyOrder: 2,
      connections: ['Outer Containment Shell', 'Casimir Vacuum Chamber'],
      failureEffect: 'Radiation dose rate in operator cabin exceeds safe limits; automatic SCRAM triggered.',
      cascadeFailures: ['Operator Control Cabin'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 2, z: 0 }
    },
    {
      name: 'Casimir Vacuum Chamber',
      description: 'Ultra-high vacuum chamber housing four oscillating gold-coated mirror pairs. Pressure maintained below 10⁻¹² Torr.',
      material: 'Fused Silica / Gold-coated Mirrors',
      function: 'Creates dynamic Casimir effect via near-relativistic mirror oscillation, converting virtual photons to real photons.',
      assemblyOrder: 3,
      connections: ['Casimir Mirror Array', 'Lamb Shift Amplifier Toroid'],
      failureEffect: 'Loss of vacuum kills Casimir photon production; reactor output drops to zero.',
      cascadeFailures: ['Power Conditioning System', 'Lamb Shift Amplifier Toroid'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 4, z: 0 }
    },
    {
      name: 'Casimir Mirror Array',
      description: 'Four gold-coated piezo-actuated mirrors oscillating at GHz frequencies near the speed of light to generate the dynamic Casimir effect.',
      material: 'Gold / Piezo-ceramic Actuators',
      function: 'Oscillates mirror boundaries at near-c velocities, modulating quantum vacuum boundary conditions to produce real photon pairs from virtual vacuum fluctuations.',
      assemblyOrder: 4,
      connections: ['Casimir Vacuum Chamber', 'Piezo Actuator Rails'],
      failureEffect: 'Mirror desynchronization destroys coherent photon extraction; possible mirror fracture from resonant stress.',
      cascadeFailures: ['Casimir Vacuum Chamber'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 3, y: 4, z: 0 }
    },
    {
      name: 'Lamb Shift Amplifier Toroid',
      description: 'Superconducting toroidal resonator with 96 NbTi windings that amplifies vacuum polarization energy via Lamb shift resonance.',
      material: 'NbTi Superconductor / Copper Stabilizer',
      function: 'Resonantly amplifies the Lamb shift energy contribution from vacuum polarization loops, extracting energy from the QED vacuum.',
      assemblyOrder: 5,
      connections: ['Casimir Vacuum Chamber', 'Cryogenic Cooling System', 'Power Conditioning System'],
      failureEffect: 'Quench of superconducting coils; explosive helium boil-off and loss of resonant amplification.',
      cascadeFailures: ['Cryogenic Cooling System', 'Power Conditioning System'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -3, y: 0, z: 3 }
    },
    {
      name: 'Resonance Tuning Capacitor Bank',
      description: 'Eight high-Q capacitor modules that fine-tune the Lamb shift toroid resonant frequency to match vacuum polarization modes.',
      material: 'Sapphire Dielectric / Gold Electrodes',
      function: 'Precisely tunes the LC resonance of the amplifier toroid to vacuum polarization frequency, maximizing energy extraction.',
      assemblyOrder: 6,
      connections: ['Lamb Shift Amplifier Toroid'],
      failureEffect: 'Frequency detuning reduces extraction efficiency below breakeven threshold.',
      cascadeFailures: ['Lamb Shift Amplifier Toroid'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -4, y: 0, z: 4 }
    },
    {
      name: 'Schwinger Pair Production Zone',
      description: 'Extreme electromagnetic field region achieving E > E_cr = m²c³/(eℏ) ≈ 1.32 × 10¹⁸ V/m for spontaneous e⁺e⁻ pair creation.',
      material: 'Tungsten Carbide Poles / NbSn Solenoids',
      function: 'Concentrates EM fields beyond the Schwinger critical field strength, causing spontaneous electron-positron pair production from the vacuum.',
      assemblyOrder: 7,
      connections: ['Inner Radiation Shield', 'Confinement Ring Magnets'],
      failureEffect: 'Field collapse halts pair production; uncontrolled discharge can vaporize pole tips.',
      cascadeFailures: ['Inner Radiation Shield', 'Power Conditioning System'],
      originalPosition: { x: 0, y: 2, z: 0 },
      explodedPosition: { x: 0, y: 7, z: 0 }
    },
    {
      name: 'Confinement Ring Magnets',
      description: 'Six rare-earth permanent magnet assemblies providing secondary confinement for Schwinger-produced charged pairs.',
      material: 'NdFeB N52 Grade',
      function: 'Creates a hexapole magnetic trap to confine electron-positron pairs for controlled annihilation energy harvesting.',
      assemblyOrder: 8,
      connections: ['Schwinger Pair Production Zone'],
      failureEffect: 'Loss of confinement allows pair escape; reduced energy capture and increased radiation.',
      cascadeFailures: ['Inner Radiation Shield'],
      originalPosition: { x: 0, y: 2, z: 0 },
      explodedPosition: { x: 3, y: 7, z: 3 }
    },
    {
      name: 'Power Conditioning System',
      description: 'Multi-stage rectifier, voltage regulator, and capacitor smoothing bank converting extracted quantum vacuum energy to stable DC output.',
      material: 'SiC MOSFETs / Polypropylene Film Capacitors',
      function: 'Converts stochastic photon and pair-annihilation energy into regulated, grid-compatible electrical output.',
      assemblyOrder: 9,
      connections: ['Lamb Shift Amplifier Toroid', 'Output Busbars', 'Capacitor Smoothing Bank'],
      failureEffect: 'Output voltage instability; potential arc-over destroying downstream equipment.',
      cascadeFailures: ['Output Busbars'],
      originalPosition: { x: 0, y: -2.5, z: 0 },
      explodedPosition: { x: 0, y: -6, z: 0 }
    },
    {
      name: 'Main Energy Column',
      description: 'Central waveguide channeling extracted vacuum energy vertically through the reactor core, visible as a pulsing cyan plasma column.',
      material: 'Crystalline Sapphire Waveguide',
      function: 'Guides coherent photon flux from Casimir chamber through the reactor axis to the power conditioning stage.',
      assemblyOrder: 10,
      connections: ['Casimir Vacuum Chamber', 'Power Conditioning System'],
      failureEffect: 'Waveguide fracture scatters coherent beam; energy loss and potential internal damage.',
      cascadeFailures: ['Power Conditioning System'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 0, z: 0 }
    },
    {
      name: 'Cryogenic Cooling System',
      description: 'Liquid helium cryostat maintaining superconducting coils at 4.2 K with dual transfer lines and pressure relief.',
      material: 'Stainless Steel Dewar / LHe-4',
      function: 'Maintains superconducting state of Lamb shift toroid coils and Schwinger zone solenoids at cryogenic temperatures.',
      assemblyOrder: 11,
      connections: ['Lamb Shift Amplifier Toroid', 'Schwinger Pair Production Zone'],
      failureEffect: 'Superconductor quench cascade; violent helium boil-off, pressure surge, and total loss of magnetic confinement.',
      cascadeFailures: ['Lamb Shift Amplifier Toroid', 'Schwinger Pair Production Zone'],
      originalPosition: { x: -4, y: 0, z: 2 },
      explodedPosition: { x: -8, y: 0, z: 5 }
    },
    {
      name: 'Vacuum Birefringence Detector',
      description: 'High-precision laser polarimetry system detecting vacuum birefringence caused by extreme fields, confirming QED predictions.',
      material: 'Nd:YAG Laser / CCD Polarimeter',
      function: 'Detects rotation of laser polarization plane due to vacuum birefringence, providing real-time diagnostics of field strength in the Schwinger zone.',
      assemblyOrder: 12,
      connections: ['Schwinger Pair Production Zone'],
      failureEffect: 'Loss of field strength diagnostics; operators must rely on indirect measurements, increasing risk of undetected field excursion.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: -1, z: -2.5 },
      explodedPosition: { x: 0, y: -1, z: -7 }
    },
    {
      name: 'Operator Control Cabin',
      description: 'Shielded control room with three monitoring screens, joystick control, toggle array, and LED status indicators for reactor supervision.',
      material: 'Lead-glass Windows / Steel Frame',
      function: 'Provides operator interface for reactor startup, shutdown, field tuning, and emergency SCRAM activation.',
      assemblyOrder: 13,
      connections: ['All Systems (via Control Bus)'],
      failureEffect: 'Loss of operator oversight; reactor continues on automated control with reduced response capability.',
      cascadeFailures: [],
      originalPosition: { x: 4.5, y: 0, z: 0 },
      explodedPosition: { x: 10, y: 0, z: 0 }
    },
    {
      name: 'Emergency Shutdown Rods',
      description: 'Three boron carbide control rods that can be rapidly inserted to quench the EM fields and terminate vacuum energy extraction.',
      material: 'B4C / Stainless Steel Cladding',
      function: 'Rapid insertion disrupts the field geometry, collapsing Casimir and Schwinger conditions, performing emergency shutdown (SCRAM).',
      assemblyOrder: 14,
      connections: ['Casimir Vacuum Chamber', 'Schwinger Pair Production Zone'],
      failureEffect: 'Inability to perform emergency shutdown; reactor must rely on passive safety systems.',
      cascadeFailures: ['All core systems (if stuck withdrawn during emergency)'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 8, z: 0 }
    },
    {
      name: 'Holographic Status Projector',
      description: 'Volumetric holographic display projecting real-time quantum field topology, energy output metrics, and system status.',
      material: 'Photonic Crystal Array / GaN Laser Diodes',
      function: 'Projects a 3D holographic representation of the reactor\'s quantum field state for intuitive operator monitoring.',
      assemblyOrder: 15,
      connections: ['Operator Control Cabin', 'All Sensor Systems'],
      failureEffect: 'Loss of visual field status; operators must use 2D screen fallback displays.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 5.5, z: 0 },
      explodedPosition: { x: 0, y: 11, z: 0 }
    },
    {
      name: 'Thermal Exhaust Stack Array',
      description: 'Four LatheGeometry exhaust stacks venting waste thermal energy from pair annihilation and resistive losses.',
      material: 'Inconel 718 Superalloy',
      function: 'Dissipates waste heat from pair annihilation events and ohmic losses in non-superconducting components.',
      assemblyOrder: 16,
      connections: ['Inner Radiation Shield', 'Power Conditioning System'],
      failureEffect: 'Thermal runaway; reactor temperature exceeds material limits, risking structural failure.',
      cascadeFailures: ['Outer Containment Shell'],
      originalPosition: { x: 0, y: 3.2, z: 0 },
      explodedPosition: { x: 0, y: 10, z: 0 }
    }
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ══════════════════════════════════════════════════════════════════════════
  const description = `Zero Point Energy Reactor (Ultra God Tier)\n\n` +
    `An advanced quantum vacuum energy extraction system leveraging three complementary QED mechanisms:\n\n` +
    `1. DYNAMIC CASIMIR EFFECT CHAMBER: Four gold-coated mirrors oscillate at near-relativistic speeds (GHz ` +
    `frequencies approaching c), modulating the quantum vacuum boundary conditions. This converts virtual ` +
    `photon pairs—predicted by quantum field theory's vacuum fluctuations—into real, detectable photons ` +
    `that carry extractable energy.\n\n` +
    `2. LAMB SHIFT AMPLIFIER: A superconducting toroidal resonator with 96 NbTi coil windings resonantly ` +
    `amplifies the energy contribution from vacuum polarization loops (the same QED correction responsible ` +
    `for the Lamb shift in hydrogen). The toroid is tuned to the vacuum polarization frequency via ` +
    `precision capacitor banks.\n\n` +
    `3. SCHWINGER PAIR PRODUCTION ZONE: Concentrated electromagnetic fields exceeding the Schwinger ` +
    `critical field strength E_cr = m²c³/(eℏ) ≈ 1.32 × 10¹⁸ V/m cause spontaneous electron-positron ` +
    `pair creation from the vacuum itself. The pairs are magnetically confined and their annihilation ` +
    `energy is harvested.\n\n` +
    `Supporting systems include liquid helium cryogenics at 4.2 K, vacuum birefringence laser diagnostics, ` +
    `a holographic status projector, emergency B4C shutdown rods, and a multi-stage power conditioning system ` +
    `converting stochastic quantum energy into regulated DC output.`;

  // ══════════════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS (5 PhD-level QED/QFT questions)
  // ══════════════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'In the dynamic Casimir effect, a mirror accelerating in vacuum emits real photons. What is the fundamental mechanism behind this photon creation, and how does it relate to the Unruh effect and Hawking radiation?',
      options: [
        'The mirror physically strikes virtual photons and scatters them into real ones via Compton-like processes.',
        'The time-dependent boundary condition imposed by the accelerating mirror mixes positive and negative frequency modes of the quantum vacuum, causing a Bogoliubov transformation that converts vacuum fluctuations into real photon pairs—this is kinematically equivalent to the Unruh effect (accelerating observer) and conceptually related to Hawking radiation (event horizon boundary condition).',
        'The mirror generates photons by converting its kinetic energy directly into electromagnetic radiation via bremsstrahlung.',
        'Vacuum photons tunnel through the mirror surface when it moves fast enough, analogous to quantum barrier tunneling.'
      ],
      correctAnswer: 1,
      explanation: 'The dynamic Casimir effect arises because a time-varying boundary condition causes mode-mixing described by Bogoliubov transformations. The vacuum state defined with respect to the instantaneous mirror position differs from the vacuum of the static case. This is deeply connected to the Unruh effect (where an accelerating observer perceives the Minkowski vacuum as a thermal bath) and Hawking radiation (where the event horizon imposes a boundary condition that similarly mixes modes, producing thermal radiation). All three phenomena arise from the same mathematical structure of quantum field theory in non-trivial spacetime or boundary geometries.'
    },
    {
      question: 'The Schwinger critical electric field strength for spontaneous electron-positron pair production from the vacuum is E_cr = m_e²c³/(eℏ). Derive the physical meaning of this expression and explain why the pair production rate goes as exp(−πE_cr/E).',
      options: [
        'E_cr is the field at which the electrostatic potential energy over one Compton wavelength ƛ_C = ℏ/(m_e c) equals 2m_e c² (the pair rest mass energy). The exponential dependence arises because pair production is a quantum tunneling process through the mass gap 2m_e c² in the Dirac sea, and the WKB tunneling exponent gives the exp(−πE_cr/E) suppression.',
        'E_cr is simply the electric field that can accelerate an electron to the speed of light within one Bohr radius. The exponential comes from the Boltzmann distribution of vacuum energy.',
        'E_cr represents the dielectric breakdown strength of the quantum vacuum. The exponential factor is the probability of finding a virtual pair at sufficient separation.',
        'E_cr is the field strength where photon-photon scattering cross-section diverges, and the exponential is a perturbative QED correction factor.'
      ],
      correctAnswer: 0,
      explanation: 'The Schwinger critical field E_cr = m²c³/(eℏ) ≈ 1.32 × 10¹⁸ V/m represents the electric field that performs work equal to 2m_e c² over one reduced Compton wavelength ƛ_C = ℏ/(m_e c). Physically, it is the field strength at which the vacuum becomes unstable to pair creation. The process is non-perturbative: it corresponds to quantum tunneling through the 2m_e c² energy gap of the Dirac vacuum. The Schwinger formula for the pair production rate per unit volume involves exp(−πm²c³/(eℏE)) = exp(−πE_cr/E), which is the WKB tunneling exponent for a particle tunneling through a potential barrier of height 2m_e c² over a distance eE/(m_e c), yielding an essential singularity in the coupling constant (non-perturbative in α).'
    },
    {
      question: 'Vacuum birefringence—the prediction that strong electromagnetic fields cause the quantum vacuum to exhibit different refractive indices for different photon polarizations—has been indirectly observed near magnetars. What is the QED origin of this effect, and what is the leading-order contribution in the Euler-Heisenberg effective Lagrangian?',
      options: [
        'Vacuum birefringence arises from tree-level QED and is a simple consequence of Maxwell\'s equations in curved spacetime.',
        'It arises from the one-loop electron box diagram (light-by-light scattering via a virtual electron loop). In the Euler-Heisenberg effective Lagrangian ℒ_EH, the leading correction to the Maxwell Lagrangian involves terms proportional to (F_μν F^μν)² and (F_μν F̃^μν)², with coefficients of order α²/(m_e⁴c⁷). These quartic field terms break the linear superposition of electromagnetic waves, making the vacuum polarization-dependent—i.e., birefringent.',
        'Vacuum birefringence is a purely classical effect arising from nonlinear corrections to Maxwell\'s equations due to the finite speed of light.',
        'It is caused by gravitational lensing effects of the electromagnetic field energy density curving spacetime, splitting polarization modes.'
      ],
      correctAnswer: 1,
      explanation: 'Vacuum birefringence is a purely quantum effect arising from virtual electron-positron loops in the vacuum. In the Euler-Heisenberg effective Lagrangian (obtained by integrating out the electron field at one loop), the leading correction beyond the free Maxwell Lagrangian contains terms ∝ α²ℏ³/(45m_e⁴c⁵) × [(E²−c²B²)² + 7(cE·B)²]. These fourth-order terms in the field strengths cause the speed of light to depend on polarization relative to an external field—the definition of birefringence. The effect has been indirectly confirmed in X-ray polarization observations of the isolated neutron star RX J1856.5−3754 by the IXPE mission.'
    },
    {
      question: 'The Lamb shift in hydrogen (2S₁/₂ − 2P₁/₂ splitting ≈ 1057 MHz) was one of the first experimental confirmations of QED vacuum effects. Which vacuum fluctuation mechanisms contribute to the Lamb shift, and why does the 2S state shift upward while 2P is relatively unaffected?',
      options: [
        'The Lamb shift is entirely due to the anomalous magnetic moment of the electron interacting with the nuclear magnetic field.',
        'Three QED effects contribute: (1) electron self-energy (the electron\'s interaction with its own virtual photon cloud causes a "smearing" of its position over ~ƛ_C, effectively sampling a different average Coulomb potential), (2) vacuum polarization (virtual e⁺e⁻ loops screen the nuclear charge, slightly modifying the potential), and (3) the anomalous magnetic moment correction. The 2S state shifts more because S-wave electrons have nonzero probability at the nucleus (|ψ(0)|² ≠ 0), where the self-energy smearing has maximum effect, while P-wave electrons have a node at the origin.',
        'The Lamb shift comes from relativistic corrections to the kinetic energy of the electron, analogous to the fine structure.',
        'It is caused by the finite nuclear charge radius, which only the S-state electron can probe due to its wavefunction penetrating the nucleus.'
      ],
      correctAnswer: 1,
      explanation: 'The Lamb shift is a landmark QED result arising from: (1) Electron self-energy (~+1017 MHz): the dominant contribution comes from the electron interacting with virtual photons, effectively causing a Zitterbewegung-like position uncertainty of order ƛ_C. This "smears" the electron\'s charge over a region comparable to the Compton wavelength, causing it to sample a slightly different average Coulomb potential. This effect is proportional to |ψ(0)|², so it maximally affects S-states (ℓ=0). (2) Vacuum polarization (~−27 MHz): virtual e⁺e⁻ pairs near the nucleus partially screen the nuclear charge at short range and anti-screen at longer range, effectively modifying the Coulomb potential. This shifts the 2S level downward slightly. (3) Anomalous magnetic moment (~+68 MHz): a smaller spin-orbit correction. The net effect shifts 2S₁/₂ upward by ~1057 MHz relative to 2P₁/₂, breaking the degeneracy predicted by the Dirac equation.'
    },
    {
      question: 'A zero-point energy extraction device must contend with the thermodynamic implications of the quantum vacuum. Explain why naive attempts to extract energy from vacuum fluctuations violate the second law of thermodynamics, and under what conditions (if any) does the dynamic Casimir effect genuinely extract energy from the vacuum without violating conservation laws.',
      options: [
        'The vacuum state is the lowest energy eigenstate of the quantum field Hamiltonian; it is impossible to extract energy from it under any circumstances, and the dynamic Casimir effect is purely theoretical.',
        'Vacuum energy is infinite and freely available; the only engineering challenge is building a converter efficient enough to tap it.',
        'The vacuum is the ground state of the free-field Hamiltonian—you cannot extract energy from a system already in its ground state without doing work on it. However, the dynamic Casimir effect genuinely produces real photons because the accelerating mirror does mechanical work against the radiation reaction force from the vacuum. The energy of the emitted photons comes from the kinetic energy of the mirror (supplied externally), not from "mining" the vacuum ground state energy. The vacuum serves as the quantum channel for the energy conversion, not as the energy source. Any net energy extraction scheme must supply external work ≥ the extracted photon energy, consistent with conservation of energy and the second law.',
        'The quantum vacuum has negative energy density in some reference frames, so extraction is possible by selecting the right Lorentz frame, and the dynamic Casimir effect proves this is feasible in practice.'
      ],
      correctAnswer: 2,
      explanation: 'This is a crucial conceptual point. The quantum vacuum |0⟩ is, by definition, the state of lowest energy of the quantum field Hamiltonian. You cannot extract energy from a ground state without doing work—this would violate the second law. In the dynamic Casimir effect, the mirror must be physically accelerated by an external energy source. The mirror does work against the vacuum radiation pressure (which is altered by the acceleration). The emitted photons carry energy that comes from the mechanical work done on the mirror, not from the vacuum zero-point energy itself. The vacuum\'s role is as a quantum medium that enables the energy conversion (boundary condition → photons), analogous to how a laser medium enables stimulated emission but is not an energy source without pumping. This subtlety is often misunderstood in popular accounts of zero-point energy.'
    }
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // ANIMATION FUNCTION
  // ══════════════════════════════════════════════════════════════════════════
  function animate(time, speed, m) {
    const t = time * speed;
    const ms = m || meshes;

    // ── Casimir Mirror oscillation (near-c relativistic motion simulation) ──
    if (ms.mirrorMeshes) {
      ms.mirrorMeshes.forEach((mirror, idx) => {
        const freq = 8.0 + idx * 2.0; // High frequency oscillation
        const amplitude = 0.35;
        const offset = Math.sin(t * freq + idx * Math.PI / 2) * amplitude;
        if (idx < 2) {
          mirror.position.x = (idx === 0 ? -0.6 : 0.6) + offset * 0.3;
        } else {
          mirror.position.z = (idx === 2 ? -0.6 : 0.6) + offset * 0.3;
        }
        // Relativistic Doppler glow effect on mirrors
        if (mirror.material && mirror.material.emissiveIntensity !== undefined) {
          mirror.material.emissiveIntensity = 0.15 + Math.abs(Math.sin(t * freq)) * 0.8;
        }
      });
    }

    // ── Virtual photon birth/movement (vacuum fluctuations becoming real) ──
    if (ms.virtualPhotons) {
      ms.virtualPhotons.forEach(p => {
        const ud = p.userData;
        p.position.x = ud.basePos.x + Math.sin(t * ud.speed + ud.phase) * ud.amplitude;
        p.position.y = ud.basePos.y + Math.cos(t * ud.speed * 0.7 + ud.phase) * ud.amplitude * 0.5;
        p.position.z = ud.basePos.z + Math.sin(t * ud.speed * 1.3 + ud.phase + 1) * ud.amplitude;
        // Photons pulse in opacity (materializing / dematerializing)
        if (p.material) {
          p.material.opacity = 0.15 + Math.abs(Math.sin(t * ud.speed * 2 + ud.phase)) * 0.5;
          p.material.emissiveIntensity = 0.8 + Math.sin(t * ud.speed * 3) * 1.2;
        }
        // Scale pulsation
        const s = 0.7 + Math.sin(t * ud.speed * 4 + ud.phase) * 0.4;
        p.scale.set(s, s, s);
      });
    }

    // ── Vacuum polarization glow ring pulsation ──
    if (ms.vpGlow && ms.vpGlow.material) {
      ms.vpGlow.material.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.8;
      ms.vpGlow.material.opacity = 0.3 + Math.sin(t * 2.5) * 0.15;
      ms.vpGlow.rotation.z = t * 0.2;
    }

    // ── Schwinger plasma breathing and rotation ──
    if (ms.schwingerPlasma) {
      const sScale = 1.0 + Math.sin(t * 5) * 0.3 + Math.sin(t * 13) * 0.1;
      ms.schwingerPlasma.scale.set(sScale, sScale, sScale);
      ms.schwingerPlasma.rotation.y = t * 2;
      ms.schwingerPlasma.rotation.x = Math.sin(t * 1.5) * 0.3;
      if (ms.schwingerPlasma.material) {
        ms.schwingerPlasma.material.emissiveIntensity = 1.5 + Math.sin(t * 7) * 1.5;
      }
    }

    // ── Pair production trails spinning ──
    if (ms.pairTrails) {
      ms.pairTrails.forEach(trail => {
        const rs = trail.userData.rotSpeed;
        trail.rotation.x += rs.x * 0.02 * speed;
        trail.rotation.y += rs.y * 0.02 * speed;
        trail.rotation.z += rs.z * 0.02 * speed;
      });
    }

    // ── Capacitor LEDs blinking ──
    if (ms.capacitorMeshes) {
      ms.capacitorMeshes.forEach((led, i) => {
        if (led.material) {
          led.material.emissiveIntensity = 0.5 + Math.sin(t * 4 + i * 0.8) * 1.5;
        }
      });
    }

    // ── Superconducting coil current visualization ──
    if (ms.coilMeshes) {
      ms.coilMeshes.forEach((coil, i) => {
        const currentPhase = t * 6 + (i / 96) * Math.PI * 2;
        const brightness = 0.5 + Math.sin(currentPhase) * 0.5;
        if (coil.material && coil.material.emissive) {
          coil.material.emissive.setHSL(0.08, 1.0, brightness * 0.3);
        }
      });
    }

    // ── Control screens flickering ──
    if (ms.screenMeshes) {
      ms.screenMeshes.forEach((scr, i) => {
        if (scr.material) {
          scr.material.emissiveIntensity = 0.4 + Math.sin(t * 8 + i * 2.1) * 0.4;
        }
      });
    }

    // ── Indicator LEDs blinking patterns ──
    if (ms.ledMeshes) {
      ms.ledMeshes.forEach((led, i) => {
        if (led.material) {
          const blinkSpeed = 2 + (i % 4) * 1.5;
          led.material.emissiveIntensity = 0.3 + Math.max(0, Math.sin(t * blinkSpeed + i * 0.7)) * 2.0;
        }
      });
    }

    // ── Energy column pulsation ──
    if (ms.energyColumn && ms.energyColumn.material) {
      ms.energyColumn.material.opacity = 0.3 + Math.sin(t * 4) * 0.2;
      ms.energyColumn.material.emissiveIntensity = 1.5 + Math.sin(t * 6) * 1.0;
      const colScale = 1.0 + Math.sin(t * 3) * 0.08;
      ms.energyColumn.scale.set(colScale, 1, colScale);
    }

    // ── Helix rotation (energy vortex spinning) ──
    if (ms.helix) {
      ms.helix.rotation.y = t * 0.5;
    }
    if (ms.helix2) {
      ms.helix2.rotation.y = -t * 0.5;
    }

    // ── Hologram sphere rotation and pulsation ──
    if (ms.holoSphere) {
      ms.holoSphere.rotation.y = t * 0.8;
      ms.holoSphere.rotation.x = Math.sin(t * 0.3) * 0.2;
      const hs = 1.0 + Math.sin(t * 2) * 0.15;
      ms.holoSphere.scale.set(hs, hs, hs);
      if (ms.holoSphere.material) {
        ms.holoSphere.material.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.5;
      }
    }
    if (ms.holoWire) {
      ms.holoWire.rotation.y = -t * 0.6;
      ms.holoWire.rotation.z = t * 0.3;
    }

    // ── Data particles streaming upward into hologram ──
    if (ms.dataParticles) {
      ms.dataParticles.forEach(dp => {
        dp.position.y += dp.userData.speed * 0.01 * speed;
        dp.position.x = Math.sin(t * dp.userData.speed + dp.userData.phase) * 0.3;
        dp.position.z = Math.cos(t * dp.userData.speed + dp.userData.phase) * 0.3;
        if (dp.position.y > 0.8) {
          dp.position.y = -1.0;
        }
        dp.rotation.y = t * 3;
        dp.rotation.x = t * 2;
      });
    }

    // ── Birefringence laser beam intensity modulation ──
    if (ms.laserBeam && ms.laserBeam.material) {
      ms.laserBeam.material.opacity = 0.4 + Math.sin(t * 12) * 0.3;
      ms.laserBeam.material.emissiveIntensity = 3.0 + Math.sin(t * 20) * 2.0;
      // Subtle beam thickness pulsation
      const bScale = 1.0 + Math.sin(t * 8) * 0.3;
      ms.laserBeam.scale.set(bScale, 1, bScale);
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
