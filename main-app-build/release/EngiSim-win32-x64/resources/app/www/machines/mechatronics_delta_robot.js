import {
  aluminum, carbonFiber, titanium, darkSteel, steel, orangeAccent
} from '../utils/materials.js';

export function createDeltaRobot(THREE) {
  const group = new THREE.Group();

  // Base Plate
  const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.4, 6), aluminum);
  basePlate.position.y = 5;
  group.add(basePlate);

  const arms = [];
  const forearms = [];

  // Create 3 Arms
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    
    // Servo Motor
    const motor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.2), darkSteel);
    motor.position.set(Math.cos(angle) * 1.5, 5, Math.sin(angle) * 1.5);
    motor.rotation.y = -angle;
    group.add(motor);

    // Bicep
    const bicep = new THREE.Group();
    bicep.position.copy(motor.position);
    bicep.rotation.y = -angle;
    group.add(bicep);
    
    const bicepMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2, 0.2), carbonFiber);
    bicepMesh.position.y = -1;
    bicep.add(bicepMesh);
    arms.push(bicep);

    // Forearm pair
    const forearmGroup = new THREE.Group();
    forearmGroup.position.y = -2;
    bicep.add(forearmGroup);

    const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), titanium);
    f1.position.set(0.15, -1.5, 0);
    forearmGroup.add(f1);

    const f2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), titanium);
    f2.position.set(-0.15, -1.5, 0);
    forearmGroup.add(f2);
    
    forearms.push(forearmGroup);
  }

  // End Effector
  const effector = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.3, 6), steel);
  effector.position.y = 0;
  group.add(effector);
  
  const tool = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), orangeAccent);
  tool.position.y = -0.4;
  effector.add(tool);

  // Animations
  const duration = 2;
  
  const effPosX = new THREE.NumberKeyframeTrack('.position[x]', [0, 0.5, 1, 1.5, 2], [0, 1.5, 0, -1.5, 0]);
  const effPosY = new THREE.NumberKeyframeTrack('.position[y]', [0, 0.5, 1, 1.5, 2], [0, 0.5, 0, 0.5, 0]);
  const effPosZ = new THREE.NumberKeyframeTrack('.position[z]', [0, 0.5, 1, 1.5, 2], [0, 1.5, 0, -1.5, 0]);

  // Bicep swings
  const bicep1Rot = new THREE.NumberKeyframeTrack('.rotation[x]', [0, 0.5, 1, 1.5, 2], [Math.PI/6, Math.PI/3, Math.PI/6, 0, Math.PI/6]);
  const bicep2Rot = new THREE.NumberKeyframeTrack('.rotation[x]', [0, 0.5, 1, 1.5, 2], [Math.PI/6, 0, Math.PI/6, Math.PI/3, Math.PI/6]);
  const bicep3Rot = new THREE.NumberKeyframeTrack('.rotation[x]', [0, 0.5, 1, 1.5, 2], [Math.PI/6, Math.PI/4, Math.PI/6, Math.PI/4, Math.PI/6]);
  
  // Forearms compensate
  const forearm1Rot = new THREE.NumberKeyframeTrack('.rotation[x]', [0, 0.5, 1, 1.5, 2], [-Math.PI/6, -Math.PI/3, -Math.PI/6, 0, -Math.PI/6]);
  const forearm2Rot = new THREE.NumberKeyframeTrack('.rotation[x]', [0, 0.5, 1, 1.5, 2], [-Math.PI/6, 0, -Math.PI/6, -Math.PI/3, -Math.PI/6]);
  const forearm3Rot = new THREE.NumberKeyframeTrack('.rotation[x]', [0, 0.5, 1, 1.5, 2], [-Math.PI/6, -Math.PI/4, -Math.PI/6, -Math.PI/4, -Math.PI/6]);

  const clip = new THREE.AnimationClip('Delta_PickAndPlace', duration, [
    effPosX.clone().setPath(`${effector.uuid}.position[x]`),
    effPosY.clone().setPath(`${effector.uuid}.position[y]`),
    effPosZ.clone().setPath(`${effector.uuid}.position[z]`),
    bicep1Rot.clone().setPath(`${arms[0].uuid}.rotation[x]`),
    bicep2Rot.clone().setPath(`${arms[1].uuid}.rotation[x]`),
    bicep3Rot.clone().setPath(`${arms[2].uuid}.rotation[x]`),
    forearm1Rot.clone().setPath(`${forearms[0].uuid}.rotation[x]`),
    forearm2Rot.clone().setPath(`${forearms[1].uuid}.rotation[x]`),
    forearm3Rot.clone().setPath(`${forearms[2].uuid}.rotation[x]`),
  ]);

  return { group, animationClips: [clip] };
}
