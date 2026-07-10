// ═══════════════════════════════════════════════════════════════════
// Gear Train
// ═══════════════════════════════════════════════════════════════════
import { steel, darkSteel, brass, chrome, aluminum, rubber, tinted } from '../utils/materials.js';

function makeGear(THREE, radius, thickness, numTeeth, mat) {
  const gearGroup = new THREE.Group();
  // Main disc
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, thickness, 32), mat.clone());
  gearGroup.add(disc);
  // Hub
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, thickness * 1.5, 16), tinted(mat, 0x556677));
  gearGroup.add(hub);
  // Spokes / lightening holes
  if (radius > 0.4) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.6, thickness * 0.8, 0.04), mat.clone());
      spoke.position.set(Math.sin(a) * radius * 0.4, 0, Math.cos(a) * radius * 0.4);
      spoke.rotation.y = a;
      gearGroup.add(spoke);
    }
  }
  // Teeth
  const toothH = radius * 0.12;
  const toothW = (2 * Math.PI * radius) / (numTeeth * 2.5);
  for (let i = 0; i < numTeeth; i++) {
    const a = (i / numTeeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(toothW, thickness * 0.9, toothH), mat.clone());
    tooth.position.set(
      Math.sin(a) * (radius + toothH / 2),
      0,
      Math.cos(a) * (radius + toothH / 2)
    );
    tooth.rotation.y = -a;
    gearGroup.add(tooth);
  }
  return gearGroup;
}

