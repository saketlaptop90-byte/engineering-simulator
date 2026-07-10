import {
  blackPlastic, chrome, fire, carbonFiber, blueAccent
} from '../utils/materials.js';

export function createTerrestrialLaserScanner(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Carbon Fiber Tripod
  const tripodGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const legGeo = new THREE.CylinderGeometry(0.06, 0.03, 1.5, 8);
    const leg = new THREE.Mesh(legGeo, carbonFiber);
    leg.position.y = 0.75;
    
    const wrapper = new THREE.Group();
    wrapper.add(leg);
    wrapper.rotation.x = Math.PI / 7;
    
    const pivot = new THREE.Group();
    pivot.add(wrapper);
    pivot.rotation.y = (i * Math.PI * 2) / 3;
    pivot.position.y = 1.45;
    tripodGroup.add(pivot);
  }
  
  const headGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16);
  const head = new THREE.Mesh(headGeo, blackPlastic);
  head.position.y = 1.5;
  tripodGroup.add(head);
  group.add(tripodGroup);

  // Scanner Body
  const scannerBody = new THREE.Group();
  scannerBody.name = 'ScannerBody';
  scannerBody.position.y = 1.54;

  const baseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
  const base = new THREE.Mesh(baseGeo, blueAccent);
  base.position.y = 0.05;
  scannerBody.add(base);

  // Scanner Head
  const scannerHead = new THREE.Group();
  scannerHead.position.y = 0.1;

  const archGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 32);
  const arch = new THREE.Mesh(archGeo, blackPlastic);
  arch.rotation.z = Math.PI / 2;
  arch.position.y = 0.1;
  scannerHead.add(arch);

  // Spinning Mirror / Laser Emitter
  const mirrorGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
  const mirror = new THREE.Mesh(mirrorGeo, chrome);
  mirror.name = 'ScannerMirror';
  mirror.position.set(0, 0.1, 0.12);
  scannerHead.add(mirror);

  // Laser Sheet (Rapidly scanning)
  const laserGeo = new THREE.PlaneGeometry(0.01, 3);
  const laser = new THREE.Mesh(laserGeo, fire);
  laser.name = 'ScannerLaser';
  laser.position.set(0, 0.1, 1.5);
  laser.rotation.x = Math.PI / 2;
  scannerHead.add(laser);

  scannerBody.add(scannerHead);
  group.add(scannerBody);

  // Animation: Scanner body rotates slowly, mirror spins rapidly
  const duration = 5;
  
  const bodyTrack = new THREE.NumberKeyframeTrack(
    `${scannerBody.name}.rotation[y]`,
    [0, 5],
    [0, Math.PI * 2]
  );

  const mirrorTrack = new THREE.NumberKeyframeTrack(
    `${mirror.name}.rotation[x]`,
    [0, 5],
    [0, Math.PI * 20]
  );

  const laserTrack = new THREE.NumberKeyframeTrack(
    `${laser.name}.rotation[x]`,
    [0, 5],
    [Math.PI / 2, (Math.PI * 20) + (Math.PI / 2)] // Sync with mirror
  );

  const clip = new THREE.AnimationClip('TerrestrialScan', duration, [bodyTrack, mirrorTrack, laserTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
