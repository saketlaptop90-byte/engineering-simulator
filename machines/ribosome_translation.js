export function createRibosomeTranslation(THREE) {
  const group = new THREE.Group();

  // 1. Large Ribosomal Subunit (50S/60S)
  const largeGeo = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const largeMat = new THREE.MeshStandardMaterial({ color: 0x4466aa, roughness: 0.9 });
  const largeSub = new THREE.Mesh(largeGeo, largeMat);
  largeSub.position.y = 0;
  group.add(largeSub);
  largeSub.userData = { id: 'large_subunit', name: 'Large Ribosomal Subunit', description: 'Catalyzes peptide bond formation.' };

  // 2. Small Ribosomal Subunit (30S/40S)
  const smallGeo = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const smallMat = new THREE.MeshStandardMaterial({ color: 0x5588cc, roughness: 0.9 });
  const smallSub = new THREE.Mesh(smallGeo, smallMat);
  smallSub.position.y = 0;
  group.add(smallSub);
  smallSub.userData = { id: 'small_subunit', name: 'Small Ribosomal Subunit', description: 'Reads the mRNA sequence.' };

  // 3. mRNA Strand
  const mrnaGeo = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
  const mrnaMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const mrna = new THREE.Mesh(mrnaGeo, mrnaMat);
  mrna.rotation.z = Math.PI / 2;
  mrna.position.set(0, 0, 1.5);
  group.add(mrna);
  mrna.userData = { id: 'mrna', name: 'Messenger RNA (mRNA)', description: 'Carries the genetic code from DNA.' };

  // 4. Codons on mRNA
  const codonGeo = new THREE.BoxGeometry(0.5, 0.2, 0.2);
  const codonMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const codon = new THREE.Mesh(codonGeo, codonMat);
  codon.position.set(0, 0.2, 1.5);
  group.add(codon);
  codon.userData = { id: 'codon', name: 'Codon', description: 'A three-nucleotide sequence that codes for an amino acid.' };

  // 5. tRNA (Transfer RNA)
  const trnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.3, 1.5),
    new THREE.Vector3(0, 2, 1),
    new THREE.Vector3(-1, 3, 0),
    new THREE.Vector3(0, 4, 0)
  ]);
  const trnaGeo = new THREE.TubeGeometry(trnaCurve, 16, 0.2, 8, false);
  const trnaMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const trna = new THREE.Mesh(trnaGeo, trnaMat);
  group.add(trna);
  trna.userData = { id: 'trna', name: 'Transfer RNA (tRNA)', description: 'Brings specific amino acids to the ribosome.' };

  // 6. Anticodon
  const antiGeo = new THREE.BoxGeometry(0.5, 0.2, 0.2);
  const antiMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const anticodon = new THREE.Mesh(antiGeo, antiMat);
  anticodon.position.set(0, 0.5, 1.5);
  group.add(anticodon);
  anticodon.userData = { id: 'anticodon', name: 'Anticodon', description: 'Pairs exactly with the mRNA codon.' };

  // 7. Growing Polypeptide Chain (Protein)
  const chainGroup = new THREE.Group();
  const aaGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const aaMats = [
    new THREE.MeshStandardMaterial({ color: 0xff00ff }),
    new THREE.MeshStandardMaterial({ color: 0x00ffff }),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  ];
  for(let i=0; i<6; i++) {
    const aa = new THREE.Mesh(aaGeo, aaMats[i%3]);
    aa.position.set(0, 4 + i*0.8, (i*0.2));
    chainGroup.add(aa);
  }
  group.add(chainGroup);
  chainGroup.children[0].userData = { id: 'polypeptide', name: 'Polypeptide Chain', description: 'The newly synthesized protein molecule.' };

  // 8. A-Site (Aminoacyl)
  const aSiteGeo = new THREE.BoxGeometry(1.5, 3, 1.5);
  const aSiteMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });
  const aSite = new THREE.Mesh(aSiteGeo, aSiteMat);
  aSite.position.set(2, 1.5, 1);
  group.add(aSite);
  aSite.userData = { id: 'a_site', name: 'A-Site', description: 'Where new tRNA enters.' };

  // 9. P-Site (Peptidyl)
  const pSiteGeo = new THREE.BoxGeometry(1.5, 3, 1.5);
  const pSiteMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.2 });
  const pSite = new THREE.Mesh(pSiteGeo, pSiteMat);
  pSite.position.set(0, 1.5, 1);
  group.add(pSite);
  pSite.userData = { id: 'p_site', name: 'P-Site', description: 'Holds the tRNA with the growing chain.' };

  // 10. E-Site (Exit)
  const eSiteGeo = new THREE.BoxGeometry(1.5, 3, 1.5);
  const eSiteMat = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.2 });
  const eSite = new THREE.Mesh(eSiteGeo, eSiteMat);
  eSite.position.set(-2, 1.5, 1);
  group.add(eSite);
  eSite.userData = { id: 'e_site', name: 'E-Site', description: 'Empty tRNA exits the ribosome from here.' };

  group.userData.animate = function(delta) {
    // Simulate translation ratcheting
    const t = Date.now() * 0.001;
    if (Math.sin(t*2) > 0.8) {
      mrna.position.x = - (t % 2);
    }
  };

  group.userData.quiz = [
    { question: "What is translation in biology?", options: ["Converting DNA to RNA", "Converting mRNA into a Protein", "Cell division"], answer: 1 },
    { question: "What connects to the mRNA codon?", options: ["The tRNA Anticodon", "The DNA promoter", "The large subunit"], answer: 0 }
  ];

  return group;
}
