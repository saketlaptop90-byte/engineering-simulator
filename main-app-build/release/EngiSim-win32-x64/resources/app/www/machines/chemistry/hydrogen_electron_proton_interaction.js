import * as THREE from 'three';
export function createHydrogenElectronProtonInteraction() {
  const group = new THREE.Group();
  
  // Proton
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0xff0000}));
  group.add(proton);
  
  // Electron
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  group.add(electron);

  // Electrostatic force vectors (Coulomb's Law)
  const forceToE = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1.5, 0x00ff00, 0.3, 0.3);
  const forceToP = new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(0,0,0), 1.5, 0x00ff00, 0.3, 0.3);
  group.add(forceToE); group.add(forceToP);

  // Visual spring representing the 1/r^2 potential well
  const springMat = new THREE.LineBasicMaterial({color: 0xaaaaaa});
  const springGeo = new THREE.BufferGeometry();
  const springLine = new THREE.Line(springGeo, springMat);
  group.add(springLine);

  group.userData.animate = function(delta, time, speed) {
      const dist = 3 + Math.sin(time*speed*2)*1.5; // fluctuating distance
      electron.position.set(dist, 0, 0);
      
      // Update forces (1/r^2 magnitude visualization)
      const forceMag = 10 / (dist * dist);
      forceToE.position.copy(proton.position);
      forceToE.setDirection(new THREE.Vector3(1,0,0));
      forceToE.setLength(forceMag);
      
      forceToP.position.copy(electron.position);
      forceToP.setDirection(new THREE.Vector3(-1,0,0));
      forceToP.setLength(forceMag);

      // Spring visualization
      const sPts = [];
      for(let i=0; i<dist; i+=0.1) {
          sPts.push(new THREE.Vector3(i, Math.sin(i*20)*0.2*(dist-i)/dist, Math.cos(i*20)*0.2*(dist-i)/dist));
      }
      sPts.push(electron.position.clone());
      springLine.geometry.setFromPoints(sPts);
  };

  return {
    group: group,
    description: "Electron-Proton Interaction (Coulomb Force). The fundamental glue of the atom. The positively charged proton and negatively charged electron attract each other with a force inversely proportional to the square of the distance between them (Coulomb's Law).",
    parts: [
      { name: "Proton (+)", material: "Hadron", function: "Exerts attractive electrostatic force." },
      { name: "Electron (-)", material: "Lepton", function: "Pulled inward by the proton." },
      { name: "Green Vectors", material: "Force Magnitude", function: "Visually scale as 1/r², growing massively stronger as they get closer." }
    ],
    quizQuestions: [
      { question: "According to Coulomb's Law, if the distance between the electron and proton is cut in half, what happens to the electrostatic force of attraction between them?", options: ["It doubles", "It halves", "It quadruples (increases by a factor of 4)", "It drops to zero"], correct: 2, explanation: "Coulomb's force follows an inverse-square law (F ∝ 1/r²). If distance (r) is halved (1/2), the force becomes 1/(1/2)² = 1/(1/4) = 4 times stronger." }
    ]
  };
}