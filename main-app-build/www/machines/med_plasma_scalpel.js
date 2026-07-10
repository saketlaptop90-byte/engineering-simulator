import { aluminum, glass, titanium } from '../utils/materials.js';

export function createPlasmaScalpel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.15, 0.1, 1.5, 32);
    const handle = new THREE.Mesh(handleGeo, titanium);
    group.add(handle);

    // Grip texture rings
    for (let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(0.16, 0.02, 8, 32);
        const ring = new THREE.Mesh(ringGeo, aluminum);
        ring.position.y = -0.5 + i * 0.2;
        ring.rotation.x = Math.PI / 2;
        handle.add(ring);
    }

    // Emitter base
    const emitterGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.3, 16);
    const emitter = new THREE.Mesh(emitterGeo, aluminum);
    emitter.position.y = 0.9;
    handle.add(emitter);

    // Plasma Blade (Glass to simulate glowing plasma)
    const bladeGeo = new THREE.ConeGeometry(0.08, 1.2, 16);
    const blade = new THREE.Mesh(bladeGeo, glass);
    blade.position.y = 0.75;
    blade.name = 'PlasmaBlade';
    emitter.add(blade);

    // Add point light for plasma effect
    const plasmaLight = new THREE.PointLight(0x00ffff, 2, 5);
    plasmaLight.position.y = 0.5;
    plasmaLight.name = 'PlasmaLight';
    blade.add(plasmaLight);

    // Animation: Plasma blade pulsating and changing size/intensity
    const scaleTrack = new THREE.NumberKeyframeTrack('PlasmaBlade.scale[y]', [0, 0.2, 0.4, 0.6, 0.8, 1], [1, 1.1, 0.9, 1.2, 0.9, 1]);
    const lightTrack = new THREE.NumberKeyframeTrack('PlasmaLight.intensity', [0, 0.5, 1], [2, 4, 2]);

    const pulseClip = new THREE.AnimationClip('PlasmaPulse', 1, [scaleTrack, lightTrack]);
    animationClips.push(pulseClip);

    return { group, animationClips };
}
