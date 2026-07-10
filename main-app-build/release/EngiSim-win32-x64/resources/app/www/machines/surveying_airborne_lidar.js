import {
  aluminum, blackPlastic, chrome, glass, fire, darkSteel
} from '../utils/materials.js';

export function createAirborneLiDAR(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // 1. Mount Frame
  const frameGeo = new THREE.BoxGeometry(0.8, 0.1, 0.8);
  const frame = new THREE.Mesh(frameGeo, darkSteel);
  group.add(frame);

  // 2. Stabilized Gimbal
  const gimbalOuter = new THREE.Group();
  gimbalOuter.name = 'GimbalOuter';
  gimbalOuter.position.y = -0.15;

  const ring1Geo = new THREE.TorusGeometry(0.35, 0.03, 16, 64);
  const ring1 = new THREE.Mesh(ring1Geo, aluminum);
  ring1.rotation.x = Math.PI / 2;
  gimbalOuter.add(ring1);

  const gimbalInner = new THREE.Group();
  gimbalInner.name = 'GimbalInner';
  
  const ring2Geo = new THREE.TorusGeometry(0.3, 0.03, 16, 64);
  const ring2 = new THREE.Mesh(ring2Geo, aluminum);
  ring2.rotation.y = Math.PI / 2;
  ring2.rotation.x = Math.PI / 2;
  gimbalInner.add(ring2);

  // 3. Sensor Pod (LiDAR)
  const podGroup = new THREE.Group();
  
  const podGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 32);
  const pod = new THREE.Mesh(podGeo, blackPlastic);
  pod.rotation.z = Math.PI / 2;
  podGroup.add(pod);

  // Scanning Window
  const windowGeo = new THREE.BoxGeometry(0.2, 0.05, 0.2);
  const windowMesh = new THREE.Mesh(windowGeo, glass);
  windowMesh.position.y = -0.14;
  podGroup.add(windowMesh);

  // Spinning Mirror
  const mirrorGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 3);
  const mirror = new THREE.Mesh(mirrorGeo, chrome);
  mirror.name = 'SpinningMirror';
  podGroup.add(mirror);

  // Fanning Lasers
  const lasers = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const laserGeo = new THREE.CylinderGeometry(0.002, 0.002, 2, 8);
    const laser = new THREE.Mesh(laserGeo, fire);
    laser.position.y = -1;
    laser.rotation.z = (i - 2) * 0.1;
    lasers.add(laser);
  }
  podGroup.add(lasers);

  gimbalInner.add(podGroup);
  gimbalOuter.add(gimbalInner);
  group.add(gimbalOuter);

  // Animation: Stabilization adjustments and scanning mirror rotation
  const duration = 2;
  
  const mirrorTrack = new THREE.NumberKeyframeTrack(
    `${mirror.name}.rotation[x]`,
    [0, 2],
    [0, Math.PI * 10] // Spin rapidly
  );

  const gimbalOuterTrack = new THREE.NumberKeyframeTrack(
    `${gimbalOuter.name}.rotation[x]`,
    [0, 0.5, 1, 1.5, 2],
    [0, 0.05, 0, -0.05, 0]
  );

  const gimbalInnerTrack = new THREE.NumberKeyframeTrack(
    `${gimbalInner.name}.rotation[z]`,
    [0, 0.5, 1, 1.5, 2],
    [0, -0.05, 0.05, 0, 0]
  );

  const clip = new THREE.AnimationClip('AirborneScan', duration, [mirrorTrack, gimbalOuterTrack, gimbalInnerTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
