import { steel, aluminum, darkSteel, gold, copper, glass, redAccent, rubber } from '../utils/materials.js';

export function createGPU(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Material for the black PCB
  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x111111, roughness: 0.8, metalness: 0.2
  });
  
  const siliconMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, emissive: 0x00ff88, emissiveIntensity: 0.2, roughness: 0.2, metalness: 0.8
  });

  const vramMat = new THREE.MeshStandardMaterial({
    color: 0x222222, roughness: 0.9
  });

  // 1. PCB Board
  const pcbG = new THREE.Group();
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.1, 3.2), pcbMat);
  pcbG.add(pcb);
  
  // PCIe connector
  const pcie = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.2, 0.2), gold.clone());
  pcie.position.set(-1.0, -0.15, 1.5);
  pcbG.add(pcie);
  
  group.add(pcbG);
  parts.push({
    name: 'Graphics Card PCB & PCIe Connector', description: 'Multi-layer high-density PCB hosting the power delivery, VRAM, and massive GPU die.', material: 'FR4 / Gold', function: 'Electrical routing', assemblyOrder: 1, connections: ['Motherboard PCIe Slot'], failureEffect: 'No display', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 2. Power Delivery (VRMs & Capacitors)
  const vrmG = new THREE.Group();
  for(let i=0; i<16; i++) {
      const choke = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.2), darkSteel.clone());
      choke.position.set(2.4, 0.125, -1.4 + i*0.18);
      vrmG.add(choke);
      
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 16), aluminum.clone());
      cap.position.set(2.0, 0.125, -1.4 + i*0.18);
      vrmG.add(cap);
  }
  group.add(vrmG);
  parts.push({
    name: 'Extreme VRMs (Voltage Regulator Modules)', description: 'Massive 16-phase power delivery supplying over 450W of clean 1V power to the GPU die.', material: 'Various Metals', function: 'Power filtration and stepping', assemblyOrder: 2, connections: ['PCB', '12VHPWR Connector'], failureEffect: 'Card dies under load', cascadeFailures: ['GPU Die'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:3, y:0, z:0}
  });

  // 3. VRAM (GDDR6X Memory Modules)
  const vramG = new THREE.Group();
  const vramPositions = [
      [-1.0, -1.0], [-0.2, -1.0], [0.6, -1.0],
      [-1.0, 1.0], [-0.2, 1.0], [0.6, 1.0],
      [-1.0, 0], [0.6, 0], [1.4, 0], [1.4, -1.0], [1.4, 1.0]
  ];
  vramPositions.forEach(pos => {
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.55), vramMat);
      chip.position.set(pos[0], 0.075, pos[1]);
      vramG.add(chip);
  });
  group.add(vramG);
  parts.push({
    name: 'GDDR6X VRAM', description: 'Ultra-fast memory chips running at 21+ Gbps surrounding the GPU die to hold massive 4K textures.', material: 'Silicon / Plastic', function: 'Graphics memory', assemblyOrder: 3, connections: ['Memory Controller'], failureEffect: 'Artifacting / Glitched textures', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1.5, z:0}
  });

  // 4. GPU Silicon Die
  const dieG = new THREE.Group();
  const dieBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 1.6), darkSteel);
  dieBase.position.y = 0.07;
  dieG.add(dieBase);
  const die = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 1.4), siliconMat);
  die.position.y = 0.08;
  dieG.add(die);
  // Simulate SMs (Streaming Multiprocessors) visually
  for(let i=0; i<10; i++) {
      for(let j=0; j<10; j++) {
          const sm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, 0.12), gold.clone());
          sm.position.set(-0.63 + i*0.14, 0.11, -0.63 + j*0.14);
          dieG.add(sm);
      }
  }
  group.add(dieG);
  parts.push({
    name: 'Ada Lovelace Architecture GPU Die', description: 'Massive silicon die containing over 16,000 CUDA cores, RT cores, and Tensor cores.', material: 'Silicon', function: 'Graphics & AI processing', assemblyOrder: 4, connections: ['PCB', 'VRAM'], failureEffect: 'Black screen', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 5. Coldplate & Vapor Chamber
  const plateG = new THREE.Group();
  const plate = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.25, 2.8), copper.clone());
  plate.position.y = 0.225;
  plateG.add(plate);
  group.add(plateG);
  parts.push({
    name: 'Massive Copper Vapor Chamber', description: 'A flat hollow copper plate containing liquid that boils and condenses, spreading 450W of heat instantly.', material: 'Copper / Vapor', function: 'Heat absorption', assemblyOrder: 5, connections: ['GPU Die', 'Heatpipes'], failureEffect: 'Overheating', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 6. Heatpipes
  const pipesG = new THREE.Group();
  for(let i=0; i<8; i++) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6.2, 16), copper.clone());
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0, 0.45, -1.2 + i*0.34);
      pipesG.add(pipe);
  }
  group.add(pipesG);
  parts.push({
    name: 'Composite Heatpipes', description: '8 massive composite heatpipes carry heat from the vapor chamber to the fin stack.', material: 'Copper', function: 'Heat transport', assemblyOrder: 6, connections: ['Vapor Chamber', 'Fins'], failureEffect: 'Throttling', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:4, z:0}
  });

  // 7. Massive Fin Stack
  const finsG = new THREE.Group();
  for(let i=0; i<80; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.6, 3.2), aluminum.clone());
      fin.position.set(-3.1 + i*0.08, 1.3, 0);
      finsG.add(fin);
  }
  group.add(finsG);
  parts.push({
    name: 'Quad-Slot Aluminum Fin Array', description: 'Gigantic surface area spanning a quad-slot cooler design to dissipate massive thermal loads.', material: 'Aluminum', function: 'Heat dissipation', assemblyOrder: 7, connections: ['Heatpipes'], failureEffect: 'Overheating', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:0}
  });

  // 8. Fans and Shroud
  const shroudG = new THREE.Group();
  const shroudMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.5, metalness: 0.8 });
  
  // Outer geometric shroud casing
  const shroudMain = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.5, 3.4), shroudMat);
  shroudMain.position.y = 2.35;
  shroudG.add(shroudMain);
  
  const rgbStrip = new THREE.Mesh(new THREE.BoxGeometry(6.65, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.0 }));
  rgbStrip.position.set(0, 2.35, 1.7);
  shroudG.add(rgbStrip);

  const fans = [];
  const fanCenters = [-2.0, 0, 2.0];
  
  fanCenters.forEach((cx, idx) => {
      // Cutout hole illusion (dark cylinder behind fan)
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.52, 32), new THREE.MeshStandardMaterial({color: 0x000000}));
      hole.position.set(cx, 2.35, 0);
      shroudG.add(hole);

      const fanGroup = new THREE.Group();
      // Fan Hub
      const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32), darkSteel.clone());
      fanGroup.add(fanHub);
      
      // Fan Blades (Axial-tech style)
      const numBlades = 11;
      for(let b=0; b<numBlades; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.25), steel.clone());
          const angle = (b / numBlades) * Math.PI * 2;
          blade.position.set(Math.cos(angle)*0.55, 0, Math.sin(angle)*0.55);
          blade.rotation.y = -angle;
          blade.rotation.x = 0.4; // Strong pitch
          fanGroup.add(blade);
      }
      // Outer barrier ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 8, 32), steel.clone());
      ring.rotation.x = Math.PI / 2;
      fanGroup.add(ring);

      fanGroup.position.set(cx, 2.65, 0);
      fans.push(fanGroup);
      shroudG.add(fanGroup);
  });
  
  group.add(shroudG);
  parts.push({
    name: 'Axial-Tech Cooling Fans & Shroud', description: 'Three 100mm fans with barrier rings pushing high static pressure air through the massive fin stack.', material: 'Plastic / Aluminum', function: 'Active cooling', assemblyOrder: 8, connections: ['Fin Stack'], failureEffect: 'Overheating / Loud noise', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:7, z:0}
  });

  // 9. Backplate
  const backplateG = new THREE.Group();
  const bp = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.15, 3.2), steel.clone());
  bp.position.y = -0.15;
  backplateG.add(bp);
  group.add(backplateG);
  parts.push({
    name: 'Vented Metal Backplate', description: 'Rigid aerospace-grade aluminum backplate preventing the 5-pound card from sagging, featuring airflow cutouts.', material: 'Aluminum', function: 'Structural support', assemblyOrder: 9, connections: ['PCB'], failureEffect: 'GPU Sag', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-4, z:0}
  });

  // 10. I/O Bracket
  const ioG = new THREE.Group();
  const io = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 3.2), steel.clone());
  io.position.set(-3.25, 1.1, 0);
  ioG.add(io);
  group.add(ioG);
  parts.push({
    name: 'Triple-Slot I/O Shield', description: 'Houses HDMI 2.1a and DisplayPort 2.1 connectors, securing the heavy beast to the PC case.', material: 'Steel', function: 'Display output', assemblyOrder: 10, connections: ['PCB'], failureEffect: 'Loose connections', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-2, y:0, z:0}
  });

  const quizQuestions = [
    { question: 'What is the primary difference between a CPU and a GPU architecture?', options: ['GPUs are slower', 'CPUs have a few very fast, complex cores. GPUs have thousands of simpler, slower cores designed for parallel math.', 'GPUs use hard drives instead of RAM', 'CPUs cannot do math'], correct: 1, explanation: 'CPUs are designed to do a few complex tasks sequentially very fast. GPUs are designed to do thousands of simple geometry/pixel calculations simultaneously.', difficulty: 'basic' },
    { question: 'What is GDDR6X VRAM?', options: ['Virtual Random Access Memory', 'Extreme bandwidth Video RAM using PAM4 signaling to transmit double the data per clock cycle.', 'Variable Rate Acoustic Modulation', 'Vapor RAM'], correct: 1, explanation: 'GDDR6X is ultra-fast VRAM that uses pulse-amplitude modulation (PAM4) to achieve massive memory bandwidth, essential for 4K ray tracing.', difficulty: 'advanced' },
    { question: 'Why do modern high-end GPUs use a Vapor Chamber instead of just copper heatpipes?', options: ['Because it looks cooler', 'Because a vapor chamber spreads intense hotspot heat across a much larger 2D plane instantaneously via phase-change.', 'To make it lighter', 'To hold more VRAM'], correct: 1, explanation: 'Modern GPU dies are extremely dense. A vapor chamber pulls heat away from the tiny die instantly and spreads it to all the heatpipes simultaneously.', difficulty: 'expert' },
    { question: 'What is the purpose of the barrier ring on Axial-Tech fans?', options: ['To look like a jet engine', 'To increase RGB lighting', 'To focus airflow downwards with higher static pressure and reduce air dispersion.', 'To prevent fingers from touching the blades'], correct: 2, explanation: 'Barrier rings at the edge of the fan blades prevent air from escaping radially, forcing it directly down into the dense fin stack.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'A state-of-the-art Quad-Slot Graphics Processing Unit featuring massive vapor chamber cooling and axial-tech fans.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      
      // Animate fans: The shroud is meshes[7], and the fans are appended there.
      // In the new code, shroudMain is child 0, rgbStrip is child 1, hole/fans are children 2+
      const shroudGroup = parts[7].runtimeGroup || meshes[7]?.group; // Fallback to meshes if runtimeGroup not bound
      if (shroudGroup) {
          shroudGroup.children.forEach(child => {
              // The fans are Groups, the holes/shrouds are Meshes.
              if (child.isGroup) {
                  child.rotation.y -= t * 30; // High speed fan rotation
              }
          });
      }
      
      // Animate SM cores pulsing
      const dieGroup = parts[3].runtimeGroup || meshes[3]?.group;
      if (dieGroup) {
          // SMs start at child index 2 (base is 0, die is 1)
          for(let i=2; i<dieGroup.children.length; i++) {
              dieGroup.children[i].material.emissiveIntensity = 0.2 + Math.sin(t*15 + i)*0.8;
          }
      }
    }
  };
}
