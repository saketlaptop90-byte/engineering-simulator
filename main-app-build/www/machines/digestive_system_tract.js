export function createDigestiveSystem(THREE) {
  const group = new THREE.Group();

  const muscleMat = new THREE.MeshStandardMaterial({ color: 0xc87b7b, roughness: 0.8 });
  const acidMat = new THREE.MeshBasicMaterial({ color: 0x88cc22, transparent: true, opacity: 0.6 });
  const intestineMat = new THREE.MeshStandardMaterial({ color: 0xdca99b, roughness: 0.9 });
  const largeIntestineMat = new THREE.MeshStandardMaterial({ color: 0xa87c6b, roughness: 0.9 });
  const liverMat = new THREE.MeshStandardMaterial({ color: 0x8b3a3a, roughness: 0.7 });

  // 1. Esophagus
  const esoGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
  const esophagus = new THREE.Mesh(esoGeo, muscleMat);
  esophagus.position.set(0, 5, 0);
  group.add(esophagus);
  esophagus.userData = { id: 'esophagus', name: 'Esophagus', description: 'Uses muscular contractions (peristalsis) to push food from the mouth down to the stomach.' };

  // 2. Stomach
  const stomachGroup = new THREE.Group();
  stomachGroup.position.set(0.5, 2.5, 0);
  group.add(stomachGroup);

  const stomachGeo = new THREE.SphereGeometry(1.5, 32, 32);
  // Deform into J-shape
  const positions = stomachGeo.attributes.position;
  for(let i=0; i<positions.count; i++) {
    let x = positions.getX(i);
    let y = positions.getY(i);
    let z = positions.getZ(i);
    if(x < 0) y -= 0.5; // pull bottom left down
    positions.setXYZ(i, x, y, z);
  }
  stomachGeo.computeVertexNormals();
  const stomach = new THREE.Mesh(stomachGeo, muscleMat);
  stomach.rotation.z = Math.PI / 4;
  stomachGroup.add(stomach);
  stomach.userData = { id: 'stomach', name: 'Stomach', description: 'Churns food and mixes it with Hydrochloric acid (pH 2) and pepsin enzymes to digest proteins.' };

  // Acid pool inside stomach (visualized via cutaway if we wanted, but we'll place it slightly poking through or use opacity)
  stomach.material.transparent = true;
  stomach.material.opacity = 0.8;
  
  const acidPool = new THREE.Mesh(new THREE.SphereGeometry(1.2), acidMat);
  acidPool.position.y = -0.3;
  stomachGroup.add(acidPool);

  // 3. Liver & Gallbladder
  const liverGeo = new THREE.SphereGeometry(2, 32, 16);
  liverGeo.scale(1.5, 1, 0.8);
  const liver = new THREE.Mesh(liverGeo, liverMat);
  liver.position.set(-2, 3.5, 0.5);
  liver.rotation.z = -Math.PI / 8;
  group.add(liver);
  liver.userData = { id: 'liver', name: 'Liver', description: 'Produces bile to emulsify fats, detoxifies blood, and stores glycogen.' };

  const gb = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
  gb.position.set(-1.5, 2.5, 1);
  group.add(gb);
  gb.userData = { id: 'gallbladder', name: 'Gallbladder', description: 'Stores bile from the liver and releases it into the small intestine after a fatty meal.' };

  // 4. Small Intestine (Coiled)
  const siGroup = new THREE.Group();
  siGroup.position.set(0, -1, 0);
  group.add(siGroup);

  const siCurve = new THREE.CurvePath();
  // Generate random winding path
  let currentPt = new THREE.Vector3(1.5, 1.5, 0); // start at stomach exit
  for(let i=0; i<15; i++) {
    const nextPt = new THREE.Vector3(
      (Math.random()-0.5)*3,
      1 - (i*0.2), // moving down
      (Math.random()-0.5)*2
    );
    siCurve.add(new THREE.LineCurve3(currentPt, nextPt));
    currentPt = nextPt;
  }
  // Connect to large intestine
  siCurve.add(new THREE.LineCurve3(currentPt, new THREE.Vector3(-2, -2, 0)));

  const siTube = new THREE.Mesh(new THREE.TubeGeometry(siCurve, 64, 0.3, 16, false), intestineMat);
  siGroup.add(siTube);
  siTube.userData = { id: 'small_intestine', name: 'Small Intestine', description: 'The longest section (6 meters). Chemical digestion is completed here, and 90% of nutrient absorption occurs through microscopic villi.' };

  // 5. Large Intestine (Colon) wrapping around
  const liCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2, -2, 0), // cecum
    new THREE.Vector3(-2, 1, 0),  // ascending
    new THREE.Vector3(2, 1, 0),   // transverse
    new THREE.Vector3(2, -2, 0),  // descending
    new THREE.Vector3(0, -3, 0),  // sigmoid
    new THREE.Vector3(0, -4, 0)   // rectum
  ]);
  // Use Torus or bumpy geometry for the segments (haustra)
  const liGeo = new THREE.TubeGeometry(liCurve, 64, 0.5, 16, false);
  const li = new THREE.Mesh(liGeo, largeIntestineMat);
  siGroup.add(li);
  li.userData = { id: 'large_intestine', name: 'Large Intestine (Colon)', description: 'Absorbs water and electrolytes, forming solid feces. Houses billions of beneficial gut bacteria.' };

  // Appendix
  const appendix = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5), largeIntestineMat);
  appendix.position.set(-2, -2.5, 0);
  siGroup.add(appendix);

  // Food Bolus Animation
  const foodGeo = new THREE.SphereGeometry(0.25);
  const foodMat = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
  const bolus = new THREE.Mesh(foodGeo, foodMat);
  group.add(bolus);

  let foodProgress = 0; // 0 to 100

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;
    
    // Peristalsis animation on esophagus
    esophagus.scale.x = 1 + Math.sin(t*5)*0.1;
    esophagus.scale.z = 1 + Math.sin(t*5)*0.1;

    // Churning stomach
    stomach.rotation.z = Math.PI/4 + Math.sin(t*2)*0.1;
    acidPool.scale.setScalar(1 + Math.sin(t*3)*0.05);

    // Food routing
    foodProgress += 0.1;
    if (foodProgress > 100) foodProgress = 0;

    if (foodProgress < 20) {
      // Down esophagus
      const p = foodProgress / 20; // 0 to 1
      bolus.position.set(0, 7 - (p * 4), 0);
      bolus.scale.setScalar(1);
    } else if (foodProgress < 40) {
      // In stomach
      bolus.position.set(0.5, 2.5, 0);
      // turn to liquid chyme
      bolus.scale.setScalar(1 - ((foodProgress-20)/20)*0.5);
      bolus.material.color.setHex(0x88cc22); // match acid
    } else if (foodProgress < 80) {
      // Small Intestine
      const p = (foodProgress - 40) / 40;
      siCurve.getPointAt(p, bolus.position);
      bolus.position.y -= 1; // offset for siGroup
      bolus.scale.setScalar(0.5);
    } else {
      // Large Intestine
      const p = (foodProgress - 80) / 20;
      liCurve.getPointAt(p, bolus.position);
      bolus.position.y -= 1;
      // turn brown
      bolus.material.color.setHex(0x5c4033);
      bolus.scale.setScalar(1); // solidifying
    }
  };

  group.userData.quiz = [
    { question: "Where does the majority of nutrient absorption take place?", options: ["The Stomach", "The Small Intestine", "The Large Intestine"], answer: 1 },
    { question: "What is the primary function of the Large Intestine?", options: ["To digest proteins", "To absorb water and form solid waste", "To produce bile"], answer: 1 }
  ];

  return group;
}
