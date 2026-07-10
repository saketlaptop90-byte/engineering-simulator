// ═══════════════════════════════════════════════════════════════════
// Ceiling Fan
// ═══════════════════════════════════════════════════════════════════
import { aluminum, darkSteel, steel, brass, rubber, plastic, whitePlastic, chrome, tinted } from '../utils/materials.js';

export function createFan(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Canopy
  const canopyG = new THREE.Group();
  const canopyDome = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI*2, 0, Math.PI/2), whitePlastic.clone());
  canopyDome.position.y = 3.5;
  canopyG.add(canopyDome);
  const canopyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.1, 16), whitePlastic.clone());
  canopyBase.position.y = 3.45;
  canopyG.add(canopyBase);
  group.add(canopyG);
  parts.push({ name: 'Canopy', description: 'Decorative cover at ceiling mount point. Conceals wiring junction box and mounting bracket.', material: 'ABS Plastic', function: 'Cover ceiling mount & wiring', assemblyOrder: 1, connections: ['Down Rod'], failureEffect: 'Exposed wiring, cosmetic issue', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:2,z:0} });

  // 2. Down Rod
  const rodG = new THREE.Group();
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 12), chrome.clone());
  rod.position.y = 2.4;
  rodG.add(rod);
  group.add(rodG);
  parts.push({ name: 'Down Rod', description: 'Connects motor housing to ceiling mount. Length determines fan height below ceiling.', material: 'Chrome-plated Steel', function: 'Suspend motor from ceiling', assemblyOrder: 2, connections: ['Canopy', 'Motor Housing'], failureEffect: 'Fan detachment risk — dangerous', cascadeFailures: ['Motor Housing', 'Fan Blades'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:4,z:0} });

  // 3. Motor Housing
  const motorG = new THREE.Group();
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 0.6, 24), aluminum.clone());
  housing.position.y = 1.3;
  motorG.add(housing);
  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 0.1, 24), tinted(aluminum, 0xb0bcc8));
  topCap.position.y = 1.65;
  motorG.add(topCap);
  const bottomCap = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 12, 0, Math.PI*2, Math.PI/2, Math.PI/2), tinted(aluminum, 0xa0aeb8));
  bottomCap.position.y = 0.98;
  motorG.add(bottomCap);
  group.add(motorG);
  parts.push({ name: 'Motor Housing', description: 'Encases the electric motor. Die-cast for heat dissipation. Contains stator windings and rotor assembly.', material: 'Die-cast Aluminum', function: 'Enclose and protect motor', assemblyOrder: 3, connections: ['Down Rod', 'Fan Blades', 'Capacitor', 'Bearings'], failureEffect: 'Motor exposed, overheating, imbalance', cascadeFailures: ['Bearings', 'Capacitor'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:0} });

  // 4. Fan Blades
  const bladesG = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.35), tinted(plastic, 0x5c4033));
    blade.position.set(Math.sin(a) * 1.2, 1.2, Math.cos(a) * 1.2);
    blade.rotation.y = -a;
    blade.rotation.z = 0.08;
    bladesG.add(blade);
  }
  bladesG.userData.rotates = true;
  group.add(bladesG);
  parts.push({ name: 'Fan Blades', description: 'Aerodynamically pitched blades that move air downward (or upward in reverse). Pitch angle determines airflow volume.', material: 'Plywood / ABS Plastic', function: 'Generate airflow', assemblyOrder: 6, connections: ['Blade Arms', 'Motor Housing'], failureEffect: 'Reduced airflow, wobbling, noise', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-2,z:0} });

  // 5. Blade Arms (Iron)
  const armsG = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.06), steel.clone());
    arm.position.set(Math.sin(a) * 0.55, 1.15, Math.cos(a) * 0.55);
    arm.rotation.y = -a;
    armsG.add(arm);
  }
  armsG.userData.rotates = true;
  group.add(armsG);
  parts.push({ name: 'Blade Arms', description: 'Metal brackets connecting each blade to the motor hub. Allow blade angle adjustment.', material: 'Stamped Steel', function: 'Mount blades to motor', assemblyOrder: 5, connections: ['Fan Blades', 'Motor Housing'], failureEffect: 'Blade detachment — dangerous projectile risk', cascadeFailures: ['Fan Blades'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-3,z:2} });

  // 6. Capacitor
  const capG = new THREE.Group();
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12), tinted(plastic, 0x334455));
  cap.position.set(0.2, 1.3, 0.2);
  capG.add(cap);
  const capWire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6), brass.clone());
  capWire1.position.set(0.18, 1.47, 0.2);
  capG.add(capWire1);
  const capWire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6), brass.clone());
  capWire2.position.set(0.22, 1.47, 0.2);
  capG.add(capWire2);
  group.add(capG);
  parts.push({ name: 'Capacitor', description: 'Creates phase shift in single-phase motor to generate rotating magnetic field. Value (µF) affects speed and torque.', material: 'Metalized Polypropylene', function: 'Phase shift for motor starting/running', assemblyOrder: 4, connections: ['Motor Housing'], failureEffect: 'Fan won\'t start, hums but doesn\'t rotate, overheating', cascadeFailures: ['Motor Housing'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:2,z:2} });

  // 7. Bearings
  const bearG = new THREE.Group();
  const b1 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 12, 24), chrome.clone());
  b1.rotation.x = Math.PI / 2;
  b1.position.y = 1.55;
  bearG.add(b1);
  const b2 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 12, 24), chrome.clone());
  b2.rotation.x = Math.PI / 2;
  b2.position.y = 1.05;
  bearG.add(b2);
  group.add(bearG);
  parts.push({ name: 'Bearings', description: 'Ball bearings supporting the rotor shaft. Sealed and pre-lubricated for maintenance-free operation.', material: 'Chrome Steel', function: 'Low-friction shaft support', assemblyOrder: 7, connections: ['Motor Housing'], failureEffect: 'Grinding noise, wobble, eventual seizure', cascadeFailures: ['Motor Housing'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:0,z:-2} });

  // 8. Light Kit
  const lightG = new THREE.Group();
  const lightBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.2, 16), whitePlastic.clone());
  lightBody.position.y = 0.7;
  lightG.add(lightBody);
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), tinted(whitePlastic, 0xffffee));
  globe.material.transparent = true; globe.material.opacity = 0.6;
  globe.position.y = 0.5;
  lightG.add(globe);
  group.add(lightG);
  parts.push({ name: 'Light Kit', description: 'Optional lighting attachment below motor housing. Contains bulb socket and decorative glass globe.', material: 'Glass / Plastic', function: 'Provide room illumination', assemblyOrder: 8, connections: ['Motor Housing'], failureEffect: 'No light, purely cosmetic failure', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-4,z:0} });

  const quizQuestions = [
    { question: 'What is the role of the capacitor in a ceiling fan?', options: ['Store energy for power outage', 'Create phase shift to start/run the motor', 'Regulate voltage', 'Filter noise'], correct: 1, explanation: 'The capacitor creates a phase difference between windings, producing a rotating magnetic field needed to start and run a single-phase motor.', difficulty: 'advanced' },
    { question: 'What causes a ceiling fan to wobble?', options: ['High voltage', 'Unbalanced blades or bent blade arms', 'Wrong capacitor value', 'Poor paint quality'], correct: 1, explanation: 'Wobbling is caused by blade imbalance due to unequal weight, warped blades, or bent blade arms.', difficulty: 'basic' },
    { question: 'If a ceiling fan hums but doesn\'t spin, the likely cause is:', options: ['Broken blade', 'Failed capacitor', 'Burnt light bulb', 'Loose canopy'], correct: 1, explanation: 'A humming motor that won\'t start typically indicates a failed capacitor — the motor cannot create a rotating field.', difficulty: 'basic' },
    { question: 'How does reversing blade direction help in winter?', options: ['Cools faster', 'Pushes warm air from ceiling down via updraft', 'Saves electricity', 'Reduces noise'], correct: 1, explanation: 'In reverse, blades create an updraft that pushes warm ceiling air down the walls, improving heating efficiency.', difficulty: 'advanced' },
    { question: 'What determines the airflow (CFM) of a ceiling fan?', options: ['Wire thickness', 'Blade pitch angle, RPM, and blade area', 'Canopy size', 'Down rod length'], correct: 1, explanation: 'CFM depends on blade pitch (angle of attack), rotational speed (RPM), and the swept area of the blades.', difficulty: 'expert' },
    { question: 'A ceiling fan with a 14° blade pitch will move ___ air than one with 12°.', options: ['Less', 'More', 'Same amount of', 'It depends on color'], correct: 1, explanation: 'Higher blade pitch angles move more air per revolution, though they require more torque from the motor.', difficulty: 'expert' },
  ];

  return {
    group, parts, description: 'A ceiling-mounted rotary fan using an electric motor to circulate room air. Features 5 pitched blades, capacitor-start motor, and optional light kit.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed * 3;
      if (meshes[3]) meshes[3].group.rotation.y = t; // blades
      if (meshes[4]) meshes[4].group.rotation.y = t; // arms
    }
  };
}
