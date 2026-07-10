import { titanium, gold, glass } from '../utils/materials.js';

export function createAntimatterRocket(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main hull
    const hullGeo = new THREE.CylinderGeometry(3, 3, 30, 32);
    const hull = new THREE.Mesh(hullGeo, titanium);
    group.add(hull);

    // Containment field (glass)
    const fieldGeo = new THREE.SphereGeometry(4, 32, 32);
    const field = new THREE.Mesh(fieldGeo, glass);
    field.position.y = -10;
    group.add(field);

    // Antimatter core
    const coreGeo = new THREE.SphereGeometry(1, 16, 16);
    const core = new THREE.Mesh(coreGeo, gold);
    core.position.y = -10;
    group.add(core);

    // Animation: Pulsing antimatter core
    const scaleTrack = new THREE.VectorKeyframeTrack(
        core.uuid + '.scale',
        [0, 1, 2],
        [1, 1, 1,  1.5, 1.5, 1.5,  1, 1, 1]
    );

    const clip = new THREE.AnimationClip('AntimatterPulse', -1, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
