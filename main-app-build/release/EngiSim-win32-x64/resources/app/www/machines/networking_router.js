export function createRouterModel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeometry = new THREE.BoxGeometry(4, 1, 3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.2 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Antennas
    const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    for(let i=0; i<4; i++) {
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(-1.5 + i*1.0, 1.5, -1.2);
        group.add(antenna);
    }

    // Lights
    const lightGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const lightMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
    for(let i=0; i<6; i++) {
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(-1.5 + i*0.6, 0, 1.5);
        group.add(light);
    }

    return { group, animationClips };
}
