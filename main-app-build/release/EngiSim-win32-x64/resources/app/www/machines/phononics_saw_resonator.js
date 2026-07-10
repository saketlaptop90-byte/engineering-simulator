export function createSAWResonator(THREE) {
    const group = new THREE.Group();
    const subMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2 });
    const idtMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1 });

    const substrate = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 5), subMat);
    group.add(substrate);

    for(let i = -4; i <= 4; i+=0.5) {
        const finger = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 4), idtMat);
        finger.position.set(i, 0, 0);
        group.add(finger);
    }

    const animationClips = [];
    const times = [0, 0.5, 1];
    const values = [0, 0.1, 0];
    const track = new THREE.NumberKeyframeTrack('.position[y]', times, values);
    const clip = new THREE.AnimationClip('wave', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
