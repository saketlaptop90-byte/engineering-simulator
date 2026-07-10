import * as materials from '../utils/materials.js';

export function createBasebandProcessingUnit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // 19-inch Rack Frame
    const rackGeo = new THREE.BoxGeometry(4.5, 8, 3.5);
    const rack = new THREE.Mesh(rackGeo, materials.darkSteel);
    group.add(rack);

    // Hollow out the front
    const frontCutGeo = new THREE.BoxGeometry(4.2, 7.8, 0.5);
    const frontCut = new THREE.Mesh(frontCutGeo, materials.blackPlastic);
    frontCut.position.set(0, 0, 1.6);
    group.add(frontCut);

    const modules = new THREE.Group();
    group.add(modules);

    const ledTracks = [];
    const fanGroups = [];

    const modGeo = new THREE.BoxGeometry(4, 0.7, 3);
    const faceGeo = new THREE.BoxGeometry(4.1, 0.7, 0.1);
    const portGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const ledGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const fanFrameGeo = new THREE.BoxGeometry(0.5, 0.5, 0.1);
    const hubGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    const bladeGeo = new THREE.BoxGeometry(0.05, 0.2, 0.02);

    for (let y = -3.5; y <= 3.5; y += 0.8) {
        // Module Chassis
        const mod = new THREE.Mesh(modGeo, materials.aluminum);
        mod.position.set(0, y, 0.2);
        modules.add(mod);

        // Front Faceplate
        const face = new THREE.Mesh(faceGeo, materials.steel);
        face.position.set(0, y, 1.7);
        modules.add(face);

        // Fiber Ports
        for (let x = -1.5; x < -0.5; x += 0.3) {
            const port = new THREE.Mesh(portGeo, materials.blackPlastic);
            port.position.set(x, y, 1.75);
            modules.add(port);
        }

        // Status LEDs
        for (let x = 0; x < 1; x += 0.2) {
            const isRed = Math.random() > 0.8;
            const ledMat = isRed ? materials.redAccent : materials.greenAccent;
            const led = new THREE.Mesh(ledGeo, ledMat);
            led.position.set(x, y + 0.1, 1.76);
            modules.add(led);

            const times = [0, 0.2, 0.4, 0.6, 0.8, 1.0].map(t => t + Math.random());
            const values = [
                1, 1, 1,
                0.01, 0.01, 0.01,
                1, 1, 1,
                0.01, 0.01, 0.01,
                1, 1, 1,
                0.01, 0.01, 0.01
            ];
            ledTracks.push(new THREE.NumberKeyframeTrack(`${led.uuid}.scale`, times, values));
        }

        // Cooling fans
        const fanGroup = new THREE.Group();
        fanGroup.position.set(1.5, y, 1.75);
        modules.add(fanGroup);

        const fanFrame = new THREE.Mesh(fanFrameGeo, materials.plastic);
        fanGroup.add(fanFrame);

        const fanBladesGroup = new THREE.Group();
        fanBladesGroup.position.z = 0.05;
        fanGroup.add(fanBladesGroup);

        const hub = new THREE.Mesh(hubGeo, materials.darkSteel);
        hub.rotation.x = Math.PI / 2;
        fanBladesGroup.add(hub);

        for (let i = 0; i < 5; i++) {
            const blade = new THREE.Mesh(bladeGeo, materials.blackPlastic);
            blade.position.y = 0.15;
            const pivot = new THREE.Group();
            pivot.rotation.z = (i / 5) * Math.PI * 2;
            pivot.add(blade);
            fanBladesGroup.add(pivot);
        }

        fanGroups.push(fanBladesGroup);
    }

    const fanTracks = fanGroups.map(fan => {
        return new THREE.NumberKeyframeTrack(`${fan.uuid}.rotation[z]`, [0, 2], [0, Math.PI * 20]);
    });

    const clip = new THREE.AnimationClip('BPU_Operation', 2, [...ledTracks, ...fanTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
