import { steel, redAccent, glass, yellowAccent } from '../utils/materials.js';

export function createGiantPendulumRide(THREE) {
    const group = new THREE.Group();
    group.name = 'GiantPendulum';

    // Support structure
    const supportGeo1 = new THREE.CylinderGeometry(1, 2, 40, 8);
    const support1 = new THREE.Mesh(supportGeo1, steel);
    support1.position.set(-15, 20, 0);
    support1.rotation.z = -Math.PI / 8;
    group.add(support1);

    const support2 = new THREE.Mesh(supportGeo1, steel);
    support2.position.set(15, 20, 0);
    support2.rotation.z = Math.PI / 8;
    group.add(support2);

    const crossBarGeo = new THREE.CylinderGeometry(1, 1, 35, 8);
    const crossBar = new THREE.Mesh(crossBarGeo, steel);
    crossBar.position.y = 38;
    crossBar.rotation.z = Math.PI / 2;
    group.add(crossBar);

    // Pendulum Arm
    const pivot = new THREE.Group();
    pivot.position.y = 38;
    pivot.name = 'pendulumPivot';
    group.add(pivot);

    const armGeo = new THREE.CylinderGeometry(0.5, 0.5, 30, 8);
    const arm = new THREE.Mesh(armGeo, redAccent);
    arm.position.y = -15;
    pivot.add(arm);

    // Passenger Gondola
    const gondolaPivot = new THREE.Group();
    gondolaPivot.position.y = -30;
    gondolaPivot.name = 'gondolaPivot';
    pivot.add(gondolaPivot);

    const gondolaGeo = new THREE.TorusGeometry(5, 1, 16, 32);
    const gondola = new THREE.Mesh(gondolaGeo, yellowAccent);
    gondola.rotation.x = Math.PI / 2;
    gondolaPivot.add(gondola);

    // Animation: Swinging of the pendulum pivot, rotating of the gondola
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/1.5);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/1.5);
    
    const quatTrack = new THREE.QuaternionKeyframeTrack(
        'pendulumPivot.quaternion',
        [0, 2.5, 5, 7.5, 10],
        [
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q2.x, q2.y, q2.z, q2.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w
        ]
    );

    const gq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const gq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const gq3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2);

    const gondolaTrack = new THREE.QuaternionKeyframeTrack(
        'gondolaPivot.quaternion',
        [0, 2, 4],
        [
            gq1.x, gq1.y, gq1.z, gq1.w,
            gq2.x, gq2.y, gq2.z, gq2.w,
            gq3.x, gq3.y, gq3.z, gq3.w
        ]
    );

    const swingClip = new THREE.AnimationClip('SwingSequence', 10, [quatTrack]);
    const spinClip = new THREE.AnimationClip('SpinSequence', 4, [gondolaTrack]);

    return { group, animationClips: [swingClip, spinClip] };
}
