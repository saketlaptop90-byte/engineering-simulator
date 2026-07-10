import * as materials from '../utils/materials.js';

export function createEndEffectorGripper(THREE) {
    const group = new THREE.Group();

    const bodyMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x777777 });
    const padMat = materials.plasticMaterial || new THREE.MeshStandardMaterial({ color: 0x222222 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMat);
    group.add(base);

    const leftFinger = new THREE.Group();
    leftFinger.name = 'LeftFinger';
    leftFinger.position.set(-0.5, 0.5, 0);
    group.add(leftFinger);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 0.8), bodyMat);
    leftArm.position.y = 0.75;
    leftFinger.add(leftArm);

    const leftPad = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.6), padMat);
    leftPad.position.set(0.15, 1, 0);
    leftFinger.add(leftPad);

    const rightFinger = new THREE.Group();
    rightFinger.name = 'RightFinger';
    rightFinger.position.set(0.5, 0.5, 0);
    group.add(rightFinger);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 0.8), bodyMat);
    rightArm.position.y = 0.75;
    rightFinger.add(rightArm);

    const rightPad = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.6), padMat);
    rightPad.position.set(-0.15, 1, 0);
    rightFinger.add(rightPad);

    const times = [0, 1, 2];
    const leftRot = [0, 0.2, 0];
    const rightRot = [0, -0.2, 0];

    const leftTrack = new THREE.NumberKeyframeTrack(leftFinger.name + '.rotation[z]', times, leftRot);
    const rightTrack = new THREE.NumberKeyframeTrack(rightFinger.name + '.rotation[z]', times, rightRot);

    const clip = new THREE.AnimationClip('grip', 2, [leftTrack, rightTrack]);

    return { group, animationClips: [clip] };
}
