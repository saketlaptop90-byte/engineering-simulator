export function createGeigerCounter(THREE) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.6 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2 });
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.5, 0.8, 0.2);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(0.3, 0.2);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.2, 0.101);
    group.add(screen);

    // Geiger-Muller Tube
    const tubeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.set(0.3, 0, 0);
    group.add(tube);

    return { group, animationClips: [] };
}
