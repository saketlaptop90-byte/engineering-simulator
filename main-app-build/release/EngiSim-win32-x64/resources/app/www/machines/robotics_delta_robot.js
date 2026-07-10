import { steel, aluminum, blackPlastic, yellowAccent, darkSteel, carbonFiber } from '../utils/materials.js';

export function createDeltaRobot(THREE) {
  const group = new THREE.Group();
  group.name = 'DeltaRobot';

  // Base plate
  const baseGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
  const baseNode = new THREE.Mesh(baseGeo, darkSteel);
  baseNode.position.y = 8;
  group.add(baseNode);

  // End effector
  const effectorGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
  const effectorNode = new THREE.Mesh(effectorGeo, aluminum);
  effectorNode.position.y = 2;
  group.add(effectorNode);

  // Arms
  const numArms = 3;
  const upperArmLength = 4;
  const lowerArmLength = 5;

  const armsGroup = new THREE.Group();
  baseNode.add(armsGroup);

  const tracks = [];
  const animDuration = 4; // seconds

  for (let i = 0; i < numArms; i++) {
    const angle = (i * Math.PI * 2) / numArms;
    
    // Arm base pivot
    const pivot = new THREE.Group();
    pivot.rotation.y = angle;
    armsGroup.add(pivot);

    // Upper arm
    const upperGeo = new THREE.BoxGeometry(0.4, upperArmLength, 0.4);
    // Move geometry so pivot is at top
    upperGeo.translate(0, -upperArmLength / 2, 0);
    const upperArm = new THREE.Mesh(upperGeo, yellowAccent);
    upperArm.position.set(1.5, 0, 0); // offset from center of base
    
    // Lower arm (parallelogram representation)
    const lowerGeo = new THREE.CylinderGeometry(0.1, 0.1, lowerArmLength, 8);
    lowerGeo.translate(0, -lowerArmLength / 2, 0);
    
    const lowerArm1 = new THREE.Mesh(lowerGeo, carbonFiber);
    lowerArm1.position.set(0.2, -upperArmLength, 0);
    const lowerArm2 = new THREE.Mesh(lowerGeo, carbonFiber);
    lowerArm2.position.set(-0.2, -upperArmLength, 0);

    upperArm.add(lowerArm1);
    upperArm.add(lowerArm2);
    pivot.add(upperArm);

    // Animate upper arm swing
    const times = [0, 1, 2, 3, 4];
    const offset = i * 0.5; // slight phase offset for circular motion
    const angle1 = Math.PI / 4 + Math.sin(offset) * 0.2;
    const angle2 = Math.PI / 6 + Math.cos(offset) * 0.4;
    const angle3 = Math.PI / 3 + Math.sin(offset) * 0.1;

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angle1);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angle2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angle3);
    
    const values = [
      q0.x, q0.y, q0.z, q0.w,
      q1.x, q1.y, q1.z, q1.w,
      q2.x, q2.y, q2.z, q2.w,
      q1.x, q1.y, q1.z, q1.w,
      q0.x, q0.y, q0.z, q0.w,
    ];

    const track = new THREE.QuaternionKeyframeTrack(
      `${upperArm.uuid}.quaternion`,
      times,
      values
    );
    tracks.push(track);
  }

  // End effector positional animation
  const efTimes = [0, 1, 2, 3, 4];
  const efValues = [
    0, 2, 0,
    1, 2.5, 1,
    0, 3, 0,
    -1, 1.5, -1,
    0, 2, 0
  ];
  const efTrack = new THREE.VectorKeyframeTrack(
    `${effectorNode.uuid}.position`,
    efTimes,
    efValues
  );
  tracks.push(efTrack);

  const clip = new THREE.AnimationClip('DeltaPickPlace', animDuration, tracks);
  const animationClips = [clip];

  return { group, animationClips };
}
