export function createRibosomeTranslator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const largeSubunitMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.8 });
    const smallSubunitMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.8 });
    const mrnaMat = new THREE.MeshStandardMaterial({ color: 0x34495e });
    const proteinMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c });

    const largeGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const large = new THREE.Mesh(largeGeo, largeSubunitMat);
    large.position.y = 0.5;
    group.add(large);

    const smallGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI);
    const small = new THREE.Mesh(smallGeo, smallSubunitMat);
    small.position.y = -0.5;
    group.add(small);

    const mrnaGeo = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);
    const mrna = new THREE.Mesh(mrnaGeo, mrnaMat);
    mrna.rotation.z = Math.PI / 2;
    mrna.name = 'mRNA';
    group.add(mrna);

    const proteinGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 8);
    const protein = new THREE.Mesh(proteinGeo, proteinMat);
    protein.position.y = 2;
    protein.name = 'ProteinChain';
    group.add(protein);

    // Animations
    const mrnaTrack = new THREE.VectorKeyframeTrack('mRNA.position', [0, 2, 4], [
        -2, 0, 0,
        2, 0, 0,
        -2, 0, 0
    ]);
    
    const proteinTrack = new THREE.VectorKeyframeTrack('ProteinChain.scale', [0, 2, 4], [
        1, 0.1, 1,
        1, 1, 1,
        1, 0.1, 1
    ]);

    const clip = new THREE.AnimationClip('Translation', 4, [mrnaTrack, proteinTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
