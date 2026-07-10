import { steel, aluminum, castIron, darkSteel, redAccent, brass } from '../utils/materials.js';

export function createW16Engine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Engine Block
  const blockG = new THREE.Group();
  const block = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 4.5), aluminum.clone());
  block.position.y = 0;
  blockG.add(block);
  group.add(blockG);
  parts.push({
    name: 'W16 Engine Block', description: 'Massive block housing 16 cylinders. Two narrow-angle VR8 banks joined at 90 degrees.', material: 'Forged Aluminum', function: 'Housing 16 cylinders', assemblyOrder: 1, connections: ['Crankshaft', 'Cylinder Heads'], failureEffect: 'Catastrophic engine failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Crankshaft
  const crankG = new THREE.Group();
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5.0, 16), steel.clone());
  crank.rotation.x = Math.PI / 2;
  crank.position.y = -0.5;
  crankG.add(crank);
  group.add(crankG);
  parts.push({
    name: 'Crankshaft', description: 'Titanium-forged 8-throw crankshaft supporting 16 connecting rods.', material: 'Titanium / Steel', function: 'Converts linear to rotary motion', assemblyOrder: 2, connections: ['Engine Block', 'Pistons'], failureEffect: 'Engine lockup', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2, z:0}
  });

  // 3. Pistons (16 Pistons in 4 banks)
  const pistAllG = new THREE.Group();
  
  function createPistonsIntoGroup(xOffset, leanAngle, zOffset) {
    for (let i=0; i<4; i++) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum.clone());
      p.position.set(xOffset, 0.6, zOffset + i*1.1);
      p.rotation.z = leanAngle;
      pistAllG.add(p);
    }
  }

  createPistonsIntoGroup(-1.0, Math.PI/4, -1.65); // Bank 1
  createPistonsIntoGroup(-0.5, Math.PI/6, -1.1); // Bank 2
  createPistonsIntoGroup(0.5, -Math.PI/6, -1.65); // Bank 3
  createPistonsIntoGroup(1.0, -Math.PI/4, -1.1); // Bank 4

  group.add(pistAllG);
  parts.push({
    name: 'Pistons (16 total)', description: '16 forged pistons. Moving in complex staggered sequences to output over 1500 HP.', material: 'Forged Aluminum', function: 'Compresses fuel/air', assemblyOrder: 3, connections: ['Crankshaft'], failureEffect: 'Loss of compression', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 4. Cylinder Heads
  const headsG = new THREE.Group();
  const headL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 4.5), aluminum.clone());
  headL.position.set(-1.0, 1.2, 0);
  headL.rotation.z = Math.PI/5.1; 
  headsG.add(headL);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 4.5), aluminum.clone());
  headR.position.set(1.0, 1.2, 0);
  headR.rotation.z = -Math.PI/5.1;
  headsG.add(headR);
  group.add(headsG);
  parts.push({
    name: 'Cylinder Heads (VR8 style)', description: 'Two immense cylinder heads housing 64 total valves (4 per cylinder).', material: 'Aluminum', function: 'Valvetrain housing', assemblyOrder: 4, connections: ['Engine Block'], failureEffect: 'Blown head gasket', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:4, z:0}
  });

  // 5. Quad Turbochargers
  const turboG = new THREE.Group();
  // Left side turbos
  const turboL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16), darkSteel.clone());
  turboL1.position.set(-2.0, -0.2, 1.2);
  turboG.add(turboL1);
  const turboL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16), darkSteel.clone());
  turboL2.position.set(-2.0, -0.2, -1.2);
  turboG.add(turboL2);
  // Right side turbos
  const turboR1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16), darkSteel.clone());
  turboR1.position.set(2.0, -0.2, 1.2);
  turboG.add(turboR1);
  const turboR2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16), darkSteel.clone());
  turboR2.position.set(2.0, -0.2, -1.2);
  turboG.add(turboR2);

  group.add(turboG);
  parts.push({
    name: 'Quad Turbochargers', description: 'Four massive turbochargers arranged in a two-stage sequential setup.', material: 'Inconel / Steel', function: 'Forced induction (Boost)', assemblyOrder: 5, connections: ['Exhaust Manifolds', 'Intercoolers'], failureEffect: 'Severe power loss', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:4}
  });

  // 6. Charge Air Coolers (Intercoolers)
  const icG = new THREE.Group();
  const icL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 3.5), steel.clone());
  icL.position.set(-1.8, 1.5, 0);
  icG.add(icL);
  const icR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 3.5), steel.clone());
  icR.position.set(1.8, 1.5, 0);
  icG.add(icR);
  group.add(icG);
  parts.push({
    name: 'Intercoolers', description: 'Water-to-air charge coolers lowering intake temperatures by 100+ degrees.', material: 'Aluminum', function: 'Cooling compressed air', assemblyOrder: 6, connections: ['Twin Turbochargers'], failureEffect: 'Overheating / Detonation', cascadeFailures: ['Engine Block'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:3}
  });

  // 7. Intake Manifold Plenums
  const intakeG = new THREE.Group();
  const intakeL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 4.0), redAccent.clone());
  intakeL.position.set(-0.6, 1.8, 0);
  intakeG.add(intakeL);
  const intakeR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 4.0), redAccent.clone());
  intakeR.position.set(0.6, 1.8, 0);
  intakeG.add(intakeR);
  group.add(intakeG);
  parts.push({
    name: 'Intake Plenums', description: 'Dual high-flow intake plenums feeding the 64 valves.', material: 'Carbon Fiber / Aluminum', function: 'Air delivery', assemblyOrder: 7, connections: ['Cylinder Heads'], failureEffect: 'Vacuum leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:0}
  });

  // 8. Dry Sump & Oil Pump System
  const panG = new THREE.Group();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 4.5), steel.clone());
  pan.position.set(0, -0.9, 0);
  panG.add(pan);
  group.add(panG);
  parts.push({
    name: 'Dry Sump Pan & Pumps', description: 'Circulates over 15 liters of oil. Required to lubricate 16 cylinders and 4 turbos.', material: 'Aluminum', function: 'Oil reservoir / Pumping', assemblyOrder: 8, connections: ['Engine Block'], failureEffect: 'Oil starvation', cascadeFailures: ['Crankshaft', 'Pistons'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-4, z:0}
  });

  const quizQuestions = [
    { question: 'The Bugatti W16 engine is famous for having how many turbochargers?', options: ['2', '4', '6', '16'], correct: 1, explanation: 'The W16 features a Quad-Turbo setup to force massive amounts of air into the 16 cylinders, producing over 1500 horsepower.', difficulty: 'basic' },
    { question: 'A W16 engine contains how many total valves?', options: ['16', '32', '64', '128'], correct: 2, explanation: '16 cylinders multiplied by 4 valves per cylinder (2 intake, 2 exhaust) equals 64 valves.', difficulty: 'basic' },
    { question: 'Why does the Bugatti W16 require such a massive cooling system (up to 10 radiators)?', options: ['The oil runs colder than normal', 'Generating 1500 HP of kinetic energy also creates around 3000 HP of waste heat energy', 'Because it has 4 turbos that freeze the engine', 'To add weight for traction'], correct: 1, explanation: 'Internal combustion engines are about 30% thermally efficient. If it makes 1500HP to the wheels, it makes twice that amount in pure heat that must be dissipated.', difficulty: 'expert' },
    { question: 'What is the configuration of the Bugatti W16?', options: ['Four rows of four cylinders', 'Two V8s bolted end-to-end', 'Two narrow-angle VR8s joined at 90 degrees', 'A massive straight-16 folded in half'], correct: 2, explanation: 'Like the W12, the W16 is created by taking two VR-style blocks (VR8s in this case, meaning staggered cylinders under a single head) and joining them to a common crank at 90 degrees.', difficulty: 'advanced' },
    { question: 'At top speed, the Bugatti Veyron\'s W16 engine will empty its 100-liter fuel tank in approximately:', options: ['12 hours', '2 hours', '12 minutes', '3 minutes'], correct: 2, explanation: 'At maximum load, the 16 cylinders consume air and fuel at such a ferocious rate that the 100L tank drains in about 12-15 minutes.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'The pinnacle of combustion engineering. An 8.0L Quad-Turbo W16 producing 1500+ HP.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[1]) meshes[1].group.rotation.z = t * 10; 
      if (meshes[4]) { // turbos
         meshes[4].group.children[0].rotation.z = t * 40;
         meshes[4].group.children[1].rotation.z = t * 40;
         meshes[4].group.children[2].rotation.z = t * 40;
         meshes[4].group.children[3].rotation.z = t * 40;
      }
      
      // Pistons
      if (meshes[2]) {
        const pG = meshes[2].group;
        for(let i=0; i<4; i++) {
           pG.children[i].position.y = 0.6 + Math.sin(t*10 + i)*0.15;
           pG.children[i].position.x = -1.0 - Math.sin(t*10 + i)*0.1;
        }
        for(let i=4; i<8; i++) {
           pG.children[i].position.y = 0.6 + Math.sin(t*10 + i + 1.5)*0.15;
           pG.children[i].position.x = -0.5 - Math.sin(t*10 + i + 1.5)*0.05;
        }
        for(let i=8; i<12; i++) {
           pG.children[i].position.y = 0.6 + Math.sin(t*10 + i + 3.0)*0.15;
           pG.children[i].position.x = 0.5 + Math.sin(t*10 + i + 3.0)*0.05;
        }
        for(let i=12; i<16; i++) {
           pG.children[i].position.y = 0.6 + Math.sin(t*10 + i + 4.5)*0.15;
           pG.children[i].position.x = 1.0 + Math.sin(t*10 + i + 4.5)*0.1;
        }
      }
    }
  };
}
