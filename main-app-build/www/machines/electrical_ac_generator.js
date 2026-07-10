import { materials } from '../utils/materials.js';

export function createACGenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Stator (darkSteel)
    const statorGeometry = new THREE.TubeGeometry(new THREE.EllipseCurve(0,0,3,3,0,Math.PI*2,false,0), 64, 1, 8, false);
    const stator = new THREE.Mesh(statorGeometry, materials.darkSteel);
    stator.rotation.x = Math.PI / 2;
    group.add(stator);

    // Rotor (copper and brass)
    const rotorGroup = new THREE.Group();
    rotorGroup.name = 'rotorGroup';

    const shaftGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const shaft = new THREE.Mesh(shaftGeometry, materials.darkSteel);
    shaft.rotation.z = Math.PI / 2;
    rotorGroup.add(shaft);

    const coilGeometry = new THREE.BoxGeometry(4, 2, 2);
    const coil = new THREE.Mesh(coilGeometry, materials.copper);
    rotorGroup.add(coil);

    const slipRingGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const slipRing1 = new THREE.Mesh(slipRingGeometry, materials.brass);
    slipRing1.position.set(3, 0, 0);
    slipRing1.rotation.z = Math.PI / 2;
    const slipRing2 = new THREE.Mesh(slipRingGeometry, materials.brass);
    slipRing2.position.set(4, 0, 0);
    slipRing2.rotation.z = Math.PI / 2;
    rotorGroup.add(slipRing1);
    rotorGroup.add(slipRing2);

    group.add(rotorGroup);

    // Animation: Rotor spinning
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 2);
    
    const spinTrack = new THREE.QuaternionKeyframeTrack(
        'rotorGroup.quaternion',
        [0, 0.5, 1],
        [q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w]
    );

    const clip = new THREE.AnimationClip('Spinning', 1, [spinTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
