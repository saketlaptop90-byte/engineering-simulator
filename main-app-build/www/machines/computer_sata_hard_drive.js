import { metalMaterial, plasticMaterial, ledMaterial, copperMaterial } from '../utils/materials.js';

export function createSATAHardDrivePlatterSpin(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // HDD Base / Chassis
    const baseGeo = new THREE.BoxGeometry(10, 2, 15);
    const base = new THREE.Mesh(baseGeo, metalMaterial);
    group.add(base);

    // Magnetic Platter
    const platterGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.1, 32);
    const platter = new THREE.Mesh(platterGeo, metalMaterial);
    platter.position.set(0, 1.1, -1);
    platter.name = 'platter';
    group.add(platter);

    // Spindle Hub
    const spindleGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const spindle = new THREE.Mesh(spindleGeo, copperMaterial);
    spindle.position.set(0, 1.15, -1);
    group.add(spindle);

    // Read/Write Actuator Arm Assembly
    const armGroup = new THREE.Group();
    armGroup.position.set(-3.5, 1.2, 5);
    armGroup.name = 'actuator_arm';
    
    // Arm Extender
    const armGeo = new THREE.BoxGeometry(1, 0.1, 6);
    const arm = new THREE.Mesh(armGeo, metalMaterial);
    arm.position.set(0, 0, -3); // Offset so the group's origin acts as a pivot
    armGroup.add(arm);

    // Read/Write Head
    const headGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const head = new THREE.Mesh(headGeo, copperMaterial);
    head.position.set(0, -0.05, -6);
    armGroup.add(head);

    group.add(armGroup);

    // Animation 1: Platter continuous spin
    const t = [0, 0.25, 0.5, 0.75, 1];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const platterVals = [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()
    ];
    const platterTrack = new THREE.QuaternionKeyframeTrack('platter.quaternion', t, platterVals);

    // Animation 2: Actuator arm sweeping back and forth over the platter
    const armT = [0, 0.2, 0.4, 0.6, 0.8, 1];
    const a0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const a1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.2);
    const a2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.5); // Over the inner tracks
    const a3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.1);
    const a4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.4);
    
    const armVals = [
        ...a0.toArray(), ...a1.toArray(), ...a2.toArray(), ...a3.toArray(), ...a4.toArray(), ...a0.toArray()
    ];
    const armTrack = new THREE.QuaternionKeyframeTrack('actuator_arm.quaternion', armT, armVals);

    const clip = new THREE.AnimationClip('HDD_Operation', 1, [platterTrack, armTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
