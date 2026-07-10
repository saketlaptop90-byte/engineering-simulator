export function createDopplerRadar(THREE) {
  const group = new THREE.Group();

  // 1. Radar Tower Base
  const baseGeo = new THREE.CylinderGeometry(1, 1.5, 8, 16);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -4;
  base.userData = { id: 'tower', name: 'Tower', description: 'Elevates the radar above ground obstacles.' };
  group.add(base);

  // 2. Radome
  const radomeGeo = new THREE.SphereGeometry(2.5, 32, 32);
  const radomeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  const radome = new THREE.Mesh(radomeGeo, radomeMat);
  radome.position.y = 1;
  radome.userData = { id: 'radome', name: 'Radome', description: 'Fiberglass dome protecting the dish from weather.' };
  group.add(radome);

  // 3. Radar Dish
  const dishPivot = new THREE.Group();
  dishPivot.position.y = 1;
  const dishGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI);
  const dishMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, side: THREE.DoubleSide });
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.rotation.x = Math.PI / 2;
  dishPivot.add(dish);
  dish.userData = { id: 'dish', name: 'Parabolic Dish', description: 'Focuses the microwave pulses.' };
  group.add(dishPivot);

  // 4. Feed Horn
  const feedGeo = new THREE.CylinderGeometry(0.1, 0.2, 1);
  const feedMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const feed = new THREE.Mesh(feedGeo, feedMat);
  feed.position.z = 1.2;
  feed.rotation.x = Math.PI / 2;
  dishPivot.add(feed);
  feed.userData = { id: 'feed_horn', name: 'Feed Horn', description: 'Emits and receives the microwave signals.' };

  // 5. Outgoing Pulse (Redshift)
  const outPulseGeo = new THREE.RingGeometry(0.5, 0.8, 32);
  const outPulseMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true });
  const outPulse = new THREE.Mesh(outPulseGeo, outPulseMat);
  outPulse.position.z = 3;
  dishPivot.add(outPulse);
  outPulse.userData = { id: 'pulse', name: 'Microwave Pulse', description: 'Electromagnetic wave traveling at the speed of light.' };

  // 6. Raindrop Target
  const dropGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const dropMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const drop = new THREE.Mesh(dropGeo, dropMat);
  drop.position.set(0, 1, 8);
  group.add(drop);
  drop.userData = { id: 'raindrop', name: 'Precipitation Target', description: 'Rain moving towards or away from the radar.' };

  // 7. Returning Echo (Blueshift)
  const echoGeo = new THREE.RingGeometry(0.4, 0.6, 32);
  const echoMat = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide, transparent: true });
  const echo = new THREE.Mesh(echoGeo, echoMat);
  echo.position.set(0, 1, 7);
  group.add(echo);
  echo.userData = { id: 'echo', name: 'Doppler Echo', description: 'Shifted frequency reveals target velocity.' };

  // 8. Transmitter/Receiver Equipment
  const txGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const txMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const tx = new THREE.Mesh(txGeo, txMat);
  tx.position.y = -1;
  group.add(tx);
  tx.userData = { id: 'tx_rx', name: 'T/R Module', description: 'Generates pulses and processes echoes.' };

  // 9. Ground
  const groundGeo = new THREE.PlaneGeometry(10, 10);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -8;
  group.add(ground);
  ground.userData = { id: 'ground', name: 'Ground Base', description: 'Radar site foundation.' };

  // 10. Data Cable
  const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
  const cableMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const cable = new THREE.Mesh(cableGeo, cableMat);
  cable.position.set(0.5, -6, 0);
  group.add(cable);
  cable.userData = { id: 'cable', name: 'Data Cable', description: 'Transmits reflectivity and velocity data to meteorologists.' };

  group.userData.animate = function(delta) {
    dishPivot.rotation.y += 0.05;
    
    // Animate pulse
    outPulse.position.z += 0.2;
    if(outPulse.position.z > 8) outPulse.position.z = 1.5;
    
    // Animate echo
    echo.position.z -= 0.2;
    if(echo.position.z < 1.5) echo.position.z = 8;
  };

  group.userData.quiz = [
    { question: "What does the Doppler effect measure in weather radar?", options: ["The size of raindrops", "The velocity of wind/rain relative to the radar", "The temperature of the clouds"], answer: 1 },
    { question: "What is the purpose of the Radome?", options: ["To magnify the signal", "To protect the spinning dish from wind and ice", "To hide classified military tech"], answer: 1 }
  ];

  return group;
}
