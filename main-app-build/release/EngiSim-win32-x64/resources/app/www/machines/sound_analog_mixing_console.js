import * as materials from '../utils/materials.js';

export function createAnalogMixingConsole(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(10, 1, 8);
    const baseMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Knobs and Faders
    const knobGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const knobMat = materials.shinyMetal || new THREE.MeshStandardMaterial({ color: 0x888888 });
    
    const faderGeo = new THREE.BoxGeometry(0.3, 0.2, 0.6);
    const faderMat = materials.plastic || new THREE.MeshStandardMaterial({ color: 0x111111 });

    const faders = [];
    const knobs = [];

    for (let i = -4; i <= 4; i++) {
        for (let j = -2; j <= 0; j++) {
            const knob = new THREE.Mesh(knobGeo, knobMat);
            knob.position.set(i, 0.5, j);
            group.add(knob);
            knobs.push(knob);
        }
        
        const fader = new THREE.Mesh(faderGeo, faderMat);
        fader.position.set(i, 0.6, 2);
        group.add(fader);
        faders.push(fader);
    }

    // VU Meters
    const vuGeo = new THREE.BoxGeometry(0.8, 0.1, 0.5);
    const vuMat = materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 1, opacity: 0.5 });
    for (let i = -1; i <= 1; i += 2) {
        const vu = new THREE.Mesh(vuGeo, vuMat);
        vu.position.set(i * 3, 0.6, -3);
        group.add(vu);
    }

    // Animation: Move faders and turn knobs
    const times = [0, 1, 2, 3, 4];
    
    faders.forEach((fader, index) => {
        const values = [2, 2 + Math.random() * 1.5 - 0.75, 2 + Math.random() * 1.5 - 0.75, 2 + Math.random() * 1.5 - 0.75, 2];
        const track = new THREE.NumberKeyframeTrack(`${fader.uuid}.position[z]`, times, values);
        const clip = new THREE.AnimationClip(`fader_move_${index}`, 4, [track]);
        animationClips.push(clip);
    });

    knobs.forEach((knob, index) => {
        const values = [0, Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI, 0];
        const track = new THREE.NumberKeyframeTrack(`${knob.uuid}.rotation[y]`, times, values);
        const clip = new THREE.AnimationClip(`knob_turn_${index}`, 4, [track]);
        animationClips.push(clip);
    });

    return { group, animationClips };
}
