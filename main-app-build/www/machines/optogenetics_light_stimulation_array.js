export function createLightStimulationArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const boardMaterial = new THREE.MeshStandardMaterial({
        color: 0x228822,
        roughness: 0.9,
        metalness: 0.1
    });
    
    const ledMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x0000ff,
        emissiveIntensity: 0.5
    });

    // PCB Board
    const boardGeo = new THREE.BoxGeometry(4, 0.2, 4);
    const boardMesh = new THREE.Mesh(boardGeo, boardMaterial);
    group.add(boardMesh);

    // LEDs array
    for (let x = -1.5; x <= 1.5; x += 1) {
        for (let z = -1.5; z <= 1.5; z += 1) {
            const ledGeo = new THREE.BoxGeometry(0.4, 0.2, 0.4);
            const ledMesh = new THREE.Mesh(ledGeo, ledMaterial.clone());
            ledMesh.position.set(x, 0.2, z);
            group.add(ledMesh);
        }
    }

    return { group, animationClips };
}
