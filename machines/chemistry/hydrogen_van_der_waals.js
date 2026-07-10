import * as THREE from 'three';
export function createHydrogenVanDerWaals() {
  const group = new THREE.Group();
  
  // Two H2 molecules
  const createH2 = (x, y) => {
      const h2 = new THREE.Group();
      const atomMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 });
      const a1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16,16), atomMat);
      a1.position.x = -0.6;
      const a2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16,16), atomMat);
      a2.position.x = 0.6;
      h2.add(a1); h2.add(a2);
      h2.position.set(x, y, 0);
      return h2;
  };

  const mol1 = createH2(-2, 0);
  const mol2 = createH2(2, 0);
  mol2.rotation.z = Math.PI / 4;
  group.add(mol1);
  group.add(mol2);

  // VDW force indication (dotted lines)
  const points = [new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(1.2, 0, 0)];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.2, gapSize: 0.2 });
  const line = new THREE.Line(lineGeo, lineMat);
  line.computeLineDistances();
  group.add(line);

  return {
    group: group,
    description: "Van der Waals interactions between non-polar Hydrogen (H2) molecules.",
    parts: [
      { name: "H2 Molecule 1", material: "Gas", function: "Non-polar molecule." },
      { name: "H2 Molecule 2", material: "Gas", function: "Non-polar molecule." },
      { name: "London Dispersion Force", material: "Interaction", function: "Weak temporary dipole attraction." }
    ]
  };
}
