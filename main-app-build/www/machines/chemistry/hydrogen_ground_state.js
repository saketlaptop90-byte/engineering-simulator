import * as THREE from 'three';
export function createHydrogenGroundState() {
  const group = new THREE.Group();
  
  // 1s orbital visualization
  const orbital = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, wireframe: true}));
  group.add(orbital);

  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Electron
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(electron);

  group.userData.animate = function(delta, time, speed) {
      orbital.rotation.y = time * speed * 0.2;
      orbital.rotation.x = time * speed * 0.1;
      // Electron orbiting inside the 1s sphere
      electron.position.set(Math.cos(time*speed*3)*1.2, Math.sin(time*speed*5)*0.5, Math.sin(time*speed*3)*1.2);
  };

  return {
    group: group,
    description: "The Ground State. The lowest possible energy configuration for an atom. For Hydrogen, the single electron resides calmly in the 1s orbital. It cannot decay to a lower energy state.",
    parts: [
      { name: "1s Orbital", material: "Cyan Sphere", function: "The n=1 energy level, holding the electron." },
      { name: "Absolute Minimum Energy", material: "-13.6 eV", function: "The energy required to completely remove this electron (ionization)." }
    ],
    quizQuestions: [
      { question: "What does it mean when a Hydrogen atom is in its 'ground state'?", options: ["It is buried in the earth", "Its electron is in the absolute lowest possible energy level (n=1)", "It has lost its electron", "It is vibrating rapidly"], correct: 1, explanation: "The ground state refers to the lowest energy configuration of a quantum system. For Hydrogen, this means the single electron is sitting in the 1s orbital." }
    ]
  };
}