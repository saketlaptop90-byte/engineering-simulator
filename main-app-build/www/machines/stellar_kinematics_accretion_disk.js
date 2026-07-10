export function createAccretionDisk(THREE) {
    const group = new THREE.Group();
    group.name = 'AccretionGroup';
    const animationClips = [];

    const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), blackHoleMat);
    group.add(blackHole);

    const diskGroup = new THREE.Group();
    diskGroup.name = 'AccretionDisk';
    
    const innerRadius = 2.0;
    const outerRadius = 8.0;
    
    const diskGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const diskMat = new THREE.MeshStandardMaterial({ 
        color: 0xff5500, 
        emissive: 0xff2200, 
        emissiveIntensity: 0.8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = Math.PI / 2;
    diskGroup.add(disk);

    // Jet particles
    const jetGeo = new THREE.CylinderGeometry(0.1, 1, 10, 16);
    const jetMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 1, transparent: true, opacity: 0.5 });
    
    const jetTop = new THREE.Mesh(jetGeo, jetMat);
    jetTop.position.y = 5;
    const jetBot = new THREE.Mesh(jetGeo, jetMat);
    jetBot.position.y = -5;
    jetBot.rotation.x = Math.PI;

    diskGroup.add(jetTop);
    diskGroup.add(jetBot);
    
    group.add(diskGroup);

    const times = [0, 2, 4];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    const values = [...q0.toArray(), ...q1.toArray(), ...q2.toArray()];

    const track = new THREE.QuaternionKeyframeTrack('AccretionDisk.quaternion', times, values);
    const clip = new THREE.AnimationClip('AccretionSpin', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
