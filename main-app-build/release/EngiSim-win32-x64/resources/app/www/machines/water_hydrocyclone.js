import * as materials from '../utils/materials.js';

export function createHydrocyclone(THREE) {
  const group = new THREE.Group();

  const topGeo = new THREE.CylinderGeometry(2, 2, 3, 32);
  const topPart = new THREE.Mesh(topGeo, materials.blueAccent);
  topPart.position.y = 3.5;
  group.add(topPart);

  const coneGeo = new THREE.CylinderGeometry(0.4, 2, 5, 32);
  const cone = new THREE.Mesh(coneGeo, materials.blueAccent);
  cone.position.y = -0.5;
  group.add(cone);

  const inletGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5);
  const inlet = new THREE.Mesh(inletGeo, materials.steel);
  inlet.rotation.z = Math.PI / 2;
  inlet.position.set(2, 4, 1.5);
  group.add(inlet);

  const overflowGeo = new THREE.CylinderGeometry(0.6, 0.6, 4);
  const overflow = new THREE.Mesh(overflowGeo, materials.plastic);
  overflow.position.y = 5.5;
  group.add(overflow);

  const underflowGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5);
  const underflow = new THREE.Mesh(underflowGeo, materials.castIron);
  underflow.position.y = -3.75;
  group.add(underflow);

  const particlesGroup = new THREE.Group();
  group.add(particlesGroup);
  
  const sandMat = materials.ceramic.clone();
  sandMat.color = new THREE.Color(0xd2b48c);
  const waterMat = materials.glass.clone();
  waterMat.color = new THREE.Color(0x44aaff);
  
  const tracks = [];
  const duration = 3;

  for (let i = 0; i < 40; i++) {
    const isSand = i % 2 === 0;
    const pMesh = new THREE.Mesh(
      new THREE.SphereGeometry(isSand ? 0.1 : 0.15, 8, 8),
      isSand ? sandMat : waterMat
    );
    particlesGroup.add(pMesh);

    const times = [];
    const positions = [];
    const scales = [];
    const startPhase = Math.random() * duration;
    
    for (let f = 0; f <= 30; f++) {
      const t = (f / 30) * duration;
      const progress = ((t + startPhase) % duration) / duration;
      
      let x, y, z;
      let s = isSand ? 1 : 1;
      
      if (progress < 0.05) s = progress / 0.05;
      else if (progress > 0.95) s = (1.0 - progress) / 0.05;

      if (progress < 0.2) {
        const p = progress / 0.2;
        x = 3.25 - p * 1.5; y = 4; z = 1.5;
      } else {
        const p = (progress - 0.2) / 0.8;
        const angle = p * Math.PI * 10;
        if (isSand) {
          const radius = 1.8 * (1 - p) + 0.2;
          x = Math.cos(angle) * radius; z = Math.sin(angle) * radius; y = 4 - p * 8;
        } else {
          if (p < 0.6) {
            const p2 = p / 0.6;
            const radius = 1.8 * (1 - p2) + 0.4;
            x = Math.cos(angle) * radius; z = Math.sin(angle) * radius; y = 4 - p2 * 6;
          } else {
            const p2 = (p - 0.6) / 0.4;
            const radius = 0.4 * (1 - p2);
            x = Math.cos(angle) * radius; z = Math.sin(angle) * radius; y = -2 + p2 * 9;
          }
        }
      }
      
      times.push(t);
      positions.push(x, y, z);
      scales.push(s, s, s);
    }
    
    tracks.push(new THREE.VectorKeyframeTrack(`${pMesh.uuid}.position`, times, positions));
    tracks.push(new THREE.VectorKeyframeTrack(`${pMesh.uuid}.scale`, times, scales));
  }

  const clip = new THREE.AnimationClip('HydrocycloneOperation', duration, tracks);
  return { group, animationClips: [clip] };
}
