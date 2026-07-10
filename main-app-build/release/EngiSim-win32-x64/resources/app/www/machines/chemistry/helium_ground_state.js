import * as THREE from 'three';
export function createHeliumGroundState() {
  const group = new THREE.Group();
  
  // Dense perfect sphere 1s orbital
  const orbital = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, wireframe: true}));
  group.add(orbital);

  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Two Electrons (Spin Up / Spin Down)
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({color: 0xaaaaaa})); // slightly darker to distinguish
  group.add(e1, e2);

  group.userData.animate = function(delta, time, speed) {
      orbital.rotation.y = time * speed * 0.2;
      orbital.rotation.x = time * speed * 0.1;
      
      // Orbiting gracefully in opposite phases
      e1.position.set(Math.cos(time*speed*3)*1.0, Math.sin(time*speed*4)*1.0, Math.sin(time*speed*3)*1.0);
      e2.position.set(Math.cos(time*speed*3 + Math.PI)*1.0, Math.sin(time*speed*4 + Math.PI)*1.0, Math.sin(time*speed*3 + Math.PI)*1.0);
  };

  return {
    group: group,
    description: "The Ground State of Helium (Parahelium). The lowest energy, most stable configuration in the universe. Both electrons reside in the 1s orbital, with opposite spins, perfectly balancing each other. This is called 'Parahelium'.",
    parts: [
      { name: "1s Orbital", material: "Cyan Sphere", function: "The absolute lowest energy shell." },
      { name: "Opposite Spins", material: "White/Grey Dots", function: "Electrons moving in harmonious opposition to satisfy the Pauli Exclusion Principle." }
    ],
    quizQuestions: [
      { question: "What is the term for a ground-state Helium atom where the two electrons have opposite spins?", options: ["Orthohelium", "Parahelium", "Metahelium", "Hyperhelium"], correct: 1, explanation: "Helium with electrons of opposite spin (the ground state) is called Parahelium. If one electron is excited and flips its spin so they are parallel, it is called Orthohelium." }
    ]
  };
}