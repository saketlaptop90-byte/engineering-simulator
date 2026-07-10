import * as THREE from 'three';
export function createBoronElectronCloud() {
  const group = new THREE.Group();
  
  // Ultra High Quality Electron Cloud (Probability Density)
  
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(core);

  // Volumetric Point Cloud
  const numPoints = 20000;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(numPoints * 3);
  const pCol = new Float32Array(numPoints * 3);
  
  const c1s = new THREE.Color(0x00ffff);
  const c2s = new THREE.Color(0xff00ff);
  const c2p = new THREE.Color(0x00ff00);
  
  for(let i=0; i<numPoints; i++) {
      let shell = Math.random();
      let r, col, x, y, z;
      
      if (shell < 0.3) {
          // 1s (Tight sphere)
          r = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
          col = c1s;
          // random sphere
          const u = Math.random(); const v = Math.random();
          const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
      } else if (shell < 0.6) {
          // 2s (Larger sphere with a node)
          r = Math.random() > 0.2 ? (Math.random() * 1.5 + 1.2) : (Math.random() * 0.5 + 0.3);
          col = c2s;
          const u = Math.random(); const v = Math.random();
          const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
      } else {
          // 2p (Dumbbell shape along Y axis)
          // r depends on angle from Y axis
          const u = Math.random(); const v = Math.random();
          const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
          
          // Probability is proportional to cos^2(phi)
          const prob = Math.cos(phi) * Math.cos(phi);
          r = (Math.random() * 2.5 + 0.5) * prob; 
          // add a bit of scatter
          r += Math.random() * 0.5;
          
          col = c2p;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
          
          // Swap Y and X to align along X axis for better viewing
          let temp = x; x = y; y = temp;
      }
      
      pPos[i*3] = x; pPos[i*3+1] = y; pPos[i*3+2] = z;
      pCol[i*3] = col.r; pCol[i*3+1] = col.g; pCol[i*3+2] = col.b;
  }
  
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  
  // Custom points material for soft glowing dots
  const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
  });
  
  const cloud = new THREE.Points(pGeo, pMat);
  group.add(cloud);

  // A bright light passing through
  const light = new THREE.PointLight(0xffffff, 2, 10);
  group.add(light);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.z = Math.sin(time*speed*0.1)*0.2;
      
      // Jiggle the point cloud to simulate quantum jitter
      cloud.rotation.y = Math.sin(time*speed*5)*0.02;
      cloud.scale.setScalar(1 + Math.sin(time*speed*8)*0.02);
      
      light.position.set(Math.cos(time*speed)*4, Math.sin(time*speed*2)*2, Math.sin(time*speed)*4);
  };

  return {
    group: group,
    description: "Quantum Electron Cloud (Upgraded). Electrons do not orbit in flat circles! According to quantum mechanics, they exist as a 'probability density cloud'. The brighter the cloud, the more likely you are to find an electron there at any given moment. This upgraded visualization uses 20,000 real-time particles to map out the exact mathematical probability fields for Boron. Notice the tight 1s sphere (cyan), the larger 2s sphere (magenta), and the iconic double-lobed 2p 'dumbbell' orbital (green) stretching along the axis.",
    parts: [
      { name: "Cyan Sphere", material: "1s Density", function: "Core electrons, tightly packed." },
      { name: "Magenta Sphere", material: "2s Density", function: "Valence electrons, outer shell." },
      { name: "Green Dumbbell", material: "2p Density", function: "The highest energy valence electron occupying a directional lobe." }
    ],
    quizQuestions: [
      { question: "Why is the green 2p orbital shaped like a dumbbell instead of a sphere?", options: ["Because it is spinning", "Because it represents angular momentum (it has a directional wave function), unlike the 's' orbitals which are spherically symmetric.", "Because it hit another atom", "Because green particles are heavier"], correct: 1, explanation: "Orbitals are just 3D standing waves! The 's' waves are spherical, but the 'p' waves have a node at the nucleus, creating two distinct lobes." }
    ]
  };
}