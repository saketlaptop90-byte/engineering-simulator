import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createQubitChip(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Chip substrate
    const substrateGeo = new THREE.BoxGeometry(4, 0.1, 4);
    const substrateMesh = new THREE.Mesh(substrateGeo, darkSteel);
    group.add(substrateMesh);

    // Superconducting traces and resonators
    const traceGeo = new THREE.BoxGeometry(3, 0.12, 0.1);
    const trace1 = new THREE.Mesh(traceGeo, aluminum);
    trace1.position.set(0, 0, -1);
    group.add(trace1);
    
    const trace2 = new THREE.Mesh(traceGeo, aluminum);
    trace2.position.set(0, 0, 1);
    group.add(trace2);

    // Qubits (transmons)
    const qubitGeo = new THREE.BoxGeometry(0.5, 0.15, 0.5);
    const q1 = new THREE.Mesh(qubitGeo, gold);
    q1.position.set(-1, 0, 0);
    q1.name = 'Qubit1';
    group.add(q1);

    const q2 = new THREE.Mesh(qubitGeo, gold);
    q2.position.set(1, 0, 0);
    q2.name = 'Qubit2';
    group.add(q2);

    // Animation: Qubit spinning / pulsating
    const qTimes = [0, 0.5, 1];
    const qValues1 = [0, Math.PI, Math.PI * 2];
    const qRotTrack1 = new THREE.NumberKeyframeTrack(`${q1.name}.rotation[y]`, qTimes, qValues1);
    const qRotTrack2 = new THREE.NumberKeyframeTrack(`${q2.name}.rotation[y]`, qTimes, qValues1);
    
    const clip = new THREE.AnimationClip('QubitSpin', 1, [qRotTrack1, qRotTrack2]);
    animationClips.push(clip);

    return { group, animationClips };
}
