export function createWeatherStation(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    
    const positions = [
        [-1.5, 2, -1.5],
        [ 1.5, 2, -1.5],
        [-1.5, 2,  1.5],
        [ 1.5, 2,  1.5]
    ];
    
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(...pos);
        group.add(leg);
    });

    // Box (Stevenson Screen)
    const boxGeo = new THREE.BoxGeometry(3.5, 2.5, 3.5);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 5.25;
    group.add(box);

    // Roof
    const roofGeo = new THREE.ConeGeometry(3.2, 1, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 7;
    group.add(roof);

    // Small spinning solar fan on top
    const fanGroup = new THREE.Group();
    fanGroup.name = "solarFan";
    fanGroup.position.y = 7.6;
    group.add(fanGroup);

    const fanBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2);
    const fanBase = new THREE.Mesh(fanBaseGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
    fanGroup.add(fanBase);

    const bladeGeo = new THREE.BoxGeometry(1.5, 0.05, 0.2);
    const blade1 = new THREE.Mesh(bladeGeo, new THREE.MeshStandardMaterial({ color: 0x111111 }));
    blade1.position.y = 0.15;
    fanGroup.add(blade1);

    const blade2 = new THREE.Mesh(bladeGeo, new THREE.MeshStandardMaterial({ color: 0x111111 }));
    blade2.position.y = 0.15;
    blade2.rotation.y = Math.PI / 2;
    fanGroup.add(blade2);

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

    const track = new THREE.QuaternionKeyframeTrack('solarFan.quaternion', times, values);
    const clip = new THREE.AnimationClip('FanSpin', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
