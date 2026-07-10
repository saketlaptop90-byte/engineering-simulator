import * as THREE from 'three';
export function createLithium2sOrbital() {
  const group = new THREE.Group();
  
  // 2s Orbital Spherical Harmonics
  
  // We will build a highly detailed volumetric rendering of just the 2s orbital,
  // showing the inner positive phase, the radial node (zero), and the outer negative phase.
  
  const particleCount = 10000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const colorPos = new THREE.Color(0xff00ff); // Magenta for positive phase
  const colorNeg = new THREE.Color(0x00ffff); // Cyan for negative phase
  
  let i = 0;
  while(i < particleCount) {
      const r = Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      
      const a0 = 1.0;
      const rho = r/a0;
      
      // 2s wave function (psi)
      const psi = (2 - rho) * Math.exp(-rho / 2);
      const prob = psi * psi; 
      
      if (Math.random() < prob * 1.0) {
          pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
          pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
          pos[i*3+2] = r * Math.cos(phi);
          
          // Color based on the PHASE (sign of psi)
          const c = psi > 0 ? colorPos : colorNeg;
          colors[i*3] = c.r;
          colors[i*3+1] = c.g;
          colors[i*3+2] = c.b;
          
          i++;
      }
  }
  
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const mat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
  });
  
  const cloud = new THREE.Points(geo, mat);
  group.add(cloud);
  
  // Cutout plane
  const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.8, side: THREE.DoubleSide})
  );
  plane.rotation.x = Math.PI/2;
  group.add(plane);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.3;
      
      cloud.rotation.z = time * speed * 0.05;
      
      // Phase oscillation (quantum state evolution)
      const phase = Math.sin(time * speed * 2);
      mat.opacity = 0.5 + phase * 0.3;
  };

  return {
    group: group,
    description: "Lithium 2s Orbital Wave Function (Remastered). This model shows the true quantum mechanical nature of the 2s orbital! Electrons act like waves. Notice how the inner dense sphere is Magenta, while the outer diffuse sphere is Cyan? This represents the 'phase' of the electron wave. The magenta region is positive, and the cyan region is negative. The dark, empty gap between them is the 'Radial Node'—the exact point where the wave crosses from positive to negative, meaning the probability of finding the electron there is absolute zero!",
    parts: [
      { name: "Magenta Core", material: "Positive Wave Phase", function: "Inner region of the 2s orbital." },
      { name: "Cyan Halo", material: "Negative Wave Phase", function: "Outer region of the 2s orbital." },
      { name: "Black Gap", material: "Radial Node", function: "Where the wave function equals zero." }
    ],
    quizQuestions: [
      { question: "What does the empty gap (radial node) between the two colors represent?", options: ["It is where the nucleus is located", "It is a mathematical region where the electron's wave function equals zero, meaning the electron will NEVER be found there.", "It is where the electron sleeps", "It is made of antimatter"], correct: 1, explanation: "Even though the electron exists in both the inner and outer spheres simultaneously, it never actually exists in the gap between them. Welcome to Quantum Mechanics!" }
    ]
  };
}