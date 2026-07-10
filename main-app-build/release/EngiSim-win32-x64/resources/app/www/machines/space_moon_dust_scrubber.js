import { aluminum, gold, glass } from '../utils/materials.js';

export function createMoonDustScrubber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base unit
    const baseGeo = new THREE.CylinderGeometry(2, 2.5, 4, 16);
    const base = new THREE.Mesh(baseGeo, aluminum);
    base.position.y = 2;
    group.add(base);

    // Electromagnetic coils
    const coilGroup = new THREE.Group();
    coilGroup.position.y = 4.5;
    group.add(coilGroup);

    const coilGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 32);
    for(let i=0; i<3; i++) {
        const coil = new THREE.Mesh(coilGeo, gold);
        coil.rotation.x = Math.PI / 2;
        coil.position.y = i * 0.8;
        coilGroup.add(coil);
    }

    // Collector Dome
    const domeGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, glass);
    dome.position.y = 6.5;
    group.add(dome);

    // Animation: Scrubber pulsing / hovering coils
    const scaleTrack = `${coilGroup.uuid}.scale`;
    const times = [0, 0.5, 1];
    const values = [1, 1, 1, 1.1, 1.1, 1.1, 1, 1, 1];
    const scaleKF = new THREE.VectorKeyframeTrack(scaleTrack, times, values);

    const clip = new THREE.AnimationClip('PulseEM', 1, [scaleKF]);
    animationClips.push(clip);

    return { group, animationClips };
}
