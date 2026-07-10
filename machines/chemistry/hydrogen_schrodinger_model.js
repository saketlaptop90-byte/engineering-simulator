import * as THREE from 'three';
export function createHydrogenSchrodingerModel() {
  const group = new THREE.Group();
  
  // Visualizing the wavefunction (psi) math surface in 3D
  // We'll create a rippling quantum field
  const geo = new THREE.PlaneGeometry(8, 8, 64, 64);
  const mat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.8});
  const field = new THREE.Mesh(geo, mat);
  field.rotation.x = -Math.PI / 2;
  group.add(field);

  // Nucleus at center
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Probability peak in center
  const peak = new THREE.Mesh(new THREE.ConeGeometry(1, 3, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3}));
  peak.position.y = 1.5;
  group.add(peak);

  group.userData.animate = function(delta, time, speed) {
      const pos = field.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const r = Math.sqrt(x*x + y*y);
          // Wavefunction ripple: e^(-r) * cos(r - time)
          const z = Math.exp(-r*0.5) * Math.cos(r*3 - time*speed*5) * 2;
          pos.setZ(i, z);
      }
      field.geometry.attributes.position.needsUpdate = true;
  };

  return {
    group: group,
    description: "Schrödinger Wave Model (1926). Erwin Schrödinger formulated a wave equation that accurately calculated the energy levels of electrons in atoms. Rather than particles in orbits, electrons exist as 3D standing waves of probability.",
    parts: [
      { name: "Wavefunction (Ψ)", material: "Math Field", function: "Complex mathematical function describing the quantum state." },
      { name: "Probability Peak", material: "Ψ²", function: "The highest probability of finding the electron is near the nucleus." }
    ],
    quizQuestions: [
      { question: "What does the Schrödinger wave equation describe?", options: ["The exact path of the electron", "The gravitational pull of the nucleus", "The quantum state and probability distribution (wavefunction) of the electron in space", "The color of the atom"], correct: 2, explanation: "Schrödinger's equation treats the electron as a wave rather than a particle. Solving it yields wavefunctions (orbitals) which, when squared, give the probability of finding the electron at any given point in space." }
    ]
  };
}