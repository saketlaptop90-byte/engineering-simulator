import * as THREE from 'three';
import { gold, aluminum, darkSteel, greenPCB, ceramic } from '../utils/materials.js';

export function createQubitProcessorChip(THREE) {
  const group = new THREE.Group();
  group.name = 'QubitProcessorChip';

  // Base substrate
  const substrateGeo = new THREE.BoxGeometry(4, 0.1, 4);
  const substrate = new THREE.Mesh(substrateGeo, ceramic);
  group.add(substrate);

  // Qubits (cross shaped transmon)
  const qubits = [];
  const qbGeo = new THREE.BoxGeometry(0.3, 0.02, 0.05);
  const qbGeo2 = new THREE.BoxGeometry(0.05, 0.02, 0.3);
  
  const qbMat = aluminum;

  // Grid of 3x3 qubits
  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      const qbGroup = new THREE.Group();
      qbGroup.position.set(i * 1.2, 0.06, j * 1.2);
      qbGroup.name = `Qubit_${i+1}_${j+1}`;

      const arm1 = new THREE.Mesh(qbGeo, qbMat);
      const arm2 = new THREE.Mesh(qbGeo2, qbMat);
      qbGroup.add(arm1);
      qbGroup.add(arm2);
      
      group.add(qbGroup);
      qubits.push(qbGroup);
      
      // readout resonators (wiggly lines)
      const resGeo = new THREE.BoxGeometry(0.02, 0.02, 0.8);
      const resonator = new THREE.Mesh(resGeo, aluminum);
      resonator.position.set(i * 1.2 + 0.3, 0.06, j * 1.2 + 0.3);
      group.add(resonator);
    }
  }

  // Feedlines
  const feedlineGeo = new THREE.BoxGeometry(3.8, 0.02, 0.05);
  const feedline1 = new THREE.Mesh(feedlineGeo, gold);
  feedline1.position.set(0, 0.06, 1.8);
  const feedline2 = new THREE.Mesh(feedlineGeo, gold);
  feedline2.position.set(0, 0.06, -1.8);
  group.add(feedline1, feedline2);

  // Animation: Qubit state excitation
  const tracks = [];
  qubits.forEach((qb, idx) => {
    const delay = idx * 0.2;
    
    // Scale pulse
    const sTimes = [0, delay, delay + 0.25, delay + 0.5, 3];
    const sVals = [1,1,1, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1,1,1];
    tracks.push(new THREE.VectorKeyframeTrack(`${qb.name}.scale`, sTimes, sVals));
    
    // Position pulse (moves up slightly to indicate excitement)
    const pTimes = [0, delay, delay + 0.25, delay + 0.5, 3];
    const y0 = 0.06;
    const y1 = 0.2;
    const x = qb.position.x;
    const z = qb.position.z;
    const pVals = [x,y0,z, x,y0,z, x,y1,z, x,y0,z, x,y0,z];
    tracks.push(new THREE.VectorKeyframeTrack(`${qb.name}.position`, pTimes, pVals));
  });

  const clip = new THREE.AnimationClip('QubitExcitation', 3, tracks);

  return { group, animationClips: [clip] };
}
