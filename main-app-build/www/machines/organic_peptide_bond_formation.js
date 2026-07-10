export function createPeptideBondFormation(THREE) {
  const group = new THREE.Group();

  // Amino Acid 1 (simplified)
  const aa1 = new THREE.Group();
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({color:0x0000ff}));
  n1.position.set(-1, 0, 0);
  const ca1 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({color:0x222222}));
  ca1.position.set(0, 0, 0);
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({color:0x222222}));
  c1.position.set(1, 0, 0);
  const oh1 = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial({color:0xff0000}));
  oh1.position.set(1.5, 0.5, 0); // OH group to leave
  aa1.add(n1, ca1, c1, oh1);
  aa1.position.set(-3, 0, 0);
  group.add(aa1);

  // Amino Acid 2
  const aa2 = new THREE.Group();
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({color:0x0000ff}));
  n2.position.set(-1, 0, 0);
  const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshStandardMaterial({color:0xffffff}));
  h2.position.set(-1.5, -0.5, 0); // H group to leave
  const ca2 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({color:0x222222}));
  ca2.position.set(0, 0, 0);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({color:0x222222}));
  c2.position.set(1, 0, 0);
  aa2.add(n2, h2, ca2, c2);
  aa2.position.set(3, 0, 0);
  group.add(aa2);

  // Animation: They come together
  const times = [0, 2, 4];
  
  const aa1Track = new THREE.VectorKeyframeTrack(
    aa1.uuid + '.position', times,
    [-3, 0, 0,  -1, 0, 0,  -1, 0, 0]
  );
  
  const aa2Track = new THREE.VectorKeyframeTrack(
    aa2.uuid + '.position', times,
    [3, 0, 0,   1, 0, 0,   1, 0, 0]
  );

  // Water molecule leaving
  const waterTrack1 = new THREE.VectorKeyframeTrack(
    oh1.uuid + '.position', times,
    [1.5, 0.5, 0,  1.5, 0.5, 0,  1.5, 3, 0]
  );
  const waterTrack2 = new THREE.VectorKeyframeTrack(
    h2.uuid + '.position', times,
    [-1.5, -0.5, 0,  -1.5, -0.5, 0,  -1.5, 2, 0] // approximate water leaving
  );

  const clip = new THREE.AnimationClip('Peptide_Bond', 4, [
    aa1Track, aa2Track, waterTrack1, waterTrack2
  ]);

  return { group, animationClips: [clip] };
}
