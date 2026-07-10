export function createHistologySlideStainer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base machine
    const baseGeo = new THREE.BoxGeometry(4, 1.5, 2);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.3 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Staining baths
    for (let i = 0; i < 8; i++) {
        const bathGeo = new THREE.BoxGeometry(0.4, 0.8, 1);
        const bathMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, transparent: true, opacity: 0.7 });
        const bath = new THREE.Mesh(bathGeo, bathMat);
        bath.position.set(-1.5 + i * 0.45, 0.4, 0);
        group.add(bath);
    }

    // Robotic arm
    const armGeo = new THREE.BoxGeometry(0.2, 2, 0.2);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6 });
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.set(-1.5, 1.5, 0);
    group.add(arm);

    // Animation (Robotic arm moving across baths)
    const times = [0, 2, 4];
    const values = [-1.5, 1.65, -1.5]; // moving along x
    const armTrack = new THREE.NumberKeyframeTrack('.position[x]', times, values);
    const clip = new THREE.AnimationClip('MoveArm', 4, [armTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
