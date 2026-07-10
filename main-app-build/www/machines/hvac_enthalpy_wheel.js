import { aluminum, ceramic, rubber, castIron } from '../utils/materials.js';

export function createRotaryHeatExchanger(THREE) {
  const group = new THREE.Group();
  const animationClips = [];
  
  // Casing
  const casingGeo = new THREE.BoxGeometry(2, 6, 6);
  const casing = new THREE.Mesh(casingGeo, aluminum);
  casing.position.set(0, 3, 0);
  group.add(casing);
  
  // Wheel Matrix
  const wheelPivot = new THREE.Group();
  wheelPivot.position.set(0, 3, 0);
  wheelPivot.rotation.z = Math.PI / 2; // Axis points along global X
  group.add(wheelPivot);
  
  const wheelGeo = new THREE.CylinderGeometry(2.8, 2.8, 1.8, 32);
  const wheel = new THREE.Mesh(wheelGeo, ceramic);
  wheel.name = "EnthalpyWheel";
  wheelPivot.add(wheel);
  
  // Drive Motor
  const motorGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
  const motor = new THREE.Mesh(motorGeo, castIron);
  motor.position.set(0, 0.5, -2.5);
  motor.rotation.x = Math.PI / 2;
  group.add(motor);
  
  // Belt
  const beltGeo = new THREE.TorusGeometry(2.85, 0.05, 8, 32);
  const belt = new THREE.Mesh(beltGeo, rubber);
  belt.rotation.y = Math.PI / 2;
  belt.position.set(0, 3, 0);
  group.add(belt);
  
  // Animation: Wheel rotation around local Y axis
  const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
  
  const rotValues = [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
  ];
  const track = new THREE.QuaternionKeyframeTrack('EnthalpyWheel.quaternion', [0, 1.5, 3.0], rotValues);
  const clip = new THREE.AnimationClip('WheelSpin', 3.0, [track]);
  animationClips.push(clip);
  
  return { group, animationClips };
}
