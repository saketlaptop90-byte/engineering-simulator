// ═══════════════════════════════════════════════════════════════════
// 4-Cylinder Inline Engine
// ═══════════════════════════════════════════════════════════════════
import { castIron, steel, aluminum, copper, ceramic, rubber, darkSteel, chrome, brass, tinted } from '../utils/materials.js';

export function createEngine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // ─── 1. Cylinder Block ───
  const blockG = new THREE.Group();
  const blockBody = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 1.5), castIron.clone());
  blockG.add(blockBody);
  // Cylinder bores on top
  for (let i = 0; i < 4; i++) {
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.3, 24), darkSteel.clone());
    bore.position.set(-1.05 + i * 0.7, 1.0, 0);
    blockG.add(bore);
  }
  // Bolt details on sides
  for (let i = 0; i < 6; i++) {
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 8), steel.clone());
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(-1.2 + i * 0.5, 0.6, 0.76);
    blockG.add(bolt);
  }
  group.add(blockG);
  parts.push({ name: 'Cylinder Block', description: 'The main structural body of the engine. Contains cylinder bores where pistons reciprocate. Made from cast iron or aluminum alloy for strength and heat dissipation.', material: 'Cast Iron', function: 'Houses cylinders, provides structural rigidity', assemblyOrder: 1, connections: ['Pistons', 'Crankshaft', 'Oil Pan', 'Camshaft'], failureEffect: 'Complete engine failure — catastrophic structural collapse', cascadeFailures: ['Pistons', 'Crankshaft', 'Camshaft'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:0,z:0} });

  // ─── 2. Pistons ───
  const pistonsG = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const pistonHead = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.25, 24), aluminum.clone());
    pistonHead.position.set(-1.05 + i * 0.7, 1.35, 0);
    pistonsG.add(pistonHead);
    // Piston rings
    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.015, 8, 24), steel.clone());
      ring.position.set(-1.05 + i * 0.7, 1.18 + r * 0.07, 0);
      pistonsG.add(ring);
    }
    // Piston skirt
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 24), aluminum.clone());
    skirt.position.set(-1.05 + i * 0.7, 0.95, 0);
    pistonsG.add(skirt);
  }
  group.add(pistonsG);
  parts.push({ name: 'Pistons', description: 'Reciprocating components that convert combustion pressure into linear motion. Each piston has compression rings and an oil ring.', material: 'Aluminum Alloy', function: 'Convert gas pressure to linear force', assemblyOrder: 3, connections: ['Cylinder Block', 'Connecting Rods'], failureEffect: 'Loss of compression in affected cylinder, misfiring', cascadeFailures: ['Connecting Rods', 'Cylinder Block'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:3,z:0} });

  // ─── 3. Connecting Rods ───
  const rodsG = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const rod = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.04), steel.clone());
    rod.position.set(-1.05 + i * 0.7, 0.2, 0);
    rodsG.add(rod);
    // Big end eye
    const bigEnd = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), steel.clone());
    bigEnd.position.set(-1.05 + i * 0.7, -0.3, 0);
    rodsG.add(bigEnd);
    // Small end eye
    const smallEnd = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.025, 8, 16), steel.clone());
    smallEnd.position.set(-1.05 + i * 0.7, 0.7, 0);
    rodsG.add(smallEnd);
  }
  group.add(rodsG);
  parts.push({ name: 'Connecting Rods', description: 'Transfer linear piston motion to rotational crankshaft motion. Feature I-beam cross-section for strength-to-weight ratio.', material: 'Forged Steel', function: 'Link pistons to crankshaft', assemblyOrder: 4, connections: ['Pistons', 'Crankshaft'], failureEffect: 'Catastrophic engine failure — rod can break through block', cascadeFailures: ['Pistons', 'Crankshaft', 'Cylinder Block'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:4.5,z:1} });

  // ─── 4. Crankshaft ───
  const crankG = new THREE.Group();
  const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16), chrome.clone());
  mainShaft.rotation.z = Math.PI / 2;
  mainShaft.position.y = -0.6;
  crankG.add(mainShaft);
  for (let i = 0; i < 4; i++) {
    // Crank throws
    const throwArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.15), steel.clone());
    throwArm.position.set(-1.05 + i * 0.7, -0.42, 0);
    crankG.add(throwArm);
    // Counterweights
    const cw = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), darkSteel.clone());
    cw.rotation.z = Math.PI / 2;
    cw.position.set(-1.05 + i * 0.7, -0.8, 0);
    crankG.add(cw);
  }
  group.add(crankG);
  parts.push({ name: 'Crankshaft', description: 'Converts reciprocating piston motion into continuous rotation. Precisely balanced with counterweights to minimize vibration.', material: 'Forged Steel / Chrome', function: 'Convert linear to rotary motion', assemblyOrder: 2, connections: ['Connecting Rods', 'Flywheel', 'Cylinder Block'], failureEffect: 'Total loss of power — engine seizes', cascadeFailures: ['Connecting Rods', 'Flywheel'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:-3,z:0} });

  // ─── 5. Camshaft ───
  const camG = new THREE.Group();
  const camShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.0, 12), steel.clone());
  camShaft.rotation.z = Math.PI / 2;
  camShaft.position.set(0, 1.3, -0.5);
  camG.add(camShaft);
  for (let i = 0; i < 8; i++) {
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), steel.clone());
    lobe.scale.set(1, 1.5, 0.7);
    lobe.position.set(-1.2 + i * 0.35, 1.3, -0.5);
    camG.add(lobe);
  }
  group.add(camG);
  parts.push({ name: 'Camshaft', description: 'Controls valve timing via eccentric lobes. Rotates at half crankshaft speed in a 4-stroke engine. Precise lobe profiles determine valve lift and duration.', material: 'Hardened Steel', function: 'Open/close valves with precise timing', assemblyOrder: 5, connections: ['Valves', 'Cylinder Block'], failureEffect: 'Valve timing failure — loss of power, potential valve-piston collision', cascadeFailures: ['Valves'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:3,z:-3} });

  // ─── 6. Valves ───
  const valvesG = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    // Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), steel.clone());
    stem.position.set(-1.2 + i * 0.35, 1.55, -0.25);
    valvesG.add(stem);
    // Head (mushroom)
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.02, 0.04, 12), tinted(steel, 0x99aacc));
    head.position.set(-1.2 + i * 0.35, 1.25, -0.25);
    valvesG.add(head);
    // Spring
    const spring = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 6, 16), tinted(steel, 0x66aa66));
    spring.position.set(-1.2 + i * 0.35, 1.65, -0.25);
    valvesG.add(spring);
  }
  group.add(valvesG);
  parts.push({ name: 'Valves', description: 'Intake valves allow air-fuel mixture entry; exhaust valves expel burnt gases. Spring-loaded to ensure positive sealing.', material: 'Stainless Steel', function: 'Control gas flow in/out of cylinders', assemblyOrder: 6, connections: ['Camshaft', 'Cylinder Block', 'Intake Manifold'], failureEffect: 'Burnt valve: loss of compression, misfiring, poor emissions', cascadeFailures: ['Camshaft'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:5,z:-2} });

  // ─── 7. Flywheel ───
  const fwG = new THREE.Group();
  const fwDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.15, 32), darkSteel.clone());
  fwDisc.rotation.z = Math.PI / 2;
  fwDisc.position.set(1.7, -0.6, 0);
  fwG.add(fwDisc);
  const fwRing = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.03, 8, 48), steel.clone());
  fwRing.rotation.y = Math.PI / 2;
  fwRing.position.set(1.7, -0.6, 0);
  fwG.add(fwRing);
  // Teeth on edge
  for (let i = 0; i < 24; i++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.04), steel.clone());
    const a = (i / 24) * Math.PI * 2;
    tooth.position.set(1.7, -0.6 + Math.sin(a) * 0.7, Math.cos(a) * 0.7);
    fwG.add(tooth);
  }
  group.add(fwG);
  parts.push({ name: 'Flywheel', description: 'Stores rotational energy to smooth power delivery between combustion strokes. Ring gear meshes with starter motor.', material: 'Cast Steel', function: 'Smooth rotational output, starter engagement', assemblyOrder: 7, connections: ['Crankshaft'], failureEffect: 'Severe vibration, inability to start', cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:4,y:-1,z:0} });

  // ─── 8. Spark Plugs ───
  const sparksG = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), ceramic.clone());
    body.position.set(-1.05 + i * 0.7, 1.6, 0.35);
    sparksG.add(body);
    const hex = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 6), chrome.clone());
    hex.position.set(-1.05 + i * 0.7, 1.45, 0.35);
    sparksG.add(hex);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.08, 6), steel.clone());
    tip.position.set(-1.05 + i * 0.7, 1.2, 0.35);
    sparksG.add(tip);
  }
  group.add(sparksG);
  parts.push({ name: 'Spark Plugs', description: 'Generate electric spark to ignite air-fuel mixture at precise timing. Gap size and heat range are critical for performance.', material: 'Ceramic / Steel', function: 'Ignite air-fuel mixture', assemblyOrder: 9, connections: ['Cylinder Block'], failureEffect: 'Misfire in affected cylinder, rough idle, power loss', cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:4,z:3} });

  // ─── 9. Oil Pan ───
  const panG = new THREE.Group();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 1.3), tinted(aluminum, 0x888899));
  pan.position.y = -1.2;
  panG.add(pan);
  const drain = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8), brass.clone());
  drain.position.set(0, -1.45, 0);
  panG.add(drain);
  group.add(panG);
  parts.push({ name: 'Oil Pan', description: 'Reservoir for engine oil at the bottom of the engine. Contains drain plug and oil pickup tube.', material: 'Stamped Steel / Aluminum', function: 'Store and collect engine oil', assemblyOrder: 8, connections: ['Cylinder Block'], failureEffect: 'Oil leak → lubrication failure → engine seizure', cascadeFailures: ['Crankshaft', 'Pistons', 'Camshaft'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:-4,z:0} });

  // ─── 10. Intake Manifold ───
  const intakeG = new THREE.Group();
  const plenum = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.3), aluminum.clone());
  plenum.position.set(0, 1.3, 1.2);
  intakeG.add(plenum);
  for (let i = 0; i < 4; i++) {
    const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12), aluminum.clone());
    runner.rotation.x = Math.PI / 2;
    runner.position.set(-1.05 + i * 0.7, 1.1, 0.95);
    intakeG.add(runner);
  }
  group.add(intakeG);
  parts.push({ name: 'Intake Manifold', description: 'Distributes air-fuel mixture evenly to each cylinder. Runner length and diameter affect torque characteristics.', material: 'Aluminum / Plastic', function: 'Distribute intake air to cylinders', assemblyOrder: 10, connections: ['Valves', 'Cylinder Block'], failureEffect: 'Uneven air distribution, vacuum leaks, rough running', cascadeFailures: ['Valves'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:2,z:4} });

  // ─── Quiz Questions ───
  const quizQuestions = [
    { question: 'What is the primary function of the crankshaft?', options: ['Store fuel', 'Convert linear to rotary motion', 'Ignite fuel', 'Cool the engine'], correct: 1, explanation: 'The crankshaft converts the reciprocating (linear) motion of the pistons into continuous rotational motion.', difficulty: 'basic' },
    { question: 'At what speed does the camshaft rotate relative to the crankshaft in a 4-stroke engine?', options: ['Same speed', 'Half speed', 'Double speed', 'Quarter speed'], correct: 1, explanation: 'In a 4-stroke engine, the camshaft rotates at half the crankshaft speed because the complete cycle takes two crankshaft revolutions.', difficulty: 'advanced' },
    { question: 'What happens if a connecting rod breaks?', options: ['Only that cylinder stops', 'Engine runs rough but continues', 'Catastrophic failure — rod can break through block', 'Fuel efficiency drops slightly'], correct: 2, explanation: 'A broken connecting rod is catastrophic — the loose rod can punch through the cylinder block, destroying the engine.', difficulty: 'basic' },
    { question: 'What is the purpose of piston rings?', options: ['Reduce weight', 'Seal combustion chamber and control oil', 'Absorb vibration', 'Connect piston to crankshaft'], correct: 1, explanation: 'Piston rings seal the combustion chamber (compression rings) and prevent excess oil from entering (oil ring).', difficulty: 'basic' },
    { question: 'Why does the flywheel have a ring gear?', options: ['For balance', 'For cooling', 'For starter motor engagement', 'For oil distribution'], correct: 2, explanation: 'The ring gear on the flywheel meshes with the starter motor pinion to crank the engine during starting.', difficulty: 'advanced' },
    { question: 'In a 4-cylinder engine with firing order 1-3-4-2, which piston fires after cylinder 3?', options: ['Cylinder 1', 'Cylinder 2', 'Cylinder 4', 'Cylinder 3 again'], correct: 2, explanation: 'Following the firing order 1-3-4-2, after cylinder 3 fires, cylinder 4 is next.', difficulty: 'expert' },
    { question: 'What is the critical consequence of incorrect valve timing?', options: ['Oil leak', 'Piston-valve collision', 'Battery drain', 'Tire wear'], correct: 1, explanation: 'If valve timing is off, valves may be open when pistons reach TDC, causing destructive piston-valve collision in interference engines.', difficulty: 'expert' },
    { question: 'What material are spark plug insulators typically made of?', options: ['Glass', 'Rubber', 'Alumina ceramic', 'Plastic'], correct: 2, explanation: 'Spark plug insulators are made from alumina ceramic (Al₂O₃) for its excellent electrical insulation and heat resistance.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'A 4-cylinder inline internal combustion engine. Converts chemical energy of fuel into mechanical rotation through controlled explosions in sealed cylinders.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Pistons move up/down
      if (meshes[1]) {
        meshes[1].group.children.forEach((child, ci) => {
          const pistonIdx = Math.floor(ci / 4); // group of 4 per piston (head, 3 rings, skirt)
          const phase = [0, Math.PI, Math.PI, 0][pistonIdx % 4];
          child.position.y += Math.sin(t * 4 + phase) * 0.005;
        });
      }
      // Crankshaft rotates
      if (meshes[3]) meshes[3].group.rotation.x = t * 4;
      // Camshaft at half speed
      if (meshes[4]) meshes[4].group.rotation.x = t * 2;
    }
  };
}
