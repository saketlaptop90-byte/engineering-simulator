export function createDecayStages(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Soft tissue (fish-like)
    const tissueGeometry = new THREE.CapsuleGeometry(1, 3, 16, 16);
    const tissueMaterial = new THREE.MeshStandardMaterial({ color: 0xffa07a, transparent: true, opacity: 1.0 });
    const tissue = new THREE.Mesh(tissueGeometry, tissueMaterial);
    tissue.rotation.z = Math.PI / 2;
    group.add(tissue);

    // Skeleton inside (starts invisible, becomes visible as tissue decays)
    const skeletonGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
    const skeletonMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true, opacity: 0.0 });
    const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);
    skeleton.rotation.z = Math.PI / 2;
    group.add(skeleton);

    // Animation: Tissue fades out, skeleton fades in
    const tissueOpacityTrack = new THREE.NumberKeyframeTrack('.children[0].material.opacity', [0, 5, 10], [1.0, 0.5, 0.0]);
    const skeletonOpacityTrack = new THREE.NumberKeyframeTrack('.children[1].material.opacity', [0, 5, 10], [0.0, 0.5, 1.0]);

    const clip = new THREE.AnimationClip('Decay', 10, [tissueOpacityTrack, skeletonOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
