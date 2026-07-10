export function createHydroponicGrowSystem(THREE) {
  const group = new THREE.Group();

  // 1. NFT (Nutrient Film Technique) PVC Pipes
  const pipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  
  const pipesGroup = new THREE.Group();
  group.add(pipesGroup);
  
  const yLevels = [3, 1, -1];
  yLevels.forEach((y, index) => {
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    // Slight downward angle for gravity flow
    pipe.rotation.z += (index % 2 === 0 ? 0.02 : -0.02);
    pipe.position.y = y;
    pipesGroup.add(pipe);
    
    if(index === 0) pipe.userData = { id: 'nft_channel', name: 'Grow Channel (PVC Pipe)', description: 'Holds the plant roots while a shallow stream of nutrient water flows along the bottom.' };

    // Drill holes and add plants
    for(let x=-3; x<=3; x+=1.5) {
      // Net Pot
      const potGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.4, 16, 1, true);
      const potMat = new THREE.MeshStandardMaterial({ color: 0x111111, wireframe: true }); // Net mesh
      const pot = new THREE.Mesh(potGeo, potMat);
      pot.position.set(x, y + 0.3, 0);
      pipesGroup.add(pot);

      // Clay Pebbles (Hydroton)
      const clayGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const clayMat = new THREE.MeshStandardMaterial({ color: 0xaa5533, roughness: 1 });
      const clay = new THREE.Mesh(clayGeo, clayMat);
      clay.position.set(x, y + 0.3, 0);
      pipesGroup.add(clay);
      if(index===0 && x===-3) clay.userData = { id: 'grow_media', name: 'Inert Grow Media (Clay Pebbles)', description: 'Provides physical support for the stem. Contains no nutrients, unlike soil.' };

      // Plant (Lettuce)
      const plantGroup = new THREE.Group();
      plantGroup.position.set(x, y + 0.5, 0);
      pipesGroup.add(plantGroup);
      
      const leafGeo = new THREE.SphereGeometry(0.3, 16, 8, 0, Math.PI);
      leafGeo.scale(1, 0.5, 0.2);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x32cd32, side: THREE.DoubleSide });
      
      for(let i=0; i<5; i++) {
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.rotation.y = (i * Math.PI * 2) / 5;
        leaf.rotation.x = Math.PI / 4;
        plantGroup.add(leaf);
      }
      if(index===0 && x===-3) plantGroup.children[0].userData = { id: 'crop', name: 'Hydroponic Crop (Lettuce)', description: 'Grows up to 30% faster than soil-grown plants due to perfectly optimized nutrients and oxygen.' };

      // Roots (Hanging down inside pipe)
      const rootCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, y + 0.1, 0),
        new THREE.Vector3(x + (Math.random()-0.5)*0.1, y - 0.1, 0),
        new THREE.Vector3(x + (Math.random()-0.5)*0.2, y - 0.3, 0)
      ]);
      const rootGeo = new THREE.TubeGeometry(rootCurve, 4, 0.02, 4, false);
      const rootMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
      const root = new THREE.Mesh(rootGeo, rootMat);
      pipesGroup.add(root);
      if(index===0 && x===-3) root.userData = { id: 'roots', name: 'Air-Pruned Roots', description: 'Highly oxygenated roots absorb dissolved minerals directly from the water film.' };
    }
  });

  // 2. Reservoir Tank
  const tankGeo = new THREE.BoxGeometry(3, 2, 2);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.position.set(-3, -3.5, 0);
  group.add(tank);
  tank.userData = { id: 'reservoir', name: 'Nutrient Reservoir', description: 'Holds the water mixed with exact ratios of Nitrogen, Phosphorus, Potassium, and micronutrients.' };

  // Water level inside
  const waterGeo = new THREE.BoxGeometry(2.8, 1.5, 1.8);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0055aa, transparent: true, opacity: 0.6 });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(-3, -3.7, 0);
  group.add(water);

  // 3. Water Pump & Plumbing
  const pumpGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const pumpMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
  const pump = new THREE.Mesh(pumpGeo, pumpMat);
  pump.position.set(-3, -4, 0);
  group.add(pump);
  pump.userData = { id: 'pump', name: 'Submersible Water Pump', description: 'Pumps the nutrient solution up to the highest grow channel.' };

  // Upward Pipe
  const upPipeGeo = new THREE.CylinderGeometry(0.05, 0.05, 7.5);
  const plumbMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const upPipe = new THREE.Mesh(upPipeGeo, plumbMat);
  upPipe.position.set(-4, -0.25, 0);
  group.add(upPipe);

  // Connection pipes between levels
  const cPipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), plumbMat);
  cPipe1.position.set(4, 2, 0);
  group.add(cPipe1);
  const cPipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), plumbMat);
  cPipe2.position.set(-4, 0, 0);
  group.add(cPipe2);
  const returnPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5), plumbMat);
  returnPipe.position.set(4, -2.25, 0);
  group.add(returnPipe);

  // 4. Air Pump & Airstone
  const airPumpGeo = new THREE.BoxGeometry(0.6, 0.4, 0.4);
  const airPump = new THREE.Mesh(airPumpGeo, pumpMat);
  airPump.position.set(-1, -3, 1);
  group.add(airPump);
  airPump.userData = { id: 'air_pump', name: 'Air Pump & Airstone', description: 'Oxygenates the reservoir water. Without dissolved oxygen, the roots will drown and rot.' };

  const airLine = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
  airLine.position.set(-2, -3, 0.5);
  airLine.rotation.z = Math.PI / 4;
  group.add(airLine);

  // Bubbles in reservoir
  const bubblesGroup = new THREE.Group();
  group.add(bubblesGroup);
  for(let i=0; i<10; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    b.position.set(-3 + (Math.random()-0.5)*1, -4.5 + Math.random()*1.5, (Math.random()-0.5)*1);
    bubblesGroup.add(b);
  }

  // 5. LED Grow Lights
  const lightFrameGeo = new THREE.BoxGeometry(8, 0.1, 1);
  const lightFrameMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  
  yLevels.forEach(y => {
    const light = new THREE.Mesh(lightFrameGeo, lightFrameMat);
    light.position.set(0, y + 1.2, 0);
    group.add(light);
    
    // Light emitted (purple/pink full spectrum)
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.3 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.8, 0.8), ledMat);
    beam.position.set(0, y + 0.8, 0);
    group.add(beam);
    
    if(y===3) light.userData = { id: 'grow_lights', name: 'Full Spectrum LED Grow Lights', description: 'Provides specific wavelengths (red and blue) optimized for photosynthesis without heat waste.' };
  });

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;
    
    // Bubbles rising
    bubblesGroup.children.forEach(b => {
      b.position.y += 0.05;
      if (b.position.y > -3) {
        b.position.y = -4.5;
        b.position.x = -3 + (Math.random()-0.5)*1;
      }
    });

    // Simulate water flow via tiny droplets falling between pipes
    // (Omitted explicit droplet meshes for performance, but bubbles imply flow)
  };

  group.userData.quiz = [
    { question: "What does 'hydroponic' mean?", options: ["Growing plants in the dark", "Working water (growing plants without soil)", "Genetically modified plants"], answer: 1 },
    { question: "Why is an air pump necessary in a deep water or NFT reservoir?", options: ["To make the water look pretty", "To provide dissolved Oxygen to the roots so they don't drown", "To push the water up the pipe"], answer: 1 }
  ];

  return group;
}
