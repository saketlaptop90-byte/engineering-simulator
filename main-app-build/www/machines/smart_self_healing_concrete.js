import { composites, polymers } from '../utils/materials.js';

export function createSelfHealingConcrete(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Concrete block with a crack
    const blockGeo = new THREE.BoxGeometry(4, 4, 4);
    const blockMat = composites ? composites.concrete : new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.9 });
    const block = new THREE.Mesh(blockGeo, blockMat);
    group.add(block);

    // Crack (a mesh that shrinks to simulate healing)
    const crackGeo = new THREE.BoxGeometry(0.2, 3, 4.1);
    const crackMat = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Dark crack
    const crack = new THREE.Mesh(crackGeo, crackMat);
    crack.position.set(0, 0, 0);
    crack.name = 'crack';
    group.add(crack);

    // Healing agents (small spheres that expand into the crack)
    const agentGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const agentMat = polymers ? polymers.epoxy : new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
    const agent = new THREE.Mesh(agentGeo, agentMat);
    agent.scale.set(0.1, 0.1, 0.1);
    agent.position.set(0, 0, 0);
    agent.name = 'healingAgent';
    group.add(agent);

    // Animation: Crack shrinks, healing agent expands and changes color to match concrete
    const crackScaleTrack = new THREE.VectorKeyframeTrack(
        'crack.scale',
        [0, 2, 4],
        [1, 1, 1,  0.1, 1, 1,  0, 1, 1]
    );
    const agentScaleTrack = new THREE.VectorKeyframeTrack(
        'healingAgent.scale',
        [0, 2, 4],
        [0.1, 0.1, 0.1,  0.2, 3, 4.1,  0.2, 3, 4.1]
    );
    const agentColorTrack = new THREE.ColorKeyframeTrack(
        'healingAgent.material.color',
        [0, 2, 4],
        [0, 1, 0,  0.5, 0.8, 0.5,  0.6, 0.6, 0.6] // Green to concrete color
    );

    const clip = new THREE.AnimationClip('HealCrack', 4, [crackScaleTrack, agentScaleTrack, agentColorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
