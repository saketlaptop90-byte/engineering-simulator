import { wood, steel, copper, blackPlastic } from '../utils/materials.js';

export function createMoogSynthesizer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main casing
    const caseGeo = new THREE.BoxGeometry(2.5, 0.3, 1.5);
    const casing = new THREE.Mesh(caseGeo, wood);
    group.add(casing);

    // Control panel (tilted)
    const panelGeo = new THREE.BoxGeometry(2.5, 0.8, 0.1);
    const panel = new THREE.Mesh(panelGeo, blackPlastic);
    panel.position.set(0, 0.4, -0.7);
    panel.rotation.x = -Math.PI / 6;
    group.add(panel);

    // Knobs
    for (let i = 0; i < 8; i++) {
        const knobGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1);
        const knob = new THREE.Mesh(knobGeo, steel);
        const rx = Math.PI / 2 - Math.PI / 6;
        knob.rotation.x = rx;
        knob.position.set(-1 + i*0.25, 0.5, -0.65);
        knob.name = `synth_knob_${i}`;
        group.add(knob);

        // Turn knob around its local Y axis
        const times = [0, 1, 2];
        const values = [0, Math.PI, 0];
        const track = new THREE.NumberKeyframeTrack(`${knob.name}.rotation[y]`, times, values);
        const clip = new THREE.AnimationClip(`turn_knob_${i}`, 2, [track]);
        animationClips.push(clip);
    }

    // Keys
    for (let i = 0; i < 15; i++) {
        const keyGeo = new THREE.BoxGeometry(0.12, 0.1, 0.6);
        const key = new THREE.Mesh(keyGeo, i%2===0 ? wood : blackPlastic);
        key.position.set(-1 + i*0.15, 0.2, 0.2);
        key.name = `synth_key_${i}`;
        group.add(key);

        const times = [0, 0.2, 0.4];
        const values = [0.2, 0.15, 0.2];
        const track = new THREE.NumberKeyframeTrack(`${key.name}.position[y]`, times, values);
        const clip = new THREE.AnimationClip(`press_synth_key_${i}`, 0.4, [track]);
        animationClips.push(clip);
    }

    return { group, animationClips };
}
