export function createScavenging(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Bones starting together
    const boneGeo = new THREE.BoxGeometry(1, 0.2, 0.2);
    const boneMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
    
    const bones = [];
    for (let i = 0; i < 5; i++) {
        const bone = new THREE.Mesh(boneGeo, boneMat);
        bone.position.set(0, 0, (i - 2) * 0.3);
        group.add(bone);
        bones.push(bone);
    }

    // Animation: Bones scatter
    const tracks = [];
    bones.forEach((bone, i) => {
        const targetX = (Math.random() - 0.5) * 6;
        const targetZ = (Math.random() - 0.5) * 6 + (i - 2) * 0.3;
        const posTrack = new THREE.VectorKeyframeTrack(`.children[${i}].position`, [0, 2, 5], [
            0, 0, (i - 2) * 0.3,
            targetX * 0.5, 0.1, targetZ * 0.5,
            targetX, 0, targetZ
        ]);
        tracks.push(posTrack);
    });

    const clip = new THREE.AnimationClip('Scatter', 5, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
