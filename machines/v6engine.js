import { steel, aluminum, castIron, darkSteel, redAccent, brass } from '../utils/materials.js';

export function createV6Engine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Engine Block
  const blockG = new THREE.Group();
  const block = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 2.0), castIron.clone());
  block.position.y = 0;
  blockG.add(block);
  group.add(blockG);
  parts.push({
    name: 'Engine Block (V6)', description: 'V-shaped block with 60-degree bank angle, the most common V6 configuration.', material: 'Cast Iron', function: 'Housing cylinders and crank', assemblyOrder: 1, connections: ['Crankshaft', 'Cylinder Heads'], failureEffect: 'Catastrophic engine failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Crankshaft
  const crankG = new THREE.Group();
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16), steel.clone());
  crank.rotation.x = Math.PI / 2;
  crank.position.y = -0.5;
  crankG.add(crank);
  group.add(crankG);
  parts.push({
    name: 'Crankshaft', description: 'Crankshaft with split crankpins to achieve even firing in a 60-degree V6.', material: 'Forged Steel', function: 'Converts linear to rotary motion', assemblyOrder: 2, connections: ['Engine Block', 'Pistons'], failureEffect: 'Engine lockup', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2, z:0}
  });

  // 3. Pistons (Bank A)
  const pistAG = new THREE.Group();
  for (let i=0; i<3; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum.clone());
    p.position.set(-0.5, 0.4, -0.6 + i*0.6);
    p.rotation.z = Math.PI / 6; // 30 deg lean (total 60 deg V)
    pistAG.add(p);
  }
  group.add(pistAG);
  parts.push({
    name: 'Pistons (Bank A)', description: 'Left bank pistons.', material: 'Forged Aluminum', function: 'Compresses fuel/air', assemblyOrder: 3, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-2, y:1, z:0}
  });

  // 4. Pistons (Bank B)
  const pistBG = new THREE.Group();
  for (let i=0; i<3; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum.clone());
    p.position.set(0.5, 0.4, -0.6 + i*0.6);
    p.rotation.z = -Math.PI / 6;
    pistBG.add(p);
  }
  group.add(pistBG);
  parts.push({
    name: 'Pistons (Bank B)', description: 'Right bank pistons.', material: 'Forged Aluminum', function: 'Compresses fuel/air', assemblyOrder: 4, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:2, y:1, z:0}
  });

  // 5. Cylinder Heads
  const headsG = new THREE.Group();
  const headA = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 2.0), aluminum.clone());
  headA.position.set(-0.8, 0.8, 0);
  headA.rotation.z = Math.PI / 6;
  headsG.add(headA);
  const headB = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 2.0), aluminum.clone());
  headB.position.set(0.8, 0.8, 0);
  headB.rotation.z = -Math.PI / 6;
  headsG.add(headB);
  group.add(headsG);
  parts.push({
    name: 'Cylinder Heads', description: 'Dual OHC heads.', material: 'Aluminum', function: 'Houses valves and cams', assemblyOrder: 5, connections: ['Engine Block'], failureEffect: 'Blown head gasket', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 6. Intake Manifold
  const intakeG = new THREE.Group();
  const intake = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.8), darkSteel.clone());
  intake.position.set(0, 1.2, 0);
  intakeG.add(intake);
  group.add(intakeG);
  parts.push({
    name: 'Intake Manifold', description: 'Central plenum.', material: 'Composite Plastic', function: 'Air delivery', assemblyOrder: 6, connections: ['Cylinder Heads'], failureEffect: 'Vacuum leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:4, z:0}
  });

  // 7. Exhaust Manifolds
  const exhaustG = new THREE.Group();
  const exA = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.0, 16), darkSteel.clone());
  exA.rotation.x = Math.PI / 2;
  exA.position.set(-1.4, 0.2, 0);
  exhaustG.add(exA);
  const exB = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.0, 16), darkSteel.clone());
  exB.rotation.x = Math.PI / 2;
  exB.position.set(1.4, 0.2, 0);
  exhaustG.add(exB);
  group.add(exhaustG);
  parts.push({
    name: 'Exhaust Manifolds', description: 'Short cast iron exhaust routing.', material: 'Cast Iron', function: 'Exhaust routing', assemblyOrder: 7, connections: ['Cylinder Heads'], failureEffect: 'Exhaust leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:3}
  });

  // 8. Oil Pan
  const panG = new THREE.Group();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 2.0), steel.clone());
  pan.position.set(0, -0.8, 0);
  panG.add(pan);
  group.add(panG);
  parts.push({
    name: 'Oil Pan', description: 'Deep sump.', material: 'Stamped Steel', function: 'Oil reservoir', assemblyOrder: 8, connections: ['Engine Block'], failureEffect: 'Oil leak', cascadeFailures: ['Crankshaft', 'Pistons'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 9. Water Pump
  const pumpG = new THREE.Group();
  const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), aluminum.clone());
  pump.rotation.x = Math.PI / 2;
  pump.position.set(0, 0, -1.1);
  pumpG.add(pump);
  group.add(pumpG);
  parts.push({
    name: 'Water Pump', description: 'Belt driven coolant pump.', material: 'Aluminum', function: 'Circulates coolant', assemblyOrder: 9, connections: ['Engine Block'], failureEffect: 'Overheating', cascadeFailures: ['Cylinder Heads'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:-3}
  });

  // 10. Flywheel
  const flyG = new THREE.Group();
  const fly = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32), steel.clone());
  fly.rotation.x = Math.PI / 2;
  fly.position.set(0, -0.5, 1.3);
  flyG.add(fly);
  group.add(flyG);
  parts.push({
    name: 'Flywheel', description: 'Heavy flywheel to damp V6 vibrations.', material: 'Steel', function: 'Momentum', assemblyOrder: 10, connections: ['Crankshaft'], failureEffect: 'Vibration', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:3}
  });

  const quizQuestions = [
    { question: 'Why are 60-degree bank angles preferred for V6 engines?', options: ['They fit better in trucks', 'They provide even 120-degree firing intervals without split crankpins', 'They are cheaper to cast', 'They can use V8 tooling'], correct: 1, explanation: 'A 60-degree V6 can have even firing intervals (720 / 6 = 120 degrees) inherently or with simple split crankpins, reducing vibration.', difficulty: 'expert' },
    { question: 'Why is a 90-degree V6 less smooth than a 60-degree V6?', options: ['It uses more fuel', 'It creates uneven firing intervals unless it uses offset split crankpins', 'It has more cylinders', 'It lacks a balance shaft'], correct: 1, explanation: '90-degree V6s are often derived from V8 designs to save tooling costs, but require heavily offset crankpins and balance shafts to run smoothly.', difficulty: 'advanced' },
    { question: 'A V6 engine is shorter than which of the following?', options: ['Flat-4', 'Inline-3', 'Inline-6', 'Rotary'], correct: 2, explanation: 'By arranging 6 cylinders in two banks of 3, the V6 is much shorter than an Inline-6, allowing it to be mounted transversely in front-wheel-drive cars.', difficulty: 'basic' },
    { question: 'Which component is commonly added to 90-degree V6s to reduce vibration?', options: ['Turbocharger', 'Balance shaft', 'Larger exhaust', 'Solid engine mounts'], correct: 1, explanation: 'A balance shaft spins in the opposite direction of the crankshaft to cancel out primary/secondary vibrations.', difficulty: 'advanced' },
    { question: 'What is a "split crankpin"?', options: ['A broken crankshaft', 'A pin shared by two opposing rods that is offset by several degrees', 'A two-piece crankshaft', 'A connecting rod modification'], correct: 1, explanation: 'To achieve even firing in V6 designs with non-optimal bank angles, the shared crankpin is split and offset by a specific angle.', difficulty: 'expert' },
    { question: 'Which configuration is considered perfectly balanced without balance shafts?', options: ['90-degree V6', '60-degree V6', 'Inline-6', 'V10'], correct: 2, explanation: 'Both V6s have secondary imbalances. Only the Inline-6 (and Flat-6/V12) are inherently balanced.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'A compact V6 internal combustion engine widely used in modern vehicles.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[1]) meshes[1].group.rotation.z = t * 10; 
      if (meshes[9]) meshes[9].group.rotation.z = t * 10; 
      if (meshes[8]) meshes[8].group.rotation.z = t * 10; 
      
      if (meshes[2]) {
        const pA = meshes[2].group;
        for(let i=0; i<3; i++) {
           pA.children[i].position.y = 0.4 + Math.sin(t*10 + i*2.09)*0.15;
           pA.children[i].position.x = -0.5 - Math.sin(t*10 + i*2.09)*0.08;
        }
      }
      if (meshes[3]) {
        const pB = meshes[3].group;
        for(let i=0; i<3; i++) {
           pB.children[i].position.y = 0.4 + Math.sin(t*10 + i*2.09 + 1.04)*0.15;
           pB.children[i].position.x = 0.5 + Math.sin(t*10 + i*2.09 + 1.04)*0.08;
        }
      }
    }
  };
}
