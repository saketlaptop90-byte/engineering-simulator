import { getMaterial } from '../utils/materials.js';

export function createArtificialSynapseArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const arrayGroup = new THREE.Group();
    group.add(arrayGroup);

    // Base substrate
    const baseGeo = new THREE.BoxGeometry(5, 0.5, 5);
    const baseMat = getMaterial('metal_dark', THREE) || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -2;
    arrayGroup.add(base);

    // Synaptic structures
    const preGeo = new THREE.CapsuleGeometry(0.3, 1, 8, 16);
    const postGeo = new THREE.CapsuleGeometry(0.4, 0.8, 8, 16);
    const preMat = getMaterial('plastic_white', THREE) || new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const postMat = getMaterial('plastic_gray', THREE) || new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

    // Neurotransmitter signals
    const signals = new THREE.Group();
    signals.name = 'synapse_signals';
    group.add(signals);

    const signalGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const signalMat = getMaterial('glow_blue', THREE) || new THREE.MeshBasicMaterial({ color: 0x00ffff });

    // Create an array of synapses
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const x = i * 1.5;
            const z = j * 1.5;

            // Pre-synaptic terminal
            const pre = new THREE.Mesh(preGeo, preMat);
            pre.position.set(x, 1.5, z);
            arrayGroup.add(pre);

            // Post-synaptic terminal
            const post = new THREE.Mesh(postGeo, postMat);
            post.position.set(x, -1, z);
            arrayGroup.add(post);

            // Particles for signals across the synaptic cleft
            for (let k = 0; k < 5; k++) {
                const signal = new THREE.Mesh(signalGeo, signalMat);
                signal.position.set(
                    x + (Math.random() - 0.5) * 0.4,
                    Math.random() * 1.5,
                    z + (Math.random() - 0.5) * 0.4
                );
                signals.add(signal);
            }
        }
    }

    // Animation: pulsing signals traveling downward
    const times = [0, 1, 2];
    const values = [
        0, 1.5, 0,
        0, 0.2, 0,
        0, 1.5, 0
    ];
    const track = new THREE.VectorKeyframeTrack('synapse_signals.position', times, values);
    const clip = new THREE.AnimationClip('synapse_firing', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
