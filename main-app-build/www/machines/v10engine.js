import { steel, aluminum, castIron, darkSteel, redAccent, brass } from '../utils/materials.js';

export function createV10Engine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Engine Block
  const blockG = new THREE.Group();
  const block = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 3.2), aluminum.clone());
  block.position.y = 0;
  blockG.add(block);
  group.add(blockG);
  parts.push({
    name: 'Engine Block (V10)', description: 'V-shaped block with 10 cylinders. Usually 72-degree or 90-degree bank angle.', material: 'Cast Aluminum', function: 'Housing cylinders and crank', assemblyOrder: 1, connections: ['Crankshaft', 'Cylinder Heads'], failureEffect: 'Catastrophic engine failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Crankshaft
  const crankG = new THREE.Group();
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.8, 16), steel.clone());
  crank.rotation.x = Math.PI / 2;
  crank.position.y = -0.5;
  crankG.add(crank);
  group.add(crankG);
  parts.push({
    name: 'Crankshaft', description: 'Long 5-throw or 10-throw crankshaft depending on firing order and bank angle.', material: 'Forged Steel', function: 'Converts linear to rotary motion', assemblyOrder: 2, connections: ['Engine Block', 'Pistons'], failureEffect: 'Engine lockup', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2, z:0}
  });

  // 3. Pistons (Bank A)
  const pistAG = new THREE.Group();
  for (let i=0; i<5; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum.clone());
    p.position.set(-0.5, 0.4, -1.2 + i*0.6);
    p.rotation.z = Math.PI / 5; // 36 deg lean (72 deg V)
    pistAG.add(p);
  }
  group.add(pistAG);
  parts.push({
    name: 'Pistons (Bank A - 5 cyl)', description: 'Left bank pistons.', material: 'Forged Aluminum', function: 'Compresses fuel/air', assemblyOrder: 3, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-2, y:1, z:0}
  });

  // 4. Pistons (Bank B)
  const pistBG = new THREE.Group();
  for (let i=0; i<5; i++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum.clone());
    p.position.set(0.5, 0.4, -1.2 + i*0.6);
    p.rotation.z = -Math.PI / 5;
    pistBG.add(p);
  }
  group.add(pistBG);
  parts.push({
    name: 'Pistons (Bank B - 5 cyl)', description: 'Right bank pistons.', material: 'Forged Aluminum', function: 'Compresses fuel/air', assemblyOrder: 4, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:2, y:1, z:0}
  });

  // 5. Cylinder Heads
  const headsG = new THREE.Group();
  const headA = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 3.2), aluminum.clone());
  headA.position.set(-0.8, 0.8, 0);
  headA.rotation.z = Math.PI / 5;
  headsG.add(headA);
  const headB = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 3.2), aluminum.clone());
  headB.position.set(0.8, 0.8, 0);
  headB.rotation.z = -Math.PI / 5;
  headsG.add(headB);
  group.add(headsG);
  parts.push({
    name: 'Cylinder Heads', description: 'Massive DOHC heads for massive airflow.', material: 'Aluminum', function: 'Houses 40 or 50 valves', assemblyOrder: 5, connections: ['Engine Block'], failureEffect: 'Blown head gasket', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 6. Intake Manifold
  const intakeG = new THREE.Group();
  const intake = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 3.0), redAccent.clone());
  intake.position.set(0, 1.3, 0);
  intakeG.add(intake);
  group.add(intakeG);
  parts.push({
    name: 'Intake Manifold', description: 'Dual plenum or complex tuned runners.', material: 'Carbon Fiber / Aluminum', function: 'Air delivery', assemblyOrder: 6, connections: ['Cylinder Heads'], failureEffect: 'Vacuum leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:4, z:0}
  });

  // 7. Exhaust Manifolds
  const exhaustG = new THREE.Group();
  const exA = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.2, 16), darkSteel.clone());
  exA.rotation.x = Math.PI / 2;
  exA.position.set(-1.4, 0.2, 0);
  exhaustG.add(exA);
  const exB = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.2, 16), darkSteel.clone());
  exB.rotation.x = Math.PI / 2;
  exB.position.set(1.4, 0.2, 0);
  exhaustG.add(exB);
  group.add(exhaustG);
  parts.push({
    name: 'Exhaust Manifolds', description: '5-into-1 tubular headers (creates the legendary V10 wail).', material: 'Inconel / Stainless Steel', function: 'Exhaust routing', assemblyOrder: 7, connections: ['Cylinder Heads'], failureEffect: 'Exhaust leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:3}
  });

  // 8. Dry Sump Oil System
  const panG = new THREE.Group();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 3.2), steel.clone());
  pan.position.set(0, -0.7, 0);
  panG.add(pan);
  const pump = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), brass.clone());
  pump.position.set(0.5, -0.6, -1.8);
  panG.add(pump);
  group.add(panG);
  parts.push({
    name: 'Dry Sump Oil System', description: 'Shallow pan with scavenge pumps for high-G cornering.', material: 'Machined Aluminum', function: 'Oil lubrication', assemblyOrder: 8, connections: ['Engine Block'], failureEffect: 'Oil starvation', cascadeFailures: ['Crankshaft', 'Pistons'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 9. Throttle Bodies
  const tbG = new THREE.Group();
  for(let i=0; i<10; i++) {
    const tb = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16), brass.clone());
    tb.position.set(i<5?-0.4:0.4, 1.6, -1.2 + (i%5)*0.6);
    tbG.add(tb);
  }
  group.add(tbG);
  parts.push({
    name: 'Individual Throttle Bodies (ITBs)', description: 'One throttle valve per cylinder for instant response.', material: 'Aluminum/Brass', function: 'Airflow control', assemblyOrder: 9, connections: ['Intake Manifold'], failureEffect: 'Poor idle', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:0}
  });

  // 10. Flywheel
  const flyG = new THREE.Group();
  const fly = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32), steel.clone());
  fly.rotation.x = Math.PI / 2;
  fly.position.set(0, -0.5, 2.0);
  flyG.add(fly);
  group.add(flyG);
  parts.push({
    name: 'Lightweight Flywheel', description: 'Low inertia for rapid revving (like the Lexus LFA).', material: 'Chromoly Steel', function: 'Momentum', assemblyOrder: 10, connections: ['Crankshaft'], failureEffect: 'Vibration', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:4}
  });

  const quizQuestions = [
    { question: 'What bank angle provides even firing intervals in a V10 engine?', options: ['90 degrees', '60 degrees', '72 degrees', '180 degrees'], correct: 2, explanation: 'A four-stroke cycle is 720 degrees. 720 divided by 10 cylinders equals 72 degrees. A 72-degree V10 fires evenly without split crankpins.', difficulty: 'expert' },
    { question: 'Which supercar is famous for its F1-derived Yamaha-tuned V10 engine wail?', options: ['Dodge Viper', 'Lexus LFA', 'Bugatti Veyron', 'Chevrolet Corvette'], correct: 1, explanation: 'The Lexus LFA features a legendary 4.8L V10 co-developed with Yamaha that revs to 9,000 RPM in 0.6 seconds.', difficulty: 'basic' },
    { question: 'Why does the Dodge Viper use a 90-degree V10 instead of a 72-degree?', options: ['Because it sounds better', 'It was derived from a Chrysler V8 design to share tooling costs', 'To lower the center of gravity', '90-degree is inherently more balanced'], correct: 1, explanation: 'The Viper V10 was based on the LA V8 architecture. Using a 90-degree angle meant they could use existing factory tooling, despite it causing an uneven firing order and rougher idle.', difficulty: 'advanced' },
    { question: 'What is a distinct advantage of a V10 over a V12?', options: ['It is perfectly balanced', 'It is shorter and lighter, allowing it to sit further back in the chassis', 'It produces more torque', 'It has more cylinders'], correct: 1, explanation: 'A V10 is a compromise between the high-revving power of a V12 and the shorter packaging of a V8.', difficulty: 'advanced' },
    { question: 'What is the purpose of a dry sump oil system commonly found on V10 supercars?', options: ['To keep the engine warm', 'To prevent oil starvation during high-G cornering and lower the engine mounting height', 'To filter the oil better', 'To make oil changes faster'], correct: 1, explanation: 'A dry sump uses scavenge pumps to store oil in a separate tank, meaning the oil pan can be very shallow (lowering the engine) and oil won\'t slosh away from the pickup tube during cornering.', difficulty: 'advanced' },
    { question: 'What do Individual Throttle Bodies (ITBs) provide?', options: ['Better fuel economy', 'Sharper and more immediate throttle response', 'Lower emissions', 'Quieter operation'], correct: 1, explanation: 'By putting a throttle blade right at the intake port of each cylinder, the engine doesn\'t have to wait for a large plenum to fill with air, giving instantaneous response.', difficulty: 'expert' },
  ];

  return {
    group, parts, description: 'An exotic V10 engine known for its high-revving wail and immense power.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[1]) meshes[1].group.rotation.z = t * 10; 
      if (meshes[9]) meshes[9].group.rotation.z = t * 10; 
      
      // Fast piston animation
      if (meshes[2]) {
        const pA = meshes[2].group;
        for(let i=0; i<5; i++) {
           pA.children[i].position.y = 0.4 + Math.sin(t*10 + i*1.25)*0.15;
           pA.children[i].position.x = -0.5 - Math.sin(t*10 + i*1.25)*0.1;
        }
      }
      if (meshes[3]) {
        const pB = meshes[3].group;
        for(let i=0; i<5; i++) {
           pB.children[i].position.y = 0.4 + Math.sin(t*10 + i*1.25 + 0.62)*0.15;
           pB.children[i].position.x = 0.5 + Math.sin(t*10 + i*1.25 + 0.62)*0.1;
        }
      }
    }
  };
}
