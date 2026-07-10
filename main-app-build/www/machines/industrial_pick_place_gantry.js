import {
  aluminum, steel, blueAccent, darkSteel, rubber
} from '../utils/materials.js';

export function createPickAndPlaceGantry(THREE) {
  const group = new THREE.Group();
  group.name = "PickAndPlaceGantry";
  
  const legGeo = new THREE.BoxGeometry(0.2, 4, 0.2);
  const positions = [
    [-2, 2, -1], [2, 2, -1], [-2, 2, 1], [2, 2, 1]
  ];
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, darkSteel);
    leg.position.set(...pos);
    group.add(leg);
  });
  
  const yRailGeo = new THREE.BoxGeometry(0.2, 0.2, 2.2);
  const yRail1 = new THREE.Mesh(yRailGeo, aluminum);
  yRail1.position.set(-2, 4, 0);
  group.add(yRail1);
  const yRail2 = new THREE.Mesh(yRailGeo, aluminum);
  yRail2.position.set(2, 4, 0);
  group.add(yRail2);

  const xBeamGeo = new THREE.BoxGeometry(4.2, 0.3, 0.3);
  const xBeam = new THREE.Mesh(xBeamGeo, steel);
  xBeam.name = "gantry_xBeam";
  xBeam.position.set(0, 4.1, 0);
  group.add(xBeam);
  
  const zCarriageGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
  const zCarriage = new THREE.Mesh(zCarriageGeo, blueAccent);
  zCarriage.name = "gantry_zCarriage";
  zCarriage.position.set(0, 0, 0);
  xBeam.add(zCarriage);
  
  const armGeo = new THREE.BoxGeometry(0.1, 2, 0.1);
  const arm = new THREE.Mesh(armGeo, aluminum);
  arm.name = "gantry_arm";
  arm.position.set(0, -1, 0);
  zCarriage.add(arm);
  
  const effectorGeo = new THREE.BoxGeometry(0.4, 0.1, 0.4);
  const effector = new THREE.Mesh(effectorGeo, rubber);
  effector.position.set(0, -1.05, 0);
  arm.add(effector);

  const duration = 4;
  const times = [0, 1, 2, 3, 4];
  
  const yPosValues = [
    0, 4.1, 0,
    0, 4.1, 0.8,
    0, 4.1, 0,
    0, 4.1, -0.8,
    0, 4.1, 0
  ];
  const yTrack = new THREE.VectorKeyframeTrack(`gantry_xBeam.position`, times, yPosValues);
  
  const xPosValues = [
    0, 0, 0,
    1.5, 0, 0,
    0, 0, 0,
    -1.5, 0, 0,
    0, 0, 0
  ];
  const xTrack = new THREE.VectorKeyframeTrack(`gantry_zCarriage.position`, times, xPosValues);
  
  const zPosValues = [
    0, -1, 0,
    0, -1.5, 0,
    0, -1, 0,
    0, -1.5, 0,
    0, -1, 0
  ];
  const zTrack = new THREE.VectorKeyframeTrack(`gantry_arm.position`, times, zPosValues);

  const clip = new THREE.AnimationClip('Gantry_Operation', duration, [yTrack, xTrack, zTrack]);

  return { group, animationClips: [clip] };
}
