import {
  steel, ceramic, copper, darkSteel
} from '../utils/materials.js';

export function createSubstationSwitch(THREE) {
  const group = new THREE.Group();

  // Base Frame
  const baseGeo = new THREE.BoxGeometry(6, 0.5, 2);
  const base = new THREE.Mesh(baseGeo, steel);
  base.position.y = 0.25;
  group.add(base);

  // Insulator Stacks
  const insulatorGeo = new THREE.CylinderGeometry(0.3, 0.4, 3, 16);
  for(let i=0; i<8; i++) {
    const ridgeGeo = new THREE.TorusGeometry(0.4, 0.1, 8, 16);
    const ridgeL = new THREE.Mesh(ridgeGeo, ceramic);
    ridgeL.rotation.x = Math.PI / 2;
    ridgeL.position.set(-2, 0.5 + i*0.35, 0);
    group.add(ridgeL);
    
    const ridgeR = new THREE.Mesh(ridgeGeo, ceramic);
    ridgeR.rotation.x = Math.PI / 2;
    ridgeR.position.set(2, 0.5 + i*0.35, 0);
    group.add(ridgeR);
  }

  const stackLeft = new THREE.Mesh(insulatorGeo, ceramic);
  stackLeft.position.set(-2, 1.75, 0);
  group.add(stackLeft);

  const stackRight = new THREE.Mesh(insulatorGeo, ceramic);
  stackRight.position.set(2, 1.75, 0);
  group.add(stackRight);

  // Switch Blade
  const bladeGroup = new THREE.Group();
  bladeGroup.position.set(-2, 3.5, 0);
  bladeGroup.name = 'switch_blade';

  const bladeGeo = new THREE.BoxGeometry(4.5, 0.2, 0.2);
  const blade = new THREE.Mesh(bladeGeo, copper);
  blade.position.set(2.25, 0, 0); 
  bladeGroup.add(blade);
  
  group.add(bladeGroup);

  // Contact Jaws
  const jawGeo = new THREE.BoxGeometry(0.6, 0.5, 0.4);
  const jaw = new THREE.Mesh(jawGeo, copper);
  jaw.position.set(2, 3.5, 0);
  group.add(jaw);

  // Animation: Opening and Closing
  const qClosed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
  const qOpen = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI / 3);

  const times = [0, 2, 4, 6];
  const values = [
    qClosed.x, qClosed.y, qClosed.z, qClosed.w,
    qOpen.x, qOpen.y, qOpen.z, qOpen.w,
    qOpen.x, qOpen.y, qOpen.z, qOpen.w,
    qClosed.x, qClosed.y, qClosed.z, qClosed.w
  ];

  const switchTrack = new THREE.QuaternionKeyframeTrack('switch_blade.quaternion', times, values);
  const clip = new THREE.AnimationClip('SwitchOperate', 6.0, [switchTrack]);

  return { group, animationClips: [clip] };
}
