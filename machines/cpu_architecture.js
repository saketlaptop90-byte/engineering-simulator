import { steel, aluminum, darkSteel, gold, copper, glass } from '../utils/materials.js';

export function createCPU(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Material for the green PCB substrate
  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x004400, roughness: 0.9, metalness: 0.1
  });

  // Material for the glowing logic gates/silicon
  const siliconMat = new THREE.MeshStandardMaterial({
    color: 0x222222, emissive: 0x0088ff, emissiveIntensity: 0.2, roughness: 0.2, metalness: 0.8
  });

  // 1. CPU Substrate (PCB)
  const subG = new THREE.Group();
  const sub = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.1, 4.0), pcbMat);
  subG.add(sub);
  
  // Add bottom contact pads (LGA pins)
  for(let i=0; i<20; i++) {
      for(let j=0; j<20; j++) {
          const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 8), gold.clone());
          pad.position.set(-1.9 + i*0.2, -0.06, -1.9 + j*0.2);
          subG.add(pad);
      }
  }
  group.add(subG);
  parts.push({
    name: 'PCB Substrate & LGA Pads', description: 'Fiberglass board routing microscopic silicon connections to macroscopic motherboard pins.', material: 'FR4 / Gold', function: 'Structural and electrical interface', assemblyOrder: 1, connections: ['Silicon Die', 'Motherboard Socket'], failureEffect: 'Bent pins / Dead CPU', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2, z:0}
  });

  // 2. Silicon Die (The Brain)
  const dieG = new THREE.Group();
  const die = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 2.2), siliconMat);
  die.position.y = 0.075;
  dieG.add(die);
  group.add(dieG);
  parts.push({
    name: 'Silicon Die', description: 'Billions of nanometer-scale transistors etched into monocrystalline silicon.', material: 'Silicon / Dopants', function: 'Computation', assemblyOrder: 2, connections: ['PCB Substrate'], failureEffect: 'Transistor breakdown', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 3. Core Logic (ALU & Control Unit)
  const coreG = new THREE.Group();
  for(let i=0; i<8; i++) { // 8-core CPU
      const core = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.45), gold.clone());
      core.position.set(-0.6 + (i%4)*0.4, 0.11, i<4 ? -0.5 : 0.5);
      coreG.add(core);
  }
  group.add(coreG);
  parts.push({
    name: 'CPU Cores (ALU)', description: '8 discrete execution cores containing Arithmetic Logic Units.', material: 'Silicon Logic Gates', function: 'Math and Logic execution', assemblyOrder: 3, connections: ['L1/L2 Cache'], failureEffect: 'Calculation errors (Blue Screen)', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1, z:0}
  });

  // 4. L3 Cache
  const cacheG = new THREE.Group();
  const cache = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, 0.3), darkSteel.clone());
  cache.position.set(0, 0.11, 0);
  cacheG.add(cache);
  group.add(cacheG);
  parts.push({
    name: 'L3 Shared Cache', description: 'Ultra-fast SRAM shared across all cores to store immediate instructions.', material: 'SRAM Cells', function: 'Memory buffer', assemblyOrder: 4, connections: ['CPU Cores', 'Memory Controller'], failureEffect: 'Severe performance drop', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1.5, z:0}
  });

  // 5. Memory Controller & PCIe Lanes
  const ioG = new THREE.Group();
  const ioDie = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, 0.2), copper.clone());
  ioDie.position.set(0, 0.11, 0.9);
  ioG.add(ioDie);
  group.add(ioG);
  parts.push({
    name: 'I/O Die & Memory Controller', description: 'Handles communication between the cores, RAM, and PCIe devices (GPU/SSD).', material: 'Silicon', function: 'Data routing', assemblyOrder: 5, connections: ['Silicon Die'], failureEffect: 'RAM not detected', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 6. Thermal Interface Material (TIM)
  const timG = new THREE.Group();
  const tim = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.02, 2.2), aluminum.clone());
  tim.position.y = 0.13;
  timG.add(tim);
  group.add(timG);
  parts.push({
    name: 'Thermal Interface (Solder/Paste)', description: 'Transfers extreme heat from the tiny silicon die to the heatspreader.', material: 'Liquid Metal / Indium', function: 'Heat conduction', assemblyOrder: 6, connections: ['Silicon Die', 'IHS'], failureEffect: 'Thermal throttling', cascadeFailures: ['Silicon Die'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 7. Integrated Heat Spreader (IHS)
  const ihsG = new THREE.Group();
  const ihs = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.4, 3.6), steel.clone());
  ihs.position.y = 0.3;
  ihsG.add(ihs);
  group.add(ihsG);
  parts.push({
    name: 'Integrated Heat Spreader (IHS)', description: 'Nickel-plated copper lid protecting the silicon and providing a large surface for the cooler.', material: 'Nickel-plated Copper', function: 'Protection and Heat Spreading', assemblyOrder: 7, connections: ['TIM', 'CPU Cooler'], failureEffect: 'Overheating', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:0}
  });

  // 8. CPU Cooler Base (Coldplate)
  const coolerG = new THREE.Group();
  const plate = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 3.6), copper.clone());
  plate.position.y = 0.6;
  coolerG.add(plate);
  group.add(coolerG);
  parts.push({
    name: 'Cooler Coldplate', description: 'The solid copper base of the heatsink that touches the CPU.', material: 'Solid Copper', function: 'Heat absorption', assemblyOrder: 8, connections: ['IHS', 'Heatpipes'], failureEffect: 'Overheating', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:7, z:0}
  });

  // 9. Heatpipes
  const pipesG = new THREE.Group();
  for(let i=0; i<4; i++) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.0, 16), copper.clone());
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(-1.2 + i*0.8, 0.85, 0);
      pipesG.add(pipe);
  }
  group.add(pipesG);
  parts.push({
    name: 'Heatpipes', description: 'Hollow copper tubes containing vaporizing liquid to move heat instantly.', material: 'Copper / Water vapor', function: 'Heat transport', assemblyOrder: 9, connections: ['Coldplate', 'Fin Stack'], failureEffect: 'Overheating', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:8, z:0}
  });

  // 10. Aluminum Fin Stack
  const finsG = new THREE.Group();
  for(let i=0; i<20; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.5, 0.05), aluminum.clone());
      fin.position.set(0, 2.2, -1.9 + i*0.2);
      finsG.add(fin);
  }
  group.add(finsG);
  parts.push({
    name: 'Heatsink Fins', description: 'Massive surface area for air to blow across and dissipate heat.', material: 'Aluminum', function: 'Heat dissipation', assemblyOrder: 10, connections: ['Heatpipes'], failureEffect: 'Dust clog / Overheating', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:10, z:0}
  });

  const quizQuestions = [
    { question: 'What does ALU stand for?', options: ['Arithmetic Logic Unit', 'Asynchronous Local Utility', 'Automated Learning Unit', 'Absolute Logical Underpin'], correct: 0, explanation: 'The ALU is the digital circuit inside a processor that performs all integer arithmetic and bitwise logic operations.', difficulty: 'basic' },
    { question: 'What is the purpose of the L1/L2/L3 Cache?', options: ['To permanently store files', 'To hold data immediately required by the CPU cores because system RAM is too slow', 'To generate graphics', 'To control the fans'], correct: 1, explanation: 'Even fast DDR5 RAM is hundreds of times slower than the CPU core. Cache is ultra-fast SRAM built directly onto the silicon to feed data instantly.', difficulty: 'basic' },
    { question: 'Why are modern CPU dies made of Silicon?', options: ['It is a perfect conductor', 'It is a semiconductor, meaning its conductivity can be controlled to act as an on/off switch (transistor)', 'It is the hardest metal', 'It is completely heat-proof'], correct: 1, explanation: 'By doping silicon with impurities, engineers can create gates that either block or allow electron flow, creating the 1s and 0s of digital logic.', difficulty: 'advanced' },
    { question: 'What is the function of the Integrated Heat Spreader (IHS)?', options: ['To look shiny', 'To prevent the fragile silicon die from being crushed by the cooler, while spreading the heat over a larger area', 'To store electricity', 'To route data to the motherboard'], correct: 1, explanation: 'Silicon dies are as brittle as glass. The IHS protects the die from the heavy mounting pressure of heatsinks while acting as a thermal buffer.', difficulty: 'advanced' },
    { question: 'What phenomenon limits how fast a CPU can run (Clock Speed)?', options: ['Hard drive speed', 'Heat density and quantum tunneling/leakage at nanoscale transistor sizes', 'Monitor refresh rate', 'Internet speed'], correct: 1, explanation: 'As you pump more voltage to switch transistors faster (GHz), the heat generated in a tiny mm² area becomes impossible to cool, and electrons start jumping barriers (quantum tunneling).', difficulty: 'expert' },
    { question: 'What flows inside the copper heatpipes of a CPU cooler?', options: ['Solid copper', 'Liquid nitrogen', 'A small amount of liquid (often water/alcohol) that vaporizes at the hot end and condenses at the cool end', 'Nothing, they are empty'], correct: 2, explanation: 'Heatpipes use phase-change. Heat boils the liquid, the vapor travels up, hits the cold fins, condenses back to liquid, and wicks back down via capillary action.', difficulty: 'expert' },
  ];

  return {
    group, parts, description: 'Microscopic and macroscopic view of a modern multi-core Desktop Processor.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Animate core logic pulsing
      if (meshes[2]) {
        const cores = meshes[2].group;
        for(let i=0; i<8; i++) {
           // Simulate data processing with rapid color/emissive flashing
           const intensity = 0.5 + Math.sin(t*20 + i*1.3)*0.5;
           cores.children[i].material.emissiveIntensity = intensity;
        }
      }
      // Animate data flow in cache
      if (meshes[3]) {
         meshes[3].group.children[0].material.emissiveIntensity = 0.2 + Math.sin(t*15)*0.2;
      }
      // I/O die pulsing
      if (meshes[4]) {
         meshes[4].group.children[0].material.emissiveIntensity = 0.2 + Math.sin(t*5)*0.2;
      }
    }
  };
}
