import { aluminum, copper, darkSteel } from '../utils/materials.js';

export function createPostQuantumHSM(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Rackmount HSM Enclosure
    const hsmGeo = new THREE.BoxGeometry(5, 1.5, 4);
    const hsm = new THREE.Mesh(hsmGeo, darkSteel);
    group.add(hsm);

    // Secure Front Panel
    const frontGeo = new THREE.BoxGeometry(5.1, 1.4, 0.2);
    const front = new THREE.Mesh(frontGeo, aluminum);
    front.position.set(0, 0, 1.95);
    group.add(front);

    // Thermal Dissipation Fins
    for(let i = -2; i <= 2; i += 0.2) {
        const finGeo = new THREE.BoxGeometry(0.05, 0.2, 3.5);
        const fin = new THREE.Mesh(finGeo, copper);
        fin.position.set(i, 0.85, 0);
        group.add(fin);
    }
    
    // Cryptographic Data Processing Lights
    const tracks = [];
    const patterns = [
        [1, 0, 1, 0, 1, 1],
        [0, 1, 0, 1, 0, 0],
        [1, 1, 0, 0, 1, 0],
        [0, 0, 1, 1, 0, 1],
        [1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1],
        [1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1]
    ];

    for(let i = 0; i < 8; i++) {
        const lightGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
        const lightMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.rotation.x = Math.PI / 2;
        light.position.set(-1.5 + i * 0.4, 0, 2.05);
        light.name = `cryptoLight${i}`;
        group.add(light);
        
        // Activity blinking sequence based on pre-defined patterns
        const times = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
        const colors = [];
        for(let t = 0; t < times.length; t++) {
            const on = patterns[i][t] === 1;
            colors.push(0, on ? 1 : 0, 0);
        }
        tracks.push(new THREE.ColorKeyframeTrack(`cryptoLight${i}.material.emissive`, times, colors));
    }

    // Single looping clip for all data processing LEDs
    const clip = new THREE.AnimationClip('HSM_Cryptographic_Processing', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
