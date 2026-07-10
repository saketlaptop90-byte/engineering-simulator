export function createSn2Reaction(THREE) {
  const group = new THREE.Group();
  
  // Nucleophile (e.g., OH-)
  const nuGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const nuMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const nucleophile = new THREE.Mesh(nuGeometry, nuMaterial);
  nucleophile.position.set(-5, 0, 0);
  group.add(nucleophile);

  // Central Carbon
  const cGeometry = new THREE.SphereGeometry(0.6, 32, 32);
  const cMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const carbon = new THREE.Mesh(cGeometry, cMaterial);
  group.add(carbon);

  // Leaving Group (e.g., Br-)
  const lgGeometry = new THREE.SphereGeometry(0.7, 32, 32);
  const lgMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const leavingGroup = new THREE.Mesh(lgGeometry, lgMaterial);
  leavingGroup.position.set(2, 0, 0);
  group.add(leavingGroup);

  // 3 Hydrogens
  const hGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const hMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const h1 = new THREE.Mesh(hGeometry, hMaterial);
  h1.position.set(-0.5, 1, 0);
  const h2 = new THREE.Mesh(hGeometry, hMaterial);
  h2.position.set(-0.5, -0.5, 0.866);
  const h3 = new THREE.Mesh(hGeometry, hMaterial);
  h3.position.set(-0.5, -0.5, -0.866);
  group.add(h1, h2, h3);

  // Animation for SN2
  // Nu moves in, LG moves out, H's invert (umbrella inversion)
  const times = [0, 1, 2];
  
  const nuTrack = new THREE.VectorKeyframeTrack(
    nucleophile.uuid + '.position', times,
    [-5, 0, 0,  -2, 0, 0,  -1.5, 0, 0]
  );
  
  const lgTrack = new THREE.VectorKeyframeTrack(
    leavingGroup.uuid + '.position', times,
    [2, 0, 0,  2.5, 0, 0,  5, 0, 0]
  );

  const h1Track = new THREE.VectorKeyframeTrack(
    h1.uuid + '.position', times,
    [-0.5, 1, 0,  0, 1, 0,  0.5, 1, 0]
  );
  const h2Track = new THREE.VectorKeyframeTrack(
    h2.uuid + '.position', times,
    [-0.5, -0.5, 0.866,  0, -0.5, 0.866,  0.5, -0.5, 0.866]
  );
  const h3Track = new THREE.VectorKeyframeTrack(
    h3.uuid + '.position', times,
    [-0.5, -0.5, -0.866,  0, -0.5, -0.866,  0.5, -0.5, -0.866]
  );

  const clip = new THREE.AnimationClip('SN2_Reaction', 2, [
    nuTrack, lgTrack, h1Track, h2Track, h3Track
  ]);

  return { group, animationClips: [clip] };
}
