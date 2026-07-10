export function createTRexSkeleton(THREE) {
    const group = new THREE.Group();
    const boneMaterial = new THREE.MeshStandardMaterial({ color: 0xe3dac9, roughness: 0.9, metalness: 0.1 });

    // Skull
    const skullGeo = new THREE.BoxGeometry(2, 1.5, 3);
    const skull = new THREE.Mesh(skullGeo, boneMaterial);
    skull.position.set(0, 5, 4);
    group.add(skull);

    // Spine
    for (let i = 0; i < 10; i++) {
        const vertGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 8);
        const vert = new THREE.Mesh(vertGeo, boneMaterial);
        vert.rotation.x = Math.PI / 2;
        vert.position.set(0, 4, 2 - i * 0.9);
        group.add(vert);
    }

    // Ribs
    for (let i = 0; i < 5; i++) {
        const ribGeo = new THREE.TorusGeometry(1.5, 0.2, 8, 16, Math.PI);
        const rib = new THREE.Mesh(ribGeo, boneMaterial);
        rib.rotation.y = Math.PI / 2;
        rib.position.set(0, 4, 1 - i * 0.9);
        group.add(rib);
    }

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.4, 0.3, 4);
    const legL = new THREE.Mesh(legGeo, boneMaterial);
    legL.position.set(1.5, 2, -2);
    const legR = new THREE.Mesh(legGeo, boneMaterial);
    legR.position.set(-1.5, 2, -2);
    group.add(legL, legR);

    // Tail
    for (let i = 0; i < 15; i++) {
        const tailGeo = new THREE.CylinderGeometry(0.4 - i * 0.02, 0.4 - i * 0.02, 0.8, 8);
        const tailVert = new THREE.Mesh(tailGeo, boneMaterial);
        tailVert.rotation.x = Math.PI / 2;
        tailVert.position.set(0, 4 - i * 0.1, -6 - i * 0.8);
        group.add(tailVert);
    }

    const animationClips = [];
    return { group, animationClips };
}
