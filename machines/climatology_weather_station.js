export function createWeatherStation(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Materials
    const grayMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.9 });

    // Stand
    const standGeo = new THREE.BoxGeometry(1, 0.2, 1);
    const stand = new THREE.Mesh(standGeo, grayMat);
    group.add(stand);

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
    const pole = new THREE.Mesh(poleGeo, grayMat);
    pole.position.y = 2;
    group.add(pole);

    // Instrument box
    const boxGeo = new THREE.BoxGeometry(0.6, 0.8, 0.4);
    const box = new THREE.Mesh(boxGeo, whiteMat);
    box.position.set(0, 1.5, 0.1);
    group.add(box);

    // Solar Panel
    const panelGeo = new THREE.BoxGeometry(1, 0.05, 0.6);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1133aa, metalness: 0.9, roughness: 0.1 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 2.5, 0.3);
    panel.rotation.x = Math.PI / 4;
    group.add(panel);

    // Anemometer Group
    const anemometerGroup = new THREE.Group();
    anemometerGroup.position.y = 4;
    anemometerGroup.name = "anemometer";
    group.add(anemometerGroup);

    // Anemometer arms
    const armGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.8);
    const arm1 = new THREE.Mesh(armGeo, grayMat);
    arm1.rotation.z = Math.PI / 2;
    const arm2 = new THREE.Mesh(armGeo, grayMat);
    arm2.rotation.z = Math.PI / 2;
    arm2.rotation.x = Math.PI / 2;
    anemometerGroup.add(arm1, arm2);

    // Cups
    const cupGeo = new THREE.SphereGeometry(0.05, 16, 16, 0, Math.PI);
    const positions = [
        [0.4, 0, 0, 0],
        [-0.4, 0, 0, Math.PI],
        [0, 0, 0.4, -Math.PI/2],
        [0, 0, -0.4, Math.PI/2]
    ];
    positions.forEach(pos => {
        const cup = new THREE.Mesh(cupGeo, darkMat);
        cup.position.set(pos[0], pos[1], pos[2]);
        cup.rotation.y = pos[3];
        anemometerGroup.add(cup);
    });

    // Animation
    const times = [0, 0.5, 1, 1.5, 2];
    const q = new THREE.Quaternion();
    const values = [];
    for(let i=0; i<=4; i++) {
        q.setFromAxisAngle(new THREE.Vector3(0,1,0), i * Math.PI / 2);
        values.push(q.x, q.y, q.z, q.w);
    }
    const track = new THREE.QuaternionKeyframeTrack("anemometer.quaternion", times, values);
    const clip = new THREE.AnimationClip("SpinAnemometer", 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
