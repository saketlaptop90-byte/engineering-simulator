export function createSternGerlachExperiment(THREE) {
  const group = new THREE.Group();

  // 1. Oven / Silver Atom Source
  const ovenGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
  const ovenMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
  const oven = new THREE.Mesh(ovenGeo, ovenMat);
  oven.rotation.x = Math.PI / 2;
  oven.position.set(0, 0, -6);
  group.add(oven);
  oven.userData = { id: 'oven', name: 'Heated Oven', description: 'Heats silver to evaporation, emitting a beam of neutral silver atoms.' };

  // 2. Collimating Slits
  const slitGeo = new THREE.BoxGeometry(2, 2, 0.1);
  const slitMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  for(let i=0; i<2; i++) {
    const slit = new THREE.Mesh(slitGeo, slitMat);
    slit.position.set(0, 0, -4 + i*1.5);
    // Cut a hole (simulated by adding a black plane)
    const hole = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.5), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    hole.position.set(0,0,0.06);
    slit.add(hole);
    group.add(slit);
    if(i===0) slit.userData = { id: 'collimator', name: 'Collimating Slits', description: 'Narrows the emitted silver atoms into a fine, straight beam.' };
  }

  // 3. Inhomogeneous Magnetic Field (Magnets)
  // North Pole (pointed)
  const northGeo = new THREE.CylinderGeometry(0, 1, 3, 4);
  const northMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.5 });
  const north = new THREE.Mesh(northGeo, northMat);
  north.rotation.y = Math.PI / 4;
  north.position.set(0, 2, 0);
  group.add(north);
  north.userData = { id: 'magnet_north', name: 'North Pole (Pointed)', description: 'Creates a strong magnetic gradient (inhomogeneous field) in the z-direction.' };

  // South Pole (flat/grooved)
  const southGeo = new THREE.BoxGeometry(1.5, 1, 3);
  const southMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.5 });
  const south = new THREE.Mesh(southGeo, southMat);
  south.position.set(0, -1.5, 0);
  group.add(south);
  south.userData = { id: 'magnet_south', name: 'South Pole (Flat)', description: 'Forms the other half of the inhomogeneous magnetic field.' };

  // 4. Detector Screen
  const screenGeo = new THREE.BoxGeometry(3, 4, 0.1);
  const screenMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 0, 5);
  group.add(screen);
  screen.userData = { id: 'detector_screen', name: 'Detector Plate', description: 'Records the final positions of the silver atoms.' };

  // The classical expectation (continuous smear) vs Quantum reality (two discrete points)
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const spinUpDot = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), dotMat);
  spinUpDot.position.set(0, 1, 5.06);
  group.add(spinUpDot);
  spinUpDot.userData = { id: 'spin_up', name: 'Spin-Up Detection', description: 'Atoms with spin angular momentum aligned with the field (+1/2).' };

  const spinDownDot = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), dotMat);
  spinDownDot.position.set(0, -1, 5.06);
  group.add(spinDownDot);
  spinDownDot.userData = { id: 'spin_down', name: 'Spin-Down Detection', description: 'Atoms with spin angular momentum aligned against the field (-1/2).' };

  // 5. Silver Atom Beam (Particles)
  const particlesGroup = new THREE.Group();
  group.add(particlesGroup);
  
  const atomGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const atomMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
  
  // Store particles with their z-position and spin state (+1 or -1)
  const particles = [];
  for(let i=0; i<30; i++) {
    const atom = new THREE.Mesh(atomGeo, atomMat);
    const zPos = -6 + Math.random() * 11;
    atom.position.set(0, 0, zPos);
    particlesGroup.add(atom);
    particles.push({ mesh: atom, spin: Math.random() > 0.5 ? 1 : -1, z: zPos });
  }
  
  particlesGroup.children[0].userData = { id: 'silver_atoms', name: 'Silver Atom Beam', description: 'Neutral atoms possessing an intrinsic magnetic moment due to the spin of a single unpaired electron.' };

  group.userData.animate = function(delta) {
    const speed = 0.05;
    particles.forEach(p => {
      p.z += speed;
      
      // Deflection inside the magnetic field
      if (p.z > -1.5 && p.z < 1.5) {
        // Accelerating deflection
        const progress = (p.z + 1.5) / 3;
        p.mesh.position.y = p.spin * Math.pow(progress, 2);
      } else if (p.z >= 1.5) {
        // Straight line trajectory after the magnet
        p.mesh.position.y = p.spin + p.spin * ((p.z - 1.5) / 3.5);
      } else {
        // Before magnet
        p.mesh.position.y = 0;
      }
      
      p.mesh.position.z = p.z;
      
      // Reset at screen
      if (p.z >= 5) {
        p.z = -6;
      }
    });
  };

  group.userData.quiz = [
    { question: "What did the Stern-Gerlach experiment fundamentally prove?", options: ["That atoms are perfectly spherical", "That spatial orientation of angular momentum (spin) is quantized", "That magnetic fields bend light"], answer: 1 },
    { question: "Classically, what pattern should the silver atoms have made on the detector screen?", options: ["Two discrete spots", "A continuous vertical smear", "A perfect circle"], answer: 1 }
  ];

  return group;
}
