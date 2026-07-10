import * as THREE from 'three';
export function createHeliumSecondIonization() {
  const group = new THREE.Group();
  
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  group.add(nucleus);

  const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const e = new THREE.Mesh(eGeo, eMat);
  group.add(e);

  // Force vector holding it in
  const pull = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1.8, 0, 0), 1.5, 0xff00ff);
  group.add(pull);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 5;
      if(cycle < 2) {
          e.position.set(Math.cos(time*speed*4)*1.5, 0, Math.sin(time*speed*4)*1.5);
          pull.visible = true;
          pull.position.copy(e.position);
          pull.setDirection(e.position.clone().negate().normalize());
      } else {
          pull.visible = false;
          e.position.x = 1.5 + Math.pow(cycle - 2, 2) * 3;
          e.position.z = 0;
      }
  };

  return {
    group: group,
    description: "Second Ionization of Helium. Removing the final electron (He+ -> He2+) requires an immense 54.4 eV of energy, because the single electron is completely unshielded and feels the full +2 nuclear charge.",
    parts: [
      { name: "Unshielded Electron", material: "Particle", function: "Experiences the full electrostatic attraction of Z=2." },
      { name: "Nucleus (+2)", material: "Protons", function: "Holds the remaining electron with double the force of a Hydrogen nucleus." }
    ],
    quizQuestions: [
      { question: "Why is the second ionization energy of Helium (54.4 eV) so much higher than the first (24.6 eV)?", options: ["The second electron is closer to the nucleus", "There is no longer any electron-electron repulsion or shielding", "The nucleus gains a proton", "The atom shrinks to zero size"], correct: 1, explanation: "Once the first electron is removed, the remaining electron experiences the full, unshielded +2 charge of the nucleus, and without electron-electron repulsion, it is held much more tightly." }
    ]
  };
}
