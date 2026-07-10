import {
  whitePlastic, rubber, darkSteel, aluminum, blueAccent, glass
} from '../utils/materials.js';

export function createAGV(THREE) {
  const group = new THREE.Group();

  // Chassis
  const chassisGeo = new THREE.BoxGeometry(4, 1, 2.5);
  const chassis = new THREE.Mesh(chassisGeo, whitePlastic);
  chassis.position.y = 0.7;
  group.add(chassis);

  // Deck
  const deckGeo = new THREE.BoxGeometry(3.8, 0.1, 2.3);
  const deck = new THREE.Mesh(deckGeo, aluminum);
  deck.position.y = 0.55;
  chassis.add(deck);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
  wheelGeo.rotateX(Math.PI / 2);

  const w1 = new THREE.Mesh(wheelGeo, rubber);
  w1.position.set(1.2, -0.2, 1.3);
  chassis.add(w1);

  const w2 = new THREE.Mesh(wheelGeo, rubber);
  w2.position.set(1.2, -0.2, -1.3);
  chassis.add(w2);

  const w3 = new THREE.Mesh(wheelGeo, rubber);
  w3.position.set(-1.2, -0.2, 1.3);
  chassis.add(w3);

  const w4 = new THREE.Mesh(wheelGeo, rubber);
  w4.position.set(-1.2, -0.2, -1.3);
  chassis.add(w4);

  // Lidar
  const lidarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), darkSteel);
  lidarBase.position.set(1.5, 0.6, 0);
  chassis.add(lidarBase);

  const lidarSpinner = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16), blueAccent);
  lidarSpinner.position.y = 0.25;
  lidarBase.add(lidarSpinner);
  
  const lidarGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.2, 16), glass);
  lidarSpinner.add(lidarGlass);

  // Animations
  const duration = 5;
  
  // Wheel rotations
  const wheelRot = new THREE.NumberKeyframeTrack('.rotation[z]', [0, 5], [0, -Math.PI * 8]);
  
  // Lidar spin
  const lidarSpin = new THREE.NumberKeyframeTrack('.rotation[y]', [0, 5], [0, Math.PI * 20]);
  
  // AGV translation
  const agvMoveX = new THREE.NumberKeyframeTrack('.position[x]', [0, 2, 3, 5], [0, 10, 10, 0]);

  const clip = new THREE.AnimationClip('AGV_Operation', duration, [
    wheelRot.clone().setPath(`${w1.uuid}.rotation[z]`),
    wheelRot.clone().setPath(`${w2.uuid}.rotation[z]`),
    wheelRot.clone().setPath(`${w3.uuid}.rotation[z]`),
    wheelRot.clone().setPath(`${w4.uuid}.rotation[z]`),
    lidarSpin.clone().setPath(`${lidarSpinner.uuid}.rotation[y]`),
    agvMoveX.clone().setPath(`${group.uuid}.position[x]`)
  ]);

  return { group, animationClips: [clip] };
}
