import * as THREE from 'three';
export function createHydrogenOrbitalFillingSequence() {
  const group = new THREE.Group();
  
  // Orbital box diagrams
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
  const box2p2 = createBox(3, 0, "2p");
  const box2p3 = createBox(5, 0, "2p");

  group.add(box1s); group.add(box2s); group.add(box2p1); group.add(box2p2); group.add(box2p3);

  // Hydrogen's single electron
  const electron = new THREE.Group();
  const eMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 0.8, 0xffffff);
  electron.add(eMesh); electron.add(arrow);
  electron.position.set(-4, -2, 0);
  group.add(electron);

  group.userData.animate = function(delta, time, speed) {
      eMesh.scale.setScalar(1 + Math.sin(time*speed*5)*0.1);
  };

  return {
    group: group,
    description: "Orbital Filling Sequence. An orbital box diagram showing the ground state of Hydrogen. It has one electron, which naturally falls into the lowest available energy state (the 1s orbital box) with a 'spin-up' (+1/2) configuration.",
    parts: [
      { name: "1s Box", material: "Lowest Box", function: "The lowest energy state, occupied by Hydrogen's electron." },
      { name: "2s, 2p Boxes", material: "Higher Boxes", function: "Higher energy states, left completely empty in ground-state Hydrogen." }
    ],
    quizQuestions: [
      { question: "When drawing an orbital box diagram for ground-state Hydrogen, where do you place the single arrow?", options: ["In the 2p box", "In the 1s box, pointing up", "In the 1s box, pointing sideways", "Outside all the boxes"], correct: 1, explanation: "Hydrogen's single electron occupies the lowest energy state available (the 1s orbital). By convention, the first electron in an orbital is drawn as an 'up' arrow representing +1/2 spin." }
    ]
  };
}