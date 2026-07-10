export function createNebulaSimulator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Containment Sphere
    const sphereGeo = new THREE.SphereGeometry(3, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0x2244aa, metalness: 0.1, roughness: 0.9, transparent: true, opacity: 0.3 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 3;
    group.add(sphere);

    // Central Heating Element (Proto-sun)
    const sunGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.y = 3;
    group.add(sun);

    // Condensing Grains
    const grainsGroup = new THREE.Group();
    grainsGroup.position.y = 3;
    group.add(grainsGroup);

    const grainGeo = new THREE.IcosahedronGeometry(0.05, 0);
    const grainMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });

    const tracks = [];
    const clipDuration = 5;

    for (let i = 0; i < 50; i++) {
        const grain = new THREE.Mesh(grainGeo, grainMat);
        
        // Random initial position
        const radius = 1 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        grain.position.setFromSphericalCoords(radius, phi, theta);
        grainsGroup.add(grain);

        // Animate grains spiraling inwards and growing
        const times = [0, clipDuration];
        
        const scaleTrackName = `${grain.uuid}.scale`;
        const scaleValues = [0.1, 0.1, 0.1, 1.5, 1.5, 1.5]; // Grow over time
        const scaleTrack = new THREE.VectorKeyframeTrack(scaleTrackName, times, scaleValues);
        tracks.push(scaleTrack);
    }

    // Rotate the whole cloud
    const timesRot = [0, clipDuration];
    
    const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const rotTrack = new THREE.QuaternionKeyframeTrack(`${grainsGroup.uuid}.quaternion`, timesRot, [
        qStart.x, qStart.y, qStart.z, qStart.w,
        qEnd.x, qEnd.y, qEnd.z, qEnd.w
    ]);
    tracks.push(rotTrack);

    // Sun pulsation
    const sunScaleTrack = new THREE.VectorKeyframeTrack(`${sun.uuid}.scale`, [0, clipDuration/2, clipDuration], [1,1,1, 1.2,1.2,1.2, 1,1,1]);
    tracks.push(sunScaleTrack);

    const clip = new THREE.AnimationClip('NebulaCondensation', clipDuration, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
