import * as mats from '../utils/materials.js';

export function createFossilExcavator(THREE) {
  const group = new THREE.Group();
  group.name = 'Fossil Excavator';
  
  // Base
  const baseGeo = new THREE.BoxGeometry(4, 1, 6);
  const base = new THREE.Mesh(baseGeo, mats.darkSteel);
  base.position.y = 0.5;
  group.add(base);
  
  // Treads
  const treadGeo = new THREE.BoxGeometry(1, 1.2, 6.5);
  const leftTread = new THREE.Mesh(treadGeo, mats.rubber);
  leftTread.position.set(-2.2, 0.6, 0);
  const rightTread = new THREE.Mesh(treadGeo, mats.rubber);
  rightTread.position.set(2.2, 0.6, 0);
  group.add(leftTread, rightTread);
  
  // Rotating Cabin
  const cabinGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.5, 16);
  const cabin = new THREE.Mesh(cabinGeo, mats.orangeAccent);
  cabin.position.set(0, 1.75, -1);
  group.add(cabin);
  
  // Arm Segment 1
  const arm1Geo = new THREE.BoxGeometry(0.8, 4, 0.8);
  const arm1 = new THREE.Mesh(arm1Geo, mats.steel);
  arm1.position.set(0, 2, 0);
  cabin.add(arm1);
  
  // Arm Segment 2
  const arm2Geo = new THREE.BoxGeometry(0.6, 3, 0.6);
  arm2Geo.translate(0, 1.5, 0);
  const arm2 = new THREE.Mesh(arm2Geo, mats.aluminum);
  arm2.position.set(0, 1.8, 0);
  arm1.add(arm2);
  
  // Excavation Tool (Brush/Air)
  const toolGeo = new THREE.CylinderGeometry(0.5, 0.1, 1, 8);
  toolGeo.translate(0, -0.5, 0);
  const tool = new THREE.Mesh(toolGeo, mats.yellowAccent);
  tool.position.set(0, 3, 0);
  arm2.add(tool);
  
  // Animations
  const animationClips = [];
  
  const cabinTrack = new THREE.NumberKeyframeTrack(
    `${cabin.uuid}.rotation[y]`,
    [0, 2, 4, 6],
    [0, Math.PI / 4, -Math.PI / 4, 0]
  );
  
  const arm1Track = new THREE.NumberKeyframeTrack(
    `${arm1.uuid}.rotation[x]`,
    [0, 2, 4, 6],
    [0, Math.PI / 6, 0, 0]
  );
  
  const arm2Track = new THREE.NumberKeyframeTrack(
    `${arm2.uuid}.rotation[x]`,
    [0, 2, 4, 6],
    [0, -Math.PI / 4, Math.PI / 4, 0]
  );
  
  const toolTrack = new THREE.NumberKeyframeTrack(
    `${tool.uuid}.rotation[y]`,
    [0, 1, 2, 3, 4, 5, 6],
    [0, Math.PI, Math.PI*2, Math.PI*3, Math.PI*4, Math.PI*5, Math.PI*6]
  );
  
  const clip = new THREE.AnimationClip('Excavate', 6, [cabinTrack, arm1Track, arm2Track, toolTrack]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
