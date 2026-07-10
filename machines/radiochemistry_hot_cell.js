export function createHotCell(THREE) {
    const group = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 }); // Lead shielding
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xaaaa55, transparent: true, opacity: 0.5, metalness: 0.1 }); // Leaded glass

    // Main chamber
    const cellGeo = new THREE.BoxGeometry(3, 3, 2);
    const cell = new THREE.Mesh(cellGeo, wallMat);
    group.add(cell);

    // Shielded window
    const windowGeo = new THREE.PlaneGeometry(1, 1);
    const windowMesh = new THREE.Mesh(windowGeo, glassMat);
    windowMesh.position.set(0, 0.2, 1.001);
    group.add(windowMesh);

    // Manipulator arm representation
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 });
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.rotation.x = Math.PI / 2;
    arm.position.set(0.5, 0, 1.2);
    group.add(arm);

    return { group, animationClips: [] };
}
