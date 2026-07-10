export function createDNAHelix(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const numBasePairs = 20;
    const radius = 2;
    const risePerBase = 0.8;
    const rotationPerBase = Math.PI / 6;

    const backboneGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const backboneMat1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const backboneMat2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });

    const bondGeom = new THREE.CylinderGeometry(0.15, 0.15, radius * 2, 8);
    const bondMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    for (let i = 0; i < numBasePairs; i++) {
        const y = (i - numBasePairs / 2) * risePerBase;
        const angle = i * rotationPerBase;

        // Backbone spheres
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        
        const b1 = new THREE.Mesh(backboneGeom, backboneMat1);
        b1.position.set(x1, y, z1);
        group.add(b1);

        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;
        
        const b2 = new THREE.Mesh(backboneGeom, backboneMat2);
        b2.position.set(x2, y, z2);
        group.add(b2);

        // Base pair bond
        const bond = new THREE.Mesh(bondGeom, bondMat);
        bond.position.set(0, y, 0);
        bond.rotation.y = -angle;
        bond.rotation.z = Math.PI / 2;
        group.add(bond);
    }

    return { group, animationClips };
}
