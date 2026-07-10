import materials from '../utils/materials.js';

export function createControlRodDriveMechanism(THREE) {
  const group = new THREE.Group();
  
  const casingMat = materials?.casing || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
  const rodMat = materials?.rod || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.8 });

  // Main housing
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 15, 32), casingMat);
  housing.position.y = 7.5;
  group.add(housing);

  // Rods cluster
  const rodGroup = new THREE.Group();
  rodGroup.name = "ControlRods";
  
  // Spider assembly
  const spider = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 16), casingMat);
  spider.position.y = 14;
  rodGroup.add(spider);

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
        if (i===0 && j===0) continue;
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 20, 16), rodMat);
        rod.position.set(i * 1.2, 4, j * 1.2);
        rodGroup.add(rod);
    }
  }
  group.add(rodGroup);

  const animationClips = [];
  // Insertion and withdrawal animation
  const times = [0, 5, 10, 15];
  const values = [0, 0, 0,  0, -12, 0,  0, -12, 0,  0, 0, 0];
  const track = new THREE.VectorKeyframeTrack('ControlRods.position', times, values);
  const clip = new THREE.AnimationClip('ScramAndWithdraw', 15, [track]);
  animationClips.push(clip);

  return { group, animationClips };
}
