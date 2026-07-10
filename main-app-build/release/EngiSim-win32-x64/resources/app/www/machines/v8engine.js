import { steel, aluminum, darkSteel, castIron, chrome, rubber, plastic, redAccent, brass } from '../utils/materials.js';

export function createV8Engine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Engine Block
  const blockG = new THREE.Group();
  const block = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 2.5), castIron.clone());
  block.position.y = 0;
  blockG.add(block);
  group.add(blockG);
  parts.push({
    name: 'Engine Block', description: 'V8 engine block with 90 degree bank angle.', material: 'Cast Iron', function: 'Houses cylinders and crank', assemblyOrder: 1, connections: ['Crankshaft', 'Cylinder Heads'], failureEffect: 'Catastrophic engine failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Crankshaft
  const crankG = new THREE.Group();
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 32), steel.clone());
  crank.rotation.x = Math.PI / 2;
  crank.position.y = -0.5;
  crankG.add(crank);
  group.add(crankG);
  parts.push({
    name: 'Crankshaft', description: 'Cross-plane crankshaft.', material: 'Forged Steel', function: 'Converts linear to rotary motion', assemblyOrder: 2, connections: ['Engine Block', 'Pistons'], failureEffect: 'Engine locks up', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2, z:0}
  });

  // 3. Pistons (Bank A)
  const pistAG = new THREE.Group();
  for (let i=0; i<4; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32), aluminum.clone());
    p.position.set(-0.6, 0.5, -1 + i*0.66);
    pistAG.add(p);
  }
  group.add(pistAG);
  parts.push({
    name: 'Pistons (Bank A)', description: 'Left bank pistons.', material: 'Forged Aluminum', function: 'Compresses fuel/air', assemblyOrder: 3, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-2, y:1, z:0}
  });

  // 4. Pistons (Bank B)
  const pistBG = new THREE.Group();
  for (let i=0; i<4; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32), aluminum.clone());
    p.position.set(0.6, 0.5, -1 + i*0.66);
    pistBG.add(p);
  }
  group.add(pistBG);
  parts.push({
    name: 'Pistons (Bank B)', description: 'Right bank pistons.', material: 'Forged Aluminum', function: 'Compresses fuel/air', assemblyOrder: 4, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:2, y:1, z:0}
  });

  // 5. Cylinder Heads
  const headsG = new THREE.Group();
  const headA = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 2.5), aluminum.clone());
  headA.position.set(-0.8, 1.0, 0);
  headsG.add(headA);
  const headB = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 2.5), aluminum.clone());
  headB.position.set(0.8, 1.0, 0);
  headsG.add(headB);
  group.add(headsG);
  parts.push({
    name: 'Cylinder Heads', description: 'DOHC cylinder heads.', material: 'Aluminum', function: 'Houses valves and cams', assemblyOrder: 5, connections: ['Engine Block'], failureEffect: 'Blown head gasket', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 6. Intake Manifold
  const intakeG = new THREE.Group();
  const intake = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 2.0), plastic.clone());
  intake.position.set(0, 1.5, 0);
  intakeG.add(intake);
  group.add(intakeG);
  parts.push({
    name: 'Intake Manifold', description: 'Distributes air to cylinders.', material: 'Composite Plastic', function: 'Air delivery', assemblyOrder: 6, connections: ['Cylinder Heads'], failureEffect: 'Vacuum leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:4, z:0}
  });

  // 7. Exhaust Headers
  const exhaustG = new THREE.Group();
  const exA = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.5, 32), darkSteel.clone());
  exA.rotation.x = Math.PI / 2;
  exA.position.set(-1.4, 0.5, 0);
  exhaustG.add(exA);
  const exB = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.5, 32), darkSteel.clone());
  exB.rotation.x = Math.PI / 2;
  exB.position.set(1.4, 0.5, 0);
  exhaustG.add(exB);
  group.add(exhaustG);
  parts.push({
    name: 'Exhaust Headers', description: 'Collects exhaust gases.', material: 'Stainless Steel', function: 'Exhaust routing', assemblyOrder: 7, connections: ['Cylinder Heads'], failureEffect: 'Exhaust leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:3}
  });

  // 8. Oil Pan
  const panG = new THREE.Group();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 2.0), steel.clone());
  pan.position.set(0, -1.0, 0);
  panG.add(pan);
  group.add(panG);
  parts.push({
    name: 'Oil Pan', description: 'Stores engine oil.', material: 'Stamped Steel', function: 'Oil reservoir', assemblyOrder: 8, connections: ['Engine Block'], failureEffect: 'Oil leak', cascadeFailures: ['Crankshaft', 'Pistons'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 9. Timing Cover
  const timingG = new THREE.Group();
  const timing = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.2), aluminum.clone());
  timing.position.set(0, 0.5, 1.35);
  timingG.add(timing);
  group.add(timingG);
  parts.push({
    name: 'Timing Cover', description: 'Protects timing chain.', material: 'Aluminum', function: 'Cover', assemblyOrder: 9, connections: ['Engine Block'], failureEffect: 'Oil leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:2}
  });

  // 10. Flywheel
  const flyG = new THREE.Group();
  const fly = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 64), steel.clone());
  fly.rotation.x = Math.PI / 2;
  fly.position.set(0, -0.5, -1.5);
  flyG.add(fly);
  group.add(flyG);
  parts.push({
    name: 'Flywheel', description: 'Stores rotational energy.', material: 'Steel', function: 'Momentum and starter engagement', assemblyOrder: 10, connections: ['Crankshaft'], failureEffect: 'Vibration', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:-3}
  });

  const quizQuestions = [
    { question: 'What is the typical bank angle of a V8 engine?', options: ['60 degrees', '90 degrees', '120 degrees', '180 degrees'], correct: 1, explanation: 'Most V8s use a 90-degree bank angle for optimal firing intervals and balance.', difficulty: 'basic' },
    { question: 'A cross-plane V8 crankshaft has pins spaced at:', options: ['90 degrees', '180 degrees', '60 degrees', '120 degrees'], correct: 0, explanation: 'Cross-plane cranks have pins at 90-degree intervals, requiring heavy counterweights but running smoothly.', difficulty: 'advanced' },
    { question: 'What does DOHC stand for?', options: ['Dual Overhead Cam', 'Direct Overhead Combustion', 'Double Overhung Crank', 'Driven Overhead Cam'], correct: 0, explanation: 'Dual Overhead Cam means two camshafts per cylinder bank (one for intake, one for exhaust).', difficulty: 'basic' },
    { question: 'Which engine part is responsible for smoothing power delivery pulses?', options: ['Pistons', 'Crankshaft', 'Flywheel', 'Intake manifold'], correct: 2, explanation: 'The flywheel\'s inertia smooths out the distinct power pulses from the cylinders.', difficulty: 'basic' },
    { question: 'A V8 engine fires every ___ degrees of crankshaft rotation.', options: ['90', '180', '120', '60'], correct: 0, explanation: '720 degrees for a 4-stroke cycle / 8 cylinders = 90 degrees between firings.', difficulty: 'expert' },
    { question: 'What happens if the timing chain fails?', options: ['Slight power loss', 'Engine runs hotter', 'Valves may hit pistons causing catastrophic failure', 'Better fuel economy'], correct: 2, explanation: 'In an interference engine, broken timing causes valves to remain open and get struck by rising pistons.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'A V8 internal combustion engine.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[1]) meshes[1].group.rotation.z = t * 10; // crank
      if (meshes[2]) meshes[2].group.position.y = Math.sin(t * 10) * 0.2; // pistons A
      if (meshes[3]) meshes[3].group.position.y = Math.cos(t * 10) * 0.2; // pistons B
      if (meshes[9]) meshes[9].group.rotation.z = t * 10; // flywheel
    }
  };
}
