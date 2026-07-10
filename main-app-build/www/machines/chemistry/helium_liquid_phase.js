import * as THREE from 'three';
export function createHeliumLiquidPhase() {
  const group = new THREE.Group();
  
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xccffff, transparent: true, opacity: 0.6, transmission: 0.9, roughness: 0.05 });
  const count = 60;
  
  const molecules = [];
  for(let i=0; i<count; i++) {
      const a = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), mat);
      a.position.set((Math.random()-0.5)*5, (Math.random()-0.5)*3, (Math.random()-0.5)*5);
      a.userData = { vel: new THREE.Vector3((Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5) };
      molecules.push(a);
      group.add(a);
  }

  const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.5, 3.5, 5.5)), new THREE.LineBasicMaterial({color: 0x00ffff, transparent:true, opacity:0.3}));
  group.add(box);

  group.userData.animate = function(delta, time, speed) {
      molecules.forEach(m => {
          m.position.addScaledVector(m.userData.vel, delta * speed);
          if(Math.abs(m.position.x) > 2.5) m.userData.vel.x *= -1;
          if(Math.abs(m.position.y) > 1.5) m.userData.vel.y *= -1;
          if(Math.abs(m.position.z) > 2.5) m.userData.vel.z *= -1;
      });
  };

  return {
    group: group,
    description: "Liquid Helium. Helium condenses at 4.2 K (-268.9 °C), the lowest boiling point of any element, due to its extremely weak interatomic London dispersion forces.",
    parts: [
      { name: "Helium Atoms", material: "Liquid Phase", function: "Monoatomic liquid held together by very weak instantaneous dipoles." },
      { name: "Cryogenic Boundary", material: "Vacuum Flask", function: "Must be kept below 4.2 K to prevent immediate boiling." }
    ],
    quizQuestions: [
      { question: "Why does Helium have the lowest boiling point of all elements (4.2 K)?", options: ["It is the lightest element", "Its completely full 1s shell makes it highly unpolarizable, resulting in extremely weak London dispersion forces", "It repels gravity", "It undergoes continuous nuclear fusion"], correct: 1, explanation: "Because its 1s electrons are held so tightly to the nucleus, the electron cloud is very hard to distort (low polarizability), making the temporary dipoles (London dispersion forces) that hold the liquid together incredibly weak." }
    ]
  };
}
