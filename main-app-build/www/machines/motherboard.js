import { steel, aluminum, darkSteel, gold, copper, glass, redAccent } from '../utils/materials.js';

export function createMotherboard(THREE) {
  const group = new THREE.Group();
  const parts = [];

  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x050505, roughness: 0.9, metalness: 0.1
  });
  
  const slotMat = new THREE.MeshStandardMaterial({
    color: 0x222222, roughness: 0.8
  });

  const traceMat = new THREE.MeshStandardMaterial({
    color: 0x111111, metalness: 0.5, roughness: 0.5
  });

  // 1. ATX PCB
  const pcbG = new THREE.Group();
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.1, 9.6), pcbMat);
  pcbG.add(pcb);
  
  // Add some decorative traces
  for(let i=0; i<10; i++) {
      const trace = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.11, 3.0), traceMat);
      trace.position.set(-2.0 + i*0.2, 0, 1.0);
      pcbG.add(trace);
  }
  group.add(pcbG);
  parts.push({
    name: 'ATX Printed Circuit Board', description: 'Massive multi-layer fiberglass board connecting all components.', material: 'FR4 Fiberglass / Copper Traces', function: 'Electrical foundation', assemblyOrder: 1, connections: ['Case Standoffs'], failureEffect: 'System dead', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 2. CPU Socket (LGA)
  const sockG = new THREE.Group();
  const socket = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 2.5), slotMat);
  socket.position.set(-2.5, 0.1, -1.5);
  sockG.add(socket);
  const latch = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.0, 16), steel.clone());
  latch.rotation.x = Math.PI/2;
  latch.position.set(-1.2, 0.2, -1.5);
  sockG.add(latch);
  group.add(sockG);
  parts.push({
    name: 'CPU Socket (LGA)', description: 'Land Grid Array socket containing thousands of microscopic pins to interface with the CPU.', material: 'Plastic / Gold Pins', function: 'CPU Interface', assemblyOrder: 2, connections: ['PCB', 'CPU'], failureEffect: 'CPU not detected', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1, z:0}
  });

  // 3. VRM Delivery & Heatsinks
  const vrmG = new THREE.Group();
  // Chokes
  for(let i=0; i<14; i++) {
      const choke = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), darkSteel.clone());
      choke.position.set(-4.0, 0.15, -3.5 + i*0.3);
      vrmG.add(choke);
  }
  // Massive Heatsink
  const vrmHs = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 4.5), aluminum.clone());
  vrmHs.position.set(-4.5, 0.5, -1.5);
  vrmG.add(vrmHs);
  group.add(vrmG);
  parts.push({
    name: 'VRM Power Delivery & Heatsink', description: 'Massive power phases that step down 12V EPS power to the 1V required by the CPU. Generates extreme heat.', material: 'Aluminum / Mosfets', function: 'Power Conditioning', assemblyOrder: 3, connections: ['PCB', 'EPS Connector'], failureEffect: 'CPU throttling / Crash under load', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 4. DIMM Slots (RAM)
  const ramG = new THREE.Group();
  for(let i=0; i<4; i++) {
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 5.0), slotMat);
      slot.position.set(0.5 + i*0.4, 0.2, -1.5);
      ramG.add(slot);
      
      // Simulate RAM sticks in slots 2 and 4 (Dual Channel)
      if (i === 1 || i === 3) {
          const stick = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 4.8), darkSteel.clone());
          stick.position.set(0.5 + i*0.4, 0.8, -1.5);
          ramG.add(stick);
      }
  }
  group.add(ramG);
  parts.push({
    name: 'DIMM Slots & RAM', description: 'Slots for DDR Memory. Sticks populated in optimal dual-channel configuration.', material: 'Plastic / Gold', function: 'System Memory', assemblyOrder: 4, connections: ['PCB', 'CPU Memory Controller'], failureEffect: 'No POST / Beep codes', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:0}
  });

  // 5. PCIe Slots
  const pcieG = new THREE.Group();
  const slot1 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 0.3), slotMat);
  slot1.position.set(-1.0, 0.15, 1.5);
  pcieG.add(slot1);
  // Armor on primary slot
  const armor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 0.4), steel.clone());
  armor.position.set(-1.0, 0.15, 1.5);
  pcieG.add(armor);
  
  const slot2 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 0.3), slotMat);
  slot2.position.set(-1.0, 0.15, 3.0);
  pcieG.add(slot2);
  group.add(pcieG);
  parts.push({
    name: 'PCIe Slots (x16)', description: 'High speed lanes connecting GPUs and capture cards directly to the CPU.', material: 'Plastic / Steel Reinforcement', function: 'Expansion cards', assemblyOrder: 5, connections: ['PCB', 'GPU'], failureEffect: 'GPU not detected', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1, z:0}
  });

  // 6. Chipset & Heatsink (PCH)
  const pchG = new THREE.Group();
  const pch = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 2.0), slotMat);
  pch.position.set(3.0, 0.075, 2.5);
  pchG.add(pch);
  const pchHs = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 2.5), aluminum.clone());
  pchHs.position.set(3.0, 0.25, 2.5);
  pchG.add(pchHs);
  group.add(pchG);
  parts.push({
    name: 'PCH (Chipset)', description: 'Platform Controller Hub. Manages slower I/O like USB, SATA, and networking.', material: 'Silicon / Aluminum Heatsink', function: 'I/O Management', assemblyOrder: 6, connections: ['PCB', 'CPU (via DMI)'], failureEffect: 'USB/SATA failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  // 7. M.2 NVMe Slots
  const m2G = new THREE.Group();
  const m2Slot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.8), slotMat);
  m2Slot.position.set(1.5, 0.1, 1.5);
  m2G.add(m2Slot);
  const m2Drive = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 3.2), pcbMat);
  m2Drive.position.set(2.0, 0.1, 1.5);
  m2Drive.rotation.y = Math.PI/2;
  m2G.add(m2Drive);
  group.add(m2G);
  parts.push({
    name: 'M.2 NVMe Storage', description: 'Ultra-fast solid state drive bolted directly to the motherboard, using PCIe lanes.', material: 'PCB / Silicon', function: 'Storage', assemblyOrder: 7, connections: ['PCB'], failureEffect: 'Boot failure (No OS)', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 8. 24-pin ATX & EPS Power Connectors
  const pwrG = new THREE.Group();
  const atx = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 2.0), slotMat);
  atx.position.set(5.0, 0.3, -2.0);
  pwrG.add(atx);
  const eps = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.8), slotMat);
  eps.position.set(-5.0, 0.3, -4.0);
  pwrG.add(eps);
  group.add(pwrG);
  parts.push({
    name: 'Power Connectors (ATX/EPS)', description: 'Receives power from the Power Supply Unit.', material: 'Plastic / Metal Pins', function: 'Power input', assemblyOrder: 8, connections: ['PCB', 'PSU'], failureEffect: 'No power', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:1.5, z:0}
  });

  // 9. Rear I/O Panel
  const ioG = new THREE.Group();
  const ioBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 4.0), steel.clone());
  ioBox.position.set(-5.25, 0.65, -1.0);
  ioG.add(ioBox);
  group.add(ioG);
  parts.push({
    name: 'Rear I/O Shield', description: 'Houses USB ports, Ethernet, Audio, and WiFi antennas.', material: 'Steel', function: 'External device connection', assemblyOrder: 9, connections: ['PCB'], failureEffect: 'Peripherals disconnected', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-2, y:0, z:0}
  });

  // 10. CMOS Battery
  const cmosG = new THREE.Group();
  const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16), steel.clone());
  bat.position.set(0, 0.1, 3.5);
  cmosG.add(bat);
  group.add(cmosG);
  parts.push({
    name: 'CMOS Battery (CR2032)', description: 'Keeps the BIOS/UEFI settings and real-time clock alive when unplugged.', material: 'Lithium', function: 'Volatile memory retention', assemblyOrder: 10, connections: ['PCB'], failureEffect: 'BIOS clock resets', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:0}
  });

  const quizQuestions = [
    { question: 'What is the purpose of the Motherboard?', options: ['To perform math calculations', 'To act as the central nervous system connecting the CPU, RAM, GPU, and Storage together', 'To provide electricity to the wall', 'To cool the CPU'], correct: 1, explanation: 'The motherboard itself does little computation. It provides the physical and electrical pathways (traces/lanes) for components to talk to each other.', difficulty: 'basic' },
    { question: 'Why is there a battery (CMOS) on the motherboard?', options: ['To power the PC if the power goes out', 'To keep the system clock and BIOS settings saved while unplugged', 'To power the fans', 'It is a backup for the GPU'], correct: 1, explanation: 'The BIOS settings are stored in volatile memory. If the PC is completely unplugged from the wall, the CR2032 coin battery keeps that tiny memory alive.', difficulty: 'basic' },
    { question: 'What does VRM stand for and what does it do?', options: ['Virtual RAM Module', 'Voltage Regulator Module - it steps down the 12V from the power supply to the exact ~1V needed by the CPU', 'Video Render Matrix', 'Variable Rate Memory'], correct: 1, explanation: 'CPUs draw massive amperage at very low voltages. The VRMs filter and step down the 12V input to clean, highly-stable 1-1.3V for the delicate silicon.', difficulty: 'advanced' },
    { question: 'What is the PCH (Chipset)?', options: ['The main CPU core', 'Platform Controller Hub - it handles slower I/O like SATA and USB, freeing the CPU to only handle fast PCIe lanes', 'The RAM controller', 'The audio chip'], correct: 1, explanation: 'The CPU connects directly to fast things (RAM, GPU). Everything else (USB, Audio, SATA drives, Network) connects to the Chipset, which then talks to the CPU over a DMI link.', difficulty: 'advanced' },
    { question: 'Why are primary PCIe slots often reinforced with steel armor?', options: ['To look cool', 'To prevent electromagnetic interference', 'To prevent the heavy weight of massive modern GPUs from ripping the plastic slot off the PCB', 'To conduct heat'], correct: 2, explanation: 'Modern GPUs weigh 4+ pounds. This extreme weight causes GPU sag and can physically tear a plastic PCIe slot off the board during shipping or movement.', difficulty: 'basic' },
    { question: 'What are the tiny lines zig-zagging across the motherboard PCB called?', options: ['Wires', 'Traces', 'Cables', 'Pipes'], correct: 1, explanation: 'Traces are copper pathways etched into the fiberglass PCB layers. They are often zig-zagged to ensure signals traveling on parallel traces arrive at the exact same time (trace length matching).', difficulty: 'expert' },
  ];

  return {
    group, parts, description: 'The ATX Motherboard. The foundation of the modern PC.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Animate traces glowing (simulate data transfer)
      if (meshes[0]) {
          const traces = meshes[0].group;
          // traces start at index 1
          for(let i=1; i<traces.children.length; i++) {
              traces.children[i].material.emissive.setHex(0x0088ff);
              traces.children[i].material.emissiveIntensity = Math.max(0, Math.sin(t*5 + i*0.5));
          }
      }
      // PCH Heatsink pulse
      if (meshes[5]) {
          meshes[5].group.children[1].position.y = 0.25 + Math.sin(t*2)*0.01;
      }
    }
  };
}
