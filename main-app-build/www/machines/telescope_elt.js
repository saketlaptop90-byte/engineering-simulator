import { materials } from '../utils/materials.js';

export function createELT(THREE) {
  const group = new THREE.Group();
  group.name = "ExtremelyLargeTelescope";

  const domeGroup = new THREE.Group();
  group.add(domeGroup);

  // Base structure
  const baseGeom = new THREE.CylinderGeometry(15, 15, 10, 32);
  const baseMat = materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = 5;
  domeGroup.add(base);

  // Dome
  const domeGeom = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const dome = new THREE.Mesh(domeGeom, domeMat);
  dome.position.y = 10;
  domeGroup.add(dome);
  
  // Telescope structure
  const telescope = new THREE.Group();
  telescope.position.y = 10;
  group.add(telescope);
  
  const mirrorGeom = new THREE.CylinderGeometry(5, 5, 0.5, 64);
  const mirrorMat = materials.glass || new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
  const mirror = new THREE.Mesh(mirrorGeom, mirrorMat);
  mirror.rotation.x = -Math.PI / 2;
  telescope.add(mirror);

  // Supports
  const supportGeom = new THREE.CylinderGeometry(0.2, 0.2, 10);
  const supportMat = materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
  for (let i = 0; i < 4; i++) {
    const support = new THREE.Mesh(supportGeom, supportMat);
    support.position.set(Math.cos(i * Math.PI / 2) * 4, 5, Math.sin(i * Math.PI / 2) * 4);
    telescope.add(support);
  }

  // Secondary mirror
  const secMirror = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2, 32), mirrorMat);
  secMirror.position.y = 10;
  telescope.add(secMirror);

  // Animation: dome rotating and telescope tilting
  const animationClips = [];
  
  const domeTrackName = `${domeGroup.uuid}.rotation[y]`;
  const times = [0, 5, 10];
  const domeValues = [0, Math.PI, 0];
  const domeTrack = new THREE.NumberKeyframeTrack(domeTrackName, times, domeValues);
  
  const teleTrackName = `${telescope.uuid}.rotation[x]`;
  const teleValues = [0, -Math.PI/4, 0];
  const teleTrack = new THREE.NumberKeyframeTrack(teleTrackName, times, teleValues);

  const clip = new THREE.AnimationClip('Observe', 10, [domeTrack, teleTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
