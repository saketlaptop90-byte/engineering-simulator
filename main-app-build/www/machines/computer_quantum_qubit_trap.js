import { metalMaterial, plasticMaterial, ledMaterial, copperMaterial } from '../utils/materials.js';

export function createQuantumQubitTrap(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Trap Base Structure
    const baseGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
    const base = new THREE.Mesh(baseGeo, metalMaterial);
    group.add(base);

    // Surrounding Electrodes
    for (let i = 0; i < 4; i++) {
        const electrodeGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
        const electrode = new THREE.Mesh(electrodeGeo, copperMaterial);
        const angle = (i * Math.PI) / 2;
        electrode.position.set(Math.cos(angle) * 3, 2, Math.sin(angle) * 3);
        electrode.rotation.x = Math.cos(angle) * -Math.PI / 4;
        electrode.rotation.z = Math.sin(angle) * Math.PI / 4;
        group.add(electrode);
    }

    // Glowing Suspended Qubit
    const qubitGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const qubit = new THREE.Mesh(qubitGeo, ledMaterial);
    qubit.position.set(0, 3, 0);
    qubit.name = 'qubit';
    group.add(qubit);

    // Qubit Magnetic/Energy Confinement Rings
    const ringGeo = new THREE.TorusGeometry(1, 0.05, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo, ledMaterial);
    ring1.position.set(0, 3, 0);
    ring1.name = 'ring1';
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ledMaterial);
    ring2.position.set(0, 3, 0);
    ring2.rotation.x = Math.PI / 2;
    ring2.name = 'ring2';
    group.add(ring2);

    // Animation: Pulsating Qubit and Rings
    const times = [0, 0.5, 1];
    const scaleUp = [1.2, 1.2, 1.2];
    const scaleDown = [0.8, 0.8, 0.8];
    const qubitTrack = new THREE.VectorKeyframeTrack('qubit.scale', times, [...scaleDown, ...scaleUp, ...scaleDown]);

    const r1Track = new THREE.VectorKeyframeTrack('ring1.scale', times, [...scaleUp, ...scaleDown, ...scaleUp]);
    const r2Track = new THREE.VectorKeyframeTrack('ring2.scale', times, [...scaleUp, ...scaleDown, ...scaleUp]);
    
    // Animation: Floating Levitation Effect
    const p1 = [0, 2.8, 0];
    const p2 = [0, 3.2, 0];
    const posTrack = new THREE.VectorKeyframeTrack('qubit.position', times, [...p1, ...p2, ...p1]);

    const clip = new THREE.AnimationClip('Quantum_State', 1, [qubitTrack, r1Track, r2Track, posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
