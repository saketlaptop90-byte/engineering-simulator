import {
  gold, greenPCB, copper, tinted
} from '../utils/materials.js';

export function createSuperconductingQubitArray(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  const boardGeo = new THREE.BoxGeometry(5, 0.2, 5);
  const board = new THREE.Mesh(boardGeo, greenPCB);
  group.add(board);

  const qubitGroup = new THREE.Group();
  const tracks = [];
  
  const qbGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
  const activeMat = tinted(gold, 0xffd700);
  activeMat.emissive = new THREE.Color(0xffaa00);
  
  for (let x = -2; x <= 2; x += 1) {
    for (let z = -2; z <= 2; z += 1) {
      const qb = new THREE.Mesh(qbGeo, activeMat);
      qb.position.set(x, 0.15, z);
      qubitGroup.add(qb);
      
      // Add resonators
      if (x < 2) {
        const resGeo = new THREE.BoxGeometry(0.6, 0.05, 0.05);
        const res = new THREE.Mesh(resGeo, copper);
        res.position.set(x + 0.5, 0.15, z);
        qubitGroup.add(res);
      }
      if (z < 2) {
        const resGeo = new THREE.BoxGeometry(0.05, 0.05, 0.6);
        const res = new THREE.Mesh(resGeo, copper);
        res.position.set(x, 0.15, z + 0.5);
        qubitGroup.add(res);
      }
      
      // Random animation for each qubit intensity
      const times = [0, Math.random() + 0.5, 2];
      tracks.push(new THREE.NumberKeyframeTrack(`${qb.uuid}.position[y]`, times, [0.15, 0.3, 0.15]));
    }
  }
  
  group.add(qubitGroup);

  const clip = new THREE.AnimationClip('QubitArrayCompute', 2, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
