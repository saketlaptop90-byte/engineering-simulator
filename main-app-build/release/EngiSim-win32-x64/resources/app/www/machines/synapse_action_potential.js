export function createSynapseActionPotential(THREE) {
  const group = new THREE.Group();

  // 1. Pre-synaptic Neuron (Axon Terminal)
  const preSynapticGroup = new THREE.Group();
  preSynapticGroup.position.set(0, 3, 0);
  group.add(preSynapticGroup);

  const neuronMat = new THREE.MeshStandardMaterial({ color: 0x99ccff, roughness: 0.6, transparent: true, opacity: 0.8 });
  
  // The axon bulb shape (like an upside down mushroom)
  const bulbGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const bulb = new THREE.Mesh(bulbGeo, neuronMat);
  bulb.rotation.x = Math.PI;
  preSynapticGroup.add(bulb);
  
  // The axon stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 3), neuronMat);
  stem.position.y = 1.5;
  preSynapticGroup.add(stem);

  bulb.userData = { id: 'axon_terminal', name: 'Axon Terminal (Presynaptic Neuron)', description: 'The end of the transmitting neuron. It contains vesicles filled with neurotransmitters.' };

  // Synaptic Vesicles (bubbles inside the terminal)
  const vesicleGeo = new THREE.SphereGeometry(0.3);
  const vesicleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const ntGeo = new THREE.SphereGeometry(0.05);
  const ntMat = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Neurotransmitters (Serotonin/Dopamine)
  
  const vesicles = [];
  for(let i=0; i<8; i++) {
    const v = new THREE.Mesh(vesicleGeo, vesicleMat);
    v.position.set((Math.random()-0.5)*2, Math.random()*1.5, (Math.random()-0.5)*2);
    preSynapticGroup.add(v);
    
    // Fill with NTs
    for(let j=0; j<5; j++) {
      const nt = new THREE.Mesh(ntGeo, ntMat);
      nt.position.set((Math.random()-0.5)*0.15, (Math.random()-0.5)*0.15, (Math.random()-0.5)*0.15);
      v.add(nt);
    }
    vesicles.push({ mesh: v, state: 'resting', originalY: v.position.y });
  }

  // 2. Post-synaptic Neuron (Dendrite)
  const postSynapticGroup = new THREE.Group();
  postSynapticGroup.position.set(0, -2, 0);
  group.add(postSynapticGroup);

  const dendriteGeo = new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5);
  const dendrite = new THREE.Mesh(dendriteGeo, neuronMat);
  dendrite.position.y = -1;
  postSynapticGroup.add(dendrite);
  dendrite.userData = { id: 'dendrite', name: 'Dendrite Spine (Postsynaptic Neuron)', description: 'The receiving neuron. Contains receptors that open when neurotransmitters bind to them.' };

  // Receptors on the dendrite
  const receptorGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4);
  const receptorMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
  const receptors = [];
  for(let i=0; i<15; i++) {
    const rec = new THREE.Mesh(receptorGeo, receptorMat);
    // Place them on the curve of the dendrite
    const angle = (Math.random() - 0.5) * Math.PI * 0.8;
    const r = 2.4;
    rec.position.set(Math.sin(angle)*r, 1.4 - Math.cos(angle), Math.cos(angle)*r*0.5);
    rec.lookAt(0, -1, 0);
    postSynapticGroup.add(rec);
    receptors.push(rec);
  }

  // Action Potential visualizer (lightning/electricity)
  const sparkGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const sparks = new THREE.Group();
  preSynapticGroup.add(sparks);
  for(let i=0; i<5; i++) {
    const s = new THREE.Mesh(sparkGeo, sparkMat);
    s.visible = false;
    sparks.add(s);
  }

  // Free floating neurotransmitters in synaptic cleft
  const freeNTs = new THREE.Group();
  group.add(freeNTs);
  
  let firing = false;
  let fireTimer = 0;

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;
    
    // Background pulsing of resting state
    if (!firing) {
      if (Math.random() < 0.01) {
        firing = true;
        fireTimer = 0;
      }
    }

    if (firing) {
      fireTimer += delta;
      
      // Phase 1: Action Potential comes down
      if (fireTimer < 0.5) {
        sparks.children.forEach(s => {
          s.visible = true;
          s.position.set((Math.random()-0.5)*1.5, 3 - fireTimer*6 + (Math.random()-0.5)*1, (Math.random()-0.5)*1.5);
          s.rotation.set(Math.random(), Math.random(), Math.random());
        });
      } else {
        sparks.children.forEach(s => s.visible = false);
      }

      // Phase 2: Vesicles move down and fuse
      if (fireTimer > 0.3 && fireTimer < 1.0) {
        vesicles.forEach(v => {
          if (v.state === 'resting') {
            v.mesh.position.y -= 0.05;
            if (v.mesh.position.y <= 0.2) {
              v.state = 'fused';
              v.mesh.material.opacity = 0; // "fuse" with membrane
              
              // Release NTs into cleft
              for(let i=0; i<5; i++) {
                const nt = new THREE.Mesh(ntGeo, ntMat);
                nt.position.copy(v.mesh.position).add(preSynapticGroup.position);
                // Add random velocity
                nt.userData = { 
                  vx: (Math.random()-0.5)*0.05, 
                  vy: -0.05 - Math.random()*0.05, 
                  vz: (Math.random()-0.5)*0.05 
                };
                freeNTs.add(nt);
              }
            }
          }
        });
      }

      // Phase 3: NTs cross cleft and hit receptors
      if (freeNTs.children.length > 0) {
        freeNTs.children.forEach(nt => {
          nt.position.x += nt.userData.vx;
          nt.position.y += nt.userData.vy;
          nt.position.z += nt.userData.vz;
          
          // Receptors glow when hit
          if (nt.position.y < -0.5 && nt.position.y > -1.5) {
            receptors.forEach(rec => {
              if (rec.position.distanceTo(nt.position.clone().sub(postSynapticGroup.position)) < 0.5) {
                rec.material.color.setHex(0xffff00); // Glow yellow
                setTimeout(() => { rec.material.color.setHex(0xff00ff); }, 500);
              }
            });
          }
        });
      }

      // Phase 4: Reset
      if (fireTimer > 2.5) {
        firing = false;
        fireTimer = 0;
        // Clean up cleft
        while(freeNTs.children.length > 0) {
          freeNTs.remove(freeNTs.children[0]);
        }
        // Reset vesicles
        vesicles.forEach(v => {
          v.state = 'resting';
          v.mesh.position.y = v.originalY;
          v.mesh.material.opacity = 0.5;
        });
      }
    } else {
      // Gentle floating when resting
      vesicles.forEach((v, i) => {
        if (v.state === 'resting') {
          v.mesh.position.y = v.originalY + Math.sin(t*2 + i)*0.1;
        }
      });
    }
  };

  group.userData.quiz = [
    { question: "How do electrical signals (Action Potentials) cross the gap between two neurons?", options: ["By jumping like a spark of static electricity", "By converting into chemical messengers (Neurotransmitters) that float across the gap", "By creating a magnetic field"], answer: 1 },
    { question: "What is the gap between the two neurons called?", options: ["The Synaptic Cleft", "The Axon Bridge", "The Myelin Sheath"], answer: 0 }
  ];

  return group;
}
