// ═══════════════════════════════════════════════════════════════════
// Water Tap (Faucet)
// ═══════════════════════════════════════════════════════════════════
import { chrome, brass, rubber, steel, aluminum, plastic, tinted } from '../utils/materials.js';

export function createTap(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Tap Body
  const bodyG = new THREE.Group();
  const bodyMain = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.2, 24), chrome.clone());
  bodyMain.position.y = 0.6;
  bodyG.add(bodyMain);
  // Decorative ring
  const decoRing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 12, 24), tinted(chrome, 0xd0d8e0));
  decoRing.position.y = 0.3;
  bodyG.add(decoRing);
  // Base flange
  const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24), chrome.clone());
  flange.position.y = -0.02;
  bodyG.add(flange);
  group.add(bodyG);
  parts.push({ name: 'Tap Body', description: 'Main casting housing all internal components. Provides water inlet and directs flow to spout. Chrome-plated brass.', material: 'Brass (Chrome-plated)', function: 'Structural housing, water channel', assemblyOrder: 1, connections: ['Spout', 'Handle', 'Spindle', 'Packing Nut'], failureEffect: 'Cracked body causes uncontrollable leak', cascadeFailures: ['Spindle', 'Washer'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:0} });

  // 2. Spout
  const spoutG = new THREE.Group();
  const spoutPts = [
    new THREE.Vector3(0, 1.0, 0), new THREE.Vector3(0.1, 1.3, 0.1),
    new THREE.Vector3(0.3, 1.4, 0.3), new THREE.Vector3(0.5, 1.35, 0.6),
    new THREE.Vector3(0.5, 1.1, 0.9)
  ];
  const spoutCurve = new THREE.CatmullRomCurve3(spoutPts);
  const spoutMesh = new THREE.Mesh(new THREE.TubeGeometry(spoutCurve, 24, 0.08, 12, false), chrome.clone());
  spoutG.add(spoutMesh);
  group.add(spoutG);
  parts.push({ name: 'Spout', description: 'Curved outlet directing water flow to the basin. Gooseneck or standard design. May swivel on some models.', material: 'Brass (Chrome-plated)', function: 'Direct water into basin', assemblyOrder: 2, connections: ['Tap Body', 'Aerator'], failureEffect: 'Water sprays in wrong direction', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:1,z:2} });

  // 3. Handle
  const handleG = new THREE.Group();
  // Cross-shaped handle
  const handleCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12), chrome.clone());
  handleCenter.position.y = 1.4;
  handleG.add(handleCenter);
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), chrome.clone());
  arm1.rotation.z = Math.PI / 2;
  arm1.position.y = 1.45;
  handleG.add(arm1);
  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), chrome.clone());
  arm2.rotation.x = Math.PI / 2;
  arm2.position.y = 1.45;
  handleG.add(arm2);
  // Cap on top
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), tinted(chrome, 0xeef0f4));
  cap.position.y = 1.52;
  handleG.add(cap);
  // Knob ends
  for (let pos of [{x:0.25,z:0},{x:-0.25,z:0},{x:0,z:0.25},{x:0,z:-0.25}]) {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), chrome.clone());
    knob.position.set(pos.x, 1.45, pos.z);
    handleG.add(knob);
  }
  group.add(handleG);
  parts.push({ name: 'Handle', description: 'User interface for controlling water flow. Rotates spindle to lift/lower washer against valve seat.', material: 'Brass (Chrome-plated)', function: 'Control water on/off and flow rate', assemblyOrder: 7, connections: ['Spindle'], failureEffect: 'Cannot control water flow', cascadeFailures: ['Spindle'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:3,z:0} });

  // 4. Spindle / Stem
  const spindleG = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12), brass.clone());
  stem.position.y = 0.8;
  spindleG.add(stem);
  // Thread detail
  for (let i = 0; i < 8; i++) {
    const thread = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.005, 6, 16), brass.clone());
    thread.position.y = 0.4 + i * 0.08;
    spindleG.add(thread);
  }
  group.add(spindleG);
  parts.push({ name: 'Spindle', description: 'Threaded stem connecting handle to washer. Rotates to translate linear motion, pressing washer against valve seat.', material: 'Brass', function: 'Convert rotary motion to linear valve action', assemblyOrder: 4, connections: ['Handle', 'Washer', 'Packing Nut'], failureEffect: 'Stripped threads — handle spins freely, no flow control', cascadeFailures: ['Washer'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:2,z:-1} });

  // 5. Washer
  const washerG = new THREE.Group();
  const washer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16), rubber.clone());
  washer.position.y = 0.15;
  washerG.add(washer);
  const washerScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 6), brass.clone());
  washerScrew.position.y = 0.18;
  washerG.add(washerScrew);
  group.add(washerG);
  parts.push({ name: 'Washer', description: 'Rubber or PTFE disc that presses against valve seat to stop water flow. Most common wear part in a tap.', material: 'Rubber / PTFE (Teflon)', function: 'Seal water flow when compressed against seat', assemblyOrder: 3, connections: ['Spindle', 'Valve Seat'], failureEffect: 'Dripping tap — constant water leak even when closed', cascadeFailures: ['Valve Seat'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-2,z:0} });

  // 6. Valve Seat
  const seatG = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 12, 24), brass.clone());
  seat.position.y = 0.08;
  seatG.add(seat);
  const seatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 16), brass.clone());
  seatBase.position.y = 0.02;
  seatG.add(seatBase);
  group.add(seatG);
  parts.push({ name: 'Valve Seat', description: 'Precision-machined brass ring inside the tap body. Washer compresses against this to form a watertight seal.', material: 'Brass', function: 'Provide sealing surface for washer', assemblyOrder: 5, connections: ['Washer', 'Tap Body'], failureEffect: 'Corroded seat cannot seal — dripping even with new washer', cascadeFailures: ['Washer'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-3,z:0} });

  // 7. Packing Nut
  const packG = new THREE.Group();
  const packNut = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 6), chrome.clone());
  packNut.position.y = 1.18;
  packG.add(packNut);
  group.add(packG);
  parts.push({ name: 'Packing Nut', description: 'Hexagonal nut compressing packing material around the spindle to prevent water from leaking around the stem.', material: 'Brass (Chrome-plated)', function: 'Seal around spindle to prevent leaks', assemblyOrder: 6, connections: ['Spindle', 'Tap Body'], failureEffect: 'Water leaks around the handle when tap is open', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:1,y:2,z:-1} });

  // 8. Aerator
  const aeroG = new THREE.Group();
  const aeroBody = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 12), chrome.clone());
  aeroBody.position.set(0.5, 1.0, 0.9);
  aeroG.add(aeroBody);
  // Mesh screen
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 12), tinted(steel, 0xaabbcc));
  mesh.position.set(0.5, 0.94, 0.9);
  aeroG.add(mesh);
  group.add(aeroG);
  parts.push({ name: 'Aerator', description: 'Screen at spout tip that mixes air into water stream. Reduces splashing, saves water, and provides consistent flow feel.', material: 'Stainless Steel Mesh', function: 'Aerate water, reduce splash, save water', assemblyOrder: 8, connections: ['Spout'], failureEffect: 'Uneven water stream, splashing, reduced water pressure', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:0,z:3} });

  const quizQuestions = [
    { question: 'The most common cause of a dripping tap is:', options: ['Broken handle', 'Worn washer', 'Clogged aerator', 'Loose packing nut'], correct: 1, explanation: 'A worn rubber washer can no longer seal against the valve seat, allowing water to drip through.', difficulty: 'basic' },
    { question: 'What does the aerator do?', options: ['Filter bacteria', 'Mix air into water stream to reduce splash and save water', 'Heat water', 'Measure flow'], correct: 1, explanation: 'The aerator introduces air into the water stream, creating a softer feel, reducing splash, and lowering water consumption.', difficulty: 'basic' },
    { question: 'Water leaking around the handle indicates:', options: ['Broken spout', 'Failed packing/O-ring around the spindle', 'Clogged aerator', 'Corroded valve seat'], correct: 1, explanation: 'Leaking around the handle means the packing or O-ring around the spindle has failed, allowing water past the stem seal.', difficulty: 'advanced' },
    { question: 'The spindle converts:', options: ['Electrical to thermal', 'Rotational motion to linear motion via threads', 'Water pressure to flow', 'Light to sound'], correct: 1, explanation: 'The threaded spindle converts the rotational motion of the handle into linear motion, raising or lowering the washer.', difficulty: 'advanced' },
    { question: 'Quarter-turn taps use ___ instead of rubber washers.', options: ['Springs', 'Ceramic disc cartridges', 'Magnets', 'Gears'], correct: 1, explanation: 'Quarter-turn taps use ceramic disc cartridges — two flat ceramic discs that slide over each other to control flow.', difficulty: 'expert' },
    { question: 'Why is brass preferred for tap bodies?', options: ['Cheapest', 'Corrosion-resistant, machinable, and safe for potable water', 'Lightest', 'Best thermal conductor'], correct: 1, explanation: 'Brass resists corrosion from water, is easily machined for complex shapes, and is approved for potable water contact.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'A compression-type water tap (faucet) controlling water flow via a rubber washer pressed against a brass valve seat by a threaded spindle.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Handle rotates
      if (meshes[2]) meshes[2].group.rotation.y = Math.sin(t * 0.5) * 0.5;
      // Spindle moves up/down
      if (meshes[3]) meshes[3].group.position.y = Math.sin(t * 0.5) * 0.05;
    }
  };
}
