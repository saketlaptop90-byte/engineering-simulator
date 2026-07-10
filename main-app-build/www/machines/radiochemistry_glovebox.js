export function createGlovebox(THREE) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, roughness: 0.1 });
    
    // Main box
    const boxGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const box = new THREE.Mesh(boxGeometry, material);
    group.add(box);
    
    // Window
    const windowGeometry = new THREE.PlaneGeometry(1.8, 1.2);
    const windowMesh = new THREE.Mesh(windowGeometry, glassMaterial);
    windowMesh.position.set(0, 0, 0.501);
    group.add(windowMesh);
    
    // Gloves (cylinders)
    const gloveGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    
    const glove1 = new THREE.Mesh(gloveGeo, gloveMat);
    glove1.rotation.x = Math.PI / 2;
    glove1.position.set(-0.4, -0.2, 0.5);
    group.add(glove1);
    
    const glove2 = new THREE.Mesh(gloveGeo, gloveMat);
    glove2.rotation.x = Math.PI / 2;
    glove2.position.set(0.4, -0.2, 0.5);
    group.add(glove2);

    return { group, animationClips: [] };
}
