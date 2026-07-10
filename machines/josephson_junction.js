import * as THREE from 'three';
import { aluminum, ceramic } from '../utils/materials.js';

export function createJosephsonJunction(THREE) {
  const group = new THREE.Group();
  group.name = 'JosephsonJunction';

  // Substrate
  const subGeo = new THREE.BoxGeometry(5, 0.2, 5);
  const sub = new THREE.Mesh(subGeo, ceramic);
  group.add(sub);

  // Superconducting pad 1
  const pad1Geo = new THREE.BoxGeometry(2, 0.1, 2);
  const pad1 = new THREE.Mesh(pad1Geo, aluminum);
  pad1.position.set(-1.5, 0.15, 0);
  group.add(pad1);

  // Superconducting pad 2
  const pad2Geo = new THREE.BoxGeometry(2, 0.1, 2);
  const pad2 = new THREE.Mesh(pad2Geo, aluminum);
  pad2.position.set(1.5, 0.15, 0);
  group.add(pad2);

  // Insulating barrier (AlOx)
  const barrierGeo = new THREE.BoxGeometry(1, 0.1, 0.5);
  const barrierMat = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
  const barrier = new THREE.Mesh(barrierGeo, barrierMat);
  barrier.position.set(0, 0.15, 0);
  barrier.name = 'JunctionBarrier';
  group.add(barrier);

  // overlapping leads
  const lead1Geo = new THREE.BoxGeometry(1.5, 0.1, 0.5);
  const lead1 = new THREE.Mesh(lead1Geo, aluminum);
  lead1.position.set(-0.75, 0.25, 0);
  group.add(lead1);

  const lead2Geo = new THREE.BoxGeometry(1.5, 0.1, 0.5);
  const lead2 = new THREE.Mesh(lead2Geo, aluminum);
  lead2.position.set(0.75, 0.05, 0);
  group.add(lead2);

  // Animation: Cooper pair tunneling
  const electronGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const electronMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  
  const pairGroup = new THREE.Group();
  pairGroup.name = 'CooperPair';
  const e1 = new THREE.Mesh(electronGeo, electronMat);
  e1.position.set(0, 0, 0.15);
  const e2 = new THREE.Mesh(electronGeo, electronMat);
  e2.position.set(0, 0, -0.15);
  pairGroup.add(e1, e2);
  pairGroup.position.set(-1.5, 0.3, 0);
  group.add(pairGroup);

  const times = [0, 1, 1.5, 2.5, 3];
  const values = [-1.5, 0.3, 0,   -0.5, 0.3, 0,   0, 0.15, 0,   0.5, 0.3, 0,   1.5, 0.3, 0];
  const track = new THREE.VectorKeyframeTrack(`${pairGroup.name}.position`, times, values);

  const bTimes = [0, 1.2, 1.5, 1.8, 3];
  const bVals = [1,1,1, 1,1,1, 1.5,2.0,1.5, 1,1,1, 1,1,1];
  const bTrack = new THREE.VectorKeyframeTrack(`${barrier.name}.scale`, bTimes, bVals);

  const clip = new THREE.AnimationClip('TunnelingEvent', 3, [track, bTrack]);

  return { group, animationClips: [clip] };
}
