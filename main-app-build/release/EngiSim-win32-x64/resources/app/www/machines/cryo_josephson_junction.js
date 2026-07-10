import { superconductorMaterial, goldMaterial, dielectricMaterial } from '../utils/materials.js';

export function createJosephsonJunctionArray(THREE) {
    const group = new THREE.Group();
    group.name = "JosephsonJunctionArray";
    const animationClips = [];

    // Base substrate
    const substrateGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const substrateMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }); // Fallback if no dielectric
    const substrate = new THREE.Mesh(substrateGeo, dielectricMaterial || substrateMat);
    group.add(substrate);

    // Array of junctions
    const junctionCount = 5;
    const spacing = 1.5;
    const qubits = [];

    for (let i = 0; i < junctionCount; i++) {
        for (let j = 0; j < junctionCount; j++) {
            const junctionGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
            const junctionMat = new THREE.MeshStandardMaterial({ color: 0x8888ff, metalness: 1.0, roughness: 0.2 });
            const junction = new THREE.Mesh(junctionGeo, superconductorMaterial || junctionMat);
            junction.position.set((i - junctionCount/2 + 0.5) * spacing, 0.35, (j - junctionCount/2 + 0.5) * spacing);
            junction.name = `qubit_${i}_${j}`;
            group.add(junction);
            qubits.push(junction);
        }
    }

    // Animation: Qubits pulsing
    const times = [0, 1, 2];
    const tracks = [];
    
    qubits.forEach((q, index) => {
        const offset = index * 0.1;
        const scaleValues = [
            1, 1, 1,
            1.2, 1.5, 1.2,
            1, 1, 1
        ];
        const track = new THREE.VectorKeyframeTrack(`${q.name}.scale`, times, scaleValues);
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('QubitsPulsing', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
