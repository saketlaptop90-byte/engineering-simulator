import { darkSteel, lead, brass, castIron } from '../utils/materials.js';

export function createSeismicShield(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Ground substrate
  const groundGeom = new THREE.BoxGeometry(20, 1, 10);
  const ground = new THREE.Mesh(groundGeom, castIron);
  ground.position.y = -0.5;
  group.add(ground);

  // Protected Building
  const buildingGeom = new THREE.BoxGeometry(4, 6, 4);
  const building = new THREE.Mesh(buildingGeom, brass);
  building.position.set(5, 3, 0);
  group.add(building);

  // Seismic Shield (Grid of resonators)
  const shieldGroup = new THREE.Group();
  const tracks = [];
  
  const pillarGeom = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
  const massGeom = new THREE.SphereGeometry(0.5, 16, 16);
  
  for (let z = -4; z <= 4; z += 1.5) {
    for (let x = -6; x <= -2; x += 1.5) {
      const resonator = new THREE.Group();
      resonator.position.set(x, 0, z);
      
      const pillar = new THREE.Mesh(pillarGeom, darkSteel);
      pillar.position.y = 1;
      
      const mass = new THREE.Mesh(massGeom, lead);
      mass.position.y = 2;
      
      resonator.add(pillar);
      resonator.add(mass);
      shieldGroup.add(resonator);
      
      // Resonator sway animation
      const times = [0, 0.25, 0.5, 0.75, 1];
      const phase = x + z;
      const r1 = 0.2 * Math.sin(phase);
      const r2 = -0.2 * Math.sin(phase);
      
      const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
      const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(r1, 0, r1));
      const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(r2, 0, r2));
      
      const quats = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q0.x, q0.y, q0.z, q0.w,
        q2.x, q2.y, q2.z, q2.w,
        q0.x, q0.y, q0.z, q0.w,
      ];
      tracks.push(new THREE.QuaternionKeyframeTrack(`${resonator.uuid}.quaternion`, times, quats));
    }
  }
  group.add(shieldGroup);

  // Substrate earthquake animation (shielded area vibrates less)
  const groundTimes = [0, 0.25, 0.5, 0.75, 1];
  const gVals = [
    -0.5, -0.5, 0,
    -0.2, -0.5, 0,
    -0.7, -0.5, 0,
    -0.3, -0.5, 0,
    -0.5, -0.5, 0
  ];
  tracks.push(new THREE.VectorKeyframeTrack(`${ground.uuid}.position`, groundTimes, gVals));

  const clip = new THREE.AnimationClip('SeismicDamping', 1, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
