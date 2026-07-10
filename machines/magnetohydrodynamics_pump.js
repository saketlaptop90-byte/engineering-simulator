export function createMHDPump(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pipe
    const pipeGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 32);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.4 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    group.add(pipe);

    // Stator Coils (Linear Motor effect)
    const statorGeo = new THREE.BoxGeometry(10, 4, 1);
    const statorMat = new THREE.MeshStandardMaterial({ color: 0x773300 });
    const stator1 = new THREE.Mesh(statorGeo, statorMat);
    stator1.position.z = 2;
    const stator2 = new THREE.Mesh(statorGeo, statorMat);
    stator2.position.z = -2;
    group.add(stator1);
    group.add(stator2);

    // Liquid Metal
    const liquidGeo = new THREE.CylinderGeometry(1.4, 1.4, 12, 32);
    const liquidMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 1, roughness: 0.2 });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.rotation.z = Math.PI / 2;
    group.add(liquid);

    // Animation (moving liquid texture or sliding geometry)
    const times = [0, 1];
    const values = [-6, 0, 0, 6, 0, 0];
    const track = new THREE.VectorKeyframeTrack(`${liquid.uuid}.position`, times, values);
    const clip = new THREE.AnimationClip('pump', -1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
