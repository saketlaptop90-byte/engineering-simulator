import * as mats from '../utils/materials.js';

export function createCarbonDater(THREE) {
  const group = new THREE.Group();
  group.name = 'Carbon Dater';
  
  // Main housing
  const houseGeo = new THREE.BoxGeometry(4, 2, 2.5);
  const housing = new THREE.Mesh(houseGeo, mats.whitePlastic);
  housing.position.y = 1;
  group.add(housing);
  
  // Sample tray
  const trayGeo = new THREE.BoxGeometry(1, 0.1, 1);
  const tray = new THREE.Mesh(trayGeo, mats.steel);
  tray.position.set(-1.5, 0.5, 1.2);
  housing.add(tray);
  
  // Sample
  const sampleGeo = new THREE.DodecahedronGeometry(0.15);
  const sample = new THREE.Mesh(sampleGeo, mats.insulation);
  sample.position.set(0, 0.15, 0);
  tray.add(sample);
  
  // Display Screen Indicator (instead of animating color directly)
  const screenGeo = new THREE.PlaneGeometry(1.5, 1);
  const screenMat = mats.blueAccent.clone();
  screenMat.emissive = new THREE.Color(0x113388);
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0.8, 0.3, 1.26);
  housing.add(screen);
  
  // Blinking Light to simulate screen processing
  const lightGeo = new THREE.BoxGeometry(1.4, 0.9, 0.05);
  const lightMat = mats.blueAccent.clone();
  lightMat.emissive = new THREE.Color(0x00aaff);
  const light = new THREE.Mesh(lightGeo, lightMat);
  light.position.set(0.8, 0.3, 1.28);
  housing.add(light);
  
  // Internal Accelerator loop (exposed partially)
  const loopGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
  const loop = new THREE.Mesh(loopGeo, mats.copper);
  loop.position.set(0.8, 0.2, -0.2);
  housing.add(loop);
  
  // Laser/Ion beam indicator
  const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.6);
  beamGeo.rotateZ(Math.PI / 2);
  const beamMat = mats.redAccent.clone();
  beamMat.emissive = new THREE.Color(0xff0000);
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.set(0, 0.2, -0.2);
  housing.add(beam);

  // Animations
  const animationClips = [];
  
  const trayTrack = new THREE.NumberKeyframeTrack(
    `${tray.uuid}.position[z]`,
    [0, 1, 4, 5],
    [1.2, 0, 0, 1.2]
  );
  
  const loopTrack = new THREE.NumberKeyframeTrack(
    `${loop.uuid}.rotation[z]`,
    [0, 5],
    [0, Math.PI * 10]
  );
  
  const lightTrack = new THREE.NumberKeyframeTrack(
    `${light.uuid}.scale`,
    [0, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 2, 2.1, 2.2, 2.3, 4, 5],
    [
      0.001, 0.001, 0.001, 
      1, 1, 1, 0.001, 0.001, 0.001, 
      1, 1, 1, 0.001, 0.001, 0.001, 
      1, 1, 1, 0.001, 0.001, 0.001, 
      1, 1, 1, 1, 1, 1, 
      0.001, 0.001, 0.001,
      0.001, 0.001, 0.001,
      0.001, 0.001, 0.001,
      0.001, 0.001, 0.001
    ]
  );
  
  const beamTrack = new THREE.NumberKeyframeTrack(
    `${beam.uuid}.scale`,
    [0, 1, 1.5, 3.5, 4, 5],
    [
      0.001, 0.001, 0.001, 
      0.001, 0.001, 0.001, 
      1, 1, 1, 
      1, 1, 1, 
      0.001, 0.001, 0.001, 
      0.001, 0.001, 0.001
    ]
  );

  const clip = new THREE.AnimationClip('Analyze', 5, [trayTrack, loopTrack, lightTrack, beamTrack]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
