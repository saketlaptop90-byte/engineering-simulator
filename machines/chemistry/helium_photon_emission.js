import * as THREE from 'three';
export function createHeliumPhotonEmission() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Shells
  const shell1 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 1.2, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x444444}));
  const shell2 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 3.5, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x444444}));
  group.add(shell1); group.add(shell2);

  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e1, e2);

  // Emitted photon
  const photon = new THREE.Group();
  const wave = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({color: 0xffff00})); // e.g. visible line 587.6 nm (yellow) from 3d to 2p
  photon.add(wave);
  group.add(photon);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 4;
      e1.position.set(-1.2, 0, 0); 
      
      const pts = [];
      for(let i=0; i<3; i+=0.1) {
          pts.push(new THREE.Vector3(i, Math.sin(i*10 - time*speed*10)*0.2, 0));
      }
      wave.geometry.setFromPoints(pts);

      if (cycle < 2) {
          // Waiting to drop
          e2.position.set(3.5, 0, 0); 
          photon.visible = false;
      } else {
          // Dropped
          e2.position.set(1.2, 0, 0);
          photon.visible = true;
          photon.position.set(1.5 + (cycle-2)*3, 0, 0); 
      }
  };

  return {
    group: group,
    description: "Photon Emission (Emission Spectrum). When an excited Helium electron drops back down to a lower energy state, it emits a photon. Helium has a very distinct emission spectrum. In fact, Helium was discovered by looking at the emission spectrum of the Sun before it was ever found on Earth!",
    parts: [
      { name: "Excited Electron", material: "White Dot", function: "Unstable, seeks a lower energy state." },
      { name: "Emitted Photon", material: "Yellow Wave", function: "Carries away the exact energy difference (e.g., a 587.6 nm yellow photon from a 3d to 2p drop)." }
    ],
    quizQuestions: [
      { question: "How was Helium first discovered?", options: ["By mining deep underground in Texas", "By analyzing the emission spectrum of the Sun during a solar eclipse in 1868", "By condensing air into a liquid", "It was created in a lab"], correct: 1, explanation: "The name 'Helium' comes from the Greek word 'Helios' (Sun). Astronomer Pierre Janssen observed a distinct yellow spectral line (587.49 nm) in the solar chromosphere that didn't match any known element on Earth." }
    ]
  };
}