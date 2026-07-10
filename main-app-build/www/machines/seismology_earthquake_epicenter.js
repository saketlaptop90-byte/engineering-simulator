export function createEarthquakeEpicenter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Terrain
    const terrainGeo = new THREE.PlaneGeometry(10, 10, 20, 20);
    terrainGeo.rotateX(-Math.PI / 2);
    const terrainMat = new THREE.MeshStandardMaterial({ color: 0x228B22, wireframe: true });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.name = "Terrain";
    group.add(terrain);

    // Epicenter marker
    const markerGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const markerMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, transparent: true, opacity: 0.8 });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.name = "EpicenterMarker";
    group.add(marker);

    // Seismic waves
    const waveGeo = new THREE.RingGeometry(0.5, 0.6, 32);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const wave1 = new THREE.Mesh(waveGeo, waveMat);
    wave1.rotation.x = -Math.PI / 2;
    wave1.position.y = 0.05;
    wave1.name = "Wave1";
    group.add(wave1);

    const wave2 = new THREE.Mesh(waveGeo, waveMat);
    wave2.rotation.x = -Math.PI / 2;
    wave2.position.y = 0.05;
    wave2.name = "Wave2";
    group.add(wave2);

    // Animation
    const times = [0, 1, 2, 3];
    const wave1Scale = [1,1,1, 3,3,3, 6,6,6, 1,1,1];
    const wave2Scale = [1,1,1, 1,1,1, 3,3,3, 6,6,6];

    const w1sTrack = new THREE.VectorKeyframeTrack('Wave1.scale', times, wave1Scale);
    const w2sTrack = new THREE.VectorKeyframeTrack('Wave2.scale', times, wave2Scale);

    const markerScale = [1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5];
    const mkTrack = new THREE.VectorKeyframeTrack('EpicenterMarker.scale', times, markerScale);

    const clip = new THREE.AnimationClip('EpicenterWave', 3, [w1sTrack, w2sTrack, mkTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
