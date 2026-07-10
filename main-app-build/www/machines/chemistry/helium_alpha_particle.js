import * as THREE from 'three';
export function createHeliumAlphaParticle() {
  const group = new THREE.Group();
  
  const nucGroup = new THREE.Group();
  const pMat = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.4 });
  const nMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4 });
  
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), pMat); p1.position.set(0.4, 0.4, 0);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), pMat); p2.position.set(-0.4, -0.4, 0);
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), nMat); n1.position.set(-0.4, 0.4, 0.4);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), nMat); n2.position.set(0.4, -0.4, -0.4);
  
  nucGroup.add(p1, p2, n1, n2);
  group.add(nucGroup);

  // Emitting radiation lines
  for(let i=0; i<8; i++) {
     const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
     const lineMat = new THREE.MeshBasicMaterial({color: 0xffff00, transparent:true, opacity:0.5});
     const line = new THREE.Mesh(lineGeo, lineMat);
     line.rotation.z = (Math.PI / 4) * i;
     // group.add(line); // Visual clutter, let's keep it simple
  }

  group.userData.animate = function(delta, time, speed) {
      nucGroup.rotation.y += delta * speed * 0.5;
      nucGroup.rotation.x += delta * speed * 0.5;
  };

  return {
    group: group,
    description: "An Alpha Particle is a bare Helium-4 nucleus (He2+) without any electrons. It is commonly emitted during radioactive alpha decay of heavy elements.",
    parts: [
      { name: "Protons", material: "Nucleons", function: "Give the particle a +2 electrical charge." },
      { name: "Neutrons", material: "Nucleons", function: "Provide mass. Total mass is ~4 amu." }
    ],
    quizQuestions: [
      { question: "What electrical charge does an alpha particle carry?", options: ["0", "-1", "+1", "+2"], correct: 3, explanation: "An alpha particle consists of 2 protons and 0 electrons, giving it a net charge of +2." }
    ]
  };
}
