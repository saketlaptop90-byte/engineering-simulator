import * as THREE from 'three';
export function createHydrogenPauliExclusion() {
  const group = new THREE.Group();
  
  // Orbital box
  const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 3, 1)), new THREE.LineBasicMaterial({color: 0x888888}));
  group.add(box);
  
  // Electron 1 (Spin up)
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  e1.position.set(-0.8, 0, 0);
  const a1 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1, 0x00ff00);
  a1.position.copy(e1.position);
  
  // Electron 2 (Spin down)
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  e2.position.set(0.8, 0, 0);
  const a2 = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,0,0), 1, 0xff0000);
  a2.position.copy(e2.position);
  
  // Rejected Electron 3
  const e3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xaaaaaa, transparent: true, opacity: 0.3}));
  const a3 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1, 0xffffff);
  
  group.add(e1, a1, e2, a2, e3, a3);

  group.userData.animate = function(delta, time, speed) {
      e1.rotation.y = time * speed;
      e2.rotation.y = -time * speed;
      
      // Third electron tries to enter and gets bounced out
      const cycle = (time * speed) % 2;
      if (cycle < 1) {
          e3.position.set(0, 3 - cycle*3, 0);
      } else {
          e3.position.set(0, (cycle-1)*3, 0);
      }
      a3.position.copy(e3.position);
  };

  return {
    group: group,
    description: "Pauli Exclusion Principle. No two fermions (electrons) can have the exact same set of quantum numbers. Therefore, a single orbital (like the 1s orbital) can hold a maximum of TWO electrons, and they MUST have opposite spins (+1/2 and -1/2).",
    parts: [
      { name: "Electron 1 (Spin-Up)", material: "Cyan", function: "Quantum state: n=1, l=0, ml=0, ms=+1/2." },
      { name: "Electron 2 (Spin-Down)", material: "Magenta", function: "Quantum state: n=1, l=0, ml=0, ms=-1/2." },
      { name: "Rejected Electron", material: "Grey", function: "Cannot enter the 1s orbital because no unique spin states remain." }
    ],
    quizQuestions: [
      { question: "According to the Pauli Exclusion Principle, what is the maximum number of electrons that can occupy a single atomic orbital?", options: ["1", "2 (provided they have opposite spins)", "8", "18"], correct: 1, explanation: "An orbital represents a specific spatial state defined by n, l, and ml. Because electrons only have two possible spin states (ms = +1/2 or -1/2), only two electrons can fit in an orbital before they start violating the rule against having identical quantum states." }
    ]
  };
}