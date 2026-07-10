import { materials } from '../utils/materials.js';

export function createJWST(THREE) {
  const group = new THREE.Group();
  group.name = "JamesWebbSpaceTelescope";

  // Base sunshield
  const sunshieldGeom = new THREE.PlaneGeometry(20, 10);
  const sunshieldMat = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const sunshield = new THREE.Mesh(sunshieldGeom, sunshieldMat);
  sunshield.rotation.x = -Math.PI / 2;
  group.add(sunshield);

  // Primary mirror (gold honeycomb)
  const mirrorGroup = new THREE.Group();
  const hexGeom = new THREE.CylinderGeometry(1, 1, 0.1, 6);
  const hexMat = materials.gold || new THREE.MeshStandardMaterial({ color: 0xffd700 });
  
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (Math.abs(i) + Math.abs(j) === 3) continue; // Roughly hexagonal arrangement
      const hex = new THREE.Mesh(hexGeom, hexMat);
      hex.position.set(i * 1.8, 0, j * 1.5 + (i%2 !== 0 ? 0.75 : 0));
      hex.rotation.x = Math.PI / 2;
      mirrorGroup.add(hex);
    }
  }
  mirrorGroup.position.set(0, 2, 0);
  group.add(mirrorGroup);

  // Secondary mirror boom
  const boomGeom = new THREE.CylinderGeometry(0.1, 0.1, 8);
  const boomMat = materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
  const boom = new THREE.Mesh(boomGeom, boomMat);
  boom.position.set(0, 4, 3);
  boom.rotation.x = Math.PI / 4;
  group.add(boom);
  
  const secondaryMirror = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32), hexMat);
  secondaryMirror.position.set(0, 4, 3);
  secondaryMirror.rotation.x = Math.PI / 2;
  group.add(secondaryMirror);

  // Animation: mirrors unfolding
  const animationClips = [];
  
  const trackName = `${mirrorGroup.uuid}.scale`;
  const times = [0, 2, 4];
  const values = [0.1, 0.1, 0.1, 1.2, 1.2, 1.2, 1, 1, 1]; // x, y, z
  const scaleTrack = new THREE.VectorKeyframeTrack(trackName, times, values);
  
  const clip = new THREE.AnimationClip('Unfold', 4, [scaleTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
