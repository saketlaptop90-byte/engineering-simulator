export function createBacteriophage(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Head (Icosahedron)
    const headGeometry = new THREE.IcosahedronGeometry(2, 0);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.4, metalness: 0.1 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 5;
    group.add(head);

    // Tail sheath (Cylinder)
    const tailGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.6, metalness: 0.3 });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.y = 2;
    group.add(tail);

    // Base plate
    const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 6);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0;
    group.add(base);

    // Tail fibers
    for (let i = 0; i < 6; i++) {
        const fiberGroup = new THREE.Group();
        const fiberGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
        const fiber = new THREE.Mesh(fiberGeo, tailMaterial);
        fiber.position.y = -1.5;
        fiber.position.z = 1;
        fiber.rotation.x = Math.PI / 4;
        fiberGroup.add(fiber);
        fiberGroup.rotation.y = (i * Math.PI * 2) / 6;
        fiberGroup.position.y = 0;
        group.add(fiberGroup);
    }

    // Animation (Pulsing / Injecting)
    const times = [0, 1, 2];
    const values = [5, 4.5, 5];
    const headTrack = new THREE.NumberKeyframeTrack('.children[0].position[y]', times, values);
    const clip = new THREE.AnimationClip('inject', 2, [headTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
