import { aluminum, blackPlastic, rubber, orangeAccent, steel } from '../utils/materials.js';

export function createOmniWheelBase(THREE) {
  const group = new THREE.Group();
  group.name = 'OmniWheelBase';

  // Chassis
  const chassisGeo = new THREE.BoxGeometry(6, 1, 6);
  const chassis = new THREE.Mesh(chassisGeo, aluminum);
  chassis.position.y = 1.5;
  group.add(chassis);

  const topPlateGeo = new THREE.BoxGeometry(5, 0.2, 5);
  const topPlate = new THREE.Mesh(topPlateGeo, blackPlastic);
  topPlate.position.y = 0.6;
  chassis.add(topPlate);

  const tracks = [];
  const wheels = [];

  const createWheel = (x, z, rotationY) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(x, 1.5, z);
    wheelGroup.rotation.y = rotationY;
    
    // Main hub
    const hubGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 32);
    hubGeo.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, orangeAccent);
    wheelGroup.add(hub);

    // Rollers
    const numRollers = 12;
    for (let i = 0; i < numRollers; i++) {
      const angle = (i * Math.PI * 2) / numRollers;
      const rollerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
      rollerGeo.rotateZ(Math.PI / 2);
      const roller = new THREE.Mesh(rollerGeo, rubber);
      
      const distance = 1.3;
      roller.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, 0);
      roller.rotation.z = angle;
      hub.add(roller);
    }

    wheels.push(hub);
    group.add(wheelGroup);
  };

  createWheel(3.2, 3.2, -Math.PI / 4);
  createWheel(-3.2, 3.2, Math.PI / 4);
  createWheel(3.2, -3.2, Math.PI / 4);
  createWheel(-3.2, -3.2, -Math.PI / 4);

  // Animation: Chassis translating while wheels spin
  const animDuration = 4;
  const times = [0, 1, 2, 3, 4];
  
  // Base position translation
  const posValues = [
    0, 0, 0,
    2, 0, 2,
    0, 0, 4,
    -2, 0, 2,
    0, 0, 0
  ];
  tracks.push(new THREE.VectorKeyframeTrack(`${group.uuid}.position`, times, posValues));

  // Wheel rotation (spin forward / sideways)
  wheels.forEach((hub, i) => {
    // Just a continuous rotation for visual effect
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 2);
    const wTimes = [0, 2, 4];
    const wValues = [
      q0.x, q0.y, q0.z, q0.w,
      q1.x, q1.y, q1.z, q1.w,
      q2.x, q2.y, q2.z, q2.w,
    ];
    tracks.push(new THREE.QuaternionKeyframeTrack(`${hub.uuid}.quaternion`, wTimes, wValues));
  });

  const clip = new THREE.AnimationClip('OmniDrive', animDuration, tracks);

  return { group, animationClips: [clip] };
}
