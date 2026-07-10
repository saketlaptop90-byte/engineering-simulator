import {
  steel,
  aluminum,
  darkSteel,
  whitePlastic,
  redAccent,
  greenAccent,
  blackPlastic,
  blueAccent
} from '../utils/materials.js';

export function createCellTower(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Base pad
  const padGeo = new THREE.BoxGeometry(12, 0.5, 12);
  const pad = new THREE.Mesh(padGeo, darkSteel);
  pad.position.y = 0.25;
  group.add(pad);

  // Equipment Cabinets
  const cabGeo = new THREE.BoxGeometry(2.5, 4, 2);
  const cabinet1 = new THREE.Mesh(cabGeo, whitePlastic);
  cabinet1.position.set(-3, 2.5, 3);
  group.add(cabinet1);
  
  const cabinet2 = new THREE.Mesh(cabGeo, whitePlastic);
  cabinet2.position.set(3, 2.5, 3);
  group.add(cabinet2);

  // Central monopole tower
  const towerHeight = 35;
  const poleGeo = new THREE.CylinderGeometry(1.5, 2.5, towerHeight, 16);
  const pole = new THREE.Mesh(poleGeo, steel);
  pole.position.y = towerHeight / 2 + 0.5;
  group.add(pole);

  // Maintenance ladders
  const ladderGroup = new THREE.Group();
  const rungGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
  for (let i = 0; i < towerHeight; i += 1.5) {
    const rung = new THREE.Mesh(rungGeo, aluminum);
    rung.position.set(0, i + 1, 1.6 - (i / towerHeight));
    ladderGroup.add(rung);
  }
  group.add(ladderGroup);

  // Antenna mounting rings
  const mountGeo = new THREE.TorusGeometry(3.5, 0.2, 8, 32);
  
  const mount1 = new THREE.Mesh(mountGeo, darkSteel);
  mount1.position.y = 25;
  mount1.rotation.x = Math.PI / 2;
  group.add(mount1);
  
  const mount2 = new THREE.Mesh(mountGeo, darkSteel);
  mount2.position.y = 30;
  mount2.rotation.x = Math.PI / 2;
  group.add(mount2);

  const mount3 = new THREE.Mesh(mountGeo, darkSteel);
  mount3.position.y = 34;
  mount3.rotation.x = Math.PI / 2;
  group.add(mount3);

  // 5G Massive MIMO Antennas
  const panelGeo = new THREE.BoxGeometry(0.6, 2.5, 0.2);
  for(let i=0; i<3; i++) {
     const angle = (i * Math.PI * 2) / 3;
     
     // Lower band antennas
     const panel1 = new THREE.Mesh(panelGeo, whitePlastic);
     panel1.position.set(Math.cos(angle) * 3.5, 25, Math.sin(angle) * 3.5);
     panel1.rotation.y = -angle + Math.PI/2;
     group.add(panel1);
     
     // Mid band antennas
     const panel2 = new THREE.Mesh(panelGeo, whitePlastic);
     panel2.position.set(Math.cos(angle) * 3.5, 30, Math.sin(angle) * 3.5);
     panel2.rotation.y = -angle + Math.PI/2;
     group.add(panel2);

     // High band mmWave antennas (smaller)
     const mmGeo = new THREE.BoxGeometry(0.4, 1.0, 0.15);
     const panel3 = new THREE.Mesh(mmGeo, whitePlastic);
     panel3.position.set(Math.cos(angle) * 3.5, 34, Math.sin(angle) * 3.5);
     panel3.rotation.y = -angle + Math.PI/2;
     group.add(panel3);
  }

  // Cables running up the pole
  const cableGeo = new THREE.CylinderGeometry(0.2, 0.2, towerHeight, 8);
  const cables = new THREE.Mesh(cableGeo, blackPlastic);
  cables.position.set(1.5, towerHeight/2 + 0.5, 0);
  group.add(cables);

  // Blinking Aviation Light
  const lightGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const avMaterial = redAccent.clone();
  avMaterial.emissive = new THREE.Color(0xff0000);
  const avLight = new THREE.Mesh(lightGeo, avMaterial);
  avLight.position.y = towerHeight + 1;
  avLight.name = "avLight5G";
  group.add(avLight);

  // Blinking Cabinet Lights (Data processing)
  const ledGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const ledMat1 = greenAccent.clone();
  ledMat1.emissive = new THREE.Color(0x00ff00);
  const led1 = new THREE.Mesh(ledGeo, ledMat1);
  led1.position.set(-2.5, 3.5, 4.05);
  led1.name = "cabinetLed1";
  group.add(led1);
  
  const ledMat2 = blueAccent.clone();
  ledMat2.emissive = new THREE.Color(0x0088ff);
  const led2 = new THREE.Mesh(ledGeo, ledMat2);
  led2.position.set(2.5, 3.5, 4.05);
  led2.name = "cabinetLed2";
  group.add(led2);

  // Animation for blinking lights
  const times = [0, 0.5, 1.0, 1.5, 2.0];
  const avValues = [0, 1, 0, 1, 0];
  const avTrack = new THREE.NumberKeyframeTrack("avLight5G.material.emissiveIntensity", times, avValues);
  
  const led1Times = [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 2.0];
  const led1Vals =  [1, 0, 1, 0, 1, 0, 1, 1];
  const ledTrack1 = new THREE.NumberKeyframeTrack("cabinetLed1.material.emissiveIntensity", led1Times, led1Vals);
  
  const led2Times = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 2.0];
  const led2Vals =  [0, 1, 0, 1, 0, 1, 0, 0];
  const ledTrack2 = new THREE.NumberKeyframeTrack("cabinetLed2.material.emissiveIntensity", led2Times, led2Vals);

  const clip = new THREE.AnimationClip('TowerLightsBlink', 2.0, [avTrack, ledTrack1, ledTrack2]);
  animationClips.push(clip);

  return { group, animationClips };
}
