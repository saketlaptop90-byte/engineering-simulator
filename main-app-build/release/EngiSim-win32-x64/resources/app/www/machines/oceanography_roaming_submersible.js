export function createRoamingSubmersible(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    bodyGeo.rotateZ(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Nose
    const noseGeo = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    noseGeo.rotateZ(-Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.position.x = 2;
    group.add(nose);

    // Tail
    const tailGeo = new THREE.ConeGeometry(1, 2, 32);
    tailGeo.rotateZ(Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.x = -3;
    group.add(tail);

    // Propeller
    const propGroup = new THREE.Group();
    propGroup.name = 'propGroup';
    const propCenterGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    propCenterGeo.rotateZ(Math.PI / 2);
    const propMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });
    const propCenter = new THREE.Mesh(propCenterGeo, propMat);
    propGroup.add(propCenter);

    const bladeGeo = new THREE.BoxGeometry(0.1, 1.5, 0.3);
    const blade1 = new THREE.Mesh(bladeGeo, propMat);
    propGroup.add(blade1);
    const blade2 = new THREE.Mesh(bladeGeo, propMat);
    blade2.rotation.x = Math.PI / 2;
    propGroup.add(blade2);
    
    propGroup.position.x = -4.25;
    group.add(propGroup);

    // Animation (Propeller rotation)
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    
    const propTrack = new THREE.QuaternionKeyframeTrack(
        'propGroup.quaternion',
        [0, 1, 2],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const clip = new THREE.AnimationClip('SpinPropeller', 2, [propTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
