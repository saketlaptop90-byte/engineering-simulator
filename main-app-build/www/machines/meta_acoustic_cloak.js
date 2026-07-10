import { copper, plastic, glass, aluminum } from '../utils/materials.js';

export function createAcousticCloak(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Central hidden object
  const coreGeom = new THREE.SphereGeometry(1.5, 32, 32);
  const core = new THREE.Mesh(coreGeom, aluminum);
  group.add(core);

  // Concentric cloaking layers (alternating properties)
  const layerGroup = new THREE.Group();
  const numLayers = 8;
  const layerTracks = [];
  
  for (let i = 0; i < numLayers; i++) {
    const radius = 2 + i * 0.5;
    const geom = new THREE.CylinderGeometry(radius, radius, 4, 64, 1, true);
    const mat = i % 2 === 0 ? copper : plastic;
    mat.side = THREE.DoubleSide;
    const layer = new THREE.Mesh(geom, mat);
    layer.rotation.x = Math.PI / 2;
    layerGroup.add(layer);
    
    // Animation: pulsing to represent acoustic impedance routing
    const times = [0, 1, 2];
    const s = 1 + 0.05 * Math.sin(i);
    const scales = [1,1,1, s,1,s, 1,1,1];
    layerTracks.push(new THREE.VectorKeyframeTrack(`${layer.uuid}.scale`, times, scales));
  }
  group.add(layerGroup);

  // Sound wave representations (spheres routing around)
  const wavesGroup = new THREE.Group();
  const waveGeom = new THREE.SphereGeometry(0.3, 16, 16);
  const waveMat = glass.clone();
  waveMat.color.setHex(0x00ffff);
  
  const waveTracks = [];
  for (let i = 0; i < 5; i++) {
    const wave = new THREE.Mesh(waveGeom, waveMat);
    wavesGroup.add(wave);
    
    // Path around the cloak
    const times = [0, 1, 2, 3, 4];
    const yOff = (i - 2) * 1.5;
    const positions = [
      -10, yOff, 0,
      -4, Math.sign(yOff) * 2.5 + yOff * 0.5, 0,
      0, Math.sign(yOff) * 3.5 + yOff * 0.5, 0,
      4, Math.sign(yOff) * 2.5 + yOff * 0.5, 0,
      10, yOff, 0
    ];
    waveTracks.push(new THREE.VectorKeyframeTrack(`${wave.uuid}.position`, times, positions));
  }
  group.add(wavesGroup);

  const clip = new THREE.AnimationClip('AcousticCloaking', 4, [...layerTracks, ...waveTracks]);
  animationClips.push(clip);

  return { group, animationClips };
}
