import * as materials from '../utils/materials.js';

export function createRotationalMoldingArm(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeom = new THREE.CylinderGeometry(1.5, 2, 1, 32);
    const base = new THREE.Mesh(baseGeom, materials.castIron);
    base.position.y = 0.5;
    group.add(base);

    const pillarGeom = new THREE.BoxGeometry(1, 4, 1);
    const pillar = new THREE.Mesh(pillarGeom, materials.steel);
    pillar.position.y = 3;
    group.add(pillar);

    // Primary Arm (Rotates on X axis)
    const primaryArm = new THREE.Group();
    primaryArm.position.y = 4.5;
    primaryArm.name = 'primaryArm';
    group.add(primaryArm);

    const arm1Geom = new THREE.CylinderGeometry(0.3, 0.3, 5, 16);
    arm1Geom.rotateZ(Math.PI / 2);
    const arm1 = new THREE.Mesh(arm1Geom, materials.blueAccent);
    arm1.position.x = 2.5;
    primaryArm.add(arm1);

    // Secondary Arm (Rotates on Y/Z axis relative to primary)
    const secondaryArm = new THREE.Group();
    secondaryArm.position.x = 5; // at the end of primary arm
    secondaryArm.name = 'secondaryArm';
    primaryArm.add(secondaryArm);

    const arm2Geom = new THREE.BoxGeometry(0.6, 3, 0.6);
    const arm2 = new THREE.Mesh(arm2Geom, materials.orangeAccent);
    secondaryArm.add(arm2);

    // Mold Chamber
    const moldGeom = new THREE.IcosahedronGeometry(1.2, 1); // Looks faceted, like a multi-part mold
    const mold = new THREE.Mesh(moldGeom, materials.aluminum);
    mold.position.y = 1.5;
    secondaryArm.add(mold);

    // Animations: Bi-axial rotation
    const times = [0, 2, 4];
    
    // Primary rotates 360 on X
    const qPx0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const qPx1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const qPx2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 2);
    const pRotVals = [
        qPx0.x, qPx0.y, qPx0.z, qPx0.w,
        qPx1.x, qPx1.y, qPx1.z, qPx1.w,
        qPx2.x, qPx2.y, qPx2.z, qPx2.w
    ];
    const pTrack = new THREE.QuaternionKeyframeTrack(`primaryArm.quaternion`, times, pRotVals);

    // Secondary rotates 360 * 2 on Z or Y
    const qSy0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const qSy1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    const qSy2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 4);
    const sRotVals = [
        qSy0.x, qSy0.y, qSy0.z, qSy0.w,
        qSy1.x, qSy1.y, qSy1.z, qSy1.w,
        qSy2.x, qSy2.y, qSy2.z, qSy2.w
    ];
    const sTrack = new THREE.QuaternionKeyframeTrack(`secondaryArm.quaternion`, times, sRotVals);

    const clip = new THREE.AnimationClip('Rotomolding', 4, [pTrack, sTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
