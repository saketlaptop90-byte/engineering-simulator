import { steel, castIron, aluminum, glass, blueAccent, darkSteel } from '../utils/materials.js';

export function create5AxisMill(THREE) {
  const group = new THREE.Group();
  group.name = '5AxisCNCMill';

  // Base
  const baseGeo = new THREE.BoxGeometry(4, 1, 3);
  const base = new THREE.Mesh(baseGeo, castIron);
  base.position.y = 0.5;
  group.add(base);

  // Enclosure
  const enclosureGeo = new THREE.BoxGeometry(4.2, 4, 3.2);
  const enclosureMat = glass.clone();
  enclosureMat.transparent = true;
  enclosureMat.opacity = 0.3;
  const enclosure = new THREE.Mesh(enclosureGeo, enclosureMat);
  enclosure.position.y = 3;
  group.add(enclosure);

  // Column
  const columnGeo = new THREE.BoxGeometry(1.5, 3, 1.5);
  const column = new THREE.Mesh(columnGeo, darkSteel);
  column.position.set(0, 2.5, -0.5);
  group.add(column);

  // Y-Axis Ram
  const yRamGeo = new THREE.BoxGeometry(1, 1, 2);
  const yRam = new THREE.Mesh(yRamGeo, steel);
  yRam.position.set(0, 3.5, 0);
  group.add(yRam);

  // Z-Axis Head
  const zHeadGeo = new THREE.BoxGeometry(0.8, 1.5, 0.8);
  const zHead = new THREE.Mesh(zHeadGeo, blueAccent);
  zHead.position.set(0, 3, 0.6);
  yRam.add(zHead);

  // Spindle
  const spindleGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
  const spindle = new THREE.Mesh(spindleGeo, steel);
  spindle.position.set(0, -0.75, 0);
  zHead.add(spindle);

  // Tool
  const toolGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
  const tool = new THREE.Mesh(toolGeo, aluminum);
  tool.position.set(0, -0.5, 0);
  spindle.add(tool);

  // Trunnion Table (A and C axes)
  const aAxisGroup = new THREE.Group();
  aAxisGroup.position.set(0, 1.5, 0.6);
  group.add(aAxisGroup);

  const trunnionSupportGeo = new THREE.BoxGeometry(2.5, 0.5, 1);
  const trunnionSupport = new THREE.Mesh(trunnionSupportGeo, castIron);
  aAxisGroup.add(trunnionSupport);

  const cAxisGroup = new THREE.Group();
  cAxisGroup.position.set(0, 0.25, 0);
  aAxisGroup.add(cAxisGroup);

  const rotaryTableGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
  const rotaryTable = new THREE.Mesh(rotaryTableGeo, steel);
  cAxisGroup.add(rotaryTable);

  const workpieceGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const workpiece = new THREE.Mesh(workpieceGeo, aluminum);
  workpiece.position.set(0, 0.35, 0);
  cAxisGroup.add(workpiece);

  // Animations
  const duration = 4;
  const steps = 20;
  const times = [];
  for (let i = 0; i <= steps; i++) times.push((i / steps) * duration);

  // Spindle rotation
  const spindleRot = [];
  for (let i = 0; i <= steps; i++) {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), i * Math.PI * 0.5);
    spindleRot.push(q.x, q.y, q.z, q.w);
  }
  const spindleTrack = new THREE.QuaternionKeyframeTrack(`${spindle.uuid}.quaternion`, times, spindleRot);

  // A-Axis Tilt
  const aTimes = [0, 1, 2, 3, 4];
  const aRot = [];
  const qA0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
  const qA1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
  const qA2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 6);
  aRot.push(
    qA0.x, qA0.y, qA0.z, qA0.w,
    qA1.x, qA1.y, qA1.z, qA1.w,
    qA2.x, qA2.y, qA2.z, qA2.w,
    qA1.x, qA1.y, qA1.z, qA1.w,
    qA0.x, qA0.y, qA0.z, qA0.w
  );
  const aTrack = new THREE.QuaternionKeyframeTrack(`${aAxisGroup.uuid}.quaternion`, aTimes, aRot);

  // C-Axis rotation
  const cRot = [];
  for (let i = 0; i <= steps; i++) {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), i * Math.PI * 0.25);
    cRot.push(q.x, q.y, q.z, q.w);
  }
  const cTrack = new THREE.QuaternionKeyframeTrack(`${cAxisGroup.uuid}.quaternion`, times, cRot);

  // Z-Axis movement
  const zPos = [
    0, 3, 0.6,
    0, 2.5, 0.6,
    0, 2.2, 0.6,
    0, 2.8, 0.6,
    0, 3, 0.6
  ];
  const zTrack = new THREE.VectorKeyframeTrack(`${zHead.uuid}.position`, aTimes, zPos);

  const clip = new THREE.AnimationClip('MillOperation', 4, [spindleTrack, aTrack, cTrack, zTrack]);

  return { group, animationClips: [clip] };
}
