import { materials } from '../utils/materials.js';

export function createFlintlock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Lockplate
    const plateGeo = new THREE.BoxGeometry(0.1, 0.5, 1.2);
    const plate = new THREE.Mesh(plateGeo, materials.iron);
    group.add(plate);

    // Hammer (Cock)
    const hammerGeo = new THREE.BoxGeometry(0.05, 0.4, 0.1);
    const hammer = new THREE.Mesh(hammerGeo, materials.darkSteel);
    hammer.position.set(0.1, 0.2, -0.3);
    group.add(hammer);

    // Frizzen
    const frizzenGeo = new THREE.BoxGeometry(0.05, 0.3, 0.1);
    const frizzen = new THREE.Mesh(frizzenGeo, materials.darkSteel);
    frizzen.position.set(0.1, 0.1, 0.2);
    group.add(frizzen);

    // Animation
    const times = [0, 0.5, 1];
    const hammerValues = [Math.PI/6, -Math.PI/4, Math.PI/6];
    const frizzenValues = [0, Math.PI/3, 0];
    
    const hammerTrack = new THREE.NumberKeyframeTrack(`${hammer.uuid}.rotation[x]`, times, hammerValues);
    const frizzenTrack = new THREE.NumberKeyframeTrack(`${frizzen.uuid}.rotation[x]`, times, frizzenValues);
    const clip = new THREE.AnimationClip('FlintlockAction', 1, [hammerTrack, frizzenTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
