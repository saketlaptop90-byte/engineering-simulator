import { materials } from '../utils/materials.js';

export function createTokamakReactor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Toroidal Field Coils
    const coilGroup = new THREE.Group();
    const coilGeometry = new THREE.TorusGeometry(5, 1.5, 16, 100, Math.PI * 2);
    coilGeometry.scale(1, 1.5, 1);
    
    for(let i = 0; i < 16; i++) {
        const coil = new THREE.Mesh(coilGeometry, materials.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
        coil.rotation.y = (i / 16) * Math.PI * 2;
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    // Plasma
    const plasmaGeometry = new THREE.TorusGeometry(5, 1, 32, 100);
    const plasmaMaterial = materials.plasma || new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.8});
    const plasma = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
    plasma.rotation.x = Math.PI / 2;
    plasma.name = 'plasma_core';
    group.add(plasma);

    // Central Solenoid
    const solenoidGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const solenoid = new THREE.Mesh(solenoidGeo, materials.copper || new THREE.MeshStandardMaterial({color: 0xb87333}));
    group.add(solenoid);

    // Animation: Plasma scaling to simulate confinement pressure changes
    const plasmaScaleTrack = new THREE.VectorKeyframeTrack(
        'plasma_core.scale',
        [0, 1, 2],
        [1, 1, 1, 1.05, 1.05, 1.05, 1, 1, 1]
    );
    const clip = new THREE.AnimationClip('TokamakPlasmaPulse', 2, [plasmaScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
