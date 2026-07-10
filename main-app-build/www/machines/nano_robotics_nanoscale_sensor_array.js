import { greenPCB, gold, glass, yellowAccent } from '../utils/materials.js';

export function createNanoscaleSensorArray(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Base Array
  const baseGeo = new THREE.BoxGeometry(4, 0.2, 4);
  const base = new THREE.Mesh(baseGeo, greenPCB);
  group.add(base);

  // Receptors
  const receptorsGroup = new THREE.Group();
  group.add(receptorsGroup);

  const tracks = [];

  for (let x = -1.5; x <= 1.5; x += 1.5) {
    for (let z = -1.5; z <= 1.5; z += 1.5) {
      const receptor = new THREE.Group();
      receptor.position.set(x, 0.1, z);
      
      // Clean name for track target
      const nodeName = `Receptor_${Math.abs(x * 10)}_${Math.abs(z * 10)}`;
      receptor.name = nodeName;
      
      const stemGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
      const stem = new THREE.Mesh(stemGeo, gold);
      stem.position.y = 0.4;
      receptor.add(stem);

      const dishGeo = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const dish = new THREE.Mesh(dishGeo, glass);
      dish.position.y = 0.8;
      dish.rotation.x = Math.PI;
      receptor.add(dish);

      const coreGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const core = new THREE.Mesh(coreGeo, yellowAccent);
      core.position.y = 0.8;
      receptor.add(core);

      receptorsGroup.add(receptor);

      // Create tracks
      tracks.push(new THREE.NumberKeyframeTrack(
        `${nodeName}.rotation[y]`,
        [0, 2 + (Math.abs(x + z) % 2)],
        [0, Math.PI * 2]
      ));
      tracks.push(new THREE.NumberKeyframeTrack(
        `${nodeName}.rotation[x]`,
        [0, 1, 2],
        [0, Math.PI / 8, 0]
      ));
    }
  }

  const mainClip = new THREE.AnimationClip('SensorSweep', 3, tracks);
  animationClips.push(mainClip);

  return { group, animationClips };
}
