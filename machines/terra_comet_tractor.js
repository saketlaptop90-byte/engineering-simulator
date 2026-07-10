import { darkSteel, aluminum, glass } from '../utils/materials.js';

export function createCometTractor(THREE) {
    const group = new THREE.Group();
    group.name = 'Terraforming Comet Tractor';

    // Main Engine Block
    const engineGeom = new THREE.BoxGeometry(4, 4, 12);
    const engine = new THREE.Mesh(engineGeom, darkSteel);
    group.add(engine);

    // Tractor Beams Emitters
    const emitters = new THREE.Group();
    emitters.position.z = 6;
    
    for(let i=0; i<4; i++) {
        const emitterGeom = new THREE.CylinderGeometry(0.5, 1, 2, 8);
        const emitter = new THREE.Mesh(emitterGeom, aluminum);
        emitter.position.set(
            (i % 2 === 0 ? 1.5 : -1.5),
            (i < 2 ? 1.5 : -1.5),
            1
        );
        emitter.rotation.x = Math.PI / 2;
        emitters.add(emitter);
    }
    group.add(emitters);

    // Cockpit
    const cockpitGeom = new THREE.SphereGeometry(2, 16, 16);
    const cockpit = new THREE.Mesh(cockpitGeom, glass);
    cockpit.position.set(0, 3, 4);
    group.add(cockpit);

    // Thruster Flare
    const flareGeom = new THREE.CylinderGeometry(1, 2, 4, 16);
    const flare = new THREE.Mesh(flareGeom, glass); // Using glass to simulate energy
    flare.position.z = -8;
    flare.rotation.x = Math.PI / 2;
    flare.name = 'EngineFlare';
    group.add(flare);

    // Animation: Pulsing engine flare
    const times = [0, 0.5, 1];
    const scaleValues = [
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1
    ];
    const flareTrack = new THREE.VectorKeyframeTrack('EngineFlare.scale', times, scaleValues);

    const clip = new THREE.AnimationClip('TractorBeamActive', 1, [flareTrack]);

    return { group, animationClips: [clip] };
}
