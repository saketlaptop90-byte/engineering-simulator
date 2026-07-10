import * as THREE from 'three';
export function createHeliumPhotonAbsorption() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Shells
  const shell1 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 1.2, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x444444}));
  const shell2 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 3.5, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x444444}));
  group.add(shell1); group.add(shell2);

  // Electrons
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); // The one that jumps
  group.add(e1, e2);

  // Photon
  const photon = new THREE.Group();
  const wave = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({color: 0xff00ff}));
  photon.add(wave);
  group.add(photon);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 4;
      
      e1.position.set(-1.2, 0, 0); // Stays at n=1
      
      // Photon wave animation (high frequency)
      const pts = [];
      for(let i=0; i<3; i+=0.1) {
          pts.push(new THREE.Vector3(i, Math.sin(i*20 - time*speed*20)*0.2, 0));
      }
      wave.geometry.setFromPoints(pts);

      if (cycle < 2) {
          // Absorbing
          e2.position.set(1.2, 0, 0); // At n=1
          photon.visible = true;
          photon.position.set(-4 + cycle*2.5, 0, 0); 
          
          if (cycle > 1.8) {
             photon.visible = false;
             e2.material.color.setHex(0xffffff);
          } else {
             e2.material.color.setHex(0xaaaaaa);
          }
      } else {
          // Excited to n=2
          photon.visible = false;
          e2.material.color.setHex(0xffffff);
          e2.position.set(3.5, 0, 0);
      }
  };

  return {
    group: group,
    description: "Photon Absorption. Helium's electrons are locked down extremely tight. To excite an electron from the 1s shell to the 2s shell requires a massive 21.2 eV photon (extreme ultraviolet), which is more than double the energy required to excite Hydrogen! This is why Helium gas requires high voltage to glow.",
    parts: [
      { name: "Ground State (1s)", material: "Inner Ring", function: "Extremely stable." },
      { name: "Excited State (2s)", material: "Outer Ring", function: "The destination." },
      { name: "EUV Photon", material: "Magenta Wave", function: "Requires 21.2 eV (Extreme Ultraviolet) to trigger the jump." }
    ],
    quizQuestions: [
      { question: "Why does it require significantly more energy (a higher energy photon) to excite an electron in Helium compared to Hydrogen?", options: ["Because Helium has two electrons that must jump together", "Because the +2 nuclear charge of Helium holds the 1s electrons much more tightly, deepening the energy well", "Because Helium is a noble gas and deflects light", "Because it is heavier"], correct: 1, explanation: "The stronger the electrostatic pull from the nucleus, the harder it is to pull an electron away from it. Helium's +2 nucleus creates a much deeper 'energy well' than Hydrogen's +1 nucleus." }
    ]
  };
}