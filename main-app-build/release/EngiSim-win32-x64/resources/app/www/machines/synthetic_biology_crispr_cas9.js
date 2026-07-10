export function createCrisprCas9(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Materials
    const cas9Mat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.6, metalness: 0.1 });
    const rnaMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5 });
    const dnaMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.4 });

    // Cas9 Protein (Lobes)
    const cas9Geo = new THREE.DodecahedronGeometry(2, 1);
    const cas9 = new THREE.Mesh(cas9Geo, cas9Mat);
    cas9.scale.set(1.5, 1, 1);
    cas9.name = 'Cas9';
    group.add(cas9);

    // Guide RNA
    const rnaGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 100, Math.PI);
    const rna = new THREE.Mesh(rnaGeo, rnaMat);
    rna.rotation.x = Math.PI / 2;
    cas9.add(rna);

    // DNA
    const dnaGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
    const dna = new THREE.Mesh(dnaGeo, dnaMat);
    dna.rotation.z = Math.PI / 2;
    dna.position.y = -1;
    group.add(dna);

    // Animation (Cas9 moving along DNA)
    const times = [0, 2, 4];
    const positions = [
        -3, 0, 0,
        3, 0, 0,
        -3, 0, 0
    ];
    const positionTrack = new THREE.VectorKeyframeTrack('Cas9.position', times, positions);
    
    const clip = new THREE.AnimationClip('Cas9Search', 4, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
