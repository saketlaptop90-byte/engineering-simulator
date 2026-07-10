export function createOceanCurrentTurbine(THREE) {
  const group = new THREE.Group();

  // 1. Tower / Monopile Foundation
  const towerGeo = new THREE.CylinderGeometry(1, 1, 10, 32);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, roughness: 0.6 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.y = -5;
  group.add(tower);
  tower.userData = { id: 'monopile', name: 'Monopile Foundation', description: 'Driven deep into the seabed to withstand massive tidal forces.' };

  // 2. Nacelle (Main Housing)
  const nacelleGeo = new THREE.CapsuleGeometry(1.5, 4, 16, 16);
  const nacelleMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.3 });
  const nacelle = new THREE.Mesh(nacelleGeo, nacelleMat);
  nacelle.rotation.z = Math.PI / 2;
  nacelle.position.y = 1;
  group.add(nacelle);
  nacelle.userData = { id: 'nacelle', name: 'Nacelle', description: 'Watertight housing for the gearbox and generator.' };

  // 3. Rotor Hub
  const hubPivot = new THREE.Group();
  hubPivot.position.set(-3.5, 1, 0);
  group.add(hubPivot);
  
  const hubGeo = new THREE.SphereGeometry(1, 32, 32);
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.scale.set(1.5, 1, 1);
  hubPivot.add(hub);
  hub.userData = { id: 'rotor_hub', name: 'Rotor Hub', description: 'Connects the blades to the main shaft.' };

  // 4. Turbine Blades (Bi-directional)
  const bladeGeo = new THREE.BoxGeometry(0.2, 8, 1.5);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
  
  for(let i=0; i<2; i++) {
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    // Position blade extending outwards
    blade.position.y = 4.5;
    // Taper the blade slightly
    const positions = blade.geometry.attributes.position;
    for (let v = 0; v < positions.count; v++) {
      if (positions.getY(v) > 0) {
        positions.setZ(v, positions.getZ(v) * 0.5);
        positions.setX(v, positions.getX(v) * 0.5);
      }
    }
    blade.geometry.computeVertexNormals();
    
    // Pitch angle
    blade.rotation.y = Math.PI / 6;
    
    const bladePivot = new THREE.Group();
    bladePivot.rotation.x = Math.PI * i;
    bladePivot.add(blade);
    hubPivot.add(bladePivot);
    
    blade.userData = { id: `blade_${i}`, name: 'Hydrodynamic Blade', description: 'Captures kinetic energy from dense ocean currents.' };
  }

  // 5. Yaw Mechanism
  const yawGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
  const yawMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const yaw = new THREE.Mesh(yawGeo, yawMat);
  yaw.position.y = -0.5;
  group.add(yaw);
  yaw.userData = { id: 'yaw_bearing', name: 'Yaw Mechanism', description: 'Allows the turbine to rotate and face the incoming tidal flow.' };

  // 6. Subsea Power Cable
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1, -9, 0),
    new THREE.Vector3(3, -9.5, 0),
    new THREE.Vector3(6, -10, 0)
  ]);
  const cableGeo = new THREE.TubeGeometry(cableCurve, 16, 0.2, 8, false);
  const cableMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const cable = new THREE.Mesh(cableGeo, cableMat);
  group.add(cable);
  cable.userData = { id: 'power_cable', name: 'Export Power Cable', description: 'Transmits generated electricity to the onshore grid.' };

  // 7. Water Current Indicator (Arrows)
  const arrowGeo = new THREE.ConeGeometry(0.5, 2, 8);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
  const arrowsGroup = new THREE.Group();
  for(let i=0; i<5; i++) {
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.position.set(-10, 1 + (i-2)*2, 0);
    arrow.rotation.z = -Math.PI / 2;
    arrowsGroup.add(arrow);
  }
  group.add(arrowsGroup);
  arrowsGroup.children[0].userData = { id: 'water_current', name: 'Tidal Current', description: 'Water is 832 times denser than air, carrying immense kinetic energy.' };

  // 8. Gearbox (Visible cutaway inside nacelle)
  const gearGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
  const gearMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1 });
  const gearbox = new THREE.Mesh(gearGeo, gearMat);
  gearbox.position.set(-1, 1, 0);
  gearbox.rotation.z = Math.PI / 2;
  group.add(gearbox);
  gearbox.userData = { id: 'gearbox', name: 'Gearbox', description: 'Steps up the slow rotational speed of the rotor to drive the generator.' };

  // 9. Generator
  const genGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 16);
  const genMat = new THREE.MeshStandardMaterial({ color: 0xcc7722, metalness: 0.8 }); // Copper color
  const generator = new THREE.Mesh(genGeo, genMat);
  generator.position.set(1.5, 1, 0);
  generator.rotation.z = Math.PI / 2;
  group.add(generator);
  generator.userData = { id: 'generator', name: 'Electrical Generator', description: 'Converts mechanical energy into electrical energy.' };

  // 10. Biofouling (Barnacles/Algae)
  const bioGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const bioMat = new THREE.MeshStandardMaterial({ color: 0x225522 });
  for(let i=0; i<20; i++) {
    const bio = new THREE.Mesh(bioGeo, bioMat);
    bio.position.set(Math.cos(i)*1.05, -5 + i*0.2, Math.sin(i)*1.05);
    group.add(bio);
    if(i===0) bio.userData = { id: 'biofouling', name: 'Marine Biofouling', description: 'Growth of marine organisms that must be managed to prevent drag and corrosion.' };
  }

  group.userData.animate = function(delta) {
    hubPivot.rotation.x -= 0.05; // Rotor spinning
    
    // Animate water current arrows
    arrowsGroup.children.forEach(arrow => {
      arrow.position.x += 0.1;
      if(arrow.position.x > 8) arrow.position.x = -10;
    });
  };

  group.userData.quiz = [
    { question: "Why do ocean current turbines have much shorter blades than wind turbines of the same power rating?", options: ["Because they spin faster", "Because water is much denser than air", "To avoid hitting fish"], answer: 1 },
    { question: "What is a major advantage of tidal energy over wind energy?", options: ["It is 100% predictable based on lunar cycles", "It is completely invisible from the surface", "Both of the above"], answer: 2 }
  ];

  return group;
}
