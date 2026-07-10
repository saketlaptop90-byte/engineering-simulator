export function createFossilization(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Bone
    const boneGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const boneMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const bone = new THREE.Mesh(boneGeometry, boneMaterial);
    bone.rotation.z = Math.PI / 2;
    group.add(bone);

    // Sediment Layers
    const sedimentGeometry = new THREE.BoxGeometry(10, 5, 10);
    const sedimentMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, transparent: true, opacity: 0.5 });
    const sediment = new THREE.Mesh(sedimentGeometry, sedimentMaterial);
    sediment.position.y = -3;
    group.add(sediment);

    // Animation: Sediment rises, bone color changes
    const sedimentTrack = new THREE.VectorKeyframeTrack('.children[1].position', [0, 5, 10], [0, -3, 0, 0, 0, 0, 0, 2, 0]);
    const boneColorTrack = new THREE.ColorKeyframeTrack('.children[0].material.color', [0, 5, 10], [1, 1, 1, 0.7, 0.6, 0.5, 0.4, 0.3, 0.3]);
    
    const clip = new THREE.AnimationClip('Fossilize', 10, [sedimentTrack, boneColorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
