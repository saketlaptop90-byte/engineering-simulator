export function createTorusKnot(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const geometry = new THREE.TorusKnotGeometry(2, 0.4, 200, 32, 3, 5);
    const material = new THREE.MeshStandardMaterial({
        color: 0x2ecc71,
        roughness: 0.2,
        metalness: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const tracks = [];
    const times = [0, 4];
    const values = [0, 0, 0, 0, 0, Math.PI * 2];
    const rotationTrack = new THREE.VectorKeyframeTrack('.rotation', times, values);
    tracks.push(rotationTrack);

    const clip = new THREE.AnimationClip('TorusKnotRotation', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
