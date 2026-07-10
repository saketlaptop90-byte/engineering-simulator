import {
  steel, yellowAccent, darkSteel, rubber, blackPlastic, glass, blueAccent
} from '../utils/materials.js';

export function createAGV(THREE) {
  const group = new THREE.Group();
  group.name = "AGV";
  
  const chassisGeo = new THREE.BoxGeometry(2, 0.4, 3);
  const chassis = new THREE.Mesh(chassisGeo, yellowAccent);
  chassis.position.y = 0.4;
  group.add(chassis);
  
  const bumperGeo = new THREE.BoxGeometry(2.1, 0.3, 3.1);
  const bumper = new THREE.Mesh(bumperGeo, darkSteel);
  bumper.position.y = 0.3;
  group.add(bumper);

  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
  wheelGeo.rotateZ(Math.PI / 2);
  const wheels = [];
  
  const wheelPositions = [
    [-1.05, 0.3, 1.2],
    [1.05, 0.3, 1.2],
    [-1.05, 0.3, -1.2],
    [1.05, 0.3, -1.2]
  ];
  
  wheelPositions.forEach((pos, i) => {
    const wheel = new THREE.Mesh(wheelGeo, rubber);
    wheel.name = `agv_wheel_${i}`;
    wheel.position.set(...pos);
    group.add(wheel);
    wheels.push(wheel);
  });
  
  const lidarBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
  const lidarBase = new THREE.Mesh(lidarBaseGeo, blackPlastic);
  lidarBase.position.set(0, 0.7, 1);
  group.add(lidarBase);
  
  const lidarScannerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.15, 16);
  const lidarScanner = new THREE.Mesh(lidarScannerGeo, glass);
  lidarScanner.name = "agv_lidarScanner";
  lidarScanner.position.set(0, 0.85, 1);
  group.add(lidarScanner);

  const lidarTopGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
  const lidarTop = new THREE.Mesh(lidarTopGeo, blueAccent);
  lidarTop.name = "agv_lidarTop";
  lidarTop.position.set(0, 0.95, 1);
  group.add(lidarTop);
  
  const animationClips = [];
  const duration = 2;
  const times = [0, 0.5, 1, 1.5, 2];
  
  const wheelQuatValues = [];
  [0, Math.PI/2, Math.PI, Math.PI*1.5, Math.PI*2].forEach(angle => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
    q.toArray(wheelQuatValues, wheelQuatValues.length);
  });

  const wheelTracks = wheels.map((wheel) => {
    return new THREE.QuaternionKeyframeTrack(`${wheel.name}.quaternion`, times, wheelQuatValues);
  });
  
  const lidarQuatValues = [];
  [0, Math.PI/2, Math.PI, Math.PI*1.5, Math.PI*2].forEach(angle => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    q.toArray(lidarQuatValues, lidarQuatValues.length);
  });
  
  const lidarTrack = new THREE.QuaternionKeyframeTrack(`agv_lidarScanner.quaternion`, times, lidarQuatValues);
  const lidarTopTrack = new THREE.QuaternionKeyframeTrack(`agv_lidarTop.quaternion`, times, lidarQuatValues);
  
  const clip = new THREE.AnimationClip('AGV_Operating', duration, [...wheelTracks, lidarTrack, lidarTopTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
