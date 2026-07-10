export function createUnderwaterGlider(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const hullMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.3 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.1, roughness: 0.4 });

    // Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 32);
    fuselageGeo.rotateZ(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeo, hullMat);
    group.add(fuselage);

    // Nose
    const noseGeo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    noseGeo.rotateZ(-Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, hullMat);
    nose.position.x = 3;
    group.add(nose);

    // Tail
    const tailGeo = new THREE.ConeGeometry(0.5, 1.5, 32);
    tailGeo.rotateZ(Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, hullMat);
    tail.position.x = -3.75;
    group.add(tail);

    // Wings
    const wingGeo = new THREE.BoxGeometry(2, 0.05, 1);
    const wing1 = new THREE.Mesh(wingGeo, wingMat);
    wing1.position.set(0, 0, 0.75);
    group.add(wing1);

    const wing2 = new THREE.Mesh(wingGeo, wingMat);
    wing2.position.set(0, 0, -0.75);
    group.add(wing2);

    // Tail fin
    const finGeo = new THREE.BoxGeometry(0.8, 1, 0.05);
    const fin = new THREE.Mesh(finGeo, wingMat);
    fin.position.set(-3.5, 0.5, 0);
    group.add(fin);

    // Pitching animation
    group.name = 'gliderGroup';
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.2);

    const pitchTrack = new THREE.QuaternionKeyframeTrack(
        'gliderGroup.quaternion',
        [0, 5, 10],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const pitchClip = new THREE.AnimationClip('GlidePitch', 10, [pitchTrack]);
    animationClips.push(pitchClip);

    return { group, animationClips };
}
