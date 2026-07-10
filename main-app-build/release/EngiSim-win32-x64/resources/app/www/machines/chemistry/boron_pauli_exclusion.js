import * as THREE from 'three';
export function createBoronPauliExclusion() {
  const group = new THREE.Group();
  
  // Pauli Exclusion Principle - No two fermions can have the same quantum numbers
  
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({color: 0x444444, wireframe: true}));
  group.add(box);

  // Electron 1 (Up)
  const e1 = new THREE.Group();
  e1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff})));
  e1.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1, 0x00ffff, 0.4, 0.4));
  e1.position.set(-0.5, 0, 0);
  group.add(e1);

  // Electron 2 (Down)
  const e2 = new THREE.Group();
  e2.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff00ff})));
  e2.add(new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,0,0), 1, 0xff00ff, 0.4, 0.4));
  e2.position.set(0.5, 0, 0);
  group.add(e2);

  const errorGlow = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.1, 2.1), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0}));
  group.add(errorGlow);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.5;
      
      const cycle = (time * speed * 0.5) % 2;
      
      if (cycle < 1) {
          // Happy (Up/Down)
          e1.children[1].setDirection(new THREE.Vector3(0,1,0)); // Up
          e2.children[1].setDirection(new THREE.Vector3(0,-1,0)); // Down
          errorGlow.material.opacity = 0;
          box.material.color.setHex(0x444444);
      } else {
          // Illegal state (Up/Up)
          e1.children[1].setDirection(new THREE.Vector3(0,1,0)); // Up
          e2.children[1].setDirection(new THREE.Vector3(0,1,0)); // Up!
          
          // Flash red error!
          errorGlow.material.opacity = Math.sin(time*speed*10)*0.5;
          box.material.color.setHex(0xff0000);
          
          // E2 gets physically pushed out of the box!
          e2.position.x = 0.5 + Math.pow(cycle-1, 2) * 5;
      }
  };

  return {
    group: group,
    description: "The Pauli Exclusion Principle. When Boron fills its inner 1s and 2s orbitals, it puts TWO electrons in each box. How is this allowed without them tearing each other apart? Wolfgang Pauli discovered that two electrons CAN share the exact same space, BUT they must spin in opposite directions! One must be Spin-Up, and the other must be Spin-Down. If they try to spin the same way, the laws of the universe literally expel one of them from the space.",
    parts: [
      { name: "Cyan Sphere", material: "Spin-Up Electron", function: "Occupying the quantum state." },
      { name: "Magenta Sphere", material: "Spin-Down Electron", function: "Occupying the paired state." },
      { name: "Red Flashing", material: "Quantum Violation", function: "The universe physically forbidding two fermions from sharing the same state." }
    ],
    quizQuestions: [
      { question: "According to the Pauli Exclusion Principle, what is required for two electrons to share the exact same orbital box?", options: ["They must be painted different colors", "They must have opposite spins (one Up, one Down)", "They must be moving at the speed of light", "They cannot share a box ever"], correct: 1, explanation: "Fermions (particles of matter) cannot occupy the same quantum state. If their location is identical, their 'Spin' property must be opposite to satisfy the laws of physics." }
    ]
  };
}