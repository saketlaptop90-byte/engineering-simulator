import { wood, steel, copper, blackPlastic } from '../utils/materials.js';

export function createPipeOrgan(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Console base
    const baseGeo = new THREE.BoxGeometry(3, 1, 1.5);
    const base = new THREE.Mesh(baseGeo, wood);
    group.add(base);

    // Pipes
    for (let i = 0; i < 15; i++) {
        const height = 1 + Math.random() * 3;
        const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, height, 16);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        pipe.position.set(-2 + i*0.3, 0.5 + height/2, -1);
        group.add(pipe);
    }

    // Two tiers of keys
    const keysGroup = new THREE.Group();
    for(let tier = 0; tier < 2; tier++) {
        for (let i = 0; i < 20; i++) {
            const keyGeo = new THREE.BoxGeometry(0.08, 0.05, 0.4);
            const key = new THREE.Mesh(keyGeo, i%2===0 ? blackPlastic : wood);
            const tierOffsetY = tier * 0.1;
            const tierOffsetZ = tier * -0.2;
            key.position.set(-1.5 + i*0.15, 0.6 + tierOffsetY, 0.5 + tierOffsetZ);
            key.name = `organ_key_t${tier}_${i}`;
            keysGroup.add(key);

            const times = [0, 0.3, 0.6];
            const yStart = 0.6 + tierOffsetY;
            const values = [yStart, yStart - 0.05, yStart];
            const track = new THREE.NumberKeyframeTrack(`${key.name}.position[y]`, times, values);
            const clip = new THREE.AnimationClip(`press_organ_key_t${tier}_${i}`, 0.6, [track]);
            animationClips.push(clip);
        }
    }
    group.add(keysGroup);

    return { group, animationClips };
}
