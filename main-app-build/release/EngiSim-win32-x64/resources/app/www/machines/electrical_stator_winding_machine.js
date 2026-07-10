import { materials } from '../utils/materials.js';

export function createStatorWindingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const iron = materials?.iron || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.5 });
    const steel = materials?.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const copper = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.5, roughness: 0.5 });
    const machineBodyMat = materials?.machineBody || new THREE.MeshStandardMaterial({ color: 0x2266aa, roughness: 0.6 });

    // Machine Base
    const baseGeom = new THREE.BoxGeometry(10, 2, 10);
    const base = new THREE.Mesh(baseGeom, machineBodyMat);
    base.position.y = -1;
    group.add(base);

    // Stator Core holding mechanism
    const statorCoreGeom = new THREE.TorusGeometry(3, 0.8, 16, 32);
    const statorCore = new THREE.Mesh(statorCoreGeom, iron);
    statorCore.position.y = 4;
    group.add(statorCore);

    // Winding Arm
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 4, 0);
    
    const armGeom = new THREE.BoxGeometry(0.5, 4, 0.5);
    const arm = new THREE.Mesh(armGeom, steel);
    arm.position.y = 2;
    armGroup.add(arm);

    // Wire Guide
    const guideGeom = new THREE.CylinderGeometry(0.2, 0.2, 1);
    const guide = new THREE.Mesh(guideGeom, steel);
    guide.position.set(0, 4, 0.5);
    guide.rotation.x = Math.PI / 2;
    armGroup.add(guide);

    // Spool
    const spoolGeom = new THREE.CylinderGeometry(1, 1, 2, 16);
    const spool = new THREE.Mesh(spoolGeom, copper);
    spool.position.set(-4, 4, -4);
    group.add(spool);

    group.add(armGroup);

    armGroup.name = 'WindingArm';
    statorCore.name = 'StatorCore';
    spool.name = 'Spool';

    // Animations
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 2*Math.PI);
    const armTrack = new THREE.QuaternionKeyframeTrack('WindingArm.quaternion', [0, 0.25, 0.5], [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]);
    
    const sq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const sq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/4);
    const statorTrack = new THREE.QuaternionKeyframeTrack('StatorCore.quaternion', [0, 1], [...sq1.toArray(), ...sq2.toArray()]);

    const spq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const spq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI);
    const spq3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -2*Math.PI);
    const spoolTrack = new THREE.QuaternionKeyframeTrack('Spool.quaternion', [0, 0.25, 0.5], [...spq1.toArray(), ...spq2.toArray(), ...spq3.toArray()]);

    const clip = new THREE.AnimationClip('WindingProcess', 1, [armTrack, statorTrack, spoolTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
