import { steelMaterial, aluminumMaterial } from '../utils/materials.js';

export function createWankelRotaryEngine(THREE) {
    const group = new THREE.Group();
    group.name = "WankelEngine";

    // Housing
    const housingGeometry = new THREE.CylinderGeometry(2.5, 2.5, 1, 64);
    const housing = new THREE.Mesh(housingGeometry, steelMaterial || new THREE.MeshStandardMaterial({color: 0x666666, wireframe: true}));
    housing.rotation.x = Math.PI / 2;
    group.add(housing);

    // Rotor (Reuleaux triangle approximation)
    const rotorGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.9, 3);
    const rotor = new THREE.Mesh(rotorGeometry, aluminumMaterial || new THREE.MeshStandardMaterial({color: 0x999999}));
    rotor.name = "Rotor";
    housing.add(rotor);

    // Eccentric shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const shaft = new THREE.Mesh(shaftGeometry, steelMaterial || new THREE.MeshStandardMaterial({color: 0x333333}));
    shaft.name = "Shaft";
    group.add(shaft);

    // Animations
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    // Rotor spins on its own axis slowly
    const rotorTrack = new THREE.QuaternionKeyframeTrack('Rotor.quaternion', [0, 1.5, 3], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    // Rotor orbits the center on the eccentric shaft
    const orbitTrack = new THREE.VectorKeyframeTrack('Rotor.position', [0, 0.75, 1.5, 2.25, 3], [
        0, 0, 0.5,
        0.5, 0, 0,
        0, 0, -0.5,
        -0.5, 0, 0,
        0, 0, 0.5
    ]);

    // Shaft spins faster
    const shaftTrack = new THREE.QuaternionKeyframeTrack('Shaft.quaternion', [0, 0.5, 1], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    const clip = new THREE.AnimationClip("RotaryRun", 3, [rotorTrack, orbitTrack, shaftTrack]);
    return { group, animationClips: [clip] };
}
