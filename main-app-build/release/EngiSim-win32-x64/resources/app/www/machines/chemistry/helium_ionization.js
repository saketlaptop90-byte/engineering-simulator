import * as THREE from 'three';
export function createHeliumIonization() {
  const group = new THREE.Group();
  
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  group.add(nucleus);

  const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const e1 = new THREE.Mesh(eGeo, eMat); // stays
  const e2 = new THREE.Mesh(eGeo, eMat); // leaves
  group.add(e1); group.add(e2);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 5;
      
      // e1 orbits normally
      e1.position.set(Math.cos(time*speed*3)*2, 0, Math.sin(time*speed*3)*2);
      
      if(cycle < 1) {
          e2.position.set(-2, 0, 0);
      } else {
          // e2 is ejected
          e2.position.x = -2 - Math.pow(cycle - 1, 2) * 2;
      }
  };

  return {
    group: group,
    description: "First Ionization of Helium. A massive amount of energy (24.6 eV) is required to remove one electron, forming a He+ ion.",
    parts: [
      { name: "Bound Electron", material: "Particle", function: "Remains in the 1s orbital." },
      { name: "Ejected Electron", material: "Particle", function: "Leaves the atom, creating a +1 ion." },
      { name: "He+ Ion", material: "Hydrogen-like", function: "Behaves quantum mechanically very similarly to Hydrogen, but with Z=2." }
    ],
    quizQuestions: [
      { question: "Is it harder to remove the first or the second electron from Helium?", options: ["The first electron", "The second electron", "They require the exact same energy"], correct: 1, explanation: "Removing the second electron (He+ -> He2+) requires 54.4 eV, more than double the first, because the remaining electron feels the full unshielded +2 charge of the nucleus." }
    ]
  };
}
