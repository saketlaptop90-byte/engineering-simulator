export function createRadiometricDatingSpectrometer(THREE) {
  const group = new THREE.Group();

  // Mass Spectrometer machine
  const baseGeo = new THREE.BoxGeometry(6, 2, 3);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -1;
  group.add(base);

  const tubeGeo = new THREE.CylinderGeometry(0.6, 0.6, 5, 32);
  const tubeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  tube.rotation.z = Math.PI / 2;
  tube.position.set(0, 0.5, 0);
  group.add(tube);
  tube.userData = { id: 'flight_tube', name: 'Magnetic Flight Tube', description: 'Accelerated ions fly through here. A strong magnetic field bends their path based on their mass.' };

  const magnetGeo = new THREE.BoxGeometry(2, 3, 2);
  const magnetMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.5 });
  const magnet = new THREE.Mesh(magnetGeo, magnetMat);
  magnet.position.set(0, 0.5, 0);
  group.add(magnet);
  magnet.userData = { id: 'magnet', name: 'Electromagnet', description: 'Creates a magnetic field. Lighter isotopes bend more sharply than heavier ones.' };

  const ionSourceGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const ionSourceMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const ionSource = new THREE.Mesh(ionSourceGeo, ionSourceMat);
  ionSource.position.set(-3.25, 0.5, 0);
  group.add(ionSource);
  ionSource.userData = { id: 'ion_source', name: 'Ion Source (Laser Ablation)', description: 'Vaporizes the rock sample and strips electrons away to create positively charged ions.' };

  const detectorGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
  const detectorMat = new THREE.MeshStandardMaterial({ color: 0x2244aa });
  const detector = new THREE.Mesh(detectorGeo, detectorMat);
  detector.position.set(3.25, 0.5, 0);
  group.add(detector);
  detector.userData = { id: 'detector', name: 'Faraday Cup Detectors', description: 'Catches the different isotopes in separate cups and counts them.' };

  // Sample Chamber
  const rockGeo = new THREE.DodecahedronGeometry(0.3);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1 });
  const rock = new THREE.Mesh(rockGeo, rockMat);
  rock.position.set(-3.25, 1.5, 0);
  group.add(rock);
  rock.userData = { id: 'sample', name: 'Igneous Rock Sample (e.g. Zircon crystal)', description: 'Contains radioactive parent isotopes (like Uranium-238) which decay into stable daughter isotopes (like Lead-206).' };

  // Ion Beam animation
  const beamGroup = new THREE.Group();
  group.add(beamGroup);

  // U-238 (Parent, Heavy, Red)
  // Pb-206 (Daughter, Lighter, Blue)
  
  const ions = [];
  const uGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const uMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const pbGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const pbMat = new THREE.MeshBasicMaterial({ color: 0x00aaff });

  for(let i=0; i<30; i++) {
    const isUranium = Math.random() > 0.5;
    const mesh = new THREE.Mesh(isUranium ? uGeo : pbGeo, isUranium ? uMat : pbMat);
    mesh.position.set(-3, 0.5, 0);
    beamGroup.add(mesh);
    ions.push({ mesh: mesh, type: isUranium ? 'U' : 'Pb', progress: Math.random() });
  }

  // Display Screen
  const screenGeo = new THREE.PlaneGeometry(3, 2);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 3, 0);
  group.add(screen);
  
  // Graph lines on screen
  const graphGroup = new THREE.Group();
  screen.add(graphGroup);
  
  const uBar = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  uBar.position.set(-0.5, 0, 0.01);
  const pbBar = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1), new THREE.MeshBasicMaterial({ color: 0x00aaff }));
  pbBar.position.set(0.5, 0, 0.01);
  graphGroup.add(uBar, pbBar);
  screen.userData = { id: 'screen', name: 'Isotope Ratio Display', description: 'By measuring the exact ratio of Parent to Daughter isotopes, and knowing the half-life, we can calculate the exact age of the rock.' };

  let halfLifeTimer = 1; // 1 to 0 (1 = 100% parent)

  group.userData.animate = function(delta) {
    const speed = 0.02;
    
    // Half life decay simulation for the graph
    halfLifeTimer -= 0.001;
    if (halfLifeTimer < 0.1) halfLifeTimer = 1;
    
    uBar.scale.y = halfLifeTimer;
    uBar.position.y = -(1 - halfLifeTimer)/2;
    
    pbBar.scale.y = 1 - halfLifeTimer;
    pbBar.position.y = -(halfLifeTimer)/2;

    // Ion flight animation
    ions.forEach(ion => {
      ion.progress += speed;
      if (ion.progress > 1) ion.progress = 0;
      
      const x = -3 + (ion.progress * 6.5);
      let z = 0;
      
      // Inside magnet (x between -1 and 1), bend path
      if (x > -1) {
        // Pb is lighter, bends more
        const bendAmount = ion.type === 'Pb' ? 0.8 : 0.3;
        const progressInMagnet = Math.min((x + 1) / 4.5, 1);
        z = bendAmount * Math.pow(progressInMagnet, 2);
      }
      
      ion.mesh.position.set(x, 0.5, z);
    });
  };

  group.userData.quiz = [
    { question: "What does 'Half-Life' mean in radiometric dating?", options: ["The time it takes for half of the fossil to turn to stone", "The time required for exactly half of the unstable Parent isotopes in a sample to decay into stable Daughter isotopes", "When an animal lives half its normal lifespan"], answer: 1 },
    { question: "Why do we use a Mass Spectrometer to date rocks?", options: ["It counts the number of microscopic rings in the rock", "It separates and counts atoms based on their mass, giving us the exact ratio of parent to daughter isotopes", "It measures how radioactive the rock is using a geiger counter"], answer: 1 }
  ];

  return group;
}
