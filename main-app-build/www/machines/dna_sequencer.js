export function createDnaSequencer(THREE) {
  const group = new THREE.Group();

  // 1. Machine Housing
  const casingGeo = new THREE.BoxGeometry(4, 5, 4);
  const casingMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.2 });
  const casing = new THREE.Mesh(casingGeo, casingMat);
  casing.position.y = 2.5;
  casing.userData = { id: 'casing', name: 'Sequencer Casing', description: 'Benchtop Next-Generation Sequencer housing.' };
  group.add(casing);

  // 2. Flow Cell Receptacle
  const recGeo = new THREE.BoxGeometry(2, 0.2, 1);
  const recMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const receptacle = new THREE.Mesh(recGeo, recMat);
  receptacle.position.set(0, 3, 1.8);
  group.add(receptacle);
  receptacle.userData = { id: 'receptacle', name: 'Flow Cell Receptacle', description: 'Loads the glass slide where sequencing occurs.' };

  // 3. The Flow Cell
  const flowGeo = new THREE.BoxGeometry(1.8, 0.1, 0.8);
  const flowMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8, metalness: 0.9 });
  const flowCell = new THREE.Mesh(flowGeo, flowMat);
  flowCell.position.set(0, 3.1, 1.8);
  group.add(flowCell);
  flowCell.userData = { id: 'flow_cell', name: 'Glass Flow Cell', description: 'Contains millions of tiny wells with immobilized DNA clusters.' };

  // 4. Optical Scanner / Camera
  const camGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
  const camMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const camera = new THREE.Mesh(camGeo, camMat);
  camera.position.set(0, 4.5, 1.8);
  group.add(camera);
  camera.userData = { id: 'camera', name: 'High-Resolution Camera', description: 'Photographs fluorescent tags as they are incorporated.' };

  // 5. Laser Array
  const laserGeo = new THREE.BoxGeometry(1.5, 0.5, 0.5);
  const laserMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const laser = new THREE.Mesh(laserGeo, laserMat);
  laser.position.set(0, 4.5, 1);
  group.add(laser);
  laser.userData = { id: 'laser', name: 'Laser Excitation Array', description: 'Excites the fluorophores on the nucleotides.' };

  // 6. Reagent Cartridge
  const cartGeo = new THREE.BoxGeometry(3, 1.5, 1.5);
  const cartMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const cartridge = new THREE.Mesh(cartGeo, cartMat);
  cartridge.position.set(0, 1, 1.2);
  group.add(cartridge);
  cartridge.userData = { id: 'cartridge', name: 'Reagent Cartridge', description: 'Contains polymerase enzymes, buffers, and fluorescent dNTPs.' };

  // 7. Microfluidic Pumps
  const pumpGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
  for(let i=-1; i<=1; i+=1) {
    const pump = new THREE.Mesh(pumpGeo, camMat);
    pump.position.set(i, 2.2, 1.2);
    pump.rotation.x = Math.PI / 2;
    group.add(pump);
    if(i===0) pump.userData = { id: 'pumps', name: 'Microfluidic Pumps', description: 'Washes reagents precisely across the flow cell.' };
  }

  // 8. Laser Beam (Visual)
  const beamGeo = new THREE.ConeGeometry(0.8, 1.3, 16, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.set(0, 3.8, 1.8);
  group.add(beam);
  beam.userData = { id: 'laser_beam', name: 'Scanning Laser', description: 'Sweeps across the clusters to trigger fluorescence.' };

  // 9. Touchscreen Interface
  const screenGeo = new THREE.PlaneGeometry(2, 1.5);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x00aaff });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 4, 2.01);
  group.add(screen);
  screen.userData = { id: 'screen', name: 'Control Screen', description: 'Displays sequencing progress and Q-scores.' };

  // 10. Cooling Fan
  const fanGeo = new THREE.TorusGeometry(0.5, 0.1, 8, 16);
  const fanMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const fan = new THREE.Mesh(fanGeo, fanMat);
  fan.position.set(2.01, 2.5, 0);
  fan.rotation.y = Math.PI / 2;
  group.add(fan);
  fan.userData = { id: 'fan', name: 'Thermal Control Exhaust', description: 'Maintains precise temperature for enzymatic reactions.' };

  group.userData.animate = function(delta) {
    // Camera scanning motion
    camera.position.x = Math.sin(Date.now() * 0.002) * 0.8;
    beam.position.x = camera.position.x;
    
    // Change screen color to simulate data reading
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
    if(Math.random() > 0.9) {
      screen.material.color.setHex(colors[Math.floor(Math.random()*colors.length)]);
    }
  };

  group.userData.quiz = [
    { question: "What does Next-Generation Sequencing (NGS) utilize to read DNA?", options: ["Microscopes reading physical letters", "Fluorescently labeled nucleotides that light up when incorporated", "Radioactive isotopes"], answer: 1 },
    { question: "What is the function of the Flow Cell?", options: ["It stores the data", "It holds millions of DNA clusters during the reaction", "It cools the machine"], answer: 1 }
  ];

  return group;
}
