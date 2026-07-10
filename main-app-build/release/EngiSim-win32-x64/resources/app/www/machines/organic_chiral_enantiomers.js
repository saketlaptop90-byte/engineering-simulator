export function createChiralEnantiomers(THREE) {
  const group = new THREE.Group();

  function buildEnantiomer(isMirror) {
    const molGroup = new THREE.Group();

    const cGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const cMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const carbon = new THREE.Mesh(cGeometry, cMaterial);
    molGroup.add(carbon);

    // Substituents: H, F, Cl, Br
    const subParams = [
      { color: 0xffffff, size: 0.25, pos: [0, 1, 0] },          // H
      { color: 0x00ff00, size: 0.3, pos: [0.94, -0.33, 0] },    // F
      { color: 0x00ff00, size: 0.4, pos: [-0.47, -0.33, 0.81] },// Cl
      { color: 0x8b0000, size: 0.45, pos: [-0.47, -0.33, -0.81]}// Br
    ];

    if (isMirror) {
      // Reflect across x-axis
      subParams.forEach(p => p.pos[0] = -p.pos[0]);
    }

    subParams.forEach(p => {
      const sMesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.size, 32, 32),
        new THREE.MeshStandardMaterial({ color: p.color })
      );
      sMesh.position.set(...p.pos);
      molGroup.add(sMesh);
    });

    return molGroup;
  }

  const mol1 = buildEnantiomer(false);
  mol1.position.set(-2, 0, 0);
  group.add(mol1);

  const mol2 = buildEnantiomer(true);
  mol2.position.set(2, 0, 0);
  group.add(mol2);

  // Animation: Rotate both to show non-superimposability
  const times = [0, 2, 4];
  // Convert euler to quaternion manually or just use quaternion tracks
  const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
  const qMid = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
  const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));

  const vals = [
    qStart.x, qStart.y, qStart.z, qStart.w,
    qMid.x, qMid.y, qMid.z, qMid.w,
    qEnd.x, qEnd.y, qEnd.z, qEnd.w
  ];

  const track1 = new THREE.QuaternionKeyframeTrack(mol1.uuid + '.quaternion', times, vals);
  const track2 = new THREE.QuaternionKeyframeTrack(mol2.uuid + '.quaternion', times, vals);

  const clip = new THREE.AnimationClip('Chiral_Rotation', 4, [track1, track2]);

  return { group, animationClips: [clip] };
}
