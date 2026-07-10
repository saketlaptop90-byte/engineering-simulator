import { glass, plastic, aluminum, copper, steel, darkSteel, gold, tinted } from '../utils/materials.js';
import * as THREE from 'three';

export function createMobile(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Create rounded rectangle shape for the phone body
  const width = 1.4;
  const height = 3.0;
  const radius = 0.2;
  const depth = 0.15;

  const shape = new THREE.Shape();
  const x = -width/2, y = -height/2;
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);

  const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 };
  
  // 1. Midframe (Aluminum Chassis)
  const frameGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  frameGeometry.center();
  const midframe = new THREE.Mesh(frameGeometry, aluminum);
  
  const frameGroup = new THREE.Group();
  frameGroup.add(midframe);
  group.add(frameGroup);
  parts.push({
    name: 'Aluminum Chassis',
    description: 'CNC machined aerospace-grade aluminum midframe.',
    material: 'Aluminum',
    function: 'Provides structural integrity to the device',
    assemblyOrder: 1,
    connections: ['Display', 'Back Glass', 'Mainboard'],
    failureEffect: 'Device bending, internal component stress',
    cascadeFailures: ['Display', 'Mainboard'],
    originalPosition: {x:0, y:0, z:0},
    explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Display Assembly
  const displayMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    emissive: 0x001133,
    emissiveIntensity: 0.2
  });
  
  const displayGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.01, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 });
  displayGeometry.center();
  const display = new THREE.Mesh(displayGeometry, displayMaterial);
  display.position.z = depth / 2 + 0.02;
  
  const displayGroup = new THREE.Group();
  displayGroup.add(display);
  group.add(displayGroup);
  parts.push({
    name: 'OLED Display',
    description: 'Super AMOLED display covered with ultra-tough ceramic glass.',
    material: 'Ceramic Glass / OLED',
    function: 'Visual output and touch interface',
    assemblyOrder: 5,
    connections: ['Aluminum Chassis', 'Display Cable'],
    failureEffect: 'Dead pixels, shattered glass, touch unresponsive',
    cascadeFailures: [],
    originalPosition: {x:0, y:0, z:0},
    explodedPosition: {x:0, y:0, z:1.5}
  });

  // 3. Back Glass
  const backGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x111115,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  const backGlass = new THREE.Mesh(displayGeometry, backGlassMat);
  backGlass.position.z = -(depth / 2 + 0.02);
  
  const backGroup = new THREE.Group();
  backGroup.add(backGlass);
  group.add(backGroup);
  parts.push({
    name: 'Back Glass Panel',
    description: 'Matte frosted glass back panel.',
    material: 'Frosted Glass',
    function: 'Aesthetics and wireless charging passthrough',
    assemblyOrder: 4,
    connections: ['Aluminum Chassis'],
    failureEffect: 'Shattered back',
    cascadeFailures: [],
    originalPosition: {x:0, y:0, z:0},
    explodedPosition: {x:0, y:0, z:-1.5}
  });

  // 4. Camera Array
  const cameraGroup = new THREE.Group();
  
  // Camera Bump
  const bumpW = 0.5;
  const bumpH = 0.7;
  const bumpR = 0.1;
  const bumpShape = new THREE.Shape();
  const bx = -bumpW/2, by = -bumpH/2;
  bumpShape.moveTo(bx, by + bumpR);
  bumpShape.lineTo(bx, by + bumpH - bumpR);
  bumpShape.quadraticCurveTo(bx, by + bumpH, bx + bumpR, by + bumpH);
  bumpShape.lineTo(bx + bumpW - bumpR, by + bumpH);
  bumpShape.quadraticCurveTo(bx + bumpW, by + bumpH, bx + bumpW, by + bumpH - bumpR);
  bumpShape.lineTo(bx + bumpW, by + bumpR);
  bumpShape.quadraticCurveTo(bx + bumpW, by, bx + bumpW - bumpR, by);
  bumpShape.lineTo(bx + bumpR, by);
  bumpShape.quadraticCurveTo(bx, by, bx, by + bumpR);
  
  const bumpGeo = new THREE.ExtrudeGeometry(bumpShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 });
  bumpGeo.center();
  const bump = new THREE.Mesh(bumpGeo, backGlassMat);
  bump.position.set(-width/2 + 0.4, height/2 - 0.5, -(depth / 2 + 0.04));
  cameraGroup.add(bump);

  // Lenses
  const lensGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 32);
  lensGeo.rotateX(Math.PI/2);
  
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.1, clearcoat: 1 });
  const innerLensMat = new THREE.MeshPhysicalMaterial({ color: 0x000022, metalness: 0.5, roughness: 0.1, transmission: 0.9, thickness: 0.5 });
  
  for(let i=0; i<3; i++) {
    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 16, 32), aluminum);
    const innerLens = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 32), innerLensMat);
    innerLens.rotateX(Math.PI/2);
    
    lensRing.position.set(-width/2 + 0.4, height/2 - 0.25 - (i * 0.25), -(depth / 2 + 0.07));
    innerLens.position.copy(lensRing.position);
    
    cameraGroup.add(lensRing);
    cameraGroup.add(innerLens);
  }

  // Flash
  const flash = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), new THREE.MeshBasicMaterial({color: 0xffffee}));
  flash.position.set(-width/2 + 0.65, height/2 - 0.5, -(depth / 2 + 0.06));
  flash.rotateY(Math.PI);
  cameraGroup.add(flash);

  group.add(cameraGroup);
  parts.push({
    name: 'Pro Camera System',
    description: 'Triple lens array: Main, Ultrawide, and Telephoto.',
    material: 'Sapphire Glass / Steel',
    function: 'Photography and AR mapping',
    assemblyOrder: 3,
    connections: ['Mainboard', 'Back Glass Panel'],
    failureEffect: 'Camera won\'t focus, blurry images',
    cascadeFailures: [],
    originalPosition: {x:0, y:0, z:0},
    explodedPosition: {x:0, y:0, z:-2.5}
  });

  // 5. Battery
  const batteryGroup = new THREE.Group();
  const battery = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.8, 0.06), tinted(plastic, 0x111111));
  battery.position.set(0, -0.2, 0);
  batteryGroup.add(battery);
  
  // Battery label
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.062), new THREE.MeshBasicMaterial({color: 0xdddddd}));
  label.position.set(0, -0.2, 0);
  batteryGroup.add(label);
  
  group.add(batteryGroup);
  parts.push({
    name: 'Lithium-Ion Battery',
    description: 'High-density 4500mAh Li-ion battery.',
    material: 'Lithium / Graphite / Aluminum',
    function: 'Provides power to all components',
    assemblyOrder: 2,
    connections: ['Mainboard', 'Aluminum Chassis'],
    failureEffect: 'Phone dies quickly, battery swelling',
    cascadeFailures: ['Aluminum Chassis', 'Display'],
    originalPosition: {x:0, y:0, z:0},
    explodedPosition: {x:1.5, y:0, z:0}
  });

  // 6. Mainboard (PCB)
  const pcbGroup = new THREE.Group();
  
  // Create an L-shaped motherboard using Extrude
  const pcbShape = new THREE.Shape();
  pcbShape.moveTo(-0.5, 1.3);
  pcbShape.lineTo(0.5, 1.3);
  pcbShape.lineTo(0.5, -0.5);
  pcbShape.lineTo(0.1, -0.5);
  pcbShape.lineTo(0.1, 0.6);
  pcbShape.lineTo(-0.5, 0.6);
  pcbShape.lineTo(-0.5, 1.3);
  
  const pcbGeo = new THREE.ExtrudeGeometry(pcbShape, { depth: 0.02, bevelEnabled: false });
  pcbGeo.center();
  const pcb = new THREE.Mesh(pcbGeo, new THREE.MeshStandardMaterial({color: 0x1a4522, roughness: 0.8}));
  pcb.position.set(0.1, 0.9, 0);
  pcbGroup.add(pcb);
  
  // SoC (Processor)
  const soc = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.03), steel);
  soc.position.set(0.2, 1.0, 0.015);
  pcbGroup.add(soc);
  
  // RAM / Storage
  const ram = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.025), darkSteel);
  ram.position.set(-0.15, 1.0, 0.015);
  pcbGroup.add(ram);
  
  group.add(pcbGroup);
  parts.push({
    name: 'Main Logic Board',
    description: 'Multilayer PCB containing the SoC, RAM, Storage, and baseband chips.',
    material: 'Fiberglass / Copper / Silicon',
    function: 'The brain of the smartphone',
    assemblyOrder: 3,
    connections: ['Aluminum Chassis', 'Lithium-Ion Battery', 'Pro Camera System', 'Display'],
    failureEffect: 'Bootloop, total device failure',
    cascadeFailures: [],
    originalPosition: {x:0, y:0, z:0},
    explodedPosition: {x:-1.5, y:0, z:0}
  });

  // 7. Buttons (Power & Volume)
  const buttonsGroup = new THREE.Group();
  const btnMat = aluminum;
  
  // Power button
  const pwrBtn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.04), btnMat);
  pwrBtn.position.set(width/2 + 0.01, 0.4, 0);
  buttonsGroup.add(pwrBtn);
  
  // Volume rocker
  const volBtn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.04), btnMat);
  volBtn.position.set(-width/2 - 0.01, 0.3, 0);
  buttonsGroup.add(volBtn);
  
  group.add(buttonsGroup);
  parts.push({
    name: 'Tactile Buttons',
    description: 'Volume rocker and sleep/wake button.',
    material: 'Aluminum',
    function: 'Physical user input',
    assemblyOrder: 1,
    connections: ['Aluminum Chassis', 'Main Logic Board'],
    failureEffect: 'Cannot turn on screen, stuck volume',
    cascadeFailures: [],
    originalPosition: {x:0, y:0, z:0},
    explodedPosition: {x:0, y:1.5, z:0}
  });

  group.rotation.x = -Math.PI / 8;
  group.rotation.y = Math.PI / 6;

  return { group, parts, animationClips: [] };
}
