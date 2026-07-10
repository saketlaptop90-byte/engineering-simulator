import * as THREE from 'three';
export function createHeliumBalloonBuoyancy() {
  const group = new THREE.Group();
  
  // Balloon
  const balloonGeo = new THREE.SphereGeometry(2, 32, 32);
  balloonGeo.translate(0, 1, 0); // shift pivot
  const balloonMat = new THREE.MeshPhysicalMaterial({ color: 0xff0000, roughness: 0.2, clearcoat: 0.5 });
  const balloon = new THREE.Mesh(balloonGeo, balloonMat);
  group.add(balloon);

  // String
  const string = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3), new THREE.MeshBasicMaterial({color: 0xffffff}));
  string.position.y = -1.5;
  balloon.add(string);

  // Gases inside and outside
  const densityGroup = new THREE.Group();
  // Outside Air (N2/O2) - heavy, dense
  for(let i=0; i<30; i++) {
      const a = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8,8), new THREE.MeshBasicMaterial({color: 0x888888}));
      a.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8);
      densityGroup.add(a);
  }
  // Inside Helium - light, sparse
  for(let i=0; i<10; i++) {
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8,8), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      h.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2 + 1, (Math.random()-0.5)*2);
      balloon.add(h);
  }
  group.add(densityGroup);

  group.userData.animate = function(delta, time, speed) {
      balloon.position.y = Math.sin(time * speed) * 0.5;
      balloon.rotation.z = Math.sin(time * speed * 0.5) * 0.1;
  };

  return {
    group: group,
    description: "Helium Buoyancy. Helium gas is monatomic and very light (4 g/mol) compared to air (~29 g/mol). This density difference creates a buoyant force governed by Archimedes' principle.",
    parts: [
      { name: "Helium Gas (Inside)", material: "He atoms", function: "Low mass, high volume." },
      { name: "Air (Outside)", material: "N2/O2 molecules", function: "Heavier, displaces the lighter balloon upwards." }
    ],
    quizQuestions: [
      { question: "Why does a Helium balloon float in Earth's atmosphere?", options: ["Helium defies gravity", "Helium gas is less dense than the surrounding air (Nitrogen and Oxygen)", "The rubber of the balloon is lighter than air", "Helium is magnetic"], correct: 1, explanation: "Helium has a molar mass of ~4 g/mol, while air is roughly ~29 g/mol. Since it is much less dense than air, Archimedes' principle dictates that the buoyant force pushes it upwards." }
    ]
  };
}
