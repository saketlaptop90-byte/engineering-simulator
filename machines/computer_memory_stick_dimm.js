import { metalMaterial, plasticMaterial, ledMaterial, copperMaterial } from '../utils/materials.js';

export function createMemoryStickDIMM(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // PCB board
    const pcbGeo = new THREE.BoxGeometry(15, 3, 0.2);
    const pcb = new THREE.Mesh(pcbGeo, plasticMaterial);
    group.add(pcb);

    // RAM chips
    const chipGeo = new THREE.BoxGeometry(1.5, 2, 0.3);
    for (let i = -6; i <= 6; i += 2) {
        // Front chips
        const chip = new THREE.Mesh(chipGeo, plasticMaterial);
        chip.position.set(i, 0, 0.1);
        group.add(chip);
        
        // Back chips
        const chipBack = new THREE.Mesh(chipGeo, plasticMaterial);
        chipBack.position.set(i, 0, -0.1);
        group.add(chipBack);
    }

    // Gold contacts
    const contactGeo = new THREE.BoxGeometry(0.2, 0.4, 0.22);
    for (let i = -7; i <= 7; i += 0.4) {
        if (Math.abs(i) < 0.5) continue; // Notch in the middle of DIMM
        const contact = new THREE.Mesh(contactGeo, copperMaterial);
        contact.position.set(i, -1.3, 0);
        group.add(contact);
    }

    // Data flow LEDs
    const tracks = [];
    for (let i = -6; i <= 6; i += 2) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.4), ledMaterial);
        led.position.set(i, 1.2, 0);
        led.name = `ram_led_${i}`;
        group.add(led);

        // Animation track for LEDs
        const scaleTrack = new THREE.VectorKeyframeTrack(
            `${led.name}.scale`,
            [0, (i + 6) / 12, ((i + 6) / 12 + 0.2) % 1 || 1], // Simple sequential flash
            [1, 1, 1, 1.5, 1.5, 1.5, 1, 1, 1]
        );
        tracks.push(scaleTrack);
    }
    
    const clip = new THREE.AnimationClip('RAM_Data_Flow', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
