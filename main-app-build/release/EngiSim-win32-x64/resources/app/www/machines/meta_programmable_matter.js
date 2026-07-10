import { chrome, gold, steel } from '../utils/materials.js';

export function createProgrammableMatterCube(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  const size = 5;
  const offset = 0.6;
  const voxels = [];
  const tracks = [];
  
  const voxelGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  
  for (let x = -2; x <= 2; x++) {
    for (let y = -2; y <= 2; y++) {
      for (let z = -2; z <= 2; z++) {
        const mat = (x + y + z) % 2 === 0 ? chrome : gold;
        const voxel = new THREE.Mesh(voxelGeom, mat);
        
        const px = x * offset;
        const py = y * offset;
        const pz = z * offset;
        voxel.position.set(px, py, pz);
        
        group.add(voxel);
        voxels.push({ mesh: voxel, x, y, z, px, py, pz });
      }
    }
  }

  // Animation: matter shifting form
  const times = [0, 2, 4];
  
  voxels.forEach(v => {
    // Spherical position
    const radius = 3;
    const dist = Math.sqrt(v.px*v.px + v.py*v.py + v.pz*v.pz) || 1;
    const sx = (v.px / dist) * radius + (Math.random() - 0.5);
    const sy = (v.py / dist) * radius + (Math.random() - 0.5);
    const sz = (v.pz / dist) * radius + (Math.random() - 0.5);
    
    const positions = [
      v.px, v.py, v.pz,  // Cube
      sx, sy, sz,        // Sphere
      v.px, v.py, v.pz   // Cube
    ];
    
    const scaleTimes = [0, 1, 2, 3, 4];
    const scales = [
      1, 1, 1,
      0.5, 0.5, 0.5,
      1, 1, 1,
      0.5, 0.5, 0.5,
      1, 1, 1
    ];

    tracks.push(new THREE.VectorKeyframeTrack(`${v.mesh.uuid}.position`, times, positions));
    tracks.push(new THREE.VectorKeyframeTrack(`${v.mesh.uuid}.scale`, scaleTimes, scales));
  });

  const clip = new THREE.AnimationClip('ShapeShift', 4, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
