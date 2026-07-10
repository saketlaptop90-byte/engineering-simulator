import * as THREE from 'three';
export function createHydrogenCovalentBonding() {
  const group = new THREE.Group();
  
  // H2 Molecule
  const atom1Geo = new THREE.SphereGeometry(1, 32, 32);
  const atomMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, transmission: 0.5 });
  
  const atom1 = new THREE.Mesh(atom1Geo, atomMat);
  atom1.position.x = -0.7;
  group.add(atom1);

  const atom2 = new THREE.Mesh(atom1Geo, atomMat);
  atom2.position.x = 0.7;
  group.add(atom2);

  // Nuclei
  const nucleusMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), nucleusMat);
  n1.position.x = -0.7;
  group.add(n1);
  
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), nucleusMat);
  n2.position.x = 0.7;
  group.add(n2);

  // Electron cloud overlap (Bond)
  const bondGeo = new THREE.CapsuleGeometry(0.8, 1.4, 16, 32);
  const bondMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
  const bond = new THREE.Mesh(bondGeo, bondMat);
  bond.rotation.z = Math.PI / 2;
  group.add(bond);

  return {
    group: group,
    description: "Covalent Bonding in H2. Two hydrogen atoms share their electrons to form a stable molecule.",
    parts: [
      { name: "Hydrogen Atom 1", material: "Proton + Cloud", function: "Shares 1 electron." },
      { name: "Hydrogen Atom 2", material: "Proton + Cloud", function: "Shares 1 electron." },
      { name: "Covalent Bond Overlap", material: "Electron Cloud", function: "High electron density region holding the nuclei together." }
    ]
  };
}
