export function createCpuPipeline(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    
    stages.forEach((stage, index) => {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ color: colors[index], transparent: true, opacity: 0.8 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((index - 2) * 3, 0, 0);
        group.add(mesh);
    });

    // Add some animation (e.g. instruction moving through pipeline)
    const instGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const instMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const instMesh = new THREE.Mesh(instGeo, instMat);
    instMesh.position.set(-6, 0, 0);
    group.add(instMesh);

    const trackName = `${instMesh.uuid}.position`;
    const times = [0, 1, 2, 3, 4, 5];
    const values = [
        -6, 0, 0,
        -3, 0, 0,
         0, 0, 0,
         3, 0, 0,
         6, 0, 0,
         9, 0, 0
    ];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('InstructionMove', 5, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
