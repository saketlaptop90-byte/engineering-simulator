import { materials } from '../utils/materials.js';

export function createBlastFurnaceTaphole(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Furnace Body
    const furnaceGeometry = new THREE.CylinderGeometry(4, 5, 10, 32);
    const furnace = new THREE.Mesh(furnaceGeometry, materials.steel);
    furnace.position.y = 5;
    group.add(furnace);

    // Taphole
    const tapholeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    tapholeGeometry.rotateZ(Math.PI / 2);
    const taphole = new THREE.Mesh(tapholeGeometry, materials.darkMetal || materials.steel);
    taphole.position.set(5, 1, 0);
    group.add(taphole);

    // Molten Metal Stream
    const streamGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const stream = new THREE.Mesh(streamGeometry, materials.moltenMetal || new THREE.MeshBasicMaterial({ color: 0xff4500 }));
    stream.position.set(6, -1.5, 0);
    group.add(stream);

    // Animation: Stream flowing (scaling Y)
    const times = [0, 1, 2];
    const values = [1, 1.2, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack(`${stream.uuid}.scale`, times, [
        1, values[0], 1,
        1, values[1], 1,
        1, values[2], 1
    ]);
    
    const clip = new THREE.AnimationClip('Pouring', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
