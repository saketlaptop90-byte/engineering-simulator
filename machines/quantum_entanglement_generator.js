import {
  titanium, aluminum, redAccent, glass, tinted, carbonFiber
} from '../utils/materials.js';

export function createQuantumEntanglementGenerator(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  const baseGeo = new THREE.BoxGeometry(6, 0.5, 3);
  const base = new THREE.Mesh(baseGeo, carbonFiber);
  group.add(base);

  // Laser source
  const laserGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
  const laser = new THREE.Mesh(laserGeo, titanium);
  laser.rotation.z = Math.PI / 2;
  laser.position.set(-2, 1, 0);
  group.add(laser);

  // Non-linear crystal
  const crystalGeo = new THREE.OctahedronGeometry(0.4);
  const crystalMat = tinted(glass, 0xff00ff);
  const crystal = new THREE.Mesh(crystalGeo, crystalMat);
  crystal.position.set(0, 1, 0);
  group.add(crystal);

  // Detectors
  const detectorGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const det1 = new THREE.Mesh(detectorGeo, aluminum);
  det1.position.set(2, 1, 1);
  const det2 = new THREE.Mesh(detectorGeo, aluminum);
  det2.position.set(2, 1, -1);
  group.add(det1);
  group.add(det2);

  // Laser beam
  const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
  const beamMat = tinted(redAccent, 0xff0000);
  beamMat.emissive = new THREE.Color(0xff0000);
  beamMat.emissiveIntensity = 2;
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.z = Math.PI / 2;
  beam.position.set(-1, 1, 0);
  group.add(beam);

  // Entangled beams
  const entBeamGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 8);
  const entBeamMat = tinted(glass, 0x00ffff);
  entBeamMat.emissive = new THREE.Color(0x00ffff);
  
  const ent1 = new THREE.Mesh(entBeamGeo, entBeamMat);
  ent1.position.set(1, 1, 0.5);
  ent1.rotation.y = -Math.atan2(1, 2) + Math.PI / 2;
  ent1.rotation.z = Math.PI / 2;
  group.add(ent1);

  const ent2 = new THREE.Mesh(entBeamGeo, entBeamMat);
  ent2.position.set(1, 1, -0.5);
  ent2.rotation.y = Math.atan2(1, 2) + Math.PI / 2;
  ent2.rotation.z = Math.PI / 2;
  group.add(ent2);

  // Animation
  const times = [0, 0.5, 1];
  const values = [0.2, 1.0, 0.2];
  
  const crystalGlow = new THREE.NumberKeyframeTrack(`${crystalMat.uuid}.opacity`, times, values);
  const beamPulse = new THREE.NumberKeyframeTrack(`${entBeamMat.uuid}.opacity`, times, values);
  const crystalRot = new THREE.NumberKeyframeTrack(`${crystal.uuid}.rotation[y]`, [0, 2], [0, Math.PI * 2]);
  
  const clip = new THREE.AnimationClip('EntanglementGeneration', 2, [crystalGlow, beamPulse, crystalRot]);
  animationClips.push(clip);

  return { group, animationClips };
}
