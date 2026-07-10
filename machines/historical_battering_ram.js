import * as materials from '../utils/materials.js';

export function createBatteringRam(THREE) {
    const group = new THREE.Group();
    
    const woodMat = materials.wood || new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const ironMat = materials.iron || materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ropeMat = materials.rope || materials.wireCoil || new THREE.MeshStandardMaterial({ color: 0xd2b48c });

    const chassis = new THREE.Group();
    chassis.name = 'RamChassis';
    group.add(chassis);

    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 8), woodMat);
    base.position.y = 1;
    chassis.add(base);

    const roofGeo = new THREE.ConeGeometry(3, 2, 4);
    const roof = new THREE.Mesh(roofGeo, woodMat);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1, 1, 1.5);
    roof.position.set(0, 5, 0);
    chassis.add(roof);

    for (let i = 0; i < 4; i++) {
        const x = (i % 2 === 0 ? 1 : -1) * 1.8;
        const z = (i < 2 ? 1 : -1) * 3;
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 0.3), woodMat);
        post.position.set(x, 3, z);
        chassis.add(post);
    }

    const wheels = [];
    for (let i = 0; i < 4; i++) {
        const x = (i % 2 === 0 ? 1 : -1) * 2.2;
        const z = (i < 2 ? 1 : -1) * 3;
        const w = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3), woodMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(x, 1, z);
        w.name = `RamWheel${i}`;
        chassis.add(w);
        wheels.push(w);
    }

    const ramPivot = new THREE.Group();
    ramPivot.name = 'RamPivot';
    ramPivot.position.set(0, 4, 0);
    chassis.add(ramPivot);

    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 7), woodMat);
    log.rotation.x = Math.PI / 2;
    log.position.set(0, -2, 0);
    ramPivot.add(log);

    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 1), ironMat);
    head.rotation.x = Math.PI / 2;
    head.position.set(0, -2, -3.5);
    ramPivot.add(head);

    const rope1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), ropeMat);
    rope1.position.set(0, -1, 2);
    ramPivot.add(rope1);

    const rope2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), ropeMat);
    rope2.position.set(0, -1, -2);
    ramPivot.add(rope2);

    const times = [0, 1, 1.2, 2];
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 8);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 8);

    const trackRam = new THREE.QuaternionKeyframeTrack('RamPivot.quaternion', times, [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q0.toArray()
    ]);

    const trackChassis = new THREE.VectorKeyframeTrack('RamChassis.position', times, [
        0,0,0,  0,0,0.2,  0,0,-0.2,  0,0,0
    ]);
    
    const qW0 = new THREE.Quaternion();
    const qW1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.2);
    const qW2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.2);
    
    const trackWheels = wheels.map((w, i) => new THREE.QuaternionKeyframeTrack(`RamWheel${i}.quaternion`, times, [
        ...qW0.toArray(), ...qW1.toArray(), ...qW2.toArray(), ...qW0.toArray()
    ]));

    const clip = new THREE.AnimationClip('SwingRam', 2.0, [trackRam, trackChassis, ...trackWheels]);

    return { group, animationClips: [clip] };
}
