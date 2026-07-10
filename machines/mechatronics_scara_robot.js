import {
  steel, aluminum, castIron, chrome, darkSteel, blueAccent
} from '../utils/materials.js';

export function createSCARARobot(THREE) {
  const group = new THREE.Group();

  // Base
  const baseGeo = new THREE.CylinderGeometry(0.8, 1, 1, 32);
  const base = new THREE.Mesh(baseGeo, castIron);
  base.position.y = 0.5;
  group.add(base);

  // Link 1 (Shoulder)
  const link1 = new THREE.Group();
  link1.position.y = 1;
  group.add(link1);

  const shoulderMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32), darkSteel);
  shoulderMotor.position.y = 0.6;
  link1.add(shoulderMotor);

  const arm1Geo = new THREE.BoxGeometry(2.5, 0.5, 0.8);
  const arm1 = new THREE.Mesh(arm1Geo, aluminum);
  arm1.position.set(1.25, 0.85, 0);
  link1.add(arm1);

  // Link 2 (Elbow)
  const link2 = new THREE.Group();
  link2.position.set(2.5, 1.1, 0);
  link1.add(link2);

  const elbowJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.6, 32), darkSteel);
  link2.add(elbowJoint);

  const arm2Geo = new THREE.BoxGeometry(2.0, 0.4, 0.6);
  const arm2 = new THREE.Mesh(arm2Geo, aluminum);
  arm2.position.set(1.0, 0, 0);
  link2.add(arm2);

  // Z-Axis Assembly
  const zAxis = new THREE.Group();
  zAxis.position.set(2.0, 0, 0);
  link2.add(zAxis);

  const zSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 32), blueAccent);
  zSleeve.position.y = 0.2;
  zAxis.add(zSleeve);

  const zShaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
  const zShaft = new THREE.Mesh(zShaftGeo, chrome);
  zAxis.add(zShaft);

  const tool = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 16), steel);
  tool.position.y = -1.2;
  tool.rotation.x = Math.PI;
  zShaft.add(tool);

  // Animations
  const duration = 4;
  
  const shoulderKF = new THREE.NumberKeyframeTrack('.rotation[y]', [0, 1, 2, 3, 4], [0, Math.PI / 2, Math.PI / 2, 0, 0]);
  const elbowKF = new THREE.NumberKeyframeTrack('.rotation[y]', [0, 1, 2, 3, 4], [0, -Math.PI / 2, -Math.PI / 4, 0, 0]);
  const zTransKF = new THREE.NumberKeyframeTrack('.position[y]', [0, 1, 1.5, 2, 3, 4], [0, 0, -0.5, -0.5, 0, 0]);

  const clip = new THREE.AnimationClip('SCARA_Motion', duration, [
    shoulderKF.clone().setPath(`${link1.uuid}.rotation[y]`),
    elbowKF.clone().setPath(`${link2.uuid}.rotation[y]`),
    zTransKF.clone().setPath(`${zShaft.uuid}.position[y]`)
  ]);

  return { group, animationClips: [clip] };
}
