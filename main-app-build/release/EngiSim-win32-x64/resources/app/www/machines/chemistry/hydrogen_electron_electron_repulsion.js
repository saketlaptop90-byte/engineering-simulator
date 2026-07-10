import * as THREE from 'three';
export function createHydrogenElectronElectronRepulsion() {
  const group = new THREE.Group();
  
  // Nucleus
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);
  
  // H- Hydride ion (2 electrons in 1s)
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  group.add(e1); group.add(e2);

  // Repulsion vectors
  const rep1 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xff0000);
  const rep2 = new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(0,0,0), 1, 0xff0000);
  group.add(rep1); group.add(rep2);

  group.userData.animate = function(delta, time, speed) {
      // Orbiting on opposite sides
      e1.position.set(Math.cos(time*speed)*2, 0, Math.sin(time*speed)*2);
      e2.position.set(Math.cos(time*speed + Math.PI)*2, 0, Math.sin(time*speed + Math.PI)*2);
      
      rep1.position.copy(e1.position);
      rep1.setDirection(new THREE.Vector3().subVectors(e1.position, e2.position).normalize());
      
      rep2.position.copy(e2.position);
      rep2.setDirection(new THREE.Vector3().subVectors(e2.position, e1.position).normalize());
  };

  return {
    group: group,
    description: "Electron-Electron Repulsion. In a neutral Hydrogen atom, this doesn't exist. But if Hydrogen gains an electron to become a Hydride ion (H-), the two electrons fiercely repel each other, causing the 1s orbital to swell massively in size.",
    parts: [
      { name: "Hydride Ion (H-)", material: "Anion", function: "Contains two electrons in the 1s orbital." },
      { name: "Red Arrows", material: "Force", function: "Visualizing the electrostatic repulsion between the two negatively charged electrons." }
    ],
    quizQuestions: [
      { question: "Why is the Hydride ion (H-) significantly larger than a neutral Hydrogen atom?", options: ["It gained a proton", "Electron-electron repulsion forces the two electrons to spread much further apart in the 1s orbital", "It absorbed heat", "The nucleus shrinks"], correct: 1, explanation: "When a second electron is added to the 1s orbital, the two negative charges strongly repel each other. Since the nucleus still only has +1 charge to pull them in, the orbital swells outward massively." }
    ]
  };
}