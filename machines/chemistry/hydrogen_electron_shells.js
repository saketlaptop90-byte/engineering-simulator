import * as THREE from 'three';
export function createHydrogenElectronShells() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // n=1, 2, 3, 4 shells (Principal Quantum Number 'n')
  const shells = [];
  const colors = [0x0000ff, 0x00ff00, 0xffff00, 0xff00ff];
  
  for(let n=1; n<=4; n++) {
      // Radius roughly scales with n^2 in Bohr model, but we compress it visually
      const radius = n * 1.2; 
      const mat = new THREE.MeshBasicMaterial({color: colors[n-1], wireframe: true, transparent: true, opacity: 0.3});
      const shell = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16), mat);
      shells.push(shell);
      group.add(shell);
  }

  // The lone electron jumping shells
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(electron);

  group.userData.animate = function(delta, time, speed) {
      shells.forEach((s, i) => {
          s.rotation.y = time * speed * (0.2 / (i+1));
          s.rotation.x = time * speed * (0.1 / (i+1));
      });
      
      // Electron jumping
      const currentN = Math.floor((time * speed * 0.5) % 4) + 1;
      const r = currentN * 1.2;
      electron.position.set(Math.cos(time*speed*2)*r, Math.sin(time*speed*2)*r*0.5, Math.sin(time*speed*2)*r);
      electron.material.color.setHex(colors[currentN-1]);
  };

  return {
    group: group,
    description: "Electron Shells (Principal Quantum Number, n). While Hydrogen only has 1 electron, it possesses an infinite number of empty 'shells' extending outward. By absorbing energy, the electron can jump into these higher n-shells.",
    parts: [
      { name: "n=1 Shell (K)", material: "Blue", function: "Ground state shell." },
      { name: "n=2 Shell (L)", material: "Green", function: "First excited state." },
      { name: "n=3, n=4 Shells", material: "Yellow, Purple", function: "Higher excited states leading to the Rydberg series." }
    ],
    quizQuestions: [
      { question: "Even though Hydrogen only has 1 electron, does it have an n=3 shell?", options: ["No, it only has an n=1 shell", "Yes, all atoms have infinite potential energy shells, they are just empty until an electron is excited into them", "Only if it is frozen", "No, it steals shells from other atoms"], correct: 1, explanation: "Quantum mechanics dictates the existence of an infinite series of energy levels (shells) for every atom. Hydrogen's higher shells exist as potential states, and the electron will jump into them if it absorbs a photon of the right energy." }
    ]
  };
}