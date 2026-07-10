import * as THREE from 'three';
import { aluminum, gold, ceramic } from '../utils/materials.js';

export function createSQUID(THREE) {
  const group = new THREE.Group();
  group.name = 'SQUIDSensor';

  // Substrate
  const subGeo = new THREE.BoxGeometry(4, 0.1, 4);
  const sub = new THREE.Mesh(subGeo, ceramic);
  group.add(sub);

  // Superconducting loop
  const loopGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
  const loop = new THREE.Mesh(loopGeo, aluminum);
  loop.rotation.x = Math.PI / 2;
  loop.position.y = 0.15;
  group.add(loop);

  // Two Josephson Junctions in the loop
  const jjGeo = new THREE.BoxGeometry(0.3, 0.2, 0.3);
  const jjMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xaa2200 });
  
  const jj1 = new THREE.Mesh(jjGeo, jjMat);
  jj1.position.set(1.5, 0.15, 0);
  jj1.name = 'JJ1';
  group.add(jj1);

  const jj2 = new THREE.Mesh(jjGeo, jjMat);
  jj2.position.set(-1.5, 0.15, 0);
  jj2.name = 'JJ2';
  group.add(jj2);

  // Input coil (flux bias)
  const coilGeo = new THREE.TorusGeometry(1.0, 0.05, 16, 64);
  const coil = new THREE.Mesh(coilGeo, gold);
  coil.rotation.x = Math.PI / 2;
  coil.position.y = 0.3;
  coil.name = 'InputCoil';
  group.add(coil);

  // Magnetic flux lines animation
  const fluxGroup = new THREE.Group();
  fluxGroup.name = 'FluxLines';
  const fluxGeo = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
  const fluxMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5 });
  for(let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(fluxGeo, fluxMat);
    line.position.set((Math.random() - 0.5)*1.5, 0, (Math.random() - 0.5)*1.5);
    fluxGroup.add(line);
  }
  group.add(fluxGroup);

  const tracks = [];
  
  // Animate flux lines moving up and down to represent varying magnetic flux
  const fTimes = [0, 1, 2];
  const fVals = [0, 0, 0,  0, 0.5, 0,  0, 0, 0];
  tracks.push(new THREE.VectorKeyframeTrack(`${fluxGroup.name}.position`, fTimes, fVals));

  // Pulse junctions in response to flux
  const jjTimes = [0, 1, 2];
  const jjVals = [1,1,1, 1.5,1.5,1.5, 1,1,1];
  tracks.push(new THREE.VectorKeyframeTrack(`${jj1.name}.scale`, jjTimes, jjVals));
  tracks.push(new THREE.VectorKeyframeTrack(`${jj2.name}.scale`, jjTimes, jjVals));

  const clip = new THREE.AnimationClip('InterferencePattern', 2, tracks);

  return { group, animationClips: [clip] };
}
