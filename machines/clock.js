// ═══════════════════════════════════════════════════════════════════
// Mechanical Clock
// ═══════════════════════════════════════════════════════════════════
import { brass, steel, darkSteel, chrome, aluminum, glass, copper, whitePlastic, tinted } from '../utils/materials.js';

export function createClock(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Clock Housing
  const housingG = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.15, 16, 48), brass.clone());
  housingG.add(rim);
  const back = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.08, 48), tinted(darkSteel, 0x2a2a35));
  back.position.z = -0.15;
  back.rotation.x = Math.PI / 2;
  housingG.add(back);
  group.add(housingG);
  parts.push({ name: 'Clock Housing', description: 'Outer case protecting the clockwork mechanism. Typically brass or wood frame with glass front.', material: 'Brass', function: 'Protect and display mechanism', assemblyOrder: 1, connections: ['Clock Face'], failureEffect: 'Exposed mechanism, dust ingress', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:-3} });

  // 2. Clock Face / Dial
  const faceG = new THREE.Group();
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.85, 0.04, 48), whitePlastic.clone());
  dial.rotation.x = Math.PI / 2;
  dial.position.z = 0.05;
  faceG.add(dial);
  // Hour markers
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.08, i % 3 === 0 ? 0.25 : 0.15, 0.03), darkSteel.clone());
    marker.position.set(Math.sin(a) * 1.6, Math.cos(a) * 1.6, 0.08);
    marker.rotation.z = -a;
    faceG.add(marker);
  }
  // Center post
  const centerPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.15, 12), brass.clone());
  centerPost.rotation.x = Math.PI / 2;
  centerPost.position.z = 0.15;
  faceG.add(centerPost);
  group.add(faceG);
  parts.push({ name: 'Clock Face', description: 'Dial plate with hour markings (indices). Center arbor supports the clock hands.', material: 'Enameled Metal', function: 'Display time reference points', assemblyOrder: 2, connections: ['Clock Housing', 'Hour Hand', 'Minute Hand'], failureEffect: 'Cannot read time — cosmetic failure', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:2} });

  // 3. Hour Hand
  const hourG = new THREE.Group();
  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 0.025), darkSteel.clone());
  hourHand.position.set(0, 0.45, 0.2);
  hourG.add(hourHand);
  const hourTip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 8), darkSteel.clone());
  hourTip.position.set(0, 1.0, 0.2);
  hourG.add(hourTip);
  group.add(hourG);
  parts.push({ name: 'Hour Hand', description: 'Short hand indicating current hour. Rotates once every 12 hours via gear reduction from the minute hand arbor.', material: 'Blued Steel', function: 'Indicate current hour', assemblyOrder: 8, connections: ['Clock Face', 'Main Gear'], failureEffect: 'Cannot tell hour — only minutes displayed', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:-2,y:0,z:3} });

  // 4. Minute Hand
  const minG = new THREE.Group();
  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.02), tinted(darkSteel, 0x333344));
  minHand.position.set(0, 0.7, 0.25);
  minG.add(minHand);
  const minTip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.15, 8), tinted(darkSteel, 0x333344));
  minTip.position.set(0, 1.5, 0.25);
  minG.add(minTip);
  group.add(minG);
  parts.push({ name: 'Minute Hand', description: 'Longer hand indicating minutes. Completes one revolution per hour. Driven directly by the going train.', material: 'Blued Steel', function: 'Indicate minutes', assemblyOrder: 9, connections: ['Clock Face', 'Main Gear'], failureEffect: 'Cannot tell minutes', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:0,z:3} });

  // 5. Main Gear (Great Wheel)
  const mainGearG = new THREE.Group();
  const gearDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.06, 32), brass.clone());
  gearDisc.rotation.x = Math.PI / 2;
  gearDisc.position.z = -0.3;
  mainGearG.add(gearDisc);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.06), brass.clone());
    tooth.position.set(Math.sin(a) * 0.82, Math.cos(a) * 0.82, -0.3);
    mainGearG.add(tooth);
  }
  group.add(mainGearG);
  parts.push({ name: 'Main Gear', description: 'The great wheel — primary gear in the going train. Directly driven by mainspring. Transfers energy through gear train to escape wheel.', material: 'Brass', function: 'Primary power transmission gear', assemblyOrder: 4, connections: ['Mainspring', 'Escape Wheel', 'Hour Hand', 'Minute Hand'], failureEffect: 'Clock stops completely — no power transmission', cascadeFailures: ['Escape Wheel', 'Hour Hand', 'Minute Hand'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:-3} });

  // 6. Escape Wheel
  const escapeG = new THREE.Group();
  const escDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 24), tinted(brass, 0xccaa44));
  escDisc.rotation.x = Math.PI / 2;
  escDisc.position.set(0, 0.9, -0.3);
  escapeG.add(escDisc);
  for (let i = 0; i < 15; i++) {
    const a = (i / 15) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.04), tinted(brass, 0xddbb55));
    tooth.position.set(Math.sin(a) * 0.48 , 0.9 + Math.cos(a) * 0.48, -0.3);
    tooth.rotation.z = -a;
    escapeG.add(tooth);
  }
  group.add(escapeG);
  parts.push({ name: 'Escape Wheel', description: 'Toothed wheel that interfaces with the anchor/pallet fork. Releases one tooth per pendulum swing, creating the "tick-tock" sound.', material: 'Hardened Brass', function: 'Regulate energy release in ticks', assemblyOrder: 5, connections: ['Main Gear', 'Pendulum'], failureEffect: 'Clock runs too fast/slow or stops', cascadeFailures: ['Pendulum', 'Main Gear'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:2,z:-3} });

  // 7. Pendulum
  const pendG = new THREE.Group();
  const pendRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.5, 8), steel.clone());
  pendRod.position.set(0, -1.3, -0.5);
  pendG.add(pendRod);
  const pendBob = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 24), brass.clone());
  pendBob.position.set(0, -2.5, -0.5);
  pendBob.rotation.x = Math.PI / 2;
  pendG.add(pendBob);
  const adjNut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 6), steel.clone());
  adjNut.position.set(0, -2.6, -0.5);
  pendG.add(adjNut);
  group.add(pendG);
  parts.push({ name: 'Pendulum', description: 'Oscillating weight that regulates timekeeping. Period depends on length: T = 2π√(L/g). Bob position adjusts rate.', material: 'Steel Rod + Brass Bob', function: 'Regulate timekeeping accuracy', assemblyOrder: 6, connections: ['Escape Wheel'], failureEffect: 'Clock stops or runs inaccurately', cascadeFailures: ['Escape Wheel'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-3,z:-3} });

  // 8. Mainspring
  const springG = new THREE.Group();
  const springBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 24), tinted(brass, 0xaa8833));
  springBarrel.rotation.x = Math.PI / 2;
  springBarrel.position.set(0, -0.7, -0.3);
  springG.add(springBarrel);
  // Spiral spring visual
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 6;
    const r = 0.1 + (i / 30) * 0.25;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.06), steel.clone());
    seg.position.set(Math.sin(a) * r, -0.7 + Math.cos(a) * r, -0.3);
    springG.add(seg);
  }
  group.add(springG);
  parts.push({ name: 'Mainspring', description: 'Coiled spring storing potential energy. As it unwinds, it drives the gear train. Needs periodic winding.', material: 'Tempered Carbon Steel', function: 'Store and release energy', assemblyOrder: 3, connections: ['Main Gear'], failureEffect: 'Clock stops — no stored energy', cascadeFailures: ['Main Gear', 'Escape Wheel'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:-2,y:-2,z:-3} });

  // 9. Crown Wheel
  const crownG = new THREE.Group();
  const crownDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16), brass.clone());
  crownDisc.position.set(0.8, 0.3, -0.3);
  crownG.add(crownDisc);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.05), tinted(brass, 0xbbaa44));
    t2.position.set(0.8 + Math.sin(a) * 0.32, 0.3 + Math.cos(a) * 0.32, -0.3);
    crownG.add(t2);
  }
  group.add(crownG);
  parts.push({ name: 'Crown Wheel', description: 'Intermediate gear transferring motion between perpendicular axes. Part of the going train between barrel and center wheel.', material: 'Brass', function: 'Transfer motion between gear stages', assemblyOrder: 7, connections: ['Main Gear', 'Escape Wheel'], failureEffect: 'Gear train interrupted — clock stops', cascadeFailures: ['Main Gear'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:3,y:1,z:-3} });

  const quizQuestions = [
    { question: 'What determines the period of a pendulum?', options: ['Weight of bob', 'Length of pendulum', 'Color of clock', 'Material of rod'], correct: 1, explanation: 'Period T = 2π√(L/g). Only length (L) and gravity (g) affect period. Mass does not matter for small angles.', difficulty: 'advanced' },
    { question: 'What is the function of the escape wheel?', options: ['Store energy', 'Release energy in regulated ticks', 'Display time', 'Wind the spring'], correct: 1, explanation: 'The escape wheel releases one tooth per pendulum oscillation, converting continuous spring energy into discrete ticks.', difficulty: 'basic' },
    { question: 'If a clock runs fast, you should adjust the pendulum bob _____.', options: ['Upward (shorter)', 'Downward (longer)', 'Remove it', 'Add weight'], correct: 1, explanation: 'Lowering the bob increases pendulum length, increasing the period and slowing the clock.', difficulty: 'advanced' },
    { question: 'What stores energy in a mechanical clock?', options: ['Battery', 'Mainspring', 'Pendulum', 'Gears'], correct: 1, explanation: 'The coiled mainspring stores potential energy which is gradually released through the gear train.', difficulty: 'basic' },
    { question: 'The "tick-tock" sound comes from:', options: ['Mainspring unwinding', 'Escape wheel and pallet fork interaction', 'Pendulum hitting the case', 'Hour hand moving'], correct: 1, explanation: 'Each tick and tock is one escape wheel tooth being caught and released by the pallet fork.', difficulty: 'basic' },
    { question: 'A pendulum clock on the Moon would run:', options: ['Faster', 'Slower', 'Same speed', 'Backwards'], correct: 1, explanation: 'Lower gravity (g=1.6 m/s²) on the Moon increases pendulum period: T = 2π√(L/g), making it run slower.', difficulty: 'expert' },
  ];

  return {
    group, parts, description: 'A mechanical timepiece using a mainspring, gear train, escape mechanism, and pendulum to keep accurate time through regulated energy release.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Pendulum swings
      if (meshes[6]) meshes[6].group.rotation.z = Math.sin(t * 3) * 0.15;
      // Escape wheel ticks
      if (meshes[5]) meshes[5].group.rotation.z = Math.floor(t * 3) * (Math.PI / 15);
      // Minute hand
      if (meshes[3]) meshes[3].group.rotation.z = -t * 0.1;
      // Hour hand
      if (meshes[2]) meshes[2].group.rotation.z = -t * 0.008;
      // Main gear
      if (meshes[4]) meshes[4].group.rotation.z = t * 0.05;
    }
  };
}