export function createGears(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Large Spur Gear (40 teeth)
  const g1G = makeGear(THREE, 1.0, 0.2, 40, steel);
  g1G.position.set(-1.2, 0, 0);
  const largeG = new THREE.Group();
  largeG.add(g1G);
  group.add(largeG);
  parts.push({ name: 'Large Spur Gear', description: 'Primary driver gear with 40 teeth. Straight-cut teeth for simplicity. Lower speed, higher torque.', material: 'Alloy Steel (case-hardened)', function: 'Primary torque transmission, speed reduction', assemblyOrder: 3, connections: ['Medium Spur Gear', 'Input Shaft'], failureEffect: 'Total drivetrain failure — no power transmission', cascadeFailures: ['Medium Spur Gear', 'Input Shaft'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:-3,y:0,z:0} });

  // 2. Medium Spur Gear (24 teeth)
  const g2G = makeGear(THREE, 0.6, 0.2, 24, tinted(steel, 0x99aabb));
  g2G.position.set(0.4, 0, 0);
  const medG = new THREE.Group();
  medG.add(g2G);
  group.add(medG);
  parts.push({ name: 'Medium Spur Gear', description: 'Intermediate gear with 24 teeth. Gear ratio 40:24 (1.67:1) — rotates faster than large gear.', material: 'Alloy Steel', function: 'Intermediate speed/torque conversion', assemblyOrder: 4, connections: ['Large Spur Gear', 'Small Spur Gear'], failureEffect: 'Interrupted gear train, no output', cascadeFailures: ['Small Spur Gear'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:2} });

  // 3. Small Spur Gear (16 teeth)
  const g3G = makeGear(THREE, 0.4, 0.2, 16, tinted(steel, 0xaabbcc));
  g3G.position.set(1.5, 0, 0);
  const smallG = new THREE.Group();
  smallG.add(g3G);
  group.add(smallG);
  parts.push({ name: 'Small Spur Gear', description: 'Output gear with 16 teeth. Total ratio 40:16 (2.5:1) — rotates 2.5× faster than input with 40% torque.', material: 'Alloy Steel', function: 'High-speed output', assemblyOrder: 5, connections: ['Medium Spur Gear', 'Output Shaft'], failureEffect: 'No output — drivetrain disconnected', cascadeFailures: ['Output Shaft'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:3,y:0,z:0} });

  // 4. Bevel Gear A
  const bevelAG = new THREE.Group();
  const bevelACone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.4, 24), brass.clone());
  bevelACone.position.set(-1.2, 1.8, -2);
  bevelACone.rotation.x = Math.PI;
  bevelAG.add(bevelACone);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.04), brass.clone());
    t.position.set(-1.2 + Math.sin(a) * 0.5, 1.62, -2 + Math.cos(a) * 0.5);
    bevelAG.add(t);
  }
  const bevelAShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8), chrome.clone());
  bevelAShaft.position.set(-1.2, 2.15, -2);
  bevelAG.add(bevelAShaft);
  group.add(bevelAG);
  parts.push({ name: 'Bevel Gear A', description: 'Conical gear transferring rotation between perpendicular shafts. Spiral bevel type reduces noise at higher speeds.', material: 'Brass / Steel', function: 'Transfer rotation 90° between shafts', assemblyOrder: 6, connections: ['Bevel Gear B'], failureEffect: 'Cannot transmit to perpendicular shaft', cascadeFailures: ['Bevel Gear B'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:-3,y:3,z:-2} });

  // 5. Bevel Gear B (perpendicular)
  const bevelBG = new THREE.Group();
  const bevelBCone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.4, 24), tinted(brass, 0xbbaa55));
  bevelBCone.position.set(-1.2, 1.6, -2);
  bevelBCone.rotation.z = Math.PI / 2;
  bevelBG.add(bevelBCone);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.06), tinted(brass, 0xbbaa55));
    t.position.set(-1.2 + 0.22, 1.6 + Math.sin(a) * 0.5, -2 + Math.cos(a) * 0.5);
    bevelBG.add(t);
  }
  const bevelBShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8), chrome.clone());
  bevelBShaft.rotation.z = Math.PI / 2;
  bevelBShaft.position.set(-0.8, 1.6, -2);
  bevelBG.add(bevelBShaft);
  group.add(bevelBG);
  parts.push({ name: 'Bevel Gear B', description: 'Mating bevel gear perpendicular to Gear A. Together they redirect the drive axis by 90°.', material: 'Brass / Steel', function: 'Receive 90° redirected rotation', assemblyOrder: 7, connections: ['Bevel Gear A'], failureEffect: 'No perpendicular power transmission', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:3,z:-4} });

  // 6. Worm Gear
  const wormG = new THREE.Group();
  const wormShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.5, 16), chrome.clone());
  wormShaft.rotation.z = Math.PI / 2;
  wormShaft.position.set(1.5, 1.8, -2);
  wormG.add(wormShaft);
  // Helical thread on worm
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 8;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.04), steel.clone());
    seg.position.set(
      1.5 + (i - 10) * 0.07,
      1.8 + Math.sin(a) * 0.15,
      -2 + Math.cos(a) * 0.15
    );
    seg.rotation.x = a;
    wormG.add(seg);
  }
  group.add(wormG);
  parts.push({ name: 'Worm Gear', description: 'Screw-like gear with helical thread. Very high gear ratio in single stage. Self-locking property prevents back-driving.', material: 'Hardened Steel', function: 'High reduction ratio, self-locking drive', assemblyOrder: 8, connections: ['Worm Wheel'], failureEffect: 'No worm drive output — high-reduction path fails', cascadeFailures: ['Worm Wheel'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:3,y:3,z:-2} });

  // 7. Worm Wheel
  const wwG = new THREE.Group();
  const wwDisc = makeGear(THREE, 0.5, 0.15, 30, tinted(brass, 0xccbb66));
  wwDisc.rotation.x = Math.PI / 2;
  wwDisc.position.set(1.5, 1.3, -2);
  wwG.add(wwDisc);
  group.add(wwG);
  parts.push({ name: 'Worm Wheel', description: 'Helical gear meshing with worm at 90°. Typical reduction ratios 10:1 to 100:1 in a single stage.', material: 'Bronze (phosphor bronze for wear)', function: 'Receive high-ratio reduced rotation from worm', assemblyOrder: 9, connections: ['Worm Gear'], failureEffect: 'No output from worm drive', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:3,y:0,z:-4} });

  // 8. Input Shaft
  const inShaftG = new THREE.Group();
  const inShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 12), chrome.clone());
  inShaft.position.set(-1.2, 0, 0);
  inShaftG.add(inShaft);
  const keyway = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.3, 0.03), steel.clone());
  keyway.position.set(-1.2, 1.2, 0.07);
  inShaftG.add(keyway);
  group.add(inShaftG);
  parts.push({ name: 'Input Shaft', description: 'Receives rotational input from motor/engine. Keyed for positive gear engagement. Ground and hardened surface.', material: 'Chrome-Moly Steel', function: 'Transmit input torque to gear train', assemblyOrder: 1, connections: ['Large Spur Gear', 'Bearing Mounts'], failureEffect: 'No input power to gear train', cascadeFailures: ['Large Spur Gear'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:-3,y:2,z:2} });

  // 9. Output Shaft
  const outShaftG = new THREE.Group();
  const outShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.0, 12), chrome.clone());
  outShaft.position.set(1.5, 0, 0);
  outShaftG.add(outShaft);
  group.add(outShaftG);
  parts.push({ name: 'Output Shaft', description: 'Delivers converted torque/speed to driven equipment. Smaller diameter reflects higher speed, lower torque.', material: 'Chrome-Moly Steel', function: 'Deliver output to driven equipment', assemblyOrder: 2, connections: ['Small Spur Gear', 'Bearing Mounts'], failureEffect: 'No power delivery to load', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:3,y:2,z:2} });

  // 10. Bearing Mounts
  const bearMountG = new THREE.Group();
  for (let pos of [{x:-1.2,y:1.0},{x:-1.2,y:-1.0},{x:1.5,y:0.8},{x:1.5,y:-0.8}]) {
    const mount = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.3), darkSteel.clone());
    mount.position.set(pos.x, pos.y, 0);
    bearMountG.add(mount);
    const bearing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 16), chrome.clone());
    bearing.rotation.x = Math.PI / 2;
    bearing.position.set(pos.x, pos.y, 0);
    bearMountG.add(bearing);
  }
  group.add(bearMountG);
  parts.push({ name: 'Bearing Mounts', description: 'Pillow block bearings supporting shafts. Self-aligning to accommodate minor misalignment. Grease lubricated.', material: 'Cast Iron + Chrome Steel', function: 'Support shafts with minimal friction', assemblyOrder: 10, connections: ['Input Shaft', 'Output Shaft'], failureEffect: 'Shaft wobble, noise, gear mesh misalignment', cascadeFailures: ['Input Shaft', 'Output Shaft'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-3,z:3} });

  const quizQuestions = [
    { question: 'A gear with 40 teeth driving a gear with 16 teeth has a gear ratio of:', options: ['1:2.5', '2.5:1', '1:1', '4:1'], correct: 1, explanation: 'Gear ratio = driver teeth / driven teeth = 40/16 = 2.5:1. Output spins 2.5× faster with 40% torque.', difficulty: 'basic' },
    { question: 'Why are worm gear drives self-locking?', options: ['Friction', 'The helix angle is below the friction angle, preventing back-drive', 'Bearings lock', 'Gravity'], correct: 1, explanation: 'When the worm\'s lead angle is less than the friction angle, the worm wheel cannot drive the worm — it self-locks.', difficulty: 'expert' },
    { question: 'Bevel gears are used to:', options: ['Increase speed', 'Transfer rotation between perpendicular shafts', 'Store energy', 'Reduce noise'], correct: 1, explanation: 'Bevel gears redirect the axis of rotation by 90° (or other angles) between non-parallel shafts.', difficulty: 'basic' },
    { question: 'Helical gears are quieter than spur gears because:', options: ['They\'re lighter', 'Teeth engage gradually rather than all at once', 'They\'re made of bronze', 'They spin slower'], correct: 1, explanation: 'Helical teeth mesh progressively along their length, reducing impact loading and noise compared to spur gears\' sudden full-face engagement.', difficulty: 'advanced' },
    { question: 'Module (m) in gear design equals:', options: ['Pitch diameter / Number of teeth', 'Speed / torque', 'Weight / width', 'Radius × π'], correct: 0, explanation: 'Module m = d/z (pitch diameter divided by tooth count). It standardizes tooth size — meshing gears must have equal module.', difficulty: 'expert' },
    { question: 'If the input shaft delivers 100 Nm at 1000 RPM through a 2.5:1 gear ratio, the output is:', options: ['250 Nm at 400 RPM', '40 Nm at 2500 RPM', '100 Nm at 1000 RPM', '100 Nm at 2500 RPM'], correct: 1, explanation: 'Speed increases by ratio (1000×2.5=2500 RPM), torque decreases inversely (100/2.5=40 Nm). Power stays ~constant.', difficulty: 'advanced' },
  ];

  return {
    group, parts, description: 'A compound gear train featuring spur, bevel, and worm gear assemblies demonstrating speed/torque conversion, axis redirection, and self-locking mechanisms.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Spur gears rotate with correct ratios
      if (meshes[0]) meshes[0].group.rotation.y = t * 1;       // Large: base speed
      if (meshes[1]) meshes[1].group.rotation.y = -t * 1.67;   // Medium: 40/24
      if (meshes[2]) meshes[2].group.rotation.y = t * 2.5;     // Small: 40/16
      // Bevel gears
      if (meshes[3]) meshes[3].group.rotation.y = t * 2;
      if (meshes[4]) meshes[4].group.rotation.x = t * 2;
      // Worm
      if (meshes[5]) meshes[5].group.rotation.x = t * 4;
      // Worm wheel (high reduction ~30:1)
      if (meshes[6]) meshes[6].group.rotation.y = t * 0.13;
      // Shafts
      if (meshes[7]) meshes[7].group.rotation.y = t * 1;
      if (meshes[8]) meshes[8].group.rotation.y = t * 2.5;
    }
  };
}
