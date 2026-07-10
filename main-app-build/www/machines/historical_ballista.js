import * as materials from '../utils/materials.js';

export function createBallista(THREE) {
    const group = new THREE.Group();
    
    const woodMat = materials.wood || new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const ironMat = materials.iron || materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ropeMat = materials.rope || materials.wireCoil || new THREE.MeshStandardMaterial({ color: 0xd2b48c });

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 2), woodMat);
    stand.position.y = 1;
    group.add(stand);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 5), woodMat);
    body.position.set(0, 2.25, 0);
    group.add(body);

    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, 2.25, -2);
    group.add(bowGroup);

    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(4, 0.6, 0.6), woodMat);
    bowGroup.add(crossBeam);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.2), woodMat);
    leftArm.name = 'BallistaLeftArm';
    leftArm.position.set(-1.5, 0, 0);
    bowGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.2), woodMat);
    rightArm.name = 'BallistaRightArm';
    rightArm.position.set(1.5, 0, 0);
    bowGroup.add(rightArm);

    const stringGroup = new THREE.Group();
    stringGroup.name = 'BallistaString';
    stringGroup.position.set(0, 0, 0);
    bowGroup.add(stringGroup);
    
    const string1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), ropeMat);
    string1.rotation.z = Math.PI / 2;
    string1.rotation.y = -Math.PI / 6;
    string1.position.set(-1, 0, 0.5);
    stringGroup.add(string1);

    const string2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), ropeMat);
    string2.rotation.z = Math.PI / 2;
    string2.rotation.y = Math.PI / 6;
    string2.position.set(1, 0, 0.5);
    stringGroup.add(string2);

    const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), ironMat);
    arrow.rotation.x = Math.PI / 2;
    arrow.name = 'BallistaArrow';
    arrow.position.set(0, 2.5, -1);
    group.add(arrow);

    const times = [0, 1, 1.2, 3];
    
    const qLeft0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/8);
    const qLeft1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/3);
    const qLeft2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/8);
    
    const qRight0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/8);
    const qRight1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/3);
    const qRight2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/8);

    const trackLeft = new THREE.QuaternionKeyframeTrack('BallistaLeftArm.quaternion', times, [
        ...qLeft0.toArray(), ...qLeft1.toArray(), ...qLeft2.toArray(), ...qLeft0.toArray()
    ]);
    const trackRight = new THREE.QuaternionKeyframeTrack('BallistaRightArm.quaternion', times, [
        ...qRight0.toArray(), ...qRight1.toArray(), ...qRight2.toArray(), ...qRight0.toArray()
    ]);

    const trackString = new THREE.VectorKeyframeTrack('BallistaString.position', times, [
        0,0,0,  0,0,1,  0,0,-0.5,  0,0,0
    ]);
    
    const trackArrow = new THREE.VectorKeyframeTrack('BallistaArrow.position', times, [
        0,2.5,-1,  0,2.5,0,  0,2.5,-10,  0,2.5,-1
    ]);
    const trackArrowScale = new THREE.VectorKeyframeTrack('BallistaArrow.scale', times, [
        1,1,1,  1,1,1,  0.01,0.01,0.01,  1,1,1
    ]);

    leftArm.quaternion.copy(qLeft0);
    rightArm.quaternion.copy(qRight0);

    const clip = new THREE.AnimationClip('FireBallista', 3.0, [trackLeft, trackRight, trackString, trackArrow, trackArrowScale]);

    return { group, animationClips: [clip] };
}
