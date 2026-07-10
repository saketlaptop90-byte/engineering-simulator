export function createIonThruster(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Grid
    const gridGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.2, 32);
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, wireframe: true });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.position.y = -4.1;
    group.add(grid);

    // Plume
    const plumeGeo = new THREE.ConeGeometry(1.8, 10, 32);
    const plumeMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.position.y = -9.1;
    group.add(plume);

    // Animation (pulsing plume)
    const trackName = plume.uuid + '.scale';
    const times = [0, 1, 2];
    const values = [1, 1, 1, 1, 1.2, 1, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('pulse', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
