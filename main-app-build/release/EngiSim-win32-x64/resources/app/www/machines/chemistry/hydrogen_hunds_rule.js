import * as THREE from 'three';
export function createHydrogenHundsRule() {
  const group = new THREE.Group();
  
  // Demonstrating Hund's Rule hypothetically using Hydrogen's empty 2p orbitals
  
  const boxes = new THREE.Group();
  for(let i=0; i<3; i++) {
      const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 0.5)), new THREE.LineBasicMaterial({color: 0x888888}));
      box.position.set((i-1)*2.5, 0, 0);
      boxes.add(box);
  }
  group.add(boxes);

  // 3 excited electrons filling the 2p orbitals
  const electrons = new THREE.Group();
  for(let i=0; i<3; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      e.position.set((i-1)*2.5, 0, 0);
      const a = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 0.8, 0xffffff);
      e.add(a);
      electrons.add(e);
  }
  group.add(electrons);

  group.userData.animate = function(delta, time, speed) {
      electrons.children.forEach(e => {
          e.scale.setScalar(1 + Math.sin(time*speed*5)*0.1);
      });
  };

  return {
    group: group,
    description: "Hund's Rule of Maximum Multiplicity. While ground-state Hydrogen only has 1 electron, if multiple electrons were excited into the degenerate 2p orbitals, they would occupy empty orbitals singly, with parallel spins, before pairing up.",
    parts: [
      { name: "2p Orbitals", material: "3 Degenerate Boxes", function: "px, py, and pz orbitals all have the exact same energy." },
      { name: "Electrons", material: "Parallel Spins", function: "Filling singly with up-spins minimizes electron-electron repulsion." }
    ],
    quizQuestions: [
      { question: "What behavior does Hund's Rule predict for electrons entering a subshell with multiple degenerate orbitals (like the 2p subshell)?", options: ["They pair up immediately in the first orbital", "They fill them singly, with parallel spins, before any pairing occurs", "They avoid the p subshell entirely", "They rapidly change their spin"], correct: 1, explanation: "To minimize electrostatic repulsion between the negatively charged electrons, they will spread out into empty degenerate orbitals as much as possible, keeping parallel spins, before they are forced to pair up in the same orbital." }
    ]
  };
}