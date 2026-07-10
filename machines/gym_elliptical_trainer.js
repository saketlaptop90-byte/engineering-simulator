import { darkSteel, steel, rubber, plastic } from '../utils/materials.js';

export function createEllipticalTrainer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Frame
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 1.8), darkSteel);
    base.position.set(0, 0.05, 0);
    group.add(base);

    // Flywheel Housing (Rear)
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32), plastic);
    housing.rotation.z = Math.PI / 2;
    housing.position.set(0, 0.35, 0.6);
    group.add(housing);

    // Central Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5), darkSteel);
    mast.position.set(0, 0.8, -0.6);
    mast.rotation.x = -Math.PI / 16;
    group.add(mast);

    // Console
    const consoleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), plastic);
    consoleMesh.position.set(0, 1.6, -0.7);
    consoleMesh.rotation.x = -Math.PI / 4;
    group.add(consoleMesh);

    // Pedals and Handles
    const leftPedalArm = new THREE.Group();
    const rightPedalArm = new THREE.Group();

    const handlePivotY = 1.2;
    const handlePivotZ = -0.6;
    leftPedalArm.position.set(-0.2, handlePivotY, handlePivotZ);
    rightPedalArm.position.set(0.2, handlePivotY, handlePivotZ);

    const handleLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4), steel);
    handleLeft.position.y = 0; 
    leftPedalArm.add(handleLeft);

    const handleRight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4), steel);
    handleRight.position.y = 0;
    rightPedalArm.add(handleRight);

    group.add(leftPedalArm);
    group.add(rightPedalArm);

    // Animation: Scissoring motion for handles
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/6, 0, 0)).toArray();
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/6, 0, 0)).toArray();
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/6, 0, 0)).toArray();

    const leftHandleTrack = new THREE.QuaternionKeyframeTrack(
        `${leftPedalArm.uuid}.quaternion`,
        [0, 1, 2],
        [...q1, ...q2, ...q3]
    );

    const rightHandleTrack = new THREE.QuaternionKeyframeTrack(
        `${rightPedalArm.uuid}.quaternion`,
        [0, 1, 2],
        [...q2, ...q1, ...q2]
    );

    const clip = new THREE.AnimationClip('EllipticalMotion', 2, [leftHandleTrack, rightHandleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
