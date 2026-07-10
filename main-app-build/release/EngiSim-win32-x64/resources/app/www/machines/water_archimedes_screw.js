import * as materials from '../utils/materials.js';

export function createArchimedesScrew(THREE) {
  const group = new THREE.Group();
  group.rotation.z = Math.PI / 6; // 30 degree incline

  const troughGeo = new THREE.CylinderGeometry(2.1, 2.1, 10, 32, 1, true, 0, Math.PI);
  const trough = new THREE.Mesh(troughGeo, materials.castIron);
  trough.rotation.z = Math.PI / 2;
  trough.rotation.x = Math.PI;
  group.add(trough);

  const rotor = new THREE.Group();
  rotor.rotation.z = Math.PI / 2;
  group.add(rotor);

  const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 10.5, 16);
  const shaft = new THREE.Mesh(shaftGeo, materials.steel);
  rotor.add(shaft);

  const turns = 4;
  const segmentsPerTurn = 36;
  const pitch = 10 / turns;
  for (let i = 0; i < turns * segmentsPerTurn; i++) {
    const angle = (i / segmentsPerTurn) * Math.PI * 2;
    const yPos = (i / (turns * segmentsPerTurn)) * 10 - 5;
    
    const bladeGeo = new THREE.BoxGeometry(4, pitch / segmentsPerTurn * 1.5, 0.1);
    const blade = new THREE.Mesh(bladeGeo, materials.blueAccent);
    blade.position.set(0, yPos, 0);
    blade.rotation.y = angle;
    rotor.add(blade);
  }

  const waterGroup = new THREE.Group();
  waterGroup.rotation.z = Math.PI / 2;
  group.add(waterGroup);

  const waterMat = materials.glass.clone();
  waterMat.color = new THREE.Color(0x2288ff);
  waterMat.opacity = 0.8;
  
  const tracks = [];
  tracks.push(new THREE.NumberKeyframeTrack(`${rotor.uuid}.rotation[y]`, [0, 2], [0, Math.PI * 2]));

  for (let i = 0; i < 15; i++) {
    const blobGeo = new THREE.SphereGeometry(Math.random() * 0.3 + 0.3, 16, 16);
    const blob = new THREE.Mesh(blobGeo, waterMat);
    waterGroup.add(blob);

    const blobTimes = [];
    const blobPositions = [];
    const blobScales = [];
    const startPhase = Math.random() * 2;
    
    for (let f = 0; f <= 30; f++) {
      const t = (f / 30) * 2;
      const progress = ((t + startPhase) % 2) / 2;
      
      const y = progress * 10 - 5;
      const angle = progress * turns * Math.PI * 2;
      const x = Math.cos(angle) * 1.2;
      const z = Math.sin(angle) * 1.2;
      
      let s = 1;
      if (progress < 0.05) s = progress / 0.05;
      if (progress > 0.95) s = (1.0 - progress) / 0.05;

      blobTimes.push(t);
      blobPositions.push(x, y - 0.5, z);
      blobScales.push(s, s, s);
    }
    tracks.push(new THREE.VectorKeyframeTrack(`${blob.uuid}.position`, blobTimes, blobPositions));
    tracks.push(new THREE.VectorKeyframeTrack(`${blob.uuid}.scale`, blobTimes, blobScales));
  }

  const clip = new THREE.AnimationClip('ArchimedesOperation', 2, tracks);
  return { group, animationClips: [clip] };
}
