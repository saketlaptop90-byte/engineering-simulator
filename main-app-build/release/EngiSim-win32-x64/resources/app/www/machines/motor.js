// ═══════════════════════════════════════════════════════════════════
// Electric Motor (DC Brushed)
// ═══════════════════════════════════════════════════════════════════
import { steel, aluminum, copper, darkSteel, rubber, plastic, brass, chrome, wireCoil, tinted } from '../utils/materials.js';

export function createMotor(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // ─── 1. Housing / Stator Shell ───
  const housingG = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.8, 32, 1, true), aluminum.clone());
  shell.rotation.z = Math.PI / 2;
  housingG.add(shell);
  // Cooling fins
  for (let i = 0; i < 12; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, 2.6), aluminum.clone());
    const a = (i / 12) * Math.PI * 2;
    fin.position.set(0, Math.sin(a) * 1.25, Math.cos(a) * 1.25);
    fin.rotation.x = a;
    housingG.add(fin);
  }
  // Mounting feet
  for (let s of [-0.8, 0.8]) {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.8), darkSteel.clone());
    foot.position.set(s, -1.3, 0);
    housingG.add(foot);
  }
  group.add(housingG);
  parts.push({ name: 'Stator Housing', description: 'Outer cylindrical shell providing structural support and magnetic flux path. Cooling fins increase surface area for heat dissipation.', material: 'Cast Aluminum', function: 'Structural support, magnetic circuit, cooling', assemblyOrder: 1, connections: ['Stator Core', 'End Bells'], failureEffect: 'Loss of structural integrity, overheating', cascadeFailures: ['Stator Core', 'Bearings'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:0,z:0} });

  // ─── 2. Stator Core ───
  const statorG = new THREE.Group();
  const statorCore = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 2.4, 32, 1, true), darkSteel.clone());
  statorCore.rotation.z = Math.PI / 2;
  statorG.add(statorCore);
  // Slots
  for (let i = 0; i < 8; i++) {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 2.2), tinted(darkSteel, 0x444455));
    const a = (i / 8) * Math.PI * 2;
    slot.position.set(0, Math.sin(a) * 0.9, Math.cos(a) * 0.9);
    slot.rotation.x = a;
    statorG.add(slot);
  }
  group.add(statorG);
  parts.push({ name: 'Stator Core', description: 'Laminated iron core providing magnetic flux path. Laminations reduce eddy current losses.', material: 'Silicon Steel Laminations', function: 'Magnetic flux path for field generation', assemblyOrder: 2, connections: ['Stator Housing', 'Stator Windings'], failureEffect: 'Reduced magnetic flux, loss of torque, overheating', cascadeFailures: ['Stator Windings'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:0,z:3} });

  // ─── 3. Stator Windings ───
  const windingsG = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 8, 16), wireCoil.clone());
    const a = (i / 4) * Math.PI * 2;
    coil.position.set(0, Math.sin(a) * 0.75, Math.cos(a) * 0.75);
    coil.rotation.y = Math.PI / 2;
    coil.rotation.z = a;
    windingsG.add(coil);
  }
  group.add(windingsG);
  parts.push({ name: 'Stator Windings', description: 'Copper wire coils wound around stator poles. Create magnetic field when current flows. Wire gauge and turn count determine motor characteristics.', material: 'Enameled Copper Wire', function: 'Generate stationary magnetic field', assemblyOrder: 3, connections: ['Stator Core', 'Terminal Box'], failureEffect: 'Short circuit, loss of field, motor burns out', cascadeFailures: ['Rotor'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:0,z:4.5} });

  // ─── 4. Rotor ───
  const rotorG = new THREE.Group();
  const rotorCore = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.2, 24), darkSteel.clone());
  rotorCore.rotation.z = Math.PI / 2;
  rotorG.add(rotorCore);
  // Rotor bars
  for (let i = 0; i < 12; i++) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.3, 6), copper.clone());
    const a = (i / 12) * Math.PI * 2;
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, Math.sin(a) * 0.4, Math.cos(a) * 0.4);
    rotorG.add(bar);
  }
  group.add(rotorG);
  parts.push({ name: 'Rotor', description: 'Rotating element carrying conductors that interact with stator field. Squirrel cage bars in induction motors or windings in wound rotors.', material: 'Laminated Steel + Copper', function: 'Carry induced current, produce torque', assemblyOrder: 5, connections: ['Rotor Shaft', 'Commutator'], failureEffect: 'No rotation, motor stalls, overheating', cascadeFailures: ['Commutator', 'Carbon Brushes'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:3,y:0,z:0} });

  // ─── 5. Rotor Shaft ───
  const shaftG = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.5, 16), chrome.clone());
  shaft.rotation.z = Math.PI / 2;
  shaftG.add(shaft);
  // Keyway
  const keyway = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.5), steel.clone());
  keyway.position.set(2.0, 0.09, 0);
  shaftG.add(keyway);
  group.add(shaftG);
  parts.push({ name: 'Rotor Shaft', description: 'Precision-ground shaft transmitting rotational torque from rotor to load. Keyway allows coupling attachment.', material: 'Chrome-Moly Steel', function: 'Transmit torque to driven equipment', assemblyOrder: 4, connections: ['Rotor', 'Bearings'], failureEffect: 'Shaft fracture: complete loss of power transmission', cascadeFailures: ['Bearings', 'Rotor'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:5,y:0,z:0} });

  // ─── 6. Commutator ───
  const commG = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.15), copper.clone());
    const a = (i / 12) * Math.PI * 2;
    seg.position.set(-1.3, Math.sin(a) * 0.2, Math.cos(a) * 0.2);
    seg.rotation.x = a;
    commG.add(seg);
  }
  group.add(commG);
  parts.push({ name: 'Commutator', description: 'Segmented copper cylinder that reverses current direction in rotor windings, maintaining unidirectional torque.', material: 'Hard-Drawn Copper', function: 'Mechanical rectification of current', assemblyOrder: 6, connections: ['Rotor', 'Carbon Brushes'], failureEffect: 'Arcing, erratic speed, eventual motor failure', cascadeFailures: ['Carbon Brushes'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:-4,y:0,z:0} });

  // ─── 7. Carbon Brushes ───
  const brushesG = new THREE.Group();
  for (let angle of [Math.PI/2, -Math.PI/2]) {
    const brush = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.25), tinted(darkSteel, 0x222222));
    brush.position.set(-1.3, Math.sin(angle) * 0.35, Math.cos(angle) * 0.35);
    brushesG.add(brush);
    // Spring
    const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6), steel.clone());
    spring.position.set(-1.3, Math.sin(angle) * 0.5, Math.cos(angle) * 0.5);
    brushesG.add(spring);
  }
  group.add(brushesG);
  parts.push({ name: 'Carbon Brushes', description: 'Conduct current to commutator via sliding contact. Made from carbon-graphite composite for self-lubrication and conductivity.', material: 'Carbon-Graphite', function: 'Transfer current to rotating commutator', assemblyOrder: 8, connections: ['Commutator', 'Terminal Box'], failureEffect: 'Increased arcing, speed fluctuation, eventual stall', cascadeFailures: ['Commutator'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:-4,y:2.5,z:2.5} });

  // ─── 8. End Bells ───
  const bellsG = new THREE.Group();
  for (let s of [-1.4, 1.4]) {
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.15, 32), aluminum.clone());
    bell.rotation.z = Math.PI / 2;
    bell.position.x = s;
    bellsG.add(bell);
    // Shaft hole
    const hole = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), darkSteel.clone());
    hole.rotation.y = Math.PI / 2;
    hole.position.x = s;
    bellsG.add(hole);
  }
  group.add(bellsG);
  parts.push({ name: 'End Bells', description: 'End covers that seal the motor, house bearings, and provide shaft support. Also called end shields or brackets.', material: 'Cast Aluminum', function: 'Seal motor, support bearings', assemblyOrder: 9, connections: ['Stator Housing', 'Bearings'], failureEffect: 'Shaft misalignment, bearing failure, ingress of contaminants', cascadeFailures: ['Bearings'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:0,z:-3} });

  // ─── 9. Bearings ───
  const bearingsG = new THREE.Group();
  for (let s of [-1.4, 1.4]) {
    const outer = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 12, 24), chrome.clone());
    outer.rotation.y = Math.PI / 2;
    outer.position.x = s;
    bearingsG.add(outer);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 12, 24), steel.clone());
    inner.rotation.y = Math.PI / 2;
    inner.position.x = s;
    bearingsG.add(inner);
  }
  group.add(bearingsG);
  parts.push({ name: 'Bearings', description: 'Ball or roller bearings support rotor shaft with minimal friction. Sealed bearings contain pre-packed lubricant.', material: 'Chrome Steel', function: 'Support shaft, minimize rotational friction', assemblyOrder: 7, connections: ['Rotor Shaft', 'End Bells'], failureEffect: 'Noise, vibration, shaft wobble, eventual seizure', cascadeFailures: ['Rotor Shaft', 'Rotor'], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:3,z:-2} });

  // ─── 10. Terminal Box ───
  const termG = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.4), plastic.clone());
  box.position.set(0, 1.45, 0);
  termG.add(box);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.4), tinted(plastic, 0x333344));
  lid.position.set(0, 1.72, 0);
  termG.add(lid);
  for (let z of [-0.1, 0.1]) {
    const term = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8), brass.clone());
    term.position.set(0, 1.55, z);
    termG.add(term);
  }
  group.add(termG);
  parts.push({ name: 'Terminal Box', description: 'Houses electrical connections. Contains terminal studs for power supply wiring. Sealed against moisture and dust.', material: 'Reinforced Plastic', function: 'Electrical connection interface', assemblyOrder: 10, connections: ['Stator Windings', 'Carbon Brushes'], failureEffect: 'Loose connections cause arcing, intermittent operation', cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:4,z:0} });

  const quizQuestions = [
    { question: 'What is the purpose of carbon brushes in a DC motor?', options: ['Cool the motor', 'Transfer current to the rotating commutator', 'Support the shaft', 'Reduce noise'], correct: 1, explanation: 'Carbon brushes make sliding electrical contact with the commutator to transfer current to the rotating armature.', difficulty: 'basic' },
    { question: 'Why is the stator core made of laminations rather than solid iron?', options: ['To save material', 'To reduce eddy current losses', 'To make it lighter', 'For easier manufacturing'], correct: 1, explanation: 'Laminations break the path of eddy currents, significantly reducing power losses and heating in the core.', difficulty: 'advanced' },
    { question: 'What happens when motor bearings fail?', options: ['Motor runs faster', 'Noise, vibration, and eventual shaft seizure', 'No visible effect', 'Only affects cooling'], correct: 1, explanation: 'Failed bearings cause increasing noise and vibration, shaft wobble, and eventually the rotor seizes against the stator.', difficulty: 'basic' },
    { question: 'What is Back-EMF in a DC motor?', options: ['A defect', 'Voltage generated by rotating armature opposing supply', 'Extra power boost', 'Magnetic field decay'], correct: 1, explanation: 'Back-EMF is the voltage induced in the armature by its rotation in the magnetic field, which opposes the applied voltage and regulates current.', difficulty: 'expert' },
    { question: 'What is the role of the commutator?', options: ['Generate magnetic field', 'Reverse current direction to maintain torque', 'Cool the rotor', 'Connect to power supply'], correct: 1, explanation: 'The commutator reverses current in the armature coils as they rotate, ensuring continuous unidirectional torque.', difficulty: 'advanced' },
    { question: 'The cooling fins on the motor housing increase _____.', options: ['Speed', 'Torque', 'Surface area for heat dissipation', 'Magnetic flux'], correct: 2, explanation: 'Fins increase the surface area exposed to air, improving convective heat transfer from the motor housing.', difficulty: 'basic' },
  ];

  return {
    group, parts, description: 'A DC brushed electric motor converting electrical energy to mechanical rotation via electromagnetic interaction between stator field and rotor current.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[3]) meshes[3].group.rotation.x = t * 6;
      if (meshes[4]) meshes[4].group.rotation.x = t * 6;
      if (meshes[5]) meshes[5].group.rotation.x = t * 6;
    }
  };
}
