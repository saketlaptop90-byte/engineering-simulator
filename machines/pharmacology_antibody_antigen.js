export function createAntibodyAntigenModel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Antigen (e.g. virus spike)
    const antigenGeo = new THREE.ConeGeometry(1, 2, 16);
    const antigenMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const antigen = new THREE.Mesh(antigenGeo, antigenMat);
    antigen.position.set(0, -2, 0);
    group.add(antigen);

    // Antibody (Y-shape)
    const abGroup = new THREE.Group();
    abGroup.name = 'antibody';
    
    const abMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const baseGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const base = new THREE.Mesh(baseGeo, abMat);
    base.position.set(0, 1, 0);
    abGroup.add(base);

    const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    const armL = new THREE.Mesh(armGeo, abMat);
    armL.position.set(-0.5, 2.5, 0);
    armL.rotation.z = Math.PI / 4;
    abGroup.add(armL);

    const armR = new THREE.Mesh(armGeo, abMat);
    armR.position.set(0.5, 2.5, 0);
    armR.rotation.z = -Math.PI / 4;
    abGroup.add(armR);

    abGroup.position.set(3, 3, 0);
    abGroup.rotation.z = -Math.PI / 4;
    group.add(abGroup);

    // Animation
    const times = [0, 2, 4];
    const abPosValues = [3, 3, 0, 0.5, 0.5, 0, 0, 0, 0];
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 4));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    const abQuatValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const clip = new THREE.AnimationClip('BindingAction', 4, [
        new THREE.VectorKeyframeTrack('antibody.position', times, abPosValues),
        new THREE.QuaternionKeyframeTrack('antibody.quaternion', times, abQuatValues)
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
