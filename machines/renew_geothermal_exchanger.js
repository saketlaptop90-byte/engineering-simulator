import * as mats from '../utils/materials.js';

export function createGeothermalExchanger(THREE) {
  const group = new THREE.Group();

  // Heat Exchanger Body
  const hxGeo = new THREE.BoxGeometry(8, 10, 6);
  const hx = new THREE.Mesh(hxGeo, mats.darkSteel);
  hx.position.y = 5;
  group.add(hx);

  // Pipes (Hot IN / OUT)
  const pipeGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
  const hotIn = new THREE.Mesh(pipeGeo, mats.redAccent);
  hotIn.position.set(-2, 0, 0);
  group.add(hotIn);
  
  const hotOut = new THREE.Mesh(pipeGeo, mats.orangeAccent);
  hotOut.position.set(-2, 10, 0);
  group.add(hotOut);

  // Pipes (Cold IN / OUT)
  const coldIn = new THREE.Mesh(pipeGeo, mats.blueAccent);
  coldIn.position.set(2, 0, 0);
  group.add(coldIn);
  
  const coldOut = new THREE.Mesh(pipeGeo, mats.blueAccent);
  coldOut.position.set(2, 10, 0);
  group.add(coldOut);
  
  // Turbine / Fan inside (visible through a cutout or on top)
  const fanGroup = new THREE.Group();
  fanGroup.position.set(0, 10, 0);
  fanGroup.name = 'GeothermalFan';
  group.add(fanGroup);
  
  const fanHousingGeo = new THREE.CylinderGeometry(2.5, 2.5, 2, 16, 1, true);
  const fanHousing = new THREE.Mesh(fanHousingGeo, mats.steel);
  group.add(fanHousing);
  fanHousing.position.set(0, 10, 0);
  
  const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
  const hub = new THREE.Mesh(hubGeo, mats.aluminum);
  fanGroup.add(hub);
  
  const bladeGeo = new THREE.BoxGeometry(2, 0.1, 0.8);
  bladeGeo.translate(1.2, 0, 0);
  for(let i=0; i<6; i++) {
    const blade = new THREE.Mesh(bladeGeo, mats.titanium);
    blade.rotation.y = (i / 6) * Math.PI * 2;
    blade.rotation.x = Math.PI / 6;
    fanGroup.add(blade);
  }

  // Animation
  const times = [0, 0.25, 0.5, 0.75, 1];
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
  
  const track = new THREE.QuaternionKeyframeTrack('GeothermalFan.quaternion', times, values);
  const clip = new THREE.AnimationClip('SpinFan', 1, [track]);

  return { group, animationClips: [clip] };
}
