export function createHIVInfection(THREE) {
  const group = new THREE.Group();

  // 1. Helper T-Cell (The victim)
  const tcellGroup = new THREE.Group();
  group.add(tcellGroup);

  const tMat = new THREE.MeshStandardMaterial({ color: 0xaaffaa, transparent: true, opacity: 0.5, side: THREE.BackSide }); // Hollow inside view
  const membrane = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32, 0, Math.PI), tMat); // Half sphere
  tcellGroup.add(membrane);
  membrane.userData = { id: 'tcell', name: 'CD4+ Helper T-Cell', description: 'The commander of the immune system. Ironically, this is the exact cell HIV targets and destroys, leading to AIDS.' };

  // CD4 Receptor on surface
  const cd4 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), new THREE.MeshStandardMaterial({ color: 0xffff00 }));
  cd4.position.set(-2, 3.4, 0);
  cd4.rotation.z = Math.PI/4;
  tcellGroup.add(cd4);
  cd4.userData = { id: 'cd4', name: 'CD4 Receptor', description: 'The lock that HIV uses as a door handle to enter the cell.' };

  // T-Cell Nucleus (Host DNA)
  const nucMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, transparent: true, opacity: 0.5 });
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), nucMat);
  nucleus.position.set(0, -1, 0);
  tcellGroup.add(nucleus);

  const hostDna = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.1, 64, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  hostDna.position.set(0, -1, 0);
  tcellGroup.add(hostDna);
  hostDna.userData = { id: 'host_dna', name: 'Host DNA', description: 'The T-Cell\'s own genetic code.' };

  // 2. HIV Virus (Retrovirus)
  const hivGroup = new THREE.Group();
  hivGroup.position.set(-6, 6, 0);
  group.add(hivGroup);

  const hivMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const envelope = new THREE.Mesh(new THREE.SphereGeometry(0.8), hivMat);
  hivGroup.add(envelope);

  // gp120 Spike Protein (binds to CD4)
  const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  spike.position.set(0.7, -0.4, 0);
  spike.rotation.z = -Math.PI/4;
  hivGroup.add(spike);
  spike.userData = { id: 'gp120', name: 'gp120 Spike Protein', description: 'Perfectly shaped to bind to the human CD4 receptor, tricking the cell into letting it inside.' };

  // Viral RNA Core (Inside)
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
  const capsid = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8), coreMat);
  hivGroup.add(capsid);
  capsid.userData = { id: 'capsid', name: 'Viral Capsid', description: 'Contains the viral RNA and the enzyme Reverse Transcriptase.' };

  const viralRna = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
  hivGroup.add(viralRna);
  
  const reverseTrans = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
  reverseTrans.position.set(0.1, 0, 0);
  hivGroup.add(reverseTrans);

  // Integrated Provirus (Hidden inside host DNA)
  const provirus = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.4), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  provirus.position.set(0, -0.5, 0.5);
  provirus.visible = false;
  tcellGroup.add(provirus);
  provirus.userData = { id: 'provirus', name: 'Provirus', description: 'The viral DNA is permanently spliced into the host DNA by the enzyme Integrase. The cell is now a permanent virus factory.' };

  // New viruses budding off
  const buds = new THREE.Group();
  group.add(buds);

  let phase = 0; // 0: approach, 1: bind/fuse, 2: reverse transcription, 3: integration, 4: budding
  let timer = 0;

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;

    if (phase === 0) {
      // Approach CD4
      hivGroup.position.lerp(new THREE.Vector3(-2.8, 4.2, 0), 0.02);
      if (hivGroup.position.distanceTo(new THREE.Vector3(-2.8, 4.2, 0)) < 0.1) {
        phase = 1;
        timer = 0;
      }
    } else if (phase === 1) {
      // Fusion with membrane
      timer += delta;
      
      // Envelope melts into membrane
      envelope.scale.set(1 - timer*0.5, 1 - timer*0.5, 1 - timer*0.5);
      spike.visible = false;
      
      // Capsid drops into cell
      capsid.position.x += 0.05;
      capsid.position.y -= 0.05;
      viralRna.position.copy(capsid.position);
      reverseTrans.position.copy(capsid.position).add(new THREE.Vector3(0.1, 0, 0));

      if (timer > 2) {
        phase = 2;
        timer = 0;
        capsid.visible = false; // Capsid dissolves
      }
    } else if (phase === 2) {
      // Reverse Transcription (RNA -> DNA)
      timer += delta;
      
      viralRna.position.lerp(new THREE.Vector3(-1, 0, 0), 0.05);
      reverseTrans.position.copy(viralRna.position).add(new THREE.Vector3(0.1, Math.sin(t*10)*0.1, 0)); // working hard
      
      // RNA turns red (becomes viral DNA)
      if (timer > 1.5) {
        viralRna.material.color.setHex(0xff0000); // Now it's DNA
      }

      if (timer > 3) {
        phase = 3;
        timer = 0;
        reverseTrans.visible = false;
      }
    } else if (phase === 3) {
      // Integration into Nucleus
      timer += delta;
      
      viralRna.position.lerp(new THREE.Vector3(0, -1, 0), 0.05); // enter nucleus
      
      if (timer > 2) {
        viralRna.visible = false;
        provirus.visible = true; // Spliced into genome!
        
        if (timer > 3) {
          phase = 4;
          timer = 0;
        }
      }
    } else if (phase === 4) {
      // Factory mode: budding new viruses
      timer += delta;

      if (timer > 1 && buds.children.length < 5) {
        timer = 0;
        const newV = new THREE.Mesh(new THREE.SphereGeometry(0.5), hivMat);
        // Start at membrane edge
        const angle = Math.random() * Math.PI;
        newV.position.set(4*Math.cos(angle), 4*Math.sin(angle), 0);
        newV.userData = {
          vx: Math.cos(angle)*0.05,
          vy: Math.sin(angle)*0.05
        };
        buds.add(newV);
      }

      // Fly away
      buds.children.forEach(b => {
        b.position.x += b.userData.vx;
        b.position.y += b.userData.vy;
      });

      // Eventually the T-cell dies (reset sim for loop)
      if (buds.children.length >= 5 && buds.children[4].position.y > 6) {
        phase = 0;
        timer = 0;
        hivGroup.position.set(-6, 6, 0);
        envelope.scale.set(1, 1, 1);
        spike.visible = true;
        capsid.visible = true;
        capsid.position.set(0,0,0);
        viralRna.visible = true;
        viralRna.position.set(0,0,0);
        viralRna.material.color.setHex(0xffaa00);
        reverseTrans.visible = true;
        reverseTrans.position.set(0.1,0,0);
        provirus.visible = false;
        while(buds.children.length > 0) buds.remove(buds.children[0]);
      }
    }
  };

  group.userData.quiz = [
    { question: "What is unique about a 'Retrovirus' like HIV?", options: ["It travels backwards in time", "It uses the enzyme Reverse Transcriptase to convert its RNA into DNA, which is the reverse of normal cellular processes", "It only infects older people"], answer: 1 },
    { question: "Why is HIV so devastating to the human body?", options: ["It produces a deadly toxin", "It directly targets and destroys the CD4 Helper T-Cells, which are the commanders needed to activate the rest of the immune system", "It causes heart attacks"], answer: 1 }
  ];

  return group;
}
