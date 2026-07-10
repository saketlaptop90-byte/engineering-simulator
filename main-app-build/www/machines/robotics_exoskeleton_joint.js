import { carbonFiber, aluminum, blueAccent, steel, darkSteel } from '../utils/materials.js';

export function createExoskeletonJoint(THREE) {
  const group = new THREE.Group();
  group.name = 'ExoskeletonJoint';

  const tracks = [];
  const animDuration = 4;

  // Thigh Segment
  const thighGroup = new THREE.Group();
  group.add(thighGroup);

  const thighBarGeo = new THREE.BoxGeometry(1, 6, 1);
  thighBarGeo.translate(0, 3, 0);
  const thighBar = new THREE.Mesh(thighBarGeo, carbonFiber);
  thighGroup.add(thighBar);

  const jointHubGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32);
  jointHubGeo.rotateX(Math.PI / 2);
  const jointHub = new THREE.Mesh(jointHubGeo, blueAccent);
  thighGroup.add(jointHub);

  // Calf Segment
  const calfGroup = new THREE.Group();
  group.add(calfGroup);

  const calfBarGeo = new THREE.BoxGeometry(0.8, 6, 0.8);
  calfBarGeo.translate(0, -3, 0);
  const calfBar = new THREE.Mesh(calfBarGeo, aluminum);
  calfGroup.add(calfBar);

  // Actuator (Hydraulic/Linear Cylinder)
  const cylinderGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
  cylinderGeo.translate(0, 1.5, 0);
  const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
  
  // Actuator Pivot on Thigh
  const actPivotThigh = new THREE.Group();
  actPivotThigh.position.set(0, 4, 1);
  thighGroup.add(actPivotThigh);
  actPivotThigh.add(cylinder);

  // Piston shaft
  const pistonGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
  pistonGeo.translate(0, 1.5, 0);
  const piston = new THREE.Mesh(pistonGeo, steel);
  cylinder.add(piston);

  // Actuator Pivot on Calf
  const actPivotCalf = new THREE.Group();
  actPivotCalf.position.set(0, -2, 1);
  calfGroup.add(actPivotCalf);

  // Animation logic
  // Calf rotates back and forth
  const times = [0, 2, 4];
  
  const angleExt = 0; // Fully extended
  const angleFlex = -Math.PI / 1.5; // Flexed
  
  const qExt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), angleExt);
  const qFlex = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), angleFlex);

  tracks.push(new THREE.QuaternionKeyframeTrack(
    `${calfGroup.uuid}.quaternion`,
    times,
    [qExt.x, qExt.y, qExt.z, qExt.w, qFlex.x, qFlex.y, qFlex.z, qFlex.w, qExt.x, qExt.y, qExt.z, qExt.w]
  ));

  // Note: To make the linear actuator perfectly track the attachment points requires IK or lookAt updates per frame.
  // In pure KeyframeTrack, we approximate the piston extension and cylinder rotation.
  // We approximate the extension length and angles.
  const lExt = 0; // Shaft hidden
  const lFlex = 2.5; // Shaft extended
  const pExt = new THREE.Vector3(0, lExt, 0);
  const pFlex = new THREE.Vector3(0, -lFlex, 0);

  tracks.push(new THREE.VectorKeyframeTrack(
    `${piston.uuid}.position`,
    times,
    [pExt.x, pExt.y, pExt.z, pFlex.x, pFlex.y, pFlex.z, pExt.x, pExt.y, pExt.z]
  ));

  const aExt = -0.1;
  const aFlex = -0.8;
  const qaExt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), aExt);
  const qaFlex = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), aFlex);
  
  tracks.push(new THREE.QuaternionKeyframeTrack(
    `${actPivotThigh.uuid}.quaternion`,
    times,
    [qaExt.x, qaExt.y, qaExt.z, qaExt.w, qaFlex.x, qaFlex.y, qaFlex.z, qaFlex.w, qaExt.x, qaExt.y, qaExt.z, qaExt.w]
  ));

  const clip = new THREE.AnimationClip('LegFlex', animDuration, tracks);

  return { group, animationClips: [clip] };
}
