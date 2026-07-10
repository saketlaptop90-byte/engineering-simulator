import {
  steel, redAccent, blueAccent, greenAccent, whitePlastic, orangeAccent, aluminum
} from '../utils/materials.js';

export function createKanbanSortingStation(THREE) {
  const group = new THREE.Group();
  group.name = "KanbanSortingStation";
  
  const tableGeo = new THREE.BoxGeometry(3, 0.1, 1.5);
  const table = new THREE.Mesh(tableGeo, whitePlastic);
  table.position.set(0, 1, 0);
  group.add(table);
  
  const legGeo = new THREE.BoxGeometry(0.1, 1, 0.1);
  [ [-1.4, -0.6], [1.4, -0.6], [-1.4, 0.6], [1.4, 0.6] ].forEach(pos => {
    const leg = new THREE.Mesh(legGeo, steel);
    leg.position.set(pos[0], 0.5, pos[1]);
    group.add(leg);
  });
  
  const rackGeo = new THREE.BoxGeometry(3, 2, 0.4);
  const rack = new THREE.Mesh(rackGeo, steel);
  rack.position.set(0, 2, -0.55);
  group.add(rack);
  
  const binGeo = new THREE.BoxGeometry(0.6, 0.4, 0.4);
  binGeo.translate(0, 0.2, 0);
  
  const binRed = new THREE.Mesh(binGeo, redAccent);
  binRed.position.set(-0.8, 1.5, -0.35);
  group.add(binRed);
  
  const binBlue = new THREE.Mesh(binGeo, blueAccent);
  binBlue.position.set(0, 1.5, -0.35);
  group.add(binBlue);
  
  const binGreen = new THREE.Mesh(binGeo, greenAccent);
  binGreen.position.set(0.8, 1.5, -0.35);
  group.add(binGreen);

  const binRed2 = new THREE.Mesh(binGeo, redAccent);
  binRed2.position.set(-0.8, 2.2, -0.35);
  group.add(binRed2);
  
  const binGreen2 = new THREE.Mesh(binGeo, greenAccent);
  binGreen2.position.set(0.8, 2.2, -0.35);
  group.add(binGreen2);
  
  const armBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
  const armBase = new THREE.Mesh(armBaseGeo, aluminum);
  armBase.position.set(0, 1.05, 0.3);
  group.add(armBase);
  
  const armJointGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
  armJointGeo.rotateX(Math.PI / 2);
  const armJoint = new THREE.Mesh(armJointGeo, orangeAccent);
  armJoint.name = "kanban_armJoint";
  armJoint.position.set(0, 0.2, 0);
  armBase.add(armJoint);
  
  const armLinkGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
  armLinkGeo.translate(0, 0.5, 0);
  const armLink = new THREE.Mesh(armLinkGeo, aluminum);
  armLink.name = "kanban_armLink";
  armJoint.add(armLink);
  
  const endEffectorGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
  const endEffector = new THREE.Mesh(endEffectorGeo, orangeAccent);
  endEffector.position.set(0, 1, 0);
  armLink.add(endEffector);

  const itemGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const item = new THREE.Mesh(itemGeo, blueAccent);
  item.name = "kanban_item";
  item.position.set(0, 1.15, 0.5);
  group.add(item);
  
  const duration = 4;
  const times = [0, 1, 2, 3, 4];
  
  const armBaseQuats = [];
  [0, Math.PI/4, 0, -Math.PI/4, 0].forEach(angle => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    q.toArray(armBaseQuats, armBaseQuats.length);
  });
  const armBaseTrack = new THREE.QuaternionKeyframeTrack(`kanban_armJoint.quaternion`, times, armBaseQuats);
  
  const armLinkQuats = [];
  [Math.PI/6, 0, Math.PI/6, 0, Math.PI/6].forEach(angle => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
    q.toArray(armLinkQuats, armLinkQuats.length);
  });
  const armLinkTrack = new THREE.QuaternionKeyframeTrack(`kanban_armLink.quaternion`, times, armLinkQuats);
  
  const itemPosVals = [
    0, 1.15, 0.5,      // start
    0, 1.8, 0.5,       // lifted
    -0.8, 1.8, -0.35,  // over bin
    -0.8, 1.6, -0.35,  // dropped inside bin
    0, 1.15, 0.5       // respawn at table
  ];
  const itemPosTrack = new THREE.VectorKeyframeTrack(`kanban_item.position`, times, itemPosVals);

  const clip = new THREE.AnimationClip('Kanban_Sort', duration, [armBaseTrack, armLinkTrack, itemPosTrack]);
  
  return { group, animationClips: [clip] };
}
