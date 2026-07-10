export function createTornadoVortex(THREE) {
  const group = new THREE.Group();

  // 1. Funnel Cloud
  const funnelGeo = new THREE.CylinderGeometry(5, 0.5, 10, 32, 1, true);
  const funnelMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
  const funnel = new THREE.Mesh(funnelGeo, funnelMat);
  funnel.userData = { id: 'funnel', name: 'Funnel Cloud', description: 'Rotating column of condensed water droplets.' };
  group.add(funnel);

  // 2. Debris Cloud
  const debrisGeo = new THREE.TorusGeometry(3, 1, 16, 32);
  const debrisMat = new THREE.MeshStandardMaterial({ color: 0x554433, transparent: true, opacity: 0.8 });
  const debris = new THREE.Mesh(debrisGeo, debrisMat);
  debris.position.y = -5;
  debris.userData = { id: 'debris', name: 'Debris Cloud', description: 'Dust and debris kicked up at the base.' };
  group.add(debris);

  // 3. Wall Cloud
  const wallGeo = new THREE.CylinderGeometry(8, 5, 2, 32);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.9 });
  const wallCloud = new THREE.Mesh(wallGeo, wallMat);
  wallCloud.position.y = 5.5;
  wallCloud.userData = { id: 'wall_cloud', name: 'Wall Cloud', description: 'Lowering of the thunderstorm base where tornadoes form.' };
  group.add(wallCloud);

  // 4. Inflow Jets
  const inflowGeo = new THREE.ConeGeometry(0.5, 4, 8);
  const inflowMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5 });
  const inflow1 = new THREE.Mesh(inflowGeo, inflowMat);
  inflow1.position.set(4, -4, 0);
  inflow1.rotation.z = Math.PI / 2;
  inflow1.userData = { id: 'inflow1', name: 'Warm Inflow', description: 'Warm moist air feeding the storm.' };
  group.add(inflow1);

  const inflow2 = new THREE.Mesh(inflowGeo, inflowMat);
  inflow2.position.set(-4, -4, 0);
  inflow2.rotation.z = -Math.PI / 2;
  inflow2.userData = { id: 'inflow2', name: 'Warm Inflow', description: 'Warm moist air feeding the storm.' };
  group.add(inflow2);

  // 5. Mesocyclone
  const mesoGeo = new THREE.CylinderGeometry(10, 8, 4, 32);
  const mesoMat = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.7 });
  const mesocyclone = new THREE.Mesh(mesoGeo, mesoMat);
  mesocyclone.position.y = 8.5;
  mesocyclone.userData = { id: 'mesocyclone', name: 'Mesocyclone', description: 'Deep, persistently rotating updraft.' };
  group.add(mesocyclone);

  // 6. Rear Flank Downdraft
  const rfdGeo = new THREE.CylinderGeometry(2, 2, 6, 16);
  const rfdMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.4 });
  const rfd = new THREE.Mesh(rfdGeo, rfdMat);
  rfd.position.set(-6, 2, -6);
  rfd.userData = { id: 'rfd', name: 'Rear Flank Downdraft (RFD)', description: 'Sinking air on the backside of the storm.' };
  group.add(rfd);

  // 7. Ground Path
  const groundGeo = new THREE.PlaneGeometry(20, 20);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -5;
  ground.userData = { id: 'ground', name: 'Ground Surface', description: 'The surface affected by the tornado.' };
  group.add(ground);

  // 8. Condensation Funnel Inner
  const innerFunnelGeo = new THREE.CylinderGeometry(2, 0.1, 9.8, 16);
  const innerFunnelMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const innerFunnel = new THREE.Mesh(innerFunnelGeo, innerFunnelMat);
  innerFunnel.userData = { id: 'inner_funnel', name: 'Inner Core', description: 'Low pressure center of the vortex.' };
  group.add(innerFunnel);

  // 9. Destroyed Structure
  const houseGeo = new THREE.BoxGeometry(1, 1, 1);
  const houseMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const house = new THREE.Mesh(houseGeo, houseMat);
  house.position.set(2, -4.5, 2);
  house.userData = { id: 'structure', name: 'Destroyed Structure', description: 'Damage indicator.' };
  group.add(house);

  // 10. Flying Debris Particle
  const particleGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const particleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const particle = new THREE.Mesh(particleGeo, particleMat);
  particle.userData = { id: 'particle', name: 'Flying Debris', description: 'Hazardous objects caught in the wind.' };
  group.add(particle);

  group.userData.animate = function(delta) {
    funnel.rotation.y += 0.2;
    innerFunnel.rotation.y += 0.3;
    debris.rotation.y += 0.1;
    wallCloud.rotation.y += 0.05;
    mesocyclone.rotation.y += 0.02;
    
    const t = Date.now() * 0.005;
    particle.position.x = Math.cos(t) * (2 + Math.random()*0.5);
    particle.position.z = Math.sin(t) * (2 + Math.random()*0.5);
    particle.position.y = -5 + (t % 10);
  };

  group.userData.quiz = [
    { question: "What scale is used to measure tornado damage intensity?", options: ["Richter Scale", "Saffir-Simpson Scale", "Enhanced Fujita (EF) Scale"], answer: 2 },
    { question: "What creates the visible funnel cloud?", options: ["Dust from the ground", "Condensation due to low pressure", "Smoke from fires"], answer: 1 }
  ];

  return group;
}
