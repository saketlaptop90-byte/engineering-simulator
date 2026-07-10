export function createVirus(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Viral Envelope
    const envelopeGeometry = new THREE.SphereGeometry(3, 32, 32);
    const envelopeMaterial = new THREE.MeshStandardMaterial({ color: 0x882233, roughness: 0.6 });
    const envelope = new THREE.Mesh(envelopeGeometry, envelopeMaterial);
    group.add(envelope);

    // Glycoprotein Spikes
    const spikeMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const spikeGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 8);
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);

    const spikeCount = 60;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < spikeCount; i++) {
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / spikeCount);

        const x = Math.cos(theta) * Math.sin(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(phi);

        const spikeGroup = new THREE.Group();
        
        const stem = new THREE.Mesh(spikeGeometry, spikeMaterial);
        stem.position.y = 0.75;
        spikeGroup.add(stem);

        const head = new THREE.Mesh(headGeometry, spikeMaterial);
        head.position.y = 1.5;
        spikeGroup.add(head);

        spikeGroup.position.set(x * 3, y * 3, z * 3);
        spikeGroup.lookAt(x * 4, y * 4, z * 4);
        spikeGroup.rotateX(Math.PI / 2);

        group.add(spikeGroup);
    }

    return { group, animationClips };
}
