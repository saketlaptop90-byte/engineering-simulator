export function createPillCoatingDrum(THREE) {
  const group = new THREE.Group();

  // 1. Coating Pan (Drum)
  const panGeo = new THREE.SphereGeometry(5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.75);
  const panMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
  const pan = new THREE.Mesh(panGeo, panMat);
  pan.rotation.x = -Math.PI / 4;
  pan.userData = { id: 'drum', name: 'Coating Pan', description: 'Rotating drum that tumbles the tablet bed.' };
  group.add(pan);

  // 2. Drive Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 4);
  const shaftMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9 });
  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.position.set(0, -3.5, -3.5);
  shaft.rotation.x = Math.PI / 4;
  group.add(shaft);
  shaft.userData = { id: 'shaft', name: 'Drive Motor Shaft', description: 'Spins the pan at a controlled RPM.' };

  // 3. Spray Guns Manifold
  const manifoldGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
  const manifoldMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const manifold = new THREE.Mesh(manifoldGeo, manifoldMat);
  manifold.position.set(0, 1, 1);
  manifold.rotation.z = Math.PI / 2;
  group.add(manifold);
  manifold.userData = { id: 'manifold', name: 'Spray Gun Manifold', description: 'Delivers the coating solution.' };

  // 4. Spray Guns
  const gunGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
  const gunMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  for(let i=-1.5; i<=1.5; i+=1.5) {
    const gun = new THREE.Mesh(gunGeo, gunMat);
    gun.position.set(i, 0.6, 1.2);
    gun.rotation.x = Math.PI / 4;
    group.add(gun);
    gun.userData = { id: `gun_${i}`, name: 'Atomizing Spray Gun', description: 'Breaks coating liquid into fine droplets.' };
  }

  // 5. Coating Spray Cone
  const coneGeo = new THREE.ConeGeometry(1, 3, 16);
  const coneMat = new THREE.MeshBasicMaterial({ color: 0xffaaaa, transparent: true, opacity: 0.4 });
  for(let i=-1.5; i<=1.5; i+=1.5) {
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(i, -1, 0);
    cone.rotation.x = -Math.PI / 4;
    group.add(cone);
    cone.userData = { id: `spray_${i}`, name: 'Atomized Spray', description: 'Fine mist of polymer coating hitting the tablets.' };
  }

  // 6. Tablet Bed (Mass of tablets)
  const bedPivot = new THREE.Group();
  bedPivot.rotation.x = -Math.PI / 4;
  group.add(bedPivot);
  
  const bedGeo = new THREE.SphereGeometry(4.8, 32, 16, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4);
  const bedMat = new THREE.MeshStandardMaterial({ color: 0xffaaaa, roughness: 0.8, side: THREE.DoubleSide });
  const tabletBed = new THREE.Mesh(bedGeo, bedMat);
  bedPivot.add(tabletBed);
  tabletBed.userData = { id: 'tablet_bed', name: 'Tablet Bed', description: 'Thousands of cascading tablets receiving the coating.' };

  // 7. Baffles
  const baffleGeo = new THREE.PlaneGeometry(2, 4);
  const baffleMat = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });
  for(let i=0; i<4; i++) {
    const baffle = new THREE.Mesh(baffleGeo, baffleMat);
    baffle.position.set(0, 0, -4);
    baffle.rotation.x = Math.PI / 2;
    
    const bafflePivot = new THREE.Group();
    bafflePivot.rotation.y = (Math.PI / 2) * i;
    bafflePivot.add(baffle);
    pan.add(bafflePivot);
    baffle.userData = { id: `baffle_${i}`, name: 'Mixing Baffle', description: 'Ensures even tumbling and prevents tablets from sliding.' };
  }

  // 8. Air Inlet Duct
  const ductGeo = new THREE.CylinderGeometry(1, 1, 3);
  const ductMat = new THREE.MeshStandardMaterial({ color: 0x5555ff });
  const inlet = new THREE.Mesh(ductGeo, ductMat);
  inlet.position.set(-4, 3, 2);
  inlet.rotation.z = Math.PI / 4;
  group.add(inlet);
  inlet.userData = { id: 'inlet', name: 'Hot Air Inlet', description: 'Supplies heated drying air.' };

  // 9. Exhaust Plenum
  const exhaustGeo = new THREE.BoxGeometry(3, 2, 2);
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xff5555 });
  const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
  exhaust.position.set(0, -4, 2);
  group.add(exhaust);
  exhaust.userData = { id: 'exhaust', name: 'Exhaust Plenum', description: 'Pulls moist air out through the perforated drum.' };

  // 10. Frame/Housing Base
  const frameGeo = new THREE.BoxGeometry(6, 1, 6);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const base = new THREE.Mesh(frameGeo, frameMat);
  base.position.set(0, -5, 0);
  group.add(base);
  base.userData = { id: 'base', name: 'Support Frame', description: 'Vibration-damping foundation.' };

  group.userData.animate = function(delta) {
    pan.rotation.z += 0.02;
    // Tablet bed stays mostly at bottom but oscillates slightly
    bedPivot.rotation.z = Math.sin(Date.now() * 0.005) * 0.1;
  };

  group.userData.quiz = [
    { question: "Why is hot air blown through the coating pan?", options: ["To melt the tablets", "To evaporate the solvent/water in the coating spray", "To sterilize the machine"], answer: 1 },
    { question: "What do the baffles inside the drum do?", options: ["Heat the tablets", "Prevent tablets from sticking together by tumbling them", "Crush defective tablets"], answer: 1 }
  ];

  return group;
}
