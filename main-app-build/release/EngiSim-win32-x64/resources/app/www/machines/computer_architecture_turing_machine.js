export function createTuringMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tape
    const tapeGroup = new THREE.Group();
    for (let i = -5; i <= 5; i++) {
        const cellGeo = new THREE.BoxGeometry(1.9, 0.1, 2);
        const cellMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        const cellMesh = new THREE.Mesh(cellGeo, cellMat);
        cellMesh.position.set(i * 2, 0, 0);
        tapeGroup.add(cellMesh);
    }
    group.add(tapeGroup);

    // Read/Write Head
    const headGeo = new THREE.BoxGeometry(1, 1, 1);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xff5555 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.set(0, 1, 0);
    group.add(headMesh);

    // Control Unit
    const controlGeo = new THREE.BoxGeometry(2, 2, 2);
    const controlMat = new THREE.MeshStandardMaterial({ color: 0x5555ff });
    const controlMesh = new THREE.Mesh(controlGeo, controlMat);
    controlMesh.position.set(0, 3, 0);
    group.add(controlMesh);

    // Connection
    const connGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const connMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const connMesh = new THREE.Mesh(connGeo, connMat);
    connMesh.position.set(0, 2, 0);
    group.add(connMesh);

    // Animation of tape moving
    const trackName = `${tapeGroup.uuid}.position`;
    const times = [0, 1, 2, 3, 4];
    const values = [
        0, 0, 0,
        -2, 0, 0,
        -2, 0, 0,
        2, 0, 0,
        0, 0, 0
    ];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('TapeMove', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
