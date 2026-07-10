import { materials } from '../utils/materials.js';

export function createUltrasonicScanner(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Controller
    const controllerGeo = new THREE.BoxGeometry(0.5, 0.4, 0.3);
    const controller = new THREE.Mesh(controllerGeo, materials.plastic_grey || new THREE.MeshStandardMaterial({color: 0x888888}));
    controller.position.set(0, 0.2, 0.5);
    group.add(controller);

    const screenGeo = new THREE.PlaneGeometry(0.4, 0.25);
    const screen = new THREE.Mesh(screenGeo, materials.screen || new THREE.MeshStandardMaterial({color: 0x0000ff, emissive: 0x000033}));
    screen.position.set(0, 0.25, 0.651);
    group.add(screen);

    // Cable
    const cableGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 8);
    const cable = new THREE.Mesh(cableGeo, materials.rubber || new THREE.MeshStandardMaterial({color: 0x111111}));
    cable.rotation.x = Math.PI / 2;
    cable.position.set(0, 0.1, 0.1);
    group.add(cable);

    // Transducer Probe
    const probeGroup = new THREE.Group();
    probeGroup.position.set(0, 0.15, -0.3);
    group.add(probeGroup);

    const probeBodyGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 16);
    const probeBody = new THREE.Mesh(probeBodyGeo, materials.metal_dark || new THREE.MeshStandardMaterial({color: 0x333333}));
    probeGroup.add(probeBody);

    // Part being inspected (e.g. pipe segment)
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 32, 1, false, 0, Math.PI);
    const pipe = new THREE.Mesh(pipeGeo, materials.metal_light || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, 0, -0.3);
    group.add(pipe);

    // Animation: Probe scanning along pipe
    const times = [0, 2, 4, 6, 8];
    const probeTrack = new THREE.VectorKeyframeTrack(probeGroup.uuid + '.position', times, [
        -0.4, 0.3, -0.3,
        0.4, 0.3, -0.3,
        0.4, 0.25, -0.2, // move down side
        -0.4, 0.25, -0.2,
        -0.4, 0.3, -0.3
    ]);

    const probeRotTrack = new THREE.QuaternionKeyframeTrack(probeGroup.uuid + '.quaternion', times, [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/6,0,0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/6,0,0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0)).toArray()
    ]);

    const clip = new THREE.AnimationClip('Scan', 8, [probeTrack, probeRotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
