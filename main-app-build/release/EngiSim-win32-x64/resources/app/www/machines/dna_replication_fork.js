export function createDNAReplication(THREE) {
  const group = new THREE.Group();

  // The DNA Double Helix unzipping (Replication Fork)
  const dnaGroup = new THREE.Group();
  dnaGroup.position.set(-6, 0, 0); // starts far left, moves right
  group.add(dnaGroup);

  const backboneMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, roughness: 0.5 });
  const aMat = new THREE.MeshStandardMaterial({ color: 0xff4444 }); // Adenine
  const tMat = new THREE.MeshStandardMaterial({ color: 0x44ff44 }); // Thymine
  const cMat = new THREE.MeshStandardMaterial({ color: 0xffff44 }); // Cytosine
  const gMat = new THREE.MeshStandardMaterial({ color: 0xff88ff }); // Guanine

  const bases = [aMat, tMat, cMat, gMat];
  const pairs = { 0: 1, 1: 0, 2: 3, 3: 2 }; // A-T, C-G

  const numPairs = 40;
  const basePairs = [];

  for(let i=0; i<numPairs; i++) {
    const pairGroup = new THREE.Group();
    pairGroup.position.x = i * 0.4;
    
    // Choose random base
    const b1Idx = Math.floor(Math.random() * 4);
    const b2Idx = pairs[b1Idx];

    // Left backbone (Top)
    const bb1 = new THREE.Mesh(new THREE.SphereGeometry(0.2), backboneMat);
    bb1.position.set(0, 1, 0);
    pairGroup.add(bb1);

    // Right backbone (Bottom)
    const bb2 = new THREE.Mesh(new THREE.SphereGeometry(0.2), backboneMat);
    bb2.position.set(0, -1, 0);
    pairGroup.add(bb2);

    // Base 1 (Top down)
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), bases[b1Idx]);
    base1.position.set(0, 0.5, 0);
    pairGroup.add(base1);

    // Base 2 (Bottom up)
    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), bases[b2Idx]);
    base2.position.set(0, -0.5, 0);
    pairGroup.add(base2);

    dnaGroup.add(pairGroup);
    
    basePairs.push({
      group: pairGroup,
      bb1: bb1, bb2: bb2,
      base1: base1, base2: base2,
      b1Idx: b1Idx, b2Idx: b2Idx,
      x: i * 0.4,
      state: 'zipped' // zipped, unzipping, copied
    });
  }

  // 1. Helicase (Unzipper)
  const helicase = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16), new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
  helicase.rotation.x = Math.PI / 2;
  helicase.position.set(0, 0, 0);
  group.add(helicase);
  helicase.userData = { id: 'helicase', name: 'DNA Helicase', description: 'The enzyme that unwinds the double helix and breaks the hydrogen bonds between base pairs, creating the replication fork.' };

  // 2. DNA Polymerase (Copier) - Leading Strand
  const polyLead = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), new THREE.MeshStandardMaterial({ color: 0x00ffaa }));
  polyLead.position.set(-2, 1, 0);
  group.add(polyLead);
  polyLead.userData = { id: 'poly_lead', name: 'DNA Polymerase (Leading Strand)', description: 'Reads the exposed template strand and continuously builds the new complementary strand in the 5\' to 3\' direction.' };

  // DNA Polymerase - Lagging Strand (Works backwards in chunks)
  const polyLag = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), new THREE.MeshStandardMaterial({ color: 0x00aaff }));
  polyLag.position.set(-3, -1, 0);
  group.add(polyLag);
  polyLag.userData = { id: 'poly_lag', name: 'DNA Polymerase (Lagging Strand)', description: 'Must work backwards in short segments called Okazaki fragments because it can only build in the 5\' to 3\' direction.' };

  // Free Nucleotides swimming around
  const freeGroup = new THREE.Group();
  group.add(freeGroup);
  const fNodes = [];
  for(let i=0; i<15; i++) {
    const bIdx = Math.floor(Math.random() * 4);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), bases[bIdx]);
    m.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*6, (Math.random()-0.5)*4);
    freeGroup.add(m);
    fNodes.push({ mesh: m, idx: bIdx, vx: (Math.random()-0.5)*0.05, vy: (Math.random()-0.5)*0.05 });
  }

  let forkX = 0; // Where the unzipping is happening in local DNA coordinates

  group.userData.animate = function(delta) {
    const speed = 0.02;

    // Move DNA left (so fork stays at X=0 in world space)
    dnaGroup.position.x -= speed;
    forkX += speed;

    if (dnaGroup.position.x < -15) {
      // Reset
      dnaGroup.position.x = -6;
      forkX = 0;
      basePairs.forEach(p => {
        p.state = 'zipped';
        p.base1.position.y = 0.5;
        p.base2.position.y = -0.5;
        p.bb1.position.y = 1;
        p.bb2.position.y = -1;
        // remove new bases if added
        if (p.newBase1) { p.group.remove(p.newBase1); p.newBase1 = null; }
        if (p.newBase2) { p.group.remove(p.newBase2); p.newBase2 = null; }
      });
    }

    // Helicase spinning
    helicase.rotation.y += 0.1;

    // Polymerase moving
    polyLead.position.x = -1.5 + Math.sin(Date.now()*0.01)*0.1;
    // Lagging polymerase jumps back
    const lagX = (Date.now()*0.005) % 3;
    polyLag.position.x = -2 - lagX;

    // Animate base pairs
    basePairs.forEach(p => {
      // Twist the zipped part
      if (p.x > forkX) {
        // Zipped: apply twist
        const twist = (p.x - forkX) * 0.5; // radians per unit
        p.group.rotation.x = twist;
        p.group.position.y = 0;
      } else {
        // Unzipped
        p.group.rotation.x = 0;
        
        // Push apart
        const dist = Math.min(2, (forkX - p.x)); // 0 to 2
        
        // Top strand goes up
        p.base1.position.y = 0.5 + dist;
        p.bb1.position.y = 1 + dist;
        
        // Bottom strand goes down
        p.base2.position.y = -0.5 - dist;
        p.bb2.position.y = -1 - dist;

        // Copy logic (Add new complementary bases)
        if (dist > 1.0 && !p.newBase1 && p.x > forkX - 4) { // Leading strand copying closely behind
          p.newBase1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), bases[pairs[p.b1Idx]]);
          p.newBase1.position.set(0, -0.5 + dist, 0); // attaches to bottom of top strand
          p.group.add(p.newBase1);
          
          const newBb1 = new THREE.Mesh(new THREE.SphereGeometry(0.2), backboneMat);
          newBb1.position.set(0, -1 + dist, 0);
          p.group.add(newBb1);
        }

        // Lagging strand copies in chunks further back
        if (dist > 1.5 && !p.newBase2 && (p.x % 1.2) < 0.4 && p.x > forkX - 8) {
          p.newBase2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), bases[pairs[p.b2Idx]]);
          p.newBase2.position.set(0, 0.5 - dist, 0); // attaches to top of bottom strand
          p.group.add(p.newBase2);
          
          const newBb2 = new THREE.Mesh(new THREE.SphereGeometry(0.2), backboneMat);
          newBb2.position.set(0, 1 - dist, 0);
          p.group.add(newBb2);
        }
      }
    });

    // Free nucleotides swimming
    fNodes.forEach(f => {
      f.mesh.position.x += f.vx;
      f.mesh.position.y += f.vy;
      f.mesh.rotation.x += 0.05;
      f.mesh.rotation.z += 0.05;
      
      if (Math.abs(f.mesh.position.x) > 5) f.vx *= -1;
      if (Math.abs(f.mesh.position.y) > 4) f.vy *= -1;
    });

  };

  group.userData.quiz = [
    { question: "What is the job of DNA Helicase?", options: ["To copy the DNA", "To unzip the double helix by breaking the hydrogen bonds between base pairs", "To glue the Okazaki fragments together"], answer: 1 },
    { question: "Why does the 'lagging strand' have to be copied in short chunks (Okazaki fragments)?", options: ["Because DNA Polymerase gets tired", "Because it is shorter than the leading strand", "Because DNA Polymerase can only build in one direction (5' to 3'), so it has to work backwards as the fork opens"], answer: 2 }
  ];

  return group;
}
