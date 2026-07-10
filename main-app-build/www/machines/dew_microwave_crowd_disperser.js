import {
  whitePlastic, aluminum, yellowAccent, darkSteel
} from '../utils/materials.js';

export function createMicrowaveCrowdDisperser(THREE) {
  const group = new THREE.Group();
  group.name = "MicrowaveCrowdDisperser";

  // Vehicle Mount / Base
  const baseGeo = new THREE.BoxGeometry(6, 1, 6);
  const base = new THREE.Mesh(baseGeo, darkSteel);
  base.position.y = 0.5;
  group.add(base);

  const pillarGeo = new THREE.CylinderGeometry(1, 1, 3, 16);
  const pillar = new THREE.Mesh(pillarGeo, aluminum);
  pillar.position.y = 2.5;
  group.add(pillar);

  // Pan Pivot
  const panGroup = new THREE.Group();
  panGroup.position.y = 4;
  panGroup.name = 'PanGroup';
  group.add(panGroup);

  // Tilt Pivot
  const tiltGroup = new THREE.Group();
  tiltGroup.name = 'TiltGroup';
  panGroup.add(tiltGroup);

  // Dish Backing / Chassis
  const chassisGeo = new THREE.BoxGeometry(2, 4, 4);
  const chassis = new THREE.Mesh(chassisGeo, whitePlastic);
  tiltGroup.add(chassis);

  // Planar Antenna Dish
  const dishGeo = new THREE.BoxGeometry(0.5, 6, 6);
  const dish = new THREE.Mesh(dishGeo, whitePlastic);
  dish.position.set(1.25, 0, 0);
  tiltGroup.add(dish);

  // Waveguide
  const waveGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
  const waveguide = new THREE.Mesh(waveGeo, yellowAccent);
  waveguide.rotation.z = Math.PI / 2;
  waveguide.position.set(2, 0, 0);
  tiltGroup.add(waveguide);

  // Invisible Microwave Beam Representation
  const beamGeo = new THREE.ConeGeometry(5, 20, 16);
  // Shift origin to tip
  beamGeo.translate(0, -10, 0);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.1, depthWrite: false });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.z = Math.PI / 2;
  beam.position.set(2.25, 0, 0);
  beam.name = 'MicrowaveBeam';
  tiltGroup.add(beam);

  // Animations
  const animationClips = [];

  // Panning animation (scanning area)
  const panTrack = new THREE.NumberKeyframeTrack(
    'PanGroup.rotation[y]',
    [0, 2, 4, 6, 8],
    [0, Math.PI / 4, 0, -Math.PI / 4, 0]
  );

  const tiltTrack = new THREE.NumberKeyframeTrack(
    'TiltGroup.rotation[z]',
    [0, 4, 8],
    [0, -Math.PI / 12, 0]
  );

  // Beam Opacity pulsing to indicate activity
  const beamScaleTrack = new THREE.VectorKeyframeTrack(
    'MicrowaveBeam.scale',
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [
      1, 1, 1,
      1, 1.5, 1,
      1, 1, 1,
      1, 1.5, 1,
      1, 1, 1,
      1, 1.5, 1,
      1, 1, 1,
      1, 1.5, 1,
      1, 1, 1
    ]
  );

  const scanClip = new THREE.AnimationClip('DisperserScan', 8, [panTrack, tiltTrack, beamScaleTrack]);
  animationClips.push(scanClip);

  return { group, animationClips };
}
