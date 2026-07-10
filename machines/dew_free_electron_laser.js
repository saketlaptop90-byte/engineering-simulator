import {
  steel, titanium, chrome, purpleAccent, glass
} from '../utils/materials.js';

export function createFreeElectronLaser(THREE) {
  const group = new THREE.Group();
  group.name = "FreeElectronLaser";

  // Main Housing Base
  const baseGeo = new THREE.BoxGeometry(20, 2, 4);
  const base = new THREE.Mesh(baseGeo, steel);
  base.position.y = 1;
  group.add(base);

  // Electron Gun
  const gunGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
  const gun = new THREE.Mesh(gunGeo, titanium);
  gun.rotation.z = Math.PI / 2;
  gun.position.set(-8, 3, 0);
  group.add(gun);

  // Undulator Arrays (Wiggler Magnets)
  const undulatorGroup = new THREE.Group();
  undulatorGroup.position.set(-3, 3, 0);
  group.add(undulatorGroup);

  for(let i=0; i<12; i++) {
    // Top magnet
    const topMagGeo = new THREE.BoxGeometry(0.5, 1, 2);
    const topMag = new THREE.Mesh(topMagGeo, (i%2===0) ? chrome : purpleAccent);
    topMag.position.set(i * 1.2, 1, 0);
    undulatorGroup.add(topMag);

    // Bottom magnet
    const botMagGeo = new THREE.BoxGeometry(0.5, 1, 2);
    const botMag = new THREE.Mesh(botMagGeo, (i%2!==0) ? chrome : purpleAccent);
    botMag.position.set(i * 1.2, -1, 0);
    undulatorGroup.add(botMag);
  }

  // Optical Cavity Mirrors
  const mirrorGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
  const rearMirror = new THREE.Mesh(mirrorGeo, glass);
  rearMirror.rotation.z = Math.PI / 2;
  rearMirror.position.set(-10, 3, 0);
  group.add(rearMirror);

  const frontMirror = new THREE.Mesh(mirrorGeo, glass);
  frontMirror.rotation.z = Math.PI / 2;
  frontMirror.position.set(12, 3, 0);
  group.add(frontMirror);

  // Electron Path
  const pathGeo = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
  const pathMat = new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.5 });
  const ePath = new THREE.Mesh(pathGeo, pathMat);
  ePath.rotation.z = Math.PI / 2;
  ePath.position.set(1, 3, 0);
  ePath.name = 'ElectronPath';
  group.add(ePath);

  // Output Laser Beam
  const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, 30, 16);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.9 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.z = -Math.PI / 2;
  beam.position.set(12 + 15, 3, 0);
  beam.name = 'FELLaserBeam';
  beam.scale.set(0.01, 1, 0.01);
  group.add(beam);

  // Animations
  const animationClips = [];

  // Electron Path pulsing
  const pathScaleTrack = new THREE.VectorKeyframeTrack(
    'ElectronPath.scale',
    [0, 0.5, 1, 1.5, 2],
    [1, 1, 1,  2, 1, 2,  1, 1, 1,  2, 1, 2,  1, 1, 1]
  );

  // Laser Firing
  const beamScaleTrack = new THREE.VectorKeyframeTrack(
    'FELLaserBeam.scale',
    [0, 1.8, 2.0, 3.8, 4.0],
    [
      0.01, 1, 0.01,
      0.01, 1, 0.01,
      1, 1, 1,
      1, 1, 1,
      0.01, 1, 0.01
    ]
  );

  const felClip = new THREE.AnimationClip('FireFEL', 4, [pathScaleTrack, beamScaleTrack]);
  animationClips.push(felClip);

  return { group, animationClips };
}
