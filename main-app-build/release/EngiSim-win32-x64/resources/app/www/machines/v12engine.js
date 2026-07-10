// ═══════════════════════════════════════════════════════════════════
// V12 Engine — 60° Naturally Balanced Powerplant
// ═══════════════════════════════════════════════════════════════════
import { castIron, steel, aluminum, copper, chrome, darkSteel, rubber, brass, titanium, carbonFiber, redAccent, blueAccent, orangeAccent, tinted } from '../utils/materials.js';

export function createV12Engine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  const BANK_ANGLE = Math.PI / 6; // 30° half-angle → 60° total V
  const CYL_SPACING = 0.52;
  const BANK_LENGTH = 6 * CYL_SPACING;

  // ─── 1. Engine Block ───
  const blockG = new THREE.Group();

  // Central crankcase backbone
  const crankcase = new THREE.Mesh(
    new THREE.BoxGeometry(BANK_LENGTH + 0.6, 1.2, 1.6),
    castIron.clone()
  );
  crankcase.position.set(0, -0.2, 0);
  blockG.add(crankcase);

  // Left cylinder bank
  const leftBank = new THREE.Mesh(
    new THREE.BoxGeometry(BANK_LENGTH + 0.3, 0.5, 1.0),
    castIron.clone()
  );
  leftBank.position.set(0, 0.55, -0.35);
  leftBank.rotation.x = BANK_ANGLE;
  blockG.add(leftBank);

  // Right cylinder bank
  const rightBank = new THREE.Mesh(
    new THREE.BoxGeometry(BANK_LENGTH + 0.3, 0.5, 1.0),
    castIron.clone()
  );
  rightBank.position.set(0, 0.55, 0.35);
  rightBank.rotation.x = -BANK_ANGLE;
  blockG.add(rightBank);

  // Cylinder bore details — left bank
  for (let i = 0; i < 6; i++) {
    const bore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.25, 20),
      darkSteel.clone()
    );
    const x = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;
    bore.position.set(x, 0.95, -0.65);
    bore.rotation.x = BANK_ANGLE;
    blockG.add(bore);
  }

  // Cylinder bore details — right bank
  for (let i = 0; i < 6; i++) {
    const bore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.25, 20),
      darkSteel.clone()
    );
    const x = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;
    bore.position.set(x, 0.95, 0.65);
    bore.rotation.x = -BANK_ANGLE;
    blockG.add(bore);
  }

  // Head bolt bosses along each bank top
  for (let i = 0; i < 7; i++) {
    const x = -BANK_LENGTH / 2 + i * CYL_SPACING;
    for (const side of [-1, 1]) {
      const bolt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.08, 6),
        steel.clone()
      );
      bolt.position.set(x, 1.05, side * 0.9);
      bolt.rotation.x = -side * BANK_ANGLE;
      blockG.add(bolt);
    }
  }

  group.add(blockG);
  parts.push({
    name: 'Engine Block',
    description: 'V-shaped cylinder block with 60° bank angle housing 12 cylinder bores (6 per bank). Cast from aluminum alloy with iron bore liners for optimal weight and wear resistance. The 60° angle provides natural primary and secondary balance.',
    material: 'Cast Aluminum / Iron Liners',
    function: 'Houses all 12 cylinders and provides structural backbone',
    assemblyOrder: 1,
    connections: ['Crankshaft', 'Pistons Left Bank', 'Pistons Right Bank', 'DOHC Heads', 'Oil System'],
    failureEffect: 'Complete engine destruction — cracked block causes coolant/oil mixing',
    cascadeFailures: ['Crankshaft', 'Pistons Left Bank', 'Pistons Right Bank'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: 0 }
  });

  // ─── 2. Crankshaft ───
  const crankG = new THREE.Group();

  // Main journal shaft
  const mainShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, BANK_LENGTH + 0.8, 16),
    chrome.clone()
  );
  mainShaft.rotation.z = Math.PI / 2;
  mainShaft.position.y = -0.85;
  crankG.add(mainShaft);

  // 6 crank throws at 60° offsets (flat-plane)
  for (let i = 0; i < 6; i++) {
    const throwAngle = i * (Math.PI / 3); // 60° per throw
    const x = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;

    // Crank pin
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12),
      chrome.clone()
    );
    pin.rotation.z = Math.PI / 2;
    pin.position.set(x, -0.85 + Math.sin(throwAngle) * 0.22, Math.cos(throwAngle) * 0.22);
    crankG.add(pin);

    // Crank web / throw arm
    const web = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.28, 0.12),
      steel.clone()
    );
    web.position.set(x, -0.85 + Math.sin(throwAngle) * 0.11, Math.cos(throwAngle) * 0.11);
    web.rotation.x = throwAngle;
    crankG.add(web);

    // Counterweight
    const cw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.15, 0.08, 16, 1, false, 0, Math.PI),
      darkSteel.clone()
    );
    cw.rotation.z = Math.PI / 2;
    cw.position.set(x, -0.85 - Math.sin(throwAngle) * 0.16, -Math.cos(throwAngle) * 0.16);
    cw.rotation.x = throwAngle + Math.PI;
    crankG.add(cw);
  }

  // Front snout for accessories
  const snout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.35, 12),
    chrome.clone()
  );
  snout.rotation.z = Math.PI / 2;
  snout.position.set(-BANK_LENGTH / 2 - 0.55, -0.85, 0);
  crankG.add(snout);

  // Rear flange for flywheel
  const flange = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.08, 20),
    steel.clone()
  );
  flange.rotation.z = Math.PI / 2;
  flange.position.set(BANK_LENGTH / 2 + 0.52, -0.85, 0);
  crankG.add(flange);

  group.add(crankG);
  parts.push({
    name: 'Crankshaft',
    description: 'Flat-plane crankshaft with 6 throws spaced 60° apart. Each throw serves two opposing cylinders (one from each bank). Forged from billet steel with precision-ground journals and integral counterweights for perfect primary balance.',
    material: 'Forged Billet Steel',
    function: 'Convert 12 pistons reciprocating motion into smooth rotational output',
    assemblyOrder: 2,
    connections: ['Engine Block', 'Pistons Left Bank', 'Pistons Right Bank', 'Accessory Drive'],
    failureEffect: 'Total power loss, possible engine seizure from broken journals',
    cascadeFailures: ['Pistons Left Bank', 'Pistons Right Bank', 'Accessory Drive'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -3.5, z: 0 }
  });

  // ─── 3. Pistons Left Bank ───
  const pistonsLG = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const x = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;
    const bankOffZ = -0.65;

    // Piston crown
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.1, 20),
      aluminum.clone()
    );
    crown.position.set(x, 1.2, bankOffZ);
    crown.rotation.x = BANK_ANGLE;
    pistonsLG.add(crown);

    // Piston skirt
    const skirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.14, 0.18, 20),
      aluminum.clone()
    );
    skirt.position.set(x, 1.02, bankOffZ + 0.1);
    skirt.rotation.x = BANK_ANGLE;
    pistonsLG.add(skirt);

    // Compression rings (2)
    for (let r = 0; r < 2; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.155, 0.012, 8, 20),
        steel.clone()
      );
      ring.position.set(x, 1.13 - r * 0.06, bankOffZ + 0.03 - r * 0.03);
      ring.rotation.x = BANK_ANGLE + Math.PI / 2;
      pistonsLG.add(ring);
    }

    // Connecting rod
    const rod = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.7, 0.03),
      titanium.clone()
    );
    rod.position.set(x, 0.5, bankOffZ * 0.35);
    rod.rotation.x = BANK_ANGLE * 0.5;
    pistonsLG.add(rod);

    // Big end bearing
    const bigEnd = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.025, 8, 14),
      brass.clone()
    );
    bigEnd.position.set(x, 0.1, 0);
    pistonsLG.add(bigEnd);
  }

  group.add(pistonsLG);
  parts.push({
    name: 'Pistons Left Bank',
    description: 'Six forged aluminum pistons with lightweight titanium connecting rods for the left cylinder bank. Each piston has two compression rings and one oil control ring. Flat-top design for optimal combustion chamber shape.',
    material: 'Forged Aluminum / Titanium Rods',
    function: 'Convert combustion pressure to linear force in left bank cylinders 1-6',
    assemblyOrder: 3,
    connections: ['Engine Block', 'Crankshaft', 'DOHC Heads'],
    failureEffect: 'Loss of power from affected cylinder, potential bore scoring',
    cascadeFailures: ['Crankshaft', 'Engine Block'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 3, z: -3 }
  });

  // ─── 4. Pistons Right Bank ───
  const pistonsRG = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const x = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;
    const bankOffZ = 0.65;

    // Piston crown
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.1, 20),
      aluminum.clone()
    );
    crown.position.set(x, 1.2, bankOffZ);
    crown.rotation.x = -BANK_ANGLE;
    pistonsRG.add(crown);

    // Piston skirt
    const skirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.14, 0.18, 20),
      aluminum.clone()
    );
    skirt.position.set(x, 1.02, bankOffZ - 0.1);
    skirt.rotation.x = -BANK_ANGLE;
    pistonsRG.add(skirt);

    // Compression rings (2)
    for (let r = 0; r < 2; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.155, 0.012, 8, 20),
        steel.clone()
      );
      ring.position.set(x, 1.13 - r * 0.06, bankOffZ - 0.03 + r * 0.03);
      ring.rotation.x = -BANK_ANGLE + Math.PI / 2;
      pistonsRG.add(ring);
    }

    // Connecting rod
    const rod = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.7, 0.03),
      titanium.clone()
    );
    rod.position.set(x, 0.5, bankOffZ * 0.35);
    rod.rotation.x = -BANK_ANGLE * 0.5;
    pistonsRG.add(rod);

    // Big end bearing
    const bigEnd = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.025, 8, 14),
      brass.clone()
    );
    bigEnd.position.set(x, 0.1, 0);
    pistonsRG.add(bigEnd);
  }

  group.add(pistonsRG);
  parts.push({
    name: 'Pistons Right Bank',
    description: 'Six forged aluminum pistons with titanium connecting rods for the right cylinder bank. Mirror configuration to left bank. Precision-balanced piston assemblies ensure smooth operation at high RPM.',
    material: 'Forged Aluminum / Titanium Rods',
    function: 'Convert combustion pressure to linear force in right bank cylinders 7-12',
    assemblyOrder: 4,
    connections: ['Engine Block', 'Crankshaft', 'DOHC Heads'],
    failureEffect: 'Loss of power from affected cylinder, potential bore scoring',
    cascadeFailures: ['Crankshaft', 'Engine Block'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 3, z: 3 }
  });

  // ─── 5. DOHC Heads ───
  const headsG = new THREE.Group();

  for (const side of [-1, 1]) {
    const zBase = side * 0.65;
    const bankTilt = -side * BANK_ANGLE;

    // Cylinder head casting
    const headCast = new THREE.Mesh(
      new THREE.BoxGeometry(BANK_LENGTH + 0.2, 0.3, 0.7),
      aluminum.clone()
    );
    headCast.position.set(0, 1.32, zBase + side * 0.15);
    headCast.rotation.x = bankTilt;
    headsG.add(headCast);

    // Cam cover (valve cover)
    const camCover = new THREE.Mesh(
      new THREE.BoxGeometry(BANK_LENGTH + 0.15, 0.2, 0.55),
      tinted(aluminum, side < 0 ? 0xcc2222 : 0x2244cc)
    );
    camCover.position.set(0, 1.55, zBase + side * 0.25);
    camCover.rotation.x = bankTilt;
    headsG.add(camCover);

    // Two camshafts per head (DOHC)
    for (let cam = 0; cam < 2; cam++) {
      const camShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, BANK_LENGTH + 0.3, 10),
        steel.clone()
      );
      camShaft.rotation.z = Math.PI / 2;
      camShaft.position.set(0, 1.52, zBase + side * (0.1 + cam * 0.2));
      headsG.add(camShaft);

      // Cam lobes
      for (let i = 0; i < 6; i++) {
        const lobe = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 10, 6),
          steel.clone()
        );
        lobe.scale.set(1, 1.4, 0.6);
        const lx = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;
        lobe.position.set(lx, 1.52, zBase + side * (0.1 + cam * 0.2));
        headsG.add(lobe);
      }
    }

    // Intake and exhaust valves (4 per cylinder = 24 per bank)
    for (let i = 0; i < 6; i++) {
      const cx = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;
      for (let v = 0; v < 4; v++) {
        const valveStem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.01, 0.01, 0.35, 6),
          steel.clone()
        );
        const vz = zBase + side * (0.05 + v * 0.1);
        valveStem.position.set(cx + (v - 1.5) * 0.04, 1.35, vz);
        valveStem.rotation.x = bankTilt;
        headsG.add(valveStem);

        // Valve spring
        const spring = new THREE.Mesh(
          new THREE.TorusGeometry(0.025, 0.005, 6, 12),
          tinted(steel, 0x44aa44)
        );
        spring.position.set(cx + (v - 1.5) * 0.04, 1.48, vz + side * 0.06);
        headsG.add(spring);
      }
    }

    // Spark plugs between cams
    for (let i = 0; i < 6; i++) {
      const cx = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;
      const plugBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6),
        tinted(aluminum, 0xeeeeee)
      );
      plugBody.position.set(cx, 1.6, zBase + side * 0.18);
      plugBody.rotation.x = bankTilt;
      headsG.add(plugBody);

      const plugHex = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.06, 6),
        chrome.clone()
      );
      plugHex.position.set(cx, 1.7, zBase + side * 0.22);
      plugHex.rotation.x = bankTilt;
      headsG.add(plugHex);
    }
  }

  group.add(headsG);
  parts.push({
    name: 'DOHC Heads',
    description: 'Dual overhead cam cylinder heads — four camshafts total (two per bank). Each cylinder has 4 valves (2 intake, 2 exhaust) for 48 valves total. Pent-roof combustion chambers for efficient flame propagation. Variable valve timing on intake cams.',
    material: 'Cast Aluminum',
    function: 'Control valve timing and combustion chamber sealing for all 12 cylinders',
    assemblyOrder: 5,
    connections: ['Engine Block', 'Intake System', 'Exhaust System', 'Pistons Left Bank', 'Pistons Right Bank'],
    failureEffect: 'Head gasket failure causes coolant/oil mixing, compression loss',
    cascadeFailures: ['Pistons Left Bank', 'Pistons Right Bank'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 4, z: 0 }
  });

  // ─── 6. Intake System ───
  const intakeG = new THREE.Group();

  // Central plenum chamber
  const plenum = new THREE.Mesh(
    new THREE.BoxGeometry(BANK_LENGTH * 0.7, 0.55, 0.6),
    aluminum.clone()
  );
  plenum.position.set(0, 2.2, 0);
  intakeG.add(plenum);

  // Throttle body at front
  const throttle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.15, 0.25, 16),
    aluminum.clone()
  );
  throttle.rotation.z = Math.PI / 2;
  throttle.position.set(-BANK_LENGTH / 2 - 0.1, 2.2, 0);
  intakeG.add(throttle);

  // Throttle butterfly disc
  const butterfly = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.01, 16),
    brass.clone()
  );
  butterfly.rotation.z = Math.PI / 2;
  butterfly.position.set(-BANK_LENGTH / 2 - 0.1, 2.2, 0);
  intakeG.add(butterfly);

  // 12 intake runners — 6 per side with velocity stacks
  for (let i = 0; i < 6; i++) {
    const cx = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;
    for (const side of [-1, 1]) {
      // Runner tube
      const runner = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.055, 0.55, 10),
        aluminum.clone()
      );
      const rz = side * 0.45;
      runner.position.set(cx, 1.9, rz);
      runner.rotation.x = -side * 0.4;
      intakeG.add(runner);

      // Velocity stack (trumpet bell)
      const bell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.06, 0.12, 12),
        chrome.clone()
      );
      bell.position.set(cx, 2.15, rz * 0.5);
      intakeG.add(bell);
    }
  }

  // Air filter housing on top
  const airFilter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.18, 20),
    plastic.clone()
  );
  airFilter.position.set(0, 2.55, 0);
  intakeG.add(airFilter);

  const filterLid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.04, 20),
    tinted(darkSteel, 0x333344)
  );
  filterLid.position.set(0, 2.65, 0);
  intakeG.add(filterLid);

  // Import plastic locally for air filter
  const plastic = tinted(aluminum, 0x2a2a3a);

  group.add(intakeG);
  parts.push({
    name: 'Intake System',
    description: '12-runner individual throttle body intake with velocity stacks (trumpets). Central plenum distributes air evenly to all 12 cylinders. Each runner is tuned for optimal air column resonance at peak RPM, maximizing volumetric efficiency.',
    material: 'Cast Aluminum / Chrome Stacks',
    function: 'Deliver precisely metered air to each of 12 cylinders with velocity stacks',
    assemblyOrder: 6,
    connections: ['DOHC Heads', 'Engine Block'],
    failureEffect: 'Unequal air distribution causes lean/rich cylinders, power loss',
    cascadeFailures: ['DOHC Heads'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 5.5, z: 0 }
  });

  // ─── 7. Exhaust System ───
  const exhaustG = new THREE.Group();

  for (const side of [-1, 1]) {
    const zBase = side * 1.1;

    // 6 primary header tubes per bank
    for (let i = 0; i < 6; i++) {
      const cx = -BANK_LENGTH / 2 + 0.26 + i * CYL_SPACING;

      // Primary pipe
      const primary = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8),
        tinted(darkSteel, 0x664422)
      );
      primary.position.set(cx, 0.4, zBase);
      primary.rotation.x = -side * 0.6;
      exhaustG.add(primary);

      // Header flange at cylinder head
      const flange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.03, 8),
        steel.clone()
      );
      flange.position.set(cx, 0.8, zBase - side * 0.2);
      flange.rotation.x = -side * BANK_ANGLE;
      exhaustG.add(flange);
    }

    // Collector — 6-into-1 merge
    const collector = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.08, 0.6, 12),
      tinted(darkSteel, 0x553311)
    );
    collector.rotation.z = Math.PI / 2;
    collector.position.set(BANK_LENGTH / 2 + 0.3, 0.1, zBase + side * 0.15);
    exhaustG.add(collector);

    // Exit pipe from collector
    const exitPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 1.0, 10),
      tinted(darkSteel, 0x443322)
    );
    exitPipe.rotation.z = Math.PI / 2;
    exitPipe.position.set(BANK_LENGTH / 2 + 0.9, -0.1, zBase + side * 0.2);
    exhaustG.add(exitPipe);

    // Heat shield over headers
    const heatShield = new THREE.Mesh(
      new THREE.BoxGeometry(BANK_LENGTH * 0.8, 0.04, 0.4),
      tinted(aluminum, 0x999977)
    );
    heatShield.position.set(0, 0.15, zBase + side * 0.15);
    exhaustG.add(heatShield);
  }

  group.add(exhaustG);
  parts.push({
    name: 'Exhaust System',
    description: 'Twin 6-into-1 equal-length headers — one per bank. Each primary tube is tuned for exhaust pulse scavenging, and the 6-into-1 collector produces the signature V12 exhaust note. Inconel alloy withstands extreme temperatures.',
    material: 'Inconel / Stainless Steel',
    function: 'Evacuate exhaust gases with optimal scavenging from all 12 cylinders',
    assemblyOrder: 8,
    connections: ['DOHC Heads', 'Engine Block'],
    failureEffect: 'Exhaust leak causes power loss, uneven back-pressure, check engine light',
    cascadeFailures: ['DOHC Heads'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -1, z: 0 }
  });

  // ─── 8. Oil System ───
  const oilG = new THREE.Group();

  // Dry sump oil pan (shallow)
  const sumpPan = new THREE.Mesh(
    new THREE.BoxGeometry(BANK_LENGTH + 0.4, 0.2, 1.4),
    tinted(aluminum, 0x888899)
  );
  sumpPan.position.set(0, -1.05, 0);
  oilG.add(sumpPan);

  // External oil tank (dry sump reservoir)
  const oilTank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16),
    tinted(aluminum, 0x667788)
  );
  oilTank.position.set(-BANK_LENGTH / 2 - 0.7, 0.1, -1.0);
  oilG.add(oilTank);

  // Oil tank cap
  const tankCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16),
    darkSteel.clone()
  );
  tankCap.position.set(-BANK_LENGTH / 2 - 0.7, 0.72, -1.0);
  oilG.add(tankCap);

  // Scavenge pump on front of engine
  const scavPump = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, 0.2),
    darkSteel.clone()
  );
  scavPump.position.set(-BANK_LENGTH / 2 - 0.5, -0.7, 0.4);
  oilG.add(scavPump);

  // Pressure pump
  const pressPump = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.2, 12),
    steel.clone()
  );
  pressPump.position.set(-BANK_LENGTH / 2 - 0.5, -0.7, -0.4);
  oilG.add(pressPump);

  // Oil lines (supply and return)
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6),
      tinted(steel, 0x445566)
    );
    line.rotation.x = Math.PI / 2;
    line.position.set(-BANK_LENGTH / 2 - 0.6, -0.2 + i * 0.3, -0.6 + i * 0.2);
    oilG.add(line);
  }

  // Oil cooler
  const oilCooler = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.3, 0.08),
    tinted(aluminum, 0x556677)
  );
  oilCooler.position.set(-BANK_LENGTH / 2 - 0.7, -0.4, -0.5);
  oilG.add(oilCooler);

  // Oil cooler fins
  for (let i = 0; i < 8; i++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.02, 0.06),
      aluminum.clone()
    );
    fin.position.set(-BANK_LENGTH / 2 - 0.7, -0.53 + i * 0.04, -0.5);
    oilG.add(fin);
  }

  // Drain plug
  const drain = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.08, 6),
    brass.clone()
  );
  drain.position.set(0, -1.2, 0);
  oilG.add(drain);

  group.add(oilG);
  parts.push({
    name: 'Oil System',
    description: 'Dry sump lubrication system with external oil reservoir, scavenge pump, pressure pump, and oil cooler. Dry sump allows lower engine mounting (lower center of gravity) and ensures oil supply during high-G cornering. 10+ liters oil capacity.',
    material: 'Aluminum / Steel',
    function: 'Lubricate all moving parts with pressurized oil, scavenge from sump',
    assemblyOrder: 7,
    connections: ['Engine Block', 'Crankshaft'],
    failureEffect: 'Oil starvation causes bearing failure, engine seizure within seconds',
    cascadeFailures: ['Crankshaft', 'Pistons Left Bank', 'Pistons Right Bank', 'DOHC Heads'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: -3, y: -3, z: -2 }
  });

  // ─── 9. Accessory Drive ───
  const accG = new THREE.Group();

  const frontX = -BANK_LENGTH / 2 - 0.5;

  // Main crank pulley (harmonic damper)
  const crankPulley = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.1, 24),
    darkSteel.clone()
  );
  crankPulley.rotation.z = Math.PI / 2;
  crankPulley.position.set(frontX, -0.85, 0);
  accG.add(crankPulley);

  // Crank pulley center bolt
  const centerBolt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.15, 6),
    chrome.clone()
  );
  centerBolt.rotation.z = Math.PI / 2;
  centerBolt.position.set(frontX - 0.08, -0.85, 0);
  accG.add(centerBolt);

  // Alternator pulley (upper left)
  const altPulley = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16),
    steel.clone()
  );
  altPulley.rotation.z = Math.PI / 2;
  altPulley.position.set(frontX, 0.1, -0.5);
  accG.add(altPulley);

  // Alternator body
  const altBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.2, 16),
    darkSteel.clone()
  );
  altBody.rotation.z = Math.PI / 2;
  altBody.position.set(frontX + 0.12, 0.1, -0.5);
  accG.add(altBody);

  // Water pump pulley (lower right)
  const wpPulley = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16),
    aluminum.clone()
  );
  wpPulley.rotation.z = Math.PI / 2;
  wpPulley.position.set(frontX, -0.4, 0.5);
  accG.add(wpPulley);

  // Water pump housing
  const wpHousing = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.3, 0.3),
    aluminum.clone()
  );
  wpHousing.position.set(frontX + 0.1, -0.4, 0.5);
  accG.add(wpHousing);

  // A/C compressor pulley (lower left)
  const acPulley = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16),
    steel.clone()
  );
  acPulley.rotation.z = Math.PI / 2;
  acPulley.position.set(frontX, -0.45, -0.45);
  accG.add(acPulley);

  // Power steering pump (upper right)
  const psPulley = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.06, 14),
    steel.clone()
  );
  psPulley.rotation.z = Math.PI / 2;
  psPulley.position.set(frontX, 0.15, 0.4);
  accG.add(psPulley);

  // Belt tensioner
  const tensioner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.05, 12),
    chrome.clone()
  );
  tensioner.rotation.z = Math.PI / 2;
  tensioner.position.set(frontX, -0.15, -0.3);
  accG.add(tensioner);

  // Serpentine belt (represented as a torus wrapping pulleys)
  const belt = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.015, 6, 48),
    rubber.clone()
  );
  belt.rotation.y = Math.PI / 2;
  belt.position.set(frontX, -0.35, 0);
  accG.add(belt);

  // Idler pulley
  const idler = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12),
    steel.clone()
  );
  idler.rotation.z = Math.PI / 2;
  idler.position.set(frontX, 0.0, 0.15);
  accG.add(idler);

  group.add(accG);
  parts.push({
    name: 'Accessory Drive',
    description: 'Front-mounted serpentine belt drive system powering alternator, water pump, A/C compressor, and power steering pump from the crankshaft harmonic damper pulley. Automatic belt tensioner maintains proper tension.',
    material: 'Steel Pulleys / Rubber Belt',
    function: 'Drive all engine accessories from crankshaft rotation',
    assemblyOrder: 9,
    connections: ['Crankshaft', 'Engine Block'],
    failureEffect: 'Belt failure disables charging, cooling, power steering, and A/C simultaneously',
    cascadeFailures: ['Engine Block'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: -4, y: 0, z: 0 }
  });

  // ─── 10. Engine Mounts ───
  const mountsG = new THREE.Group();

  // Front left mount
  const createMount = (x, y, z) => {
    // Mounting bracket (steel)
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.15, 0.25),
      steel.clone()
    );
    bracket.position.set(x, y, z);
    mountsG.add(bracket);

    // Rubber isolator (vibration damping)
    const isolator = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.1, 0.12, 16),
      rubber.clone()
    );
    isolator.position.set(x, y - 0.13, z);
    mountsG.add(isolator);

    // Lower mounting plate
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.04, 0.3),
      steel.clone()
    );
    plate.position.set(x, y - 0.2, z);
    mountsG.add(plate);

    // Mounting bolts (4 per mount)
    for (let bx = -1; bx <= 1; bx += 2) {
      for (let bz = -1; bz <= 1; bz += 2) {
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6),
          chrome.clone()
        );
        bolt.position.set(x + bx * 0.09, y - 0.15, z + bz * 0.09);
        mountsG.add(bolt);
      }
    }

    // Snubber / bump stop
    const snubber = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 0.06, 10),
      rubber.clone()
    );
    snubber.position.set(x, y + 0.1, z);
    mountsG.add(snubber);
  };

  // Front left
  createMount(-BANK_LENGTH / 2 - 0.15, -1.0, -0.9);
  // Front right
  createMount(-BANK_LENGTH / 2 - 0.15, -1.0, 0.9);
  // Rear left
  createMount(BANK_LENGTH / 2 + 0.15, -1.0, -0.9);
  // Rear right
  createMount(BANK_LENGTH / 2 + 0.15, -1.0, 0.9);

  group.add(mountsG);
  parts.push({
    name: 'Engine Mounts',
    description: 'Four hydraulic-filled rubber engine mounts isolate engine vibration from the chassis. Despite the V12 natural balance, mounts dampen firing impulses and torsional vibration. Features bump stops to limit engine movement under hard acceleration.',
    material: 'Steel Brackets / Hydraulic Rubber',
    function: 'Isolate engine vibration from vehicle chassis while securing the engine',
    assemblyOrder: 10,
    connections: ['Engine Block'],
    failureEffect: 'Excessive engine movement, vibration transmitted to cabin, potential drivetrain misalignment',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -4.5, z: 0 }
  });

  // ─── Quiz Questions ───
  const quizQuestions = [
    {
      question: 'Why is the 60° bank angle considered ideal for a V12 engine?',
      options: [
        'It is the easiest angle to manufacture',
        'It provides perfect primary and secondary balance without balance shafts',
        'It allows the engine to fit in smaller cars',
        'It reduces the number of bearings needed'
      ],
      correct: 1,
      explanation: 'A 60° V12 is naturally balanced in both primary and secondary forces and moments. Each bank of 6 is inherently balanced (inline-6 property), and the 60° angle between banks cancels all remaining forces, eliminating the need for balance shafts.',
      difficulty: 'advanced'
    },
    {
      question: 'How does a V12 achieve natural balance that a V8 cannot?',
      options: [
        'By using heavier pistons',
        'Each bank is an inherently balanced inline-6, and the 60° angle cancels inter-bank forces',
        'By spinning the crankshaft in reverse',
        'By using more counterweights on the crankshaft'
      ],
      correct: 1,
      explanation: 'Each bank of a V12 is effectively an inline-6, which is perfectly balanced on its own. The 60° V angle means the two banks\u0027 remaining secondary forces cancel each other. A V8 has unbalanced secondary forces requiring a cross-plane crank or balance shafts.',
      difficulty: 'expert'
    },
    {
      question: 'What is a key advantage of a V12 over a V8 of equal displacement?',
      options: [
        'Lower weight',
        'Smaller physical size',
        'Smoother power delivery with more evenly spaced firing intervals',
        'Lower manufacturing cost'
      ],
      correct: 2,
      explanation: 'A V12 fires every 60° of crankshaft rotation versus every 90° for a V8. This produces significantly smoother power delivery and less torsional vibration, which is why V12s are preferred in luxury and high-performance applications.',
      difficulty: 'basic'
    },
    {
      question: 'What is the fundamental difference between Ferrari and Lamborghini V12 engine philosophies?',
      options: [
        'Ferrari uses 90° and Lamborghini uses 60°',
        'Ferrari uses 60° front-mounted, Lamborghini uses 60° rear-mounted (historically)',
        'Ferrari V12s are turbocharged, Lamborghini V12s are supercharged',
        'There is no difference — both use identical designs'
      ],
      correct: 1,
      explanation: 'Historically, Ferrari placed their V12 longitudinally in the front (later mid-engine), while Lamborghini mounted theirs transversely in the rear. Both use 60° angles but with different philosophies: Ferrari emphasizes high-RPM naturally aspirated power, while Lamborghini emphasizes massive displacement and torque.',
      difficulty: 'advanced'
    },
    {
      question: 'What is a typical displacement range for modern high-performance V12 engines?',
      options: [
        '2.0 to 3.0 liters',
        '3.5 to 5.0 liters',
        '5.5 to 6.5 liters',
        '8.0 to 10.0 liters'
      ],
      correct: 2,
      explanation: 'Most modern performance V12s displace between 5.5L and 6.5L — Ferrari uses 6.5L (812/Daytona), Lamborghini uses 6.5L (Aventador), Aston Martin uses 5.2L (twin-turbo). This range balances power output with emissions and fuel economy requirements.',
      difficulty: 'basic'
    },
    {
      question: 'Why do naturally aspirated V12 engines typically have higher RPM limits (8,000-9,000+ RPM) than V8s?',
      options: [
        'V12 engines use stronger materials',
        'Smaller individual cylinder displacement means lighter pistons and lower reciprocating mass',
        'V12 crankshafts are shorter',
        'V12 engines have more spark plugs'
      ],
      correct: 1,
      explanation: 'With 12 cylinders sharing the total displacement, each cylinder is smaller, allowing lighter pistons and connecting rods. Lower reciprocating mass means less inertial stress at high RPM, enabling safe operation at 8,500+ RPM — like Ferrari\'s 9,000 RPM F140 engine.',
      difficulty: 'expert'
    }
  ];

  return {
    group,
    parts,
    description: 'A 60° V12 naturally aspirated engine — the pinnacle of internal combustion refinement. Twelve cylinders in two banks of six provide perfect primary and secondary balance, silky-smooth power delivery, and an unmistakable exhaust note. Features DOHC 4-valve heads, dry sump lubrication, and individual velocity stacks.',
    quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;

      // V12 firing order (Ferrari-style): 1-7-5-11-3-9-6-12-2-8-4-10
      // Left bank (part index 2): cylinders 1-6 (indices 0-5)
      // Right bank (part index 3): cylinders 7-12 (indices 0-5)
      // Phase offsets in crankshaft degrees for each cylinder firing
      const leftBankPhases = [
        0,                    // Cyl 1: fires at 0°
        4 * (Math.PI / 3),    // Cyl 2: fires at 240° (8th in order)
        2 * (Math.PI / 3),    // Cyl 3: fires at 120° (5th in order → 4*60=240... recalc)
        5 * (Math.PI / 3),    // Cyl 4: fires at 300° (11th)
        1 * (Math.PI / 3),    // Cyl 5: fires at 60° (3rd in order)
        3 * (Math.PI / 3)     // Cyl 6: fires at 180° (7th in order)
      ];

      const rightBankPhases = [
        0.5 * (Math.PI / 3),  // Cyl 7: fires at 30° offset (2nd in order)
        3.5 * (Math.PI / 3),  // Cyl 8: fires at 210° (10th)
        1.5 * (Math.PI / 3),  // Cyl 9: fires at 90° (6th)
        4.5 * (Math.PI / 3),  // Cyl 10: fires at 270° (12th)
        2.5 * (Math.PI / 3),  // Cyl 11: fires at 150° (4th)
        5.5 * (Math.PI / 3)   // Cyl 12: fires at 330° (8th)
      ];

      // Animate left bank pistons (meshes[2])
      if (meshes[2]) {
        const children = meshes[2].group.children;
        // Each piston unit = 6 children (crown, skirt, 2 rings, rod, bigEnd)
        const partsPerPiston = 6;
        for (let i = 0; i < 6; i++) {
          const phase = leftBankPhases[i];
          const stroke = Math.sin(t * 4 + phase) * 0.004;
          for (let p = 0; p < partsPerPiston; p++) {
            const idx = i * partsPerPiston + p;
            if (idx < children.length) {
              children[idx].position.y += stroke;
            }
          }
        }
      }

      // Animate right bank pistons (meshes[3])
      if (meshes[3]) {
        const children = meshes[3].group.children;
        const partsPerPiston = 6;
        for (let i = 0; i < 6; i++) {
          const phase = rightBankPhases[i];
          const stroke = Math.sin(t * 4 + phase) * 0.004;
          for (let p = 0; p < partsPerPiston; p++) {
            const idx = i * partsPerPiston + p;
            if (idx < children.length) {
              children[idx].position.y += stroke;
            }
          }
        }
      }

      // Crankshaft rotation (meshes[1])
      if (meshes[1]) {
        meshes[1].group.rotation.x = t * 4;
      }

      // DOHC camshaft rotation at half crank speed (meshes[4])
      if (meshes[4]) {
        meshes[4].group.rotation.x = t * 2;
      }

      // Accessory drive belt spin — pulley visuals (meshes[8])
      if (meshes[8]) {
        // Spin the pulleys (first few children are pulleys)
        const accChildren = meshes[8].group.children;
        // Crank pulley (child 0)
        if (accChildren[0]) accChildren[0].rotation.x = t * 4;
        // Alternator pulley (child 2) — spins faster (smaller)
        if (accChildren[2]) accChildren[2].rotation.x = t * 6;
        // Water pump pulley (child 4)
        if (accChildren[4]) accChildren[4].rotation.x = t * 3.5;
      }
    }
  };
}
