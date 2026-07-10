import * as THREE from 'three';
export function createLithiumElectronTransitions() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // n=2 orbit
  const orbit2 = new THREE.Mesh(new THREE.TorusGeometry(2, 0.02, 16, 100), new THREE.MeshBasicMaterial({color: 0x444444}));
  orbit2.rotation.x = Math.PI/2;
  // n=3 orbit
  const orbit3 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.02, 16, 100), new THREE.MeshBasicMaterial({color: 0x666666}));
  orbit3.rotation.x = Math.PI/2;
  // n=4 orbit
  const orbit4 = new THREE.Mesh(new THREE.TorusGeometry(5, 0.02, 16, 100), new THREE.MeshBasicMaterial({color: 0x888888}));
  orbit4.rotation.x = Math.PI/2;
  
  group.add(orbit2, orbit3, orbit4);

  // The transitioning electron
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e);

  // Photon
  const photon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(photon);
  const wave = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0.2, 0.2, 0), new THREE.Vector3(0.4, -0.2, 0), new THREE.Vector3(0.6, 0, 0)]), new THREE.LineBasicMaterial({color: 0xff0000}));
  photon.add(wave);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = time * speed * 0.1;
      
      const cycle = (time * speed * 0.5) % 6;
      
      if (cycle < 1) {
          // Resting at n=2
          e.position.set(2, 0, 0);
          photon.position.set(-5 + cycle*6, 0, 0);
          photon.visible = true;
          photon.material.color.setHex(0xff0000); // Red photon (lower energy)
          wave.material.color.setHex(0xff0000);
      } else if (cycle < 2) {
          // Jump to n=3
          photon.visible = false;
          const t = cycle - 1;
          e.position.set(2 + t*1.5, Math.sin(t*Math.PI)*1, 0);
      } else if (cycle < 3) {
          // Resting at n=3
          e.position.set(3.5, 0, 0);
          photon.position.set(-5 + (cycle-2)*7.5, 0, 0);
          photon.visible = true;
          photon.material.color.setHex(0x0000ff); // Blue photon (higher energy)
          wave.material.color.setHex(0x0000ff);
      } else if (cycle < 4) {
          // Jump to n=4
          photon.visible = false;
          const t = cycle - 3;
          e.position.set(3.5 + t*1.5, Math.sin(t*Math.PI)*1, 0);
      } else if (cycle < 5) {
          // Resting at n=4
          e.position.set(5, 0, 0);
      } else {
          // Fall back to n=2, emit photon
          const t = cycle - 5;
          e.position.set(5 - t*3, -Math.sin(t*Math.PI)*1, 0);
          photon.position.set(2 + t*3, 0, 0);
          photon.visible = true;
          photon.material.color.setHex(0xff00ff); // Purple photon (sum of energy)
          wave.material.color.setHex(0xff00ff);
      }
  };

  return {
    group: group,
    description: "Electron Transitions. Electrons can transition between different energy levels by absorbing or emitting photons. The 2s electron in Lithium can absorb a low-energy red photon to jump to n=3, or a higher-energy blue photon to jump to n=4. When it eventually falls back down, it must release all that stored energy by emitting a new photon.",
    parts: [
      { name: "Concentric Rings", material: "n=2, n=3, n=4 Levels", function: "The allowed orbits for the valence electron." },
      { name: "Red / Blue Squiggles", material: "Photons", function: "Packets of light energy. Different colors carry different amounts of energy." },
      { name: "White Dot", material: "Electron", function: "Jumping between levels based on the energy it absorbs." }
    ],
    quizQuestions: [
      { question: "If an electron absorbs a blue photon to jump to n=4, what must it do to return to its original n=2 state?", options: ["It must absorb a red photon", "It must turn into a proton", "It must emit a photon carrying exactly the same amount of energy it originally absorbed to make the jump", "It stays there forever"], correct: 2, explanation: "Conservation of energy! To move up, an electron eats a photon. To move back down, it must vomit out a photon with exactly the energy difference between the two states." }
    ]
  };
}