export function createDnaOrigamiNanobot(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main body (barrel-like structure)
    const bodyGeometry = new THREE.CylinderGeometry(1, 1, 3, 16, 1, true);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa44ff,
        side: THREE.DoubleSide,
        wireframe: true
    });
    const body1 = new THREE.Mesh(bodyGeometry, bodyMaterial);
    const body2 = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // Split barrel to simulate opening
    body1.geometry = new THREE.CylinderGeometry(1, 1, 3, 16, 1, true, 0, Math.PI);
    body2.geometry = new THREE.CylinderGeometry(1, 1, 3, 16, 1, true, Math.PI, Math.PI);

    body1.name = "bodyHalf1";
    body2.name = "bodyHalf2";

    group.add(body1);
    group.add(body2);

    // Payload core
    const coreGeometry = new THREE.IcosahedronGeometry(0.6);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x004422
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // Opening animation
    const times = [0, 2, 4];
    
    const q1_start = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q1_mid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI / 4);
    const q1_end = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    
    const rotTrack1_name = new THREE.QuaternionKeyframeTrack(`bodyHalf1.quaternion`, times, [
        ...q1_start.toArray(), ...q1_mid.toArray(), ...q1_end.toArray()
    ]);

    const q2_start = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2_mid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI / 4);
    const q2_end = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    
    const rotTrack2_name = new THREE.QuaternionKeyframeTrack(`bodyHalf2.quaternion`, times, [
        ...q2_start.toArray(), ...q2_mid.toArray(), ...q2_end.toArray()
    ]);

    const clip = new THREE.AnimationClip('openClose', 4, [rotTrack1_name, rotTrack2_name]);
    animationClips.push(clip);

    return { group, animationClips };
}
