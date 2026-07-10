export function createTranscription(THREE) {
  const group = new THREE.Group();

  // The DNA Template Strand (Bottom) and Non-Template (Top)
  const dnaGroup = new THREE.Group();
  dnaGroup.position.set(-6, 0, 0);
  group.add(dnaGroup);

  const bbDnaMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
  const bbRnaMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 }); // RNA backbone is different (Ribose)
  
  const aMat = new THREE.MeshStandardMaterial({ color: 0xff4444 }); // Adenine
  const tMat = new THREE.MeshStandardMaterial({ color: 0x44ff44 }); // Thymine (DNA only)
  const uMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Uracil (RNA only)
  const cMat = new THREE.MeshStandardMaterial({ color: 0xffff44 }); // Cytosine
  const gMat = new THREE.MeshStandardMaterial({ color: 0xff88ff }); // Guanine

  const dnaBases = [aMat, tMat, cMat, gMat];
  const rnaPairs = { 0: uMat, 1: aMat, 2: gMat, 3: cMat }; // A->U, T->A, C->G, G->C
  const dnaPairs = { 0: 1, 1: 0, 2: 3, 3: 2 };

  const numPairs = 40;
  const basesList = [];

  for(let i=0; i<numPairs; i++) {
    const bGroup = new THREE.Group();
    bGroup.position.x = i * 0.4;
    
    // Bottom strand is the Template
    const templateIdx = Math.floor(Math.random() * 4);
    const nonTemplateIdx = dnaPairs[templateIdx];

    // Bottom (Template)
    const bbTemp = new THREE.Mesh(new THREE.SphereGeometry(0.2), bbDnaMat);
    bbTemp.position.set(0, -1, 0);
    const baseTemp = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), dnaBases[templateIdx]);
    baseTemp.position.set(0, -0.5, 0);
    bGroup.add(bbTemp, baseTemp);

    // Top (Non-Template)
    const bbNon = new THREE.Mesh(new THREE.SphereGeometry(0.2), bbDnaMat);
    bbNon.position.set(0, 1, 0);
    const baseNon = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), dnaBases[nonTemplateIdx]);
    baseNon.position.set(0, 0.5, 0);
    bGroup.add(bbNon, baseNon);

    dnaGroup.add(bGroup);
    basesList.push({
      group: bGroup,
      temp: baseTemp, non: baseNon, bbTemp: bbTemp, bbNon: bbNon,
      tIdx: templateIdx,
      x: i * 0.4,
      rnaNode: null
    });
  }

  // RNA Polymerase (The huge enzyme)
  const polyGroup = new THREE.Group();
  polyGroup.position.set(0, 0, 0);
  group.add(polyGroup);
  
  // It's a big blob that surrounds the DNA
  const polyBlob = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16, 0, Math.PI*2, 0, Math.PI*0.8), new THREE.MeshStandardMaterial({ color: 0x88ff88, transparent: true, opacity: 0.6 }));
  polyBlob.rotation.x = Math.PI/2;
  polyGroup.add(polyBlob);
  polyBlob.userData = { id: 'rna_polymerase', name: 'RNA Polymerase', description: 'The enzyme that reads the DNA template strand and builds a complementary mRNA molecule.' };

  // mRNA exiting the polymerase
  const mrnaGroup = new THREE.Group();
  group.add(mrnaGroup);
  mrnaGroup.userData = { id: 'mrna', name: 'Messenger RNA (mRNA)', description: 'A single-stranded copy of the gene. Note that it uses Uracil (white) instead of Thymine (green).' };

  let polyX = 0; // relative to DNA

  group.userData.animate = function(delta) {
    const speed = 0.02;

    // Move DNA left
    dnaGroup.position.x -= speed;
    polyX += speed;

    if (dnaGroup.position.x < -15) {
      // Reset
      dnaGroup.position.x = -6;
      polyX = 0;
      // clear mRNA
      while(mrnaGroup.children.length > 0) {
        mrnaGroup.remove(mrnaGroup.children[0]);
      }
      basesList.forEach(b => {
        b.rnaNode = null;
        b.group.rotation.x = 0;
        b.temp.position.y = -0.5;
        b.bbTemp.position.y = -1;
        b.non.position.y = 0.5;
        b.bbNon.position.y = 1;
      });
    }

    // Inside Polymerase (Transcription Bubble)
    basesList.forEach((b, i) => {
      const distToPoly = polyX - b.x;
      
      if (distToPoly > -2 && distToPoly < 2) {
        // Inside bubble: unzip
        b.group.rotation.x = 0;
        
        b.temp.position.y = -1.0;
        b.bbTemp.position.y = -1.5;
        
        b.non.position.y = 1.0;
        b.bbNon.position.y = 1.5;

        // Create mRNA nucleotide at active site (distToPoly ~ 0)
        if (distToPoly > 0 && !b.rnaNode) {
          b.rnaNode = new THREE.Group();
          
          const rBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), rnaPairs[b.tIdx]);
          rBase.position.y = 0.5;
          const rBb = new THREE.Mesh(new THREE.SphereGeometry(0.2), bbRnaMat);
          rBb.position.y = 1;
          
          b.rnaNode.add(rBase, rBb);
          
          // Connect to previous if exists
          if (i > 0 && basesList[i-1].rnaNode) {
             const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), bbRnaMat);
             bond.position.set(-0.2, 1, 0);
             bond.rotation.z = Math.PI/2;
             b.rnaNode.add(bond);
          }

          mrnaGroup.add(b.rnaNode);
        }

      } else {
        // Outside bubble: zipped
        b.temp.position.y = -0.5;
        b.bbTemp.position.y = -1;
        b.non.position.y = 0.5;
        b.bbNon.position.y = 1;

        if (b.x > polyX) {
          // Downstream (not yet transcribed) - twisted
          b.group.rotation.x = (b.x - polyX) * 0.5;
        } else {
          // Upstream (already transcribed) - twisted back
          b.group.rotation.x = (polyX - b.x) * 0.5;
        }
      }

      // Move mRNA nodes out the "exit channel"
      if (b.rnaNode) {
        if (distToPoly > 1) {
          // Disconnect from DNA and float up/left out the top of the polymerase
          b.rnaNode.position.set(b.x + dnaGroup.position.x, 2 + (distToPoly-1)*0.5, (distToPoly-1)*0.2);
        } else {
          // Still hybridized to DNA template
          b.rnaNode.position.set(b.x + dnaGroup.position.x, -1.0, 0);
        }
      }
    });

  };

  group.userData.quiz = [
    { question: "What is the main difference between DNA and the new mRNA being built?", options: ["mRNA is double stranded", "mRNA uses Uracil instead of Thymine, and Ribose sugar instead of Deoxyribose", "mRNA is much longer than DNA"], answer: 1 },
    { question: "What is the name of the enzyme that reads the DNA and builds the mRNA?", options: ["DNA Polymerase", "Helicase", "RNA Polymerase"], answer: 2 }
  ];

  return group;
}
