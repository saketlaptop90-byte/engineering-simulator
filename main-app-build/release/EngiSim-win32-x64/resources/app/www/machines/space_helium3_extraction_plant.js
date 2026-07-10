import { aluminum, gold, glass } from '../utils/materials.js';

export function createHelium3ExtractionPlant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main reactor chamber
    const reactorGeo = new THREE.CylinderGeometry(3, 4, 8, 32);
    const reactor = new THREE.Mesh(reactorGeo, aluminum);
    reactor.position.y = 4;
    group.add(reactor);

    // Containment field (glass)
    const fieldGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const field = new THREE.Mesh(fieldGeo, glass);
    field.position.y = 4;
    group.add(field);

    // Heating coils
    const coilGeo = new THREE.TorusGeometry(3.5, 0.2, 16, 50);
    for (let i = 0; i < 5; i++) {
        const coil = new THREE.Mesh(coilGeo, gold);
        coil.position.y = 2 + i * 1.5;
        coil.rotation.x = Math.PI / 2;
        group.add(coil);
    }

    // Animation: Pulsing containment field
    const scaleTrack = `${field.uuid}.scale`;
    const times = [0, 1, 2];
    const values = [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1];
    const scaleKF = new THREE.VectorKeyframeTrack(scaleTrack, times, values);

    const clip = new THREE.AnimationClip('Pulse', 2, [scaleKF]);
    animationClips.push(clip);

    return { group, animationClips };
}
