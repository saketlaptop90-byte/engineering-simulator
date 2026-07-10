import { glass, gold, chrome, blueAccent, redAccent } from '../utils/materials.js';

export function createNegativeIndexLens(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Lens body (metamaterial structure)
  const lensGeom = new THREE.CylinderGeometry(5, 5, 2, 32);
  const lensMat = glass.clone();
  lensMat.opacity = 0.5;
  const lens = new THREE.Mesh(lensGeom, lensMat);
  lens.rotation.x = Math.PI / 2;
  group.add(lens);

  // Split-ring resonators on the lens
  const srrGroup = new THREE.Group();
  const srrGeom = new THREE.TorusGeometry(0.2, 0.05, 8, 16, Math.PI * 1.5);
  for (let x = -4; x <= 4; x += 1) {
    for (let y = -4; y <= 4; y += 1) {
      if (x*x + y*y < 20) {
        const srr = new THREE.Mesh(srrGeom, gold);
        srr.position.set(x, y, 0);
        srrGroup.add(srr);
      }
    }
  }
  group.add(srrGroup);

  // Light rays
  const rayGroup = new THREE.Group();
  const tracks = [];
  
  const rayGeom = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
  rayGeom.translate(0, 5, 0); // origin at bottom
  
  for (let i = -3; i <= 3; i+=1.5) {
    const incomingRay = new THREE.Mesh(rayGeom, redAccent);
    incomingRay.position.set(i, 0, 8);
    incomingRay.rotation.x = Math.PI / 2; // Pointing towards -Z
    
    // Extracted ray (Negative refraction: bends to same side of normal)
    const bentRay = new THREE.Mesh(rayGeom, blueAccent);
    bentRay.position.set(i, 0, 1);
    bentRay.rotation.x = Math.PI / 2;
    bentRay.rotation.z = i * 0.2; // Bend towards center (negative focus)
    
    rayGroup.add(incomingRay, bentRay);
    
    // Pulse light
    const times = [0, 1, 2];
    const scales = [1, 1, 1, 1, 1.5, 1, 1, 1, 1];
    tracks.push(new THREE.VectorKeyframeTrack(`${incomingRay.uuid}.scale`, times, scales));
    tracks.push(new THREE.VectorKeyframeTrack(`${bentRay.uuid}.scale`, times, scales));
  }
  group.add(rayGroup);

  // Animation: Pulse the split ring resonators
  const times = [0, 1, 2];
  const srrScaleValues = [1,1,1, 1.2,1.2,1.2, 1,1,1];
  tracks.push(new THREE.VectorKeyframeTrack(`${srrGroup.uuid}.scale`, times, srrScaleValues));
  
  const clip = new THREE.AnimationClip('NegativeRefraction', 2, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
