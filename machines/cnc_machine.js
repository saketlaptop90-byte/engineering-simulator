import { steel, aluminum, darkSteel, brass, redAccent, glass } from '../utils/materials.js';

export function createCNCMachine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  const castIron = new THREE.MeshStandardMaterial({
    color: 0x444444, roughness: 0.8, metalness: 0.5
  });

  const paintedMetal = new THREE.MeshStandardMaterial({
    color: 0x0055aa, roughness: 0.5, metalness: 0.2
  });

  // 1. Machine Base (Bed)
  const baseG = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.0, 4.0), castIron);
  base.position.y = -0.5;
  baseG.add(base);
  group.add(baseG);
  parts.push({
    name: 'Cast Iron Bed', description: 'Massive, heavy base that dampens vibrations during heavy cutting.', material: 'Cast Iron / Epoxy Granite', function: 'Foundation / Rigidity', assemblyOrder: 1, connections: ['X-Axis Ways', 'Trunnion Base'], failureEffect: 'Machine out of tram (inaccurate cuts)', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 2. Y-Axis Column & Ways (Moves front/back)
  const yAxisG = new THREE.Group();
  const column = new THREE.Mesh(new THREE.BoxGeometry(2.0, 5.0, 1.5), castIron);
  column.position.set(0, 2.5, -1.5);
  yAxisG.add(column);
  const yScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5, 8), steel.clone());
  yScrew.rotation.x = Math.PI/2;
  yScrew.position.set(0, 0.5, 0);
  yAxisG.add(yScrew);
  group.add(yAxisG);
  parts.push({
    name: 'Y-Axis Column', description: 'The upright column that holds the spindle assembly, moving along linear rails.', material: 'Cast Iron', function: 'Y-Axis translation', assemblyOrder: 2, connections: ['Machine Base', 'X-Axis Ram'], failureEffect: 'Y-axis binding', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:-4}
  });

  // 3. X-Axis Ram (Moves left/right across the column)
  const xAxisG = new THREE.Group();
  const ram = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.5, 1.0), paintedMetal);
  ram.position.set(0, 3.5, -0.5);
  xAxisG.add(ram);
  group.add(xAxisG);
  parts.push({
    name: 'X-Axis Ram', description: 'Moves horizontally across the column.', material: 'Steel', function: 'X-Axis translation', assemblyOrder: 3, connections: ['Y-Axis Column', 'Z-Axis Head'], failureEffect: 'X-axis drift', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:4, y:2, z:-2}
  });

  // 4. Z-Axis Spindle Head (Moves up/down)
  const zAxisG = new THREE.Group();
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.0, 1.2), paintedMetal);
  head.position.set(0, 2.5, 0.5);
  zAxisG.add(head);
  group.add(zAxisG);
  parts.push({
    name: 'Z-Axis Spindle Head', description: 'Moves vertically into the workpiece.', material: 'Cast Iron', function: 'Z-Axis translation', assemblyOrder: 4, connections: ['X-Axis Ram', 'Spindle Motor'], failureEffect: 'Z-axis crash', cascadeFailures: ['Cutting Tool', 'Workpiece'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:6, z:1}
  });

  // 5. Spindle Motor & Cartridge
  const spindleG = new THREE.Group();
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16), aluminum.clone());
  spindle.position.set(0, 1.5, 0.5);
  spindleG.add(spindle);
  group.add(spindleG);
  parts.push({
    name: 'High-Speed Spindle', description: 'Contains precision ceramic bearings and a high-torque motor spinning up to 30,000 RPM.', material: 'Steel / Ceramic', function: 'Tool rotation', assemblyOrder: 5, connections: ['Z-Axis Head', 'Tool Holder'], failureEffect: 'Bearing seizure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:3}
  });

  // 6. Tool Holder & Cutting Tool (Endmill)
  const toolG = new THREE.Group();
  const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 0.4, 16), darkSteel.clone());
  holder.position.set(0, 0.55, 0.5);
  toolG.add(holder);
  const endmill = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8), steel.clone());
  endmill.position.set(0, 0.1, 0.5);
  toolG.add(endmill);
  group.add(toolG);
  parts.push({
    name: 'Tool Holder & Endmill', description: 'Carbide cutting tool secured by a collet, responsible for removing metal.', material: 'Tungsten Carbide', function: 'Material removal', assemblyOrder: 6, connections: ['Spindle', 'Workpiece'], failureEffect: 'Tool breakage', cascadeFailures: ['Workpiece'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:3}
  });

  // 7. Trunnion Table Base (A-Axis support)
  const trunBaseG = new THREE.Group();
  const tBase1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.5, 1.5), castIron);
  tBase1.position.set(-1.8, 0.75, 1.0);
  trunBaseG.add(tBase1);
  const tBase2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.5, 1.5), castIron);
  tBase2.position.set(1.8, 0.75, 1.0);
  trunBaseG.add(tBase2);
  group.add(trunBaseG);
  parts.push({
    name: 'Trunnion Supports', description: 'Supports the tilting A-Axis.', material: 'Cast Iron', function: 'Rotational support', assemblyOrder: 7, connections: ['Machine Base'], failureEffect: 'Vibration', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-3, y:0, z:3}
  });

  // 8. A-Axis Cradle (Tilts forward/back)
  const aAxisG = new THREE.Group();
  const cradle = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.4, 1.5), aluminum.clone());
  cradle.position.set(0, 1.2, 1.0);
  aAxisG.add(cradle);
  group.add(aAxisG);
  parts.push({
    name: 'A-Axis Trunnion Cradle', description: 'Tilts the entire workpiece up to +/- 120 degrees.', material: 'Aluminum', function: 'A-Axis Rotation', assemblyOrder: 8, connections: ['Trunnion Supports', 'C-Axis Platter'], failureEffect: 'Angular error', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1, z:4}
  });

  // 9. C-Axis Rotary Platter (Spins 360)
  const cAxisG = new THREE.Group();
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32), steel.clone());
  platter.position.set(0, 1.5, 1.0);
  cAxisG.add(platter);
  group.add(cAxisG);
  parts.push({
    name: 'C-Axis Rotary Platter', description: 'Spins the workpiece 360 degrees continuously.', material: 'Steel', function: 'C-Axis Rotation', assemblyOrder: 9, connections: ['A-Axis Cradle', 'Workpiece'], failureEffect: 'Backlash / Positioning error', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:4}
  });

  // 10. Workpiece & Vise
  const workG = new THREE.Group();
  const vise = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), darkSteel.clone());
  vise.position.set(0, 1.75, 1.0);
  workG.add(vise);
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), brass.clone());
  stock.position.set(0, 2.1, 1.0);
  workG.add(stock);
  group.add(workG);
  parts.push({
    name: 'Vise & Workpiece (Stock)', description: 'The raw block of metal being machined into a final part.', material: 'Aluminum / Brass', function: 'Product', assemblyOrder: 10, connections: ['C-Axis Platter'], failureEffect: 'Part scrapped', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:4}
  });

  const quizQuestions = [
    { question: 'What does CNC stand for?', options: ['Computer Numerical Control', 'Centralized Node Cutting', 'Calculated Numeric Computing', 'Code Nested Coordinates'], correct: 0, explanation: 'CNC machines use G-code (Computer Numerical Control) to move motors to precise XYZ coordinates.', difficulty: 'basic' },
    { question: 'In a standard 5-axis mill configuration, what are the A and C axes?', options: ['Linear movements', 'The speed of the spindle and coolant flow', 'Rotational axes. A rotates around X, C rotates around Z.', 'Laser intensity controls'], correct: 2, explanation: 'X, Y, and Z are linear axes. A, B, and C are rotational axes pivoting around X, Y, and Z respectively.', difficulty: 'advanced' },
    { question: 'Why is the machine base made of incredibly heavy Cast Iron or Epoxy Granite?', options: ['Because it is the cheapest material', 'To dampen vibrations. Cutting solid steel creates massive chatter that would shake a lighter machine apart.', 'To prevent rust', 'To conduct electricity for the motors'], correct: 1, explanation: 'Rigidity and vibration damping are the most important factors in machine tool design to achieve tight tolerances and good surface finishes.', difficulty: 'basic' },
    { question: 'What is a "Crash" in CNC machining?', options: ['When the software blue screens', 'When the tool or spindle head physically collides with the vise, table, or workpiece at rapid speeds', 'When the power goes out', 'When the coolant pump fails'], correct: 1, explanation: 'Because CNC motors have immense torque and don\'t know where objects are, a programming error will cause the machine to drive the tool directly into solid steel at full speed, causing thousands of dollars in damage.', difficulty: 'basic' },
    { question: 'What is "Backlash" in a CNC machine?', options: ['The spray of coolant', 'The physical play/slop in the gears or ballscrews when reversing direction', 'The electrical feedback to the wall', 'A type of cutting tool'], correct: 1, explanation: 'Backlash is lost motion. Modern CNCs use pre-loaded ballscrews to completely eliminate backlash, allowing for micron-level precision.', difficulty: 'advanced' }
  ];

  // We will animate the machine simulating a cutting path
  return {
    group, parts, description: 'A 5-Axis CNC Milling Machine. The cornerstone of modern manufacturing.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed * 2;
      
      // Spindle rotation
      if (meshes[5]) meshes[5].group.rotation.y = t * 20;
      if (meshes[6]) meshes[6].group.rotation.y = t * 20;
      
      // Simulate G-Code path
      const xPos = Math.sin(t*0.5) * 1.5;
      const yPos = Math.cos(t*0.3) * 0.5;
      const zPos = Math.sin(t*0.8) * 0.2;
      
      // X Ram
      if (meshes[2]) meshes[2].group.position.x = xPos;
      // Z Head + Spindle + Tool follow X and move in Z
      if (meshes[3]) {
          meshes[3].group.position.x = xPos;
          meshes[3].group.position.y = 2.5 + zPos;
      }
      if (meshes[4]) { // Spindle
          meshes[4].group.position.x = xPos;
          meshes[4].group.position.y = 1.5 + zPos;
      }
      if (meshes[5]) { // Tool
          meshes[5].group.position.x = xPos;
          meshes[5].group.position.y = 0.55 + zPos - 0.5; 
      }
      
      // Y Column
      if (meshes[1]) {
          meshes[1].group.position.z = -1.5 + yPos;
          // offset ram/head to follow Y
          if (meshes[2]) meshes[2].group.position.z = -0.5 + yPos;
          if (meshes[3]) meshes[3].group.position.z = 0.5 + yPos;
          if (meshes[4]) meshes[4].group.position.z = 0.5 + yPos;
          if (meshes[5]) meshes[5].group.position.z = 0.5 + yPos;
      }
      
      // A and C axis on trunnion
      if (meshes[7]) {
          meshes[7].group.rotation.x = Math.sin(t*0.2) * 0.5; // A axis tilt
      }
      if (meshes[8]) {
          // Platter follows cradle tilt and spins
          meshes[8].group.rotation.x = Math.sin(t*0.2) * 0.5;
          meshes[8].group.rotation.y = t * 0.5; // C axis spin
      }
      if (meshes[9]) {
          meshes[9].group.rotation.x = Math.sin(t*0.2) * 0.5;
          meshes[9].group.rotation.y = t * 0.5;
      }
    }
  };
}
