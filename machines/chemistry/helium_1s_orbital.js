import * as THREE from 'three';
export function createHelium1sOrbital() {
  const group = new THREE.Group();
  
  const axesHelper = new THREE.AxesHelper(2);
  group.add(axesHelper);

  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(nucleus);

  // Smaller than hydrogen 1s
  const orbitalGeo = new THREE.SphereGeometry(1.2, 64, 64);
  const orbitalMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, transmission: 0.5, roughness: 0.2, side: THREE.DoubleSide });
  const orbital = new THREE.Mesh(orbitalGeo, orbitalMat);
  group.add(orbital);

  return {
    group: group,
    description: "The completely filled 1s Orbital of Helium. The spherical shape implies zero orbital angular momentum (l=0).",
    parts: [
      { name: "1s² Orbital Boundary", material: "Surface", function: "Contains both electrons." },
      { name: "Spherical Symmetry", material: "Geometry", function: "Equal probability in all directions." }
    ],
    quizQuestions: [
      { question: "What is the maximum number of electrons the 1s orbital can hold?", options: ["1", "2", "6", "8"], correct: 1, explanation: "Any s-orbital (including 1s) can hold a maximum of 2 electrons, provided they have opposite spins." }
    ]
  };
}
