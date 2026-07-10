import * as THREE from 'three';
export function createHeliumSubshells() {
  const group = new THREE.Group();
  
  // n=1 only has 's' subshell
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(nuc);

  // 1s
  const s1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x0000ff, transparent: true, opacity: 0.4, wireframe: true}));
  group.add(s1);

  // Abstract locked padlock icon to represent closed shell
  const lock = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.2), new THREE.MeshStandardMaterial({color: 0xffff00}));
  const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 16, Math.PI), new THREE.MeshStandardMaterial({color: 0xcccccc}));
  shackle.position.y = 0.25; shackle.rotation.x = Math.PI; // closed
  lock.add(body, shackle);
  lock.position.set(2, 0, 0);
  group.add(lock);

  group.userData.animate = function(delta, time, speed) {
      s1.rotation.y = time * speed * 0.3;
      lock.rotation.y = Math.sin(time * speed) * 0.3;
  };

  return {
    group: group,
    description: "Subshells (l). The n=1 shell only contains a single subshell type: the 's' orbital (l=0). It does not have 'p' or 'd' subshells. Since Helium fills this 1s subshell completely, it is considered 'closed'.",
    parts: [
      { name: "1s Subshell", material: "Blue Sphere", function: "The only subshell available in the n=1 energy level." },
      { name: "Padlock Icon", material: "Symbolic", function: "Represents a completely filled (closed) subshell system." }
    ],
    quizQuestions: [
      { question: "Which subshell does Helium completely fill to become a Noble Gas?", options: ["2p", "3d", "1s", "2s"], correct: 2, explanation: "Helium only has two electrons, and they both fit perfectly into the lowest energy subshell available: the 1s subshell. Filling this subshell makes it highly stable." }
    ]
  };
}