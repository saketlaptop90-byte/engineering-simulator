export function createScintillationVial(THREE) {
    const group = new THREE.Group();
    const vialMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.3, roughness: 0.1 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const liquidMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.7 });

    // Vial body
    const vialGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
    const vial = new THREE.Mesh(vialGeo, vialMat);
    group.add(vial);

    // Liquid inside
    const liquidGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.2, 16);
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.set(0, -0.09, 0);
    group.add(liquid);

    // Cap
    const capGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 0.22, 0);
    group.add(cap);

    return { group, animationClips: [] };
}
