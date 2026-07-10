import * as materials from '../utils/materials.js';

export function createPLCRack(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Backplane
    const rackGeo = new THREE.BoxGeometry(6, 3, 0.5);
    const rack = new THREE.Mesh(rackGeo, materials.darkSteel || materials.castIron);
    group.add(rack);

    // Power Supply
    const psuGeo = new THREE.BoxGeometry(1, 2.8, 1.5);
    const psu = new THREE.Mesh(psuGeo, materials.steel);
    psu.position.set(-2.5, 0, 1);
    group.add(psu);

    // CPU Module
    const cpuGeo = new THREE.BoxGeometry(1, 2.8, 1.5);
    const cpu = new THREE.Mesh(cpuGeo, materials.steel);
    cpu.position.set(-1.2, 0, 1);
    group.add(cpu);

    // I/O Modules
    const ioGeo = new THREE.BoxGeometry(0.8, 2.8, 1.5);
    for(let i=0; i<4; i++) {
        const io = new THREE.Mesh(ioGeo, materials.steel);
        io.position.set(0.2 + (i * 1), 0, 1);
        group.add(io);

        // LEDs on I/O
        for(let j=0; j<8; j++) {
            const ledGeo = new THREE.BoxGeometry(0.1, 0.05, 0.1);
            const led = new THREE.Mesh(ledGeo, materials.copper || materials.brass); // Represents glowing
            led.position.set(0, 1.2 - (j * 0.2), 0.76);
            
            // Name led for animation
            led.name = `LED_${i}_${j}`;
            io.add(led);

            // Animate LED scale (blinking effect)
            const times = [0, Math.random() * 2, 2, Math.random() * 2 + 2, 4];
            const scaleTrack = new THREE.VectorKeyframeTrack(
                `${led.name}.scale`,
                times,
                [1,1,1, 0.1,0.1,0.1, 1,1,1, 0.1,0.1,0.1, 1,1,1]
            );
            const clip = new THREE.AnimationClip(`Blink_${i}_${j}`, 4, [scaleTrack]);
            animationClips.push(clip);
        }
    }

    return { group, animationClips };
}
