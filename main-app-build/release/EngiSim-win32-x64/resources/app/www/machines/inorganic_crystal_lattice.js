export function createCrystalLattice(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Colors
    const colorNa = 0x8800ff; // Purple for Sodium
    const colorCl = 0x00ff00; // Green for Chlorine

    const sizeNa = 0.3;
    const sizeCl = 0.45;
    const spacing = 1.5;
    const gridPoints = 3;

    const geoNa = new THREE.SphereGeometry(sizeNa, 32, 32);
    const geoCl = new THREE.SphereGeometry(sizeCl, 32, 32);
    const matNa = new THREE.MeshStandardMaterial({ color: colorNa, roughness: 0.3, metalness: 0.1 });
    const matCl = new THREE.MeshStandardMaterial({ color: colorCl, roughness: 0.3, metalness: 0.1 });

    const atoms = [];

    for (let x = 0; x < gridPoints; x++) {
        for (let y = 0; y < gridPoints; y++) {
            for (let z = 0; z < gridPoints; z++) {
                const isNa = (x + y + z) % 2 === 0;
                const mesh = new THREE.Mesh(isNa ? geoNa : geoCl, isNa ? matNa : matCl);
                mesh.position.set(
                    (x - gridPoints / 2 + 0.5) * spacing,
                    (y - gridPoints / 2 + 0.5) * spacing,
                    (z - gridPoints / 2 + 0.5) * spacing
                );
                group.add(mesh);
                atoms.push({ mesh, basePos: mesh.position.clone() });
            }
        }
    }

    // Animation for vibration
    const times = [0, 0.5, 1];
    const tracks = [];
    
    atoms.forEach((atom, idx) => {
        const p = atom.basePos;
        const values = [
            p.x, p.y, p.z,
            p.x + (Math.random() - 0.5) * 0.2, p.y + (Math.random() - 0.5) * 0.2, p.z + (Math.random() - 0.5) * 0.2,
            p.x, p.y, p.z
        ];
        const trackName = `.children[${idx}].position`;
        tracks.push(new THREE.VectorKeyframeTrack(trackName, times, values));
    });

    if (tracks.length > 0) {
        const clip = new THREE.AnimationClip('vibrate', 1, tracks);
        animationClips.push(clip);
    }

    return { group, animationClips };
}
