import * as THREE from 'three';
export function createHeliumDimer() {
  const group = new THREE.Group();
  
  const heMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, transmission: 0.8 });
  const a1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32,32), heMat);
  const a2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32,32), heMat);
  group.add(a1); group.add(a2);

  const nuc = new THREE.MeshBasicMaterial({color: 0xff0000});
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), nuc); a1.add(n1);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), nuc); a2.add(n2);

  // Extremely long, weak bond
  const bond = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.01, 0.01, 6)), new THREE.LineBasicMaterial({color: 0x00ff00}));
  bond.rotation.z = Math.PI/2;
  group.add(bond);

  group.userData.animate = function(delta, time, speed) {
      const dist = 6 + Math.sin(time * speed) * 0.5; // Vibrating heavily
      a1.position.x = -dist / 2;
      a2.position.x = dist / 2;
  };

  return {
    group: group,
    description: "Helium Dimer (He2). The largest and most weakly bound diatomic molecule known. Held together by extremely weak Van der Waals forces, it has an incredibly long bond length and dissociates at a fraction of a Kelvin.",
    parts: [
      { name: "Helium Atom A", material: "Noble Gas", function: "Full 1s shell." },
      { name: "Helium Atom B", material: "Noble Gas", function: "Full 1s shell." },
      { name: "Van der Waals Bond", material: "Force", function: "Bond dissociation energy is roughly a billion times weaker than a covalent bond." }
    ],
    quizQuestions: [
      { question: "Why is the Helium Dimer (He2) bond considered the weakest known chemical bond?", options: ["It is a metallic bond", "Both atoms have full 1s shells, so bonding requires promoting electrons to antibonding orbitals; they are held only by fleeting Van der Waals forces", "The nuclei repel each other too strongly", "It only exists in the Sun"], correct: 1, explanation: "Standard covalent bonding is energetically unfavorable for two He atoms. He2 only exists due to extremely weak quantum mechanical fluctuations (London dispersion forces) at near absolute zero." }
    ]
  };
}
