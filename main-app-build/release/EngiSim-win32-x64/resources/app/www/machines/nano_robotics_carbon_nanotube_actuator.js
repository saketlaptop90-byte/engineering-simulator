import { carbonFiber, copper, redAccent } from '../utils/materials.js';

export function createCarbonNanotubeActuator(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Contacts
  const contactGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
  
  const topContact = new THREE.Mesh(contactGeo, copper);
  topContact.position.y = 2;
  topContact.name = 'TopContact';
  group.add(topContact);

  const bottomContact = new THREE.Mesh(contactGeo, copper);
  bottomContact.position.y = -2;
  group.add(bottomContact);

  // Nanotube Bundle
  const bundleGroup = new THREE.Group();
  bundleGroup.name = 'NanotubeBundle';
  group.add(bundleGroup);

  for (let i = 0; i < 15; i++) {
    const tubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 8);
    const tube = new THREE.Mesh(tubeGeo, carbonFiber);
    
    const angle = (i / 15) * Math.PI * 2;
    const radius = 0.6;
    tube.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    bundleGroup.add(tube);
  }

  // Inner core
  const coreGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
  const core = new THREE.Mesh(coreGeo, redAccent);
  bundleGroup.add(core);

  // Animation: Actuation (stretching and compressing)
  const scaleTrack = new THREE.VectorKeyframeTrack(
    'NanotubeBundle.scale',
    [0, 1, 2],
    [1, 1, 1,   1, 1.5, 1,   1, 1, 1]
  );

  const topContactTrack = new THREE.VectorKeyframeTrack(
    'TopContact.position',
    [0, 1, 2],
    [0, 2, 0,   0, 3, 0,   0, 2, 0]
  );
  
  const clip = new THREE.AnimationClip('Actuate', 2, [scaleTrack, topContactTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
