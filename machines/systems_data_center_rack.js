import { steel, darkSteel, blackPlastic, blueAccent, greenAccent, redAccent } from '../utils/materials.js';

export function createDataCenterRack(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frame
    const frameBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.1, 1.05), darkSteel);
    frameBase.position.y = 0.05;
    group.add(frameBase);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 1.05), darkSteel);
    frameTop.position.y = 2.175;
    group.add(frameTop);

    // Pillars
    for(let x of [-0.3, 0.3]) {
        for(let z of [-0.5, 0.5]) {
            const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.075, 0.05), steel);
            pillar.position.set(x, 1.1125, z);
            group.add(pillar);
        }
    }

    // Servers
    for (let i = 0; i < 40; i++) {
        // 40U
        const yPos = 0.15 + i * 0.05;
        const serverGroup = new THREE.Group();
        serverGroup.position.set(0, yPos, 0);

        const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.045, 0.9), blackPlastic);
        serverGroup.add(chassis);

        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.02), steel);
        handle.position.set(0.25, 0, 0.46);
        serverGroup.add(handle);

        const handle2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.02), steel);
        handle2.position.set(-0.25, 0, 0.46);
        serverGroup.add(handle2);

        // LED
        const isError = Math.random() > 0.95;
        const ledGeo = new THREE.BoxGeometry(0.01, 0.01, 0.01);
        const led = new THREE.Mesh(ledGeo, isError ? redAccent : greenAccent);
        led.position.set(-0.15, 0, 0.455);
        serverGroup.add(led);

        // Name to animate one or two
        serverGroup.name = `Server_U${i}`;
        group.add(serverGroup);

        if (i === 20) {
            const times = [0, 1, 3, 4, 6];
            const values = [
                0, yPos, 0,
                0, yPos, 0.6,
                0, yPos, 0.6,
                0, yPos, 0,
                0, yPos, 0
            ];
            const track = new THREE.VectorKeyframeTrack(`${serverGroup.name}.position`, times, values);
            animationClips.push(new THREE.AnimationClip(`Slide_U${i}`, 6, [track]));
        }
    }

    return { group, animationClips };
}
