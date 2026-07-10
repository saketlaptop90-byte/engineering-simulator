import * as THREE from 'three';
export function createHydrogenAufbauPrinciple() {
  const group = new THREE.Group();
  
  // Staircase of energy
  const steps = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({color: 0x555555});
  for(let i=0; i<5; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 2), mat);
      step.position.set(i*2, i*1.5, 0);
      steps.add(step);
  }
  group.add(steps);

  // Electron rolling to the bottom
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0xffff00}));
  group.add(electron);

  group.userData.animate = function(delta, time, speed) {
      // Bouncing down the stairs to the lowest state
      const cycle = (time * speed * 0.5) % 5;
      const stepIndex = 4 - Math.floor(cycle);
      const remainder = cycle % 1;
      
      const startX = (stepIndex) * 2;
      const startY = (stepIndex) * 1.5 + 0.5;
      const endX = (stepIndex - 1) * 2;
      const endY = (stepIndex - 1) * 1.5 + 0.5;
      
      if (stepIndex > 0) {
          electron.position.x = startX + (endX - startX) * remainder;
          // Parabola bounce
          electron.position.y = startY + (endY - startY) * remainder + Math.sin(remainder * Math.PI) * 1.5;
      } else {
          electron.position.set(0, 0.5, 0); // Resting at the bottom
      }
      electron.rotation.z -= delta * speed * 5;
  };

  return {
    group: group,
    description: "The Aufbau Principle. From the German 'Aufbau' meaning 'building up'. It states that in the ground state of an atom, electrons fill atomic orbitals of the lowest available energy levels before occupying higher levels.",
    parts: [
      { name: "Energy Stairs", material: "Staircase", function: "Visualizes higher potential energy states." },
      { name: "Rolling Electron", material: "Yellow Sphere", function: "Always seeks the lowest potential energy well (the bottom step / 1s orbital)." }
    ],
    quizQuestions: [
      { question: "What does the Aufbau Principle state?", options: ["Electrons orbit in perfect circles", "Electrons fill the highest energy orbitals first", "Electrons in the ground state fill the lowest available energy levels before moving to higher ones", "All electrons have the exact same energy"], correct: 2, explanation: "Nature always seeks the lowest energy state. The Aufbau principle dictates that electrons 'build up' an atom starting from the lowest energy orbital (1s) and working their way up as orbitals fill." }
    ]
  };
}