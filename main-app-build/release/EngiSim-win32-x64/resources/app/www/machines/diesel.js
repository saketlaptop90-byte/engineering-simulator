// ═══════════════════════════════════════════════════════════════════
// Diesel Engine — Compression Ignition with Common Rail & Turbo
// ═══════════════════════════════════════════════════════════════════
import { castIron, steel, aluminum, copper, ceramic, rubber, darkSteel, chrome, brass, redAccent, blueAccent, orangeAccent, yellowAccent, tinted, carbonFiber } from '../utils/materials.js';

export function createDieselEngine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // ─── 1. Engine Block — Heavy-Duty Cast Iron ───
  const blockG = new THREE.Group();
  // Main block body — thicker walls for diesel compression
  const blockBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.0, 1.8), castIron.clone());
  blockG.add(blockBody);
  // Reinforcement ribs along sides
  for (let i = 0; i < 5; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 1.85), tinted(castIron, 0x4a4a4a));
    rib.position.set(-1.4 + i * 0.7, 0.05, 0);
    blockG.add(rib);
  }
  // Cylinder bore sleeves — 4 bores on top
  for (let i = 0; i < 4; i++) {
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.35, 24), darkSteel.clone());
    sleeve.position.set(-1.05 + i * 0.7, 1.05, 0);
    blockG.add(sleeve);
    // Bore inner ring
    const inner = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 8, 24), tinted(darkSteel, 0x333340));
    inner.rotation.x = Math.PI / 2;
    inner.position.set(-1.05 + i * 0.7, 1.22, 0);
    blockG.add(inner);
  }
  // Heavy-duty head bolt studs
  for (let i = 0; i < 10; i++) {
    const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.2, 6), steel.clone());
    stud.position.set(-1.5 + i * 0.33, 1.12, 0.8);
    blockG.add(stud);
    const stud2 = stud.clone();
    stud2.position.z = -0.8;
    blockG.add(stud2);
  }
  // Oil gallery bosses
  for (let i = 0; i < 3; i++) {
    const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8), brass.clone());
    boss.rotation.z = Math.PI / 2;
    boss.position.set(-1.0 + i * 1.0, -0.6, 0.92);
    blockG.add(boss);
  }
  group.add(blockG);
  parts.push({
    name: 'Engine Block',
    description: 'Heavy-duty cast iron block with thicker walls than petrol engines to withstand 20:1 compression ratios. Features reinforcement ribs, wet cylinder liners, and robust main bearing caps for diesel pressures up to 200 bar.',
    material: 'Cast Iron',
    function: 'Houses cylinders and crankcase; withstands extreme compression loads',
    assemblyOrder: 1,
    connections: ['Pistons', 'Crankshaft', 'Cylinder Head', 'Fuel Pump (High Pressure)'],
    failureEffect: 'Catastrophic structural failure — block crack causes coolant/oil mixing',
    cascadeFailures: ['Pistons', 'Crankshaft', 'Cylinder Head'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: 0 }
  });

  // ─── 2. Pistons — High Compression with Bowl-Shaped Crown ───
  const pistonsG = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const xPos = -1.05 + i * 0.7;
    // Piston crown — flat top with bowl recess
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.12, 24), aluminum.clone());
    crown.position.set(xPos, 1.42, 0);
    pistonsG.add(crown);
    // Bowl cavity in crown (recessed combustion chamber)
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), tinted(aluminum, 0x909098));
    bowl.rotation.x = Math.PI;
    bowl.position.set(xPos, 1.49, 0);
    pistonsG.add(bowl);
    // Compression rings — diesel has thicker rings
    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.018, 8, 24), chrome.clone());
      ring.rotation.x = Math.PI / 2;
      ring.position.set(xPos, 1.30 - r * 0.07, 0);
      pistonsG.add(ring);
    }
    // Piston skirt — longer for diesel stability
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.4, 24), aluminum.clone());
    skirt.position.set(xPos, 1.0, 0);
    pistonsG.add(skirt);
    // Connecting rod
    const rod = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.1, 0.05), steel.clone());
    rod.position.set(xPos, 0.25, 0);
    pistonsG.add(rod);
    // Wrist pin
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), chrome.clone());
    pin.rotation.x = Math.PI / 2;
    pin.position.set(xPos, 0.78, 0);
    pistonsG.add(pin);
  }
  group.add(pistonsG);
  parts.push({
    name: 'Pistons',
    description: 'High-compression forged pistons with bowl-shaped crown (omega combustion chamber) for optimal fuel/air swirl. Designed for 16:1 to 22:1 compression ratio — much higher than petrol engines (8-12:1).',
    material: 'Forged Aluminum Alloy',
    function: 'Compress air to extreme pressure and temperature for compression ignition',
    assemblyOrder: 3,
    connections: ['Engine Block', 'Crankshaft', 'Fuel Injectors'],
    failureEffect: 'Loss of compression in cylinder, diesel knock, potential crown melt',
    cascadeFailures: ['Crankshaft', 'Engine Block'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 3.5, z: 0 }
  });

  // ─── 3. Crankshaft — Forged Steel, Heavier Counterweights ───
  const crankG = new THREE.Group();
  // Main journal
  const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 3.6, 20), chrome.clone());
  mainShaft.rotation.z = Math.PI / 2;
  mainShaft.position.y = -0.7;
  crankG.add(mainShaft);
  // Main bearing caps (5 for a 4-cyl)
  for (let i = 0; i < 5; i++) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.4), darkSteel.clone());
    cap.position.set(-1.4 + i * 0.7, -0.92, 0);
    crankG.add(cap);
  }
  for (let i = 0; i < 4; i++) {
    const xPos = -1.05 + i * 0.7;
    // Crank throws — beefier for diesel torque
    const throwArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.18), steel.clone());
    throwArm.position.set(xPos, -0.48, 0);
    crankG.add(throwArm);
    // Heavy counterweights — larger diameter than petrol
    const cw = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 20, 1, false, 0, Math.PI), darkSteel.clone());
    cw.rotation.z = Math.PI / 2;
    cw.rotation.y = Math.PI;
    cw.position.set(xPos, -0.9, 0);
    crankG.add(cw);
    // Pin journals
    const pinJ = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12), chrome.clone());
    pinJ.rotation.z = Math.PI / 2;
    pinJ.position.set(xPos, -0.28, 0);
    crankG.add(pinJ);
  }
  // Vibration damper on front
  const damper = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 24), rubber.clone());
  damper.rotation.z = Math.PI / 2;
  damper.position.set(-1.9, -0.7, 0);
  crankG.add(damper);
  group.add(crankG);
  parts.push({
    name: 'Crankshaft',
    description: 'Forged steel crankshaft with heavy counterweights to handle the higher torque output of diesel combustion. Features 5 main bearings for rigidity and a torsional vibration damper at the front.',
    material: 'Forged Steel / Chrome',
    function: 'Convert piston linear motion to rotary output; absorb diesel torque pulses',
    assemblyOrder: 2,
    connections: ['Pistons', 'Engine Block', 'Fuel Pump (High Pressure)'],
    failureEffect: 'Complete loss of drive — crankshaft fracture under diesel torque',
    cascadeFailures: ['Pistons', 'Engine Block'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -3.5, z: 0 }
  });

  // ─── 4. Fuel Injectors — High-Pressure Common Rail ───
  const injectorsG = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const xPos = -1.05 + i * 0.7;
    // Injector body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.55, 8), darkSteel.clone());
    body.position.set(xPos, 1.65, 0.15);
    injectorsG.add(body);
    // Solenoid actuator at top
    const solenoid = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12), tinted(darkSteel, 0x2a2a3a));
    solenoid.position.set(xPos, 1.98, 0.15);
    injectorsG.add(solenoid);
    // Electrical connector
    const connector = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.04), tinted(steel, 0x555566));
    connector.position.set(xPos, 2.0, 0.22);
    injectorsG.add(connector);
    // Nozzle tip — multi-hole
    const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 8), chrome.clone());
    nozzle.position.set(xPos, 1.35, 0.15);
    nozzle.rotation.x = Math.PI;
    injectorsG.add(nozzle);
    // Fuel return line
    const returnLine = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass.clone());
    returnLine.rotation.z = Math.PI / 2;
    returnLine.position.set(xPos + 0.15, 1.9, 0.15);
    injectorsG.add(returnLine);
    // Injector spray indicator (pulse glow)
    const spray = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.15, 8), tinted(orangeAccent, 0xff8800));
    spray.material.transparent = true;
    spray.material.opacity = 0.0;
    spray.position.set(xPos, 1.26, 0.15);
    spray.rotation.x = Math.PI;
    spray.userData.isSpray = true;
    injectorsG.add(spray);
  }
  // Common rail pipe connecting all injectors
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.8, 10), steel.clone());
  rail.rotation.z = Math.PI / 2;
  rail.position.set(0, 2.1, 0.15);
  injectorsG.add(rail);
  // Branch pipes from rail to each injector
  for (let i = 0; i < 4; i++) {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 6), steel.clone());
    branch.position.set(-1.05 + i * 0.7, 2.04, 0.15);
    injectorsG.add(branch);
  }
  group.add(injectorsG);
  parts.push({
    name: 'Fuel Injectors',
    description: 'High-pressure common-rail piezoelectric injectors operating at 2000+ bar. Unlike petrol engines, diesel has NO spark plugs — fuel is injected directly into compressed air at ~800°C, causing spontaneous compression ignition.',
    material: 'Hardened Steel / Chrome',
    function: 'Precisely atomize and inject diesel fuel at extreme pressure for compression ignition',
    assemblyOrder: 7,
    connections: ['Cylinder Head', 'Fuel Pump (High Pressure)', 'Engine Block'],
    failureEffect: 'Misfire, white/black smoke, diesel knock, poor fuel economy',
    cascadeFailures: ['DPF (Diesel Particulate Filter)'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 4.5, z: 2 }
  });

  // ─── 5. Turbocharger — Turbine + Compressor with Intercooler ───
  const turboG = new THREE.Group();
  // Turbine housing (exhaust side — hot)
  const turbineHousing = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), tinted(castIron, 0x6a4a3a));
  turbineHousing.scale.set(1, 1, 0.7);
  turbineHousing.position.set(2.0, 0.8, -0.9);
  turboG.add(turbineHousing);
  // Turbine scroll/volute
  const turbineScroll = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.1, 8, 20), tinted(castIron, 0x5a3a2a));
  turbineScroll.position.set(2.0, 0.8, -0.9);
  turboG.add(turbineScroll);
  // Turbine wheel (spinning part)
  const turbineWheel = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.15, 12), tinted(steel, 0x999999));
  turbineWheel.position.set(2.0, 0.8, -0.9);
  turbineWheel.rotation.x = Math.PI / 2;
  turboG.add(turbineWheel);
  // Compressor housing (intake side — cold)
  const compressorHousing = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), aluminum.clone());
  compressorHousing.scale.set(1, 1, 0.65);
  compressorHousing.position.set(2.0, 0.8, -1.8);
  turboG.add(compressorHousing);
  // Compressor scroll
  const compressorScroll = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 8, 20), tinted(aluminum, 0xb0b8c0));
  compressorScroll.position.set(2.0, 0.8, -1.8);
  turboG.add(compressorScroll);
  // Center section / bearing housing
  const centerSection = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 12), darkSteel.clone());
  centerSection.rotation.x = Math.PI / 2;
  centerSection.position.set(2.0, 0.8, -1.35);
  turboG.add(centerSection);
  // Oil feed line
  const oilFeed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), brass.clone());
  oilFeed.position.set(2.15, 1.2, -1.35);
  oilFeed.rotation.z = 0.3;
  turboG.add(oilFeed);
  // Wastegate actuator
  const wastegate = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 10), darkSteel.clone());
  wastegate.position.set(2.35, 0.6, -0.9);
  turboG.add(wastegate);
  const wastegateRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 6), steel.clone());
  wastegateRod.rotation.z = Math.PI / 4;
  wastegateRod.position.set(2.28, 0.72, -0.9);
  turboG.add(wastegateRod);
  // Intercooler (charge air cooler)
  const icCore = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 0.25), aluminum.clone());
  icCore.position.set(0, 2.6, -1.8);
  turboG.add(icCore);
  // Intercooler fins
  for (let i = 0; i < 12; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.30, 0.22), tinted(aluminum, 0xaab0b8));
    fin.position.set(-0.75 + i * 0.14, 2.6, -1.8);
    turboG.add(fin);
  }
  // Intake pipe from compressor to intercooler
  const intakePipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 10), aluminum.clone());
  intakePipe.rotation.z = Math.PI / 2;
  intakePipe.position.set(1.0, 2.0, -1.8);
  turboG.add(intakePipe);
  group.add(turboG);
  parts.push({
    name: 'Turbocharger',
    description: 'Exhaust-gas-driven turbocharger with turbine (hot side) and compressor (cold side) connected by a shaft spinning at up to 150,000 RPM. Includes a wastegate for boost control and intercooler to cool compressed intake air.',
    material: 'Cast Iron (turbine) / Aluminum (compressor)',
    function: 'Force more air into cylinders for higher power output per displacement',
    assemblyOrder: 9,
    connections: ['Cylinder Head', 'EGR Valve', 'Engine Block'],
    failureEffect: 'Loss of boost pressure — significant power loss, black smoke, turbo lag',
    cascadeFailures: ['Engine Block', 'DPF (Diesel Particulate Filter)'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 4, y: 1, z: -3 }
  });

  // ─── 6. Glow Plugs — Pre-Heating Elements ───
  const glowG = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const xPos = -1.05 + i * 0.7;
    // Glow plug body — ceramic/metal
    const gpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 8), ceramic.clone());
    gpBody.position.set(xPos, 1.58, -0.3);
    glowG.add(gpBody);
    // Hex nut section
    const gpHex = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 6), chrome.clone());
    gpHex.position.set(xPos, 1.8, -0.3);
    glowG.add(gpHex);
    // Heating element tip (glows orange when active)
    const gpTip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.1, 8), tinted(redAccent, 0xff4400));
    gpTip.material.emissive = new THREE.Color(0xff3300);
    gpTip.material.emissiveIntensity = 0.3;
    gpTip.position.set(xPos, 1.36, -0.3);
    glowG.add(gpTip);
    // Electrical terminal on top
    const terminal = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6), brass.clone());
    terminal.position.set(xPos, 1.87, -0.3);
    glowG.add(terminal);
  }
  // Glow plug relay/controller
  const gpRelay = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.15), tinted(darkSteel, 0x2a2a35));
  gpRelay.position.set(1.2, 1.9, -0.3);
  glowG.add(gpRelay);
  group.add(glowG);
  parts.push({
    name: 'Glow Plugs',
    description: 'Pre-heating elements that warm the combustion chamber to ~1000°C for cold starts. Unlike spark plugs, glow plugs do NOT ignite fuel — they merely assist cold starting by pre-heating the air so compression ignition can occur.',
    material: 'Ceramic / Inconel',
    function: 'Pre-heat combustion chamber for reliable cold-start compression ignition',
    assemblyOrder: 8,
    connections: ['Cylinder Head', 'Engine Block'],
    failureEffect: 'Hard starting in cold weather, white smoke on startup, rough idle until warm',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 4, z: -3 }
  });

  // ─── 7. Cylinder Head — With Prechamber Design ───
  const headG = new THREE.Group();
  // Main head casting
  const headBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 1.6), tinted(castIron, 0x555560));
  headBody.position.set(0, 1.25, 0);
  headG.add(headBody);
  // Prechamber bumps (swirl chambers for indirect injection)
  for (let i = 0; i < 4; i++) {
    const prechamber = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), tinted(castIron, 0x444450));
    prechamber.position.set(-1.05 + i * 0.7, 1.0, 0.1);
    headG.add(prechamber);
  }
  // Intake ports
  for (let i = 0; i < 4; i++) {
    const intakePort = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.4, 10), tinted(aluminum, 0x99a0a8));
    intakePort.rotation.x = Math.PI / 3;
    intakePort.position.set(-1.05 + i * 0.7, 1.45, -0.65);
    headG.add(intakePort);
  }
  // Exhaust ports
  for (let i = 0; i < 4; i++) {
    const exhaustPort = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.4, 10), tinted(castIron, 0x665544));
    exhaustPort.rotation.x = -Math.PI / 3;
    exhaustPort.position.set(-1.05 + i * 0.7, 1.45, 0.65);
    headG.add(exhaustPort);
  }
  // Valve cover
  const valveCover = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 1.4), tinted(aluminum, 0x888890));
  valveCover.position.set(0, 1.6, 0);
  headG.add(valveCover);
  // Valve cover breather
  const breather = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8), rubber.clone());
  breather.position.set(0.5, 1.78, 0);
  headG.add(breather);
  // Head gasket line
  const gasket = new THREE.Mesh(new THREE.BoxGeometry(3.42, 0.02, 1.82), tinted(copper, 0xcc8844));
  gasket.position.set(0, 0.99, 0);
  headG.add(gasket);
  // Intake and exhaust valves
  for (let i = 0; i < 4; i++) {
    // Intake valve pair
    const iv1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.02, 0.04, 10), tinted(steel, 0x99aacc));
    iv1.position.set(-1.05 + i * 0.7, 1.02, -0.15);
    headG.add(iv1);
    const iv2 = iv1.clone();
    iv2.position.z = -0.35;
    headG.add(iv2);
    // Exhaust valve pair
    const ev1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.018, 0.04, 10), tinted(steel, 0xcc9988));
    ev1.position.set(-1.05 + i * 0.7, 1.02, 0.15);
    headG.add(ev1);
    const ev2 = ev1.clone();
    ev2.position.z = 0.35;
    headG.add(ev2);
  }
  group.add(headG);
  parts.push({
    name: 'Cylinder Head',
    description: 'Cast iron cylinder head with prechamber/swirl chamber design for optimal diesel combustion. Houses intake/exhaust valves (4 per cylinder), ports, and provides mounting for fuel injectors and glow plugs.',
    material: 'Cast Iron',
    function: 'Seal combustion chambers; house valvetrain, injectors, and glow plugs',
    assemblyOrder: 4,
    connections: ['Engine Block', 'Fuel Injectors', 'Glow Plugs', 'Turbocharger'],
    failureEffect: 'Head gasket failure causes coolant leak, white smoke, overheating',
    cascadeFailures: ['Fuel Injectors', 'Glow Plugs', 'Turbocharger'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 3, z: 0 }
  });

  // ─── 8. Fuel Pump (High Pressure) — Common Rail Pump ───
  const pumpG = new THREE.Group();
  // Pump main body
  const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.28, 0.55, 16), darkSteel.clone());
  pumpBody.position.set(-2.0, 0.2, 0.6);
  pumpG.add(pumpBody);
  // Pump head — high-pressure section
  const pumpHead = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.15, 16), steel.clone());
  pumpHead.position.set(-2.0, 0.5, 0.6);
  pumpG.add(pumpHead);
  // Drive gear housing
  const driveGear = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 20), tinted(steel, 0x7a7a88));
  driveGear.position.set(-2.0, -0.1, 0.6);
  pumpG.add(driveGear);
  // High-pressure outlet ports (radial plungers)
  for (let a = 0; a < 3; a++) {
    const angle = (a / 3) * Math.PI * 2;
    const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.15, 6), brass.clone());
    outlet.rotation.z = Math.PI / 2;
    outlet.position.set(
      -2.0 + Math.cos(angle) * 0.28,
      0.35,
      0.6 + Math.sin(angle) * 0.28
    );
    pumpG.add(outlet);
  }
  // High-pressure output line to common rail
  const hpLine = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6), steel.clone());
  hpLine.rotation.z = Math.PI / 4;
  hpLine.position.set(-1.2, 1.3, 0.5);
  pumpG.add(hpLine);
  // Fuel inlet fitting (low pressure from tank)
  const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8), brass.clone());
  inlet.rotation.x = Math.PI / 2;
  inlet.position.set(-2.0, 0.0, 0.85);
  pumpG.add(inlet);
  // Metering valve (electronic flow control)
  const meteringValve = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.15, 8), tinted(darkSteel, 0x333340));
  meteringValve.rotation.z = Math.PI / 2;
  meteringValve.position.set(-2.25, 0.3, 0.6);
  pumpG.add(meteringValve);
  group.add(pumpG);
  parts.push({
    name: 'Fuel Pump (High Pressure)',
    description: 'Engine-driven radial-piston pump generating 1600-2500 bar pressure for the common rail system. Belt or gear-driven from the crankshaft, with electronic metering valve for precise pressure control.',
    material: 'Hardened Steel',
    function: 'Pressurize diesel fuel to extreme levels for common rail injection',
    assemblyOrder: 6,
    connections: ['Engine Block', 'Crankshaft', 'Fuel Injectors'],
    failureEffect: 'Complete loss of fuel pressure — engine stalls, no restart possible',
    cascadeFailures: ['Fuel Injectors'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: -4, y: 0, z: 3 }
  });

  // ─── 9. EGR Valve — Exhaust Gas Recirculation ───
  const egrG = new THREE.Group();
  // EGR valve body
  const egrBody = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.25), tinted(castIron, 0x556060));
  egrBody.position.set(2.0, 1.5, 0.7);
  egrG.add(egrBody);
  // Valve flap housing (butterfly)
  const flapHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12), tinted(steel, 0x667070));
  flapHousing.rotation.x = Math.PI / 2;
  flapHousing.position.set(2.0, 1.5, 0.9);
  egrG.add(flapHousing);
  // Butterfly valve disc
  const butterfly = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.01, 12), steel.clone());
  butterfly.rotation.x = Math.PI / 4;
  butterfly.position.set(2.0, 1.5, 0.92);
  egrG.add(butterfly);
  // EGR cooler (mini heat exchanger)
  const egrCooler = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.18), aluminum.clone());
  egrCooler.position.set(1.5, 1.5, 1.1);
  egrG.add(egrCooler);
  // Cooler fins
  for (let i = 0; i < 6; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.16, 0.15), tinted(aluminum, 0xa8b0b8));
    fin.position.set(1.25 + i * 0.09, 1.5, 1.1);
    egrG.add(fin);
  }
  // Vacuum/electric actuator
  const actuator = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 10), tinted(darkSteel, 0x2a2a30));
  actuator.position.set(2.0, 1.85, 0.7);
  egrG.add(actuator);
  // Actuator rod
  const actRod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 6), steel.clone());
  actRod.position.set(2.0, 1.72, 0.7);
  egrG.add(actRod);
  // Exhaust inlet pipe
  const egrInlet = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), tinted(castIron, 0x665555));
  egrInlet.rotation.z = Math.PI / 2;
  egrInlet.position.set(2.3, 1.5, 0.7);
  egrG.add(egrInlet);
  group.add(egrG);
  parts.push({
    name: 'EGR Valve',
    description: 'Exhaust Gas Recirculation valve recirculates a portion of exhaust gas back into the intake to lower combustion temperatures and reduce NOx emissions. Includes an EGR cooler to cool recirculated gases.',
    material: 'Cast Iron / Steel',
    function: 'Reduce nitrogen oxide (NOx) emissions by lowering peak combustion temperature',
    assemblyOrder: 10,
    connections: ['Cylinder Head', 'Turbocharger', 'DPF (Diesel Particulate Filter)'],
    failureEffect: 'Stuck open: rough idle, power loss. Stuck closed: high NOx emissions, failed emissions test',
    cascadeFailures: ['DPF (Diesel Particulate Filter)'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 4, y: 2, z: 2 }
  });

  // ─── 10. DPF (Diesel Particulate Filter) — Exhaust Aftertreatment ───
  const dpfG = new THREE.Group();
  // DPF outer canister
  const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.4, 20), tinted(steel, 0x8888aa));
  canister.rotation.z = Math.PI / 2;
  canister.position.set(0, -1.6, -1.2);
  dpfG.add(canister);
  // End caps
  const endCap1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), tinted(steel, 0x7777aa));
  endCap1.rotation.z = -Math.PI / 2;
  endCap1.position.set(-0.7, -1.6, -1.2);
  dpfG.add(endCap1);
  const endCap2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), tinted(steel, 0x7777aa));
  endCap2.rotation.z = Math.PI / 2;
  endCap2.position.set(0.7, -1.6, -1.2);
  dpfG.add(endCap2);
  // Internal honeycomb structure visible lines
  for (let i = 0; i < 5; i++) {
    const channel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), tinted(ceramic, 0xe0d0b0));
    channel.rotation.z = Math.PI / 2;
    channel.position.set(0, -1.6 + (i - 2) * 0.12, -1.2 + (i % 2 === 0 ? 0.08 : -0.08));
    dpfG.add(channel);
  }
  // Temperature sensors
  const tempSensor1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 6), brass.clone());
  tempSensor1.position.set(-0.4, -1.25, -1.2);
  dpfG.add(tempSensor1);
  const tempSensor2 = tempSensor1.clone();
  tempSensor2.position.x = 0.4;
  dpfG.add(tempSensor2);
  // Differential pressure sensor port
  const dpSensor = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 6), tinted(darkSteel, 0x333344));
  dpSensor.position.set(0, -1.25, -1.2);
  dpfG.add(dpSensor);
  // Inlet pipe from turbo
  const dpfInlet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.5, 10), tinted(steel, 0x777788));
  dpfInlet.rotation.z = Math.PI / 4;
  dpfInlet.position.set(-0.95, -1.2, -1.2);
  dpfG.add(dpfInlet);
  // Outlet pipe (tailpipe)
  const dpfOutlet = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.5, 10), tinted(steel, 0x777788));
  dpfOutlet.rotation.z = -Math.PI / 4;
  dpfOutlet.position.set(0.95, -1.2, -1.2);
  dpfG.add(dpfOutlet);
  // Heat shield wrap
  const heatShield = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 1.3, 20, 1, true), tinted(aluminum, 0xaaaaaa));
  heatShield.material.side = THREE.DoubleSide;
  heatShield.rotation.z = Math.PI / 2;
  heatShield.position.set(0, -1.6, -1.2);
  heatShield.material.transparent = true;
  heatShield.material.opacity = 0.3;
  dpfG.add(heatShield);
  group.add(dpfG);
  parts.push({
    name: 'DPF (Diesel Particulate Filter)',
    description: 'Ceramic honeycomb filter that traps soot particles from diesel exhaust (captures 85-100% of particulates). Periodically regenerates by burning accumulated soot at 600°C+. Monitored by temperature and differential pressure sensors.',
    material: 'Cordierite Ceramic / Stainless Steel',
    function: 'Capture and burn diesel soot particles to meet emissions standards',
    assemblyOrder: 5,
    connections: ['Turbocharger', 'EGR Valve'],
    failureEffect: 'Blocked DPF: limp mode, reduced power, high backpressure damages turbo',
    cascadeFailures: ['Turbocharger'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -4, z: -4 }
  });

  // ─── Quiz Questions ───
  const quizQuestions = [
    {
      question: 'How does a diesel engine ignite fuel, unlike a petrol engine?',
      options: [
        'Spark plugs create an electric arc',
        'Compression raises air temperature to auto-ignite injected fuel',
        'A glow plug continuously sparks during running',
        'A laser ignition system is used'
      ],
      correct: 1,
      explanation: 'Diesel engines use compression ignition — air is compressed to ~20:1, reaching temperatures of 700-900°C, which is hot enough to spontaneously ignite diesel fuel when injected. No spark plugs are needed.',
      difficulty: 'basic'
    },
    {
      question: 'What is the typical compression ratio range for a diesel engine compared to a petrol engine?',
      options: [
        'Diesel: 8-12:1, Petrol: 16-22:1',
        'Both use 10-14:1',
        'Diesel: 16-22:1, Petrol: 8-12:1',
        'Diesel: 4-6:1, Petrol: 20-25:1'
      ],
      correct: 2,
      explanation: 'Diesel engines operate at 16:1 to 22:1 compression ratio to achieve compression ignition, while petrol engines use 8:1 to 12:1 (limited by knock/detonation of premixed fuel-air charge).',
      difficulty: 'basic'
    },
    {
      question: 'What pressure does a common rail fuel injection system typically operate at?',
      options: [
        '3-5 bar',
        '50-100 bar',
        '200-400 bar',
        '1600-2500 bar'
      ],
      correct: 3,
      explanation: 'Modern common rail diesel injection systems operate at 1600-2500 bar (23,000-36,000 psi). This extreme pressure atomizes fuel into a fine mist of droplets as small as 10 micrometers for complete combustion.',
      difficulty: 'advanced'
    },
    {
      question: 'What causes "turbo lag" in a turbocharged diesel engine?',
      options: [
        'The fuel injectors are too slow',
        'The turbo needs exhaust gas flow to spool up, causing a delay before boost builds',
        'The glow plugs take time to heat up',
        'The DPF restricts exhaust flow'
      ],
      correct: 1,
      explanation: 'Turbo lag occurs because the turbine needs sufficient exhaust gas energy to spin up the compressor. At low RPM or sudden throttle opening, there is a delay before the turbo reaches effective speed (often 100,000+ RPM) and delivers boost pressure.',
      difficulty: 'advanced'
    },
    {
      question: 'What is the diesel fuel equivalent of octane rating, and what does it measure?',
      options: [
        'Octane number — resistance to knock',
        'Cetane number — ignition delay quality (how easily fuel auto-ignites)',
        'RON (Research Octane Number) — combustion speed',
        'Flash point — storage safety temperature'
      ],
      correct: 1,
      explanation: 'Cetane number measures how easily diesel fuel auto-ignites under compression. Higher cetane = shorter ignition delay = smoother combustion. This is the opposite of octane, which measures resistance to auto-ignition in petrol engines.',
      difficulty: 'expert'
    },
    {
      question: 'Why do diesel engines typically achieve higher thermal efficiency (40-45%) than petrol engines (25-35%)?',
      options: [
        'Diesel fuel contains more energy per liter',
        'Higher compression ratio, lean burn, and no throttle losses (unthrottled operation)',
        'Diesel engines run at higher RPM',
        'The turbocharger recovers all waste heat'
      ],
      correct: 1,
      explanation: 'Diesel engines achieve higher thermal efficiency due to: (1) higher compression ratio (thermodynamic advantage per Carnot cycle), (2) lean-burn operation with excess air, (3) no throttle plate so no pumping losses at part load, and (4) direct injection allowing precise fuel metering.',
      difficulty: 'expert'
    }
  ];

  return {
    group,
    parts,
    description: 'A turbocharged 4-cylinder common-rail diesel engine. Uses compression ignition (no spark plugs) at 16-22:1 compression ratio to auto-ignite atomized fuel injected at 2000+ bar. Features turbocharger with intercooler, EGR for emissions control, and DPF for particulate filtration.',
    quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;

      // Pistons reciprocate with firing order 1-3-4-2
      if (meshes[1]) {
        const phases = [0, Math.PI, Math.PI * 1.5, Math.PI * 0.5];
        meshes[1].group.children.forEach((child, ci) => {
          // Each piston has 8 children: crown, bowl, 3 rings, skirt, rod, pin
          const pistonIdx = Math.floor(ci / 8);
          if (pistonIdx < 4) {
            const phase = phases[pistonIdx];
            child.position.y += Math.sin(t * 4 + phase) * 0.006;
          }
        });
      }

      // Crankshaft rotates
      if (meshes[2]) {
        meshes[2].group.rotation.x = t * 4;
      }

      // Fuel injector spray pulses — flash visible spray cones
      if (meshes[3]) {
        meshes[3].group.children.forEach((child) => {
          if (child.userData && child.userData.isSpray) {
            const pulse = Math.max(0, Math.sin(t * 8) * 0.8);
            child.material.opacity = pulse * 0.6;
          }
        });
      }

      // Turbocharger — turbine and compressor spin very fast
      if (meshes[4]) {
        // Turbine wheel is child index 2, compressor scroll is index 4
        const turboChildren = meshes[4].group.children;
        if (turboChildren[2]) turboChildren[2].rotation.z = t * 25;
        if (turboChildren[4]) turboChildren[4].rotation.z = t * 25;
      }

      // Glow plug tips subtle pulsing glow
      if (meshes[5]) {
        meshes[5].group.children.forEach((child) => {
          if (child.material && child.material.emissiveIntensity !== undefined) {
            if (child.material.emissive && child.material.emissive.r > 0.5) {
              child.material.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.15;
            }
          }
        });
      }

      // EGR valve butterfly oscillation
      if (meshes[8]) {
        const egrChildren = meshes[8].group.children;
        if (egrChildren[2]) {
          egrChildren[2].rotation.x = Math.PI / 4 + Math.sin(t * 1.5) * 0.3;
        }
      }
    }
  };
}
