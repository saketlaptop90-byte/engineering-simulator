import { steel, glass, plastic, blueAccent, darkSteel } from '../utils/materials.js';

export function createFiberPatchPanel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.1, 0.2), darkSteel);
    group.add(chassis);

    // Front plate
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.02), steel);
    plate.position.set(0, 0, 0.1);
    group.add(plate);

    // Ports and Fibers
    const numPorts = 24;
    for (let i = 0; i < numPorts; i++) {
        const xPos = -0.22 + (i % 12) * 0.04;
        const yPos = i < 12 ? 0.02 : -0.02;

        const port = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 0.02), plastic);
        port.position.set(xPos, yPos, 0.11);
        group.add(port);

        // Fiber cable plug
        const plugGroup = new THREE.Group();
        plugGroup.position.set(xPos, yPos, 0.13);
        plugGroup.name = `FiberPlug_${i}`;

        const plug = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.04), blueAccent);
        plugGroup.add(plug);

        const wireGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.2);
        const wire = new THREE.Mesh(wireGeo, glass);
        wire.rotation.x = Math.PI / 2;
        wire.position.set(0, 0, 0.1);
        plugGroup.add(wire);

        group.add(plugGroup);

        // Animate one of the plugs wiggling or unplugging
        if (i === 5) {
            const times = [0, 1, 2, 3, 4];
            const values = [
                xPos, yPos, 0.13,
                xPos, yPos, 0.18,
                xPos, yPos, 0.18,
                xPos, yPos, 0.13,
                xPos, yPos, 0.13
            ];
            const track = new THREE.VectorKeyframeTrack(`${plugGroup.name}.position`, times, values);
            animationClips.push(new THREE.AnimationClip('UnplugFiber', 4, [track]));
        }
    }

    return { group, animationClips };
}
