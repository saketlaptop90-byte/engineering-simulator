import { yellowAccent, blackPlastic, aluminum, glass, darkSteel } from '../utils/materials.js';

export function createAUV(THREE) {
  const group = new THREE.Group();
  group.name = 'AutonomousUnderwaterVehicle';

  const tracks = [];
  const animDuration = 5;

  // Main Hull (Torpedo shape)
  const hullGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
  hullGeo.rotateZ(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, yellowAccent);
  group.add(hull);

  // Nose Cone
  const noseGeo = new THREE.SphereGeometry(1.5, 32, 16);
  const nose = new THREE.Mesh(noseGeo, yellowAccent);
  nose.position.x = 5;
  hull.add(nose);

  // Camera Dome
  const domeGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const dome = new THREE.Mesh(domeGeo, glass);
  dome.position.set(5.5, 0, 0);
  hull.add(dome);

  // Tail Cone
  const tailGeo = new THREE.ConeGeometry(1.5, 3, 32);
  tailGeo.rotateZ(-Math.PI / 2);
  const tail = new THREE.Mesh(tailGeo, aluminum);
  tail.position.x = -6.5;
  hull.add(tail);

  // Main Propeller
  const propGroup = new THREE.Group();
  propGroup.position.x = -8.2;
  hull.add(propGroup);

  const hubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, darkSteel);
  propGroup.add(hub);

  for (let i = 0; i < 4; i++) {
    const bladeGeo = new THREE.BoxGeometry(0.1, 1.5, 0.4);
    bladeGeo.translate(0, 0.75, 0);
    const blade = new THREE.Mesh(bladeGeo, blackPlastic);
    blade.rotation.x = (i * Math.PI) / 2;
    blade.rotation.z = 0.3; // pitch
    hub.add(blade);
  }

  // Propeller animation
  const times = [0, 5];
  const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
  const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 10);
  tracks.push(new THREE.QuaternionKeyframeTrack(
    `${propGroup.uuid}.quaternion`,
    times,
    [qStart.x, qStart.y, qStart.z, qStart.w, qEnd.x, qEnd.y, qEnd.z, qEnd.w]
  ));

  // Control Fins
  const fins = [];
  for(let i=0; i<4; i++) {
    const finGeo = new THREE.BoxGeometry(1.2, 2.5, 0.1);
    finGeo.translate(0, 1.25, 0);
    const fin = new THREE.Mesh(finGeo, blackPlastic);
    
    const pivot = new THREE.Group();
    pivot.position.x = -5.5;
    pivot.rotation.x = (i * Math.PI) / 2;
    
    pivot.add(fin);
    hull.add(pivot);
    fins.push(fin);

    // Fin flap animation
    const fTimes = [0, 1.25, 2.5, 3.75, 5];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0.2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -0.2);
    
    tracks.push(new THREE.QuaternionKeyframeTrack(
      `${fin.uuid}.quaternion`,
      fTimes,
      [q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q0.x, q0.y, q0.z, q0.w, q2.x, q2.y, q2.z, q2.w, q0.x, q0.y, q0.z, q0.w]
    ));
  }

  // Floating bob animation
  const bTimes = [0, 2.5, 5];
  const bValues = [0, 0, 0,  0, 0.5, 0,  0, 0, 0];
  tracks.push(new THREE.VectorKeyframeTrack(
    `${group.uuid}.position`,
    bTimes,
    bValues
  ));

  const clip = new THREE.AnimationClip('AUV_Swim', animDuration, tracks);

  return { group, animationClips: [clip] };
}
