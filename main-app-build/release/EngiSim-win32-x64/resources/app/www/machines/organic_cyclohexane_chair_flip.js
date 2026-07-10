export function createCyclohexaneChairFlip(THREE) {
  const group = new THREE.Group();
  
  const cGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  const cMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  
  const carbons = [];
  for (let i = 0; i < 6; i++) {
    const cMesh = new THREE.Mesh(cGeometry, cMaterial);
    group.add(cMesh);
    carbons.push(cMesh);
  }

  // Chair 1 coordinates
  const chair1 = [
    [ 1.2, -0.5,  0.7], // C1
    [ 1.2,  0.5, -0.7], // C2
    [ 0.0, -0.5, -1.4], // C3
    [-1.2,  0.5, -0.7], // C4
    [-1.2, -0.5,  0.7], // C5
    [ 0.0,  0.5,  1.4]  // C6
  ];

  // Boat coordinates (intermediate)
  const boat = [
    [ 1.2,  0.5,  0.7], // C1 (flipped up)
    [ 1.2,  0.5, -0.7], // C2
    [ 0.0, -0.5, -1.4], // C3
    [-1.2,  0.5, -0.7], // C4
    [-1.2,  0.5,  0.7], // C5 (flipped up)
    [ 0.0, -0.5,  1.4]  // C6
  ];

  // Chair 2 coordinates (flipped)
  const chair2 = [
    [ 1.2,  0.5,  0.7], // C1
    [ 1.2, -0.5, -0.7], // C2
    [ 0.0,  0.5, -1.4], // C3
    [-1.2, -0.5, -0.7], // C4
    [-1.2,  0.5,  0.7], // C5
    [ 0.0, -0.5,  1.4]  // C6
  ];

  // Apply initial positions
  carbons.forEach((c, i) => {
    c.position.set(...chair1[i]);
  });

  const times = [0, 1.5, 3];
  const tracks = [];

  carbons.forEach((c, i) => {
    const track = new THREE.VectorKeyframeTrack(
      c.uuid + '.position', times,
      [...chair1[i], ...boat[i], ...chair2[i]]
    );
    tracks.push(track);
  });

  const clip = new THREE.AnimationClip('Chair_Flip', 3, tracks);

  return { group, animationClips: [clip] };
}
