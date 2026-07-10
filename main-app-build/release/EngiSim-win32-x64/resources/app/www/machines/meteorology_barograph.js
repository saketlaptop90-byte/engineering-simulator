import { aluminum, glass, steel, copper } from '../utils/materials.js';

export function createBarograph(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.2, 1.2);
    const base = new THREE.Mesh(baseGeo, aluminum);
    group.add(base);

    // Glass case
    const caseGeo = new THREE.BoxGeometry(1.9, 1.5, 1.1);
    const glassCase = new THREE.Mesh(caseGeo, glass);
    glassCase.position.y = 0.85;
    group.add(glassCase);

    // Aneroid Cells (Stack of copper cylinders)
    const cellGroup = new THREE.Group();
    cellGroup.position.set(-0.5, 0.2, 0);
    group.add(cellGroup);

    for(let i=0; i<4; i++) {
        const cellGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        const cell = new THREE.Mesh(cellGeo, copper);
        cell.position.y = i * 0.15 + 0.05;
        cellGroup.add(cell);
    }

    // Lever arm
    const armGroup = new THREE.Group();
    armGroup.position.set(-0.5, 0.8, 0);
    group.add(armGroup);

    const armGeo = new THREE.BoxGeometry(1.5, 0.02, 0.02);
    const arm = new THREE.Mesh(armGeo, steel);
    arm.position.x = 0.75;
    armGroup.add(arm);

    // Drum
    const drumGroup = new THREE.Group();
    drumGroup.position.set(0.5, 0.6, 0);
    group.add(drumGroup);

    const drumGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 32);
    const drum = new THREE.Mesh(drumGeo, aluminum);
    drumGroup.add(drum);

    // Animation: slow drum rotation, cell expansion, arm lift
    const dq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const dq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const dq3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const dTimes = [0, 5, 10];
    const dVals = [
        dq1.x, dq1.y, dq1.z, dq1.w,
        dq2.x, dq2.y, dq2.z, dq2.w,
        dq3.x, dq3.y, dq3.z, dq3.w
    ];
    const drumTrack = new THREE.QuaternionKeyframeTrack(`${drumGroup.uuid}.quaternion`, dTimes, dVals);

    // Cell expansion (scale Y)
    const sTimes = [0, 2.5, 5, 7.5, 10];
    const sVals = [
        1, 1, 1, 
        1, 1.2, 1,
        1, 1, 1,
        1, 0.8, 1,
        1, 1, 1
    ];
    const cellTrack = new THREE.VectorKeyframeTrack(`${cellGroup.uuid}.scale`, sTimes, sVals);

    // Arm rotation (follows cell expansion)
    const aq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const aq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.1);
    const aq3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const aq4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.1);

    const aVals = [
        aq1.x, aq1.y, aq1.z, aq1.w,
        aq2.x, aq2.y, aq2.z, aq2.w,
        aq3.x, aq3.y, aq3.z, aq3.w,
        aq4.x, aq4.y, aq4.z, aq4.w,
        aq1.x, aq1.y, aq1.z, aq1.w
    ];
    const armTrack = new THREE.QuaternionKeyframeTrack(`${armGroup.uuid}.quaternion`, sTimes, aVals);

    const recordClip = new THREE.AnimationClip('record', 10, [drumTrack, cellTrack, armTrack]);
    animationClips.push(recordClip);

    return { group, animationClips };
}
