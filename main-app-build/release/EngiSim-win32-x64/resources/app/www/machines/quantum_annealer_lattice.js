import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createQuantumAnnealerLattice(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    const qubits = [];

    // Grid of qubits
    for(let x=-2; x<=2; x++) {
        for(let z=-2; z<=2; z++) {
            const qubitGeom = new THREE.OctahedronGeometry(0.2);
            const qubit = new THREE.Mesh(qubitGeom, aluminum);
            qubit.position.set(x * 0.8, 0, z * 0.8);
            group.add(qubit);
            qubits.push(qubit);

            // Couplers
            if (x < 2) {
                const hCouplerGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
                const hCoupler = new THREE.Mesh(hCouplerGeom, gold);
                hCoupler.rotation.z = Math.PI / 2;
                hCoupler.position.set(x * 0.8 + 0.4, 0, z * 0.8);
                group.add(hCoupler);
            }
            if (z < 2) {
                const vCouplerGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
                const vCoupler = new THREE.Mesh(vCouplerGeom, gold);
                vCoupler.rotation.x = Math.PI / 2;
                vCoupler.position.set(x * 0.8, 0, z * 0.8 + 0.4);
                group.add(vCoupler);
            }
        }
    }

    // Base plate
    const baseGeom = new THREE.BoxGeometry(4.5, 0.2, 4.5);
    const base = new THREE.Mesh(baseGeom, darkSteel);
    base.position.y = -0.3;
    group.add(base);

    // Animation: Qubits rotating and pulsing
    const tracks = [];
    qubits.forEach((q, idx) => {
        const rotTrackName = q.uuid + '.rotation[y]';
        const times = [0, 2, 4];
        const values = [0, Math.PI, Math.PI * 2];
        const track = new THREE.NumberKeyframeTrack(rotTrackName, times, values);
        tracks.push(track);
    });
    
    const clip = new THREE.AnimationClip('Anneal', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
