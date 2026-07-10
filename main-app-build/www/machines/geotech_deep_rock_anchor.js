import { materials } from '../utils/materials.js';

export function createDeepRockAnchorMechanism(THREE) {
    const group = new THREE.Group();
    group.name = "DeepRockAnchor";
    const animationClips = [];

    // Support structure
    const supportGeo = new THREE.BoxGeometry(2, 2, 2);
    const support = new THREE.Mesh(supportGeo, materials.metal);
    support.position.y = 1;
    group.add(support);

    // Drilling pipe
    const pipeGroup = new THREE.Group();
    pipeGroup.position.set(0, 1, 0);
    pipeGroup.rotation.x = -Math.PI / 4; // Angle downwards
    
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
    const pipe = new THREE.Mesh(pipeGeo, materials.metal);
    pipe.name = "Pipe";
    pipe.position.y = -5;
    pipeGroup.add(pipe);

    // Anchor arms (deploying outwards at the end of the pipe)
    const armGeo = new THREE.BoxGeometry(0.1, 1, 0.2);
    
    const arm1 = new THREE.Mesh(armGeo, materials.metal);
    arm1.name = "Arm1";
    arm1.position.set(0.15, -9.5, 0);
    pipeGroup.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, materials.metal);
    arm2.name = "Arm2";
    arm2.position.set(-0.15, -9.5, 0);
    pipeGroup.add(arm2);

    group.add(pipeGroup);

    // Animation: Pipe rotates and inserts, then arms deploy
    const duration = 6;
    
    const pipeMoveTimes = [0, 3];
    const pipeMoveValues = [-5, -10];
    const pipeMoveTrack = new THREE.NumberKeyframeTrack("Pipe.position[y]", pipeMoveTimes, pipeMoveValues);

    const arm1MoveTrack = new THREE.NumberKeyframeTrack("Arm1.position[y]", pipeMoveTimes, [-9.5, -14.5]);
    const arm2MoveTrack = new THREE.NumberKeyframeTrack("Arm2.position[y]", pipeMoveTimes, [-9.5, -14.5]);

    // Arms deploying (rotation)
    const deployTimes = [3, 4];
    
    const q1Start = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1End = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/3);
    const arm1RotTrack = new THREE.QuaternionKeyframeTrack("Arm1.quaternion", deployTimes, [q1Start.x, q1Start.y, q1Start.z, q1Start.w, q1End.x, q1End.y, q1End.z, q1End.w]);

    const q2Start = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2End = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/3);
    const arm2RotTrack = new THREE.QuaternionKeyframeTrack("Arm2.quaternion", deployTimes, [q2Start.x, q2Start.y, q2Start.z, q2Start.w, q2End.x, q2End.y, q2End.z, q2End.w]);

    const deployClip = new THREE.AnimationClip("Deploy", duration, [pipeMoveTrack, arm1MoveTrack, arm2MoveTrack, arm1RotTrack, arm2RotTrack]);
    animationClips.push(deployClip);

    return { group, animationClips };
}
