export function createRespiratorySystem(THREE) {
  const group = new THREE.Group();

  const tissueMat = new THREE.MeshStandardMaterial({ color: 0xffaaaa, roughness: 0.8, transparent: true, opacity: 0.9 });
  const cartilageMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.5 });
  const muscleMat = new THREE.MeshStandardMaterial({ color: 0xcc4444 });

  // 1. Trachea (Windpipe)
  const tracheaGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
  const trachea = new THREE.Mesh(tracheaGeo, tissueMat);
  trachea.position.y = 4;
  group.add(trachea);
  
  // Cartilage rings
  for(let i=0; i<8; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 8, 16), cartilageMat);
    ring.position.set(0, 2.7 + i*0.35, 0);
    ring.rotation.x = Math.PI/2;
    group.add(ring);
  }
  trachea.userData = { id: 'trachea', name: 'Trachea (Windpipe)', description: 'Lined with c-shaped cartilage rings to keep the airway open during pressure changes.' };

  // 2. Bronchi (Left and Right)
  const bronchusGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.5);
  
  const rightBronchus = new THREE.Mesh(bronchusGeo, tissueMat);
  rightBronchus.position.set(-0.6, 2.1, 0);
  rightBronchus.rotation.z = Math.PI / 4;
  group.add(rightBronchus);

  const leftBronchus = new THREE.Mesh(bronchusGeo, tissueMat);
  leftBronchus.position.set(0.6, 2.1, 0);
  leftBronchus.rotation.z = -Math.PI / 4;
  group.add(leftBronchus);

  // 3. Lungs
  const lungGeo = new THREE.SphereGeometry(2, 32, 32);
  lungGeo.scale(0.8, 1.4, 1); // Elongate and flatten slightly
  
  const lungGroup = new THREE.Group();
  group.add(lungGroup);

  const rightLung = new THREE.Mesh(lungGeo, tissueMat);
  rightLung.position.set(-2, 0, 0);
  // Shape the lung slightly (3 lobes on right)
  const rightCut = new THREE.Mesh(new THREE.BoxGeometry(4,4,4));
  rightCut.position.set(-0.5, 0, 0);
  lungGroup.add(rightLung);
  rightLung.userData = { id: 'right_lung', name: 'Right Lung (3 Lobes)', description: 'Slightly larger than the left lung, divided into superior, middle, and inferior lobes.' };

  const leftLung = new THREE.Mesh(lungGeo, tissueMat);
  leftLung.position.set(2, 0, 0);
  // Cardiac notch (make room for heart)
  const notchGeo = new THREE.SphereGeometry(1);
  // Just visually simulating the notch by scaling
  lungGroup.add(leftLung);
  leftLung.userData = { id: 'left_lung', name: 'Left Lung (2 Lobes)', description: 'Smaller to make room for the heart (the cardiac notch).' };

  // 4. Diaphragm
  const diaphragmGeo = new THREE.SphereGeometry(3.5, 32, 16, 0, Math.PI*2, 0, Math.PI/3);
  const diaphragm = new THREE.Mesh(diaphragmGeo, muscleMat);
  diaphragm.position.set(0, -2.5, 0);
  diaphragm.scale.y = 0.5; // flatten dome
  group.add(diaphragm);
  diaphragm.userData = { id: 'diaphragm', name: 'Diaphragm Muscle', description: 'When it contracts (moves down), it creates a vacuum in the chest cavity, pulling air into the lungs.' };

  // 5. Alveoli inset (Zoomed in view in a bubble)
  const bubbleGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
  const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
  bubble.position.set(4, 3, 2);
  group.add(bubble);
  
  const alveoli = new THREE.Group();
  bubble.add(alveoli);
  for(let i=0; i<10; i++) {
    const alv = new THREE.Mesh(new THREE.SphereGeometry(0.3), tissueMat);
    alv.position.set((Math.random()-0.5)*1, (Math.random()-0.5)*1, (Math.random()-0.5)*1);
    alveoli.add(alv);
  }
  // Capillaries on alveoli
  const capGeo = new THREE.TorusGeometry(0.32, 0.02, 8, 16);
  for(let i=0; i<10; i++) {
    const cap1 = new THREE.Mesh(capGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    cap1.position.copy(alveoli.children[i].position);
    cap1.rotation.x = Math.random()*Math.PI;
    const cap2 = new THREE.Mesh(capGeo, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    cap2.position.copy(alveoli.children[i].position);
    cap2.rotation.y = Math.random()*Math.PI;
    alveoli.add(cap1, cap2);
  }
  
  // Line connecting lung to bubble
  const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2, 1, 0), new THREE.Vector3(4, 3, 2)]);
  const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff }));
  group.add(line);

  bubble.userData = { id: 'alveoli', name: 'Alveoli & Capillaries', description: 'Millions of tiny air sacs where gas exchange occurs. O2 enters the blood (red), CO2 leaves the blood (blue) to be exhaled.' };

  // Particle simulation for breathing
  const o2Geo = new THREE.SphereGeometry(0.05);
  const o2Mat = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // O2 is cyan here
  const co2Mat = new THREE.MeshBasicMaterial({ color: 0x555555 }); // CO2 is gray
  
  const airParticles = new THREE.Group();
  group.add(airParticles);
  const particles = [];

  for(let i=0; i<50; i++) {
    const p = new THREE.Mesh(o2Geo, o2Mat);
    airParticles.add(p);
    particles.push({ mesh: p, offset: Math.random() });
  }

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.0015;
    
    // Breathing cycle (sin wave)
    // t ranges from -1 to 1. 
    // -1 to 1 = inspiration
    // 1 to -1 = expiration
    const breath = Math.sin(t);
    
    // Lungs expand and contract
    // lung scale from 1.0 to 1.2
    const lScale = 1.0 + (breath + 1) * 0.1;
    lungGroup.scale.set(lScale, lScale, lScale);
    
    // Diaphragm moves up and down
    // When lungs expand (breath=1), diaphragm moves DOWN (contracts)
    diaphragm.position.y = -2.5 - (breath * 0.5);
    
    // Alveoli expand
    alveoli.scale.set(lScale, lScale, lScale);

    // Particles moving through trachea
    particles.forEach((p, index) => {
      // breath > 0 means inhaling, breath < 0 means exhaling
      const phase = (t * 0.5 + p.offset) % 1; // 0 to 1
      
      if (Math.sin(t) > 0) {
        // Inhaling (O2 moving down)
        p.mesh.material = o2Mat;
        p.mesh.position.y = 5.5 - (phase * 6); // Move from y=5.5 to y=-0.5
        const xSpread = phase * 2;
        p.mesh.position.x = Math.sin(index) * xSpread;
        p.mesh.position.z = Math.cos(index) * xSpread;
      } else {
        // Exhaling (CO2 moving up)
        p.mesh.material = co2Mat;
        p.mesh.position.y = -0.5 + (phase * 6); // Move from y=-0.5 to y=5.5
        const xSpread = (1-phase) * 2;
        p.mesh.position.x = Math.sin(index) * xSpread;
        p.mesh.position.z = Math.cos(index) * xSpread;
      }
    });
  };

  group.userData.quiz = [
    { question: "What happens to the diaphragm when you inhale?", options: ["It relaxes and moves up", "It contracts and moves downward, creating a vacuum that pulls air in", "It rapidly vibrates"], answer: 1 },
    { question: "Where does the actual exchange of Oxygen and Carbon Dioxide occur?", options: ["In the trachea", "In the bronchi", "In the alveoli (microscopic air sacs)"], answer: 2 }
  ];

  return group;
}
