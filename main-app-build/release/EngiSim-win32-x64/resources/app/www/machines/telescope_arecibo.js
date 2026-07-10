import { materials } from '../utils/materials.js';

export function createArecibo(THREE) {
  const group = new THREE.Group();
  group.name = "AreciboRadioTelescope";

  // Main Dish (in a valley)
  const dishGeom = new THREE.SphereGeometry(20, 64, 32, 0, Math.PI * 2, 0, Math.PI / 6);
  const dishMat = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0x999999, wireframe: true });
  const dish = new THREE.Mesh(dishGeom, dishMat);
  dish.rotation.x = Math.PI;
  dish.position.y = 10;
  group.add(dish);

  // Receiver platform
  const platformGroup = new THREE.Group();
  platformGroup.position.y = 15;
  group.add(platformGroup);

  const receiverGeom = new THREE.BoxGeometry(2, 2, 2);
  const receiverMat = materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x222222 });
  const receiver = new THREE.Mesh(receiverGeom, receiverMat);
  platformGroup.add(receiver);

  const domeGeom = new THREE.SphereGeometry(1.5, 16, 16);
  const domeMat = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xeeeeee });
  const dome = new THREE.Mesh(domeGeom, domeMat);
  dome.position.y = -1.5;
  platformGroup.add(dome);

  // Cables and Towers
  const cableGeom = new THREE.CylinderGeometry(0.05, 0.05, 25);
  for (let i = 0; i < 3; i++) {
    const angle = i * (Math.PI * 2 / 3);
    const cable = new THREE.Mesh(cableGeom, receiverMat);
    cable.position.set(Math.cos(angle) * 10, 12, Math.sin(angle) * 10);
    cable.lookAt(platformGroup.position);
    cable.rotation.x += Math.PI / 2;
    group.add(cable);
    
    const towerGeom = new THREE.CylinderGeometry(0.5, 1, 20);
    const tower = new THREE.Mesh(towerGeom, receiverMat);
    tower.position.set(Math.cos(angle) * 22, 10, Math.sin(angle) * 22);
    group.add(tower);
  }

  // Animation: receiver tracking a target
  const animationClips = [];
  
  const platformTrackName = `${platformGroup.uuid}.position`;
  const times = [0, 2.5, 5, 7.5, 10];
  const platformValues = [
    0, 15, 0,
    2, 15.5, 2,
    0, 16, 4,
    -2, 15.5, 2,
    0, 15, 0
  ];
  const track = new THREE.VectorKeyframeTrack(platformTrackName, times, platformValues);
  
  const clip = new THREE.AnimationClip('TrackSignal', 10, [track]);
  animationClips.push(clip);

  return { group, animationClips };
}
