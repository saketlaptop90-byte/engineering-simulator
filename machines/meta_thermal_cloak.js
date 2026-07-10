import { copper, plastic, aluminum, redAccent, blueAccent } from '../utils/materials.js';

export function createThermalCloak(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Core to be protected
  const coreGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
  const core = new THREE.Mesh(coreGeom, blueAccent); // Cool core
  group.add(core);

  // Thermal Cloak Shell
  const shellGroup = new THREE.Group();
  const numSlices = 24;
  const tracks = [];
  
  const sliceGeom = new THREE.BoxGeometry(0.5, 3.2, 1);
  sliceGeom.translate(0, 0, 2); // offset radius
  
  for (let i = 0; i < numSlices; i++) {
    const angle = (i / numSlices) * Math.PI * 2;
    const slice = new THREE.Mesh(sliceGeom, i % 2 === 0 ? copper : plastic);
    slice.rotation.y = angle;
    shellGroup.add(slice);
    
    // Heat wave visualization
    const heatGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const heat = new THREE.Mesh(heatGeom, redAccent);
    
    const hGroup = new THREE.Group();
    hGroup.rotation.y = angle;
    heat.position.set(0, 1.6, 2.5);
    hGroup.add(heat);
    shellGroup.add(hGroup);
    
    const times = [0, 1, 2, 3];
    const startY = -2.5;
    const endY = 2.5;
    const yVals = [
      0, startY, 2.5,
      0, 0.0, 3.5,
      0, endY, 2.5,
      0, startY, 2.5
    ];
    tracks.push(new THREE.VectorKeyframeTrack(`${heat.uuid}.position`, times, yVals));
  }
  group.add(shellGroup);

  // Heat flux base
  const baseGeom = new THREE.PlaneGeometry(10, 10);
  const base = new THREE.Mesh(baseGeom, aluminum);
  base.rotation.x = -Math.PI / 2;
  base.position.y = -1.6;
  group.add(base);

  const clip = new THREE.AnimationClip('ThermalRouting', 3, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
