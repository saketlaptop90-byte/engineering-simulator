import { materials } from '../utils/materials.js';

export function createPaperFolder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Rollers
    const rollerGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const rollerMat = materials?.rubber || new THREE.MeshStandardMaterial({color: 0x222222});
    
    const rGroup1 = new THREE.Group();
    rGroup1.position.set(-0.35, 1, 0);
    rGroup1.name = "Roller1";
    group.add(rGroup1);

    const roller1 = new THREE.Mesh(rollerGeo, rollerMat);
    roller1.rotation.x = Math.PI / 2;
    rGroup1.add(roller1);

    const rGroup2 = new THREE.Group();
    rGroup2.position.set(0.35, 1, 0);
    rGroup2.name = "Roller2";
    group.add(rGroup2);

    const roller2 = new THREE.Mesh(rollerGeo, rollerMat);
    roller2.rotation.x = Math.PI / 2;
    rGroup2.add(roller2);

    // Animate rollers turning using QuaternionKeyframeTrack
    const times = [0, 1, 2];
    
    const q0_1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1_1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q2_1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);
    
    const values1 = [
        q0_1.x, q0_1.y, q0_1.z, q0_1.w,
        q1_1.x, q1_1.y, q1_1.z, q1_1.w,
        q2_1.x, q2_1.y, q2_1.z, q2_1.w
    ];
    
    const q0_2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1_2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI);
    const q2_2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI * 2);

    const values2 = [
        q0_2.x, q0_2.y, q0_2.z, q0_2.w,
        q1_2.x, q1_2.y, q1_2.z, q1_2.w,
        q2_2.x, q2_2.y, q2_2.z, q2_2.w
    ];

    const track1 = new THREE.QuaternionKeyframeTrack('Roller1.quaternion', times, values1);
    const track2 = new THREE.QuaternionKeyframeTrack('Roller2.quaternion', times, values2);
    
    // Paper being folded
    const paperGeo = new THREE.PlaneGeometry(1.5, 2);
    const paperMat = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.name = "Paper";
    paper.rotation.x = Math.PI / 2;
    group.add(paper);

    const paperTimes = [0, 2];
    const paperValues = [0, 2, 0,  0, -1, 0];
    const trackPaper = new THREE.VectorKeyframeTrack('Paper.position', paperTimes, paperValues);

    const clip = new THREE.AnimationClip('fold', 2, [track1, track2, trackPaper]);
    animationClips.push(clip);

    return { group, animationClips };
}
