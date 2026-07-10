import * as materials from '../utils/materials.js';

export function createKaplanTurbine(THREE) {
  const group = new THREE.Group();
  
  const casingGeo = new THREE.CylinderGeometry(5, 3, 10, 32, 1, true);
  const casing = new THREE.Mesh(casingGeo, materials.ghostMaterial);
  group.add(casing);

  const rotor = new THREE.Group();
  group.add(rotor);
  
  const shaftGeo = new THREE.CylinderGeometry(0.8, 0.8, 12);
  const shaft = new THREE.Mesh(shaftGeo, materials.steel);
  shaft.position.y = 2;
  rotor.add(shaft);
  
  const hubGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, materials.steel);
  hub.position.y = -1;
  rotor.add(hub);
  
  const hubBottomGeo = new THREE.ConeGeometry(2, 3, 32);
  const hubBottom = new THREE.Mesh(hubBottomGeo, materials.steel);
  hubBottom.position.y = -2.5;
  hubBottom.rotation.x = Math.PI;
  rotor.add(hubBottom);

  const blades = [];
  const numBlades = 5;
  for (let i = 0; i < numBlades; i++) {
    const bladePivot = new THREE.Group();
    const angle = (i / numBlades) * Math.PI * 2;
    bladePivot.position.set(Math.cos(angle) * 1.5, -1, Math.sin(angle) * 1.5);
    bladePivot.rotation.y = -angle; 
    
    const bladeGeo = new THREE.BoxGeometry(3, 0.2, 2.5);
    const blade = new THREE.Mesh(bladeGeo, materials.brass);
    blade.position.set(1.5, 0, 0); 
    bladePivot.add(blade);
    
    rotor.add(bladePivot);
    blades.push(bladePivot);
  }

  const wicketGates = [];
  const numGates = 12;
  for (let i = 0; i < numGates; i++) {
    const gatePivot = new THREE.Group();
    const angle = (i / numGates) * Math.PI * 2;
    gatePivot.position.set(Math.cos(angle) * 4, 1, Math.sin(angle) * 4);
    gatePivot.rotation.y = -angle;
    
    const gateGeo = new THREE.BoxGeometry(1.5, 3, 0.2);
    const gate = new THREE.Mesh(gateGeo, materials.darkSteel);
    gate.position.set(0.75, 0, 0);
    gatePivot.add(gate);
    
    group.add(gatePivot);
    wicketGates.push(gatePivot);
  }

  const waterGeo = new THREE.TorusGeometry(3.5, 0.8, 16, 64);
  const waterMat = materials.glass.clone();
  waterMat.color = new THREE.Color(0x33ccff);
  waterMat.opacity = 0.5;
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = Math.PI / 2;
  water.position.y = 1;
  group.add(water);

  const tracks = [];
  
  const spinTimes = [0, 1, 2, 3, 4];
  const spinRot = [0, Math.PI*2, Math.PI*4, Math.PI*6, Math.PI*8];
  tracks.push(new THREE.NumberKeyframeTrack(`${rotor.uuid}.rotation[y]`, spinTimes, spinRot));
  tracks.push(new THREE.NumberKeyframeTrack(`${water.uuid}.rotation[z]`, spinTimes, [0, -Math.PI*2, -Math.PI*4, -Math.PI*6, -Math.PI*8]));
  
  const pitchTimes = [0, 2, 4];
  const pitchRot = [Math.PI / 6, -Math.PI / 6, Math.PI / 6];
  blades.forEach(blade => {
    tracks.push(new THREE.NumberKeyframeTrack(`${blade.uuid}.rotation[x]`, pitchTimes, pitchRot));
  });

  const gateTimes = [0, 2, 4];
  const gateRot = [Math.PI / 4, 0, Math.PI / 4]; 
  wicketGates.forEach(gate => {
    tracks.push(new THREE.NumberKeyframeTrack(`${gate.uuid}.rotation[y]`, gateTimes, gateRot));
  });

  const clip = new THREE.AnimationClip('TurbineOperation', 4, tracks);
  return { group, animationClips: [clip] };
}
