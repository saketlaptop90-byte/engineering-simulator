export function createHistoneModification(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Histone core
    const coreGeometry = new THREE.CylinderGeometry(3, 3, 2, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaa00 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.rotation.x = Math.PI / 2;
    group.add(core);

    // Histone tails
    const tailGeometry = new THREE.BoxGeometry(0.2, 5, 0.2);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    
    const tail1 = new THREE.Mesh(tailGeometry, tailMaterial);
    tail1.position.set(2, 3, 0);
    group.add(tail1);

    const tail2 = new THREE.Mesh(tailGeometry, tailMaterial);
    tail2.position.set(-2, -3, 0);
    group.add(tail2);

    // Modifier molecule
    const modGeometry = new THREE.TetrahedronGeometry(1.5);
    const modMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const modifier = new THREE.Mesh(modGeometry, modMaterial);
    modifier.name = "modifier";
    modifier.position.set(2, 6, 0);
    group.add(modifier);

    // Animation: modifier approaching tail
    const times = [0, 1, 2];
    const positions = [
        2, 6, 0,
        2, 4, 0,
        2, 6, 0
    ];
    const track = new THREE.VectorKeyframeTrack('modifier.position', times, positions);
    const clip = new THREE.AnimationClip('HistoneModAction', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
