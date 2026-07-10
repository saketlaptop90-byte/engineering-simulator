export function createJamesWebbTelescope(THREE) {
  const group = new THREE.Group();

  // 1. Primary Mirror (Hexagonal array)
  const mirrorGroup = new THREE.Group();
  const hexGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 6);
  const hexMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 });
  
  // Arrange some hexes
  const positions = [
    [0,0], [0.9, 0.5], [0.9, -0.5], [-0.9, 0.5], [-0.9, -0.5], [0, 1], [0, -1]
  ];
  positions.forEach((pos, i) => {
    const hex = new THREE.Mesh(hexGeo, hexMat);
    hex.position.set(pos[0], pos[1], 0);
    hex.rotation.x = Math.PI / 2;
    mirrorGroup.add(hex);
  });
  mirrorGroup.userData = { id: 'primary_mirror', name: 'Primary Mirror', description: '18 beryllium segments coated in gold for IR reflection.' };
  group.add(mirrorGroup);

  // 2. Secondary Mirror
  const secGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 6);
  const secMirror = new THREE.Mesh(secGeo, hexMat);
  secMirror.position.set(0, 0, 3);
  secMirror.rotation.x = Math.PI / 2;
  secMirror.userData = { id: 'secondary_mirror', name: 'Secondary Mirror', description: 'Reflects light from the primary mirror into the instruments.' };
  group.add(secMirror);

  // 3. Boom structure
  const boomMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const boom1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5), boomMat);
  boom1.position.set(0.8, 0, 1.5);
  boom1.rotation.x = Math.PI / 2;
  boom1.rotation.y = -0.2;
  group.add(boom1);
  
  const boom2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5), boomMat);
  boom2.position.set(-0.8, 0, 1.5);
  boom2.rotation.x = Math.PI / 2;
  boom2.rotation.y = 0.2;
  group.add(boom2);

  const boom3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5), boomMat);
  boom3.position.set(0, -0.9, 1.5);
  boom3.rotation.x = Math.PI / 2;
  boom3.rotation.y = 0;
  boom3.rotation.x = 1.8;
  group.add(boom3);
  
  boom1.userData = { id: 'boom', name: 'Support Struts', description: 'Holds the secondary mirror perfectly aligned.' };

  // 4. Integrated Science Instrument Module (ISIM)
  const isimGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const isimMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const isim = new THREE.Mesh(isimGeo, isimMat);
  isim.position.set(0, 0, -1);
  isim.userData = { id: 'isim', name: 'ISIM', description: 'Houses the cameras and spectrographs.' };
  group.add(isim);

  // 5. Sunshield (Layer 1)
  const shieldGeo = new THREE.PlaneGeometry(6, 4);
  const shieldMat = new THREE.MeshStandardMaterial({ color: 0xddddff, metalness: 0.2, roughness: 0.8, side: THREE.DoubleSide });
  const shield1 = new THREE.Mesh(shieldGeo, shieldMat);
  shield1.position.set(0, -1.5, 0);
  shield1.rotation.x = Math.PI / 2;
  shield1.userData = { id: 'sunshield', name: 'Kapton Sunshield', description: '5 layers that keep the telescope at cryogenic temperatures.' };
  group.add(shield1);

  // 6. Spacecraft Bus
  const busGeo = new THREE.BoxGeometry(2, 0.5, 2);
  const busMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const bus = new THREE.Mesh(busGeo, busMat);
  bus.position.set(0, -2, 0);
  bus.userData = { id: 'spacecraft_bus', name: 'Spacecraft Bus', description: 'Contains computing, communication, and propulsion.' };
  group.add(bus);

  // 7. Solar Array
  const solarGeo = new THREE.PlaneGeometry(2, 3);
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x000044, metalness: 0.8 });
  const solar = new THREE.Mesh(solarGeo, solarMat);
  solar.position.set(0, -2, 2.5);
  solar.rotation.x = -Math.PI / 4;
  solar.userData = { id: 'solar_array', name: 'Solar Array', description: 'Provides power to the telescope.' };
  group.add(solar);

  // 8. High-Gain Antenna
  const antennaGeo = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI);
  const antennaMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
  const antenna = new THREE.Mesh(antennaGeo, antennaMat);
  antenna.position.set(-1, -2.5, 0);
  antenna.rotation.x = Math.PI / 2;
  antenna.userData = { id: 'antenna', name: 'High-Gain Antenna', description: 'Transmits massive data back to Earth.' };
  group.add(antenna);

  // 9. Star Tracker
  const trackerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
  const trackerMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const tracker = new THREE.Mesh(trackerGeo, trackerMat);
  tracker.position.set(1, -1.8, -1);
  tracker.rotation.x = Math.PI / 4;
  tracker.userData = { id: 'star_tracker', name: 'Star Tracker', description: 'Uses guide stars to precisely point the telescope.' };
  group.add(tracker);

  // 10. Trim Flap
  const flapGeo = new THREE.PlaneGeometry(1, 0.5);
  const flap = new THREE.Mesh(flapGeo, shieldMat);
  flap.position.set(0, -1.6, -2.5);
  flap.userData = { id: 'trim_flap', name: 'Momentum Trim Flap', description: 'Balances solar radiation pressure to save fuel.' };
  group.add(flap);

  group.userData.animate = function(delta) {
    antenna.rotation.z += 0.01;
  };

  group.userData.quiz = [
    { question: "Why is the JWST primary mirror coated in gold?", options: ["It looks expensive", "Gold is highly reflective to Infrared light", "It prevents rusting in space"], answer: 1 },
    { question: "What spectrum of light does JWST primarily observe?", options: ["Ultraviolet", "X-Ray", "Infrared"], answer: 2 }
  ];

  return group;
}
