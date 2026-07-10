import * as mats from '../utils/materials.js';

export function createGeoRadarScanner(THREE) {
  const group = new THREE.Group();
  group.name = 'Geo-Radar Scanner';
  
  // Main body
  const bodyGeo = new THREE.BoxGeometry(2, 0.8, 3);
  const body = new THREE.Mesh(bodyGeo, mats.whitePlastic);
  body.position.y = 0.8;
  group.add(body);
  
  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  const wheels = [];
  const positions = [
    [-1.2, 0.5, -1], [1.2, 0.5, -1],
    [-1.2, 0.5, 1], [1.2, 0.5, 1]
  ];
  
  positions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, mats.rubber);
    wheel.position.set(...pos);
    group.add(wheel);
    wheels.push(wheel);
  });
  
  // Radar Dish Array
  const dishGeo = new THREE.BoxGeometry(1.5, 0.2, 1.5);
  const dish = new THREE.Mesh(dishGeo, mats.carbonFiber);
  dish.position.set(0, 1.3, -0.5);
  group.add(dish);
  
  // Antenna
  const antennaGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
  const antenna = new THREE.Mesh(antennaGeo, mats.copper);
  antenna.position.set(0, 0.6, 0);
  dish.add(antenna);
  
  // Pulse visualizer
  const pulseGeo = new THREE.TorusGeometry(1, 0.05, 8, 24);
  const pulse = new THREE.Mesh(pulseGeo, mats.blueAccent);
  pulse.rotation.x = Math.PI / 2;
  pulse.position.set(0, 0.1, 0);
  group.add(pulse);

  // Animations
  const animationClips = [];
  
  const times = [0, 1, 2, 3, 4];
  const rotations = [0, Math.PI, Math.PI * 2, Math.PI * 3, Math.PI * 4];
  const tracks = wheels.map(w => new THREE.NumberKeyframeTrack(`${w.uuid}.rotation[x]`, times, rotations));
  
  const dishTrack = new THREE.NumberKeyframeTrack(
    `${dish.uuid}.position[y]`,
    [0, 1, 2, 3, 4],
    [1.3, 1.4, 1.3, 1.4, 1.3]
  );
  
  const pulseScale = new THREE.NumberKeyframeTrack(
    `${pulse.uuid}.scale`,
    [0, 1, 2, 3, 4],
    [0.001, 0.001, 0.001, 2, 2, 2, 0.001, 0.001, 0.001, 2, 2, 2, 0.001, 0.001, 0.001]
  );

  const clip = new THREE.AnimationClip('Scan', 4, [...tracks, dishTrack, pulseScale]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
