import materials from '../utils/materials.js';

export function createCentrifugeCascade(THREE) {
  const group = new THREE.Group();
  
  const centMat = materials?.centrifuge || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
  const pipeMat = materials?.pipe || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5, roughness: 0.5 });

  const cascadeGroup = new THREE.Group();
  cascadeGroup.name = "Cascade";

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const centGroup = new THREE.Group();
      centGroup.name = `Rotor_${row}_${col}`;
      
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 5, 16), centMat);
      centGroup.add(rotor);
      
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 8), pipeMat);
      pipe.position.y = 3;
      centGroup.add(pipe);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16), pipeMat);
      base.position.y = -2.75;
      centGroup.add(base);

      centGroup.position.set(col * 1.5 - 3.75, 0, row * 1.5 - 2.25);
      cascadeGroup.add(centGroup);
    }
  }
  group.add(cascadeGroup);

  const animationClips = [];
  // Create rotation animation for all rotors
  const tracks = [];
  const times = [0, 0.5, 1];
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
      const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
      const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
      
      const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
      ];
      
      const track = new THREE.QuaternionKeyframeTrack(`Rotor_${row}_${col}.quaternion`, times, values);
      tracks.push(track);
    }
  }
  
  const clip = new THREE.AnimationClip('Spin', 1, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}

// Auto-generated missing stub
export function createNuclearCentrifugeCascade() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
