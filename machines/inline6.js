import { steel, aluminum, castIron, darkSteel, redAccent, brass } from '../utils/materials.js';

export function createInline6Engine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Engine Block
  const blockG = new THREE.Group();
  const block = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 3.5), castIron.clone());
  block.position.y = 0;
  blockG.add(block);
  group.add(blockG);
  parts.push({
    name: 'Engine Block (I6)', description: 'Straight-6 cylinder block. Perfectly balanced primary and secondary forces.', material: 'Cast Iron', function: 'Housing cylinders', assemblyOrder: 1, connections: ['Crankshaft', 'Cylinder Head'], failureEffect: 'Catastrophic engine failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Crankshaft
  const crankG = new THREE.Group();
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4.0, 16), steel.clone());
  crank.rotation.x = Math.PI / 2;
  crank.position.y = -0.5;
  crankG.add(crank);
  group.add(crankG);
  parts.push({
    name: 'Crankshaft', description: 'Long straight-6 crankshaft with 120-degree throw spacing.', material: 'Forged Steel', function: 'Converts linear to rotary motion', assemblyOrder: 2, connections: ['Engine Block', 'Pistons'], failureEffect: 'Engine lockup', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2, z:0}
  });

  // 3. Pistons & Rods
  const pistG = new THREE.Group();
  for (let i=0; i<6; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum.clone());
    p.position.set(0, 0.5, -1.5 + i*0.6);
    pistG.add(p);
  }
  group.add(pistG);
  parts.push({
    name: 'Pistons (x6)', description: 'Six aluminum pistons moving in a perfectly balanced sequence.', material: 'Forged Aluminum', function: 'Compresses air/fuel mixture', assemblyOrder: 3, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:2, y:1, z:0}
  });

  // 4. Cylinder Head
  const headG = new THREE.Group();
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 3.5), aluminum.clone());
  head.position.set(0, 1.05, 0);
  headG.add(head);
  group.add(headG);
  parts.push({
    name: 'Cylinder Head', description: 'DOHC cylinder head spanning all 6 cylinders.', material: 'Aluminum', function: 'Houses valves and cams', assemblyOrder: 4, connections: ['Engine Block'], failureEffect: 'Blown head gasket', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 5. Intake Manifold
  const intakeG = new THREE.Group();
  const intake = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 3.2), darkSteel.clone());
  intake.position.set(-1.0, 1.0, 0);
  intakeG.add(intake);
  group.add(intakeG);
  parts.push({
    name: 'Intake Manifold', description: 'Long intake runners feeding 6 cylinders.', material: 'Cast Aluminum', function: 'Air delivery', assemblyOrder: 5, connections: ['Cylinder Head'], failureEffect: 'Vacuum leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-3, y:1, z:0}
  });

  // 6. Exhaust Header
  const exhaustG = new THREE.Group();
  const ex = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 3.2), darkSteel.clone());
  ex.position.set(0.9, 0.8, 0);
  exhaustG.add(ex);
  group.add(exhaustG);
  parts.push({
    name: 'Exhaust Header', description: '6-into-1 or 6-into-2 exhaust manifold.', material: 'Stainless Steel', function: 'Exhaust routing', assemblyOrder: 6, connections: ['Cylinder Head'], failureEffect: 'Exhaust leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:3, y:1, z:0}
  });

  // 7. Oil Pan
  const panG = new THREE.Group();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 3.5), steel.clone());
  pan.position.set(0, -1.0, 0);
  panG.add(pan);
  group.add(panG);
  parts.push({
    name: 'Oil Pan', description: 'Long oil sump.', material: 'Stamped Steel', function: 'Oil reservoir', assemblyOrder: 7, connections: ['Engine Block'], failureEffect: 'Oil leak', cascadeFailures: ['Crankshaft'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 8. Flywheel
  const flyG = new THREE.Group();
  const fly = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32), steel.clone());
  fly.rotation.x = Math.PI / 2;
  fly.position.set(0, -0.5, 2.0);
  flyG.add(fly);
  group.add(flyG);
  parts.push({
    name: 'Flywheel', description: 'Stores rotational energy.', material: 'Steel', function: 'Momentum', assemblyOrder: 8, connections: ['Crankshaft'], failureEffect: 'Vibration', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:3}
  });

  // 9. Camshafts
  const camsG = new THREE.Group();
  const cam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.6, 16), steel.clone());
  cam1.rotation.x = Math.PI / 2;
  cam1.position.set(-0.3, 1.5, 0);
  camsG.add(cam1);
  const cam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.6, 16), steel.clone());
  cam2.rotation.x = Math.PI / 2;
  cam2.position.set(0.3, 1.5, 0);
  camsG.add(cam2);
  group.add(camsG);
  parts.push({
    name: 'Camshafts', description: 'Dual overhead camshafts.', material: 'Hardened Steel', function: 'Valve timing', assemblyOrder: 9, connections: ['Cylinder Head'], failureEffect: 'Bent valves', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:4, z:0}
  });

  // 10. Timing Belt/Chain
  const timingG = new THREE.Group();
  const timing = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.0, 0.1), rubber.clone());
  timing.position.set(0, 0.5, -1.8);
  timingG.add(timing);
  group.add(timingG);
  parts.push({
    name: 'Timing Belt', description: 'Connects crank to cams.', material: 'Kevlar/Rubber', function: 'Synchronization', assemblyOrder: 10, connections: ['Crankshaft', 'Camshafts'], failureEffect: 'Engine dies instantly', cascadeFailures: ['Camshafts'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:-3}
  });

  const quizQuestions = [
    { question: 'Why is an Inline-6 engine inherently balanced?', options: ['It has a short crankshaft', 'Primary and secondary forces perfectly cancel each other out', 'It has less moving parts than a V8', 'It uses a flat-plane crank'], correct: 1, explanation: 'The mirror-image movement of pistons 1-6, 2-5, and 3-4 causes all primary and secondary rocking couples to naturally balance out.', difficulty: 'advanced' },
    { question: 'What is a common disadvantage of an Inline-6 compared to a V6?', options: ['It vibrates more', 'It is much longer, making it harder to fit in modern cars', 'It has fewer valves', 'It is less fuel efficient'], correct: 1, explanation: 'Because all 6 cylinders are in a row, the engine is very long, requiring a long engine bay and limiting its use in front-wheel-drive transverse layouts.', difficulty: 'basic' },
    { question: 'What is the typical firing order of an Inline-6?', options: ['1-5-3-6-2-4', '1-2-3-4-5-6', '1-6-2-5-3-4', '1-4-3-2-5-6'], correct: 0, explanation: '1-5-3-6-2-4 is the most common firing order to evenly distribute power pulses along the long crankshaft.', difficulty: 'expert' },
    { question: 'What does DOHC stand for?', options: ['Dual Overhead Cam', 'Direct Overhead Combustion', 'Double Overhung Crank', 'Driven Overhead Cam'], correct: 0, explanation: 'Dual Overhead Cam means two camshafts (one for intake, one for exhaust) sit on top of the cylinder head.', difficulty: 'basic' },
    { question: 'Which famous engine series is an Inline-6?', options: ['Chevy LS', 'Toyota 2JZ', 'Ford Coyote', 'Honda K20'], correct: 1, explanation: 'The Toyota 2JZ and Nissan RB26 are legendary Japanese Inline-6 engines known for massive power potential.', difficulty: 'basic' },
    { question: 'What happens if the timing belt breaks on an interference engine?', options: ['The engine stops safely', 'Valves remain open and are struck by the rising pistons, causing catastrophic damage', 'The car drives backwards', 'Only the water pump fails'], correct: 1, explanation: 'In an interference design, the piston and valves occupy the same physical space at different times. If synchronization is lost, they collide.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'An Inline-6 internal combustion engine known for perfect natural balance.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[1]) meshes[1].group.rotation.z = t * 10; // crank
      if (meshes[8]) meshes[8].group.rotation.z = t * 10; // flywheel
      // Piston animation based on 120-degree crank throws
      if (meshes[2]) {
        const pGroup = meshes[2].group;
        pGroup.children[0].position.y = 0.5 + Math.sin(t*10)*0.2; // Cyl 1
        pGroup.children[5].position.y = 0.5 + Math.sin(t*10)*0.2; // Cyl 6
        pGroup.children[1].position.y = 0.5 + Math.sin(t*10 + 2.09)*0.2; // Cyl 2 (120 deg)
        pGroup.children[4].position.y = 0.5 + Math.sin(t*10 + 2.09)*0.2; // Cyl 5
        pGroup.children[2].position.y = 0.5 + Math.sin(t*10 + 4.18)*0.2; // Cyl 3 (240 deg)
        pGroup.children[3].position.y = 0.5 + Math.sin(t*10 + 4.18)*0.2; // Cyl 4
      }
      if (meshes[9]) meshes[9].group.rotation.z = t * 5; // cams half speed
    }
  };
}
