import {
  aluminum, castIron, chrome, titanium, brass, steel
} from '../utils/materials.js';

export function createCNCMillingSpindle(THREE) {
  const group = new THREE.Group();

  // Spindle Housing
  const housingGroup = new THREE.Group();
  group.add(housingGroup);

  const bodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
  const body = new THREE.Mesh(bodyGeo, aluminum);
  housingGroup.add(body);

  // Cooling fins
  for (let i = 0; i < 8; i++) {
    const fin = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.1, 16, 64), castIron);
    fin.rotation.x = Math.PI / 2;
    fin.position.y = -1.0 + i * 0.3;
    housingGroup.add(fin);
  }

  // Top mount
  const mountGeo = new THREE.BoxGeometry(3.5, 1, 3.5);
  const mount = new THREE.Mesh(mountGeo, steel);
  mount.position.y = 2.5;
  housingGroup.add(mount);

  // Rotor/Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.6, 0.6, 4.5, 32);
  const shaft = new THREE.Mesh(shaftGeo, chrome);
  shaft.position.y = -0.25;
  housingGroup.add(shaft);

  // Collet nut
  const colletGeo = new THREE.CylinderGeometry(0.8, 0.6, 0.6, 6);
  const collet = new THREE.Mesh(colletGeo, brass);
  collet.position.y = -2.5;
  shaft.add(collet);

  // Endmill (Tool)
  const toolGroup = new THREE.Group();
  toolGroup.position.y = -0.3;
  collet.add(toolGroup);

  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1, 16), chrome);
  shank.position.y = -0.5;
  toolGroup.add(shank);

  const fluteGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
  const flute = new THREE.Mesh(fluteGeo, titanium);
  flute.position.y = -1.75;
  toolGroup.add(flute);

  // Animations
  const duration = 2;

  // Extremely fast spindle rotation
  const spinKF = new THREE.NumberKeyframeTrack('.rotation[y]', [0, 2], [0, Math.PI * 40]);
  
  // Plunge motion
  const plungeKF = new THREE.NumberKeyframeTrack('.position[y]', [0, 0.5, 1, 1.5, 2], [0, -2, -2, 0, 0]);

  const clip = new THREE.AnimationClip('CNC_Milling', duration, [
    spinKF.clone().setPath(`${shaft.uuid}.rotation[y]`),
    plungeKF.clone().setPath(`${group.uuid}.position[y]`)
  ]);

  return { group, animationClips: [clip] };
}
