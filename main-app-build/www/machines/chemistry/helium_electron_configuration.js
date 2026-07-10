import * as THREE from 'three';
export function createHeliumElectronConfiguration() {
  const group = new THREE.Group();
  
  // 3D Text abstract for "1s²"
  
  // The '1' (Principal shell)
  const one = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.5), new THREE.MeshStandardMaterial({color: 0xffffff}));
  one.position.set(-3, 0, 0);
  
  // The 's' (Subshell shape)
  const sShape = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshStandardMaterial({color: 0x0000ff, wireframe: true}));
  sShape.position.set(0, 0, 0);
  
  // The '2' superscript (Electron count)
  const twoGroup = new THREE.Group();
  const block1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.2), new THREE.MeshStandardMaterial({color: 0xff0000}));
  block1.position.set(0, 0.4, 0);
  const block2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.2), new THREE.MeshStandardMaterial({color: 0xff0000}));
  block2.position.set(0, 0, 0);
  const block3 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.2), new THREE.MeshStandardMaterial({color: 0xff0000}));
  block3.position.set(0, -0.4, 0);
  // vertical connecting
  const block4 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), new THREE.MeshStandardMaterial({color: 0xff0000}));
  block4.position.set(0.3, 0.2, 0);
  const block5 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), new THREE.MeshStandardMaterial({color: 0xff0000}));
  block5.position.set(-0.3, -0.2, 0);
  
  twoGroup.add(block1, block2, block3, block4, block5);
  twoGroup.position.set(2, 1.5, 0);
  group.add(twoGroup);

  group.add(one); group.add(sShape);

  group.userData.animate = function(delta, time, speed) {
      sShape.rotation.y = time * speed * 0.5;
      twoGroup.position.y = 1.5 + Math.sin(time*speed*5)*0.1;
  };

  return {
    group: group,
    description: "Electron Configuration (1s²). The standard chemical notation for Helium. The '1' denotes the first energy level. The 's' denotes the spherical orbital type. The superscript '2' means there are exactly two electrons occupying it.",
    parts: [
      { name: "The '1'", material: "White Block", function: "Principal Quantum Number n=1." },
      { name: "The 's'", material: "Blue Sphere", function: "Subshell type (spherical)." },
      { name: "The superscript '2'", material: "Red Symbol", function: "The total number of electrons present." }
    ],
    quizQuestions: [
      { question: "What does the '2' in Helium's electron configuration (1s²) signify?", options: ["It is the second element on the periodic table", "It has two protons", "There are exactly two electrons occupying the 1s subshell", "It has two shells"], correct: 2, explanation: "While Helium is the second element and has two protons, the superscript in electron configuration notation explicitly defines the number of electrons residing in that specific orbital." }
    ]
  };
}