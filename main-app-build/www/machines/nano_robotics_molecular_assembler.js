import { darkSteel, orangeAccent, chrome, carbonFiber } from '../utils/materials.js';

export function createMolecularAssembler(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Base platform
  const baseGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
  const base = new THREE.Mesh(baseGeo, darkSteel);
  group.add(base);

  // Central Hub
  const hubGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const hub = new THREE.Mesh(hubGeo, chrome);
  hub.position.y = 1;
  group.add(hub);

  // Robotic Arms (Nanogears representation)
  const armsGroup = new THREE.Group();
  armsGroup.position.y = 1;
  armsGroup.name = 'AssemblerArms';
  group.add(armsGroup);

  for (let i = 0; i < 4; i++) {
    const armPivot = new THREE.Group();
    armPivot.rotation.y = (i * Math.PI) / 2;
    
    const armSegmentGeo = new THREE.BoxGeometry(0.3, 2, 0.3);
    const armSegment = new THREE.Mesh(armSegmentGeo, carbonFiber);
    armSegment.position.set(1.5, 1, 0);
    armSegment.rotation.z = -Math.PI / 4;
    armPivot.add(armSegment);

    const effectorGeo = new THREE.ConeGeometry(0.2, 0.5, 8);
    const effector = new THREE.Mesh(effectorGeo, orangeAccent);
    effector.position.set(2.2, 1.7, 0);
    effector.rotation.z = -Math.PI / 2;
    armPivot.add(effector);

    armsGroup.add(armPivot);
  }

  // Animation: Rotating arms and pulsing
  const hubTrack = new THREE.NumberKeyframeTrack(
    'AssemblerArms.rotation[y]',
    [0, 2, 4],
    [0, Math.PI, Math.PI * 2]
  );
  
  const clip = new THREE.AnimationClip('AssembleOperation', 4, [hubTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
