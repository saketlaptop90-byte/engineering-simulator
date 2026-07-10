import * as THREE from 'three';
export function createHydrogenElectronConfiguration() {
  const group = new THREE.Group();
  
  // 3D Text representation of "1s¹"
  // Since we don't have font loaders, we'll build a visual abstract.
  
  // The '1' (Principal shell)
  const one = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.5), new THREE.MeshStandardMaterial({color: 0xffffff}));
  one.position.set(-3, 0, 0);
  
  // The 's' (Subshell shape)
  const sShape = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshStandardMaterial({color: 0x0000ff, wireframe: true}));
  sShape.position.set(0, 0, 0);
  
  // The '1' superscript (Electron count)
  const eCount = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshStandardMaterial({color: 0xff0000}));
  eCount.position.set(2, 1.5, 0);

  group.add(one); group.add(sShape); group.add(eCount);

  group.userData.animate = function(delta, time, speed) {
      sShape.rotation.y = time * speed * 0.5;
      eCount.position.y = 1.5 + Math.sin(time*speed*5)*0.2;
  };

  return {
    group: group,
    description: "Electron Configuration (1s¹). The standard chemical notation for Hydrogen. '1' represents the energy level (n=1), 's' represents the orbital shape (l=0), and the superscript '1' represents the number of electrons residing there.",
    parts: [
      { name: "The '1'", material: "White Block", function: "Principal Quantum Number n=1." },
      { name: "The 's'", material: "Blue Sphere", function: "Subshell type (spherical)." },
      { name: "The superscript '1'", material: "Red Orb", function: "Total number of electrons in this subshell." }
    ],
    quizQuestions: [
      { question: "What does the superscript '1' represent in Hydrogen's electron configuration '1s¹'?", options: ["The weight of the atom", "The number of electrons occupying the 1s subshell", "The number of protons", "The energy level"], correct: 1, explanation: "The superscript in electron configuration notation universally denotes the number of electrons present in that specific subshell. Hydrogen has exactly 1 electron." }
    ]
  };
}