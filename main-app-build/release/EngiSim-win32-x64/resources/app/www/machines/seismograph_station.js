export function createSeismographStation(THREE) {
  const group = new THREE.Group();

  // 1. Concrete Vault (Underground station)
  const vaultGeo = new THREE.BoxGeometry(6, 4, 6);
  const vaultMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.3 });
  const vault = new THREE.Mesh(vaultGeo, vaultMat);
  group.add(vault);
  vault.userData = { id: 'vault', name: 'Underground Concrete Vault', description: 'Buried deep into bedrock to isolate the instrument from surface noise (wind, traffic).' };

  // 2. Bedrock Foundation
  const rockGeo = new THREE.BoxGeometry(8, 2, 8);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 1 });
  const bedrock = new THREE.Mesh(rockGeo, rockMat);
  bedrock.position.y = -3;
  group.add(bedrock);
  bedrock.userData = { id: 'bedrock', name: 'Solid Bedrock', description: 'Transmits seismic waves directly to the pier without soft-soil dampening.' };

  // 3. Concrete Pier (Isolated from the walls)
  const pierGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
  const pierMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
  const pier = new THREE.Mesh(pierGeo, pierMat);
  pier.position.y = -1.5;
  group.add(pier);
  pier.userData = { id: 'pier', name: 'Isolated Concrete Pier', description: 'Attached directly to bedrock, separate from the vault floor.' };

  // 4. Seismometer Housing (The instrument)
  const instGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
  const instMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
  const instrument = new THREE.Mesh(instGeo, instMat);
  instrument.position.y = -0.4;
  group.add(instrument);
  instrument.userData = { id: 'seismometer', name: 'Broadband Seismometer', description: 'Contains an inertial mass on a spring to detect microscopic ground movements.' };

  // 5. Inertial Mass & Spring (Inside the instrument, made visible)
  const massGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const massMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 1 });
  const mass = new THREE.Mesh(massGeo, massMat);
  mass.position.y = -0.4;
  group.add(mass);
  mass.userData = { id: 'inertial_mass', name: 'Suspended Inertial Mass', description: 'Tends to remain stationary due to inertia while the Earth (and the frame) moves around it.' };

  const springCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.1, 0),
    new THREE.Vector3(0.1, 0, 0),
    new THREE.Vector3(-0.1, -0.1, 0),
    new THREE.Vector3(0.1, -0.2, 0),
    new THREE.Vector3(0, -0.3, 0)
  ]);
  const springGeo = new THREE.TubeGeometry(springCurve, 16, 0.02, 8, false);
  const springMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const spring = new THREE.Mesh(springGeo, springMat);
  spring.position.y = -0.1;
  group.add(spring);

  // 6. Data Logger (Digitizer)
  const loggerGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
  const loggerMat = new THREE.MeshStandardMaterial({ color: 0x2222ff });
  const logger = new THREE.Mesh(loggerGeo, loggerMat);
  logger.position.set(-2, -1.75, 2);
  group.add(logger);
  logger.userData = { id: 'digitizer', name: '24-bit Digitizer', description: 'Converts analog voltage changes from the mass displacement into high-resolution digital data.' };

  // 7. Wiring
  const wireGeo = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(-1, -1.8, 1),
    new THREE.Vector3(-1.6, -1.8, 2)
  ]);
  const wire = new THREE.Mesh(new THREE.TubeGeometry(wireGeo, 16, 0.03, 8, false), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  group.add(wire);

  // 8. GPS Antenna (Surface)
  const gpsGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const gpsMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const gps = new THREE.Mesh(gpsGeo, gpsMat);
  gps.position.set(2, 2.5, 2);
  group.add(gps);
  gps.userData = { id: 'gps', name: 'GPS Receiver', description: 'Provides microsecond-accurate timestamping to synchronize data globally.' };

  // 9. Solar Panel (Surface power)
  const solarGeo = new THREE.PlaneGeometry(2, 2);
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x002266, metalness: 0.8 });
  const solar = new THREE.Mesh(solarGeo, solarMat);
  solar.position.set(0, 2.5, -2);
  solar.rotation.x = -Math.PI / 4;
  group.add(solar);
  solar.userData = { id: 'solar', name: 'Solar Array & Batteries', description: 'Powers the remote station autonomously.' };

  // 10. Seismogram visualization (Digital trace)
  const traceGeo = new THREE.PlaneGeometry(4, 2);
  const traceMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const screen = new THREE.Mesh(traceGeo, traceMat);
  screen.position.set(0, 4, 0);
  group.add(screen);

  const lineMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cursor = new THREE.Mesh(new THREE.SphereGeometry(0.05), lineMat);
  cursor.position.set(-1.9, 4, 0.01);
  group.add(cursor);
  cursor.userData = { id: 'seismogram', name: 'Live Seismogram Trace', description: 'Real-time readout of ground velocity.' };

  let time = 0;

  group.userData.animate = function(delta) {
    time += 0.05;
    
    // Simulate an earthquake arriving
    let groundMotion = 0;
    if (time > 10 && time < 15) { // P-wave (fast, small amplitude)
      groundMotion = Math.sin(time * 20) * 0.05;
    } else if (time >= 15 && time < 25) { // S-wave and Surface waves (slower, large amplitude)
      groundMotion = Math.sin(time * 10) * 0.2 * Math.exp(-(time-15)*0.1); // damped oscillation
    } else if (time >= 25) {
      time = 0; // reset
    }

    // Move everything EXCEPT the inertial mass
    vault.position.y = groundMotion;
    bedrock.position.y = -3 + groundMotion;
    pier.position.y = -1.5 + groundMotion;
    instrument.position.y = -0.4 + groundMotion;
    
    // Mass stays relatively still (simulating inertia) but slightly dragged
    mass.position.y = -0.4 - groundMotion * 0.8;
    spring.scale.y = 1 + groundMotion;

    // Move seismogram cursor
    cursor.position.x = -1.9 + (time / 25) * 3.8;
    cursor.position.y = 4 + groundMotion * 2;
  };

  group.userData.quiz = [
    { question: "Why do seismometers use an inertial mass suspended on a spring?", options: ["To make them heavier", "So the mass stays relatively still while the Earth moves around it, allowing measurement of the difference", "To generate electricity"], answer: 1 },
    { question: "Which seismic wave arrives first at a station?", options: ["S-Wave (Shear)", "Surface Wave (Love/Rayleigh)", "P-Wave (Primary/Compressional)"], answer: 2 }
  ];

  return group;
}
