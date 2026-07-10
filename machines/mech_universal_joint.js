import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createUniversalJoint(THREE) {
    const group = new THREE.Group();
    group.name = 'UniversalJoint';

    const inputShaftGroup = new THREE.Group();
    inputShaftGroup.name = 'inputShaft';
    group.add(inputShaftGroup);

    const inputCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5), aluminum);
    inputCyl.position.set(-2.5, 0, 0);
    inputCyl.rotation.z = Math.PI / 2;
    inputShaftGroup.add(inputCyl);

    const inputYoke = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.5), aluminum);
    inputShaftGroup.add(inputYoke);

    const outputPivot = new THREE.Group();
    outputPivot.rotation.y = Math.PI / 6; // 30 degrees angle
    group.add(outputPivot);

    const outputShaftGroup = new THREE.Group();
    outputShaftGroup.name = 'outputShaft';
    outputPivot.add(outputShaftGroup);

    const outputCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5), darkSteel);
    outputCyl.position.set(2.5, 0, 0);
    outputCyl.rotation.z = Math.PI / 2;
    outputShaftGroup.add(outputCyl);

    const outputYoke = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 2), darkSteel);
    outputShaftGroup.add(outputYoke);

    const crossGroup = new THREE.Group();
    crossGroup.name = 'cross';
    group.add(crossGroup);

    const crossV = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2), brass);
    crossGroup.add(crossV);
    const crossH = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2), brass);
    crossH.rotation.x = Math.PI / 2;
    crossGroup.add(crossH);

    const duration = 2;
    const times = [0, 1, 2];
    
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);

    const inputTrack = new THREE.QuaternionKeyframeTrack('inputShaft.quaternion', times, [
        q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w
    ]);

    const outputTrack = new THREE.QuaternionKeyframeTrack('outputShaft.quaternion', times, [
        q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w
    ]);
    
    const crossTrack = new THREE.QuaternionKeyframeTrack('cross.quaternion', times, [
        q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w
    ]);

    const clip = new THREE.AnimationClip('UniversalJointAction', duration, [inputTrack, outputTrack, crossTrack]);

    return { group, animationClips: [clip] };
}
