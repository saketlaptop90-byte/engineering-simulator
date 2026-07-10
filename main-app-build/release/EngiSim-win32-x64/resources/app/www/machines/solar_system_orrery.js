export function createSolarSystemOrrery(THREE) {
  const group = new THREE.Group();
  
  // 1. Base Stand
  const baseGeo = new THREE.CylinderGeometry(4, 5, 1, 32);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -5;
  base.userData = { id: 'base', name: 'Brass Stand', description: 'Supports the entire orrery mechanism.' };
  group.add(base);

  // 2. Central Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
  const shaftMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.position.y = 0;
  shaft.userData = { id: 'shaft', name: 'Central Drive Shaft', description: 'Transmits rotation to planetary arms.' };
  group.add(shaft);

  // 3. The Sun
  const sunGeo = new THREE.SphereGeometry(2.5, 32, 32);
  const sunMat = new THREE.MeshStandardMaterial({ color: 0xff8c00, emissive: 0xff4500, emissiveIntensity: 0.8 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.y = 5;
  sun.userData = { id: 'sun', name: 'The Sun', description: 'Central star represented by a glowing sphere.' };
  group.add(sun);

  // 4. Earth Arm
  const armGeo = new THREE.BoxGeometry(8, 0.2, 0.5);
  const armMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5 });
  const earthArm = new THREE.Mesh(armGeo, armMat);
  earthArm.position.set(4, 2, 0);
  earthArm.userData = { id: 'earth_arm', name: 'Earth Support Arm', description: 'Holds the Earth and Moon models.' };
  group.add(earthArm);

  // 5. Earth
  const earthPivot = new THREE.Group();
  earthPivot.position.set(8, 2, 0);
  const earthModelGeo = new THREE.SphereGeometry(0.8, 32, 32);
  const earthModelMat = new THREE.MeshStandardMaterial({ color: 0x1e90ff });
  const earth = new THREE.Mesh(earthModelGeo, earthModelMat);
  earth.userData = { id: 'earth', name: 'Earth Model', description: 'Blue sphere representing our planet.' };
  earthPivot.add(earth);
  group.add(earthPivot);

  // 6. Moon
  const moonGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const moonMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
  const moon = new THREE.Mesh(moonGeo, moonMat);
  moon.position.set(1.5, 0, 0);
  moon.userData = { id: 'moon', name: 'The Moon', description: 'Orbits the Earth model.' };
  earthPivot.add(moon);

  // 7. Gear System
  const gearGeo = new THREE.TorusGeometry(3, 0.5, 8, 24);
  const gearMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, metalness: 0.7 });
  const gear = new THREE.Mesh(gearGeo, gearMat);
  gear.position.y = -3;
  gear.rotation.x = Math.PI / 2;
  gear.userData = { id: 'gear', name: 'Main Drive Gear', description: 'Controls the relative speed of planets.' };
  group.add(gear);

  // 8. Mars Arm
  const marsArmGeo = new THREE.BoxGeometry(12, 0.2, 0.5);
  const marsArm = new THREE.Mesh(marsArmGeo, armMat);
  marsArm.position.set(-6, 0, 0);
  marsArm.userData = { id: 'mars_arm', name: 'Mars Support Arm', description: 'Extends to the Mars model.' };
  group.add(marsArm);

  // 9. Mars
  const marsGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const marsMat = new THREE.MeshStandardMaterial({ color: 0xb22222 });
  const mars = new THREE.Mesh(marsGeo, marsMat);
  mars.position.set(-12, 0, 0);
  mars.userData = { id: 'mars', name: 'Mars Model', description: 'Red sphere representing Mars.' };
  group.add(mars);

  // 10. Hand Crank
  const crankGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
  const crank = new THREE.Mesh(crankGeo, shaftMat);
  crank.position.set(5, -4, 0);
  crank.rotation.z = Math.PI / 2;
  crank.userData = { id: 'crank', name: 'Hand Crank', description: 'Manual input to power the orrery.' };
  group.add(crank);

  group.userData.animate = function(delta) {
    earthPivot.position.x = Math.cos(Date.now() * 0.001) * 8;
    earthPivot.position.z = Math.sin(Date.now() * 0.001) * 8;
    earthArm.rotation.y = -Date.now() * 0.001;
    moon.position.x = Math.cos(Date.now() * 0.005) * 1.5;
    moon.position.z = Math.sin(Date.now() * 0.005) * 1.5;
    mars.position.x = Math.cos(Date.now() * 0.0005) * 12;
    mars.position.z = Math.sin(Date.now() * 0.0005) * 12;
    marsArm.rotation.y = -Date.now() * 0.0005;
    gear.rotation.z += 0.01;
  };

  group.userData.quiz = [
    { question: "What does the central shaft of the orrery represent?", options: ["Axis of the sun", "Gravitational center", "Orbital plane"], answer: 1 },
    { question: "Why do gears have different ratios in an orrery?", options: ["To match planetary orbital periods", "For aesthetics", "To prevent jamming"], answer: 0 }
  ];

  return group;
}
