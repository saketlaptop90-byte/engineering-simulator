export function createViralVector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const capsidMat = new THREE.MeshStandardMaterial({ color: 0x8e44ad, flatShading: true });
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7 });

    const capsidGeo = new THREE.IcosahedronGeometry(2);
    const capsid = new THREE.Mesh(capsidGeo, capsidMat);
    capsid.position.y = 3;
    group.add(capsid);

    const tailGeo = new THREE.CylinderGeometry(0.4, 0.4, 3);
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.y = 1.5;
    group.add(tail);

    const baseGeo = new THREE.CylinderGeometry(1, 1, 0.2, 6);
    const base = new THREE.Mesh(baseGeo, tailMat);
    base.position.y = 0;
    group.add(base);

    // Animation: Injecting
    group.name = 'ViralVector';
    const posTrack = new THREE.VectorKeyframeTrack('ViralVector.position', [0, 1, 3, 4], [
        0, 2, 0,
        0, 0, 0,
        0, 0, 0,
        0, 2, 0
    ]);
    
    const clip = new THREE.AnimationClip('Injection', 4, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
