import { steel, whitePlastic, orangeAccent, glass, aluminum, rubber } from '../utils/materials.js';

export function createInjectionStretchBlowMolder(THREE) {
  const group = new THREE.Group();
  group.name = 'InjectionStretchBlowMolder';

  // Base frame
  const baseGeo = new THREE.BoxGeometry(6, 1, 2);
  const base = new THREE.Mesh(baseGeo, steel);
  base.position.set(0, 0.5, 0);
  group.add(base);

  // Extruder barrel
  const barrelGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
  barrelGeo.rotateZ(Math.PI / 2);
  const barrel = new THREE.Mesh(barrelGeo, orangeAccent);
  barrel.position.set(-1.5, 2, 0);
  group.add(barrel);

  // Hopper
  const hopperGeo = new THREE.ConeGeometry(0.5, 1, 16);
  hopperGeo.rotateZ(Math.PI);
  const hopper = new THREE.Mesh(hopperGeo, whitePlastic);
  hopper.position.set(-2.5, 3, 0);
  group.add(hopper);

  // Stationary Platen
  const platStatGeo = new THREE.BoxGeometry(0.5, 2, 1.5);
  const platenStat = new THREE.Mesh(platStatGeo, steel);
  platenStat.position.set(0.25, 2, 0);
  group.add(platenStat);

  // Moving Platen
  const platMovGeo = new THREE.BoxGeometry(0.5, 2, 1.5);
  const platenMov = new THREE.Mesh(platMovGeo, aluminum);
  platenMov.position.set(2, 2, 0);
  group.add(platenMov);

  // Mold halves
  const moldStatGeo = new THREE.BoxGeometry(0.4, 1, 1);
  const moldStat = new THREE.Mesh(moldStatGeo, steel);
  moldStat.position.set(0.45, 0, 0);
  platenStat.add(moldStat);

  const moldMovGeo = new THREE.BoxGeometry(0.4, 1, 1);
  const moldMov = new THREE.Mesh(moldMovGeo, steel);
  moldMov.position.set(-0.45, 0, 0);
  platenMov.add(moldMov);

  // Stretch rod / blowing station
  const stretchRodGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
  const stretchRod = new THREE.Mesh(stretchRodGeo, steel);
  stretchRod.position.set(1.125, 3, 0);
  group.add(stretchRod);

  // Parison / Bottle
  const bottleGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
  const bottleMat = glass.clone();
  bottleMat.transparent = true;
  bottleMat.opacity = 0.5;
  const bottle = new THREE.Mesh(bottleGeo, bottleMat);
  bottle.position.set(1.125, 2, 0);
  group.add(bottle);

  // Animation
  const times = [0, 1, 2, 3, 4];
  
  // Platen closing and opening
  const platenPos = [
    2, 2, 0,      // open
    1.15, 2, 0,   // closed
    1.15, 2, 0,   // hold
    2, 2, 0,      // open
    2, 2, 0       // open
  ];
  const platenTrack = new THREE.VectorKeyframeTrack(`${platenMov.uuid}.position`, times, platenPos);

  // Stretch rod moving down and up
  const rodPos = [
    1.125, 3, 0,
    1.125, 3, 0,
    1.125, 2.2, 0,
    1.125, 3, 0,
    1.125, 3, 0
  ];
  const rodTrack = new THREE.VectorKeyframeTrack(`${stretchRod.uuid}.position`, times, rodPos);

  // Bottle scaling (stretch and blow)
  const bottleScale = [
    1, 1, 1,
    1, 1, 1,
    2, 2, 2,
    1, 1, 1,
    1, 1, 1
  ];
  const bottleTrack = new THREE.VectorKeyframeTrack(`${bottle.uuid}.scale`, times, bottleScale);

  const clip = new THREE.AnimationClip('BlowMoldCycle', 4, [platenTrack, rodTrack, bottleTrack]);

  return { group, animationClips: [clip] };
}
