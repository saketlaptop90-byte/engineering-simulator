import { materials } from '../utils/materials.js';

export function createSynchronousCondenser(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const casingMat = materials?.casing || new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.6, roughness: 0.5 });
    const steel = materials?.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 });
    const copper = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.2 });
    const glowMat = materials?.glow || new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });

    // Outer Shell
    const shellGeom = new THREE.CylinderGeometry(6, 6, 14, 32, 1, true);
    const shell = new THREE.Mesh(shellGeom, casingMat);
    shell.rotation.z = Math.PI / 2;
    group.add(shell);

    // Stator interior
    const statorGeom = new THREE.CylinderGeometry(5.8, 5.8, 13, 32);
    const stator = new THREE.Mesh(statorGeom, copper);
    stator.material.wireframe = true;
    stator.rotation.z = Math.PI / 2;
    group.add(stator);

    // Rotor
    const rotorGroup = new THREE.Group();
    const shaftGeom = new THREE.CylinderGeometry(1, 1, 18, 16);
    const shaft = new THREE.Mesh(shaftGeom, steel);
    shaft.rotation.z = Math.PI / 2;
    rotorGroup.add(shaft);

    // Poles
    const poleGeom = new THREE.BoxGeometry(4, 10, 4);
    const pole1 = new THREE.Mesh(poleGeom, steel);
    const pole2 = new THREE.Mesh(poleGeom, steel);
    pole2.rotation.x = Math.PI / 2;
    rotorGroup.add(pole1, pole2);

    // Energy field
    const fieldGeom = new THREE.CylinderGeometry(5, 5, 12, 32);
    const energyField = new THREE.Mesh(fieldGeom, glowMat.clone());
    energyField.rotation.z = Math.PI / 2;
    group.add(energyField);

    group.add(rotorGroup);

    rotorGroup.name = 'CondenserRotor';
    energyField.name = 'EnergyField';

    // Animations
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 2*Math.PI);
    
    const rotorTrack = new THREE.QuaternionKeyframeTrack('CondenserRotor.quaternion', [0, 0.5, 1], [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]);
    const opacityTrack = new THREE.NumberKeyframeTrack('EnergyField.material.opacity', [0, 0.5, 1], [0.2, 0.8, 0.2]);

    const clip = new THREE.AnimationClip('CondenserOperation', 1, [rotorTrack, opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
