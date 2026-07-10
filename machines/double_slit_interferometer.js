export function createDoubleSlitInterferometer(THREE) {
  const group = new THREE.Group();

  // 1. Electron/Photon Gun
  const gunGeo = new THREE.CylinderGeometry(0.2, 0.4, 2, 16);
  const gunMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
  const gun = new THREE.Mesh(gunGeo, gunMat);
  gun.rotation.x = Math.PI / 2;
  gun.position.set(0, 0, -8);
  group.add(gun);
  gun.userData = { id: 'particle_gun', name: 'Single Photon/Electron Emitter', description: 'Fires particles one at a time toward the slits.' };

  // 2. Barrier with Double Slit
  const barrierGroup = new THREE.Group();
  barrierGroup.position.set(0, 0, -2);
  group.add(barrierGroup);
  
  const barrierMat = new THREE.MeshStandardMaterial({ color: 0x2222ff, roughness: 0.8 });
  
  const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.1), barrierMat);
  leftPanel.position.set(-1.7, 0, 0);
  barrierGroup.add(leftPanel);
  
  const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.1), barrierMat);
  rightPanel.position.set(1.7, 0, 0);
  barrierGroup.add(rightPanel);
  
  const middlePanel = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 0.1), barrierMat);
  middlePanel.position.set(0, 0, 0);
  barrierGroup.add(middlePanel);
  
  leftPanel.userData = { id: 'barrier', name: 'Double Slit Barrier', description: 'Creates two distinct paths for the particle\'s wavefunction to travel through.' };

  // 3. Detector Screen
  const screenGeo = new THREE.BoxGeometry(6, 4, 0.2);
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 0, 6);
  group.add(screen);
  screen.userData = { id: 'detector_screen', name: 'Detector Array', description: 'Records the precise location where the particle strikes.' };

  // 4. Interference Pattern (Visualized on screen)
  const patternGeo = new THREE.PlaneGeometry(5.8, 3.8);
  // Create a custom material or texture for the interference bands
  // For simplicity, we use multiple vertical planes representing probability bands
  const bandsGroup = new THREE.Group();
  bandsGroup.position.set(0, 0, 6.11);
  group.add(bandsGroup);
  
  for(let i=-5; i<=5; i++) {
    // Intensity follows roughly cos^2 pattern multiplied by sinc^2 envelope
    const intensity = Math.pow(Math.cos(i * 0.5), 2) * Math.pow(Math.sin(i*0.2)/(i*0.2 || 1), 2);
    if (intensity > 0.05) {
      const bandGeo = new THREE.PlaneGeometry(0.3, 3.5);
      const bandMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: intensity });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.x = i * 0.5;
      bandsGroup.add(band);
    }
  }
  bandsGroup.children[0].userData = { id: 'interference_pattern', name: 'Interference Pattern', description: 'The hallmark of waves interfering. Occurs even when particles are fired one at a time!' };

  // 5. Probability Wave Visualization (The Wavefunction)
  const waveMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.1 });
  
  // Wave before slits
  const wave1Geo = new THREE.ConeGeometry(3, 6, 32, 1, true, 0, Math.PI);
  const wave1 = new THREE.Mesh(wave1Geo, waveMat);
  wave1.position.set(0, 0, -5);
  wave1.rotation.x = Math.PI / 2;
  group.add(wave1);
  wave1.userData = { id: 'wavefunction', name: 'Probability Wavefunction', description: 'In quantum mechanics, particles propagate through space as a wave of probability.' };

  // Waves after slits
  const wave2Left = new THREE.Mesh(new THREE.ConeGeometry(5, 8, 32, 1, true, 0, Math.PI), waveMat);
  wave2Left.position.set(-0.1, 0, 2);
  wave2Left.rotation.x = Math.PI / 2;
  group.add(wave2Left);

  const wave2Right = new THREE.Mesh(new THREE.ConeGeometry(5, 8, 32, 1, true, 0, Math.PI), waveMat);
  wave2Right.position.set(0.1, 0, 2);
  wave2Right.rotation.x = Math.PI / 2;
  group.add(wave2Right);

  // 6. Fired Particle
  const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const particle = new THREE.Mesh(particleGeo, particleMat);
  particle.position.set(0, 0, -7);
  group.add(particle);

  // Detector Hits
  const hitsGroup = new THREE.Group();
  hitsGroup.position.set(0,0,6.1);
  group.add(hitsGroup);

  let pZ = -7;
  let targetX = 0;

  group.userData.animate = function(delta) {
    pZ += 0.1;
    
    // Pick a new target based roughly on the interference pattern when starting
    if (pZ < -7) {
      const bands = [-2.5, -1.5, -0.5, 0, 0.5, 1.5, 2.5];
      targetX = bands[Math.floor(Math.random() * bands.length)] + (Math.random()-0.5)*0.2;
    }

    if (pZ > -2) {
      // Split/diffract after barrier
      particle.position.x += (targetX - particle.position.x) * 0.1;
    } else {
      particle.position.x = 0;
    }

    particle.position.z = pZ;

    if (pZ > 6) {
      // Hit the screen
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 4), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
      hit.position.set(particle.position.x, (Math.random()-0.5)*3, 0);
      hitsGroup.add(hit);
      
      if(hitsGroup.children.length > 300) {
        hitsGroup.remove(hitsGroup.children[0]); // keep it from lagging
      }

      pZ = -8; // reset
    }

    // Animate wave expanding
    const t = Date.now() * 0.005;
    wave1.scale.setScalar(1 + (t % 1)*0.2);
    wave1.material.opacity = 0.2 * (1 - (t % 1));
    
    wave2Left.scale.setScalar(1 + (t % 1)*0.2);
    wave2Left.material.opacity = 0.1 * (1 - (t % 1));
    wave2Right.scale.setScalar(1 + (t % 1)*0.2);
    wave2Right.material.opacity = 0.1 * (1 - (t % 1));
  };

  group.userData.quiz = [
    { question: "What happens to the interference pattern if you put a detector at the slits to see which slit the particle goes through?", options: ["The pattern becomes brighter", "The interference pattern disappears, leaving just two bands", "The particle splits in half"], answer: 1 },
    { question: "The Double Slit experiment demonstrates the dual nature of matter. It behaves as a particle when measured, but propagates as a...", options: ["Fluid", "Ray", "Wave"], answer: 2 }
  ];

  return group;
}
