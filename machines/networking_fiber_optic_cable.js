export function createFiberOpticCable(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(-1, 1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(2, 0, 0)
    ]);
    
    const tubeGeometry = new THREE.TubeGeometry(path, 20, 0.2, 8, false);
    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    group.add(tube);

    const coreGeometry = new THREE.TubeGeometry(path, 20, 0.05, 8, false);
    const coreMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x00ffff });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    return { group, animationClips };
}
