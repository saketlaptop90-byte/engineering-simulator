import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createHydraulicExcavatorArm(THREE) {
    const group = new THREE.Group();
    group.name = "ExcavatorArm";

    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 2), darkSteel);
    group.add(base);

    const boomPivot = new THREE.Group();
    boomPivot.name = "BoomPivot";
    boomPivot.position.set(0, 0.5, 0);
    group.add(boomPivot);

    const boom = new THREE.Mesh(new THREE.BoxGeometry(0.6, 5, 0.6), darkSteel);
    boom.position.set(0, 2.5, 0);
    boomPivot.add(boom);

    const stickPivot = new THREE.Group();
    stickPivot.name = "StickPivot";
    stickPivot.position.set(0, 5, 0);
    boomPivot.add(stickPivot);

    const stick = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 0.5), aluminum);
    stick.position.set(0, -2, 0);
    stickPivot.add(stick);

    const bucketPivot = new THREE.Group();
    bucketPivot.name = "BucketPivot";
    bucketPivot.position.set(0, -4, 0);
    stickPivot.add(bucketPivot);

    const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1, 16, 1, false, 0, Math.PI), brass);
    bucket.rotation.x = Math.PI / 2;
    bucket.position.set(0, -0.5, 0);
    bucketPivot.add(bucket);

    const duration = 5;
    const times = [0, 1.25, 2.5, 3.75, 5];
    
    const boomVals = [];
    [0, Math.PI/8, 0, -Math.PI/8, 0].forEach(a => {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), a);
        boomVals.push(q.x, q.y, q.z, q.w);
    });

    const stickVals = [];
    [Math.PI/6, Math.PI/3, Math.PI/6, 0, Math.PI/6].forEach(a => {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), a);
        stickVals.push(q.x, q.y, q.z, q.w);
    });

    const bucketVals = [];
    [0, -Math.PI/4, -Math.PI/3, -Math.PI/6, 0].forEach(a => {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), a);
        bucketVals.push(q.x, q.y, q.z, q.w);
    });

    const tracks = [
        new THREE.QuaternionKeyframeTrack('BoomPivot.quaternion', times, boomVals),
        new THREE.QuaternionKeyframeTrack('StickPivot.quaternion', times, stickVals),
        new THREE.QuaternionKeyframeTrack('BucketPivot.quaternion', times, bucketVals)
    ];

    const clip = new THREE.AnimationClip("DigAction", duration, tracks);

    return { group, animationClips: [clip] };
}
