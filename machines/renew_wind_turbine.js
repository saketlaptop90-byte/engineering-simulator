import * as mats from '../utils/materials.js';

export function createWindTurbine(THREE) {
  const group = new THREE.Group();

  // Tower
  const towerGeo = new THREE.CylinderGeometry(1.5, 2.5, 50, 16);
  const tower = new THREE.Mesh(towerGeo, mats.whitePlastic);
  tower.position.y = 25;
  group.add(tower);

  // Nacelle Group (yaws)
  const nacelleGroup = new THREE.Group();
  nacelleGroup.position.y = 50;
  nacelleGroup.name = 'WindNacelle';
  group.add(nacelleGroup);

  const nacelleGeo = new THREE.BoxGeometry(4, 3, 8);
  const nacelle = new THREE.Mesh(nacelleGeo, mats.whitePlastic);
  nacelle.position.z = 2; // Offset
  nacelleGroup.add(nacelle);

  // Rotor Group
  const rotorGroup = new THREE.Group();
  rotorGroup.position.set(0, 0, -2);
  rotorGroup.name = 'WindRotor';
  nacelleGroup.add(rotorGroup);

  const hubGeo = new THREE.SphereGeometry(1.5, 16, 16);
  const hub = new THREE.Mesh(hubGeo, mats.whitePlastic);
  rotorGroup.add(hub);

  // Blades
  const bladeGeo = new THREE.BoxGeometry(1, 20, 0.5);
  bladeGeo.translate(0, 10, 0);
  for(let i=0; i<3; i++) {
    const blade = new THREE.Mesh(bladeGeo, mats.whitePlastic);
    blade.rotation.z = (i / 3) * Math.PI * 2;
    blade.rotation.y = Math.PI / 12; // pitch
    rotorGroup.add(blade);
  }

  // Animations
  const timesSpin = [0, 0.5, 1, 1.5, 2];
  const qSpin1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
  const qSpin2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
  const qSpin3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
  const qSpin4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 1.5);
  const qSpin5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);
  const valuesSpin = [
    qSpin1.x, qSpin1.y, qSpin1.z, qSpin1.w,
    qSpin2.x, qSpin2.y, qSpin2.z, qSpin2.w,
    qSpin3.x, qSpin3.y, qSpin3.z, qSpin3.w,
    qSpin4.x, qSpin4.y, qSpin4.z, qSpin4.w,
    qSpin5.x, qSpin5.y, qSpin5.z, qSpin5.w
  ];
  const trackSpin = new THREE.QuaternionKeyframeTrack('WindRotor.quaternion', timesSpin, valuesSpin);

  const timesYaw = [0, 5, 10];
  const qYaw1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/6);
  const qYaw2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/6);
  const qYaw3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/6);
  const valuesYaw = [
    qYaw1.x, qYaw1.y, qYaw1.z, qYaw1.w,
    qYaw2.x, qYaw2.y, qYaw2.z, qYaw2.w,
    qYaw3.x, qYaw3.y, qYaw3.z, qYaw3.w
  ];
  const trackYaw = new THREE.QuaternionKeyframeTrack('WindNacelle.quaternion', timesYaw, valuesYaw);

  const clipSpin = new THREE.AnimationClip('Spin', 2, [trackSpin]);
  const clipYaw = new THREE.AnimationClip('Yaw', 10, [trackYaw]);

  return { group, animationClips: [clipSpin, clipYaw] };
}
