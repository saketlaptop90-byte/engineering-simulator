import { glass, titanium, gold } from '../utils/materials.js';

export function createQuantumLogicGate(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Gate array base
    const baseGeo = new THREE.BoxGeometry(8, 0.5, 8);
    const base = new THREE.Mesh(baseGeo, titanium);
    group.add(base);

    // Qubits
    const qubitGeo = new THREE.SphereGeometry(1, 32, 32);
    const q1Mat = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.8, roughness: 0.2 });
    const q2Mat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.2 });
    
    const q1 = new THREE.Mesh(qubitGeo, q1Mat);
    q1.position.set(-2, 2, 0);
    group.add(q1);

    const q2 = new THREE.Mesh(qubitGeo, q2Mat);
    q2.position.set(2, 2, 0);
    group.add(q2);

    // Interaction pulse
    const pulseGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0 });
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    pulse.position.set(0, 2, 0);
    pulse.rotation.z = Math.PI / 2;
    group.add(pulse);

    // Controls
    const controlGeo = new THREE.BoxGeometry(0.5, 4, 0.5);
    const c1 = new THREE.Mesh(controlGeo, gold);
    c1.position.set(-2, -0.5, 0);
    group.add(c1);

    const c2 = new THREE.Mesh(controlGeo, gold);
    c2.position.set(2, -0.5, 0);
    group.add(c2);

    // Animations: Qubit rotation and entanglement pulse
    const times = [0, 1, 2];
    
    // Rotate qubits
    const q1Rot = [0, 0, 0, 0, Math.PI, 0, 0, Math.PI * 2, 0];
    const q2Rot = [0, 0, 0, Math.PI, 0, 0, Math.PI * 2, 0, 0];
    const q1Track = new THREE.VectorKeyframeTrack(`${q1.uuid}.rotation`, times, q1Rot);
    const q2Track = new THREE.VectorKeyframeTrack(`${q2.uuid}.rotation`, times, q2Rot);
    
    animationClips.push(new THREE.AnimationClip('Qubit1_Spin', 2, [q1Track]));
    animationClips.push(new THREE.AnimationClip('Qubit2_Spin', 2, [q2Track]));

    // Pulse opacity
    const pulseTimes = [0, 0.5, 1, 1.5, 2];
    const pulseOpacity = [0, 0.8, 0.2, 0.8, 0];
    const pulseTrack = new THREE.NumberKeyframeTrack(`${pulseMat.uuid}.opacity`, pulseTimes, pulseOpacity);
    animationClips.push(new THREE.AnimationClip('Entanglement_Pulse', 2, [pulseTrack]));

    return { group, animationClips };
}
