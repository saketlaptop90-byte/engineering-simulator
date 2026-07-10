import { whitePlastic, carbonFiber, blueAccent, steel, darkSteel } from '../utils/materials.js';

export function createCoolingTowerFan(THREE) {
  const group = new THREE.Group();
  const animationClips = [];
  
  // Tower Basin
  const basinGeo = new THREE.BoxGeometry(6, 1.5, 6);
  const basin = new THREE.Mesh(basinGeo, darkSteel);
  basin.position.set(0, 0.75, 0);
  group.add(basin);
  
  // Tower Body
  const bodyGeo = new THREE.CylinderGeometry(2.5, 3, 5, 16);
  const body = new THREE.Mesh(bodyGeo, whitePlastic);
  body.position.set(0, 4, 0);
  group.add(body);
  
  // Air Inlets (Louvers)
  const louverGeo = new THREE.BoxGeometry(5.5, 1.5, 5.5);
  const louver = new THREE.Mesh(louverGeo, steel);
  louver.position.set(0, 1.5, 0);
  group.add(louver);
  
  // Fan Shroud
  const shroudGeo = new THREE.CylinderGeometry(2.6, 2.5, 1, 32);
  const shroud = new THREE.Mesh(shroudGeo, darkSteel);
  shroud.position.set(0, 7, 0);
  group.add(shroud);
  
  // Fan (Rotating around Y, default Y axis points up, so it's correct)
  const fanGroup = new THREE.Group();
  fanGroup.position.set(0, 6.8, 0);
  fanGroup.name = "CoolingTowerFan";
  
  const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
  const hub = new THREE.Mesh(hubGeo, steel);
  fanGroup.add(hub);
  
  for(let i=0; i<4; i++) {
    const bladeGeo = new THREE.BoxGeometry(2.2, 0.05, 0.6);
    const blade = new THREE.Mesh(bladeGeo, carbonFiber);
    blade.position.set(1.4, 0, 0);
    blade.rotation.x = Math.PI / 6; // pitch
    
    const pivot = new THREE.Group();
    pivot.rotation.y = (Math.PI / 2) * i;
    pivot.add(blade);
    fanGroup.add(pivot);
  }
  
  group.add(fanGroup);
  
  // Water Pipe
  const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
  const pipe = new THREE.Mesh(pipeGeo, blueAccent);
  pipe.position.set(3, 4, 0);
  group.add(pipe);
  
  // Animation: Fan rotation around local Y axis
  const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
  
  const rotValues = [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
  ];
  const track = new THREE.QuaternionKeyframeTrack('CoolingTowerFan.quaternion', [0, 0.5, 1.0], rotValues);
  const clip = new THREE.AnimationClip('TowerFanRun', 1.0, [track]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
