export function createDeadlockDetection(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const processMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
    const resourceMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const highlightMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000 });

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 32), processMat);
    p1.position.set(-3, 3, 0);
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 32), processMat);
    p2.position.set(3, -3, 0);
    group.add(p2);

    const r1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), resourceMat);
    r1.position.set(3, 3, 0);
    group.add(r1);

    const r2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), resourceMat);
    r2.position.set(-3, -3, 0);
    group.add(r2);

    const indicator = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), highlightMat);
    indicator.name = "indicator";
    group.add(indicator);

    const times = [0, 1, 2, 3, 4];
    const positions = [-3, 3, 0,  3, 3, 0,  3, -3, 0,  -3, -3, 0,  -3, 3, 0];
    const positionTrack = new THREE.VectorKeyframeTrack('indicator.position', times, positions);
    const clip = new THREE.AnimationClip('Circular_Wait', 4, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
