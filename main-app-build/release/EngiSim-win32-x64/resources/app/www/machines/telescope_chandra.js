import { materials } from '../utils/materials.js';

export function createChandra(THREE) {
  const group = new THREE.Group();
  group.name = "ChandraXRayObservatory";

  const observatory = new THREE.Group();
  group.add(observatory);

  // Main spacecraft bus
  const busGeom = new THREE.BoxGeometry(3, 3, 4);
  const busMat = materials.gold || new THREE.MeshStandardMaterial({ color: 0xb8860b });
  const bus = new THREE.Mesh(busGeom, busMat);
  observatory.add(bus);

  // Telescope tube (X-ray optics)
  const tubeGeom = new THREE.CylinderGeometry(1.5, 1.2, 8, 32);
  const tubeMat = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const tube = new THREE.Mesh(tubeGeom, tubeMat);
  tube.position.set(0, 0, 6);
  tube.rotation.x = Math.PI / 2;
  observatory.add(tube);

  // Solar Arrays
  const saGeom = new THREE.BoxGeometry(10, 0.1, 2);
  const saMat = materials.glass || new THREE.MeshStandardMaterial({ color: 0x001155 });
  
  const leftSA = new THREE.Mesh(saGeom, saMat);
  leftSA.position.set(-6.5, 0, 0);
  observatory.add(leftSA);
  
  const rightSA = new THREE.Mesh(saGeom, saMat);
  rightSA.position.set(6.5, 0, 0);
  observatory.add(rightSA);

  // Thrusters / antennas
  const thrusterGeom = new THREE.ConeGeometry(0.5, 1, 16);
  const thrusterMat = materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x222222 });
  const thruster = new THREE.Mesh(thrusterGeom, thrusterMat);
  thruster.position.set(0, 0, -2.5);
  thruster.rotation.x = -Math.PI / 2;
  observatory.add(thruster);

  // Animation: scanning rotation
  const animationClips = [];
  
  const scanTrackName = `${observatory.uuid}.rotation[y]`;
  const times = [0, 4, 8, 12];
  const scanValues = [0, Math.PI / 4, -Math.PI / 4, 0];
  const scanTrack = new THREE.NumberKeyframeTrack(scanTrackName, times, scanValues);
  
  const clip = new THREE.AnimationClip('XRayScan', 12, [scanTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
