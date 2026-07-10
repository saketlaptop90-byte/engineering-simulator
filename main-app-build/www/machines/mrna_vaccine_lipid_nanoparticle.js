export function createMRNAVaccineLNP(THREE) {
  const group = new THREE.Group();

  // 1. Solid Lipid Nanoparticle Exterior (Half shell to see inside)
  const shellGeo = new THREE.SphereGeometry(5, 32, 32, 0, Math.PI);
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  shell.userData = { id: 'lnp_shell', name: 'Lipid Nanoparticle Shell', description: 'A protective fat bubble that delivers the fragile mRNA into cells.' };
  group.add(shell);

  // 2. Ionizable Cationic Lipids
  const lipidGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
  const lipidMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  for(let i=0; i<50; i++) {
    const lipid = new THREE.Mesh(lipidGeo, lipidMat);
    const phi = Math.acos(-1 + (2 * i) / 50);
    const theta = Math.sqrt(50 * Math.PI) * phi;
    lipid.position.setFromSphericalCoords(4.8, phi, theta);
    lipid.lookAt(0,0,0);
    if(lipid.position.z > 0) {
      group.add(lipid);
    }
  }
  const sampleLipid = new THREE.Mesh(lipidGeo, lipidMat);
  sampleLipid.position.set(0, 4.8, 0);
  sampleLipid.userData = { id: 'ionizable_lipid', name: 'Ionizable Cationic Lipid', description: 'Positively charged lipids that bind to negatively charged mRNA.' };
  group.add(sampleLipid);

  // 3. PEGylated Lipids
  const pegGeo = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
  const pegMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
  const peg = new THREE.Mesh(pegGeo, pegMat);
  peg.position.set(0, 5.2, 0);
  peg.rotation.x = Math.PI/2;
  peg.userData = { id: 'peg_lipid', name: 'PEGylated Lipid', description: 'Prevents particles from clumping and evades the immune system.' };
  group.add(peg);

  // 4. Cholesterol Molecules
  const cholGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
  const cholMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const cholesterol = new THREE.Mesh(cholGeo, cholMat);
  cholesterol.position.set(2, 4.5, 0);
  cholesterol.lookAt(0,0,0);
  cholesterol.userData = { id: 'cholesterol', name: 'Cholesterol', description: 'Fills gaps between lipids to stabilize the nanoparticle structure.' };
  group.add(cholesterol);

  // 5. Helper Phospholipids (DSPC)
  const dspcGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const dspcMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const dspc = new THREE.Mesh(dspcGeo, dspcMat);
  dspc.position.set(-2, 4.5, 0);
  dspc.userData = { id: 'dspc', name: 'Helper Phospholipid (DSPC)', description: 'Helps form the stable bilayer structure.' };
  group.add(dspc);

  // 6. mRNA Strand (Backbone)
  const rnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(-1, 2, 0),
    new THREE.Vector3(1, -2, 0),
    new THREE.Vector3(3, 0, 0)
  ]);
  const rnaGeo = new THREE.TubeGeometry(rnaCurve, 20, 0.2, 8, false);
  const rnaMat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  const mrna = new THREE.Mesh(rnaGeo, rnaMat);
  mrna.userData = { id: 'mrna', name: 'mRNA Backbone', description: 'Single-stranded messenger RNA containing genetic instructions.' };
  group.add(mrna);

  // 7. Nucleotide Bases
  const baseGeo = new THREE.BoxGeometry(0.1, 0.5, 0.3);
  const baseMatA = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
  const baseMatU = new THREE.MeshStandardMaterial({ color: 0x00aaff });
  const baseMatC = new THREE.MeshStandardMaterial({ color: 0xaa00ff });
  const baseMatG = new THREE.MeshStandardMaterial({ color: 0x00ffaa });
  const mats = [baseMatA, baseMatU, baseMatC, baseMatG];
  
  for(let i=0; i<=1; i+=0.05) {
    const pt = rnaCurve.getPoint(i);
    const tan = rnaCurve.getTangent(i);
    const mesh = new THREE.Mesh(baseGeo, mats[Math.floor(Math.random()*4)]);
    mesh.position.copy(pt);
    mesh.position.y -= 0.3; // hang down
    group.add(mesh);
  }
  const sampleBase = new THREE.Mesh(baseGeo, baseMatA);
  sampleBase.position.copy(rnaCurve.getPoint(0.5));
  sampleBase.position.y -= 0.3;
  sampleBase.userData = { id: 'nucleotides', name: 'Nucleotide Bases (A, U, C, G)', description: 'The genetic code that instructs ribosomes to build the Spike Protein.' };
  group.add(sampleBase);

  // 8. 5' Cap
  const capGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const cap5 = new THREE.Mesh(capGeo, capMat);
  cap5.position.copy(rnaCurve.getPoint(0));
  cap5.userData = { id: 'cap5', name: '5\' Cap', description: 'Protects mRNA from degradation and helps ribosomes attach.' };
  group.add(cap5);

  // 9. Poly-A Tail
  const tailGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
  const polyA = new THREE.Mesh(tailGeo, tailMat);
  polyA.position.copy(rnaCurve.getPoint(1));
  polyA.position.x += 1;
  polyA.rotation.z = Math.PI / 2;
  polyA.userData = { id: 'polyA', name: 'Poly-A Tail', description: 'A long chain of Adenine nucleotides that dictates the mRNA lifespan in the cell.' };
  group.add(polyA);

  // 10. Internal Aqueous Core
  const coreGeo = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x002244, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
  const aqueousCore = new THREE.Mesh(coreGeo, coreMat);
  aqueousCore.userData = { id: 'aqueous_core', name: 'Aqueous Core', description: 'The water-filled center where the mRNA resides.' };
  group.add(aqueousCore);

  group.userData.animate = function(delta) {
    group.rotation.y += 0.005;
    mrna.position.y = Math.sin(Date.now() * 0.002) * 0.1;
  };

  group.userData.quiz = [
    { question: "What is the function of the Lipid Nanoparticle (LNP)?", options: ["To kill the virus directly", "To protect the mRNA and help it enter human cells", "To act as an adjuvant to stimulate inflammation"], answer: 1 },
    { question: "Why must mRNA vaccines be stored at ultra-cold temperatures?", options: ["Because lipids melt at room temperature", "Because mRNA molecules are highly unstable and degrade quickly", "To keep the liquid from expanding"], answer: 1 }
  ];

  return group;
}
