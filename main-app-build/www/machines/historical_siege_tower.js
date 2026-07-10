import * as materials from '../utils/materials.js';

export function createSiegeTower(THREE) {
    const group = new THREE.Group();
    
    const woodMat = materials.wood || new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const ironMat = materials.iron || materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ropeMat = materials.rope || materials.wireCoil || new THREE.MeshStandardMaterial({ color: 0xd2b48c });

    const towerGroup = new THREE.Group();
    towerGroup.name = 'SiegeTowerMain';
    group.add(towerGroup);

    const body = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4), woodMat);
    body.position.y = 6.5;
    towerGroup.add(body);

    // Wheels
    const wheels = [];
    for (let i = 0; i < 4; i++) {
        const x = (i % 2 === 0 ? 1 : -1) * 2.2;
        const z = (i < 2 ? 1 : -1) * 2;
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4), woodMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(x, 0.8, z);
        w.name = `TowerWheel${i}`;
        towerGroup.add(w);
        wheels.push(w);
    }

    const bridgePivot = new THREE.Group();
    bridgePivot.name = 'DrawbridgePivot';
    bridgePivot.position.set(0, 11, -2);
    towerGroup.add(bridgePivot);

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.2), woodMat);
    bridge.position.set(0, 2, 0);
    bridgePivot.add(bridge);
    
    const spikes = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 0.4), ironMat);
    spikes.position.set(0, 4, 0.1);
    bridgePivot.add(spikes);

    bridgePivot.rotation.x = -Math.PI / 16; // Folded up slightly

    // Ropes
    const ropeL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), ropeMat);
    ropeL.name = 'TowerRopeL';
    ropeL.position.set(-1.4, 2, 0.5);
    bridgePivot.add(ropeL);
    
    const ropeR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), ropeMat);
    ropeR.name = 'TowerRopeR';
    ropeR.position.set(1.4, 2, 0.5);
    bridgePivot.add(ropeR);

    // Animation
    const times = [0, 3, 4, 5];
    
    // Movement
    const trackPos = new THREE.VectorKeyframeTrack('SiegeTowerMain.position', times, [
        0,0,5,  0,0,0,  0,0,0,  0,0,0
    ]);

    // Wheels rolling
    const qW0 = new THREE.Quaternion();
    const qW1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI*2);
    const trackWheels = wheels.map((w, i) => new THREE.QuaternionKeyframeTrack(`TowerWheel${i}.quaternion`, times, [
        ...qW0.toArray(), ...qW1.toArray(), ...qW1.toArray(), ...qW1.toArray()
    ]));

    // Bridge Drop
    const qB0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/16);
    const qB1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/2);
    const trackBridge = new THREE.QuaternionKeyframeTrack('DrawbridgePivot.quaternion', times, [
        ...qB0.toArray(), ...qB0.toArray(), ...qB1.toArray(), ...qB1.toArray()
    ]);

    // Ropes scale down (simulate slack/disappearing)
    const trackRopeL = new THREE.VectorKeyframeTrack('TowerRopeL.scale', times, [
        1,1,1,  1,1,1,  1,0.01,1,  1,0.01,1
    ]);
    const trackRopeR = new THREE.VectorKeyframeTrack('TowerRopeR.scale', times, [
        1,1,1,  1,1,1,  1,0.01,1,  1,0.01,1
    ]);

    const clip = new THREE.AnimationClip('SiegeTowerAttack', 5.0, [
        trackPos, trackBridge, trackRopeL, trackRopeR, ...trackWheels
    ]);

    return { group, animationClips: [clip] };
}
