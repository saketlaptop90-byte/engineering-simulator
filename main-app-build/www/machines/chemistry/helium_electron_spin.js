import * as THREE from 'three';
export function createHeliumElectronSpin() {
  const group = new THREE.Group();
  
  const createElectron = (x, spinUp) => {
      const eGroup = new THREE.Group();
      const electron = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial({ color: 0x3333ff, metalness: 0.5 }));
      eGroup.add(electron);
      
      const dir = new THREE.Vector3(0, spinUp ? 1 : -1, 0);
      const origin = new THREE.Vector3(0, spinUp ? -1.5 : 1.5, 0);
      const arrowHelper = new THREE.ArrowHelper(dir, origin, 3, spinUp ? 0xff0000 : 0x00ff00, 0.5, 0.5);
      eGroup.add(arrowHelper);
      
      eGroup.position.x = x;
      return eGroup;
  };

  const e1 = createElectron(-1.5, true);
  const e2 = createElectron(1.5, false);
  group.add(e1); group.add(e2);

  group.userData.animate = function(delta, time, speed) {
      e1.children[0].rotation.y += delta * speed * 5;
      e2.children[0].rotation.y -= delta * speed * 5;
  };

  return {
    group: group,
    description: "Pauli Exclusion Principle in Helium. The two electrons in the 1s orbital must have opposite spins (spin up +1/2 and spin down -1/2).",
    parts: [
      { name: "Electron 1 (Spin Up)", material: "Fermion", function: "Quantum state: n=1, l=0, ml=0, ms=+1/2." },
      { name: "Electron 2 (Spin Down)", material: "Fermion", function: "Quantum state: n=1, l=0, ml=0, ms=-1/2." },
      { name: "Pauli Exclusion", material: "Principle", function: "No two fermions can occupy the exact same quantum state." }
    ],
    quizQuestions: [
      { question: "According to the Pauli Exclusion Principle, what must be true for two electrons occupying the same orbital?", options: ["They must have the same spin", "They must have opposite spins", "They must have different charges", "They must orbit at different speeds"], correct: 1, explanation: "Electrons in the same orbital have the same n, l, and ml quantum numbers. Therefore, their spin quantum number (ms) must be opposite (+1/2 and -1/2) to have unique quantum states." }
    ]
  };
}
