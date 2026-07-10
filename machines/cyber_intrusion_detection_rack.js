import { darkSteel, gold, aluminum } from '../utils/materials.js';

export function createIntrusionDetectionRack(THREE) {
    const group = new THREE.Group();
    group.name = 'IntrusionDetectionRack';
    const animationClips = [];

    // Main Rack Frame
    const frameGeom = new THREE.BoxGeometry(4, 8, 3);
    const frame = new THREE.Mesh(frameGeom, darkSteel);
    group.add(frame);

    // Neural Net Processing Nodes
    for (let i = 0; i < 5; i++) {
        const nodeGeom = new THREE.BoxGeometry(3.6, 0.8, 2.8);
        const node = new THREE.Mesh(nodeGeom, aluminum);
        node.position.set(0, -3 + i * 1.5, 0);
        node.name = `NeuralNode_${i}`;
        group.add(node);

        // Node Processing Pulse Animation
        const nodeTrack = new THREE.NumberKeyframeTrack(`NeuralNode_${i}.position[z]`, [0, 0.5, 1], [0, 0.2, 0]);
        animationClips.push(new THREE.AnimationClip(`NodePulse_${i}`, 1, [nodeTrack]));
    }

    // Scanning Antenna / Sensor
    const antennaGeom = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const antenna = new THREE.Mesh(antennaGeom, gold);
    antenna.position.set(0, 5, 0);
    antenna.name = 'ScannerAntenna';
    group.add(antenna);

    // Antenna Sweep Animation
    const antennaTrack = new THREE.NumberKeyframeTrack('ScannerAntenna.rotation[y]', [0, 2], [0, Math.PI * 2]);
    animationClips.push(new THREE.AnimationClip('ScanAntenna', 2, [antennaTrack]));

    return { group, animationClips };
}
