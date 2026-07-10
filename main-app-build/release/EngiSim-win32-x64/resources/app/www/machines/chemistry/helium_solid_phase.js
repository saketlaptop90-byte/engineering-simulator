import * as THREE from 'three';
export function createHeliumSolidPhase() {
  const group = new THREE.Group();
  
  // Hexagonal close packed (hcp) lattice
  const mat = new THREE.MeshStandardMaterial({ color: 0x88ccff });
  
  for(let y=0; y<3; y++) {
      for(let x=0; x<4; x++) {
          for(let z=0; z<4; z++) {
              const atom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), mat);
              let xPos = x * 0.7;
              let zPos = z * 0.6;
              if (y % 2 !== 0) {
                  xPos += 0.35;
                  zPos += 0.3;
              }
              atom.position.set(xPos - 1.2, y * 0.6 - 0.6, zPos - 1);
              group.add(atom);
          }
      }
  }

  // Pistons applying pressure
  const pMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), pMat); p1.position.y = 1.5;
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), pMat); p2.position.y = -1.5;
  group.add(p1); group.add(p2);

  group.userData.animate = function(delta, time, speed) {
      // Small vibration
      const vib = Math.sin(time * speed * 20) * 0.02;
      group.children.forEach(c => {
          if(c.geometry.type === 'SphereGeometry') c.position.y += vib * (Math.random()-0.5);
      });
  };

  return {
    group: group,
    description: "Solid Helium. Unlike other elements, Helium will not freeze at absolute zero under atmospheric pressure. It requires extreme pressure (at least 25 atmospheres) to force the atoms into a solid crystal lattice.",
    parts: [
      { name: "Helium Atoms", material: "HCP Crystal Lattice", function: "Highly compressed state." },
      { name: "High Pressure Pistons", material: "Force", function: "Symbolize the >25 atm of pressure required to overcome zero-point motion." }
    ],
    quizQuestions: [
      { question: "Why doesn't Helium freeze into a solid at absolute zero under normal atmospheric pressure?", options: ["It is too hot", "Quantum zero-point energy causes the atoms to vibrate enough to prevent a solid lattice from forming", "The electrons repel each other too strongly", "It evaporates instantly"], correct: 1, explanation: "Due to Heisenberg's Uncertainty Principle, helium atoms possess significant 'zero-point motion' even at absolute zero. Because the attractive forces are so weak, this motion prevents freezing unless immense pressure is applied." }
    ]
  };
}
