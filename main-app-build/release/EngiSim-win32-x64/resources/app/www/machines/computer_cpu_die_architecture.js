import { materials } from '../utils/materials.js';

export function createCPUDieArchitecture(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matSilicon = materials?.silicon || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const matMetal = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.4, metalness: 0.8 });
    const matCache = materials?.gold || new THREE.MeshStandardMaterial({ color: 0xcca829, metalness: 1 });

    const substrateGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const substrate = new THREE.Mesh(substrateGeo, matSilicon);
    group.add(substrate);

    const cores = [];
    const corePositions = [
        [-2.5, 0.35, -2.5], [2.5, 0.35, -2.5],
        [-2.5, 0.35, 2.5], [2.5, 0.35, 2.5],
        [0, 0.35, -2.5], [0, 0.35, 2.5]
    ];

    corePositions.forEach((pos, index) => {
        const coreGeo = new THREE.BoxGeometry(2, 0.2, 2);
        const core = new THREE.Mesh(coreGeo, matMetal.clone());
        core.position.set(pos[0], pos[1], pos[2]);
        core.name = 'core_' + index;
        group.add(core);
        cores.push(core);
    });

    const cacheGeo = new THREE.BoxGeometry(8, 0.2, 1.5);
    const cache = new THREE.Mesh(cacheGeo, matCache);
    cache.position.set(0, 0.35, 0);
    group.add(cache);

    const tracks = [];
    cores.forEach((core, index) => {
        const times = [0, 0.5 + (index * 0.1), 1.0 + (index * 0.1), 2.0];
        const scaleTrack = new THREE.VectorKeyframeTrack(
            `${core.name}.scale`,
            times,
            [1, 1, 1,   1, 1.5, 1,   1, 1, 1,   1, 1, 1]
        );
        const colorTrack = new THREE.ColorKeyframeTrack(
            `${core.name}.material.color`,
            times,
            [0.4, 0.4, 0.4,   1, 0.2, 0.2,   0.4, 0.4, 0.4,   0.4, 0.4, 0.4]
        );
        tracks.push(scaleTrack);
        tracks.push(colorTrack);
    });

    const clip = new THREE.AnimationClip('CPU_Processing', 2.0, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
