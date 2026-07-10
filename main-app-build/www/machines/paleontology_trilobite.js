export function createTrilobite(THREE) {
    const group = new THREE.Group();
    
    const carapaceMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.6, metalness: 0.2 });

    // Cephalon (Head)
    const headGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const head = new THREE.Mesh(headGeo, carapaceMat);
    head.scale.set(1, 0.5, 0.8);
    head.position.set(0, 0, 2);
    group.add(head);

    // Thorax segments
    for (let i = 0; i < 8; i++) {
        const segGeo = new THREE.CylinderGeometry(1.4 - i * 0.1, 1.4 - i * 0.1, 0.4, 32, 1, false, 0, Math.PI);
        const segment = new THREE.Mesh(segGeo, carapaceMat);
        segment.rotation.z = Math.PI / 2;
        segment.scale.set(1, 1, 0.4);
        segment.position.set(0, 0, 1 - i * 0.4);
        group.add(segment);
    }

    // Pygidium (Tail)
    const tailGeo = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, carapaceMat);
    tail.scale.set(1, 0.3, 1);
    tail.position.set(0, 0, -2);
    group.add(tail);

    const animationClips = [];
    return { group, animationClips };
}
