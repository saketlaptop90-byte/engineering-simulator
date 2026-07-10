import { materials } from '../utils/materials.js';

export function createCartonErector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const frameGeom = new THREE.BoxGeometry(3, 2, 1.5);
    const frame = new THREE.Mesh(frameGeom, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    frame.position.set(0, 1, 0);
    group.add(frame);

    const magGeom = new THREE.BoxGeometry(0.5, 1, 1);
    const mag = new THREE.Mesh(magGeom, materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    mag.position.set(-1, 2.5, 0);
    group.add(mag);

    const armGroup = new THREE.Group();
    armGroup.name = 'vacuumArm';
    armGroup.position.set(-0.5, 2, 0);
    
    const armGeom = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const arm = new THREE.Mesh(armGeom, materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333 }));
    arm.rotation.z = Math.PI / 2;
    arm.position.set(0.5, 0, 0);
    armGroup.add(arm);
    group.add(armGroup);

    const cupGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
    const cup = new THREE.Mesh(cupGeom, materials.rubber || new THREE.MeshStandardMaterial({ color: 0x111111 }));
    cup.position.set(1, 0, 0);
    armGroup.add(cup);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    
    const quatTrack = new THREE.QuaternionKeyframeTrack(
        'vacuumArm.quaternion',
        [0, 1, 2, 3, 4],
        [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q2.x, q2.y, q2.z, q2.w,
            q1.x, q1.y, q1.z, q1.w
        ]
    );

    const clip = new THREE.AnimationClip('ErectAction', 4, [quatTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
