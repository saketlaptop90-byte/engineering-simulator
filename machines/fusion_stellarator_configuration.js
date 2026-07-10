import { materials } from '../utils/materials.js';

export function createStellaratorConfiguration(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Twisted Coils
    const numCoils = 30;
    const coilGroup = new THREE.Group();
    for(let i = 0; i < numCoils; i++) {
        const angle = (i / numCoils) * Math.PI * 2;
        const radius = 6 + Math.sin(angle * 5) * 1.5; 
        const coilGeometry = new THREE.TorusGeometry(radius, 0.5, 16, 50);
        const coil = new THREE.Mesh(coilGeometry, materials.superconductor || new THREE.MeshStandardMaterial({color: 0x4444ff, emissive: 0x111188}));
        coil.position.x = Math.cos(angle) * 5;
        coil.position.z = Math.sin(angle) * 5;
        coil.rotation.y = -angle;
        coil.rotation.x = Math.cos(angle * 5) * 0.5;
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    // Plasma Core
    const plasmaGeometry = new THREE.TorusKnotGeometry(5, 1.5, 200, 32, 5, 3);
    const plasma = new THREE.Mesh(plasmaGeometry, materials.plasma || new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.6}));
    plasma.name = 'stellarator_plasma';
    group.add(plasma);

    // Animation: Plasma rotating along the stellarator twists
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const rotationTrack = new THREE.QuaternionKeyframeTrack(
        'stellarator_plasma.quaternion',
        [0, 2, 4],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );
    const clip = new THREE.AnimationClip('StellaratorSpin', 4, [rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
