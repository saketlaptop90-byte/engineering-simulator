import {
  steel, titanium, blueAccent, chrome, redAccent
} from '../utils/materials.js';

export function createHighEnergyLaserCannon(THREE) {
  const group = new THREE.Group();
  group.name = "HighEnergyLaserCannon";
  
  // Base
  const baseGeo = new THREE.CylinderGeometry(5, 6, 2, 16);
  const base = new THREE.Mesh(baseGeo, steel);
  base.position.y = 1;
  group.add(base);

  // Turret Pivot
  const turret = new THREE.Group();
  turret.position.y = 2;
  turret.name = 'Turret';
  group.add(turret);

  // Turret Dome
  const turretGeo = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const turretMesh = new THREE.Mesh(turretGeo, titanium);
  turret.add(turretMesh);

  // Barrel Pivot
  const barrelGroup = new THREE.Group();
  barrelGroup.position.set(2, 2, 0);
  barrelGroup.name = 'BarrelGroup';
  turret.add(barrelGroup);

  // Barrel
  const barrelGeo = new THREE.CylinderGeometry(0.8, 1.2, 10, 16);
  const barrel = new THREE.Mesh(barrelGeo, chrome);
  barrel.rotation.z = -Math.PI / 2;
  barrel.position.set(5, 0, 0);
  barrelGroup.add(barrel);

  // Heat Sinks
  const heatSinks = new THREE.Group();
  heatSinks.position.set(5, 0, 0);
  heatSinks.name = 'HeatSinks';
  barrelGroup.add(heatSinks);

  for (let i = 0; i < 6; i++) {
    const sinkGeo = new THREE.BoxGeometry(0.2, 3, 3);
    const sinkMat = redAccent.clone();
    const sink = new THREE.Mesh(sinkGeo, sinkMat);
    sink.position.set(-3 + i * 1.2, 0, 0);
    heatSinks.add(sink);
  }

  // Laser Beam
  const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, 50, 16);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.z = -Math.PI / 2;
  // Position so its origin is at the tip of the barrel (which is at x=10)
  // Geometry is centered, so we shift it by 25
  beam.position.set(10 + 25, 0, 0);
  beam.name = 'LaserBeam';
  beam.scale.set(0.01, 1, 0.01);
  barrelGroup.add(beam);

  // Animations
  const animationClips = [];

  // Aiming Animation
  const aimTrack = new THREE.NumberKeyframeTrack(
    'Turret.rotation[y]',
    [0, 2, 4, 6],
    [0, Math.PI / 4, -Math.PI / 4, 0]
  );
  const elevationTrack = new THREE.NumberKeyframeTrack(
    'BarrelGroup.rotation[z]',
    [0, 2, 4, 6],
    [0, Math.PI / 8, Math.PI / 16, 0]
  );

  // Firing Animation
  // Beam scales up in X and Z (since it's rotated, X and Z are thickness, Y is length)
  const fireScaleTrack = new THREE.VectorKeyframeTrack(
    'LaserBeam.scale',
    [0, 1.9, 2.0, 2.2, 2.3, 3.9, 4.0, 4.2, 4.3],
    [
      0.01, 1, 0.01,
      0.01, 1, 0.01,
      1, 1, 1,
      1, 1, 1,
      0.01, 1, 0.01,
      0.01, 1, 0.01,
      1, 1, 1,
      1, 1, 1,
      0.01, 1, 0.01
    ]
  );

  const cannonClip = new THREE.AnimationClip('OperateCannon', 6, [aimTrack, elevationTrack, fireScaleTrack]);
  animationClips.push(cannonClip);

  return { group, animationClips };
}
