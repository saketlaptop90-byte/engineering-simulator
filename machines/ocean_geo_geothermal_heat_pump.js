import { steel, copper, darkSteel, glass } from '../utils/materials.js';

export function createGeothermalHeatPump(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Ground platform
    const platformGeom = new THREE.BoxGeometry(10, 0.5, 10);
    const platform = new THREE.Mesh(platformGeom, darkSteel);
    platform.position.y = 0.25;
    group.add(platform);

    // Injection Well (Blue/Cold)
    const injectionWell = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8), steel);
    injectionWell.position.set(-3, -4, 0);
    group.add(injectionWell);

    // Production Well (Red/Hot)
    const prodWell = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8), copper);
    prodWell.position.set(3, -4, 0);
    group.add(prodWell);

    // Heat Exchanger Unit
    const exchangerGeom = new THREE.BoxGeometry(4, 3, 3);
    const exchanger = new THREE.Mesh(exchangerGeom, steel);
    exchanger.position.set(0, 2, 0);
    group.add(exchanger);

    // Pump mechanism
    const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2), darkSteel);
    pumpBody.position.set(-3, 4, 0);
    group.add(pumpBody);

    const pistonGeom = new THREE.CylinderGeometry(0.3, 0.3, 2);
    const piston = new THREE.Mesh(pistonGeom, steel);
    piston.name = "piston";
    piston.position.set(-3, 5, 0);
    group.add(piston);

    // Piping connecting wells to exchanger
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4), steel);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(-1.5, 2, 0);
    group.add(pipe1);

    const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4), copper);
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(1.5, 2, 0);
    group.add(pipe2);

    // Animation (Piston cycling)
    const times = [0, 0.5, 1];
    const posValues = [
        -3, 5, 0,
        -3, 5.8, 0,
        -3, 5, 0
    ];

    const pistonTrack = new THREE.VectorKeyframeTrack(`piston.position`, times, posValues);
    const clip = new THREE.AnimationClip('PumpCycle', 1, [pistonTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
