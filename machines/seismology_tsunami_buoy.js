export function createTsunamiBuoy(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Ocean surface
    const oceanGeo = new THREE.PlaneGeometry(8, 8, 10, 10);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshStandardMaterial({ color: 0x006994, transparent: true, opacity: 0.7 });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.name = "Ocean";
    group.add(ocean);

    // Buoy
    const buoyGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const buoyMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const buoy = new THREE.Mesh(buoyGeo, buoyMat);
    buoy.name = "Buoy";
    group.add(buoy);

    // Antenna
    const antGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
    const antMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const antenna = new THREE.Mesh(antGeo, antMat);
    antenna.position.y = 1;
    buoy.add(antenna);

    // Animation
    const times = [0, 1, 2, 3, 4];
    const buoyPos = [0, 0, 0,  0, 0.5, 0,  0, -0.2, 0,  0, 0.2, 0,  0, 0, 0];
    const buoyRot = [
        0, 0, 0, 1,
        0, 0, 0.1, 0.995,
        0, 0, -0.05, 0.999,
        0, 0, 0.02, 1,
        0, 0, 0, 1
    ];
    
    const posTrack = new THREE.VectorKeyframeTrack('Buoy.position', times, buoyPos);
    const rotTrack = new THREE.QuaternionKeyframeTrack('Buoy.quaternion', times, buoyRot);

    const oceanPos = [0, 0, 0,  0, 0.4, 0,  0, -0.1, 0,  0, 0.1, 0,  0, 0, 0];
    const oceanTrack = new THREE.VectorKeyframeTrack('Ocean.position', times, oceanPos);

    const clip = new THREE.AnimationClip('TsunamiWave', 4, [posTrack, rotTrack, oceanTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
