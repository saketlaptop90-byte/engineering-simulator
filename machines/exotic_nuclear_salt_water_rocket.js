import { titanium, gold, glass } from '../utils/materials.js';

export function createNuclearSaltWaterRocket(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Reaction chamber
    const chamberGeo = new THREE.CylinderGeometry(5, 2, 15, 32);
    const chamber = new THREE.Mesh(chamberGeo, titanium);
    group.add(chamber);

    // Exhaust nozzle
    const nozzleGeo = new THREE.CylinderGeometry(2, 6, 10, 32);
    const nozzle = new THREE.Mesh(nozzleGeo, titanium);
    nozzle.position.y = -12.5;
    group.add(nozzle);

    // Exhaust glow
    const glowGeo = new THREE.CylinderGeometry(5, 10, 15, 32);
    const glow = new THREE.Mesh(glowGeo, glass);
    glow.position.y = -25;
    group.add(glow);

    // Animation: Exhaust flickering/pulsing
    const scaleTrack = new THREE.VectorKeyframeTrack(
        glow.uuid + '.scale',
        [0, 0.5, 1],
        [1, 1, 1,  1.2, 1.2, 1.2,  1, 1, 1]
    );

    const clip = new THREE.AnimationClip('ExhaustFlicker', -1, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
