export function createCrisprCas9Complex(THREE) {
  const group = new THREE.Group();

  // 1. Cas9 Protein (Main Lobes)
  const casGeo = new THREE.SphereGeometry(4, 32, 32);
  const casMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.1, roughness: 0.8, transparent: true, opacity: 0.9 });
  const cas9 = new THREE.Mesh(casGeo, casMat);
  cas9.scale.set(1, 0.8, 1.2);
  cas9.userData = { id: 'cas9', name: 'Cas9 Endonuclease', description: 'The molecular scissors that cut the DNA.' };
  group.add(cas9);

  // 2. REC Lobe (Recognition)
  const recGeo = new THREE.SphereGeometry(2.5, 32, 32);
  const recMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
  const recLobe = new THREE.Mesh(recGeo, recMat);
  recLobe.position.set(0, 2, 2);
  cas9.add(recLobe);
  recLobe.userData = { id: 'rec_lobe', name: 'Recognition Lobe', description: 'Binds the guide RNA and the target DNA.' };

  // 3. NUC Lobe (Nuclease)
  const nucGeo = new THREE.SphereGeometry(2.5, 32, 32);
  const nucMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const nucLobe = new THREE.Mesh(nucGeo, nucMat);
  nucLobe.position.set(0, -2, 2);
  cas9.add(nucLobe);
  nucLobe.userData = { id: 'nuc_lobe', name: 'Nuclease Lobe', description: 'Contains the HNH and RuvC domains that actually cut the DNA strands.' };

  // 4. Guide RNA (sgRNA)
  const rnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 0, 4),
    new THREE.Vector3(0, 0, 3),
    new THREE.Vector3(2, 1, 2),
    new THREE.Vector3(2, -1, 1),
    new THREE.Vector3(-1, 0, 0)
  ]);
  const rnaGeo = new THREE.TubeGeometry(rnaCurve, 64, 0.3, 16, false);
  const rnaMat = new THREE.MeshStandardMaterial({ color: 0xff8800 });
  const rna = new THREE.Mesh(rnaGeo, rnaMat);
  group.add(rna);
  rna.userData = { id: 'sgRNA', name: 'Single Guide RNA (sgRNA)', description: 'Programmable sequence that guides Cas9 to the matching DNA target.' };

  // 5. Target DNA Strand
  const targetCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6, 0.5, 3),
    new THREE.Vector3(-3, 0.5, 3),
    new THREE.Vector3(0, 0.5, 3),
    new THREE.Vector3(3, 0.5, 3),
    new THREE.Vector3(6, 0.5, 3)
  ]);
  const dna1Geo = new THREE.TubeGeometry(targetCurve, 64, 0.2, 8, false);
  const dna1Mat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
  const targetDna = new THREE.Mesh(dna1Geo, dna1Mat);
  group.add(targetDna);
  targetDna.userData = { id: 'target_dna', name: 'Target DNA Strand', description: 'Matches the guide RNA sequence.' };

  // 6. Non-Target DNA Strand
  const nonTargetCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6, -0.5, 3.5),
    new THREE.Vector3(-3, -1, 4),
    new THREE.Vector3(0, -2, 4), // Loops out of the active site
    new THREE.Vector3(3, -1, 4),
    new THREE.Vector3(6, -0.5, 3.5)
  ]);
  const dna2Geo = new THREE.TubeGeometry(nonTargetCurve, 64, 0.2, 8, false);
  const dna2Mat = new THREE.MeshStandardMaterial({ color: 0x00ffaa });
  const nonTargetDna = new THREE.Mesh(dna2Geo, dna2Mat);
  group.add(nonTargetDna);
  nonTargetDna.userData = { id: 'nontarget_dna', name: 'Non-Target DNA Strand', description: 'Displaced by the RNA, forming an R-loop.' };

  // 7. PAM Sequence (Protospacer Adjacent Motif)
  const pamGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
  const pamMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const pam = new THREE.Mesh(pamGeo, pamMat);
  pam.rotation.z = Math.PI / 2;
  pam.position.set(2.5, 0, 3.5);
  group.add(pam);
  pam.userData = { id: 'pam', name: 'PAM Sequence (NGG)', description: 'A short DNA sequence Cas9 must find before it can unzip the DNA.' };

  // 8. R-Loop
  const rloop = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity:0.3}));
  rloop.position.set(0, 0, 3);
  group.add(rloop);
  rloop.userData = { id: 'r_loop', name: 'R-Loop Structure', description: 'The bubble where RNA-DNA hybridization occurs.' };

  // 9. Cleavage Site (Scissors Cut)
  const cutMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cut1 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1, 8), cutMat);
  cut1.position.set(-2, 1.5, 3);
  cut1.rotation.x = Math.PI;
  group.add(cut1);
  cut1.userData = { id: 'cleavage', name: 'Cleavage Site', description: 'Where the HNH and RuvC domains create a Double Strand Break (DSB).' };

  // 10. RNA-DNA Base Pairing
  const pairGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
  const pairMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  for(let i=0; i<5; i++) {
    const pair = new THREE.Mesh(pairGeo, pairMat);
    pair.position.set(-2 + i*0.5, 0.25, 3);
    group.add(pair);
    if(i===0) pair.userData = { id: 'base_pairs', name: 'RNA-DNA Hybrid Base Pairs', description: 'Watson-Crick base pairing confirming the target match.' };
  }

  group.userData.animate = function(delta) {
    cut1.position.y = 1.5 + Math.sin(Date.now() * 0.005) * 0.2;
    group.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
  };

  group.userData.quiz = [
    { question: "What acts as the 'GPS' telling Cas9 where to cut?", options: ["The PAM sequence", "The Guide RNA (sgRNA)", "The RuvC domain"], answer: 1 },
    { question: "What is the purpose of the PAM sequence?", options: ["To prevent Cas9 from cutting its own bacterial genome", "To glue the DNA back together", "To make the Cas9 protein glow"], answer: 0 }
  ];

  return group;
}
