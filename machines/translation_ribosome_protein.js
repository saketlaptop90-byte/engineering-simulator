export function createTranslation(THREE) {
  const group = new THREE.Group();

  // 1. mRNA Strand (moving right to left)
  const mrnaGroup = new THREE.Group();
  mrnaGroup.position.set(5, 0, 0);
  group.add(mrnaGroup);

  const bbMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 }); // RNA backbone
  const bases = [
    new THREE.MeshStandardMaterial({ color: 0xffffff }), // U
    new THREE.MeshStandardMaterial({ color: 0xff4444 }), // A
    new THREE.MeshStandardMaterial({ color: 0xffff44 }), // C
    new THREE.MeshStandardMaterial({ color: 0xff88ff })  // G
  ];
  
  // We need codons (groups of 3)
  const numCodons = 10;
  const codonList = []; // stores indices of bases

  for(let c=0; c<numCodons; c++) {
    const codonGroup = new THREE.Group();
    codonGroup.position.x = c * -1.5;
    
    // 3 bases per codon
    const indices = [];
    for(let b=0; b<3; b++) {
      const bIdx = Math.floor(Math.random() * 4);
      indices.push(bIdx);
      
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), bases[bIdx]);
      base.position.set(b * 0.4 - 0.4, 0.5, 0);
      codonGroup.add(base);

      const bb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.2), bbMat);
      bb.position.set(b * 0.4 - 0.4, 1, 0);
      codonGroup.add(bb);
    }
    mrnaGroup.add(codonGroup);
    codonList.push({ group: codonGroup, indices: indices, x: c * -1.5 });
  }

  mrnaGroup.children[0].userData = { id: 'mrna', name: 'Messenger RNA (mRNA)', description: 'The instructions from the nucleus. Read in groups of 3 letters called Codons.' };

  // 2. Ribosome (The factory)
  const riboGroup = new THREE.Group();
  group.add(riboGroup);

  // Small subunit (bottom)
  const smallSub = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 2), new THREE.MeshStandardMaterial({ color: 0x88aaff, transparent: true, opacity: 0.8 }));
  smallSub.rotation.z = Math.PI/2;
  smallSub.position.y = -1;
  riboGroup.add(smallSub);

  // Large subunit (top)
  const largeSub = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshStandardMaterial({ color: 0x6688cc, transparent: true, opacity: 0.8 }));
  largeSub.position.y = 1;
  riboGroup.add(largeSub);

  largeSub.userData = { id: 'ribosome', name: 'Ribosome (rRNA)', description: 'The molecular machine that reads mRNA and links amino acids together to make a protein. It has A, P, and E sites for tRNAs.' };

  // 3. tRNA (Transfer RNA)
  const trnaGeo = new THREE.TorusGeometry(0.4, 0.15, 16, 3); // roughly cloverleaf shape
  const trnaMat = new THREE.MeshStandardMaterial({ color: 0x44ff44 });
  
  // Amino Acids (colored beads)
  const aaGeo = new THREE.SphereGeometry(0.3);

  // Floating tRNAs in cytoplasm
  const freeTrnas = new THREE.Group();
  group.add(freeTrnas);
  for(let i=0; i<5; i++) {
    const t = new THREE.Mesh(trnaGeo, trnaMat);
    t.position.set((Math.random()-0.5)*8, 4 + Math.random()*2, (Math.random()-0.5)*2);
    // Attach AA
    const aa = new THREE.Mesh(aaGeo, new THREE.MeshStandardMaterial({ color: Math.random()*0xffffff }));
    aa.position.y = 0.6;
    t.add(aa);
    freeTrnas.add(t);
  }

  freeTrnas.children[0].userData = { id: 'trna', name: 'Transfer RNA (tRNA)', description: 'Carries a specific amino acid on one end, and has an Anticodon on the other end to match the mRNA codon.' };

  // 4. The Growing Protein Chain (Polypeptide)
  const chainGroup = new THREE.Group();
  group.add(chainGroup);
  chainGroup.position.set(0, 3, 0);
  chainGroup.userData = { id: 'protein', name: 'Polypeptide Chain (Protein)', description: 'The finished product: a sequence of amino acids connected by peptide bonds, which will fold into a 3D structure.' };

  let currentCodon = 0;
  let phase = 0; // 0: tRNA arriving at A site, 1: Peptide bond forming, 2: Shift (translocation)
  let activeTrna = null;
  let prevTrna = null;
  let chainLength = 0;

  group.userData.animate = function(delta) {
    const speed = 0.02;

    if (currentCodon >= numCodons) {
      // Done. Reset.
      currentCodon = 0;
      mrnaGroup.position.x = 5;
      while(chainGroup.children.length > 0) chainGroup.remove(chainGroup.children[0]);
      chainLength = 0;
      if (activeTrna) { riboGroup.remove(activeTrna); activeTrna = null; }
      if (prevTrna) { riboGroup.remove(prevTrna); prevTrna = null; }
    }

    if (phase === 0) {
      // tRNA approaching A site
      if (!activeTrna) {
        activeTrna = new THREE.Mesh(trnaGeo, trnaMat);
        activeTrna.position.set(2, 4, 0); // start high right
        const aa = new THREE.Mesh(aaGeo, new THREE.MeshStandardMaterial({ color: Math.random()*0xffffff }));
        aa.position.y = 0.6;
        activeTrna.add(aa);
        riboGroup.add(activeTrna);
      }

      // Lerp to A site (x = 0)
      activeTrna.position.lerp(new THREE.Vector3(0, 1.5, 0), 0.1);
      
      if (activeTrna.position.distanceTo(new THREE.Vector3(0, 1.5, 0)) < 0.1) {
        phase = 1;
      }
    } else if (phase === 1) {
      // Transfer chain from prevTrna (P site) to activeTrna (A site)
      if (prevTrna) {
        // Move the whole chain to sit on top of the new AA
        chainGroup.position.set(0, 4, 0); // shift chain right over A site temporarily
        
        // Disconnect from prev
        prevTrna.remove(prevTrna.children[0]); 
      }
      
      // Add the new AA to the chain group
      const newAA = activeTrna.children[0].clone();
      // It becomes the bottom of the chain
      newAA.position.set(0, -chainLength * 0.4, 0);
      chainGroup.add(newAA);
      
      // Add bond
      if (chainLength > 0) {
        const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        bond.position.set(0, -chainLength * 0.4 + 0.2, 0);
        chainGroup.add(bond);
      }
      
      activeTrna.remove(activeTrna.children[0]); // It's in the chain now
      chainLength++;
      
      phase = 2;
    } else if (phase === 2) {
      // Translocation (Shift left)
      mrnaGroup.position.x += 0.05; // mRNA moves left
      
      // A site tRNA moves to P site
      activeTrna.position.x -= 0.05;
      
      // Chain moves with it
      chainGroup.position.x -= 0.05;

      // P site tRNA moves to E site and leaves
      if (prevTrna) {
        prevTrna.position.x -= 0.05;
        prevTrna.position.y += 0.05; // float away
        if (prevTrna.position.y > 4) {
          riboGroup.remove(prevTrna);
          prevTrna = null;
        }
      }

      // Check if shifted one full codon (1.5 units)
      const targetX = 5 + (currentCodon + 1) * 1.5;
      if (mrnaGroup.position.x >= targetX) {
        mrnaGroup.position.x = targetX;
        prevTrna = activeTrna; // Now in P site
        activeTrna = null;
        
        // Reset chain to center P site
        chainGroup.position.x = 0;
        // Shift chain up so bottom is at fixed height
        chainGroup.children.forEach(c => c.position.y += 0.4);
        
        currentCodon++;
        phase = 0;
      }
    }

    // Wiggle free tRNAs
    const t = Date.now()*0.001;
    freeTrnas.children.forEach((trna, i) => {
      trna.rotation.z = Math.sin(t*2+i)*0.2;
      trna.position.y += Math.sin(t+i)*0.01;
    });

  };

  group.userData.quiz = [
    { question: "What matches with the mRNA Codon to ensure the correct Amino Acid is added?", options: ["The Ribosome", "The tRNAs Anticodon", "DNA Polymerase"], answer: 1 },
    { question: "What is the chain of amino acids produced by translation called?", options: ["A Polysaccharide", "A Polypeptide (Protein)", "A Polynucleotide"], answer: 1 }
  ];

  return group;
}
