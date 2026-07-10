export function createCarbonNanotube(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const radius = 2;
    const height = 10;
    const segments = 12; // Hexagon wrapping

    const atomGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const atomMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 });
    
    for (let y = -height / 2; y <= height / 2; y += 0.5) {
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2 + (y % 1 === 0 ? 0 : Math.PI / segments);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const atom = new THREE.Mesh(atomGeo, atomMat);
            atom.position.set(x, y, z);
            group.add(atom);
        }
    }

    const times = [0, 5];
    const values = [0, 0, 0, 0, Math.PI * 2, 0];
    const rotationTrack = new THREE.VectorKeyframeTrack('.rotation', times, values);
    animationClips.push(new THREE.AnimationClip('rotate', 5, [rotationTrack]));

    return { group, animationClips };
}
