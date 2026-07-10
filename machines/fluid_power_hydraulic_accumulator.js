import { steel, rubber, blueAccent, tinted, glass } from '../utils/materials.js';

export function createHydraulicAccumulator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer Shell
    const shellGeo = new THREE.CapsuleGeometry(2, 4, 16, 32);
    const shellMat = glass.clone();
    shellMat.opacity = 0.4;
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    // Top gas valve
    const valveGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const valve = new THREE.Mesh(valveGeo, steel);
    valve.position.y = 4;
    group.add(valve);

    // Bottom fluid port
    const portGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const port = new THREE.Mesh(portGeo, steel);
    port.position.y = -4;
    group.add(port);

    // Rubber Bladder (contains nitrogen gas)
    const bladderGeo = new THREE.CapsuleGeometry(1.8, 3, 16, 32);
    const bladder = new THREE.Mesh(bladderGeo, rubber);
    bladder.position.y = 0.5; // Starts filling the upper part
    group.add(bladder);

    // Fluid (Hydraulic oil)
    const fluidMat = tinted(glass, 0xaa2222);
    const fluidGeo = new THREE.CylinderGeometry(1.9, 1.9, 1, 32);
    const fluid = new THREE.Mesh(fluidGeo, fluidMat);
    fluid.position.y = -2.5;
    group.add(fluid);

    // Animations:
    // Bladder scale Y from 1 to 0.4 and back
    const bladderScaleTrack = new THREE.VectorKeyframeTrack(
        bladder.uuid + '.scale',
        [0, 2, 4],
        [
            1, 1, 1,
            1, 0.4, 1,
            1, 1, 1
        ]
    );

    // Bladder position Y moves up to keep top attached
    const bladderPosTrack = new THREE.VectorKeyframeTrack(
        bladder.uuid + '.position',
        [0, 2, 4],
        [
            0.5, 0, 0,
            2.0, 0, 0,
            0.5, 0, 0
        ]
    );

    // Fluid scale Y grows
    const fluidScaleTrack = new THREE.VectorKeyframeTrack(
        fluid.uuid + '.scale',
        [0, 2, 4],
        [
            1, 0.2, 1,
            1, 4.0, 1,
            1, 0.2, 1
        ]
    );

    // Fluid position Y shifts up
    const fluidPosTrack = new THREE.VectorKeyframeTrack(
        fluid.uuid + '.position',
        [0, 2, 4],
        [
            -3.5, 0, 0,
            -1.0, 0, 0,
            -3.5, 0, 0
        ]
    );

    const clip = new THREE.AnimationClip('AccumulatorCycle', 4, [
        bladderScaleTrack, bladderPosTrack, fluidScaleTrack, fluidPosTrack
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
