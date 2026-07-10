export function createFiberOpticCannula(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const ceramicMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        metalness: 0.1
    });
    const lightMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2
    });

    // Cannula base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 1);
    const baseMesh = new THREE.Mesh(baseGeo, ceramicMaterial);
    baseMesh.position.y = 1.5;
    group.add(baseMesh);

    // Fiber core
    const fiberGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
    const fiberMesh = new THREE.Mesh(fiberGeo, glassMaterial);
    group.add(fiberMesh);

    // Light beam
    const lightGeo = new THREE.CylinderGeometry(0.1, 0.3, 2);
    const lightMesh = new THREE.Mesh(lightGeo, lightMaterial);
    lightMesh.position.y = -2.5;
    group.add(lightMesh);

    return { group, animationClips };
}
