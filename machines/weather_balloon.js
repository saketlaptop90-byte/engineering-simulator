export function createWeatherBalloon(THREE) {
  const group = new THREE.Group();

  // 1. Latex Balloon
  const balloonGeo = new THREE.SphereGeometry(3, 32, 32);
  const balloonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  const balloon = new THREE.Mesh(balloonGeo, balloonMat);
  balloon.position.y = 5;
  balloon.userData = { id: 'balloon', name: 'Latex Envelope', description: 'Expands as it rises into lower atmospheric pressure.' };
  group.add(balloon);

  // 2. Helium/Hydrogen Gas inside
  const gasGeo = new THREE.SphereGeometry(2.8, 16, 16);
  const gasMat = new THREE.MeshBasicMaterial({ color: 0xffffdd, transparent: true, opacity: 0.3 });
  const gas = new THREE.Mesh(gasGeo, gasMat);
  balloon.add(gas);
  gas.userData = { id: 'gas', name: 'Lifting Gas', description: 'Helium or Hydrogen providing buoyancy.' };

  // 3. Parachute
  const chuteGeo = new THREE.ConeGeometry(1, 1, 16, 1, true);
  const chuteMat = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });
  const chute = new THREE.Mesh(chuteGeo, chuteMat);
  chute.position.y = 2;
  chute.userData = { id: 'parachute', name: 'Parachute', description: 'Slows descent after the balloon bursts.' };
  group.add(chute);

  // 4. Tether Line
  const lineGeo = new THREE.CylinderGeometry(0.02, 0.02, 4);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.position.y = 0;
  group.add(line);
  line.userData = { id: 'tether', name: 'Nylon Tether', description: 'Connects the balloon to the instrument package.' };

  // 5. Radiosonde Box
  const sondeGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
  const sondeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const sonde = new THREE.Mesh(sondeGeo, sondeMat);
  sonde.position.y = -2;
  group.add(sonde);
  sonde.userData = { id: 'radiosonde', name: 'Radiosonde', description: 'Instrument package measuring T, P, and RH.' };

  // 6. Thermistor (Temperature Sensor)
  const thermGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
  const thermMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const therm = new THREE.Mesh(thermGeo, thermMat);
  therm.position.set(0.5, -2, 0);
  group.add(therm);
  therm.userData = { id: 'thermistor', name: 'Thermistor', description: 'Measures ambient air temperature.' };

  // 7. Hygrometer (Humidity Sensor)
  const hygroGeo = new THREE.BoxGeometry(0.1, 0.3, 0.1);
  const hygroMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const hygro = new THREE.Mesh(hygroGeo, hygroMat);
  hygro.position.set(-0.5, -2, 0);
  group.add(hygro);
  hygro.userData = { id: 'hygrometer', name: 'Capacitive Hygrometer', description: 'Measures relative humidity.' };

  // 8. GPS Antenna
  const gpsGeo = new THREE.PlaneGeometry(0.4, 0.4);
  const gpsMat = new THREE.MeshBasicMaterial({ color: 0x4444ff });
  const gps = new THREE.Mesh(gpsGeo, gpsMat);
  gps.rotation.x = -Math.PI / 2;
  gps.position.set(0, -1.49, 0);
  group.add(gps);
  gps.userData = { id: 'gps', name: 'GPS Antenna', description: 'Tracks location to calculate wind speed and direction.' };

  // 9. Radio Transmission Antenna
  const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 1);
  const ant = new THREE.Mesh(antGeo, lineMat);
  ant.position.set(0, -3, 0);
  group.add(ant);
  ant.userData = { id: 'radio_antenna', name: 'Telemetry Antenna', description: 'Transmits data back to the ground station via UHF.' };

  // 10. Radar Reflector
  const refGeo = new THREE.OctahedronGeometry(0.5);
  const refMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1 });
  const reflector = new THREE.Mesh(refGeo, refMat);
  reflector.position.set(0, 1, 0);
  group.add(reflector);
  reflector.userData = { id: 'reflector', name: 'Radar Reflector', description: 'Makes the balloon trackable by ground radar.' };

  group.userData.animate = function(delta) {
    balloon.position.y += Math.sin(Date.now() * 0.002) * 0.02;
    balloon.scale.set(1 + Math.sin(Date.now() * 0.001) * 0.05, 1, 1 + Math.sin(Date.now() * 0.001) * 0.05);
    sonde.rotation.y += 0.01;
    therm.rotation.y += 0.01;
    hygro.rotation.y += 0.01;
  };

  group.userData.quiz = [
    { question: "What happens to the balloon as it rises into the stratosphere?", options: ["It shrinks", "It freezes solid", "It expands until it bursts"], answer: 2 },
    { question: "How does a Radiosonde measure wind speed?", options: ["Using a tiny anemometer", "By tracking its GPS position changes over time", "By measuring air pressure changes"], answer: 1 }
  ];

  return group;
}
