import { getMaterials } from '../utils/materials.js';

export function createPlasmaDrillBit(THREE) {
    const group = new THREE.Group();
    group.name = "PlasmaDrillBit";

    // Attempt to load materials, with safe fallbacks
    let materials = {};
    try {
        materials = getMaterials(THREE) || {};
    } catch (e) {
        console.warn("Could not load materials, using fallbacks.", e);
    }
    
    // Base Drill Body
    const bodyGeometry = new THREE.CylinderGeometry(2, 2, 8, 32);
    const bodyMaterial = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 4;
    group.add(body);

    // Plasma Emitter Nozzle
    const nozzleGeometry = new THREE.ConeGeometry(2, 4, 32);
    const nozzleMaterial = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.4 });
    const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
    nozzle.position.y = -2;
    nozzle.rotation.x = Math.PI;
    group.add(nozzle);

    // Plasma Arc (animated)
    const plasmaGeometry = new THREE.CylinderGeometry(0.5, 0.1, 6, 16);
    // Shift origin so scaling affects the bottom
    plasmaGeometry.translate(0, -3, 0); 
    const plasmaMaterial = materials.plasma || new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const plasma = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
    plasma.position.y = -4;
    group.add(plasma);

    // Animations
    const animationClips = [];
    
    // Spin drill body
    const spinTrack = new THREE.NumberKeyframeTrack(`${group.uuid}.rotation[y]`, [0, 1], [0, Math.PI * 2]);
    animationClips.push(new THREE.AnimationClip('Spin', 1, [spinTrack]));
    
    // Pulsate Plasma arc length
    const pulseTrack = new THREE.NumberKeyframeTrack(`${plasma.uuid}.scale[y]`, [0, 0.5, 1], [1, 1.5, 1]);
    animationClips.push(new THREE.AnimationClip('Pulse', 1, [pulseTrack]));

    return { group, animationClips };
}
