import { darkSteel, aluminum, glass, redAccent, whitePlastic, carbonFiber } from '../utils/materials.js';

export function createLaserSinteringPrinter(THREE) {
  const group = new THREE.Group();
  group.name = 'LaserSintering3DPrinter';

  // Base cabinet
  const baseGeo = new THREE.BoxGeometry(3, 2, 2);
  const base = new THREE.Mesh(baseGeo, darkSteel);
  base.position.set(0, 1, 0);
  group.add(base);

  // Build chamber window
  const windowGeo = new THREE.BoxGeometry(1.5, 1, 1.9);
  const windowMat = glass.clone();
  windowMat.transparent = true;
  windowMat.opacity = 0.4;
  const chamberWindow = new THREE.Mesh(windowGeo, windowMat);
  chamberWindow.position.set(0, 2.5, 0.05);
  group.add(chamberWindow);

  // Powder bed
  const bedGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
  const bed = new THREE.Mesh(bedGeo, whitePlastic);
  bed.position.set(0, 2, 0);
  group.add(bed);

  // Recoater roller
  const rollerGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 16);
  rollerGeo.rotateX(Math.PI / 2);
  const roller = new THREE.Mesh(rollerGeo, aluminum);
  roller.position.set(-0.7, 2.1, 0);
  group.add(roller);

  // Laser Galvo head
  const galvoGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const galvo = new THREE.Mesh(galvoGeo, carbonFiber);
  galvo.position.set(0, 3.2, 0);
  group.add(galvo);

  // Laser beam
  const beamGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.2, 8);
  beamGeo.translate(0, -0.6, 0);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
  const laserBeam = new THREE.Mesh(beamGeo, beamMat);
  galvo.add(laserBeam);

  // Part being built
  const partGeo = new THREE.TorusKnotGeometry(0.2, 0.05, 64, 8);
  const part = new THREE.Mesh(partGeo, redAccent);
  part.position.set(0, 2.05, 0);
  group.add(part);

  // Animation
  const times = [0, 1, 2, 3, 4];

  // Roller moving
  const rollerPos = [
    -0.7, 2.1, 0,
    0.7, 2.1, 0,
    0.7, 2.1, 0,
    -0.7, 2.1, 0,
    -0.7, 2.1, 0
  ];
  const rollerTrack = new THREE.VectorKeyframeTrack(`${roller.uuid}.position`, times, rollerPos);

  // Laser scanning (galvo tilting)
  const scanTimes = [0, 1, 1.2, 1.5, 1.8, 2.0, 3, 4];
  const scanRot = [];
  const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 1).normalize(), 0.2);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-1, 0, -1).normalize(), 0.1);
  const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, -1).normalize(), 0.15);
  const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-1, 0, 1).normalize(), 0.25);
  
  scanRot.push(
    q0.x, q0.y, q0.z, q0.w, // 0
    q0.x, q0.y, q0.z, q0.w, // 1
    q1.x, q1.y, q1.z, q1.w, // 1.2
    q2.x, q2.y, q2.z, q2.w, // 1.5
    q3.x, q3.y, q3.z, q3.w, // 1.8
    q4.x, q4.y, q4.z, q4.w, // 2.0
    q0.x, q0.y, q0.z, q0.w, // 3
    q0.x, q0.y, q0.z, q0.w  // 4
  );
  const laserTrack = new THREE.QuaternionKeyframeTrack(`${galvo.uuid}.quaternion`, scanTimes, scanRot);

  // Laser visibility
  const visTimes = [0, 1, 1.01, 2, 2.01, 4];
  const visValues = [0, 0, 1, 1, 0, 0];
  // Workaround since opacity tracking might not always trigger update smoothly, but valid in THREE.AnimationClip
  // However, usually opacity goes down to 0 for invisibility
  const beamOpacityTrack = new THREE.NumberKeyframeTrack(`${laserBeam.material.uuid}.opacity`, visTimes, visValues);

  const clip = new THREE.AnimationClip('SLS_PrintCycle', 4, [rollerTrack, laserTrack]);

  return { group, animationClips: [clip] };
}
