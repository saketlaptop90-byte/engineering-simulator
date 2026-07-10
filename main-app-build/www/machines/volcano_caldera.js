export function createVolcanoCaldera(THREE) {
  const group = new THREE.Group();

  // 1. Magma Chamber (Deep Underground)
  const chamberGeo = new THREE.SphereGeometry(3, 32, 16);
  // flatten it a bit
  chamberGeo.scale(1, 0.5, 1);
  const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff3300, emissiveIntensity: 0.5 });
  const chamber = new THREE.Mesh(chamberGeo, magmaMat);
  chamber.position.y = -6;
  group.add(chamber);
  chamber.userData = { id: 'magma_chamber', name: 'Magma Chamber', description: 'A large pool of liquid rock beneath the surface of the Earth.' };

  // 2. Main Conduit (Pipe)
  const conduitGeo = new THREE.CylinderGeometry(0.5, 0.8, 6, 16);
  const conduit = new THREE.Mesh(conduitGeo, magmaMat);
  conduit.position.y = -1.5;
  group.add(conduit);
  conduit.userData = { id: 'main_conduit', name: 'Main Conduit', description: 'The central pipe carrying magma from the chamber to the vent.' };

  // 3. Volcanic Cone / Edifice (Cross section)
  const coneGeo = new THREE.ConeGeometry(8, 6, 32, 1, true, 0, Math.PI);
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x554433, wireframe: false, side: THREE.DoubleSide });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.y = 1.5;
  cone.rotation.x = -Math.PI / 2;
  cone.rotation.y = Math.PI / 2; // Slice facing front
  group.add(cone);
  cone.userData = { id: 'edifice', name: 'Stratovolcano Edifice', description: 'Built up by many layers (strata) of hardened lava, tephra, pumice, and volcanic ash.' };

  // Inside rock layers
  const innerConeMat = new THREE.MeshStandardMaterial({ color: 0x332211, side: THREE.DoubleSide });
  const innerCone = new THREE.Mesh(new THREE.ConeGeometry(7.8, 5.8, 32, 1, true, 0, Math.PI), innerConeMat);
  innerCone.position.y = 1.5;
  innerCone.rotation.x = -Math.PI / 2;
  innerCone.rotation.y = Math.PI / 2;
  group.add(innerCone);

  // 4. Caldera / Crater (The depression at the top)
  const craterGeo = new THREE.CylinderGeometry(1.5, 0.5, 1, 16, 1, true, 0, Math.PI);
  const crater = new THREE.Mesh(craterGeo, coneMat);
  crater.position.y = 4;
  crater.rotation.y = -Math.PI / 2;
  group.add(crater);
  crater.userData = { id: 'crater', name: 'Volcanic Crater / Caldera', description: 'A bowl-shaped depression formed by the collapse of the volcano center after an eruption empties the magma chamber.' };

  // 5. Dike (Secondary vertical intrusion)
  const dikeGeo = new THREE.BoxGeometry(0.2, 4, 2);
  const dike = new THREE.Mesh(dikeGeo, magmaMat);
  dike.position.set(-2, -1, 0);
  dike.rotation.z = Math.PI / 6;
  group.add(dike);
  dike.userData = { id: 'dike', name: 'Magma Dike', description: 'Magma that forces its way across rock layers.' };

  // 6. Sill (Horizontal intrusion)
  const sillGeo = new THREE.BoxGeometry(3, 0.2, 2);
  const sill = new THREE.Mesh(sillGeo, magmaMat);
  sill.position.set(2, -2, 0);
  group.add(sill);
  sill.userData = { id: 'sill', name: 'Magma Sill', description: 'Magma that squeezes horizontally between layers of rock.' };

  // 7. Parasitic Cone (Side vent)
  const paraGeo = new THREE.ConeGeometry(1, 1, 16, 1, true, 0, Math.PI);
  const para = new THREE.Mesh(paraGeo, coneMat);
  para.position.set(-4, 0, 0);
  para.rotation.y = -Math.PI / 2;
  group.add(para);
  para.userData = { id: 'parasitic_cone', name: 'Parasitic Cone / Flank Vent', description: 'A smaller cone forming on the side of the main volcano.' };

  // Secondary pipe to the parasitic cone
  const secPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 3), magmaMat);
  secPipe.position.set(-2, -0.5, 0);
  secPipe.rotation.z = Math.PI / 4;
  group.add(secPipe);

  // 8. Erupting Ash Cloud (Plume)
  const plumeGroup = new THREE.Group();
  plumeGroup.position.y = 4.5;
  group.add(plumeGroup);
  
  const puffGeo = new THREE.SphereGeometry(1, 8, 8);
  const puffMat = new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.8 });
  const puffs = [];
  
  for(let i=0; i<20; i++) {
    const puff = new THREE.Mesh(puffGeo, puffMat);
    puff.position.set((Math.random()-0.5)*2, i*0.5, (Math.random()-0.5)*2);
    const scale = 1 + (i*0.2); // gets wider at the top
    puff.scale.set(scale, scale, scale);
    plumeGroup.add(puff);
    puffs.push({ mesh: puff, origY: i*0.5 });
  }
  plumeGroup.children[0].userData = { id: 'ash_plume', name: 'Eruption Column (Ash Plume)', description: 'Superheated volcanic ash and gas propelled miles into the stratosphere.' };

  // 9. Lava Flow
  const lavaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 4, 0),
    new THREE.Vector3(1.5, 3, 0.5),
    new THREE.Vector3(3, 1, 1),
    new THREE.Vector3(5, -1, 1.5)
  ]);
  const lavaGeo = new THREE.TubeGeometry(lavaCurve, 16, 0.3, 8, false);
  const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xaa2200 });
  const lavaFlow = new THREE.Mesh(lavaGeo, lavaMat);
  group.add(lavaFlow);
  lavaFlow.userData = { id: 'lava_flow', name: 'Lava Flow', description: 'Magma becomes lava once it erupts onto the surface. Typical temperatures: 700°C to 1200°C.' };

  // 10. Fumaroles (Gas vents)
  const gasMat = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.5 });
  const fumarole = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 8), gasMat);
  fumarole.position.set(2.5, 2.5, 0);
  group.add(fumarole);
  fumarole.userData = { id: 'fumarole', name: 'Fumarole', description: 'Vents emitting steam and volcanic gases like sulfur dioxide.' };

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.002;
    
    // Magma pulsing
    chamber.scale.set(1 + Math.sin(t)*0.05, 0.5 + Math.sin(t*0.8)*0.02, 1 + Math.cos(t)*0.05);
    
    // Ash cloud rising and expanding
    puffs.forEach((p, index) => {
      p.mesh.position.y += 0.05;
      p.mesh.scale.x += 0.01;
      p.mesh.scale.z += 0.01;
      p.mesh.material.opacity -= 0.005;
      
      if (p.mesh.material.opacity <= 0) {
        p.mesh.position.y = 0;
        p.mesh.material.opacity = 0.8;
        const scale = 1;
        p.mesh.scale.set(scale, scale, scale);
      }
    });

    // Lava flowing (texture offset simulation via geometry scaling for simplicity)
    // Or just make it glow
    lavaFlow.material.emissiveIntensity = 0.5 + Math.sin(t*5)*0.5;
  };

  group.userData.quiz = [
    { question: "What is the difference between Magma and Lava?", options: ["Lava is hotter", "Magma is underground; it is called Lava once it reaches the surface", "They are made of completely different elements"], answer: 1 },
    { question: "What determines if a volcano erupts explosively (like Mt. St. Helens) or effusively (like in Hawaii)?", options: ["The age of the volcano", "The weather on the day of eruption", "The viscosity and gas content of the magma"], answer: 2 }
  ];

  return group;
}
