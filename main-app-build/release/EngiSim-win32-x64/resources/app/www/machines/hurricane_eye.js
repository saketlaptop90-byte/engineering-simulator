export function createHurricaneEye(THREE) {
  const group = new THREE.Group();

  // 1. The Eye
  const eyeGeo = new THREE.CylinderGeometry(2, 2, 10, 32, 1, true);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.userData = { id: 'eye', name: 'Hurricane Eye', description: 'Calm, clear center of low pressure.' };
  group.add(eye);

  // 2. Eyewall
  const eyewallGeo = new THREE.CylinderGeometry(4, 4, 10, 32, 1, true);
  const eyewallMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
  const eyewall = new THREE.Mesh(eyewallGeo, eyewallMat);
  eyewall.userData = { id: 'eyewall', name: 'Eyewall', description: 'Ring of intense thunderstorms surrounding the eye.' };
  group.add(eyewall);

  // 3. Spiral Rainbands
  const bandMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.7 });
  for (let i = 0; i < 4; i++) {
    const bandGeo = new THREE.TorusGeometry(6 + i*2, 1, 8, 32, Math.PI);
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.rotation.x = Math.PI / 2;
    band.rotation.z = (Math.PI / 2) * i;
    band.userData = { id: `band_${i}`, name: 'Spiral Rainband', description: 'Bands of heavy convection spiraling inward.' };
    group.add(band);
  }

  // 4. Ocean Surface
  const oceanGeo = new THREE.PlaneGeometry(30, 30);
  const oceanMat = new THREE.MeshStandardMaterial({ color: 0x0044aa, transparent: true, opacity: 0.8 });
  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = -5;
  ocean.userData = { id: 'ocean', name: 'Ocean Surface', description: 'Warm water providing latent heat to fuel the storm.' };
  group.add(ocean);

  // 5. Storm Surge
  const surgeGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
  const surgeMat = new THREE.MeshStandardMaterial({ color: 0x0066aa, transparent: true, opacity: 0.6 });
  const surge = new THREE.Mesh(surgeGeo, surgeMat);
  surge.position.y = -4.5;
  surge.userData = { id: 'surge', name: 'Storm Surge', description: 'Mound of ocean water pushed onshore by wind.' };
  group.add(surge);

  // 6. Outflow Cirrus Shield
  const outflowGeo = new THREE.CylinderGeometry(15, 6, 1, 32);
  const outflowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const outflow = new THREE.Mesh(outflowGeo, outflowMat);
  outflow.position.y = 5.5;
  outflow.userData = { id: 'outflow', name: 'Cirrus Outflow Shield', description: 'Air exhausting from the top of the storm.' };
  group.add(outflow);

  // 7. Warm Core Anomaly
  const coreGeo = new THREE.SphereGeometry(1.5, 16, 16);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.y = 2;
  core.userData = { id: 'warm_core', name: 'Warm Core', description: 'Air sinking in the eye warms by compression.' };
  group.add(core);

  // 8. Low Pressure Center
  const lowP = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 8, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  lowP.rotation.x = Math.PI / 2;
  lowP.position.y = -4.8;
  lowP.userData = { id: 'low_pressure', name: 'Low Pressure Center', description: 'Extreme low barometric pressure.' };
  group.add(lowP);

  // 9. Coriolis Force Arrows (Northern Hemisphere)
  const arrowGeo = new THREE.ConeGeometry(0.5, 2, 8);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const arrow = new THREE.Mesh(arrowGeo, arrowMat);
  arrow.position.set(8, -3, 0);
  arrow.rotation.z = Math.PI / 2;
  arrow.rotation.y = Math.PI / 4;
  arrow.userData = { id: 'coriolis', name: 'Coriolis Inflow', description: 'Earth\'s rotation causes counter-clockwise turning.' };
  group.add(arrow);

  // 10. Updraft Indicator
  const updraftGeo = new THREE.CylinderGeometry(0.2, 0.2, 8);
  const updraftMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const updraft = new THREE.Mesh(updraftGeo, updraftMat);
  updraft.position.set(3, 0, 0);
  updraft.userData = { id: 'updraft', name: 'Intense Updraft', description: 'Warm air rising rapidly in the eyewall.' };
  group.add(updraft);

  group.userData.animate = function(delta) {
    eyewall.rotation.y += 0.05;
    outflow.rotation.y -= 0.02; // Anticyclonic outflow
    group.children.forEach(c => {
      if(c.userData.id && c.userData.id.startsWith('band')) {
        c.rotation.z -= 0.03;
      }
    });
  };

  group.userData.quiz = [
    { question: "What fuels a hurricane?", options: ["Wind shear", "Latent heat from warm ocean water", "Cold fronts"], answer: 1 },
    { question: "In the Northern Hemisphere, which direction do hurricanes rotate?", options: ["Clockwise", "Counter-clockwise", "It depends on the season"], answer: 1 }
  ];

  return group;
}
