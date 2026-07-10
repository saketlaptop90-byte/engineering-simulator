export function createDysonSphere(THREE) {
  const group = new THREE.Group();

  // 1. Central Star
  const starGeo = new THREE.SphereGeometry(2, 32, 32);
  const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffddaa, emissiveIntensity: 1 });
  const star = new THREE.Mesh(starGeo, starMat);
  star.userData = { id: 'star', name: 'Central Star', description: 'The power source for the megastructure.' };
  group.add(star);

  // 2. Inner Dyson Swarm Ring
  const ring1Geo = new THREE.TorusGeometry(5, 0.2, 8, 64);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
  const ring1 = new THREE.Mesh(ring1Geo, ringMat);
  ring1.rotation.x = Math.PI / 3;
  ring1.userData = { id: 'ring_1', name: 'Inner Collector Swarm', description: 'First orbital ring of solar collectors.' };
  group.add(ring1);

  // 3. Middle Dyson Swarm Ring
  const ring2Geo = new THREE.TorusGeometry(7, 0.2, 8, 64);
  const ring2 = new THREE.Mesh(ring2Geo, ringMat);
  ring2.rotation.y = Math.PI / 4;
  ring2.userData = { id: 'ring_2', name: 'Equatorial Swarm Ring', description: 'Secondary orbital ring.' };
  group.add(ring2);

  // 4. Outer Dyson Swarm Ring
  const ring3Geo = new THREE.TorusGeometry(9, 0.2, 8, 64);
  const ring3 = new THREE.Mesh(ring3Geo, ringMat);
  ring3.rotation.x = -Math.PI / 6;
  ring3.userData = { id: 'ring_3', name: 'Outer Collector Swarm', description: 'Tertiary orbital ring.' };
  group.add(ring3);

  // 5. Mega-Habitat
  const habGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
  const habMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, metalness: 0.5 });
  const habitat = new THREE.Mesh(habGeo, habMat);
  habitat.position.set(5, 0, 0);
  ring1.add(habitat);
  habitat.userData = { id: 'habitat', name: 'O\'Neill Cylinder', description: 'Massive rotating habitat attached to the ring.' };

  // 6. Solar Concentrator Mirror
  const mirrorGeo = new THREE.PlaneGeometry(1, 1);
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0, side: THREE.DoubleSide });
  const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
  mirror.position.set(-5, 0, 0);
  mirror.lookAt(0,0,0);
  ring1.add(mirror);
  mirror.userData = { id: 'mirror', name: 'Solar Mirror', description: 'Reflects and concentrates starlight.' };

  // 7. Energy Transmission Beam
  const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 5);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.set(-2.5, 0, 0);
  beam.rotation.z = Math.PI / 2;
  ring1.add(beam);
  beam.userData = { id: 'beam', name: 'Microwave Power Beam', description: 'Transmits energy from the collector.' };

  // 8. Construction Drone
  const droneGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const droneMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const drone = new THREE.Mesh(droneGeo, droneMat);
  drone.position.set(0, 7, 0);
  ring2.add(drone);
  drone.userData = { id: 'drone', name: 'Automated Builder Drone', description: 'Maintains and expands the swarm structure.' };

  // 9. Heat Radiator
  const radGeo = new THREE.PlaneGeometry(0.5, 2);
  const radMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, side: THREE.DoubleSide, emissive: 0x330000 });
  const radiator = new THREE.Mesh(radGeo, radMat);
  radiator.position.set(0, 9, 0);
  ring3.add(radiator);
  radiator.userData = { id: 'radiator', name: 'Waste Heat Radiator', description: 'Dissipates excess heat into space.' };

  // 10. Planetary Remnant
  const planetGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const planetMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  planet.position.set(12, 0, 0);
  planet.userData = { id: 'planet', name: 'Dismantled Planet', description: 'A rocky world being mined for construction materials.' };
  group.add(planet);

  group.userData.animate = function(delta) {
    ring1.rotation.z += 0.005;
    ring2.rotation.x += 0.003;
    ring3.rotation.y += 0.002;
    
    const t = Date.now() * 0.0005;
    planet.position.x = Math.cos(t) * 12;
    planet.position.z = Math.sin(t) * 12;
  };

  group.userData.quiz = [
    { question: "What is the primary purpose of a Dyson Sphere?", options: ["To hide a star from enemies", "To capture a star's energy output", "To stabilize planetary orbits"], answer: 1 },
    { question: "Why is a 'Dyson Swarm' more physically realistic than a solid 'Dyson Shell'?", options: ["A solid shell would be structurally unstable", "Swarms are prettier", "Solid shells cannot absorb light"], answer: 0 }
  ];

  return group;
}
