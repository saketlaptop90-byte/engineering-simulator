import { aluminum, glass, steel, copper } from '../utils/materials.js';

export function createCupAnemometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.2, 32);
    const base = new THREE.Mesh(baseGeo, steel);
    group.add(base);

    // Mast
    const mastGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const mast = new THREE.Mesh(mastGeo, aluminum);
    mast.position.y = 1;
    group.add(mast);

    // Rotor Assembly (spins)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 2;
    group.add(rotorGroup);

    // Arms and Cups
    const numCups = 3;
    for (let i = 0; i < numCups; i++) {
        const angle = (i / numCups) * Math.PI * 2;
        
        // Arm
        const armGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
        const arm = new THREE.Mesh(armGeo, aluminum);
        arm.rotation.x = Math.PI / 2;
        arm.position.x = (Math.cos(angle) * 0.5);
        arm.position.z = (Math.sin(angle) * 0.5);
        arm.rotation.y = -angle; // Point outward
        rotorGroup.add(arm);

        // Cup
        const cupGeo = new THREE.SphereGeometry(0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const cup = new THREE.Mesh(cupGeo, copper);
        cup.position.x = Math.cos(angle) * 1;
        cup.position.z = Math.sin(angle) * 1;
        cup.rotation.y = -angle + Math.PI / 2;
        rotorGroup.add(cup);
    }

    // Animation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.5);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);
    const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const spinTimes = [0, 0.5, 1, 1.5, 2];
    const spinValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w,
        q5.x, q5.y, q5.z, q5.w
    ];

    const spinTrack = new THREE.QuaternionKeyframeTrack(`${rotorGroup.uuid}.quaternion`, spinTimes, spinValues);
    const spinClip = new THREE.AnimationClip('spin', 2, [spinTrack]);
    animationClips.push(spinClip);

    return { group, animationClips };
}
