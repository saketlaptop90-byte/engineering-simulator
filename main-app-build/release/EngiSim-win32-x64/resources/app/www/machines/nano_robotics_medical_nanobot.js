import { titanium, blueAccent, glass, steel } from '../utils/materials.js';

export function createMedicalNanobot(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Main Body
  const bodyGeo = new THREE.CapsuleGeometry(1, 3, 16, 16);
  const body = new THREE.Mesh(bodyGeo, titanium);
  group.add(body);

  // Payload Bay (Glass window)
  const payloadGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const payload = new THREE.Mesh(payloadGeo, glass);
  payload.position.set(0, 0, 0.5);
  body.add(payload);

  // Flagella (Propulsion)
  const flagellaGroup = new THREE.Group();
  flagellaGroup.position.set(0, -2, 0);
  flagellaGroup.name = 'FlagellaMotor';
  group.add(flagellaGroup);

  const flagellaGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
  for (let i = 0; i < 3; i++) {
    const flagella = new THREE.Mesh(flagellaGeo, blueAccent);
    flagella.position.set(Math.cos(i * Math.PI * 2 / 3) * 0.4, -1, Math.sin(i * Math.PI * 2 / 3) * 0.4);
    flagella.rotation.x = Math.PI / 6;
    flagellaGroup.add(flagella);
  }

  // Additional detail
  const capGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
  const cap = new THREE.Mesh(capGeo, steel);
  cap.position.set(0, 1.5, 0);
  body.add(cap);

  // Animation: Spinning Flagella
  const spinTrack = new THREE.NumberKeyframeTrack(
    'FlagellaMotor.rotation[y]',
    [0, 1, 2],
    [0, Math.PI, Math.PI * 2]
  );
  
  const clip = new THREE.AnimationClip('SpinFlagella', 2, [spinTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
