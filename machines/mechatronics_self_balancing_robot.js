import * as materials from '../utils/materials.js';

export function createSelfBalancingRobot(THREE) {
    const group = new THREE.Group();

    const rubber = materials.rubber || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const plastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const aluminum = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });

    const chassisPivot = new THREE.Group();
    chassisPivot.position.y = 1;
    group.add(chassisPivot);

    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 1.5), plastic);
    body.position.y = 2;
    chassisPivot.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), plastic);
    head.position.y = 4.5;
    chassisPivot.add(head);

    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.6), materials.glass || new THREE.MeshStandardMaterial({color: 0x000000}));
    screen.position.set(0, 4.5, 0.1);
    chassisPivot.add(screen);

    const leftWheel = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 32), rubber);
    leftWheel.rotation.z = Math.PI / 2;
    leftWheel.position.set(-1.25, 1, 0);
    group.add(leftWheel);

    const rightWheel = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 32), rubber);
    rightWheel.rotation.z = Math.PI / 2;
    rightWheel.position.set(1.25, 1, 0);
    group.add(rightWheel);

    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), aluminum);
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, 1, 0);
    group.add(axle);

    const times = [0, 1, 2, 3, 4];
    
    const pitches = [0, 0.2, -0.15, 0.1, 0];
    const chassisQuats = [];
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    for(let p of pitches) {
        e.set(p, 0, 0);
        q.setFromEuler(e);
        chassisQuats.push(q.x, q.y, q.z, q.w);
    }

    const positions = [
        0, 0, 0,
        0, 0, -2,
        0, 0, 1.5,
        0, 0, -1,
        0, 0, 0
    ];

    const rootTrack = new THREE.VectorKeyframeTrack(group.uuid + '.position', times, positions);
    const chassisTrack = new THREE.QuaternionKeyframeTrack(chassisPivot.uuid + '.quaternion', times, chassisQuats);
    
    const wheelQ = [];
    for(let i=0; i<times.length; i++) {
        const angle = positions[i*3 + 2] / 1.0; 
        const wheelQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
        const zRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        wheelQuat.multiply(zRot);
        wheelQ.push(wheelQuat.x, wheelQuat.y, wheelQuat.z, wheelQuat.w);
    }

    const leftWheelTrack = new THREE.QuaternionKeyframeTrack(leftWheel.uuid + '.quaternion', times, wheelQ);
    const rightWheelTrack = new THREE.QuaternionKeyframeTrack(rightWheel.uuid + '.quaternion', times, wheelQ);

    const clip = new THREE.AnimationClip('Balance', 4, [rootTrack, chassisTrack, leftWheelTrack, rightWheelTrack]);

    return { group, animationClips: [clip] };
}
