import * as THREE from 'three';
export function createHeliumBohrModel() {
  const group = new THREE.Group();
  
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  group.add(nucleus);

  const orbitCurve = new THREE.EllipseCurve(0, 0, 2.5, 2.5, 0, 2*Math.PI, false, 0);
  const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(64)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
  orbitLine.rotation.x = Math.PI / 2;
  group.add(orbitLine);

  const eMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x008888 });
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), eMat);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), eMat);
  group.add(e1, e2);

  group.userData.animate = function(delta, time, speed) {
      const angle1 = time * speed * 2;
      const angle2 = angle1 + Math.PI; 
      e1.position.set(Math.cos(angle1) * 2.5, 0, Math.sin(angle1) * 2.5);
      e2.position.set(Math.cos(angle2) * 2.5, 0, Math.sin(angle2) * 2.5);
  };

  return {
    group: group,
    description: "The Bohr Model of Helium showing the n=1 energy level completely filled with 2 electrons.",
    parts: [
      { name: "Nucleus", material: "Protons & Neutrons", function: "Z=2, exerts +2 charge on the electrons." },
      { name: "n=1 Orbit", material: "Energy Level", function: "The ground state orbit (K shell)." },
      { name: "Electrons", material: "Particles", function: "Two electrons occupy the lowest energy state, repelling each other but held by the nucleus." }
    ],
    quizQuestions: [
      { question: "In the Bohr model of Helium, which energy level do the two electrons occupy?", options: ["n=1", "n=2", "n=3", "One in n=1, one in n=2"], correct: 0, explanation: "Both electrons in ground-state Helium occupy the lowest energy level, n=1." },
      { question: "Why doesn't Helium form diatomic molecules (He2) like Hydrogen?", options: ["Its nucleus is too large", "Its n=1 shell is completely full, offering no energy advantage to bonding", "It has too many neutrons", "It repels other atoms magnetically"], correct: 1, explanation: "Helium's 1s shell is full with 2 electrons. Bonding would require placing electrons in a higher-energy antibonding orbital, which is energetically unfavorable." }
    ]
  };
}
