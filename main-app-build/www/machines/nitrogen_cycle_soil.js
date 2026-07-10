export function createNitrogenCycleSoil(THREE) {
  const group = new THREE.Group();

  // 1. Cross-section of soil
  const soilGeo = new THREE.BoxGeometry(8, 4, 8);
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 1 });
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.y = -2;
  group.add(soil);

  // 2. The Atmosphere (Nitrogen Gas N2)
  const atmosGeo = new THREE.BoxGeometry(8, 4, 8);
  const atmosMat = new THREE.MeshBasicMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.2 });
  const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
  atmosphere.position.y = 2;
  group.add(atmosphere);
  atmosphere.userData = { id: 'atmosphere', name: 'Atmosphere (78% N2)', description: 'The largest reservoir of nitrogen, but N2 gas is unusable by most plants and animals.' };

  // N2 molecules floating
  const n2Group = new THREE.Group();
  group.add(n2Group);
  const n2Mat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  for(let i=0; i<10; i++) {
    const mol = new THREE.Group();
    mol.position.set((Math.random()-0.5)*6, 0.5 + Math.random()*3, (Math.random()-0.5)*6);
    
    const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.2), n2Mat);
    n1.position.x = -0.15;
    const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.2), n2Mat);
    n2.position.x = 0.15;
    
    mol.add(n1, n2);
    n2Group.add(mol);
  }

  // 3. A Plant (Legume/Pea plant)
  const stemGeo = new THREE.CylinderGeometry(0.05, 0.1, 3);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(-2, 1.5, 0);
  group.add(stem);
  stem.userData = { id: 'plant', name: 'Legume Plant', description: 'Plants need nitrogen to build proteins and DNA, but must absorb it from the soil as nitrates or ammonium.' };

  // Leaves
  const leafGeo = new THREE.SphereGeometry(0.4, 8, 8);
  leafGeo.scale(1, 0.2, 0.5);
  for(let i=0; i<4; i++) {
    const leaf = new THREE.Mesh(leafGeo, stemMat);
    leaf.position.set(-2 + (i%2===0?0.3:-0.3), 0.5 + i*0.6, 0);
    leaf.rotation.z = i%2===0 ? Math.PI/4 : -Math.PI/4;
    group.add(leaf);
  }

  // Roots with Nodules
  const rootGroup = new THREE.Group();
  rootGroup.position.set(-2, 0, 0);
  group.add(rootGroup);

  const mainRoot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.02, 3), stemMat);
  mainRoot.position.y = -1.5;
  rootGroup.add(mainRoot);

  const noduleGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const noduleMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
  
  const nodules = [];
  for(let i=0; i<6; i++) {
    const nodule = new THREE.Mesh(noduleGeo, noduleMat);
    nodule.position.set((Math.random()-0.5)*1, -0.5 - Math.random()*2, (Math.random()-0.5)*1);
    rootGroup.add(nodule);
    nodules.push(nodule);
  }
  nodules[0].userData = { id: 'nodules', name: 'Root Nodules (Rhizobium)', description: 'Nitrogen-fixing bacteria live here. They convert atmospheric N2 directly into ammonia (NH3) for the plant in exchange for sugars.' };

  // 4. Nitrogen-fixing Soil Bacteria (Free living)
  const bacGroup1 = new THREE.Group();
  group.add(bacGroup1);
  const bacMat1 = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  for(let i=0; i<5; i++) {
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.2), bacMat1);
    b.position.set(2 + Math.random()*2, -1 - Math.random()*2, (Math.random()-0.5)*2);
    bacGroup1.add(b);
  }
  bacGroup1.children[0].userData = { id: 'n_fixing_bacteria', name: 'Nitrogen-Fixing Bacteria', description: 'Process: Nitrogen Fixation (N2 -> NH4+). Converts gas into ammonium.' };

  // 5. Nitrifying Bacteria
  const bacGroup2 = new THREE.Group();
  group.add(bacGroup2);
  const bacMat2 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  for(let i=0; i<5; i++) {
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.2), bacMat2);
    b.position.set(0 + Math.random()*2, -2 - Math.random()*1.5, (Math.random()-0.5)*2);
    bacGroup2.add(b);
  }
  bacGroup2.children[0].userData = { id: 'nitrifying_bacteria', name: 'Nitrifying Bacteria', description: 'Process: Nitrification (NH4+ -> NO2- -> NO3-). Converts toxic ammonia into nitrites, then into nitrates which plants love.' };

  // 6. Denitrifying Bacteria
  const bacGroup3 = new THREE.Group();
  group.add(bacGroup3);
  const bacMat3 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  for(let i=0; i<5; i++) {
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.2), bacMat3);
    b.position.set(-3 + Math.random()*2, -3 - Math.random()*0.5, (Math.random()-0.5)*2);
    bacGroup3.add(b);
  }
  bacGroup3.children[0].userData = { id: 'denitrifying_bacteria', name: 'Denitrifying Bacteria', description: 'Process: Denitrification (NO3- -> N2). Converts nitrates back into nitrogen gas, completing the cycle. Usually happens in oxygen-poor soil.' };

  // 7. Decomposers (Fungi / Bacteria)
  const fungusGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
  const fungusMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const capGeo = new THREE.ConeGeometry(0.3, 0.3);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
  
  const mushroom = new THREE.Group();
  const stalk = new THREE.Mesh(fungusGeo, fungusMat);
  stalk.position.y = 0.25;
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 0.5;
  mushroom.add(stalk, cap);
  mushroom.position.set(3, 0, 2);
  group.add(mushroom);
  mushroom.userData = { id: 'decomposers', name: 'Decomposers', description: 'Process: Ammonification. Breaks down dead organic matter and feces back into ammonium (NH4+).' };

  // 8. Animated Particles (The Flow of Nitrogen)
  const particleGeo = new THREE.SphereGeometry(0.1, 4, 4);
  const particles = [];

  function createParticleStream(color, start, end, speed) {
    const pMat = new THREE.MeshBasicMaterial({ color: color });
    const p = new THREE.Mesh(particleGeo, pMat);
    p.position.copy(start);
    group.add(p);
    particles.push({ mesh: p, start, end, speed, progress: 0 });
  }

  // N2 from air to N-fixing bacteria (Yellow particles)
  createParticleStream(0xffff00, new THREE.Vector3(2, 2, 0), new THREE.Vector3(3, -2, 0), 0.01);
  // NH4+ from N-fixing to Nitrifying (Orange particles)
  createParticleStream(0xffa500, new THREE.Vector3(3, -2, 0), new THREE.Vector3(1, -2.5, 0), 0.01);
  // NO3- from Nitrifying to Plant Roots (Green particles)
  createParticleStream(0x00ff00, new THREE.Vector3(1, -2.5, 0), new THREE.Vector3(-2, -1, 0), 0.01);
  // NO3- from Nitrifying to Denitrifying (Blue particles)
  createParticleStream(0x00ffff, new THREE.Vector3(1, -2.5, 0), new THREE.Vector3(-2.5, -3.2, 0), 0.01);
  // N2 from Denitrifying to Air (White particles)
  createParticleStream(0xffffff, new THREE.Vector3(-2.5, -3.2, 0), new THREE.Vector3(-2, 2, 0), 0.01);

  group.userData.animate = function(delta) {
    // Animate N2 in sky
    const t = Date.now() * 0.001;
    n2Group.children.forEach((mol, i) => {
      mol.position.x += Math.sin(t + i)*0.01;
      mol.rotation.z += 0.02;
    });

    // Animate particles flowing through the cycle
    particles.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;
      
      p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      
      // Arc the path slightly
      p.mesh.position.y += Math.sin(p.progress * Math.PI) * 0.5;
    });
  };

  group.userData.quiz = [
    { question: "What is the only way plants can absorb Nitrogen?", options: ["By breathing N2 gas through their leaves", "Through their roots as dissolved Nitrates (NO3-) or Ammonium (NH4+)", "By eating soil"], answer: 1 },
    { question: "What organism is primarily responsible for Nitrogen Fixation, Nitrification, and Denitrification?", options: ["Earthworms", "Fungi", "Bacteria"], answer: 2 }
  ];

  return group;
}
