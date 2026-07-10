import { getMaterials } from '../utils/materials.js';

export function createGyrotronDrill(THREE) {
    const group = new THREE.Group();
    group.name = "GyrotronDrill";

    let materials = {};
    try {
        materials = getMaterials(THREE) || {};
    } catch (e) {
        console.warn("Could not load materials, using fallbacks.", e);
    }
    
    // Waveguide Tube
    const tubeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
    const tubeMaterial = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7, roughness: 0.1 });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.position.y = 5;
    group.add(tube);

    // Gyrotron Source Emitter Head
    const emitterGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const emitterMaterial = materials.energyCore || new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xaa0000, metalness: 0.2 });
    const emitter = new THREE.Mesh(emitterGeometry, emitterMaterial);
    emitter.position.y = 10;
    group.add(emitter);

    // Cooling Rings
    for (let i = 0; i < 4; i++) {
        const ringGeo = new THREE.TorusGeometry(1.8, 0.2, 16, 50);
        const ringMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = 8 - i * 2;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
    }

    // Millimeter-wave Beam
    const beamGeometry = new THREE.CylinderGeometry(1.2, 1.2, 15, 32);
    beamGeometry.translate(0, -7.5, 0);
    const beamMaterial = materials.beam || new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.y = 0;
    group.add(beam);

    // Animations
    const animationClips = [];
    
    // Beam flicker
    const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
    const opacities = [0.6, 0.9, 0.4, 0.8, 0.5, 0.6];
    const opacityTrack = new THREE.NumberKeyframeTrack(`${beam.uuid}.material.opacity`, times, opacities);
    animationClips.push(new THREE.AnimationClip('Flicker', 0.5, [opacityTrack]));

    // Emitter rotation
    const spinTrack = new THREE.NumberKeyframeTrack(`${emitter.uuid}.rotation[y]`, [0, 2], [0, Math.PI * 2]);
    animationClips.push(new THREE.AnimationClip('Spin', 2, [spinTrack]));

    return { group, animationClips };
}
