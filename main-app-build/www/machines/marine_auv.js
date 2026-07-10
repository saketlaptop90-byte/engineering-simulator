import { materials } from '../utils/materials.js';

export function createAUV(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const mat = materials.yellowPaint || new THREE.MeshStandardMaterial({ color: 0xffcc00 });

    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const body = new THREE.Mesh(bodyGeo, mat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const noseGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const nose = new THREE.Mesh(noseGeo, mat);
    nose.position.z = -2;
    group.add(nose);

    const tailPivot = new THREE.Group();
    tailPivot.position.z = 2;
    tailPivot.name = 'tailPivot';
    group.add(tailPivot);

    const propGeo = new THREE.BoxGeometry(0.1, 1.2, 0.2);
    const propMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const propeller = new THREE.Mesh(propGeo, propMat);
    tailPivot.add(propeller);

    const finGeo = new THREE.BoxGeometry(0.1, 0.6, 0.4);
    const finPivotTop = new THREE.Group();
    finPivotTop.position.set(0, 0.5, 1.5);
    finPivotTop.name = 'finPivotTop';
    group.add(finPivotTop);
    const finTop = new THREE.Mesh(finGeo, mat);
    finTop.position.y = 0.3;
    finPivotTop.add(finTop);

    const duration = 1;
    const times = [0, duration / 2, duration];
    
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);
    
    const propTrack = new THREE.QuaternionKeyframeTrack('tailPivot.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ]);

    const fq0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.2);
    const fq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.2);
    const finTrack = new THREE.QuaternionKeyframeTrack('finPivotTop.quaternion', times, [
        fq0.x, fq0.y, fq0.z, fq0.w,
        fq1.x, fq1.y, fq1.z, fq1.w,
        fq0.x, fq0.y, fq0.z, fq0.w,
    ]);

    const clip = new THREE.AnimationClip('AUV_Action', duration, [propTrack, finTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
