import * as THREE from 'three';
export function createHeliumValenceElectrons() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Valence Shell (n=1)
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.3}));
  group.add(shell);

  // Valence Electrons
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  
  // Highlight arrows for valence
  const a1 = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,2,0), 0.5, 0xffff00);
  const a2 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,-2,0), 0.5, 0xffff00);
  e1.add(a1); e2.add(a2);
  
  group.add(e1, e2);

  group.userData.animate = function(delta, time, speed) {
      shell.rotation.y = time * speed * 0.2;
      e1.position.set(Math.cos(time*speed*2)*1.5, Math.sin(time*speed*3)*1.5, Math.sin(time*speed*2)*1.5);
      e2.position.set(Math.cos(time*speed*2 + Math.PI)*1.5, Math.sin(time*speed*3 + Math.PI)*1.5, Math.sin(time*speed*2 + Math.PI)*1.5);
  };

  return {
    group: group,
    description: "Valence Electrons. Valence electrons are the outermost electrons in an atom, responsible for all chemical bonding. Helium has exactly 2 valence electrons. Because the n=1 shell can only hold a maximum of 2 electrons, its valence shell is perfectly full.",
    parts: [
      { name: "n=1 Shell", material: "Cyan Wireframe", function: "The outermost (and only) electron shell in Helium." },
      { name: "Valence Electrons", material: "White Dots", function: "The two electrons residing in the outermost shell." }
    ],
    quizQuestions: [
      { question: "How many valence electrons does Helium have, and why is this significant?", options: ["8, making it an octet", "2, which completely fills its outermost shell, making it chemically inert", "1, making it highly reactive", "0, it has no electrons"], correct: 1, explanation: "Helium has 2 valence electrons. While most noble gases require 8 valence electrons to be stable (an octet), the very first electron shell (n=1) is full at just 2 electrons (a 'duet'), giving Helium perfect stability." }
    ]
  };
}