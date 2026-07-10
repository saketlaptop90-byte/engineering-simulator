export function createMarineFoodWeb(THREE) {
  const group = new THREE.Group();

  // 1. Environment / Water
  const waterGeo = new THREE.BoxGeometry(10, 8, 10);
  const waterMat = new THREE.MeshBasicMaterial({ color: 0x0044aa, transparent: true, opacity: 0.2 });
  const water = new THREE.Mesh(waterGeo, waterMat);
  group.add(water);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
  sunLight.position.set(5, 10, 5);
  group.add(sunLight);

  // Helper to make flat organism cards for simplicity, or simple 3D shapes
  const createOrganism = (color, size, shape, name, desc, level) => {
    let geo;
    if (shape === 'sphere') geo = new THREE.SphereGeometry(size, 16, 16);
    if (shape === 'box') geo = new THREE.BoxGeometry(size, size*0.5, size*2);
    if (shape === 'cone') geo = new THREE.ConeGeometry(size*0.5, size*2, 8);
    
    const mat = new THREE.MeshStandardMaterial({ color: color });
    const mesh = new THREE.Mesh(geo, mat);
    if(shape==='cone') {
      mesh.rotation.x = Math.PI/2;
    }
    
    mesh.userData = { id: name.toLowerCase().replace(' ','_'), name: name, description: desc, level: level };
    return mesh;
  };

  const organisms = [];
  const lines = new THREE.Group();
  group.add(lines);

  // Level 1: Primary Producers (Phytoplankton)
  const phytoGroup = new THREE.Group();
  phytoGroup.position.y = 3;
  group.add(phytoGroup);
  
  for(let i=0; i<15; i++) {
    const p = createOrganism(0x00ff00, 0.2, 'sphere', 'Phytoplankton', 'Primary Producers. Microscopic algae that create energy from sunlight via photosynthesis.', 1);
    p.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*1, (Math.random()-0.5)*8);
    phytoGroup.add(p);
    organisms.push(p);
  }

  // Level 2: Primary Consumers (Zooplankton / Krill)
  const zooGroup = new THREE.Group();
  zooGroup.position.y = 1;
  group.add(zooGroup);
  
  for(let i=0; i<8; i++) {
    const z = createOrganism(0xffaa00, 0.3, 'box', 'Zooplankton / Krill', 'Primary Consumers. Tiny animals that eat phytoplankton.', 2);
    z.position.set((Math.random()-0.5)*6, (Math.random()-0.5)*1, (Math.random()-0.5)*6);
    zooGroup.add(z);
    organisms.push(z);
  }

  // Level 3: Secondary Consumers (Small Fish)
  const smallFishGroup = new THREE.Group();
  smallFishGroup.position.y = -1;
  group.add(smallFishGroup);
  
  for(let i=0; i<4; i++) {
    const f = createOrganism(0x00ffff, 0.6, 'cone', 'Small Fish (Herring/Sardines)', 'Secondary Consumers. Eat zooplankton and transfer energy up the food chain.', 3);
    f.position.set((Math.random()-0.5)*4, (Math.random()-0.5)*1, (Math.random()-0.5)*4);
    smallFishGroup.add(f);
    organisms.push(f);
  }

  // Level 4: Tertiary Consumers (Large Fish / Seals)
  const largeFishGroup = new THREE.Group();
  largeFishGroup.position.y = -2.5;
  group.add(largeFishGroup);
  
  for(let i=0; i<2; i++) {
    const f = createOrganism(0xaaaaaa, 1.0, 'cone', 'Tuna / Seal', 'Tertiary Consumers. Predators that hunt smaller fish.', 4);
    f.position.set((i===0?2:-2), 0, 0);
    largeFishGroup.add(f);
    organisms.push(f);
  }

  // Level 5: Apex Predators (Shark / Orca)
  const apexGeo = new THREE.BoxGeometry(1, 1, 3);
  const apexMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const apex = new THREE.Mesh(apexGeo, apexMat);
  apex.position.set(0, -3.5, 0);
  
  // dorsal fin
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8), apexMat);
  fin.position.set(0, 0.8, -0.5);
  apex.add(fin);
  
  group.add(apex);
  apex.userData = { id: 'apex_predator', name: 'Apex Predator (Great White Shark)', description: 'The top of the food chain. Has no natural predators. Controls the populations of species below it.', level: 5 };
  organisms.push(apex);

  // Decomposers (Ocean Floor)
  const floorGeo = new THREE.PlaneGeometry(10, 10);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xaa8855 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.y = -4;
  group.add(floor);
  
  const crab = createOrganism(0xff0000, 0.5, 'sphere', 'Benthic Decomposers (Crabs/Bacteria)', 'Consume marine snow (dead organic matter falling from above), returning nutrients to the water.', 0);
  crab.position.set(0, -3.8, 2);
  group.add(crab);
  organisms.push(crab);

  // Draw Energy Transfer Lines (Arrows pointing UP the food chain)
  const drawLine = (p1, p2, color) => {
    const points = [p1, p2];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
    const line = new THREE.Line(geo, mat);
    lines.add(line);
  };

  // Connect levels
  phytoGroup.children.forEach(p => {
    zooGroup.children.forEach(z => {
      if(Math.random() < 0.2) drawLine(p.position.clone().add(phytoGroup.position), z.position.clone().add(zooGroup.position), 0xffff00);
    });
  });

  zooGroup.children.forEach(z => {
    smallFishGroup.children.forEach(s => {
      if(Math.random() < 0.5) drawLine(z.position.clone().add(zooGroup.position), s.position.clone().add(smallFishGroup.position), 0xffaa00);
    });
  });

  smallFishGroup.children.forEach(s => {
    largeFishGroup.children.forEach(l => {
      drawLine(s.position.clone().add(smallFishGroup.position), l.position.clone().add(largeFishGroup.position), 0xff0000);
    });
  });

  largeFishGroup.children.forEach(l => {
    drawLine(l.position.clone().add(largeFishGroup.position), apex.position, 0xaa0000);
  });

  // Marine Snow (Dead stuff falling)
  const snowGroup = new THREE.Group();
  group.add(snowGroup);
  for(let i=0; i<30; i++) {
    const flake = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    flake.position.set((Math.random()-0.5)*8, 4 - Math.random()*8, (Math.random()-0.5)*8);
    snowGroup.add(flake);
  }

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;
    
    // Organisms drifting
    organisms.forEach((org, i) => {
      if(org.userData.level > 0 && org.userData.level < 5) {
        org.position.x += Math.sin(t + i)*0.01;
        org.position.z += Math.cos(t + i*2)*0.01;
        if(org.geometry.type === 'ConeGeometry') {
          org.rotation.y = Math.atan2(Math.cos(t + i*2)*0.01, Math.sin(t + i)*0.01);
        }
      }
    });

    // Apex swimming in circle
    apex.position.x = Math.sin(t*0.5) * 3;
    apex.position.z = Math.cos(t*0.5) * 3;
    apex.rotation.y = t*0.5;

    // Marine snow falling
    snowGroup.children.forEach(flake => {
      flake.position.y -= 0.02;
      if(flake.position.y < -4) {
        flake.position.y = 4;
      }
    });
  };

  group.userData.quiz = [
    { question: "What is the ultimate source of energy for almost all marine food webs?", options: ["Geothermal vents", "The Sun (captured by Phytoplankton)", "Whale blubber"], answer: 1 },
    { question: "As energy moves up the food chain (from level 1 to level 5), how much is typically lost at each step due to metabolism and heat?", options: ["0%", "50%", "90% (The 10% Rule)"], answer: 2 }
  ];

  return group;
}
