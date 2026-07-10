import * as THREE from 'three';
export function createHeliumCatalyticCarrier() {
  const group = new THREE.Group();
  
  // Chromatography column tube
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 32, 1, true), new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.DoubleSide}));
  tube.rotation.z = Math.PI/2;
  group.add(tube);

  // Helium Carrier Gas (Cyan dots)
  const carrierGroup = new THREE.Group();
  for(let i=0; i<40; i++) {
      const he = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8,8), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      he.userData = { xOffset: Math.random()*10, y: (Math.random()-0.5)*2, z: (Math.random()-0.5)*2, speed: 2 + Math.random() };
      carrierGroup.add(he);
  }
  group.add(carrierGroup);

  // Sample molecules (Red and Green)
  const m1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const m2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  group.add(m1, m2);

  group.userData.animate = function(delta, time, speed) {
      // Flow Helium left to right
      carrierGroup.children.forEach(he => {
          let x = -4 + ((time*speed*he.userData.speed + he.userData.xOffset) % 8);
          he.position.set(x, he.userData.y, he.userData.z);
      });
      
      // Sample molecules moving slower
      let t1 = -4 + ((time*speed*0.5) % 8);
      m1.position.set(t1, 0, 0);
      
      let t2 = -4 + ((time*speed*1.0) % 8);
      m2.position.set(t2, 0.5, 0.5);
  };

  return {
    group: group,
    description: "Helium as a Carrier Gas (Gas Chromatography). Because Helium is perfectly inert and very light, chemists use it to 'carry' vaporized chemical samples through a testing column. The Helium pushes the chemicals along without reacting with them, allowing the machine to separate and analyze the sample purely based on the sample's own properties.",
    parts: [
      { name: "Cyan Dots", material: "Helium Gas", function: "Provides a flowing, non-reactive atmosphere." },
      { name: "Red/Green Spheres", material: "Chemical Sample", function: "Being carried along the tube to be analyzed." },
      { name: "Glass Tube", material: "Chromatography Column", function: "The testing chamber." }
    ],
    quizQuestions: [
      { question: "Why is Helium frequently used as a 'carrier gas' in analytical chemistry machines like Gas Chromatographs?", options: ["Because it reacts with everything to produce a signal", "Because it is completely unreactive (inert), so it won't contaminate or alter the chemical being tested", "Because it makes the machine float", "Because it burns brightly"], correct: 1, explanation: "To test a chemical, you need to push it through a sensor. If you used Oxygen or Nitrogen to push it, they might react with the sample. Helium ignores the sample entirely, acting only as a physical wind to move it." }
    ]
  };
}