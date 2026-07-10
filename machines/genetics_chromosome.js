export function createChromosome(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const material = new THREE.MeshStandardMaterial({ color: 0x9c27b0 });
    const centromereMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });

    const armGeo = new THREE.CapsuleGeometry(0.5, 3, 4, 8);
    
    const arm1 = new THREE.Mesh(armGeo, material);
    arm1.position.set(0.3, 2, 0);
    arm1.rotation.z = -0.1;
    group.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, material);
    arm2.position.set(-0.3, 2, 0);
    arm2.rotation.z = 0.1;
    group.add(arm2);

    const arm3 = new THREE.Mesh(armGeo, material);
    arm3.position.set(0.3, -2, 0);
    arm3.rotation.z = 0.1;
    group.add(arm3);

    const arm4 = new THREE.Mesh(armGeo, material);
    arm4.position.set(-0.3, -2, 0);
    arm4.rotation.z = -0.1;
    group.add(arm4);

    const centromere = new THREE.Mesh(new THREE.SphereGeometry(0.6), centromereMat);
    group.add(centromere);

    // Animation: Pulsating centromere
    const scaleTrack = new THREE.VectorKeyframeTrack('.scale', [0, 1, 2], [
        1, 1, 1,
        1.2, 1.2, 1.2,
        1, 1, 1
    ]);
    const clip = new THREE.AnimationClip('pulsate', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
