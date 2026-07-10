import { aluminum, glass, plastic, redAccent } from '../utils/materials.js';

export function createEspressoMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(3, 4, 3);
    const body = new THREE.Mesh(bodyGeo, redAccent);
    body.position.y = 2;
    group.add(body);

    // Group Head
    const headGeo = new THREE.CylinderGeometry(0.5, 0.5, 1);
    const head = new THREE.Mesh(headGeo, aluminum);
    head.position.set(0, 3, 1.5);
    group.add(head);

    // Portafilter
    const portGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.3);
    const port = new THREE.Mesh(portGeo, plastic);
    port.position.set(0, 2.4, 1.5);
    group.add(port);

    // Drip Tray
    const trayGeo = new THREE.BoxGeometry(3, 0.2, 2);
    const tray = new THREE.Mesh(trayGeo, aluminum);
    tray.position.set(0, 0.1, 1.5);
    group.add(tray);

    // Cup
    const cupGeo = new THREE.CylinderGeometry(0.3, 0.2, 0.5);
    const cup = new THREE.Mesh(cupGeo, glass);
    cup.position.set(0, 0.45, 1.5);
    group.add(cup);

    // Espresso Stream
    const streamGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const streamMat = new THREE.MeshBasicMaterial({color: 0x3b2818});
    const stream = new THREE.Mesh(streamGeo, streamMat);
    stream.name = 'EspressoStream';
    // Position it so it grows downwards
    stream.geometry.translate(0, -0.5, 0);
    stream.position.set(0, 2.25, 1.5);
    stream.scale.y = 0.01;
    group.add(stream);

    // Animation
    const times = [0, 0.5, 2.5, 3];
    const scaleValues = [
        1, 0.01, 1,
        1, 1.8, 1,
        1, 1.8, 1,
        1, 0.01, 1
    ];
    const track = new THREE.VectorKeyframeTrack('EspressoStream.scale', times, scaleValues);
    const clip = new THREE.AnimationClip('Pouring', 3, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
