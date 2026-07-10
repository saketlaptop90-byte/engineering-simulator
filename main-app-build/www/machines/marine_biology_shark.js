export function createShark(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyGeo = new THREE.CylinderGeometry(1, 0.2, 8, 16);
    bodyGeo.rotateZ(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const finGeo = new THREE.ConeGeometry(0.5, 1.5, 4);
    const fin = new THREE.Mesh(finGeo, bodyMat);
    fin.position.set(0, 1.5, 0);
    group.add(fin);

    const tailGeo = new THREE.ConeGeometry(0.2, 2, 4);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.set(-4, 0, 0);
    group.add(tail);

    return { group, animationClips };
}
