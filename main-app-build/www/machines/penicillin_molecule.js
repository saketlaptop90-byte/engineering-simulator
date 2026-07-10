export function createPenicillinMolecule(THREE) {
  const group = new THREE.Group();

  const atomGeos = {
    C: new THREE.SphereGeometry(0.4, 16, 16),
    O: new THREE.SphereGeometry(0.35, 16, 16),
    N: new THREE.SphereGeometry(0.35, 16, 16),
    S: new THREE.SphereGeometry(0.5, 16, 16),
    H: new THREE.SphereGeometry(0.2, 8, 8)
  };
  
  const atomMats = {
    C: new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.2 }),
    O: new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.2 }),
    N: new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.2 }),
    S: new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.2 }),
    H: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2 })
  };

  const addAtom = (type, x, y, z, id, name, desc) => {
    const mesh = new THREE.Mesh(atomGeos[type], atomMats[type]);
    mesh.position.set(x, y, z);
    mesh.userData = { id, name, description: desc };
    group.add(mesh);
    return mesh;
  };

  // 1. Beta-Lactam Ring
  const n1 = addAtom('N', 0, 0, 0, 'n1', 'Nitrogen (Beta-Lactam)', 'Crucial nitrogen in the reactive four-membered ring.');
  const c1 = addAtom('C', 1, 1, 0, 'c1', 'Carbon', 'Part of the beta-lactam ring.');
  const c2 = addAtom('C', 0, 2, 0, 'c2', 'Carbon', 'Part of the beta-lactam ring.');
  const c3 = addAtom('C', -1, 1, 0, 'c3', 'Carbonyl Carbon', 'Highly reactive carbon attacked by bacterial enzymes.');
  const o1 = addAtom('O', -2, 1, 0, 'o1', 'Carbonyl Oxygen', 'Forms the lactam amide bond.');

  // 2. Thiazolidine Ring
  const s1 = addAtom('S', 1, -1, 1, 's1', 'Sulfur', 'Part of the five-membered thiazolidine ring.');
  const c4 = addAtom('C', 2, 0, 1, 'c4', 'Carbon', 'Connects sulfur to the rest of the ring.');
  const c5 = addAtom('C', 2, 1, 0, 'c5', 'Carbon', 'Vertex shared by both rings.');

  // 3. Side Chain (R-Group)
  const n2 = addAtom('N', 0, 3, 0, 'n2', 'Amide Nitrogen', 'Connects the side chain.');
  const c6 = addAtom('C', -1, 4, 0, 'c6', 'Side Chain Carbon', 'Varies between different types of penicillin (e.g. Penicillin G vs V).');
  const benzyl = addAtom('C', -2, 5, 0, 'benzyl', 'Benzyl Group', 'Makes this Penicillin G, affecting its antibacterial spectrum.');

  // 4. Carboxyl Group
  const c7 = addAtom('C', 3, 0, 1, 'c7', 'Carbon', 'Carboxyl carbon.');
  const o2 = addAtom('O', 4, 0, 1, 'o2', 'Oxygen (Hydroxyl)', 'Part of the carboxylic acid group.');
  const o3 = addAtom('O', 3, -1, 1, 'o3', 'Oxygen (Double Bond)', 'Part of the carboxylic acid group.');

  // 5. Dimethyl Groups
  const c8 = addAtom('C', 2, -1, 2, 'c8', 'Methyl Carbon', 'One of two methyl groups on the thiazolidine ring.');
  const c9 = addAtom('C', 2, 0, 2.5, 'c9', 'Methyl Carbon', 'The second methyl group.');

  // Add bonds (cylinders) - simplifying for the model
  const bondMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const addBond = (a1, a2) => {
    const dist = a1.position.distanceTo(a2.position);
    const bondGeo = new THREE.CylinderGeometry(0.1, 0.1, dist, 8);
    const bond = new THREE.Mesh(bondGeo, bondMat);
    bond.position.copy(a1.position).lerp(a2.position, 0.5);
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a2.position.clone().sub(a1.position).normalize());
    group.add(bond);
    return bond;
  };

  // 6. Beta-Lactam Bonds
  const b1 = addBond(n1, c1);
  const b2 = addBond(c1, c2);
  const b3 = addBond(c2, c3);
  const b4 = addBond(c3, n1);
  b1.userData = { id: 'beta_lactam_bond', name: 'Beta-Lactam Ring Bonds', description: 'The strained 4-membered ring that kills bacteria by inhibiting cell wall synthesis.' };

  // 7. Thiazolidine Bonds
  const b5 = addBond(n1, s1);
  const b6 = addBond(s1, c4);
  const b7 = addBond(c4, c5);
  const b8 = addBond(c5, c1);
  b5.userData = { id: 'thiazolidine_bond', name: 'Thiazolidine Ring Bonds', description: 'The 5-membered sulfur-containing ring fused to the beta-lactam.' };

  // 8. Reactive Amide Bond
  const rBond = addBond(c3, o1);
  rBond.userData = { id: 'reactive_bond', name: 'Reactive Amide Bond', description: 'This bond is cleaved by bacterial transpeptidases, permanently disabling the enzyme.' };

  // 9. Side Chain Bonds
  addBond(c2, n2);
  addBond(n2, c6);
  addBond(c6, benzyl);

  // 10. Carboxyl and Methyl Bonds
  addBond(c4, c7);
  addBond(c7, o2);
  addBond(c7, o3);
  addBond(c4, c8);
  addBond(c4, c9);

  // Center the group
  group.position.y = -1;

  group.userData.animate = function(delta) {
    group.rotation.y += 0.01;
    group.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
  };

  group.userData.quiz = [
    { question: "Which part of the penicillin molecule is responsible for its antibacterial activity?", options: ["The Thiazolidine ring", "The Beta-Lactam ring", "The Benzyl side chain"], answer: 1 },
    { question: "How does penicillin kill bacteria?", options: ["By destroying their DNA", "By inhibiting protein synthesis in ribosomes", "By irreversibly binding to enzymes that build the bacterial cell wall"], answer: 2 }
  ];

  return group;
}
