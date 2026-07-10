export function createTsunamiBuoy(THREE) {
  const group = new THREE.Group();

  // --- SURFACE BUOY ---
  const buoyGroup = new THREE.Group();
  group.add(buoyGroup);

  // 1. Surface Float
  const floatGeo = new THREE.CylinderGeometry(2, 2, 1.5, 32);
  const floatMat = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.2 }); // High vis yellow
  const floatMesh = new THREE.Mesh(floatGeo, floatMat);
  floatMesh.position.y = 5;
  buoyGroup.add(floatMesh);
  floatMesh.userData = { id: 'surface_float', name: 'Surface Buoy', description: 'Houses the satellite transmitter and solar panels.' };

  // 2. Solar Panels
  const solarGeo = new THREE.PlaneGeometry(1, 1);
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x000055, metalness: 0.8 });
  for(let i=0; i<4; i++) {
    const panel = new THREE.Mesh(solarGeo, solarMat);
    const angle = (Math.PI / 2) * i;
    panel.position.set(Math.cos(angle)*2.01, 5, Math.sin(angle)*2.01);
    panel.rotation.y = -angle + Math.PI/2;
    buoyGroup.add(panel);
    panel.userData = { id: `solar_panel_${i}`, name: 'Solar Panel', description: 'Provides continuous power to the surface buoy.' };
  }

  // 3. Satellite Antenna
  const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
  const antennaMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const antenna = new THREE.Mesh(antennaGeo, antennaMat);
  antenna.position.set(0, 6.75, 0);
  buoyGroup.add(antenna);
  antenna.userData = { id: 'sat_antenna', name: 'Iridium Satellite Antenna', description: 'Transmits real-time tsunami warnings to monitoring centers.' };

  // 4. Acoustic Transducer (Surface)
  const transSurfaceGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5);
  const transSurfaceMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const transSurface = new THREE.Mesh(transSurfaceGeo, transSurfaceMat);
  transSurface.position.set(0, 4, 0);
  buoyGroup.add(transSurface);
  transSurface.userData = { id: 'acoustic_receiver', name: 'Acoustic Receiver', description: 'Listens for acoustic pings from the seafloor sensor.' };

  // --- MOORING LINE ---
  // 5. Mooring Line (cable)
  const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, 10);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const mooringLine = new THREE.Mesh(lineGeo, lineMat);
  mooringLine.position.set(0, -1, 0);
  group.add(mooringLine);
  mooringLine.userData = { id: 'mooring_line', name: 'Nylon/Wire Mooring Line', description: 'Keeps the surface buoy anchored near the seafloor sensor.' };

  // --- SEAFLOOR BPR (Bottom Pressure Recorder) ---
  const bprGroup = new THREE.Group();
  group.add(bprGroup);

  // 6. BPR Housing
  const bprGeo = new THREE.BoxGeometry(2, 1, 2);
  const bprMat = new THREE.MeshStandardMaterial({ color: 0xff8800, metalness: 0.5 });
  const bpr = new THREE.Mesh(bprGeo, bprMat);
  bpr.position.y = -6.5;
  bprGroup.add(bpr);
  bpr.userData = { id: 'bpr_housing', name: 'BPR Housing (DART System)', description: 'Bottom Pressure Recorder anchored to the sea floor.' };

  // 7. Piezoelectric Pressure Sensor
  const sensorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4);
  const sensorMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1 });
  const sensor = new THREE.Mesh(sensorGeo, sensorMat);
  sensor.position.set(0, -6, 0);
  bprGroup.add(sensor);
  sensor.userData = { id: 'pressure_sensor', name: 'Ultra-sensitive Quartz Pressure Sensor', description: 'Detects millimeter-scale changes in the water column height caused by passing tsunamis.' };

  // 8. Acoustic Transducer (Seafloor)
  const transBottom = new THREE.Mesh(transSurfaceGeo, transSurfaceMat);
  transBottom.position.set(0.5, -5.75, 0.5);
  bprGroup.add(transBottom);
  transBottom.userData = { id: 'acoustic_transmitter', name: 'Acoustic Transmitter', description: 'Sends pressure data up to the surface buoy using sound waves.' };

  // 9. Anchor / Anchor Weight
  const anchorGeo = new THREE.BoxGeometry(3, 0.5, 3);
  const anchorMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const anchor = new THREE.Mesh(anchorGeo, anchorMat);
  anchor.position.set(0, -7.25, 0);
  bprGroup.add(anchor);
  anchor.userData = { id: 'anchor', name: 'Anchor Block', description: 'Heavy weight pinning the sensor to the ocean floor.' };

  // 10. Acoustic Ping (Visualized)
  const pingGeo = new THREE.RingGeometry(0.5, 0.6, 16);
  const pingMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true });
  const ping = new THREE.Mesh(pingGeo, pingMat);
  ping.position.set(0.5, -5.5, 0.5);
  ping.rotation.x = Math.PI / 2;
  bprGroup.add(ping);
  ping.userData = { id: 'acoustic_ping', name: 'Acoustic Data Link', description: 'Sound pulses traversing the water column.' };

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.002;
    
    // Wave action on the surface buoy
    buoyGroup.position.y = Math.sin(t) * 0.5;
    buoyGroup.rotation.x = Math.sin(t * 0.8) * 0.1;
    buoyGroup.rotation.z = Math.cos(t * 0.9) * 0.1;

    // Ping animating upwards
    ping.position.y += 0.1;
    ping.scale.set(1 + ping.position.y/10, 1 + ping.position.y/10, 1);
    ping.material.opacity = 1 - (ping.position.y / 10);
    if (ping.position.y > 10) {
      ping.position.y = -5.5;
      ping.scale.set(1,1,1);
      ping.material.opacity = 1;
    }
  };

  group.userData.quiz = [
    { question: "How does a DART buoy detect a tsunami in the deep ocean?", options: ["By measuring surface wave height", "By measuring subtle changes in water pressure at the seafloor", "By detecting underwater earthquakes directly"], answer: 1 },
    { question: "Why do tsunamis often go unnoticed by ships in the open ocean?", options: ["Because they travel too fast", "Because their amplitude (height) in deep water is only a few inches or feet", "Because ships have stabilizers"], answer: 1 }
  ];

  return group;
}
