export function createMitosis(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const cellMat = new THREE.MeshStandardMaterial({ color: 0xe91e63, transparent: true, opacity: 0.5 });
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0x673ab7 });

    const cell1 = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), cellMat);
    cell1.name = "Cell1";
    group.add(cell1);

    const cell2 = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), cellMat);
    cell2.name = "Cell2";
    group.add(cell2);

    const nuc1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), nucleusMat);
    nuc1.name = "Nuc1";
    group.add(nuc1);

    const nuc2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), nucleusMat);
    nuc2.name = "Nuc2";
    group.add(nuc2);

    // Animation: Splitting
    const c1Pos = new THREE.VectorKeyframeTrack('Cell1.position', [0, 2], [0, 0, 0, -2.5, 0, 0]);
    const c2Pos = new THREE.VectorKeyframeTrack('Cell2.position', [0, 2], [0, 0, 0, 2.5, 0, 0]);
    const n1Pos = new THREE.VectorKeyframeTrack('Nuc1.position', [0, 2], [0, 0, 0, -2.5, 0, 0]);
    const n2Pos = new THREE.VectorKeyframeTrack('Nuc2.position', [0, 2], [0, 0, 0, 2.5, 0, 0]);

    const clip = new THREE.AnimationClip('divide', 2, [c1Pos, c2Pos, n1Pos, n2Pos]);
    animationClips.push(clip);

    return { group, animationClips };
}
