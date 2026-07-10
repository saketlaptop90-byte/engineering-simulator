export function createPhotosynthesis(THREE) {
  const group = new THREE.Group();

  // 1. Thylakoid Membrane
  const membrane = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 4), new THREE.MeshStandardMaterial({ color: 0x228822, transparent: true, opacity: 0.8 }));
  group.add(membrane);
  membrane.userData = { id: 'thylakoid', name: 'Thylakoid Membrane', description: 'Located inside the chloroplast. The space above is the Stroma, the space below is the Thylakoid Lumen.' };

  // 2. Photosystem II (PSII)
  const ps2Group = new THREE.Group();
  ps2Group.position.set(-3, 0, 0);
  group.add(ps2Group);
  
  const ps2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1), new THREE.MeshStandardMaterial({ color: 0x44aa44 }));
  ps2Group.add(ps2);
  ps2.userData = { id: 'ps2', name: 'Photosystem II', description: 'Absorbs light energy to excite electrons. It replaces these electrons by splitting Water (H2O) into Oxygen and Protons.' };

  // 3. Electron Transport Chain (Cytochrome b6f)
  const cytGroup = new THREE.Group();
  cytGroup.position.set(0, 0, 0);
  group.add(cytGroup);

  const cyt = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1.2), new THREE.MeshStandardMaterial({ color: 0xaa44aa }));
  cytGroup.add(cyt);
  cyt.userData = { id: 'cytochrome', name: 'Cytochrome b6f Complex', description: 'Uses the energy from the passing electrons to pump Protons (H+) into the thylakoid lumen, building a pressure gradient.' };

  // 4. Photosystem I (PSI)
  const ps1Group = new THREE.Group();
  ps1Group.position.set(3, 0, 0);
  group.add(ps1Group);

  const ps1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1), new THREE.MeshStandardMaterial({ color: 0x44cc44 }));
  ps1Group.add(ps1);
  ps1.userData = { id: 'ps1', name: 'Photosystem I', description: 'Absorbs light to re-excite the tired electrons. These high-energy electrons are then used to make NADPH.' };

  // 5. Light (Photons)
  const photonGeo = new THREE.SphereGeometry(0.1);
  const photonMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const photons = new THREE.Group();
  group.add(photons);
  
  const p1 = new THREE.Mesh(photonGeo, photonMat);
  const p2 = new THREE.Mesh(photonGeo, photonMat);
  photons.add(p1, p2);

  // 6. Electrons traveling the chain
  const eGeo = new THREE.SphereGeometry(0.1);
  const eMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const e1 = new THREE.Mesh(eGeo, eMat);
  group.add(e1);

  // 7. Water splitting (Photolysis)
  const waterGeo = new THREE.SphereGeometry(0.2);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
  const water = new THREE.Mesh(waterGeo, waterMat);
  group.add(water);
  const o2Mat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Oxygen gas bubble

  // 8. Protons (H+)
  const hGeo = new THREE.SphereGeometry(0.15);
  const hMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const hPool = new THREE.Group();
  group.add(hPool);
  for(let i=0; i<10; i++) {
    const h = new THREE.Mesh(hGeo, hMat);
    h.position.set((Math.random()-0.5)*8, -1.5 - Math.random(), (Math.random()-0.5)*2);
    hPool.add(h);
  }

  // Animation logic
  let phase = 0; // 0: wait for light, 1: PSII excite & split H2O, 2: travel to Cyt, 3: travel to PSI, 4: PSI excite -> NADPH

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.002;

    // Photons falling from sun
    p1.position.set(-3, 4 - (t*2 % 4), 0);
    p2.position.set(3, 4 - ((t*2+1) % 4), 0);

    // Phase machine for electron
    if (phase === 0) {
      e1.position.set(-3, 0, 0); // At PSII
      water.position.set(-3, -2, 0); // Water waiting below
      water.material = waterMat;
      if (p1.position.y < 0.5) phase = 1;
    } else if (phase === 1) {
      // Light hits PSII. Electron shoots up.
      e1.position.y += 0.1;
      
      // Water splits
      water.position.y += 0.05;
      if (water.position.y > -0.5) {
        water.material = o2Mat; // becomes O2
        water.position.x -= 0.05; // drifts away
      }

      if (e1.position.y > 1.5) phase = 2;
    } else if (phase === 2) {
      // Electron falls to Cytochrome
      e1.position.lerp(new THREE.Vector3(0, 0.5, 0), 0.1);
      
      if (e1.position.distanceTo(new THREE.Vector3(0, 0.5, 0)) < 0.1) {
        phase = 3;
        // Pump a proton!
        const p = hPool.children[Math.floor(Math.random()*hPool.children.length)];
        p.position.set(0, 1.5, 0); // start above
      }
    } else if (phase === 3) {
      // Electron travels to PSI
      e1.position.lerp(new THREE.Vector3(3, 0, 0), 0.05);
      
      // Pumped proton moves down into lumen
      hPool.children.forEach(h => {
        if (h.position.y > -1) h.position.y -= 0.1;
      });

      if (e1.position.distanceTo(new THREE.Vector3(3, 0, 0)) < 0.1) {
        // Wait for light at PSI
        if (p2.position.y < 0.5) phase = 4;
      }
    } else if (phase === 4) {
      // Light hits PSI. Electron shoots up to make NADPH.
      e1.position.y += 0.1;
      e1.position.x += 0.05;
      
      if (e1.position.y > 3) phase = 0; // Reset
    }

    // Protons milling about in the lumen (building pressure for ATP Synthase)
    hPool.children.forEach((h, i) => {
      if (h.position.y < -1) {
        h.position.x += Math.sin(t+i)*0.05;
        h.position.z += Math.cos(t+i)*0.05;
      }
    });
  };

  group.userData.quiz = [
    { question: "In the light reactions, where does the Oxygen gas that plants release come from?", options: ["From Carbon Dioxide", "From the splitting of Water (H2O) at Photosystem II to replace lost electrons", "From the air"], answer: 1 },
    { question: "What is the primary purpose of the electron transport chain between the two photosystems?", options: ["To make the leaf green", "To pump Protons (H+) into the lumen, creating a battery-like charge to power ATP synthesis", "To absorb water"], answer: 1 }
  ];

  return group;
}
