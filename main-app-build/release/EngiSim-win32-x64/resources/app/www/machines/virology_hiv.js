export function createHIV(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Envelope
    const envGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const envMaterial = new THREE.MeshStandardMaterial({ color: 0x6655aa, roughness: 0.7 });
    const envelope = new THREE.Mesh(envGeometry, envMaterial);
    group.add(envelope);

    // Spikes (gp120/gp41)
    const spikeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    spikeGeo.translate(0, 0.4, 0);
    const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
    capGeo.translate(0, 0.9, 0);
    
    const spikeMaterial = new THREE.MeshStandardMaterial({ color: 0x44cc77, roughness: 0.6 });
    
    const numSpikes = 30;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numSpikes; i++) {
        const y = 1 - (i / (numSpikes - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        const spikeGroup = new THREE.Group();
        const stalk = new THREE.Mesh(spikeGeo, spikeMaterial);
        const cap = new THREE.Mesh(capGeo, spikeMaterial);
        spikeGroup.add(stalk);
        spikeGroup.add(cap);

        spikeGroup.position.set(x * 2.5, y * 2.5, z * 2.5);
        spikeGroup.lookAt(0, 0, 0);
        spikeGroup.rotateX(-Math.PI / 2);
        group.add(spikeGroup);
    }

    // Animation (Bobbing)
    const posTimes = [0, 2, 4];
    const posValues = [0, 0, 0, 0, 0.5, 0, 0, 0, 0];
    const posTrack = new THREE.VectorKeyframeTrack('.position', posTimes, posValues);
    const clip = new THREE.AnimationClip('bob', 4, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
