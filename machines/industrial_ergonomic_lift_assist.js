import {
  castIron, yellowAccent, steel, rubber, darkSteel
} from '../utils/materials.js';

export function createErgonomicLiftAssist(THREE) {
  const group = new THREE.Group();
  group.name = "ErgonomicLiftAssist";
  
  const baseGeo = new THREE.CylinderGeometry(0.8, 1, 0.2, 32);
  const base = new THREE.Mesh(baseGeo, castIron);
  base.position.y = 0.1;
  group.add(base);

  const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
  const pillar = new THREE.Mesh(pillarGeo, yellowAccent);
  pillar.position.y = 1.5;
  group.add(pillar);
  
  const hubGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16);
  const hub = new THREE.Mesh(hubGeo, darkSteel);
  hub.name = "lift_hub";
  hub.position.y = 3;
  group.add(hub);
  
  const arm1Geo = new THREE.BoxGeometry(2, 0.2, 0.2);
  arm1Geo.translate(1, 0, 0);
  const arm1 = new THREE.Mesh(arm1Geo, yellowAccent);
  arm1.name = "lift_arm1";
  arm1.position.set(0, 0, 0);
  hub.add(arm1);
  
  const joint2Geo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
  const joint2 = new THREE.Mesh(joint2Geo, darkSteel);
  joint2.name = "lift_joint2";
  joint2.position.set(2, 0, 0);
  arm1.add(joint2);
  
  const arm2Geo = new THREE.BoxGeometry(1.5, 0.15, 0.15);
  arm2Geo.translate(0.75, 0, 0);
  const arm2 = new THREE.Mesh(arm2Geo, yellowAccent);
  arm2.name = "lift_arm2";
  arm2.position.set(0, 0, 0);
  joint2.add(arm2);
  
  const handleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
  const handle = new THREE.Mesh(handleGeo, steel);
  handle.name = "lift_handle";
  handle.position.set(1.5, -0.4, 0);
  arm2.add(handle);
  
  const gripsGeo = new THREE.BoxGeometry(0.6, 0.05, 0.05);
  const grips = new THREE.Mesh(gripsGeo, rubber);
  grips.position.set(0, -0.3, 0);
  handle.add(grips);

  const duration = 6;
  const times = [0, 1.5, 3, 4.5, 6];
  
  const hubQuats = [];
  [0, Math.PI/4, 0, -Math.PI/4, 0].forEach(angle => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    q.toArray(hubQuats, hubQuats.length);
  });
  const hubTrack = new THREE.QuaternionKeyframeTrack(`lift_hub.quaternion`, times, hubQuats);

  const arm1Quats = [];
  [0, Math.PI/8, 0, Math.PI/12, 0].forEach(angle => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    q.toArray(arm1Quats, arm1Quats.length);
  });
  const arm1Track = new THREE.QuaternionKeyframeTrack(`lift_arm1.quaternion`, times, arm1Quats);

  const arm2Quats = [];
  [0, -Math.PI/6, 0, -Math.PI/4, 0].forEach(angle => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    q.toArray(arm2Quats, arm2Quats.length);
  });
  const arm2Track = new THREE.QuaternionKeyframeTrack(`lift_joint2.quaternion`, times, arm2Quats);
  
  const handleYValues = [
    1.5, -0.4, 0,
    1.5, -1.0, 0,
    1.5, -0.4, 0,
    1.5, -0.8, 0,
    1.5, -0.4, 0
  ];
  const handleTrack = new THREE.VectorKeyframeTrack(`lift_handle.position`, times, handleYValues);

  const clip = new THREE.AnimationClip('LiftAssist_Action', duration, [hubTrack, arm1Track, arm2Track, handleTrack]);
  
  return { group, animationClips: [clip] };
}
