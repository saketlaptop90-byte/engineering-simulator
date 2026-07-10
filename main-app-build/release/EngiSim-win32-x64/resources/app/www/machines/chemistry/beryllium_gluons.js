import * as THREE from 'three';
export function createBerylliumGluons() {
  const group = new THREE.Group();
  
  // Zooming in on the Strong Nuclear Force
  
  const q1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})); q1.position.set(-2, 0, 0); group.add(q1);
  const q2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0x444444})); q2.position.set(2, 0, 0); group.add(q2);

  // Gluon exchanging between them (Color Force)
  const gluon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({color: 0xff0000})); // Red color charge
  group.add(gluon);
  
  const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 8), new THREE.MeshBasicMaterial({color: 0x888888, transparent: true, opacity: 0.3}));
  spring.rotation.z = Math.PI/2;
  group.add(spring);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      
      const cycle = (time * speed * 2) % 2;
      
      if (cycle < 1) {
          // Q1 shoots gluon to Q2
          gluon.position.set(-2 + cycle*4, 0, 0);
          gluon.material.color.setHex(0xff0000); // Red
      } else {
          // Q2 shoots gluon back to Q1
          const t = cycle - 1;
          gluon.position.set(2 - t*4, 0, 0);
          gluon.material.color.setHex(0x00ff00); // Green
      }
      
      // Quarks vibrate intensely as they are hit
      q1.position.x = -2 + (Math.random()-0.5)*0.1;
      q2.position.x = 2 + (Math.random()-0.5)*0.1;
  };

  return {
    group: group,
    description: "Gluons and the Strong Force. What are those orange strings holding the quarks together? They are made of particles called 'Gluons'. Quarks possess a property called 'Color Charge' (Red, Green, Blue). To stick together, they constantly shoot Gluon particles at each other at the speed of light. Catching and throwing these heavy gluons creates the 'Strong Nuclear Force' - the most powerful force in the universe, which is what prevents the +4 Beryllium nucleus from instantly exploding.",
    parts: [
      { name: "White/Grey Spheres", material: "Quarks", function: "The matter." },
      { name: "Flashing Pellet", material: "A Gluon", function: "The force-carrier particle for the Strong Nuclear Force." }
    ],
    quizQuestions: [
      { question: "What is the name of the particle that acts as 'glue' to hold quarks together inside a proton?", options: ["Electrons", "Photons", "Gluons", "Gravitons"], correct: 2, explanation: "Physicists literally named them 'Gluons' because they act like glue. They carry the Strong Nuclear Force." }
    ]
  };
}