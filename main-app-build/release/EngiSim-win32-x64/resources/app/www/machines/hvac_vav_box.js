import { steel, aluminum, darkSteel, redAccent } from '../utils/materials.js';

export function createVAVBox(THREE) {
  const group = new THREE.Group();
  const animationClips = [];
  
  // Main Box
  const boxGeo = new THREE.BoxGeometry(3, 1.5, 2);
  const box = new THREE.Mesh(boxGeo, steel);
  box.position.set(0, 0.75, 0);
  group.add(box);
  
  // Inlet Duct
  const inletGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16);
  const inlet = new THREE.Mesh(inletGeo, aluminum);
  inlet.rotation.z = Math.PI / 2;
  inlet.position.set(-2.25, 0.75, 0);
  group.add(inlet);
  
  // Outlet Duct
  const outletGeo = new THREE.BoxGeometry(1.5, 1.2, 1.8);
  const outlet = new THREE.Mesh(outletGeo, aluminum);
  outlet.position.set(2.25, 0.75, 0);
  group.add(outlet);
  
  // Reheat Coil (attached to outlet)
  const coilGeo = new THREE.BoxGeometry(0.4, 1.4, 2.0);
  const coil = new THREE.Mesh(coilGeo, redAccent);
  coil.position.set(1.5, 0.75, 0);
  group.add(coil);
  
  // Actuator
  const actuatorGeo = new THREE.BoxGeometry(0.4, 0.6, 0.8);
  const actuator = new THREE.Mesh(actuatorGeo, darkSteel);
  actuator.position.set(-1.5, 1.6, 0.5);
  group.add(actuator);
  
  // Damper Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.2, 16);
  const shaft = new THREE.Mesh(shaftGeo, steel);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.set(-1.5, 0.75, 0);
  group.add(shaft);
  
  // Damper Blade Pivot
  const damperPivot = new THREE.Group();
  damperPivot.position.set(-1.5, 0.75, 0);
  // Original blade rotated around X to lay flat inside the inlet duct
  damperPivot.rotation.x = Math.PI / 2; 
  group.add(damperPivot);
  
  const damperBladeObj = new THREE.Group();
  damperBladeObj.name = "VAVDamper";
  damperPivot.add(damperBladeObj);
  
  const bladeGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.05, 16);
  const blade = new THREE.Mesh(bladeGeo, aluminum);
  blade.rotation.z = Math.PI / 2;
  damperBladeObj.add(blade);
  
  // Animation: Damper oscillating (opening and closing) around local Y axis
  const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0); // Open
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 3); // Partially closed
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0); // Open
  
  const rotValues = [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
  ];
  const track = new THREE.QuaternionKeyframeTrack('VAVDamper.quaternion', [0, 2.0, 4.0], rotValues);
  const clip = new THREE.AnimationClip('DamperModulate', 4.0, [track]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
