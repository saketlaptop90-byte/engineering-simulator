import { steelMaterial, copperMaterial } from '../utils/materials.js';

export function createCleanAgentGasCylinderRack(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  const frameGeo = new THREE.BoxGeometry(3, 2, 1);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.y = 1;
  group.add(frame);

  const gasGroup = new THREE.Group();
  gasGroup.name = "GasDischarge";
  
  for (let i = -1; i <= 1; i += 1) {
    const cylinderGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 32);
    const cylinderMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
    cylinder.position.set(i, 0.9, 0);
    group.add(cylinder);

    const valveGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const valve = new THREE.Mesh(valveGeo, copperMaterial);
    valve.position.set(i, 1.9, 0);
    group.add(valve);

    const gasGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const gasMat = new THREE.MeshBasicMaterial({ color: 0xaaffaa, transparent: true, opacity: 0, depthWrite: false });
    const gas = new THREE.Mesh(gasGeo, gasMat);
    gas.position.set(i, 2.2, 0);
    gas.name = `Gas_${i+1}`; 
    gasGroup.add(gas);
  }
  group.add(gasGroup);

  const times = [0, 0.5, 1.5, 2];
  const tracks = [];
  
  gasGroup.children.forEach((gas) => {
    tracks.push(new THREE.NumberKeyframeTrack(`${gas.name}.material.opacity`, times, [0, 0.6, 0.6, 0]));
    tracks.push(new THREE.VectorKeyframeTrack(`${gas.name}.scale`, times, [
      0.1, 0.1, 0.1,
      2, 2, 2,
      3, 3, 3,
      4, 4, 4
    ]));
  });

  const clip = new THREE.AnimationClip('DischargeGas', 2, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
