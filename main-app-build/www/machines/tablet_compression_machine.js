export function createTabletCompressionMachine(THREE) {
  const group = new THREE.Group();

  const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.3 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.5 });
  const powderMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

  // 1. Main Frame
  const frameGeo = new THREE.BoxGeometry(6, 12, 6);
  const frame = new THREE.Mesh(frameGeo, darkMetal);
  frame.userData = { id: 'frame', name: 'Machine Housing', description: 'Heavy cast-iron frame absorbing massive compression forces.' };
  group.add(frame);

  // 2. Feed Hopper
  const hopperGeo = new THREE.CylinderGeometry(2, 0.5, 4, 32);
  const hopper = new THREE.Mesh(hopperGeo, metalMat);
  hopper.position.set(0, 8, 0);
  hopper.userData = { id: 'hopper', name: 'Feed Hopper', description: 'Holds the granulated API and excipient powder mixture.' };
  group.add(hopper);

  // 3. Powder Flow
  const flowGeo = new THREE.CylinderGeometry(0.4, 0.4, 2);
  const flow = new THREE.Mesh(flowGeo, powderMat);
  flow.position.set(0, 5, 0);
  flow.userData = { id: 'powder_flow', name: 'Powder Flow', description: 'Gravity feeds the powder into the die cavity.' };
  group.add(flow);

  // 4. Rotary Turret / Die Table
  const turretGeo = new THREE.CylinderGeometry(4, 4, 1, 32);
  const turret = new THREE.Mesh(turretGeo, metalMat);
  turret.position.set(0, 2, 0);
  turret.userData = { id: 'turret', name: 'Rotary Turret / Die Table', description: 'Spins rapidly, carrying multiple dies for high-speed production.' };
  group.add(turret);

  // 5. Upper Punch
  const upperPunchGeo = new THREE.CylinderGeometry(0.5, 0.5, 3);
  const punchMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1 });
  const upperPunch = new THREE.Mesh(upperPunchGeo, punchMat);
  upperPunch.position.set(2, 4.5, 0);
  upperPunch.userData = { id: 'upper_punch', name: 'Upper Punch', description: 'Descends to compress the powder into a tablet.' };
  group.add(upperPunch);

  // 6. Lower Punch
  const lowerPunch = new THREE.Mesh(upperPunchGeo, punchMat);
  lowerPunch.position.set(2, -0.5, 0);
  lowerPunch.userData = { id: 'lower_punch', name: 'Lower Punch', description: 'Determines fill depth and ejects the finished tablet.' };
  group.add(lowerPunch);

  // 7. Die Cavity
  const dieGeo = new THREE.CylinderGeometry(0.6, 0.6, 1, 16);
  const dieMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });
  const die = new THREE.Mesh(dieGeo, dieMat);
  die.position.set(2, 2, 0);
  die.userData = { id: 'die_cavity', name: 'Die Cavity', description: 'The mold that determines the shape and size of the tablet.' };
  group.add(die);

  // 8. Compression Rollers
  const rollerGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
  const rollerMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.6 });
  const upperRoller = new THREE.Mesh(rollerGeo, rollerMat);
  upperRoller.position.set(2, 6.5, 0);
  upperRoller.rotation.x = Math.PI / 2;
  upperRoller.userData = { id: 'upper_roller', name: 'Main Compression Roller', description: 'Applies tons of force to the upper punch.' };
  group.add(upperRoller);

  // 9. Ejection Cam
  const camGeo = new THREE.BoxGeometry(1, 1, 2);
  const camMat = new THREE.MeshStandardMaterial({ color: 0x992222 });
  const cam = new THREE.Mesh(camGeo, camMat);
  cam.position.set(-2, 1, 0);
  cam.userData = { id: 'ejection_cam', name: 'Ejection Cam', description: 'Pushes the lower punch up to eject the tablet.' };
  group.add(cam);

  // 10. Finished Tablet
  const tabletGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
  const tablet = new THREE.Mesh(tabletGeo, powderMat);
  tablet.position.set(-2, 2.6, 0);
  tablet.userData = { id: 'tablet', name: 'Finished Tablet', description: 'Compressed solid dosage form ready for coating.' };
  group.add(tablet);

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;
    
    // Animate punching cycle
    upperPunch.position.y = 4.5 - Math.max(0, Math.sin(t)) * 1.5;
    
    // Turret rotation (visual)
    turret.rotation.y -= 0.02;
    upperRoller.rotation.y += 0.05;
    
    // Tablet popping out
    if (Math.sin(t) > 0.9) {
      tablet.position.y = 2.6 + (Math.sin(t) - 0.9) * 5;
    } else {
      tablet.position.y = 2.6;
    }
  };

  group.userData.quiz = [
    { question: "What controls the weight of the final tablet?", options: ["The upper compression roller", "The position of the lower punch during filling", "The speed of the turret"], answer: 1 },
    { question: "What is the purpose of excipients in the powder blend?", options: ["To add color only", "To provide the active medical effect", "To act as binders, fillers, and lubricants for compression"], answer: 2 }
  ];

  return group;
}
