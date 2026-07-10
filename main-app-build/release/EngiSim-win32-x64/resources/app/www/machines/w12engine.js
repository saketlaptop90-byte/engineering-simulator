import { steel, aluminum, castIron, darkSteel, redAccent, brass } from '../utils/materials.js';

export function createW12Engine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Engine Block
  const blockG = new THREE.Group();
  const block = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 3.5), castIron.clone());
  block.position.y = 0;
  blockG.add(block);
  group.add(blockG);
  parts.push({
    name: 'W12 Engine Block', description: 'Four banks of 3 cylinders. Essentially two narrow-angle VR6 engines joined at a 72-degree angle.', material: 'Cast Aluminum', function: 'Housing 12 cylinders compactly', assemblyOrder: 1, connections: ['Crankshaft', 'Cylinder Heads'], failureEffect: 'Catastrophic engine failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Crankshaft
  const crankG = new THREE.Group();
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4.0, 16), steel.clone());
  crank.rotation.x = Math.PI / 2;
  crank.position.y = -0.5;
  crankG.add(crank);
  group.add(crankG);
  parts.push({
    name: 'Crankshaft', description: 'Very short 6-throw crankshaft (much shorter than a V12).', material: 'Forged Steel', function: 'Converts linear to rotary motion', assemblyOrder: 2, connections: ['Engine Block', 'Pistons'], failureEffect: 'Engine lockup', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2, z:0}
  });

  // 3. Pistons (All 4 Banks together in one group to match 1 part)
  const pistAllG = new THREE.Group();
  
  function createPistonsIntoGroup(xOffset, leanAngle, zOffset) {
    for (let i=0; i<3; i++) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum.clone());
      p.position.set(xOffset, 0.5, zOffset + i*1.2);
      p.rotation.z = leanAngle;
      pistAllG.add(p);
    }
  }

  createPistonsIntoGroup(-0.8, Math.PI/4, -1.2); // Bank 1
  createPistonsIntoGroup(-0.4, Math.PI/6, -0.6); // Bank 2
  createPistonsIntoGroup(0.4, -Math.PI/6, -1.2); // Bank 3
  createPistonsIntoGroup(0.8, -Math.PI/4, -0.6); // Bank 4

  group.add(pistAllG);
  parts.push({
    name: 'Pistons (4 Banks)', description: '12 pistons arranged in 4 offset rows to save length.', material: 'Forged Aluminum', function: 'Compresses fuel/air', assemblyOrder: 3, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 4. Cylinder Heads
  const headsG = new THREE.Group();
  const headL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 3.5), aluminum.clone());
  headL.position.set(-0.8, 1.0, 0);
  headL.rotation.z = Math.PI/5.1; 
  headsG.add(headL);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 3.5), aluminum.clone());
  headR.position.set(0.8, 1.0, 0);
  headR.rotation.z = -Math.PI/5.1;
  headsG.add(headR);
  group.add(headsG);
  parts.push({
    name: 'Cylinder Heads (VR style)', description: 'Two massive heads, each covering two staggered banks of cylinders.', material: 'Aluminum', function: 'Valvetrain housing', assemblyOrder: 4, connections: ['Engine Block'], failureEffect: 'Blown head gasket', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3.5, z:0}
  });

  // 5. Twin Turbochargers
  const turboG = new THREE.Group();
  const turboL = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), steel.clone());
  turboL.position.set(-1.6, -0.2, 1.0);
  turboG.add(turboL);
  const turboR = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), steel.clone());
  turboR.position.set(1.6, -0.2, 1.0);
  turboG.add(turboR);
  group.add(turboG);
  parts.push({
    name: 'Twin Turbochargers', description: 'Dual exhaust-driven compressors for massive torque.', material: 'Cast Iron / Aluminum', function: 'Forced induction', assemblyOrder: 5, connections: ['Exhaust Manifolds'], failureEffect: 'Boost leak / turbo failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:3}
  });

  // 6. Intake Manifold
  const intakeG = new THREE.Group();
  const intake = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 3.2), redAccent.clone());
  intake.position.set(0, 1.6, 0);
  intakeG.add(intake);
  group.add(intakeG);
  parts.push({
    name: 'Intake Manifold', description: 'Massive central plenum feeding all 12 cylinders.', material: 'Cast Aluminum', function: 'Air delivery', assemblyOrder: 6, connections: ['Cylinder Heads'], failureEffect: 'Vacuum leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:0}
  });

  // 7. Oil Pan
  const panG = new THREE.Group();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 3.5), steel.clone());
  pan.position.set(0, -0.8, 0);
  panG.add(pan);
  group.add(panG);
  parts.push({
    name: 'Oil Pan', description: 'Deep sump to hold massive oil capacity.', material: 'Stamped Steel', function: 'Oil reservoir', assemblyOrder: 7, connections: ['Engine Block'], failureEffect: 'Oil leak', cascadeFailures: ['Crankshaft', 'Pistons'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  const quizQuestions = [
    { question: 'What is the primary advantage of a W12 engine over a V12 engine?', options: ['It produces more horsepower naturally', 'It is significantly shorter and more compact', 'It uses less fuel', 'It is inherently perfectly balanced'], correct: 1, explanation: 'The W12 is essentially two VR6 engines mated together, making it much shorter than a long V12, allowing it to fit into cars originally designed for V8s.', difficulty: 'expert' },
    { question: 'A W12 engine has how many cylinder banks?', options: ['2', '3', '4', '12'], correct: 2, explanation: 'It has 4 banks of 3 cylinders. Two narrow-angle VR6 blocks joined at a wider angle.', difficulty: 'advanced' },
    { question: 'Which manufacturer group famously developed and popularized the W12 engine?', options: ['General Motors', 'Volkswagen Group (Bentley, Audi, VW)', 'Ferrari', 'BMW'], correct: 1, explanation: 'VW Group used the W12 in the VW Phaeton, Audi A8, and extensively in Bentley Continental models.', difficulty: 'basic' },
    { question: 'Because of its compact W shape, what must the cylinder head design accommodate?', options: ['No camshafts', 'Two staggered rows of cylinders sharing a single cylinder head', 'Air cooling fins', 'Spark plugs located in the oil pan'], correct: 1, explanation: 'Like a VR6, the incredibly narrow 15-degree angle between the cylinders in each sub-block allows two staggered rows of cylinders to be covered by one single, massive cylinder head.', difficulty: 'expert' },
    { question: 'What is the main disadvantage of the W configuration?', options: ['It is too long', 'Massive thermal heat issues and extreme complexity', 'It can only be air-cooled', 'It has low torque'], correct: 1, explanation: 'Packing 12 cylinders into such a tight block generates immense heat, requiring massive cooling systems, and making the engine extremely complex to service.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'A compact and complex W12 engine featuring 4 cylinder banks.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[1]) meshes[1].group.rotation.z = t * 10; // crank
      if (meshes[4]) { // turbos
         meshes[4].group.children[0].rotation.z = t * 30;
         meshes[4].group.children[1].rotation.z = t * 30;
      }
      
      // Pistons
      if (meshes[2]) {
        const pG = meshes[2].group;
        // First 3 (Bank 1)
        for(let i=0; i<3; i++) {
           pG.children[i].position.y = 0.5 + Math.sin(t*10 + i)*0.15;
           pG.children[i].position.x = -0.8 - Math.sin(t*10 + i)*0.1;
        }
        // Next 3 (Bank 2)
        for(let i=3; i<6; i++) {
           pG.children[i].position.y = 0.5 + Math.sin(t*10 + i + 1.5)*0.15;
           pG.children[i].position.x = -0.4 - Math.sin(t*10 + i + 1.5)*0.05;
        }
        // Next 3 (Bank 3)
        for(let i=6; i<9; i++) {
           pG.children[i].position.y = 0.5 + Math.sin(t*10 + i + 3.0)*0.15;
           pG.children[i].position.x = 0.4 + Math.sin(t*10 + i + 3.0)*0.05;
        }
        // Next 3 (Bank 4)
        for(let i=9; i<12; i++) {
           pG.children[i].position.y = 0.5 + Math.sin(t*10 + i + 4.5)*0.15;
           pG.children[i].position.x = 0.8 + Math.sin(t*10 + i + 4.5)*0.1;
        }
      }
    }
  };
}
