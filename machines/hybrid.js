// ═══════════════════════════════════════════════════════════════════
// Hybrid Powertrain — Toyota-style Power-Split HEV
// ═══════════════════════════════════════════════════════════════════
import { castIron, steel, aluminum, copper, brass, chrome, darkSteel, titanium,
         rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation,
         carbonFiber, redAccent, blueAccent, orangeAccent, yellowAccent,
         greenAccent, purpleAccent, electrolyte, fire, wireCoil, tinted } from '../utils/materials.js';

export function createHybrid(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // ─── 1. Internal Combustion Engine (Atkinson Cycle) ───
  const iceG = new THREE.Group();
  // Engine block — compact 4-cylinder
  const iceBlock = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 1.2), castIron.clone());
  iceG.add(iceBlock);
  // Cylinder head
  const iceHead = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 1.2), aluminum.clone());
  iceHead.position.y = 0.85;
  iceG.add(iceHead);
  // Cylinder bores
  for (let i = 0; i < 4; i++) {
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.2, 20), darkSteel.clone());
    bore.position.set(-0.65 + i * 0.44, 0.8, 0);
    iceG.add(bore);
  }
  // Pistons inside bores
  for (let i = 0; i < 4; i++) {
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.15, 20), aluminum.clone());
    piston.position.set(-0.65 + i * 0.44, 0.55, 0);
    iceG.add(piston);
    // Piston rings
    for (let r = 0; r < 2; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.01, 8, 20), steel.clone());
      ring.position.set(-0.65 + i * 0.44, 0.48 + r * 0.06, 0);
      iceG.add(ring);
    }
  }
  // Intake manifold runners
  for (let i = 0; i < 4; i++) {
    const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 10), aluminum.clone());
    runner.rotation.x = Math.PI / 2;
    runner.position.set(-0.65 + i * 0.44, 0.9, 0.85);
    iceG.add(runner);
  }
  // Exhaust manifold
  const exhaustHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 10), tinted(steel, 0x665544));
  exhaustHeader.rotation.z = Math.PI / 2;
  exhaustHeader.position.set(0, 0.4, -0.75);
  iceG.add(exhaustHeader);
  // Crankshaft pulley at front
  const crankPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), darkSteel.clone());
  crankPulley.rotation.z = Math.PI / 2;
  crankPulley.position.set(-1.1, -0.3, 0);
  iceG.add(crankPulley);
  // Oil pan
  const oilPan = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.0), tinted(aluminum, 0x777788));
  oilPan.position.y = -0.82;
  iceG.add(oilPan);
  iceG.position.set(-2.2, 0.5, 0);
  group.add(iceG);
  parts.push({
    name: 'Internal Combustion Engine',
    description: 'Compact 4-cylinder Atkinson-cycle engine optimized for efficiency over peak power. Uses late intake-valve closing to achieve an effective expansion ratio greater than the compression ratio, extracting more energy from each combustion event.',
    material: 'Cast Iron / Aluminum',
    function: 'Primary power source — converts fuel to mechanical energy at high efficiency',
    assemblyOrder: 1,
    connections: ['Power Split Device', 'Electronic Control Unit', 'Exhaust'],
    failureEffect: 'Loss of ICE power — vehicle operates in EV-only mode with limited range',
    cascadeFailures: ['Power Split Device'],
    originalPosition: { x: -2.2, y: 0.5, z: 0 },
    explodedPosition: { x: -5.5, y: 0.5, z: 0 }
  });

  // ─── 2. Electric Motor/Generator MG1 ───
  const mg1G = new THREE.Group();
  // Stator housing
  const mg1Housing = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.7, 28), aluminum.clone());
  mg1Housing.rotation.z = Math.PI / 2;
  mg1G.add(mg1Housing);
  // End bells
  const mg1End1 = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.04, 28), darkSteel.clone());
  mg1End1.rotation.z = Math.PI / 2;
  mg1End1.position.x = 0.37;
  mg1G.add(mg1End1);
  const mg1End2 = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.04, 28), darkSteel.clone());
  mg1End2.rotation.z = Math.PI / 2;
  mg1End2.position.x = -0.37;
  mg1G.add(mg1End2);
  // Stator windings visible through slots
  for (let i = 0; i < 12; i++) {
    const coil = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.08), copper.clone());
    const a = (i / 12) * Math.PI * 2;
    coil.position.set(0, Math.sin(a) * 0.42, Math.cos(a) * 0.42);
    mg1G.add(coil);
  }
  // Rotor shaft
  const mg1Shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 12), chrome.clone());
  mg1Shaft.rotation.z = Math.PI / 2;
  mg1G.add(mg1Shaft);
  // Permanent magnets on rotor
  for (let i = 0; i < 8; i++) {
    const magnet = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.15), tinted(darkSteel, 0x334455));
    const a = (i / 8) * Math.PI * 2;
    magnet.position.set(0, Math.sin(a) * 0.22, Math.cos(a) * 0.22);
    mg1G.add(magnet);
  }
  // Resolver sensor ring
  const mg1Resolver = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 8, 24), tinted(plastic, 0x444466));
  mg1Resolver.rotation.y = Math.PI / 2;
  mg1Resolver.position.x = -0.45;
  mg1G.add(mg1Resolver);
  mg1G.position.set(-0.6, 0.5, 0);
  group.add(mg1G);
  parts.push({
    name: 'Electric Motor/Generator (MG1)',
    description: 'Permanent-magnet synchronous motor that serves as the starter-generator. Spins the ICE for starting, generates electricity during cruising, and controls the power split ratio via its reaction torque on the sun gear.',
    material: 'Copper Windings / NdFeB Magnets / Aluminum Housing',
    function: 'Start ICE, generate electricity, control power-split ratio',
    assemblyOrder: 3,
    connections: ['Power Split Device', 'Inverter', 'Battery Pack'],
    failureEffect: 'Cannot start ICE, no charging during drive — battery depletes rapidly',
    cascadeFailures: ['Internal Combustion Engine', 'Battery Pack'],
    originalPosition: { x: -0.6, y: 0.5, z: 0 },
    explodedPosition: { x: -1.5, y: 3.5, z: 0 }
  });

  // ─── 3. Electric Motor/Generator MG2 ───
  const mg2G = new THREE.Group();
  // Stator housing — larger traction motor
  const mg2Housing = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.8, 32), aluminum.clone());
  mg2Housing.rotation.z = Math.PI / 2;
  mg2G.add(mg2Housing);
  // End bells
  const mg2End1 = new THREE.Mesh(new THREE.CylinderGeometry(0.71, 0.71, 0.04, 32), darkSteel.clone());
  mg2End1.rotation.z = Math.PI / 2;
  mg2End1.position.x = 0.42;
  mg2G.add(mg2End1);
  const mg2End2 = new THREE.Mesh(new THREE.CylinderGeometry(0.71, 0.71, 0.04, 32), darkSteel.clone());
  mg2End2.rotation.z = Math.PI / 2;
  mg2End2.position.x = -0.42;
  mg2G.add(mg2End2);
  // Stator windings — 3-phase
  for (let i = 0; i < 18; i++) {
    const coil = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 0.07), copper.clone());
    const a = (i / 18) * Math.PI * 2;
    coil.position.set(0, Math.sin(a) * 0.55, Math.cos(a) * 0.55);
    mg2G.add(coil);
  }
  // Rotor with interior permanent magnets (IPM)
  const mg2Rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.7, 24), tinted(steel, 0x6a6a7a));
  mg2Rotor.rotation.z = Math.PI / 2;
  mg2G.add(mg2Rotor);
  // V-shaped magnet pairs inside rotor
  for (let i = 0; i < 8; i++) {
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.12), tinted(darkSteel, 0x223344));
    const a = (i / 8) * Math.PI * 2;
    mag.position.set(0, Math.sin(a) * 0.28, Math.cos(a) * 0.28);
    mag.rotation.x = a;
    mg2G.add(mag);
  }
  // Output shaft
  const mg2Shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.4, 12), chrome.clone());
  mg2Shaft.rotation.z = Math.PI / 2;
  mg2G.add(mg2Shaft);
  // Cooling jacket grooves
  for (let i = 0; i < 6; i++) {
    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.71, 0.015, 6, 32), tinted(aluminum, 0x99aacc));
    groove.rotation.y = Math.PI / 2;
    groove.position.x = -0.3 + i * 0.12;
    mg2G.add(groove);
  }
  mg2G.position.set(1.2, 0.5, 0);
  group.add(mg2G);
  parts.push({
    name: 'Electric Motor/Generator (MG2)',
    description: 'High-torque permanent-magnet traction motor using interior-permanent-magnet (IPM) rotor design. Provides primary drive torque for EV mode and supplements ICE during acceleration. Operates as generator during regenerative braking.',
    material: 'Copper Windings / NdFeB IPM Rotor / Aluminum Housing',
    function: 'Primary traction motor, regenerative braking generator',
    assemblyOrder: 4,
    connections: ['Reduction Gearbox', 'Inverter', 'Regenerative Braking System'],
    failureEffect: 'No electric drive — vehicle limited to ICE-only with poor low-speed performance',
    cascadeFailures: ['Regenerative Braking System', 'Reduction Gearbox'],
    originalPosition: { x: 1.2, y: 0.5, z: 0 },
    explodedPosition: { x: 3.0, y: 3.5, z: 0 }
  });

  // ─── 4. Power Split Device (Planetary Gear Set) ───
  const psdG = new THREE.Group();
  // Housing
  const psdHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 28), tinted(aluminum, 0xaab0b8));
  psdHousing.rotation.z = Math.PI / 2;
  psdG.add(psdHousing);
  // Ring gear (outer)
  const ringGear = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 8, 36), steel.clone());
  ringGear.rotation.y = Math.PI / 2;
  psdG.add(ringGear);
  // Ring gear teeth
  for (let i = 0; i < 36; i++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), steel.clone());
    const a = (i / 36) * Math.PI * 2;
    tooth.position.set(0, Math.sin(a) * 0.44, Math.cos(a) * 0.44);
    psdG.add(tooth);
  }
  // Sun gear (center)
  const sunGear = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16), brass.clone());
  sunGear.rotation.z = Math.PI / 2;
  psdG.add(sunGear);
  // Sun gear teeth
  for (let i = 0; i < 12; i++) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.03), brass.clone());
    const a = (i / 12) * Math.PI * 2;
    st.position.set(0, Math.sin(a) * 0.14, Math.cos(a) * 0.14);
    psdG.add(st);
  }
  // Planet gears (4)
  for (let i = 0; i < 4; i++) {
    const planet = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 14), darkSteel.clone());
    const a = (i / 4) * Math.PI * 2;
    planet.rotation.z = Math.PI / 2;
    planet.position.set(0, Math.sin(a) * 0.3, Math.cos(a) * 0.3);
    psdG.add(planet);
    // Planet gear teeth
    for (let t = 0; t < 8; t++) {
      const pt = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.02, 0.02), darkSteel.clone());
      const ta = (t / 8) * Math.PI * 2;
      pt.position.set(0, Math.sin(a) * 0.3 + Math.sin(ta) * 0.1, Math.cos(a) * 0.3 + Math.cos(ta) * 0.1);
      psdG.add(pt);
    }
  }
  // Planet carrier pins
  for (let i = 0; i < 4; i++) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), chrome.clone());
    const a = (i / 4) * Math.PI * 2;
    pin.rotation.z = Math.PI / 2;
    pin.position.set(0, Math.sin(a) * 0.3, Math.cos(a) * 0.3);
    psdG.add(pin);
  }
  // Carrier side plates
  const carrier1 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.03, 20), tinted(steel, 0x99aabb));
  carrier1.rotation.z = Math.PI / 2;
  carrier1.position.x = 0.2;
  psdG.add(carrier1);
  const carrier2 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.03, 20), tinted(steel, 0x99aabb));
  carrier2.rotation.z = Math.PI / 2;
  carrier2.position.x = -0.2;
  psdG.add(carrier2);
  psdG.position.set(0.2, 0.5, 0);
  group.add(psdG);
  parts.push({
    name: 'Power Split Device',
    description: 'Planetary gear set that mechanically couples the ICE, MG1, and MG2. The sun gear connects to MG1, the ring gear to MG2/output, and the planet carrier to the ICE crankshaft. Enables continuously variable ratio between ICE and electric drive.',
    material: 'Hardened Steel / Brass Gears',
    function: 'Split ICE torque between MG1 (generation) and wheels (traction)',
    assemblyOrder: 2,
    connections: ['Internal Combustion Engine', 'Electric Motor/Generator (MG1)', 'Electric Motor/Generator (MG2)'],
    failureEffect: 'Complete drivetrain failure — no power transmission possible',
    cascadeFailures: ['Internal Combustion Engine', 'Electric Motor/Generator (MG1)', 'Electric Motor/Generator (MG2)'],
    originalPosition: { x: 0.2, y: 0.5, z: 0 },
    explodedPosition: { x: 0.2, y: 3.5, z: 2.5 }
  });

  // ─── 5. Battery Pack ───
  const battG = new THREE.Group();
  // Main housing
  const battCase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.6, 1.8), tinted(darkSteel, 0x2a2a35));
  battG.add(battCase);
  // Top cover with label
  const battCover = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.04, 1.7), tinted(plastic, 0x333344));
  battCover.position.y = 0.32;
  battG.add(battCover);
  // Prismatic cell modules (visible rows)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.15), tinted(aluminum, 0x889099));
      cell.position.set(-1.15 + col * 0.33, 0, -0.55 + row * 0.55);
      battG.add(cell);
      // Cell terminal tabs
      const tabPos = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.03), copper.clone());
      tabPos.position.set(-1.15 + col * 0.33 + 0.08, 0.22, -0.55 + row * 0.55);
      battG.add(tabPos);
      const tabNeg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.03), tinted(copper, 0x888899));
      tabNeg.position.set(-1.15 + col * 0.33 - 0.08, 0.22, -0.55 + row * 0.55);
      battG.add(tabNeg);
    }
  }
  // Bus bars connecting modules
  for (let row = 0; row < 3; row++) {
    const busbar = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.02, 0.04), copper.clone());
    busbar.position.set(0, 0.25, -0.55 + row * 0.55);
    battG.add(busbar);
  }
  // Cooling plate at bottom
  const coolingPlate = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 1.6), tinted(aluminum, 0x7788aa));
  coolingPlate.position.y = -0.32;
  battG.add(coolingPlate);
  // HV connectors on side
  const hvConn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 10), orangeAccent.clone());
  hvConn1.rotation.x = Math.PI / 2;
  hvConn1.position.set(1.4, 0.1, 0.97);
  battG.add(hvConn1);
  const hvConn2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 10), orangeAccent.clone());
  hvConn2.rotation.x = Math.PI / 2;
  hvConn2.position.set(1.1, 0.1, 0.97);
  battG.add(hvConn2);
  // BMS board
  const bmsBoard = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.5), greenPCB.clone());
  bmsBoard.position.set(-1.0, 0.33, 0);
  battG.add(bmsBoard);
  battG.position.set(0, -1.5, 0);
  group.add(battG);
  parts.push({
    name: 'Battery Pack',
    description: 'Prismatic lithium-ion NiMH/Li-ion battery modules arranged in series-parallel configuration. Includes Battery Management System (BMS), liquid cooling plate, and safety disconnect. Stores energy for EV driving and buffers regenerative braking energy.',
    material: 'Lithium-Ion Cells / Aluminum Housing / Copper Bus Bars',
    function: 'Store and supply electrical energy for traction and accessories',
    assemblyOrder: 7,
    connections: ['Inverter', 'Electronic Control Unit', 'High Voltage Wiring'],
    failureEffect: 'No electric drive capability — vehicle limited to limp-mode ICE-only',
    cascadeFailures: ['Inverter', 'Electric Motor/Generator (MG1)', 'Electric Motor/Generator (MG2)'],
    originalPosition: { x: 0, y: -1.5, z: 0 },
    explodedPosition: { x: 0, y: -4.5, z: 0 }
  });

  // ─── 6. Inverter (DC-AC Converter) ───
  const invG = new THREE.Group();
  // Main enclosure
  const invCase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.8), tinted(aluminum, 0x99a0aa));
  invG.add(invCase);
  // Heatsink fins on top
  for (let i = 0; i < 10; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.15, 0.03), aluminum.clone());
    fin.position.set(0, 0.32, -0.35 + i * 0.07);
    invG.add(fin);
  }
  // Power module (IGBT) blocks
  for (let i = 0; i < 3; i++) {
    const igbt = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.5), tinted(darkSteel, 0x1a1a2a));
    igbt.position.set(-0.35 + i * 0.35, -0.08, 0);
    invG.add(igbt);
  }
  // Capacitor bank
  const capBank = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.3), tinted(plastic, 0x222244));
  capBank.position.set(0, 0.12, 0.2);
  invG.add(capBank);
  // DC input terminals (orange for HV)
  const dcPos = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 8), orangeAccent.clone());
  dcPos.position.set(-0.5, 0, -0.46);
  dcPos.rotation.x = Math.PI / 2;
  invG.add(dcPos);
  const dcNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 8), blueAccent.clone());
  dcNeg.position.set(-0.3, 0, -0.46);
  dcNeg.rotation.x = Math.PI / 2;
  invG.add(dcNeg);
  // AC output terminals (3-phase to motors)
  for (let i = 0; i < 3; i++) {
    const acTerm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 8), copper.clone());
    acTerm.position.set(0.2 + i * 0.15, 0, -0.46);
    acTerm.rotation.x = Math.PI / 2;
    invG.add(acTerm);
  }
  // Control board
  const invPCB = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.4), greenPCB.clone());
  invPCB.position.set(0.2, 0.18, -0.05);
  invG.add(invPCB);
  invG.position.set(0, 1.8, 0.8);
  group.add(invG);
  parts.push({
    name: 'Inverter',
    description: 'Dual-channel DC-AC power converter using IGBT power modules. Converts battery DC to 3-phase AC for MG1 and MG2. Includes smoothing capacitor bank, gate driver PCB, and integrated heatsink for thermal management.',
    material: 'Aluminum Housing / IGBT Modules / Copper Bus Bars',
    function: 'Convert battery DC to motor AC, and motor AC to battery DC during regen',
    assemblyOrder: 6,
    connections: ['Battery Pack', 'Electric Motor/Generator (MG1)', 'Electric Motor/Generator (MG2)', 'Electronic Control Unit'],
    failureEffect: 'No motor drive capability — vehicle immobilized unless mechanical fallback exists',
    cascadeFailures: ['Electric Motor/Generator (MG1)', 'Electric Motor/Generator (MG2)'],
    originalPosition: { x: 0, y: 1.8, z: 0.8 },
    explodedPosition: { x: 0, y: 4.5, z: 3.0 }
  });

  // ─── 7. Reduction Gearbox ───
  const gearboxG = new THREE.Group();
  // Gearbox housing
  const gbCase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.9), tinted(aluminum, 0xa0a8b0));
  gearboxG.add(gbCase);
  // Input shaft
  const gbInputShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 10), chrome.clone());
  gbInputShaft.rotation.z = Math.PI / 2;
  gbInputShaft.position.set(-0.7, 0.15, 0);
  gearboxG.add(gbInputShaft);
  // Output shaft (to diff)
  const gbOutputShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 10), chrome.clone());
  gbOutputShaft.rotation.z = Math.PI / 2;
  gbOutputShaft.position.set(0.75, -0.15, 0);
  gearboxG.add(gbOutputShaft);
  // Large driven gear
  const largeGear = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 24), steel.clone());
  largeGear.rotation.z = Math.PI / 2;
  largeGear.position.set(0, -0.15, 0);
  gearboxG.add(largeGear);
  // Gear teeth on large gear
  for (let i = 0; i < 24; i++) {
    const gt = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.04), steel.clone());
    const a = (i / 24) * Math.PI * 2;
    gt.position.set(0, -0.15 + Math.sin(a) * 0.36, Math.cos(a) * 0.36);
    gearboxG.add(gt);
  }
  // Small driving gear
  const smallGear = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16), brass.clone());
  smallGear.rotation.z = Math.PI / 2;
  smallGear.position.set(0, 0.15, 0);
  gearboxG.add(smallGear);
  // Small gear teeth
  for (let i = 0; i < 14; i++) {
    const sgt = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.03), brass.clone());
    const a = (i / 14) * Math.PI * 2;
    sgt.position.set(0, 0.15 + Math.sin(a) * 0.16, Math.cos(a) * 0.16);
    gearboxG.add(sgt);
  }
  // Bearings
  const bearing1 = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 16), chrome.clone());
  bearing1.rotation.y = Math.PI / 2;
  bearing1.position.set(-0.41, 0.15, 0);
  gearboxG.add(bearing1);
  const bearing2 = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 8, 16), chrome.clone());
  bearing2.rotation.y = Math.PI / 2;
  bearing2.position.set(0.41, -0.15, 0);
  gearboxG.add(bearing2);
  gearboxG.position.set(2.5, 0.3, 0);
  group.add(gearboxG);
  parts.push({
    name: 'Reduction Gearbox',
    description: 'Single-speed reduction gear set with approximately 3.9:1 ratio. Reduces MG2 output speed while multiplying torque for wheel drive. Eliminates the need for a multi-speed transmission in hybrid/EV applications.',
    material: 'Hardened Steel Gears / Aluminum Case',
    function: 'Reduce motor speed and multiply torque to drive wheels',
    assemblyOrder: 5,
    connections: ['Electric Motor/Generator (MG2)', 'Regenerative Braking System'],
    failureEffect: 'No torque delivery to wheels — vehicle cannot move',
    cascadeFailures: ['Electric Motor/Generator (MG2)'],
    originalPosition: { x: 2.5, y: 0.3, z: 0 },
    explodedPosition: { x: 5.0, y: 0.3, z: 0 }
  });

  // ─── 8. Electronic Control Unit (HV ECU) ───
  const ecuG = new THREE.Group();
  // ECU enclosure
  const ecuCase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.6), tinted(aluminum, 0x888899));
  ecuG.add(ecuCase);
  // Main PCB
  const ecuPCB = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.5), greenPCB.clone());
  ecuPCB.position.y = 0.02;
  ecuG.add(ecuPCB);
  // Processor chip
  const cpu = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.12), tinted(darkSteel, 0x111122));
  cpu.position.set(-0.1, 0.05, 0);
  ecuG.add(cpu);
  // Supporting ICs
  for (let i = 0; i < 4; i++) {
    const ic = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.06), tinted(darkSteel, 0x1a1a2a));
    ic.position.set(0.1 + i * 0.1, 0.04, 0.12);
    ecuG.add(ic);
  }
  // Connectors
  for (let i = 0; i < 3; i++) {
    const conn = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.06), tinted(plastic, 0x444455));
    conn.position.set(-0.25 + i * 0.25, -0.05, -0.28);
    ecuG.add(conn);
  }
  // Status LEDs
  for (let i = 0; i < 4; i++) {
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 6), tinted(greenAccent, 0x00ff44));
    led.position.set(0.25, 0.05, -0.15 + i * 0.08);
    ecuG.add(led);
  }
  // Heatsink slug underneath
  const ecuHeatslug = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 0.25), aluminum.clone());
  ecuHeatslug.position.set(-0.1, -0.15, 0);
  ecuG.add(ecuHeatslug);
  ecuG.position.set(0, 1.8, -0.8);
  group.add(ecuG);
  parts.push({
    name: 'Electronic Control Unit',
    description: 'Hybrid Vehicle ECU orchestrating ICE, MG1, MG2, battery, and brake system in real-time. Implements Atkinson-cycle optimization, power-split strategy, state-of-charge management, and thermal protection algorithms.',
    material: 'FR-4 PCB / Aluminum Enclosure',
    function: 'Coordinate all powertrain components for optimal efficiency',
    assemblyOrder: 8,
    connections: ['Internal Combustion Engine', 'Electric Motor/Generator (MG1)', 'Electric Motor/Generator (MG2)', 'Inverter', 'Battery Pack', 'Regenerative Braking System'],
    failureEffect: 'Powertrain enters failsafe limp mode — very limited operation',
    cascadeFailures: ['Internal Combustion Engine', 'Inverter'],
    originalPosition: { x: 0, y: 1.8, z: -0.8 },
    explodedPosition: { x: 0, y: 4.5, z: -3.0 }
  });

  // ─── 9. Regenerative Braking System ───
  const regenG = new THREE.Group();
  // Brake disc rotor
  const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 32), tinted(steel, 0x888899));
  brakeDisc.rotation.z = Math.PI / 2;
  regenG.add(brakeDisc);
  // Ventilation slots in disc
  for (let i = 0; i < 8; i++) {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.03), tinted(darkSteel, 0x555566));
    const a = (i / 8) * Math.PI * 2;
    slot.position.set(0, Math.sin(a) * 0.3, Math.cos(a) * 0.3);
    slot.rotation.x = a;
    regenG.add(slot);
  }
  // Brake caliper body
  const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.25), tinted(aluminum, 0xbb3333));
  caliper.position.set(0.1, 0.35, 0);
  regenG.add(caliper);
  // Brake pads
  const pad1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.2, 0.2), tinted(ceramic, 0x776655));
  pad1.position.set(0.03, 0.35, 0);
  regenG.add(pad1);
  const pad2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.2, 0.2), tinted(ceramic, 0x776655));
  pad2.position.set(0.17, 0.35, 0);
  regenG.add(pad2);
  // Hydraulic line
  const hydrLine = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), tinted(steel, 0x666677));
  hydrLine.position.set(0.1, 0.55, 0.15);
  regenG.add(hydrLine);
  // Brake actuator / blending unit
  const blendUnit = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.2), tinted(darkSteel, 0x444455));
  blendUnit.position.set(0.1, 0.7, 0.15);
  regenG.add(blendUnit);
  // Wheel speed sensor
  const speedSensor = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 8), plastic.clone());
  speedSensor.position.set(-0.1, -0.45, 0);
  regenG.add(speedSensor);
  // Sensor tone ring
  const toneRing = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.015, 6, 36), tinted(steel, 0x555566));
  toneRing.rotation.y = Math.PI / 2;
  regenG.add(toneRing);
  regenG.position.set(3.5, 0, 0);
  group.add(regenG);
  parts.push({
    name: 'Regenerative Braking System',
    description: 'Cooperative brake system blending regenerative (MG2) and friction (hydraulic caliper) braking. A brake-by-wire actuator modulates the ratio — regenerative braking handles most deceleration while friction brakes engage only at low speeds or emergency stops.',
    material: 'Cast Iron Disc / Ceramic Pads / Steel Hydraulics',
    function: 'Recover kinetic energy as electricity during deceleration',
    assemblyOrder: 9,
    connections: ['Electric Motor/Generator (MG2)', 'Electronic Control Unit', 'Battery Pack'],
    failureEffect: 'Loss of energy recovery — reduced range, increased brake wear',
    cascadeFailures: ['Battery Pack'],
    originalPosition: { x: 3.5, y: 0, z: 0 },
    explodedPosition: { x: 6.5, y: 0, z: 1.5 }
  });

  // ─── 10. High Voltage Wiring ───
  const hvG = new THREE.Group();
  // Main HV cable from battery to inverter (orange per SAE J1673)
  const hvCable1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.6, 10), orangeAccent.clone());
  hvCable1.position.set(0.3, 0.1, 0.6);
  hvG.add(hvCable1);
  // Second HV cable (return)
  const hvCable2 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.6, 10), orangeAccent.clone());
  hvCable2.position.set(-0.3, 0.1, 0.6);
  hvG.add(hvCable2);
  // Cable from inverter to MG1
  const hvMG1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8), orangeAccent.clone());
  hvMG1.rotation.z = Math.PI / 2;
  hvMG1.position.set(-0.3, 1.4, 0.5);
  hvG.add(hvMG1);
  // Cable from inverter to MG2
  const hvMG2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8), orangeAccent.clone());
  hvMG2.rotation.z = Math.PI / 2;
  hvMG2.position.set(0.6, 1.3, 0.5);
  hvG.add(hvMG2);
  // Service disconnect plug
  const sdPlug = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.1), tinted(orangeAccent, 0xff6600));
  sdPlug.position.set(0, -0.9, 0.9);
  hvG.add(sdPlug);
  // Safety interlock handle
  const interlock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.05), tinted(redAccent, 0xff2200));
  interlock.position.set(0, -0.82, 0.9);
  hvG.add(interlock);
  // Cable clamps/brackets
  for (let i = 0; i < 5; i++) {
    const clamp = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 6, 10), tinted(plastic, 0x333333));
    clamp.position.set(0.3, -1.3 + i * 0.7, 0.6);
    hvG.add(clamp);
  }
  for (let i = 0; i < 5; i++) {
    const clamp = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 6, 10), tinted(plastic, 0x333333));
    clamp.position.set(-0.3, -1.3 + i * 0.7, 0.6);
    hvG.add(clamp);
  }
  // Shielding braid section
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 10), tinted(steel, 0x888899));
  shield.position.set(0.3, -0.3, 0.6);
  hvG.add(shield);
  const shield2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 10), tinted(steel, 0x888899));
  shield2.position.set(-0.3, -0.3, 0.6);
  hvG.add(shield2);
  hvG.position.set(0, 0, 0);
  group.add(hvG);
  parts.push({
    name: 'High Voltage Wiring',
    description: 'Orange-jacketed high-voltage cables per SAE J1673 standard carrying 200-650V DC between battery, inverter, and motors. Includes EMI shielding braid, service disconnect plug with safety interlock, and secured with flame-retardant clamps.',
    material: 'Copper Conductors / Orange PVC Jacket / Steel Braid Shield',
    function: 'Distribute high-voltage power safely throughout the powertrain',
    assemblyOrder: 10,
    connections: ['Battery Pack', 'Inverter', 'Electric Motor/Generator (MG1)', 'Electric Motor/Generator (MG2)'],
    failureEffect: 'Loss of HV bus — complete electric system shutdown, possible arc-flash hazard',
    cascadeFailures: ['Inverter', 'Battery Pack'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: 4.0 }
  });

  // ─── Quiz Questions ───
  const quizQuestions = [
    {
      question: 'What distinguishes an Atkinson-cycle engine from a conventional Otto-cycle engine?',
      options: [
        'Higher compression ratio for more power',
        'Expansion ratio greater than compression ratio via late intake-valve closing',
        'Uses diesel fuel instead of gasoline',
        'Has more cylinders for smoother operation'
      ],
      correct: 1,
      explanation: 'The Atkinson cycle achieves higher thermal efficiency by keeping the intake valve open longer during the compression stroke, effectively making the expansion ratio greater than the compression ratio. This extracts more energy from each combustion event at the cost of reduced peak power.',
      difficulty: 'advanced'
    },
    {
      question: 'During regenerative braking, what happens to the vehicle\'s kinetic energy?',
      options: [
        'It is dissipated as heat in the brake pads',
        'It is vented through the exhaust system',
        'MG2 acts as a generator, converting kinetic energy to electrical energy stored in the battery',
        'It is absorbed by the engine compression braking'
      ],
      correct: 2,
      explanation: 'During regenerative braking, MG2 operates as a generator — the vehicle\'s momentum spins the motor, which converts kinetic energy into electrical energy that is fed through the inverter and stored in the battery pack for later use.',
      difficulty: 'basic'
    },
    {
      question: 'In a series-parallel hybrid like the Toyota HSD, what is the role of the power split device?',
      options: [
        'It is a conventional automatic transmission',
        'A planetary gear set that mechanically couples ICE, MG1, and MG2 for variable power splitting',
        'An electronic switch that toggles between series and parallel mode',
        'A torque converter that multiplies engine torque'
      ],
      correct: 1,
      explanation: 'The power split device is a planetary gear set where the sun gear connects to MG1, the ring gear to the output/MG2, and the planet carrier to the ICE. By varying MG1\'s speed, the system acts as a continuously variable transmission without belts or clutches.',
      difficulty: 'advanced'
    },
    {
      question: 'In the power split device, if the ICE runs at constant speed and MG1 speeds up, what happens to the output (ring gear) speed?',
      options: [
        'Output speed increases proportionally',
        'Output speed decreases — more ICE power is diverted to electricity generation',
        'Output speed stays the same',
        'The ICE stalls due to over-speeding MG1'
      ],
      correct: 1,
      explanation: 'In a planetary gear set, if the carrier (ICE) speed is held constant and the sun (MG1) speed increases, the ring (output) speed must decrease by the gear ratio. More engine power flows through MG1 as electricity rather than mechanically to the wheels.',
      difficulty: 'expert'
    },
    {
      question: 'Why do hybrid vehicles typically use NiMH or lithium-ion prismatic cells rather than cylindrical cells?',
      options: [
        'Prismatic cells are cheaper to manufacture',
        'Cylindrical cells cannot store enough energy',
        'Prismatic cells offer better packing density, thermal management surface area, and easier module assembly',
        'Cylindrical cells are too heavy for automotive use'
      ],
      correct: 2,
      explanation: 'Prismatic cells provide flat surfaces for efficient thermal contact with cooling plates, pack more densely in rectangular modules with less wasted space, and simplify bus-bar connections — all critical factors for automotive battery packs where space and cooling are constrained.',
      difficulty: 'advanced'
    },
    {
      question: 'A hybrid vehicle achieves ~40% tank-to-wheel efficiency compared to ~25% for a conventional car. Which factor contributes MOST to this improvement?',
      options: [
        'The electric motor weighs less than a transmission',
        'Regenerative braking recovers 100% of braking energy',
        'The ICE operates near its peak-efficiency island while MG1/MG2 handle load variations',
        'The battery stores energy from the alternator more efficiently'
      ],
      correct: 2,
      explanation: 'The biggest efficiency gain comes from decoupling the ICE from instantaneous wheel demand. The power split device lets the ICE run near its optimal BSFC (brake-specific fuel consumption) point while MG1 and MG2 buffer the difference — avoiding the low-efficiency partial-throttle and idling conditions that dominate conventional driving.',
      difficulty: 'expert'
    }
  ];

  return {
    group,
    parts,
    description: 'A series-parallel hybrid powertrain (Toyota HSD-type). Combines a high-efficiency Atkinson-cycle ICE with two motor-generators and a planetary power-split device to achieve continuously variable power blending between combustion and electric drive.',
    quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;

      // ICE: Piston reciprocation (children 4-15 are pistons and rings, 4 pistons × 3 children each)
      if (meshes[0]) {
        const iceChildren = meshes[0].group.children;
        for (let i = 0; i < 4; i++) {
          const phase = [0, Math.PI, Math.PI, 0][i];
          const yOff = Math.sin(t * 3 + phase) * 0.004;
          // Piston head (index 4 + i*3)
          const pIdx = 4 + i * 3;
          if (iceChildren[pIdx]) iceChildren[pIdx].position.y = 0.55 + yOff;
          // Piston rings (pIdx+1, pIdx+2)
          if (iceChildren[pIdx + 1]) iceChildren[pIdx + 1].position.y = 0.48 + yOff;
          if (iceChildren[pIdx + 2]) iceChildren[pIdx + 2].position.y = 0.54 + yOff;
        }
        // Crankshaft pulley spins
        const pulleyIdx = 20;
        if (iceChildren[pulleyIdx]) iceChildren[pulleyIdx].rotation.x = t * 3;
      }

      // MG1: Rotor spins (shaft + magnets rotate)
      if (meshes[1]) {
        meshes[1].group.rotation.x = t * 5;
      }

      // MG2: Traction motor spins faster
      if (meshes[2]) {
        meshes[2].group.rotation.x = t * 7;
      }

      // Power Split Device: Planet carrier orbits
      if (meshes[3]) {
        meshes[3].group.rotation.x = t * 2;
      }

      // Battery Pack: Subtle BMS activity pulse (LED-like on BMS board)
      if (meshes[4]) {
        const battChildren = meshes[4].group.children;
        const bmsIdx = battChildren.length - 1;
        if (battChildren[bmsIdx]) {
          battChildren[bmsIdx].position.y = 0.33 + Math.sin(t * 8) * 0.002;
        }
      }

      // Inverter: Slight thermal shimmer on heatsink fins
      if (meshes[5]) {
        const invChildren = meshes[5].group.children;
        for (let i = 1; i <= 10; i++) {
          if (invChildren[i]) {
            invChildren[i].position.y = 0.32 + Math.sin(t * 6 + i * 0.5) * 0.002;
          }
        }
      }

      // Reduction Gearbox: Gears rotate
      if (meshes[6]) {
        const gbChildren = meshes[6].group.children;
        // Large gear (index 3)
        if (gbChildren[3]) gbChildren[3].rotation.x = t * 2;
        // Small gear (index ~29 after teeth)
        if (gbChildren[28]) gbChildren[28].rotation.x = -t * 4.7;
      }

      // Regenerative Braking: Disc spins
      if (meshes[8]) {
        const regenChildren = meshes[8].group.children;
        if (regenChildren[0]) regenChildren[0].rotation.x = t * 6;
      }

      // HV Wiring: Power flow pulse (cable shimmer)
      if (meshes[9]) {
        const hvChildren = meshes[9].group.children;
        for (let i = 0; i < 4; i++) {
          if (hvChildren[i]) {
            const pulse = (Math.sin(t * 10 + i * 2) + 1) * 0.5;
            hvChildren[i].scale.x = 1.0 + pulse * 0.08;
            hvChildren[i].scale.z = 1.0 + pulse * 0.08;
          }
        }
      }
    }
  };
}
