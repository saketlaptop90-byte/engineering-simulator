export function createCoronavirus(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Envelope
    const envGeometry = new THREE.SphereGeometry(3, 32, 32);
    const envMaterial = new THREE.MeshStandardMaterial({ color: 0xcc4444, roughness: 0.8, metalness: 0.1 });
    const envelope = new THREE.Mesh(envGeometry, envMaterial);
    group.add(envelope);

    // Spikes (S proteins)
    const spikeGeo = new THREE.CylinderGeometry(0.1, 0.3, 1, 8);
    spikeGeo.translate(0, 0.5, 0);
    const headGeo = new THREE.SphereGeometry(0.4, 8, 8);
    headGeo.translate(0, 1.2, 0);
    
    const spikeMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.5 });
    
    const numSpikes = 40;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    for (let i = 0; i < numSpikes; i++) {
        const y = 1 - (i / (numSpikes - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        const spikeGroup = new THREE.Group();
        const stalk = new THREE.Mesh(spikeGeo, spikeMaterial);
        const head = new THREE.Mesh(headGeo, spikeMaterial);
        spikeGroup.add(stalk);
        spikeGroup.add(head);

        spikeGroup.position.set(x * 3, y * 3, z * 3);
        spikeGroup.lookAt(0, 0, 0);
        // Spikes point outward
        spikeGroup.rotateX(-Math.PI / 2);
        group.add(spikeGroup);
    }

    // Animation (Breathing/Scaling)
    const times = [0, 1.5, 3];
    const values = [1, 1, 1, 1.05, 1.05, 1.05, 1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack('.scale', times, values);
    const clip = new THREE.AnimationClip('breathe', 3, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
