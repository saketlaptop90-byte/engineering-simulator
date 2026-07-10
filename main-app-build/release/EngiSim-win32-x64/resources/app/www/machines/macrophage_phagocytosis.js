export function createMacrophagePhagocytosis(THREE) {
  const group = new THREE.Group();

  // 1. The Macrophage (White Blood Cell)
  const macroGroup = new THREE.Group();
  macroGroup.position.set(-3, 0, 0);
  group.add(macroGroup);

  const macroMat = new THREE.MeshStandardMaterial({ color: 0x88bbff, roughness: 0.8, transparent: true, opacity: 0.8 });
  
  // Custom amoeba-like shape
  const geo = new THREE.SphereGeometry(3, 32, 32);
  const pos = geo.attributes.position;
  // We'll deform it in the animation loop
  const macro = new THREE.Mesh(geo, macroMat);
  macroGroup.add(macro);
  macro.userData = { id: 'macrophage', name: 'Macrophage', description: 'A large white blood cell that patrols the body, eating dead cells and foreign invaders (bacteria).' };

  // Nucleus inside
  const nucMat = new THREE.MeshStandardMaterial({ color: 0x2244aa });
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), nucMat);
  nucleus.position.set(-1, 0, 0);
  macroGroup.add(nucleus);

  // Lysosomes inside
  const lysMat = new THREE.MeshStandardMaterial({ color: 0xccff22 });
  const lysosomes = [];
  for(let i=0; i<5; i++) {
    const lys = new THREE.Mesh(new THREE.SphereGeometry(0.3), lysMat);
    lys.position.set(-1.5 + Math.random(), (Math.random()-0.5)*3, (Math.random()-0.5)*3);
    macroGroup.add(lys);
    lysosomes.push(lys);
  }
  lysosomes[0].userData = { id: 'lysosome', name: 'Lysosome', description: 'Vesicles filled with destructive digestive enzymes and acids.' };

  // 2. The Pathogen (Bacteria)
  const bacGroup = new THREE.Group();
  bacGroup.position.set(4, 0, 0);
  group.add(bacGroup);

  const bacMat = new THREE.MeshStandardMaterial({ color: 0x44ff44 });
  const bacteria = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1, 8, 8), bacMat);
  bacteria.rotation.z = Math.PI / 2;
  bacGroup.add(bacteria);
  bacteria.userData = { id: 'pathogen', name: 'Pathogen (Bacteria)', description: 'A foreign invader recognized by the macrophage.' };

  // 3. Phagolysosome (The stomach)
  // We'll create it during the animation

  let phase = 0; // 0: approach, 1: engulf (pseudopodia), 2: digest, 3: excrete
  let timer = 0;
  
  // Store original sphere positions for deformation
  const origPos = [];
  for(let i=0; i<pos.count; i++) {
    origPos.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
  }

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.002;

    // Amoeba jiggle
    for(let i=0; i<pos.count; i++) {
      const v = origPos[i];
      let offset = Math.sin(t*2 + v.x*2 + v.y*2)*0.1;
      
      // Pseudopodia (arms reaching out) during phase 0 and 1
      if (phase < 2) {
        if (v.x > 1.5 && Math.abs(v.y) > 0.5 && Math.abs(v.y) < 2.5) {
          // reach out towards bacteria
          const reach = Math.max(0, 4 - bacGroup.position.distanceTo(macroGroup.position)); // 0 to 4
          offset += reach * (v.x / 3);
        }
        // Mouth opening
        if (v.x > 2 && Math.abs(v.y) <= 0.5) {
           const reach = Math.max(0, 4 - bacGroup.position.distanceTo(macroGroup.position));
           offset -= reach * 0.5; // push in to make a cavity
        }
      }

      pos.setXYZ(i, v.x + offset, v.y + offset, v.z + offset);
    }
    geo.computeVertexNormals();
    pos.needsUpdate = true;

    // Phase Logic
    if (phase === 0) {
      // Approach
      bacGroup.position.x -= 0.02;
      bacteria.rotation.y = t;
      bacteria.rotation.z = Math.PI/2 + Math.sin(t)*0.2; // wiggle
      
      if (bacGroup.position.x < 0) {
        phase = 1;
        timer = 0;
      }
    } else if (phase === 1) {
      // Engulfing (Phagosome forming)
      timer += delta;
      
      bacGroup.position.x -= 0.01; // pull deeper inside
      
      if (timer > 2) {
        phase = 2;
        timer = 0;
      }
    } else if (phase === 2) {
      // Digestion (Lysosomes merge)
      timer += delta;
      
      // Lysosomes move towards bacteria
      lysosomes.forEach(lys => {
        lys.position.lerp(bacGroup.position.clone().sub(macroGroup.position), 0.05);
      });
      
      // Bacteria turns yellow then dissolves
      if (timer > 1) {
        bacMat.color.setHex(0xffff00); // digesting
        bacteria.scale.set(1 - (timer-1)*0.2, 1 - (timer-1)*0.2, 1 - (timer-1)*0.2);
      }
      
      if (timer > 5) {
        phase = 3;
        bacteria.visible = false;
        timer = 0;
      }
    } else if (phase === 3) {
      // Excretion (Exocytosis) of waste
      timer += delta;
      
      // Lysosomes go back
      lysosomes.forEach((lys, i) => {
        lys.position.lerp(new THREE.Vector3(-1.5, (i-2)*0.5, 0), 0.05);
      });

      if (timer > 3) {
        // Reset
        phase = 0;
        bacGroup.position.set(4, 0, 0);
        bacteria.visible = true;
        bacteria.scale.set(1, 1, 1);
        bacMat.color.setHex(0x44ff44);
      }
    }
  };

  group.userData.quiz = [
    { question: "What is the process called where a Macrophage 'eats' a bacteria?", options: ["Photosynthesis", "Phagocytosis", "Exocytosis"], answer: 1 },
    { question: "What organelle inside the Macrophage merges with the trapped bacteria to digest it?", options: ["The Nucleus", "The Mitochondria", "The Lysosome"], answer: 2 }
  ];

  return group;
}
