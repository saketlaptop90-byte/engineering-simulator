import * as THREE from 'three';
export function createHeliumElectronCloud() {
  const group = new THREE.Group();
  
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(nucleus);

  const cloudGroup = new THREE.Group();
  // Tighter gradient for Helium
  for(let i=1; i<=8; i++) {
     const radius = i * 0.25; 
     const opacity = 0.4 * Math.exp(-i/1.5);
     const geo = new THREE.SphereGeometry(radius, 32, 32);
     const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: opacity, transmission: 0.9, roughness: 0.1 });
     cloudGroup.add(new THREE.Mesh(geo, mat));
  }
  group.add(cloudGroup);

  return {
    group: group,
    description: "Electron Cloud visualization for Helium, showing the dense region of electron probability surrounding the nucleus.",
    parts: [
      { name: "Nucleus", material: "Center", function: "Provides +2 electrostatic pull." },
      { name: "Electron Density", material: "Cloud", function: "Highly spherical and very compact due to full 1s orbital and high Z_eff." }
    ],
    quizQuestions: [
      { question: "Which has a smaller atomic radius, Hydrogen or Helium?", options: ["Hydrogen", "Helium", "They are identical", "It depends on temperature"], correct: 1, explanation: "Helium has a smaller atomic radius than Hydrogen because its +2 nucleus pulls the 1s electrons in more tightly." }
    ]
  };
}
