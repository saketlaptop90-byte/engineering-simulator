import { materials } from '../utils/materials.js';

export function createMatchlock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Wood stock
    const stockGeo = new THREE.BoxGeometry(0.5, 0.2, 2);
    const stock = new THREE.Mesh(stockGeo, materials.wood);
    group.add(stock);

    // Serpentine (lever)
    const serpentineGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
    const serpentine = new THREE.Mesh(serpentineGeo, materials.brass);
    serpentine.position.set(0, 0.2, 0);
    serpentine.rotation.z = Math.PI / 4;
    group.add(serpentine);

    // Trigger
    const triggerGeo = new THREE.BoxGeometry(0.05, 0.2, 0.05);
    const trigger = new THREE.Mesh(triggerGeo, materials.iron);
    trigger.position.set(0, -0.2, 0);
    group.add(trigger);

    // Animation
    const times = [0, 1, 2];
    const values = [
        Math.PI / 4, 0, 0, // start
        -Math.PI / 4, 0, 0, // pulled
        Math.PI / 4, 0, 0, // release
    ];
    const serpentineTrack = new THREE.NumberKeyframeTrack(`${serpentine.uuid}.rotation[z]`, times, values);
    const clip = new THREE.AnimationClip('MatchlockAction', 2, [serpentineTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
