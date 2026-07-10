import { wood, steel, copper, blackPlastic } from '../utils/materials.js';

export function createGrandPiano(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    // Body
    const bodyGeo = new THREE.BoxGeometry(2, 0.5, 3);
    const body = new THREE.Mesh(bodyGeo, wood);
    group.add(body);
    
    // Keys
    const keysGroup = new THREE.Group();
    for(let i=0; i<10; i++) {
        const keyGeo = new THREE.BoxGeometry(0.15, 0.1, 0.8);
        const key = new THREE.Mesh(keyGeo, i%2===0 ? wood : blackPlastic);
        key.name = `piano_key_${i}`;
        key.position.set(-0.9 + i*0.2, 0.3, 1.1);
        keysGroup.add(key);
        
        const times = [0, 0.5, 1];
        const values = [0.3, 0.25, 0.3]; // position.y values
        const track = new THREE.NumberKeyframeTrack(`${key.name}.position[y]`, times, values);
        const clip = new THREE.AnimationClip(`press_key_${i}`, 1, [track]);
        animationClips.push(clip);
    }
    group.add(keysGroup);
    
    // Lid
    const lidGeo = new THREE.BoxGeometry(2, 0.05, 1.5);
    const lid = new THREE.Mesh(lidGeo, wood);
    lid.position.set(0, 0.6, -0.75);
    lid.rotation.x = -Math.PI / 6;
    group.add(lid);
    
    return { group, animationClips };
}
