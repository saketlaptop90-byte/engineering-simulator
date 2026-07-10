export function createRNAInterference(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // mRNA
    const mRNAgeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const mRNAMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const mRNA = new THREE.Mesh(mRNAgeo, mRNAMat);
    mRNA.rotation.z = Math.PI / 2;
    group.add(mRNA);

    // RISC complex
    const riscGeo = new THREE.DodecahedronGeometry(2);
    const riscMat = new THREE.MeshStandardMaterial({ color: 0xff0055 });
    const risc = new THREE.Mesh(riscGeo, riscMat);
    risc.name = "risc";
    risc.position.set(0, 3, 0);
    group.add(risc);

    // siRNA
    const siRNAGeo = new THREE.BoxGeometry(4, 0.2, 0.2);
    const siRNAMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const siRNA = new THREE.Mesh(siRNAGeo, siRNAMat);
    siRNA.position.set(0, -1.5, 0);
    risc.add(siRNA);

    // Animation: RISC moving and binding to mRNA
    const times = [0, 1, 2];
    const values = [
        0, 3, 0,
        0, 0, 0,
        0, 3, 0
    ];
    const track = new THREE.VectorKeyframeTrack('risc.position', times, values);
    const clip = new THREE.AnimationClip('RNAiAction', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
