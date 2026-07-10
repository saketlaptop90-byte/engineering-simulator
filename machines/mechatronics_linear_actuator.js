import {
  aluminum, steel, blackPlastic, orangeAccent, chrome
} from '../utils/materials.js';

export function createLinearActuatorStage(THREE) {
  const group = new THREE.Group();

  // Extrusion Profile Base
  const baseGeo = new THREE.BoxGeometry(1, 0.4, 10);
  const base = new THREE.Mesh(baseGeo, aluminum);
  group.add(base);

  // Linear Rails
  const railGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 16);
  railGeo.rotateX(Math.PI / 2);
  
  const rail1 = new THREE.Mesh(railGeo, chrome);
  rail1.position.set(0.3, 0.25, 0);
  group.add(rail1);

  const rail2 = new THREE.Mesh(railGeo, chrome);
  rail2.position.set(-0.3, 0.25, 0);
  group.add(rail2);

  // Lead Screw
  const screwGeo = new THREE.CylinderGeometry(0.1, 0.1, 9.5, 16);
  screwGeo.rotateX(Math.PI / 2);
  const screw = new THREE.Mesh(screwGeo, steel);
  screw.position.set(0, 0.3, 0);
  group.add(screw);

  // Stepper Motor
  const motorGeo = new THREE.BoxGeometry(0.8, 0.8, 1.2);
  const motor = new THREE.Mesh(motorGeo, blackPlastic);
  motor.position.set(0, 0.4, 5.1);
  group.add(motor);

  // End block
  const endBlock = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.4), aluminum);
  endBlock.position.set(0, 0.3, -4.9);
  group.add(endBlock);

  // Carriage
  const carriageGroup = new THREE.Group();
  group.add(carriageGroup);

  const carriageBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 1.2), orangeAccent);
  carriageBase.position.y = 0.45;
  carriageGroup.add(carriageBase);

  const loadPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.2), aluminum);
  loadPlate.position.y = 0.65;
  carriageGroup.add(loadPlate);

  // Animations
  const duration = 4;

  // Screw rotation
  const screwSpin = new THREE.NumberKeyframeTrack('.rotation[z]', [0, 2, 4], [0, Math.PI * 20, 0]);

  // Carriage translation
  const carriageMove = new THREE.NumberKeyframeTrack('.position[z]', [0, 2, 4], [-4, 4, -4]);

  const clip = new THREE.AnimationClip('LinearActuator_Sweep', duration, [
    screwSpin.clone().setPath(`${screw.uuid}.rotation[z]`),
    carriageMove.clone().setPath(`${carriageGroup.uuid}.position[z]`)
  ]);

  return { group, animationClips: [clip] };
}
