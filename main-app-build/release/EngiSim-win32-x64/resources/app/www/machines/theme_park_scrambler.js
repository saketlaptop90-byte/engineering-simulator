import { steel, redAccent, glass, yellowAccent } from '../utils/materials.js';

export function createScramblerRide(THREE) {
    const group = new THREE.Group();
    group.name = 'ScramblerRide';

    // Center Hub
    const hubGeo = new THREE.CylinderGeometry(3, 3, 4, 16);
    const hub = new THREE.Mesh(hubGeo, redAccent);
    hub.position.y = 2;
    group.add(hub);

    const mainPivot = new THREE.Group();
    mainPivot.name = 'scramblerMainPivot';
    mainPivot.position.y = 2;
    group.add(mainPivot);

    const tracks = [];
    const mainArmCount = 3;
    const subArmCount = 4;

    for (let i = 0; i < mainArmCount; i++) {
        const angle = (i / mainArmCount) * Math.PI * 2;
        
        const mainArmGroup = new THREE.Group();
        mainArmGroup.rotation.y = angle;
        mainPivot.add(mainArmGroup);

        const mainArmGeo = new THREE.BoxGeometry(16, 1, 1);
        const mainArm = new THREE.Mesh(mainArmGeo, steel);
        mainArm.position.set(8, 0, 0);
        mainArmGroup.add(mainArm);

        const subPivot = new THREE.Group();
        subPivot.position.set(16, 0, 0);
        subPivot.name = `scramblerSubPivot_${i}`;
        mainArmGroup.add(subPivot);

        for (let j = 0; j < subArmCount; j++) {
            const subAngle = (j / subArmCount) * Math.PI * 2;
            
            const subArmGroup = new THREE.Group();
            subArmGroup.rotation.y = subAngle;
            subPivot.add(subArmGroup);

            const subArmGeo = new THREE.BoxGeometry(6, 0.5, 0.5);
            const subArm = new THREE.Mesh(subArmGeo, steel);
            subArm.position.set(3, 0, 0);
            subArmGroup.add(subArm);

            const carGeo = new THREE.BoxGeometry(2, 1.5, 1.5);
            const car = new THREE.Mesh(carGeo, yellowAccent);
            car.position.set(6, -0.5, 0);
            subArmGroup.add(car);
        }

        // Sub pivot rotation
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2);
        const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI);
        const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -3*Math.PI/2);

        const subTrack = new THREE.QuaternionKeyframeTrack(
            `scramblerSubPivot_${i}.quaternion`,
            [0, 1, 2, 3, 4],
            [
                q1.x, q1.y, q1.z, q1.w,
                q2.x, q2.y, q2.z, q2.w,
                q3.x, q3.y, q3.z, q3.w,
                q4.x, q4.y, q4.z, q4.w,
                q1.x, q1.y, q1.z, q1.w
            ]
        );
        tracks.push(subTrack);
    }

    // Main pivot rotation
    const mq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const mq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const mq3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const mq4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 3*Math.PI/2);

    const mainTrack = new THREE.QuaternionKeyframeTrack(
        'scramblerMainPivot.quaternion',
        [0, 2, 4, 6, 8],
        [
            mq1.x, mq1.y, mq1.z, mq1.w,
            mq2.x, mq2.y, mq2.z, mq2.w,
            mq3.x, mq3.y, mq3.z, mq3.w,
            mq4.x, mq4.y, mq4.z, mq4.w,
            mq1.x, mq1.y, mq1.z, mq1.w
        ]
    );
    tracks.push(mainTrack);

    const clip = new THREE.AnimationClip('ScramblerSequence', 8, tracks);

    return { group, animationClips: [clip] };
}
