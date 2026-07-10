import * as THREE from 'three';
export function createHeliumSchrodingerModel() {
  const group = new THREE.Group();
  
  // Visualizing the wavefunction (psi) math surface in 3D for TWO electrons
  // Because it's a 3-body problem (1 nuc, 2 e-), the math is incredibly complex (no exact analytical solution).
  
  // Wavefunction ripple representing the combined probability cloud
  const geo = new THREE.PlaneGeometry(8, 8, 64, 64);
  const mat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.8});
  const field = new THREE.Mesh(geo, mat);
  field.rotation.x = -Math.PI / 2;
  group.add(field);

  // Nucleus at center (+2)
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Peak representing the highly compact 1s^2 state
  const peak = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3}));
  peak.position.y = 2;
  group.add(peak);

  group.userData.animate = function(delta, time, speed) {
      const pos = field.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const r = Math.sqrt(x*x + y*y);
          // Complex interference ripple representing two interacting waves
          const z = Math.exp(-r*0.6) * (Math.cos(r*4 - time*speed*5) + Math.sin(r*2 + time*speed*3)) * 1.5;
          pos.setZ(i, z);
      }
      field.geometry.attributes.position.needsUpdate = true;
  };

  return {
    group: group,
    description: "Schrödinger Wave Model for Helium. Helium is the first multi-electron atom, making it a 'Three-Body Problem' (2 electrons, 1 nucleus). Because the two electrons repel each other while simultaneously being attracted to the nucleus, the Schrödinger equation for Helium cannot be solved exactly! It requires approximation methods (like the Variational Principle).",
    parts: [
      { name: "Complex Wavefunction (Ψ)", material: "Math Field", function: "The combined quantum state of two interacting electrons." },
      { name: "Nucleus (+2)", material: "Protons", function: "Pulls the wave tightly inward." }
    ],
    quizQuestions: [
      { question: "Why is the Schrödinger equation for a neutral Helium atom impossible to solve exactly (analytically)?", options: ["Helium is too cold", "It is a 3-body system where the electron-electron repulsion term makes the math impossible to separate and solve perfectly", "Electrons don't exist in Helium", "The nucleus moves too fast"], correct: 1, explanation: "In Hydrogen (2 bodies: 1 proton, 1 electron), the equation is perfectly solvable. In Helium (3 bodies: 1 nucleus, 2 electrons), the repulsive force between the two electrons means their positions depend on each other, creating an unsolvable mathematical feedback loop." }
    ]
  };
}