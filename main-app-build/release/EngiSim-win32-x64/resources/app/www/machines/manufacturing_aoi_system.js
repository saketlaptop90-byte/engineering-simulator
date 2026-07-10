import { steel, whitePlastic, glass, greenPCB, redAccent, darkSteel } from '../utils/materials.js';

export function createAOISystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure / Conveyor
    const baseGeo = new THREE.BoxGeometry(5, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 0.25;
    group.add(base);

    // Hood / Enclosure
    const hoodGeo = new THREE.BoxGeometry(2, 2, 2);
    const hood = new THREE.Mesh(hoodGeo, whitePlastic);
    hood.position.set(0, 1.5, 0);
    group.add(hood);

    // Camera / Optics (Inside hood, visible if glass window added)
    const windowGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const windowMesh = new THREE.Mesh(windowGeo, glass);
    windowMesh.position.set(0, 1.5, 1.01);
    group.add(windowMesh);

    const cameraGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const camera = new THREE.Mesh(cameraGeo, steel);
    camera.rotation.x = Math.PI / 2;
    camera.position.set(0, 1.5, 0.5);
    group.add(camera);

    // Laser/Scan line
    const scanLineGeo = new THREE.BoxGeometry(1.5, 0.05, 0.05);
    const scanLine = new THREE.Mesh(scanLineGeo, redAccent);
    scanLine.position.set(0, 1, 0.5);
    scanLine.name = "ScanLine";
    group.add(scanLine);

    // PCB on conveyor
    const pcbGeo = new THREE.BoxGeometry(1, 0.05, 1);
    const pcb = new THREE.Mesh(pcbGeo, greenPCB);
    pcb.position.set(-2, 0.525, 0);
    pcb.name = "PCB";
    group.add(pcb);

    // Chips on PCB
    const chipGeo = new THREE.BoxGeometry(0.2, 0.05, 0.2);
    const chip1 = new THREE.Mesh(chipGeo, darkSteel);
    chip1.position.set(0.2, 0.05, 0.2);
    pcb.add(chip1);

    const chip2 = new THREE.Mesh(chipGeo, darkSteel);
    chip2.position.set(-0.2, 0.05, -0.2);
    pcb.add(chip2);

    // Animation
    const times = [0, 2, 4, 6];
    
    // PCB moving through
    const pcbPos = [
        -2.5, 0.525, 0,
        0, 0.525, 0,   // pause under camera
        0, 0.525, 0,   // inspecting
        2.5, 0.525, 0
    ];
    const pcbTrack = new THREE.VectorKeyframeTrack(pcb.name + '.position', times, pcbPos);

    // Scan line moving
    const scanTimes = [2, 2.5, 3, 3.5, 4];
    const scanPos = [
        0, 1.5, 0.5,
        0, 1, 0.5,
        0, 0.6, 0.5,
        0, 1, 0.5,
        0, 1.5, 0.5
    ];
    const scanTrack = new THREE.VectorKeyframeTrack(scanLine.name + '.position', scanTimes, scanPos);

    const clip = new THREE.AnimationClip('InspectCycle', 6, [pcbTrack, scanTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
