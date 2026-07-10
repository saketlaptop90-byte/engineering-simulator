import * as THREE from 'three';
export function createLithiumQuantumModel() {
  const group = new THREE.Group();
  
  // Quantum Probability Density (Remastered)
  
  const particleCount = 15000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  // We will plot the 2s orbital probability density function
  // Psi_2s ~ (2 - r/a0) * e^(-r/2a0)
  
  const color1 = new THREE.Color(0x00ffff); // dense regions
  const color2 = new THREE.Color(0xff00ff); // sparse regions
  
  let i = 0;
  while(i < particleCount) {
      // random spherical coordinate
      const r = Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      
      // 2s radial probability density
      const a0 = 1.0;
      const rho = r/a0;
      const prob = (2 - rho) * (2 - rho) * Math.exp(-rho); 
      
      // rejection sampling
      if (Math.random() < prob * 1.5) { // scale up to get enough particles
          pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
          pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
          pos[i*3+2] = r * Math.cos(phi);
          
          // Color based on density (probability)
          const mixColor = color2.clone().lerp(color1, Math.min(1.0, prob*2));
          colors[i*3] = mixColor.r;
          colors[i*3+1] = mixColor.g;
          colors[i*3+2] = mixColor.b;
          
          i++;
      }
  }
  
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const mat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
  });
  
  const cloud = new THREE.Points(geo, mat);
  group.add(cloud);
  
  // Add a cutting plane to let the user see inside the cloud
  const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide})
  );
  plane.rotation.x = Math.PI/2;
  group.add(plane);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.05)*0.2 + 0.2;
      
      // Make the cloud "shimmer" to represent quantum fluctuations
      mat.opacity = 0.5 + Math.sin(time*speed*5)*0.1;
  };

  return {
    group: group,
    description: "Lithium Quantum Model (Remastered). In reality, electrons do not orbit the nucleus in perfect circles like planets. They exist as a 'Probability Density Cloud' determined by the Schrödinger wave equation. This model visualizes 15,000 points. Each point is NOT an electron—it is a location where you MIGHT find the electron if you look! Notice the dense cyan ring near the center (the 1s orbital), a gap (the radial node), and then a diffuse magenta cloud further out (the 2s orbital). The electron is literally everywhere at once until you observe it!",
    parts: [
      { name: "Cyan Density", material: "High Probability", function: "Where the electron is most likely to be found." },
      { name: "Magenta Density", material: "Low Probability", function: "Where the electron is less likely to be found." },
      { name: "The Empty Gap", material: "Radial Node", function: "A spherical region where the probability of finding the electron is exactly ZERO!" }
    ],
    quizQuestions: [
      { question: "What do the dots in this quantum model represent?", options: ["Individual electrons", "Locations where there is a probability of finding the electron.", "Protons", "Photons"], correct: 1, explanation: "Quantum mechanics dictates that an electron's location is a smear of probability, not a definite point, until it interacts with something." }
    ]
  };
}