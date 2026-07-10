import { steelMaterial, aluminumMaterial } from '../utils/materials.js';

export function createHighExpansionFoamGenerator(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  const housingGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
  const housing = new THREE.Mesh(housingGeo, steelMaterial);
  housing.rotation.z = Math.PI / 2;
  group.add(housing);

  const rotor = new THREE.Group();
  rotor.name = "Rotor";
  const bladeGeo = new THREE.BoxGeometry(0.1, 1.4, 0.2);
  const blade1 = new THREE.Mesh(bladeGeo, aluminumMaterial);
  const blade2 = new THREE.Mesh(bladeGeo, aluminumMaterial);
  blade2.rotation.x = Math.PI / 2;
  rotor.add(blade1);
  rotor.add(blade2);
  rotor.position.x = -0.9;
  group.add(rotor);

  const foamGeo = new THREE.SphereGeometry(1, 16, 16);
  const foamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  const foam = new THREE.Mesh(foamGeo, foamMat);
  foam.name = "FoamMass";
  foam.position.x = 1;
  foam.scale.set(0.1, 0.1, 0.1);
  group.add(foam);

  const times = [0, 1, 2];
  
  const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 0, 0, 0));
  const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 1, 0, 0));
  const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 2, 0, 0));
  
  const rotorTrack = new THREE.QuaternionKeyframeTrack('Rotor.quaternion', times, [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
  ]);

  const foamTrack = new THREE.VectorKeyframeTrack('FoamMass.scale', [0, 2], [
    0.1, 0.1, 0.1,
    2.0, 1.5, 1.5
  ]);

  const clip = new THREE.AnimationClip('GenerateFoam', 2, [rotorTrack, foamTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
