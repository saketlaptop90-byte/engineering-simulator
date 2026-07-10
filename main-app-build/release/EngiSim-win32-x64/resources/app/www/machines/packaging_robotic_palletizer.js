import { getMaterials } from '../utils/materials.js';

export function createRoboticPalletizerArm(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Base
    const baseGeo = new THREE.CylinderGeometry(1, 1.5, 1, 32);
    const base = new THREE.Mesh(baseGeo, materials.steel);
    base.position.y = 0.5;
    group.add(base);

    // Shoulder joint (animated using quaternions)
    const shoulderGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const shoulder = new THREE.Mesh(shoulderGeo, materials.aluminum);
    shoulder.position.y = 1;
    shoulder.name = 'shoulder';
    base.add(shoulder);

    // Upper Arm
    const upperArmGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const upperArm = new THREE.Mesh(upperArmGeo, materials.steel);
    upperArm.position.y = 1.5;
    shoulder.add(upperArm);

    // Elbow joint
    const elbowGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const elbow = new THREE.Mesh(elbowGeo, materials.aluminum);
    elbow.position.y = 1.5;
    elbow.name = 'elbow';
    upperArm.add(elbow);

    // Forearm
    const forearmGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 16);
    const forearm = new THREE.Mesh(forearmGeo, materials.steel);
    forearm.position.y = 1.25;
    elbow.add(forearm);

    // Gripper
    const gripperGeo = new THREE.BoxGeometry(1, 0.2, 1);
    const gripper = new THREE.Mesh(gripperGeo, materials.brass);
    gripper.position.y = 1.25;
    forearm.add(gripper);

    // Helper for Quaternions
    function getQuatArray(axis, angles) {
        const arr = [];
        const q = new THREE.Quaternion();
        angles.forEach(angle => {
            q.setFromAxisAngle(axis, angle);
            arr.push(q.x, q.y, q.z, q.w);
        });
        return arr;
    }

    const yAxis = new THREE.Vector3(0, 1, 0);
    const zAxis = new THREE.Vector3(0, 0, 1);

    // Animations
    const shoulderTimes = [0, 2, 4, 6];
    const shoulderQuats = getQuatArray(yAxis, [0, Math.PI / 4, -Math.PI / 4, 0]);
    const shoulderTrack = new THREE.QuaternionKeyframeTrack('shoulder.quaternion', shoulderTimes, shoulderQuats);

    const elbowTimes = [0, 2, 4, 6];
    const elbowQuats = getQuatArray(zAxis, [0, Math.PI / 4, Math.PI / 6, 0]);
    const elbowTrack = new THREE.QuaternionKeyframeTrack('elbow.quaternion', elbowTimes, elbowQuats);

    const armClip = new THREE.AnimationClip('PalletizeAction', 6, [shoulderTrack, elbowTrack]);
    animationClips.push(armClip);

    return { group, animationClips };
}
