import * as THREE from 'three';
export function createHydrogenQuantumModel() {
  const group = new THREE.Group();
  
  // Nucleus
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  // Quantum probability cloud (Particles)
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    // Generate points heavily concentrated at the center (exponential decay simulating 1s orbital probability)
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = -Math.log(Math.random()) * 1.5; // simple approximation of exponential decay radial probability

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    
    colors[i*3] = 0.2;
    colors[i*3+1] = 0.5;
    colors[i*3+2] = 1.0;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
  const cloud = new THREE.Points(geometry, material);
  group.add(cloud);

  group.userData.animate = function(delta, time, speed) {
      cloud.rotation.y += delta * speed * 0.1;
      cloud.rotation.z += delta * speed * 0.05;
  };

  return {
    group: group,
    description: "Quantum Mechanical Model of Hydrogen. Instead of orbits, the electron exists in a probability cloud.",
    parts: [
      { name: "Nucleus", material: "Proton", function: "Center of the atom." },
      { name: "Probability Cloud (1s)", material: "Wavefunction", function: "Defines the probability of finding the electron at a given location." }
    ]
  };
}
