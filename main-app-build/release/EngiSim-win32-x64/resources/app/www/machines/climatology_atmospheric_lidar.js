export function createAtmosphericLidar(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const housingMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.5, roughness: 0.5 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.6 });

    // Main Housing
    const bodyGeo = new THREE.BoxGeometry(2, 1.5, 2);
    const body = new THREE.Mesh(bodyGeo, housingMat);
    body.position.y = 0.75;
    group.add(body);

    // Optical Window
    const windowGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
    const windowMesh = new THREE.Mesh(windowGeo, lensMat);
    windowMesh.rotation.x = Math.PI / 2;
    windowMesh.position.set(0, 1, 1.05);
    group.add(windowMesh);

    // Laser Beam (Animated)
    const laserGroup = new THREE.Group();
    laserGroup.position.set(0, 1, 1.1);
    laserGroup.rotation.x = Math.PI / 2;
    laserGroup.name = "laserGroup";
    group.add(laserGroup);

    const beamGeo = new THREE.CylinderGeometry(0.1, 0.5, 10, 16);
    const beam = new THREE.Mesh(beamGeo, laserMat);
    beam.position.y = 5;
    laserGroup.add(beam);

    // Scanning Mirror inside housing
    const mirrorGeo = new THREE.BoxGeometry(1.2, 0.05, 1.2);
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0 });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0, 1, 0.5);
    mirror.rotation.x = -Math.PI / 4;
    group.add(mirror);

    // Animation: Pulse laser beam by scaling
    const times = [0, 0.1, 0.2, 0.3, 0.4];
    const scaleValues = [
        1, 1, 1,
        1, 1, 10,
        1, 1, 1,
        1, 1, 10,
        1, 1, 1
    ];
    const scaleTrack = new THREE.VectorKeyframeTrack("laserGroup.scale", times, scaleValues);
    const clip = new THREE.AnimationClip("LaserPulse", 0.4, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
