export function createVenusFlytrapMechanism(THREE) {
  const group = new THREE.Group();

  // 1. Stem / Petiole
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -5, 0),
    new THREE.Vector3(0, -3, 0),
    new THREE.Vector3(0, -1, 0)
  ]);
  const stemGeo = new THREE.TubeGeometry(stemCurve, 16, 0.3, 8, false);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  group.add(stem);
  stem.userData = { id: 'petiole', name: 'Leaf Petiole', description: 'The stalk connecting the trap to the main plant.' };

  // 2. The Trap Leaves (Lobes)
  const hinge = new THREE.Group();
  hinge.position.set(0, -1, 0);
  group.add(hinge);
  
  // Left Lobe
  const lobeGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI);
  // Flatten to make it leaf-like
  lobeGeo.scale(1, 1.2, 0.2);
  
  const outsideMat = new THREE.MeshStandardMaterial({ color: 0x32cd32, side: THREE.DoubleSide });
  // Inside is red to attract insects
  const insideMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, side: THREE.DoubleSide });
  
  const leftLobe = new THREE.Mesh(lobeGeo, outsideMat);
  leftLobe.position.set(-1.8, 1, 0);
  leftLobe.rotation.y = Math.PI / 2;
  leftLobe.rotation.z = Math.PI / 4; // Open angle
  
  const leftInside = new THREE.Mesh(lobeGeo, insideMat);
  leftInside.position.copy(leftLobe.position);
  leftInside.rotation.copy(leftLobe.rotation);
  leftInside.scale.set(0.95, 0.95, 0.95); // Slightly smaller to avoid Z-fighting
  
  hinge.add(leftLobe, leftInside);
  leftInside.userData = { id: 'lobe', name: 'Trap Lobe', description: 'The modified leaf blade. Red anthocyanin pigments attract insects.' };

  // Right Lobe
  const rightLobe = new THREE.Mesh(lobeGeo, outsideMat);
  rightLobe.position.set(1.8, 1, 0);
  rightLobe.rotation.y = -Math.PI / 2;
  rightLobe.rotation.z = -Math.PI / 4; // Open angle
  
  const rightInside = new THREE.Mesh(lobeGeo, insideMat);
  rightInside.position.copy(rightLobe.position);
  rightInside.rotation.copy(rightLobe.rotation);
  rightInside.scale.set(0.95, 0.95, 0.95);
  
  hinge.add(rightLobe, rightInside);

  // 3. Trigger Hairs (Trichomes)
  const hairGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.5);
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  
  // Left hairs
  for(let i=0; i<3; i++) {
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0, (i-1)*0.8);
    hair.rotation.x = Math.PI / 2;
    leftInside.add(hair);
    if(i===0) hair.userData = { id: 'trigger_hair', name: 'Trigger Hair (Trichome)', description: 'Mechanosensors. Touching two hairs within 20 seconds, or one hair twice, triggers the trap.' };
  }
  
  // Right hairs
  for(let i=0; i<3; i++) {
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0, (i-1)*0.8);
    hair.rotation.x = Math.PI / 2;
    rightInside.add(hair);
  }

  // 4. Marginal Spikes (Cilia)
  const ciliaGeo = new THREE.ConeGeometry(0.05, 1, 8);
  const ciliaMat = new THREE.MeshStandardMaterial({ color: 0x90ee90 });
  
  for(let i=0; i<10; i++) {
    const angle = (i/9) * Math.PI;
    const x = Math.cos(angle) * 2;
    const y = Math.sin(angle) * 2.4;
    
    // Left cilia
    const lCilia = new THREE.Mesh(ciliaGeo, ciliaMat);
    lCilia.position.set(x, y, 0);
    lCilia.lookAt(x*2, y*2, 0);
    lCilia.rotation.x = Math.PI / 2;
    leftLobe.add(lCilia);
    if(i===0) lCilia.userData = { id: 'cilia', name: 'Marginal Spikes (Cilia)', description: 'Interlock when the trap closes to form a cage, preventing the prey from escaping.' };
    
    // Right cilia
    const rCilia = new THREE.Mesh(ciliaGeo, ciliaMat);
    rCilia.position.set(x, y, 0);
    rCilia.lookAt(x*2, y*2, 0);
    rCilia.rotation.x = Math.PI / 2;
    rightLobe.add(rCilia);
  }

  // 5. The Prey (Fly)
  const flyGeo = new THREE.SphereGeometry(0.2);
  const flyMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const fly = new THREE.Mesh(flyGeo, flyMat);
  fly.position.set(0, 5, 0);
  group.add(fly);

  // Wings
  const wingGeo = new THREE.PlaneGeometry(0.3, 0.1);
  const wingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const w1 = new THREE.Mesh(wingGeo, wingMat);
  w1.position.set(0.2, 0.1, 0);
  const w2 = new THREE.Mesh(wingGeo, wingMat);
  w2.position.set(-0.2, 0.1, 0);
  fly.add(w1, w2);
  fly.userData = { id: 'prey', name: 'Insect Prey', description: 'Provides essential nutrients like nitrogen and phosphorus that are missing from the boggy soil the plant grows in.' };

  let state = 'waiting'; // waiting, triggered, closed, digesting
  let timer = 0;
  let closedAngle = 0; // 0 is open, 1 is closed

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;
    
    if (state === 'waiting') {
      // Fly buzzing around
      fly.position.x = Math.sin(t*0.5) * 3;
      fly.position.y = 2 + Math.cos(t*0.7) * 2;
      fly.position.z = Math.sin(t*0.3) * 3;
      
      // Fly wings flap
      w1.rotation.x = Math.sin(t*10);
      w2.rotation.x = -Math.sin(t*10);
      
      // If fly lands on trap
      if (fly.position.distanceTo(new THREE.Vector3(0, 1, 0)) < 1.0 && Math.random() < 0.05) {
        state = 'triggered';
        fly.position.set(0, 1, 0); // Trapped in center
      }
    } else if (state === 'triggered') {
      // Snap shut (Thigmonasty)
      closedAngle += 0.1;
      if (closedAngle >= 1) {
        closedAngle = 1;
        state = 'closed';
        timer = 0;
      }
    } else if (state === 'closed') {
      timer++;
      // Fly struggling
      fly.position.x = (Math.random()-0.5)*0.1;
      fly.position.z = (Math.random()-0.5)*0.1;
      
      if (timer > 100) {
        state = 'digesting';
        timer = 0;
      }
    } else if (state === 'digesting') {
      timer++;
      // Digestive enzymes dissolving fly
      fly.scale.setScalar(1 - (timer/200));
      
      if (timer > 200) {
        state = 'waiting';
        closedAngle = 0; // Reopen immediately for animation loop
        fly.scale.setScalar(1);
        fly.position.set(0, 5, 0);
      }
    }
    
    // Apply angle to lobes
    const angleRad = THREE.MathUtils.lerp(Math.PI/4, 0.1, closedAngle);
    leftLobe.rotation.z = angleRad;
    leftInside.rotation.z = angleRad;
    
    rightLobe.rotation.z = -angleRad;
    rightInside.rotation.z = -angleRad;
    
    // Animate stems swaying slightly
    stem.rotation.z = Math.sin(t*0.2) * 0.05;
    hinge.rotation.z = stem.rotation.z;
  };

  group.userData.quiz = [
    { question: "Why does the Venus Flytrap digest insects?", options: ["Because it hates bugs", "To get energy (calories)", "To obtain nitrogen and phosphorus missing from its native poor, acidic soil"], answer: 2 },
    { question: "How does the plant avoid wasting energy closing on a piece of falling debris (like a leaf)?", options: ["It has eyes", "It requires two trigger hairs to be touched within 20 seconds", "It can smell the difference"], answer: 1 }
  ];

  return group;
}
