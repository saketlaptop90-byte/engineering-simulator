import * as THREE from 'three';
export function createHydrogenAtomicRadius() {
  const group = new THREE.Group();
  
  // Bohr Radius (Theoretical peak probability)
  const bohr = new THREE.Mesh(new THREE.SphereGeometry(0.53, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true, transparent: true, opacity: 0.5}));
  group.add(bohr);

  // Van der Waals Radius (Actual physical boundary in space)
  const vdw = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, transmission: 0.9}));
  group.add(vdw);
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(nuc);

  // Radius lines
  const l1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0.53,0,0)]), new THREE.LineBasicMaterial({color: 0xff0000}));
  const l2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,1.2,0)]), new THREE.LineBasicMaterial({color: 0x00ffff}));
  group.add(l1); group.add(l2);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = time * speed * 0.1;
  };

  return {
    group: group,
    description: "Atomic Radius. Atoms don't have hard edges. The calculated Bohr Radius (where the electron is most likely to be) is 53 pm. However, its actual effective size when interacting with other atoms (Van der Waals radius) is roughly 120 pm.",
    parts: [
      { name: "Red Wireframe", material: "Bohr Radius (53 pm)", function: "The peak of the radial probability distribution." },
      { name: "Cyan Sphere", material: "Van der Waals Radius (120 pm)", function: "The 'hard sphere' boundary when non-bonded atoms collide." }
    ],
    quizQuestions: [
      { question: "Why is it difficult to define an exact 'Atomic Radius' for an atom?", options: ["Because atoms are always expanding", "Because the electron cloud does not have a hard boundary; probability extends to infinity", "Because the nucleus keeps changing size", "Because measuring it destroys the atom"], correct: 1, explanation: "Quantum mechanics shows that an atom's electron cloud lacks a sharp edge. Probability density decays exponentially but technically never hits zero, so atomic radius is usually defined by how close atoms get when they bond or collide." }
    ]
  };
}