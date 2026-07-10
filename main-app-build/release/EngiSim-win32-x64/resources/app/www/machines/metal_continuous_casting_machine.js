import { materials } from '../utils/materials.js';

export function createContinuousCastingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tundish
    const tundishGeometry = new THREE.BoxGeometry(4, 2, 2);
    const tundish = new THREE.Mesh(tundishGeometry, materials.steel);
    tundish.position.set(0, 10, 0);
    group.add(tundish);

    // Mold
    const moldGeometry = new THREE.BoxGeometry(1, 4, 1);
    const mold = new THREE.Mesh(moldGeometry, materials.copper || materials.steel);
    mold.position.set(0, 6, 0);
    group.add(mold);

    // Solidifying Slab
    const slabGeometry = new THREE.BoxGeometry(0.8, 10, 0.8);
    const slab = new THREE.Mesh(slabGeometry, materials.hotMetal || new THREE.MeshStandardMaterial({ color: 0xffaaaa }));
    slab.position.set(0, -1, 0);
    group.add(slab);

    // Animation: Slab moving down
    const times = [0, 2];
    const values = [0, -1, 0, 0, -5, 0];
    const positionTrack = new THREE.VectorKeyframeTrack(`${slab.uuid}.position`, times, values);
    
    const clip = new THREE.AnimationClip('Casting', 2, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
