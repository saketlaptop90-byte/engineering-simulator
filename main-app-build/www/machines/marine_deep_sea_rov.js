import { materials } from '../utils/materials.js';

export function createDeepSeaROV(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyGeo = new THREE.BoxGeometry(2, 1.5, 3);
    const bodyMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const propGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
    const propMat = materials.brass || new THREE.MeshStandardMaterial({ color: 0xb5a642 });

    const prop1Pivot = new THREE.Group();
    prop1Pivot.name = 'prop1Pivot';
    prop1Pivot.position.set(-1.2, -0.5, 1.5);
    group.add(prop1Pivot);

    const prop1 = new THREE.Mesh(propGeo, propMat);
    prop1.rotation.x = Math.PI / 2;
    prop1Pivot.add(prop1);

    const prop2Pivot = new THREE.Group();
    prop2Pivot.name = 'prop2Pivot';
    prop2Pivot.position.set(1.2, -0.5, 1.5);
    group.add(prop2Pivot);

    const prop2 = new THREE.Mesh(propGeo, propMat);
    prop2.rotation.x = Math.PI / 2;
    prop2Pivot.add(prop2);

    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const armMat = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.name = 'roboticArm';
    arm.position.set(0, -0.5, -1.5);
    group.add(arm);

    const duration = 2;
    const times = [0, duration / 2, duration];
    
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);

    const propValues = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ];

    const prop1Track = new THREE.QuaternionKeyframeTrack('prop1Pivot.quaternion', times, propValues);
    const prop2Track = new THREE.QuaternionKeyframeTrack('prop2Pivot.quaternion', times, propValues);

    const armQ0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 4);
    const armQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
    const armValues = [
        armQ0.x, armQ0.y, armQ0.z, armQ0.w,
        armQ1.x, armQ1.y, armQ1.z, armQ1.w,
        armQ0.x, armQ0.y, armQ0.z, armQ0.w,
    ];
    const armTrack = new THREE.QuaternionKeyframeTrack('roboticArm.quaternion', times, armValues);

    const clip = new THREE.AnimationClip('ROV_Operation', duration, [prop1Track, prop2Track, armTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
