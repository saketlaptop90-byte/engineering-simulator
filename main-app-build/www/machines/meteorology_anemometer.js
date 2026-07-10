export function createAnemometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main pole
    const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 2.5;
    group.add(pole);

    // Rotating head
    const headGroup = new THREE.Group();
    headGroup.name = "anemometerHead";
    headGroup.position.y = 5;
    group.add(headGroup);

    const centerCapGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const centerCap = new THREE.Mesh(centerCapGeo, poleMat);
    headGroup.add(centerCap);

    // Arms and cups
    const cupGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, side: THREE.DoubleSide });
    
    for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        
        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
        const arm = new THREE.Mesh(armGeo, poleMat);
        arm.rotation.x = Math.PI / 2;
        arm.rotation.z = angle;
        
        // Position arm
        arm.position.x = Math.cos(angle) * 1;
        arm.position.z = Math.sin(angle) * 1;
        headGroup.add(arm);

        const cup = new THREE.Mesh(cupGeo, cupMat);
        cup.position.x = Math.cos(angle) * 2;
        cup.position.z = Math.sin(angle) * 2;
        
        // Rotate cup to face tangential direction
        cup.rotation.y = -angle; 
        cup.rotation.x = Math.PI / 2;
        
        headGroup.add(cup);
    }

    // Animation
    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
    ];

    const track = new THREE.QuaternionKeyframeTrack('anemometerHead.quaternion', times, values);
    const clip = new THREE.AnimationClip('Spin', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
