import { aluminum, plastic, copper, insulation, steel, blueAccent, redAccent } from '../utils/materials.js';

export function createAirHandlingUnit(THREE) {
  const group = new THREE.Group();
  const animationClips = [];
  
  // AHU Casing
  const casingGeo = new THREE.BoxGeometry(10, 4, 4);
  const casing = new THREE.Mesh(casingGeo, aluminum);
  casing.position.set(0, 2, 0);
  group.add(casing);
  
  // Filter section
  const filterGeo = new THREE.BoxGeometry(1, 3.8, 3.8);
  const filter = new THREE.Mesh(filterGeo, insulation);
  filter.position.set(-4, 2, 0);
  group.add(filter);
  
  // Cooling Coil
  const coilGeo = new THREE.BoxGeometry(1, 3.8, 3.8);
  const coolingCoil = new THREE.Mesh(coilGeo, blueAccent);
  coolingCoil.position.set(-2, 2, 0);
  group.add(coolingCoil);
  
  // Heating Coil
  const heatingCoil = new THREE.Mesh(coilGeo, redAccent);
  heatingCoil.position.set(0, 2, 0);
  group.add(heatingCoil);
  
  // Supply Fan
  const fanGroup = new THREE.Group();
  fanGroup.position.set(3, 2, 0);
  
  const fanHousingGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
  const fanHousing = new THREE.Mesh(fanHousingGeo, steel);
  fanHousing.rotation.x = Math.PI / 2;
  fanGroup.add(fanHousing);
  
  // Blades Pivot
  const bladesPivot = new THREE.Group();
  bladesPivot.rotation.x = Math.PI / 2; // Point cylinder axis to match housing
  fanGroup.add(bladesPivot);
  
  const bladesObj = new THREE.Group();
  bladesObj.name = "AHUBlades";
  bladesPivot.add(bladesObj);
  
  const bladesGeo = new THREE.BoxGeometry(2.8, 0.2, 0.5);
  const blades1 = new THREE.Mesh(bladesGeo, plastic);
  const blades2 = new THREE.Mesh(bladesGeo, plastic);
  blades2.rotation.y = Math.PI / 2;
  
  bladesObj.add(blades1);
  bladesObj.add(blades2);
  
  group.add(fanGroup);
  
  // Animation: Fan rotation around its local Y axis
  const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
  
  const rotValues = [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
  ];
  const track = new THREE.QuaternionKeyframeTrack('AHUBlades.quaternion', [0, 0.5, 1.0], rotValues);
  const clip = new THREE.AnimationClip('FanRun', 1.0, [track]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
