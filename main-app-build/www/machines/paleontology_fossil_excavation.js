export function createFossilExcavation(THREE) {
    const group = new THREE.Group();
    
    // Dirt base
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 1.0 });
    const dirtBase = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 10), dirtMat);
    dirtBase.position.y = -1;
    group.add(dirtBase);

    // Embedded fossil (partial rib cage)
    const boneMat = new THREE.MeshStandardMaterial({ color: 0xccbba3, roughness: 0.8 });
    for (let i = 0; i < 6; i++) {
        const ribGeo = new THREE.TorusGeometry(1.2, 0.15, 8, 16, Math.PI);
        const rib = new THREE.Mesh(ribGeo, boneMat);
        rib.rotation.y = Math.PI / 2 + (Math.random() * 0.2 - 0.1);
        rib.rotation.x = (Math.random() * 0.2 - 0.1);
        rib.position.set(0, 0, -2 + i * 0.8);
        group.add(rib);
    }

    // Tools
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    
    // Brush
    const handleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
    const brushHandle = new THREE.Mesh(handleGeo, woodMat);
    brushHandle.position.set(3, 0.1, 2);
    brushHandle.rotation.z = Math.PI / 2;
    group.add(brushHandle);

    const bristleGeo = new THREE.BoxGeometry(0.3, 0.1, 0.2);
    const bristleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const bristles = new THREE.Mesh(bristleGeo, bristleMat);
    bristles.position.set(3.4, 0.1, 2);
    group.add(bristles);

    const animationClips = [];
    return { group, animationClips };
}
