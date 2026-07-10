import { metalMaterial, plasticMaterial, ledMaterial, copperMaterial } from '../utils/materials.js';

export function createMicroprocessorALU(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base chip
    const chipGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const chip = new THREE.Mesh(chipGeo, plasticMaterial);
    group.add(chip);

    // ALU logic units and LEDs
    const ledGeo = new THREE.BoxGeometry(0.4, 0.2, 0.4);
    const tracks = [];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 === 0) {
                const led = new THREE.Mesh(ledGeo, ledMaterial);
                led.position.set(i - 3.5, 0.35, j - 3.5);
                led.name = `alu_led_${i}_${j}`;
                group.add(led);

                // Create a track for each LED to flash
                const times = [0, 0.5, 1, 1.5, 2];
                const onScale = [1, 1, 1];
                const offScale = [0.1, 0.1, 0.1];
                const values = [];
                for(let k=0; k<5; k++) {
                    const isOn = Math.random() > 0.5;
                    values.push(...(isOn ? onScale : offScale));
                }
                const track = new THREE.VectorKeyframeTrack(`${led.name}.scale`, times, values);
                tracks.push(track);
            }
        }
    }

    const clip = new THREE.AnimationClip('ALU_Process', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
