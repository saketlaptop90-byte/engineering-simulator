export function createIceCoreDrill(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xaa0000, metalness: 0.4, roughness: 0.6 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const iceMat = new THREE.MeshStandardMaterial({ color: 0xaaddff, metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.5 });

    // Rig Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const base = new THREE.Mesh(baseGeo, frameMat);
    base.position.y = 0.25;
    group.add(base);

    // Derrick (Tower)
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const legPositions = [
        [1.5, 4, 1.5],
        [-1.5, 4, 1.5],
        [1.5, 4, -1.5],
        [-1.5, 4, -1.5]
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, frameMat);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.rotation.x = pos[2] > 0 ? -0.1 : 0.1;
        leg.rotation.z = pos[0] > 0 ? 0.1 : -0.1;
        group.add(leg);
    });

    const topGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const top = new THREE.Mesh(topGeo, frameMat);
    top.position.y = 8;
    group.add(top);

    // Drill String Group
    const drillGroup = new THREE.Group();
    drillGroup.position.set(0, 4, 0);
    drillGroup.name = "drillString";
    group.add(drillGroup);

    // Drill Pipe
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const pipe = new THREE.Mesh(pipeGeo, steelMat);
    drillGroup.add(pipe);

    // Core Barrel (lower part)
    const barrelGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const barrel = new THREE.Mesh(barrelGeo, steelMat);
    barrel.position.y = -4;
    drillGroup.add(barrel);
    
    // Extracted Ice Core
    const iceGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 16);
    const iceCore = new THREE.Mesh(iceGeo, iceMat);
    iceCore.position.y = -4;
    drillGroup.add(iceCore);

    // Motor Housing
    const motorGeo = new THREE.BoxGeometry(1, 1.5, 1);
    const motor = new THREE.Mesh(motorGeo, steelMat);
    motor.position.y = 3;
    drillGroup.add(motor);

    // Animation: Drill moving down and rotating
    const times = [0, 2, 4, 6];
    const posValues = [
        0, 4, 0,
        0, 1, 0, // goes down
        0, 1, 0,
        0, 4, 0  // goes up
    ];
    const posTrack = new THREE.VectorKeyframeTrack("drillString.position", times, posValues);

    const q = new THREE.Quaternion();
    const rotTimes = [];
    const rotVals = [];
    for(let i=0; i<=60; i++) {
        rotTimes.push(i * 0.1);
        q.setFromAxisAngle(new THREE.Vector3(0,1,0), (i*0.1) * Math.PI * 4); // spin
        rotVals.push(q.x, q.y, q.z, q.w);
    }
    const rotTrack = new THREE.QuaternionKeyframeTrack("drillString.quaternion", rotTimes, rotVals);

    const clip = new THREE.AnimationClip("DrillCycle", 6, [posTrack, rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
