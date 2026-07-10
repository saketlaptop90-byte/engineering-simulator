export function createCPUScheduler(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.7, roughness: 0.3 });
    const processMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x004422 });
    const queueMaterial = new THREE.MeshStandardMaterial({ color: 0x0044ff, wireframe: true });

    const cpuCore = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 1), baseMaterial);
    group.add(cpuCore);

    const readyQueue = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 2), queueMaterial);
    readyQueue.position.set(-7, 0, 0);
    group.add(readyQueue);

    const process = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), processMaterial);
    process.name = "process1";
    group.add(process);

    const times = [0, 2, 4, 6];
    const positions = [-7, 0, 0,  -7, 0, 0,  0, 0, 0,  7, 0, 0];
    const positionTrack = new THREE.VectorKeyframeTrack('process1.position', times, positions);
    const clip = new THREE.AnimationClip('CPU_Execution', 6, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
