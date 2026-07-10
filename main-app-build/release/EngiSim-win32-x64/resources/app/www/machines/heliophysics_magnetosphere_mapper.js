export function createMagnetosphereMapper(THREE) {
    const group = new THREE.Group();

    // Core
    const coreGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x0055ff, metalness: 0.4, roughness: 0.2 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Magnetic Rings
    const ringGroup = new THREE.Group();
    ringGroup.name = 'Rings';
    group.add(ringGroup);

    const ringGeo = new THREE.TorusGeometry(3, 0.1, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x004444, metalness: 0.8, roughness: 0.1 });

    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ringGroup.add(ring);
    }

    const times = [0, 8];
    const values = [0, Math.PI * 2];
    const trackX = new THREE.NumberKeyframeTrack('Rings.rotation[x]', times, values);
    const trackY = new THREE.NumberKeyframeTrack('Rings.rotation[y]', times, values);
    const trackZ = new THREE.NumberKeyframeTrack('Rings.rotation[z]', times, values);

    const clip = new THREE.AnimationClip('map_field', 8, [trackX, trackY, trackZ]);

    return { group, animationClips: [clip] };
}
