import * as THREE from 'three';
export function createLithiumExcitedStates() {
  const group = new THREE.Group();
  
  // Nucleus
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Core shell
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.2}));
  group.add(core);

  // Normal 2s shell (faint)
  const val = new THREE.Mesh(new THREE.SphereGeometry(3.0, 32, 16), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.1}));
  group.add(val);

  // Excited 3s shell (pulsing bright)
  const excited = new THREE.Mesh(new THREE.SphereGeometry(5.0, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xffff00, transparent: true, opacity: 0.5, wireframe: true}));
  group.add(excited);
  
  // The excited electron
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e);

  // Jitter lines
  const jitterGroup = new THREE.Group();
  for(let i=0; i<5; i++) {
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(Math.random(), Math.random(), Math.random())]), new THREE.LineBasicMaterial({color: 0xff0000}));
      jitterGroup.add(line);
  }
  e.add(jitterGroup);

  group.userData.animate = function(delta, time, speed) {
      core.rotation.y = time * speed * 0.2;
      excited.rotation.x = time * speed * 0.5;
      excited.rotation.y = time * speed * 0.3;
      
      // Fast, unstable orbit
      e.position.set(Math.cos(time*speed*5)*5.0, Math.sin(time*speed*4)*5.0, Math.sin(time*speed*6)*5.0);
      
      // Pulse opacity to show instability
      excited.material.opacity = 0.2 + Math.sin(time*speed*10)*0.2;
      
      jitterGroup.rotation.z = time * speed * 10;
  };

  return {
    group: group,
    description: "Excited State. When Lithium's valence electron absorbs energy (from heat or electricity), it gets 'excited' and jumps to a higher, normally empty orbital (like the 3s or 2p). This state is highly unstable. The electron is moving faster, further from the nucleus, and desperately wants to fall back down to its comfortable ground state.",
    parts: [
      { name: "Yellow Wireframe", material: "n=3 Orbital", function: "A higher energy state holding the excited electron." },
      { name: "White Dot with Red Sparks", material: "Excited Electron", function: "Highly energetic and unstable." }
    ],
    quizQuestions: [
      { question: "Is an 'excited state' permanent?", options: ["Yes, once excited it never goes back", "No, it is highly unstable and the electron will quickly drop back to the ground state, releasing energy as a photon", "Yes, unless it is frozen", "No, the atom explodes"], correct: 1, explanation: "Excited states are temporary. Electrons always seek the lowest possible energy state. They will linger in the excited state for a fraction of a second before spontaneously decaying back down and spitting out a photon." }
    ]
  };
}