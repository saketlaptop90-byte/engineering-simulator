export function createOceanBuoy(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.4, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.8 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 });

    // Buoy Hull
    const hullGeo = new THREE.CylinderGeometry(1.5, 1, 2, 32);
    const hull = new THREE.Mesh(hullGeo, yellowMat);
    hull.position.y = 1;
    group.add(hull);

    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const tower = new THREE.Mesh(towerGeo, whiteMat);
    tower.position.y = 3.5;
    group.add(tower);

    // Antenna
    const antGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const ant = new THREE.Mesh(antGeo, darkMat);
    ant.position.y = 6;
    group.add(ant);

    // Instruments
    const instGeo = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const inst = new THREE.Mesh(instGeo, darkMat);
    inst.position.y = 4.5;
    inst.position.x = 0.3;
    group.add(inst);

    group.name = "buoyGroup";

    // Animation (bobbing and swaying)
    const times = [0, 1, 2, 3, 4];
    const posValues = [
        0, 0, 0,
        0, 0.2, 0,
        0, 0, 0,
        0, -0.1, 0,
        0, 0, 0
    ];
    const posTrack = new THREE.VectorKeyframeTrack("buoyGroup.position", times, posValues);
    
    const q = new THREE.Quaternion();
    const rotValues = [];
    [0, 0.05, 0, -0.05, 0].forEach(angle => {
        q.setFromAxisAngle(new THREE.Vector3(1,0,1).normalize(), angle);
        rotValues.push(q.x, q.y, q.z, q.w);
    });
    const rotTrack = new THREE.QuaternionKeyframeTrack("buoyGroup.quaternion", times, rotValues);

    const clip = new THREE.AnimationClip("Bobbing", 4, [posTrack, rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
