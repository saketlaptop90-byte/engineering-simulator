export function createEnzymeCatalysis(THREE) {
  const group = new THREE.Group();

  // 1. The Enzyme (Pac-man like shape)
  const enzymeGroup = new THREE.Group();
  group.add(enzymeGroup);

  const enzymeMat = new THREE.MeshStandardMaterial({ color: 0x8844ff, roughness: 0.6 });
  
  // Custom shape for the enzyme to have an "active site" (a notch)
  const shape = new THREE.Shape();
  shape.moveTo(2, 0);
  shape.absarc(0, 0, 2, 0, Math.PI * 1.8, false); // Almost full circle
  // Notch (Active Site)
  shape.lineTo(0.5, -0.5);
  shape.lineTo(2, -0.5);
  shape.lineTo(2, 0);

  const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
  const enzymeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Center it
  enzymeGeo.translate(0, 0, -0.5);
  
  const enzyme = new THREE.Mesh(enzymeGeo, enzymeMat);
  enzyme.rotation.z = Math.PI / 4; // Point notch top right
  enzymeGroup.add(enzyme);

  enzyme.userData = { id: 'enzyme', name: 'Enzyme (Protein Catalyst)', description: 'A large protein molecule that speeds up a specific chemical reaction without being consumed itself.' };

  // Highlight Active Site
  const siteHighlight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.3 }));
  siteHighlight.position.set(1.5, 1.5, 0);
  enzymeGroup.add(siteHighlight);
  siteHighlight.userData = { id: 'active_site', name: 'Active Site', description: 'The specific region where the substrate binds. It has a unique shape, like a lock that only fits one key.' };

  // 2. The Substrate (The molecule to be broken apart)
  const substrateGroup = new THREE.Group();
  group.add(substrateGroup);

  const subMat1 = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  const subMat2 = new THREE.MeshStandardMaterial({ color: 0x44ff44 });

  const partA = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), subMat1);
  partA.position.set(-0.4, 0, 0);
  const partB = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), subMat2);
  partB.position.set(0.4, 0, 0);
  
  // A bond connecting them
  const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  bond.rotation.z = Math.PI / 2;
  
  substrateGroup.add(partA, partB, bond);
  substrateGroup.position.set(4, 4, 0);
  // Angle to fit the notch
  substrateGroup.rotation.z = -Math.PI / 4;

  partA.userData = { id: 'substrate', name: 'Substrate', description: 'The specific reactant molecule that the enzyme acts upon.' };

  // 3. Products (After reaction)
  // We'll reuse partA and partB for the animation

  let phase = 0;
  let timer = 0;

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;

    // Enzyme floats gently
    enzymeGroup.position.y = Math.sin(t) * 0.2;

    // Reaction Animation Logic
    if (phase === 0) {
      // Substrate approaching active site
      const target = new THREE.Vector3(1.3, 1.5, 0).add(enzymeGroup.position);
      substrateGroup.position.lerp(target, 0.05);
      
      if (substrateGroup.position.distanceTo(target) < 0.1) {
        phase = 1;
        timer = 0;
        siteHighlight.material.color.setHex(0xffffff); // Flash when bound
      }
    } else if (phase === 1) {
      // Enzyme-Substrate Complex (Induced Fit)
      timer += delta;
      
      // Enzyme slightly "hugs" the substrate (scale animation)
      enzyme.scale.set(1 - Math.sin(timer*Math.PI)*0.05, 1 + Math.sin(timer*Math.PI)*0.05, 1);
      
      // Bond stretches and breaks
      if (timer > 0.5) {
        bond.scale.y = 1 + (timer - 0.5)*2; // stretch
        bond.material.color.setHex(0xff0000);
      }
      
      if (timer > 1.5) {
        phase = 2; // Broken
        bond.visible = false;
        siteHighlight.material.color.setHex(0xffff00);
      }
    } else if (phase === 2) {
      // Products leaving
      partA.position.x -= 0.05;
      partA.position.y += 0.05;
      partB.position.x += 0.05;
      partB.position.y += 0.05;
      
      substrateGroup.position.y += 0.02;

      if (partA.position.distanceTo(partB.position) > 4) {
        // Reset
        phase = 0;
        substrateGroup.position.set(4, 4, 0);
        partA.position.set(-0.4, 0, 0);
        partB.position.set(0.4, 0, 0);
        bond.scale.y = 1;
        bond.visible = true;
        bond.material.color.setHex(0xffffff);
      }
    }
  };

  group.userData.quiz = [
    { question: "What is the specific region on the enzyme where the substrate binds called?", options: ["The Reactive Zone", "The Active Site", "The Substrate Pocket"], answer: 1 },
    { question: "How do enzymes speed up chemical reactions?", options: ["By heating up the molecules", "By lowering the Activation Energy required for the reaction to occur", "By increasing the pressure"], answer: 1 }
  ];

  return group;
}
