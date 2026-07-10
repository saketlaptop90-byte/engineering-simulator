import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createRelaySwitchLogic(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base board
    const boardGeo = new THREE.BoxGeometry(10, 0.5, 6);
    const board = new THREE.Mesh(boardGeo, porcelain);
    group.add(board);

    // Solenoid coil
    const coilGeo = new THREE.CylinderGeometry(1, 1, 3, 32);
    const coil = new THREE.Mesh(coilGeo, copper);
    coil.position.set(-2, 1.75, 0);
    group.add(coil);

    // Iron core
    const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.5, 16);
    const core = new THREE.Mesh(coreGeo, darkSteel);
    core.position.set(-2, 1.75, 0);
    group.add(core);

    // Armature (moving part)
    const armatureGeo = new THREE.BoxGeometry(4, 0.2, 1);
    const armature = new THREE.Mesh(armatureGeo, brass);
    armature.position.set(-1.8, 0, 0); // Offset relative to pivot
    
    // Hinge for armature
    const hingeGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16);
    const hinge = new THREE.Mesh(hingeGeo, darkSteel);
    hinge.rotation.x = Math.PI / 2;
    hinge.position.set(1.8, 3.5, 0);
    
    // Contacts
    const contactBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const contactBase = new THREE.Mesh(contactBaseGeo, brass);
    contactBase.position.set(-2, 4.5, 0);
    group.add(contactBase);

    // Add everything to a pivot to easily animate the armature
    const pivot = new THREE.Group();
    pivot.position.set(1.8, 3.5, 0);
    pivot.add(armature);
    pivot.name = 'Pivot';
    
    group.add(hinge);
    group.add(pivot);

    // Snapping animation (armature pulled to coil, then released)
    const times = [0, 0.2, 0.8, 1];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.15); // Snapped down
    
    const qValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q2.x, q2.y, q2.z, q2.w,
        q1.x, q1.y, q1.z, q1.w
    ];
    
    const track = new THREE.QuaternionKeyframeTrack('Pivot.quaternion', times, qValues);
    const clip = new THREE.AnimationClip('Snap', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
