import * as THREE from 'three';
import { gold, copper, ceramic, whitePlastic } from '../utils/materials.js';

export function createMicrowaveCoaxialLine(THREE) {
  const group = new THREE.Group();
  group.name = 'MicrowaveCoaxialLine';

  // Core conductor
  const coreGeo = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
  const core = new THREE.Mesh(coreGeo, copper);
  core.rotation.z = Math.PI / 2;
  group.add(core);

  // Dielectric (Teflon)
  const dielectricGeo = new THREE.CylinderGeometry(0.3, 0.3, 9.8, 32);
  const dielectric = new THREE.Mesh(dielectricGeo, whitePlastic);
  dielectric.rotation.z = Math.PI / 2;
  dielectric.material.transparent = true;
  dielectric.material.opacity = 0.6;
  group.add(dielectric);

  // Outer conductor/shield
  const shieldGeo = new THREE.CylinderGeometry(0.4, 0.4, 9.6, 32);
  const shieldMat = gold.clone();
  shieldMat.transparent = true;
  shieldMat.opacity = 0.4;
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  shield.rotation.z = Math.PI / 2;
  group.add(shield);

  // Connectors (SMA)
  const connectorGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16);
  const conn1 = new THREE.Mesh(connectorGeo, gold);
  conn1.position.x = 4.8;
  conn1.rotation.z = Math.PI / 2;
  group.add(conn1);

  const conn2 = new THREE.Mesh(connectorGeo, gold);
  conn2.position.x = -4.8;
  conn2.rotation.z = Math.PI / 2;
  group.add(conn2);

  // Microwave pulse visualizer (a small glowing torus that moves along the core)
  const pulseGeo = new THREE.TorusGeometry(0.2, 0.05, 16, 32);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
  const pulse = new THREE.Mesh(pulseGeo, pulseMat);
  pulse.rotation.y = Math.PI / 2;
  pulse.name = 'MicrowavePulse';
  group.add(pulse);

  // Animation: Pulse traveling from left to right
  const times = [0, 2];
  const values = [-4.5, 0, 0,  4.5, 0, 0];
  const track = new THREE.VectorKeyframeTrack(`${pulse.name}.position`, times, values);
  
  const scaleTimes = [0, 0.5, 1, 1.5, 2];
  const scaleVals = [1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1];
  const sTrack = new THREE.VectorKeyframeTrack(`${pulse.name}.scale`, scaleTimes, scaleVals);

  const clip = new THREE.AnimationClip('MicrowavePropagation', 2, [track, sTrack]);

  return { group, animationClips: [clip] };
}
