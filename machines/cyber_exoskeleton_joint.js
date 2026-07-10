import { titanium, copper, darkSteel } from '../utils/materials.js';

export function createExoskeletonJoint(THREE) {
    const group = new THREE.Group();

    const pivotGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32);
    pivotGeometry.rotateX(Math.PI / 2);
    const pivot = new THREE.Mesh(pivotGeometry, titanium);
    group.add(pivot);

    const upperArmGeometry = new THREE.BoxGeometry(0.8, 3, 0.6);
    upperArmGeometry.translate(0, 1.5, 0);
    const upperArm = new THREE.Mesh(upperArmGeometry, darkSteel);
    group.add(upperArm);

    const lowerArmGroup = new THREE.Group();
    lowerArmGroup.name = 'lowerArmGroup';
    const lowerArmGeometry = new THREE.BoxGeometry(0.7, 3, 0.5);
    lowerArmGeometry.translate(0, -1.5, 0);
    const lowerArm = new THREE.Mesh(lowerArmGeometry, darkSteel);
    lowerArmGroup.add(lowerArm);
    
    const wireGeometry = new THREE.TorusGeometry(0.6, 0.05, 8, 24);
    wireGeometry.rotateX(Math.PI / 2);
    const wire1 = new THREE.Mesh(wireGeometry, copper);
    wire1.position.z = 0.3;
    const wire2 = new THREE.Mesh(wireGeometry, copper);
    wire2.position.z = -0.3;
    lowerArmGroup.add(wire1);
    lowerArmGroup.add(wire2);

    group.add(lowerArmGroup);

    const times = [0, 1.5, 3];
    const quaternionStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const quaternionMid = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const quaternionEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

    const values = [
        quaternionStart.x, quaternionStart.y, quaternionStart.z, quaternionStart.w,
        quaternionMid.x, quaternionMid.y, quaternionMid.z, quaternionMid.w,
        quaternionEnd.x, quaternionEnd.y, quaternionEnd.z, quaternionEnd.w
    ];

    const rotationTrack = new THREE.QuaternionKeyframeTrack('lowerArmGroup.quaternion', times, values);
    const clip = new THREE.AnimationClip('ArticulateJoint', 3, [rotationTrack]);

    return { group, animationClips: [clip] };
}
