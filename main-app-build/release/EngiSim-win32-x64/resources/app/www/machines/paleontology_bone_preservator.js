import * as mats from '../utils/materials.js';

export function createBonePreservator(THREE) {
  const group = new THREE.Group();
  group.name = 'Bone Preservator';
  
  // Base platform
  const baseGeo = new THREE.BoxGeometry(3, 0.5, 3);
  const base = new THREE.Mesh(baseGeo, mats.steel);
  group.add(base);
  
  // Turntable
  const turnGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
  const turntable = new THREE.Mesh(turnGeo, mats.darkSteel);
  turntable.position.set(0, 0.35, 0);
  base.add(turntable);
  
  // Fossil dummy
  const fossilGeo = new THREE.TorusKnotGeometry(0.4, 0.1, 64, 8);
  const fossil = new THREE.Mesh(fossilGeo, mats.ceramic);
  fossil.position.set(0, 0.5, 0);
  turntable.add(fossil);
  
  // Glass dome
  const domeGeo = new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, mats.glass);
  dome.position.set(0, 0.25, 0);
  base.add(dome);
  
  // UV Lights ring
  const ringGeo = new THREE.TorusGeometry(1.3, 0.05, 8, 32);
  const uvMat = mats.purpleAccent.clone();
  uvMat.emissive = new THREE.Color(0x8844bb);
  uvMat.emissiveIntensity = 2.0;
  const ring = new THREE.Mesh(ringGeo, uvMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.5, 0);
  base.add(ring);
  
  // Animations
  const animationClips = [];
  
  const turnTrack = new THREE.NumberKeyframeTrack(
    `${turntable.uuid}.rotation[y]`,
    [0, 2, 4],
    [0, Math.PI, Math.PI * 2]
  );
  
  const ringTrack = new THREE.NumberKeyframeTrack(
    `${ring.uuid}.position[y]`,
    [0, 1, 2, 3, 4],
    [0.5, 1.2, 0.5, 1.2, 0.5]
  );
  
  const clip = new THREE.AnimationClip('Cure', 4, [turnTrack, ringTrack]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
