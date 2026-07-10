import * as THREE from 'three';
export function createHeliumMetallicBonding() {
  const group = new THREE.Group();
  
  // A grid of Helium atoms acting as perfect insulators
  const grid = new THREE.Group();
  for(let x=-1; x<=1; x++) {
      for(let y=-1; y<=1; y++) {
          const he = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.6}));
          he.position.set(x*1.5, y*1.5, 0);
          grid.add(he);
      }
  }
  group.add(grid);

  // A free electron trying to flow (Electricity)
  const eFlow = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(eFlow);
  
  // Lightning bolt symbol showing resistance
  const shock = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1, 4), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(shock);

  group.userData.animate = function(delta, time, speed) {
      grid.rotation.y = Math.sin(time*speed*0.5)*0.2;
      
      // Electron tries to flow left to right but gets blocked and bounces around
      const cycle = (time * speed * 2) % 6;
      if (cycle < 2) {
          eFlow.position.set(-4 + cycle*1.5, 0, 0);
          shock.visible = false;
      } else if (cycle < 4) {
          eFlow.position.set(-1, Math.sin(cycle*20)*0.2, 0); // Stuck vibrating
          shock.visible = true;
          shock.position.copy(eFlow.position);
          shock.rotation.z = Math.random() * Math.PI * 2;
      } else {
          eFlow.position.set(-1 - (cycle-4)*2, 0, 0); // Bounces back
          shock.visible = false;
      }
  };

  return {
    group: group,
    description: "Metallic Bonding & Insulation. Metals bond by pooling their loose valence electrons into a flowing 'sea', which conducts electricity. Helium holds its two valence electrons tighter than any other element. It will never form metallic bonds, making it a perfect electrical insulator.",
    parts: [
      { name: "Helium Grid", material: "Cyan Spheres", function: "Tightly holding onto their electrons." },
      { name: "Yellow Electron", material: "Attempted Current", function: "Electricity attempting to flow through." },
      { name: "Red Spark", material: "Resistance", function: "Helium blocks the flow of electrons perfectly." }
    ],
    quizQuestions: [
      { question: "Why is Helium a perfect electrical insulator rather than a conductor?", options: ["It has no electrons", "It holds its valence electrons extremely tightly and refuses to let them flow freely between atoms", "It absorbs electricity and destroys it", "It is a gas"], correct: 1, explanation: "Electrical conduction requires electrons to be loose and free to move from atom to atom (like in copper wire). Helium has the highest ionization energy of any element; its electrons are locked down tight." }
    ]
  };
}