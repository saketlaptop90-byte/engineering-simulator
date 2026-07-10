export function createCentrifuge(THREE) {
    const group = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4 });
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.3 });

    // Base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Lid
    const lidGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.set(0, 0.25, 0);
    group.add(lid);
    
    // Front panel
    const panelGeo = new THREE.PlaneGeometry(0.3, 0.15);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 0, 0.501);
    group.add(panel);

    return { group, animationClips: [] };
}
