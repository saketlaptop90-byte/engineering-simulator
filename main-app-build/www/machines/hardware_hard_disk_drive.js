import { materials } from '../utils/materials.js';

export function createHardDiskDrive(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 6);
    const baseMesh = new THREE.Mesh(baseGeo, materials.metallic);
    baseMesh.position.y = 0.25;
    group.add(baseMesh);

    // Platter
    const platterGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
    const platterMesh = new THREE.Mesh(platterGeo, materials.shinyMetal || materials.metallic);
    platterMesh.position.set(0, 0.6, -0.5);
    platterMesh.name = 'HDD_Platter';
    group.add(platterMesh);

    // Spindle
    const spindleGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16);
    const spindleMesh = new THREE.Mesh(spindleGeo, materials.darkMetal || materials.metallic);
    spindleMesh.position.set(0, 0.7, -0.5);
    group.add(spindleMesh);

    // Actuator Arm Group
    const armGroup = new THREE.Group();
    armGroup.position.set(1.5, 0.7, 1.5);
    armGroup.name = 'HDD_Arm';
    
    // Arm
    const armGeo = new THREE.BoxGeometry(0.3, 0.1, 2.5);
    const armMesh = new THREE.Mesh(armGeo, materials.metallic);
    armMesh.position.set(0, 0, -1);
    armGroup.add(armMesh);
    
    // Head
    const headGeo = new THREE.BoxGeometry(0.2, 0.15, 0.4);
    const headMesh = new THREE.Mesh(headGeo, materials.darkMetal || materials.metallic);
    headMesh.position.set(0, 0, -2.2);
    armGroup.add(headMesh);
    
    group.add(armGroup);

    // Animations
    // Platter spinning
    const spinQuat0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const spinQuat1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI / 2);
    const spinQuat2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const spinQuat3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 1.5);
    const spinQuat4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const spinTimes = [0, 0.25, 0.5, 0.75, 1];
    const spinValues = [
        ...spinQuat0.toArray(),
        ...spinQuat1.toArray(),
        ...spinQuat2.toArray(),
        ...spinQuat3.toArray(),
        ...spinQuat4.toArray()
    ];
    const spinTrack = new THREE.QuaternionKeyframeTrack('HDD_Platter.quaternion', spinTimes, spinValues);
    const spinClip = new THREE.AnimationClip('Spin', 1, [spinTrack]);
    animationClips.push(spinClip);

    // Arm Seeking
    const seekTimes = [0, 0.5, 1.0, 1.5, 2.0];
    const seekQ0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const seekQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.3);
    const seekQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -0.1);
    const seekQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.4);
    
    const seekValues = [
        ...seekQ0.toArray(),
        ...seekQ1.toArray(),
        ...seekQ2.toArray(),
        ...seekQ3.toArray(),
        ...seekQ0.toArray()
    ];
    const seekTrack = new THREE.QuaternionKeyframeTrack('HDD_Arm.quaternion', seekTimes, seekValues);
    const seekClip = new THREE.AnimationClip('Seek', 2, [seekTrack]);
    animationClips.push(seekClip);

    return { group, animationClips };
}
