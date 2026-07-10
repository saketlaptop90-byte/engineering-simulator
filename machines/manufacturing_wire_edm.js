import { whitePlastic, darkSteel, steel, blueAccent, brass, glass, electrolyte } from '../utils/materials.js';

export function createWireEDM(THREE) {
  const group = new THREE.Group();
  group.name = 'WireEDMMachine';

  // Base
  const baseGeo = new THREE.BoxGeometry(3, 1.5, 3);
  const base = new THREE.Mesh(baseGeo, whitePlastic);
  base.position.set(0, 0.75, 0);
  group.add(base);

  // Work tank
  const tankGeo = new THREE.BoxGeometry(2, 1, 2);
  const tank = new THREE.Mesh(tankGeo, darkSteel);
  tank.position.set(0, 2, 0);
  group.add(tank);

  // Fluid in tank
  const fluidGeo = new THREE.BoxGeometry(1.9, 0.8, 1.9);
  const fluid = new THREE.Mesh(fluidGeo, electrolyte);
  fluid.position.set(0, 2.1, 0);
  group.add(fluid);

  // Workpiece
  const workGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
  const workpiece = new THREE.Mesh(workGeo, steel);
  workpiece.position.set(0, 2.2, 0);
  group.add(workpiece);

  // Upper head
  const headGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
  const head = new THREE.Mesh(headGeo, blueAccent);
  head.position.set(0, 3.5, 0);
  group.add(head);

  // Wire
  const wireGeo = new THREE.CylinderGeometry(0.005, 0.005, 2, 8);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xd4a844 });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  wire.position.set(0, 2.5, 0);
  group.add(wire);

  // Sparks (Particle System placeholder)
  const sparkGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sparks = new THREE.Mesh(sparkGeo, sparkMat);
  sparks.position.set(0, 2.2, 0);
  group.add(sparks);

  // Animation
  const times = [0, 1, 2, 3, 4];

  // Head moving
  const headPos = [
    0, 3.5, 0,
    0.2, 3.5, 0.2,
    -0.2, 3.5, -0.2,
    0, 3.5, 0,
    0, 3.5, 0
  ];
  const headTrack = new THREE.VectorKeyframeTrack(`${head.uuid}.position`, times, headPos);

  // Wire moving to follow head
  const wirePos = [
    0, 2.5, 0,
    0.2, 2.5, 0.2,
    -0.2, 2.5, -0.2,
    0, 2.5, 0,
    0, 2.5, 0
  ];
  const wireTrack = new THREE.VectorKeyframeTrack(`${wire.uuid}.position`, times, wirePos);

  // Spark scaling to simulate flickering
  const sparkScaleTimes = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
  const sparkScale = [
    1, 1, 1,
    0.2, 0.2, 0.2,
    1.5, 1.5, 1.5,
    0.1, 0.1, 0.1,
    2, 2, 2,
    0.5, 0.5, 0.5,
    1.2, 1.2, 1.2,
    0.2, 0.2, 0.2,
    1, 1, 1
  ];
  const sparkTrack = new THREE.VectorKeyframeTrack(`${sparks.uuid}.scale`, sparkScaleTimes, sparkScale);

  // Spark position following wire
  const sparkPosTimes = [0, 1, 2, 3, 4];
  const sparkPos = [
    0, 2.2, 0,
    0.2, 2.2, 0.2,
    -0.2, 2.2, -0.2,
    0, 2.2, 0,
    0, 2.2, 0
  ];
  const sparkPosTrack = new THREE.VectorKeyframeTrack(`${sparks.uuid}.position`, sparkPosTimes, sparkPos);

  const clip = new THREE.AnimationClip('WireEDMCutting', 4, [headTrack, wireTrack, sparkTrack, sparkPosTrack]);

  return { group, animationClips: [clip] };
}
