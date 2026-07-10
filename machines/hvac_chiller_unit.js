import { steel, blueAccent, redAccent, darkSteel, plastic, copper } from '../utils/materials.js';

export function createChillerUnit(THREE) {
  const group = new THREE.Group();
  const animationClips = [];
  
  // Evaporator (Cooler) - bottom
  const evaporatorGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
  const evaporator = new THREE.Mesh(evaporatorGeo, blueAccent);
  evaporator.rotation.z = Math.PI / 2;
  evaporator.position.set(0, 1.5, 2);
  group.add(evaporator);
  
  // Condenser - bottom parallel
  const condenserGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
  const condenser = new THREE.Mesh(condenserGeo, redAccent);
  condenser.rotation.z = Math.PI / 2;
  condenser.position.set(0, 1.5, -2);
  group.add(condenser);
  
  // Compressor - top middle
  const compressorGroup = new THREE.Group();
  compressorGroup.position.set(0, 4.5, 0);
  
  const compBodyGeo = new THREE.CylinderGeometry(1.2, 1.5, 3, 32);
  const compBody = new THREE.Mesh(compBodyGeo, darkSteel);
  compBody.rotation.z = Math.PI / 2;
  compressorGroup.add(compBody);
  
  // Motor shaft
  const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
  const shaft = new THREE.Mesh(shaftGeo, steel);
  shaft.rotation.z = Math.PI / 2;
  compressorGroup.add(shaft);
  
  // Impeller inside compressor / Coupling
  const couplingPivot = new THREE.Group();
  couplingPivot.position.set(2, 0, 0);
  couplingPivot.rotation.z = Math.PI / 2;
  
  const couplingGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
  const coupling = new THREE.Mesh(couplingGeo, copper);
  coupling.name = "ChillerCoupling";
  couplingPivot.add(coupling);
  
  compressorGroup.add(couplingPivot);
  group.add(compressorGroup);
  
  // Pipes connecting them
  const pipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
  const pipe1 = new THREE.Mesh(pipeGeo, steel);
  pipe1.position.set(-2, 3, 1);
  pipe1.rotation.x = Math.PI / 4;
  group.add(pipe1);
  
  const pipe2 = new THREE.Mesh(pipeGeo, steel);
  pipe2.position.set(2, 3, -1);
  pipe2.rotation.x = -Math.PI / 4;
  group.add(pipe2);
  
  // Control Panel
  const panelGeo = new THREE.BoxGeometry(2, 3, 0.5);
  const panel = new THREE.Mesh(panelGeo, plastic);
  panel.position.set(4, 2, 2.5);
  group.add(panel);
  
  // Animation: Rotate coupling around its local Y axis (cylinder's main axis)
  const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
  
  const rotValues = [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
  ];
  
  const track = new THREE.QuaternionKeyframeTrack('ChillerCoupling.quaternion', [0, 0.5, 1.0], rotValues);
  const clip = new THREE.AnimationClip('CompressorRun', 1.0, [track]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
