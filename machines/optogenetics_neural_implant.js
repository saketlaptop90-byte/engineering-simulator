export function createNeuralImplant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Materials
    const titaniumMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
    });
    const glowingBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
    });

    // Base body
    const bodyGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const bodyMesh = new THREE.Mesh(bodyGeo, titaniumMaterial);
    group.add(bodyMesh);

    // Electrodes
    for (let i = 0; i < 4; i++) {
        const electrodeGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
        const electrodeMesh = new THREE.Mesh(electrodeGeo, titaniumMaterial);
        electrodeMesh.position.set((i % 2 === 0 ? 1 : -1) * 0.5, -1, (i > 1 ? 1 : -1) * 0.5);
        group.add(electrodeMesh);

        // Light emitting tip
        const tipGeo = new THREE.SphereGeometry(0.1);
        const tipMesh = new THREE.Mesh(tipGeo, glowingBlueMaterial);
        tipMesh.position.copy(electrodeMesh.position);
        tipMesh.position.y -= 0.75;
        group.add(tipMesh);
    }
    
    const rotateTrack = new THREE.VectorKeyframeTrack('.rotation[y]', [0, 2], [0, Math.PI * 2]);
    const clip = new THREE.AnimationClip('rotate', 2, [rotateTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
