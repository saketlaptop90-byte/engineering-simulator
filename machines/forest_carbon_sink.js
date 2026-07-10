export function createForestCarbonSink(THREE) {
  const group = new THREE.Group();

  // 1. The Forest Floor
  const floorGeo = new THREE.BoxGeometry(12, 1, 12);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x3b5323 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.5;
  group.add(floor);
  floor.userData = { id: 'soil_carbon', name: 'Soil Organic Carbon', description: 'Dead roots, fallen leaves, and microbes store massive amounts of carbon underground for centuries.' };

  // 2. Trees (Biomass Carbon Sink)
  const treeGroup = new THREE.Group();
  group.add(treeGroup);
  
  const createTree = (x, z, scale) => {
    const t = new THREE.Group();
    t.position.set(x, 0, z);
    t.scale.setScalar(scale);
    
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3), new THREE.MeshStandardMaterial({ color: 0x4a2e15 }));
    trunk.position.y = 1.5;
    t.add(trunk);
    
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5), new THREE.MeshStandardMaterial({ color: 0x228b22 }));
    leaves.position.y = 3.5;
    t.add(leaves);
    
    trunk.userData = { id: 'biomass', name: 'Tree Biomass', description: 'Trees absorb CO2 during photosynthesis and lock the carbon into their wood (cellulose/lignin).' };
    
    return t;
  };

  for(let i=0; i<8; i++) {
    treeGroup.add(createTree((Math.random()-0.5)*10, (Math.random()-0.5)*10, 0.8 + Math.random()*0.5));
  }

  // 3. Atmosphere
  const atmosGroup = new THREE.Group();
  group.add(atmosGroup);

  // 4. CO2 Molecules
  const co2Geo = new THREE.Group();
  const cAtom = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshStandardMaterial({ color: 0x333333 })); // Carbon
  const o1Atom = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshStandardMaterial({ color: 0xff0000 })); // Oxygen
  o1Atom.position.x = 0.25;
  const o2Atom = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  o2Atom.position.x = -0.25;
  co2Geo.add(cAtom, o1Atom, o2Atom);

  const co2Array = [];
  
  // Factory/Emission Source
  const factory = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ color: 0x666666 }));
  factory.position.set(-4, 1, 4);
  group.add(factory);
  
  const smokeStack = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3), new THREE.MeshStandardMaterial({ color: 0x444444 }));
  smokeStack.position.set(-4, 3, 4);
  group.add(smokeStack);
  factory.userData = { id: 'fossil_fuels', name: 'Anthropogenic Emissions', description: 'Burning fossil fuels releases ancient stored carbon back into the atmosphere as CO2 rapidly.' };

  for(let i=0; i<30; i++) {
    const co2 = co2Geo.clone();
    co2.position.set(-4, 4.5, 4); // Start at smokestack
    atmosGroup.add(co2);
    co2Array.push({ mesh: co2, state: 'emitting', targetTree: null, timer: i*10 });
  }

  // 5. O2 Molecules (Released by trees)
  const o2Array = [];
  const o2GeoBase = new THREE.Group();
  const oA = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshStandardMaterial({ color: 0x00ffff }));
  oA.position.x = 0.1;
  const oB = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshStandardMaterial({ color: 0x00ffff }));
  oB.position.x = -0.1;
  o2GeoBase.add(oA, oB);

  // 6. Deforestation visualization (Axe/Stump)
  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.5), new THREE.MeshStandardMaterial({ color: 0x4a2e15 }));
  stump.position.set(4, 0.25, 4);
  group.add(stump);
  stump.userData = { id: 'deforestation', name: 'Deforestation', description: 'Cutting and burning trees releases all their stored carbon back into the atmosphere, turning a sink into a source.' };

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;
    
    co2Array.forEach(co2 => {
      if (co2.timer > 0) {
        co2.timer--;
        return;
      }
      
      if (co2.state === 'emitting') {
        co2.mesh.position.y += 0.05;
        co2.mesh.position.x += (Math.random()-0.5)*0.1;
        co2.mesh.position.z += (Math.random()-0.5)*0.1;
        
        if (co2.mesh.position.y > 8) {
          co2.state = 'floating';
        }
      } else if (co2.state === 'floating') {
        co2.mesh.position.x += Math.sin(t + co2.mesh.id)*0.05;
        co2.mesh.position.z += Math.cos(t + co2.mesh.id)*0.05;
        
        // Randomly get absorbed by a tree
        if (Math.random() < 0.01) {
          co2.state = 'absorbing';
          co2.targetTree = treeGroup.children[Math.floor(Math.random() * treeGroup.children.length)];
        }
      } else if (co2.state === 'absorbing') {
        // Move towards tree canopy
        const targetPos = new THREE.Vector3(co2.targetTree.position.x, 3.5 * co2.targetTree.scale.y, co2.targetTree.position.z);
        co2.mesh.position.lerp(targetPos, 0.05);
        
        if (co2.mesh.position.distanceTo(targetPos) < 0.5) {
          // Absorbed! Reset to factory and spawn O2
          co2.mesh.position.set(-4, 4.5, 4);
          co2.state = 'emitting';
          co2.timer = 50;
          
          // Spawn O2
          const o2 = o2GeoBase.clone();
          o2.position.copy(targetPos);
          atmosGroup.add(o2);
          o2Array.push(o2);
        }
      }
    });

    // O2 floating away
    for (let i = o2Array.length - 1; i >= 0; i--) {
      const o2 = o2Array[i];
      o2.position.y += 0.05;
      o2.position.x += (Math.random()-0.5)*0.05;
      if (o2.position.y > 10) {
        atmosGroup.remove(o2);
        o2Array.splice(i, 1);
      }
    }
  };

  group.userData.quiz = [
    { question: "What is a Carbon Sink?", options: ["A machine that cleans dirty coal", "A natural reservoir that absorbs and stores more carbon than it releases", "The exhaust pipe of a car"], answer: 1 },
    { question: "Which process removes CO2 from the atmosphere and stores it in tree biomass?", options: ["Respiration", "Combustion", "Photosynthesis"], answer: 2 }
  ];

  return group;
}
