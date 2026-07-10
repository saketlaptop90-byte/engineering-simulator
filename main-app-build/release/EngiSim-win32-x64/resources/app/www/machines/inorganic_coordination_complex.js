export function createCoordinationComplex(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, roughness: 0.2, metalness: 0.8 });
    const metal = new THREE.Mesh(metalGeo, metalMat);
    group.add(metal);

    const ligandGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const ligandMat = new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.4, metalness: 0.1 });
    const bondGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const bondMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

    const positions = [
        [1.5, 0, 0], [-1.5, 0, 0],
        [0, 1.5, 0], [0, -1.5, 0],
        [0, 0, 1.5], [0, 0, -1.5]
    ];

    const tracks = [];
    const times = [0, 0.5, 1];

    positions.forEach((pos, idx) => {
        const ligandGroup = new THREE.Group();
        
        const bond = new THREE.Mesh(bondGeo, bondMat);
        bond.position.set(pos[0]/2, pos[1]/2, pos[2]/2);
        bond.lookAt(pos[0], pos[1], pos[2]);
        bond.rotateX(Math.PI / 2);
        ligandGroup.add(bond);

        const ligand = new THREE.Mesh(ligandGeo, ligandMat);
        ligand.position.set(pos[0], pos[1], pos[2]);
        ligandGroup.add(ligand);

        group.add(ligandGroup);

        const scaleValues = [
            1, 1, 1,
            1.1, 1.1, 1.1,
            1, 1, 1
        ];
        tracks.push(new THREE.VectorKeyframeTrack(`.children[${idx + 1}].scale`, times, scaleValues));
    });

    const clip = new THREE.AnimationClip('stretch', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
