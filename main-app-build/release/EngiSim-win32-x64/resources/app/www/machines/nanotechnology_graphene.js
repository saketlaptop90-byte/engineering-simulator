export function createGraphene(THREE) {
    const group = new THREE.Group();
    group.name = 'Graphene';

    const atomMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.5
    });

    const rows = 5;
    const cols = 5;
    const spacing = 1.5;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * spacing + (r % 2 === 0 ? 0 : spacing / 2);
            const z = r * spacing * 0.866;

            const atom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), atomMaterial);
            atom.position.set(x, 0, z);
            group.add(atom);
        }
    }

    return { group, animationClips: [] };
}
