import * as THREE from 'three';
export function createHeliumCarrierGas() {
  const group = new THREE.Group();
  
  // Chromatography column
  const colGeo = new THREE.TorusGeometry(3, 0.2, 16, 100);
  const colMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
  const column = new THREE.Mesh(colGeo, colMat);
  column.rotation.x = Math.PI / 2;
  group.add(column);

  // Helium particles carrying sample
  const particles = new THREE.Group();
  group.add(particles);

  for(let i=0; i<30; i++) {
      const isSample = Math.random() < 0.2;
      const p = new THREE.Mesh(new THREE.SphereGeometry(isSample? 0.1 : 0.05, 8,8), new THREE.MeshBasicMaterial({color: isSample ? 0xff00ff : 0x00ffff}));
      p.userData = { angle: Math.random() * Math.PI * 2, speed: isSample ? 0.5 : 1.0 }; // Sample moves slower due to stationary phase interaction
      particles.add(p);
  }

  group.userData.animate = function(delta, time, speed) {
      particles.children.forEach(p => {
          p.userData.angle += p.userData.speed * delta * speed;
          p.position.set(Math.cos(p.userData.angle)*3, 0, Math.sin(p.userData.angle)*3);
      });
  };

  return {
    group: group,
    description: "Gas Chromatography Carrier. Helium is heavily used as an inert carrier gas to push sample molecules through a chromatography column without reacting with them.",
    parts: [
      { name: "Helium Atoms (Blue)", material: "Carrier Gas", function: "Fast, unreactive, constant flow." },
      { name: "Sample Molecules (Purple)", material: "Analyte", function: "Move slower as they interact with the column walls." }
    ],
    quizQuestions: [
      { question: "Why is Helium ideal as a carrier gas in Gas Chromatography?", options: ["It reacts chemically with the samples", "It is completely chemically inert, ensuring it does not alter the sample being analyzed", "It is heavier than air", "It absorbs UV light"], correct: 1, explanation: "Being a noble gas, Helium is chemically inert, meaning it simply pushes the analyte molecules through the column without initiating unwanted chemical reactions." }
    ]
  };
}
