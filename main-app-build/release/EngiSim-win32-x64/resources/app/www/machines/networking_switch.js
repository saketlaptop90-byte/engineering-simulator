export function createSwitchModel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyGeometry = new THREE.BoxGeometry(8, 1.5, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, metalness: 0.5 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    const portGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.2);
    const portMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    for(let row=0; row<2; row++) {
        for(let col=0; col<12; col++) {
            const port = new THREE.Mesh(portGeometry, portMaterial);
            port.position.set(-3.5 + col*0.6, 0.3 - row*0.6, 2.0);
            group.add(port);
        }
    }

    return { group, animationClips };
}
