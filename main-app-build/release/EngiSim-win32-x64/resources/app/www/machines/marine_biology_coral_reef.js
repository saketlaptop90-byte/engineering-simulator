export function createCoralReef(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.BoxGeometry(10, 1, 10);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    for(let i = 0; i < 15; i++) {
        const height = Math.random() * 3 + 1;
        const coralGeo = new THREE.CylinderGeometry(0.2, 0.3, height);
        const coralMat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff, roughness: 0.8 });
        const coral = new THREE.Mesh(coralGeo, coralMat);
        coral.position.set(Math.random() * 8 - 4, height / 2, Math.random() * 8 - 4);
        
        // Add branches
        const branchGeo = new THREE.CylinderGeometry(0.1, 0.15, height / 2);
        const branch = new THREE.Mesh(branchGeo, coralMat);
        branch.position.set(0.3, height / 4, 0);
        branch.rotation.z = Math.PI / 4;
        coral.add(branch);

        group.add(coral);
    }

    return { group, animationClips };
}
