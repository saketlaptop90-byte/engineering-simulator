import { steel, orangeAccent, glass, lead } from '../utils/materials.js';

export function createTremiePipeSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Water
    const waterGeo = new THREE.BoxGeometry(20, 15, 20);
    const water = new THREE.Mesh(waterGeo, glass);
    water.position.set(0, 7.5, 0);
    group.add(water);

    // Tremie Pipe
    const pipeGroup = new THREE.Group();
    pipeGroup.position.set(0, 0, 0);

    const pipeGeo = new THREE.CylinderGeometry(0.5, 0.5, 18, 16);
    const pipe = new THREE.Mesh(pipeGeo, steel);
    pipe.position.set(0, 9, 0);
    pipeGroup.add(pipe);

    const hopperGeo = new THREE.ConeGeometry(2, 3, 16, 1, true);
    const hopper = new THREE.Mesh(hopperGeo, orangeAccent);
    hopper.rotation.x = Math.PI;
    hopper.position.set(0, 19.5, 0);
    pipeGroup.add(hopper);

    // Concrete in hopper
    const hopConcGeo = new THREE.ConeGeometry(1.9, 2.8, 16);
    const hopConc = new THREE.Mesh(hopConcGeo, lead);
    hopConc.rotation.x = Math.PI;
    hopConc.position.set(0, 19.5, 0);
    pipeGroup.add(hopConc);

    group.add(pipeGroup);

    // Concrete pour
    const concreteGeo = new THREE.CylinderGeometry(4, 4, 1, 32);
    concreteGeo.translate(0, 0.5, 0);
    const concrete = new THREE.Mesh(concreteGeo, lead);
    concrete.position.set(0, 0, 0);
    concrete.scale.set(1, 0.01, 1);
    group.add(concrete);

    const duration = 10;

    // Concrete scales up
    const cTimes = [0, duration];
    const cValues = [
        1, 0.01, 1,
        1, 8, 1
    ];
    const cTrack = new THREE.VectorKeyframeTrack(`${concrete.uuid}.scale`, cTimes, cValues);

    // Pipe slowly raises
    const pTimes = [0, duration];
    const pValues = [
        0, 0, 0,
        0, 6, 0
    ];
    const pTrack = new THREE.VectorKeyframeTrack(`${pipeGroup.uuid}.position`, pTimes, pValues);

    // Concrete in hopper bobs
    const hcTimes = [0, 2, 2.1, 4, 4.1, 6, 6.1, 8, 8.1, 10];
    const hcScale = [
        1,1,1,
        0.2,0.2,0.2,
        1,1,1,
        0.2,0.2,0.2,
        1,1,1,
        0.2,0.2,0.2,
        1,1,1,
        0.2,0.2,0.2,
        1,1,1,
        0.2,0.2,0.2
    ];
    const hcPos = [
        0, 19.5, 0,
        0, 18.3, 0,
        0, 19.5, 0,
        0, 18.3, 0,
        0, 19.5, 0,
        0, 18.3, 0,
        0, 19.5, 0,
        0, 18.3, 0,
        0, 19.5, 0,
        0, 18.3, 0
    ];
    const hcSTrack = new THREE.VectorKeyframeTrack(`${hopConc.uuid}.scale`, hcTimes, hcScale);
    const hcPTrack = new THREE.VectorKeyframeTrack(`${hopConc.uuid}.position`, hcTimes, hcPos);

    const clip = new THREE.AnimationClip('TremiePour', duration, [
        cTrack, pTrack, hcSTrack, hcPTrack
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
