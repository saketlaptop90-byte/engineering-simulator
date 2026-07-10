import * as materials from '../utils/materials.js';

export function createCatapult(THREE) {
    const group = new THREE.Group();
    
    const woodMat = materials.wood || new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const ironMat = materials.iron || materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ropeMat = materials.rope || materials.wireCoil || new THREE.MeshStandardMaterial({ color: 0xd2b48c });

    const chassis = new THREE.Group();
    chassis.name = 'CatapultChassis';
    group.add(chassis);

    const body = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 6), woodMat);
    body.position.y = 1;
    chassis.add(body);

    const wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2);
    const positions = [
        [-1.7, 0.8, 2], [1.7, 0.8, 2],
        [-1.7, 0.8, -2], [1.7, 0.8, -2]
    ];
    positions.forEach((pos, i) => {
        const w = new THREE.Mesh(wheelGeo, woodMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(...pos);
        w.name = `CatapultWheel${i}`;
        chassis.add(w);
        wheels.push(w);
    });

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3), woodMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(0, 4, -2);
    chassis.add(crossbar);

    const uprightL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3, 0.4), woodMat);
    uprightL.position.set(-1.3, 2.5, -2);
    chassis.add(uprightL);
    
    const uprightR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3, 0.4), woodMat);
    uprightR.position.set(1.3, 2.5, -2);
    chassis.add(uprightR);

    const pivot = new THREE.Group();
    pivot.name = 'CatapultArmPivot';
    pivot.position.set(0, 1.5, 1.5);
    chassis.add(pivot);

    const ropeCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 3.2), ropeMat);
    ropeCoil.rotation.z = Math.PI / 2;
    pivot.add(ropeCoil);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6, 0.3), woodMat);
    arm.position.set(0, 3, 0);
    pivot.add(arm);

    const cup = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI), ironMat);
    cup.rotation.x = -Math.PI / 2;
    cup.position.set(0, 6, 0);
    pivot.add(cup);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 6);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2.2);

    const times = [0, 1.5, 1.7, 2.0, 3.0];
    const values = [...q1.toArray(), ...q1.toArray(), ...q0.toArray(), ...q2.toArray(), ...q1.toArray()];

    const trackArm = new THREE.QuaternionKeyframeTrack('CatapultArmPivot.quaternion', times, values);
    
    const qWheel0 = new THREE.Quaternion();
    const qWheel1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const qWheel2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    
    const trackWheels = [];
    wheels.forEach((w, i) => {
        trackWheels.push(
            new THREE.QuaternionKeyframeTrack(`CatapultWheel${i}.quaternion`, [0, 1.5, 1.8, 3.0], [
                ...qWheel0.toArray(), ...qWheel0.toArray(), ...qWheel1.toArray(), ...qWheel2.toArray()
            ])
        );
    });

    const trackChassis = new THREE.VectorKeyframeTrack('CatapultChassis.position', [0, 1.5, 1.8, 3.0], [
        0,0,0,  0,0,0,  0,0,0.5,  0,0,0
    ]);

    pivot.quaternion.copy(q1);

    const clip = new THREE.AnimationClip('FireCatapult', 3.0, [trackArm, trackChassis, ...trackWheels]);

    return { group, animationClips: [clip] };
}
