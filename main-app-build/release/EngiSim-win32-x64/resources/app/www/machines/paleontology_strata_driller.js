import * as mats from '../utils/materials.js';

export function createStrataDriller(THREE) {
  const group = new THREE.Group();
  group.name = 'Strata Driller';
  
  // Platform
  const platGeo = new THREE.BoxGeometry(3, 0.5, 5);
  const platform = new THREE.Mesh(platGeo, mats.castIron);
  platform.position.y = 0.25;
  group.add(platform);
  
  // Supports
  const suppGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
  const s1 = new THREE.Mesh(suppGeo, mats.steel);
  s1.position.set(-1, 2, -1.5);
  const s2 = new THREE.Mesh(suppGeo, mats.steel);
  s2.position.set(1, 2, -1.5);
  const s3 = new THREE.Mesh(suppGeo, mats.steel);
  s3.position.set(0, 2, 1.5);
  s3.rotation.x = -Math.PI / 8;
  platform.add(s1, s2, s3);
  
  // Top rig
  const rigGeo = new THREE.BoxGeometry(2.5, 0.5, 2.5);
  const rig = new THREE.Mesh(rigGeo, mats.yellowAccent);
  rig.position.set(0, 4, -1.5);
  platform.add(rig);
  
  // Drill mechanism
  const drillMechGeo = new THREE.BoxGeometry(1, 1, 1);
  const drillMech = new THREE.Mesh(drillMechGeo, mats.darkSteel);
  drillMech.position.set(0, 3, -1.5);
  platform.add(drillMech);
  
  // Drill bit
  const bitGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
  const drillBit = new THREE.Mesh(bitGeo, mats.titanium);
  drillBit.position.set(0, -1.5, 0);
  drillMech.add(drillBit);
  
  // Sample Core
  const coreGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.8, 8);
  const core = new THREE.Mesh(coreGeo, mats.redAccent);
  core.position.set(0, 0, 0);
  drillBit.add(core);

  // Animations
  const animationClips = [];
  
  const mechTrack = new THREE.NumberKeyframeTrack(
    `${drillMech.uuid}.position[y]`,
    [0, 2, 4, 6],
    [3, 1, 1, 3]
  );
  
  const bitTrack = new THREE.NumberKeyframeTrack(
    `${drillBit.uuid}.rotation[y]`,
    [0, 2, 4, 6],
    [0, Math.PI * 20, Math.PI * 40, Math.PI * 40]
  );
  
  const clip = new THREE.AnimationClip('Drill', 6, [mechTrack, bitTrack]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
