import * as mats from '../utils/materials.js';

export function createCSPTower(THREE) {
  const group = new THREE.Group();

  // Central Tower
  const towerGeo = new THREE.CylinderGeometry(2, 4, 40, 16);
  const tower = new THREE.Mesh(towerGeo, mats.whitePlastic);
  tower.position.y = 20;
  group.add(tower);

  // Receiver
  const receiverGeo = new THREE.CylinderGeometry(2.5, 2.5, 5, 16);
  const receiver = new THREE.Mesh(receiverGeo, mats.fire);
  receiver.position.y = 42.5;
  group.add(receiver);

  // Heliostats
  const tracks = [];
  const radius1 = 15;
  const radius2 = 25;
  
  let hIndex = 0;
  for (const radius of [radius1, radius2]) {
    const count = radius === radius1 ? 8 : 16;
    for(let i=0; i<count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const hGroup = new THREE.Group();
      hGroup.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      
      const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
      const base = new THREE.Mesh(baseGeo, mats.steel);
      base.position.y = 1;
      hGroup.add(base);
      
      const mirrorPivot = new THREE.Group();
      mirrorPivot.position.y = 2;
      mirrorPivot.name = `Heliostat_${hIndex}`;
      hGroup.add(mirrorPivot);
      
      const mirrorGeo = new THREE.BoxGeometry(3, 0.2, 3);
      const mirror = new THREE.Mesh(mirrorGeo, mats.glass);
      mirror.position.y = 0.1;
      mirrorPivot.add(mirror);
      
      group.add(hGroup);
      
      // Animate mirrors tracking the sun
      const times = [0, 5, 10];
      const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/6, angle, 0));
      const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/8, angle + Math.PI/4, 0));
      const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/6, angle, 0));
      
      const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
      ];
      
      tracks.push(new THREE.QuaternionKeyframeTrack(`${mirrorPivot.name}.quaternion`, times, values));
      hIndex++;
    }
  }

  const clip = new THREE.AnimationClip('TrackSun', 10, tracks);

  return { group, animationClips: [clip] };
}
