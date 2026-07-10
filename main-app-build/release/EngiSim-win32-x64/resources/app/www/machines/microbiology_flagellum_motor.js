export function createFlagellumMotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Motor Base
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x5577ff, metalness: 0.2, roughness: 0.8 });
    
    // C ring
    const cRingGeom = new THREE.TorusGeometry(2, 0.3, 16, 32);
    const cRing = new THREE.Mesh(cRingGeom, baseMaterial);
    cRing.rotation.x = Math.PI / 2;
    cRing.position.y = -2;
    group.add(cRing);

    // MS ring
    const msRingGeom = new THREE.TorusGeometry(1.5, 0.3, 16, 32);
    const msRingMaterial = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
    const msRing = new THREE.Mesh(msRingGeom, msRingMaterial);
    msRing.rotation.x = Math.PI / 2;
    msRing.position.y = -1;
    group.add(msRing);

    // Rod
    const rodGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const rodMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const rod = new THREE.Mesh(rodGeom, rodMaterial);
    rod.position.y = 0;
    group.add(rod);

    // Hook
    const hookGeom = new THREE.TorusGeometry(1, 0.4, 16, 32, Math.PI / 2);
    const hookMaterial = new THREE.MeshStandardMaterial({ color: 0xdd6644 });
    const hook = new THREE.Mesh(hookGeom, hookMaterial);
    hook.position.set(1, 2, 0);
    group.add(hook);

    // Filament
    const filamentGeom = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
    const filamentMaterial = new THREE.MeshStandardMaterial({ color: 0xffee88 });
    const filament = new THREE.Mesh(filamentGeom, filamentMaterial);
    filament.position.set(2, 7, 0);
    group.add(filament);

    return { group, animationClips };
}
