export function createDNAOrigami(THREE) {
    const group = new THREE.Group();
    group.name = 'DNAOrigami';

    const mat1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mat2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });

    for (let i = 0; i < 20; i++) {
        const angle = i * 0.5;
        const y = (i - 10) * 0.5;
        
        const x1 = Math.cos(angle) * 2;
        const z1 = Math.sin(angle) * 2;
        const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.3), mat1);
        sphere1.position.set(x1, y, z1);
        group.add(sphere1);

        const x2 = Math.cos(angle + Math.PI) * 2;
        const z2 = Math.sin(angle + Math.PI) * 2;
        const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.3), mat2);
        sphere2.position.set(x2, y, z2);
        group.add(sphere2);

        const linkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4);
        const link = new THREE.Mesh(linkGeometry, new THREE.MeshStandardMaterial({color: 0xffffff}));
        link.position.set(0, y, 0);
        link.rotation.z = Math.PI / 2;
        link.rotation.y = -angle;
        group.add(link);
    }

    return { group, animationClips: [] };
}
