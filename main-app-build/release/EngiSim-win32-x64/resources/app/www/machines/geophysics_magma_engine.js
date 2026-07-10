import { darkSteel, copper, titanium } from '../utils/materials.js';

export function createMagmaEngine(THREE) {
    const group = new THREE.Group();
    group.name = "MagmaEngine";

    // Engine Block
    const blockGeo = new THREE.BoxGeometry(6, 4, 4);
    const block = new THREE.Mesh(blockGeo, darkSteel);
    block.position.y = 3;
    group.add(block);

    // Heat sink (bottom)
    const sinkGeo = new THREE.BoxGeometry(8, 1, 6);
    const sink = new THREE.Mesh(sinkGeo, copper);
    sink.position.y = 0.5;
    group.add(sink);

    // Pistons
    const pistons = [];
    for(let i=0; i<2; i++) {
        const pistonGeo = new THREE.CylinderGeometry(1, 1, 3, 16);
        const piston = new THREE.Mesh(pistonGeo, titanium);
        piston.position.set((i === 0 ? 1.5 : -1.5), 6.5, 0);
        group.add(piston);
        pistons.push(piston);
    }

    // Flywheel
    const flywheelGeo = new THREE.CylinderGeometry(3, 3, 1, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, darkSteel);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(0, 4, 3);
    group.add(flywheel);

    // Animations
    const tracks = [];

    // Pistons up and down (alternating)
    tracks.push(new THREE.NumberKeyframeTrack(
        `${pistons[0].uuid}.position[y]`,
        [0, 0.5, 1],
        [6.5, 8.0, 6.5]
    ));
    tracks.push(new THREE.NumberKeyframeTrack(
        `${pistons[1].uuid}.position[y]`,
        [0, 0.5, 1],
        [8.0, 6.5, 8.0]
    ));

    // Flywheel spin
    tracks.push(new THREE.NumberKeyframeTrack(
        `${flywheel.uuid}.rotation[z]`,
        [0, 1],
        [0, -Math.PI * 2]
    ));

    const clip = new THREE.AnimationClip("EngineRun", 1, tracks);

    return { group, animationClips: [clip] };
}
