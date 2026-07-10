import { brass, gold, wood, steel } from '../utils/materials.js';

export function createDraftingAutomaton(THREE) {
    const group = new THREE.Group();

    // Base (Desk)
    const deskGeo = new THREE.BoxGeometry(8, 0.5, 6);
    const desk = new THREE.Mesh(deskGeo, wood);
    group.add(desk);

    // Paper
    const paperGeo = new THREE.PlaneGeometry(4, 3);
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.rotation.x = -Math.PI / 2;
    paper.position.y = 0.26;
    group.add(paper);

    // Main column
    const colGeo = new THREE.CylinderGeometry(0.5, 0.5, 2);
    const column = new THREE.Mesh(colGeo, brass);
    column.position.set(-3, 1, -2);
    group.add(column);

    // Arm 1
    const arm1Pivot = new THREE.Group();
    arm1Pivot.position.set(-3, 2, -2);
    arm1Pivot.name = "Arm1Pivot";
    group.add(arm1Pivot);

    const arm1Geo = new THREE.BoxGeometry(3, 0.2, 0.2);
    const arm1 = new THREE.Mesh(arm1Geo, steel);
    arm1.position.set(1.5, 0, 0);
    arm1Pivot.add(arm1);

    // Arm 2
    const arm2Pivot = new THREE.Group();
    arm2Pivot.position.set(3, 0, 0); // Relative to arm1
    arm2Pivot.name = "Arm2Pivot";
    arm1Pivot.add(arm2Pivot);

    const arm2Geo = new THREE.BoxGeometry(3, 0.2, 0.2);
    const arm2 = new THREE.Mesh(arm2Geo, steel);
    arm2.position.set(1.5, 0, 0);
    arm2Pivot.add(arm2);

    // Pen
    const penGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const pen = new THREE.Mesh(penGeo, gold);
    pen.position.set(3, -0.5, 0);
    arm2Pivot.add(pen);

    // Animation (Drawing shapes)
    const times = [0, 1, 2, 3, 4];
    
    // Arm 1 rotates
    const q1_0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1_1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    const q1_2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1_3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 4);
    
    const arm1Values = [
        q1_0.x, q1_0.y, q1_0.z, q1_0.w,
        q1_1.x, q1_1.y, q1_1.z, q1_1.w,
        q1_2.x, q1_2.y, q1_2.z, q1_2.w,
        q1_3.x, q1_3.y, q1_3.z, q1_3.w,
        q1_0.x, q1_0.y, q1_0.z, q1_0.w
    ];

    // Arm 2 rotates opposite to keep pen moving
    const q2_0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2_1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    const q2_2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2_3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

    const arm2Values = [
        q2_0.x, q2_0.y, q2_0.z, q2_0.w,
        q2_1.x, q2_1.y, q2_1.z, q2_1.w,
        q2_2.x, q2_2.y, q2_2.z, q2_2.w,
        q2_3.x, q2_3.y, q2_3.z, q2_3.w,
        q2_0.x, q2_0.y, q2_0.z, q2_0.w
    ];

    const track1 = new THREE.QuaternionKeyframeTrack('Arm1Pivot.quaternion', times, arm1Values);
    const track2 = new THREE.QuaternionKeyframeTrack('Arm2Pivot.quaternion', times, arm2Values);

    const clip = new THREE.AnimationClip('drafting', 4, [track1, track2]);

    return { group, animationClips: [clip] };
}
