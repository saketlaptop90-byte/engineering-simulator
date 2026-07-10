import { darkSteel, wood, blackPlastic, brass } from '../utils/materials.js';

export function createEnigmaMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base (Wooden box)
    const baseGeo = new THREE.BoxGeometry(4, 1.5, 3);
    const base = new THREE.Mesh(baseGeo, wood);
    base.position.y = 0.75;
    group.add(base);

    // Keyboard (Black plastic keys)
    const keyboardGroup = new THREE.Group();
    keyboardGroup.position.set(0, 1.6, 0.5);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 9; j++) {
            const keyGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
            const key = new THREE.Mesh(keyGeo, blackPlastic);
            key.position.set(j * 0.4 - 1.6, 0, i * 0.4 - 0.4);
            key.name = `key_${i}_${j}`;
            keyboardGroup.add(key);
            
            // Subtle animation for typing
            if ((i + j) % 3 === 0) {
                const track = new THREE.NumberKeyframeTrack(`${key.name}.position[y]`, [0, 0.2, 0.4, 0.6], [0, -0.05, 0, 0]);
                animationClips.push(new THREE.AnimationClip(`TypeKey_${i}_${j}`, 0.6, [track]));
            }
        }
    }
    group.add(keyboardGroup);

    // Rotors (Brass)
    const rotorsGroup = new THREE.Group();
    rotorsGroup.position.set(0, 1.8, -0.8);
    const rotors = [];
    for (let i = 0; i < 3; i++) {
        const rotorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
        const rotor = new THREE.Mesh(rotorGeo, brass);
        rotor.rotation.z = Math.PI / 2;
        rotor.position.x = (i - 1) * 0.4;
        rotor.name = `enigmaRotor${i}`;
        rotors.push(rotor);
        rotorsGroup.add(rotor);
    }
    group.add(rotorsGroup);

    // Plugboard (Dark steel)
    const plugboardGeo = new THREE.BoxGeometry(3.6, 0.8, 0.1);
    const plugboard = new THREE.Mesh(plugboardGeo, darkSteel);
    plugboard.position.set(0, 0.4, 1.5);
    plugboard.rotation.x = -Math.PI / 6;
    group.add(plugboard);

    // Animation for rotors turning
    const times = [0, 1, 2, 3, 4];
    const track0 = new THREE.NumberKeyframeTrack(`enigmaRotor0.rotation[x]`, times, [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI]);
    const track1 = new THREE.NumberKeyframeTrack(`enigmaRotor1.rotation[x]`, [0, 2, 4], [0, Math.PI/4, Math.PI/2]);
    const track2 = new THREE.NumberKeyframeTrack(`enigmaRotor2.rotation[x]`, [0, 4], [0, Math.PI/4]);
    
    const clip = new THREE.AnimationClip('EnigmaOperation', 4, [track0, track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
