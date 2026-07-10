export function createGelElectrophoresis(THREE) {
  const group = new THREE.Group();

  // 1. Electrophoresis Box / Buffer Tank
  const boxMat = new THREE.MeshPhysicalMaterial({ color: 0xccffff, transmission: 0.9, opacity: 0.5, transparent: true, side: THREE.DoubleSide });
  const box = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 4), boxMat);
  box.position.y = -1;
  group.add(box);

  // Buffer liquid inside
  const buffer = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.2, 3.8), new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 }));
  buffer.position.y = -1;
  group.add(buffer);
  buffer.userData = { id: 'buffer', name: 'Buffer Solution', description: 'A saltwater solution that conducts electricity and keeps the gel from drying out or changing pH.' };

  // Electrodes
  const negElectrode = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.8), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  negElectrode.rotation.x = Math.PI/2;
  negElectrode.position.set(-2.8, -1.2, 0);
  
  const posElectrode = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.8), new THREE.MeshStandardMaterial({ color: 0xff2222 }));
  posElectrode.rotation.x = Math.PI/2;
  posElectrode.position.set(2.8, -1.2, 0);
  group.add(negElectrode, posElectrode);

  negElectrode.userData = { id: 'cathode', name: 'Negative Electrode (Cathode - Black)', description: 'DNA has a negative charge (due to phosphate backbone), so it is repelled by this side.' };
  posElectrode.userData = { id: 'anode', name: 'Positive Electrode (Anode - Red)', description: 'DNA is attracted to this side. "Run to Red".' };

  // 2. Agarose Gel
  const gelGeo = new THREE.BoxGeometry(4, 0.5, 3);
  const gelMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 0.8, transparent: true, roughness: 0.3 });
  const gel = new THREE.Mesh(gelGeo, gelMat);
  gel.position.set(0, -1.2, 0);
  group.add(gel);
  gel.userData = { id: 'agarose_gel', name: 'Agarose Gel', description: 'Acts like a microscopic sponge or sponge-maze. Small DNA pieces wiggle through easily and go fast. Big pieces get tangled and go slow.' };

  // Wells (holes for DNA)
  const wellGeo = new THREE.BoxGeometry(0.3, 0.4, 0.6);
  const wellMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 });
  const wells = [];
  for(let z=-1; z<=1; z+=1) {
    const well = new THREE.Mesh(wellGeo, wellMat);
    well.position.set(-1.6, -1.1, z);
    group.add(well);
    wells.push(well);
  }
  wells[0].userData = { id: 'wells', name: 'Wells', description: 'Indentations where the DNA samples are loaded using a micropipette.' };

  // 3. DNA Bands
  const bandMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 }); // UV fluorescent
  
  const lanes = [];
  
  // Lane 1: Ladder (Standard size markers)
  const ladder = [];
  for(let i=0; i<5; i++) {
    const b = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.5), bandMat);
    b.rotation.x = -Math.PI/2;
    b.position.set(-1.6, -1.0, -1);
    group.add(b);
    // Speed determines how far it goes (smaller = faster)
    ladder.push({ mesh: b, speed: 0.05 + i*0.02, maxDist: 3 - i*0.5 });
  }
  lanes.push(ladder);

  // Lane 2: Sample A (Two bands)
  const sampleA = [
    { mesh: new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.5), bandMat), speed: 0.07, maxDist: 2.5 }, // Matches ladder 2
    { mesh: new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.5), bandMat), speed: 0.11, maxDist: 1.5 }  // Matches ladder 4
  ];
  sampleA.forEach(b => {
    b.mesh.rotation.x = -Math.PI/2;
    b.mesh.position.set(-1.6, -1.0, 0);
    group.add(b.mesh);
  });
  lanes.push(sampleA);

  // Lane 3: Sample B (One band)
  const sampleB = [
    { mesh: new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.5), bandMat), speed: 0.05, maxDist: 3.0 } // Matches ladder 1 (small)
  ];
  sampleB.forEach(b => {
    b.mesh.rotation.x = -Math.PI/2;
    b.mesh.position.set(-1.6, -1.0, 1);
    group.add(b.mesh);
  });
  lanes.push(sampleB);

  sampleA[0].mesh.userData = { id: 'dna_band', name: 'DNA Band (Ethidium Bromide)', description: 'A band contains millions of DNA fragments of the exact same length. We see them glowing under UV light.' };

  // 4. Power Supply Wire Sparks (Animation)
  const sparkGeo = new THREE.SphereGeometry(0.05);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sparks = new THREE.Group();
  group.add(sparks);

  let phase = 0; // 0: off, 1: running, 2: UV light
  let timer = 0;
  let runProgress = 0;

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;

    timer += delta;

    if (phase === 0) {
      // Off, resetting
      runProgress = 0;
      lanes.forEach(lane => lane.forEach(b => {
        b.mesh.position.x = -1.6;
        b.mesh.material.opacity = 0; // invisible without UV
        b.mesh.material.color.setHex(0x0000ff); // loading dye color (blue)
      }));
      if (timer > 2) {
        phase = 1;
        timer = 0;
      }
    } else if (phase === 1) {
      // Running
      runProgress += delta * 0.5;
      
      // Animate sparks from neg to pos
      if (Math.random() < 0.2) {
        const s = new THREE.Mesh(sparkGeo, sparkMat);
        s.position.set(-2.8, -1.2, (Math.random()-0.5)*3.8);
        sparks.add(s);
      }
      for(let i=sparks.children.length-1; i>=0; i--) {
        const s = sparks.children[i];
        s.position.x += 0.2;
        if (s.position.x > 2.8) sparks.remove(s);
      }

      // Move bands
      lanes.forEach(lane => {
        lane.forEach(b => {
          // Show blue tracking dye while running
          b.mesh.material.opacity = 0.5;
          b.mesh.material.color.setHex(0x0000aa);
          
          if (b.mesh.position.x < -1.6 + b.maxDist) {
            b.mesh.position.x += b.speed * delta;
          }
        });
      });

      if (runProgress > 5) {
        phase = 2;
        timer = 0;
        while(sparks.children.length > 0) sparks.remove(sparks.children[0]);
      }
    } else if (phase === 2) {
      // UV Light (Fluorescence)
      // Turn off room lights, turn on UV
      box.material.color.setHex(0x220044); // Dark purple
      buffer.material.opacity = 0.2;
      
      lanes.forEach(lane => {
        lane.forEach(b => {
          b.mesh.material.opacity = 0.9;
          b.mesh.material.color.setHex(0x00ff00); // Glowing green
        });
      });

      if (timer > 4) {
        phase = 0;
        timer = 0;
        // Restore lights
        box.material.color.setHex(0xccffff);
        buffer.material.opacity = 0.6;
      }
    }
  };

  group.userData.quiz = [
    { question: "Why does DNA move through the gel when the power is turned on?", options: ["Because the gel is moving", "Because DNA is negatively charged and is attracted to the positive electrode", "Because it is heavy"], answer: 1 },
    { question: "Which DNA fragments move the farthest/fastest through the gel?", options: ["The largest fragments", "The fragments with the most A-T pairs", "The smallest/shortest fragments, because they slip through the gel pores easily"], answer: 2 }
  ];

  return group;
}
