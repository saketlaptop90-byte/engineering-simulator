import * as THREE from 'three';
export function createHydrogenPhotonAbsorption() {
  const group = new THREE.Group();
  
  // Nucleus
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Shells
  const shell1 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 1.5, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x444444}));
  const shell2 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 4.0, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x444444}));
  group.add(shell1); group.add(shell2);

  // Electron
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  group.add(electron);

  // Photon
  const photon = new THREE.Group();
  const wave = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({color: 0xff00ff}));
  photon.add(wave);
  group.add(photon);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 4;
      
      // Photon wave animation
      const pts = [];
      for(let i=0; i<3; i+=0.1) {
          pts.push(new THREE.Vector3(i, Math.sin(i*10 - time*speed*10)*0.3, 0));
      }
      wave.geometry.setFromPoints(pts);

      if (cycle < 2) {
          // Absorbing
          electron.position.set(1.5, 0, 0); // At n=1
          photon.visible = true;
          photon.position.set(-4 + cycle*2.5, 0, 0); // Moving towards atom
          
          if (cycle > 1.8) {
             photon.visible = false;
             electron.material.color.setHex(0xffffff); // Flash
          } else {
             electron.material.color.setHex(0x00ffff);
          }
      } else {
          // Excited to n=2
          photon.visible = false;
          electron.material.color.setHex(0x00ffff);
          electron.position.set(4, 0, 0);
      }
  };

  return {
    group: group,
    description: "Photon Absorption. An electron can only jump to a higher energy level if it absorbs a photon with the EXACT energy difference between the two shells. For Hydrogen n=1 to n=2, this requires exactly a 10.2 eV photon (Lyman-alpha, 121.6 nm).",
    parts: [
      { name: "Ground State (n=1)", material: "Inner Ring", function: "Energy = -13.6 eV." },
      { name: "Excited State (n=2)", material: "Outer Ring", function: "Energy = -3.4 eV." },
      { name: "Incoming Photon", material: "Magenta Wave", function: "Must have exactly 10.2 eV of energy to trigger the jump." }
    ],
    quizQuestions: [
      { question: "What happens if a Hydrogen atom is hit by a photon with 9.0 eV of energy? (The jump from n=1 to n=2 requires 10.2 eV)", options: ["The electron jumps partway to n=2", "The photon is absorbed and saved for later", "The photon passes straight through unabsorbed", "The atom explodes"], correct: 2, explanation: "Quantum mechanics dictates that energy levels are quantized (like rungs on a ladder). If a photon does not have the exact resonant energy required to reach the next 'rung', it cannot be absorbed and passes through." }
    ]
  };
}