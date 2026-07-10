import { getMaterial } from '../utils/materials.js';

export function createSpikingNeuralNetworkCore(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Core casing
    const caseGeo = new THREE.BoxGeometry(4, 4, 4);
    const caseMat = getMaterial('metal_silver', THREE) || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true, transparent: true, opacity: 0.2 });
    const casing = new THREE.Mesh(caseGeo, caseMat);
    group.add(casing);

    // Network neurons
    const neurons = new THREE.Group();
    neurons.name = 'core_neurons';
    const neuronGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const neuronMat = getMaterial('glow_orange', THREE) || new THREE.MeshBasicMaterial({ color: 0xff8800 });
    
    // Create a 3D grid of neurons
    for (let i = 0; i < 27; i++) {
        const x = (i % 3) - 1;
        const y = Math.floor((i % 9) / 3) - 1;
        const z = Math.floor(i / 9) - 1;
        const neuron = new THREE.Mesh(neuronGeo, neuronMat);
        neuron.position.set(x * 1.2, y * 1.2, z * 1.2);
        neurons.add(neuron);
    }
    group.add(neurons);

    // Animation: Spiking activity (pulsing scale of neurons)
    const times = [0, 0.5, 1, 1.5, 2];
    const values = [
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1,
        0.5, 0.5, 0.5,
        1, 1, 1
    ];
    const track = new THREE.VectorKeyframeTrack('core_neurons.scale', times, values);
    const clip = new THREE.AnimationClip('spike', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
