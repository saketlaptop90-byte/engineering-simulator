import * as mats from '../utils/materials.js';

export function createTidalBarrage(THREE) {
  const group = new THREE.Group();

  // Main Conduit
  const conduitGeo = new THREE.CylinderGeometry(6, 6, 20, 32, 1, true);
  const conduit = new THREE.Mesh(conduitGeo, mats.castIron);
  conduit.rotation.z = Math.PI / 2;
  group.add(conduit);

  // Stator / Guide Vanes
  const statorGeo = new THREE.CylinderGeometry(5.8, 5.8, 2, 16, 1, true);
  const stator = new THREE.Mesh(statorGeo, mats.steel);
  stator.rotation.z = Math.PI / 2;
  stator.position.x = -4;
  group.add(stator);

  const axisGroup = new THREE.Group();
  axisGroup.rotation.z = Math.PI / 2;
  group.add(axisGroup);

  const rotor = new THREE.Group();
  rotor.name = 'TidalRotor';
  axisGroup.add(rotor);

  const hubGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
  const hub = new THREE.Mesh(hubGeo, mats.steel);
  rotor.add(hub);

  const bladeGeo = new THREE.BoxGeometry(0.3, 4.5, 1.5);
  bladeGeo.translate(0, 3, 0); 
  for (let i = 0; i < 4; i++) {
    const blade = new THREE.Mesh(bladeGeo, mats.titanium);
    blade.rotation.y = (i * Math.PI) / 2;
    blade.rotateX(Math.PI / 8); 
    rotor.add(blade);
  }

  // Animation
  const times = [0, 0.5, 1, 1.5, 2];
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);
  const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
  
  const values = [
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
    q3.x, q3.y, q3.z, q3.w,
    q4.x, q4.y, q4.z, q4.w,
    q5.x, q5.y, q5.z, q5.w
  ];
  
  const track = new THREE.QuaternionKeyframeTrack('TidalRotor.quaternion', times, values);
  const clip = new THREE.AnimationClip('Spin', 2, [track]);

  return { group, animationClips: [clip] };
}
