import * as THREE from 'three';
export function createHeliumQuantumModel() {
  const group = new THREE.Group();
  
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(nucleus);

  const particleCount = 4000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    // Tighter cloud than hydrogen due to Z=2
    const r = -Math.log(Math.random()) * 1.0; 

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    
    colors[i*3] = 0.8;
    colors[i*3+1] = 0.8;
    colors[i*3+2] = 1.0;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
  const cloud = new THREE.Points(geometry, material);
  group.add(cloud);

  group.userData.animate = function(delta, time, speed) {
      cloud.rotation.y += delta * speed * 0.1;
  };

  return {
    group: group,
    description: "Quantum Mechanical Model of Helium. The 1s probability cloud is more compact than Hydrogen's due to the stronger nuclear charge (Z=2).",
    parts: [
      { name: "Nucleus (+2e)", material: "Protons", function: "Stronger attractive force pulls the electron cloud closer." },
      { name: "Probability Cloud (1s²)", material: "Wavefunction", function: "Represents the probability density of both electrons simultaneously." }
    ],
    quizQuestions: [
      { question: "Why is the Helium quantum probability cloud more compact (smaller radius) than Hydrogen's?", options: ["It has fewer electrons", "The electrons repel each other more", "The nucleus has a +2 charge (Z=2), pulling the 1s shell closer", "Helium is colder than Hydrogen"], correct: 2, explanation: "The effective nuclear charge is higher in Helium (+2 vs +1), which pulls the 1s electrons closer to the nucleus, reducing the atomic radius." }
    ]
  };
}
