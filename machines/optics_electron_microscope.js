export function createElectronMicroscope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.3 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.5 });
    
    const baseGeo = new THREE.BoxGeometry(4, 3, 3);
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.set(0, 1.5, 0);
    group.add(base);

    const columnGeo = new THREE.CylinderGeometry(0.8, 1.2, 6, 32);
    const column = new THREE.Mesh(columnGeo, metalMat);
    column.position.set(0, 6, 0);
    group.add(column);

    const gunGeo = new THREE.CylinderGeometry(0.5, 0.8, 1.5, 32);
    const gun = new THREE.Mesh(gunGeo, darkMetalMat);
    gun.position.set(0, 9.75, 0);
    group.add(gun);

    for (let i = 0; i < 3; i++) {
        const lensGeo = new THREE.TorusGeometry(1.0, 0.3, 16, 32);
        const lens = new THREE.Mesh(lensGeo, darkMetalMat);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0, 4.5 + i * 1.5, 0);
        group.add(lens);
    }

    const chamberGeo = new THREE.BoxGeometry(2.5, 2, 2.5);
    const chamber = new THREE.Mesh(chamberGeo, metalMat);
    chamber.position.set(0, 3.5, 0);
    group.add(chamber);

    const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const arm = new THREE.Mesh(armGeo, darkMetalMat);
    arm.rotation.z = Math.PI / 4;
    arm.position.set(1.5, 3.5, 0);
    group.add(arm);

    return { group, animationClips };
}
