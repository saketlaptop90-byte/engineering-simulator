export function createSubmersible(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const hullGeo = new THREE.CapsuleGeometry(2, 4, 16, 16);
    hullGeo.rotateZ(Math.PI / 2);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.6, roughness: 0.4 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    group.add(hull);

    const windowGeo = new THREE.SphereGeometry(1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    windowGeo.rotateZ(-Math.PI / 2);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x222222, transparent: true, opacity: 0.7, metalness: 0.9, roughness: 0.1 });
    const window = new THREE.Mesh(windowGeo, windowMat);
    window.position.set(2, 0, 0);
    group.add(window);

    const propellerGeo = new THREE.TorusGeometry(0.5, 0.1, 8, 24);
    const propellerMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const propeller = new THREE.Mesh(propellerGeo, propellerMat);
    propeller.position.set(-4, 0, 0);
    propeller.rotateY(Math.PI / 2);
    group.add(propeller);

    return { group, animationClips };
}
