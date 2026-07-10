import * as materials from '../utils/materials.js';

export function createCentrifugalGovernor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main central shaft
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const shaft = new THREE.Mesh(shaftGeo, materials.steel);
    group.add(shaft);

    // Flyballs
    const ballGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const ball1 = new THREE.Mesh(ballGeo, materials.castIron);
    const ball2 = new THREE.Mesh(ballGeo, materials.castIron);

    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    armGeo.translate(0, -1, 0);

    // Pivot points
    const pivot1 = new THREE.Group();
    pivot1.position.set(0, 2, 0);
    pivot1.rotation.z = Math.PI / 4;
    const arm1 = new THREE.Mesh(armGeo, materials.steel);
    pivot1.add(arm1);
    arm1.add(ball1);
    ball1.position.set(0, -2, 0);
    group.add(pivot1);

    const pivot2 = new THREE.Group();
    pivot2.position.set(0, 2, 0);
    pivot2.rotation.z = -Math.PI / 4;
    const arm2 = new THREE.Mesh(armGeo, materials.steel);
    pivot2.add(arm2);
    arm2.add(ball2);
    ball2.position.set(0, -2, 0);
    group.add(pivot2);

    // Sliding collar
    const collarGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const collar = new THREE.Mesh(collarGeo, materials.brass);
    collar.position.set(0, 0.5, 0);
    group.add(collar);

    // Animation: Spinning and balls flying outward (changing angle)
    const times = [0, 2, 4];
    
    // Spinning the entire group
    const yAxis = new THREE.Vector3(0, 1, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2);
    
    const spinTrack = new THREE.QuaternionKeyframeTrack(
        '.quaternion',
        times,
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w]
    );

    // Arm 1 Angle
    const arm1Q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4);
    const arm1Q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2.5); // Fly out
    const arm1Track = new THREE.QuaternionKeyframeTrack(
        `${pivot1.name}.quaternion`, // Need to give names for tracks to target properly if not using uuid
        times,
        [arm1Q1.x, arm1Q1.y, arm1Q1.z, arm1Q1.w, arm1Q2.x, arm1Q2.y, arm1Q2.z, arm1Q2.w, arm1Q1.x, arm1Q1.y, arm1Q1.z, arm1Q1.w]
    );
    pivot1.name = "Pivot1";

    // Arm 2 Angle
    const arm2Q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 4);
    const arm2Q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2.5); // Fly out
    const arm2Track = new THREE.QuaternionKeyframeTrack(
        `Pivot2.quaternion`,
        times,
        [arm2Q1.x, arm2Q1.y, arm2Q1.z, arm2Q1.w, arm2Q2.x, arm2Q2.y, arm2Q2.z, arm2Q2.w, arm2Q1.x, arm2Q1.y, arm2Q1.z, arm2Q1.w]
    );
    pivot2.name = "Pivot2";

    // Collar sliding up and down
    const collarTrack = new THREE.VectorKeyframeTrack(
        `Collar.position`,
        times,
        [0, 0.5, 0, 0, 1.5, 0, 0, 0.5, 0]
    );
    collar.name = "Collar";

    const clip = new THREE.AnimationClip('OperateGovernor', 4, [spinTrack, arm1Track, arm2Track, collarTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
