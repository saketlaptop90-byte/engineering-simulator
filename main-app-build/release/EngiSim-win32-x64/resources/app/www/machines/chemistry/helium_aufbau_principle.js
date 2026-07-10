import * as THREE from 'three';
export function createHeliumAufbauPrinciple() {
  const group = new THREE.Group();
  
  // Staircase of energy
  const steps = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({color: 0x555555});
  for(let i=0; i<4; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 2), mat);
      step.position.set(i*2, i*1.5, 0);
      steps.add(step);
  }
  group.add(steps);

  // Two Electrons rolling to the bottom
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0x00ffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0xff00ff}));
  group.add(e1, e2);

  group.userData.animate = function(delta, time, speed) {
      // e1 bouncing down
      const cycle1 = (time * speed * 0.5) % 4;
      const stepIndex1 = 3 - Math.floor(cycle1);
      const rem1 = cycle1 % 1;
      
      if (stepIndex1 > 0) {
          e1.position.set((stepIndex1)*2 - rem1*2, (stepIndex1)*1.5+0.5 - rem1*1.5 + Math.sin(rem1*Math.PI)*1.5, -0.4);
      } else {
          e1.position.set(0, 0.5, -0.4); 
      }
      
      // e2 bouncing down (delayed)
      const cycle2 = (time * speed * 0.5 + 1) % 4;
      const stepIndex2 = 3 - Math.floor(cycle2);
      const rem2 = cycle2 % 1;
      
      if (stepIndex2 > 0) {
          e2.position.set((stepIndex2)*2 - rem2*2, (stepIndex2)*1.5+0.5 - rem2*1.5 + Math.sin(rem2*Math.PI)*1.5, 0.4);
      } else {
          e2.position.set(0, 0.5, 0.4); 
      }
  };

  return {
    group: group,
    description: "The Aufbau Principle (Helium). Both of Helium's electrons seek the lowest possible potential energy state (the ground floor). Because a single step (orbital) can hold exactly two electrons, they both successfully park on the bottom 1s step.",
    parts: [
      { name: "Energy Stairs", material: "Staircase", function: "Visualizes higher potential energy states." },
      { name: "Two Electrons", material: "Cyan & Magenta Spheres", function: "Both fall into the lowest available well (1s) without overflowing to the next step." }
    ],
    quizQuestions: [
      { question: "If a third electron were dropped down these energy stairs (e.g., to make a Lithium atom), where would it land according to the Aufbau Principle?", options: ["It would squeeze onto the bottom step with the other two", "It would land on the second step (2s) because the bottom step is completely full", "It would float in the air", "It would fall through the stairs"], correct: 1, explanation: "The bottom step (1s orbital) can only hold a maximum of 2 electrons. Once it is full, the Aufbau principle states the next electron MUST occupy the next lowest available energy level, which is the 2s orbital." }
    ]
  };
}