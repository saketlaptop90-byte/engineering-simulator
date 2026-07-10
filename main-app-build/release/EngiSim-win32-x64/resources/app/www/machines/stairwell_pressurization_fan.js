import { steelMaterial, aluminumMaterial } from '../utils/materials.js';

export function createStairwellPressurizationFan(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  const housingGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32, 1, true);
  const housing = new THREE.Mesh(housingGeo, steelMaterial);
  housing.rotation.x = Math.PI / 2;
  group.add(housing);

  const hubGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
  const hub = new THREE.Mesh(hubGeo, aluminumMaterial);
  hub.rotation.x = Math.PI / 2;
  group.add(hub);

  const rotor = new THREE.Group();
  rotor.name = "PressurizationRotor";
  for (let i = 0; i < 6; i++) {
    const bladeGeo = new THREE.BoxGeometry(0.1, 1.2, 0.3);
    const blade = new THREE.Mesh(bladeGeo, aluminumMaterial);
    blade.position.y = 0.8;
    
    const pivot = new THREE.Group();
    pivot.rotation.z = (i / 6) * Math.PI * 2;
    pivot.add(blade);
    rotor.add(pivot);
  }
  group.add(rotor);

  const airGroup = new THREE.Group();
  airGroup.name = "AirFlow";
  for(let i=0; i<20; i++) {
      const airGeo = new THREE.BoxGeometry(0.1, 0.1, 0.5);
      const airMat = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.5, depthWrite: false });
      const air = new THREE.Mesh(airGeo, airMat);
      air.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, Math.random()*2 - 1);
      air.name = `Air_${i}`;
      airGroup.add(air);
  }
  group.add(airGroup);

  const times = [0, 1];
  const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
  const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI * 2));
  
  const rotorTrack = new THREE.QuaternionKeyframeTrack('PressurizationRotor.quaternion', times, [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w
  ]);

  const tracks = [rotorTrack];
  
  airGroup.children.forEach((air) => {
      const startZ = air.position.z;
      const endZ = startZ - 4;
      tracks.push(new THREE.VectorKeyframeTrack(`${air.name}.position`, [0, 1], [
          air.position.x, air.position.y, startZ,
          air.position.x, air.position.y, endZ
      ]));
  });

  const clip = new THREE.AnimationClip('ExtractSmoke', 1, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
