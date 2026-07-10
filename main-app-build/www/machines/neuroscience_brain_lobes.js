export function createBrainLobes(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frontal
    const frontalGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const frontalMat = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const frontal = new THREE.Mesh(frontalGeo, frontalMat);
    frontal.position.set(0, 0, 1.5);
    frontal.scale.set(1, 1.2, 1.5);
    group.add(frontal);

    // Parietal
    const parietalGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const parietalMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
    const parietal = new THREE.Mesh(parietalGeo, parietalMat);
    parietal.position.set(0, 1.5, 0);
    group.add(parietal);

    // Occipital
    const occipitalGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const occipitalMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    const occipital = new THREE.Mesh(occipitalGeo, occipitalMat);
    occipital.position.set(0, 0, -1.5);
    group.add(occipital);

    // Temporal
    const temporalGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const temporalMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71 });
    const temporalL = new THREE.Mesh(temporalGeo, temporalMat);
    temporalL.position.set(-1.5, 0, 0);
    const temporalR = new THREE.Mesh(temporalGeo, temporalMat);
    temporalR.position.set(1.5, 0, 0);
    group.add(temporalL, temporalR);

    // Animation (Pulsating)
    const times = [0, 1, 2];
    const values = [1, 1, 1,  1.05, 1.05, 1.05,  1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack(`${group.uuid}.scale`, times, values);
    const clip = new THREE.AnimationClip('BrainPulse', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
