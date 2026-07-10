import * as THREE from 'three';
export function createHydrogenExcitedStates() {
  const group = new THREE.Group();
  
  // Ground state (faded)
  const gState = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.1}));
  group.add(gState);

  // 2p excited state (dumbbell)
  const pMat = new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.3, wireframe: true});
  const pTop = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), pMat);
  pTop.position.y = 1.6; pTop.scale.set(1, 1.5, 1);
  const pBot = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), pMat);
  pBot.position.y = -1.6; pBot.scale.set(1, 1.5, 1);
  group.add(pTop); group.add(pBot);

  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);
  
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(electron);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.5;
      group.rotation.z = Math.sin(time*speed*0.2)*0.2;
      // Electron tracing the 2p lobes
      const t = time * speed * 2;
      const y = Math.sin(t) * 3;
      const x = Math.cos(t) * 1.5 * (Math.abs(y)/3);
      electron.position.set(x, y, 0);
  };

  return {
    group: group,
    description: "Excited States. If Hydrogen absorbs exactly the right amount of energy (like a 10.2 eV photon), the electron jumps from the 1s ground state up to an excited state, such as the 2p orbital shown here. It is unstable and will eventually drop back down.",
    parts: [
      { name: "1s Orbital (Inner)", material: "Faint Cyan", function: "The empty ground state." },
      { name: "2p Orbital (Outer)", material: "Magenta Lobes", function: "The temporarily occupied excited state." }
    ],
    quizQuestions: [
      { question: "What happens to a Hydrogen atom in an excited state over time?", options: ["It stays there forever", "It explodes", "It is unstable and will spontaneously emit a photon to return to the ground state", "It gains a proton"], correct: 2, explanation: "Excited states are energetically unstable. The electron will eventually 'fall' back down to the lowest available energy level, releasing the energy difference as a photon of light." }
    ]
  };
}