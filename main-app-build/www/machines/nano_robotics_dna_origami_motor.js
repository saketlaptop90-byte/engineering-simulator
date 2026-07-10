import { purpleAccent, whitePlastic, blueAccent } from '../utils/materials.js';

export function createDnaOrigamiMotor(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Stator
  const statorGeo = new THREE.TorusGeometry(2, 0.4, 16, 64);
  const stator = new THREE.Mesh(statorGeo, purpleAccent);
  stator.rotation.x = Math.PI / 2;
  group.add(stator);

  // Rotor
  const rotorGroup = new THREE.Group();
  rotorGroup.name = 'DnaRotor';
  group.add(rotorGroup);

  const rotorCoreGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
  const rotorCore = new THREE.Mesh(rotorCoreGeo, whitePlastic);
  rotorGroup.add(rotorCore);

  // DNA Strands (simplified as double helix)
  for (let i = 0; i < 20; i++) {
    const strandGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const strand1 = new THREE.Mesh(strandGeo, blueAccent);
    const strand2 = new THREE.Mesh(strandGeo, blueAccent);
    
    const angle = i * 0.5;
    const y = -1 + i * 0.1;
    
    strand1.position.set(Math.cos(angle), y, Math.sin(angle));
    strand2.position.set(Math.cos(angle + Math.PI), y, Math.sin(angle + Math.PI));
    
    rotorGroup.add(strand1);
    rotorGroup.add(strand2);
  }

  // Animation: Rotor spinning rapidly
  const rotorTrack = new THREE.NumberKeyframeTrack(
    'DnaRotor.rotation[y]',
    [0, 1],
    [0, Math.PI * 2]
  );
  
  const clip = new THREE.AnimationClip('RotorSpin', 1, [rotorTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
