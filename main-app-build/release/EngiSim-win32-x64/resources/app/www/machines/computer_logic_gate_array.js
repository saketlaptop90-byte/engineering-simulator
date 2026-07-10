import { materials } from '../utils/materials.js';

export function createLogicGateArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matBase = materials?.silicon || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const matGate0 = materials?.plastic || new THREE.MeshStandardMaterial({ color: 0x882222 });
    
    const base = new THREE.Mesh(new THREE.BoxGeometry(12, 0.5, 12), matBase);
    group.add(base);

    const gates = [];
    const gridSize = 6;
    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            const gateGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
            const gate = new THREE.Mesh(gateGeo, matGate0.clone());
            gate.position.set((x - 2.5) * 1.8, 0.45, (z - 2.5) * 1.8);
            gate.name = `gate_${x}_${z}`;
            group.add(gate);
            gates.push({ mesh: gate, x, z });
        }
    }

    const tracks = [];
    gates.forEach((g, i) => {
        const timeOffset = (g.x + g.z) * 0.2;
        const times = [0, 0.2 + timeOffset, 0.4 + timeOffset, 2.0];
        
        const posTrack = new THREE.VectorKeyframeTrack(
            `${g.mesh.name}.position`,
            times,
            [
                g.mesh.position.x, 0.45, g.mesh.position.z,
                g.mesh.position.x, 0.8, g.mesh.position.z,
                g.mesh.position.x, 0.45, g.mesh.position.z,
                g.mesh.position.x, 0.45, g.mesh.position.z
            ]
        );
        
        const colorTrack = new THREE.ColorKeyframeTrack(
            `${g.mesh.name}.material.color`,
            times,
            [0.5, 0.1, 0.1,  0.1, 0.8, 0.1,  0.5, 0.1, 0.1,  0.5, 0.1, 0.1]
        );
        
        tracks.push(posTrack);
        tracks.push(colorTrack);
    });

    const clip = new THREE.AnimationClip('GateToggle', 2.0, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
