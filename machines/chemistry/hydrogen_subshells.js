import * as THREE from 'three';
export function createHydrogenSubshells() {
  const group = new THREE.Group();
  
  // n=2 subshells: 2s (spherical) and 2p (dumbbell)
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(nuc);

  // 2s
  const s2 = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, transparent: true, opacity: 0.2, wireframe: true}));
  group.add(s2);

  // 2p (z-axis)
  const p2Mat = new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.3});
  const p2Top = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), p2Mat);
  p2Top.position.z = 1.2; p2Top.scale.set(1, 1, 1.5);
  const p2Bot = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), p2Mat);
  p2Bot.position.z = -1.2; p2Bot.scale.set(1, 1, 1.5);
  group.add(p2Top); group.add(p2Bot);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.3;
      group.rotation.x = Math.sin(time * speed * 0.2) * 0.5;
  };

  return {
    group: group,
    description: "Subshells (Azimuthal Quantum Number, l). Within a primary shell (like n=2), there are different subshells representing different orbital shapes. For n=2, there is the spherical 2s (l=0) and the dumbbell-shaped 2p (l=1).",
    parts: [
      { name: "2s Subshell", material: "Red Sphere", function: "l = 0, spherically symmetric." },
      { name: "2p Subshell", material: "Green Dumbbells", function: "l = 1, has directional dependence." }
    ],
    quizQuestions: [
      { question: "For Hydrogen, what is the energy difference between the 2s and 2p subshells?", options: ["2p is much higher energy", "2s is much higher energy", "They are exactly 'degenerate' (equal in energy) in a pure Hydrogen atom", "2p does not exist in Hydrogen"], correct: 2, explanation: "In a one-electron system like Hydrogen, the energy level depends ONLY on the principal quantum number (n). Therefore, 2s and 2p are degenerate (have the exact same energy). In multi-electron atoms, electron-electron repulsion causes 2p to be higher energy than 2s." }
    ]
  };
}