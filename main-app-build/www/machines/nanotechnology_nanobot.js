export function createNanobot(THREE) {
    const group = new THREE.Group();
    group.name = 'Nanobot';

    const material = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.8,
        roughness: 0.2
    });

    const bodyGeometry = new THREE.CapsuleGeometry(1, 2, 8, 16);
    const body = new THREE.Mesh(bodyGeometry, material);
    group.add(body);

    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.9,
        roughness: 0.1
    });
    
    for (let i = 0; i < 6; i++) {
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3);
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.y = -1;
        leg.position.x = Math.cos((i / 6) * Math.PI * 2) * 1.5;
        leg.position.z = Math.sin((i / 6) * Math.PI * 2) * 1.5;
        leg.lookAt(new THREE.Vector3(0, -2, 0));
        group.add(leg);
    }

    return { group, animationClips: [] };
}
