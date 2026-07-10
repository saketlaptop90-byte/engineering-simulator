export function createQuarkTriplet(THREE) {
    const group = new THREE.Group();
    group.name = "QuarkTripletGroup";
    const animationClips = [];

    // Custom glowing materials for quarks
    const quarkMatRed = new THREE.MeshPhysicalMaterial({ color: 0xff0000, emissive: 0xaa0000, roughness: 0.2, metalness: 0.8, clearcoat: 1.0 });
    const quarkMatGreen = new THREE.MeshPhysicalMaterial({ color: 0x00ff00, emissive: 0x00aa00, roughness: 0.2, metalness: 0.8, clearcoat: 1.0 });
    const quarkMatBlue = new THREE.MeshPhysicalMaterial({ color: 0x0000ff, emissive: 0x0000aa, roughness: 0.2, metalness: 0.8, clearcoat: 1.0 });

    const quarkGeo = new THREE.SphereGeometry(1, 32, 32);

    const q1 = new THREE.Mesh(quarkGeo, quarkMatRed);
    q1.name = "quark1";
    q1.position.set(2, 0, 0);

    const q2 = new THREE.Mesh(quarkGeo, quarkMatGreen);
    q2.name = "quark2";
    q2.position.set(-1, 1.732, 0);

    const q3 = new THREE.Mesh(quarkGeo, quarkMatBlue);
    q3.name = "quark3";
    q3.position.set(-1, -1.732, 0);

    const innerGroup = new THREE.Group();
    innerGroup.name = "innerGroup";
    innerGroup.add(q1, q2, q3);

    // Flux tubes representing strong force
    const tubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.464, 8);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    
    const tube1 = new THREE.Mesh(tubeGeo, tubeMat);
    tube1.position.set(0.5, 0.866, 0);
    tube1.rotation.z = Math.PI / 6;
    
    const tube2 = new THREE.Mesh(tubeGeo, tubeMat);
    tube2.position.set(0.5, -0.866, 0);
    tube2.rotation.z = -Math.PI / 6;

    const tube3 = new THREE.Mesh(tubeGeo, tubeMat);
    tube3.position.set(-1, 0, 0);
    
    innerGroup.add(tube1, tube2, tube3);
    group.add(innerGroup);

    // Animations for vibration and rotation
    const times = [0, 1, 2];
    const tQ1 = new THREE.VectorKeyframeTrack('quark1.position', times, [2,0,0, 2.5,0,0, 2,0,0]);
    const tQ2 = new THREE.VectorKeyframeTrack('quark2.position', times, [-1,1.732,0, -1.5,2.2,0, -1,1.732,0]);
    const tQ3 = new THREE.VectorKeyframeTrack('quark3.position', times, [-1,-1.732,0, -1.5,-2.2,0, -1,-1.732,0]);

    const qRot0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0).toArray();
    const qRot1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI).toArray();
    const qRot2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2).toArray();
    const tRot = new THREE.QuaternionKeyframeTrack('innerGroup.quaternion', times, [...qRot0, ...qRot1, ...qRot2]);

    const clip = new THREE.AnimationClip('QuarkVibrationAndSpin', 2, [tQ1, tQ2, tQ3, tRot]);
    animationClips.push(clip);

    return { group, animationClips };
}
