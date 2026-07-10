import * as THREE from 'three';
export function createHydrogenSigmaBond() {
  const group = new THREE.Group();
  
  const geo = new THREE.SphereGeometry(1.5, 32, 32);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transparent: true, opacity: 0.4, side: THREE.DoubleSide, roughness: 0.2 });
  
  // 1s orbital 1
  const orb1 = new THREE.Mesh(geo, mat);
  orb1.position.x = -0.7;
  group.add(orb1);

  // 1s orbital 2
  const orb2 = new THREE.Mesh(geo, mat);
  orb2.position.x = 0.7;
  group.add(orb2);
  
  // Nuclei
  const nucMat = new THREE.MeshBasicMaterial({color: 0xff0000});
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), nucMat); n1.position.x = -0.7;
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), nucMat); n2.position.x = 0.7;
  group.add(n1); group.add(n2);

  // Overlap zone
  const overlap = new THREE.Mesh(new THREE.CapsuleGeometry(1, 1, 16, 32), new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 }));
  overlap.rotation.z = Math.PI / 2;
  group.add(overlap);

  return {
    group: group,
    description: "Sigma (σ) Bond formation in H2. The direct head-on overlap of two 1s atomic orbitals forms a cylindrical molecular orbital.",
    parts: [
      { name: "1s Orbital A", material: "Atomic Orbital", function: "Left hydrogen atom's valence shell." },
      { name: "1s Orbital B", material: "Atomic Orbital", function: "Right hydrogen atom's valence shell." },
      { name: "Sigma Bond Overlap", material: "Molecular Orbital", function: "Region of highest electron density between nuclei." }
    ]
  };
}
