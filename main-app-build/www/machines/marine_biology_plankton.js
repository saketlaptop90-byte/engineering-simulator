export function createPlankton(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, transparent: true, opacity: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    for(let i = 0; i < 8; i++) {
        const legGeo = new THREE.CylinderGeometry(0.05, 0.01, 1.5);
        const leg = new THREE.Mesh(legGeo, bodyMat);
        leg.position.set(Math.cos(i * Math.PI / 4) * 0.6, 0, Math.sin(i * Math.PI / 4) * 0.6);
        leg.rotation.x = Math.PI / 2;
        group.add(leg);
    }

    return { group, animationClips };
}
