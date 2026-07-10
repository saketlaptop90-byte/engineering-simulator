export function createGlacialRetreatModel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Valley
    const valleyGeo = new THREE.BoxGeometry(10, 4, 30);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.9 });
    const valley = new THREE.Mesh(valleyGeo, rockMat);
    valley.position.set(0, 0, 0);
    group.add(valley);

    // Glacier
    const glacierGeo = new THREE.BoxGeometry(8, 4, 15);
    const iceMat = new THREE.MeshStandardMaterial({ color: 0xE0FFFF, transparent: true, opacity: 0.8, roughness: 0.1 });
    const glacier = new THREE.Mesh(glacierGeo, iceMat);
    glacier.position.set(0, 2, 7.5);
    group.add(glacier);

    // Animation for retreat
    const trackName = glacier.uuid + '.position';
    const times = [0, 5, 10];
    const values = [0, 2, 7.5, 0, 2, 12, 0, 2, 7.5];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Retreat', 10, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
