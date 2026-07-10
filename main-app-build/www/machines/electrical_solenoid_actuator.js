import {
  steel, wireCoil, chrome, darkSteel
} from '../utils/materials.js';

export function createSolenoidActuator(THREE) {
  const group = new THREE.Group();

  // Housing
  const housingGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
  const housing = new THREE.Mesh(housingGeo, darkSteel);
  housing.rotation.z = Math.PI / 2;
  housing.position.y = 1.5;
  group.add(housing);

  // Coil
  const coilGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.8, 32);
  const coil = new THREE.Mesh(coilGeo, wireCoil);
  coil.rotation.z = Math.PI / 2;
  coil.position.y = 1.5;
  group.add(coil);

  // Plunger
  const plungerGroup = new THREE.Group();
  plungerGroup.name = 'plunger';
  plungerGroup.position.set(0, 1.5, 0);

  const plungerGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
  const plunger = new THREE.Mesh(plungerGeo, chrome);
  plunger.rotation.z = Math.PI / 2;
  plungerGroup.add(plunger);
  
  group.add(plungerGroup);

  // Animation: Linear movement
  const times = [0, 0.5, 1.0, 1.5, 2.0];
  const p1 = [1.5, 1.5, 0];
  const p2 = [0, 1.5, 0]; 
  const values = [ ...p1, ...p2, ...p2, ...p1, ...p1 ];

  const moveTrack = new THREE.VectorKeyframeTrack('plunger.position', times, values);
  const clip = new THREE.AnimationClip('Actuate', 2.0, [moveTrack]);

  return { group, animationClips: [clip] };
}
