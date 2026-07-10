export function createTRexSkeletonAssembly(THREE) {
  const group = new THREE.Group();

  const boneMat = new THREE.MeshStandardMaterial({ color: 0xeeddcc, roughness: 0.8 });

  // Simplified T. Rex Skeleton Construction
  
  // 1. Skull
  const skull = new THREE.Group();
  skull.position.set(3, 4, 0);
  
  const cranium = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.8), boneMat);
  const upperJaw = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.6), boneMat);
  upperJaw.position.set(1.15, -0.25, 0);
  const lowerJaw = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 0.5), boneMat);
  lowerJaw.position.set(1.1, -0.65, 0);
  // Teeth
  const toothGeo = new THREE.ConeGeometry(0.05, 0.2);
  for(let i=0; i<5; i++) {
    const t = new THREE.Mesh(toothGeo, boneMat);
    t.position.set(0.6 + i*0.2, -0.6, 0.3);
    t.rotation.x = Math.PI;
    upperJaw.add(t);
  }
  
  skull.add(cranium, upperJaw, lowerJaw);
  group.add(skull);
  skull.userData = { id: 'skull', name: 'Tyrannosaurus Rex Skull', description: 'Massive bite force estimated at 12,800 pounds, capable of crushing bone.' };

  // 2. Neck (Cervical vertebrae)
  const neckCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.5, 3.8, 0),
    new THREE.Vector3(1.5, 3, 0),
    new THREE.Vector3(0.5, 3.2, 0)
  ]);
  const neck = new THREE.Mesh(new THREE.TubeGeometry(neckCurve, 8, 0.3, 8, false), boneMat);
  group.add(neck);

  // 3. Ribcage & Spine (Dorsal vertebrae)
  const torso = new THREE.Group();
  torso.position.set(0, 3, 0);
  group.add(torso);
  
  const spineGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
  const spine = new THREE.Mesh(spineGeo, boneMat);
  spine.rotation.z = Math.PI / 2;
  torso.add(spine);
  spine.userData = { id: 'spine', name: 'Spinal Column', description: 'Supported the massive weight of the animal horizontally like a seesaw.' };

  const ribGeo = new THREE.TorusGeometry(0.8, 0.1, 8, 16, Math.PI);
  for(let i=-1.5; i<=1.5; i+=0.5) {
    const rib = new THREE.Mesh(ribGeo, boneMat);
    rib.position.set(i, 0, 0);
    rib.rotation.y = Math.PI / 2;
    torso.add(rib);
  }

  // 4. Tiny Arms (Forelimbs)
  const armGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.8);
  const armL = new THREE.Mesh(armGeo, boneMat);
  armL.position.set(1, 2, 0.8);
  armL.rotation.x = Math.PI / 4;
  armL.rotation.z = -Math.PI / 4;
  
  const armR = new THREE.Mesh(armGeo, boneMat);
  armR.position.set(1, 2, -0.8);
  armR.rotation.x = -Math.PI / 4;
  armR.rotation.z = -Math.PI / 4;
  
  group.add(armL, armR);
  armL.userData = { id: 'arms', name: 'Vestigial Forelimbs', description: 'Only about 1 meter long with two functional digits, but heavily muscled.' };

  // 5. Pelvis
  const pelvisGeo = new THREE.BoxGeometry(1, 1, 1);
  const pelvis = new THREE.Mesh(pelvisGeo, boneMat);
  pelvis.position.set(-2, 3, 0);
  group.add(pelvis);

  // 6. Legs (Hind limbs)
  const createLeg = (zDir) => {
    const leg = new THREE.Group();
    // Femur
    const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 2), boneMat);
    femur.position.set(0, -1, zDir*0.2);
    femur.rotation.z = -Math.PI / 8;
    // Tibia/Fibula
    const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 1.8), boneMat);
    tibia.position.set(0.2, -2.5, zDir*0.2);
    tibia.rotation.z = Math.PI / 8;
    // Foot (Metatarsals)
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.4), boneMat);
    foot.position.set(0.5, -3.3, zDir*0.2);
    
    leg.add(femur, tibia, foot);
    leg.position.set(-2, 3, zDir*0.8);
    return leg;
  };

  const leftLeg = createLeg(1);
  const rightLeg = createLeg(-1);
  group.add(leftLeg, rightLeg);
  leftLeg.userData = { id: 'hind_limbs', name: 'Massive Hind Limbs', description: 'Adapted for supporting weight and quick bursts of speed up to 25 km/h.' };

  // 7. Tail (Caudal vertebrae)
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.5, 3, 0),
    new THREE.Vector3(-4.5, 3.2, 0),
    new THREE.Vector3(-6.5, 2.5, 0)
  ]);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 16, 0.25, 8, false), boneMat);
  group.add(tail);
  tail.userData = { id: 'tail', name: 'Tail', description: 'Acted as a heavy counterweight to the massive skull, pivoting on the hips.' };

  // 8. Ground / Museum Display
  const baseGeo = new THREE.BoxGeometry(12, 0.5, 6);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(-1, -0.5, 0);
  group.add(base);

  const displayPoles = new THREE.Group();
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
  const p1 = new THREE.Mesh(poleGeo, poleMat);
  p1.position.set(0, 1.5, 0);
  const p2 = new THREE.Mesh(poleGeo, poleMat);
  p2.position.set(-2, 1.5, 0);
  const p3 = new THREE.Mesh(poleGeo, poleMat);
  p3.position.set(-5, 1.5, 0);
  displayPoles.add(p1, p2, p3);
  group.add(displayPoles);

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.002;
    // Breathing/idle animation
    torso.rotation.z = Math.sin(t) * 0.02;
    skull.rotation.z = Math.sin(t + 1) * 0.05;
    lowerJaw.rotation.z = Math.sin(t * 2) * 0.1;
    tail.rotation.y = Math.cos(t * 0.5) * 0.05;
  };

  group.userData.quiz = [
    { question: "During which period did the Tyrannosaurus Rex actually live?", options: ["Jurassic", "Triassic", "Late Cretaceous"], answer: 2 },
    { question: "Why do scientists believe T. Rex had such a massive tail?", options: ["To swat away flies", "To act as a heavy counterweight to its enormous skull, keeping it balanced on two legs", "To swim like a crocodile"], answer: 1 }
  ];

  return group;
}
