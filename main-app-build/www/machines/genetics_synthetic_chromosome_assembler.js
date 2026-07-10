import { materials } from '../utils/materials.js';

export function createSyntheticChromosomeAssembler(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const scaffoldMaterial = materials.gold || new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.8,
        roughness: 0.2
    });

    const dnaBlockMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        transmission: 0.8,
        opacity: 1,
        roughness: 0.2
    });

    // Central Assembler Hub
    const hubGeom = new THREE.TorusKnotGeometry(1, 0.3, 64, 8);
    const hub = new THREE.Mesh(hubGeom, scaffoldMaterial);
    group.add(hub);

    // DNA Blocks arriving to assemble
    const blocks = [];
    const blockTracks = [];

    for (let i = 0; i < 5; i++) {
        const block = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.4), dnaBlockMaterial);
        const startX = Math.cos(i * Math.PI * 2 / 5) * 4;
        const startY = Math.sin(i * Math.PI * 2 / 5) * 4;
        block.position.set(startX, startY, 0);
        group.add(block);
        blocks.push(block);

        const endX = 0;
        const endY = (i - 2) * 0.5;

        const posTrack = new THREE.VectorKeyframeTrack(
            block.uuid + '.position',
            [0, 1 + i * 0.5, 2 + i * 0.5, 5],
            [startX, startY, 0, startX, startY, 0, endX, endY, 0, endX, endY, 0]
        );

        const rotTrack = new THREE.QuaternionKeyframeTrack(
            block.uuid + '.quaternion',
            [0, 2 + i * 0.5],
            [...new THREE.Quaternion().toArray(),
             ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray()]
        );
        
        blockTracks.push(posTrack, rotTrack);
    }

    const hubRotTrack = new THREE.QuaternionKeyframeTrack(
        hub.uuid + '.quaternion',
        [0, 5],
        [...new THREE.Quaternion().toArray(),
         ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0)).toArray()]
    );

    const clip = new THREE.AnimationClip('Chromosome_Assembly', 5, [hubRotTrack, ...blockTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
