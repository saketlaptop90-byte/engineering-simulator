export function createHumanHeart(THREE) {
  const group = new THREE.Group();

  // Create a stylized beating heart
  const heartGroup = new THREE.Group();
  group.add(heartGroup);

  const muscleMat = new THREE.MeshStandardMaterial({ color: 0xaa2222, roughness: 0.6 });
  const veinMat = new THREE.MeshStandardMaterial({ color: 0x2222aa, roughness: 0.4 });
  const arteryMat = new THREE.MeshStandardMaterial({ color: 0xcc1111, roughness: 0.4 });

  // Main body (Ventricles)
  const ventricleGeo = new THREE.SphereGeometry(2, 32, 32);
  ventricleGeo.scale(1, 1.2, 0.8);
  const ventricles = new THREE.Mesh(ventricleGeo, muscleMat);
  ventricles.position.y = -0.5;
  // Make it slightly asymmetrical like a real heart (left ventricle is larger/thicker)
  ventricles.rotation.z = Math.PI / 12;
  heartGroup.add(ventricles);

  // Atria (Upper chambers)
  const rightAtrium = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), muscleMat);
  rightAtrium.position.set(-1.2, 1.2, 0);
  heartGroup.add(rightAtrium);
  rightAtrium.userData = { id: 'right_atrium', name: 'Right Atrium', description: 'Receives deoxygenated blood from the body via the vena cava.' };

  const leftAtrium = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), muscleMat);
  leftAtrium.position.set(1.2, 1.5, -0.5);
  heartGroup.add(leftAtrium);
  leftAtrium.userData = { id: 'left_atrium', name: 'Left Atrium', description: 'Receives oxygenated blood from the lungs via the pulmonary veins.' };

  ventricles.userData = { id: 'ventricles', name: 'Left & Right Ventricles', description: 'The powerful lower chambers. The right pumps to the lungs, the left pumps to the entire body.' };

  // Superior Vena Cava (Blue, coming in top right)
  const svcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.2, 1.5, 0),
    new THREE.Vector3(-1.5, 3, 0),
    new THREE.Vector3(-1.5, 4, 0)
  ]);
  const svc = new THREE.Mesh(new THREE.TubeGeometry(svcCurve, 16, 0.5, 8, false), veinMat);
  heartGroup.add(svc);

  // Aorta (Red, arching out top center)
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, 1.5, 0),
    new THREE.Vector3(0.5, 3.5, 0),
    new THREE.Vector3(-1, 4, -1),
    new THREE.Vector3(-2, 3, -1)
  ]);
  const aorta = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 32, 0.6, 16, false), arteryMat);
  heartGroup.add(aorta);
  aorta.userData = { id: 'aorta', name: 'Aorta', description: 'The largest artery in the body. Carries high-pressure oxygenated blood from the left ventricle to the body.' };

  // Pulmonary Artery (Blue, because it goes to lungs, even though it's an artery)
  const paCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, 1.5, 0.5),
    new THREE.Vector3(-0.5, 2.5, 1),
    new THREE.Vector3(1.5, 3, 1),
    new THREE.Vector3(2.5, 2.5, 1)
  ]);
  const pulmArtery = new THREE.Mesh(new THREE.TubeGeometry(paCurve, 32, 0.5, 16, false), veinMat);
  heartGroup.add(pulmArtery);
  pulmArtery.userData = { id: 'pulmonary_artery', name: 'Pulmonary Artery', description: 'Carries deoxygenated blood from the right ventricle to the lungs to pick up oxygen.' };

  // Blood Particles Simulation (Red and Blue cells)
  const bloodGroup = new THREE.Group();
  group.add(bloodGroup);

  const rbcGeo = new THREE.TorusGeometry(0.08, 0.04, 8, 16); // Biconcave disc shape roughly
  
  const cells = [];
  
  // Create blood flow through aorta (Red)
  for(let i=0; i<20; i++) {
    const c = new THREE.Mesh(rbcGeo, arteryMat);
    bloodGroup.add(c);
    cells.push({ mesh: c, path: aortaCurve, progress: Math.random(), speed: 0.01 + Math.random()*0.005 });
  }

  // Create blood flow through Pulmonary Artery (Blue)
  for(let i=0; i<15; i++) {
    const c = new THREE.Mesh(rbcGeo, veinMat);
    bloodGroup.add(c);
    cells.push({ mesh: c, path: paCurve, progress: Math.random(), speed: 0.01 + Math.random()*0.005 });
  }

  // Create blood flow entering Superior Vena Cava (Blue)
  for(let i=0; i<15; i++) {
    const c = new THREE.Mesh(rbcGeo, veinMat);
    bloodGroup.add(c);
    // Reverse path for SVC
    cells.push({ mesh: c, path: svcCurve, progress: Math.random(), speed: -(0.01 + Math.random()*0.005) });
  }

  // Heartbeat state
  let beatTime = 0;
  const bpm = 70; // Beats per minute
  const bps = bpm / 60;

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;
    beatTime += delta * bps;
    
    // Heartbeat animation (Systole and Diastole)
    // A heartbeat has two main phases: lub (atria contract, then ventricles contract) - dub (relax)
    
    // We use a mathematical pulse function to simulate the "lub-dub"
    const cycle = beatTime % 1; // 0 to 1
    let scale = 1.0;
    let atriumScale = 1.0;

    if (cycle < 0.1) {
      // Atrial systole (atria squeeze)
      atriumScale = 1.0 - (Math.sin(cycle * Math.PI * 10) * 0.15);
    } else if (cycle > 0.15 && cycle < 0.4) {
      // Ventricular systole (ventricles squeeze hard)
      const vCycle = (cycle - 0.15) / 0.25;
      scale = 1.0 - (Math.sin(vCycle * Math.PI) * 0.15);
      
      // Pulse blood faster during systole
      cells.forEach(c => c.progress += Math.abs(c.speed) * 2 * Math.sign(c.speed));
    } else {
      // Diastole (relax and fill)
      scale = 1.0;
      atriumScale = 1.0;
    }

    ventricles.scale.set(1 * scale, 1.2 * scale, 0.8 * scale);
    rightAtrium.scale.setScalar(atriumScale);
    leftAtrium.scale.setScalar(atriumScale);

    // Animate blood cells
    cells.forEach(c => {
      c.progress += c.speed;
      if (c.progress > 1) c.progress = 0;
      if (c.progress < 0) c.progress = 1;
      
      c.path.getPointAt(c.progress, c.mesh.position);
      // add some jitter
      c.mesh.position.x += (Math.random()-0.5)*0.2;
      c.mesh.position.y += (Math.random()-0.5)*0.2;
      c.mesh.position.z += (Math.random()-0.5)*0.2;
      
      c.mesh.rotation.x += 0.1;
      c.mesh.rotation.y += 0.05;
    });
  };

  group.userData.quiz = [
    { question: "Which chamber of the heart pumps oxygenated blood to the entire body?", options: ["Right Atrium", "Right Ventricle", "Left Ventricle"], answer: 2 },
    { question: "True or False: All arteries carry oxygenated (red) blood.", options: ["True", "False (The Pulmonary Artery carries deoxygenated blood to the lungs)"], answer: 1 }
  ];

  return group;
}
