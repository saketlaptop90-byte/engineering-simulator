export function createOilDrillingRig(THREE) {
  const group = new THREE.Group();

  // 1. Derrick (The Tower)
  const derrickMat = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true });
  const derrickGeo = new THREE.ConeGeometry(2, 10, 4);
  const derrick = new THREE.Mesh(derrickGeo, derrickMat);
  derrick.position.y = 5;
  group.add(derrick);
  derrick.userData = { id: 'derrick', name: 'Drilling Derrick', description: 'The tall structural framework used to support the hoisting equipment.' };

  // 2. Crown Block & Traveling Block (Pulleys)
  const blockGeo = new THREE.BoxGeometry(1, 0.5, 0.5);
  const blockMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
  
  const crownBlock = new THREE.Mesh(blockGeo, blockMat);
  crownBlock.position.y = 9.5;
  group.add(crownBlock);
  crownBlock.userData = { id: 'crown_block', name: 'Crown Block', description: 'The stationary set of pulleys at the top of the derrick.' };

  const travelingBlock = new THREE.Mesh(blockGeo, blockMat);
  travelingBlock.position.y = 7;
  group.add(travelingBlock);
  travelingBlock.userData = { id: 'traveling_block', name: 'Traveling Block', description: 'The moving set of pulleys that moves up and down the derrick, lifting massive weight.' };

  // Cables
  const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5);
  const cableMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const cableLeft = new THREE.Mesh(cableGeo, cableMat);
  cableLeft.position.set(-0.3, 8.25, 0);
  const cableRight = new THREE.Mesh(cableGeo, cableMat);
  cableRight.position.set(0.3, 8.25, 0);
  group.add(cableLeft, cableRight);

  // 3. Top Drive / Kelly (Rotates the pipe)
  const topDriveGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
  const topDriveMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
  const topDrive = new THREE.Mesh(topDriveGeo, topDriveMat);
  topDrive.position.y = 6.25;
  group.add(topDrive);
  topDrive.userData = { id: 'top_drive', name: 'Top Drive Motor', description: 'Provides the immense rotational force (torque) to turn the drill string.' };

  // 4. Drill String (Pipes)
  const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 15);
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9 });
  const drillString = new THREE.Mesh(pipeGeo, pipeMat);
  drillString.position.y = -1;
  group.add(drillString);
  drillString.userData = { id: 'drill_string', name: 'Drill String', description: 'Kilometers of connected steel pipes transmitting rotation and drilling fluid to the bit.' };

  // 5. Drill Bit (Tricone Roller)
  const bitGeo = new THREE.ConeGeometry(0.3, 0.6, 16);
  const bitMat = new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 1 });
  const bit = new THREE.Mesh(bitGeo, bitMat);
  bit.position.y = -8.5;
  bit.rotation.x = Math.PI;
  group.add(bit);
  bit.userData = { id: 'drill_bit', name: 'Tricone Roller Bit', description: 'Studded with tungsten carbide or industrial diamonds to crush solid rock.' };

  // 6. Blowout Preventer (BOP)
  const bopGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
  const bopMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
  const bop = new THREE.Mesh(bopGeo, bopMat);
  bop.position.y = -0.5;
  group.add(bop);
  bop.userData = { id: 'bop', name: 'Blowout Preventer (BOP)', description: 'Massive high-pressure valves designed to shear the pipe and seal the well in an emergency to prevent an oil spill.' };

  // 7. Mud Pumps and Mud Pit
  const pitGeo = new THREE.BoxGeometry(4, 1, 3);
  const pitMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const pit = new THREE.Mesh(pitGeo, pitMat);
  pit.position.set(-4, 0.5, 0);
  group.add(pit);
  
  const mudGeo = new THREE.BoxGeometry(3.8, 0.9, 2.8);
  const mudMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 }); // Brown mud
  const mud = new THREE.Mesh(mudGeo, mudMat);
  mud.position.set(-4, 0.6, 0);
  group.add(mud);
  mud.userData = { id: 'drilling_mud', name: 'Drilling Mud Pit', description: 'Stores specialized fluid pumped down the well to cool the bit, carry away rock cuttings, and provide hydrostatic pressure to hold back oil/gas.' };

  // Mud Pump
  const pumpGeo = new THREE.CylinderGeometry(0.5, 0.5, 2);
  const pump = new THREE.Mesh(pumpGeo, topDriveMat);
  pump.rotation.z = Math.PI / 2;
  pump.position.set(-2, 1, 0);
  group.add(pump);
  pump.userData = { id: 'mud_pump', name: 'High-Pressure Mud Pump', description: 'Pumps drilling fluid down the center of the drill pipe.' };

  // 8. Shale Shaker
  const shakerGeo = new THREE.BoxGeometry(1.5, 0.5, 2);
  const shakerMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true });
  const shaker = new THREE.Mesh(shakerGeo, shakerMat);
  shaker.position.set(2, 0.5, 0);
  group.add(shaker);
  shaker.userData = { id: 'shale_shaker', name: 'Shale Shaker', description: 'Vibrating screens that filter rock cuttings out of the returning drilling mud so it can be reused.' };

  // 9. Geological Rock Layers
  const layers = [
    { y: -2, color: 0x8b7355, name: 'Sandstone/Aquifer' },
    { y: -4, color: 0x696969, name: 'Shale (Impermeable Seal)' },
    { y: -6, color: 0x111111, name: 'Hydrocarbon Reservoir (Oil/Gas)' },
    { y: -8, color: 0x8b8b83, name: 'Limestone Basement' }
  ];
  
  layers.forEach((layer) => {
    const layerGeo = new THREE.BoxGeometry(10, 2, 10);
    const layerMat = new THREE.MeshStandardMaterial({ color: layer.color, roughness: 1 });
    const mesh = new THREE.Mesh(layerGeo, layerMat);
    mesh.position.y = layer.y;
    group.add(mesh);
    
    // Drill hole cutout (approximate visually with a black cylinder)
    const holeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.1);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.position.y = layer.y;
    group.add(hole);
    
    mesh.userData = { id: `layer_${layer.y}`, name: layer.name, description: `Geological stratum.` };
  });

  // 10. Oil Deposit (Visual representation inside reservoir)
  const oilGeo = new THREE.BoxGeometry(6, 1.5, 6);
  const oilMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.8 });
  const oil = new THREE.Mesh(oilGeo, oilMat);
  oil.position.set(2, -6, 2);
  group.add(oil);
  oil.userData = { id: 'oil_deposit', name: 'Trapped Petroleum Deposit', description: 'Crude oil trapped under the impermeable shale rock seal.' };

  group.userData.animate = function(delta) {
    // Rotate drill string and top drive
    topDrive.rotation.y -= 0.1;
    drillString.rotation.y -= 0.1;
    bit.rotation.y -= 0.2;

    // Traveling block moves up and down
    const t = Date.now() * 0.001;
    const yPos = 6 + Math.sin(t) * 1;
    travelingBlock.position.y = yPos;
    topDrive.position.y = yPos - 0.75;
    drillString.position.y = yPos - 8.25;
    bit.position.y = yPos - 15.75;

    // Adjust cable heights
    const cableH = 9.5 - yPos;
    cableLeft.scale.y = cableH / 2.5;
    cableRight.scale.y = cableH / 2.5;
    cableLeft.position.y = 9.5 - cableH/2;
    cableRight.position.y = 9.5 - cableH/2;
    
    // Shake the shale shaker
    shaker.position.x = 2 + Math.random()*0.05;
  };

  group.userData.quiz = [
    { question: "What is the primary function of drilling 'mud'?", options: ["To make the rock softer", "To cool the bit, remove cuttings, and prevent blowouts via hydrostatic pressure", "To lubricate the cables"], answer: 1 },
    { question: "What does a Blowout Preventer (BOP) do?", options: ["It stops the well from freezing", "It shuts off the well to prevent uncontrolled release of oil/gas under extreme pressure", "It refines the oil"], answer: 1 }
  ];

  return group;
}
