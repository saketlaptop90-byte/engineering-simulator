export function createOpsinProtein(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const proteinMaterial = new THREE.MeshStandardMaterial({
        color: 0xff5555,
        roughness: 0.8,
        metalness: 0.2
    });
    const poreMaterial = new THREE.MeshStandardMaterial({
        color: 0x55ffff,
        transparent: true,
        opacity: 0.6
    });

    // 7-transmembrane helices
    for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const radius = 1.5;
        const helixGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 8);
        const helixMesh = new THREE.Mesh(helixGeo, proteinMaterial);
        helixMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        // Tilt slightly
        helixMesh.rotation.x = 0.2 * Math.cos(angle);
        helixMesh.rotation.z = 0.2 * Math.sin(angle);
        group.add(helixMesh);
    }

    // Central ion channel pore
    const poreGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.5, 16);
    const poreMesh = new THREE.Mesh(poreGeo, poreMaterial);
    group.add(poreMesh);

    // Opening and closing animation
    const scaleTrack = new THREE.VectorKeyframeTrack('.scale', [0, 1, 2], [1, 1, 1, 1.2, 1, 1.2, 1, 1, 1]);
    const clip = new THREE.AnimationClip('openClose', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
