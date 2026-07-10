import {
  aluminum, carbonFiber, copper, wireCoil, blueAccent
} from '../utils/materials.js';

export function createParticleBeamAccelerator(THREE) {
  const group = new THREE.Group();
  group.name = "ParticleBeamAccelerator";

  // Accelerator Ring Base
  const ringGeo = new THREE.TorusGeometry(10, 1, 16, 64);
  const ring = new THREE.Mesh(ringGeo, aluminum);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 2;
  group.add(ring);

  // Central Hub
  const hubGeo = new THREE.CylinderGeometry(3, 3, 4, 32);
  const hub = new THREE.Mesh(hubGeo, carbonFiber);
  hub.position.y = 2;
  group.add(hub);

  // Spokes
  for (let i = 0; i < 4; i++) {
    const spokeGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 8);
    const spoke = new THREE.Mesh(spokeGeo, aluminum);
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = (i * Math.PI) / 2;
    spoke.position.y = 2;
    group.add(spoke);
  }

  // Superconducting Magnets along the ring
  const magnets = new THREE.Group();
  magnets.position.y = 2;
  magnets.name = 'MagnetsGroup';
  group.add(magnets);

  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI * 2) / 16;
    const magGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 16);
    const magnet = new THREE.Mesh(magGeo, wireCoil);
    magnet.position.set(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
    magnet.rotation.y = -angle + Math.PI / 2;
    magnets.add(magnet);
  }

  // Particle Stream (Glowing ring)
  const streamGeo = new THREE.TorusGeometry(10, 0.2, 8, 64);
  const streamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
  const stream = new THREE.Mesh(streamGeo, streamMat);
  stream.rotation.x = Math.PI / 2;
  stream.position.y = 2;
  stream.name = 'ParticleStream';
  group.add(stream);

  // Emitter Barrel
  const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 16);
  const barrel = new THREE.Mesh(barrelGeo, copper);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(14, 2, 0);
  group.add(barrel);

  // Emitter Beam
  const beamGeo = new THREE.CylinderGeometry(0.4, 0.4, 40, 16);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.z = Math.PI / 2;
  beam.position.set(38, 2, 0);
  beam.name = 'ParticleBeam';
  beam.scale.set(0.01, 1, 0.01);
  group.add(beam);

  // Animations
  const animationClips = [];

  // Magnets pulsing
  const magScaleTrack = new THREE.VectorKeyframeTrack(
    'MagnetsGroup.scale',
    [0, 1, 2, 3, 4],
    [1, 1, 1,  1.1, 1.1, 1.1,  1, 1, 1,  1.1, 1.1, 1.1,  1, 1, 1]
  );

  // Stream Rotating
  const streamRotTrack = new THREE.NumberKeyframeTrack(
    'ParticleStream.rotation[z]',
    [0, 4],
    [0, Math.PI * 4]
  );

  // Beam pulsing
  const beamScaleTrack = new THREE.VectorKeyframeTrack(
    'ParticleBeam.scale',
    [0, 1, 1.1, 2, 2.1, 3, 3.1, 4],
    [
      0.01, 1, 0.01,
      0.01, 1, 0.01,
      1, 1, 1,
      1, 1, 1,
      0.01, 1, 0.01,
      0.01, 1, 0.01,
      1, 1, 1,
      1, 1, 1
    ]
  );

  const accelClip = new THREE.AnimationClip('RunAccelerator', 4, [magScaleTrack, streamRotTrack, beamScaleTrack]);
  animationClips.push(accelClip);

  return { group, animationClips };
}
