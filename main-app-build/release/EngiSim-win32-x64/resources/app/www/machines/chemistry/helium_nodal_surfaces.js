import * as THREE from 'three';
export function createHeliumNodalSurfaces() {
  const group = new THREE.Group();
  
  // Visualizing an excited Helium atom (1s1 2s1 state)
  // Showing the node of the 2s orbital
  
  const inner1s = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.6}));
  
  // Nodal surface (Zero probability)
  const node = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.5, side: THREE.DoubleSide}));
  
  // Outer lobe of 2s
  const outer2s = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, side: THREE.DoubleSide}));
  
  group.add(inner1s, node, outer2s);

  group.userData.animate = function(delta, time, speed) {
      // Breathing effect to show wave nature
      const scale = 1 + Math.sin(time*speed*2)*0.03;
      group.scale.set(scale, scale, scale);
  };

  return {
    group: group,
    description: "Nodal Surfaces (Excited 2s state). In its ground state, Helium's 1s orbital has ZERO radial nodes. However, if an electron is excited into the 2s orbital, it develops a spherical nodal surface—a dead zone where the electron cannot exist.",
    parts: [
      { name: "Inner & Outer Shells", material: "Cyan/Blue", function: "Regions where the excited electron's probability is > 0." },
      { name: "Dark Spherical Band", material: "Nodal Surface", function: "A region where the wavefunction perfectly cancels out, resulting in zero probability." }
    ],
    quizQuestions: [
      { question: "How many radial nodes does a ground-state Helium atom (1s²) have?", options: ["1", "2", "0", "Infinite"], correct: 2, explanation: "The number of radial nodes is determined by the formula (n - l - 1). For a 1s orbital, n=1 and l=0, so (1 - 0 - 1) = 0 radial nodes." }
    ]
  };
}