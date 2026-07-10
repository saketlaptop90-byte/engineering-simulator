export function createVonNeumann(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // CPU
    const cpuGeo = new THREE.BoxGeometry(3, 3, 3);
    const cpuMat = new THREE.MeshStandardMaterial({ color: 0x8888aa });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    cpuMesh.position.set(-4, 0, 0);
    group.add(cpuMesh);

    // Memory
    const memGeo = new THREE.BoxGeometry(3, 4, 3);
    const memMat = new THREE.MeshStandardMaterial({ color: 0xaa8888 });
    const memMesh = new THREE.Mesh(memGeo, memMat);
    memMesh.position.set(4, 0, 0);
    group.add(memMesh);

    // I/O
    const ioGeo = new THREE.BoxGeometry(2, 2, 2);
    const ioMat = new THREE.MeshStandardMaterial({ color: 0x88aa88 });
    const ioMesh = new THREE.Mesh(ioGeo, ioMat);
    ioMesh.position.set(0, -4, 0);
    group.add(ioMesh);

    // Bus
    const busGeo = new THREE.BoxGeometry(10, 0.2, 0.2);
    const busMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const busMesh = new THREE.Mesh(busGeo, busMat);
    busMesh.position.set(0, 0, 0);
    group.add(busMesh);
    
    // Animation of signal on bus
    const signalGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const signalMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const signalMesh = new THREE.Mesh(signalGeo, signalMat);
    group.add(signalMesh);

    const trackName = `${signalMesh.uuid}.position`;
    const times = [0, 1, 2, 3];
    const values = [
        -3, 0, 0,
        3, 0, 0,
        0, 0, 0,
        0, -3, 0
    ];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('BusTransfer', 3, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
