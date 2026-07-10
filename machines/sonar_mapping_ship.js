export function createSonarMappingShip(THREE) {
  const group = new THREE.Group();

  // 1. Research Vessel Hull
  const hullGeo = new THREE.BoxGeometry(3, 2, 10);
  const hullMat = new THREE.MeshStandardMaterial({ color: 0xdd2222, metalness: 0.3, roughness: 0.5 });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.position.y = 1;
  group.add(hull);
  hull.userData = { id: 'hull', name: 'Research Vessel Hull', description: 'Ice-strengthened hull for global oceanographic surveys.' };

  // 2. Superstructure (Bridge)
  const bridgeGeo = new THREE.BoxGeometry(2.5, 1.5, 3);
  const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
  bridge.position.set(0, 2.75, 1);
  group.add(bridge);
  bridge.userData = { id: 'bridge', name: 'Navigation Bridge', description: 'Command center for navigating and controlling survey tracks.' };

  // 3. A-Frame Crane (Stern)
  const aframeGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
  const aframeMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const leg1 = new THREE.Mesh(aframeGeo, aframeMat);
  leg1.position.set(1.2, 3, -4.5);
  leg1.rotation.z = Math.PI / 8;
  const leg2 = new THREE.Mesh(aframeGeo, aframeMat);
  leg2.position.set(-1.2, 3, -4.5);
  leg2.rotation.z = -Math.PI / 8;
  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5), aframeMat);
  crossbar.position.set(0, 4.8, -4.5);
  crossbar.rotation.z = Math.PI / 2;
  group.add(leg1, leg2, crossbar);
  leg1.userData = { id: 'a_frame', name: 'A-Frame Crane', description: 'Used for deploying heavy deep-sea equipment like ROVs or CTD rosettes.' };

  // 4. Multibeam Echosounder (Transducer array)
  const transducerGeo = new THREE.BoxGeometry(1.5, 0.3, 0.5);
  const transducerMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const transducer = new THREE.Mesh(transducerGeo, transducerMat);
  transducer.position.set(0, -0.15, 2);
  group.add(transducer);
  transducer.userData = { id: 'multibeam_transducer', name: 'Multibeam Transducer Array', description: 'Mounted on the hull, emits a fan of acoustic pings to map a wide swath of the seafloor.' };

  // 5. Acoustic Ping Swath (Visualization)
  const swathGeo = new THREE.ConeGeometry(6, 10, 32, 1, true, 0, Math.PI);
  const swathMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
  const swath = new THREE.Mesh(swathGeo, swathMat);
  swath.position.set(0, -5, 2);
  swath.rotation.x = Math.PI;
  group.add(swath);
  swath.userData = { id: 'acoustic_swath', name: 'Acoustic Swath', description: 'High-frequency sound waves mapping the bathymetry.' };

  // 6. Mapped Seafloor (Bathymetry)
  const floorGeo = new THREE.PlaneGeometry(12, 12, 32, 32);
  const positions = floorGeo.attributes.position;
  for(let i=0; i<positions.count; i++) {
    // create an underwater canyon or seamount
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = Math.sin(x*0.5) * Math.cos(y*0.5) * 2;
    positions.setZ(i, z);
  }
  floorGeo.computeVertexNormals();
  // Wireframe material to represent digital elevation model
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, -10, 0);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);
  floor.userData = { id: 'seafloor_dem', name: 'Digital Elevation Model (DEM)', description: '3D representation of the surveyed bathymetry.' };

  // 7. Towed Magnetometer
  const magGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
  const magMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const mag = new THREE.Mesh(magGeo, magMat);
  mag.position.set(0, 0, -8);
  mag.rotation.x = Math.PI / 2;
  group.add(mag);
  mag.userData = { id: 'magnetometer', name: 'Towed Magnetometer', description: 'Detects magnetic anomalies in the oceanic crust, confirming seafloor spreading.' };

  // 8. Tow Cable
  const towGeo = new THREE.CylinderGeometry(0.02, 0.02, 3.5);
  const towMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const towCable = new THREE.Mesh(towGeo, towMat);
  towCable.position.set(0, 0.5, -6);
  towCable.rotation.x = Math.PI / 2;
  group.add(towCable);
  towCable.userData = { id: 'tow_cable', name: 'Tow Cable', description: 'Keeps the magnetometer far from the ship\'s magnetic interference.' };

  // 9. GPS/DGPS Antennas
  const gpsGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const gpsMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const gps = new THREE.Mesh(gpsGeo, gpsMat);
  gps.position.set(0, 4, 1);
  group.add(gps);
  gps.userData = { id: 'dgps', name: 'Differential GPS', description: 'Provides ultra-precise vessel positioning to accurately map data points.' };

  // 10. Motion Reference Unit (MRU)
  const mruGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
  const mruMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const mru = new THREE.Mesh(mruGeo, mruMat);
  mru.position.set(0, 0, 2);
  group.add(mru);
  mru.userData = { id: 'mru', name: 'Motion Reference Unit (MRU)', description: 'Measures heave, pitch, and roll of the ship to correct sonar data instantly.' };

  // Animated ping waves
  const waveMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5, wireframe: true });
  const waves = [];
  for(let i=0; i<3; i++) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), waveMat);
    w.rotation.x = Math.PI / 2;
    group.add(w);
    waves.push({ mesh: w, offset: i * 3.3 });
  }

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;
    // Vessel pitching slightly
    hull.rotation.x = Math.sin(t) * 0.05;
    bridge.rotation.x = Math.sin(t) * 0.05;
    
    // Animate sonar pings going down
    waves.forEach(w => {
      let ypos = ((t*5 + w.offset) % 10);
      w.mesh.position.y = -ypos;
      w.mesh.position.z = 2;
      w.mesh.scale.set(ypos * 1.5, ypos * 0.5, 1);
      w.mesh.material.opacity = 1 - (ypos / 10);
    });
  };

  group.userData.quiz = [
    { question: "Why is a Motion Reference Unit (MRU) critical for multibeam sonar?", options: ["It powers the sonar array", "It corrects the sound data for the ship's rolling and pitching in the waves", "It drives the ship automatically"], answer: 1 },
    { question: "How does sonar determine depth?", options: ["By measuring water temperature", "By shooting lasers at the seafloor", "By measuring the time it takes for a sound pulse to bounce back"], answer: 2 }
  ];

  return group;
}
