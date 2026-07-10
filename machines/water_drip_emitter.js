import * as materials from '../utils/materials.js';

export function createDripEmitter(THREE) {
  const group = new THREE.Group();

  const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 32);
  const tube = new THREE.Mesh(tubeGeo, materials.blackPlastic);
  tube.rotation.z = Math.PI / 2;
  group.add(tube);

  const housingGeo = new THREE.BoxGeometry(2, 1.2, 1.5);
  const housing = new THREE.Mesh(housingGeo, materials.blueAccent);
  housing.position.set(0, -1, 0);
  group.add(housing);
  
  const barbGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
  const barb = new THREE.Mesh(barbGeo, materials.plastic);
  barb.position.set(0, -1.8, 0);
  group.add(barb);

  const labyGroup = new THREE.Group();
  labyGroup.position.set(0, -1, 0.76); 
  group.add(labyGroup);
  
  const labyMat = materials.darkSteel;
  for (let i = -0.8; i <= 0.8; i += 0.4) {
    const toothGeo1 = new THREE.BoxGeometry(0.6, 0.1, 0.1);
    const tooth1 = new THREE.Mesh(toothGeo1, labyMat);
    tooth1.position.set(0.2, i, 0);
    labyGroup.add(tooth1);
    
    const toothGeo2 = new THREE.BoxGeometry(0.6, 0.1, 0.1);
    const tooth2 = new THREE.Mesh(toothGeo2, labyMat);
    tooth2.position.set(-0.2, i + 0.2, 0);
    labyGroup.add(tooth2);
  }

  const dropGroup = new THREE.Group();
  group.add(dropGroup);
  
  const dropMat = materials.glass.clone();
  dropMat.color = new THREE.Color(0xaaccff);
  
  const tracks = [];
  const duration = 2;

  for (let i = 0; i < 3; i++) {
    const dropGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const drop = new THREE.Mesh(dropGeo, dropMat);
    dropGroup.add(drop);
    
    const startPhaseTime = i * (duration / 3);
    const times = [];
    const positions = [];
    const scales = [];
    
    for (let f = 0; f <= 30; f++) {
      const t = (f / 30) * duration;
      const progress = ((t + startPhaseTime) % duration) / duration;
      
      let s = 1;
      if (progress < 0.05) s = progress / 0.05;
      else if (progress > 0.95) s = (1.0 - progress) / 0.05;

      times.push(t);
      
      if (progress < 0.2) {
        const p = progress / 0.2;
        positions.push(0, -2.6 - p * 0.2, 0);
        scales.push(s * p, s * p, s * p); 
      } else if (progress < 0.8) {
        const p = (progress - 0.2) / 0.6;
        const fallDist = 5 * p * p; 
        positions.push(0, -2.8 - fallDist, 0);
        scales.push(s * (1 - p*0.3), s * (1 + p*0.5), s * (1 - p*0.3));
      } else {
        const p = (progress - 0.8) / 0.2;
        positions.push(0, -7.8, 0);
        scales.push(s * (1 + p * 2), s * Math.max(0.01, 1 - p * 5), s * (1 + p * 2)); 
      }
    }
    
    tracks.push(new THREE.VectorKeyframeTrack(`${drop.uuid}.position`, times, positions));
    tracks.push(new THREE.VectorKeyframeTrack(`${drop.uuid}.scale`, times, scales));
  }

  const clip = new THREE.AnimationClip('DripOperation', duration, tracks);
  return { group, animationClips: [clip] };
}
