export function createProteinKinaseInhibitor(THREE) {
  const group = new THREE.Group();

  // 1. Kinase Enzyme Backbone (Simplified ribbon)
  const kinaseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5, -2, 0),
    new THREE.Vector3(-3, 4, 1),
    new THREE.Vector3(0, 5, -1),
    new THREE.Vector3(3, 2, 2),
    new THREE.Vector3(4, -3, 0),
    new THREE.Vector3(1, -5, -2),
    new THREE.Vector3(-2, -3, 0)
  ], true);
  const kinaseGeo = new THREE.TubeGeometry(kinaseCurve, 64, 0.5, 16, true);
  const kinaseMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.6 });
  const kinase = new THREE.Mesh(kinaseGeo, kinaseMat);
  kinase.userData = { id: 'kinase', name: 'Protein Kinase', description: 'An enzyme that transfers phosphate groups, acting as an "on" switch for cell division.' };
  group.add(kinase);

  // 2. ATP Binding Pocket
  const pocketGeo = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI);
  const pocketMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
  const pocket = new THREE.Mesh(pocketGeo, pocketMat);
  pocket.position.set(0, 0, 0);
  pocket.rotation.x = Math.PI / 2;
  pocket.userData = { id: 'atp_pocket', name: 'ATP Binding Pocket', description: 'The active site where ATP normally binds to donate a phosphate.' };
  group.add(pocket);

  // 3. Inhibitor Drug Molecule (e.g., Imatinib/Gleevec)
  const drugGroup = new THREE.Group();
  drugGroup.position.set(0, 0, 0);
  
  const cGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const cMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const nMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });

  const ring1 = new THREE.Mesh(cGeo, cMat); ring1.position.set(-0.5, 0, 0); drugGroup.add(ring1);
  const ring2 = new THREE.Mesh(cGeo, nMat); ring2.position.set(0.5, 0.5, 0); drugGroup.add(ring2);
  const ring3 = new THREE.Mesh(cGeo, cMat); ring3.position.set(1.5, -0.5, 0); drugGroup.add(ring3);
  
  // Linkers
  const linkGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
  const linkMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const l1 = new THREE.Mesh(linkGeo, linkMat); l1.position.set(0, 0.25, 0); l1.rotation.z = Math.PI / 4; drugGroup.add(l1);
  const l2 = new THREE.Mesh(linkGeo, linkMat); l2.position.set(1, 0, 0); l2.rotation.z = -Math.PI / 4; drugGroup.add(l2);

  drugGroup.userData = { id: 'inhibitor', name: 'Kinase Inhibitor Drug', description: 'Small molecule drug designed to perfectly fit the ATP pocket.' };
  group.add(drugGroup);

  // 4. Hydrogen Bonds (Drug to Protein)
  const hBondGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5);
  const hBondMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
  const hb1 = new THREE.Mesh(hBondGeo, hBondMat);
  hb1.position.set(-0.5, 1, 0);
  group.add(hb1);
  hb1.userData = { id: 'hbond1', name: 'Hydrogen Bond', description: 'Anchors the drug firmly to the hinge region of the kinase.' };

  // 5. Activation Loop (Inactive Conformation)
  const loopGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(2, -2, 1),
    new THREE.Vector3(3, 0, 2),
    new THREE.Vector3(1, 1, 3)
  ]), 16, 0.4, 8, false);
  const loopMat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  const loop = new THREE.Mesh(loopGeo, loopMat);
  loop.userData = { id: 'activation_loop', name: 'Activation Loop', description: 'Locked in a closed, inactive state by the drug binding.' };
  group.add(loop);

  // 6. Substrate Protein (Blocked)
  const subGeo = new THREE.SphereGeometry(2, 32, 32);
  const subMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, transparent: true, opacity: 0.5 });
  const substrate = new THREE.Mesh(subGeo, subMat);
  substrate.position.set(0, 4, 0);
  group.add(substrate);
  substrate.userData = { id: 'substrate', name: 'Target Substrate', description: 'Cannot be phosphorylated because the kinase is shut down.' };

  // 7. Rejected ATP Molecule
  const atpGeo = new THREE.TetrahedronGeometry(0.5);
  const atpMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
  const atp = new THREE.Mesh(atpGeo, atpMat);
  atp.position.set(-4, 0, 0);
  group.add(atp);
  atp.userData = { id: 'atp', name: 'ATP Molecule', description: 'Blocked from entering the active site.' };

  // 8. Gatekeeper Residue (Mutation site)
  const gateGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const gateMat = new THREE.MeshStandardMaterial({ color: 0x8800ff });
  const gate = new THREE.Mesh(gateGeo, gateMat);
  gate.position.set(-1, 0, -1);
  group.add(gate);
  gate.userData = { id: 'gatekeeper', name: 'Gatekeeper Amino Acid', description: 'Controls access to a hydrophobic pocket. Mutations here cause drug resistance.' };

  // 9. Hydrophobic Pocket
  const hpGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const hpMat = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5, wireframe: true });
  const hp = new THREE.Mesh(hpGeo, hpMat);
  hp.position.set(1, 0, -1);
  group.add(hp);
  hp.userData = { id: 'hydrophobic_pocket', name: 'Hydrophobic Pocket', description: 'Deep pocket exploited by Type II inhibitors for high selectivity.' };

  // 10. Phosphorylation Signal Blocked (Red X)
  const xMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const x1 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 0.2), xMat);
  const x2 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 0.2), xMat);
  x1.rotation.z = Math.PI / 4;
  x2.rotation.z = -Math.PI / 4;
  const xGroup = new THREE.Group();
  xGroup.add(x1); xGroup.add(x2);
  xGroup.position.set(0, 2.5, 0);
  group.add(xGroup);
  x1.userData = { id: 'signal_blocked', name: 'Oncogenic Signal Blocked', description: 'Halts the runaway cell division that causes cancer.' };

  group.userData.animate = function(delta) {
    group.rotation.y += 0.005;
    atp.position.x = -4 + Math.sin(Date.now() * 0.002) * 0.5; // ATP bouncing off
  };

  group.userData.quiz = [
    { question: "How does a kinase inhibitor treat cancer?", options: ["It kills all cells in the body", "It blocks the ATP binding site of mutant enzymes driving cell division", "It cuts DNA strands"], answer: 1 },
    { question: "What is competitive inhibition in this context?", options: ["The drug destroying the enzyme", "The drug competing with ATP to bind to the active site", "Two different drugs fighting each other"], answer: 1 }
  ];

  return group;
}
