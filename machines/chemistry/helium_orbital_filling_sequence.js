import * as THREE from 'three';
export function createHeliumOrbitalFillingSequence() {
  const group = new THREE.Group();
  
  // Orbital box diagram
  const createBox = (x, y, label) => {
      const g = new THREE.Group();
      const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 0.5)), new THREE.LineBasicMaterial({color: 0x888888}));
      g.add(box);
      g.position.set(x, y, 0);
      return g;
  };

  const box1s = createBox(-4, -2, "1s");
  const box2s = createBox(-2, 0, "2s");
  const box2p1 = createBox(1, 0, "2p");

  group.add(box1s); group.add(box2s); group.add(box2p1);

  // Helium's two electrons
  const electronPair = new THREE.Group();
  
  // Spin UP
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  e1.position.set(-0.5, 0, 0);
  const a1 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 0.8, 0xffffff);
  e1.add(a1);
  
  // Spin DOWN
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  e2.position.set(0.5, 0, 0);
  const a2 = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,0,0), 0.8, 0xffffff);
  e2.add(a2);

  electronPair.add(e1, e2);
  electronPair.position.set(-4, -2, 0); // Inside 1s box
  group.add(electronPair);

  group.userData.animate = function(delta, time, speed) {
      e1.position.y = Math.sin(time*speed*5)*0.1;
      e2.position.y = -Math.sin(time*speed*5)*0.1;
  };

  return {
    group: group,
    description: "Orbital Filling Sequence. Helium has two electrons. According to the Aufbau principle, they both fill the lowest energy 1s box. According to the Pauli Exclusion Principle, they must have opposite spins (one arrow up, one arrow down).",
    parts: [
      { name: "1s Box", material: "Lowest Box", function: "Filled to capacity." },
      { name: "Spin-Up Electron", material: "Cyan", function: "First electron (+1/2)." },
      { name: "Spin-Down Electron", material: "Magenta", function: "Second electron (-1/2)." }
    ],
    quizQuestions: [
      { question: "Why are the two arrows in Helium's 1s box pointing in opposite directions?", options: ["Because they repel each other magnetically", "To show that they have opposite quantum spins (+1/2 and -1/2), satisfying the Pauli Exclusion Principle", "Because one is a proton", "It's just an aesthetic choice"], correct: 1, explanation: "The Pauli Exclusion Principle dictates that no two electrons can have identical quantum states. By giving them opposite spins, they can both coexist inside the same 1s orbital without violating this rule." }
    ]
  };
}