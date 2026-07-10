import * as THREE from 'three';
export function createHeliumHelioxBreathing() {
  const group = new THREE.Group();
  
  // Diving cylinder
  const tank = new THREE.Group();
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 32), new THREE.MeshStandardMaterial({color: 0xdddddd, metalness: 0.6}));
  const top = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshStandardMaterial({color: 0xdddddd, metalness: 0.6}));
  top.position.y = 2;
  const valve = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({color: 0xffd700, metalness: 0.8}));
  valve.position.y = 3.25;
  
  tank.add(cylinder, top, valve);
  group.add(tank);

  // Gas mixture visualization
  const mix = new THREE.Group();
  for(let i=0; i<40; i++) {
      // 79% He, 21% O2
      const isHe = Math.random() < 0.79;
      const mat = new THREE.MeshBasicMaterial({color: isHe ? 0x00ffff : 0x00ff00});
      const particle = new THREE.Mesh(new THREE.SphereGeometry(isHe ? 0.05 : 0.1, 8,8), mat);
      particle.position.set((Math.random()-0.5)*1.8, (Math.random()-0.5)*3.8, (Math.random()-0.5)*1.8);
      mix.add(particle);
  }
  group.add(mix);

  return {
    group: group,
    description: "Heliox Breathing Mixture. For deep-sea diving, Nitrogen is replaced with Helium to prevent nitrogen narcosis and reduce the work of breathing due to Helium's lower density.",
    parts: [
      { name: "Diving Cylinder", material: "Aluminum/Steel", function: "Holds high pressure gas." },
      { name: "Helium (79%)", material: "Gas", function: "Inert, non-narcotic at depth, highly diffusible." },
      { name: "Oxygen (21%)", material: "Gas", function: "Required for respiration." }
    ],
    quizQuestions: [
      { question: "Why do deep-sea divers use a mixture of Helium and Oxygen (Heliox) instead of standard air?", options: ["Helium provides more energy than Nitrogen", "Nitrogen becomes toxic/narcotic under high pressure, while Helium remains safely inert", "Helium is cheaper than Nitrogen", "Helium allows them to swim faster"], correct: 1, explanation: "At high pressures, Nitrogen causes a dangerous intoxicating effect called Nitrogen Narcosis. Helium is biologically inert even at extreme pressures, eliminating this risk." }
    ]
  };
}
