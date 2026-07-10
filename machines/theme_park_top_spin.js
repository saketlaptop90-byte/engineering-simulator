import { steel, redAccent, glass, yellowAccent } from '../utils/materials.js';

export function createTopSpinRide(THREE) {
    const group = new THREE.Group();
    group.name = 'TopSpin';

    // Supports
    const supportGeo = new THREE.BoxGeometry(4, 30, 4);
    
    const leftSupport = new THREE.Mesh(supportGeo, steel);
    leftSupport.position.set(-15, 15, 0);
    group.add(leftSupport);

    const rightSupport = new THREE.Mesh(supportGeo, steel);
    rightSupport.position.set(15, 15, 0);
    group.add(rightSupport);

    // Main Arms
    const mainArmPivot = new THREE.Group();
    mainArmPivot.position.set(0, 25, 0);
    mainArmPivot.name = 'mainArmPivot';
    group.add(mainArmPivot);

    const leftArmGeo = new THREE.BoxGeometry(2, 20, 2);
    const leftArm = new THREE.Mesh(leftArmGeo, redAccent);
    leftArm.position.set(-12, 10, 0);
    mainArmPivot.add(leftArm);

    const rightArm = new THREE.Mesh(leftArmGeo, redAccent);
    rightArm.position.set(12, 10, 0);
    mainArmPivot.add(rightArm);

    // Gondola Pivot
    const gondolaPivot = new THREE.Group();
    gondolaPivot.position.set(0, 20, 0);
    gondolaPivot.name = 'gondolaPivot';
    mainArmPivot.add(gondolaPivot);

    // Gondola
    const gondolaGeo = new THREE.BoxGeometry(24, 4, 6);
    const gondola = new THREE.Mesh(gondolaGeo, yellowAccent);
    gondolaPivot.add(gondola);
    
    // Add seats
    const seatGeo = new THREE.BoxGeometry(1, 1, 1);
    for(let i=0; i<10; i++) {
        const seat = new THREE.Mesh(seatGeo, steel);
        seat.position.set(-10 + i*2.2, 2, 0);
        gondola.add(seat);
    }

    // Animations
    // Main arm spins continuously, gondola spins irregularly
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 3*Math.PI/2);
    
    const armTrack = new THREE.QuaternionKeyframeTrack(
        'mainArmPivot.quaternion',
        [0, 2, 4, 6, 8],
        [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w,
            q1.x, q1.y, q1.z, q1.w
        ]
    );
    
    const gq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const gq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI);
    const gq3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -2*Math.PI);
    
    const gondolaTrack = new THREE.QuaternionKeyframeTrack(
        'gondolaPivot.quaternion',
        [0, 1.5, 3, 5.5, 8],
        [
            gq1.x, gq1.y, gq1.z, gq1.w,
            gq2.x, gq2.y, gq2.z, gq2.w,
            gq3.x, gq3.y, gq3.z, gq3.w,
            gq2.x, gq2.y, gq2.z, gq2.w,
            gq1.x, gq1.y, gq1.z, gq1.w
        ]
    );

    const clip = new THREE.AnimationClip('TopSpinSequence', 8, [armTrack, gondolaTrack]);

    return { group, animationClips: [clip] };
}
