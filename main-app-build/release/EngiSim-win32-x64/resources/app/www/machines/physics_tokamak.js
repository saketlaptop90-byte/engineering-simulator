import { materials } from '../utils/materials.js';

export function createTokamak(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Reactor Core
    const coreGeometry = new THREE.TorusGeometry(5, 2, 32, 64);
    const core = new THREE.Mesh(coreGeometry, materials.titanium);
    core.rotation.x = Math.PI / 2;
    group.add(core);

    // Glowing Plasma inside the core
    const plasmaGeometry = new THREE.TorusGeometry(5, 0.8, 16, 64);
    const plasmaMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0xff00ff, 
        emissiveIntensity: 3, 
        transparent: true, 
        opacity: 0.8 
    });
    const plasma = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
    plasma.rotation.x = Math.PI / 2;
    plasma.name = 'TokamakPlasma';
    group.add(plasma);

    // Magnetic Coils
    const coilGeometry = new THREE.TorusGeometry(2.5, 0.3, 16, 32);
    for (let i = 0; i < 16; i++) {
        const coil = new THREE.Mesh(coilGeometry, materials.copper);
        const angle = (i / 16) * Math.PI * 2;
        coil.position.set(Math.cos(angle) * 5, 0, Math.sin(angle) * 5);
        coil.rotation.y = -angle;
        coil.rotation.x = Math.PI / 2;
        group.add(coil);
    }

    // Animation clip for plasma scaling and glowing (pulsing effect)
    const times = [0, 1, 2];
    const scaleValues = [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1];
    const opacityValues = [0.6, 1.0, 0.6];
    
    const scaleTrack = new THREE.VectorKeyframeTrack('TokamakPlasma.scale', times, scaleValues);
    const opacityTrack = new THREE.NumberKeyframeTrack('TokamakPlasma.material.opacity', times, opacityValues);
    
    const clip = new THREE.AnimationClip('PulsePlasma', 2, [scaleTrack, opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
