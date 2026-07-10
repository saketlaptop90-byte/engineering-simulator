export function createCoastalErosionDynamics(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Ocean
    const oceanGeo = new THREE.PlaneGeometry(20, 20);
    const oceanMat = new THREE.MeshStandardMaterial({ color: 0x00008B, transparent: true, opacity: 0.8 });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(0, 0, 0);
    group.add(ocean);

    // Cliff
    const cliffGeo = new THREE.BoxGeometry(20, 10, 5);
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.9 });
    const cliff = new THREE.Mesh(cliffGeo, cliffMat);
    cliff.position.set(0, 5, -7.5);
    group.add(cliff);

    // Wave animation
    const trackName = ocean.uuid + '.position';
    const times = [0, 1, 2, 3, 4];
    const values = [0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Waves', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
