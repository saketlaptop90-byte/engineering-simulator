export function createSpinWaveguide(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base substrate
    const substrateGeo = new THREE.BoxGeometry(10, 0.5, 4);
    const substrateMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
    const substrate = new THREE.Mesh(substrateGeo, substrateMat);
    substrate.position.y = -0.25;
    group.add(substrate);

    // Waveguide track (e.g., YIG - Yttrium Iron Garnet)
    const trackGeo = new THREE.BoxGeometry(10, 0.2, 1);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x00aa55, metalness: 0.5, roughness: 0.5, transparent: true, opacity: 0.8 });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.position.y = 0.1;
    group.add(track);

    // Spin wave representation (sine wave animated)
    const numSpins = 40;
    const spins = [];
    for (let i = 0; i < numSpins; i++) {
        const arrowGeo = new THREE.ConeGeometry(0.1, 0.4, 8);
        const arrowMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const arrow = new THREE.Mesh(arrowGeo, arrowMat);
        const x = -4.8 + (i * 9.6 / (numSpins - 1));
        arrow.position.set(x, 0.3, 0);
        group.add(arrow);
        spins.push(arrow);
    }

    // Creating an animation clip for the spin wave
    const tracks = [];
    const duration = 2; // seconds
    spins.forEach((spin, i) => {
        const times = [];
        const values = [];
        const numFrames = 30;
        const phase = (i / numSpins) * Math.PI * 4; // 2 full waves

        for (let j = 0; j <= numFrames; j++) {
            const t = (j / numFrames) * duration;
            times.push(t);
            const timePhase = (t / duration) * Math.PI * 2;
            const angle = Math.sin(phase - timePhase); // Wave propagating
            
            // Rotation around X axis
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(angle, 0, 0));
            values.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }

        const trackName = spin.uuid + '.quaternion';
        tracks.push(new THREE.QuaternionKeyframeTrack(trackName, times, values));
    });

    const clip = new THREE.AnimationClip('SpinWavePropagation', duration, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
