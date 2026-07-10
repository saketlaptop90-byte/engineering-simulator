import * as THREE from 'three';
export function createLithiumProbabilityDensity() {
  const group = new THREE.Group();
  
  // Probability Density Heatmap (Remastered)
  
  // Create a 2D plane cutting through the center of the atom to show the PDF as a heatmap
  const planeGeo = new THREE.PlaneGeometry(10, 10, 100, 100);
  
  const colors = [];
  const pos = planeGeo.attributes.position.array;
  
  for(let i=0; i<pos.length; i+=3) {
      const x = pos[i];
      const y = pos[i+1];
      const r = Math.sqrt(x*x + y*y);
      
      const a0 = 1.0;
      const rho = r/a0;
      
      // Calculate probability density (psi squared)
      const psi1s = Math.exp(-rho);
      const prob1s = psi1s * psi1s;
      
      const psi2s = (2 - rho) * Math.exp(-rho / 2);
      const prob2s = psi2s * psi2s * 0.05; // scale down for visibility
      
      const totalProb = prob1s + prob2s;
      
      // Map probability to a heatmap color (Black -> Blue -> Cyan -> White)
      const c = new THREE.Color(0x000000);
      if (totalProb > 0.8) c.lerp(new THREE.Color(0xffffff), (totalProb-0.8)/0.2);
      else if (totalProb > 0.1) c.lerp(new THREE.Color(0x00ffff), (totalProb-0.1)/0.7);
      else c.lerp(new THREE.Color(0x000044), totalProb/0.1);
      
      colors.push(c.r, c.g, c.b);
      
      // Extrude the plane based on probability to make it a 3D terrain!
      pos[i+2] = totalProb * 2; 
  }
  
  planeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  planeGeo.computeVertexNormals();
  
  const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      metalness: 0.2,
      roughness: 0.4,
      wireframe: true,
      side: THREE.DoubleSide
  });
  
  const heatmap = new THREE.Mesh(planeGeo, material);
  heatmap.rotation.x = -Math.PI/2;
  heatmap.position.y = -2;
  group.add(heatmap);
  
  // Add an axis
  const axes = new THREE.AxesHelper(3);
  axes.position.y = -2;
  group.add(axes);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Undulate the terrain slightly
      const positions = heatmap.geometry.attributes.position.array;
      for(let i=0; i<positions.length; i+=3) {
          const x = positions[i];
          const y = positions[i+1];
          const r = Math.sqrt(x*x + y*y);
          
          const rho = r/1.0;
          const psi1s = Math.exp(-rho);
          const prob1s = psi1s * psi1s;
          const psi2s = (2 - rho) * Math.exp(-rho / 2);
          const prob2s = psi2s * psi2s * 0.05;
          const totalProb = prob1s + prob2s;
          
          // Add a ripple effect
          positions[i+2] = totalProb * 2 + Math.sin(r * 3 - time * speed * 2) * 0.1 * totalProb;
      }
      heatmap.geometry.attributes.position.needsUpdate = true;
  };

  return {
    group: group,
    description: "Probability Density Heatmap (Remastered). What does an atom actually 'look' like? If you take the 3D probability cloud and slice it directly down the middle, you get a 2D Probability Density function! We have rendered this slice as a 3D wireframe terrain graph. The X and Z axes represent physical distance from the nucleus, while the Y axis (height) and the color represent the statistical probability of finding an electron at that exact location. Notice the massive spike in the center? That is the 1s orbital. Notice the deep valley right next to it? That is the Radial Node, where probability drops to absolutely zero!",
    parts: [
      { name: "White Spike", material: "High Probability", function: "The 1s core electrons are almost certainly found here." },
      { name: "Dark Valleys", material: "Radial Nodes", function: "Locations where an electron cannot physically exist." },
      { name: "Blue Ripples", material: "Low Probability", function: "The diffuse 2s valence electron shell." }
    ],
    quizQuestions: [
      { question: "In this Probability Density heatmap, what does the height of the terrain represent?", options: ["The temperature of the atom", "The statistical probability of finding an electron at that exact distance from the nucleus.", "The number of protons", "The gravity of the atom"], correct: 1, explanation: "The higher the spike, the more likely you are to find an electron there!" }
    ]
  };
}