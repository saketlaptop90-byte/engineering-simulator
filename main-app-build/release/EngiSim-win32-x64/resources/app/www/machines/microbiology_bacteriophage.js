export function createBacteriophage(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Icosahedral head
    const headGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x44aa44, metalness: 0.3, roughness: 0.4 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 3;
    group.add(head);

    // Collar
    const collarGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
    const collarMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5, roughness: 0.5 });
    const collar = new THREE.Mesh(collarGeometry, collarMaterial);
    collar.position.y = 1.6;
    group.add(collar);

    // Sheath (tail)
    const sheathGeometry = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const sheathMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.4, roughness: 0.6 });
    const sheath = new THREE.Mesh(sheathGeometry, sheathMaterial);
    sheath.position.y = 0;
    group.add(sheath);

    // Base plate
    const basePlateGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 6);
    const basePlateMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.4 });
    const basePlate = new THREE.Mesh(basePlateGeometry, basePlateMaterial);
    basePlate.position.y = -1.65;
    group.add(basePlate);

    // Tail fibers
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.3, roughness: 0.7 });
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const tailGroup = new THREE.Group();
        
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.05, 2, 8);
        const leg1 = new THREE.Mesh(legGeometry, tailMaterial);
        leg1.position.set(0, -1, 0);
        leg1.rotation.x = Math.PI / 4;
        
        const leg2 = new THREE.Mesh(legGeometry, tailMaterial);
        leg2.position.set(0, -2.5, 0.7);
        leg2.rotation.x = -Math.PI / 6;

        tailGroup.add(leg1);
        tailGroup.add(leg2);
        
        tailGroup.position.set(Math.cos(angle) * 1.2, -1.65, Math.sin(angle) * 1.2);
        tailGroup.rotation.y = -angle + Math.PI / 2;
        group.add(tailGroup);
    }

    return { group, animationClips };
}
