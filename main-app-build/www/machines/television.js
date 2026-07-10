import { plastic, glass, aluminum, greenPCB, copper, blackPlastic } from '../utils/materials.js';
import * as THREE from 'three';

export function createTelevision(THREE_arg) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Display Panel
  const panelG = new THREE.Group();
  const panel = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.25, 0.05), glass.clone());
  panelG.add(panel);
  group.add(panelG);
  parts.push({
    name: 'Display Panel', description: 'Liquid Crystal Display (LCD) layer.', material: 'Glass/Liquid Crystal', function: 'Pixel color generation', assemblyOrder: 9, connections: ['Backlight Unit', 'T-Con Board'], failureEffect: 'Dead pixels or cracked screen', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:1.5}
  });

  // 2. Backlight Unit
  const ledG = new THREE.Group();
  const leds = new THREE.Mesh(new THREE.BoxGeometry(3.9, 2.15, 0.05), plastic.clone());
  leds.position.z = -0.1;
  ledG.add(leds);
  group.add(ledG);
  parts.push({
    name: 'Backlight Unit', description: 'LED array providing illumination.', material: 'LEDs/Diffuser', function: 'Light source', assemblyOrder: 1, connections: ['Display Panel', 'Power Supply'], failureEffect: 'Dark screen / visible patches', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0.5}
  });

  // 3. T-Con Board
  const tconG = new THREE.Group();
  const tcon = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 0.05), greenPCB.clone());
  tcon.position.set(0, -0.8, -0.2);
  tconG.add(tcon);
  group.add(tconG);
  parts.push({
    name: 'T-Con Board', description: 'Timing Controller board.', material: 'PCB', function: 'Drives individual pixels row by row', assemblyOrder: 5, connections: ['Main Board', 'Display Panel'], failureEffect: 'Vertical lines or ghosting on screen', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-1.5, z:-0.5}
  });

  // 4. Power Supply Board
  const psuG = new THREE.Group();
  const psu = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.1), greenPCB.clone());
  psu.position.set(-0.8, 0.2, -0.2);
  psuG.add(psu);
  group.add(psuG);
  parts.push({
    name: 'Power Supply Board', description: 'AC to DC converter.', material: 'PCB/Capacitors', function: 'Provides varying voltages to components', assemblyOrder: 2, connections: ['Main Board', 'Backlight Unit'], failureEffect: 'TV won\'t turn on / clicking relay', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-1.5, y:0, z:-1}
  });

  // 5. Main Board
  const mainG = new THREE.Group();
  const main = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.05), greenPCB.clone());
  main.position.set(0.8, 0.2, -0.2);
  mainG.add(main);
  group.add(mainG);
  parts.push({
    name: 'Main Board', description: 'Video processor and smart TV SoC.', material: 'PCB', function: 'Signal processing, HDMI inputs, WiFi', assemblyOrder: 3, connections: ['Power Supply Board', 'T-Con Board', 'Speakers'], failureEffect: 'No signal / smart features fail', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:1.5, y:0, z:-1}
  });

  // 6. Speakers
  const spkG = new THREE.Group();
  const spkL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), blackPlastic.clone());
  spkL.position.set(-1.5, -1.0, -0.15);
  spkG.add(spkL);
  const spkR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), blackPlastic.clone());
  spkR.position.set(1.5, -1.0, -0.15);
  spkG.add(spkR);
  group.add(spkG);
  parts.push({
    name: 'Speakers', description: 'Bottom-firing stereo speakers.', material: 'Plastic/Magnets', function: 'Audio output', assemblyOrder: 4, connections: ['Main Board'], failureEffect: 'No sound / distorted audio', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-2.5, z:0}
  });

  // 7. Bezel Frame
  const bezelG = new THREE.Group();
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(4.1, 2.35, 0.1), aluminum.clone());
  bezel.position.z = -0.05;
  bezelG.add(bezel);
  group.add(bezelG);
  parts.push({
    name: 'Bezel Frame', description: 'Thin metallic border.', material: 'Aluminum', function: 'Structural edge protection', assemblyOrder: 8, connections: ['Back Cover', 'Display Panel'], failureEffect: 'Cosmetic damage', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:2.5}
  });

  // 8. Stand
  const standG = new THREE.Group();
  const stand1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.6), steel.clone());
  stand1.position.set(0, -1.2, 0);
  standG.add(stand1);
  const stand2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16), steel.clone());
  stand2.position.set(0, -1.0, 0);
  standG.add(stand2);
  group.add(standG);
  parts.push({
    name: 'Base Stand', description: 'Center pedestal.', material: 'Steel/Plastic', function: 'Supports the TV weight', assemblyOrder: 6, connections: ['Back Cover'], failureEffect: 'TV tips over', cascadeFailures: ['Display Panel'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 9. Back Cover
  const coverG = new THREE.Group();
  const cover = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.25, 0.3), blackPlastic.clone());
  cover.position.z = -0.25;
  coverG.add(cover);
  group.add(coverG);
  parts.push({
    name: 'Back Cover', description: 'Rear plastic casing with ventilation.', material: 'Plastic', function: 'Protects internals and provides mounting points', assemblyOrder: 7, connections: ['Bezel Frame', 'Stand'], failureEffect: 'Exposed electronics', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:-2.5}
  });

  const quizQuestions = [
    { question: 'What is the primary difference between OLED and LCD TVs?', options: ['LCDs are 4K, OLEDs are 1080p', 'OLED pixels emit their own light, LCDs require a backlight', 'OLEDs use plasma gas', 'LCDs are curved'], correct: 1, explanation: 'OLED (Organic Light Emitting Diode) pixels are self-illuminating, allowing perfect black levels since pixels can turn completely off.', difficulty: 'basic' },
    { question: 'What is the function of the T-Con board?', options: ['Connect to WiFi', 'Provide power', 'Timing Control - it translates video signals into row/column pixel driving instructions', 'To cool the TV'], correct: 2, explanation: 'The Timing Controller (T-Con) processes the video signal into a format the LCD panel can understand.', difficulty: 'advanced' },
    { question: 'What does HDR stand for in modern TVs?', options: ['High Definition Resolution', 'High Dynamic Range', 'Heavy Duty Rendering', 'Holographic Display Raster'], correct: 1, explanation: 'High Dynamic Range allows the TV to display a wider contrast between the brightest whites and darkest blacks.', difficulty: 'basic' },
    { question: 'If a TV has sound but a completely black screen, what is the most likely failure?', options: ['Main board', 'Speakers', 'Backlight Unit or Power Supply LED driver', 'HDMI Cable'], correct: 2, explanation: 'The flashlight test (shining a light at the screen) will often reveal a faint image if the backlight has failed.', difficulty: 'expert' },
    { question: 'Refresh rate (e.g., 120Hz) refers to:', options: ['How many watts the TV uses', 'How many times per second the screen draws a new image', 'The audio sampling rate', 'The electrical grid frequency'], correct: 1, explanation: '120Hz means the screen updates 120 times per second, resulting in smoother motion for sports and gaming.', difficulty: 'basic' },
    { question: 'Local dimming is a feature used in:', options: ['OLED TVs', 'LED/LCD TVs to turn off specific backlight zones for better contrast', 'CRT TVs', 'Plasma TVs'], correct: 1, explanation: 'Since LCDs block light from an always-on backlight, local dimming turns off LEDs behind dark areas of the image to improve black levels.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'A modern flat-panel television.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[0]) {
        if (!meshes[0].group.children[0].material.emissive) {
          meshes[0].group.children[0].material = meshes[0].group.children[0].material.clone();
        }
        meshes[0].group.children[0].material.emissive.setHex(0x5588cc);
        meshes[0].group.children[0].material.emissiveIntensity = Math.sin(t*2)*0.1 + 0.3;
      }
    }
  };
}
