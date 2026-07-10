// ═══════════════════════════════════════════════════════════════════
// Fighter Jet (Twin-Engine Multirole)
// ═══════════════════════════════════════════════════════════════════
import { aluminum, darkSteel, steel, titanium, carbonFiber, chrome, glass, rubber, fire, plastic, tinted } from '../utils/materials.js';

export function createFighterJet(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // ── 1. Fuselage ────────────────────────────────────────────────
  const fuselageG = new THREE.Group();
  // Main fuselage body — area-ruled, wider at center then tapers
  const fuseForward = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.55, 2.4, 24),
    tinted(darkSteel, 0x6a6e78)
  );
  fuseForward.rotation.x = Math.PI / 2;
  fuseForward.position.z = 1.8;
  fuselageG.add(fuseForward);

  const fuseMid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.58, 2.0, 24),
    tinted(darkSteel, 0x6a6e78)
  );
  fuseMid.rotation.x = Math.PI / 2;
  fuseMid.position.z = -0.4;
  fuselageG.add(fuseMid);

  const fuseRear = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.42, 2.6, 24),
    tinted(darkSteel, 0x6a6e78)
  );
  fuseRear.rotation.x = Math.PI / 2;
  fuseRear.position.z = -2.7;
  fuselageG.add(fuseRear);

  // Spine dorsal fairing
  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.14, 4.5),
    tinted(darkSteel, 0x5a5e68)
  );
  spine.position.set(0, 0.52, -0.8);
  fuselageG.add(spine);

  // Bottom keel line
  const keel = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.08, 3.0),
    tinted(darkSteel, 0x555a64)
  );
  keel.position.set(0, -0.52, -0.5);
  fuselageG.add(keel);

  // Panel line accents (raised strips along the fuselage)
  for (let i = 0; i < 6; i++) {
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.01, 0.01),
      tinted(steel, 0x4a4e58)
    );
    panel.position.set(0, 0.15, 2.5 - i * 1.0);
    panel.rotation.z = Math.PI / 2;
    fuselageG.add(panel);
  }

  group.add(fuselageG);
  parts.push({
    name: 'Fuselage',
    description: 'Streamlined semi-monocoque body with area-ruled cross-section (Whitcomb area rule) to minimize transonic wave drag. Houses fuel tanks, avionics bays, and structural load paths.',
    material: 'Aluminum-Lithium Alloy / Titanium',
    function: 'Primary structural airframe, contains internal systems',
    assemblyOrder: 1,
    connections: ['Delta Wings', 'Canopy', 'Twin Engines', 'Vertical Stabilizers', 'Horizontal Stabilizers', 'Air Intakes', 'Landing Gear', 'Radar Nose'],
    failureEffect: 'Catastrophic — complete loss of structural integrity',
    cascadeFailures: ['Delta Wings', 'Twin Engines', 'Landing Gear'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: 0 }
  });

  // ── 2. Delta Wings ─────────────────────────────────────────────
  const wingsG = new THREE.Group();

  // Helper to build one wing
  function buildWing(side) {
    const sign = side === 'left' ? -1 : 1;
    const wingGroup = new THREE.Group();

    // Main wing surface — swept delta shape using a custom extruded shape
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(sign * 3.2, -0.6);   // tip trailing edge
    wingShape.lineTo(sign * 2.8, 0.3);    // tip leading edge
    wingShape.lineTo(sign * 0.3, 0.7);    // root leading edge
    wingShape.lineTo(0, 0);

    const wingExtrudeSettings = { depth: 0.06, bevelEnabled: false };
    const wingMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings),
      tinted(darkSteel, 0x6e7280)
    );
    wingMesh.rotation.x = -Math.PI / 2;
    wingMesh.position.set(0, -0.05, -0.2);
    wingGroup.add(wingMesh);

    // Leading edge flap — separate piece
    const flapLen = 1.8;
    const flap = new THREE.Mesh(
      new THREE.BoxGeometry(flapLen, 0.035, 0.18),
      tinted(titanium, 0x8890a0)
    );
    flap.position.set(sign * 1.8, 0.0, 0.35);
    flap.rotation.y = sign * 0.35;
    wingGroup.add(flap);

    // Aileron (trailing edge control surface)
    const aileron = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.03, 0.2),
      tinted(aluminum, 0xb0b8c0)
    );
    aileron.position.set(sign * 2.0, 0.0, -0.45);
    aileron.rotation.y = sign * 0.25;
    wingGroup.add(aileron);

    // Wing tip navigation light
    const navLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      tinted(fire, side === 'left' ? 0xff0000 : 0x00ff00)
    );
    navLight.position.set(sign * 3.1, 0.0, -0.15);
    wingGroup.add(navLight);

    return wingGroup;
  }

  const leftWing = buildWing('left');
  leftWing.position.z = -0.3;
  wingsG.add(leftWing);

  const rightWing = buildWing('right');
  rightWing.position.z = -0.3;
  wingsG.add(rightWing);

  group.add(wingsG);
  parts.push({
    name: 'Delta Wings',
    description: 'Swept delta wings with 42° leading edge sweep. Feature leading edge root extensions (LERX) for high-AoA vortex lift. Incorporate ailerons and leading edge flaps for roll control and maneuvering.',
    material: 'Carbon Fiber Composite / Aluminum Spar',
    function: 'Generate lift, roll control, weapon mounting',
    assemblyOrder: 2,
    connections: ['Fuselage', 'Weapons Pylons', 'Landing Gear'],
    failureEffect: 'Loss of lift and roll authority, uncontrollable flight',
    cascadeFailures: ['Weapons Pylons'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 2.5, z: 0 }
  });

  // ── 3. Canopy (Cockpit) ────────────────────────────────────────
  const canopyG = new THREE.Group();

  // Canopy glass bubble — elongated dome
  const canopyGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55),
    glass.clone()
  );
  canopyGlass.material.opacity = 0.3;
  canopyGlass.material.color.set(0x88aacc);
  canopyGlass.scale.set(0.85, 0.9, 2.0);
  canopyGlass.position.set(0, 0.38, 1.6);
  canopyG.add(canopyGlass);

  // Canopy frame rails
  const frameRail = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.04, 1.4),
    tinted(darkSteel, 0x3a3e48)
  );
  frameRail.position.set(0, 0.55, 1.6);
  canopyG.add(frameRail);

  // Side frame rails
  for (let s = -1; s <= 1; s += 2) {
    const sideRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.03, 1.2),
      tinted(darkSteel, 0x3a3e48)
    );
    sideRail.position.set(s * 0.26, 0.42, 1.6);
    canopyG.add(sideRail);
  }

  // HUD (Heads-Up Display) frame
  const hudFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.02),
    tinted(darkSteel, 0x2a2e38)
  );
  hudFrame.position.set(0, 0.42, 2.25);
  canopyG.add(hudFrame);

  // HUD glass combiner
  const hudGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.10, 0.005),
    tinted(glass, 0xaaddff)
  );
  hudGlass.material.transparent = true;
  hudGlass.material.opacity = 0.25;
  hudGlass.position.set(0, 0.45, 2.22);
  hudGlass.rotation.x = -0.3;
  canopyG.add(hudGlass);

  // Ejection seat headrest (visible through canopy)
  const headrest = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.16, 0.08),
    tinted(plastic, 0x1a1a1a)
  );
  headrest.position.set(0, 0.32, 1.9);
  canopyG.add(headrest);

  // Windshield bow
  const windBow = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.015, 8, 16, Math.PI),
    tinted(darkSteel, 0x3a3e48)
  );
  windBow.position.set(0, 0.38, 2.32);
  windBow.rotation.y = Math.PI / 2;
  canopyG.add(windBow);

  group.add(canopyG);
  parts.push({
    name: 'Canopy',
    description: 'One-piece polycarbonate bubble canopy with gold-tinted radar-absorbing coating. Contains HUD combiner glass, ejection seat, and HOTAS controls. Provides 360° visibility.',
    material: 'Polycarbonate / Gold-coated Glass',
    function: 'Pilot enclosure, visibility, HUD projection',
    assemblyOrder: 8,
    connections: ['Fuselage'],
    failureEffect: 'Cockpit depressurization, pilot exposure at altitude',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 3, z: 2 }
  });

  // ── 4. Twin Engines ────────────────────────────────────────────
  const enginesG = new THREE.Group();

  for (let s = -1; s <= 1; s += 2) {
    const engineUnit = new THREE.Group();

    // Engine nacelle body
    const nacelle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.30, 2.2, 20),
      tinted(darkSteel, 0x50545e)
    );
    nacelle.rotation.x = Math.PI / 2;
    nacelle.position.set(s * 0.45, -0.1, -2.8);
    engineUnit.add(nacelle);

    // Afterburner nozzle — converging-diverging petals
    const nozzleOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.26, 0.5, 16),
      tinted(titanium, 0x707880)
    );
    nozzleOuter.rotation.x = Math.PI / 2;
    nozzleOuter.position.set(s * 0.45, -0.1, -4.05);
    engineUnit.add(nozzleOuter);

    // Nozzle petals (individual segments)
    for (let p = 0; p < 12; p++) {
      const angle = (p / 12) * Math.PI * 2;
      const petal = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.02, 0.35),
        tinted(titanium, 0x808890)
      );
      petal.position.set(
        s * 0.45 + Math.cos(angle) * 0.24,
        -0.1 + Math.sin(angle) * 0.24,
        -4.15
      );
      petal.rotation.z = angle;
      engineUnit.add(petal);
    }

    // Exhaust glow core
    const exhaustGlow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.12, 0.6, 12),
      fire.clone()
    );
    exhaustGlow.rotation.x = Math.PI / 2;
    exhaustGlow.position.set(s * 0.45, -0.1, -4.35);
    engineUnit.add(exhaustGlow);

    // Turbine fan face (visible at front of engine)
    const fanFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.25, 20),
      tinted(steel, 0x7a8090)
    );
    fanFace.position.set(s * 0.45, -0.1, -1.7);
    engineUnit.add(fanFace);

    // Fan blades
    for (let b = 0; b < 10; b++) {
      const bAngle = (b / 10) * Math.PI * 2;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.012, 0.03),
        tinted(titanium, 0x99a0aa)
      );
      blade.position.set(
        s * 0.45 + Math.cos(bAngle) * 0.10,
        -0.1 + Math.sin(bAngle) * 0.10,
        -1.69
      );
      blade.rotation.z = bAngle;
      engineUnit.add(blade);
    }

    enginesG.add(engineUnit);
  }

  group.add(enginesG);
  parts.push({
    name: 'Twin Engines',
    description: 'Two low-bypass afterburning turbofan engines producing ~20,000 lbf thrust each. Variable-geometry exhaust nozzles with turkey-feather petals for thrust modulation. Afterburner (reheat) injects fuel into exhaust for 50% thrust boost.',
    material: 'Nickel Superalloy / Titanium Compressor',
    function: 'Generate thrust, afterburner capability',
    assemblyOrder: 3,
    connections: ['Fuselage', 'Air Intakes'],
    failureEffect: 'Loss of thrust on one engine — asymmetric thrust, reduced performance. Both engines — forced ejection.',
    cascadeFailures: ['Air Intakes'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -2.5, z: -3 }
  });

  // ── 5. Vertical Stabilizers (Twin Tails) ───────────────────────
  const vStabG = new THREE.Group();

  for (let s = -1; s <= 1; s += 2) {
    const tail = new THREE.Group();

    // Main vertical fin — trapezoidal shape
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(-0.15, 1.3);
    finShape.lineTo(0.3, 1.4);
    finShape.lineTo(0.8, 0);
    finShape.lineTo(0, 0);

    const finMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(finShape, { depth: 0.04, bevelEnabled: false }),
      tinted(darkSteel, 0x5c6070)
    );
    finMesh.position.set(s * 0.55, 0.35, -3.3);
    finMesh.rotation.y = s * 0.15;
    tail.add(finMesh);

    // Rudder (trailing edge control surface)
    const rudder = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 1.0, 0.18),
      tinted(aluminum, 0xb0b8c0)
    );
    rudder.position.set(s * 0.58, 1.05, -3.05);
    rudder.rotation.y = s * 0.15;
    tail.add(rudder);

    // Anti-collision light on tip
    const tipLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 6, 6),
      tinted(fire, 0xff3300)
    );
    tipLight.position.set(s * 0.48, 1.75, -3.35);
    tail.add(tipLight);

    vStabG.add(tail);
  }

  group.add(vStabG);
  parts.push({
    name: 'Vertical Stabilizers',
    description: 'Canted twin vertical tails angled outward ~20° for reduced radar cross-section and enhanced yaw stability at high AoA. Each features an independently actuated rudder.',
    material: 'Carbon Fiber / Aluminum Honeycomb',
    function: 'Yaw stability and directional control',
    assemblyOrder: 5,
    connections: ['Fuselage'],
    failureEffect: 'Loss of yaw authority, Dutch roll instability',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 3, z: -3 }
  });

  // ── 6. Horizontal Stabilizers (Stabilators) ────────────────────
  const hStabG = new THREE.Group();

  for (let s = -1; s <= 1; s += 2) {
    const stabGroup = new THREE.Group();

    // All-moving tailplane shape
    const stabShape = new THREE.Shape();
    stabShape.moveTo(0, 0);
    stabShape.lineTo(s * 1.4, -0.2);
    stabShape.lineTo(s * 1.2, 0.15);
    stabShape.lineTo(s * 0.15, 0.35);
    stabShape.lineTo(0, 0);

    const stabMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(stabShape, { depth: 0.035, bevelEnabled: false }),
      tinted(darkSteel, 0x64687a)
    );
    stabMesh.rotation.x = -Math.PI / 2;
    stabMesh.position.set(0, -0.05, -3.7);
    stabGroup.add(stabMesh);

    // Pivot mounting point
    const pivot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.12, 8),
      tinted(steel, 0x888e98)
    );
    pivot.position.set(s * 0.2, -0.05, -3.6);
    pivot.rotation.z = Math.PI / 2;
    stabGroup.add(pivot);

    hStabG.add(stabGroup);
  }

  group.add(hStabG);
  parts.push({
    name: 'Horizontal Stabilizers',
    description: 'All-moving stabilators (no separate elevator) providing pitch authority. Differential deflection enables roll assist at high AoA where ailerons lose effectiveness. Actuated by triple-redundant hydraulic servos.',
    material: 'Titanium / Composite Skin',
    function: 'Pitch control, high-AoA roll assist',
    assemblyOrder: 6,
    connections: ['Fuselage'],
    failureEffect: 'Loss of pitch authority — potential departure from controlled flight',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -2, z: -4 }
  });

  // ── 7. Air Intakes ─────────────────────────────────────────────
  const intakesG = new THREE.Group();

  for (let s = -1; s <= 1; s += 2) {
    const intake = new THREE.Group();

    // Intake duct outer housing — wedge shape
    const ductOuter = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.38, 1.6),
      tinted(darkSteel, 0x6a6e78)
    );
    ductOuter.position.set(s * 0.6, -0.15, 0.4);
    intake.add(ductOuter);

    // Intake mouth opening — darker inner
    const ductInner = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.30, 0.12),
      tinted(plastic, 0x1a1e28)
    );
    ductInner.position.set(s * 0.6, -0.15, 1.25);
    intake.add(ductInner);

    // Variable ramp / splitter plate
    const ramp = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.03, 0.8),
      tinted(aluminum, 0xb0b6c0)
    );
    ramp.position.set(s * 0.6, 0.04, 0.7);
    intake.add(ramp);

    // Boundary layer diverter (gap between fuselage and intake)
    const diverter = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.30, 1.2),
      tinted(steel, 0x7a7e88)
    );
    diverter.position.set(s * 0.42, -0.15, 0.5);
    intake.add(diverter);

    // Intake lip highlight
    const lip = new THREE.Mesh(
      new THREE.BoxGeometry(0.30, 0.36, 0.025),
      tinted(aluminum, 0xc0c6d0)
    );
    lip.position.set(s * 0.6, -0.15, 1.20);
    intake.add(lip);

    intakesG.add(intake);
  }

  group.add(intakesG);
  parts.push({
    name: 'Air Intakes',
    description: 'Fixed-geometry DSI (Diverterless Supersonic Inlet) or variable-ramp intakes. Decelerate supersonic airflow to subsonic speeds before reaching engine compressor face. Boundary layer splitter prevents turbulent air ingestion.',
    material: 'Titanium / Radar-Absorbent Composite',
    function: 'Deliver conditioned airflow to engines',
    assemblyOrder: 4,
    connections: ['Fuselage', 'Twin Engines'],
    failureEffect: 'Engine surge, compressor stall, thrust loss',
    cascadeFailures: ['Twin Engines'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -1.5, z: 2 }
  });

  // ── 8. Landing Gear ────────────────────────────────────────────
  const gearG = new THREE.Group();

  // Nose gear
  const noseGear = new THREE.Group();
  const noseStrut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8),
    chrome.clone()
  );
  noseStrut.position.set(0, -0.75, 2.2);
  noseGear.add(noseStrut);

  const noseWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.035, 8, 16),
    rubber.clone()
  );
  noseWheel.position.set(0, -1.08, 2.2);
  noseWheel.rotation.y = Math.PI / 2;
  noseGear.add(noseWheel);

  // Nose gear door
  const noseDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.02, 0.35),
    tinted(darkSteel, 0x6a6e78)
  );
  noseDoor.position.set(0, -0.48, 2.2);
  noseGear.add(noseDoor);

  // Taxi/landing light
  const taxiLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 6, 6),
    tinted(fire, 0xffffcc)
  );
  taxiLight.position.set(0, -0.62, 2.32);
  noseGear.add(taxiLight);

  gearG.add(noseGear);

  // Main gear (left and right)
  for (let s = -1; s <= 1; s += 2) {
    const mainGear = new THREE.Group();

    const mainStrut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.65, 8),
      chrome.clone()
    );
    mainStrut.position.set(s * 0.65, -0.78, -0.5);
    mainGear.add(mainStrut);

    // Oleo strut (shock absorber)
    const oleo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.03, 0.2, 8),
      tinted(steel, 0x8890a0)
    );
    oleo.position.set(s * 0.65, -0.58, -0.5);
    mainGear.add(oleo);

    const mainWheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.045, 8, 16),
      rubber.clone()
    );
    mainWheel.position.set(s * 0.65, -1.12, -0.5);
    mainWheel.rotation.y = Math.PI / 2;
    mainGear.add(mainWheel);

    // Brake caliper
    const caliper = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.06, 0.06),
      tinted(titanium, 0x808890)
    );
    caliper.position.set(s * 0.65 + s * 0.05, -1.08, -0.5);
    mainGear.add(caliper);

    // Gear door
    const gearDoor = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.02, 0.5),
      tinted(darkSteel, 0x6a6e78)
    );
    gearDoor.position.set(s * 0.55, -0.48, -0.5);
    mainGear.add(gearDoor);

    gearG.add(mainGear);
  }

  group.add(gearG);
  parts.push({
    name: 'Landing Gear',
    description: 'Tricycle retractable landing gear with oleo-pneumatic shock struts. Main gear retracts forward into wing roots; nose gear retracts aft. Carbon-carbon brakes rated for high-energy stops.',
    material: 'High-Strength Steel / Carbon-Carbon Brakes',
    function: 'Ground operations, takeoff, landing',
    assemblyOrder: 9,
    connections: ['Fuselage', 'Delta Wings'],
    failureEffect: 'Gear-up landing — airframe damage, runway closure',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -3.5, z: 0 }
  });

  // ── 9. Weapons Pylons ──────────────────────────────────────────
  const pylonsG = new THREE.Group();

  for (let s = -1; s <= 1; s += 2) {
    // Inboard pylon (heavier stores)
    const inPylon = new THREE.Group();
    const inMount = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.18, 0.35),
      tinted(darkSteel, 0x6a6e78)
    );
    inMount.position.set(s * 1.1, -0.22, -0.2);
    inPylon.add(inMount);

    // Sway brace lugs
    const lug1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.02, 0.04),
      tinted(steel, 0x888e98)
    );
    lug1.position.set(s * 1.1, -0.32, -0.12);
    inPylon.add(lug1);
    const lug2 = lug1.clone();
    lug2.position.set(s * 1.1, -0.32, -0.28);
    inPylon.add(lug2);

    // Missile rail (representative AAM)
    const missile = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.025, 1.0, 10),
      tinted(whitePlastic || aluminum, 0xe0e0e0)
    );
    missile.rotation.x = Math.PI / 2;
    missile.position.set(s * 1.1, -0.38, -0.2);
    inPylon.add(missile);

    // Missile fins
    for (let f = 0; f < 4; f++) {
      const finA = (f / 4) * Math.PI * 2;
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.005, 0.06),
        tinted(aluminum, 0xd0d4da)
      );
      fin.position.set(
        s * 1.1 + Math.cos(finA) * 0.04,
        -0.38 + Math.sin(finA) * 0.04,
        -0.68
      );
      fin.rotation.z = finA;
      inPylon.add(fin);
    }

    pylonsG.add(inPylon);

    // Outboard pylon (lighter stores / AAMs)
    const outPylon = new THREE.Group();
    const outMount = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.14, 0.25),
      tinted(darkSteel, 0x6a6e78)
    );
    outMount.position.set(s * 2.0, -0.18, -0.3);
    outPylon.add(outMount);

    // Wingtip rail launcher
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8),
      tinted(steel, 0x888e98)
    );
    rail.rotation.x = Math.PI / 2;
    rail.position.set(s * 2.0, -0.26, -0.3);
    outPylon.add(rail);

    pylonsG.add(outPylon);
  }

  // Centerline pylon
  const centerPylon = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.16, 0.45),
    tinted(darkSteel, 0x6a6e78)
  );
  centerPylon.position.set(0, -0.45, -0.1);
  pylonsG.add(centerPylon);

  group.add(pylonsG);
  parts.push({
    name: 'Weapons Pylons',
    description: 'Wing-mounted and centerline hardpoints for external stores. Inboard pylons rated for 2,000+ lb stores (bombs, fuel tanks), outboard stations for AAMs. MIL-STD-1760 interface for smart weapons.',
    material: 'Forged Steel / Aluminum',
    function: 'Mount and release external weapons and stores',
    assemblyOrder: 10,
    connections: ['Delta Wings', 'Fuselage'],
    failureEffect: 'Inability to release stores, asymmetric drag',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -3, z: 1 }
  });

  // ── 10. Radar Nose ─────────────────────────────────────────────
  const radarG = new THREE.Group();

  // Radome — ogive nose cone shape
  const radomeProfile = [
    new THREE.Vector2(0, 0.55),
    new THREE.Vector2(0.08, 0.5),
    new THREE.Vector2(0.18, 0.4),
    new THREE.Vector2(0.26, 0.25),
    new THREE.Vector2(0.30, 0.1),
    new THREE.Vector2(0.32, 0)
  ];
  const radomeMesh = new THREE.Mesh(
    new THREE.LatheGeometry(radomeProfile, 24),
    tinted(carbonFiber, 0x4a4e58)
  );
  radomeMesh.rotation.x = -Math.PI / 2;
  radomeMesh.position.set(0, 0, 3.0);
  radarG.add(radomeMesh);

  // Radome tip (pitot tube)
  const pitot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.005, 0.3, 6),
    chrome.clone()
  );
  pitot.rotation.x = Math.PI / 2;
  pitot.position.set(0, 0, 3.7);
  radarG.add(pitot);

  // Radar dish (AESA array) behind radome
  const radarDish = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.04, 20),
    tinted(aluminum, 0x99a0aa)
  );
  radarDish.rotation.x = Math.PI / 2;
  radarDish.position.set(0, 0, 2.95);
  radarG.add(radarDish);

  // AESA T/R module grid pattern
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const dist = Math.sqrt(row * row + col * col);
      if (dist > 3.2) continue;
      const trModule = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.03, 0.008),
        tinted(steel, 0x667088)
      );
      trModule.position.set(col * 0.06, row * 0.06, 2.97);
      radarG.add(trModule);
    }
  }

  // Radome-fuselage junction ring
  const junctionRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.015, 8, 20),
    tinted(steel, 0x7a7e88)
  );
  junctionRing.rotation.x = Math.PI / 2;
  junctionRing.position.set(0, 0, 3.0);
  radarG.add(junctionRing);

  group.add(radarG);
  parts.push({
    name: 'Radar Nose',
    description: 'Ogive radome housing AN/APG-class AESA (Active Electronically Scanned Array) radar with 1,000+ T/R modules. Provides target detection at 100+ nm, track-while-scan, and SAR mapping. Radome material is RF-transparent composite.',
    material: 'RF-Transparent Composite / Quartz',
    function: 'Target detection, tracking, and engagement',
    assemblyOrder: 7,
    connections: ['Fuselage'],
    failureEffect: 'Loss of beyond-visual-range capability, no radar warning',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 1, z: 5 }
  });

  // ── Quiz Questions ─────────────────────────────────────────────
  const quizQuestions = [
    {
      question: 'What is Mach number?',
      options: [
        'Aircraft altitude in thousands of feet',
        'The ratio of aircraft speed to the local speed of sound',
        'Engine RPM divided by maximum RPM',
        'Wing area divided by weight'
      ],
      correct: 1,
      explanation: 'Mach number is the ratio of the aircraft\'s true airspeed to the local speed of sound. Mach 1 = speed of sound (~767 mph at sea level). Fighter jets routinely exceed Mach 1.5+.',
      difficulty: 'basic'
    },
    {
      question: 'What does thrust-to-weight ratio (T/W) greater than 1.0 allow a fighter jet to do?',
      options: [
        'Land on water',
        'Accelerate vertically upward in a sustained climb',
        'Become invisible to radar',
        'Reduce fuel consumption'
      ],
      correct: 1,
      explanation: 'When T/W exceeds 1.0, thrust exceeds the aircraft\'s weight, enabling sustained vertical climbs, rapid acceleration, and superior energy maneuverability. Modern fighters achieve T/W ratios of 1.1-1.3.',
      difficulty: 'advanced'
    },
    {
      question: 'What is angle of attack (AoA)?',
      options: [
        'The angle between the wing chord line and the relative wind',
        'The bank angle during a turn',
        'The angle of the runway relative to north',
        'The deflection angle of the rudder'
      ],
      correct: 0,
      explanation: 'AoA is the angle between the wing\'s chord line and the oncoming airflow (relative wind). Increasing AoA increases lift up to the critical angle, beyond which the wing stalls.',
      difficulty: 'basic'
    },
    {
      question: 'How does an afterburner (reheat) increase thrust?',
      options: [
        'By adding a second set of compressor stages',
        'By injecting and igniting fuel in the exhaust stream downstream of the turbine',
        'By increasing the bypass ratio',
        'By cooling the engine to allow higher RPM'
      ],
      correct: 1,
      explanation: 'An afterburner sprays raw fuel into the hot exhaust gas downstream of the turbine, where it ignites. This dramatically increases exhaust gas temperature and velocity, boosting thrust by ~50% but at very high fuel consumption (3-5x normal).',
      difficulty: 'advanced'
    },
    {
      question: 'What is the primary purpose of a fly-by-wire (FBW) flight control system?',
      options: [
        'To reduce the aircraft\'s radar signature',
        'To replace mechanical control linkages with electronic signals, enabling computer-augmented stability and agile aerodynamically unstable designs',
        'To automatically navigate between waypoints',
        'To control the landing gear retraction sequence'
      ],
      correct: 1,
      explanation: 'Fly-by-wire replaces heavy mechanical linkages with electronic signals processed by flight control computers. This allows designing inherently unstable (but highly agile) airframes while the computer continuously adjusts control surfaces thousands of times per second for stability.',
      difficulty: 'expert'
    },
    {
      question: 'Which combination of design features reduces radar cross-section (RCS) in a stealth fighter?',
      options: [
        'Round fuselage, large vertical tail, external weapons',
        'Aligned leading/trailing edge sweep angles, internal weapons bays, and radar-absorbent materials (RAM)',
        'Bright paint and larger wings',
        'More powerful engines and bigger radar'
      ],
      correct: 1,
      explanation: 'Stealth design uses aligned edge angles to redirect radar energy away from the emitter, internal weapons bays to eliminate external reflectors, radar-absorbent materials (RAM) to absorb radar energy, and planform alignment to minimize the number of radar return directions.',
      difficulty: 'expert'
    }
  ];

  // ── Return ─────────────────────────────────────────────────────
  return {
    group,
    parts,
    description: 'A twin-engine multirole fighter jet featuring delta wings, afterburning turbofans, AESA radar, fly-by-wire controls, and tricycle landing gear. Capable of Mach 2+ flight with a thrust-to-weight ratio exceeding 1.0.',
    quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;

      // ── Control surfaces deflecting ──
      // Horizontal stabilizers (stabilators) — pitch oscillation
      if (meshes[5]) {
        meshes[5].group.children.forEach(stabGroup => {
          if (stabGroup.isGroup) {
            stabGroup.rotation.x = Math.sin(t * 1.5) * 0.12;
          }
        });
      }

      // Vertical stabilizer rudders — yaw oscillation
      if (meshes[4]) {
        meshes[4].group.children.forEach(tailGroup => {
          if (tailGroup.isGroup) {
            tailGroup.rotation.y = Math.sin(t * 0.8) * 0.06;
          }
        });
      }

      // Wing ailerons — differential roll motion
      if (meshes[1]) {
        const rollDeflect = Math.sin(t * 1.2) * 0.08;
        const wings = meshes[1].group.children;
        if (wings[0] && wings[0].isGroup) wings[0].rotation.x = rollDeflect;
        if (wings[1] && wings[1].isGroup) wings[1].rotation.x = -rollDeflect;
      }

      // ── Engine exhaust glow pulsation ──
      if (meshes[3]) {
        meshes[3].group.traverse(child => {
          if (child.isMesh && child.material && child.material.emissive) {
            if (child.material.emissiveIntensity !== undefined && child.material.name === 'Fire/Combustion') {
              child.material.emissiveIntensity = 0.5 + Math.sin(t * 12) * 0.3 + Math.sin(t * 17) * 0.15;
              const glowHue = 0.06 + Math.sin(t * 8) * 0.02;
              child.material.emissive.setHSL(glowHue, 1.0, 0.5);
            }
          }
        });
      }

      // ── Landing gear cycling (slow retract/extend) ──
      if (meshes[7]) {
        // Gear oscillates between deployed (0) and partially retracted
        const gearCycle = (Math.sin(t * 0.4) + 1) * 0.5; // 0 to 1
        const gearRetract = gearCycle * 0.6; // max retraction angle

        meshes[7].group.children.forEach((gearUnit, index) => {
          if (gearUnit.isGroup) {
            // Struts swing upward as gear retracts
            gearUnit.position.y = gearRetract * 0.5;
            if (index === 0) {
              // Nose gear rotates aft
              gearUnit.rotation.x = -gearRetract;
            } else {
              // Main gear rotates inward
              gearUnit.rotation.z = (index === 1 ? 1 : -1) * gearRetract * 0.5;
            }
          }
        });
      }

      // ── Navigation lights blinking ──
      if (meshes[1]) {
        meshes[1].group.traverse(child => {
          if (child.isMesh && child.material && child.material.emissive) {
            const blink = Math.sin(t * 4) > 0 ? 1.0 : 0.1;
            if (child.material.emissiveIntensity !== undefined) {
              child.material.emissiveIntensity = blink;
            }
          }
        });
      }
    }
  };
}
