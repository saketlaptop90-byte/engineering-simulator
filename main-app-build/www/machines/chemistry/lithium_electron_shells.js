import * as THREE from 'three';
export function createLithiumElectronShells() {
  const group = new THREE.Group();
  
  // Principal Quantum Number (n) - Electron Shells (Remastered)
  
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000}));
  group.add(nucleus);
  
  // n=1 Shell (K shell)
  const n1 = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32, 0, Math.PI), // cut in half to see inside like Russian dolls
      new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, transmission: 0.9, side: THREE.DoubleSide})
  );
  group.add(n1);
  
  // n=2 Shell (L shell)
  const n2 = new THREE.Mesh(
      new THREE.SphereGeometry(5, 32, 32, 0, Math.PI),
      new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.1, transmission: 0.9, side: THREE.DoubleSide})
  );
  group.add(n2);
  
  // Electrons sitting on the boundaries
  const eMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0x888888});
  const e1_a = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); e1_a.position.set(0, 2, 0);
  const e1_b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); e1_b.position.set(0, -2, 0);
  n1.add(e1_a, e1_b);
  
  const e2_a = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); e2_a.position.set(5, 0, 0);
  n2.add(e2_a);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Rotate shells
      n1.rotation.z = time * speed * 0.5;
      n2.rotation.y = time * speed * 0.3;
      
      // Pulse to show energy expansion
      n1.scale.setScalar(1 + Math.sin(time*speed*2)*0.02);
      n2.scale.setScalar(1 + Math.sin(time*speed*2 - 1)*0.02);
  };

  return {
    group: group,
    description: "Principal Quantum Number (n) - Electron Shells (Remastered). The first quantum number, 'n', dictates the main energy level or 'Shell' of an electron. Think of them like Russian nesting dolls! The n=1 shell (cyan) is closest to the nucleus, has the lowest energy, and holds 2 electrons. The n=2 shell (magenta) is much larger, has higher energy, and holds Lithium's 1 valence electron. The higher the principal quantum number 'n', the further away the shell is, and the larger the atom becomes!",
    parts: [
      { name: "Cyan Half-Sphere", material: "n=1 Shell", function: "The lowest energy shell, containing 2 core electrons." },
      { name: "Magenta Half-Sphere", material: "n=2 Shell", function: "The higher energy shell, containing 1 valence electron." },
      { name: "White Dots", material: "Electrons", function: "Assigned to specific shells based on their quantum numbers." }
    ],
    quizQuestions: [
      { question: "What does the Principal Quantum Number (n) represent?", options: ["The spin of the electron", "The main energy level or 'shell' indicating distance from the nucleus.", "The magnetic field", "The number of protons"], correct: 1, explanation: "As 'n' increases (1, 2, 3...), the electron shells get physically larger and higher in energy!" }
    ]
  };
}