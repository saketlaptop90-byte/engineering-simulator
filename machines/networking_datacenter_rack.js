export function createDataCenterRack(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const frameGeometry = new THREE.BoxGeometry(5, 12, 4);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, wireframe: true });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    group.add(frame);

    const serverGeometry = new THREE.BoxGeometry(4.8, 0.8, 3.8);
    const serverMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const ledMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff });
    const ledGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.1);

    for(let i=0; i<10; i++) {
        const server = new THREE.Mesh(serverGeometry, serverMaterial);
        server.position.set(0, -5 + i*1.1, 0);
        
        const led1 = new THREE.Mesh(ledGeometry, ledMaterial);
        led1.position.set(-2, 0, 1.95);
        server.add(led1);

        group.add(server);
    }

    return { group, animationClips };
}
