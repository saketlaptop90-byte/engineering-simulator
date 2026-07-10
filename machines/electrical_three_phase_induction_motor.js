import * as materials from '../utils/materials.js';

export function createThreePhaseInductionMotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const ironMaterial = materials.iron || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.6 });
    const copperMaterial = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.4 });
    const steelMaterial = materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });

    // Stator housing
    const statorGeo = new THREE.CylinderGeometry(2, 2, 4, 32, 1, false, 0, Math.PI * 1.5); // Open a bit to see inside
    const stator = new THREE.Mesh(statorGeo, ironMaterial);
    stator.rotation.z = Math.PI / 2;
    stator.position.y = 2;
    group.add(stator);

    // Stator windings
    const windingGeo = new THREE.TorusGeometry(1.8, 0.15, 16, 50);
    for (let i = -1.5; i <= 1.5; i += 0.5) {
        const winding = new THREE.Mesh(windingGeo, copperMaterial);
        winding.rotation.y = Math.PI / 2;
        winding.position.set(i, 2, 0);
        group.add(winding);
    }

    // Rotor & Shaft
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 2;
    
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    const shaft = new THREE.Mesh(shaftGeo, steelMaterial);
    shaft.rotation.z = Math.PI / 2;
    rotorGroup.add(shaft);

    const rotorCoreGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const rotorCore = new THREE.Mesh(rotorCoreGeo, ironMaterial);
    rotorCore.rotation.z = Math.PI / 2;
    rotorGroup.add(rotorCore);

    group.add(rotorGroup);

    // Animation: Rotor spinning
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);

    const rotationTrack = new THREE.QuaternionKeyframeTrack(
        rotorGroup.uuid + '.quaternion',
        [0, 0.5, 1],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const clip = new THREE.AnimationClip('MotorSpin', 1, [rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
