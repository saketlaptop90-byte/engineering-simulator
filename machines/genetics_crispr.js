export function createCrisprCas9(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const cas9Mat = new THREE.MeshStandardMaterial({ color: 0x00bcd4, transparent: true, opacity: 0.8 });
    const sgRNAMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const targetDnaMat = new THREE.MeshStandardMaterial({ color: 0xf44336 });

    const cas9 = new THREE.Mesh(new THREE.DodecahedronGeometry(2), cas9Mat);
    cas9.name = "Cas9";
    group.add(cas9);

    const sgRNA = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 8, 24), sgRNAMat);
    sgRNA.position.set(0, 0, 1);
    cas9.add(sgRNA);

    const targetDna = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6), targetDnaMat);
    targetDna.rotation.z = Math.PI / 2;
    targetDna.position.set(0, 0, -1);
    targetDna.name = "TargetDNA";
    group.add(targetDna);

    // Animation: Cas9 binding and cutting
    const cas9Pos = new THREE.VectorKeyframeTrack('Cas9.position', [0, 2, 4], [
        0, 3, 0,
        0, 0, -1,
        0, 0, -1
    ]);
    const dnaScale = new THREE.VectorKeyframeTrack('TargetDNA.scale', [0, 2, 3, 4], [
        1, 1, 1,
        1, 1, 1,
        0.01, 1, 1, // cut
        0.01, 1, 1
    ]);

    const clip = new THREE.AnimationClip('cut', 4, [cas9Pos, dnaScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
