import * as THREE from 'three';
export function createHydrogenHydrogenBond() {
  const group = new THREE.Group();
  
  // Create H2O
  const createH2O = (x, y, rotZ) => {
      const h2o = new THREE.Group();
      const o = new THREE.Mesh(new THREE.SphereGeometry(1, 32,32), new THREE.MeshStandardMaterial({color: 0xff0000}));
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), new THREE.MeshStandardMaterial({color: 0xffffff}));
      h1.position.set(-0.8, -0.8, 0);
      const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), new THREE.MeshStandardMaterial({color: 0xffffff}));
      h2.position.set(0.8, -0.8, 0);
      
      // Dipoles
      const dipH1 = new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5), new THREE.MeshBasicMaterial({color:0x0000ff, transparent:true, opacity:0.5})); // delta +
      dipH1.position.set(-1.2, -1.2, 0);
      h2o.add(o); h2o.add(h1); h2o.add(h2); // h2o.add(dipH1);
      h2o.position.set(x, y, 0);
      h2o.rotation.z = rotZ;
      return h2o;
  };

  const mol1 = createH2O(0, 2, 0);
  const mol2 = createH2O(-2, -1.5, Math.PI / 4);
  const mol3 = createH2O(2, -1.5, -Math.PI / 4);
  
  group.add(mol1); group.add(mol2); group.add(mol3);

  // H-bonds
  const makeDash = (p1, p2) => {
      const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const mat = new THREE.LineDashedMaterial({ color: 0x00ff00, dashSize: 0.2, gapSize: 0.1 });
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();
      return line;
  };
  
  group.add(makeDash(new THREE.Vector3(-0.8, 1.2, 0), new THREE.Vector3(-2, -0.5, 0))); // H to O
  group.add(makeDash(new THREE.Vector3(0.8, 1.2, 0), new THREE.Vector3(2, -0.5, 0))); // H to O

  return {
    group: group,
    description: "Hydrogen Bonding in water. Hydrogen atoms (delta +) form strong dipole interactions with highly electronegative Oxygen atoms (delta -) on adjacent molecules.",
    parts: [
      { name: "Hydrogen (δ+)", material: "Atom", function: "Electron-deficient due to electronegativity difference." },
      { name: "Oxygen (δ-)", material: "Atom", function: "Pulls electron density, possessing lone pairs." },
      { name: "Hydrogen Bond", material: "Intermolecular Force", function: "Strongest type of dipole-dipole interaction (dotted green line)." }
    ]
  };
}
