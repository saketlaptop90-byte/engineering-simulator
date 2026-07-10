export function createNucleosomeSliding(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // DNA string
    const dnaGeo = new THREE.CylinderGeometry(0.2, 0.2, 20, 16);
    const dnaMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const dna = new THREE.Mesh(dnaGeo, dnaMat);
    dna.rotation.z = Math.PI / 2;
    group.add(dna);

    // Nucleosome
    const nucleosomeGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    const nucleosomeMat = new THREE.MeshStandardMaterial({ color: 0xaa55aa });
    const nucleosome = new THREE.Mesh(nucleosomeGeo, nucleosomeMat);
    nucleosome.name = "nucleosome";
    nucleosome.rotation.x = Math.PI / 2;
    group.add(nucleosome);

    // ATP
    const atpGeo = new THREE.OctahedronGeometry(0.8);
    const atpMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const atp = new THREE.Mesh(atpGeo, atpMat);
    atp.position.set(0, 3, 0);
    group.add(atp);

    // Animation: nucleosome sliding along DNA
    const times = [0, 1, 2];
    const values = [
        -5, 0, 0,
        5, 0, 0,
        -5, 0, 0
    ];
    const track = new THREE.VectorKeyframeTrack('nucleosome.position', times, values);
    const clip = new THREE.AnimationClip('SlidingAction', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
