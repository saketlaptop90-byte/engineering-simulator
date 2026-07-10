export function createFossilizationProcess(THREE) {
  const group = new THREE.Group();

  // We will divide the scene into 4 cross-sections to show the stages of fossilization over millions of years

  const sectionWidth = 3;
  const positions = [-4.5, -1.5, 1.5, 4.5];
  
  // Materials
  const waterMat = new THREE.MeshBasicMaterial({ color: 0x0055aa, transparent: true, opacity: 0.6 });
  const siltMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 1 });
  const mudMat = new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 1 });
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 1 });
  const boneMat = new THREE.MeshStandardMaterial({ color: 0xddddcc, roughness: 0.8 });
  const fossilMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 }); // Mineralized bone (brown)

  // A simple dinosaur skull geometry
  const createSkull = (mat) => {
    const skull = new THREE.Group();
    const cranium = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1), mat);
    const snout = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 0.8), mat);
    snout.position.set(1, -0.15, 0);
    skull.add(cranium, snout);
    return skull;
  };

  // Stage 1: Death and Burial
  const s1Group = new THREE.Group();
  s1Group.position.set(positions[0], 0, 0);
  group.add(s1Group);

  const water1 = new THREE.Mesh(new THREE.BoxGeometry(sectionWidth, 2, 4), waterMat);
  water1.position.y = 1;
  s1Group.add(water1);
  
  const lakeBed1 = new THREE.Mesh(new THREE.BoxGeometry(sectionWidth, 3, 4), siltMat);
  lakeBed1.position.y = -1.5;
  s1Group.add(lakeBed1);

  const skull1 = createSkull(boneMat);
  skull1.position.set(0, 0, 0);
  skull1.rotation.z = -Math.PI / 6;
  s1Group.add(skull1);
  s1Group.userData = { id: 'stage1', name: 'Stage 1: Rapid Burial', description: 'The animal dies in or near water. It must be buried quickly by silt/mud to prevent scavengers and oxygen-driven decay.' };

  // Stage 2: Decomposition and Sedimentation
  const s2Group = new THREE.Group();
  s2Group.position.set(positions[1], 0, 0);
  group.add(s2Group);

  const water2 = new THREE.Mesh(new THREE.BoxGeometry(sectionWidth, 1, 4), waterMat);
  water2.position.y = 1.5;
  s2Group.add(water2);

  const topLayer2 = new THREE.Mesh(new THREE.BoxGeometry(sectionWidth, 1, 4), siltMat);
  topLayer2.position.y = 0.5;
  s2Group.add(topLayer2);

  const mudLayer2 = new THREE.Mesh(new THREE.BoxGeometry(sectionWidth, 3, 4), mudMat);
  mudLayer2.position.y = -1.5;
  s2Group.add(mudLayer2);

  const skull2 = createSkull(boneMat);
  skull2.position.set(0, -1, 0);
  skull2.rotation.z = -Math.PI / 6;
  s2Group.add(skull2);
  s2Group.userData = { id: 'stage2', name: 'Stage 2: Sedimentation', description: 'Soft tissues rot away leaving only bones. More layers of sediment pile on top.' };

  // Stage 3: Permineralization
  const s3Group = new THREE.Group();
  s3Group.position.set(positions[2], 0, 0);
  group.add(s3Group);

  const topLayer3 = new THREE.Mesh(new THREE.BoxGeometry(sectionWidth, 1, 4), siltMat);
  topLayer3.position.y = 1.5;
  s3Group.add(topLayer3);

  const rockLayer3_1 = new THREE.Mesh(new THREE.BoxGeometry(sectionWidth, 2, 4), mudMat);
  rockLayer3_1.position.y = 0;
  s3Group.add(rockLayer3_1);

  const rockLayer3_2 = new THREE.Mesh(new THREE.BoxGeometry(sectionWidth, 2, 4), rockMat);
  rockLayer3_2.position.y = -2;
  s3Group.add(rockLayer3_2);

  // Skull is now mineralized
  const skull3 = createSkull(fossilMat);
  skull3.position.set(0, -2, 0);
  skull3.rotation.z = -Math.PI / 6;
  s3Group.add(skull3);

  // Minerals dripping down
  const minGroup = new THREE.Group();
  s3Group.add(minGroup);
  for(let i=0; i<10; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    p.position.set((Math.random()-0.5)*2, Math.random()*2, (Math.random()-0.5)*2);
    minGroup.add(p);
  }
  s3Group.userData = { id: 'stage3', name: 'Stage 3: Permineralization', description: 'Over millions of years, weight turns mud to rock. Groundwater carrying dissolved minerals seeps into the microscopic pores of the bone, crystallizing and turning it to stone.' };

  // Stage 4: Erosion and Discovery
  const s4Group = new THREE.Group();
  s4Group.position.set(positions[3], 0, 0);
  group.add(s4Group);

  // Eroded rock layer (angled)
  const rock4Geo = new THREE.BoxGeometry(sectionWidth, 5, 4);
  const rock4 = new THREE.Mesh(rock4Geo, rockMat);
  rock4.position.y = -1;
  // Apply a wedge cut via rotation and shifting (simplified representation)
  rock4.rotation.z = Math.PI / 8;
  rock4.position.x = -0.5;
  s4Group.add(rock4);

  const skull4 = createSkull(fossilMat);
  skull4.position.set(-0.5, 1, 0); // Exposed on the slope
  skull4.rotation.z = -Math.PI / 6;
  s4Group.add(skull4);
  s4Group.userData = { id: 'stage4', name: 'Stage 4: Erosion', description: 'Tectonic uplift and weathering (wind, rain) slowly erode the top rock layers, finally exposing the fossil at the surface for a paleontologist to find.' };

  // A tiny pickaxe
  const pickaxe = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6), new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.05), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
  head.position.y = 0.25;
  pickaxe.add(handle, head);
  pickaxe.position.set(0.5, 1.5, 0);
  pickaxe.rotation.z = -Math.PI/4;
  s4Group.add(pickaxe);

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.002;
    
    // Animate stage 1 silt settling
    lakeBed1.position.y = -1.5 + Math.sin(t*0.5)*0.1;
    
    // Animate stage 3 minerals seeping
    minGroup.children.forEach((p, i) => {
      p.position.y -= 0.02;
      if (p.position.y < -3) p.position.y = 2;
    });

    // Animate stage 4 pickaxe hitting rock
    pickaxe.rotation.z = -Math.PI/4 + Math.sin(t*5)*0.2;
  };

  group.userData.quiz = [
    { question: "What is permineralization?", options: ["When bone turns into liquid oil", "When minerals from groundwater crystallize inside the porous structure of bone, turning it to stone", "When freezing preserves an animal perfectly"], answer: 1 },
    { question: "Why don't most dead animals become fossils?", options: ["Because they don't have bones", "Because they need to die in a volcano", "Because scavengers and oxygen usually destroy the remains before they can be rapidly buried by sediment"], answer: 2 }
  ];

  return group;
}
