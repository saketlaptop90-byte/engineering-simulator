import * as mats from '../utils/materials.js';

export function createPumpedHydro(THREE) {
  const group = new THREE.Group();

  // Upper Reservoir
  const upperResGeo = new THREE.CylinderGeometry(15, 15, 5, 32);
  const upperRes = new THREE.Mesh(upperResGeo, mats.blueAccent);
  upperRes.position.set(-20, 30, 0);
  group.add(upperRes);
  
  const upperWallGeo = new THREE.CylinderGeometry(16, 16, 5.5, 32, 1, true);
  const upperWall = new THREE.Mesh(upperWallGeo, mats.castIron);
  upperWall.position.set(-20, 30.25, 0);
  group.add(upperWall);

  // Lower Reservoir
  const lowerResGeo = new THREE.CylinderGeometry(20, 20, 5, 32);
  const lowerRes = new THREE.Mesh(lowerResGeo, mats.blueAccent);
  lowerRes.position.set(20, 0, 0);
  group.add(lowerRes);

  const lowerWallGeo = new THREE.CylinderGeometry(21, 21, 5.5, 32, 1, true);
  const lowerWall = new THREE.Mesh(lowerWallGeo, mats.castIron);
  lowerWall.position.set(20, 0.25, 0);
  group.add(lowerWall);

  // Penstock (Pipe)
  const path = new THREE.LineCurve3(new THREE.Vector3(-15, 28, 0), new THREE.Vector3(10, 2, 0));
  const penstockGeo = new THREE.TubeGeometry(path, 20, 2, 16, false);
  const penstock = new THREE.Mesh(penstockGeo, mats.steel);
  group.add(penstock);

  // Turbine / Pump house
  const houseGeo = new THREE.BoxGeometry(8, 8, 8);
  const house = new THREE.Mesh(houseGeo, mats.whitePlastic);
  house.position.set(10, 2, 0);
  group.add(house);

  // Impeller inside house
  const impellerGroup = new THREE.Group();
  impellerGroup.position.set(10, 4, 4); // Stick out slightly
  impellerGroup.name = 'HydroImpeller';
  group.add(impellerGroup);

  const hubGeo = new THREE.CylinderGeometry(1, 1, 1.5, 16);
  const hub = new THREE.Mesh(hubGeo, mats.steel);
  hub.rotation.x = Math.PI / 2;
  impellerGroup.add(hub);

  const bladeGeo = new THREE.BoxGeometry(3, 0.1, 1.5);
  bladeGeo.translate(2, 0, 0);
  for(let i=0; i<8; i++) {
    const blade = new THREE.Mesh(bladeGeo, mats.aluminum);
    blade.rotation.z = (i / 8) * Math.PI * 2;
    blade.rotation.x = Math.PI / 4;
    impellerGroup.add(blade);
  }

  // Animation
  const times = [0, 0.25, 0.5, 0.75, 1];
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
  const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
  const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 1.5);
  const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);
  const values = [
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
    q3.x, q3.y, q3.z, q3.w,
    q4.x, q4.y, q4.z, q4.w,
    q5.x, q5.y, q5.z, q5.w
  ];
  const track = new THREE.QuaternionKeyframeTrack('HydroImpeller.quaternion', times, values);
  const clip = new THREE.AnimationClip('SpinImpeller', 1, [track]);

  return { group, animationClips: [clip] };
}
