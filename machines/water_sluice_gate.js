import * as materials from '../utils/materials.js';

export function createSluiceGate(THREE) {
  const group = new THREE.Group();
  
  const frameGeo = new THREE.BoxGeometry(6, 12, 1);
  const frameMat = materials.darkSteel;
  
  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(1, 12, 1.5), frameMat);
  leftPillar.position.set(-3.5, 6, 0);
  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(1, 12, 1.5), frameMat);
  rightPillar.position.set(3.5, 6, 0);
  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 1.5), frameMat);
  topBeam.position.set(0, 12.5, 0);
  
  group.add(leftPillar, rightPillar, topBeam);

  const gate = new THREE.Group();
  const panelGeo = new THREE.BoxGeometry(6, 6, 0.5);
  const panel = new THREE.Mesh(panelGeo, materials.steel);
  panel.position.set(0, 3, 0);
  
  const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 8);
  const stem = new THREE.Mesh(stemGeo, materials.chrome);
  stem.position.set(0, 9, 0);
  
  gate.add(panel, stem);
  group.add(gate);

  const actuatorGroup = new THREE.Group();
  actuatorGroup.position.set(0, 13.5, 0);
  
  const motorGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5);
  const motor = new THREE.Mesh(motorGeo, materials.redAccent);
  motor.rotation.x = Math.PI / 2;
  actuatorGroup.add(motor);
  
  const wheelGeo = new THREE.TorusGeometry(1.5, 0.15, 16, 32);
  const wheel = new THREE.Mesh(wheelGeo, materials.brass);
  wheel.rotation.x = Math.PI / 2;
  wheel.position.y = 1;
  actuatorGroup.add(wheel);
  
  group.add(actuatorGroup);

  const waterGeo = new THREE.BoxGeometry(5.8, 2, 10);
  const waterMat = materials.glass.clone();
  waterMat.color = new THREE.Color(0x00aaff);
  waterMat.opacity = 0.6;
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(0, 1, 5);
  group.add(water);

  const tracks = [];
  const times = [0, 2, 4, 6];
  
  const gateY = [0, 5, 5, 0];
  tracks.push(new THREE.NumberKeyframeTrack(`${gate.uuid}.position[y]`, times, gateY));
  
  const wheelTimes = [0, 2, 4, 6];
  const wheelRot = [0, Math.PI*4, Math.PI*4, 0];
  tracks.push(new THREE.NumberKeyframeTrack(`${wheel.uuid}.rotation[y]`, wheelTimes, wheelRot));
  
  const waterZScale = [0.01, 1, 1, 0.01];
  const waterZPos = [0.05, 5, 5, 0.05];
  tracks.push(new THREE.NumberKeyframeTrack(`${water.uuid}.scale[z]`, times, waterZScale));
  tracks.push(new THREE.NumberKeyframeTrack(`${water.uuid}.position[z]`, times, waterZPos));

  const clip = new THREE.AnimationClip('SluiceGateOperation', 6, tracks);
  return { group, animationClips: [clip] };
}
