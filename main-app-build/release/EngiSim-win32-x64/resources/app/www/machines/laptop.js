import { plastic, aluminum, glass, greenPCB, copper, steel, blackPlastic, gold } from '../utils/materials.js';

export function createLaptop(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Custom materials for premium look
  const premiumAluminum = new THREE.MeshStandardMaterial({ color: 0x888c8d, metalness: 0.8, roughness: 0.3 });
  const darkGlass = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.1, roughness: 0.1, envMapIntensity: 1.0 });
  const displayMat = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Will be animated
  const logicBoardMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.4, roughness: 0.7 });
  const batteryMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.8 });
  const copperVapor = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.4 });

  // 1. Display Panel
  const displayG = new THREE.Group();
  // Edge-to-edge glass
  const screenGlass = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, 0.02), darkGlass);
  screenGlass.position.set(0, 1.3, -1.35);
  displayG.add(screenGlass);
  
  // Active Display Area (OLED)
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.4), displayMat);
  screen.position.set(0, 1.3, -1.335); // Slightly in front of the glass back
  displayG.add(screen);

  // Aluminum Display Enclosure
  const lid = new THREE.Mesh(new THREE.BoxGeometry(4.25, 2.65, 0.05), premiumAluminum);
  lid.position.set(0, 1.3, -1.38);
  displayG.add(lid);

  group.add(displayG);
  parts.push({
    name: 'Liquid Retina OLED Display', description: 'Edge-to-edge 120Hz ProMotion display with minimal bezels and extreme color accuracy.', material: 'Glass/Aluminum', function: 'Visual output', assemblyOrder: 10, connections: ['Hinge', 'Mainboard via eDP'], failureEffect: 'No display or dead pixels', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2.5, z:-2}
  });

  // 2. Keyboard Deck & Trackpad
  const deckG = new THREE.Group();
  // CNC Machined Unibody
  const deck = new THREE.Mesh(new THREE.BoxGeometry(4.25, 0.1, 3.0), premiumAluminum);
  deck.position.set(0, -0.05, 0.15);
  deckG.add(deck);
  
  // Scissor-switch Keyboard
  const keyboardWell = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.02, 1.2), new THREE.MeshStandardMaterial({color: 0x111111}));
  keyboardWell.position.set(0, 0, -0.2);
  deckG.add(keyboardWell);
  
  // Individual keys (simplified grid)
  for(let x=-1.7; x<=1.7; x+=0.25) {
      for(let z=-0.7; z<0.3; z+=0.25) {
          const key = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.22), blackPlastic);
          key.position.set(x, 0.01, z);
          deckG.add(key);
      }
  }

  // Force-touch massive trackpad
  const trackpad = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.02, 1.1), darkGlass);
  trackpad.position.set(0, 0, 0.9);
  deckG.add(trackpad);
  
  group.add(deckG);
  parts.push({
    name: 'Unibody Top Case & Force Trackpad', description: 'CNC milled aluminum chassis housing the backlit scissor-switch keyboard and massive haptic glass trackpad.', material: 'Aluminum/Glass', function: 'User input and structural integrity', assemblyOrder: 9, connections: ['Bottom Chassis'], failureEffect: 'Input failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 3. Logic Board (High Density)
  const moboG = new THREE.Group();
  const mobo = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 1.0), logicBoardMat);
  mobo.position.set(0, -0.15, -0.6);
  moboG.add(mobo);
  
  // SoC (System on Chip)
  const soc = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.03, 0.6), steel);
  soc.position.set(0, -0.12, -0.6);
  moboG.add(soc);
  
  // Unified Memory flanking SoC
  const mem1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.4), blackPlastic);
  mem1.position.set(-0.35, -0.12, -0.6);
  moboG.add(mem1);
  const mem2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.4), blackPlastic);
  mem2.position.set(0.35, -0.12, -0.6);
  moboG.add(mem2);

  group.add(moboG);
  parts.push({
    name: 'High-Density Logic Board & SoC', description: 'Advanced HDI printed circuit board featuring an ARM-based System-on-Chip (SoC) and ultra-fast unified memory.', material: 'FR4 / Silicon', function: 'Central computation and component routing', assemblyOrder: 1, connections: ['Battery', 'Display', 'I/O'], failureEffect: 'System dead', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:-0.5}
  });

  // 4. Vapor Chamber & Cooling System
  const coolingG = new THREE.Group();
  const vaporPlate = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.03, 0.8), copperVapor);
  vaporPlate.position.set(0, -0.1, -0.6);
  coolingG.add(vaporPlate);
  
  const finStack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 0.2), aluminum);
  finStack.position.set(0, -0.1, -1.05);
  coolingG.add(finStack);
  
  group.add(coolingG);
  parts.push({
    name: 'Vapor Chamber Cooler', description: 'A massive copper vapor chamber replacing traditional heatpipes, spreading heat to the rear exhaust fins.', material: 'Copper/Vapor', function: 'Thermal transfer', assemblyOrder: 2, connections: ['SoC', 'Fans'], failureEffect: 'Thermal throttling', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1, z:-1}
  });

  // 5. Dual Fans
  const fansG = new THREE.Group();
  const createFan = (x) => {
      const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), blackPlastic);
      const fanGroup = new THREE.Group();
      fanGroup.add(fanHub);
      for(let i=0; i<30; i++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.01, 0.04), blackPlastic);
          const ang = (i/30)*Math.PI*2;
          blade.position.set(Math.cos(ang)*0.12, 0, Math.sin(ang)*0.12);
          blade.rotation.y = -ang;
          blade.rotation.x = 0.2;
          fanGroup.add(blade);
      }
      fanGroup.position.set(x, -0.12, -0.9);
      return fanGroup;
  };
  const fanLeft = createFan(-1.2);
  const fanRight = createFan(1.2);
  fansG.add(fanLeft);
  fansG.add(fanRight);
  group.add(fansG);
  parts.push({
    name: 'Dual Asymmetrical Fans', description: 'Extremely thin, high-density blade fans with asymmetrical spacing to eliminate acoustic resonance frequencies.', material: 'LCP Plastic', function: 'Active cooling exhaust', assemblyOrder: 6, connections: ['Vapor Chamber', 'Logic Board'], failureEffect: 'Overheating / Loud noise', cascadeFailures: ['SoC'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0.5, z:-2}
  });

  // 6. Battery Array
  const batteryG = new THREE.Group();
  const batConfig = [
      [-1.3, 0.1], [-1.3, 0.9],
      [0, 0.4], [0, 1.1],
      [1.3, 0.1], [1.3, 0.9]
  ];
  batConfig.forEach(pos => {
      const cell = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.7), batteryMat);
      cell.position.set(pos[0], -0.15, pos[1]);
      batteryG.add(cell);
  });
  group.add(batteryG);
  parts.push({
    name: 'Terraced Battery Array', description: '100Wh multi-cell lithium-ion polymer battery, terraced to fill every millimeter of available space inside the chassis.', material: 'Li-Po', function: 'Portable power', assemblyOrder: 5, connections: ['Logic Board'], failureEffect: 'Won\'t turn on without AC power', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2, z:1}
  });

  // 7. Speakers & Audio
  const audioG = new THREE.Group();
  const spkLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 1.0), blackPlastic);
  spkLeft.position.set(-1.8, -0.15, 0);
  audioG.add(spkLeft);
  const spkRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 1.0), blackPlastic);
  spkRight.position.set(1.8, -0.15, 0);
  audioG.add(spkRight);
  group.add(audioG);
  parts.push({
    name: 'Six-Speaker Sound System', description: 'Force-canceling woofers and high-fidelity tweeters supporting Spatial Audio.', material: 'Neodymium / Plastic', function: 'Audio output', assemblyOrder: 4, connections: ['Logic Board'], failureEffect: 'No sound / crackling', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1, z:0.5}
  });

  // 8. Hinge Mechanism
  const hingeG = new THREE.Group();
  const hingeL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16), steel);
  hingeL.rotation.z = Math.PI / 2;
  hingeL.position.set(-1.5, -0.05, -1.35);
  hingeG.add(hingeL);
  const hingeR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16), steel);
  hingeR.rotation.z = Math.PI / 2;
  hingeR.position.set(1.5, -0.05, -1.35);
  hingeG.add(hingeR);
  group.add(hingeG);
  parts.push({
    name: 'Concealed Hinge Mechanism', description: 'Precision engineered metal hinges with internal routing for display flex cables.', material: 'Steel', function: 'Screen articulation and cable routing', assemblyOrder: 8, connections: ['Display Panel', 'Top Case'], failureEffect: 'Screen flops down or display cable tearing', cascadeFailures: ['Liquid Retina OLED Display'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1, z:-3}
  });

  // 9. Bottom Chassis
  const bottomG = new THREE.Group();
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(4.25, 0.06, 3.0), premiumAluminum);
  bottom.position.set(0, -0.25, 0.15);
  bottomG.add(bottom);
  // Rubber feet
  const feetPos = [[-1.9, -1.2], [1.9, -1.2], [-1.9, 1.4], [1.9, 1.4]];
  feetPos.forEach(p => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), new THREE.MeshStandardMaterial({color:0x222222}));
      foot.position.set(p[0], -0.29, p[1]);
      bottomG.add(foot);
  });
  group.add(bottomG);
  parts.push({
    name: 'Bottom Aluminum Panel', description: 'Lower case enclosure secured with pentalobe screws, completing the rigid unibody structure.', material: 'Aluminum', function: 'Protects internals', assemblyOrder: 7, connections: ['Top Case'], failureEffect: 'Physical damage to internals', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-4, z:0}
  });

  const quizQuestions = [
    { question: 'What is a System-on-Chip (SoC)?', options: ['A chip that only runs the operating system', 'An integrated circuit that combines CPU, GPU, memory, and neural engine into a single silicon package', 'A new type of battery', 'A wireless networking card'], correct: 1, explanation: 'SoCs provide immense power efficiency and speed because all critical processors share the same incredibly fast unified memory pool right on the chip.', difficulty: 'basic' },
    { question: 'Why are modern laptop batteries terraced or irregularly shaped?', options: ['Because batteries are naturally that shape', 'To make them lighter', 'To fill the curved contours and every millimeter of empty space inside ultra-thin unibody chassis', 'To prevent them from exploding'], correct: 2, explanation: 'Terraced battery cells allow engineers to pack more watt-hours into extremely tight, sloping geometries of modern thin-and-light laptops.', difficulty: 'advanced' },
    { question: 'What is the purpose of asymmetrical fan blade spacing?', options: ['To save manufacturing costs', 'To spread acoustic energy across a wider frequency band, eliminating annoying tonal whines (resonance)', 'To push air faster', 'It is a manufacturing defect'], correct: 1, explanation: 'If fan blades are spaced perfectly equally, they produce a highly noticeable pitched whine. Asymmetrical spacing turns this whine into a more pleasant "white noise" whoosh.', difficulty: 'expert' },
    { question: 'What does a Vapor Chamber do better than standard heatpipes?', options: ['Vapor chambers can spread intense heat across two dimensions instantly via phase change, rather than just linearly', 'Vapor chambers use water instead of vapor', 'Vapor chambers are heavier', 'Vapor chambers generate electricity'], correct: 0, explanation: 'As modern chips get denser, hotspots become severe. A vapor chamber acts like a massive flat heatpipe, instantly pulling heat away from the tiny die to the entire cooler surface.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'An ultra-premium modern laptop featuring an ARM SoC, OLED display, and CNC unibody design.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Animate fans (index 4)
      const fansGroup = parts[4].runtimeGroup || meshes[4]?.group;
      if (fansGroup && fansGroup.children.length >= 2) {
          fansGroup.children[0].rotation.y = t * 25;
          fansGroup.children[1].rotation.y = -t * 25; // Counter-rotating
      }
      
      // Animate OLED screen (index 0, child 1 is screen)
      const dispGroup = parts[0].runtimeGroup || meshes[0]?.group;
      if (dispGroup && dispGroup.children[1]) {
          const screenMat = dispGroup.children[1].material;
          const r = Math.sin(t) * 0.2 + 0.2;
          const g = Math.cos(t * 0.8) * 0.2 + 0.3;
          const b = Math.sin(t * 1.2) * 0.4 + 0.6;
          screenMat.color.setRGB(r, g, b);
      }
    }
  };
}
