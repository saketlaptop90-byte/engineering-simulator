export function createKaryotype(THREE) {
  const group = new THREE.Group();

  // A Karyotype is a picture of all 46 human chromosomes lined up in pairs.
  // We'll arrange them in a grid.

  const chromoMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const bandMat = new THREE.MeshBasicMaterial({ color: 0x333333 }); // G-banding

  const chromoGroup = new THREE.Group();
  group.add(chromoGroup);

  // Helper to make a single chromosome (looks like an X, or an I if before replication)
  // Usually karyotypes are taken at metaphase, so they look like X's (two sister chromatids)
  const createChromosome = (size, hasBands) => {
    const c = new THREE.Group();
    
    // Left chromatid
    const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, size), chromoMat);
    l.position.set(-0.1, 0, 0);
    l.rotation.z = -0.1;
    
    // Right chromatid
    const r = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, size), chromoMat);
    r.position.set(0.1, 0, 0);
    r.rotation.z = 0.1;

    c.add(l, r);

    // Add banding pattern (stripes)
    if (hasBands) {
      for(let y=-size/2 + 0.2; y<size/2 - 0.2; y+=0.4) {
        if (Math.random() > 0.5) {
          const band = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.3), bandMat);
          band.position.y = y;
          c.add(band);
        }
      }
    }
    
    // Centromere pinch
    const centro = new THREE.Mesh(new THREE.SphereGeometry(0.16), new THREE.MeshBasicMaterial({ color: 0x888888 }));
    centro.position.y = size * 0.1; // slightly off center
    c.add(centro);

    return c;
  };

  const pairs = [];
  
  // 22 pairs of Autosomes + 1 pair of Sex Chromosomes
  // They decrease in size from Pair 1 to 22.
  let row = 0;
  let col = 0;

  for(let i=1; i<=23; i++) {
    let size = 3 - (i * 0.1); // gets smaller
    if (size < 0.5) size = 0.5;

    const pair = new THREE.Group();
    
    // Chromosome A (from Mom)
    const chrA = createChromosome(size, true);
    chrA.position.x = -0.4;
    
    // Chromosome B (from Dad)
    let chrB;
    if (i === 23) {
      // Sex chromosomes: XY (Male) for this example
      chrB = createChromosome(0.8, true); // Y is very small
      chrA.userData = { id: 'x_chrom', name: 'X Chromosome', description: 'Large sex chromosome.' };
      chrB.userData = { id: 'y_chrom', name: 'Y Chromosome', description: 'Small sex chromosome. Contains the SRY gene that triggers male development.' };
    } else {
      chrB = createChromosome(size, true);
    }
    chrB.position.x = 0.4;

    pair.add(chrA, chrB);

    // Grid positioning
    pair.position.set((col * 2.5) - 6, (row * -3.5) + 4, 0);
    chromoGroup.add(pair);
    pairs.push(pair);

    col++;
    if (col > 5) {
      col = 0;
      row++;
    }

    if (i === 21) {
      // Down Syndrome is Trisomy 21. Let's add an interactive element later.
      pair.userData = { id: 'pair_21', name: 'Chromosome Pair 21', description: 'Normally there are two. If a person inherits three copies of this chromosome, they have Down Syndrome (Trisomy 21).' };
    }
  }

  // Animate: Just gentle bobbing and highlighting
  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;
    pairs.forEach((p, i) => {
      p.position.y += Math.sin(t*2 + i)*0.002;
    });
  };

  group.userData.quiz = [
    { question: "How many total chromosomes are in a normal human somatic (body) cell?", options: ["23", "46 (23 pairs)", "92"], answer: 1 },
    { question: "Looking at pair 23 (bottom right), this karyotype has one large X chromosome and one small Y chromosome. Is this individual biologically male or female?", options: ["Female (XX)", "Male (XY)"], answer: 1 }
  ];

  return group;
}
