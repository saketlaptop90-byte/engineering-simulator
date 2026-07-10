import * as THREE from 'three';
export function createLithiumQuantumMechanicalModel() {
  const group = new THREE.Group();
  
  // Quantum Mechanical Model (Remastered)
  // Superimposed 1s and 2s orbital probability clouds
  
  const particleCount = 20000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const col1s = new THREE.Color(0x00ffff); // Cyan for 1s
  const col2s = new THREE.Color(0xff00ff); // Magenta for 2s
  
  let i = 0;
  while(i < particleCount) {
      const r = Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      
      const a0 = 1.0;
      const rho = r/a0;
      
      // 1s wave function probability
      const prob1s = Math.exp(-rho * 2) * 5.0; 
      
      // 2s wave function probability
      const psi2s = (2 - rho/2) * Math.exp(-rho / 4);
      const prob2s = psi2s * psi2s * 0.2;
      
      let colorToUse = null;
      let accepted = false;
      
      if (Math.random() < prob1s) {
          accepted = true;
          colorToUse = col1s;
      } else if (Math.random() < prob2s) {
          accepted = true;
          colorToUse = col2s;
      }
      
      if (accepted) {
          pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
          pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
          pos[i*3+2] = r * Math.cos(phi);
          
          colors[i*3] = colorToUse.r;
          colors[i*3+1] = colorToUse.g;
          colors[i*3+2] = colorToUse.b;
          
          i++;
      }
  }
  
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const mat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
  });
  
  const cloud = new THREE.Points(geo, mat);
  group.add(cloud);
  
  // Cutout plane for visibility
  const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.8, side: THREE.DoubleSide})
  );
  plane.rotation.x = Math.PI/2;
  group.add(plane);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.3;
      cloud.rotation.z = time * speed * 0.05;
      
      mat.opacity = 0.5 + Math.sin(time*speed*2)*0.2;
  };

  return {
    group: group,
    description: "Lithium Quantum Mechanical Model (Remastered). This is the most accurate, modern representation of a Lithium atom! It doesn't have neat circular orbits like the Bohr model. Instead, electrons behave like 3D waves, existing everywhere simultaneously as a 'Probability Cloud'. This model mathematically superimposes both of Lithium's orbitals. The dense Cyan cloud in the center is the 1s orbital (holding 2 electrons). The massive, diffuse Magenta cloud is the 2s orbital (holding the 1 valence electron). Notice the completely empty gap between the two clouds? That is a 'node' where an electron can never exist!",
    parts: [
      { name: "Cyan Cloud", material: "1s Orbital Probability", function: "High probability of finding core electrons." },
      { name: "Magenta Cloud", material: "2s Orbital Probability", function: "Low probability, highly diffuse valence electron shell." },
      { name: "Empty Space", material: "Radial Nodes", function: "Regions where wave function cancellation means zero probability." }
    ],
    quizQuestions: [
      { question: "In the Quantum Mechanical Model, what do the clouds actually represent?", options: ["Gas", "The statistical probability of finding an electron in a specific location at any given time.", "A liquid", "A solid shell"], correct: 1, explanation: "Thanks to Heisenberg's Uncertainty Principle, we can never know exactly where an electron is. We can only plot a 3D cloud of where it *probably* is!" }
    ]
  };
}