import {
  aluminum, steel, rubber, greenAccent, whitePlastic
} from '../utils/materials.js';

export function createValueStreamConveyor(THREE) {
  const group = new THREE.Group();
  group.name = "ValueStreamConveyor";
  
  const frameGeo = new THREE.BoxGeometry(8, 0.2, 1);
  const frameL = new THREE.Mesh(frameGeo, aluminum);
  frameL.position.set(0, 1, 0.5);
  group.add(frameL);
  
  const frameR = new THREE.Mesh(frameGeo, aluminum);
  frameR.position.set(0, 1, -0.5);
  group.add(frameR);
  
  const legGeo = new THREE.BoxGeometry(0.1, 1, 0.1);
  [-3.5, 0, 3.5].forEach(x => {
    [-0.5, 0.5].forEach(z => {
      const leg = new THREE.Mesh(legGeo, steel);
      leg.position.set(x, 0.5, z);
      group.add(leg);
    });
  });
  
  const rollerGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16);
  rollerGeo.rotateX(Math.PI / 2);
  const rollers = [];
  for (let x = -3.8; x <= 3.8; x += 0.4) {
    const roller = new THREE.Mesh(rollerGeo, rubber);
    roller.name = `conveyor_roller_${rollers.length}`;
    roller.position.set(x, 1, 0);
    group.add(roller);
    rollers.push(roller);
  }
  
  const itemGeo = new THREE.BoxGeometry(0.6, 0.4, 0.6);
  const item1 = new THREE.Mesh(itemGeo, greenAccent);
  item1.name = "conveyor_item1";
  item1.position.set(-3.5, 1.28, 0);
  group.add(item1);
  
  const item2Geo = new THREE.BoxGeometry(0.5, 0.3, 0.4);
  const item2 = new THREE.Mesh(item2Geo, whitePlastic);
  item2.name = "conveyor_item2";
  item2.position.set(-1.5, 1.23, 0);
  group.add(item2);

  const duration = 4;
  
  const times = [0, 1, 2, 3, 4];
  const rollerValues = [];
  [0, Math.PI/2, Math.PI, Math.PI*1.5, Math.PI*2].forEach(angle => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    q.toArray(rollerValues, rollerValues.length);
  });
  
  const rollerTracks = rollers.map(r => {
    return new THREE.QuaternionKeyframeTrack(`${r.name}.quaternion`, times, rollerValues);
  });
  
  const tVals = [0, 4];
  const p1Vals = [
    -4.3, 1.28, 0,
    4.3, 1.28, 0
  ];
  const trackItem1 = new THREE.VectorKeyframeTrack(`conveyor_item1.position`, tVals, p1Vals);
  
  const p2TrackTimes = [0, 2, 2.01, 4];
  const p2TrackVals = [
    0, 1.23, 0,
    4.3, 1.23, 0,
    -4.3, 1.23, 0,
    0, 1.23, 0
  ];
  const trackItem2 = new THREE.VectorKeyframeTrack(`conveyor_item2.position`, p2TrackTimes, p2TrackVals);
  
  const clip = new THREE.AnimationClip('Conveyor_Action', duration, [...rollerTracks, trackItem1, trackItem2]);
  
  return { group, animationClips: [clip] };
}
