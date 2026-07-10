import { castIron, steel, greenAccent, rubber, aluminum } from '../utils/materials.js';

export function createCenterlessGrinder(THREE) {
  const group = new THREE.Group();
  group.name = 'CenterlessGrinder';

  // Main Base
  const baseGeo = new THREE.BoxGeometry(4, 2, 3);
  const base = new THREE.Mesh(baseGeo, castIron);
  base.position.set(0, 1, 0);
  group.add(base);

  // Grinding Wheel (Large, fast)
  const grindWheelGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
  grindWheelGeo.rotateX(Math.PI / 2);
  const grindWheel = new THREE.Mesh(grindWheelGeo, steel);
  grindWheel.position.set(-1, 2.5, 0);
  group.add(grindWheel);

  // Regulating Wheel (Smaller, rubber, slower)
  const regWheelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 32);
  regWheelGeo.rotateX(Math.PI / 2);
  
  const regWheelGroup = new THREE.Group();
  regWheelGroup.position.set(1, 2.2, 0);
  regWheelGroup.rotation.y = 0.05; // slight tilt angle
  group.add(regWheelGroup);

  const regWheel = new THREE.Mesh(regWheelGeo, rubber);
  regWheelGroup.add(regWheel);

  // Work Rest Blade
  const bladeGeo = new THREE.BoxGeometry(0.1, 0.5, 0.6);
  const blade = new THREE.Mesh(bladeGeo, greenAccent);
  blade.position.set(0, 2.1, 0);
  group.add(blade);

  // Workpiece (Cylinder moving through)
  const workpieceGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
  workpieceGeo.rotateX(Math.PI / 2);
  const workpiece = new THREE.Mesh(workpieceGeo, aluminum);
  workpiece.position.set(0, 2.4, 1);
  group.add(workpiece);

  // Animations
  const duration = 4;
  const steps = 20;
  const times = [];
  for (let i = 0; i <= steps; i++) times.push((i / steps) * duration);
  
  // Grinding wheel spinning fast
  const grindRot = [];
  for (let i = 0; i <= steps; i++) {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -i * Math.PI * 0.5);
    grindRot.push(q.x, q.y, q.z, q.w);
  }
  const grindTrack = new THREE.QuaternionKeyframeTrack(`${grindWheel.uuid}.quaternion`, times, grindRot);

  // Regulating wheel spinning slower
  const regRot = [];
  for (let i = 0; i <= steps; i++) {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -i * Math.PI * 0.2);
    regRot.push(q.x, q.y, q.z, q.w);
  }
  const regTrack = new THREE.QuaternionKeyframeTrack(`${regWheel.uuid}.quaternion`, times, regRot);

  // Workpiece moving Z and rotating
  const workTimes = [0, 1, 2, 3, 4];
  const workPos = [
    0, 2.4, 2,
    0, 2.4, 1,
    0, 2.4, 0,
    0, 2.4, -1,
    0, 2.4, -2
  ];
  const workTrackPos = new THREE.VectorKeyframeTrack(`${workpiece.uuid}.position`, workTimes, workPos);

  const workRot = [];
  for (let i = 0; i <= steps; i++) {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -i * Math.PI * 0.4);
    workRot.push(q.x, q.y, q.z, q.w);
  }
  const workTrackRot = new THREE.QuaternionKeyframeTrack(`${workpiece.uuid}.quaternion`, times, workRot);

  const clip = new THREE.AnimationClip('CenterlessGrind', 4, [grindTrack, regTrack, workTrackPos, workTrackRot]);

  return { group, animationClips: [clip] };
}
