export function createCRISPR(THREE) {
  const group = new THREE.Group();

  // 1. The Target DNA Strand
  const dnaGroup = new THREE.Group();
  dnaGroup.position.set(0, 0, 0);
  group.add(dnaGroup);

  const bbMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
  const aMat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  const tMat = new THREE.MeshStandardMaterial({ color: 0x44ff44 });
  const cMat = new THREE.MeshStandardMaterial({ color: 0xffff44 });
  const gMat = new THREE.MeshStandardMaterial({ color: 0xff88ff });
  const pamMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // PAM sequence highlighted

  const bases = [aMat, tMat, cMat, gMat];

  const numPairs = 25;
  const basePairs = [];

  for(let i=0; i<numPairs; i++) {
    const pairGroup = new THREE.Group();
    pairGroup.position.x = i * 0.4 - 5;
    
    // Top
    const bbTop = new THREE.Mesh(new THREE.SphereGeometry(0.2), bbMat);
    bbTop.position.y = 1;
    const bTop = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), bases[Math.floor(Math.random()*4)]);
    bTop.position.y = 0.5;
    
    // Bottom
    const bbBot = new THREE.Mesh(new THREE.SphereGeometry(0.2), bbMat);
    bbBot.position.y = -1;
    const bBot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), bases[Math.floor(Math.random()*4)]);
    bBot.position.y = -0.5;
    
    // PAM Sequence target around index 10-12
    if (i >= 10 && i <= 12) {
      bBot.material = pamMat;
      bbBot.material = pamMat;
    }

    pairGroup.add(bbTop, bTop, bbBot, bBot);
    dnaGroup.add(pairGroup);
    basePairs.push({ group: pairGroup, top: bTop, bot: bBot, bbTop: bbTop, bbBot: bbBot, x: i*0.4 - 5 });
  }

  dnaGroup.userData = { id: 'dna', name: 'Target DNA', description: 'The genome of the cell. Notice the white PAM sequence, which acts as a signpost telling Cas9 "Look here!"' };

  // 2. Cas9 Protein (The molecular scissors)
  const cas9Group = new THREE.Group();
  cas9Group.position.set(-6, 3, 0); // start top left
  group.add(cas9Group);

  const casMat = new THREE.MeshStandardMaterial({ color: 0x88ff88, transparent: true, opacity: 0.7 });
  // Big blob with a groove
  const casShape = new THREE.Mesh(new THREE.TorusGeometry(2, 1, 16, 32, Math.PI * 1.5), casMat);
  casShape.rotation.x = Math.PI/2;
  casShape.rotation.z = -Math.PI/4;
  cas9Group.add(casShape);
  cas9Group.userData = { id: 'cas9', name: 'Cas9 Enzyme', description: 'An enzyme originally from bacteria. It can cut both strands of DNA, creating a double-strand break.' };

  // 3. Guide RNA (gRNA)
  const grnaGroup = new THREE.Group();
  cas9Group.add(grnaGroup);
  
  /*const*/
  const gStrand = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-1.5, 0, 0), new THREE.Vector3(1.5, 0, 0)), 8, 0.2, 8, false), gMat);
  grnaGroup.add(gStrand);
  gStrand.userData = { id: 'grna', name: 'Guide RNA (gRNA)', description: 'A custom piece of RNA designed by scientists. It acts like a GPS, guiding Cas9 to the exact matching sequence in the DNA.' };

  let phase = 0; // 0: approach, 1: scan for PAM, 2: unzip & check gRNA, 3: CUT!
  let timer = 0;

  group.userData.animate = function(delta) {
    timer += delta;

    if (phase === 0) {
      // Approach the DNA
      cas9Group.position.lerp(new THREE.Vector3(-4, 0, 0), 0.05);
      
      if (cas9Group.position.distanceTo(new THREE.Vector3(-4, 0, 0)) < 0.1) {
        phase = 1;
        timer = 0;
      }
    } else if (phase === 1) {
      // Scan along DNA (move right)
      cas9Group.position.x += 0.05;
      
      // Stop at PAM sequence (x approx -1)
      if (cas9Group.position.x > -1.2) {
        cas9Group.position.x = -1.2;
        phase = 2;
        timer = 0;
      }
    } else if (phase === 2) {
      // Unzip and match gRNA
      // We unzip basepairs 6 to 10
      basePairs.forEach((bp, i) => {
        if (i >= 5 && i <= 9) {
          bp.top.position.y = 1.0;
          bp.bbTop.position.y = 1.5;
          bp.bot.position.y = -1.0;
          bp.bbBot.position.y = -1.5;
        }
      });
      
      // Flash Cas9 to show matching
      casMat.color.setHex(timer % 0.5 < 0.25 ? 0xffffff : 0x88ff88);

      if (timer > 3) {
        phase = 3;
        timer = 0;
        casMat.color.setHex(0x88ff88);
      }
    } else if (phase === 3) {
      // CUT! (Double strand break)
      
      // Flash red
      if (timer < 0.5) {
        casMat.color.setHex(0xff0000);
      } else {
        casMat.color.setHex(0x88ff88);
        cas9Group.position.y += 0.05; // leave
        
        // Break the DNA in half physically
        basePairs.forEach((bp, i) => {
          if (i <= 7) { // Left half
            bp.group.position.x -= 0.05;
          } else { // Right half
            bp.group.position.x += 0.05;
          }
        });
      }

      if (timer > 4) {
        // Reset
        phase = 0;
        timer = 0;
        cas9Group.position.set(-6, 3, 0);
        basePairs.forEach((bp, i) => {
          bp.group.position.x = i*0.4 - 5;
          bp.top.position.y = 0.5;
          bp.bbTop.position.y = 1.0;
          bp.bot.position.y = -0.5;
          bp.bbBot.position.y = -1.0;
        });
      }
    }
  };

  group.userData.quiz = [
    { question: "What is the function of the Guide RNA (gRNA) in the CRISPR-Cas9 system?", options: ["It provides the energy to cut the DNA", "It acts as a GPS to find the exact 20-letter sequence of DNA that Cas9 should cut", "It glues the DNA back together"], answer: 1 },
    { question: "What happens after Cas9 cuts the DNA?", options: ["The cell dies instantly", "The cell's natural repair mechanisms try to fix the break. Scientists can use this to disable a gene or insert a new one.", "The Cas9 enzyme becomes part of the DNA"], answer: 1 }
  ];

  return group;
}
