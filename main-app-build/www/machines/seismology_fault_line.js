export function createFaultLine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Block 1
    const block1Geo = new THREE.BoxGeometry(4, 2, 4);
    const blockMat1 = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const block1 = new THREE.Mesh(block1Geo, blockMat1);
    block1.position.set(-2.1, 1, 0);
    block1.name = "Block1";
    group.add(block1);

    // Block 2
    const block2Geo = new THREE.BoxGeometry(4, 2, 4);
    const blockMat2 = new THREE.MeshStandardMaterial({ color: 0x6b3e1b });
    const block2 = new THREE.Mesh(block2Geo, blockMat2);
    block2.position.set(2.1, 1, 0);
    block2.name = "Block2";
    group.add(block2);

    // Fault line visually just a gap or a red line
    const faultLineGeo = new THREE.BoxGeometry(0.2, 2, 4);
    const faultMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const fault = new THREE.Mesh(faultLineGeo, faultMat);
    fault.position.set(0, 1, 0);
    fault.name = "Fault";
    group.add(fault);

    // Animation (strike-slip fault)
    const times = [0, 2, 4];
    const b1Pos = [-2.1, 1, 0, -2.1, 1, 1, -2.1, 1, 0];
    const b2Pos = [2.1, 1, 0, 2.1, 1, -1, 2.1, 1, 0];

    const tr1 = new THREE.VectorKeyframeTrack('Block1.position', times, b1Pos);
    const tr2 = new THREE.VectorKeyframeTrack('Block2.position', times, b2Pos);

    const clip = new THREE.AnimationClip('FaultSlip', 4, [tr1, tr2]);
    animationClips.push(clip);

    return { group, animationClips };
}
