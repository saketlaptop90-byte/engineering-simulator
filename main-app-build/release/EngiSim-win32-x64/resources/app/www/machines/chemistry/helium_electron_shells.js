import * as THREE from 'three';
export function createHeliumElectronShells() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // n=1 (Filled)
  const shell1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 16), new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true, transparent: true, opacity: 0.6}));
  group.add(shell1);
  
  // n=2 (Empty)
  const shell2 = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.2}));
  group.add(shell2);

  // Two electrons filling the n=1 shell
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e1, e2);

  group.userData.animate = function(delta, time, speed) {
      shell1.rotation.y = time * speed * 0.2;
      shell2.rotation.y = -time * speed * 0.1;
      
      // Orbiting in n=1
      e1.position.set(Math.cos(time*speed*2)*1.2, Math.sin(time*speed*3)*1.2, Math.sin(time*speed*2)*1.2);
      e2.position.set(Math.cos(time*speed*2 + Math.PI)*1.2, Math.sin(time*speed*3 + Math.PI)*1.2, Math.sin(time*speed*2 + Math.PI)*1.2);
  };

  return {
    group: group,
    description: "Electron Shells. The first shell (n=1) can only hold a maximum of 2 electrons. Because Helium has exactly 2 electrons, its n=1 shell is perfectly completely full. The next shell (n=2) exists but is completely empty.",
    parts: [
      { name: "n=1 Shell (Inner)", material: "Blue Wireframe", function: "Completely full (2 electrons)." },
      { name: "n=2 Shell (Outer)", material: "Green Wireframe", function: "Empty potential shell." }
    ],
    quizQuestions: [
      { question: "Because Helium's outermost electron shell (n=1) is completely full, what chemical property does it possess?", options: ["It is highly reactive", "It is extremely flammable", "It is a noble gas and chemically inert (unreactive)", "It bonds easily with Oxygen"], correct: 2, explanation: "Atoms react to fill their outermost electron shells. Because Helium's n=1 shell is perfectly filled with 2 electrons, it has no desire to gain, lose, or share electrons, making it completely chemically inert." }
    ]
  };
}