import { materials } from '../utils/materials.js';

export function createCrossbowTrigger(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Stock
    const stockGeo = new THREE.BoxGeometry(0.4, 0.3, 1.5);
    const stock = new THREE.Mesh(stockGeo, materials.wood);
    group.add(stock);

    // Nut (rotating cylinder holding the string)
    const nutGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4);
    const nut = new THREE.Mesh(nutGeo, materials.iron);
    nut.rotation.z = Math.PI / 2;
    nut.position.set(0, 0.15, -0.2);
    group.add(nut);

    // Tickler (trigger lever)
    const ticklerGeo = new THREE.BoxGeometry(0.05, 0.4, 0.8);
    const tickler = new THREE.Mesh(ticklerGeo, materials.iron);
    tickler.position.set(0, -0.2, 0);
    group.add(tickler);

    // Animation: Tickler pulls up, Nut rotates
    const times = [0, 0.5, 1, 1.5];
    const nutValues = [0, 0, Math.PI / 4, 0];
    const ticklerValues = [0, 0, -Math.PI / 8, 0];
    
    const nutTrack = new THREE.NumberKeyframeTrack(`${nut.uuid}.rotation[x]`, times, nutValues);
    const ticklerTrack = new THREE.NumberKeyframeTrack(`${tickler.uuid}.rotation[x]`, times, ticklerValues);
    const clip = new THREE.AnimationClip('CrossbowAction', 1.5, [nutTrack, ticklerTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
