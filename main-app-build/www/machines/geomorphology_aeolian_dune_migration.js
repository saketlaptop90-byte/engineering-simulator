export function createAeolianDuneMigration(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Desert floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xF4A460, roughness: 1.0 });
    const floor = new THREE.Mesh(floorGeo, sandMat);
    floor.rotation.x = -Math.PI / 2;
    group.add(floor);

    // Sand Dune
    const duneGeo = new THREE.ConeGeometry(5, 3, 32);
    const dune = new THREE.Mesh(duneGeo, sandMat);
    dune.position.set(-10, 1.5, 0);
    group.add(dune);

    // Migration animation
    const trackName = dune.uuid + '.position';
    const times = [0, 10];
    const values = [-10, 1.5, 0, 10, 1.5, 0];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Migration', 10, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
