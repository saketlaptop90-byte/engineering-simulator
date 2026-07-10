export function createJellyfish(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Bell (dome)
    const bellGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const bellMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.1
    });
    const bell = new THREE.Mesh(bellGeometry, bellMaterial);
    group.add(bell);

    // Tentacles
    for(let i = 0; i < 8; i++) {
        const tentacleGeo = new THREE.CylinderGeometry(0.1, 0.05, 5);
        const tentacleMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
        const tentacle = new THREE.Mesh(tentacleGeo, tentacleMat);
        tentacle.position.set(Math.cos(i * Math.PI / 4) * 1.5, -2.5, Math.sin(i * Math.PI / 4) * 1.5);
        group.add(tentacle);
    }

    return { group, animationClips };
}
