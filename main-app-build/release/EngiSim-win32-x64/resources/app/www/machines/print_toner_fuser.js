import { materials } from '../utils/materials.js';

export function createTonerFuser(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const rollerGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 32);
    
    // Heat Roller Group
    const heatGroup = new THREE.Group();
    heatGroup.name = "HeatRoller";
    heatGroup.position.set(0, 1.5, 0);
    group.add(heatGroup);

    const heatRollerMat = materials?.copper || new THREE.MeshStandardMaterial({color: 0xb87333});
    const heatRoller = new THREE.Mesh(rollerGeo, heatRollerMat);
    heatRoller.rotation.x = Math.PI / 2;
    heatGroup.add(heatRoller);

    // Pressure Roller Group
    const pressureGroup = new THREE.Group();
    pressureGroup.name = "PressureRoller";
    pressureGroup.position.set(0, 0.7, 0);
    group.add(pressureGroup);

    const pressureRollerMat = materials?.rubber || new THREE.MeshStandardMaterial({color: 0x222222});
    const pressureRoller = new THREE.Mesh(rollerGeo, pressureRollerMat);
    pressureRoller.rotation.x = Math.PI / 2;
    pressureGroup.add(pressureRoller);

    // Paper
    const paperGeo = new THREE.PlaneGeometry(2, 3);
    const paperMat = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.name = "Paper";
    paper.rotation.x = Math.PI / 2;
    group.add(paper);

    // Animations
    const times = [0, 1, 2];
    
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);
    
    const q0_rev = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1_rev = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI);
    const q2_rev = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI * 2);

    const valuesHeat = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ];
    
    const valuesPressure = [
        q0_rev.x, q0_rev.y, q0_rev.z, q0_rev.w,
        q1_rev.x, q1_rev.y, q1_rev.z, q1_rev.w,
        q2_rev.x, q2_rev.y, q2_rev.z, q2_rev.w
    ];

    const trackHeat = new THREE.QuaternionKeyframeTrack('HeatRoller.quaternion', times, valuesHeat);
    const trackPressure = new THREE.QuaternionKeyframeTrack('PressureRoller.quaternion', times, valuesPressure);
    
    const paperTimes = [0, 2];
    const paperPos = [0, 1.1, 2,  0, 1.1, -2]; // Move along Z
    const trackPaper = new THREE.VectorKeyframeTrack('Paper.position', paperTimes, paperPos);

    const clip = new THREE.AnimationClip('fuse', 2, [trackHeat, trackPressure, trackPaper]);
    animationClips.push(clip);

    return { group, animationClips };
}
