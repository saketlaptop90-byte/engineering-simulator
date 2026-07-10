export function createCarbonNanotube(THREE) {
    const group = new THREE.Group();
    group.name = 'CarbonNanotube';

    const carbonMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.3
    });

    const radius = 2;
    const height = 10;
    const radialSegments = 12;
    const heightSegments = 10;

    for (let y = 0; y < heightSegments; y++) {
        for (let r = 0; r < radialSegments; r++) {
            const angle = (r / radialSegments) * Math.PI * 2;
            const yPos = (y - heightSegments / 2) * 1.5;
            const xPos = Math.cos(angle) * radius;
            const zPos = Math.sin(angle) * radius;

            const atomGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const atom = new THREE.Mesh(atomGeometry, carbonMaterial);
            atom.position.set(xPos, yPos + (r % 2 === 0 ? 0.5 : 0), zPos);
            group.add(atom);
        }
    }

    return { group, animationClips: [] };
}
