import { steelMaterial, rubberMaterial } from '../utils/materials.js';

export function createCVT(THREE) {
    const group = new THREE.Group();
    group.name = "CVT";

    const pulleyGeometry = new THREE.ConeGeometry(1.5, 1, 32);
    
    // Drive Pulley
    const drivePulleyGrp = new THREE.Group();
    drivePulleyGrp.position.set(-2, 0, 0);
    drivePulleyGrp.name = "DrivePulley";
    
    const driveP1 = new THREE.Mesh(pulleyGeometry, steelMaterial || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    driveP1.rotation.x = Math.PI / 2;
    driveP1.position.z = -0.5;
    driveP1.name = "DriveP1";
    drivePulleyGrp.add(driveP1);

    const driveP2 = new THREE.Mesh(pulleyGeometry, steelMaterial || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    driveP2.rotation.x = -Math.PI / 2;
    driveP2.position.z = 0.5;
    driveP2.name = "DriveP2";
    drivePulleyGrp.add(driveP2);

    group.add(drivePulleyGrp);

    // Driven Pulley
    const drivenPulleyGrp = new THREE.Group();
    drivenPulleyGrp.position.set(2, 0, 0);
    drivenPulleyGrp.name = "DrivenPulley";

    const drivenP1 = new THREE.Mesh(pulleyGeometry, steelMaterial || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    drivenP1.rotation.x = Math.PI / 2;
    drivenP1.position.z = -0.5;
    drivenP1.name = "DrivenP1";
    drivenPulleyGrp.add(drivenP1);

    const drivenP2 = new THREE.Mesh(pulleyGeometry, steelMaterial || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    drivenP2.rotation.x = -Math.PI / 2;
    drivenP2.position.z = 0.5;
    drivenP2.name = "DrivenP2";
    drivenPulleyGrp.add(drivenP2);

    group.add(drivenPulleyGrp);

    // Belt
    const beltGeometry = new THREE.TorusGeometry(2.5, 0.15, 16, 100);
    const belt = new THREE.Mesh(beltGeometry, rubberMaterial || new THREE.MeshStandardMaterial({color: 0x111111}));
    belt.name = "Belt";
    belt.scale.set(1.2, 0.4, 1);
    group.add(belt);

    // Animations: Cones slide to change gear ratio, pulleys rotate
    const dp1Track = new THREE.VectorKeyframeTrack('DriveP1.position', [0, 2, 4], [-2, 0, -0.5, -2, 0, -0.1, -2, 0, -0.5]);
    const dp2Track = new THREE.VectorKeyframeTrack('DriveP2.position', [0, 2, 4], [-2, 0, 0.5, -2, 0, 0.1, -2, 0, 0.5]);

    const drp1Track = new THREE.VectorKeyframeTrack('DrivenP1.position', [0, 2, 4], [2, 0, -0.1, 2, 0, -0.5, 2, 0, -0.1]);
    const drp2Track = new THREE.VectorKeyframeTrack('DrivenP2.position', [0, 2, 4], [2, 0, 0.1, 2, 0, 0.5, 2, 0, 0.1]);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);

    const rotDriveTrack = new THREE.QuaternionKeyframeTrack('DrivePulley.quaternion', [0, 0.5, 1], [
        q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w
    ]);
    const rotDrivenTrack = new THREE.QuaternionKeyframeTrack('DrivenPulley.quaternion', [0, 0.5, 1], [
        q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w
    ]);

    const clip = new THREE.AnimationClip("CVT_Shift", 4, [dp1Track, dp2Track, drp1Track, drp2Track, rotDriveTrack, rotDrivenTrack]);
    return { group, animationClips: [clip] };
}
